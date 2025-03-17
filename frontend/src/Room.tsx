import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import { RestaurantCard } from "./components/RestaurantCard";
import { RoomState, Restaurant, VoteResult } from "./types";
import socket from "@/lib/socket";

const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [roomState, setRoomState] = useState<RoomState | null>(null);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [results, setResults] = useState<Restaurant[] | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [voteCount, setVoteCount] = useState(0);
  const [score, setScore] = useState(5);
  // const [error, setError] = useState<string | null>(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [currentRestaurant, setCurrentRestaurant] = useState<Restaurant | null>(null);
  
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

const handleVote = () => {
    if (currentRestaurant) {
        socket.emit("vote", roomId, currentRestaurant.id, score);
        setRoomState(prevState => prevState ? { ...prevState, submittedVotes: prevState.submittedVotes + 1 } : null);
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
            onVote={handleVote}
            isVoted={voteSubmitted}
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