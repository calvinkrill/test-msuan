/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  ChevronRight, 
  Users, 
  Globe, 
  BookOpen, 
  ShieldCheck, 
  Menu, 
  X, 
  ArrowRight,
  Sparkles,
  Info,
  ExternalLink,
  Github,
  Download,
  Smartphone,
  Laptop,
  Bell,
  LogOut,
  Sliders,
  Award,
  Lock,
  Compass,
  Home,
  MessageSquare,
  AlertTriangle
} from 'lucide-react';
import { auth, googleProvider, db, handleFirestoreError, OperationType } from './firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, deleteDoc, collection, onSnapshot, serverTimestamp } from 'firebase/firestore';

// System components imports
import { StoryCarousel } from './components/StoryCarousel';
import { FeedList } from './components/FeedList';
import { MessagingHub } from './components/MessagingHub';
import { UserProfileCard } from './components/UserProfileCard';
import { ModerationAdminPanel } from './components/ModerationAdminPanel';
import { GlobalSettings } from './components/GlobalSettings';
import { CampusesExplorer } from './components/CampusesExplorer';
import { store } from './dataStore';
import { UserProfile } from './types';

interface AppUser {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
}

// --- Types ---

interface Campus {
  name: string;
  slug: string;
  location: string;
  description: string;
  stats: {
    students: string;
    courses: string;
  };
  top: string;
  left: string;
}

// --- Constants ---

const CAMPUSES: Campus[] = [
  { 
    name: "MSU Main", 
    slug: "msu-main", 
    location: "Marawi City", 
    description: "The flagship campus of the Mindanao State University System.",
    stats: { students: "20k+", courses: "150+" },
    top: "12%", left: "8%" 
  },
  { 
    name: "MSU IIT", 
    slug: "msu-iit", 
    location: "Iligan City", 
    description: "A premier institution of higher learning in the Philippines.",
    stats: { students: "15k+", courses: "100+" },
    top: "26%", left: "82%" 
  },
  { 
    name: "MSU Gensan", 
    slug: "msu-gensan", 
    location: "General Santos City", 
    description: "Serving the SOCCSKSARGEN region with excellence.",
    stats: { students: "12k+", courses: "80+" },
    top: "38%", left: "12%" 
  },
  { 
    name: "MSU Tawi-Tawi", 
    slug: "msu-tawi-tawi", 
    location: "Bongao, Tawi-Tawi", 
    description: "The southernmost campus specializing in fisheries and oceanography.",
    stats: { students: "8k+", courses: "40+" },
    top: "56%", left: "76%" 
  },
  { 
    name: "MSU Naawan", 
    slug: "msu-naawan", 
    location: "Naawan, Misamis Oriental", 
    description: "A center of excellence in fisheries and marine sciences.",
    stats: { students: "5k+", courses: "30+" },
    top: "18%", left: "74%" 
  },
  { 
    name: "MSU Maguindanao", 
    slug: "msu-maguindanao", 
    location: "Datu Odin Sinsuat", 
    description: "Empowering the Bangsamoro through education.",
    stats: { students: "7k+", courses: "45+" },
    top: "64%", left: "10%" 
  },
  { 
    name: "MSU Sulu", 
    slug: "msu-sulu", 
    location: "Jolo, Sulu", 
    description: "Fostering peace and development in the Sulu archipelago.",
    stats: { students: "6k+", courses: "35+" },
    top: "44%", left: "84%" 
  },
  { 
    name: "MSU Buug", 
    slug: "msu-buug", 
    location: "Buug, Zamboanga Sibugay", 
    description: "Providing quality education in the Sibugay area.",
    stats: { students: "4k+", courses: "25+" },
    top: "70%", left: "68%" 
  },
];

const SPARKLES = [
  { top: "10%", left: "14%" },
  { top: "22%", left: "78%" },
  { top: "36%", left: "20%" },
  { top: "54%", left: "72%" },
  { top: "68%", left: "16%" },
  { top: "82%", left: "60%" },
];

// --- Components ---

const Logo = () => (
  <img
    src="https://cdn.builder.io/api/v1/image/assets%2F23368e21ff6f469fbe3b6cd7a12f765a%2F935b37ec15f04e76b6201798aa1bad97?format=webp&width=200&height=300"
    alt="ONEMSU Logo"
    className="w-full h-full object-contain"
  />
);

