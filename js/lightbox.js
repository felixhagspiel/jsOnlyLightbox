function Lightbox () {
	/*
	* 	Attributes
	*/

	// public
	this.opt = {};
	this.box = false;
	this.wrapper = false;
	var isIE8 = false;
	// private
	var that = this;
	var body = document.getElementsByTagName('body')[0];
	var template = '<div class="jslghtbx-contentwrapper" id="jslghtbx-contentwrapper" ></div>';
	var imgRatio = false; // ratio of current image
	var currGroup = false; // current group
	var currThumbnail = false; // first clicked thumbnail
	var currImages = []; // images belonging to current group
	var thumbnails = []; // thumbnails
	// controls
	var nextBtn = false;
	var prevBtn = false;
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
	// add clickhandlers to thumbnails
	var clckHlpr = function(i) {
		addEvent(i,'click',function(e) {
			currGroup = getAttr(this, 'data-jslghtbx-group') || false;
			currThumbnail = this;
			that.open(this);
		});
	};
	// get thumbnails by group
	var getByGroup = function(group) {
		var arr = [];
		for (var i = 0; i < thumbnails.length; i++) {
			if(getAttr(thumbnails[i],'data-jslghtbx-group') === group) {
				arr.push(thumbnails[i]);
			}
		}
		return arr;
	};
	// get position of thumbnail in group-array
	var getPos = function(thumbnail, group) {
		var arr = getByGroup(group);
		for (var i = 0; i < arr.length; i++) {
			if(getAttr(thumbnail,'src') === getAttr(arr[i],'src') &&
				getAttr(thumbnail,'data-jslghtbx') === getAttr(arr[i],'data-jslghtbx') ){
				return i;
			}
		}
	};
	// init controls
	var initControls = function() {
		if(!nextBtn) {
			// create & append next-btn
			nextBtn = document.createElement('span');
			addClass(nextBtn,'jslghtbx-next');
			var nextBtnImg = document.createElement('img');
			nextBtnImg.setAttribute('src', 'img/jslghtbx-next.png');
			nextBtn.appendChild(nextBtnImg);
			addEvent(nextBtn,'click',function(e){
				e.stopPropagation(); // prevent closing of lightbox
				that.next();
			});
			that.box.appendChild(nextBtn);
		}
		if(!prevBtn) {
			// create & append next-btn
			prevBtn = document.createElement('span');
			addClass(prevBtn,'jslghtbx-prev');
			var prevBtnImg = document.createElement('img');
			prevBtnImg.setAttribute('src', 'img/jslghtbx-prev.png');
			prevBtn.appendChild(prevBtnImg);
			addEvent(prevBtn,'click',function(e){
				e.stopPropagation(); // prevent closing of lightbox
				that.next();
			});
			that.box.appendChild(prevBtn);			
		}
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
		// initiate default controls
		if(!opt || opt && opt.controls || opt && !isset(opt.controls)) {
			that.opt['controls'] = true;
		}		
		// add clickhandlers for custom next-button
		if(opt && opt.nextId) {
			addEvent(document.getElementById(opt.nextId),'click',function(){
				that.next();
			});
		}
		// add clickhandlers for custom prev-button
		if(opt && opt.prevId) {
		addEvent(document.getElementById(opt.prevId),'click',function(){
				that.prev();
			});
		}
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
		if(!opt || opt && opt.responsive  || !isset(opt.responsive)) {
			this.opt['responsive'] = true;
			addEvent(window,'resize',function(e){
				that.resize();
			});
			addClass(this.box,'jslghtbx-nooverflow'); // hide scrollbars on prev/next
		} 
		else {
			removeClass(this.box,'jslghtbx-nooverflow');
		}
		// set carousel-function for prev/next
		if(!opt || opt && opt.carousel || opt && !isset(opt.carousel)) {
			this.opt['carousel'] = true;
		}
		// Find all thumbnails & add clickhandlers
		var arr = document.getElementsByTagName('img');
		for(var i = 0; i < arr.length; i++)
		{
			if(hasAttr(arr[i],'data-jslghtbx')) {
				thumbnails.push(arr[i]);
				clckHlpr(arr[i]);
			}
		}
	};
	this.resize = function() {
		var img = that.wrapper.getElementsByTagName('img')[0];
		maxWidth = getWidth();
		maxHeight = getHeight();
		boxWidth = that.box.offsetWidth;
		boxHeight = that.box.offsetHeight;
		if(!imgRatio) {
			imgRatio = img.offsetWidth / img.offsetHeight;
		}
		// Height of image is too big to fit in viewport
		if( Math.floor(boxWidth/imgRatio) > boxHeight ) {
			newImgWidth = boxHeight*imgRatio*0.8;
			newImgHeight = boxHeight*0.8;
		}
		// Width of image is too big to fit in viewport
		else {
			newImgWidth = boxWidth*0.8;
			newImgHeight = boxWidth/imgRatio*0.8;
		}
		img.setAttribute('width',Math.floor(newImgWidth));
		img.setAttribute('height',Math.floor(newImgHeight));
		that.box.setAttribute('style','padding-top:'+((getHeight() - newImgHeight) /2)+'px');
		// move controls to correct position
		if(this.opt.responsive && nextBtn && prevBtn) {
			var btnTop = (boxHeight/2) + 'px';
			var btnMargin = '-'+(nextBtn.offsetHeight / 2) + 'px';
			nextBtn.style.top = top;
			prevBtn.style.top = top;
			nextBtn.style.marginTop = btnMargin;
			prevBtn.style.marginTop = btnMargin;
		}
	};
	// show next image
	this.next = function() {
		if(!currGroup){return};
		// get position of next image
		var pos = getPos(currThumbnail,currGroup) + 1;  
		if(currImages[pos]) {
			currThumbnail = currImages[pos];	
		} 
		else if(that.opt.carousel) {
			currThumbnail = currImages[0];
		}
		else {
			return;
		}
		that.open(currThumbnail);
	};
	// show prev image
	this.prev = function() {
		if(!currGroup){return};
		// get position of prev image
		var pos = getPos(currThumbnail,currGroup) - 1; 
		if(currImages[pos]) {
			currThumbnail = currImages[pos];	
		}
		else if(that.opt.carousel) {
			currThumbnail = currImages[currImages.length - 1];
		}
		else {
			return;
		}
		that.open(currThumbnail);
	};
	// open the lightbox and show image
	this.open = function(el,group) {
		if(!el){return false;}
		// get correct image-source
		var src;
		if(typeof el === 'string') {
			// string with img-src given
			src = el;
		}
		else if(getAttr(el,'data-jslghtbx')) {
			// image-source given
			src =  getAttr(el,'data-jslghtbx');
		}
		else {
			// no image-source given
			src =  getAttr(el,'src');
		}
		// save images if group param was passed or currGroup exists
		group = group || currGroup;
		if(group) {
			currImages = getByGroup(group);
			if(this.opt.controls) {
				initControls();
			}
		}
		imgRatio = false; // clear old image ratio for proper resize-values
		// create new img-element
		var imgEl = document.createElement('img');
		imgEl.setAttribute('src',src);
		// hide overflow by default / if set
		if(!this.opt || !isset(this.opt.hideOverflow) || this.opt.hideOverflow ) {
			body.setAttribute('style','overflow: hidden');
		}
		this.box.setAttribute('style','padding-top: 0');
		this.wrapper.innerHTML = '';
		this.wrapper.appendChild(imgEl);
		addClass(this.box,'jslghtbx-active');
		// already show wrapper due to bug where dimensions are not
		// correct in IE8
		if(isIE8) {
			addClass(that.wrapper,'jslghtbx-active');
		}
		var checkClassInt = setInterval(function(){
			if(hasClass(that.box,'jslghtbx-active') && imgEl.complete)
			{
				// wait few ms to get correct image-dimensions
				setTimeout(function(){
					that.resize();
					// add active-class for all other browsers
					setTimeout(function(){
						addClass(that.wrapper,'jslghtbx-active');
					},10);
					clearInterval(checkClassInt);
				},40);
			}
		},10);
	};
	this.close = function() {
		currGroup = false;
		currThumbnail = false;
		currImages = [];
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

