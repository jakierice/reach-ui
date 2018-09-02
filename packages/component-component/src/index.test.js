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

describe("refs", () => {
  it("maintains refs from render to render", () => {
    const MOCK_REFS = {
      firstDummyRef: { current: "FIRST_MOCK_NODE" },
      secondDummyRef: { current: "SECOND_MOCK_NODE" }
    };
    const testComponent = renderer.create(<Component refs={MOCK_REFS} />);

    // assert refs match expected on mount
    expect(testComponent.getInstance()._refs).toEqual(MOCK_REFS);

    // "update" component and check if refs still match
    testComponent.update(<Component />);

    expect(testComponent.getInstance()._refs).toEqual(MOCK_REFS);
  });
});

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
    const setStateFunction = jest.fn(setState => {
      setState({ goodAtTesting: true });
    });
    const testComponent = renderer.create(
      <Component initialState={{ goodAtTesting: false }}>
        {({ state, setState }) => (
          <div>
            <button
              className="test-button"
              onClick={() => setStateFunction(setState)}
            >
              Get Good
            </button>
          </div>
        )}
      </Component>
    );

    const buttonElement = testComponent.root.findByProps({
      className: "test-button"
    });

    // assert state to match initialState
    expect(testComponent.getInstance().state.goodAtTesting).toBe(false);

    // trigger returned setState function using mock click event
    buttonElement.props.onClick();
    expect(setStateFunction).toHaveBeenCalled();

    // assert that state has been updated
    expect(testComponent.getInstance().state.goodAtTesting).toBe(true);
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
  it("calls it with the right args", () => {
    const COMPONENT_ARGS = {
      state: null,
      props: {},
      refs: {},
      setState: expect.any(Function),
      forceUpdate: expect.any(Function),
      prevProps: {},
      prevState: null
    };

    const didUpdateFunction = jest.fn();
    const testComponent = renderer.create(
      <Component didUpdate={didUpdateFunction} />
    );

    expect(testComponent.root).not.toBe(null);

    testComponent.update(<Component didUpdate={didUpdateFunction} />);

    expect(didUpdateFunction).toHaveBeenCalled();
    expect(didUpdateFunction).toHaveBeenCalledWith(COMPONENT_ARGS, null);
  });
});

describe("getSnapshotBeforeUpdate", () => {
  it("does not require it", () => {
    snapshot(
      <Component>
        <h1>getSnapshotBeforeUpdate prop is not necessary for render!</h1>
      </Component>
    );
  });
  it("calls it with the right args", () => {
    const COMPONENT_ARGS = {
      state: null,
      props: {},
      refs: {},
      setState: expect.any(Function),
      forceUpdate: expect.any(Function),
      prevProps: {},
      prevState: null
    };

    const getSnapshotBeforeUpdateFunction = jest.fn();
    const testComponent = renderer.create(
      <Component didUpdate={getSnapshotBeforeUpdateFunction} />
    );

    expect(testComponent.root).not.toBe(null);

    testComponent.update(
      <Component didUpdate={getSnapshotBeforeUpdateFunction} />
    );

    expect(getSnapshotBeforeUpdateFunction).toHaveBeenCalledTimes(1);
    expect(getSnapshotBeforeUpdateFunction).toHaveBeenCalledWith(
      COMPONENT_ARGS,
      null
    );
  });
  it("returns to cDU correctly", () => {
    const COMPONENT_ARGS = {
      state: null,
      props: {},
      refs: {},
      setState: expect.any(Function),
      forceUpdate: expect.any(Function),
      prevProps: {},
      prevState: null
    };

    const didUpdateFunction = jest.fn();
    const getSnapshotBeforeUpdateFunction = jest.fn(() => "SNAPSHOT");
    const testComponent = renderer.create(
      <Component
        didUpdate={didUpdateFunction}
        getSnapshotBeforeUpdate={getSnapshotBeforeUpdateFunction}
      />
    );

    expect(testComponent.root).not.toBe(null);

    testComponent.update(
      <Component
        didUpdate={didUpdateFunction}
        getSnapshotBeforeUpdate={getSnapshotBeforeUpdateFunction}
      />
    );

    expect(didUpdateFunction).toHaveBeenCalledTimes(1);
    expect(didUpdateFunction).toHaveBeenCalledWith(COMPONENT_ARGS, "SNAPSHOT");
  });
});

describe("shouldUpdate", () => {
  const SHOULD_UPDATE_ARGS = {
    state: null,
    props: {},
    nextProps: {},
    nextState: null
  };

  it("does not require it", () => {
    snapshot(
      <Component>
        <h1>Can render without shouldUpdate prop.</h1>
      </Component>
    );
  });
  it("calls it with the right args", () => {
    const shouldUpdateFunction = jest.fn(() => false);
    const testComponent = renderer.create(
      <Component shouldUpdate={shouldUpdateFunction} />
    );

    expect(testComponent.root).not.toBe(null);

    testComponent.update(<Component shouldUpdate={shouldUpdateFunction} />);

    expect(shouldUpdateFunction).toHaveBeenCalledTimes(1);
    expect(shouldUpdateFunction).toHaveBeenCalledWith(SHOULD_UPDATE_ARGS);
  });
  it("returns correctly", () => {
    const shouldUpdateFunction = jest.fn(() => false);
    const testComponent = renderer.create(<Component />);
    const testShouldUpdateComponent = renderer.create(
      <Component shouldUpdate={shouldUpdateFunction} />
    );

    // "update" Component without shouldUpdate()
    testComponent.update(<Component />);

    // assert that shouldUpdate callback has not been called
    expect(shouldUpdateFunction).not.toHaveBeenCalled();

    // "update" Component with shouldUpdate() prop
    testShouldUpdateComponent.update(
      <Component shouldUpdate={shouldUpdateFunction} />
    );

    // assert that shouldUpdate has been called with args
    expect(shouldUpdateFunction).toHaveBeenCalledWith(SHOULD_UPDATE_ARGS);
  });
});
