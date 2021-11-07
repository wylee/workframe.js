import {
  h,
  init,
  jsx,
  vnode,
  attributesModule,
  eventListenersModule,
  FunctionComponent,
  Hooks,
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
        } else {
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
    const factory = registry.getOrRegisterComponentFactory(
      setup.$workFrameId,
      setup
    );
    const component: any = factory(data);

    const node = jsx(
      component.createNode as FunctionComponent,
      data,
      ...children
    );

    const lastChild = node.children?.length
      ? (node.children[node.children.length - 1] as VNode)
      : null;

    if (lastChild) {
      lastChild.data = lastChild.data ?? ({} as VNodeData);
      lastChild.data.hook = lastChild.data.hook ?? ({} as Hooks);
      lastChild.data.hook.insert = () => {
        component.runOnRenderActions();
        component.runOnMountActions();
      };
    }
    return node;
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

/**
 * Mount component into DOM.
 *
 * Generally, this is called to mount your app's root component. It will
 * render the component then mount it at the specified mount point.
 *
 * NOTE: The mount point DOM element will be *replaced* by the mounted
 * node rather than being appended to it.
 *
 * @param component Factory of component to mount
 * @param mountPoint DOM node or selector to mount component into
 * @param initialState Initial state of component
 */
export function mount<S extends AnyState>(
  setup: Setup<S>,
  mountPoint: string | Element,
  initialState: S
): void {
  if (typeof mountPoint === "string") {
    const element = document.querySelector(mountPoint);
    if (element) {
      mountPoint = element;
    } else {
      throw new Error(`DOM element matching selector not found: ${mountPoint}`);
    }
  }
  const factory = registry.getOrRegisterComponentFactory(
    setup.$workFrameId,
    setup
  );
  factory(initialState).mount(mountPoint);
}

// NOTE: I thought this overridden jsx function was needed, but things
// seem to be working fine without it. Committing this so it's in git
// history just in case.
//
// Utilities copied from snabbdom and modified. The main reason for this
// is that snabbdom simplifies nodes that have a single child and that
// child is text, but that doesn't work for our purposes, esp. wrt. to
// mounting.
//
// function jsx(
//   tag: string | FunctionComponent,
//   data: VNodeData | null,
//   ...children: JsxVNodeChildren[]
// ): VNode {
//   const flatChildren = flattenAndFilter(children);
//   if (typeof tag === "function") {
//     // Component
//     return tag(data, flatChildren);
//   } else {
//     return h(tag, data, flatChildren);
//   }
// }
//
// function flattenAndFilter(children: JsxVNodeChildren[]): VNode[] {
//   return children
//     .flat(Infinity)
//     .filter((child) => child && child !== 0)
//     .map((child) => {
//       if (
//         typeof child === "string" ||
//         typeof child === "number" ||
//         typeof child === "boolean"
//       ) {
//         return vnode(
//           undefined,
//           undefined,
//           undefined,
//           child.toString(),
//           undefined
//         );
//       } else {
//         return child as VNode;
//       }
//     });
// }
