html, body
  :width 100%
  :height 100%
  :margin 0
  :padding 0

.border-layout
  :overflow hidden
  .north, .south, .east, .west, .center
    :position absolute
  .north, .south
    :width 100%
  .east, .west, .center
    :height 100%
  .splitter
    :background-color red
    :position absolute

.north, .south
  .splitter
    :width 100%
    :height 10px
    :cursor ns-resize
.east, .west
  .splitter
    :height 100%
    :width 10px
    :cursor ew-resize

.splitter.proxy
  :position absolute
  :background-color black
  :opacity 0.5
  :z-index 1
  &.ns
    :height 10px
    :width 100%
  &.ew
    :height 100%
    :width 10px

#document
  :width 250px
  :background-color pink

#canvas
  #button-strip
    :background-color black
    :height 40px
  #preview
    :background-color orange

#styles
  :width 250px
  :background-color #ccccff
#bottom
  :height 100px
  :background-color #ffccff
#right
  :width 100px
  :background-color #ffffcc
#left
  :width 100px
  :background-color #777777