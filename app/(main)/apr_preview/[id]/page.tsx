"use client";

import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useParentContext } from "@/contexts/ParentContext";
import React from "react";
import { useParams } from "next/navigation";
import * as XLSX from "xlsx";
import { IsNoOutcome } from "@/constants/Constants";

type Disaggregation = { name: string; target: number; months?: number[] };
type Indicator = {
  code: string;
  name: string;
  disaggregation: Disaggregation[];
  isSub?: boolean;
};
type Output = { name: string; indicators: Indicator[] };
type Outcome = { name: string; outputs: Output[] };
type TimelineMonth = { key: string; label: string };

export default function MonitoringTablePage() {
  const { id } = useParams<{ id: string }>();
  const { requestHandler, reqForToastAndSetMessage } = useParentContext();
  const sheetRef = useRef<HTMLDivElement>(null);

  const [timeline, setTimeline] = useState<TimelineMonth[]>([]);
  const [data, setData] = useState<{
    impact: string;
    outcomes: Outcome[];
    isp3s: any[];
  }>({
    impact: "",
    outcomes: [],
    isp3s: [],
  });

  useEffect(() => {
    requestHandler()
      .get(`/apr_management/show_apr/${id}`)
      .then((response: any) => {
        const d = response.data.data;
        setData(d);

        if (d.outcomes?.length) {
          const monthCount =
            d.outcomes[0].outputs[0].indicators[0].disaggregation[0].months
              .length;
          const generatedTimeline: TimelineMonth[] = Array.from({
            length: monthCount,
          }).map((_, idx) => ({
            key: `m${idx}`,
            label: `Month ${idx + 1}`,
          }));
          setTimeline(generatedTimeline);
        }
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response?.data?.message || error.message)
      );
  }, []);

  const rowsPerIndicator = (ind: Indicator) => 1 + ind.disaggregation.length;
  const rowsPerOutput = (out: Output) =>
    out.indicators.reduce((s, ind) => s + rowsPerIndicator(ind), 0);
  const rowsPerOutcome = (oc: Outcome) =>
    oc.outputs.reduce((s, out) => s + rowsPerOutput(out), 0);
  const totalRows = data.outcomes.reduce((s, oc) => s + rowsPerOutcome(oc), 0);

  const exportToExcel = (data: any) => {
    const wb = XLSX.utils.book_new();
    const ws_data: any[][] = [];
    let rowIndex = 1;

    data.outcomes.forEach((outcome: any, oIdx: number) => {
      outcome.outputs.forEach((output: any, opIdx: number) => {
        output.indicators.forEach((indicator: any, iIdx: number) => {
          ws_data.push([
            oIdx === 0 && opIdx === 0 && iIdx === 0 ? data.impact : "",
            opIdx === 0 && iIdx === 0 ? outcome.name : "",
            iIdx === 0 ? output.name : "",
            indicator.code + " - " + indicator.name,
          ]);
          rowIndex++;
        });
      });
    });

    const ws = XLSX.utils.aoa_to_sheet([
      ["Impact", "Outcome", "Output", "Indicator"],
      ...ws_data,
    ]);
    XLSX.utils.book_append_sheet(wb, ws, "Monitoring");
    XLSX.writeFile(wb, "Monitoring.xlsx");
  };

  const rows: React.ReactNode[] = [];

  data.outcomes.forEach((outcome, oIndex) => {
    const outcomeRowSpan = rowsPerOutcome(outcome);
    outcome.outputs.forEach((output, opIndex) => {
      const outputRowSpan = rowsPerOutput(output);
      output.indicators.forEach((indicator, iIndex) => {
        const indicatorTotal = indicator.disaggregation.reduce(
          (a, b) => a + b.target,
          0
        );

        const monthsSum = timeline.map((_, mIdx) =>
          indicator.disaggregation.reduce(
            (s, d) => s + (d.months?.[mIdx] || 0),
            0
          )
        );

        const totalAchievement = monthsSum.reduce((a, b) => a + b, 0);
        const percentAchieved = indicatorTotal
          ? ((totalAchievement / indicatorTotal) * 100).toFixed(2)
          : "0";

        const showImpact = oIndex === 0 && opIndex === 0 && iIndex === 0;
        const showOutcome = opIndex === 0 && iIndex === 0;
        const showOutput = iIndex === 0;

        const monthQuarterCells: React.ReactNode[] = [];
        for (let i = 0; i < monthsSum.length; i += 3) {
          monthsSum.slice(i, i + 3).forEach((m, mIndex) => {
            monthQuarterCells.push(
              <TableCell
                key={`m-${i + mIndex}`}
                className="text-right border-r border-slate-400 text-sm bg-blue-400"
              >
                {m}
              </TableCell>
            );
          });

          const quarterValue = monthsSum
            .slice(i, i + 3)
            .reduce((a, b) => a + b, 0);
          monthQuarterCells.push(
            <TableCell
              key={`q-${i / 3}`}
              className="text-right border-r border-slate-400 text-sm bg-blue-400"
            >
              {quarterValue}
            </TableCell>
          );
        }

        rows.push(
          <TableRow
            key={`main-${oIndex}-${opIndex}-${iIndex}`}
            className="border-b border-slate-400"
          >
            {showImpact && (
              <TableCell
                rowSpan={totalRows}
                className="text-[12px] font-semibold whitespace-normal border-r border-slate-400 text-center max-w-[300px]"
              >
                {data.impact}
              </TableCell>
            )}
            {showOutcome && (
              <TableCell
                rowSpan={outcomeRowSpan}
                className="text-[12px] whitespace-normal border-r border-slate-400 text-center max-w-[300px]"
              >
                {IsNoOutcome(outcome.name) ? "" : outcome.name}
              </TableCell>
            )}
            {showOutput && (
              <TableCell
                rowSpan={outputRowSpan}
                className="text-[12px] whitespace-normal border-r border-slate-400 text-center max-w-[300px]"
              >
                {output.name}
              </TableCell>
            )}

            {/* Indicator info */}
            <TableCell className="text-sm border-r border-slate-400 bg-blue-400 text-wrap text-center max-w-[300px]">
              <div className="font-semibold text-wrap text-center">
                {indicator.code}
              </div>
              <div title={indicator.name} className="text-xs text-center">
                {indicator.name.length >= 50
                  ? `${indicator.name.slice(0, 50)}...`
                  : indicator.name}
              </div>
            </TableCell>

            {/* Target */}
            <TableCell className="text-right font-semibold text-sm border-r border-slate-400 bg-blue-400">
              {indicatorTotal}
            </TableCell>

            {/* Total achievement */}
            <TableCell className="text-right font-semibold text-sm border-r border-slate-400 bg-blue-400">
              {totalAchievement}
            </TableCell>

            {/* % achieved */}
            <TableCell className="text-right font-semibold text-sm border-r border-slate-400 bg-blue-400">
              {percentAchieved}%
            </TableCell>

            {/* ماه‌ها + کوارتر بعد از هر ۳ ماه */}
            {monthQuarterCells}
          </TableRow>
        );

        // disaggregation
        indicator.disaggregation.forEach((d, dIndex) => {
          const disTotalAchievement = d.months?.reduce((a, b) => a + b, 0) || 0;
          const disPercent = d.target
            ? ((disTotalAchievement / d.target) * 100).toFixed(2)
            : "0";

          const disMonthQuarterCells: React.ReactNode[] = [];
          for (let i = 0; i < (d.months?.length || 0); i += 3) {
            d.months?.slice(i, i + 3).forEach((m, mIndex) => {
              disMonthQuarterCells.push(
                <TableCell
                  key={`dis-m-${dIndex}-${i + mIndex}`}
                  className="text-right text-xs border-r border-slate-400"
                >
                  {m}
                </TableCell>
              );
            });
            const quarterValue =
              d.months?.slice(i, i + 3).reduce((a, b) => a + b, 0) || 0;
            disMonthQuarterCells.push(
              <TableCell
                key={`dis-q-${dIndex}-${i / 3}`}
                className="text-right border-r border-slate-400 text-xs bg-blue-400"
              >
                {quarterValue}
              </TableCell>
            );
          }

          rows.push(
            <TableRow
              key={`dis-${oIndex}-${opIndex}-${iIndex}-${dIndex}`}
              className="border-b border-slate-400"
            >
              <TableCell className="text-xs border-r border-slate-400 pl-6">
                {d.name}
              </TableCell>
              <TableCell className="text-right text-xs border-r border-slate-400">
                {d.target}
              </TableCell>
              <TableCell className="text-right text-xs border-r border-slate-400">
                {disTotalAchievement}
              </TableCell>
              <TableCell className="text-right text-xs border-r border-slate-400">
                {disPercent}%
              </TableCell>
              {disMonthQuarterCells}
            </TableRow>
          );
        });
      });
    });
  });

  return (
    <div className="p-6 space-y-6 overflow-auto w-full h-screen">
      <div className="flex justify-end">
        <Button onClick={() => exportToExcel(data)}>Download Excel</Button>
      </div>
      <div
        ref={sheetRef}
        className="space-y-6 bg-white rounded-md shadow p-4 overflow-auto"
      >
        <h1 className="text-xl font-bold text-center">
          Monitoring &amp; Evaluation Table
        </h1>

        <Card>
          <CardContent className="p-0 overflow-auto">
            <Table className="min-w-max border-collapse border border-slate-400">
              <TableHeader>
                <TableRow className="bg-green-600 text-white text-sm">
                  <TableHead className="border-r border-white text-center">
                    Impact/Goal (LFA)
                  </TableHead>
                  <TableHead className="border-r border-white text-center">
                    Result/Outcome
                  </TableHead>
                  <TableHead className="border-r border-white text-center">
                    Outputs
                  </TableHead>
                  <TableHead className="border-r border-white text-center">
                    Indicators
                  </TableHead>
                  <TableHead className="border-r border-white text-center">
                    Target
                  </TableHead>
                  <TableHead className="border-r border-white text-center">
                    Total achievement
                  </TableHead>
                  <TableHead className="border-r border-white text-center">
                    % Achieved
                  </TableHead>
                  {timeline.map((m, idx) => {
                    if ((idx + 1) % 3 === 0) {
                      return (
                        <React.Fragment key={m.key}>
                          <TableHead className="border-r border-white text-center">
                            {m.label}
                          </TableHead>
                          <TableHead className="border-r border-white text-center bg-blue-400">
                            {`Q${Math.ceil((idx + 1) / 3)}`}
                          </TableHead>
                        </React.Fragment>
                      );
                    }
                    return (
                      <TableHead
                        key={m.key}
                        className="border-r border-white text-center"
                      >
                        {m.label}
                      </TableHead>
                    );
                  })}
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
