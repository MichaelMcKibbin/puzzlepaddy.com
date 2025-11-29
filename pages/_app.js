// /pages/_app.js
import "../styles/globals.css";
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
                <ul className="flex items-center space-x-6 list-none nav-fallback" style={{gap: '24px'}}>
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
        <div className="min-h-screen bg-gray-50 text-gray-900">
            <Header />
            <main className="container mx-auto p-4">
                <Component {...pageProps} />
            </main>
        </div>
    );
}
