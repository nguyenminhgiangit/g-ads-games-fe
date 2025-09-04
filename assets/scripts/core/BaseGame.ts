import { _decorator } from "cc";
import { BaseComponent } from "./BaseComponent";

const { ccclass } = _decorator;

@ccclass('BaseGame')
export abstract class BaseGame extends BaseComponent {
    protected rates: any = null;

    abstract getGameName(): string;

    async loadRates() {
        // this.rates = await RatesService.fetchRates(this.getGameName());
    }

    abstract initGame(): void;
}
