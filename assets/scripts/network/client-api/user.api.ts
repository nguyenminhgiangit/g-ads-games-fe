import { GameMeResult, UserGameProfile, UserProfile } from "../../../types/api.type";
import { REQUEST_TIMEOUT_MS } from "../../configs/api.config";
import { DataGameManager } from "../../managers/user.game.profile.manager";
import { baseApi } from "./base.api";

export const users = {
  me(): Promise<UserProfile> {
    return baseApi.get<UserProfile>("users/me", { timeoutMs: REQUEST_TIMEOUT_MS });
  },
  /** nếu bạn có endpoint riêng lấy game+state của user */
  async gameMe(): Promise<GameMeResult> {
    try {
      const resp = await baseApi.get<UserGameProfile>("users/game-me", { timeoutMs: REQUEST_TIMEOUT_MS });
      DataGameManager.apply(resp);
      return {
        ok: true,
        data: resp
      };
    } catch (e: any) {
      return { ok: false, error: e?.message || "Get user game is failed" };
    }
  },
};