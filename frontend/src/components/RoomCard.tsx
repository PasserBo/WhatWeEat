import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { RoomState } from "@/types";

interface RoomCardProps {
  room: RoomState;
  onJoin: (roomId: string) => void;
}

export function RoomCard({ room, onJoin }: RoomCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{room.ownerAvatar}</span>
          <span className="font-semibold">Room {room.roomId}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            Players: {room.players.length} / {room.maxPlayers}
          </div>
          <Button onClick={() => onJoin(room.roomId)}>
            Join
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 