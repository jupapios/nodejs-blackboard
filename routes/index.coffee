# GET home page

# static value
namedefault = 'panda'

exports.index = (req, res) ->
	res.render 'index',
		title: 'Nodejs blackgoard'
		user: namedefault+Math.ceil(Math.random()*1000)