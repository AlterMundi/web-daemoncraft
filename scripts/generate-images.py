#!/usr/bin/env python3
"""Genera imágenes con Gemini 2.5 Flash Image (nano-banana) para HermesCraft."""
import os, sys, json, base64, urllib.request, urllib.error, time

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("✗ Falta GEMINI_API_KEY en el entorno. Conseguilo en https://aistudio.google.com/apikey")
    sys.exit(1)
MODEL = "gemini-2.5-flash-image"
URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"
OUT = "/home/saira/web/hermescraft/public/img"
os.makedirs(OUT, exist_ok=True)

STYLE = (
    "Minecraft voxel/blocky art style, bright daytime lighting, clear blue sky with fluffy "
    "pixel-art clouds, cubic blocks everywhere, friendly and inviting family-game aesthetic, "
    "warm and welcoming atmosphere for kids 8-13. No real photographic elements. No corporate "
    "look. Pure Minecraft-inspired rendering with soft anti-aliased edges for web use."
)

JOBS = [
    {
        "name": "hero-landscape",
        "prompt": (
            "A panoramic Minecraft-style landscape at golden hour: rolling grass-block hills in the "
            "foreground, a few oak trees with blocky leaves, tiny flowers (red poppies, yellow "
            "dandelions), a small river of water blocks reflecting the sky, distant mountains of "
            "stone blocks, fluffy rectangular clouds floating across a bright cyan sky. Warm "
            "sunshine from the right. No characters, no text, no UI. Used as a website hero "
            "background — composition leaves space on the left for overlay text. Ultra-wide 16:9 "
            "composition. " + STYLE
        ),
    },
    {
        "name": "hermes-character",
        "prompt": (
            "A friendly Minecraft-style blocky character standing in a grass field: it's a young "
            "hero with a white-cream toga/tunic belted in navy blue, a shiny golden winged helmet "
            "with two small feathered wings on the sides, pixelated brown sandals, holding a "
            "small golden caduceus (staff with two blue snakes and wings on top). Friendly smile, "
            "approachable pose waving hello. Bright blue sky background, green grass blocks "
            "below, one blocky tree in the distance. Character centered, full body visible. "
            "Kids' game mascot feel. " + STYLE
        ),
    },
    {
        "name": "preset-steve",
        "prompt": (
            "Minecraft-style blocky character portrait: Steve the Lumberjack — a sturdy bearded "
            "character with a red and black plaid shirt, brown pants, holding a wooden axe. "
            "Standing in front of a forest of oak trees. Warm friendly expression, dad-joke vibe. "
            "Square composition for a card. Vivid colors. " + STYLE
        ),
    },
    {
        "name": "preset-maria",
        "prompt": (
            "Minecraft-style blocky character portrait: Maria the Architect — a creative character "
            "with teal overalls, yellow hard hat, holding a blueprint roll and a block of stone. "
            "Standing in front of a half-built castle made of cobblestone and quartz blocks. "
            "Perfectionist determined expression. Square composition for a card. " + STYLE
        ),
    },
    {
        "name": "preset-luna",
        "prompt": (
            "Minecraft-style blocky character portrait: Luna the Tutor — a patient character with "
            "a purple wizard robe and round glasses, holding an open enchanted book that glows "
            "gently. Standing in front of a library of bookshelves made of oak wood. Kind "
            "encouraging smile. Square composition for a card. " + STYLE
        ),
    },
    {
        "name": "preset-kai",
        "prompt": (
            "Minecraft-style blocky character portrait: Kai the Fighter — a tactical character "
            "with iron armor (chestplate) over a dark tunic, holding an iron sword, shield on "
            "back. Standing in front of a stone fortress with torches. Alert protective "
            "expression. Square composition for a card. " + STYLE
        ),
    },
    {
        "name": "kid-playing",
        "prompt": (
            "Warm cozy illustration: a child (around 10 years old, generic friendly, "
            "non-identifiable) sitting at a desk in a warmly-lit bedroom at dusk, smiling while "
            "looking at a monitor that shows a Minecraft game world with a blocky AI companion "
            "character next to their player avatar. A phone on the desk shows a Telegram "
            "notification bubble. Soft atmosphere, welcoming family tech scene. Illustration "
            "style, not photography. No identifiable facial features. Mix of realistic bedroom "
            "and blocky game screen. 16:9 composition."
        ),
    },
    {
        "name": "parents-telegram",
        "prompt": (
            "A smiling parent (back view or silhouette, non-identifiable) holding a smartphone "
            "showing a Telegram chat. The chat bubbles are clearly readable and say: 'Hermes: "
            "Valentín built a Colosseum today 🏛️' and 'Showed great persistence when a creeper "
            "destroyed his base.' Warm home interior background softly blurred. Phone screen is "
            "the focal point. Illustration style with clean vector look, not photography. Shows "
            "the 'Hermes' character avatar next to messages. Inviting, calm, trustworthy tone."
        ),
    },
    {
        "name": "block-dirt",
        "prompt": (
            "A single Minecraft-style grass block: green grass on top with scattered dirt pixels, "
            "brown dirt sides with small stone pebbles. Isolated on transparent or solid neutral "
            "background. Centered, iconic, flat-lit. Used as a decorative icon on a website. "
            "Clean pixel edges. Square 512x512 composition."
        ),
    },
]

def gen(name, prompt):
    out_path = f"{OUT}/{name}.png"
    if os.path.exists(out_path):
        print(f"  ↳ {name}.png ya existe, skip")
        return True
    body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"responseModalities": ["IMAGE"]},
    }
    req = urllib.request.Request(
        URL,
        data=json.dumps(body).encode(),
        headers={"Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            data = json.loads(r.read())
    except urllib.error.HTTPError as e:
        err = e.read().decode()[:500]
        print(f"  ✗ {name}: HTTP {e.code} — {err}")
        return False
    except Exception as e:
        print(f"  ✗ {name}: {e}")
        return False

    # buscar inlineData en la respuesta
    try:
        parts = data["candidates"][0]["content"]["parts"]
        for p in parts:
            if "inlineData" in p or "inline_data" in p:
                inline = p.get("inlineData") or p.get("inline_data")
                img_b64 = inline["data"]
                with open(out_path, "wb") as f:
                    f.write(base64.b64decode(img_b64))
                size_kb = os.path.getsize(out_path) // 1024
                print(f"  ✓ {name}.png ({size_kb} KB)")
                return True
        print(f"  ✗ {name}: sin imagen en respuesta: {json.dumps(data)[:400]}")
    except Exception as e:
        print(f"  ✗ {name}: parse error {e} — body: {json.dumps(data)[:300]}")
    return False

if __name__ == "__main__":
    target = sys.argv[1:] if len(sys.argv) > 1 else None
    jobs = [j for j in JOBS if (not target or j["name"] in target)]
    print(f"→ Generando {len(jobs)} imágenes en {OUT}")
    ok = 0
    for j in jobs:
        print(f"\n[{j['name']}]")
        if gen(j["name"], j["prompt"]):
            ok += 1
        time.sleep(1)
    print(f"\n✓ {ok}/{len(jobs)} imágenes generadas")
