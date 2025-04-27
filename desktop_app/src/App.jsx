import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

export default function App() {
  const backend = window.env?.BACKEND || 'http://localhost:5000';

  /* ---------- state ---------- */
  const [servers,  setServers]  = useState([]);
  const [channels, setChannels] = useState([]);
  const [messages, setMessages] = useState([]);

  const [currentServer,  setCurrentServer]  = useState(null);
  const [currentChannel, setCurrentChannel] = useState(null);

  const [newMsg, setNewMsg]   = useState('');
  const [replyTo, setReplyTo] = useState(null);        // ← parent message obj

  const socketRef = useRef(null);

  /* ---------- helpers ---------- */
  const join = id => socketRef.current?.emit('channel:join', id);
  const leave = id => socketRef.current?.emit('channel:leave', id);

  /* ---------- first load ---------- */
  useEffect(() => {
    fetch(`${backend}/users/1/servers`).then(r => r.json()).then(setServers);
  }, [backend]);

  /* ---------- socket init ---------- */
  useEffect(() => {
    socketRef.current = io(backend.replace('http', 'ws'));
    return () => socketRef.current.disconnect();
  }, [backend]);

  /* ---------- pick server ---------- */
  const pickServer = id => {
    setCurrentServer(id);
    setCurrentChannel(null);
    fetch(`${backend}/servers/${id}/channels`)
      .then(r => r.json()).then(setChannels);
  };

  /* ---------- pick channel ---------- */
  const pickChannel = id => {
    if (currentChannel) leave(currentChannel);
    setCurrentChannel(id);
    setReplyTo(null);
    fetch(`${backend}/channels/${id}/messages`)
      .then(r => r.json()).then(setMessages);

    join(id);
    socketRef.current.off('message:new').on('message:new', m => {
      setMessages(prev =>
        prev.some(x => x.message_id === m.message_id) ? prev : [...prev, m]);
    });
  };

  /* ---------- send ---------- */
  const send = () => {
    if (!newMsg.trim() || !currentChannel) return;

    fetch(`${backend}/channels/${currentChannel}/messages`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        content: newMsg,
        author_id: 1,
        parent_message_id: replyTo?.message_id || null
      })
    }).catch(console.error);

    setNewMsg('');
    setReplyTo(null);
  };

  /* ---------- autoscroll ---------- */
  useEffect(() => {
    const p = document.getElementById('msgPane');
    p && (p.scrollTop = p.scrollHeight);
  }, [messages]);

  /* ---------- render ---------- */
  return (
    <div className="h-screen flex">

      {/* server rail */}
      <aside className="w-16 bg-[#1e1f22] flex flex-col items-center py-2 space-y-2">
        {servers.map(s => (
          <button key={s.server_id}
            onClick={()=>pickServer(s.server_id)}
            className={`w-12 h-12 rounded-full flex items-center justify-center
              text-sm font-bold transition
              ${currentServer===s.server_id
                 ? 'bg-indigo-500 text-white'
                 : 'bg-[#313338] text-gray-300 hover:bg-indigo-400 hover:text-white'}`}>
            {s.name[0].toUpperCase()}
          </button>
        ))}
      </aside>

      {/* channel list */}
      <aside className="w-56 bg-[#2b2d31] border-r border-[#1e1f22] py-3 px-2">
        <h4 className="text-gray-400 text-xs px-2 mb-2 tracking-widest">TEXT CHANNELS</h4>
        {channels.map(c => (
          <div key={c.channel_id}
            onClick={()=>pickChannel(c.channel_id)}
            className={`flex items-center gap-1 cursor-pointer rounded px-2 py-1 text-sm
              ${currentChannel===c.channel_id
                 ? 'bg-[#404249] text-white'
                 : 'text-gray-300 hover:bg-[#3b3d44]'}`}>
            <span className="text-gray-400">#</span>
            <span className="truncate">{c.name}</span>
          </div>
        ))}
      </aside>

      {/* chat area */}
      <main className="flex-1 flex flex-col">
        {/* header */}
        <header className="h-12 bg-[#313338] flex items-center px-4
                           text-lg font-semibold border-b border-[#1e1f22]">
          <span className="text-gray-400 mr-2">#</span>
          {channels.find(c=>c.channel_id===currentChannel)?.name || 'Select a channel'}
        </header>

        {/* messages */}
        <div id="msgPane" className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map(m => (
            <div key={m.message_id}
                 className={`flex gap-3 ${m.parent_message_id ? 'ml-10' : ''}`}>
              <div className="w-9 h-9 rounded-full bg-indigo-600
                              flex items-center justify-center text-sm font-bold">
                {m.username[0].toUpperCase()}
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-semibold text-white">{m.username}</span>
                  <span className="text-xs text-gray-400">
                    {new Date(m.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                  </span>
                  <button onClick={()=>setReplyTo(m)}
                          className="text-xs text-indigo-400 hover:underline ml-2">
                    Reply
                  </button>
                </div>
                <span className="text-gray-200">{m.content}</span>
              </div>
            </div>
          ))}
        </div>

        {/* reply banner */}
        {replyTo &&
          <div className="bg-[#39414d] text-gray-200 px-4 py-1 flex items-center gap-2">
            Replying to <span className="font-semibold">{replyTo.username}</span>
            <span className="truncate italic max-w-[200px]">{replyTo.content}</span>
            <button onClick={()=>setReplyTo(null)}
                    className="ml-auto text-gray-400 hover:text-white">×</button>
          </div>
        }

        {/* input */}
        <div className="h-14 bg-[#383a40] flex items-center px-4 gap-2">
          <input
            className="flex-1 bg-[#404249] text-gray-200 rounded h-8 px-3 outline-none"
            placeholder={currentChannel
              ? `Message #${channels.find(c=>c.channel_id===currentChannel)?.name}`
              : 'Select a channel'}
            value={newMsg}
            onChange={e=>setNewMsg(e.target.value)}
            onKeyDown={e=>e.key==='Enter' && send()}
            disabled={!currentChannel}
          />
          <button
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-500
                       text-white rounded px-4 py-1"
            onClick={send}
            disabled={!newMsg.trim() || !currentChannel}>
            Send
          </button>
        </div>
      </main>
    </div>
  );
}
/* ---------- end App.jsx ---------- */
