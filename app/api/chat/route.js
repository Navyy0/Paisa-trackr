import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createTransaction, scanReceipt } from "@/actions/transaction";
import { getCurrentBudget } from "@/actions/budget";
import { db } from "@/lib/prisma";
import { defaultCategories } from "@/data/categories";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  const contentType = req.headers.get("content-type") || "";

  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
      include: {
        accounts: {
          where: { isDefault: true },
          take: 1,
        },
      },
    });

    if (!user || user.accounts.length === 0) {
      return NextResponse.json({ error: "Default account not found." }, { status: 404 });
    }

    const accountId = user.accounts[0].id;

    // ========== Handle Receipt Upload ==========
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file");

      if (!file || typeof file === "string") {
        return NextResponse.json({ error: "Invalid file" }, { status: 400 });
      }

      const result = await scanReceipt(file);

      if (result?.amount && result?.category) {
        await createTransaction({
          accountId,
          amount: result.amount,
          category: result.category,
          description: result.description || result.merchantName || "Scanned receipt",
          type: "EXPENSE",
          date: result.date || new Date(),
        });

        return NextResponse.json({
          content: `✅ Expense of ₹${result.amount} from ${result.merchantName || "receipt"} added under "${result.category}".`,
        });
      }

      return NextResponse.json({ content: "❌ Failed to scan receipt or extract valid details." });
    }

    // ========== Handle JSON Prompts ==========
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required." }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.9, maxOutputTokens: 2048 },
    });

    const response = result.response.text();

    // ========== Add Expense ==========
    const amountMatch = prompt.match(/₹?(\d+)/);
    const categoryMatch = prompt.match(/for ([\w\s]+)/i);
    const descriptionMatch = prompt.match(/called ['"]?([\w\s]+)['"]?/i);
    const recurringMatch = prompt.match(/\b(daily|weekly|monthly|yearly)\b/i);

    const amount = amountMatch ? parseInt(amountMatch[1]) : null;
    let category = categoryMatch ? categoryMatch[1].trim().toLowerCase() : "other-expense";
    const description = descriptionMatch ? descriptionMatch[1].trim() : "";
    const interval = recurringMatch ? recurringMatch[1].toUpperCase() : null;

    const matchedCategory = defaultCategories.find(
      (cat) => cat.name.toLowerCase() === category || cat.id === category
    );
    const finalCategory = matchedCategory ? matchedCategory.id : "other-expense";

    if (prompt.toLowerCase().includes("add expense") && amount && accountId) {
      await createTransaction({
        accountId,
        amount,
        category: finalCategory,
        description,
        type: "EXPENSE",
        date: new Date(),
        isRecurring: !!interval,
        recurringInterval: interval,
      });
      return NextResponse.json({
        content: `✅ Expense of ₹${amount} added under "${matchedCategory?.name || "Other"}".`,
      });
    }

    // ========== Show Balance ==========
    if (
      prompt.toLowerCase().includes("balance") ||
      prompt.toLowerCase().includes("current balance") ||
      prompt.toLowerCase().includes("show balance")
    ) {
      const defaultAccount = user.accounts[0];
      return NextResponse.json({
        content: `💰 Your current balance in "${defaultAccount.name}" is ₹${defaultAccount.balance}`,
      });
    }

    // ========== Last 5 Transactions ==========
    if (
      prompt.toLowerCase().includes("last 5 transactions") ||
      prompt.toLowerCase().includes("recent expenses")
    ) {
      const transactions = await db.transaction.findMany({
        where: { accountId },
        include: { account: true },
        orderBy: { date: "desc" },
        take: 5,
      });

      if (!transactions.length) {
        return NextResponse.json({ content: "No transactions found for your default account." });
      }

      const formatted = transactions
        .map((tx) => {
          const cat = defaultCategories.find((c) => c.id === tx.category);
          return `• ₹${tx.amount} for ${cat?.name || tx.category} on ${new Date(tx.date).toLocaleDateString()}`;
        })
        .join("\n");

      return NextResponse.json({ content: `Here are your last 5 transactions:\n${formatted}` });
    }

    // ========== Budget Status ==========
   if (
  prompt.toLowerCase().includes("budget status") ||
  prompt.toLowerCase().includes("budget report") ||
  prompt.toLowerCase().includes("current budget") ||
  prompt.toLowerCase().includes("within my budget")
) {
  const { budget, currentExpenses } = await getCurrentBudget(accountId);

  if (!budget) {
    return NextResponse.json({
      content: "⚠️ No active budget found for your default account.",
    });
  }

  const limit = budget.amount;
  const spent = currentExpenses;
  const remaining = limit - spent;
  const percentage = ((spent / limit) * 100).toFixed(1);

  let summary = `📊 Budget Report:
• Limit: ₹${limit}
• Spent: ₹${spent}
• Remaining: ₹${remaining}
• Usage: ${percentage}%`;

  if (spent > limit) {
    summary += "\n⚠️ You have exceeded your budget.";
  } else if (percentage > 80) {
    summary += "\n🔔 You are close to your budget limit.";
  } else {
    summary += "\n✅ You're within budget. Keep it up!";
  }

  return NextResponse.json({ content: summary });
}

// ========== Monthly Summary ==========
if (
  prompt.toLowerCase().includes("monthly summary") ||
  prompt.toLowerCase().includes("summary for this month") ||
  prompt.toLowerCase().includes("income and expense summary")
) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const income = await db.transaction.aggregate({
    where: {
      accountId,
      type: "INCOME",
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const expense = await db.transaction.aggregate({
    where: {
      accountId,
      type: "EXPENSE",
      date: {
        gte: startOfMonth,
        lte: endOfMonth,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const incomeTotal = income._sum.amount || 0;
  const expenseTotal = expense._sum.amount || 0;
  const net = incomeTotal - expenseTotal;

  const content = `📅 Monthly Summary:
• Income: ₹${incomeTotal}
• Expenses: ₹${expenseTotal}
• Net Savings: ₹${net}`;

  return NextResponse.json({ content });
}

/// ========== Category Breakdown ==========
if (
  prompt.toLowerCase().includes("category breakdown") ||
  prompt.toLowerCase().includes("spending by category") ||
  prompt.toLowerCase().includes("category wise spending")
) {
  const transactions = await db.transaction.findMany({
    where: {
      accountId,
      type: "EXPENSE",
    },
  });

  if (!transactions.length) {
    return NextResponse.json({ content: "No expenses found to analyze category-wise spending." });
  }

  const categoryTotals = transactions.reduce((acc, tx) => {
    const cat = defaultCategories.find((c) => c.id === tx.category);
    const name = cat?.name || tx.category;
    acc[name] = (acc[name] || 0) + Number(tx.amount);
    return acc;
  }, {});

  const formatted = Object.entries(categoryTotals)
    .map(([category, amount]) => `• ${category}: ₹${amount.toFixed(2)}`)
    .join("\n");

  return NextResponse.json({
    content: `📊 Category-wise spending:\n${formatted}`,
  });
}

// ========== Smart Budget Tip ==========
if (
  prompt.toLowerCase().includes("budget tip") ||
  prompt.toLowerCase().includes("how can i save") ||
  prompt.toLowerCase().includes("manage expenses")
) {
  const { budget, currentExpenses } = await getCurrentBudget(accountId);

  if (!budget) {
    return NextResponse.json({
      content: "⚠️ You don't have an active budget yet. Set one to get personalized tips!",
    });
  }

  const limit = budget.amount;
  const spent = currentExpenses;
  const usage = (spent / limit) * 100;

  let tip = "";

  if (usage > 100) {
    tip = "🚨 You're overspending! Consider reviewing your recurring expenses and reduce spending in categories like food, shopping, or entertainment.";
  } else if (usage > 80) {
    tip = "⚠️ You're close to hitting your budget limit. Try to limit any non-essential purchases this month.";
  } else if (usage < 50) {
    tip = "✅ You're managing your budget well! Consider putting the extra money into savings or investments.";
  } else {
    tip = "👍 You're within budget. Stay consistent and track any sudden spending spikes.";
  }

  return NextResponse.json({ content: `💡 Budget Tip:\n${tip}` });
}

    // ========== Default Response ==========
    return NextResponse.json({ content: response });
  } catch (err) {
    console.error("Chat API Error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
