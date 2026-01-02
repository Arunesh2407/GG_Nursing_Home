(function () {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.getElementById("lightboxClose");
  const items = Array.from(document.querySelectorAll(".gallery-item"));
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");

  if (!lightbox || !lightboxImg || !closeBtn || items.length === 0) return;

  let lastActive = null;
  let currentIndex = -1;

  function openAt(index, triggerEl) {
    if (index < 0 || index >= items.length) return;
    const src = items[index].getAttribute("data-full");
    if (!src) return;

    currentIndex = index;
    lastActive = triggerEl || items[index];

    // update selected border
    items.forEach((x) => x.classList.remove("is-selected"));
    items[index].classList.add("is-selected");

    lightboxImg.src = src;

    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    document.body.style.overflow = "";
    if (lastActive) lastActive.focus();
    currentIndex = -1;
  }

  function next() {
    if (currentIndex === -1) return;
    const ni = (currentIndex + 1) % items.length;
    openAt(ni);
  }

  function prev() {
    if (currentIndex === -1) return;
    const pi = (currentIndex - 1 + items.length) % items.length;
    openAt(pi);
  }

  items.forEach((btn, idx) => {
    btn.addEventListener("click", () => {
      items.forEach((x) => x.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      openAt(idx, btn);
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  if (prevBtn) {
    prevBtn.addEventListener("click", prev);
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", next);
  }

  lightbox.addEventListener("click", (e) => {
    const t = e.target;
    if (t && t.getAttribute && t.getAttribute("data-close") === "true") {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("is-open")) return;

    if (e.key === "Escape") closeLightbox();
    else if (e.key === "ArrowRight") next();
    else if (e.key === "ArrowLeft") prev();
  });
})();
