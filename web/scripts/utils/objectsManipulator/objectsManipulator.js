/**
 * Author: Vadim
 * Date: 1/29/14
 */
define(['jquery', '../../../.', 'd3'], function ($, _, d3, undefined) {

    var QueueListener = function QueueListener(manipulator) {
        var listenerInterval,
            queueWatcher = function () {
                if (this.queue.length !== 0) {
                    clearInterval(listenerInterval);
                    listenerInterval = undefined;
                    var transformation = this.queue.shift(),
                        transformationApplied = d3.transform(this.mapObject.attr('transform')),
                        boundingBox = this.mapObject.node().getBoundingClientRect();

                    _.extend(transformationApplied, transformation);

                    transformationApplied.translate = [transformationApplied.translate[0] - boundingBox.width / 2, transformationApplied.translate[1] - boundingBox.height / 2];

                    this.mapObject
                        .transition()
                        .duration(transformation.duration || 250)
                        .attr('transform', transformationApplied.toString())
                        .each('end', queueWatcher);
                } else {
                    if (_.isUndefined(listenerInterval)) {
                        listenerInterval = setInterval(queueWatcher, 100);
                    }
                }
            }.bind(manipulator);

        var start = function start() {
            if (_.isUndefined(listenerInterval)) {
                listenerInterval = setInterval(queueWatcher, 100);
            }
        };
        return {
            start: start,
            stop: function () {
                clearInterval(listenerInterval);
            }
        }
    };

    var calculateAngle = function calculateAngle(point1, point2) {
        var calcAngleVal = Math.atan2(point1[0] - point2[0], point1[1] - point2[1]) * (180 / Math.PI);

        if (calcAngleVal < 0) {
            calcAngleVal = Math.abs(calcAngleVal);
        } else {
            calcAngleVal = 360 - calcAngleVal;
        }

        return calcAngleVal;
    };

    var ObjectManipulator = function ObjectManipulator(mapObject) {
        this.mapObject = mapObject;
        this.queue = [];
        this.queueListener = new QueueListener(this);
        this.queueListener.start();
    };

    ObjectManipulator.prototype.transit = function transit(transitionDetails) {
        this.queue.push(transitionDetails);
    };

    ObjectManipulator.prototype.stop = function stop() {
        this.queueListener.stop();
    };

    ObjectManipulator.prototype.move = function move(coordinates) {
        var transformationApplied = d3.transform(this.mapObject.attr('transform')),
            boundingBox = this.mapObject.node().getBoundingClientRect();

        transformationApplied.translate = [coordinates[0] - boundingBox.width / 2, coordinates[1] - boundingBox.height / 2];
        this.mapObject.attr('transform', transformationApplied.toString());

    };

    return ObjectManipulator;
});