"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cardsBottomButtons } from "./CardsBottomButtons";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React, { useState } from "react";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useProjectContext } from "../create_new_project/page";
import {
  Dessaggregation,
  Indicator,
  IndicatorProvinceType,
} from "../types/Types";
import { useParentContext } from "@/contexts/ParentContext";
import { useProjectEditContext } from "../edit_project/[id]/page";
import { useProjectShowContext } from "../project_show/[id]/page";
import { stringToCapital } from "@/helpers/StringToCapital";
import {
  AreDessaggregationsEdited,
  HasDessaggregationTheseFeature,
  IsCreateMode,
  IsIndicatorSaved,
  IsNotShowMode,
  IsNotSubIndicator,
  IsShowMode,
  IsTheDessaggregationOfThisIndicatorAndProvince,
  isTheTotalTargetOfDessaggregationsEqualToTotalTargetOfIndicator,
  IsTotalOfDessaggregationsOfProvinceBiggerThenTotalOfProvince,
  IsTotalOfDessaggregationsOfProvinceLessThenTotalOfProvince,
  WasIndexFound,
} from "@/constants/Constants";
import {
  getReliableDessaggregationOptionsAccordingToDessagregationType,
  getReliableDessaggregationOptionsForSubIndicatorAccordingToDessagregationType,
} from "@/helpers/DessaggregationFormHelpers";
import { DessaggregationFromInterface } from "@/interfaces/Interfaces";
import {
  CancelButtonMessage,
  DoneButtonMessage,
  ResetButtonMessage,
} from "@/constants/ConfirmationModelsTexts";
import { SUBMIT_BUTTON_PROVIDER_ID } from "@/config/System";

