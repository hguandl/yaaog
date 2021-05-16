import { useRequest } from "umi";

export interface IAogMatrix {
  matrix: IAogEntry[],
  lastModified: number
}

export interface IAogStage {
  stage: string,
  efficiency: number,
  absEff: number,
  expectation: number,
  color: string
}

export interface IAogEntry {
  name: string,

  group: number,
  tier: number,

  stages: IAogStage[],

  greenRatio: number,
  orangeRatio: number,
  creditRatio: number,
  actShopRatio: number
}

export default function useMatrix(): { data: IAogMatrix, loading: boolean } {
  const { data, loading } = useRequest("/api/matrix.json");

  return {
    data: data,
    loading: loading,
  };
}
