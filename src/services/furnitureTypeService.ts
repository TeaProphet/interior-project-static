import { furniture, mediaUrl } from './content';
import type { StrapiMedia } from './projectService';
export const furnitureTypeService = { async getFurnitureTypes() { return [...furniture].sort((a, b) => (a.order || 0) - (b.order || 0)); }, async getFurnitureTypeById(id: string) { return furniture.find(x => x.documentId === id) || null; }, getMediaUrl(m: StrapiMedia, _u?: string) { return mediaUrl(m.url); }, getThumbnailUrl(m: StrapiMedia, _f?: string, _u?: string) { return mediaUrl(m.url.replace('/media/', '/thumbs/') + '.webp'); } };
