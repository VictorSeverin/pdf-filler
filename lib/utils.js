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
            if (units[unitNumber]) {
              units[unitNumber].push(tenantName);
            } else {
              units[unitNumber] = [tenantName];
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

export async function fillPdfTemplate(tenants, name, street, city, zip, date) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const formUrl =
          "https://utfs.io/f/c7b9d745-fa07-4148-9a08-227492067448-jmnwk4.pdf";
        const formPdfBytes = await fetch(formUrl).then((res) =>
          res.arrayBuffer()
        );

        const pdfDoc = await PDFDocument.load(formPdfBytes); // Iterate through the array of tenants and unit numbers
        for (const { tenantName, unitNumber } of tenants) {
          const page = pdfDoc.addPage(); // Create a new page for each tenant

          // Get the form of the new page
          const form = pdfDoc.getForm();

          form.getTextField("tenant_name").setText(tenantName);
          form.getTextField("street_name").setText(street);
          form.getTextField("unit").setText(unitNumber);
          form.getTextField("city").setText(city);
          form.getTextField("zip").setText(zip);
          form.getTextField("inspection_date").setText(date);
          form.getTextField("managerName").setText(name);
          form.getTextField("checkbox").setText("Yes_grps");
          form.getTextField("landlord").setText("North Coast United");
          form.getTextField("manager_name").setText(name);
          form.getTextField("management_company").setText("North Coast United");
          form.getTextField("today_date").setText("5/30/24");
        }

        // Serialize the PDF document to bytes
        const pdfBytes = await pdfDoc.save();
        const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
        resolve(pdfBlob);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}
