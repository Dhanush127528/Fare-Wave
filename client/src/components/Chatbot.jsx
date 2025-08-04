import React, { useState, useEffect, useRef } from "react";

const Chatbot = () => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const recognitionRef = useRef(null);
  const chatContainerRef = useRef(null); // NEW: ref for auto scroll

  // Auto-scroll on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser doesn't support Speech Recognition");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setTranscript(spokenText);
      handleSend(spokenText); // send spoken command
    };

    recognition.onerror = (event) => {
      console.error("Voice error:", event);
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      recognitionRef.current.start();
    }
  };

  // Download QR code function
  const downloadQR = (qrData, filename = "ticket.png") => {
    const link = document.createElement("a");
    link.href = qrData;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Send message to backend
  const handleSend = async (msg = inputText || transcript) => {
    if (!msg.trim()) return;

    setChatMessages((prev) => [...prev, { from: "user", text: msg }]);
    setInputText("");
    setTranscript("");

    try {
      const res = await fetch("http://localhost:5000/api/chatbot/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, userId: "user123" }),
      });

      const data = await res.json();

      setChatMessages((prev) => [
        ...prev,
        { from: "bot", text: data.reply },
        ...(data.qrCode ? [{ from: "bot", text: "qr", qr: data.qrCode, originalMessage: msg }] : []),
      ]);
    } catch (err) {
      console.error("Backend error:", err);
      setChatMessages((prev) => [...prev, { from: "bot", text: "Something went wrong!" }]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 p-4 rounded-xl shadow-md">
      {/* Chat Display */}
      <div
        ref={chatContainerRef}
        className="flex-1 bg-white rounded-lg p-3 overflow-y-auto space-y-2 max-h-[65vh] border"
      >
        {chatMessages.map((msg, idx) => (
          <div
            key={idx}
            className={`text-sm px-3 py-2 rounded-xl max-w-[80%] break-words ${
              msg.from === "user"
                ? "bg-green-200 self-end text-right ml-auto"
                : "bg-gray-200 self-start text-left mr-auto"
            }`}
          >
            {msg.text === "qr" && msg.qr ? (
              <div className="flex flex-col items-center space-y-2">
                <img src={msg.qr} alt="QR Code" className="w-32 h-32" />
                <button
                  onClick={() =>
                    downloadQR(
                      msg.qr,
                      `ticket_${msg.originalMessage.replace(/\s+/g, "_").toLowerCase()}.png`
                    )
                  }
                  className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Download Ticket 🎟️
                </button>
              </div>
            ) : (
              msg.text
            )}
          </div>
        ))}
      </div>

      {/* Input + Voice */}
      <div className="mt-3 flex gap-2 items-center">
        <input
          type="text"
          className="flex-1 border px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Type a command..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={() => handleSend()}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
        >
          Send
        </button>
        <button
          onClick={startListening}
          disabled={listening}
          className={`p-2 text-white text-sm rounded-lg ${
            listening ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          🎙️
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
