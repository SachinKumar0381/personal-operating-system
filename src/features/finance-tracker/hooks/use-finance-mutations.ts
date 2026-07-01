"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { QUERY_KEYS } from "@/shared/constants";
import type {
  CreateFinanceInput,
  UpdateFinanceInput,
} from "@/features/finance-tracker/schemas/finance-schema";

async function createEntry(data: CreateFinanceInput) {
  const res = await fetch("/api/finance", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to add transaction");
  return json.data;
}

async function updateEntry({ id, data }: { id: string; data: UpdateFinanceInput }) {
  const res = await fetch(`/api/finance/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to update transaction");
  return json.data;
}

async function deleteEntry(id: string) {
  const res = await fetch(`/api/finance/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!json.success) throw new Error(json.error ?? "Failed to delete transaction");
}

export function useFinanceMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.FINANCE] });

  const createFinance = useMutation({
    mutationFn: createEntry,
    onSuccess: () => {
      toast.success("Transaction added!");
      void invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const updateFinance = useMutation({
    mutationFn: updateEntry,
    onSuccess: () => {
      toast.success("Transaction updated!");
      void invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const deleteFinance = useMutation({
    mutationFn: deleteEntry,
    onSuccess: () => {
      toast.success("Transaction deleted");
      void invalidate();
    },
    onError: (err: Error) => toast.error(err.message),
  });

  return { createFinance, updateFinance, deleteFinance };
}
