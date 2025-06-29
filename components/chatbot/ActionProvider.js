"use client";
import { createChatBotMessage } from "react-chatbot-kit";
import { createTransaction, getDashboardData, getUserTransactions } from "@/actions/transaction";

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleAddTransaction = async () => {
    const message = this.createChatBotMessage("Add ke liye form dashboard par open kijiye ya image scan kijiye.");
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
  };

  handleShowBalance = async () => {
    const data = await getDashboardData();
    const message = this.createChatBotMessage(`Aapka balance hai ₹${data?.[0]?.balance || "0"}`);
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
  };

  handleListTransactions = async () => {
    const result = await getUserTransactions();
    const message = this.createChatBotMessage(
      `Last 3 Transactions:\n${result.data.slice(0, 3).map(t => `${t.description}: ₹${t.amount}`).join("\n")}`
    );
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
  };

  handleUnknown = () => {
    const message = this.createChatBotMessage("Sorry, samajh nahi aaya. Aap add, balance ya transactions bol sakte hain.");
    this.setState((prev) => ({ ...prev, messages: [...prev.messages, message] }));
  };
}

export default ActionProvider;
