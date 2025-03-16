import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import {
  Card,
  CardContent, 
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
//import { createRoom, joinRoom, onRoomUpdate, cleanup } from "@/lib/socket";
import { RoomState } from "./types";
import socket from "@/lib/socket";

function generateRoomId() { 
  return Math.random().toString(36).substring(5);
}

export default function Home() {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [maxPlayers, setMaxPlayers] = useState("4");
  const [createdRoomId, setCreatedRoomId] = useState("");
  // const { toast } = useToast();
  
  const createRoom = () => {
    const newRoomId = generateRoomId();
    console.log("Creating room with ID:", socket.id);
    socket.emit("createRoom", { roomId: newRoomId, maxPlayers });
    setCreatedRoomId(newRoomId);
    navigate(`/room/${newRoomId}`);
  };

  const joinRoom = () => {
    socket.emit("joinRoom", { roomId });
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>WhatWeEat</CardTitle>
          <CardDescription>
            Create a room or join an existing one to find your next meal!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="roomId">Room ID</Label>
              <Input
                placeholder="Enter room ID to join"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              onClick={joinRoom}
              disabled={!roomId}
              className="w-full"
            >
              Join Room
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or create a new room
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
            <Button onClick={createRoom} className="w-full">
              Create Room
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 