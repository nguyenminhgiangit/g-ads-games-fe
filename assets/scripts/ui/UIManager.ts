import { _decorator, Component, Node } from 'cc';
import { Toast } from '../common/Toast';

const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
    private static instance: UIManager;

    public static getInstance(): UIManager {
        return this.instance;
    }

    @property(Node)
    inputLayer: Node = null!;

    @property(Node)
    claimLayer: Node = null!;

    @property(Node)
    loadingLayer: Node = null!;

    @property(Node)
    toastLayer: Node = null!;

    onLoad() {
        UIManager.instance = this;

        this.showLoading(true);
        this.showInputForm(false);

        this.toastLayer.active = true;
    }

    showLoading(show: boolean) {
        this.loadingLayer.active = show;
    }

    showInputForm(show: boolean) {
        this.inputLayer.active = show;
    }

    showClaimForm(show: boolean) {
        this.claimLayer.active = show;
    }

    showToast(message: string) {
        Toast.getInstance().show(message);
    }
}
