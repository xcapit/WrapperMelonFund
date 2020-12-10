export interface Serie {
  id: string;
  name?: string;
  type?: string;
  data: Datum[];
}

export interface Datum {
  x: number | string | Date;
  y: number | string;
}

export type Depth = '1d' | '1w' | '1m' | '3m' | '1y';
