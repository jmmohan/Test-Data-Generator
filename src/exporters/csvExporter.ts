import { OutputFormatHandler } from "../models";
import { format } from "fast-csv";
import { Writable } from "stream";

export class CsvExporter implements OutputFormatHandler {
  readonly format = "csv" as const;

  export(dataset: unknown[]): Buffer {
    const chunks: Buffer[] = [];

    const writable = new Writable({
      write(chunk, _enc, cb) {
        chunks.push(Buffer.from(chunk));
        cb();
      },
    });

    const csvStream = format({ headers: true });
    csvStream.pipe(writable);

    dataset.forEach((row) => csvStream.write(row));
    csvStream.end();

    return Buffer.concat(chunks);
  }

  extension(): string {
    return "csv";
  }
} 