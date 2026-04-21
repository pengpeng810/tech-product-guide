import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const cwd = process.cwd();
const root = cwd.endsWith("ai-recorder-guide") || cwd.endsWith("科技对比站")
  ? path.resolve("site")
  : path.resolve("ai-recorder-guide/site");

const requiredPages = [
  "index.html",
  "ai-recorders/index.html",
  "future-comparisons/index.html",
  "methodology/index.html",
  "ticnote/index.html",
  "ticnote/specs/index.html",
  "ticnote-vs-plaud-note/index.html",
  "ticnote-vs-plaud-notepin/index.html",
  "best-ai-voice-recorder-meetings-calls/index.html",
  "ticnote-faq/index.html",
  "best-ai-recorder/index.html",
  "plaud-note-alternatives/index.html",
  "ai-recorder-privacy/index.html",
  "ticnote-vs-smartphone-recorder/index.html",
  "best-ai-recorder-for-students/index.html",
  "best-ai-recorder-for-sales-calls/index.html",
  "best-ai-meeting-note-takers/index.html",
  "best-ai-recorder-for-in-person-meetings/index.html",
  "ai-recorder-with-summary-translation/index.html",
];

const requiredSiteFiles = [
  "robots.txt",
  "sitemap.xml",
  "llms.txt",
];

const requiredSnippets = [
  "Tech Product Guide",
  "GEO Citation Block",
  "application/ld+json",
  "Independent public-source guide",
];

const failures = [];

for (const page of requiredPages) {
  try {
    const html = await readFile(path.join(root, page), "utf8");
    if (!html.includes("<title>")) failures.push(`${page}: missing title`);
    if (!html.includes('rel="canonical"')) failures.push(`${page}: missing canonical`);
    if (!html.includes("og:title")) failures.push(`${page}: missing Open Graph metadata`);
    if (!html.includes("https://images.unsplash.com/")) failures.push(`${page}: missing image asset`);
    if (html.includes('href="/') || html.includes('src="/')) {
      failures.push(`${page}: internal links must be relative so local file preview works`);
    }
    for (const snippet of requiredSnippets) {
      if (!html.includes(snippet)) failures.push(`${page}: missing "${snippet}"`);
    }
  } catch (error) {
    failures.push(`${page}: ${error.code ?? error.message}`);
  }
}

try {
  const css = await readFile(path.join(root, "assets/styles.css"), "utf8");
  if (css.includes("linear-gradient") && css.includes("purple")) {
    failures.push("assets/styles.css: avoid purple gradient theme");
  }
  if (!css.includes("@media")) failures.push("assets/styles.css: missing responsive rules");
} catch (error) {
  failures.push(`assets/styles.css: ${error.code ?? error.message}`);
}

try {
  const pages = await readdir(root, { recursive: true });
  const htmlCount = pages.filter((file) => file.endsWith("index.html")).length;
  if (htmlCount < requiredPages.length) failures.push(`expected at least ${requiredPages.length} index pages, found ${htmlCount}`);
} catch (error) {
  failures.push(`site tree: ${error.code ?? error.message}`);
}

for (const file of requiredSiteFiles) {
  try {
    const body = await readFile(path.join(root, file), "utf8");
    if (!body.includes("Tech Product Guide")) failures.push(`${file}: missing site name`);
  } catch (error) {
    failures.push(`${file}: ${error.code ?? error.message}`);
  }
}

if (failures.length > 0) {
  console.error("Site check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Site check passed for ${requiredPages.length} pages.`);
