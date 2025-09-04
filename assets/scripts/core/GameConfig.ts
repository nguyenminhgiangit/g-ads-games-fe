import { API } from "../network/API";

export interface GlobalConfig {
    currentGame: string;
    minScore?: number;
    maxSpins?: number;
}
const DefaultGame = "WheelGame";

export class GameConfig {
    static data: GlobalConfig = {
        currentGame: DefaultGame
    };

    static async fetchFromServer(): Promise<GlobalConfig> {
        return this.data; //for testing
        // const res = await API.getCurrentGameConfig();
        // console.log("Fetched game config:", res);
        // if (res) {
        //     this.data.currentGame = res.game ?? DefaultGame;
        // }
        // return this.data;
    }
}
