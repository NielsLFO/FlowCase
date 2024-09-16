import { Inter } from "next/font/google";
import Head from "next/head";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

const Layout = ({ children }) => (
    <div className="main-container" style={{overflowX:"hidden"}}>
        <Head>
            <title>FlowCase</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
        <main>{children}</main>
    </div>
);

export default Layout;