const DessaggregationForm: React.FC<DessaggregationFromInterface> = ({
  mode,
}) => {
  const {
    indicators,
    setCurrentTab,
    dessaggregations,
    setDessaggregations,
  }: {
    indicators: Indicator[];
    setCurrentTab: (value: string) => void;
    dessaggregations: Dessaggregation[];
    setDessaggregations: React.Dispatch<
      React.SetStateAction<Dessaggregation[]>
    >;
  } = IsCreateMode(mode)
    ? useProjectContext()
    : IsShowMode(mode)
      ? useProjectShowContext()
      : useProjectEditContext();

  const {
    reqForToastAndSetMessage,
    requestHandler,
    reqForConfirmationModelFunc,
  } = useParentContext();

  let [selectedIndicator, setSelectedIndicator] = useState<Indicator | null>();

  const [activeDessaggregationTab, setActiveDessaggregationTab] = useState<
    string | undefined
  >(undefined);

  const [dessaggregationBeforeEdit, setDessaggregationBeforeEdit] = useState<
    Dessaggregation[]
  >([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const hundleSubmit = (indicatorId: string | null) => {
    if (!indicatorId) return;
    setIsLoading(true);
    requestHandler()
      .post("/projects/d/disaggregation", {
        dessaggregations: dessaggregations.filter(
          (d) =>
            d.indicatorId == indicatorId ||
            d.indicatorId ==
              indicators.find((ind) => ind.parent_indicator == indicatorId)
                ?.id ||
            d.indicatorId ==
              indicators.find((ind) => ind.id == indicatorId)?.subIndicator?.id,
        ),
      })
      .then((response: any) => {
        setSelectedIndicator(null);
        reqForToastAndSetMessage(response.data.message, "success");
      })
      .catch((error: any) => {
        reqForToastAndSetMessage(error.response.data.message, "error");
      })
      .finally(() => setIsLoading(false));
  };

  const addOrRemoveDessaggregation = (
    shouldBeAdd: boolean,
    description: string,
    province: string,
    indicator: { id: string | null; indicatorRef: string },
  ) => {
    if (shouldBeAdd) {
      setDessaggregations((prev) => {
        // Check if dessaggregation is already in dessaggregations list.
        if (
          prev.some((d) =>
            HasDessaggregationTheseFeature(
              d,
              description,
              province,
              indicator.indicatorRef,
            ),
          )
        )
          return prev;
        return [
          ...prev,
          {
            id: null,
            indicatorId: indicator!.id,
            indicatorRef: indicator!.indicatorRef,
            dessaggration: description,
            province: province,
            target: 0,
          },
        ];
      });
    } else {
      setDessaggregations((prev) =>
        prev.filter(
          (d) =>
            !HasDessaggregationTheseFeature(
              d,
              description,
              province,
              indicator.indicatorRef,
            ),
        ),
      );
    }
  };

  const calculateProvinceDessaggregationsTotal = (
    province: string,
    indicatorRef: string,
  ) => {
    return dessaggregations
      .filter((d) =>
        IsTheDessaggregationOfThisIndicatorAndProvince(
          d,
          province,
          indicatorRef,
        ),
      )
      .reduce((sum, d) => sum + Number(d.target || 0), 0);
  };

  const handleDessaggregationsInputsChange = (
    description: string,
    province: string,
    indicator: { id: string | null; indicatorRef: string },
    newTarget: string | number,
  ) => {
    const num = newTarget === "" ? 0 : Number(newTarget);
    setDessaggregations((prev) => {
      const foundIndex = prev.findIndex((d) =>
        HasDessaggregationTheseFeature(
          d,
          description,
          province,
          indicator.indicatorRef,
        ),
      );
      if (WasIndexFound(foundIndex)) {
        const copy = [...prev];
        copy[foundIndex] = { ...copy[foundIndex], target: num };
        return copy;
      } else {
        return [
          ...prev,
          {
            id: null,
            indicatorId: indicator.id,
            indicatorRef: indicator.indicatorRef,
            dessaggration: description,
            province: province,
            target: num,
          },
        ];
      }
    });
  };

  const onCancel = () => {
    if (AreDessaggregationsEdited(dessaggregationBeforeEdit, dessaggregations))
      reqForConfirmationModelFunc(CancelButtonMessage, () => {
        setDessaggregations(dessaggregationBeforeEdit);
        setSelectedIndicator(null);
      });
    else {
      setDessaggregations(dessaggregationBeforeEdit);
      setSelectedIndicator(null);
    }
  };

  const readOnly = IsShowMode(mode);

  return (
    <>
      <Card className="h-full w-full relative overflow-auto">
        <CardHeader>
          <CardTitle>Dessaggregation</CardTitle>
          <CardDescription>
            Define dessaggregation for your indicators.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6 overflow-auto h-[70%]">
          <div className="flex flex-col gap-3 w-full">
            {/* List all indicators */}
            {indicators
              .filter(
                (indicator) =>
                  IsIndicatorSaved(indicator) && IsNotSubIndicator(indicator),
              )
              .map((item, index) => (
                <Card key={index} className="w-full">
                  <CardContent className="flex items-center justify-between ">
                    <span
                      title={`Indicator: ${
                        item.indicator
                      } \nIndicator Referance: ${
                        item.indicatorRef
                      } \nDatabase: ${
                        item.database
                      } \nProvinces: ${item.provinces
                        .map(
                          (provinceObj: IndicatorProvinceType) =>
                            provinceObj.province,
                        )
                        .join(", ")} \nDessaggregation Type: ${
                        item.dessaggregationType
                      } \nTarget: ${item.target}`}
                      className="text-base font-medium max-w-[250px] truncate cursor-pointer"
                    >
                      {item.indicatorRef}
                    </span>
                    <Button
                      onClick={() => {
                        setSelectedIndicator(item);
                        setActiveDessaggregationTab(
                          stringToCapital(item.dessaggregationType),
                        );
                        setDessaggregationBeforeEdit(dessaggregations);
                      }}
                    >
                      {IsCreateMode(mode)
                        ? "Add"
                        : IsShowMode(mode)
                          ? "Check"
                          : "Edit"}
                    </Button>
                  </CardContent>
                </Card>
              ))}

            {selectedIndicator && (
              <Dialog
                open={true}
                onOpenChange={() => {
                  setDessaggregations(dessaggregationBeforeEdit);
                  setSelectedIndicator(null);
                }}
              >
                <DialogContent className="flex flex-col justify-between sm:max-w-2xl md:max-w-4xl lg:max-w-6xl h-[90vh]">
                  <DialogHeader>
                    <DialogTitle
                      title={`Indicator : ${selectedIndicator.indicator}`}
                    >
                      {`${selectedIndicator.indicatorRef}: (Target : ${selectedIndicator.target})`}
                    </DialogTitle>
                  </DialogHeader>

                  {/* Form content */}
                  <div className="flex flex-col w-full h-full z-50 overflow-auto">
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
                            {stringToCapital(
                              selectedIndicator.dessaggregationType,
                            )}
                          </TabsTrigger>
                          {selectedIndicator.subIndicator && (
                            <TabsTrigger
                              value={selectedIndicator.subIndicator.dessaggregationType.toLowerCase()}
                            >
                              {stringToCapital(
                                selectedIndicator.subIndicator
                                  .dessaggregationType,
                              )}
                            </TabsTrigger>
                          )}
                        </TabsList>

                        {/* Main indicator dessaggregation tab */}
                        <TabsContent
                          className="w-full"
                          value={selectedIndicator.dessaggregationType.toLowerCase()}
                        >
                          {selectedIndicator.provinces.map((province) => {
                            const totalForProvince =
                              calculateProvinceDessaggregationsTotal(
                                province.province,
                                selectedIndicator.indicatorRef,
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
                                    {getReliableDessaggregationOptionsAccordingToDessagregationType(
                                      selectedIndicator.dessaggregationType,
                                    ).map((opt, i) => {
                                      const existing = dessaggregations.find(
                                        (d) =>
                                          HasDessaggregationTheseFeature(
                                            d,
                                            opt,
                                            province.province,
                                            selectedIndicator?.indicatorRef,
                                          ),
                                      );
                                      // Just cuse we need a boolean value.
                                      const isChecked = !!existing;

                                      return (
                                        <TableRow key={i}>
                                          <TableCell className="text-center w-10">
                                            <Checkbox
                                              checked={isChecked}
                                              onCheckedChange={(checked) =>
                                                addOrRemoveDessaggregation(
                                                  checked as unknown as boolean,
                                                  opt,
                                                  province.province,
                                                  selectedIndicator,
                                                )
                                              }
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
                                                  ? String(existing.target)
                                                  : ""
                                              }
                                              onChange={(e) =>
                                                handleDessaggregationsInputsChange(
                                                  opt,
                                                  province.province,
                                                  selectedIndicator,
                                                  e.target.value,
                                                )
                                              }
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
                                {IsTotalOfDessaggregationsOfProvinceBiggerThenTotalOfProvince(
                                  totalForProvince,
                                  province.target || 0,
                                ) && (
                                  <div className="flex flex-row items-center justify-start w-[90%] mx-auto">
                                    <p className="text-red-500 text-sm mt-2">
                                      ⚠ The total target ({totalForProvince})
                                      exceeds the assigned target (
                                      {province.target}) for {province.province}
                                      !
                                    </p>
                                  </div>
                                )}
                                {IsTotalOfDessaggregationsOfProvinceLessThenTotalOfProvince(
                                  totalForProvince,
                                  province.target || 0,
                                ) && (
                                  <div className="flex flex-row items-center justify-start w-[90%] mx-auto">
                                    <p className="text-red-500 text-sm mt-2">
                                      ⚠ The total target ({totalForProvince})
                                      should be equal to assigned target (
                                      {province.target}) for {province.province}
                                      !
                                    </p>
                                  </div>
                                )}
                                <Separator className="my-5" />
                              </React.Fragment>
                            );
                          })}
                        </TabsContent>

                        {/* Sub indicator dessaggration tab */}
                        {selectedIndicator.subIndicator && (
                          <TabsContent
                            value={selectedIndicator.subIndicator.dessaggregationType.toLowerCase()}
                          >
                            {selectedIndicator.subIndicator.provinces.map(
                              (province) => {
                                const totalForProvince =
                                  calculateProvinceDessaggregationsTotal(
                                    province.province,
                                    selectedIndicator?.subIndicator!
                                      .indicatorRef,
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
                                        {getReliableDessaggregationOptionsForSubIndicatorAccordingToDessagregationType(
                                          selectedIndicator.subIndicator!
                                            .dessaggregationType,
                                        ).map((opt, i) => {
                                          const existing =
                                            dessaggregations.find((d) =>
                                              HasDessaggregationTheseFeature(
                                                d,
                                                opt,
                                                province.province,
                                                selectedIndicator?.subIndicator!
                                                  .indicatorRef,
                                              ),
                                            );

                                          // Just cuse we need a boolean value.
                                          const isChecked = !!existing;

                                          return (
                                            <TableRow key={i}>
                                              <TableCell className="text-center w-10">
                                                <Checkbox
                                                  checked={isChecked}
                                                  onCheckedChange={(checked) =>
                                                    addOrRemoveDessaggregation(
                                                      checked as unknown as boolean,
                                                      opt,
                                                      province.province,
                                                      selectedIndicator.subIndicator!,
                                                    )
                                                  }
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
                                                      ? String(existing.target)
                                                      : ""
                                                  }
                                                  onChange={(e) => {
                                                    handleDessaggregationsInputsChange(
                                                      opt,
                                                      province.province,
                                                      selectedIndicator.subIndicator!,
                                                      e.target.value,
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
                                    {IsTotalOfDessaggregationsOfProvinceBiggerThenTotalOfProvince(
                                      totalForProvince,
                                      province.target,
                                    ) && (
                                      <div className="flex flex-row items-center justify-start w-[90%] mx-auto">
                                        <p className="text-red-500 text-sm mt-2">
                                          ⚠ The total target ({totalForProvince}
                                          ) exceeds the assigned target (
                                          {province.target}) for{" "}
                                          {province.province}!
                                        </p>
                                      </div>
                                    )}
                                    {IsTotalOfDessaggregationsOfProvinceLessThenTotalOfProvince(
                                      totalForProvince,
                                      province.target,
                                    ) && (
                                      <div className="flex flex-row items-center justify-start w-[90%] mx-auto">
                                        <p className="text-red-500 text-sm mt-2">
                                          ⚠ The total target ({totalForProvince}
                                          ) should be equal to assigned target (
                                          {province.target}) for{" "}
                                          {province.province}!
                                        </p>
                                      </div>
                                    )}
                                    <Separator className="my-5" />
                                  </React.Fragment>
                                );
                              },
                            )}
                          </TabsContent>
                        )}
                      </Tabs>
                    </div>
                  </div>

                  <DialogFooter className="z-50">
                    <div className="flex flex-row items-center justify-end fixed bottom-0 gap-4">
                      {IsNotShowMode(mode) && (
                        <Button
                          className="bg-blue-400"
                          onClick={() =>
                            reqForConfirmationModelFunc(
                              ResetButtonMessage,
                              () =>
                                setDessaggregations((prev) =>
                                  prev.filter(
                                    (d) =>
                                      d.indicatorId != selectedIndicator.id,
                                  ),
                                ),
                            )
                          }
                        >
                          Reset
                        </Button>
                      )}
                      <Button onClick={onCancel} className="bg-red-400">
                        Cancel
                      </Button>
                      {IsNotShowMode(mode) && (
                        <Button
                          id={SUBMIT_BUTTON_PROVIDER_ID}
                          type="button"
                          className="bg-green-400"
                          disabled={
                            isTheTotalTargetOfDessaggregationsEqualToTotalTargetOfIndicator(
                              selectedIndicator,
                              dessaggregations,
                            ) || isLoading
                          }
                          onClick={(e) => {
                            if (
                              isTheTotalTargetOfDessaggregationsEqualToTotalTargetOfIndicator(
                                selectedIndicator,
                                dessaggregations,
                              )
                            ) {
                              reqForToastAndSetMessage(
                                "The total target of dessaggregations should be equal to total target of indicator !",
                              );
                              return;
                            }
                            reqForConfirmationModelFunc(
                              DoneButtonMessage,
                              () => {
                                hundleSubmit(selectedIndicator.id);
                              },
                            );
                          }}
                        >
                          {isLoading ? "Saving ..." : "Save"}
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
          {cardsBottomButtons(
            setCurrentTab,
            "indicator",
            undefined,
            false,
            setCurrentTab,
            "aprPreview",
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default DessaggregationForm;
