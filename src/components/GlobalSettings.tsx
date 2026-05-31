import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Lock, 
  History, 
  Palette, 
  UserMinus, 
  ShieldAlert,
  Sliders,
  Sparkles
} from 'lucide-react';
import { store } from '../dataStore';
import { UserProfile, AppSettings } from '../types';

interface GlobalSettingsProps {
  currentUser: UserProfile;
  onRefresh: () => void;
}

export const GlobalSettings: React.FC<GlobalSettingsProps> = ({ currentUser, onRefresh }) => {
  const [activeSubTab, setActiveSubTab] = useState<'notifications' | 'privacy' | 'appearance' | 'logs'>('notifications');
  const [blockedQuery, setBlockedQuery] = useState('');

  const connectionData = store.connections[currentUser.uid] || { friends: [], following: [], followers: [], blocked: [] };
  const userLogs = store.activityLogs.filter(log => log.userId === currentUser.uid);

  const handleToggleNotify = (type: 'notificationsEnabled' | 'emailAlerts') => {
    store.settings[type] = !store.settings[type];
    store.addLog(currentUser.uid, 'security_log', `Toggled configuration parameter: ${type}`);
    store.syncAll();
    onRefresh();
  };

  const handleUnblock = (uid: string) => {
    store.unblockUser(currentUser.uid, uid);
    onRefresh();
  };

  const handleThemeChange = (mode: 'light' | 'dark' | 'glass') => {
    store.settings.appearanceMode = mode;
    store.addLog(currentUser.uid, 'security_log', `Changed system accent theme to: ${mode}`);
    store.syncAll();
    onRefresh();
  };

  return (
    <div className="card-gold bg-black/60 border border-white/10 rounded-3xl p-6 text-left grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Settings Sub navigation */}
      <div className="md:border-r md:border-white/5 md:pr-4 space-y-2.5">
        <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-amber-500 mb-4 flex items-center gap-1.5">
          <Sliders size={13} /> Panel Config
        </h3>
        
        {[
          { id: 'notifications', label: 'Alert Toggles', icon: <Bell size={13} /> },
          { id: 'privacy', label: 'Block Directory', icon: <Lock size={13} /> },
          { id: 'appearance', label: 'Color Contrast', icon: <Palette size={13} /> },
          { id: 'logs', label: 'Scholastic Logs', icon: <History size={13} /> }
        ].map(sTab => (
          <button
            key={sTab.id}
            onClick={() => setActiveSubTab(sTab.id as any)}
            className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeSubTab === sTab.id 
                ? 'bg-amber-500 text-black' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {sTab.icon}
            <span>{sTab.label}</span>
          </button>
        ))}
      </div>

      {/* Settings detail window */}
      <div className="md:col-span-3 min-h-[300px] flex flex-col justify-start">
        {activeSubTab === 'notifications' && (
          <div className="space-y-4">
            <h4 className="font-bold text-xs font-mono uppercase tracking-widest text-amber-500 flex items-center gap-1"><Bell size={12} /> Live Notifications Switches</h4>
            <p className="text-[11px] text-gray-500">Enable instant interactive banner triggers for incoming peer interactions.</p>
            
            <div className="space-y-3.5 mt-4 text-xs text-gray-300">
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <h5 className="font-bold text-gray-200">Interactive Web Popups</h5>
                  <p className="text-[10px] text-gray-500">Receive in-app visual cues for friend requests & chat messages.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotify('notificationsEnabled')}
                  className={`px-3 py-1 text-[10px] uppercase font-bold rounded-lg border transition-colors cursor-pointer ${
                    store.settings.notificationsEnabled 
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' 
                      : 'bg-white/5 text-gray-500 border-white/5'
                  }`}
                >
                  {store.settings.notificationsEnabled ? 'Active' : 'Muted'}
                </button>
              </div>

              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                <div>
                  <h5 className="font-bold text-gray-200">MSU Email Sync Alerts</h5>
                  <p className="text-[10px] text-gray-500">Forwards crucial alerts, grade releases and council reports to your institutional inbox.</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleNotify('emailAlerts')}
                  className={`px-3 py-1 text-[10px] uppercase font-bold rounded-lg border transition-all cursor-pointer ${
                    store.settings.emailAlerts 
                      ? 'bg-amber-500/10 text-amber-300 border-amber-500/30' 
                      : 'bg-white/5 text-gray-500 border-white/5'
                  }`}
                >
                  {store.settings.emailAlerts ? 'Active' : 'Muted'}
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'privacy' && (
          <div className="space-y-4">
            <h4 className="font-bold text-xs font-mono tracking-widest uppercase text-amber-500 flex items-center gap-1"><Lock size={12} /> Restricted Security Blocks</h4>
            <p className="text-[11px] text-gray-500">Blocked users can neither inspect your online status, study timeline feeds nor send direct dialogues.</p>

            {connectionData.blocked && connectionData.blocked.length > 0 ? (
              <div className="space-y-2 mt-4 max-h-[180px] overflow-y-auto pr-1">
                {connectionData.blocked.map(bId => {
                  const bUser = store.profiles.find(p => p.uid === bId);
                  return (
                    <div key={bId} className="flex justify-between items-center p-2.5 rounded-xl bg-[#d9534f]/5 border border-[#d9534f]/15 text-xs">
                      <div>
                        <p className="font-bold text-white">{bUser?.name || "Suspended Scholar"}</p>
                        <p className="text-[9px] text-gray-500">{bUser?.email}</p>
                      </div>
                      <button
                        onClick={() => handleUnblock(bId)}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-[10px] border border-white/5 cursor-pointer flex items-center gap-1"
                      >
                        <UserMinus size={11} /> Lift Restriction
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-white/5 border border-white/5 rounded-xl text-xs text-gray-500 mt-4">
                No active security blocks. Fully connected to the whole university.
              </div>
            )}
          </div>
        )}

        {activeSubTab === 'appearance' && (
          <div className="space-y-4">
            <h4 className="font-bold text-xs font-mono tracking-widest uppercase text-amber-500 flex items-center gap-1"><Palette size={12} /> Accent and Style Themes</h4>
            <p className="text-[11px] text-gray-500">Select visual palettes matching your device capability status.</p>

            <div className="grid grid-cols-3 gap-3 text-xs mt-4">
              {[
                { id: 'dark', label: 'Onyx Dark', desc: 'Saves battery', visual: 'bg-black border-2 border-amber-500/20 text-white' },
                { id: 'glass', label: 'Metallic Gold', desc: 'Polished textures', visual: 'bg-amber-950/20 border-2 border-amber-500/50 text-amber-200' },
                { id: 'light', label: 'Polar Slate', desc: 'High sunlight visibility', visual: 'bg-slate-100 border-2 border-slate-300 text-slate-800' }
              ].map(theme => {
                const isActive = store.settings.appearanceMode === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id as any)}
                    className={`p-4 rounded-xl flex flex-col justify-between items-start text-left cursor-pointer transition-all ${theme.visual} ${
                      isActive ? 'ring-2 ring-amber-500 scale-102 shadow-lg shadow-amber-500/10' : 'opacity-60'
                    }`}
                  >
                    <div>
                      <p className="font-bold">{theme.label}</p>
                      <p className="text-[9px] mt-0.5 opacity-80">{theme.desc}</p>
                    </div>
                    {isActive && <Sparkles size={11} className="mt-4 self-end text-amber-300" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeSubTab === 'logs' && (
          <div className="space-y-4">
            <h4 className="font-bold text-xs font-mono tracking-widest uppercase text-amber-500 flex items-center gap-1"><History size={12} /> Personal Activity Log Archives</h4>
            <p className="text-[11px] text-gray-500">Security history trace of your profile login, posting, comment insertions and circle modifications.</p>

            {userLogs.length > 0 ? (
              <div className="space-y-2.5 mt-4 max-h-[190px] overflow-y-auto pr-1">
                {userLogs.slice(0, 10).map((log) => (
                  <div key={log.id} className="p-2.5 bg-white/5 rounded-xl border border-white/5 text-[10px]">
                    <div className="flex justify-between text-gray-500 font-mono">
                      <span className="font-bold text-amber-400 capitalize">{log.actionType}</span>
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-gray-300 leading-normal mt-0.5">{log.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-white/5 rounded-xl text-xs text-gray-500 mt-4">
                No local transaction activity records found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
