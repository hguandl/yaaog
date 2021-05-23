#!/usr/bin/env python3

import json
import os

import requests

MATERIAL_PRICE = {
    "2001":  0.625,  # 基础作战记录
    "2002":  1.25,   # 初级作战记录
    "2003":  3.125,  # 中级作战记录
    "2004":  6.25,   # 高级作战记录

    "3003":  1.25,   # 赤金
    "3301":  1.5,    # 技巧概要·卷1
    "3302":  4.5,    # 技巧概要·卷2
    "3303":  13.5,   # 技巧概要·卷3

    "4001":  0.005,  # 龙门币

    "30011": 1.508946667,  # 源岩
    "30012": 5.072565,     # 固源岩
    "30013": 25,           # 固源岩组
    "30014": 95.4016,      # 提纯源岩

    "30021": 2.348327083,  # 代糖
    "30022": 7.59070625,   # 糖
    "30023": 30,           # 糖组
    "30024": 125.4016,     # 糖聚块

    "30031": 2.348327083,  # 酯原料
    "30032": 7.59070625,   # 聚酸酯
    "30033": 30,           # 聚酸酯组
    "30034": 120.4016,     # 聚酸酯块

    "30041": 2.76499375,   # 异铁碎片
    "30042": 8.84070625,   # 异铁
    "30043": 35,           # 异铁组
    "30044": 140.4016,     # 异铁块

    "30051": 2.76499375,   # 双酮
    "30052": 8.84070625,   # 酮凝集
    "30053": 35,           # 酮凝集组
    "30054": 125.4016,     # 酮阵列

    "30061": 3.598327083,  # 破损装置
    "30062": 11.34070625,  # 装置
    "30063": 45,           # 全新装置
    "30064": 130.4016,     # 改量装置

    "30073": 30,        # 扭转醇
    "30074": 100.4016,  # 白马醇

    "30083": 35,        # 轻锰矿
    "30084": 125.4016,  # 三水锰矿

    "30093": 40,        # 研磨石
    "30094": 115.4016,  # 五水研磨石

    "30103": 45,        # RMA70-12
    "30104": 125.4016,  # RMA70-24

    "30115": 341.970812,  # 聚合剂
    "30125": 311.970812,  # 双极纳米片
    "30135": 346.970812,  # D32钢

    "31013": 40,        # 凝胶
    "31014": 105.4016,  # 聚合凝胶

    "31023": 35,        # 炽合金
    "31024": 115.4016,  # 炽合金块

    "31033": 30,       # 晶体元件
    "31034": 130.4016  # 晶体电路
}

ORANGE_PRICE = {
    "30011": 1.875,  # 源岩
    "30012": 3.75,   # 固源岩
    "30013": 15,     # 固源岩组
    "30014": 60,     # 提纯源岩

    "30021": 3.125,  # 代糖
    "30022": 6.25,   # 糖
    "30023": 17.5,   # 糖组
    "30024": 75,     # 糖聚块

    "30031": 3.125,  # 酯原料
    "30032": 6.25,   # 聚酸酯
    "30033": 17.5,   # 聚酸酯组
    "30034": 80,     # 聚酸酯块

    "30041": 3.75,   # 异铁碎片
    "30042": 7.5,    # 异铁
    "30043": 22.5,   # 异铁组
    "30044": 90,     # 异铁块

    "30051": 3.75,   # 双酮
    "30052": 7.5,    # 酮凝集
    "30053": 22.5,   # 酮凝集组
    "30054": 85,     # 酮阵列

    "30061": 5,      # 破损装置
    "30062": 10,     # 装置
    "30063": 30,     # 全新装置
    "30064": 85,     # 改量装置

    "30073": 20,     # 扭转醇
    "30074": 65,     # 白马醇

    "30083": 22.5,   # 轻锰矿
    "30084": 80,     # 三水锰矿

    "30093": 25,     # 研磨石
    "30094": 75,     # 五水研磨石

    "30103": 30,     # RMA70-12
    "30104": 80,     # RMA70-24

    "31013": 25,     # 凝胶
    "31014": 65,     # 聚合凝胶

    "31023": 20,     # 炽合金
    "31024": 75,     # 炽合金块

    "31033": 20,     # 晶体元件
    "31034": 90      # 晶体电路
}

