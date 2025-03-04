export interface Restaurant {
    id: string;
    name: string;
    categories: string[];
    price_range: string;
    rating: number;
    review_count: number;
    yelp_url: string;
}

export interface Vote {
    id: string;
    score: number;
}
