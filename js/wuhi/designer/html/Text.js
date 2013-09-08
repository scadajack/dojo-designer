define([
	"dojo",
	"dojo/_base/declare",
	"dojo/dom-attr",
	"wuhi/designer/_Widget"
], function (dojo, declare, domAttr, _Widget) {

	var Text = declare("wuhi.designer.html.Text", _Widget, {
		
		dojoClass: "html.Text",
		isDojoWidget: false,
		baseElement: "span",
		resizeable: false,
		_toolboxImg: "Control_Label.png",
		_getDefaultsAttr: function(){
			return [{"name": "innerHTML", "value": this.get("NextWidgetPrintname")}];
		},
		_getAcceptAttr:function(){
			return [];
		},
		_setInnerHTMLAttr:function(value){
			this.innerHTML = value;
			domAttr.set(this.domNode, "innerHTML", value);
		},
		_getInnerHTMLAttr:function(){
			return this.innerHTML;
		}
	});
	
	wuhi.designer.Designer.prototype.registerClass(wuhi.designer.html.Text);
	return Text;
});