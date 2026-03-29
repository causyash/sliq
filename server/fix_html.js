const fs = require('fs');
const cheerio = require('cheerio');

const file = '../docs/documentation2.html';
const html = fs.readFileSync(file, 'utf8');
const $ = cheerio.load(html, { decodeEntities: false });

// 1. Exclusion Rule: No headers/footers on Cover, Certificate, or Chapter divider pages.

// Cover (No border/num)
$('.cover-page').find('.page-border').remove();
$('.cover-page').find('.page-header').remove();
$('.cover-page').find('.page-header-text').remove();
$('.cover-page').find('.page-footer-container').remove();

// Process each page
$('.page').each((i, el) => {
    const text = $(el).text();
    
    // Certificate doesn't have a specific class, let's find it by content
    if (text.includes('CERTIFICATE') && text.includes('successfully completed')) {
        $(el).find('.page-header').remove();
        $(el).find('.page-header-text').remove();
        $(el).find('.page-footer-container').remove();
    }
    
    // Chapter dividers
    if ($(el).find('.chapter-jump').length > 0) {
        $(el).find('.page-header').remove();
        $(el).find('.page-header-text').remove();
        $(el).find('.page-footer-container').remove();
        
        // Add chapter-start class to ensure page-break-before: always
        $(el).addClass('chapter-start');
    }
    
    // Check if this page is a logical chapter that should have page-break
    // Wait, `.chapter-start` CSS class takes care of the strict print break.
});

// Explicit dividers logic - ensuring logical chapters are wrapped if needed.
// Abstract insertion if not present
if (!html.includes('<!-- ABSTRACT -->')) {
    const abstractHtml = `
    <!-- ABSTRACT -->
    <div class="page">
        <div class="page-border"></div>
        <h2 style="text-align: center; margin-top: 30mm;">ABSTRACT</h2>
        <div class="content-body" style="margin-top: 20mm;">
            <p style="font-size: 13pt; line-height: 1.8;">The "Sliq" project introduces a modern, real-time project management platform tailored for dynamic, agile teams. Combining the robust capabilities of the MERN stack (MongoDB, Express, React, Node.js) with real-time Socket.io features, Sliq offers an enterprise-level synchronization of kanban boards, tasks, and communications. The platform architecture incorporates independent workspaces, comprehensive analytics, and seamless Jitsi video conferencing—mitigating the fragmentation common in traditional management tools.</p>
            <p style="font-size: 13pt; line-height: 1.8;">This dissertation covers the system's design, requirement specifications, entity relationships, and testing protocols, serving as a complete architectural documentation of the project. A significant emphasis has been placed on high-latency tolerance, optimized data schemas tailored for collaborative scaling, and a zero-training user interface using advanced Framer Motion interactions.</p>
        </div>
    </div>
`;
    // Find acknowledgement and insert after it
    $('.page').each((i, el) => {
        if ($(el).text().includes('ACKNOWLEDGEMENT') && $(el).text().includes('profound gratitude')) {
            $(el).after(abstractHtml);
        }
    });
}

// Write the formatted HTML back to the file
fs.writeFileSync(file, $.html());
console.log('Successfully updated HTML document according to prompt specifications.');
