"use strict";
const rp = require('request-promise');
const JSONbig = require('json-bigint')({"storeAsString": true})

module.exports = {
	getAllLiveGames:function(steamkey){
		return new Promise(function(complete,reject){
			var games = []
			var allPromises = []
			for (var i = 0; i < 4; i++) {
				allPromises.push(rp('https://api.steampowered.com/IDOTA2Match_570/GetTopLiveGame/v1/?key='+steamkey+'&partner='+[i]))
			}
			Promise.all(allPromises).then(function(result){
				for (var i = 0; i < result.length; i++) {
					try{
						result[i] = JSONbig.parse(result[i])
						games.push(result[i].game_list)
					}catch(SyntaxError){
						reject(SyntaxError)
					}	
				}
				games = [].concat.apply([], games)
				complete(games)
			}).catch(function(error){
				reject(error)
			})
			
		})	
	}
}

