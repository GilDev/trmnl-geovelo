import { Hono } from 'hono'
import { html } from 'hono/html'
import { FC } from 'hono/jsx';
import { format, subDays, startOfWeek, lastDayOfWeek } from "date-fns";
import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer'

import { installNunjucks } from "hono-nunjucks";
import templates from "./precompiled.mjs";



const PASSWORD_PLACEHOLDER = "     ";

type Bindings = {
  USER_CONFIGURATION: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()


app.use(
  "*",
  installNunjucks({
    templates
  })
);




const foo = {
  count: 6,
  next: null,
  next_path: null,
  previous: null,
  previous_path: null,
  results: [
    {
      id: 32861262,
      title: 'Trajet matinal à vélo',
      computed_route_id: 'bG9jPTQ3LjM5NTk0NTgsMC43MzU1MDYyJmxvYz00Ny4zNjk0NzM1LDAuNzE4Njc5NCNFWFBFUlQjRmFsc2UjTUVESUFOIzI1I0ZhbHNlI05vbmUjMjAyNS0wNS0xNCAwODowOTo0My43NTAxODUjVFJBRElUSU9OQUwjMCMwI0ZBU1RFUiNGYWxzZSNUcnVl',
      distance: 4768,
      duration: 803,
      calories: 113468,
      average_speed: 21.38,
      vertical_gain: 9,
      vertical_loss: 9,
      record_source: 'NAVIGATION',
      local_timezone: 'Europe/Paris',
      naive_local_start_datetime: '2025-05-14T08:10:06.908000',
      naive_local_end_datetime: '2025-05-14T08:23:29.945000',
      start_datetime: '2025-05-14T08:10:06.908000+02:00',
      end_datetime: '2025-05-14T08:23:29.945000+02:00',
      cleaned_version: 4,
      preview: '/media/user-trace-preview/no-limit/preview_32861262.png',
      preview_300_200: '/media/user-trace-preview/no-limit/preview_300_200_32861262.png',
      clean_status: 'CLEAN',
      has_problem: false,
      usertracegameprogress: [Object],
      commuting_status: 'COMMUTING',
      is_bike_automatically_classified: true,
      is_bike_manually_classified: null
    },
    {
      id: 32830446,
      title: 'Trajet à vélo en soirée',
      computed_route_id: 'bG9jPTQ3LjM2OTA1NzYsMC43MTgxNDIxJmxvYz00Ny4zOTU5NTgwMzUwNzIzOCwwLjczNTU5NjY5OTIyNDkxNCNFWFBFUlQjRmFsc2UjTUVESUFOIzI1I0ZhbHNlI05vbmUjMjAyNS0wNS0xMyAxNzo1OTozMy41ODk1MDMjVFJBRElUSU9OQUwjMCMwI0ZBU1RFUiNGYWxzZSNUcnVl',
      distance: 4822,
      duration: 696,
      calories: 136625,
      average_speed: 24.94,
      vertical_gain: 9,
      vertical_loss: 9,
      record_source: 'NAVIGATION',
      local_timezone: 'Europe/Paris',
      naive_local_start_datetime: '2025-05-13T18:00:25.743000',
      naive_local_end_datetime: '2025-05-13T18:12:01.758000',
      start_datetime: '2025-05-13T18:00:25.743000+02:00',
      end_datetime: '2025-05-13T18:12:01.758000+02:00',
      cleaned_version: 4,
      preview: '/media/user-trace-preview/no-limit/preview_32830446.png',
      preview_300_200: '/media/user-trace-preview/no-limit/preview_300_200_32830446.png',
      clean_status: 'CLEAN',
      has_problem: false,
      usertracegameprogress: [Object],
      commuting_status: 'COMMUTING',
      is_bike_automatically_classified: true,
      is_bike_manually_classified: null
    },
    {
      id: 32792968,
      title: 'Trajet matinal à vélo',
      computed_route_id: 'bG9jPTQ3LjM5NTk0NDUsMC43MzU1MDg1JmxvYz00Ny4zNjk0NzM1LDAuNzE4Njc5NCNFWFBFUlQjRmFsc2UjTUVESUFOIzI1I0ZhbHNlI05vbmUjMjAyNS0wNS0xMyAwODo1NDoyMy4xMDAyNTAjVFJBRElUSU9OQUwjMCMwI0ZBU1RFUiNGYWxzZSNUcnVl',
      distance: 4640,
      duration: 646,
      calories: 134759,
      average_speed: 25.84,
      vertical_gain: 6,
      vertical_loss: 6,
      record_source: 'NAVIGATION',
      local_timezone: 'Europe/Paris',
      naive_local_start_datetime: '2025-05-13T08:54:27.408000',
      naive_local_end_datetime: '2025-05-13T09:05:14.016000',
      start_datetime: '2025-05-13T08:54:27.408000+02:00',
      end_datetime: '2025-05-13T09:05:14.016000+02:00',
      cleaned_version: 4,
      preview: '/media/user-trace-preview/no-limit/preview_32792968.png',
      preview_300_200: '/media/user-trace-preview/no-limit/preview_300_200_32792968.png',
      clean_status: 'CLEAN',
      has_problem: false,
      usertracegameprogress: [Object],
      commuting_status: 'COMMUTING',
      is_bike_automatically_classified: true,
      is_bike_manually_classified: null
    },
    {
      id: 32767206,
      title: 'Trajet à vélo en soirée',
      computed_route_id: null,
      distance: 2619,
      duration: 588,
      calories: 43216,
      average_speed: 16.04,
      vertical_gain: 0,
      vertical_loss: 0,
      record_source: 'MANUAL',
      local_timezone: 'Europe/Paris',
      naive_local_start_datetime: '2025-05-12T19:17:53.798000',
      naive_local_end_datetime: '2025-05-12T19:27:41.811000',
      start_datetime: '2025-05-12T19:17:53.798000+02:00',
      end_datetime: '2025-05-12T19:27:41.811000+02:00',
      cleaned_version: 4,
      preview: '/media/user-trace-preview/no-limit/preview_32767206.png',
      preview_300_200: '/media/user-trace-preview/no-limit/preview_300_200_32767206.png',
      clean_status: 'CLEAN',
      has_problem: false,
      usertracegameprogress: [Object],
      commuting_status: 'NOT_COMMUTING',
      is_bike_automatically_classified: true,
      is_bike_manually_classified: null
    },
    {
      id: 32759220,
      title: 'Trajet à vélo en soirée',
      computed_route_id: 'bG9jPTQ3LjM2OTA0MzQsMC43MTgxNzA5JmxvYz00Ny4zOTU5NTgwMzUwNzIzOCwwLjczNTU5NjY5OTIyNDkxNCNFWFBFUlQjRmFsc2UjTUVESUFOIzI1I0ZhbHNlI05vbmUjMjAyNS0wNS0xMiAxODowOTozMy4xNjAyODgjVFJBRElUSU9OQUwjMCMwI0ZBU1RFUiNGYWxzZSNUcnVl',
      distance: 4973,
      duration: 897,
      calories: 112602,
      average_speed: 19.95,
      vertical_gain: 12,
      vertical_loss: 12,
      record_source: 'NAVIGATION',
      local_timezone: 'Europe/Paris',
      naive_local_start_datetime: '2025-05-12T18:09:47.467000',
      naive_local_end_datetime: '2025-05-12T18:24:44.728000',
      start_datetime: '2025-05-12T18:09:47.467000+02:00',
      end_datetime: '2025-05-12T18:24:44.728000+02:00',
      cleaned_version: 4,
      preview: '/media/user-trace-preview/no-limit/preview_32759220.png',
      preview_300_200: '/media/user-trace-preview/no-limit/preview_300_200_32759220.png',
      clean_status: 'CLEAN',
      has_problem: false,
      usertracegameprogress: [Object],
      commuting_status: 'COMMUTING',
      is_bike_automatically_classified: true,
      is_bike_manually_classified: null
    },
    {
      id: 32723784,
      title: 'Trajet matinal à vélo',
      computed_route_id: 'bG9jPTQ3LjM5NTk0NDUsMC43MzU1MDg2JmxvYz00Ny4zNjk0NzM1LDAuNzE4Njc5NCNFWFBFUlQjRmFsc2UjTUVESUFOIzI1I0ZhbHNlI05vbmUjMjAyNS0wNS0xMiAwODo0Mjo0MS4wMjI1NzQjVFJBRElUSU9OQUwjMCMwI0ZBU1RFUiNGYWxzZSNUcnVl',
      distance: 4623,
      duration: 733,
      calories: 114857,
      average_speed: 22.7,
      vertical_gain: 6,
      vertical_loss: 6,
      record_source: 'NAVIGATION',
      local_timezone: 'Europe/Paris',
      naive_local_start_datetime: '2025-05-12T08:42:50.772000',
      naive_local_end_datetime: '2025-05-12T08:55:03.950000',
      start_datetime: '2025-05-12T08:42:50.772000+02:00',
      end_datetime: '2025-05-12T08:55:03.950000+02:00',
      cleaned_version: 4,
      preview: '/media/user-trace-preview/no-limit/preview_32723784.png',
      preview_300_200: '/media/user-trace-preview/no-limit/preview_300_200_32723784.png',
      clean_status: 'CLEAN',
      has_problem: false,
      usertracegameprogress: [Object],
      commuting_status: 'COMMUTING',
      is_bike_automatically_classified: true,
      is_bike_manually_classified: null
    }
  ]
};

const Layout: FC = (props) => {
  return (
    <html>
      <body>{props.children}</body>
    </html>
  )
}

const Top: FC<{ messages: object[] }> = (props: {
  messages: object[]
}) => {
  return (
    <Layout>
      <h1>Hello Hono!</h1>
      <ul>
        {props.messages.map((message) => {
          return <li>{message.title}</li>
        })}
      </ul>
    </Layout>
  )
}

const Mine: FC<{ trips: object[] }> = (props: {
  trips: object[]
}) => {
  return (
  <div>
    <div class="layout">
      <div class="list" data-list-limit="true" data-list-max-height="200" data-list-hidden-count="false" data-list-max-columns="1">
        {props.trips.map((trip) => {
          return <div class="item">
          <div class="meta"></div>
          <div class="content">
            <span class="title title--small">{trip.title}</span>
            <span class="description">FOO</span>
            <div class="flex gap--xsmall">
              <span class="label label--small label--underline">FOO</span>
            </div>
          </div>
          <img class="image-dither" height="52px" src="https://backend.geovelo.fr{{ trip.preview }}"/>
        </div>
        })}
      </div>
    </div>

    <div class="title_bar">
      <img class="image" src="https://geovelo.app/favicon.svg"/>
      <span class="title">Geovelo</span>
      <span class="instance">Last trips</span>
    </div>
  </div>
  )
}



// Helper function for date formatting (from previous answer)
const formatTripDate = (dateString, locale = 'en-US') => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const parts = {
        weekday: new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date),
        month: new Intl.DateTimeFormat(locale, { month: 'short' }).format(date),
        day: new Intl.DateTimeFormat(locale, { day: '2-digit' }).format(date),
        year: new Intl.DateTimeFormat(locale, { year: 'numeric' }).format(date),
        hour: new Intl.DateTimeFormat(locale, { hour: '2-digit', hour12: false }).format(date),
        minute: new Intl.DateTimeFormat(locale, { minute: '2-digit' }).format(date),
    };
    return `${parts.weekday}, ${parts.month} ${parts.day}, ${parts.year} — ${parts.hour}:${parts.minute}`;
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return dateString;
  }
};


