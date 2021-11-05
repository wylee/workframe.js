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
  const dom = new JSDOM(`<div id="mount-point">Placeholder</div>`);
  global.document = dom.window.document;
  workframe.mount(
    () => {
      return (state) => {
        return h("div", {}, state.name);
      };
    },
    "#mount-point",
    {}
  );
});
