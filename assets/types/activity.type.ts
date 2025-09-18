import { GameId } from "./api.type";

export const ACTIVITY_TYPE_ENUM = ['spin', 'reset', 'claim'] as const;
export type ActivityType = (typeof ACTIVITY_TYPE_ENUM)[number];
export type ActivitiesPayload = {
    gameId?: GameId;
    type?: ActivityType | "all";
    page?: number
    pageSize?: number;
}
export type ActivityPayloadResponse = {
    // spin
    pieceId?: string;
    pieceReward?: string;

    // reset
    reason?: string;

    // claim
    milestone?: number;            // 12 / 24 / 36
    rewardId?: string;
    claimedId?: string;
};
export type ActivityState = { score?: number; spinLeft?: number };
export type Activity = {
    gameId: GameId;
    type: ActivityType;
    before?: ActivityState;
    after?: ActivityState;
    payload?: ActivityPayloadResponse,
    createdAt?: string
}
export type ActivitiesResponse = {
    activities: [Activity];
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
};
export type ActivitiesOk = { ok: true; data: ActivitiesResponse };
export type ActivitiesErr = { ok: false; error: string };
export type ActivitiesResult = ActivitiesOk | ActivitiesErr;