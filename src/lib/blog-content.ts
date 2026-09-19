export type BlogSection = { title: string; body: string };

export function parsePostContent(content: string): BlogSection[] {
  return content
    .trim()
    .split(/\n\s*\n(?=## )/)
    .map((block) => {
      const [heading, ...body] = block.trim().split("\n");
      return { title: heading.replace(/^##\s+/, "").trim(), body: body.join("\n").trim() };
    })
    .filter((section) => section.title && section.body);
}
