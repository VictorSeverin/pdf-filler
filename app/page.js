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

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { parseExcel } from "@/lib/utils";
export default function Home() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [date, setDate] = useState({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
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

  const handleGenerate = async () => {
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", name);
      formData.append("date", JSON.stringify(date));

      console.log(formData.get("file"));
      console.log(formData.get("street"));
      console.log(formData.get("city"));
      console.log(formData.get("zip"));

      // if (file) {
      //   try {
      //     const units = await parseExcel(file);
      //     console.log("Parsed units:", units);

      //     // Handle the further processing of units here
      //   } catch (error) {
      //     console.error("Error parsing Excel file:", error);
      //   }
      // } else {
      //   console.log("No file selected");
      // }
      //console.log(units);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Card className="flex flex-col items-center justify-center gap-5">
        <CardHeader className="text-center">
          <CardTitle className="flex flex-wrap max-w-md text-center">
            Tool to automatically generate inspection notices for all your
            tenants
          </CardTitle>
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
              <Label>Upload Tenant Spreadsheet</Label>
              <Input id="tenants" type="file" onChange={handleFileChange} />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button onClick={handleGenerate}>Generate</Button>
          <Label>
            This will download a zip folder with the generated notices
          </Label>
        </CardFooter>
      </Card>
    </main>
  );
}
