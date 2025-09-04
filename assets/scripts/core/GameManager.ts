import { _decorator, Component, Prefab, instantiate, resources } from 'cc';
import { GameConfig } from './GameConfig';
import { BaseGame } from './BaseGame';
import { GameRegistry } from './GameRegistry';
import { UIManager } from '../ui/UIManager';

const { ccclass } = _decorator;

type Ctor<T> = { new(...args: any[]): T };

@ccclass('GameManager')
export class GameManager extends Component {
    private currentGame: BaseGame | null = null;

    async start() {
        const cfg = await GameConfig.fetchFromServer();
        console.log("[GameManager] Loaded config:", cfg);
        await this.loadGame(cfg.currentGame);
    }

    private loadGame(gameName: string): Promise<void> {
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
                    UIManager.getInstance().showLoading(false);
                    resolve();
                }).catch(reject);
            });
        });
    }
}
