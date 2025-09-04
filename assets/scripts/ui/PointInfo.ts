import { _decorator, Component, Label } from 'cc';
import { PlayerData } from '../managers/PlayerData';
import { BaseComponent } from '../core/BaseComponent';
import { EVENT_SPIN_RESULT, EVENT_SPIN_UPDATE_DISPLAY } from '../core/GameEvents';
const { ccclass, property } = _decorator;

@ccclass('PointInfo')
export class PointInfo extends BaseComponent {
    @property(Label)
    private lblPoint: Label = null!;

    protected onLoad(): void {
        this.listen(EVENT_SPIN_UPDATE_DISPLAY, () => {
            this.onDisplay();
        });
    }

    protected onDisplay(): void {
        const player = PlayerData.instance;
        this.lblPoint.string = `${player.score}`;
    }
}

