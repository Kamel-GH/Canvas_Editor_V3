const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  // Client Sentry initialization is intentionally deferred until the package
  // is available in the runtime tree. The declared dependency remains in
  // package.json and this file is the integration hook.
}
