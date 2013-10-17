define([
	'dataDog/DataManager'
	,'dojo/_base/declare'
],function(
	DataManager
	,declare
){

	var DEFAULT_DATA_MANAGER = 'DataManager';

	var pdm = declare([],{

		addDataManager : function(name,dataManager){
			this.dataManagers[name] = dataManager;
		},

		_parseDataSource : function(dataSource){
			var dm = DEFAULT_DATA_MANAGER;
			if (dataSource.indexOf('.') > -1){
				var split = dataSource.split('.');
				dm = split[0];
				dataSource = split[1];
			}
			return [dm,dataSource];
		},

		updateValue : function(dataSource,dataItem,dataField,newValue){
				// assume field value if not specified.
			dataField = dataField || 'value';
			var dm = DEFAULT_DATA_MANAGER;
			var pds = this._parseDataSource(dataSource);
			var dstr = pds[1] + '/' + dataItem + '.' + dataField;

			this.dataManagers[pds[0]].put(dstr,newValue);
		},

		monitorValue : function(dataSource,dataItem,listener){
			var pds = this._parseDataSource(dataSource),
				topicName = pds[1] + '/' + dataItem;

			if (pds[0] == DEFAULT_DATA_MANAGER){
				return this.dataManagers[pds[0]].subscribe(topicName,listener);
			}
			console.warn("PluginDataManager :: monitorValue - Only DEFAULT_DATA_MANAGER implemented. Cannot subscribe to",pds[0] || '');
		},

		getValue : function(dataSource,dataItem,dataField){
			var pds = this._parseDataSource(dataSource),
				dataField = dataField || 'value',
				topicName = pds[1] + '/' + dataItem + '.' + dataField;

			this.dataManagers[pds[0]].get(topicName);

		},

		getDataSources : function(){
		//  summary:
		//    Gets a list of dataSources from the DataManagers.
		//    Any dataSources not in the 'default' DataManager will 
		//    be namespaced to their DataManager name.
			var dataSources = [];
			for (var key in this.dataManagers){
				var sources = this.dataManagers[key].getDataSources(),
				    namespace = key == DEFAULT_DATA_MANAGER ? '' : key + '.';
				sources.forEach(function(source){
					dataSources.push(namespace + source.name);
				});
			}
			return dataSources;
		},

		getDataItemIds : function(dataSource){
			var pds = this._parseDataSource(dataSource),
				dm = pds[0],
				ds = pds[1];

			return dm.getDataItemIds(ds);

		},

		getDataItemFields : function(dataSource,dataItem){
			var pds = this._parseDataSource(dataSource),
				dm = pds[0],
				ds = pds[1];

			return dm.getDataItemFields(ds);
		}






	})

	var _pluginDataManager;

	function addDefaultDataManagers(pluginDataManager){
		addDataSource(DEFAULT_DATA_MANAGER, DataManager);
	}

	return {
		getInstance : function(){
			!_pluginDataManager && (_pluginDataManager = new pdm());

			return _pluginDataManager;
		}
	}

})