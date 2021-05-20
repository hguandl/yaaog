import { useModel } from 'umi';

export interface IAogMatrix {
  matrix: IAogEntry[];
  lastModified: number;
}

export interface IAogStage {
  stage: string;
  efficiency: number;
  absEff: number;
  expectation: number;
  color: string;
}

export interface IAogEntry {
  name: string;

  group: number;
  tier: number;

  stages: IAogStage[];

  greenRatio: number;
  orangeRatio: number;
  creditRatio: number;
  actShopRatio: number;
}

export default function useAog(): { data: IAogEntry[]; loading: boolean } {
  const { formService, loading } = useModel('useServices');

  if (loading || !formService.ready) {
    return { data: [], loading: true };
  }

  return {
    data: formService.summary(),
    loading: false,
  };
}
