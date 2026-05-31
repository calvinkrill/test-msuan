import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Trash2, 
  AlertTriangle, 
  UserX, 
  Settings, 
  Activity, 
  CheckCircle, 
  ChartBar, 
  Search,
  BookOpen,
  MailCheck,
  ToggleLeft
} from 'lucide-react';
import { store } from '../dataStore';
import { UserProfile, Report, ActivityLog } from '../types';

interface ModerationAdminPanelProps {
  currentUser: UserProfile;
  onRefresh: () => void;
}

export const ModerationAdminPanel: React.FC<ModerationAdminPanelProps> = ({ currentUser, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'reports' | 'users' | 'settings'>('analytics');
  const [userQuery, setUserQuery] = useState('');
  
  // Site settings simulation states
  const [emailVerifyVal, setEmailVerifyVal] = useState(true);
  const [allowGuestVal, setAllowGuestVal] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Stats aggregate calculations
  const totalUsers = store.profiles.length;
  const totalPosts = store.posts.length;
  const totalReportsCount = store.reports.length;
  const pendingReports = store.reports.filter(r => r.status === 'pending');

  // SVG-based visual analytics charts
  const renderAnalyticsDashboard = () => {
    // Group users count by campus
    const campusCounts: Record<string, number> = {};
    store.profiles.forEach(p => {
      campusCounts[p.campus] = (campusCounts[p.campus] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(campusCounts), 1);

    return (
      <div className="space-y-6 text-left">
        {/* Metric widgets */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Community Count", value: totalUsers, sub: "Registered scholars" },
            { label: "Timeline Feeds", value: totalPosts, sub: "Dynamic published items" },
            { label: "Pending Flags", value: pendingReports.length, sub: "Moderation review items" },
            { label: "System Service uptime", value: "99.98%", sub: "Secure connection state" }
          ].map((stat, sidx) => (
            <div key={sidx} className="p-4 bg-white/5 border border-white/10 rounded-2xl">
              <h5 className="text-[10px] uppercase font-mono font-bold tracking-widest text-amber-500">{stat.label}</h5>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>

        {/* Visual High-contrast graph */}
        <div className="bento-grid grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card-gold p-6 rounded-2xl bg-white/[0.01]">
            <h4 className="font-bold text-xs uppercase font-mono tracking-wider text-amber-500 mb-4 flex items-center gap-1.5">
              <ChartBar size={13} /> Campus Distribution (Scholars count index)
            </h4>
            
            {/* Elegant SVG grid rows mimicking bars */}
            <div className="space-y-3.5">
              {Object.entries(campusCounts).map(([campus, count]) => {
                const widthPercent = (count / maxCount) * 100;
                return (
                  <div key={campus} className="space-y-1 text-xs">
                    <div className="flex justify-between items-center text-[11px] text-gray-300 font-medium">
                      <span>{campus} Portal</span>
                      <span className="font-mono text-amber-400 font-bold">{count} students</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${widthPercent}%` }}
                        transition={{ duration: 0.8 }}
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full" 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Activity Log system stream */}
          <div className="card-gold p-6 rounded-2xl bg-white/[0.01]">
            <h4 className="font-bold text-xs uppercase font-mono tracking-wider text-amber-500 mb-4 flex items-center gap-1.5">
              <Activity size={13} /> Activity Chronological Stream
            </h4>
            <div className="space-y-3.5 max-h-[170px] overflow-y-auto pr-1">
              {store.activityLogs.slice(0, 7).map((log) => (
                <div key={log.id} className="text-[10px] border-b border-white/5 pb-2 last:border-0">
                  <div className="flex justify-between text-gray-500 font-mono">
                    <span className="font-bold text-amber-400 capitalize">{log.actionType}</span>
                    <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-gray-300 leading-normal mt-0.5">{log.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Content report queue
  const renderReportQueueTab = () => {
    const handleResolve = (repId: string, action: 'dismissed' | 'resolved') => {
      store.resolveReport(repId, action, currentUser.uid);
      window.alert(`Report status flagged as: ${action.toUpperCase()}`);
      onRefresh();
    };

    const handleBanUserFromReport = (reportedId: string, repId: string) => {
      store.updateProfile(reportedId, { banned: true });
      store.resolveReport(repId, 'resolved', currentUser.uid);
      store.addLog(currentUser.uid, 'security_log', `Administrative lock enforced on reported user uid ${reportedId}`);
      window.alert("Academic access ban on terms violation successfully enforced.");
      onRefresh();
    };

    return (
      <div className="space-y-4 text-left">
        <h4 className="font-bold text-xs uppercase font-mono tracking-wider text-amber-500 flex items-center gap-1.5 mb-3">
          <AlertTriangle size={13} /> Moderation Review Queue ({pendingReports.length} pending items)
        </h4>

        {pendingReports.length > 0 ? (
          pendingReports.map(rep => (
            <div key={rep.id} className="p-5 bg-white/5 border border-white/10 rounded-2xl flex flex-col md:flex-row justify-between gap-4">
              <div className="space-y-1">
                <div className="flex gap-2 items-center flex-wrap">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                    {rep.contentType} violation
                  </span>
                  <span className="text-[10px] text-gray-500">Filed by {rep.reporterName}</span>
                </div>
                <p className="text-xs text-gray-300 font-medium">"<strong className="text-white">Reason:</strong> {rep.details}"</p>
                <div className="text-[10px] text-gray-500">
                  Target Entity UID: <span className="font-mono">{rep.contentId}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => handleResolve(rep.id, 'dismissed')}
                  className="px-3.5 py-1.5 bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-400 rounded-lg cursor-pointer border border-white/5"
                >
                  Dismiss Flag
                </button>
                <button
                  onClick={() => handleResolve(rep.id, 'resolved')}
                  className="px-3.5 py-1.5 bg-green-500/10 text-green-400 hover:bg-green-500/20 text-xs font-bold rounded-lg cursor-pointer border border-green-500/20"
                >
                  Mark Checked
                </button>
                <button
                  onClick={() => handleBanUserFromReport(rep.reportedId, rep.id)}
                  className="px-3.5 py-1.5 bg-red-500/15 hover:bg-red-500/30 text-rose-300 text-xs font-bold rounded-lg cursor-pointer border border-red-500/20 flex items-center gap-1"
                >
                  <UserX size={12} /> Ban Accused
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center bg-white/5 border border-white/10 rounded-2xl">
            <CheckCircle className="mx-auto text-green-500 mb-2" size={24} />
            <p className="text-gray-400 text-xs">Content Review Queue clean. Zero unaddressed violations!</p>
          </div>
        )}
      </div>
    );
  };

  // User list with Administrative switches
  const renderUserListTab = () => {
    const handleToggleAccountStatus = (u: UserProfile) => {
      const targetBannedState = !u.banned;
      store.updateProfile(u.uid, { banned: targetBannedState });
      store.addLog(currentUser.uid, 'security_log', `Administrative access change on UID ${u.uid} (Banned: ${targetBannedState})`);
      onRefresh();
    };

    const handleGrantVerification = (userId: string, isCurrentlyVerified: boolean) => {
      store.updateProfile(userId, { isVerified: !isCurrentlyVerified });
      store.addLog(currentUser.uid, 'security_log', `Verification index modified for UID ${userId}`);
      onRefresh();
    };

    const filteredUsers = store.profiles.filter(p => p.name.toLowerCase().includes(userQuery.toLowerCase()) || p.email.toLowerCase().includes(userQuery.toLowerCase()));

    return (
      <div className="space-y-4 text-left">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <h4 className="font-bold text-xs uppercase font-mono tracking-wider text-amber-500">
            Student accounts registry directory
          </h4>
          <div className="relative w-full sm:w-64">
            <Search size={13} className="absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white"
              placeholder="Search scholars..."
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
          {filteredUsers.map(u => (
            <div key={u.uid} className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                  {u.name[0]}
                </div>
                <div>
                  <h5 className="font-bold text-white flex items-center gap-1">
                    {u.name} 
                    {u.isVerified && <CheckCircle size={12} className="text-amber-500" />}
                  </h5>
                  <p className="text-[10px] text-gray-500">{u.email} • {u.campus}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleGrantVerification(u.uid, u.isVerified)}
                  className={`px-2.5 py-1 text-[10px] font-mono rounded-lg border transition-colors cursor-pointer ${
                    u.isVerified 
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/20' 
                      : 'bg-white/5 text-gray-400 border-white/5 hover:border-amber-500/20'
                  }`}
                >
                  Verify Tag
                </button>
                <button
                  onClick={() => handleToggleAccountStatus(u)}
                  disabled={u.uid === currentUser.uid} // Can't self ban
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border cursor-pointer ${
                    u.banned 
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' 
                      : 'bg-white/5 text-gray-300 border-white/10 hover:border-rose-500/30'
                  }`}
                >
                  {u.banned ? 'Banned' : 'Suspend'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Simulated Global portal configuration
  const renderSiteConfiguration = () => {
    return (
      <div className="space-y-5 text-left text-xs max-w-xl">
        <h4 className="font-bold text-xs uppercase font-mono tracking-wider text-amber-500 mb-3">ONEMSU Global Portal rules</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div>
              <h5 className="font-bold text-gray-200">Enforce MSU Domain Verification</h5>
              <p className="text-[10px] text-gray-500">Only registration matching @msumain|@msuiit|@msugensan can login.</p>
            </div>
            <button 
              onClick={() => { setEmailVerifyVal(!emailVerifyVal); store.addLog(currentUser.uid, 'security_log', `Modified domain registry settings verification index.`); }}
              className={`p-1 rounded-xl cursor-pointer ${emailVerifyVal ? 'text-amber-500' : 'text-gray-600'}`}
            >
              <MailCheck size={22} className={emailVerifyVal ? "text-amber-500" : "text-gray-500"} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div>
              <h5 className="font-bold text-gray-200">Allow Global Guest Browsing</h5>
              <p className="text-[10px] text-gray-500">Unauthenticated peers can read public timelines and system campuses list.</p>
            </div>
            <button 
              onClick={() => { setAllowGuestVal(!allowGuestVal); store.addLog(currentUser.uid, 'security_log', `Modified public guest permission index.`); }}
              className={`p-1 rounded-xl cursor-pointer ${allowGuestVal ? 'text-amber-500' : 'text-gray-600'}`}
            >
              <ToggleLeft size={22} className={allowGuestVal ? "rotate-180 text-amber-500" : "text-gray-500"} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
            <div>
              <h5 className="font-bold text-gray-200">Portal Structural Offline Cache</h5>
              <p className="text-[10px] text-gray-500">Saves feeds, messages, and stories directly inside browser LocalStorage databases.</p>
            </div>
            <div className="text-[11px] font-mono font-bold text-green-400 uppercase bg-green-500/10 px-2 py-1 rounded border border-green-500/20 shrink-0">
              ● Persistent Active
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="card-gold p-6 rounded-3xl bg-black/60 border border-white/10">
      {/* Tab controls */}
      <div className="flex justify-between items-center flex-wrap gap-4 border-b border-white/5 pb-4 mb-6">
        <h3 className="text-lg font-bold text-metallic-gold flex items-center gap-2">
          <ShieldCheck size={20} className="text-amber-500" /> Administrative Command Portal
        </h3>

        <div className="flex bg-white/5 p-1 rounded-xl gap-1 text-[10px] font-mono font-bold uppercase tracking-wider">
          {[
            { id: 'analytics', label: 'Monitor' },
            { id: 'reports', label: `Reviews (${pendingReports.length})` },
            { id: 'users', label: 'Scholars Registry' },
            { id: 'settings', label: 'Config Rules' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`py-1.5 px-3.5 rounded-lg cursor-pointer transition-colors ${
                activeTab === t.id ? 'bg-amber-500 text-black font-semibold' : 'text-gray-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Tab displays */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === 'analytics' && renderAnalyticsDashboard()}
          {activeTab === 'reports' && renderReportQueueTab()}
          {activeTab === 'users' && renderUserListTab()}
          {activeTab === 'settings' && renderSiteConfiguration()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
