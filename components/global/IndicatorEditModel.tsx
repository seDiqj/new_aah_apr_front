import { useEffect, useState } from "react";
import { SingleSelect } from "../single-select";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Separator } from "../ui/separator";
import calculateEachIndicatorProvinceTargetAccordingTONumberOFCouncilorCount, {
  calculateEachSubIndicatorProvinceTargetAccordingTONumberOFCouncilorCount,
} from "@/lib/IndicatorProvincesTargetCalculator";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useParentContext } from "@/contexts/ParentContext";
import { Plus } from "lucide-react";
import { useProjectContext } from "@/app/(main)/projects/create_new_project/page";
import { useProjectEditContext } from "@/app/(main)/projects/edit_project/[id]/page";
import { useProjectShowContext } from "@/app/(main)/projects/project_show/[id]/page";
import { Indicator, Output } from "@/app/(main)/projects/types/Types";
import { MultiSelect } from "../multi-select";
import { IndicatorDefault } from "@/lib/FormsDefaultValues";
import {
  CancelButtonMessage,
  IndicatorCreationMessage,
  IndicatorEditionMessage,
} from "@/lib/ConfirmationModelsTexts";
import {
  databases,
  indicatorStatus,
  indicatorTypes,
} from "@/lib/SingleAndMultiSelectOptionsList";
import { IndicatorModelInterface } from "@/interfaces/Interfaces";
import {
  HasSubIndicator,
  IsCreateMode,
  IsCreatePage,
  IsCurrentTypeOptionAvailable,
  IsEditMode,
  IsEditPage,
  IsIndicatorDatabaseEnactDatabase,
  IsIndicatorDatabaseMainDatabase,
  IsIndicatorEdited,
  IsMainDatabase,
  IsMainDatabaseNotAvailableForSelection,
  IsNotANullOrUndefinedValue,
  isNotASubIndicator,
  IsNotIndicatorDatabaseEnactDatabase,
  IsNotMainDatabase,
  IsNotShowMode,
  IsOutputSaved,
  IsShowMode,
  IsThereAndIndicatorWithEnteredReferanceAndDefferentId,
} from "@/lib/Constants";
import { stringToCapital } from "@/helpers/StringToCapital";
import { getStructuredProvinces } from "@/helpers/IndicatorFormHelpers";
import { AxiosError, AxiosResponse } from "axios";
import { RemoveIdFielsFromObj } from "@/helpers/GlobalHelpers";

