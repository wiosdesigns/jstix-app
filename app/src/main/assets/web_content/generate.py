from jinja2 import Template
import os

folder = 'svg/'
files = sorted(os.listdir(folder))
svgs = []
template = ''

with open('indextemplate.html') as f:
    template = Template(f.read())

for i in files:
    svg = {}
    if i[-4:] == '.svg':
        svg['name'] = i[:-4]
        svg['code'] = ''
        with open(folder+i) as f:
            codelines = f.readlines()
            for j in codelines[1:-1]:
                svg['code'] += j
    svgs.append(svg)

with open('index.html','w') as f:
    f.write(template.render(svgs=svgs))
    f.close()
