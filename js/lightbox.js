function Lightbox () {
	/*
	* 	Attributes
	*/

	// public
	this.opt = {};
	this.box = false;
	this.wrapper = false;
	
	// private
	var that = this;
	var isIE8 = false;
	var body = document.getElementsByTagName('body')[0];
	var template = '<div class="jslghtbx-contentwrapper" id="jslghtbx-contentwrapper" ></div>';
	var imgRatio = false; // ratio of current image
	var currGroup = false; // current group
	var currThumbnail = false; // first clicked thumbnail
	var currImage = {}; // currently shown image
	var currImages = []; // images belonging to current group
	var thumbnails = []; // thumbnails
	var isOpen = false; // check if box is open
	var loadingImgSrc; // path to loading image
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
	}

	// preload next and prev images
	function preload(){
		var prev = new Image();
		var next = new Image();
		var pos = getPos(currThumbnail,currGroup);
		if(pos === (currImages.length - 1)) {
			prev.src = currImages[currImages.length - 1].src;
			next.src = currImages[0].src;
		} else if(pos === 0) {
			prev.src = currImages[currImages.length - 1].src;
			next.src = currImages[1].src;
		} else {
			prev.src = currImages[pos - 1].src;
			next.src = currImages[pos + 1].src;
		}
	}

	// move controls to correct position
	function repositionControls() {
		if(that.opt.responsive && nextBtn && prevBtn) {
			var btnTop = (getHeight() / 2) - (nextBtn.offsetHeight / 2);
			if(isIE8) {
				var cssString = "top: "+btnTop+"px;";
				nextBtn.cssText = cssString;
				prevBtn.cssText= cssString;
			}
			else {
				nextBtn.style.top = btnTop+"px";
				prevBtn.style.top = btnTop+"px";
			}
		}
	}

	// add clickhandlers to thumbnails
	var clckHlpr = function(i) {
		addEvent(i,'click',function(e) {
			currGroup = getAttr(i, 'data-jslghtbx-group') || false;
			currThumbnail = i;
			that.open(i);
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
				if(e.stopPropagation) {e.stopPropagation();}
				else {e.returnValue=false;} // prevent closing of lightbox
				that.next();
			});
			that.box.appendChild(nextBtn);
		}
		addClass(nextBtn,'jslghtbx-active');
		if(!prevBtn) {
			// create & append next-btn
			prevBtn = document.createElement('span');
			addClass(prevBtn,'jslghtbx-prev');
			var prevBtnImg = document.createElement('img');
			prevBtnImg.setAttribute('src', 'img/jslghtbx-prev.png');
			prevBtn.appendChild(prevBtnImg);
			addEvent(prevBtn,'click',function(e){
				if(e.stopPropagation) {e.stopPropagation();}
				else {e.returnValue=false;} // prevent closing of lightbox
				that.prev();
			});
			that.box.appendChild(prevBtn);			
		}
		addClass(prevBtn,'jslghtbx-active');
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
			addClass(that.box,'jslghtbx-ie8');
		}
		this.wrapper = document.getElementById('jslghtbx-contentwrapper');

		// initiate default controls
		if(!opt || opt && opt.controls || opt && !isset(opt.controls)) {
			that.opt['controls'] = true;
		}

		// keep dimensions
		if(!opt || opt && opt.dimensions || opt && !isset(opt.dimensions)) {
			that.opt['dimensions'] = true;
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
		if( !isIE8 && (!opt || opt && opt.closeOnClick || opt && !isset(opt.closeOnClick))) {
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

		// set loading-image
		if(!opt || opt && !isset(opt.loadingImgSrc)) {
			loadingImgSrc = 'img/jslghtbx-loading.gif';
		} else {
			loadingImgSrc = opt.loadingImgSrc;
		}
		if(!opt || opt && opt.loadingImg || opt && !isset(opt.loadingImg)) {
			this.opt['loadingImg'] = true;
			var el = document.createElement('img');
			el.setAttribute('src',loadingImgSrc);
			addClass(el,'jslghtbx-loading-img');
			this.box.appendChild(el);
		}

		// set preload-option
		if(!opt || opt && opt.preload || opt && !isset(opt.preload)) {
			this.opt['preload'] = true;
		}

		// set carousel-function for prev/next
		if(!opt || opt && opt.carousel || opt && !isset(opt.carousel)) {
			this.opt['carousel'] = true;
		}

		// set animation-params
		if(!opt || opt && !isset(opt.animation) || opt && isset(opt.animation) && opt.animation === true) {
			that.opt['animation'] = 400; // set default animation time
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
		if(!currImage.img){return;}
		maxWidth = getWidth();
		maxHeight = getHeight();
		boxWidth = that.box.offsetWidth;
		boxHeight = that.box.offsetHeight;
		if(!imgRatio && currImage.img && currImage.img.offsetWidth && currImage.img.offsetHeight) {
			imgRatio = currImage.img.offsetWidth / currImage.img.offsetHeight;
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
		newImgWidth = Math.floor(newImgWidth);
		newImgHeight = Math.floor(newImgHeight);

		// check if image exceeds maximum size
		if( this.opt.dimensions && newImgHeight > currImage.originalHeight ||
			this.opt.dimensions && newImgWidth > currImage.originalWidth) {

			newImgHeight = currImage.originalHeight;
			newImgWidth = currImage.originalWidth;
		}
		currImage.img.setAttribute('width',newImgWidth);
		currImage.img.setAttribute('height',newImgHeight);
		that.box.setAttribute('style','padding-top:'+((getHeight() - newImgHeight) /2)+'px');

		repositionControls();
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
		if(typeof this.opt.animation === 'number') {
			removeClass(currImage.img,'jslghtbx-animating-next');
			setTimeout(function(){
				that.open(currThumbnail);
				setTimeout(function(){
					addClass(currImage.img,'jslghtbx-animating-next');
				},that.opt.animation / 2)
				
			},this.opt.animation / 2);
		}
		else {
			that.open(currThumbnail);
		}
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
		if(typeof this.opt.animation === 'number') {
			removeClass(currImage.img,'jslghtbx-animating-prev');
			setTimeout(function(){
				that.open(currThumbnail);
				setTimeout(function(){
					addClass(currImage.img,'jslghtbx-animating-prev');
				},that.opt.animation / 2)
				
			},this.opt.animation / 2);
		}
		else {
			that.open(currThumbnail);
		}
	};

	// open the lightbox and show image
	this.open = function(el,group) {
		if(!el){return false;}

		// create new img-element
		currImage.img = new Image();

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
		imgRatio = false; // clear old image ratio for proper resize-values

		// add init-class on opening, but not at prev/next
		if(!isOpen) {
			addClass(currImage.img,'jslghtbx-animate-transition jslghtbx-animate-init');
			isOpen = true;
		}
		
		// hide overflow by default / if set
		if(!this.opt || !isset(this.opt.hideOverflow) || this.opt.hideOverflow ) {
			body.setAttribute('style','overflow: hidden');
		}
		this.box.setAttribute('style','padding-top: 0');
		this.wrapper.innerHTML = '';
		this.wrapper.appendChild(currImage.img);
		addClass(this.box,'jslghtbx-active');

		// show wrapper early to avoid bug where dimensions are not
		// correct in IE8
		if(isIE8) {
			addClass(that.wrapper,'jslghtbx-active');
		}

		// save images if group param was passed or currGroup exists
		group = group || currGroup;
		if(group) {
			currImages = getByGroup(group);
			if(that.opt.controls) {
				initControls();
			}
		}
		// show wrapper when image is loaded
		currImage.img.onload = function(){
			// store original width here
			var dummyImg = new Image();
			dummyImg.setAttribute('src',src);
			currImage.originalWidth = dummyImg.width;
			currImage.originalHeight = dummyImg.height;	
			addClass(that.wrapper,'jslghtbx-wrapper-active');
			var checkClassInt = setInterval(function(){
				if(hasClass(that.box,'jslghtbx-active') && hasClass(that.wrapper,'jslghtbx-wrapper-active'))
				{
					that.resize();
					addClass(currImage.img,'jslghtbx-animate-transition');
					// remove loading-gif
					removeClass(that.box,'jslghtbx-loading');
					// preload previous and next image
					if(that.opt.preload) {
						preload();
					}
					clearInterval(checkClassInt);
				}
			},10);
		};

		// set src 
		currImage.img.setAttribute('src',src);

		// add loading-gif if set and if not IE8
		if(this.opt.loadingImg && !isIE8) {
			console.log('LOADING')
			addClass(this.box,'jslghtbx-loading');
		}
	};

	this.close = function() {
		// restore Defaults
		currGroup = false;
		currThumbnail = false;
		currImage = {};
		currImages = [];
		isOpen = false;
		removeClass(that.box,'jslghtbx-active');
		removeClass(that.wrapper,'jslghtbx-wrapper-active');
		removeClass(nextBtn,'jslghtbx-active');
		removeClass(prevBtn,'jslghtbx-active');
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

