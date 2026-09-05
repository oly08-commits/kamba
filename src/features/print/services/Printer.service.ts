import {
  Printer,
  PrinterConnectionOptions,
  PrinterStatus,
} from "../types/printer";

import { Ticket } from "../types/ticket";

export interface PrintTextOptions {
  align?: "LEFT" | "CENTER" | "RIGHT";

  size?: "SMALL" | "NORMAL" | "LARGE" | "XLARGE" | number;

  bold?: boolean;

  underline?: boolean;

  fontType?: "A" | "B" | "C";

  italic?: boolean;

  strikethrough?: boolean;

  doubleStrike?: boolean;

  invert?: boolean;

  rotate?: 0 | 90 | 180 | 270;
}

export interface PrintImageOptions {
  width?: number;
  height?: number;

  align?: "LEFT" | "CENTER" | "RIGHT";

  threshold?: number;

  dithering?: boolean;
}

export interface PrintQRCodeOptions {
  size?: number;

  align?: "LEFT" | "CENTER" | "RIGHT";

  errorLevel?: "L" | "M" | "Q" | "H";

  model?: 1 | 2;
}

export interface PrinterService {
  discover(): Promise<Printer[]>;

  getDevices(): Promise<Printer[]>;

  connect(printer: Printer, options?: PrinterConnectionOptions): Promise<void>;

  disconnect(): Promise<void>;

  isConnected(): Promise<boolean>;

  getStatus(): Promise<PrinterStatus>;

  print(ticket: Ticket): Promise<void>;

  printText(text: string, options?: PrintTextOptions): Promise<void>;

  printImage(base64: string, options?: PrintImageOptions): Promise<void>;

  printQRCode(data: string, options?: PrintQRCodeOptions): Promise<void>;

  cutPaper(): Promise<void>;

  openCashDrawer(): Promise<void>;
}
