import { Hono } from 'hono'
import { html } from 'hono/html'
import { use } from 'hono/jsx';
import { format, subDays, startOfWeek, lastDayOfWeek } from "date-fns";

type Bindings = {
  USER_CONFIGURATION: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

async function getUserIdFromRequest(c: Hono.Context) {
  return (await c.req.text()).split("=")[1];
}

app.get('/', (c) => {
  console.log(c.env);
  return c.text(c.env.CLIENT_ID)
})

app.get('/install', async (c) => {
  let fetch_access_token = await fetch("https://usetrmnl.com/oauth/token", {
    method: "POST",
    body: JSON.stringify({
      code: c.req.query('code'),
      client_id: 'pbxmpqozsygwljxxqiidnq',
      client_secret: '3lv5np38jvgjnxwwhz-yaw',
      grant_type: 'authorization_code'
    }),
  });

  let access_token = await fetch_access_token.json().access_token;

  return c.redirect(c.req.query('installation_callback_url'));
})

app.post('/success', async (c) => {
  let body = await c.req.json();

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
    return c.json({ error: "Access denied" }, 500);
  }

  return c.html('<a href="https://usetrmnl.com/plugin_settings/' + user_configuration.plugin_setting_id + '/edit?force_refresh=true">Go back</a>');
})

app.post('/markup', async (c) => {
  let user_uuid = await getUserIdFromRequest(c);
  let user_configuration = JSON.parse(await c.env.USER_CONFIGURATION.get(user_uuid));

  if (!user_configuration) {
    return c.json({ error: "Configuration is missing" }, 500);
  }

  let auth = await fetch("https://backend.geovelo.fr/api/v1/authentication/geovelo", {
    method: "POST",
    headers: {
      "Source": "website",
      "Api-Key": "0f8c781a-b4b4-4d19-b931-1e82f22e769f",
      "Authentication": btoa(`${user_configuration.username};${user_configuration.password}`),
    }
  });

  const user_id = auth.headers.get("userid");
  const token = auth.headers.get("authorization");

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
  console.log(data);

  let total_distance = 0;
  let total_duration = 0;
  let total_average_speed = 0;

  data.results.forEach((trace: any) => {
    total_distance += trace.distance;
    total_duration += trace.duration;
    total_average_speed += trace.average_speed;
  });

  // return c.json({
  //   current_week: {
  //     start: start_formatted,
  //     end: end_formatted,
  //     count: data.count,
  //     total_distance: total_distance,
  //     total_duration: total_duration,
  //     average_speed: total_average_speed / data.count,
  //     average_duration: total_duration / data.count,
  //     average_distance: total_distance / data.count,
  //   }
  // });

  return c.json({
    markup: '<div class="view view--full"><div class="layout"><div class="columns"><div class="column"><div class="markdown gap--large"><span class="title">Daily Scripture</span><div class="content-element content content--center">' + total_distance + '</div></div></div></div></div><div>',
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
