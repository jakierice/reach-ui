import React, { Fragment } from "react";
import ReactDOM from "react-dom";
import renderer from "react-test-renderer";
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
          <Fragment>
            <h1>Using children prop as render prop!</h1>
            <p>
              This is a pretty neat pattern. I'm really glad someone thought of
              it.
            </p>
          </Fragment>
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
  //   it("updates state");
});

// describe("didMount", () => {
//   it("does not require it");
//   it("calls it with the right args");
// });

// describe("willUnmount", () => {
//   it("does not require it");
//   it("calls it with the right args");
// });

// describe("didUpdate", () => {
//   it("does not require it");
//   it("calls it with the right args");
// });

// describe("getSnapshotBeforeUpdate", () => {
//   it("does not require it");
//   it("calls it with the right args");
//   it("returns to cDU correctly");
// });

// describe("shouldUpdate", () => {
//   it("does not require it");
//   it("calls it with the right args");
//   it("returns correctly");
// });
