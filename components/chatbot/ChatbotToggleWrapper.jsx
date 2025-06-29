"use client";
import { useState } from "react";
import CustomChatbot from "./CustomChatbot"; // adjust path if needed

export default function ChatbotToggleWrapper() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white text-lg w-12 h-12 rounded-full shadow-lg z-50 flex items-center justify-center"
        aria-label="Toggle Chatbot"
      >
        {isOpen ? "✖" : "💬"}
      </button>

      {/* Chatbot Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50">
          <CustomChatbot />
        </div>
      )}
    </>
  );
}