// ---- TripItem Component ----
// Represents a single trip in the list
// Props:
// - trip: An object containing details of a single trip
// - locale: The user's locale for date formatting
export const TripItem = ({ trip, locale }) => {
  const duration_h = Math.round(trip.duration / 3600);
  const duration_min = Math.floor(trip.duration / 60) % 60;
  const distance_km = (trip.distance / 1000.0).toFixed(1);

  return (
    <div className="item">
      <div className="meta"></div>
      <div className="content">
        <span className="title title--small">{trip.title}</span>
        <span className="description">
          {distance_km} km —{' '}
          {duration_h > 0 && <>{duration_h} h </>}
          {duration_min} min — {trip.average_speed} km/h average
        </span>
        <div className="flex gap--xsmall">
          <span className="label label--small label--underline">
            {formatTripDate(trip.start_datetime, locale)}
          </span>
        </div>
      </div>
      <img
        className="image-dither"
        height="52px"
        src={`https://backend.geovelo.fr${trip.preview}`}
        alt={`Preview for ${trip.title || 'trip'}`}
      />
    </div>
  );
};

// ---- TripList Component ----
// Renders the list of trips
// Props:
// - results: An array of trip objects
// - trmnl: An object containing trmnl-specific data (like user.locale)
export const TripList = ({ results, trmnl }) => {
  const trips = results || [];
  const userLocale = trmnl?.user?.locale || 'en-US';

  return (
    <div
      className="list"
      data-list-limit="true"
      data-list-max-height="400"
      data-list-hidden-count="false"
      data-list-max-columns="1"
    >
      {trips.map((trip, index) => (
        <TripItem key={trip.id || index} trip={trip} locale={userLocale} />
      ))}
    </div>
  );
};

