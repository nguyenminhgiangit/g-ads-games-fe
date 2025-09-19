import { _decorator, Component, Prefab, instantiate, resources, log } from 'cc';
import { BaseGame } from './BaseGame';
import { GameRegistry } from './GameRegistry';
import { clientApi } from '../network/client.api';
import { DataGameManager } from '../managers/user.game.profile.manager';
import { getGamePrefabName } from '../helpers/game.helper';
import { uiManager } from '../ui/UIManager';
import { NoticeType } from '../common/Notice';

const { ccclass } = _decorator;

type Ctor<T> = { new(...args: any[]): T };

@ccclass('GameManager')
export class GameManager extends Component {
    private currentGame: BaseGame | null = null;

    async start() {

        const rs = await this.onGuest();
        if (rs.ok === false) {
            uiManager().showNotice('NETWORK', rs.error, NoticeType.NO_BUTTON);
            uiManager().showLoading(false);
            return;
        }

        log('GameManager start >> ', DataGameManager.gameId);
        const currentGameName = getGamePrefabName(DataGameManager.gameId);
        await this.loadGame(currentGameName);
    }

    private loadGame(gameName: string): Promise<void> {
        log('loadGame... ', gameName);
        return new Promise((resolve, reject) => {
            resources.load(`prefabs/games/${gameName}`, Prefab, (err, prefab: Prefab) => {
                if (err) return reject(err);

                const node = instantiate(prefab);
                this.node.addChild(node);

                const GameClass = GameRegistry.get(gameName);
                if (!GameClass) {
                    console.error(`Game ${gameName} chưa được đăng ký trong GameRegistry.`);
                    return resolve();
                }

                // 👇 Cast constructor để getComponent không báo lỗi
                const comp = node.getComponent(GameClass as unknown as Ctor<BaseGame>) as BaseGame | null;
                if (!comp) {
                    console.error(`Prefab ${gameName} không gắn đúng component.`);
                    return resolve();
                }

                this.currentGame = comp;
                comp.loadRates().then(() => {
                    comp.initGame();
                    uiManager().showLoading(false);
                    resolve();
                }).catch(reject);
            });
        });
    }

    private async onGuest() {
        log('onGuest...');
        const respAccess = await clientApi.auth.guestLogin();
        if (respAccess.ok === false) {
            log('onGuest auth failed:: ', respAccess.error);
            return { ok: false, error: respAccess.error };
        }
        const message = respAccess.isNew === true ? "Welcome to you!" : "Welcome back!";
        uiManager().showToast(message);

        const respInfo = await clientApi.game.me();
        if (respInfo.ok === false) {
            log('onGuest info failed:: ', respInfo.error);
            return { ok: false, error: respInfo.error };
        }
        return { ok: true }
    }
}
