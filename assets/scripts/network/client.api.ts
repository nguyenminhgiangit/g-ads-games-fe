import { auth } from "./client-api/auth.api";
import { game } from "./client-api/game.api";
import { users } from "./client-api/user.api";


export const clientApi = { auth, users, game };
