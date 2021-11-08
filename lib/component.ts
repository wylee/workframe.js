import cloneDeep from "lodash/cloneDeep";
import { h, VNode } from "snabbdom";
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
  setup: Setup<S>
): ComponentFactory<S> {
  /**
   * Create a component instance.
   *
   * This function is the configured factory.
   *
   * @param initialState
   */
  return function makeComponent(initialState: S): Component<S> {
    const onRenderActions: OnRenderAction<S>[] = [];
    const onMountActions: OnMountAction<S>[] = [];
    const createNode = setup(initialState);

    onRenderActions.push(...consumeOnRenderActions());
    onMountActions.push(...consumeOnMountActions());

    const component = {
      runOnRenderActions(state: S) {
        onRenderActions.forEach((action) =>
          requestAnimationFrame(() => action(state))
        );
      },

      runOnMountActions(state: S) {
        onMountActions.forEach((action) =>
          requestAnimationFrame(() => action(state))
        );
      },

      createNode(state: S) {
        const node = createNode(state) as VNode;
        node.children = node.children ?? [];
        node.children.push(
          h(
            "div",
            {
              hook: {
                insert: () => {
                  component.runOnRenderActions(state);
                  component.runOnMountActions(state);
                },
              },
              attrs: {
                style: `display: "none"`,
              },
            },
            h("!", "MOUNT HOOK")
          ) as VNode
        );
        return node;
      },
    };

    return component;
  };
}
