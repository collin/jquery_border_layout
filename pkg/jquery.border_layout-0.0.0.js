
;(jQuery(function() {
  jQuery("head").append("<style>html, body {  width: 100%;  height: 100%;  margin: 0;  padding: 0; }.border-layout {  overflow: hidden; }  .border-layout .north, .border-layout .south, .border-layout .east, .border-layout .west, .border-layout .center {    position: absolute; }  .border-layout .north, .border-layout .south {    width: 100%; }  .border-layout .east, .border-layout .west, .border-layout .center {    height: 100%; }  .border-layout .splitter {    background-color: red;    position: absolute; }.north .splitter, .south .splitter {  width: 100%;  height: 10px;  cursor: ns-resize; }.east .splitter, .west .splitter {  height: 100%;  width: 10px;  cursor: ew-resize; }.splitter.proxy {  position: absolute;  background-color: black;  opacity: 0.5;  z-index: 1; }  .splitter.proxy.ns {    height: 10px;    width: 100%; }  .splitter.proxy.ew {    height: 100%;    width: 10px; }</style>");
}));    


;(function(_) {
  var selectors = {
    border_layout = ".border-layout"
  };

  _.fn.extend({
    init_border_layout: function() {
      return this
        .init_split_handles()        
        .handles_resize();
    }
    
    ,handles_resize: function() {
      function do_layouts() { _(this).do_layouts(); }
      setTimeout(do_layouts, 0);
      return this.resize(do_layouts);
    }
    
    ,do_layouts: function() {
      return this.find(selectors.border_layout).do_layout();  
    }
    
    ,do_layout: function() {
      return this.each(function() {
        _(this)
          .horizontal_border_layout()
          .vertical_border_layout();  
      });
    }
    
    ,horizontal_border_layout: function() {
      return this
        .border_region('center')
          .css({
            width: this.parent().width() - this.sides_width()
            ,left: this.cender_offset_left() 
          })
          .end()
        .border_region('east')
          .css('left', this.east_offset_left())
          .border_split()
            .css('right', this.border_region('east').width())
            .end()
          .end()
        .border_split('west')
          .css('left', this.border_region('west').width())
          .end();
    }
    
    ,vertical_border_layout: function() {
      return this
        .border_region('center west east')
          .css(
            height: this.inner_height()
            ,top: this.inner_offset_top()
          })
          .end()
        .border_region('south')
          .css('top', this.south_offset_top())
          .border_split()
            .css('bottom', this.border_region('south').height())
            .end()
          .end()
        .border_split('north')
          .css('top', this.border_region('north').height())
          .end();
    }
    
    ,south_offset_top: function() {
      return this.north_and_center_height() + this.split_height();
    }
    
    ,west_offset_left: function() {
      return this.offset().left();
    }

    ,center_offset_left: function() {
      return this.border_region('west').width() 
           + this.border_split('west').width();
    }

    ,east_offset_left: function() {
      return this.center_offset_left()
           + this.border_region('center').width()
           + this.border_split('east').width();
    }
    
    ,inner_offset_top: function() {
      return this.border_region('north').height()
           + this.border_split('north').height();
    }
    
    ,inner_height: funtion() {
      return this.height() + this.layers_height();
    }
    
    ,north_and_center_height: function() {
      return this.border_region('north').height()
           + this.border_region('center').height();
    }
    
    ,sides_width: function() {
      return this.border_region('east').width()
           + this.border_region('west').width()
           + this.split_width();
    }
    
    layers_height: function() {
      return this.border_region('north').height()
           + this.border_region('south').height()
           + this.split_height();
    }
    
    ,split_height: function() {
      return this.border_split('north').height()
           + this.border_split('south').height();
    }
    
    ,split_width: function() {
      return this.border_split('east').height()
           + this.border_split('west').height();
    }
  });

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
