import cloneDeep from "lodash/cloneDeep";
import { h, VNode } from "snabbdom";
import {
  pushAndClearOnRenderActions,
  pushAndClearOnMountActions,
} from "./hooks";
import { Component } from "./interfaces";
import {
  AnyState,
  ComponentFactory,
  OnMountAction,
  OnRenderAction,
  Setup,
} from "./interfaces";
import { patch } from "./vdom";

/**
 * Make a factory for creating components from a setup function.
 *
 * For each *instance* of the component, the factory should be
 * called with the instance's initial state.
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
    const state: S = cloneDeep(initialState);
    const onRenderActions: OnRenderAction<S>[] = [];
    const onMountActions: OnMountAction<S>[] = [];
    let currentNode: VNode;

    const get = (name: keyof S): any => {
      return state[name];
    };

    /**
     * Set a single state value or multiple state values.
     *
     * @param nameOrState
     *   Name of state entry to set *or* an object with key/value pairs
     *   of entries to set.
     * @param value
     *   Value of state entry when {@param nameOrState} is a name.
     * @throws Error
     *   When {@param nameOrState} is an object *and* {@param value} is
     *   passed too.
     */
    const set = (nameOrState: keyof S | Record<keyof S, any>, value?: any) => {
      if (typeof nameOrState === "object") {
        if (typeof value !== "undefined") {
          throw new Error(
            "value can't be passed when setting state from object"
          );
        }
        Object.entries(nameOrState).forEach(([name, val]: [string, any]) => {
          if (typeof val === "function") {
            val = val(state[name as keyof S]);
          }
          state[name as keyof S] = val;
        });
      } else {
        if (typeof value === "function") {
          value = value(state[nameOrState]);
        }
        state[nameOrState] = value;
      }

      component.render();
    };

    const reset = () => {
      set(initialState);
    };

    const createNode = setup({ initialState, get, set, reset });

    pushAndClearOnRenderActions(onRenderActions);
    pushAndClearOnMountActions(onMountActions);

    const component = {
      runOnRenderActions() {
        onRenderActions.forEach((action) => action(state));
      },

      runOnMountActions() {
        onMountActions.forEach((action) => action(state));
      },

      createNode(state: S) {
        currentNode = createNode(state) as VNode;
        currentNode.children = currentNode.children ?? [];
        currentNode.children.push(
          h(
            "div",
            {
              hook: {
                insert: () => {
                  requestAnimationFrame(() => {
                    component.runOnRenderActions();
                    component.runOnMountActions();
                  });
                },
              },
              attrs: {
                style: `display: "none"`,
              },
            },
            h("!", "MOUNT HOOK")
          ) as VNode
        );
        return currentNode;
      },

      mount(mountPoint: Element) {
        const newNode = component.createNode(state);
        currentNode = patch(mountPoint, newNode);
      },

      render() {
        const oldNode = currentNode;
        const newNode = component.createNode(state);
        currentNode = patch(oldNode, newNode);
        requestAnimationFrame(() => {
          onRenderActions.forEach((action) => action(state));
        });
        return currentNode;
      },
    };

    return component;
  };
}
