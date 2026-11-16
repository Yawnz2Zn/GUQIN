b=open('base.html').read();p=open('pages.html').read()
js='\n'.join(open(f).read() for f in ['art.js','core.js','voice.js','scene.js','pages.js','expo.js','play.js','shop.js','hub.js','main.js'])
out=b.replace('<!--PAGES-->',p).replace('/*JS*/',js)
open('../index.html','w').write(out);print(len(out))
