import { IPenguinItem } from "@/models/useItem";

export default class ItemService {
  readonly items: IPenguinItem[];
  readonly itemGroups: Set<number>;

  constructor(itemList: IPenguinItem[]) {
    this.items = itemList;
    this.itemGroups = new Set<number>();

    if (itemList === undefined) {
      return;
    }

    itemList.forEach(i => {
      this.itemGroups.add(i.group);
    });
  }

  public getAllItems() {
    return this.items;
  }

  public getItemByItemId(itemId: string) {
    return this.items
      .find(item => item.itemId === itemId);
  }

  public hasItemId(itemId: string) {
    return this.getItemByItemId(itemId) !== undefined;
  }

  public getItemByName(name: string) {
    return this.items
      .find(item => item.name === name);
  }

  public getItemGroups() {
    return this.itemGroups;
  }

  public getItemsByGroup(group: number) {
    return this.items
      .filter(item => item.group === group);
  }

  public getItemsByTier(tier: number) {
    return this.items
      .filter(item => item.tier === tier);
  }

  public getItemByGroupAndTier(group: number, tier: number) {
    return this.items
      .find(item => item.group === group && item.tier === tier);
  }
}
