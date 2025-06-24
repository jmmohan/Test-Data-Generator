import { JSONSchema7 } from "json-schema";

export interface JourneyTemplate {
  /** Unique name (slug) of the journey */
  name: string;
  /** Human-readable description */
  description?: string;
  /** JSON Schema describing a single record in this journey */
  schema: JSONSchema7;
}

export interface GenerateRequest {
  templateName: string;
  volume: number;
  format: SupportedFormat;
}

export type SupportedFormat = "csv" | "json";

export interface OutputFormatHandler {
  /** Short id e.g. `csv` */
  readonly format: SupportedFormat;
  /** Serialise the given data into a Buffer or string depending on the handler */
  export(dataset: unknown[]): Buffer | string;
  /** File extension without leading dot */
  extension(): string;
} 