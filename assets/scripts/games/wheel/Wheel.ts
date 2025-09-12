// Wheel.ts
import {
    _decorator,
    Component,
    Graphics,
    Color,
    Label,
    Node,
    UITransform,
    Vec3,
} from 'cc';
import { WheelPiece } from 'db://assets/types/api.type';
import { DataGameManager } from '../../managers/user.game.profile.manager';
const { ccclass, property } = _decorator;

@ccclass('Wheel')
export class Wheel extends Component {
    @property(Graphics)
    public g: Graphics = null!;

    @property
    public radius: number = 200;

    // private colors: Color[] = [];

    private get Pieces(): Array<WheelPiece> {
        return DataGameManager.game.pieces;
    }

    /**
     * Khởi tạo bánh xe với danh sách giá trị (strings hoặc numbers)
     */
    public init() {
        const pieces = this.Pieces;

        // sinh màu cho từng lát (phân bố hue đều)
        // this.colors = [];
        // const n = pieces.length;
        // for (let i = 0; i < n; i++) {
        //     const hue = (i * 360) / n;
        //     const colorNum = this.hsvToRgb(hue, 0.55, 0.95);
        //     this.colors.push(colorNum);
        // }

        // xoá label cũ (chỉ xoá node con có Label để giữ Graphics trên node chính)
        for (let i = this.node.children.length - 1; i >= 0; i--) {
            const c = this.node.children[i];
            if (c.getComponent(Label)) {
                c.destroy();
            }
        }

        // vẽ lại bánh xe
        this.drawWheel();
    }

    private drawWheel() {
        const pieces = this.Pieces;
        if (!this.g || pieces.length === 0) return;

        // const g = this.g;
        // g.clear();

        const n = pieces.length;
        const sliceAngle = (2 * Math.PI) / n;

        for (let i = 0; i < n; i++) {
            const startAngle = i * sliceAngle;
            const endAngle = (i + 1) * sliceAngle;

            // vẽ lát: moveTo -> arc -> lineTo -> fill
            // g.moveTo(0, 0);
            // g.arc(0, 0, this.radius, startAngle, endAngle, false); // counterclockwise = false
            // g.lineTo(0, 0);

            // set color và fill cho từng lát
            // g.fillColor = this.colors[i];
            // g.fill();

            // ---- tạo label cho lát ----
            const midAngle = (startAngle + endAngle) / 2; // rad
            const textRadius = this.radius * 0.82;
            const x = Math.cos(midAngle) * textRadius;
            const y = Math.sin(midAngle) * textRadius;

            const labelNode = new Node(`label_${i}`);
            const lbl = labelNode.addComponent(Label);

            lbl.string = String(pieces[i].reward);
            lbl.fontSize = 20;

            lbl.color = Color.RED;

            lbl.enableOutline = true;
            lbl.outlineWidth = 2;
            lbl.outlineColor = Color.WHITE;
            // chọn màu chữ tương phản (đen hoặc trắng) để đọc rõ
            // const bg = this.colors[i];
            // lbl.color = this.chooseContrastColor(bg);

            // anchor and position
            const tf = labelNode.getComponent(UITransform);
            if (tf) tf.setAnchorPoint(0.5, 0.5);
            labelNode.setPosition(new Vec3(x, y, 0));

            // xoay label để "chân chữ" hướng vào tâm
            // midAngle rad -> deg
            let deg = (midAngle * 180) / Math.PI;
            let rotZ = deg - 90;
            labelNode.setRotationFromEuler(0, 0, rotZ);

            this.node.addChild(labelNode);
        }
    }

    // HSV (h: 0..360, s,v: 0..1) -> Color(r,g,b,255)
    private hsvToRgb(h: number, s: number, v: number): Color {
        const hh = ((h % 360) + 360) % 360;
        const C = v * s;
        const X = C * (1 - Math.abs(((hh / 60) % 2) - 1));
        const m = v - C;
        let r = 0, g = 0, b = 0;

        if (hh >= 0 && hh < 60) { r = C; g = X; b = 0; }
        else if (hh >= 60 && hh < 120) { r = X; g = C; b = 0; }
        else if (hh >= 120 && hh < 180) { r = 0; g = C; b = X; }
        else if (hh >= 180 && hh < 240) { r = 0; g = X; b = C; }
        else if (hh >= 240 && hh < 300) { r = X; g = 0; b = C; }
        else { r = C; g = 0; b = X; }

        const R = Math.round((r + m) * 255);
        const G = Math.round((g + m) * 255);
        const B = Math.round((b + m) * 255);
        return new Color(R, G, B, 255);
    }

    // Chọn trắng hoặc đen tuỳ độ sáng background để đảm bảo tương phản
    private chooseContrastColor(bg: Color): Color {
        const r = bg.r / 255;
        const g = bg.g / 255;
        const b = bg.b / 255;
        // luminance (perceived)
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        return lum > 0.6 ? new Color(0, 0, 0, 255) : new Color(255, 255, 255, 255);
    }
}