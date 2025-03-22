import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { RoomState } from "@/types";
import { generateRoomName } from "@/utils/room";

interface RoomCardProps {
  room: RoomState;
  onJoin: (roomId: string) => void;
}

export function RoomCard({ room, onJoin }: RoomCardProps) {
  // Generate a consistent room name based on roomId
  const roomName = generateRoomName();
  
  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">
            {room.ownerAvatar}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-lg">{roomName}</span>
            <span className="text-xs text-muted-foreground">ID: {room.roomId}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-muted-foreground">
              Players: {room.players.length} / {room.maxPlayers}
            </div>
            <div className="text-sm text-muted-foreground">
              Voting: {room.votingType === "score" ? "1-10" : "Like/Dislike"}
            </div>
          </div>
          <Button onClick={() => onJoin(room.roomId)}>
            Join
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 