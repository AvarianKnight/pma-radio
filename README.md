# pma-radio

A modern radio resource made for pma-voice

### Credits
[nzkfc](https://github.com/nzkfc) for the radio image

### Usage

This resource is meant to be framework agnostic, you can use the following exports/convars to modify the default behaviour.

| ConVar                     | Default | Description                                                   | Parameter(s) |
|----------------------------|---------|---------------------------------------------------------------|--------------|
| radio_maxDecimalPlaces     |  2      | The maximum allowed decimal places to allow (changing this can mess with the ui, use at your own discretion)| number      |
| radio_defaultStartChannel  |  21     | The default channel to start the radio UI at, this should be "above" your encrypted channels | number |
| radio_maxRadioChannels     |  1000   | The maximum allowed radio channels (setting this over 9999 can mess with the ui) | number |
| radio_enableRadioCommands  |  true   | If set to true you can use /r and /radio to open the radio UI, you should set this to false if you're using items | boolean |
| radio_useRadioAnim  |  true  | If set to true when the radio is open it will use proper radio animations with the prop, when set to false it does nothing when the radio is open| boolean      |


### Exports/Net Events

##### Setters

| Export              | Description                 | Parameter(s) |
|---------------------|-----------------------------|--------------|
| setDefaultChannel | sets the default channel for the players radio ui to start at | int |
| openRadio | opens the radio UI | |
| closeRadio | closes the radio UI| |

##### Toggles

| Export              | Description                                            | Parameter(s) |
|---------------------|--------------------------------------------------------|--------------|
| toggleRadio		  | Toggles the radio UI open/close                        |              |


#### Net Events
These should typically be used if you're going to use the radio as an item, make sure to disable radio commands if you do!

| Event              | Description                                            | Parameter(s) |
|---------------------|--------------------------------------------------------|--------------|
| pma-radio:toggleRadioUi | Toggles the radio UI open for the targeted player |              |
| pma-radio:closeRadioUi | Closes the radio UI for the targeted player |              |
| pma-radio:openRadioUi | Closes the radio UI for the targeted player |              |
