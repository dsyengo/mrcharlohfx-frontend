import Layout from "@/layouts/Layout";
import DerivFrame from "@/components/DerivFrame";

export default function ChartsPage() {
  return (
    <Layout>
      <div className="w-full h-full bg-[#f8fafc] overflow-hidden">
        <DerivFrame page="#/chart" title="Deriv Trading View" />
      </div>
    </Layout>
  );
}
