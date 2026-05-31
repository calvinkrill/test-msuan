import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Pin, 
  Trash2, 
  Edit3, 
  MoreHorizontal, 
  AlertTriangle, 
  Send, 
  Sparkles, 
  CheckCircle, 
  Smile,
  Globe,
  Tag,
  X
} from 'lucide-react';
import { store } from '../dataStore';
import { Post, ReactionType, PostComment, UserProfile } from '../types';

interface FeedListProps {
  currentUser: UserProfile;
  selectedTag: string;
  onSelectTag: (tag: string) => void;
  onRefresh: () => void;
}

export const FeedList: React.FC<FeedListProps> = ({ 
  currentUser, 
  selectedTag, 
  onSelectTag, 
  onRefresh 
}) => {
  const [newPostText, setNewPostText] = useState('');
  const [newPostMedia, setNewPostMedia] = useState('');
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  
  // Comments input mapped by Post ID
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  
  // Show all reaction emojis picker for a post
  const [showEmojisPostId, setShowEmojisPostId] = useState<string | null>(null);

  // Active filter
  const [filterType, setFilterType] = useState<'all' | 'pinned' | 'campus'>('all');

  // Submit fresh post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;
    store.createPost(currentUser.uid, newPostText, newPostMedia || undefined);
    setNewPostText('');
    setNewPostMedia('');
    onRefresh();
  };

  // Delete post
  const handleDeletePost = (id: string) => {
    store.deletePost(id, currentUser.uid);
    onRefresh();
  };

  // Start inline edit
  const startEdit = (post: Post) => {
    setEditingPostId(post.id);
    setEditingText(post.content);
  };

  // Save edit
  const handleSaveEdit = (postId: string) => {
    if (!editingText.trim()) return;
    store.editPost(postId, editingText, currentUser.uid);
    setEditingPostId(null);
    onRefresh();
  };

  // Pin post
  const handleTogglePin = (postId: string) => {
    store.togglePinPost(postId, currentUser.uid);
    onRefresh();
  };

  // Reaction picker submit
  const handleReaction = (postId: string, type: ReactionType) => {
    store.toggleReaction(postId, currentUser.uid, type);
    setShowEmojisPostId(null);
    onRefresh();
  };

  // Submit fresh comment
  const handleAddComment = (e: React.FormEvent, postId: string) => {
    e.preventDefault();
    const commentText = commentInputs[postId] || '';
    if (!commentText.trim()) return;
    store.addComment(postId, currentUser.uid, commentText);
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
    onRefresh();
  };

  // Flag post report back to server
  const handleFlagReport = (post: Post) => {
    const reason = window.prompt("Reason for flagging this content to moderators:");
    if (!reason) return;
    store.fileReport(currentUser.uid, 'post', post.id, post.userId, reason);
    window.alert("Thank you. Post flagged for administrative review.");
    onRefresh();
  };

  // Share count simulation
  const handleSimulateShare = (postId: string) => {
    store.posts = store.posts.map(p => {
      if (p.id === postId) {
        return { ...p, shares: (p.shares || 0) + 1 };
      }
      return p;
    });
    store.syncAll();
    window.alert("Post link copied to system clipboard!");
    onRefresh();
  };

  // Fetch posts filtered by tag, tab, or campus
  const getFilteredPosts = () => {
    let posts = [...store.posts];

    // Filter by tag if selected
    if (selectedTag) {
      posts = posts.filter(p => p.hashtags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase()));
    }

    // Filter by segment filter
    if (filterType === 'pinned') {
      posts = posts.filter(p => p.isPinned);
    } else if (filterType === 'campus') {
      posts = posts.filter(p => p.userCampus === currentUser.campus);
    }

    // Block List: filter out posts by blocked users
    const blockedList = store.connections[currentUser.uid]?.blocked || [];
    posts = posts.filter(p => !blockedList.includes(p.userId));

    // News Feed Algorithm: Pinned first, then sorted by timestamp
    return posts.sort((a,b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.timestamp - a.timestamp;
    });
  };

  const reactionEmojis: Record<ReactionType, { emoji: string; color: string }> = {
    like: { emoji: "👍", color: "text-blue-400" },
    love: { emoji: "❤️", color: "text-rose-400" },
    haha: { emoji: "😆", color: "text-yellow-400" },
    wow: { emoji: "😮", color: "text-teal-400" },
    sad: { emoji: "😢", color: "text-amber-300" },
    angry: { emoji: "😠", color: "text-red-500" }
  };

  return (
    <div className="space-y-6">
      {/* Create Post Card */}
      <div className="card-gold p-5 rounded-2xl text-left bg-gradient-to-r from-white/5 to-transparent">
        <h4 className="text-xs font-mono font-bold tracking-wider text-amber-400 uppercase mb-3 flex items-center gap-1.5">
          <Sparkles size={12} /> Live University Feed
        </h4>
        <form onSubmit={handleCreatePost} className="space-y-3">
          <textarea
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors placeholder-gray-500 min-h-[80px]"
            placeholder={`Say something to the ${currentUser.campus} community, ${currentUser.name.split(' ')[0]}...`}
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            required
          />

          <div className="flex flex-col sm:flex-row gap-2 justify-between items-stretch sm:items-center">
            <input
              type="url"
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-gray-300 placeholder-gray-600 focus:outline-none"
              placeholder="Attach visual link URL (optional)..."
              value={newPostMedia}
              onChange={(e) => setNewPostMedia(e.target.value)}
            />
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs py-2 px-5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send size={12} /> Post Feed
            </button>
          </div>
        </form>
      </div>

      {/* Tabs / Filter Controls */}
      <div className="flex justify-between items-center bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
        <div className="flex gap-1 w-full sm:w-auto">
          {(["all", "pinned", "campus"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`flex-1 sm:flex-initial py-1.5 px-4 rounded-lg font-bold uppercase tracking-wider text-[10px] transition-all cursor-pointer ${
                filterType === t 
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {t === "all" ? "Whole System" : t === "pinned" ? "Pins" : `Only ${currentUser.campus}`}
            </button>
          ))}
        </div>
        
        {selectedTag && (
          <button 
            onClick={() => onSelectTag('')}
            className="flex items-center gap-1 font-semibold text-amber-500 hover:text-amber-400 font-mono pr-2 cursor-pointer"
          >
            <Tag size={10} /> #{selectedTag} <X size={10} />
          </button>
        )}
      </div>

      {/* Posts List */}
      <div className="space-y-6">
        {getFilteredPosts().length > 0 ? (
          getFilteredPosts().map((post) => {
            const isOwn = post.userId === currentUser.uid;
            const userReactionObject = post.reactions.find(r => r.userId === currentUser.uid);
            
            return (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`card-gold p-6 rounded-2xl text-left bg-gradient-to-b relative ${post.isPinned ? 'border-2 border-amber-500/40 bg-[#120a03]' : 'from-white/5 to-transparent'}`}
              >
                {/* Pinned label */}
                {post.isPinned && (
                  <span className="absolute top-4 right-4 flex items-center gap-1 text-[9px] font-mono font-bold tracking-widest text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                    <Pin size={10} className="fill-amber-500" /> Pinned
                  </span>
                )}

                {/* Post Author info */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full border border-amber-500/35 overflow-hidden flex-shrink-0 bg-white/5">
                    {post.userPhoto ? (
                      <img src={post.userPhoto} alt={post.userName} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-amber-500/15 text-amber-400 font-bold flex items-center justify-center text-sm uppercase">
                        {post.userName[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-sm text-white font-sans">{post.userName}</span>
                      
                      {/* Badge / Verification */}
                      {post.isVerifiedUser && (
                        <CheckCircle size={13} className="text-amber-400 fill-amber-400/10" />
                      )}
                      
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 capitalize border border-amber-500/20">
                        {post.userRole}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-500 font-mono">
                      <span>{post.userCampus}</span>
                      <span>•</span>
                      <span>{new Date(post.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* Top corner actions dropdown */}
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleTogglePin(post.id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-amber-500 transition-colors cursor-pointer"
                      title="Toggle Pin"
                    >
                      <Pin size={13} className={post.isPinned ? "fill-amber-500 text-amber-500" : ""} />
                    </button>
                    
                    {isOwn ? (
                      <>
                        <button 
                          onClick={() => startEdit(post)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-amber-500 transition-colors cursor-pointer"
                        >
                          <Edit3 size={13} />
                        </button>
                        <button 
                          onClick={() => handleDeletePost(post.id)}
                          className="p-1.5 rounded-lg text-gray-500 hover:text-rose-500 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => handleFlagReport(post)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-amber-500 transition-colors cursor-pointer"
                        title="Report and Flag content"
                      >
                        <AlertTriangle size={13} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Edit input block */}
                {editingPostId === post.id ? (
                  <div className="space-y-3 my-3">
                    <textarea
                      className="w-full bg-white/5 border border-white/15 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-amber-500/40"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => setEditingPostId(null)}
                        className="px-3.5 py-1 text-xs text-gray-400 bg-white/5 rounded-lg cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleSaveEdit(post.id)}
                        className="px-4 py-1 text-xs text-black bg-amber-500 hover:bg-amber-400 rounded-lg font-bold cursor-pointer"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap">
                      {post.content.split(' ').map((word, i) => {
                        if (word.startsWith('#')) {
                          const cleanTag = word.replace(/[^a-zA-Z0-9]/g, '');
                          return (
                            <span 
                              key={i} 
                              onClick={() => onSelectTag(cleanTag)}
                              className="text-amber-400 hover:underline cursor-pointer font-semibold inline-block font-mono mr-1"
                            >
                              {word}
                            </span>
                          );
                        }
                        return word + ' ';
                      })}
                    </p>

                    {post.mediaUrl && (
                      <div className="rounded-xl overflow-hidden mb-4 border border-white/5 max-h-[300px]">
                        <img src={post.mediaUrl} alt="Attached asset" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </>
                )}

                {/* Reaction Status Displays */}
                <div className="flex justify-between items-center text-xs text-gray-500 mb-4 border-b border-white/5 pb-3">
                  {/* Aggregated Reactions Count */}
                  <div className="flex items-center gap-1 flex-wrap">
                    {post.reactions.length > 0 ? (
                      <>
                        <div className="flex -space-x-1">
                          {Array.from(new Set(post.reactions.map(r => r.type))).slice(0, 3).map(type => (
                            <span key={type} className="text-xs">{reactionEmojis[type].emoji}</span>
                          ))}
                        </div>
                        <span className="text-gray-400 font-bold ml-1 font-mono">
                          {post.reactions.length} reactions
                        </span>
                      </>
                    ) : (
                      <span className="text-[11px] text-gray-600">No reactions yet</span>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <span>{post.comments?.length || 0} comments</span>
                    <span>{post.shares || 0} shares</span>
                  </div>
                </div>

                {/* Actions Toolbar (React, Comment, Share) */}
                <div className="flex justify-between items-center gap-1 mb-4 relative">
                  {/* Reaction Button with Emoji Dropdown Hover/Toggle */}
                  <div className="relative">
                    <button
                      onClick={() => setShowEmojisPostId(showEmojisPostId === post.id ? null : post.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold transition-all cursor-pointer ${
                        userReactionObject 
                          ? reactionEmojis[userReactionObject.type as ReactionType].color 
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {userReactionObject ? (
                        <>
                          <span>{reactionEmojis[userReactionObject.type as ReactionType].emoji}</span>
                          <span className="capitalize">{userReactionObject.type}</span>
                        </>
                      ) : (
                        <>
                          <Smile size={14} />
                          <span>React</span>
                        </>
                      )}
                    </button>

                    {/* Emoji Select Dropdown Overlay */}
                    <AnimatePresence>
                      {showEmojisPostId === post.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: -5, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute bottom-10 left-0 bg-black/95 border-2 border-amber-500/30 rounded-full p-2 flex gap-1.5 z-40 shadow-xl backdrop-blur-md"
                        >
                          {(Object.keys(reactionEmojis) as ReactionType[]).map(type => (
                            <button
                              key={type}
                              onClick={() => handleReaction(post.id, type)}
                              className="text-lg hover:scale-130 transition-transform active:scale-95 p-1 flex items-center justify-center cursor-pointer"
                              title={type}
                            >
                              {reactionEmojis[type].emoji}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Comment trigger */}
                  <button 
                    onClick={() => {
                      const input = document.getElementById(`input_comment_${post.id}`);
                      input?.focus();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-400 hover:text-white transition-all cursor-pointer"
                  >
                    <MessageSquare size={14} />
                    <span>Comment</span>
                  </button>

                  {/* Share link simulated copy */}
                  <button
                    onClick={() => handleSimulateShare(post.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-400 hover:text-white transition-all cursor-pointer"
                  >
                    <Share2 size={14} />
                    <span>Share</span>
                  </button>
                </div>

                {/* Subsystem: Comment List Block */}
                <div className="space-y-3 pt-3 border-t border-white/5 bg-black/10 rounded-xl p-3">
                  {post.comments && post.comments.length > 0 && (
                    <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-2.5 text-xs text-left group">
                          <div className="w-7 h-7 rounded-full border border-white/10 overflow-hidden flex-shrink-0 bg-white/5">
                            {comment.userPhoto ? (
                              <img src={comment.userPhoto} alt={comment.userName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center text-[10px]">
                                {comment.userName[0]}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 bg-white/5 rounded-2xl p-2.5 relative">
                            {/* Comment Meta Info */}
                            <div className="flex justify-between items-center mb-1">
                              <span className="font-bold text-gray-200">{comment.userName}</span>
                              <span className="text-[9px] text-gray-600 font-mono">
                                {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>

                            {/* Comment message */}
                            <p className="text-gray-300 pr-4 leading-normal">
                              {comment.content.split(' ').map((word, k) => {
                                if (word.startsWith('@')) {
                                  return (
                                    <span key={k} className="text-amber-400 font-semibold font-mono underline mr-0.5">
                                      {word}
                                    </span>
                                  );
                                }
                                return word + ' ';
                              })}
                            </p>

                            {/* Delete Comment */}
                            {(comment.userId === currentUser.uid || isOwn) && (
                              <button
                                onClick={() => store.deleteComment(post.id, comment.id, currentUser.uid)}
                                className="absolute right-2.5 top-2.5 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-rose-500 transition-opacity cursor-pointer"
                                title="Delete comment"
                              >
                                <Trash2 size={11} />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add comment Form */}
                  <form 
                    onSubmit={(e) => handleAddComment(e, post.id)}
                    className="flex gap-2 items-center"
                  >
                    <input
                      id={`input_comment_${post.id}`}
                      type="text"
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-amber-500/30"
                      placeholder="Write educational reply... tag @peers"
                      value={commentInputs[post.id] || ''}
                      onChange={(e) => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))}
                      required
                    />
                    <button
                      type="submit"
                      className="p-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black cursor-pointer transition-colors"
                    >
                      <Send size={12} />
                    </button>
                  </form>
                </div>
              </motion.div>
            );
          })
        ) : (
          <div className="p-12 text-center card-gold rounded-2xl">
            <Globe className="mx-auto text-gray-700 mb-3" size={32} />
            <p className="text-gray-400 font-medium">No posts matched selected community parameters.</p>
            <p className="text-xs text-gray-600 mt-1">Be the first to create a system announcement or general campus vibe!</p>
          </div>
        )}
      </div>
    </div>
  );
};
