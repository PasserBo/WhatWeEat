import { Restaurant } from "@/types";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ThumbsDown, ThumbsUp, ExternalLink } from "lucide-react";

interface RestaurantCardProps {
  restaurant: Restaurant;
  showVoting?: boolean;
  score?: number;
  VotingComponent?: React.ReactNode;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  showVoting = true,
  score,
  VotingComponent
}) => {
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
          {showVoting && VotingComponent}

        </div>
      </CardContent>
    </Card>
  );
} 