const dsn = process.env.SENTRY_DSN;

if (dsn) {
  // Edge Sentry initialization is intentionally deferred until the package
  // is available in the runtime tree. The declared dependency remains in
  // package.json and this file is the integration hook.
}
