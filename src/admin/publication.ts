import { REPO } from './github';

export type Publication = {
    state: 'pending' | 'success' | 'failed' | 'unknown';
    title: string;
    detail: string;
    url?: string;
};

const waiting: Publication = {
    state: 'pending', title: 'Обновление ещё не началось',
    detail: 'Проверьте ещё раз через минуту. Если статус не меняется, обратитесь к администратору сайта.',
};

export async function checkPublication(): Promise<Publication> {
    // Public requests intentionally omit the editor token: no Actions permission is needed.
    const request = async (path: string) => {
        const response = await fetch(`https://api.github.com/repos/${REPO}/${path}`, {
            headers: { Accept: 'application/vnd.github+json' },
            cache: 'no-store', credentials: 'omit', signal: AbortSignal.timeout(15000),
        });
        if (!response.ok) {
            throw Error(response.status === 403 || response.status === 429
                ? 'Сервис временно ограничил проверки. Попробуйте позже.'
                : 'Не удалось узнать статус. Попробуйте ещё раз позже.');
        }
        return response.json();
    };
    try {
        const ref = await request('git/ref/heads/main');
        if (typeof ref.object?.sha !== 'string') throw Error('Не удалось определить последние изменения. Попробуйте позже.');
        const result = await request(`actions/workflows/pages.yml/runs?branch=main&per_page=1&head_sha=${encodeURIComponent(ref.object.sha)}`);
        if (!Array.isArray(result.workflow_runs)) throw Error('Не удалось узнать статус. Попробуйте позже.');
        const run = result.workflow_runs[0];
        // Never report an older successful publication as the latest saved version.
        if (!run || run.head_sha !== ref.object.sha) return waiting;
        const url = typeof run.id === 'number' ? `https://github.com/${REPO}/actions/runs/${run.id}` : undefined;
        if (run.status !== 'completed') return {
            state: 'pending', title: 'Обновление ещё идёт',
            detail: 'Обычно это занимает несколько минут. Нажмите «Проверить публикацию» чуть позже.', url,
        };
        if (run.conclusion === 'success') return {
            state: 'success', title: 'Сайт обновлён',
            detail: 'Последние сохранённые изменения опубликованы. Если вы видите прежнюю версию, обновите страницу сайта.', url,
        };
        return {
            state: 'failed', title: run.conclusion === 'cancelled' ? 'Обновление отменено' : 'Не удалось обновить сайт',
            detail: 'Публикация последних изменений не подтверждена. Повторно сохранять их не нужно. Обратитесь к администратору сайта.', url,
        };
    } catch (error) {
        return {
            state: 'unknown', title: 'Не удалось проверить публикацию',
            detail: error instanceof Error && error.name === 'Error' ? error.message : 'Проверьте подключение к интернету и попробуйте ещё раз.',
        };
    }
}
