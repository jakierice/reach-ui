import React from "react";
import ReactDOM from "react-dom";
import renderer, { Simulate } from "react-test-renderer";
import Component from "./index";

let snapshot = element => {
  let wrapper = renderer.create(element);
  const tree = wrapper.toJSON();
  expect(tree).toMatchSnapshot();
  return tree;
};

describe("rendering", () => {
  it("renders without figuritively exploding", () => {
    snapshot(
      <Component>
        <div>Heyyyooooo</div>
      </Component>
    );
  });
  it("prefers `render` over `children`", () => {
    snapshot(
      <Component
        render={() => (
          <div>
            <h1>Render with an actual "render" prop</h1>
          </div>
        )}
      />
    );
  });
  it("renders without children", () => {
    snapshot(<Component />);
  });
  it("renders with normal children", () => {
    snapshot(
      <Component>
        <div>
          <h1>Some regular children!</h1>
          <p>This is another child in the regular children group.</p>
        </div>
      </Component>
    );
  });
  it("renders with children render prop", () => {
    snapshot(
      <Component>
        {() => (
          <div>
            <h1>Using children prop as render prop!</h1>
            <p>
              This is a pretty neat pattern. I'm really glad someone thought of
              it.
            </p>
          </div>
        )}
      </Component>
    );
  });
});

// describe("refs", () => {
//   it("maintains refs from render to render");
// });

describe("state", () => {
  it("receives initialState", () => {
    snapshot(
      <Component
        initialState={{
          favoriteColor: "purple",
          favoriteFood: "cheeseburgers",
          displayName: "Henry Winkler"
        }}
      >
        {({ state }) => (
          <div>
            <h1>{state.displayName}</h1>
            <h2>Favorites</h2>
            <ol>
              <li>Color: {state.favoriteColor}</li>
              <li>Food: {state.favoriteFood}</li>
            </ol>
          </div>
        )}
      </Component>
    );
  });
  it("calls getInitialState", () => {
    snapshot(
      <Component
        favoriteColor="green"
        favoriteFood="calzones"
        displayName="Jane Fonda"
        getInitialState={props => ({ ...props })}
      >
        {({ state }) => (
          <div>
            <h1>{state.displayName}</h1>
            <h2>Favorites</h2>
            <ol>
              <li>Color: {state.favoriteColor}</li>
              <li>Food: {state.favoriteFood}</li>
            </ol>
          </div>
        )}
      </Component>
    );
  });
  it("updates state", () => {
    const container = document.createElement("div");
    const mockClickEvent = jest.fn(setState => () => {
      setState(prevState => ({ goodAtTesting: !prevState.goodAtTesting }));
    });
    const wrapper = (
      <Component initialState={{ goodAtTesting: false }}>
        {({ state, setState }) => (
          <div>
            <h1>{state.goodAtTesting ? "Yay!" : "Boo!"}</h1>
            <button onClick={() => mockClickEvent(setState)}>
              Learn some more
            </button>
          </div>
        )}
      </Component>
    );

    ReactDOM.render(wrapper, container);
    const textElement = container.querySelector("h1").firstChild.nodeValue;

    expect(textElement).toBe("Boo!");
    // expect(mockClickEvent).toHaveBeenCalled();
  });
});

describe("didMount", () => {
  it("does not require it", () => {
    snapshot(
      <Component>
        <h1>No need for didMount prop for rendering!</h1>
      </Component>
    );
  });
  it("calls it with the right args", () => {
    const COMPONENT_ARGS = {
      state: null,
      props: {},
      refs: {},
      setState: expect.any(Function),
      forceUpdate: expect.any(Function)
    };

    const didMountFunction = jest.fn();
    const wrapper = <Component didMount={didMountFunction} />;

    const testComponent = renderer.create(wrapper);

    expect(testComponent.root).not.toBe(null);

    expect(didMountFunction).toHaveBeenCalledTimes(1);
    expect(didMountFunction).toHaveBeenCalledWith(COMPONENT_ARGS);
  });
});

describe("willUnmount", () => {
  it("does not require it", () => {
    snapshot(
      <Component>
        <h1>Don't need willUnmount prop in order to render!</h1>
      </Component>
    );
  });
  it("calls it with the right args", () => {
    const COMPONENT_ARGS = {
      state: null,
      props: {},
      refs: {}
    };

    const willUnmountFunction = jest.fn();
    const wrapper = <Component willUnmount={willUnmountFunction} />;

    const testComponent = renderer.create(wrapper);

    expect(testComponent.root).not.toBe(null);

    testComponent.unmount();

    expect(willUnmountFunction).toHaveBeenCalledTimes(1);
    expect(willUnmountFunction).toHaveBeenCalledWith(COMPONENT_ARGS);
  });
});

describe("didUpdate", () => {
  it("does not require it", () => {
    snapshot(
      <Component>
        <h1>Can render without didUpdate prop!</h1>
      </Component>
    );
  });
  // it("calls it with the right args");
});

describe("getSnapshotBeforeUpdate", () => {
  it("does not require it", () => {
    snapshot(
      <Component>
        <h1>getSnapshotBeforeUpdate prop is not necessary for render!</h1>
      </Component>
    );
  });
  // it("calls it with the right args");
  // it("returns to cDU correctly");
});

describe("shouldUpdate", () => {
  it("does not require it", () => {
    snapshot(
      <Component>
        <h1>Can render without shouldUpdate prop.</h1>
      </Component>
    );
  });
  // it("calls it with the right args");
  // it("returns correctly");
});
