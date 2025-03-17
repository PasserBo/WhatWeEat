export function generateAvatar(): string {
  // You can use a library like dicebear for this
  // For now, let's use some basic emoji avatars
  const avatars = ["👨‍🍳", "👩‍🍳", "🧑‍🍳", "👨‍🌾", "👩‍🌾"];
  return avatars[Math.floor(Math.random() * avatars.length)];
} 