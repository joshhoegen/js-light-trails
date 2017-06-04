var Trails = class {
  constructor(color) {
    this.imgDataNormal;
    this.color = color || [36, 212, 123]
    this.selectedR = this.color[0];
    this.selectedG = this.color[1];
    this.selectedB = this.color[2];
    this.y = 0;
    this.x = 0;
    this.elCount = 0;
    var video = document.getElementById('videodata');
    this.video = video;
    this.canvas = document.getElementById('videoscreen');
    this.c = document.createElement('canvas');
    this.container = document.getElementById('output');
    this.container.appendChild(this.c);

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Not adding `{ audio: true }` since we only want video now
      navigator.mediaDevices.getUserMedia({
        video: true
      }).then(function(stream) {
        video.src = window.URL.createObjectURL(stream);
        video.play();
      });
      // this.draw();
    }
  }

  draw() {
    var _this = this;
    // console.log(this);
    if (window.requestAnimationFrame) {
      window.requestAnimationFrame(this.draw.bind(this));
    }
    // IE implementation
    // else if (window.msRequestAnimationFrame) window.msRequestAnimationFrame(this.draw);
    // // Firefox implementation
    // else if (window.mozRequestAnimationFrame) window.mozRequestAnimationFrame(this.draw);
    // // Chrome implementation
    // else if (window.webkitRequestAnimationFrame) window.webkitRequestAnimationFrame(this.draw);
    // Other browsers that do not yet support feature
    // else
    // setTimeout(draw, 600);

    this.drawVideoOnCanvas();
  }

  generateThumbnail(height, width) {
    var c = document.createElement('canvas');
    var ctx = c.getContext('2d');
    var canvasCount;

    c.className = 'canvas_' + this.elCount;
    c.width = width;
    c.height = height;

    ctx.drawImage(this.video, 0, 0, c.width, c.height);

    this.container.appendChild(c);

    var options = {
      pixelWidth: 4,
      pixelHeight: 4
    };

    this.imgDataNormal = ctx.getImageData(0, 0, c.width, c.height);
    this.imgData = ctx.createImageData(c.width, c.height);

    if (this.elCount > 1) {
      this.addGreenScreen(this.imgData, this.imgDataNormal);
    }
    if (this.elCount > 24) {
      canvasCount = document.getElementsByClassName('canvas_' + (this.elCount - 24));
      while (canvasCount.length > 0) {
        canvasCount[0].parentNode.removeChild(canvasCount[0]);
      }
    }

    this.elCount++;

    this.pixelate(this.imgData, this.imgData, options);

    ctx.putImageData(this.imgData, 0, 0);

  }

  pixelate(src, dst, opt) {

    var xBinSize = opt.pixelWidth || 8,
      yBinSize = opt.pixelHeight || 8;

    var xSize = src.width,
      ySize = src.height,
      srcPixels = src.data,
      dstPixels = dst.data,
      x, y, i;

    var pixelsPerBin = xBinSize * yBinSize,
      red, green, blue, alpha, alphas,
      nBinsX = Math.ceil(xSize / xBinSize),
      nBinsY = Math.ceil(ySize / yBinSize),
      xBinStart, xBinEnd, yBinStart, yBinEnd,
      xBin, yBin, pixelsInBin;

    for (xBin = 0; xBin < nBinsX; xBin += 1) {
      for (yBin = 0; yBin < nBinsY; yBin += 1) {

        // Initialize the color accumlators to 0
        red = 0;
        green = 0;
        blue = 0;
        alpha = 0;

        // Determine which pixels are included in this bin
        xBinStart = xBin * xBinSize;
        xBinEnd = xBinStart + xBinSize;
        yBinStart = yBin * yBinSize;
        yBinEnd = yBinStart + yBinSize;

        // Add all of the pixels to this bin!
        pixelsInBin = 0;
        for (x = xBinStart; x < xBinEnd; x += 1) {
          if (x >= xSize) {
            continue;
          }
          for (y = yBinStart; y < yBinEnd; y += 1) {
            if (y >= ySize) {
              continue;
            }
            i = (xSize * y + x) * 4;
            red += srcPixels[i + 0];
            green += srcPixels[i + 1];
            blue += srcPixels[i + 2];
            alpha += srcPixels[i + 3];
            pixelsInBin += 1;
          }
        }

        // Make sure the channels are between 0-255
        red = red / pixelsInBin;
        green = green / pixelsInBin;
        blue = blue / pixelsInBin;
        alphas = alpha / pixelsInBin;

        // Draw this bin
        for (x = xBinStart; x < xBinEnd; x += 1) {
          if (x >= xSize) {
            continue;
          }
          for (y = yBinStart; y < yBinEnd; y += 1) {
            if (y >= ySize) {
              continue;
            }
            i = (xSize * y + x) * 4;
            dstPixels[i + 0] = red;
            dstPixels[i + 1] = green;
            dstPixels[i + 2] = blue;
            dstPixels[i + 3] = alpha;
          }
        }
      }
    }
  }

  addGreenScreen(imgData, imgDataNormal) {
    var i;
    var r = 0;
    var g = 0;
    var b = 0;
    var a = 0;
    var j;
    for (i = 0; i < imgData.width * imgData.height * 4; i += 4) {
      r = imgDataNormal.data[i + 0];
      g = imgDataNormal.data[i + 1];
      b = imgDataNormal.data[i + 2];
      a = imgDataNormal.data[i + 3];

      // if (r != selectedR && g != selectedG && b != selectedB) {
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

        for (j = 0; j < 44; j += 4) {
          imgData.data[(i + 0) - j] = r;
          imgData.data[(i + 1) - j] = g;
          imgData.data[(i + 2) - j] = b;
          imgData.data[(i + 3) - j] = a;

          imgData.data[((i + 0) * imgData.width) - j] = r;
          imgData.data[((i + 1) * imgData.width) - j] = g;
          imgData.data[((i + 2) * imgData.width) - j] = b;
          imgData.data[((i + 3) * imgData.width) - j] = a;
        }
      }
    }
  }

  drawVideoOnCanvas() {
    var video = this.video;
    var width = video.width;
    var height = video.height;
    var canvas = this.canvas;
    var context = canvas.getContext('2d');

    // generateThumbnail(height, width);
    canvas.setAttribute('width', width);
    canvas.setAttribute('height', height);
    if (canvas.getContext) {

      context.drawImage(this.video, 0, 0, width, height);

      this.imgDataNormal = context.getImageData(0, 0, width, height);
      this.imgData = context.createImageData(width, height);

      // addGreenScreen(imgData, imgDataNormal);
      // context.putImageData(imgData, 0, 0);
      this.generateThumbnail(height, width);
    }
  }
};


export {
  Trails
};
