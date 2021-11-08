import {
  init,
  jsx,
  vnode,
  attributesModule,
  eventListenersModule,
  FunctionComponent,
  JsxVNodeChildren,
  VNode,
  VNodeData,
} from "snabbdom";
import { AnyState, Setup } from "./interfaces";
import registry from "./registry";

export const patch = init([attributesModule, eventListenersModule]);

const PREVENT_DEFAULT_TAG_EVENT_PAIRS: Record<string, string[]> = {
  a: ["click"],
  form: ["submit"],
};

/**
 * Create a VNode from a JSX node.
 *
 * @param arg An HTML tag name *or* a component setup function
 * @param data HTML attributes & event handles *or* component state
 * @param children
 */
export function createVnodeFromJsxNode<S extends AnyState>(
  arg: string | Setup<S> | ((...arg: JsxVNodeChildren[]) => VNode[]),
  data: VNodeData | null,
  ...children: JsxVNodeChildren[]
): VNode | VNode[] {
  if (arg === jsxFragment) {
    return jsxFragment(children);
  }

  const isComponent = typeof arg === "function";

  if (data) {
    if (isComponent) {
      if (Object.keys(data).some((k) => k.length > 2 && k.startsWith("on"))) {
        throw new Error("Event handlers cannot be attached to components");
      }
    } else {
      const tag = arg as string;
      const attrs: Record<string, any> = {};
      const handlers: Record<string, any> = {};
      const originalAttrs = data.attrs;
      const originalHandlers = data.on;

      delete data.attrs;
      delete data.on;

      Object.entries(data).forEach(([key, val]) => {
        if (key.startsWith("on")) {
          delete data[key];

          let directives: string[] = [];

          key = key.slice(2).toLowerCase();

          if (key.includes(":")) {
            const i = key.indexOf(":");
            directives = key.slice(i + 1).split(":");
            key = key.slice(0, i);
          }

          // Prevent default unless explicitly requested
          if (
            !directives.includes("default") &&
            PREVENT_DEFAULT_TAG_EVENT_PAIRS[tag] &&
            PREVENT_DEFAULT_TAG_EVENT_PAIRS[tag].includes(key)
          ) {
            const originalHandler = val;
            val = (event: any, ...args: any[]) => {
              event.preventDefault();
              return originalHandler(event, ...args);
            };
          }

          handlers[key] = val;
        } else if (key !== "key") {
          attrs[key] = val;
        }
      });

      if (typeof originalAttrs !== "undefined") {
        attrs.attrs = originalAttrs;
      }

      if (typeof originalHandlers !== "undefined") {
        attrs.on = originalHandlers;
      }

      data.attrs = attrs;
      data.on = handlers;
    }
  }

  if (isComponent) {
    const setup = arg as Setup<S>;
    const state = data;
    const factory = registry.getOrRegisterComponentFactory(setup);
    const component: any = factory(state);
    return jsx(component.createNode as FunctionComponent, state, ...children);
  }

  const tag = arg as string;
  return jsx(tag, data, ...children);
}

export function jsxFragment(children: JsxVNodeChildren[]): VNode[] {
  return children
    .flat(Infinity)
    .filter((c) => !!c || c === 0)
    .map((c) => c as VNode);
}
