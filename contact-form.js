document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const statusEl = document.getElementById("form-status");
  const btn = document.getElementById("submit-btn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      statusEl.textContent = "Please fill in the name, email, and message fields.";
      statusEl.className = "form-status error";
      return;
    }

    btn.disabled = true;
    btn.textContent = "Sending...";

    try {
      await db.collection("messages").add({
        name, email, subject, message,
        read: false,
        date: firebase.firestore.FieldValue.serverTimestamp()
      });
      form.reset();
      statusEl.textContent = "Your message has been sent. Thank you! I will get back to you as soon as possible.";
      statusEl.className = "form-status success";
    } catch (err) {
      console.error(err);
      statusEl.textContent = "Something went wrong. Please try again.";
      statusEl.className = "form-status error";
    } finally {
      btn.disabled = false;
      btn.textContent = "Send message →";
    }
  });
});
