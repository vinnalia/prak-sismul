let img = document.getElementById("image1");
let blah = document.getElementById("blah");
let originalSize = document.getElementById("original-size");
let imgControl = document.getElementById("img-control");
let imgProcessing = document.getElementById("img-processing");
let originalWidth = 0;
let originalHeight = 0;
let originalImgWidth = document.getElementById("originalImgWidth");
let originalImgHeight = document.getElementById("originalImgHeight");
let imgWidth = document.getElementById("imgWidth");
let imgHeight = document.getElementById("imgHeight");
const compressedImage = document.querySelector("#compressedImage");
let compressedImageBlob;
const scaleInput = document.getElementById("scale");
const uploadButton = document.getElementById("uploadButton");
const resetButton = document.getElementById("resetButton");

img.onchange = (e) => {
  if (img.src) {
    uploadButton.classList.remove("hidden");
    resetButton.classList.add("hidden");
  } else {
    uploadButton.classList.add("hidden");
    resetButton.classList.remove("hidden");
  }
  const [file] = img.files;
  if (file) {
    let oriImg = document.createElement("img");
    oriImg.src = URL.createObjectURL(file);
    oriImg.onload = function () {
      originalHeight = this.height;
      originalWidth = this.width;
      originalImgHeight.innerText = this.height;
      originalImgWidth.innerText = this.width;
    };
    blah.src = URL.createObjectURL(file);
    blah.onload = function (e) {
      originalSize.innerText = bytesToSize(file.size);
      scaleInput.value = 100;
      grayscaleInput.value = 100;
      hueInput.value = 50;
      saturationInput.value = 100;
      brightnessInput.value = 100;
      contrastInput.value = 100;
      blurInput.value = 0;

      blah.style.width = "100%";
      // initializing the compressed image
      compressImage(blah, 1, 1);
    };
    imgControl.style.display = "block";
    imgProcessing.style.display = "flex";
  }
};

scaleInput.onchange = (e) => {
  compressImage(blah, e.target.value / 100, 100);
};

resetButton.onclick = (e) => {
  window.location.reload();
};

function compressImage(imgToCompress, resizingFactor, quality) {
  // showing the compressed image
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  const canvasWidth = originalWidth * resizingFactor;
  const canvasHeight = originalHeight * resizingFactor;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  imgWidth.innerText = parseInt(canvasWidth);
  imgHeight.innerText = parseInt(canvasHeight);

  context.drawImage(
    imgToCompress,
    0,
    0,
    originalWidth * resizingFactor,
    originalHeight * resizingFactor
  );

  canvas.toBlob(
    (blob) => {
      if (blob) {
        compressedImageBlob = blob;
        compressedImage.src = URL.createObjectURL(compressedImageBlob);
        // compressedImage.width = 400;
        document.querySelector("#size").innerHTML = bytesToSize(blob.size);
        // compressedImage.style.maxHeight = "100%";
        console.log(imgProcessing.clientHeight);
        if (originalHeight >= originalWidth) {
          compressedImage.style.height = "564px";
        } else {
          compressedImage.style.width = "100%";
        }
      }
    },
    "image/jpeg",
    quality
  );
}
function bytesToSize(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  if (bytes === 0) {
    return "0 Byte";
  }

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

const grayscaleInput = document.getElementById("grayscale");
const blurInput = document.getElementById("blur");
let grayscaleText = "";
let blurText = "";

grayscaleInput.onchange = (e) => {
  grayscaleText = `grayscale(${1 - e.target.value / 100})`;
  updateImageFilter();
};
blurInput.onchange = (e) => {
  blurText = `blur(${e.target.value / 25}px)`;
  updateImageFilter();
};

const updateImageFilter = () => {
  compressedImage.style.filter = `${grayscaleText} ${blurText}`;
};
