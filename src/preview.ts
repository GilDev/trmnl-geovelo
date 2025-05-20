import { Hono } from "hono";
import { html } from "hono/html";
import {
  getMainMarkup,
  getHalfHorizontalMarkup,
  getHalfVerticalMarkup,
  getQuadrantMarkup,
} from "./markup";

// Preview Layout Component (moved from layout.ts)
export const PreviewLayout = (props: { title: string; children: any; size: string }) => html`
  <!DOCTYPE html>
  <html>
    <head>
      <title>${props.title}</title>
      <link
        rel="stylesheet"
        href="https://usetrmnl.com/css/latest/plugins.css"
      />
      <script src="https://usetrmnl.com/js/latest/plugins.js"></script>
    </head>
    <body class="environment trmnl">
      <div class="screen">
        <div class="view view--${props.size}">${props.children}</div>
      </div>
    </body>
  </html>
`;

// Mockup data for previews
const mockTraceData = [
  {
    distance: 10500,
    duration: 3600,
    average_speed: 10.5,
    name: "Morning Ride",
    start_datetime: "2023-10-26T08:00:00Z",
  },
  {
    distance: 5200,
    duration: 1800,
    average_speed: 10.4,
    name: "Evening Commute",
    start_datetime: "2023-10-26T18:00:00Z",
  },
  {
    distance: 15000,
    duration: 5400,
    average_speed: 10.0,
    name: "Weekend Trail",
    start_datetime: "2023-10-22T10:00:00Z",
  },
];
const mockTotalDistance = mockTraceData.reduce(
  (sum, trace) => sum + trace.distance,
  0
);

const previewRoutes = new Hono();

previewRoutes.get("/", (c) => {
  return c.html(
    PreviewLayout({
      title: "Preview - Main Markup",
      size: "full",
      children: getMainMarkup(mockTraceData),
    })
  );
});

previewRoutes.get("/horizontal", (c) => {
  return c.html(
    PreviewLayout({
      title: "Preview - Half Horizontal Markup",
      size: "half_horizontal",
      children: getHalfHorizontalMarkup(mockTraceData),
    })
  );
});

previewRoutes.get("/vertical", (c) => {
  return c.html(
    PreviewLayout({
      title: "Preview - Half Vertical Markup",
      size: "half_vertical",
      children: getHalfVerticalMarkup(mockTraceData),
    })
  );
});

previewRoutes.get("/quadrant", (c) => {
  return c.html(
    PreviewLayout({
      title: "Preview - Quadrant Markup",
      size: "quadrant",
      children: getQuadrantMarkup(mockTraceData),
    })
  );
});

export { previewRoutes };
