import { Button } from "@/components/ui/button";

interface BinaryVotingProps {
  onVote: (score: number) => void;
  disabled: boolean;
}

export const BinaryVoting: React.FC<BinaryVotingProps> = ({ 
  onVote, 
  disabled 
}) => {
  return (
    <div className="flex gap-4 justify-center">
      <Button
        onClick={() => onVote(0)}
        disabled={disabled}
        variant="outline"
      >
        👎 Dislike
      </Button>
      <Button
        onClick={() => onVote(10)}
        disabled={disabled}
      >
        👍 Like
      </Button>
    </div>
  );
}; 