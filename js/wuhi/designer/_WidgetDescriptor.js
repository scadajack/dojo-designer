define([
	"dojo/_base/array",
	"dojo/_base/declare"
], function (array, declare) {

	var _WidgetDescriptor = declare("wuhi.designer._WidgetDescriptor", null,{
	
		getProperties:function(dojoClass, props){
			props = props || [];
			array.forEach(this.items, function(item){
				if(item.dojoClass == dojoClass){
					if(typeof(item.parents) != "undefined"){
						array.forEach(item.parents, function(parentItem){
							this.getProperties(parentItem, props);
						}, this);
					}
					array.forEach(item.properties, function(p) { props.push(p) });
				}
			}, this);
			return props;
		},//@TODO: cobine style-items to an object like dojo.style needs
		getAttribute : function(dojoClasses,attr){
			// summary:
			//    Searches for attributes in the dojoClasses provided, or thier parents,
			//    in a breadth first pattern, returning the first value it finds for 
			//    the attribute.
			//
			var result,
				parents = {};

			if (!(dojoClasses instanceof Array))
				dojoClasses = [dojoClasses];

			var result = array.filter(dojoClasses,function(dojoClass){
				var it = this.getItemByClass(dojoClass);
				if(it[attr])
					return true;
				else if (it.parents){
					array.forEach(it.parents,function(parent){
						parents[parent] = 1;
					});
				} 
				return false;
			},this);
			if (result[0]){
				var it = this.getItemByClass(result[0]);
				return it && it[attr];
			} else {
				var p = Object.keys(parents);
				if (p.length > 0)
					return this.getAttribute(Object.keys(parents),attr);
			}
				
			
		},
		getInheritanceList : function(dojoClass){
			// summary:
			//    Returns a list of the dojoClass and it's parents 
			//    in a breadth first order with respect to inheritance. 
			//    NOTE: Returns just the dojoClass names, not the full record.
			//
			var parents = [dojoClass],
				newParents = [];
			var it = this.getItemByClass(dojoClass);
			if (it.parents){
				newParents = it.parents
			}
			while (newParents.length > 0){
				var c = newParents;
				newParents = [];
				array.forEach(c,function(parent){
					it = this.getItemByClass(parent);
					it.parents && (newParents = newParents.concat(it.parents));
				},this);
				parents = parents.concat(c);
			}
			return parents;
		},
		getItemByClass : function(dojoClass){
			var result = array.filter(this.items,function(item){
				return item.dojoClass == dojoClass;
			},this);
			return result[0];
		},
		addItem : function(item){
			this.items.push(item);
		},

		items: 	[
					{
						"dojoClass": "_designerBase",
						"category" : "Standard",
						"properties": [
							//{"name": "id", "type": "string"},
							{"name": "position", "type": "string", "isStyle": true},
							{"name": "top", "type": "string", "isStyle": true},
							{"name": "left", "type": "string", "isStyle": true},
							{"name": "width", "type": "string", "isStyle": true},
							{"name": "height", "type": "string", "isStyle": true}
						]
					},
					{
						"dojoClass": "dijit.form._FormWidget",
						"parents": ["_designerBase"],
						"properties": [
							{"name": "value", "type": "string"},
							{"name": "readOnly", "type": "bool"},
							{"name": "disabled", "type": "bool"},
							{"name": "type", "type": "string"},
							{"name": "alt", "type": "string"},
							{"name": "name", "type": "string"},
							{"name": "intermediateChanges", "type": "bool"}		
						]
					},
					{
						"dojoClass": "dijit.form.TextBox",
						"parents": ["dijit.form._FormWidget"],
						"properties": [
							{"name": "trim", "type": "bool"},
							{"name": "uppercase", "type": "bool"},
							{"name": "lowercase", "type": "bool"},
							{"name": "propercase", "type": "bool"},
							{"name": "maxLength", "type": "string"},
							//{"name": "selectOnClick", "type": "bool"},
							{"name": "displayedValue", "type": "string"}
						]
					},
					{
						"dojoClass": "dijit.form.Textarea",
						"parents": ["dijit.form._FormWidget"],
						"properties": [
	
						]
					},
					{
						"dojoClass": "dijit.form.SimpleTextarea",
						"parents": ["dijit.form._FormWidget"],
						"properties": [
	
						]
					},
					{
						"dojoClass": "dijit.form.Button",
						"parents": ["dijit.form._FormWidget"],
						"properties": [
							{"name": "label", "type": "string"},
							{"name": "showLabel", "type": "bool"},
							{"name": "iconClass", "type": "string"}
						]
					},
					{
						"dojoClass": "dijit.form.CheckBox",
						"parents": ["dijit.form._FormWidget"],
						"properties": [
	
						]
					},
					{
						"dojoClass": "dijit.form.RadioButton",
						"parents": ["dijit.form._FormWidget"],
						"properties": [
	
						]
					},
					{
						"dojoClass": "dijit.form.DateTextBox",
						"parents": ["dijit.form._FormWidget"],
						"properties": [
	
						]
					},	
					{
						"dojoClass": "dijit.form.TimeTextBox",
						"parents": ["dijit.form._FormWidget"],
						"properties": [
							{"name": "visibleIncrement", "type": "string", "container": "constraints"},
							{"name": "timePattern", "type": "string", "container": "constraints"},
							{"name": "clickableIncrement", "type": "string", "container": "constraints"}
						]
					},
					{
						"dojoClass": "dijit.layout._LayoutWidget",
						"parents": ["_designerBase"],
						"properties": [
							{"name": "region", "type": "string"}
						]
					},
					{
						"dojoClass": "dijit.layout.ContentPane",
						"parents": ["dijit.layout._LayoutWidget"],
						"properties": [
							{"name": "href", "type": "string"},
							{"name": "extraContent", "type": "bool"},
							{"name": "parseOnLoad", "type": "bool"},
							//{"name": "preventCache", "type": "bool"},
							//{"name": "preLoad", "type": "bool"},
							{"name": "refreshOnShow", "type": "bool"},
							//{"name": "isContainer", "type": "bool"},
							{"name": "doLayout", "type": "bool"},
							//{"name": "isLayoutContainer", "type": "bool"},
							{"name": "title", "type": "string"}
						]
					},
					{
						"dojoClass": "dijit.layout.TabContainer",
						"parents": ["dijit.layout._LayoutWidget"],
						"properties": [
							{"name": "tabPosition", "type": "string"},
							//{"name": "tabStrip", "type": "bool"},
							//{"name": "nested", "type": "bool"},
							//{"name": "useMenu", "type": "bool"},
							//{"name": "preLoad", "type": "bool"},
							{"name": "useSlider", "type": "bool"}
						]
					},
					{
						"dojoClass": "dijit.layout.BorderContainer",
						"parents": ["dijit.layout._LayoutWidget"],
						"properties": [
							{"name": "design", "type": "string"}
						]
					},
					{
						"dojoClass": "dijit.layout.AccordionContainer",
						"parents": ["dijit.layout._LayoutWidget"],
						"properties": [
							
						]
					},
					{
						"dojoClass": "html.Text",
						"parents": ["_designerBase"],
						"properties": [
							{"name": "fontSize", "type": "string", "isStyle": true},
							{"name": "fontFamily", "type": "string", "isStyle": true},
							{"name": "fontWeight", "type": "string", "isStyle": true},
							{"name": "innerHTML", "type": "string", "isStyle": false}	
						]
					},
					{
						"dojoClass": "html.HorizontalRule",
						"parents": ["_designerBase"],
						"properties": [
							{"name": "color", "type": "string", "isStyle": true},
							{"name": "backgroundColor", "type": "string", "isStyle": true}
						]
					},
					{
						"dojoClass": "dijit.MenuItem",
						"properties": [
							{"name": "label", "type": "string", "isStyle": false}
						]
					},
					{
						"dojoClass": "dijit.PopupMenuItem",
						"parents": ["dijit.MenuItem"],
						"properties": [
	
						]
					},
					{
						"dojoClass": "dijit.form.DropDownButton",
						"parents": ["_designerBase"],
						"properties": [
							{"name": "label", "type": "string", "isStyle": false},
						]
					},
					{
						"dojoClass": "dijit.Menu",
						"parents": ["dijit.layout._LayoutWidget"],
						"properties": [
	
						]
					},
					{
						"dojoClass": "dijit.Toolbar",
						"parents": ["dijit.layout._LayoutWidget"],
						"properties": [
	
						]
					},
					{
						"dojoClass": "dijit.Editor",
						"parents": ["_designerBase"],
						"properties": [
							{"name": "value", "type": "string"},
							{"name": "plugins", "type": "json"}	
						]
					},
									{
						"dojoClass": "dijit.form.HorizontalSlider",
						"parents": ["dijit.form._FormWidget"],
						"properties": [
							{"name": "maximum", "type": "string"},
							{"name": "minimum", "type": "string"}	
						]
					},	
									{
						"dojoClass": "dijit.form.VerticalSlider",
						"parents": ["dijit.form.HorizontalSlider"],
						"properties": [
	
						]
					}
				]
		}
	);
	return _WidgetDescriptor;
});