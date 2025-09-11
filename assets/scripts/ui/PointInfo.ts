import { _decorator, Label } from 'cc';
import { BaseComponent } from '../core/BaseComponent';
import { DataGameManager } from '../managers/user.game.profile.manager';
const { ccclass, property } = _decorator;

@ccclass('PointInfo')
export class PointInfo extends BaseComponent {
    @property(Label)
    private lblPoint: Label = null!;

    protected onRefreshUI(): void {
        const score = DataGameManager.score;
        this.lblPoint.string = `${score}`;
    }
}

