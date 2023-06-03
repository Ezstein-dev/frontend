import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [clientId, setClientId] = useState(Math.floor(new Date().getTime() / 1000));
  const [websckt, setWebsckt] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const url = `ws://localhost:8000/ws/${clientId}`;
    const ws = new WebSocket(url);

    ws.onopen = () => {
      // Send the "Connected" message
      ws.send("Connected");
    };

    ws.onmessage = (event) => {
      const receivedMessage = JSON.parse(event.data);

      // Check if received message is an object
      if (typeof receivedMessage === "object") {
        setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      }
    };




    setWebsckt(ws);

    // Clean up WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, [clientId]);

  const sendMessage = () => {
    if (websckt && message.trim() !== "") {
      websckt.send(message);
      setMessage("");
    }
  };


  return (
    <div className="container">
      <h1>Chat</h1>
      <h2>Your client ID: {clientId}</h2>
      <div className="chat-container">
        <div className="chat">
          {messages.map((value, index) => {
            if (value.client_id === clientId) {
              return (
                <div key={index} className="my-message-container">
                  <div className="message-content my-message">
                    <p className="client">{value.client_id}</p>  
                    <p className="message">{value.message}</p>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={index} className="another-message-container">
                  <div className="message-content another-message">
                    <p className="client">{value.client_id}</p>  
                    <p className="message">{value.message}</p>
                  </div>
                </div>
              );
            }
          })}
        </div>


        <div className="input-chat-container">
          <input
            className="input-chat"
            type="text"
            placeholder="Chat message ..."
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <button className="submit-chat" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
