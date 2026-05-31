import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  MessageSquare, 
  Users, 
  Check, 
  CheckCheck, 
  Plus, 
  Image, 
  Hash, 
  Smile, 
  Search,
  Sparkles,
  X
} from 'lucide-react';
import { store } from '../dataStore';
import { UserProfile, DirectMessage, GroupChat } from '../types';

interface MessagingHubProps {
  currentUser: UserProfile;
  onRefresh: () => void;
}

export const MessagingHub: React.FC<MessagingHubProps> = ({ currentUser, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'private' | 'groups'>('private');
  const [selectedPeerId, setSelectedPeerId] = useState<string | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [inputMedia, setInputMedia] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Typing simulator state
  const [isPeerTyping, setIsPeerTyping] = useState(false);

  // Group Create States
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on updates
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedPeerId, selectedGroupId, isPeerTyping, store.directMessages, store.groups]);

  // Peer Auto Response generator
  const triggerPeerSimulationResponse = (peerId: string, userText: string) => {
    setIsPeerTyping(true);
    
    setTimeout(() => {
      setIsPeerTyping(false);
      const peer = store.profiles.find(p => p.uid === peerId);
      const greetingName = currentUser.name.split(' ')[0];
      
      let replyText = `Thanks for writing, ${greetingName}! Let's coordinate on our student forums. I'll review and get back to you soon.`;
      
      if (userText.toLowerCase().includes('hello') || userText.toLowerCase().includes('hi')) {
        replyText = `Hello ${greetingName}! Hope your semester in ${currentUser.campus} is going splendidly. What are we collaborating on today?`;
      } else if (userText.toLowerCase().includes('research') || userText.toLowerCase().includes('project')) {
        replyText = `Fascinating. I am currently reviewing research programs on sustainable technology. Let's form a team for the upcoming MSU hackathon!`;
      } else if (userText.toLowerCase().includes('hackathon') || userText.toLowerCase().includes('code')) {
        replyText = `Yes! Check out our 'MSU Hackathon 2026' group forum on the sidebar! I just joined it.`;
      }

      store.sendDirectMessage(peerId, currentUser.uid, replyText);
      onRefresh();
    }, 3000);
  };

  // Submit Private DM
  const handleSendPrivate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPeerId || !inputMessage.trim()) return;
    
    const textMsg = inputMessage;
    store.sendDirectMessage(currentUser.uid, selectedPeerId, textMsg, inputMedia || undefined);
    
    setInputMessage('');
    setInputMedia('');
    onRefresh();

    // Trigger responder typing
    triggerPeerSimulationResponse(selectedPeerId, textMsg);
  };

  // Submit Group Chat DM
  const handleSendGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGroupId || !inputMessage.trim()) return;

    store.postGroupMessage(selectedGroupId, currentUser.uid, inputMessage);
    
    setInputMessage('');
    onRefresh();

    // Group reply simulation
    setIsPeerTyping(true);
    setTimeout(() => {
      setIsPeerTyping(false);
      const listRepli = [
        "Let's work collaboratively!",
        "Agreed! Full system unity is the key to progress.",
        "Check files and research logs. Ready on my side."
      ];
      const randomMsg = listRepli[Math.floor(Math.random() * listRepli.length)];
      
      // Random member sends reply
      const members = store.groups.find(g => g.id === selectedGroupId)?.members || [];
      const randMember = members.find(m => m !== currentUser.uid) || "admin_user";
      
      store.postGroupMessage(selectedGroupId, randMember, randomMsg);
      onRefresh();
    }, 2500);
  };

  // Create organization group
  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    store.createGroup(newGroupName, newGroupDesc, undefined, currentUser.uid);
    setNewGroupName('');
    setNewGroupDesc('');
    setShowCreateGroup(false);
    onRefresh();
  };

  // Setup unread count mapping
  const getUnreadDMsCount = (peerId: string) => {
    const chatId = store.getChatPairId(currentUser.uid, peerId);
    return store.directMessages.filter(m => m.chatId === chatId && m.senderId !== currentUser.uid && !m.seen).length;
  };

  // Filter peers by search
  const getPeerList = () => {
    return store.profiles
      .filter(p => p.uid !== currentUser.uid)
      .filter(p => !store.connections[currentUser.uid]?.blocked?.includes(p.uid))
      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.campus.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  // Filter group associations
  const getGroupList = () => {
    return store.groups.filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()));
  };

  // Fetch DM messages of specific chat
  const getPrivateMessages = () => {
    if (!selectedPeerId) return [];
    const pairId = store.getChatPairId(currentUser.uid, selectedPeerId);
    // Mark seen on fetch
    store.markMessagesAsRead(pairId, currentUser.uid);
    return store.directMessages.filter(m => m.chatId === pairId);
  };

  const getActiveGroup = () => {
    return store.groups.find(g => g.id === selectedGroupId);
  };

  const activePeer = store.profiles.find(p => p.uid === selectedPeerId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 bg-black/60 border border-white/10 rounded-3xl overflow-hidden min-h-[500px] text-left">
      {/* Sidebar List panel */}
      <div className="border-r border-white/10 p-5 flex flex-col gap-4">
        {/* Toggle Hub layout */}
        <div className="flex bg-white/5 p-1 rounded-xl gap-1">
          <button
            onClick={() => { setActiveTab('private'); setSelectedGroupId(null); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'private' ? 'bg-amber-500 text-black font-semibold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <MessageSquare size={13} /> DMs
          </button>
          <button
            onClick={() => { setActiveTab('groups'); setSelectedPeerId(null); }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === 'groups' ? 'bg-amber-500 text-black font-semibold' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users size={13} /> Orgs ({store.groups.length})
          </button>
        </div>

        {/* Search tool overlay */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-3 text-gray-500" />
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none"
            placeholder="Filter peer list or group..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Items Listing Column */}
        <div className="flex-1 overflow-y-auto max-h-[340px] space-y-2 pr-1">
          {activeTab === 'private' ? (
            getPeerList().map(peer => {
              const isActive = selectedPeerId === peer.uid;
              const unread = getUnreadDMsCount(peer.uid);
              return (
                <div
                  key={peer.uid}
                  onClick={() => { setSelectedPeerId(peer.uid); setSelectedGroupId(null); }}
                  className={`p-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                    isActive ? 'bg-gradient-to-r from-amber-500/20 to-transparent border border-amber-500/20' : 'bg-white/5 hover:bg-white/10 border border-transparent'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full border border-amber-500/30 overflow-hidden bg-white/5 relative">
                    {peer.photoURL ? (
                      <img src={peer.photoURL} alt={peer.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-amber-500/10 text-amber-500 font-bold text-xs flex items-center justify-center">
                        {peer.name[0]}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-black" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-bold text-white truncate">{peer.name}</h4>
                      {unread > 0 && (
                        <span className="text-[9px] font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded-full leading-none shrink-0 font-mono">
                          {unread}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-500 truncate">{peer.campus} • {peer.role}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <>
              {getGroupList().map(group => {
                const isActive = selectedGroupId === group.id;
                const isMember = group.members.includes(currentUser.uid);
                return (
                  <div
                    key={group.id}
                    onClick={() => { setSelectedGroupId(group.id); setSelectedPeerId(null); }}
                    className={`p-3 rounded-xl flex items-center gap-3 transition-all cursor-pointer ${
                      isActive ? 'bg-gradient-to-r from-amber-500/20 to-transparent border border-amber-500/20' : 'bg-white/5 hover:bg-white/10 border border-transparent'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl border border-amber-500/30 overflow-hidden bg-white/5 flex items-center justify-center text-amber-500 font-bold text-sm">
                      <Hash size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-white truncate">{group.name}</h4>
                      <p className="text-[9px] text-gray-500 truncate">{group.members.length} members {!isMember && '• Guest'}</p>
                    </div>
                  </div>
                );
              })}

              <button
                onClick={() => setShowCreateGroup(true)}
                className="w-full mt-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-bold rounded-xl border border-amber-500/20 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
              >
                <Plus size={13} /> Register New Student Org
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Messaging Chat Window */}
      <div className="col-span-2 flex flex-col min-h-[400px] bg-white/[0.01]">
        {selectedPeerId || selectedGroupId ? (
          <>
            {/* Header of Chat */}
            <div className="border-b border-white/10 p-4 bg-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                {selectedPeerId && activePeer ? (
                  <>
                    <div className="w-9 h-9 rounded-full border border-amber-500/30 overflow-hidden">
                      {activePeer.photoURL ? (
                        <img src={activePeer.photoURL} alt={activePeer.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-amber-500/15 text-amber-500 font-bold flex items-center justify-center text-[10px]">
                          {activePeer.name[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1">
                        {activePeer.name}
                        {activePeer.isVerified && <Sparkles size={11} className="text-amber-500" />}
                      </h4>
                      <p className="text-[9px] text-green-500 font-mono">● Online • Connected</p>
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="text-xs font-bold text-white"># {getActiveGroup()?.name}</h4>
                    <p className="text-[9px] text-gray-400">{getActiveGroup()?.members.length} Active Members • {getActiveGroup()?.description}</p>
                  </>
                )}
              </div>
            </div>

            {/* Message Feed Display */}
            <div className="flex-1 p-5 overflow-y-auto max-h-[300px] space-y-4">
              {selectedPeerId ? (
                getPrivateMessages().length > 0 ? (
                  getPrivateMessages().map((msg) => {
                    const isOwn = msg.senderId === currentUser.uid;
                    return (
                      <div key={msg.id} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                        <div className={`p-3 rounded-2xl max-w-[80%] text-xs border ${
                          isOwn 
                            ? 'bg-amber-500 text-black font-semibold rounded-tr-none border-amber-600' 
                            : 'bg-white/5 text-gray-200 rounded-tl-none border-white/10'
                        }`}>
                          <p className="leading-relaxed">{msg.text}</p>
                          {msg.mediaUrl && (
                            <img src={msg.mediaUrl} alt="File Link Preview" className="rounded-lg mt-2 cursor-pointer max-w-full h-auto max-h-32 object-cover border border-black/20" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-[8px] text-gray-500 uppercase tracking-widest font-mono mt-1 px-1">
                          <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          {isOwn && (
                            msg.seen ? <CheckCheck size={11} className="text-amber-400" /> : <Check size={11} />
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center p-8 text-gray-600 text-xs">
                    No historic dialogues with this peer. Introduce yourself!
                  </div>
                )
              ) : (
                getActiveGroup()?.messages.map((msg) => {
                  const isOwn = msg.senderId === currentUser.uid;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}>
                      <div className="text-[9px] text-gray-500 font-bold mb-0.5 px-1">{msg.senderName}</div>
                      <div className={`p-3 rounded-2xl max-w-[80%] text-xs border ${
                        isOwn 
                          ? 'bg-amber-500 text-black font-semibold rounded-tr-none border-amber-600' 
                          : 'bg-white/5 text-gray-200 rounded-tl-none border-white/10'
                      }`}>
                        <p>{msg.text}</p>
                      </div>
                      <span className="text-[8px] text-gray-600 font-mono mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}

              {/* Typing Simulator Bubble */}
              {isPeerTyping && (
                <div className="flex flex-col items-start pr-12 animate-pulse">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-xs text-gray-300 rounded-tl-none flex items-center gap-1.5 font-mono">
                    <span className="animate-bounce">●</span>
                    <span className="animate-bounce [animation-delay:0.2s]">●</span>
                    <span className="animate-bounce [animation-delay:0.4s]">●</span>
                    <span className="text-[9px] text-amber-500 ml-1 font-bold lowercase tracking-wider">typing...</span>
                  </div>
                </div>
              )}

              <div ref={scrollRef} />
            </div>

            {/* Editor input form box */}
            <form 
              onSubmit={selectedPeerId ? handleSendPrivate : handleSendGroup}
              className="p-4 border-t border-white/10 bg-black/40 space-y-2"
            >
              {selectedPeerId && (
                <input
                  type="url"
                  placeholder="Attach media URL / Link snapshot (optional)..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-[10px] text-gray-400 focus:outline-none"
                  value={inputMedia}
                  onChange={(e) => setInputMedia(e.target.value)}
                />
              )}
              <div className="flex gap-2.5">
                <input
                  type="text"
                  placeholder="Type secure academic message..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/30"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-semibold cursor-pointer transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <MessageSquare className="text-gray-700 mb-3" size={38} />
            <h4 className="text-gray-400 font-bold text-sm">Mindanao Academic Linkage Messaging Hub</h4>
            <p className="text-xs text-gray-600 mt-1 max-w-sm">
              Connect with fellow students, discuss research logs, join community debates, and coordinate sports meetups. Select a contact from side grid!
            </p>
          </div>
        )}
      </div>

      {/* Modal: Create Org Group */}
      <AnimatePresence>
        {showCreateGroup && (
          <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-left">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md card-gold p-6 rounded-3xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-metallic-gold">Register Student Organization</h3>
                <button onClick={() => setShowCreateGroup(false)} className="text-gray-400 hover:text-white cursor-pointer"><X size={18} /></button>
              </div>

              <form onSubmit={handleCreateGroupSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1.5">Org / Society Name</label>
                  <input
                    type="text"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                    placeholder="e.g. MSU Main Debate Society"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-1.5">Purpose & Description</label>
                  <textarea
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none"
                    placeholder="Describe organization goals, meeting timelines, and events..."
                    value={newGroupDesc}
                    onChange={(e) => setNewGroupDesc(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-amber-500 text-black text-xs font-bold py-3.5 rounded-xl hover:bg-amber-400 transition-colors cursor-pointer text-center"
                >
                  Create and Publish Society Portal
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
