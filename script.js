const revealItems = document.querySelectorAll(".section-reveal");
const isMobileViewport = window.matchMedia("(max-width: 700px)").matches;

document.documentElement.classList.add("js-ready");

if (!("IntersectionObserver" in window)) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
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

  revealItems.forEach((item) => {
    revealObserver.observe(item);
  });
}
