import type { Metadata } from "next";
import { getFit } from "../../../lib/api";
import { ForkButton } from "../../components/ForkButton";
import { FitEditor } from "../../components/FitEditor";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const data = await getFit(id);
  if (!data) return { title: "Fit not found" };
  return {
    title: `${data.fit.name} | EFS`,
    description: `${data.fit.name} - EHP ${data.stats.ehp}`,
    openGraph: {
      title: `${data.fit.name} | EFS`,
      description: `CPU ${data.stats.fitting.cpuUsed}/${data.stats.fitting.cpuMax} · EHP ${data.stats.ehp}`
    }
  };
}

export default async function FitViewerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getFit(id);
  if (!data) return <main style={{ padding: 24 }}>Fit not found.</main>;

  return (
    <main style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16, maxWidth: 1200, margin: "0 auto", fontFamily: "sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid #e2e8f0", paddingBottom: 16 }}>
        <div>
          <h1 style={{ margin: "0 0 4px 0" }}>{data.fit.name}</h1>
          <div style={{ color: "#64748b" }}>Hull type: {data.fit.hullTypeId}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <ForkButton fitId={id} />
          <a href="/" style={{ textDecoration: "none", color: "#2563eb", fontSize: 14 }}>Back to Dashboard</a>
        </div>
      </header>

      <FitEditor initialFit={data.fit} initialStats={data.stats} />

      <footer style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid #e2e8f0", fontSize: 12, color: "#94a3b8" }}>
        Deep link: efs://fit/{id}
      </footer>
    </main>
  );
}
