import { _decorator } from "cc";
import { BaseGame } from "../core/BaseGame";
import { registerGame } from "../core/RegisterGame";

const { ccclass } = _decorator;

@ccclass('SlotMachine')
@registerGame("SlotMachine")
export class SlotMachine extends BaseGame {

    getGameName(): string {
        return "SlotMachine";
    }

    initGame(): void {
        console.log("SlotMachine started with rates:", this.rates);
    }
}
