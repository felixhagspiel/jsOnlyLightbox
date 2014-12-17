# Responsive Lightbox written in  plain JavaScript

## Features

- no jQuery needed, plain JavaScript
- Fully responsive
- Customizable Theme, SASS-files included
- Small in Size (< 10Kb)
- CSS3-Animations
- Licensed under MIT, code is free for commercial &amp; personal use. However, it would be great if you send me an link of your websites using my lightbox so I can see it live in action and post some real-word examples here. I am also happy about backlinks & github-stars :) **The pictures included are NOT free to use!** Please  [contact me first](http://felixhagspiel.de/contact) if you want to use the them!
- IE8+ support:

Do not forget to add those lines inside your `<head></head>` if you want to support IE8:

		<!--[if lt IE 9]>
		    <script src="//cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js" type="text/javascript"></script>
		<![endif]-->

## Download

Fork or [download at jslightbox.felixhagspiel.de](http://jslightbox.felixhagspiel.de/). The lightbox is still in development mode, so please post any issues and bugs here.

## Demo

You can watch it live at [jslightbox.felixhagspiel.de](http://jslightbox.felixhagspiel.de/) or on [felixhagspiel.de](http://felixhagspiel.de/)

## Usage

Add the CSS-File to the head of your html-file:
	
	<link rel="stylesheet" href="css/lightbox.css">

Add this before the closing body tag:

	<script src="lightbox.min.js" type="text/javascript"></script>
	<script>
		var lightbox = new Lightbox();
	 	lightbox.load();
	</script>

You just need to add the attribute `data-jslghtbx` to all the images you want to show in the lightbox:

	<img class="jslghtbx-thmb" src="img/lightbox/1.jpg" alt="" data-jslghtbx>

You can also pass an link to another image:

	<img class="jslghtbx-thmb" src="img/lightbox/1.jpg" alt="" data-jslghtbx="img/1-big.jpg">

Note: The CSS-class `jslghtbx-thmb` is optional. You can use your own styling if you want.

If you want to use multiple images, set the `data-jslghtbx-group`-attribute:

	<img class="jslghtbx-thmb" src="img/lightbox/1.jpg" alt="" data-jslghtbx data-jslghtbx-group="group1">
	<img class="jslghtbx-thmb" src="img/lightbox/2.jpg" alt="" data-jslghtbx data-jslghtbx-group="group1">

You can use different groups on one website. The default control-arrows will be loaded when using groups. You can also use your own control-buttons by providing an ID via the options (see options-reference).

For captions, put text or HTML inside the `data-jslghtbx-caption`-attribute:
	
	<img class="jslghtbx-thmb" src="img/lightbox/2.jpg" alt="" data-jslghtbx data-jslghtbx-caption="This is my <a href='http://abc.de'>caption.</a>">

## CSS Animations

When the lightbox is opened first, the image inside gets the class `jslghtbx-animate-init`. This is useful if you want to animate opacity. 
If you are showing multiple images inside the box via the group-param, the classes `jslghtbx-animating-next` and `jslghtbx-animating-prev` are added and removed, each for half of the durationtime given by the option `animation` (defaults to 400 milliseconds).
The box receives the class `jslghtbx-active` when opened, and the wrapper gets `jslghtbx-wrapper-active` when all calculations are done. Feel free to edit those styles.

## Options

###	`{responsive: bool}` 
_Default: true_

If set to true, the image will be resized according to the viewport on resize-events.

###	`{preload: bool}`
_Default: true_

If set to true, the previous and the next image of the currently shown image will be preloaded if not already in cache.

###	`{loadingImg: bool}`
_Default: true_

If set to true, the loading-gif will be shown until the image is loaded. Feel free to replace the GIF inside the img-folder. Note: This is disabled for IE8 due to bugs with transparent backgrounds and performance issues.

###	`{loadingImgSrc: bool}`
_Default: 'img/jslghtbx-loading.gif'

Here you can set another image-URL for the loading animation.

###	`{carousel: bool}`
_Default: true_

If set to true, you can infinitely loop through all the images by clicking the next/prev button or calling the `next()` / `prev()`-functions.  

###	`{captions: bool}`
_Default: true_

If set to true, the caption text inside the `data-jslghtbx-caption` attribute will be shown. Note that the text may not be visible completely if it is very long. Feel free to style the caption class `.jslghtbx-caption` to your needs.

###	`{closeOnClick: bool}`
_Default: true_

If set to true, the lightbox will close on click anywhere inside the viewport, not just by clicking on the close-button. Note: May not work in IE8.

###	`{hideOverflow: bool}`
_Default: true_

Hides scrollbars when lightbox is opened.

###	`{hideCloseBtn: bool}`
_Default: false_

Hides the closebutton inside the lightbox.

###	`{dimensions: bool}`
_Default: true_

Only resize image to original dimensions. If set to false, images are always scaled to fullscreen.

###	`{controls: bool}`
_Default: true_

Show or hide the default next- & prev-buttons.

###	`{closeId: 'elementId'}`
Here you can pass your own closebutton-ID if you want to use your own element for closing the box. The regular close-button won't be displayed then.

###	`{boxId: 'elementId'}`
Here you can pass an ID if you want to use your own box-element. Images will be appended to that element then. The element will receive a class "jslghtbx-active" when opened, so style this class properly (you need at least to remove visibility by default and add it on active). If you want it to look like the default-box, just add the class "jslghtbx" to the box-element.

###	`{animation: number | bool}`
_Default: 400_

This options defines wether the next/prev-switch should be animated. If you pass an integer-value, it defines the milliseconds for the animation. Passing `false` disables the animation. Note that all animations are done via CSS3-transitions, so if you want to alter them you have to do it via the CSS-file. 

###	`{onopen: function}`
Function that is executed when the lightbox is opened.

###	`{onclose: function}`
Function that is executed when the lightbox is closed.

###	`{onresize: function}`
Function that is executed when the lightbox is resized.

###	`{onload: function}`
Function that is executed once the current image is loaded.

## Methods

### `lightbox.load(options)`

The init-function. Here you can pass your option-object. Has to be called once on the box-object.

Example:

	/* Default options */
	var options = {
		responsive: true, 		// add handlers for resize-event
		closeOnClick: true, 	// close lightbox on background-click
		hideOverflow: true,		// hide scrolling-bar when lightbox is open
		hideCloseBtn: false,	// hide the close-button inside the lightbox
		closeId: false, 		// use your own close-button
		boxId: false 			// use own box-element
	};
	var lightbox = new Lightbox();
	lightbox.load(options);

### `lightbox.open('src-link')`
If you want you can open the box by click on any element on your page.
Example:

	document.getElementById('open-lightbox').addEventListener('click',function(){
		lightbox.open('../img/lightbox/1.jpg');
	});

You can also just pass a reference to an image rather than a src-URL.
Example:

	var myImg = document.getElementById('myImg');
	document.getElementById('open-lightbox-button').addEventListener('click',function(){
		lightbox.open(myImg);
	});

### `lightbox.next()`
Shows the next image of current group

### `lightbox.prev()`
Shows the previous image of current group

### `lightbox.close()`
Closes the lightbox.

### `lightbox.resize()`
Repositions the image in the lightbox. Is called on every resize-event unless you set the `responsive`-option to false.