require(process.env.UPPERCASE_PATH + '/LOAD.js');

BOOT({
	CONFIG : {
		isDevMode : true,
		
		defaultBoxName : 'GameAISampleServer',
		
		socketServerPort : 8521,
		relayServerPort : 8522
	},
	
	NODE_CONFIG : {
		
		isNotUsingCPUClustering : true
	}
});