// ---- TitleBar Component ----
// Renders the title bar section
// Props:
// - instanceName: The name of the instance from trmnl.plugin_settings
export const TitleBar = ({ instanceName }) => {
  return (
    <div className="title_bar">
      <img className="image" src="https://geovelo.app/favicon.svg" alt="GeoVelo Favicon" />
      <span className="title">{instanceName || 'GeoVelo'}</span>
      <span className="instance">Last trips</span>
    </div>
  );
};

// ---- Main Page Layout Component ----
// Combines TripList and TitleBar
// Props:
// - results: An array of trip objects
// - trmnl: An object containing trmnl-specific data
export const TripsPageLayout = ({ results, trmnl }) => {
  return (
    <> {/* Use a Fragment because we have two sibling top-level divs */}
      <div className="layout">
        <TripList results={results} trmnl={trmnl} />
      </div>
      <TitleBar instanceName={trmnl?.plugin_settings?.instance_name} />
    </>
  );
};
const mockTrmnl = {
  user: { locale: 'fr-FR' },
  plugin_settings: { instance_name: "My GeoVelo Instance" }
};
app.get('/test', async (c) => {
  let foo = await fetch('http://127.0.0.1:8787/markup', {
    method: 'POST',
    body: "user_id=674c9d99-cea1-4e52-9025-9efbe0e30901",
  });

  let data = await foo.json();
  let page = data.markup;

  return c.html(`
<!DOCTYPE html>
<html>
  <head>
  
    <link rel="stylesheet" href="https://usetrmnl.com/css/latest/plugins.css">
    <script src="https://usetrmnl.com/js/latest/plugins.js"></script>
  </head>
  <body class="environment trmnl">
    <div class="screen">
      <div class="view view--full">
    ${page}
    </div>
    </div>
  </body>
</html>`);
})

app.get('/test2', async (c) => {
  const t = c.get("t");

  const rendered = t.render("hello", { username: "GilDev" });

  return c.html(rendered);
})





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

  //if (!access_token) {
  //  return c.text("Could not communicate with TRMNL's servers", 500);
  //}

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
  console.log(data);

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
    markup: html`${<TripsPageLayout results={foo.results} trmnl={mockTrmnl} />}`.toString(),
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
