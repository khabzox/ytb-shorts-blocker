import { SELECTORS } from '../utils/selectors';
import { getSettings, updateStats } from '../utils/storage';
import { BLOCKING_MODES, DEFAULT_SETTINGS, APP_CONFIG } from '../utils/constants';
import './styles.css';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

interface BlockerState {
  settings: any;
  blockedCount: number;
  isDebugMode: boolean;
  observer: MutationObserver | null;
  lastUrl: string;
}

interface ShortElement {
  element: Element;
  videoId: string | null;
  channelInfo: { name?: string; id?: string; handle?: string } | null;
}

// Chrome extension types
declare global {
  const chrome: any;
}

// ============================================================================
// CORE UTILITY FUNCTIONS
// ============================================================================

/**
 * Pure function to check if extension is enabled
 */
function isExtensionEnabled(settings: any): boolean {
  return settings.enabled === true;
}

/**
 * Pure function to check if debug mode is active
 */
function isDebugMode(settings: any): boolean {
  return settings.debugMode || localStorage.getItem('ytb-debug') === 'true';
}

/**
 * Pure function to log messages with debug mode check
 */
function log(message: string, isDebug: boolean, ...args: any[]): void {
  if (isDebug) {
    console.log(`[YTB Shorts Blocker] ${message}`, ...args);
  }
}

/**
 * Pure function to check current page type
 */
function getCurrentPageType(): 'home' | 'search' | 'subscriptions' | 'trending' | 'other' {
  const pathname = location.pathname;
  
  if (pathname === '/' || pathname === '/feed/subscriptions') return 'home';
  if (pathname === '/results') return 'search';
  if (pathname === '/feed/subscriptions') return 'subscriptions';
  if (pathname === '/feed/trending') return 'trending';
  
  return 'other';
}

/**
 * Pure function to check if we should block on current page
 */
function shouldBlockOnCurrentPage(settings: any): boolean {
  const pageType = getCurrentPageType();
  
  switch (pageType) {
    case 'home': return settings.blockInHome;
    case 'search': return settings.blockInSearch;
    case 'subscriptions': return settings.blockInSubscriptions;
    case 'trending': return settings.blockInTrending;
    default: return true; // Always block on other pages
  }
}

// ============================================================================
// SHORTS DETECTION FUNCTIONS
// ============================================================================

/**
 * Pure function to find all shorts elements on the page
 */
function findShortsElements(settings: any): Element[] {
  const allShorts: Element[] = [];
  const pageType = getCurrentPageType();
  
  // Get appropriate selectors based on page type
  let selectors: string;
  switch (pageType) {
    case 'home':
      selectors = SELECTORS.HOME_SHORTS;
      break;
    case 'search':
      selectors = SELECTORS.SEARCH_SHORTS;
      break;
    case 'subscriptions':
      selectors = SELECTORS.SUBSCRIPTION_SHORTS;
      break;
    case 'trending':
      selectors = SELECTORS.TRENDING_SHORTS;
      break;
    default:
      selectors = SELECTORS.SHORTS_CONTAINER;
  }
  
  // Always include direct shorts URLs
  const allSelectors = `${selectors}, ${SELECTORS.SHORTS_CONTAINER}`;
  allShorts.push(...Array.from(document.querySelectorAll(allSelectors)));
  
  return deduplicateElements(allShorts);
}

/**
 * Pure function to remove duplicate elements
 */
