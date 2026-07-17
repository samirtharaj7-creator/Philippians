# Philippians Commentary deployment

The production site is configured for:

`https://philippians.mybibleexplorer.com`

The project uses a static Next.js export. A push to `main` validates the
content, runs TypeScript and lint checks, builds the `out/` directory, and
deploys that directory through GitHub Pages.

## One-time GitHub setup

1. Create the GitHub repository and push this project to its `main` branch.
2. In **Settings → Pages**, select **GitHub Actions** as the publishing source.
3. Set the Pages custom domain to `philippians.mybibleexplorer.com`.
4. At the DNS provider for `mybibleexplorer.com`, add:

   | Type | Host | Target |
   | --- | --- | --- |
   | CNAME | `philippians` | `samirtharaj7-creator.github.io` |

5. After GitHub provisions the certificate, enable **Enforce HTTPS**.

## Local production check

```bash
npm ci
npm run validate
npm run typecheck
npm run lint
NEXT_PUBLIC_SITE_URL=https://philippians.mybibleexplorer.com npm run build
```

The generated `out/` directory must contain the home page, introduction,
404 page, `.nojekyll`, `CNAME`, and all four chapter pages under
`out/philippians/`.
