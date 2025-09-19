import { _decorator, Component, Label, tween, Vec3, UIOpacity, Node, Prefab, instantiate } from 'cc';
import { Util } from '../utils/Util';
import { clientApi } from '../network/client.api';
import { Toast } from '../common/Toast';
import { ActivitiesResponse, Activity } from '../../types/activity.type';
import { ActivityItem } from './ActivityItem';
import { PageControl, PayloadPageControl } from './PageControl';
const { ccclass, property } = _decorator;

const PAGE_SIZE = 2;
const DEFAULT_PAGE_SIZE_MIN = 1;
const DEFAULT_PAGE_SIZE_MAX = 200;
const DEFAULT_INDEX_PAGE = DEFAULT_PAGE_SIZE_MIN;

@ccclass('ActivityPopup')
export class ActivityPopup extends Component {
    private static _instance: ActivityPopup;
    static getInstance(): ActivityPopup {
        return this._instance;
    }
    private opacityComp: UIOpacity = null!;

    @property(Node)
    private containerItem: Node = null!;
    @property(Prefab)
    private pfItem: Prefab = null!;
    @property(PageControl)
    private pageControl: PageControl = null!;

    onLoad() {
        ActivityPopup._instance = this;

        // Đảm bảo node có UIOpacity
        this.opacityComp = this.getComponent(UIOpacity);
        if (!this.opacityComp) {
            this.opacityComp = this.addComponent(UIOpacity);
        }
        this.onInitUI();
        this.reset();
    }

    // protected start(): void {
    //     this.onInitUI();
    // }

    private async onInitUI() {
        const { containerItem, pfItem } = this;
        containerItem.removeAllChildren();
        if (!containerItem || !pfItem) return;

        for (let i = 0; i < PAGE_SIZE; i++) {
            const _node = instantiate(pfItem);
            _node.parent = containerItem;
        }
    }

    /** Reset về trạng thái ẩn */
    reset() {
        console.log('reset ... ');
        this.node.active = false;
        this.node.setScale(new Vec3(1, 1, 1));
        this.opacityComp.opacity = 0;
    }

    show(_show: boolean = true) {
        console.log('show ... ', _show);
        if (_show === false) {
            this.hide();
            return;
        }
        console.log('show ... ');
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

    updateData(data: ActivitiesResponse) {
        const activities = data.activities ?? [];
        const { containerItem, pageControl } = this;
        const lengthData = activities.length;

        const itemNodes = containerItem.getComponentsInChildren(ActivityItem);
        const lengthNode = itemNodes.length;
        const maxItem = Math.min(lengthData, lengthNode);

        //activities
        for (let i = 0; i < lengthNode; i++) {
            const _item = itemNodes[i];
            _item.hide(i >= maxItem);
            const activity = i < maxItem ? activities[i] : null;
            if (activity) _item.setActivity(activity);
        }

        //page control
        const total = data.total ?? 0;
        const idxPage = data.page ?? DEFAULT_INDEX_PAGE;
        const cbFunc: Function = this.callbackFromPageControl.bind(this);
        const payload = {
            pageSize: PAGE_SIZE,
            total,
            idxPage,
            cbFunc
        } as PayloadPageControl;
        pageControl.setPayload(payload);
    }

    private hide() {
        tween(this.opacityComp)
            .to(0.5, { opacity: 0 })
            .call(() => {
                this.node.active = false;
            })
            .start();
    }

    private async onCloseClicked(e, data) {
        await Util.Sleep(50);
        this.hide();
    }

    public async getActivities(isRequestShow: boolean = true, idxPage: number = DEFAULT_INDEX_PAGE) {
        const resp = await clientApi.game.activities(
            {
                gameId: 'wheel',
                type: 'all',
                page: idxPage,
                pageSize: PAGE_SIZE
            }
        );
        console.log('activities resp:: ', resp);
        const activities = resp.data?.activities ?? [];
        const count = activities.length;
        if (count == 0) {
            Toast.getInstance().show('You you have no activity.');
            return;
        }

        if (isRequestShow === true)
            this.show(true);
        this.updateData(resp.data);
    }
    private callbackFromPageControl(data: any) {
        const { idxPageRequest } = data;
        this.getActivities(false, idxPageRequest);
    }
}
