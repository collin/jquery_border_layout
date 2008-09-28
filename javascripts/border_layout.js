;(function(_) {
  var selectors = {
      border_layout = ".border-layout"
      ,split: ".splita"
      ,ns_split_bar: ".north > .splitter, .south > .splitter"
      ,ew_split_bar: ".east > .splitter, .west > .splitter"
    }
    ,markup = {
      ,split_bar: '<div class="splitter" />'
      ,ns_split_proxy: '<div class="splitter proxy ns" />'
      ,ew_split_proxy: '<div class="splitter proxy ew" />' 
    }
    ,_body = _(document.body)
    ,_window = _(window);

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
    
    ,init_split_handles: function() {
      return this.creates_handles():
    }
    
    ,creates_handles: function() {
      var that = this;
      this.find(selectors.split).append(markup.split_bar);
      
      _(selectors.ew_split_bar).drags_split_bars({
        proxy: dom.ew_split_proxy
        ,dimension: 'width'
        ,origin: 'left'
        ,regions: {
          '.west': function(e) {
            return this.width() 
                 + (e.pageX - ( this.width() 
                              + this.offset().left));
          }
          ,'.east': function(e) {
            return this.width() 
                + (this.offset().left - e.pageX);
          }
        }
      });
      
      _(selectors.ns_split_bar).drags_split_bars({
        proxy: dom.ns_split_proxy
        ,dimension: 'height'
        ,origin: 'top'
        ,regions: {
          '.north': function(e) {
            return region.height() 
                 + (e.pageY - (  this.height() 
                                + this.offset().top));
          }
          ,'.south': function(e) {
            return this.height() 
                + (this.offset().top - e.pageY);
          }
        }
      });
    }
    
    ,drags_split_bars: function(options) {
      var that = this;
      _(options.selector).mousedown(function(e) {
        e.preventDefault();
        _body.css('cursor', 'ns-resize');
        var proxy = _body.prepend(options.proxy);
        
        function drag_handler() {
          proxy.css(options.origin, e.pageY - (proxy[options.dimension]()/2));
        }
        
        function release_handler() {
          var proxy_dimension = proxy[options.dimension]()
            ,region
            ,dimension;
          _body
            .unbind('mousemove.border_layout')
            .unbind('mousemove.border_layout')
            .css('cursor', '');
          proxy.remove();
          
          for(region in options.regions) {
            if(that.hasClass(region)) {
              dimension = options.regions[region].call(that, e);
          region.css(options.dimension, dimension - (proxy_dimension/2));
          _window.resize();
        }
        
        drag_handler(e);
        
        _body
          .unbind('mouseup.border_layout')
          .unbind('mousemove.border_layout');
      });
    }
    
    ,border_region: function(which) {
      return this.children('.'+which);
    }
    
    ,border_split: function(which) {
      if(!which) return this.children('.split')
      return this.border_region(which).border_split();
    }
  });

  _(function() {
    _.BorderLayout.init();
  });
})(jQuery);
