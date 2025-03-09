import { Box, Button, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";
// import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { Restaurant, RoomState, VoteResult } from "./types";
import socket from "./socket";

const Room: React.FC = () => {
    const {roomId} = useParams<{roomId: string}>();
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [score, setScore] = useState<number>(5);
    const [results, setResults] = useState<VoteResult | null>(null);
    const [isOwner, setIsOwner] = useState(false);
    const [roomState, setRoomState] = useState<RoomState | null>(null);
    // const [submittedVotes, setSubmittedVotes] = useState<number>(0);
    const [voteSubmitted, setVoteSubmitted] = useState<boolean>(false);

    useEffect(() => {
        console.log(`Joining room ${roomId} with socket ID:`, socket.id);
        socket.emit("joinRoom", { roomId });

        socket.on("newRestaurant", (restaurantData: Restaurant) => {
            console.log("Received restaurant data:", restaurantData);
            setRestaurant(restaurantData);
            setRoomState(prevState => prevState ? { ...prevState, submittedVotes: 0 } : null);
            setVoteSubmitted(false); // Reset vote state for new restaurant
        });

        socket.on("results", (finalResults: VoteResult) => {
            console.log("最终结果:", finalResults);
            setResults(finalResults);
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

    const handleVote = () => {
        if (restaurant) {
            socket.emit("vote", roomId, restaurant.id, score);  // Fixed vote emit parameters
            setVoteSubmitted(true);
            setRoomState(prevState => prevState ? { ...prevState, submittedVotes: prevState.submittedVotes + 1 } : null);
        }
    };

    const handleRestart = () => {
        socket.emit("restart", roomId);
    };

    return (
        <Box textAlign="center" p={4} maxW="600px" mx="auto">
        {results ? (
            <Box>
                <Text fontSize="2xl" fontWeight="bold" mb={4}>🍽️ 最终结果</Text>
                {results.map((r) => (
                    <Box key={r.id} p={3} border="1px solid #ccc" borderRadius="md" mb={2}>
                        {r.image_url && (
                            <Image
                                src={r.image_url}
                                alt={r.name}
                                borderRadius="md"
                                objectFit="cover"
                                w="100%"
                                maxH="200px"
                                mb={2}
                            />
                        )}
                        <Text fontSize="xl" fontWeight="bold">{r.name}</Text>
                        <Text>类别: {r.categories.join(", ")}</Text>
                        <Text>评分: {r.rating} 🌟 ({r.review_count} 条评论)</Text>
                        <Text>用户评分: {r.averageScore} / 10</Text>
                        <a href={r.yelp_url} target="_blank" rel="noopener noreferrer">查看 Yelp</a>
                    </Box>
                ))}
                <Button colorScheme="red" mt={4} onClick={handleRestart}>🔄 我不服！再来一轮</Button>
            </Box>
        ) : restaurant ? (
            <Box>
                {restaurant.image_url && (
                    <Image
                        src={restaurant.image_url}
                        alt={restaurant.name}
                        borderRadius="md"
                        objectFit="cover"
                        w="100%"
                        maxH="200px"
                        mb={2}
                    />
                )}
                <Text fontSize="2xl" fontWeight="bold">🍽️ {restaurant.name}</Text>
                <Text>{restaurant.categories.join(", ")}</Text>
                <Text>评分: {restaurant.rating} 🌟 | {restaurant.review_count} 条评论</Text>
                <a href={restaurant.yelp_url} target="_blank" rel="noopener noreferrer">查看 Yelp</a>

                <Slider defaultValue={5} min={1} max={10} step={1} onChange={setScore} isDisabled={voteSubmitted}>
                    <SliderTrack><SliderFilledTrack /></SliderTrack>
                    <SliderThumb />
                </Slider>

                <Button
                    colorScheme="blue"
                    mt={4}
                    onClick={handleVote}
                    isDisabled={voteSubmitted} >
                    {voteSubmitted ? "✅ 已提交" : "提交评分"}
                </Button>

                <Text fontSize="sm" mt={2} color="gray.500">
                    {roomState?.submittedVotes} / {roomState?.players.length} 人已提交
                </Text>
            </Box>
        ) : isOwner ? (
                <Button onClick={startVoting} colorScheme="blue">
                    开始投票
                </Button>
        ) :(
            <Text>⏳ 正在加载餐厅数据...</Text>
        )}
        </Box>
    );
};

export default Room;
