import { Hono } from "hono";
import { html } from "hono/html";
import {
  getMainMarkup,
  getHalfHorizontalMarkup,
  getHalfVerticalMarkup,
  getQuadrantMarkup,
} from "./markup";
import { mockupGeoveloData } from "./mockup_data";
import { processTracesData } from "./geovelo";

// Preview Layout Component (moved from layout.ts)
export const PreviewLayout = (props: {
  title: string;
  children: any;
  size: string;
}) => html`
  <!DOCTYPE html>
  <html>
    <head>
      <title>${props.title}</title>
      <link
        rel="stylesheet"
        href="https://usetrmnl.com/css/latest/plugins.css"
      />
      <script src="https://usetrmnl.com/js/latest/plugins.js"></script>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;350;375;400;450;600;700&display=swap"
        rel="stylesheet"
      />
    </head>
    <body class="environment trmnl">
      <div class="screen">
        <div class="view view--${props.size}">${props.children}</div>
      </div>
    </body>
  </html>
`;

const previewRoutes = new Hono();

previewRoutes.get("/", (c) => {
  return c.html(
    PreviewLayout({
      title: "Preview - Main Markup",
      size: "full",
      children: getMainMarkup(processTracesData(mockupGeoveloData)),
    })
  );
});

previewRoutes.get("/horizontal", (c) => {
  return c.html(
    PreviewLayout({
      title: "Preview - Half Horizontal Markup",
      size: "half_horizontal",
      children: getHalfHorizontalMarkup(processTracesData(mockupGeoveloData)),
    })
  );
});

previewRoutes.get("/vertical", (c) => {
  return c.html(
    PreviewLayout({
      title: "Preview - Half Vertical Markup",
      size: "half_vertical",
      children: getHalfVerticalMarkup(processTracesData(mockupGeoveloData)),
    })
  );
});

previewRoutes.get("/quadrant", (c) => {
  return c.html(
    PreviewLayout({
      title: "Preview - Quadrant Markup",
      size: "quadrant",
      children: getQuadrantMarkup(processTracesData(mockupGeoveloData)),
    })
  );
});

export { previewRoutes };
