import { _decorator, Node, tween, Vec3 } from "cc";
import { BaseGame } from "../core/BaseGame";
import { registerGame } from "../core/RegisterGame";
import { Wheel } from "./wheel/Wheel";
import { PulseEffect } from "../common/PulseEffect";
import { Util } from "../utils/Util";
import { DataGameManager } from "../managers/user.game.profile.manager";
import { GameState, WheelPiece } from "../../types/api.type";
import { clientApi } from "../network/client.api";
import { indexOfPieceByKey } from "../helpers/game.helper";
import { DataChangeType, EVENT_FORCE_DISPLAY, EVENT_SPIN_UPDATE_DISPLAY } from "../core/GameEvents";
import { uiManager } from "../ui/UIManager";

const { ccclass, property } = _decorator;

@ccclass('WheelGame')
@registerGame("WheelGame")
export class WheelGame extends BaseGame {
    @property(Node) wheelContainer: Node | null = null;        // WheelRoot
    @property(Wheel) wheel: Wheel | null = null;

    @property(PulseEffect) pointer: PulseEffect | null = null; // Pointer

    @property slices: number = 12;        // số lát

    // private values: number[] = [];
    private currentRotation: number = 0;
    private isSpinning: boolean = false;


    private lastTickIndex: number = -1;
    private sliceAngle: number = 0;

    getGameName(): string {
        return "WheelGame";
    }

    get Pieces(): Array<WheelPiece> {
        return DataGameManager.game.pieces;
    }

    async initGame() {
        // const resp = await API.loadWheelLayout();

        const pieces = this.Pieces;
        // this.values = pieces?.map(p => p.reward) ?? null;

        // console.log('Wheel start with:', this.values);

        // if (!this.values || this.values.length === 0) {
        //     console.log("No layout from server, use default");
        //     // 1..12 rồi xáo trộn
        //     this.values = Array.from({ length: this.slices }, (_, i) => i + 1);
        //     this.shuffle(this.values);
        // }

        this.sliceAngle = 360 / pieces.length;

        this.wheel.init();
    }

    // private shuffle(arr: number[]) {
    //     for (let i = arr.length - 1; i > 0; i--) {
    //         const j = Math.floor(Math.random() * (i + 1));
    //         [arr[i], arr[j]] = [arr[j], arr[i]];
    //     }
    // }

    protected onRefreshUI(): void {
        this.spinState();
    }

    private spinState() {
        const spinLeft = DataGameManager.spinLeft;
        const hasSpins = spinLeft > 0;
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
        const spinLeft = DataGameManager.spinLeft;
        if (spinLeft <= 0) {
            uiManager().showToast("Out of spins!");
            return;
        }

        this.isSpinning = true;

        const gameId = DataGameManager.gameId;
        const resp = await clientApi.game.spin({ gameId });
        console.log('Spin result from server:', resp);
        if (resp.ok === false) {
            console.log('Cannot get result key: ', resp.error);
            this.isSpinning = false;
            uiManager().showToast(resp.error);
            return;
        }
        const keyResult = resp.key;
        const state = resp.state;
        //chỉ force hiển thị lại thông tin spinLeft, chưa update vào data
        this.emit(EVENT_FORCE_DISPLAY, { type: DataChangeType.SPIN_LEFT, spinLeft: state.spinLeft });
        //update spinLeft trước, score chờ xong animation mới update tiếp
        // DataGameManager.stateApply({ spinLeft: state.spinLeft, score: oldScore });
        const pieces = this.Pieces;
        const index = indexOfPieceByKey(pieces, keyResult);
        console.log("Quay tới index:", index);
        this.animateWheel(index, state);
    }
    private animateWheel(index: number, state: GameState) {
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
        const pieces = this.Pieces;
        const resultValue = pieces[index].reward;

        tween(this.wheelContainer)
            // Quay tới overshoot, giảm tốc
            .to(5, { eulerAngles: new Vec3(0, 0, -overshootAngle) }, { easing: 'quartOut' })
            // Quay ngược lại target, nhanh hơn (bật lại)
            .to(0.3, { eulerAngles: new Vec3(0, 0, -this.currentRotation) }, { easing: 'quadOut' })
            .delay(1.0)
            .call(() => {
                console.log("🎯 Kết quả:", resultValue);
                this.onResult(index, state);
            })
            .start();
    }

    private async onResult(index: number, state: GameState) {
        await Util.Sleep(500);
        this.isSpinning = false;
        DataGameManager.stateApply(state);

        const pieces = this.Pieces;
        const result = pieces[index].reward;

        // Xử lý kết quả quay
        console.log("Show result:: ", result);

        const hasSpins = state.spinLeft > 0;
        const claimingPoint = DataGameManager.claimingPoint || 0;
        if (!hasSpins || claimingPoint > 0) {
            uiManager().showClaimForm(true);
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

