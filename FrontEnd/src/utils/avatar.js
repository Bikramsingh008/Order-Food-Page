export const MALE_AVATARS = [
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Bikram",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&skinColor=f8d25c",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Oliver",
  "https://api.dicebear.com/7.x/bottts/svg?seed=CoolBoy",
];

export const FEMALE_AVATARS = [
  "https://api.dicebear.com/7.x/lorelei/svg?seed=Sophia",
  "https://api.dicebear.com/7.x/adventurer/svg?seed=Emma",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
  "https://api.dicebear.com/7.x/notionists/svg?seed=Chloe",
];

export const getCartoonAvatar = (user) => {
  if (!user) return "https://api.dicebear.com/7.x/adventurer/svg?seed=Guest";
  if (user.role === "admin") return "https://api.dicebear.com/7.x/bottts/svg?seed=Admin";
  if (user.avatarUrl) return user.avatarUrl;

  const isFemale = user.gender === "female";
  const seed = encodeURIComponent(user.name || (isFemale ? "Girl" : "Boy"));

  if (isFemale) {
    return `https://api.dicebear.com/7.x/lorelei/svg?seed=${seed}`;
  }
  return `https://api.dicebear.com/7.x/adventurer/svg?seed=${seed}`;
};
