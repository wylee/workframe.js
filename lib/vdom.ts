import {
  init,
  jsx,
  attributesModule,
  eventListenersModule,
  JsxVNodeChildren,
  VNode,
  VNodeData,
} from "snabbdom";
import { AnyState, Setup } from "./interfaces";
import registry from "./registry";

export const patch = init([attributesModule, eventListenersModule]);

/**
 * Create a VNode from a JSX node.
 *
 * @param tag An HTML tag name *or* a component setup function
 * @param data HTML attributes & event handles *or* component state
 * @param children
 */
export function createVnodeFromJsxNode<S extends AnyState>(
  tag: string | Setup<S>,
  data: VNodeData | null,
  ...children: JsxVNodeChildren[]
): VNode {
  const isComponent = typeof tag === "function";

  if (data) {
    if (data.attrs) {
      throw new Error("`attrs` cannot be used as a attribute name");
    }

    if (data.on) {
      throw new Error("`on` cannot be used as a attribute name");
    }

    if (isComponent) {
      if (Object.keys(data).some((key) => key.startsWith("on"))) {
        throw new Error("Event handlers cannot be attached to components");
      }
    } else {
      data.attrs = {};
      data.on = {};

      Object.entries(data)
        .filter(([key]) => !["attrs", "on"].includes(key))
        .forEach(([key, val]) => {
          if (key.startsWith("on")) {
            delete data[key];

            let directives: string[] = [];

            key = key.slice(2).toLowerCase();

            if (key.includes(":")) {
              const i = key.indexOf(":");
              directives = key.slice(i + 1).split(":");
              key = key.slice(0, i);
            }

            if (data.on) {
              // XXX: Why is this^ check of data.on necessary?

              // Prevent default unless explicitly requested
              if (
                !directives.includes("default") &&
                ((tag === "form" && key === "submit") ||
                  (tag === "a" && key === "click"))
              ) {
                const originalVal = val;
                val = (event: any, ...args: any[]) => {
                  event.preventDefault();
                  return originalVal(event, ...args);
                };
              }

              data.on[key] = val;
            }
          } else if (data.attrs) {
            // XXX: Why is this^ check of data.attrs necessary?
            data.attrs[key] = val as any;
          }
        });
    }
  }

  if (isComponent) {
    const setup = tag;
    const factory = registry.getOrRegisterComponentFactory(
      setup.$workFrameId,
      setup
    );
    const component: any = factory(data);
    return jsx(component.createNode, data, ...children);
  }

  return jsx(tag, data, ...children);
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
