import { Suspense } from "react";
import { getAccountWithTransactions } from "@/actions/account";
import { BarLoader } from "react-spinners";
import { TransactionTable } from "../_components/transaction-table";
import { notFound } from "next/navigation";
import { AccountChart } from "../_components/account-chart";
import { formatCurrency } from "@/lib/formatter";

export default async function AccountPage({ params }) {
  const id = (await params)?.id;
  const accountData = await getAccountWithTransactions(id);

  if (!accountData) {
    notFound();
  }

  const { transactions, ...account } = accountData;

  return (
    <div className="space-y-10 px-5 py-6 bg-[#0F172A] min-h-screen text-white">
      <div className="flex gap-4 items-end justify-between">
        <div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight gradient-title capitalize text-yellow-400">
            {account.name}
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {account.type.charAt(0) + account.type.slice(1).toLowerCase()} Account
          </p>
        </div>

        <div className="text-right pb-2">
          <div className="text-2xl sm:text-3xl font-bold text-yellow-300">
            {formatCurrency(account.balance)}
          </div>
          <p className="text-sm text-gray-400">
            {account._count.transactions} Transactions
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#facc15" />}
      >
        <AccountChart transactions={transactions} />
      </Suspense>

      {/* Transactions Table */}
      <Suspense
        fallback={<BarLoader className="mt-4" width={"100%"} color="#facc15" />}
      >
        <TransactionTable transactions={transactions} />
      </Suspense>
    </div>
  );
}
