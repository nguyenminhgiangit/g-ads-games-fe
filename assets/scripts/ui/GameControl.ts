import { _decorator, Component, Node } from 'cc';
import { clientApi } from '../network/client.api';
import { uiManager } from './UIManager';
import { ActivityPopup } from './ActivityPopup';
import { Util } from '../utils/Util';
const { ccclass, property } = _decorator;

@ccclass('GameControl')
export class GameControl extends Component {
    start() {

    }

    private clicked: boolean = false;
    async onMenuClick() {
        if (this.clicked === true) {
            return;
        }
        this.clicked = true;
        // const resp = await clientApi.game.activities(
        //     {
        //         gameId: 'wheel',
        //         // type: 'all',
        //         // page: 2,
        //         // pageSize: 3
        //     }
        // );
        // console.log('Menu resp:: ', resp);
        // const count = resp.data?.activities?.length ?? 0;
        // const message = count == 0 ? 'You you have no activity.' : `You have ${count} activities.`;
        // uiManager().showToast(message);
        uiManager().showLoading(true);
        await ActivityPopup.getInstance().getActivities();
        uiManager().showLoading(false);
        this.clicked = false;
    }
}

