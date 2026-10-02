import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import api from "../api/client";

export default function Chatbot() {
  const { t } = useTranslation();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [sending, setSending] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, sending]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSend(e) {
    e.preventDefault();

    const text = input.trim();

    if (!text || sending) {
      return;
    }

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: text,
      },
    ]);

    setInput("");
    setSending(true);

    try {
      const { data } = await api.post("/chatbot/message", {
        message: text,
        session_id: sessionId,
      });

      setSessionId(data.session_id);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply,
        },
      ]);
    } catch (err) {
      console.error("Chatbot error:", err);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            t("chatbot.errorMessage") !== "chatbot.errorMessage"
              ? t("chatbot.errorMessage")
              : "Sorry, I couldn't process your message. Please try again.",
        },
      ]);
    } finally {
      setSending(false);

      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }

  function startNewConversation() {
    setMessages([]);
    setSessionId(null);
    setInput("");

    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  }

  return (
    <>
      <style>{`
        /* =========================================================
           CHATBOT PAGE
           ========================================================= */

        .chatbot-page {
          width: 100%;
          max-width: 100%;
          min-height: calc(100vh - 64px);
          box-sizing: border-box;
          padding: 32px 40px;
          color: var(--text-color, #111827);
        }

        /* =========================================================
           HEADER
           ========================================================= */

        .chatbot-header {
          width: 100%;
          max-width: 1100px;
          margin: 0 auto 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .chatbot-title-section {
          min-width: 0;
        }

        .chatbot-title {
          margin: 0;
          font-size: 28px;
          line-height: 1.2;
          font-weight: 700;
          color: var(--text-color, #111827);
          letter-spacing: -0.02em;
        }

        .chatbot-subtitle {
          margin: 7px 0 0;
          color: var(--secondary-text, #6b7280);
          font-size: 14px;
          line-height: 1.5;
        }

        .chatbot-new-button {
          flex-shrink: 0;
          height: 40px;
          padding: 0 15px;
          border-radius: 8px;
          border: 1px solid var(--border-color, #e5e7eb);
          background: var(--card-color, #ffffff);
          color: var(--text-color, #111827);
          font-family: inherit;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition:
            background-color 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }

        .chatbot-new-button:hover {
          border-color: #5b45d9;
          color: #5b45d9;
          background: #f8f7ff;
        }

        /* =========================================================
           MAIN CHAT CARD
           ========================================================= */

        .chatbot-card {
          width: 100%;
          max-width: 1100px;
          height: calc(100vh - 170px);
          min-height: 500px;
          margin: 0 auto;
          background: var(--card-color, #ffffff);
          border: 1px solid var(--border-color, #e5e7eb);
          border-radius: 14px;
          overflow: hidden;

          display: flex;
          flex-direction: column;

          box-sizing: border-box;
        }

        /* =========================================================
           CHAT WINDOW
           ========================================================= */

        .chatbot-window {
          flex: 1;
          min-height: 0;
          overflow-y: auto;

          padding: 24px;

          display: flex;
          flex-direction: column;
          gap: 14px;

          background: var(--bg-color, #f5f7fb);
          scroll-behavior: smooth;
        }

        /* Scrollbar */

        .chatbot-window::-webkit-scrollbar {
          width: 7px;
        }

        .chatbot-window::-webkit-scrollbar-track {
          background: transparent;
        }

        .chatbot-window::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }

        .chatbot-window::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        /* =========================================================
           EMPTY STATE
           ========================================================= */

        .chatbot-empty {
          flex: 1;

          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;

          text-align: center;
          padding: 30px;
        }

        .chatbot-empty-icon {
          width: 56px;
          height: 56px;
          margin-bottom: 15px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 16px;

          background: #ede9fe;
          color: #5b45d9;

          font-size: 26px;
        }

        .chatbot-empty-title {
          margin: 0 0 7px;

          color: var(--text-color, #111827);

          font-size: 17px;
          font-weight: 600;
        }

        .chatbot-empty-text {
          max-width: 400px;

          margin: 0;

          color: var(--secondary-text, #6b7280);

          font-size: 14px;
          line-height: 1.6;
        }

        /* =========================================================
           MESSAGE BUBBLES
           ========================================================= */

        .chatbot-message {
          display: flex;
          width: 100%;
        }

        .chatbot-message-user {
          justify-content: flex-end;
        }

        .chatbot-message-assistant {
          justify-content: flex-start;
        }

        .chatbot-bubble {
          max-width: 72%;

          padding: 12px 15px;

          border-radius: 12px;

          font-size: 14px;
          line-height: 1.6;

          word-break: break-word;
          overflow-wrap: anywhere;

          box-sizing: border-box;
        }

        .chatbot-bubble-user {
          background: #5b45d9;
          color: #ffffff;

          border-bottom-right-radius: 4px;
        }

        .chatbot-bubble-assistant {
          background: var(--card-color, #ffffff);
          color: var(--text-color, #111827);

          border: 1px solid var(--border-color, #e5e7eb);

          border-bottom-left-radius: 4px;
        }

        /* =========================================================
           MARKDOWN
           ========================================================= */

        .chatbot-bubble p {
          margin: 0 0 8px;
        }

        .chatbot-bubble p:last-child {
          margin-bottom: 0;
        }

        .chatbot-bubble ul,
        .chatbot-bubble ol {
          margin: 8px 0;
          padding-left: 20px;
        }

        .chatbot-bubble li {
          margin-bottom: 4px;
        }

        .chatbot-bubble h1,
        .chatbot-bubble h2,
        .chatbot-bubble h3 {
          margin: 10px 0 6px;
          color: inherit;
        }

        .chatbot-bubble h1 {
          font-size: 18px;
        }

        .chatbot-bubble h2 {
          font-size: 16px;
        }

        .chatbot-bubble h3 {
          font-size: 15px;
        }

        .chatbot-bubble code {
          padding: 2px 5px;
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.07);
          font-family: "JetBrains Mono", monospace;
          font-size: 0.85em;
        }

        .chatbot-bubble pre {
          margin: 10px 0;
          padding: 12px;
          overflow-x: auto;
          border-radius: 8px;
          background: #111827;
          color: #f9fafb;
        }

        .chatbot-bubble pre code {
          background: transparent;
          padding: 0;
          color: inherit;
        }

        /* =========================================================
           THINKING
           ========================================================= */

        .chatbot-thinking {
          display: flex;
          align-items: center;
          gap: 8px;

          color: var(--secondary-text, #6b7280);
          font-size: 13px;
          font-style: italic;
        }

        .chatbot-thinking-dots {
          display: flex;
          gap: 3px;
        }

        .chatbot-thinking-dots span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #7c6ee6;

          animation: chatbotPulse 1.2s infinite ease-in-out;
        }

        .chatbot-thinking-dots span:nth-child(2) {
          animation-delay: 0.15s;
        }

        .chatbot-thinking-dots span:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes chatbotPulse {
          0%,
          60%,
          100% {
            opacity: 0.35;
            transform: translateY(0);
          }

          30% {
            opacity: 1;
            transform: translateY(-2px);
          }
        }

        /* =========================================================
           INPUT AREA
           ========================================================= */

        .chatbot-input-area {
          flex-shrink: 0;

          padding: 16px 20px;

          background: var(--card-color, #ffffff);

          border-top: 1px solid var(--border-color, #e5e7eb);
        }

        .chatbot-input-form {
          display: flex;
          align-items: center;
          gap: 10px;

          width: 100%;
        }

        .chatbot-input {
          flex: 1;
          min-width: 0;

          height: 44px;

          padding: 0 14px;

          border: 1px solid var(--border-color, #d9dce5);
          border-radius: 8px;

          background: var(--input-color, #ffffff);
          color: var(--text-color, #111827);

          font-family: inherit;
          font-size: 14px;

          outline: none;

          box-sizing: border-box;

          transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .chatbot-input::placeholder {
          color: #9ca3af;
        }

        .chatbot-input:focus {
          border-color: #5b45d9;
          box-shadow: 0 0 0 3px rgba(91, 69, 217, 0.12);
        }

        .chatbot-send-button {
          flex-shrink: 0;

          height: 44px;

          padding: 0 20px;

          border: none;
          border-radius: 8px;

          background: #5b45d9;
          color: #ffffff;

          font-family: inherit;
          font-size: 14px;
          font-weight: 600;

          cursor: pointer;

          transition:
            background-color 0.2s ease,
            opacity 0.2s ease;
        }

        .chatbot-send-button:hover:not(:disabled) {
          background: #4c38c8;
        }

        .chatbot-send-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        /* =========================================================
           DARK MODE
           ========================================================= */

        .dark .chatbot-window,
        html[data-theme="dark"] .chatbot-window {
          background: #111827;
        }

        .dark .chatbot-empty-icon,
        html[data-theme="dark"] .chatbot-empty-icon {
          background: #312e81;
          color: #c4b5fd;
        }

        .dark .chatbot-bubble-assistant,
        html[data-theme="dark"] .chatbot-bubble-assistant {
          background: #1f2937;
          border-color: #374151;
        }

        .dark .chatbot-new-button:hover,
        html[data-theme="dark"] .chatbot-new-button:hover {
          background: #1f2937;
        }

        .dark .chatbot-input,
        html[data-theme="dark"] .chatbot-input {
          background: #1f2937;
          border-color: #374151;
        }

        /* =========================================================
           RESPONSIVE
           ========================================================= */

        @media (max-width: 900px) {
          .chatbot-page {
            padding: 24px;
          }

          .chatbot-card {
            height: calc(100vh - 145px);
          }

          .chatbot-bubble {
            max-width: 82%;
          }
        }

        @media (max-width: 600px) {
          .chatbot-page {
            padding: 18px 14px;
          }

          .chatbot-header {
            align-items: flex-start;
          }

          .chatbot-title {
            font-size: 23px;
          }

          .chatbot-subtitle {
            font-size: 13px;
          }

          .chatbot-new-button {
            font-size: 12px;
            padding: 0 11px;
          }

          .chatbot-card {
            height: calc(100vh - 145px);
            min-height: 450px;
            border-radius: 10px;
          }

          .chatbot-window {
            padding: 16px 12px;
          }

          .chatbot-bubble {
            max-width: 90%;
            font-size: 13px;
          }

          .chatbot-input-area {
            padding: 12px;
          }

          .chatbot-input-form {
            gap: 7px;
          }

          .chatbot-send-button {
            padding: 0 14px;
          }
        }
      `}</style>

      <main className="chatbot-page">
        {/* HEADER */}
        <header className="chatbot-header">
          <div className="chatbot-title-section">
            <h1 className="chatbot-title">
              {t("chatbot.title") !== "chatbot.title"
                ? t("chatbot.title")
                : "AI Chat"}
            </h1>

            <p className="chatbot-subtitle">
              {t("chatbot.subtitle") !== "chatbot.subtitle"
                ? t("chatbot.subtitle")
                : "Ask questions and get personalized assistance."}
            </p>
          </div>

          <button
            type="button"
            className="chatbot-new-button"
            onClick={startNewConversation}
          >
            {t("chatbot.newConversation") !==
            "chatbot.newConversation"
              ? t("chatbot.newConversation")
              : "New Conversation"}
          </button>
        </header>

        {/* CHAT CARD */}
        <section className="chatbot-card">
          {/* CHAT WINDOW */}
          <div className="chatbot-window">
            {messages.length === 0 ? (
              <div className="chatbot-empty">
                <div className="chatbot-empty-icon">✦</div>

                <h2 className="chatbot-empty-title">
                  {t("chatbot.title") !== "chatbot.title"
                    ? t("chatbot.title")
                    : "How can I help you?"}
                </h2>

                <p className="chatbot-empty-text">
                  {t("chatbot.placeholder") !== "chatbot.placeholder"
                    ? t("chatbot.placeholder")
                    : "Ask me about your focus sessions, productivity, distractions, or recommendations."}
                </p>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`chatbot-message ${
                      message.role === "user"
                        ? "chatbot-message-user"
                        : "chatbot-message-assistant"
                    }`}
                  >
                    <div
                      className={`chatbot-bubble ${
                        message.role === "user"
                          ? "chatbot-bubble-user"
                          : "chatbot-bubble-assistant"
                      }`}
                    >
                      {message.role === "assistant" ? (
                        <ReactMarkdown>
                          {message.content}
                        </ReactMarkdown>
                      ) : (
                        message.content
                      )}
                    </div>
                  </div>
                ))}

                {sending && (
                  <div className="chatbot-message chatbot-message-assistant">
                    <div className="chatbot-bubble chatbot-bubble-assistant">
                      <div className="chatbot-thinking">
                        <span>
                          {t("chatbot.thinking") !==
                          "chatbot.thinking"
                            ? t("chatbot.thinking")
                            : "Thinking"}
                        </span>

                        <span className="chatbot-thinking-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            <div ref={bottomRef} />
          </div>

          {/* INPUT */}
          <div className="chatbot-input-area">
            <form
              className="chatbot-input-form"
              onSubmit={handleSend}
            >
              <input
                ref={inputRef}
                type="text"
                className="chatbot-input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  t("chatbot.prompt") !== "chatbot.prompt"
                    ? t("chatbot.prompt")
                    : "Type your message..."
                }
                disabled={sending}
                autoComplete="off"
              />

              <button
                className="chatbot-send-button"
                type="submit"
                disabled={sending || !input.trim()}
              >
                {sending
                  ? "..."
                  : t("common.send") !== "common.send"
                  ? t("common.send")
                  : "Send"}
              </button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
}