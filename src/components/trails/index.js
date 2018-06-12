import React from 'react';
import ColorPickerPanel from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';
// import ReactDOM from 'react-dom';
import {Trails} from '../../lib/video-trails/Trails';

export default class GreenScreen extends React.Component {
  constructor(props) {
    super(props);

    const isHex = /(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i.test(this.props.hex);
    const prefix = '#';
    let hex = isHex === true
      ? this.props.hex
      : '#2ab050';

    if (hex.substr(0, prefix.length) !== prefix) {
      hex = prefix + hex;
    }

    this.state = {
      size: this.props.size,
      pixelate: this.props.pixelate,
      color: hex,
      cycle: false
    };
  }

  componentDidMount() {
    let rgb = this.hexToRgbA(this.state.color)
    this.trails = new Trails(rgb);
    this.trails.size = this.state.size;
    this.trails.mode = this.state.pixelate === 'true'
      ? 'pixelate'
      : 'blur';
    this.time = 0;
    this.trails.selectedR = rgb[0];
    this.trails.selectedG = rgb[1];
    this.trails.selectedB = rgb[2];
    this.trails.draw();
    // this.changeColor(this.state.color)
    console.log(this.trails.mode);
  }

  // Add to utils
  hexToRgbA(hex) {
    let c;
    let rgb = [];
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length === 3) {
        c = [
          c[0],
          c[0],
          c[1],
          c[1],
          c[2],
          c[2]
        ];
      }
      c = `0x${c.join('')}`;
      rgb = [
        (c >> 16) & 255,
        (c >> 8) & 255,
        c & 255
      ];
    }
    return rgb;
  }

  it(time) {
    if (time > 32) {
      console.log('reset');
      return 32;
    }
    return time += 1;
  }

  cycle(event) {
    const rgb = this.hexToRgbA(this.state.color);
    this.setState(
      {cycle: event.target.checked}, () => {
        this.changeColor(rgb)
      }
    );
  }

  cycleColor(r, g, b) {
    let frequency = 2.4; //.3
    let t = this.time;
    let center = 230;
    let width = 25;

    r = Math.round(Math.sin(frequency * t + 0) * width + center);
    g = Math.round(Math.sin(frequency * t + 2) * width + center);
    b = Math.round(Math.sin(frequency * t + 4) * width + center);

    this.time = this.it(this.time);
    // console.log('%c' + r + g + b, 'color: rgba(' + r + ', ' + g + ', ' + b + ', 1)');
    return [r, g, b];
  }

  changeColor(arr) {
    this.trails.selectedR = arr[0];
    this.trails.selectedG = arr[1];
    this.trails.selectedB = arr[2];
    if (this.state.cycle === true) {
      setTimeout(() => {
        let newColor = this.cycleColor(arr[0], arr[1], arr[2]);
        this.changeColor(newColor);
      }, 4500)
    }
  }

  changeSize(event) {
    const size = event.target.value;
    this.trails.stopDraw();
    this.trails.pixelSize = size;
    this.setState(() => {
      this.changePixels();
      return {size};
    });
  }

  togglePixel(event) {
    this.trails.stopDraw();
    this.setState({pixelate: event.target.checked});
    // TODO: Create Trails.pixelate instead of Trails.mode
    if (event.target.checked === true) {
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
        <div className="controls" role="navigation">
          <div className="controls-wrapper">
            <ColorPickerPanel defaultColor={this.state.color} onChange={this.changeColor.bind(this.hexToRgbA(this))} placement="topLeft" className="color-picker">
              <span className="rc-color-picker-trigger"/>
            </ColorPickerPanel>
            <label htmlFor="pixelSize">Size</label><input id="pixelSize" name="pixelSize" type="range" min="0" max="12" defaultValue={this.state.pixelate} step="2" onChange={this.changeSize.bind(this)}/>
            <label htmlFor="pixelate">Pixelate</label><input id="pixelate" name="pixelate" type="checkbox" checked={this.state.pixelate} onChange={this.togglePixel.bind(this)}/>
            <label htmlFor="cycle">Cycle</label><input id="cycle" name="cycle" type="checkbox" checked={this.state.cycle} onChange={this.cycle.bind(this)}/>
          </div>
        </div>{/* /.navbar */}
        <div id="wrapper">
          <div id="source">
            <video style={{}} id="videodata" loop="loop" preload="auto" autoPlay="autoplay" width={600} height={400}/>
          </div>
          <div id="output">
            <canvas id="videoscreen" width={600} height={400}>
              <p>Sorry your browser does not support HTML5</p>
            </canvas>
          </div>
        </div>
      </div>
    );
  }
}
