type Block = { _type?: string; style?: string; children?: { text?: string }[] };

/** Splits Portable Text at each level-two heading so the article can render an "In this article" index. */
export function articleSections(body: unknown[]) {
  const sections: { id: string; heading?: string; blocks: unknown[] }[] = [];
  body.forEach((value, index) => {
    const block = value as Block;
    if (block?._type === 'block' && block.style === 'h2') sections.push({ id: `section-${index}`, heading: (block.children || []).map(child => child.text || '').join('').trim(), blocks: [value] });
    else if (sections.length) sections[sections.length - 1].blocks.push(value);
    else sections.push({ id: `section-${index}`, blocks: [value] });
  });
  return sections;
}
