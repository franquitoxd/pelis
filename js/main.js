const video = document.getElementById("videoPlayer");
const overlay = document.getElementById("overlay");
const videoTitle = document.getElementById("videoTitle");
const controls = document.getElementById("controls");
const nextBtn = document.getElementById("nextBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");

let pendingIndexes = [];
let hideControlsTimeout;
let hideCursorTimeout;
let hideFullscreenTimeout;

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function initializePlaylist() {
  pendingIndexes = shuffleArray([...videos.keys()]);
}

function getFileNameFromUrl(url) {
  const parts = url.split("/");
  return decodeURIComponent(parts[parts.length - 1]);
}

function showTitle(name) {
  videoTitle.textContent = name;
  videoTitle.style.opacity = "1";
  setTimeout(() => {
    videoTitle.style.opacity = "0";
  }, 3000);
}

function playNextVideo() {
  if (pendingIndexes.length === 0) {
    console.log("Ya se reprodujeron todos los videos. Fin.");
    return;
  }
  const index = pendingIndexes.shift();
  const url = videos[index];
  const name = getFileNameFromUrl(url);

  video.src = url;
  video.load();
  video.play().catch(err => {
    console.log("Autoplay bloqueado:", err);
  });
  showTitle(name);
}

video.addEventListener("ended", playNextVideo);

overlay.addEventListener("click", () => {
  overlay.style.display = "none";
  video.muted = false;
  video.volume = 1;
  initializePlaylist();
  playNextVideo();
});

document.addEventListener("keydown", (e) => {
  if (e.keyCode === 32 || e.keyCode === 13) {
    if (video.paused) {
      video.play().catch(err => {
        console.log("Error al reproducir:", err);
      });
    } else {
      video.pause();
    }
  }

  if (e.key.toLowerCase() === "f") {
    toggleFullscreen();
  }
});

video.addEventListener("dblclick", () => {
  toggleFullscreen();
});

fullscreenBtn.addEventListener("click", toggleFullscreen);

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

nextBtn.addEventListener("click", () => {
  playNextVideo();
  resetControlsTimeout();
});

function showControls() {
  controls.style.display = "block";
  document.body.style.cursor = "default";
  fullscreenBtn.classList.remove("hidden");
  resetControlsTimeout();
  resetCursorTimeout();
  resetFullscreenTimeout();
}

function hideControls() {
  controls.style.display = "none";
}

function hideCursor() {
  document.body.style.cursor = "none";
}

function hideFullscreenBtn() {
  fullscreenBtn.classList.add("hidden");
}

function resetControlsTimeout() {
  clearTimeout(hideControlsTimeout);
  hideControlsTimeout = setTimeout(hideControls, 3000);
}

function resetCursorTimeout() {
  clearTimeout(hideCursorTimeout);
  hideCursorTimeout = setTimeout(hideCursor, 3000);
}

function resetFullscreenTimeout() {
  clearTimeout(hideFullscreenTimeout);
  hideFullscreenTimeout = setTimeout(hideFullscreenBtn, 3000);
}

document.addEventListener("mousemove", () => {
  showControls();
});