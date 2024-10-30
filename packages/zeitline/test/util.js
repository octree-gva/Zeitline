import fs from "fs";
import { JSDOM } from "jsdom";

/**
 * Construct the window with a virtual dom
 *
 * @return {JSDOM}
 */
export function getWindow() {
  const dom = `<html>
  <body>
    <svg width="1000" height="100"></svg>
  </body>
  </html>`;

  return new JSDOM(dom, { runScripts: "dangerously" }).window;
}

export function getWindowWithZeitline(conf) {
  const Zeitline = fs.readFileSync("./dist/zeitline.bundle.js", {
    encoding: "utf-8",
  });

  const window = getWindow();

  const scriptEl = window.document.createElement("script");
  scriptEl.textContent = Zeitline;
  window.document.body.appendChild(scriptEl);

  const timeline = new window.Zeitline.Timeline(conf);
  timeline.render();

  return window;
}
