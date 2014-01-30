/**
 * Author: Vadim
 * Date: 1/29/14
 */
define(['jquery', '../../../.', 'd3'], function ($, _, d3, undefined) {

    var EventEmitter = function EventEmitter(eventTypes) {
        this.allListeners = {};
        if (_.isArray(eventTypes)) {
            _.each(eventTypes, function (eventType) {
                this.allListeners[eventType] = [];
            }.bind(this));
        }
    };

    var assertUnsupportedEvent = function assertUnsupportedEvent(eventName) {
        if (!this.allListeners.hasOwnProperty(eventName)) {
            throw 'Event ' + eventName + ' is not supported.';
        }
    };

    EventEmitter.prototype.bind = function bind(eventName, listener) {
        assertUnsupportedEvent.call(this, eventName);
        this.allListeners[eventName].push(listener);
    };

    EventEmitter.prototype.unbind = function unbind(eventName, listener) {
        assertUnsupportedEvent.call(this, eventName);
        this.allListeners[eventName] = _.without(this.allListeners[eventName], listener);
    };

    EventEmitter.prototype.unbindAll = function unbindAll(eventName) {
        assertUnsupportedEvent.call(this, eventName);
        this.allListeners[eventName] = [];
    };

    EventEmitter.prototype.trigger = function trigger(eventName, eventData) {
        assertUnsupportedEvent.call(this, eventName);
        _.each(this.allListeners[eventName], function (listener) {
            setTimeout(function (listener, eventData) {
                listener.call({}, eventData);
            }.bind(undefined, listener, eventData), 0);
        });
    };

    return EventEmitter;
});