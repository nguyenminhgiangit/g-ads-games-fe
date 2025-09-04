import { _decorator, Color, Component, EditBox, Label, Node } from 'cc';
import { API } from '../network/API';
import { UIManager } from './UIManager';
import { PlayerData } from '../managers/PlayerData';
import { BaseComponent } from '../core/BaseComponent';
import { EVENT_SPIN_UPDATE_DISPLAY } from '../core/GameEvents';
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

    update(deltaTime: number) {

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
        UIManager.getInstance().showLoading(true);
        const res = await API.submitPlayerInfo(username, email, phone);
        console.log("Submit response:", res);
        this.showNotify(res?.message);
        UIManager.getInstance().showLoading(false);
        UIManager.getInstance().showToast(res?.message || "Submit info failed");

        if (res?.success) {
            this.reset();
            UIManager.getInstance().showInputForm(false);
            UIManager.getInstance().showClaimForm(false);

            PlayerData.instance.reset();
            this.emit(EVENT_SPIN_UPDATE_DISPLAY);
        }
    }
    onCancelClicked() {
        this.reset();
        UIManager.getInstance().showInputForm(false);
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