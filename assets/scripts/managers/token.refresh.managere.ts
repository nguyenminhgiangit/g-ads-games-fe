import { TokenResponse } from "../../types/api.type";
import { detectPlatform } from "../helpers/api.helper";
import { getUUID } from "../helpers/device.helper";
import { TokenService } from "../services/token.service";

class TokenRefreshManagerImpl {
    private baseURL = "";
    private inFlight: Promise<boolean> | null = null;

    configure(baseURL: string) { this.baseURL = baseURL; }

    /** Chủ động refresh nếu access sắp hết hạn; nếu còn hạn thì bỏ qua */
    async refreshIfNeeded(skewMs = 15_000): Promise<boolean> {
        // Nếu access còn tốt → true
        if (TokenService.isAccessValid(skewMs)) return true;

        // Nếu refresh còn hạn → refresh (single-flight)
        if (TokenService.isRefreshValid(0)) return this.singleFlightRefresh();

        // Hết refresh → coi như fail
        TokenService.clearAll();
        return false;
    }

    /** Bắt buộc refresh ngay (dùng khi 401) */
    async forceRefresh(): Promise<boolean> {
        if (!TokenService.isRefreshValid(0)) {
            TokenService.clearAll();
            return false;
        }
        return this.singleFlightRefresh();
    }

    private async singleFlightRefresh(): Promise<boolean> {
        if (this.inFlight) return this.inFlight;
        this.inFlight = this.doRefresh()
            .catch(() => false)
            .finally(() => { this.inFlight = null; }) as Promise<boolean>;
        return this.inFlight;
    }

    private async doRefresh(): Promise<boolean> {
        const refreshToken = TokenService.getRefreshToken();
        if (!refreshToken) return false;
        const uuid = getUUID();
        const platform = detectPlatform();
        const url = new URL("auth/refresh-token", this.baseURL).toString();
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken, uuid, platform }),
        });
        if (!res.ok) return false;

        const data = (await res.json()) as TokenResponse;
        // Tính expiresAt ms nếu server có Info
        const accessExp = data.accessTokenInfo
            ? Date.parse(data.accessTokenInfo.issuedAt) + data.accessTokenInfo.expiresIn * 1000
            : undefined;
        const refreshExp = data.refreshTokenInfo
            ? Date.parse(data.refreshTokenInfo.issuedAt) + data.refreshTokenInfo.expiresIn * 1000
            : undefined;

        TokenService.setAll({
            accessToken: data.accessToken,
            accessExpiresAtMs: accessExp,
            refreshToken: data.refreshToken,
            refreshExpiresAtMs: refreshExp,
        });
        return true;
    }
}

export const TokenRefreshManager = new TokenRefreshManagerImpl();
