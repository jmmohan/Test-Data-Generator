# MCP Test Data Generator

Synthetic test-data generator for AT&T user, agent and other journeys, driven by Model-Context-Protocol JSON schemas.

## Features

* ⚡ **Fast synthetic output** using `json-schema-faker` + `faker`.
* 🔌 **Template-based** – drop a JSON file in `templates/` to add new journeys.
* 📤 **Pluggable exporters** – currently CSV, easily extendable.
* 🌐 **Web UI** – trigger generation and download the file from your browser.
* 🔧 **Configurable volume** – generate any number of records per run via API/UI.
* 🛡 **Synthetic-only** – no real PII passes through the system.

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. (optional) develop with live reload
yarn dev  # or npm run dev

# 3. Build and run in production mode
npm run build
npm start
```

The service starts on <http://localhost:3000>. Open it in your browser, choose a template, volume and format, then download the generated file.

## Template authoring

Add JSON files to the `templates/` directory. Each template must contain at least:

```json5
{
  "name": "user-journey",       // unique slug
  "description": "Login & purchase flows",  // optional
  "schema": { /* valid Draft-07 JSON Schema */ }
}
```

`json-schema-faker` is used under the hood, so you can sprinkle `faker` helpers inside the schema:

```json5
{
  "type": "string",
  "faker": "internet.email"
}
```

## Extending output formats

Implement the `OutputFormatHandler` interface in `src/models.ts`, register it in `src/server.ts` and provide a MIME type.

## Tests

```bash
npm test
```

Unit tests live in `__tests__/` (left for you to expand).

## License

MIT © 2023 
