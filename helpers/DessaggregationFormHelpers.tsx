import { enactDessaggregationOptions, indevidualDessaggregationOptions, sessionDessaggregationOptions } from "@/app/(main)/projects/utils/OptionLists";

export const getReliableDessaggregationOptionsAccordingToDessagregationType = (dessaggregationType: "session" | "indevidual" | "enact") => {
    if (dessaggregationType == "session")
        return sessionDessaggregationOptions;
    else if (dessaggregationType == "indevidual")
        return indevidualDessaggregationOptions;
    else
        return enactDessaggregationOptions
}

export const getReliableDessaggregationOptionsForSubIndicatorAccordingToDessagregationType = (dessaggregationType: "session" | "indevidual") => {
    if (dessaggregationType == "session")
        return sessionDessaggregationOptions;
    else
        return indevidualDessaggregationOptions;
}