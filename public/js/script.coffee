flag = false
node = {}
socket = io.connect '', {
	'reconnect': true
	'reconnection delay': 500
	'max reconnection attempts': 5
}

# Excuted when you signed
# if state = 0 nickname is already taken
# else you can continue
socket.on 'sign', (data) ->
	if data.state==0 
		$('#user').addClass 'rounded_error'
		node.err $('.box_login'), node.vals.e2
	else
		$('#alert').hide 'slow'
		flag=true
		$('#container').hide 'slow', () ->
			$('#container').remove();
	$('#loading').hide()

# Executed when new users sign or leave
socket.on 'update', (data) ->
	if flag
		$('#users').empty()
		$.each data, (key, value) ->
			$('#users').append '<div class="user">' + key + '</div>'

# Executed when an object is moved
socket.on 'handle', (data) ->
	$('#'+data.obj[0]).css {
		'left': data.obj[1]+'px'
		'top': data.obj[2]+'px'
	}

# Executed for construct the dom (paint the objects)
socket.on 'objects', (data) ->
	data.forEach (doc) ->
		content = ''
		if doc.type == 0
			content = '<img src="'+node.vals.urlimg+doc.value+node.vals.extimg+'" />'
		if doc.type == 1
			content = doc.value
		$('#board').append '<div id="'+doc._id+'" class="letter" style="left: '+doc.x+'px; top: '+doc.y+'px;">' + content + '</div>'

	$(".letter").draggable {
		drag: (e, ui) ->
			obj = [
				$(this).attr('id')
				$(this).position().left
				$(this).position().top
			]
			socket.emit 'handle', { obj: obj }
	}

# Namespace
node = {
	# Static values
	vals: {
		e1 : 'Nick taken :('
		e2 : '¬¬"'
		urlimg : '/img/objects/'
		extimg : '.png'
	}

	# Initialize function
	init: () ->
		# Make draggable the first page objects (just for fun)
		$(".drag").draggable()
		$("h1").draggable()
		$("p").draggable()

		# Login button action
		$('#buttom').on 'click', (evt) ->
			evt.preventDefault()
			$('#loading').show()
			# If the nick you entered is empty fire error
			if $('#user').val().trim() == ''
				$('#user').addClass 'rounded_error'
				node.err $('.box_login'), node.vals.e2
				$('#loading').hide()
			else
				$('#alert').hide 'slow'
				$('#user').removeClass 'rounded_error'
				socket.emit 'adduser', $('#user').val()

	# Function for manage the errors
	err: (obj, msg) ->
		$('#alert').html '<img src="/img/error.png" />'+msg
		$('#alert').show()
		for i in 5
			obj.animate({"left": '+=12'}, 80).animate({"left": '-=12'}, 80)
}

# Initialize all
$ ->
	node.init()