export default function App() {
  const [view, setView] = useState<'home' | 'explorer' | 'about' | 'dashboard'>('home');
  const [selectedCampus, setSelectedCampus] = useState<Campus | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [enrolledCourses, setEnrolledCourses] = useState<string[]>([]);
  const [dashboardTab, setDashboardTab] = useState<'announcements' | 'courses' | 'tools'>('announcements');

  // Unified community hub states
  const [activeDashboardTab, setActiveDashboardTab] = useState<'feed' | 'messages' | 'profile' | 'admin' | 'settings'>('feed');
  const [selectedHashtag, setSelectedHashtag] = useState<string>('');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('');
  const [showNotifDropdown, setShowNotifDropdown] = useState<boolean>(false);
  const [refreshNonce, setRefreshNonce] = useState<number>(0);

  const forceUpdate = () => setRefreshNonce(n => n + 1);

  // Set default profile target when user joins
  useEffect(() => {
    if (user && !selectedProfileId) {
      setSelectedProfileId(user.uid);
    }
  }, [user]);

  // PWA & Installation states
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPwaPrompt, setShowPwaPrompt] = useState(false);
  const [pwaPlatform, setPwaPlatform] = useState<'ios' | 'android' | 'desktop' | 'unknown'>('unknown');
  const [showGuideModal, setShowGuideModal] = useState(false);

  useEffect(() => {
    // Detect mobile platform for guides
    const ua = navigator.userAgent.toLowerCase();
    if (/iphone|ipad|ipod/.test(ua)) {
      setPwaPlatform('ios');
    } else if (/android/.test(ua)) {
      setPwaPlatform('android');
    } else {
      setPwaPlatform('desktop');
    }

    // Capture beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      const isDismissed = sessionStorage.getItem('pwa_dismissed') === 'true';
      if (!isDismissed) {
        setShowPwaPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Initial delay fallback to show walkthrough options
    const fallbackTimer = setTimeout(() => {
      const isDismissed = sessionStorage.getItem('pwa_dismissed') === 'true';
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
      if (!isDismissed && !isStandalone && !deferredPrompt) {
        setShowPwaPrompt(true);
      }
    }, 6000); 

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(fallbackTimer);
    };
  }, [deferredPrompt]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`PWA user choice outcome: ${outcome}`);
      } catch (err) {
        console.error("Failed to present native install dialog: ", err);
      }
      setDeferredPrompt(null);
      setShowPwaPrompt(false);
    } else {
      setShowGuideModal(true);
    }
  };

  const dismissPwaPrompt = () => {
    setShowPwaPrompt(false);
    sessionStorage.setItem('pwa_dismissed', 'true');
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      setMouse({ x: nx, y: ny });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Find or create profile in our social store
        let profile = store.profiles.find(p => p.email.toLowerCase() === firebaseUser.email?.toLowerCase());
        if (!profile) {
          const splitName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'MSUan';
          profile = {
            uid: firebaseUser.uid,
            name: splitName,
            email: firebaseUser.email || '',
            username: "@" + splitName.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase(),
            campus: "MSU Main",
            role: "student",
            isVerified: true,
            photoURL: firebaseUser.photoURL || undefined,
            achievements: ["Google Joined"],
            privacySettings: { profileVisibility: "public", messagePermission: "everyone", activityLogPublic: true }
          };
          store.profiles.push(profile);
          store.syncAll();
        }
        
        store.activeUser = profile;
        setUser({
          uid: profile.uid,
          name: profile.name,
          email: profile.email,
          photoURL: profile.photoURL
        });
        setIsLoggedIn(true);

        // Sync profile to Firestore
        try {
          const userRef = doc(db, 'users', firebaseUser.uid);
          await setDoc(userRef, {
            uid: profile.uid,
            name: profile.name,
            email: profile.email,
            photoURL: profile.photoURL
          }, { merge: true });
        } catch (err) {
          console.error("Failed to sync user profile to Firestore: ", err);
        }
      } else {
        // If not using Google Auth directly, check if store has a logged in activeUser cache
        if (store.activeUser) {
          setUser({
            uid: store.activeUser.uid,
            name: store.activeUser.name,
            email: store.activeUser.email,
            photoURL: store.activeUser.photoURL
          });
          setIsLoggedIn(true);
        } else {
          setUser(null);
          setIsLoggedIn(false);
          setEnrolledCourses([]);
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen to Firestore real-time enrolled courses (only for Firebase authenticated users)
  useEffect(() => {
    if (!user || !auth.currentUser) {
      setEnrolledCourses([]);
      return;
    }

    const enrollmentsRef = collection(db, 'users', user.uid, 'enrollments');
    const unsubscribe = onSnapshot(enrollmentsRef, (snapshot) => {
      const list = snapshot.docs.map(doc => doc.data().courseName as string);
      setEnrolledCourses(list);
    }, (err) => {
      console.error('Error loading enrollments:', err);
      setEnrolledCourses([]);
    });

    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (isLoggedIn && view === 'home') setView('dashboard');
  }, [isLoggedIn, view]);

  const handleGoogleLogin = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
      setIsLoginOpen(false);
      setIsSignupOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to authenticate with Google Gmail.');
    }
  };

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    
    // Connect inside local-first social profiles registry
    const profile = store.loginWithEmail(email);
    setUser({
      uid: profile.uid,
      name: profile.name,
      email: profile.email,
      photoURL: profile.photoURL
    });
    setIsLoggedIn(true);
    setIsLoginOpen(false);
  };

  const handleSignup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    
    const profile = store.registerUser(name, email);
    setUser({
      uid: profile.uid,
      name: profile.name,
      email: profile.email,
      photoURL: profile.photoURL
    });
    setIsLoggedIn(true);
    setIsSignupOpen(false);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Signout error:", err);
    }
    store.activeUser = null;
    setIsLoggedIn(false);
    setUser(null);
    setView('home');
  };

  const toggleEnroll = async (course: string) => {
    if (!user) {
      setIsLoginOpen(true);
      return;
    }

    // For mock users, fallback to simple React state
    if (user.uid.startsWith("mock_")) {
      setEnrolledCourses(prev =>
        prev.includes(course) ? prev.filter(c => c !== course) : [...prev, course]
      );
      return;
    }

    const enrollmentId = course.replace(/[^a-zA-Z0-9_\-]/g, '_');
    const enrollmentDocRef = doc(db, 'users', user.uid, 'enrollments', enrollmentId);

    try {
      if (enrolledCourses.includes(course)) {
        await deleteDoc(enrollmentDocRef);
      } else {
        await setDoc(enrollmentDocRef, {
          courseName: course,
          enrolledAt: serverTimestamp()
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}/enrollments/${enrollmentId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0502] text-white">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 mb-6"
        >
          <Logo />
        </motion.div>
        <p className="text-amber-500 font-medium tracking-wide animate-pulse">Establishing Secure Connection...</p>
      </div>
    );
  }

  const renderDashboard = () => {
    // Sync current active user representation in store
    const activeProfile = store.profiles.find(p => p.uid === (user?.uid || '')) || store.activeUser || store.profiles[1];
    
    // Notifications tally
    const userNotifications = store.notifications.filter(n => n.receiverId === activeProfile.uid);
    const unreadNotifications = userNotifications.filter(n => !n.seen);

    // Active friend requests
    const pendingReqs = store.friendRequests.filter(r => r.receiverId === activeProfile.uid && r.status === 'pending');

    const handleAcceptRequest = (reqId: string) => {
      store.respondFriendRequest(reqId, 'accepted', activeProfile.uid);
      forceUpdate();
    };

    const handleDeclineRequest = (reqId: string) => {
      store.respondFriendRequest(reqId, 'declined', activeProfile.uid);
      forceUpdate();
    };

    const handleMarkAllNotifications = () => {
      store.markNotificationsRead(activeProfile.uid);
      forceUpdate();
    };

    return (
      <div className={`min-h-screen text-gray-200 transition-colors duration-250 ${
        store.settings.appearanceMode === 'light' 
          ? 'bg-slate-50 text-slate-800' 
          : store.settings.appearanceMode === 'glass'
            ? 'bg-gradient-to-b from-[#161208] to-black text-gray-200' 
            : 'bg-[#0a0502] text-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 sm:py-6">
          
          {/* HEADER BAR */}
          <header className={`flex justify-between items-center pb-5 mb-6 border-b ${
            store.settings.appearanceMode === 'light' ? 'border-slate-200' : 'border-white/10'
          }`}>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 cursor-pointer hover:scale-105 transition-transform" onClick={() => setView('home')}>
                <Logo />
              </div>
              <div className="text-left">
                <h2 className={`text-base font-bold tracking-tight ${
                  store.settings.appearanceMode === 'light' ? 'text-black' : 'text-metallic-gold'
                }`}>
                  ONE<span className={store.settings.appearanceMode === 'light' ? 'text-amber-600' : 'text-white'}>MSU</span>
                </h2>
                <p className="text-[9px] text-gray-500 uppercase tracking-wider font-mono">Student Community Hub</p>
              </div>
            </div>

            {/* Quick Actions (Notifs, Profile selection & logout) */}
            <div className="flex items-center gap-3.5 relative">
              
              {/* Notification icon & interactive dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                  className={`p-2 rounded-xl transition-all relative cursor-pointer ${
                    store.settings.appearanceMode === 'light' ? 'bg-slate-200/65 text-slate-700 hover:bg-slate-200' : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <Bell size={16} />
                  {unreadNotifications.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-500 text-black text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono animate-bounce">
                      {unreadNotifications.length}
                    </span>
                  )}
                </button>

                {/* Dropdown Container */}
                <AnimatePresence>
                  {showNotifDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 5, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className={`absolute right-0 mt-2 w-80 rounded-2xl p-4 shadow-2xl border z-[180] text-left ${
                        store.settings.appearanceMode === 'light' 
                          ? 'bg-white border-slate-200 text-slate-900' 
                          : 'bg-black/95 border-amber-500/30 text-white'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-xs uppercase tracking-wider font-bold text-amber-500 font-mono">Academic Notifications</h4>
                        {unreadNotifications.length > 0 && (
                          <button 
                            onClick={handleMarkAllNotifications}
                            className="text-[9px] text-gray-400 hover:text-amber-400 underline font-mono cursor-pointer"
                          >
                            Read All
                          </button>
                        )}
                      </div>

                      <div className="space-y-3.5 max-h-[240px] overflow-y-auto pr-1">
                        {/* Pending Friend Request Action Panel */}
                        {pendingReqs.length > 0 && (
                          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                            <p className="font-bold text-amber-400 mb-1.5 flex items-center gap-1">👥 Pending Linkages:</p>
                            {pendingReqs.map(req => (
                              <div key={req.id} className="flex justify-between items-center gap-2 border-b border-white/5 pb-1.5 mb-1.5 last:border-0 last:pb-0 last:mb-0">
                                <span className="truncate text-[11px] text-gray-300 font-medium">{req.senderName} ({req.senderCampus})</span>
                                <div className="flex gap-1">
                                  <button 
                                    onClick={() => handleAcceptRequest(req.id)}
                                    className="px-2 py-0.5 bg-amber-500 text-black font-extrabold rounded text-[9px] hover:bg-amber-400 cursor-pointer"
                                  >
                                    Accept
                                  </button>
                                  <button 
                                    onClick={() => handleDeclineRequest(req.id)}
                                    className="px-2 py-0.5 bg-white/5 text-gray-400 rounded text-[9px] hover:text-white cursor-pointer"
                                  >
                                    Drop
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Direct Interactions list */}
                        {userNotifications.length > 0 ? (
                          userNotifications.map(n => (
                            <div 
                              key={n.id} 
                              onClick={() => {
                                if (n.type === 'message') {
                                  setActiveDashboardTab('messages');
                                } else {
                                  setActiveDashboardTab('feed');
                                }
                                setShowNotifDropdown(false);
                              }}
                              className={`p-2 rounded-xl text-xs border cursor-pointer last:border-0 ${
                                n.seen ? 'opacity-60 bg-transparent border-transparent' : 'bg-white/5 border-white/5'
                              }`}
                            >
                              <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                                <span className="font-bold text-amber-300">{n.senderName}</span>
                                <span>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                              </div>
                              <p className="mt-0.5 leading-normal text-gray-300">{n.body}</p>
                            </div>
                          ))
                        ) : (
                          <div className="p-6 text-center text-gray-500 text-xs">
                            No notifications on file. Have a steady day!
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Connected Student Profile Chip */}
              <div 
                onClick={() => { setSelectedProfileId(activeProfile.uid); setActiveDashboardTab('profile'); }}
                className={`flex items-center gap-2 p-1.5 pr-3 rounded-full hover:scale-102 transition-transform cursor-pointer ${
                  store.settings.appearanceMode === 'light' ? 'bg-slate-200/60 text-slate-800' : 'bg-white/5 text-gray-300'
                }`}
              >
                <div className="w-6.5 h-6.5 rounded-full border border-amber-500/30 overflow-hidden bg-white/5 flex-shrink-0">
                  {activeProfile.photoURL ? (
                    <img src={activeProfile.photoURL} alt={activeProfile.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-amber-500/10 text-amber-500 font-bold flex items-center justify-center text-[10px]">
                      {activeProfile.name[0]}
                    </div>
                  )}
                </div>
                <div className="hidden sm:block text-left min-w-0">
                  <p className="text-[10px] font-bold truncate max-w-[90px] leading-none">{activeProfile.name.split(' ')[0]}</p>
                  <p className="text-[8px] text-gray-500 font-mono tracking-wider">{activeProfile.role}</p>
                </div>
              </div>

              {/* Log out */}
              <button
                onClick={handleLogout}
                className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-xl transition-all cursor-pointer border border-rose-500/10"
                title="Disconnect Session"
              >
                <LogOut size={14} />
              </button>
            </div>
          </header>

          {/* SYSTEM GRID ROOT */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 text-left">
            
            {/* Sidebar Columns (Visible always on Desktop and hidden on Mobile) */}
            <div className="hidden lg:block space-y-4">
              <div className="card-gold p-4 rounded-3xl bg-white/[0.01]">
                <h3 className="text-[10px] font-mono tracking-widest uppercase font-bold text-gray-500 mb-4 px-2">Navigation Portals</h3>
                
                <div className="space-y-1.5 text-xs">
                  {[
                    { id: 'feed', label: 'Timeline & Feed', icon: <Globe size={14} /> },
                    { id: 'messages', label: 'Message Hub', icon: <MessageSquare size={14} /> },
                    { id: 'profile', label: 'My Profile Timeline', icon: <Users size={14} />, setupId: activeProfile.uid },
                    { id: 'admin', label: 'Admin Dashboard', icon: <ShieldCheck size={14} />, adminOnly: true },
                    { id: 'settings', label: 'Portal Config & Logs', icon: <Sliders size={14} /> }
                  ].map(tab => {
                    const isTabActive = activeDashboardTab === tab.id;
                    const canSee = !tab.adminOnly || activeProfile.role === 'admin' || activeProfile.role === 'moderator';
                    
                    if (!canSee) return null;

                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveDashboardTab(tab.id as any);
                          if (tab.setupId) setSelectedProfileId(tab.setupId);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                          isTabActive 
                            ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/10 scale-102' 
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {tab.icon}
                          <span>{tab.label}</span>
                        </div>
                        {tab.id === 'messages' && store.directMessages.filter(m => m.senderId !== activeProfile.uid && !m.seen).length > 0 && (
                          <span className="text-[9px] bg-amber-500 text-black px-1.5 py-0.5 rounded-full font-mono font-black shrink-0">
                            {store.directMessages.filter(m => m.senderId !== activeProfile.uid && !m.seen).length}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Trending Hashtag lists widget inside sidebar */}
              {activeDashboardTab === 'feed' && (
                <div className="p-5 rounded-3xl bg-white/5 border border-white/10 text-xs">
                  <h4 className="font-bold text-gray-200 mb-3 font-mono uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                    <Sparkles size={11} className="text-amber-500" /> Trending Topics
                  </h4>
                  <div className="space-y-2 font-mono">
                    {store.trendingTags.map((trend) => (
                      <div 
                        key={trend.tag} 
                        onClick={() => setSelectedHashtag(trend.tag)}
                        className={`flex justify-between items-center p-1.5 rounded-lg border cursor-pointer hover:bg-white/10 ${
                          selectedHashtag.toLowerCase() === trend.tag.toLowerCase() 
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold' 
                            : 'border-transparent text-gray-400'
                        }`}
                      >
                        <span>#{trend.tag}</span>
                        <span className="text-[9px] bg-white/5 px-1.5 py-0.5 rounded text-gray-500">{trend.count} feeds</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Responsive Mobile Tabs navigation (Hidden on Desktop) */}
            <div className="lg:hidden w-full flex overflow-x-auto pb-4 gap-2.5 scrollbar-none snap-x text-[10px] font-mono tracking-wider font-bold uppercase">
              {[
                { id: 'feed', label: 'Timeline Hub' },
                { id: 'messages', label: 'DMs & Orgs' },
                { id: 'profile', label: 'Profile' },
                { id: 'admin', label: 'Admin', adminOnly: true },
                { id: 'settings', label: 'Settings' }
              ].map(tab => {
                const isTabActive = activeDashboardTab === tab.id;
                const canSee = !tab.adminOnly || activeProfile.role === 'admin' || activeProfile.role === 'moderator';
                
                if (!canSee) return null;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveDashboardTab(tab.id as any);
                      if (tab.id === 'profile') setSelectedProfileId(activeProfile.uid);
                    }}
                    className={`flex-shrink-0 snap-start px-4.5 py-2.5 rounded-xl border cursor-pointer transition-colors ${
                      isTabActive 
                        ? 'bg-amber-500 text-black border-amber-600 font-extrabold' 
                        : 'bg-white/5 text-gray-400 border-white/10'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Dynamic Content Columns */}
            <div className="col-span-1 lg:col-span-3 space-y-6">
              
              {/* FEED SECTION */}
              {activeDashboardTab === 'feed' && (
                <>
                  <StoryCarousel 
                    currentUserId={activeProfile.uid}
                    onRefresh={forceUpdate}
                  />
                  <FeedList 
                    currentUser={activeProfile}
                    selectedTag={selectedHashtag}
                    onSelectTag={(tag) => setSelectedHashtag(tag)}
                    onRefresh={forceUpdate}
                  />
                </>
              )}

              {/* MESSAGING HUB SECTION */}
              {activeDashboardTab === 'messages' && (
                <MessagingHub 
                  currentUser={activeProfile}
                  onRefresh={forceUpdate}
                />
              )}

              {/* PROFILE VIEW SECTION */}
              {activeDashboardTab === 'profile' && (
                <UserProfileCard 
                  currentUser={activeProfile}
                  selectedUserId={selectedProfileId}
                  onRefresh={forceUpdate}
                  onNavigateToPost={(id) => {
                    setActiveDashboardTab('feed');
                    forceUpdate();
                  }}
                />
              )}

              {/* ADMINISTRATIVE CENTER */}
              {activeDashboardTab === 'admin' && (
                <ModerationAdminPanel 
                  currentUser={activeProfile}
                  onRefresh={forceUpdate}
                />
              )}

              {/* GLOBAL ACCOUNT SETTINGS PANEL */}
              {activeDashboardTab === 'settings' && (
                <GlobalSettings 
                  currentUser={activeProfile}
                  onRefresh={forceUpdate}
                />
              )}

            </div>
          </div>

        </div>
      </div>
    );
  };

  const renderHome = () => (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-8 text-center overflow-hidden hero-metallic">
      {/* Navigation Header */}
      <div className="absolute top-0 left-0 right-0 p-8 flex justify-between items-center z-50">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8"><Logo /></div>
          <span className="hidden sm:inline">ONE<span className="text-amber-500">MSU</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button onClick={() => setView('explorer')} className="text-gray-400 hover:text-white transition-colors cursor-pointer">Campuses</button>
          <button onClick={() => setView('about')} className="text-gray-400 hover:text-white transition-colors cursor-pointer">About</button>
          <button 
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 font-semibold text-xs hover:bg-amber-500/20 transition-all cursor-pointer"
          >
            <Download size={13} />
            Install App
          </button>
          <button 
            onClick={() => isLoggedIn ? setView('dashboard') : setIsLoginOpen(true)}
            className="px-5 py-2 rounded-full bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors cursor-pointer"
          >
            {isLoggedIn ? 'Dashboard' : 'Sign In'}
          </button>
        </div>
      </div>

      {/* Background Elements */}
      <motion.div
        aria-hidden
        animate={{ x: mouse.x * 20, y: mouse.y * 12 }}
        transition={{ type: "spring", stiffness: 40, damping: 18 }}
        className="pointer-events-none absolute -top-40 -right-28 w-[30rem] h-[30rem] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(248,196,64,0.18),transparent_60%)] blur-3xl"
      />
      <motion.div
        aria-hidden
        animate={{ x: mouse.x * -16, y: mouse.y * -10 }}
        transition={{ type: "spring", stiffness: 40, damping: 18 }}
        className="pointer-events-none absolute -bottom-44 -left-32 w-[26rem] h-[26rem] rounded-full bg-[radial-gradient(circle_at_70%_70%,rgba(229,57,53,0.22),transparent_60%)] blur-3xl"
      />
      {SPARKLES.map((p, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0.2, 0.6, 0.2], scale: [0.9, 1.2, 0.9] }}
          transition={{ duration: 2.6 + i * 0.2, repeat: Infinity }}
          style={{ top: p.top, left: p.left }}
          className="pointer-events-none absolute w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_12px_rgba(245,197,24,0.6)]"
        />
      ))}

      {/* Campus Chips (Floating) */}
      {CAMPUSES.map((c, i) => (
        <motion.div
          key={c.slug}
          style={{ top: c.top, left: c.left }}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 0.4, y: [0, -10, 0], x: [0, 5, 0] }}
          transition={{ duration: 5 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
          className="absolute pointer-events-auto select-none hidden md:block cursor-pointer z-20"
          onClick={() => {
            setSelectedCampus(c);
            setView('explorer');
          }}
        >
          <span className="px-3 py-1 rounded-full text-[10px] font-medium border border-amber-400/20 bg-amber-100/5 text-amber-200/60 backdrop-blur-sm hover:bg-amber-400/20 hover:text-amber-200 transition-colors">
            {c.name}
          </span>
        </motion.div>
      ))}

      {/* Main Content */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center w-full max-w-lg md:max-w-none"
      >
        <div className="w-48 h-48 md:w-64 md:h-64 mb-8 drop-shadow-[0_0_40px_rgba(248,196,64,0.3)]">
          <Logo />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-100/10 text-amber-200 text-xs md:text-sm mb-6"
        >
          <motion.span
            className="w-2 h-2 rounded-full bg-amber-400"
            animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          Student Connect | E.S.T 2026
        </motion.div>

        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6 text-metallic-gold">
          ONE<span className="text-white">MSU</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300/90 max-w-2xl mb-12 leading-relaxed px-4 md:px-0">
          The digital heart of the MSU community. Connect, explore, and thrive across all campuses in one unified experience.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md px-4 md:px-0">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setView('explorer')}
            className="flex-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20 text-sm cursor-pointer"
          >
            Explore Campuses <ArrowRight size={18} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => isLoggedIn ? setView('dashboard') : setIsLoginOpen(true)}
            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-4 rounded-xl font-bold backdrop-blur-md transition-colors text-sm cursor-pointer"
          >
            {isLoggedIn ? 'Go to Dashboard' : 'Connect Account'}
          </motion.button>
        </div>

        {/* Mobile Campus Carousel - Different layout designed specifically for mobile */}
        <div className="mt-12 w-full max-w-md md:hidden pointer-events-auto px-4 text-left">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-mono font-bold tracking-wider text-amber-400 uppercase">System Campuses</span>
            <button 
              onClick={() => setView('explorer')} 
              className="text-xs text-gray-400 hover:text-amber-500 flex items-center gap-0.5 transition-colors cursor-pointer"
            >
              View System ({CAMPUSES.length}) <ChevronRight size={12} />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory text-left scroll-smooth">
            {CAMPUSES.map((c) => (
              <div 
                key={c.slug}
                onClick={() => {
                  setSelectedCampus(c);
                  setView('explorer');
                }}
                className="flex-shrink-0 w-44 snap-start p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/30 active:bg-white/10 transition-all cursor-pointer"
              >
                <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest">{c.location}</span>
                <h4 className="font-bold text-white text-sm mt-0.5 truncate">{c.name}</h4>
                <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 leading-normal">{c.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile PWA Install Badge Trigger */}
        <div className="mt-6 flex justify-center md:hidden pointer-events-auto">
          <button 
            onClick={handleInstallClick}
            className="px-4 py-2.5 border border-amber-500/20 bg-amber-500/5 text-amber-300 text-xs font-semibold rounded-lg flex items-center gap-2 hover:bg-amber-500/10 cursor-pointer transition-colors"
          >
            <Download size={14} className="animate-pulse" />
            Install Mobile App Experience
          </button>
        </div>
      </motion.div>

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md card-gold p-8 rounded-3xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-metallic-gold font-sans tracking-tight">Connect to ONEMSU</h3>
                <button onClick={() => setIsLoginOpen(false)} className="text-gray-500 hover:text-white"><X /></button>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-left font-sans">
                  {error}
                </div>
              )}

              <div className="w-full mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs text-center font-sans">
                Google Sign-In is temporarily unavailable. Please use email login below.
              </div>

              <form className="space-y-5" onSubmit={handleLogin}>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">MSU Email / ID</label>
                  <input 
                    name="email"
                    type="email" 
                    placeholder="e.g. juan.delacruz@msumain.edu.ph"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Password</label>
                  <input 
                    name="password"
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
                    required
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                    <input type="checkbox" className="rounded border-white/10 bg-white/5 text-amber-500" />
                    Remember me
                  </label>
                  <a href="#" className="text-amber-500 hover:underline">Forgot password?</a>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-amber-500 text-black py-3.5 rounded-xl font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-900/20 cursor-pointer text-sm"
                >
                  Sign In
                </button>
              </form>
              
              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-sm text-gray-500 animate-fade-in">
                  Don't have an account? <button onClick={() => { setIsLoginOpen(false); setIsSignupOpen(true); }} className="text-amber-500 font-semibold hover:underline">Register here</button>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Signup Modal */}
      <AnimatePresence>
        {isSignupOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="w-full max-w-md card-gold p-8 rounded-3xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-metallic-gold font-sans tracking-tight">Join ONEMSU</h3>
                <button onClick={() => setIsSignupOpen(false)} className="text-gray-500 hover:text-white"><X /></button>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs text-left font-sans">
                  {error}
                </div>
              )}

              <div className="w-full mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs text-center font-sans">
                Google Sign-In is temporarily unavailable. Please use email login below.
              </div>

              <form className="space-y-5" onSubmit={handleSignup}>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                  <input 
                    name="name"
                    type="text" 
                    placeholder="Juan Dela Cruz"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">MSU Email</label>
                  <input 
                    name="email"
                    type="email" 
                    placeholder="juan.delacruz@msumain.edu.ph"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Password</label>
                  <input 
                    name="password"
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-amber-500/50 transition-colors text-sm"
                    required
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-amber-500 text-black py-3.5 rounded-xl font-bold hover:bg-amber-400 transition-colors shadow-lg shadow-amber-900/20 cursor-pointer text-sm"
                >
                  Create Account
                </button>
              </form>
              
              <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <p className="text-sm text-gray-500">
                  Already have an account? <button onClick={() => { setIsSignupOpen(false); setIsLoginOpen(true); }} className="text-amber-500 font-semibold hover:underline">Sign In</button>
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6 text-gray-500 text-xs">
        <span className="flex items-center gap-1"><ShieldCheck size={14} /> Secure Access</span>
        <span className="flex items-center gap-1"><Globe size={14} /> Global Network</span>
        <span className="flex items-center gap-1"><Users size={14} /> 100k+ Alumni</span>
      </div>
    </div>
  );

  const renderExplorer = () => (
    <CampusesExplorer 
      userSettings={store.settings} 
      selectedCampus={selectedCampus} 
      setSelectedCampus={setSelectedCampus} 
      setView={setView} 
    />
  );

  const renderAbout = () => (
    <div className="min-h-screen bg-[#070301] text-gray-100">
      <nav className="p-6 flex justify-between items-center border-b border-white/5 backdrop-blur-md sticky top-0 z-50 bg-[#070301]/85">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="w-8 h-8"><Logo /></div>
          <span className="tracking-tight text-white font-sans">ONE<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-200">MSU</span></span>
        </div>
        <button 
          onClick={() => setView('home')} 
          className="p-2.5 rounded-full hover:bg-white/5 text-gray-400 hover:text-white cursor-pointer transition-all active:scale-95 border border-white/5"
        >
          <X size={18} />
        </button>
      </nav>

      <main className="max-w-5xl mx-auto p-6 md:p-12 space-y-24">
        {/* Hero Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center relative py-12"
        >
          {/* Subtle background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/25 px-4.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider mb-6 uppercase">
            <Award size={13} /> Our Shared Legacy • Est. 1961
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-none mb-6">
            Preserving Culture,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">Cultivating Innovation</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-300/80 max-w-3xl mx-auto leading-relaxed font-sans">
            Over six decades of academic excellence, inter-cultural harmony, and sovereign development. Discover how senator Domocao A. Alonto&apos;s pioneering legislative spark grew into a sprawling 11-campus educational citadel.
          </p>
        </motion.section>

        {/* Vital Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { metric: "11", label: "Specialized Citadels", desc: "Cohesive multi-campus synergy" },
            { metric: "60k+", label: "Active Dreamers", desc: "Diverse student body enrollment" },
            { metric: "88%+", label: "Graduate Impact", desc: "Securing industrial futures" },
            { metric: "#1", label: "Peace-building Hub", desc: "Fostering inter-cultural trust" }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-5.5 rounded-2xl bg-white/[0.02] border border-white/5 text-center hover:bg-white/[0.04] transition-all"
            >
              <h3 className="text-3xl md:text-4xl font-black text-amber-400 tracking-tight mb-1">{stat.metric}</h3>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">{stat.label}</h4>
              <p className="text-[10px] text-gray-400 font-sans leading-normal">{stat.desc}</p>
            </motion.div>
          ))}
        </section>

        {/* Vision & Mission Core Statements */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-neutral-950/45 border border-white/10 hover:border-amber-500/20 transition-all flex flex-col justify-between space-y-6"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 font-mono font-black text-sm">
                01
              </div>
              <h3 className="text-2xl font-black mb-3 text-white tracking-tight">The Vision</h3>
              <p className="text-gray-300 font-sans leading-relaxed text-sm">
                To be a premier supra-regional university system in the ASEAN region, committed to the development of Mindanao, Palawan, and the Sulu Archipelago. We strive to set global standards in higher education while deeply respecting our unique regional heritages.
              </p>
            </div>
            <div className="text-[10px] text-amber-500/80 font-mono tracking-widest uppercase">
              ★ REGIONAL CHAMPION • ASEAN FOCUS
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-8 rounded-3xl bg-neutral-950/45 border border-white/10 hover:border-amber-500/20 transition-all flex flex-col justify-between space-y-6"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 font-mono font-black text-sm">
                02
              </div>
              <h3 className="text-2xl font-black mb-3 text-white tracking-tight">The Mission</h3>
              <p className="text-gray-300 font-sans leading-relaxed text-sm">
                To provide relevant and quality education, research, and extension services for the socio-economic and cultural transformation of communities. We cultivate critical thinkers who champion peace-building, technological autonomy, and ecological preservation.
              </p>
            </div>
            <div className="text-[10px] text-amber-500/80 font-mono tracking-widest uppercase">
              ✦ COMMUNITY IMPACT • EMPOWERMENT
            </div>
          </motion.div>
        </section>

        {/* Milestone Chronology Vertical Timeline */}
        <section className="space-y-12">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-white tracking-tight">Major Milestones in Our Journey</h3>
            <p className="text-xs text-gray-400 max-w-lg mx-auto leading-normal">
              A chronological map of our pioneering accomplishments establishing specialized educational pillars.
            </p>
          </div>

          <div className="relative border-l border-white/10 ml-4 md:ml-32 space-y-12 py-4">
            {[
              {
                year: "1961",
                title: "Founding Decree & Charter",
                subtitle: "Republic Act 1387 • Senator Domocao A. Alonto",
                desc: "Mindanao State University is formally created. Its primary guiding mission is to integrate Muslims and other diverse cultural communities into the national mainstream through equal high-quality educational access.",
                accent: "border-rose-500/30 text-rose-400"
              },
              {
                year: "1968",
                title: "The Technological Dawn",
                subtitle: "MSU-Iligan Institute of Technology (MSU-IIT)",
                desc: "Established as a specialized technological unit in Lanao del Norte. IIT would grow to become the sovereign engineering, robotics, and scientific computing core powerhouse of Southern Philippines.",
                accent: "border-amber-500/30 text-amber-400"
              },
              {
                year: "1969",
                title: "Oceanographic & Maritime Expansion",
                subtitle: "MSU-Tawi-Tawi College of Technology & Oceanography",
                desc: "Founded in Bongao's beautiful marine borders. It becomes the nation's premier ocean research bastion, pioneering in coral ecology, seaweed biotechnology, and deep sea fisheries conservation science.",
                accent: "border-teal-400/30 text-teal-300"
              },
              {
                year: "1989",
                title: "Aquacultural Spawning Innovation",
                subtitle: "MSU-Naawan Fisheries Sanctuary",
                desc: "Chartered as a primary fisheries powerhouse focusing on brackish estuaries, finfish hatcheries, and mangrove biology. Naawan bridges experimental science directly to coastal farming sectors.",
                accent: "border-sky-400/30 text-sky-450"
              },
              {
                year: "2026",
                title: "The Digital Heart Launch",
                subtitle: "Student Connect Initiative",
                desc: "Integrating the entire MSU university network. Connecting minds, sharing academic stories, mapping interactive campuses, and enabling real-time community engagement under one digital sky.",
                accent: "border-purple-400/30 text-purple-400"
              }
            ].map((milestone, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative pl-8 md:pl-12 group"
              >
                {/* Year Badge acting as anchor point */}
                <div className="absolute -left-3 md:-left-32 top-1.5 flex items-center justify-end md:w-28 text-right">
                  <span className="font-mono text-xs md:text-sm font-black tracking-widest text-[#f8c440] bg-[#f8c440]/10 px-2.5 py-1 rounded-md border border-[#f8c440]/25">
                    {milestone.year}
                  </span>
                </div>

                {/* Timeline node */}
                <div className="absolute -left-1.5 top-3.5 w-3 h-3 rounded-full bg-[#070301] border-2 border-[#f8c440] group-hover:bg-[#f8c440] transition-colors" />

                <div className="space-y-1.5">
                  <h4 className="text-lg font-black text-white group-hover:text-[#f8c440] transition-colors leading-tight">
                    {milestone.title}
                  </h4>
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider block text-[#f8c440]/75">
                    {milestone.subtitle}
                  </span>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-2xl font-sans pt-1">
                    {milestone.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Four Pillars of MSU education */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black text-white tracking-tight">Our Four Strategic Pillars</h3>
            <p className="text-xs text-gray-400 max-w-lg mx-auto">
              Our educational framework balances historical pride with future-proof competency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                title: "Peace & Interfaith Co-existence",
                desc: "Actively bridging cultural divides. Our campuses host diverse interfaith dialogues, regional mediation centers, and peace studies to protect our harmonious way of life.",
                tag: "PEACE LEADERSHIP",
                color: "rose-400 bg-rose-500/5 border-rose-500/10"
              },
              {
                title: "Ocean Blue Stewardship",
                desc: "Equipping specialized labs to protect endangered marine resources. We lead research in seaweed biotech, coral seeding, and eco-friendly fisheries across sea boundaries.",
                tag: "AQUATIC ADVOCACY",
                color: "teal-400 bg-teal-500/5 border-teal-500/10"
              },
              {
                title: "Industrial & Trades Craftsmanship",
                desc: "Fostering precise machining, electronics, automotive intelligence, and software sprints to cultivate a highly technical workforce ready to adapt to industry 4.0 markets.",
                tag: "TECHNICAL COMPETENCY",
                color: "cyan-400 bg-cyan-500/5 border-cyan-500/10"
              },
              {
                title: "Agrarian Sovereignty",
                desc: "Harnessing Cotabato and Lanao del Sur crop basins. Testing high-resilience tropical seeds, organic compost cycles, and small-business agro-forestry to assure food security.",
                tag: "AGRICULTURAL POWER",
                color: "emerald-400 bg-emerald-500/5 border-emerald-500/10"
              }
            ].map((p, idx) => (
              <div 
                key={idx}
                className={`p-6 rounded-2xl border ${p.color} space-y-3`}
              >
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono font-black tracking-widest uppercase text-amber-500">
                    {p.tag}
                  </span>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                </div>
                <h4 className="font-bold text-sm text-white">{p.title}</h4>
                <p className="text-xs text-gray-400 leading-relaxed font-sans">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Join the Community Action CTA */}
        <section className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-amber-500/5 via-neutral-950 to-neutral-950 border border-white/15 text-center relative overflow-hidden space-y-6">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500/5 rounded-full blur-[70px] pointer-events-none" />
          
          <h3 className="text-2xl font-black text-white">Join the Mindanao State University System</h3>
          <p className="text-xs text-gray-400 max-w-lg mx-auto font-sans leading-relaxed">
            Whether your passion ignites for deep ocean science, mechanical engineering, regional conflict diplomacy, or organic forest agronomy, there is a perfect MSU citadel waiting for your talent.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4.5 pt-2">
            <button 
              onClick={() => setView('explorer')}
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-black font-black rounded-xl text-xs hover:shadow-lg hover:shadow-amber-950/20 active:scale-95 transition-all cursor-pointer"
            >
              Start Campus Compatibility Quiz
            </button>
            <button 
              onClick={() => setView('home')}
              className="px-8 py-3.5 bg-white/5 border border-white/10 text-white hover:text-white hover:bg-white/10 font-bold rounded-xl text-xs active:scale-95 transition-all cursor-pointer"
            >
              Go to Home Screen
            </button>
          </div>
        </section>
      </main>

      <footer className="p-12 border-t border-white/5 text-center text-gray-500 text-xs space-y-4">
        <p>© 2026 Mindanao State University System. All rights reserved.</p>
        <div className="flex justify-center gap-6">
          <a href="#" className="hover:text-amber-550 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-amber-550 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-amber-550 transition-colors">Accessibility Studies</a>
        </div>
      </footer>
    </div>
  );

  const renderPwaPrompt = () => {
    if (!showPwaPrompt) return null;

    return (
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-96 z-[120] p-5 rounded-2xl bg-[#0d0703]/95 border-2 border-amber-500/30 shadow-2xl shadow-black/80 backdrop-blur-md text-left"
      >
        <div className="flex gap-4">
          <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Download size={20} className="animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white font-sans">Install ONEMSU App</h4>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Install the ONEMSU Portal on your device for one-click access and a full-screen experience.
            </p>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleInstallClick}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                Install Now
              </button>
              <button
                onClick={dismissPwaPrompt}
                className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                Later
              </button>
            </div>
          </div>
          <button 
            onClick={dismissPwaPrompt}
            className="text-gray-600 hover:text-gray-400 self-start cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      </motion.div>
    );
  };

  const renderPwaGuide = () => {
    if (!showGuideModal) return null;

    return (
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm text-left">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="w-full max-w-md card-gold p-6 rounded-3xl"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-metallic-gold flex items-center gap-2">
              <Smartphone size={20} className="text-amber-500" /> Install ONEMSU App
            </h3>
            <button onClick={() => setShowGuideModal(false)} className="text-gray-400 hover:text-white cursor-pointer"><X /></button>
          </div>

          <div className="space-y-4 text-sm text-gray-300">
            {pwaPlatform === 'ios' ? (
              <div className="space-y-4">
                <p>On Apple iOS Devices (iPhone or iPad):</p>
                <ol className="list-decimal pl-5 space-y-2 text-xs text-gray-400">
                  <li>Open the browser's share action panel (Safari or equivalent) at the bottom or top of the screen.</li>
                  <li>Scroll and tap on the option <span className="text-amber-500 font-semibold">"Add to Home Screen"</span>.</li>
                  <li>Click <span className="text-white font-semibold">"Add"</span> in the top-right corner to complete installation.</li>
                </ol>
              </div>
            ) : pwaPlatform === 'android' ? (
              <div className="space-y-4">
                <p>On Android (Chrome browser):</p>
                <ol className="list-decimal pl-5 space-y-2 text-xs text-gray-400">
                  <li>Tap the triple dots menu in Chrome.</li>
                  <li>Select <span className="text-amber-500 font-semibold">"Add to Home screen"</span> or <span className="text-amber-500 font-semibold">"Install App"</span>.</li>
                  <li>Click <span className="text-white font-semibold">"Install"</span> when asked.</li>
                </ol>
              </div>
            ) : (
              <div className="space-y-4">
                <p>On Desktop computers (Chrome, Edge, Brave):</p>
                <ol className="list-decimal pl-5 space-y-2 text-xs text-gray-400">
                  <li>Look at the right side of the browser's address bar.</li>
                  <li>Click the <span className="text-amber-500 font-semibold">App Install Button</span> (overlapping squares or display icon).</li>
                  <li>Click <span className="text-white font-semibold">"Install"</span> to install as a standalone workspace.</li>
                </ol>
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-white/5 flex gap-3 justify-end">
            <button 
              onClick={() => setShowGuideModal(false)} 
              className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg cursor-pointer transition-colors"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen selection:bg-amber-500/30 selection:text-amber-200">
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {renderHome()}
          </motion.div>
        )}
        {view === 'explorer' && (
          <motion.div
            key="explorer"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
          >
            {renderExplorer()}
          </motion.div>
        )}
        {view === 'about' && (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
          >
            {renderAbout()}
          </motion.div>
        )}
        {view === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            {renderDashboard()}
          </motion.div>
        )}
      </AnimatePresence>

      {/* PWA Prompt Overlays */}
      <AnimatePresence>
        {showPwaPrompt && renderPwaPrompt()}
      </AnimatePresence>
      {renderPwaGuide()}

      {/* Global Navigation Overlay (Mobile) */}
      <div className="fixed top-6 right-6 z-50 md:hidden">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-3 rounded-full bg-amber-500 text-black shadow-lg cursor-pointer"
        >
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-40 bg-black/95 flex flex-col items-center justify-center p-8 md:hidden"
          >
            <div className="flex flex-col gap-8 text-center">
              <button onClick={() => { setView('home'); setIsMenuOpen(false); }} className="text-4xl font-bold text-white">Home</button>
              <button onClick={() => { setView('explorer'); setIsMenuOpen(false); }} className="text-4xl font-bold text-white">Campuses</button>
              <button onClick={() => { setView('about'); setIsMenuOpen(false); }} className="text-4xl font-bold text-white">About</button>
              <button 
                onClick={() => { handleInstallClick(); setIsMenuOpen(false); }} 
                className="text-2xl font-semibold text-amber-500 flex items-center justify-center gap-2"
              >
                <Download size={22} className="animate-pulse" /> Install App
              </button>
              <div className="h-px w-24 bg-amber-500/30 mx-auto my-4" />
              <div className="flex gap-6 justify-center text-amber-500">
                <Github size={24} />
                <Globe size={24} />
                <Info size={24} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
