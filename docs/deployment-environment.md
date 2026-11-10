# Deployment environment setup

## Frontend demo (default)

This checkout builds a frontend demo by default with dummy credentials. Run
`yarn build`, or redeploy in Vercel, without adding database or secret values.
If `FRONTEND_DEMO_MODE` is already configured in Vercel, set it to `true` for
this preview. Public pages use the existing static content and assets.

Database access, email, login, registration, booking submissions, CMS/AWS, and
visitor tracking are disabled in this mode. Backend endpoints return an explicit
demo message instead of pretending to save data. Admin and user routes redirect
to the public homepage.

## Enable the real backend

Set `FRONTEND_DEMO_MODE=false` in Vercel (or `.env.local`). The prebuild check
then requires the real settings below. Demo defaults do not apply in that mode.

## Vercel

1. Open the project in Vercel, then **Settings > Environment Variables**.
2. Add the keys from `env.example` with your actual configuration. Select
   **Production** for production deployments and **Preview** for preview builds.
   A local `.env.local` file is not uploaded to Vercel.
3. Set `enviroment=production` (the spelling is required by existing code),
   and `production_url` to the full URL of the site for that environment.
   `local_url` is not required for production builds.
4. Add `MONGODB_URI` from your MongoDB provider and `MONGODB_DB` for the existing
   database. Add the sender credentials, SMTP settings, and admin recipient.
5. Configure distinct values for `TOKEN_SECRET_KEY`, `SECRET_KEY`,
   `REFRESH_SECRET_KEY`, `GENERAL_SECRET_KEY`, and `INTERNAL_SECRET`.
   `TOKEN_SECRET_KEY` is the environment name used for JWT signing.
   Preserve existing secrets when redeploying an existing application.
   For a new installation, generate each value separately with:

   ```sh
   node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
   ```

   `GENERAL_SECRET_KEY` needs at least 32 ASCII characters for the existing
   AES-256 implementation. `NEXT_PUBLIC_SERVICE_SECRET` must also be configured
   for the existing browser payload contract; it is visible in the client
   bundle and must not reuse a server secret.
6. Leave all five Contentful configuration values empty if CMS is disabled.
   If any is set, configure all five keys listed together in `env.example`.
7. Redeploy after saving. The build log lists missing key names, never values.

Vercel environment changes apply to new deployments:
https://vercel.com/docs/environment-variables

## Local builds

Copy `env.example` to `.env.local` and fill in the real configuration, including
`production_url` for a production build. Then run:

```sh
yarn validate-env
yarn build
```

The checker uses Next.js environment loading: injected process variables take
priority, followed by `.env.production.local`, `.env.local`, `.env.production`,
and `.env`. Explicit `NODE_ENV=development` uses the development files and
requires `local_url` instead. See the [Next.js environment documentation](https://nextjs.org/docs/pages/guides/environment-variables).

Validation checks that settings are present; a passing check does not prove
MongoDB connectivity, email delivery, or an authenticated workflow.
