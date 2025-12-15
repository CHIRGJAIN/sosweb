import React from "react";

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Service Requests</h1>
        <p className="text-sm text-muted">Requests within your operations scope</p>
      </header>
      <div className="rounded-lg border border-dashed p-6 text-center text-muted">No service requests yet.</div>
    </div>
  );
}
