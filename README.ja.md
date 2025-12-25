# Get Done

[日本語](README.ja.md) | English

シンプルで美しいタスク管理アプリ。Things 3にインスパイアされたPWA (Progressive Web App)です。

![Get Done](https://img.shields.io/badge/React-19.2.3-blue)
![PWA](https://img.shields.io/badge/PWA-Ready-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ 特徴

- 📱 **PWA対応**: オフラインでも動作し、アプリとしてインストール可能
- 🎨 **美しいUI**: Things 3風のミニマルで洗練されたデザイン
- ⚡ **高速**: Reactベースで快適な操作感
- 💾 **自動保存**: タスクとプロジェクトを自動的に保存
- 🔍 **検索機能**: タスクを素早く検索
- 📁 **プロジェクト管理**: タスクをプロジェクトごとに整理

## 🚀 クイックスタート

### 推奨環境

- Node.js 16.x以上
- npm 8.x以上

### インストール
```bash
# リポジトリをクローン
git clone https://github.com/yourusername/get-done.git
cd get-done

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm start
```

ブラウザで http://localhost:3000 が開きます。

## 📦 ビルド
```bash
# 本番用ビルド
npm run build
```

`build`フォルダに最適化されたファイルが生成されます。

## 🎯 使い方

### タスクの作成

1. 画面下部の「新規」ボタンをクリック
2. タスク名を入力してEnterキーを押す

### プロジェクトの作成

1. サイドバーの「プロジェクト」セクションにある「+」ボタンをクリック
2. プロジェクト名を入力

### タスクの完了

タスク左側の丸いボタンをクリックすると完了/未完了を切り替えられます。

### 検索

ヘッダーの検索ボックスにキーワードを入力すると、タスクを絞り込めます。

## 📱 PWAとしてインストール

### デスクトップ (Chrome/Edge)

1. アドレスバー右端の「インストール」アイコンをクリック
2. または、画面上部のバナーから「インストール」をクリック

### iOS (Safari)

1. 共有ボタン (□↑) をタップ
2. 「ホーム画面に追加」を選択

### Android (Chrome)

1. メニュー (⋮) を開く
2. 「アプリをインストール」を選択

## 🛠 技術スタック

- **フロントエンド**: React 19.2.3
- **アイコン**: Lucide React
- **PWA**: Service Worker + Web App Manifest
- **ストレージ**: LocalStorage (+ Claude Storage API)

## 📁 プロジェクト構成
```
get-done/
├── public/
│   ├── index.html          # メインHTML
│   ├── manifest.json       # PWA設定
│   ├── sw.js              # Service Worker
│   └── icons/             # アプリアイコン
├── src/
│   ├── App.js             # メインアプリケーション
│   ├── App.css            # スタイル
│   ├── index.js           # エントリーポイント
│   └── index.css          # グローバルスタイル
├── package.json
└── README.md
```

## 🎨 主な機能

### ✅ 実装済み

- [x] タスクの作成・編集・削除
- [x] タスクの完了/未完了切り替え
- [x] プロジェクト管理
- [x] インボックス、今日、完了ビュー
- [x] 検索機能
- [x] データの永続化
- [x] PWA対応（オフライン動作）
- [x] レスポンシブデザイン

### 🚧 今後の予定

- [ ] タスクの期日設定
- [ ] タグ機能
- [ ] ドラッグ&ドロップによる並び替え
- [ ] ダークモード
- [ ] エリア機能
- [ ] データのエクスポート/インポート
- [ ] クロスデバイス同期

## 🤝 コントリビューション

プルリクエスト大歓迎です！大きな変更は、まずIssueを開いて提案内容を投稿してください。

## 📄 ライセンス

MIT License

## 👤 作者

杉村 実紀 | Minori Sugimura