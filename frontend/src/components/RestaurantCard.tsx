import { Restaurant } from "@/types";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ThumbsDown, ThumbsUp, ExternalLink } from "lucide-react";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onVote?: (vote: boolean) => void;
  score?: number;
  isVoted?: boolean;
  showVoting?: boolean;
}

export function RestaurantCard({
  restaurant,
  onVote,
  score,
  isVoted,
  showVoting = true,
}: RestaurantCardProps) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row gap-4">
        <img
          src={restaurant.image_url}
          alt={restaurant.name}
          className="w-24 h-24 object-cover rounded-md"
        />
        <div className="flex-1">
          <CardTitle className="text-xl">{restaurant.name}</CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <div className="text-sm">
              ⭐ {restaurant.rating} ({restaurant.review_count} reviews)
            </div>
            <div className="text-sm">{restaurant.price_range}</div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {restaurant.categories.map((category) => (
              <span
                key={category}
                className="bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs"
              >
                {category}
              </span>
            ))}
          </div>
          {restaurant.averageScore && (
            <div className="mt-2 text-lg font-semibold text-primary">
              Score: {restaurant.averageScore}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <a
              href={restaurant.yelp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="w-4 h-4" />
              View on Yelp
            </a>
          </div>
          {showVoting && onVote && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <Button
                variant={isVoted === false ? "destructive" : "outline"}
                size="lg"
                onClick={() => onVote(false)}
                disabled={isVoted}
              >
                <ThumbsDown className="w-5 h-5" />
              </Button>
              {score !== undefined && (
                <div className="text-2xl font-bold">{score}</div>
              )}
              <Button
                variant={isVoted === true ? "default" : "outline"}
                size="lg"
                onClick={() => onVote(true)}
                disabled={isVoted}
              >
                <ThumbsUp className="w-5 h-5" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 