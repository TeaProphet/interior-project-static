export const REPO = 'TeaProphet/interior-project-static';
export type Category = {
    id: string;
    documentId: string;
    title: string;
    description: string;
    order: number;
    photos: {
        id: number;
        name: string;
        url: string;
    }[];
    updatedAt: string;
};
export type Content = {
    categories: Category[];
    contacts: Record<string, string>;
};
export class GitHub {
    constructor(private token: string) { }
    clear() { this.token = ''; }
    async request(path: string, method = 'GET', body?: unknown) {
        if (!this.token)
            throw Error('Войдите снова');
        const r = await fetch(`https://api.github.com/repos/${REPO}/${path}`, { method, headers: { Authorization: `Bearer ${this.token}`, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) }).catch(() => { throw Error('Не удалось связаться с сервисом. Проверьте интернет и попробуйте снова.'); });
        if (!r.ok)
            throw Error(r.status === 401 ? 'Ключ доступа недействителен или истёк. Получите новый ключ у администратора сайта.' : r.status === 403 ? 'Доступ ограничен. Попробуйте позже; если ошибка повторится, обратитесь к администратору сайта.' : r.status === 409 || r.status === 422 ? 'Не удалось сохранить изменения. Скачайте копию изменений, затем загрузите сохранённые данные и повторите правки.' : 'Не удалось выполнить действие. Попробуйте позже или обратитесь к администратору сайта.');
        return r.json();
    }
    async load() {
        const ref = await this.request('git/ref/heads/main');
        const commit = await this.request('git/commits/' + ref.object.sha);
        const tree = await this.request('git/trees/' + commit.tree.sha + '?recursive=1');
        if (tree.truncated)
            throw Error('Слишком большой репозиторий');
        const paths = tree.tree.filter((x: {
            path: string;
        }) => /^content\/furniture\/[a-z0-9-]+\.json$/.test(x.path) || x.path === 'content/contacts.json');
        const content: Content = { categories: [], contacts: {} };
        for (const p of paths) {
            const b = await this.request('git/blobs/' + p.sha);
            const json = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(b.content.replace(/\s/g, '')), c => c.charCodeAt(0))));
            if (p.path === 'content/contacts.json')
                content.contacts = json;
            else
                content.categories.push(json);
        }
        if (!Object.keys(content.contacts).length)
            throw Error('Не найден файл контактов');
        return { head: ref.object.sha as string, tree: commit.tree.sha as string, content, paths: paths.map((p: {
                path: string;
            }) => p.path) as string[] };
    }
    async save(snapshot: Awaited<ReturnType<GitHub['load']>>, content: Content, uploads: Map<string, string>) {
        for (const c of content.categories)
            if (!/^[a-z0-9-]+$/.test(c.id) || c.documentId !== c.id || !c.title.trim() || !Number.isFinite(c.order))
                throw Error('Проверьте название и порядок категорий');
        const current = await this.request('git/ref/heads/main');
        if (current.object.sha !== snapshot.head)
            throw Error('Данные изменены другим редактором. Скачайте копию изменений, затем загрузите сохранённые данные и повторите свои правки.');
        const entries: {
            path: string;
            mode: string;
            type: string;
            content?: string;
            sha?: string | null;
        }[] = [];
        const used = new Set(content.categories.flatMap(c => c.photos.map(p => 'public' + p.url)));
        for (const [path, base64] of uploads) {
            if (!used.has(path))
                continue;
            const blob = await this.request('git/blobs', 'POST', { content: base64, encoding: 'base64' });
            entries.push({ path, mode: '100644', type: 'blob', sha: blob.sha });
        }
        for (const c of content.categories)
            entries.push({ path: `content/furniture/${c.id}.json`, mode: '100644', type: 'blob', content: JSON.stringify(c, null, 2) + '\n' });
        entries.push({ path: 'content/contacts.json', mode: '100644', type: 'blob', content: JSON.stringify(content.contacts, null, 2) + '\n' });
        for (const old of snapshot.paths)
            if (!entries.some(x => x.path === old))
                entries.push({ path: old, mode: '100644', type: 'blob', sha: null });
        const remaining = new Set(content.categories.flatMap(c => c.photos.map(p => p.url)));
        for (const url of new Set(snapshot.content.categories.flatMap(c => c.photos.map(p => p.url))))
            if (!remaining.has(url))
                entries.push({ path: 'public' + url, mode: '100644', type: 'blob', sha: null });
        const tree = await this.request('git/trees', 'POST', { base_tree: snapshot.tree, tree: entries });
        const commit = await this.request('git/commits', 'POST', { message: 'Обновление контента через редактор', tree: tree.sha, parents: [snapshot.head] });
        await this.request('git/refs/heads/main', 'PATCH', { sha: commit.sha, force: false });
        return { sha: commit.sha as string, tree: tree.sha as string };
    }
}
