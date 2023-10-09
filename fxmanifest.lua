fx_version 'cerulean'
game 'gta5'

server_scripts {
    'config.js',
	'server/main.js',
}
client_scripts {
    'config.js',
    'client/radio-class.js',
	'client/main.js'
}

ui_page 'radio-ui/build/index.html'

files {
    'radio-ui/build/index.html',
    'radio-ui/build/assets/*',
    'radio-ui/build/audio/*.ogg',
}
