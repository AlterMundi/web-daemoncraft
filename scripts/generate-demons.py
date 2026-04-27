"""
Generador de skins demoníacos para DaemonCraft.

Layout estándar 64x64 Minecraft:
  HEAD:  base (8,8)-(15,15) front, (0,8)-(7,15) right, (16,8)-(23,15) left, (24,8)-(31,15) back
         top (8,0)-(15,7), bottom (16,0)-(23,7)
  HAT overlay: shifted (+32, 0). Usado para cuernos/cabello/casco.

  BODY:  front (20,20)-(27,31), right (16,20)-(19,31), left (28,20)-(31,31), back (32,20)-(39,31)
         top (20,16)-(27,19), bottom (28,16)-(35,19)
  JACKET overlay: (20,32)-(...,47)

  R.ARM: front (44,20)-(47,31), right (40,20)-(43,31), left (48,20)-(51,31), back (52,20)-(55,31)
  L.ARM: front (36,52)-(39,63), etc (formato 1.8+)

  R.LEG: front (4,20)-(7,31), etc
  L.LEG: front (20,52)-(23,63)

Cada demonio tiene paleta + patrón distintivo.
"""

from PIL import Image
import random
import os
from pathlib import Path

OUT = Path(__file__).parent.parent / 'public'

# ============================================================
# Demonios — cada uno único
# ============================================================
DEMONS = {
    'demon-inferno': {
        'name': 'INFERNO',
        'desc': 'Demonio de fuego — corazón de magma',
        # Skin
        'skin': (180, 30, 25),         # rojo oscuro
        'skin_shade': (130, 15, 10),
        'skin_light': (220, 60, 40),
        # Eyes (glowing)
        'eyes': (255, 230, 80),
        'eye_glow': (255, 180, 0),
        # Hair / horns (HAT layer)
        'horns': (40, 15, 10),
        'horns_tip': (255, 100, 30),
        # Body marking (lava cracks)
        'marking': (255, 140, 30),
        'marking_glow': (255, 200, 80),
        # Clothing
        'cloth': (60, 20, 15),
        'cloth_accent': (255, 100, 30),
    },
    'demon-void': {
        'name': 'VOID',
        'desc': 'Demonio del vacío — sombra que respira',
        'skin': (60, 25, 80),
        'skin_shade': (35, 10, 55),
        'skin_light': (100, 50, 130),
        'eyes': (200, 100, 255),
        'eye_glow': (255, 180, 255),
        'horns': (15, 5, 25),
        'horns_tip': (180, 80, 220),
        'marking': (140, 70, 200),
        'marking_glow': (220, 150, 255),
        'cloth': (25, 10, 40),
        'cloth_accent': (180, 80, 220),
    },
    'demon-frost': {
        'name': 'FROST',
        'desc': 'Demonio de hielo — aliento congelado',
        'skin': (140, 200, 230),
        'skin_shade': (90, 150, 190),
        'skin_light': (200, 240, 255),
        'eyes': (180, 250, 255),
        'eye_glow': (100, 220, 255),
        'horns': (50, 100, 130),
        'horns_tip': (200, 240, 255),
        'marking': (100, 200, 255),
        'marking_glow': (200, 240, 255),
        'cloth': (30, 60, 100),
        'cloth_accent': (100, 200, 255),
    },
    'demon-storm': {
        'name': 'STORM',
        'desc': 'Demonio del rayo — relámpago en la piel',
        'skin': (60, 80, 60),
        'skin_shade': (35, 50, 35),
        'skin_light': (90, 130, 90),
        'eyes': (220, 255, 80),
        'eye_glow': (180, 255, 100),
        'horns': (15, 30, 15),
        'horns_tip': (180, 255, 100),
        'marking': (180, 255, 80),
        'marking_glow': (220, 255, 150),
        'cloth': (20, 40, 25),
        'cloth_accent': (180, 255, 100),
    },
    'demon-astral': {
        'name': 'ASTRAL',
        'desc': 'Demonio cósmico — estrellas en su piel',
        'skin': (70, 50, 130),
        'skin_shade': (40, 25, 90),
        'skin_light': (120, 90, 200),
        'eyes': (255, 220, 80),
        'eye_glow': (255, 240, 150),
        'horns': (200, 180, 50),
        'horns_tip': (255, 230, 80),
        'marking': (255, 230, 80),
        'marking_glow': (255, 250, 200),
        'cloth': (30, 20, 60),
        'cloth_accent': (255, 230, 80),
    },
}


