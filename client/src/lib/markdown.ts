import { marked } from "marked";
import Prism from "prismjs";

// Import Prism languages
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-css";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-csharp";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-yaml";
import "prismjs/components/prism-go";
import "prismjs/components/prism-rust";
import "prismjs/components/prism-php";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-sql";

// Configure marked
marked.setOptions({
  gfm: true,
  breaks: true,
  highlight: function (code, lang) {
    if (Prism.languages[lang]) {
      return Prism.highlight(code, Prism.languages[lang], lang);
    }
    return code;
  },
});

export function renderMarkdown(markdown: string): string {
  return marked.parse(markdown);
}

// Function to extract a plain text excerpt from markdown
export function extractExcerpt(markdown: string, maxLength: number = 160): string {
  // Remove code blocks
  let text = markdown.replace(/```[\s\S]*?```/g, "");
  
  // Remove Markdown formatting
  text = text
    .replace(/!\[.*?\]\(.*?\)/g, "") // Remove images
    .replace(/\[.*?\]\(.*?\)/g, "$1") // Replace links with their text
    .replace(/[*_`~#]/g, "") // Remove emphasis, code, etc.
    .replace(/\n/g, " ") // Replace newlines with spaces
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim();
  
  // Truncate to maxLength
  if (text.length > maxLength) {
    text = text.substring(0, maxLength).trim() + "...";
  }
  
  return text;
}
