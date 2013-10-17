define([
	'dojo/_base/declare'
	,'./PluginFactory'
	
],function(
	declare
	,PluginFactory
){

	var pluginFactory = PluginFactory.getInstance();
// summary:
//    Plugins are used by widgets to augment behavior in the designer. They are designed to be lightweight 
//    are are not mixed in directly with the widgets. Rather, this mixin is added to the widget to manage the 
//    plugins. Plugins can be added and removed at runtime. The plugin configuration is stored in the 
//    widget plugin property as an object which can then be stored with the widget html declaration as 
//    a property of the widget. Note that, not being a mixin, the various plugins that are added do not 
//    have their properties mixed into the widget, so widget property editors needing to configure the  
//    plugins need to have additional capabilities to edit the plugin properties.
//

	var DEFINITION_CHANGE_EVENT = 'definitionChange',
		DESTROY_EVENT			 = 'destroy',
		STARTUP_EVENT 			 = 'startup';


	var pr = declare([],{

		// pluginDefinitions : (object)
		//    summary:
		//       Holds the plugin definitions. A plugin definition is an object which contains fields 
		//       that encapsulate the plugin state and also identify the plugin. The plugin may be 
		//       recreated (or even cloned) with the plugin definition. Note that clients should not 
		//       modify this value directly. Modifications should be effected by modifying plugin 
		//       values and allowing the plugin to modify its definition.
		//      
		//		 A pluginDefinition needs to have the following fields at miminum:
		//         pluginClass : (string)
		//             The class of the plugin that is used to fetch an instance of the plugin 
		//             from the pluginFactory.
		//         pluginName  : (string)
		//             A name for the plugin.
		//         pluginId    : (string)
		//             A uniqueId for the plugin.

		// pluginDefinitions : {},

		// plugins : array(plugin)
		//    summary:
		//        Array of plugins that have been instantiated on this widget.
		// plugins : [],

		constructor : function(params){

			this.plugins = (params && params.plugins) || [];
			this.pluginDefinitions = (params && params.pluginDefinitions) || [];

		},

		_setPluginsAttr : function(plugins){
			this.plugins = plugins;
		},

		_setPluginDefinitionsAttr : function(pluginDefinitions){
			this.pluginDefinitions = pluginDefinitions;
		},


		addPlugin : function(plugin){
			// summary:
			//    This method is responsible for managing the addition of plugins to the object.
			//    Plugins have the following implementation requirements:
			//       
			//        1) A startup method that configures the plugin and starts its operation.
			//        2) An optional destroy method that will be called before the widget is destroyed.
			//        3) A name field may be used to identify the plugin.
			//        4) A pluginClass field that can be used to lookup the plugin in the pluginFactory.
	        //        5) A getDefinition method that returns an object with properties that encapsulates 
			//		     the widget state and can be used to recreate the object.
			//        6) Implement the Evented methods and fire events, 'definitionChanged', 'started',
			//           and 'destroying'.
			//
			var has = this.plugins.some(function(existing){
				return existing.id == plugin.id;
			})
			if (!has){
				var plugins = this.plugins.slice();
				plugins.push(plugin);
				plugin.host = this;
				plugin.set('name', this._createValidPluginName(plugin));
				this._setPluginsAttr(plugins);
				this.updatePluginDefinition(plugin);
				this.startupPlugin(plugin);
				console.info("Plugin:",plugin, "added to widget:", this);
			} else {
				console.warn("Plugin:",plugin, "already present in widget:", this,", ignoring addPlugin attempt.");
			}
			
		},

		_createValidPluginName : function(plugin){
			var cname = plugin.name || plugin.pluginClass,
				suffix = '';

			this.plugins.forEach(function(plugin){
				if (plugin.name == (cname + suffix)){
					if (suffix)
						suffix = '' + (1*suffix + 1);
					else
						suffix = '1';
				}
			},this);
			return cname + suffix;
		},

		_onAddPlugin : function(){
			// summary
			//    Stub for listeners to monitor add plugin events.
		},

		startupPlugin : function(plugin){
			// summary:
			//    Method to startup a given plugin.

			plugin.on([DEFINITION_CHANGE_EVENT,DESTROY_EVENT,STARTUP_EVENT].join(','), this.pluginListener);
			return plugin.startup && plugin.startup();
		},

		startup : function(){
			var plugins = [];
			this.pluginDefinitions.forEach(function(def){
				var p = pluginFactory.createPluginInstance(def);
				p.host = this;
				plugins.push(p);
			});
			//this.set('plugins',plugins);
			this._setPluginsAttr = plugins;
			this.refreshDefinitions();
			this.plugins.forEach(function(plugin){
				this.startupPlugin(plugin);
			},this);
		},

		_cachedPluginListener : null,

		pluginListener : function(){
			var thisObj = this;
			this._cachedPluginListener = this._cachedPluginListener ||
				function(event){
					// assuming that event source will be 'this' here. Need to check!
					switch (event.type){
						case DEFINITION_CHANGE_EVENT:
								thisObj.refreshDefinitions();
								break;
						case DESTROY_EVENT:
								break;
						case STARTUP_EVENT:
								break;
					}
				};
			return this._cachedPluginListener;
		},

		updatePluginDefinition : function(plugin){
			// Changes the cached content of the definition for a plugin.
			var i = 0;
			for (var i=0; i<this.pluginDefinitions.length;i++){
				if (this.pluginDefinitions[i].id == plugin.id)
					break;
			}
			var d = plugin.getDefinition();
			var pds = this.pluginDefinitions.slice();
			if (i<this.pluginDefinitions.length){
				pds[i] = d;
			} else {
				pds.push(d);
			}
			this._setPluginDefinitionsAttr(pds);

		},

		refreshDefinitions : function(){
			var defs = [];
			this.plugins.forEach(function(plugin){
				var d = plugin.getDefinition();
				defs.push(d);
			})
			this.set('pluginDefinitiions',defs);
		}



	});

	return pr;

});
