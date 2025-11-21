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
    <div className="h-screen w-screen flex bg-gradient-to-br from-red-700 via-black to-red-900">
      {/* Sidebar */}
      <aside className="w-64 bg-black shadow-xl p-4 hidden md:flex flex-col items-center">
        <img
          src={<img src={`${process.env.PUBLIC_URL}/logo.png`}
          alt="logo"
          className="w-28 h-28 mb-4 rounded-full shadow"
        />
        <h2 className="text-xl font-bold mb-4 text-red-600">Eddiebot</h2>
        <button className="p-2 mb-2 rounded-xl bg-red-600 text-white shadow hover:bg-red-700 transition">
          New Chat
        </button>
      </aside>
      {/* Chat Section */}
      <main className="flex flex-col flex-1 h-full">

        <div className="flex justify-center md:hidden p-4 bg-black shadow">
          <img
          src={<img src={`${process.env.PUBLIC_URL}/logo.png`} 
          alt="Logo" 
          className="w-20 h-20 rounded-full shadow"
          />
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-xl p-3 rounded-2xl shadow text-sm whitespace-pre-wrap ${
                m.sender === "user"
                  ? "bg-red-600 text-white self-end ml-auto"
                  : "bg-white text-gray-800"
              }`}
            >
              {m.text}
            </div>
          ))}
          {loading && <div className="text-gray-500">Bot is typing...</div>}
        </div>


        {/* Input */}
        <div className="p-4 bg-black shadow-xl flex gap-3">
          <input
            className="flex-1 p-3 border border-gray-700 rounded-xl bg-gray-900 text-white shadow-sm placeholder-gray-400"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="px-5 py-3 bg-red-600 text-white rounded-xl shadow hover:bg-red-700"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}
