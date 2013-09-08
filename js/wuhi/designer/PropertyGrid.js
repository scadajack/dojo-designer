define([
	"dojo",
	"dojo/json",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/data/ItemFileWriteStore",
	"dojo/dom-style",
	"dojo/text!wuhi/designer/resources/PropertyGrid.html",
//	"dijit/_Templated",
	"dijit/_TemplatedMixin",
	"dijit/_WidgetsInTemplateMixin",
	"dijit/_Widget",
	"dojox/grid/DataGrid",
	"wuhi/designer/_Widget"
], function (dojo, JSON, declare, lang, ItemFileWriteStore, domStyle, template, _TemplatedMixin, _widgetsInTemplateMixin, _Widget, DataGrid, designer_Widget) {

	var PropertyGrid = declare("wuhi.designer.PropertyGrid", [_Widget, _TemplatedMixin, _widgetsInTemplateMixin],{
	
		templateString: template,
//		widgetsInTemplate: true,
		_widget: null,
		_widgetId: "",
		designer: null,
		postCreate:function(){
			this.inherited("postCreate", arguments);
					
			this.dataGrid.startup();
		},
		_setDataAttr:function(data){
			var store = new ItemFileWriteStore({"data": data});
			console.log(lang.clone(data));
			this.dataGrid.setStore(store);
		},
		_onApplyCellEdit:function(inValue, inRowIndex, inFieldIndex){
			//refresh the reference to the widget, because its maybe lost during dnd/refresh
			this._widget = dijit.byId(this._widgetId);
			
			var item = this.dataGrid.getItem(inRowIndex);
			
			//update sourcenode
			var propArray = {};
			if(this.dataGrid.store.getValue(item, "isStyle") == true){
				//update displayed widget
				domStyle.set(this._widget.domNode, this.dataGrid.store.getValue(item, "name"), inValue)
				propArray["style"] = {};
				propArray["style"][this.dataGrid.store.getValue(item, "name")] = inValue;
			}else{
				//update displayed widget
				var propName = this.dataGrid.store.getValue(item, "name");
				var propValue = inValue;
				
				if(this.dataGrid.store.getValue(item, "container")){
					propName = this.dataGrid.store.getValue(item, "container");	
					propValue = {};
					propValue[this.dataGrid.store.getValue(item, "name")] = inValue;
					
					this._widget.set(propName, propValue);
					propValue = JSON.stringify(propValue).replace(/"/g, "'");
				}else{
					this._widget.set(propName, propValue);
				}
				
				propArray[propName] = propValue;
			}
			//this.designer._updateNodeAttribute(base, item.name, item.value, this.designer.useHtml5Markup);
			this.designer._updateSourceNode(this._widget.get("id"), propArray, true);
			
			if(this._widget.needsRecreate == true){
				this._refreshDesigner();
			}
		},
		_setWidgetAttr:function(widget){
			this._widget = widget;
			this._widgetId = widget.get("id");
		},
		_refreshDesigner:function(){
			var recreatedWidget = this._widget.designer._refreshDesignerFromSource(this._widget.get("id"));
			this.set("widget", recreatedWidget);
		},
		destroy:function(){
			this.dataGrid.destroy();
		}
	
	});
	return PropertyGrid;
});