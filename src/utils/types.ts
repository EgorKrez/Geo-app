export interface DeformationTableProps {
  readonly key: number;
  readonly cycle: string;
  readonly time: string;
  readonly nativeTime?: string;
  readonly value: number;
  readonly delta: number | undefined;
}

export interface DeformationGraphProps {
  x: string;
  y: number;
}

interface TermDataDeepProps {
  deep: string;
  temp: number;
}

export interface TermDataProps {
  temp: number;
  time: string;
  nativeTime?: string;
  data: TermDataDeepProps[];
  [key: string]: any;
}
