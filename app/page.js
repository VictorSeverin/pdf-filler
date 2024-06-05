"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "../lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { parseExcel } from "../lib/utils";
import { fillPdfTemplate } from "../lib/utils";
export default function Home() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState({
    from: new Date(),
    to: addDays(new Date(), 7),
  });

  const handleStreetChange = (event) => {
    setStreet(event.target.value);
  };
  const handleCityChange = (event) => {
    setCity(event.target.value);
  };
  const handleZipChange = (event) => {
    setZip(event.target.value);
  };
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };
  const handleTimeChange = (event) => {
    setTime(event.target.value);
  };

  const handleGenerate = async () => {
    if (file && name && street && city && zip) {
      try {
        setLoading(true);
        const units = await parseExcel(file);

        const tenants = Object.entries(units).map(
          ([unitNumber, tenantName]) => ({
            tenantName,
            unitNumber,
          })
        );
        const dateRangeString =
          `${format(date.from, "MM/dd/yyyy")} - ${format(
            date.to,
            "MM/dd/yyyy"
          )}` +
          " | " +
          time;
        const today = format(new Date(), "MM/dd/yyyy");
        const pdfBlob = await fillPdfTemplate(
          tenants,
          name,
          street,
          city,
          zip,
          dateRangeString,
          today
        );
        // Download the PDF
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "inspection_notices.pdf";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error generating PDF:", error);
        setLoading(false);
      }
    } else {
      alert("Please enter all information");
      console.log("No file or template selected");
    }
    setLoading(false);
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card className="flex flex-col items-center justify-center gap-5">
        <CardHeader className="text-center">
          <CardTitle className="flex flex-wrap max-w-md text-center">
            Tool to automatically generate inspection notices for all your
            tenants
          </CardTitle>
          <CardDescription>{`To download a list of all tenants, follow these steps:`}</CardDescription>
          <CardDescription>{`AppFolio > Reporting > Reports > Tenant Directory`}</CardDescription>
          <CardDescription>{`Click on Actions > "Export as Excel"`}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-6">
            <div>
              <Label>Manager&apos;s Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={handleNameChange}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Property Address</Label>
              <Input
                id="streetAddress"
                type="text"
                placeholder="Street Name"
                value={street}
                onChange={handleStreetChange}
              />
              <Input
                id="city"
                type="text"
                placeholder="City"
                value={city}
                onChange={handleCityChange}
              />
              <Input
                id="zip"
                type="text"
                placeholder="Zip"
                value={zip}
                onChange={handleZipChange}
              />
            </div>
            <div className={cn("grid gap-2")}>
              <Label>Date/Date Range when inspection will occur</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-[300px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date?.from ? (
                      date.to ? (
                        <>
                          {format(date.from, "LLL dd, y")} -{" "}
                          {format(date.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>Time</Label>
              <Input
                id="time"
                type="text"
                placeholder="Ex. 10AM - 5PM"
                value={time}
                onChange={handleTimeChange}
              />
            </div>
            <div>
              <Label>Upload Tenant Spreadsheet</Label>
              <Input id="tenants" type="file" onChange={handleFileChange} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          {!loading ? (
            <Button onClick={handleGenerate}>Generate</Button>
          ) : (
            <Button>Loading</Button>
          )}
        </CardFooter>
      </Card>
    </main>
  );
}
