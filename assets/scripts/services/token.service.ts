
export const TokenKeys = {
    access: "auth.accessToken",
    accessExp: "auth.accessToken.exp",      // epoch ms
    refresh: "auth.refreshToken",
    refreshExp: "auth.refreshToken.exp",    // epoch ms
};

export const TokenService = {
    // ----- Access -----
    getAccessToken(): string | null { return localStorage.getItem(TokenKeys.access); },
    setAccessToken(token: string, expiresAtMs?: number) {
        localStorage.setItem(TokenKeys.access, token);
        if (expiresAtMs) localStorage.setItem(TokenKeys.accessExp, String(expiresAtMs));
    },
    getAccessExpiry(): number | null {
        const v = localStorage.getItem(TokenKeys.accessExp);
        return v ? Number(v) : null;
    },
    isAccessValid(skewMs = 0): boolean {
        const token = this.getAccessToken();
        const exp = this.getAccessExpiry();
        if (!token || !exp) return false;
        return Date.now() + skewMs < exp;
    },

    // ----- Refresh -----
    getRefreshToken(): string | null { return localStorage.getItem(TokenKeys.refresh); },
    setRefreshToken(token: string, expiresAtMs?: number) {
        localStorage.setItem(TokenKeys.refresh, token);
        if (expiresAtMs) localStorage.setItem(TokenKeys.refreshExp, String(expiresAtMs));
    },
    getRefreshExpiry(): number | null {
        const v = localStorage.getItem(TokenKeys.refreshExp);
        return v ? Number(v) : null;
    },
    isRefreshValid(skewMs = 0): boolean {
        const token = this.getRefreshToken();
        const exp = this.getRefreshExpiry();
        if (!token || !exp) return false;
        return Date.now() + skewMs < exp;
    },

    // ----- Helpers -----
    setAll(params: { accessToken: string; accessExpiresAtMs?: number; refreshToken?: string; refreshExpiresAtMs?: number }) {
        this.setAccessToken(params.accessToken, params.accessExpiresAtMs);
        if (params.refreshToken) this.setRefreshToken(params.refreshToken, params.refreshExpiresAtMs);
    },
    clearAll() {
        localStorage.removeItem(TokenKeys.access);
        localStorage.removeItem(TokenKeys.accessExp);
        localStorage.removeItem(TokenKeys.refresh);
        localStorage.removeItem(TokenKeys.refreshExp);
    },
};
