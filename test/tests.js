/* eslint @typescript-eslint/no-var-requires: "off" */
const assert = require("assert");
const { JSDOM } = require("jsdom");
const { h } = require("snabbdom");
const workframe = require("../lib");

it("should contain certain exports", () => {
  assert.ok(workframe.onMount);
  assert.ok(workframe.onRender);
  assert.ok(workframe.mount);
});

describe("#mount()", () => {
  const dom = new JSDOM(`
    <body>
      <div id="mount-point">
        App will be mounted over this div (replacing it)
      </div>
    </body>
  `);

  global.document = dom.window.document;

  let mountPoint;
  let app;

  const App = () => {
    return (state) => {
      return h("div", { attrs: { id: "app" } }, state.name);
    };
  };

  mountPoint = dom.window.document.querySelector("#mount-point");
  assert.ok(mountPoint);

  app = dom.window.document.querySelector("#app");
  assert.strictEqual(app, null);

  workframe.mount(App, "#mount-point", {});

  mountPoint = dom.window.document.querySelector("#mount-point");
  assert.strictEqual(mountPoint, null);

  app = dom.window.document.querySelector("#app");
  assert.ok(app);
});