def fill_rect(img, x, y, w, h, color):
    """Fill rect with color (RGBA)."""
    if len(color) == 3:
        color = color + (255,)
    pixels = img.load()
    for dy in range(h):
        for dx in range(w):
            pixels[x + dx, y + dy] = color


def shade_rect(img, x, y, w, h, base, shade, light):
    """Fill with base color + add some shading variation per column."""
    base_rgba = base + (255,) if len(base) == 3 else base
    shade_rgba = shade + (255,) if len(shade) == 3 else shade
    light_rgba = light + (255,) if len(light) == 3 else light
    pixels = img.load()
    rng = random.Random(x * 31 + y * 17 + w + h)
    for dy in range(h):
        for dx in range(w):
            r = rng.random()
            if r < 0.15:
                pixels[x + dx, y + dy] = shade_rgba
            elif r > 0.85:
                pixels[x + dx, y + dy] = light_rgba
            else:
                pixels[x + dx, y + dy] = base_rgba


def pixel(img, x, y, color):
    if 0 <= x < img.width and 0 <= y < img.height:
        if len(color) == 3:
            color = color + (255,)
        img.putpixel((x, y), color)


def paint_head(img, p):
    """Paint head: front, sides, top, bottom."""
    # Front
    shade_rect(img, 8, 8, 8, 8, p['skin'], p['skin_shade'], p['skin_light'])
    # Right
    shade_rect(img, 0, 8, 8, 8, p['skin_shade'], p['skin_shade'], p['skin'])
    # Left
    shade_rect(img, 16, 8, 8, 8, p['skin_shade'], p['skin_shade'], p['skin'])
    # Back
    shade_rect(img, 24, 8, 8, 8, p['skin_shade'], p['skin_shade'], p['skin_shade'])
    # Top
    shade_rect(img, 8, 0, 8, 8, p['skin_shade'], p['skin_shade'], p['skin_shade'])
    # Bottom (chin)
    shade_rect(img, 16, 0, 8, 8, p['skin_shade'], p['skin_shade'], p['skin_shade'])

    # === FACE DETAILS (front 8,8) ===
    # Eyes — two glowing pixels each
    # Left eye at (10, 12) and right at (13, 12)
    pixel(img, 10, 12, p['eyes'])
    pixel(img, 13, 12, p['eyes'])
    pixel(img, 10, 11, p['eye_glow'])
    pixel(img, 13, 11, p['eye_glow'])
    # Demon scar/marking on cheek
    pixel(img, 9, 13, p['marking'])
    pixel(img, 9, 14, p['marking_glow'])
    pixel(img, 14, 13, p['marking'])
    pixel(img, 14, 14, p['marking_glow'])
    # Mouth — sharp/sinister
    pixel(img, 11, 14, p['skin_shade'])
    pixel(img, 12, 14, p['skin_shade'])
    pixel(img, 10, 15, p['skin_shade'])
    pixel(img, 13, 15, p['skin_shade'])
    pixel(img, 11, 15, p['cloth'])  # tooth gap
    pixel(img, 12, 15, p['cloth'])


