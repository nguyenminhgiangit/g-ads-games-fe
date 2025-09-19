import { _decorator, Component, Label, Node } from 'cc';
import { Activity } from '../../types/activity.type';
const { ccclass, property } = _decorator;

@ccclass('ActivityItem')
export class ActivityItem extends Component {
    @property(Node) private container: Node = null!;
    @property(Label) private lblType: Label = null!;
    @property(Label) private lblDate: Label = null!;
    @property(Label) private lblScore: Label = null!;
    @property(Label) private lblSpinLeft: Label = null!;
    start() {

    }

    setActivity(activity: Activity) {
        const { lblType, lblDate, lblScore, lblSpinLeft } = this;
        const reward = activity.payload?.rewardId ?? '';
        lblType.string = `${activity.type.toLocaleUpperCase()} ${reward}`;
        lblDate.string = activity.createdAt ?? '';
        const bfScore = activity.before?.score ?? 0;
        const bfSpinLeft = activity.before?.spinLeft ?? 0;
        const afScore = activity.after.score ?? 0;
        const afSpinLeft = activity.after?.spinLeft ?? 0;
        lblScore.string = `${bfScore.toString()} - ${afScore.toString()}`;
        lblSpinLeft.string = `${bfSpinLeft.toString()} - ${afSpinLeft.toString()}`;
    }

    //for un-used case
    hide(hidden: boolean) {
        const { container } = this;
        container.active = !hidden;
    }
}

