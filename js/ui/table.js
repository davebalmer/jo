/**
	joTable
	=======
	
	Table control, purely visual representation of tabular data (usually
	an array of arrays).
	
	Use
	---
	
		// simple table with inline data
		var x = new joTable([
			["Nickname", "Phone", "Email"],
			["Bob", "555-1234", "bob@bobco.not"],
			["Jo", "555-3456", "jo@joco.not"],
			["Jane", "555-6789", "jane@janeco.not"]
		]);
		
		// we can respond to touch events in the table
		x.selectEvent.subscribe(function(index, table) {
			// get the current row and column
			joLog("Table cell clicked:", table.getRow(), table.getCol());
			
			// you can also get at the cell HTML element as well
			joDOM.setStyle(table.getNode(), { fontWeight: "bold" });
		});

	Extends
	-------

	- joList

	Methods
	-------

	- `setCell(row, column)`

	  Sets the active cell for the table, also makes it editiable and sets focus.

	- `getRow()`, `getCol()`

	  Return the current row or column
*/

joTable = function(data) {
	joList.apply(this, arguments);
};
joTable.extend(joList, {
	tagName: "jotable",
	
	// default row formatter
	formatItem: function(row, index) {
		var tr = document.createElement("tr");
		
		for (var i = 0, l = row.length; i < l; i++) {
			var o = document.createElement(index ? "td" : "th");
			o.innerHTML = row[i];
			
			// this is a little brittle, but plays nicely with joList's select event
			o.setAttribute("index", index * l + i);
			tr.appendChild(o);
		}
		
		return tr;
	},

	// override joList's getNode
	getNode: function(index) {
		var row = this.getRow(index);
		var col = this.getCol(index);
		
		return this.container.childNodes[row].childNodes[col];
	},
	
	getRow: function(index) {
		if (typeof index === "undefined")
			index = this.getIndex();
			
		var rowsize = this.data[0].length;

		return Math.floor(index / rowsize);
	},

	getCol: function(index) {
		if (typeof index === "undefined")
			index = this.getIndex();
		
		var rowsize = this.data[0].length;

		return index % rowsize;
	}	
});

