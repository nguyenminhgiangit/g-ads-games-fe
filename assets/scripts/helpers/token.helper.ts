import { TokenService } from "../services/token.service";

export type AccessInfo = { issuedAt?: string | number; expiresIn?: number }; // seconds
export type RefreshInfo = { issuedAt?: string | number; expiresIn?: number }; // seconds

/** Payload server có thể trả về cho cả login & refresh */
export type TokenResponseLike = {
  accessToken: string;
  accessTokenInfo?: AccessInfo;
  refreshToken?: string;
  refreshTokenInfo?: RefreshInfo;
};

/** Tính epoch ms từ { issuedAt, expiresIn }. Nếu thiếu, fallback hợp lý. */
function computeExpiresAtMs(info?: { issuedAt?: string | number; expiresIn?: number }): number | undefined {
  if (!info?.expiresIn) return undefined;
  // Parse issuedAt mềm dẻo (string ISO hoặc epoch ms)
  let issuedMs: number;
  if (typeof info.issuedAt === "number") {
    issuedMs = info.issuedAt;
  } else if (typeof info.issuedAt === "string") {
    const t = Date.parse(info.issuedAt);
    issuedMs = isNaN(t) ? Date.now() : t;
  } else {
    issuedMs = Date.now();
  }
  return issuedMs + info.expiresIn * 1000;
}

/**
 * Gom logic set token + expiry. Dùng cho cả login/refresh.
 * - BẮT BUỘC: accessToken
 * - TUỲ CHỌN: refreshToken (+ refreshTokenInfo)
 * - Nếu server không trả info, expiry sẽ để undefined (vẫn lưu token)
 */
export function applyTokenResponse(data: TokenResponseLike) {
  if (!data?.accessToken) throw new Error("Missing accessToken in response");

  const accessExpiresAtMs  = computeExpiresAtMs(data.accessTokenInfo);
  const refreshExpiresAtMs = computeExpiresAtMs(data.refreshTokenInfo);

  TokenService.setAll({
    accessToken: data.accessToken,
    accessExpiresAtMs,
    refreshToken: data.refreshToken,           // chỉ set nếu có (refresh flow hay login)
    refreshExpiresAtMs,
  });
}
