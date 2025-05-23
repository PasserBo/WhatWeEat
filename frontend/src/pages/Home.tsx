import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Card,
  CardContent, 
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
//import { createRoom, joinRoom, onRoomUpdate, cleanup } from "@/lib/socket";
import { RoomState } from "../types";
import socket from "@/lib/socket";
import { generateAvatar } from "@/utils/emoji";
import { generateRoomName } from "@/utils/room";

function generateRoomId() { 
  // 生成一个6位随机字符串
  return Math.random().toString(36).substring(6);
}

export default function Home() {
  const navigate = useNavigate();
  // const [roomId, setRoomId] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("4");
  const [createdRoomId, setCreatedRoomId] = useState("");
  const [votingType, setVotingType] = useState("score");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  // const { toast } = useToast();
  
  const createRoom = () => {
    const newRoomId = generateRoomId();
    const avatar = generateAvatar();
    const roomName = generateRoomName();
    console.log("Creating room with ID:", socket.id);
    socket.emit("createRoom", { 
      roomId: newRoomId, 
      maxPlayers, 
      votingType,
      ownerAvatar: avatar,
      roomName
    });
    setCreatedRoomId(newRoomId);
    navigate(`/room/${newRoomId}`);
  };

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>What We Eat?</CardTitle>
          <CardDescription>
            Create a room or join an existing one to find your next meal!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="roomId">Join an existing room</Label>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate(`/join`)}
              className="w-full"
            >
              Join Room
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              {/* 创建房间，选择人数 */}
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Create a new room
                </span>
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="maxPlayers">Maximum Players</Label>
              <Input
                id="maxPlayers"
                type="number"
                min="2"
                max="10"
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(e.target.value)}
              />
            </div>
            {/* 投票类型 */}
            <Button 
              variant="outline" 
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="w-full">
              {showAdvancedOptions ? "Hide Advanced Options" : "Show Advanced Options"}
            </Button>
            {/* 高级选项 */}
            {showAdvancedOptions && (
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="votingType">Voting Type</Label>
                <select
                  id="votingType"
                  value={votingType}
                  onChange={(e) => setVotingType(e.target.value)}
                  className="w-full p-2 border rounded-md bg-background"
                >
                  <option value="score">Score (1-10)</option>
                  <option value="binary">Like/Dislike</option>
                </select>
              </div>
            )}

            {/* 创建房间 */}
            <Button onClick={createRoom} className="w-full">
              Create Room
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 