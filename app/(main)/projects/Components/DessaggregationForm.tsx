"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cardsBottomButtons } from "./CardsBottomButtons";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useProjectContext } from "../create_new_project/page";
import { Dessaggregation, Indicator } from "../types/Types";
import { enactDessaggregationOptions, indevidualDessaggregationOptions, sessionDessaggregationOptions } from "../utils/OptionLists";
import { useParentContext } from "@/contexts/ParentContext";
import { useProjectEditContext } from "../edit_project/[id]/page";
import { useProjectShowContext } from "../project_show/[id]/page";

interface ComponentProps {
  mode: "create" | "edit";
  readOnly?: boolean;
}

const DessaggregationForm: React.FC<ComponentProps> = ({mode, readOnly}) => {

    const {indicators, indicator, setCurrentTab, dessaggregations, setDessaggregations}: {
        indicators: Indicator[];
        indicator: Indicator;
        setCurrentTab: (value: string) => void;
        dessaggregations: Dessaggregation[];
        setDessaggregations: React.Dispatch<React.SetStateAction<Dessaggregation[]>>
    } = mode == "create" ? useProjectContext() : readOnly ? useProjectShowContext() : useProjectEditContext();

    const {reqForToastAndSetMessage, axiosInstance} = useParentContext();

    let [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>();
    
    const [activeDessaggregationTab, setActiveDessaggregationTab] = useState<
        string | undefined
      >(undefined);

    const [dessaggregationBeforeEdit, setDessaggregationBeforeEdit] = useState<Dessaggregation[]>([]);

    const [
        isThereAnyProvinceDessaggregationTotalOverflow,
        setIsThereAnyProvinceDessaggregationTotalOverflow,
      ] = useState<string[]>([]);

    useEffect(() => {
        if (!selectedIndicator) return;
    
        const overflows: string[] = [];
        selectedIndicator.provinces.forEach((province) => {
          const totalForProvince = dessaggregations
            .filter(
              (d) =>
                d.province === province.province &&
                d.indicatorRef === selectedIndicator?.indicatorRef
            )
            .reduce((sum, d) => sum + Number(d.target || 0), 0);
    
          if (totalForProvince > (province.target || 0)) {
            overflows.push(province.province);
          }
        });
    
        setIsThereAnyProvinceDessaggregationTotalOverflow(overflows);
      }, [dessaggregations, selectedIndicator]);

    const handleDessaggregationTargetInputChange = (e: any, province: any, opt: any) => {
    const num =
      e.target.value ===
      ""
        ? 0
        : Number(
            e.target.value
          );
    setDessaggregations(
      (prev) => {
        const foundIndex =
          prev.findIndex(
            (d) =>
              d.dessaggration ===
                opt &&
              d.province ===
                province.province &&
              d.indicatorRef ===
                selectedIndicator?.indicatorRef
          );
        if (
          foundIndex !==
          -1
        ) {
          const copy = [
            ...prev,
          ];
          copy[
            foundIndex
          ] = {
            ...copy[
              foundIndex
            ],
            target: num,
          };
          return copy;
        } else {
          return [
            ...prev,
            {
              indicatorId:
                selectedIndicator!
                  .id,
              indicatorRef:
                selectedIndicator!
                  .indicatorRef,
              dessaggration:
                opt,
              province:
                province.province,
              target: num,
            },
          ];
        }
      }
    );
    }

    const hundleSubmit = () => {    
        axiosInstance
          .post("/projects/d/disaggregation", {dessaggregations: dessaggregations})
          .then((response: any) => reqForToastAndSetMessage(response.data.message))
          .catch((error: any) => {
            reqForToastAndSetMessage(error.response.data.message);
          });
    };

    const handleUpdateDessaggregation = () => {
    
        axiosInstance.put("/projects/dissaggregation", {
          "dessaggregations": dessaggregations
        })
        .then((response: any) => reqForToastAndSetMessage(response.data.message))
        .catch((error: any) => reqForToastAndSetMessage(error.response.data.message))
    
    }

    return (
        <>
        
            <Card className="h-full w-full relative overflow-auto">
                <CardHeader>
                  <CardTitle>Dessaggregation</CardTitle>
                  <CardDescription>
                    Define dessaggregation for your indicators.
                  </CardDescription>
                </CardHeader>

                <CardContent className="grid gap-6 overflow-auto">
                  <div className="flex flex-col gap-3 w-full">
                    {/* List all indicators */}
                    {indicators.filter((indicator) => indicator.id != null).map((item, index) => (
                      <Card key={index} className="w-full">
                        <CardContent className="flex items-center justify-between ">
                          <span className="text-base font-medium">
                            {item.indicator}
                          </span>
                          <Button
                            onClick={() => {
                              setSelectedIndicator(item);
                              setActiveDessaggregationTab(
                                item.dessaggregationType
                                  .charAt(0)
                                  .toUpperCase() +
                                  item.dessaggregationType
                                    .slice(1)
                                    .toLowerCase()
                              );
                              setDessaggregationBeforeEdit(dessaggregations);
                            }}
                          >
                            {mode == "create" ? "Add" : readOnly ? "Check" : "Edit"}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}

                    {selectedIndicator && (
                      <Dialog
                        open={true}
                        onOpenChange={() => {setDessaggregations(dessaggregationBeforeEdit); setSelectedIndicator(null)}}
                      >
                        <DialogContent className="flex flex-col justify-between sm:max-w-2xl md:max-w-4xl lg:max-w-6xl h-[90vh] overflow-auto">
                          <DialogHeader>
                            <DialogTitle>
                              {`${selectedIndicator.indicator}: (Target : ${selectedIndicator.target})`}
                            </DialogTitle>
                          </DialogHeader>
                          {/* Content */}
                          <div className="flex flex-col w-full h-full z-50">
                            {/* Tabs */}
                            <div className="flex flex-row items-center justify-around">
                              <Tabs
                                value={activeDessaggregationTab}
                                onValueChange={setActiveDessaggregationTab}
                                className="w-full h-full"
                              >
                                <TabsList className="items-center justify-around w-full">
                                  <TabsTrigger
                                    value={selectedIndicator.dessaggregationType.toLowerCase()}
                                  >
                                    {selectedIndicator.dessaggregationType.charAt(
                                      0
                                    ) +
                                      selectedIndicator.dessaggregationType
                                        .slice(1)
                                        .toLowerCase()}
                                  </TabsTrigger>
                                  {selectedIndicator.subIndicator && (
                                    <TabsTrigger
                                      value={selectedIndicator.subIndicator.dessaggregationType.toLowerCase()}
                                    >
                                      {selectedIndicator.subIndicator.dessaggregationType.charAt(
                                        0
                                      ) +
                                        selectedIndicator.subIndicator.dessaggregationType
                                          .slice(1)
                                          .toLowerCase()}
                                    </TabsTrigger>
                                  )}
                                </TabsList>

                                {/* Main indicator dessaggregation tab */}
                                <TabsContent
                                  className="w-full"
                                  value={selectedIndicator.dessaggregationType.toLowerCase()}
                                >
                                  {selectedIndicator.provinces.map(
                                    (province) => {
                                      const totalForProvince = dessaggregations
                                        .filter(
                                          (d) =>
                                            d.province === province.province &&
                                            d.indicatorRef ===
                                              selectedIndicator?.indicatorRef
                                        )
                                        .reduce(
                                          (sum, d) =>
                                            sum + Number(d.target || 0),
                                          0
                                        );

                                      return (
                                        <React.Fragment key={province.province}>
                                          <Table className="border-2 mx-auto w-[90%]">

                                            <TableCaption className="caption-top text-left">
                                              {`${province.province} (Target : ${province.target})`}
                                            </TableCaption>

                                            <TableHeader>
                                              <TableRow className="border-2 w-10">
                                                <TableHead className="text-center">
                                                  <Checkbox />
                                                </TableHead>
                                                <TableHead className="text-center">
                                                  Description
                                                </TableHead>
                                                <TableHead className="text-center">
                                                  Target
                                                </TableHead>
                                              </TableRow>
                                            </TableHeader>
                                            
                                            <TableBody>
                                              {(selectedIndicator?.dessaggregationType ==
                                              "session"
                                                ? sessionDessaggregationOptions
                                                : selectedIndicator?.dessaggregationType ==
                                                  "indevidual"
                                                ? indevidualDessaggregationOptions
                                                : enactDessaggregationOptions
                                              ).map((opt, i) => {
                                                const existing =
                                                  dessaggregations.find(
                                                    (d) =>
                                                      d.dessaggration === opt &&
                                                      d.province ===
                                                        province.province &&
                                                      d.indicatorRef ===
                                                        selectedIndicator?.indicatorRef
                                                  );
                                                const isChecked = !!existing;

                                                return (
                                                  <TableRow key={i}>
                                                    <TableCell className="text-center w-10">
                                                      <Checkbox
                                                        checked={isChecked}
                                                        onCheckedChange={(
                                                          checked
                                                        ) => {
                                                          if (checked) {
                                                            setDessaggregations(
                                                              (prev) => {
                                                                if (
                                                                  prev.some(
                                                                    (d) =>
                                                                      d.dessaggration ===
                                                                        opt &&
                                                                      d.province ===
                                                                        province.province &&
                                                                      d.indicatorRef ===
                                                                        selectedIndicator?.indicatorRef
                                                                  )
                                                                )
                                                                  return prev;
                                                                return [
                                                                  ...prev,
                                                                  {
                                                                    indicatorId:
                                                                      selectedIndicator!
                                                                        .id,
                                                                    indicatorRef:
                                                                      selectedIndicator!
                                                                        .indicatorRef,
                                                                    dessaggration:
                                                                      opt,
                                                                    province:
                                                                      province.province,
                                                                    target: 0,
                                                                  },
                                                                ];
                                                              }
                                                            );
                                                          } else {
                                                            setDessaggregations(
                                                              (prev) =>
                                                                prev.filter(
                                                                  (d) =>
                                                                    !(
                                                                      d.dessaggration ===
                                                                        opt &&
                                                                      d.province ===
                                                                        province.province &&
                                                                      d.indicatorRef ===
                                                                        selectedIndicator?.indicatorRef
                                                                    )
                                                                )
                                                            );
                                                          }
                                                        }}
                                                        disabled={readOnly}
                                                      />
                                                    </TableCell>

                                                    <TableCell className="text-center">
                                                      {opt}
                                                    </TableCell>

                                                    <TableCell>
                                                      <Input
                                                        type="number"
                                                        value={
                                                          existing
                                                            ? String(
                                                                existing.target
                                                              )
                                                            : ""
                                                        }
                                                        onChange={(e) => handleDessaggregationTargetInputChange(e, province, opt)}
                                                        className="mx-auto max-w-[200px] text-center"
                                                        disabled={readOnly}
                                                      />
                                                    </TableCell>
                                                  </TableRow>
                                                );
                                              })}

                                              <TableRow>
                                                <TableCell className="text-center w-10">
                                                  <Checkbox className="hidden" />
                                                </TableCell>
                                                <TableCell className="text-center">
                                                  TOTAL TARGET
                                                </TableCell>
                                                <TableCell>
                                                  <Input
                                                    disabled
                                                    value={totalForProvince}
                                                    className="mx-auto max-w-[200px] text-center"
                                                  />
                                                </TableCell>
                                              </TableRow>
                                            </TableBody>
                                          </Table>
                                          {/* Error previewer */}
                                          {totalForProvince >
                                            (province.target || 0) && (
                                            <div className="flex flex-row items-center justify-start w-[90%] mx-auto">
                                              <p className="text-red-500 text-sm mt-2">
                                                ⚠ The total target (
                                                {totalForProvince}) exceeds the
                                                assigned target (
                                                {province.target}) for{" "}
                                                {province.province}!
                                              </p>
                                            </div>
                                          )}
                                          {totalForProvince <
                                            (province.target || 0) && (
                                            <div className="flex flex-row items-center justify-start w-[90%] mx-auto">
                                              <p className="text-red-500 text-sm mt-2">
                                                ⚠ The total target (
                                                {totalForProvince}) should be equal to 
                                                assigned target (
                                                {province.target}) for{" "}
                                                {province.province}!
                                              </p>
                                            </div>
                                          )}
                                          <Separator className="my-5" />
                                        </React.Fragment>
                                      );
                                    }
                                  )}
                                </TabsContent>

                                {/* Sub indicator dessaggration tab */}
                                {selectedIndicator.subIndicator && (
                                  <TabsContent
                                    value={selectedIndicator.subIndicator.dessaggregationType.toLowerCase()}
                                  >
                                    {selectedIndicator.provinces.map(
                                      (province) => {
                                        const totalForProvince = dessaggregations
                                          .filter(
                                            (d) =>
                                              d.province ===
                                                province.province &&
                                              d.indicatorRef ===
                                                selectedIndicator?.subIndicator
                                                  ?.indicatorRef
                                          )
                                          .reduce(
                                            (sum, d) =>
                                              sum + Number(d.target || 0),
                                            0
                                          );

                                        return (
                                          <React.Fragment
                                            key={province.province}
                                          >
                                            <Table className="border-2 mx-auto w-[90%]">
                                              <TableCaption className="caption-top text-left">
                                                {province.province}
                                              </TableCaption>
                                              <TableHeader>
                                                <TableRow className="border-2 w-10">
                                                  <TableHead className="text-center">
                                                    <Checkbox />
                                                  </TableHead>
                                                  <TableHead className="text-center">
                                                    Description
                                                  </TableHead>
                                                  <TableHead className="text-center">
                                                    Target
                                                  </TableHead>
                                                </TableRow>
                                              </TableHeader>
                                              <TableBody>
                                                {(selectedIndicator
                                                  ?.subIndicator
                                                  ?.dessaggregationType ==
                                                "session"
                                                  ? sessionDessaggregationOptions
                                                  : indevidualDessaggregationOptions
                                                ).map((opt, i) => {
                                                  const existing =
                                                    dessaggregations.find(
                                                      (d) =>
                                                        d.dessaggration ===
                                                          opt &&
                                                        d.province ===
                                                          province.province &&
                                                        d.indicatorRef ===
                                                          selectedIndicator
                                                            ?.subIndicator
                                                            ?.indicatorRef
                                                    );
                                                  const isChecked = !!existing;

                                                  return (
                                                    <TableRow key={i}>
                                                      <TableCell className="text-center w-10">
                                                        <Checkbox
                                                          checked={isChecked}
                                                          onCheckedChange={(
                                                            checked
                                                          ) => {
                                                            if (checked) {
                                                              setDessaggregations(
                                                                (prev) => {
                                                                  if (
                                                                    prev.some(
                                                                      (d) =>
                                                                        d.dessaggration ===
                                                                          opt &&
                                                                        d.province ===
                                                                          province.province &&
                                                                        d.indicatorRef ===
                                                                          selectedIndicator
                                                                            ?.subIndicator
                                                                            ?.indicatorRef
                                                                    )
                                                                  )
                                                                    return prev;
                                                                  return [
                                                                    ...prev,
                                                                    {
                                                                      indicatorId:
                                                                        selectedIndicator!
                                                                          .subIndicator!.id,
                                                                      indicatorRef:
                                                                        selectedIndicator!
                                                                          .subIndicator!
                                                                          .indicatorRef,
                                                                      dessaggration:
                                                                        opt,
                                                                      province:
                                                                        province.province,
                                                                      target: 0,
                                                                    },
                                                                  ];
                                                                }
                                                              );
                                                            } else {
                                                              setDessaggregations(
                                                                (prev) =>
                                                                  prev.filter(
                                                                    (d) =>
                                                                      !(
                                                                        d.dessaggration ===
                                                                          opt &&
                                                                        d.province ===
                                                                          province.province &&
                                                                        d.indicatorRef ===
                                                                          selectedIndicator
                                                                            ?.subIndicator
                                                                            ?.indicatorRef
                                                                      )
                                                                  )
                                                              );
                                                            }
                                                          }}
                                                          disabled={readOnly}
                                                        />
                                                      </TableCell>

                                                      <TableCell className="text-center">
                                                        {opt}
                                                      </TableCell>

                                                      <TableCell>
                                                        <Input
                                                          type="number"
                                                          value={
                                                            existing
                                                              ? String(
                                                                  existing.target
                                                                )
                                                              : ""
                                                          }
                                                          onChange={(e) => {
                                                            const num =
                                                              e.target.value ===
                                                              ""
                                                                ? 0
                                                                : Number(
                                                                    e.target
                                                                      .value
                                                                  );
                                                            setDessaggregations(
                                                              (prev) => {
                                                                const foundIndex =
                                                                  prev.findIndex(
                                                                    (d) =>
                                                                      d.dessaggration ===
                                                                        opt &&
                                                                      d.province ===
                                                                        province.province &&
                                                                      d.indicatorRef ===
                                                                        selectedIndicator
                                                                          ?.subIndicator
                                                                          ?.indicatorRef
                                                                  );
                                                                if (
                                                                  foundIndex !==
                                                                  -1
                                                                ) {
                                                                  const copy = [
                                                                    ...prev,
                                                                  ];
                                                                  copy[
                                                                    foundIndex
                                                                  ] = {
                                                                    ...copy[
                                                                      foundIndex
                                                                    ],
                                                                    target: num,
                                                                  };
                                                                  return copy;
                                                                } else {
                                                                  return [
                                                                    ...prev,
                                                                    {
                                                                      indicatorId:
                                                                        selectedIndicator!
                                                                          .subIndicator!.id,
                                                                      indicatorRef:
                                                                        selectedIndicator!
                                                                          .subIndicator!
                                                                          .indicatorRef,
                                                                      dessaggration:
                                                                        opt,
                                                                      province:
                                                                        province.province,
                                                                      target:
                                                                        num,
                                                                    },
                                                                  ];
                                                                }
                                                              }
                                                            );
                                                          }}
                                                          className="mx-auto max-w-[200px] text-center"
                                                          disabled={readOnly}
                                                        />
                                                      </TableCell>
                                                    </TableRow>
                                                  );
                                                })}

                                                <TableRow>
                                                  <TableCell className="text-center w-10">
                                                    <Checkbox className="hidden" />
                                                  </TableCell>
                                                  <TableCell className="text-center">
                                                    TOTAL TARGET
                                                  </TableCell>
                                                  <TableCell>
                                                    <Input
                                                      disabled
                                                      value={totalForProvince}
                                                      className="mx-auto max-w-[200px] text-center"
                                                    />
                                                  </TableCell>
                                                </TableRow>
                                              </TableBody>
                                            </Table>
                                             {/* Error previewer */}
                                          {totalForProvince >
                                            (province.target || 0) && (
                                            <div className="flex flex-row items-center justify-start w-[90%] mx-auto">
                                              <p className="text-red-500 text-sm mt-2">
                                                ⚠ The total target (
                                                {totalForProvince}) exceeds the
                                                assigned target (
                                                {province.target}) for{" "}
                                                {province.province}!
                                              </p>
                                            </div>
                                          )}
                                          {totalForProvince <
                                            (province.target || 0) && (
                                            <div className="flex flex-row items-center justify-start w-[90%] mx-auto">
                                              <p className="text-red-500 text-sm mt-2">
                                                ⚠ The total target (
                                                {totalForProvince}) should be equal to 
                                                assigned target (
                                                {province.target}) for{" "}
                                                {province.province}!
                                              </p>
                                            </div>
                                          )}
                                            <Separator className="my-5" />
                                          </React.Fragment>
                                        );
                                      }
                                    )}
                                  </TabsContent>
                                )}
                              </Tabs>
                            </div>
                          </div>
                          <DialogFooter className="z-50">
                            <div className="flex flex-row items-center justify-end fixed -bottom-40 gap-2">
                              {!readOnly && (
                                <Button className="bg-blue-400" onClick={() => {
                                setDessaggregations((prev) => prev.filter((d) => (d.indicatorId != indicator.id)  
                              ))
                              }}>
                                Reset
                              </Button>
                              )}
                              <Button onClick={() => {
                                setDessaggregations(dessaggregationBeforeEdit);
                                setSelectedIndicator(null);
                              }} className="bg-red-400">
                                {readOnly ? "OK" : "Cancel"}
                              </Button>
                              {!readOnly && (
                                <Button
                                className="bg-green-400"
                                disabled={(() => {
                                  const selectedIndicatorId = selectedIndicator.id;
                                  const subIndicatorId = selectedIndicator.subIndicator?.id ?? null;

                                  let mainTotal = 0;
                                  let subTotal = 0;

                                  dessaggregations.forEach((d) => {
                                    if (d.indicatorId == selectedIndicatorId) mainTotal += Number(d.target);
                                    if (subIndicatorId && d.indicatorId == subIndicatorId) subTotal += Number(d.target);
                                  });

                                  const mainTarget = Number(selectedIndicator.target ?? 0);
                                  const subTarget = Number(selectedIndicator.subIndicator?.target ?? 0);

                                  if (
                                    mainTarget === mainTotal &&
                                    (!subIndicatorId || subTarget === subTotal)
                                  ) {
                                    return false; 
                                  }

                                  return true;
                                })()}
                                onClick={() => {
                                  setSelectedIndicator(null);
                                }}
                              >
                                Done
                              </Button>
                              )}

                            </div>
                        </DialogFooter> 
                        </DialogContent>    
                              
                      </Dialog>
                    )}
                  </div>
                </CardContent>


                <CardFooter className="flex flex-row items-center justify-end w-full absolute bottom-5">
                  {cardsBottomButtons(setCurrentTab, "indicator", mode == "create" ? hundleSubmit : readOnly ? undefined : handleUpdateDessaggregation, setCurrentTab, "aprPreview")}
                </CardFooter>
              </Card>

        </>
    )
}

export default DessaggregationForm;