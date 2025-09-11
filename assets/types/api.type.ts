export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export interface RequestOptions {
    method?: HttpMethod;
    headers?: Record<string, string>;
    query?: Record<string, string | number | boolean | undefined>;
    body?: any;
    timeoutMs?: number;
    credentials?: RequestCredentials; // "include" | "omit" | "same-origin"
    preflightRefresh?: boolean;   // NEW: mặc định true
    preflightSkewMs?: number;     // NEW: buffer ms (mặc định 15s)
}

export type TokenResponse = {
    accessToken: string;
    accessTokenInfo?: { issuedAt: string; expiresIn: number };   // seconds
    refreshToken?: string;
    refreshTokenInfo?: { issuedAt: string; expiresIn: number };  // seconds
    isNew?: boolean; // account mới tạo
};

export type LoginOk = { ok: true; isNew?: boolean };
export type LoginErr = { ok: false; error: string };
export type LoginResult = LoginOk | LoginErr;

export type UserProfile = {
    id: string;
    email?: string;
    displayName?: string;
};
export type WheelPiece = {
    key: string;
    label: string;
    weight?: number;
    reward?: number;
    color?: string;
};
export type WheelMilestone = {
    label: string;
    reward: number;
};
export type GameId = 'wheel' | 'slot';
type GameWheel = {
    id: GameId;
    pieces: WheelPiece[];
    claims: WheelMilestone[];
    maxSpin: number;
};
export type SlotPiece = {
    key: string;
    label: string;
    weight?: number;
    reward?: number;
    color?: string;
};
export type SlotMilestone = {
    label: string;
    reward: number;
};
type GameSlot = {
    id: GameId;
    pieces: SlotPiece[];
    claims: SlotMilestone[];
    maxSpin: number;
};
export type GameInfo = | GameWheel | GameSlot;
export type GameState = {
    spinLeft: number;
    score: number;
};
export type UserGameProfile = {
    user: UserProfile;
    game: GameInfo;
    state: GameState;
};
export type GameMeResponse = {

};

export type GameMeOk = { ok: true; data: UserGameProfile };
export type GameMeErr = { ok: false; error: string };
export type GameMeResult = GameMeOk | GameMeErr;

export type SpinResponse = {
    key: string;
    state: GameState
};
export type SpinOk = { ok: true; key: string, state: GameState };
export type SpinErr = { ok: false; error: string };
export type SpinResult = SpinOk | SpinErr;

export type ResetResponse = {
    state: GameState
};
export type ResetOk = { ok: true; };
export type ResetErr = { ok: false; error: string };
export type ResetResult = SpinOk | SpinErr;

export type SubmitResponse = {
    message: string,
    state: GameState
};
export type SubmitOk = { ok: true; state: GameState, message: string };
export type SubmitErr = { ok: false; error: string };
export type SubmitResult = SubmitOk | SubmitErr;

export type SubmittingPayload = {
    gameId?: GameId;
    claimedPoint?: number;
    username?: string
    email: string;
    phone: string;
}

export type OnGuestOk = { ok: true; };
export type OnGuestErr = { ok: false; error: string };
export type OnGuestResult = SubmitOk | SubmitErr;
