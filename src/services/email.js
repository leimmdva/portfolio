import emailjs from "@emailjs/browser";

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const isConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

// Sends the contact form as an email notification. No-ops quietly if
// EmailJS isn't configured yet (see .env.example) so the contact form
// still works (message is saved to Firestore) without it.
export async function sendContactEmail({ name, email, subject, message }) {
  if (!isConfigured) {
    console.warn("EmailJS is not configured. Add VITE_EMAILJS_* values to .env to enable email notifications.");
    return;
  }
  await emailjs.send(
    SERVICE_ID,
    TEMPLATE_ID,
    {
      from_name: name,
      from_email: email,
      subject: subject || "(no subject)",
      message,
      to_email: "lmmdva6@gmail.com",
    },
    { publicKey: PUBLIC_KEY }
  );
}
