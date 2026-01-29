import React, { useState, useEffect, useRef } from "react";
import "./App.css";

// Floating Orbs Background Component
const FloatingOrbs = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let orbs = [];
    let mouseX = 0;
    let mouseY = 0;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    class Orb {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseRadius = Math.random() * 150 + 80;
        this.radius = this.baseRadius;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.hue = Math.random() * 40 + 20; // Gold range
        this.saturation = 70 + Math.random() * 30;
        this.lightness = 50 + Math.random() * 20;
        this.alpha = 0.03 + Math.random() * 0.04;
        this.pulseSpeed = 0.01 + Math.random() * 0.02;
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update(time) {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < -this.radius) this.x = canvas.width + this.radius;
        if (this.x > canvas.width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = canvas.height + this.radius;
        if (this.y > canvas.height + this.radius) this.y = -this.radius;

        // Subtle pulse
        this.radius = this.baseRadius + Math.sin(time * this.pulseSpeed + this.pulsePhase) * 20;

        // React slightly to mouse
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 300) {
          this.x -= dx * 0.001;
          this.y -= dy * 0.001;
        }
      }

      draw() {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius
        );
        gradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha * 2})`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`);
        gradient.addColorStop(1, `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, 0)`);
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      }
    }

    const init = () => {
      orbs = [];
      const orbCount = 8;
      for (let i = 0; i < orbCount; i++) {
        orbs.push(new Orb());
      }
    };

    let time = 0;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 1;

      orbs.forEach((orb) => {
        orb.update(time);
        orb.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    init();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="orbs-canvas" />;
};

// Typing Animation Component
const TypeWriter = ({ texts, speed = 100 }) => {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (charIndex < currentText.length) {
            setDisplayText(currentText.substring(0, charIndex + 1));
            setCharIndex(charIndex + 1);
          } else {
            setTimeout(() => setIsDeleting(true), 2000);
          }
        } else {
          if (charIndex > 0) {
            setDisplayText(currentText.substring(0, charIndex - 1));
            setCharIndex(charIndex - 1);
          } else {
            setIsDeleting(false);
            setTextIndex((textIndex + 1) % texts.length);
          }
        }
      },
      isDeleting ? speed / 2 : speed
    );

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, speed]);

  return (
    <span className="typewriter">
      {displayText}
      <span className="cursor">|</span>
    </span>
  );
};

