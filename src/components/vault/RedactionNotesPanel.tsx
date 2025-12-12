import { useState } from "react";
import { Button } from "@/components/ui/button";

type Props = {
  initialNotes: string;
  onSave: (notes: string) => void;
};

export function RedactionNotesPanel({ initialNotes, onSave }: Props) {
  const [notes, setNotes] = useState(initialNotes);

  return (
    <div className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-900 dark:text-white">Redaction notes</p>
        <Button
          variant="ghost"
          onClick={() => onSave(notes)}
          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:border-amber-400 hover:text-amber-600 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        >
          Save
        </Button>
      </div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
        rows={4}
      />
    </div>
  );
}
