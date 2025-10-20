"use client";

import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";

type Disaggregation = { name: string; target: number; province: string };
type Indicator = {
  code: string;
  name: string;
  target: string;
  disaggregation: Disaggregation[];
  isSub?: boolean;
};
type Output = { name: string; indicators: Indicator[] };
type Outcome = { name: string; outputs: Output[] };
export type AprData = { impact: string; outcomes: Outcome[] };

export default function MonitoringTablePage({
  data,
  provincesList,
}: {
  data: AprData;
  provincesList: string[];
}) {
  const [selectedProvince, setSelectedProvince] = useState<string>("Master");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && sheetRef.current) {
      sheetRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
        if (sheetRef.current) {
          sheetRef.current.style.height = "100%";
          sheetRef.current.style.overflow = "auto";
        }
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
        if (sheetRef.current) {
          sheetRef.current.style.height = "";
          sheetRef.current.style.overflow = "";
        }
      });
    }
  };

  const filterDisaggregation = (dis: Disaggregation[]) =>
    dis.filter(
      (d) =>
        selectedProvince === "Master" ||
        d.province?.trim().toLowerCase() ===
          selectedProvince.trim().toLowerCase()
    );

  const rowsPerIndicator = (ind: Indicator) =>
    1 + filterDisaggregation(ind.disaggregation).length;

  const rowsPerOutput = (out: Output) =>
    out.indicators.reduce((s, ind) => s + rowsPerIndicator(ind), 0);

  const rowsPerOutcome = (oc: Outcome) =>
    oc.outputs.reduce((s, out) => s + rowsPerOutput(out), 0);

  const totalRows = data.outcomes.reduce((s, oc) => s + rowsPerOutcome(oc), 0);

  const rows: React.ReactNode[] = [];

  data.outcomes.forEach((outcome, oIndex) => {
    const outcomeRowSpan = rowsPerOutcome(outcome);
    outcome.outputs.forEach((output, opIndex) => {
      const outputRowSpan = rowsPerOutput(output);

      output.indicators
        .filter((ind) => filterDisaggregation(ind.disaggregation).length > 0)
        .forEach((indicator, iIndex) => {
          const filteredDisaggregation = filterDisaggregation(
            indicator.disaggregation
          );

          const showImpact = oIndex === 0 && opIndex === 0 && iIndex === 0;
          const showOutcome = opIndex === 0 && iIndex === 0;
          const showOutput = iIndex === 0;

          rows.push(
            <TableRow key={`main-${oIndex}-${opIndex}-${iIndex}`}>
              {showImpact && (
                <TableCell
                  rowSpan={totalRows}
                  className="text-sm font-semibold whitespace-normal break-words border-r border-slate-300 align-middle text-center py-2 px-2"
                >
                  {data.impact}
                </TableCell>
              )}

              {showOutcome && (
                <TableCell
                  rowSpan={outcomeRowSpan}
                  className="text-sm whitespace-normal break-words border-r border-slate-300 align-middle text-center py-2 px-2"
                >
                  {outcome.name}
                </TableCell>
              )}

              {showOutput && (
                <TableCell
                  rowSpan={outputRowSpan}
                  className="text-sm whitespace-normal break-words border-r border-slate-300 align-middle text-center py-2 px-2"
                >
                  {output.name}
                </TableCell>
              )}

              <TableCell className="text-sm whitespace-normal break-words border-r border-slate-300 py-2 px-2">
                <div className="font-semibold">{indicator.code}</div>
                <div className="text-xs">{indicator.name}</div>
              </TableCell>

              <TableCell className="text-right font-semibold text-sm py-2 px-2">
                {indicator.target}
              </TableCell>
            </TableRow>
          );

          filteredDisaggregation.forEach((d, dIndex) => {
            const isLastDisaggregation =
              dIndex === filteredDisaggregation.length - 1;
            const borderClass =
              !indicator.isSub && isLastDisaggregation
                ? "border-b-2 border-slate-400"
                : "border-b border-slate-300";

            rows.push(
              <TableRow
                key={`dis-${oIndex}-${opIndex}-${iIndex}-${dIndex}`}
                className={borderClass}
              >
                <TableCell className="text-xs border-r border-slate-300 pl-6 py-0.5">
                  {d.name}
                </TableCell>
                <TableCell className="text-right text-xs py-0.5">
                  {d.target}
                </TableCell>
              </TableRow>
            );
          });
        });
    });
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-end">
        <Button variant="outline" onClick={toggleFullscreen}>
          {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        </Button>
      </div>

      <div ref={sheetRef} className="space-y-6 rounded-md shadow p-4">
        {isFullscreen && (
          <Card>
            <CardContent className="flex flex-wrap gap-3 p-3">
              {/* Master Option */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedProvince === "Master"}
                  onCheckedChange={() => setSelectedProvince("Master")}
                />
                <label className="text-xs">Master</label>
              </div>

              {/* Provinces from props */}
              {provincesList.map((province) => (
                <div key={province} className="flex items-center space-x-2">
                  <Checkbox
                    checked={selectedProvince === province}
                    onCheckedChange={() => setSelectedProvince(province)}
                  />
                  <label className="text-xs">{province}</label>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-green-600 text-sm hover:bg-green-600">
                  <TableHead className="border-r text-center py-2 px-2">
                    Impact/Goal (LFA)
                  </TableHead>
                  <TableHead className="border-r text-center py-2 px-2">
                    Result/Outcome
                  </TableHead>
                  <TableHead className="border-r text-center py-2 px-2">
                    Outputs
                  </TableHead>
                  <TableHead className="border-r text-center py-2 px-2">
                    Indicators
                  </TableHead>
                  <TableHead className="text-right py-2 px-2">Target</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{rows}</TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
