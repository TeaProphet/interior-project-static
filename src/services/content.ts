const files = import.meta.glob('../../content/furniture/*.json', { eager: true, import: 'default' });
export const furniture = Object.values(files) as import('./projectService').FurnitureType[];
export const mediaUrl = (url: string) => import.meta.env.BASE_URL + url.replace(/^\//, '');
