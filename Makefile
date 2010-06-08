#export GRROK_ID = com.grrok.pokerdrops
#export GRROK_VER = 1.0.7

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
