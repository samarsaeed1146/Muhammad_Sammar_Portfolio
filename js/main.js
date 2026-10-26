const $ = (s) => document.querySelector(s);
const el = (tag, cls = "", text = "") => {
  const n = document.createElement(tag);
  n.className = cls;
  if (text) n.textContent = text;
  return n;
};

const avImg = $("#avatar-img");
const useFallback = () => {
  $("#avatar").innerHTML = avatarFallback;
};
avImg.addEventListener("error", useFallback);
if (avImg.complete && avImg.naturalWidth === 0) useFallback();

const aboutImg = $("#about-img");
const usePlaceholder = () => {
  $("#about-pic").innerHTML = aboutPlaceholder;
};
aboutImg.addEventListener("error", usePlaceholder);
if (aboutImg.complete && aboutImg.naturalWidth === 0) usePlaceholder();

const root = document.documentElement;
$("#theme").addEventListener("click", () => {
  const on = root.classList.toggle("dark");
  root.setAttribute("data-bs-theme", on ? "dark" : "light");
  try {
    localStorage.setItem("theme", on ? "dark" : "light");
  } catch (e) {}
});

const typed = $("#typed");
if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
  typed.textContent = profile.typedPhrases[0];
} else {
  let p = 0,
    c = 0,
    del = false,
    timer = 0,
    inView = true;
  const tick = () => {
    const phrase = profile.typedPhrases[p];
    c += del ? -1 : 1;
    typed.textContent = phrase.slice(0, c);
    let wait = del ? 35 : 70;
    if (!del && c === phrase.length) {
      del = true;
      wait = 1800;
    } else if (del && c === 0) {
      del = false;
      p = (p + 1) % profile.typedPhrases.length;
      wait = 400;
    }
    timer = setTimeout(tick, wait);
  };
  const sync = () => {
    clearTimeout(timer);
    if (inView && !document.hidden) tick();
  };
  new IntersectionObserver(([e]) => {
    inView = e.isIntersecting;
    sync();
  }).observe($("#top"));
  document.addEventListener("visibilitychange", sync);
}

const seen =
  "IntersectionObserver" in window
    ? new IntersectionObserver(
        (list) =>
          list.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add("in");
              seen.unobserve(en.target);
            }
          }),
        { threshold: 0.1 },
      )
    : null;
const reveal = (n) => {
  n.classList.add("reveal");
  seen ? seen.observe(n) : n.classList.add("in");
  return n;
};

[0, 1].forEach((i) => {
  const ul = el("ul", "flex shrink-0 items-center gap-12 pr-12");
  if (i) ul.setAttribute("aria-hidden", "true");
  [...new Set(Object.values(skills).flat())].forEach((t) =>
    ul.appendChild(
      el(
        "li",
        "whitespace-nowrap font-display text-xl font-bold text-mute/70",
        t,
      ),
    ),
  );
  $("#marquee").appendChild(ul);
});

const projectRows = projects.map((p) => {
  const li = reveal(el("li", "flex"));
  li.dataset.type = p.type;
  const card = el(
    "article",
    "group flex w-full flex-col overflow-hidden rounded-2xl border border-line bg-surface transition duration-300 hover:-translate-y-1 hover:border-accent/50 hover:shadow-glow",
  );
  const fig = el("div", "overflow-hidden border-b border-line");
  const inner = el("div", "transition duration-500 group-hover:scale-105");
  if (p.image) {
    const im = el("img", "block w-full");
    im.src = p.image;
    im.alt = p.title + " screenshot";
    im.loading = "lazy";
    im.decoding = "async";
    im.addEventListener("error", () => {
      inner.innerHTML = thumbs[p.kind] || "";
    });
    inner.appendChild(im);
  } else inner.innerHTML = thumbs[p.kind] || "";
  fig.appendChild(inner);
  const body = el("div", "flex flex-1 flex-col p-6");
  const head = el("div", "flex items-start justify-between gap-3");
  head.append(
    el("h3", "font-display text-2xl font-bold", p.title),
    el(
      "span",
      "shrink-0 rounded-full border border-line px-2.5 py-0.5 text-xs text-mute",
      p.type + " · " + p.year,
    ),
  );
  const tags = el("ul", "mt-4 flex flex-wrap gap-2");
  p.stack.forEach((t) =>
    tags.appendChild(
      el(
        "li",
        "rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent",
        t,
      ),
    ),
  );
  const links = el("div", "mt-auto flex gap-5 pt-5 text-sm font-medium");
  [
    ["Live site", p.live],
    ["Source code", p.code],
  ].forEach(([label, href]) => {
    if (!href) return;
    const a = el(
      "a",
      "text-accent underline-offset-4 hover:underline",
      label + " \u2192",
    );
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    links.appendChild(a);
  });
  body.append(head, el("p", "mt-3 text-mute", p.desc), tags, links);
  card.append(fig, body);
  li.appendChild(card);
  return li;
});
$("#projects").append(...projectRows);

