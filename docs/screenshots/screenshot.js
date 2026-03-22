const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    let browser;
    try {
        browser = await puppeteer.launch({ 
            headless: 'new', // Or true
            args: ['--no-sandbox', '--disable-setuid-sandbox'] 
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 900 });

        // 1. Dashboard (which redirects to Login first)
        console.log("Navigating to https://project-sliq.vercel.app");
        await page.goto('https://project-sliq.vercel.app', { waitUntil: 'networkidle2', timeout: 60000 });
        
        await new Promise(r => setTimeout(r, 2000));
        // We should be at login
        await page.screenshot({ path: 'login.png' });
        console.log("Login screenshot saved as login.png");

        // LOGIN USER: dev
        const devEmail = 'sliq@developer.com';
        const devPass = 'sliq6969';
        await page.type('input[type="email"]', devEmail);
        await page.type('input[type="password"]', devPass);
        await page.click('button[type="submit"]');

        console.log("Submitted login... waiting for dashboard");
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(r => setTimeout(r, 3000));

        await page.screenshot({ path: 'dashboard.png' });
        console.log("Dashboard screenshot saved as dashboard.png");

        // Let's click on the first project OR go to project view
        const projectLinks = await page.$$('a[href^="/project/"]');
        if (projectLinks.length > 0) {
            console.log("Found project link, clicking...");
            await projectLinks[0].click();
            await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
            await new Promise(r => setTimeout(r, 3000));
            await page.screenshot({ path: 'project_board.png' });
            console.log("Project board screenshot saved as project_board.png");

            // Look for tasks to click
            const taskCards = await page.$$('div[draggable="true"]');
            if(taskCards.length > 0) {
                console.log("Found task card, clicking...");
                await taskCards[0].click();
                await new Promise(r => setTimeout(r, 2000));
                await page.screenshot({ path: 'task_view.png' });
                console.log("Task view screenshot saved as task_view.png");
            } else {
                console.log("No tasks found on this board.");
            }
        } else {
            console.log("No project links found.");
        }

        // Now we need Admin panel. First, let's logout
        console.log("Logging out...");
        // Look for layout logout. Might be text "Logout" or a button. Let's just clear localStorage and reload.
        await page.evaluate(() => { localStorage.clear(); });
        await page.goto('https://project-sliq.vercel.app/login', { waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(r => setTimeout(r, 2000));

        // LOGIN ADMIN: project manager
        console.log("Logging in as project manager...");
        await page.type('input[type="email"]', 'sliq@projectmanager.com');
        await page.type('input[type="password"]', 'sliq6969');
        await page.click('button[type="submit"]');

        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
        await new Promise(r => setTimeout(r, 3000));

        // Admin might have specific views. Let's look for Admin panel or similar.
        const adminLinks = await page.$$('a[href^="/admin"]');
        if (adminLinks.length > 0) {
             console.log("Found admin link, clicking...");
             await adminLinks[0].click();
             await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
             await new Promise(r => setTimeout(r, 3000));
             await page.screenshot({ path: 'admin_panel.png' });
             console.log("Admin panel screenshot saved as admin_panel.png");
        } else {
            console.log("No admin link found, just taking PM screenshot.");
            await page.screenshot({ path: 'admin_panel.png' });
            console.log("Screenshot saved as admin_panel.png (fallback)");
        }

    } catch (e) {
        console.error("Error running puppeteer script:", e);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
})();
