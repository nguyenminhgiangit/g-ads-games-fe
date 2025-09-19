import { _decorator, Button, Component, Label, Node } from 'cc';
const { ccclass, property } = _decorator;

export type PayloadPageControl = {
    pageSize: number;
    total: number;
    idxPage: number;
    cbFunc?: Function;
}

@ccclass('PageControl')
export class PageControl extends Component {
    @property(Button) private btnFirst: Button = null!;
    @property(Button) private btnPrev: Button = null!;
    @property(Button) private btnNext: Button = null!;
    @property(Button) private btnLast: Button = null!;
    @property(Label) private lblIndex: Label = null!;

    private callbackClicked: Function = null!;
    private totalItem: number = 0;
    private pageSize: number = 0;
    private curIdxPage: number = 0;// current index page - start from 1

    start() {

    }

    setPayload(payload: PayloadPageControl) {
        this.totalItem = payload.total;
        this.pageSize = payload.pageSize;
        this.curIdxPage = payload.idxPage;
        this.callbackClicked = payload.cbFunc;
        this.updateUI();
    }

    private updateUI() {
        const { totalItem, pageSize, curIdxPage, lblIndex } = this;
        const totalPage = this.getTotalPage(totalItem, pageSize);
        if (totalPage <= 1) {
            this.btnFirst.interactable = false;
            this.btnPrev.interactable = false;
            this.btnNext.interactable = false;
            this.btnLast.interactable = false;
        }
        else if (curIdxPage <= 1) {
            this.btnFirst.interactable = false;
            this.btnPrev.interactable = false;
            this.btnNext.interactable = true;
            this.btnLast.interactable = true;
        }
        else if (curIdxPage >= totalPage) {
            this.btnFirst.interactable = true;
            this.btnPrev.interactable = true;
            this.btnNext.interactable = false;
            this.btnLast.interactable = false;
        }
        else {
            this.btnFirst.interactable = true;
            this.btnPrev.interactable = true;
            this.btnNext.interactable = true;
            this.btnLast.interactable = true;
        }

        lblIndex.string = `${curIdxPage} / ${totalPage}`;
    }

    private onArrowClicked(envet: any, data: string) {
        const { callbackClicked, curIdxPage, totalItem, pageSize } = this;
        const totalPage = this.getTotalPage(totalItem, pageSize);
        let idxPageRequest = curIdxPage;
        switch (data) {
            case 'first':
                idxPageRequest = 0;
                break;
            case 'prev':
                idxPageRequest = curIdxPage - 1;
                break;
            case 'next':
                idxPageRequest = curIdxPage + 1;
                break;
            case 'last':
                idxPageRequest = totalPage;
                break;
            default:
                console.log('Something went wrong!');
        }
        if (callbackClicked) {
            callbackClicked({ idxPageRequest });
        }
    }

    private getTotalPage(totalItem: number, pageSize: number): number {
        const total = Number.isFinite(totalItem) && totalItem > 0 ? Math.floor(totalItem) : 0;
        const size = Number.isFinite(pageSize) && pageSize > 0 ? Math.floor(pageSize) : 1; // tránh chia cho 0
        return Math.max(1, Math.ceil(total / size));
    }

}

