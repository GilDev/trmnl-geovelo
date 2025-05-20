import { Hono } from "hono";
import { trimTrailingSlash } from 'hono/trailing-slash'
import { format, subDays, startOfWeek, lastDayOfWeek, max } from "date-fns";
import { Layout, LoginForm, Alert } from "./layout";
import {
  getMainMarkup,
  getHalfHorizontalMarkup,
  getHalfVerticalMarkup,
  getQuadrantMarkup,
  getErrorMarkup,
} from "./markup";
import { previewRoutes } from "./preview";

type Bindings = {
  USER_CONFIGURATION: KVNamespace;
};

const app = new Hono<{ Bindings: Bindings }>({ strict: false });
app.use(trimTrailingSlash())

const PASSWORD_PLACEHOLDER = "     ";

async function getUserIdFromRequest(c: Hono.Context) {
  return (await c.req.text()).split("=")[1];
}

async function connectToGeovelo(username: string, password: string) {
  return await fetch(
    "https://backend.geovelo.fr/api/v1/authentication/geovelo",
    {
      method: "POST",
      headers: {
        Source: "website",
        "Api-Key": "0f8c781a-b4b4-4d19-b931-1e82f22e769f",
        Authentication: btoa(`${username};${password}`),
      },
    }
  );
}

app.get("/install", async (c) => {
  if (!c.env.TRMNL_CLIENT_ID || !c.env.TRMNL_CLIENT_SECRET) {
    return c.text("TRMNL_CLIENT_ID or TRMNL_CLIENT_SECRET is missing", 500);
  }

  let fetch_access_token = await fetch("https://usetrmnl.com/oauth/token", {
    method: "POST",
    body: JSON.stringify({
      code: c.req.query("code"),
      client_id: c.env.TRMNL_CLIENT_ID,
      client_secret: c.env.TRMNL_CLIENT_SECRET,
      grant_type: "authorization_code",
    }),
  });

  let access_token = await fetch_access_token.json().access_token;

  if (!access_token) {
    return c.text("Could not communicate with TRMNL's servers", 500);
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
  let user_uuid = await getUserIdFromRequest(c);
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

  let today = new Date();
  let today_formatted = format(today, "dd-MM-yyyy");
  let start_formatted = format(
    startOfWeek(today, { weekStartsOn: 1 }),
    "dd-MM-yyyy"
  );
  let end_formatted = format(
    lastDayOfWeek(today, { weekStartsOn: 1 }),
    "dd-MM-yyyy"
  );

  let traces = await fetch(
    `https://backend.geovelo.fr/api/v6/users/${user_id}/traces?period=custom&date_start=${start_formatted}&date_end=${end_formatted}&ordering=-start_datetime&page=1&page_size=50`,
    {
      method: "GET",
      headers: {
        Source: "website",
        "Api-Key": "0f8c781a-b4b4-4d19-b931-1e82f22e769f",
        Authorization: token,
      },
    }
  );

  let data = await traces.json();

  // Calculate useful values
  let total_distance = 0;
  let total_duration = 0;
  let total_average_speed = 0;
  data.results.forEach((trace: any) => {
    total_distance += trace.distance;
    total_duration += trace.duration;
    total_average_speed += trace.average_speed;
  });

  let sanitized_data = {
    first_name: "John",
    count: data.count,
    average_speed: total_average_speed / data.count,
    average_duration: total_duration / data.count,
    average_distance: total_distance / data.count,
    longest_duration: max(data.results.map((trace: any) => trace.duration)),
    longest_distance: max(data.results.map((trace: any) => trace.distance)),
    last_trips: data.results.slice(-3),
  }

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
