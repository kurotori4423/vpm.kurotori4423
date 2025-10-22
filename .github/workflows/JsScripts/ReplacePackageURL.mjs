import { getVpmSettings } from './ConfigHelper.mjs';

export function Func() {
    const { PackageJson, ReplaceURL } = process.env

    let jsonObj = JSON.parse(PackageJson);
    jsonObj.url = ReplaceURL;
    
    // VPM設定を適用
    const vpmSettings = getVpmSettings();
    jsonObj.repo = vpmSettings.repo_url;
    
    return JSON.stringify(jsonObj);
}
