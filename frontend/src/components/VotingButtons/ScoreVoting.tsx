import { Button } from "@/components/ui/button";

interface ScoreVotingProps {
  onVote: (score: number) => void;
  disabled: boolean;
  currentScore: number;
}

export const ScoreVoting: React.FC<ScoreVotingProps> = ({ 
  onVote, 
  disabled, 
  currentScore 
}) => {
  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex flex-wrap gap-2 justify-center">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
          <Button
            key={value}
            variant={currentScore === value ? "default" : "outline"}
            onClick={() => onVote(value)}
            disabled={disabled}
            className="w-10 h-10"
          >
            {value}
          </Button>
        ))}
      </div>
    </div>
  );
}; 