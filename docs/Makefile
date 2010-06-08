docs: *.mdown
#	docker `find ../js -name *.js` > tmp.md
	../jodoc/docker ../js/*.js > ./tmp.md
	cat ../ABOUT ../README ../LICENSE `find .. -name "*.mdown"` ./tmp.md | markdown | ../jodoc/autolink > html/raw.html
	../jodoc/htmlhead ./html/raw.html > ./html/index.html
	rm tmp.md

clean:
	rm ./html/*.html
