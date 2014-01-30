/**
 * Author: Vadim
 * Date: 1/29/14
 */
define(['jquery', '../../../.', 'd3'], function ($, _, d3, undefined) {

    var GeoProjection = function GeoProjection(mapWidth, mapHeight) {
        return d3.geo.mercator()
            .scale(150)
            .precision(.1);
    };

    return GeoProjection;
});