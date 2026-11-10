const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { test } = require("node:test");
const dotenv = require("dotenv");

const script = path.join(__dirname, "validate-env.ts");
const register = require.resolve("ts-node/register/transpile-only");
const template = dotenv.parse(
  fs.readFileSync(path.join(__dirname, "../../env.example"))
);
const core = {
  SENDER_EMAIL: "sender@example.test",
  SENDER_EMAIL_PASSWORD: "test-password-never-log",
  SMTP_HOST: "smtp.example.test",
  EMAIL_SERVICE: "Gmail",
  SMTP_PORT: "465",
  ADMIN_RECEIVER_MAIL: "admin@example.test",
  enviroment: "production",
  TOKEN_SECRET_KEY: "test-signing-key-never-log",
  SECRET_KEY: "test-legacy-key",
  MONGODB_URI: "mongodb://localhost:27017",
  MONGODB_DB: "validation-test",
  REFRESH_SECRET_KEY: "test-refresh-key",
  GENERAL_SECRET_KEY: "a".repeat(32),
  INTERNAL_SECRET: "test-internal-key",
  NEXT_PUBLIC_SERVICE_SECRET: "test-public-key",
  production_url: "https://example.test",
};

function run({ variables = core, files = {}, nodeEnv = "production" } = {}) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "bes-env-test-"));
  try {
    for (const [name, contents] of Object.entries(files)) {
      fs.writeFileSync(path.join(directory, name), contents);
    }
    const env = { ...process.env };
    // Isolate fixtures from credentials or CMS settings on the developer machine.
    for (const key of Object.keys(template)) delete env[key];
    delete env.__NEXT_PROCESSED_ENV;
    delete env.NODE_ENV;
    env.FRONTEND_DEMO_MODE = "false";
    if (nodeEnv !== null) env.NODE_ENV = nodeEnv;
    for (const [key, value] of Object.entries(variables)) {
      if (value === undefined) delete env[key];
      else env[key] = value;
    }
    env.TS_NODE_COMPILER_OPTIONS = JSON.stringify({
      module: "commonjs",
      moduleResolution: "node",
      esModuleInterop: true,
      target: "es2016",
    });
    const result = spawnSync(process.execPath, ["-r", register, script], {
      cwd: directory,
      env,
      encoding: "utf8",
      timeout: 15000,
    });
    if (result.error) throw result.error;
    return { status: result.status, output: result.stdout + result.stderr };
  } finally {
    assert.equal(path.dirname(path.resolve(directory)), path.resolve(os.tmpdir()));
    assert.ok(path.basename(directory).startsWith("bes-env-test-"));
    fs.rmSync(directory, { recursive: true, force: true });
  }
}

test("Vercel-injected configuration passes without files, CMS, or local_url", () => {
  const result = run();
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /All required environment variables are set/);
  assert.doesNotMatch(result.output, /test-password-never-log|test-signing-key-never-log/);
});

test("missing settings fail with key names and Vercel instructions", () => {
  const result = run({ variables: { ...core, TOKEN_SECRET_KEY: undefined, MONGODB_URI: undefined } });
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /  - TOKEN_SECRET_KEY/);
  assert.match(result.output, /  - MONGODB_URI/);
  assert.match(result.output, /Project Settings > Environment Variables/);
  assert.doesNotMatch(result.output, /test-password-never-log|test-signing-key-never-log|at Object\./);
});

test("configuration in .env.local is loaded before validation", () => {
  const result = run({
    variables: {},
    files: { ".env.local": Object.entries(core).map(([key, value]) => `${key}=${value}`).join("\n") },
  });
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /Loaded environment files: .env.local/);
});

test("production file precedence is used even before NODE_ENV is set", () => {
  const result = run({
    variables: { ...core, TOKEN_SECRET_KEY: undefined },
    nodeEnv: null,
    files: {
      ".env.production.local": "TOKEN_SECRET_KEY=production-local-key",
      ".env.local": "TOKEN_SECRET_KEY=",
      ".env.production": "TOKEN_SECRET_KEY=",
      ".env": "TOKEN_SECRET_KEY=",
    },
  });
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /\.env.production.local/);
});

test("injected variables take precedence over empty file values", () => {
  const result = run({ files: { ".env.production.local": "TOKEN_SECRET_KEY=" } });
  assert.equal(result.status, 0, result.output);
});

test("Next.js variable expansion is supported", () => {
  const result = run({
    variables: { ...core, TOKEN_SECRET_KEY: undefined },
    files: { ".env.local": "TOKEN_SECRET_KEY=${VALIDATION_TEST_KEY}\nVALIDATION_TEST_KEY=test-expanded-key" },
  });
  assert.equal(result.status, 0, result.output);
});

test("whitespace-only values are rejected", () => {
  const result = run({ variables: { ...core, TOKEN_SECRET_KEY: "   " } });
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /  - TOKEN_SECRET_KEY/);
});

test("partial Contentful setup reports the missing CMS keys", () => {
  const result = run({ variables: { ...core, CONTENTFUL_SPACE_ID: "test-space" } });
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /  - CONTENTFUL_DELIVERY_ACCESS_TOKEN/);
  assert.match(result.output, /  - CONTENTFUL_PREVIEW_SECRET/);
});

test("complete Contentful setup passes", () => {
  const result = run({ variables: {
    ...core,
    CONTENTFUL_SPACE_ID: "test-space",
    CONTENTFUL_ENVIRONMENT: "master",
    CONTENTFUL_DELIVERY_ACCESS_TOKEN: "test-delivery",
    CONTENTFUL_PREVIEW_ACCESS_TOKEN: "test-preview",
    CONTENTFUL_PREVIEW_SECRET: "test-preview-secret",
  } });
  assert.equal(result.status, 0, result.output);
});

test("explicit development validation uses development files and local_url", () => {
  const result = run({
    variables: { ...core, production_url: undefined, enviroment: "development" },
    nodeEnv: "development",
    files: { ".env.development.local": "local_url=http://localhost:3000" },
  });
  assert.equal(result.status, 0, result.output);
});

test("the documented template includes every required deployment key", () => {
  for (const key of Object.keys(core)) {
    assert.ok(Object.hasOwn(template, key), `env.example is missing ${key}`);
  }
});

test("frontend demo builds without any backend credentials", () => {
  const result = run({ variables: { FRONTEND_DEMO_MODE: "true" } });
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /Frontend demo mode: using dummy credentials/);
  assert.doesNotMatch(result.output, /Environment validation failed/);
});

test("a deployment defaults to frontend demo without extra Vercel settings", () => {
  const result = run({ variables: { FRONTEND_DEMO_MODE: undefined } });
  assert.equal(result.status, 0, result.output);
  assert.match(result.output, /Frontend demo mode: using dummy credentials/);
});
