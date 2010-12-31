/*
---

name: SlideShow.CSS

description: Adds CSS transform transitions.

license: MIT-style license.

authors: Ryan Florence <http://ryanflorence.com>

requires:
  - SlideShow
  - CSSAnimation/MooTools

provides:
  - SlideShow.CSS

...
*/

(function(){

	var getAxis = function(direction){
			return {
				property: (direction == 'left' || direction == 'right') ? 'x' : 'y',
				inverted: (direction == 'left' || direction == 'up') ? 1 : -1
			};
		},
		go = function(type, axis, data){
			var transition = {
				duration: data.duration + 'ms',
				'timing-function': 'ease',
				property: 'transform'
			};

			if (type == 'blind') {
				data.next.setStyle('z-index', 2);
			}

			if (type != 'slide') {
				data.next.translate(axis.property, 100 * axis.inverted);
			}

			setTimeout(function(){
				if (type != 'slide') data.next.setTransition(transition).translate(axis.property, 0);
				if (type != 'blind') data.previous.setTransition(transition).translate(axis.property, -(100 * axis.inverted));
			}, 0)

		};

	['left', 'right', 'up', 'down'].each(function(direction){

		var capitalized = direction.capitalize(),
			blindName = 'blind' + capitalized + 'CSS',
			slideName = 'slide' + capitalized + 'CSS';

		[
			['push' + capitalized + 'CSS', (function(){
				var axis = getAxis(direction);
				return function(data){ go('push', axis, data); }
			}())],
			[blindName, (function(){
				var axis = getAxis(direction);
				return function(data){ go('blind', axis, data); }
			}())],
			[slideName, (function(){
				var axis = getAxis(direction);
				return function(data){ go('slide', axis, data); }
			}())]
		].each(function(transition){
			SlideShow.addTransition(transition[0], transition[1]);
		});
	});

})();

SlideShow.CSS = new Class({

	Extends: SlideShow,

	options: {
		useCSS: false
	},

	setup: function(options){
		this.parent(options);
		if (this.options.useCSS) this.overrideWithCSS();
	},
	
	overrideWithCSS: function(){
		['left', 'right', 'up', 'down'].each(function(direction){
			var capitalized = direction.capitalize(),
				blindName = 'blind' + capitalized,
				slideName = 'slide' + capitalized;
			this.transitions[blindName] = this.transitions[blindName + 'CSS'];
			this.transitions[slideName] = this.transitions[blindName + 'CSS'];
			this.transitions['push' + capitalized] = this.transitions['push' + capitalized + 'CSS'];
		}.bind(this));
		return this;
	},

});