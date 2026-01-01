import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function SubmitButton({
  isPending,
  children,
  variant = "secondary",
  ...props
}: ButtonProps & { isPending: boolean }) {
  return (
    <Button disabled={isPending} variant={variant} {...props}>
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : children}
    </Button>
  );
}
