import { useState } from "react";
import './out.css';


export default function App() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! How can I help you today?" }
]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({ message: input }), 
      });

      const data = await res.json();
      const botMessage = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch(err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Oops! Something went wrong contacting the server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

return (
  <div className="flex h-screen">
    {/* Sidebar */}
    <div className="w-64 bg-gray-800 text-white p-4">
      <h1 className="text-xl font-bold mb-4">Eddiebot</h1>
      <button className="w-full bg-blue-600 p-2 rounded">New Chat</button>
    </div>

    {/* Chat Section */}
    <div className="flex-1 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((m, i) => (
          <div key={i} className={m.sender === "user" ? "text-right" : "text-left"}>
            <span className="inline-block p-2 rounded bg-gray-200 mb-2">
              {m.text}
            </span>
          </div>
        ))}
        {loading && <div>Bot is typing...</div>}
      </div>

      {/* Input */}
      <div className="p-4 border-t flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 rounded">
          Send
        </button>
      </div>
    </div>
  </div>
);
}
