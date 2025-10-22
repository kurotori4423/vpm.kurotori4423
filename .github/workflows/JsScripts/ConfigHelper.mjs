import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

/**
 * VPM設定を取得する
 * @returns {object} VPM設定オブジェクト
 */
export function getVpmSettings() {
    try {
        const configPath = path.join(process.env.GITHUB_WORKSPACE, '.github', 'config', 'repositories.yml');
        const configContent = fs.readFileSync(configPath, 'utf8');
        const config = yaml.load(configContent);
        
        // GitHub Pages URLを自動生成
        const repoUrl = generateGitHubPagesUrl();
        
        return {
            ...config.vpm_settings,
            repo_url: repoUrl
        };
        
    } catch (error) {
        console.error('VPM設定の読み込みに失敗しました:', error);
        // フォールバック: GitHub環境変数から自動生成
        return {
            repo_url: generateGitHubPagesUrl(),
            name: `${process.env.GITHUB_REPOSITORY_OWNER || 'VPM'} Repository`, 
            description: 'VRChat用パッケージリポジトリ',
            author_name: process.env.GITHUB_REPOSITORY_OWNER || 'Repository Owner',
            author_url: `https://github.com/${process.env.GITHUB_REPOSITORY_OWNER || ''}`
        };
    }
}

/**
 * VPMリポジトリの基本構造を初期化する
 * @param {object} existingVpmJson - 既存のVPMリポジトリJSON
 * @returns {object} 初期化されたVPMリポジトリJSON
 */
export function initializeVpmRepo(existingVpmJson = {}) {
    const vpmSettings = getVpmSettings();
    
    return {
        name: existingVpmJson.name || vpmSettings.name,
        description: existingVpmJson.description || vpmSettings.description,
        url: existingVpmJson.url || vpmSettings.repo_url,
        id: existingVpmJson.id || generateRepoId(vpmSettings.repo_url),
        author: existingVpmJson.author || {
            name: vpmSettings.author_name || "Repository Owner",
            url: vpmSettings.author_url || ""
        },
        packages: existingVpmJson.packages || {}
    };
}

/**
 * GitHub Pagesを使用したVPMリポジトリURLを自動生成する
 * @returns {string} GitHub Pages上のvpm.jsonのURL
 */
function generateGitHubPagesUrl() {
    const owner = process.env.GITHUB_REPOSITORY_OWNER;
    const repo = process.env.GITHUB_REPOSITORY;
    
    if (!owner || !repo) {
        console.warn('GitHub環境変数が見つかりません。デフォルトURLを使用します。');
        return 'https://your-username.github.io/your-repo-name/vpm.json';
    }
    
    // リポジトリ名からオーナー部分を除去（owner/repo形式の場合）
    const repoName = repo.includes('/') ? repo.split('/')[1] : repo;
    
    return `https://${owner}.github.io/${repoName}/vpm.json`;
}

/**
 * URLからリポジトリIDを生成する
 * @param {string} repoUrl - リポジトリURL
 * @returns {string} リポジトリID
 */
function generateRepoId(repoUrl) {
    try {
        const url = new URL(repoUrl);
        const domain = url.hostname.replace('www.', '');
        const path = url.pathname.replace(/^\/|\/$/g, '').replace(/\//g, '.');
        return `${domain}${path ? '.' + path : ''}`;
    } catch (error) {
        console.warn('リポジトリIDの生成に失敗しました:', error);
        return 'com.example.vpm-repo';
    }
}

/**
 * パッケージの基本メタデータを補完する
 * @param {object} packageJson - パッケージのJSON
 * @param {string} owner - リポジトリオーナー
 * @returns {object} 補完されたパッケージJSON
 */
export function enrichPackageMetadata(packageJson, owner) {
    const vpmSettings = getVpmSettings();
    
    // 基本情報の補完
    if (!packageJson.repo) {
        packageJson.repo = vpmSettings.repo_url;
    }
    
    // GitHubリンクの生成（authorが設定されていない場合）
    if (!packageJson.author || !packageJson.author.url) {
        packageJson.author = packageJson.author || {};
        if (!packageJson.author.url) {
            packageJson.author.url = `https://github.com/${owner}`;
        }
    }
    
    return packageJson;
}
