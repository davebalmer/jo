@echo off
if not exists ./js/core/_jo.js goto wrongdir

echo "Building js/jo.js"

cd js/core
copy log.js + _jo.js + dom.js + event.js + subject.js + time.js + yield.js + cache.js + chain.js + clipboard.js + local.js ../jo_core.js

cd ../data
copy datasource.js + database.js + sqldatasource.js + script.js + preference.js ../jo_data.js

cd ../ui
copy view.js + container.js + control.js + button.js + busy.js + list.js + busy.js + caption.js + card.js + stack.js + scroller.js + divider.js + expando.js + flexrow.js + focus.js + footer.js + gesture.js + group.js + html.js + input.js + label.js + menu.js + passwordinput.js + popup.js + screen.js + shim.js + sound.js + stackscroller.js + tabbar.js + table.js + textarea.js + title.js + toolbar.js ../jo_ui.js

cd ..

copy jo_core.js + jo_data.js + jo_ui.js jo.js
del jo_core.js
del jo_data.js
del jo_ui.js

if exists jsmin.exe goto minify
echo "jsmin not found, skipping minification."
goto end

:minify
echo "Minifying js/jo.js -> js/jo_min.js"
jsmin < jo.js > jo_min.js
goto end

:wrongdir
echo "OOPS: Run this batch file from the jo source directory, e.g. cd jo first."
goto end

:end
cd ..
echo "Done."
