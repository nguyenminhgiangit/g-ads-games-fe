import { _decorator, Button, Label } from 'cc';
import { BaseComponent } from '../core/BaseComponent';
import { DataGameManager } from '../managers/user.game.profile.manager';
import { gameReset } from '../services/game.service';
import { DataChangeType, EVENT_FORCE_DISPLAY, EventForceDisplay } from '../core/GameEvents';
const { ccclass, property } = _decorator;

@ccclass('PlayerInfo')
export class PlayerInfo extends BaseComponent {
    @property(Label)
    private lblPlayerId: Label = null!;

    @property(Label)
    private lblPlayerTurn: Label = null!;

    @property(Label)
    private lblMaxTurn: Label = null!;

    @property(Button)
    private btnReset: Button = null!;

    protected onListenners(): void {
        this.listen(EVENT_FORCE_DISPLAY, this.onForceDisplay, this);

    }

    protected onRefreshUI(): void {
        const displayName = DataGameManager.displayName;
        this.lblPlayerId.string = `${displayName}`;

        const spinLeft = DataGameManager.spinLeft;
        this.lblPlayerTurn.string = `${spinLeft}`;

        const maxSpins = DataGameManager.maxSpin;
        this.btnReset.node.active = spinLeft < maxSpins;

        this.lblMaxTurn.string = `/${maxSpins} turns`;
    }

    private onForceDisplay(data: EventForceDisplay) {
        if (data.type === DataChangeType.SPIN_LEFT) {
            const spinLeft = data.spinLeft ?? 0;
            this.lblPlayerTurn.string = `${spinLeft}`;
        }
    }

    async onResetClicked() {
        //call api
        await gameReset();
    }
}

