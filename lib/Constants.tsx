import {
  Dessaggregation,
  Indicator,
  Outcome,
  Output,
} from "@/app/(main)/projects/types/Types";
import {
  aprFinalizationSteps,
  projectAprStatusList,
} from "@/app/(main)/projects/utils/OptionLists";

export const IsValidAprStatus = (status: string) => {
  return projectAprStatusList.includes(status);
};

export const IsEnteredStatusLocaltedAtTheLowerLevelThenTheCurrentStatus = (
  projectAprStatus: string,
  status: string
) => {
  const projectCurrentStatusValue: undefined | number =
    aprFinalizationSteps.find(
      (step) =>
        step.acceptStatusValue == projectAprStatus ||
        step.rejectStatusValue == projectAprStatus
    )?.stepValue;

  const inputAcceptStatusValue: undefined | number = aprFinalizationSteps.find(
    (step) => step.acceptStatusValue == status
  )?.stepValue;

  return (
    projectCurrentStatusValue &&
    inputAcceptStatusValue &&
    projectCurrentStatusValue > inputAcceptStatusValue!
  );
};

export const IsEnteredStatusCallsToRejectAtTheLevelAboveTheCurrentLimit = (
  projectAprStatus: string,
  status: string
) => {
  const projectCurrentStatusValue: undefined | number =
    aprFinalizationSteps.find(
      (step) =>
        step.acceptStatusValue == projectAprStatus ||
        step.rejectStatusValue == projectAprStatus
    )?.stepValue;

  const inputRejectStatusValue: undefined | number = aprFinalizationSteps.find(
    (step) => step.rejectStatusValue == status
  )?.stepValue;

  return (
    projectCurrentStatusValue &&
    inputRejectStatusValue &&
    projectCurrentStatusValue < inputRejectStatusValue!
  );
};

export const IsEnteredStatusCallingToBeApproveAtLevelAboveTheAllowedLevel = (
  projectAprStatus: string,
  status: string
) => {
  let isRejected: boolean = false;

  const projectCurrentStatusValue: undefined | number =
    aprFinalizationSteps.find((step) => {
      if (step.acceptStatusValue == projectAprStatus) return true;
      else if (step.rejectStatusValue == projectAprStatus) {
        isRejected = true;
        return true;
      }
      return false;
    })?.stepValue;

  const inputRejectStatusValue: undefined | number = aprFinalizationSteps.find(
    (step) =>
      step.rejectStatusValue == status || step.acceptStatusValue == status
  )?.stepValue;

  return (
    projectCurrentStatusValue &&
    inputRejectStatusValue &&
    (projectCurrentStatusValue - inputRejectStatusValue) * -1 >=
      (isRejected ? 1 : 2)
  );
};

export const IsMainDatabaseNotAvailableForSelection = (
  indicators: Indicator[]
) => {
  return (
    indicators.find(
      (indicator) =>
        indicator.database == "main_database" &&
        indicator.type == "adult_psychosocial_support"
    ) &&
    indicators.find(
      (indicator) =>
        indicator.database == "main_database" &&
        indicator.type == "child_psychosocial_support"
    ) &&
    indicators.find(
      (indicator) =>
        indicator.database == "main_database" &&
        indicator.type == "parenting_skills"
    ) &&
    indicators.find(
      (indicator) =>
        indicator.database == "main_database" &&
        indicator.type == "child_care_practices"
    )
  );
};

export const IsCurrentTypeOptionAvailable = (
  indicators: Indicator[],
  option: { value: string; label: string },
  localIndicator: Indicator
) => {
  return indicators.find(
    (indicator) =>
      indicator.database == "main_database" &&
      indicator.type == option.value &&
      indicator.id !== localIndicator.id
  );
};

export const IsMainDatabase = (indicator: Indicator) => {
  return indicator.database == "main_database";
};

export const HasSubIndicator = (indicator: Indicator) => {
  return indicator.subIndicator;
};

