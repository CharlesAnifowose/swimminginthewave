'use strict';

/* Directives */


angular.module('app.directives', [])
  
  .directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])

  .directive('chart', function() {
    return {
      restrict: 'A',
      template: '<div style="width:100%; height:320px"></div>',
      replace: true,
      compile: function compile(tElement, tAttrs, transclude) {
        return {
          post: function postLink(scope, iElement, iAttrs, controller) {

            // get values
            var dflt = function(val, alternative){
              if (val === undefined){
                return  alternative;
              }
              else{
                return val;
              }
            }

            var i, graph;
            // Container div:
            var container = iElement[0]
              // data series:
              // A couple flotr configuration options:
            var options = {
              shadowSize : 0,
              grid: {
                verticalLines: false
              },
              bars : {
                show : true,
                horizontal : false,
                shadowSize : 0,
                barWidth : 1
              },
              xaxis:{
                showLabels: false
              },
              yaxis:{
                showLabels: false,
                min: 0
              },
              mouse : {
                track : true
              },
            }

            function drawGraph(){
              // Generated data set:
              var line = [];
              
              line.push([1, 20 ]);
              line.push([2, 10 ]);
              line.push([3, 5 ]);
              line.push([4, 2 ]);
              line.push([5, 1 ]);
              line.push([6, 2 ]);



              // Draw the graph:
              graph = Flotr.draw(
                container,  // Container element
                [{ data : line} ], // Array of data series
                options     // Configuration options
              );            
            };

            drawGraph();


          }
        }
      }
    };
  });




