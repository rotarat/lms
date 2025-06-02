import ReactMarkdown from 'react-markdown';

/**
 * Remove common leading spaces from every line so that Markdown
 * isn’t littered with extraneous indentation.
 */
function normalizeIndentation(text) {
  if (!text) return '';

  // Split lines, ignore empty lines when computing indentation
  const lines = text.split('\n');
  let minIndent = Infinity;

  lines.forEach(line => {
    // skip empty lines
    if (line.trim().length === 0) return;
    // count leading spaces or tabs
    const match = line.match(/^[ \t]*/);
    if (match) {
      const indentLength = match[0].length;
      if (indentLength < minIndent) minIndent = indentLength;
    }
  });

  if (minIndent === Infinity || minIndent === 0) {
    // nothing to trim
    return text;
  }

  // Remove that many spaces from each line
  const normalized = lines.map(line => {
    return line.startsWith(' '.repeat(minIndent))
      ? line.slice(minIndent)
      : line;
  });

  return normalized.join('\n');
}

const DiagramExplanation = ({ explanation }) => {
  if (!explanation) return null;

  const cleaned = normalizeIndentation(explanation);

  return (
    <div className="card">
      <div className="card-body">
        <ReactMarkdown>{cleaned}</ReactMarkdown>
      </div>
    </div>
  );
};

export default DiagramExplanation;
