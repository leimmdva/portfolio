import { useState } from "react";
import { addMessage } from "../services/messages.js";
import { sendContactEmail } from "../services/email.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const initialForm = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState(null); // { type: "error" | "success", text: string }
  const [sending, setSending] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, subject, message } = form;

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({ type: "error", text: t("contact.validationError") });
      return;
    }

    const payload = { name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim() };

    setSending(true);
    try {
      await addMessage(payload);
      setForm(initialForm);
      setStatus({ type: "success", text: t("contact.successMsg") });
      // Email notification is best-effort: the message is already saved above,
      // so a failure here shouldn't be shown to the visitor as an error.
      sendContactEmail(payload).catch((err) => console.error("Email notification failed:", err));
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", text: t("contact.genericError") });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">{t("contact.eyebrow")}</div>
        <h1>
          {t("contact.titlePre")} <span className="italic-accent">{t("contact.titleAccent")}</span>
        </h1>
        <p>{t("contact.subhead")}</p>
      </div>

      <section className="contact-wrap">
        <div className="contact-info">
          <div className="contact-item">
            <div className="ic">✉</div>
            <div>
              <div className="t">{t("contact.emailLabel")}</div>
              <div className="v">merhaba@leyla.dev</div>
            </div>
          </div>

          <div className="contact-item">
            <div className="ic">📍</div>
            <div>
              <div className="t">{t("contact.locationLabel")}</div>
              <div className="v">{t("contact.locationValue")}</div>
            </div>
          </div>

          <div className="contact-item">
            <div className="ic">⏱</div>
            <div>
              <div className="t">{t("contact.responseLabel")}</div>
              <div className="v">{t("contact.responseValue")}</div>
            </div>
          </div>

          <div>
            <div className="t" style={{ marginBottom: 12 }}>
              {t("contact.socialLabel")}
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
              <label htmlFor="name">{t("contact.formNameLabel")}</label>
              <input
                id="name"
                type="text"
                placeholder={t("contact.formNamePlaceholder")}
                value={form.name}
                onChange={update("name")}
              />
            </div>
            <div className="field">
              <label htmlFor="email">{t("contact.formEmailLabel")}</label>
              <input
                id="email"
                type="email"
                placeholder={t("contact.formEmailPlaceholder")}
                value={form.email}
                onChange={update("email")}
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="subject">{t("contact.formSubjectLabel")}</label>
            <input
              id="subject"
              type="text"
              placeholder={t("contact.formSubjectPlaceholder")}
              value={form.subject}
              onChange={update("subject")}
            />
          </div>
          <div className="field">
            <label htmlFor="message">{t("contact.formMessageLabel")}</label>
            <textarea
              id="message"
              placeholder={t("contact.formMessagePlaceholder")}
              value={form.message}
              onChange={update("message")}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ alignSelf: "flex-start" }} disabled={sending}>
            {sending ? t("contact.sendingButton") : t("contact.sendButton")}
          </button>
          {status && <div className={`form-status ${status.type}`}>{status.text}</div>}
        </form>
      </section>
    </>
  );
}
