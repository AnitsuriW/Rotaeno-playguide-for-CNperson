const fs = require('fs');
const path = require('path');
const markdownIt = require('markdown-it');
const puppeteer = require('puppeteer');

const md = new markdownIt();

const inputFile = '../一些小型的 Q&A(Remake).md';
const outputFile = '../一些小型的 Q&A(Remake).png';

(async () => {
  const markdown = fs.readFileSync(inputFile, 'utf-8');
  const markdownHtml = md.render(markdown);

  const cssPath = path.resolve(__dirname, 'node_modules/github-markdown-css/github-markdown.css');
  const githubMarkdownCSS = fs.readFileSync(cssPath, 'utf-8');

  const fullHtml = `
  <html>
    <head>
      <style>${githubMarkdownCSS}</style>
      <style>
        body {
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
        }
        .markdown-body {
          box-sizing: border-box;
          max-width: 828px;
          width: 100%;
          padding: 30px;
        }
      </style>
    </head>
    <body>
      <article class="markdown-body">
        ${markdownHtml}
      </article>
    </body>
  </html>
  `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // ✅ 设置视口 + 高 DPI
  await page.setViewport({
    width: 828,
    height: 800,
    deviceScaleFactor: 2 // 或 3 更清晰
  });

  await page.setContent(fullHtml, { waitUntil: 'networkidle0' });

  // ✅ 截图整个页面，高 DPI 生效
  await page.screenshot({
    path: outputFile,
    fullPage: true
  });

  await browser.close();

  console.log(`✅ 高清整页 PNG 文件已生成：${outputFile}`);
})();
