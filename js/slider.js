document.addEventListener("DOMContentLoaded", () => {
  const images = [
    "assets/images/slider/img1.jpg",
    "assets/images/slider/img2.jpg",
    "assets/images/slider/img3.jpg",
    "assets/images/slider/img4.jpg",
    "assets/images/slider/img5.jpg",
    "assets/images/slider/img6.jpg",
    "assets/images/slider/img7.jpg",
    "assets/images/slider/img8.jpg",
    "assets/images/slider/img9.jpg"
  ];

  const sliderImage = document.getElementById("sliderImage");
  const dotsWrap = document.getElementById("sliderDots");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!sliderImage || !dotsWrap || !prevBtn || !nextBtn) {
    console.error("Slider elements missing. Check hero HTML IDs.");
    return;
  }

  let index = 0;
  let timer = null;
  const intervalMs = 4500;

  // Create dots
  const dots = images.map((_, i) => {
    const dot = document.createElement("button");
    dot.className = "slider-dot";
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to image ${i + 1}`);
    dot.addEventListener("click", () => {
      goTo(i);
      restart();
    });
    dotsWrap.appendChild(dot);
    return dot;
  });

  function setActiveDot() {
    dots.forEach((d, i) => d.classList.toggle("active", i === index));
  }

  function fadeTo(src) {
    sliderImage.style.opacity = "0.15";
    setTimeout(() => {
      sliderImage.src = src;
      sliderImage.onload = () => {
        sliderImage.style.opacity = "0.92";
      };
    }, 220);
  }

  function goTo(i) {
    index = (i + images.length) % images.length;
    fadeTo(images[index]);
    setActiveDot();
  }

  function next() {
    goTo(index + 1);
  }

  function prev() {
    goTo(index - 1);
  }

  function start() {
    timer = setInterval(next, intervalMs);
  }

  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function restart() {
    stop();
    start();
  }

  // Buttons
  nextBtn.addEventListener("click", () => { next(); restart(); });
  prevBtn.addEventListener("click", () => { prev(); restart(); });

  // Pause on hover (nice touch)
  sliderImage.addEventListener("mouseenter", stop);
  sliderImage.addEventListener("mouseleave", start);

  // Init
  goTo(0);
  start();

  // Keyboard controls (Left/Right arrows)
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    e.preventDefault();
    next();
    restart();
  }

  if (e.key === "ArrowLeft") {
    e.preventDefault();
    prev();
    restart();
  }
});

});


