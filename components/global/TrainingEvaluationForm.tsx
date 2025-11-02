"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useParentContext } from "@/contexts/ParentContext";
import { useParams } from "next/navigation";

type Evaluation = {
  participant: number;
  selected: string;
};

interface ComponentProps {
  previosTrainingEvaluations?: {
    evaluations: {
      informative: number;
      usefulness: number;
      understanding: number;
      relevance: number;
      applicability: number;
    };
    remark: string;
  } | null;
}

const TrainingEvaluationForm: React.FC<ComponentProps> = ({
  previosTrainingEvaluations,
}) => {
  const { id } = useParams<{
    id: string;
  }>();

  const { reqForToastAndSetMessage, axiosInstance, reqForConfirmationModelFunc } = useParentContext();

  const [evaluations, setEvaluations] = useState<Evaluation[]>([
    { participant: 1, selected: "" },
  ]);
  const [remark, setRemark] = useState("");

  const handleSelect = (index: number, value: string) => {
    setEvaluations((prev) =>
      prev.map((evalItem, i) =>
        i === index ? { ...evalItem, selected: value } : evalItem
      )
    );
  };

  const addEvaluation = () => {
    setEvaluations((prev) => [
      ...prev,
      { participant: prev.length + 1, selected: "" },
    ]);
  };

  const summary = evaluations.reduce(
    (acc, curr) => {
      if (curr.selected) acc[curr.selected as keyof typeof acc]++;
      return acc;
    },
    {
      informative: 0,
      usefulness: 0,
      understanding: 0,
      relevance: 0,
      applicability: 0,
    }
  );

  const totalSelections = Object.values(summary).reduce(
    (sum, val) => sum + val,
    0
  );

  const informativePercentage =
    totalSelections > 0
      ? ((summary.informative / totalSelections) * 100).toFixed(1)
      : "0";

  const handleSubmit = () => {
    axiosInstance
      .post(`/training_db/training/evaluation/${id}`, {
        evaluations: summary,
        remark: remark,
      })
      .then((response: any) => reqForToastAndSetMessage(response.data.message))
      .catch((error: any) =>
        reqForToastAndSetMessage(error.response.data.message)
      );
  };

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (previosTrainingEvaluations) {
      Object.entries(previosTrainingEvaluations.evaluations).map((entry, i) => {
        for (let i = 0; i < entry[1]; i++)
          setEvaluations((prev) => [
            ...prev,
            { participant: i, selected: entry[0] },
          ]);
      });
    }
  }, []);

  return (
    <Card className="max-w-4xl mx-auto mt-6 shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold text-center mb-4">
          Evaluation Section
        </h2>

        <div className="max-h-[300px] overflow-y-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20 text-center">Participant</TableHead>
                <TableHead className="text-center">Informative</TableHead>
                <TableHead className="text-center">Usefulness</TableHead>
                <TableHead className="text-center">Understanding</TableHead>
                <TableHead className="text-center">Relevance</TableHead>
                <TableHead className="text-center">Applicability</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {evaluations.map((evalItem, index) => (
                <TableRow key={index}>
                  <TableCell className="font-semibold text-center">
                    {evalItem.participant}
                  </TableCell>
                  <RadioGroup
                    orientation="horizontal"
                    className="contents"
                    value={evalItem.selected}
                    onValueChange={(value) => handleSelect(index, value)}
                  >
                    {[
                      "informative",
                      "usefulness",
                      "understanding",
                      "relevance",
                      "applicability",
                    ].map((field) => (
                      <TableCell key={field} className="text-center">
                        <div className="flex justify-center items-center h-full">
                          <RadioGroupItem
                            value={field}
                            id={`${field}-${index}`}
                            className="h-4 w-4" // کوچکتر بودن رادیوها
                          />
                        </div>
                      </TableCell>
                    ))}
                  </RadioGroup>
                </TableRow>
              ))}
              <TableRow className="bg-muted/30 font-bold">
                <TableCell className="text-center">Summary</TableCell>
                <TableCell className="text-center">
                  {summary.informative}
                </TableCell>
                <TableCell className="text-center">
                  {summary.usefulness}
                </TableCell>
                <TableCell className="text-center">
                  {summary.understanding}
                </TableCell>
                <TableCell className="text-center">
                  {summary.relevance}
                </TableCell>
                <TableCell className="text-center">
                  {summary.applicability}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="mt-4 flex justify-center">
          <p className="font-medium text-center">
            % of positive evaluation (Informative): {informativePercentage}%
          </p>
        </div>

        <div className="mt-4">
          <label className="font-medium">Remark:</label>
          <Input
            placeholder="Type your remark..."
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            className="mt-2"
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            onClick={addEvaluation}
            className="flex gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Add Evaluation
          </Button>
          <Button
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => reqForConfirmationModelFunc(
              "Are you compleatly sure ?",
              "",
              handleSubmit
            )}
          >
            Submit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrainingEvaluationForm;
