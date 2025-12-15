import { listDirectory } from "@/lib/mock/api";

export default async function Page() {
  const items = await listDirectory("RESOURCE");

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Resources Directory</h1>
        <p className="text-sm text-muted">Helpful resources and contacts</p>
      </header>
      <div className="space-y-4">
        {items.map((n: any) => (
          <div key={n.id} className="rounded-lg border p-4">
            <h3 className="font-semibold">{n.name}</h3>
            <p className="text-sm text-muted">{n.description}</p>
            <p className="text-xs text-muted mt-2">Contact: {n.contact}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
