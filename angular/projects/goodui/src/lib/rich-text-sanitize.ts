import { normalizeHex, rgbToHex } from './color-utils';
import { GOOD_FONT_OPTIONS, goodFontFamilyCss } from './select-font';

const allowedTags = new Set('p div h1 h2 h3 h4 h5 h6 strong b em i u s strike sup sub code small blockquote pre span br ul ol li a img table thead tbody tr th td caption hr'.split(' '));
const droppedTags = new Set('script style iframe object embed form input button select textarea svg math template meta link'.split(' '));
const blockTags = new Set('p div h1 h2 h3 h4 h5 h6 blockquote pre li th td caption'.split(' '));
const listTypes = new Set(['disc', 'circle', 'square', 'decimal', 'lower-alpha', 'upper-alpha', 'lower-greek', 'lower-roman', 'upper-roman']);

export function safeRichTextUrl(value: string, image = false): string | null {
  const url = value.trim();
  if (image && /^data:image\/(png|jpeg|gif|webp);base64,[a-z0-9+/=]+$/i.test(url)) return url;
  if (/^https?:\/\//i.test(url)) return url;
  if (!image && /^(mailto:|tel:|#[^\s]+|\/[^/])/i.test(url)) return url;
  return null;
}

function safeColor(value: string): string | null {
  const hex = normalizeHex(value);
  if (hex) return hex;
  const channels = /^rgba?\(\s*(\d{1,3})[,\s]+(\d{1,3})[,\s]+(\d{1,3})(?:[,\s/]+[\d.]+)?\s*\)$/i.exec(value);
  if (!channels) return null;
  return rgbToHex({ r: Number(channels[1]), g: Number(channels[2]), b: Number(channels[3]) });
}

function safeStyle(source: HTMLElement, target: HTMLElement, tag: string): void {
  const style = source.style;
  if (blockTags.has(tag)) {
    const align = style.textAlign;
    if (['left', 'center', 'right', 'justify'].includes(align)) target.style.textAlign = align;
  }
  if (tag === 'span' || tag === 'small') {
    const color = safeColor(style.color), background = safeColor(style.backgroundColor);
    if (color) target.style.color = color;
    if (background) target.style.backgroundColor = background;
    const size = /^([\d.]+)px$/.exec(style.fontSize);
    if (size && Number(size[1]) >= 8 && Number(size[1]) <= 72) target.style.fontSize = `${Number(size[1])}px`;
    if (style.fontVariant === 'small-caps') target.style.fontVariant = 'small-caps';
    const requestedFont = style.fontFamily.split(',')[0]?.trim().replace(/^["']|["']$/g, '');
    if (requestedFont && GOOD_FONT_OPTIONS.some(font => font.value.toLowerCase() === requestedFont.toLowerCase())) {
      target.style.fontFamily = goodFontFamilyCss(requestedFont) ?? '';
    }
  }
  if ((tag === 'ol' || tag === 'ul') && listTypes.has(style.listStyleType)) target.style.listStyleType = style.listStyleType;
  if (tag === 'table') {
    const width = /^([1-9]\d?|100)%$|^([1-9]\d{1,3})px$/.exec(style.width);
    if (width && (!width[2] || Number(width[2]) <= 5000)) target.style.width = width[0];
  }
  if (tag === 'tr') {
    const height = /^(\d{2,4})px$/.exec(style.height);
    if (height && Number(height[1]) >= 32 && Number(height[1]) <= 2000) target.style.height = height[0];
  }
  if (tag === 'td' || tag === 'th') {
    const padding = /^(\d{1,2})px$/.exec(style.padding);
    if (padding && Number(padding[1]) <= 24) target.style.padding = padding[0];
    const width = /^(\d{2,4})px$/.exec(style.width);
    if (width && Number(width[1]) >= 64 && Number(width[1]) <= 2000) target.style.width = width[0];
  }
}

/** Removes executable markup and unsupported attributes before HTML enters or leaves the editor. */
export function sanitizeRichText(document: Document, html: string): string {
  const source = document.createElement('template');
  source.innerHTML = html;
  const clean = document.createElement('div');
  const visit = (node: Node, parent: Node): void => {
    if (node.nodeType === Node.TEXT_NODE) { parent.appendChild(document.createTextNode(node.textContent ?? '')); return; }
    if (!(node instanceof HTMLElement)) return;
    const tag = node.tagName.toLowerCase();
    if (droppedTags.has(tag)) return;
    if (!allowedTags.has(tag)) { for (const child of [...node.childNodes]) visit(child, parent); return; }
    const element = document.createElement(tag);
    if (tag === 'a') {
      const href = safeRichTextUrl(node.getAttribute('href') ?? '');
      if (href) element.setAttribute('href', href);
      if (node.getAttribute('target') === '_blank') {
        element.setAttribute('target', '_blank');
        element.setAttribute('rel', 'noopener noreferrer');
      }
    }
    if (tag === 'img') {
      const src = safeRichTextUrl(node.getAttribute('src') ?? '', true);
      if (!src) return;
      element.setAttribute('src', src);
      element.setAttribute('alt', node.getAttribute('alt') ?? '');
    }
    if (tag === 'td' || tag === 'th') for (const key of ['colspan', 'rowspan']) {
      const count = Number(node.getAttribute(key));
      if (Number.isInteger(count) && count > 1 && count <= 20) element.setAttribute(key, String(count));
    }
    if (tag === 'th' && ['col', 'row'].includes(node.getAttribute('scope') ?? '')) {
      element.setAttribute('scope', node.getAttribute('scope')!);
    }
    safeStyle(node, element, tag);
    parent.appendChild(element);
    for (const child of [...node.childNodes]) visit(child, element);
  };
  for (const child of [...source.content.childNodes]) visit(child, clean);
  return clean.innerHTML;
}
