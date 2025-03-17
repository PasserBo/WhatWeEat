export interface Restaurant {
    id: string;
    name: string;
    categories: string[];
    price_range: string;
    rating: number;
    review_count: number;
    image_url: string;
    yelp_url: string;
}

export interface RoomState {
    roomId: string;
    owner: string;
    players: string[];
    currentRestaurantIndex: number;
    restaurants: Restaurant[];
    emojiPassword: string[];
    emojiOptions: string[][];
    submittedVotes: number;
    status: 'waiting' | 'voting' | 'finished';
}

export interface EmojiData {
    emoji: string;
    label: string;
}


export type VoteResult = Record<string, number[]>;

export interface Vote {
    id: string;
    score: number;
}
