import { _decorator, Component, Game, game } from "cc";
import { GameEvents } from "./GameEvents";
const { ccclass } = _decorator;

interface Listener {
    event: string;
    callback: (...args: any[]) => void;
    target?: any;
}

@ccclass("BaseComponent")
export class BaseComponent extends Component {
    private _listeners: Listener[] = [];
    private _focusEventsEnabled: boolean = false;

    protected start(): void {
        this.onDisplay();
    }
    protected enableFocusEvents() {
        if (this._focusEventsEnabled) return;
        this._focusEventsEnabled = true;

        game.on(Game.EVENT_HIDE, this._onLostFocus, this);
        game.on(Game.EVENT_SHOW, this._onGainFocus, this);
    }

    protected disableFocusEvents() {
        if (!this._focusEventsEnabled) return;
        this._focusEventsEnabled = false;

        game.off(Game.EVENT_HIDE, this._onLostFocus, this);
        game.off(Game.EVENT_SHOW, this._onGainFocus, this);
    }
    protected onLostFocus() {
        // Class con override khi cần
    }

    protected onGainFocus() {
        // Class con override khi cần
    }

    private _onLostFocus() {
        this.onLostFocus();
    }

    private _onGainFocus() {
        this.onGainFocus();
    }

    protected listen(event: string, callback: (...args: any[]) => void, target?: any) {
        GameEvents.on(event, callback, target ?? this);
        this._listeners.push({ event, callback, target: target ?? this });
    }

    protected emit(event: string, ...args: any[]) {
        GameEvents.emit(event, ...args);
    }

    protected onDisplay() {
        // Class con override khi cần
    }

    protected onDestroy() {
        for (const l of this._listeners) {
            GameEvents.off(l.event, l.callback, l.target);
        }
        this._listeners = [];

        this.disableFocusEvents();
    }
}
