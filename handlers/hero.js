"use strict";
const lodash = require('lodash')

module.exports = {
	getHeroDetails: function(heroid,heros,tag){
		return new Promise(function(complete,reject){
			if(heroid !=0){
				var heroval = lodash.filter(heros,{'id':heroid})
				complete({"res":heroval,"tag":tag})
			}else{
				complete({"res":"drafting","tag":tag})
			}
		})		
	}
}