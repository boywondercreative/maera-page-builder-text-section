/* global jQuery, _ */
var oneApp = oneApp || {}, $oneApp = $oneApp || jQuery(oneApp);

(function (window, $, _, oneApp, $oneApp) {
	'use strict';

	oneApp.TextView = oneApp.SectionView.extend({
		events: function() {
			return _.extend({}, oneApp.SectionView.prototype.events, {
				'change .maera_pb-text-columns' : 'handleColumns'
			});
		},

		handleColumns : function (evt) {
			evt.preventDefault();

			var columns = $(evt.target).val(),
				$stage = $('.maera_pb-text-columns-stage', this.$el);

			$stage.removeClass('maera_pb-text-columns-1 maera_pb-text-columns-2 maera_pb-text-columns-3 maera_pb-text-columns-4');
			$stage.addClass('maera_pb-text-columns-' + parseInt(columns, 10));
		}
	});

	// Maeras gallery items sortable
	oneApp.initializeTextColumnSortables = function(view) {
		var $selector;
		view = view || '';

		if (view.$el) {
			$selector = $('.maera_pb-text-columns-stage', view.$el);
		} else {
			$selector = $('.maera_pb-text-columns-stage');
		}

		$selector.sortable({
			handle: '.maera_pb-sortable-handle',
			placeholder: 'sortable-placeholder',
			forcePlaceholderSizeType: true,
			distance: 2,
			tolerance: 'pointer',
			zIndex: 99999,
			start: function (event, ui) {
				// Set the height of the placeholder to that of the sorted item
				var $item = $(ui.item.get(0)),
					$stage = $item.parents('.maera_pb-text-columns-stage'),
					addClass = '';

				// If text item, potentially add class to stage
				if ($item.hasClass('maera_pb-text-column')) {
					if ($item.hasClass('maera_pb-column-width-two-thirds')) {
						addClass = 'current-item-two-thirds';
					} else if ($item.hasClass('maera_pb-column-width-one-third')) {
						addClass = 'current-item-one-third';
					} else if ($item.hasClass('maera_pb-column-width-one-fourth')) {
						addClass = 'current-item-one-fourth';
					} else if ($item.hasClass('maera_pb-column-width-three-fourths')) {
						addClass = 'current-item-three-fourths';
					} else if ($item.hasClass('maera_pb-column-width-one-half')) {
						addClass = 'current-item-one-half';
					}

					$stage.addClass(addClass);
				}

				$('.sortable-placeholder', $stage)
					.height(parseInt($item.height(), 10) - 2) // -2 to account for placeholder border
					.css({
						'flex': $item.css('flex'),
						'-webkit-flex': $item.css('-webkit-flex')
					});
			},
			stop: function (event, ui) {
				var $item = $(ui.item.get(0)),
					$section = $item.parents('.maera_pb-section'),
					$stage = $('.maera_pb-section-body', $section),
					$columnsStage = $item.parents('.maera_pb-text-columns-stage'),
					$orderInput = $('.maera_pb-text-columns-order', $stage),
					id = $section.attr('data-id'),
					column = $item.attr('data-id'),
					i;

				oneApp.setOrder($(this).sortable('toArray', {attribute: 'data-id'}), $orderInput);

				// Label the columns according to the position they are in
				i = 1;
				$('.maera_pb-text-column', $stage).each(function(){
					$(this)
						.removeClass('maera_pb-text-column-position-1 maera_pb-text-column-position-2 maera_pb-text-column-position-3 maera_pb-text-column-position-4')
						.addClass('maera_pb-text-column-position-' + i);
					i++;
				});

				// Remove the temporary classes from stage
				$columnsStage.removeClass('current-item-two-thirds current-item-one-third current-item-one-fourth current-item-three-fourths current-item-one-half');

				setTimeout(function() {
					oneApp.initFrame(id + '-' + column);
				}, 100);
			}
		});
	};

	// Initialize the sortables
	$oneApp.on('afterSectionViewAdded', function(evt, view) {
		if ('text' === view.model.get('sectionType')) {
			oneApp.initializeTextColumnSortables(view);

			// Initialize the iframes
			var $frames = $('iframe', view.$el),
				link = oneApp.getFrameHeadLinks(),
				id, $this;

			$.each($frames, function() {
				$this = $(this);
				id = $this.attr('id').replace('maera_pb-iframe-', '');
				oneApp.initFrame(id, link);
			});
		}
	});

	// Initialize sortables for current columns
	oneApp.initializeTextColumnSortables();
})(window, jQuery, _, oneApp, $oneApp);
