/**
	joList
	=======
	
	A widget class which expects an array of any data type and renders the
	array as a list. The list control handles DOM interactions with only a
	single touch event to determine which item was selected.
	
	Extends
	-------
	
	- joControl
	
	Events
	------
	
	- `selectEvent`
	
	  Fired when an item is selected from the list. The data in the call is the
	  index of the item selected.
	
	- `changeEvent`
	
	  Fired when the data is changed for the list.
	
	Methods
	-------

	- `formatItem(data, index)`
	
	  When subclassing or augmenting, this is the method responsible for
	  rendering a list item's data.
	
	- `compareItems(a, b)`
	
	  For sorting purposes, this method is called and should be overriden
	  to support custom data types.
	
			// general logic and approriate return values
			if (a > b)
				return 1;
			else if (a == b)
				return 0;
			else
				return -1

	- `setIndex(index)`

	- `getIndex(index)`
	
	- `refresh()`
	
	- `setDefault(message)`
	
	  Will present this message (HTML string) when the list is empty.
	  Normally the list is empty; this is a convenience for "zero state"
	  UI requirements.

	- `getNodeData(index)`
	
	- `getLength()`
	
	- `next()`

	- `prev()`
	
	- `setAutoSort(boolean)`

*/
joList = function(container, data) {
	this.autoSort = false;
	this.lastNode = null;
	this.index = 0;
	
	joControl.apply(this, arguments);
};
joList.extend(joControl, {
	tagName: "jolist",
	data: null,
	defaultMessage: "",
	
	setDefault: function(msg) {
		this.defaultMessage = msg;
		
		if (typeof this.data === 'undefined' || !this.data || !this.data.length) {
			if (typeof msg === 'object') {
				this.innerHTML = "";
				if (msg instanceof joView)
					this.container.appendChild(msg.container);
				else if (msg instanceof HTMLElement)
					this.container.appendChild(msg);
			}
			else {
				this.innerHTML = msg;
			}
		}
		
		return this;
	},
	
	draw: function() {
		var html = "";
		var length = 0;

		if ((typeof this.data === 'undefined' || !this.data.length) && this.defaultMessage) {
			this.container.innerHTML = this.defaultMessage;
			return;
		}

		for (var i = 0, l = this.data.length; i < l; i++) {
			var element = this.formatItem(this.data[i], i, length);

			if (element == null)
				continue;
			
			if (typeof element == "string")
				html += element;
			else
				this.container.appendChild((element instanceof joView) ? element.container : element);

			++length;
		}

		// support setting the contents with innerHTML in one go,
		// or getting back HTMLElements ready to append to the contents
		if (html.length)
			this.container.innerHTML = html;
		
		return;
	},

	deselect: function() {
		if (typeof this.container == 'undefined'
		|| !this.container['childNodes'])
			return;

		var node = this.getNode(this.index);
		if (node) {
			if (this.lastNode) {
				joDOM.removeCSSClass(this.lastNode, "selected");
				this.index = null;
			}
		}
	},
	
	setIndex: function(index, silent) {
		joLog("setIndex", index);
		this.index = index;

		if (typeof this.container == 'undefined'
		|| !this.container['childNodes'])
			return;

		var node = this.getNode(this.index);
		if (node) {
			if (this.lastNode)
				joDOM.removeCSSClass(this.lastNode, "selected");

			joDOM.addCSSClass(node, "selected");
			this.lastNode = node;
		}
		
		if (index >= 0 && !silent)
			this.fireSelect(index);
	},
	
	getNode: function(index) {
		return this.container.childNodes[index];
	},

	fireSelect: function(index) {
		this.selectEvent.fire(index);
	},
	
	getIndex: function() {
		return this.index;
	},
	
	onMouseDown: function(e) {
		var node = joEvent.getTarget(e);
		var index = -1;
		
		while (index == -1 && node !== this.container) {
			index = node.getAttribute("index") || -1;
			node = node.parentNode;
		}

		if (index >= 0) {
			joEvent.stop(e);

			this.setIndex(index);
		}
	},
	
	refresh: function() {
		this.index = 0;
		this.lastNode = null;

		if (this.autoSort)
			this.sort();

		joControl.prototype.refresh.apply(this);
	},

	getNodeData: function(index) {
		if (this.data && this.data.length && index >= 0 && index < this.data.length)
			return this.data[index];
		else
			return null;
	},
	
	getLength: function() {
		return this.length || this.data.length || 0;
	},
	
	sort: function() {
		this.data.sort(this.compareItems);
	},
	
	getNodeIndex: function(element) {
		var index = element.getAttribute('index');
		if (typeof index !== "undefined" && index != null)
		 	return parseInt(index)
		else
			return -1;
	},
	
	formatItem: function(itemData, index) {
		var element = document.createElement('jolistitem');
		element.innerHTML = itemData;
		element.setAttribute("index", index);

		return element;
	},

	compareItems: function(a, b) {
		if (a > b)
			return 1;
		else if (a == b)
			return 0;
		else
			return -1;
	},

	setAutoSort: function(state) {
		this.autoSort = state;
	},
	
	next: function() {
		if (this.getIndex() < this.getLength() - 1)
			this.setIndex(this.index + 1);
	},
	
	prev: function() {
		if (this.getIndex() > 0)
			this.setIndex(this.index - 1);
	}
});
