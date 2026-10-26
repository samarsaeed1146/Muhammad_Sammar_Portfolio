const f = (c, o) =>
  `style="fill:rgb(var(--${c}))"${o ? ` fill-opacity="${o}"` : ""}`;
const st = (c, w = 2) =>
  `style="fill:none;stroke:rgb(var(--${c}));stroke-width:${w};stroke-linecap:round;stroke-linejoin:round"`;
const frame = (
  label,
  inner,
) => `<svg viewBox="0 0 320 200" role="img" aria-label="${label}" class="block w-full" xmlns="http://www.w3.org/2000/svg">
  <rect width="320" height="200" ${f("surface")}/><rect width="320" height="22" ${f("line")}/>
  <circle cx="12" cy="11" r="3" fill="#ef4444"/><circle cx="23" cy="11" r="3" fill="#f59e0b"/><circle cx="34" cy="11" r="3" fill="#10b981"/>
  <rect x="80" y="6" width="160" height="10" rx="5" ${f("bg")}/>${inner}</svg>`;
const cards = [0, 1, 2, 3, 4, 5]
  .map(
    (
      i,
    ) => `<g transform="translate(${16 + (i % 3) * 100} ${34 + Math.floor(i / 3) * 82})">
  <rect width="92" height="74" rx="6" ${f("bg")}/><rect x="6" y="6" width="80" height="38" rx="4" ${f("accent", 0.15 + (i % 3) * 0.18)}/>
  <rect x="6" y="50" width="52" height="5" rx="2.5" ${f("ink")} fill-opacity=".7"/><rect x="6" y="60" width="28" height="5" rx="2.5" ${f("accent")}/></g>`,
  )
  .join("");
const thumbs = {
  store: frame("Online store product grid", cards),
  login: frame(
    "Login screen with logo, two input fields, a log-in button and a create-account button",
    `<rect y="22" width="320" height="178" ${f("bg")}/>
    <circle cx="160" cy="52" r="13" ${f("accent")}/><rect x="142" y="72" width="36" height="5" rx="2.5" ${f("mute")} fill-opacity=".6"/>
    <rect x="86" y="84" width="148" height="104" rx="10" ${f("surface")}/>
    <rect x="98" y="94" width="124" height="16" rx="5" ${f("line")}/><rect x="98" y="116" width="124" height="16" rx="5" ${f("line")}/>
    <rect x="98" y="138" width="124" height="16" rx="8" ${f("accent")}/><rect x="130" y="160" width="60" height="4" rx="2" ${f("mute")} fill-opacity=".6"/>
    <rect x="114" y="170" width="92" height="12" rx="6" ${f("accent2")} fill-opacity=".85"/>`,
  ),
};

const avatarFallback = `<svg viewBox="0 0 400 400" role="img" aria-label="Illustration of a developer workspace" class="block h-full w-full" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:rgb(var(--accent));stop-opacity:.9"/><stop offset="1" style="stop-color:rgb(var(--accent));stop-opacity:.35"/></linearGradient></defs>
  <rect width="400" height="400" ${f("bg")}/><circle cx="330" cy="70" r="120" fill="url(#g)"/><circle cx="40" cy="380" r="90" ${f("accent", 0.18)}/>
  <rect x="48" y="90" width="260" height="170" rx="12" ${f("surface")}/><rect x="48" y="90" width="260" height="26" rx="12" ${f("line")}/>
  <circle cx="68" cy="103" r="4" fill="#ef4444"/><circle cx="82" cy="103" r="4" fill="#f59e0b"/><circle cx="96" cy="103" r="4" fill="#10b981"/>
  ${[
    [70, 134, 70, "accent"],
    [150, 134, 90, "mute"],
    [86, 154, 110, "ink"],
    [86, 174, 60, "mute"],
    [156, 174, 80, "accent"],
    [86, 194, 94, "mute"],
    [70, 214, 40, "accent"],
    [120, 214, 100, "ink"],
  ]
    .map(
      ([x, y, w, c]) =>
        `<rect x="${x}" y="${y}" width="${w}" height="8" rx="4" ${f(c)} fill-opacity=".75"/>`,
    )
    .join("")}
  <circle cx="290" cy="290" r="62" ${f("surface")}/><circle cx="290" cy="290" r="62" style="fill:none;stroke:rgb(var(--accent));stroke-width:4"/>
  <text x="290" y="306" text-anchor="middle" font-family="Bricolage Grotesque, sans-serif" font-size="44" font-weight="800" ${f("ink")}>MS</text>
  <rect x="60" y="300" width="130" height="10" rx="5" ${f("line")}/><rect x="60" y="322" width="90" height="10" rx="5" ${f("line")} fill-opacity=".6"/></svg>`;

const aboutPlaceholder = `<svg viewBox="0 0 640 360" role="img" aria-label="Placeholder: add your photo at images/about.jpg" class="block h-full w-full" xmlns="http://www.w3.org/2000/svg">
  <rect width="640" height="360" ${f("bg")}/><rect x="2" y="2" width="636" height="356" rx="12" style="fill:none;stroke:rgb(var(--line));stroke-width:2;stroke-dasharray:8 8"/>
  <g transform="translate(272 96)"><rect width="96" height="76" rx="10" ${st("mute", 4)}/><circle cx="30" cy="26" r="9" ${st("mute", 4)}/><polyline points="6,66 36,38 54,54 70,40 90,62" ${st("accent", 4)}/></g>
  <text x="320" y="224" text-anchor="middle" font-family="Bricolage Grotesque, sans-serif" font-size="22" font-weight="700" ${f("ink")}>Your photo goes here</text>
  <text x="320" y="254" text-anchor="middle" font-family="IBM Plex Sans, sans-serif" font-size="15" ${f("mute")}>Save a 16:9 image as images/about.jpg</text></svg>`;
