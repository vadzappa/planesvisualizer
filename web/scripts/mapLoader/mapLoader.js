/**
 * Author: Vadim
 * Date: 1/29/14
 */
define(['jquery', '../../.', 'd3', 'topojson', 'utils/eventEmitter/eventEmitter'],
    function ($, _, d3, topojson, EventEmitter, undefined) {

        var MapLoader = function MapLoader(defaultContainer, options) {
            EventEmitter.call(this, ['load', 'zoom']);
            this.defaultContainer = defaultContainer;
            this.options = options;
        };

        MapLoader.prototype = Object.create(EventEmitter.prototype);
        MapLoader.prototype.constructor = MapLoader;

        MapLoader.prototype.load = function load(cb) {
            if (_.isUndefined(this.options.projection)) {
                throw 'Projection for map is not defined';
            }
            d3.json("resources/world.json", function (error, world) {

                if (error) {
                    throw error;
                }

                var mapContainer = this.defaultContainer || $('#map'),
                    width = mapContainer.width(),
                    height = mapContainer.height(),
                    path = d3.geo.path().projection(this.options.projection),
                    svg = d3.select(mapContainer.get(0)).append("svg")
                        .attr("width", width)
                        .attr("height", height),
                    g = svg.append("g");

                g.selectAll('path')
                    .data(topojson.feature(world, world.objects.countries).features)
                    .enter()
                    .append('path')
                    .attr('class', 'country')
                    .attr('d', path);

                if (_.isFunction(cb)) {
                    cb(svg);
                } else {
                    this.trigger('load', svg);
                }

            }.bind(this));

        };

        return MapLoader;
    });