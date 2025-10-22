# VPM Repository Auto-Update

ReinaS-64892氏のリポジトリからフォークして作成した、VRChatのパッケージ管理システム（VPM）用の自動更新システムです。
GitHub Actionsを使用して、パッケージリポジトリから`workflow_call`で呼び出されることで自動的にvpm.jsonを更新します。
パッケージ作者は[VPMUnityPackageWorkflow](https://github.com/kurotori4423/VPMUnityPackageWorkflow)テンプレートを使用して簡単にVPMリポジトリに登録できます。
## セットアップ

### 1. テンプレートからリポジトリを作成

`Use this template`ボタンでこのリポジトリをテンプレートに新たなリポジトリを作成します。

### 2. 権限の設定

`Settings` > `Actions` > `General` の `Workflow permissions` を `Read and write permissions` に変更します。

`Settings` > `Pages` から `Build and deployment` の `Branch` を `main` `/(root)` にします。
 
### 3. 設定ファイルの編集（オプション）

`.github/config/repositories.yml`を編集してVPMリポジトリの基本情報をカスタマイズできます：

```yaml
# VPMリポジトリの設定
vpm_settings:
  name: "Your VPM Repository" # VPMリポジトリの名前
  description: "あなたのVRChat用パッケージリポジトリ" # VPMリポジトリの説明
  # author_name: "作者名"      # 省略時は自動設定
  # author_url: "URL"         # 省略時は自動設定
```

パッケージは各リポジトリから`workflow_call`で動的に登録されます。

### 4. GitHub Pagesの有効化

1. リポジトリの Settings → Pages
2. Source を "GitHub Actions" に設定
3. vpm.jsonが`https://{Githubアカウント名}.github.io/{リポジトリ名}/vpm.json`でアクセス可能になります

### 5. 設定をコミット・プッシュ（設定を変更した場合）

```bash
git add .github/config/repositories.yml
git commit -m "Update VPM repository settings"
git push origin main
```

これで準備完了！パッケージは各リポジトリから`workflow_call`で動的に登録されます。

### 6. パッケージリポジトリでのワークフロー設定

パッケージのリリース時に自動的にVPMリポジトリに追加するには、パッケージリポジトリに以下のワークフローを設定します：

**VPMUnityPackageWorkflow**: https://github.com/kurotori4423/VPMUnityPackageWorkflow

このテンプレートを使用すると、パッケージをリリースした際に自動的にこのVPMリポジトリの`workflow_call`が呼び出され、パッケージが追加されます。

## 使用方法

### パッケージの追加方法

#### 1. 自動追加（推奨）

パッケージリポジトリに[VPMUnityPackageWorkflow](https://github.com/kurotori4423/VPMUnityPackageWorkflow)テンプレートを設定することで、リリース時に自動的にVPMリポジトリに追加されます。

#### 2. 手動実行

1. GitHub Actionsタブに移動
2. "add-new-version"ワークフローを選択
3. "Run workflow"をクリック
4. 以下の情報を入力：
   - **repository**: パッケージのリポジトリ名
   - **tag**: バージョンタグ（例：v1.0.0）
   - **owner**: リポジトリオーナー名（必須）
5. 実行

### workflow_call経由での実行（パッケージリポジトリから）

パッケージリポジトリのワークフローファイルに以下を追加：

```yaml
jobs:
  update-vpm:
    uses: kurotori4423/VPMRepositoryAutoUpdate/.github/workflows/AddNewVersion.yml@main
    with:
      repository: ${{ github.event.repository.name }}
      tag: ${{ github.ref_name }}
      owner: ${{ github.repository_owner }}
```

### 自動連携（workflow_call）

パッケージのリポジトリに以下のテンプレートワークフローを設定することで、リリース時に自動的にVPMリポジトリに追加できます：

**VPMUnityPackageWorkflow**: https://github.com/kurotori4423/VPMUnityPackageWorkflow

このテンプレートを使用すると：
- パッケージをリリースした際に自動で`workflow_call`が実行される
- リポジトリ情報（名前、オーナー、タグ）が自動的に渡される
- 手動でVPMリポジトリを更新する必要がなくなる
- リリースワークフローに組み込んで完全自動化が可能

### VPMクライアントでの使用

VRChatプロジェクトで以下のURLをVPMリポジトリとして追加：

```
https://your-username.github.io/your-repo-name/vpm.json
```

**注意**: URLは自動生成されますが、実際のリポジトリ名に合わせて上記のプレースホルダーを置き換えてください。

## ワークフローの説明

- **AddNewVersion.yml**: メインのパッケージ追加ワークフロー（workflow_callとworkflow_dispatch対応）

### AddNewVersion.ymlの動作

このワークフローは以下の2つの方法で実行できます：

1. **workflow_call**: パッケージリポジトリから呼び出される（推奨）
2. **workflow_dispatch**: GitHub ActionsタブからUIで手動実行

**必須パラメータ：**
- `repository`: パッケージのリポジトリ名
- `tag`: バージョンタグ（例：v1.0.0）
- `owner`: リポジトリオーナー名（必須）

**実行内容：**
- 指定されたリポジトリのリリース情報を取得
- package.jsonとZIPファイルをダウンロード
- vpm.jsonを更新してコミット・プッシュ
- GitHub Pagesで新しいパッケージが利用可能になる

## カスタマイズ

詳細な設定方法については [CONFIG_README.md](.github/CONFIG_README.md) を参照してください。

## 要件

- パッケージのGitHubリリースに以下のアセットが含まれていること：
  - `package.json`: Unity Package Manager用の設定ファイル
  - `[package-name]-[version].zip`: パッケージファイル

## 注意事項とトラブルシューティング

- **オーナー指定**: `owner`パラメータは必須です。パッケージリポジトリから呼び出す場合は`${{ github.repository_owner }}`を使用してください
- **権限設定**: GitHub Actionsの`Read and write permissions`が必要です
- **Pages設定**: GitHub Pagesが有効になっていないとvpm.jsonにアクセスできません
- **リポジトリの存在**: 指定されたリポジトリとタグが存在しない場合、ワークフローは失敗します
- **パッケージ形式**: リリースにpackage.jsonとZIPファイルが含まれている必要があります
