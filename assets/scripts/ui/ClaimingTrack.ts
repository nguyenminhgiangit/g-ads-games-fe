import { _decorator, instantiate, Node, Prefab, ProgressBar, UITransform } from 'cc';
import { BaseComponent } from '../core/BaseComponent';
import { DataGameManager } from '../managers/user.game.profile.manager';
const { ccclass, property } = _decorator;

@ccclass('ClaimingTrack')
export class ClaimingTrack extends BaseComponent {
    @property(ProgressBar) progressBar: ProgressBar = null!;
    @property(Node) trackContent: Node = null!;
    @property(Prefab) trackPrefab: Prefab = null!;

    protected onLoad(): void {
        super.onLoad();
        this.initUI();
    }
    protected start(): void {
        this.initUI();
        super.start();
    }

    initUI() {
        // const itemsToClaim: string[] = ["📱", "🛵", "🚗"];
        const claimMilestones = DataGameManager.claimMilestones;
        const valuesToClaim = claimMilestones.map(m => m.reward);
        const minValue = valuesToClaim[0] || 1;
        const maxValue = valuesToClaim[valuesToClaim.length - 1] || 1;

        this.trackContent.removeAllChildren();
        valuesToClaim.forEach((milestone, index) => {
            const itemNode = instantiate(this.trackPrefab);
            const itemComp = itemNode.getComponent('ClaimingItem') as any;
            itemComp.init(milestone, claimMilestones[index].label || "🎁");
            this.trackContent.addChild(itemNode);

            //position x
            const widthBar = this.progressBar.node.getComponent(UITransform)!.width;
            const x = (milestone - minValue) / (maxValue - minValue) * widthBar;
            itemNode.setPosition(x, 0, 0);
        });
    }
    protected onRefreshUI(): void {
        const claimingPoint = DataGameManager.claimingPoint || 0;
        const claimMilestones = DataGameManager.valueClaimMilestones || [];

        //update milestones state
        for (let i = 0; i < claimMilestones.length; i++) {
            const milestone = claimMilestones[i];
            const itemNode = this.trackContent.children[i];
            const itemComp = itemNode.getComponent('ClaimingItem') as any;
            itemComp.canClaim(claimingPoint >= milestone);
        }

        //bar progress
        this.progressBar.progress = this.progress;
    }

    private get progress(): number {
        const claimingPoint = DataGameManager.claimingPoint || 0;
        if (claimingPoint <= 0) return 0;
        const claimMilestones = DataGameManager.valueClaimMilestones || [];
        if (claimingPoint < claimMilestones[0]) return 0;

        for (let i = 0; i < claimMilestones.length; i++) {
            const current = claimMilestones[i];
            const next = claimMilestones[i + 1];

            if (!next) return 1;

            if (claimingPoint >= current && claimingPoint < next) {
                const range = next - current;
                const progressInRange = (claimingPoint - current) / range;
                const baseProgress = i / (claimMilestones.length - 1);
                const segmentLength = 1 / (claimMilestones.length - 1);
                return baseProgress + progressInRange * segmentLength;
            }
        }

        return 1;
    }

}

