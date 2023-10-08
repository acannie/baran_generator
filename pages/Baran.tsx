import React, { useEffect, useState } from 'react';


const Baran = () => {
    // 頂点
    class Point {
        private _x: number;
        private _y: number;

        constructor(x: number, y: number) {
            this._x = x;
            this._y = y;
        }

        get x(): number {
            return this._x;
        }
        get y(): number {
            return this._y;
        }
    }

    // 線
    class Line {
        private _start: Point;
        private _end: Point;

        constructor(start: Point, end: Point) {
            this._start = start
            this._end = end
        }

        get start(): Point {
            return this._start
        }
        get end(): Point {
            return this._end
        }
    }

    // useStateを使って状態を定義する
    const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
    const [ctx, setCtx] = useState();
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState(0);

    const increment = async () => {
        setCount(count + 1);
        await generateImage();
    }

    // ランダムな整数を生成
    const randomInt = (min: number = 0, max: number): number => {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // ランダムな小数を生成
    const randomDecimal = (min: number = 0, max: number): number => {
        return Math.random() * (max - min) + min;
    }

    // 頂点を生成
    const getPoints = (scale: number, imageWidth: number, imageHeight: number): [Point[], Line[]] => {
        // 定数
        const gizaWidth = 10 * scale
        const baranHeight = 160 * scale
        const gizaYCoordinates = [110, 40, 90, 20, 70, 0, 70, 20, 90, 40].map(x => x * scale);

        // ランダム要素
        const leftGizaInterceptWidth = randomDecimal(0, gizaWidth)
        const rightGizaInterceptWidth = randomDecimal(0, gizaWidth)
        const gizaPointCount = randomInt(2, Math.floor(imageWidth - leftGizaInterceptWidth - rightGizaInterceptWidth - 10) / gizaWidth)

        // ばらん全体のサイズ
        const baranWidth = leftGizaInterceptWidth + rightGizaInterceptWidth + (gizaPointCount - 1) * gizaWidth

        // ばらんの上下左右端の座標
        const xLeft = imageWidth / 2 - baranWidth / 2
        const xRight = imageWidth / 2 + baranWidth / 2
        const yTop = imageHeight / 2 - baranHeight / 2
        const yBottom = imageHeight / 2 + baranHeight / 2

        // ばらんの頂点
        let points: Point[] = []
        let lines: Line[] = []

        // ばらんの右下と左下の頂点を追加
        points.push(new Point(xRight, yBottom))
        points.push(new Point(xLeft, yBottom))

        // 周期
        const gizaPerMountain = gizaYCoordinates.length
        let gizaCycleCount = randomInt(0, gizaPerMountain)

        // ぎざぎざの左端
        let nextGizaCycleCount = (gizaCycleCount + 1) % gizaPerMountain
        const gizaLeftPointX = xLeft
        const gizaLeftPointY = yTop
            + gizaYCoordinates[gizaCycleCount]
            + (gizaYCoordinates[nextGizaCycleCount] - gizaYCoordinates[gizaCycleCount]) * (1 - (leftGizaInterceptWidth / gizaWidth))
        points.push(new Point(gizaLeftPointX, gizaLeftPointY));

        // 周期の更新
        gizaCycleCount += 1
        gizaCycleCount %= gizaPerMountain

        // ぎざぎざを作る
        for (let i = 0; i < gizaPointCount; i++) {
            // 頂点を追加
            const point = new Point(
                xLeft + leftGizaInterceptWidth + gizaWidth * i,
                yTop + gizaYCoordinates[gizaCycleCount]
            )
            points.push(point)

            // 線を描画
            lines.push(new Line(point, new Point(point.x, yBottom)))

            // 周期の更新
            gizaCycleCount += 1
            gizaCycleCount %= gizaPerMountain
        }

        // ぎざぎざの右端
        const previousGizaCycleCount = gizaCycleCount - 1
        const gizaRightPoint = new Point(
            xRight,
            yTop
            + gizaYCoordinates[previousGizaCycleCount]
            + (gizaYCoordinates[gizaCycleCount] - gizaYCoordinates[previousGizaCycleCount]) * (rightGizaInterceptWidth / gizaWidth)
        )
        points.push(gizaRightPoint)

        return [points, lines];
    }

    // HSVをRGBに変換
    const hsvToRgb = (h: number, s: number, v: number): [number, number, number] => {
        let r, g, b;
        let i, f, p, q, t;

        if (s === 0) {
            r = g = b = v;
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }

        h /= 60;
        i = Math.floor(h);
        f = h - i;
        p = v * (1 - s);
        q = v * (1 - s * f);
        t = v * (1 - s * (1 - f));

        switch (i) {
            case 0:
                [r, g, b] = [v, t, p];
                break;
            case 1:
                [r, g, b] = [q, v, p];
                break;
            case 2:
                [r, g, b] = [p, v, t];
                break;
            case 3:
                [r, g, b] = [p, q, v];
                break;
            case 4:
                [r, g, b] = [t, p, v];
                break;
            default:
                [r, g, b] = [v, p, q];
                break;
        }

        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }

    // 図形を生成
    const generateImage = async () => {
        const canvas = document.getElementById('geometryCanvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');

        // nullチェック
        if (!ctx) { return }

        // 図形を削除
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 定数
        const scale = 1
        const imgWidth = 400 * scale
        const imgHeight = 300 * scale

        // 色相を決定（アタリならランダムな色、ハズレなら緑）
        const differentColor: Boolean = randomInt(0, 10) == 0
        const hue: number = differentColor ? randomInt(0, 360) : 122

        // 塗りつぶしの色と縦線の色
        const fillColor: [number, number, number] = hsvToRgb(hue, 0.53, 0.68)
        const lineColor: [number, number, number] = hsvToRgb(hue, 0.53, 0.62)

        canvas.width = imgWidth
        canvas.height = imgHeight

        // 背景
        ctx.fillStyle = "rgba(" + [0, 0, 0, 0] + ")";
        ctx.beginPath();
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // ばらんの形を取得
        const pointsAndLines: [Point[], Line[]] = getPoints(scale, imgWidth, imgHeight)
        const points: Point[] = pointsAndLines[0]
        const lines: Line[] = pointsAndLines[1]

        // ばらんの輪郭
        ctx.fillStyle = "rgba(" + [fillColor[0], fillColor[1], fillColor[2], 1] + ")";
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.fill();
        ctx.closePath();

        // ばらんの線
        ctx.strokeStyle = "rgba(" + [lineColor[0], lineColor[1], lineColor[2], 1] + ")"
        ctx.lineWidth = 2 * scale;
        for (let i = 0; i < lines.length; i++) {
            ctx.beginPath();
            ctx.moveTo(lines[i].start.x, lines[i].start.y);
            ctx.lineTo(lines[i].end.x, lines[i].end.y);
            ctx.stroke();
            ctx.closePath();
        }

        setImageDataUrl(canvas.toDataURL());
    };

    useEffect(() => {
        generateImage().then((newImage) => {
            setLoading(false);
        });
    }, []);

    const handleExportImage = () => {
        const canvas = document.getElementById('geometryCanvas') as HTMLCanvasElement;
        const image = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = image;
        link.download = 'baran.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <canvas id="geometryCanvas" width="200" height="200" style={{display: "none"}}/><br />
            {imageDataUrl && <img alt="icon" src={imageDataUrl} />}<br />
            <button onClick={handleExportImage}>ダウンロード</button>
            <button onClick={increment}>もう一度</button>
        </div>
    );
};

export default Baran;
