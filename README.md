# WorkFrame.js

This is an experimental front end JavaScript framework. It's based on
the idea of React with hooks but where A) the hooks aren't defined
inside the render function and B) have names that are more meaningful
and easier to understand (for me anyway).

There's a basic example app here:
https://github.com/wylee/workframe-example.

NOTE: This is a learning project and isn't intended for use in
production. There are no docs, features are missing, etc.

## Features

- Components are defined via setup functions that return render
  functions. There are no class-based components.
- A component's setup function accepts a function for setting the
  component's state (and setting its state will cause a rerender).
- Inside the *setup* function, not the render function, "hooks" like
  `onMount` and `onRender` can be called. These serve a purpose similar
  to React's `useEffect`.
- The render function is expected to return a JSX element.
- A component's render function and hooks are called with the
  component's current state.
- Event handlers are configured like React using `onClick`, `onInput`,
  etc.

## Known Issues

- Only the `onMount` and `onRender` hooks are currently implemented.
- Because of the way `snabbdom` works, setting HTML attributes like
  `id="app"` doesn't work; this will require intercepting incoming
  virtual node data and converting it so `snabbdom` understands it.

## Example Component

    import { mount, onMount } from "workframe";

    const App (set) => {
      onRender((state) => {
        // This is called on *every* render
      });

      onMount((state) => {
        // Fetch some data, etc
        // This is called only when the component is first mounted
      });

      const setName = (name) => {
        set("name", name);
      };

      return (state) => {
        const { name } = state;
        return (
          <div>
            <input value={name} onInput={(event) => setName(event.target.value)} />
            <p>Hello, {name}</p>
          </div>
        );
      }
    };

    mount(App, "#app", { name: "Anonymous" });
