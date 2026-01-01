const openBtn = document.getElementById("bookAppointmentBtn");
const modal = document.getElementById("appointmentModal");
const closeBtn = document.getElementById("closeModal");
const form = document.getElementById("appointmentForm");
const msg = document.getElementById("formMessage");

openBtn.addEventListener("click", () => {
  modal.classList.add("show");
  msg.textContent = "";
});

closeBtn.addEventListener("click", () => {
  modal.classList.remove("show");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) modal.classList.remove("show");
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const submitBtn = form.querySelector('button[type="submit"]');

  const data = {
    name: form.name.value.trim(),
    mobile: form.mobile.value.trim(),
    age: Number(form.age.value),
    gender: form.gender.value
  };

  // Validation
  if (!/^\d{10}$/.test(data.mobile)) {
    msg.textContent = "Enter a valid 10-digit mobile number.";
    msg.style.color = "red";
    return;
  }

  if (data.age < 1 || data.age > 120) {
    msg.textContent = "Enter a valid age (1 to 120).";
    msg.style.color = "red";
    return;
  }

  // Disable button while sending
  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

  try {
    const res = await fetch("http://localhost:5000/api/appointment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      msg.textContent = result.message || "Failed to send";
      msg.style.color = "red";
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
      return;
    }

    msg.textContent = "Appointment request sent successfully!";
    msg.style.color = "green";
    form.reset();

    setTimeout(() => {
      modal.classList.remove("show");
      msg.textContent = "";
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
