default: build

build: lint
	rm -rf dist
	mkdir dist
	java -jar lib/yuicompressor-2.4.8.jar app.js -o dist/app.js
	java -jar lib/yuicompressor-2.4.8.jar app.css -o dist/app.css
	html-minifier -o dist/index.html index.html 
	cp jquery-3.3.1.min.js dist/

lint:
	jshint app.js
	csslint app.css