export const IndicatorModel: React.FC<IndicatorModelInterface> = ({
  isOpen,
  onClose,
  mode,
  pageIdentifier,
  indicatorId,
}) => {
  const {
    reqForToastAndSetMessage,
    axiosInstance,
    reqForConfirmationModelFunc,
  } = useParentContext();
  const {
    indicators,
    setIndicators,
    outputs,
    projectProvinces,
  }: {
    indicators: Indicator[];
    setIndicators: React.Dispatch<React.SetStateAction<Indicator[]>>;
    outputs: Output[];
    projectProvinces: string[];
  } = IsCreatePage(pageIdentifier)
    ? useProjectContext()
    : IsEditPage(pageIdentifier)
    ? useProjectEditContext()
    : useProjectShowContext();

  const [local, setLocal] = useState<Indicator>(IndicatorDefault());
  const [indicatorBeforeEdit, setIndicatorBeforeEdit] = useState<Indicator>(
    IndicatorDefault()
  );
  const [reqForSubIndicator, setReqForSubIndicator] = useState<boolean>(false);

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    if (name == "subIndicatorName" && local.subIndicator) {
      setLocal((prev) => ({
        ...prev,
        subIndicator: {
          ...prev.subIndicator!,
          name: value,
        },
      }));

      return;
    } else if (name == "subIndicatorTarget" && local.subIndicator) {
      setLocal((prev) => ({
        ...prev,
        subIndicator: {
          ...prev.subIndicator!,
          target: Number(value),
        },
      }));

      return;
    }

    setLocal((prev) => {
      if (name == "target")
        calculateEachIndicatorProvinceTargetAccordingTONumberOFCouncilorCount(
          {
            ...prev,
            target: Number(value),
          },
          setLocal
        );

      return {
        ...prev,
        [name]:
          name === "target"
            ? Number(value)
            : name === "type"
            ? value || null
            : value,
      };
    });
  };

  const hundleIndicatorFormChange = (e: any) => {
    const { province, name, value } = e.target;
    if (!local.subIndicator) return;

    const updatedProvinces = local.subIndicator.provinces.map((p: any) =>
      p.province === province.province
        ? {
            ...p,
            councilorCount:
              name === "subIndicatorProvinceCouncilorCount"
                ? Number(value)
                : p.councilorCount,
            target:
              name === "subIndicatorProvinceTarget" ? Number(value) : p.target,
          }
        : p
    );

    setLocal((prev) => ({
      ...prev,
      subIndicator: {
        ...prev.subIndicator,
        provinces: updatedProvinces,
      } as any,
    }));
  };

  const handleAddSubIndicator = () => {
    if (IsNotMainDatabase(local.database)) {
      reqForToastAndSetMessage("Only main database can have a sub indicator.");
      return;
    }

    if (!reqForSubIndicator) {
      setLocal((prev) => ({
        ...prev,
        subIndicator: {
          id: null,
          indicatorRef: `sub-${prev.indicatorRef}`,
          name: "",
          target: 0,
          type: null,
          dessaggregationType:
            prev.dessaggregationType === "session" ? "indevidual" : "session",
          provinces: prev.provinces.map((province) => ({
            province: province.province,
            target: 0,
            councilorCount: 0,
          })),
        },
      }));

      setReqForSubIndicator(true);
    } else {
      setLocal((prev) => ({
        ...prev,
        subIndicator: null,
      }));

      setReqForSubIndicator(false);
    }
  };

  const hundleSubmit = () => {
    if (IsCreateMode(mode)) {
      axiosInstance
        .post("projects/i/indicator", { indicator: local })
        .then((response: any) => {
          setIndicators((prev) => [
            ...prev,
            {
              ...local,
              id: response.data.data.find(
                (indicator: { id: string; indicatorRef: string }) =>
                  indicator.indicatorRef == local.indicatorRef
              ).id,
              subIndicator: local.subIndicator
                ? {
                    ...local.subIndicator,
                    id: response.data.data.find(
                      (indicator: { id: string; indicatorRef: string }) =>
                        indicator.indicatorRef ==
                        local.subIndicator?.indicatorRef
                    ).id,
                  }
                : null,
            },
          ]);
          setLocal((prev) => {
            return {
              ...prev,
              id: response.data.data.find(
                (indicator: { id: string; indicatorRef: string }) =>
                  indicator.indicatorRef == local.indicatorRef
              ).id,
              subIndicator: prev.subIndicator
                ? {
                    ...prev.subIndicator,
                    id: response.data.data.find(
                      (indicator: { id: string; indicatorRef: string }) =>
                        indicator.indicatorRef ==
                        local.subIndicator?.indicatorRef
                    ).id,
                  }
                : null,
            };
          });
          reqForToastAndSetMessage(response.data.message);
          onClose();
        })
        .catch((error: any) => {
          reqForToastAndSetMessage(error.response.data.message);
        });
    } else if (IsEditMode(mode)) {
      if (
        IsThereAndIndicatorWithEnteredReferanceAndDefferentId(indicators, local)
      ) {
        reqForToastAndSetMessage(
          "A project can not have two indicators with same referance !"
        );
        return;
      } else if (!IsIndicatorEdited(indicatorBeforeEdit, local)) {
        reqForToastAndSetMessage("No changes were made !");
        onClose();
        return;
      }

      setIndicators((prev) =>
        prev.map((ind) =>
          ind.indicatorRef == local.indicatorRef ? local : ind
        )
      );

      axiosInstance
        .put(`/projects/indicator/${local.id}`, local)
        .then((response: any) => {
          reqForToastAndSetMessage(response.data.message);
          onClose();
        })
        .catch((error: any) =>
          reqForToastAndSetMessage(error.response.data.message)
        );
    }
  };

  const availableDatabasesForSelection = () => {
    return databases.filter((opt) => {
      if (opt.value == "main_database") {
        if (IsMainDatabaseNotAvailableForSelection(indicators)) return false;
      }
      return true;
    });
  };

  const availableTypes = () => {
    return indicatorTypes.filter(
      (opt) => !IsCurrentTypeOptionAvailable(indicators, opt, local)
    );
  };

  const savedOuputs = () => {
    return outputs
      .filter((output) => IsOutputSaved(output))
      .map((output) => ({ value: output.id!, label: output.outputRef }));
  };

  const handleIndicatorProvincesChange = (provinces: string[]) => {
    if (!HasSubIndicator(local)) {
      setLocal((prev) => {
        calculateEachIndicatorProvinceTargetAccordingTONumberOFCouncilorCount(
          {
            ...prev,
            provinces: provinces.map((p) => ({
              province: p,
              target:
                indicatorBeforeEdit.provinces.find(
                  (province) => province.province == p
                )?.target ?? 0,
              councilorCount:
                indicatorBeforeEdit.provinces.find(
                  (province) => province.province == p
                )?.councilorCount ?? 0,
            })),
          },
          setLocal
        );
        return {
          ...prev,
          provinces: provinces.map((p) => ({
            province: p,
            target:
              indicatorBeforeEdit.provinces.find(
                (province) => province.province == p
              )?.target ?? 0,
            councilorCount:
              indicatorBeforeEdit.provinces.find(
                (province) => province.province == p
              )?.councilorCount ?? 0,
          })),
        };
      });
    } else {
      setLocal((prev) => {
        calculateEachIndicatorProvinceTargetAccordingTONumberOFCouncilorCount(
          {
            ...prev,
            provinces: provinces.map((p) => ({
              province: p,
              target:
                indicatorBeforeEdit.provinces.find(
                  (province) => province.province == p
                )?.target ?? 0,
              councilorCount:
                indicatorBeforeEdit.provinces.find(
                  (province) => province.province == p
                )?.councilorCount ?? 0,
            })),
          },
          setLocal
        );

        return {
          ...prev,
          provinces: provinces.map((p) => ({
            province: p,
            target:
              indicatorBeforeEdit.provinces.find(
                (province) => province.province == p
              )?.target ?? 0,
            councilorCount:
              indicatorBeforeEdit.provinces.find(
                (province) => province.province == p
              )?.councilorCount ?? 0,
          })),
          subIndicator: {
            ...prev.subIndicator,
            id: prev.subIndicator!.id,
            indicatorRef: prev.subIndicator!.indicatorRef,
            name: prev.subIndicator!.name,
            target: prev.subIndicator!.target,
            type: prev.subIndicator!.type,
            dessaggregationType: prev.subIndicator!.dessaggregationType,
            provinces: provinces.map((p) => ({
              province: p,
              target: 0,
              councilorCount: 0,
            })),
          },
        };
      });
    }
  };

  const handleCouncilorCountInputChange = (
    councilorCount: number,
    province: string
  ) => {
    setLocal((prev) => {
      const updatedProvinces = prev.provinces.map((p) =>
        p.province === province
          ? {
              ...p,
              councilorCount: councilorCount,
            }
          : p
      );

      calculateEachIndicatorProvinceTargetAccordingTONumberOFCouncilorCount(
        {
          ...prev,
          provinces: updatedProvinces,
        },
        setLocal
      );

      return {
        ...prev,
        provinces: updatedProvinces,
      };
    });
  };

  const handleSubIndicatorCouncilorCountInputChange = (
    councilorCount: number,
    province: string
  ) => {
    if (isNotASubIndicator(local.subIndicator)) return;
    setLocal((prev) => {
      const updatedProvinces = prev.subIndicator!.provinces.map((p) =>
        p.province == province ? { ...p, councilorCount: councilorCount } : p
      );

      calculateEachSubIndicatorProvinceTargetAccordingTONumberOFCouncilorCount(
        {
          ...prev,
          subIndicator: {
            ...prev.subIndicator!,
            provinces: updatedProvinces,
          },
        },
        setLocal
      );

      return {
        ...prev,
        subIndicator: {
          ...prev.subIndicator!,
          provinces: updatedProvinces,
        },
      };
    });
  };

  const handleProvinceTargetChange = (newTarget: number, province: string) => {
    setLocal((prev) => {
      return {
        ...prev,
        provinces: prev.provinces.map((p) =>
          p.province === province ? { ...p, target: newTarget } : p
        ),
      };
    });
  };

  const handleCancel = () => {
    if (IsEditMode(mode) && IsIndicatorEdited(indicatorBeforeEdit, local)) {
      reqForConfirmationModelFunc(CancelButtonMessage, onClose);

      return;
    }

    onClose();
  };

  useEffect(() => {
    if (
      (IsEditMode(mode) || IsShowMode(mode)) &&
      IsNotANullOrUndefinedValue(indicatorId)
    ) {
      axiosInstance
        .get(`projects/indicator/${indicatorId}`)
        .then((response: AxiosResponse<any, any, {}>) => {
          setLocal(response.data.data);
          setIndicatorBeforeEdit(response.data.data);
        })
        .catch((error: AxiosError<any, any>) =>
          reqForToastAndSetMessage(error.response?.data.message)
        );
    }
  }, [indicatorId, isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="sm:max-w-4xl border border-gray-300 dark:border-gray-600 rounded-lg ml-16 overflow-hidden"
        style={{
          minHeight: "85vh",
          paddingTop: "10px",
          paddingBottom: "10px",
          paddingLeft: "16px",
          paddingRight: "16px",
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {IsEditMode(mode)
              ? "Edit Indicator"
              : IsCreateMode(mode)
              ? "Create New Indicator"
              : "Show Indicator"}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 overflow-auto h-[400px]">
          <div className="flex flex-col gap-1">
            <Label htmlFor="indicator">Indicator</Label>
            <Textarea
              id="indicator"
              name="indicator"
              value={local.indicator || ""}
              onChange={handleChange}
              placeholder="Indicator name"
              disabled={IsShowMode(mode)}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="indicatorRef">Indicator Reference</Label>
            <Input
              id="indicatorRef"
              name="indicatorRef"
              value={local.indicatorRef || ""}
              onChange={handleChange}
              placeholder="Indicator reference"
              disabled={IsShowMode(mode)}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <Label htmlFor="target">Target</Label>
              <Input
                id="target"
                name="target"
                type="number"
                value={local.target ?? 0}
                onChange={handleChange}
                placeholder="Target"
                disabled={IsShowMode(mode)}
              />
            </div>

            <div className="flex-1 flex flex-col gap-1">
              <Label htmlFor="status">Status</Label>
              <SingleSelect
                value={local.status}
                onValueChange={(v: string) =>
                  setLocal((prev) => ({ ...prev, status: v }))
                }
                options={indicatorStatus}
                placeholder="Select status"
                disabled={IsShowMode(mode)}
              />
            </div>
          </div>

          <div className="flex gap-4 flex-col">
            <div className="flex-1 flex flex-col gap-1">
              <Label>Database</Label>
              <SingleSelect
                options={availableDatabasesForSelection()}
                value={local.database}
                onValueChange={(value: string) =>
                  setLocal((prev) => ({
                    ...prev,
                    database: value,
                  }))
                }
                disabled={IsShowMode(mode)}
              />

              {IsMainDatabase(local) && (
                <div className="flex flex-col gap-1 col-span-full">
                  <Label>Type</Label>
                  <SingleSelect
                    options={availableTypes()}
                    value={local.type as unknown as string}
                    onValueChange={(value: string) =>
                      setLocal((prev) => ({
                        ...prev,
                        type: value,
                      }))
                    }
                    disabled={IsShowMode(mode)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Indicator output */}
          <div className="flex-1 flex flex-col gap-1">
            <Label>Output</Label>
            <SingleSelect
              options={savedOuputs()}
              value={local.outputId ?? "Unknown output"}
              onValueChange={(value: string) =>
                setLocal((prev) => ({
                  ...prev,
                  outputId: value,
                }))
              }
              disabled={IsShowMode(mode)}
            />
          </div>

          {/* provinces */}
          <div className="flex flex-col gap-1 col-span-full">
            <Label htmlFor={`province`}>Indicator Provinces</Label>
            <MultiSelect
              options={getStructuredProvinces(projectProvinces)}
              value={local.provinces.map((province) => province.province)}
              onValueChange={(value: string[]) =>
                handleIndicatorProvincesChange(value)
              }
              // error={indicatorFormErrors.provinces}
              disabled={IsShowMode(mode)}
            />
          </div>

          {/* dessaggregation type */}
          <div className="flex flex-col gap-1 col-span-full">
            <Label htmlFor={`dessaggregationType`}>Dessagreggation Type</Label>
            <RadioGroup
              name="dessaggregationType"
              value={local.dessaggregationType}
              onValueChange={(value: string) => {
                const e = {
                  target: { name: "dessaggregationType", value: value },
                };
                handleChange(e);
              }}
              className="flex gap-6"
            >
              {IsIndicatorDatabaseMainDatabase(local) && (
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="session"
                    id="session"
                    disabled={IsShowMode(mode)}
                  />
                  <Label htmlFor={"session"}>Session</Label>
                </div>
              )}

              {IsNotIndicatorDatabaseEnactDatabase(local) && (
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="indevidual"
                    id="indevidual"
                    disabled={IsShowMode(mode)}
                  />
                  <Label htmlFor={"individual"}>Indevidual</Label>
                </div>
              )}

              {IsIndicatorDatabaseEnactDatabase(local) && (
                <div className="flex items-center gap-2">
                  <RadioGroupItem
                    value="enact"
                    id="enact"
                    disabled={IsShowMode(mode)}
                  />
                  <Label htmlFor={"enact"}>Enact</Label>
                </div>
              )}
            </RadioGroup>
          </div>

          {local.provinces && (
            <div className="flex flex-col gap-4 mt-4">
              <Separator className="my-2" />
              {local.provinces.map((province, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                >
                  <div>
                    <span>{province.province}</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor={`${province.province}-count`}>
                      Councular Count
                    </Label>
                    <Input
                      id={`${province.province}-count`}
                      type="number"
                      value={province.councilorCount}
                      onChange={(e) =>
                        handleCouncilorCountInputChange(
                          Number(e.target.value),
                          province.province
                        )
                      }
                      placeholder={`${stringToCapital(
                        province.province
                      )} Councular Count ...`}
                      disabled={IsShowMode(mode)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor={`${province.province}-target`}>
                      Target
                    </Label>
                    <Input
                      id={`${province.province}-target`}
                      type="number"
                      value={province.target || 0}
                      onChange={(e) => {
                        handleProvinceTargetChange(
                          Number(e.target.value),
                          province.province
                        );
                      }}
                      placeholder={`${stringToCapital(
                        province.province
                      )} Target ...`}
                      disabled={IsShowMode(mode)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={local.description || ""}
              onChange={handleChange}
              placeholder="Optional description"
              disabled={IsShowMode(mode)}
            />
          </div>

          {/* sub indicator if its not null */}
          {local.subIndicator && (
            <div className="flex flex-col gap-2">
              <Label>Sub Indicator</Label>
              <div className="flex flex-col gap-2">
                <Input
                  name="subIndicatorName"
                  value={local.subIndicator.name}
                  onChange={handleChange}
                  placeholder="Sub Indicator Name"
                  disabled={IsShowMode(mode)}
                />
                <Input
                  name="subIndicatorTarget"
                  type="number"
                  value={local.subIndicator.target}
                  onChange={handleChange}
                  placeholder="Sub Indicator Target"
                  disabled={IsShowMode(mode)}
                />
                {/* sub indicator provinces and its target */}
                {local.subIndicator?.provinces.map((province, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center"
                  >
                    <div>
                      <span>{stringToCapital(province.province)}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label htmlFor={`${province.province}-count`}>
                        Councular Count
                      </Label>
                      <Input
                        id={`${province.province}-count`}
                        type="number"
                        name="subIndicatorProvinceCouncilorCount"
                        value={province.councilorCount || 0}
                        onChange={(e) =>
                          handleSubIndicatorCouncilorCountInputChange(
                            Number(e.target.value),
                            province.province
                          )
                        }
                        disabled={IsShowMode(mode)}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label htmlFor={`${province.province}-target`}>
                        Target
                      </Label>
                      <Input
                        id={`${province.province}-target`}
                        type="number"
                        name="subIndicatorProvinceTarget"
                        value={province.target || 0}
                        onChange={(e) => {
                          hundleIndicatorFormChange({
                            target: {
                              province: province,
                              name: e.target.name,
                              value: e.target.value,
                            },
                          });
                        }}
                        disabled={IsShowMode(mode)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {IsNotShowMode(mode) && (
          <DialogFooter>
            <div className="flex gap-2 justify-end w-full fixed bottom-2">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                type="button"
                className="flex items-center gap-2"
                onClick={handleAddSubIndicator}
                disabled={IsNotMainDatabase(local.database)}
              >
                <Plus size={16} />
                {reqForSubIndicator
                  ? "Remove Sub Indicator"
                  : "Add Sub Indicator"}
              </Button>
              <Button
                onClick={() => {
                  reqForConfirmationModelFunc(
                    IsCreateMode(mode)
                      ? IndicatorCreationMessage
                      : IndicatorEditionMessage,
                    hundleSubmit
                  );
                }}
              >
                Save
              </Button>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default IndicatorModel;
