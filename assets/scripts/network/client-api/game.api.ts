import { ResetResponse, SpinResponse, SpinResult, SubmitResponse, SubmittingPayload } from "db://assets/types/api.type";
import { REQUEST_TIMEOUT_MS } from "../../configs/api.config";
import { baseApi } from "./base.api";

export const game = {
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
};