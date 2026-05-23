
# Repository local access

http://localhost:5173/ only works while your local development server is running

Intrcutions:
    In VS Code, open your project folder
    Then open a terminal, make sure the terminal path ends wwhete the html index is
    In PowerShelle
        cd "C:\Users\calv2\OneDrive\CAA\Muuva\Web site\my-landing-page"
        npm run dev
    Ready >> Local: http://localhost:5173/

# Version control
git hub repo: https://github.com/calv200/muuva

- Changes
    1. Before asking Codex for changes
    `git status`
    expected: nothing to commit, working tree clean
    2. Ask Codex for the change
    For example: Improve the spacing and typography of the product purchase section.
    Do not make structural changes and do not update PROJECT_BRIEF.md.
    3. Review the website
        - Open the local preview
        - Check what changes in Git `git status` (or click the Source Control icon in VS)
    4. Approved result, save and upload it   
         `git add`
         `git commit -m "Improve product section spacing and typography"`
         `git push`
    5. if Codex change is not good
        `git status`
        `git restore`





# Codex changes

Spacing, small styling fix, minor responsive adjustment
    Code only

Permanent structural change, such as removing the header or adding a new section
    Code + PROJECT_BRIEF.md

Change in visible text, product description, CTA or Amazon URL\
    Code + CONTENT.md

Temporary design experiment
    Code only; do not update the brief yet

    
