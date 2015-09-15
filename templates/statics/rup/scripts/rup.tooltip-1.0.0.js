/*
 * jQuery UI Tooltip 1.9m1
 *
 * Copyright (c) 2009 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Tooltip
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *  jquery.ui.position.js
 */
(function($) {

// role=application on body required for screenreaders to correctly interpret aria attributes
if( !$(document.body).is('[role]') ){
	$(document.body).attr('role','application');
} 

var increments = 0;

$.widget("$.rup_tooltip", {
	options: {
		tooltipClass: "ui-widget-content",
		content: function() {
			return $(this).attr("title");
		},
		position: {
			my: "left center",
			at: "right center",
			offset: "15 0"
		}
	},
	_init: function() {
		var self = this;
		this.rup_tooltip = $("<div></div>")
			.attr("id", "ui-tooltip-" + increments++)
			.attr("role", "tooltip")
			.attr("aria-hidden", "true")
			.addClass("rup-tooltip ui-widget ui-corner-all")
			.addClass(this.options.tooltipClass)
			.appendTo(document.body)
			.hide();
		this.rup_tooltipContent = $("<div></div>")
			.addClass("rup-tooltip_content")
			.appendTo(this.rup_tooltip);
		this.opacity = this.rup_tooltip.css("opacity");
		this.element
			.bind("focus.tooltip mouseenter.tooltip", function(event) {
				self.open( event );
			})
			.bind("blur.tooltip mouseleave.tooltip", function(event) {
				self.close( event );
			});
	},
	
	enable: function() {
		this.options.disabled = false;
	},
	
	disable: function() {
		this.options.disabled = true;
	},
	
	destroy: function() {
		this.rup_tooltip.remove();
		$.Widget.prototype.destroy.apply(this, arguments);
	},
	
	widget: function() {
		return this.rup_tooltip;
	},
	
	open: function(event) {
		var target = this.element;
		// already visible? possible when both focus and mouseover events occur
		if (this.current && this.current[0] == target[0])
			return;
		var self = this;
		this.current = target;
		this.currentTitle = target.attr("title");
		var content = this.options.content.call(target[0], function(response) {
			// ignore async responses that come in after the tooltip is already hidden
			if (self.current == target)
				self._show(event, target, response);
		});
		if (content) {
			self._show(event, target, content);
		}
	},
	
	_show: function(event, target, content) {
		if (!content)
			return;
		
		target.attr("title", "");
		
		if (this.options.disabled)
			return;
			
		this.rup_tooltipContent.html(content);
		this.rup_tooltip.css({
			top: 0,
			left: 0
		}).position($.extend(this.options.position, {
			of: target
		}));
		
		this.rup_tooltip.attr("aria-hidden", "false");
		target.attr("aria-describedby", this.rup_tooltip.attr("id"));

		if (this.rup_tooltip.is(":animated"))
			this.rup_tooltip.stop().show().fadeTo("normal", this.opacity);
		else
			this.rup_tooltip.is(':visible') ? this.rup_tooltip.fadeTo("normal", this.opacity) : this.rup_tooltip.fadeIn();

		this._trigger( "open", event );
	},
	
	close: function(event) {
		if (!this.current)
			return;
		
		var current = this.current.attr("title", this.currentTitle);
		this.current = null;
		
		if (this.options.disabled)
			return;
		
		current.removeAttr("aria-describedby");
		this.rup_tooltip.attr("aria-hidden", "true");
		
		if (this.rup_tooltip.is(':animated'))
				this.rup_tooltip.stop().fadeTo("normal", 0, function() {
					$(this).hide().css("opacity", "");
				});
			else
				this.rup_tooltip.stop().fadeOut();
		
		this._trigger( "close", event );
	}
	
});

//Aplicar tooltip a todos los elementos que contengan 'title' (se inserta en iniRup de rup_base)
$.extend($.rup.iniRup, $("[title]").rup_tooltip()) ;

})(jQuery);