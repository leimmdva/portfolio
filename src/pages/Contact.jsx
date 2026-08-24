import { useState } from "react";
import { addMessage } from "../services/messages.js";
import { sendContactEmail } from "../services/email.js";

const initialForm = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null); // { type: "error" | "success", text: string }
  const [sending, setSending] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, subject, message } = form;

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({ type: "error", text: "Please fill in the name, email, and message fields." });
      return;
    }

    const payload = { name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() };

    setSending(true);
    try {
      await addMessage(payload);
      setForm(initialForm);
      setStatus({ type: "success", text: "Your message has been sent. Thank you! I will get back to you as soon as possible." });
      // Email notification is best-effort: the message is already saved above,
      // so a failure here shouldn't be shown to the visitor as an error.
      sendContactEmail(payload).catch((err) => console.error("Email notification failed:", err));
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Let's talk</div>
        <h1>
          Get in <span className="italic-accent">touch</span>
        </h1>
        <p>Have a project in mind, or an opportunity to discuss? You can reach out below.</p>
      </div>

      <section className="contact-wrap">
        <div className="contact-info">
          <div className="contact-item">
            <div className="ic">✉</div>
            <div>
              <div className="t">Email</div>
              <div className="v">merhaba@leyla.dev</div>
            </div>
          </div>

          <div className="contact-item">
            <div className="ic">📍</div>
            <div>
              <div className="t">Location</div>
              <div className="v">Eskişehir, Turkey</div>
            </div>
          </div>

          <div className="contact-item">
            <div className="ic">⏱</div>
            <div>
              <div className="t">Response time</div>
              <div className="v">Usually within 1–2 business days</div>
            </div>
          </div>

          <div>
            <div className="t" style={{ marginBottom: 12 }}>
              Social
            </div>
            <div className="social-row">
              <a href="#">in</a>
              <a href="#">gh</a>
              <a href="#">tw</a>
              <a href="#">ig</a>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="row-2">
            <div className="field">
              <label htmlFor="name">Name</label>
              <input id="name" type="text" placeholder="Your full name" value={form.name} onChange={update("name")} />
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="name@example.com" value={form.email} onChange={update("email")} />
            </div>
          </div>
          <div className="field">
            <label htmlFor="subject">Subject</label>
            <input
              id="subject"
              type="text"
              placeholder="What would you like to talk about?"
              value={form.subject}
              onChange={update("subject")}
            />
          </div>
          <div className="field">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              placeholder="Write your message here..."
              value={form.message}
              onChange={update("message")}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }} disabled={sending}>
            {sending ? "Sending..." : "Send message →"}
          </button>
          {status && <div className={`form-status ${status.type}`}>{status.text}</div>}
        </form>
      </section>
    </>
  );
}
