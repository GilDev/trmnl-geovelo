import { Hono } from "hono";
import { trimTrailingSlash } from "hono/trailing-slash";
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

app.post("/", async (c) => {
  let body = await c.req.json();
  let username = body.username;
  let password = body.password;
  let period = body.period;
  switch (period) {
    case "current_week":
      period = "current_week";
      break;

    case "current_month":
      period = "current_month";
      break;

    case "current_year":
      period = "current_year";
      break;

    case "last_week":
      period = "last_week";
      break;

    case "last_month":
      period = "last_month";
      break;

    case "last_year":
      period = "last_year";
      break;

    default:
      period = "current_month";
  }

  if (!username || !password) {
    return c.json({error: "User credentials missing"}, 500);
  }

  let auth = await connectToGeovelo(username, password);
  let user_id = auth.headers.get("userid");
  let token = auth.headers.get("authorization");

  let data = await fetchUserTraces(user_id, token, period);
  let sanitized_data = processTracesData(data);

  console.log(`Generating screen for user "${username}"`);

  return c.json(sanitized_data);
});

export default app;
