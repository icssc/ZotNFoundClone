import { CreateItemState } from "@/server/actions/item/create/action";
import { EditItemState } from "@/server/actions/item/edit/action";
import { AlertCircle } from "lucide-react";

type ActionState = CreateItemState | EditItemState;

interface ErrorDisplayProps {
  actionState: ActionState;
}

export function ErrorDisplay({ actionState }: ErrorDisplayProps) {
  if (actionState.success) return null;
  if (!actionState.error && !actionState.issues) return null;

  return (
    <div className="rounded-xl bg-red-500/10 p-4 border border-red-500/20 backdrop-blur-sm animate-in fade-in slide-in-from-top-2">
      <div className="flex">
        <div className="shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          {actionState.error && (
            <h3 className="text-sm font-medium text-red-400">
              {actionState.error}
            </h3>
          )}
          {actionState.issues && (
            <div className="mt-2 text-sm text-red-300/90">
              <ul role="list" className="list-disc pl-5 space-y-1">
                {actionState.issues.errors.map((issue: any) => (
                  <li key={String(issue)}>{String(issue)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
