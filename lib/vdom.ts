import {
  h,
  init,
  vnode,
  attributesModule,
  eventListenersModule,
  JsxVNodeChildren,
  Module,
  VNode,
  VNodeData,
} from "snabbdom";
import { AnyState, Component, Setup } from "./interfaces";
import registry from "./registry";

const NOT_PRESENT = Symbol("Indicates a key's lack of presence in an object");

// This snabbdom module watches for a node to be updated and notes its
// root component, if any. At the end of a patch cycle, any components
// that have had a child or other descendent node updated will have
// their render actions called.
interface RenderModule extends Module {
  renderQueue: Component<AnyState>[];
  addToRenderQueue: (node: VNode) => void;
}

const renderModule: RenderModule = {
  renderQueue: [],
  addToRenderQueue(node) {
    const rootComponent = node.data?.rootComponent;
    if (rootComponent) {
      const queue = renderModule.renderQueue;
      if (!queue.find((component) => component === rootComponent)) {
        renderModule.renderQueue.push(rootComponent);
      }
    }
  },
  create(emptyNode, node) {
    renderModule.addToRenderQueue(node);
  },
  update(oldNode, newNode) {
    // XXX: snabbdom updates text elements in place
    if (oldNode.elm instanceof Text && oldNode.text !== newNode.text) {
      renderModule.addToRenderQueue(newNode);
    }
  },
  remove(node, callback) {
    renderModule.addToRenderQueue(node);
    callback();
  },
  post() {
    const queue = renderModule.renderQueue;
    queue.reverse().forEach((component) => {
      component.runOnRenderActions();
    });
    queue.splice(0);
  },
};

export const patch = init([
  renderModule,
  attributesModule,
  eventListenersModule,
]);

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
      const originalAttrs = "attrs" in data ? data.attrs : NOT_PRESENT;
      const originalOn = "on" in data ? data.on : NOT_PRESENT;

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

      if (originalAttrs !== NOT_PRESENT) {
        attrs.attrs = originalAttrs;
      }

      if (originalOn !== NOT_PRESENT) {
        attrs.on = originalOn;
      }

      data.attrs = attrs;
      data.on = handlers;
    }
  }

  const flattenedChildren = flattenChildren(children);

  if (isComponent) {
    const setup = arg as Setup<S>;
    const state = data as S;
    const factory = registry.getOrRegisterComponentFactory(setup);
    const component = factory(state);
    return component.createNode(state, flattenedChildren);
  }

  const tag = arg as string;
  return h(tag, data, flattenedChildren);
}

export function jsxFragment(children: JsxVNodeChildren[]): VNode[] {
  return children
    .flat(Infinity)
    .filter((c) => !!c || c === 0)
    .map((c) => c as VNode);
}

/**
 * Flatten children of JSX node.
 *
 * XXX: Not sure why this is necessary (but snabbdom does it).
 *
 * @param children
 */
function flattenChildren(children: JsxVNodeChildren[]): VNode[] {
  return children
    .flat(Infinity)
    .filter((child) => child && child !== 0)
    .map((child) => {
      if (
        typeof child === "string" ||
        typeof child === "number" ||
        typeof child === "boolean"
      ) {
        return vnode(undefined, undefined, undefined, String(child), undefined);
      } else {
        return child as VNode;
      }
    });
}
