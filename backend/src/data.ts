import * as fs from "fs";
import { Restaurant,EmojiData } from "./types";

const dataPath = "../Data_Restaurants/all_restaurants.json";
const emojiPath = "../Data_Restaurants/emoji.json";
export const restaurants: Restaurant[] = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
export const emojiData: EmojiData[] = JSON.parse(fs.readFileSync(emojiPath, "utf-8"));
