var imgDataNormal;
var selectedR = 36;
var selectedG = 212;
var selectedB = 123;
var y, x = 0;
var offsetYup = y - 1;
var offsetYdown = y + 1;
var offsetXleft = x - 1;
var offsetxRight = x + 1;
var elCount = 0;
var video, container, c;


function init(r, g, b) {
  // var selectedR = 36;
  // var selectedG = 212;
  // var selectedB = 123;

  video = document.getElementById('videodata');
  c = document.createElement("canvas");
  container = document.getElementById("output");
  container.appendChild(c);

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    // Not adding `{ audio: true }` since we only want video now
    navigator.mediaDevices.getUserMedia({
      video: true
    }).then(function(stream) {
      video.src = window.URL.createObjectURL(stream);
      video.play();
    });
    draw();
    // setTimeout(draw, 1000);
  }
}

function draw() {
  // if (window.requestAnimationFrame) window.requestAnimationFrame(draw);
  // // IE implementation
  // else if (window.msRequestAnimationFrame) window.msRequestAnimationFrame(draw);
  // // Firefox implementation
  // else if (window.mozRequestAnimationFrame) window.mozRequestAnimationFrame(draw);
  // // Chrome implementation
  // else if (window.webkitRequestAnimationFrame) window.webkitRequestAnimationFrame(draw);
  // Other browsers that do not yet support feature
  // else
  setTimeout(draw, 16.7);

  DrawVideoOnCanvas();
}

function pixelate(src, dst, opt) {

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
        if( x >= xSize ){ continue; }
        for (y = yBinStart; y < yBinEnd; y += 1) {
          if( y >= ySize ){ continue; }
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
        if( x >= xSize ){ continue; }
        for (y = yBinStart; y < yBinEnd; y += 1) {
          if( y >= ySize ){ continue; }
          i = (xSize * y + x) * 4;
          dstPixels[i + 0] = red;
          dstPixels[i + 1] = green;
          dstPixels[i + 2] = blue;
          dstPixels[i + 3] = alpha;
        }
      }
    }
  }

};

function generateThumbnail(height, width) {
  c = document.createElement("canvas");
  var img = new Image;
  var ctx = c.getContext("2d");

  c.className = "canvas_" + elCount;
  c.width = width;
  c.height = height;
  var w = c.width / 32;
  var h = c.height / 32;

  // turn off image aliasing
  ctx.msImageSmoothingEnabled = false;
  ctx.mozImageSmoothingEnabled = false;
  ctx.webkitImageSmoothingEnabled = false;
  ctx.imageSmoothingEnabled = false;

  // enlarge the minimized image to full size
  ctx.drawImage(video, 0, 0, c.width, c.height);

  // ctx.drawImage(video, 0, 0, w, h);

  // ctx.drawImage(video, 0, 0, c.width, c.height);

  container.appendChild(c);

  var options = {
    pixelWidth: 4,
    pixelHeight: 4
  };

  var imgDataNormal = ctx.getImageData(0, 0, c.width, c.height);
  var imgData = ctx.createImageData(c.width, c.height);

  if (elCount > 1) {
    addGreenScreen(imgData, imgDataNormal);
  }
  if (elCount > 21) {
    var canvasCount = document.getElementsByClassName("canvas_" + (elCount - 21));
    while (canvasCount.length > 0) {
      canvasCount[0].parentNode.removeChild(canvasCount[0]);
    }
  }

  elCount++;

  pixelate(imgData,imgData,options);

  ctx.putImageData(imgData, 0, 0);

}


var lastOn = [];

function addGreenScreen(imgData, imgDataNormal) {
  var i;
  var r = 0;
  var g = 0;
  var b = 0;
  var a = 0;
  for (i = 0; i < imgData.width * imgData.height * 4; i += 4) {
    r = imgDataNormal.data[i + 0];
    g = imgDataNormal.data[i + 1];
    b = imgDataNormal.data[i + 2];
    a = imgDataNormal.data[i + 3];

    // if (r != selectedR && g != selectedG && b != selectedB) {
    if (r < selectedR - 80 || r > selectedR + 80) {
      a = 0;
    }
    if (g < selectedG - 80 || g > selectedG + 80) {
      a = 0;
    }
    if (b < selectedB - 80 || b > selectedB + 80) { // if b < 43 or b > 183
      a = 0;
    }

    if (a != 0) {
      imgData.data[i + 0] = r;
      imgData.data[i + 1] = g;
      imgData.data[i + 2] = b;
      imgData.data[i + 3] = a;

      // console.log(imgData.data[i - 1 + 0]);

      // Handle white that leds, etc emit
      // lastOn[3] == 1 && lastOn[0] == 255 &&
      // lastOn[0] == lastOn[1] == lastOn[2]
      lastOn = [r, g, b, a];
      for (var j = 0; j < 44; j += 4) {
        imgData.data[(i + 0) - j] = r;
        imgData.data[(i + 1) - j] = g;
        imgData.data[(i + 2) - j] = b;
        imgData.data[(i + 3) - j] = a;

        // imgData.data[((i + 0) * imgData.width) - j] = r;
        // imgData.data[((i + 1) * imgData.width) - j] = g;
        // imgData.data[((i + 2) * imgData.width) - j] = b;
        // imgData.data[((i + 3) * imgData.width) - j] = a;
      }
    }
  }
}

function DrawVideoOnCanvas() {
  var object = video; //document.getElementById("videodata")
  var width = object.width;
  var height = object.height;
  var canvas = document.getElementById("videoscreen");
  // generateThumbnail(height, width);

  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  if (canvas.getContext) {
    var context = canvas.getContext('2d');
    context.drawImage(object, 0, 0, width, height);
    imgDataNormal = context.getImageData(0, 0, width, height);
    var imgData = context.createImageData(width, height);

    // addGreenScreen(imgData, imgDataNormal);
    // context.putImageData(imgData, 0, 0);
    generateThumbnail(height, width);
  }
}

export {
  draw,
  DrawVideoOnCanvas,
  init
};
