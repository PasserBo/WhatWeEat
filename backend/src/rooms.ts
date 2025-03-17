import { Restaurant,EmojiData } from "./types";
import { emojiData } from "./data";

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
    emojiPassword: string[];
    emojiOptions: string[][];
}

const rooms: Record<string, Room> = {};

export { rooms };

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
        emojiPassword: (() => {
            const password = generateEmojiPassword();
            return password;
        })(),
        emojiOptions: generateEmojiOptions(rooms[roomId].emojiPassword),
    };
};

export const restartRoom = (roomId: string) => {
    const room = rooms[roomId];
    if (!room) return;

    room.currentRestaurantIndex = 0;
    room.votes = {};
    room.currentVotes.clear();
    room.status = 'voting';
};

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
    const room = rooms[roomId];
    if (!room) return null;

    // Track current votes for this restaurant
    if (!room.votes[restaurantId]) {
        room.votes[restaurantId] = [];
    }
    room.votes[restaurantId].push(score);
    room.currentVotes.set(restaurantId, room.votes[restaurantId].length);

    // 检查是否所有人都投票了
    if (room.votes[restaurantId].length >= room.players.length) {
        room.currentRestaurantIndex++;
        room.currentVotes.clear(); // Clear current votes for next restaurant

        if (room.currentRestaurantIndex < 10) {
            return room.restaurants[room.currentRestaurantIndex];
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
// generate 3*5 emoji options, with 3 password emojis in each row
export function generateEmojiOptions(emojiPassword: string[]) {
    // emojiOptions is a 3*5 array
    const emojiOptions: string[][] = [[],[],[]];
    for (let i = 0; i < 3; i++) {
        // push password emoji based on the index
        emojiOptions[i].push(emojiPassword[i]);
        console.log(`[Rooms] Added password emoji ${emojiPassword[i]} to row ${i}`);
        // push 4 random emojis without repetition
        const randomEmojis = selectRandomEmojis(emojiPassword[i], 4);
        console.log(`[Rooms] Generated random emojis for row ${i}:`, randomEmojis);
        emojiOptions[i].push(...randomEmojis);
        // Shuffle the order of the emojis
        for (let j = emojiOptions[i].length - 1; j > 0; j--) {
            const k = Math.floor(Math.random() * (j + 1));
            [emojiOptions[i][j], emojiOptions[i][k]] = [emojiOptions[i][k], emojiOptions[i][j]];
        }
        console.log(`[Rooms] Final row ${i} after shuffling:`, emojiOptions[i]);
    }
    console.log(`[Rooms] Final emoji options:`, emojiOptions);
    return emojiOptions;
}

// select random emojis from EmojiData without repetition
// Password Emoji is pre added in the emojiOptions
// We need to select count more random emojis from the remaining emojis
function selectRandomEmojis(passwordEmoji: string, count: number): string[] {
    console.log(`[Rooms] Selecting ${count} random emojis (excluding ${passwordEmoji})`);
    // Convert emojiData to array if it's not already
    const allEmojis: EmojiData[] = Array.isArray(emojiData) ? emojiData : Object.values(emojiData);
    const availableEmojis = allEmojis.filter((emoji) => emoji.emoji !== passwordEmoji);
    console.log(`[Rooms] Available emojis count: ${availableEmojis.length}`);
    const shuffled = [...availableEmojis];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const selected = shuffled.slice(0, count).map((emoji) => emoji.emoji);
    console.log(`[Rooms] Selected random emojis:`, selected);
    return selected;
}

// Generate 3 random emojis as password
// Use emojiData to generate the password
function generateEmojiPassword(): string[] {
    const password: string[] = [];
    for (let i = 0; i < 3; i++) {
        const randomIndex = Math.floor(Math.random() * emojiData.length);
        password.push(emojiData[randomIndex].emoji);
    }
    return password;
}