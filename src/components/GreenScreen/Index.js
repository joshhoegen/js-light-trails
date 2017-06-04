import React from 'react';
import ReactDOM from 'react-dom';
import {Trails} from '../../lib/HTML5ChromaKey/chroma-demo0';
import ColorPickerPanel from 'rc-color-picker';

import 'rc-color-picker/assets/index.css';

// Home page component
// export default class Home extends React.Component {
//   // render
//   render() {
//     return (
//       <div className='page-home'>
//         <h4>Hello world!</h4>
//       </div>
//     );
//   }
// }

export default class GreenScreen   extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      size: 4
    }
    // this.hexToRgbA = this.hexToRgbA.bind(this);
  }

  componentDidMount() {
      // init();
      this.trails = new Trails();
      this.trails.draw();
      // console.log(trails);
      // if (window.requestAnimationFrame) window.requestAnimationFrame(trails.draw());
      // IE implementation
      // else if (window.msRequestAnimationFrame) window.msRequestAnimationFrame(this.draw);
      // // Firefox implementation
      // else if (window.mozRequestAnimationFrame) window.mozRequestAnimationFrame(this.draw);
      // // Chrome implementation
      // else if (window.webkitRequestAnimationFrame) window.webkitRequestAnimationFrame(this.draw);
  }

  hexToRgbA(hex) {
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return [(c>>16)&255, (c>>8)&255, c&255];
    }
    throw new Error('Bad Hex');
  }

  changeColor(colors) {
    var arr = this.hexToRgbA(colors.color);

    this.trails.selectedR = arr[0];
    this.trails.selectedG = arr[1];
    this.trails.selectedB = arr[2];

    // console.log(arr);
    // this.trails.color = arr;
  }

  closeColor(colors) {
    console.log(colors);
  }

  changePixels(event) {
    // this.setState({size: event.target.value});
    this.trails.pixelSize = event.target.value;
  }

  render() {
    // navbar navbar-fixed-top navbar-inverse
    return (
      <div>
        <div className='' role='navigation'>
          <ColorPickerPanel
            onChange={this.changeColor.bind(this)}
            onClose={this.closeColor.bind(this)}
            placement='topLeft'
            className='color-picker'>
            <span className='rc-color-picker-trigger'/>
          </ColorPickerPanel>
          <input
            id="pixelSize"
            type="range"
            min="2" max="16"
            value={this.state.size}
            onChange={this.changePixels.bind(this)}
            step="1"/>
        </div>{/* /.navbar */}
        <div className='container'>
          <hr />
          <footer>
            <p>© Company 2013</p>
          </footer>
        </div>{/*/.container*/}
        <div id='wrapper'>
          <div id='output'>
            <canvas id='videoscreen'>
              <p>Sorry your browser does not support HTML5</p>
            </canvas>
          </div>
          <div id='source'>
            <video style={{}} id='videodata' loop='loop' preload='auto' autoPlay='autoplay' width={600} height={400}>

            </video>
          </div>
        </div>
      </div>
    );
  }
};
