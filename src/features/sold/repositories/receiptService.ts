import * as Print from "expo-print";

interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface ReceiptData {
  saleId: number;
  date: string;
  items: ReceiptItem[];
  total: number;
  paymentMethod: string;
  paidAmount: number;
  change: number;
}

export class ReceiptService {
  static async print(sale: ReceiptData) {
    const itemsHtml = sale.items
      .map(
        (item) => `
          <tr>
            <td>${item.name}</td>
            <td>${item.quantity}</td>
            <td>
              ${item.subtotal.toFixed(2)} Kz
            </td>
          </tr>
        `,
      )
      .join("");

    const html = `
      <!DOCTYPE html>

      <html>
        <head>
          <meta charset="UTF-8" />

          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #222;
            }

            .header {
              text-align: center;
            }

            .title {
              font-size: 22px;
              font-weight: bold;
            }

            .line {
              border-top: 1px dashed #555;
              margin: 15px 0;
            }

            table {
              width: 100%;
              border-collapse: collapse;
            }

            td {
              padding: 6px 0;
            }

            .total {
              font-size: 22px;
              font-weight: bold;
            }

            .right {
              text-align: right;
            }

            .footer {
              margin-top: 30px;
              text-align: center;
            }
          </style>
        </head>

        <body>

          <div class="header">
            <div class="title">
              MINHA LOJA
            </div>

            <div>
              Recibo de Venda
            </div>

            <div>
              Venda Nº ${sale.saleId}
            </div>

            <div>
              ${sale.date}
            </div>
          </div>

          <div class="line"></div>

          <table>
            ${itemsHtml}
          </table>

          <div class="line"></div>

          <table>
            <tr>
              <td class="total">
                TOTAL
              </td>

              <td class="right total">
                ${sale.total.toFixed(2)} Kz
              </td>
            </tr>

            <tr>
              <td>
                Pagamento
              </td>

              <td class="right">
                ${sale.paymentMethod}
              </td>
            </tr>

            <tr>
              <td>
                Valor pago
              </td>

              <td class="right">
                ${sale.paidAmount.toFixed(2)} Kz
              </td>
            </tr>

            <tr>
              <td>
                Troco
              </td>

              <td class="right">
                ${sale.change.toFixed(2)} Kz
              </td>
            </tr>
          </table>

          <div class="footer">
            Obrigado pela preferência!
          </div>

        </body>
      </html>
    `;

    await Print.printAsync({
      html,
    });
  }
}
