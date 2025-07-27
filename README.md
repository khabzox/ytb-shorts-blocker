# YTB Shorts Blocker

A Chrome extension to block YouTube Shorts and keep your feed clean, built with Bun and TypeScript.

## 🚀 Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed on your system
- Chrome/Chromium browser

### Installation

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

### Available Scripts

```bash
bun run build          # Build all scripts
bun run build --dev    # Development build with sourcemaps
bun run build --watch  # Watch mode for development
bun run lint           # Type checking
bun run clean          # Clean dist directory
```

### TODO List

#### Phase 1: Core Functionality ✅

- [x] ✅ Basic extension structure
- [ ] 🔄 Content script for detecting shorts
- [ ] 🔄 YouTube page navigation handling
- [ ] 🔄 Settings storage system
- [ ] 🔄 Multiple detection methods

#### Phase 2: Enhanced Features

- [ ] 📋 Popup interface for settings
- [ ] 📋 Channel whitelist functionality
- [ ] 📋 Different blocking modes (hide/remove/redirect)
- [ ] 📋 Statistics tracking
- [ ] 📋 Export/import settings

#### Phase 3: Polish & Optimization

- [ ] 🎨 Custom CSS themes
- [ ] ⚡ Performance optimization
- [ ] 🐛 Error handling and logging
- [ ] 📧 User feedback system
- [ ] 🌐 Multi-language support

### Key Components to Implement

#### Content Script (`src/content/content.ts`)

- [ ] **Detection Methods**

  - URL pattern matching (`/shorts/`)
  - DOM element detection
  - Video duration checking
  - Shorts shelf detection

- [ ] **Blocking Strategies**

  - CSS `display: none`
  - DOM element removal
  - Navigation prevention
  - Custom replacement content

- [ ] **Dynamic Content Handling**
  - MutationObserver for new content
  - YouTube SPA navigation
  - Performance optimization

#### Background Script (`src/background/background.ts`)

- [ ] **Extension Lifecycle**

  - Installation/update handling
  - Settings migration
  - Tab management

- [ ] **Message Handling**
  - Communication with content script
  - Popup interaction
  - Statistics tracking

#### Popup Interface (`src/popup/`)

- [ ] **Main Controls**

  - Enable/disable toggle
  - Quick settings
  - Statistics display

- [ ] **Advanced Features**
  - Channel whitelist management
  - Blocking mode selection
  - Export/import functionality

#### Utilities (`src/utils/`)

- [ ] **Selectors** (`selectors.ts`)

  - YouTube DOM selectors
  - Dynamic selector detection
  - Mobile compatibility

- [ ] **Storage** (`storage.ts`)

  - Chrome storage wrapper
  - Settings management
  - Statistics tracking

- [ ] **Constants** (`constants.ts`)
  - App configuration
  - URL patterns
  - Default settings

## 🎯 Features to Implement

### Detection Methods

1. **URL-based Detection**

   - `/shorts/` path detection
   - Query parameter analysis

2. **DOM-based Detection**

   - Shorts-specific CSS classes
   - Video duration indicators
   - Aspect ratio analysis

3. **Content Analysis**
   - Video metadata
   - Thumbnail analysis
   - Duration checking

### Blocking Modes

1. **Hide Mode** - CSS `display: none`
2. **Remove Mode** - DOM element removal
3. **Redirect Mode** - Prevent navigation to shorts

### User Interface

1. **Popup Controls**

   - Quick enable/disable
   - Statistics display
   - Basic settings

2. **Options Page** (Future)
   - Advanced settings
   - Custom CSS
   - Debug options

### Statistics

1. **Tracking**

   - Total shorts blocked
   - Session statistics
   - Daily/weekly/monthly data

2. **Display**
   - Real-time counters
   - Charts and graphs
   - Export functionality

## 🔧 Configuration

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

### Customization

- Modify `src/utils/constants.ts` for default settings
- Update `src/utils/selectors.ts` for YouTube DOM changes
- Customize `src/content/styles.css` for appearance

## 🐛 Debugging

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

1. **Shorts still showing**: YouTube updated their DOM structure

   - Check `src/utils/selectors.ts`
   - Update selectors based on current YouTube HTML

2. **Extension not loading**: Build issues

   - Run `bun run clean && bun run build`
   - Check browser console for errors

3. **Settings not saving**: Storage permissions
   - Verify `manifest.json` permissions
   - Check Chrome storage quota

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Follow the TODO comments in the code
4. Test thoroughly on different YouTube pages
5. Submit a pull request

### Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Add TODO comments for future improvements
- Include error handling

### Testing

- Test on different YouTube pages (home, search, watch, subscriptions)
- Verify with different YouTube layouts
- Test extension enable/disable functionality
- Check settings persistence

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Support

- Create an issue for bugs or feature requests
- Check existing issues before creating new ones
- Provide detailed information about your setup

---

**Happy coding! 🚀**

Remember to update the YouTube selectors regularly as the platform changes its DOM structure.
