(() => {
  const WA = "https://wa.me/5518996934204";

  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav__toggle");
  const menu = document.querySelector(".nav__menu");
  const toTop = document.querySelector(".to-top");

  if (nav && toggle && menu) {
    const setOpen = (open) => {
      toggle.setAttribute("aria-expanded", String(open));
      menu.classList.toggle("is-open", open);
      document.body.classList.toggle("is-locked", open);
    };

    toggle.addEventListener("click", () => {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setOpen(false);
    });

    const navQuery = window.matchMedia("(min-width: 921px)");
    navQuery.addEventListener("change", (e) => {
      if (e.matches) setOpen(false);
    });
  }

  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle("is-scrolled", y > 8);
    if (toTop) toTop.classList.toggle("is-visible", y > 700);
    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true },
  );
  onScroll();

  if (toTop) {
    toTop.addEventListener("click", () =>
      window.scrollTo({ top: 0, behavior: "smooth" }),
    );
  }

  const revealables = document.querySelectorAll("[data-reveal]");
  if (revealables.length) {
    if (!("IntersectionObserver" in window)) {
      revealables.forEach((el) => el.classList.add("is-in"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              io.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
      );
      revealables.forEach((el) => io.observe(el));
    }
  }

  const schedule = [
    { el: document.querySelector('[data-day="seg-sex"]'), day: [1, 2, 3, 4, 5], hours: [[5, 22]] },
    { el: document.querySelector('[data-day="sab"]'), day: [6], hours: [[8, 12], [16, 20]] },
    { el: document.querySelector('[data-day="dom"]'), day: [0], hours: [[9, 12], [17, 20]] },
  ].filter((d) => d.el);

  if (schedule.length) {
    let day = new Date().getDay();
    let hour = new Date().getHours() + new Date().getMinutes() / 60;

    try {
      const now = new Date();
      const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/Sao_Paulo",
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).formatToParts(now);
      const get = (t) => parts.find((p) => p.type === t)?.value;
      const shortDay = get("weekday");
      day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(shortDay ?? "");
      hour = Number(get("hour")) % 24 + Number(get("minute")) / 60;
    } catch {}

    const current = schedule.find((d) => d.day.includes(day));
    const isOpen =
      !!current && current.hours.some(([from, to]) => hour >= from && hour < to);

    if (current) {
      const badge = document.createElement("span");
      badge.className = "day__status";
      badge.innerHTML = `<i></i>${isOpen ? "Aberto agora" : "Fechado agora"}`;
      current.el.appendChild(badge);
      if (isOpen) current.el.classList.add("is-open");
    }
  }

  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });

  const form = document.querySelector("[data-wa-form]");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const nome = String(data.get("nome") || "").trim();
      const objetivo = String(data.get("objetivo") || "").trim();
      const msg = String(data.get("mensagem") || "").trim();

      const lines = [
        "Olá! Vim pelo site da Spartan Gym.",
        nome ? `Meu nome é ${nome}.` : "",
        objetivo ? `Interesse: ${objetivo}.` : "",
        msg ? `Mensagem: ${msg}` : "",
        "Quero agendar uma aula experimental.",
      ].filter(Boolean);

      window.open(`${WA}?text=${encodeURIComponent(lines.join(" "))}`, "_blank", "noopener");
    });
  }
})();