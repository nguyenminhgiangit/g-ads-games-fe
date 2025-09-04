import { _decorator, Button, Label } from 'cc';
import { UIManager } from './UIManager';
import { BaseComponent } from '../core/BaseComponent';
import { EVENT_SPIN_RESULT, EVENT_SPIN_UPDATE_DISPLAY } from '../core/GameEvents';
import { PlayerData } from '../managers/PlayerData';
const { ccclass, property } = _decorator;

@ccclass('ClaimingInfo')
export class ClaimingInfo extends BaseComponent {
    @property(Label)
    private lblClaimingPoint: Label = null!;

    @property(Button)
    private btnClaim: Button = null!;

    protected onLoad(): void {
        this.listen(EVENT_SPIN_UPDATE_DISPLAY, () => {
            this.onDisplay();
        });
    }

    onClaimClicked() {
        console.log("Claim button clicked");
        UIManager.getInstance().showClaimForm(true);
    }
    protected onDisplay(): void {
        const playerData = PlayerData.instance;
        const claimingPoint = playerData.getClaimingPoint() || 0;
        this.lblClaimingPoint.string = `${claimingPoint}`;
        this.btnClaim.interactable = claimingPoint > 0;

    }
}

