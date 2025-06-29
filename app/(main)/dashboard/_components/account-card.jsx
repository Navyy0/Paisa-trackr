"use client";

import { ArrowUpRight, ArrowDownRight, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";
import useFetch from "@/hooks/use-fetch";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { updateDefaultAccount, deleteAccount } from "@/actions/account";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/formatter";
import { useRouter } from "next/navigation";

export function AccountCard({ account }) {
  const { name, type, balance, id, isDefault } = account;
  const router = useRouter();

  const {
    loading: updateDefaultLoading,
    fn: updateDefaultFn,
    data: updatedAccount,
    error: updateError,
  } = useFetch(updateDefaultAccount);

  const {
    loading: deleteLoading,
    fn: deleteAccountFn,
    data: deleteRes,
    error: deleteError,
  } = useFetch(deleteAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault();

    if (isDefault) {
      toast.warning("You need at least 1 default account");
      return;
    }

    await updateDefaultFn(id);
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    const confirm = window.confirm("Are you sure you want to delete this account?");
    if (!confirm) return;

    await deleteAccountFn(id);
  };

  useEffect(() => {
    if (updatedAccount?.success) {
      toast.success("Default account updated successfully");
      router.refresh();
    }
  }, [updatedAccount, router]);

  useEffect(() => {
    if (updateError) {
      toast.error(updateError.message || "Failed to update default account");
    }
  }, [updateError]);

  useEffect(() => {
    if (deleteRes?.success) {
      toast.success("Account deleted successfully");
      router.refresh();
    }
  }, [deleteRes, router]);

  useEffect(() => {
    if (deleteError) {
      toast.error(deleteError.message || "Failed to delete account");
    }
  }, [deleteError]);

  return (
    <Card className="hover:shadow-lg transition-shadow group relative bg-[#1E293B] text-white border border-[#334155]">
      {/* Delete button */}
      <button
        onClick={handleDelete}
        disabled={deleteLoading}
        className="absolute top-2 right-2 text-red-500 hover:text-red-700 z-10"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      {/* Clickable account card */}
      <Link href={`/account/${id}`}>
        <div>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium capitalize text-yellow-400">
              {name}
            </CardTitle>
            <Switch
              checked={isDefault}
              onClick={handleDefaultChange}
              disabled={updateDefaultLoading}
            />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold text-yellow-300">
              {formatCurrency(balance)}
            </div>
            <p className="text-xs text-gray-400">
              {type.charAt(0) + type.slice(1).toLowerCase()} Account
            </p>
          </CardContent>

          <CardFooter className="flex justify-between text-sm text-gray-400">
            <div className="flex items-center">
              <ArrowUpRight className="mr-1 h-4 w-4 text-green-400" />
              Income
            </div>
            <div className="flex items-center">
              <ArrowDownRight className="mr-1 h-4 w-4 text-red-400" />
              Expense
            </div>
          </CardFooter>
        </div>
      </Link>
    </Card>
  );
}
