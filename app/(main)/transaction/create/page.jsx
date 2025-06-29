import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import { AddTransactionForm } from "../_components/transaction-form";
import { getTransaction } from "@/actions/transaction";

export default async function AddTransactionPage({ searchParams }) {
  const accounts = await getUserAccounts();
  const editId = searchParams?.edit;

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="max-w-3xl mx-auto px-5">
      <div className="flex justify-center md:justify-start mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 text-transparent bg-clip-text drop-shadow-sm">
          {editId ? "Edit Transaction" : "Add Transaction"}
        </h1>
      </div>
      <div className="bg-[#0c162d] p-6 rounded-xl shadow-md border border-yellow-500">
        <AddTransactionForm
          accounts={accounts}
          categories={defaultCategories}
          editMode={!!editId}
          initialData={initialData}
        />
      </div>
    </div>
  );
}
