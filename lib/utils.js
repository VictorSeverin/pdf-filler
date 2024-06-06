import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";
import { PDFDocument, rgb } from "pdf-lib";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export async function parseExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const units = {};

      json.slice(8).forEach((row, index) => {
        if (index > 0) {
          // Skip header row after the first 8 rows
          const unitNumber = row[1]; // Assuming the unit number is in the second column
          const tenantName = row[2]; // Assuming the tenant name is in the third column

          if (unitNumber && tenantName) {
            let cleanedName = tenantName.replace(",", "");
            if (cleanedName.toLowerCase() !== "none") {
              if (units[unitNumber]) {
                units[unitNumber].push(cleanedName);
              } else {
                units[unitNumber] = [cleanedName];
              }
            }
          }
        }
      });

      // Concatenate names for each unit
      for (let unit in units) {
        units[unit] = units[unit].join(", ");
      }
      resolve(units);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}

export async function fillPdfTemplate(
  tenants,
  name,
  street,
  city,
  zip,
  date,
  today
) {
  try {
    const formUrl =
      "https://utfs.io/f/68a8c907-7289-4aaa-9059-4d46b4870946-9er2q5.pdf";
    const combinedPdfDoc = await PDFDocument.create();

    console.log(tenants);
    for (const { tenantName, unitNumber } of tenants) {
      const formPdfBytes = await fetch(formUrl).then((res) =>
        res.arrayBuffer()
      );
      const tenantPdfDoc = await PDFDocument.load(formPdfBytes);

      const form = tenantPdfDoc.getForm();

      form.getTextField("tenant_name").setText(tenantName + " et al");
      form.getTextField("street_name").setText(street);
      form.getTextField("unit").setText(unitNumber);
      form.getTextField("city").setText(city);
      form.getTextField("zip").setText(zip);
      form.getTextField("inspection_date").setText(date);
      form.getCheckBox("checkbox").check();
      form.getCheckBox("checkbox").defaultUpdateAppearances();
      form.getTextField("reason").setText("Annual Inspection");
      form.getTextField("landlord").setText("North Coast United");
      form.getTextField("manager_name").setText(name);
      form.getTextField("management_company").setText("North Coast United");
      form.getTextField("today_date").setText(today);

      form.flatten();
      const [firstPage] = await combinedPdfDoc.copyPages(tenantPdfDoc, [0]);
      combinedPdfDoc.addPage(firstPage);
    }

    const pdfBytes = await combinedPdfDoc.save();
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
    return pdfBlob;
  } catch (error) {
    throw error;
  }
}
