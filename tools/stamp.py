#!/usr/bin/env python3
"""Stamp a fresh build id into index.html so browsers fetch the new js/game.js and manifest.json.
Run from the repo root after changing js/game.js or manifest.json:  python3 tools/stamp.py"""
import hashlib,re,pathlib
R=pathlib.Path(__file__).resolve().parent.parent
h=hashlib.sha1((R/'js/game.js').read_bytes()+(R/'js/pixelfx.js').read_bytes()+(R/'manifest.json').read_bytes()).hexdigest()[:10]
p=R/'index.html';s=p.read_text()
s,n=re.subn(r"const BUILD='[^']*'","const BUILD='%s'"%h,s);assert n==1
p.write_text(s);print('build',h)
