import LiveVideo from 'live-video'

const Trails = class {
  constructor(color, camera) {
    // Since this is still an experiment, errrrthing is exposed.
    const self = this
    const video = document.getElementById('videodata')
    this.cameraInstance = new LiveVideo({
      video,
      audio: false,
      camera,
    })

    this.cameraList = LiveVideo.listCameras()
    this.color = color || [42, 176, 80]
    this.colorize = []
    this.mosaic = false
    this.selectedR = this.color[0]
    this.selectedG = this.color[1]
    this.selectedB = this.color[2]
    this.pixelSize = 4 || parseInt(size)
    this.pixelSizeMax = 14
    this.elCount = 0
    this.elMax = 12
    this.elMaxDouble = 0
    this.video = video
    this.width = video.offsetWidth
    this.height = video.offsetHeight
    this.left = video.getBoundingClientRect().left
    this.top = video.getBoundingClientRect().top
    this.imgData = []
    this.imgDataNormal = []
    this.image = new Array(this.elMax).fill(undefined).map(() => new Image())
    this.imgDataLength = this.width * this.height * 4
    this.mode = 'blur'
    this.c = document.createElement('canvas')
    this.ctx = this.c.getContext('2d')

    this.cSrc2 = document.createElement('canvas')
    this.ctxSrc2 = this.cSrc2.getContext('2d')

    this.cSrc = new Array(this.elMax).fill(undefined).map(() => {
      const canvas = document.createElement('canvas')
      canvas.height = this.height
      canvas.width = this.width
      return canvas
    })
    this.ctxSrc = this.cSrc.map((c) => c.getContext('2d'))

    this.cPre = new Array(this.elMax).fill(undefined).map(() => {
      const canvas = document.createElement('canvas')
      canvas.height = this.height
      canvas.width = this.width
      return canvas
    })
    this.ctxPre = this.cPre.map((c) => c.getContext('2d'))

    this.container = document.getElementById('output')
    this.animationFrame
    this.animationFrameTime = 0
    this.lastIntervalTimestamp = 0

    this.cameraInstance.play().then(() => {
      self.c.id = 'canvas_trails'
      self.container.appendChild(self.c)
    })
  }

  draw() {
    this.c.width = this.width
    this.c.height = this.height
    this.cSrc2.width = this.width
    this.cSrc2.height = this.height
    this.video.width = this.width
    this.video.height = this.height

    this.ctxPre.map((c) => {
      const isPixels = this.mode === 'pixelate'
      c.webkitImageSmoothingEnabled = !isPixels
      c.imageSmoothingEnabled = !isPixels
      return c
    })

    this.animate()
  }

  animate(time) {
    console.log(time)
    if (this.animationFrameTime > 90) {
      console.log('stop')
      window.cancelAnimationFrame(this.amimationFrame)
      this.amimationFrame = undefined
      this.animationFrameTime = 0
      this.animate()
      return
    } else {
      console.log('go')
      this.amimationFrame = window.requestAnimationFrame(this.animate.bind(this))
      if (this.ctx && this.ctxPre) {
        this.generateThumbnail2()
      }
      this.animationFrameTime += 1
    }

   
  }

  removeCanvases() {
    let i = this.elMax
    while (i--) {
      this.c[i].remove()
    }
  }

  stopDraw() {
    if (this.amimationFrame) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.ctxSrc2.clearRect(0, 0, this.width, this.height);
      this.ctxPre.map((c, i) => {
        c.clearRect(0, 0, this.width, this.height);
        this.ctxSrc[i].clearRect(0, 0, this.width, this.height);
      })
      window.cancelAnimationFrame(this.amimationFrame)
      this.amimationFrame = undefined
    }
  }

  generateThumbnail2() {
    const width = this.width
    const height = this.height
    // TODO: See if we can set this once.
    // Initial attempts had unexpected results.
    // Reverse "pixel size" because UI range only goes min to max
    // 12 = max pixel size.
    const sizeReverse = this.pixelSizeMax - this.pixelSize
    const size = sizeReverse / 100
    const w = width * size
    const h = height * size
    const ctx = this.ctx
    const pCtx = this.ctxPre
    const i = this.elMaxDouble

    this.ctxSrc2.drawImage(this.video, 0, 0, width, height)

    if (this.mode === 'blur' || this.mode === 'pixelate') {
      // draw the original image at a fraction of the final size
      pCtx[i].drawImage(this.video, 0, 0, w, h)
      pCtx[i].drawImage(this.cPre[i], 0, 0, w, h, 0, 0, width, height)
    } else {
      pCtx[i].drawImage(this.video, 0, 0, width, height)
    }

    this.imgDataNormal[i] = pCtx[i].getImageData(0, 0, width, height)
    this.imgData[i] = pCtx[i].createImageData(width, height)
    this.addGreenScreen(this.imgData[i], this.imgDataNormal[i]) // , width, height
    pCtx[i].putImageData(this.imgData[i], 0, 0)
    ctx.drawImage(this.cPre[i], 0, 0, width, height)

    // Cover over trail with video
    this.ctxSrc[i].drawImage(this.cPre[i], 0, 0, width, height)

    const pattern = this.ctxSrc[i].createPattern(this.cSrc2, 'no-repeat')
    // fill with video
    this.ctxSrc[i].globalCompositeOperation = 'source-in'
    this.ctxSrc[i].fillStyle = pattern // 'rgba(0, 0, 0, 0)'
    this.ctxSrc[i].fillRect(0, 0, width, height)

    // draw original image in normal mode
    this.ctxSrc[i].globalCompositeOperation = 'source-over'
    ctx.drawImage(this.cSrc[i], 0, 0, width, height)
    // console.log(this.cSrc[i].width, width)

    this.elMaxDouble = this.elMaxDouble === this.elMax - 1 ? 0 : this.elMaxDouble + 1
  }

  addGreenScreen(imgData, imgDataNormal) {
    let i
    let r = 0
    let g = 0
    let b = 0
    let a = 0
    // eslint disabled because this is faster: https://jsperf.com/for-vs-while/11
    for (i = this.imgDataLength; (i -= 4); ) {
      // eslint-disable-line no-cond-assign
      r = imgDataNormal.data[i + 0]
      g = imgDataNormal.data[i + 1]
      b = imgDataNormal.data[i + 2]
      a = imgDataNormal.data[i + 3]

      const inRange =
        r < this.selectedR - 80 ||
        r > this.selectedR + 80 ||
        g < this.selectedG - 80 ||
        g > this.selectedG + 80 ||
        b < this.selectedB - 80 ||
        b > this.selectedB + 80

      // Turn off pixles not in range
      if (!this.mosaic && inRange) {
        a = 0
      }
      if (this.mosaic) {
        a = 20
      }
      if (this.colorize.length) {
        r = this.selectedR
        g = this.selectedG
        b = this.selectedB
        a = this.mosaic && inRange ? 20 : a - 240
      }

      // // Fade pixels at end of range
      // if (
      //   r < this.selectedR - 60 ||
      //   r > this.selectedR + 60 ||
      //   g < this.selectedG - 60 ||
      //   g > this.selectedG + 60 ||
      //   b < this.selectedB - 60 ||
      //   b > this.selectedB + 60
      // ) {
      //   a = a - 120
      // }

      // a !== 0
      if (a !== 0) {
        imgData.data[i + 0] = r
        imgData.data[i + 1] = g
        imgData.data[i + 2] = b
        imgData.data[i + 3] = a
      }
    }
  }
}

/* eslint-enable */

// TODO: Add to own method for extraHorizontalDistortion()
// for (j = 0; j < 44; j += 4) {
//   imgData.data[(i + 0) - j] = r;
//   imgData.data[(i + 1) - j] = g;
//   imgData.data[(i + 2) - j] = b;
//   imgData.data[(i + 3) - j] = a;
//
//   imgData.data[((i + 0) * imgData.width) - j] = r;
//   imgData.data[((i + 1) * imgData.width) - j] = g;
//   imgData.data[((i + 2) * imgData.width) - j] = b;
//   imgData.data[((i + 3) * imgData.width) - j] = a;
// }

export { Trails }
