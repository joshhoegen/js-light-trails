import React from "react";
import {Trails} from "../../lib/HTML5ChromaKey/chroma-demo0";

// Home page component
// export default class Home extends React.Component {
//   // render
//   render() {
//     return (
//       <div className="page-home">
//         <h4>Hello world!</h4>
//       </div>
//     );
//   }
// }

export default class GreenScreen   extends React.Component {
  componentDidMount() {
      // init();
      var trails = new Trails();
      trails.draw();
      // console.log(trails);
      // if (window.requestAnimationFrame) window.requestAnimationFrame(trails.draw());
      // IE implementation
      // else if (window.msRequestAnimationFrame) window.msRequestAnimationFrame(this.draw);
      // // Firefox implementation
      // else if (window.mozRequestAnimationFrame) window.mozRequestAnimationFrame(this.draw);
      // // Chrome implementation
      // else if (window.webkitRequestAnimationFrame) window.webkitRequestAnimationFrame(this.draw);
  }

  render() {
    return (
      <div>
        <div className="navbar navbar-fixed-top navbar-inverse" role="navigation">
          <div className="container">
            <div className="navbar-header">
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
              <a className="navbar-brand" href="#">Project name</a>
            </div>
            <div className="collapse navbar-collapse">
              <ul className="nav navbar-nav">
                <li className="active"><a href="#">Home</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>{/* /.nav-collapse */}
          </div>{/* /.container */}
        </div>{/* /.navbar */}
        <div className="container">
          <hr />
          <footer>
            <p>© Company 2013</p>
          </footer>
        </div>{/*/.container*/}
        <div id="wrapper">
          <div id="output">
            <canvas id="videoscreen">
              <p>Sorry your browser does not support HTML5</p>
            </canvas>
          </div>
          <div id="source">
            <video style={{}} id="videodata" loop="loop" preload="auto" autoPlay="autoplay" width={600} height={400}>

            </video>
          </div>
        </div>
      </div>
    );
  }
};
