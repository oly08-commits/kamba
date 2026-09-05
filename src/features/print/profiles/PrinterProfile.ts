import {
  PrinterProfile as IPrinterProfile,
  PaperWidth,
  PrinterCapabilities,
} from "../types/printer";

export class PrinterProfile {
  static create(paperWidth: PaperWidth = "80mm"): IPrinterProfile {
    const columns = paperWidth === "58mm" ? 32 : 48;

    const capabilities: PrinterCapabilities = {
      text: true,
      image: true,
      qrCode: true,
      barcode: true,
      cut: true,
      cashDrawer: true,
      status: true,
    };

    return {
      paperWidth,
      columns,
      encoding: "UTF-8",
      capabilities,
    };
  }
}
