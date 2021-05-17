import StageService from "@/services/StageService";
import { useRequest } from "umi";

export interface IPenguinStage {
  stageId: string,
  code: string,
  name: string,
  apCost: number
}

export default function useStage(): { stageService: StageService, loading: boolean } {
  const { data, loading } = useRequest("/dat/stages.json");

  return {
    stageService: new StageService(data),
    loading: loading,
  };
}
