import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FOOD_EMOJIS } from "@/utils/emoji";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent, 
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RoomCard } from "@/components/RoomCard";
import { RoomState } from "@/types";
import socket from "@/lib/socket";

export default function JoinRoom() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomState[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);

  useEffect(() => {
    // Request available rooms when component mounts
    socket.emit("getAvailableRooms");

    // Listen for room updates
    socket.on("availableRooms", (availableRooms: RoomState[]) => {
      setRooms(availableRooms);
    });

    return () => {
      socket.off("availableRooms");
    };
  }, []);

  const handleEmojiSelect = (emoji: string) => {
    if (selectedEmojis.length < 3) {
      setSelectedEmojis([...selectedEmojis, emoji]);
    }
  };

  const handleClear = () => {
    setSelectedEmojis([]);
  };

  const handleJoinRoom = (roomId: string) => {
    setSelectedRoomId(roomId);
  };

  const handleSubmitPassword = () => {
    if (selectedEmojis.length === 3 && selectedRoomId) {
      socket.emit("joinRoomWithPassword", {
        roomId: selectedRoomId,
        password: selectedEmojis
      });
    }
  };

  if (selectedRoomId) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Enter Room Password</CardTitle>
            <CardDescription>
              Enter the emoji password to join Room {selectedRoomId}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-center gap-2">
                {selectedEmojis.map((emoji, index) => (
                  <div key={index} className="w-12 h-12 border rounded flex items-center justify-center text-2xl">
                    {emoji}
                  </div>
                ))}
                {Array(3 - selectedEmojis.length).fill("").map((_, index) => (
                  <div key={`empty-${index}`} className="w-12 h-12 border rounded flex items-center justify-center">
                    ⬜
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-5 gap-2">
                {FOOD_EMOJIS.map((emojiOption) => (
                  <button
                    key={emojiOption.emoji}
                    onClick={() => handleEmojiSelect(emojiOption.emoji)}
                    className="w-12 h-12 border rounded hover:bg-gray-100 text-2xl"
                    aria-label={emojiOption.label}
                  >
                    {emojiOption.emoji}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleClear} variant="outline" className="flex-1">
                  Clear
                </Button>
                <Button 
                  onClick={handleSubmitPassword}
                  disabled={selectedEmojis.length !== 3}
                  className="flex-1"
                >
                  Join Room
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container flex items-center justify-center min-h-screen">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Available Rooms</CardTitle>
          <CardDescription>
            Select a room to join
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rooms.length === 0 ? (
              <div className="text-center text-muted-foreground">
                No rooms available
              </div>
            ) : (
              rooms.map((room) => (
                <RoomCard
                  key={room.roomId}
                  room={room}
                  onJoin={handleJoinRoom}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 