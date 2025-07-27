export enum MessageType {
	// Connection messages
	WELCOME = "WELCOME",
	HEARTBEAT = "HEARTBEAT",
	DISCONNECT = "DISCONNECT",

	// Game state messages
	GAME_UPDATE = "GAME_UPDATE",
	SYNC_REQUEST = "SYNC_REQUEST",
	SYNC_RESPONSE = "SYNC_RESPONSE",

	// Entity messages
	CREATE_ENTITY = "CREATE_ENTITY",
	ENTITY_CREATED = "ENTITY_CREATED",
	UPDATE_ENTITY = "UPDATE_ENTITY",
	DESTROY_ENTITY = "DESTROY_ENTITY",

	// System messages
	CLAIM_SYSTEM = "CLAIM_SYSTEM",
	SYSTEM_CLAIMED = "SYSTEM_CLAIMED",

	// Player messages
	PLAYER_JOIN = "PLAYER_JOIN",
	PLAYER_LEAVE = "PLAYER_LEAVE",
	PLAYER_UPDATE = "PLAYER_UPDATE",

	// Chat messages
	CHAT_MESSAGE = "CHAT_MESSAGE",
	CHAT_SYSTEM = "CHAT_SYSTEM",

	// Legacy enum values for backwards compatibility
	ClaimSystem = "CLAIM_SYSTEM",
	SystemClaimed = "SYSTEM_CLAIMED",
	CreateEntity = "CREATE_ENTITY",
	EntityCreated = "ENTITY_CREATED",
}

export interface Message {
	type: MessageType;
	payload: any;
}
