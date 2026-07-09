# TODO - zameen360

## Step 1: Investigate Render failure

- [ ] Locate Render configuration files (render.yaml/render.json/blueprint) and any references to `.server` or build root.
- [ ] Confirm how Render build context is set (root directory + Dockerfile path).

## Step 2: Fix Render/production runtime mismatch

- [ ] Update `server/Dockerfile` to use production-safe startup (`npm start` / `node app.js`) instead of `npm run dev`.
- [ ] Remove redundant installs/generate steps that may break Docker/Render builds.

## Step 3: Ensure client uses environment variable for backend URL

- [ ] Verify all client API calls use `import.meta.env.VITE_API_URL` / `VITE_API_BASE_URL` via `client/src/shared/config/api.ts`.
- [ ] Remove any remaining hardcoded backend URLs (e.g. localhost:5000).

## Step 4: Validate

- [ ] Build Docker locally for backend and run `npm run dev`/`npm start` as appropriate.
- [ ] Re-deploy to Render and confirm build passes and service starts.
