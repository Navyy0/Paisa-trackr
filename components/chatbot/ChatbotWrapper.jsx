"use client";

import dynamic from "next/dynamic";

// Dynamically import the chatbot with SSR disabled
const CustomChatbot = dynamic(() => import("./CustomChatbot"), { ssr: false });

export default function ChatbotWrapper() {
  return <CustomChatbot />;
}
