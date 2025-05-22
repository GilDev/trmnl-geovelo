import { Hono } from "hono";
import { trimTrailingSlash } from "hono/trailing-slash";
import { format, subDays } from "date-fns";
import { Layout, LoginForm, Alert } from "./layout";
import {
  getMainMarkup,
  getHalfHorizontalMarkup,
  getHalfVerticalMarkup,
  getQuadrantMarkup,
  getErrorMarkup,
} from "./markup";
import { previewRoutes } from "./preview";
import {
  connectToGeovelo,
  fetchUserTraces,
  processTracesData,
} from "./geovelo";

type Bindings = {
  USER_CONFIGURATION: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>({ strict: false });
app.use(trimTrailingSlash());

const PASSWORD_PLACEHOLDER = "     ";

async function getUserIdFromRequest(c: Hono.Context) {
  return (await c.req.text()).split("=")[1];
}

app.get("/install", async (c) => {
  if (!c.env.TRMNL_CLIENT_ID || !c.env.TRMNL_CLIENT_SECRET) {
    return c.text("TRMNL_CLIENT_ID or TRMNL_CLIENT_SECRET is missing", 500);
  }

  let fetch_access_token = await fetch("https://usetrmnl.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      code: c.req.query("code"),
      client_id: c.env.TRMNL_CLIENT_ID,
      client_secret: c.env.TRMNL_CLIENT_SECRET,
      grant_type: "authorization_code",
    }),
  });

  let response = await fetch_access_token.json()
  let access_token = response.access_token;

  if (!access_token) {
    return c.text("Could not communicate with TRMNL's servers: " + JSON.stringify(response), 500);
  }

  return c.redirect(c.req.query("installation_callback_url"));
});

app.post("/success", async (c) => {
  let body = await c.req.json();

  // First time creating the KV for this UUID
  await c.env.USER_CONFIGURATION.put(
    body.user.uuid,
    JSON.stringify({
      plugin_setting_id: body.user.plugin_setting_id,
    })
  );

  return c.text("Installation OK");
});

app.get("/manage", async (c) => {
  let user_uuid = c.req.query("uuid");
  let user_configuration = JSON.parse(
    await c.env.USER_CONFIGURATION.get(user_uuid)
  );

  if (!user_configuration) {
    return c.text("Access denied", 500);
  }

  let error = "";
  let success = "";
  if (
    user_configuration.username &&
    user_configuration.password &&
    user_configuration.connected == null
  ) {
    // Try connecting to Geovelo
    let auth = await connectToGeovelo(
      user_configuration.username,
      user_configuration.password
    );

    if (auth.status == 429) {
      error = "Too many requests, please try again later.";
    } else {
      if (auth.status == 200) {
        user_configuration.connected = true;
        success = "Connected to Geovelo successfully!";
      } else {
        user_configuration.connected = false;
        delete user_configuration.password; // No need to keep this as it is incorrect
        error = "Could not connect to Geovelo: invalid username or password.";
      }
      await c.env.USER_CONFIGURATION.put(
        user_uuid,
        JSON.stringify(user_configuration)
      );
    }
  }

  return c.html(
    Layout({
      children: LoginForm({
        username: user_configuration.username,
        password: user_configuration.password ? PASSWORD_PLACEHOLDER : "",
      }),
      alert: [
        error && Alert({ type: "error", message: error }),
        success && Alert({ type: "success", message: success }),
      ],
      user_configuration: user_configuration,
    })
  );
});

app.post("/manage", async (c) => {
  const body = await c.req.formData();
  let user_uuid = c.req.query("uuid");
  let user_configuration = JSON.parse(
    await c.env.USER_CONFIGURATION.get(user_uuid)
  );

  let username = body.get("username");
  let password = body.get("password");

  if (!user_configuration || !username || !password) {
    return c.text("Username or password is missing", 500);
  }

  // If it's the placeholder, we keep the old saved password
  password =
    password === PASSWORD_PLACEHOLDER ? user_configuration.password : password;

  // If the username or password has changed, we need to retest the connection
  if (
    username != user_configuration.username ||
    password != user_configuration.password
  ) {
    user_configuration.username = username;
    user_configuration.password = password;
    user_configuration.connected = null;
    await c.env.USER_CONFIGURATION.put(
      user_uuid,
      JSON.stringify(user_configuration)
    );
  }

  return c.redirect(`/manage?uuid=${user_uuid}`);
});

app.post("/markup", async (c) => {
  let user_uuid = c.req.query("user_uuid");
  let trmnl = c.req.query("trmnl");
  trmnl = JSON.parse(trmnl ?? '{}');
  let user_configuration = JSON.parse(
    await c.env.USER_CONFIGURATION.get(user_uuid)
  );

  if (!user_configuration || !user_configuration.connected) {
    const error_layout = getErrorMarkup();
    return c.json({
      markup: error_layout,
      markup_half_horizontal: error_layout,
      markup_half_vertical: error_layout,
      markup_quadrant: error_layout,
    });
  }

  let auth = await connectToGeovelo(
    user_configuration.username,
    user_configuration.password
  );
  let user_id = auth.headers.get("userid");
  let token = auth.headers.get("authorization");

  let data = await fetchUserTraces(user_id, token);
  let sanitized_data = processTracesData(data);
  sanitized_data.trmnl = trmnl;

  return c.json({
    markup: getMainMarkup(sanitized_data),
    markup_half_horizontal: getHalfHorizontalMarkup(sanitized_data),
    markup_half_vertical: getHalfVerticalMarkup(sanitized_data),
    markup_quadrant: getQuadrantMarkup(sanitized_data),
  });
});

// Register preview routes
app.route("/preview", previewRoutes);

app.post("/uninstall", async (c) => {
  let body = await c.req.json();
  let user_uuid = body.user_uuid;
  await c.env.USER_CONFIGURATION.delete(user_uuid);
  return c.text("Uninstallation OK");
});

export default app;
