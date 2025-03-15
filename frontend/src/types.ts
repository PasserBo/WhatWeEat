export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  review_count: number;
  price_range: string;
  categories: string[];
  image_url: string;
  url: string;
  yelp_url: string;
  averageScore?: string;
}

export interface Vote {
  id: string;
  score: number;
}

export interface RoomState {
  roomId: string;
  owner: string;
  maxPlayers: number;
  players: string[];
  restaurants: Restaurant[];
  currentRestaurantIndex: number;
  status: "waiting" | "voting" | "finished";
  submittedVotes: number;
} 

// Interface to store the final results of the voting process
export type VoteResult = (Restaurant & { averageScore: number })[];
