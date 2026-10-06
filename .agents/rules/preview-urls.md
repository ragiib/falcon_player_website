# Implementation Prompts & Preview URLs Rule

Whenever generating or preparing an implementation prompt for Antigravity:

### Preview URLs Requirement
Every implementation prompt must include the following requirement:

```markdown
### Preview URLs

After implementing the requested feature, Antigravity must start/maintain the local development server and provide me with:

* **PC/Desktop preview URL** — the localhost URL, for example `http://localhost:5173`
* **Smartphone preview URL** — the LAN/network URL that I can open from my phone while connected to the same Wi-Fi, for example `http://192.168.x.x:5173`

I will personally open these URLs and test the website on my PC and smartphone.

Do **not** instruct Antigravity to open Chrome or perform extensive browser testing itself. Its responsibility is implementation, fixing necessary technical issues, keeping the dev server running, and providing the preview URLs.

Always make sure the implementation prompt reminds Antigravity to provide both preview URLs at the end.
```
