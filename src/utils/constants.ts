/**
 * Application constants and configuration
 */

export const BLOCKING_MODES = {
  HIDE: 'hide' as const,
  REMOVE: 'remove' as const,
  REDIRECT: 'redirect' as const
} as const;

export type BlockingMode = typeof BLOCKING_MODES[keyof typeof BLOCKING_MODES];

export const DEFAULT_SETTINGS = {
  enabled: true,
  blockingMode: BLOCKING_MODES.HIDE,
  showNotifications: true,
  blockInSearch: true,
  blockInHome: true,
  blockInSubscriptions: true,
  blockInTrending: false,
  allowWhitelistedChannels: true,
  whitelistedChannels: [] as string[],
  customCss: '',
  debugMode: false,
  version: '1.0.4'
} as const;

export const STORAGE_KEYS = {
  SETTINGS: 'ytb_settings',
  STATS: 'ytb_stats',
  CHANNEL_INFO: 'ytb_channel_info',
  TEMP_DATA: 'ytb_temp_data'
} as const;

export const APP_CONFIG = {
  NAME: 'YouTube Shorts Blocker',
  VERSION: '1.0.4',
  AUTHOR: 'khabzox',
  GITHUB_URL: 'https://github.com/khabzox/ytb-shorts-blocker',
  CHROME_STORE_URL: 'https://chrome.google.com/webstore',
  
  // Performance settings
  DEBOUNCE_DELAY: 100,
  NAVIGATION_CHECK_INTERVAL: 1000,
  STATS_UPDATE_INTERVAL: 5000,
  
  // UI settings
  NOTIFICATION_DURATION: 3000,
  ANIMATION_DURATION: 300,
  
  // Storage limits
  MAX_DAILY_STATS_ENTRIES: 90,
  MAX_WEEKLY_STATS_ENTRIES: 12,
  MAX_MONTHLY_STATS_ENTRIES: 12,
  MAX_WHITELIST_ENTRIES: 1000,
  
  // Debug settings
  DEBUG_LOG_PREFIX: '[YTB Shorts Blocker]',
  DEBUG_STYLES: {
    BLOCKED_BORDER: '3px solid red',
    BLOCKED_OPACITY: '0.5',
    DEBUG_BACKGROUND: 'rgba(255, 0, 0, 0.1)'
  }
} as const;

export const YOUTUBE_SELECTORS = {
  // Page detection
  BODY: 'body',
  YTD_APP: 'ytd-app',
  
  // Navigation
  YTD_MASTHEAD: 'ytd-masthead',
  SEARCH_BOX: '#search-input input',
  
  // Content areas
  PRIMARY_INNER: '#primary-inner',
  SECONDARY_INNER: '#secondary-inner',
  CONTENTS: '#contents',
  
  // Video elements
  VIDEO_CONTAINER: 'ytd-video-renderer',
  THUMBNAIL: 'ytd-thumbnail',
  VIDEO_TITLE: 'h3 a, #video-title',
  CHANNEL_NAME: '#channel-name, .ytd-channel-name',
  
  // Shorts specific
  SHORTS_INDICATOR: '[is-shorts]',
  REEL_RENDERER: 'ytd-reel-video-renderer',
  SHORTS_SHELF: 'ytd-reel-shelf-renderer',
  
  // Metadata
  METADATA_LINE: 'ytd-video-meta-block',
  VIEW_COUNT: '#metadata-line span',
  UPLOAD_DATE: '#metadata-line span:last-child'
} as const;

export const EXTENSION_MESSAGES = {
  // Content script to background
  UPDATE_STATS: 'update_stats',
  GET_SETTINGS: 'get_settings',
  
  // Popup to background/content
  TOGGLE_EXTENSION: 'toggle_extension',
  UPDATE_SETTINGS: 'update_settings',
  GET_STATUS: 'get_status',
  RESET_STATS: 'reset_stats',
  EXPORT_DATA: 'export_data',
  IMPORT_DATA: 'import_data',
  
  // Background to content
  SETTINGS_UPDATED: 'settings_updated',
  EXTENSION_TOGGLED: 'extension_toggled'
} as const;

export const CSS_CLASSES = {
  // Blocked elements
  BLOCKED: 'ytb-blocked',
  HIDDEN: 'ytb-hidden',
  REMOVED: 'ytb-removed',
  
  // Debug mode
  DEBUG_HIGHLIGHT: 'ytb-debug-highlight',
  DEBUG_OVERLAY: 'ytb-debug-overlay',
  
  // UI components
  NOTIFICATION: 'ytb-notification',
  POPUP_CONTAINER: 'ytb-popup',
  STATS_DISPLAY: 'ytb-stats',
  
  // States
  DISABLED: 'ytb-disabled',
  LOADING: 'ytb-loading',
  ERROR: 'ytb-error'
} as const;

