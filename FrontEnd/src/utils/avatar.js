// ─── Netflix-Style Smileys & Foodie Sticker Avatar System ─────────────────────
// 100% Self-Contained Vector SVGs. Instant loading & zero external dependencies!

const makeNetflixSmile = (bgColor, expression = "smile", badge = "") => {
  let eyesAndMouth = "";

  if (expression === "googly") {
    eyesAndMouth = `
      <circle cx="32" cy="36" r="13" fill="#ffffff" />
      <circle cx="68" cy="36" r="13" fill="#ffffff" />
      <circle cx="35" cy="38" r="6" fill="#0f172a" />
      <circle cx="71" cy="38" r="6" fill="#0f172a" />
      <path d="M 28 62 Q 50 84 72 62" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" />
    `;
  } else if (expression === "sunglasses") {
    eyesAndMouth = `
      <path d="M 18 30 H 82 V 42 C 82 48 74 52 64 52 C 54 52 48 46 48 42 H 52 C 52 46 46 52 36 52 C 26 52 18 48 18 42 Z" fill="#0f172a" />
      <path d="M 22 34 H 44 V 42 C 44 48 38 48 33 48 C 28 48 22 46 22 42 Z" fill="#1e293b" />
      <path d="M 56 34 H 78 V 42 C 78 46 72 48 67 48 C 62 48 56 48 56 42 Z" fill="#1e293b" />
      <line x1="25" y1="36" x2="35" y2="44" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.8" />
      <line x1="59" y1="36" x2="69" y2="44" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.8" />
      <path d="M 32 68 Q 52 82 70 65" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" />
    `;
  } else if (expression === "open_mouth") {
    eyesAndMouth = `
      <circle cx="30" cy="36" r="7" fill="#ffffff" />
      <circle cx="70" cy="36" r="7" fill="#ffffff" />
      <path d="M 28 56 Q 50 82 72 56 Z" fill="#ffffff" />
      <path d="M 38 68 Q 50 78 62 68 Z" fill="#ef4444" />
    `;
  } else if (expression === "wink") {
    eyesAndMouth = `
      <circle cx="30" cy="36" r="7" fill="#ffffff" />
      <path d="M 62 36 Q 70 30 78 36" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" />
      <path d="M 28 60 Q 50 80 72 60" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" />
    `;
  } else if (expression === "chef") {
    eyesAndMouth = `
      <path d="M 32 24 C 26 24 22 18 28 12 C 32 6 44 6 50 12 C 56 6 68 6 72 12 C 78 18 74 24 68 24 Z" fill="#ffffff" />
      <rect x="32" y="20" width="36" height="6" rx="2" fill="#ffffff" />
      <circle cx="34" cy="42" r="6" fill="#ffffff" />
      <circle cx="66" cy="42" r="6" fill="#ffffff" />
      <path d="M 30 62 Q 50 82 70 62" fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" />
    `;
  } else {
    // Standard Netflix Smile
    eyesAndMouth = `
      <circle cx="30" cy="38" r="7" fill="#ffffff" />
      <circle cx="70" cy="38" r="7" fill="#ffffff" />
      <path d="M 28 60 Q 50 82 72 60" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" />
    `;
  }

  const badgeElement = badge
    ? `<text x="80" y="24" font-size="20" text-anchor="middle">${badge}</text>`
    : "";

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 100 100">
    <rect width="100" height="100" rx="22" fill="${bgColor}" />
    ${eyesAndMouth}
    ${badgeElement}
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const STICKER_AVATARS = [
  // Netflix-Style Colorful Smiles
  { id: "nfx_blue", name: "Netflix Blue", color: "Blue", url: makeNetflixSmile("#1e88e5") },
  { id: "nfx_yellow", name: "Sunny Yellow", color: "Yellow", url: makeNetflixSmile("#f59e0b") },
  { id: "nfx_orange", name: "Vibrant Orange", color: "Orange", url: makeNetflixSmile("#ff6b00") },
  { id: "nfx_teal", name: "Teal Smile", color: "Teal", url: makeNetflixSmile("#06b6d4") },
  { id: "nfx_green", name: "Emerald Green", color: "Green", url: makeNetflixSmile("#10b981") },
  { id: "nfx_purple", name: "Royal Purple", color: "Purple", url: makeNetflixSmile("#8b5cf6") },
  { id: "nfx_red", name: "Ruby Red", color: "Red", url: makeNetflixSmile("#ef4444") },
  { id: "nfx_pink", name: "Hot Pink", color: "Pink", url: makeNetflixSmile("#ec4899") },

  // Special Expressions
  { id: "nfx_googly", name: "Googly Eyes Sky", color: "Sky Blue", url: makeNetflixSmile("#38bdf8", "googly") },
  { id: "nfx_swag", name: "Cool Sunglasses", color: "Royal Blue", url: makeNetflixSmile("#3b82f6", "sunglasses") },
  { id: "nfx_wink", name: "Wink Smile", color: "Turquoise", url: makeNetflixSmile("#14b8a6", "wink") },
  { id: "nfx_yum", name: "Yum Foodie", color: "Amber", url: makeNetflixSmile("#f59e0b", "open_mouth") },

  // Foodie & Chef Themes
  { id: "nfx_chef", name: "Master Chef", color: "Flame Orange", url: makeNetflixSmile("#ff6b00", "chef", "👨‍🍳") },
  { id: "nfx_pizza", name: "Pizza Lover", color: "Red", url: makeNetflixSmile("#dc2626", "open_mouth", "🍕") },
  { id: "nfx_burger", name: "Burger King", color: "Orange", url: makeNetflixSmile("#ea580c", "sunglasses", "🍔") },
  { id: "nfx_donut", name: "Donut Queen", color: "Pink", url: makeNetflixSmile("#d946ef", "wink", "🍩") },
];

export const getCartoonAvatar = (user) => {
  if (!user) {
    return STICKER_AVATARS[0].url;
  }
  if (user.role === "admin") {
    return STICKER_AVATARS[12].url; // Master Chef for Admin
  }
  if (user.avatarUrl && typeof user.avatarUrl === "string" && user.avatarUrl.length > 5) {
    return user.avatarUrl;
  }

  return STICKER_AVATARS[0].url;
};
