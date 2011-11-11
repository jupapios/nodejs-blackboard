//alert msg
var e1='Nick taken :(';
var e2='¬¬"';
//URL images objects
var urlimg='/img/objects/'
var extimg='.png';

var socket = io.connect('http://localhost', {
	'reconnect': true,
	'reconnection delay': 500,
	'max reconnection attempts': 5
});
var flag=false;

socket.on('sign', function(data){
	if(data.state==0) {
		$('#user').addClass('rounded_error');
		err($('.box_login'), e1);
	} else {
		$('#alert').hide('slow');
		flag=true;
		$('#container').hide('slow', function(){
				$('#container').remove();
		});
	}
	$('#loading').hide();
});

socket.on('update', function(data) {
	if(flag) {
		$('#users').empty();
		$.each(data, function(key, value) {
			$('#users').append('<div class="user">' + key + '</div>');
		});
	}
});

socket.on('objects', function(data){

	data.forEach(function(doc){
		var content='';
		if(doc.type=='0')
			content='<img src="'+urlimg+doc.value+extimg+'">';
		if(doc.type=='1')
			content=doc.value;
		$('#board').append('<div id="'+doc._id+'" class="letter" style="left: '+doc.x+'px; top: '+doc.y+'px;">' + content + '</div>');
	});

	$(".letter").draggable({
		drag: function(e, ui) {
			var obj = [
				$(this).attr('id'),
				$(this).position().left,
				$(this).position().top
			];
			socket.emit('handle', { obj: obj });
		}
	});
});

socket.on('handle', function(data) {
	$('#'+data.obj[0]).css({ 'left': data.obj[1]+'px', 'top': data.obj[2]+'px'});
});

function err(obj, msg) {
	$('#alert').html('<img src="/img/error.png" />'+msg);
	$('#alert').show();
	for(var i=0; i<5; i++)
			obj.animate({"left": '+=12'}, 80).animate({"left": '-=12'}, 80);
};

$(function(){

	$('#nodester').click(function(){
		//window.location.href = "http://www.nodester.com";
	});

	$('#buttom').click(function(e){
		e.preventDefault();
		$('#loading').show();
		if($('#user').val().trim() == '') {
			$('#user').addClass('rounded_error');
			err($('.box_login'), e2);
			$('#loading').hide();
		}
		else {
			$('#alert').hide('slow');
			$('#user').removeClass('rounded_error');
			socket.emit('adduser', $('#user').val());
		}
	});

	$("#nodester").draggable();
	$(".box_login").draggable();
	$("h1").draggable();
	$("p").draggable();


});