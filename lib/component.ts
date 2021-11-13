import { h, vnode, VNode } from "snabbdom";
import { consumeOnRenderActions, consumeOnMountActions } from "./hooks";
import { Component } from "./interfaces";
import {
  AnyState,
  ComponentFactory,
  OnMountAction,
  OnRenderAction,
  Setup,
} from "./interfaces";

/**
 * Make a factory for creating components from a setup function.
 *
 * For each *instance* of the component, the factory will be called with
 * the instance's initial state.
 *
 * @param setup
 */
export function makeComponentFactory<S extends AnyState>(
  setup: Setup<S>,
  getState: () => AnyState
): ComponentFactory<S> {
  /**
   * Create a component instance.
   *
   * This function is the configured factory.
   *
   * @param initialState
   */
  return function makeComponent(initialState: S): Component<S> {
    const createNode = setup(initialState);
    const onMountActions: OnMountAction<AnyState>[] = [];
    const onRenderActions: OnRenderAction<AnyState>[] = [];

    onMountActions.push(...consumeOnMountActions());
    onRenderActions.push(...consumeOnRenderActions());

    const component = {
      name: setup.name,

      createNode(state: S, children?: any[]) {
        const node = createNode(state, children) as VNode;
        setRootComponentOfChildren(node, component);
        addMountHookChild(node, component);
        return node;
      },

      runOnMountActions() {
        onMountActions.forEach((action) =>
          requestAnimationFrame(() => action(getState()))
        );
      },

      runOnRenderActions() {
        onRenderActions.forEach((action) =>
          requestAnimationFrame(() => action(getState()))
        );
      },
    };

    return component;
  };
}

function addMountHookChild<S extends AnyState>(
  node: VNode,
  component: Component<S>
) {
  node.children = node.children ?? [];
  node.children.push(
    h(
      "div",
      {
        hook: {
          insert: () => {
            component.runOnMountActions();
          },
        },
        attrs: {
          style: `display: "none"`,
        },
      },
      h("!", "MOUNT HOOK")
    ) as VNode
  );
}

// Set root component of node's children, their children, and so on.
// This is used to determine when a component is rendered.
function setRootComponentOfChildren<S extends AnyState>(
  node: VNode,
  component: Component<S>
) {
  const children = node.children;
  if (children) {
    children.forEach((child: string | VNode, i) => {
      if (typeof child === "object" && child.data?.rootComponent) {
        // This child has a closer root component further down the tree.
        return;
      }
      if (typeof child === "string") {
        child = children[i] = vnode(
          undefined,
          { rootComponent: component },
          undefined,
          child,
          undefined
        );
      } else {
        child.data = child.data ?? {};
        child.data.rootComponent = component;
      }
      setRootComponentOfChildren(child, component);
    });
  }
}
