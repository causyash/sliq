const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');

/**
 * Utility to generate PDF using Puppeteer
 * Navigates to the local documentation URL and captures it as a PDF.
 */
async function generatePDF(baseUrl) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // Use correct URL:
    // If deployed -> use deployed URL
    // If local -> use http://localhost:PORT
    const url = baseUrl ? `${baseUrl}/docs/documentation2.html` : `http://localhost:${process.env.PORT || 5001}/docs/documentation2.html`;
    
    console.log(`📄 Puppeteer navigating to: ${url}`);
    
    // Add WAIT condition
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 90000 });

    // ADD extra wait for Mermaid rendering:
    await page.waitForSelector('.mermaid svg', { timeout: 15000 }).catch(() => console.log('No mermaid svg found or timeout.'));

    // Add delay:
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate PDF:
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
    });

    await browser.close();
    return pdfBuffer;
  } catch (error) {
    if (browser) await browser.close();
    throw error;
  }
}


/**
 * Route to preview the PDF in a new tab
 */
router.get('/preview-pdf', async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const pdfBuffer = await generatePDF(baseUrl);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'inline; filename="documentation.pdf"'
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error('❌ PDF Generation Error:', error);
    res.status(500).json({ error: 'Failed to generate PDF preview', details: error.message });
  }
});

/**
 * Route to trigger a direct download of the PDF
 */
router.get('/download-pdf', async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const pdfBuffer = await generatePDF(baseUrl);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="documentation.pdf"'
    });
    res.send(pdfBuffer);
  } catch (error) {
    console.error('❌ PDF Download Error:', error);
    res.status(500).json({ error: 'Failed to download PDF', details: error.message });
  }
});

module.exports = router;
