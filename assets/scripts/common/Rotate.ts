import { _decorator, Component, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('rotate')
export class rotate extends Component {
    start() {

    }
    protected onEnable(): void {
        tween(this.node)
            .stop()
            .repeatForever(tween().by(1.0, { angle: -360 }))
            .start()
    }
}

