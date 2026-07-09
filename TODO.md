# Zameen360 - TODO

- [ ] Fix Render “No open ports detected” by ensuring Docker container starts the Express server and binds to Render’s `PORT`.
- [ ] Update `server/Dockerfile` CMD to run migrations (optional) and then start with `npm start` (so the container stays alive).
- [ ] Update `server/app.js` (if needed) to listen on `process.env.PORT` and ensure host `0.0.0.0`.
- [ ] Verify with a local Docker run and check listening port.
