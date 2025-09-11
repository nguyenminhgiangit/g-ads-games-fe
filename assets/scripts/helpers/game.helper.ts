import { GameId, WheelPiece } from "../../types/api.type";

const GAME_PREFAB_NAME = {
    wheel: "WheelGame",
    slot: "SlotMachine",
} as const satisfies Record<GameId, string>;

export function getGamePrefabName(gameId: GameId): string {
    return GAME_PREFAB_NAME[gameId];
}

export function indexOfPieceByKey(pieces: readonly WheelPiece[], key: string): number {
    const _map = new Map<string, number>();
    for (let i = 0; i < pieces.length; i++) _map.set(pieces[i].key, i);
    return _map.get(key) ?? -1;
}