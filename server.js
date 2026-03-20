import 'dotenv/config'
import express from 'express'
import { google } from 'googleapis'
import fs from 'node:fs/promises'
import multer from 'multer'
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const app = express()
const port = Number(process.env.PORT || 3000)
const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || '1OAgIyCe1L-XmErvyQboWsieqJZZ7EQ9e_0Iidw7iV9g'
const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || './credentials.json'
const spacesRegion = process.env.SPACES_REGION || 'sgp1'
const spacesBucket = process.env.SPACES_BUCKET || ''
const spacesEndpoint = process.env.SPACES_ENDPOINT || `https://${spacesRegion}.digitaloceanspaces.com`
const spacesKey = process.env.SPACES_KEY || ''
const spacesSecret = process.env.SPACES_SECRET || ''
const spacesCdnBaseUrl = process.env.SPACES_CDN_BASE_URL || (spacesBucket ? `https://${spacesBucket}.${spacesRegion}.digitaloceanspaces.com` : '')
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } })

app.use(express.json({ limit: '2mb' }))

const spacesClient =
  spacesBucket && spacesKey && spacesSecret
    ? new S3Client({
        region: spacesRegion,
        endpoint: spacesEndpoint,
        credentials: {
          accessKeyId: spacesKey,
          secretAccessKey: spacesSecret,
        },
      })
    : null

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

function formatThaiDateTime(date = new Date()) {
  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium',
    timeStyle: 'medium',
    timeZone: 'Asia/Bangkok',
  }).format(date)
}

function formatThaiDate(dateValue) {
  if (!dateValue) return ''

  const date = new Date(dateValue)
  if (Number.isNaN(date.getTime())) {
    return String(dateValue)
  }

  return new Intl.DateTimeFormat('th-TH-u-ca-buddhist', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Bangkok',
  }).format(date)
}

function formatSheetText(value) {
  const text = String(value ?? '').trim()
  if (!text) return ''
  return `'${text}`
}

function sanitizeFileName(name) {
  return String(name || '')
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

async function uploadReceiptToSpaces(file, metadata = {}) {
  if (!spacesClient || !spacesBucket || !spacesCdnBaseUrl) {
    throw new Error('Spaces storage is not configured')
  }

  const extension = file.originalname.includes('.') ? file.originalname.slice(file.originalname.lastIndexOf('.')) : ''
  const baseName = sanitizeFileName(file.originalname.replace(extension, ''))
  const invoiceNumber = sanitizeFileName(metadata.invoiceNumber || 'no-invoice')
  const phone = sanitizeFileName(metadata.phone || 'no-phone')
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const objectKey = `kinto/bill/${timestamp}-${invoiceNumber}-${phone}-${baseName || 'receipt'}${extension}`

  await spacesClient.send(
    new PutObjectCommand({
      Bucket: spacesBucket,
      Key: objectKey,
      Body: file.buffer,
      ACL: 'public-read',
      ContentType: file.mimetype || 'application/octet-stream',
    }),
  )

  return `${spacesCdnBaseUrl}/${objectKey}`
}

app.post('/api/registrations', upload.single('receiptFile'), async (req, res) => {
  try {
    const body = req.body ?? {}
    const receiptUrl = req.file
      ? await uploadReceiptToSpaces(req.file, {
          invoiceNumber: body.invoiceNumber,
          phone: body.phone,
        })
      : ''

    const credentialsRaw = await fs.readFile(credentialsPath, 'utf8')
    const credentials = JSON.parse(credentialsRaw)

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId })
    const firstSheetTitle = spreadsheet.data.sheets?.[0]?.properties?.title

    if (!firstSheetTitle) {
      throw new Error('No worksheet found in spreadsheet')
    }

    const values = [[
      formatThaiDateTime(),
      body.fullName ?? '',
      body.address ?? '',
      body.province ?? '',
      formatSheetText(body.postalCode),
      body.email ?? '',
      formatSheetText(body.phone),
      body.dealerName ?? '',
      formatThaiDate(body.purchaseDate),
      body.tireModel ?? '',
      body.invoiceNumber ?? '',
      body.dotNumber ?? '',
      receiptUrl || body.receiptFileName || '',
      body.vehicleBrandModel ?? '',
      body.licensePlate ?? '',
      body.registrationProvince ?? '',
      body.acceptedTerms ? 'YES' : 'NO',
    ]]

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${firstSheetTitle}!A2:Q`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values },
    })

    res.json({ ok: true, receiptUrl })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Failed to append registration to Google Sheets:', error)
    res.status(500).json({
      ok: false,
      message: 'Failed to save registration',
      details: process.env.NODE_ENV === 'production' ? undefined : message,
    })
  }
})

app.listen(port, () => {
  console.log(`Kinto API listening on port ${port}`)
})
