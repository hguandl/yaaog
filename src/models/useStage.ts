import { useRequest } from "umi";
import { IPenguinItem } from "./useItem";

export interface IPenguinStage {
  stageId: string,
  code: string,
  name: string,
  apCost: number
}

export default function useStage(): { data: IPenguinStage[], loading: boolean } {
  const { data, loading } = useRequest("/dat/stages.json");

  return {
    data: data,
    loading: loading,
  };
}
