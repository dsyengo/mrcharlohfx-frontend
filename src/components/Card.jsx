export default function Card({ title, children }) {
  return (
    <div className="bg-[#0d1435] p-6 rounded-2xl border border-gray-700 shadow-md hover:shadow-[0_0_20px_#00ffff40] transition">
      <h2 className="text-lg font-semibold text-neon mb-3">{title}</h2>
      <div>{children}</div>
    </div>
  );
}
