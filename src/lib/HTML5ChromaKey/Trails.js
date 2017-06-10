const Trails = class {
  constructor(color, size) {
    const self = this;
    const video = document.getElementById('videodata');
    this.imgDataNormal;
    this.color = color || [42, 176, 80];
    this.selectedR = this.color[0];
    this.selectedG = this.color[1];
    this.selectedB = this.color[2];
    this.pixelSize = 4;
    this.elCount = 0;
    this.elMax = 11;
    this.video = video;
    this.width = video.width;
    this.height = video.height;
    this.imgDataLength = this.width * this.height * 4;
    this.mode = 'blur';
    this.c = [];
    this.ctx = [];
    this.container = document.getElementById('output');
    this.animationFrame;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Not adding `{ audio: true }` since we only want video now
      navigator.mediaDevices.getUserMedia({
        video: true
      }).then(stream => {
        video.src = window.URL.createObjectURL(stream);
        video.play();
        let i = self.elMax;
        while (i--) {
          self.c[i] = document.createElement('canvas');
          self.c[i].id = `canvas_${i}`;
          self.ctx[i] = self.c[i].getContext('2d');
          self.container.appendChild(self.c[i]);
        }
      });
    }
  }

  draw() {
    this.amimationFrame = window.requestAnimationFrame(this.draw.bind(this));
    if (this.c.length > 9 && this.ctx.length > 9) {
      this.generateThumbnail2(this.height, this.width);
    }
  }

  stopDraw() {
    if (this.amimationFrame) {
      window.cancelAnimationFrame(this.amimationFrame);
      this.amimationFrame = undefined;
    }
  }

  generateThumbnail2(height, width) {
    const count = this.elCount;

    // TODO: See if we can set this once. Initial attempts zoomed in.
    this.c[this.elCount].width = width;
    this.c[this.elCount].height = height;

    // Pixelate with out pixelate()
    const size = this.pixelSize / 100;
    const w = width * size;
    const h = height * size;
    const ctx = this.ctx[this.elCount];

    if (this.mode == 'pixelate') {
      ctx.webkitImageSmoothingEnabled = false;
      ctx.imageSmoothingEnabled = false;
    }
    if (this.mode == 'blur' || this.mode == 'pixelate') {
      // draw the original image at a fraction of the final size
      ctx.drawImage(this.video, 0, 0, w, h);
      ctx.drawImage(this.c[this.elCount], 0, 0, w, h, 0, 0, width, height);
    } else {
      ctx.drawImage(this.video, 0, 0, width, height);
    }

    this.imgDataNormal = ctx.getImageData(0, 0, width, height);
    this.imgData = ctx.createImageData(width, height);
    this.addGreenScreen(this.imgData, this.imgDataNormal, width, height);

    ctx.putImageData(this.imgData, 0, 0);

    if (this.elCount > 9) {
      this.elCount = 0;
    } else {
      this.elCount++;
    }
  }

  addGreenScreen(imgData, imgDataNormal, width, height) {
    let i;
    let r = 0;
    let g = 0;
    let b = 0;
    let a = 0;
    let j;
    for (i = this.imgDataLength; i-=4;) {
      r = imgDataNormal.data[i + 0];
      g = imgDataNormal.data[i + 1];
      b = imgDataNormal.data[i + 2];
      a = imgDataNormal.data[i + 3];

      if (r < this.selectedR - 80 || r > this.selectedR + 80) {
        a = 0;
      }
      if (g < this.selectedG - 80 || g > this.selectedG + 80) {
        a = 0;
      }
      if (b < this.selectedB - 80 || b > this.selectedB + 80) { // if b < 43 or b > 183
        a = 0;
      }
      if (a != 0) {
        imgData.data[i + 0] = r;
        imgData.data[i + 1] = g;
        imgData.data[i + 2] = b;
        imgData.data[i + 3] = a;

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
      }
    }
  }
};

export {
  Trails
};
