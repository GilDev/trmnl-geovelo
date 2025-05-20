import { html, raw } from "hono/html";

const formatDurationMinutes = (seconds: number) => Math.round(seconds / 60);
const formatDistanceKm = (meters: number) => parseFloat((meters / 1000).toFixed(1));

export const getMainMarkup = (data: any) => {
  const titleBar = html`
    <div class="title_bar">
      <img class="image" src="https://geovelo.app/favicon.svg" />
      ${raw('<span class="title">{{ trmnl.plugin_settings.instance_name }}</span>')}
      ${raw('<span class="instance">{{ trmnl.user.name | default: "User" }}</span>')}
    </div>`;

  return html`
    <div class="layout">
      <div class="grid">
        <div class="col col--span-1 gap">
          <span class="title">Statistics (month)</span>
          <div class="item"><div class="meta"></div><div class="content"><span class="title title--small">Rides</span><span class="value value--tnums value--small">${data.count}</span></div></div>
          <div class="item"><div class="meta"></div><div class="content"><span class="title title--small">Average speed</span><span class="value value--tnums value--small">${data.average_speed} km/h</span></div></div>
          <div class="item"><div class="meta"></div><div class="content"><span class="title title--small">Average duration</span><span class="value value--tnums value--small">${data.average_duration} mins</span></div></div>
          <div class="item"><div class="meta"></div><div class="content"><span class="title title--small">Average distance</span><span class="value value--tnums value--small">${data.average_distance} km</span></div></div>
          <div class="item"><div class="meta"></div><div class="content"><span class="title title--small">Longest duration</span><span class="value value--tnums value--small">${data.longest_duration} mins</span></div></div>
          <div class="item"><div class="meta"></div><div class="content"><span class="title title--small">Longest distance</span><span class="value value--tnums value--small">${data.longest_distance} km</span></div></div>
        </div>
        <div class="col col--span-2 gap">
          <span class="title">Last trips</span>
          <!-- <div class="markdown gap--large"><div class="content-element content">No trip data available for this period.</div></div> -->

          <span class="title title--small">${data.last_trips[0].title} ${raw(`<i>{{ latestTrip.start_datetime | l_date: "(%a. %b %-d, %Y — %H:%M)", trmnl.user.locale }}</i>`)}</span>
          <div class="grid">
            <div class="col gap">
              <div class="item">
                <div class="meta"></div>
                <div class="content">
                  <span class="title title--small">Distance</span>
                  <span class="value value--small value--tnums">${formatDistanceKm(data.last_trips[0].distance)} km</span>
                </div>
              </div>
              <div class="item">
                <div class="meta"></div>
                <div class="content">
                  <span class="title title--small">Duration</span>
                  <span class="value value--small value--tnums">${formatDurationMinutes(data.last_trips[0].duration)} mins</span>
                </div>
              </div>
              <div class="item">
                <div class="meta"></div>
                <div class="content">
                  <span class="title title--small">Average speed</span>
                  <span class="value value--small value--tnums">${data.last_trips[0].average_speed.toFixed(1)} km/h</span>
                </div>
              </div>
              <div class="item">
                <div class="meta"></div>
                <div class="content">
                  <span class="title title--small">Altitude difference</span>
                  <span class="value value--small value--tnums">↗ 6 m</span>
                </div>
              </div>
            </div>

            <div class="col gap">
              <img width="200px" class="image-dither" src="https://backend.geovelo.fr${data.last_trips[0].preview}" />
            </div>
          </div>

          ${data.last_trips.length > 0 ? html`<div class="border--h-5"></div>` : ''}

          <div class="list" data-list-limit="true" data-list-max-height="100" data-list-hidden-count="false" data-list-max-columns="2">
            ${data.last_trips.map((trip) => html`
              <div class="item">
                <div class="meta"></div>
                <div class="content">
                  <span class="title title--small">${trip.title}</span>
                  <span class="description">
                    ${formatDistanceKm(trip.distance)} km — ${formatDurationMinutes(trip.duration)} min — ${trip.average_speed.toFixed(1)} km/h average
                  </span>
                  <div class="flex gap--xsmall">
                    ${raw(`<span class="label label--small label--underline">{{ trip.start_datetime | l_date: "%a. %b %-d, %Y — %H:%M", trmnl.user.locale }}</span>`)}
                  </div>
                </div>
              </div>`
            )}
          </div>
        </div>
      </div>
    </div>
    ${titleBar}
  `;
};

export const getHalfHorizontalMarkup = (data: any) => { return getMainMarkup(data) };
export const getHalfVerticalMarkup = (data: any) => { return getMainMarkup(data) };
export const getQuadrantMarkup = (data: any) => { return getMainMarkup(data) };

export const getErrorMarkup = () => html` <div class="layout">
    <div class="columns">
      <div class="column">
        <div class="markdown gap--large">
          <span class="title">Error</span>
          <div
            class="content-element content clamp--20"
            data-content-max-height="320"
          >
            You are not connected, please check the configuration of the plugin.
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="title_bar">
    <img
      class="image"
      src="https://trmnl-public.s3.us-east-2.amazonaws.com/ji1q5vcii6v10zx86zqacf43rhjk"
    />
    <span class="title">Geovelo</span>
  </div>`;
