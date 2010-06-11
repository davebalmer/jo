all: js docs

docs:
	$(MAKE) -C ./docs

js:
	$(MAKE) -C ./js

samples:
	$(MAKE) -C ./samples

clean:
	$(MAKE) clean -C ./js
	$(MAKE) clean -C ./docs
