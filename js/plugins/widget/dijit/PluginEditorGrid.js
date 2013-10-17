define([
	"dojo/_base/declare"
	,"dgrid/OnDemandGrid"
	,"dgrid/_StoreMixin"
	,"dgrid/Selection"
	,"dgrid/Keyboard"
	,"dgrid/Editor"
	,"dgrid/extensions/ColumnResizer"
	,"dgrid/extensions/DijitRegistry"
],function(
	declare
	,OnDemandGrid
	,_StoreMixin
	,Selection
	,Keyboard
	,Editor
	,ColumnResizer
	,DijitRegistry
){


	



	var g = declare([OnDemandGrid,_StoreMixin,Selection,Keyboard,Editor, ColumnResizer,DijitRegistry],{

		configureColumns : function(columnSpec){
			g.configureColumns(this,columnSpec);
		}

	})

	g.configureColumns = function(grid,columnSpec){
		// summary:
		//    Sets the column specification for the supplied grid.
		//
		// columnSpec : object
		//    Configure the columns. The columnSpec is setup as follows:
		//    
		if (!columnSpec){
			columnSpec = [
				{
					field: 'id',
					label: "Property"
				},
				{
					label: "Value",
					value: "value"
				}
			]
		}
		grid.set('columns',columnSpec);
	}

	return g;
})