export const isTheTotalTargetOfDessaggregationsEqualToTotalTargetOfIndicator = (
  selectedIndicator: Indicator,
  dessaggregations: Dessaggregation[]
) => {
  const selectedIndicatorId = selectedIndicator.id;
  const subIndicatorId = selectedIndicator.subIndicator?.id ?? null;

  let mainTotal = 0;
  let subTotal = 0;

  dessaggregations.forEach((d) => {
    if (d.indicatorId == selectedIndicatorId) mainTotal += Number(d.target);
    if (subIndicatorId && d.indicatorId == subIndicatorId)
      subTotal += Number(d.target);
  });

  const mainTarget = Number(selectedIndicator.target ?? 0);
  const subTarget = Number(selectedIndicator.subIndicator?.target ?? 0);

  if (mainTarget === mainTotal && (!subIndicatorId || subTarget === subTotal)) {
    return false;
  }

  return true;
};

export const IsThereAnyOutputWithEnteredReferance = (
  outputs: Output[],
  enteredReferance: string
) => {
  return outputs.some((output) => output.outputRef == enteredReferance);
};

export const IsThereAnyOutputWithEnteredReferanceAndDefferentId = (
  outputs: Output[],
  enteredOutput: Output
) => {
  return outputs.some(
    (output) =>
      output.outputRef === enteredOutput.outputRef &&
      output.id !== enteredOutput.id
  );
};

export const IsThereAnyOutcomeWithEnteredReferance = (
  outcomes: Outcome[],
  outcome: Outcome
) => {
  return outcomes.some((o) => o.outcomeRef == outcome.outcomeRef);
};

export const IsThereAnyOutcomeWithEnteredReferanceAndDefferentId = (
  outcomes: Outcome[],
  outcome: Outcome
) => {
  return outcomes.some(
    (o) => o.outcomeRef == outcome.outcomeRef && o.id != outcome.id
  );
};

export const IsCreateMode = (mode: "create" | "edit" | "update" | "show"): boolean => {
  return mode == "create";
};

export const IsEditMode = (mode: "create" | "edit" | "update" | "show"): boolean => {
  return (mode == "edit") || (mode == "update");
};

export const IsShowMode = (mode: "create" | "edit" | "update" | "show"): boolean => {
  return mode == "show";
};

export const IsNotCreateMode = (mode: "create" | "edit" | "update" | "show"): boolean => {
  return mode != "create";
};

export const IsNotEditMode = (mode: "create" | "edit" | "update" | "show"): boolean => {
  return (mode != "edit") && (mode != "update");
};

export const IsNotShowMode = (mode: "create" | "edit" | "update" | "show"): boolean => {
  return mode != "show";
};

export const IsCreateOrEditMode = (mode: "create" | "edit" | "update" | "show"): boolean => {
  return (mode == "create") || (mode == "edit" || mode == "update");
}

export const IsEditOrShowMode = (mode: "create" | "edit" | "update" | "show"): boolean => {
  return (mode == "edit" || mode == "update") || (mode == "show");
}

export const IsCreateOrShowMode = (mode: "create" | "edit" | "update" | "show"): boolean => {
  return (mode == "create") || (mode == "show");
}

export const HasDessaggregationTheseFeature = (
  dessaggregation: Dessaggregation,
  description: string,
  province: string,
  indicatorRef: string
) => {
  return (
    dessaggregation.dessaggration === description &&
    dessaggregation.province === province &&
    dessaggregation.indicatorRef === indicatorRef
  );
};

export const IsTotalOfDessaggregationsOfProvinceBiggerThenTotalOfProvince = (
  dessaggregationsTotal: number,
  provinceTotal: number
): boolean => {
  return dessaggregationsTotal > provinceTotal;
};

export const IsTotalOfDessaggregationsOfProvinceLessThenTotalOfProvince = (
  dessaggregationsTotal: number,
  provinceTotal: number
): boolean => {
  return dessaggregationsTotal < provinceTotal;
};

export const WasIndexFound = (index: number) => {
  return index !== -1;
};

export const IsTheDessaggregationOfThisIndicatorAndProvince = (
  dessaggration: Dessaggregation,
  province: string,
  indicatorRef: string
): boolean => {
  return (
    dessaggration.province === province &&
    dessaggration.indicatorRef === indicatorRef
  );
};

