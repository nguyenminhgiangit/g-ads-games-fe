const API_URL = "https://script.google.com/macros/s/AKfycbyHdOT7JcqyQgVIGQkj8SX60U8u9XTCx0HWX7gJRXA3Whay0VNT-OLKYtSpAtDAWrJTOw/exec";
enum APIAction {
    SubmitPlayerInfo = "submitPlayerInfo",
    GetConfig = "getConfig",
    GetCurrentGameConfig = "getCurrentGameConfig"
}

export class API {
    static async submitPlayerInfo(username: string, email: string, phone: string) {
        console.log("Submitting player info:", username, email, phone);
        const _action = 'action=' + APIAction.SubmitPlayerInfo;
        const _username = 'username=' + encodeURIComponent(username);
        const _email = 'email=' + encodeURIComponent(email);
        const _phone = 'phone=' + encodeURIComponent(phone);
        const url = `${API_URL}?${_action}&${_username}&${_email}&${_phone}`;
        let data = null;
        try {
            const res = await fetch(url);
            data = await res.json();
        } catch (err) {
            console.error("Fetch error:", err);
        }
        return data;
    }
    /**
     * định bỏ qua
     * thêm biến game name vào current game config để gọi api 1 lần
     */
    static async _getConfig() {
        const _action = 'action=' + APIAction.GetConfig;
        const url = `${API_URL}?${_action}`;
        let data = null;
        try {
            const res = await fetch(url);
            data = await res.json();
        } catch (err) {
            console.error("Fetch error:", err);
        }
        return data;
    }
    static async getCurrentGameConfig() {
        const _action = 'action=' + APIAction.GetCurrentGameConfig;
        const url = `${API_URL}?${_action}`;
        let data = null;
        try {
            const res = await fetch(url);
            data = await res.json();
        } catch (err) {
            console.error("Fetch error:", err);
        }
        return data;
    }
    static async spinWheel(playerId: string = 'p-tester') {
        try {
            const resp = await fetch("http://localhost:3004/api/spin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ playerId }),
            });

            if (!resp.ok) {
                const error = await resp.json();
                console.error("Spin error:", error);
                return null;
            }

            const data = await resp.json();
            console.log("Spin result:", data);

            // 👉 data.index: index lát
            // 👉 data.value: giá trị lát
            // 👉 data.points: điểm được cộng
            // 👉 data.spinsLeft: lượt quay còn lại

            return data;
        } catch (err) {
            console.error("Network error:", err);
            return null;
        }
    }
}
