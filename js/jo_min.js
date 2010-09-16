
joLog=function(){if(typeof console==="undefined"||typeof console.log==="undefined"||!console.log)
return;var strings=[];for(var i=0;i<arguments.length;i++){strings.push(arguments[i]);}
console.log(strings.join(" "));}
Function.prototype.extend=function(superclass,proto){this.prototype=new superclass();if(proto){for(var i in proto)
this.prototype[i]=proto[i];}};if(typeof Function.prototype.bind==='undefined'){Function.prototype.bind=function(context){var self=this;function callbind(){return self.apply(context,arguments);}
return callbind;};}
jo={platform:"webkit",version:"0.1.0",useragent:['ipad','iphone','webos','android','opera','chrome','safari','mozilla','gecko','explorer'],debug:false,setDebug:function(state){this.debug=state;},flag:{stopback:false},load:function(call,context){joDOM.enable();this.loadEvent=new joSubject(this);this.unloadEvent=new joSubject(this);document.body.onMouseDown=function(e){e.preventDefault();};document.body.onDragStart=function(e){e.preventDefault();};if(typeof navigator=='object'&&navigator.userAgent){var agent=navigator.userAgent.toLowerCase();for(var i=0;i<this.useragent.length;i++){if(agent.indexOf(this.useragent[i])>=0){this.platform=this.useragent[i];break;}}}
if(joGesture)
joGesture.load();joLog("Jo",this.version,"loaded for",this.platform,"environment.");this.loadEvent.fire();},getPlatform:function(){return this.platform;},matchPlatform:function(test){return(test.indexOf(this.platform)>=0);},getVersion:function(){return this.version;},getLanguage:function(){return this.language;}};joDOM={enabled:false,get:function(id){if(typeof id==="string"){return document.getElementById(id);}
else if(typeof id==='object'){if(id instanceof joView)
return id.container;else
return id;}},remove:function(node){if(node.parentNode){node.parentNode.removeChild(node);}},enable:function(){this.enabled=true;},getParentWithin:function(node,ancestor){while(node.parentNode!==window&&node.parentNode!==ancestor){node=node.parentNode;}
return node;},addCSSClass:function(node,classname){if(typeof node.className!=="undefined"){var n=node.className.split(/\s+/);for(var i=0,l=n.length;i<l;i++){if(n[i]==classname)
return;}
n.push(classname);node.className=n.join(" ");}
else{node.className=classname;}},removeCSSClass:function(node,classname,toggle){if(typeof node.className!=="undefined"){var n=node.className.split(/\s+/);for(var i=0,l=n.length;i<l;i++){if(n[i]==classname){if(l==1)
node.className="";else{n.splice(i,i);node.className=n.join(" ");}
return;}}
if(toggle){n.push(classname);node.className=n.join(" ");}}
else{node.className=classname;}},toggleCSSClass:function(node,classname){this.removeCSSClass(node,classname,true);},create:function(tag,style){if(!this.enabled)
return null;if(typeof tag==="object"&&typeof tag.tagName==="string"){var o=document.createElement(tag.tagName);if(tag.className)
this.setStyle(o,tag.className);}
else{var o=document.createElement(tag);if(style)
this.setStyle(o,style);}
return o;},setStyle:function(node,style){if(typeof style==="string"){node.className=style;}
else if(typeof style==="object"){for(var i in style){switch(i){case"id":case"className":node[i]=style[i];break;default:node.style[i]=style[i];}}}
else if(typeof style!=="undefined"){throw("joDOM.setStyle(): unrecognized type for style argument; must be object or string.");}},applyCSS:function(style,oldnode){if(oldnode)
document.body.removeChild(oldnode);var css=joDOM.create('jostyle');css.innerHTML='<style>'+style+'</style>';document.body.appendChild(css);return css;},removeCSS:function(node){document.body.removeChild(node);},loadCSS:function(filename,oldnode){if(oldnode)
var css=oldnode;else
var css=joDOM.create('link');css.rel='stylesheet';css.type='text/css';css.href=filename+(jo.debug?("?"+joTime.timestamp()):"");if(!oldnode)
document.body.appendChild(css);return css;}};joCSSRule=function(data){this.setData(data);};joCSSRule.prototype={container:null,setData:function(data){this.data=data||"";if(data)
this.enable();},clear:function(){this.setData();},disable:function(){joDOM.removeCSS(this.container);},enable:function(){this.container=joDOM.applyCSS(this.data,this.container);}};joEvent={eventMap:{"mousedown":"touchstart","mousemove":"touchmove","mouseup":"touchend","mouseout":"touchcancel"},touchy:false,getTarget:function(e){if(!e)
var e=window.event;return e.target?e.target:e.srcElement;},capture:function(element,event,call,context,data){this.on(element,event,call,context,data,true);},on:function(element,event,call,context,data,capture){if(!call||!element)
return false;if(this.touchy){if(this.eventMap[event])
event=this.eventMap[event];}
var element=joDOM.get(element);var call=call;var data=data||"";function wrappercall(e){if(e.touches&&e.touches.length==1){var touches=e.touches[0];e.pageX=touches.pageX;e.pageY=touches.pageY;e.screenX=touches.screenX;e.screenY=touches.screenY;}
if(context)
call.call(context,e,data);else
call(e,data);};if(!window.addEventListener)
element.attachEvent("on"+event,wrappercall);else
element.addEventListener(event,wrappercall,capture||false);return wrappercall;},remove:function(element,event,wrappercall){element.removeEventListener(event,wrappercall);},stop:function(e){if(e.stopPropagation)
e.stopPropagation();else
e.cancelBubble=true;},preventDefault:function(e){e.preventDefault();},block:function(e){if(window.event)
var e=window.event;if(typeof e.target=='undefined')
e.target=e.srcElement;switch(e.target.nodeName.toLowerCase()){case'input':case'textarea':return true;break;default:return false;}}};joSubject=function(subject){this.subscriptions=[];this.subject=subject;};joSubject.prototype={subscribe:function(call,observer,data){if(!call)
return false;var o={"call":call};if(observer)
o.observer=observer;if(data)
o.data=data;this.subscriptions.push(o);return this.subject;},unsubscribe:function(call,observer){if(!call)
return false;for(var i=0,l=this.subscriptions.length;i<l;i++){var sub=this.subscriptions[i];if(sub.call===call&&(typeof sub.observer=="undefined"||sub.observer===observer))
sub.slice(i,1);}
return this.subject;},fire:function(data){if(typeof data==='undefined')
var data="";for(var i=0,l=this.subscriptions.length;i<l;i++){var sub=this.subscriptions[i];var subjectdata=(typeof sub.data!=='undefined')?sub.data:null;if(sub.observer)
sub.call.call(sub.observer,data,this.subject,subjectdata);else
sub.call(data,this.subject,subjectdata);if(sub.capture)
break;}},capture:function(call,observer,data){if(!call)
return false;var o={"call":call,capture:true};if(observer)
o.observer=observer;if(data)
o.data=data;this.subscriptions.unshift(o);return this.subject;},release:function(call,observer){return this.unsubscribe(call,observer);}};function joYield(call,context,delay,data){if(!delay)
var delay=100;if(!context)
var context=this;var timer=window.setTimeout(function(){call.call(context,data);},delay);return timer;};joChain=function(){this.queue=[];this.active=false;this.addEvent=new joSubject("add",this);this.startEvent=new joSubject("start",this);this.stopEvent=new joSubject("stop",this);this.nextEvent=new joSubject("next",this);this.stop();this.delay=100;};joChain.prototype={add:function(call,context,data){if(!context)
var context=this;if(!data)
var data="";this.queue.push({"call":call,"context":context,"data":data});if(this.active&&!this.timer)
this.next();},start:function(){this.active=true;this.startEvent.fire();this.next();},stop:function(){this.active=false;if(this.timer!=null)
window.clearTimeout(this.timer);this.timer=null;this.stopEvent.fire();},next:function(){var nextcall=this.queue.shift();if(!nextcall){this.timer=null;return;}
this.nextEvent.fire(nextcall);nextcall.call.call(nextcall.context,nextcall.data);if(this.queue.length)
this.timer=joEvent.yield(this.next,this,this.delay);else
this.timer=null;}};joClipboard={data:"",get:function(){return joPreference.get("joClipboardData")||this.data;},set:function(clip){this.data=clip;joPreference.set("joClipboardData");}};joCache={cache:{},set:function(key,call,context){if(call)
this.cache[key]={"call":call,"context":context||this};},get:function(key){var cache=this.cache[key]||null;if(cache){if(!cache.view)
cache.view=cache.call(cache.context,cache.call);return cache.view;}
else{return new joView("View not found: "+key);}}};var SEC=1000;var MIN=60*SEC;var HOUR=60*MIN;var DAY=24*HOUR;joTime={timestamp:function(){var now=new Date();return now/1;}};joDatabase=function(datafile,size){this.openEvent=new joEvent.Subject(this);this.closeEvent=new joEvent.Subject(this);this.errorEvent=new joEvent.Subject(this);this.datafile=datafile;this.size=size||256000;this.db=null;};joDatabase.prototype={open:function(){this.db=openDatabase(this.datafile,"1.0",this.datafile,this.size);if(this.db){this.openEvent.fire();}
else{joLog("DataBase Error",this.db);this.errorEvent.fire();}},close:function(){this.db.close();this.closeEvent.fire();},now:function(offset){var date=new Date();if(offset)
date.setDate(date.valueOf()+(offset*1000*60*60*24));return date.format("yyyy-mm-dd");}};joDataSource=function(data){this.changeEvent=new joSubject(this);this.errorEvent=new joSubject(this);if(typeof data!=="undefined")
this.setData();else
this.data="";};joDataSource.prototype={setQuery:function(query){this.query=query;},getQuery:function(){return this.query;},setData:function(data){this.data=data;this.changeEvent.fire(data);},getData:function(){return this.data;},getDataCount:function(){return this.getData().length;},getPageCount:function(){if(this.pageSize)
return Math.floor(this.getData().length/this.pageSize)+1;else
return 1;},getPage:function(index){var start=index*this.pageSize;var end=start+this.pageSize;if(end>this.getData().length)
end=this.getData().length;if(start<0)
start=0;return this.data.slice(start,end);},refresh:function(){},setPageSize:function(length){this.pageSize=length;},getPageSze:function(){return this.pageSize;},load:function(){}};joSQLDataSource=function(db,query,args){this.db=db;this.query=(typeof query=='undefined')?"":query;this.args=(typeof args=='undefined')?[]:args;this.changeEvent=new joEvent.subject(this);this.errorEvent=new joEvent.subject(this);};joSQLDataSource.prototype={setDatabase:function(db){this.db=db;},setQuery:function(query){this.query=query;},setData:function(data){this.data=data;this.changeEvent.fire();},clear:function(){this.data=[];this.changeEvent.fire();},setParameters:function(args){this.args=args;},execute:function(query,args){this.setQuery(query||"");this.setParameters(args);if(this.query)
this.refresh();},refresh:function(){if(!this.db){this.errorEvent.fire();return;}
var self=this;if(arguments.length){var args=[];for(var i=0;i<arguments.length;i++)
args.push(arguments[i]);}
else{var args=this.args;}
var query=this.query;function success(t,result){self.data=[];for(var i=0,l=result.rows.length;i<l;i++){var row=result.rows.item(i);self.data.push(row);}
self.changeEvent.fire(self.data);}
function error(){joLog('SQL error',query,"argument count",args.length);self.errorEvent.fire();}
this.db.db.transaction(function(t){t.executeSql(query,args,success,error);});}};joPreference=function(data){this.preference=data||{};this.changeEvent=new joSubject(this);};joPreference.prototype={loadEvent:new joSubject(this),preference:{},setDataSource:function(source){this.dataSource=source;source.loadEvent.subscribe(this.load,this);},load:function(data){if(data instanceof Array){for(var i=0;i<data.length;i++)
this.set(data[i][0],data[i][1]);}
else if(typeof data==="object"){this.data=data;}},save:function(key){if(key){}
else{}},getNumber:function(key){return 0+this.get(key);},getBoolen:function(key){return 0+this.parseInt(this.get(key));},get:function(key){if(typeof this.preference[key]==='undefined')
return"";else
return this.preference[key].get();},setBoolean:function(key,value){this.set(key,(value)?1:0);},set:function(key,value){if(typeof this.preference[key]==='undefined')
this.preference[key]=new joDataSource(value);else
this.preference[key].set(value);this.save(key);this.changeEvent.fire(key);},bind:function(key){var self=this;if(typeof this.preference[key]==='undefined')
return new joDataSource(key);else
return this.preference[key];}};function joScript(url,call,context){var node=joDOM.create('script');node.onload=handler;node.src=url;document.body.appendChild(node);function handler(){call.call(context||this,node);document.body.removeChild(node);}}
joGesture={load:function(){this.upEvent=new joSubject(this);this.downEvent=new joSubject(this);this.leftEvent=new joSubject(this);this.rightEvent=new joSubject(this);this.forwardEvent=new joSubject(this);this.backEvent=new joSubject(this);this.homeEvent=new joSubject(this);this.closeEvent=new joSubject(this);this.activateEvent=new joSubject(this);this.deactivateEvent=new joSubject(this);this.setEvents();},setEvents:function(){joEvent.on(document.body,"keydown",this.onKeyDown,this);joEvent.on(document.body,"keyup",this.onKeyUp,this);},onKeyUp:function(e){if(!e)
var e=window.event;if(e.keyCode==18){this.altkey=false;return;}
if(e.keyCode==27){if(jo.flag.stopback){joEvent.stop(e);joEvent.preventDefault(e);}
this.backEvent.fire("back");return;}
if(!this.altkey)
return;joEvent.stop(e);switch(e.keyCode){case 37:this.leftEvent.fire("left");break;case 38:this.upEvent.fire("up");break;case 39:this.rightEvent.fire("right");break;case 40:this.downEvent.fire("down");break;case 27:this.backEvent.fire("back");break;case 13:this.forwardEvent.fire("forward");break;}},onKeyDown:function(e){if(!e)
var e=window.event;if(e.keyCode==27){joEvent.stop(e);joEvent.preventDefault(e);}
else if(e.keyCode==13&&joFocus.get()instanceof joInput){joEvent.stop(e);}
else if(e.keyCode==18){this.altkey=true;}
return;}};joView=function(data){this.changeEvent=new joSubject(this);this.setContainer();if(data)
this.setData(data);};joView.prototype={tagName:"joview",busyNode:null,container:null,data:null,getContainer:function(){return this.container;},setContainer:function(container){this.container=joDOM.get(container);if(!this.container)
this.container=this.createContainer();this.setEvents();return this;},createContainer:function(){return joDOM.create(this);},clear:function(){this.data="";if(this.container)
this.container.innerHTML="";this.changeEvent.fire();},setData:function(data){this.data=data;this.refresh();return this;},getData:function(){return this.data;},refresh:function(){if(!this.container||typeof this.data=="undefined")
return 0;this.container.innerHTML="";this.draw();this.setBusy(false);this.changeEvent.fire(this.data);},draw:function(){this.container.innerHTML=this.data;},setStyle:function(style){joDOM.setStyle(this.container,style);return this;},setBusy:function(state,msg){if(state){if(!this.busyNode){this.busyNode=new joBusy(msg);}
this.container.appendChild(this.busyNode.container);}
else{if(this.busyNode){try{this.container.removeChild(this.busyNode.container);}
catch(e){}}}},setEvents:function(){}};joContainer=function(data){joView.apply(this,arguments);};joContainer.extend(joView,{tagName:"jocontainer",getContent:function(){return this.container.childNodes;},setData:function(data){this.data=data;this.refresh();},activate:function(){},deactivate:function(){},push:function(data){if(typeof data==='object'){if(data instanceof Array){for(var i=0;i<data.length;i++)
this.push(data[i]);}
else if(data instanceof joView&&data.container!==this.container){this.container.appendChild(data.container);}
else if(data instanceof Object){this.container.appendChild(data);}}
else{var o=document.createElement("div");o.innerHTML=data;this.container.appendChild(o);}},refresh:function(){this.container.innerHTML="";this.draw();this.changeEvent.fire();},draw:function(){this.push(this.data);}});joCard=function(data){joContainer.apply(this,arguments);};joCard.extend(joContainer,{tagName:"jocard"});joGroup=function(data){joContainer.apply(this,arguments);};joGroup.extend(joContainer,{tagName:"jogroup"});joFooter=function(data){joContainer.apply(this,arguments);};joFooter.extend(joContainer,{tagName:"jofooter"});joStack=function(data){this.visible=false;joView.apply(this,arguments);this.setLocked(true);this.pushEvent=new joSubject(this);this.popEvent=new joSubject(this);this.homeEvent=new joSubject(this);this.showEvent=new joSubject(this);this.hideEvent=new joSubject(this);this.data=[];this.index=0;this.lastIndex=0;this.lastNode=null;};joStack.extend(joView,{tagName:"jostack",eventset:false,setEvents:function(){},onClick:function(e){joEvent.stop(e);},forward:function(){if(this.index<this.data.length-1){this.index++;this.draw();}},back:function(){if(this.index>0){this.index--;this.draw();}},draw:function(){if(!this.container)
this.createContainer();jo.flag.stopback=this.index?true:false;var container=this.container;var oldchild=this.lastNode;var newnode=getnode(this.data[this.index]);var newchild=this.getChildStyleContainer(newnode);function getnode(o){return(typeof o.container!=="undefined")?o.container:o;}
if(!newchild)
return;if(this.index>this.lastIndex){var oldclass="prev";var newclass="next";joDOM.addCSSClass(newchild,newclass);}
else if(this.index<this.lastIndex){var oldclass="next";var newclass="prev";joDOM.addCSSClass(newchild,newclass);}
else{}
this.appendChild(newnode);var self=this;var transitionevent=null;joYield(animate,this,1);function animate(){if(typeof window.onwebkittransitionend!=='undefined')
transitionevent=joEvent.on(newchild,"webkitTransitionEnd",cleanup,self);else
joYield(cleanup,this,200);if(newclass&&newchild)
joDOM.removeCSSClass(newchild,newclass);if(oldclass&&oldchild)
joDOM.addCSSClass(oldchild,oldclass);}
function cleanup(){if(oldchild){self.removeChild(oldchild);joDOM.removeCSSClass(oldchild,"next");joDOM.removeCSSClass(oldchild,"prev");}
if(newchild){if(transitionevent)
joEvent.remove(newchild,"webkitTransitionEnd",transitionevent);joDOM.removeCSSClass(newchild,"next");joDOM.removeCSSClass(newchild,"prev");}}
if(typeof this.data[this.index].activate!=="undefined")
this.data[this.index].activate.call(this.data[this.index]);this.lastIndex=this.index;this.lastNode=newchild;},appendChild:function(child){this.container.appendChild(child);},getChildStyleContainer:function(child){return child;},getChild:function(){return this.container.firstChild;},getContentContainer:function(){return this.container;},removeChild:function(child){this.container.removeChild(child);},isVisible:function(){return this.visible;},push:function(o){this.data.push(o);this.index=this.data.length-1;this.draw();this.pushEvent.fire(o);},setLocked:function(state){this.locked=(state)?1:0;},pop:function(){if(this.data.length>this.locked){var o=this.data.pop();this.index=this.data.length-1;this.draw();if(typeof o.deactivate==="function")
o.deactivate.call(o);if(!this.data.length)
this.hide();}
if(this.data.length>0)
this.popEvent.fire();},home:function(o){if(this.data&&this.data.length){var o=this.data[0];this.data=[];this.data.push(o);this.draw();this.homeEvent.fire();}},showHome:function(){this.home();if(!this.visible){this.visible=true;joDOM.addCSSClass(this.container,"show");this.showEvent.fire();}},show:function(){if(!this.visible){this.visible=true;joDOM.addCSSClass(this.container,"show");joYield(this.showEvent.fire,this.showEvent,500);}},hide:function(){if(this.visible){this.visible=false;joDOM.removeCSSClass(this.container,"show");joYield(this.hideEvent.fire,this.hideEvent,500);}}});joScroller=function(data){this.points=[];this.eventset=false;joContainer.apply(this,arguments);};joScroller.extend(joContainer,{tagName:"joscroller",moved:false,inMotion:false,pacer:0,velocity:1.4,bump:50,setEvents:function(){joEvent.capture(this.container,"click",this.onClick,this);joEvent.on(this.container,"mousedown",this.onDown,this);joEvent.on(this.container,"mouseup",this.onUp,this);joEvent.on(this.container,"mousemove",this.onMove,this);},onFlick:function(e){},onClick:function(e){if(this.moved){this.moved=false;joEvent.stop(e);joEvent.preventDefault(e);}},onDown:function(e){joEvent.stop(e);this.reset();var node=this.container.firstChild;joDOM.removeCSSClass(node,"flick");joDOM.removeCSSClass(node,"flickback");this.start=this.getMouse(e);this.points.unshift(this.start);this.inMotion=true;},reset:function(){this.points=[];this.quickSnap=false;this.moved=false;this.inMotion=false;},onMove:function(e){if(!this.inMotion)
return;joEvent.stop(e);e.preventDefault();var point=this.getMouse(e);var y=point.y-this.points[0].y;this.points.unshift(point);if(this.points.length>5)
this.points.pop();var self=this;this.timer=window.setTimeout(function(){if(self.points.length>1)
self.points.pop();},100);this.scrollBy(y,true);if(!this.moved&&this.points.length>3)
this.moved=true;},onOut:function(e){this.reset();},onUp:function(e){if(!this.inMotion)
return;this.inMotion=false;var end=this.getMouse(e);var node=this.container.firstChild;joEvent.stop(e);var dy=0;for(var i=0;i<this.points.length-1;i++)
dy+=(this.points[i].y-this.points[i+1].y);if(Math.abs(dy)>5&&!this.quickSnap){joDOM.addCSSClass(node,"flick");var flick=dy*(this.velocity*(node.offsetHeight/this.container.offsetHeight));this.eventset=joEvent.on(node,"webkitTransitionEnd",this.snapBack,this);this.scrollBy(flick,false);}
else{this.snapBack();}},getMouse:function(e){return{x:e.screenX,y:e.screenY};},scrollBy:function(y,test){var node=this.container.firstChild;var top=node.offsetTop;if(isNaN(top))
top=0;var dy=Math.floor(top+y);if(node.offsetHeight<=this.container.offsetHeight)
return;var max=0-node.offsetHeight+this.container.offsetHeight;var ody=dy;if(dy>this.bump)
dy=this.bump;else if(dy<max-this.bump)
dy=max-this.bump;if(test){if(ody!=dy)
this.quickSnap=true;else
this.quickSnap=false;}
if(node.offsetTop!=dy)
node.style.top=dy+"px";},scrollTo:function(y,instant){var node=this.container.firstChild;if(!node)
return;if(typeof y=='object'){if(y instanceof HTMLElement)
var e=y;else if(y instanceof joView)
var e=y.container;var t=0-e.offsetTop;var h=e.offsetHeight;var y=top;var top=node.offsetTop;var bottom=top-this.container.offsetHeight;if(t-h<bottom)
y=(t-h)+this.container.offsetHeight;if(y<t)
y=t;}
if(y<0-node.offsetHeight)
y=0-node.offsetHeight;else if(y>0)
y=0;if(!instant){joDOM.addCSSClass(node,'flick');}
else{joDOM.removeCSSClass(node,'flick');joDOM.removeCSSClass(node,'flickback');}
node.style.top=y+"px";},snapBack:function(){var node=this.container.firstChild;var top=parseInt(node.style.top);if(isNaN(top))
top=0;var dy=top;var max=0-node.offsetHeight+this.container.offsetHeight;if(this.eventset)
joEvent.remove(node,'webkitTransitionEnd',this.eventset);joDOM.removeCSSClass(node,'flick');joDOM.addCSSClass(node,'flickback');if(dy>0)
node.style.top="0px";else if(dy<max)
node.style.top=max+"px";}});joExpando=function(data){joContainer.apply(this,arguments);};joExpando.extend(joContainer,{tagName:"joexpando",draw:function(){joContainer.prototype.draw.apply(this,arguments);this.setToggleEvent();},setEvents:function(){},setToggleEvent:function(){joEvent.on(this.container.childNodes[0],"click",this.toggle,this);},toggle:function(){joDOM.toggleCSSClass(this.container,"open");},open:function(){joDOM.addCSSClass(this.container,"open");this.openEvent.fire();},close:function(){joDOM.removeCSSClass(this.container,"open");this.closeEvent.fire();}});joExpandoTitle=function(data){joView.apply(this,arguments);};joExpandoTitle.extend(joView,{tagName:"joexpandotitle",draw:function(){this.container.innerHTML=this.data+"<joicon></joicon>";}});joControl=function(data){this.selectEvent=new joSubject(this);this.enabled=true;if(data instanceof joDataSource){joView.call(this);this.setDataSource(data);}
else{joView.apply(this,arguments);}};joControl.extend(joView,{tagName:"jocontrol",setEvents:function(){joEvent.on(this.container,"click",this.onMouseDown,this);joEvent.on(this.container,"blur",this.onBlur,this);joEvent.on(this.container,"focus",this.onFocus,this);},onMouseDown:function(e){this.select(e);},select:function(e){if(e)
joEvent.stop(e);this.selectEvent.fire(this.data);},enable:function(){joDOM.removeCSSClass(this.container,'disabled');this.container.contentEditable=true;this.enabled=true;},disable:function(){joDOM.addCSSClass(this.container,'disabled');this.container.contentEditable=false;this.enabled=false;},onFocus:function(e){joLog("onFocus",this.data);joEvent.stop(e);joFocus.set(this);},onBlur:function(e){this.data=(this.container.value)?this.container.value:this.container.innerHTML;joLog("onBlur",this.data);joEvent.stop(e);this.blur();this.changeEvent.fire(this.data);},focus:function(e){joDOM.addCSSClass(this.container,'focus');if(!e)
this.container.focus();},blur:function(){joDOM.removeCSSClass(this.container,'focus');},setDataSource:function(source){this.dataSource=source;source.changeEvent.subscribe(this.setData,this);}});joButton=function(data,classname){joControl.apply(this,arguments);if(classname)
this.container.className=classname;};joButton.extend(joControl,{tagName:"jobutton",createContainer:function(){var o=joDOM.create(this);o.setAttribute("tabindex","1");return o;},enable:function(){this.container.setAttribute("tabindex","1");joControl.prototype.enable.call(this);},disable:function(){this.container.removeAttribute("tabindex");joControl.prototype.disable.call(this);}});joInput=function(data){joControl.apply(this,arguments);};joInput.extend(joControl,{tagName:"joinput",setData:function(data){if(data!==this.data){this.data=data;if(typeof this.container.value!="undefined")
this.container.value=data;else
this.container.innerHTML=data;this.changeEvent.fire(this.data);}},getData:function(){if(typeof this.container.value!="undefined")
return this.container.value;else
return this.container.innerHTML;},enable:function(){this.container.setAttribute("tabindex","1");joControl.prototype.enable.call(this);},disable:function(){this.container.removeAttribute("tabindex");joControl.prototype.disable.call(this);},createContainer:function(){var o=joDOM.create(this);if(!o)
return;o.setAttribute("type","text");o.setAttribute("tabindex","1");o.contentEditable=this.enabled;return o;},setEvents:function(){joControl.prototype.setEvents.call(this);joEvent.on(this.container,"keydown",this.onKeyDown,this);},onKeyDown:function(e){if(e.keyCode==13){e.preventDefault();joEvent.stop(e);}
return false;},onMouseDown:function(e){joEvent.stop(e);this.focus();},storeData:function(){this.data=this.getData();if(this.dataSource)
this.dataSource.set(this.value);}});joTextarea=function(data){joInput.apply(this,arguments);};joTextarea.extend(joInput,{tagName:"jotextarea",onKeyDown:function(e){return false;}});joFocus={last:null,set:function(control){if(this.last&&this.last!==control)
this.last.blur();if(control&&control instanceof joControl){control.focus();this.last=control;}},get:function(control){return this.last;},refresh:function(){if(this.last)
this.last.focus();},clear:function(){this.set();}};joList=function(container,data){this.autoSort=false;this.lastNode=null;this.index=0;joControl.apply(this,arguments);};joList.extend(joControl,{tagName:"jolist",data:null,defaultMessage:"",setDefault:function(msg){this.defaultMessage=msg;if(typeof this.data==='undefined'||!this.data||!this.data.length){if(typeof msg==='object'){this.innerHTML="";if(msg instanceof joView)
this.container.appendChild(msg.container);else if(msg instanceof HTMLElement)
this.container.appendChild(msg);}
else{this.innerHTML=msg;}}
return this;},draw:function(){var html="";var length=0;if((typeof this.data==='undefined'||!this.data.length)&&this.defaultMessage){this.container.innerHTML=this.defaultMessage;return;}
for(var i=0,l=this.data.length;i<l;i++){var element=this.formatItem(this.data[i],i,length);if(element==null)
continue;if(typeof element=="string")
html+=element;else
this.container.appendChild((element instanceof joView)?element.container:element);++length;}
if(html.length)
this.container.innerHTML=html;return;},deselect:function(){if(typeof this.container=='undefined'||!this.container['childNodes'])
return;var node=this.getNode(this.index);if(node){if(this.lastNode){joDOM.removeCSSClass(this.lastNode,"selected");this.index=null;}}},setIndex:function(index,silent){joLog("setIndex",index);this.index=index;if(typeof this.container=='undefined'||!this.container['childNodes'])
return;var node=this.getNode(this.index);if(node){if(this.lastNode)
joDOM.removeCSSClass(this.lastNode,"selected");joDOM.addCSSClass(node,"selected");this.lastNode=node;}
if(index>=0&&!silent)
this.fireSelect(index);},getNode:function(index){return this.container.childNodes[index];},fireSelect:function(index){this.selectEvent.fire(index);},getIndex:function(){return this.index;},onMouseDown:function(e){var node=joEvent.getTarget(e);var index=-1;while(index==-1&&node!==this.container){index=node.getAttribute("index")||-1;node=node.parentNode;}
if(index>=0){joEvent.stop(e);this.setIndex(index);}},refresh:function(){this.index=0;this.lastNode=null;if(this.autoSort)
this.sort();joControl.prototype.refresh.apply(this);},getNodeData:function(index){if(this.data&&this.data.length&&index>=0&&index<this.data.length)
return this.data[index];else
return null;},getLength:function(){return this.length||this.data.length||0;},sort:function(){this.data.sort(this.compareItems);},getNodeIndex:function(element){var index=element.getAttribute('index');if(typeof index!=="undefined"&&index!=null)
return parseInt(index)
else
return-1;},formatItem:function(itemData,index){var element=document.createElement('jolistitem');element.innerHTML=itemData;element.setAttribute("index",index);return element;},compareItems:function(a,b){if(a>b)
return 1;else if(a==b)
return 0;else
return-1;},setAutoSort:function(state){this.autoSort=state;},next:function(){if(this.getIndex()<this.getLength()-1)
this.setIndex(this.index+1);},prev:function(){if(this.getIndex()>0)
this.setIndex(this.index-1);}});joTabBar=function(){joList.apply(this,arguments);};joTabBar.extend(joList,{tagName:"jotabbar",formatItem:function(data,index){var o=document.createElement("jotab");if(data.label)
o.innerHTML=data.label;if(data.type)
o.className=data.type;o.setAttribute("index",index);return o;}});joTitle=function(data){joContainer.apply(this,arguments);};joTitle.extend(joContainer,{tagName:"jotitle"});joCaption=function(data){joControl.apply(this,arguments);};joCaption.extend(joControl,{tagName:"jocaption"});joHTML=function(data){joControl.apply(this,arguments);};joHTML.extend(joControl,{tagName:"johtml",setEvents:function(){joEvent.on(this.container,"click",this.onClick,this);},onClick:function(e){joEvent.stop(e);joEvent.preventDefault(e);var container=this.container;var hrefnode=findhref(joEvent.getTarget(e));if(hrefnode){this.selectEvent.fire(hrefnode.href);}
function findhref(node){if(!node)
return null;if(node.href)
return node;if(typeof node.parentNode!=="undefined"&&node.parentNode!==container)
return findhref(node.parentNode);else
return null;}}});joMenu=function(data){joList.apply(this,arguments);};joMenu.extend(joList,{tagName:"jomenu",fireSelect:function(index){if(typeof this.data[index].id!=="undefined"&&this.data[index].id)
this.selectEvent.fire(this.data[index].id);else
this.selectEvent.fire(index);},formatItem:function(item,index){var o=joDOM.create("jomenuitem");o.setAttribute("index",index);o.innerHTML=((item.icon)?'<img src="'+item.icon+'">':"")+'<jomenutitle>'+item.title+'</jomenutitle>';return o;}});joSound=function(filename,repeat){this.endedEvent=new joSubject(this);this.errorEvent=new joSubject(this);if(typeof Audio=='undefined')
return;this.filename=filename;this.audio=new Audio();this.audio.autoplay=false;if(!this.audio)
return;joYield(function(){this.audio.src=filename;this.audio.load();},this,5);this.setRepeatCount(repeat);joEvent.on(this.audio,"ended",this.onEnded,this);};joSound.prototype={play:function(){if(!this.audio)
return;this.audio.play();},onEnded:function(e){this.endedEvent.fire(this.repeat);if(++this.repeat<this.repeatCount)
this.play();else
this.repeat=0;},setRepeatCount:function(repeat){this.repeatCount=repeat;this.repeat=0;},pause:function(){if(!this.audio)
return;this.audio.pause();},rewind:function(){if(!this.audio)
return;try{this.audio.currentTime=0.0;}
catch(e){joLog("joSound: can't rewind...");}
this.repeat=0;},stop:function(){this.pause();this.rewind();this.repeat=0;},setVolume:function(vol){if(!this.audio||vol<0||vol>1)
return;this.audio.volume=vol;}};joPasswordInput=function(data){joInput.apply(this,arguments);};joPasswordInput.extend(joInput,{className:"password"});joDivider=function(data){joView.apply(this,arguments);};joDivider.extend(joView,{tagName:"jodivider"});joLabel=function(data){joControl.apply(this,arguments);};joLabel.extend(joControl,{tagName:"jolabel"});joTable=function(data){joList.apply(this,arguments);};joTable.extend(joList,{tagName:"jotable",formatItem:function(row,index){var tr=document.createElement("tr");for(var i=0,l=row.length;i<l;i++){var o=document.createElement(index?"td":"th");o.innerHTML=row[i];o.setAttribute("index",index*l+i);tr.appendChild(o);}
return tr;},getNode:function(index){var row=this.getRow(index);var col=this.getCol(index);return this.container.childNodes[row].childNodes[col];},getRow:function(index){if(typeof index=="undefined")
var index=this.getIndex();var rowsize=this.data[0].length;return Math.floor(index/rowsize);},getCol:function(index){if(typeof index=="undefined")
var index=this.getIndex();var rowsize=this.data[0].length;return index%rowsize;}});joFlexrow=function(data){joContainer.apply(this,arguments);};joFlexrow.extend(joContainer,{tagName:"joflexrow"});joFlexcol=function(data){joContainer.apply(this,arguments);};joFlexcol.extend(joContainer,{tagName:"joflexcol"});joBusy=function(data){joContainer.apply(this,arguments);};joBusy.extend(joContainer,{tagName:"jobusy",draw:function(){this.container.innerHTML="";for(var i=0;i<9;i++)
this.container.appendChild(joDom.create("jobusyblock"));},setMessage:function(msg){this.message=msg||"";},setEvents:function(){return this;}});joStackScroller=function(data){this.scrollers=[new joScroller(),new joScroller()];this.scroller=this.scrollers[0];joStack.apply(this,arguments);this.container.appendChild(this.scroller.container);};joStackScroller.extend(joStack,{scrollerindex:1,scroller:null,scrollers:[],switchScroller:function(){this.scrollerindex=this.scrollerindex?0:1;this.scroller=this.scrollers[this.scrollerindex];},getLastScroller:function(){return this.scrollers[this.scrollerindex?0:1];},scrollTo:function(something){this.scroller.scrollTo(something);},scrollBy:function(y){this.scroller.scrollBy(y);},getChildStyleContainer:function(){return this.scroller.container;},getContentContainer:function(){return this.scroller.container;},appendChild:function(child){var scroller=this.scroller;scroller.setData(child);this.container.appendChild(scroller.container);},getChild:function(){return this.scroller.container||null;},forward:function(){if(this.index<this.data.length-1)
this.switchScroller();joStack.prototype.forward.call(this);},back:function(){if(this.index>0)
this.switchScroller();joStack.prototype.forward.call(this);},home:function(){this.switchScroller();joStack.prototype.push.call(this);},push:function(o){this.switchScroller();joDOM.removeCSSClass(o,'flick');joDOM.removeCSSClass(o,'flickback');this.scroller.setData(o);this.scroller.scrollTo(0,true);joStack.prototype.push.call(this,o);},pop:function(){if(this.data.length>this.locked)
this.switchScroller();joStack.prototype.pop.call(this);}});joToolbar=function(data){joContainer.apply(this,arguments);};joToolbar.extend(joContainer,{tagName:"jotoolbar"});