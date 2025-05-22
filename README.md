<p><img src="https://github.com/user-attachments/assets/da5bb809-3949-4854-99e4-1619022444e7" width="128"/></p>

# HighLite
HighLite is an open-source game client for High Spell and has received permission to operate from the game developer.

# Project Layout
HighLite is split into two repositories: `Game Client` and `Core`.

`Core` is where interactions and hook-ins with the game source occur. The `Game Client` pulls in the latest version of `Core` on boot-up.

`Game Client` is this repository and is a simple Electron application that facilitates pulling in the `Core` and the `High Spell Web Client` and providing a sandboxed execution space.

# Contribution
TODO
