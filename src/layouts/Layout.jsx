import Navbar from "@/components/Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-gradient-to-b from-[#010414] via-[#020617] to-[#0a0f1f] text-white">
      {/* Neon background glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,rgba(0,255,255,0.07),transparent_70%)]"></div>

      {/* Top Navbar */}
      <Navbar />

      {/* Dashboard Content */}
      <main className="flex-grow pt-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
