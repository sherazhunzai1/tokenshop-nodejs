const asyncHandler = require('../utils/asyncHandler');
const path = require('path');

const generateImage = asyncHandler(async (req, res, next) => {
  const { content: htmlContent } = req.body;
  if (!htmlContent) {
    return next({ code: 400, message: 'No Request Found' });
  }

  const puppeteer = require('puppeteer');
  const baseUrl = process.env.DEVELOPMENT_BASE_URL || './';
  const imageName = `${Date.now()}.png`;
  const outputPath = path.join(baseUrl, 'public/images/nfts', imageName);

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 550, height: 450 });
  await page.setContent(htmlContent);
  await page.screenshot({ path: outputPath });
  await browser.close();

  return res.status(200).json({ image: imageName });
});

module.exports = { generateImage };