// Navigation Component
const Navigation = ({ activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "education", label: "Education" },
    { id: "experience", label: "Experience" },
    { id: "projects", label: "Projects" },
    { id: "skills", label: "Skills" },
    { id: "contact", label: "Contact" },
  ];

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <nav className={`navigation ${isScrolled ? "scrolled" : ""}`}>
      <div className="nav-content">
        <div className="nav-logo" onClick={() => scrollToSection("home")}>
          <span className="logo-bracket">&lt;</span>
          <span className="logo-text">FM</span>
          <span className="logo-bracket">/&gt;</span>
        </div>
        <button
          className={`menu-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                className={activeSection === item.id ? "active" : ""}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

// Hero Section
const HeroSection = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="hero-section">
      <FloatingOrbs />
      <div className="hero-gradient-overlay"></div>
      <div className="hero-content">
        <div className="hero-greeting">Hello, I'm</div>
        <h1 className="hero-name">
          <span className="name-first">Feras</span>
          <span className="name-last">Machta</span>
        </h1>
        <div className="hero-title-wrapper">
          <span className="hero-title-prefix">I'm a </span>
          <div className="hero-subtitle">
            <TypeWriter
              texts={[
                "Software Engineer",
                "Full-Stack Developer",
                "AI Enthusiast",
                "Mobile App Developer",
              ]}
              speed={80}
            />
          </div>
        </div>
        <p className="hero-description">
          Crafting elegant solutions to complex problems through code.
          <br />
          Based in California, building the future one project at a time.
        </p>
        <div className="hero-cta">
          <a href="#projects" className="cta-button primary">
            <span>View My Work</span>
            <svg className="cta-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </a>
          <a href="#contact" className="cta-button secondary">
            <span>Let's Talk</span>
          </a>
        </div>
      </div>
      <button 
        className="scroll-indicator" 
        onClick={() => scrollToSection("about")}
        aria-label="Scroll to about section"
      >
        <div className="scroll-line">
          <div className="scroll-dot"></div>
        </div>
        <span>Scroll</span>
      </button>
    </section>
  );
};

// About Section
const AboutSection = () => {
  return (
    <section id="about" className="about-section">
      <div className="section-container">
        <h2 className="section-title">
          <span className="title-number">01.</span>
          About Me
        </h2>
        <div className="about-content">
          <div className="about-text">
            <div className="terminal-window">
              <div className="terminal-header">
                <span className="terminal-dot red"></span>
                <span className="terminal-dot yellow"></span>
                <span className="terminal-dot green"></span>
                <span className="terminal-title">about.sh</span>
              </div>
              <div className="terminal-body">
                <p>
                  <span className="prompt">$</span> cat summary.txt
                </p>
                <p className="output">
                  Entry-level <span className="highlight">Software Engineer</span> with a
                  B.S. in Computer Science from Cal Poly Pomona. Passionate about
                  building full-stack applications and integrating AI technologies
                  to create innovative solutions.
                </p>
                <p>
                  <span className="prompt">$</span> ls skills/
                </p>
                <p className="output">
                  full-stack-development/ AI-integration/ data-visualization/
                  mobile-apps/ problem-solving/
                </p>
                <p>
                  <span className="prompt">$</span> echo $CURRENT_FOCUS
                </p>
                <p className="output">
                  Developing applications that leverage LLM APIs, building
                  cross-platform mobile apps with Flutter, and creating intuitive
                  user experiences.
                </p>
                <p>
                  <span className="prompt">$</span>{" "}
                  <span className="cursor-blink">_</span>
                </p>
              </div>
            </div>
          </div>
          <div className="about-stats">
            <div className="stat-card">
              <div className="stat-icon">🎓</div>
              <div className="stat-value">3.70</div>
              <div className="stat-label">GPA</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">💻</div>
              <div className="stat-value">5+</div>
              <div className="stat-label">Projects</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">🛠️</div>
              <div className="stat-value">10+</div>
              <div className="stat-label">Technologies</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📱</div>
              <div className="stat-value">1</div>
              <div className="stat-label">Published App</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Education Section
const EducationSection = () => {
  const education = [
    {
      school: "California State Polytechnic University, Pomona",
      degree: "B.S., Computer Science",
      period: "Jun 2023 - Jun 2025",
      location: "Pomona, CA",
      gpa: "3.70 / 4.0",
      coursework: [
        "Software Engineering",
        "Operating Systems",
        "Algorithms",
        "Artificial Intelligence",
        "System Design",
      ],
    },
    {
      school: "Santiago Canyon College",
      degree: "Associates Degree in Mathematics, Chemistry, and Biology",
      period: "Jun 2021 - May 2023",
      location: "Orange, CA",
      gpa: "3.7 / 4.0",
      coursework: [
        "Calculus",
        "Linear Algebra",
        "Physics",
        "Differential Equations",
        "Organic Chemistry",
        "Cellular Biology",
      ],
    },
  ];

  return (
    <section id="education" className="education-section">
      <div className="section-container">
        <h2 className="section-title">
          <span className="title-number">02.</span>
          Education
        </h2>
        <div className="timeline">
          {education.map((edu, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-marker">
                <div className="marker-dot"></div>
              </div>
              <div className="timeline-content">
                <div className="edu-card">
                  <div className="edu-header">
                    <h3>{edu.school}</h3>
                    <span className="edu-period">{edu.period}</span>
                  </div>
                  <div className="edu-degree">{edu.degree}</div>
                  <div className="edu-details">
                    <span className="edu-location">📍 {edu.location}</span>
                    <span className="edu-gpa">📊 GPA: {edu.gpa}</span>
                  </div>
                  <div className="edu-coursework">
                    <span className="coursework-label">Coursework:</span>
                    <div className="coursework-tags">
                      {edu.coursework.map((course, i) => (
                        <span key={i} className="course-tag">
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Experience Section
const ExperienceSection = () => {
  return (
    <section id="experience" className="experience-section">
      <div className="section-container">
        <h2 className="section-title">
          <span className="title-number">03.</span>
          Experience
        </h2>
        <div className="experience-card">
          <div className="exp-header">
            <div className="exp-company">
              <h3>Inscribe Heath</h3>
              <span className="exp-role">Medical Scribe</span>
            </div>
            <div className="exp-meta">
              <span className="exp-date">Sep 2025 - Present</span>
              <span className="exp-location">Corona, CA</span>
            </div>
          </div>
          <ul className="exp-duties">
            <li>
              <span className="duty-marker">▹</span>
              Streamlined clinical operations by accurately documenting patient
              history and physical exams in real-time, allowing providers to
              focus exclusively on direct patient care.
            </li>
            <li>
              <span className="duty-marker">▹</span>
              Developed strong attention to detail and ability to work under
              pressure in fast-paced medical environments.
            </li>
            <li>
              <span className="duty-marker">▹</span>
              Enhanced communication skills through continuous interaction with
              healthcare professionals and patients.
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

// Projects Section
const ProjectsSection = () => {
  const projects = [
    {
      title: "Weight Watcher AI",
      description:
        "A fitness app for calorie and workout tracking with AI-driven guidance using the Google Gemini API. Built a robust system for logging meals and exercise, with user profile management and goal setting.",
      technologies: ["Flutter", "Dart", "Google Gemini API", "Google Firebase"],
      github: "https://github.com/fmachta/weightwatcherAI",
      period: "Jan 2025 - May 2025",
      icon: "🏋️",
    },
    {
      title: "Retree",
      description:
        "A Flutter-based retro gaming app with Pac-Man, Snake, Tetris, and more. Features secure Firebase Authentication, leaderboards, and a neon-themed UI. Published on the App Store.",
      technologies: ["Flutter", "Dart", "Firebase"],
      github: "https://github.com/fmachta/retree",
      period: "Jan 2025 - May 2025",
      icon: "🎮",
      featured: true,
    },
    {
      title: "Image to Haptic App",
      description:
        "A mobile app that captures images of multiple-choice questions, processes them using AI models, and delivers predicted answers with haptic feedback. Integrated Google Cloud Vision for OCR mode.",
      technologies: [
        "Flutter",
        "Dart",
        "Google Gemini API",
        "Google Cloud Vision API",
        "OpenAI API",
        "XAI API",
        "Firebase",
      ],
      github: "https://github.com/fmachta/image-haptic-app",
      period: "Jan 2025 - Jul 2025",
      icon: "📷",
    },
  ];

  return (
    <section id="projects" className="projects-section">
      <div className="section-container">
        <h2 className="section-title">
          <span className="title-number">04.</span>
          Projects
        </h2>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`project-card ${project.featured ? "featured" : ""}`}
            >
              <div className="project-icon">{project.icon}</div>
              <div className="project-header">
                <h3>{project.title}</h3>
                <div className="project-links">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                </div>
              </div>
              <p className="project-description">{project.description}</p>
              <div className="project-period">{project.period}</div>
              <div className="project-tech">
                {project.technologies.map((tech, i) => (
                  <span key={i} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
              {project.featured && (
                <div className="featured-badge">
                  <span>📱 Published on App Store</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Skills Section
const SkillsSection = () => {
  const skillCategories = [
    {
      title: "Languages",
      skills: [
        { name: "Python", level: 90 },
        { name: "JavaScript", level: 85 },
        { name: "Dart", level: 85 },
        { name: "C++", level: 75 },
        { name: "SQL", level: 80 },
      ],
    },
    {
      title: "Frameworks & Tools",
      skills: [
        { name: "React", level: 80 },
        { name: "Flutter", level: 90 },
        { name: "Node.js", level: 75 },
        { name: "Docker", level: 70 },
        { name: "Firebase", level: 85 },
      ],
    },
    {
      title: "Cloud & AI",
      skills: [
        { name: "AWS", level: 70 },
        { name: "Google Cloud", level: 75 },
        { name: "Machine Learning", level: 70 },
        { name: "LLM APIs", level: 85 },
      ],
    },
  ];

  const techIcons = [
    "Python", "JavaScript", "React", "Flutter", "Firebase",
    "Docker", "AWS", "Node.js", "C++", "SQL"
  ];

  return (
    <section id="skills" className="skills-section">
      <div className="section-container">
        <h2 className="section-title">
          <span className="title-number">05.</span>
          Skills
        </h2>
        <div className="skills-content">
          <div className="skills-categories">
            {skillCategories.map((category, index) => (
              <div key={index} className="skill-category">
                <h3 className="category-title">{category.title}</h3>
                <div className="skills-list">
                  {category.skills.map((skill, i) => (
                    <div key={i} className="skill-item">
                      <div className="skill-info">
                        <span className="skill-name">{skill.name}</span>
                        <span className="skill-level">{skill.level}%</span>
                      </div>
                      <div className="skill-bar">
                        <div
                          className="skill-progress"
                          style={{ "--progress": `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="tech-cloud">
            {techIcons.map((tech, index) => (
              <div
                key={index}
                className="tech-bubble"
                style={{
                  "--delay": `${index * 0.2}s`,
                  "--size": `${Math.random() * 20 + 60}px`,
                }}
              >
                {tech}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Contact Section
const ContactSection = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="section-container">
        <h2 className="section-title">
          <span className="title-number">06.</span>
          Get In Touch
        </h2>
        <div className="contact-content-centered">
          <h3 className="contact-heading">Let's Connect</h3>
          <p className="contact-description">
            I'm currently looking for new opportunities. Whether you have a
            question or just want to say hi, feel free to reach out!
          </p>
          <div className="contact-cards">
            <a href="mailto:fmachta88@gmail.com" className="contact-card">
              <span className="contact-card-icon">📧</span>
              <span className="contact-card-label">Email</span>
              <span className="contact-card-value">fmachta88@gmail.com</span>
            </a>
            <a href="tel:+17148125872" className="contact-card">
              <span className="contact-card-icon">📱</span>
              <span className="contact-card-label">Phone</span>
              <span className="contact-card-value">(714) 812-5872</span>
            </a>
            <div className="contact-card">
              <span className="contact-card-icon">📍</span>
              <span className="contact-card-label">Location</span>
              <span className="contact-card-value">Anaheim, CA</span>
            </div>
          </div>
          <div className="social-links-centered">
            <a
              href="https://github.com/fmachta"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link-large"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              <span>GitHub</span>
            </a>
            <a
              href="https://linkedin.com/in/feras-machta"
              target="_blank"
              rel="noopener noreferrer"
              className="social-link-large"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          Designed & Built by <span className="highlight">Feras Machta</span>
        </p>
        <p className="footer-tech">React + CSS Animations + Canvas API</p>
        <p className="footer-year">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
};

// Main App Component
function App() {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "home",
        "about",
        "education",
        "experience",
        "projects",
        "skills",
        "contact",
      ];
      const scrollPosition = window.scrollY + 100;

      for (const sectionId of sections) {
        const section = document.getElementById(sectionId);
        if (section) {
          const offsetTop = section.offsetTop;
          const offsetHeight = section.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="app">
      <Navigation activeSection={activeSection} />
      <main>
        <HeroSection />
        <AboutSection />
        <EducationSection />
        <ExperienceSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
