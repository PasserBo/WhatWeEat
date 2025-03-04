import * as fs from "fs";
import { Restaurant } from "./types";

const dataPath = "../Data_Restaurants/all_restaurants.json";
export const restaurants: Restaurant[] = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
