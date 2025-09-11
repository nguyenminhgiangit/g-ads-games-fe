import { LoginResult, TokenResponse } from "../../../types/api.type";
import { REQUEST_TIMEOUT_MS } from "../../configs/api.config";
import { detectPlatform } from "../../helpers/api.helper";
import { getUUID } from "../../helpers/device.helper";
import { applyTokenResponse } from "../../helpers/token.helper";
import { TokenService } from "../../services/token.service";
import { baseApi } from "./base.api";

export const auth = {
    async guestLogin(): Promise<LoginResult> {
        const uuid = getUUID();
        const platform = detectPlatform();
        try {
            const res = await baseApi.post<TokenResponse>("auth/guest", { uuid, platform }, { timeoutMs: REQUEST_TIMEOUT_MS, preflightRefresh: false });
            applyTokenResponse(res);
            return {
                ok: true,
                isNew: res.isNew
            };
        } catch (e: any) {
            TokenService.clearAll();
            return { ok: false, error: e?.message || "Guest login failed" };
        }
    },

    logoutLocal() {
        TokenService.clearAll();
    },

    async logoutServer(): Promise<void> {
        try {
            await baseApi.post("auth/logout", {});
        } finally {
            TokenService.clearAll();
        }
    },
};