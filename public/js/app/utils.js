import $ from 'jquery';
import 'bootstrap';
import 'smartmenus';
import 'smartmenus-bootstrap';

// collapsable list group icon behaviour
$('.list-group-item').on('click', function() {
		$('.glyphicon', this)
				.toggleClass('glyphicon-chevron-right')
				.toggleClass('glyphicon-chevron-down');
});

$('#main-menu').smartmenus();
