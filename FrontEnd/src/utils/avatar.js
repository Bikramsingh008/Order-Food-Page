// ─── Avatar Presets ──────────────────────────────────────────────────────────
// DiceBear API v9 — Cool, confident, sunglasses-wearing characters

// Cool male avatars — confident, glasses-wearing, stylish youth (no sad/baby/old)
export const MALE_AVATARS = [
  // 1. Stylish dude with glasses — lorelei style
  "https://api.dicebear.com/9.x/lorelei/svg?seed=CoolArjun&backgroundColor=b6e3f4&glasses=true",
  // 2. Trendy adventurer with shades
  "https://api.dicebear.com/9.x/adventurer/svg?seed=SwagVikas&backgroundColor=c0aede&accessories=glasses&eyes=happy",
  // 3. Micah with glasses & big smile
  "https://api.dicebear.com/9.x/micah/svg?seed=FreshKaran&backgroundColor=d1f4e0&glasses=round",
  // 4. Fun avataaars with sunglasses
  "https://api.dicebear.com/9.x/avataaars/svg?seed=CoolRohan&backgroundColor=b6e3f4&accessories=prescription02&eyes=happy&mouth=smile",
  // 5. Funky personas style cool guy
  "https://api.dicebear.com/9.x/personas/svg?seed=SwagRahul&backgroundColor=ffecd2",
  // 6. Adventurer smiling cool youth
  "https://api.dicebear.com/9.x/adventurer/svg?seed=HappyManav&backgroundColor=ffe4b5&eyes=happy",
];

// Cool female avatars — confident, stylish, big smiles (no sad/baby/old)
export const FEMALE_AVATARS = [
  // 1. Stylish girl with shades — funky lorelei
  "https://api.dicebear.com/9.x/lorelei/svg?seed=CoolPriya&backgroundColor=ffcce7",
  // 2. Confident smiley adventurer girl
  "https://api.dicebear.com/9.x/adventurer/svg?seed=FreshAnanya&backgroundColor=b6e3f4&eyes=happy",
  // 3. Micah cool girl with glasses
  "https://api.dicebear.com/9.x/micah/svg?seed=SwagDivya&backgroundColor=ffe4e6&glasses=round",
  // 4. Avataaars stylish young woman with smile
  "https://api.dicebear.com/9.x/avataaars/svg?seed=CoolRiya&backgroundColor=b6e3f4&accessories=prescription01&eyes=happy&mouth=smile",
  // 5. Cool bun style adventurer girl
  "https://api.dicebear.com/9.x/adventurer/svg?seed=FunSneha&backgroundColor=d9f0ff",
  // 6. Bold personas girl
  "https://api.dicebear.com/9.x/personas/svg?seed=BoldKavya&backgroundColor=f0e6ff",
];

// ─── Runtime Avatar Generator ─────────────────────────────────────────────────
export const getCartoonAvatar = (user) => {
  if (!user) return "https://api.dicebear.com/9.x/adventurer/svg?seed=CoolGuest&backgroundColor=b6e3f4&eyes=happy";
  // Admin gets a super cool boss avatar with sunglasses vibe
  if (user.role === "admin") return "https://api.dicebear.com/9.x/adventurer/svg?seed=BossAdmin&backgroundColor=ffd5dc&eyes=happy";
  if (user.avatarUrl) return user.avatarUrl;

  const isFemale = user.gender === "female";
  const seed = encodeURIComponent("Cool" + (user.name || (isFemale ? "Girl" : "Guy")));

  if (isFemale) {
    // Cool female — lorelei style (smiling, confident)
    return `https://api.dicebear.com/9.x/lorelei/svg?seed=${seed}&backgroundColor=ffcce7`;
  }
  // Cool male — adventurer with happy eyes
  return `https://api.dicebear.com/9.x/adventurer/svg?seed=${seed}&backgroundColor=b6e3f4&eyes=happy`;
};
