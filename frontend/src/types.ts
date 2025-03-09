export interface Restaurant {
    id: string;
    name: string;
    categories: string[];
    price_range: string;
    rating: number;
    review_count: number;
    image_url: string;
    yelp_url: string;
    averageScore?: string;
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
    currentRestaurantIndex: number;
    restaurants: Restaurant[];
    submittedVotes: number;
    status: 'waiting' | 'voting' | 'finished';
}

// Interface to store the final results of the voting process
export type VoteResult = (Restaurant & { averageScore: number })[];
