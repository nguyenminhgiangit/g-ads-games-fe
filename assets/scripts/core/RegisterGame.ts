import { GameRegistry } from "./GameRegistry";

export function registerGame(name: string) {
  return function (constructor: Function) {
    GameRegistry.register(name, constructor);
  };
}
