import { initializeVpmRepo, enrichPackageMetadata } from './ConfigHelper.mjs';

export function Func() {
    const { VPMRepoJson, AddPackageJson, RepositoryOwner } = process.env

    let jsonObj = JSON.parse(VPMRepoJson);
    let addJsonObj = JSON.parse(AddPackageJson);
    
    // VPMリポジトリの基本構造を初期化
    jsonObj = initializeVpmRepo(jsonObj);
    
    // パッケージのメタデータを補完
    addJsonObj = enrichPackageMetadata(addJsonObj, RepositoryOwner || 'unknown');

    // パッケージが存在しない場合は新規作成
    if (!jsonObj.packages[addJsonObj.name]) {
        console.log(`新しいパッケージを追加: ${addJsonObj.name}`);
        jsonObj.packages[addJsonObj.name] = {
            versions: {}
        };
    }
    
    // バージョンが存在しない場合は新規作成
    if (!jsonObj.packages[addJsonObj.name].versions) {
        jsonObj.packages[addJsonObj.name].versions = {};
    }

    // バージョンを追加
    jsonObj.packages[addJsonObj.name].versions[addJsonObj.version] = addJsonObj;
    
    console.log(`パッケージ ${addJsonObj.name} のバージョン ${addJsonObj.version} を追加しました`);

    return JSON.stringify(jsonObj, null, 2);
}
