export default function About() {
  return (
    <>
      <div className="page-head">
        <div className="eyebrow">Mobile &amp; Web Developer</div>
        <h1>
          Leyla<span className="italic-accent">.</span>
        </h1>
        <p>I design and build mobile &amp; web products — this page covers how I got here.</p>
      </div>

      <section className="about-grid">
        <div className="about-photo">
          <img src="/aboutp.jpeg" alt="Leyla portrait" />
        </div>
        <div className="about-copy">
          <h2>Somewhere between code and storytelling</h2>
          <p>
            Hello! I'm Leyla, a software developer based in Eskişehir. I like shaping architecture
            on one side while crafting sentences on the other — and I have never found those two
            contradictory.
          </p>
          <p>
            I started my career as a web developer and gradually moved into the mobile world. I am
            now deepening my focus on Flutter and Node.js; in my spare time, I write on my blog
            about life, technology, and the notes I keep for myself.
          </p>
          <p>This site is my digital garden: sometimes neat, sometimes messy, but always genuine.</p>

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
                <div className="tl-year">2026 — Present</div>
                <div className="tl-title">Senior Mobile Developer</div>
                <div className="tl-desc">I work on Flutter-based products and design systems.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot"></div>
              <div>
                <div className="tl-year">2023 — 2026</div>
                <div className="tl-title">Frontend Developer</div>
                <div className="tl-desc">I built end-to-end web products with React and Node.js.</div>
              </div>
            </div>
            <div className="tl-item">
              <div className="tl-dot"></div>
              <div>
                <div className="tl-year">2021</div>
                <div className="tl-title">I started writing</div>
                <div className="tl-desc">
                  I published my first blog post, and I've been writing consistently ever since.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
