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
