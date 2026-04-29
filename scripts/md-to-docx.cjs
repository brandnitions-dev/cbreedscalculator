/**
 * Convert all .md files in docs/compliance/ to .docx in docs/word-docs/
 * Uses the `docx` npm package — no pandoc needed.
 */
const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
} = require('docx');

const SRC = path.join(__dirname, '..', 'docs', 'compliance');
const DEST = path.join(__dirname, '..', 'docs', 'word-docs');

if (!fs.existsSync(DEST)) fs.mkdirSync(DEST, { recursive: true });

const mdFiles = fs.readdirSync(SRC).filter(f => f.endsWith('.md'));

function parseMarkdown(text) {
  const lines = text.split('\n');
  const children = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (line.trim() === '') { i++; continue; }

    // Horizontal rule
    if (/^-{3,}$/.test(line.trim())) { i++; continue; }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const headingText = headingMatch[2].replace(/\*\*/g, '');
      const headingLevel = level === 1 ? HeadingLevel.HEADING_1
        : level === 2 ? HeadingLevel.HEADING_2
        : level === 3 ? HeadingLevel.HEADING_3
        : HeadingLevel.HEADING_4;
      children.push(new Paragraph({
        heading: headingLevel,
        children: [new TextRun({ text: headingText, bold: level <= 2, size: level === 1 ? 32 : level === 2 ? 28 : 24 })],
        spacing: { before: 240, after: 120 },
      }));
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('>')) {
      const quoteText = line.replace(/^>\s*/, '').replace(/\*\*/g, '').replace(/\s{2,}$/, '');
      if (quoteText.trim()) {
        children.push(new Paragraph({
          children: [new TextRun({ text: quoteText, italics: true, color: '666666', size: 20 })],
          indent: { left: 720 },
          spacing: { before: 60, after: 60 },
        }));
      }
      i++;
      continue;
    }

    // Table: collect all table lines
    if (line.includes('|') && line.trim().startsWith('|')) {
      const tableLines = [];
      while (i < lines.length && lines[i].includes('|') && lines[i].trim().startsWith('|')) {
        const tl = lines[i].trim();
        // Skip separator rows (|---|---|)
        if (!/^\|[\s\-:|]+\|$/.test(tl)) {
          tableLines.push(tl);
        }
        i++;
      }
      if (tableLines.length > 0) {
        const parsedRows = tableLines.map(tl =>
          tl.split('|').filter((_, idx, arr) => idx > 0 && idx < arr.length - 1).map(c => c.trim())
        );
        const colCount = Math.max(...parsedRows.map(r => r.length));
        const rows = parsedRows.map((cells, rowIdx) => {
          while (cells.length < colCount) cells.push('');
          return new TableRow({
            children: cells.map(cell => new TableCell({
              children: [new Paragraph({
                children: [new TextRun({
                  text: cell.replace(/\*\*/g, ''),
                  bold: rowIdx === 0,
                  size: 18,
                })],
                spacing: { before: 40, after: 40 },
              })],
              width: { size: Math.floor(9000 / colCount), type: WidthType.DXA },
            })),
          });
        });
        children.push(new Table({
          rows,
          width: { size: 9000, type: WidthType.DXA },
        }));
        children.push(new Paragraph({ spacing: { before: 120, after: 120 } }));
      }
      continue;
    }

    // Code block
    if (line.trim().startsWith('```')) {
      i++;
      const codeLines = [];
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      if (i < lines.length) i++; // skip closing ```
      codeLines.forEach(cl => {
        children.push(new Paragraph({
          children: [new TextRun({ text: cl || ' ', font: 'Consolas', size: 18, color: '333333' })],
          indent: { left: 360 },
          spacing: { before: 20, after: 20 },
          shading: { fill: 'F5F5F5' },
        }));
      });
      children.push(new Paragraph({ spacing: { after: 120 } }));
      continue;
    }

    // Checkbox list items
    if (/^-\s*\[[ x/]\]/.test(line)) {
      const checked = line.includes('[x]') || line.includes('[/]');
      const text = line.replace(/^-\s*\[[ x/]\]\s*/, '').replace(/\*\*/g, '');
      children.push(new Paragraph({
        children: [
          new TextRun({ text: checked ? '☑ ' : '☐ ', font: 'Segoe UI Symbol', size: 20 }),
          new TextRun({ text, size: 20 }),
        ],
        indent: { left: 360 },
        spacing: { before: 40, after: 40 },
      }));
      i++;
      continue;
    }

    // Ordered list
    const olMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (olMatch) {
      const text = olMatch[2].replace(/\*\*/g, '').replace(/`([^`]+)`/g, '$1');
      children.push(new Paragraph({
        children: [new TextRun({ text: `${olMatch[1]}. ${text}`, size: 20 })],
        indent: { left: 360 },
        spacing: { before: 40, after: 40 },
      }));
      i++;
      continue;
    }

    // Unordered list
    if (/^[-*]\s/.test(line)) {
      const text = line.replace(/^[-*]\s+/, '').replace(/\*\*/g, '').replace(/`([^`]+)`/g, '$1');
      children.push(new Paragraph({
        children: [new TextRun({ text: `• ${text}`, size: 20 })],
        indent: { left: 360 },
        spacing: { before: 40, after: 40 },
      }));
      i++;
      continue;
    }

    // Regular paragraph
    const pText = line.replace(/\*\*/g, '').replace(/`([^`]+)`/g, '$1').replace(/\s{2,}$/, '');
    if (pText.trim()) {
      children.push(new Paragraph({
        children: [new TextRun({ text: pText, size: 20 })],
        spacing: { before: 60, after: 60 },
      }));
    }
    i++;
  }

  return children;
}

async function convert(filename) {
  const mdPath = path.join(SRC, filename);
  const content = fs.readFileSync(mdPath, 'utf8');
  const docxName = filename.replace('.md', '.docx');

  const children = parseMarkdown(content);

  const doc = new Document({
    creator: 'MOSSKYN LAB',
    title: filename.replace('.md', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    sections: [{ children }],
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 22 },
        },
      },
    },
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = path.join(DEST, docxName);
  fs.writeFileSync(outPath, buffer);
  console.log(`  ✅ ${docxName} (${(buffer.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  console.log(`\nConverting ${mdFiles.length} .md files → .docx\n`);
  console.log(`Source: ${SRC}`);
  console.log(`Dest:   ${DEST}\n`);

  for (const f of mdFiles) {
    await convert(f);
  }

  console.log(`\n✅ Done — ${mdFiles.length} files in docs/word-docs/\n`);
}

main().catch(err => { console.error(err); process.exit(1); });
