const DEVICE_ID_KEY = "__uuid";

/** Lấy UUID thiết bị, nếu chưa có thì tạo mới rồi lưu localStorage */
export function getUUID(): string {
    const existed = localStorage.getItem(DEVICE_ID_KEY);
    if (existed) return existed;

    const uuid = cryptoRandomUUID();
    localStorage.setItem(DEVICE_ID_KEY, uuid);
    return uuid;
}

/** RFC4122 v4 – dùng crypto nếu có, fallback nếu runtime cũ */
function cryptoRandomUUID(): string {
    const g = globalThis as any;
    if (g.crypto && g.crypto.randomUUID) return g.crypto.randomUUID();

    // Fallback: tự gen v4
    const rnd = new Uint8Array(16);
    if (g.crypto && g.crypto.getRandomValues) {
        g.crypto.getRandomValues(rnd);
    } else {
        for (let i = 0; i < 16; i++) rnd[i] = (Math.random() * 256) | 0;
    }
    rnd[6] = (rnd[6] & 0x0f) | 0x40; // version 4
    rnd[8] = (rnd[8] & 0x3f) | 0x80; // variant
    const hex = Array.from(rnd).map((b) => b.toString(16).padStart(2, "0"));
    return `${hex[0]}${hex[1]}${hex[2]}${hex[3]}-${hex[4]}${hex[5]}-${hex[6]}${hex[7]}-${hex[8]}${hex[9]}-${hex[10]}${hex[11]}${hex[12]}${hex[13]}${hex[14]}${hex[15]}`;
}
