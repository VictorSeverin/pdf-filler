import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Notice Generator",
  description: "NCU inspection notice Generator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <div className="items-center justify-center flex italic bg-gray-900 text-white">
        <Link className="underline " href="https://victorseverin.dev">
          Developed by Victor Severin
        </Link>
      </div>
    </html>
  );
}
