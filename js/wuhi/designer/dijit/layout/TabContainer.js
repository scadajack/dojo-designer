define([
	"dojo/_base/declare",
	"dijit/layout/TabContainer",
	"wuhi/designer/_Widget",
	"wuhi/designer/dijit/layout/ContentPane"
], function (declare, TabContainer, _Widget, ContentPane) {

	var TabContainer = declare("wuhi.designer.dijit.layout.TabContainer", [TabContainer, _Widget], {
		
		dojoClass: "dijit.layout.TabContainer",
		_toolboxImg: "Control_TabContainer.png",
		needsRecreate: true,
		_getAcceptAttr:function(){
			return ["dijit.layout.ContentPane"];
		},
		placeChildWidget:function(widget){
					
			this.addChild(widget);
			//set the tab-name
			if(!widget.get("title")){
				//widget.attr('title', 'Tab ' + this.getIndexOfChild(widget));
				widget.set("title", widget.get("NextWidgetPrintname"));
			}
			
			this.layout();
		},
		postInstance:function(){
			this.startup();
		},
		_getDefaultsAttr: function(){
			return [
				{"name": "style", "value": {"height": "200px", "width": "300px"}}
			];
		},
		_getDefaultChildrenAttr:function(){
			return [ContentPane];
		}
	});
	
	wuhi.designer.Designer.prototype.registerClass(wuhi.designer.dijit.layout.TabContainer);
	return TabContainer;
});