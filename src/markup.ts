import { html, raw } from 'hono/html'

interface Trip {
  duration: number;
  title: string;
  distance: number;
  average_speed: number;
  start_datetime: string;
  preview: string;
}

export const getMainMarkup = (results: Trip[]) => html`
<div class="layout">
  <div class="list" data-list-limit="true" data-list-max-height="200" data-list-hidden-count="false" data-list-max-columns="1">
    ${results.map(trip => {
      const duration_h = Math.round(trip.duration / 3600);
      const duration_min = Math.round((trip.duration / 60) % 60);
      return html`
    <div class="item">
      <div class="meta"></div>
      <div class="content">
        <span class="title title--small">${trip.title}</span>
        <span class="description">${(trip.distance / 1000).toFixed(1)} km — ${duration_h > 0 ? `${duration_h}h ` : ''}${duration_min}min — ${trip.average_speed}km/h average</span>
        <div class="flex gap--xsmall">
          ${raw(`<span class="label label--small label--underline">{{ trip.start_datetime | l_date: "%a, %b %d, %Y — %H:%M", trmnl.user.locale }}</span>`)}
        </div>
      </div>
      <img class="image-dither" height="52px" src="https://backend.geovelo.fr${trip.preview}">
    </div>`;
    })}
  </div>
</div>

<div class="title_bar">
  <img class="image" src="https://geovelo.app/favicon.svg">
  ${raw('<span class="title">{{ trmnl.plugin_settings.instance_name }}</span>')}
  <span class="instance">Last trips</span>
</div>`;

export const getHalfHorizontalMarkup = () => html`<div class="view view--half_horizontal">Your content</div>`;

export const getHalfVerticalMarkup = () => html`<div class="view view--half_vertical">Your content</div>`;

export const getQuadrantMarkup = (total_distance: number) => html`<div class="view view--quadrant">${total_distance}</div>`;

export const getErrorMarkup = () => html`
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
