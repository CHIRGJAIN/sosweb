import { listModerationQueue } from "@/lib/mock/api";

export default async function Page() {
  const queue = await listModerationQueue();

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Moderation Queue</h1>
        <p className="text-sm text-muted">Review reported posts</p>
      </header>
      <div className="space-y-4">
        {queue.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-muted">No items in moderation queue.</div>
        ) : (
          queue.map((q: any) => (
            <div key={q.id} className="rounded-lg border p-4">
              <h3 className="font-semibold">Post: {q.postId}</h3>
              <p className="text-sm text-muted">Reason: {q.reason}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
