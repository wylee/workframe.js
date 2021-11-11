# WorkFrame.js

This is an experimental front end JavaScript framework. It's based on
the idea of React with hooks but where A) the hooks are defined in a
setup function rather than in the render function and B) have names that
are more meaningful and easier to understand (for me anyway).

Component setup functions are somewhat similar to the setup functions in
Vue 3 when using the composition API. For each instance of a component,
the corresponding setup function is called to configure the instance.

There's a basic example app here:
https://github.com/wylee/workframe-example.

NOTE: This is a learning project and isn't intended for use in
production. There are no docs, features are missing, etc.

## Features

- Elm-like architecture where the application state is defined in a
  single object and is updated via actions.
- Components are defined via setup functions that return render
  functions. There are no class-based components.
- Inside a component's *setup* function, not the render function,
  "hooks" like `onMount` and `onRender` can be called. These serve a
  purpose similar to React's `useEffect`.
- JSX is supported. When using JSX, event handlers are configured like
  React using `onClick`, `onInput`, etc.
- A component's render function and hook actions are called with the
  component's current state.

## Known Issues

- Only the `onMount` and `onRender` hooks are currently implemented.
- Figuring out how/when/where to trigger `onMount` and `onRender`
  actions is tricky.

## Example Component

    import { mount, onMount } from "workframe";

    // The component setup function is used to set up hook actions and
    // returns the component's render function.
    const App (initialState) => {
      onMount((state) => {
        // Fetch some data, etc.
        // This is called only when the component is first mounted.
        // It's called *after* render actions.
      });

      onRender((state) => {
        // This is called on *every* render.
      });

      return (state) => {
        const { name } = state;
        return (
          <div>
            <input
              value={name}
              onInput={(event) => setName(event.target.value)}
            />
            <p>Hello, {name}</p>
          </div>
        );
      }
    };

    // This is where the app's state is actually updated. This isn't
    // called directly--see below. This function should always return
    // a new state object.
    function updater(state, action) {
      const { type, data } = action;
      switch (type) {
        case "SET_NAME":
          return {
            ...state,
            name: data.name,
          };
        default:
          throw new Error(`Unknown action type: ${action.type}`);
      }
    }

    // This is an action. It updates the app state, which will in turn
    // trigger a rerender.
    function setName(name: string) {
      return updateState({ type: "SET_NAME", data: { name } });
    }

    // This is the main entry point. It mounts the component into the
    // DOM and returns a function that's configured to update the view/
    // DOM whenever the app's state is updated. The new state will flow
    // down from the root component.
    const updateState = mount(
      App,
      "#mount-point",
      updater,
      { name: "Anonymous" },
    );
