import PDFDocument from "pdfkit";

export const generateInvoice = (order, res) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${order._id}.pdf`
  );

  doc.pipe(res);

  
  doc.fontSize(20).text("QuickPick Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(12);
  doc.text(`Order ID: ${order._id}`);
  doc.text(`Order Date: ${new Date(order.createdAt).toLocaleDateString()}`);
  doc.text(`Payment Method: ${order.paymentMethod}`);
  doc.moveDown();

  
  doc.text("Bill To:");
  doc.text(order.address.fullName);
  doc.text(order.address.phone);
  doc.text(
    `${order.address.city}, ${order.address.state} - ${order.address.pincode}`
  );

  doc.moveDown();

  
  doc.text("Items:", { underline: true });
  doc.moveDown(0.5);

  let total = 0;
  let  deliveryfee = 50

  order.items.forEach((item, index) => {
    const price = item.price * item.quantity;
    total += deliveryfee + price;

    doc.text(
      `${index + 1}. ${item.name} | Size: ${item.size} | Qty: ${
        item.quantity
      } | ₹${price}`
    );
  });
  doc.text (
    '* delivery fee: 50'
  )

  doc.moveDown();

  
  doc.fontSize(14).text(`Total Amount: ₹${order.totalAmount}`, {
    align: "right",
  });

  doc.end();
};  