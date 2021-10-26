/* eslint @typescript-eslint/no-var-requires: "off" */
const assert = require("assert");
const { JSDOM } = require("jsdom");
const workframe = require("../lib");

it("should contain certain exports", () => {
  assert.ok(workframe.onMount);
  assert.ok(workframe.onRender);
  assert.ok(workframe.mount);
});

describe("#mount()", () => {
  const dom = new JSDOM(`<div id="app">Placeholder</div>`);
  global.document = dom.window.document;
  workframe.mount(
    () => {
      return (state) => {
        return `<div>${state.name}</div>`;
      };
    },
    "#app",
    {}
  );
});
