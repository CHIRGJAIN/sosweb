import { listRoutingRules } from "@/lib/mock/api";

export default async function Page() {
  const rules = await listRoutingRules();

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Routing Rules</h1>
        <p className="text-sm text-muted">Manage how incoming cases are routed by category</p>
      </header>
      <div className="space-y-4">
        {rules.map((r: any) => (
          <div key={r.id} className="rounded-lg border p-4">
            <h3 className="font-semibold">{r.category}</h3>
            <p className="text-sm text-muted">Dept: {r.department} • Group: {r.defaultResponderGroup}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
