const audioFile = document.getElementById("audioFile");
const originalSize = document.getElementById("original-size");
const fileName = document.getElementById("file-name");
const compressedSize = document.getElementById("compressed-size");
const originalAudioSection = document.getElementById("original-audio-section");
const uploadButton = document.getElementById("uploadButton");
const resetButton = document.getElementById("resetButton");

document
  .getElementById("compressButton")
  .addEventListener("click", compressAudio);

audioFile.addEventListener("change", (e) => {
  console.log(resetButton);
  const [file] = audioFile.files;
  if (file) {
    originalAudioSection.classList.remove("hidden");
    resetButton.classList.remove("hidden");
    uploadButton.classList.add("hidden");
  }
  originalSize.innerText = bytesToSize(file.size);
  fileName.innerText = file.name;
});
resetButton.addEventListener("click", (e) => {
  window.location.reload();
});
async function compressAudio() {
  const fileInput = document.getElementById("audioFile");
  const file = fileInput.files[0];

  if (!file) {
    console.log("No file selected.");
    return;
  }

  const formData = new FormData();
  formData.append("audio", file);

  try {
    const response = await fetch("http://localhost:3000/compress-audio", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const blob = await response.blob();
      compressedSize.innerText = bytesToSize(blob.size);
      const url = URL.createObjectURL(blob);
      changeAudioSource(url);
    } else {
      console.error("Error:", response.statusText);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

const audio = document.getElementById("audio");
const source = document.getElementById("audioSource");

const changeAudioSource = (url) => {
  source.src = url;
  audio.load();
};
function bytesToSize(bytes) {
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  if (bytes === 0) {
    return "0 Byte";
  }

  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));

  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}
