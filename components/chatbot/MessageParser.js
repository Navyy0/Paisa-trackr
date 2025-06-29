class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    const lower = message.toLowerCase();
    if (lower.includes("add")) {
      this.actionProvider.handleAddTransaction();
    } else if (lower.includes("balance")) {
      this.actionProvider.handleShowBalance();
    } else if (lower.includes("transactions")) {
      this.actionProvider.handleListTransactions();
    } else {
      this.actionProvider.handleUnknown();
    }
  }
}

export default MessageParser;
