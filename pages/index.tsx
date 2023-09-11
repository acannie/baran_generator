"use client";

// import { useEffect, useState } from "react";

// import Link from 'next/link'
// import ImagePage from './ImagePage';
import React from 'react'
// import Counter from './counter';
import Baran from "./Baran";
import HeadInfo from "./HeadInfo";
// import GenerateCats from "./GenerateCats"


// `page/index.tsx` is the UI for the `/` URL
export default function Page() {
    return (
        <>
            <HeadInfo />
            <div>
                {/* <h1>Hello, Home page!</h1> */}
                {/* <Link href="/dashboard">Dashboard</Link> */}
                {/* <ImagePage /> */}
                {/* <Counter /> */}
                <Baran />
                {/* <GenerateCats /> */}
            </div>
        </>

    );
}
