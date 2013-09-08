define([
	"dojo/_base/declare",
	"dojo/text!wuhi/designer/resources/CallbackDialog.html",
	"dijit/Dialog",
	"dijit/_Templated",
	"dijit/_Widget",
	"dijit/form/Button"
], function (declare, template, Dialog, _Templated, _Widget, Button) {

	var CallbackDialog = declare("wuhi.designer.CallbackDialog", [_Widget, _Templated],{
	
		templateString: template,
		widgetsInTemplate: true,
		title: "",
		content: null,
		callback: function(){},
	
		postCreate:function(){
			this.inherited("postCreate", arguments);
			
			this.contentArea.appendChild(this.content)
		},
		_onOkClick:function(){
	
			var form= this.dialog.getValues();
			var size = 0;
			for (e in form) { 
				if(form[e] != null) {size++;}
			}
			if(size > 0){
				this.callback(form);
				this.hide();
			}
		},
		show:function(){
			this.dialog.show();
		},
		hide:function(){
			this.dialog.hide();
		}
	
	});
	return CallbackDialog;
});