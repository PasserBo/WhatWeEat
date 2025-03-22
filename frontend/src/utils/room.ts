const adjectives = [
  "Happy", "Lucky", "Cozy", "Fun", "Wild", "Cool", "Super", "Mega", "Ultra", "Epic",
  "Sweet", "Awesome", "Amazing", "Fancy", "Chill", "Fresh", "Smart", "Quick", "Swift", "Bright"
];

const nouns = [
  "Foodies", "Eaters", "Tasters", "Chefs", "Diners", "Feasters", "Gourmets", "Foodies", "Tasters", "Eaters",
  "Bites", "Tastes", "Flavors", "Cuisine", "Dishes", "Meals", "Plates", "Bowls", "Forks", "Spoons"
];

export function generateRoomName(): string {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adjective} ${noun}`;
} 