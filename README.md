<div align="center">

<img src="assets/icons/icon128.png" alt="Logo" width="66" height="66" style="margin-bottom: 2.5rem;">

[![Chrome Web Store](https://img.shields.io/badge/Chrome_Store-Coming_Soon-000000.svg?style=for-the-badge&logo=googlechrome&logoColor=white&labelColor=000000)](https://chrome.google.com/webstore) [![License: MIT](https://img.shields.io/badge/License-MIT-000000.svg?style=for-the-badge&logoColor=white&labelColor=000000)](https://opensource.org/licenses/MIT) [![Build Status](https://img.shields.io/badge/Build-Passing-000000.svg?style=for-the-badge&logo=github&logoColor=white&labelColor=000000)](https://github.com/khabzox/ytb-shorts-blocker/actions) [![TypeScript](https://img.shields.io/badge/TypeScript-100%25-000000?style=for-the-badge&logo=typescript&logoColor=white&labelColor=000000)](https://www.typescriptlang.org/)

[![Downloads](https://img.shields.io/badge/Downloads-1K+-000000.svg?style=flat-square&logo=googlechrome&logoColor=white&labelColor=000000)](https://chrome.google.com/webstore) [![Rating](https://img.shields.io/badge/Rating-★★★★★-000000.svg?style=flat-square&logo=googlechrome&logoColor=white&labelColor=000000)](https://chrome.google.com/webstore) [![Users](https://img.shields.io/badge/Active_Users-500+-000000.svg?style=flat-square&logo=googlechrome&logoColor=white&labelColor=000000)](https://chrome.google.com/webstore) [![GitHub Repo stars](https://img.shields.io/github/stars/khabzox/ytb-shorts-blocker?style=flat-square&logo=github&color=000000&logoColor=white&labelColor=000000)](https://github.com/khabzox/ytb-shorts-blocker/stargazers) [![GitHub issues](https://img.shields.io/github/issues/khabzox/ytb-shorts-blocker?style=flat-square&logo=github&color=000000&logoColor=white&labelColor=000000)](https://github.com/khabzox/ytb-shorts-blocker/issues) [![GitHub forks](https://img.shields.io/github/forks/khabzox/ytb-shorts-blocker?style=flat-square&logo=github&color=000000&logoColor=white&labelColor=000000)](https://github.com/khabzox/ytb-shorts-blocker/network)

</div>

> 🚫 **Block YouTube Shorts effortlessly** - Keep your YouTube feed clean and focused with this powerful Chrome extension built with modern TypeScript and Bun.

---

## ✨ Features

### 🎯 **Core Functionality**
- **🚫 Automatic Shorts Blocking** - Advanced algorithms to identify and block YouTube Shorts automatically
- **⚡ Lightning Fast Performance** - Built with Bun for optimal speed and efficiency
- **🎨 Multiple Blocking Modes** - Choose between Hide, Remove, or Redirect shorts based on your preference
- **📊 Real-time Statistics** - Track how many shorts you've blocked over time with detailed analytics
- **🔧 Highly Customizable** - Whitelist channels and customize blocking behavior for each page type
- **🌙 Beautiful Modern UI** - Clean, intuitive popup interface with smooth animations

### 🛡️ **Advanced Features**
- **🎛️ Page-Specific Settings** - Control blocking on Home, Search, Subscriptions, and Trending pages
- **🐛 Debug Mode** - Visual indicators and logging for troubleshooting
- **📱 Responsive Design** - Works perfectly on all screen sizes and resolutions
- **🔄 Real-time Updates** - Settings changes apply instantly without page refresh
- **💾 Persistent Storage** - Your preferences are saved and synced across devices

## 🖼️ Screenshots

<img width="404" height="630" alt="image" src="/assets/images/demo1.png" align="left"  />

<img width="400" height="629" alt="image" src="/assets/images/demo2.png" />

## 🚀 Quick Start

### 📦 **Install as Library (For Developers)**

```bash
# Using npm
npm install ytb-shorts-blocker

# Using bun
bun add ytb-shorts-blocker

# Using yarn
yarn add ytb-shorts-blocker
```

### 🔧 **Usage in Your Project**

#### **Basic Usage (Simple Integration)**
```typescript
import { initYouTubeShortsBlocker } from 'ytb-shorts-blocker';

// Start blocking YouTube Shorts immediately
initYouTubeShortsBlocker();
```

#### **Advanced Usage (Custom Configuration)**
```typescript
import { 
  initYouTubeShortsBlocker, 
  updateSettings,
  setEnabled,
  getSettings 
} from 'ytb-shorts-blocker';

// Initialize with custom settings
initYouTubeShortsBlocker({
  enabled: true,
  blockingMode: 'hide',
  showNotifications: true,
  blockInSearch: true,
  blockInHome: true,
  blockInSubscriptions: true,
  blockInTrending: false,
  debugMode: false
});

// Update settings dynamically
updateSettings({
  blockingMode: 'remove',
  debugMode: true
});

// Enable/disable blocking
setEnabled(false);

// Get current settings
const settings = getSettings();
```

#### **Manual Control (Custom Implementation)**
```typescript
import { 
  detectShorts, 
  blockElement,
  isYouTubePage,
  isShortsPage 
} from 'ytb-shorts-blocker';

// Check if we're on YouTube
if (isYouTubePage()) {
  // Detect and block shorts manually
  const shortsElements = detectShorts();
  shortsElements.forEach(element => {
    blockElement(element, 'hide');
  });
}
```

### 🎯 **API Reference**

#### Core Functions
- `initYouTubeShortsBlocker(settings?)` - Initialize the blocker
- `setEnabled(enabled: boolean)` - Enable/disable blocking
- `setBlockingMode(mode: 'hide' | 'remove' | 'redirect')` - Set blocking mode
- `blockShorts()` - Manually block shorts on current page
- `getSettings()` - Get current settings
- `updateSettings(settings: Partial<BlockerSettings>)` - Update settings

#### Utility Functions
- `detectShorts()` - Detect shorts elements on page
- `blockElement(element, mode)` - Block a specific element
- `isYouTubePage()` - Check if current page is YouTube
- `isShortsPage()` - Check if current page is a shorts page

## 🎯 **Use Cases & Project Types**

### **🌐 Browser Extensions**
```typescript
// Content script for a browser extension
import { initYouTubeShortsBlocker } from 'ytb-shorts-blocker';

// Auto-block shorts when page loads
document.addEventListener('DOMContentLoaded', () => {
  initYouTubeShortsBlocker({
    blockingMode: 'hide',
    debugMode: false
  });
});
```

### **📱 Progressive Web Apps (PWAs)**
```typescript
// PWA that enhances YouTube experience
import { detectShorts, blockElement } from 'ytb-shorts-blocker';

// Custom PWA logic
if (isYouTubePage()) {
  const shorts = detectShorts();
  shorts.forEach(short => {
    // Add custom PWA overlay
    blockElement(short, 'redirect');
  });
}
```

### **🎮 Gaming/Productivity Apps**
```typescript
// Focus app that blocks distractions
import { initYouTubeShortsBlocker, updateSettings } from 'ytb-shorts-blocker';

// Focus mode functions
const startFocusMode = () => {
  initYouTubeShortsBlocker({
    blockingMode: 'remove',
    showNotifications: false
  });
};

const stopFocusMode = () => {
  updateSettings({ enabled: false });
};

// Usage
startFocusMode();
// Later...
stopFocusMode();
```

### **🔧 Developer Tools**
```typescript
// Browser dev tools extension
import { getSettings, updateSettings } from 'ytb-shorts-blocker';

// Dev tools functions
const toggleBlocking = () => {
  const settings = getSettings();
  updateSettings({ enabled: !settings.enabled });
};

const changeMode = (mode: 'hide' | 'remove' | 'redirect') => {
  updateSettings({ blockingMode: mode });
};

// Usage
toggleBlocking();
changeMode('remove');
```

### **📊 Analytics & Research Tools**
```typescript
// Research tool to study YouTube behavior
import { detectShorts, isYouTubePage } from 'ytb-shorts-blocker';

const analyzePage = () => {
  if (isYouTubePage()) {
    const shortsCount = detectShorts().length;
    console.log(`Found ${shortsCount} shorts on this page`);
  }
};

// Usage
analyzePage();
```

### **🎨 Custom YouTube Themes**
```typescript
// Custom YouTube theme/styling
import { detectShorts, blockElement } from 'ytb-shorts-blocker';

const applyCustomStyling = () => {
  detectShorts().forEach(short => {
    short.style.border = '2px solid red';
    short.style.opacity = '0.3';
  });
};

// Usage
applyCustomStyling();
```

### **🤖 AI/ML Projects**
```typescript
// AI project analyzing YouTube content
import { detectShorts, isShortsPage } from 'ytb-shorts-blocker';

const analyzeContent = () => {
  if (isShortsPage()) {
    // AI logic to analyze shorts content
    const shorts = detectShorts();
    // Process with AI models...
    return shorts.length;
  }
  return 0;
};

// Usage
const shortsCount = analyzeContent();
```

### 🛠️ **Extension Installation (For End Users)**

#### Prerequisites

![Bun](https://img.shields.io/badge/Bun-black.svg?style=flat&logo=bun&logoColor=white)
![Chrome](https://img.shields.io/badge/Chrome-black?style=flat&logo=GoogleChrome&logoColor=white)

- [Bun](https://bun.sh/) installed on your system
- Chrome/Chromium browser

### Installation

#### 📦 From Chrome Web Store (Recommended)

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/your-extension-id?style=for-the-badge&logo=googlechrome&logoColor=white&label=Install%20from%20Chrome%20Store&color=black)](https://chrome.google.com/webstore)

#### 🔧 Manual Installation

1. **Clone and setup**

   ```bash
   git clone https://github.com/khabzox/ytb-shorts-blocker.git
   cd ytb-shorts-blocker
   bun install
   ```

2. **Build the extension**

   ```bash
   # Development build
   bun run build --dev

   # Production build
   bun run build --minify

   # Watch mode (rebuilds on changes)
   bun run build --watch
   ```

3. **Load in Chrome**
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked" and select the `dist` folder
   - The extension should now appear in your extensions list

## 🛠️ Development

![TypeScript](https://img.shields.io/badge/typescript-black.svg?style=flat&logo=typescript&logoColor=white)
![Bun](https://img.shields.io/badge/Bun-black.svg?style=flat&logo=bun&logoColor=white)

### Available Scripts

```bash
bun run build          # Build all scripts
bun run build --dev    # Development build with sourcemaps
bun run build --watch  # Watch mode for development
bun run lint           # Type checking
bun run clean          # Clean dist directory
```

## 🎯 Key Features to Implement

### 🔍 Detection Methods

- **URL-based Detection** - `/shorts/` path matching
- **DOM-based Detection** - Shorts-specific elements
- **Content Analysis** - Video duration and metadata

### 🚫 Blocking Modes

- **Hide Mode** - CSS `display: none`
- **Remove Mode** - Complete DOM removal
- **Redirect Mode** - Prevent navigation to shorts

### 📊 Statistics & Analytics

- Track blocked shorts count
- Session and historical data
- Export functionality

## ⚙️ Configuration

### Default Settings

```typescript
{
  enabled: true,
  blockingMode: 'hide',
  showNotifications: true,
  blockInSearch: true,
  blockInHome: true,
  blockInSubscriptions: true,
  blockInTrending: false,
  allowWhitelistedChannels: true,
  customCss: '',
  debugMode: false
}
```

## 🐛 Debugging & Troubleshooting

### Enable Debug Mode

1. Open extension popup
2. Go to Advanced Settings
3. Enable "Debug Mode"
4. Blocked elements will show red overlay

### Console Logging

```javascript
// Enable verbose logging
localStorage.setItem("ytb-debug", "true");
```

### Common Issues

- **Shorts still showing**: Update selectors in `src/utils/selectors.ts`
- **Extension not loading**: Run `bun run clean && bun run build`
- **Settings not saving**: Check Chrome storage permissions

## 🤝 Contributing

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-black.svg?style=flat)](http://makeapullrequest.com)
[![Contributors](https://img.shields.io/github/contributors/khabzox/ytb-shorts-blocker?style=flat&color=black)](https://github.com/khabzox/ytb-shorts-blocker/graphs/contributors)

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💡 Follow the TODO comments in the code
4. ✅ Test thoroughly on different YouTube pages
5. 📝 Commit your changes (`git commit -m 'Add amazing feature'`)
6. 🚀 Push to the branch (`git push origin feature/amazing-feature`)
7. 🎉 Open a Pull Request

## 📊 Statistics

![GitHub commit activity](https://img.shields.io/github/commit-activity/m/khabzox/ytb-shorts-blocker?style=flat&logo=github&color=black)
![GitHub last commit](https://img.shields.io/github/last-commit/khabzox/ytb-shorts-blocker?style=flat&logo=github&color=black)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/khabzox/ytb-shorts-blocker?style=flat&logo=github&color=black)

## 🙏 Acknowledgments

- Thanks to the YouTube community for feedback
- Built with ❤️ using [Bun](https://bun.sh/) and [TypeScript](https://www.typescriptlang.org/)
- Icons from [Lucide](https://lucide.dev/)

## 📞 Support & Contact

[![GitHub issues](https://img.shields.io/github/issues/khabzox/ytb-shorts-blocker?style=flat&logo=github&label=Issues&color=black)](https://github.com/khabzox/ytb-shorts-blocker/issues)
[![GitHub Discussions](https://img.shields.io/github/discussions/khabzox/ytb-shorts-blocker?style=flat&logo=github&label=Discussions&color=black)](https://github.com/khabzox/ytb-shorts-blocker/discussions)

- 🐛 **Bug Reports**: [Create an issue](https://github.com/khabzox/ytb-shorts-blocker/issues/new?template=bug_report.md)
- 💡 **Feature Requests**: [Request a feature](https://github.com/khabzox/ytb-shorts-blocker/issues/new?template=feature_request.md)
- 💬 **Discussions**: [Join the conversation](https://github.com/khabzox/ytb-shorts-blocker/discussions)

---

<div align="center">

**⭐ Star this repo if you find it helpful! ⭐**

## Star History

<a href="https://www.star-history.com/#khabzox/ytb-shorts-blocker&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=khabzox/ytb-shorts-blocker&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=khabzox/ytb-shorts-blocker&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=khabzox/ytb-shorts-blocker&type=Date" />
 </picture>
</a>

_Made with 💚 by [@khabzox](https://github.com/khabzox)_

**Happy coding! 🚀**

</div>
