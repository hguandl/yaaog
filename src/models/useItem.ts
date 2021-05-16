import { useRequest } from "umi";

export interface IPenguinItem {
  itemId: string,
  name: string,
  price: number,
  tier: number,
  group: number,
  orangePrice: number,
  formula: object
}

export default function useStage(): { data: IPenguinItem[], loading: boolean } {
  const { data, loading } = useRequest("/dat/items.json");

  return {
    data: data,
    loading: loading,
  };
}
