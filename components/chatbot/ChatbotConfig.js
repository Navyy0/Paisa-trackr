import { createChatBotMessage } from "react-chatbot-kit";

const config = {
  botName: "PaisaBot",
  initialMessages: [
    createChatBotMessage(`Hi! Main PaisaBot hoon 💸 Aap kya karna chahenge?`),
  ],
  customStyles: {
    botMessageBox: { backgroundColor: "#0D3B66" },
    chatButton: { backgroundColor: "#facc15" },
  },
};

export default config;
