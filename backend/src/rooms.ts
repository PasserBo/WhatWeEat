interface Room {
    roomId: string;
    players: string[];
    maxPlayers: number;
    owner: string;
    currentRestaurantIndex: number;
    votes: Record<string, number[]>; // 记录每家餐厅的分数
    restaurants: { id: string; name: string }[];
}

const rooms: Record<string, Room> = {};

/**
 * 创建新房间
 */
export const createRoom = (roomId: string, maxPlayers: number, owner: string, restaurantData: any[]) => {
    rooms[roomId] = {
        roomId,
        players: [],
        maxPlayers,
        owner,
        currentRestaurantIndex: 0,
        votes: {},
        restaurants: restaurantData.slice(0, 10),
    };
};

/**
 * 加入房间
 */
export const joinRoom = (roomId: string, playerId: string) => {
    if (rooms[roomId] && rooms[roomId].players.length < rooms[roomId].maxPlayers) {
        rooms[roomId].players.push(playerId);
        return true;
    }
    return false;
};

/**
 * 开始投票
 */
export const startVoting = (roomId: string) => {
    return rooms[roomId]?.restaurants[0] || null;
};

/**
 * 提交投票
 */
export const submitVote = (roomId: string, restaurantId: string, score: number) => {
    if (!rooms[roomId].votes[restaurantId]) {
        rooms[roomId].votes[restaurantId] = [];
    }
    rooms[roomId].votes[restaurantId].push(score);

    // 检查是否所有人都投票了
    if (rooms[roomId].votes[restaurantId].length >= rooms[roomId].players.length) {
        rooms[roomId].currentRestaurantIndex++;

        if (rooms[roomId].currentRestaurantIndex < 10) {
            return rooms[roomId].restaurants[rooms[roomId].currentRestaurantIndex];
        } else {
            return "FINISHED";
        }
    }
    return null;
};

/**
 * 获取最终推荐结果
 */
export const getResults = (roomId: string) => {
    return rooms[roomId]?.votes || {};
};

/**
 * 重置房间（可选）
 */
export const resetRoom = (roomId: string) => {
    if (rooms[roomId]) {
        rooms[roomId].currentRestaurantIndex = 0;
        rooms[roomId].votes = {};
    }
};
