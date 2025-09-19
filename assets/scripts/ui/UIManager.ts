import { _decorator, Component, Node } from 'cc';
import { Toast } from '../common/Toast';
import { Notice, NoticeType } from '../common/Notice';
import { ActivityPopup } from './ActivityPopup';

const { ccclass, property } = _decorator;

@ccclass('UIManager')
class UIManager extends Component {
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

    @property(Node)
    noticeLayer: Node = null!;

    @property(Node)
    popupLayer: Node = null!;

    onLoad() {
        UIManager.instance = this;

        this.showLoading(true);
        this.showInputForm(false);

        this.toastLayer.active = true;
        this.noticeLayer.active = true;
        this.popupLayer.active = true;
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

    showNotice(
        title: string,
        content: string,
        type: NoticeType = NoticeType.NOTICE,
        cbFuncYes?: Function,
        cbFuncNo?: Function
    ) {
        Notice.getInstance().show(title, content, type, cbFuncYes, cbFuncNo);
    }

    showActivityPopup(show: boolean) {
        ActivityPopup.getInstance().show(show);
    }
}
export function uiManager() {
    return UIManager.getInstance()
}
