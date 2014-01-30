/**
 * Author: Vadim
 * Date: 1/29/14
 */
define(['jquery', '../../.', 'd3', '../utils/objectsManipulator/objectsManipulator', '../utils/eventEmitter/eventEmitter'], function ($, _, d3, ObjectsManipulator, EventEmitter, undefined) {

    var importedNode = undefined,
        timeScaleFactor = 1000 / 3600;

    d3.xml("resources/plane.svg", "image/svg+xml", function (xml) {
        importedNode = document.importNode(xml.documentElement, true);
    });

    var getDestinationCoordinates = function getDestinationCoordinates(projection, geoPoint) {
        if (_.isArray(geoPoint)) {
            return projection([geoPoint[1], geoPoint[0]]);
        }
        return projection([geoPoint.lon, geoPoint.lat]);

    };

    var Plane = function Plane(projection) {
        this.plane = $(importedNode.cloneNode(true)).find('path');
        this.plane.attr('class', 'plane');
        this.manipulator = new ObjectsManipulator(d3.select(this.plane.get(0)));
        this.translateCoordinates = getDestinationCoordinates.bind(this, projection);
        this.map = undefined;
        EventEmitter.call(this, ['tripFinished']);
    };

    Plane.prototype = Object.create(EventEmitter.prototype);
    Plane.prototype.constructor = Plane;

    Plane.prototype.setMap = function setMap(map) {
        if (map === null) {
            this.manipulator.stop();
            if (this.map !== null) {
                d3.select(this.plane.get(0)).remove();
            }
        } else {
            $(map.node()).append(this.plane);
        }
    };

    Plane.prototype.setBase = function setBase(destination) {
        this.manipulator.move(this.translateCoordinates(destination.coordinates));
    };

    Plane.prototype.flyTo = function flyTo(destination) {
        var duration = destination.time ? destination.time * 60 * 60 * timeScaleFactor : 100,
            transition = {
                translate: this.translateCoordinates(destination.coordinates),
                duration: duration
            };
        this.manipulator.transit(transition);
    };

    Plane.prototype.schedule = function schedule(destinations) {
        _.each(destinations, this.flyTo.bind(this));
    };

    var buildPlane = function buildPlane(projection) {
        return new Plane(projection);
    };

    return {
        plane: buildPlane
    };
});