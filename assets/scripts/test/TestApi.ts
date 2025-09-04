const API_URL = "https://script.google.com/macros/s/AKfycbyHdOT7JcqyQgVIGQkj8SX60U8u9XTCx0HWX7gJRXA3Whay0VNT-OLKYtSpAtDAWrJTOw/exec";

export class TestApi {
  static async sendData() {
    const username = "player01";
    const email = "player01@gmail.com";
    const phone = "0123456789";

    const url = `${API_URL}?username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log("Response from Google Apps Script:", data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }
}
