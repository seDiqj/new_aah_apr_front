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
import { useParams, useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { ArrowLeft } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

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
  const router = useRouter();

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

        if (d.outcomes?.length && d.start_date) {
          const monthCount =
            d.outcomes[0].outputs[0].indicators[0].disaggregation[0].months
              .length;

          const start = new Date(d.start_date);

          const generatedTimeline: TimelineMonth[] = Array.from(
            { length: monthCount },
            (_, idx) => {
              const current = new Date(start);
              current.setMonth(start.getMonth() + idx);

              return {
                key: `m${idx}`,
                label: current.toLocaleDateString("en-US", {
                  month: "long",
                  year: "2-digit",
                }),
              };
            },
          );

          setTimeline(generatedTimeline);
        }
      })
      .catch((error: any) =>
        reqForToastAndSetMessage(
          error.response?.data?.message || error.message,
          "error",
        ),
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

  // data.outcomes.forEach((outcome, oIndex) => {
  //   const outcomeRowSpan = rowsPerOutcome(outcome);
  //   outcome.outputs.forEach((output, opIndex) => {
  //     const outputRowSpan = rowsPerOutput(output);
  //     output.indicators.forEach((indicator, iIndex) => {
  //       const indicatorTotal = indicator.disaggregation.reduce(
  //         (a, b) => a + b.target,
  //         0,
  //       );

  //       const monthsSum = timeline.map((_, mIdx) =>
  //         indicator.disaggregation.reduce(
  //           (s, d) => s + (d.months?.[mIdx] || 0),
  //           0,
  //         ),
  //       );

  //       const totalAchievement = monthsSum.reduce((a, b) => a + b, 0);
  //       const percentAchieved = indicatorTotal
  //         ? ((totalAchievement / indicatorTotal) * 100).toFixed(2)
  //         : "0";

  //       const showImpact = oIndex === 0 && opIndex === 0 && iIndex === 0;
  //       const showOutcome = opIndex === 0 && iIndex === 0;
  //       const showOutput = iIndex === 0;

  //       const monthQuarterCells: React.ReactNode[] = [];
  //       for (let i = 0; i < monthsSum.length; i += 3) {
  //         monthsSum.slice(i, i + 3).forEach((m, mIndex) => {
  //           monthQuarterCells.push(
  //             <TableCell
  //               key={`m-${i + mIndex}`}
  //               className="text-right border-r border-slate-400 text-sm bg-blue-400"
  //             >
  //               {m}
  //             </TableCell>,
  //           );
  //         });

  //         const quarterValue = monthsSum
  //           .slice(i, i + 3)
  //           .reduce((a, b) => a + b, 0);
  //         monthQuarterCells.push(
  //           <TableCell
  //             key={`q-${i / 3}`}
  //             className="text-right border-r border-slate-400 text-sm bg-blue-400"
  //           >
  //             {quarterValue}
  //           </TableCell>,
  //         );
  //       }

  //       rows.push(
  //         <TableRow
  //           key={`main-${oIndex}-${opIndex}-${iIndex}`}
  //           className="border-b border-slate-400"
  //         >
  //           {showImpact && (
  //             <TableCell
  //               rowSpan={totalRows}
  //               className="text-[12px] font-semibold whitespace-normal border-r border-slate-400 text-center max-w-[300px]"
  //             >
  //               {data.impact}
  //             </TableCell>
  //           )}
  //           {showOutcome && (
  //             <TableCell
  //               rowSpan={outcomeRowSpan}
  //               className="text-[12px] whitespace-normal border-r border-slate-400 text-center max-w-[300px]"
  //             >
  //               {IsNoOutcome(outcome.name) ? "" : outcome.name}
  //             </TableCell>
  //           )}
  //           {showOutput && (
  //             <TableCell
  //               rowSpan={outputRowSpan}
  //               className="text-[12px] whitespace-normal border-r border-slate-400 text-center max-w-[300px]"
  //             >
  //               {output.name}
  //             </TableCell>
  //           )}

  //           {/* Indicator info */}
  //           <TableCell className="text-sm border-r border-slate-400 bg-blue-400 text-wrap text-center max-w-[300px]">
  //             <div className="font-semibold text-wrap text-center">
  //               {indicator.code}
  //             </div>
  //             <div title={indicator.name} className="text-xs text-center">
  //               {indicator.name.length >= 50
  //                 ? `${indicator.name.slice(0, 50)}...`
  //                 : indicator.name}
  //             </div>
  //           </TableCell>

  //           {/* Target */}
  //           <TableCell className="text-right font-semibold text-sm border-r border-slate-400 bg-blue-400">
  //             {indicatorTotal}
  //           </TableCell>

  //           {/* Total achievement */}
  //           <TableCell className="text-right font-semibold text-sm border-r border-slate-400 bg-blue-400">
  //             {totalAchievement}
  //           </TableCell>

  //           {/* % achieved */}
  //           <TableCell className="text-right font-semibold text-sm border-r border-slate-400 bg-blue-400">
  //             {percentAchieved}%
  //           </TableCell>

  //           {monthQuarterCells}
  //         </TableRow>,
  //       );

  //       // disaggregation
  //       indicator.disaggregation.forEach((d, dIndex) => {
  //         const disTotalAchievement = d.months?.reduce((a, b) => a + b, 0) || 0;
  //         const disPercent = d.target
  //           ? ((disTotalAchievement / d.target) * 100).toFixed(2)
  //           : "0";

  //         const disMonthQuarterCells: React.ReactNode[] = [];
  //         for (let i = 0; i < (d.months?.length || 0); i += 3) {
  //           d.months?.slice(i, i + 3).forEach((m, mIndex) => {
  //             disMonthQuarterCells.push(
  //               <TableCell
  //                 key={`dis-m-${dIndex}-${i + mIndex}`}
  //                 className="text-right text-xs border-r border-slate-400"
  //               >
  //                 {m}
  //               </TableCell>,
  //             );
  //           });
  //           const quarterValue =
  //             d.months?.slice(i, i + 3).reduce((a, b) => a + b, 0) || 0;
  //           disMonthQuarterCells.push(
  //             <TableCell
  //               key={`dis-q-${dIndex}-${i / 3}`}
  //               className="text-right border-r border-slate-400 text-xs bg-blue-400"
  //             >
  //               {quarterValue}
  //             </TableCell>,
  //           );
  //         }

  //         rows.push(
  //           <TableRow
  //             key={`dis-${oIndex}-${opIndex}-${iIndex}-${dIndex}`}
  //             className="border-b border-slate-400"
  //           >
  //             <TableCell className="text-xs border-r border-slate-400 pl-6">
  //               {d.name}
  //             </TableCell>
  //             <TableCell className="text-right text-xs border-r border-slate-400">
  //               {d.target}
  //             </TableCell>
  //             <TableCell className="text-right text-xs border-r border-slate-400">
  //               {disTotalAchievement}
  //             </TableCell>
  //             <TableCell className="text-right text-xs border-r border-slate-400">
  //               {disPercent}%
  //             </TableCell>
  //             {disMonthQuarterCells}
  //           </TableRow>,
  //         );
  //       });
  //     });
  //   });
  // });

  // … (بقیه imports و useState / useEffect بدون تغییر)

  data.outcomes.forEach((outcome, oIndex) => {
    const outcomeRowSpan = rowsPerOutcome(outcome);

    outcome.outputs.forEach((output, opIndex) => {
      const outputRowSpan = rowsPerOutput(output);

      output.indicators.forEach((indicator, iIndex) => {
        const showImpact = oIndex === 0 && opIndex === 0 && iIndex === 0;
        const showOutcome = opIndex === 0 && iIndex === 0;
        const showOutput = iIndex === 0;

        let monthsSum: (number | string)[] = [];
        let totalAchievement = 0;
        let percentAchieved: string | number = 0;

        // =========================
        // Special (Enact) Case
        // =========================
        const specialDisaggs = [
          "# of supervised psychosocial counsellors",
          "# Accumulated score EQUIP (ENACT) Tool",
        ];

        const disaggNames = indicator.disaggregation.map((d) => d.name);
        const isEnact =
          specialDisaggs.every((name) => disaggNames.includes(name)) &&
          disaggNames.length === 2;

        const eachMonthLabel: string[] = [];
        const eachQuarterLabel: string[] = [];

        if (isEnact) {
          const dm1 = indicator.disaggregation[0].months || [];
          const dm2 = indicator.disaggregation[1].months || [];
          const monthCount = Math.max(dm1.length, dm2.length);

          const dm1Ensured = Array.from(
            { length: monthCount },
            (_, i) => dm1[i] || 0,
          );
          const dm2Ensured = Array.from(
            { length: monthCount },
            (_, i) => dm2[i] || 0,
          );

          // Generate monthly ratios and labels
          for (let i = 0; i < monthCount; i++) {
            const ratio = dm2Ensured[i] / (dm1Ensured[i] * 60 || 1);
            let label = "";
            if (ratio >= 0.95) label = "Excellent Performance";
            else if (ratio >= 0.75) label = "Good Performance";
            else if (ratio >= 0.65) label = "Fair Performance";
            else if (ratio >= 0.5) label = "Needs Improvement";
            else label = "Poor Performance";
            eachMonthLabel.push(label);
          }

          // Generate quarterly labels
          for (let i = 0; i < monthCount; i += 3) {
            const quarterRatios: number[] = [];
            for (let j = 0; j < 3 && i + j < monthCount; j++) {
              quarterRatios.push(
                dm2Ensured[i + j] / (dm1Ensured[i + j] * 60 || 1),
              );
            }
            const quarterAvg =
              quarterRatios.reduce((a, b) => a + b, 0) / quarterRatios.length;
            let label = "";
            if (quarterAvg >= 0.95) label = "Excellent Performance";
            else if (quarterAvg >= 0.75) label = "Good Performance";
            else if (quarterAvg >= 0.65) label = "Fair Performance";
            else if (quarterAvg >= 0.5) label = "Needs Improvement";
            else label = "Poor Performance";
            eachQuarterLabel.push(label);
          }

          monthsSum = eachMonthLabel;
          totalAchievement = eachMonthLabel.length; // یا هر محاسبه‌ی دلخواه برای کل
          percentAchieved = "-"; // چون ماه‌ها متنی شده‌اند، درصد عددی معنا ندارد
        }
        // =========================
        // Normal Case
        // =========================
        else {
          const monthCount = timeline.length;
          monthsSum = timeline.map((_, mIdx) =>
            indicator.disaggregation.reduce(
              (s, d) => s + (d.months?.[mIdx] || 0),
              0,
            ),
          );
          const totalTarget = indicator.disaggregation.reduce(
            (s, d) => s + (d.target || 0),
            0,
          );
          totalAchievement = monthsSum.reduce((a, b) => a + b, 0);
          percentAchieved = totalTarget
            ? ((totalAchievement / totalTarget) * 100).toFixed(2)
            : "0";
        }

        // =========================
        // ساخت TableRow
        // =========================
        const monthQuarterCells: React.ReactNode[] = [];
        for (let i = 0; i < monthsSum.length; i += 3) {
          const chunk = monthsSum.slice(i, i + 3);
          // Month values
          chunk.forEach((val, mIndex) => {
            monthQuarterCells.push(
              <TableCell
                key={`m-${i + mIndex}`}
                className={`text-center border-r border-slate-400 text-sm ${"bg-blue-400"}`}
              >
                {val}
              </TableCell>,
            );
          });
          // Quarter value
          if (chunk.length === 3) {
            monthQuarterCells.push(
              <TableCell
                key={`q-${i / 3}`}
                className={`text-center border-r border-slate-400 text-sm ${"bg-blue-400"}`}
              >
                {isEnact
                  ? `${eachQuarterLabel[i / 3]}`
                  : chunk.reduce(
                      (a, b) =>
                        (typeof a === "number" ? a : 0) +
                        (typeof b === "number" ? b : 0),
                      0,
                    )}
              </TableCell>,
            );
          }
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
                {outcome.name}
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

            <TableCell
              className={`text-sm border-r border-slate-400 text-wrap text-center ${"bg-blue-400"}`}
            >
              <div className="font-semibold text-wrap text-center">
                {indicator.code}
              </div>
              <div title={indicator.name} className="text-xs text-center">
                {indicator.name.length >= 50
                  ? `${indicator.name.slice(0, 50)}...`
                  : indicator.name}
              </div>
            </TableCell>

            <TableCell
              className={`text-center font-semibold text-sm border-r border-slate-400 ${"bg-blue-400"}`}
            >
              {indicator.disaggregation.reduce((s, d) => s + d.target, 0)}
            </TableCell>
            <TableCell
              className={`text-center font-semibold text-sm border-r border-slate-400 ${"bg-blue-400"}`}
            >
              {totalAchievement}
            </TableCell>
            <TableCell
              className={`text-center font-semibold text-sm border-r border-slate-400 ${"bg-blue-400"}`}
            >
              {typeof percentAchieved === "string"
                ? percentAchieved
                : `${percentAchieved}%`}
            </TableCell>

            {monthQuarterCells}
          </TableRow>,
        );

        indicator.disaggregation.forEach((d, dIndex) => {
          const disMonthQuarterCells: React.ReactNode[] = [];
          for (let i = 0; i < (d.months?.length || 0); i += 3) {
            d.months?.slice(i, i + 3).forEach((m, mIndex) => {
              disMonthQuarterCells.push(
                <TableCell
                  key={`dis-m-${dIndex}-${i + mIndex}`}
                  className="text-center text-xs border-r border-slate-400"
                >
                  {m}
                </TableCell>,
              );
            });
            const quarterChunk = d.months?.slice(i, i + 3) || [];

            // IF quarter has 3 months only then show quarter value otherwise do not create quarter cell
            if (quarterChunk.length === 3) {
              const quarterValue = quarterChunk.reduce((a, b) => a + b, 0);

              disMonthQuarterCells.push(
                <TableCell
                  key={`dis-q-${dIndex}-${i / 3}`}
                  className="text-center border-r border-slate-400 text-xs bg-blue-400"
                >
                  {quarterValue}
                </TableCell>,
              );
            }
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
                {d.months?.reduce((a, b) => a + b, 0) || 0}
              </TableCell>
              <TableCell className="text-right text-xs border-r border-slate-400">
                {d.target
                  ? (
                      ((d.months?.reduce((a, b) => a + b, 0) || 0) / d.target) *
                      100
                    ).toFixed(2)
                  : "0"}
                %
              </TableCell>
              {disMonthQuarterCells}
            </TableRow>,
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
        className="space-y-6 rounded-md shadow p-4 overflow-auto"
      >
        <div className="flex flex-row items-center justify-start w-full">
          <SidebarTrigger></SidebarTrigger>
          <Button size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>

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
