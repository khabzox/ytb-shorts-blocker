/**
 * YouTube DOM selectors for different types of Shorts content
 * These selectors are used to identify and target YouTube Shorts elements
 * across different pages and contexts within YouTube
 */

export const SELECTORS = {
  // Main shorts container (direct shorts page)
  SHORTS_CONTAINER: [
    'ytd-shorts',
    'ytd-reel-video-renderer',
    '[is-shorts]',
    'ytd-shorts-player'
  ].join(', '),

  // Shorts on the home page
  HOME_SHORTS: [
    // Shorts shelf
    'ytd-rich-shelf-renderer[is-shorts]',
    'ytd-reel-shelf-renderer',
    
    // Individual shorts in grid
    'ytd-video-renderer[is-shorts]',
    'ytd-grid-video-renderer[is-shorts]',
    
    // Shorts in rich grid
    'ytd-rich-grid-renderer ytd-video-renderer[is-shorts]',
    
    // New YouTube layout shorts
    'div[data-content-type="shorts"]',
    'ytd-reel-video-renderer',
    
    // Shorts shelf items
    'ytd-reel-item-renderer',
    
    // Links containing /shorts/
    'a[href*="/shorts/"]',
    
    // Video cards with shorts indicator
    '[aria-label*="Shorts"]',
    '[title*="Shorts"]'
  ].join(', '),

  // Shorts in search results
  SEARCH_SHORTS: [
    'ytd-video-renderer[is-shorts]',
    'ytd-reel-video-renderer',
    'a[href*="/shorts/"]',
    '[data-content-type="shorts"]',
    '.ytd-search ytd-video-renderer[is-shorts]'
  ].join(', '),

  // Shorts in subscriptions feed
  SUBSCRIPTION_SHORTS: [
    'ytd-video-renderer[is-shorts]',
    'ytd-grid-video-renderer[is-shorts]',
    'ytd-reel-video-renderer',
    'a[href*="/shorts/"]',
    '.ytd-browse[page-subtype="subscriptions"] ytd-video-renderer[is-shorts]'
  ].join(', '),

  // Shorts in trending page
  TRENDING_SHORTS: [
    'ytd-video-renderer[is-shorts]',
    'ytd-expanded-shelf-contents-renderer ytd-video-renderer[is-shorts]',
    'a[href*="/shorts/"]'
  ].join(', '),

  // Channel page shorts
  CHANNEL_SHORTS: [
    'ytd-grid-video-renderer[is-shorts]',
    'ytd-reel-video-renderer',
    'a[href*="/shorts/"]',
    '[data-content-type="shorts"]'
  ].join(', '),

  // Shorts in related/suggested videos
  RELATED_SHORTS: [
    'ytd-compact-video-renderer[is-shorts]',
    'ytd-video-renderer[is-shorts]',
    '#related a[href*="/shorts/"]'
  ].join(', '),

  // Mobile-specific selectors
  MOBILE_SHORTS: [
    '.shorts-video-cell',
    '.reel-video-in-sequence',
    'a[href*="/shorts/"]'
  ].join(', '),

  // Additional fallback selectors for new YouTube updates
  FALLBACK_SHORTS: [
    // Any element with shorts in the class name
    '[class*="shorts"]',
    '[class*="reel"]',
    
    // Data attributes that might indicate shorts
    '[data-shorts]',
    '[data-reel]',
    
    // ARIA labels
    '[aria-label*="short"]',
    '[aria-label*="Short"]',
    
    // Any link with /shorts/ in href
    'a[href*="/shorts/"]'
  ].join(', ')
};

/**
 * Utility functions for working with selectors
 */
export const SelectorUtils = {
  /**
   * Get all possible selectors for a given context
   */
  getAllSelectors(context: 'home' | 'search' | 'subscriptions' | 'trending' | 'all' = 'all'): string {
    switch (context) {
      case 'home':
        return SELECTORS.HOME_SHORTS;
      case 'search':
        return SELECTORS.SEARCH_SHORTS;
      case 'subscriptions':
        return SELECTORS.SUBSCRIPTION_SHORTS;
      case 'trending':
        return SELECTORS.TRENDING_SHORTS;
      case 'all':
      default:
        return Object.values(SELECTORS).join(', ');
    }
  },

  /**
   * Check if an element is likely a YouTube Short
   */
  isShortElement(element: Element): boolean {
    // Check if element matches any of our selectors
    const allSelectors = this.getAllSelectors('all');
    if (element.matches(allSelectors)) {
      return true;
    }

    // Check parent elements
    let parent = element.parentElement;
    let depth = 0;
    while (parent && depth < 5) {
      if (parent.matches(allSelectors)) {
        return true;
      }
      parent = parent.parentElement;
      depth++;
    }

    // Check for shorts-specific attributes or content
    const elementText = element.textContent?.toLowerCase() || '';
    const elementHTML = element.outerHTML.toLowerCase();
    
    const shortsIndicators = [
      '/shorts/',
      'is-shorts',
      'data-shorts',
      'reel-video',
      'shorts-video'
    ];

    return shortsIndicators.some(indicator => 
      elementHTML.includes(indicator) || elementText.includes(indicator)
    );
  },

  /**
   * Get the video ID from a shorts element
   */
  getVideoIdFromElement(element: Element): string | null {
    // Try to find a link with shorts URL
    const link = element.querySelector('a[href*="/shorts/"]') as HTMLAnchorElement;
    if (link) {
      const match = link.href.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
      return match ? match[1] : null;
    }

    // Check if the element itself is a link
    if (element instanceof HTMLAnchorElement && element.href.includes('/shorts/')) {
      const match = element.href.match(/\/shorts\/([a-zA-Z0-9_-]+)/);
      return match ? match[1] : null;
    }

    // Try to find video ID in data attributes
    const videoId = element.getAttribute('data-video-id') || 
                   element.getAttribute('data-context-item-id');
    
    return videoId || null;
  },

  /**
   * Get channel information from a shorts element
   */
  getChannelInfoFromElement(element: Element): { name?: string; id?: string; handle?: string } | null {
    const channelLink = element.querySelector('a[href*="/channel/"], a[href*="/@"]') as HTMLAnchorElement;
    
    if (channelLink) {
      const href = channelLink.href;
      const name = channelLink.textContent?.trim();
      
      // Extract channel ID
      const channelIdMatch = href.match(/\/channel\/([a-zA-Z0-9_-]+)/);
      const channelId = channelIdMatch ? channelIdMatch[1] : undefined;
      
      // Extract handle
      const handleMatch = href.match(/\/@([a-zA-Z0-9_.-]+)/);
      const handle = handleMatch ? handleMatch[1] : undefined;
      
      return { name, id: channelId, handle };
    }
    
    return null;
  },

  /**
   * Check if we're currently on a shorts page
   */
  isOnShortsPage(): boolean {
    return window.location.pathname.includes('/shorts/') || 
           window.location.href.includes('/shorts/');
  },

  /**
   * Get all shorts elements on the current page
   */
  findAllShortsOnPage(): Element[] {
    const selector = this.getAllSelectors('all');
    return Array.from(document.querySelectorAll(selector));
  }
};

/**
 * Observer patterns for different types of content loading
 */
export const OBSERVER_CONFIG = {
  // Standard mutation observer config
  MUTATION_CONFIG: {
    childList: true,
    subtree: true,
    attributes: false,
    attributeOldValue: false,
    characterData: false,
    characterDataOldValue: false
  },

  // Intersection observer config for lazy loading detection
  INTERSECTION_CONFIG: {
    root: null,
    rootMargin: '50px',
    threshold: 0.1
  }
};