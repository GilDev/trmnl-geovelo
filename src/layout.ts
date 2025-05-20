import { html, HtmlEscapedString } from "hono/html";

export const Layout = (props: {
  children?: HtmlEscapedString | HtmlEscapedString[];
  user_configuration: {};
  alert: HtmlEscapedString | HtmlEscapedString[];
}) => html`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <title>Geovelo TRMNL Plugin Configuration</title>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.colors.min.css"
      />
    </head>
    <body>
      <main class="container">
        <header>
          <h1>Geovelo TRMNL Plugin Configuration</h1>
        </header>

        ${props.alert}

        <p
          style="textAlign: 'center'; color: ${props.user_configuration
            .connected
            ? "green"
            : "red"}"
        >
          ${props.user_configuration.connected
            ? "✔️ You are logged in, enjoy!"
            : "❌ You are not logged in, please log in below"}
        </p>

        ${props.children}

        <a
          role="button"
          class="outline secondary"
          href="https://usetrmnl.com/plugin_settings/${props.user_configuration
            .plugin_setting_id}/edit?force_refresh=true"
          ><i>↩ Back to TRMNL</i></a
        >
      </main>
    </body>
  </html>
`;

export const LoginForm = (props: { username?: string; password?: string }) => {
  return html`
    <form method="POST">
      <h1>Login</h1>
      <fieldset>
        <label>
          Username
          <input
            type="text"
            placeholder="john@gmail.com"
            autocomplete="email"
            name="username"
            value="${props.username || ""}"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            value="${props.password || ""}"
            required
          />
        </label>
      </fieldset>

      <button type="submit">Log In</button>
    </form>
  `;
};

export const Alert = (props: { type: string; message: string }) => {
  return html`
    <article>
      ${props.type == "error"
        ? html`<header class="pico-background-red">
            <strong>❌ Error!</strong>
          </header>`
        : html`<header class="pico-background-green">
            <strong>✅ Success!</strong>
          </header>`}
      ${props.message}
    </article>
  `;
};
