import os, subprocess



def slugify(title):
    return title.lower().replace(" ", "-")

def create_blog(title):
    slug = slugify(title)
    blog_path = os.path.join("blogs", slug)
    os.makedirs(blog_path, exist_ok=True)

    html_path = os.path.join(blog_path, "index.html")
    if os.path.exists(html_path):
        print("❗ Šis blogs jau eksistē:", slug)
        return

    with open(html_path, "w", encoding="utf-8") as f:
        f.write(f"""<!DOCTYPE html>
<html lang="lv">
<head>
    <link rel="stylesheet" href="/blog_style.css">
    <meta charset="UTF-8" />
    <title>{title}</title>
</head>
<body>
  <h1>{title}</h1>
  <p>Šeit būs tavs blogs.</p>

  <!-- Datums tiks pievienots automātiski -->
  <hr>
  <p><em>© 2025 VerseForge. All content and materials are protected by copyright. All rights reserved.</em></p>
</body>
</html>""")

    print("✅ Izveidots blogs:", slug)
    subprocess.run([r"C:\Users\rodri\AppData\Local\Programs\Microsoft VS Code\Code.exe", html_path])

if __name__ == "__main__":
    title = input("👉 Ievadi bloga nosaukumu: ").strip()
    if title:
        create_blog(title)
    else:
        print("❗ Nosaukums nedrīkst būt tukšs.")