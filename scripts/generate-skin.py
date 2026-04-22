#!/usr/bin/env python3
"""Genera un skin custom 64x64 de Steve-Hermes: casco alado dorado, túnica crema, sandalias."""
from PIL import Image

W, H = 64, 64

SKIN = (236, 207, 172, 255)      # piel clara
HAIR = (90, 55, 30, 255)         # pelo oscuro
EYE  = (46, 156, 202, 255)       # ojos teal digital
MOUTH= (120, 70, 50, 255)        # boca
GOLD = (201, 168, 76, 255)       # dorado Hermes
GOLD_L=(245, 213, 122, 255)      # dorado claro (alas)
GOLD_D=(156, 126, 46, 255)       # dorado oscuro (sombras casco)
CREAM= (250, 247, 240, 255)      # túnica
CREAM_D=(220, 215, 200, 255)     # sombra túnica
NAVY = (13, 27, 42, 255)         # navy (cinturón)
LEG  = (80, 70, 110, 255)        # pantalón corto
LEG_D= (50, 44, 75, 255)         # sombra pantalón
SANDAL=(140, 100, 50, 255)       # sandalias cuero
WING = (230, 230, 240, 255)      # plumas claras
NONE = (0, 0, 0, 0)

img = Image.new("RGBA", (W, H), NONE)
px  = img.load()

def fill(x0, y0, w, h, c):
    for y in range(y0, y0 + h):
        for x in range(x0, x0 + w):
            if 0 <= x < W and 0 <= y < H:
                px[x, y] = c

def outline(x0, y0, w, h, c):
    for y in range(y0, y0 + h):
        px[x0, y] = c
        px[x0 + w - 1, y] = c
    for x in range(x0, x0 + w):
        px[x, y0] = c
        px[x, y0 + h - 1] = c

# ---- CABEZA (8x8 cara en 8,8 / 8x8 top,bottom,sides) ----
# Layout clásico Minecraft:
#  (8,0-8)  = top       (8x8)
#  (16,0-8) = bottom    (8x8)
#  (0,8-16) = right      (8x8)
#  (8,8-16) = front      (8x8)
#  (16,8-16)= left       (8x8)
#  (24,8-16)= back       (8x8)

# FRONT CARA
fill(8, 8, 8, 8, SKIN)
# pelo / cejas
fill(8, 8, 8, 1, HAIR)          # franja superior (pelo visible)
fill(8, 9, 8, 1, HAIR)
# ojos
fill(10, 11, 2, 1, EYE)
fill(12, 11, 2, 1, SKIN)
fill(14, 11, 2, 1, EYE)
# boca
fill(11, 13, 4, 1, MOUTH)

# TOP cabeza (pelo)
fill(8, 0, 8, 8, HAIR)

# BOTTOM cabeza
fill(16, 0, 8, 8, SKIN)

# RIGHT side cabeza
fill(0, 8, 8, 8, SKIN)
fill(0, 8, 8, 2, HAIR)  # pelo
# oreja
fill(6, 11, 1, 2, SKIN)

# LEFT side cabeza
fill(16, 8, 8, 8, SKIN)
fill(16, 8, 8, 2, HAIR)
fill(17, 11, 1, 2, SKIN)

# BACK cabeza
fill(24, 8, 8, 8, SKIN)
fill(24, 8, 8, 5, HAIR)  # pelo largo detrás

# ---- OVERLAY HAT (capa exterior cabeza) = CASCO ALADO ----
# Layout overlay head:
#  (40,0-8)  top     ; (48,0-8) bottom
#  (32,8-16) right   ; (40,8-16) front ; (48,8-16) left ; (56,8-16) back

# Casco dorado cubre todo el perímetro top
fill(40, 0, 8, 8, GOLD)       # top casco
fill(48, 0, 8, 8, GOLD_D)     # bottom (interior)

# FRONT casco: banda dorada arriba + apertura para cara
fill(40, 8, 8, 4, GOLD)       # banda frontal sup
# pequeño triángulo/pico al centro
fill(43, 11, 2, 1, GOLD_L)
# lados siguen bajando a la nuca — dejamos cara libre (transparente)

# RIGHT: casco + ALA derecha
fill(32, 8, 8, 4, GOLD)       # banda
# ala:
fill(32, 4, 1, 1, GOLD_L)
fill(33, 5, 2, 1, GOLD_L)
fill(34, 6, 3, 1, WING)
fill(35, 7, 3, 1, WING)
fill(32, 6, 2, 2, GOLD)

# LEFT: casco + ALA izquierda (espejo)
fill(48, 8, 8, 4, GOLD)
fill(55, 4, 1, 1, GOLD_L)
fill(53, 5, 2, 1, GOLD_L)
fill(51, 6, 3, 1, WING)
fill(50, 7, 3, 1, WING)
fill(54, 6, 2, 2, GOLD)

# BACK casco
fill(56, 8, 8, 4, GOLD)

# ---- CUERPO (túnica crema con cinturón navy) ----
# body layout:
#  (20,16-20) top       (8x4)
#  (28,16-20) bottom    (8x4)
#  (16,20-32) right     (4x12)
#  (20,20-32) front     (8x12)
#  (28,20-32) left      (4x12)
#  (32,20-32) back      (8x12)

# FRONT túnica
fill(20, 20, 8, 12, CREAM)
# cinturón navy
fill(20, 26, 8, 2, NAVY)
# hebilla dorada
fill(23, 26, 2, 2, GOLD)
# bordado dorado vertical
fill(23, 20, 1, 6, GOLD)
fill(24, 20, 1, 6, GOLD)

