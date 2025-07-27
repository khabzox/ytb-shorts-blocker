// ============================================================================
// CLEAN BACKGROUND SCRIPT - YouTube Shorts Blocker
// ============================================================================

// Initialize storage when extension is installed
chrome.runtime.onInstalled.addListener((details) => {
  console.log('YouTube Shorts Blocker installed:', details.reason);
  
  if (details.reason === 'install') {
    // Set default settings
    chrome.storage.sync.set({
      ytb_settings: {
        enabled: true,
        blockingMode: 'hide',
        showNotifications: true,
        blockInSearch: true,
        blockInHome: true,
        blockInSubscriptions: true,
        blockInTrending: false,
        allowWhitelistedChannels: true,
        whitelistedChannels: [],
        customCss: '',
        debugMode: false,
        version: '1.0.0'
      }
    });
    
    // Initialize stats
    chrome.storage.local.set({
      ytb_stats: {
        totalBlocked: 0,
        sessionBlocked: 0,
        lastResetDate: new Date().toISOString(),
        dailyStats: {},
        weeklyStats: {},
        monthlyStats: {}
      }
    });
    
    console.log('Default settings and stats initialized');
  }
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received:', request);
  
  switch (request.action) {
    case 'getStatus':
      handleGetStatus(sendResponse);
      break;
      
    case 'updateSettings':
      handleUpdateSettings(request.settings, sendResponse);
      break;
      
    case 'resetStats':
      handleResetStats(sendResponse);
      break;
      
    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }
  
  return true; // Keep message channel open for async response
});

// Handle get status request
async function handleGetStatus(sendResponse: (response: any) => void) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab?.id || !tab.url?.includes('youtube.com')) {
      sendResponse({ 
        success: true, 
        data: { 
          enabled: false, 
          blocked: 0, 
          message: 'Not on YouTube' 
        } 
      });
      return;
    }
    
    // Send message to content script to get status
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'getStatus' });
    sendResponse({ success: true, data: response });
    
  } catch (error) {
    console.error('Failed to get status:', error);
    sendResponse({ 
      success: false, 
      error: 'Failed to get status from content script' 
    });
  }
}

// Handle update settings request
async function handleUpdateSettings(settings: any, sendResponse: (response: any) => void) {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab?.id || !tab.url?.includes('youtube.com')) {
      sendResponse({ 
        success: false, 
        error: 'Not on YouTube page' 
      });
      return;
    }
    
    // Save settings
    await chrome.storage.sync.set({ ytb_settings: settings });
    
    // Send message to content script
    const response = await chrome.tabs.sendMessage(tab.id, {
      action: 'updateSettings',
      settings
    });
    
    sendResponse({ success: true, data: response });
    
  } catch (error) {
    console.error('Failed to update settings:', error);
    sendResponse({ 
      success: false, 
      error: 'Failed to update settings' 
    });
  }
}

// Handle reset stats request
async function handleResetStats(sendResponse: (response: any) => void) {
  try {
    await chrome.storage.local.set({
      ytb_stats: {
        totalBlocked: 0,
        sessionBlocked: 0,
        lastResetDate: new Date().toISOString(),
        dailyStats: {},
        weeklyStats: {},
        monthlyStats: {}
      }
    });
    
    sendResponse({ success: true, message: 'Statistics reset successfully' });
    
  } catch (error) {
    console.error('Failed to reset stats:', error);
    sendResponse({ 
      success: false, 
      error: 'Failed to reset statistics' 
    });
  }
}

console.log('YouTube Shorts Blocker background script loaded successfully'); 