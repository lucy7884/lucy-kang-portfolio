const revealItems = document.querySelectorAll(".section-reveal");
const isMobileViewport = window.matchMedia("(max-width: 700px)").matches;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.documentElement.classList.add("js-ready");

const showEverything = () => {
  revealItems.forEach((item) => item.classList.add("is-visible"));
};

const splitHeroTitle = () => {
  const title = document.querySelector(".hero-copy h1");

  if (!title || title.dataset.split === "true") return [];

  const text = title.textContent.trim();
  title.dataset.split = "true";
  title.classList.add("hero-title");
  title.setAttribute("aria-label", text);
  title.textContent = "";

  Array.from(text).forEach((character) => {
    const span = document.createElement("span");
    span.className = character === " " ? "title-char title-space" : "title-char";
    span.setAttribute("aria-hidden", "true");
    span.textContent = character === " " ? "\u00A0" : character;
    title.appendChild(span);
  });

  return title.querySelectorAll(".title-char");
};

const runFallbackReveal = () => {
  if (!("IntersectionObserver" in window)) {
    showEverything();
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: isMobileViewport ? 0.08 : 0.16,
      rootMargin: isMobileViewport ? "0px 0px -12% 0px" : "0px 0px -80px 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
};

const runGsapReveal = () => {
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("gsap-ready");
  showEverything();
  const titleChars = splitHeroTitle();

  gsap.from(".brand, .nav", {
    y: -18,
    opacity: 0,
    duration: 0.7,
    ease: "power3.out",
    stagger: 0.12,
  });

  const heroTimeline = gsap.timeline({ delay: 0.14 });

  heroTimeline
    .from(".hero-copy .eyebrow", {
      y: 18,
      opacity: 0,
      duration: 0.5,
      ease: "power3.out",
    })
    .from(
      titleChars,
      {
        y: isMobileViewport ? 18 : 26,
        opacity: 0,
        filter: "blur(8px)",
        duration: 0.16,
        ease: "power2.out",
        stagger: isMobileViewport ? 0.035 : 0.045,
      },
      "-=0.1"
    )
    .from(
      ".hero-text, .hero-actions",
      {
        y: isMobileViewport ? 24 : 34,
        opacity: 0,
        duration: 0.72,
        ease: "power3.out",
        stagger: 0.1,
      },
      "-=0.05"
    );

  gsap.from(".hero-panel", {
    y: isMobileViewport ? 30 : 54,
    scale: isMobileViewport ? 0.97 : 0.94,
    opacity: 0,
    duration: 1.05,
    ease: "power3.out",
    delay: 0.18,
  });

  gsap.utils.toArray(".section-reveal:not(.hero)").forEach((section) => {
    const headingItems = section.querySelectorAll(".section-label, .section-heading > *, .contact > .eyebrow, .contact > h2, .contact > p");
    const contentItems = section.querySelectorAll(".about-grid article, .project-card, .skill-cloud span, .process-track div, .contact-links a");

    gsap.from(headingItems, {
      scrollTrigger: {
        trigger: section,
        start: isMobileViewport ? "top 86%" : "top 78%",
        once: true,
      },
      y: isMobileViewport ? 26 : 36,
      opacity: 0,
      duration: 0.72,
      ease: "power3.out",
      stagger: 0.08,
    });

    gsap.from(contentItems, {
      scrollTrigger: {
        trigger: section,
        start: isMobileViewport ? "top 78%" : "top 70%",
        once: true,
      },
      y: isMobileViewport ? 34 : 46,
      scale: isMobileViewport ? 0.98 : 0.965,
      opacity: 0,
      duration: 0.76,
      ease: "power3.out",
      stagger: isMobileViewport ? 0.06 : 0.1,
    });
  });

  gsap.utils.toArray(".project-card").forEach((card) => {
    const image = card.querySelector(".project-visual img");

    if (!image) return;

    gsap.fromTo(
      image,
      { scale: 1.08 },
      {
        scale: 1.01,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.7,
        },
      }
    );
  });
};

if (prefersReducedMotion) {
  showEverything();
} else if (window.gsap && window.ScrollTrigger) {
  runGsapReveal();
} else {
  runFallbackReveal();
}
