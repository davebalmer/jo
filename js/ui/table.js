/**
	joTable
	=======
	
	Table control.
	
	Extends
	-------
	
	- joList
	
	Methods
	-------
	
	- setCell(row, column)
	
	  Sets the active cell for the table, also makes it editiable and sets focus.
	
	- getRow(), getCol()
	
	  Return the current row or column
	
	Use
	---
	
		var x = new joTable([
			["Nickname", "Phone", "Email"],
			["Bob", "555-1234", "bob@bobco.not"],
			["Jo", "555-3456", "jo@joco.not"],
			["Jane", "555-6789", "jane@janeco.not"]
		]);
		
		s.selectEvent.subscribe(function(cell) {
			joLog("Table cell clicked:", cell.row, cell.col);
		});
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
		if (typeof index == "undefined")
			var index = this.getIndex();
			
		var rowsize = this.data[0].length;
		return Math.floor(index / rowsize);
	},

	getCol: function(index) {
		if (typeof index == "undefined")
			var index = this.getIndex();
			
		var rowsize = this.data[0].length;
		return index % rowsize;
	}	
});

