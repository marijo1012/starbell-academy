#!/usr/bin/env python3
"""Bundle the parts of pixelfx the game uses into js/pixelfx.js (one plain script, global PFX).

Only the modules the three Starbell upgrade glows need are included (fx runtime, painter, colour, maths,
particles, sim, font, actor); the rest of pixelfx/src stays out of the game. No Node or npm needed.
Run from anywhere:  python3 tools/bundle_pixelfx.py"""
import pathlib, re
R = pathlib.Path(__file__).resolve().parent.parent
S = R / 'pixelfx/src'
# dependency order
MODS = ['core/math.js', 'core/color.js', 'core/font.js', 'core/painter.js', 'core/particles.js', 'core/sim.js',
        'core/actor.js', 'core/fx.js', 'fx/starbell/_lib.js',
        'fx/starbell/enhance-sword.js', 'fx/starbell/enhance-bow.js', 'fx/starbell/enhance-staff.js']
# names the effects pull from core/index.js, and the module each really lives in
INDEX = {'fit': 'core/color.js', 'WHITE': 'core/color.js', 'TAU': 'core/math.js', 'cycle': 'core/particles.js',
         'sparkle': 'core/sim.js'}
ident = lambda m: 'M_' + re.sub(r'\W', '_', m[:-3])

def convert(mod):
    src = (S / mod).read_text()
    here = (S / mod).parent
    head, exports = [], []
    def imp(m):
        names = [n.strip() for n in m.group(1).split(',') if n.strip()]
        target = (here / m.group(2)).resolve().relative_to(S.resolve()).as_posix()
        out = []
        for n in names:
            a, _, b = n.partition(' as ')
            t = INDEX.get(a.strip(), None) if target == 'core/index.js' else target
            assert t in MODS, (mod, n, target)
            out.append('const %s=%s.%s;' % ((b or a).strip(), ident(t), a.strip()))
        return ''.join(out)
    src = re.sub(r'^import\s*\{([^}]*)\}\s*from\s*"([^"]+)";?', imp, src, flags=re.M)
    def exl(m):
        exports.extend(n.strip() for n in m.group(1).split(',') if n.strip())
        return ''
    src = re.sub(r'^export\s*\{([^}]*)\};?', exl, src, flags=re.M)
    def exd(m):
        exports.append(m.group(2)); return m.group(1)
    src = re.sub(r'^export\s+((?:const|function|class)\s+(\w+))', exd, src, flags=re.M)
    # export const A = ..., B = ...  (several names in one statement)
    assert 'export ' not in re.sub(r'//.*|/\*[\s\S]*?\*/', '', src), mod
    return 'const %s=(()=>{%s\nreturn{%s}})();\n' % (ident(mod), src, ','.join(sorted(set(exports))))

out = ['/* pixelfx (MIT) Copyright (c) 2026 Patch, Copyright (c) 2026 Hugo Duprez. See pixelfx/LICENSE and pixelfx/NOTICE.md.',
       '   Bundled by tools/bundle_pixelfx.py: only the modules the Starbell upgrade glows use. */',
       'var PFX=(()=>{"use strict";']
out += [convert(m) for m in MODS]
out.append('return{createFrame:M_core_fx.createFrame,clearFrame:M_core_fx.clearFrame,createFx:M_core_fx.createFx,'
           'composite:M_core_fx.composite,FX:{sword:M_fx_starbell_enhance_sword,bow:M_fx_starbell_enhance_bow,'
           'staff:M_fx_starbell_enhance_staff}}})();\n')
(R / 'js/pixelfx.js').write_text('\n'.join(out))
print('js/pixelfx.js', (R / 'js/pixelfx.js').stat().st_size, 'bytes')
