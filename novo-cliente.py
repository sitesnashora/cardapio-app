#!/usr/bin/env python3
"""Cria a pasta de um cliente novo dentro do repositório.
Uso: python3 novo-cliente.py <pasta_repo> <id-da-loja> <plano: essencial|pro>
A loja fica em sitesnashora.github.io/cardapio-app/<id-da-loja>/
"""
import sys, os, re
repo, loja, plano = sys.argv[1], sys.argv[2], (sys.argv[3] if len(sys.argv) > 3 else "pro")
assert re.fullmatch(r"[a-z0-9-]{3,40}", loja), "id da loja: só letras minúsculas, números e hífen"
dest = os.path.join(repo, loja); os.makedirs(dest, exist_ok=True)
FB = '''{
    apiKey: "AIzaSyDk6mMm2asGo69CS57yodav45_oXL_NimQ",
    authDomain: "cardapio-direto.firebaseapp.com",
    projectId: "cardapio-direto",
    appId: "1:139945601542:web:d61ff70a2a039543f87187"
  }'''
cfg = open(os.path.join(repo, "config.js")).read()
cfg = re.sub(r'lojaId: "[^"]*"', f'lojaId: "{loja}"', cfg)
cfg = re.sub(r'plano: "[^"]*"', f'plano: "{plano}"', cfg)
cfg = re.sub(r'demo: true', 'demo: false', cfg)
cfg = re.sub(r'firebase: null', 'firebase: ' + FB, cfg)
open(os.path.join(dest, "config.js"), "w").write(cfg)
SHARED = ["app.css", "store.js", "art.js", "atendente.js", "pix.js", "icon.svg", "icon-192.png", "icon-512.png"]
for f in ["index.html", "admin.html"]:
    s = open(os.path.join(repo, f)).read()
    sdk = "".join(f'<script src="https://www.gstatic.com/firebasejs/10.12.2/firebase-{m}-compat.js"></script>\n' for m in ["app", "auth", "firestore"])
    s = s.replace('<script src="config.js"></script>', sdk + '<script src="config.js"></script>')
    for a in SHARED:
        s = s.replace(f'href="{a}"', f'href="../{a}"').replace(f'src="{a}"', f'src="../{a}"')
    open(os.path.join(dest, f), "w").write(s)
for f, start in [("manifest.json", "./"), ("manifest-admin.json", "admin.html")]:
    m = open(os.path.join(repo, f)).read().replace('"src":"icon', '"src":"../icon')
    open(os.path.join(dest, f), "w").write(m)
print("ok:", dest)
