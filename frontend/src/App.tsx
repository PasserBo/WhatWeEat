import { Box, Button, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb, Progress } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Restaurant } from "./types";

const socket = io("https://whatweeat-backend.onrender.com", { transports: ["websocket"] });

const App: React.FC = () => {
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [score, setScore] = useState<number>(5);
    const [results, setResults] = useState<Restaurant[] | null>(null);
    const [submittedVotes, setSubmittedVotes] = useState<number>(0);
    const [voteSubmitted, setVoteSubmitted] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(1);

    useEffect(() => {
        socket.on("restaurant", (data: { restaurant: Restaurant }) => {
            setRestaurant(data.restaurant);
            setVoteSubmitted(false);
            setSubmittedVotes(0);
            setProgress((prev) => prev + 1);
        });

        socket.on("voteProgress", (count: number) => {
            setSubmittedVotes(count);
        });

        socket.on("results", (finalResults: Restaurant[]) => {
            setResults(finalResults);
        });
    }, []);

    const handleVote = () => {
        if (restaurant && !voteSubmitted) {
            socket.emit("vote", { id: restaurant.id, score });
            setVoteSubmitted(true);
        }
    };

    const handleRestart = () => {
        socket.emit("restart");
        setResults(null);
        setProgress(1);
    };

    return (
        <Box textAlign="center" p={4} maxW="600px" mx="auto">
            {results ? (
                <Box>
                    <Text fontSize="2xl" fontWeight="bold" mb={4}>🍽️ 最终结果</Text>
                    {results.map((r) => (
                        <Box key={r.id} p={3} border="1px solid #ccc" borderRadius="md" mb={2}>
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
                    <Text fontSize="2xl" fontWeight="bold">🍽️ {restaurant.name}</Text>
                    <Text>{restaurant.categories.join(", ")}</Text>
                    <Text>评分: {restaurant.rating} 🌟 | {restaurant.review_count} 条评论</Text>
                    <a href={restaurant.yelp_url} target="_blank" rel="noopener noreferrer">查看 Yelp</a>

                    <Progress value={(progress / 10) * 100} colorScheme="blue" size="sm" my={4} />

                    <Slider defaultValue={5} min={1} max={10} step={1} onChange={setScore} isDisabled={voteSubmitted}>
                        <SliderTrack><SliderFilledTrack /></SliderTrack>
                        <SliderThumb />
                    </Slider>

                    <Button
                        colorScheme="blue"
                        mt={4}
                        onClick={handleVote}
                        isDisabled={voteSubmitted}
                    >
                        {voteSubmitted ? "✅ 已提交" : "提交评分"}
                    </Button>

                    <Text fontSize="sm" mt={2} color="gray.500">
                        {submittedVotes} / 3 人已提交
                    </Text>
                </Box>
            ) : (
                <Text>⏳ 正在加载餐厅数据...</Text>
            )}
        </Box>
    );
};

export default App;
