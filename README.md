# Get Done

A simple and beautiful task management app. A PWA (Progressive Web App) inspired by Things 3.

![Get Done](https://img.shields.io/badge/React-19.2.3-blue)
![PWA](https://img.shields.io/badge/PWA-Ready-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- 📱 **PWA Support**: Works offline and can be installed as an app
- 🎨 **Beautiful UI**: Minimal and refined design inspired by Things 3
- ⚡ **Fast**: React-based with smooth interactions
- 💾 **Auto-save**: Automatically saves tasks and projects
- 🔍 **Search**: Quickly find tasks
- 📁 **Project Management**: Organize tasks with projects

## 🚀 Quick Start

### Requirements

- Node.js 16.x or higher
- npm 8.x or higher

### Installation
```bash
# Clone the repository
git clone https://github.com/Minokiti11/get-done.git
cd get-done

# Install dependencies
npm install

# Start development server
npm start
```

Open http://localhost:3000 in your browser.

## 📦 Build
```bash
# Build for production
npm run build
```

Optimized files will be generated in the `build` folder.

## 🎯 Usage

### Creating a Task

1. Click the "New" button at the bottom of the screen
2. Enter task name and press Enter

### Creating a Project

1. Click the "+" button in the "Projects" section of the sidebar
2. Enter project name

### Completing a Task

Click the circle button on the left side of a task to toggle completion status.

### Search

Enter keywords in the search box in the header to filter tasks.

## 📱 Install as PWA

### Desktop (Chrome/Edge)

1. Click the install icon in the address bar
2. Or click "Install" from the banner at the top of the screen

### iOS (Safari)

1. Tap the share button (□↑)
2. Select "Add to Home Screen"

### Android (Chrome)

1. Open menu (⋮)
2. Select "Install app"

## 🛠 Tech Stack

- **Frontend**: React 19.2.3
- **Icons**: Lucide React
- **PWA**: Service Worker + Web App Manifest
- **Storage**: LocalStorage (+ Claude Storage API)

## 📁 Project Structure
```
get-done/
├── public/
│   ├── index.html          # Main HTML
│   ├── manifest.json       # PWA configuration
│   ├── sw.js              # Service Worker
│   └── icons/             # App icons
├── src/
│   ├── App.js             # Main application
│   ├── App.css            # Styles
│   ├── index.js           # Entry point
│   └── index.css          # Global styles
├── package.json
└── README.md
```

## 🎨 Features

### ✅ Implemented

- [x] Create, edit, and delete tasks
- [x] Toggle task completion
- [x] Project management
- [x] Inbox, Today, and Completed views
- [x] Search functionality
- [x] Data persistence
- [x] PWA support (offline capability)
- [x] Responsive design

### 🚧 Roadmap

- [ ] Due date setting
- [ ] Tag functionality
- [ ] Drag & drop reordering
- [ ] Dark mode
- [ ] Areas feature
- [ ] Data export/import
- [ ] Cross-device sync

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

MIT License

## 👤 Author

Minori Sugimura
