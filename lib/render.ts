import Component from "./component";
import { VNode } from "./nodes";
import registry from "./registry";
import { AnyState, Setup } from "./typedefs";

/**
 * Register component.
 *
 * This takes a setup function and produces a Component instance. The
 * instance is registered in a registry, although the registry isn't
 * currently used for anything.
 *
 * @param setup
 * @param initialState
 */
export function register<S extends AnyState>(
  setup: Setup<S>,
  initialState: S
): Component<S> {
  const component = new Component<S>(setup, null, initialState);
  registry.registerComponent(component);
  return component;
}

/**
 * Mount component into DOM.
 *
 * Generally, this is called on your app's root component. It will
 * render the component then append it to the specified mount point.
 *
 * @param component Component to mount
 * @param mountPoint DOM node selector for component
 */
export function mount<S extends AnyState>(
  component: Component<S>,
  mountPoint: string | Element
): void {
  if (typeof mountPoint === "string") {
    const element = document.querySelector(mountPoint);
    if (element) {
      mountPoint = element;
    } else {
      throw new Error(`DOM element matching selector not found: ${mountPoint}`);
    }
  }
  component.mount(mountPoint);
}

export function render<S extends AnyState>(
  component: Component<S>,
  parentNode: Element,
  oldNode?: VNode
): Element {
  const element = vnodeToElement(component);
  if (oldNode && oldNode.element) {
    parentNode.removeChild(oldNode.element);
  }
  parentNode.appendChild(element);
  return element;
}

function vnodeToElement<S extends AnyState>(component: Component<S>): Element {
  const node = component.getNode();

  let element: Element;

  if (typeof node.type === "string") {
    // HTML node
    element = createElement(node.type, node.attributes);
  } else {
    // Component node
    const n: any = node.type(node.attributes);
    element = vnodeToElement(n);
  }

  node.children.forEach((child) => {
    let childElement;
    if (typeof child === "object" && child.type) {
      childElement = vnodeToElement(child);
    } else {
      childElement = document.createTextNode(child.toString());
    }
    element.appendChild(childElement);
  });

  node.element = element;
  return element;
}

/**
 * Create an element from the specified tag and attributes.
 *
 * @param tagName
 * @param attributes
 */
function createElement(
  tagName: string,
  attributes: Record<string, unknown> | null
) {
  const el = document.createElement(tagName);
  if (attributes) {
    Object.entries(attributes).forEach(([name, val]) => {
      if (name.startsWith("on") && name.length > 2) {
        const type = name.slice(2).toLowerCase();
        if (typeof val === "function") {
          el.addEventListener(type, val as (...args: any[]) => any, false);
        } else {
          throw new Error(`Expected function for event handler: ${name}`);
        }
      } else {
        val = val ?? "";
        el.setAttribute(name, val as string);
      }
    });
  }
  return el;
}
