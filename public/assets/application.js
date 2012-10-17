/*!
 * jQuery JavaScript Library v1.8.2
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: Thu Sep 20 2012 21:13:05 GMT-0400 (Eastern Daylight Time)
 */

(function( window, undefined ) {
var
	// A central reference to the root jQuery(document)
	rootjQuery,

	// The deferred used on DOM ready
	readyList,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,
	location = window.location,
	navigator = window.navigator,

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// Save a reference to some core methods
	core_push = Array.prototype.push,
	core_slice = Array.prototype.slice,
	core_indexOf = Array.prototype.indexOf,
	core_toString = Object.prototype.toString,
	core_hasOwn = Object.prototype.hasOwnProperty,
	core_trim = String.prototype.trim,

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context, rootjQuery );
	},

	// Used for matching numbers
	core_pnum = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,

	// Used for detecting and trimming whitespace
	core_rnotwhite = /\S/,
	core_rspace = /\s+/,

	// Make sure we trim BOM and NBSP (here's looking at you, Safari 5.0 and IE)
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	rquickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return ( letter + "" ).toUpperCase();
	},

	// The ready event handler and self cleanup method
	DOMContentLoaded = function() {
		if ( document.addEventListener ) {
			document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			jQuery.ready();
		} else if ( document.readyState === "complete" ) {
			// we're here because readyState === "complete" in oldIE
			// which is good enough for us to call the dom ready!
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	},

	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	constructor: jQuery,
	init: function( selector, context, rootjQuery ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector.charAt(0) === "<" && selector.charAt( selector.length - 1 ) === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;
					doc = ( context && context.nodeType ? context.ownerDocument || context : document );

					// scripts is true for back-compat
					selector = jQuery.parseHTML( match[1], doc, true );
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						this.attr.call( selector, context, true );
					}

					return jQuery.merge( this, selector );

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.8.2",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return core_slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + ( this.selector ? " " : "" ) + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	ready: function( fn ) {
		// Add the callback
		jQuery.ready.promise().done( fn );

		return this;
	},

	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( core_slice.apply( this, arguments ),
			"slice", core_slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: core_push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		if ( window.$ === jQuery ) {
			window.$ = _$;
		}

		if ( deep && window.jQuery === jQuery ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( !document.body ) {
			return setTimeout( jQuery.ready, 1 );
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.trigger ) {
			jQuery( document ).trigger("ready").off("ready");
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	isWindow: function( obj ) {
		return obj != null && obj == obj.window;
	},

	isNumeric: function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ core_toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		try {
			// Not own constructor property must be Object
			if ( obj.constructor &&
				!core_hasOwn.call(obj, "constructor") &&
				!core_hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
				return false;
			}
		} catch ( e ) {
			// IE8,9 Will throw exceptions on certain host objects #9897
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.

		var key;
		for ( key in obj ) {}

		return key === undefined || core_hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	error: function( msg ) {
		throw new Error( msg );
	},

	// data: string of html
	// context (optional): If specified, the fragment will be created in this context, defaults to document
	// scripts (optional): If true, will include scripts passed in the html string
	parseHTML: function( data, context, scripts ) {
		var parsed;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		if ( typeof context === "boolean" ) {
			scripts = context;
			context = 0;
		}
		context = context || document;

		// Single tag
		if ( (parsed = rsingleTag.exec( data )) ) {
			return [ context.createElement( parsed[1] ) ];
		}

		parsed = jQuery.buildFragment( [ data ], context, scripts ? null : [] );
		return jQuery.merge( [],
			(parsed.cacheable ? jQuery.clone( parsed.fragment ) : parsed.fragment).childNodes );
	},

	parseJSON: function( data ) {
		if ( !data || typeof data !== "string") {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );

		// Attempt to parse using the native JSON parser first
		if ( window.JSON && window.JSON.parse ) {
			return window.JSON.parse( data );
		}

		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test( data.replace( rvalidescape, "@" )
			.replace( rvalidtokens, "]" )
			.replace( rvalidbraces, "")) ) {

			return ( new Function( "return " + data ) )();

		}
		jQuery.error( "Invalid JSON: " + data );
	},

	// Cross-browser xml parsing
	parseXML: function( data ) {
		var xml, tmp;
		if ( !data || typeof data !== "string" ) {
			return null;
		}
		try {
			if ( window.DOMParser ) { // Standard
				tmp = new DOMParser();
				xml = tmp.parseFromString( data , "text/xml" );
			} else { // IE
				xml = new ActiveXObject( "Microsoft.XMLDOM" );
				xml.async = "false";
				xml.loadXML( data );
			}
		} catch( e ) {
			xml = undefined;
		}
		if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
			jQuery.error( "Invalid XML: " + data );
		}
		return xml;
	},

	noop: function() {},

	// Evaluates a script in a global context
	// Workarounds based on findings by Jim Driscoll
	// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
	globalEval: function( data ) {
		if ( data && core_rnotwhite.test( data ) ) {
			// We use execScript on Internet Explorer
			// We use an anonymous function so that context is window
			// rather than jQuery in Firefox
			( window.execScript || function( data ) {
				window[ "eval" ].call( window, data );
			} )( data );
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var name,
			i = 0,
			length = obj.length,
			isObj = length === undefined || jQuery.isFunction( obj );

		if ( args ) {
			if ( isObj ) {
				for ( name in obj ) {
					if ( callback.apply( obj[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( obj[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in obj ) {
					if ( callback.call( obj[ name ], name, obj[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( obj[ i ], i, obj[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Use native String.trim function wherever possible
	trim: core_trim && !core_trim.call("\uFEFF\xA0") ?
		function( text ) {
			return text == null ?
				"" :
				core_trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				( text + "" ).replace( rtrim, "" );
		},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var type,
			ret = results || [];

		if ( arr != null ) {
			// The window, strings (and functions) also have 'length'
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			type = jQuery.type( arr );

			if ( arr.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( arr ) ) {
				core_push.call( ret, arr );
			} else {
				jQuery.merge( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		var len;

		if ( arr ) {
			if ( core_indexOf ) {
				return core_indexOf.call( arr, elem, i );
			}

			len = arr.length;
			i = i ? i < 0 ? Math.max( 0, len + i ) : i : 0;

			for ( ; i < len; i++ ) {
				// Skip accessing in sparse arrays
				if ( i in arr && arr[ i ] === elem ) {
					return i;
				}
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}

		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var retVal,
			ret = [],
			i = 0,
			length = elems.length;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value, key,
			ret = [],
			i = 0,
			length = elems.length,
			// jquery objects are treated as arrays
			isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ( ( length > 0 && elems[ 0 ] && elems[ length -1 ] ) || length === 0 || jQuery.isArray( elems ) ) ;

		// Go through the array, translating each of the items to their
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}

		// Go through every key on the object,
		} else {
			for ( key in elems ) {
				value = callback( elems[ key ], key, arg );

				if ( value != null ) {
					ret[ ret.length ] = value;
				}
			}
		}

		// Flatten any nested arrays
		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = core_slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context, args.concat( core_slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	// Multifunctional method to get and set values of a collection
	// The value/s can optionally be executed if it's a function
	access: function( elems, fn, key, value, chainable, emptyGet, pass ) {
		var exec,
			bulk = key == null,
			i = 0,
			length = elems.length;

		// Sets many values
		if ( key && typeof key === "object" ) {
			for ( i in key ) {
				jQuery.access( elems, fn, i, key[i], 1, emptyGet, value );
			}
			chainable = 1;

		// Sets one value
		} else if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = pass === undefined && jQuery.isFunction( value );

			if ( bulk ) {
				// Bulk operations only iterate when executing function values
				if ( exec ) {
					exec = fn;
					fn = function( elem, key, value ) {
						return exec.call( jQuery( elem ), value );
					};

				// Otherwise they run against the entire set
				} else {
					fn.call( elems, value );
					fn = null;
				}
			}

			if ( fn ) {
				for (; i < length; i++ ) {
					fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
				}
			}

			chainable = 1;
		}

		return chainable ?
			elems :

			// Gets
			bulk ?
				fn.call( elems ) :
				length ? fn( elems[0], key ) : emptyGet;
	},

	now: function() {
		return ( new Date() ).getTime();
	}
});

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// we once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready, 1 );

		// Standards-based browsers support DOMContentLoaded
		} else if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else {
			// Ensure firing before onload, maybe late but safe also for iframes
			document.attachEvent( "onreadystatechange", DOMContentLoaded );

			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if ( top && top.doScroll ) {
				(function doScrollCheck() {
					if ( !jQuery.isReady ) {

						try {
							// Use the trick by Diego Perini
							// http://javascript.nwbox.com/IEContentLoaded/
							top.doScroll("left");
						} catch(e) {
							return setTimeout( doScrollCheck, 50 );
						}

						// and execute any waiting functions
						jQuery.ready();
					}
				})();
			}
		}
	}
	return readyList.promise( obj );
};

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

// All jQuery objects should point back to these
rootjQuery = jQuery(document);
// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.split( core_rspace ), function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" && ( !options.unique || !self.has( arg ) ) ) {
								list.push( arg );
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Control if a given callback is in the list
			has: function( fn ) {
				return jQuery.inArray( fn, list ) > -1;
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				args = args || [];
				args = [ context, args.slice ? args.slice() : args ];
				if ( list && ( !fired || stack ) ) {
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};
jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var action = tuple[ 0 ],
								fn = fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ]( jQuery.isFunction( fn ) ?
								function() {
									var returned = fn.apply( this, arguments );
									if ( returned && jQuery.isFunction( returned.promise ) ) {
										returned.promise()
											.done( newDefer.resolve )
											.fail( newDefer.reject )
											.progress( newDefer.notify );
									} else {
										newDefer[ action + "With" ]( this === deferred ? newDefer : this, [ returned ] );
									}
								} :
								newDefer[ action ]
							);
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ] = list.fire
			deferred[ tuple[0] ] = list.fire;
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = core_slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? core_slice.call( arguments ) : value;
					if( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// if we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});
jQuery.support = (function() {

	var support,
		all,
		a,
		select,
		opt,
		input,
		fragment,
		eventName,
		i,
		isSupported,
		clickFn,
		div = document.createElement("div");

	// Preliminary tests
	div.setAttribute( "className", "t" );
	div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";

	all = div.getElementsByTagName("*");
	a = div.getElementsByTagName("a")[ 0 ];
	a.style.cssText = "top:1px;float:left;opacity:.5";

	// Can't get basic test support
	if ( !all || !all.length ) {
		return {};
	}

	// First batch of supports tests
	select = document.createElement("select");
	opt = select.appendChild( document.createElement("option") );
	input = div.getElementsByTagName("input")[ 0 ];

	support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: ( div.firstChild.nodeType === 3 ),

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText instead)
		style: /top/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: ( a.getAttribute("href") === "/a" ),

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.5/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: ( input.value === "on" ),

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
		getSetAttribute: div.className !== "t",

		// Tests for enctype support on a form(#6743)
		enctype: !!document.createElement("form").enctype,

		// Makes sure cloning an html5 element does not cause problems
		// Where outerHTML is undefined, this still works
		html5Clone: document.createElement("nav").cloneNode( true ).outerHTML !== "<:nav></:nav>",

		// jQuery.support.boxModel DEPRECATED in 1.8 since we don't support Quirks Mode
		boxModel: ( document.compatMode === "CSS1Compat" ),

		// Will be defined later
		submitBubbles: true,
		changeBubbles: true,
		focusinBubbles: false,
		deleteExpando: true,
		noCloneEvent: true,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableMarginRight: true,
		boxSizingReliable: true,
		pixelPosition: false
	};

	// Make sure checked status is properly cloned
	input.checked = true;
	support.noCloneChecked = input.cloneNode( true ).checked;

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as disabled)
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete div.test;
	} catch( e ) {
		support.deleteExpando = false;
	}

	if ( !div.addEventListener && div.attachEvent && div.fireEvent ) {
		div.attachEvent( "onclick", clickFn = function() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			support.noCloneEvent = false;
		});
		div.cloneNode( true ).fireEvent("onclick");
		div.detachEvent( "onclick", clickFn );
	}

	// Check if a radio maintains its value
	// after being appended to the DOM
	input = document.createElement("input");
	input.value = "t";
	input.setAttribute( "type", "radio" );
	support.radioValue = input.value === "t";

	input.setAttribute( "checked", "checked" );

	// #11217 - WebKit loses check when the name is after the checked attribute
	input.setAttribute( "name", "t" );

	div.appendChild( input );
	fragment = document.createDocumentFragment();
	fragment.appendChild( div.lastChild );

	// WebKit doesn't clone checked state correctly in fragments
	support.checkClone = fragment.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Check if a disconnected checkbox will retain its checked
	// value of true after appended to the DOM (IE6/7)
	support.appendChecked = input.checked;

	fragment.removeChild( input );
	fragment.appendChild( div );

	// Technique from Juriy Zaytsev
	// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
	// We only care about the case where non-standard event systems
	// are used, namely in IE. Short-circuiting here helps us to
	// avoid an eval call (in setAttribute) which can cause CSP
	// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
	if ( div.attachEvent ) {
		for ( i in {
			submit: true,
			change: true,
			focusin: true
		}) {
			eventName = "on" + i;
			isSupported = ( eventName in div );
			if ( !isSupported ) {
				div.setAttribute( eventName, "return;" );
				isSupported = ( typeof div[ eventName ] === "function" );
			}
			support[ i + "Bubbles" ] = isSupported;
		}
	}

	// Run tests that need a body at doc ready
	jQuery(function() {
		var container, div, tds, marginDiv,
			divReset = "padding:0;margin:0;border:0;display:block;overflow:hidden;",
			body = document.getElementsByTagName("body")[0];

		if ( !body ) {
			// Return for frameset docs that don't have a body
			return;
		}

		container = document.createElement("div");
		container.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px";
		body.insertBefore( container, body.firstChild );

		// Construct the test element
		div = document.createElement("div");
		container.appendChild( div );

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
		tds = div.getElementsByTagName("td");
		tds[ 0 ].style.cssText = "padding:0;margin:0;border:0;display:none";
		isSupported = ( tds[ 0 ].offsetHeight === 0 );

		tds[ 0 ].style.display = "";
		tds[ 1 ].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE <= 8 fail this test)
		support.reliableHiddenOffsets = isSupported && ( tds[ 0 ].offsetHeight === 0 );

		// Check box-sizing and margin behavior
		div.innerHTML = "";
		div.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;";
		support.boxSizing = ( div.offsetWidth === 4 );
		support.doesNotIncludeMarginInBodyOffset = ( body.offsetTop !== 1 );

		// NOTE: To any future maintainer, we've window.getComputedStyle
		// because jsdom on node.js will break without it.
		if ( window.getComputedStyle ) {
			support.pixelPosition = ( window.getComputedStyle( div, null ) || {} ).top !== "1%";
			support.boxSizingReliable = ( window.getComputedStyle( div, null ) || { width: "4px" } ).width === "4px";

			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. For more
			// info see bug #3333
			// Fails in WebKit before Feb 2011 nightlies
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			marginDiv = document.createElement("div");
			marginDiv.style.cssText = div.style.cssText = divReset;
			marginDiv.style.marginRight = marginDiv.style.width = "0";
			div.style.width = "1px";
			div.appendChild( marginDiv );
			support.reliableMarginRight =
				!parseFloat( ( window.getComputedStyle( marginDiv, null ) || {} ).marginRight );
		}

		if ( typeof div.style.zoom !== "undefined" ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.innerHTML = "";
			div.style.cssText = divReset + "width:1px;padding:1px;display:inline;zoom:1";
			support.inlineBlockNeedsLayout = ( div.offsetWidth === 3 );

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "block";
			div.style.overflow = "visible";
			div.innerHTML = "<div></div>";
			div.firstChild.style.width = "5px";
			support.shrinkWrapBlocks = ( div.offsetWidth !== 3 );

			container.style.zoom = 1;
		}

		// Null elements to avoid leaks in IE
		body.removeChild( container );
		container = div = tds = marginDiv = null;
	});

	// Null elements to avoid leaks in IE
	fragment.removeChild( div );
	all = a = select = opt = input = fragment = div = null;

	return support;
})();
var rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,
	rmultiDash = /([A-Z])/g;

jQuery.extend({
	cache: {},

	deletedIds: [],

	// Remove at next major release (1.9/2.0)
	uuid: 0,

	// Unique for each copy of jQuery on the page
	// Non-digits removed to match rinlinejQuery
	expando: "jQuery" + ( jQuery.fn.jquery + Math.random() ).replace( /\D/g, "" ),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	hasData: function( elem ) {
		elem = elem.nodeType ? jQuery.cache[ elem[jQuery.expando] ] : elem[ jQuery.expando ];
		return !!elem && !isEmptyDataObject( elem );
	},

	data: function( elem, name, data, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, ret,
			internalKey = jQuery.expando,
			getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[ internalKey ] : elem[ internalKey ] && internalKey;

		// Avoid doing any more work than we need to when trying to get data on an
		// object that has no data at all
		if ( (!id || !cache[id] || (!pvt && !cache[id].data)) && getByName && data === undefined ) {
			return;
		}

		if ( !id ) {
			// Only DOM nodes need a new unique ID for each element since their data
			// ends up in the global cache
			if ( isNode ) {
				elem[ internalKey ] = id = jQuery.deletedIds.pop() || jQuery.guid++;
			} else {
				id = internalKey;
			}
		}

		if ( !cache[ id ] ) {
			cache[ id ] = {};

			// Avoids exposing jQuery metadata on plain JS objects when the object
			// is serialized using JSON.stringify
			if ( !isNode ) {
				cache[ id ].toJSON = jQuery.noop;
			}
		}

		// An object can be passed to jQuery.data instead of a key/value pair; this gets
		// shallow copied over onto the existing cache
		if ( typeof name === "object" || typeof name === "function" ) {
			if ( pvt ) {
				cache[ id ] = jQuery.extend( cache[ id ], name );
			} else {
				cache[ id ].data = jQuery.extend( cache[ id ].data, name );
			}
		}

		thisCache = cache[ id ];

		// jQuery data() is stored in a separate object inside the object's internal data
		// cache in order to avoid key collisions between internal data and user-defined
		// data.
		if ( !pvt ) {
			if ( !thisCache.data ) {
				thisCache.data = {};
			}

			thisCache = thisCache.data;
		}

		if ( data !== undefined ) {
			thisCache[ jQuery.camelCase( name ) ] = data;
		}

		// Check for both converted-to-camel and non-converted data property names
		// If a data property was specified
		if ( getByName ) {

			// First Try to find as-is property data
			ret = thisCache[ name ];

			// Test for null|undefined property data
			if ( ret == null ) {

				// Try to find the camelCased property
				ret = thisCache[ jQuery.camelCase( name ) ];
			}
		} else {
			ret = thisCache;
		}

		return ret;
	},

	removeData: function( elem, name, pvt /* Internal Use Only */ ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		var thisCache, i, l,

			isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,
			id = isNode ? elem[ jQuery.expando ] : jQuery.expando;

		// If there is already no cache entry for this object, there is no
		// purpose in continuing
		if ( !cache[ id ] ) {
			return;
		}

		if ( name ) {

			thisCache = pvt ? cache[ id ] : cache[ id ].data;

			if ( thisCache ) {

				// Support array or space separated string names for data keys
				if ( !jQuery.isArray( name ) ) {

					// try the string as a key before any manipulation
					if ( name in thisCache ) {
						name = [ name ];
					} else {

						// split the camel cased version by spaces unless a key with the spaces exists
						name = jQuery.camelCase( name );
						if ( name in thisCache ) {
							name = [ name ];
						} else {
							name = name.split(" ");
						}
					}
				}

				for ( i = 0, l = name.length; i < l; i++ ) {
					delete thisCache[ name[i] ];
				}

				// If there is no data left in the cache, we want to continue
				// and let the cache object itself get destroyed
				if ( !( pvt ? isEmptyDataObject : jQuery.isEmptyObject )( thisCache ) ) {
					return;
				}
			}
		}

		// See jQuery.data for more information
		if ( !pvt ) {
			delete cache[ id ].data;

			// Don't destroy the parent cache unless the internal data object
			// had been the only thing left in it
			if ( !isEmptyDataObject( cache[ id ] ) ) {
				return;
			}
		}

		// Destroy the cache
		if ( isNode ) {
			jQuery.cleanData( [ elem ], true );

		// Use delete when supported for expandos or `cache` is not a window per isWindow (#10080)
		} else if ( jQuery.support.deleteExpando || cache != cache.window ) {
			delete cache[ id ];

		// When all else fails, null
		} else {
			cache[ id ] = null;
		}
	},

	// For internal use only.
	_data: function( elem, name, data ) {
		return jQuery.data( elem, name, data, true );
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		var noData = elem.nodeName && jQuery.noData[ elem.nodeName.toLowerCase() ];

		// nodes accept data unless otherwise specified; rejection can be conditional
		return !noData || noData !== true && elem.getAttribute("classid") === noData;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var parts, part, attr, name, l,
			elem = this[0],
			i = 0,
			data = null;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = jQuery.data( elem );

				if ( elem.nodeType === 1 && !jQuery._data( elem, "parsedAttrs" ) ) {
					attr = elem.attributes;
					for ( l = attr.length; i < l; i++ ) {
						name = attr[i].name;

						if ( !name.indexOf( "data-" ) ) {
							name = jQuery.camelCase( name.substring(5) );

							dataAttr( elem, name, data[ name ] );
						}
					}
					jQuery._data( elem, "parsedAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		parts = key.split( ".", 2 );
		parts[1] = parts[1] ? "." + parts[1] : "";
		part = parts[1] + "!";

		return jQuery.access( this, function( value ) {

			if ( value === undefined ) {
				data = this.triggerHandler( "getData" + part, [ parts[0] ] );

				// Try to fetch any internally stored data first
				if ( data === undefined && elem ) {
					data = jQuery.data( elem, key );
					data = dataAttr( elem, key, data );
				}

				return data === undefined && parts[1] ?
					this.data( parts[0] ) :
					data;
			}

			parts[1] = value;
			this.each(function() {
				var self = jQuery( this );

				self.triggerHandler( "setData" + part, parts );
				jQuery.data( this, key, value );
				self.triggerHandler( "changeData" + part, parts );
			});
		}, null, value, arguments.length > 1, null, false );
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {

		var name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();

		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				// Only convert to a number if it doesn't change the string
				+data + "" === data ? +data :
				rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}

// checks a cache object for emptiness
function isEmptyDataObject( obj ) {
	var name;
	for ( name in obj ) {

		// if the public data object is empty, the private is still empty
		if ( name === "data" && jQuery.isEmptyObject( obj[name] ) ) {
			continue;
		}
		if ( name !== "toJSON" ) {
			return false;
		}
	}

	return true;
}
jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = jQuery._data( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray(data) ) {
					queue = jQuery._data( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// not intended for public consumption - generates a queueHooks object, or returns the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return jQuery._data( elem, key ) || jQuery._data( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				jQuery.removeData( elem, type + "queue", true );
				jQuery.removeData( elem, key, true );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
		type = type || "fx";

		return this.queue( type, function( next, hooks ) {
			var timeout = setTimeout( next, time );
			hooks.stop = function() {
				clearTimeout( timeout );
			};
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while( i-- ) {
			tmp = jQuery._data( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var nodeHook, boolHook, fixSpecified,
	rclass = /[\t\r\n]/g,
	rreturn = /\r/g,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea|)$/i,
	rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
	getSetAttribute = jQuery.support.getSetAttribute;

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	},

	prop: function( name, value ) {
		return jQuery.access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		name = jQuery.propFix[ name ] || name;
		return this.each(function() {
			// try/catch handles cases where IE balks (such as removing a property on window)
			try {
				this[ name ] = undefined;
				delete this[ name ];
			} catch( e ) {}
		});
	},

	addClass: function( value ) {
		var classNames, i, l, elem,
			setClass, c, cl;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call(this, j, this.className) );
			});
		}

		if ( value && typeof value === "string" ) {
			classNames = value.split( core_rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className && classNames.length === 1 ) {
						elem.className = value;

					} else {
						setClass = " " + elem.className + " ";

						for ( c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( setClass.indexOf( " " + classNames[ c ] + " " ) < 0 ) {
								setClass += classNames[ c ] + " ";
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var removes, className, elem, c, cl, i, l;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call(this, j, this.className) );
			});
		}
		if ( (value && typeof value === "string") || value === undefined ) {
			removes = ( value || "" ).split( core_rspace );

			for ( i = 0, l = this.length; i < l; i++ ) {
				elem = this[ i ];
				if ( elem.nodeType === 1 && elem.className ) {

					className = (" " + elem.className + " ").replace( rclass, " " );

					// loop over each item in the removal list
					for ( c = 0, cl = removes.length; c < cl; c++ ) {
						// Remove until there is nothing to remove,
						while ( className.indexOf(" " + removes[ c ] + " ") >= 0 ) {
							className = className.replace( " " + removes[ c ] + " " , " " );
						}
					}
					elem.className = value ? jQuery.trim( className ) : "";
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( core_rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space separated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery._data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery._data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val,
				self = jQuery(this);

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, self.val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map(val, function ( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				// attributes.value is undefined in Blackberry 4.7 but
				// uses .value. See #6932
				var val = elem.attributes.value;
				return !val || val.specified ? elem.value : elem.text;
			}
		},
		select: {
			get: function( elem ) {
				var value, i, max, option,
					index = elem.selectedIndex,
					values = [],
					options = elem.options,
					one = elem.type === "select-one";

				// Nothing was selected
				if ( index < 0 ) {
					return null;
				}

				// Loop through all the selected options
				i = one ? index : 0;
				max = one ? index + 1 : options.length;
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Don't return options that are disabled or in a disabled optgroup
					if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) &&
							(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
				if ( one && !values.length && options.length ) {
					return jQuery( options[ index ] ).val();
				}

				return values;
			},

			set: function( elem, value ) {
				var values = jQuery.makeArray( value );

				jQuery(elem).find("option").each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	},

	// Unused in 1.8, left in so attrFn-stabbers won't die; remove in 1.9
	attrFn: {},

	attr: function( elem, name, value, pass ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( pass && jQuery.isFunction( jQuery.fn[ name ] ) ) {
			return jQuery( elem )[ name ]( value );
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( notxml ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] || ( rboolean.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;

			} else if ( hooks && "set" in hooks && notxml && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && notxml && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {

			ret = elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return ret === null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var propName, attrNames, name, isBool,
			i = 0;

		if ( value && elem.nodeType === 1 ) {

			attrNames = value.split( core_rspace );

			for ( ; i < attrNames.length; i++ ) {
				name = attrNames[ i ];

				if ( name ) {
					propName = jQuery.propFix[ name ] || name;
					isBool = rboolean.test( name );

					// See #9699 for explanation of this approach (setting first, then removal)
					// Do not do this for boolean attributes (see #10870)
					if ( !isBool ) {
						jQuery.attr( elem, name, "" );
					}
					elem.removeAttribute( getSetAttribute ? name : propName );

					// Set corresponding property to false for boolean attributes
					if ( isBool && propName in elem ) {
						elem[ propName ] = false;
					}
				}
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				} else if ( !jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input") ) {
					// Setting the type on a radio button after the value resets the value in IE6-9
					// Reset value to it's default in case type is set after value
					// This is for element creation
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		},
		// Use the value property for back compat
		// Use the nodeHook for button elements in IE6/7 (#1954)
		value: {
			get: function( elem, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.get( elem, name );
				}
				return name in elem ?
					elem.value :
					null;
			},
			set: function( elem, value, name ) {
				if ( nodeHook && jQuery.nodeName( elem, "button" ) ) {
					return nodeHook.set( elem, value, name );
				}
				// Does not return so that setAttribute is also used
				elem.value = value;
			}
		}
	},

	propFix: {
		tabindex: "tabIndex",
		readonly: "readOnly",
		"for": "htmlFor",
		"class": "className",
		maxlength: "maxLength",
		cellspacing: "cellSpacing",
		cellpadding: "cellPadding",
		rowspan: "rowSpan",
		colspan: "colSpan",
		usemap: "useMap",
		frameborder: "frameBorder",
		contenteditable: "contentEditable"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				return ( elem[ name ] = value );
			}

		} else {
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
				return ret;

			} else {
				return elem[ name ];
			}
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				var attributeNode = elem.getAttributeNode("tabindex");

				return attributeNode && attributeNode.specified ?
					parseInt( attributeNode.value, 10 ) :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}
		}
	}
});

// Hook for boolean attributes
boolHook = {
	get: function( elem, name ) {
		// Align boolean attributes with corresponding properties
		// Fall back to attribute presence where some booleans are not supported
		var attrNode,
			property = jQuery.prop( elem, name );
		return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?
			name.toLowerCase() :
			undefined;
	},
	set: function( elem, value, name ) {
		var propName;
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			// value is true since we know at this point it's type boolean and not false
			// Set boolean attributes to the same name and set the DOM property
			propName = jQuery.propFix[ name ] || name;
			if ( propName in elem ) {
				// Only set the IDL specifically if it already exists on the element
				elem[ propName ] = true;
			}

			elem.setAttribute( name, name.toLowerCase() );
		}
		return name;
	}
};

// IE6/7 do not support getting/setting some attributes with get/setAttribute
if ( !getSetAttribute ) {

	fixSpecified = {
		name: true,
		id: true,
		coords: true
	};

	// Use this for any attribute in IE6/7
	// This fixes almost every IE6/7 issue
	nodeHook = jQuery.valHooks.button = {
		get: function( elem, name ) {
			var ret;
			ret = elem.getAttributeNode( name );
			return ret && ( fixSpecified[ name ] ? ret.value !== "" : ret.specified ) ?
				ret.value :
				undefined;
		},
		set: function( elem, value, name ) {
			// Set the existing or create a new attribute node
			var ret = elem.getAttributeNode( name );
			if ( !ret ) {
				ret = document.createAttribute( name );
				elem.setAttributeNode( ret );
			}
			return ( ret.value = value + "" );
		}
	};

	// Set width and height to auto instead of 0 on empty string( Bug #8150 )
	// This is for removals
	jQuery.each([ "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			set: function( elem, value ) {
				if ( value === "" ) {
					elem.setAttribute( name, "auto" );
					return value;
				}
			}
		});
	});

	// Set contenteditable to false on removals(#10429)
	// Setting to empty string throws an error as an invalid value
	jQuery.attrHooks.contenteditable = {
		get: nodeHook.get,
		set: function( elem, value, name ) {
			if ( value === "" ) {
				value = "false";
			}
			nodeHook.set( elem, value, name );
		}
	};
}


// Some attributes require a special call on IE
if ( !jQuery.support.hrefNormalized ) {
	jQuery.each([ "href", "src", "width", "height" ], function( i, name ) {
		jQuery.attrHooks[ name ] = jQuery.extend( jQuery.attrHooks[ name ], {
			get: function( elem ) {
				var ret = elem.getAttribute( name, 2 );
				return ret === null ? undefined : ret;
			}
		});
	});
}

if ( !jQuery.support.style ) {
	jQuery.attrHooks.style = {
		get: function( elem ) {
			// Return undefined in the case of empty string
			// Normalize to lowercase since IE uppercases css property names
			return elem.style.cssText.toLowerCase() || undefined;
		},
		set: function( elem, value ) {
			return ( elem.style.cssText = value + "" );
		}
	};
}

// Safari mis-reports the default selected property of an option
// Accessing the parent's selectedIndex property fixes it
if ( !jQuery.support.optSelected ) {
	jQuery.propHooks.selected = jQuery.extend( jQuery.propHooks.selected, {
		get: function( elem ) {
			var parent = elem.parentNode;

			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
			return null;
		}
	});
}

// IE6/7 call enctype encoding
if ( !jQuery.support.enctype ) {
	jQuery.propFix.enctype = "encoding";
}

// Radios and checkboxes getter/setter
if ( !jQuery.support.checkOn ) {
	jQuery.each([ "radio", "checkbox" ], function() {
		jQuery.valHooks[ this ] = {
			get: function( elem ) {
				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				return elem.getAttribute("value") === null ? "on" : elem.value;
			}
		};
	});
}
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = jQuery.extend( jQuery.valHooks[ this ], {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	});
});
var rformElems = /^(?:textarea|input|select)$/i,
	rtypenamespace = /^([^\.]*|)(?:\.(.+)|)$/,
	rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	hoverHack = function( events ) {
		return jQuery.event.special.hover ? events : events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
	};

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	add: function( elem, types, handler, data, selector ) {

		var elemData, eventHandle, events,
			t, tns, type, namespaces, handleObj,
			handleObjIn, handlers, special;

		// Don't attach events to noData or text/comment nodes (allow plain objects tho)
		if ( elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !(elemData = jQuery._data( elem )) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		events = elemData.events;
		if ( !events ) {
			elemData.events = events = {};
		}
		eventHandle = elemData.handle;
		if ( !eventHandle ) {
			elemData.handle = eventHandle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ?
					jQuery.event.dispatch.apply( eventHandle.elem, arguments ) :
					undefined;
			};
			// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
			eventHandle.elem = elem;
		}

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = jQuery.trim( hoverHack(types) ).split( " " );
		for ( t = 0; t < types.length; t++ ) {

			tns = rtypenamespace.exec( types[t] ) || [];
			type = tns[1];
			namespaces = ( tns[2] || "" ).split( "." ).sort();

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: tns[1],
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			handlers = events[ type ];
			if ( !handlers ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener/attachEvent if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var t, tns, type, origType, namespaces, origCount,
			j, events, special, eventType, handleObj,
			elemData = jQuery.hasData( elem ) && jQuery._data( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = jQuery.trim( hoverHack( types || "" ) ).split(" ");
		for ( t = 0; t < types.length; t++ ) {
			tns = rtypenamespace.exec( types[t] ) || [];
			type = origType = tns[1];
			namespaces = tns[2];

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector? special.delegateType : special.bindType ) || type;
			eventType = events[ type ] || [];
			origCount = eventType.length;
			namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;

			// Remove matching events
			for ( j = 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					 ( !handler || handler.guid === handleObj.guid ) &&
					 ( !namespaces || namespaces.test( handleObj.namespace ) ) &&
					 ( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					eventType.splice( j--, 1 );

					if ( handleObj.selector ) {
						eventType.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( eventType.length === 0 && origCount !== eventType.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;

			// removeData also checks for emptiness and clears the expando if empty
			// so use it instead of delete
			jQuery.removeData( elem, "events", true );
		}
	},

	// Events that are safe to short-circuit if no handlers are attached.
	// Native DOM events should not be added, they may have inline handlers.
	customEvent: {
		"getData": true,
		"setData": true,
		"changeData": true
	},

	trigger: function( event, data, elem, onlyHandlers ) {
		// Don't do events on text and comment nodes
		if ( elem && (elem.nodeType === 3 || elem.nodeType === 8) ) {
			return;
		}

		// Event object or event type
		var cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType,
			type = event.type || event,
			namespaces = [];

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "!" ) >= 0 ) {
			// Exclusive events trigger only for the exact event (no namespaces)
			type = type.slice(0, -1);
			exclusive = true;
		}

		if ( type.indexOf( "." ) >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}

		if ( (!elem || jQuery.event.customEvent[ type ]) && !jQuery.event.global[ type ] ) {
			// No jQuery handlers for this event type, and it can't have inline handlers
			return;
		}

		// Caller can pass in an Event, Object, or just an event type string
		event = typeof event === "object" ?
			// jQuery.Event object
			event[ jQuery.expando ] ? event :
			// Object literal
			new jQuery.Event( type, event ) :
			// Just the event type (string)
			new jQuery.Event( type );

		event.type = type;
		event.isTrigger = true;
		event.exclusive = exclusive;
		event.namespace = namespaces.join( "." );
		event.namespace_re = event.namespace? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
		ontype = type.indexOf( ":" ) < 0 ? "on" + type : "";

		// Handle a global trigger
		if ( !elem ) {

			// TODO: Stop taunting the data cache; remove global events and always attach to document
			cache = jQuery.cache;
			for ( i in cache ) {
				if ( cache[ i ].events && cache[ i ].events[ type ] ) {
					jQuery.event.trigger( event, data, cache[ i ].handle.elem, true );
				}
			}
			return;
		}

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data != null ? jQuery.makeArray( data ) : [];
		data.unshift( event );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		eventPath = [[ elem, special.bindType || type ]];
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			cur = rfocusMorph.test( bubbleType + type ) ? elem : elem.parentNode;
			for ( old = elem; cur; cur = cur.parentNode ) {
				eventPath.push([ cur, bubbleType ]);
				old = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( old === (elem.ownerDocument || document) ) {
				eventPath.push([ old.defaultView || old.parentWindow || window, bubbleType ]);
			}
		}

		// Fire handlers on the event path
		for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++ ) {

			cur = eventPath[i][0];
			event.type = eventPath[i][1];

			handle = ( jQuery._data( cur, "events" ) || {} )[ event.type ] && jQuery._data( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}
			// Note that this is a bare JS function and not a jQuery handler
			handle = ontype && cur[ ontype ];
			if ( handle && jQuery.acceptData( cur ) && handle.apply && handle.apply( cur, data ) === false ) {
				event.preventDefault();
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( elem.ownerDocument, data ) === false) &&
				!(type === "click" && jQuery.nodeName( elem, "a" )) && jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Can't use an .isFunction() check here because IE6/7 fails that test.
				// Don't do default actions on window, that's where global variables be (#6170)
				// IE<9 dies on focus/blur to hidden element (#1486)
				if ( ontype && elem[ type ] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					old = elem[ ontype ];

					if ( old ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( old ) {
						elem[ ontype ] = old;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event || window.event );

		var i, j, cur, ret, selMatch, matched, matches, handleObj, sel, related,
			handlers = ( (jQuery._data( this, "events" ) || {} )[ event.type ] || []),
			delegateCount = handlers.delegateCount,
			args = core_slice.call( arguments ),
			run_all = !event.exclusive && !event.namespace,
			special = jQuery.event.special[ event.type ] || {},
			handlerQueue = [];

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers that should run if there are delegated events
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && !(event.button && event.type === "click") ) {

			for ( cur = event.target; cur != this; cur = cur.parentNode || this ) {

				// Don't process clicks (ONLY) on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					selMatch = {};
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];
						sel = handleObj.selector;

						if ( selMatch[ sel ] === undefined ) {
							selMatch[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( selMatch[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, matches: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( handlers.length > delegateCount ) {
			handlerQueue.push({ elem: this, matches: handlers.slice( delegateCount ) });
		}

		// Run delegates first; they may want to stop propagation beneath us
		for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++ ) {
			matched = handlerQueue[ i ];
			event.currentTarget = matched.elem;

			for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++ ) {
				handleObj = matched.matches[ j ];

				// Triggered event must either 1) be non-exclusive and have no namespace, or
				// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
				if ( run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test( handleObj.namespace ) ) {

					event.data = handleObj.data;
					event.handleObj = handleObj;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
	props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button,
				fromElement = original.fromElement;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add relatedTarget, if necessary
			if ( !event.relatedTarget && fromElement ) {
				event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop,
			originalEvent = event,
			fixHook = jQuery.event.fixHooks[ event.type ] || {},
			copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = jQuery.Event( originalEvent );

		for ( i = copy.length; i; ) {
			prop = copy[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
		if ( !event.target ) {
			event.target = originalEvent.srcElement || document;
		}

		// Target should not be a text node (#504, Safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// For mouse/key events, metaKey==false if it's undefined (#3368, #11328; IE6/7/8)
		event.metaKey = !!event.metaKey;

		return fixHook.filter? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},

		focus: {
			delegateType: "focusin"
		},
		blur: {
			delegateType: "focusout"
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{ type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

// Some plugins are using, but it's undocumented/deprecated and will be removed.
// The 1.7 special event interface should provide all the hooks needed now.
jQuery.event.handle = jQuery.event.dispatch;

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} :
	function( elem, type, handle ) {
		var name = "on" + type;

		if ( elem.detachEvent ) {

			// #8545, #7054, preventing memory leaks for custom events in IE6-8 –
			// detachEvent needed property on element, by name of that event, to properly expose it to GC
			if ( typeof elem[ name ] === "undefined" ) {
				elem[ name ] = null;
			}

			elem.detachEvent( name, handle );
		}
	};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = ( src.defaultPrevented || src.returnValue === false ||
			src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}

		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Create mouseenter/leave events using mouseover/out and event-time checks
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj,
				selector = handleObj.selector;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// IE submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Lazy-add a submit handler when a descendant form may potentially be submitted
			jQuery.event.add( this, "click._submit keypress._submit", function( e ) {
				// Node name check avoids a VML-related crash in IE (#9807)
				var elem = e.target,
					form = jQuery.nodeName( elem, "input" ) || jQuery.nodeName( elem, "button" ) ? elem.form : undefined;
				if ( form && !jQuery._data( form, "_submit_attached" ) ) {
					jQuery.event.add( form, "submit._submit", function( event ) {
						event._submit_bubble = true;
					});
					jQuery._data( form, "_submit_attached", true );
				}
			});
			// return undefined since we don't need an event listener
		},

		postDispatch: function( event ) {
			// If form was submitted by the user, bubble the event up the tree
			if ( event._submit_bubble ) {
				delete event._submit_bubble;
				if ( this.parentNode && !event.isTrigger ) {
					jQuery.event.simulate( "submit", this.parentNode, event, true );
				}
			}
		},

		teardown: function() {
			// Only need this for delegated form submit events
			if ( jQuery.nodeName( this, "form" ) ) {
				return false;
			}

			// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
			jQuery.event.remove( this, "._submit" );
		}
	};
}

// IE change delegation and checkbox/radio fix
if ( !jQuery.support.changeBubbles ) {

	jQuery.event.special.change = {

		setup: function() {

			if ( rformElems.test( this.nodeName ) ) {
				// IE doesn't fire change on a check/radio until blur; trigger it on click
				// after a propertychange. Eat the blur-change in special.change.handle.
				// This still fires onchange a second time for check/radio after blur.
				if ( this.type === "checkbox" || this.type === "radio" ) {
					jQuery.event.add( this, "propertychange._change", function( event ) {
						if ( event.originalEvent.propertyName === "checked" ) {
							this._just_changed = true;
						}
					});
					jQuery.event.add( this, "click._change", function( event ) {
						if ( this._just_changed && !event.isTrigger ) {
							this._just_changed = false;
						}
						// Allow triggered, simulated change events (#11500)
						jQuery.event.simulate( "change", this, event, true );
					});
				}
				return false;
			}
			// Delegated event; lazy-add a change handler on descendant inputs
			jQuery.event.add( this, "beforeactivate._change", function( e ) {
				var elem = e.target;

				if ( rformElems.test( elem.nodeName ) && !jQuery._data( elem, "_change_attached" ) ) {
					jQuery.event.add( elem, "change._change", function( event ) {
						if ( this.parentNode && !event.isSimulated && !event.isTrigger ) {
							jQuery.event.simulate( "change", this.parentNode, event, true );
						}
					});
					jQuery._data( elem, "_change_attached", true );
				}
			});
		},

		handle: function( event ) {
			var elem = event.target;

			// Swallow native change events from checkbox/radio, we already triggered them above
			if ( this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox") ) {
				return event.handleObj.handler.apply( this, arguments );
			}
		},

		teardown: function() {
			jQuery.event.remove( this, "._change" );

			return !rformElems.test( this.nodeName );
		}
	};
}

// Create "bubbling" focus and blur events
if ( !jQuery.support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler while someone wants focusin/focusout
		var attaches = 0,
			handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( attaches++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			},
			teardown: function() {
				if ( --attaches === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) { // && selector != null
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	live: function( types, data, fn ) {
		jQuery( this.context ).on( types, this.selector, data, fn );
		return this;
	},
	die: function( types, fn ) {
		jQuery( this.context ).off( types, this.selector || "**", fn );
		return this;
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			return jQuery.event.trigger( type, data, this[0], true );
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			guid = fn.guid || jQuery.guid++,
			i = 0,
			toggler = function( event ) {
				// Figure out which function to execute
				var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
				jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[ lastToggle ].apply( this, arguments ) || false;
			};

		// link all the functions, so any of them can unbind this click handler
		toggler.guid = guid;
		while ( i < args.length ) {
			args[ i++ ].guid = guid;
		}

		return this.click( toggler );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		if ( fn == null ) {
			fn = data;
			data = null;
		}

		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};

	if ( rkeyEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.keyHooks;
	}

	if ( rmouseEvent.test( name ) ) {
		jQuery.event.fixHooks[ name ] = jQuery.event.mouseHooks;
	}
});
/*!
 * Sizzle CSS Selector Engine
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://sizzlejs.com/
 */
(function( window, undefined ) {

var cachedruns,
	assertGetIdNotName,
	Expr,
	getText,
	isXML,
	contains,
	compile,
	sortOrder,
	hasDuplicate,
	outermostContext,

	baseHasDuplicate = true,
	strundefined = "undefined",

	expando = ( "sizcache" + Math.random() ).replace( ".", "" ),

	Token = String,
	document = window.document,
	docElem = document.documentElement,
	dirruns = 0,
	done = 0,
	pop = [].pop,
	push = [].push,
	slice = [].slice,
	// Use a stripped-down indexOf if a native one is unavailable
	indexOf = [].indexOf || function( elem ) {
		var i = 0,
			len = this.length;
		for ( ; i < len; i++ ) {
			if ( this[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	// Augment a function for special use by Sizzle
	markFunction = function( fn, value ) {
		fn[ expando ] = value == null || value;
		return fn;
	},

	createCache = function() {
		var cache = {},
			keys = [];

		return markFunction(function( key, value ) {
			// Only keep the most recent entries
			if ( keys.push( key ) > Expr.cacheLength ) {
				delete cache[ keys.shift() ];
			}

			return (cache[ key ] = value);
		}, cache );
	},

	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),

	// Regex

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier (http://www.w3.org/TR/css3-selectors/#attribute-selectors)
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Acceptable operators http://www.w3.org/TR/selectors/#attribute-selectors
	operators = "([*^$|!~]?=)",
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")" + whitespace +
		"*(?:" + operators + whitespace + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + identifier + ")|)|)" + whitespace + "*\\]",

	// Prefer arguments not in parens/brackets,
	//   then attribute selectors and non-pseudos (denoted by :),
	//   then anything else
	// These preferences are here to reduce the number of selectors
	//   needing tokenize in the PSEUDO preFilter
	pseudos = ":(" + characterEncoding + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + attributes + ")|[^:]|\\\\.)*|.*))\\)|)",

	// For matchExpr.POS and matchExpr.needsContext
	pos = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
		"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([\\x20\\t\\r\\n\\f>+~])" + whitespace + "*" ),
	rpseudo = new RegExp( pseudos ),

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,

	rnot = /^:not/,
	rsibling = /[\x20\t\r\n\f]*[+~]/,
	rendsWithNot = /:not\($/,

	rheader = /h\d/i,
	rinputs = /input|select|textarea|button/i,

	rbackslash = /\\(?!\\)/g,

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"NAME": new RegExp( "^\\[name=['\"]?(" + characterEncoding + ")['\"]?\\]" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"POS": new RegExp( pos, "i" ),
		"CHILD": new RegExp( "^:(only|nth|first|last)-child(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		// For use in libraries implementing .is()
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|" + pos, "i" )
	},

	// Support

	// Used for testing something on an element
	assert = function( fn ) {
		var div = document.createElement("div");

		try {
			return fn( div );
		} catch (e) {
			return false;
		} finally {
			// release memory in IE
			div = null;
		}
	},

	// Check if getElementsByTagName("*") returns only elements
	assertTagNameNoComments = assert(function( div ) {
		div.appendChild( document.createComment("") );
		return !div.getElementsByTagName("*").length;
	}),

	// Check if getAttribute returns normalized href attributes
	assertHrefNotNormalized = assert(function( div ) {
		div.innerHTML = "<a href='#'></a>";
		return div.firstChild && typeof div.firstChild.getAttribute !== strundefined &&
			div.firstChild.getAttribute("href") === "#";
	}),

	// Check if attributes should be retrieved by attribute nodes
	assertAttributes = assert(function( div ) {
		div.innerHTML = "<select></select>";
		var type = typeof div.lastChild.getAttribute("multiple");
		// IE8 returns a string for some attributes even when not present
		return type !== "boolean" && type !== "string";
	}),

	// Check if getElementsByClassName can be trusted
	assertUsableClassName = assert(function( div ) {
		// Opera can't find a second classname (in 9.6)
		div.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>";
		if ( !div.getElementsByClassName || !div.getElementsByClassName("e").length ) {
			return false;
		}

		// Safari 3.2 caches class attributes and doesn't catch changes
		div.lastChild.className = "e";
		return div.getElementsByClassName("e").length === 2;
	}),

	// Check if getElementById returns elements by name
	// Check if getElementsByName privileges form controls or returns elements by ID
	assertUsableName = assert(function( div ) {
		// Inject content
		div.id = expando + 0;
		div.innerHTML = "<a name='" + expando + "'></a><div name='" + expando + "'></div>";
		docElem.insertBefore( div, docElem.firstChild );

		// Test
		var pass = document.getElementsByName &&
			// buggy browsers will return fewer than the correct 2
			document.getElementsByName( expando ).length === 2 +
			// buggy browsers will return more than the correct 0
			document.getElementsByName( expando + 0 ).length;
		assertGetIdNotName = !document.getElementById( expando );

		// Cleanup
		docElem.removeChild( div );

		return pass;
	});

// If slice is not available, provide a backup
try {
	slice.call( docElem.childNodes, 0 )[0].nodeType;
} catch ( e ) {
	slice = function( i ) {
		var elem,
			results = [];
		for ( ; (elem = this[i]); i++ ) {
			results.push( elem );
		}
		return results;
	};
}

function Sizzle( selector, context, results, seed ) {
	results = results || [];
	context = context || document;
	var match, elem, xml, m,
		nodeType = context.nodeType;

	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	if ( nodeType !== 1 && nodeType !== 9 ) {
		return [];
	}

	xml = isXML( context );

	if ( !xml && !seed ) {
		if ( (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, slice.call(context.getElementsByTagName( selector ), 0) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && assertUsableClassName && context.getElementsByClassName ) {
				push.apply( results, slice.call(context.getElementsByClassName( m ), 0) );
				return results;
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed, xml );
}

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	return Sizzle( expr, null, null, [ elem ] ).length > 0;
};

// Returns a function to use in pseudos for input types
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

// Returns a function to use in pseudos for buttons
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

// Returns a function to use in pseudos for positionals
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( nodeType ) {
		if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
			// Use textContent for elements
			// innerText usage removed for consistency of new lines (see #11153)
			if ( typeof elem.textContent === "string" ) {
				return elem.textContent;
			} else {
				// Traverse its children
				for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
					ret += getText( elem );
				}
			}
		} else if ( nodeType === 3 || nodeType === 4 ) {
			return elem.nodeValue;
		}
		// Do not include comment or processing instruction nodes
	} else {

		// If no nodeType, this is expected to be an array
		for ( ; (node = elem[i]); i++ ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	}
	return ret;
};

isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

// Element contains another
contains = Sizzle.contains = docElem.contains ?
	function( a, b ) {
		var adown = a.nodeType === 9 ? a.documentElement : a,
			bup = b && b.parentNode;
		return a === bup || !!( bup && bup.nodeType === 1 && adown.contains && adown.contains(bup) );
	} :
	docElem.compareDocumentPosition ?
	function( a, b ) {
		return b && !!( a.compareDocumentPosition( b ) & 16 );
	} :
	function( a, b ) {
		while ( (b = b.parentNode) ) {
			if ( b === a ) {
				return true;
			}
		}
		return false;
	};

Sizzle.attr = function( elem, name ) {
	var val,
		xml = isXML( elem );

	if ( !xml ) {
		name = name.toLowerCase();
	}
	if ( (val = Expr.attrHandle[ name ]) ) {
		return val( elem );
	}
	if ( xml || assertAttributes ) {
		return elem.getAttribute( name );
	}
	val = elem.getAttributeNode( name );
	return val ?
		typeof elem[ name ] === "boolean" ?
			elem[ name ] ? name : null :
			val.specified ? val.value : null :
		null;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	// IE6/7 return a modified href
	attrHandle: assertHrefNotNormalized ?
		{} :
		{
			"href": function( elem ) {
				return elem.getAttribute( "href", 2 );
			},
			"type": function( elem ) {
				return elem.getAttribute("type");
			}
		},

	find: {
		"ID": assertGetIdNotName ?
			function( id, context, xml ) {
				if ( typeof context.getElementById !== strundefined && !xml ) {
					var m = context.getElementById( id );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					return m && m.parentNode ? [m] : [];
				}
			} :
			function( id, context, xml ) {
				if ( typeof context.getElementById !== strundefined && !xml ) {
					var m = context.getElementById( id );

					return m ?
						m.id === id || typeof m.getAttributeNode !== strundefined && m.getAttributeNode("id").value === id ?
							[m] :
							undefined :
						[];
				}
			},

		"TAG": assertTagNameNoComments ?
			function( tag, context ) {
				if ( typeof context.getElementsByTagName !== strundefined ) {
					return context.getElementsByTagName( tag );
				}
			} :
			function( tag, context ) {
				var results = context.getElementsByTagName( tag );

				// Filter out possible comments
				if ( tag === "*" ) {
					var elem,
						tmp = [],
						i = 0;

					for ( ; (elem = results[i]); i++ ) {
						if ( elem.nodeType === 1 ) {
							tmp.push( elem );
						}
					}

					return tmp;
				}
				return results;
			},

		"NAME": assertUsableName && function( tag, context ) {
			if ( typeof context.getElementsByName !== strundefined ) {
				return context.getElementsByName( name );
			}
		},

		"CLASS": assertUsableClassName && function( className, context, xml ) {
			if ( typeof context.getElementsByClassName !== strundefined && !xml ) {
				return context.getElementsByClassName( className );
			}
		}
	},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( rbackslash, "" );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[4] || match[5] || "" ).replace( rbackslash, "" );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				3 xn-component of xn+y argument ([+-]?\d*n|)
				4 sign of xn-component
				5 x of xn-component
				6 sign of y-component
				7 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1] === "nth" ) {
				// nth-child requires argument
				if ( !match[2] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[3] = +( match[3] ? match[4] + (match[5] || 1) : 2 * ( match[2] === "even" || match[2] === "odd" ) );
				match[4] = +( ( match[6] + match[7] ) || match[2] === "odd" );

			// other types prohibit arguments
			} else if ( match[2] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var unquoted, excess;
			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			if ( match[3] ) {
				match[2] = match[3];
			} else if ( (unquoted = match[4]) ) {
				// Only check arguments that contain a pseudo
				if ( rpseudo.test(unquoted) &&
					// Get excess from tokenize (recursively)
					(excess = tokenize( unquoted, true )) &&
					// advance to the next closing parenthesis
					(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

					// excess is a negative index
					unquoted = unquoted.slice( 0, excess );
					match[0] = match[0].slice( 0, excess );
				}
				match[2] = unquoted;
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {
		"ID": assertGetIdNotName ?
			function( id ) {
				id = id.replace( rbackslash, "" );
				return function( elem ) {
					return elem.getAttribute("id") === id;
				};
			} :
			function( id ) {
				id = id.replace( rbackslash, "" );
				return function( elem ) {
					var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
					return node && node.value === id;
				};
			},

		"TAG": function( nodeName ) {
			if ( nodeName === "*" ) {
				return function() { return true; };
			}
			nodeName = nodeName.replace( rbackslash, "" ).toLowerCase();

			return function( elem ) {
				return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
			};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ expando ][ className ];
			if ( !pattern ) {
				pattern = classCache( className, new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)") );
			}
			return function( elem ) {
				return pattern.test( elem.className || (typeof elem.getAttribute !== strundefined && elem.getAttribute("class")) || "" );
			};
		},

		"ATTR": function( name, operator, check ) {
			return function( elem, context ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.substr( result.length - check.length ) === check :
					operator === "~=" ? ( " " + result + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.substr( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, argument, first, last ) {

			if ( type === "nth" ) {
				return function( elem ) {
					var node, diff,
						parent = elem.parentNode;

					if ( first === 1 && last === 0 ) {
						return true;
					}

					if ( parent ) {
						diff = 0;
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								diff++;
								if ( elem === node ) {
									break;
								}
							}
						}
					}

					// Incorporate the offset (or cast to NaN), then check against cycle size
					diff -= last;
					return diff === first || ( diff % first === 0 && diff / first >= 0 );
				};
			}

			return function( elem ) {
				var node = elem;

				switch ( type ) {
					case "only":
					case "first":
						while ( (node = node.previousSibling) ) {
							if ( node.nodeType === 1 ) {
								return false;
							}
						}

						if ( type === "first" ) {
							return true;
						}

						node = elem;

						/* falls through */
					case "last":
						while ( (node = node.nextSibling) ) {
							if ( node.nodeType === 1 ) {
								return false;
							}
						}

						return true;
				}
			};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf.call( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is only affected by element nodes and content nodes(including text(3), cdata(4)),
			//   not comment, processing instructions, or others
			// Thanks to Diego Perini for the nodeName shortcut
			//   Greater than "@" means alpha characters (specifically not starting with "#" or "?")
			var nodeType;
			elem = elem.firstChild;
			while ( elem ) {
				if ( elem.nodeName > "@" || (nodeType = elem.nodeType) === 3 || nodeType === 4 ) {
					return false;
				}
				elem = elem.nextSibling;
			}
			return true;
		},

		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"text": function( elem ) {
			var type, attr;
			// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
			// use getAttribute instead to test this case
			return elem.nodeName.toLowerCase() === "input" &&
				(type = elem.type) === "text" &&
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === type );
		},

		// Input types
		"radio": createInputPseudo("radio"),
		"checkbox": createInputPseudo("checkbox"),
		"file": createInputPseudo("file"),
		"password": createInputPseudo("password"),
		"image": createInputPseudo("image"),

		"submit": createButtonPseudo("submit"),
		"reset": createButtonPseudo("reset"),

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"focus": function( elem ) {
			var doc = elem.ownerDocument;
			return elem === doc.activeElement && (!doc.hasFocus || doc.hasFocus()) && !!(elem.type || elem.href);
		},

		"active": function( elem ) {
			return elem === elem.ownerDocument.activeElement;
		},

		// Positional types
		"first": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length, argument ) {
			for ( var i = 0; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length, argument ) {
			for ( var i = 1; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			for ( var i = argument < 0 ? argument + length : argument; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			for ( var i = argument < 0 ? argument + length : argument; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

function siblingCheck( a, b, ret ) {
	if ( a === b ) {
		return ret;
	}

	var cur = a.nextSibling;

	while ( cur ) {
		if ( cur === b ) {
			return -1;
		}

		cur = cur.nextSibling;
	}

	return 1;
}

sortOrder = docElem.compareDocumentPosition ?
	function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		return ( !a.compareDocumentPosition || !b.compareDocumentPosition ?
			a.compareDocumentPosition :
			a.compareDocumentPosition(b) & 4
		) ? -1 : 1;
	} :
	function( a, b ) {
		// The nodes are identical, we can exit early
		if ( a === b ) {
			hasDuplicate = true;
			return 0;

		// Fallback to using sourceIndex (in IE) if it's available on both nodes
		} else if ( a.sourceIndex && b.sourceIndex ) {
			return a.sourceIndex - b.sourceIndex;
		}

		var al, bl,
			ap = [],
			bp = [],
			aup = a.parentNode,
			bup = b.parentNode,
			cur = aup;

		// If the nodes are siblings (or identical) we can do a quick check
		if ( aup === bup ) {
			return siblingCheck( a, b );

		// If no parents were found then the nodes are disconnected
		} else if ( !aup ) {
			return -1;

		} else if ( !bup ) {
			return 1;
		}

		// Otherwise they're somewhere else in the tree so we need
		// to build up a full list of the parentNodes for comparison
		while ( cur ) {
			ap.unshift( cur );
			cur = cur.parentNode;
		}

		cur = bup;

		while ( cur ) {
			bp.unshift( cur );
			cur = cur.parentNode;
		}

		al = ap.length;
		bl = bp.length;

		// Start walking down the tree looking for a discrepancy
		for ( var i = 0; i < al && i < bl; i++ ) {
			if ( ap[i] !== bp[i] ) {
				return siblingCheck( ap[i], bp[i] );
			}
		}

		// We ended someplace up the tree so do a sibling check
		return i === al ?
			siblingCheck( a, bp[i], -1 ) :
			siblingCheck( ap[i], b, 1 );
	};

// Always assume the presence of duplicates if sort doesn't
// pass them to our comparison function (as in Google Chrome).
[0, 0].sort( sortOrder );
baseHasDuplicate = !hasDuplicate;

// Document sorting and removing duplicates
Sizzle.uniqueSort = function( results ) {
	var elem,
		i = 1;

	hasDuplicate = baseHasDuplicate;
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		for ( ; (elem = results[i]); i++ ) {
			if ( elem === results[ i - 1 ] ) {
				results.splice( i--, 1 );
			}
		}
	}

	return results;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

function tokenize( selector, parseOnly ) {
	var matched, match, tokens, type, soFar, groups, preFilters,
		cached = tokenCache[ expando ][ selector ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				soFar = soFar.slice( match[0].length );
			}
			groups.push( tokens = [] );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			tokens.push( matched = new Token( match.shift() ) );
			soFar = soFar.slice( matched.length );

			// Cast descendant combinators to space
			matched.type = match[0].replace( rtrim, " " );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				// The last two arguments here are (context, xml) for backCompat
				(match = preFilters[ type ]( match, document, true ))) ) {

				tokens.push( matched = new Token( match.shift() ) );
				soFar = soFar.slice( matched.length );
				matched.type = type;
				matched.matches = match;
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && combinator.dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( checkNonElements || elem.nodeType === 1  ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( !xml ) {
				var cache,
					dirkey = dirruns + " " + doneName + " ",
					cachedkey = dirkey + cachedruns;
				while ( (elem = elem[ dir ]) ) {
					if ( checkNonElements || elem.nodeType === 1 ) {
						if ( (cache = elem[ expando ]) === cachedkey ) {
							return elem.sizset;
						} else if ( typeof cache === "string" && cache.indexOf(dirkey) === 0 ) {
							if ( elem.sizset ) {
								return elem;
							}
						} else {
							elem[ expando ] = cachedkey;
							if ( matcher( elem, context, xml ) ) {
								elem.sizset = true;
								return elem;
							}
							elem.sizset = false;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( checkNonElements || elem.nodeType === 1 ) {
						if ( matcher( elem, context, xml ) ) {
							return elem;
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		// Positional selectors apply to seed elements, so it is invalid to follow them with relative ones
		if ( seed && postFinder ) {
			return;
		}

		var i, elem, postFilterIn,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [], seed ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			postFilterIn = condense( matcherOut, postMap );
			postFilter( postFilterIn, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = postFilterIn.length;
			while ( i-- ) {
				if ( (elem = postFilterIn[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		// Keep seed and results synchronized
		if ( seed ) {
			// Ignore postFinder because it can't coexist with seed
			i = preFilter && matcherOut.length;
			while ( i-- ) {
				if ( (elem = matcherOut[i]) ) {
					seed[ preMap[i] ] = !(results[ preMap[i] ] = elem);
				}
			}
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf.call( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			return ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			// The concatenated values are (context, xml) for backCompat
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && tokens.slice( 0, i - 1 ).join("").replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && tokens.join("")
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, expandContext ) {
			var elem, j, matcher,
				setMatched = [],
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				outermost = expandContext != null,
				contextBackup = outermostContext,
				// We must always have either seed elements or context
				elems = seed || byElement && Expr.find["TAG"]( "*", expandContext && context.parentNode || context ),
				// Nested matchers should use non-integer dirruns
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.E);

			if ( outermost ) {
				outermostContext = context !== document && context;
				cachedruns = superMatcher.el;
			}

			// Add elements passing elementMatchers directly to results
			for ( ; (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					for ( j = 0; (matcher = elementMatchers[j]); j++ ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
						cachedruns = ++superMatcher.el;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				for ( j = 0; (matcher = setMatchers[j]); j++ ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	superMatcher.el = 0;
	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, group /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ expando ][ selector ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !group ) {
			group = tokenize( selector );
		}
		i = group.length;
		while ( i-- ) {
			cached = matcherFromTokens( group[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );
	}
	return cached;
};

function multipleContexts( selector, contexts, results, seed ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results, seed );
	}
	return results;
}

function select( selector, context, results, seed, xml ) {
	var i, tokens, token, type, find,
		match = tokenize( selector ),
		j = match.length;

	if ( !seed ) {
		// Try to minimize operations if there is only one group
		if ( match.length === 1 ) {

			// Take a shortcut and set the context if the root selector is an ID
			tokens = match[0] = match[0].slice( 0 );
			if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
					context.nodeType === 9 && !xml &&
					Expr.relative[ tokens[1].type ] ) {

				context = Expr.find["ID"]( token.matches[0].replace( rbackslash, "" ), context, xml )[0];
				if ( !context ) {
					return results;
				}

				selector = selector.slice( tokens.shift().length );
			}

			// Fetch a seed set for right-to-left matching
			for ( i = matchExpr["POS"].test( selector ) ? -1 : tokens.length - 1; i >= 0; i-- ) {
				token = tokens[i];

				// Abort if we hit a combinator
				if ( Expr.relative[ (type = token.type) ] ) {
					break;
				}
				if ( (find = Expr.find[ type ]) ) {
					// Search, expanding context for leading sibling combinators
					if ( (seed = find(
						token.matches[0].replace( rbackslash, "" ),
						rsibling.test( tokens[0].type ) && context.parentNode || context,
						xml
					)) ) {

						// If seed is empty or no tokens remain, we can return early
						tokens.splice( i, 1 );
						selector = seed.length && tokens.join("");
						if ( !selector ) {
							push.apply( results, slice.call( seed, 0 ) );
							return results;
						}

						break;
					}
				}
			}
		}
	}

	// Compile and execute a filtering function
	// Provide `match` to avoid retokenization if we modified the selector above
	compile( selector, match )(
		seed,
		context,
		xml,
		results,
		rsibling.test( selector )
	);
	return results;
}

if ( document.querySelectorAll ) {
	(function() {
		var disconnectedMatch,
			oldSelect = select,
			rescape = /'|\\/g,
			rattributeQuotes = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,

			// qSa(:focus) reports false when true (Chrome 21),
			// A support test would require too much code (would include document ready)
			rbuggyQSA = [":focus"],

			// matchesSelector(:focus) reports false when true (Chrome 21),
			// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
			// A support test would require too much code (would include document ready)
			// just skip matchesSelector for :active
			rbuggyMatches = [ ":active", ":focus" ],
			matches = docElem.matchesSelector ||
				docElem.mozMatchesSelector ||
				docElem.webkitMatchesSelector ||
				docElem.oMatchesSelector ||
				docElem.msMatchesSelector;

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explictly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			div.innerHTML = "<select><option selected=''></option></select>";

			// IE8 - Some boolean attributes are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here (do not put tests after this one)
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}
		});

		assert(function( div ) {

			// Opera 10-12/IE9 - ^= $= *= and empty values
			// Should not select anything
			div.innerHTML = "<p test=''></p>";
			if ( div.querySelectorAll("[test^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:\"\"|'')" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here (do not put tests after this one)
			div.innerHTML = "<input type='hidden'/>";
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push(":enabled", ":disabled");
			}
		});

		// rbuggyQSA always contains :focus, so no need for a length check
		rbuggyQSA = /* rbuggyQSA.length && */ new RegExp( rbuggyQSA.join("|") );

		select = function( selector, context, results, seed, xml ) {
			// Only use querySelectorAll when not filtering,
			// when this is not xml,
			// and when no QSA bugs apply
			if ( !seed && !xml && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
				var groups, i,
					old = true,
					nid = expando,
					newContext = context,
					newSelector = context.nodeType === 9 && selector;

				// qSA works strangely on Element-rooted queries
				// We can work around this by specifying an extra ID on the root
				// and working up from there (Thanks to Andrew Dupont for the technique)
				// IE 8 doesn't work on object elements
				if ( context.nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
					groups = tokenize( selector );

					if ( (old = context.getAttribute("id")) ) {
						nid = old.replace( rescape, "\\$&" );
					} else {
						context.setAttribute( "id", nid );
					}
					nid = "[id='" + nid + "'] ";

					i = groups.length;
					while ( i-- ) {
						groups[i] = nid + groups[i].join("");
					}
					newContext = rsibling.test( selector ) && context.parentNode || context;
					newSelector = groups.join(",");
				}

				if ( newSelector ) {
					try {
						push.apply( results, slice.call( newContext.querySelectorAll(
							newSelector
						), 0 ) );
						return results;
					} catch(qsaError) {
					} finally {
						if ( !old ) {
							context.removeAttribute("id");
						}
					}
				}
			}

			return oldSelect( selector, context, results, seed, xml );
		};

		if ( matches ) {
			assert(function( div ) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9)
				disconnectedMatch = matches.call( div, "div" );

				// This should fail with an exception
				// Gecko does not error, returns false instead
				try {
					matches.call( div, "[test!='']:sizzle" );
					rbuggyMatches.push( "!=", pseudos );
				} catch ( e ) {}
			});

			// rbuggyMatches always contains :active and :focus, so no need for a length check
			rbuggyMatches = /* rbuggyMatches.length && */ new RegExp( rbuggyMatches.join("|") );

			Sizzle.matchesSelector = function( elem, expr ) {
				// Make sure that attribute selectors are quoted
				expr = expr.replace( rattributeQuotes, "='$1']" );

				// rbuggyMatches always contains :active, so no need for an existence check
				if ( !isXML( elem ) && !rbuggyMatches.test( expr ) && (!rbuggyQSA || !rbuggyQSA.test( expr )) ) {
					try {
						var ret = matches.call( elem, expr );

						// IE 9's matchesSelector returns false on disconnected nodes
						if ( ret || disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9
								elem.document && elem.document.nodeType !== 11 ) {
							return ret;
						}
					} catch(e) {}
				}

				return Sizzle( expr, null, null, [ elem ] ).length > 0;
			};
		}
	})();
}

// Deprecated
Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Back-compat
function setFilters() {}
Expr.filters = setFilters.prototype = Expr.pseudos;
Expr.setFilters = new setFilters();

// Override sizzle attribute retrieval
Sizzle.attr = jQuery.attr;
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;


})( window );
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prev(?:Until|All))/,
	isSimple = /^.[^:#\[\.,]*$/,
	rneedsContext = jQuery.expr.match.needsContext,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend({
	find: function( selector ) {
		var i, l, length, n, r, ret,
			self = this;

		if ( typeof selector !== "string" ) {
			return jQuery( selector ).filter(function() {
				for ( i = 0, l = self.length; i < l; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			});
		}

		ret = this.pushStack( "", "find", selector );

		for ( i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( n = length; n < ret.length; n++ ) {
					for ( r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var i,
			targets = jQuery( target, this ),
			len = targets.length;

		return this.filter(function() {
			for ( i = 0; i < len; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},

	is: function( selector ) {
		return !!selector && (
			typeof selector === "string" ?
				// If this is a positional/relative selector, check membership in the returned set
				// so $("p:first").is("p:last") won't return true for a doc with two "p".
				rneedsContext.test( selector ) ?
					jQuery( selector, this.context ).index( this[0] ) >= 0 :
					jQuery.filter( selector, this ).length > 0 :
				this.filter( selector ).length > 0 );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			ret = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			cur = this[i];

			while ( cur && cur.ownerDocument && cur !== context && cur.nodeType !== 11 ) {
				if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors) ) {
					ret.push( cur );
					break;
				}
				cur = cur.parentNode;
			}
		}

		ret = ret.length > 1 ? jQuery.unique( ret ) : ret;

		return this.pushStack( ret, "closest", selectors );
	},

	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
		}

		// index in selector
		if ( typeof elem === "string" ) {
			return jQuery.inArray( this[0], jQuery( elem ) );
		}

		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context ) :
				jQuery.makeArray( selector && selector.nodeType ? [ selector ] : selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

jQuery.fn.andSelf = jQuery.fn.addBack;

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

function sibling( cur, dir ) {
	do {
		cur = cur[ dir ];
	} while ( cur && cur.nodeType !== 1 );

	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );

		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 && !guaranteedUnique[ name ] ? jQuery.unique( ret ) : ret;

		if ( this.length > 1 && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, core_slice.call( arguments ).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return elems.length === 1 ?
			jQuery.find.matchesSelector(elems[0], expr) ? [ elems[0] ] : [] :
			jQuery.find.matches(expr, elems);
	},

	dir: function( elem, dir, until ) {
		var matched = [],
			cur = elem[ dir ];

		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, keep ) {

	// Can't pass null or undefined to indexOf in Firefox 4
	// Set to 0 to skip string check
	qualifier = qualifier || 0;

	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			var retVal = !!qualifier.call( elem, i, elem );
			return retVal === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return ( elem === qualifier ) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return ( jQuery.inArray( elem, qualifier ) >= 0 ) === keep;
	});
}
function createSafeFragment( document ) {
	var list = nodeNames.split( "|" ),
	safeFrag = document.createDocumentFragment();

	if ( safeFrag.createElement ) {
		while ( list.length ) {
			safeFrag.createElement(
				list.pop()
			);
		}
	}
	return safeFrag;
}

var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" +
		"header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
	rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	rnocache = /<(?:script|object|embed|option|style)/i,
	rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"),
	rcheckableType = /^(?:checkbox|radio)$/,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /\/(java|ecma)script/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g,
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	},
	safeFragment = createSafeFragment( document ),
	fragmentDiv = safeFragment.appendChild( document.createElement("div") );

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE6-8 can't serialize link, script, style, or any html5 (NoScope) tags,
// unless wrapped in a div with non-breaking characters in front of it.
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "X<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( value ) {
		return jQuery.access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().append( ( this[0] && this[0].ownerDocument || document ).createTextNode( value ) );
		}, null, value, arguments.length );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function(i) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( !isDisconnected( this[0] ) ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		}

		if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			return this.pushStack( jQuery.merge( set, this ), "before", this.selector );
		}
	},

	after: function() {
		if ( !isDisconnected( this[0] ) ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		}

		if ( arguments.length ) {
			var set = jQuery.clean( arguments );
			return this.pushStack( jQuery.merge( this, set ), "after", this.selector );
		}
	},

	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					elem.parentNode.removeChild( elem );
				}
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function () {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return jQuery.access( this, function( value ) {
			var elem = this[0] || {},
				i = 0,
				l = this.length;

			if ( value === undefined ) {
				return elem.nodeType === 1 ?
					elem.innerHTML.replace( rinlinejQuery, "" ) :
					undefined;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				( jQuery.support.htmlSerialize || !rnoshimcache.test( value )  ) &&
				( jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value ) ) &&
				!wrapMap[ ( rtagName.exec( value ) || ["", ""] )[1].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for (; i < l; i++ ) {
						// Remove element nodes and prevent memory leaks
						elem = this[i] || {};
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( elem.getElementsByTagName( "*" ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch(e) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function( value ) {
		if ( !isDisconnected( this[0] ) ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery( value ).detach();
			}

			return this.each(function() {
				var next = this.nextSibling,
					parent = this.parentNode;

				jQuery( this ).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		}

		return this.length ?
			this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value ) :
			this;
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {

		// Flatten any nested arrays
		args = [].concat.apply( [], args );

		var results, first, fragment, iNoClone,
			i = 0,
			value = args[0],
			scripts = [],
			l = this.length;

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && l > 1 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call( this, i, table ? self.html() : undefined );
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			results = jQuery.buildFragment( args, this, scripts );
			fragment = results.fragment;
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				// Fragments from the fragment cache must always be cloned and never used in place.
				for ( iNoClone = results.cacheable || l - 1; i < l; i++ ) {
					callback.call(
						table && jQuery.nodeName( this[i], "table" ) ?
							findOrAppend( this[i], "tbody" ) :
							this[i],
						i === iNoClone ?
							fragment :
							jQuery.clone( fragment, true, true )
					);
				}
			}

			// Fix #11809: Avoid leaking memory
			fragment = first = null;

			if ( scripts.length ) {
				jQuery.each( scripts, function( i, elem ) {
					if ( elem.src ) {
						if ( jQuery.ajax ) {
							jQuery.ajax({
								url: elem.src,
								type: "GET",
								dataType: "script",
								async: false,
								global: false,
								"throws": true
							});
						} else {
							jQuery.error("no ajax");
						}
					} else {
						jQuery.globalEval( ( elem.text || elem.textContent || elem.innerHTML || "" ).replace( rcleanScript, "" ) );
					}

					if ( elem.parentNode ) {
						elem.parentNode.removeChild( elem );
					}
				});
			}
		}

		return this;
	}
});

function findOrAppend( elem, tag ) {
	return elem.getElementsByTagName( tag )[0] || elem.appendChild( elem.ownerDocument.createElement( tag ) );
}

function cloneCopyEvent( src, dest ) {

	if ( dest.nodeType !== 1 || !jQuery.hasData( src ) ) {
		return;
	}

	var type, i, l,
		oldData = jQuery._data( src ),
		curData = jQuery._data( dest, oldData ),
		events = oldData.events;

	if ( events ) {
		delete curData.handle;
		curData.events = {};

		for ( type in events ) {
			for ( i = 0, l = events[ type ].length; i < l; i++ ) {
				jQuery.event.add( dest, type, events[ type ][ i ] );
			}
		}
	}

	// make the cloned public data object a copy from the original
	if ( curData.data ) {
		curData.data = jQuery.extend( {}, curData.data );
	}
}

function cloneFixAttributes( src, dest ) {
	var nodeName;

	// We do not need to do anything for non-Elements
	if ( dest.nodeType !== 1 ) {
		return;
	}

	// clearAttributes removes the attributes, which we don't want,
	// but also removes the attachEvent events, which we *do* want
	if ( dest.clearAttributes ) {
		dest.clearAttributes();
	}

	// mergeAttributes, in contrast, only merges back on the
	// original attributes, not the events
	if ( dest.mergeAttributes ) {
		dest.mergeAttributes( src );
	}

	nodeName = dest.nodeName.toLowerCase();

	if ( nodeName === "object" ) {
		// IE6-10 improperly clones children of object elements using classid.
		// IE10 throws NoModificationAllowedError if parent is null, #12132.
		if ( dest.parentNode ) {
			dest.outerHTML = src.outerHTML;
		}

		// This path appears unavoidable for IE9. When cloning an object
		// element in IE9, the outerHTML strategy above is not sufficient.
		// If the src has innerHTML and the destination does not,
		// copy the src.innerHTML into the dest.innerHTML. #10324
		if ( jQuery.support.html5Clone && (src.innerHTML && !jQuery.trim(dest.innerHTML)) ) {
			dest.innerHTML = src.innerHTML;
		}

	} else if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		// IE6-8 fails to persist the checked state of a cloned checkbox
		// or radio button. Worse, IE6-7 fail to give the cloned element
		// a checked appearance if the defaultChecked value isn't also set

		dest.defaultChecked = dest.checked = src.checked;

		// IE6-7 get confused and end up setting the value of a cloned
		// checkbox/radio button to an empty string instead of "on"
		if ( dest.value !== src.value ) {
			dest.value = src.value;
		}

	// IE6-8 fails to return the selected option to the default selected
	// state when cloning options
	} else if ( nodeName === "option" ) {
		dest.selected = src.defaultSelected;

	// IE6-8 fails to set the defaultValue to the correct value when
	// cloning other types of input fields
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;

	// IE blanks contents when cloning scripts
	} else if ( nodeName === "script" && dest.text !== src.text ) {
		dest.text = src.text;
	}

	// Event data gets referenced instead of copied if the expando
	// gets copied too
	dest.removeAttribute( jQuery.expando );
}

jQuery.buildFragment = function( args, context, scripts ) {
	var fragment, cacheable, cachehit,
		first = args[ 0 ];

	// Set context from what may come in as undefined or a jQuery collection or a node
	// Updated to fix #12266 where accessing context[0] could throw an exception in IE9/10 &
	// also doubles as fix for #8950 where plain objects caused createDocumentFragment exception
	context = context || document;
	context = !context.nodeType && context[0] || context;
	context = context.ownerDocument || context;

	// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
	if ( args.length === 1 && typeof first === "string" && first.length < 512 && context === document &&
		first.charAt(0) === "<" && !rnocache.test( first ) &&
		(jQuery.support.checkClone || !rchecked.test( first )) &&
		(jQuery.support.html5Clone || !rnoshimcache.test( first )) ) {

		// Mark cacheable and look for a hit
		cacheable = true;
		fragment = jQuery.fragments[ first ];
		cachehit = fragment !== undefined;
	}

	if ( !fragment ) {
		fragment = context.createDocumentFragment();
		jQuery.clean( args, context, fragment, scripts );

		// Update the cache, but only store false
		// unless this is a second parsing of the same content
		if ( cacheable ) {
			jQuery.fragments[ first ] = cachehit && fragment;
		}
	}

	return { fragment: fragment, cacheable: cacheable };
};

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			i = 0,
			ret = [],
			insert = jQuery( selector ),
			l = insert.length,
			parent = this.length === 1 && this[0].parentNode;

		if ( (parent == null || parent && parent.nodeType === 11 && parent.childNodes.length === 1) && l === 1 ) {
			insert[ original ]( this[0] );
			return this;
		} else {
			for ( ; i < l; i++ ) {
				elems = ( i > 0 ? this.clone(true) : this ).get();
				jQuery( insert[i] )[ original ]( elems );
				ret = ret.concat( elems );
			}

			return this.pushStack( ret, name, insert.selector );
		}
	};
});

function getAll( elem ) {
	if ( typeof elem.getElementsByTagName !== "undefined" ) {
		return elem.getElementsByTagName( "*" );

	} else if ( typeof elem.querySelectorAll !== "undefined" ) {
		return elem.querySelectorAll( "*" );

	} else {
		return [];
	}
}

// Used in clean, fixes the defaultChecked property
function fixDefaultChecked( elem ) {
	if ( rcheckableType.test( elem.type ) ) {
		elem.defaultChecked = elem.checked;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var srcElements,
			destElements,
			i,
			clone;

		if ( jQuery.support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test( "<" + elem.nodeName + ">" ) ) {
			clone = elem.cloneNode( true );

		// IE<=8 does not properly clone detached, unknown element nodes
		} else {
			fragmentDiv.innerHTML = elem.outerHTML;
			fragmentDiv.removeChild( clone = fragmentDiv.firstChild );
		}

		if ( (!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) &&
				(elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem) ) {
			// IE copies events bound via attachEvent when using cloneNode.
			// Calling detachEvent on the clone will also remove the events
			// from the original. In order to get around this, we use some
			// proprietary methods to clear the events. Thanks to MooTools
			// guys for this hotness.

			cloneFixAttributes( elem, clone );

			// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
			srcElements = getAll( elem );
			destElements = getAll( clone );

			// Weird iteration because IE will replace the length property
			// with an element if you are cloning the body and one of the
			// elements on the page has a name or id of "length"
			for ( i = 0; srcElements[i]; ++i ) {
				// Ensure that the destination node is not null; Fixes #9587
				if ( destElements[i] ) {
					cloneFixAttributes( srcElements[i], destElements[i] );
				}
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			cloneCopyEvent( elem, clone );

			if ( deepDataAndEvents ) {
				srcElements = getAll( elem );
				destElements = getAll( clone );

				for ( i = 0; srcElements[i]; ++i ) {
					cloneCopyEvent( srcElements[i], destElements[i] );
				}
			}
		}

		srcElements = destElements = null;

		// Return the cloned set
		return clone;
	},

	clean: function( elems, context, fragment, scripts ) {
		var i, j, elem, tag, wrap, depth, div, hasBody, tbody, len, handleScript, jsTags,
			safe = context === document && safeFragment,
			ret = [];

		// Ensure that context is a document
		if ( !context || typeof context.createDocumentFragment === "undefined" ) {
			context = document;
		}

		// Use the already-created safe fragment if context permits
		for ( i = 0; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" ) {
				if ( !rhtml.test( elem ) ) {
					elem = context.createTextNode( elem );
				} else {
					// Ensure a safe container in which to render the html
					safe = safe || createSafeFragment( context );
					div = context.createElement("div");
					safe.appendChild( div );

					// Fix "XHTML"-style tags in all browsers
					elem = elem.replace(rxhtmlTag, "<$1></$2>");

					// Go to html and back, then peel off extra wrappers
					tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					depth = wrap[0];
					div.innerHTML = wrap[1] + elem + wrap[2];

					// Move to the right depth
					while ( depth-- ) {
						div = div.lastChild;
					}

					// Remove IE's autoinserted <tbody> from table fragments
					if ( !jQuery.support.tbody ) {

						// String was a <table>, *may* have spurious <tbody>
						hasBody = rtbody.test(elem);
							tbody = tag === "table" && !hasBody ?
								div.firstChild && div.firstChild.childNodes :

								// String was a bare <thead> or <tfoot>
								wrap[1] === "<table>" && !hasBody ?
									div.childNodes :
									[];

						for ( j = tbody.length - 1; j >= 0 ; --j ) {
							if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
								tbody[ j ].parentNode.removeChild( tbody[ j ] );
							}
						}
					}

					// IE completely kills leading whitespace when innerHTML is used
					if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
						div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
					}

					elem = div.childNodes;

					// Take out of fragment container (we need a fresh div each time)
					div.parentNode.removeChild( div );
				}
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				jQuery.merge( ret, elem );
			}
		}

		// Fix #11356: Clear elements from safeFragment
		if ( div ) {
			elem = div = safe = null;
		}

		// Reset defaultChecked for any radios and checkboxes
		// about to be appended to the DOM in IE 6/7 (#8060)
		if ( !jQuery.support.appendChecked ) {
			for ( i = 0; (elem = ret[i]) != null; i++ ) {
				if ( jQuery.nodeName( elem, "input" ) ) {
					fixDefaultChecked( elem );
				} else if ( typeof elem.getElementsByTagName !== "undefined" ) {
					jQuery.grep( elem.getElementsByTagName("input"), fixDefaultChecked );
				}
			}
		}

		// Append elements to a provided document fragment
		if ( fragment ) {
			// Special handling of each script element
			handleScript = function( elem ) {
				// Check if we consider it executable
				if ( !elem.type || rscriptType.test( elem.type ) ) {
					// Detach the script and store it in the scripts array (if provided) or the fragment
					// Return truthy to indicate that it has been handled
					return scripts ?
						scripts.push( elem.parentNode ? elem.parentNode.removeChild( elem ) : elem ) :
						fragment.appendChild( elem );
				}
			};

			for ( i = 0; (elem = ret[i]) != null; i++ ) {
				// Check if we're done after handling an executable script
				if ( !( jQuery.nodeName( elem, "script" ) && handleScript( elem ) ) ) {
					// Append to fragment and handle embedded scripts
					fragment.appendChild( elem );
					if ( typeof elem.getElementsByTagName !== "undefined" ) {
						// handleScript alters the DOM, so use jQuery.merge to ensure snapshot iteration
						jsTags = jQuery.grep( jQuery.merge( [], elem.getElementsByTagName("script") ), handleScript );

						// Splice the scripts into ret after their former ancestor and advance our index beyond them
						ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
						i += jsTags.length;
					}
				}
			}
		}

		return ret;
	},

	cleanData: function( elems, /* internal */ acceptData ) {
		var data, id, elem, type,
			i = 0,
			internalKey = jQuery.expando,
			cache = jQuery.cache,
			deleteExpando = jQuery.support.deleteExpando,
			special = jQuery.event.special;

		for ( ; (elem = elems[i]) != null; i++ ) {

			if ( acceptData || jQuery.acceptData( elem ) ) {

				id = elem[ internalKey ];
				data = id && cache[ id ];

				if ( data ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Remove cache only if it was not already removed by jQuery.event.remove
					if ( cache[ id ] ) {

						delete cache[ id ];

						// IE does not allow us to delete expando properties from nodes,
						// nor does it have a removeAttribute function on Document nodes;
						// we must handle all of these cases
						if ( deleteExpando ) {
							delete elem[ internalKey ];

						} else if ( elem.removeAttribute ) {
							elem.removeAttribute( internalKey );

						} else {
							elem[ internalKey ] = null;
						}

						jQuery.deletedIds.push( id );
					}
				}
			}
		}
	}
});
// Limit scope pollution from any deprecated API
(function() {

var matched, browser;

// Use of jQuery.browser is frowned upon.
// More details: http://api.jquery.com/jQuery.browser
// jQuery.uaMatch maintained for back-compat
jQuery.uaMatch = function( ua ) {
	ua = ua.toLowerCase();

	var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
		/(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		/(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
		/(msie) ([\w.]+)/.exec( ua ) ||
		ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
		[];

	return {
		browser: match[ 1 ] || "",
		version: match[ 2 ] || "0"
	};
};

matched = jQuery.uaMatch( navigator.userAgent );
browser = {};

if ( matched.browser ) {
	browser[ matched.browser ] = true;
	browser.version = matched.version;
}

// Chrome is Webkit, but Webkit is also Safari.
if ( browser.chrome ) {
	browser.webkit = true;
} else if ( browser.webkit ) {
	browser.safari = true;
}

jQuery.browser = browser;

jQuery.sub = function() {
	function jQuerySub( selector, context ) {
		return new jQuerySub.fn.init( selector, context );
	}
	jQuery.extend( true, jQuerySub, this );
	jQuerySub.superclass = this;
	jQuerySub.fn = jQuerySub.prototype = this();
	jQuerySub.fn.constructor = jQuerySub;
	jQuerySub.sub = this.sub;
	jQuerySub.fn.init = function init( selector, context ) {
		if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
			context = jQuerySub( context );
		}

		return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
	};
	jQuerySub.fn.init.prototype = jQuerySub.fn;
	var rootjQuerySub = jQuerySub(document);
	return jQuerySub;
};

})();
var curCSS, iframe, iframeDoc,
	ralpha = /alpha\([^)]*\)/i,
	ropacity = /opacity=([^)]*)/,
	rposition = /^(top|right|bottom|left)$/,
	// swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// see here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rmargin = /^margin/,
	rnumsplit = new RegExp( "^(" + core_pnum + ")(.*)$", "i" ),
	rnumnonpx = new RegExp( "^(" + core_pnum + ")(?!px)[a-z%]+$", "i" ),
	rrelNum = new RegExp( "^([-+])=(" + core_pnum + ")", "i" ),
	elemdisplay = {},

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: 0,
		fontWeight: 400
	},

	cssExpand = [ "Top", "Right", "Bottom", "Left" ],
	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],

	eventsToggle = jQuery.fn.toggle;

// return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// check for vendor prefixed names
	var capName = name.charAt(0).toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function isHidden( elem, el ) {
	elem = el || elem;
	return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
}

function showHide( elements, show ) {
	var elem, display,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		values[ index ] = jQuery._data( elem, "olddisplay" );
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && elem.style.display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = jQuery._data( elem, "olddisplay", css_defaultDisplay(elem.nodeName) );
			}
		} else {
			display = curCSS( elem, "display" );

			if ( !values[ index ] && display !== "none" ) {
				jQuery._data( elem, "olddisplay", display );
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.fn.extend({
	css: function( name, value ) {
		return jQuery.access( this, function( elem, name, value ) {
			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state, fn2 ) {
		var bool = typeof state === "boolean";

		if ( jQuery.isFunction( state ) && jQuery.isFunction( fn2 ) ) {
			return eventsToggle.apply( this, arguments );
		}

		return this.each(function() {
			if ( bool ? state : isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});

jQuery.extend({
	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {
					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;

				}
			}
		}
	},

	// Exclude the following css properties to add px
	cssNumber: {
		"fillOpacity": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		// normalize float css property
		"float": jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {
		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// convert relative number strings (+= or -=) to relative numbers. #7345
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that NaN and null values aren't set. See: #7116
			if ( value == null || type === "number" && isNaN( value ) ) {
				return;
			}

			// If a number was passed in, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
				// Fixes bug #5509
				try {
					style[ name ] = value;
				} catch(e) {}
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, numeric, extra ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// gets hook for the prefixed version
		// followed by the unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name );
		}

		//convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Return, converting to number if forced or a qualifier was provided and val looks numeric
		if ( numeric || extra !== undefined ) {
			num = parseFloat( val );
			return numeric || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var ret, name,
			old = {};

		// Remember the old values, and insert the new ones
		for ( name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		ret = callback.call( elem );

		// Revert the old values
		for ( name in options ) {
			elem.style[ name ] = old[ name ];
		}

		return ret;
	}
});

// NOTE: To any future maintainer, we've window.getComputedStyle
// because jsdom on node.js will break without it.
if ( window.getComputedStyle ) {
	curCSS = function( elem, name ) {
		var ret, width, minWidth, maxWidth,
			computed = window.getComputedStyle( elem, null ),
			style = elem.style;

		if ( computed ) {

			ret = computed[ name ];
			if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
				ret = jQuery.style( elem, name );
			}

			// A tribute to the "awesome hack by Dean Edwards"
			// Chrome < 17 and Safari 5.0 uses "computed value" instead of "used value" for margin-right
			// Safari 5.1.7 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
			// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
			if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {
				width = style.width;
				minWidth = style.minWidth;
				maxWidth = style.maxWidth;

				style.minWidth = style.maxWidth = style.width = ret;
				ret = computed.width;

				style.width = width;
				style.minWidth = minWidth;
				style.maxWidth = maxWidth;
			}
		}

		return ret;
	};
} else if ( document.documentElement.currentStyle ) {
	curCSS = function( elem, name ) {
		var left, rsLeft,
			ret = elem.currentStyle && elem.currentStyle[ name ],
			style = elem.style;

		// Avoid setting ret to empty string here
		// so we don't default to auto
		if ( ret == null && style && style[ name ] ) {
			ret = style[ name ];
		}

		// From the awesome hack by Dean Edwards
		// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

		// If we're not dealing with a regular pixel number
		// but a number that has a weird ending, we need to convert it to pixels
		// but not position css attributes, as those are proportional to the parent element instead
		// and we can't measure the parent instead because it might trigger a "stacking dolls" problem
		if ( rnumnonpx.test( ret ) && !rposition.test( name ) ) {

			// Remember the original values
			left = style.left;
			rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

			// Put in the new values to get a computed value out
			if ( rsLeft ) {
				elem.runtimeStyle.left = elem.currentStyle.left;
			}
			style.left = name === "fontSize" ? "1em" : ret;
			ret = style.pixelLeft + "px";

			// Revert the changed values
			style.left = left;
			if ( rsLeft ) {
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret === "" ? "auto" : ret;
	};
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
			Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
			value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			// we use jQuery.css instead of curCSS here
			// because of the reliableMarginRight CSS hook!
			val += jQuery.css( elem, extra + cssExpand[ i ], true );
		}

		// From this point on we use curCSS for maximum performance (relevant in animations)
		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;
			}

			// at this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
			}
		} else {
			// at this point, extra isn't content, so add padding
			val += parseFloat( curCSS( elem, "padding" + cssExpand[ i ] ) ) || 0;

			// at this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += parseFloat( curCSS( elem, "border" + cssExpand[ i ] + "Width" ) ) || 0;
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		valueIsBorderBox = true,
		isBorderBox = jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box";

	// some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// we need the check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox && ( jQuery.support.boxSizingReliable || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox
		)
	) + "px";
}


// Try to determine the default display value of an element
function css_defaultDisplay( nodeName ) {
	if ( elemdisplay[ nodeName ] ) {
		return elemdisplay[ nodeName ];
	}

	var elem = jQuery( "<" + nodeName + ">" ).appendTo( document.body ),
		display = elem.css("display");
	elem.remove();

	// If the simple way fails,
	// get element's real default display by attaching it to a temp iframe
	if ( display === "none" || display === "" ) {
		// Use the already-created iframe if possible
		iframe = document.body.appendChild(
			iframe || jQuery.extend( document.createElement("iframe"), {
				frameBorder: 0,
				width: 0,
				height: 0
			})
		);

		// Create a cacheable copy of the iframe document on first call.
		// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
		// document to it; WebKit & Firefox won't allow reusing the iframe document.
		if ( !iframeDoc || !iframe.createElement ) {
			iframeDoc = ( iframe.contentWindow || iframe.contentDocument ).document;
			iframeDoc.write("<!doctype html><html><body>");
			iframeDoc.close();
		}

		elem = iframeDoc.body.appendChild( iframeDoc.createElement(nodeName) );

		display = curCSS( elem, "display" );
		document.body.removeChild( iframe );
	}

	// Store the correct default display
	elemdisplay[ nodeName ] = display;

	return display;
}

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {
				// certain elements can have dimension info if we invisibly show them
				// however, it must have a current display style that would benefit from this
				if ( elem.offsetWidth === 0 && rdisplayswap.test( curCSS( elem, "display" ) ) ) {
					return jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					});
				} else {
					return getWidthOrHeight( elem, name, extra );
				}
			}
		},

		set: function( elem, value, extra ) {
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.support.boxSizing && jQuery.css( elem, "boxSizing" ) === "border-box"
				) : 0
			);
		}
	};
});

if ( !jQuery.support.opacity ) {
	jQuery.cssHooks.opacity = {
		get: function( elem, computed ) {
			// IE uses filters for opacity
			return ropacity.test( (computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "" ) ?
				( 0.01 * parseFloat( RegExp.$1 ) ) + "" :
				computed ? "1" : "";
		},

		set: function( elem, value ) {
			var style = elem.style,
				currentStyle = elem.currentStyle,
				opacity = jQuery.isNumeric( value ) ? "alpha(opacity=" + value * 100 + ")" : "",
				filter = currentStyle && currentStyle.filter || style.filter || "";

			// IE has trouble with opacity if it does not have layout
			// Force it by setting the zoom level
			style.zoom = 1;

			// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
			if ( value >= 1 && jQuery.trim( filter.replace( ralpha, "" ) ) === "" &&
				style.removeAttribute ) {

				// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
				// if "filter:" is present at all, clearType is disabled, we want to avoid this
				// style.removeAttribute is IE Only, but so apparently is this code path...
				style.removeAttribute( "filter" );

				// if there there is no filter style applied in a css rule, we are done
				if ( currentStyle && !currentStyle.filter ) {
					return;
				}
			}

			// otherwise, set new filter values
			style.filter = ralpha.test( filter ) ?
				filter.replace( ralpha, opacity ) :
				filter + " " + opacity;
		}
	};
}

// These hooks cannot be added until DOM ready because the support test
// for it is not run until after DOM ready
jQuery(function() {
	if ( !jQuery.support.reliableMarginRight ) {
		jQuery.cssHooks.marginRight = {
			get: function( elem, computed ) {
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// Work around by temporarily setting element display to inline-block
				return jQuery.swap( elem, { "display": "inline-block" }, function() {
					if ( computed ) {
						return curCSS( elem, "marginRight" );
					}
				});
			}
		};
	}

	// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
	// getComputedStyle returns percent when specified for top/left/bottom/right
	// rather than make the css module depend on the offset module, we just check for it here
	if ( !jQuery.support.pixelPosition && jQuery.fn.position ) {
		jQuery.each( [ "top", "left" ], function( i, prop ) {
			jQuery.cssHooks[ prop ] = {
				get: function( elem, computed ) {
					if ( computed ) {
						var ret = curCSS( elem, prop );
						// if curCSS returns percentage, fallback to offset
						return rnumnonpx.test( ret ) ? jQuery( elem ).position()[ prop ] + "px" : ret;
					}
				}
			};
		});
	}

});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		return ( elem.offsetWidth === 0 && elem.offsetHeight === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || curCSS( elem, "display" )) === "none");
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i,

				// assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ],
				expanded = {};

			for ( i = 0; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});
var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	rselectTextarea = /^(?:select|textarea)/i;

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function(){
			return this.elements ? jQuery.makeArray( this.elements ) : this;
		})
		.filter(function(){
			return this.name && !this.disabled &&
				( this.checked || rselectTextarea.test( this.nodeName ) ||
					rinput.test( this.type ) );
		})
		.map(function( i, elem ){
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val, i ){
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});

//Serialize an array of form elements or a set of
//key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}
var
	// Document location
	ajaxLocParts,
	ajaxLocation,

	rhash = /#.*$/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rquery = /\?/,
	rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
	rts = /([?&])_=[^&]*/,
	rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

// #8138, IE may throw an exception when accessing
// a field from window.location if document.domain has been set
try {
	ajaxLocation = location.href;
} catch( e ) {
	// Use the href attribute of an A element
	// since IE will modify it given document.location
	ajaxLocation = document.createElement( "a" );
	ajaxLocation.href = "";
	ajaxLocation = ajaxLocation.href;
}

// Segment location into parts
ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType, list, placeBefore,
			dataTypes = dataTypeExpression.toLowerCase().split( core_rspace ),
			i = 0,
			length = dataTypes.length;

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			for ( ; i < length; i++ ) {
				dataType = dataTypes[ i ];
				// We control if we're asked to add before
				// any existing element
				placeBefore = /^\+/.test( dataType );
				if ( placeBefore ) {
					dataType = dataType.substr( 1 ) || "*";
				}
				list = structure[ dataType ] = structure[ dataType ] || [];
				// then we add to the structure accordingly
				list[ placeBefore ? "unshift" : "push" ]( func );
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR,
		dataType /* internal */, inspected /* internal */ ) {

	dataType = dataType || options.dataTypes[ 0 ];
	inspected = inspected || {};

	inspected[ dataType ] = true;

	var selection,
		list = structure[ dataType ],
		i = 0,
		length = list ? list.length : 0,
		executeOnly = ( structure === prefilters );

	for ( ; i < length && ( executeOnly || !selection ); i++ ) {
		selection = list[ i ]( options, originalOptions, jqXHR );
		// If we got redirected to another dataType
		// we try there if executing only and not done already
		if ( typeof selection === "string" ) {
			if ( !executeOnly || inspected[ selection ] ) {
				selection = undefined;
			} else {
				options.dataTypes.unshift( selection );
				selection = inspectPrefiltersOrTransports(
						structure, options, originalOptions, jqXHR, selection, inspected );
			}
		}
	}
	// If we're only executing or nothing was selected
	// we try the catchall dataType if not done already
	if ( ( executeOnly || !selection ) && !inspected[ "*" ] ) {
		selection = inspectPrefiltersOrTransports(
				structure, options, originalOptions, jqXHR, "*", inspected );
	}
	// unnecessary when only executing (prefilters)
	// but it'll be ignored by the caller in that case
	return selection;
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};
	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}
}

jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	// Don't do a request if no elements are being requested
	if ( !this.length ) {
		return this;
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = url.slice( off, url.length );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// Request the remote document
	jQuery.ajax({
		url: url,

		// if "type" variable is undefined, then "GET" method will be used
		type: type,
		dataType: "html",
		data: params,
		complete: function( jqXHR, status ) {
			if ( callback ) {
				self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
			}
		}
	}).done(function( responseText ) {

		// Save response for use in complete callback
		response = arguments;

		// See if a selector was specified
		self.html( selector ?

			// Create a dummy div to hold the results
			jQuery("<div>")

				// inject the contents of the document in, removing the scripts
				// to avoid any 'Permission Denied' errors in IE
				.append( responseText.replace( rscript, "" ) )

				// Locate the specified elements
				.find( selector ) :

			// If not, just inject the full result
			responseText );

	});

	return this;
};

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split( " " ), function( i, o ){
	jQuery.fn[ o ] = function( f ){
		return this.on( o, f );
	};
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			type: method,
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	};
});

jQuery.extend({

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		if ( settings ) {
			// Building a settings object
			ajaxExtend( target, jQuery.ajaxSettings );
		} else {
			// Extending ajaxSettings
			settings = target;
			target = jQuery.ajaxSettings;
		}
		ajaxExtend( target, settings );
		return target;
	},

	ajaxSettings: {
		url: ajaxLocation,
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			text: "text/plain",
			json: "application/json, text/javascript",
			"*": allTypes
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText"
		},

		// List of data converters
		// 1) key format is "source_type destination_type" (a single space in-between)
		// 2) the catchall symbol "*" can be used for source_type
		converters: {

			// Convert anything to text
			"* text": window.String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			context: true,
			url: true
		}
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var // ifModified key
			ifModifiedKey,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s &&
				( callbackContext.nodeType || callbackContext instanceof jQuery ) ?
						jQuery( callbackContext ) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {

				readyState: 0,

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( !state ) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					statusText = statusText || strAbort;
					if ( transport ) {
						transport.abort( statusText );
					}
					done( 0, statusText );
					return this;
				}
			};

		// Callback for when everything is done
		// It is defined here because jslint complains if it is declared
		// at the end of the function (which would be more logical and readable)
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// If successful, handle type chaining
			if ( status >= 200 && status < 300 || status === 304 ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {

					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ ifModifiedKey ] = modified;
					}
					modified = jqXHR.getResponseHeader("Etag");
					if ( modified ) {
						jQuery.etag[ ifModifiedKey ] = modified;
					}
				}

				// If not modified
				if ( status === 304 ) {

					statusText = "notmodified";
					isSuccess = true;

				// If we have data
				} else {

					isSuccess = ajaxConvert( s, response );
					statusText = isSuccess.state;
					success = isSuccess.data;
					error = isSuccess.error;
					isSuccess = !error;
				}
			} else {
				// We extract error from statusText
				// then normalize statusText and status for non-aborts
				error = statusText;
				if ( !statusText || status ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajax" + ( isSuccess ? "Success" : "Error" ),
						[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		// Attach deferreds
		deferred.promise( jqXHR );
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;
		jqXHR.complete = completeDeferred.add;

		// Status-dependent callbacks
		jqXHR.statusCode = function( map ) {
			if ( map ) {
				var tmp;
				if ( state < 2 ) {
					for ( tmp in map ) {
						statusCode[ tmp ] = [ statusCode[tmp], map[tmp] ];
					}
				} else {
					tmp = map[ jqXHR.status ];
					jqXHR.always( tmp );
				}
			}
			return this;
		};

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
		// We also use the url parameter if available
		s.url = ( ( url || s.url ) + "" ).replace( rhash, "" ).replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().split( core_rspace );

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() ) || false;
			s.crossDomain = parts && ( parts.join(":") + ( parts[ 3 ] ? "" : parts[ 1 ] === "http:" ? 80 : 443 ) ) !==
				( ajaxLocParts.join(":") + ( ajaxLocParts[ 3 ] ? "" : ajaxLocParts[ 1 ] === "http:" ? 80 : 443 ) );
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		fireGlobals = s.global;

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.data;
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Get ifModifiedKey before adding the anti-cache parameter
			ifModifiedKey = s.url;

			// Add anti-cache in url if needed
			if ( s.cache === false ) {

				var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace( rts, "$1_=" + ts );

				// if nothing was replaced, add timestamp to the end
				s.url = ret + ( ( ret === s.url ) ? ( rquery.test( s.url ) ? "&" : "?" ) + "_=" + ts : "" );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			ifModifiedKey = ifModifiedKey || s.url;
			if ( jQuery.lastModified[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ ifModifiedKey ] );
			}
			if ( jQuery.etag[ ifModifiedKey ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ ifModifiedKey ] );
			}
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
				// Abort if not done already and return
				return jqXHR.abort();

		}

		// aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;
			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout( function(){
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch (e) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		return jqXHR;
	},

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {}

});

/* Handles responses to an ajax request:
 * - sets all responseXXX fields accordingly
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes,
		responseFields = s.responseFields;

	// Fill responseXXX fields
	for ( type in responseFields ) {
		if ( type in responses ) {
			jqXHR[ responseFields[type] ] = responses[ type ];
		}
	}

	// Remove auto dataType and get content-type in the process
	while( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "content-type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

// Chain conversions given the request and the original response
function ajaxConvert( s, response ) {

	var conv, conv2, current, tmp,
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice(),
		prev = dataTypes[ 0 ],
		converters = {},
		i = 0;

	// Apply the dataFilter if provided
	if ( s.dataFilter ) {
		response = s.dataFilter( response, s.dataType );
	}

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	// Convert to each sequential dataType, tolerating list modification
	for ( ; (current = dataTypes[++i]); ) {

		// There's only work to do if current dataType is non-auto
		if ( current !== "*" ) {

			// Convert response if prev dataType is non-auto and differs from current
			if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split(" ");
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.splice( i--, 0, current );
								}

								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s["throws"] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}

			// Update prev for next iteration
			prev = current;
		}
	}

	return { state: "success", data: response };
}
var oldCallbacks = [],
	rquestion = /\?/,
	rjsonp = /(=)\?(?=&|$)|\?\?/,
	nonce = jQuery.now();

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		data = s.data,
		url = s.url,
		hasCallback = s.jsonp !== false,
		replaceInUrl = hasCallback && rjsonp.test( url ),
		replaceInData = hasCallback && !replaceInUrl && typeof data === "string" &&
			!( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") &&
			rjsonp.test( data );

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( s.dataTypes[ 0 ] === "jsonp" || replaceInUrl || replaceInData ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;
		overwritten = window[ callbackName ];

		// Insert callback into url or form data
		if ( replaceInUrl ) {
			s.url = url.replace( rjsonp, "$1" + callbackName );
		} else if ( replaceInData ) {
			s.data = data.replace( rjsonp, "$1" + callbackName );
		} else if ( hasCallback ) {
			s.url += ( rquestion.test( url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});
// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /javascript|ecmascript/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and global
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
		s.global = false;
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function(s) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {

		var script,
			head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

		return {

			send: function( _, callback ) {

				script = document.createElement( "script" );

				script.async = "async";

				if ( s.scriptCharset ) {
					script.charset = s.scriptCharset;
				}

				script.src = s.url;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function( _, isAbort ) {

					if ( isAbort || !script.readyState || /loaded|complete/.test( script.readyState ) ) {

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;

						// Remove the script
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}

						// Dereference the script
						script = undefined;

						// Callback if not abort
						if ( !isAbort ) {
							callback( 200, "success" );
						}
					}
				};
				// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
				// This arises when a base node is used (#2709 and #4378).
				head.insertBefore( script, head.firstChild );
			},

			abort: function() {
				if ( script ) {
					script.onload( 0, 1 );
				}
			}
		};
	}
});
var xhrCallbacks,
	// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]( 0, 1 );
		}
	} : false,
	xhrId = 0;

// Functions to create xhrs
function createStandardXHR() {
	try {
		return new window.XMLHttpRequest();
	} catch( e ) {}
}

function createActiveXHR() {
	try {
		return new window.ActiveXObject( "Microsoft.XMLHTTP" );
	} catch( e ) {}
}

// Create the request object
// (This is still attached to ajaxSettings for backward compatibility)
jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

// Determine support properties
(function( xhr ) {
	jQuery.extend( jQuery.support, {
		ajax: !!xhr,
		cors: !!xhr && ( "withCredentials" in xhr )
	});
})( jQuery.ajaxSettings.xhr() );

// Create transport if the browser can provide an xhr
if ( jQuery.support.ajax ) {

	jQuery.ajaxTransport(function( s ) {
		// Cross domain only allowed if supported through XMLHttpRequest
		if ( !s.crossDomain || jQuery.support.cors ) {

			var callback;

			return {
				send: function( headers, complete ) {

					// Get a new xhr
					var handle, i,
						xhr = s.xhr();

					// Open the socket
					// Passing null username, generates a login popup on Opera (#2865)
					if ( s.username ) {
						xhr.open( s.type, s.url, s.async, s.username, s.password );
					} else {
						xhr.open( s.type, s.url, s.async );
					}

					// Apply custom fields if provided
					if ( s.xhrFields ) {
						for ( i in s.xhrFields ) {
							xhr[ i ] = s.xhrFields[ i ];
						}
					}

					// Override mime type if needed
					if ( s.mimeType && xhr.overrideMimeType ) {
						xhr.overrideMimeType( s.mimeType );
					}

					// X-Requested-With header
					// For cross-domain requests, seeing as conditions for a preflight are
					// akin to a jigsaw puzzle, we simply never set it to be sure.
					// (it can always be set on a per-request basis or even using ajaxSetup)
					// For same-domain requests, won't change header if already provided.
					if ( !s.crossDomain && !headers["X-Requested-With"] ) {
						headers[ "X-Requested-With" ] = "XMLHttpRequest";
					}

					// Need an extra try/catch for cross domain requests in Firefox 3
					try {
						for ( i in headers ) {
							xhr.setRequestHeader( i, headers[ i ] );
						}
					} catch( _ ) {}

					// Do send the request
					// This may raise an exception which is actually
					// handled in jQuery.ajax (so no try/catch here)
					xhr.send( ( s.hasContent && s.data ) || null );

					// Listener
					callback = function( _, isAbort ) {

						var status,
							statusText,
							responseHeaders,
							responses,
							xml;

						// Firefox throws exceptions when accessing properties
						// of an xhr when a network error occurred
						// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
						try {

							// Was never called and is aborted or complete
							if ( callback && ( isAbort || xhr.readyState === 4 ) ) {

								// Only called once
								callback = undefined;

								// Do not keep as active anymore
								if ( handle ) {
									xhr.onreadystatechange = jQuery.noop;
									if ( xhrOnUnloadAbort ) {
										delete xhrCallbacks[ handle ];
									}
								}

								// If it's an abort
								if ( isAbort ) {
									// Abort it manually if needed
									if ( xhr.readyState !== 4 ) {
										xhr.abort();
									}
								} else {
									status = xhr.status;
									responseHeaders = xhr.getAllResponseHeaders();
									responses = {};
									xml = xhr.responseXML;

									// Construct response list
									if ( xml && xml.documentElement /* #4958 */ ) {
										responses.xml = xml;
									}

									// When requesting binary data, IE6-9 will throw an exception
									// on any attempt to access responseText (#11426)
									try {
										responses.text = xhr.responseText;
									} catch( _ ) {
									}

									// Firefox throws an exception when accessing
									// statusText for faulty cross-domain requests
									try {
										statusText = xhr.statusText;
									} catch( e ) {
										// We normalize with Webkit giving an empty statusText
										statusText = "";
									}

									// Filter status for non standard behaviors

									// If the request is local and we have data: assume a success
									// (success with no data won't get notified, that's the best we
									// can do given current implementations)
									if ( !status && s.isLocal && !s.crossDomain ) {
										status = responses.text ? 200 : 404;
									// IE - #1450: sometimes returns 1223 when it should be 204
									} else if ( status === 1223 ) {
										status = 204;
									}
								}
							}
						} catch( firefoxAccessException ) {
							if ( !isAbort ) {
								complete( -1, firefoxAccessException );
							}
						}

						// Call complete if needed
						if ( responses ) {
							complete( status, statusText, responses, responseHeaders );
						}
					};

					if ( !s.async ) {
						// if we're in sync mode we fire the callback
						callback();
					} else if ( xhr.readyState === 4 ) {
						// (IE6 & IE7) if it's in cache and has been
						// retrieved directly we need to fire the callback
						setTimeout( callback, 0 );
					} else {
						handle = ++xhrId;
						if ( xhrOnUnloadAbort ) {
							// Create the active xhrs callbacks list if needed
							// and attach the unload handler
							if ( !xhrCallbacks ) {
								xhrCallbacks = {};
								jQuery( window ).unload( xhrOnUnloadAbort );
							}
							// Add to list of active xhrs callbacks
							xhrCallbacks[ handle ] = callback;
						}
						xhr.onreadystatechange = callback;
					}
				},

				abort: function() {
					if ( callback ) {
						callback(0,1);
					}
				}
			};
		}
	});
}
var fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([-+])=|)(" + core_pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [function( prop, value ) {
			var end, unit,
				tween = this.createTween( prop, value ),
				parts = rfxnum.exec( value ),
				target = tween.cur(),
				start = +target || 0,
				scale = 1,
				maxIterations = 20;

			if ( parts ) {
				end = +parts[2];
				unit = parts[3] || ( jQuery.cssNumber[ prop ] ? "" : "px" );

				// We need to compute starting value
				if ( unit !== "px" && start ) {
					// Iteratively approximate from a nonzero starting point
					// Prefer the current property, because this process will be trivial if it uses the same units
					// Fallback to end or a simple constant
					start = jQuery.css( tween.elem, prop, true ) || end || 1;

					do {
						// If previous iteration zeroed out, double until we get *something*
						// Use a string for doubling factor so we don't accidentally see scale as unchanged below
						scale = scale || ".5";

						// Adjust and apply
						start = start / scale;
						jQuery.style( tween.elem, prop, start + unit );

					// Update scale, tolerating zero or NaN from tween.cur()
					// And breaking the loop if scale is unchanged or perfect, or if we've just had enough
					} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
				}

				tween.unit = unit;
				tween.start = start;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[1] ? start + ( parts[1] + 1 ) * end : end;
			}
			return tween;
		}]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	}, 0 );
	return ( fxNow = jQuery.now() );
}

function createTweens( animation, props ) {
	jQuery.each( props, function( prop, value ) {
		var collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
			index = 0,
			length = collection.length;
		for ( ; index < length; index++ ) {
			if ( collection[ index ].call( animation, prop, value ) ) {

				// we're done with this property
				return;
			}
		}
	});
}

function Animation( elem, properties, options ) {
	var result,
		index = 0,
		tweenerIndex = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				percent = 1 - ( remaining / animation.duration || 0 ),
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end, easing ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// if we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;

				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// resolve when we played the last frame
				// otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	createTweens( animation, props );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			anim: animation,
			queue: animation.opts.queue,
			elem: elem
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// not quite $.extend, this wont overwrite keys already present.
			// also - reusing 'index' from above because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

function defaultPrefilter( elem, props, opts ) {
	var index, prop, value, length, dataShow, tween, hooks, oldfire,
		anim = this,
		style = elem.style,
		orig = {},
		handled = [],
		hidden = elem.nodeType && isHidden( elem );

	// handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// doing this makes sure that the complete handler will be called
			// before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE does not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		if ( jQuery.css( elem, "display" ) === "inline" &&
				jQuery.css( elem, "float" ) === "none" ) {

			// inline-level elements accept inline-block;
			// block-level elements need to be inline with layout
			if ( !jQuery.support.inlineBlockNeedsLayout || css_defaultDisplay( elem.nodeName ) === "inline" ) {
				style.display = "inline-block";

			} else {
				style.zoom = 1;
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		if ( !jQuery.support.shrinkWrapBlocks ) {
			anim.done(function() {
				style.overflow = opts.overflow[ 0 ];
				style.overflowX = opts.overflow[ 1 ];
				style.overflowY = opts.overflow[ 2 ];
			});
		}
	}


	// show/hide pass
	for ( index in props ) {
		value = props[ index ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ index ];
			if ( value === ( hidden ? "hide" : "show" ) ) {
				continue;
			}
			handled.push( index );
		}
	}

	length = handled.length;
	if ( length ) {
		dataShow = jQuery._data( elem, "fxshow" ) || jQuery._data( elem, "fxshow", {} );
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;
			jQuery.removeData( elem, "fxshow", true );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( index = 0 ; index < length ; index++ ) {
			prop = handled[ index ];
			tween = anim.createTween( prop, hidden ? dataShow[ prop ] : 0 );
			orig[ prop ] = dataShow[ prop ] || jQuery.style( elem, prop );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}
	}
}

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// passing any value as a 4th parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails
			// so, simple values such as "10px" are parsed to Float.
			// complex values such as "rotate(1rad)" are returned as is.
			result = jQuery.css( tween.elem, tween.prop, false, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// use step hook for back compat - use cssHook if its there - use .style if its
			// available and use plain properties where available
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Remove in 2.0 - this supports IE8's panic based approach
// to setting things on disconnected nodes

Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ||
			// special check for .toggle( handler, handler, ... )
			( !i && jQuery.isFunction( speed ) && jQuery.isFunction( easing ) ) ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations resolve immediately
				if ( empty ) {
					anim.stop( true );
				}
			};

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = jQuery._data( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	}
});

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		attrs = { height: type },
		i = 0;

	// if we include width, step value is 1 to do all cssExpand values,
	// if we don't include width, step value is 2 to skip over Left and Right
	includeWidth = includeWidth? 1 : 0;
	for( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p*Math.PI ) / 2;
	}
};

jQuery.timers = [];
jQuery.fx = Tween.prototype.init;
jQuery.fx.tick = function() {
	var timer,
		timers = jQuery.timers,
		i = 0;

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
};

jQuery.fx.timer = function( timer ) {
	if ( timer() && jQuery.timers.push( timer ) && !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.interval = 13;

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};

// Back Compat <1.8 extension point
jQuery.fx.step = {};

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}
var rroot = /^(?:body|html)$/i;

jQuery.fn.offset = function( options ) {
	if ( arguments.length ) {
		return options === undefined ?
			this :
			this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
	}

	var docElem, body, win, clientTop, clientLeft, scrollTop, scrollLeft,
		box = { top: 0, left: 0 },
		elem = this[ 0 ],
		doc = elem && elem.ownerDocument;

	if ( !doc ) {
		return;
	}

	if ( (body = doc.body) === elem ) {
		return jQuery.offset.bodyOffset( elem );
	}

	docElem = doc.documentElement;

	// Make sure it's not a disconnected DOM node
	if ( !jQuery.contains( docElem, elem ) ) {
		return box;
	}

	// If we don't have gBCR, just use 0,0 rather than error
	// BlackBerry 5, iOS 3 (original iPhone)
	if ( typeof elem.getBoundingClientRect !== "undefined" ) {
		box = elem.getBoundingClientRect();
	}
	win = getWindow( doc );
	clientTop  = docElem.clientTop  || body.clientTop  || 0;
	clientLeft = docElem.clientLeft || body.clientLeft || 0;
	scrollTop  = win.pageYOffset || docElem.scrollTop;
	scrollLeft = win.pageXOffset || docElem.scrollLeft;
	return {
		top: box.top  + scrollTop  - clientTop,
		left: box.left + scrollLeft - clientLeft
	};
};

jQuery.offset = {

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		if ( jQuery.support.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},

	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = ( position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1,
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;
		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({

	position: function() {
		if ( !this[0] ) {
			return;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent || document.body;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( {scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function( method, prop ) {
	var top = /Y/.test( prop );

	jQuery.fn[ method ] = function( val ) {
		return jQuery.access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? (prop in win) ? win[ prop ] :
					win.document.documentElement[ method ] :
					elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : jQuery( win ).scrollLeft(),
					 top ? val : jQuery( win ).scrollTop()
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return jQuery.access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height], whichever is greatest
					// unfortunately, this causes bug #3838 in IE6/8 only, but there is currently no good, small way to fix it.
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, value, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

// Expose jQuery as an AMD module, but only for AMD loaders that
// understand the issues with loading multiple versions of jQuery
// in a page that all might call define(). The loader will indicate
// they have special allowances for multiple jQuery versions by
// specifying define.amd.jQuery = true. Register as a named module,
// since jQuery can be concatenated with other files that may use define,
// but not use a proper concatenation script that understands anonymous
// AMD modules. A named AMD is safest and most robust way to register.
// Lowercase jquery is used because AMD module names are derived from
// file names, and jQuery is normally delivered in a lowercase file name.
// Do this after creating the global so that if an AMD module wants to call
// noConflict to hide this version of jQuery, it will work.
if ( typeof define === "function" && define.amd && define.amd.jQuery ) {
	define( "jquery", [], function () { return jQuery; } );
}

})( window );
(function($, undefined) {

/**
 * Unobtrusive scripting adapter for jQuery
 *
 * Requires jQuery 1.6.0 or later.
 * https://github.com/rails/jquery-ujs

 * Uploading file using rails.js
 * =============================
 *
 * By default, browsers do not allow files to be uploaded via AJAX. As a result, if there are any non-blank file fields
 * in the remote form, this adapter aborts the AJAX submission and allows the form to submit through standard means.
 *
 * The `ajax:aborted:file` event allows you to bind your own handler to process the form submission however you wish.
 *
 * Ex:
 *     $('form').live('ajax:aborted:file', function(event, elements){
 *       // Implement own remote file-transfer handler here for non-blank file inputs passed in `elements`.
 *       // Returning false in this handler tells rails.js to disallow standard form submission
 *       return false;
 *     });
 *
 * The `ajax:aborted:file` event is fired when a file-type input is detected with a non-blank value.
 *
 * Third-party tools can use this hook to detect when an AJAX file upload is attempted, and then use
 * techniques like the iframe method to upload the file instead.
 *
 * Required fields in rails.js
 * ===========================
 *
 * If any blank required inputs (required="required") are detected in the remote form, the whole form submission
 * is canceled. Note that this is unlike file inputs, which still allow standard (non-AJAX) form submission.
 *
 * The `ajax:aborted:required` event allows you to bind your own handler to inform the user of blank required inputs.
 *
 * !! Note that Opera does not fire the form's submit event if there are blank required inputs, so this event may never
 *    get fired in Opera. This event is what causes other browsers to exhibit the same submit-aborting behavior.
 *
 * Ex:
 *     $('form').live('ajax:aborted:required', function(event, elements){
 *       // Returning false in this handler tells rails.js to submit the form anyway.
 *       // The blank required inputs are passed to this function in `elements`.
 *       return ! confirm("Would you like to submit the form with missing info?");
 *     });
 */

  // Cut down on the number if issues from people inadvertently including jquery_ujs twice
  // by detecting and raising an error when it happens.
  var alreadyInitialized = function() {
    var events = $._data(document, 'events');
    return events && events.click && $.grep(events.click, function(e) { return e.namespace === 'rails'; }).length;
  }

  if ( alreadyInitialized() ) {
    $.error('jquery-ujs has already been loaded!');
  }

  // Shorthand to make it a little easier to call public rails functions from within rails.js
  var rails;

  $.rails = rails = {
    // Link elements bound by jquery-ujs
    linkClickSelector: 'a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]',

    // Select elements bound by jquery-ujs
    inputChangeSelector: 'select[data-remote], input[data-remote], textarea[data-remote]',

    // Form elements bound by jquery-ujs
    formSubmitSelector: 'form',

    // Form input elements bound by jquery-ujs
    formInputClickSelector: 'form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])',

    // Form input elements disabled during form submission
    disableSelector: 'input[data-disable-with], button[data-disable-with], textarea[data-disable-with]',

    // Form input elements re-enabled after form submission
    enableSelector: 'input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled',

    // Form required input elements
    requiredInputSelector: 'input[name][required]:not([disabled]),textarea[name][required]:not([disabled])',

    // Form file input elements
    fileInputSelector: 'input:file',

    // Link onClick disable selector with possible reenable after remote submission
    linkDisableSelector: 'a[data-disable-with]',

    // Make sure that every Ajax request sends the CSRF token
    CSRFProtection: function(xhr) {
      var token = $('meta[name="csrf-token"]').attr('content');
      if (token) xhr.setRequestHeader('X-CSRF-Token', token);
    },

    // Triggers an event on an element and returns false if the event result is false
    fire: function(obj, name, data) {
      var event = $.Event(name);
      obj.trigger(event, data);
      return event.result !== false;
    },

    // Default confirm dialog, may be overridden with custom confirm dialog in $.rails.confirm
    confirm: function(message) {
      return confirm(message);
    },

    // Default ajax function, may be overridden with custom function in $.rails.ajax
    ajax: function(options) {
      return $.ajax(options);
    },

    // Default way to get an element's href. May be overridden at $.rails.href.
    href: function(element) {
      return element.attr('href');
    },

    // Submits "remote" forms and links with ajax
    handleRemote: function(element) {
      var method, url, data, elCrossDomain, crossDomain, withCredentials, dataType, options;

      if (rails.fire(element, 'ajax:before')) {
        elCrossDomain = element.data('cross-domain');
        crossDomain = elCrossDomain === undefined ? null : elCrossDomain;
        withCredentials = element.data('with-credentials') || null;
        dataType = element.data('type') || ($.ajaxSettings && $.ajaxSettings.dataType);

        if (element.is('form')) {
          method = element.attr('method');
          url = element.attr('action');
          data = element.serializeArray();
          // memoized value from clicked submit button
          var button = element.data('ujs:submit-button');
          if (button) {
            data.push(button);
            element.data('ujs:submit-button', null);
          }
        } else if (element.is(rails.inputChangeSelector)) {
          method = element.data('method');
          url = element.data('url');
          data = element.serialize();
          if (element.data('params')) data = data + "&" + element.data('params');
        } else {
          method = element.data('method');
          url = rails.href(element);
          data = element.data('params') || null;
        }

        options = {
          type: method || 'GET', data: data, dataType: dataType,
          // stopping the "ajax:beforeSend" event will cancel the ajax request
          beforeSend: function(xhr, settings) {
            if (settings.dataType === undefined) {
              xhr.setRequestHeader('accept', '*/*;q=0.5, ' + settings.accepts.script);
            }
            return rails.fire(element, 'ajax:beforeSend', [xhr, settings]);
          },
          success: function(data, status, xhr) {
            element.trigger('ajax:success', [data, status, xhr]);
          },
          complete: function(xhr, status) {
            element.trigger('ajax:complete', [xhr, status]);
          },
          error: function(xhr, status, error) {
            element.trigger('ajax:error', [xhr, status, error]);
          },
          xhrFields: {
            withCredentials: withCredentials
          },
          crossDomain: crossDomain
        };
        // Only pass url to `ajax` options if not blank
        if (url) { options.url = url; }

        var jqxhr = rails.ajax(options);
        element.trigger('ajax:send', jqxhr);
        return jqxhr;
      } else {
        return false;
      }
    },

    // Handles "data-method" on links such as:
    // <a href="/users/5" data-method="delete" rel="nofollow" data-confirm="Are you sure?">Delete</a>
    handleMethod: function(link) {
      var href = rails.href(link),
        method = link.data('method'),
        target = link.attr('target'),
        csrf_token = $('meta[name=csrf-token]').attr('content'),
        csrf_param = $('meta[name=csrf-param]').attr('content'),
        form = $('<form method="post" action="' + href + '"></form>'),
        metadata_input = '<input name="_method" value="' + method + '" type="hidden" />';

      if (csrf_param !== undefined && csrf_token !== undefined) {
        metadata_input += '<input name="' + csrf_param + '" value="' + csrf_token + '" type="hidden" />';
      }

      if (target) { form.attr('target', target); }

      form.hide().append(metadata_input).appendTo('body');
      form.submit();
    },

    /* Disables form elements:
      - Caches element value in 'ujs:enable-with' data store
      - Replaces element text with value of 'data-disable-with' attribute
      - Sets disabled property to true
    */
    disableFormElements: function(form) {
      form.find(rails.disableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        element.data('ujs:enable-with', element[method]());
        element[method](element.data('disable-with'));
        element.prop('disabled', true);
      });
    },

    /* Re-enables disabled form elements:
      - Replaces element text with cached value from 'ujs:enable-with' data store (created in `disableFormElements`)
      - Sets disabled property to false
    */
    enableFormElements: function(form) {
      form.find(rails.enableSelector).each(function() {
        var element = $(this), method = element.is('button') ? 'html' : 'val';
        if (element.data('ujs:enable-with')) element[method](element.data('ujs:enable-with'));
        element.prop('disabled', false);
      });
    },

   /* For 'data-confirm' attribute:
      - Fires `confirm` event
      - Shows the confirmation dialog
      - Fires the `confirm:complete` event

      Returns `true` if no function stops the chain and user chose yes; `false` otherwise.
      Attaching a handler to the element's `confirm` event that returns a `falsy` value cancels the confirmation dialog.
      Attaching a handler to the element's `confirm:complete` event that returns a `falsy` value makes this function
      return false. The `confirm:complete` event is fired whether or not the user answered true or false to the dialog.
   */
    allowAction: function(element) {
      var message = element.data('confirm'),
          answer = false, callback;
      if (!message) { return true; }

      if (rails.fire(element, 'confirm')) {
        answer = rails.confirm(message);
        callback = rails.fire(element, 'confirm:complete', [answer]);
      }
      return answer && callback;
    },

    // Helper function which checks for blank inputs in a form that match the specified CSS selector
    blankInputs: function(form, specifiedSelector, nonBlank) {
      var inputs = $(), input, valueToCheck,
          selector = specifiedSelector || 'input,textarea',
          allInputs = form.find(selector);

      allInputs.each(function() {
        input = $(this);
        valueToCheck = input.is(':checkbox,:radio') ? input.is(':checked') : input.val();
        // If nonBlank and valueToCheck are both truthy, or nonBlank and valueToCheck are both falsey
        if (!valueToCheck === !nonBlank) {

          // Don't count unchecked required radio if other radio with same name is checked
          if (input.is(':radio') && allInputs.filter('input:radio:checked[name="' + input.attr('name') + '"]').length) {
            return true; // Skip to next input
          }

          inputs = inputs.add(input);
        }
      });
      return inputs.length ? inputs : false;
    },

    // Helper function which checks for non-blank inputs in a form that match the specified CSS selector
    nonBlankInputs: function(form, specifiedSelector) {
      return rails.blankInputs(form, specifiedSelector, true); // true specifies nonBlank
    },

    // Helper function, needed to provide consistent behavior in IE
    stopEverything: function(e) {
      $(e.target).trigger('ujs:everythingStopped');
      e.stopImmediatePropagation();
      return false;
    },

    // find all the submit events directly bound to the form and
    // manually invoke them. If anyone returns false then stop the loop
    callFormSubmitBindings: function(form, event) {
      var events = form.data('events'), continuePropagation = true;
      if (events !== undefined && events['submit'] !== undefined) {
        $.each(events['submit'], function(i, obj){
          if (typeof obj.handler === 'function') return continuePropagation = obj.handler(event);
        });
      }
      return continuePropagation;
    },

    //  replace element's html with the 'data-disable-with' after storing original html
    //  and prevent clicking on it
    disableElement: function(element) {
      element.data('ujs:enable-with', element.html()); // store enabled state
      element.html(element.data('disable-with')); // set to disabled state
      element.bind('click.railsDisable', function(e) { // prevent further clicking
        return rails.stopEverything(e);
      });
    },

    // restore element to its original state which was disabled by 'disableElement' above
    enableElement: function(element) {
      if (element.data('ujs:enable-with') !== undefined) {
        element.html(element.data('ujs:enable-with')); // set to old enabled state
        // this should be element.removeData('ujs:enable-with')
        // but, there is currently a bug in jquery which makes hyphenated data attributes not get removed
        element.data('ujs:enable-with', false); // clean up cache
      }
      element.unbind('click.railsDisable'); // enable element
    }

  };

  if (rails.fire($(document), 'rails:attachBindings')) {

    $.ajaxPrefilter(function(options, originalOptions, xhr){ if ( !options.crossDomain ) { rails.CSRFProtection(xhr); }});

    $(document).delegate(rails.linkDisableSelector, 'ajax:complete', function() {
        rails.enableElement($(this));
    });

    $(document).delegate(rails.linkClickSelector, 'click.rails', function(e) {
      var link = $(this), method = link.data('method'), data = link.data('params');
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      if (link.is(rails.linkDisableSelector)) rails.disableElement(link);

      if (link.data('remote') !== undefined) {
        if ( (e.metaKey || e.ctrlKey) && (!method || method === 'GET') && !data ) { return true; }

        var handleRemote = rails.handleRemote(link);
        // response from rails.handleRemote() will either be false or a deferred object promise.
        if (handleRemote === false) {
          rails.enableElement(link);
        } else {
          handleRemote.error( function() { rails.enableElement(link); } );
        }
        return false;

      } else if (link.data('method')) {
        rails.handleMethod(link);
        return false;
      }
    });

    $(document).delegate(rails.inputChangeSelector, 'change.rails', function(e) {
      var link = $(this);
      if (!rails.allowAction(link)) return rails.stopEverything(e);

      rails.handleRemote(link);
      return false;
    });

    $(document).delegate(rails.formSubmitSelector, 'submit.rails', function(e) {
      var form = $(this),
        remote = form.data('remote') !== undefined,
        blankRequiredInputs = rails.blankInputs(form, rails.requiredInputSelector),
        nonBlankFileInputs = rails.nonBlankInputs(form, rails.fileInputSelector);

      if (!rails.allowAction(form)) return rails.stopEverything(e);

      // skip other logic when required values are missing or file upload is present
      if (blankRequiredInputs && form.attr("novalidate") == undefined && rails.fire(form, 'ajax:aborted:required', [blankRequiredInputs])) {
        return rails.stopEverything(e);
      }

      if (remote) {
        if (nonBlankFileInputs) {
          // slight timeout so that the submit button gets properly serialized
          // (make it easy for event handler to serialize form without disabled values)
          setTimeout(function(){ rails.disableFormElements(form); }, 13);
          var aborted = rails.fire(form, 'ajax:aborted:file', [nonBlankFileInputs]);

          // re-enable form elements if event bindings return false (canceling normal form submission)
          if (!aborted) { setTimeout(function(){ rails.enableFormElements(form); }, 13); }

          return aborted;
        }

        // If browser does not support submit bubbling, then this live-binding will be called before direct
        // bindings. Therefore, we should directly call any direct bindings before remotely submitting form.
        if (!$.support.submitBubbles && $().jquery < '1.7' && rails.callFormSubmitBindings(form, e) === false) return rails.stopEverything(e);

        rails.handleRemote(form);
        return false;

      } else {
        // slight timeout so that the submit button gets properly serialized
        setTimeout(function(){ rails.disableFormElements(form); }, 13);
      }
    });

    $(document).delegate(rails.formInputClickSelector, 'click.rails', function(event) {
      var button = $(this);

      if (!rails.allowAction(button)) return rails.stopEverything(event);

      // register the pressed submit button
      var name = button.attr('name'),
        data = name ? {name:name, value:button.val()} : null;

      button.closest('form').data('ujs:submit-button', data);
    });

    $(document).delegate(rails.formSubmitSelector, 'ajax:beforeSend.rails', function(event) {
      if (this == event.target) rails.disableFormElements($(this));
    });

    $(document).delegate(rails.formSubmitSelector, 'ajax:complete.rails', function(event) {
      if (this == event.target) rails.enableFormElements($(this));
    });

    $(function(){
      // making sure that all forms have actual up-to-date token(cached forms contain old one)
      csrf_token = $('meta[name=csrf-token]').attr('content');
      csrf_param = $('meta[name=csrf-param]').attr('content');
      $('form input[name="' + csrf_param + '"]').val(csrf_token);
    });
  }

})( jQuery );
/* ===================================================
 * bootstrap-transition.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#transitions
 * ===================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  $(function () {

    "use strict"; // jshint ;_;


    /* CSS TRANSITION SUPPORT (http://www.modernizr.com/)
     * ======================================================= */

    $.support.transition = (function () {

      var transitionEnd = (function () {

        var el = document.createElement('bootstrap')
          , transEndEventNames = {
               'WebkitTransition' : 'webkitTransitionEnd'
            ,  'MozTransition'    : 'transitionend'
            ,  'OTransition'      : 'oTransitionEnd otransitionend'
            ,  'transition'       : 'transitionend'
            }
          , name

        for (name in transEndEventNames){
          if (el.style[name] !== undefined) {
            return transEndEventNames[name]
          }
        }

      }())

      return transitionEnd && {
        end: transitionEnd
      }

    })()

  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-alert.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#alerts
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* ALERT CLASS DEFINITION
  * ====================== */

  var dismiss = '[data-dismiss="alert"]'
    , Alert = function (el) {
        $(el).on('click', dismiss, this.close)
      }

  Alert.prototype.close = function (e) {
    var $this = $(this)
      , selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)

    e && e.preventDefault()

    $parent.length || ($parent = $this.hasClass('alert') ? $this : $this.parent())

    $parent.trigger(e = $.Event('close'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      $parent
        .trigger('closed')
        .remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent.on($.support.transition.end, removeElement) :
      removeElement()
  }


 /* ALERT PLUGIN DEFINITION
  * ======================= */

  $.fn.alert = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('alert')
      if (!data) $this.data('alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.alert.Constructor = Alert


 /* ALERT DATA-API
  * ============== */

  $(function () {
    $('body').on('click.alert.data-api', dismiss, Alert.prototype.close)
  })

}(window.jQuery);
/* =========================================================
 * bootstrap-modal.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#modals
 * =========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */



!function ($) {

  "use strict"; // jshint ;_;


 /* MODAL CLASS DEFINITION
  * ====================== */

  var Modal = function (element, options) {
    this.options = options
    this.$element = $(element)
      .delegate('[data-dismiss="modal"]', 'click.dismiss.modal', $.proxy(this.hide, this))
    this.options.remote && this.$element.find('.modal-body').load(this.options.remote)
  }

  Modal.prototype = {

      constructor: Modal

    , toggle: function () {
        return this[!this.isShown ? 'show' : 'hide']()
      }

    , show: function () {
        var that = this
          , e = $.Event('show')

        this.$element.trigger(e)

        if (this.isShown || e.isDefaultPrevented()) return

        $('body').addClass('modal-open')

        this.isShown = true

        this.escape()

        this.backdrop(function () {
          var transition = $.support.transition && that.$element.hasClass('fade')

          if (!that.$element.parent().length) {
            that.$element.appendTo(document.body) //don't move modals dom position
          }

          that.$element
            .show()

          if (transition) {
            that.$element[0].offsetWidth // force reflow
          }

          that.$element
            .addClass('in')
            .attr('aria-hidden', false)
            .focus()

          that.enforceFocus()

          transition ?
            that.$element.one($.support.transition.end, function () { that.$element.trigger('shown') }) :
            that.$element.trigger('shown')

        })
      }

    , hide: function (e) {
        e && e.preventDefault()

        var that = this

        e = $.Event('hide')

        this.$element.trigger(e)

        if (!this.isShown || e.isDefaultPrevented()) return

        this.isShown = false

        $('body').removeClass('modal-open')

        this.escape()

        $(document).off('focusin.modal')

        this.$element
          .removeClass('in')
          .attr('aria-hidden', true)

        $.support.transition && this.$element.hasClass('fade') ?
          this.hideWithTransition() :
          this.hideModal()
      }

    , enforceFocus: function () {
        var that = this
        $(document).on('focusin.modal', function (e) {
          if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
            that.$element.focus()
          }
        })
      }

    , escape: function () {
        var that = this
        if (this.isShown && this.options.keyboard) {
          this.$element.on('keyup.dismiss.modal', function ( e ) {
            e.which == 27 && that.hide()
          })
        } else if (!this.isShown) {
          this.$element.off('keyup.dismiss.modal')
        }
      }

    , hideWithTransition: function () {
        var that = this
          , timeout = setTimeout(function () {
              that.$element.off($.support.transition.end)
              that.hideModal()
            }, 500)

        this.$element.one($.support.transition.end, function () {
          clearTimeout(timeout)
          that.hideModal()
        })
      }

    , hideModal: function (that) {
        this.$element
          .hide()
          .trigger('hidden')

        this.backdrop()
      }

    , removeBackdrop: function () {
        this.$backdrop.remove()
        this.$backdrop = null
      }

    , backdrop: function (callback) {
        var that = this
          , animate = this.$element.hasClass('fade') ? 'fade' : ''

        if (this.isShown && this.options.backdrop) {
          var doAnimate = $.support.transition && animate

          this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
            .appendTo(document.body)

          if (this.options.backdrop != 'static') {
            this.$backdrop.click($.proxy(this.hide, this))
          }

          if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

          this.$backdrop.addClass('in')

          doAnimate ?
            this.$backdrop.one($.support.transition.end, callback) :
            callback()

        } else if (!this.isShown && this.$backdrop) {
          this.$backdrop.removeClass('in')

          $.support.transition && this.$element.hasClass('fade')?
            this.$backdrop.one($.support.transition.end, $.proxy(this.removeBackdrop, this)) :
            this.removeBackdrop()

        } else if (callback) {
          callback()
        }
      }
  }


 /* MODAL PLUGIN DEFINITION
  * ======================= */

  $.fn.modal = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('modal')
        , options = $.extend({}, $.fn.modal.defaults, $this.data(), typeof option == 'object' && option)
      if (!data) $this.data('modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option]()
      else if (options.show) data.show()
    })
  }

  $.fn.modal.defaults = {
      backdrop: true
    , keyboard: true
    , show: true
  }

  $.fn.modal.Constructor = Modal


 /* MODAL DATA-API
  * ============== */

  $(function () {
    $('body').on('click.modal.data-api', '[data-toggle="modal"]', function ( e ) {
      var $this = $(this)
        , href = $this.attr('href')
        , $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) //strip for ie7
        , option = $target.data('modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

      e.preventDefault()

      $target
        .modal(option)
        .one('hide', function () {
          $this.focus()
        })
    })
  })

}(window.jQuery);
/* ============================================================
 * bootstrap-dropdown.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#dropdowns
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function ($) {

  "use strict"; // jshint ;_;


 /* DROPDOWN CLASS DEFINITION
  * ========================= */

  var toggle = '[data-toggle=dropdown]'
    , Dropdown = function (element) {
        var $el = $(element).on('click.dropdown.data-api', this.toggle)
        $('html').on('click.dropdown.data-api', function () {
          $el.parent().removeClass('open')
        })
      }

  Dropdown.prototype = {

    constructor: Dropdown

  , toggle: function (e) {
      var $this = $(this)
        , $parent
        , isActive

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      clearMenus()

      if (!isActive) {
        $parent.toggleClass('open')
        $this.focus()
      }

      return false
    }

  , keydown: function (e) {
      var $this
        , $items
        , $active
        , $parent
        , isActive
        , index

      if (!/(38|40|27)/.test(e.keyCode)) return

      $this = $(this)

      e.preventDefault()
      e.stopPropagation()

      if ($this.is('.disabled, :disabled')) return

      $parent = getParent($this)

      isActive = $parent.hasClass('open')

      if (!isActive || (isActive && e.keyCode == 27)) return $this.click()

      $items = $('[role=menu] li:not(.divider) a', $parent)

      if (!$items.length) return

      index = $items.index($items.filter(':focus'))

      if (e.keyCode == 38 && index > 0) index--                                        // up
      if (e.keyCode == 40 && index < $items.length - 1) index++                        // down
      if (!~index) index = 0

      $items
        .eq(index)
        .focus()
    }

  }

  function clearMenus() {
    getParent($(toggle))
      .removeClass('open')
  }

  function getParent($this) {
    var selector = $this.attr('data-target')
      , $parent

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
    }

    $parent = $(selector)
    $parent.length || ($parent = $this.parent())

    return $parent
  }


  /* DROPDOWN PLUGIN DEFINITION
   * ========================== */

  $.fn.dropdown = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('dropdown')
      if (!data) $this.data('dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  $.fn.dropdown.Constructor = Dropdown


  /* APPLY TO STANDARD DROPDOWN ELEMENTS
   * =================================== */

  $(function () {
    $('html')
      .on('click.dropdown.data-api touchstart.dropdown.data-api', clearMenus)
    $('body')
      .on('click.dropdown touchstart.dropdown.data-api', '.dropdown', function (e) { e.stopPropagation() })
      .on('click.dropdown.data-api touchstart.dropdown.data-api'  , toggle, Dropdown.prototype.toggle)
      .on('keydown.dropdown.data-api touchstart.dropdown.data-api', toggle + ', [role=menu]' , Dropdown.prototype.keydown)
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-scrollspy.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#scrollspy
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* SCROLLSPY CLASS DEFINITION
  * ========================== */

  function ScrollSpy(element, options) {
    var process = $.proxy(this.process, this)
      , $element = $(element).is('body') ? $(window) : $(element)
      , href
    this.options = $.extend({}, $.fn.scrollspy.defaults, options)
    this.$scrollElement = $element.on('scroll.scroll-spy.data-api', process)
    this.selector = (this.options.target
      || ((href = $(element).attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
      || '') + ' .nav li > a'
    this.$body = $('body')
    this.refresh()
    this.process()
  }

  ScrollSpy.prototype = {

      constructor: ScrollSpy

    , refresh: function () {
        var self = this
          , $targets

        this.offsets = $([])
        this.targets = $([])

        $targets = this.$body
          .find(this.selector)
          .map(function () {
            var $el = $(this)
              , href = $el.data('target') || $el.attr('href')
              , $href = /^#\w/.test(href) && $(href)
            return ( $href
              && $href.length
              && [[ $href.position().top, href ]] ) || null
          })
          .sort(function (a, b) { return a[0] - b[0] })
          .each(function () {
            self.offsets.push(this[0])
            self.targets.push(this[1])
          })
      }

    , process: function () {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset
          , scrollHeight = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight
          , maxScroll = scrollHeight - this.$scrollElement.height()
          , offsets = this.offsets
          , targets = this.targets
          , activeTarget = this.activeTarget
          , i

        if (scrollTop >= maxScroll) {
          return activeTarget != (i = targets.last()[0])
            && this.activate ( i )
        }

        for (i = offsets.length; i--;) {
          activeTarget != targets[i]
            && scrollTop >= offsets[i]
            && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
            && this.activate( targets[i] )
        }
      }

    , activate: function (target) {
        var active
          , selector

        this.activeTarget = target

        $(this.selector)
          .parent('.active')
          .removeClass('active')

        selector = this.selector
          + '[data-target="' + target + '"],'
          + this.selector + '[href="' + target + '"]'

        active = $(selector)
          .parent('li')
          .addClass('active')

        if (active.parent('.dropdown-menu').length)  {
          active = active.closest('li.dropdown').addClass('active')
        }

        active.trigger('activate')
      }

  }


 /* SCROLLSPY PLUGIN DEFINITION
  * =========================== */

  $.fn.scrollspy = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('scrollspy')
        , options = typeof option == 'object' && option
      if (!data) $this.data('scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.scrollspy.Constructor = ScrollSpy

  $.fn.scrollspy.defaults = {
    offset: 10
  }


 /* SCROLLSPY DATA-API
  * ================== */

  $(window).on('load', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      $spy.scrollspy($spy.data())
    })
  })

}(window.jQuery);
/* ========================================================
 * bootstrap-tab.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#tabs
 * ========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ======================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* TAB CLASS DEFINITION
  * ==================== */

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.prototype = {

    constructor: Tab

  , show: function () {
      var $this = this.element
        , $ul = $this.closest('ul:not(.dropdown-menu)')
        , selector = $this.attr('data-target')
        , previous
        , $target
        , e

      if (!selector) {
        selector = $this.attr('href')
        selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') //strip for ie7
      }

      if ( $this.parent('li').hasClass('active') ) return

      previous = $ul.find('.active a').last()[0]

      e = $.Event('show', {
        relatedTarget: previous
      })

      $this.trigger(e)

      if (e.isDefaultPrevented()) return

      $target = $(selector)

      this.activate($this.parent('li'), $ul)
      this.activate($target, $target.parent(), function () {
        $this.trigger({
          type: 'shown'
        , relatedTarget: previous
        })
      })
    }

  , activate: function ( element, container, callback) {
      var $active = container.find('> .active')
        , transition = callback
            && $.support.transition
            && $active.hasClass('fade')

      function next() {
        $active
          .removeClass('active')
          .find('> .dropdown-menu > .active')
          .removeClass('active')

        element.addClass('active')

        if (transition) {
          element[0].offsetWidth // reflow for transition
          element.addClass('in')
        } else {
          element.removeClass('fade')
        }

        if ( element.parent('.dropdown-menu') ) {
          element.closest('li.dropdown').addClass('active')
        }

        callback && callback()
      }

      transition ?
        $active.one($.support.transition.end, next) :
        next()

      $active.removeClass('in')
    }
  }


 /* TAB PLUGIN DEFINITION
  * ===================== */

  $.fn.tab = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tab')
      if (!data) $this.data('tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tab.Constructor = Tab


 /* TAB DATA-API
  * ============ */

  $(function () {
    $('body').on('click.tab.data-api', '[data-toggle="tab"], [data-toggle="pill"]', function (e) {
      e.preventDefault()
      $(this).tab('show')
    })
  })

}(window.jQuery);
/* ===========================================================
 * bootstrap-tooltip.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#tooltips
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* TOOLTIP PUBLIC CLASS DEFINITION
  * =============================== */

  var Tooltip = function (element, options) {
    this.init('tooltip', element, options)
  }

  Tooltip.prototype = {

    constructor: Tooltip

  , init: function (type, element, options) {
      var eventIn
        , eventOut

      this.type = type
      this.$element = $(element)
      this.options = this.getOptions(options)
      this.enabled = true

      if (this.options.trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (this.options.trigger != 'manual') {
        eventIn = this.options.trigger == 'hover' ? 'mouseenter' : 'focus'
        eventOut = this.options.trigger == 'hover' ? 'mouseleave' : 'blur'
        this.$element.on(eventIn + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }

      this.options.selector ?
        (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
        this.fixTitle()
    }

  , getOptions: function (options) {
      options = $.extend({}, $.fn[this.type].defaults, options, this.$element.data())

      if (options.delay && typeof options.delay == 'number') {
        options.delay = {
          show: options.delay
        , hide: options.delay
        }
      }

      return options
    }

  , enter: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (!self.options.delay || !self.options.delay.show) return self.show()

      clearTimeout(this.timeout)
      self.hoverState = 'in'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'in') self.show()
      }, self.options.delay.show)
    }

  , leave: function (e) {
      var self = $(e.currentTarget)[this.type](this._options).data(this.type)

      if (this.timeout) clearTimeout(this.timeout)
      if (!self.options.delay || !self.options.delay.hide) return self.hide()

      self.hoverState = 'out'
      this.timeout = setTimeout(function() {
        if (self.hoverState == 'out') self.hide()
      }, self.options.delay.hide)
    }

  , show: function () {
      var $tip
        , inside
        , pos
        , actualWidth
        , actualHeight
        , placement
        , tp

      if (this.hasContent() && this.enabled) {
        $tip = this.tip()
        this.setContent()

        if (this.options.animation) {
          $tip.addClass('fade')
        }

        placement = typeof this.options.placement == 'function' ?
          this.options.placement.call(this, $tip[0], this.$element[0]) :
          this.options.placement

        inside = /in/.test(placement)

        $tip
          .remove()
          .css({ top: 0, left: 0, display: 'block' })
          .appendTo(inside ? this.$element : document.body)

        pos = this.getPosition(inside)

        actualWidth = $tip[0].offsetWidth
        actualHeight = $tip[0].offsetHeight

        switch (inside ? placement.split(' ')[1] : placement) {
          case 'bottom':
            tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'top':
            tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
            break
          case 'left':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
            break
          case 'right':
            tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
            break
        }

        $tip
          .css(tp)
          .addClass(placement)
          .addClass('in')
      }
    }

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()

      $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
      $tip.removeClass('fade in top bottom left right')
    }

  , hide: function () {
      var that = this
        , $tip = this.tip()

      $tip.removeClass('in')

      function removeWithAnimation() {
        var timeout = setTimeout(function () {
          $tip.off($.support.transition.end).remove()
        }, 500)

        $tip.one($.support.transition.end, function () {
          clearTimeout(timeout)
          $tip.remove()
        })
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        removeWithAnimation() :
        $tip.remove()

      return this
    }

  , fixTitle: function () {
      var $e = this.$element
      if ($e.attr('title') || typeof($e.attr('data-original-title')) != 'string') {
        $e.attr('data-original-title', $e.attr('title') || '').removeAttr('title')
      }
    }

  , hasContent: function () {
      return this.getTitle()
    }

  , getPosition: function (inside) {
      return $.extend({}, (inside ? {top: 0, left: 0} : this.$element.offset()), {
        width: this.$element[0].offsetWidth
      , height: this.$element[0].offsetHeight
      })
    }

  , getTitle: function () {
      var title
        , $e = this.$element
        , o = this.options

      title = $e.attr('data-original-title')
        || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

      return title
    }

  , tip: function () {
      return this.$tip = this.$tip || $(this.options.template)
    }

  , validate: function () {
      if (!this.$element[0].parentNode) {
        this.hide()
        this.$element = null
        this.options = null
      }
    }

  , enable: function () {
      this.enabled = true
    }

  , disable: function () {
      this.enabled = false
    }

  , toggleEnabled: function () {
      this.enabled = !this.enabled
    }

  , toggle: function () {
      this[this.tip().hasClass('in') ? 'hide' : 'show']()
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  }


 /* TOOLTIP PLUGIN DEFINITION
  * ========================= */

  $.fn.tooltip = function ( option ) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('tooltip')
        , options = typeof option == 'object' && option
      if (!data) $this.data('tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.tooltip.Constructor = Tooltip

  $.fn.tooltip.defaults = {
    animation: true
  , placement: 'top'
  , selector: false
  , template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'
  , trigger: 'hover'
  , title: ''
  , delay: 0
  , html: true
  }

}(window.jQuery);
/* ===========================================================
 * bootstrap-popover.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#popovers
 * ===========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* POPOVER PUBLIC CLASS DEFINITION
  * =============================== */

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }


  /* NOTE: POPOVER EXTENDS BOOTSTRAP-TOOLTIP.js
     ========================================== */

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {

    constructor: Popover

  , setContent: function () {
      var $tip = this.tip()
        , title = this.getTitle()
        , content = this.getContent()

      $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
      $tip.find('.popover-content > *')[this.options.html ? 'html' : 'text'](content)

      $tip.removeClass('fade top bottom left right in')
    }

  , hasContent: function () {
      return this.getTitle() || this.getContent()
    }

  , getContent: function () {
      var content
        , $e = this.$element
        , o = this.options

      content = $e.attr('data-content')
        || (typeof o.content == 'function' ? o.content.call($e[0]) :  o.content)

      return content
    }

  , tip: function () {
      if (!this.$tip) {
        this.$tip = $(this.options.template)
      }
      return this.$tip
    }

  , destroy: function () {
      this.hide().$element.off('.' + this.type).removeData(this.type)
    }

  })


 /* POPOVER PLUGIN DEFINITION
  * ======================= */

  $.fn.popover = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('popover')
        , options = typeof option == 'object' && option
      if (!data) $this.data('popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.popover.Constructor = Popover

  $.fn.popover.defaults = $.extend({} , $.fn.tooltip.defaults, {
    placement: 'right'
  , trigger: 'click'
  , content: ''
  , template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
  })

}(window.jQuery);
/* ============================================================
 * bootstrap-button.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#buttons
 * ============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function ($) {

  "use strict"; // jshint ;_;


 /* BUTTON PUBLIC CLASS DEFINITION
  * ============================== */

  var Button = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.button.defaults, options)
  }

  Button.prototype.setState = function (state) {
    var d = 'disabled'
      , $el = this.$element
      , data = $el.data()
      , val = $el.is('input') ? 'val' : 'html'

    state = state + 'Text'
    data.resetText || $el.data('resetText', $el[val]())

    $el[val](data[state] || this.options[state])

    // push to event loop to allow forms to submit
    setTimeout(function () {
      state == 'loadingText' ?
        $el.addClass(d).attr(d, d) :
        $el.removeClass(d).removeAttr(d)
    }, 0)
  }

  Button.prototype.toggle = function () {
    var $parent = this.$element.parent('[data-toggle="buttons-radio"]')

    $parent && $parent
      .find('.active')
      .removeClass('active')

    this.$element.toggleClass('active')
  }


 /* BUTTON PLUGIN DEFINITION
  * ======================== */

  $.fn.button = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('button')
        , options = typeof option == 'object' && option
      if (!data) $this.data('button', (data = new Button(this, options)))
      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  $.fn.button.defaults = {
    loadingText: 'loading...'
  }

  $.fn.button.Constructor = Button


 /* BUTTON DATA-API
  * =============== */

  $(function () {
    $('body').on('click.button.data-api', '[data-toggle^=button]', function ( e ) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      $btn.button('toggle')
    })
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-collapse.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#collapse
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function ($) {

  "use strict"; // jshint ;_;


 /* COLLAPSE PUBLIC CLASS DEFINITION
  * ================================ */

  var Collapse = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.collapse.defaults, options)

    if (this.options.parent) {
      this.$parent = $(this.options.parent)
    }

    this.options.toggle && this.toggle()
  }

  Collapse.prototype = {

    constructor: Collapse

  , dimension: function () {
      var hasWidth = this.$element.hasClass('width')
      return hasWidth ? 'width' : 'height'
    }

  , show: function () {
      var dimension
        , scroll
        , actives
        , hasData

      if (this.transitioning) return

      dimension = this.dimension()
      scroll = $.camelCase(['scroll', dimension].join('-'))
      actives = this.$parent && this.$parent.find('> .accordion-group > .in')

      if (actives && actives.length) {
        hasData = actives.data('collapse')
        if (hasData && hasData.transitioning) return
        actives.collapse('hide')
        hasData || actives.data('collapse', null)
      }

      this.$element[dimension](0)
      this.transition('addClass', $.Event('show'), 'shown')
      $.support.transition && this.$element[dimension](this.$element[0][scroll])
    }

  , hide: function () {
      var dimension
      if (this.transitioning) return
      dimension = this.dimension()
      this.reset(this.$element[dimension]())
      this.transition('removeClass', $.Event('hide'), 'hidden')
      this.$element[dimension](0)
    }

  , reset: function (size) {
      var dimension = this.dimension()

      this.$element
        .removeClass('collapse')
        [dimension](size || 'auto')
        [0].offsetWidth

      this.$element[size !== null ? 'addClass' : 'removeClass']('collapse')

      return this
    }

  , transition: function (method, startEvent, completeEvent) {
      var that = this
        , complete = function () {
            if (startEvent.type == 'show') that.reset()
            that.transitioning = 0
            that.$element.trigger(completeEvent)
          }

      this.$element.trigger(startEvent)

      if (startEvent.isDefaultPrevented()) return

      this.transitioning = 1

      this.$element[method]('in')

      $.support.transition && this.$element.hasClass('collapse') ?
        this.$element.one($.support.transition.end, complete) :
        complete()
    }

  , toggle: function () {
      this[this.$element.hasClass('in') ? 'hide' : 'show']()
    }

  }


 /* COLLAPSIBLE PLUGIN DEFINITION
  * ============================== */

  $.fn.collapse = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('collapse')
        , options = typeof option == 'object' && option
      if (!data) $this.data('collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.collapse.defaults = {
    toggle: true
  }

  $.fn.collapse.Constructor = Collapse


 /* COLLAPSIBLE DATA-API
  * ==================== */

  $(function () {
    $('body').on('click.collapse.data-api', '[data-toggle=collapse]', function (e) {
      var $this = $(this), href
        , target = $this.attr('data-target')
          || e.preventDefault()
          || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') //strip for ie7
        , option = $(target).data('collapse') ? 'toggle' : $this.data()
      $this[$(target).hasClass('in') ? 'addClass' : 'removeClass']('collapsed')
      $(target).collapse(option)
    })
  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-carousel.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#carousel
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* CAROUSEL CLASS DEFINITION
  * ========================= */

  var Carousel = function (element, options) {
    this.$element = $(element)
    this.options = options
    this.options.slide && this.slide(this.options.slide)
    this.options.pause == 'hover' && this.$element
      .on('mouseenter', $.proxy(this.pause, this))
      .on('mouseleave', $.proxy(this.cycle, this))
  }

  Carousel.prototype = {

    cycle: function (e) {
      if (!e) this.paused = false
      this.options.interval
        && !this.paused
        && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))
      return this
    }

  , to: function (pos) {
      var $active = this.$element.find('.item.active')
        , children = $active.parent().children()
        , activePos = children.index($active)
        , that = this

      if (pos > (children.length - 1) || pos < 0) return

      if (this.sliding) {
        return this.$element.one('slid', function () {
          that.to(pos)
        })
      }

      if (activePos == pos) {
        return this.pause().cycle()
      }

      return this.slide(pos > activePos ? 'next' : 'prev', $(children[pos]))
    }

  , pause: function (e) {
      if (!e) this.paused = true
      if (this.$element.find('.next, .prev').length && $.support.transition.end) {
        this.$element.trigger($.support.transition.end)
        this.cycle()
      }
      clearInterval(this.interval)
      this.interval = null
      return this
    }

  , next: function () {
      if (this.sliding) return
      return this.slide('next')
    }

  , prev: function () {
      if (this.sliding) return
      return this.slide('prev')
    }

  , slide: function (type, next) {
      var $active = this.$element.find('.item.active')
        , $next = next || $active[type]()
        , isCycling = this.interval
        , direction = type == 'next' ? 'left' : 'right'
        , fallback  = type == 'next' ? 'first' : 'last'
        , that = this
        , e = $.Event('slide', {
            relatedTarget: $next[0]
          })

      this.sliding = true

      isCycling && this.pause()

      $next = $next.length ? $next : this.$element.find('.item')[fallback]()

      if ($next.hasClass('active')) return

      if ($.support.transition && this.$element.hasClass('slide')) {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $next.addClass(type)
        $next[0].offsetWidth // force reflow
        $active.addClass(direction)
        $next.addClass(direction)
        this.$element.one($.support.transition.end, function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () { that.$element.trigger('slid') }, 0)
        })
      } else {
        this.$element.trigger(e)
        if (e.isDefaultPrevented()) return
        $active.removeClass('active')
        $next.addClass('active')
        this.sliding = false
        this.$element.trigger('slid')
      }

      isCycling && this.cycle()

      return this
    }

  }


 /* CAROUSEL PLUGIN DEFINITION
  * ========================== */

  $.fn.carousel = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('carousel')
        , options = $.extend({}, $.fn.carousel.defaults, typeof option == 'object' && option)
        , action = typeof option == 'string' ? option : options.slide
      if (!data) $this.data('carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.cycle()
    })
  }

  $.fn.carousel.defaults = {
    interval: 5000
  , pause: 'hover'
  }

  $.fn.carousel.Constructor = Carousel


 /* CAROUSEL DATA-API
  * ================= */

  $(function () {
    $('body').on('click.carousel.data-api', '[data-slide]', function ( e ) {
      var $this = $(this), href
        , $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) //strip for ie7
        , options = !$target.data('modal') && $.extend({}, $target.data(), $this.data())
      $target.carousel(options)
      e.preventDefault()
    })
  })

}(window.jQuery);
/* =============================================================
 * bootstrap-typeahead.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#typeahead
 * =============================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ============================================================ */



!function($){

  "use strict"; // jshint ;_;


 /* TYPEAHEAD PUBLIC CLASS DEFINITION
  * ================================= */

  var Typeahead = function (element, options) {
    this.$element = $(element)
    this.options = $.extend({}, $.fn.typeahead.defaults, options)
    this.matcher = this.options.matcher || this.matcher
    this.sorter = this.options.sorter || this.sorter
    this.highlighter = this.options.highlighter || this.highlighter
    this.updater = this.options.updater || this.updater
    this.$menu = $(this.options.menu).appendTo('body')
    this.source = this.options.source
    this.shown = false
    this.listen()
  }

  Typeahead.prototype = {

    constructor: Typeahead

  , select: function () {
      var val = this.$menu.find('.active').attr('data-value')
      this.$element
        .val(this.updater(val))
        .change()
      return this.hide()
    }

  , updater: function (item) {
      return item
    }

  , show: function () {
      var pos = $.extend({}, this.$element.offset(), {
        height: this.$element[0].offsetHeight
      })

      this.$menu.css({
        top: pos.top + pos.height
      , left: pos.left
      })

      this.$menu.show()
      this.shown = true
      return this
    }

  , hide: function () {
      this.$menu.hide()
      this.shown = false
      return this
    }

  , lookup: function (event) {
      var items

      this.query = this.$element.val()

      if (!this.query || this.query.length < this.options.minLength) {
        return this.shown ? this.hide() : this
      }

      items = $.isFunction(this.source) ? this.source(this.query, $.proxy(this.process, this)) : this.source

      return items ? this.process(items) : this
    }

  , process: function (items) {
      var that = this

      items = $.grep(items, function (item) {
        return that.matcher(item)
      })

      items = this.sorter(items)

      if (!items.length) {
        return this.shown ? this.hide() : this
      }

      return this.render(items.slice(0, this.options.items)).show()
    }

  , matcher: function (item) {
      return ~item.toLowerCase().indexOf(this.query.toLowerCase())
    }

  , sorter: function (items) {
      var beginswith = []
        , caseSensitive = []
        , caseInsensitive = []
        , item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(this.query.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(this.query)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }

  , highlighter: function (item) {
      var query = this.query.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + query + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }

  , render: function (items) {
      var that = this

      items = $(items).map(function (i, item) {
        i = $(that.options.item).attr('data-value', item)
        i.find('a').html(that.highlighter(item))
        return i[0]
      })

      items.first().addClass('active')
      this.$menu.html(items)
      return this
    }

  , next: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , next = active.next()

      if (!next.length) {
        next = $(this.$menu.find('li')[0])
      }

      next.addClass('active')
    }

  , prev: function (event) {
      var active = this.$menu.find('.active').removeClass('active')
        , prev = active.prev()

      if (!prev.length) {
        prev = this.$menu.find('li').last()
      }

      prev.addClass('active')
    }

  , listen: function () {
      this.$element
        .on('blur',     $.proxy(this.blur, this))
        .on('keypress', $.proxy(this.keypress, this))
        .on('keyup',    $.proxy(this.keyup, this))

      if ($.browser.webkit || $.browser.msie) {
        this.$element.on('keydown', $.proxy(this.keydown, this))
      }

      this.$menu
        .on('click', $.proxy(this.click, this))
        .on('mouseenter', 'li', $.proxy(this.mouseenter, this))
    }

  , move: function (e) {
      if (!this.shown) return

      switch(e.keyCode) {
        case 9: // tab
        case 13: // enter
        case 27: // escape
          e.preventDefault()
          break

        case 38: // up arrow
          e.preventDefault()
          this.prev()
          break

        case 40: // down arrow
          e.preventDefault()
          this.next()
          break
      }

      e.stopPropagation()
    }

  , keydown: function (e) {
      this.suppressKeyPressRepeat = !~$.inArray(e.keyCode, [40,38,9,13,27])
      this.move(e)
    }

  , keypress: function (e) {
      if (this.suppressKeyPressRepeat) return
      this.move(e)
    }

  , keyup: function (e) {
      switch(e.keyCode) {
        case 40: // down arrow
        case 38: // up arrow
          break

        case 9: // tab
        case 13: // enter
          if (!this.shown) return
          this.select()
          break

        case 27: // escape
          if (!this.shown) return
          this.hide()
          break

        default:
          this.lookup()
      }

      e.stopPropagation()
      e.preventDefault()
  }

  , blur: function (e) {
      var that = this
      setTimeout(function () { that.hide() }, 150)
    }

  , click: function (e) {
      e.stopPropagation()
      e.preventDefault()
      this.select()
    }

  , mouseenter: function (e) {
      this.$menu.find('.active').removeClass('active')
      $(e.currentTarget).addClass('active')
    }

  }


  /* TYPEAHEAD PLUGIN DEFINITION
   * =========================== */

  $.fn.typeahead = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('typeahead')
        , options = typeof option == 'object' && option
      if (!data) $this.data('typeahead', (data = new Typeahead(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.typeahead.defaults = {
    source: []
  , items: 8
  , menu: '<ul class="typeahead dropdown-menu"></ul>'
  , item: '<li><a href="#"></a></li>'
  , minLength: 1
  }

  $.fn.typeahead.Constructor = Typeahead


 /*   TYPEAHEAD DATA-API
  * ================== */

  $(function () {
    $('body').on('focus.typeahead.data-api', '[data-provide="typeahead"]', function (e) {
      var $this = $(this)
      if ($this.data('typeahead')) return
      e.preventDefault()
      $this.typeahead($this.data())
    })
  })

}(window.jQuery);
/* ==========================================================
 * bootstrap-affix.js v2.1.0
 * http://twitter.github.com/bootstrap/javascript.html#affix
 * ==========================================================
 * Copyright 2012 Twitter, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================== */



!function ($) {

  "use strict"; // jshint ;_;


 /* AFFIX CLASS DEFINITION
  * ====================== */

  var Affix = function (element, options) {
    this.options = $.extend({}, $.fn.affix.defaults, options)
    this.$window = $(window).on('scroll.affix.data-api', $.proxy(this.checkPosition, this))
    this.$element = $(element)
    this.checkPosition()
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var scrollHeight = $(document).height()
      , scrollTop = this.$window.scrollTop()
      , position = this.$element.offset()
      , offset = this.options.offset
      , offsetBottom = offset.bottom
      , offsetTop = offset.top
      , reset = 'affix affix-top affix-bottom'
      , affix

    if (typeof offset != 'object') offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function') offsetTop = offset.top()
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom()

    affix = this.unpin != null && (scrollTop + this.unpin <= position.top) ?
      false    : offsetBottom != null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ?
      'bottom' : offsetTop != null && scrollTop <= offsetTop ?
      'top'    : false

    if (this.affixed === affix) return

    this.affixed = affix
    this.unpin = affix == 'bottom' ? position.top - scrollTop : null

    this.$element.removeClass(reset).addClass('affix' + (affix ? '-' + affix : ''))
  }


 /* AFFIX PLUGIN DEFINITION
  * ======================= */

  $.fn.affix = function (option) {
    return this.each(function () {
      var $this = $(this)
        , data = $this.data('affix')
        , options = typeof option == 'object' && option
      if (!data) $this.data('affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  $.fn.affix.Constructor = Affix

  $.fn.affix.defaults = {
    offset: 0
  }


 /* AFFIX DATA-API
  * ============== */

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
        , data = $spy.data()

      data.offset = data.offset || {}

      data.offsetBottom && (data.offset.bottom = data.offsetBottom)
      data.offsetTop && (data.offset.top = data.offsetTop)

      $spy.affix(data)
    })
  })


}(window.jQuery);













(function() {

  jQuery(function() {
    $("a[rel=popover]").popover();
    $(".tooltip").tooltip();
    return $("a[rel=tooltip]").tooltip();
  });

}).call(this);
(function() {



}).call(this);
(function() {



}).call(this);
(function() {



}).call(this);
/*!
	StoryJS
	Designed and built by Zach Wise at VéritéCo

	This Source Code Form is subject to the terms of the Mozilla Public
	License, v. 2.0. If a copy of the MPL was not distributed with this
	file, You can obtain one at http://mozilla.org/MPL/2.0/.
*//* **********************************************
     Begin LazyLoad.js
********************************************** *//*jslint browser: true, eqeqeq: true, bitwise: true, newcap: true, immed: true, regexp: false *//*
LazyLoad makes it easy and painless to lazily load one or more external
JavaScript or CSS files on demand either during or after the rendering of a web
page.

Supported browsers include Firefox 2+, IE6+, Safari 3+ (including Mobile
Safari), Google Chrome, and Opera 9+. Other browsers may or may not work and
are not officially supported.

Visit https://github.com/rgrove/lazyload/ for more info.

Copyright (c) 2011 Ryan Grove <ryan@wonko.com>
All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the 'Software'), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

@module lazyload
@class LazyLoad
@static
@version 2.0.3 (git)
*/
function getEmbedScriptPath(e){var t=document.getElementsByTagName("script"),n="",r="";for(var i=0;i<t.length;i++)t[i].src.match(e)&&(n=t[i].src);n!=""&&(r="/");return n.split("?")[0].split("/").slice(0,-1).join("/")+r}function createStoryJS(e,t){function g(){LoadLib.js(h.js,y)}function y(){l.js=!0;h.lang!="en"?LazyLoad.js(c.locale,b):l.language=!0;x()}function b(){l.language=!0;x()}function w(){l.css=!0;x()}function E(){l.font.css=!0;x()}function S(){l.font.js=!0;x()}function x(){if(l.checks>40)return;l.checks++;if(l.js&&l.css&&l.font.css&&l.font.js&&l.language){if(!l.finished){l.finished=!0;N()}}else l.timeout=setTimeout("onloaded_check_again();",250)}function T(){var e="storyjs-embed";r=document.createElement("div");h.embed_id!=""?i=document.getElementById(h.embed_id):i=document.getElementById("timeline-embed");i.appendChild(r);r.setAttribute("id",h.id);if(h.width.toString().match("%"))i.style.width=h.width.split("%")[0]+"%";else{h.width=h.width-2;i.style.width=h.width+"px"}if(h.height.toString().match("%")){i.style.height=h.height;e+=" full-embed";i.style.height=h.height.split("%")[0]+"%"}else{e+=" sized-embed";h.height=h.height-16;i.style.height=h.height+"px"}i.setAttribute("class",e);i.setAttribute("className",e);r.style.position="relative"}function N(){VMM.debug=h.debug;n=new VMM.Timeline(h.id);n.init(h);o&&VMM.bindEvent(global,onHeadline,"HEADLINE")}var n,r,i,s,o=!1,u="2.17",a="1.7.1",f="",l={timeout:"",checks:0,finished:!1,js:!1,css:!1,jquery:!1,has_jquery:!1,language:!1,font:{css:!1,js:!1}},c={base:embed_path,css:embed_path+"css/",js:embed_path+"js/",locale:embed_path+"js/locale/",jquery:"http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js",font:{google:!1,css:embed_path+"css/themes/font/",js:"http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js"}},h={version:u,debug:!1,type:"timeline",id:"storyjs",embed_id:"timeline-embed",embed:!0,width:"100%",height:"100%",source:"https://docs.google.com/spreadsheet/pub?key=0Agl_Dv6iEbDadFYzRjJPUGktY0NkWXFUWkVIZDNGRHc&output=html",lang:"en",font:"default",css:c.css+"timeline.css?"+u,js:c.js+"timeline-min.js?"+u,api_keys:{google:"",flickr:"",twitter:""},gmap_key:""},p=[{name:"Merriweather-NewsCycle",google:["News+Cycle:400,700:latin","Merriweather:400,700,900:latin"]},{name:"NewsCycle-Merriweather",google:["News+Cycle:400,700:latin","Merriweather:300,400,700:latin"]},{name:"PoiretOne-Molengo",google:["Poiret+One::latin","Molengo::latin"]},{name:"Arvo-PTSans",google:["Arvo:400,700,400italic:latin","PT+Sans:400,700,400italic:latin"]},{name:"PTSerif-PTSans",google:["PT+Sans:400,700,400italic:latin","PT+Serif:400,700,400italic:latin"]},{name:"PT",google:["PT+Sans+Narrow:400,700:latin","PT+Sans:400,700,400italic:latin","PT+Serif:400,700,400italic:latin"]},{name:"DroidSerif-DroidSans",google:["Droid+Sans:400,700:latin","Droid+Serif:400,700,400italic:latin"]},{name:"Lekton-Molengo",google:["Lekton:400,700,400italic:latin","Molengo::latin"]},{name:"NixieOne-Ledger",google:["Nixie+One::latin","Ledger::latin"]},{name:"AbrilFatface-Average",google:["Average::latin","Abril+Fatface::latin"]},{name:"PlayfairDisplay-Muli",google:["Playfair+Display:400,400italic:latin","Muli:300,400,300italic,400italic:latin"]},{name:"Rancho-Gudea",google:["Rancho::latin","Gudea:400,700,400italic:latin"]},{name:"Bevan-PotanoSans",google:["Bevan::latin","Pontano+Sans::latin"]},{name:"BreeSerif-OpenSans",google:["Bree+Serif::latin","Open+Sans:300italic,400italic,600italic,700italic,800italic,400,300,600,700,800:latin"]},{name:"SansitaOne-Kameron",google:["Sansita+One::latin","Kameron:400,700:latin"]},{name:"Lora-Istok",google:["Lora:400,700,400italic,700italic:latin","Istok+Web:400,700,400italic,700italic:latin"]},{name:"Pacifico-Arimo",google:["Pacifico::latin","Arimo:400,700,400italic,700italic:latin"]}];if(typeof e=="object")for(s in e)Object.prototype.hasOwnProperty.call(e,s)&&(h[s]=e[s]);typeof t!="undefined"&&(h.source=t);if(typeof url_config=="object"){o=!0;h.source.match("docs.google.com")||h.source.match("json")||h.source.match("storify")||(h.source="https://docs.google.com/spreadsheet/pub?key="+h.source+"&output=html")}if(h.js.match("locale")){h.lang=h.js.split("locale/")[1].replace(".js","");h.js=c.js+"timeline-min.js?"+u}if(!h.js.match("/")){h.css=c.css+h.type+".css?"+u;h.js=c.js+h.type+"-min.js?"+u;h.id="storyjs-"+h.type}h.lang.match("/")?c.locale=h.lang:c.locale=c.locale+h.lang+".js?"+u;T();LoadLib.css(h.css,w);if(h.font=="default"){l.font.js=!0;l.font.css=!0}else{var d;if(h.font.match("/")){d=h.font.split(".css")[0].split("/");c.font.name=d[d.length-1];c.font.css=h.font}else{c.font.name=h.font;c.font.css=c.font.css+h.font+".css?"+u}LoadLib.css(c.font.css,E);for(var v=0;v<p.length;v++)if(c.font.name==p[v].name){c.font.google=!0;WebFontConfig={google:{families:p[v].google}}}c.font.google?LoadLib.js(c.font.js,S):l.font.js=!0}try{l.has_jquery=jQuery;l.has_jquery=!0;if(l.has_jquery){var f=parseFloat(jQuery.fn.jquery);f<parseFloat(a)?l.jquery=!1:l.jquery=!0}}catch(m){l.jquery=!1}l.jquery?g():LoadLib.js(c.jquery,g);this.onloaded_check_again=function(){x()}}LazyLoad=function(e){function u(t,n){var r=e.createElement(t),i;for(i in n)n.hasOwnProperty(i)&&r.setAttribute(i,n[i]);return r}function a(e){var t=r[e],n,o;if(t){n=t.callback;o=t.urls;o.shift();i=0;if(!o.length){n&&n.call(t.context,t.obj);r[e]=null;s[e].length&&l(e)}}}function f(){var n=navigator.userAgent;t={async:e.createElement("script").async===!0};(t.webkit=/AppleWebKit\//.test(n))||(t.ie=/MSIE/.test(n))||(t.opera=/Opera/.test(n))||(t.gecko=/Gecko\//.test(n))||(t.unknown=!0)}function l(i,o,l,p,d){var v=function(){a(i)},m=i==="css",g=[],y,b,w,E,S,x;t||f();if(o){o=typeof o=="string"?[o]:o.concat();if(m||t.async||t.gecko||t.opera)s[i].push({urls:o,callback:l,obj:p,context:d});else for(y=0,b=o.length;y<b;++y)s[i].push({urls:[o[y]],callback:y===b-1?l:null,obj:p,context:d})}if(r[i]||!(E=r[i]=s[i].shift()))return;n||(n=e.head||e.getElementsByTagName("head")[0]);S=E.urls;for(y=0,b=S.length;y<b;++y){x=S[y];if(m)w=t.gecko?u("style"):u("link",{href:x,rel:"stylesheet"});else{w=u("script",{src:x});w.async=!1}w.className="lazyload";w.setAttribute("charset","utf-8");if(t.ie&&!m)w.onreadystatechange=function(){if(/loaded|complete/.test(w.readyState)){w.onreadystatechange=null;v()}};else if(m&&(t.gecko||t.webkit))if(t.webkit){E.urls[y]=w.href;h()}else{w.innerHTML='@import "'+x+'";';c(w)}else w.onload=w.onerror=v;g.push(w)}for(y=0,b=g.length;y<b;++y)n.appendChild(g[y])}function c(e){var t;try{t=!!e.sheet.cssRules}catch(n){i+=1;i<200?setTimeout(function(){c(e)},50):t&&a("css");return}a("css")}function h(){var e=r.css,t;if(e){t=o.length;while(--t>=0)if(o[t].href===e.urls[0]){a("css");break}i+=1;e&&(i<200?setTimeout(h,50):a("css"))}}var t,n,r={},i=0,s={css:[],js:[]},o=e.styleSheets;return{css:function(e,t,n,r){l("css",e,t,n,r)},js:function(e,t,n,r){l("js",e,t,n,r)}}}(this.document);LoadLib=function(e){function n(e){var n=0,r=!1;for(n=0;n<t.length;n++)t[n]==e&&(r=!0);if(r)return!0;t.push(e);return!1}var t=[];return{css:function(e,t,r,i){n(e)||LazyLoad.css(e,t,r,i)},js:function(e,t,r,i){n(e)||LazyLoad.js(e,t,r,i)}}}(this.document);var WebFontConfig;if(typeof embed_path=="undefined"||typeof embed_path=="undefined")var embed_path=getEmbedScriptPath("storyjs-embed.js").split("js/")[0];(function(){typeof url_config=="object"?createStoryJS(url_config):typeof timeline_config=="object"?createStoryJS(timeline_config):typeof storyjs_config=="object"?createStoryJS(storyjs_config):typeof config=="object"&&createStoryJS(config)})();
(function() {



}).call(this);
/*!
	TimelineJS
	Version 2.17
	Designed and built by Zach Wise at VéritéCo

	This Source Code Form is subject to the terms of the Mozilla Public
	License, v. 2.0. If a copy of the MPL was not distributed with this
	file, You can obtain one at http://mozilla.org/MPL/2.0/.
	
*//* **********************************************
     Begin VMM.StoryJS.License.js
********************************************** *//*!
	StoryJS
	Designed and built by Zach Wise at VéritéCo

	This Source Code Form is subject to the terms of the Mozilla Public
	License, v. 2.0. If a copy of the MPL was not distributed with this
	file, You can obtain one at http://mozilla.org/MPL/2.0/.
*//* **********************************************
     Begin VMM.js
********************************************** *//**
	* VéritéCo JS Core
	* Designed and built by Zach Wise at VéritéCo zach@verite.co

	* This Source Code Form is subject to the terms of the Mozilla Public
	* License, v. 2.0. If a copy of the MPL was not distributed with this
	* file, You can obtain one at http://mozilla.org/MPL/2.0/.

*//*	Simple JavaScript Inheritance
	By John Resig http://ejohn.org/
	MIT Licensed.
================================================== */
function trace(e){VMM.debug&&(window.console?console.log(e):typeof jsTrace!="undefined"&&jsTrace.send(e))}function onYouTubePlayerAPIReady(){trace("GLOBAL YOUTUBE API CALLED");VMM.ExternalAPI.youtube.onAPIReady()}(function(){var e=!1,t=/xyz/.test(function(){xyz})?/\b_super\b/:/.*/;this.Class=function(){};Class.extend=function(n){function o(){!e&&this.init&&this.init.apply(this,arguments)}var r=this.prototype;e=!0;var i=new this;e=!1;for(var s in n)i[s]=typeof n[s]=="function"&&typeof r[s]=="function"&&t.test(n[s])?function(e,t){return function(){var n=this._super;this._super=r[e];var i=t.apply(this,arguments);this._super=n;return i}}(s,n[s]):n[s];o.prototype=i;o.prototype.constructor=o;o.extend=arguments.callee;return o}})();var global=function(){return this||(1,eval)("this")}();if(typeof VMM=="undefined"){var VMM=Class.extend({});VMM.debug=!0;VMM.master_config={init:function(){return this},sizes:{api:{width:0,height:0}},vp:"Pellentesque nibh felis, eleifend id, commodo in, interdum vitae, leo",api_keys_master:{flickr:"RAIvxHY4hE/Elm5cieh4X5ptMyDpj7MYIxziGxi0WGCcy1s+yr7rKQ==",google:"uQKadH1VMlCsp560gN2aOiMz4evWkl1s34yryl3F/9FJOsn+/948CbBUvKLN46U=",twitter:""},timers:{api:7e3},api:{pushques:[]},twitter:{active:!1,array:[],api_loaded:!1,que:[]},flickr:{active:!1,array:[],api_loaded:!1,que:[]},youtube:{active:!1,array:[],api_loaded:!1,que:[]},vimeo:{active:!1,array:[],api_loaded:!1,que:[]},webthumb:{active:!1,array:[],api_loaded:!1,que:[]},googlemaps:{active:!1,map_active:!1,places_active:!1,array:[],api_loaded:!1,que:[]},googledocs:{active:!1,array:[],api_loaded:!1,que:[]},googleplus:{active:!1,array:[],api_loaded:!1,que:[]},wikipedia:{active:!1,array:[],api_loaded:!1,que:[],tries:0},soundcloud:{active:!1,array:[],api_loaded:!1,que:[]}}.init();VMM.createElement=function(e,t,n,r,i){var s="";if(e!=null&&e!=""){s+="<"+e;n!=null&&n!=""&&(s+=" class='"+n+"'");r!=null&&r!=""&&(s+=" "+r);i!=null&&i!=""&&(s+=" style='"+i+"'");s+=">";t!=null&&t!=""&&(s+=t);s=s+"</"+e+">"}return s};VMM.createMediaElement=function(e,t,n){var r="",i=!1;r+="<div class='media'>";if(e!=null&&e!=""){valid=!0;r+="<img src='"+e+"'>";n!=null&&n!=""&&(r+=VMM.createElement("div",n,"credit"));t!=null&&t!=""&&(r+=VMM.createElement("div",t,"caption"))}r+="</div>";return r};VMM.hideUrlBar=function(){var e=window,t=e.document;if(!location.hash||!e.addEventListener){window.scrollTo(0,1);var n=1,r=setInterval(function(){if(t.body){clearInterval(r);n="scrollTop"in t.body?t.body.scrollTop:1;e.scrollTo(0,n===1?0:1)}},15);e.addEventListener("load",function(){setTimeout(function(){e.scrollTo(0,n===1?0:1)},0)},!1)}}}Array.prototype.remove=function(e,t){var n=this.slice((t||e)+1||this.length);this.length=e<0?this.length+e:e;return this.push.apply(this,n)};Date.prototype.getWeek=function(){var e=new Date(this.getFullYear(),0,1);return Math.ceil(((this-e)/864e5+e.getDay()+1)/7)};Date.prototype.getDayOfYear=function(){var e=new Date(this.getFullYear(),0,1);return Math.ceil((this-e)/864e5)};var is={Null:function(e){return e===null},Undefined:function(e){return e===undefined},nt:function(e){return e===null||e===undefined},Function:function(e){return typeof e=="function"?e.constructor.toString().match(/Function/)!==null:!1},String:function(e){return typeof e=="string"?!0:typeof e=="object"?e.constructor.toString().match(/string/i)!==null:!1},Array:function(e){return typeof e=="object"?e.constructor.toString().match(/array/i)!==null||e.length!==undefined:!1},Boolean:function(e){return typeof e=="boolean"?!0:typeof e=="object"?e.constructor.toString().match(/boolean/i)!==null:!1},Date:function(e){return typeof e=="date"?!0:typeof e=="object"?e.constructor.toString().match(/date/i)!==null:!1},HTML:function(e){return typeof e=="object"?e.constructor.toString().match(/html/i)!==null:!1},Number:function(e){return typeof e=="number"?!0:typeof e=="object"?e.constructor.toString().match(/Number/)!==null:!1},Object:function(e){return typeof e=="object"?e.constructor.toString().match(/object/i)!==null:!1},RegExp:function(e){return typeof e=="function"?e.constructor.toString().match(/regexp/i)!==null:!1}},type={of:function(e){for(var t in is)if(is[t](e))return t.toLowerCase()}};if(typeof VMM!="undefined"){VMM.smoothScrollTo=function(e,t,n){if(typeof jQuery!="undefined"){var r="easein",i=1e3;t!=null&&(t<1?i=1:i=Math.round(t));n!=null&&n!=""&&(r=n);jQuery(window).scrollTop()!=VMM.Lib.offset(e).top&&VMM.Lib.animate("html,body",i,r,{scrollTop:VMM.Lib.offset(e).top})}};VMM.attachElement=function(e,t){typeof jQuery!="undefined"&&jQuery(e).html(t)};VMM.appendElement=function(e,t){typeof jQuery!="undefined"&&jQuery(e).append(t)};VMM.getHTML=function(e){var t;if(typeof jQuery!="undefined"){t=jQuery(e).html();return t}};VMM.getElement=function(e,t){var n;if(typeof jQuery!="undefined"){t?n=jQuery(e).parent().get(0):n=jQuery(e).get(0);return n}};VMM.bindEvent=function(e,t,n,r){var i,s="click",o={};n!=null&&n!=""&&(s=n);o!=null&&o!=""&&(o=r);typeof jQuery!="undefined"&&jQuery(e).bind(s,o,t)};VMM.unbindEvent=function(e,t,n){var r,i="click",s={};n!=null&&n!=""&&(i=n);typeof jQuery!="undefined"&&jQuery(e).unbind(i,t)};VMM.fireEvent=function(e,t,n){var r,i="click",s=[];t!=null&&t!=""&&(i=t);n!=null&&n!=""&&(s=n);typeof jQuery!="undefined"&&jQuery(e).trigger(i,s)};VMM.getJSON=function(e,t,n){if(typeof jQuery!="undefined"){jQuery.ajaxSetup({timeout:3e3});if(VMM.Browser.browser=="Explorer"&&parseInt(VMM.Browser.version,10)>=7&&window.XDomainRequest){trace("IE JSON");var r=e;if(r.match("^http://"))return jQuery.getJSON(r,t,n);if(r.match("^https://")){r=r.replace("https://","http://");return jQuery.getJSON(r,t,n)}return jQuery.getJSON(e,t,n)}return jQuery.getJSON(e,t,n)}};VMM.parseJSON=function(e){if(typeof jQuery!="undefined")return jQuery.parseJSON(e)};VMM.appendAndGetElement=function(e,t,n,r){var i,s="<div>",o="",u="",a="";t!=null&&t!=""&&(s=t);n!=null&&n!=""&&(o=n);r!=null&&r!=""&&(u=r);if(typeof jQuery!="undefined"){i=jQuery(t);i.addClass(o);i.html(u);jQuery(e).append(i)}return i};VMM.Lib={init:function(){return this},hide:function(e,t){t!=null&&t!=""?typeof jQuery!="undefined"&&jQuery(e).hide(t):typeof jQuery!="undefined"&&jQuery(e).hide()},remove:function(e){typeof jQuery!="undefined"&&jQuery(e).remove()},detach:function(e){typeof jQuery!="undefined"&&jQuery(e).detach()},append:function(e,t){typeof jQuery!="undefined"&&jQuery(e).append(t)},prepend:function(e,t){typeof jQuery!="undefined"&&jQuery(e).prepend(t)},show:function(e,t){t!=null&&t!=""?typeof jQuery!="undefined"&&jQuery(e).show(t):typeof jQuery!="undefined"&&jQuery(e).show()},load:function(e,t,n){var r={elem:e};r!=null&&r!=""&&(r=n);typeof jQuery!="undefined"&&jQuery(e).load(r,t)},addClass:function(e,t){typeof jQuery!="undefined"&&jQuery(e).addClass(t)},removeClass:function(e,t){typeof jQuery!="undefined"&&jQuery(e).removeClass(t)},attr:function(e,t,n){if(n!=null&&n!="")typeof jQuery!="undefined"&&jQuery(e).attr(t,n);else if(typeof jQuery!="undefined")return jQuery(e).attr(t)},prop:function(e,t,n){typeof jQuery=="undefined"||!/[1-9]\.[3-9].[1-9]/.test(jQuery.fn.jquery)?VMM.Lib.attribute(e,t,n):jQuery(e).prop(t,n)},attribute:function(e,t,n){if(n!=null&&n!="")typeof jQuery!="undefined"&&jQuery(e).attr(t,n);else if(typeof jQuery!="undefined")return jQuery(e).attr(t)},visible:function(e,t){if(t!=null)typeof jQuery!="undefined"&&(t?jQuery(e).show(0):jQuery(e).hide(0));else if(typeof jQuery!="undefined")return jQuery(e).is(":visible")?!0:!1},css:function(e,t,n){if(n!=null&&n!="")typeof jQuery!="undefined"&&jQuery(e).css(t,n);else if(typeof jQuery!="undefined")return jQuery(e).css(t)},cssmultiple:function(e,t){if(typeof jQuery!="undefined")return jQuery(e).css(t)},offset:function(e){var t;typeof jQuery!="undefined"&&(t=jQuery(e).offset());return t},position:function(e){var t;typeof jQuery!="undefined"&&(t=jQuery(e).position());return t},width:function(e,t){if(t!=null&&t!="")typeof jQuery!="undefined"&&jQuery(e).width(t);else if(typeof jQuery!="undefined")return jQuery(e).width()},height:function(e,t){if(t!=null&&t!="")typeof jQuery!="undefined"&&jQuery(e).height(t);else if(typeof jQuery!="undefined")return jQuery(e).height()},toggleClass:function(e,t){typeof jQuery!="undefined"&&jQuery(e).toggleClass(t)},each:function(e,t){typeof jQuery!="undefined"&&jQuery(e).each(t)},html:function(e,t){var n;if(typeof jQuery!="undefined"){n=jQuery(e).html();return n}if(t!=null&&t!="")typeof jQuery!="undefined"&&jQuery(e).html(t);else{var n;if(typeof jQuery!="undefined"){n=jQuery(e).html();return n}}},find:function(e,t){if(typeof jQuery!="undefined")return jQuery(e).find(t)},stop:function(e){typeof jQuery!="undefined"&&jQuery(e).stop()},delay_animate:function(e,t,n,r,i,s){if(VMM.Browser.device=="mobile"||VMM.Browser.device=="tablet"){var o=Math.round(n/1500*10)/10,u=o+"s";VMM.Lib.css(t,"-webkit-transition","all "+u+" ease");VMM.Lib.css(t,"-moz-transition","all "+u+" ease");VMM.Lib.css(t,"-o-transition","all "+u+" ease");VMM.Lib.css(t,"-ms-transition","all "+u+" ease");VMM.Lib.css(t,"transition","all "+u+" ease");VMM.Lib.cssmultiple(t,_att)}else typeof jQuery!="undefined"&&jQuery(t).delay(e).animate(i,{duration:n,easing:r})},animate:function(e,t,n,r,i,s){var o="easein",u=!1,a=1e3,f={};t!=null&&(t<1?a=1:a=Math.round(t));n!=null&&n!=""&&(o=n);i!=null&&i!=""&&(u=i);r!=null?f=r:f={opacity:0};if(VMM.Browser.device=="mobile"||VMM.Browser.device=="tablet"){var l=Math.round(a/1500*10)/10,c=l+"s";o=" cubic-bezier(0.33, 0.66, 0.66, 1)";for(x in f)if(Object.prototype.hasOwnProperty.call(f,x)){trace(x+" to "+f[x]);VMM.Lib.css(e,"-webkit-transition",x+" "+c+o);VMM.Lib.css(e,"-moz-transition",x+" "+c+o);VMM.Lib.css(e,"-o-transition",x+" "+c+o);VMM.Lib.css(e,"-ms-transition",x+" "+c+o);VMM.Lib.css(e,"transition",x+" "+c+o)}VMM.Lib.cssmultiple(e,f)}else typeof jQuery!="undefined"&&(s!=null&&s!=""?jQuery(e).animate(f,{queue:u,duration:a,easing:o,complete:s}):jQuery(e).animate(f,{queue:u,duration:a,easing:o}))}}}if(typeof jQuery!="undefined"){(function(e){window.XDomainRequest&&e.ajaxTransport(function(t){if(t.crossDomain&&t.async){if(t.timeout){t.xdrTimeout=t.timeout;delete t.timeout}var n;return{send:function(r,i){function o(t,r,s,o){n.onload=n.onerror=n.ontimeout=e.noop;n=undefined;i(t,r,s,o)}n=new XDomainRequest;n.open(t.type,t.url);n.onload=function(){o(200,"OK",{text:n.responseText},"Content-Type: "+n.contentType)};n.onerror=function(){o(404,"Not Found")};if(t.xdrTimeout){n.ontimeout=function(){o(0,"timeout")};n.timeout=t.xdrTimeout}n.send(t.hasContent&&t.data||null)},abort:function(){if(n){n.onerror=e.noop();n.abort()}}}}})})(jQuery);jQuery.easing.jswing=jQuery.easing.swing;jQuery.extend(jQuery.easing,{def:"easeOutQuad",swing:function(e,t,n,r,i){return jQuery.easing[jQuery.easing.def](e,t,n,r,i)},easeInExpo:function(e,t,n,r,i){return t==0?n:r*Math.pow(2,10*(t/i-1))+n},easeOutExpo:function(e,t,n,r,i){return t==i?n+r:r*(-Math.pow(2,-10*t/i)+1)+n},easeInOutExpo:function(e,t,n,r,i){return t==0?n:t==i?n+r:(t/=i/2)<1?r/2*Math.pow(2,10*(t-1))+n:r/2*(-Math.pow(2,-10*--t)+2)+n},easeInQuad:function(e,t,n,r,i){return r*(t/=i)*t+n},easeOutQuad:function(e,t,n,r,i){return-r*(t/=i)*(t-2)+n},easeInOutQuad:function(e,t,n,r,i){return(t/=i/2)<1?r/2*t*t+n:-r/2*(--t*(t-2)-1)+n}})}if(typeof VMM!="undefined"&&typeof VMM.Browser=="undefined"){VMM.Browser={init:function(){this.browser=this.searchString(this.dataBrowser)||"An unknown browser";this.version=this.searchVersion(navigator.userAgent)||this.searchVersion(navigator.appVersion)||"an unknown version";this.OS=this.searchString(this.dataOS)||"an unknown OS";this.device=this.searchDevice(navigator.userAgent);this.orientation=this.searchOrientation(window.orientation)},searchOrientation:function(e){var t="";e==0||e==180?t="portrait":e==90||e==-90?t="landscape":t="normal";return t},searchDevice:function(e){var t="";e.match(/Android/i)||e.match(/iPhone|iPod/i)?t="mobile":e.match(/iPad/i)?t="tablet":e.match(/BlackBerry/i)||e.match(/IEMobile/i)?t="other mobile":t="desktop";return t},searchString:function(e){for(var t=0;t<e.length;t++){var n=e[t].string,r=e[t].prop;this.versionSearchString=e[t].versionSearch||e[t].identity;if(n){if(n.indexOf(e[t].subString)!=-1)return e[t].identity}else if(r)return e[t].identity}},searchVersion:function(e){var t=e.indexOf(this.versionSearchString);if(t==-1)return;return parseFloat(e.substring(t+this.versionSearchString.length+1))},dataBrowser:[{string:navigator.userAgent,subString:"Chrome",identity:"Chrome"},{string:navigator.userAgent,subString:"OmniWeb",versionSearch:"OmniWeb/",identity:"OmniWeb"},{string:navigator.vendor,subString:"Apple",identity:"Safari",versionSearch:"Version"},{prop:window.opera,identity:"Opera",versionSearch:"Version"},{string:navigator.vendor,subString:"iCab",identity:"iCab"},{string:navigator.vendor,subString:"KDE",identity:"Konqueror"},{string:navigator.userAgent,subString:"Firefox",identity:"Firefox"},{string:navigator.vendor,subString:"Camino",identity:"Camino"},{string:navigator.userAgent,subString:"Netscape",identity:"Netscape"},{string:navigator.userAgent,subString:"MSIE",identity:"Explorer",versionSearch:"MSIE"},{string:navigator.userAgent,subString:"Gecko",identity:"Mozilla",versionSearch:"rv"},{string:navigator.userAgent,subString:"Mozilla",identity:"Netscape",versionSearch:"Mozilla"}],dataOS:[{string:navigator.platform,subString:"Win",identity:"Windows"},{string:navigator.platform,subString:"Mac",identity:"Mac"},{string:navigator.userAgent,subString:"iPhone",identity:"iPhone/iPod"},{string:navigator.userAgent,subString:"iPad",identity:"iPad"},{string:navigator.platform,subString:"Linux",identity:"Linux"}]};VMM.Browser.init()}typeof VMM!="undefined"&&typeof VMM.FileExtention=="undefined"&&(VMM.FileExtention={googleDocType:function(e){var t=e.replace(/\s\s*$/,""),n="",r=["DOC","DOCX","XLS","XLSX","PPT","PPTX","PDF","PAGES","AI","PSD","TIFF","DXF","SVG","EPS","PS","TTF","XPS","ZIP","RAR"],i=!1;n=t.substr(t.length-5,5);for(var s=0;s<r.length;s++)if(n.toLowerCase().match(r[s].toString().toLowerCase())||t.match("docs.google.com"))i=!0;return i}});if(typeof VMM!="undefined"&&typeof VMM.Date=="undefined"){VMM.Date={init:function(){return this},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"mmm d',' yyyy 'at' hh:MM TT",full_long_small_date:"hh:MM TT'<br/><small>mmm d',' yyyy'</small>'"},month:["January","February","March","April","May","June","July","August","September","October","November","December"],month_abbr:["Jan.","Feb.","March","April","May","June","July","Aug.","Sept.","Oct.","Nov.","Dec."],day:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],day_abbr:["Sun.","Mon.","Tues.","Wed.","Thurs.","Fri.","Sat."],hour:[1,2,3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7,8,9,10,11,12],hour_suffix:["am"],bc_format:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"dddd', 'h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"dddd',' mmm d',' yyyy 'at' hh:MM TT",full_long_small_date:"hh:MM TT'<br/><small>'dddd',' mmm d',' yyyy'</small>'"},setLanguage:function(e){trace("SET DATE LANGUAGE");VMM.Date.dateformats=e.dateformats;VMM.Date.month=e.date.month;VMM.Date.month_abbr=e.date.month_abbr;VMM.Date.day=e.date.day;VMM.Date.day_abbr=e.date.day_abbr;dateFormat.i18n.dayNames=e.date.day_abbr.concat(e.date.day);dateFormat.i18n.monthNames=e.date.month_abbr.concat(e.date.month)},parse:function(e){"use strict";var t,n,r,i;if(type.of(e)=="date")t=e;else{t=new Date(0,0,1,0,0,0,0);if(e.match(/,/gi)){n=e.split(",");for(var s=0;s<n.length;s++)n[s]=parseInt(n[s],10);n[0]&&t.setFullYear(n[0]);n[1]>1&&t.setMonth(n[1]-1);n[2]>1&&t.setDate(n[2]);n[3]>1&&t.setHours(n[3]);n[4]>1&&t.setMinutes(n[4]);n[5]>1&&t.setSeconds(n[5]);n[6]>1&&t.setMilliseconds(n[6])}else if(e.match("/")){if(e.match(" ")){i=e.split(" ");if(e.match(":")){r=i[1].split(":");r[0]>=1&&t.setHours(r[0]);r[1]>=1&&t.setMinutes(r[1]);r[2]>=1&&t.setSeconds(r[2]);r[3]>=1&&t.setMilliseconds(r[3])}n=i[0].split("/")}else n=e.split("/");n[2]&&t.setFullYear(n[2]);n[0]>1&&t.setMonth(n[0]-1);n[1]>1&&t.setDate(n[1])}else if(e.match("now")){var o=new Date;t.setFullYear(o.getFullYear());t.setMonth(o.getMonth());t.setDate(o.getDate());e.match("hours")&&t.setHours(o.getHours());if(e.match("minutes")){t.setHours(o.getHours());t.setMinutes(o.getMinutes())}if(e.match("seconds")){t.setHours(o.getHours());t.setMinutes(o.getMinutes());t.setSeconds(o.getSeconds())}if(e.match("milliseconds")){t.setHours(o.getHours());t.setMinutes(o.getMinutes());t.setSeconds(o.getSeconds());t.setMilliseconds(o.getMilliseconds())}}else if(e.length<=5){t.setFullYear(parseInt(e,10));t.setMonth(0);t.setDate(1);t.setHours(0);t.setMinutes(0);t.setSeconds(0);t.setMilliseconds(0)}else if(e.match("T"))if(navigator.userAgent.match(/MSIE\s(?!9.0)/)){i=e.split("T");if(e.match(":")){r=_time_parse[1].split(":");r[0]>=1&&t.setHours(r[0]);r[1]>=1&&t.setMinutes(r[1]);r[2]>=1&&t.setSeconds(r[2]);r[3]>=1&&t.setMilliseconds(r[3])}_d_array=i[0].split("-");n[0]&&t.setFullYear(n[0]);n[1]>1&&t.setMonth(n[1]-1);n[2]>1&&t.setDate(n[2])}else t=new Date(Date.parse(e));else t=new Date(parseInt(e.slice(0,4),10),parseInt(e.slice(4,6),10)-1,parseInt(e.slice(6,8),10),parseInt(e.slice(8,10),10),parseInt(e.slice(10,12),10))}return t},prettyDate:function(e,t,n){var r,i,s,o,u=!1,a,f,l;n!=null&&(u=!0);if(type.of(e)=="date"){e.getMonth()===0&&e.getDate()==1&&e.getHours()===0&&e.getMinutes()===0?s=VMM.Date.dateformats.year:e.getDate()<=1&&e.getHours()===0&&e.getMinutes()===0?t?s=VMM.Date.dateformats.month_short:s=VMM.Date.dateformats.month:e.getHours()===0&&e.getMinutes()===0?t?s=VMM.Date.dateformats.full_short:s=VMM.Date.dateformats.full:e.getMinutes()===0?t?s=VMM.Date.dateformats.time_no_seconds_short:s=VMM.Date.dateformats.time_no_seconds_small_date:t?s=VMM.Date.dateformats.time_no_seconds_short:s=VMM.Date.dateformats.full_long;r=dateFormat(e,s,!1);o=r.split(" ");for(var c=0;c<o.length;c++)if(parseInt(o[c],10)<0){trace("YEAR IS BC");a=o[c];f=Math.abs(parseInt(o[c],10));l=f.toString()+" B.C.";r=r.replace(a,l)}if(u){i=dateFormat(n,s);o=i.split(" ");for(var h=0;h<o.length;h++)if(parseInt(o[h],10)<0){trace("YEAR IS BC");a=o[h];f=Math.abs(parseInt(o[h],10));l=f.toString()+" B.C.";i=i.replace(a,l)}}}else{trace("NOT A VALID DATE?");trace(e)}return u?r+" &mdash; "+i:r}}.init();var dateFormat=function(){var e=/d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,t=/\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,n=/[^-+\dA-Z]/g,r=function(e,t){e=String(e);t=t||2;while(e.length<t)e="0"+e;return e};return function(i,s,o){var u=dateFormat;if(arguments.length==1&&Object.prototype.toString.call(i)=="[object String]"&&!/\d/.test(i)){s=i;i=undefined}isNaN(i)&&trace("invalid date "+i);s=String(u.masks[s]||s||u.masks["default"]);if(s.slice(0,4)=="UTC:"){s=s.slice(4);o=!0}var a=o?"getUTC":"get",f=i[a+"Date"](),l=i[a+"Day"](),c=i[a+"Month"](),h=i[a+"FullYear"](),p=i[a+"Hours"](),d=i[a+"Minutes"](),v=i[a+"Seconds"](),m=i[a+"Milliseconds"](),g=o?0:i.getTimezoneOffset(),y={d:f,dd:r(f),ddd:u.i18n.dayNames[l],dddd:u.i18n.dayNames[l+7],m:c+1,mm:r(c+1),mmm:u.i18n.monthNames[c],mmmm:u.i18n.monthNames[c+12],yy:String(h).slice(2),yyyy:h,h:p%12||12,hh:r(p%12||12),H:p,HH:r(p),M:d,MM:r(d),s:v,ss:r(v),l:r(m,3),L:r(m>99?Math.round(m/10):m),t:p<12?"a":"p",tt:p<12?"am":"pm",T:p<12?"A":"P",TT:p<12?"AM":"PM",Z:o?"UTC":(String(i).match(t)||[""]).pop().replace(n,""),o:(g>0?"-":"+")+r(Math.floor(Math.abs(g)/60)*100+Math.abs(g)%60,4),S:["th","st","nd","rd"][f%10>3?0:(f%100-f%10!=10)*f%10]};return s.replace(e,function(e){return e in y?y[e]:e.slice(1,e.length-1)})}}();dateFormat.masks={"default":"ddd mmm dd yyyy HH:MM:ss",shortDate:"m/d/yy",mediumDate:"mmm d, yyyy",longDate:"mmmm d, yyyy",fullDate:"dddd, mmmm d, yyyy",shortTime:"h:MM TT",mediumTime:"h:MM:ss TT",longTime:"h:MM:ss TT Z",isoDate:"yyyy-mm-dd",isoTime:"HH:MM:ss",isoDateTime:"yyyy-mm-dd'T'HH:MM:ss",isoUtcDateTime:"UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"};dateFormat.i18n={dayNames:["Sun","Mon","Tue","Wed","Thu","Fri","Sat","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],monthNames:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","January","February","March","April","May","June","July","August","September","October","November","December"]};Date.prototype.format=function(e,t){return dateFormat(this,e,t)}}typeof VMM!="undefined"&&typeof VMM.Util=="undefined"&&(VMM.Util={init:function(){return this},correctProtocol:function(e){var t=window.parent.location.protocol.toString(),n="",r=e.split("://",2);t.match("http")?n=t:n="https";return n+"://"+r[1]},mergeConfig:function(e,t){var n;for(n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e},getObjectAttributeByIndex:function(e,t){if(typeof e!="undefined"){var n=0;for(var r in e){if(t===n)return e[r];n++}return""}return""},ordinal:function(e){return["th","st","nd","rd"][!(e%10>3||Math.floor(e%100/10)==1)*(e%10)]},randomBetween:function(e,t){return Math.floor(Math.random()*(t-e+1)+e)},average:function(e){var t={mean:0,variance:0,deviation:0},n=e.length;for(var r,i=0,s=n;s--;i+=e[s]);for(r=t.mean=i/n,s=n,i=0;s--;i+=Math.pow(e[s]-r,2));return t.deviation=Math.sqrt(t.variance=i/n),t},customSort:function(e,t){var n=e,r=t;return n==r?0:n>r?1:-1},deDupeArray:function(e){var t,n=e.length,r=[],i={};for(t=0;t<n;t++)i[e[t]]=0;for(t in i)r.push(t);return r},number2money:function(e,t,n){var t=t!==null?t:!0,n=n!==null?n:!1,r=VMM.Math2.floatPrecision(e,2),i=this.niceNumber(r);!i.split(/\./g)[1]&&n&&(i+=".00");t&&(i="$"+i);return i},wordCount:function(e){var t=e+" ",n=/^[^A-Za-z0-9\'\-]+/gi,r=t.replace(n,""),i=/[^A-Za-z0-9\'\-]+/gi,s=r.replace(i," "),o=s.split(" "),u=o.length-1;t.length<2&&(u=0);return u},ratio:{fit:function(e,t,n,r){var i={width:0,height:0};i.width=e;i.height=Math.round(e/n*r);if(i.height>t){i.height=t;i.width=Math.round(t/r*n);i.width>e&&trace("FIT: DIDN'T FIT!!! ")}return i},r16_9:function(e,t){if(e!==null&&e!=="")return Math.round(t/16*9);if(t!==null&&t!=="")return Math.round(e/9*16)},r4_3:function(e,t){if(e!==null&&e!=="")return Math.round(t/4*3);if(t!==null&&t!=="")return Math.round(e/3*4)}},doubledigit:function(e){return(e<10?"0":"")+e},truncateWords:function(e,t,n){t||(t=30);n||(n=t);var r=/^[^A-Za-z0-9\'\-]+/gi,i=e.replace(r,""),s=i.split(" "),o=[];t=Math.min(s.length,t);n=Math.min(s.length,n);for(var u=0;u<t;u++)o.push(s[u]);for(var a=t;u<n;u++){var f=s[u];o.push(f);if(f.charAt(f.length-1)==".")break}return o.join(" ")},linkify:function(e,t,n){var r=/\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim,i=/(^|[^\/])(www\.[\S]+(\b|$))/gim,s=/(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim;return e.replace(r,"<a target='_blank' href='$&' onclick='void(0)'>$&</a>").replace(i,"$1<a target='_blank' onclick='void(0)' href='http://$2'>$2</a>").replace(s,"<a target='_blank' onclick='void(0)' href='mailto:$1'>$1</a>")},linkify_with_twitter:function(e,t,n){function u(e){var t=/(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])/ig;return e.replace(t,"<a href='$1' target='_blank'>$3</a>")}var r=/\b(?:https?|ftp):\/\/[a-z0-9-+&@#\/%?=~_|!:,.;]*[a-z0-9-+&@#\/%=~_|]/gim,i=/(\()((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\))|(\[)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\])|(\{)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\})|(<|&(?:lt|#60|#x3c);)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(>|&(?:gt|#62|#x3e);)|((?:^|[^=\s'"\]])\s*['"]?|[^=\s]\s+)(\b(?:ht|f)tps?:\/\/[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]+(?:(?!&(?:gt|#0*62|#x0*3e);|&(?:amp|apos|quot|#0*3[49]|#x0*2[27]);[.!&',:?;]?(?:[^a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]|$))&[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]*)*[a-z0-9\-_~$()*+=\/#[\]@%])/img,s='$1$4$7$10$13<a href="$2$5$8$11$14" class="hyphenate">$2$5$8$11$14</a>$3$6$9$12',o=/(^|[^\/])(www\.[\S]+(\b|$))/gim,a=/(([a-zA-Z0-9_\-\.]+)@[a-zA-Z_]+?(?:\.[a-zA-Z]{2,6}))+/gim,f=/\B@([\w-]+)/gm,l=/(#([\w]+))/g;return e.replace(i,s).replace(o,"$1<a target='_blank' class='hyphenate' onclick='void(0)' href='http://$2'>$2</a>").replace(a,"<a target='_blank' onclick='void(0)' href='mailto:$1'>$1</a>").replace(f,"<a href='http://twitter.com/$1' target='_blank' onclick='void(0)'>@$1</a>").replace(l,"<a href='http://twitter.com/#search?q=%23$2' target='_blank' 'void(0)'>$1</a>")},linkify_wikipedia:function(e){var t=/<i[^>]*>(.*?)<\/i>/gim;return e.replace(t,"<a target='_blank' href='http://en.wikipedia.org/wiki/$&' onclick='void(0)'>$&</a>").replace(/<i\b[^>]*>/gim,"").replace(/<\/i>/gim,"").replace(/<b\b[^>]*>/gim,"").replace(/<\/b>/gim,"")},unlinkify:function(e){if(!e)return e;e=e.replace(/<a\b[^>]*>/i,"");e=e.replace(/<\/a>/i,"");return e},untagify:function(e){if(!e)return e;e=e.replace(/<\s*\w.*?>/g,"");return e},nl2br:function(e){return e.replace(/(\r\n|[\r\n]|\\n|\\r)/g,"<br/>")},unique_ID:function(e){var t=function(e){return Math.floor(Math.random()*e)},n=function(){var e="abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";return e.substr(t(62),1)},r=function(e){var t="";for(var r=0;r<e;r++)t+=n();return t};return r(e)},isEven:function(e){return e%2===0?!0:!1},getUrlVars:function(e){var t=e.toString();t.match("&#038;")?t=t.replace("&#038;","&"):t.match("&#38;")?t=t.replace("&#38;","&"):t.match("&amp;")&&(t=t.replace("&amp;","&"));var n=[],r,i=t.slice(t.indexOf("?")+1).split("&");for(var s=0;s<i.length;s++){r=i[s].split("=");n.push(r[0]);n[r[0]]=r[1]}return n},toHTML:function(e){e=this.nl2br(e);e=this.linkify(e);return e.replace(/\s\s/g,"&nbsp;&nbsp;")},toCamelCase:function(e,t){t!==!1&&(t=!0);var n=(t?e.toLowerCase():e).split(" ");for(var r=0;r<n.length;r++)n[r]=n[r].substr(0,1).toUpperCase()+n[r].substr(1);return n.join(" ")},properQuotes:function(e){return e.replace(/\"([^\"]*)\"/gi,"&#8220;$1&#8221;")},niceNumber:function(e){e+="";x=e.split(".");x1=x[0];x2=x.length>1?"."+x[1]:"";var t=/(\d+)(\d{3})/;while(t.test(x1))x1=x1.replace(t,"$1,$2");return x1+x2},toTitleCase:function(e){if(VMM.Browser.browser=="Explorer"&&parseInt(VMM.Browser.version,10)>=7)return e.replace("_","%20");var t={__smallWords:["a","an","and","as","at","but","by","en","for","if","in","of","on","or","the","to","v[.]?","via","vs[.]?"],init:function(){this.__smallRE=this.__smallWords.join("|");this.__lowerCaseWordsRE=new RegExp("\\b("+this.__smallRE+")\\b","gi");this.__firstWordRE=new RegExp("^([^a-zA-Z0-9 \\r\\n\\t]*)("+this.__smallRE+")\\b","gi");this.__lastWordRE=new RegExp("\\b("+this.__smallRE+")([^a-zA-Z0-9 \\r\\n\\t]*)$","gi")},toTitleCase:function(e){var t="",n=e.split(/([:.;?!][ ]|(?:[ ]|^)["“])/);for(var r=0;r<n.length;++r){var i=n[r];i=i.replace(/\b([a-zA-Z][a-z.'’]*)\b/g,this.__titleCaseDottedWordReplacer);i=i.replace(this.__lowerCaseWordsRE,this.__lowerReplacer);i=i.replace(this.__firstWordRE,this.__firstToUpperCase);i=i.replace(this.__lastWordRE,this.__firstToUpperCase);t+=i}t=t.replace(/ V(s?)\. /g," v$1. ");t=t.replace(/(['’])S\b/g,"$1s");t=t.replace(/\b(AT&T|Q&A)\b/ig,this.__upperReplacer);return t},__titleCaseDottedWordReplacer:function(e){return e.match(/[a-zA-Z][.][a-zA-Z]/)?e:t.__firstToUpperCase(e)},__lowerReplacer:function(e){return e.toLowerCase()},__upperReplacer:function(e){return e.toUpperCase()},__firstToUpperCase:function(e){var t=e.split(/(^[^a-zA-Z0-9]*[a-zA-Z0-9])(.*)$/);t[1]&&(t[1]=t[1].toUpperCase());return t.join("")}};t.init();e=e.replace(/_/g," ");e=t.toTitleCase(e);return e}}.init());LazyLoad=function(e){function u(t,n){var r=e.createElement(t),i;for(i in n)n.hasOwnProperty(i)&&r.setAttribute(i,n[i]);return r}function a(e){var t=r[e],n,o;if(t){n=t.callback;o=t.urls;o.shift();i=0;if(!o.length){n&&n.call(t.context,t.obj);r[e]=null;s[e].length&&l(e)}}}function f(){var n=navigator.userAgent;t={async:e.createElement("script").async===!0};(t.webkit=/AppleWebKit\//.test(n))||(t.ie=/MSIE/.test(n))||(t.opera=/Opera/.test(n))||(t.gecko=/Gecko\//.test(n))||(t.unknown=!0)}function l(i,o,l,p,d){var v=function(){a(i)},m=i==="css",g=[],y,b,w,E,S,x;t||f();if(o){o=typeof o=="string"?[o]:o.concat();if(m||t.async||t.gecko||t.opera)s[i].push({urls:o,callback:l,obj:p,context:d});else for(y=0,b=o.length;y<b;++y)s[i].push({urls:[o[y]],callback:y===b-1?l:null,obj:p,context:d})}if(r[i]||!(E=r[i]=s[i].shift()))return;n||(n=e.head||e.getElementsByTagName("head")[0]);S=E.urls;for(y=0,b=S.length;y<b;++y){x=S[y];if(m)w=t.gecko?u("style"):u("link",{href:x,rel:"stylesheet"});else{w=u("script",{src:x});w.async=!1}w.className="lazyload";w.setAttribute("charset","utf-8");if(t.ie&&!m)w.onreadystatechange=function(){if(/loaded|complete/.test(w.readyState)){w.onreadystatechange=null;v()}};else if(m&&(t.gecko||t.webkit))if(t.webkit){E.urls[y]=w.href;h()}else{w.innerHTML='@import "'+x+'";';c(w)}else w.onload=w.onerror=v;g.push(w)}for(y=0,b=g.length;y<b;++y)n.appendChild(g[y])}function c(e){var t;try{t=!!e.sheet.cssRules}catch(n){i+=1;i<200?setTimeout(function(){c(e)},50):t&&a("css");return}a("css")}function h(){var e=r.css,t;if(e){t=o.length;while(--t>=0)if(o[t].href===e.urls[0]){a("css");break}i+=1;e&&(i<200?setTimeout(h,50):a("css"))}}var t,n,r={},i=0,s={css:[],js:[]},o=e.styleSheets;return{css:function(e,t,n,r){l("css",e,t,n,r)},js:function(e,t,n,r){l("js",e,t,n,r)}}}(this.document);LoadLib=function(e){function n(e){var n=0,r=!1;for(n=0;n<t.length;n++)t[n]==e&&(r=!0);if(r)return!0;t.push(e);return!1}var t=[];return{css:function(e,t,r,i){n(e)||LazyLoad.css(e,t,r,i)},js:function(e,t,r,i){n(e)||LazyLoad.js(e,t,r,i)}}}(this.document);typeof VMM!="undefined"&&typeof VMM.Language=="undefined"&&(VMM.Language={lang:"en",api:{wikipedia:"en"},date:{month:["January","February","March","April","May","June","July","August","September","October","November","December"],month_abbr:["Jan.","Feb.","March","April","May","June","July","Aug.","Sept.","Oct.","Nov.","Dec."],day:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],day_abbr:["Sun.","Mon.","Tues.","Wed.","Thurs.","Fri.","Sat."]},dateformats:{year:"yyyy",month_short:"mmm",month:"mmmm yyyy",full_short:"mmm d",full:"mmmm d',' yyyy",time_no_seconds_short:"h:MM TT",time_no_seconds_small_date:"h:MM TT'<br/><small>'mmmm d',' yyyy'</small>'",full_long:"mmm d',' yyyy 'at' h:MM TT",full_long_small_date:"h:MM TT'<br/><small>mmm d',' yyyy'</small>'"},messages:{loading_timeline:"Loading Timeline... ",return_to_title:"Return to Title",expand_timeline:"Expand Timeline",contract_timeline:"Contract Timeline",wikipedia:"From Wikipedia, the free encyclopedia",loading_content:"Loading Content",loading:"Loading"}});typeof VMM!="undefined"&&typeof VMM.ExternalAPI=="undefined"&&(VMM.ExternalAPI={keys:{google:"",flickr:"",twitter:""},keys_master:{vp:"Pellentesque nibh felis, eleifend id, commodo in, interdum vitae, leo",flickr:"RAIvxHY4hE/Elm5cieh4X5ptMyDpj7MYIxziGxi0WGCcy1s+yr7rKQ==",google:"jwNGnYw4hE9lmAez4ll0QD+jo6SKBJFknkopLS4FrSAuGfIwyj57AusuR0s8dAo=",twitter:""},init:function(){return this},setKeys:function(e){VMM.ExternalAPI.keys=e},pushQues:function(){VMM.master_config.googlemaps.active&&VMM.ExternalAPI.googlemaps.pushQue();VMM.master_config.youtube.active&&VMM.ExternalAPI.youtube.pushQue();VMM.master_config.soundcloud.active&&VMM.ExternalAPI.soundcloud.pushQue();VMM.master_config.googledocs.active&&VMM.ExternalAPI.googledocs.pushQue();VMM.master_config
.googleplus.active&&VMM.ExternalAPI.googleplus.pushQue();VMM.master_config.wikipedia.active&&VMM.ExternalAPI.wikipedia.pushQue();VMM.master_config.vimeo.active&&VMM.ExternalAPI.vimeo.pushQue();VMM.master_config.twitter.active&&VMM.ExternalAPI.twitter.pushQue();VMM.master_config.flickr.active&&VMM.ExternalAPI.flickr.pushQue();VMM.master_config.webthumb.active&&VMM.ExternalAPI.webthumb.pushQue()},twitter:{tweetArray:[],get:function(e){var t={mid:e.id,id:e.uid};VMM.master_config.twitter.que.push(t);VMM.master_config.twitter.active=!0},create:function(e,t){var n=e.mid.toString(),r={twitterid:e.mid},i="http://api.twitter.com/1/statuses/show.json?id="+e.mid+"&include_entities=true&callback=?",s=setTimeout(VMM.ExternalAPI.twitter.errorTimeOut,VMM.master_config.timers.api,e),o=setTimeout(t,VMM.master_config.timers.api,e);VMM.getJSON(i,function(t){var n=t.id_str,r="<blockquote><p>",i=VMM.Util.linkify_with_twitter(t.text,"_blank");r+=i;r+="</p></blockquote>";typeof t.entities.media!="undefined"&&t.entities.media[0].type=="photo";r+="<div class='vcard author'>";r+="<a class='screen-name url' href='https://twitter.com/"+t.user.screen_name+"' data-screen-name='"+t.user.screen_name+"' target='_blank'>";r+="<span class='avatar'><img src=' "+t.user.profile_image_url+"'  alt=''></span>";r+="<span class='fn'>"+t.user.name+"</span>";r+="<span class='nickname'>@"+t.user.screen_name+"<span class='thumbnail-inline'></span></span>";r+="</a>";r+="</div>";VMM.attachElement("#"+e.id.toString(),r);VMM.attachElement("#text_thumb_"+e.id.toString(),t.text);VMM.attachElement("#marker_content_"+e.id.toString(),t.text)}).error(function(t,n,r){trace("TWITTER error");trace("TWITTER ERROR: "+n+" "+t.responseText);VMM.attachElement("#"+e.id,VMM.MediaElement.loadingmessage("ERROR LOADING TWEET "+e.mid))}).success(function(e){clearTimeout(s);clearTimeout(o);t()})},errorTimeOut:function(e){trace("TWITTER JSON ERROR TIMEOUT "+e.mid);VMM.attachElement("#"+e.id.toString(),VMM.MediaElement.loadingmessage("Still waiting on Twitter: "+e.mid));VMM.getJSON("http://api.twitter.com/1/account/rate_limit_status.json",function(t){trace("REMAINING TWITTER API CALLS "+t.remaining_hits);trace("TWITTER RATE LIMIT WILL RESET AT "+t.reset_time);var n="";if(t.remaining_hits==0){n="<p>You've reached the maximum number of tweets you can load in an hour.</p>";n+="<p>You can view tweets again starting at: <br/>"+t.reset_time+"</p>"}else n="<p>Still waiting on Twitter. "+e.mid+"</p>";VMM.attachElement("#"+e.id.toString(),VMM.MediaElement.loadingmessage(n))})},pushQue:function(){if(VMM.master_config.twitter.que.length>0){VMM.ExternalAPI.twitter.create(VMM.master_config.twitter.que[0],VMM.ExternalAPI.twitter.pushQue);VMM.master_config.twitter.que.remove(0)}},getHTML:function(e){var t="http://api.twitter.com/1/statuses/oembed.json?id="+e+"&callback=?";VMM.getJSON(t,VMM.ExternalAPI.twitter.onJSONLoaded)},onJSONLoaded:function(e){trace("TWITTER JSON LOADED");var t=e.id;VMM.attachElement("#"+t,VMM.Util.linkify_with_twitter(e.html))},parseTwitterDate:function(e){var t=new Date(Date.parse(e));return t},prettyParseTwitterDate:function(e){var t=new Date(Date.parse(e));return VMM.Date.prettyDate(t,!0)},getTweets:function(e){var t=[],n=e.length;for(var r=0;r<e.length;r++){var i="";e[r].tweet.match("status/")?i=e[r].tweet.split("status/")[1]:e[r].tweet.match("statuses/")?i=e[r].tweet.split("statuses/")[1]:i="";var s="http://api.twitter.com/1/statuses/show.json?id="+i+"&include_entities=true&callback=?";VMM.getJSON(s,function(e){var r={},i="<div class='twitter'><blockquote><p>",s=VMM.Util.linkify_with_twitter(e.text,"_blank");i+=s;i+="</p>";i+="— "+e.user.name+" (<a href='https://twitter.com/"+e.user.screen_name+"'>@"+e.user.screen_name+"</a>) <a href='https://twitter.com/"+e.user.screen_name+"/status/"+e.id+"'>"+VMM.ExternalAPI.twitter.prettyParseTwitterDate(e.created_at)+" </a></blockquote></div>";r.content=i;r.raw=e;t.push(r);if(t.length==n){var o={tweetdata:t};VMM.fireEvent(global,"TWEETSLOADED",o)}}).success(function(){trace("second success")}).error(function(){trace("error")}).complete(function(){trace("complete")})}},getTweetSearch:function(e,t){var n=40;t!=null&&t!=""&&(n=t);var r="http://search.twitter.com/search.json?q="+e+"&rpp="+n+"&include_entities=true&result_type=mixed",i=[];VMM.getJSON(r,function(e){for(var t=0;t<e.results.length;t++){var n={},r="<div class='twitter'><blockquote><p>",s=VMM.Util.linkify_with_twitter(e.results[t].text,"_blank");r+=s;r+="</p>";r+="— "+e.results[t].from_user_name+" (<a href='https://twitter.com/"+e.results[t].from_user+"'>@"+e.results[t].from_user+"</a>) <a href='https://twitter.com/"+e.results[t].from_user+"/status/"+e.id+"'>"+VMM.ExternalAPI.twitter.prettyParseTwitterDate(e.results[t].created_at)+" </a></blockquote></div>";n.content=r;n.raw=e.results[t];i.push(n)}var o={tweetdata:i};VMM.fireEvent(global,"TWEETSLOADED",o)})},prettyHTML:function(e,t){var e=e.toString(),n={twitterid:e},r="http://api.twitter.com/1/statuses/show.json?id="+e+"&include_entities=true&callback=?",i=setTimeout(VMM.ExternalAPI.twitter.errorTimeOut,VMM.master_config.timers.api,e);VMM.getJSON(r,VMM.ExternalAPI.twitter.formatJSON).error(function(t,n,r){trace("TWITTER error");trace("TWITTER ERROR: "+n+" "+t.responseText);VMM.attachElement("#twitter_"+e,"<p>ERROR LOADING TWEET "+e+"</p>")}).success(function(e){clearTimeout(i);t&&VMM.ExternalAPI.twitter.secondaryMedia(e)})},formatJSON:function(e){var t=e.id_str,n="<blockquote><p>",r=VMM.Util.linkify_with_twitter(e.text,"_blank");n+=r;n+="</p></blockquote>";n+="<div class='vcard author'>";n+="<a class='screen-name url' href='https://twitter.com/"+e.user.screen_name+"' data-screen-name='"+e.user.screen_name+"' target='_blank'>";n+="<span class='avatar'><img src=' "+e.user.profile_image_url+"'  alt=''></span>";n+="<span class='fn'>"+e.user.name+"</span>";n+="<span class='nickname'>@"+e.user.screen_name+"<span class='thumbnail-inline'></span></span>";n+="</a>";n+="</div>";typeof e.entities.media!="undefined"&&e.entities.media[0].type=="photo"&&(n+="<img src=' "+e.entities.media[0].media_url+"'  alt=''>");VMM.attachElement("#twitter_"+t.toString(),n);VMM.attachElement("#text_thumb_"+t.toString(),e.text)}},googlemaps:{maptype:"toner",setMapType:function(e){e!=""&&(VMM.ExternalAPI.googlemaps.maptype=e)},get:function(e){var t,n,r;e.vars=VMM.Util.getUrlVars(e.id);VMM.ExternalAPI.keys.google!=""?n=VMM.ExternalAPI.keys.google:n=Aes.Ctr.decrypt(VMM.ExternalAPI.keys_master.google,VMM.ExternalAPI.keys_master.vp,256);r="http://maps.googleapis.com/maps/api/js?key="+n+"&libraries=places&sensor=false&callback=VMM.ExternalAPI.googlemaps.onMapAPIReady";if(VMM.master_config.googlemaps.active)VMM.master_config.googlemaps.que.push(e);else{VMM.master_config.googlemaps.que.push(e);VMM.master_config.googlemaps.api_loaded||LoadLib.js(r,function(){trace("Google Maps API Library Loaded")})}},create:function(e){VMM.ExternalAPI.googlemaps.createAPIMap(e)},createiFrameMap:function(e){var t=e.id+"&output=embed",n="",r=e.uid.toString()+"_gmap";n+="<div class='google-map' id='"+r+"' style='width=100%;height=100%;'>";n+="<iframe width='100%' height='100%' frameborder='0' scrolling='no' marginheight='0' marginwidth='0' src='"+t+"'></iframe>";n+="</div>";VMM.attachElement("#"+e.uid,n)},createAPIMap:function(e){function d(e){if(e in VMM.ExternalAPI.googlemaps.map_providers){t=VMM.ExternalAPI.googlemaps.map_attribution[VMM.ExternalAPI.googlemaps.map_providers[e].attribution];return VMM.ExternalAPI.googlemaps.map_providers[e]}if(VMM.ExternalAPI.googlemaps.defaultType(e)){trace("GOOGLE MAP DEFAULT TYPE");return google.maps.MapTypeId[e.toUpperCase()]}trace("Not a maptype: "+e)}function v(){var t=new google.maps.Geocoder,n=VMM.Util.getUrlVars(e.id).q,i;if(n.match("loc:")){var s=n.split(":")[1].split("+");u=new google.maps.LatLng(parseFloat(s[0]),parseFloat(s[1]));l=!0}t.geocode({address:n},function(e,t){if(t==google.maps.GeocoderStatus.OK){i=new google.maps.Marker({map:r,position:e[0].geometry.location});typeof e[0].geometry.viewport!="undefined"?r.fitBounds(e[0].geometry.viewport):typeof e[0].geometry.bounds!="undefined"?r.fitBounds(e[0].geometry.bounds):r.setCenter(e[0].geometry.location);l&&r.panTo(u);c&&r.setZoom(f)}else{trace("Geocode for "+n+" was not successful for the following reason: "+t);trace("TRYING PLACES SEARCH");l&&r.panTo(u);c&&r.setZoom(f);m()}})}function m(){function h(t,i){if(i==google.maps.places.PlacesServiceStatus.OK){for(var s=0;s<t.length;s++);if(l)r.panTo(u);else if(t.length>=1){r.panTo(t[0].geometry.location);c&&r.setZoom(f)}}else{trace("Place search for "+n.query+" was not successful for the following reason: "+i);trace("YOU MAY NEED A GOOGLE MAPS API KEY IN ORDER TO USE THIS FEATURE OF TIMELINEJS");trace("FIND OUT HOW TO GET YOUR KEY HERE: https://developers.google.com/places/documentation/#Authentication");if(l){r.panTo(u);c&&r.setZoom(f)}else{trace("USING SIMPLE IFRAME MAP EMBED");e.id[0].match("https")&&(e.id=e.url[0].replace("https","http"));VMM.ExternalAPI.googlemaps.createiFrameMap(e)}}}function p(e){var t,n;n=e.geometry.location;t=new google.maps.Marker({map:r,position:e.geometry.location});google.maps.event.addListener(t,"click",function(){i.setContent(e.name);i.open(r,this)})}var t,n,i,s,o,a;place_search=new google.maps.places.PlacesService(r);i=new google.maps.InfoWindow;n={query:"",types:["country","neighborhood","political","locality","geocode"]};type.of(VMM.Util.getUrlVars(e.id)["q"])=="string"&&(n.query=VMM.Util.getUrlVars(e.id).q);if(l){n.location=u;n.radius="15000"}else{o=new google.maps.LatLng(-89.999999,-179.999999);a=new google.maps.LatLng(89.999999,179.999999);s=new google.maps.LatLngBounds(o,a)}place_search.textSearch(n,h)}function g(){var t,n,i=!1;trace("LOADING PLACES API FOR GOOGLE MAPS");if(VMM.ExternalAPI.keys.google!=""){t=VMM.ExternalAPI.keys.google;i=!0}else{trace("YOU NEED A GOOGLE MAPS API KEY IN ORDER TO USE THIS FEATURE OF TIMELINEJS");trace("FIND OUT HOW TO GET YOUR KEY HERE: https://developers.google.com/places/documentation/#Authentication")}n="https://maps.googleapis.com/maps/api/place/textsearch/json?key="+t+"&sensor=false&language="+e.lang+"&";type.of(VMM.Util.getUrlVars(e.id)["q"])=="string"&&(n+="query="+VMM.Util.getUrlVars(e.id).q);l&&(n+="&location="+u);if(i)VMM.getJSON(n,function(t){trace("PLACES JSON");var n="",i="",s="",o="";trace(t);if(t.status=="OVER_QUERY_LIMIT"){trace("OVER_QUERY_LIMIT");if(l){r.panTo(u);c&&r.setZoom(f)}else{trace("DOING TRADITIONAL MAP IFRAME EMBED UNTIL QUERY LIMIT RESTORED");h=!0;VMM.ExternalAPI.googlemaps.createiFrameMap(e)}}else{if(t.results.length>=1){s=new google.maps.LatLng(parseFloat(t.results[0].geometry.viewport.northeast.lat),parseFloat(t.results[0].geometry.viewport.northeast.lng));o=new google.maps.LatLng(parseFloat(t.results[0].geometry.viewport.southwest.lat),parseFloat(t.results[0].geometry.viewport.southwest.lng));i=new google.maps.LatLngBounds(o,s);r.fitBounds(i)}else trace("NO RESULTS");l&&r.panTo(u);c&&r.setZoom(f)}}).error(function(e,t,n){trace("PLACES JSON ERROR");trace("PLACES JSON ERROR: "+t+" "+e.responseText)}).success(function(e){trace("PLACES JSON SUCCESS")});else if(l){r.panTo(u);c&&r.setZoom(f)}else{trace("DOING TRADITIONAL MAP IFRAME EMBED BECAUSE NO GOOGLE MAP API KEY WAS PROVIDED");VMM.ExternalAPI.googlemaps.createiFrameMap(e)}}function y(){var t,n,i,s;t=e.id+"&output=kml";t=t.replace("&output=embed","");n=new google.maps.KmlLayer(t,{preserveViewport:!0});i=new google.maps.InfoWindow;n.setMap(r);google.maps.event.addListenerOnce(n,"defaultviewport_changed",function(){l?r.panTo(u):r.fitBounds(n.getDefaultViewport());c&&r.setZoom(f)});google.maps.event.addListener(n,"click",function(e){function t(e){i.setContent(e);i.open(r)}s=e.featureData.description;t(s)})}var t="",n,r,i,s=e.uid.toString()+"_gmap",o="",u=new google.maps.LatLng(41.875696,-87.624207),a,f=11,l=!1,c=!1,h=!1,p;google.maps.VeriteMapType=function(e){if(VMM.ExternalAPI.googlemaps.defaultType(e))return google.maps.MapTypeId[e.toUpperCase()];var t=d(e);return google.maps.ImageMapType.call(this,{getTileUrl:function(e,n){var r=(n+e.x+e.y)%VMM.ExternalAPI.googlemaps.map_subdomains.length;return[t.url.replace("{S}",VMM.ExternalAPI.googlemaps.map_subdomains[r]).replace("{Z}",n).replace("{X}",e.x).replace("{Y}",e.y).replace("{z}",n).replace("{x}",e.x).replace("{y}",e.y)]},tileSize:new google.maps.Size(256,256),name:e,minZoom:t.minZoom,maxZoom:t.maxZoom})};google.maps.VeriteMapType.prototype=new google.maps.ImageMapType("_");VMM.ExternalAPI.googlemaps.maptype!=""?VMM.ExternalAPI.googlemaps.defaultType(VMM.ExternalAPI.googlemaps.maptype)?n=google.maps.MapTypeId[VMM.ExternalAPI.googlemaps.maptype.toUpperCase()]:n=VMM.ExternalAPI.googlemaps.maptype:n="toner";if(type.of(VMM.Util.getUrlVars(e.id)["ll"])=="string"){l=!0;a=VMM.Util.getUrlVars(e.id).ll.split(",");u=new google.maps.LatLng(parseFloat(a[0]),parseFloat(a[1]))}else if(type.of(VMM.Util.getUrlVars(e.id)["sll"])=="string"){a=VMM.Util.getUrlVars(e.id).sll.split(",");u=new google.maps.LatLng(parseFloat(a[0]),parseFloat(a[1]))}if(type.of(VMM.Util.getUrlVars(e.id)["z"])=="string"){c=!0;f=parseFloat(VMM.Util.getUrlVars(e.id).z)}i={zoom:f,draggable:!1,disableDefaultUI:!0,mapTypeControl:!1,zoomControl:!0,zoomControlOptions:{style:google.maps.ZoomControlStyle.SMALL,position:google.maps.ControlPosition.TOP_RIGHT},center:u,mapTypeId:n,mapTypeControlOptions:{mapTypeIds:[n]}};VMM.attachElement("#"+e.uid,"<div class='google-map' id='"+s+"' style='width=100%;height=100%;'></div>");r=new google.maps.Map(document.getElementById(s),i);if(!VMM.ExternalAPI.googlemaps.defaultType(VMM.ExternalAPI.googlemaps.maptype)){r.mapTypes.set(n,new google.maps.VeriteMapType(n));o="<div class='map-attribution'><div class='attribution-text'>"+t+"</div></div>";VMM.appendElement("#"+s,o)}e.id[0].match("msid")?y():type.of(VMM.Util.getUrlVars(e.id)["q"])=="string"&&v()},pushQue:function(){for(var e=0;e<VMM.master_config.googlemaps.que.length;e++)VMM.ExternalAPI.googlemaps.create(VMM.master_config.googlemaps.que[e]);VMM.master_config.googlemaps.que=[]},onMapAPIReady:function(){VMM.master_config.googlemaps.map_active=!0;VMM.master_config.googlemaps.places_active=!0;VMM.ExternalAPI.googlemaps.onAPIReady()},onPlacesAPIReady:function(){VMM.master_config.googlemaps.places_active=!0;VMM.ExternalAPI.googlemaps.onAPIReady()},onAPIReady:function(){if(!VMM.master_config.googlemaps.active&&VMM.master_config.googlemaps.map_active&&VMM.master_config.googlemaps.places_active){VMM.master_config.googlemaps.active=!0;VMM.ExternalAPI.googlemaps.pushQue()}},defaultType:function(e){return e.toLowerCase()=="satellite"||e.toLowerCase()=="hybrid"||e.toLowerCase()=="terrain"||e.toLowerCase()=="roadmap"?!0:!1},map_subdomains:["","a.","b.","c.","d."],map_attribution:{stamen:"Map tiles by <a href='http://stamen.com'>Stamen Design</a>, under <a href='http://creativecommons.org/licenses/by/3.0'>CC BY 3.0</a>. Data by <a href='http://openstreetmap.org'>OpenStreetMap</a>, under <a href='http://creativecommons.org/licenses/by-sa/3.0'>CC BY SA</a>.",apple:"Map data &copy; 2012  Apple, Imagery &copy; 2012 Apple"},map_providers:{toner:{url:"http://{S}tile.stamen.com/toner/{Z}/{X}/{Y}.png",minZoom:0,maxZoom:20,attribution:"stamen"},"toner-lines":{url:"http://{S}tile.stamen.com/toner-lines/{Z}/{X}/{Y}.png",minZoom:0,maxZoom:20,attribution:"stamen"},"toner-labels":{url:"http://{S}tile.stamen.com/toner-labels/{Z}/{X}/{Y}.png",minZoom:0,maxZoom:20,attribution:"stamen"},sterrain:{url:"http://{S}tile.stamen.com/terrain/{Z}/{X}/{Y}.jpg",minZoom:4,maxZoom:20,attribution:"stamen"},apple:{url:"http://gsp2.apple.com/tile?api=1&style=slideshow&layers=default&lang=en_US&z={z}&x={x}&y={y}&v=9",minZoom:4,maxZoom:14,attribution:"apple"},watercolor:{url:"http://{S}tile.stamen.com/watercolor/{Z}/{X}/{Y}.jpg",minZoom:3,maxZoom:16,attribution:"stamen"}}},googleplus:{get:function(e){var t,n={user:e.user,activity:e.id,id:e.uid};VMM.master_config.googleplus.que.push(n);VMM.master_config.googleplus.active=!0},create:function(e,t){var n="",r="",i="",s="",o="",u,a;googleplus_timeout=setTimeout(VMM.ExternalAPI.googleplus.errorTimeOut,VMM.master_config.timers.api,e),callback_timeout=setTimeout(t,VMM.master_config.timers.api,e);VMM.master_config.Timeline.api_keys.google!=""?r=VMM.master_config.Timeline.api_keys.google:r=Aes.Ctr.decrypt(VMM.master_config.api_keys_master.google,VMM.master_config.vp,256);u="https://www.googleapis.com/plus/v1/people/"+e.user+"/activities/public?alt=json&maxResults=100&fields=items(id,url)&key="+r;n="GOOGLE PLUS API CALL";VMM.getJSON(u,function(t){for(var u=0;u<t.items.length;u++){trace("loop");if(t.items[u].url.split("posts/")[1]==e.activity){trace("FOUND IT!!");i=t.items[u].id;a="https://www.googleapis.com/plus/v1/activities/"+i+"?alt=json&key="+r;VMM.getJSON(a,function(t){trace(t);if(typeof t.annotation!="undefined"){s+="<div class='googleplus-annotation'>'"+t.annotation+"</div>";s+=t.object.content}else s+=t.object.content;if(typeof t.object.attachments!="undefined"){for(var r=0;r<t.object.attachments.length;r++){if(t.object.attachments[r].objectType=="photo")o="<a href='"+t.object.url+"' target='_blank'>"+"<img src='"+t.object.attachments[r].image.url+"' class='article-thumb'></a>"+o;else if(t.object.attachments[r].objectType=="video"){o="<img src='"+t.object.attachments[r].image.url+"' class='article-thumb'>"+o;o+="<div>";o+="<a href='"+t.object.attachments[r].url+"' target='_blank'>";o+="<h5>"+t.object.attachments[r].displayName+"</h5>";o+="</a>";o+="</div>"}else if(t.object.attachments[r].objectType=="article"){o+="<div>";o+="<a href='"+t.object.attachments[r].url+"' target='_blank'>";o+="<h5>"+t.object.attachments[r].displayName+"</h5>";o+="<p>"+t.object.attachments[r].content+"</p>";o+="</a>";o+="</div>"}trace(t.object.attachments[r])}o="<div class='googleplus-attachments'>"+o+"</div>"}n="<div class='googleplus-content'>"+s+o+"</div>";n+="<div class='vcard author'><a class='screen-name url' href='"+t.url+"' target='_blank'>";n+="<span class='avatar'><img src='"+t.actor.image.url+"' style='max-width: 32px; max-height: 32px;'></span>";n+="<span class='fn'>"+t.actor.displayName+"</span>";n+="<span class='nickname'><span class='thumbnail-inline'></span></span>";n+="</a></div>";VMM.attachElement("#googleplus_"+e.activity,n)});break}}}).error(function(t,n,r){var i=VMM.parseJSON(t.responseText);trace(i.error.message);VMM.attachElement("#googleplus_"+e.activity,VMM.MediaElement.loadingmessage("<p>ERROR LOADING GOOGLE+ </p><p>"+i.error.message+"</p>"))}).success(function(e){clearTimeout(googleplus_timeout);clearTimeout(callback_timeout);t()})},pushQue:function(){if(VMM.master_config.googleplus.que.length>0){VMM.ExternalAPI.googleplus.create(VMM.master_config.googleplus.que[0],VMM.ExternalAPI.googleplus.pushQue);VMM.master_config.googleplus.que.remove(0)}},errorTimeOut:function(e){trace("GOOGLE+ JSON ERROR TIMEOUT "+e.activity);VMM.attachElement("#googleplus_"+e.activity,VMM.MediaElement.loadingmessage("<p>Still waiting on GOOGLE+ </p><p>"+e.activity+"</p>"))}},googledocs:{get:function(e){VMM.master_config.googledocs.que.push(e);VMM.master_config.googledocs.active=!0},create:function(e){var t="";e.id.match(/docs.google.com/i)?t="<iframe class='doc' frameborder='0' width='100%' height='100%' src='"+e.id+"&amp;embedded=true'></iframe>":t="<iframe class='doc' frameborder='0' width='100%' height='100%' src='http://docs.google.com/viewer?url="+e.id+"&amp;embedded=true'></iframe>";VMM.attachElement("#"+e.uid,t)},pushQue:function(){for(var e=0;e<VMM.master_config.googledocs.que.length;e++)VMM.ExternalAPI.googledocs.create(VMM.master_config.googledocs.que[e]);VMM.master_config.googledocs.que=[]}},flickr:{get:function(e){VMM.master_config.flickr.que.push(e);VMM.master_config.flickr.active=!0},create:function(e,t){var n,r=setTimeout(t,VMM.master_config.timers.api,e);typeof VMM.master_config.Timeline!="undefined"&&VMM.master_config.Timeline.api_keys.flickr!=""?n=VMM.master_config.Timeline.api_keys.flickr:n=Aes.Ctr.decrypt(VMM.master_config.api_keys_master.flickr,VMM.master_config.vp,256);var i="http://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key="+n+"&photo_id="+e.id+"&format=json&jsoncallback=?";VMM.getJSON(i,function(t){var n=t.sizes.size[0].url.split("photos/")[1].split("/")[1],r="#"+e.uid,i="#"+e.uid+"_thumb",s,o,u=!1,a="Large";a=VMM.ExternalAPI.flickr.sizes(VMM.master_config.sizes.api.height);for(var f=0;f<t.sizes.size.length;f++)if(t.sizes.size[f].label==a){u=!0;s=t.sizes.size[f].source}u||(s=t.sizes.size[t.sizes.size.length-2].source);o=t.sizes.size[0].source;VMM.Lib.attr(r,"src",s);VMM.attachElement(i,"<img src='"+o+"'>")}).error(function(e,t,n){trace("FLICKR error");trace("FLICKR ERROR: "+t+" "+e.responseText)}).success(function(e){clearTimeout(r);t()})},pushQue:function(){if(VMM.master_config.flickr.que.length>0){VMM.ExternalAPI.flickr.create(VMM.master_config.flickr.que[0],VMM.ExternalAPI.flickr.pushQue);VMM.master_config.flickr.que.remove(0)}},sizes:function(e){var t="";e<=75?t="Thumbnail":e<=180?t="Small":e<=240?t="Small 320":e<=375?t="Medium":e<=480?t="Medium 640":e<=600?t="Large":t="Large";return t}},instagram:{get:function(e,t){return t?"http://instagr.am/p/"+e.id+"/media/?size=t":"http://instagr.am/p/"+e.id+"/media/?size="+VMM.ExternalAPI.instagram.sizes(VMM.master_config.sizes.api.height)},sizes:function(e){var t="";e<=150?t="t":e<=306?t="m":t="l";return t}},soundcloud:{get:function(e){VMM.master_config.soundcloud.que.push(e);VMM.master_config.soundcloud.active=!0},create:function(e,t){var n="http://soundcloud.com/oembed?url="+e.id+"&format=js&callback=?";VMM.getJSON(n,function(n){VMM.attachElement("#"+e.uid,n.html);t()})},pushQue:function(){if(VMM.master_config.soundcloud.que.length>0){VMM.ExternalAPI.soundcloud.create(VMM.master_config.soundcloud.que[0],VMM.ExternalAPI.soundcloud.pushQue);VMM.master_config.soundcloud.que.remove(0)}}},wikipedia:{get:function(e){VMM.master_config.wikipedia.que.push(e);VMM.master_config.wikipedia.active=!0},create:function(e,t){var n="http://"+e.lang+".wikipedia.org/w/api.php?action=query&prop=extracts&redirects=&titles="+e.id+"&exintro=1&format=json&callback=?";callback_timeout=setTimeout(t,VMM.master_config.timers.api,e);if(VMM.Browser.browser=="Explorer"&&parseInt(VMM.Browser.version,10)>=7&&window.XDomainRequest){var r="<h4><a href='http://"+VMM.master_config.language.api.wikipedia+".wikipedia.org/wiki/"+e.id+"' target='_blank'>"+e.url+"</a></h4>";r+="<span class='wiki-source'>"+VMM.master_config.language.messages.wikipedia+"</span>";r+="<p>Wikipedia entry unable to load using Internet Explorer 8 or below.</p>";VMM.attachElement("#"+e.uid,r)}VMM.getJSON(n,function(t){if(t.query){var n,r,i="",s="",o=1,u=[];n=VMM.Util.getObjectAttributeByIndex(t.query.pages,0).extract;r=VMM.Util.getObjectAttributeByIndex(t.query.pages,0).title;n.match("<p>")?u=n.split("<p>"):u.push(n);for(var a=0;a<u.length;a++)a+1<=o&&a+1<u.length&&(s+="<p>"+u[a+1]);i="<h4><a href='http://"+VMM.master_config.language.api.wikipedia+".wikipedia.org/wiki/"+r+"' target='_blank'>"+r+"</a></h4>";i+="<span class='wiki-source'>"+VMM.master_config.language.messages.wikipedia+"</span>";i+=VMM.Util.linkify_wikipedia(s);n.match("REDIRECT")||VMM.attachElement("#"+e.uid,i)}}).error(function(n,r,i){trace("WIKIPEDIA error");trace("WIKIPEDIA ERROR: "+r+" "+n.responseText);trace(i);VMM.attachElement("#"+e.uid,VMM.MediaElement.loadingmessage("<p>Wikipedia is not responding</p>"));clearTimeout(callback_timeout);if(VMM.master_config.wikipedia.tries<4){trace("WIKIPEDIA ATTEMPT "+VMM.master_config.wikipedia.tries);trace(e);VMM.master_config.wikipedia.tries++;VMM.ExternalAPI.wikipedia.create(e,t)}else t()}).success(function(e){VMM.master_config.wikipedia.tries=0;clearTimeout(callback_timeout);t()})},pushQue:function(){if(VMM.master_config.wikipedia.que.length>0){trace("WIKIPEDIA PUSH QUE "+VMM.master_config.wikipedia.que.length);VMM.ExternalAPI.wikipedia.create(VMM.master_config.wikipedia.que[0],VMM.ExternalAPI.wikipedia.pushQue);VMM.master_config.wikipedia.que.remove(0)}}},youtube:{get:function(e){var t="http://gdata.youtube.com/feeds/api/videos/"+e.id+"?v=2&alt=jsonc&callback=?";VMM.master_config.youtube.que.push(e);VMM.master_config.youtube.active||VMM.master_config.youtube.api_loaded||LoadLib.js("http://www.youtube.com/player_api",function(){trace("YouTube API Library Loaded")});VMM.getJSON(t,function(t){VMM.ExternalAPI.youtube.createThumb(t,e)})},create:function(e){if(typeof e.start!="undefined"){var t=e.start.toString(),n=0,r=0;if(t.match("m")){n=parseInt(t.split("m")[0],10);r=parseInt(t.split("m")[1].split("s")[0],10);e.start=n*60+r}else e.start=0}else e.start=0;var i={active:!1,player:{},name:e.uid,playing:!1,hd:!1};typeof e.hd!="undefined"&&(i.hd=!0);i.player[e.id]=new YT.Player(e.uid,{height:"390",width:"640",playerVars:{enablejsapi:1,color:"white",showinfo:0,theme:"light",start:e.start,rel:0},videoId:e.id,events:{onReady:VMM.ExternalAPI.youtube.onPlayerReady,onStateChange:VMM.ExternalAPI.youtube.onStateChange}});VMM.master_config.youtube.array.push(i)},createThumb:function(e,t){trace("CREATE THUMB");trace(e);trace(t);if(typeof e.data!="undefined"){var n="#"+t.uid+"_thumb";VMM.attachElement(n,"<img src='"+e.data.thumbnail.sqDefault+"'>")}},pushQue:function(){for(var e=0;e<VMM.master_config.youtube.que.length;e++)VMM.ExternalAPI.youtube.create(VMM.master_config.youtube.que[e]);VMM.master_config.youtube.que=[]},onAPIReady:function(){VMM.master_config.youtube.active=!0;VMM.ExternalAPI.youtube.pushQue()},stopPlayers:function(){for(var e=0;e<VMM.master_config.youtube.array.length;e++)if(VMM.master_config.youtube.array[e].playing){var t=VMM.master_config.youtube.array[e].name;VMM.master_config.youtube.array[e].player[t].stopVideo()}},onStateChange:function(e){for(var t=0;t<VMM.master_config.youtube.array.length;t++){var n=VMM.master_config.youtube.array[t].name;if(VMM.master_config.youtube.array[t].player[n]==e.target&&e.data==YT.PlayerState.PLAYING){VMM.master_config.youtube.array[t].playing=!0;trace(VMM.master_config.youtube.array[t].hd);VMM.master_config.youtube.array[t].hd}}},onPlayerReady:function(e){}},vimeo:{get:function(e){VMM.master_config.vimeo.que.push(e);VMM.master_config.vimeo.active=!0},create:function(e,t){trace("VIMEO CREATE");var n="http://vimeo.com/api/v2/video/"+e.id+".json",r="http://player.vimeo.com/video/"+e.id+"?title=0&amp;byline=0&amp;portrait=0&amp;color=ffffff";VMM.getJSON(n,function(n){VMM.ExternalAPI.vimeo.createThumb(n,e);t()});VMM.attachElement("#"+e.uid,"<iframe autostart='false' frameborder='0' width='100%' height='100%' src='"+r+"'></iframe>")},createThumb:function(e,t){trace("VIMEO CREATE THUMB");var n="#"+t.uid+"_thumb";VMM.attachElement(n,"<img src='"+e[0].thumbnail_small+"'>")},pushQue:function(){if(VMM.master_config.vimeo.que.length>0){VMM.ExternalAPI.vimeo.create(VMM.master_config.vimeo.que[0],VMM.ExternalAPI.vimeo.pushQue);VMM.master_config.vimeo.que.remove(0)}}},webthumb:{get:function(e,t){VMM.master_config.webthumb.que.push(e);VMM.master_config.webthumb.active=!0},sizes:function(e){var t="";e<=150?t="t":e<=306?t="m":t="l";return t},create:function(e){trace("WEB THUMB CREATE");var t="http://pagepeeker.com/t/";url=e.id.replace("http://","");VMM.attachElement("#"+e.uid,"<a href='"+e.id+"' target='_blank'><img src='"+t+"x/"+url+"'></a>");VMM.attachElement("#"+e.uid+"_thumb","<a href='"+e.id+"' target='_blank'><img src='"+t+"t/"+url+"'></a>")},pushQue:function(){for(var e=0;e<VMM.master_config.webthumb.que.length;e++)VMM.ExternalAPI.webthumb.create(VMM.master_config.webthumb.que[e]);VMM.master_config.webthumb.que=[]}}}.init());typeof VMM!="undefined"&&typeof VMM.MediaElement=="undefined"&&(VMM.MediaElement={init:function(){return this},loadingmessage:function(e){return"<div class='vco-loading'><div class='vco-loading-container'><div class='vco-loading-icon'></div><div class='vco-message'><p>"+e+"</p></div></div></div>"},thumbnail:function(e,t,n,r){var i=16,s=24,o="";t!=null&&t!=""&&(i=t);n!=null&&n!=""&&(s=n);r!=null&&r!=""&&(o=r);if(e.media!=null&&e.media!=""){var u=!0,a="",f=VMM.MediaType(e.media);if(e.thumbnail!=null&&e.thumbnail!=""){trace("CUSTOM THUMB");a="<div class='thumbnail thumb-custom' id='"+r+"_custom_thumb'><img src='"+e.thumbnail+"'></div>";return a}if(f.type=="image"){a="<div class='thumbnail thumb-photo'></div>";return a}if(f.type=="flickr"){a="<div class='thumbnail thumb-photo' id='"+r+"_thumb'></div>";return a}if(f.type=="instagram"){a="<div class='thumbnail thumb-instagram' id='"+r+"_thumb'><img src='"+VMM.ExternalAPI.instagram.get(f.id,!0)+"'></div>";return a}if(f.type=="youtube"){a="<div class='thumbnail thumb-youtube' id='"+r+"_thumb'></div>";return a}if(f.type=="googledoc"){a="<div class='thumbnail thumb-document'></div>";return a}if(f.type=="vimeo"){a="<div class='thumbnail thumb-vimeo' id='"+r+"_thumb'></div>";return a}if(f.type=="dailymotion"){a="<div class='thumbnail thumb-video'></div>";return a}if(f.type=="twitter"){a="<div class='thumbnail thumb-twitter'></div>";return a}if(f.type=="twitter-ready"){a="<div class='thumbnail thumb-twitter'></div>";return a}if(f.type=="soundcloud"){a="<div class='thumbnail thumb-audio'></div>";return a}if(f.type=="google-map"){a="<div class='thumbnail thumb-map'></div>";return a}if(f.type=="googleplus"){a="<div class='thumbnail thumb-googleplus'></div>";return a}if(f.type=="wikipedia"){a="<div class='thumbnail thumb-wikipedia'></div>";return a}if(f.type=="storify"){a="<div class='thumbnail thumb-storify'></div>";return a}if(f.type=="quote"){a="<div class='thumbnail thumb-quote'></div>";return a}if(f.type=="unknown"){f.id.match("blockquote")?a="<div class='thumbnail thumb-quote'></div>":a="<div class='thumbnail thumb-plaintext'></div>";return a}if(f.type=="website"){a="<div class='thumbnail thumb-website' id='"+r+"_thumb'></div>";return a}a="<div class='thumbnail thumb-plaintext'></div>";return a}},create:function(e,t){var n=!1,r=VMM.MediaElement.loadingmessage(VMM.master_config.language.messages.loading+"...");if(e.media!=null&&e.media!=""){var i="",s="",o="",u="",a=!1,f;f=VMM.MediaType(e.media);f.uid=t;n=!0;e.credit!=null&&e.credit!=""&&(o="<div class='credit'>"+VMM.Util.linkify_with_twitter(e.credit,"_blank")+"</div>");e.caption!=null&&e.caption!=""&&(s="<div class='caption'>"+VMM.Util.linkify_with_twitter(e.caption,"_blank")+"</div>");if(f.type=="image"){f.id.match("https://")&&(f.id=f.id.replace("https://","http://"));i="<div class='media-image media-shadow'><img src='"+f.id+"' class='media-image'></div>"}else if(f.type=="flickr"){i="<div class='media-image media-shadow'><a href='"+f.link+"' target='_blank'><img id='"+t+"'></a></div>";VMM.ExternalAPI.flickr.get(f)}else if(f.type=="instagram")i="<div class='media-image media-shadow'><a href='"+f.link+"' target='_blank'><img src='"+VMM.ExternalAPI.instagram.get(f)+"'></a></div>";else if(f.type=="googledoc"){i="<div class='media-frame media-shadow doc' id='"+f.uid+"'>"+r+"</div>";VMM.ExternalAPI.googledocs.get(f)}else if(f.type=="youtube"){i="<div class='media-shadow'><div class='media-frame video youtube' id='"+f.uid+"'>"+r+"</div></div>";VMM.ExternalAPI.youtube.get(f)}else if(f.type=="vimeo"){i="<div class='media-shadow media-frame video vimeo' id='"+f.uid+"'>"+r+"</div>";VMM.ExternalAPI.vimeo.get(f)}else if(f.type=="dailymotion")i="<div class='media-shadow'><iframe class='media-frame video dailymotion' autostart='false' frameborder='0' width='100%' height='100%' src='http://www.dailymotion.com/embed/video/"+f.id+"'></iframe></div>";else if(f.type=="twitter"){i="<div class='twitter' id='"+f.uid+"'>"+r+"</div>";a=!0;VMM.ExternalAPI.twitter.get(f)}else if(f.type=="twitter-ready"){a=!0;i=f.id}else if(f.type=="soundcloud"){i="<div class='media-frame media-shadow soundcloud' id='"+f.uid+"'>"+r+"</div>";VMM.ExternalAPI.soundcloud.get(f)}else if(f.type=="google-map"){i="<div class='media-frame media-shadow map' id='"+f.uid+"'>"+r+"</div>";VMM.ExternalAPI.googlemaps.get(f)}else if(f.type=="googleplus"){u="googleplus_"+f.id;i="<div class='googleplus' id='"+u+"'>"+r+"</div>";a=!0;VMM.ExternalAPI.googleplus.get(f)}else if(f.type=="wikipedia"){i="<div class='wikipedia' id='"+f.uid+"'>"+r+"</div>";a=!0;VMM.ExternalAPI.wikipedia.get(f)}else if(f.type=="storify"){a=!0;i="<div class='plain-text-quote'>"+f.id+"</div>"}else if(f.type=="quote"){a=!0;i="<div class='plain-text-quote'>"+f.id+"</div>"}else if(f.type=="unknown"){trace("NO KNOWN MEDIA TYPE FOUND TRYING TO JUST PLACE THE HTML");a=!0;i="<div class='plain-text'><div class='container'>"+VMM.Util.properQuotes(f.id)+"</div></div>"}else if(f.type=="website"){i="<div class='media-shadow website' id='"+f.uid+"'>"+r+"</div>";VMM.ExternalAPI.webthumb.get(f)}else{trace("NO KNOWN MEDIA TYPE FOUND");trace(f.type)}i="<div class='media-container' >"+
i+o+s+"</div>";return a?"<div class='text-media'><div class='media-wrapper'>"+i+"</div></div>":"<div class='media-wrapper'>"+i+"</div>"}}}.init());typeof VMM!="undefined"&&typeof VMM.MediaType=="undefined"&&(VMM.MediaType=function(e){var t=e.replace(/^\s\s*/,"").replace(/\s\s*$/,""),n=!1,r={type:"unknown",id:"",start:0,hd:!1,link:"",lang:VMM.Language.lang,uniqueid:VMM.Util.unique_ID(6)};if(t.match("div class='twitter'")){r.type="twitter-ready";r.id=t;n=!0}else if(t.match("(www.)?youtube|youtu.be")){t.match("v=")?r.id=VMM.Util.getUrlVars(t).v:t.match("/embed/")?r.id=t.split("embed/")[1].split(/[?&]/)[0]:r.id=t.split(/v\/|v=|youtu\.be\//)[1].split(/[?&]/)[0];r.start=VMM.Util.getUrlVars(t).t;r.hd=VMM.Util.getUrlVars(t).hd;r.type="youtube";n=!0}else if(t.match("(player.)?vimeo.com")){r.type="vimeo";r.id=t.split(/video\/|\/\/vimeo\.com\//)[1].split(/[?&]/)[0];n=!0}else if(t.match("(www.)?dailymotion.com")){r.id=t.split(/video\/|\/\/dailymotion\.com\//)[1];r.type="dailymotion";n=!0}else if(t.match("(player.)?soundcloud.com")){r.type="soundcloud";r.id=t;n=!0}else if(t.match("(www.)?twitter.com")&&t.match("status")){t.match("status/")?r.id=t.split("status/")[1]:t.match("statuses/")?r.id=t.split("statuses/")[1]:r.id="";r.type="twitter";n=!0}else if(t.match("maps.google")&&!t.match("staticmap")){r.type="google-map";r.id=t.split(/src=['|"][^'|"]*?['|"]/gi);n=!0}else if(t.match("plus.google")){r.type="googleplus";r.id=t.split("/posts/")[1];t.split("/posts/")[0].match("u/0/")?r.user=t.split("u/0/")[1].split("/posts")[0]:r.user=t.split("google.com/")[1].split("/posts/")[0];n=!0}else if(t.match("flickr.com/photos")){r.type="flickr";r.id=t.split("photos/")[1].split("/")[1];r.link=t;n=!0}else if(t.match("instagr.am/p/")){r.type="instagram";r.link=t;r.id=t.split("/p/")[1].split("/")[0];n=!0}else if(t.match(/jpg|jpeg|png|gif/i)||t.match("staticmap")||t.match("yfrog.com")||t.match("twitpic.com")){r.type="image";r.id=t;n=!0}else if(VMM.FileExtention.googleDocType(t)){r.type="googledoc";r.id=t;n=!0}else if(t.match("(www.)?wikipedia.org")){r.type="wikipedia";var i=t.split("wiki/")[1].split("#")[0].replace("_"," ");r.id=i.replace(" ","%20");r.lang=t.split("//")[1].split(".wikipedia")[0];n=!0}else if(t.indexOf("http://")==0){r.type="website";r.id=t;n=!0}else if(t.match("storify")){r.type="storify";r.id=t;n=!0}else if(t.match("blockquote")){r.type="quote";r.id=t;n=!0}else{trace("unknown media");r.type="unknown";r.id=t;n=!0}if(n)return r;trace("No valid media id detected");trace(t);return!1});typeof VMM!="undefined"&&typeof VMM.TextElement=="undefined"&&(VMM.TextElement={init:function(){return this},create:function(e){return e}}.init());typeof VMM!="undefined"&&typeof VMM.DragSlider=="undefined"&&(VMM.DragSlider=function(){function o(e,n){VMM.bindEvent(e,a,t.down,{element:n,delement:e});VMM.bindEvent(e,f,t.up,{element:n,delement:e});VMM.bindEvent(e,u,t.leave,{element:n,delement:e})}function u(n){VMM.unbindEvent(n.data.delement,l,t.move);e.touch||n.preventDefault();n.stopPropagation();if(e.sliding){e.sliding=!1;h(n.data.element,n.data.delement,n);return!1}return!0}function a(t){c(t.data.element,t.data.delement,t);e.touch||t.preventDefault();t.stopPropagation();return!0}function f(t){e.touch||t.preventDefault();t.stopPropagation();if(e.sliding){e.sliding=!1;h(t.data.element,t.data.delement,t);return!1}return!0}function l(t){p(t.data.element,t);Math.abs(e.left.start)>v(elem);return!1}function c(n,r,i){if(e.touch){trace("IS TOUCH");VMM.Lib.css(n,"-webkit-transition-duration","0");e.pagex.start=i.originalEvent.touches[0].screenX}else e.pagex.start=i.pageX;e.left.start=v(n);e.time.start=(new Date).getTime();VMM.Lib.stop(n);VMM.bindEvent(r,l,t.move,{element:n})}function h(e,n,r){VMM.unbindEvent(n,l,t.move);d(e,r)}function p(t,n){var r;e.sliding=!0;e.touch?e.pagex.end=n.originalEvent.touches[0].screenX:e.pagex.end=n.pageX;e.left.end=v(t);r=-(e.pagex.start-e.pagex.end-e.left.start);if(Math.abs(r-e.left.start)>10){VMM.Lib.css(t,"left",r);n.preventDefault();n.stopPropagation()}}function d(t,n){var r={left:e.left.end,left_adjust:0,change:{x:0},time:((new Date).getTime()-e.time.start)*10,time_adjust:((new Date).getTime()-e.time.start)*10},o=3e3;e.touch&&(o=6e3);r.change.x=o*(Math.abs(e.pagex.end)-Math.abs(e.pagex.start));r.left_adjust=Math.round(r.change.x/r.time);r.left=Math.min(r.left+r.left_adjust);if(e.constraint)if(r.left>e.constraint.left){r.left=e.constraint.left;r.time>5e3&&(r.time=5e3)}else if(r.left<e.constraint.right){r.left=e.constraint.right;r.time>5e3&&(r.time=5e3)}VMM.fireEvent(i,"DRAGUPDATE",[r]);s||r.time>0&&(e.touch?VMM.Lib.animate(t,r.time,"easeOutCirc",{left:r.left}):VMM.Lib.animate(t,r.time,e.ease,{left:r.left}))}function v(e){return parseInt(VMM.Lib.css(e,"left").substring(0,VMM.Lib.css(e,"left").length-2),10)}var e={element:"",element_move:"",constraint:"",sliding:!1,pagex:{start:0,end:0},left:{start:0,end:0},time:{start:0,end:0},touch:!1,ease:"easeOutExpo"},t={down:"mousedown",up:"mouseup",leave:"mouseleave",move:"mousemove"},n={down:"mousedown",up:"mouseup",leave:"mouseleave",move:"mousemove"},r={down:"touchstart",up:"touchend",leave:"mouseleave",move:"touchmove"},i=this,s=!1;this.createPanel=function(i,u,a,f,l){e.element=i;e.element_move=u;l!=null&&l!=""&&(s=l);a!=null&&a!=""?e.constraint=a:e.constraint=!1;f?e.touch=f:e.touch=!1;trace("TOUCH"+e.touch);e.touch?t=r:t=n;o(e.element,e.element_move)};this.updateConstraint=function(t){trace("updateConstraint");e.constraint=t};this.cancelSlide=function(n){VMM.unbindEvent(e.element,l,t.move);return!0}});typeof VMM!="undefined"&&typeof VMM.Slider=="undefined"&&(VMM.Slider=function(e,t){function S(){trace("onConfigSet")}function x(e,t){var r=!0,i=!1;e!=null&&(r=e);t!=null&&(i=t);m=n.slider.width;n.slider.nav.height=VMM.Lib.height(E.prevBtnContainer);VMM.Browser.device=="mobile"||m<=640?n.slider.content.padding=10:n.slider.content.padding=n.slider.content.padding_default;n.slider.content.width=m-n.slider.content.padding*2;VMM.Lib.width(u,h.length*n.slider.content.width);i&&VMM.Lib.css(o,"left",h[v].leftpos());B();j();VMM.Lib.css(E.nextBtn,"left",m-n.slider.nav.width);VMM.Lib.height(E.prevBtn,n.slider.height);VMM.Lib.height(E.nextBtn,n.slider.height);VMM.Lib.css(E.nextBtnContainer,"top",n.slider.height/2-n.slider.nav.height/2+10);VMM.Lib.css(E.prevBtnContainer,"top",n.slider.height/2-n.slider.nav.height/2+10);VMM.Lib.height(s,n.slider.height);VMM.Lib.width(s,m);r&&I(v,"linear",1);v==0&&VMM.Lib.visible(E.prevBtn,!1)}function T(e,t){trace("DRAG FINISH");trace(t.left_adjust);trace(n.slider.width/2);if(t.left_adjust<0)if(Math.abs(t.left_adjust)>n.slider.width/2)if(v==h.length-1)q();else{I(v+1,"easeOutExpo");O()}else q();else if(Math.abs(t.left_adjust)>n.slider.width/2)if(v==0)q();else{I(v-1,"easeOutExpo");O()}else q()}function N(e){if(v==h.length-1)q();else{I(v+1);O()}}function C(e){if(v==0)q();else{I(v-1);O()}}function k(e){switch(e.keyCode){case 39:N(e);break;case 37:C(e)}}function L(e,t){if(p.length==0)for(var r=0;r<h.length;r++)p.push(h[r].leftpos());if(typeof t.left=="number"){var i=t.left,s=-h[v].leftpos();i<s-n.slider_width/3?N():i>s+n.slider_width/3?C():VMM.Lib.animate(o,n.duration,n.ease,{left:s})}else VMM.Lib.animate(o,n.duration,n.ease,{left:s});typeof t.top=="number"&&VMM.Lib.animate(o,n.duration,n.ease,{top:-t.top})}function A(e){z()}function O(){n.current_slide=v;VMM.fireEvent(w,"UPDATE")}function M(e){c=e}function _(e){var t=0;VMM.attachElement(u,"");h=[];for(t=0;t<e.length;t++){var n=new VMM.Slider.Slide(e[t],u);h.push(n)}}function D(e){var t=0;if(e)P();else{for(t=0;t<h.length;t++)h[t].clearTimers();r=setTimeout(P,n.duration)}}function P(){var e=0;for(e=0;e<h.length;e++)h[e].enqueue=!0;for(e=0;e<n.preload;e++){if(!(v+e>h.length-1)){h[v+e].show();h[v+e].enqueue=!1}if(!(v-e<0)){h[v-e].show();h[v-e].enqueue=!1}}if(h.length>50)for(e=0;e<h.length;e++)h[e].enqueue&&h[e].hide();B()}function H(e){}function B(){var e=0,t=".slider-item .layout-text-media .media .media-container ",r=".slider-item .layout-media .media .media-container ",i=".slider-item .media .media-container",s=".slider-item .media .media-container .media-shadow .caption",o=!1,u={text_media:{width:n.slider.content.width/100*60,height:n.slider.height-60,video:{width:0,height:0},text:{width:n.slider.content.width/100*40-30,height:n.slider.height}},media:{width:n.slider.content.width,height:n.slider.height-110,video:{width:0,height:0}}};if(VMM.Browser.device=="mobile"||m<=640)o=!0;VMM.master_config.sizes.api.width=u.media.width;VMM.master_config.sizes.api.height=u.media.height;u.text_media.video=VMM.Util.ratio.fit(u.text_media.width,u.text_media.height,16,9);u.media.video=VMM.Util.ratio.fit(u.media.width,u.media.height,16,9);VMM.Lib.css(".slider-item","width",n.slider.content.width);VMM.Lib.height(".slider-item",n.slider.height);if(o){u.text_media.width=n.slider.content.width-n.slider.content.padding*2;u.media.width=n.slider.content.width-n.slider.content.padding*2;u.text_media.height=n.slider.height/100*50-50;u.media.height=n.slider.height/100*70-40;u.text_media.video=VMM.Util.ratio.fit(u.text_media.width,u.text_media.height,16,9);u.media.video=VMM.Util.ratio.fit(u.media.width,u.media.height,16,9);VMM.Lib.css(".slider-item .layout-text-media .text","width","100%");VMM.Lib.css(".slider-item .layout-text-media .text","display","block");VMM.Lib.css(".slider-item .layout-text-media .text .container","display","block");VMM.Lib.css(".slider-item .layout-text-media .text .container","width",u.media.width);VMM.Lib.css(".slider-item .layout-text-media .text .container .start","width","auto");VMM.Lib.css(".slider-item .layout-text-media .media","float","none");VMM.Lib.addClass(".slider-item .content-container","pad-top");VMM.Lib.css(".slider-item .media blockquote p","line-height","18px");VMM.Lib.css(".slider-item .media blockquote p","font-size","16px");VMM.Lib.css(".slider-item","overflow-y","auto")}else{VMM.Lib.css(".slider-item .layout-text-media .text","width","40%");VMM.Lib.css(".slider-item .layout-text-media .text","display","table-cell");VMM.Lib.css(".slider-item .layout-text-media .text .container","display","table-cell");VMM.Lib.css(".slider-item .layout-text-media .text .container","width","auto");VMM.Lib.css(".slider-item .layout-text-media .text .container .start","width",u.text_media.text.width);VMM.Lib.removeClass(".slider-item .content-container","pad-top");VMM.Lib.css(".slider-item .layout-text-media .media","float","left");VMM.Lib.css(".slider-item .layout-text-media","display","table");VMM.Lib.css(".slider-item .media blockquote p","line-height","36px");VMM.Lib.css(".slider-item .media blockquote p","font-size","28px");VMM.Lib.css(".slider-item","display","table");VMM.Lib.css(".slider-item","overflow-y","auto")}VMM.Lib.css(t+".media-frame","max-width",u.text_media.width);VMM.Lib.height(t+".media-frame",u.text_media.height);VMM.Lib.width(t+".media-frame",u.text_media.width);VMM.Lib.css(t+"img","max-height",u.text_media.height);VMM.Lib.css(r+"img","max-height",u.media.height);VMM.Lib.css(t+"img","max-width",u.text_media.width);VMM.Lib.css(t+".avatar img","max-width",32);VMM.Lib.css(t+".avatar img","max-height",32);VMM.Lib.css(r+".avatar img","max-width",32);VMM.Lib.css(r+".avatar img","max-height",32);VMM.Lib.css(t+".article-thumb","max-width","50%");VMM.Lib.css(r+".article-thumb","max-width",200);VMM.Lib.width(t+".media-frame",u.text_media.video.width);VMM.Lib.height(t+".media-frame",u.text_media.video.height);VMM.Lib.width(r+".media-frame",u.media.video.width);VMM.Lib.height(r+".media-frame",u.media.video.height);VMM.Lib.css(r+".media-frame","max-height",u.media.video.height);VMM.Lib.css(r+".media-frame","max-width",u.media.video.width);VMM.Lib.height(r+".soundcloud",168);VMM.Lib.height(t+".soundcloud",168);VMM.Lib.width(r+".soundcloud",u.media.width);VMM.Lib.width(t+".soundcloud",u.text_media.width);VMM.Lib.css(i+".soundcloud","max-height",168);VMM.Lib.height(t+".map",u.text_media.height);VMM.Lib.width(t+".map",u.text_media.width);VMM.Lib.css(r+".map","max-height",u.media.height);VMM.Lib.width(r+".map",u.media.width);VMM.Lib.height(t+".doc",u.text_media.height);VMM.Lib.width(t+".doc",u.text_media.width);VMM.Lib.height(r+".doc",u.media.height);VMM.Lib.width(r+".doc",u.media.width);VMM.Lib.width(r+".wikipedia",u.media.width);VMM.Lib.width(r+".twitter",u.media.width);VMM.Lib.width(r+".plain-text-quote",u.media.width);VMM.Lib.width(r+".plain-text",u.media.width);VMM.Lib.css(i,"max-width",u.media.width);VMM.Lib.css(t+".caption","max-width",u.text_media.video.width);VMM.Lib.css(r+".caption","max-width",u.media.video.width);for(e=0;e<h.length;e++){h[e].layout(o);h[e].content_height()>n.slider.height+20?h[e].css("display","block"):h[e].css("display","table")}}function I(e,t,r,s,u){var a=n.ease,f=n.duration,l=!1,p=!1,d="",m;VMM.ExternalAPI.youtube.stopPlayers();v=e;m=h[v].leftpos();v==0&&(p=!0);v+1>=h.length&&(l=!0);t!=null&&t!=""&&(a=t);r!=null&&r!=""&&(f=r);if(VMM.Browser.device=="mobile"){VMM.Lib.visible(E.prevBtn,!1);VMM.Lib.visible(E.nextBtn,!1)}else{if(p)VMM.Lib.visible(E.prevBtn,!1);else{VMM.Lib.visible(E.prevBtn,!0);d=VMM.Util.unlinkify(c[v-1].title);if(n.type=="timeline")if(typeof c[v-1].date=="undefined"){VMM.attachElement(E.prevDate,d);VMM.attachElement(E.prevTitle,"")}else{VMM.attachElement(E.prevDate,VMM.Date.prettyDate(c[v-1].startdate));VMM.attachElement(E.prevTitle,d)}else VMM.attachElement(E.prevTitle,d)}if(l)VMM.Lib.visible(E.nextBtn,!1);else{VMM.Lib.visible(E.nextBtn,!0);d=VMM.Util.unlinkify(c[v+1].title);if(n.type=="timeline")if(typeof c[v+1].date=="undefined"){VMM.attachElement(E.nextDate,d);VMM.attachElement(E.nextTitle,"")}else{VMM.attachElement(E.nextDate,VMM.Date.prettyDate(c[v+1].startdate));VMM.attachElement(E.nextTitle,d)}else VMM.attachElement(E.nextTitle,d)}}if(s)VMM.Lib.css(o,"left",-(m-n.slider.content.padding));else{VMM.Lib.stop(o);VMM.Lib.animate(o,f,a,{left:-(m-n.slider.content.padding)})}u&&VMM.fireEvent(w,"LOADED");if(h[v].height()>n.slider_height)VMM.Lib.css(".slider","overflow-y","scroll");else{VMM.Lib.css(w,"overflow-y","hidden");var g=0;try{g=VMM.Lib.prop(w,"scrollHeight");VMM.Lib.animate(w,f,a,{scrollTop:g-VMM.Lib.height(w)})}catch(y){g=VMM.Lib.height(w)}}D();VMM.fireEvent(i,"MESSAGE","TEST")}function q(){VMM.Lib.stop(o);VMM.Lib.animate(o,n.duration,"easeOutExpo",{left:-h[v].leftpos()+n.slider.content.padding})}function R(e,t,n){trace("showMessege "+t);VMM.attachElement(f,"<div class='vco-explainer'><div class='vco-explainer-container'><div class='vco-bezel'><div class='vco-gesture-icon'></div><div class='vco-message'><p>"+t+"</p></div></div></div></div>")}function U(){VMM.Lib.animate(f,n.duration,n.ease,{opacity:0},z)}function z(){VMM.Lib.detach(f)}function W(){var e="<div class='icon'>&nbsp;</div>";E.nextBtn=VMM.appendAndGetElement(i,"<div>","nav-next");E.prevBtn=VMM.appendAndGetElement(i,"<div>","nav-previous");E.nextBtnContainer=VMM.appendAndGetElement(E.nextBtn,"<div>","nav-container",e);E.prevBtnContainer=VMM.appendAndGetElement(E.prevBtn,"<div>","nav-container",e);if(n.type=="timeline"){E.nextDate=VMM.appendAndGetElement(E.nextBtnContainer,"<div>","date","");E.prevDate=VMM.appendAndGetElement(E.prevBtnContainer,"<div>","date","")}E.nextTitle=VMM.appendAndGetElement(E.nextBtnContainer,"<div>","title","");E.prevTitle=VMM.appendAndGetElement(E.prevBtnContainer,"<div>","title","");VMM.bindEvent(".nav-next",N);VMM.bindEvent(".nav-previous",C);VMM.bindEvent(window,k,"keydown")}function X(){var e=3e3;VMM.attachElement(w,"");i=VMM.getElement(w);s=VMM.appendAndGetElement(i,"<div>","slider-container-mask");o=VMM.appendAndGetElement(s,"<div>","slider-container");u=VMM.appendAndGetElement(o,"<div>","slider-item-container");W();_(c);if(VMM.Browser.device=="tablet"||VMM.Browser.device=="mobile"){n.duration=500;e=1e3;a=new VMM.DragSlider;a.createPanel(i,o,"",n.touch,!0);VMM.bindEvent(a,T,"DRAGUPDATE");f=VMM.appendAndGetElement(s,"<div>","vco-feedback","");R(null,"Swipe to Navigate");VMM.Lib.height(f,n.slider.height);VMM.bindEvent(f,A)}x(!1,!0);VMM.Lib.visible(E.prevBtn,!1);I(n.current_slide,"easeOutExpo",e,!0,!0);b=!0}var n,r,i,s,o,u,a,f,l={},c=[],h=[],p=[],d="",v=0,m=960,g={move:!1,x:10,y:0,off:0,dampen:48},y="",b=!1,w=e,E={nextBtn:"",prevBtn:"",nextDate:"",prevDate:"",nextTitle:"",prevTitle:""};typeof t!="undefined"?n=t:n={preload:4,current_slide:0,interval:10,something:0,width:720,height:400,ease:"easeInOutExpo",duration:1e3,timeline:!1,spacing:15,slider:{width:720,height:400,content:{width:720,height:400,padding:120,padding_default:120},nav:{width:100,height:200}}};this.ver="0.6";n.slider.width=n.width;n.slider.height=n.height;this.init=function(e){h=[];p=[];typeof e!="undefined"?this.setData(e):trace("WAITING ON DATA")};this.width=function(e){if(e==null||e=="")return n.slider.width;n.slider.width=e;x()};this.height=function(e){if(e==null||e=="")return n.slider.height;n.slider.height=e;x()};this.setData=function(e){if(typeof e!="undefined"){c=e;X()}else trace("NO DATA")};this.getData=function(){return c};this.setConfig=function(e){typeof e!="undefined"?n=e:trace("NO CONFIG DATA")};this.getConfig=function(){return n};this.setSize=function(e,t){e!=null&&(n.slider.width=e);t!=null&&(n.slider.height=t);b&&x()};this.active=function(){return b};this.getCurrentNumber=function(){return v};this.setSlide=function(e){I(e)};var j=function(){var e=0,t=0;for(t=0;t<h.length;t++){e=t*(n.slider.width+n.spacing);h[t].leftpos(e)}},F=function(e){var t="linear",r=0;for(r=0;r<h.length;r++)r==v?h[r].animate(n.duration,t,{opacity:1}):r==v-1||r==v+1?h[r].animate(n.duration,t,{opacity:.1}):h[r].opacity(e)}});typeof VMM.Slider!="undefined"&&(VMM.Slider.Slide=function(e,t){var n,r,i,s,o,u,a=e,f={},o="",l="",c=!1,h=!1,p=!1,d=!0,v=!1,m="slide_",g={pushque:"",render:"",relayout:"",remove:"",skinny:!1},y={pushque:500,render:100,relayout:100,remove:3e4};m+=a.uniqueid;this.enqueue=d;this.id=m;o=VMM.appendAndGetElement(t,"<div>","slider-item");u={slide:"",text:"",media:"",media_element:"",layout:"content-container layout",has:{headline:!1,text:!1,media:!1}};this.show=function(e){d=!1;g.skinny=e;v=!1;clearTimeout(g.remove);if(!c)if(h){clearTimeout(g.relayout);g.relayout=setTimeout(E,y.relayout)}else b(e)};this.hide=function(){if(c&&!v){v=!0;clearTimeout(g.remove);g.remove=setTimeout(w,y.remove)}};this.clearTimers=function(){clearTimeout(g.relayout);clearTimeout(g.pushque);clearTimeout(g.render)};this.layout=function(e){c&&h&&S(e)};this.elem=function(){return o};this.position=function(){return VMM.Lib.position(o)};this.leftpos=function(e){if(typeof e=="undefined")return VMM.Lib.position(o).left;VMM.Lib.css(o,"left",e)};this.animate=function(e,t,n){VMM.Lib.animate(o,e,t,n)};this.css=function(e,t){VMM.Lib.css(o,e,t)};this.opacity=function(e){VMM.Lib.css(o,"opacity",e)};this.width=function(){return VMM.Lib.width(o)};this.height=function(){return VMM.Lib.height(o)};this.content_height=function(){var e=VMM.Lib.find(o,".content")[0];return e!="undefined"&&e!=null?VMM.Lib.height(e):0};var b=function(e){trace("RENDER "+m);c=!0;h=!0;g.skinny=e;x();clearTimeout(g.pushque);clearTimeout(g.render);g.pushque=setTimeout(VMM.ExternalAPI.pushQues,y.pushque)},w=function(){trace("REMOVE SLIDE TIMER FINISHED");c=!1;VMM.Lib.detach(r);VMM.Lib.detach(n)},E=function(){c=!0;S(g.skinny,!0)},S=function(e,t){if(u.has.text){if(e){if(!p||t){VMM.Lib.removeClass(i,"pad-left");VMM.Lib.detach(r);VMM.Lib.detach(n);VMM.Lib.append(i,r);VMM.Lib.append(i,n);p=!0}}else if(p||t){VMM.Lib.addClass(i,"pad-left");VMM.Lib.detach(r);VMM.Lib.detach(n);VMM.Lib.append(i,n);VMM.Lib.append(i,r);p=!1}}else if(t){if(u.has.headline){VMM.Lib.detach(r);VMM.Lib.append(i,r)}VMM.Lib.detach(n);VMM.Lib.append(i,n)}},x=function(){trace("BUILDSLIDE");s=VMM.appendAndGetElement(o,"<div>","content");i=VMM.appendAndGetElement(s,"<div>");if(a.startdate!=null&&a.startdate!=""&&type.of(a.startdate)=="date"&&a.type!="start"){var e=VMM.Date.prettyDate(a.startdate),t=VMM.Date.prettyDate(a.enddate),f="";a.tag!=null&&a.tag!=""&&(f=VMM.createElement("span",a.tag,"slide-tag"));e!=t?u.text+=VMM.createElement("h2",e+" &mdash; "+t+f,"date"):u.text+=VMM.createElement("h2",e+f,"date")}if(a.headline!=null&&a.headline!=""){u.has.headline=!0;a.type=="start"?u.text+=VMM.createElement("h2",VMM.Util.linkify_with_twitter(a.headline,"_blank"),"start"):u.text+=VMM.createElement("h3",VMM.Util.linkify_with_twitter(a.headline,"_blank"))}if(a.text!=null&&a.text!=""){u.has.text=!0;u.text+=VMM.createElement("p",VMM.Util.linkify_with_twitter(a.text,"_blank"))}if(u.has.text||u.has.headline){u.text=VMM.createElement("div",u.text,"container");r=VMM.appendAndGetElement(i,"<div>","text",VMM.TextElement.create(u.text))}a.needs_slug;if(a.asset!=null&&a.asset!=""&&a.asset.media!=null&&a.asset.media!=""){u.has.media=!0;n=VMM.appendAndGetElement(i,"<div>","media",VMM.MediaElement.create(a.asset,a.uniqueid))}u.has.text&&(u.layout+="-text");u.has.media&&(u.layout+="-media");if(u.has.text)if(g.skinny){VMM.Lib.addClass(i,u.layout);p=!0}else{VMM.Lib.addClass(i,u.layout);VMM.Lib.addClass(i,"pad-left");VMM.Lib.detach(r);VMM.Lib.append(i,r)}else VMM.Lib.addClass(i,u.layout)}});var Aes={};Aes.cipher=function(e,t){var n=4,r=t.length/n-1,i=[[],[],[],[]];for(var s=0;s<4*n;s++)i[s%4][Math.floor(s/4)]=e[s];i=Aes.addRoundKey(i,t,0,n);for(var o=1;o<r;o++){i=Aes.subBytes(i,n);i=Aes.shiftRows(i,n);i=Aes.mixColumns(i,n);i=Aes.addRoundKey(i,t,o,n)}i=Aes.subBytes(i,n);i=Aes.shiftRows(i,n);i=Aes.addRoundKey(i,t,r,n);var u=new Array(4*n);for(var s=0;s<4*n;s++)u[s]=i[s%4][Math.floor(s/4)];return u};Aes.keyExpansion=function(e){var t=4,n=e.length/4,r=n+6,i=new Array(t*(r+1)),s=new Array(4);for(var o=0;o<n;o++){var u=[e[4*o],e[4*o+1],e[4*o+2],e[4*o+3]];i[o]=u}for(var o=n;o<t*(r+1);o++){i[o]=new Array(4);for(var a=0;a<4;a++)s[a]=i[o-1][a];if(o%n==0){s=Aes.subWord(Aes.rotWord(s));for(var a=0;a<4;a++)s[a]^=Aes.rCon[o/n][a]}else n>6&&o%n==4&&(s=Aes.subWord(s));for(var a=0;a<4;a++)i[o][a]=i[o-n][a]^s[a]}return i};Aes.subBytes=function(e,t){for(var n=0;n<4;n++)for(var r=0;r<t;r++)e[n][r]=Aes.sBox[e[n][r]];return e};Aes.shiftRows=function(e,t){var n=new Array(4);for(var r=1;r<4;r++){for(var i=0;i<4;i++)n[i]=e[r][(i+r)%t];for(var i=0;i<4;i++)e[r][i]=n[i]}return e};Aes.mixColumns=function(e,t){for(var n=0;n<4;n++){var r=new Array(4),i=new Array(4);for(var s=0;s<4;s++){r[s]=e[s][n];i[s]=e[s][n]&128?e[s][n]<<1^283:e[s][n]<<1}e[0][n]=i[0]^r[1]^i[1]^r[2]^r[3];e[1][n]=r[0]^i[1]^r[2]^i[2]^r[3];e[2][n]=r[0]^r[1]^i[2]^r[3]^i[3];e[3][n]=r[0]^i[0]^r[1]^r[2]^i[3]}return e};Aes.addRoundKey=function(e,t,n,r){for(var i=0;i<4;i++)for(var s=0;s<r;s++)e[i][s]^=t[n*4+s][i];return e};Aes.subWord=function(e){for(var t=0;t<4;t++)e[t]=Aes.sBox[e[t]];return e};Aes.rotWord=function(e){var t=e[0];for(var n=0;n<3;n++)e[n]=e[n+1];e[3]=t;return e};Aes.sBox=[99,124,119,123,242,107,111,197,48,1,103,43,254,215,171,118,202,130,201,125,250,89,71,240,173,212,162,175,156,164,114,192,183,253,147,38,54,63,247,204,52,165,229,241,113,216,49,21,4,199,35,195,24,150,5,154,7,18,128,226,235,39,178,117,9,131,44,26,27,110,90,160,82,59,214,179,41,227,47,132,83,209,0,237,32,252,177,91,106,203,190,57,74,76,88,207,208,239,170,251,67,77,51,133,69,249,2,127,80,60,159,168,81,163,64,143,146,157,56,245,188,182,218,33,16,255,243,210,205,12,19,236,95,151,68,23,196,167,126,61,100,93,25,115,96,129,79,220,34,42,144,136,70,238,184,20,222,94,11,219,224,50,58,10,73,6,36,92,194,211,172,98,145,149,228,121,231,200,55,109,141,213,78,169,108,86,244,234,101,122,174,8,186,120,37,46,28,166,180,198,232,221,116,31,75,189,139,138,112,62,181,102,72,3,246,14,97,53,87,185,134,193,29,158,225,248,152,17,105,217,142,148,155,30,135,233,206,85,40,223,140,161,137,13,191,230,66,104,65,153,45,15,176,84,187,22];Aes.rCon=[[0,0,0,0],[1,0,0,0],[2,0,0,0],[4,0,0,0],[8,0,0,0],[16,0,0,0],[32,0,0,0],[64,0,0,0],[128,0,0,0],[27,0,0,0],[54,0,0,0]];Aes.Ctr={};Aes.Ctr.encrypt=function(e,t,n){var r=16;if(n!=128&&n!=192&&n!=256)return"";e=Utf8.encode(e);t=Utf8.encode(t);var i=n/8,s=new Array(i);for(var o=0;o<i;o++)s[o]=isNaN(t.charCodeAt(o))?0:t.charCodeAt(o);var u=Aes.cipher(s,Aes.keyExpansion(s));u=u.concat(u.slice(0,i-16));var a=new Array(r),f=(new Date).getTime(),l=f%1e3,c=Math.floor(f/1e3),h=Math.floor(Math.random()*65535);for(var o=0;o<2;o++)a[o]=l>>>o*8&255;for(var o=0;o<2;o++)a[o+2]=h>>>o*8&255;for(var o=0;o<4;o++)a[o+4]=c>>>o*8&255;var p="";for(var o=0;o<8;o++)p+=String.fromCharCode(a[o]);var d=Aes.keyExpansion(u),v=Math.ceil(e.length/r),m=new Array(v);for(var g=0;g<v;g++){for(var y=0;y<4;y++)a[15-y]=g>>>y*8&255;for(var y=0;y<4;y++)a[15-y-4]=g/4294967296>>>y*8;var b=Aes.cipher(a,d),w=g<v-1?r:(e.length-1)%r+1,E=new Array(w);for(var o=0;o<w;o++){E[o]=b[o]^e.charCodeAt(g*r+o);E[o]=String.fromCharCode(E[o])}m[g]=E.join("")}var S=p+m.join("");S=Base64.encode(S);return S};Aes.Ctr.decrypt=function(e,t,n){var r=16;if(n!=128&&n!=192&&n!=256)return"";e=Base64.decode(e);t=Utf8.encode(t);var i=n/8,s=new Array(i);for(var o=0;o<i;o++)s[o]=isNaN(t.charCodeAt(o))?0:t.charCodeAt(o);var u=Aes.cipher(s,Aes.keyExpansion(s));u=u.concat(u.slice(0,i-16));var a=new Array(8);ctrTxt=e.slice(0,8);for(var o=0;o<8;o++)a[o]=ctrTxt.charCodeAt(o);var f=Aes.keyExpansion(u),l=Math.ceil((e.length-8)/r),c=new Array(l);for(var h=0;h<l;h++)c[h]=e.slice(8+h*r,8+h*r+r);e=c;var p=new Array(e.length);for(var h=0;h<l;h++){for(var d=0;d<4;d++)a[15-d]=h>>>d*8&255;for(var d=0;d<4;d++)a[15-d-4]=(h+1)/4294967296-1>>>d*8&255;var v=Aes.cipher(a,f),m=new Array(e[h].length);for(var o=0;o<e[h].length;o++){m[o]=v[o]^e[h].charCodeAt(o);m[o]=String.fromCharCode(m[o])}p[h]=m.join("")}var g=p.join("");g=Utf8.decode(g);return g};var Base64={};Base64.code="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";Base64.encode=function(e,t){t=typeof t=="undefined"?!1:t;var n,r,i,s,o,u,a,f,l=[],c="",h,p,d,v=Base64.code;p=t?e.encodeUTF8():e;h=p.length%3;if(h>0)while(h++<3){c+="=";p+="\0"}for(h=0;h<p.length;h+=3){n=p.charCodeAt(h);r=p.charCodeAt(h+1);i=p.charCodeAt(h+2);s=n<<16|r<<8|i;o=s>>18&63;u=s>>12&63;a=s>>6&63;f=s&63;l[h/3]=v.charAt(o)+v.charAt(u)+v.charAt(a)+v.charAt(f)}d=l.join("");d=d.slice(0,d.length-c.length)+c;return d};Base64.decode=function(e,t){t=typeof t=="undefined"?!1:t;var n,r,i,s,o,u,a,f,l=[],c,h,p=Base64.code;h=t?e.decodeUTF8():e;for(var d=0;d<h.length;d+=4){s=p.indexOf(h.charAt(d));o=p.indexOf(h.charAt(d+1));u=p.indexOf(h.charAt(d+2));a=p.indexOf(h.charAt(d+3));f=s<<18|o<<12|u<<6|a;n=f>>>16&255;r=f>>>8&255;i=f&255;l[d/4]=String.fromCharCode(n,r,i);a==64&&(l[d/4]=String.fromCharCode(n,r));u==64&&(l[d/4]=String.fromCharCode(n))}c=l.join("");return t?c.decodeUTF8():c};var Utf8={};Utf8.encode=function(e){var t=e.replace(/[\u0080-\u07ff]/g,function(e){var t=e.charCodeAt(0);return String.fromCharCode(192|t>>6,128|t&63)});t=t.replace(/[\u0800-\uffff]/g,function(e){var t=e.charCodeAt(0);return String.fromCharCode(224|t>>12,128|t>>6&63,128|t&63)});return t};Utf8.decode=function(e){var t=e.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,function(e){var t=(e.charCodeAt(0)&15)<<12|(e.charCodeAt(1)&63)<<6|e.charCodeAt(2)&63;return String.fromCharCode(t)});t=t.replace(/[\u00c0-\u00df][\u0080-\u00bf]/g,function(e){var t=(e.charCodeAt(0)&31)<<6|e.charCodeAt(1)&63;return String.fromCharCode(t)});return t};!function(e){"use strict";var t=function(e,t){this.init("tooltip",e,t)};t.prototype={constructor:t,init:function(t,n,r){var i,s;this.type=t;this.$element=e(n);this.options=this.getOptions(r);this.enabled=!0;if(this.options.trigger!="manual"){i=this.options.trigger=="hover"?"mouseenter":"focus";s=this.options.trigger=="hover"?"mouseleave":"blur";this.$element.on(i,this.options.selector,e.proxy(this.enter,this));this.$element.on(s,this.options.selector,e.proxy(this.leave,this))}this.options.selector?this._options=e.extend({},this.options,{trigger:"manual",selector:""}):this.fixTitle()},getOptions:function(t){t=e.extend({},e.fn[this.type].defaults,t,this.$element.data());t.delay&&typeof t.delay=="number"&&(t.delay={show:t.delay,hide:t.delay});return t},enter:function(t){var n=e(t.currentTarget)[this.type](this._options).data(this.type);if(!n.options.delay||!n.options.delay.show)n.show();else{n.hoverState="in";setTimeout(function(){n.hoverState=="in"&&n.show()},n.options.delay.show)}},leave:function(t){var n=e(t.currentTarget)[this.type](this._options).data(this.type);if(!n.options.delay||!n.options.delay.hide)n.hide();else{n.hoverState="out";setTimeout(function(){n.hoverState=="out"&&n.hide()},n.options.delay.hide)}},show:function(){var e,t,n,r,i,s,o;if(this.hasContent()&&this.enabled){e=this.tip();this.setContent();this.options.animation&&e.addClass("fade");s=typeof this.options.placement=="function"?this.options.placement.call(this,e[0],this.$element[0]):this.options.placement;t=/in/.test(s);e.remove().css({top:0,left:0,display:"block"}).appendTo(t?this.$element:document.body);n=this.getPosition(t);r=e[0].offsetWidth;i=e[0].offsetHeight;switch(t?s.split(" ")[1]:s){case"bottom":o={top:n.top+n.height,left:n.left+n.width/2-r/2};break;case"top":o={top:n.top-i,left:n.left+n.width/2-r/2};break;case"left":o={top:n.top+n.height/2-i/2,left:n.left-r};break;case"right":o={top:n.top+n.height/2-i/2,left:n.left+n.width}}e.css(o).addClass(s).addClass("in")}},setContent:function(){var e=this.tip();e.find(".tooltip-inner").html(this.getTitle());e.removeClass("fade in top bottom left right")},hide:function(){function r(){var t=setTimeout(function(){n.off(e.support.transition.end).remove()},500);n.one(e.support.transition.end,function(){clearTimeout(t);n.remove()})}var t=this,n=this.tip();n.removeClass("in");e.support.transition&&this.$tip.hasClass("fade")?r():n.remove()},fixTitle:function(){var e=this.$element;(e.attr("title")||typeof e.attr("data-original-title")!="string")&&e.attr("data-original-title",e.attr("title")||"").removeAttr("title")},hasContent:function(){return this.getTitle()},getPosition:function(t){return e.extend({},t?{top:0,left:0}:this.$element.offset(),{width:this.$element[0].offsetWidth,height:this.$element[0].offsetHeight})},getTitle:function(){var e,t=this.$element,n=this.options;e=t.attr("data-original-title")||(typeof n.title=="function"?n.title.call(t[0]):n.title);e=e.toString().replace(/(^\s*|\s*$)/,"");return e},tip:function(){return this.$tip=this.$tip||e(this.options.template)},validate:function(){if(!this.$element[0].parentNode){this.hide();this.$element=null;this.options=null}},enable:function(){this.enabled=!0},disable:function(){this.enabled=!1},toggleEnabled:function(){this.enabled=!this.enabled},toggle:function(){this[this.tip().hasClass("in")?"hide":"show"]()}};e.fn.tooltip=function(n){return this.each(function(){var r=e(this),i=r.data("tooltip"),s=typeof n=="object"&&n;i||r.data("tooltip",i=new t(this,s));typeof n=="string"&&i[n]()})};e.fn.tooltip.Constructor=t;e.fn.tooltip.defaults={animation:!0,delay:0,selector:!1,placement:"top",trigger:"hover",title:"",template:'<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>'}}(window.jQuery);typeof VMM!="undefined"&&typeof VMM.StoryJS=="undefined"&&(VMM.StoryJS=function(){this.init=function(e){}});if(typeof VMM!="undefined"&&typeof VMM.Timeline=="undefined"){VMM.Timeline=function(e,t,n){function S(e){typeof embed_config=="object"&&(timeline_config=embed_config);if(typeof timeline_config=="object"){trace("HAS TIMELINE CONFIG");m=VMM.Util.mergeConfig(m,timeline_config)}else typeof e=="object"&&(m=VMM.Util.mergeConfig(m,e));if(VMM.Browser.device=="mobile"||VMM.Browser.device=="tablet")m.touch=!0;m.nav.width=m.width;m.nav.height=200;m.feature.width=m.width;m.feature.height=m.height-m.nav.height;m.nav.zoom.adjust=parseInt(m.start_zoom_adjust,10);VMM.Timeline.Config=m;VMM.master_config.Timeline=VMM.Timeline.Config;this.events=m.events;m.gmap_key!=""&&(m.api_keys.google=m.gmap_key);trace("VERSION "+m.version);c=m.version}function x(){r=VMM.getElement(h);VMM.Lib.addClass(r,"vco-timeline");VMM.Lib.addClass(r,"vco-storyjs");i=VMM.appendAndGetElement(r,"<div>","vco-container vco-main");s=VMM.appendAndGetElement(i,"<div>","vco-feature");u=VMM.appendAndGetElement(s,"<div>","vco-slider");a=VMM.appendAndGetElement(i,"<div>","vco-navigation");o=VMM.appendAndGetElement(r,"<div>","vco-feedback","");typeof m.language.right_to_left!="undefined"&&VMM.Lib.addClass(r,"vco-right-to-left");f=new VMM.Slider(u,m);l=new VMM.Timeline.TimeNav(a);g?VMM.Lib.width(r,m.width):m.width=VMM.Lib.width(r);y?VMM.Lib.height(r,m.height):m.height=VMM.Lib.height(r);m.touch?VMM.Lib.addClass(r,"vco-touch"):VMM.Lib.addClass(r,"vco-notouch")}function T(e,t){trace("onDataReady");d=t.timeline;type.of(d.era)!="array"&&(d.era=[]);X()}function N(){U()}function C(){W();f.setSize(m.feature.width,m.feature.height);l.setSize(m.width,m.height);j()&&H()}function k(e){m.loaded.slider=!0;L()}function L(e){m.loaded.percentloaded=m.loaded.percentloaded+25;m.loaded.slider&&
m.loaded.timenav&&q()}function A(e){m.loaded.timenav=!0;L()}function O(e){w=!0;m.current_slide=f.getCurrentNumber();D(m.current_slide);l.setMarker(m.current_slide,m.ease,m.duration)}function M(e){w=!0;m.current_slide=l.getCurrentNumber();D(m.current_slide);f.setSlide(m.current_slide)}function _(e){if(e<=v.length-1&&e>=0){m.current_slide=e;f.setSlide(m.current_slide);l.setMarker(m.current_slide,m.ease,m.duration)}}function D(e){m.hash_bookmark&&(window.location.hash="#"+e.toString())}function P(){}function H(){var e="",t=B(window.orientation);VMM.Browser.device=="mobile"?t=="portrait"?e="width=device-width; initial-scale=0.5, maximum-scale=0.5":t=="landscape"?e="width=device-width; initial-scale=0.5, maximum-scale=0.5":e="width=device-width, initial-scale=1, maximum-scale=1.0":VMM.Browser.device=="tablet";document.getElementById("viewport")}function B(e){var t="";e==0||e==180?t="portrait":e==90||e==-90?t="landscape":t="normal";return t}function j(){var e=B(window.orientation);if(e==m.orientation)return!1;m.orientation=e;return!0}function F(e){VMM.getJSON(e,function(e){d=VMM.Timeline.DataObj.getData(e);VMM.fireEvent(global,m.events.data_ready)})}function I(e,t,n){trace("showMessege "+t);n?VMM.attachElement(o,t):VMM.attachElement(o,VMM.MediaElement.loadingmessage(t))}function q(){VMM.Lib.animate(o,m.duration,m.ease*4,{opacity:0},R)}function R(){VMM.Lib.detach(o)}function U(){parseInt(m.start_at_slide)>0&&m.current_slide==0&&(m.current_slide=parseInt(m.start_at_slide));m.start_at_end&&m.current_slide==0&&(m.current_slide=v.length-1);if(b){b=!0;VMM.fireEvent(global,m.events.messege,"Internet Explorer "+VMM.Browser.version+" is not supported by TimelineJS. Please update your browser to version 8 or higher.")}else{R();C();VMM.bindEvent(u,k,"LOADED");VMM.bindEvent(a,A,"LOADED");VMM.bindEvent(u,O,"UPDATE");VMM.bindEvent(a,M,"UPDATE");f.init(v);l.init(v,d.era);VMM.bindEvent(global,C,m.events.resize)}}function z(){trace("IE7 or lower");for(var e=0;e<v.length;e++)trace(v[e])}function W(){trace("UPDATE SIZE");m.width=VMM.Lib.width(r);m.height=VMM.Lib.height(r);m.nav.width=m.width;m.feature.width=m.width;m.feature.height=m.height-m.nav.height-3;VMM.Browser.device=="mobile";m.width<640?VMM.Lib.addClass(r,"vco-skinny"):VMM.Lib.removeClass(r,"vco-skinny")}function X(){v=[];VMM.fireEvent(global,m.events.messege,"Building Dates");W();for(var e=0;e<d.date.length;e++)if(d.date[e].startDate!=null&&d.date[e].startDate!=""){var t={};d.date[e].type=="tweets"?t.startdate=VMM.ExternalAPI.twitter.parseTwitterDate(d.date[e].startDate):t.startdate=VMM.Date.parse(d.date[e].startDate);if(!isNaN(t.startdate)){d.date[e].endDate!=null&&d.date[e].endDate!=""?d.date[e].type=="tweets"?t.enddate=VMM.ExternalAPI.twitter.parseTwitterDate(d.date[e].endDate):t.enddate=VMM.Date.parse(d.date[e].endDate):t.enddate=t.startdate;t.needs_slug=!1;d.date[e].headline==""&&d.date[e].slug!=null&&d.date[e].slug!=""&&(t.needs_slug=!0);t.title=d.date[e].headline;t.headline=d.date[e].headline;t.type=d.date[e].type;t.date=VMM.Date.prettyDate(t.startdate);t.asset=d.date[e].asset;t.fulldate=t.startdate.getTime();t.text=d.date[e].text;t.content="";t.tag=d.date[e].tag;t.slug=d.date[e].slug;t.uniqueid=VMM.Util.unique_ID(7);v.push(t)}}d.type!="storify"&&v.sort(function(e,t){return e.fulldate-t.fulldate});if(d.headline!=null&&d.headline!=""&&d.text!=null&&d.text!=""){var n,t={},r=0,i;typeof d.startDate!="undefined"?n=VMM.Date.parse(d.startDate):n=!1;trace("HAS STARTPAGE");trace(n);if(n&&n<v[0].startdate)t.startdate=new Date(n);else{i=v[0].startdate;t.startdate=new Date(v[0].startdate);i.getMonth()===0&&i.getDate()==1&&i.getHours()===0&&i.getMinutes()===0?t.startdate.setFullYear(i.getFullYear()-1):i.getDate()<=1&&i.getHours()===0&&i.getMinutes()===0?t.startdate.setMonth(i.getMonth()-1):i.getHours()===0&&i.getMinutes()===0?t.startdate.setDate(i.getDate()-1):i.getMinutes()===0?t.startdate.setHours(i.getHours()-1):t.startdate.setMinutes(i.getMinutes()-1)}t.uniqueid=VMM.Util.unique_ID(7);t.enddate=t.startdate;t.title=d.headline;t.headline=d.headline;t.text=d.text;t.type="start";t.date=VMM.Date.prettyDate(d.startDate);t.asset=d.asset;t.slug=!1;t.needs_slug=!1;t.fulldate=t.startdate.getTime();m.embed&&VMM.fireEvent(global,m.events.headline,t.headline);v.unshift(t)}d.type!="storify"&&v.sort(function(e,t){return e.fulldate-t.fulldate});N()}var r,i,s,o,u,a,f,l,c="2.x",h="#timelinejs",p={},d={},v=[],m={},g=!1,y=!1,b=!1,w=!1;type.of(e)=="string"?e.match("#")?h=e:h="#"+e:h="#timelinejs";m={embed:!1,events:{data_ready:"DATAREADY",messege:"MESSEGE",headline:"HEADLINE",slide_change:"SLIDE_CHANGE",resize:"resize"},id:h,source:"nothing",type:"timeline",touch:!1,orientation:"normal",maptype:"toner",version:"2.x",preload:4,current_slide:0,hash_bookmark:!1,start_at_end:!1,start_at_slide:0,start_zoom_adjust:0,start_page:!1,api_keys:{google:"",flickr:"",twitter:""},interval:10,something:0,width:960,height:540,spacing:15,loaded:{slider:!1,timenav:!1,percentloaded:0},nav:{start_page:!1,interval_width:200,density:4,minor_width:0,minor_left:0,constraint:{left:0,right:0,right_min:0,right_max:0},zoom:{adjust:0},multiplier:{current:6,min:.1,max:50},rows:[1,1,1],width:960,height:200,marker:{width:150,height:50}},feature:{width:960,height:540},slider:{width:720,height:400,content:{width:720,height:400,padding:130,padding_default:130},nav:{width:100,height:200}},ease:"easeInOutExpo",duration:1e3,gmap_key:"",language:VMM.Language};if(t!=null&&t!=""){m.width=t;g=!0}if(n!=null&&n!=""){m.height=n;y=!0}if(window.location.hash){var E=window.location.hash.substring(1);isNaN(E)||(m.current_slide=parseInt(E))}window.onhashchange=function(){var e=window.location.hash.substring(1);m.hash_bookmark?w?_(parseInt(e)):w=!1:_(parseInt(e))};this.init=function(e,t){trace("INIT");H();S(e);x();type.of(t)=="string"&&(m.source=t);VMM.Date.setLanguage(m.language);VMM.master_config.language=m.language;VMM.ExternalAPI.setKeys(m.api_keys);VMM.ExternalAPI.googlemaps.setMapType(m.maptype);VMM.bindEvent(global,T,m.events.data_ready);VMM.bindEvent(global,I,m.events.messege);VMM.fireEvent(global,m.events.messege,m.language.messages.loading_timeline);(VMM.Browser.browser=="Explorer"||VMM.Browser.browser=="MSIE")&&parseInt(VMM.Browser.version,10)<=7&&(b=!0);type.of(m.source)=="string"||type.of(m.source)=="object"?VMM.Timeline.DataObj.getData(m.source):VMM.fireEvent(global,m.events.messege,"No data source provided")};this.iframeLoaded=function(){trace("iframeLoaded")};this.reload=function(e){trace("Load new timeline data"+e);VMM.fireEvent(global,m.events.messege,m.language.messages.loading_timeline);d={};VMM.Timeline.DataObj.getData(e);m.current_slide=0;f.setSlide(0);l.setMarker(0,m.ease,m.duration)}};VMM.Timeline.Config={}}typeof VMM.Timeline!="undefined"&&typeof VMM.Timeline.TimeNav=="undefined"&&(VMM.Timeline.TimeNav=function(e,t,n){function U(){trace("onConfigSet")}function z(e){b.nav.constraint.left=b.width/2;b.nav.constraint.right=b.nav.constraint.right_min-b.width/2;y.updateConstraint(b.nav.constraint);VMM.Lib.css(h,"left",Math.round(b.width/2)+2);VMM.Lib.css(p,"left",Math.round(b.width/2)-8);Y(b.current_slide,b.ease,b.duration,!0,e)}function W(){VMM.fireEvent(x,"UPDATE")}function X(){y.cancelSlide();if(b.nav.multiplier.current>b.nav.multiplier.min){b.nav.multiplier.current<=1?b.nav.multiplier.current=b.nav.multiplier.current-.25:b.nav.multiplier.current>5?b.nav.multiplier.current>16?b.nav.multiplier.current=Math.round(b.nav.multiplier.current-10):b.nav.multiplier.current=Math.round(b.nav.multiplier.current-4):b.nav.multiplier.current=Math.round(b.nav.multiplier.current-1);b.nav.multiplier.current<=0&&(b.nav.multiplier.current=b.nav.multiplier.min);K()}}function V(){y.cancelSlide();if(b.nav.multiplier.current<b.nav.multiplier.max){b.nav.multiplier.current>4?b.nav.multiplier.current>16?b.nav.multiplier.current=Math.round(b.nav.multiplier.current+10):b.nav.multiplier.current=Math.round(b.nav.multiplier.current+4):b.nav.multiplier.current=Math.round(b.nav.multiplier.current+1);b.nav.multiplier.current>=b.nav.multiplier.max&&(b.nav.multiplier.current=b.nav.multiplier.max);K()}}function $(e){y.cancelSlide();Y(0);W()}function J(e){var t=0,n=0;e||(e=window.event);e.originalEvent&&(e=e.originalEvent);e.wheelDelta?t=e.wheelDelta/6:e.detail&&(t=-e.detail*12);if(t){e.preventDefault&&e.preventDefault();e.returnValue=!1}if(typeof e.wheelDeltaX!="undefined"){t=e.wheelDeltaY/6;Math.abs(e.wheelDeltaX)>Math.abs(e.wheelDeltaY)?t=e.wheelDeltaX/6:t=e.wheelDeltaY/6}n=VMM.Lib.position(r).left+t;n>b.nav.constraint.left?n=b.width/2:n<b.nav.constraint.right&&(n=b.nav.constraint.right);VMM.Lib.css(r,"left",n)}function Q(e){y.cancelSlide();Y(e.data.number);W()}function G(e){VMM.Lib.toggleClass(e.data.elem,"zFront")}function Z(e,t){VMM.Lib.animate(r,t.time/2,b.ease,{left:t.left})}trace("VMM.Timeline.TimeNav");var r,s,o,u,a,f,l,c,h,p,d,v,m,g,y,b=VMM.Timeline.Config,w,E={},S={},x=e,T=[],N=[],C=[],k=[],L=[],A=[],O=0,M=!1,_,D,P={interval_position:""},H={left:"",visible:{left:"",right:""}},B={day:24,month:12,year:10,hour:60,minute:60,second:1e3,decade:10,century:100,millenium:1e3,age:1e6,epoch:1e7,era:1e8,eon:5e8,week:4.34812141,days_in_month:30.4368499,days_in_week:7,weeks_in_month:4.34812141,weeks_in_year:52.177457,days_in_year:365.242199,hours_in_day:24},j={day:864e5,week:7,month:30.4166666667,year:12,hour:24,minute:1440,second:86400,decade:10,century:100,millenium:1e3,age:1e6,epoch:1e7,era:1e8,eon:5e8},F={type:"year",number:10,first:1970,last:2011,multiplier:100,classname:"_idd",interval_type:"interval"},I={type:"year",number:10,first:1970,last:2011,multiplier:100,classname:"major",interval_type:"interval major"},q={type:"year",number:10,first:1970,last:2011,multiplier:100,classname:"_dd_minor",interval_type:"interval minor"},R={day:{},month:{},year:{},hour:{},minute:{},second:{},decade:{},century:{},millenium:{},week:{},age:{},epoch:{},era:{},eon:{}};w=b.nav.marker.height/2;b.nav.rows={full:[1,w*2,w*4],half:[1,w,w*2,w*3,w*4,w*5],current:[]};t!=null&&t!=""&&(b.nav.width=t);n!=null&&n!=""&&(b.nav.height=n);this.init=function(e,t){trace("VMM.Timeline.TimeNav init");typeof e!="undefined"?this.setData(e,t):trace("WAITING ON DATA")};this.setData=function(e,t){if(typeof e!="undefined"){T={};T=e;_=t;ct()}else trace("NO DATA")};this.setSize=function(e,t){e!=null&&(b.width=e);t!=null&&(b.height=t);M&&z()};this.setMarker=function(e,t,n,r){Y(e,t,n)};this.getCurrentNumber=function(){return O};var K=function(){trace("config.nav.multiplier "+b.nav.multiplier.current);ut(!0);at(!0);ft(a,k,!0,!0);ft(f,L,!0);b.nav.constraint.left=b.width/2;b.nav.constraint.right=b.nav.constraint.right_min-b.width/2;y.updateConstraint(b.nav.constraint)},Y=function(e,t,n,i,s){trace("GO TO MARKER");var o=b.ease,u=b.duration,a=!1,f=!1;O=e;H.left=b.width/2-C[O].pos_left;H.visible.left=Math.abs(H.left)-100;H.visible.right=Math.abs(H.left)+b.width+100;O==0&&(f=!0);O+1==C.length&&(a=!0);t!=null&&t!=""&&(o=t);n!=null&&n!=""&&(u=n);for(var l=0;l<C.length;l++)VMM.Lib.removeClass(C[l].marker,"active");if(b.start_page&&C[0].type=="start"){VMM.Lib.visible(C[0].marker,!1);VMM.Lib.addClass(C[0].marker,"start")}VMM.Lib.addClass(C[O].marker,"active");VMM.Lib.stop(r);VMM.Lib.animate(r,u,o,{left:H.left})},et=function(){var e=0,t=0,n=0,r=[],i=0;for(i=0;i<C.length;i++)if(T[i].type!="start"){var s=ot(F,C[i].relative_pos),e=t;t=s.begin;n=t-e;r.push(n)}return VMM.Util.average(r).mean},tt=function(){var e=0,t=0,n="",r=0,i=[],s=!0,o=0;for(o=0;o<T.length;o++)if(T[o].type=="start")trace("DATA DATE IS START");else{n=T[o].startdate;e=t;t=n;r=t-e;i.push(r)}return VMM.Util.average(i)},nt=function(){var e=b.nav.multiplier.current,t=0;for(t=0;t<e;t++)et()<75&&b.nav.multiplier.current>1&&(b.nav.multiplier.current=b.nav.multiplier.current-1)},rt=function(){var e=it(T[0].startdate),t=it(T[T.length-1].enddate);R.eon.type="eon";R.eon.first=e.eons;R.eon.base=Math.floor(e.eons);R.eon.last=t.eons;R.eon.number=S.eons;R.eon.multiplier=B.eons;R.eon.minor=B.eons;R.era.type="era";R.era.first=e.eras;R.era.base=Math.floor(e.eras);R.era.last=t.eras;R.era.number=S.eras;R.era.multiplier=B.eras;R.era.minor=B.eras;R.epoch.type="epoch";R.epoch.first=e.epochs;R.epoch.base=Math.floor(e.epochs);R.epoch.last=t.epochs;R.epoch.number=S.epochs;R.epoch.multiplier=B.epochs;R.epoch.minor=B.epochs;R.age.type="age";R.age.first=e.ages;R.age.base=Math.floor(e.ages);R.age.last=t.ages;R.age.number=S.ages;R.age.multiplier=B.ages;R.age.minor=B.ages;R.millenium.type="millenium";R.millenium.first=e.milleniums;R.millenium.base=Math.floor(e.milleniums);R.millenium.last=t.milleniums;R.millenium.number=S.milleniums;R.millenium.multiplier=B.millenium;R.millenium.minor=B.millenium;R.century.type="century";R.century.first=e.centuries;R.century.base=Math.floor(e.centuries);R.century.last=t.centuries;R.century.number=S.centuries;R.century.multiplier=B.century;R.century.minor=B.century;R.decade.type="decade";R.decade.first=e.decades;R.decade.base=Math.floor(e.decades);R.decade.last=t.decades;R.decade.number=S.decades;R.decade.multiplier=B.decade;R.decade.minor=B.decade;R.year.type="year";R.year.first=e.years;R.year.base=Math.floor(e.years);R.year.last=t.years;R.year.number=S.years;R.year.multiplier=1;R.year.minor=B.month;R.month.type="month";R.month.first=e.months;R.month.base=Math.floor(e.months);R.month.last=t.months;R.month.number=S.months;R.month.multiplier=1;R.month.minor=Math.round(B.week);R.week.type="week";R.week.first=e.weeks;R.week.base=Math.floor(e.weeks);R.week.last=t.weeks;R.week.number=S.weeks;R.week.multiplier=1;R.week.minor=7;R.day.type="day";R.day.first=e.days;R.day.base=Math.floor(e.days);R.day.last=t.days;R.day.number=S.days;R.day.multiplier=1;R.day.minor=24;R.hour.type="hour";R.hour.first=e.hours;R.hour.base=Math.floor(e.hours);R.hour.last=t.hours;R.hour.number=S.hours;R.hour.multiplier=1;R.hour.minor=60;R.minute.type="minute";R.minute.first=e.minutes;R.minute.base=Math.floor(e.minutes);R.minute.last=t.minutes;R.minute.number=S.minutes;R.minute.multiplier=1;R.minute.minor=60;R.second.type="decade";R.second.first=e.seconds;R.second.base=Math.floor(e.seconds);R.second.last=t.seconds;R.second.number=S.seconds;R.second.multiplier=1;R.second.minor=10},it=function(e,t){var n={};n.days=e/j.day;n.weeks=n.days/j.week;n.months=n.days/j.month;n.years=n.months/j.year;n.hours=n.days*j.hour;n.minutes=n.days*j.minute;n.seconds=n.days*j.second;n.decades=n.years/j.decade;n.centuries=n.years/j.century;n.milleniums=n.years/j.millenium;n.ages=n.years/j.age;n.epochs=n.years/j.epoch;n.eras=n.years/j.era;n.eons=n.years/j.eon;return n},st=function(e,t,n){var r,i,s=e.type,o={start:"",end:"",type:s};r=it(t);o.start=t.months;s=="eon"?o.start=r.eons:s=="era"?o.start=r.eras:s=="epoch"?o.start=r.epochs:s=="age"?o.start=r.ages:s=="millenium"?o.start=t.milleniums:s=="century"?o.start=r.centuries:s=="decade"?o.start=r.decades:s=="year"?o.start=r.years:s=="month"?o.start=r.months:s=="week"?o.start=r.weeks:s=="day"?o.start=r.days:s=="hour"?o.start=r.hours:s=="minute"&&(o.start=r.minutes);if(type.of(n)=="date"){i=it(n);o.end=n.months;s=="eon"?o.end=i.eons:s=="era"?o.end=i.eras:s=="epoch"?o.end=i.epochs:s=="age"?o.end=i.ages:s=="millenium"?o.end=n.milleniums:s=="century"?o.end=i.centuries:s=="decade"?o.end=i.decades:s=="year"?o.end=i.years:s=="month"?o.end=i.months:s=="week"?o.end=i.weeks:s=="day"?o.end=i.days:s=="hour"?o.end=i.hours:s=="minute"&&(o.end=i.minutes)}else o.end=o.start;return o},ot=function(e,t){return{begin:(t.start-F.base)*(b.nav.interval_width/b.nav.multiplier.current),end:(t.end-F.base)*(b.nav.interval_width/b.nav.multiplier.current)}},ut=function(e){var t=2,n=0,i=-2,s=0,o=0,u=150,a=6,f=0,l=b.width,c=[],h=6,p={left:H.visible.left-l,right:H.visible.right+l},d=0,v=0;b.nav.minor_width=b.width;VMM.Lib.removeClass(".flag","row1");VMM.Lib.removeClass(".flag","row2");VMM.Lib.removeClass(".flag","row3");for(d=0;d<C.length;d++){var m,g=C[d],y=ot(F,C[d].relative_pos),w=0,E=!1,S={id:d,pos:0,row:0},x=0;y.begin=Math.round(y.begin+i);y.end=Math.round(y.end+i);m=Math.round(y.end-y.begin);g.pos_left=y.begin;if(O==d){H.left=b.width/2-y;H.visible.left=Math.abs(H.left);H.visible.right=Math.abs(H.left)+b.width;p.left=H.visible.left-l;p.right=H.visible.right+l}Math.abs(y.begin)>=p.left&&Math.abs(y.begin)<=p.right&&(E=!0);if(e){VMM.Lib.stop(g.marker);VMM.Lib.animate(g.marker,b.duration/2,b.ease,{left:y.begin})}else{VMM.Lib.stop(g.marker);VMM.Lib.css(g.marker,"left",y.begin)}d==O&&(f=y.begin);if(m>5){VMM.Lib.css(g.lineevent,"height",a);VMM.Lib.css(g.lineevent,"top",u);e?VMM.Lib.animate(g.lineevent,b.duration/2,b.ease,{width:m}):VMM.Lib.css(g.lineevent,"width",m)}if(A.length>0){for(v=0;v<A.length;v++)if(v<b.nav.rows.current.length&&g.tag==A[v]){t=v;if(v==b.nav.rows.current.length-1){trace("ON LAST ROW");VMM.Lib.addClass(g.flag,"flag-small-last")}}w=b.nav.rows.current[t]}else{if(y.begin-n.begin<b.nav.marker.width+b.spacing)if(t<b.nav.rows.current.length-1)t++;else{t=0;s++}else{s=1;t=1}w=b.nav.rows.current[t]}n=y;S.pos=y;S.row=t;c.push(S);c.length>h&&c.remove(0);if(e){VMM.Lib.stop(g.flag);VMM.Lib.animate(g.flag,b.duration,b.ease,{top:w})}else{VMM.Lib.stop(g.flag);VMM.Lib.css(g.flag,"top",w)}b.start_page&&C[d].type=="start"&&VMM.Lib.visible(g.marker,!1);y>b.nav.minor_width&&(b.nav.minor_width=y);y<b.nav.minor_left&&(b.nav.minor_left=y)}if(e){VMM.Lib.stop(r);VMM.Lib.animate(r,b.duration/2,b.ease,{left:b.width/2-f})}},at=function(e){var t=0,n=0;for(t=0;t<N.length;t++){var r=N[t],i=ot(F,r.relative_pos),s=0,o=b.nav.marker.height*b.nav.rows.full.length,u=i.end-i.begin;if(r.tag!=""){o=b.nav.marker.height*b.nav.rows.full.length/b.nav.rows.current.length;for(n=0;n<A.length;n++)n<b.nav.rows.current.length&&r.tag==A[n]&&(row=n);s=b.nav.rows.current[row]}else s=-1;if(e){VMM.Lib.stop(r.content);VMM.Lib.stop(r.text_content);VMM.Lib.animate(r.content,b.duration/2,b.ease,{top:s,left:i.begin,width:u,height:o});VMM.Lib.animate(r.text_content,b.duration/2,b.ease,{left:i.begin})}else{VMM.Lib.stop(r.content);VMM.Lib.stop(r.text_content);VMM.Lib.css(r.content,"left",i.begin);VMM.Lib.css(r.content,"width",u);VMM.Lib.css(r.content,"height",o);VMM.Lib.css(r.content,"top",s);VMM.Lib.css(r.text_content,"left",i.begin)}}},ft=function(e,t,n,r){var s=0,o=0,u=b.width,a={left:H.visible.left-u,right:H.visible.right+u};not_too_many=!0,i=0;b.nav.minor_left=0;if(t.length>100){not_too_many=!1;trace("TOO MANY "+t.length)}for(i=0;i<t.length;i++){var f=t[i].element,l=t[i].date,c=t[i].visible,h=ot(F,t[i].relative_pos),p=h.begin,v=t[i].animation,m=!0,g=!1,y=50;v.pos=p;v.animate=!1;Math.abs(p)>=a.left&&Math.abs(p)<=a.right&&(g=!0);b.nav.multiplier.current>16&&r?m=!1:p-s<65&&(p-s<35?i%4==0?p==0&&(m=!1):m=!1:VMM.Util.isEven(i)||(m=!1));if(m){if(t[i].is_detached){VMM.Lib.append(e,f);t[i].is_detached=!1}}else{t[i].is_detached=!0;VMM.Lib.detach(f)}if(c)if(!m){v.opacity="0";n&&not_too_many&&(v.animate=!0);t[i].interval_visible=!1}else{v.opacity="100";n&&g&&(v.animate=!0)}else{v.opacity="100";if(m){n&&not_too_many?v.animate=!0:n&&g&&(v.animate=!0);t[i].interval_visible=!0}else n&&not_too_many&&(v.animate=!0)}s=p;p>b.nav.minor_width&&(b.nav.minor_width=p);p<b.nav.minor_left&&(b.nav.minor_left=p);if(v.animate)VMM.Lib.animate(f,b.duration/2,b.ease,{opacity:v.opacity,left:v.pos});else{VMM.Lib.css(f,"opacity",v.opacity);VMM.Lib.css(f,"left",p)}}b.nav.constraint.right_min=-b.nav.minor_width+b.width;b.nav.constraint.right=b.nav.constraint.right_min+b.width/2;VMM.Lib.css(d,"left",b.nav.minor_left-b.width/2);VMM.Lib.width(d,b.nav.minor_width+b.width+Math.abs(b.nav.minor_left))},lt=function(e,t,n){var r=0,i=!0,s=0,o=0,u,a,f,l=Math.ceil(e.number)+2,c={flag:!1,offset:0},h=0;VMM.attachElement(n,"");e.date=new Date(T[0].startdate.getFullYear(),0,1,0,0,0);u=e.date.getTimezoneOffset();for(h=0;h<l;h++){trace(e.type);var p=!1,v={element:VMM.appendAndGetElement(n,"<div>",e.classname),date:new Date(T[0].startdate.getFullYear(),0,1,0,0,0),visible:!1,date_string:"",type:e.interval_type,relative_pos:0,is_detached:!1,animation:{animate:!1,pos:"",opacity:"100"}};if(e.type=="eon"){i&&(a=Math.floor(T[0].startdate.getFullYear()/5e8)*5e8);v.date.setFullYear(a+r*5e8);p=!0}else if(e.type=="era"){i&&(a=Math.floor(T[0].startdate.getFullYear()/1e8)*1e8);v.date.setFullYear(a+r*1e8);p=!0}else if(e.type=="epoch"){i&&(a=Math.floor(T[0].startdate.getFullYear()/1e7)*1e7);v.date.setFullYear(a+r*1e7);p=!0}else if(e.type=="age"){i&&(a=Math.floor(T[0].startdate.getFullYear()/1e6)*1e6);v.date.setFullYear(a+r*1e6);p=!0}else if(e.type=="millenium"){i&&(a=Math.floor(T[0].startdate.getFullYear()/1e3)*1e3);v.date.setFullYear(a+r*1e3);p=!0}else if(e.type=="century"){i&&(a=Math.floor(T[0].startdate.getFullYear()/100)*100);v.date.setFullYear(a+r*100);p=!0}else if(e.type=="decade"){i&&(a=Math.floor(T[0].startdate.getFullYear()/10)*10);v.date.setFullYear(a+r*10);p=!0}else if(e.type=="year"){i&&(a=T[0].startdate.getFullYear());v.date.setFullYear(a+r);p=!0}else if(e.type=="month"){i&&(a=T[0].startdate.getMonth());v.date.setMonth(a+r)}else if(e.type=="week"){i&&(a=T[0].startdate.getMonth());v.date.setMonth(T[0].startdate.getMonth());v.date.setDate(a+r*7)}else if(e.type=="day"){i&&(a=T[0].startdate.getDate());v.date.setMonth(T[0].startdate.getMonth());v.date.setDate(a+r)}else if(e.type=="hour"){i&&(a=T[0].startdate.getHours());v.date.setMonth(T[0].startdate.getMonth());v.date.setDate(T[0].startdate.getDate());v.date.setHours(a+r)}else if(e.type=="minute"){i&&(a=T[0].startdate.getMinutes());v.date.setMonth(T[0].startdate.getMonth());v.date.setDate(T[0].startdate.getDate());v.date.setHours(T[0].startdate.getHours());v.date.setMinutes(a+r)}else if(e.type=="second"){i&&(a=T[0].startdate.getSeconds());v.date.setMonth(T[0].startdate.getMonth());v.date.setDate(T[0].startdate.getDate());v.date.setHours(T[0].startdate.getHours());v.date.setMinutes(T[0].startdate.getMinutes());v.date.setSeconds(a+r)}else if(e.type=="millisecond"){i&&(a=T[0].startdate.getMilliseconds());v.date.setMonth(T[0].startdate.getMonth());v.date.setDate(T[0].startdate.getDate());v.date.setHours(T[0].startdate.getHours());v.date.setMinutes(T[0].startdate.getMinutes());v.date.setSeconds(T[0].startdate.getSeconds());v.date.setMilliseconds(a+r)}if(VMM.Browser.browser=="Firefox")if(v.date.getFullYear()=="1970"&&v.date.getTimezoneOffset()!=u){trace("FIREFOX 1970 TIMEZONE OFFSET "+v.date.getTimezoneOffset()+" SHOULD BE "+u);trace(e.type+" "+e.date);c.offset=v.date.getTimezoneOffset()/60;c.flag=!0;v.date.setHours(v.date.getHours()+c.offset)}else if(c.flag){c.flag=!1;v.date.setHours(v.date.getHours()+c.offset);p&&(c.flag=!0)}p?v.date.getFullYear()<0?v.date_string=Math.abs(v.date.getFullYear()).toString()+" B.C.":v.date_string=v.date.getFullYear():v.date_string=VMM.Date.prettyDate(v.date,!0);r+=1;i=!1;v.relative_pos=st(F,v.date);s=v.relative_pos.begin;v.relative_pos.begin>o&&(o=v.relative_pos.begin);VMM.appendElement(v.element,v.date_string);VMM.Lib.css(v.element,"text-indent",-(VMM.Lib.width(v.element)/2));VMM.Lib.css(v.element,"opacity","0");t.push(v)}VMM.Lib.width(d,o);ft(n,t)},ct=function(){var e=0,t=0;VMM.attachElement(x,"");r=VMM.appendAndGetElement(x,"<div>","timenav");s=VMM.appendAndGetElement(r,"<div>","content");o=VMM.appendAndGetElement(r,"<div>","time");u=VMM.appendAndGetElement(o,"<div>","time-interval-minor");d=VMM.appendAndGetElement(u,"<div>","minor");f=VMM.appendAndGetElement(o,"<div>","time-interval-major");a=VMM.appendAndGetElement(o,"<div>","time-interval");l=VMM.appendAndGetElement(x,"<div>","timenav-background");h=VMM.appendAndGetElement(l,"<div>","timenav-line");p=VMM.appendAndGetElement(l,"<div>","timenav-indicator");c=VMM.appendAndGetElement(l,"<div>","timenav-interval-background","<div class='top-highlight'></div>");v=VMM.appendAndGetElement(x,"<div>","vco-toolbar");ht();pt();dt();nt();ut(!1);at();ft(a,k,!1,!0);ft(f,L);if(b.start_page){$backhome=VMM.appendAndGetElement(v,"<div>","back-home","<div class='icon'></div>");VMM.bindEvent(".back-home",$,"click");VMM.Lib.attribute($backhome,"title",VMM.master_config.language.messages.return_to_title);VMM.Lib.attribute($backhome,"rel","tooltip")}y=new VMM.DragSlider;y.createPanel(x,r,b.nav.constraint,b.touch);if(b.touch&&b.start_page){VMM.Lib.addClass(v,"touch");VMM.Lib.css(v,"top",55);VMM.Lib.css(v,"left",10)}else{b.start_page&&VMM.Lib.css(v,"top",27);m=VMM.appendAndGetElement(v,"<div>","zoom-in","<div class='icon'></div>");g=VMM.appendAndGetElement(v,"<div>","zoom-out","<div class='icon'></div>");VMM.bindEvent(m,X,"click");VMM.bindEvent(g,V,"click");VMM.Lib.attribute(m,"title",VMM.master_config.language.messages.expand_timeline);VMM.Lib.attribute(m,"rel","tooltip");VMM.Lib.attribute(g,"title",VMM.master_config.language.messages.contract_timeline);VMM.Lib.attribute(g,"rel","tooltip");v.tooltip({selector:"div[rel=tooltip]",placement:"right"});VMM.bindEvent(x,J,"DOMMouseScroll");VMM.bindEvent(x,J,"mousewheel")}if(b.nav.zoom.adjust!=0)if(b.nav.zoom.adjust<0)for(e=0;e<Math.abs(b.nav.zoom.adjust);e++)V();else for(t=0;t<b.nav.zoom.adjust;t++)X();M=!0;z(!0);VMM.fireEvent(x,"LOADED")},ht=function(){var e=0,t=0;S=it(T[T.length-1].enddate-T[0].startdate,!0);trace(S);rt();if(S.centuries>T.length/b.nav.density){F=R.century;I=R.millenium;q=R.decade}else if(S.decades>T.length/b.nav.density){F=R.decade;I=R.century;q=R.year}else if(S.years>T.length/b.nav.density){F=R.year;I=R.decade;q=R.month}else if(S.months>T.length/b.nav.density){F=R.month;I=R.year;q=R.day}else if(S.days>T.length/b.nav.density){F=R.day;I=R.month;q=R.hour}else if(S.hours>T.length/b.nav.density){F=R.hour;I=R.day;q=R.minute}else if(S.minutes>T.length/b.nav.density){F=R.minute;I=R.hour;q=R.second}else if(S.seconds>T.length/b.nav.density){F=R.second;I=R.minute;q=R.second}else{trace("NO IDEA WHAT THE TYPE SHOULD BE");F=R.day;I=R.month;q=R.hour}trace("INTERVAL TYPE: "+F.type);trace("INTERVAL MAJOR TYPE: "+I.type);lt(F,k,a);lt(I,L,f);for(e=0;e<k.length;e++)for(t=0;t<L.length;t++)k[e].date_string==L[t].date_string&&VMM.attachElement(k[e].element,"")},pt=function(){var e=2,t=0,n=0,r=0,i=0,o=0;C=[];N=[];for(r=0;r<T.length;r++){var u,a,f,c,h,p,d,v="",m=!1;u=VMM.appendAndGetElement(s,"<div>","marker");a=VMM.appendAndGetElement(u,"<div>","flag");f=VMM.appendAndGetElement(a,"<div>","flag-content");c=VMM.appendAndGetElement(u,"<div>","dot");h=VMM.appendAndGetElement(u,"<div>","line");p=VMM.appendAndGetElement(h,"<div>","event-line");_marker_relative_pos=st(F,T[r].startdate,T[r].enddate);_marker_thumb="";T[r].asset!=null&&T[r].asset!=""?VMM.appendElement(f,VMM.MediaElement.thumbnail(T[r].asset,24,24,T[r].uniqueid)):VMM.appendElement(f,"<div style='margin-right:7px;height:50px;width:2px;float:left;'></div>");if(T[r].title==""||T[r].title==" "){trace("TITLE NOTHING");if(typeof T[r].slug!="undefined"&&T[r].slug!=""){trace("SLUG");v=VMM.Util.untagify(T[r].slug);m=!0}else{var g=VMM.MediaType(T[r].asset.media);if(g.type=="quote"||g.type=="unknown"){v=VMM.Util.untagify(g.id);m=!0}else m=!1}}else if(T[r].title!=""||T[r].title!=" "){trace(T[r].title);v=VMM.Util.untagify(T[r].title);m=!0}else trace("TITLE SLUG NOT FOUND "+T[r].slug);if(m)VMM.appendElement(f,"<h3>"+v+"</h3>");else{VMM.appendElement(f,"<h3>"+v+"</h3>");VMM.appendElement(f,"<h3 id='marker_content_"+T[r].uniqueid+"'>"+v+"</h3>")}VMM.Lib.attr(u,"id",("marker_"+T[r].uniqueid).toString());VMM.bindEvent(a,Q,"",{number:r});VMM.bindEvent(a,G,"mouseenter mouseleave",{number:r,elem:a});d={marker:u,flag:a,lineevent:p,type:"marker",full:!0,relative_pos:_marker_relative_pos,tag:T[r].tag,pos_left:0};if(T[r].type=="start"){trace("BUILD MARKER HAS START PAGE");b.start_page=!0;d.type="start"}T[r].type=="storify"&&(d.type="storify");T[r].tag&&A.push(T[r].tag);C.push(d)}A=VMM.Util.deDupeArray(A);A.length>3?b.nav.rows.current=b.nav.rows.half:b.nav.rows.current=b.nav.rows.full;for(i=0;i<A.length;i++)if(i<b.nav.rows.current.length){var y=VMM.appendAndGetElement(l,"<div>","timenav-tag");VMM.Lib.addClass(y,"timenav-tag-row-"+(i+1));A.length>3?VMM.Lib.addClass(y,"timenav-tag-size-half"):VMM.Lib.addClass(y,"timenav-tag-size-full");VMM.appendElement(y,"<div><h3>"+A[i]+"</h3></div>")}if(A.length>3)for(o=0;o<C.length;o++){VMM.Lib.addClass(C[o].flag,"flag-small");C[o].full=!1}},dt=function(){var e=6,t=0,n=0;for(n=0;n<_.length;n++){var r={content:VMM.appendAndGetElement(s,"<div>","era"),text_content:VMM.appendAndGetElement(a,"<div>","era"),startdate:VMM.Date.parse(_[n].startDate),enddate:VMM.Date.parse(_[n].endDate),title:_[n].headline,uniqueid:VMM.Util.unique_ID(6),tag:"",relative_pos:""},i=VMM.Date.prettyDate(r.startdate),o=VMM.Date.prettyDate(r.enddate),u="<div>&nbsp;</div>";typeof _[n].tag!="undefined"&&(r.tag=_[n].tag);r.relative_pos=st(F,r.startdate,r.enddate);VMM.Lib.attr(r.content,"id",r.uniqueid);VMM.Lib.attr(r.text_content,"id",r.uniqueid+"_text");VMM.Lib.addClass(r.content,"era"+(t+1));VMM.Lib.addClass(r.text_content,"era"+(t+1));t<e?t++:t=0;VMM.appendElement(r.content,u);VMM.appendElement(r.text_content,VMM.Util.unlinkify(r.title));N.push(r)}}});typeof VMM.Timeline!="undefined"&&typeof VMM.Timeline.DataObj=="undefined"&&(VMM.Timeline.DataObj={data_obj:{},model_array:[],getData:function(e){VMM.Timeline.DataObj.data_obj={};VMM.fireEvent(global,VMM.Timeline.Config.events.messege,VMM.Timeline.Config.language.messages.loading_timeline);if(type.of(e)=="object"){trace("DATA SOURCE: JSON OBJECT");VMM.Timeline.DataObj.parseJSON(e)}else if(type.of(e)=="string")if(e.match("%23")){trace("DATA SOURCE: TWITTER SEARCH");VMM.Timeline.DataObj.model.tweets.getData("%23medill")}else if(e.match("spreadsheet")){trace("DATA SOURCE: GOOGLE SPREADSHEET");VMM.Timeline.DataObj.model.googlespreadsheet.getData(e)}else if(e.match("storify.com")){trace("DATA SOURCE: STORIFY");VMM.Timeline.DataObj.model.storify.getData(e)}else if(e.match(".jsonp")){trace("DATA SOURCE: JSONP");LoadLib.js(e,VMM.Timeline.DataObj.onJSONPLoaded)}else{trace("DATA SOURCE: JSON");VMM.getJSON(e+"?callback=onJSONP_Data",VMM.Timeline.DataObj.parseJSON)}else if(type.of(e)=="html"){trace("DATA SOURCE: HTML");VMM.Timeline.DataObj.parseHTML(e)}else trace("DATA SOURCE: UNKNOWN")},onJSONPLoaded:function(){trace("JSONP IS LOADED");VMM.fireEvent(global,VMM.Timeline.Config.events.data_ready,storyjs_jsonp_data)},parseHTML:function(e){trace("parseHTML");trace("WARNING: THIS IS STILL ALPHA AND WILL NOT WORK WITH ID's other than #timeline");var t=VMM.Timeline.DataObj.data_template_obj;if(VMM.Lib.find("#timeline section","time")[0]){t.timeline.startDate=VMM.Lib.html(VMM.Lib.find("#timeline section","time")[0]);t.timeline.headline=VMM.Lib.html(VMM.Lib.find("#timeline section","h2"));t.timeline.text=VMM.Lib.html(VMM.Lib.find("#timeline section","article"));var n=!1;if(VMM.Lib.find("#timeline section","figure img").length!=0){n=!0;t.timeline.asset.media=VMM.Lib.attr(VMM.Lib.find("#timeline section","figure img"),"src")}else if(VMM.Lib.find("#timeline section","figure a").length!=0){n=!0;t.timeline.asset.media=VMM.Lib.attr(VMM.Lib.find("#timeline section","figure a"),"href")}if(n){VMM.Lib.find("#timeline section","cite").length!=0&&(t.timeline.asset.credit=VMM.Lib.html(VMM.Lib.find("#timeline section","cite")));VMM.Lib.find(this,"figcaption").length!=0&&(t.timeline.asset.caption=VMM.Lib.html(VMM.Lib.find("#timeline section","figcaption")))}}VMM.Lib.each("#timeline li",function(e,n){var r=!1,i={type:"default",startDate:"",headline:"",text:"",asset:{media:"",credit:"",caption:""},tags:"Optional"};if(VMM.Lib.find(this,"time")!=0){r=!0;i.startDate=VMM.Lib.html(VMM.Lib.find(this,"time")[0]);VMM.Lib.find(this,"time")[1]&&(i.endDate=VMM.Lib.html(VMM.Lib.find(this,"time")[1]));i.headline=VMM.Lib.html(VMM.Lib.find(this,"h3"));i.text=VMM.Lib.html(VMM.Lib.find(this,"article"));var s=!1;if(VMM.Lib.find(this,"figure img").length!=0){s=!0;i.asset.media=VMM.Lib.attr(VMM.Lib.find(this,"figure img"),"src")}else if(VMM.Lib.find(this,"figure a").length!=0){s=!0;i.asset.media=VMM.Lib.attr(VMM.Lib.find(this,"figure a"),"href")}if(s){VMM.Lib.find(this,"cite").length!=0&&(i.asset.credit=VMM.Lib.html(VMM.Lib.find(this,"cite")));VMM.Lib.find(this,"figcaption").length!=0&&(i.asset.caption=VMM.Lib.html(VMM.Lib.find(this,"figcaption")))}trace(i);t.timeline.date.push(i)}});VMM.fireEvent(global,VMM.Timeline.Config.events.data_ready,t)},parseJSON:function(e){trace("parseJSON");if(e.timeline.type=="default"){trace("DATA SOURCE: JSON STANDARD TIMELINE");VMM.fireEvent(global,VMM.Timeline.Config.events.data_ready,e)}else if(e.timeline.type=="twitter"){trace("DATA SOURCE: JSON TWEETS");VMM.Timeline.DataObj.model_Tweets.buildData(e)}else{trace("DATA SOURCE: UNKNOWN JSON");trace(type.of(e.timeline))}},model:{googlespreadsheet:{getData:function(e){function o(){t=VMM.getJSON(r,function(e){clearTimeout(i);VMM.Timeline.DataObj.model.googlespreadsheet.buildData(e)}).error(function(e,t,n){trace("Google Docs ERROR");trace("Google Docs ERROR: "+t+" "+e.responseText
)}).success(function(e){clearTimeout(i)})}var t,n,r,i,s=0;n=VMM.Util.getUrlVars(e).key;r="https://spreadsheets.google.com/feeds/list/"+n+"/od6/public/values?alt=json";i=setTimeout(function(){trace("Google Docs timeout "+r);trace(r);if(s<3){VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Still waiting on Google Docs, trying again "+s);s++;t.abort();o()}else VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Google Docs is not responding")},16e3);o()},buildData:function(e){function r(e){return typeof e!="undefined"?e.$t:""}var t=VMM.Timeline.DataObj.data_template_obj,n=!1;VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Parsing Google Doc Data");if(typeof e.feed.entry!="undefined"){n=!0;for(var i=0;i<e.feed.entry.length;i++){var s=e.feed.entry[i],o="";typeof s.gsx$type!="undefined"?o=s.gsx$type.$t:typeof s.gsx$titleslide!="undefined"&&(o=s.gsx$titleslide.$t);if(o.match("start")||o.match("title")){t.timeline.startDate=r(s.gsx$startdate);t.timeline.headline=r(s.gsx$headline);t.timeline.asset.media=r(s.gsx$media);t.timeline.asset.caption=r(s.gsx$mediacaption);t.timeline.asset.credit=r(s.gsx$mediacredit);t.timeline.text=r(s.gsx$text);t.timeline.type="google spreadsheet"}else if(o.match("era")){var u={startDate:r(s.gsx$startdate),endDate:r(s.gsx$enddate),headline:r(s.gsx$headline),text:r(s.gsx$text),tag:r(s.gsx$tag)};t.timeline.era.push(u)}else{var a={type:"google spreadsheet",startDate:r(s.gsx$startdate),endDate:r(s.gsx$enddate),headline:r(s.gsx$headline),text:r(s.gsx$text),tag:r(s.gsx$tag),asset:{media:r(s.gsx$media),credit:r(s.gsx$mediacredit),caption:r(s.gsx$mediacaption),thumbnail:r(s.gsx$mediathumbnail)}};t.timeline.date.push(a)}}}if(n){VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Finished Parsing Data");VMM.fireEvent(global,VMM.Timeline.Config.events.data_ready,t)}else{VMM.fireEvent(global,VMM.Timeline.Config.events.messege,VMM.Language.messages.loading+" Google Doc Data (cells)");trace("There may be too many entries. Still trying to load data. Now trying to load cells to avoid Googles limitation on cells");VMM.Timeline.DataObj.model.googlespreadsheet.getDataCells(e.feed.link[0].href)}},getDataCells:function(e){function o(){t=VMM.getJSON(r,function(e){clearTimeout(i);VMM.Timeline.DataObj.model.googlespreadsheet.buildDataCells(e)}).error(function(e,t,n){trace("Google Docs ERROR");trace("Google Docs ERROR: "+t+" "+e.responseText)}).success(function(e){clearTimeout(i)})}var t,n,r,i,s=0;n=VMM.Util.getUrlVars(e).key;r="https://spreadsheets.google.com/feeds/cells/"+n+"/od6/public/values?alt=json";i=setTimeout(function(){trace("Google Docs timeout "+r);trace(r);if(s<3){VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Still waiting on Google Docs, trying again "+s);s++;t.abort();o()}else VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Google Docs is not responding")},16e3);o()},buildDataCells:function(e){function a(e){return typeof e!="undefined"?e.$t:""}var t=VMM.Timeline.DataObj.data_template_obj,n=!1,r=["timeline"],i=[],s=0,o=0,u=0;VMM.fireEvent(global,VMM.Timeline.Config.events.messege,VMM.Language.messages.loading_timeline+" Parsing Google Doc Data (cells)");if(typeof e.feed.entry!="undefined"){n=!0;for(o=0;o<e.feed.entry.length;o++){var f=e.feed.entry[o];parseInt(f.gs$cell.row)>s&&(s=parseInt(f.gs$cell.row))}for(var o=0;o<s+1;o++){var l={type:"",startDate:"",endDate:"",headline:"",text:"",tag:"",asset:{media:"",credit:"",caption:"",thumbnail:""}};i.push(l)}for(o=0;o<e.feed.entry.length;o++){var f=e.feed.entry[o],c="",h="",p={content:a(f.gs$cell),col:f.gs$cell.col,row:f.gs$cell.row,name:""};if(p.row==1){p.content=="Start Date"?h="startDate":p.content=="End Date"?h="endDate":p.content=="Headline"?h="headline":p.content=="Text"?h="text":p.content=="Media"?h="media":p.content=="Media Credit"?h="credit":p.content=="Media Caption"?h="caption":p.content=="Media Thumbnail"?h="thumbnail":p.content=="Type"?h="type":p.content=="Tag"&&(h="tag");r.push(h)}else{p.name=r[p.col];i[p.row][p.name]=p.content}}for(o=0;o<i.length;o++){var l=i[o];if(l.type.match("start")||l.type.match("title")){t.timeline.startDate=l.startDate;t.timeline.headline=l.headline;t.timeline.asset.media=l.media;t.timeline.asset.caption=l.caption;t.timeline.asset.credit=l.credit;t.timeline.text=l.text;t.timeline.type="google spreadsheet"}else if(l.type.match("era")){var d={startDate:l.startDate,endDate:l.endDate,headline:l.headline,text:l.text,tag:l.tag};t.timeline.era.push(d)}else{var l={type:"google spreadsheet",startDate:l.startDate,endDate:l.endDate,headline:l.headline,text:l.text,tag:l.tag,asset:{media:l.media,credit:l.credit,caption:l.caption,thumbnail:l.thumbnail}};t.timeline.date.push(l)}}}if(n){VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Finished Parsing Data");VMM.fireEvent(global,VMM.Timeline.Config.events.data_ready,t)}else VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Unable to load Google Doc data source")}},storify:{getData:function(e){var t,n,r;VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Loading Storify...");t=e.split("storify.com/")[1];n="http://api.storify.com/v1/stories/"+t+"?per_page=300&callback=?";r=setTimeout(function(){trace("STORIFY timeout");VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Storify is not responding")},6e3);VMM.getJSON(n,VMM.Timeline.DataObj.model.storify.buildData).error(function(e,t,n){trace("STORIFY error");trace("STORIFY ERROR: "+t+" "+e.responseText)}).success(function(e){clearTimeout(r)})},buildData:function(e){VMM.fireEvent(global,VMM.Timeline.Config.events.messege,"Parsing Data");var t=VMM.Timeline.DataObj.data_template_obj;t.timeline.startDate=new Date(e.content.date.created);t.timeline.headline=e.content.title;trace(e);var n="",r=e.content.author.username,i="";if(typeof e.content.author.name!="undefined"){r=e.content.author.name;i=e.content.author.username+"&nbsp;"}typeof e.content.description!="undefined"&&e.content.description!=null&&(n+=e.content.description);n+="<div class='storify'>";n+="<div class='vcard author'><a class='screen-name url' href='"+e.content.author.permalink+"' target='_blank'>";n+="<span class='avatar'><img src='"+e.content.author.avatar+"' style='max-width: 32px; max-height: 32px;'></span>";n+="<span class='fn'>"+r+"</span>";n+="<span class='nickname'>"+i+"<span class='thumbnail-inline'></span></span>";n+="</a>";n+="</div>";n+="</div>";t.timeline.text=n;t.timeline.asset.media=e.content.thumbnail;t.timeline.type="storify";for(var s=0;s<e.content.elements.length;s++){var o=e.content.elements[s],u=!1,a=new Date(o.posted_at);trace(o.type);var f={type:"storify",startDate:o.posted_at,endDate:o.posted_at,headline:" ",slug:"",text:"",asset:{media:"",credit:"",caption:""}};if(o.type=="image"){if(typeof o.source.name!="undefined")if(o.source.name=="flickr"){f.asset.media="http://flickr.com/photos/"+o.meta.pathalias+"/"+o.meta.id+"/";f.asset.credit="<a href='"+f.asset.media+"'>"+o.attribution.name+"</a>";f.asset.credit+=" on <a href='"+o.source.href+"'>"+o.source.name+"</a>"}else if(o.source.name=="instagram"){f.asset.media=o.permalink;f.asset.credit="<a href='"+o.permalink+"'>"+o.attribution.name+"</a>";f.asset.credit+=" on <a href='"+o.source.href+"'>"+o.source.name+"</a>"}else{f.asset.credit="<a href='"+o.permalink+"'>"+o.attribution.name+"</a>";typeof o.source.href!="undefined"&&(f.asset.credit+=" on <a href='"+o.source.href+"'>"+o.source.name+"</a>");f.asset.media=o.data.image.src}else{f.asset.credit="<a href='"+o.permalink+"'>"+o.attribution.name+"</a>";f.asset.media=o.data.image.src}f.slug=o.attribution.name;if(typeof o.data.image.caption!="undefined"&&o.data.image.caption!="undefined"){f.asset.caption=o.data.image.caption;f.slug=o.data.image.caption}}else if(o.type=="quote"){if(o.permalink.match("twitter")){f.asset.media=o.permalink;f.slug=VMM.Util.untagify(o.data.quote.text)}else if(o.permalink.match("storify")){u=!0;f.asset.media="<blockquote>"+o.data.quote.text.replace(/<\s*\/?\s*b\s*.*?>/g,"")+"</blockquote>"}}else if(o.type=="link"){f.headline=o.data.link.title;f.text=o.data.link.description;o.data.link.thumbnail!="undefined"&&o.data.link.thumbnail!=""?f.asset.media=o.data.link.thumbnail:f.asset.media=o.permalink;f.asset.caption="<a href='"+o.permalink+"' target='_blank'>"+o.data.link.title+"</a>";f.slug=o.data.link.title}else if(o.type=="text"){if(o.permalink.match("storify")){u=!0;var l=e.content.author.username,c="";if(typeof o.attribution.name!="undefined"){r=o.attribution.name;i=o.attribution.username+"&nbsp;"}var h="<div class='storify'>";h+="<blockquote><p>"+o.data.text.replace(/<\s*\/?\s*b\s*.*?>/g,"")+"</p></blockquote>";h+="<div class='vcard author'><a class='screen-name url' href='"+o.attribution.href+"' target='_blank'>";h+="<span class='avatar'><img src='"+o.attribution.thumbnail+"' style='max-width: 32px; max-height: 32px;'></span>";h+="<span class='fn'>"+r+"</span>";h+="<span class='nickname'>"+i+"<span class='thumbnail-inline'></span></span>";h+="</a></div></div>";f.text=h;if(s+1>=e.content.elements.length)f.startDate=e.content.elements[s-1].posted_at;else if(e.content.elements[s+1].type=="text"&&e.content.elements[s+1].permalink.match("storify"))if(s+2>=e.content.elements.length)f.startDate=e.content.elements[s-1].posted_at;else if(e.content.elements[s+2].type=="text"&&e.content.elements[s+2].permalink.match("storify"))if(s+3>=e.content.elements.length)f.startDate=e.content.elements[s-1].posted_at;else if(e.content.elements[s+3].type=="text"&&e.content.elements[s+3].permalink.match("storify"))f.startDate=e.content.elements[s-1].posted_at;else{trace("LEVEL 3");f.startDate=e.content.elements[s+3].posted_at}else{trace("LEVEL 2");f.startDate=e.content.elements[s+2].posted_at}else{trace("LEVEL 1");f.startDate=e.content.elements[s+1].posted_at}f.endDate=f.startDate}}else if(o.type=="video"){f.headline=o.data.video.title;f.asset.caption=o.data.video.description;f.asset.caption=o.source.username;f.asset.media=o.data.video.src}else{trace("NO MATCH ");trace(o)}u&&(f.slug=VMM.Util.untagify(o.data.text));t.timeline.date.push(f)}VMM.fireEvent(global,VMM.Timeline.Config.events.data_ready,t)}},tweets:{type:"twitter",buildData:function(e){VMM.bindEvent(global,VMM.Timeline.DataObj.model.tweets.onTwitterDataReady,"TWEETSLOADED");VMM.ExternalAPI.twitter.getTweets(e.timeline.tweets)},getData:function(e){VMM.bindEvent(global,VMM.Timeline.DataObj.model.tweets.onTwitterDataReady,"TWEETSLOADED");VMM.ExternalAPI.twitter.getTweetSearch(e)},onTwitterDataReady:function(e,t){var n=VMM.Timeline.DataObj.data_template_obj;for(var r=0;r<t.tweetdata.length;r++){var i={type:"tweets",startDate:"",headline:"",text:"",asset:{media:"",credit:"",caption:""},tags:"Optional"};i.startDate=t.tweetdata[r].raw.created_at;type.of(t.tweetdata[r].raw.from_user_name)?i.headline=t.tweetdata[r].raw.from_user_name+" (<a href='https://twitter.com/"+t.tweetdata[r].raw.from_user+"'>"+"@"+t.tweetdata[r].raw.from_user+"</a>)":i.headline=t.tweetdata[r].raw.user.name+" (<a href='https://twitter.com/"+t.tweetdata[r].raw.user.screen_name+"'>"+"@"+t.tweetdata[r].raw.user.screen_name+"</a>)";i.asset.media=t.tweetdata[r].content;n.timeline.date.push(i)}VMM.fireEvent(global,VMM.Timeline.Config.events.data_ready,n)}}},data_template_obj:{timeline:{headline:"",description:"",asset:{media:"",credit:"",caption:""},date:[],era:[]}},date_obj:{startDate:"2012,2,2,11,30",headline:"",text:"",asset:{media:"http://youtu.be/vjVfu8-Wp6s",credit:"",caption:""},tags:"Optional"}});VMM.debug=!1;
(function() {



}).call(this);
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// the compiled file.
//
// WARNING: THE FIRST BLANK LINE MARKS THE END OF WHAT'S TO BE PROCESSED, ANY BLANK LINE SHOULD
// GO AFTER THE REQUIRES BELOW.
//




;