$("#project-count").textContent = projects.length;

const on = "border-transparent bg-accent text-bg",
  off = "border-line text-mute hover:border-accent hover:text-ink";
const filterBox = $("#filters");
const kinds = [...new Set(projects.map((p) => p.type))];
(kinds.length > 1 ? ["All", ...kinds] : []).forEach((t, i) => {
  const b = el(
    "button",
    "rounded-full border px-4 py-1.5 text-sm transition " + (i ? off : on),
    t,
  );
  b.type = "button";
  b.dataset.filter = t;
  b.setAttribute("aria-pressed", !i);
  filterBox.appendChild(b);
});
filterBox.addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  filterBox.querySelectorAll("button").forEach((x) => {
    const sel = x === b;
    x.className =
      "rounded-full border px-4 py-1.5 text-sm transition " + (sel ? on : off);
    x.setAttribute("aria-pressed", sel);
  });
  projectRows.forEach((li) => {
    li.hidden =
      b.dataset.filter !== "All" && li.dataset.type !== b.dataset.filter;
  });
});

Object.entries(skills).forEach(([group, items]) => {
  const wrap = el("div");
  wrap.appendChild(
    el("dt", "text-xs font-medium uppercase tracking-wider text-mute", group),
  );
  const dd = el("dd", "mt-3 flex flex-wrap justify-center gap-2");
  items.forEach((t) =>
    dd.appendChild(
      el("span", "rounded-lg border border-line bg-bg px-3 py-1.5", t),
    ),
  );
  wrap.appendChild(dd);
  $("#skills").appendChild(wrap);
});

profile.links.forEach((l) => {
  const li = el("li");
  const a = el(
    "a",
    "inline-flex items-center gap-2 rounded-full border border-line bg-bg px-4 py-2 transition hover:border-accent hover:text-accent",
    l.label + " \u2197",
  );
  a.href = l.href;
  if (l.href.startsWith("http")) {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }
  li.appendChild(a);
  $("#links").appendChild(li);
});
document.querySelectorAll("[data-reveal]").forEach(reveal);

function notify(msg, ok = true) {
  const t = $("#toast");
  $("#toast-msg").textContent = msg;
  $("#toast-msg").classList.toggle("text-danger-emphasis", !ok);
  if (window.bootstrap) {
    bootstrap.Toast.getInstance(t)?.dispose();
    new bootstrap.Toast(t, { delay: ok ? 5000 : 12000 }).show();
  } else alert(msg);
}

const navMenu = $("#navMenu");
navMenu.addEventListener("click", (e) => {
  if (
    e.target.closest("a") &&
    navMenu.classList.contains("show") &&
    window.bootstrap
  )
    bootstrap.Collapse.getOrCreateInstance(navMenu).hide();
});

const FORM_ENDPOINT = "https://formsubmit.co/ajax/" + profile.email;
$("#send").addEventListener("click", async () => {
  const name = $("#name").value.trim(),
    email = $("#email").value.trim(),
    msg = $("#msg").value.trim();
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !msg) {
    notify("Please enter your name, a valid email and a message.", false);
    return;
  }
  const btn = $("#send"),
    label = btn.textContent;
  btn.disabled = true;
  btn.textContent = "Sending...";
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        message: msg,
        _subject: "Portfolio enquiry from " + name,
        _template: "table",
        _captcha: "false",
      }),
    });
    let data = {};
    try {
      data = await res.json();
    } catch (e) {}
    if (!res.ok || data.success === false || data.success === "false")
      throw new Error(
        data.message || "The server replied with status " + res.status + ".",
      );
    $("#name").value = "";
    $("#email").value = "";
    $("#msg").value = "";
    notify("Thank you! Your message was sent. I will reply soon.");
  } catch (err) {
    console.error("Contact form error:", err);
    let why = err && err.message ? err.message : "";
    if (err instanceof TypeError)
      why = "Could not reach the mail service. Check your internet connection.";
    if (location.protocol === "file:")
      why =
        "The form only works when the site is online, not when the file is opened from your computer.";
    notify(
      "Message not sent. " + (why || "Please try again in a moment."),
      false,
    );
  } finally {
    btn.disabled = false;
    btn.textContent = label;
  }
});

$("#year").textContent = new Date().getFullYear();
