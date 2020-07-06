import React from 'react'
import ColorPickerPanel from 'rc-color-picker'
import 'rc-color-picker/assets/index.css'
// import ReactDOM from 'react-dom';
import { Trails } from '../../lib/video-trails/Trails'

export default class GreenScreen extends React.Component {
  constructor(props) {
    super(props)

    const isHex = /(^[0-9A-F]{6}$)|(^[0-9A-F]{3}$)/i.test(this.props.hex)
    const prefix = '#'
    let hex = isHex === true ? this.props.hex : '#2ab050'

    if (hex.substr(0, prefix.length) !== prefix) {
      hex = prefix + hex
    }

    this.state = {
      activeCamera: 0,
      cameraList: [],
      size: this.props.size,
      pixelate: this.props.pixelate,
      color: hex,
      cycle: false,
      colorize: false,
      mosaic: false,
    }
  }

  componentDidMount() {
    const ua = navigator.userAgent.toLowerCase()
    const is_safari = ua.indexOf('safari/') > -1 && ua.indexOf('chrome') < 0

    if (is_safari) {
      const video = document.getElementById('video')

      setTimeout(() => {
        video.play()
      }, 50)
    }
    this.setupTrails()
  }

  setupTrails(camera) {
    const rgb = this.hexToRgbA(this.state.color) || [42, 176, 80]

    if (this.trails) {
      this.trails.stopDraw()
    }

    this.trails = new Trails(rgb, parseInt(camera) || 0)
    this.trails.pixelSize = this.state.size
    this.trails.mode = this.state.pixelate === true ? 'pixelate' : 'blur'
    this.time = 0
    this.trails.selectedR = rgb[0]
    this.trails.selectedG = rgb[1]
    this.trails.selectedB = rgb[2]
    this.trails.draw()

    this.trails.cameraList.then((d) => {
      this.setState({
        cameraList: d,
        activeCamera: camera,
      })
    })
  }

  changeCamera(event) {
    const camera = event.target.value
    this.trails.removeCanvases()
    this.setupTrails(camera)
  }

  // Add to utils
  hexToRgbA(hex) {
    let c
    let rgb = []
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('')
      if (c.length === 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]]
      }
      c = `0x${c.join('')}`
      rgb = [(c >> 16) & 255, (c >> 8) & 255, c & 255]
    }
    return rgb
  }

  it(time) {
    if (time > 32) {
      return 32
    }
    return (time += 1)
  }

  cycle(event) {
    const rgb = this.hexToRgbA(this.state.color)
    this.setState({ cycle: event.target.checked }, () => {
      this.changeColor(rgb)
    })
  }

  cycleColor(r, g, b) {
    const frequency = 2.4 // .3
    const t = this.time
    const center = 100
    const width = 60

    r = Math.round(Math.sin(frequency * t + 0) * width + center)
    g = Math.round(Math.sin(frequency * t + 2) * width + center)
    b = Math.round(Math.sin(frequency * t + 4) * width + center)

    this.time = this.it(this.time)
    // console.log(`%c${r}${g}${b}`, `color: rgba(${r}, ${g}, ${b}, 1)`);
    return [r, g, b]
  }

  colorPicker(colorObject) {
    const rgb = this.hexToRgbA(colorObject.color)
    this.changeColor(rgb)
  }

  changeColor(arr) {
    this.trails.selectedR = arr[0]
    this.trails.selectedG = arr[1]
    this.trails.selectedB = arr[2]
    if (this.state.cycle === true) {
      setTimeout(() => {
        const newColor = this.cycleColor(arr[0], arr[1], arr[2])
        this.changeColor(newColor)
      }, 4500)
    }
  }

  colorizeImage(event) {
    const colorize = event.target.checked
    this.setState({
      colorize,
    })

    if (colorize) {
      this.trails.colorize = [this.trails.selectedR, this.trails.selectedG, this.trails.selectedB]
    } else {
      this.trails.colorize = []
    }
  }

  mosaicImage(event) {
    const mosaic = event.target.checked
    this.setState({
      mosaic,
    })
    this.trails.mosaic = mosaic
  }

  changeSize(event) {
    const size = event.target.value
    this.trails.stopDraw()
    this.trails.pixelSize = size
    this.setState(() => {
      this.changePixels()
      return { size }
    })
  }

  togglePixel(event) {
    this.trails.stopDraw()
    this.setState({ pixelate: event.target.checked })
    // TODO: Create Trails.pixelate instead of Trails.mode
    if (event.target.checked === true) {
      this.trails.mode = 'pixelate'
    } else {
      this.trails.mode = 'blur'
    }
    this.changePixels()
  }

  changePixels() {
    this.trails.draw()
  }

  cameras() {
    if (this.state.cameraList.length > 1) {
      return (
        <span>
          <label htmlFor="cameraList">Cameras</label>
          <select onChange={this.changeCamera.bind(this)}>
            {this.state.cameraList.map((c, i) => (
              // console.log(c);
              <option key={`camera_${i}`} value={i}>
                {' '}
                {c.label}{' '}
              </option>
            ))}
          </select>
        </span>
      )
    }
  }

  render() {
    return (
      <div>
        <div className="controls" role="navigation">
          <div className="controls-wrapper">
            <ColorPickerPanel
              defaultColor={this.state.color}
              onChange={this.colorPicker.bind(this)}
              placement="topLeft"
              className="color-picker"
            >
              <span className="rc-color-picker-trigger" />
            </ColorPickerPanel>
            <label htmlFor="pixelSize">Size</label>
            <input
              id="pixelSize"
              name="pixelSize"
              type="range"
              min="0"
              max="12"
              defaultValue={this.state.pixelate}
              step="2"
              onChange={this.changeSize.bind(this)}
            />
            <label htmlFor="pixelate">Pixelate</label>
            <input
              id="pixelate"
              name="pixelate"
              type="checkbox"
              checked={this.state.pixelate}
              onChange={this.togglePixel.bind(this)}
            />
            {/* <label htmlFor="cycle">Cycle</label>
            <input
              id="cycle"
              name="cycle"
              type="checkbox"
              checked={this.state.cycle}
              onChange={this.cycle.bind(this)}
            /> */}
            <label htmlFor="colorize">Colorize</label>
            <input
              id="colorize"
              name="colorize"
              type="checkbox"
              checked={this.state.colorize}
              onChange={this.colorizeImage.bind(this)}
            />
            <label htmlFor="colorize">Mosaic</label>
            <input
              id="mosaic"
              name="mosaic"
              type="checkbox"
              checked={this.state.mosaic}
              onChange={this.mosaicImage.bind(this)}
            />
            {this.cameras()}
          </div>
        </div>
        {/* /.navbar */}
        <div id="wrapper">
          <div id="source">
            <video
              style={{}}
              id="videodata"
              loop="loop"
              preload="auto"
              autoPlay
              width={600}
              height={400}
            />
          </div>
          <div id="output">
            <canvas id="videoscreen" width={600} height={400}>
              <p>Sorry your browser does not support HTML5</p>
            </canvas>
          </div>
        </div>
      </div>
    )
  }
}
