import React from "react";
import GreenScreen from "./GreenScreen/index";

console.log(GreenScreen);

// Home page component
export default class Home extends React.Component {
  // render
  render() {
    return (
      <div className="page-home">
        <GreenScreen />
        <h4>Hello world!</h4>
      </div>
    );
  }
}
