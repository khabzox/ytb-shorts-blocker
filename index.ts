/**
 * YouTube Shorts Blocker - Developer Library
 * 
 * A library that provides YouTube Shorts blocking functionality for developers.
 * Can be used to integrate shorts blocking into custom applications or extensions.
 * Built with functional programming principles.
 * 
 * @package ytb-shorts-blocker
 * @version 1.0.0
 * @author khabzox
 * @license MIT
 */

// Types and interfaces
export interface BlockerSettings {
  enabled: boolean;
  blockingMode: 'hide' | 'remove' | 'redirect';
  showNotifications: boolean;
  blockInSearch: boolean;
  blockInHome: boolean;
  blockInSubscriptions: boolean;
  blockInTrending: boolean;
  allowWhitelistedChannels: boolean;
  debugMode: boolean;
}

export interface BlockerState {
  settings: BlockerSettings;
  isActive: boolean;
  observer: MutationObserver | null;
}

// Default settings
export const DEFAULT_SETTINGS: BlockerSettings = {
  enabled: true,
  blockingMode: 'hide',
  showNotifications: true,
  blockInSearch: true,
  blockInHome: true,
  blockInSubscriptions: true,
  blockInTrending: false,
  allowWhitelistedChannels: true,
  debugMode: false
};

// State management
let blockerState: BlockerState = {
  settings: { ...DEFAULT_SETTINGS },
  isActive: false,
  observer: null
};

// Core functions
export const createBlocker = (settings?: Partial<BlockerSettings>): void => {
  blockerState.settings = { ...DEFAULT_SETTINGS, ...settings };
};

export const initBlocker = (): void => {
  if (!blockerState.settings.enabled) return;
  
  setupMutationObserver();
  blockExistingShorts();
  blockerState.isActive = true;
  console.log('YouTube Shorts Blocker initialized');
};

export const setEnabled = (enabled: boolean): void => {
  blockerState.settings.enabled = enabled;
  if (enabled && !blockerState.isActive) {
    initBlocker();
  } else if (!enabled && blockerState.isActive) {
    cleanup();
  }
};

export const setBlockingMode = (mode: 'hide' | 'remove' | 'redirect'): void => {
  blockerState.settings.blockingMode = mode;
};

export const blockShorts = (): void => {
  blockExistingShorts();
};

export const getSettings = (): BlockerSettings => {
  return { ...blockerState.settings };
};

export const updateSettings = (newSettings: Partial<BlockerSettings>): void => {
  blockerState.settings = { ...blockerState.settings, ...newSettings };
};

export const getState = (): BlockerState => {
  return { ...blockerState };
};

// Utility functions
export const detectShorts = (): HTMLElement[] => {
  const selectors = [
    'ytd-rich-grid-media[is-shorts]',
    'ytd-rich-item-renderer[is-shorts]',
    'ytd-video-renderer[is-shorts]',
    'a[href*="/shorts/"]',
    '[data-shorts-selector]'
  ];
  
  const elements: HTMLElement[] = [];
  selectors.forEach(selector => {
    const found = document.querySelectorAll(selector);
    found.forEach(el => elements.push(el as HTMLElement));
  });
  
  return elements;
};

export const blockElement = (element: HTMLElement, mode: 'hide' | 'remove' | 'redirect'): void => {
  switch (mode) {
    case 'hide':
      element.style.display = 'none';
      break;
    case 'remove':
      element.remove();
      break;
    case 'redirect':
      // Add redirect indicator
      element.style.opacity = '0.5';
      element.style.pointerEvents = 'none';
      break;
  }
};

export const isYouTubePage = (): boolean => {
  return window.location.hostname.includes('youtube.com');
};

export const isShortsPage = (): boolean => {
  return window.location.pathname.includes('/shorts/');
};

export const isHomePage = (): boolean => {
  return window.location.pathname === '/' || window.location.pathname === '/feed/subscriptions';
};

export const isSearchPage = (): boolean => {
  return window.location.pathname === '/results';
};

export const isSubscriptionsPage = (): boolean => {
  return window.location.pathname === '/feed/subscriptions';
};

export const isTrendingPage = (): boolean => {
  return window.location.pathname === '/trending';
};

// Internal functions
const setupMutationObserver = (): void => {
  if (!document.body) return;
  
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
                 mutation.addedNodes.forEach((node) => {
           if (node.nodeType === Node.ELEMENT_NODE) {
             const element = node as Element;
             const shortsElements = element.querySelectorAll('ytd-rich-grid-media[is-shorts], ytd-rich-item-renderer[is-shorts]');
             shortsElements.forEach((short) => {
               blockElement(short as HTMLElement, blockerState.settings.blockingMode);
             });
           }
         });
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  blockerState.observer = observer;
};

const blockExistingShorts = (): void => {
  const shortsElements = detectShorts();
  shortsElements.forEach(element => {
    blockElement(element, blockerState.settings.blockingMode);
  });
  
  if (blockerState.settings.debugMode) {
    console.log(`Blocked ${shortsElements.length} shorts elements`);
  }
};

const cleanup = (): void => {
  if (blockerState.observer) {
    blockerState.observer.disconnect();
    blockerState.observer = null;
  }
  blockerState.isActive = false;
};

// Constants
export const SELECTORS = {
  SHORTS: '[data-shorts-selector]',
  SHORTS_GRID: '[data-shorts-grid]',
  SHORTS_ITEM: '[data-shorts-item]'
} as const;

export const BLOCKING_MODES = {
  HIDE: 'hide',
  REMOVE: 'remove',
  REDIRECT: 'redirect'
} as const;

// Package information
export const VERSION = '1.0.0';
export const AUTHOR = 'khabzox';
export const LICENSE = 'MIT';

// Extension metadata
export const EXTENSION_INFO = {
  name: 'YouTube Shorts Blocker',
  version: VERSION,
  description: 'Block YouTube Shorts and keep your feed clean',
  author: AUTHOR,
  license: LICENSE,
  repository: 'https://github.com/khabzox/ytb-shorts-blocker',
  homepage: 'https://github.com/khabzox/ytb-shorts-blocker#readme'
};

// Default export - main function to initialize
export default function initYouTubeShortsBlocker(settings?: Partial<BlockerSettings>): void {
  createBlocker(settings);
  initBlocker();
}