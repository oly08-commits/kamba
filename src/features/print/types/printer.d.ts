export type PrinterConnectionType = "BLUETOOTH" | "USB" | "WIFI" | "ETHERNET";

export type PrinterEncoding = "UTF-8" | "GBK" | "GB2312" | "BIG5";

export type PaperWidth = "58mm" | "80mm";

export interface Printer {
  id: string;
  name: string;
  address: string;
  type: PrinterConnectionType;

  connected: boolean;

  rssi?: number;
  batteryLevel?: number;
  bondState?: number;
  deviceClass?: string;
}

export interface PrinterConnectionOptions {
  timeout?: number;
  encoding?: PrinterEncoding;
  delimiter?: string;
  secure?: boolean;
}

export interface PrinterStatus {
  online: boolean;
  paperOut: boolean;
  coverOpen: boolean;
  cutterError: boolean;
  temperature: "NORMAL" | "HIGH";
  voltage: "NORMAL" | "LOW";
}

export interface PrinterCapabilities {
  text: boolean;
  image: boolean;
  qrCode: boolean;
  barcode: boolean;
  cut: boolean;
  cashDrawer: boolean;
  status: boolean;
}

export interface PrinterProfile {
  paperWidth: PaperWidth;

  columns: number;

  encoding: PrinterEncoding;

  capabilities: PrinterCapabilities;
}
