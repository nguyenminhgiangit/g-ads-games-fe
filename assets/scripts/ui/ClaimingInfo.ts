import { _decorator, Button, Label } from 'cc';
import { uiManager } from './UIManager';
import { BaseComponent } from '../core/BaseComponent';
import { DataGameManager } from '../managers/user.game.profile.manager';
const { ccclass, property } = _decorator;

@ccclass('ClaimingInfo')
export class ClaimingInfo extends BaseComponent {
    @property(Label)
    private lblClaimingPoint: Label = null!;

    @property(Button)
    private btnClaim: Button = null!;

    onClaimClicked() {
        uiManager().showClaimForm(true);
    }
    protected onRefreshUI(): void {
        const claimingPoint = DataGameManager.claimingPoint || 0;
        this.lblClaimingPoint.string = `${claimingPoint}`;
        this.btnClaim.interactable = claimingPoint > 0;

    }
}

