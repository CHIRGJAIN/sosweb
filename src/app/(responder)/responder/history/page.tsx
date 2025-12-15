import { fetchCases } from "@/lib/mock/api";

export default async function Page() {
  const cases = await fetchCases();
  const resolved = cases.filter((c: any) => c.status === "RESOLVED" || c.status === "CLOSED");

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Response History</h1>
        <p className="text-sm text-muted">Previously handled incidents</p>
      </header>
      <div className="space-y-4">
        {resolved.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-muted">No history available.</div>
        ) : (
          resolved.map((c: any) => (
            <article key={c.id} className="rounded-lg border p-4">
              <h2 className="font-semibold">{c.title}</h2>
              <p className="text-sm text-muted">{c.category} • {c.severity}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
