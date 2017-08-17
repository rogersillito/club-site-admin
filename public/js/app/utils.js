import $ from 'jquery';
import 'bootstrap';
import 'smartmenus';
import 'smartmenus-bootstrap';
import 'ekko-lightbox';

// collapsable list group icon behaviour
$('.list-group-item').on('click', function() {
		$('.glyphicon', this)
				.toggleClass('glyphicon-chevron-right')
				.toggleClass('glyphicon-chevron-down');
});

// extended menu behaviour
$('#main-menu').smartmenus();

// media lightboxes
$(document).on('click', '[data-toggle="lightbox"]', function(event) {
  event.preventDefault();
  $(this).ekkoLightbox({
		// alwaysShowClose: true
	});
});
