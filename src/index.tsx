import { Hono } from 'hono'
import { html } from 'hono/html'
import { FC } from 'hono/jsx';
import { format, subDays, startOfWeek, lastDayOfWeek } from "date-fns";

type Bindings = {
  USER_CONFIGURATION: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

const PASSWORD_PLACEHOLDER = "     ";

const Layout: FC = (props) => {
  return (
    <html lang="en">
      <body>{props.children}</body>
    </html>
  )
}

const Top: FC<{ messages: string[] }> = (props: {
  messages: string[]
}) => {
  return (
    <Layout>
      <h1>Hello Hono!</h1>
      <ul>
        {props.messages.map((message) => {
          return <li>{message}!!</li>
        })}
      </ul>
    </Layout>
  )
}

const LoginForm = (props) => {
  return (
    <form method="POST"> {/* Or whatever your action URL is */}
      <h1>Login</h1>
      <div>
        <label htmlFor="username">Geovelo username (email):</label>
        <input
          type="text"
          id="username"
          name="username"
          value={props.username || ''} // Use prop or fallback to empty string
          required
        />
      </div>
      <div>
        <label htmlFor="password">Geovelo password:</label>
        <input
          type="password"
          id="password"
          name="password"
          value={props.password || ''} // Use prop or fallback to empty string
          required
        />
      </div>
      <div>
        <button type="submit">Log In</button>
      </div>
    </form>
  )
}

async function getUserIdFromRequest(c: Hono.Context) {
  return (await c.req.text()).split("=")[1];
}

async function connectToGeovelo(username: string, password: string) {
  return await fetch("https://backend.geovelo.fr/api/v1/authentication/geovelo", {
    method: "POST",
    headers: {
      "Source": "website",
      "Api-Key": "0f8c781a-b4b4-4d19-b931-1e82f22e769f",
      "Authentication": btoa(`${username};${password}`),
    }
  });
}

app.get('/install', async (c) => {
  if (!c.env.TRMNL_CLIENT_ID || !c.env.TRMNL_CLIENT_SECRET) {
    return c.text("TRMNL_CLIENT_ID or TRMNL_CLIENT_SECRET is missing", 500);
  }

  let fetch_access_token = await fetch("https://usetrmnl.com/oauth/token", {
    method: "POST",
    body: JSON.stringify({
      code: c.req.query('code'),
      client_id: c.env.TRMNL_CLIENT_ID,
      client_secret: c.env.TRMNL_CLIENT_SECRET,
      grant_type: 'authorization_code'
    }),
  });

  let access_token = await fetch_access_token.json().access_token;

  if (!access_token) {
    return c.text("Could not communicate with TRMNL's servers", 500);
  }

  return c.redirect(c.req.query('installation_callback_url'));
})

app.post('/success', async (c) => {
  let body = await c.req.json();

  // First time creating the KV for this UUID
  await c.env.USER_CONFIGURATION.put(body.user.uuid, JSON.stringify(
    {
      "plugin_setting_id": body.user.plugin_setting_id,
    }
  ));

  return c.text("Installation OK");
})

app.get('/manage', async (c) => {
  let user_uuid = c.req.query('uuid');
  let user_configuration = JSON.parse(await c.env.USER_CONFIGURATION.get(user_uuid));

  if (!user_configuration) {
    return c.text("Access denied", 500);
  }

  let error = "";
  if (user_configuration.username && user_configuration.password && user_configuration.connected == null) {
    // Try connecting to Geovelo
    let auth = await connectToGeovelo(user_configuration.username, user_configuration.password);

    if (auth.status == 429) {
      error = "Too many requests, please try again later.";
    } else {
      if (auth.status == 200) {
        user_configuration.connected = true;
      } else {
        user_configuration.connected = false;
        delete user_configuration.password; // No need to keep this as it is incorrect
        error = "Could not connect to Geovelo: invalid username or password.";
      }
      await c.env.USER_CONFIGURATION.put(user_uuid, JSON.stringify(user_configuration));
    }
  }

  return c.html(
    <html>
      <head>
        <title>Login Page</title>
        <style>{`
          body { font-family: sans-serif; display: flex; justify-content: center; align-items: center; min-height: 90vh; background-color: #f4f4f4; }
          form { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
          h1 { text-align: center; color: #333; }
          div { margin-bottom: 15px; }
          label { display: block; margin-bottom: 5px; color: #555; }
          input[type="text"], input[type="password"] { width: 100%; padding: 8px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; }
          button { background-color:rgb(11, 11, 12); color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; width: 100%; }
          button:hover { background-color: #0056b3; }
        `}</style>
      </head>
      <body>
        {error}
        {user_configuration.connected !== null && (
          <p style={{ textAlign: 'center', color: user_configuration.connected ? 'green' : 'red' }}>
            {user_configuration.connected ? 'Connected' : 'Not connected. Please log in.'}
          </p>
        )}
        <LoginForm username={user_configuration.username} password={user_configuration.password ? PASSWORD_PLACEHOLDER : ""} />
        {user_configuration.plugin_setting_id && (
          <a href={`https://usetrmnl.com/plugin_settings/${user_configuration.plugin_setting_id}/edit?force_refresh=true`} class="back-button">Back to TRMNL</a>
        )}
      </body>
    </html>
  );
})

app.post('/manage', async (c) => {
  const body = await c.req.formData();
  let user_uuid = c.req.query('uuid');
  let user_configuration = JSON.parse(await c.env.USER_CONFIGURATION.get(user_uuid));

  let username = body.get("username");
  let password = body.get("password");

  if (!user_configuration || !username || !password) {
    return c.text("Username or password is missing", 500);
  }

  // If it's the placeholder, we keep the old saved password
  password = (password === PASSWORD_PLACEHOLDER) ? user_configuration.password : password;

  // If the username or password has changed, we need to retest the connection
  if (username != user_configuration.username || password != user_configuration.password) {
    user_configuration.username = username;
    user_configuration.password = password;
    user_configuration.connected = null;
    await c.env.USER_CONFIGURATION.put(user_uuid, JSON.stringify(user_configuration));
  }

  return c.redirect(`/manage?uuid=${user_uuid}`);
})

app.post('/markup', async (c) => {
  let user_uuid = await getUserIdFromRequest(c);
  let user_configuration = JSON.parse(await c.env.USER_CONFIGURATION.get(user_uuid));

  if (!user_configuration || !user_configuration.connected) {
    const error_layout = html`
    <div class="layout">
      <div class="columns">
        <div class="column">
          <div class="markdown gap--large">
            <span class="title">Error</span>
            <div class="content-element content clamp--20" data-content-max-height="320">
              You are not connected, please check the configuration of the plugin.
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="title_bar">
      <img class="image" src="https://trmnl-public.s3.us-east-2.amazonaws.com/ji1q5vcii6v10zx86zqacf43rhjk">
      <span class="title">Geovelo</span>
    </div>`;
    return c.json({
      markup: error_layout,
      markup_half_horizontal: error_layout,
      markup_half_vertical: error_layout,
      markup_quadrant: error_layout
    });
  }

  let auth = await connectToGeovelo(user_configuration.username, user_configuration.password);
  let user_id = auth.headers.get("userid");
  let token = auth.headers.get("authorization");

  let today = new Date();
  let today_formatted = format(today, "dd-MM-yyyy");
  let start_formatted = format(startOfWeek(today, { weekStartsOn: 1 }), "dd-MM-yyyy");
  let end_formatted = format(lastDayOfWeek(today, { weekStartsOn: 1 }), "dd-MM-yyyy");

  let traces = await fetch(`https://backend.geovelo.fr/api/v6/users/${user_id}/traces?period=custom&date_start=${start_formatted}&date_end=${end_formatted}&ordering=-start_datetime&page=1&page_size=50`, {
    method: "GET",
    headers: {
      "Source": "website",
      "Api-Key": "0f8c781a-b4b4-4d19-b931-1e82f22e769f",
      "Authorization": token,
    }
  });

  let data = await traces.json();
  let count = data.count;

  let total_distance = 0;
  let total_duration = 0;
  let total_average_speed = 0;

  data.results.forEach((trace: any) => {
    total_distance += trace.distance;
    total_duration += trace.duration;
    total_average_speed += trace.average_speed;
  });

  let average_speed = total_average_speed / count;
  let average_duration = total_duration / count;
  let average_distance = total_distance / count;

  return c.json({
    markup: html`
<div class="layout">
  <div class="list" data-list-limit="true" data-list-max-height="200" data-list-hidden-count="false" data-list-max-columns="1">
    {% for trip in results %}
    {% assign duration_h   = trip.duration | divided_by: 3600 | round %}
    {% assign duration_min = trip.duration | divided_by: 60 | modulo: 60 %}

    <div class="item">
      <div class="meta"></div>
      <div class="content">
        <span class="title title--small">{{ trip.title }}</span>
        <span class="description">{{ trip.distance | divided_by: 1000.0 | round: 1 }} km — {% if duration_h > 0 %}{{ duration_h }} h {% endif %}{{ duration_min }} min — {{ trip.average_speed }} km/h average</span>
        <div class="flex gap--xsmall">
          <span class="label label--small label--underline">{{ trip.start_datetime | l_date: "%a, %b %d, %Y — %H:%M", trmnl.user.locale }}</span>
        </div>
      </div>
      <img class="image-dither" height="52px" src="https://backend.geovelo.fr{{ trip.preview }}">
    </div>
    {% endfor %}
  </div>
</div>

<div class="title_bar">
  <img class="image" src="https://geovelo.app/favicon.svg">
  <span class="title">{{ trmnl.plugin_settings.instance_name }}</span>
  <span class="instance">Last trips</span>
</div>`,
    markup_half_horizontal: '<div class="view view--half_horizontal">Your content</div>',
    markup_half_vertical: '<div class="view view--half_vertical">Your content</div>',
    markup_quadrant: '<div class="view view--quadrant">' + total_distance + '</div>'
  });
})

app.post('/uninstall', async (c) => {
  let body = await c.req.json();
  let user_uuid = body.user_uuid;
  await c.env.USER_CONFIGURATION.delete(user_uuid);
  return c.text("Uninstallation OK");
})

export default app
