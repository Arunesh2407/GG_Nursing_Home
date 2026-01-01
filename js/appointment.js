const openBtn = document.getElementById("bookAppointmentBtn");
const openBtns = document.querySelectorAll(".book-btn");
const modal = document.getElementById("appointmentModal");
const closeBtn = document.getElementById("closeModal");
const form = document.getElementById("appointmentForm");
const msg = document.getElementById("formMessage");

const API_BASE =
  location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://ggnhpvtltd.vercel.app";

function openModal() {
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");
  msg.textContent = "";
  msg.style.color = "";
}

function closeModal() {
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  msg.textContent = "";
  msg.style.color = "";
}

if (modal) {
  if (openBtn) openBtn.addEventListener("click", openModal);

  if (openBtns.length) {
    openBtns.forEach((b) => b.addEventListener("click", openModal));
  }

  if (closeBtn) closeBtn.addEventListener("click", closeModal);
}

window.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("show")) closeModal();
});

if (form)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    msg.textContent = "";
    msg.style.color = "";

    const data = {
      name: form.name.value.trim(),
      mobile: form.mobile.value.trim(),
      age: Number(form.age.value),
      gender: form.gender.value,
    };

    if (!data.name) {
      msg.textContent = "Enter your name";
      msg.style.color = "red";
      return;
    }

    if (!/^\d{10}$/.test(data.mobile)) {
      msg.textContent = "Enter a valid 10-digit mobile number";
      msg.style.color = "red";
      return;
    }

    if (!Number.isFinite(data.age) || data.age < 1 || data.age > 120) {
      msg.textContent = "Enter a valid age (1–120)";
      msg.style.color = "red";
      return;
    }

    if (!data.gender) {
      msg.textContent = "Select gender";
      msg.style.color = "red";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      const res = await fetch(`${API_BASE}/api/appointment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      let result = {};
      try {
        result = await res.json();
      } catch (_) {}

      if (!res.ok) {
        msg.textContent = result.message || "Failed to send";
        msg.style.color = "red";
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
        return;
      }

      msg.textContent =
        result.message || "Appointment request sent successfully!";
      msg.style.color = "green";
      form.reset();

      setTimeout(() => {
        closeModal();
        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
      }, 1500);
    } catch (err) {
      msg.textContent = "Backend not running or network error";
      msg.style.color = "red";
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
    }
  });
