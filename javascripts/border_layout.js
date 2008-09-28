;(function(_) {

  _.BorderLayout = {
    init: function() {
      _.extend(this, this.Selectors);
      _.extend(this.Split, this.Selectors);
      return this
        .handlesResize()
        .Split
          .init();
    }
    ,handlesResize: function() {
      var that = this;
      _(window).resize(function() { that.doLayouts(); });
      setTimeout(function(){that.doLayouts();}, 0)
      return this.doLayouts();
    }
    ,doLayouts: function(context) {
      var that = this;
      _(this.selector, context).each(function(i, el) { that.doLayout(el); });
      return this;
    }
    ,doLayout: function(el) {
      return this
        .layoutHorizontal(el)
        .layoutVertical(el);
    }
    ,layoutHorizontal: function(el) {
      this.center(el).css('width', this.container(el).width() - this.sidesWidth(el));
      this.center(el).css('left', this.centerOffsetLeft(el));
      this.east(el).css('left', this.eastOffsetLeft(el));
      this.split(this.east(el)).css('right', this.east(el).width());
      this.split(this.west(el)).css('left', this.west(el).width());
      return this;
    }
    ,layoutVertical: function(el) {
      this.center(el).css('height', this.innerHeight(el));
      this.west(el).css('height', this.innerHeight(el));
      this.east(el).css('height', this.innerHeight(el));
      this.center(el).css('top', this.innerOffsetTop(el));
      this.west(el).css('top', this.innerOffsetTop(el));
      this.east(el).css('top', this.innerOffsetTop(el));
      this.south(el).css('top', this.southOffsetTop(el));
      this.split(this.north(el)).css('top', this.north(el).height());
      this.split(this.south(el)).css('bottom', this.south(el).height());
      return this;
    }
    ,southOffsetTop: function(el) {
      return this.northAndCenterHeight(el) + this.splitHeight(el);
    }
    ,westOffsetLeft: function(el) {
      return this.container(el).offset().left;
    }
    ,centerOffsetLeft: function(el) {
      return this.west(el).width() + this.split(this.west(el)).width();
    }
    ,eastOffsetLeft: function(el) {
      return this.centerOffsetLeft(el) + this.center(el).width() + this.split(this.east(el)).width();
    }
    ,innerOffsetTop: function(el) {
      return this.north(el).height() + this.split(this.north(el)).height();
    }
    ,innerHeight: function(el) {
      return this.container(el).height() - this.layersHeight(el)
    }
    ,northAndCenterHeight: function(el) {
      return this.north(el).height() + this.center(el).height();
    }
    ,sidesWidth: function(el) {
      return this.east(el).width() + this.west(el).width() + this.splitWidth(el); 
    }
    ,layersHeight: function(el) {
      return this.north(el).height() + this.south(el).height() + this.splitHeight(el); 
    }
    ,splitHeight: function(el) {
      return this.split(this.north(el)).height() + this.split(this.south(el)).height();
    }
    ,splitWidth: function(el) {
      return this.split(this.west(el)).width() + this.split(this.east(el)).width();
    }
  };

  _.BorderLayout.Split = {
    init: function() {
      this.createsHandles();
    }
    ,createsHandles: function() {
      this.allSplit().append(this.markup);
      var that = this;
      _('.north > .splitter, .south > .splitter').mousedown(function(e) {
        e.preventDefault();
        _(document.body).prepend('<div class="splitter proxy ns"></div>').css('cursor', 'ns-resize');
        var dragHandler = function(e) {
          _('.splitter.proxy.ns').css('top', e.pageY - (_('.splitter.proxy.ns').height() / 2));
        },

        region = _(this).parent();
        var releaseHandler = function(e) {
          _(document.body)
            .unbind('mousemove')
            .unbind('mouseup')
            .css('cursor', 'default');
          
          
          var split = _('.splitter.proxy.ns'),
              height,
              splitHeight = split.height();
          
          split.remove();
          if(region.is('.north')) {
            height = region.height() + (e.pageY - (region.height() + region.offset().top));
          }
          else if(region.is('.south')) {
            height = region.height() + (region.offset().top - e.pageY);
          }
          region.css('height', height - (splitHeight/2));
          _(window).resize();
        };
        dragHandler(e);
        _(document.body).bind('mouseup', releaseHandler);
        _(document.body).bind('mousemove', dragHandler);
      });

      _('.east > .splitter, .west > .splitter').mousedown(function(e) {
        e.preventDefault();
        _(document.body).prepend('<div class="splitter proxy ew"></div>').css('cursor', 'ew-resize');
        var dragHandler = function(e) {
          _('.splitter.proxy.ew').css('left', e.pageX - (_('.splitter.proxy.ew').width() / 2));
        },
	  region = _(this).parent();
        var releaseHandler = function(e) {
          _(document.body)
            .unbind('mousemove')
            .unbind('mouseup')
            .css('cursor', 'default');
            
          var split = _('.splitter.proxy.ew'),
              width,
              splitWidth = split.width();
              
          split.remove();
          if(region.is('.west')) {
            width = region.width() + (e.pageX - (region.width() + region.offset().left));
          }
          else if(region.is('.east')) {
            width = region.width() + (region.offset().left - e.pageX);
          }
          region.css('width', width - (splitWidth/2));
          _(window).resize();
        };
        dragHandler(e);
        _(document.body).bind('mouseup', releaseHandler);
        _(document.body).bind('mousemove', dragHandler);
      });
    }
    ,markup: '<div class="splitter"></div>'
  }

  _.BorderLayout.Selectors = {
    selector: '.border-layout'
    ,container: function(el) {
      return _(el);
    }
    ,center: function(el) {
      return _(el).children('.center');
    }
    ,east: function(el) {
      return _(el).children('.east');
    }
    ,west: function(el) {
      return _(el).children('.west');
    }
    ,north: function(el) {
      return _(el).children('.north');
    }
    ,south: function(el) {
      return _(el).children('.south');
    }
    ,split: function(el) {
      return _(el).children('.splitter');
    }
    ,allSplit: function() {
      return _('.split');
    }
  };

  _(function() {
    _.BorderLayout.init();
  });
})(jQuery);
