define([
	"dojo/_base/declare",
	"dijit/form/Textarea",
	"wuhi/designer/_Widget"
], function (declare, Textarea, _Widget) {

	var Textarea = declare("wuhi.designer.dijit.form.Textarea", [Textarea, _Widget], {
		
		dojoClass: "dijit.form.Textarea",
		//_toolboxImg: "Control_TextBox.png",
		_resizeAxis: "x",
		
		_getDefaultsAttr: function(){
			return [{"name": "style", "value": {"width": "200px"}}, {"name": "value", "value": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat."}];
		},
		_getAcceptAttr:function(){
			return [];
		}
	});
	
	wuhi.designer.Designer.prototype.registerClass(wuhi.designer.dijit.form.Textarea);
	return Textarea;
});