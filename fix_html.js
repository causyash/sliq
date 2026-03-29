const fs = require('fs');
const cheerio = require('cheerio');
const file = './docs/documentation2.html';
const html = fs.readFileSync(file, 'utf8');
const $ = cheerio.load(html, { decodeEntities: false });

// Exclusion Rule: No headers/footers on Cover, Certificate, or Chapter divider pages.
// Cover (No border/num)
$('.cover-page').find('.page-border').remove();
$('.cover-page').find('.page-header').remove();
$('.cover-page').find('.page-header-text').remove();

// Certificate
// Certificate doesn't have a specific class, let's find it by content
$('.page').each((i, el) => {
    const text = $(el).text();
    if (text.includes('CERTIFICATE') && text.includes('successfully completed')) {
        $(el).find('.page-header').remove();
        $(el).find('.page-header-text').remove();
    }
    
    // Chapter dividers
    if ($(el).find('.chapter-jump').length > 0) {
        $(el).find('.page-header').remove();
        $(el).find('.page-header-text').remove();
        $(el).find('.page-footer-container').remove(); // Just in case
        $(el).addClass('chapter-start');
    }
});

// Explicit dividers logic - ensuring logical chapters are wrapped if needed.
// Abstract insertion if not present
if (!html.includes('<!-- 3.5. ABSTRACT -->')) {
    const abstractHtml = `
    <!-- 3.5. ABSTRACT -->
    <div class="page">
        <div class="page-border"></div>
        <h2 style="text-align: center; margin-top: 30mm;">ABSTRACT</h2>
        <div class="content-body" style="margin-top: 20mm;">
            <p>The "Sliq" project introduces a modern, real-time project management platform tailored for dynamic, agile teams. Combining the robust capabilities of the MERN stack (MongoDB, Express, React, Node.js) with real-time Socket.io features, Sliq offers an enterprise-level synchronization of kanban boards, tasks, and communications. The platform architecture incorporates independent workspaces, comprehensive analytics, and seamless Jitsi video conferencing—mitigating the fragmentation common in traditional management tools. This dissertation covers the system's design, requirement specifications, entity relationships, and testing protocols, serving as a complete architectural documentation of the project.</p>
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

// Add page numbering (if needed) - wait, it's manually numbered 1, 2, 3..
// I'll leave manual numbers for now, or ensure they exist. The prompt says "starting from Page 1 at the Introduction".

fs.writeFileSync(file, $.html());
