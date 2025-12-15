import { fetchCaseById } from "@/lib/mock/api";

export default async function Page({ params }: { params: { id: string } }) {
  const c = await fetchCaseById(params.id);
  if (!c) return <div className="p-6">Case not found</div>;

  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <h1 className="text-2xl font-bold">{c.title}</h1>
      <p className="text-sm text-muted">{(c as any).type ?? ""} • {c.severity}</p>
      <div className="mt-4">
        <h3 className="font-semibold">Description</h3>
        <p className="text-sm">{(c as any).summary ?? ""}</p>
      </div>
    </div>
  );
}
