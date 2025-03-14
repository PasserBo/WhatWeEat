export interface Restaurant {
    id: string;
    name: string;
    categories: string[];
    price_range: string;
    rating: number;
    review_count: number;
    image_url: string;
    yelp_url: string;
    phone: string;
    website: string;
    address: string;
}

export interface Vote {
    id: string;
    score: number;
}
// Interface to track room ownerships, participants, and status
export interface RoomState {
    roomId: string;
    owner: string;
    players: string[];
    status: "waiting" | "voting" | "finished";
    currentRestaurantIndex: number;
    restaurants: Restaurant[];
    submittedVotes?: number;
}

// Interface to store the final results of the voting process
export type VoteResult = (Restaurant & { averageScore: number })[];
