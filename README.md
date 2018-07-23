# dota-watch

![npm](https://img.shields.io/npm/v/dota-watch.svg) ![license](https://img.shields.io/npm/l/dota-watch.svg) ![github-issues](https://img.shields.io/github/issues/c00kie17/dota-watch.svg)  ![Circle CI build status](https://circleci.com/gh/c00kie17/dota-watch.svg?style=svg)
![stars](https://img.shields.io/github/stars/c00kie17/dota-watch.svg)


![nodei.co](https://nodei.co/npm/dota-watch.png?downloads=true&downloadRank=true&stars=true)




Fetch live and upcoming dota games with stream links


## Install

`npm install --save dota-watch`

## Examples
The `examples` directory contains an example file on how to interact with the module.

# API

all api calls except the constructor and promises. 

<a name="new_dotaWatch"></a>
#### new dotaWatch(steamKey,twitchKey)
The dotaWatch client object is created

| Param | Type | Description |
| --- | --- | --- |
| steamKey | <code>string</code> | Your steam api key ,you can find more info about it <a href= "https://steamcommunity.com/login/home/?goto=%2Fdev%2Fapikey">here</a> |
| twitchKey | <code>string</code> | Your twitch api key ,you can find more info about it <a href= "https://dev.twitch.tv">here</a>  |

<a name="initialize_func"></a>
#### initialize()
used to initialized the dotaWatch client, all function and divided into two parts as [Initialized](#initialized) and [Non-Initialized](#non_initialized) functions

<a name="non_initialized"></a>
## Non-Initialized functions
these function can be used without initilization of the dotaWatch client

<a name="proPlayers"></a>
#### getProPlayers()
get a list of all the pro players

<a name="heros"></a>
#### getHeros()
gets a list of all the dota2 heros

<a name="econ"></a>
#### getEconItem()
gets the econ item file containing all items available in the dota2 client. This API calls takes some time to complete as the data is huge. consider saving the data locally instead of calling this again.

<a name="leagues"></a>
#### getLeagues()
gets a list of all the Pro Leagues in dota2

<a name="initialized"></a>
##Initialized functions
these function can be only used after initilization of the dotaWatch client has returned successfully 








## Contributing

Contributions welcome; Please submit all pull requests the against master branch. If your pull request contains JavaScript patches or features, you should include relevant unit tests. Please check the [Contributing Guidelines](contributng.md) for more details. Thanks!

## Author

c00kie17

## License

 - **MIT** : http://opensource.org/licenses/MIT
