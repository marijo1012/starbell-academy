#!/usr/bin/env python3
"""Add or replace one art key: encode a prepared PNG (already cut into a horizontal strip of frames)
as WebP into art/<group>/<key>.webp and update manifest.json.

  python3 tools/add_art.py KEY strip.png --group academy --n 4 --ax 40 --ay 148 [--ds 1] [--q 80]

--n is the frame count (frame width = image width / n). Without --ax/--ay the anchor is bottom-centre.
Keeps an existing key's group and anchors unless you pass new ones. Run tools/stamp.py afterwards."""
import argparse,hashlib,io,json,pathlib
from PIL import Image
R=pathlib.Path(__file__).resolve().parent.parent
a=argparse.ArgumentParser();a.add_argument('key');a.add_argument('png')
for f in('group',):a.add_argument('--'+f)
for f in('n','ax','ay'):a.add_argument('--'+f,type=int)
a.add_argument('--ds',type=float);a.add_argument('--q',type=int,default=80);o=a.parse_args()
man=json.loads((R/'manifest.json').read_text());old=man.get(o.key,{})
im=Image.open(o.png);im=im.convert('RGBA' if im.mode in('RGBA','LA','P') else 'RGB')
n=o.n or old.get('n',1);fw,fh=im.width//n,im.height
g=o.group or old.get('group') or 'core'
buf=io.BytesIO();im.save(buf,'WEBP',quality=o.q,alpha_quality=90,method=6);b=buf.getvalue()
if old.get('group') and old['group']!=g:(R/'art'/old['group']/(o.key+'.webp')).unlink(missing_ok=True)
(R/'art'/g).mkdir(parents=True,exist_ok=True);(R/'art'/g/(o.key+'.webp')).write_bytes(b)
e={'n':n,'fw':fw,'fh':fh,'ax':o.ax if o.ax is not None else old.get('ax',fw//2),'ay':o.ay if o.ay is not None else old.get('ay',fh),'group':g,'v':hashlib.sha1(b).hexdigest()[:8]}
ds=o.ds if o.ds is not None else old.get('ds')
if ds and ds!=1:e['ds']=ds
man[o.key]=e;(R/'manifest.json').write_text(json.dumps(man,separators=(',',':'),sort_keys=True))
print(o.key,g,'%d frames %dx%d'%(n,fw,fh),'%.1f KB'%(len(b)/1024))
