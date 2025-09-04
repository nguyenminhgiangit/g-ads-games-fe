import { _decorator, Component, Label, tween, Vec3, UIOpacity } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Toast')
export class Toast extends Component {
    private static _instance: Toast;

    static getInstance(): Toast {
        return this._instance;
    }

    @property(Label)
    messageLabel: Label = null!;

    private opacityComp: UIOpacity = null!;

    onLoad() {
        Toast._instance = this;

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

    /** Hiện toast với message */
    show(message: string) {
        if (!this.messageLabel) return;

        this.messageLabel.string = message;
        this.node.active = true;

        // Reset trạng thái trước khi play animation
        this.node.setScale(new Vec3(0.5, 0.5, 1));
        this.opacityComp.opacity = 0;

        tween(this.node)
            .to(0.3, { scale: new Vec3(1.2, 1.2, 1) }, { easing: 'backOut' })
            .start();

        tween(this.opacityComp)
            .to(0.3, { opacity: 255 })
            .delay(1.0)
            .to(0.5, { opacity: 0 })
            .start();


    }
}
