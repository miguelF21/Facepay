import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database,
  Palette,
  Globe,
  Save,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useAuth0();
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: false,
      attendance: true,
      payroll: true
    },
    appearance: {
      theme: 'light',
      language: 'en',
      timezone: 'UTC-5'
    },
    system: {
      autoBackup: true,
      dataRetention: '90',
      sessionTimeout: '30'
    }
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSaveSettings = () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('appSettings', JSON.stringify(settings));
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  const handleResetSettings = () => {
    if (window.confirm('Are you sure you want to reset all settings to default?')) {
      const defaultSettings = {
        notifications: {
          email: true,
          push: false,
          attendance: true,
          payroll: true
        },
        appearance: {
          theme: 'light',
          language: 'en',
          timezone: 'UTC-5'
        },
        system: {
          autoBackup: true,
          dataRetention: '90',
          sessionTimeout: '30'
        }
      };
      setSettings(defaultSettings);
      localStorage.setItem('appSettings', JSON.stringify(defaultSettings));
    }
  };

  const SettingSection = ({ title, icon: Icon, children }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="mb-6 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
          <CardTitle className="flex items-center gap-3 text-lg">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-slate-800 dark:text-slate-200">{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
      <div className="flex-1">
        <p className="font-medium text-slate-800 dark:text-slate-200">{label}</p>
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
          checked ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 rotate-180 text-slate-600 dark:text-slate-300" />
              </button>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Settings
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Manage your application preferences and configurations
                </p>
              </div>
            </div>
            <SettingsIcon className="w-12 h-12 text-blue-600 dark:text-blue-400 opacity-50" />
          </div>
        </motion.div>

        {/* User Profile Section */}
        <SettingSection title="User Profile" icon={User}>
          <div className="flex items-center gap-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl">
            {user?.picture ? (
              <img
                src={user.picture}
                alt={user.name}
                className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-700 shadow-lg"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                {user?.name || 'User Name'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400">{user?.email || 'user@example.com'}</p>
              <div className="flex gap-2 mt-3">
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                  Admin
                </span>
                <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
            </div>
          </div>
        </SettingSection>

        {/* Notifications */}
        <SettingSection title="Notifications" icon={Bell}>
          <div className="space-y-1">
            <ToggleSwitch
              checked={settings.notifications.email}
              onChange={(val) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, email: val }
              })}
              label="Email Notifications"
              description="Receive notifications via email"
            />
            <ToggleSwitch
              checked={settings.notifications.push}
              onChange={(val) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, push: val }
              })}
              label="Push Notifications"
              description="Receive push notifications in browser"
            />
            <ToggleSwitch
              checked={settings.notifications.attendance}
              onChange={(val) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, attendance: val }
              })}
              label="Attendance Alerts"
              description="Get notified about attendance events"
            />
            <ToggleSwitch
              checked={settings.notifications.payroll}
              onChange={(val) => setSettings({
                ...settings,
                notifications: { ...settings.notifications, payroll: val }
              })}
              label="Payroll Updates"
              description="Receive payroll processing notifications"
            />
          </div>
        </SettingSection>

        {/* Appearance */}
        <SettingSection title="Appearance" icon={Palette}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Theme
              </label>
              <select
                value={settings.appearance.theme}
                onChange={(e) => setSettings({
                  ...settings,
                  appearance: { ...settings.appearance, theme: e.target.value }
                })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Language
              </label>
              <select
                value={settings.appearance.language}
                onChange={(e) => setSettings({
                  ...settings,
                  appearance: { ...settings.appearance, language: e.target.value }
                })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
        </SettingSection>

        {/* System Settings */}
        <SettingSection title="System" icon={Database}>
          <div className="space-y-4">
            <ToggleSwitch
              checked={settings.system.autoBackup}
              onChange={(val) => setSettings({
                ...settings,
                system: { ...settings.system, autoBackup: val }
              })}
              label="Automatic Backup"
              description="Enable daily automatic database backups"
            />
            <div className="pt-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Data Retention (days)
              </label>
              <input
                type="number"
                value={settings.system.dataRetention}
                onChange={(e) => setSettings({
                  ...settings,
                  system: { ...settings.system, dataRetention: e.target.value }
                })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                value={settings.system.sessionTimeout}
                onChange={(e) => setSettings({
                  ...settings,
                  system: { ...settings.system, sessionTimeout: e.target.value }
                })}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </SettingSection>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-4 justify-end mt-8"
        >
          <button
            onClick={handleResetSettings}
            className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-200 flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Reset to Default
          </button>
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : saved ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </span>
                Saved!
              </span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
