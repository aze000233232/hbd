const music = document.getElementById("bg-music");
const song = document.getElementById("song");

const playBtn = document.getElementById("playBtn");
const progress = document.querySelector(".progress");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

document.body.addEventListener("click", () => {
  music.play();
}, { once: true });

let historyStack = [1];
let isTransitioning = false;

function show(id) {
  if (isTransitioning) return;
  isTransitioning = true;

  const current = document.querySelector("section.active");
  const next = document.getElementById("v" + id);

  if (current) {
    current.classList.remove("active");
  }

  setTimeout(() => {
    next.classList.add("active");

    historyStack.push(id);
    updateBackButton();
    launchConfetti();

    isTransitioning = false;
  }, 320); // ⬅️ smoother timing
}

function next(id) {
  show(id);
}

function goBack() {
  if (historyStack.length > 1 && !isTransitioning) {
    isTransitioning = true;

    historyStack.pop();
    const prev = historyStack[historyStack.length - 1];

    const current = document.querySelector("section.active");
    const next = document.getElementById("v" + prev);

    if (current) current.classList.remove("active");

    setTimeout(() => {
      next.classList.add("active");
      updateBackButton();
      isTransitioning = false;
    }, 320);
  }
}

function updateBackButton() {
  const btn = document.getElementById("globalBack");
  btn.style.display = historyStack.length > 1 ? "block" : "none";
}

function restart() {
  historyStack = [1];
  show(1);
}

/* 🎵 MUSIC PLAYER */

function toggleSong() {
  if (song.paused) {
    song.play();
    playBtn.innerHTML = "❚❚";
  } else {
    song.pause();
    playBtn.innerHTML = "▶";
  }
}

song.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(song.duration);
});

song.addEventListener("timeupdate", () => {
  const percent = (song.currentTime / song.duration) * 100;
  progress.style.width = percent + "%";

  currentTimeEl.textContent = formatTime(song.currentTime);
});

song.addEventListener("ended", () => {
  playBtn.innerHTML = "▶";
});

function seekSong(e) {
  const bar = e.currentTarget;
  const width = bar.clientWidth;
  const clickX = e.offsetX;

  song.currentTime = (clickX / width) * song.duration;
}

function formatTime(time) {
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60)
    .toString()
    .padStart(2, "0");

  return `${mins}:${secs}`;
}

/* 🎉 CONFETTI */

function launchConfetti() {
  const count = 35;
  const colors = ["#66bb6a", "#fdd835", "#ffffff", "#81c784"];

  for (let i = 0; i < count; i++) {
    const c = document.createElement("div");
    c.classList.add("confetti");
    document.body.appendChild(c);

    const size = Math.random() * 6 + 6;
    c.style.width = size + "px";
    c.style.height = size + "px";

    c.style.left = Math.random() * window.innerWidth + "px";
    c.style.background = colors[Math.floor(Math.random() * colors.length)];

    c.style.animationDuration = (Math.random() * 0.8 + 0.8) + "s";
    c.style.transform = `rotate(${Math.random() * 360}deg)`;

    setTimeout(() => c.remove(), 1800);
  }
}