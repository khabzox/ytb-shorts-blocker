import { getSettings, saveSettings, getStats } from '../utils/storage';
import { BLOCKING_MODES, DEFAULT_SETTINGS } from '../utils/constants';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface PopupState {
  settings: any;
  stats: any;
  isLoading: boolean;
  error: string | null;
}

// ============================================================================
// DOM ELEMENTS
// ============================================================================

function getPopupElements() {
  return {
    toggleSwitch: document.getElementById('toggle-extension') as HTMLInputElement,
    blockingModeSelect: document.getElementById('blocking-mode') as HTMLSelectElement,
    notificationsToggle: document.getElementById('notifications') as HTMLInputElement,
    blockInHomeToggle: document.getElementById('block-in-home') as HTMLInputElement,
    blockInSearchToggle: document.getElementById('block-in-search') as HTMLInputElement,
    blockInSubscriptionsToggle: document.getElementById('block-in-subscriptions') as HTMLInputElement,
    blockInTrendingToggle: document.getElementById('block-in-trending') as HTMLInputElement,
    whitelistToggle: document.getElementById('whitelist-channels') as HTMLInputElement,
    debugToggle: document.getElementById('debug-mode') as HTMLInputElement,
    statsDisplay: document.getElementById('stats-display') as HTMLElement,
    statusIndicator: document.getElementById('status-indicator') as HTMLElement,
    saveButton: document.getElementById('save-settings') as HTMLButtonElement,
    resetButton: document.getElementById('reset-settings') as HTMLButtonElement
  };
}

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

let popupState: PopupState = {
  settings: DEFAULT_SETTINGS,
  stats: null,
  isLoading: true,
  error: null
};

/**
 * Update popup state and UI
 */
function updatePopupState(newState: Partial<PopupState>): void {
  popupState = { ...popupState, ...newState };
  updateUI();
}

/**
 * Update UI based on current state
 */
function updateUI(): void {
  const elements = getPopupElements();
  
  if (popupState.isLoading) {
    showLoadingState();
    return;
  }
  
  if (popupState.error) {
    showErrorState(popupState.error);
    return;
  }
  
  // Update form elements
  elements.toggleSwitch.checked = popupState.settings.enabled;
  elements.blockingModeSelect.value = popupState.settings.blockingMode;
  elements.notificationsToggle.checked = popupState.settings.showNotifications;
  elements.blockInHomeToggle.checked = popupState.settings.blockInHome;
  elements.blockInSearchToggle.checked = popupState.settings.blockInSearch;
  elements.blockInSubscriptionsToggle.checked = popupState.settings.blockInSubscriptions;
  elements.blockInTrendingToggle.checked = popupState.settings.blockInTrending;
  elements.whitelistToggle.checked = popupState.settings.allowWhitelistedChannels;
  elements.debugToggle.checked = popupState.settings.debugMode;
  
  // Update toggle switch styling
  updateToggleSwitch();
  
  // Update status indicator
  updateStatusIndicator();
  
  // Update stats display
  updateStatsDisplay();
  
  // Show main content
  showMainContent();
}

// ============================================================================
// TOGGLE SWITCH FUNCTIONALITY
// ============================================================================

function updateToggleSwitch(): void {
  const elements = getPopupElements();
  const toggleSwitch = elements.toggleSwitch;
  const toggleSwitchElement = toggleSwitch.parentElement?.querySelector('.toggle-switch') as HTMLElement;
  const toggleSlider = toggleSwitch.parentElement?.querySelector('.toggle-slider') as HTMLElement;
  
  if (toggleSwitchElement && toggleSlider) {
    if (toggleSwitch.checked) {
      toggleSwitchElement.classList.remove('bg-gray-300');
      toggleSwitchElement.classList.add('bg-primary-600');
      toggleSlider.classList.add('translate-x-5');
    } else {
      toggleSwitchElement.classList.remove('bg-primary-600');
      toggleSwitchElement.classList.add('bg-gray-300');
      toggleSlider.classList.remove('translate-x-5');
    }
  }
}

// ============================================================================
// UI STATE FUNCTIONS
// ============================================================================

function showLoadingState(): void {
  const elements = getPopupElements();
  elements.statusIndicator.innerHTML = `
    <div class="flex items-center space-x-2 text-yellow-300">
      <div class="animate-spin rounded-full h-4 w-4 border-2 border-yellow-300 border-t-transparent"></div>
      <span>Loading...</span>
    </div>
  `;
}

function showErrorState(error: string): void {
  const elements = getPopupElements();
  elements.statusIndicator.innerHTML = `
    <div class="flex items-center space-x-2 text-red-300">
      <span>⚠️</span>
      <span>Error: ${error}</span>
    </div>
  `;
}

function showMainContent(): void {
  // Status indicator will be updated by updateStatusIndicator()
}

