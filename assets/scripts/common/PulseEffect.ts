
import { _decorator, Component, Node, tween, Vec3, Tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PulseEffect')
export class PulseEffect extends Component {
    @property(Node)
    targetNode: Node | null = null;

    private _pulseTween: Tween<Node> | null = null;

    onLoad() {
        if (!this.targetNode) {
            this.targetNode = this.node; // mặc định gắn vào chính node
        }
    }

    startPulse() {
        if (!this.targetNode || this._pulseTween) return;

        this.targetNode.setScale(new Vec3(1, 1, 1));

        this._pulseTween = tween(this.targetNode)
            .repeatForever(
                tween()
                    .to(0.6, { scale: new Vec3(1.15, 1.15, 1) })
                    .to(0.6, { scale: new Vec3(1, 1, 1) })
            )
            .start();
    }

    stopPulse() {
        if (this._pulseTween) {
            this._pulseTween.stop();
            this._pulseTween = null;
        }

        if (this.targetNode) {
            this.targetNode.setScale(new Vec3(1, 1, 1)); // reset scale về gốc
        }
    }

    onDisable() {
        this.stopPulse(); // tránh memory leak khi node bị disable/destroy
    }
}
