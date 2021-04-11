import {AnimatedLocation, AnimatedOffset, TimedLocation, TimedOffset} from "./types";
import React from "react";
import {pageXyToOffset} from "./calc";

/**
 * takes start and edd locations and maps to an Animated location based on the provided timer
 */
export const mapTimedLocation = ({start, end, timer}: TimedLocation): AnimatedLocation => {
  const {left, top} = mapTimedOffset({
      start: pageXyToOffset(start),
      end: pageXyToOffset(end),
      timer,
  });
  return {pageX: left, pageY: top};
};


export const mapTimedOffset = ({start, end, timer}: TimedOffset): AnimatedOffset => {
    return ({
        left: timer.interpolate({
            inputRange: [0, 1],
            outputRange: [start.left, end.left]
        }),
        top: timer.interpolate({
            inputRange: [0, 1],
            outputRange: [start.top, end.top]
        })
    });
};
