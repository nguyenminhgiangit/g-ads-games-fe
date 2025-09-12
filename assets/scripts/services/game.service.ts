import { log } from "cc";
import { DataGameManager } from "../managers/user.game.profile.manager";
import { clientApi } from "../network/client.api";
import { uiManager } from "../ui/UIManager";

export async function gameReset(): Promise<boolean> {
    log('gameReset...');
    const respReset = await clientApi.game.reset();
    if (respReset.ok === false) {
        log('reset is failed:: ', respReset.error);
        uiManager().showToast(respReset.error);
        return false;
    }
    //update state
    const newState = respReset.state;
    DataGameManager.stateApply(newState);
    return true;
}