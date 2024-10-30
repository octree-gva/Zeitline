import React from "react";
import { render, cleanup } from "@testing-library/react";
// import "@testing-library/jest-dom/extend-expect";
import Zeitline from "../src";

// import React from "react";
// import { render, unmountComponentAtNode } from "react-dom";
// import { render as rtlRender, cleanup } from "@testing-library/react";
// import "@testing-library/jest-dom/extend-expect";
// import Zeitline from "src/";

describe("Zeitline", () => {
  afterEach(() => {
    cleanup();
  });

  it("has an svg node", () => {
    const { container } = render(<Zeitline />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("has two events", () => {
    const { container } = render(
      <Zeitline
        data={[
          { date: new Date("30 Jun 2017"), label: "first" },
          { date: new Date("10 Jul 2017"), label: "second" },
        ]}
      />
    );
    expect(container.querySelectorAll(".event-group").length).toEqual(2);
  });

  it("has no more svg node after unmount", () => {
    const { container, unmount } = render(<Zeitline />);
    unmount();
    expect(container.innerHTML).toEqual("");
  });
});

// import expect from 'expect'
// import React from 'react'
// import {render, unmountComponentAtNode} from 'react-dom'

// import Zeitline from 'src/'

// describe('Zeitline', () => {
//   let node

//   beforeEach(() => {
//     node = document.createElement('div')
//   })

//   afterEach(() => {
//     unmountComponentAtNode(node)
//   })

//   it('have a svg node', () => {
//     render(<Zeitline/>, node, () => {
//       expect(node.innerHTML).toContain('svg')
//     })
//   })

//   it('have two events', () => {
//     render(<Zeitline data={[
//       {date: new Date('30 Jun 2017'), label: 'first'},
//       {date: new Date('10 Jul 2017'), label: 'second'},
//     ]}/>, node, () => {
//       expect(node.querySelectorAll('.event-group').length).toEqual(2)
//     })
//   })

//   it('have no more svg node', () => {
//     render(<Zeitline/>, node, () => {
//       unmountComponentAtNode(node);
//       expect(node.innerHTML).toEqual('')
//     })
//   })
// })
