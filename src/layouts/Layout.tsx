import Navbar from "../components/Navbar";
import { ReactNode } from "react";

type LayoutProps = { children: ReactNode };

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Navbar />
      <main className="flex-grow pt-20 px-6 md:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}


