
/*
 * GET home page.
 */

// Static
var namedefault='panda';

exports.index = function(req, res){
  res.render('index', {
	  title: 'Express',
	  user: namedefault+Math.ceil(Math.random()*1000)
	})
};