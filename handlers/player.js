"use strict";
const lodash = require('lodash')
const async = require("async")

module.exports = {
	ifProPlayerLiveGames:function(players,heros,playerList,tag){
		return new Promise(function(complete,reject){
			var allPros = []
			async.eachSeries(playerList, function (member, callback){
				var value = lodash.filter(players,{'account_id':member.account_id})
				if (value.length != 0){ 
					var hero = "drafting"
					if (member.hero_id != 0){
						var heroval = lodash.filter(heros,{'id':member.hero_id})
						hero = heroval[0].localized_name
					}
					var data = {"name":value[0]['name'],"hero":hero,"account_id":member.account_id}
					allPros.push(data)
					callback()	
				}else{
					callback()
				}
			},function(err){
				if(err)reject(err)
				complete({"res":allPros,"tag":tag})
			})
		})			
	},

	ifProPlayer:function(players,id,tag){
		return new Promise(function(complete,reject){
			var value = lodash.filter(players,{'account_id':id})
			if (value.length != 0){ 
				complete({"res":true,"tag":tag})
			}else{
				complete({"res":false,"tag":tag})
			}
		})
	}

}