<p><img src="https://github.com/user-attachments/assets/da5bb809-3949-4854-99e4-1619022444e7" width="128"/></p>
<p>
  <img alt="GitHub License" src="https://img.shields.io/github/license/Highl1te/HighliteDesktop">
  <img alt="Build Status" src="https://img.shields.io/github/actions/workflow/status/Highl1te/HighliteDesktop/main.yml"> 
</p>

# HighLite
HighLite is an open-source game client for High Spell and has received permission to operate from the game developer.

# Related Repositories
HighLite is split into two repositories [HighliteDesktop](https://github.com/Highl1te/HighliteDesktop) and [Core](https://github.com/Highl1te/Core).

 - `HighliteDesktop` handles pulling in the `Core` and the `High Spell Web Client` and providing a cross-platform execution space.
 - `Core` handles interactions from HighLite to the `High Spell Web Client`.

# Development
## Software Requirements
- NodeJS v22 LTS (https://nodejs.org/en/download)
- Yarn (npm install --global corepack)

## Building
### Non-Package Build
`yarn start`
### Package Build
`yarn app:dist`