export const IsIndicatorDatabaseMainDatabase = (indicator: Indicator) => {
  return indicator.database == "main_database";
};

export const IsIndicatorDatabaseEnactDatabase = (indicator: Indicator) => {
  return indicator.database == "enact_database";
};

export const IsNotIndicatorDatabaseEnactDatabase = (indicator: Indicator) => {
  return indicator.database != "enact_database";
};

export const AreDessaggregationsTheSame = (
  firstDessaggregation: Dessaggregation,
  secondDessaggregation: Dessaggregation
): boolean => {
  return (
    firstDessaggregation.dessaggration == secondDessaggregation.dessaggration &&
    firstDessaggregation.indicatorRef == secondDessaggregation.indicatorRef &&
    firstDessaggregation.province == secondDessaggregation.province &&
    firstDessaggregation.target == secondDessaggregation.target
  );
};

export const AreDessaggregationsEdited = (
  dessaggrationsBeforeEdit: Dessaggregation[],
  dessaggrationsAfterEdit: Dessaggregation[]
): boolean => {
  let areEqual: boolean = true;

  if (dessaggrationsBeforeEdit.length != dessaggrationsAfterEdit.length)
    areEqual = false;

  if (areEqual)
    for (let dessaggration of dessaggrationsBeforeEdit)
      areEqual = !!dessaggrationsAfterEdit.find((d) =>
        AreDessaggregationsTheSame(d, dessaggration)
      );

  return !areEqual;
};

export const IsIdFeild = (feildName: string): boolean => {
  return feildName == "id";
};

export const IsCurrentTypeOptionIsTheCurrentIndicatorOption = (
  indicator: Indicator,
  typeOption: string
): boolean => {
  return (indicator.type as unknown as string) === typeOption;
};

export const IsCurrentTypeOptionHasBeenTakenByOtherIndicators = (
  indicators: Indicator[],
  typeOption: string
): boolean => {
  return !indicators.find(
    (indicator) =>
      indicator.database == "main_database" && indicator.type == typeOption
  );
};

export const IsThereAnyIndicatorWithEnteredReferance = (
  indicators: Indicator[],
  enteredRef: string
): boolean => {
  return indicators.some((indicator) => indicator.indicatorRef == enteredRef);
};

export const IsThereAndIndicatorWithEnteredReferanceAndDefferentId = (
  indicators: Indicator[],
  indicator: Indicator
): boolean => {
  return indicators.some(
    (i) => i.indicatorRef == indicator.indicatorRef && i.id !== indicator.id
  );
};

export const IsIndicatorRelatedToThisOutput = (
  outputId: number,
  indicatorOutputId: number
): boolean => {
  return outputId === indicatorOutputId;
};

export const IsOutputRelatedToThisOutcome = (
  outcomeId: number,
  outputOutcomeId: number
): boolean => {
  return outcomeId === outputOutcomeId;
};

export const IsNotMainDatabase = (database: string): boolean => {
  return database != "main_database";
};

export const IsOutputSaved = (output: Output): boolean => {
  return output.id !== null;
};

export const IsOutcomeSaved = (outcome: Outcome): boolean => {
  return outcome.id !== null;
};

export const IsANullValue = (value: any): boolean => {
  return value == null;
};

export const IsNotANullValue = (value: any): boolean => {
  return value != null;
}

export const IsCreatePage = (
  pageIdentifier: "create" | "edit" | "show"
): boolean => {
  return pageIdentifier == "create";
};

export const IsEditPage = (
  pageIdentifier: "create" | "edit" | "show"
): boolean => {
  return pageIdentifier == "edit";
};

export const IsShowPage = (
  pageIdentifier: "create" | "edit" | "show"
): boolean => {
  return pageIdentifier == "show";
};

export const IsIndicatorSaved = (indicator: Indicator): boolean => {
  return IsNotANullValue(indicator.id)
}

export const NotSavedYet = (value: any): boolean => {
  return value.id == null;
}

export const IsDessaggregationSaved = (dessaggration: Dessaggregation): boolean => {
  return IsNotANullValue(dessaggration.id)
}