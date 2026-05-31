import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, X, Heart, Flame, ThumbsUp, Eye } from 'lucide-react';
import { store } from '../dataStore';
import { Story } from '../types';

interface StoryCarouselProps {
  currentUserId: string;
  onRefresh: () => void;
}

export const StoryCarousel: React.FC<StoryCarouselProps> = ({ currentUserId, onRefresh }) => {
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [inputUrl, setInputUrl] = useState('');

  const activeStories = store.getActiveStories();

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl) return;
    store.uploadStory(currentUserId, inputUrl);
    setInputUrl('');
    setShowUploadModal(false);
    onRefresh();
  };

  const handleOpenStory = (story: Story) => {
    setActiveStory(story);
    store.viewStory(story.id, currentUserId);
    onRefresh();
  };

  const handleReactStory = (emoji: string) => {
    if (!activeStory) return;
    
    // Toggle/Add emoji reaction
    const storyIdx = store.stories.findIndex(s => s.id === activeStory.id);
    if (storyIdx !== -1) {
      const existingReactionIndex = store.stories[storyIdx].reactions.findIndex(r => r.userId === currentUserId);
      if (existingReactionIndex !== -1) {
        store.stories[storyIdx].reactions[existingReactionIndex].reaction = emoji;
      } else {
        store.stories[storyIdx].reactions.push({ userId: currentUserId, reaction: emoji });
      }
      
      // Notify the story owner
      if (activeStory.userId !== currentUserId) {
        store.sendNotification(
          activeStory.userId,
          currentUserId,
          "post_reaction",
          "Story Reacted",
          `reacted ${emoji} to your campus story!`,
          activeStory.id
        );
      }
      setActiveStory({ ...store.stories[storyIdx] });
      store.syncAll();
      onRefresh();
    }
  };

  const userHasStory = activeStories.some(s => s.userId === currentUserId);

  return (
    <div className="w-full">
      {/* Scrollable Story Circular Track */}
      <div className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 scrollbar-none snap-x mb-2 text-left">
        {/* Create Story Circle */}
        <div className="flex-shrink-0 flex flex-col items-center snap-start">
          <button
            onClick={() => setShowUploadModal(true)}
            className="w-16 h-16 rounded-full border-2 border-dashed border-amber-500/40 hover:border-amber-500/90 bg-amber-500/5 hover:bg-amber-500/10 flex items-center justify-center text-amber-500 hover:scale-105 transition-all cursor-pointer relative"
          >
            <Plus size={24} />
          </button>
          <span className="text-[10px] text-gray-400 mt-1.5 font-bold">Add Story</span>
        </div>

        {/* Existing Stories Circular Cards */}
        {activeStories.map((story) => {
          const isOwn = story.userId === currentUserId;
          return (
            <div 
              key={story.id} 
              onClick={() => handleOpenStory(story)}
              className="flex-shrink-0 flex flex-col items-center snap-start cursor-pointer group"
            >
              <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-700 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#0a0502]">
                  {story.userPhoto ? (
                    <img src={story.userPhoto} alt={story.userName} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-amber-500/10 flex items-center justify-center text-amber-400 font-bold text-lg">
                      {story.userName?.[0]}
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[10px] text-gray-300 mt-1.5 truncate max-w-[70px]">
                {isOwn ? "My Story" : story.userName.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>

      {/* Modal: View Active Story */}
      <AnimatePresence>
        {activeStory && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 backdrop-blur-md p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-sm rounded-3xl overflow-hidden border border-white/10 shadow-2xl bg-black text-left"
            >
              <div className="h-[480px] relative">
                <img 
                  src={activeStory.imageUrl} 
                  alt="Story Content" 
                  className="w-full h-full object-cover"
                />

                {/* Progress bar simulation */}
                <div className="absolute top-3 left-3 right-3 flex gap-1 z-30">
                  <div className="h-1 flex-1 bg-amber-500/90 rounded-full" />
                </div>

                {/* Sender Overlay */}
                <div className="absolute top-6 left-4 right-4 flex justify-between items-center z-10 bg-gradient-to-b from-black/60 to-transparent p-2 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full border border-amber-500 overflow-hidden bg-black">
                      {activeStory.userPhoto ? (
                        <img src={activeStory.userPhoto} alt={activeStory.userName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-amber-500/20 text-center flex items-center justify-center font-bold text-amber-400 text-sm">
                          {activeStory.userName?.[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white font-sans">{activeStory.userName}</p>
                      <p className="text-[9px] text-gray-300">Campus Highlight</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveStory(null)}
                    className="p-1.5 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Footer Reactions & View Counter Overlay */}
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-black/75 border border-white/5 backdrop-blur-sm">
                  {/* View count */}
                  <div className="flex items-center gap-1 text-[10px] text-gray-300 font-mono mb-2">
                    <Eye size={12} className="text-amber-500" />
                    <span>Seen by: {activeStory.viewers.length} students</span>
                  </div>

                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-2">React to highlight:</p>
                  <div className="flex gap-3 justify-center">
                    {[
                      { emoji: "❤️", icon: <Heart size={14} className="text-red-500 fill-red-500" /> },
                      { emoji: "🔥", icon: <Flame size={14} className="text-amber-500 fill-amber-500" /> },
                      { emoji: "👍", icon: <ThumbsUp size={14} className="text-blue-500" /> }
                    ].map(r => (
                      <button 
                        key={r.emoji}
                        onClick={() => handleReactStory(r.emoji)}
                        className="py-1.5 px-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/40 text-xs transition-all cursor-pointer flex items-center gap-1.5 text-white active:scale-95"
                      >
                        {r.emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Story Upload Form */}
      <AnimatePresence>
        {showUploadModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-left">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md card-gold p-6 rounded-3xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-metallic-gold">Upload Interactive Story</h3>
                <button onClick={() => setShowUploadModal(false)} className="text-gray-400 hover:text-white cursor-pointer"><X /></button>
              </div>

              <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-gray-400 mb-2">Story Photo URL (Image link)</label>
                  <input
                    type="url"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    required
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Provide a high quality image link to showcase your campus activity in full view.</p>
                </div>

                <div className="flex gap-2">
                  {["https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400", "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400", "https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400"].map((preset, pidx) => (
                    <button 
                      key={preset}
                      type="button"
                      onClick={() => setInputUrl(preset)}
                      className="flex-1 text-[10px] font-mono py-1.5 px-1 bg-white/5 rounded-lg border border-white/10 text-gray-300 hover:border-amber-500/40 text-center truncate cursor-pointer"
                    >
                      Sample Pic {pidx + 1}
                    </button>
                  ))}
                </div>

                <button 
                  type="submit"
                  className="w-full bg-amber-500 text-black py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-amber-400 cursor-pointer"
                >
                  <Plus size={16} /> Update My Highlights
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
