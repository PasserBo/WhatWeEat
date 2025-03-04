import { Box, Button, Text, Slider, SliderTrack, SliderFilledTrack, SliderThumb } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Restaurant, Vote } from "./types";

// const socket = io("http://localhost:3001");
const socket = io("http://172.16.101.116:3001");

const App: React.FC = () => {
    const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
    const [score, setScore] = useState<number>(5);
    const [results, setResults] = useState<Record<string, number[]> | null>(null);

    useEffect(() => {
        socket.on("restaurant", (data: { restaurant: Restaurant }) => {
            setRestaurant(data.restaurant);
        });

        socket.on("results", (finalResults: Record<string, number[]>) => {
            setResults(finalResults);
        });
    }, []);

    const handleVote = () => {
        if (restaurant) {
            const vote: Vote = { id: restaurant.id, score };
            socket.emit("vote", vote);
        }
    };

    return (
        <Box textAlign="center" p={4}>
            {results ? (
                <Box>
                    <Text fontSize="2xl">最终结果：</Text>
                    {Object.entries(results).map(([id, scores]) => (
                        <Text key={id}>
                            {id} 平均分: {(scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)}
                        </Text>
                    ))}
                </Box>
            ) : restaurant ? (
                <Box>
                    <Text fontSize="2xl">{restaurant.name}</Text>
                    <Text>{restaurant.categories.join(", ")}</Text>
                    <Text>评分: {restaurant.rating} 🌟 | {restaurant.review_count} 条评论</Text>
                    <a href={restaurant.yelp_url} target="_blank" rel="noopener noreferrer">查看 Yelp</a>
                    <Slider defaultValue={5} min={1} max={10} step={1} onChange={setScore}>
                        <SliderTrack><SliderFilledTrack /></SliderTrack>
                        <SliderThumb />
                    </Slider>
                    <Button colorScheme="blue" onClick={handleVote} mt={4}>提交评分</Button>
                </Box>
            ) : (
                <Text>等待数据...</Text>
            )}
        </Box>
    );
};

export default App;
