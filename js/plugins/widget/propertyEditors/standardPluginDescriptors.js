define([
	"dojo/_base/declare"
	,'wuhi/designer/_WidgetDescriptor'
],
function(
	declare
	,_WidgetDescriptor
){

	

	var items = 	[
				{
					"dojoClass": "plugins.widget._pluginBase",
					"type" 	   : "plugin",
					"category" : "Standard",
					"properties": [
						//{"name": "id", "type": "string"},
						{"name": "id", "type": "string"},
						{"name": "name", "type": "string"}
					]
				},		
				{
					"dojoClass": "plugins.widget._dataAwarePlugin",
					"parents": ["plugins.widget._pluginBase"],
					"propertyEditor" : "plugins.widget.propertyEditors._dataAwarePlugin",
					"properties": [
						{"name": "dataSource", "type": "string"},
						{"name": "dataItem", "type": "string"},
						{"name": "dataField", "type": "string"},
						{"name": "target", "type": "string"},
						{"name": "mode", "type": "string"},	
					]
				}
			]

	_WidgetDescriptor.prototype.addItems(items);
	
	return items;
	
})