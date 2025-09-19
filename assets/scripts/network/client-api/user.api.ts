import { UserProfile } from "../../../types/api.type";
import { REQUEST_TIMEOUT_MS } from "../../configs/api.config";
import { baseApi } from "./base.api";

export const users = {
  me(): Promise<UserProfile> {
    return baseApi.get<UserProfile>("users/me", { timeoutMs: REQUEST_TIMEOUT_MS });
  },
};