import { useEffect, useMemo, useState } from "react";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const buildApiUrl = (path) => {
  if (!API_BASE) {
    return path;
  }

  return `${API_BASE}${path}`;
};

const navItems = [
  { id: "about", label: "About" },
  { id: "education", label: "Education" },
  { id: "certifications", label: "Certifications" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" }
];

const iconToken = {
  Trophy: "TR",
  Target: "TG",
  Star: "ST",
  Link: "IN",
  Code: "GH",
  Mail: "EM"
};

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [submitState, setSubmitState] = useState({ type: "", message: "" });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const year = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    let ignore = false;

    async function fetchPortfolio() {
      try {
        const response = await fetch(buildApiUrl("/api/portfolio"));

        if (!response.ok) {
          throw new Error("Failed to fetch portfolio data");
        }

        const data = await response.json();

        if (!ignore) {
          setPortfolio(data);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Something went wrong");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchPortfolio();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 100);
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!portfolio) {
      return undefined;
    }

    const elements = document.querySelectorAll(".js-reveal");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [portfolio]);

  function handleSectionJump(event, sectionId) {
    event.preventDefault();
    const target = document.getElementById(sectionId);

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setMenuOpen(false);
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleContactSubmit(event) {
    event.preventDefault();
    setSubmitState({ type: "", message: "" });

    if (!formData.name || !formData.email || !formData.message) {
      setSubmitState({ type: "error", message: "Please fill all fields." });
      return;
    }

    try {
      setSending(true);
      const response = await fetch(buildApiUrl("/api/contact"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload.error || "Failed to send message");
      }

      setFormData({ name: "", email: "", message: "" });
      setSubmitState({ type: "success", message: "Message sent successfully." });
    } catch (err) {
      setSubmitState({ type: "error", message: err.message || "Failed to send message." });
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <main className="status-screen">
        <p>Loading portfolio...</p>
      </main>
    );
  }

  if (error || !portfolio) {
    return (
      <main className="status-screen">
        <p>{error || "Unable to load portfolio data."}</p>
      </main>
    );
  }

  return (
    <>
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <h2>{portfolio.fullName}</h2>
          </div>

          <ul className={`nav-menu ${menuOpen ? "active" : ""}`}>
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="nav-link"
                  onClick={(event) => handleSectionJump(event, item.id)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <button
            type="button"
            className={`hamburger ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      <section id="about" className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              <span className="hero-greeting">Hello, I&apos;m</span>
              <span className="hero-name">{portfolio.fullName}</span>
            </h1>
            <h2 className="hero-subtitle">{portfolio.role}</h2>
            <p className="hero-description">{portfolio.summary}</p>
            <div className="hero-cta">
              <a
                href="#contact"
                className="btn-primary"
                onClick={(event) => handleSectionJump(event, "contact")}
              >
                Get In Touch
              </a>
              <a href={portfolio.cvUrl} className="btn-secondary" download>
                Download CV
              </a>
            </div>
          </div>
          <div className="hero-image">
            <img src={portfolio.heroImageUrl} alt="Profile" />
          </div>
        </div>
      </section>

      <section id="education" className="education">
        <div className="container">
          <h2 className="section-title">Education</h2>
          <div className="timeline">
            {portfolio.education.map((item, index) => (
              <div className="timeline-item js-reveal" key={`${item.degree}-${index}`}>
                <div className="timeline-dot"></div>
                <div className="timeline-content">
                  <h3 className="timeline-title">{item.degree}</h3>
                  <h4 className="timeline-subtitle">{item.institute}</h4>
                  <span className="timeline-date">{item.year}</span>
                  <p className="timeline-description">{item.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="certifications" className="certifications">
        <div className="container">
          <h2 className="section-title">Certifications</h2>
          <div className="cert-grid">
            {portfolio.certifications.map((cert, index) => (
              <article className="cert-card js-reveal" key={`${cert.title}-${index}`}>
                <div className="cert-icon">{iconToken[cert.iconLabel] || "CT"}</div>
                <h3 className="cert-title">{cert.title}</h3>
                <p className="cert-issuer">{cert.issuer}</p>
                <span className="cert-date">{cert.date}</span>
                <p className="cert-description">
                  <a href={cert.url} target="_blank" rel="noreferrer">
                    Click to View
                  </a>
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="achievements" className="achievements">
        <div className="container">
          <h2 className="section-title">Key Achievements</h2>
          <div className="achievements-grid">
            {portfolio.achievements.map((achievement, index) => (
              <article className="achievement-item js-reveal" key={`${achievement.title}-${index}`}>
                <div className="achievement-number">{String(index + 1).padStart(2, "0")}</div>
                <div className="achievement-content">
                  <h3 className="achievement-title">{achievement.title}</h3>
                  <p className="achievement-description">{achievement.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="contact">
        <div className="container">
          <h2 className="section-title">Let&apos;s Connect</h2>
          <p className="contact-description">I&apos;m looking forward to connecting with you.</p>

          <div className="contact-links">
            {portfolio.contacts.map((contact, index) => (
              <a
                key={`${contact.label}-${index}`}
                href={contact.url}
                className="contact-link"
                target={contact.url.startsWith("mailto:") ? undefined : "_blank"}
                rel={contact.url.startsWith("mailto:") ? undefined : "noreferrer"}
              >
                <span className="contact-icon">{iconToken[contact.iconLabel] || "LN"}</span>
                <span>{contact.label}</span>
              </a>
            ))}
          </div>

          <form className="contact-form" onSubmit={handleContactSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your message"
              rows="4"
              value={formData.message}
              onChange={handleInputChange}
              required
            ></textarea>
            <button type="submit" className="btn-primary" disabled={sending}>
              {sending ? "Sending..." : "Send Message"}
            </button>
            {submitState.message ? (
              <p className={`form-status ${submitState.type}`}>{submitState.message}</p>
            ) : null}
          </form>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>&copy; {year} Amajad. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;
