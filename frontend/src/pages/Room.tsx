import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RestaurantCard } from "@/components/RestaurantCard";
import { RoomState, Restaurant, VoteResult } from "@/types";
import socket from "@/lib/socket";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ScoreVoting } from "@/components/VotingButtons/ScoreVoting";
import { BinaryVoting } from "@/components/VotingButtons/BinaryVoting";

const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [results, setResults] = useState<Restaurant[] | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [score, setScore] = useState(5);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    console.log(`Joining room ${roomId} with ID: ${socket.id}`);
    socket.emit("joinRoom", { roomId});

    socket.on("newRestaurant", (restaurantData: Restaurant)=>{
        console.log("Received new restaurant:", restaurantData);
        setCurrentRestaurant(restaurantData);
        setVoteCount(0);
        setVoteSubmitted(false);
    });

    socket.on("voteUpdate", (votes: number)=>{
        console.log("Received vote update:", votes);
        setRoomState(prevState => prevState ? { ...prevState, submittedVotes: votes } : null);
    });

    socket.on("status", (status: string) => {
        console.log("Received status:", status);
        setRoomState(prevState => prevState ? { ...prevState, status: status as "waiting" | "voting" | "finished" } : null);
    });

    socket.on("results", (finalResults: VoteResult) => {
            console.log("Final results:", finalResults);
            setResults(finalResults);
    });

    socket.on("roomUpdate", (room: RoomState) => {
        console.log("Received room update:", room);
        setIsOwner(room.owner === socket.id);
        setRoomState(room);
    });

    return () => {
        console.log(`Leaving room ${roomId}`);
        socket.off("roomUpdate");
        socket.off("newRestaurant");
        socket.off("voteUpdate");
        socket.off("results");
    };
  }, [roomId]);

const startVoting = () => {
    if (!roomId) {
        console.error("Room ID is undefined");
        return;
    }
    console.log(`Starting voting for room ${roomId}`);
    socket.emit("startVoting", roomId);
    };

const handleVoteSubmit = (newScore: number) => {
    setScore(newScore);
    if (currentRestaurant) {
      socket.emit("vote", roomId, currentRestaurant.id, newScore);
      setRoomState(prevState => 
        prevState ? { ...prevState, submittedVotes: prevState.submittedVotes + 1 } : null
      );
      setVoteSubmitted(true);
    }
  };

const handleRestart = () => {
    if(results){
        socket.emit("restart", roomId);
        setResults(null);
        setVoteCount(0);
        setVoteSubmitted(false);
    }
  };

const renderVotingComponent = () => {
    if (!roomState?.votingType) return null;
    
    if (roomState.votingType === "score") {
      return (
        <ScoreVoting
          onVote={handleVoteSubmit}
          disabled={voteSubmitted}
          currentScore={score}
        />
      );
    }
    return (
      <BinaryVoting
        onVote={handleVoteSubmit}
        disabled={voteSubmitted}
      />
    );
  };

  return (
    <div className="container py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Room: {roomId}</h1>
          <p className="text-muted-foreground">
            Players: {roomState?.players.length} / {roomState?.maxPlayers}
          </p>
        </div>
        <Button onClick={() => navigate("/")}>Leave Room</Button>
      </div>

      {/* Add new section for room sharing */}
      <Card className="p-6">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Share Room</h2>
          
          {/* Emoji Password Display */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Room Password:</p>
            <div className="flex items-center gap-4">
              <div className="flex gap-2">
                {roomState?.emojiPassword?.map((emoji, index) => (
                  <div key={index} className="w-12 h-12 border rounded flex items-center justify-center text-2xl">
                    {emoji}
                  </div>
                ))}
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  navigator.clipboard.writeText(roomState?.emojiPassword?.join('') || '');
                  toast({
                    title: "Copied!",
                    description: "Emoji password has been copied to clipboard",
                    duration: 2000,
                  });
                }}
              >
                Copy Emojis
              </Button>
            </div>
          </div>

          {/* Room Link Sharing */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">Share Link:</p>
            <div className="flex items-center gap-4">
              <div className="flex-1 p-2 bg-muted rounded text-sm">
                {window.location.origin}/room/{roomId}
              </div>
              <Button 
                variant="outline"
                onClick={() => {
                  const shareLink = `${window.location.origin}/room/${roomId}`;
                  navigator.clipboard.writeText(shareLink);
                  toast({
                    title: "Copied!",
                    description: "Room link has been copied to clipboard",
                    duration: 2000,
                  });
                }}
              >
                Copy Link
              </Button>
            </div>
          </div>

          {/* Share button for mobile */}
          {navigator.share && (
            <Button 
              className="w-full"
              onClick={() => {
                const shareText = `Join my room in Restaurant Voting!\n\nRoom ID: ${roomId}\nPassword: ${roomState?.emojiPassword?.join(' ')}\n\n${window.location.origin}/join/${roomId}`;
                navigator.share({
                  title: 'Join My Restaurant Voting Room',
                  text: shareText,
                });
              }}
            >
              Share Room
            </Button>
          )}
        </div>
      </Card>

      {roomState?.status === "waiting" && (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="text-xl">Waiting for players...</div>
          <div className="text-sm text-muted-foreground">
            Share this room ID with your friends: {roomId}
          </div>
          <div className="text-sm">
            Current players: {roomState?.players.length} / {roomState?.maxPlayers}
          </div>
          {isOwner ? (
            <Button 
              onClick={startVoting} 
              disabled={roomState?.players.length < 2}
            >
              {roomState?.players.length < 2 
                ? "Waiting for more players..." 
                : "Start Voting"}
            </Button>
          ) : (
            <div className="text-sm text-muted-foreground">
              Waiting for the owner to start...
            </div>
          )}
        </div>
      )}

      {roomState?.status === "voting" && currentRestaurant && (
        <div className="flex flex-col items-center gap-4">
          <RestaurantCard
            restaurant={currentRestaurant}
            showVoting={true}
            VotingComponent={renderVotingComponent()}
          />
          <p className="text-sm text-muted-foreground">
            Votes: {roomState?.submittedVotes} / {roomState?.players.length}
          </p>
        </div>
      )}

      {roomState?.status === "finished" && results && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Results</h2>
            <Button onClick={handleRestart}>我不服！ 再来一轮!</Button>
          </div>
          <div className="grid gap-6">
            {results.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                score={roomState?.players.length}
                showVoting={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Room; 