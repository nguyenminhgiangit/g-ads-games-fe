import { GameMeResult, ResetResponse, SpinResponse, SpinResult, SubmitResponse, SubmittingPayload, UserGameProfile } from "db://assets/types/api.type";
import { REQUEST_TIMEOUT_MS } from "../../configs/api.config";
import { baseApi } from "./base.api";
import { ActivitiesPayload, ActivitiesResponse } from "db://assets/types/activity.type";
import { DataGameManager } from "../../managers/user.game.profile.manager";

export const game = {
    async me(): Promise<GameMeResult> {
        try {
            const resp = await baseApi.get<UserGameProfile>("game/me", { timeoutMs: REQUEST_TIMEOUT_MS });
            DataGameManager.apply(resp);
            return {
                ok: true,
                data: resp
            };
        } catch (e: any) {
            return { ok: false, error: e?.message || "Get user game is failed" };
        }
    },
    async spin(payload: { gameId?: "wheel" | "slot"; bet?: number } = {}): Promise<SpinResult> {
        try {
            const resp = await baseApi.post<SpinResponse>("game/spin", payload, { timeoutMs: REQUEST_TIMEOUT_MS });
            return {
                ok: true,
                key: resp.key ?? null,
                state: resp.state ?? null
            };
        } catch (e: any) {
            return { ok: false, error: e?.message || "Spinning is failed" };
        }
    },
    async reset(payload: { gameId?: "wheel" | "slot" } = {}) {
        try {
            const resp = await baseApi.post<ResetResponse>("game/reset", payload, { timeoutMs: REQUEST_TIMEOUT_MS });
            return {
                ok: true,
                state: resp.state ?? null
            };
        } catch (e: any) {
            return { ok: false, error: e?.message || "Submition is failed" };
        }
    },
    claim(payload: { rewardId?: string; gameId?: "wheel" | "slot" } = {}) {
        return baseApi.post<any>("game/claim", payload, { timeoutMs: REQUEST_TIMEOUT_MS });
    },
    async submitInfo(payload: SubmittingPayload) {
        try {
            const resp = await baseApi.post<SubmitResponse>("game/submit-info", payload, { timeoutMs: REQUEST_TIMEOUT_MS });
            return {
                ok: true,
                state: resp.state ?? null,
                message: resp.message

            };
        } catch (e: any) {
            return { ok: false, error: e?.message || "Submition is failed" };
        }
    },
    async activities(payload: ActivitiesPayload) {
        try {
            const page = payload.page;// ?? DEFAULT_INDEX_PAGE;
            const pageSize = payload.pageSize;//clamp(payload.pageSize, 1, 200);

            const qs = new URLSearchParams();
            if (payload.gameId) qs.set('gameId', payload.gameId);
            if (payload.type) qs.set('type', payload.type);
            if (payload.page) qs.set('page', String(page));
            if (payload.pageSize) qs.set('pageSize', String(pageSize));

            const path = `game/activities?${qs.toString()}`;
            const resp = await baseApi.get<ActivitiesResponse>(path, { timeoutMs: REQUEST_TIMEOUT_MS });

            return {
                ok: true,
                data: resp
            };
        } catch (e: any) {
            return { ok: false, error: e?.message || "Get user activities is failed" };
        }
    }
};
