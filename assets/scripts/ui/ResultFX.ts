import {
    _decorator, Component, Node, Label, UIOpacity, Color,
    tween, easing, Vec3, math, LabelOutline, Tween
} from 'cc';
const { ccclass, property } = _decorator;

const wait = (sec: number) => new Promise<void>(r => setTimeout(r, sec * 1000));
const run = <T>(tw: Tween<T>) => new Promise<void>(r => tw.call(r).start());

@ccclass('ResultFX')
export class ResultFX extends Component {
    @property(Node) labelNode!: Node;

    private _label!: Label;
    private _opacity!: UIOpacity;

    onLoad() {
        this._label = this.labelNode.getComponent(Label)!;
        this._opacity = this.labelNode.getComponent(UIOpacity) ?? this.labelNode.addComponent(UIOpacity);
        this.labelNode.active = false;
        this._opacity.opacity = 0;
    }

    async play(text: string, opts: {
        color?: Color | string;
        stroke?: Color | string;
        fontSize?: number;
        hold1?: number;
        hold2?: number;
        sfx?: () => void;
    } = {}) {
        const {
            color, stroke,
            fontSize = 72,
            hold1 = 0.18,
            hold2 = 0.12,
            sfx,
        } = opts;

        Tween.stopAllByTarget(this.labelNode);
        Tween.stopAllByTarget(this._opacity);

        this._label.string = text;
        this._label.fontSize = fontSize;
        this._label.lineHeight = fontSize * 1.3;

        if (color) {
            this._label.color = typeof color === 'string' ? Color.fromHEX(new Color(), color) : color;
        } else {
            const v = parseInt(text, 10);
            this._label.color = [12, 10, 8, 6, 4, 2].includes(v) ? new Color(255, 228, 0, 255)
                : [11, 9, 7, 5, 3].includes(v) ? new Color(255, 106, 0, 255)
                    : new Color(90, 200, 255, 255);
        }
        if (stroke) {
            this._label.outlineColor = stroke
                ? (typeof stroke === 'string' ? Color.fromHEX(new Color(), stroke) : stroke)
                : new Color(0, 0, 0, 180);
            this._label.outlineWidth = 8;
        }


        this.labelNode.active = true;
        this._opacity.opacity = 0;
        this.labelNode.setScale(new Vec3(0.2, 0.2, 1));
        this.labelNode.setRotationFromEuler(0, 0, 0);
        sfx?.();

        const jitterRot = math.randomRange(-6, 6);
        const punchScale = math.randomRange(1.25, 1.38);
        const finalScale = math.randomRange(1.9, 2.2);

        // --- PHA 1: fade-in + scale-in CHẠY SONG SONG ---
        await Promise.all([
            run(tween(this.labelNode).to(0.26, { scale: new Vec3(1, 1, 1) }, { easing: easing.backOut })),
            run(tween(this._opacity).to(0.2, { opacity: 255 }, { easing: 'quadOut' })),
        ]);

        this.labelNode.setRotationFromEuler(0, 0, jitterRot);
        await wait(hold1);

        // --- PHA 2: punch scale ---
        await run(
            tween(this.labelNode)
                .to(0.16, { scale: new Vec3(punchScale, punchScale, 1) }, { easing: 'sineInOut' })
                .to(0.12, { scale: new Vec3(1.1, 1.1, 1) }, { easing: 'sineIn' })
        );

        await wait(hold2);

        // --- PHA 3: scale-out + fade-out CHẠY SONG SONG ---
        await Promise.all([
            run(tween(this.labelNode).to(0.32, { scale: new Vec3(finalScale, finalScale, 1) }, { easing: 'quartIn' })),
            run(tween(this._opacity).to(0.32, { opacity: 0 }, { easing: 'quadIn' })),
        ]);

        this.labelNode.active = false;
        this.labelNode.setScale(new Vec3(1, 1, 1));
        this._opacity.opacity = 0;
    }
}
