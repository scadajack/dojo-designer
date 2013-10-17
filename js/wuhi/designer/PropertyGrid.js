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
//	"dijit/_Widget",
	"dijit/_WidgetBase",
	"dojox/grid/DataGrid",
	"wuhi/designer/_Widget",
	"dijit/layout/TabContainer",
	"dojox/layout/ContentPane",
	"dojo/ready",
	"plugins/widget/dijit/PluginPropertyView"

], function (dojo, JSON, declare, lang, ItemFileWriteStore, domStyle, template, _TemplatedMixin, _widgetsInTemplateMixin, _Widget, DataGrid, designer_Widget,
	TabContainer,ContentPane,ready,PluginPropertyView) {

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
			console.log("PropertyGrid :: _setDataAttr");
			var store = new ItemFileWriteStore({"data": data});
			console.log(lang.clone(data));
			this.dataGrid.setStore(store);
			this.dataGrid.render();
			this.tabContainer.resize();
		},
		_onApplyCellEdit:function(inValue, inRowIndex, inFieldIndex){
			console.log("PropertyGrid :: _onApplyCellEdit");
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
			console.log("PropertyGrid :: _setWidgetAttr");

			this._widget = widget;
			this._widgetId = widget.get("id");
			this.pluginView.set('Widget',widget);
		},
		_refreshDesigner:function(){
			console.log("PropertyGrid :: _refreshDesigner");
			var recreatedWidget = this._widget.designer._refreshDesignerFromSource(this._widget.get("id"));
			this.set("widget", recreatedWidget);
		},

		startup:function(){
			this.inherited(arguments);
			var thisObj = this;
			ready(function(){
			//	console.log("pg startup ready")
				thisObj._setDataAttr({identifier:'id',label:'name',items:[],numRows:1});
				thisObj._setWidgetAttr(thisObj.designer)
			});
			//
			//console.log("pg startup")
		},
		destroy:function(){
			this.dataGrid.destroy();
		}
	
	});
	return PropertyGrid;
});