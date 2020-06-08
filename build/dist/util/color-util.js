var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import { mapValues, range } from "lodash";
export var colorString = function (color) {
    return "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
};
/**
 * rgb values of the span between two colors.
 * will include negative values
 */
export var diffValues = function (start, end) {
    return applyTransform(function (s, e) { return e - s; }, start, end);
};
/*({
  r: end.r - start.r,
  g: end.g - start.g,
  b: end.b - start.b
});*/
export var applyTransform = function (transform, target, basis) {
    return mapValues(target, function (value, key) {
        return transform(value, basis[key]);
    });
};
export var getIntermediates = function (start, end, count) {
    var diff = diffValues(start, end);
    var indexes = range(1, count + 1);
    console.log(indexes);
    return indexes.map(function (i) {
        return applyTransform(function (start, diff) { return start + (i * diff) / (count + 1); }, start, diff);
    });
};
/**
 * range includes left and right, as does count
 */
export var getGradient = function (start, end, count) {
    return __spread([start], getIntermediates(start, end, count - 2), [end]);
};
//# sourceMappingURL=color-util.js.map