function deduplicateElements(elements: Element[]): Element[] {
  const seen = new Set<string>();
  return elements.filter(el => {
    const id = el.id || el.outerHTML;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

/**
 * Pure function to extract video ID from element
 */
function extractVideoId(element: Element): string | null {
  const link = element.querySelector('a[href*="/shorts/"]') as HTMLAnchorElement;
  if (link) {
    const match = link.href.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }
  return null;
}

/**
 * Pure function to get channel info from element
 */
function getChannelInfo(element: Element): { name?: string; id?: string; handle?: string } | null {
  const channelLink = element.querySelector('a[href*="/channel/"], a[href*="/@"]') as HTMLAnchorElement;
  
  if (channelLink) {
    const href = channelLink.href;
    const name = channelLink.textContent?.trim();
    
      const channelIdMatch = href.match(/\/channel\/([a-zA-Z0-9_-]+)/);
  const channelId = channelIdMatch ? channelIdMatch[1] : null;
  
  const handleMatch = href.match(/\/@([a-zA-Z0-9_.-]+)/);
  const handle = handleMatch ? handleMatch[1] : null;
  
  return { 
    name: name || undefined, 
    id: channelId || undefined, 
    handle: handle || undefined 
  };
  }
  
  return null;
}

/**
 * Pure function to check if channel is whitelisted
 */
function isChannelWhitelisted(element: Element, settings: any): boolean {
  if (!settings.allowWhitelistedChannels) return false;
  
  const channelInfo = getChannelInfo(element);
  if (!channelInfo?.id) return false;
  
  return settings.whitelistedChannels?.includes(channelInfo.id) || false;
}

// ============================================================================
// BLOCKING FUNCTIONS
// ============================================================================

  /**
   * Pure function to hide an element
   */
  function hideElement(element: Element, isDebug: boolean): void {
    const htmlElement = element as HTMLElement;
    
    if (isDebug) {
      htmlElement.classList.add('ytb-debug-mode');
      htmlElement.title = 'YTB: Blocked Short (Debug Mode)';
    } else {
      htmlElement.classList.add('ytb-animate-fade');
    }
  }

  /**
   * Pure function to remove an element
   */
  function removeElement(element: Element, isDebug: boolean): void {
    if (isDebug) {
      hideElement(element, true);
    } else {
      element.classList.add('ytb-animate-slide');
      setTimeout(() => element.remove(), 500);
    }
  }

  /**
   * Pure function to redirect a short to regular video
   */
  function redirectShort(element: Element): void {
    const htmlElement = element as HTMLElement;
    htmlElement.classList.add('ytb-mode-redirect');
    
    const link = element.querySelector('a[href*="/shorts/"]') as HTMLAnchorElement;
    if (link) {
      const videoId = extractVideoId(element);
      if (videoId) {
        link.href = `https://www.youtube.com/watch?v=${videoId}`;
      }
    }
  }

/**
 * Pure function to block a single short element
 */
function blockShortElement(element: Element, settings: any, isDebug: boolean): boolean {
  // Check if already blocked
  if (element.hasAttribute('data-ytb-blocked')) {
    return false;
  }

  // Check whitelist
  if (isChannelWhitelisted(element, settings)) {
    log('Skipping whitelisted channel', isDebug);
    return false;
  }

  // Apply blocking based on mode
  switch (settings.blockingMode) {
    case BLOCKING_MODES.HIDE:
      hideElement(element, isDebug);
      break;
    case BLOCKING_MODES.REMOVE:
      removeElement(element, isDebug);
      break;
    case BLOCKING_MODES.REDIRECT:
      redirectShort(element);
      break;
    default:
      hideElement(element, isDebug);
  }

  // Mark as blocked
  element.setAttribute('data-ytb-blocked', 'true');
  return true;
}

// ============================================================================
// STATISTICS AND NOTIFICATIONS
// ============================================================================

/**
 * Pure function to update statistics
 */
async function updateStatistics(incrementBy: number = 1): Promise<void> {
  try {
    await updateStats(incrementBy);
  } catch (error) {
    console.error('Failed to update statistics:', error);
  }
}

  /**
   * Pure function to show block notification
   */
  function showBlockNotification(settings: any): void {
    if (!settings.showNotifications) return;
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'ytb-notification success';
    notification.textContent = '🚫 Short blocked successfully!';
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 3000);
  }

// ============================================================================
// OBSERVER AND NAVIGATION FUNCTIONS
// ============================================================================

/**
 * Pure function to create mutation observer
 */
function createMutationObserver(callback: () => void): MutationObserver {
  return new MutationObserver((mutations) => {
    let shouldCheck = false;
    
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        shouldCheck = true;
      }
    });
    
    if (shouldCheck) {
      // Debounce the checking to avoid excessive calls
      setTimeout(callback, APP_CONFIG.DEBOUNCE_DELAY);
    }
  });
}

/**
 * Pure function to check for navigation changes
 */
function hasNavigationChanged(currentUrl: string, lastUrl: string): boolean {
  return currentUrl !== lastUrl;
}

// ============================================================================
// MAIN BLOCKING LOGIC
// ============================================================================

/**
 * Main function to block all shorts on the page
 */
async function blockAllShorts(state: BlockerState): Promise<number> {
  const { settings, isDebugMode } = state;
  
  if (!isExtensionEnabled(settings)) {
    log('Extension is disabled', isDebugMode);
    return 0;
  }

  if (!shouldBlockOnCurrentPage(settings)) {
    log('Blocking disabled for current page', isDebugMode);
    return 0;
  }

  const shorts = findShortsElements(settings);
  log(`Found ${shorts.length} shorts on page`, isDebugMode);
  
  let blockedCount = 0;
  
  for (const short of shorts) {
    if (blockShortElement(short, settings, isDebugMode)) {
      blockedCount++;
      state.blockedCount++;
      
      // Update statistics
      await updateStatistics(1);
      
      // Show notification
      showBlockNotification(settings);
      
      log(`Blocked short #${state.blockedCount}`, isDebugMode, short);
    }
  }
  
  return blockedCount;
}

// ============================================================================
// STATE MANAGEMENT
// ============================================================================

/**
 * Initialize blocker state
 */
