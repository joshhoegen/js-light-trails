import React from "react";
import GreenScreen from "./GreenScreen/index";

export default class Home extends React.Component {
  componentWillMount(){
    this.query = this.props.location.query;
  }

  render() {
    var query = this.query;
    console.log(query);
    return (
      <div className="page-home">
        <GreenScreen hex={query.hex || "2ab050"} />
      </div>
    );
  }
}
