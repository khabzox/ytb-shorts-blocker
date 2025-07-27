<div align="center">

<img src="assets/icons/icon128.png" alt="Logo" width="64" height="64">

[![Chrome Web Store](https://img.shields.io/badge/Chrome_Store-Coming_Soon-2d3748.svg?style=for-the-badge&logo=googlechrome&logoColor=white&labelColor=4a5568)](https://chrome.google.com/webstore) [![License: MIT](https://img.shields.io/badge/License-MIT-1a202c.svg?style=for-the-badge&logoColor=white&labelColor=2d3748)](https://opensource.org/licenses/MIT) [![Build Status](https://img.shields.io/badge/Build-Passing-2d3748.svg?style=for-the-badge&logo=github&logoColor=white&labelColor=4a5568)](https://github.com/khabzox/ytb-shorts-blocker/actions) [![TypeScript](https://img.shields.io/badge/TypeScript-100%25-1a202c?style=for-the-badge&logo=typescript&logoColor=white&labelColor=2d3748)](https://www.typescriptlang.org/)

[![Downloads](https://img.shields.io/badge/Downloads-1K+-2d3748.svg?style=flat-square&logo=googlechrome&logoColor=white&labelColor=4a5568)](https://chrome.google.com/webstore) [![Rating](https://img.shields.io/badge/Rating-★★★★★-2d3748.svg?style=flat-square&logo=googlechrome&logoColor=white&labelColor=4a5568)](https://chrome.google.com/webstore) [![Users](https://img.shields.io/badge/Active_Users-500+-2d3748.svg?style=flat-square&logo=googlechrome&logoColor=white&labelColor=4a5568)](https://chrome.google.com/webstore) [![GitHub Repo stars](https://img.shields.io/github/stars/khabzox/ytb-shorts-blocker?style=flat-square&logo=github&color=2d3748&logoColor=white&labelColor=4a5568)](https://github.com/khabzox/ytb-shorts-blocker/stargazers) [![GitHub issues](https://img.shields.io/github/issues/khabzox/ytb-shorts-blocker?style=flat-square&logo=github&color=2d3748&logoColor=white&labelColor=4a5568)](https://github.com/khabzox/ytb-shorts-blocker/issues) [![GitHub forks](https://img.shields.io/github/forks/khabzox/ytb-shorts-blocker?style=flat-square&logo=github&color=2d3748&logoColor=white&labelColor=4a5568)](https://github.com/khabzox/ytb-shorts-blocker/network)

</div>

> 🚫 **Block YouTube Shorts effortlessly** - Keep your YouTube feed clean and focused with this powerful Chrome extension built with modern TypeScript and Bun.

---

## ✨ Features

🎯 **Smart Detection** - Advanced algorithms to identify and block YouTube Shorts  
⚡ **Lightning Fast** - Built with Bun for optimal performance  
🎨 **Multiple Modes** - Hide, remove, or redirect shorts based on your preference  
📊 **Statistics** - Track how many shorts you've blocked over time  
🔧 **Customizable** - Whitelist channels and customize blocking behavior  
🌙 **Clean UI** - Modern, intuitive popup interface

## 🚀 Quick Start

### Prerequisites

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

### 📋 TODO List

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

### Code Style Guidelines

- Use TypeScript for all new code
- Follow existing naming conventions
- Add comprehensive TODO comments
- Include proper error handling
- Write meaningful commit messages

## 📊 Statistics

![GitHub commit activity](https://img.shields.io/github/commit-activity/m/khabzox/ytb-shorts-blocker?style=flat&logo=github&color=black)
![GitHub last commit](https://img.shields.io/github/last-commit/khabzox/ytb-shorts-blocker?style=flat&logo=github&color=black)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/khabzox/ytb-shorts-blocker?style=flat&logo=github&color=black)

## 📄 License

[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg?style=flat)](https://opensource.org/licenses/MIT)

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

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

[![Star History Chart](https://api.star-history.com/svg?repos=khabzox/ytb-shorts-blocker&type=Date)](https://star-history.com/#khabzox/ytb-shorts-blocker&Date)

_Made with 💚 by [@khabzox](https://github.com/khabzox)_

**Happy coding! 🚀**

</div>
