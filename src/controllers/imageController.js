const asyncHandler = require('../utils/asyncHandler');

// Build HTML for NFT detail image (title + created date)
function buildNftDetailHtml(bgDataUri, name, createdDate) {
  return `
    <html><body style="margin:0;padding:0;width:550px;height:450px;position:relative;overflow:hidden;">
      <img src="${bgDataUri}" style="width:100%;height:100%;object-fit:cover;" />
      <div style="position:absolute;bottom:0;left:0;right:0;padding:20px;
        background:linear-gradient(transparent, rgba(0,0,0,0.8));color:#fff;font-family:Arial,sans-serif;">
        <div style="font-size:24px;font-weight:bold;margin-bottom:8px;">${name}</div>
        <div style="font-size:14px;opacity:0.8;">Created: ${createdDate}</div>
      </div>
    </body></html>`;
}

// Build HTML for social media image (social links)
function buildSocialHtml(bgDataUri, name, socials) {
  const links = [];
  if (socials.facebook) links.push(`<div style="margin:6px 0;">Facebook: ${socials.facebook}</div>`);
  if (socials.instagram) links.push(`<div style="margin:6px 0;">Instagram: ${socials.instagram}</div>`);
  if (socials.twitter) links.push(`<div style="margin:6px 0;">Twitter: ${socials.twitter}</div>`);

  return `
    <html><body style="margin:0;padding:0;width:550px;height:450px;position:relative;overflow:hidden;">
      <img src="${bgDataUri}" style="width:100%;height:100%;object-fit:cover;" />
      <div style="position:absolute;bottom:0;left:0;right:0;padding:20px;
        background:linear-gradient(transparent, rgba(0,0,0,0.8));color:#fff;font-family:Arial,sans-serif;">
        <div style="font-size:20px;font-weight:bold;margin-bottom:10px;">${name}</div>
        <div style="font-size:14px;">${links.join('')}</div>
      </div>
    </body></html>`;
}

// Build HTML for creator image (created by + username)
function buildCreatorHtml(bgDataUri, username) {
  return `
    <html><body style="margin:0;padding:0;width:550px;height:450px;position:relative;overflow:hidden;">
      <img src="${bgDataUri}" style="width:100%;height:100%;object-fit:cover;" />
      <div style="position:absolute;bottom:0;left:0;right:0;padding:20px;
        background:linear-gradient(transparent, rgba(0,0,0,0.8));color:#fff;font-family:Arial,sans-serif;">
        <div style="font-size:16px;opacity:0.8;">Created by</div>
        <div style="font-size:20px;font-weight:bold;margin-top:6px;word-break:break-all;">${username}</div>
      </div>
    </body></html>`;
}

const generateImage = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next({ code: 400, message: 'Background image is required' });
  }

  const { name, artist, type, facebook, instagram, twitter, createdDate } = req.body;
  const imageType = type || 'nft'; // 'nft' | 'social' | 'creator'

  // Convert uploaded image buffer to base64 data URI
  const base64 = req.file.buffer.toString('base64');
  const mimeType = req.file.mimetype;
  const bgDataUri = `data:${mimeType};base64,${base64}`;

  let htmlContent;
  switch (imageType) {
    case 'social':
      htmlContent = buildSocialHtml(bgDataUri, name || '', { facebook, instagram, twitter });
      break;
    case 'creator':
      htmlContent = buildCreatorHtml(bgDataUri, artist || name || '');
      break;
    case 'nft':
    default:
      htmlContent = buildNftDetailHtml(bgDataUri, name || '', createdDate || new Date().toLocaleDateString());
      break;
  }

  const puppeteer = require('puppeteer');

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 550, height: 450 });
  await page.setContent(htmlContent, { waitUntil: 'load' });
  const imageBuffer = await page.screenshot({ type: 'png' });
  await browser.close();

  res.set('Content-Type', 'image/png');
  return res.status(200).send(imageBuffer);
});

module.exports = { generateImage };
