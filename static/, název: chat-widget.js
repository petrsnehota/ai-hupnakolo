<script>
  // Zobrazit pouze pro admina (např. s parametrem v URL)
  const urlParams = new URLSearchParams(window.location.search);
  if (!urlParams.has('chat')) {
    console.log('Chat bublina je vypnutá');
  } else {
    document.write(`
      <style>
        #chat-container {
          position: fixed;
          bottom: 20px;
          left: 20px;
          width: 300px;
          max-height: 400px;
          background: white;
          border: 1px solid #ccc;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          display: flex;
          flex-direction: column;
          font-family: sans-serif;
          z-index: 9999;
        }

        #chat-header {
          background: #222;
          color: white;
          padding: 10px;
          font-weight: bold;
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
        }

        #chat-messages {
          padding: 10px;
          flex: 1;
          overflow-y: auto;
          font-size: 14px;
        }

        #chat-input {
          display: flex;
          border-top: 1px solid #ccc;
        }

        #chat-input input {
          flex: 1;
          border: none;
          padding: 10px;
          font-size: 14px;
        }

        #chat-input button {
          background: #222;
          color: white;
          border: none;
          padding: 10px;
          cursor: pointer;
        }
      </style>

      <div id="chat-container">
        <div id="chat-header">💬 Poradce Hupnakolo.cz</div>
        <div id="chat-messages"></div>
        <div id="chat-input">
          <input type="text" id="user-input" placeholder="Zeptejte se na produkt...">
          <button onclick="sendMessage()">Odeslat</button>
        </div>
      </div>
    `);
  }

  async function sendMessage() {
    const input = document.getElementById('user-input');
    const message = input.value;
    if (!message) return;

    const messagesDiv = document.getElementById('chat-messages');
    messagesDiv.innerHTML += `<div><strong>Vy:</strong> ${message}</div>`;
    input.value = '';

    try {
      const response = await fetch("https://ai-hupnakolo.onrender.com/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();
      messagesDiv.innerHTML += `<div><strong>Bot:</strong> ${data.reply || data.error}</div>`;
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    } catch (error) {
      messagesDiv.innerHTML += `<div><strong>Chyba:</strong> ${error.message}</div>`;
    }
  }
</script>
