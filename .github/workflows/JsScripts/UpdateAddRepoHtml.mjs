import * as fs from 'fs';
import * as path from 'path';

/**
 * add-repo.htmlのURLを現在のGitHub Pagesの設定に基づいて更新する
 */
export function updateAddRepoHtml() {
    try {
        const htmlFilePath = path.join(process.env.GITHUB_WORKSPACE, 'add-repo.html');
        
        // GitHub環境変数から正しいURLを生成
        const owner = process.env.GITHUB_REPOSITORY_OWNER;
        const repo = process.env.GITHUB_REPOSITORY;
        
        if (!owner || !repo) {
            throw new Error('GitHub環境変数が見つかりません');
        }
        
        // リポジトリ名からオーナー部分を除去（owner/repo形式の場合）
        const repoName = repo.includes('/') ? repo.split('/')[1] : repo;
        
        // GitHub PagesのVPM URLを生成
        const vpmUrl = `https://${owner}.github.io/${repoName}/vpm.json`;
        
        // URLエンコード
        const encodedUrl = encodeURIComponent(vpmUrl);
        const vccUrl = `vcc://vpm/addRepo?url=${encodedUrl}`;
        
        // HTMLテンプレートを生成
        const htmlContent = `<!doctype html>
<title>add repository</title>
<meta http-equiv="refresh" content="0;URL='${vccUrl}'" />
<a href="${vccUrl}">リトライ</a>
`;
        
        // ファイルに書き込み
        fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
        
        console.log(`add-repo.html updated successfully!`);
        console.log(`VPM URL: ${vpmUrl}`);
        console.log(`VCC URL: ${vccUrl}`);
        
        return {
            success: true,
            vpmUrl: vpmUrl,
            vccUrl: vccUrl
        };
        
    } catch (error) {
        console.error('add-repo.htmlの更新に失敗しました:', error);
        throw error;
    }
}