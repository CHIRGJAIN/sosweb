import { fetchCases } from "@/lib/mock/api";

export default async function Page() {
  const cases = await fetchCases();
  const assigned = cases.filter((c: any) => c.assignedTo);

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">My Assignments</h1>
        <p className="text-sm text-muted">Incidents assigned to you for response</p>
      </header>
      <div className="space-y-4">
        {assigned.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-muted">No assignments available.</div>
        ) : (
          assigned.map((c: any) => (
            <article key={c.id} className="rounded-lg border p-4">
              <h2 className="font-semibold">{c.title}</h2>
              <p className="text-sm text-muted">{c.category} • {c.severity}</p>
              <p className="mt-2 text-sm">{c.description}</p>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
