import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";

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
      console.log(units);
      resolve(units);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}
