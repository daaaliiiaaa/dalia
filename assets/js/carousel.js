document.addEventListener("DOMContentLoaded", () => {
  const employees = [
   
    {
      name: "Obada Abu-Odeh",
      position: "CEO & Founder",
      initials: "OO",
      color: "#2A3F7A",
      accent: "#C9A96E",
      image: "assets/media/employees/Obada Abu-Odeh.jpeg",
    },
    {
      name: "Ezz Aldeen Al-Bitar",
      position: "Team Leader",
      initials: "EA",
      color: "#2A4A5C",
      accent: "#7DC4C4",
      image: "assets/media/employees/Ezz Aldeen Al-Bitar.jpeg",
    },
     {
      name: "Maram Nidal",
      position: "Software Engineer",
      initials: "MN",
      color: "#5C3A2A",
      accent: "#E09A72",
    },
    {
      name: "Farah Arada",
      position: "Software Engineer",
      initials: "FA",
      color: "#2A3A5C",
      accent: "#7DA8E0",
    },
    {
      name: "Dalia Abdulsalam",
      position: "Social Media Specialist",
      initials: "DA",
      color: "#5C3A2A",
      accent: "#E09A72",
    },
  ];

  const track = document.getElementById("carouselTrack");
  const infoName = document.getElementById("infoName");
  const infoPos = document.getElementById("infoPosition");
  const infoInner = document.querySelector(".info-inner");
  const infoDots = document.getElementById("infoDots");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!track || !infoName || !infoPos || !infoDots || !prevBtn || !nextBtn) {
    console.warn("Team carousel elements were not found.");
    return;
  }

  let currentIndex = 0;
  let isAnimating = false;
  let autoTimer = null;
  let progressBar = null;

  const AUTO_DELAY = 3000;
  const SPEED = 520;

  const mod = (n, m) => ((n % m) + m) % m;

  function buildAvatar(emp) {
    const el = document.createElement("div");
    el.className = "avatar";
    el.style.background = emp.color;
    el.style.color = emp.accent;

    if (emp.image) {
      const img = document.createElement("img");
      img.src = emp.image;
      img.alt = emp.name;
      el.appendChild(img);
    } else {
      el.textContent = emp.initials;
    }

    return el;
  }

  function makeSlot(emp, className) {
    const slot = document.createElement("div");
    slot.className = `slot ${className}`;
    slot.appendChild(buildAvatar(emp));
    return slot;
  }

  let slots = [];

  function buildTrack() {
    track.innerHTML = "";

    slots = [
      makeSlot(employees[mod(currentIndex - 2, employees.length)], "slot--far-left"),
      makeSlot(employees[mod(currentIndex - 1, employees.length)], "slot--prev"),
      makeSlot(employees[currentIndex], "slot--active"),
      makeSlot(employees[mod(currentIndex + 1, employees.length)], "slot--next"),
    ];

    slots.forEach((slot) => track.appendChild(slot));
  }

  function updateInfo() {
    const emp = employees[currentIndex];

    if (infoInner) {
      infoInner.classList.remove("fade-in");
      infoInner.classList.add("fade-out");
    }

    setTimeout(() => {
      infoName.textContent = emp.name;
      infoPos.textContent = emp.position;

      if (infoInner) {
        infoInner.classList.remove("fade-out");
        infoInner.classList.add("fade-in");
      }
    }, 180);
  }

  function buildDots() {
    infoDots.innerHTML = "";

    employees.forEach((emp, index) => {
      const dot = document.createElement("button");
      dot.className = "dot" + (index === currentIndex ? " dot--active" : "");
      dot.setAttribute("aria-label", `Go to ${emp.name}`);

      dot.addEventListener("click", () => {
        if (isAnimating || index === currentIndex) return;
        goTo(index > currentIndex ? "left" : "right", index);
      });

      infoDots.appendChild(dot);
    });
  }

  function updateDots() {
    document.querySelectorAll(".dot").forEach((dot, index) => {
      dot.classList.toggle("dot--active", index === currentIndex);
    });
  }

  function startProgress() {
    if (progressBar) progressBar.remove();

    progressBar = document.createElement("div");
    progressBar.className = "progress-bar";
    track.appendChild(progressBar);

    void progressBar.offsetWidth;
    progressBar.classList.add("running");
  }

  function stopAuto() {
    if (autoTimer) {
      clearTimeout(autoTimer);
      autoTimer = null;
    }
  }

  function startAuto() {
    stopAuto();
    autoTimer = setTimeout(() => goTo("left"), AUTO_DELAY);
  }

  function goTo(direction, targetIndex) {
    if (isAnimating) return;

    isAnimating = true;
    stopAuto();

    const nextIdx =
      targetIndex !== undefined
        ? mod(targetIndex, employees.length)
        : direction === "left"
          ? mod(currentIndex + 1, employees.length)
          : mod(currentIndex - 1, employees.length);

    currentIndex = nextIdx;

    buildTrack();
    updateInfo();
    buildDots();
    updateDots();
    startProgress();

    setTimeout(() => {
      isAnimating = false;
      startAuto();
    }, SPEED);
  }

  nextBtn.addEventListener("click", () => goTo("left"));
  prevBtn.addEventListener("click", () => goTo("right"));

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") goTo("left");
    if (event.key === "ArrowLeft") goTo("right");
  });

  track.addEventListener("mouseenter", stopAuto);
  track.addEventListener("mouseleave", startAuto);

  let touchStartX = 0;

  track.addEventListener(
    "touchstart",
    (event) => {
      touchStartX = event.touches[0].clientX;
    },
    { passive: true }
  );

  track.addEventListener(
    "touchend",
    (event) => {
      const diff = touchStartX - event.changedTouches[0].clientX;

      if (Math.abs(diff) > 40) {
        diff > 0 ? goTo("left") : goTo("right");
      }
    },
    { passive: true }
  );

  buildTrack();
  infoName.textContent = employees[currentIndex].name;
  infoPos.textContent = employees[currentIndex].position;

  if (infoInner) {
    infoInner.classList.add("fade-in");
  }

  buildDots();
  startProgress();
  startAuto();
});