BUILD_VALUE = {
    "30013": 0.112,  # 固源岩组
    "30023": 0.093,  # 糖组
    "30033": 0.093,  # 聚酸酯组
    "30043": 0.074,  # 异铁组
    "30053": 0.074,  # 酮凝集组
    "30063": 0.056,  # 全新装置
    "30073": 0.084,  # 扭转醇
    "30083": 0.074,  # 轻锰矿
    "30093": 0.067,  # 研磨石
    "30103": 0.056,  # RMA70-12
    "31013": 0.067,  # 凝胶
    "31023": 0.074,  # 炽合金
    "31033": 0.074   # 晶体元件
}

ITM_TAB_URL = "https://github.com/Kengxxiao/ArknightsGameData/raw/master/zh_CN/gamedata/excel/item_table.json"
STG_TAB_URL = "https://github.com/Kengxxiao/ArknightsGameData/raw/master/zh_CN/gamedata/excel/stage_table.json"
BLD_TAB_URL = "https://github.com/Kengxxiao/ArknightsGameData/raw/master/zh_CN/gamedata/excel/building_data.json"
RET_TAB_URL = "https://github.com/Kengxxiao/ArknightsGameData/raw/master/zh_CN/gamedata/excel/retro_table.json"

ITM_OUTPUT = os.path.join("public", "dat", "items.json")
STG_OUTPUT = os.path.join("public", "dat", "stages.json")

################
# Stage List
################

stages = requests.get(STG_TAB_URL).json()
retro = requests.get(RET_TAB_URL).json()
stage_output = []

for key, stage in stages["stages"].items():
    if stage["canBattleReplay"]:
        stage_output.append({
            "stageId": stage["stageId"],
            "code": stage["code"],
            "name": stage["name"],
            "apCost": stage["apCost"]
        })

for key, stage in retro["stageList"].items():
    if stage["canBattleReplay"]:
        stage_output.append({
            "stageId": stage["stageId"] + "_perm",
            "code": stage["code"] + "*",
            "name": stage["name"],
            "apCost": stage["apCost"]
        })

with open(STG_OUTPUT, 'w') as f:
    json.dump({"success": True, "data": stage_output}, f)

################
# Item List
################

items = requests.get(ITM_TAB_URL).json()
building = requests.get(BLD_TAB_URL).json()
item_output = []


def find_formula(item: dict):
    def find_formulaId() -> str:
        for bp in item["buildingProductList"]:
            if bp["roomType"] == "WORKSHOP":
                return bp["formulaId"]

    costs = building["workshopFormulas"][find_formulaId()]["costs"]
    formula = []

    for cost in costs:
        formula.append({
            "itemId": cost["id"],
            "count": cost["count"]
        })

    return formula


for key, item in items["items"].items():
    if key in MATERIAL_PRICE:
        item_entry = {
            "itemId": item["itemId"],
            "name": item["name"],
            "price": MATERIAL_PRICE.get(item["itemId"], 0)
        }

        if int(key) > 30000:
            item_entry["tier"] = item["rarity"] + 1

            if item_entry["tier"] < 5:
                item_entry["group"] = (int(key) - 30000) // 10
                item_entry["orangePrice"] = ORANGE_PRICE[key]

            if item_entry["tier"] == 3:
                item_entry["buildValue"] = BUILD_VALUE[key]

            if item_entry["tier"] > 3:
                item_entry["formula"] = find_formula(item)

        item_output.append(item_entry)

with open(ITM_OUTPUT, 'w') as f:
    json.dump({"success": True, "data": item_output}, f)
