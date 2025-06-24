import express from "express";
import path from "path";
import { DataGenerator, TemplateRegistry } from "./generator";
import { CsvExporter } from "./exporters/csvExporter";
import { GenerateRequest, SupportedFormat, OutputFormatHandler } from "./models";

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());

// Registry & generator instances
const templatesDir = path.join(__dirname, "../templates");
const registry = new TemplateRegistry(templatesDir);
const generator = new DataGenerator(registry);

// Output exporters registry
const exporters = new Map<SupportedFormat, OutputFormatHandler>();
const csvExporter = new CsvExporter();
exporters.set(csvExporter.format, csvExporter);

app.get("/api/templates", (_req, res) => {
  res.json(registry.list());
});

app.post("/api/generate", (req, res) => {
  try {
    const body: GenerateRequest = req.body;
    if (!body.templateName || !body.volume || !body.format) {
      return res.status(400).json({ message: "templateName, volume and format are required" });
    }

    const data = generator.generate(body.templateName, body.volume);

    const exporter = exporters.get(body.format);
    if (!exporter) {
      return res.status(400).json({ message: `Unsupported format '${body.format}'` });
    }

    const fileContent = exporter.export(data);
    const filename = `${body.templateName}-${Date.now()}.${exporter.extension()}`;

    res.setHeader("Content-Disposition", `attachment; filename=\"${filename}\"`);
    res.setHeader("Content-Type", "text/csv");
    res.send(fileContent);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message ?? "Internal Server Error" });
  }
});

// Serve static UI
app.use(express.static(path.join(__dirname, "../public")));

app.listen(PORT, () => {
  console.log(`🚀 MCP Test Data Generator listening on http://localhost:${PORT}`);
}); 