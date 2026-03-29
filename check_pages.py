import re

with open('/Users/yash/Desktop/Home/sliq/docs/documentation2.html', 'r') as f:
    content = f.read()

# Each page should start with <div class="page" and end with </div> matched at the same level.
# This simple regex just counts.
openings = len(re.findall(r'<div class="page', content))
page_borders = len(re.findall(r'<div class="page-border"></div>', content))
footers = len(re.findall(r'<div class="page-footer-container">', content))

print(f"Openings: {openings}")
print(f"Borders: {page_borders}")
print(f"Footers: {footers}")

# Let's check for pages missing footers.
import html.parser
class PageParser(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.depth = 0
        self.pages = []
        self.current_page = None

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        if tag == 'div' and 'class' in attrs_dict and 'page' in attrs_dict['class'].split():
            self.current_page = {'start': self.getpos(), 'content': []}
            self.depth = 1
        elif self.current_page:
            if tag == 'div':
                self.depth += 1
            self.current_page['content'].append((tag, attrs_dict))

    def handle_endtag(self, tag):
        if self.current_page:
            if tag == 'div':
                self.depth -= 1
            if self.depth == 0:
                self.current_page['end'] = self.getpos()
                self.pages.append(self.current_page)
                self.current_page = None

parser = PageParser()
parser.feed(content)

print(f"Parsed pages: {len(parser.pages)}")
for i, p in enumerate(parser.pages):
    has_footer = any(tag == 'div' and 'class' in attrs and 'page-footer-container' == attrs['class'] for tag, attrs in p['content'])
    footer_val = next((None for tag, attrs in p['content'] if 'page-footer-container' == attrs.get('class')), "NONE")
    # Actually, the parser doesn't get the content of the footer easily.
    print(f"Page {i+1} (starts at {p['start']}): {'HAS FOOTER' if has_footer else 'NO FOOTER'}")
