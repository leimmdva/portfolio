import { useLanguage } from "../context/LanguageContext.jsx";
import { LANGUAGES } from "../i18n/languages.js";

const PROFICIENCY = [
  { code: "az", level: "native" },
  { code: "tr", level: "C2" },
  { code: "en", level: "B2" },
  { code: "ru", level: "B1" },
  { code: "de", level: "A2" },
];

export default function About() {
  const { t } = useLanguage();

  return (
    <>
      <div className="page-head">
        <div className="eyebrow">{t("about.eyebrow")}</div>
        <h1>
          Leyla<span className="italic-accent">.</span>
        </h1>
        <p>{t("about.subhead")}</p>
      </div>

      <section className="about-grid">
        <div className="about-photo">
          <img src="/aboutp.jpeg" alt="Leyla portrait" />
        </div>
        <div className="about-copy">
          <h2>{t("about.heading2")}</h2>
          <p>{t("about.bio1")}</p>
          <p>{t("about.bio2")}</p>
          <p>{t("about.bio3")}</p>

          <div className="skills-row">
            <span className="skill-chip">Flutter</span>
            <span className="skill-chip">React</span>
            <span className="skill-chip">Node.js</span>
            <span className="skill-chip">TypeScript</span>
            <span className="skill-chip">UI/UX</span>
            <span className="skill-chip">Writing</span>
          </div>

          <div className="timeline">
            <div className="tl-item">
              <div className="tl-dot"></div>
              <div>
                <div className="tl-year">{t("about.timeline1Year")}</div>
                <div className="tl-title">{t("about.timeline1Title")}</div>
                <div className="tl-desc">{t("about.timeline1Desc")}</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot"></div>
              <div>
                <div className="tl-year">{t("about.timeline2Year")}</div>
                <div className="tl-title">{t("about.timeline2Title")}</div>
                <div className="tl-desc">{t("about.timeline2Desc")}</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot"></div>
              <div>
                <div className="tl-year">{t("about.timeline3Year")}</div>
                <div className="tl-title">{t("about.timeline3Title")}</div>
                <div className="tl-desc">{t("about.timeline3Desc")}</div>
              </div>
            </div>
          </div>

          <section className="languages-section">
            <h2>{t("about.languagesHeading")}</h2>
            <p className="languages-subhead">{t("about.languagesSubhead")}</p>
            <div className="languages-grid">
              {PROFICIENCY.map(({ code, level }) => {
                const lang = LANGUAGES.find((l) => l.code === code);
                return (
                  <div className="language-card" key={code}>
                    <span className="language-flag">{lang.flag}</span>
                    <span className="language-name">{t(`about.languageNames.${code}`)}</span>
                    <span className="language-level">{level === "native" ? t("about.nativeLevel") : level}</span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
