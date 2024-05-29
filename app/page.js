import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Home() {
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
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Input id="picture" type="file" />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button>Generate</Button>
          <Label>
            This will download a zip folder with the generated notices
          </Label>
        </CardFooter>
      </Card>
    </main>
  );
}
