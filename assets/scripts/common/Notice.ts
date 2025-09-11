import { _decorator, Component, Label, tween, Vec3, UIOpacity, Node } from 'cc';
import { Util } from '../utils/Util';
const { ccclass, property } = _decorator;

export enum NoticeType {
    CONFIRM,
    DANGEROUS_CONFIRM,
    NOTICE,
    NO_BUTTON,
}

@ccclass('Notice')
export class Notice extends Component {
    private static _instance: Notice;
    static getInstance(): Notice {
        return this._instance;
    }

    @property(Label)
    private title: Label = null;
    @property(Label)
    private content: Label = null;
    @property(Node)
    private btnNo: Node = null;
    @property(Node)
    private containerButtons: Node = null;
    @property(Node)
    private containerDangerousButtons: Node = null;

    private _cbFuncYes: Function = null;
    private _cbFuncNo: Function = null;

    private opacityComp: UIOpacity = null!;

    onLoad() {
        Notice._instance = this;

        // Đảm bảo node có UIOpacity
        this.opacityComp = this.getComponent(UIOpacity);
        if (!this.opacityComp) {
            this.opacityComp = this.addComponent(UIOpacity);
        }
        this.reset();
    }

    /** Reset về trạng thái ẩn */
    reset() {
        this.node.active = false;
        this.node.setScale(new Vec3(1, 1, 1));
        this.opacityComp.opacity = 0;
    }

    show(title: string, content: string, type: NoticeType, cbFuncYes: Function, cbFuncNo: Function) {
        this.title.string = title;
        this.content.string = content;
        const isNoButton = type === NoticeType.NO_BUTTON;
        const isConfirm = type === NoticeType.CONFIRM || type === NoticeType.DANGEROUS_CONFIRM;
        this.btnNo.active = isConfirm;
        const isDangerous = type == NoticeType.DANGEROUS_CONFIRM;

        this.containerButtons.active = !isNoButton && !isDangerous;
        this.containerDangerousButtons.active = !isNoButton && isDangerous;

        this._cbFuncYes = cbFuncYes;
        this._cbFuncNo = cbFuncNo;

        this.node.active = true;

        // Reset trạng thái trước khi play animation
        this.node.setScale(new Vec3(0.5, 0.5, 1));
        this.opacityComp.opacity = 0;

        tween(this.node)
            .to(0.3, { scale: new Vec3(1.2, 1.2, 1) }, { easing: 'backOut' })
            .start();

        tween(this.opacityComp)
            .to(0.3, { opacity: 255 })
            // .delay(1.0)
            // .to(0.5, { opacity: 0 })
            .start();
    }

    private hide() {
        tween(this.opacityComp)
            .to(0.5, { opacity: 0 })
            .call(() => {
                this.node.active = false;
            })
            .start();
    }

    private async onYesClicked(e, data) {
        if (this._cbFuncYes) {
            this._cbFuncYes();
        }
        await Util.Sleep(50);
        this.hide();
    }

    private async onNoClicked(e, data) {
        if (this._cbFuncNo) {
            this._cbFuncNo();
        }
        await Util.Sleep(50);
        this.hide();
    }
}
