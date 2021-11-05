import { VNode } from "snabbdom";
import { onMountActions, onRenderActions } from "./hooks";
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
  return function makeComponentFactory(initialState: S): Component<S> {
    const state: S = { ...initialState };
    const renderActions: OnRenderAction<S>[] = [];
    const mountActions: OnMountAction<S>[] = [];
    let currentNode: VNode;

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

    const createNode = setup(set);

    mountActions.push(...onMountActions);
    renderActions.push(...onRenderActions);

    onRenderActions.splice(0, onRenderActions.length);
    onMountActions.splice(0, onMountActions.length);

    const component = {
      createNode(state: S) {
        currentNode = createNode(state) as VNode;
        return currentNode;
      },

      mount(mountPoint: Element) {
        const newNode = component.createNode(state);
        currentNode = patch(mountPoint, newNode);
        renderActions.forEach((action) => action(state));
        mountActions.forEach((action) => action(state));
      },

      render() {
        const mount = typeof currentNode === "undefined";
        const oldNode = currentNode;
        const newNode = component.createNode(state);
        currentNode = patch(oldNode, newNode);
        if (currentNode !== oldNode) {
          renderActions.forEach((action) => action(state));
        }
        if (mount) {
          mountActions.forEach((action) => action(state));
        }
        return currentNode;
      },
    };

    return component;
  };
}
