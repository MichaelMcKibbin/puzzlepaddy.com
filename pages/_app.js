// /pages/_app.js
import "../styles/globals.css";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

const navItems = [
    { href: "/", label: "Home" },
    { href: "/games", label: "Games" },
    { href: "/puzzles", label: "Puzzles" },
    { href: "/contact", label: "Contact" },
];

function Header() {
    const router = useRouter();

    const isActive = (href) =>
        href === "/" ? router.pathname === "/" : router.pathname.startsWith(href);

    return (
        <header className="bg-white shadow sticky top-0 z-20">
            <nav className="container mx-auto flex items-center justify-between p-4">
                {/* Logo / site name */}
                <Link href="/">
          <span className="text-2xl font-bold text-indigo-600">
            Puzzle Paddy
          </span>
                </Link>

                {/* Horizontal nav – no bullets, no padding */}
                <ul className="flex items-center space-x-6 list-none">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={`inline-block px-2 py-1 text-sm font-medium transition-colors hover:text-indigo-600 hover:underline hover:underline-offset-4 ${
                                    isActive(item.href)
                                        ? "text-indigo-600 underline underline-offset-4"
                                        : "text-gray-700"
                                }`}
                            >
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
}


export default function App({ Component, pageProps }) {
    return (
        <>
            <Head>
                <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
                <meta httpEquiv="Pragma" content="no-cache" />
                <meta httpEquiv="Expires" content="0" />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900">
                <Header />
                <main>
                    <Component {...pageProps} />
                </main>
            </div>
        </>
    );
}
