define([
	 'dojo/_base/declare'
	,'dijit/_WidgetBase'
],function(
	 declare
	,_WidgetBase
){

	return declare([_WidgetBase],{

		// id: (object)
		// 	Unique ID for the object. Same as WidgetId
		// name : (string),
		// 	Display name for plugin.
		// host : (object)
		//  Host widget that this plugin will operate on.

		pluginClass : "plugins.widget._pluginBase",

		constructor : function(params){
			if (params && params.name){
				this.name = params.name;
				delete params.name;
			}

		},

		_setNameAttr : function(name){
			this.name = name;
			this.onName(name);
		},


		getDefinition : function(){
			return {
				id 			: this.id,
				name 		: this.name,
				pluginClass : this.pluginClass
			}
		},

		onName : function(name){
			// summary:
			//    Stub method for listeners.
		}




	})

})