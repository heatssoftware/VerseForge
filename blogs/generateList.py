import os
import re
import json
from datetime import datetime

blogs_dir = "blogs"
output_file = os.path.join(blogs_dir, "list.json")
blog_list = []

time_regex = re.compile(r"<time>(.*?)</time>")

for item in os.listdir(blogs_dir):
    path = os.path.join(blogs_dir, item)
    index_path = os.path.join(path, "index.html")

    if not (os.path.isdir(path) and os.path.exists(index_path)):
        continue

    # Noklusējuma title no mapes
    title = item.replace("-", " ").capitalize()
    date = None

    with open(index_path, "r+", encoding="utf-8") as f:
        content = f.read()

        # Meklē datumu <time>...</time>
        match = time_regex.search(content)
        if match:
            date = match.group(1)
        else:
            # Ja nav datuma, ieliek šodienas datumu
            date = datetime.today().strftime("%Y-%m-%d")
            # Ievieto <time> pirms </body>
            updated = re.sub(r"(</body>)", f"<p><time>{date}</time></p>\n\\1", content, flags=re.IGNORECASE)
            f.seek(0)
            f.write(updated)
            f.truncate()
            print(f"🕒 Pievienots datums {date} blogam: {item}")
        
    blog_list.append({
        "title": title,
        "path": f"{item}/",
        "date": date
    })

# Sakārto pēc datuma dilstoši
blog_list.sort(key=lambda x: x["date"], reverse=True)

with open(output_file, "w", encoding="utf-8") as f:
    json.dump(blog_list, f, indent=2, ensure_ascii=False)

print(f"✅ Atjaunināts {output_file} ar {len(blog_list)} blogiem.")
