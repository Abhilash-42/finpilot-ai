import { useState, useRef, useEffect } from "react";
import { sendAIMessage } from "../../services/aiService";

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your FinPilot AI Assistant. I can help you understand your income, expenses, budgets, savings, and spending habits.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();

    const message = input.trim();

    if (!message || loading) {
      return;
    }

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: message,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const data = await sendAIMessage(message);

      // Handle common API response formats
      const aiResponse =
        data?.message ||
        data?.response ||
        data?.answer ||
        data?.content ||
        (typeof data === "string" ? data : null);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            aiResponse ||
            "I received your request, but the AI response was empty.",
        },
      ]);
    } catch (error) {
      console.error("AI chat error:", error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, I couldn't connect to the AI service. Please make sure the backend is running and try again.",
          error: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (text) => {
    setInput(text);
  };

  return (
    <div
      style={{
        minHeight: "calc(100vh - 80px)",
        background: "#f1f5f9",
        padding: "40px",
        boxSizing: "border-box",
      }}
    >
      {/* Header */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto 25px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "32px",
            fontWeight: "700",
            color: "#0f172a",
          }}
        >
          AI Assistant
        </h1>

        <p
          style={{
            marginTop: "8px",
            marginBottom: 0,
            fontSize: "16px",
            color: "#64748b",
          }}
        >
          Ask questions about your personal finances.
        </p>
      </div>

      {/* Chat Container */}
      <div
        style={{
          maxWidth: "1100px",
          height: "calc(100vh - 230px)",
          minHeight: "500px",
          margin: "0 auto",
          background: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "16px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",
        }}
      >
        {/* Chat Header */}
        <div
          style={{
            padding: "18px 24px",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "#ff6b00",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: "700",
            }}
          >
            AI
          </div>

          <div>
            <div
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#0f172a",
              }}
            >
              FinPilot AI
            </div>

            <div
              style={{
                fontSize: "13px",
                color: "#64748b",
                marginTop: "2px",
              }}
            >
              Personal Finance Assistant
            </div>
          </div>

          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
              gap: "7px",
              fontSize: "13px",
              color: "#16a34a",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "#16a34a",
              }}
            />
            Online
          </div>
        </div>

        {/* Messages */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "25px",
            background: "#f8fafc",
          }}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  message.role === "user" ? "flex-end" : "flex-start",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  maxWidth: "75%",
                  padding: "13px 17px",
                  borderRadius:
                    message.role === "user"
                      ? "16px 16px 4px 16px"
                      : "16px 16px 16px 4px",
                  background:
                    message.role === "user" ? "#ff6b00" : "#ffffff",
                  color:
                    message.role === "user"
                      ? "#ffffff"
                      : message.error
                      ? "#dc2626"
                      : "#1e293b",
                  border:
                    message.role === "user"
                      ? "none"
                      : "1px solid #e2e8f0",
                  fontSize: "15px",
                  lineHeight: "1.6",
                  whiteSpace: "pre-wrap",
                  boxShadow:
                    message.role === "user"
                      ? "none"
                      : "0 1px 3px rgba(15, 23, 42, 0.05)",
                }}
              >
                {message.content}
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                marginBottom: "18px",
              }}
            >
              <div
                style={{
                  padding: "13px 17px",
                  borderRadius: "16px 16px 16px 4px",
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  color: "#64748b",
                  fontSize: "14px",
                }}
              >
                AI is thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div
            style={{
              padding: "14px 20px 0",
              background: "#ffffff",
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
            }}
          >
            {[
              "How much did I spend this month?",
              "What are my biggest expenses?",
              "How can I save more money?",
            ].map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => handleSuggestion(suggestion)}
                style={{
                  border: "1px solid #e2e8f0",
                  background: "#f8fafc",
                  color: "#475569",
                  borderRadius: "20px",
                  padding: "8px 13px",
                  cursor: "pointer",
                  fontSize: "13px",
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <form
          onSubmit={handleSend}
          style={{
            padding: "18px 20px",
            background: "#ffffff",
            borderTop: "1px solid #e2e8f0",
            display: "flex",
            gap: "12px",
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask FinPilot AI anything about your finances..."
            disabled={loading}
            style={{
              flex: 1,
              height: "48px",
              padding: "0 16px",
              border: "1px solid #cbd5e1",
              borderRadius: "10px",
              outline: "none",
              fontSize: "14px",
              color: "#0f172a",
              boxSizing: "border-box",
            }}
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            style={{
              height: "48px",
              padding: "0 24px",
              border: "none",
              borderRadius: "10px",
              background:
                loading || !input.trim() ? "#cbd5e1" : "#ff6b00",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "600",
              cursor:
                loading || !input.trim() ? "not-allowed" : "pointer",
              transition: "0.2s",
            }}
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}