const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    let browser;
    try {
        browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--disable-setuid-sandbox'] });
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 900 });

        console.log("Navigating to signup...");
        await page.goto('https://project-sliq.vercel.app/signup', { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(r => setTimeout(r, 2000));
        await page.screenshot({ path: 'signup.png' });
        console.log("Saved signup.png");

        console.log("Navigating to login...");
        await page.goto('https://project-sliq.vercel.app/login', { waitUntil: 'networkidle2', timeout: 60000 });
        await page.type('input[type="email"]', 'sliq@projectmanager.com');
        await page.type('input[type="password"]', 'sliq6969');
        await page.click('button[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(r => setTimeout(r, 3000));

        console.log("Navigating to calendar...");
        await page.goto('https://project-sliq.vercel.app/calendar', { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(r => setTimeout(r, 4000));
        await page.screenshot({ path: 'calendar.png' });
        console.log("Saved calendar.png");

        console.log("Navigating to analytics...");
        await page.goto('https://project-sliq.vercel.app/analytics', { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(r => setTimeout(r, 4000));
        await page.screenshot({ path: 'analytics.png' });
        console.log("Saved analytics.png");

        console.log("Navigating to meetings...");
        await page.goto('https://project-sliq.vercel.app/meetings', { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(r => setTimeout(r, 4000));
        await page.screenshot({ path: 'meetings.png' });
        console.log("Saved meetings.png");

    } catch(e) { console.error(e); } finally { if(browser) await browser.close(); }
})();
