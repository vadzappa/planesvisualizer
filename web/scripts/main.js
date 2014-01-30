/**
 * Author: Vadim
 * Date: 1/29/14
 */
require.config({
    baseUrl: 'scripts',
    paths: {
        jquery: '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min',
        lodash: '//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.min',
        d3: '//cdnjs.cloudflare.com/ajax/libs/d3/3.3.13/d3.min',
        topojson: 'lib/topojson.v1.min'
    },
    shim: {
        d3: {
            exports: 'd3'
        },
        topojson: {
            exports: 'topojson'
        }
    }
});

require([
    'jquery',
    'd3',
    'lodash',
    'mapLoader/mapLoader',
    'utils/geoProjection/geoProjection',
    'utils/objectsManipulator/objectsManipulator',
    'featuresBuilder/featuresBuilder'
],
    function ($, d3, _, MapLoader, GeoProjection, ObjectManipulator, FeaturesBuilder, undefined) {
        var mapLoadWaiter = new $.Deferred(),
            planesDataWaiter = new $.Deferred();

        $.when(mapLoadWaiter, planesDataWaiter).done(function (mapLoadingResults, planesLoadingResults) {
            var projection = mapLoadingResults[0],
                svgMap = mapLoadingResults[1],
                planesData = planesLoadingResults[0];

            _.each(planesData, function (planeData) {
                var plane = FeaturesBuilder.plane(projection);
                plane.setMap(svgMap);
                plane.setBase(planeData.base);
                plane.schedule(planeData.schedule);
            });
        });

        $(function () {
            var mapContainer = $('#my-map'),
                width = mapContainer.width(),
                height = mapContainer.height(),
                projection = new GeoProjection(width, height),
                mapLoader = new MapLoader(mapContainer, {
                    projection: projection
                });


            mapLoader.bind('load', mapLoadWaiter.resolve.bind(null, projection));
            mapLoader.load();
        });

        $.getJSON('resources/flights.json', planesDataWaiter.resolve);

    });