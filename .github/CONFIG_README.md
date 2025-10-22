# VPM Repository Configuration

このファイルでVPMリポジトリの自動更新システムの設定を管理します。

## システム概要

**パッケージリポジトリから直接呼び出される分散型システム**

- パッケージリストの事前設定が不要
- 各パッケージリポジトリから`workflow_call`で動的登録
- VPMリポジトリ側は基本設定のみを管理
- スケーラブルで保守性の高い設計

## 設定ファイル

### `.github/config/repositories.yml`

このファイルでVPMリポジトリの基本設定を定義します。

```yaml
# VPMリポジトリの設定
vpm_settings:
  name: "Your VPM Repository"
  description: "あなたのVRChat用パッケージリポジトリ"
  # author_name: "作者名"      # 省略時は自動設定
  # author_url: "URL"         # 省略時は自動設定
  # repo_url は自動生成されます（GitHub Pages URL）
```

**設定項目:**
- パッケージは各リポジトリから`workflow_call`で動的に追加されます
- 個別パッケージの事前設定は不要です

## 🏁 クイックスタート

### 1. 最小限のセットアップ

VPMリポジトリは自動的に初期化されます。手動設定は不要です！

```json
// vpm.json は自動生成・管理されます
{
  "name": "Your VPM Repository",
  "description": "自動生成された説明",
  "url": "https://username.github.io/repo-name/vpm.json",
  "packages": {}
}
```

### 2. 設定のカスタマイズ（オプション）

`.github/config/repositories.yml`を編集してVPM情報をカスタマイズ：

```yaml
vpm_settings:
  name: "My Custom VPM Repository"
  description: "カスタム説明文"
```

### 3. パッケージの登録

各パッケージリポジトリから`workflow_call`で自動登録：
1. パッケージリポジトリに[VPMUnityPackageWorkflow](https://github.com/kurotori4423/VPMUnityPackageWorkflow)を設定
2. リリース時に自動的にVPMリポジトリに追加
3. 設定ファイルの更新は不要

## 使用方法

### 1. パッケージリポジトリでのセットアップ

各パッケージリポジトリに以下のワークフローを設定：

```yaml
# .github/workflows/release.yml
name: Release
on:
  release:
    types: [published]

jobs:
  update-vpm:
    uses: kurotori4423/VPMRepositoryAutoUpdate/.github/workflows/AddNewVersion.yml@main
    with:
      repository: ${{ github.event.repository.name }}
      tag: ${{ github.ref_name }}
      owner: ${{ github.repository_owner }}
```

### 2. 手動でのバージョン追加

#### GitHub Actions UI
1. GitHub Actionsの「add-new-version」ワークフローに移動
2. 「Run workflow」をクリック
3. 以下を入力して実行：
   - **repository**: パッケージのリポジトリ名
   - **tag**: バージョンタグ（例：v1.0.0）
   - **owner**: リポジトリオーナー名（必須）

#### workflow_call（推奨）
パッケージリポジトリから呼び出し：

```yaml
jobs:
  update-vpm:
    uses: kurotori4423/VPMRepositoryAutoUpdate/.github/workflows/AddNewVersion.yml@main
    with:
      repository: "my-package"
      tag: "v1.0.0"
      owner: "my-username"
```

## ファイル構成

### ワークフローファイル
- `AddNewVersion.yml`: メインのパッケージ追加ワークフロー（workflow_call & workflow_dispatch対応）

### JavaScript処理スクリプト
- `JsScripts/`: 処理用のJavaScriptファイル群
  - `ConfigHelper.mjs`: VPM設定の読み込みと初期化
  - `InitializeVpmRepo.mjs`: VPMリポジトリの初期化・検証
  - `GetZipURL.mjs`: リリースからZIPファイルURL取得
  - `GetPackageDotJson.mjs`: リリースからpackage.json取得
  - `ReplacePackageURL.mjs`: パッケージURLの置換処理
  - `AddToVPMRepo.mjs`: VPMリポジトリへのパッケージ追加

### 設定ファイル
- `.github/config/repositories.yml`: VPMリポジトリの基本設定

## カスタマイズ

### VPM設定の変更

`.github/config/repositories.yml`の`vpm_settings`を編集：

```yaml
vpm_settings:
  name: "Custom Repository Name"
  description: "カスタム説明文"
  author_name: "カスタム作者名"
  author_url: "https://example.com"
```

**注意**: `repo_url`は自動生成されます。

### パッケージの追加

パッケージの追加方法：

1. パッケージリポジトリに[VPMUnityPackageWorkflow](https://github.com/kurotori4423/VPMUnityPackageWorkflow)テンプレートを適用
2. リリース時に自動的にVPMリポジトリに追加
3. 手動追加の場合は`AddNewVersion.yml`ワークフローを実行

### 高度なカスタマイズ

- `InitializeVpmRepo.mjs`: VPMリポジトリの初期化ロジック
- `ConfigHelper.mjs`: 設定読み込みとメタデータ補完
- GitHub Pages設定: カスタムドメインの設定が可能

## トラブルシューティング

### よくある問題

1. **「owner パラメータが必須」エラー**
   - workflow_callまたはworkflow_dispatchで`owner`を必ず指定してください

2. **「リポジトリが見つからない」エラー**
   - リポジトリ名とオーナー名が正しいか確認
   - リポジトリがパブリックかアクセス権限があるか確認

3. **「リリースが見つからない」エラー**
   - 指定したタグのリリースが存在するか確認
   - リリースにpackage.jsonとZIPファイルが含まれているか確認

4. **VPMリポジトリURL**
   - 自動生成されるURL: `https://{owner}.github.io/{repo-name}/vpm.json`
   - GitHub Pagesが有効になっているか確認
