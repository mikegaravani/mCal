import { marked } from "marked";
import DOMPurify from "dompurify";

interface MarkedContentProps {
  content: string;
}

export function MarkedContent({ content }: MarkedContentProps) {
  const html: string = DOMPurify.sanitize(marked.parse(content) as string);

  return (
    <div
      className="prose prose-base"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
