"use strict";
const lodash = require('lodash');
const request = require("request");

module.exports = {
	getTeamTag:function(players,teamName,tag){
		return new Promise(function(complete,reject){
			var value = lodash.filter(players,{'team_name':teamName})
			if(value.length > 0){
				if (value[0].team_tag != ""){
					complete({"res":value[0].team_tag,"tag":tag})
				}else{
					complete({"res":null,"tag":tag})
				}	
			}else{
				complete({"res":null,"tag":tag})
			}	
		})
	},

	getTeamLogo:function(teamLogoId,steamKey,tag){
		return new Promise(function(complete,reject){
			request('http://api.steampowered.com/ISteamRemoteStorage/GetUGCFileDetails/v1/?key='+steamKey+"&appid=570&ugcid="+teamLogoId,function(error, response, body){
				if (error){
					complete({"res":null,"tag":tag})
				}
				try{
					var body = JSON.parse(body)
				}catch(SyntaxError){
					complete({"res":null,"tag":tag})
				}
				try{
					complete({"res":body['data']['url'],"tag":tag})
				}catch(TypeError){
					complete({"res":null,"tag":tag})
				}
				
			})
		})
	}
}