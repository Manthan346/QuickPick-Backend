import { Resend } from 'resend';



export const orderConfirmationTemplate = (order) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Order Confirmation</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f6f6f6;
        padding: 20px;
      }
      .container {
        max-width: 600px;
        margin: auto;
        background: #ffffff;
        padding: 20px;
        border-radius: 8px;
      }
      h2 {
        color: #333;
      }
      .order-box {
        margin-top: 20px;
        border-top: 1px solid #ddd;
        padding-top: 10px;
      }
      .item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
      }
      .total {
        font-weight: bold;
        margin-top: 15px;
      }
      .footer {
        margin-top: 30px;
        font-size: 12px;
        color: #777;
        text-align: center;
      }
    </style>
  </head>

  <body>
    <div class="container">
      <h2>✅ Order Confirmed</h2>

      <p>Hi ${order.address.fullName}</p>
      <p>Thank you for your order! Your order has been placed successfully.</p>

      <div class="order-box">
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
        <p><strong>Order Status:</strong> ${order.orderStatus}</p>

        <hr />

        ${order.items
          .map(
            (item) => `
          <div class="item">
            <span>${item.name} × ${item.quantity}</span>
            <span> ₹${item.price * item.quantity}</span>
          </div>
        `
          )
          .join("")}
          
        <div class="total">
          Delivery fee: ₹50
        </div>
        <div class="total">
          Total Amount: ₹${order.totalAmount}
        </div>
      </div>

      <p style="margin-top:20px;">
        📦 Delivery Address:<br />
        ${order.address}
      </p>

      <p>We’ll notify you once your order is shipped.</p>

      <div class="footer">
        © ${new Date().getFullYear()} QuickPick. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};