"use strict";
const lodash = require('lodash')
const request = require("request");

module.exports = {
	getLeagueName:function(leagueId,leagues,econItems,tag){
		return new Promise(function(complete,reject){
			var value = lodash.filter(leagues, { 'leagueid': leagueId } )
			if (value.length != 0){ 
				complete({"res":econItems[value[0].itemdef.toString()]['name'],"tag":tag})
			}else{
				complete({"res":null,"tag":tag})
			}
		})
	},

	getLeagueLogo:function(leagueId,leagues,econItems,steamKey,tag){
		return new Promise(function(complete,reject){
			var value = lodash.filter(leagues, { 'leagueid': leagueId } )
			if (value.length != 0){ 
				var imageInventory = econItems[value[0].itemdef.toString()]['image_inventory'].split("/");
				request('https://api.steampowered.com/IEconDOTA2_570/GetItemIconPath/v1/?key='+steamKey+'&format=json&iconname='+imageInventory[2],function(error, response, body){
					if (error){
						complete({"res":null,"tag":tag})
					}
					try{
						var body = JSON.parse(body)
						complete({"res":"http://cdn.dota2.com/apps/570/"+body.result.path,"tag":tag})
					}catch(SyntaxError){
						complete({"res":null,"tag":tag})
					}
				})
			}else{
				complete({"res":null,"tag":tag})
			}
		})
	}
}