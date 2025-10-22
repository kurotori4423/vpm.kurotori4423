import { initializeVpmRepo } from './ConfigHelper.mjs';

/**
 * 空または基本的なVPMリポジトリJSONを初期化する
 */
export function initEmptyVpmRepo() {
    return initializeVpmRepo({});
}

/**
 * 既存のvpm.jsonを読み込んで基本構造を確認・補完する
 */
export function validateAndFixVpmRepo(vpmJsonString) {
    try {
        let vpmObj = JSON.parse(vpmJsonString);
        return initializeVpmRepo(vpmObj);
    } catch (error) {
        console.warn('vpm.jsonの解析に失敗、新規作成します:', error);
        return initializeVpmRepo({});
    }
}
