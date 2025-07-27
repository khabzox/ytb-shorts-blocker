import fs from 'fs';
import path from 'path';

// Custom CSS build script for YouTube Shorts Blocker popup
const outputFile = 'dist/popup/popup.css';

// Ensure dist/popup directory exists
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Create a CSS file with custom utility classes for the popup
const outputCSS = `
/* Custom CSS for YouTube Shorts Blocker Popup */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  width: 384px;
  min-height: 500px;
  background-color: #f9fafb;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.5;
}

.w-96 { width: 24rem; }
.min-h-\\[500px\\] { min-height: 500px; }
.bg-gray-50 { background-color: #f9fafb; }
.font-sans { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }

.flex { display: flex; }
.flex-col { flex-direction: column; }
.h-full { height: 100%; }
.bg-white { background-color: #ffffff; }
.shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }

.bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
.from-primary-600 { --tw-gradient-from: #2563eb; --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgba(37, 99, 235, 0)); }
.to-primary-700 { --tw-gradient-to: #1d4ed8; }
.text-white { color: #ffffff; }
.p-4 { padding: 1rem; }

.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.space-x-3 > * + * { margin-left: 0.75rem; }
.space-x-2 > * + * { margin-left: 0.5rem; }
.text-sm { font-size: 0.875rem; }
.font-medium { font-weight: 500; }

.w-8 { width: 2rem; }
.h-8 { height: 2rem; }
.rounded-lg { border-radius: 0.5rem; }
.text-lg { font-size: 1.125rem; }
.font-semibold { font-weight: 600; }

.flex-1 { flex: 1 1 0%; }
.overflow-y-auto { overflow-y: auto; }

.mb-6 { margin-bottom: 1.5rem; }
.mb-4 { margin-bottom: 1rem; }
.mb-5 { margin-bottom: 1.25rem; }
.mb-3 { margin-bottom: 0.75rem; }
.mb-1 { margin-bottom: 0.25rem; }

.text-base { font-size: 1rem; }
.text-gray-800 { color: #1f2937; }
.pb-2 { padding-bottom: 0.5rem; }
.border-b-2 { border-bottom-width: 2px; }
.border-gray-200 { border-color: #e5e7eb; }

.bg-gray-50 { background-color: #f9fafb; }
.rounded-lg { border-radius: 0.5rem; }
.border { border-width: 1px; }

.justify-between { justify-content: space-between; }
.border-b { border-bottom-width: 1px; }
.border-gray-100 { border-color: #f3f4f6; }
.hover\\:bg-gray-50:hover { background-color: #f9fafb; }
.transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; }
.transition-colors { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }
.transition-colors { transition-duration: 150ms; }

.font-medium { font-weight: 500; }
.text-gray-700 { color: #374151; }

.relative { position: relative; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0; }

.w-11 { width: 2.75rem; }
.h-6 { height: 1.5rem; }
.bg-gray-300 { background-color: #d1d5db; }
.rounded-full { border-radius: 9999px; }
.duration-200 { transition-duration: 200ms; }
.ease-in-out { transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); }

.absolute { position: absolute; }
.left-0\\.5 { left: 0.125rem; }
.top-0\\.5 { top: 0.125rem; }
.w-5 { width: 1.25rem; }
.h-5 { height: 1.25rem; }
.bg-white { background-color: #ffffff; }
.transition-transform { transition-property: transform; }

.px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
.py-1\\.5 { padding-top: 0.375rem; padding-bottom: 0.375rem; }
.border-gray-300 { border-color: #d1d5db; }
.rounded-md { border-radius: 0.375rem; }
.focus\\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
.focus\\:ring-2:focus { --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); }
.focus\\:ring-primary-500:focus { --tw-ring-color: #3b82f6; }
.focus\\:border-primary-500:focus { border-color: #3b82f6; }
.min-w-\\[140px\\] { min-width: 140px; }

.text-gray-600 { color: #4b5563; }
.space-y-2 > * + * { margin-top: 0.5rem; }

.hover\\:bg-gray-50:hover { background-color: #f9fafb; }
.cursor-pointer { cursor: pointer; }

.w-4 { width: 1rem; }
.h-4 { height: 1rem; }
.text-primary-600 { color: #2563eb; }
.bg-gray-100 { background-color: #f3f4f6; }
.focus\\:ring-primary-500:focus { --tw-ring-color: #3b82f6; }

.text-gray-700 { color: #374151; }

.border-t { border-top-width: 1px; }
.bg-gray-50 { background-color: #f9fafb; }

.space-x-3 > * + * { margin-left: 0.75rem; }

.hover\\:bg-primary-700:hover { background-color: #1d4ed8; }
.py-2\\.5 { padding-top: 0.625rem; padding-bottom: 0.625rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.rounded-lg { border-radius: 0.5rem; }
.duration-200 { transition-duration: 200ms; }
.transform { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); }
.hover\\:scale-105:hover { --tw-scale-x: 1.05; --tw-scale-y: 1.05; }
.focus\\:ring-offset-2:focus { --tw-ring-offset-width: 2px; }

.hover\\:bg-gray-700:hover { background-color: #374151; }
.focus\\:ring-gray-500:focus { --tw-ring-color: #6b7280; }

/* Text colors */
.text-black { color: #000000; }
.hover\\:text-white:hover { color: #ffffff; }

/* Toggle switch states */
.toggle-switch.bg-primary-600 { background-color: #2563eb; }
.toggle-slider.translate-x-5 { transform: translateX(1.25rem); }

/* Grid layout */
.grid { display: grid; }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.gap-4 { gap: 1rem; }

.text-center { text-align: center; }
.text-2xl { font-size: 1.5rem; }
.font-bold { font-weight: 700; }
.text-primary-600 { color: #2563eb; }
.text-xs { font-size: 0.75rem; }
.text-gray-500 { color: #6b7280; }
.italic { font-style: italic; }

/* Loading and error states */
.flex { display: flex; }
.items-center { align-items: center; }
.text-yellow-300 { color: #fde047; }
.text-red-300 { color: #fca5a5; }
.animate-spin { animation: spin 1s linear infinite; }
.rounded-full { border-radius: 9999px; }
.border-2 { border-width: 2px; }
.border-yellow-300 { border-color: #fde047; }
.border-t-transparent { border-top-color: transparent; }

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Success button state */
.bg-green-600 { background-color: #059669; }
.hover\\:bg-green-700:hover { background-color: #047857; }
.focus\\:ring-green-500:focus { --tw-ring-color: #10b981; }
`;

// Write the output CSS file
fs.writeFileSync(outputFile, outputCSS);
console.log('✅ Custom CSS built successfully!'); 