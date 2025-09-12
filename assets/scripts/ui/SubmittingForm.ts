import { _decorator, Color, EditBox, Label } from 'cc';
import { uiManager } from './UIManager';
import { BaseComponent } from '../core/BaseComponent';
import { DataGameManager } from '../managers/user.game.profile.manager';
import { clientApi } from '../network/client.api';
import { SubmittingPayload } from '../../types/api.type';
const { ccclass, property } = _decorator;

@ccclass('SubmittingForm')
export class SubmittingForm extends BaseComponent {
    @property(EditBox)
    usernameInput: EditBox | null = null;
    @property(EditBox)
    emailInput: EditBox | null = null;
    @property(EditBox)
    phoneInput: EditBox | null = null;
    @property(Label)
    notifyLabel: Label | null = null;

    start() {
        this.reset();
    }

    async onSubmitClicked() {
        console.log("Submit button clicked");

        const username = this.usernameInput?.string || '';
        const email = this.emailInput?.string || '';
        const phone = this.phoneInput?.string || '';
        if (!email && !phone) {
            this.showNotify("Please fill email and phone", true);
            console.warn("Please fill in all fields");
            return;
        }
        uiManager().showLoading(true);

        const claimingPoint = DataGameManager.claimingPoint;
        if (claimingPoint <= 0) {
            this.showNotify("You are not enough score to claim now", true);
            return;
        }

        const payload: SubmittingPayload = {
            claimedPoint: claimingPoint,
            username,
            email,
            phone
        };
        const resp = await clientApi.game.submitInfo(payload);
        if (resp.ok === false) {
            this.showNotify(resp.error);
        }
        else {
            //update state
            const newState = resp.state;
            DataGameManager.stateApply(newState);

            uiManager().showToast(resp.message);
            this.reset();
            uiManager().showInputForm(false);
            uiManager().showClaimForm(false);
        }
        uiManager().showLoading(false);
    }
    onCancelClicked() {
        this.reset();
        uiManager().showInputForm(false);
    }
    reset() {
        if (this.usernameInput) this.usernameInput.string = "";
        if (this.emailInput) this.emailInput.string = "";
        if (this.phoneInput) this.phoneInput.string = "";
        if (this.notifyLabel) this.notifyLabel.string = "";
    }
    showNotify(message: string, isError: boolean = false) {
        if (this.notifyLabel && message) {
            this.notifyLabel.string = message;
            this.notifyLabel.color = isError ? new Color(177, 77, 77) : new Color(255, 255, 255);
        }
    }
}