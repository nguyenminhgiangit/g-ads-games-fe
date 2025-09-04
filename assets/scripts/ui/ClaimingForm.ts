import { _decorator, Button, Label } from 'cc';
import { UIManager } from './UIManager';
import { BaseComponent } from '../core/BaseComponent';
import { PlayerData } from '../managers/PlayerData';
import { EVENT_SPIN_UPDATE_DISPLAY } from '../core/GameEvents';
const { ccclass, property } = _decorator;

@ccclass('ClaimingForm')
export class ClaimingForm extends BaseComponent {
    @property(Label)
    private lblClaimingPoint: Label = null!;

    @property(Button)
    private btnContinue: Button = null!;

    @property(Button)
    private btnClaim: Button = null!;

    protected onLoad(): void {
        this.enableFocusEvents()
    }

    start() {
        super.start();
        UIManager.getInstance().showClaimForm(false);
        this.onGainFocus();
    }

    protected onEnable(): void {
        this.onDisplay();
    }

    protected onGainFocus(): void {
        const playerData = PlayerData.instance;
        if (playerData.spinsLeft <= 0) {
            UIManager.getInstance().showClaimForm(true);
        }
    }

    onClaimClicked() {
        console.log("Claim button clicked");
        UIManager.getInstance().showInputForm(true);
    }
    onReplayClicked() {
        PlayerData.instance.reset();
        this.emit(EVENT_SPIN_UPDATE_DISPLAY);

        UIManager.getInstance().showClaimForm(false);
    }
    onCloseClicked() {
        UIManager.getInstance().showClaimForm(false);
    }

    protected onDisplay() {
        const playerData = PlayerData.instance;
        const hasSpins = playerData.spinsLeft > 0;
        this.btnContinue.node.active = hasSpins;

        const claimingPoint = playerData.getClaimingPoint() || 0;
        this.lblClaimingPoint.string = `${claimingPoint}`;
        this.btnClaim.interactable = claimingPoint > 0;
    }
}