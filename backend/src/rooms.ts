import { Restaurant } from "./types";

interface Room {
    roomId: string;
    players: string[];
    maxPlayers: number;
    owner: string;
    currentRestaurantIndex: number;
    votes: Record<string, number[]>; // 记录每家餐厅的分数
    restaurants: Restaurant[];
    status: 'waiting' | 'voting' | 'finished';
    currentVotes: Map<string, number>;
}

const rooms: Record<string, Room> = {};

/**
 * 随机选择指定数量的餐厅
 */
const selectRandomRestaurants = (restaurantData: Restaurant[], count: number): Restaurant[] => {
    // Create a copy of the array to avoid modifying the original
    const shuffled = [...restaurantData];
    
    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    return shuffled.slice(0, count);
};

/**
 * 创建新房间
 */
export const createRoom = (roomId: string, maxPlayers: number, owner: string, restaurantData: Restaurant[]) => {
    rooms[roomId] = {
        roomId,
        players: [owner],
        maxPlayers,
        owner,
        currentRestaurantIndex: 0,
        votes: {},
        restaurants: selectRandomRestaurants(restaurantData, 10), // Randomly select 10 restaurants
        status: "waiting",
        currentVotes: new Map(),
    };
};

export const restartRoom = (roomId: string) => {
    rooms[roomId].currentRestaurantIndex = 0;
    rooms[roomId].votes = {};
    rooms[roomId].currentVotes.clear();
}

/**
 * 加入房间
 */
export const joinRoom = (roomId: string, playerId: string) => {
    if (rooms[roomId] && rooms[roomId].players.length < rooms[roomId].maxPlayers) {
        // Don't add if player is already in the room
        if (!rooms[roomId].players.includes(playerId)) {
            rooms[roomId].players.push(playerId);
            return true;
        }
    }
    return false;
};

/**
 * 开始投票
 */
export const startVoting = (roomId: string) => {
    const room = rooms[roomId];
    if (!room) return null;
    
    room.status = 'voting';
    room.currentRestaurantIndex = 0;
    room.votes = {};
    room.currentVotes.clear();
    
    const restaurant = room.restaurants[0];
    return {
        ...restaurant,
        categories: restaurant.categories || [],
        rating: restaurant.rating || 0,
        review_count: restaurant.review_count || 0,
        image_url: restaurant.image_url || '',
        yelp_url: restaurant.yelp_url || ''
    };
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
    const room = rooms[roomId];
    if (!room) return [];

    return room.restaurants.map(restaurant => {
        const votes = room.votes[restaurant.id] || [];
        const averageScore = votes.length > 0 
            ? (votes.reduce((a, b) => a + b, 0) / votes.length).toFixed(1)
            : '0';

        return {
            ...restaurant,
            averageScore
        };
    }).sort((a, b) => Number(b.averageScore) - Number(a.averageScore));
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

export function getRoomState(roomId: string) {
    const room = rooms[roomId];
    if (!room) return null;
    return {
        roomId,
        owner: room.owner,
        players: room.players,
        status: room.status,
        currentRestaurantIndex: room.currentRestaurantIndex,
        restaurants: room.restaurants
    };
}

export function getVoteCount(roomId: string) {
    const room = rooms[roomId];
    if (!room) return 0;
    return room.currentVotes.size;
}
