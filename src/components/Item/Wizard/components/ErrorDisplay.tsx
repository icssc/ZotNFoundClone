import { CreateItemState } from "@/server/actions/item/create/action";
import { EditItemState } from "@/server/actions/item/edit/action";

type ActionState = CreateItemState | EditItemState;

interface ErrorDisplayProps {
  actionState: ActionState;
}

import { AlertCircle } from "lucide-react";

export function ErrorDisplay({ actionState }: ErrorDisplayProps) {
  if (actionState.success) return null;
  if (!actionState.error && !actionState.issues) return null;

  return (
    <div className="rounded-md bg-red-50 p-4 border border-red-200">
      <div className="flex">
        <div className="shrink-0">
          <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          {actionState.error && (
            <h3 className="text-sm font-medium text-red-800">
              {actionState.error}
            </h3>
          )}
          {actionState.issues && (
            <div className="mt-2 text-sm text-red-700">
              <ul role="list" className="list-disc pl-5 space-y-1">
                {actionState.issues.errors.map((issue: any, index: number) => (
                  <li key={index}>{String(issue)}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
