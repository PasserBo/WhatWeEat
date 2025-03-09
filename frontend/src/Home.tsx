import { useState } from "react";
import { Box, Input, Button, Text, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, useToast, HStack, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import socket from "./socket";

const Home = () => {
    const [roomId, setRoomId] = useState("");
    const [maxPlayers, setMaxPlayers] = useState(3);
    const [createdRoomId, setCreatedRoomId] = useState("");
    const navigate = useNavigate();
    const toast = useToast();

    // console.log("Player connected:", socket.id);

    const createRoom = () => {
        const newRoomId = Math.random().toString(36).substring(7);
        console.log("Creating room with socket ID:", socket.id);
        socket.emit("createRoom", { roomId: newRoomId, maxPlayers });
        setCreatedRoomId(newRoomId);
        navigate(`/room/${newRoomId}`);
        
        // Show room code in a toast notification
        toast({
            title: "房间已创建",
            description: `分享房间代码: ${newRoomId}`,
            status: "success",
            duration: 10000,
            isClosable: true,
        });
    };

    const joinRoom = () => {
        if (!roomId.trim()) {
            toast({
                title: "错误",
                description: "请输入房间代码",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        socket.emit("joinRoom", { roomId });
        navigate(`/room/${roomId}`);
    };

    return (
        <Box textAlign="center" p={8} maxW="400px" mx="auto">
            <VStack spacing={6}>
                <Text fontSize="3xl" fontWeight="bold" mb={4}>🍽️ What We Eat</Text>
                
                <Box w="100%" p={4} borderWidth="1px" borderRadius="lg">
                    <Text fontSize="xl" mb={4}>创建新房间</Text>
                    <VStack spacing={4}>
                        <NumberInput 
                            min={2} 
                            max={10} 
                            value={maxPlayers} 
                            onChange={(_, value) => setMaxPlayers(value)}
                        >
                            <NumberInputField placeholder="最大玩家数" />
                            <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                            </NumberInputStepper>
                        </NumberInput>
                        <Button 
                            onClick={createRoom} 
                            colorScheme="blue" 
                            w="100%"
                        >
                            创建房间
                        </Button>
                    </VStack>
                </Box>

                <Box w="100%" p={4} borderWidth="1px" borderRadius="lg">
                    <Text fontSize="xl" mb={4}>加入房间</Text>
                    <VStack spacing={4}>
                        <Input 
                            placeholder="输入房间代码" 
                            value={roomId} 
                            onChange={(e) => setRoomId(e.target.value)}
                        />
                        <Button 
                            onClick={joinRoom} 
                            colorScheme="green" 
                            w="100%"
                        >
                            加入房间
                        </Button>
                    </VStack>
                </Box>
            </VStack>
        </Box>
    );
};

export default Home;
