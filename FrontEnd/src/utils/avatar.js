// ─── Avatar Presets (Young 22-25 Age Group) ──────────────────────────────────
// DiceBear API v9 — 3 Boys & 3 Girls (Young 22-25 age only, clean & cool black glasses)
// 1. Young 22-25 Cute Great Smile
// 2. Young 22-25 Hero / Heroine with Cool Black Glasses
// 3. Young 22-25 Yo-Yo Swag Look

export const MALE_AVATARS = [
  // 1. Young 22-25 Boy with Cute Great Smile
  "https://api.dicebear.com/9.x/avataaars/svg?seed=YoungSamSmile&backgroundColor=b6e3f4&eyes=happy&mouth=smile&facialHairProbability=0",
  // 2. Young 22-25 Hero with Cool Black Glasses
  "https://api.dicebear.com/9.x/avataaars/svg?seed=YoungHeroBlackGlasses&backgroundColor=c0aede&accessories=sunglasses&accessoriesProbability=100&facialHairProbability=0",
  // 3. Young 22-25 Cool Yo-Yo Swag Hero
  "https://api.dicebear.com/9.x/avataaars/svg?seed=YoungYoYoHero&backgroundColor=ffecd2&accessories=sunglasses&accessoriesProbability=100&top=hat&facialHairProbability=0",
];

export const FEMALE_AVATARS = [
  // 1. Young 22-25 Girl with Cute Great Smile
  "https://api.dicebear.com/9.x/avataaars/svg?seed=YoungTaraSmile&backgroundColor=ffcce7&eyes=happy&mouth=smile",
  // 2. Young 22-25 Heroine with Cool Black Glasses
  "https://api.dicebear.com/9.x/avataaars/svg?seed=YoungHeroineBlackGlasses&backgroundColor=ffe4e6&accessories=sunglasses&accessoriesProbability=100",
  // 3. Young 22-25 Cool Yo-Yo Swag Heroine
  "https://api.dicebear.com/9.x/avataaars/svg?seed=YoungYoYoHeroine&backgroundColor=f0e6ff&accessories=sunglasses&accessoriesProbability=100",
];

// ─── Runtime Avatar Generator ─────────────────────────────────────────────────
export const getCartoonAvatar = (user) => {
  if (!user) {
    return "https://api.dicebear.com/9.x/avataaars/svg?seed=YoungSamSmile&backgroundColor=b6e3f4&eyes=happy&mouth=smile&facialHairProbability=0";
  }
  if (user.role === "admin") {
    return "https://api.dicebear.com/9.x/avataaars/svg?seed=YoungAdminHero&backgroundColor=ffd5dc&accessories=sunglasses&accessoriesProbability=100";
  }
  if (user.avatarUrl) {
    return user.avatarUrl;
  }

  const isFemale = user.gender === "female";

  if (isFemale) {
    return "https://api.dicebear.com/9.x/avataaars/svg?seed=YoungTaraSmile&backgroundColor=ffcce7&eyes=happy&mouth=smile";
  }
  return "https://api.dicebear.com/9.x/avataaars/svg?seed=YoungSamSmile&backgroundColor=b6e3f4&eyes=happy&mouth=smile&facialHairProbability=0";
};
