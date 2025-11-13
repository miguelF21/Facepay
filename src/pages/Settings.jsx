import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Palette,
  Database,
  Save,
  RefreshCw,
  Home,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

export default function Settings() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0();
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      attendance: true,
      payroll: true
    },
    display: {
      theme: 'light',
      language: 'en',
      dateFormat: 'MM/DD/YYYY'
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
      passwordExpiry: 90
    },
    system: {
      autoBackup: true,
      backupFrequency: 'daily',
      dataRetention: 365
    }
  });

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('facepay_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      localStorage.setItem('facepay_settings', JSON.stringify(settings));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      const defaultSettings = {
        notifications: { email: true, push: false, attendance: true, payroll: true },
        display: { theme: 'light', language: 'en', dateFormat: 'MM/DD/YYYY' },
        security: { twoFactor: false, sessionTimeout: 30, passwordExpiry: 90 },
        system: { autoBackup: true, backupFrequency: 'daily', dataRetention: 365 }
      };
      setSettings(defaultSettings);
      localStorage.setItem('facepay_settings', JSON.stringify(defaultSettings));
    }
  };

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: { ...prev[category], [key]: value }
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <Shield className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">Authentication Required</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6">Please sign in to access settings</p>
          <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center gap-2 mx-auto">
            <Home className="w-5 h-5" /> Go to Dashboard
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl">
                <SettingsIcon className="w-8 h-8 text-slate-700 dark:text-slate-300" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">Settings</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your system configuration</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleReset} className="px-4 py-2 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-100 dark:hover:bg-slate-600 transition-all duration-200 flex items-center gap-2 border border-slate-300 dark:border-slate-600">
                <RefreshCw className="w-4 h-4" /> Reset
              </button>
              <button onClick={handleSave} disabled={loading} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? <RefreshCw className="w-5 h-5 animate-spin" /> : saveSuccess ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                {loading ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Changes'}
              </button>
            </div>
          </div>

          {user && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="border border-blue-100 dark:border-blue-900/30 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-blue-900/10 mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {user.picture ? (
                      <img src={user.picture} alt={user.name} className="w-16 h-16 rounded-xl object-cover shadow-lg ring-4 ring-blue-100 dark:ring-blue-900" />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                        <User size={28} className="text-white" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{user.name || 'User'}</h3>
                      <p className="text-slate-600 dark:text-slate-400">{user.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">Active Account</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Notifications */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border border-slate-200 dark:border-slate-700 shadow-lg h-full">
              <CardHeader className="border-b border-slate-100 dark:border-slate-700">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Bell className="w-6 h-6 text-amber-600" /> Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-slate-100 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Enable {key} notifications</p>
                    </div>
                    <button onClick={() => updateSetting('notifications', key, !value)} className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${value ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                      <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${value ? 'translate-x-7' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Display */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border border-slate-200 dark:border-slate-700 shadow-lg h-full">
              <CardHeader className="border-b border-slate-100 dark:border-slate-700">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Palette className="w-6 h-6 text-purple-600" /> Display
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block font-semibold text-slate-900 dark:text-slate-100 mb-2">Theme</label>
                  <select value={settings.display.theme} onChange={(e) => updateSetting('display', 'theme', e.target.value)} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-purple-500">
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-900 dark:text-slate-100 mb-2">Language</label>
                  <select value={settings.display.language} onChange={(e) => updateSetting('display', 'language', e.target.value)} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-purple-500">
                    <option value="en">English</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-900 dark:text-slate-100 mb-2">Date Format</label>
                  <select value={settings.display.dateFormat} onChange={(e) => updateSetting('display', 'dateFormat', e.target.value)} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-purple-500">
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Security */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border border-slate-200 dark:border-slate-700 shadow-lg h-full">
              <CardHeader className="border-b border-slate-100 dark:border-slate-700">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Shield className="w-6 h-6 text-red-600" /> Security
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Two-Factor Auth</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Extra security layer</p>
                  </div>
                  <button onClick={() => updateSetting('security', 'twoFactor', !settings.security.twoFactor)} className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${settings.security.twoFactor ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                    <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${settings.security.twoFactor ? 'translate-x-7' : 'translate-x-0'}`} />
                  </button>
                </div>
                <div>
                  <label className="block font-semibold text-slate-900 dark:text-slate-100 mb-2">Session Timeout (min)</label>
                  <input type="number" value={settings.security.sessionTimeout} onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-red-500" min="5" max="120" />
                </div>
                <div>
                  <label className="block font-semibold text-slate-900 dark:text-slate-100 mb-2">Password Expiry (days)</label>
                  <input type="number" value={settings.security.passwordExpiry} onChange={(e) => updateSetting('security', 'passwordExpiry', parseInt(e.target.value))} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-red-500" min="30" max="365" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* System */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
            <Card className="border border-slate-200 dark:border-slate-700 shadow-lg h-full">
              <CardHeader className="border-b border-slate-100 dark:border-slate-700">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <Database className="w-6 h-6 text-emerald-600" /> System
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">Auto Backup</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Schedule backups</p>
                  </div>
                  <button onClick={() => updateSetting('system', 'autoBackup', !settings.system.autoBackup)} className={`relative w-14 h-7 rounded-full transition-colors duration-200 ${settings.system.autoBackup ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                    <div className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${settings.system.autoBackup ? 'translate-x-7' : 'translate-x-0'}`} />
                  </button>
                </div>
                <div>
                  <label className="block font-semibold text-slate-900 dark:text-slate-100 mb-2">Backup Frequency</label>
                  <select value={settings.system.backupFrequency} onChange={(e) => updateSetting('system', 'backupFrequency', e.target.value)} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500" disabled={!settings.system.autoBackup}>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-900 dark:text-slate-100 mb-2">Data Retention (days)</label>
                  <input type="number" value={settings.system.dataRetention} onChange={(e) => updateSetting('system', 'dataRetention', parseInt(e.target.value))} className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500" min="30" max="3650" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="mt-6 flex justify-between items-center">
          <button onClick={() => navigate('/dashboard')} className="px-6 py-3 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-100 dark:hover:bg-slate-600 transition-all duration-200 flex items-center gap-2 border border-slate-300 dark:border-slate-600">
            <Home className="w-5 h-5" /> Back to Dashboard
          </button>
          {saveSuccess && (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold">
              <Check className="w-5 h-5" /> Settings saved successfully!
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
