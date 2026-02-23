# Bio Links (Glass + Monochrome)

## 日本語

### 概要

個人プロフィール向けリンク集ページです。Vite + Vanilla TypeScript で実装されています。

### ページ構成

- `/` : Bio links メインページ
- `/icon-lab/` : アイコン描画の品質確認ページ（開発用）

### 技術スタック

- Vite
- TypeScript (Vanilla)
- Vitest（Unit Test）
- Playwright（E2E Test）
- qrcode

### クイックスタート

前提:

- Node.js 20+（推奨: Node.js 22）

セットアップと起動:

```bash
npm install
npm run dev
```

デフォルトURL:

- Main page: `http://127.0.0.1:5173/`
- Icon Lab: `http://127.0.0.1:5173/icon-lab/`

`npm run dev` は `vite --host` で起動するため、LAN内デバイスからもアクセスできます。

### スクリプト

```bash
npm run clean
npm run dev
npm run build
npm run preview
npm run test:unit
npm run test:e2e
npm run test
npm run ci
npm run e2e:install
```

生成物（`dist/`, `output/`, `test-results/`, `.playwright-cli/`, `tmp/`）を削除したい場合は `npm run clean` を使います。

### コンテンツ編集

#### プロフィール

`src/data/profile.config.ts` を編集します。

- `name`: 表示名
- `bio`: 説明文（`''` で非表示）
- `avatarUrl`: `import.meta.env.BASE_URL` 基準の画像パス

#### リンク

`src/data/links.config.ts` を編集します。

- `title`: 表示ラベル
- `url`: 遷移先URL（`HEADER` では不要）
- `position`: 並び順
- `sourceType`: `CLASSIC` / `TWITTER_STATUS_LATEST` / `HEADER`
- `enabled`: 表示ON/OFF
- `iconKey`: アイコンキー

### アバター差し替え

1. `public/profile-avatar.jpg` を任意画像に置き換える。
2. ファイル名を変える場合は `src/data/profile.config.ts` の `avatarUrl` も更新する。
3. `npm run build` でプレビュー確認する。

### QR URL 仕様

QRコードの埋め込みURLは `src/lib/resolveQrUrl.ts` で決まります。

- 本番（`import.meta.env.DEV === false`）: 現在URLをそのまま使用
- 開発（`import.meta.env.DEV === true`）:
1. 現在ホストが loopback（`localhost` / `127.0.0.1` / `::1`）の場合のみ置換
2. 置換優先1: `VITE_DEV_LAN_HOST`
3. 置換優先2: 自動検出LAN IPv4（`__AUTO_DEV_LAN_HOST__`）
4. どちらも無ければ元URLを使用

ローカル設定例:

```bash
cp .env.example .env.local
# .env.local を編集
```

### GitHub Pages デプロイ

Workflow: `.github/workflows/deploy-pages.yml`

- Trigger: `main` への push または手動実行
- Steps:
1. `npm ci`
2. `npm run test:unit`
3. `npm run build`
4. `dist/` を GitHub Pages に配信

サブパス配信時は `VITE_BASE_PATH` を設定してください。

### CI 方針

Workflow: `.github/workflows/ci.yml`

- `pull_request`: unit test + build
- `push`（`main` 以外）: unit test + build
- `main` デプロイは deploy workflow のみが担当

### テスト

push 前の最低確認:

```bash
npm run test:unit
npm run build
```

公開前推奨:

```bash
npm run test:e2e
```

### ライセンス

[MIT](LICENSE)

サードパーティ通知は [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) を参照してください。

---

## English

### Overview

This is a personal bio links page built with Vite + Vanilla TypeScript.

### Pages

- `/` : Bio links main page
- `/icon-lab/` : Icon rendering quality gate (development page)

### Tech Stack

- Vite
- TypeScript (Vanilla)
- Vitest (unit tests)
- Playwright (E2E tests)
- qrcode

### Quick Start

Requirements:

- Node.js 20+ (Node.js 22 recommended)

Install and run:

```bash
npm install
npm run dev
```

Default URLs:

- Main page: `http://127.0.0.1:5173/`
- Icon Lab: `http://127.0.0.1:5173/icon-lab/`

`npm run dev` uses `vite --host`, so devices on the same LAN can access the dev server.

### Scripts

```bash
npm run clean
npm run dev
npm run build
npm run preview
npm run test:unit
npm run test:e2e
npm run test
npm run ci
npm run e2e:install
```

Use `npm run clean` when you want to remove generated artifacts (`dist/`, `output/`, `test-results/`, `.playwright-cli/`, `tmp/`).

### Content Editing

#### Profile

Edit `src/data/profile.config.ts`.

- `name`: displayed profile name
- `bio`: short description (`''` to hide)
- `avatarUrl`: avatar path based on `import.meta.env.BASE_URL`

#### Links

Edit `src/data/links.config.ts`.

- `title`: label
- `url`: destination URL (not required for `HEADER`)
- `position`: order
- `sourceType`: `CLASSIC` / `TWITTER_STATUS_LATEST` / `HEADER`
- `enabled`: show/hide toggle
- `iconKey`: icon key

### Avatar Replacement

1. Replace `public/profile-avatar.jpg` with your image.
2. If you rename the file, also update `avatarUrl` in `src/data/profile.config.ts`.
3. Run `npm run build` and verify the preview.

### QR URL Behavior

QR content is resolved by `src/lib/resolveQrUrl.ts`.

- Production (`import.meta.env.DEV === false`): use current URL as-is
- Development (`import.meta.env.DEV === true`):
1. Replace host only when current host is loopback (`localhost`, `127.0.0.1`, `::1`)
2. Priority 1: `VITE_DEV_LAN_HOST`
3. Priority 2: auto-detected LAN IPv4 (`__AUTO_DEV_LAN_HOST__`)
4. If neither is available, keep original URL

Optional local config:

```bash
cp .env.example .env.local
# then edit .env.local
```

### GitHub Pages Deployment

Workflow: `.github/workflows/deploy-pages.yml`

- Trigger: push to `main` or manual dispatch
- Steps:
1. `npm ci`
2. `npm run test:unit`
3. `npm run build`
4. Deploy `dist/` to GitHub Pages

If you publish under a repository subpath, set `VITE_BASE_PATH`.

### CI Policy

Workflow: `.github/workflows/ci.yml`

- `pull_request`: run unit tests + build
- `push` (non-`main`): run unit tests + build
- `main` deployment is handled only by deploy workflow

### Tests

Minimum checks before push:

```bash
npm run test:unit
npm run build
```

Recommended before public release:

```bash
npm run test:e2e
```

### License

[MIT](LICENSE)

For third-party notices, see [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
