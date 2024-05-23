export interface DeformationResponseValueProps {
  value: number;
  isValid: boolean;
  delta: number;
}

export interface DeformationResponseDataProps {
  time: string;
  objectId: string;
  sensorType: string;
  status: boolean;
  data: DeformationResponseValueProps;
  state: string;
  criticalDelta: number;
}

export interface DeformationResponseProps {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  hasPrevious: boolean;
  hasNext: boolean;
  data: DeformationResponseDataProps[];
  succeeded: boolean;
  errors: [];
}

export interface PointsProps {
  [key: string]: string;
}

export interface DeformationTrendResponseProps {
  data: {
    objectId: string;
    points: PointsProps;
    startDate: string;
    endDate: string;
    criticalEndDate: string;
  };
  succeeded: boolean;
  errors: [];
}

interface TermResponsePointsProps {
  [key: string]: {
    value: number;
    isValid: boolean;
  };
}

interface TermResponseDataProps {
  time: string;
  objectId: string;
  sensorType: string;
  status: boolean;
  data: TermResponsePointsProps;
  state: string;
  criticalTemperature: number;
  minDepth: number;
  maxDepth: number;
  averageTemperature: number;
}

export interface TermResponseProps {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  hasPrevious: boolean;
  hasNext: boolean;
  data: TermResponseDataProps[];
  succeeded: boolean;
  errors: [];
}

export interface TermTrendResponseProps {
  data: {
    points: PointsProps;
    startDate: string;
    criticalEndDate: string;
  };
  succeeded: boolean;
  errors: [];
}
