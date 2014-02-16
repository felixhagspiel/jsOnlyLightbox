function Lightbox () {
	/*
	* 	Attributes
	*/

	// public
	this.opt = false;
	this.box = false;
	this.wrapper = false;
	var isIE8 = false;
	// private
	var that = this;
	var body = document.getElementsByTagName('body')[0];
	var template = '<div class="jslghtbx-contentwrapper" id="jslghtbx-contentwrapper" ></div>';
	var imgRatio = false;
	// resize-vars
	var maxWidth;
	var maxHeight;
	var wrapperWidth;
	var wrapperHeight;
	var newImgWidth;
	var newImgHeight;

	/*
	* 	Private methods
	*/

	// get correct height in IE8
	var getHeight = function(){
		return window.innerHeight || document.documentElement.offsetHeight;
	};
	// get correct width in IE8
	var getWidth = function(){
		return window.innerWidth || document.documentElement.offsetWidth;
	};
	// cross browser eventhandler
	var addEvent  = function(el,e,callback,val){
	    if (el.addEventListener) {
	        el.addEventListener(e,callback, false);
	    } else if (el.attachEvent) {
	        el.attachEvent("on" + e, callback);
	    }
	};
	// check if element has a specific class
	var hasClass  = function(el,className) {
		if(!el || !className){return;}
	    return (new RegExp("(^|\\s)" + className + "(\\s|$)").test(el.className));
	};
	// remove class from element
	var removeClass = function(el,className) {
		if(!el || !className){return;}
	    el.className = el.className.replace(new RegExp('(?:^|\\s)'+className+'(?!\\S)'),'' );
	    return el;
	};
	// add class to element
	var addClass = function(el,className) {
		if(!el || !className){return;}
	    if(!hasClass(el,className)) { el.className += ' '+className; }
	    return el;
	};
	// check if obj is set
	var isset = function(obj) {
		if(typeof obj != 'undefined'){return true;}
		return false;
	};
	// get attributes, cross-browser
	var getAttr = function(obj,attr) {
		if(!obj || typeof obj == undefined){return false;}
		var ret;
		if(obj.getAttribute){ret=obj.getAttribute(attr);}
		else if(obj.getAttributeNode){ret=obj.getAttributeNode(attr).value;}
		if(typeof ret != undefined && ret != ''){return ret;}
		return false;
	};
	// check attribute, cross-browser
	var hasAttr = function(obj,attr) {
		if(!obj || typeof obj == undefined){return false;}
		var ret;
		if(obj.getAttribute){ret=obj.getAttribute(attr);}
		else if(obj.getAttributeNode){ret=obj.getAttributeNode(attr).value;}
		if(typeof ret === 'string'){return true;}
		return false;
	};
	// lookup element in browser
	var exists = function(id){
		if(document.getElementById(id)) {return true;}
		return false;
	};

	/*
	* 	Public methods
	*/

	// init-function
	this.load = function(opt) {
		// set options
		if(opt){this.opt = opt;}
		// check for IE8
		if(document.attachEvent && ! document.addEventListener) {
			isIE8 = true;
		}
		// load box in custom element
		if(opt && opt.boxId) {
			this.box = document.getElementById(opt.boxId);
		}
		// load box in default element if no ID is given
		else if(!this.box && !exists('jslghtbx')) {
			var newEl = document.createElement('div');
			newEl.setAttribute('id','jslghtbx');
			newEl.setAttribute('class','jslghtbx');
			this.box = newEl;
			body.appendChild(this.box);
		}
		this.box.innerHTML = template;
		if(isIE8) {
			addClass(this.box,'ie8');
		}
		this.wrapper = document.getElementById('jslghtbx-contentwrapper');
		// close lightbox on click on given element
		if(opt && opt.closeId) {
			addEvent(document.getElementById(opt.closeId),'click',function(){
				that.close();
			});
		}
		// init regular closebutton
		if(!opt || opt && !opt.hideCloseBtn) {
			var closeBtn = document.createElement('span');
			closeBtn.setAttribute('id','jslghtbx-close');
			closeBtn.setAttribute('class','jslghtbx-close');
			closeBtn.innerHTML = 'X';
			this.box.appendChild(closeBtn);
			addEvent(closeBtn,'click',function(){
				that.close();
			});
		}
		// close lightbox on background-click by default / if true
		if(!opt || opt && opt.closeOnClick || opt && !isset(opt.closeOnClick)) {
			addEvent(this.box,'click',function(e){
				that.close();
			});
		}
		// add resize-eventhandlers by default / if true
		if(!opt || opt && opt.responsive ) {
			addEvent(window,'resize',function(e){
				that.resize();
			});
		}
		// Find all thumbnails & add clickhandlers
		var images = document.getElementsByTagName('img');
		var clckHlpr = function(i) {
			addEvent(i,'click',function(e) {
				if(getAttr(i,'data-jslghtbx')) {
					// image-source given
					that.open(getAttr(i,'data-jslghtbx'));
				}
				else {
					// no image-source given
					that.open(getAttr(i,'src'));
				}
			});
		};
		for(var i = 0; i < images.length; i++)
		{
			if(hasAttr(images[i],'data-jslghtbx')) {
				clckHlpr(images[i]);
			}
		}
	};
	this.resize = function() {
		var img = that.wrapper.getElementsByTagName('img')[0];
		maxWidth = getWidth() * 0.8;
		maxHeight = getHeight() * 0.8;
		wrapperWidth = that.wrapper.offsetWidth;
		wrapperHeight = that.wrapper.offsetHeight;
		that.wrapper.setAttribute('width',maxWidth);
		that.wrapper.setAttribute('height',maxHeight);
		if(!imgRatio) {
			imgRatio = img.offsetWidth / img.offsetHeight;
		}
		// Height of image is too big to fit in viewport
		if( Math.floor(wrapperWidth/imgRatio) > that.wrapper.offsetHeight ) {
			newImgWidth = Math.floor(wrapperHeight*imgRatio);
			newImgHeight = wrapperHeight;
		}
		// Width of image is too big to fit in viewport
		else {
			newImgWidth = wrapperWidth;
			newImgHeight = Math.floor(wrapperWidth/imgRatio);
		}
		img.setAttribute('width',newImgWidth);
		img.setAttribute('height',newImgHeight);
		that.box.setAttribute('style','padding-top:'+((getHeight() - newImgHeight) /2)+'px');
	};
	this.refresh = function(opt) {
		if(opt) {
			this.opt = opt;
		}
		this.load(this.opt);
	};
	this.open = function(src) {
		if(!src){return false;}
		imgRatio = false; // clear old image ratio for proper resize-values
		var img = document.createElement('img');
		img.setAttribute('src',src);
		// hide overflow by default / if set
		if(!this.opt || !isset(this.opt.hideOverflow) || this.opt.hideOverflow ) {
			body.setAttribute('style','overflow: hidden');
		}
		this.box.setAttribute('style','padding-top: 0');
		this.wrapper.innerHTML = '';
		this.wrapper.appendChild(img);
		addClass(this.box,'jslghtbx-active');
		// already show wrapper due to bug where dimensions are not
		// correct in IE8
		if(isIE8) {
			addClass(that.wrapper,'jslghtbx-active');
		}
		var checkClassInt = setInterval(function(){
			if(hasClass(that.box,'jslghtbx-active') && img.complete)
			{
				// wait few ms to get correct image-offset
				setTimeout(function(){
					that.resize();
					// add active-class for all other browsers
					setTimeout(function(){
						addClass(that.wrapper,'jslghtbx-active');
					},10);
				},50);
				clearInterval(checkClassInt);
			}
		},10);
	};
	this.close = function() {
		removeClass(that.box,'jslghtbx-active');
		removeClass(that.wrapper,'jslghtbx-active');
		that.box.setAttribute('style','padding-top: 0px;');
		// Hide Lightbox if iE8
		if(isIE8) {
			that.box.setAttribute('style','display: none;');
		}
		// show overflow by default / if set
		if(!this.opt ||  !isset(this.opt.hideOverflow) || this.opt.hideOverflow ) {
			body.setAttribute('style','overflow: auto');
		}
	};
}

