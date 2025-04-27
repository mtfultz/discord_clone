import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export default function App() {
  const backend = window.env.BACKEND;
  const [servers, setServers]   = useState([]);
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);
  const [currentServer, setCurrentServer]   = useState(null);
  const [currentChannel, setCurrentChannel] = useState(null);
  const [socket, setSocket] = useState(null);
  const [newMsg, setNewMsg] = useState('');

  /* initial load: servers for user #1 */
  useEffect(() => {
    fetch(`${backend}/users/1/servers`)
      .then(r => r.json()).then(setServers);
  }, []);

  /* when server picked, load channels */
  const pickServer = id => {
    setCurrentServer(id);
    fetch(`${backend}/servers/${id}/channels`)
      .then(r => r.json()).then(setChannels);
  };

  /* when channel picked, open WS room & fetch history */
  const pickChannel = id => {
    setCurrentChannel(id);
    fetch(`${backend}/channels/${id}/messages`)
      .then(r => r.json()).then(setMessages);

    /* reset socket */
    if (socket) socket.disconnect();
    const s = io(backend.replace('http', 'ws'));
    s.emit('channel:join', id);
    s.on('message:new', m => setMessages(prev => [...prev, m]));
    setSocket(s);
  };

  /* send message */
  const send = () => {
    if (!newMsg.trim() || !currentChannel) return;

    fetch(`${backend}/channels/${currentChannel}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: newMsg, author_id: 1 })
    })
    .catch(console.error);

    setNewMsg('');            // clear input, but DON'T append here
  };

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif' }}>
      {/* Servers */}
      <aside style={{ width: 150, borderRight: '1px solid #aaa', padding: 10 }}>
        <h4>Servers</h4>
        {servers.map(s => (
          <div key={s.server_id}
               style={{ cursor: 'pointer', margin: '6px 0',
                        fontWeight: currentServer===s.server_id? 'bold':'normal' }}
               onClick={() => pickServer(s.server_id)}>
            {s.name}
          </div>
        ))}
      </aside>

      {/* Channels */}
      <aside style={{ width: 200, borderRight: '1px solid #aaa', padding: 10 }}>
        <h4>Channels</h4>
        {channels.map(c => (
          <div key={c.channel_id}
               style={{ cursor: 'pointer', margin: '4px 0',
                        fontWeight: currentChannel===c.channel_id? 'bold':'normal' }}
               onClick={() => pickChannel(c.channel_id)}>
            #{c.name}
          </div>
        ))}
      </aside>

      {/* Chat */}
      <main style={{ flex: 1, display:'flex', flexDirection:'column' }}>
        <div style={{ flex: 1, overflowY:'auto', padding: 10 }}>
          {messages.map(m => (
            <div key={m.message_id} style={{ margin:'4px 0' }}>
              <strong>{m.username}:</strong> {m.content}
            </div>
          ))}
        </div>
        <div style={{ display:'flex', borderTop:'1px solid #aaa' }}>
          <input style={{ flex:1, fontSize:16, padding:8, border:'none' }}
                 value={newMsg}
                 onChange={e=>setNewMsg(e.target.value)}
                 onKeyDown={e=>e.key==='Enter' && send()} />
          <button onClick={send} style={{ padding:'8px 12px' }}>Send</button>
        </div>
      </main>
    </div>
  );
}
