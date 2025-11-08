export type Project = {
    id: string | null;
    projectCode: string;
    projectTitle: string;
    projectGoal: string;
    projectDonor: string;
    startDate: string;
    endDate: string;
    status: string;
    projectManager: string;
    provinces: string[];
    thematicSector: string[];
    reportingPeriod: string;
    reportingDate: string;
    aprStatus: string;
    description: string;
};

export type Outcome = 
{
    id: string | null;
    outcome: string;
    outcomeRef: string;
}

export type Output = 
{
    id: string | null;
    outcomeId: string | null;
    outcomeRef: string;
    output: string;
    outputRef: string;
}

export type Indicator = {
  id: string | null;
  outputId: string | null;
  outputRef: string;
  indicator: string;
  indicatorRef: string;
  target: number;
  status: string;
  database: string;
  type: string | null;
  provinces: {
    province: string;
    target: number;
    councilorCount: number;
  }[];
  dessaggregationType: "session" | "indevidual" | "enact";
  description: string;
  subIndicator: {
    id: string | null;
    indicatorRef: string;
    name: string;
    target: number;
    dessaggregationType: string;
    type: null | string;
    provinces: {
      province: string;
      target: number;
      councilorCount: number;
    }[];
  } | null;
};

export type Dessaggregation = {
    indicatorId: string | null;
    indicatorRef: string;
    dessaggration: string;
    province: string;
    target: number;
}

export type Isp3 = {
  
  name: string;
  indicators: string[];
          
}