import React, { useEffect, useState } from 'react';


const Baran = () => {
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
    const getPoints = (): [number, number][] => {
        const points: [number, number][] = [];

        points.push([100 + count * 10, 100 + count * 10]);
        points.push([200 + count * 10, 200 + count * 10]);
        points.push([220 + count * 10, 80 + count * 10]);

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
        const points: [number, number][] = getPoints();

        // 始点
        ctx.beginPath();
        ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i][0], points[i][1]);
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
