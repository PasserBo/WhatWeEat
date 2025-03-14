import { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "./socket";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./components/ui/card";

const Home = () => {
    const [roomId, setRoomId] = useState("");
    const [maxPlayers, setMaxPlayers] = useState("4");
    const navigate = useNavigate();

    const createRoom = () => {
        socket.emit("createRoom", { roomId, maxPlayers: parseInt(maxPlayers) });
        navigate(`/room/${roomId}`);
    };

    const joinRoom = () => {
        navigate(`/room/${roomId}`);
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl text-center">🍽️ 今天吃什么？</CardTitle>
                    <CardDescription className="text-center">
                        创建或加入一个房间，和朋友一起决定去哪里吃饭
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="roomId">房间号</Label>
                        <Input
                            id="roomId"
                            type="text"
                            placeholder="输入房间号"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="maxPlayers">最大人数</Label>
                        <Input
                            id="maxPlayers"
                            type="number"
                            min="2"
                            max="10"
                            value={maxPlayers}
                            onChange={(e) => setMaxPlayers(e.target.value)}
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col sm:flex-row gap-4">
                    <Button
                        className="flex-1"
                        onClick={createRoom}
                        disabled={!roomId || !maxPlayers}
                    >
                        创建房间
                    </Button>
                    <Button
                        className="flex-1"
                        variant="outline"
                        onClick={joinRoom}
                        disabled={!roomId}
                    >
                        加入房间
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Home;
