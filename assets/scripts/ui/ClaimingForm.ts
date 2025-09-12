import { _decorator, Button, Label, log } from 'cc';
import { BaseComponent } from '../core/BaseComponent';
import { DataGameManager } from '../managers/user.game.profile.manager';
import { gameReset } from '../services/game.service';
import { uiManager } from './UIManager';
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
        super.onLoad();
        this.enableFocusEvents()
    }

    // start() {
    //     super.start();
    //     uiManager().showClaimForm(false);
    // }

    protected onEnable(): void {
        this.onRefreshUI();
    }

    protected onGainFocus(): void {
        this.onRefreshUI();
    }

    onClaimClicked() {
        uiManager().showInputForm(true);
    }
    async onReplayClicked() {
        //call api
        const rs = await gameReset();
        // if (rs === true)
        //     uiManager().showClaimForm(false);
    }
    onCloseClicked() {
        uiManager().showClaimForm(false);
    }

    protected onRefreshUI() {
        const spinLeft = DataGameManager.spinLeft;
        const hasSpins = spinLeft > 0;
        this.btnContinue.node.active = hasSpins;

        const claimingPoint = DataGameManager.claimingPoint || 0;
        this.lblClaimingPoint.string = `${claimingPoint}`;
        this.btnClaim.interactable = claimingPoint > 0;

        const isNullData = DataGameManager.user == null;//DataGameManager.use null khi không login được, show popup khi onGain mà chưa onguest
        const isShow = !isNullData && (claimingPoint > 0 || spinLeft <= 0);
        uiManager().showClaimForm(isShow);
    }
}