def paint_horns(img, p):
    """Paint horns on the HAT overlay layer (head+32,0)."""
    # The hat layer mirrors head positions but shifted by +32 on x
    # Let's add horns rising from the top, visible from front and sides

    # FRONT face (40, 8 to 47, 15) — this is the front of the hat overlay
    # Horns start at top corners and go up — we paint the bottom of horns visible on the front
    # Two horns: left (~41, 8) and right (~46, 8)
    horns_pixels_front = [
        (41, 8), (41, 9),
        (46, 8), (46, 9),
    ]
    horns_tips_front = [(41, 10), (46, 10)]
    for x, y in horns_pixels_front:
        pixel(img, x, y, p['horns'])

    # TOP of head hat layer (40, 0) to (47, 7) — paint horns rising
    # Horns are at corners — top view shows them
    horn_top_pixels = [
        # Left horn base (curving up)
        (40, 0), (41, 0), (40, 1), (41, 1),
        # Right horn base
        (46, 0), (47, 0), (46, 1), (47, 1),
    ]
    for x, y in horn_top_pixels:
        pixel(img, x, y, p['horns'])

    # Add tip color
    pixel(img, 40, 0, p['horns_tip'])
    pixel(img, 47, 0, p['horns_tip'])

    # SIDES of head hat - show the horn bases from the sides
    # Right side (32, 8) to (39, 15)
    pixel(img, 33, 8, p['horns'])
    pixel(img, 33, 9, p['horns'])
    pixel(img, 34, 8, p['horns_tip'])
    # Left side (48, 8) to (55, 15)
    pixel(img, 54, 8, p['horns'])
    pixel(img, 54, 9, p['horns'])
    pixel(img, 53, 8, p['horns_tip'])

    # BACK of hat (56, 8) — rear of horns
    pixel(img, 57, 8, p['horns'])
    pixel(img, 57, 9, p['horns'])
    pixel(img, 62, 8, p['horns'])
    pixel(img, 62, 9, p['horns'])

    # Add some fierce hair texture on top
    for dx in range(2, 6):
        pixel(img, 40 + dx, 7, p['horns'])  # forehead bangs


def paint_body(img, p):
    """Paint body with clothing + glowing chest marking."""
    # Body front (20, 20) 8x12
    shade_rect(img, 20, 20, 8, 12, p['cloth'], p['cloth'], p['cloth_accent'])
    # Sides
    shade_rect(img, 16, 20, 4, 12, p['cloth'], p['cloth'], p['cloth'])
    shade_rect(img, 28, 20, 4, 12, p['cloth'], p['cloth'], p['cloth'])
    # Back
    shade_rect(img, 32, 20, 8, 12, p['cloth'], p['cloth'], p['cloth'])
    # Top/bottom
    shade_rect(img, 20, 16, 8, 4, p['cloth'], p['cloth'], p['cloth'])
    shade_rect(img, 28, 16, 8, 4, p['cloth'], p['cloth'], p['cloth'])

    # Glowing chest rune (front of body, centered)
    # Body front spans (20,20) to (27,31) — center is around (23,25)
    rune_pixels = [
        (23, 23), (24, 23),
        (22, 24), (25, 24),
        (23, 25), (24, 25),
        (23, 27),
        (22, 28), (24, 28),
        (23, 29),
    ]
    for x, y in rune_pixels:
        pixel(img, x, y, p['marking'])
    # Glow halo around rune
    glow = [(22, 22), (25, 22), (22, 23), (25, 23), (21, 25), (26, 25)]
    for x, y in glow:
        pixel(img, x, y, p['marking_glow'])


