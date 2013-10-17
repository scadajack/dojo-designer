define([
	'dojo/_base/declare'
	,'dojo/aspect'
	,'dojo/store/Memory'
	,'dojo/store/Observable'
	,"dijit/_WidgetBase"
	,"dijit/_TemplatedMixin"
	,"dijit/_WidgetsInTemplateMixin"
	,"dijit/registry"
	,"dojo/text!plugins/widget/dijit/resources/PluginPropertyView.html"
	,"dijit/form/FilteringSelect"
	,"plugins/widget/dijit/PluginPropertyToolbar"
	,"plugins/widget/dijit/PluginEditorGrid"
	,'wuhi/designer/_WidgetDescriptor'
],function(
	declare
	,aspect
	,Memory
	,Observable
	,_WidgetBase
	,_TemplatedMixin
	,_WidgetsInTemplateMixin
	,registry
	,template
	,FilteringSelect
	,PluginPropertyToolbar
	,PluginEditorGrid
	,_WidgetDescriptor
){

	function testInsertPlugin(ppv){
		// Just a test function that inserts a _dataAwarePlugin.
		require(["plugins/widget/_dataAwarePlugin"],function(_dataAwarePlugin){
			var dap = new _dataAwarePlugin({hostWidget : ppv.hostWidget});
			ppv.hostWidget.addPlugin(dap);
			ppv.set('Widget',ppv.hostWidget);
		});
	}

	var ppv = declare([_WidgetBase,_TemplatedMixin,_WidgetsInTemplateMixin],{
		templateString : template,

		// pluginToolbar
		// pluginSelect
		// dataGrid

		startup : function(){
			this.inherited(arguments);
			var thisObj = this;
			aspect.after(this.pluginToolbar,'_onNewClick',function(){
				testInsertPlugin(thisObj); // just test code right now.
			})
		},

		_onSelectChange : function(evt){
			var plugin = evt && registry.byId(evt);
			plugin && this._setGridEditPlugin(plugin);
		},

		_onApplyCellEdit : function(evt){

		},

		_createPluginStore : function(plugins){
			this.plugins = plugins || [];
			var data = [];
			this.plugins.forEach(function(plugin){
				data.push({name: plugin.name, id:plugin.id});
			});

			this.pluginStore = Observable(new Memory({
				data : data
			}));
		},

		updatePluginsFromWidget : function(){
			if (!this.hostWidget) return;
			var plugins = this.hostWidget.get('plugins');
			this._createPluginStore(plugins);
			this.pluginSelect.set('store',this.pluginStore);
		},

		_hostWidgetListener : null,

		_setWidgetAttr : function(widget){
			var thisObj = this;
			this.hostWidget = widget;
			// var plugins = widget.get('plugins');
			// this._updatePlugins(plugins);_updatePlugins
			thisObj.updatePluginsFromWidget();
			this._hostWidgetListener && this._hostWidgetListener.remove();
			this._hostWidgetListener = aspect.after(this.hostWidget,'addPlugin',function(plugin){
				thisObj.updatePluginsFromWidget();
			})
		},

		_setGridEditPlugin : function(plugin){
			var pluginEditorClass = _WidgetDescriptor.prototype.getAttribute(plugin.get('pluginClass'),"propertyEditor");
			pluginEditorClass = pluginEditorClass.replace(/\./g,'/');
			var pluginProperties = _WidgetDescriptor.prototype.getProperties(plugin.get('pluginClass'));

			var thisObj = this;
			require([pluginEditorClass],function(pluginEditorProto){
				var pluginEditor = new pluginEditorProto({widget:plugin});
				var items = pluginProperties.map(function(prop){
					return {
						id : prop.name,
						value : pluginEditor.get(prop.name)
					}
				})
				var data = {
					identifier:'id',
					items: items
				}
				var store = new Observable(new Memory({
					data : data
				}))

				// var columns = [
				// 	{
				// 		field: 'id',
				// 		label: "Property"
				// 	},
				// 	{
				// 		label: "Value",
				// 		field: "value"
				// 	}
				// ]

				var columns = {
					id : {
						label: "Property"
					},
					value : {
						label: "Value"
					}
				}
				if (thisObj.grid){
					//thisObj.grid.set('store',store);
					thisObj.grid.get('store').setData(data);
				} else {
					thisObj.grid = new PluginEditorGrid({
						store : store,
						query : {},
						columns : columns,
						allowSelectAll : true,
			            deselectOnRefresh : false,
			            maxRowsPerPage : 2500,
			            minRowsPerPage : 2500,
			            bufferRows : 2500,
			            farOffRemoval : 20000
					},thisObj.dataGrid)
				}
				thisObj.grid.refresh();
				
			})

			
		}

		
	})

	return ppv;

})