all: clean core data ui minify

clean:
	rm -f ./jo.js
	rm -f ./jo_min.js

check:
	find . -name "*.js" | xargs jsure -quiet -info-color none -warning-color none -error-color none -number-color none -code-color none -hl-color none -unused-args i -unused-funs i -shadowing-args i -assigning-to-args i -unbound-variables e -errors p -warnings p -unused-vars i

core:
	$(MAKE) -C ./core

data:
	$(MAKE) -C ./data

ui:
	$(MAKE) -C ./ui

minify:
	cat ./jo.js | jsmin > ./jo_min.js
