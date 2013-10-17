define([
	'dojo/_base/declare'
	,'dojo/Deferred'
	,'./propertyEditors/standardPluginDescriptors'
],function(
	declare
	,Deferred
	,standardPluginDescriptors
){

	// Want to load in all the standard plugins. 
	var plugins = ['plugins.widget._dataAwarePlugin'];

		// modify plugin names for AMD loader
	plugins = plugins.map(function(plugin){
		return plugin.replace(/\./g,'/');
	})

	var loaded = new Deferred();

	require(plugins,function(){
		loaded.resolve(true);
	})

	return loaded;

})