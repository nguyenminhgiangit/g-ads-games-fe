import { _decorator, Label, Node } from 'cc';
import { BaseComponent } from '../core/BaseComponent';
const { ccclass, property } = _decorator;

@ccclass('ClaimingItem')
export class ClaimingItem extends BaseComponent {
    @property(Label) lblClaimingPoint: Label = null!;
    @property(Label) lblClaimingItem: Label = null!;
    @property(Node) canClaiming: Node = null!;


    protected onRefreshUI(): void {
    }

    public init(milestone: number, item: string) {
        this.lblClaimingPoint.string = `${milestone}`;
        this.lblClaimingItem.string = item;
        this.canClaim(false);
    }

    public canClaim(can: boolean) {
        this.canClaiming.active = can;
    }

}

