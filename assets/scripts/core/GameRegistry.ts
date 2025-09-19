import { log } from "cc";

export class GameRegistry {
  private static games: Map<string, any> = new Map();

  static register(name: string, ctor: any) {
    this.games.set(name, ctor);
    log(`✅ Registered game: ${name}`);
  }

  static get(name: string) {
    return this.games.get(name);
  }

  static list() {
    return Array.from(this.games.keys());
  }
}
