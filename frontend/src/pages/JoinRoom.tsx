import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  const [currentPosition, setCurrentPosition] = useState(0);
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [emojiOptions, setEmojiOptions] = useState<string[][]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    // Request available rooms when component mounts
    socket.emit("getAvailableRooms");

    // Listen for room updates
    socket.on("availableRooms", (availableRooms: RoomState[]) => {
      console.log('Received available rooms:', availableRooms);
      setRooms(availableRooms);
    });

    socket.on("emojiOptions", (options: string[][]) => {
      console.log('Received emoji options:', options);
      // Set received emoji options
      setEmojiOptions(options);
      // Set current step to 0
      setCurrentStep(0);
      // Set selected emojis to empty array
      setSelectedEmojis([]);
    });

    socket.on("joinRoomResult", (result: { success: boolean, message?: string }) => {
      console.log('Join room result:', result);
      if (result.success) {
        console.log('Navigating to room:', selectedRoomId);
        navigate(`/room/${selectedRoomId}`);
      } else {
        alert(result.message || 'Failed to join room');
        setSelectedEmojis([]);
        setCurrentStep(0);
      }
    });

    return () => {
      socket.off("availableRooms");
      socket.off("emojiOptions");
      socket.off("joinRoomResult");
    };
  }, [navigate, selectedRoomId]);

  const handleEmojiSelect = (emoji: string) => {
    // update the selectedEmojis array, selectedEmojis can be repeated
    const newSelectedEmojis = [...selectedEmojis, emoji];
    setSelectedEmojis(newSelectedEmojis);
    setCurrentStep(currentStep + 1);
    
    // Attempt to join the room when the selectedEmojis array is full
    if (newSelectedEmojis.length === 3) {
      socket.emit("joinRoomWithPassword", {
        roomId: selectedRoomId,
        password: newSelectedEmojis
      });
    }
    
  };

  const handleClear = () => {
    setSelectedEmojis([]);
    setCurrentStep(0);
  };

  const handleJoinRoom = (roomId: string) => {
    console.log('handleJoinRoom called with roomId:', roomId);
    setSelectedRoomId(roomId);
    console.log('Emitting getEmojiOptions event for room:', roomId);
    socket.emit("getEmojiOptions", {roomId: roomId});
    console.log('getEmojiOptions event emitted');
  };


  if (selectedRoomId) {
    console.log('selectedRoomId is:', selectedRoomId);
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Enter Room Password</CardTitle>
            <CardDescription>
              Enter the emoji password No.{currentStep + 1} for Room: {selectedRoomId}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* show the selected emojis */}
              <div className="flex justify-center gap-2">
                {selectedEmojis.map((emoji, index) => (
                  <div key={index} className="w-12 h-12 border rounded flex items-center justify-center text-2xl">
                    {emoji}
                  </div>
                ))}
                {/* show the empty emojis slots */}
                {Array(3 - selectedEmojis.length).fill("").map((_, index) => (
                  <div key={`empty-${index}`} className="w-12 h-12 border rounded flex items-center justify-center">
                    ⬜
                  </div>
                ))}
              </div>
              {/* show the emoji options */}
              {emojiOptions.length > 0 && currentStep < 3 && (
                <div className="grid grid-cols-5 gap-2">
                  {/* show the emoji options based on the current step */}
                  {emojiOptions[currentStep].map((emoji, index) => (
                    <button
                      key={index}
                      onClick={() => handleEmojiSelect(emoji)}
                      className="w-12 h-12 border rounded hover:bg-gray-100 text-2xl"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleClear} variant="outline" className="flex-1">
                  Clear
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
                  onJoin={(roomId) => {
                    console.log('RoomCard onJoin clicked for room:', roomId);
                    handleJoinRoom(roomId);
                  }}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 