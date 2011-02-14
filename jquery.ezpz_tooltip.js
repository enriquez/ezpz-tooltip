// EZPZ Tooltip v1.0; Copyright (c) 2009 Mike Enriquez, http://theezpzway.com; Released under the MIT License
(function($){
  $.fn.ezpz_tooltip = function(options){
    var settings = $.extend({}, $.fn.ezpz_tooltip.defaults, options);

    return this.each(function(){
      var content = $("#" + getContentId(this.id));
			var targetMousedOver = $(this);
			
			var fPositionContent = function(e) {
				var contentInfo = getElementDimensionsAndPosition(content);
        var targetInfo  = getElementDimensionsAndPosition(targetMousedOver);
        var contentInfo = $.fn.ezpz_tooltip.positions[settings.contentPosition](contentInfo, e.pageX, e.pageY, settings.offset, targetInfo);
        var contentInfo = keepInWindow(contentInfo);

        content.css('top', contentInfo['top']);
        content.css('left', contentInfo['left']);

        settings.showContent(content);
			}
			var fHideContent = function() {
					if (targetMousedOver.data("overTrigger") || targetMousedOver.data("overContent")) return;
					targetMousedOver.data("showing", false);
					settings.hideContent(content);
          settings.afterHide();
			}
			
			targetMousedOver
				.mouseenter(function(e){
					targetMousedOver.data("overTrigger", true)
					if (targetMousedOver.data("showing")) return; //prevent re-showing a shown popup
					settings.beforeShow(content, $(this));
					targetMousedOver.data("showing", true);
					fPositionContent(e);
				})
				.mousemove(fPositionContent)
				.mouseleave(function() {
					targetMousedOver.data("overTrigger", false)
					fHideContent();//window.setTimeout(fHideContent, 150);
				});
			
			if (settings.stayOnContent) {
				content
					.mouseenter(function() {
						targetMousedOver.data("overContent", true)
					})
					.mouseleave(function() {
						targetMousedOver.data("overContent", false)
						fHideContent();//window.setTimeout(fHideContent, 150);
					});
			};
    });

    function getContentId(targetId){
      if (settings.contentId == "") {
        var name = targetId.split('-')[0];
        var id = targetId.split('-')[2];
        return name + '-content-' + id;
      }
      else {
        return settings.contentId;
      }
    };

    function getElementDimensionsAndPosition(element){
      var height = element.outerHeight(true);
      var width = element.outerWidth(true);
      var top = $(element).offset().top;
      var left = $(element).offset().left;
      var info = new Array();

      // Set dimensions
      info['height'] = height;
      info['width'] = width;

      // Set position
      info['top'] = top;
      info['left'] = left;

      return info;
    };

    function keepInWindow(contentInfo){
      var windowWidth = $(window).width();
      var windowTop = $(window).scrollTop();
      var output = new Array();

      output = contentInfo;

      if (contentInfo['top'] < windowTop) { // Top edge is too high
        output['top'] = windowTop;
      }
      if ((contentInfo['left'] + contentInfo['width']) > windowWidth) { // Right edge is past the window
        output['left'] = windowWidth - contentInfo['width'];
      }
      if (contentInfo['left'] < 0) { // Left edge is too far left
        output['left'] = 0;
      }

      return output;
    };
  };

  $.fn.ezpz_tooltip.positionContent = function(contentInfo, mouseX, mouseY, offset, targetInfo) {
    contentInfo['top'] = mouseY - offset - contentInfo['height'];
    contentInfo['left'] = mouseX + offset;

    return contentInfo;
  };

  $.fn.ezpz_tooltip.positions = {
    aboveRightFollow: function(contentInfo, mouseX, mouseY, offset, targetInfo) {
      contentInfo['top'] = mouseY - offset - contentInfo['height'];
      contentInfo['left'] = mouseX + offset;

      return contentInfo;
    }
  };

  $.fn.ezpz_tooltip.defaults = {
    contentPosition: 'aboveRightFollow',
    stayOnContent: false,
    offset: 10,
    contentId: "",
    beforeShow: function(content){},
    showContent: function(content){
      content.show();
    },
    hideContent: function(content){
      content.hide();
    },
    afterHide: function(){}
  };

})(jQuery);

// Plugin for different content positions. Keep what you need, remove what you don't need to reduce file size.

(function($){
  $.fn.ezpz_tooltip.positions.aboveFollow = function(contentInfo, mouseX, mouseY, offset, targetInfo) {
    contentInfo['top'] = mouseY - offset - contentInfo['height'];
    contentInfo['left'] = mouseX - (contentInfo['width'] / 2);

    return contentInfo;
  };

  $.fn.ezpz_tooltip.positions.rightFollow = function(contentInfo, mouseX, mouseY, offset, targetInfo) {
    contentInfo['top'] = mouseY - (contentInfo['height'] / 2);
    contentInfo['left'] = mouseX + offset;

    return contentInfo;
  };

  $.fn.ezpz_tooltip.positions.belowRightFollow = function(contentInfo, mouseX, mouseY, offset, targetInfo) {
    contentInfo['top'] = mouseY + offset;
    contentInfo['left'] = mouseX + offset;

    return contentInfo;
  };

  $.fn.ezpz_tooltip.positions.belowFollow = function(contentInfo, mouseX, mouseY, offset, targetInfo) {
    contentInfo['top'] = mouseY + offset;
    contentInfo['left'] = mouseX - (contentInfo['width'] / 2);

    return contentInfo;
  };

  $.fn.ezpz_tooltip.positions.aboveStatic = function(contentInfo, mouseX, mouseY, offset, targetInfo) {
    contentInfo['top'] = targetInfo['top'] - offset - contentInfo['height'];
    contentInfo['left'] = (targetInfo['left'] + (targetInfo['width'] / 2)) - (contentInfo['width'] / 2);

    return contentInfo;
  };

  $.fn.ezpz_tooltip.positions.rightStatic = function(contentInfo, mouseX, mouseY, offset, targetInfo) {
    contentInfo['top'] = (targetInfo['top'] + (targetInfo['height'] / 2)) - (contentInfo['height'] / 2);
    contentInfo['left'] = targetInfo['left'] + targetInfo['width'] + offset;

    return contentInfo;
  };

  $.fn.ezpz_tooltip.positions.belowStatic = function(contentInfo, mouseX, mouseY, offset, targetInfo) {
    contentInfo['top'] = targetInfo['top'] + targetInfo['height'] + offset;
    contentInfo['left'] = (targetInfo['left'] + (targetInfo['width'] / 2)) - (contentInfo['width'] / 2);

    return contentInfo;
  };
	
	$.fn.ezpz_tooltip.positions.belowRightStatic = function(contentInfo, mouseX, mouseY, offset, targetInfo) {
		contentInfo['top'] = targetInfo['top'] + targetInfo['height'] + offset;
		contentInfo['left'] = targetInfo['left'] + targetInfo['width'] + offset;
		
		return contentInfo;
	};
	
	$.fn.ezpz_tooltip.positions.underTarget = function(contentInfo, mouseX, mouseY, offset, targetInfo) {
		contentInfo['top'] = targetInfo['top'] + targetInfo['height'] + offset;
		contentInfo['left'] = targetInfo['left'];
		
		return contentInfo;
	};

})(jQuery);
