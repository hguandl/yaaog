import ItemService from "@/services/ItemService";
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

export default function useStage(): { itemService: ItemService, loading: boolean } {
  const { data, loading } = useRequest("/dat/items.json");

  return {
    itemService: new ItemService(data),
    loading: loading,
  };
}
