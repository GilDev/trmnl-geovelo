import { Hono } from 'hono'
import { format, subDays, startOfWeek, lastDayOfWeek } from "date-fns";

const app = new Hono()

app.get('/', (c) => {
  console.log(c.env);
  return c.text(c.env.CLIENT_ID)
})

app.get('/oauth/trmnl/new', async (c) => {
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
  console.log(access_token);

  return c.redirect(c.req.query('installation_callback_url'));
})

app.get('/hooks/trmnl/install', async (c) => {
  let success = await c.req.json();
  console.log(success);
  //return c.text("HEY");
  return c.json(success);
})

app.get('/settings', async (c) => {
  let success = await c.req.json();
  console.log(success);
  //return c.text("HEY");
  return c.json(success);
})

app.post('/integrations/trmnl/markup', async (c) => {
  let user_uuid = (await c.req.text()).split("=")[1];

  return c.json({
    markup: '<div class="view view--full"><div class="layout"><div class="columns"><div class="column"><div class="markdown gap--large"><span class="title">Daily Scripture</span><div class="content-element content content--center">' + body + '</div></div></div></div></div><div>',
    markup_half_horizontal: '<div class="view view--half_horizontal">Your content</div>',
    markup_half_vertical: '<div class="view view--half_vertical">Your content</div>',
    markup_quadrant: '<div class="view view--quadrant">' + body + '</div>'
  });
})

app.get('/fetch', async (c) => {
  let auth = await fetch("https://backend.geovelo.fr/api/v1/authentication/geovelo", {
    method: "POST",
    headers: {
      "Source": "website",
      "Api-Key": "0f8c781a-b4b4-4d19-b931-1e82f22e769f",
      "Authentication": btoa(`${c.env.GEOVELO_USERNAME};${c.env.GEOVELO_PASSWORD}`),
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

  return c.json({
    current_week: {
      start: start_formatted,
      end: end_formatted,
      count: data.count,
      total_distance: total_distance,
      total_duration: total_duration,
      average_speed: total_average_speed / data.count,
      average_duration: total_duration / data.count,
      average_distance: total_distance / data.count,
    }
  });
})

export default app