def paint_arms(img, p):
    """Paint both arms (4-wide format 1.8+)."""
    # Right arm: front (44,20) 4x12
    shade_rect(img, 44, 20, 4, 12, p['skin'], p['skin_shade'], p['skin_light'])
    shade_rect(img, 40, 20, 4, 12, p['skin_shade'], p['skin_shade'], p['skin'])
    shade_rect(img, 48, 20, 4, 12, p['skin_shade'], p['skin_shade'], p['skin'])
    shade_rect(img, 52, 20, 4, 12, p['skin_shade'], p['skin_shade'], p['skin_shade'])
    shade_rect(img, 44, 16, 4, 4, p['skin'], p['skin_shade'], p['skin_light'])
    shade_rect(img, 48, 16, 4, 4, p['skin_shade'], p['skin_shade'], p['skin_shade'])
    # Markings on right forearm
    for y in (24, 26, 28):
        pixel(img, 45, y, p['marking'])
        pixel(img, 46, y, p['marking_glow'])

    # Left arm: front (36,52) 4x12 (1.8+ format)
    shade_rect(img, 36, 52, 4, 12, p['skin'], p['skin_shade'], p['skin_light'])
    shade_rect(img, 32, 52, 4, 12, p['skin_shade'], p['skin_shade'], p['skin'])
    shade_rect(img, 40, 52, 4, 12, p['skin_shade'], p['skin_shade'], p['skin'])
    shade_rect(img, 44, 52, 4, 12, p['skin_shade'], p['skin_shade'], p['skin_shade'])
    shade_rect(img, 36, 48, 4, 4, p['skin'], p['skin_shade'], p['skin_light'])
    shade_rect(img, 40, 48, 4, 4, p['skin_shade'], p['skin_shade'], p['skin_shade'])
    # Markings on left forearm
    for y in (56, 58, 60):
        pixel(img, 37, y, p['marking'])
        pixel(img, 38, y, p['marking_glow'])


def paint_legs(img, p):
    """Paint legs with cloth (pants)."""
    # Right leg: front (4,20) 4x12
    shade_rect(img, 4, 20, 4, 12, p['cloth'], p['cloth'], p['cloth_accent'])
    shade_rect(img, 0, 20, 4, 12, p['cloth'], p['cloth'], p['cloth'])
    shade_rect(img, 8, 20, 4, 12, p['cloth'], p['cloth'], p['cloth'])
    shade_rect(img, 12, 20, 4, 12, p['cloth'], p['cloth'], p['cloth'])
    shade_rect(img, 4, 16, 4, 4, p['cloth'], p['cloth'], p['cloth'])
    shade_rect(img, 8, 16, 4, 4, p['cloth'], p['cloth'], p['cloth'])
    # Knee marking
    pixel(img, 5, 26, p['marking'])
    pixel(img, 6, 26, p['marking_glow'])

    # Left leg: front (20,52) 4x12 (1.8+ format)
    shade_rect(img, 20, 52, 4, 12, p['cloth'], p['cloth'], p['cloth_accent'])
    shade_rect(img, 16, 52, 4, 12, p['cloth'], p['cloth'], p['cloth'])
    shade_rect(img, 24, 52, 4, 12, p['cloth'], p['cloth'], p['cloth'])
    shade_rect(img, 28, 52, 4, 12, p['cloth'], p['cloth'], p['cloth'])
    shade_rect(img, 20, 48, 4, 4, p['cloth'], p['cloth'], p['cloth'])
    shade_rect(img, 24, 48, 4, 4, p['cloth'], p['cloth'], p['cloth'])
    pixel(img, 21, 58, p['marking'])
    pixel(img, 22, 58, p['marking_glow'])


def generate(name, palette):
    img = Image.new('RGBA', (64, 64), (0, 0, 0, 0))
    paint_head(img, palette)
    paint_horns(img, palette)
    paint_body(img, palette)
    paint_arms(img, palette)
    paint_legs(img, palette)

    out_path = OUT / f'{name}.png'
    img.save(out_path, 'PNG')
    print(f'  ✓ {name}.png  ({palette["name"]})')


def main():
    print('Generando demonios...')
    OUT.mkdir(exist_ok=True)
    for name, palette in DEMONS.items():
        generate(name, palette)
    print(f'\nGenerados {len(DEMONS)} demonios en {OUT}/')


if __name__ == '__main__':
    main()
