import { EmojiData } from "@/types";

// Predefined food emojis with labels for accessibility
export const FOOD_EMOJIS: EmojiData[] = [
  { emoji: "🍕", label: "pizza" },
  { emoji: "🍔", label: "hamburger" },
  { emoji: "🍜", label: "noodles" },
  { emoji: "🍣", label: "sushi" },
  { emoji: "🌮", label: "taco" },
  { emoji: "🥗", label: "salad" },
  { emoji: "🍖", label: "meat" },
  { emoji: "🍱", label: "bento" },
  { emoji: "🥪", label: "sandwich" },
  { emoji: "🍲", label: "hot pot" },
  // Add more food emojis as needed
];

export function generateEmojiPassword(): string[] {
  const password: string[] = [];
  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * FOOD_EMOJIS.length);
    password.push(FOOD_EMOJIS[randomIndex].emoji);
  }
  return password;
}

export function generateAvatar(): string {
  // You can use a library like dicebear for this
  // For now, let's use some basic emoji avatars
  const avatars = ["👨‍🍳", "👩‍🍳", "🧑‍🍳", "👨‍🌾", "👩‍🌾"];
  return avatars[Math.floor(Math.random() * avatars.length)];
} 