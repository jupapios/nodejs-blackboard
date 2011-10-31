var stdin = process.stdin;
var mongoose = require('mongoose'),
	  Schema = mongoose.Schema;

var BoardSchema = new Schema({
	type	: { type: Number, validate: /[0|1]/, default: 1 },
	value	: { type: String, default: 'Q'},
	x			: { type: Number, default: 10 },
	y			: { type: Number, default: 10 }
});

var db = mongoose.connect('mongodb://localhost/blackboard');
var model = mongoose.model('Data', BoardSchema);

var Data = mongoose.model('Data');

	var i=0;
	for(i;i<10;i++) {
		var data = new Data();
		data.x=Math.ceil(Math.random()*1000);
		data.y=Math.ceil(Math.random()*1000);
		data.save(function(err){
			if(err) { throw err; }
			console.log('saved');
		});
	}

/*data.save(function(err){
	if(err) { throw err; }
	console.log('saved');
	Data.find({value: 'B'}, function(err, docs) {
		if(err) { throw err; }
		docs.forEach(function(doc){
			console.log(doc);
		});
		mongoose.disconnect();
	});
});*/