# BACK túnica
fill(32, 20, 8, 12, CREAM_D)
fill(32, 26, 8, 2, NAVY)

# RIGHT side
fill(16, 20, 4, 12, CREAM_D)
fill(16, 26, 4, 2, NAVY)

# LEFT side
fill(28, 20, 4, 12, CREAM_D)
fill(28, 26, 4, 2, NAVY)

# TOP (hombros)
fill(20, 16, 8, 4, CREAM)
# BOTTOM (cintura interna)
fill(28, 16, 8, 4, CREAM_D)

# ---- BRAZO DERECHO (4x4 top, 4x12 lados) ----
# right arm layout:
#  (44,16-20) top       (4x4)
#  (48,16-20) bottom    (4x4)
#  (40,20-32) right     (4x12)
#  (44,20-32) front     (4x12)
#  (48,20-32) left      (4x12)
#  (52,20-32) back      (4x12)

# Piel en la parte baja (brazos desnudos), manga crema arriba
# front
fill(44, 20, 4, 6, CREAM)      # manga
fill(44, 20, 4, 1, GOLD)       # ribete hombro dorado
fill(44, 26, 4, 6, SKIN)       # antebrazo
# back
fill(52, 20, 4, 6, CREAM_D)
fill(52, 20, 4, 1, GOLD)
fill(52, 26, 4, 6, SKIN)
# right side
fill(40, 20, 4, 6, CREAM_D)
fill(40, 20, 4, 1, GOLD)
fill(40, 26, 4, 6, SKIN)
# left side
fill(48, 20, 4, 6, CREAM)
fill(48, 20, 4, 1, GOLD)
fill(48, 26, 4, 6, SKIN)
# top (hombro)
fill(44, 16, 4, 4, CREAM)
# bottom (mano)
fill(48, 16, 4, 4, SKIN)

# ---- BRAZO IZQUIERDO (formato 1.8+, espejado) ----
# left arm layout:
#  (36,48-52) top
#  (40,48-52) bottom
#  (32,52-64) right
#  (36,52-64) front
#  (40,52-64) left
#  (44,52-64) back
fill(36, 52, 4, 6, CREAM)
fill(36, 52, 4, 1, GOLD)
fill(36, 58, 4, 6, SKIN)
fill(44, 52, 4, 6, CREAM_D)
fill(44, 52, 4, 1, GOLD)
fill(44, 58, 4, 6, SKIN)
fill(32, 52, 4, 6, CREAM_D)
fill(32, 52, 4, 1, GOLD)
fill(32, 58, 4, 6, SKIN)
fill(40, 52, 4, 6, CREAM)
fill(40, 52, 4, 1, GOLD)
fill(40, 58, 4, 6, SKIN)
fill(36, 48, 4, 4, CREAM)
fill(40, 48, 4, 4, SKIN)

# ---- PIERNA DERECHA (shorts + sandalias) ----
# right leg layout:
#  (4,16-20) top       (4x4)
#  (8,16-20) bottom    (4x4)
#  (0,20-32) right     (4x12)
#  (4,20-32) front     (4x12)
#  (8,20-32) left      (4x12)
#  (12,20-32) back     (4x12)

# shorts oscuros arriba, piel abajo, sandalias al final
# front
fill(4, 20, 4, 6, LEG)
fill(4, 26, 4, 5, SKIN)
fill(4, 31, 4, 1, SANDAL)
# ribete correa sandalia
fill(4, 29, 4, 1, SANDAL)
# back
fill(12, 20, 4, 6, LEG_D)
fill(12, 26, 4, 5, SKIN)
fill(12, 31, 4, 1, SANDAL)
fill(12, 29, 4, 1, SANDAL)
# right
fill(0, 20, 4, 6, LEG_D)
fill(0, 26, 4, 5, SKIN)
fill(0, 31, 4, 1, SANDAL)
fill(0, 29, 4, 1, SANDAL)
# left
fill(8, 20, 4, 6, LEG)
fill(8, 26, 4, 5, SKIN)
fill(8, 31, 4, 1, SANDAL)
fill(8, 29, 4, 1, SANDAL)
# top
fill(4, 16, 4, 4, LEG)
# bottom (suela)
fill(8, 16, 4, 4, SANDAL)

# ---- PIERNA IZQUIERDA (1.8+, espejado) ----
# left leg layout:
#  (20,48-52) top
#  (24,48-52) bottom
#  (16,52-64) right
#  (20,52-64) front
#  (24,52-64) left
#  (28,52-64) back
fill(20, 52, 4, 6, LEG)
fill(20, 58, 4, 5, SKIN)
fill(20, 63, 4, 1, SANDAL)
fill(20, 61, 4, 1, SANDAL)
fill(28, 52, 4, 6, LEG_D)
fill(28, 58, 4, 5, SKIN)
fill(28, 63, 4, 1, SANDAL)
fill(28, 61, 4, 1, SANDAL)
fill(16, 52, 4, 6, LEG_D)
fill(16, 58, 4, 5, SKIN)
fill(16, 63, 4, 1, SANDAL)
fill(16, 61, 4, 1, SANDAL)
fill(24, 52, 4, 6, LEG)
fill(24, 58, 4, 5, SKIN)
fill(24, 63, 4, 1, SANDAL)
fill(24, 61, 4, 1, SANDAL)
fill(20, 48, 4, 4, LEG)
fill(24, 48, 4, 4, SANDAL)

import os
os.makedirs("/home/saira/web/hermescraft/public", exist_ok=True)
img.save("/home/saira/web/hermescraft/public/skin-hermes.png")
print("✓ skin-hermes.png generado (64x64)")
