(function(window){'use strict';function classReg(className){return new RegExp("(^|\\s+)"+className+"(\\s+|$)")}
var hasClass,addClass,removeClass;if('classList' in document.documentElement){hasClass=function(elem,c){return elem.classList.contains(c)};addClass=function(elem,c){elem.classList.add(c)};removeClass=function(elem,c){elem.classList.remove(c)}}else{hasClass=function(elem,c){return classReg(c).test(elem.className)};addClass=function(elem,c){if(!hasClass(elem,c)){elem.className=elem.className+' '+c}};removeClass=function(elem,c){elem.className=elem.className.replace(classReg(c),' ')}}
function toggleClass(elem,c){var fn=hasClass(elem,c)?removeClass:addClass;fn(elem,c)}
var classie={hasClass:hasClass,addClass:addClass,removeClass:removeClass,toggleClass:toggleClass,has:hasClass,add:addClass,remove:removeClass,toggle:toggleClass};if(typeof define==='function'&&define.amd){define(classie)}else{window.classie=classie}})(window)
	

( function( window ) {
	'use strict';
	var docElem = window.document.documentElement;
	function getViewportH() {
		var client = docElem['clientHeight'],
			inner = window['innerHeight'];
		if( client < inner )
			return inner;
		else
			return client;
	}
	function scrollY() {
		return window.pageYOffset || docElem.scrollTop;
	}
	function getOffset( el ) {
		var offsetTop = 0, offsetLeft = 0;
		do {
			if ( !isNaN( el.offsetTop ) ) {
				offsetTop += el.offsetTop;
			}
			if ( !isNaN( el.offsetLeft ) ) {
				offsetLeft += el.offsetLeft;
			}
		} while( el = el.offsetParent )
		return {
			top : offsetTop,
			left : offsetLeft
		}
	}
	function inViewport( el, h ) {
		var elH = el.offsetHeight,
			scrolled = scrollY(),
			viewed = scrolled + getViewportH(),
			elTop = getOffset(el).top,
			elBottom = elTop + elH,
			h = h || 0;

		return (elTop + elH * h) <= viewed && (elBottom) >= scrolled;
	}
	function extend( a, b ) {
		for( var key in b ) { 
			if( b.hasOwnProperty( key ) ) {
				a[key] = b[key];
			}
		}
		return a;
	}
	function cbpScroller( el, options ) {	
		this.el = el;
		this.options = extend( this.defaults, options );
		this._init();
	}
	cbpScroller.prototype = {
		defaults : {
			viewportFactor : 0.2
		},
		_init : function() {
			if( Modernizr.touch ) return;
			this.sections = Array.prototype.slice.call( this.el.querySelectorAll( '.cbp-section' ) );
			this.didScroll = false;
			var self = this;
			this.sections.forEach( function( el, i ) {
				if( !inViewport( el ) ) {
					classie.add( el, 'cbp-so-init' );
				}
			} );
			var scrollHandler = function() {
					if( !self.didScroll ) {
						self.didScroll = true;
						setTimeout( function() { self._scrollPage(); }, 60 );
					}
				},
				resizeHandler = function() {
					function delayed() {
						self._scrollPage();
						self.resizeTimeout = null;
					}
					if ( self.resizeTimeout ) {
						clearTimeout( self.resizeTimeout );
					}
					self.resizeTimeout = setTimeout( delayed, 200 );
				};
			window.addEventListener( 'scroll', scrollHandler, false );
			window.addEventListener( 'resize', resizeHandler, false );
		},
		_scrollPage : function() {
			var self = this;
			this.sections.forEach( function( el, i ) {
				if( inViewport( el, self.options.viewportFactor ) ) {
					classie.add( el, 'cbp-so-animate' );
				}
				else {
					classie.add( el, 'cbp-so-init' );
					classie.remove( el, 'cbp-so-animate' );
				}
			});
			this.didScroll = false;
		}
	}
	window.cbpScroller = cbpScroller;
} )( window );