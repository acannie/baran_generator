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

    // useStateを使って状態を定義する
    const [imageUrl, setImageUrl] = useState("");
    const [ctx, setCtx] = useState();
    const [loading, setLoading] = useState(true);
    const [count, setCount] = useState(0);

    const increment = async () => {
        setCount(count + 1);
        await generateImage();
    }

    // 頂点を生成して返す
    const getPoints = (): Point[] => {
        const points: Point[] = [
            new Point(100 + count * 10, 100 + count * 10),
            new Point(200 + count * 10, 200 + count * 10),
            new Point(220 + count * 10, 80 + count * 10)
        ];
        return points;
    }

    const generateImage = async () => {
        const canvas = document.getElementById('geometryCanvas') as HTMLCanvasElement;
        const ctx = canvas.getContext('2d');

        // nullチェック
        if (!ctx) { return }

        // 図形を削除
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        canvas.width = 400
        canvas.height = 300

        // 背景色
        ctx.beginPath();
        ctx.fillStyle = "rgba(" + [0, 0, 255, 0.5] + ")";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 図形を描画する処理を記述する
        ctx.fillStyle = 'blue';

        // 頂点を追加
        const points: Point[] = getPoints();

        // 始点
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }

        ctx.closePath();  //moveTo()で指定した始点に向けて線を引き、領域を閉じる
        ctx.fill();
    };

    useEffect(() => {
        generateImage().then((newImage) => {
            // setImageUrl(newImage.url); // 画像URLの状態を更新する
            setLoading(false); // ローディング状態を更新する
        });
    }, []);


    type Image = {
        url: string;
    };



    const handleExportImage = () => {
        // setLoading(true); // 読込中フラグを立てる
        // const newImage = await fetchImage();
        // setImageUrl(newImage.url); // 画像URLの状態を更新する
        // setLoading(false); // 読込中フラグを倒す

        const canvas = document.getElementById('geometryCanvas') as HTMLCanvasElement;
        const image = canvas.toDataURL('image/png');

        const link = document.createElement('a');
        link.href = image;
        link.download = 'geometry_image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <canvas id="geometryCanvas" width="200" height="200" /><br />
            <button onClick={handleExportImage}>画像をエクスポート</button>
            <button onClick={increment}>画像を変形</button>
            <div>{loading || <img src={imageUrl} />}</div>
        </div>
    );
};

export default Baran;
