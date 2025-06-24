import { readFileSync, readdirSync } from "fs";
import path from "path";
import { JSONSchema7 } from "json-schema";
import jsf from "json-schema-faker";
import { JourneyTemplate } from "./models";
import { faker } from "@faker-js/faker";

/**
 * Registry that loads journey templates from the templates directory.
 */
export class TemplateRegistry {
  private templates: Map<string, JourneyTemplate> = new Map();

  constructor(private readonly templatesDir: string) {
    this.loadTemplates();
    jsf.extend("faker", () => faker);
    jsf.option({ alwaysFakeOptionals: true });
  }

  private loadTemplates() {
    const files = readdirSync(this.templatesDir).filter((f) => f.endsWith(".json"));
    files.forEach((file) => {
      const fullPath = path.join(this.templatesDir, file);
      const raw = JSON.parse(readFileSync(fullPath, "utf-8"));
      if (!raw.name || !raw.schema) {
        throw new Error(`Template ${file} must contain 'name' and 'schema' keys.`);
      }
      const template: JourneyTemplate = {
        name: raw.name,
        description: raw.description,
        schema: raw.schema as JSONSchema7,
      };
      this.templates.set(template.name, template);
    });
  }

  get(templateName: string): JourneyTemplate | undefined {
    return this.templates.get(templateName);
  }

  list(): JourneyTemplate[] {
    return Array.from(this.templates.values());
  }
}

export class DataGenerator {
  constructor(private readonly registry: TemplateRegistry) {}

  generate(templateName: string, volume: number): unknown[] {
    const template = this.registry.get(templateName);
    if (!template) {
      throw new Error(`Template '${templateName}' not found.`);
    }

    const { schema } = template;

    const data: unknown[] = [];
    for (let i = 0; i < volume; i++) {
      data.push(jsf.generate(schema));
    }
    return data;
  }
} 