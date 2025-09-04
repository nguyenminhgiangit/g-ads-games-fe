import { _decorator, Game, game, Node, tween, v3, Vec3 } from "cc";
import { BaseGame } from "../core/BaseGame";
import { registerGame } from "../core/RegisterGame";
import { Wheel } from "./wheel/Wheel";
import { PlayerData } from "../managers/PlayerData";
import { EVENT_SPIN_RESULT, EVENT_SPIN_UPDATE_DISPLAY } from "../core/GameEvents";
import { UIManager } from "../ui/UIManager";
import { PulseEffect } from "../common/PulseEffect";
import { Util } from "../utils/Util";
import { API } from "../network/API";

const { ccclass, property } = _decorator;

@ccclass('WheelGame')
@registerGame("WheelGame")
export class WheelGame extends BaseGame {
    @property(Node) wheelContainer: Node | null = null;        // WheelRoot
    @property(Wheel) wheel: Wheel | null = null;

    @property(PulseEffect) pointer: PulseEffect | null = null; // Pointer

    @property slices: number = 12;        // số lát

    private values: number[] = [];
    private currentRotation: number = 0;
    private isSpinning: boolean = false;


    private lastTickIndex: number = -1;
    private sliceAngle: number = 0;

    protected onLoad(): void {
        this.listen(EVENT_SPIN_UPDATE_DISPLAY, () => {
            this.onDisplay();
        });
    }

    getGameName(): string {
        return "WheelGame";
    }

    initGame(): void {
        console.log("WheelGame started with rates:", this.rates);

        // 1..12 rồi xáo trộn
        this.values = Array.from({ length: this.slices }, (_, i) => i + 1);
        this.shuffle(this.values);
        this.sliceAngle = 360 / this.values.length;

        this.wheel.init(this.values);
    }

    private shuffle(arr: number[]) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    protected onDisplay(): void {
        this.spinState();
    }

    private spinState() {
        const playerData = PlayerData.instance;
        const hasSpins = playerData.spinsLeft > 0;
        const isEffect = hasSpins && !this.isSpinning;
        if (isEffect) {
            this.pointer.startPulse();
        }
        else {
            this.pointer.stopPulse();
        }
    }


    private async onSpin() {
        if (this.isSpinning) {
            console.log("Đang quay, vui lòng chờ...");
            return;
        }
        this.isSpinning = true;

        // const resp = await API.spinWheel();
        // console.log('Spin result from server:', resp);

        const playerData = PlayerData.instance;
        if (playerData.spinsLeft <= 0) {
            UIManager.getInstance().showToast("Out of spins!");
            return;
        }
        playerData.decreaseSpins();
        this.emit(EVENT_SPIN_UPDATE_DISPLAY);

        const randomIndex = Math.floor(Math.random() * this.values.length);
        // const index = resp?.result?.value ?? randomIndex;
        // console.log("Quay tới index:", index, "value:", this.values[index]);
        this.animateWheel(randomIndex);
    }
    private animateWheel(index: number) {
        // Reset tick
        this.lastTickIndex = -1;

        // Ngẫu nhiên lệch trong lát (từ 20% đến 80% lát, tránh quá sát biên)
        const randomOffset = this.sliceAngle * (0.2 + Math.random() * 0.6);

        // Lấy góc hiện tại (0 - 360)
        let currentAngle = this.wheelContainer.eulerAngles.z % 360;
        // Quay nhiều vòng + dừng đúng kết quả
        const finalAngle = currentAngle + 360 * 5 + (index * this.sliceAngle + randomOffset) - 90;

        this.currentRotation += finalAngle; // cộng dồn để lần sau quay tiếp


        // Cho nó vượt thêm 10 độ (như bị trôi qua chốt)
        const overshootAngle = this.currentRotation + 10;
        this.lastTickIndex = -1;
        tween(this.wheelContainer)
            // Quay tới overshoot, giảm tốc
            .to(5, { eulerAngles: new Vec3(0, 0, -overshootAngle) }, { easing: 'quartOut' })
            // Quay ngược lại target, nhanh hơn (bật lại)
            .to(0.3, { eulerAngles: new Vec3(0, 0, -this.currentRotation) }, { easing: 'quadOut' })
            .delay(1.0)
            .call(() => {
                console.log("🎯 Kết quả:", this.values[index]);
                this.onResult(this.values[index]);
            })
            .start();
    }

    private async onResult(result: number) {
        await Util.Sleep(500);
        this.isSpinning = false;
        // Xử lý kết quả quay
        console.log("Show result:: ", result);

        const playerData = PlayerData.instance;
        playerData.increaseScore(result);
        this.emit(EVENT_SPIN_UPDATE_DISPLAY);

        const hasSpins = playerData.spinsLeft > 0;
        const claimingPoint = playerData.getClaimingPoint() || 0;
        if (!hasSpins || claimingPoint > 0) {
            UIManager.getInstance().showClaimForm(true);
        }
    }

    update(dt: number) {
        if (!this.isSpinning) return;
        this.checkTick();
    }

    private checkTick() {
        const angle = (this.wheelContainer.eulerAngles.z % 360 + 360) % 360;
        const tickIndex = Math.floor(angle / this.sliceAngle);

        if (tickIndex !== this.lastTickIndex) {
            this.lastTickIndex = tickIndex;

            // play effect Âm thanh
            // if (this.tickSound) {
            //     this.tickSound.playOneShot(this.tickSound.clip, 1);
            // }


            // Rung pointer
            if (this.pointer) {
                tween(this.pointer.node)
                    .to(0.05, { eulerAngles: new Vec3(0, 0, -15) })
                    .to(0.05, { eulerAngles: new Vec3(0, 0, 0) })
                    .start();
            }
        }
    }

}

