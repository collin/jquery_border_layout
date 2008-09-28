;(function(_) {
  var selectors = {
      border_layout: ".border-layout"
      ,split: ".split"
      ,ns_split_bar: ".north > .splitter, .south > .splitter"
      ,ew_split_bar: ".east > .splitter, .west > .splitter"
    }
    ,markup = {
      split_bar: '<div class="splitter" />'
      ,ns_split_proxy: '<div class="splitter proxy ns" />'
      ,ew_split_proxy: '<div class="splitter proxy ew" />' 
    }
    ,_body
    ,_window;

  _.fn.extend({
    init_border_layout: function() {
      return this      
        .init_split_handles()  
        .handles_resize();
    }
    
    ,handles_resize: function() {
      var that = this;
      function do_layouts() { that.do_layouts(); }
      setTimeout(do_layouts, 0);
      _window.resize(do_layouts);
      return this;
    }
    
    ,do_layouts: function() {
      return this
        .parent()
        .find(selectors.border_layout)
        .do_layout()
        .end();  
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
            width: this.width() - this.sides_width()
            ,left: this.center_offset_left() 
          })
          .end()
        .border_region('east')
          .css('left', this.east_offset_left()||0)
          .border_split()
            .css('right', this.border_region('east').width()||0)
            .end()
          .end()
        .border_split('west')
          .css('left', this.border_region('west').width()||0)
          .end()
          .end();
    }
    
    ,vertical_border_layout: function() {
      return this
        .border_region('center west east')
          .css({
            height: this.inner_height()
            ,top: this.inner_offset_top()
          })
          .end()
        .border_region('south')
          .css('top', this.south_offset_top())
          .border_split()
            .css('bottom', this.border_region('south').height() || 0)
            .end()
          .end()
        .border_split('north')
          .css('top', this.border_region('north').height() || 0)
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
    
    ,inner_height: function() {
      return this.height() - this.layers_height();
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
    
    ,layers_height: function() {
      return this.border_region('north').height()
           + this.border_region('south').height()
           + this.split_height();
    }
    
    ,split_height: function() {
      return this.border_split('north').height()
           + this.border_split('south').height();
    }
    
    ,split_width: function() {
      return this.border_split('east').width()
           + this.border_split('west').width();
    }
    
    ,init_split_handles: function() {
      return this.creates_handles();
    }
    
    ,creates_handles: function() {
      var that = this;
      
      this.find(selectors.split).append(markup.split_bar);
      
      this.drags_split_bars({
        proxy: markup.ew_split_proxy
        ,selector: selectors.ew_split_bar
        ,event_property: 'pageX'
        ,dimension: 'width'
        ,origin: 'left'
        ,direction: 'ew'
        ,regions: {
          '.west': function(e, region) {
            return region.width() + (e.pageX - (region.width() + region.offset().left));;
          }
          ,'.east': function(e, region) {
            return region.width() + (region.offset().left - e.pageX);
          }
        }
      });
      
      this.drags_split_bars({
        proxy: markup.ns_split_proxy
        ,selector: selectors.ns_split_bar
        ,event_property: 'pageY'
        ,dimension: 'height'
        ,origin: 'top'
        ,direction: 'ns'
        ,regions: {
          '.north': function(e, region) {
            return region.height() + (e.pageY - (region.height() + region.offset().top));
          }
          ,'.south': function(e, region) {
            return region.height() + (region.offset().top - e.pageY);
          }
        }
      });
      
      return this;
    }
    
    ,drags_split_bars: function(options) {
      var that = this;
      _(options.selector).mousedown(function(e) {
        e.preventDefault();
        _body.css('cursor', options.direction+'-resize');
        var proxy = _(options.proxy)
          ,region = _(this).parent();
        _body.prepend(proxy);
        
        function drag_handler(e) {
          proxy.css(options.origin, e[options.event_property] - (proxy[options.dimension]()/2));
        }
        
        function release_handler(e) {
          var proxy_dimension = proxy[options.dimension]()
            ,dimension;
            
          _body
            .unbind('mousemove.border_layout')
            .unbind('mouseup.border_layout')
            .css('cursor', '');
            
          proxy.remove();
          
          for(selector in options.regions) { 
            if(region.is(selector)) {
              dimension = options.regions[selector].call(that, e, region);
            }
          }
        
          region.css(options.dimension, dimension - (proxy_dimension/2));
          _window.resize();
        }
        drag_handler(e);
        
        _body
          .bind('mouseup.border_layout', release_handler)
          .bind('mousemove.border_layout', drag_handler);
      });
    }
    
    ,border_region: function(which) {
      return this.children('.'+which.split(/ /).join(':first, .')+':first');
    }
    
    ,log: function(msg) {
      console.log(msg||'',this);
      return this;
    }
    
    ,border_split: function(which) {
      if(!which) return this.children('.splitter:first')
      return this.border_region(which).border_split();
    }
  });

  _(function() {
    _body = _(document.body);
    _window = _(window);
    _body.init_border_layout();
  });
})(jQuery);
