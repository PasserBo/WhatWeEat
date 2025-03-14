import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Restaurant } from '../types';
import { Star, MapPin, Phone, Globe, ExternalLink } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onVote?: (score: number) => void;
  score?: number;
  isVoted?: boolean;
  showVoting?: boolean;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onVote,
  score,
  isVoted = false,
  showVoting = true,
}) => {
  const [hoverScore, setHoverScore] = React.useState<number | null>(null);
  const currentScore = hoverScore ?? score ?? 5;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      {restaurant.image_url && (
        <div className="relative w-full h-48 overflow-hidden rounded-t-xl">
          <img
            src={restaurant.image_url}
            alt={restaurant.name}
            className="object-cover w-full h-full"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-2xl">{restaurant.name}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <span className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400" />
            <span className="ml-1">{restaurant.rating}</span>
          </span>
          <span>•</span>
          <span>{restaurant.review_count} reviews</span>
          <span>•</span>
          <span>{restaurant.price_range || 'N/A'}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {restaurant.categories.join(", ")}
          </p>
          {restaurant.phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4" />
              <a href={`tel:${restaurant.phone}`} className="hover:underline">
                {restaurant.phone}
              </a>
            </div>
          )}
          {restaurant.website && restaurant.website !== 'N/A' && (
            <div className="flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4" />
              <a
                href={restaurant.website}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                Visit Website
              </a>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <a
          href={restaurant.yelp_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          View on Yelp
          <ExternalLink className="w-4 h-4" />
        </a>
        {showVoting && (
          <div className="flex items-center gap-2">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
              <Button
                key={value}
                variant={value <= currentScore ? "default" : "outline"}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => onVote?.(value)}
                onMouseEnter={() => setHoverScore(value)}
                onMouseLeave={() => setHoverScore(null)}
                disabled={isVoted}
              >
                {value}
              </Button>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}; 