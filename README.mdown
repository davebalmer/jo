Summary
=======

Jo is a JavaScript framework for HTML5 capable browsers and devices. It was
originally designed to work on mobile platforms as a GUI and light data layer
on top of PhoneGap. Since its creation, Jo has also been tested successfully
as a lightweight framework for mobile browsers, newer desktop browsers, and
even Dashboard widgets.

Building
========

It's pretty easy to build on your own, but to get the most out of it you'll
want to get a minifier like `jsmin` or the YUI Compressor. Minified and
gzipped, Jo weighs in around 12K with no other JavaScript library dependancies.

Mac OSX, Linux & BSD
--------------------

	cd jo
	./build


Windows
-------

	cd jo
	build.bat

If you're not up for building the library yourself, there's nothing wrong with
downloading the latest stable release, all built and ready to plug in by selecting
"Download as Zip" here on GitHub.


Directory Map
=============

Important files in the directory tree are:

- `js/jo_min.js`

  This is the jo library bundled and minified, ready to drop into your project. You
  will need to build the library to make this file (as well as the un-minified
  version `jo.js` which is useful for debugging).

- `css/flattery/*`

  This is the new CSS3 bundle ready to ship your app with. Also serves as a good example
  of modern HTML5 styling capabilities. Looks pretty bad in IE up through version 8.

- `docs/*.mdown`

  These are supplimental doc files which are used by joDoc to build out the
  developer guide portions of the documentation.

[![endorse](https://api.coderwall.com/balmer/endorsecount.png)](https://coderwall.com/balmer)
