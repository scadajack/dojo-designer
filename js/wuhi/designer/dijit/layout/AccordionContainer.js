define([
	"dojo/_base/declare",
	"dijit/layout/AccordionContainer",
	"wuhi/designer/_Widget"
], function (declare, AccordionContainer, _Widget) {

	var AccordionContainer = declare("wuhi.designer.dijit.layout.AccordionContainer", [AccordionContainer, _Widget], {
		
		dojoClass: "dijit.layout.AccordionContainer",
		_toolboxImg: "Control_AccordionContainer.png",
		moveable: true,
		resizeable: true,
		needsRecreate: true,
		placeChildWidget:function(widget){		
			var index = this.getChildren().length
			this.addChild(widget);
			
			if(!widget.get("title")){
				widget.set("title", widget.get("NextWidgetPrintname"));
			}
			
			this.layout();
		},
		_getDefaultsAttr: function(){
			return [
				{"name": "style", "value": {"width": "150px", "height": "200px"}}
			];
		},
		postInstance:function(){
			this.startup();
		},
		_getAcceptAttr:function(){
			return ["dijit.layout.ContentPane"];
		},
		_getDefaultChildrenAttr:function(){
			return [wuhi.designer.dijit.layout.ContentPane, wuhi.designer.dijit.layout.ContentPane];
		}
	});
	
	wuhi.designer.Designer.prototype.registerClass(wuhi.designer.dijit.layout.AccordionContainer);
	return AccordionContainer;
});