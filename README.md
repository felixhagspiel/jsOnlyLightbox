# Responsive Lightbox written in  plain JavaScript

## Features

- no jQuery needed
- Fully responsive
- Highly customizable
- Small in Size (< 5Kb)
- IE8+ Support

## Usage

Add this before the closing body tag ( `</body>` ):

	<script src="jslightbox.js" type="text/javascript"></script>
	<script>
		/* Default options */
		var options = {
			responsive: true, 		// add handlers for resize-event
			closeOnClick: true, 	// close lightbox on background-click
			closeId: false, 		// use your own close-button
			boxId: false 			// use own box-element
		};
		var lightbox = new Lightbox(options);
	 	lightbox.load();
	</script>

### Load the images of the thumbnails in Lightbox:

	<img class="lightbox-thmb" src="img/lightbox/1.jpg" alt="" data-lightbox>
	<img class="lightbox-thmb" src="img/lightbox/2.jpg" alt="" data-lightbox>
	<img class="lightbox-thmb" src="img/lightbox/3.jpg" alt="" data-lightbox>
	<img class="lightbox-thmb" src="img/lightbox/4.jpg" alt="" data-lightbox>
	<img class="lightbox-thmb" src="img/lightbox/5.jpg" alt="" data-lightbox>

### Load specified images in Lightbox:

	<img class="lightbox-thmb" src="img/lightbox/1.jpg" alt="" data-lightbox="img/1-big.jpg">
	<img class="lightbox-thmb" src="img/lightbox/2.jpg" alt="" data-lightbox="img/2-big.jpg">
	<img class="lightbox-thmb" src="img/lightbox/3.jpg" alt="" data-lightbox="img/3-big.jpg">
	<img class="lightbox-thmb" src="img/lightbox/4.jpg" alt="" data-lightbox="img/4-big.jpg">
	<img class="lightbox-thmb" src="img/lightbox/5.jpg" alt="" data-lightbox="img/5-big.jpg">

## Options

###	responsive

###	closeOnClick

###	closeId

###	boxId