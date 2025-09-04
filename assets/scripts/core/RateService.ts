/**
 * RatesService: load tỉ lệ cho từng game
 * - gameName: WheelGame, SlotMachine…
 * - trả về mảng số (tỉ lệ hoặc weight cho random)
 */
export class RatesService {
    static async fetchRates(gameName: string): Promise<number[]> {
        const url = `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=rates&game=${gameName}`;
        try {
            const res = await fetch(url);
            const json = await res.json();
            return json.rates || [];
        } catch (err) {
            console.error("Fetch rates failed for", gameName, err);
            return [];
        }
    }
}
