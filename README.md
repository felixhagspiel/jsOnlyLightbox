# jsOnlyLightbox 0.5.3
#### Responsive Lightbox written in  plain JavaScript

## Features

- no jQuery needed, plain JavaScript
- Fully responsive
- Customizable Theme, SCSS-files included
- You can push images loaded via ajax to the lightbox
- Small in Size (< 10Kb)
- CSS3-Animations & controls, however, loading GIFs and arrow images can be used
- Licensed under MIT, code is free for commercial &amp; personal use. However, it would be great if you send me an link of your websites using my lightbox so I can see it live in action and post some real-word examples here. I am also happy about backlinks & github-stars :) **The pictures included are NOT free to use!** Please  [contact me first](http://felixhagspiel.de/contact) if you want to use the them!
- IE8+ support:
- Visit me on [felixhagspiel.de](http://felixhagspiel.de)
- Developing tools like this lightbox takes a lot of time. If you like my lightbox and want to support me, buy me a beer via the [paypal-donate button](http://jslightbox.felixhagspiel.de/) on my site :) Thanks!

Do not forget to add those lines inside your `<head></head>` if you want to support IE8:

		<!--[if lt IE 9]>
		    <script src="//cdnjs.cloudflare.com/ajax/libs/respond.js/1.4.2/respond.min.js" type="text/javascript"></script>
		<![endif]-->

## Install

The lightbox is still in development mode, so please post any issues and bugs on github. You can also use bower or npm to install the lightbox:

	bower install jsonlylightbox --save-dev

	npm install jsonlylightbox --save-dev

## Demo

You can watch it live at [jslightbox.felixhagspiel.de](http://jslightbox.felixhagspiel.de/) or on [felixhagspiel.de](http://felixhagspiel.de/projects)

## Usage

Add the CSS-File to the head of your html-file:

	<link rel="stylesheet" href="css/lightbox.css">

Add this before the closing body tag:

	<script src="lightbox.min.js" type="text/javascript"></script>
	<script>
		var lightbox = new Lightbox();
	 	lightbox.load();
	</script>

You just need to add the attribute `data-jslghtbx` to all the images or elements you want to show in the lightbox:

	<img class="jslghtbx-thmb" src="img/lightbox/1.jpg" alt="" data-jslghtbx>
    <a href="img/lightbox/1.jpg"  data-jslghtbx="img/lightbox/1.jpg">Opens lightbox with a no-js fallback link</a>

Note: The CSS-class `jslghtbx-thmb` is optional. You can use your own styling if you want.

You can pass a link of a different image via the `data-jslghtbx` attribute, which then will be loaded on click. Use this if you want to use small sized pictures for the thumbnails to reduce traffic:

	<img class="jslghtbx-thmb" src="img/lightbox/1.jpg" alt="" data-jslghtbx="img/1-big.jpg">

You can also dynamically push images to groups, this is usefull if you load images via ajax. See the [`lightbox.thumbnails`](#lightboxthumbnails) attribute for an example.

If you want to group images to structure your content, use the `data-jslghtbx-group` attribute. You can have multiple groups on one page. This is also helpful when you dont want to use thumbnails, just hide the thumbnails via CSS:

	<img class="jslghtbx-thmb" src="img/lightbox/3-small.jpg" alt="" data-jslghtbx="img/3-big.jpg" data-jslghtbx-group="mygroup1">
	<img class="jslghtbx-thmb" src="img/lightbox/4-small.jpg" alt="" data-jslghtbx="img/4-big.jpg" data-jslghtbx-group="mygroup1">
	<img class="jslghtbx-thmb" src="img/lightbox/6-small.jpg" alt="" data-jslghtbx="img/6-big.jpg" data-jslghtbx-group="mygroup1">
	<img class="jslghtbx-thmb" src="img/lightbox/7-small.jpg" alt="" data-jslghtbx="img/7-big.jpg" data-jslghtbx-group="mygroup1">


	<img class="jslghtbx-thmb" src="img/lightbox/8-small.jpg" alt="" data-jslghtbx="img/1-big.jpg" data-jslghtbx-group="mygroup2">
	<img class="jslghtbx-thmb" src="img/lightbox/9-small.jpg" alt="" data-jslghtbx="img/1-big.jpg" data-jslghtbx-group="mygroup2">
	<img class="jslghtbx-thmb" src="img/lightbox/10-small.jpg" alt="" data-jslghtbx="img/1-big.jpg" data-jslghtbx-group="mygroup2">

The default control-arrows will be loaded when using groups. You can also use your own control-buttons by providing an ID via the options. For more detail look into the options section below.

If you want to use captions add the `data-jslghtbx-caption` attribute. You can also pass HTML:

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

###	`{loadingAnimation: string || number || boolean}`
_Default: 200_

If set to true, an animation will be rendered until the image is loaded. Alternatively you can pass milliseconds as number, which defines the interval the `span`-elements inside the `jslghtbx-loading-animation`-container get the class `jslghtbx-active` (the default interval is 200ms). You can use this to apply your own styling via CSS. The animation is using CSS3, so it will not work in IE8/9. You can also pass a link to an GIF-image, which then replaces the animation. This is disabled for IE8 due to bugs with transparent backgrounds and performance issues. If set to false, no animation is shown.

Note: The animations get an 500ms delay until they start, so they won`t pop up on fast connections. Also, you should check for CSS3-support and set the animation-option accordingly.

###	`{animElCount: number}`
_Default: 4_

This sets the number of animated `span` tags which are appended to the `jslghtbx-loading-animation` container. Must be higher than 1.

###	`{carousel: bool}`
_Default: true_

If set to true, you can infinitely loop through all the images by clicking the next/prev button or calling the `next()` / `prev()`-functions.

###	`{captions: bool}`
_Default: true_

If set to true, the caption text inside the `data-jslghtbx-caption` attribute will be shown. Note that the text may not be visible completely if it is very long. Feel free to style the caption class `.jslghtbx-caption` to your needs.

###	`{closeOnClick: bool}`
_Default: true_

If set to true, the lightbox will close on click anywhere inside the viewport, not just by clicking on the close-button.

Note: May not work in IE8.

###	`{nextOnClick: bool}`
_Default: true_

If set to true, a click on the current image shows the next image.

###	`{hideOverflow: bool}`
_Default: true_

Hides scrollbars when lightbox is opened.

###	`{hideCloseBtn: bool}`
_Default: false_

Hides the closebutton inside the lightbox.

###	`{dimensions: bool}`
_Default: true_

Images will be resized to a maximum of the original dimensions. If set to false, images are always scaled to fullscreen.

###	`{controls: bool}`
_Default: true_

Show or hide the default next- & prev-buttons.

###	`{keyControls: bool}`
_Default: true_

Use right and left keys on keyboard to navigate through gallery and escape key to close the box.

###	`{nextImg: 'path/to/image'}`
Here you can pass the path to an alternative next-button image. By default the arrows are rendered via CSS. If you want to use images make sure to apply custom styling for smaller viewports via the CSS-Class `jslghtbx-next`.

###	`{prevImg: 'path/to/image'}`
Here you can pass the path to an alternative prev-button image. By default the arrows are rendered via CSS. If you want to use images make sure to apply custom styling for smaller viewports via the CSS-Class `jslghtbx-prev`.

###	`{boxId: 'elementId'}`
Here you can pass an ID if you want to use your own box-element. Images will be appended to that element then. The element will receive a class "jslghtbx-active" when opened, so style this class properly (you need at least to remove visibility by default and add it on active). If you want it to look like the default-box, just add the class "jslghtbx" to the box-element.

###	`{animation: number | bool}`
_Default: 400_

This options defines wether the next/prev-switch should be animated. If you pass an integer-value, it defines the milliseconds for the animation. Passing `false` disables the animation. Note that all animations are done via CSS3-transitions, so if you want to alter them you have to do it via the CSS-file.

###	`{maxImgSize: float}`
_Default: 0.8_

This is the modifier which is used to reduce the images size when it's full size won't fit in the viewport. Maximum value is 1 for 100%.

#### Callbacks

###	`{onopen: function}`
Function that is executed when the lightbox is opened.

###	`{onclose: function}`
Function that is executed when the lightbox is closed.

###	`{onresize: function}`
Function that is executed when the lightbox is resized.

###	`{onload: function(event)}`
Function that is executed once the current image is loaded. The callback receives an event which is `"prev"` if the prev button was clicked, `"next"` if the next button was clicked or `false` for all other ways of opening the lightbox.

###	`{onloaderror: function(event)}`
Function that is executed when the current image fails to load. You can add your handlers here to display a warning or call other functions. The callback receives an event which is `"prev"` if the prev button was clicked, `"next"` if the next button was clicked or `false` for all other ways of opening the lightbox. This allows you to handle errors. For example you can just show the next or previous picture if the current one is not available:

		onloaderror: function(event){
			if(event === 'prev')
				lightbox.prev()
			else
				lightbox.next()
		}

## Attributes

### `lightbox.thumbnails`
Type: `Array`

Array holding all thumbnail elements. If you want to dynamically load and push pictures to an existing group be sure to set a groupname on the element via the `data-jslghtbx-group` attribute. If you want to show just one dynamic loaded picture you should use the `open()` method. Don't forget to set the `data-jslghtbx-index` attribute as unique identifier!
Example:

    var img = new Image()
    img.src = 'img/lightbox/9-small.jpg'
    img.setAttribute('data-jslghtbx-group','mygroup1')
    img.setAttribute('data-jslghtbx-index', lightbox.thumbnails.length)
    lightbox.thumbnails.push(img)

## Methods

### `lightbox.load(options)`

The init-function. Here you can pass your option-object. Has to be called once on the box-object. If you dont pass options, the defaults are loaded. A full call may look like this:

Example:

	/* Default options */
	var options = {
		boxId: 				'testID',
		dimensions: 		true,
		captions: 			true,
		prevImg: 			false,
		nextImg: 			false,
		hideCloseBtn: 		false,
		closeOnClick: 		true,
		loadingAnimation: 	200,
		animElCount: 		4,
		preload: 			true,
		carousel: 			true,
		animation: 			400,
		nextOnClick: 		true,
		responsive: 		true,
		maxImgSize:			0.8,
		keyControls: 		true,
		// callbacks
		onopen: function(){
			// ...
		},
		onclose: function(){
			// ...
		},
		onload: function(){
			// ...
		},
		onresize: function(event){
			// ...
		},
		onloaderror: function(event){
			// ...
		}
	};
	var lightbox = new Lightbox();
	lightbox.load(options);

### `lightbox.open(src-link || image, groupName)`
You can open the box manually via JS. There are multiple ways to tell the box which image to load.

1. Via link:

		document.getElementById('open-lightbox').addEventListener('click',function(){
			lightbox.open('../img/lightbox/1.jpg');
		});

2. Via image object:

		var myImg = document.getElementById('myImg');
		document.getElementById('open-lightbox').addEventListener('click',function(){
			lightbox.open(myImg);
		});

3. Via group name, which shows the first image of the group. The first parameter must be false:

		document.getElementById('open-lightbox').addEventListener('click',function(){
			lightbox.open(false,'myGroup');
		});

### `lightbox.next()`
Shows the next image of current group

### `lightbox.prev()`
Shows the previous image of current group

### `lightbox.close()`
Closes the lightbox.

### `lightbox.resize()`
Repositions the image in the lightbox. Is called on every resize-event unless you set the `responsive`-option to false.