import React from 'react';
import ReactDOM from 'react-dom';
import {Trails} from '../../lib/HTML5ChromaKey/chroma-demo0';
import ColorPickerPanel from 'rc-color-picker';

import 'rc-color-picker/assets/index.css';

export default class GreenScreen extends React.Component {
  constructor(props) {
    super(props);

    var isHex  = /(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i.test(this.props.hex)
    var hex = isHex == true ? this.props.hex : '#2ab050';
    var prefix = '#';

    if (hex.substr(0, prefix.length) !== prefix) {
        hex = prefix + hex;
    }

    this.state = {
      size: 4,
      color: hex
    }
  }

  componentDidMount() {
      this.trails = new Trails(this.hexToRgbA(this.state.color));
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

  }

  changeSize(event) {
    console.log(event.target.value);
    this.setState({
      size: event.target.value
    });
  }

  changePixels() {

    // this.trails.pixelSize = this.state.size;
  }

  render() {
    // <input
    //   id="pixelSize"
    //   type="range"
    //   min="0" max="16"
    //   defaultValue={this.state.size}
    //   step="2"
    //   onChange={this.changeSize.bind(this)}
    //   onMouseUp={this.changePixels.bind(this)} />
    return (
      <div>
        <div className='controls' role='navigation'>
          <ColorPickerPanel
            defaultColor={this.state.color}
            onChange={this.changeColor.bind(this)}
            placement='topLeft'
            className='color-picker'>
            <span className='rc-color-picker-trigger'/>
          </ColorPickerPanel>
        </div>{/* /.navbar */}
        <div id='wrapper'>
          <div id='source'>
            <video style={{}} id='videodata' loop='loop' preload='auto' autoPlay='autoplay' width={600} height={400}>

            </video>
          </div>
          <div id='output'>
            <canvas id='videoscreen'>
              <p>Sorry your browser does not support HTML5</p>
            </canvas>
          </div>

        </div>
      </div>
    );
  }
};
