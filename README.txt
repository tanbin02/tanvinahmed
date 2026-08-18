HOW TO EDIT YOUR PORTFOLIO
===========================

All the content lives in index.html. Search for anything in [brackets]
or marked "[Replace this..." — those are placeholders for your real info.

Quick checklist:
1. index.html <title> tag + hero section → your real name & tagline
2. #about section → your bio, city, years of experience
3. #work section → your 4 real projects (title, description, tags, links,
   and swap the gradient placeholder in .project-media for a real image:
   add <img src="your-image.jpg"> inside that div)
4. #skills section → adjust skill names & percentages to match you
5. #contact section → point the socials links to your real profiles

To make the contact form actually send messages, connect it to a
Google Sheet — see "CONNECT THE CONTACT FORM" section below.

To open the site: just double-click index.html, or open the folder in
VS Code and use the "Live Server" extension for auto-reload while editing.

CONNECT THE CONTACT FORM TO A SPREADSHEET (free, ~5 min)
==========================================================
Right now the contact form just shows a message — it isn't
connected anywhere yet. To make every submission land in a
Google Sheet (Excel-style):

1. Create a Google Sheet. In row 1, add these column headers:
   name | email | message | date
2. Go to https://sheetdb.io and sign up (free tier is enough).
3. Click "Create API", connect it to your Google Sheet.
4. Copy the API URL it gives you — looks like:
   https://sheetdb.io/api/v1/xxxxxxxxxxxxx
5. Open script.js, find this line near the top of the
   "CONTACT FORM" section:
     const SHEETDB_API_URL = '';
   Paste your URL between the quotes.

That's it — every form submission will now appear as a new row
in your Google Sheet automatically.

ADDING YOUR REAL SOCIAL LINKS
==============================
In index.html, find the <div class="socials"> block near the
Contact section. Your email is already linked. Replace the
href="#" on the linkedin / dribbble / behance links with your
real profile URLs.

ADDING PROJECTS
================
In index.html, look for the HTML comment "ADD YOUR PROJECTS HERE"
right above the project list. Copy one whole
<article class="project-card">...</article> block, paste it
in the list, and edit the title, description, tags, colors, and
link for your new project.

Files:
- index.html   → structure & content
- style.css    → the dark/matrix design system (colors are CSS variables
                  at the top of the file under :root — change --green,
                  --bg etc. to retheme everything at once)
- script.js    → typing effect, matrix rain, scroll animations, form
