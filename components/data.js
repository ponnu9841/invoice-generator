import { useState } from "react";

export function dataState() {
  const [data, setData] = useState({
    invoiceFrom: "",
    billTo: "Bill To",
    billToValue: "",
    shipTo: "Ship To",
    shipToValue: "",
    payTerms: "Payment Terms",
    payTermsValue: "",
    date: "Date",
    dueDate: "Due Date",
    // poNum: "PO Number",
    // poNumValue: "",
    notes: "Notes",
    notesValue: "",
    terms: "Terms",
    termsValue: "",
    subtotal: "Subtotal",
    total: "Total",
    amtPaid: "Amount Paid",
    amtPaidValue: "",
    balDue: "Balance Due"
  });

  return { data, setData };
}
