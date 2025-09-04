import { _decorator, Button, Label } from 'cc';
import { PlayerData } from '../managers/PlayerData';
import { BaseComponent } from '../core/BaseComponent';
import { EVENT_SPIN_UPDATE_DISPLAY } from '../core/GameEvents';
const { ccclass, property } = _decorator;

@ccclass('PlayerInfo')
export class PlayerInfo extends BaseComponent {
    @property(Label)
    private lblPlayerId: Label = null!;

    @property(Label)
    private lblPlayerTurn: Label = null!;

    @property(Button)
    private btnReset: Button = null!;

    protected onLoad(): void {
        this.listen(EVENT_SPIN_UPDATE_DISPLAY, () => {
            this.onDisplay();
        });
    }

    protected onDisplay(): void {
        const player = PlayerData.instance;
        this.lblPlayerId.string = `${player.playerId}`;
        this.lblPlayerTurn.string = `${player.spinsLeft}`;

        this.btnReset.node.active = player.spinsLeft < player.maxSpins;
    }

    onResetClicked() {
        console.log("Reset button clicked");

        PlayerData.instance.reset();
        this.emit(EVENT_SPIN_UPDATE_DISPLAY);
    }


}

