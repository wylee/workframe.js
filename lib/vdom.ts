import {
  init,
  jsx,
  attributesModule,
  eventListenersModule,
  JsxVNodeChildren,
  VNodeData,
} from "snabbdom";
import { AnyState, Setup } from "./interfaces";
import registry from "./registry";

export const patch = init([attributesModule, eventListenersModule]);

export function createVnodeFromJsxNode<S extends AnyState>(
  tag: string | Setup<S>,
  data: VNodeData | null,
  ...children: JsxVNodeChildren[]
) {
  if (data) {
    if (data.on) {
      throw new Error("`on` cannot be used as a property name");
    }

    data.on = {};

    Object.entries(data).forEach(([key, val]) => {
      if (key.length > 2 && key.startsWith("on")) {
        delete data[key];
        key = key.slice(2).toLowerCase();
        if (data.on) {
          // XXX: Why is this^ check necessary?
          data.on[key] = val as any;
        }
      }
    });
  }

  if (typeof tag === "function") {
    if (data && data.on) {
      if (Object.keys(data.on).length > 0) {
        throw new Error("Can't apply event handlers to components");
      }
      delete data.on;
    }
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
