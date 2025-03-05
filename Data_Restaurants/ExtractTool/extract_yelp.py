import json
import re
import os

# 定义输入和输出文件夹路径
INPUT_FOLDER = "../YelpSnippet"
OUTPUT_FOLDER = "../RestaurantData"

# 确保输出文件夹存在
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def extract_restaurant_data(input_file, output_file):
    print(f'Function Started')
    with open(input_file, "r", encoding="utf-8") as file:
        try:
            data = json.load(file)  # 直接解析 JSON
        except json.JSONDecodeError:
            print(f"⚠️ 解析失败: {input_file}，请检查是否是完整的 JSON")
            return

    # 解析文件
    # 进入 Yelp 的主要数据结构
    search_results = data.get("searchPageProps", {}).get("mainContentComponentsListProps", [])

    restaurants = []
    for item in search_results:
        if "bizId" in item and "searchResultBusiness" in item:
            biz_info = item["searchResultBusiness"]
            image_info = item["scrollablePhotos"]

            # 过滤掉广告商家
            if biz_info.get("isAd", False):
                continue

            restaurant = {
                "id": item["bizId"],
                "name": biz_info.get("name"),
                "categories": [cat["title"] for cat in biz_info.get("categories", [])],
                "price_range": biz_info.get("priceRange", "N/A"),
                "rating": biz_info.get("rating", 0),
                "review_count": biz_info.get("reviewCount", 0),
                "address": biz_info.get("formattedAddress", "N/A"),
                "phone": biz_info.get("phone", "N/A"),
                "website": (biz_info.get("website")or {}).get("href", "N/A"),
                "image_url": image_info.get("photoList", [])[0].get("src", ""),
                "yelp_url": f"https://www.yelp.com/biz/{biz_info.get('alias', '')}"
            }

            restaurants.append(restaurant)


    # 写入 JSON 文件
    if restaurants:
        with open(output_file, "w", encoding="utf-8") as outfile:
            json.dump(restaurants, outfile, indent=4, ensure_ascii=False)
        print(f"✅ 提取完成: {input_file} -> {output_file} ({len(restaurants)} 家餐厅)")
    else:
        print(f"⚠️ {input_file} 未找到任何餐厅数据")

# 处理 YelpSnippet 目录下的所有 txt 文件
for filename in os.listdir(INPUT_FOLDER):
    if filename.endswith(".txt"):
        input_path = os.path.join(INPUT_FOLDER, filename)
        output_filename = f"output_{filename.split('_')[-1].replace('.txt', '.json')}"
        output_path = os.path.join(OUTPUT_FOLDER, output_filename)
        extract_restaurant_data(input_path, output_path)