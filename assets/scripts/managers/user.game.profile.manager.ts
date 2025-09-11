import { EventTarget } from "cc";
import { GameId, GameInfo, GameState, SlotMilestone, UserGameProfile, UserProfile, WheelMilestone } from "../../types/api.type";


export const EVT_DATA_GAME_CHANGED = "data-game-changed";
class UserGameProfileManager {
    // ---- Singleton ----
    private static _inst: UserGameProfileManager | null = null;
    static get instance(): UserGameProfileManager {
        if (!this._inst) this._inst = new UserGameProfileManager();
        return this._inst;
    }

    // ---- Events ----
    readonly events = new EventTarget();

    // ---- State ----
    private _user: UserProfile | null = null;
    private _game: GameInfo | null = null;
    private _state: GameState | null = null;

    private constructor() { }

    // ---- Accessors ----
    get user(): UserProfile | null { return this._user; }
    get game(): GameInfo | null { return this._game; }
    get state(): GameState | null { return this._state; }

    get isWheel(): boolean { return this._game?.id === "wheel"; }
    get isSlot(): boolean { return this._game?.id === "slot"; }

    get gameId(): GameId { return this._game?.id ?? null };
    get displayName(): string { return this._user?.displayName ?? ""; }
    get spinLeft(): number { return this._state?.spinLeft ?? 0; }
    get score(): number { return this._state?.score ?? 0; }
    get maxSpin(): number { return this._game?.maxSpin ?? 0; }
    get claimMilestones(): Array<WheelMilestone> | Array<SlotMilestone> { return this._game?.claims ?? [] };
    get valueClaimMilestones(): Array<number> {
        const _claims = this.claimMilestones;
        return _claims.map(m => m.reward);
    }
    get claimingPoint(): number | null {
        let available = null;
        const _claims = this.claimMilestones;
        for (const _claim of _claims) {
            if (this.score >= _claim.reward) {
                available = _claim.reward;
            }
        }
        return available;
    }

    // ---- Mutations ----
    apply(dto: UserGameProfile) {
        let changed = false;

        if (dto.user) { this._user = dto.user; changed = true; }
        if (dto.game) { this._game = dto.game; changed = true; }
        if (dto.state) { this._state = dto.state; changed = true; }

        if (changed) this.emitChangedEvent();
    }
    stateApply(state: GameState) {
        if (state) {
            this._state = state;
            this.emitChangedEvent();
        }
    }

    clear() {
        this._user = null;
        this._game = null;
        this._state = null;
        this.emitChangedEvent();
    }

    toJSON(): UserGameProfile | null {
        if (!this._user || !this._game) return null;
        return { user: this._user, game: this._game, state: this._state };
    }
    emitChangedEvent() {
        this.events.emit(EVT_DATA_GAME_CHANGED);
    }
}
export const DataGameManager = UserGameProfileManager.instance;
