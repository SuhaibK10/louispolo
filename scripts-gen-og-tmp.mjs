import sharp from 'sharp'
import fs from 'fs'

const ROOT = '/Users/suhaibkhan/Downloads/louispolo 2'
const INK = '#1A1714'
const GOLD = '#C9A96E'
const PORCELAIN = '#F5F3ED'

// Tint the wordmark logo to ink color by injecting a fill attribute on the svg root
let logoSvg = fs.readFileSync(`${ROOT}/public/logo.svg`, 'utf-8')
logoSvg = logoSvg.replace('<svg id="Layer_1"', `<svg id="Layer_1" fill="${INK}"`)

const LOGO_W = 560
const LOGO_H = Math.round(LOGO_W * (400 / 600))

const logoBuffer = await sharp(Buffer.from(logoSvg), { density: 300 })
  .resize({ width: LOGO_W })
  .png()
  .toBuffer()

const TAGLINE = 'TRENDSETTERS IN LUGGAGE'
const taglineSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="50">
  <text x="600" y="34" text-anchor="middle"
    font-family="Georgia, 'Times New Roman', serif"
    font-size="22" letter-spacing="6" fill="${GOLD}">${TAGLINE}</text>
</svg>`
const taglineBuffer = await sharp(Buffer.from(taglineSvg)).png().toBuffer()

const GAP = 30
const totalH = LOGO_H + GAP + 34
const startY = Math.round((630 - totalH) / 2)
const logoTop = startY
const taglineTop = startY + LOGO_H + GAP

const canvas = sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 4,
    background: PORCELAIN,
  },
})

const out = await canvas
  .composite([
    { input: logoBuffer, left: Math.round((1200 - LOGO_W) / 2), top: logoTop },
    { input: taglineBuffer, left: 0, top: taglineTop },
  ])
  .png()
  .toBuffer()

fs.writeFileSync(`${ROOT}/public/og-image.png`, out)
console.log('written', out.length, 'bytes, logoH=', LOGO_H, 'startY=', startY)
