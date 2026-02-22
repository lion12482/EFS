import type { Metadata } from "next";
import { getFit } from "../../../lib/api";
import { ForkButton } from "../../components/ForkButton";

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
    <main style={{ padding: 24, display: "grid", gap: 16 }}>
      <h1>{data.fit.name}</h1>
      <div>Hull type: {data.fit.hullTypeId}</div>
      <div>CPU: {data.stats.fitting.cpuUsed}/{data.stats.fitting.cpuMax}</div>
      <div>PG: {data.stats.fitting.powergridUsed}/{data.stats.fitting.powergridMax}</div>
      <div>EHP: {data.stats.ehp}</div>
      <ForkButton fitId={id} />
      <div>Deep link: efs://fit/{id}</div>
    </main>
  );
}
