import { useState, useEffect, useRef } from 'react';
import { GitHub, REPO, type Content, type Category } from './github';
import './admin.css';
const labels: Record<string, string> = { phoneNumber: 'Телефон', whatsappNumber: 'WhatsApp', telegram: 'Telegram', vk: 'VK', address: 'Адрес', email: 'Email', inn: 'ИНН', ogrn: 'ОГРН' };
export default function Admin() {
    const [client, setClient] = useState<GitHub | null>(null), [snapshot, setSnapshot] = useState<Awaited<ReturnType<GitHub['load']>> | null>(null), [content, setContent] = useState<Content | null>(null), [selected, setSelected] = useState('contacts'), [busy, setBusy] = useState(false), [message, setMessage] = useState(''), [dirty, setDirty] = useState(false);
    const token = useRef<HTMLInputElement>(null), uploads = useRef(new Map<string, string>());
    useEffect(() => { const warn = (e: BeforeUnloadEvent) => { if (dirty) {
        e.preventDefault();
        e.returnValue = '';
    } }; window.addEventListener('beforeunload', warn); return () => window.removeEventListener('beforeunload', warn); }, [dirty]);
    useEffect(() => () => client?.clear(), [client]);
    const category = content?.categories.find(c => c.id === selected);
    const change = (fn: (c: Content) => Content) => { setContent(c => c ? fn(c) : c); setDirty(true); };
    const edit = (data: Partial<Category>) => change(c => ({ ...c, categories: c.categories.map(x => x.id === selected ? { ...x, ...data, updatedAt: new Date().toISOString() } : x) }));
    async function login(e: React.FormEvent) { e.preventDefault(); setBusy(true); const api = new GitHub(token.current?.value.trim() || ''); if (token.current)
        token.current.value = ''; try {
        const s = await api.load();
        setSnapshot(s);
        setContent(structuredClone(s.content));
        setClient(api);
        setMessage('Контент загружен');
    }
    catch (e) {
        api.clear();
        setMessage(e instanceof Error ? e.message : 'Ошибка соединения');
    }
    finally {
        setBusy(false);
    } }
    async function reload() { if (!client || dirty && !confirm('Заменить несохранённые изменения данными из GitHub?'))
        return; setBusy(true); try {
        const s = await client.load();
        setSnapshot(s);
        setContent(structuredClone(s.content));
        uploads.current.clear();
        setDirty(false);
        setMessage('Данные обновлены');
    }
    catch (e) {
        setMessage(String(e));
    }
    finally {
        setBusy(false);
    } }
    async function save() { if (!client || !snapshot || !content)
        return; setBusy(true); try {
        const sha = await client.save(snapshot, content, uploads.current);
        setSnapshot({ ...snapshot, head: sha.sha, tree: sha.tree, content: structuredClone(content), paths: ['content/contacts.json', ...content.categories.map(c => `content/furniture/${c.id}.json`)] });
        uploads.current.clear();
        setDirty(false);
        setMessage('Сохранено в GitHub. Публикация ещё не подтверждена — проверьте Actions.');
    }
    catch (e) {
        setMessage(String(e));
    }
    finally {
        setBusy(false);
    } }
    async function addPhotos(files: FileList | null) { if (!files || !category)
        return; setBusy(true); try {
        const photos = [];
        for (const file of Array.from(files)) {
            if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 10 * 1024 * 1024)
                throw Error('Допустимы JPEG, PNG, WebP до 10 МиБ');
            const data = await new Promise<string>((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(String(r.result).split(',')[1]); r.onerror = reject; r.readAsDataURL(file); });
            const ext = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1];
            const url = '/media/' + crypto.randomUUID() + '.' + ext;
            uploads.current.set('public' + url, data);
            photos.push({ id: Date.now() + photos.length, name: file.name, url });
        }
        edit({ photos: [...category.photos, ...photos] });
    }
    catch (e) {
        setMessage(String(e));
    }
    finally {
        setBusy(false);
    } }
    function download() { const url = URL.createObjectURL(new Blob([JSON.stringify({ content, uploads: Object.fromEntries(uploads.current) }, null, 2)], { type: 'application/json' })); const a = document.createElement('a'); a.href = url; a.download = 'unsaved-content.json'; a.click(); URL.revokeObjectURL(url); }
    return <main className="editor"><header><div><p>Интерьер Проект</p><h1>Редактор сайта</h1></div>{client && <button disabled={busy} onClick={() => { if (dirty && !confirm('Выйти без сохранения?'))
        return; client.clear(); uploads.current.clear(); setClient(null); setContent(null); setSnapshot(null); setDirty(false); setMessage('Вы вышли'); }}>Выйти</button>}</header>
 <p role="status" aria-live="polite">{busy ? 'Выполняется операция…' : message}</p>
 {!client ? <form onSubmit={login}><h2>Вход с токеном GitHub</h2><p>Репозиторий: {REPO}. Токен хранится только до закрытия или перезагрузки страницы.</p><label>Персональный токен<input ref={token} type="password" required autoComplete="off"/></label><button disabled={busy}>Войти</button><p><a href="https://github.com/settings/personal-access-tokens/new" target="_blank" rel="noreferrer">Создать токен</a>: выберите только этот репозиторий и Contents → Read and write.</p></form> : content && <>
 <div className="editor-actions"><button disabled={busy || !dirty} onClick={save}>Сохранить и запустить публикацию</button><button disabled={busy} onClick={reload}>Перезагрузить</button><button disabled={busy} onClick={download}>Скачать свои правки</button><a href={`https://github.com/${REPO}/actions`} target="_blank" rel="noreferrer">Проверить публикацию</a><span>{dirty ? 'Есть несохранённые изменения' : 'Нет несохранённых изменений'}</span></div>
 <div className="editor-grid"><nav aria-label="Разделы редактора"><button disabled={busy} onClick={() => setSelected('contacts')}>Контакты и реквизиты</button>{[...content.categories].sort((a, b) => a.order - b.order).map(c => <button disabled={busy} key={c.id} aria-current={selected === c.id ? 'page' : undefined} onClick={() => setSelected(c.id)}>{c.title || 'Новый тип мебели'}</button>)}<button disabled={busy} onClick={() => { const id = crypto.randomUUID(); change(c => ({ ...c, categories: [...c.categories, { id, documentId: id, title: 'Новый тип мебели', description: '', order: c.categories.length, photos: [], updatedAt: new Date().toISOString() }] })); setSelected(id); }}>Добавить тип мебели</button></nav>
 <fieldset disabled={busy}>{selected === 'contacts' ? <><h2>Контакты и реквизиты</h2>{Object.entries(labels).map(([key, label]) => <label key={key}>{label}<input value={content.contacts[key] || ''} onChange={e => change(c => ({ ...c, contacts: { ...c.contacts, [key]: e.target.value } }))}/></label>)}</> : category ? <><h2>{category.title}</h2><label>Название<input value={category.title} onChange={e => edit({ title: e.target.value })}/></label><label>Описание<textarea rows={6} value={category.description} onChange={e => edit({ description: e.target.value })}/></label><label>Порядок в каталоге<input type="number" value={category.order} onChange={e => edit({ order: Number(e.target.value) })}/></label><label>Добавить фотографии<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e => { void addPhotos(e.target.files); e.target.value = ''; }}/></label><p>Первое фото используется как обложка.</p><div className="editor-photos">{category.photos.map((p, i) => <article key={p.url}><img alt={p.name} src={uploads.current.has('public' + p.url) ? 'data:image/' + (p.url.endsWith('.jpg') ? 'jpeg' : p.url.split('.').pop()) + ';base64,' + uploads.current.get('public' + p.url) : `https://raw.githubusercontent.com/${REPO}/${snapshot?.head}/public${p.url}`}/><p>{i + 1}. {p.name}</p><button disabled={i === 0} onClick={() => { const photos = [...category.photos]; [photos[i - 1], photos[i]] = [photos[i], photos[i - 1]]; edit({ photos }); }}>Раньше</button><button disabled={i === category.photos.length - 1} onClick={() => { const photos = [...category.photos]; [photos[i + 1], photos[i]] = [photos[i], photos[i + 1]]; edit({ photos }); }}>Позже</button><button onClick={() => { if (confirm('Удалить фото из категории?'))
            edit({ photos: category.photos.filter(x => x.url !== p.url) }); }}>Удалить</button></article>)}</div><button onClick={() => { if (confirm('Удалить тип мебели?')) {
            change(c => ({ ...c, categories: c.categories.filter(x => x.id !== selected) }));
            setSelected('contacts');
        } }}>Удалить тип мебели</button></> : <p>Выберите раздел.</p>}</fieldset></div></>}
 </main>;
}