export const CUSTOM_CSS_TEMPLATES = {
  HIDE_WITH_FADE: `
    .${CSS_CLASSES.BLOCKED} {
      opacity: 0 !important;
      transition: opacity 0.3s ease-out !important;
      pointer-events: none !important;
    }
  `,
  
  BLUR_EFFECT: `
    .${CSS_CLASSES.BLOCKED} {
      filter: blur(10px) !important;
      opacity: 0.3 !important;
      transition: all 0.3s ease-out !important;
    }
  `,
  
  GRAYSCALE_EFFECT: `
    .${CSS_CLASSES.BLOCKED} {
      filter: grayscale(100%) !important;
      opacity: 0.5 !important;
      position: relative !important;
    }
    .${CSS_CLASSES.BLOCKED}::after {
      content: "🚫 BLOCKED SHORTS" !important;
      position: absolute !important;
      top: 50% !important;
      left: 50% !important;
      transform: translate(-50%, -50%) !important;
      background: rgba(0, 0, 0, 0.8) !important;
      color: white !important;
      padding: 8px 12px !important;
      border-radius: 4px !important;
      font-size: 12px !important;
      font-weight: bold !important;
      z-index: 1000 !important;
    }
  `,
  
  SLIDE_OUT_EFFECT: `
    .${CSS_CLASSES.BLOCKED} {
      transform: translateX(-100%) !important;
      transition: transform 0.5s ease-in-out !important;
      opacity: 0 !important;
    }
  `
} as const;

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
  INFO: 'info'
} as const;

export const KEYBOARD_SHORTCUTS = {
  TOGGLE_EXTENSION: 'Ctrl+Shift+Y',
  OPEN_POPUP: 'Ctrl+Shift+P',
  TOGGLE_DEBUG: 'Ctrl+Shift+D'
} as const;

export const API_ENDPOINTS = {
  GITHUB_RELEASES: 'https://api.github.com/repos/khabzox/ytb-shorts-blocker/releases/latest',
  UPDATE_CHECK: 'https://api.github.com/repos/khabzox/ytb-shorts-blocker/releases',
  FEEDBACK: 'https://github.com/khabzox/ytb-shorts-blocker/issues/new'
} as const;

export const REGEX_PATTERNS = {
  SHORTS_URL: /\/shorts\/([a-zA-Z0-9_-]+)/,
  VIDEO_ID: /[?&]v=([a-zA-Z0-9_-]+)/,
  CHANNEL_ID: /\/channel\/([a-zA-Z0-9_-]+)/,
  CHANNEL_HANDLE: /\/@([a-zA-Z0-9_.-]+)/,
  PLAYLIST_ID: /[?&]list=([a-zA-Z0-9_-]+)/
} as const;

export const ERROR_MESSAGES = {
  SETTINGS_LOAD_FAILED: 'Failed to load extension settings',
  SETTINGS_SAVE_FAILED: 'Failed to save extension settings',
  STATS_UPDATE_FAILED: 'Failed to update statistics',
  EXPORT_FAILED: 'Failed to export data',
  IMPORT_FAILED: 'Failed to import data',
  INVALID_IMPORT_DATA: 'Invalid import data format',
  STORAGE_QUOTA_EXCEEDED: 'Storage quota exceeded',
  NETWORK_ERROR: 'Network error occurred'
} as const;

export const SUCCESS_MESSAGES = {
  SETTINGS_SAVED: 'Settings saved successfully',
  STATS_RESET: 'Statistics reset successfully',
  DATA_EXPORTED: 'Data exported successfully',
  DATA_IMPORTED: 'Data imported successfully',
  EXTENSION_ENABLED: 'YouTube Shorts Blocker enabled',
  EXTENSION_DISABLED: 'YouTube Shorts Blocker disabled'
} as const;

export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: false,
  ENABLE_AUTO_UPDATE: true,
  ENABLE_BETA_FEATURES: false,
  ENABLE_PERFORMANCE_MONITORING: true,
  ENABLE_ERROR_REPORTING: true
} as const;

export const PERFORMANCE_THRESHOLDS = {
  MAX_PROCESSING_TIME: 100, // milliseconds
  MAX_MEMORY_USAGE: 50, // MB
  MAX_DOM_QUERIES_PER_SECOND: 100,
  MAX_BLOCKED_ELEMENTS_PER_PAGE: 1000
} as const;

/**
 * Utility function to get environment-specific config
 */
export function getEnvironmentConfig() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  const isProduction = !isDevelopment;
  
  return {
    isDevelopment,
    isProduction,
    logLevel: isDevelopment ? 'debug' : 'error',
    enableVerboseLogging: isDevelopment,
    enablePerformanceMonitoring: isProduction,
    apiBaseUrl: isDevelopment 
      ? 'http://localhost:3000/api' 
      : 'https://api.ytb-shorts-blocker.com'
  };
}

/**
 * Version comparison utility
 */
export function compareVersions(version1: string, version2: string): number {
  const v1parts = version1.split('.').map(Number);
  const v2parts = version2.split('.').map(Number);
  
  const maxLength = Math.max(v1parts.length, v2parts.length);
  
  for (let i = 0; i < maxLength; i++) {
    const v1part = v1parts[i] || 0;
    const v2part = v2parts[i] || 0;
    
    if (v1part < v2part) return -1;
    if (v1part > v2part) return 1;
  }
  
  return 0;
}