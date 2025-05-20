import { format, startOfWeek, lastDayOfWeek, max } from "date-fns";

// Geovelo API constants
const GEOVELO_API_KEY = "0f8c781a-b4b4-4d19-b931-1e82f22e769f";
const GEOVELO_API_BASE_URL = "https://backend.geovelo.fr/api";

export async function connectToGeovelo(username: string, password: string) {
  return await fetch(`${GEOVELO_API_BASE_URL}/v1/authentication/geovelo`, {
    method: "POST",
    headers: {
      Source: "website",
      "Api-Key": GEOVELO_API_KEY,
      Authentication: btoa(`${username};${password}`),
    },
  });
}

export async function fetchUserTraces(userId: string, token: string) {
  let today = new Date();
  let start_formatted = format(
    startOfWeek(today, { weekStartsOn: 1 }),
    "dd-MM-yyyy"
  );
  let end_formatted = format(
    lastDayOfWeek(today, { weekStartsOn: 1 }),
    "dd-MM-yyyy"
  );

  const response = await fetch(
    `${GEOVELO_API_BASE_URL}/v6/users/${userId}/traces?period=custom&date_start=${start_formatted}&date_end=${end_formatted}&ordering=-start_datetime&page=1&page_size=50`,
    {
      method: "GET",
      headers: {
        Source: "website",
        "Api-Key": GEOVELO_API_KEY,
        Authorization: token,
      },
    }
  );

  return await response.json();
}

export function processTracesData(data: any) {
  // Calculate useful values
  let total_distance = 0;
  let total_duration = 0;
  let total_average_speed = 0;
  data.results.forEach((trace: any) => {
    total_distance += trace.distance;
    total_duration += trace.duration;
    total_average_speed += trace.average_speed;
  });

  return {
    first_name: "John",
    count: data.count,
    average_speed: total_average_speed / data.count,
    average_duration: total_duration / data.count,
    average_distance: total_distance / data.count,
    longest_duration: max(data.results.map((trace: any) => trace.duration)),
    longest_distance: max(data.results.map((trace: any) => trace.distance)),
    last_trips: data.results.slice(-3),
  };
}
