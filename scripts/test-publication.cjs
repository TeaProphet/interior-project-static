const fs = require('node:fs');
const ts = require('typescript');
const assert = require('node:assert/strict');
const code = ts.transpileModule(fs.readFileSync('src/admin/publication.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const mod = { exports: {} };
new Function('exports', 'require', code)(mod.exports, () => ({ REPO: 'TeaProphet/interior-project-static' }));
const { checkPublication } = mod.exports;
let calls;
function mockRun(run) {
    calls = [];
    global.fetch = async (url, options) => {
        calls.push({ url, options });
        return { ok: true, json: async () => url.endsWith('git/ref/heads/main')
            ? { object: { sha: 'latest' } } : { workflow_runs: run ? [run] : [] } };
    };
}
(async () => {
    const run = { id: 123, head_sha: 'latest', status: 'completed', conclusion: 'success' };
    mockRun(run);
    assert.equal((await checkPublication()).state, 'success');
    assert.match(calls[1].url, /actions\/workflows\/pages.yml\/runs\?branch=main&per_page=1&head_sha=latest$/);
    for (const { options } of calls) {
        assert.equal(options.headers.Authorization, undefined);
        assert.equal(options.credentials, 'omit');
        assert.equal(options.cache, 'no-store');
    }
    for (const status of ['queued', 'in_progress', 'waiting', 'pending']) {
        mockRun({ ...run, status, conclusion: null });
        assert.equal((await checkPublication()).state, 'pending');
    }
    for (const conclusion of ['failure', 'cancelled', 'timed_out', 'skipped', 'neutral', 'action_required']) {
        mockRun({ ...run, conclusion });
        assert.equal((await checkPublication()).state, 'failed');
    }
    mockRun(null);
    assert.equal((await checkPublication()).state, 'pending');
    mockRun({ ...run, head_sha: 'old' });
    assert.equal((await checkPublication()).state, 'pending');
    for (const status of [403, 429, 404, 500]) {
        global.fetch = async () => ({ ok: false, status });
        assert.equal((await checkPublication()).state, 'unknown');
    }
    global.fetch = async () => { throw new TypeError('Failed to fetch'); };
    const offline = await checkPublication();
    assert.equal(offline.state, 'unknown');
    assert.match(offline.detail, /интернет/);
    global.fetch = async () => ({ ok: true, json: async () => ({}) });
    assert.equal((await checkPublication()).state, 'unknown');
    console.log('PASS: publication status, latest saved version, no token, failures, network');
})().catch(error => { console.error(error); process.exitCode = 1; });
