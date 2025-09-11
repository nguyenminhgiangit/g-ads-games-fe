import { Toast } from "../common/Toast";

export type PlayerInfo = {
    playerId: string;
    spinsLeft: number;
    score: number;
};

const MAX_SPINS = 3;

export class PlayerData1 {
    private static _instance: PlayerData1;
    private _data: PlayerInfo;

    private STORAGE_KEY = "ads#player#data";

    // Các mốc claim
    private _claimMilestones = [12, 24, 36];

    private constructor() {
        this._data = this.load();
    }

    public static get instance(): PlayerData1 {
        if (!this._instance) {
            this._instance = new PlayerData1();
        }
        return this._instance;
    }

    private generateId(): string {
        return "player-" + Math.floor(Math.random() * 1e9).toString();
    }

    private load(): PlayerInfo {
        const json = localStorage.getItem(this.STORAGE_KEY);
        if (json) {
            try {
                Toast.getInstance().show("Welcome back!");
                return JSON.parse(json) as PlayerInfo;
            } catch (e) {
                console.warn("PlayerData: parse error, tạo mới", e);
            }
        }
        // Nếu chưa có → tạo mới
        Toast.getInstance().show("Welcome to you!");
        const data = this.createNewData();
        return data;
    }

    private createNewData(): PlayerInfo {
        const data: PlayerInfo = {
            playerId: this.generateId(),
            spinsLeft: MAX_SPINS,
            score: 0,
        };
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
        return data;
    }

    public save() {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._data));
    }

    // Getters / Setters
    public get playerId(): string {
        return this._data.playerId;
    }

    public get spinsLeft(): number {
        return this._data.spinsLeft;
    }
    public set spinsLeft(v: number) {
        this._data.spinsLeft = v;
        this.save();
    }
    public get maxSpins(): number {
        return MAX_SPINS;
    }

    public get score(): number {
        return this._data.score;
    }
    public set score(v: number) {
        this._data.score = v;
        this.save();
    }

    public get claimMilestones(): number[] {
        return this._claimMilestones;
    }

    // Helpers
    public increaseScore(amount: number) {
        this._data.score += amount;
        this.save();
    }

    public decreaseSpins(count: number = 1) {
        this._data.spinsLeft = Math.max(0, this._data.spinsLeft - count);
        this.save();
    }

    public reset(newSpins: number = MAX_SPINS) {
        this._data = {
            playerId: this.generateId(),
            spinsLeft: newSpins,
            score: 0,
        };
        this.save();
    }

    public getClaimingPoint(): number | null {
        let available = null;
        for (const milestone of this.claimMilestones) {
            if (this.score >= milestone) {
                available = milestone;
            }
        }
        return available;
    }
}
