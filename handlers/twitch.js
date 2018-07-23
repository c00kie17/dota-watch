"use strict";
const async = require("async")
const request = require("request")
module.exports = {
	getPlayerStreamInfo:function(game,twitchkey){
		var streamsList = []
		return new Promise(function(complete,reject){
			request('https://api.twitch.tv/kraken/streams/?client_id='+twitchkey+'&stream_type=live&game=Dota 2',function(error, response, body){
				if(body == undefined){
						complete([])
					}
				try{
					body = JSON.parse(body)
					var streams = body.streams
				}catch(e){
					complete([])	
				}
				if(body != undefined){
					async.eachSeries(game.proPlayers, function (member, callback){
						var fixedName = member['name'].replace(/[,?_-]/g, '')	
						for (var i = 0; i < streams.length; i++) {
							if(streams[i].channel['name'].toUpperCase().includes(fixedName.toUpperCase())){
								streamsList.push(streams[i])
							}
							if(streams[i].channel['status'].toUpperCase().includes(fixedName.toUpperCase())){
								streamsList.push(streams[i])
							}
						}
						callback()	
					},function(err){
						if(err)complete([])
						complete(streamsList)	
					})
				}else{
					complete([])
				}	
			})		
		})			
	}
}