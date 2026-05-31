import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  MapPin, 
  UserPlus, 
  UserPlus2, 
  Settings, 
  Award, 
  CheckCircle, 
  Clock, 
  Lock, 
  BookOpen, 
  Sparkles,
  Link,
  Edit2
} from 'lucide-react';
import { store } from '../dataStore';
import { UserProfile, Post } from '../types';

interface UserProfileCardProps {
  currentUser: UserProfile;
  selectedUserId: string; // The user whose profile is being viewed
  onRefresh: () => void;
  onNavigateToPost: (postId: string) => void;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ 
  currentUser, 
  selectedUserId, 
  onRefresh,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editPhoto, setEditPhoto] = useState('');
  const [editCover, setEditCover] = useState('');
  const [editCourse, setEditCourse] = useState('');

  const targetUser = store.profiles.find(pro => pro.uid === selectedUserId) || currentUser;
  const isSelf = targetUser.uid === currentUser.uid;

  // Connection data structures
  const profileConnections = store.connections[targetUser.uid] || { friends: [], following: [], followers: [], blocked: [] };
  const userConnections = store.connections[currentUser.uid] || { friends: [], following: [], followers: [], blocked: [] };

  const isFriend = userConnections.friends.includes(targetUser.uid);
  const isFollowing = userConnections.following.includes(targetUser.uid);
  const hasPendingRequest = store.friendRequests.some(r => r.senderId === currentUser.uid && r.receiverId === targetUser.uid && r.status === 'pending');

  const handleEditInit = () => {
    setEditBio(targetUser.bio || '');
    setEditPhoto(targetUser.photoURL || '');
    setEditCover(targetUser.coverURL || '');
    setEditCourse(targetUser.courseAndYear || '');
    setIsEditing(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    store.updateProfile(currentUser.uid, {
      bio: editBio,
      photoURL: editPhoto || undefined,
      coverURL: editCover || undefined,
      courseAndYear: editCourse || undefined
    });
    setIsEditing(false);
    onRefresh();
  };

  const handleAddCircle = () => {
    store.sendFriendRequest(currentUser.uid, targetUser.uid);
    onRefresh();
  };

  const handleFollowToggle = () => {
    if (isFollowing) {
      store.unfollowUser(currentUser.uid, targetUser.uid);
    } else {
      store.followUser(currentUser.uid, targetUser.uid);
    }
    onRefresh();
  };

  const handleUnfriendCmd = () => {
    if (window.confirm(`Are you sure you want to decouple friend linkages with ${targetUser.name}?`)) {
      store.unfriendUser(currentUser.uid, targetUser.uid);
      onRefresh();
    }
  };

  const handleBlockToggle = () => {
    if (window.confirm(`Would you like to enforce an access constraint / block on ${targetUser.name}?`)) {
      store.blockUser(currentUser.uid, targetUser.uid);
      onRefresh();
    }
  };

  // Get mutual friends tracker
  const getMutualFriends = () => {
    const list1 = userConnections.friends;
    const list2 = profileConnections.friends;
    return list1.filter(f => list2.includes(f));
  };

  // Get posts written by target user
  const getTimelinePosts = () => {
    return store.posts.filter(p => p.userId === targetUser.uid);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Cover and header banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600 via-amber-700 to-amber-900 border border-white/10 shadow-lg min-h-[160px]">
        {targetUser.coverURL && (
          <img src={targetUser.coverURL} alt="Banner Cover" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        )}
        <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/85 to-transparent" />
      </div>

      {/* Main Stats and action buttons layout */}
      <div className="px-3 md:px-6 -mt-16 sm:-mt-20 relative z-10 flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex flex-col sm:flex-row items-center sm:items-end gap-3.5 text-center sm:text-left">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-black overflow-hidden shadow-xl bg-white/5 bg-black">
            {targetUser.photoURL ? (
              <img src={targetUser.photoURL} alt={targetUser.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-black text-4xl">
                {targetUser.name[0]}
              </div>
            )}
          </div>
          <div className="pb-2">
            <h3 className="text-xl md:text-2xl font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
              <span>{targetUser.name}</span>
              {targetUser.isVerified && <CheckCircle size={16} className="text-amber-400 fill-amber-400/10" />}
            </h3>
            <p className="text-xs text-gray-400 mt-1 font-mono">{targetUser.username} • {targetUser.campus}</p>
          </div>
        </div>

        {/* Dynamic CTAs */}
        <div className="w-full sm:w-auto flex flex-wrap gap-2 justify-center sm:justify-end">
          {isSelf ? (
            <button 
              onClick={handleEditInit}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 size={13} /> Update Profile Info
            </button>
          ) : (
            <>
              {/* Mutual Friendship linkages buttons */}
              {isFriend ? (
                <button 
                  onClick={handleUnfriendCmd}
                  className="px-4 py-2 bg-[#d9534f]/15 hover:bg-[#d9534f]/30 text-rose-300 text-xs font-medium rounded-xl border border-[#d9534f]/20 cursor-pointer"
                >
                  Unfriend Circle
                </button>
              ) : hasPendingRequest ? (
                <button 
                  disabled
                  className="px-4 py-2 bg-white/5 inline-flex text-gray-500 text-xs font-medium rounded-xl border border-white/5"
                >
                  <Clock size={12} className="mr-1 mt-0.5 animate-pulse" /> Pending Connection
                </button>
              ) : (
                <button 
                  onClick={handleAddCircle}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-xl flex items-center gap-1"
                >
                  <UserPlus2 size={13} /> Add to Circles
                </button>
              )}

              {/* Follow Button */}
              <button 
                onClick={handleFollowToggle}
                className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                  isFollowing 
                    ? 'bg-white/10 text-white border-white/10 hover:bg-white/20' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                }`}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </button>

              {/* Report Block options */}
              <button
                onClick={handleBlockToggle}
                className="px-2 py-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 text-gray-500 hover:text-rose-500 cursor-pointer"
                title="Constraint limits"
              >
                <Lock size={12} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main structural bento layout details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Info column */}
        <div className="space-y-6">
          <div className="card-gold p-6 rounded-2xl bg-white/[0.01]">
            <h4 className="font-bold text-xs font-mono uppercase tracking-wider text-amber-500 mb-4 flex items-center gap-1">
              <BookOpen size={13} /> Cadet Credentials
            </h4>
            
            <div className="space-y-4 text-xs text-gray-300">
              <p className="leading-relaxed italic text-gray-400 bg-white/5 p-3 rounded-xl border border-white/5">
                "{targetUser.bio || "No custom scholastic bio written yet."}"
              </p>
              
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-amber-500" />
                <span>Assign Campus: <strong className="text-white">{targetUser.campus}</strong></span>
              </div>
              
              <div className="flex items-center gap-2">
                <Briefcase size={14} className="text-amber-500" />
                <span>Department: <strong className="text-white">{targetUser.courseAndYear || "Academics faculty"}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <Award size={14} className="text-amber-500" />
                <span className="capitalize">Role privileges: <strong className="text-amber-400">{targetUser.role} Account</strong></span>
              </div>
            </div>

            {/* Achievements panel */}
            {targetUser.achievements && targetUser.achievements.length > 0 && (
              <div className="mt-6 pt-5 border-t border-white/5">
                <h5 className="text-[10px] uppercase font-bold text-gray-400 font-mono tracking-widest mb-3 flex items-center gap-1.5"><Sparkles size={11} className="text-amber-500" /> Earned Badges</h5>
                <div className="flex flex-wrap gap-1.5">
                  {targetUser.achievements.map((item, idx) => (
                    <span 
                      key={idx}
                      className="px-2.5 py-1 text-[10px] font-bold bg-amber-500/10 text-amber-300 rounded-lg border border-amber-500/20 shadow-md flex items-center gap-1"
                    >
                      🏆 {item}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Social connections stats */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs">
            <h4 className="font-bold text-gray-200 mb-4 font-mono uppercase text-[10px] tracking-wider">Student Linkage Stats</h4>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                <p className="text-xs font-bold text-white font-mono">{profileConnections.friends.length}</p>
                <p className="text-[9px] text-gray-500 uppercase mt-0.5 font-mono">Duo Circles</p>
              </div>
              <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                <p className="text-xs font-bold text-white font-mono">{profileConnections.followers.length}</p>
                <p className="text-[9px] text-gray-500 uppercase mt-0.5 font-mono">Followers</p>
              </div>
              <div className="bg-black/40 p-2.5 rounded-xl border border-white/5">
                <p className="text-xs font-bold text-white font-mono">{profileConnections.following.length}</p>
                <p className="text-[9px] text-gray-500 uppercase mt-0.5 font-mono">Following</p>
              </div>
            </div>

            {/* Mutual connection circle tracker */}
            {!isSelf && getMutualFriends().length > 0 && (
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2 text-[10px] text-gray-400">
                <div className="flex -space-x-1.5 overflow-hidden">
                  {getMutualFriends().slice(0, 3).map((fId) => {
                    const peer = store.profiles.find(p => p.uid === fId);
                    return (
                      <div key={fId} className="w-5 h-5 rounded-full ring-2 ring-[#0a0502] overflow-hidden bg-gray-700">
                        <img src={peer?.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40"} alt="" className="object-cover w-full h-full" />
                      </div>
                    );
                  })}
                </div>
                <span>{getMutualFriends().length} mutual circles on campus</span>
              </div>
            )}
          </div>
        </div>

        {/* User's Published Timeline feed column */}
        <div className="md:col-span-2 space-y-4">
          <h4 className="font-bold text-sm text-white mb-4 flex items-center gap-1.5">
            <Clock size={16} className="text-amber-500" /> Timeline & Post Archive
          </h4>

          {getTimelinePosts().length > 0 ? (
            getTimelinePosts().map((post) => (
              <div 
                key={post.id}
                className="bg-white/5 border border-white/10 p-5 rounded-2xl relative"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                    <span>{post.userCampus} campus</span>
                    <span>•</span>
                    <span>{new Date(post.timestamp).toDateString()}</span>
                  </div>
                  {post.isPinned && (
                    <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest bg-amber-500/10 px-1.5 rounded">Pin</span>
                  )}
                </div>

                <p className="text-xs text-gray-300 leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>
                {post.mediaUrl && (
                  <div className="rounded-xl overflow-hidden max-h-[180px] mb-3">
                    <img src={post.mediaUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex gap-4 text-[10px] text-gray-500 font-mono pt-2 border-t border-white/5">
                  <span>👍 {post.reactions.length} reactions</span>
                  <span>💬 {post.comments.length} comments</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center border border-white/10 bg-white/[0.01] rounded-2xl">
              <p className="text-gray-500 text-xs">No active posts published to timeline network yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Form Modal overlay */}
      {isEditing && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 text-left">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-md card-gold p-6 rounded-3xl"
          >
            <h3 className="text-lg font-bold text-metallic-gold mb-6">Modify Personal Profile</h3>
            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-400 mb-1 font-bold">Custom Academic Bio</label>
                <textarea
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500/40"
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell peers what you study, projects or hobby crafts..."
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-bold">Profile Pic (Image URL link)</label>
                <input
                  type="url"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none"
                  value={editPhoto}
                  onChange={(e) => setEditPhoto(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-bold">Cover Banner (Image URL link)</label>
                <input
                  type="url"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none"
                  value={editCover}
                  onChange={(e) => setEditCover(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-bold">Department Course & Year</label>
                <input
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none"
                  value={editCourse}
                  onChange={(e) => setEditCourse(e.target.value)}
                  placeholder="e.g. BS Computer Science - 4th Year"
                />
              </div>

              <div className="flex gap-2 justify-end pt-4 border-t border-white/5">
                <button 
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-400 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg cursor-pointer"
                >
                  Apply Settings
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
