# Nuxt Minimal Starter

Look at the [Nuxt documentation](https://nuxt.com/docs/getting-started/introduction) to learn more.

## Setup

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Caching

| File |	Caching | Type |	Layer |
| server/api/projects.ts | 	HTTP Headers + Nitro Storage	| Server/Edge|
| nuxt.config.ts  (routeRules.headers) |	HTTP Cache Headers	| Edge|
| nuxt.config.ts  (routeRules.isr)|	ISR	| Edge/Static|
| nuxt.config.ts  (nitro.storage)|	Nitro Storage Config	| Server|
| app/components/content/ProjectList.vue | Payload Cache	| Client|
| app/pages/*.vue	| Payload | Cache	Client

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
