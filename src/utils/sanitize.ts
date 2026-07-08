import DOMPurify from 'isomorphic-dompurify';

const ALLOWED_TAGS = ['b', 'i', 'em', 'strong', 'span', 'del', 'ins', 'sup', 'sub', 'br'];
const ALLOWED_ATTR = ['class', 'style'];

export function sanitizeHtml(dirty: string): string {
    if (!dirty) return '';
    return DOMPurify.sanitize(dirty, {
        ALLOWED_TAGS,
        ALLOWED_ATTR,
    });
}
