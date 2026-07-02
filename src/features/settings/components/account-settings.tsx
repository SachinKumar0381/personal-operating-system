"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { GlassCard } from "@/shared/ui/glass-card";
import { GlassButton } from "@/shared/ui/glass-button";
import { GlassInput } from "@/shared/ui/glass-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { useDeleteAccount } from "@/features/settings/hooks/use-settings";

const CONFIRM_PHRASE = "delete my account";

export function AccountSettings(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const { mutate, isPending } = useDeleteAccount();

  const isConfirmed = confirmText.toLowerCase() === CONFIRM_PHRASE;

  function handleDelete(): void {
    if (!isConfirmed) return;
    mutate();
  }

  return (
    <GlassCard variant="default" padding="lg">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/15 text-red-500">
          <AlertTriangle size={18} />
        </div>
        <div>
          <h2 className="text-base font-semibold">Account</h2>
          <p className="text-xs text-muted-foreground">Danger zone — irreversible actions</p>
        </div>
      </div>

      <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium">Delete Account</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Permanently delete your account and all associated data. This action cannot be
              undone.
            </p>
          </div>
          <Dialog
            open={open}
            onOpenChange={(v) => {
              setOpen(v);
              if (!v) setConfirmText("");
            }}
          >
            <DialogTrigger asChild>
              <GlassButton
                variant="destructive"
                size="sm"
                className="shrink-0"
                aria-label="Delete account"
              >
                <Trash2 size={14} />
                Delete
              </GlassButton>
            </DialogTrigger>
            <DialogContent className="glass border-white/20 dark:border-white/10 backdrop-blur-xl">
              <DialogHeader>
                <DialogTitle>Delete Account</DialogTitle>
                <DialogDescription>
                  This will permanently delete your account and all your data — health logs,
                  study entries, job applications, finances, and everything else. There is no
                  going back.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2 py-2">
                <p className="text-sm text-muted-foreground">
                  Type{" "}
                  <span className="font-mono font-semibold text-foreground">
                    {CONFIRM_PHRASE}
                  </span>{" "}
                  to confirm:
                </p>
                <GlassInput
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={CONFIRM_PHRASE}
                  autoFocus
                />
              </div>

              <DialogFooter>
                <GlassButton
                  variant="default"
                  size="md"
                  onClick={() => {
                    setOpen(false);
                    setConfirmText("");
                  }}
                >
                  Cancel
                </GlassButton>
                <GlassButton
                  variant="destructive"
                  size="md"
                  disabled={!isConfirmed || isPending}
                  onClick={handleDelete}
                >
                  {isPending ? "Deleting…" : "Delete Account"}
                </GlassButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </GlassCard>
  );
}
