import { DEFAULT_SETTINGS, STORAGE_KEYS } from './constants';

/**
 * Chrome Storage API utilities for managing extension settings and data
 */

export interface ExtensionSettings {
  enabled: boolean;
  blockingMode: 'hide' | 'remove' | 'redirect';
  showNotifications: boolean;
  blockInSearch: boolean;
  blockInHome: boolean;
  blockInSubscriptions: boolean;
  blockInTrending: boolean;
  allowWhitelistedChannels: boolean;
  whitelistedChannels: string[];
  customCss: string;
  debugMode: boolean;
  version: string;
}

export interface ExtensionStats {
  totalBlocked: number;
  sessionBlocked: number;
  lastResetDate: string;
  dailyStats: { [date: string]: number };
  weeklyStats: { [week: string]: number };
  monthlyStats: { [month: string]: number };
}

/**
 * Get all extension settings from Chrome storage
 */
export async function getSettings(): Promise<ExtensionSettings> {
  try {
    const result = await chrome.storage.sync.get(STORAGE_KEYS.SETTINGS);
    return { ...DEFAULT_SETTINGS, ...result[STORAGE_KEYS.SETTINGS] };
  } catch (error) {
    console.error('Failed to get settings:', error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save extension settings to Chrome storage
 */
export async function saveSettings(settings: Partial<ExtensionSettings>): Promise<void> {
  try {
    const currentSettings = await getSettings();
    const updatedSettings = { ...currentSettings, ...settings };
    
    await chrome.storage.sync.set({
      [STORAGE_KEYS.SETTINGS]: updatedSettings
    });
    
    console.log('Settings saved successfully:', updatedSettings);
  } catch (error) {
    console.error('Failed to save settings:', error);
    throw error;
  }
}

/**
 * Get extension statistics from Chrome storage
 */
export async function getStats(): Promise<ExtensionStats> {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEYS.STATS);
    const defaultStats: ExtensionStats = {
      totalBlocked: 0,
      sessionBlocked: 0,
      lastResetDate: new Date().toISOString(),
      dailyStats: {},
      weeklyStats: {},
      monthlyStats: {}
    };
    
    return { ...defaultStats, ...result[STORAGE_KEYS.STATS] };
  } catch (error) {
    console.error('Failed to get stats:', error);
    return {
      totalBlocked: 0,
      sessionBlocked: 0,
      lastResetDate: new Date().toISOString(),
      dailyStats: {},
      weeklyStats: {},
      monthlyStats: {}
    };
  }
}

/**
 * Update statistics when shorts are blocked
 */
export async function updateStats(incrementBy: number = 1): Promise<void> {
  try {
    const currentStats = await getStats();
    const now = new Date();
    const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const thisWeek = getWeekKey(now);
    const thisMonth = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`;
    
    const updatedStats: ExtensionStats = {
      ...currentStats,
      totalBlocked: currentStats.totalBlocked + incrementBy,
      sessionBlocked: currentStats.sessionBlocked + incrementBy,
      dailyStats: {
        ...currentStats.dailyStats,
        [today]: (currentStats.dailyStats[today] || 0) + incrementBy
      },
      weeklyStats: {
        ...currentStats.weeklyStats,
        [thisWeek]: (currentStats.weeklyStats[thisWeek] || 0) + incrementBy
      },
      monthlyStats: {
        ...currentStats.monthlyStats,
        [thisMonth]: (currentStats.monthlyStats[thisMonth] || 0) + incrementBy
      }
    };
    
    await chrome.storage.local.set({
      [STORAGE_KEYS.STATS]: updatedStats
    });
    
    // Clean up old stats (keep last 90 days, 12 weeks, 12 months)
    await cleanupOldStats();
    
  } catch (error) {
    console.error('Failed to update stats:', error);
  }
}

/**
 * Reset session statistics
 */
export async function resetSessionStats(): Promise<void> {
  try {
    const currentStats = await getStats();
    const updatedStats = {
      ...currentStats,
      sessionBlocked: 0
    };
    
    await chrome.storage.local.set({
      [STORAGE_KEYS.STATS]: updatedStats
    });
  } catch (error) {
    console.error('Failed to reset session stats:', error);
  }
}

/**
 * Reset all statistics
 */
export async function resetAllStats(): Promise<void> {
  try {
    const resetStats: ExtensionStats = {
      totalBlocked: 0,
      sessionBlocked: 0,
      lastResetDate: new Date().toISOString(),
      dailyStats: {},
      weeklyStats: {},
      monthlyStats: {}
    };
    
    await chrome.storage.local.set({
      [STORAGE_KEYS.STATS]: resetStats
    });
  } catch (error) {
    console.error('Failed to reset all stats:', error);
  }
}

/**
 * Get whitelist from storage
 */
export async function getWhitelist(): Promise<string[]> {
  try {
    const settings = await getSettings();
    return settings.whitelistedChannels || [];
  } catch (error) {
    console.error('Failed to get whitelist:', error);
    return [];
  }
}

/**
 * Add channel to whitelist
 */
export async function addToWhitelist(channelId: string, channelName?: string): Promise<void> {
  try {
    const currentSettings = await getSettings();
    const whitelist = currentSettings.whitelistedChannels || [];
    
    if (!whitelist.includes(channelId)) {
      whitelist.push(channelId);
      await saveSettings({ whitelistedChannels: whitelist });
      
      // Also save channel name for reference
      if (channelName) {
        await saveChannelInfo(channelId, channelName);
      }
    }
  } catch (error) {
    console.error('Failed to add to whitelist:', error);
  }
}

/**
 * Remove channel from whitelist
 */
export async function removeFromWhitelist(channelId: string): Promise<void> {
  try {
    const currentSettings = await getSettings();
    const whitelist = currentSettings.whitelistedChannels || [];
    const updatedWhitelist = whitelist.filter(id => id !== channelId);
    
    await saveSettings({ whitelistedChannels: updatedWhitelist });
  } catch (error) {
    console.error('Failed to remove from whitelist:', error);
  }
}

/**
 * Save channel information for reference
 */
async function saveChannelInfo(channelId: string, channelName: string): Promise<void> {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEYS.CHANNEL_INFO);
    const channelInfo = result[STORAGE_KEYS.CHANNEL_INFO] || {};
    
    channelInfo[channelId] = {
      name: channelName,
      addedDate: new Date().toISOString()
    };
    
    await chrome.storage.local.set({
      [STORAGE_KEYS.CHANNEL_INFO]: channelInfo
    });
  } catch (error) {
    console.error('Failed to save channel info:', error);
  }
}

/**
 * Get channel information
 */
export async function getChannelInfo(channelId: string): Promise<{ name: string; addedDate: string } | null> {
  try {
    const result = await chrome.storage.local.get(STORAGE_KEYS.CHANNEL_INFO);
    const channelInfo = result[STORAGE_KEYS.CHANNEL_INFO] || {};
    return channelInfo[channelId] || null;
  } catch (error) {
    console.error('Failed to get channel info:', error);
    return null;
  }
}

/**
 * Export all extension data
 */
export async function exportData(): Promise<string> {
  try {
    const settings = await getSettings();
    const stats = await getStats();
    const channelInfoResult = await chrome.storage.local.get(STORAGE_KEYS.CHANNEL_INFO);
    const channelInfo = channelInfoResult[STORAGE_KEYS.CHANNEL_INFO] || {};
    
    const exportData = {
      settings,
      stats,
      channelInfo,
      exportDate: new Date().toISOString(),
      version: chrome.runtime.getManifest().version
    };
    
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Failed to export data:', error);
    throw error;
  }
}

/**
 * Import extension data
 */
export async function importData(jsonData: string): Promise<void> {
  try {
    const data = JSON.parse(jsonData);
    
    // Validate data structure
    if (!data.settings || !data.stats) {
      throw new Error('Invalid data format');
    }
    
    // Import settings
    await saveSettings(data.settings);
    
    // Import stats
    await chrome.storage.local.set({
      [STORAGE_KEYS.STATS]: data.stats
    });
    
    // Import channel info
    if (data.channelInfo) {
      await chrome.storage.local.set({
        [STORAGE_KEYS.CHANNEL_INFO]: data.channelInfo
      });
    }
    
    console.log('Data imported successfully');
  } catch (error) {
    console.error('Failed to import data:', error);
    throw error;
  }
}

/**
 * Clean up old statistics to prevent unlimited storage growth
 */
async function cleanupOldStats(): Promise<void> {
  try {
    const stats = await getStats();
    const now = new Date();
    
    // Clean daily stats (keep last 90 days)
    const cutoffDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    const cutoffDateString = cutoffDate.toISOString().split('T')[0];
    
    const cleanedDailyStats: { [date: string]: number } = {};
    Object.entries(stats.dailyStats).forEach(([date, count]) => {
      if (date >= cutoffDateString) {
        cleanedDailyStats[date] = count;
      }
    });
    
    // Clean weekly stats (keep last 12 weeks)
    const cutoffWeek = getWeekKey(new Date(now.getTime() - 12 * 7 * 24 * 60 * 60 * 1000));
    const cleanedWeeklyStats: { [week: string]: number } = {};
    Object.entries(stats.weeklyStats).forEach(([week, count]) => {
      if (week >= cutoffWeek) {
        cleanedWeeklyStats[week] = count;
      }
    });
    
    // Clean monthly stats (keep last 12 months)
    const cutoffMonth = new Date(now.getFullYear(), now.getMonth() - 12);
    const cutoffMonthString = `${cutoffMonth.getFullYear()}-${(cutoffMonth.getMonth() + 1).toString().padStart(2, '0')}`;
    
    const cleanedMonthlyStats: { [month: string]: number } = {};
    Object.entries(stats.monthlyStats).forEach(([month, count]) => {
      if (month >= cutoffMonthString) {
        cleanedMonthlyStats[month] = count;
      }
    });
    
    // Update stats with cleaned data
    const cleanedStats = {
      ...stats,
      dailyStats: cleanedDailyStats,
      weeklyStats: cleanedWeeklyStats,
      monthlyStats: cleanedMonthlyStats
    };
    
    await chrome.storage.local.set({
      [STORAGE_KEYS.STATS]: cleanedStats
    });
    
  } catch (error) {
    console.error('Failed to cleanup old stats:', error);
  }
}

/**
 * Get week key for statistics (format: YYYY-WW)
 */
function getWeekKey(date: Date): string {
  const year = date.getFullYear();
  const startOfYear = new Date(year, 0, 1);
  const weekNumber = Math.ceil(((date.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${year}-${weekNumber.toString().padStart(2, '0')}`;
}

/**
 * Initialize storage with default values if empty
 */
export async function initializeStorage(): Promise<void> {
  try {
    const settings = await getSettings();
    const stats = await getStats();
    
    // If this is the first run, save default values
    if (!settings.version) {
      await saveSettings({ ...DEFAULT_SETTINGS, version: chrome.runtime.getManifest().version });
    }
    
    // Reset session stats on initialization
    await resetSessionStats();
    
    console.log('Storage initialized successfully');
  } catch (error) {
    console.error('Failed to initialize storage:', error);
  }
}

/**
 * Migration function for handling version updates
 */
export async function migrateStorage(oldVersion: string, newVersion: string): Promise<void> {
  try {
    console.log(`Migrating storage from ${oldVersion} to ${newVersion}`);
    
    // Add migration logic here for future versions
    // Example:
    // if (compareVersions(oldVersion, '1.1.0') < 0) {
    //   // Migration for version 1.1.0
    // }
    
    // Update version in settings
    await saveSettings({ version: newVersion });
    
    console.log('Storage migration completed successfully');
  } catch (error) {
    console.error('Failed to migrate storage:', error);
  }
}