async function initializeState(): Promise<BlockerState> {
  const settings = await getSettings();
  const isDebug = isDebugMode(settings);
  
  log('Initializing YouTube Shorts Blocker...', isDebug);
  
  return {
    settings,
    blockedCount: 0,
    isDebugMode: isDebug,
    observer: null,
    lastUrl: location.href
  };
}

/**
 * Update state with new settings
 */
function updateState(state: BlockerState, newSettings: any): BlockerState {
  return {
    ...state,
    settings: { ...state.settings, ...newSettings },
    isDebugMode: isDebugMode({ ...state.settings, ...newSettings })
  };
}

// ============================================================================
// OBSERVER MANAGEMENT
// ============================================================================

/**
 * Setup mutation observer for dynamic content
 */
function setupMutationObserver(state: BlockerState): void {
  if (state.observer) {
    state.observer.disconnect();
  }
  
  state.observer = createMutationObserver(() => {
    blockAllShorts(state);
  });

  // Wait for document.body to be available
  if (document.body) {
    state.observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    log('Mutation observer set up', state.isDebugMode);
  } else {
    // If body is not ready, wait for it
    const waitForBody = () => {
      if (document.body) {
        state.observer!.observe(document.body, {
          childList: true,
          subtree: true
        });
        log('Mutation observer set up (delayed)', state.isDebugMode);
      } else {
        // Try again in a bit
        setTimeout(waitForBody, 100);
      }
    };
    waitForBody();
  }
}

/**
 * Setup navigation handler for YouTube SPA
 */
function setupNavigationHandler(state: BlockerState): void {
  const checkForNavigation = () => {
    const currentUrl = location.href;
    if (hasNavigationChanged(currentUrl, state.lastUrl)) {
      state.lastUrl = currentUrl;
      log('Navigation detected, re-scanning for shorts', state.isDebugMode);
      
      // Wait a bit for the page to load
      setTimeout(() => blockAllShorts(state), 500);
    }
  };

  // Check for URL changes periodically
  setInterval(checkForNavigation, APP_CONFIG.NAVIGATION_CHECK_INTERVAL);
  
  // Also listen for popstate events
  window.addEventListener('popstate', checkForNavigation);
}

// ============================================================================
// CLEANUP FUNCTIONS
// ============================================================================

/**
 * Cleanup function to restore blocked elements
 */
function cleanupBlockedElements(): void {
  const blockedElements = document.querySelectorAll('[data-ytb-blocked]');
  blockedElements.forEach(el => {
    el.removeAttribute('data-ytb-blocked');
    const htmlEl = el as HTMLElement;
    htmlEl.style.display = '';
    htmlEl.style.border = '';
    htmlEl.style.opacity = '';
    htmlEl.title = '';
  });
}

/**
 * Destroy observer and cleanup
 */
function destroyBlocker(state: BlockerState): void {
  if (state.observer) {
    state.observer.disconnect();
    state.observer = null;
  }
  
  cleanupBlockedElements();
  log('Extension destroyed and elements restored', state.isDebugMode);
}

// ============================================================================
// MAIN INITIALIZATION
// ============================================================================

/**
 * Main initialization function
 */
async function initializeBlocker(): Promise<BlockerState> {
  const state = await initializeState();
  
  if (!isExtensionEnabled(state.settings)) {
    log('Extension is disabled', state.isDebugMode);
    return state;
  }

  // Start blocking immediately
  await blockAllShorts(state);
  
  // Set up observer for dynamic content
  setupMutationObserver(state);
  
  // Handle navigation changes (YouTube is SPA)
  setupNavigationHandler(state);
  
  log('Initialization complete', state.isDebugMode);
  return state;
}

// ============================================================================
// GLOBAL STATE AND MESSAGE HANDLING
// ============================================================================

let globalState: BlockerState | null = null;

// Initialize the blocker when DOM is ready
function initializeWhenReady() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializeBlocker().then(state => {
        globalState = state;
      });
    });
  } else {
    // DOM is already ready
    initializeBlocker().then(state => {
      globalState = state;
    });
  }
}

// Start initialization
initializeWhenReady();

// Listen for messages from popup/background
chrome.runtime.onMessage.addListener((request: any, sender: any, sendResponse: any) => {
  if (!globalState) {
    sendResponse({ success: false, error: 'Blocker not initialized' });
    return;
  }

  if (request.action === 'updateSettings') {
    globalState = updateState(globalState, request.settings);
    blockAllShorts(globalState);
    sendResponse({ success: true });
  } else if (request.action === 'getStatus') {
    sendResponse({ 
      blocked: globalState.blockedCount,
      enabled: globalState.settings.enabled 
    });
  }
});

// Handle page unload
window.addEventListener('beforeunload', () => {
  if (globalState) {
    destroyBlocker(globalState);
  }
});
