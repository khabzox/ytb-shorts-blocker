import fs from 'fs';

// Create the dist manifest with correct paths
const manifest = {
  "manifest_version": 3,
  "name": "YTB Shorts Blocker",
  "version": "1.0.4",
  "description": "Block YouTube Shorts and keep your feed clean",
  "permissions": ["storage", "activeTab"],
  "host_permissions": ["*://*.youtube.com/*"],
  "background": {
    "service_worker": "background/background.js"
  },
  "content_scripts": [
    {
      "matches": ["*://*.youtube.com/*"],
      "js": ["content/content.js"],
      "css": ["content/content.css"],
      "run_at": "document_start"
    }
  ],
  "action": {
    "default_popup": "popup/popup.html",
    "default_title": "YTB Shorts Blocker",
    "default_icon": {
      "16": "assets/icons/icon16.png",
      "48": "assets/icons/icon48.png",
      "128": "assets/icons/icon128.png"
    }
  },
  "icons": {
    "16": "assets/icons/icon16.png",
    "48": "assets/icons/icon48.png",
    "128": "assets/icons/icon128.png"
  },
  "web_accessible_resources": [
    {
      "resources": ["content/content.css"],
      "matches": ["*://*.youtube.com/*"]
    }
  ]
};

// Write the manifest
fs.writeFileSync('dist/manifest.json', JSON.stringify(manifest, null, 2));
console.log('✅ Manifest file created for dist folder'); 