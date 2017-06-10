import React from 'react';
import ReactDOM from 'react-dom';
import {Trails} from '../../lib/HTML5ChromaKey/Trails';
import ColorPickerPanel from 'rc-color-picker';

import 'rc-color-picker/assets/index.css';

export default class GreenScreen extends React.Component {
  constructor(props) {
    super(props);

    const isHex  = /(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i.test(this.props.hex);
    const prefix = '#';
    let hex = isHex == true ? this.props.hex : '#2ab050';

    if (hex.substr(0, prefix.length) !== prefix) {
        hex = prefix + hex;
    }

    this.state = {
      size: 4,
      pixelate: false,
      color: hex
    }
  }

  componentDidMount() {
      this.trails = new Trails(this.hexToRgbA(this.state.color));
      this.trails.draw();
  }

  hexToRgbA(hex) {
    let c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= `0x${c.join('')}`;
        return [(c>>16)&255, (c>>8)&255, c&255];
    }
    throw new Error('Bad Hex');
  }

  changeColor(colors) {
    const arr = this.hexToRgbA(colors.color);

    this.trails.selectedR = arr[0];
    this.trails.selectedG = arr[1];
    this.trails.selectedB = arr[2];

  }

  changeSize(event) {
    const size = event.target.value;
    this.trails.stopDraw();
    this.trails.pixelSize = size;
    this.setState(function(currentState) {
      this.changePixels();
      return {
        size
      }
    });

  }

  togglePixel(event) {
    this.trails.stopDraw();
    this.setState({
      pixelate: event.target.checked
    });
    // TODO: Create Trails.pixelate instead of Trails.mode
    if (event.target.checked == true) {
      this.trails.mode = 'pixelate';
    } else {
      this.trails.mode = 'blur';
    }
    this.changePixels();
  }

  changePixels() {
    this.trails.draw();
  }

  render() {
    return (
      <div>
        <div className='controls' role='navigation'>
          <div className='controls-wrapper'>
            <ColorPickerPanel
              defaultColor={this.state.color}
              onChange={this.changeColor.bind(this)}
              placement='topLeft'
              className='color-picker'>
              <span className='rc-color-picker-trigger'/>
            </ColorPickerPanel>
            <label>Size</label><input
              id='pixelSize'
              name='pixelSize'
              type='range'
              min='0' max='12'
              defaultValue={this.state.pixelate}
              step='2'
              onChange={this.changeSize.bind(this)} />
            <label>Pixelate</label><input
              id='pixelate'
              name='pixelate'
              type='checkbox'
              onChange={this.togglePixel.bind(this)} />
          </div>
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
