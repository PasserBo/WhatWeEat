import { Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Restaurant, RoomState, VoteResult } from "./types";
import socket from "./socket";
import { RestaurantCard } from "./components/RestaurantCard";
import { Button } from "./components/ui/button";

const Room: React.FC = () => {
    const {roomId} = useParams<{roomId: string}>();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [results, setResults] = useState<VoteResult | null>(null);
    const [isOwner, setIsOwner] = useState(false);
    const [roomState, setRoomState] = useState<RoomState | null>(null);
    const [voteSubmitted, setVoteSubmitted] = useState<boolean>(false);

    useEffect(() => {
        console.log(`Joining room ${roomId} with socket ID:`, socket.id);
        socket.emit("joinRoom", { roomId });

        socket.on("newRestaurant", (restaurantData: Restaurant) => {
            console.log("Received restaurant data:", restaurantData);
            setRestaurant(restaurantData);
            setVoteSubmitted(false);
        });

        socket.on("voteUpdate", (votes: number) => {
            console.log("Received vote update:", votes);
            setRoomState(prevState => prevState ? { ...prevState, submittedVotes: votes } : null);
        });

        socket.on("results", (finalResults: VoteResult) => {
            console.log("最终结果:", finalResults);
            setResults(finalResults);
            setVoteSubmitted(false);
        });

        socket.on("roomUpdate", (room: RoomState) => {
            console.log("Received room update:", room);
            setIsOwner(room.owner === socket.id);
            setRoomState(room);
        });

        return () => {
            console.log(`Leaving room ${roomId}`);
            socket.off("newRestaurant");
            socket.off("results");
            socket.off("roomUpdate");
            socket.off("voteUpdate");
        };
    }, [roomId]);

    const startVoting = () => {
        console.log(`Starting voting for room ${roomId}`);
        socket.emit("startVoting", roomId);
    };

    const handleVote = (score: number) => {
        if (restaurant) {
            socket.emit("vote", roomId, restaurant.id, score);
            setVoteSubmitted(true);
        }
    };

    const handleRestart = () => {
        if(results){
            socket.emit("restart", roomId);
            setVoteSubmitted(true);
        }
    };

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {results ? (
                    <div className="space-y-8">
                        <h1 className="text-3xl font-bold text-center">🍽️ 最终结果</h1>
                        <div className="space-y-6">
                            {results.map((r) => (
                                <RestaurantCard
                                    key={r.id}
                                    restaurant={r}
                                    score={r.averageScore}
                                    showVoting={false}
                                />
                            ))}
                        </div>
                        <div className="text-center space-y-4">
                            <Button
                                onClick={handleRestart}
                                disabled={voteSubmitted}
                                variant={voteSubmitted ? "outline" : "default"}
                                size="lg"
                            >
                                {voteSubmitted ? "🔄 再来一轮" : "🔄 我不服！"}
                            </Button>
                            <p className="text-sm text-muted-foreground">
                                {roomState?.submittedVotes} / {roomState?.players.length} 人觉得不服！
                            </p>
                        </div>
                    </div>
                ) : restaurant ? (
                    <div className="space-y-8">
                        <RestaurantCard
                            restaurant={restaurant}
                            onVote={handleVote}
                            isVoted={voteSubmitted}
                        />
                        <p className="text-center text-sm text-muted-foreground">
                            {roomState?.submittedVotes} / {roomState?.players.length} 人已提交
                        </p>
                    </div>
                ) : isOwner ? (
                    <div className="text-center">
                        <Button onClick={startVoting} size="lg">
                            开始投票
                        </Button>
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground">⏳ 正在等待房主开始...</p>
                )}
            </div>
        </div>
    );
};

export default Room;
