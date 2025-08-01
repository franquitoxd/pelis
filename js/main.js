const video = document.getElementById("videoPlayer");
const overlay = document.getElementById("overlay");
const videoTitle = document.getElementById("videoTitle");
const controls = document.getElementById("controls");
const nextBtn = document.getElementById("nextBtn");
const fullscreenBtn = document.getElementById("fullscreenBtn");
const pushMessage = document.getElementById("pushMessage");

let pendingIndexes = [];
let currentIndex = -1;
let hideControlsTimeout, hideCursorTimeout, hideFullscreenTimeout;

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

function showTitle(name) {
  videoTitle.textContent = name;
  videoTitle.style.opacity = "1";
  setTimeout(() => {
    videoTitle.style.opacity = "0";
  }, 3000);
}

function mostrarMensajesSecuenciales(actual, siguiente) {
  if (!actual) return;

  pushMessage.innerHTML = `<i class="fa-solid fa-film"></i> <strong>Estás viendo:</strong><br>${actual.nombre}`;
  pushMessage.className = "show";

  setTimeout(() => {
    pushMessage.className = "hide";
    setTimeout(() => {
      if (siguiente) {
        pushMessage.innerHTML = `<i class="fa-solid fa-hourglass-start"></i> <strong>Ya comienza:</strong><br>${siguiente.nombre}`;
        pushMessage.className = "show";
        setTimeout(() => {
          pushMessage.className = "hide";
          setTimeout(() => {
            pushMessage.style.display = "none";
          }, 600);
        }, 3000);
      } else {
        pushMessage.style.display = "none";
      }
    }, 600);
  }, 3000);
}

function iniciarMensajesTemporizados() {
  const actual = currentIndex >= 0 ? videos[currentIndex] : null;
  const siguiente =
    pendingIndexes.length > 0 ? videos[pendingIndexes[0]] : null;

  setTimeout(() => {
    mostrarMensajesSecuenciales(actual, siguiente);
  }, 30 * 60 * 1000); // después de 30 minutos

  video.onloadedmetadata = () => {
    const duracion = video.duration;
    if (duracion > 30 * 60) {
      const tiempoAntesDeFinal = (duracion - 25 * 60) * 1000;
      if (tiempoAntesDeFinal > 0) {
        setTimeout(() => {
          mostrarMensajesSecuenciales(actual, siguiente);
        }, tiempoAntesDeFinal);
      }
    }
  };
}

function playNextVideo() {
  if (pendingIndexes.length === 0) {
    console.log("Fin de la lista de reproducción.");
    return;
  }
  currentIndex = pendingIndexes.shift();
  const { url, nombre } = videos[currentIndex];
  video.src = url;
  video.load();
  video.play().catch((err) => console.log("Error:", err));
  showTitle(nombre);
  iniciarMensajesTemporizados();
}

overlay.addEventListener("click", () => {
  overlay.style.display = "none";
  video.muted = false;
  video.volume = 1;
  initializePlaylist();
  playNextVideo();
});

nextBtn.addEventListener("click", () => {
  playNextVideo();
  resetControlsTimeout();
});

video.addEventListener("ended", playNextVideo);

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

fullscreenBtn.addEventListener("click", toggleFullscreen);
video.addEventListener("dblclick", toggleFullscreen);

document.addEventListener("keydown", (e) => {
  if (e.keyCode === 32 || e.keyCode === 13) {
    if (video.paused) {
      video.play().catch((err) => console.log("Error:", err));
    } else {
      video.pause();
    }
  }
  if (e.key.toLowerCase() === "f") {
    toggleFullscreen();
  }
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
