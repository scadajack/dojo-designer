define([
	'dataDog/DataManager'
	,'dojo/_base/declare'
],function(
	DataManager
	,declare

){

	var pf = declare([],{

		constructor : function(){
			this.registry = {};
		},

		registerPluginClass : function(pluginClassName, pluginClass){
			if (this.registry[pluginClassName])
				console.warn("Duplicate Plugin Class:",pluginClassName,"added to PluginFactory. Overwriting previous class definition.");
			this.registry[pluginClassName] = pluginClass;
			console.info("Plugin Class:",pluginClassName, "added to PluginFactory.")
		},

		createPluginInstance : function(classOrDef){
			var classOnly = (typeof classOrDef == 'string'),
				className = classOnly ? classOrDef : classOrDef.pluginClass,
				cons = className && this.registry[className],
				init = classOnly ? {} : classOrDef;
				pin = new cons(init);

				if (pin){
					console.info("New Plugin Instance created for class:",className,
						classOnly ? '' : 'with initialization:',classOnly ? '' : init);
				}
			return pin;
		}

	})

	var _pluginFactory;

	return {
		getInstance : function(){
			!_pluginFactory && (_pluginFactory = new pf());

			return _pluginFactory;
		}
	}

})