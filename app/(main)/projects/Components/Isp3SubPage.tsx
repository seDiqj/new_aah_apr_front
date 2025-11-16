"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MultiSelect } from "@/components/multi-select";
import { Label } from "@/components/ui/label";
import { isp3s } from "../utils/OptionLists";
import React from "react";
import { Indicator, Isp3 } from "../types/Types";
import { useParentContext } from "@/contexts/ParentContext";
import { useProjectEditContext } from "../edit_project/[id]/page";
import { useProjectShowContext } from "../project_show/[id]/page";
import { useProjectContext } from "../create_new_project/page";
import { cardsBottomButtons } from "./CardsBottomButtons";
import { Isp3SubPageInterface } from "@/interfaces/Interfaces";
import { IsCreateMode, IsIndicatorSaved, IsShowMode } from "@/lib/Constants";

const Isp3SubPage: React.FC<Isp3SubPageInterface> = ({ mode }) => {
  const { axiosInstance, reqForToastAndSetMessage } = useParentContext();

  const {
    indicators,
    setCurrentTab,
    isp3,
    setIsp3,
  }: {
    indicators: Indicator[];
    setCurrentTab: (value: string) => void;
    isp3: Isp3[];
    setIsp3: React.Dispatch<React.SetStateAction<Isp3[]>>;
  } = IsCreateMode(mode)
    ? useProjectContext()
    : IsShowMode(mode)
    ? useProjectShowContext()
    : useProjectEditContext();

  const hundleSubmit = () => {
    if (readOnly) return;
    axiosInstance
      .post("/projects/is/isp3", {
        isp3s: isp3,
      })
      .then((response: any) => {
        reqForToastAndSetMessage(response.data.message);
      })
      .catch((error: any) => {
        reqForToastAndSetMessage(error.response.data.message);
      });
  };

  const readOnly = IsShowMode(mode);

  return (
    <>
      <Card className="h-full w-full relative overflow-auto">
        <CardHeader>
          <CardTitle>ISP3</CardTitle>
          <CardDescription>Link indicators to isp3.</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-6">
          {isp3s.map((name, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-4"
            >
              <Label className="whitespace-nowrap">{name}</Label>

              <div className="w-[280px] flex-shrink-0">
                <MultiSelect
                  options={indicators
                    .filter((indicator) => IsIndicatorSaved(indicator))
                    .map((ind) => ({
                      label: ind.indicatorRef,
                      value: String(ind.id),
                    }))}
                  value={isp3.find((i) => i.name === name)?.indicators ?? []}
                  onValueChange={(value: string[]) =>
                    setIsp3((prev) =>
                      prev.map((item) =>
                        item.name === name
                          ? {
                              ...item,
                              indicators: value,
                            }
                          : item
                      )
                    )
                  }
                  placeholder="Select indicator to link"
                  disabled={readOnly}
                />
              </div>
            </div>
          ))}
        </CardContent>

        <CardFooter className="flex flex-row items-center justify-end w-full absolute bottom-5">
          {cardsBottomButtons(
            setCurrentTab,
            "aprPreview",
            readOnly ? undefined : hundleSubmit,
            setCurrentTab,
            "finalization"
          )}
        </CardFooter>
      </Card>
    </>
  );
};

export default Isp3SubPage;
