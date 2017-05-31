var imgDataNormal;
var selectedR = 110;
var selectedG = 154;
var selectedB = 90;
var y, x = 0;
var offsetYup = y - 1;
var offsetYdown = y + 1;
var offsetXleft = x - 1;
var offsetxRight = x + 1;
var elCount = 0;
var video, container, c;

function init() {
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
  }
}

function draw() {
  if (window.requestAnimationFrame) window.requestAnimationFrame(draw);
  // // IE implementation
  // else if (window.msRequestAnimationFrame) window.msRequestAnimationFrame(draw);
  // // Firefox implementation
  // else if (window.mozRequestAnimationFrame) window.mozRequestAnimationFrame(draw);
  // // Chrome implementation
  // else if (window.webkitRequestAnimationFrame) window.webkitRequestAnimationFrame(draw);
  // Other browsers that do not yet support feature
  else setTimeout(draw, 16.7);

  DrawVideoOnCanvas();
  console.log('draw');
}

function generateThumbnail(height, width) {
  var ctx = c.getContext("2d");
  c = document.createElement("canvas");
  c.className = "canvas_" + elCount;
  c.width = width;
  c.height = height;
  ctx.drawImage(video, 0, 0, width, height);

  container.appendChild(c);

  var imgDataNormal = ctx.getImageData(0, 0, c.width, c.height);
  var imgData = ctx.createImageData(c.width, c.height);

  if (elCount > 1) {
    addGreenScreen(imgData, imgDataNormal);
  }
  console.log("canvas_" + (elCount - 30));
  if (elCount > 31) {
    var canvasCount = document.getElementsByClassName("canvas_" + (elCount - 10));
    while(canvasCount.length > 0){
        canvasCount[0].parentNode.removeChild(canvasCount[0]);
    }
  }

  elCount++;

  ctx.putImageData(imgData, 0, 0);

}

function addGreenScreen(imgData, imgDataNormal) {
  console.log(imgData);
  var i;
  for (i = 0; i < imgData.width * imgData.height * 4; i += 4) {
    var r = imgDataNormal.data[i + 0];
    var g = imgDataNormal.data[i + 1];
    var b = imgDataNormal.data[i + 2];
    var a = imgDataNormal.data[i + 3];
    // console.log(r, g, b, a);
    // set rgb levels for green and set alphachannel to 0;
    /*selectedR = 110;
    selectedG = 154;
    selectedB = 90;*/
    // rgb(29, 146, 62) // starbucks green
    // rgb(30, 189, 155) // Newport Green
    // GLOWSTICK GREE // selectedR = 36;
    // selectedG = 212;
    // selectedB = 123;
    // 73 0 255
    // selectedR = 73;
    // selectedG = 0;
    // selectedB = 255;
    selectedR = 36;
    selectedG = 212;
    selectedB = 123;
    // if (r != selectedR && g != selectedG && b != selectedB) {
    if (r < selectedR - 40 || r > selectedR + 40) {
      a = 0;
    }
    if (g < selectedG - 40 || g > selectedG + 40) {
      a = 0;
    }
    if (b < selectedB - 40 || b > selectedB + 40) {
      a = 0;
    }

    // GREEN SCREEN
    // if (r <= selectedR && g >= selectedG && b >= selectedB) {
    // // if (r != selectedR && g != selectedG && b != selectedB) {
    //   a = 0;
    // }
    if (a != 0) {
      imgData.data[i + 0] = r;
      imgData.data[i + 1] = g;
      imgData.data[i + 2] = b;
      imgData.data[i + 3] = a;
    }
  }
  // For image anti-aliasing
  for (var y = 0; y < imgData.height; y++) {
    for (var x = 0; x < imgData.width; x++) {
      var r = imgData.data[((imgData.width * y) + x) * 4];
      var g = imgData.data[((imgData.width * y) + x) * 4 + 1];
      var b = imgData.data[((imgData.width * y) + x) * 4 + 2];
      var a = imgData.data[((imgData.width * y) + x) * 4 + 3];
      if (imgData.data[((imgData.width * y) + x) * 4 + 3] != 0) {
        offsetYup = y - 1;
        offsetYdown = y + 2;
        offsetXleft = x - 1;
        offsetxRight = x + 2;
        var change = false;
        if (offsetYup > 0) {
          if (imgData.data[((imgData.width * (y - 1)) + (x)) * 4 + 3] == 0) {
            change = true;
          }
        }
        if (offsetYdown < imgData.height) {
          if (imgData.data[((imgData.width * (y + 1)) + (x)) * 4 + 3] == 0) {
            change = true;
          }
        }
        if (offsetXleft > -1) {
          if (imgData.data[((imgData.width * y) + (x - 1)) * 4 + 3] == 0) {
            change = true;
          }
        }
        if (offsetxRight < imgData.width) {
          if (imgData.data[((imgData.width * y) + (x + 1)) * 4 + 3] == 0) {
            change = true;
          }
        }
      }
    }
  }
}

function DrawVideoOnCanvas() {
  var object = video; //document.getElementById("videodata")
  var width = object.width;
  var height = object.height;
  var canvas = document.getElementById("videoscreen");

  canvas.setAttribute('width', width);
  canvas.setAttribute('height', height);
  if (canvas.getContext) {
    var context = canvas.getContext('2d');
    context.drawImage(object, 0, 0, width, height);
    imgDataNormal = context.getImageData(0, 0, width, height);
    var imgData = context.createImageData(width, height);

    addGreenScreen(imgData, imgDataNormal);
    context.putImageData(imgData, 0, 0);
    generateThumbnail(height, width);
  }
}

export {
  draw,
  DrawVideoOnCanvas,
  init
};
