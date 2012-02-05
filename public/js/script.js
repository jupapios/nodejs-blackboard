(function() {
  var flag, node, socket;

  flag = false;

  node = {};

  socket = io.connect('', {
    'reconnect': true,
    'reconnection delay': 500,
    'max reconnection attempts': 5
  });

  socket.on('sign', function(data) {
    if (data.state === 0) {
      $('#user').addClass('rounded_error');
      node.err($('.box_login'), node.vals.e2);
    } else {
      $('#alert').hide('slow');
      flag = true;
      $('#container').hide('slow', function() {
        return $('#container').remove();
      });
    }
    return $('#loading').hide();
  });

  socket.on('update', function(data) {
    if (flag) {
      $('#users').empty();
      return $.each(data, function(key, value) {
        return $('#users').append('<div class="user">' + key + '</div>');
      });
    }
  });

  socket.on('handle', function(data) {
    return $('#' + data.obj[0]).css({
      'left': data.obj[1] + 'px',
      'top': data.obj[2] + 'px'
    });
  });

  socket.on('objects', function(data) {
    data.forEach(function(doc) {
      var content;
      content = '';
      if (doc.type === 0) {
        content = '<img src="' + node.vals.urlimg + doc.value + node.vals.extimg + '" />';
      }
      if (doc.type === 1) content = doc.value;
      return $('#board').append('<div id="' + doc._id + '" class="letter" style="left: ' + doc.x + 'px; top: ' + doc.y + 'px;">' + content + '</div>');
    });
    return $(".letter").draggable({
      drag: function(e, ui) {
        var obj;
        obj = [$(this).attr('id'), $(this).position().left, $(this).position().top];
        return socket.emit('handle', {
          obj: obj
        });
      }
    });
  });

  node = {
    vals: {
      e1: 'Nick taken :(',
      e2: '¬¬"',
      urlimg: '/img/objects/',
      extimg: '.png'
    },
    init: function() {
      $(".drag").draggable();
      $("h1").draggable();
      $("p").draggable();
      return $('#buttom').on('click', function(evt) {
        evt.preventDefault();
        $('#loading').show();
        if ($('#user').val().trim() === '') {
          $('#user').addClass('rounded_error');
          node.err($('.box_login'), node.vals.e2);
          return $('#loading').hide();
        } else {
          $('#alert').hide('slow');
          $('#user').removeClass('rounded_error');
          return socket.emit('adduser', $('#user').val());
        }
      });
    },
    err: function(obj, msg) {
      var i, _i, _len, _ref, _results;
      $('#alert').html('<img src="/img/error.png" />' + msg);
      $('#alert').show();
      _ref = 5;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        i = _ref[_i];
        _results.push(obj.animate({
          "left": '+=12'
        }, 80).animate({
          "left": '-=12'
        }, 80));
      }
      return _results;
    }
  };

  $(function() {
    return node.init();
  });

}).call(this);