function updateStatusIndicator(): void {
  const elements = getPopupElements();
  const isEnabled = popupState.settings.enabled;
  
  elements.statusIndicator.innerHTML = `
    <div class="flex items-center space-x-2">
      <span class="text-lg">${isEnabled ? '✅' : '❌'}</span>
      <span class="text-sm font-medium">
        ${isEnabled ? 'Extension Enabled' : 'Extension Disabled'}
      </span>
    </div>
  `;
}

function updateStatsDisplay(): void {
  const elements = getPopupElements();
  
  if (!popupState.stats) {
    elements.statsDisplay.innerHTML = `
      <div class="text-center text-gray-500 italic">
        No statistics available
      </div>
    `;
    return;
  }
  
  elements.statsDisplay.innerHTML = `
    <div class="grid grid-cols-2 gap-4">
      <div class="text-center">
        <div class="text-2xl font-bold text-primary-600 mb-1">
          ${popupState.stats.totalBlocked || 0}
        </div>
        <div class="text-xs text-gray-500 font-medium">
          Total Blocked
        </div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-primary-600 mb-1">
          ${popupState.stats.sessionBlocked || 0}
        </div>
        <div class="text-xs text-gray-500 font-medium">
          This Session
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Handle settings form submission
 */
async function handleSaveSettings(): Promise<void> {
  const elements = getPopupElements();
  
  try {
    updatePopupState({ isLoading: true });
    
    const newSettings = {
      enabled: elements.toggleSwitch.checked,
      blockingMode: elements.blockingModeSelect.value as 'hide' | 'remove' | 'redirect',
      showNotifications: elements.notificationsToggle.checked,
      blockInHome: elements.blockInHomeToggle.checked,
      blockInSearch: elements.blockInSearchToggle.checked,
      blockInSubscriptions: elements.blockInSubscriptionsToggle.checked,
      blockInTrending: elements.blockInTrendingToggle.checked,
      allowWhitelistedChannels: elements.whitelistToggle.checked,
      debugMode: elements.debugToggle.checked
    };
    
    await saveSettings(newSettings);
    
    // Update content script
    await chrome.tabs.query({ active: true, currentWindow: true });
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (activeTab?.id) {
      await chrome.tabs.sendMessage(activeTab.id, {
        action: 'updateSettings',
        settings: newSettings
      });
    }
    
    updatePopupState({ 
      settings: { ...popupState.settings, ...newSettings },
      isLoading: false 
    });
    
    showSuccessMessage('Settings saved successfully!');
    
  } catch (error) {
    updatePopupState({ 
      error: 'Failed to save settings',
      isLoading: false 
    });
  }
}

/**
 * Handle reset settings
 */
async function handleResetSettings(): Promise<void> {
  try {
    updatePopupState({ isLoading: true });
    
    await saveSettings(DEFAULT_SETTINGS);
    
    // Update content script
    const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (activeTab?.id) {
      await chrome.tabs.sendMessage(activeTab.id, {
        action: 'updateSettings',
        settings: DEFAULT_SETTINGS
      });
    }
    
    updatePopupState({ 
      settings: DEFAULT_SETTINGS,
      isLoading: false 
    });
    
    showSuccessMessage('Settings reset to defaults!');
    
  } catch (error) {
    updatePopupState({ 
      error: 'Failed to reset settings',
      isLoading: false 
    });
  }
}

/**
 * Show success message
 */
function showSuccessMessage(message: string): void {
  const elements = getPopupElements();
  const originalText = elements.saveButton.textContent;
  const originalClasses = elements.saveButton.className;
  
  elements.saveButton.textContent = message;
  elements.saveButton.className = 'flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2';
  elements.saveButton.disabled = true;
  
  setTimeout(() => {
    elements.saveButton.textContent = originalText;
    elements.saveButton.className = originalClasses;
    elements.saveButton.disabled = false;
  }, 2000);
}

// ============================================================================
// DATA LOADING
// ============================================================================

/**
 * Load initial data
 */
async function loadInitialData(): Promise<void> {
  try {
    updatePopupState({ isLoading: true });
    
    const [settings, stats] = await Promise.all([
      getSettings(),
      getStats()
    ]);
    
    updatePopupState({
      settings,
      stats,
      isLoading: false
    });
    
  } catch (error) {
    updatePopupState({
      error: 'Failed to load data',
      isLoading: false
    });
  }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

/**
 * Initialize popup
 */
function initializePopup(): void {
  const elements = getPopupElements();
  
  // Add event listeners
  elements.saveButton.addEventListener('click', handleSaveSettings);
  elements.resetButton.addEventListener('click', handleResetSettings);
  
  // Add toggle switch event listener
  elements.toggleSwitch.addEventListener('change', updateToggleSwitch);
  
  // Load initial data
  loadInitialData();
}

// ============================================================================
// STARTUP
// ============================================================================

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePopup);
} else {
  initializePopup();
}
