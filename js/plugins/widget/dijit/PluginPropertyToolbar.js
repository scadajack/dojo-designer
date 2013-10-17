define([
	'dojo/_base/declare'
	,"dijit/_WidgetBase"
	,"dijit/_TemplatedMixin"
	,"dijit/_WidgetsInTemplateMixin"
	,"dijit/form/Button"
	,"dijit/Toolbar"
	,"dojo/text!plugins/widget/dijit/resources/PluginPropertyToolbar.html",
],function(
	declare
	,_WidgetBase
	,_TemplatedMixin
	,_WidgetsInTemplateMixin
	,Button
	,Toolbar
	,template
){

	var ppt = declare([_WidgetBase,_TemplatedMixin,_WidgetsInTemplateMixin],{
		templateString : template,

		_onNewClick : function(evt){
			console.log('new button clicked')
		}
	})

	return ppt;
})