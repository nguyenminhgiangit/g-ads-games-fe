import { EventTarget } from "cc";

export const GameEvents = new EventTarget();

// Định nghĩa các event để dễ quản lý
export const EVENT_SPIN_RESULT = "spin-result";
export const EVENT_SPIN_RESTART = "spin-restart";
export const EVENT_SPIN_UPDATE_DISPLAY = "spin-update-display";
