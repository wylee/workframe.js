# WorkFrame

This is an experimental front end JavaScript framework. It's based on
the idea of React with hooks but where A) the hooks aren't defined
inside the render function and B) have names that are more meaningful
and easier to understand (for me anyway).

There's no VDOM, so performance probably isn't great, but this is just
an API proof-of-concept, so performance doesn't really matter.

There's a basic example app here:
https://github.com/wylee/workframe-example.

NOTE: This is a learning project and isn't intended for use in
production. There are no docs, features are missing, etc.

## Features

- Components are defined via setup functions that return render
  functions. There are no class-based components.
- Inside the setup function, "hooks" like `onMount` and `onRender` can
  be called. These serve a purpose similar to React's `useEffect`.
- The render function is expected to return JSX.
- A component's render function and hooks are called with the
  component's current state and a function for setting state.

## Known Issues

- Child components currently aren't implemented.
- Only the `onMount` and `onRender` hooks are currently implemented.
- VDOM/diffing isn't implemented. Beside possibly causing poor
  performance, this also makes input elements lose focus on re-render.

## Example Component

    import { mount, onMount } from "workframe";

    const App () => {
      onMount((state, set) => {
        set("someKey", someValue);
      });

      const onInput = (event, set) => {
        set("name", event.target.value);
      };

      return (state, set) => {
        return (
          <div>
            <input value={state.name} onInput={(event) => onInput(event, set)} />
            <p>Hello, {state.name}</p>
          </div>
        );
      }
    };

    mount(App, "#app", { name: "Anonymous" });
