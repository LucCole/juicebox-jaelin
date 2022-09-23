var jsdom = require('jsdom');

function OpenGraph (url) {
	this.url = url;
}

OpenGraph.prototype.get = function (param, callback) {
	var og = {};
	if (param)
		jsdom.env({
			html: 'http://www.rottentomatoes.com/m/10011268-oceans/',
			scripts: [
				'http://code.jquery.com/jquery-1.5.min.js'
			],
			done: function(errors, window) {
				var $ = window.$;
				callback($('meta[property=og:'+param+']'));
			}
		});
	else
		jsdom.env({
			html: 'http://www.rottentomatoes.com/m/10011268-oceans/',
			scripts: [
				'http://code.jquery.com/jquery-1.5.min.js'
			],
			done: function(errors, window) {
				var $ = window.$;
				$('meta[property^=og]').each(function(i, item) {
					og[item.getAttribute('property')] = item.getAttribute('content');
				});
				callback(og);
			}
		});
};

module.exports = exports = OpenGraph;