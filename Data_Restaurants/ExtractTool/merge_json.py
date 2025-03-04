import json
import os

# 设定存放 JSON 文件的目录
INPUT_FOLDER = "../RestaurantData"
OUTPUT_FILE = "../RestaurantData/all_restaurants.json"

def merge_json_files():
    all_restaurants = []

    # 遍历 RestaurantData 目录中的所有 JSON 文件
    for filename in os.listdir(INPUT_FOLDER):
        if filename.endswith(".json") and filename != "all_restaurants.json":  # 忽略最终合并的文件
            file_path = os.path.join(INPUT_FOLDER, filename)
            with open(file_path, "r", encoding="utf-8") as file:
                try:
                    data = json.load(file)
                    if isinstance(data, list):  # 确保数据是列表
                        all_restaurants.extend(data)
                except json.JSONDecodeError:
                    print(f"⚠️ 解析失败: {filename}，跳过此文件")

    # 写入合并后的 JSON 文件
    with open(OUTPUT_FILE, "w", encoding="utf-8") as outfile:
        json.dump(all_restaurants, outfile, indent=4, ensure_ascii=False)

    print(f"✅ 成功合并 {len(all_restaurants)} 家餐厅数据到 {OUTPUT_FILE}")

# 运行合并函数
merge_json_files()
