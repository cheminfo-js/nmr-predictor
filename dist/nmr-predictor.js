(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["nmrPredictor"] = factory();
	else
		root["nmrPredictor"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 17);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(27);
var abstractMatrix = __webpack_require__(8);
var util = __webpack_require__(2);

class Matrix extends abstractMatrix(Array) {
    constructor(nRows, nColumns) {
        var i;
        if (arguments.length === 1 && typeof nRows === 'number') {
            return new Array(nRows);
        }
        if (Matrix.isMatrix(nRows)) {
            return nRows.clone();
        } else if (Number.isInteger(nRows) && nRows > 0) { // Create an empty matrix
            super(nRows);
            if (Number.isInteger(nColumns) && nColumns > 0) {
                for (i = 0; i < nRows; i++) {
                    this[i] = new Array(nColumns);
                }
            } else {
                throw new TypeError('nColumns must be a positive integer');
            }
        } else if (Array.isArray(nRows)) { // Copy the values from the 2D array
            const matrix = nRows;
            nRows = matrix.length;
            nColumns = matrix[0].length;
            if (typeof nColumns !== 'number' || nColumns === 0) {
                throw new TypeError('Data must be a 2D array with at least one element');
            }
            super(nRows);
            for (i = 0; i < nRows; i++) {
                if (matrix[i].length !== nColumns) {
                    throw new RangeError('Inconsistent array dimensions');
                }
                this[i] = [].concat(matrix[i]);
            }
        } else {
            throw new TypeError('First argument must be a positive number or an array');
        }
        this.rows = nRows;
        this.columns = nColumns;
        return this;
    }

    set(rowIndex, columnIndex, value) {
        this[rowIndex][columnIndex] = value;
        return this;
    }

    get(rowIndex, columnIndex) {
        return this[rowIndex][columnIndex];
    }

    /**
     * Creates an exact and independent copy of the matrix
     * @return {Matrix}
     */
    clone() {
        var newMatrix = new this.constructor[Symbol.species](this.rows, this.columns);
        for (var row = 0; row < this.rows; row++) {
            for (var column = 0; column < this.columns; column++) {
                newMatrix.set(row, column, this.get(row, column));
            }
        }
        return newMatrix;
    }

    /**
     * Removes a row from the given index
     * @param {number} index - Row index
     * @return {Matrix} this
     */
    removeRow(index) {
        util.checkRowIndex(this, index);
        if (this.rows === 1) {
            throw new RangeError('A matrix cannot have less than one row');
        }
        this.splice(index, 1);
        this.rows -= 1;
        return this;
    }

    /**
     * Adds a row at the given index
     * @param {number} [index = this.rows] - Row index
     * @param {Array|Matrix} array - Array or vector
     * @return {Matrix} this
     */
    addRow(index, array) {
        if (array === undefined) {
            array = index;
            index = this.rows;
        }
        util.checkRowIndex(this, index, true);
        array = util.checkRowVector(this, array, true);
        this.splice(index, 0, array);
        this.rows += 1;
        return this;
    }

    /**
     * Removes a column from the given index
     * @param {number} index - Column index
     * @return {Matrix} this
     */
    removeColumn(index) {
        util.checkColumnIndex(this, index);
        if (this.columns === 1) {
            throw new RangeError('A matrix cannot have less than one column');
        }
        for (var i = 0; i < this.rows; i++) {
            this[i].splice(index, 1);
        }
        this.columns -= 1;
        return this;
    }

    /**
     * Adds a column at the given index
     * @param {number} [index = this.columns] - Column index
     * @param {Array|Matrix} array - Array or vector
     * @return {Matrix} this
     */
    addColumn(index, array) {
        if (typeof array === 'undefined') {
            array = index;
            index = this.columns;
        }
        util.checkColumnIndex(this, index, true);
        array = util.checkColumnVector(this, array);
        for (var i = 0; i < this.rows; i++) {
            this[i].splice(index, 0, array[i]);
        }
        this.columns += 1;
        return this;
    }
}

exports.Matrix = Matrix;
Matrix.abstractMatrix = abstractMatrix;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var abstractMatrix = __webpack_require__(8);
var Matrix = __webpack_require__(0);

class BaseView extends abstractMatrix() {
    constructor(matrix, rows, columns) {
        super();
        this.matrix = matrix;
        this.rows = rows;
        this.columns = columns;
    }

    static get [Symbol.species]() {
        return Matrix.Matrix;
    }
}

module.exports = BaseView;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(0);

/**
 * @private
 * Check that a row index is not out of bounds
 * @param {Matrix} matrix
 * @param {number} index
 * @param {boolean} [outer]
 */
exports.checkRowIndex = function checkRowIndex(matrix, index, outer) {
    var max = outer ? matrix.rows : matrix.rows - 1;
    if (index < 0 || index > max) {
        throw new RangeError('Row index out of range');
    }
};

/**
 * @private
 * Check that a column index is not out of bounds
 * @param {Matrix} matrix
 * @param {number} index
 * @param {boolean} [outer]
 */
exports.checkColumnIndex = function checkColumnIndex(matrix, index, outer) {
    var max = outer ? matrix.columns : matrix.columns - 1;
    if (index < 0 || index > max) {
        throw new RangeError('Column index out of range');
    }
};

/**
 * @private
 * Check that the provided vector is an array with the right length
 * @param {Matrix} matrix
 * @param {Array|Matrix} vector
 * @return {Array}
 * @throws {RangeError}
 */
exports.checkRowVector = function checkRowVector(matrix, vector) {
    if (vector.to1DArray) {
        vector = vector.to1DArray();
    }
    if (vector.length !== matrix.columns) {
        throw new RangeError('vector size must be the same as the number of columns');
    }
    return vector;
};

/**
 * @private
 * Check that the provided vector is an array with the right length
 * @param {Matrix} matrix
 * @param {Array|Matrix} vector
 * @return {Array}
 * @throws {RangeError}
 */
exports.checkColumnVector = function checkColumnVector(matrix, vector) {
    if (vector.to1DArray) {
        vector = vector.to1DArray();
    }
    if (vector.length !== matrix.rows) {
        throw new RangeError('vector size must be the same as the number of rows');
    }
    return vector;
};

exports.checkIndices = function checkIndices(matrix, rowIndices, columnIndices) {
    var rowOut = rowIndices.some(r => {
        return r < 0 || r >= matrix.rows;

    });

    var columnOut = columnIndices.some(c => {
        return c < 0 || c >= matrix.columns;
    });

    if (rowOut || columnOut) {
        throw new RangeError('Indices are out of range');
    }

    if (typeof rowIndices !== 'object' || typeof columnIndices !== 'object') {
        throw new TypeError('Unexpected type for row/column indices');
    }
    if (!Array.isArray(rowIndices)) rowIndices = Array.from(rowIndices);
    if (!Array.isArray(columnIndices)) rowIndices = Array.from(columnIndices);

    return {
        row: rowIndices,
        column: columnIndices
    };
};

exports.checkRange = function checkRange(matrix, startRow, endRow, startColumn, endColumn) {
    if (arguments.length !== 5) throw new TypeError('Invalid argument type');
    var notAllNumbers = Array.from(arguments).slice(1).some(function (arg) {
        return typeof arg !== 'number';
    });
    if (notAllNumbers) throw new TypeError('Invalid argument type');
    if (startRow > endRow || startColumn > endColumn || startRow < 0 || startRow >= matrix.rows || endRow < 0 || endRow >= matrix.rows || startColumn < 0 || startColumn >= matrix.columns || endColumn < 0 || endColumn >= matrix.columns) {
        throw new RangeError('Submatrix indices are out of range');
    }
};

exports.getRange = function getRange(from, to) {
    var arr = new Array(to - from + 1);
    for (var i = 0; i < arr.length; i++) {
        arr[i] = from + i;
    }
    return arr;
};

exports.sumByRow = function sumByRow(matrix) {
    var sum = Matrix.Matrix.zeros(matrix.rows, 1);
    for (var i = 0; i < matrix.rows; ++i) {
        for (var j = 0; j < matrix.columns; ++j) {
            sum.set(i, 0, sum.get(i, 0) + matrix.get(i, j));
        }
    }
    return sum;
};

exports.sumByColumn = function sumByColumn(matrix) {
    var sum = Matrix.Matrix.zeros(1, matrix.columns);
    for (var i = 0; i < matrix.rows; ++i) {
        for (var j = 0; j < matrix.columns; ++j) {
            sum.set(0, j, sum.get(0, j) + matrix.get(i, j));
        }
    }
    return sum;
};

exports.sumAll = function sumAll(matrix) {
    var v = 0;
    for (var i = 0; i < matrix.rows; i++) {
        for (var j = 0; j < matrix.columns; j++) {
            v += matrix.get(i, j);
        }
    }
    return v;
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.hypotenuse = function hypotenuse(a, b) {
    var r;
    if (Math.abs(a) > Math.abs(b)) {
        r = b / a;
        return Math.abs(a) * Math.sqrt(1 + r * r);
    }
    if (b !== 0) {
        r = a / b;
        return Math.abs(b) * Math.sqrt(1 + r * r);
    }
    return 0;
};

// For use in the decomposition algorithms. With big matrices, access time is
// too long on elements from array subclass
// todo check when it is fixed in v8
// http://jsperf.com/access-and-write-array-subclass
exports.getEmpty2DArray = function (rows, columns) {
    var array = new Array(rows);
    for (var i = 0; i < rows; i++) {
        array[i] = new Array(columns);
    }
    return array;
};

exports.getFilled2DArray = function (rows, columns, value) {
    var array = new Array(rows);
    for (var i = 0; i < rows; i++) {
        array[i] = new Array(columns);
        for (var j = 0; j < columns; j++) {
            array[i][j] = value;
        }
    }
    return array;
};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(0).Matrix;
module.exports.Decompositions = module.exports.DC = __webpack_require__(26);


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const getOcleFromOptions = __webpack_require__(13);

const defaultOptions = {
    atomLabel: 'H',
    ignoreLabile: true,
    use: 'median'
};

module.exports = function normalizeOptions(molecule, options) {
    options = Object.assign({}, defaultOptions, options);
    let {Molecule} = getOcleFromOptions(options);
    if (typeof molecule === 'string') {
        if (molecule.split(/[\r\n]+/).length > 2) {
            molecule = Molecule.fromMolfile(molecule);
        } else { // it is probably a SMILES
            molecule = Molecule.fromSmiles(molecule);
        }
    } else if (!(molecule instanceof Molecule)) {
        throw new Error('molecule must be a molfile string or Molecule instance');
    }

    if (options.atomLabel === 'H') {
        molecule.addImplicitHydrogens();
    }
    //@TODO Should be removed
    if (options.atomLabel === 'C') {
        molecule.removeExplicitHydrogens();
    }

    return [molecule, options];
};


/***/ }),
/* 6 */
/***/ (function(module, exports) {

/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return null !== obj && 'object' === typeof obj;
}

module.exports = isObject;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Matrix = __webpack_require__(4);

/**
 * Algorithm that finds the shortest distance from one node to the other
 * @param {Matrix} adjMatrix - A squared adjacency matrix
 * @return {Matrix} - Distance from a node to the other, -1 if the node is unreachable
 */
function floydWarshall(adjMatrix) {
    if (Matrix.isMatrix(adjMatrix) && (adjMatrix.columns !== adjMatrix.rows))
        throw new TypeError('The adjacency matrix should be squared');
    const numVertices = adjMatrix.columns;
    let distMatrix = new Matrix(numVertices, numVertices);
    distMatrix.apply((row, column) => {
        // principal diagonal is 0
        if (row === column)
            distMatrix.set(row, column, 0);
        else {
            let val = adjMatrix.get(row, column);
            // edges values remain the same
            if (val)
                distMatrix.set(row, column, val);
            // 0 values become infinity
            else
                distMatrix.set(row, column, Number.POSITIVE_INFINITY);
        }
    });

    for (let k = 0; k < numVertices; ++k)
        for (let i = 0; i < numVertices; ++i)
            for (let j = 0; j < numVertices; ++j) {
                let dist = distMatrix.get(i, k) + distMatrix.get(k, j);
                if (distMatrix.get(i, j) > dist)
                    distMatrix.set(i, j, dist);
            }

    // When there's no connection the value is -1
    distMatrix.apply((row, column) => {
        if (distMatrix.get(row, column) === Number.POSITIVE_INFINITY)
            distMatrix.set(row, column, -1);
    });
    return distMatrix;
}

module.exports = floydWarshall;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = abstractMatrix;

var LuDecomposition = __webpack_require__(9);
var SvDecomposition = __webpack_require__(10);
var arrayUtils = __webpack_require__(21);
var util = __webpack_require__(2);
var MatrixTransposeView = __webpack_require__(34);
var MatrixRowView = __webpack_require__(31);
var MatrixSubView = __webpack_require__(33);
var MatrixSelectionView = __webpack_require__(32);
var MatrixColumnView = __webpack_require__(28);
var MatrixFlipRowView = __webpack_require__(30);
var MatrixFlipColumnView = __webpack_require__(29);

function abstractMatrix(superCtor) {
    if (superCtor === undefined) superCtor = Object;

    /**
     * Real matrix
     * @class Matrix
     * @param {number|Array|Matrix} nRows - Number of rows of the new matrix,
     * 2D array containing the data or Matrix instance to clone
     * @param {number} [nColumns] - Number of columns of the new matrix
     */
    class Matrix extends superCtor {
        static get [Symbol.species]() {
            return this;
        }

        /**
         * Constructs a Matrix with the chosen dimensions from a 1D array
         * @param {number} newRows - Number of rows
         * @param {number} newColumns - Number of columns
         * @param {Array} newData - A 1D array containing data for the matrix
         * @return {Matrix} - The new matrix
         */
        static from1DArray(newRows, newColumns, newData) {
            var length = newRows * newColumns;
            if (length !== newData.length) {
                throw new RangeError('Data length does not match given dimensions');
            }
            var newMatrix = new this(newRows, newColumns);
            for (var row = 0; row < newRows; row++) {
                for (var column = 0; column < newColumns; column++) {
                    newMatrix.set(row, column, newData[row * newColumns + column]);
                }
            }
            return newMatrix;
        }

        /**
         * Creates a row vector, a matrix with only one row.
         * @param {Array} newData - A 1D array containing data for the vector
         * @return {Matrix} - The new matrix
         */
        static rowVector(newData) {
            var vector = new this(1, newData.length);
            for (var i = 0; i < newData.length; i++) {
                vector.set(0, i, newData[i]);
            }
            return vector;
        }

        /**
         * Creates a column vector, a matrix with only one column.
         * @param {Array} newData - A 1D array containing data for the vector
         * @return {Matrix} - The new matrix
         */
        static columnVector(newData) {
            var vector = new this(newData.length, 1);
            for (var i = 0; i < newData.length; i++) {
                vector.set(i, 0, newData[i]);
            }
            return vector;
        }

        /**
         * Creates an empty matrix with the given dimensions. Values will be undefined. Same as using new Matrix(rows, columns).
         * @param {number} rows - Number of rows
         * @param {number} columns - Number of columns
         * @return {Matrix} - The new matrix
         */
        static empty(rows, columns) {
            return new this(rows, columns);
        }

        /**
         * Creates a matrix with the given dimensions. Values will be set to zero.
         * @param {number} rows - Number of rows
         * @param {number} columns - Number of columns
         * @return {Matrix} - The new matrix
         */
        static zeros(rows, columns) {
            return this.empty(rows, columns).fill(0);
        }

        /**
         * Creates a matrix with the given dimensions. Values will be set to one.
         * @param {number} rows - Number of rows
         * @param {number} columns - Number of columns
         * @return {Matrix} - The new matrix
         */
        static ones(rows, columns) {
            return this.empty(rows, columns).fill(1);
        }

        /**
         * Creates a matrix with the given dimensions. Values will be randomly set.
         * @param {number} rows - Number of rows
         * @param {number} columns - Number of columns
         * @param {function} [rng=Math.random] - Random number generator
         * @return {Matrix} The new matrix
         */
        static rand(rows, columns, rng) {
            if (rng === undefined) rng = Math.random;
            var matrix = this.empty(rows, columns);
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < columns; j++) {
                    matrix.set(i, j, rng());
                }
            }
            return matrix;
        }

        /**
         * Creates a matrix with the given dimensions. Values will be random integers.
         * @param {number} rows - Number of rows
         * @param {number} columns - Number of columns
         * @param {number} [maxValue=1000] - Maximum value
         * @param {function} [rng=Math.random] - Random number generator
         * @return {Matrix} The new matrix
         */
        static randInt(rows, columns, maxValue, rng) {
            if (maxValue === undefined) maxValue = 1000;
            if (rng === undefined) rng = Math.random;
            var matrix = this.empty(rows, columns);
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < columns; j++) {
                    var value = Math.floor(rng() * maxValue);
                    matrix.set(i, j, value);
                }
            }
            return matrix;
        }

        /**
         * Creates an identity matrix with the given dimension. Values of the diagonal will be 1 and others will be 0.
         * @param {number} rows - Number of rows
         * @param {number} [columns=rows] - Number of columns
         * @param {number} [value=1] - Value to fill the diagonal with
         * @return {Matrix} - The new identity matrix
         */
        static eye(rows, columns, value) {
            if (columns === undefined) columns = rows;
            if (value === undefined) value = 1;
            var min = Math.min(rows, columns);
            var matrix = this.zeros(rows, columns);
            for (var i = 0; i < min; i++) {
                matrix.set(i, i, value);
            }
            return matrix;
        }

        /**
         * Creates a diagonal matrix based on the given array.
         * @param {Array} data - Array containing the data for the diagonal
         * @param {number} [rows] - Number of rows (Default: data.length)
         * @param {number} [columns] - Number of columns (Default: rows)
         * @return {Matrix} - The new diagonal matrix
         */
        static diag(data, rows, columns) {
            var l = data.length;
            if (rows === undefined) rows = l;
            if (columns === undefined) columns = rows;
            var min = Math.min(l, rows, columns);
            var matrix = this.zeros(rows, columns);
            for (var i = 0; i < min; i++) {
                matrix.set(i, i, data[i]);
            }
            return matrix;
        }

        /**
         * Returns a matrix whose elements are the minimum between matrix1 and matrix2
         * @param {Matrix} matrix1
         * @param {Matrix} matrix2
         * @return {Matrix}
         */
        static min(matrix1, matrix2) {
            matrix1 = this.checkMatrix(matrix1);
            matrix2 = this.checkMatrix(matrix2);
            var rows = matrix1.rows;
            var columns = matrix1.columns;
            var result = new this(rows, columns);
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < columns; j++) {
                    result.set(i, j, Math.min(matrix1.get(i, j), matrix2.get(i, j)));
                }
            }
            return result;
        }

        /**
         * Returns a matrix whose elements are the maximum between matrix1 and matrix2
         * @param {Matrix} matrix1
         * @param {Matrix} matrix2
         * @return {Matrix}
         */
        static max(matrix1, matrix2) {
            matrix1 = this.checkMatrix(matrix1);
            matrix2 = this.checkMatrix(matrix2);
            var rows = matrix1.rows;
            var columns = matrix1.columns;
            var result = new this(rows, columns);
            for (var i = 0; i < rows; i++) {
                for (var j = 0; j < columns; j++) {
                    result.set(i, j, Math.max(matrix1.get(i, j), matrix2.get(i, j)));
                }
            }
            return result;
        }

        /**
         * Check that the provided value is a Matrix and tries to instantiate one if not
         * @param {*} value - The value to check
         * @return {Matrix}
         */
        static checkMatrix(value) {
            return Matrix.isMatrix(value) ? value : new this(value);
        }

        /**
         * Returns true if the argument is a Matrix, false otherwise
         * @param {*} value - The value to check
         * @return {boolean}
         */
        static isMatrix(value) {
            return (value != null) && (value.klass === 'Matrix');
        }

        /**
         * @prop {number} size - The number of elements in the matrix.
         */
        get size() {
            return this.rows * this.columns;
        }

        /**
         * Applies a callback for each element of the matrix. The function is called in the matrix (this) context.
         * @param {function} callback - Function that will be called with two parameters : i (row) and j (column)
         * @return {Matrix} this
         */
        apply(callback) {
            if (typeof callback !== 'function') {
                throw new TypeError('callback must be a function');
            }
            var ii = this.rows;
            var jj = this.columns;
            for (var i = 0; i < ii; i++) {
                for (var j = 0; j < jj; j++) {
                    callback.call(this, i, j);
                }
            }
            return this;
        }

        /**
         * Returns a new 1D array filled row by row with the matrix values
         * @return {Array}
         */
        to1DArray() {
            var array = new Array(this.size);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    array[i * this.columns + j] = this.get(i, j);
                }
            }
            return array;
        }

        /**
         * Returns a 2D array containing a copy of the data
         * @return {Array}
         */
        to2DArray() {
            var copy = new Array(this.rows);
            for (var i = 0; i < this.rows; i++) {
                copy[i] = new Array(this.columns);
                for (var j = 0; j < this.columns; j++) {
                    copy[i][j] = this.get(i, j);
                }
            }
            return copy;
        }

        /**
         * @return {boolean} true if the matrix has one row
         */
        isRowVector() {
            return this.rows === 1;
        }

        /**
         * @return {boolean} true if the matrix has one column
         */
        isColumnVector() {
            return this.columns === 1;
        }

        /**
         * @return {boolean} true if the matrix has one row or one column
         */
        isVector() {
            return (this.rows === 1) || (this.columns === 1);
        }

        /**
         * @return {boolean} true if the matrix has the same number of rows and columns
         */
        isSquare() {
            return this.rows === this.columns;
        }

        /**
         * @return {boolean} true if the matrix is square and has the same values on both sides of the diagonal
         */
        isSymmetric() {
            if (this.isSquare()) {
                for (var i = 0; i < this.rows; i++) {
                    for (var j = 0; j <= i; j++) {
                        if (this.get(i, j) !== this.get(j, i)) {
                            return false;
                        }
                    }
                }
                return true;
            }
            return false;
        }

        /**
         * Sets a given element of the matrix. mat.set(3,4,1) is equivalent to mat[3][4]=1
         * @abstract
         * @param {number} rowIndex - Index of the row
         * @param {number} columnIndex - Index of the column
         * @param {number} value - The new value for the element
         * @return {Matrix} this
         */
        set(rowIndex, columnIndex, value) { // eslint-disable-line no-unused-vars
            throw new Error('set method is unimplemented');
        }

        /**
         * Returns the given element of the matrix. mat.get(3,4) is equivalent to matrix[3][4]
         * @abstract
         * @param {number} rowIndex - Index of the row
         * @param {number} columnIndex - Index of the column
         * @return {number}
         */
        get(rowIndex, columnIndex) { // eslint-disable-line no-unused-vars
            throw new Error('get method is unimplemented');
        }

        /**
         * Creates a new matrix that is a repetition of the current matrix. New matrix has rowRep times the number of
         * rows of the matrix, and colRep times the number of columns of the matrix
         * @param {number} rowRep - Number of times the rows should be repeated
         * @param {number} colRep - Number of times the columns should be re
         * @return {Matrix}
         * @example
         * var matrix = new Matrix([[1,2]]);
         * matrix.repeat(2); // [[1,2],[1,2]]
         */
        repeat(rowRep, colRep) {
            rowRep = rowRep || 1;
            colRep = colRep || 1;
            var matrix = new this.constructor[Symbol.species](this.rows * rowRep, this.columns * colRep);
            for (var i = 0; i < rowRep; i++) {
                for (var j = 0; j < colRep; j++) {
                    matrix.setSubMatrix(this, this.rows * i, this.columns * j);
                }
            }
            return matrix;
        }

        /**
         * Fills the matrix with a given value. All elements will be set to this value.
         * @param {number} value - New value
         * @return {Matrix} this
         */
        fill(value) {
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, value);
                }
            }
            return this;
        }

        /**
         * Negates the matrix. All elements will be multiplied by (-1)
         * @return {Matrix} this
         */
        neg() {
            return this.mulS(-1);
        }

        /**
         * Returns a new array from the given row index
         * @param {number} index - Row index
         * @return {Array}
         */
        getRow(index) {
            util.checkRowIndex(this, index);
            var row = new Array(this.columns);
            for (var i = 0; i < this.columns; i++) {
                row[i] = this.get(index, i);
            }
            return row;
        }

        /**
         * Returns a new row vector from the given row index
         * @param {number} index - Row index
         * @return {Matrix}
         */
        getRowVector(index) {
            return this.constructor.rowVector(this.getRow(index));
        }

        /**
         * Sets a row at the given index
         * @param {number} index - Row index
         * @param {Array|Matrix} array - Array or vector
         * @return {Matrix} this
         */
        setRow(index, array) {
            util.checkRowIndex(this, index);
            array = util.checkRowVector(this, array);
            for (var i = 0; i < this.columns; i++) {
                this.set(index, i, array[i]);
            }
            return this;
        }

        /**
         * Swaps two rows
         * @param {number} row1 - First row index
         * @param {number} row2 - Second row index
         * @return {Matrix} this
         */
        swapRows(row1, row2) {
            util.checkRowIndex(this, row1);
            util.checkRowIndex(this, row2);
            for (var i = 0; i < this.columns; i++) {
                var temp = this.get(row1, i);
                this.set(row1, i, this.get(row2, i));
                this.set(row2, i, temp);
            }
            return this;
        }

        /**
         * Returns a new array from the given column index
         * @param {number} index - Column index
         * @return {Array}
         */
        getColumn(index) {
            util.checkColumnIndex(this, index);
            var column = new Array(this.rows);
            for (var i = 0; i < this.rows; i++) {
                column[i] = this.get(i, index);
            }
            return column;
        }

        /**
         * Returns a new column vector from the given column index
         * @param {number} index - Column index
         * @return {Matrix}
         */
        getColumnVector(index) {
            return this.constructor.columnVector(this.getColumn(index));
        }

        /**
         * Sets a column at the given index
         * @param {number} index - Column index
         * @param {Array|Matrix} array - Array or vector
         * @return {Matrix} this
         */
        setColumn(index, array) {
            util.checkColumnIndex(this, index);
            array = util.checkColumnVector(this, array);
            for (var i = 0; i < this.rows; i++) {
                this.set(i, index, array[i]);
            }
            return this;
        }

        /**
         * Swaps two columns
         * @param {number} column1 - First column index
         * @param {number} column2 - Second column index
         * @return {Matrix} this
         */
        swapColumns(column1, column2) {
            util.checkColumnIndex(this, column1);
            util.checkColumnIndex(this, column2);
            for (var i = 0; i < this.rows; i++) {
                var temp = this.get(i, column1);
                this.set(i, column1, this.get(i, column2));
                this.set(i, column2, temp);
            }
            return this;
        }

        /**
         * Adds the values of a vector to each row
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
        addRowVector(vector) {
            vector = util.checkRowVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) + vector[j]);
                }
            }
            return this;
        }

        /**
         * Subtracts the values of a vector from each row
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
        subRowVector(vector) {
            vector = util.checkRowVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) - vector[j]);
                }
            }
            return this;
        }

        /**
         * Multiplies the values of a vector with each row
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
        mulRowVector(vector) {
            vector = util.checkRowVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) * vector[j]);
                }
            }
            return this;
        }

        /**
         * Divides the values of each row by those of a vector
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
        divRowVector(vector) {
            vector = util.checkRowVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) / vector[j]);
                }
            }
            return this;
        }

        /**
         * Adds the values of a vector to each column
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
        addColumnVector(vector) {
            vector = util.checkColumnVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) + vector[i]);
                }
            }
            return this;
        }

        /**
         * Subtracts the values of a vector from each column
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
        subColumnVector(vector) {
            vector = util.checkColumnVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) - vector[i]);
                }
            }
            return this;
        }

        /**
         * Multiplies the values of a vector with each column
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
        mulColumnVector(vector) {
            vector = util.checkColumnVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) * vector[i]);
                }
            }
            return this;
        }

        /**
         * Divides the values of each column by those of a vector
         * @param {Array|Matrix} vector - Array or vector
         * @return {Matrix} this
         */
        divColumnVector(vector) {
            vector = util.checkColumnVector(this, vector);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    this.set(i, j, this.get(i, j) / vector[i]);
                }
            }
            return this;
        }

        /**
         * Multiplies the values of a row with a scalar
         * @param {number} index - Row index
         * @param {number} value
         * @return {Matrix} this
         */
        mulRow(index, value) {
            util.checkRowIndex(this, index);
            for (var i = 0; i < this.columns; i++) {
                this.set(index, i, this.get(index, i) * value);
            }
            return this;
        }

        /**
         * Multiplies the values of a column with a scalar
         * @param {number} index - Column index
         * @param {number} value
         * @return {Matrix} this
         */
        mulColumn(index, value) {
            util.checkColumnIndex(this, index);
            for (var i = 0; i < this.rows; i++) {
                this.set(i, index, this.get(i, index) * value);
            }
            return this;
        }

        /**
         * Returns the maximum value of the matrix
         * @return {number}
         */
        max() {
            var v = this.get(0, 0);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    if (this.get(i, j) > v) {
                        v = this.get(i, j);
                    }
                }
            }
            return v;
        }

        /**
         * Returns the index of the maximum value
         * @return {Array}
         */
        maxIndex() {
            var v = this.get(0, 0);
            var idx = [0, 0];
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    if (this.get(i, j) > v) {
                        v = this.get(i, j);
                        idx[0] = i;
                        idx[1] = j;
                    }
                }
            }
            return idx;
        }

        /**
         * Returns the minimum value of the matrix
         * @return {number}
         */
        min() {
            var v = this.get(0, 0);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    if (this.get(i, j) < v) {
                        v = this.get(i, j);
                    }
                }
            }
            return v;
        }

        /**
         * Returns the index of the minimum value
         * @return {Array}
         */
        minIndex() {
            var v = this.get(0, 0);
            var idx = [0, 0];
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    if (this.get(i, j) < v) {
                        v = this.get(i, j);
                        idx[0] = i;
                        idx[1] = j;
                    }
                }
            }
            return idx;
        }

        /**
         * Returns the maximum value of one row
         * @param {number} row - Row index
         * @return {number}
         */
        maxRow(row) {
            util.checkRowIndex(this, row);
            var v = this.get(row, 0);
            for (var i = 1; i < this.columns; i++) {
                if (this.get(row, i) > v) {
                    v = this.get(row, i);
                }
            }
            return v;
        }

        /**
         * Returns the index of the maximum value of one row
         * @param {number} row - Row index
         * @return {Array}
         */
        maxRowIndex(row) {
            util.checkRowIndex(this, row);
            var v = this.get(row, 0);
            var idx = [row, 0];
            for (var i = 1; i < this.columns; i++) {
                if (this.get(row, i) > v) {
                    v = this.get(row, i);
                    idx[1] = i;
                }
            }
            return idx;
        }

        /**
         * Returns the minimum value of one row
         * @param {number} row - Row index
         * @return {number}
         */
        minRow(row) {
            util.checkRowIndex(this, row);
            var v = this.get(row, 0);
            for (var i = 1; i < this.columns; i++) {
                if (this.get(row, i) < v) {
                    v = this.get(row, i);
                }
            }
            return v;
        }

        /**
         * Returns the index of the maximum value of one row
         * @param {number} row - Row index
         * @return {Array}
         */
        minRowIndex(row) {
            util.checkRowIndex(this, row);
            var v = this.get(row, 0);
            var idx = [row, 0];
            for (var i = 1; i < this.columns; i++) {
                if (this.get(row, i) < v) {
                    v = this.get(row, i);
                    idx[1] = i;
                }
            }
            return idx;
        }

        /**
         * Returns the maximum value of one column
         * @param {number} column - Column index
         * @return {number}
         */
        maxColumn(column) {
            util.checkColumnIndex(this, column);
            var v = this.get(0, column);
            for (var i = 1; i < this.rows; i++) {
                if (this.get(i, column) > v) {
                    v = this.get(i, column);
                }
            }
            return v;
        }

        /**
         * Returns the index of the maximum value of one column
         * @param {number} column - Column index
         * @return {Array}
         */
        maxColumnIndex(column) {
            util.checkColumnIndex(this, column);
            var v = this.get(0, column);
            var idx = [0, column];
            for (var i = 1; i < this.rows; i++) {
                if (this.get(i, column) > v) {
                    v = this.get(i, column);
                    idx[0] = i;
                }
            }
            return idx;
        }

        /**
         * Returns the minimum value of one column
         * @param {number} column - Column index
         * @return {number}
         */
        minColumn(column) {
            util.checkColumnIndex(this, column);
            var v = this.get(0, column);
            for (var i = 1; i < this.rows; i++) {
                if (this.get(i, column) < v) {
                    v = this.get(i, column);
                }
            }
            return v;
        }

        /**
         * Returns the index of the minimum value of one column
         * @param {number} column - Column index
         * @return {Array}
         */
        minColumnIndex(column) {
            util.checkColumnIndex(this, column);
            var v = this.get(0, column);
            var idx = [0, column];
            for (var i = 1; i < this.rows; i++) {
                if (this.get(i, column) < v) {
                    v = this.get(i, column);
                    idx[0] = i;
                }
            }
            return idx;
        }

        /**
         * Returns an array containing the diagonal values of the matrix
         * @return {Array}
         */
        diag() {
            var min = Math.min(this.rows, this.columns);
            var diag = new Array(min);
            for (var i = 0; i < min; i++) {
                diag[i] = this.get(i, i);
            }
            return diag;
        }

        /**
         * Returns the sum by the argument given, if no argument given,
         * it returns the sum of all elements of the matrix.
         * @param {string} by - sum by 'row' or 'column'.
         * @return {Matrix|number}
         */
        sum(by) {
            switch (by) {
                case 'row':
                    return util.sumByRow(this);
                case 'column':
                    return util.sumByColumn(this);
                default:
                    return util.sumAll(this);
            }
        }

        /**
         * Returns the mean of all elements of the matrix
         * @return {number}
         */
        mean() {
            return this.sum() / this.size;
        }

        /**
         * Returns the product of all elements of the matrix
         * @return {number}
         */
        prod() {
            var prod = 1;
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    prod *= this.get(i, j);
                }
            }
            return prod;
        }

        /**
         * Computes the cumulative sum of the matrix elements (in place, row by row)
         * @return {Matrix} this
         */
        cumulativeSum() {
            var sum = 0;
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    sum += this.get(i, j);
                    this.set(i, j, sum);
                }
            }
            return this;
        }

        /**
         * Computes the dot (scalar) product between the matrix and another
         * @param {Matrix} vector2 vector
         * @return {number}
         */
        dot(vector2) {
            if (Matrix.isMatrix(vector2)) vector2 = vector2.to1DArray();
            var vector1 = this.to1DArray();
            if (vector1.length !== vector2.length) {
                throw new RangeError('vectors do not have the same size');
            }
            var dot = 0;
            for (var i = 0; i < vector1.length; i++) {
                dot += vector1[i] * vector2[i];
            }
            return dot;
        }

        /**
         * Returns the matrix product between this and other
         * @param {Matrix} other
         * @return {Matrix}
         */
        mmul(other) {
            other = this.constructor.checkMatrix(other);
            if (this.columns !== other.rows) {
                // eslint-disable-next-line no-console
                console.warn('Number of columns of left matrix are not equal to number of rows of right matrix.');
            }

            var m = this.rows;
            var n = this.columns;
            var p = other.columns;

            var result = new this.constructor[Symbol.species](m, p);

            var Bcolj = new Array(n);
            for (var j = 0; j < p; j++) {
                for (var k = 0; k < n; k++) {
                    Bcolj[k] = other.get(k, j);
                }

                for (var i = 0; i < m; i++) {
                    var s = 0;
                    for (k = 0; k < n; k++) {
                        s += this.get(i, k) * Bcolj[k];
                    }

                    result.set(i, j, s);
                }
            }
            return result;
        }

        strassen2x2(other) {
            var result = new this.constructor[Symbol.species](2, 2);
            const a11 = this.get(0, 0);
            const b11 = other.get(0, 0);
            const a12 = this.get(0, 1);
            const b12 = other.get(0, 1);
            const a21 = this.get(1, 0);
            const b21 = other.get(1, 0);
            const a22 = this.get(1, 1);
            const b22 = other.get(1, 1);

            // Compute intermediate values.
            const m1 = (a11 + a22) * (b11 + b22);
            const m2 = (a21 + a22) * b11;
            const m3 = a11 * (b12 - b22);
            const m4 = a22 * (b21 - b11);
            const m5 = (a11 + a12) * b22;
            const m6 = (a21 - a11) * (b11 + b12);
            const m7 = (a12 - a22) * (b21 + b22);

            // Combine intermediate values into the output.
            const c00 = m1 + m4 - m5 + m7;
            const c01 = m3 + m5;
            const c10 = m2 + m4;
            const c11 = m1 - m2 + m3 + m6;

            result.set(0, 0, c00);
            result.set(0, 1, c01);
            result.set(1, 0, c10);
            result.set(1, 1, c11);
            return result;
        }

        strassen3x3(other) {
            var result = new this.constructor[Symbol.species](3, 3);

            const a00 = this.get(0, 0);
            const a01 = this.get(0, 1);
            const a02 = this.get(0, 2);
            const a10 = this.get(1, 0);
            const a11 = this.get(1, 1);
            const a12 = this.get(1, 2);
            const a20 = this.get(2, 0);
            const a21 = this.get(2, 1);
            const a22 = this.get(2, 2);

            const b00 = other.get(0, 0);
            const b01 = other.get(0, 1);
            const b02 = other.get(0, 2);
            const b10 = other.get(1, 0);
            const b11 = other.get(1, 1);
            const b12 = other.get(1, 2);
            const b20 = other.get(2, 0);
            const b21 = other.get(2, 1);
            const b22 = other.get(2, 2);

            const m1 = (a00 + a01 + a02 - a10 - a11 - a21 - a22) * b11;
            const m2 = (a00 - a10) * (-b01 + b11);
            const m3 = a11 * (-b00 + b01 + b10 - b11 - b12 - b20 + b22);
            const m4 = (-a00 + a10 + a11) * (b00 - b01 + b11);
            const m5 = (a10 + a11) * (-b00 + b01);
            const m6 = a00 * b00;
            const m7 = (-a00 + a20 + a21) * (b00 - b02 + b12);
            const m8 = (-a00 + a20) * (b02 - b12);
            const m9 = (a20 + a21) * (-b00 + b02);
            const m10 = (a00 + a01 + a02 - a11 - a12 - a20 - a21) * b12;
            const m11 = a21 * (-b00 + b02 + b10 - b11 - b12 - b20 + b21);
            const m12 = (-a02 + a21 + a22) * (b11 + b20 - b21);
            const m13 = (a02 - a22) * (b11 - b21);
            const m14 = a02 * b20;
            const m15 = (a21 + a22) * (-b20 + b21);
            const m16 = (-a02 + a11 + a12) * (b12 + b20 - b22);
            const m17 = (a02 - a12) * (b12 - b22);
            const m18 = (a11 + a12) * (-b20 + b22);
            const m19 = a01 * b10;
            const m20 = a12 * b21;
            const m21 = a10 * b02;
            const m22 = a20 * b01;
            const m23 = a22 * b22;

            const c00 = m6 + m14 + m19;
            const c01 = m1 + m4 + m5 + m6 + m12 + m14 + m15;
            const c02 = m6 + m7 + m9 + m10 + m14 + m16 + m18;
            const c10 = m2 + m3 + m4 + m6 + m14 + m16 + m17;
            const c11 = m2 + m4 + m5 + m6 + m20;
            const c12 = m14 + m16 + m17 + m18 + m21;
            const c20 = m6 + m7 + m8 + m11 + m12 + m13 + m14;
            const c21 = m12 + m13 + m14 + m15 + m22;
            const c22 = m6 + m7 + m8 + m9 + m23;

            result.set(0, 0, c00);
            result.set(0, 1, c01);
            result.set(0, 2, c02);
            result.set(1, 0, c10);
            result.set(1, 1, c11);
            result.set(1, 2, c12);
            result.set(2, 0, c20);
            result.set(2, 1, c21);
            result.set(2, 2, c22);
            return result;
        }

        /**
         * Returns the matrix product between x and y. More efficient than mmul(other) only when we multiply squared matrix and when the size of the matrix is > 1000.
         * @param {Matrix} y
         * @return {Matrix}
         */
        mmulStrassen(y) {
            var x = this.clone();
            var r1 = x.rows;
            var c1 = x.columns;
            var r2 = y.rows;
            var c2 = y.columns;
            if (c1 !== r2) {
                // eslint-disable-next-line no-console
                console.warn(`Multiplying ${r1} x ${c1} and ${r2} x ${c2} matrix: dimensions do not match.`);
            }

            // Put a matrix into the top left of a matrix of zeros.
            // `rows` and `cols` are the dimensions of the output matrix.
            function embed(mat, rows, cols) {
                var r = mat.rows;
                var c = mat.columns;
                if ((r === rows) && (c === cols)) {
                    return mat;
                } else {
                    var resultat = Matrix.zeros(rows, cols);
                    resultat = resultat.setSubMatrix(mat, 0, 0);
                    return resultat;
                }
            }


            // Make sure both matrices are the same size.
            // This is exclusively for simplicity:
            // this algorithm can be implemented with matrices of different sizes.

            var r = Math.max(r1, r2);
            var c = Math.max(c1, c2);
            x = embed(x, r, c);
            y = embed(y, r, c);

            // Our recursive multiplication function.
            function blockMult(a, b, rows, cols) {
                // For small matrices, resort to naive multiplication.
                if (rows <= 512 || cols <= 512) {
                    return a.mmul(b); // a is equivalent to this
                }

                // Apply dynamic padding.
                if ((rows % 2 === 1) && (cols % 2 === 1)) {
                    a = embed(a, rows + 1, cols + 1);
                    b = embed(b, rows + 1, cols + 1);
                } else if (rows % 2 === 1) {
                    a = embed(a, rows + 1, cols);
                    b = embed(b, rows + 1, cols);
                } else if (cols % 2 === 1) {
                    a = embed(a, rows, cols + 1);
                    b = embed(b, rows, cols + 1);
                }

                var halfRows = parseInt(a.rows / 2);
                var halfCols = parseInt(a.columns / 2);
                // Subdivide input matrices.
                var a11 = a.subMatrix(0, halfRows - 1, 0, halfCols - 1);
                var b11 = b.subMatrix(0, halfRows - 1, 0, halfCols - 1);

                var a12 = a.subMatrix(0, halfRows - 1, halfCols, a.columns - 1);
                var b12 = b.subMatrix(0, halfRows - 1, halfCols, b.columns - 1);

                var a21 = a.subMatrix(halfRows, a.rows - 1, 0, halfCols - 1);
                var b21 = b.subMatrix(halfRows, b.rows - 1, 0, halfCols - 1);

                var a22 = a.subMatrix(halfRows, a.rows - 1, halfCols, a.columns - 1);
                var b22 = b.subMatrix(halfRows, b.rows - 1, halfCols, b.columns - 1);

                // Compute intermediate values.
                var m1 = blockMult(Matrix.add(a11, a22), Matrix.add(b11, b22), halfRows, halfCols);
                var m2 = blockMult(Matrix.add(a21, a22), b11, halfRows, halfCols);
                var m3 = blockMult(a11, Matrix.sub(b12, b22), halfRows, halfCols);
                var m4 = blockMult(a22, Matrix.sub(b21, b11), halfRows, halfCols);
                var m5 = blockMult(Matrix.add(a11, a12), b22, halfRows, halfCols);
                var m6 = blockMult(Matrix.sub(a21, a11), Matrix.add(b11, b12), halfRows, halfCols);
                var m7 = blockMult(Matrix.sub(a12, a22), Matrix.add(b21, b22), halfRows, halfCols);

                // Combine intermediate values into the output.
                var c11 = Matrix.add(m1, m4);
                c11.sub(m5);
                c11.add(m7);
                var c12 = Matrix.add(m3, m5);
                var c21 = Matrix.add(m2, m4);
                var c22 = Matrix.sub(m1, m2);
                c22.add(m3);
                c22.add(m6);

                //Crop output to the desired size (undo dynamic padding).
                var resultat = Matrix.zeros(2 * c11.rows, 2 * c11.columns);
                resultat = resultat.setSubMatrix(c11, 0, 0);
                resultat = resultat.setSubMatrix(c12, c11.rows, 0);
                resultat = resultat.setSubMatrix(c21, 0, c11.columns);
                resultat = resultat.setSubMatrix(c22, c11.rows, c11.columns);
                return resultat.subMatrix(0, rows - 1, 0, cols - 1);
            }
            return blockMult(x, y, r, c);
        }

        /**
         * Returns a row-by-row scaled matrix
         * @param {number} [min=0] - Minimum scaled value
         * @param {number} [max=1] - Maximum scaled value
         * @return {Matrix} - The scaled matrix
         */
        scaleRows(min, max) {
            min = min === undefined ? 0 : min;
            max = max === undefined ? 1 : max;
            if (min >= max) {
                throw new RangeError('min should be strictly smaller than max');
            }
            var newMatrix = this.constructor.empty(this.rows, this.columns);
            for (var i = 0; i < this.rows; i++) {
                var scaled = arrayUtils.scale(this.getRow(i), {min, max});
                newMatrix.setRow(i, scaled);
            }
            return newMatrix;
        }

        /**
         * Returns a new column-by-column scaled matrix
         * @param {number} [min=0] - Minimum scaled value
         * @param {number} [max=1] - Maximum scaled value
         * @return {Matrix} - The new scaled matrix
         * @example
         * var matrix = new Matrix([[1,2],[-1,0]]);
         * var scaledMatrix = matrix.scaleColumns(); // [[1,1],[0,0]]
         */
        scaleColumns(min, max) {
            min = min === undefined ? 0 : min;
            max = max === undefined ? 1 : max;
            if (min >= max) {
                throw new RangeError('min should be strictly smaller than max');
            }
            var newMatrix = this.constructor.empty(this.rows, this.columns);
            for (var i = 0; i < this.columns; i++) {
                var scaled = arrayUtils.scale(this.getColumn(i), {
                    min: min,
                    max: max
                });
                newMatrix.setColumn(i, scaled);
            }
            return newMatrix;
        }


        /**
         * Returns the Kronecker product (also known as tensor product) between this and other
         * See https://en.wikipedia.org/wiki/Kronecker_product
         * @param {Matrix} other
         * @return {Matrix}
         */
        kroneckerProduct(other) {
            other = this.constructor.checkMatrix(other);

            var m = this.rows;
            var n = this.columns;
            var p = other.rows;
            var q = other.columns;

            var result = new this.constructor[Symbol.species](m * p, n * q);
            for (var i = 0; i < m; i++) {
                for (var j = 0; j < n; j++) {
                    for (var k = 0; k < p; k++) {
                        for (var l = 0; l < q; l++) {
                            result[p * i + k][q * j + l] = this.get(i, j) * other.get(k, l);
                        }
                    }
                }
            }
            return result;
        }

        /**
         * Transposes the matrix and returns a new one containing the result
         * @return {Matrix}
         */
        transpose() {
            var result = new this.constructor[Symbol.species](this.columns, this.rows);
            for (var i = 0; i < this.rows; i++) {
                for (var j = 0; j < this.columns; j++) {
                    result.set(j, i, this.get(i, j));
                }
            }
            return result;
        }

        /**
         * Sorts the rows (in place)
         * @param {function} compareFunction - usual Array.prototype.sort comparison function
         * @return {Matrix} this
         */
        sortRows(compareFunction) {
            if (compareFunction === undefined) compareFunction = compareNumbers;
            for (var i = 0; i < this.rows; i++) {
                this.setRow(i, this.getRow(i).sort(compareFunction));
            }
            return this;
        }

        /**
         * Sorts the columns (in place)
         * @param {function} compareFunction - usual Array.prototype.sort comparison function
         * @return {Matrix} this
         */
        sortColumns(compareFunction) {
            if (compareFunction === undefined) compareFunction = compareNumbers;
            for (var i = 0; i < this.columns; i++) {
                this.setColumn(i, this.getColumn(i).sort(compareFunction));
            }
            return this;
        }

        /**
         * Returns a subset of the matrix
         * @param {number} startRow - First row index
         * @param {number} endRow - Last row index
         * @param {number} startColumn - First column index
         * @param {number} endColumn - Last column index
         * @return {Matrix}
         */
        subMatrix(startRow, endRow, startColumn, endColumn) {
            util.checkRange(this, startRow, endRow, startColumn, endColumn);
            var newMatrix = new this.constructor[Symbol.species](endRow - startRow + 1, endColumn - startColumn + 1);
            for (var i = startRow; i <= endRow; i++) {
                for (var j = startColumn; j <= endColumn; j++) {
                    newMatrix[i - startRow][j - startColumn] = this.get(i, j);
                }
            }
            return newMatrix;
        }

        /**
         * Returns a subset of the matrix based on an array of row indices
         * @param {Array} indices - Array containing the row indices
         * @param {number} [startColumn = 0] - First column index
         * @param {number} [endColumn = this.columns-1] - Last column index
         * @return {Matrix}
         */
        subMatrixRow(indices, startColumn, endColumn) {
            if (startColumn === undefined) startColumn = 0;
            if (endColumn === undefined) endColumn = this.columns - 1;
            if ((startColumn > endColumn) || (startColumn < 0) || (startColumn >= this.columns) || (endColumn < 0) || (endColumn >= this.columns)) {
                throw new RangeError('Argument out of range');
            }

            var newMatrix = new this.constructor[Symbol.species](indices.length, endColumn - startColumn + 1);
            for (var i = 0; i < indices.length; i++) {
                for (var j = startColumn; j <= endColumn; j++) {
                    if (indices[i] < 0 || indices[i] >= this.rows) {
                        throw new RangeError('Row index out of range: ' + indices[i]);
                    }
                    newMatrix.set(i, j - startColumn, this.get(indices[i], j));
                }
            }
            return newMatrix;
        }

        /**
         * Returns a subset of the matrix based on an array of column indices
         * @param {Array} indices - Array containing the column indices
         * @param {number} [startRow = 0] - First row index
         * @param {number} [endRow = this.rows-1] - Last row index
         * @return {Matrix}
         */
        subMatrixColumn(indices, startRow, endRow) {
            if (startRow === undefined) startRow = 0;
            if (endRow === undefined) endRow = this.rows - 1;
            if ((startRow > endRow) || (startRow < 0) || (startRow >= this.rows) || (endRow < 0) || (endRow >= this.rows)) {
                throw new RangeError('Argument out of range');
            }

            var newMatrix = new this.constructor[Symbol.species](endRow - startRow + 1, indices.length);
            for (var i = 0; i < indices.length; i++) {
                for (var j = startRow; j <= endRow; j++) {
                    if (indices[i] < 0 || indices[i] >= this.columns) {
                        throw new RangeError('Column index out of range: ' + indices[i]);
                    }
                    newMatrix.set(j - startRow, i, this.get(j, indices[i]));
                }
            }
            return newMatrix;
        }

        /**
         * Set a part of the matrix to the given sub-matrix
         * @param {Matrix|Array< Array >} matrix - The source matrix from which to extract values.
         * @param {number} startRow - The index of the first row to set
         * @param {number} startColumn - The index of the first column to set
         * @return {Matrix}
         */
        setSubMatrix(matrix, startRow, startColumn) {
            matrix = this.constructor.checkMatrix(matrix);
            var endRow = startRow + matrix.rows - 1;
            var endColumn = startColumn + matrix.columns - 1;
            util.checkRange(this, startRow, endRow, startColumn, endColumn);
            for (var i = 0; i < matrix.rows; i++) {
                for (var j = 0; j < matrix.columns; j++) {
                    this[startRow + i][startColumn + j] = matrix.get(i, j);
                }
            }
            return this;
        }

        /**
         * Return a new matrix based on a selection of rows and columns
         * @param {Array<number>} rowIndices - The row indices to select. Order matters and an index can be more than once.
         * @param {Array<number>} columnIndices - The column indices to select. Order matters and an index can be use more than once.
         * @return {Matrix} The new matrix
         */
        selection(rowIndices, columnIndices) {
            var indices = util.checkIndices(this, rowIndices, columnIndices);
            var newMatrix = new this.constructor[Symbol.species](rowIndices.length, columnIndices.length);
            for (var i = 0; i < indices.row.length; i++) {
                var rowIndex = indices.row[i];
                for (var j = 0; j < indices.column.length; j++) {
                    var columnIndex = indices.column[j];
                    newMatrix[i][j] = this.get(rowIndex, columnIndex);
                }
            }
            return newMatrix;
        }

        /**
         * Returns the trace of the matrix (sum of the diagonal elements)
         * @return {number}
         */
        trace() {
            var min = Math.min(this.rows, this.columns);
            var trace = 0;
            for (var i = 0; i < min; i++) {
                trace += this.get(i, i);
            }
            return trace;
        }

        /*
         Matrix views
         */

        /**
         * Returns a view of the transposition of the matrix
         * @return {MatrixTransposeView}
         */
        transposeView() {
            return new MatrixTransposeView(this);
        }

        /**
         * Returns a view of the row vector with the given index
         * @param {number} row - row index of the vector
         * @return {MatrixRowView}
         */
        rowView(row) {
            util.checkRowIndex(this, row);
            return new MatrixRowView(this, row);
        }

        /**
         * Returns a view of the column vector with the given index
         * @param {number} column - column index of the vector
         * @return {MatrixColumnView}
         */
        columnView(column) {
            util.checkColumnIndex(this, column);
            return new MatrixColumnView(this, column);
        }

        /**
         * Returns a view of the matrix flipped in the row axis
         * @return {MatrixFlipRowView}
         */
        flipRowView() {
            return new MatrixFlipRowView(this);
        }

        /**
         * Returns a view of the matrix flipped in the column axis
         * @return {MatrixFlipColumnView}
         */
        flipColumnView() {
            return new MatrixFlipColumnView(this);
        }

        /**
         * Returns a view of a submatrix giving the index boundaries
         * @param {number} startRow - first row index of the submatrix
         * @param {number} endRow - last row index of the submatrix
         * @param {number} startColumn - first column index of the submatrix
         * @param {number} endColumn - last column index of the submatrix
         * @return {MatrixSubView}
         */
        subMatrixView(startRow, endRow, startColumn, endColumn) {
            return new MatrixSubView(this, startRow, endRow, startColumn, endColumn);
        }

        /**
         * Returns a view of the cross of the row indices and the column indices
         * @example
         * // resulting vector is [[2], [2]]
         * var matrix = new Matrix([[1,2,3], [4,5,6]]).selectionView([0, 0], [1])
         * @param {Array<number>} rowIndices
         * @param {Array<number>} columnIndices
         * @return {MatrixSelectionView}
         */
        selectionView(rowIndices, columnIndices) {
            return new MatrixSelectionView(this, rowIndices, columnIndices);
        }


        /**
        * Calculates and returns the determinant of a matrix as a Number
        * @example
        *   new Matrix([[1,2,3], [4,5,6]]).det()
        * @return {number}
        */
        det() {
            if (this.isSquare()) {
                var a, b, c, d;
                if (this.columns === 2) {
                    // 2 x 2 matrix
                    a = this.get(0, 0);
                    b = this.get(0, 1);
                    c = this.get(1, 0);
                    d = this.get(1, 1);

                    return a * d - (b * c);
                } else if (this.columns === 3) {
                    // 3 x 3 matrix
                    var subMatrix0, subMatrix1, subMatrix2;
                    subMatrix0 = this.selectionView([1, 2], [1, 2]);
                    subMatrix1 = this.selectionView([1, 2], [0, 2]);
                    subMatrix2 = this.selectionView([1, 2], [0, 1]);
                    a = this.get(0, 0);
                    b = this.get(0, 1);
                    c = this.get(0, 2);

                    return a * subMatrix0.det() - b * subMatrix1.det() + c * subMatrix2.det();
                } else {
                    // general purpose determinant using the LU decomposition
                    return new LuDecomposition(this).determinant;
                }

            } else {
                throw Error('Determinant can only be calculated for a square matrix.');
            }
        }

        /**
         * Returns inverse of a matrix if it exists or the pseudoinverse
         * @param {number} threshold - threshold for taking inverse of singular values (default = 1e-15)
         * @return {Matrix} the (pseudo)inverted matrix.
         */
        pseudoInverse(threshold) {
            if (threshold === undefined) threshold = Number.EPSILON;
            var svdSolution = new SvDecomposition(this, {autoTranspose: true});

            var U = svdSolution.leftSingularVectors;
            var V = svdSolution.rightSingularVectors;
            var s = svdSolution.diagonal;

            for (var i = 0; i < s.length; i++) {
                if (Math.abs(s[i]) > threshold) {
                    s[i] = 1.0 / s[i];
                } else {
                    s[i] = 0.0;
                }
            }

            // convert list to diagonal
            s = this.constructor[Symbol.species].diag(s);
            return V.mmul(s.mmul(U.transposeView()));
        }
    }

    Matrix.prototype.klass = 'Matrix';

    /**
     * @private
     * Check that two matrices have the same dimensions
     * @param {Matrix} matrix
     * @param {Matrix} otherMatrix
     */
    function checkDimensions(matrix, otherMatrix) { // eslint-disable-line no-unused-vars
        if (matrix.rows !== otherMatrix.rows ||
            matrix.columns !== otherMatrix.columns) {
            throw new RangeError('Matrices dimensions must be equal');
        }
    }

    function compareNumbers(a, b) {
        return a - b;
    }

    /*
     Synonyms
     */

    Matrix.random = Matrix.rand;
    Matrix.diagonal = Matrix.diag;
    Matrix.prototype.diagonal = Matrix.prototype.diag;
    Matrix.identity = Matrix.eye;
    Matrix.prototype.negate = Matrix.prototype.neg;
    Matrix.prototype.tensorProduct = Matrix.prototype.kroneckerProduct;
    Matrix.prototype.determinant = Matrix.prototype.det;

    /*
     Add dynamically instance and static methods for mathematical operations
     */

    var inplaceOperator = `
(function %name%(value) {
    if (typeof value === 'number') return this.%name%S(value);
    return this.%name%M(value);
})
`;

    var inplaceOperatorScalar = `
(function %name%S(value) {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) %op% value);
        }
    }
    return this;
})
`;

    var inplaceOperatorMatrix = `
(function %name%M(matrix) {
    matrix = this.constructor.checkMatrix(matrix);
    checkDimensions(this, matrix);
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, this.get(i, j) %op% matrix.get(i, j));
        }
    }
    return this;
})
`;

    var staticOperator = `
(function %name%(matrix, value) {
    var newMatrix = new this[Symbol.species](matrix);
    return newMatrix.%name%(value);
})
`;

    var inplaceMethod = `
(function %name%() {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, %method%(this.get(i, j)));
        }
    }
    return this;
})
`;

    var staticMethod = `
(function %name%(matrix) {
    var newMatrix = new this[Symbol.species](matrix);
    return newMatrix.%name%();
})
`;

    var inplaceMethodWithArgs = `
(function %name%(%args%) {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, %method%(this.get(i, j), %args%));
        }
    }
    return this;
})
`;

    var staticMethodWithArgs = `
(function %name%(matrix, %args%) {
    var newMatrix = new this[Symbol.species](matrix);
    return newMatrix.%name%(%args%);
})
`;


    var inplaceMethodWithOneArgScalar = `
(function %name%S(value) {
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, %method%(this.get(i, j), value));
        }
    }
    return this;
})
`;
    var inplaceMethodWithOneArgMatrix = `
(function %name%M(matrix) {
    matrix = this.constructor.checkMatrix(matrix);
    checkDimensions(this, matrix);
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            this.set(i, j, %method%(this.get(i, j), matrix.get(i, j)));
        }
    }
    return this;
})
`;

    var inplaceMethodWithOneArg = `
(function %name%(value) {
    if (typeof value === 'number') return this.%name%S(value);
    return this.%name%M(value);
})
`;

    var staticMethodWithOneArg = staticMethodWithArgs;

    var operators = [
        // Arithmetic operators
        ['+', 'add'],
        ['-', 'sub', 'subtract'],
        ['*', 'mul', 'multiply'],
        ['/', 'div', 'divide'],
        ['%', 'mod', 'modulus'],
        // Bitwise operators
        ['&', 'and'],
        ['|', 'or'],
        ['^', 'xor'],
        ['<<', 'leftShift'],
        ['>>', 'signPropagatingRightShift'],
        ['>>>', 'rightShift', 'zeroFillRightShift']
    ];

    var i;

    for (var operator of operators) {
        var inplaceOp = eval(fillTemplateFunction(inplaceOperator, {name: operator[1], op: operator[0]}));
        var inplaceOpS = eval(fillTemplateFunction(inplaceOperatorScalar, {name: operator[1] + 'S', op: operator[0]}));
        var inplaceOpM = eval(fillTemplateFunction(inplaceOperatorMatrix, {name: operator[1] + 'M', op: operator[0]}));
        var staticOp = eval(fillTemplateFunction(staticOperator, {name: operator[1]}));
        for (i = 1; i < operator.length; i++) {
            Matrix.prototype[operator[i]] = inplaceOp;
            Matrix.prototype[operator[i] + 'S'] = inplaceOpS;
            Matrix.prototype[operator[i] + 'M'] = inplaceOpM;
            Matrix[operator[i]] = staticOp;
        }
    }

    var methods = [
        ['~', 'not']
    ];

    [
        'abs', 'acos', 'acosh', 'asin', 'asinh', 'atan', 'atanh', 'cbrt', 'ceil',
        'clz32', 'cos', 'cosh', 'exp', 'expm1', 'floor', 'fround', 'log', 'log1p',
        'log10', 'log2', 'round', 'sign', 'sin', 'sinh', 'sqrt', 'tan', 'tanh', 'trunc'
    ].forEach(function (mathMethod) {
        methods.push(['Math.' + mathMethod, mathMethod]);
    });

    for (var method of methods) {
        var inplaceMeth = eval(fillTemplateFunction(inplaceMethod, {name: method[1], method: method[0]}));
        var staticMeth = eval(fillTemplateFunction(staticMethod, {name: method[1]}));
        for (i = 1; i < method.length; i++) {
            Matrix.prototype[method[i]] = inplaceMeth;
            Matrix[method[i]] = staticMeth;
        }
    }

    var methodsWithArgs = [
        ['Math.pow', 1, 'pow']
    ];

    for (var methodWithArg of methodsWithArgs) {
        var args = 'arg0';
        for (i = 1; i < methodWithArg[1]; i++) {
            args += `, arg${i}`;
        }
        if (methodWithArg[1] !== 1) {
            var inplaceMethWithArgs = eval(fillTemplateFunction(inplaceMethodWithArgs, {
                name: methodWithArg[2],
                method: methodWithArg[0],
                args: args
            }));
            var staticMethWithArgs = eval(fillTemplateFunction(staticMethodWithArgs, {name: methodWithArg[2], args: args}));
            for (i = 2; i < methodWithArg.length; i++) {
                Matrix.prototype[methodWithArg[i]] = inplaceMethWithArgs;
                Matrix[methodWithArg[i]] = staticMethWithArgs;
            }
        } else {
            var tmplVar = {
                name: methodWithArg[2],
                args: args,
                method: methodWithArg[0]
            };
            var inplaceMethod2 = eval(fillTemplateFunction(inplaceMethodWithOneArg, tmplVar));
            var inplaceMethodS = eval(fillTemplateFunction(inplaceMethodWithOneArgScalar, tmplVar));
            var inplaceMethodM = eval(fillTemplateFunction(inplaceMethodWithOneArgMatrix, tmplVar));
            var staticMethod2 = eval(fillTemplateFunction(staticMethodWithOneArg, tmplVar));
            for (i = 2; i < methodWithArg.length; i++) {
                Matrix.prototype[methodWithArg[i]] = inplaceMethod2;
                Matrix.prototype[methodWithArg[i] + 'M'] = inplaceMethodM;
                Matrix.prototype[methodWithArg[i] + 'S'] = inplaceMethodS;
                Matrix[methodWithArg[i]] = staticMethod2;
            }
        }
    }

    function fillTemplateFunction(template, values) {
        for (var value in values) {
            template = template.replace(new RegExp('%' + value + '%', 'g'), values[value]);
        }
        return template;
    }

    return Matrix;
}


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(0);

// https://github.com/lutzroeder/Mapack/blob/master/Source/LuDecomposition.cs
function LuDecomposition(matrix) {
    if (!(this instanceof LuDecomposition)) {
        return new LuDecomposition(matrix);
    }

    matrix = Matrix.Matrix.checkMatrix(matrix);

    var lu = matrix.clone(),
        rows = lu.rows,
        columns = lu.columns,
        pivotVector = new Array(rows),
        pivotSign = 1,
        i, j, k, p, s, t, v,
        LUrowi, LUcolj, kmax;

    for (i = 0; i < rows; i++) {
        pivotVector[i] = i;
    }

    LUcolj = new Array(rows);

    for (j = 0; j < columns; j++) {

        for (i = 0; i < rows; i++) {
            LUcolj[i] = lu[i][j];
        }

        for (i = 0; i < rows; i++) {
            LUrowi = lu[i];
            kmax = Math.min(i, j);
            s = 0;
            for (k = 0; k < kmax; k++) {
                s += LUrowi[k] * LUcolj[k];
            }
            LUrowi[j] = LUcolj[i] -= s;
        }

        p = j;
        for (i = j + 1; i < rows; i++) {
            if (Math.abs(LUcolj[i]) > Math.abs(LUcolj[p])) {
                p = i;
            }
        }

        if (p !== j) {
            for (k = 0; k < columns; k++) {
                t = lu[p][k];
                lu[p][k] = lu[j][k];
                lu[j][k] = t;
            }

            v = pivotVector[p];
            pivotVector[p] = pivotVector[j];
            pivotVector[j] = v;

            pivotSign = -pivotSign;
        }

        if (j < rows && lu[j][j] !== 0) {
            for (i = j + 1; i < rows; i++) {
                lu[i][j] /= lu[j][j];
            }
        }
    }

    this.LU = lu;
    this.pivotVector = pivotVector;
    this.pivotSign = pivotSign;
}

LuDecomposition.prototype = {
    isSingular: function () {
        var data = this.LU,
            col = data.columns;
        for (var j = 0; j < col; j++) {
            if (data[j][j] === 0) {
                return true;
            }
        }
        return false;
    },
    get determinant() {
        var data = this.LU;
        if (!data.isSquare()) {
            throw new Error('Matrix must be square');
        }
        var determinant = this.pivotSign, col = data.columns;
        for (var j = 0; j < col; j++) {
            determinant *= data[j][j];
        }
        return determinant;
    },
    get lowerTriangularMatrix() {
        var data = this.LU,
            rows = data.rows,
            columns = data.columns,
            X = new Matrix.Matrix(rows, columns);
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++) {
                if (i > j) {
                    X[i][j] = data[i][j];
                } else if (i === j) {
                    X[i][j] = 1;
                } else {
                    X[i][j] = 0;
                }
            }
        }
        return X;
    },
    get upperTriangularMatrix() {
        var data = this.LU,
            rows = data.rows,
            columns = data.columns,
            X = new Matrix.Matrix(rows, columns);
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < columns; j++) {
                if (i <= j) {
                    X[i][j] = data[i][j];
                } else {
                    X[i][j] = 0;
                }
            }
        }
        return X;
    },
    get pivotPermutationVector() {
        return this.pivotVector.slice();
    },
    solve: function (value) {
        value = Matrix.Matrix.checkMatrix(value);

        var lu = this.LU,
            rows = lu.rows;

        if (rows !== value.rows) {
            throw new Error('Invalid matrix dimensions');
        }
        if (this.isSingular()) {
            throw new Error('LU matrix is singular');
        }

        var count = value.columns;
        var X = value.subMatrixRow(this.pivotVector, 0, count - 1);
        var columns = lu.columns;
        var i, j, k;

        for (k = 0; k < columns; k++) {
            for (i = k + 1; i < columns; i++) {
                for (j = 0; j < count; j++) {
                    X[i][j] -= X[k][j] * lu[i][k];
                }
            }
        }
        for (k = columns - 1; k >= 0; k--) {
            for (j = 0; j < count; j++) {
                X[k][j] /= lu[k][k];
            }
            for (i = 0; i < k; i++) {
                for (j = 0; j < count; j++) {
                    X[i][j] -= X[k][j] * lu[i][k];
                }
            }
        }
        return X;
    }
};

module.exports = LuDecomposition;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(0);
var util = __webpack_require__(3);
var hypotenuse = util.hypotenuse;
var getFilled2DArray = util.getFilled2DArray;

// https://github.com/lutzroeder/Mapack/blob/master/Source/SingularValueDecomposition.cs
function SingularValueDecomposition(value, options) {
    if (!(this instanceof SingularValueDecomposition)) {
        return new SingularValueDecomposition(value, options);
    }
    value = Matrix.Matrix.checkMatrix(value);

    options = options || {};

    var m = value.rows,
        n = value.columns,
        nu = Math.min(m, n);

    var wantu = true, wantv = true;
    if (options.computeLeftSingularVectors === false) wantu = false;
    if (options.computeRightSingularVectors === false) wantv = false;
    var autoTranspose = options.autoTranspose === true;

    var swapped = false;
    var a;
    if (m < n) {
        if (!autoTranspose) {
            a = value.clone();
            // eslint-disable-next-line no-console
            console.warn('Computing SVD on a matrix with more columns than rows. Consider enabling autoTranspose');
        } else {
            a = value.transpose();
            m = a.rows;
            n = a.columns;
            swapped = true;
            var aux = wantu;
            wantu = wantv;
            wantv = aux;
        }
    } else {
        a = value.clone();
    }

    var s = new Array(Math.min(m + 1, n)),
        U = getFilled2DArray(m, nu, 0),
        V = getFilled2DArray(n, n, 0),
        e = new Array(n),
        work = new Array(m);

    var nct = Math.min(m - 1, n);
    var nrt = Math.max(0, Math.min(n - 2, m));

    var i, j, k, p, t, ks, f, cs, sn, max, kase,
        scale, sp, spm1, epm1, sk, ek, b, c, shift, g;

    for (k = 0, max = Math.max(nct, nrt); k < max; k++) {
        if (k < nct) {
            s[k] = 0;
            for (i = k; i < m; i++) {
                s[k] = hypotenuse(s[k], a[i][k]);
            }
            if (s[k] !== 0) {
                if (a[k][k] < 0) {
                    s[k] = -s[k];
                }
                for (i = k; i < m; i++) {
                    a[i][k] /= s[k];
                }
                a[k][k] += 1;
            }
            s[k] = -s[k];
        }

        for (j = k + 1; j < n; j++) {
            if ((k < nct) && (s[k] !== 0)) {
                t = 0;
                for (i = k; i < m; i++) {
                    t += a[i][k] * a[i][j];
                }
                t = -t / a[k][k];
                for (i = k; i < m; i++) {
                    a[i][j] += t * a[i][k];
                }
            }
            e[j] = a[k][j];
        }

        if (wantu && (k < nct)) {
            for (i = k; i < m; i++) {
                U[i][k] = a[i][k];
            }
        }

        if (k < nrt) {
            e[k] = 0;
            for (i = k + 1; i < n; i++) {
                e[k] = hypotenuse(e[k], e[i]);
            }
            if (e[k] !== 0) {
                if (e[k + 1] < 0) {
                    e[k] = 0 - e[k];
                }
                for (i = k + 1; i < n; i++) {
                    e[i] /= e[k];
                }
                e[k + 1] += 1;
            }
            e[k] = -e[k];
            if ((k + 1 < m) && (e[k] !== 0)) {
                for (i = k + 1; i < m; i++) {
                    work[i] = 0;
                }
                for (j = k + 1; j < n; j++) {
                    for (i = k + 1; i < m; i++) {
                        work[i] += e[j] * a[i][j];
                    }
                }
                for (j = k + 1; j < n; j++) {
                    t = -e[j] / e[k + 1];
                    for (i = k + 1; i < m; i++) {
                        a[i][j] += t * work[i];
                    }
                }
            }
            if (wantv) {
                for (i = k + 1; i < n; i++) {
                    V[i][k] = e[i];
                }
            }
        }
    }

    p = Math.min(n, m + 1);
    if (nct < n) {
        s[nct] = a[nct][nct];
    }
    if (m < p) {
        s[p - 1] = 0;
    }
    if (nrt + 1 < p) {
        e[nrt] = a[nrt][p - 1];
    }
    e[p - 1] = 0;

    if (wantu) {
        for (j = nct; j < nu; j++) {
            for (i = 0; i < m; i++) {
                U[i][j] = 0;
            }
            U[j][j] = 1;
        }
        for (k = nct - 1; k >= 0; k--) {
            if (s[k] !== 0) {
                for (j = k + 1; j < nu; j++) {
                    t = 0;
                    for (i = k; i < m; i++) {
                        t += U[i][k] * U[i][j];
                    }
                    t = -t / U[k][k];
                    for (i = k; i < m; i++) {
                        U[i][j] += t * U[i][k];
                    }
                }
                for (i = k; i < m; i++) {
                    U[i][k] = -U[i][k];
                }
                U[k][k] = 1 + U[k][k];
                for (i = 0; i < k - 1; i++) {
                    U[i][k] = 0;
                }
            } else {
                for (i = 0; i < m; i++) {
                    U[i][k] = 0;
                }
                U[k][k] = 1;
            }
        }
    }

    if (wantv) {
        for (k = n - 1; k >= 0; k--) {
            if ((k < nrt) && (e[k] !== 0)) {
                for (j = k + 1; j < n; j++) {
                    t = 0;
                    for (i = k + 1; i < n; i++) {
                        t += V[i][k] * V[i][j];
                    }
                    t = -t / V[k + 1][k];
                    for (i = k + 1; i < n; i++) {
                        V[i][j] += t * V[i][k];
                    }
                }
            }
            for (i = 0; i < n; i++) {
                V[i][k] = 0;
            }
            V[k][k] = 1;
        }
    }

    var pp = p - 1,
        iter = 0,
        eps = Math.pow(2, -52);
    while (p > 0) {
        for (k = p - 2; k >= -1; k--) {
            if (k === -1) {
                break;
            }
            if (Math.abs(e[k]) <= eps * (Math.abs(s[k]) + Math.abs(s[k + 1]))) {
                e[k] = 0;
                break;
            }
        }
        if (k === p - 2) {
            kase = 4;
        } else {
            for (ks = p - 1; ks >= k; ks--) {
                if (ks === k) {
                    break;
                }
                t = (ks !== p ? Math.abs(e[ks]) : 0) + (ks !== k + 1 ? Math.abs(e[ks - 1]) : 0);
                if (Math.abs(s[ks]) <= eps * t) {
                    s[ks] = 0;
                    break;
                }
            }
            if (ks === k) {
                kase = 3;
            } else if (ks === p - 1) {
                kase = 1;
            } else {
                kase = 2;
                k = ks;
            }
        }

        k++;

        switch (kase) {
            case 1: {
                f = e[p - 2];
                e[p - 2] = 0;
                for (j = p - 2; j >= k; j--) {
                    t = hypotenuse(s[j], f);
                    cs = s[j] / t;
                    sn = f / t;
                    s[j] = t;
                    if (j !== k) {
                        f = -sn * e[j - 1];
                        e[j - 1] = cs * e[j - 1];
                    }
                    if (wantv) {
                        for (i = 0; i < n; i++) {
                            t = cs * V[i][j] + sn * V[i][p - 1];
                            V[i][p - 1] = -sn * V[i][j] + cs * V[i][p - 1];
                            V[i][j] = t;
                        }
                    }
                }
                break;
            }
            case 2 : {
                f = e[k - 1];
                e[k - 1] = 0;
                for (j = k; j < p; j++) {
                    t = hypotenuse(s[j], f);
                    cs = s[j] / t;
                    sn = f / t;
                    s[j] = t;
                    f = -sn * e[j];
                    e[j] = cs * e[j];
                    if (wantu) {
                        for (i = 0; i < m; i++) {
                            t = cs * U[i][j] + sn * U[i][k - 1];
                            U[i][k - 1] = -sn * U[i][j] + cs * U[i][k - 1];
                            U[i][j] = t;
                        }
                    }
                }
                break;
            }
            case 3 : {
                scale = Math.max(Math.max(Math.max(Math.max(Math.abs(s[p - 1]), Math.abs(s[p - 2])), Math.abs(e[p - 2])), Math.abs(s[k])), Math.abs(e[k]));
                sp = s[p - 1] / scale;
                spm1 = s[p - 2] / scale;
                epm1 = e[p - 2] / scale;
                sk = s[k] / scale;
                ek = e[k] / scale;
                b = ((spm1 + sp) * (spm1 - sp) + epm1 * epm1) / 2;
                c = (sp * epm1) * (sp * epm1);
                shift = 0;
                if ((b !== 0) || (c !== 0)) {
                    shift = Math.sqrt(b * b + c);
                    if (b < 0) {
                        shift = -shift;
                    }
                    shift = c / (b + shift);
                }
                f = (sk + sp) * (sk - sp) + shift;
                g = sk * ek;
                for (j = k; j < p - 1; j++) {
                    t = hypotenuse(f, g);
                    cs = f / t;
                    sn = g / t;
                    if (j !== k) {
                        e[j - 1] = t;
                    }
                    f = cs * s[j] + sn * e[j];
                    e[j] = cs * e[j] - sn * s[j];
                    g = sn * s[j + 1];
                    s[j + 1] = cs * s[j + 1];
                    if (wantv) {
                        for (i = 0; i < n; i++) {
                            t = cs * V[i][j] + sn * V[i][j + 1];
                            V[i][j + 1] = -sn * V[i][j] + cs * V[i][j + 1];
                            V[i][j] = t;
                        }
                    }
                    t = hypotenuse(f, g);
                    cs = f / t;
                    sn = g / t;
                    s[j] = t;
                    f = cs * e[j] + sn * s[j + 1];
                    s[j + 1] = -sn * e[j] + cs * s[j + 1];
                    g = sn * e[j + 1];
                    e[j + 1] = cs * e[j + 1];
                    if (wantu && (j < m - 1)) {
                        for (i = 0; i < m; i++) {
                            t = cs * U[i][j] + sn * U[i][j + 1];
                            U[i][j + 1] = -sn * U[i][j] + cs * U[i][j + 1];
                            U[i][j] = t;
                        }
                    }
                }
                e[p - 2] = f;
                iter = iter + 1;
                break;
            }
            case 4: {
                if (s[k] <= 0) {
                    s[k] = (s[k] < 0 ? -s[k] : 0);
                    if (wantv) {
                        for (i = 0; i <= pp; i++) {
                            V[i][k] = -V[i][k];
                        }
                    }
                }
                while (k < pp) {
                    if (s[k] >= s[k + 1]) {
                        break;
                    }
                    t = s[k];
                    s[k] = s[k + 1];
                    s[k + 1] = t;
                    if (wantv && (k < n - 1)) {
                        for (i = 0; i < n; i++) {
                            t = V[i][k + 1];
                            V[i][k + 1] = V[i][k];
                            V[i][k] = t;
                        }
                    }
                    if (wantu && (k < m - 1)) {
                        for (i = 0; i < m; i++) {
                            t = U[i][k + 1];
                            U[i][k + 1] = U[i][k];
                            U[i][k] = t;
                        }
                    }
                    k++;
                }
                iter = 0;
                p--;
                break;
            }
            // no default
        }
    }

    if (swapped) {
        var tmp = V;
        V = U;
        U = tmp;
    }

    this.m = m;
    this.n = n;
    this.s = s;
    this.U = U;
    this.V = V;
}

SingularValueDecomposition.prototype = {
    get condition() {
        return this.s[0] / this.s[Math.min(this.m, this.n) - 1];
    },
    get norm2() {
        return this.s[0];
    },
    get rank() {
        var eps = Math.pow(2, -52),
            tol = Math.max(this.m, this.n) * this.s[0] * eps,
            r = 0,
            s = this.s;
        for (var i = 0, ii = s.length; i < ii; i++) {
            if (s[i] > tol) {
                r++;
            }
        }
        return r;
    },
    get diagonal() {
        return this.s;
    },
    // https://github.com/accord-net/framework/blob/development/Sources/Accord.Math/Decompositions/SingularValueDecomposition.cs
    get threshold() {
        return (Math.pow(2, -52) / 2) * Math.max(this.m, this.n) * this.s[0];
    },
    get leftSingularVectors() {
        if (!Matrix.Matrix.isMatrix(this.U)) {
            this.U = new Matrix.Matrix(this.U);
        }
        return this.U;
    },
    get rightSingularVectors() {
        if (!Matrix.Matrix.isMatrix(this.V)) {
            this.V = new Matrix.Matrix(this.V);
        }
        return this.V;
    },
    get diagonalMatrix() {
        return Matrix.Matrix.diag(this.s);
    },
    solve: function (value) {

        var Y = value,
            e = this.threshold,
            scols = this.s.length,
            Ls = Matrix.Matrix.zeros(scols, scols),
            i;

        for (i = 0; i < scols; i++) {
            if (Math.abs(this.s[i]) <= e) {
                Ls[i][i] = 0;
            } else {
                Ls[i][i] = 1 / this.s[i];
            }
        }

        var U = this.U;
        var V = this.rightSingularVectors;

        var VL = V.mmul(Ls),
            vrows = V.rows,
            urows = U.length,
            VLU = Matrix.Matrix.zeros(vrows, urows),
            j, k, sum;

        for (i = 0; i < vrows; i++) {
            for (j = 0; j < urows; j++) {
                sum = 0;
                for (k = 0; k < scols; k++) {
                    sum += VL[i][k] * U[j][k];
                }
                VLU[i][j] = sum;
            }
        }

        return VLU.mmul(Y);
    },
    solveForDiagonal: function (value) {
        return this.solve(Matrix.Matrix.diag(value));
    },
    inverse: function () {
        var V = this.V;
        var e = this.threshold,
            vrows = V.length,
            vcols = V[0].length,
            X = new Matrix.Matrix(vrows, this.s.length),
            i, j;

        for (i = 0; i < vrows; i++) {
            for (j = 0; j < vcols; j++) {
                if (Math.abs(this.s[j]) > e) {
                    X[i][j] = V[i][j] / this.s[j];
                } else {
                    X[i][j] = 0;
                }
            }
        }

        var U = this.U;

        var urows = U.length,
            ucols = U[0].length,
            Y = new Matrix.Matrix(vrows, urows),
            k, sum;

        for (i = 0; i < vrows; i++) {
            for (j = 0; j < urows; j++) {
                sum = 0;
                for (k = 0; k < ucols; k++) {
                    sum += X[i][k] * U[j][k];
                }
                Y[i][j] = sum;
            }
        }

        return Y;
    }
};

module.exports = SingularValueDecomposition;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function compareNumbers(a, b) {
    return a - b;
}

/**
 * Computes the sum of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.sum = function sum(values) {
    var sum = 0;
    for (var i = 0; i < values.length; i++) {
        sum += values[i];
    }
    return sum;
};

/**
 * Computes the maximum of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.max = function max(values) {
    var max = values[0];
    var l = values.length;
    for (var i = 1; i < l; i++) {
        if (values[i] > max) max = values[i];
    }
    return max;
};

/**
 * Computes the minimum of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.min = function min(values) {
    var min = values[0];
    var l = values.length;
    for (var i = 1; i < l; i++) {
        if (values[i] < min) min = values[i];
    }
    return min;
};

/**
 * Computes the min and max of the given values
 * @param {Array} values
 * @returns {{min: number, max: number}}
 */
exports.minMax = function minMax(values) {
    var min = values[0];
    var max = values[0];
    var l = values.length;
    for (var i = 1; i < l; i++) {
        if (values[i] < min) min = values[i];
        if (values[i] > max) max = values[i];
    }
    return {
        min: min,
        max: max
    };
};

/**
 * Computes the arithmetic mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.arithmeticMean = function arithmeticMean(values) {
    var sum = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        sum += values[i];
    }
    return sum / l;
};

/**
 * {@link arithmeticMean}
 */
exports.mean = exports.arithmeticMean;

/**
 * Computes the geometric mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.geometricMean = function geometricMean(values) {
    var mul = 1;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        mul *= values[i];
    }
    return Math.pow(mul, 1 / l);
};

/**
 * Computes the mean of the log of the given values
 * If the return value is exponentiated, it gives the same result as the
 * geometric mean.
 * @param {Array} values
 * @returns {number}
 */
exports.logMean = function logMean(values) {
    var lnsum = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        lnsum += Math.log(values[i]);
    }
    return lnsum / l;
};

/**
 * Computes the weighted grand mean for a list of means and sample sizes
 * @param {Array} means - Mean values for each set of samples
 * @param {Array} samples - Number of original values for each set of samples
 * @returns {number}
 */
exports.grandMean = function grandMean(means, samples) {
    var sum = 0;
    var n = 0;
    var l = means.length;
    for (var i = 0; i < l; i++) {
        sum += samples[i] * means[i];
        n += samples[i];
    }
    return sum / n;
};

/**
 * Computes the truncated mean of the given values using a given percentage
 * @param {Array} values
 * @param {number} percent - The percentage of values to keep (range: [0,1])
 * @param {boolean} [alreadySorted=false]
 * @returns {number}
 */
exports.truncatedMean = function truncatedMean(values, percent, alreadySorted) {
    if (alreadySorted === undefined) alreadySorted = false;
    if (!alreadySorted) {
        values = [].concat(values).sort(compareNumbers);
    }
    var l = values.length;
    var k = Math.floor(l * percent);
    var sum = 0;
    for (var i = k; i < (l - k); i++) {
        sum += values[i];
    }
    return sum / (l - 2 * k);
};

/**
 * Computes the harmonic mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.harmonicMean = function harmonicMean(values) {
    var sum = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        if (values[i] === 0) {
            throw new RangeError('value at index ' + i + 'is zero');
        }
        sum += 1 / values[i];
    }
    return l / sum;
};

/**
 * Computes the contraharmonic mean of the given values
 * @param {Array} values
 * @returns {number}
 */
exports.contraHarmonicMean = function contraHarmonicMean(values) {
    var r1 = 0;
    var r2 = 0;
    var l = values.length;
    for (var i = 0; i < l; i++) {
        r1 += values[i] * values[i];
        r2 += values[i];
    }
    if (r2 < 0) {
        throw new RangeError('sum of values is negative');
    }
    return r1 / r2;
};

/**
 * Computes the median of the given values
 * @param {Array} values
 * @param {boolean} [alreadySorted=false]
 * @returns {number}
 */
exports.median = function median(values, alreadySorted) {
    if (alreadySorted === undefined) alreadySorted = false;
    if (!alreadySorted) {
        values = [].concat(values).sort(compareNumbers);
    }
    var l = values.length;
    var half = Math.floor(l / 2);
    if (l % 2 === 0) {
        return (values[half - 1] + values[half]) * 0.5;
    } else {
        return values[half];
    }
};

/**
 * Computes the variance of the given values
 * @param {Array} values
 * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
 * @returns {number}
 */
exports.variance = function variance(values, unbiased) {
    if (unbiased === undefined) unbiased = true;
    var theMean = exports.mean(values);
    var theVariance = 0;
    var l = values.length;

    for (var i = 0; i < l; i++) {
        var x = values[i] - theMean;
        theVariance += x * x;
    }

    if (unbiased) {
        return theVariance / (l - 1);
    } else {
        return theVariance / l;
    }
};

/**
 * Computes the standard deviation of the given values
 * @param {Array} values
 * @param {boolean} [unbiased=true] - if true, divide by (n-1); if false, divide by n.
 * @returns {number}
 */
exports.standardDeviation = function standardDeviation(values, unbiased) {
    return Math.sqrt(exports.variance(values, unbiased));
};

exports.standardError = function standardError(values) {
    return exports.standardDeviation(values) / Math.sqrt(values.length);
};

/**
 * IEEE Transactions on biomedical engineering, vol. 52, no. 1, january 2005, p. 76-
 * Calculate the standard deviation via the Median of the absolute deviation
 *  The formula for the standard deviation only holds for Gaussian random variables.
 * @returns {{mean: number, stdev: number}}
 */
exports.robustMeanAndStdev = function robustMeanAndStdev(y) {
    var mean = 0, stdev = 0;
    var length = y.length, i = 0;
    for (i = 0; i < length; i++) {
        mean += y[i];
    }
    mean /= length;
    var averageDeviations = new Array(length);
    for (i = 0; i < length; i++)
        averageDeviations[i] = Math.abs(y[i] - mean);
    averageDeviations.sort(compareNumbers);
    if (length % 2 === 1) {
        stdev = averageDeviations[(length - 1) / 2] / 0.6745;
    } else {
        stdev = 0.5 * (averageDeviations[length / 2] + averageDeviations[length / 2 - 1]) / 0.6745;
    }

    return {
        mean: mean,
        stdev: stdev
    };
};

exports.quartiles = function quartiles(values, alreadySorted) {
    if (typeof (alreadySorted) === 'undefined') alreadySorted = false;
    if (!alreadySorted) {
        values = [].concat(values).sort(compareNumbers);
    }

    var quart = values.length / 4;
    var q1 = values[Math.ceil(quart) - 1];
    var q2 = exports.median(values, true);
    var q3 = values[Math.ceil(quart * 3) - 1];

    return {q1: q1, q2: q2, q3: q3};
};

exports.pooledStandardDeviation = function pooledStandardDeviation(samples, unbiased) {
    return Math.sqrt(exports.pooledVariance(samples, unbiased));
};

exports.pooledVariance = function pooledVariance(samples, unbiased) {
    if (typeof (unbiased) === 'undefined') unbiased = true;
    var sum = 0;
    var length = 0, l = samples.length;
    for (var i = 0; i < l; i++) {
        var values = samples[i];
        var vari = exports.variance(values);

        sum += (values.length - 1) * vari;

        if (unbiased)
            length += values.length - 1;
        else
            length += values.length;
    }
    return sum / length;
};

exports.mode = function mode(values) {
    var l = values.length,
        itemCount = new Array(l),
        i;
    for (i = 0; i < l; i++) {
        itemCount[i] = 0;
    }
    var itemArray = new Array(l);
    var count = 0;

    for (i = 0; i < l; i++) {
        var index = itemArray.indexOf(values[i]);
        if (index >= 0)
            itemCount[index]++;
        else {
            itemArray[count] = values[i];
            itemCount[count] = 1;
            count++;
        }
    }

    var maxValue = 0, maxIndex = 0;
    for (i = 0; i < count; i++) {
        if (itemCount[i] > maxValue) {
            maxValue = itemCount[i];
            maxIndex = i;
        }
    }

    return itemArray[maxIndex];
};

exports.covariance = function covariance(vector1, vector2, unbiased) {
    if (typeof (unbiased) === 'undefined') unbiased = true;
    var mean1 = exports.mean(vector1);
    var mean2 = exports.mean(vector2);

    if (vector1.length !== vector2.length)
        throw 'Vectors do not have the same dimensions';

    var cov = 0, l = vector1.length;
    for (var i = 0; i < l; i++) {
        var x = vector1[i] - mean1;
        var y = vector2[i] - mean2;
        cov += x * y;
    }

    if (unbiased)
        return cov / (l - 1);
    else
        return cov / l;
};

exports.skewness = function skewness(values, unbiased) {
    if (typeof (unbiased) === 'undefined') unbiased = true;
    var theMean = exports.mean(values);

    var s2 = 0, s3 = 0, l = values.length;
    for (var i = 0; i < l; i++) {
        var dev = values[i] - theMean;
        s2 += dev * dev;
        s3 += dev * dev * dev;
    }
    var m2 = s2 / l;
    var m3 = s3 / l;

    var g = m3 / (Math.pow(m2, 3 / 2.0));
    if (unbiased) {
        var a = Math.sqrt(l * (l - 1));
        var b = l - 2;
        return (a / b) * g;
    } else {
        return g;
    }
};

exports.kurtosis = function kurtosis(values, unbiased) {
    if (typeof (unbiased) === 'undefined') unbiased = true;
    var theMean = exports.mean(values);
    var n = values.length, s2 = 0, s4 = 0;

    for (var i = 0; i < n; i++) {
        var dev = values[i] - theMean;
        s2 += dev * dev;
        s4 += dev * dev * dev * dev;
    }
    var m2 = s2 / n;
    var m4 = s4 / n;

    if (unbiased) {
        var v = s2 / (n - 1);
        var a = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3));
        var b = s4 / (v * v);
        var c = ((n - 1) * (n - 1)) / ((n - 2) * (n - 3));

        return a * b - 3 * c;
    } else {
        return m4 / (m2 * m2) - 3;
    }
};

exports.entropy = function entropy(values, eps) {
    if (typeof (eps) === 'undefined') eps = 0;
    var sum = 0, l = values.length;
    for (var i = 0; i < l; i++)
        sum += values[i] * Math.log(values[i] + eps);
    return -sum;
};

exports.weightedMean = function weightedMean(values, weights) {
    var sum = 0, l = values.length;
    for (var i = 0; i < l; i++)
        sum += values[i] * weights[i];
    return sum;
};

exports.weightedStandardDeviation = function weightedStandardDeviation(values, weights) {
    return Math.sqrt(exports.weightedVariance(values, weights));
};

exports.weightedVariance = function weightedVariance(values, weights) {
    var theMean = exports.weightedMean(values, weights);
    var vari = 0, l = values.length;
    var a = 0, b = 0;

    for (var i = 0; i < l; i++) {
        var z = values[i] - theMean;
        var w = weights[i];

        vari += w * (z * z);
        b += w;
        a += w * w;
    }

    return vari * (b / (b * b - a));
};

exports.center = function center(values, inPlace) {
    if (typeof (inPlace) === 'undefined') inPlace = false;

    var result = values;
    if (!inPlace)
        result = [].concat(values);

    var theMean = exports.mean(result), l = result.length;
    for (var i = 0; i < l; i++)
        result[i] -= theMean;
};

exports.standardize = function standardize(values, standardDev, inPlace) {
    if (typeof (standardDev) === 'undefined') standardDev = exports.standardDeviation(values);
    if (typeof (inPlace) === 'undefined') inPlace = false;
    var l = values.length;
    var result = inPlace ? values : new Array(l);
    for (var i = 0; i < l; i++)
        result[i] = values[i] / standardDev;
    return result;
};

exports.cumulativeSum = function cumulativeSum(array) {
    var l = array.length;
    var result = new Array(l);
    result[0] = array[0];
    for (var i = 1; i < l; i++)
        result[i] = result[i - 1] + array[i];
    return result;
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.array = __webpack_require__(11);
exports.matrix = __webpack_require__(35);


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let OCLE;

module.exports = function getOcleFromOptions(options) {
    if (OCLE) return OCLE;
    if (options.OCLE) {
        return OCLE = options.OCLE;
    } else {
        return OCLE = __webpack_require__(42);
    }
};


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Root reference for iframes.
 */

var root;
if (typeof window !== 'undefined') { // Browser window
  root = window;
} else if (typeof self !== 'undefined') { // Web Worker
  root = self;
} else { // Other environments
  console.warn("Using browser-only version of superagent in non-browser environment");
  root = this;
}

var Emitter = __webpack_require__(18);
var RequestBase = __webpack_require__(73);
var isObject = __webpack_require__(6);
var isFunction = __webpack_require__(72);
var ResponseBase = __webpack_require__(74);
var shouldRetry = __webpack_require__(75);

/**
 * Noop.
 */

function noop(){};

/**
 * Expose `request`.
 */

var request = exports = module.exports = function(method, url) {
  // callback
  if ('function' == typeof url) {
    return new exports.Request('GET', method).end(url);
  }

  // url first
  if (1 == arguments.length) {
    return new exports.Request('GET', method);
  }

  return new exports.Request(method, url);
}

exports.Request = Request;

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest
      && (!root.location || 'file:' != root.location.protocol
          || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  throw Error("Browser-only verison of superagent could not find XHR");
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    pushEncodedKeyValuePair(pairs, key, obj[key]);
  }
  return pairs.join('&');
}

/**
 * Helps 'serialize' with serializing arrays.
 * Mutates the pairs array.
 *
 * @param {Array} pairs
 * @param {String} key
 * @param {Mixed} val
 */

function pushEncodedKeyValuePair(pairs, key, val) {
  if (val != null) {
    if (Array.isArray(val)) {
      val.forEach(function(v) {
        pushEncodedKeyValuePair(pairs, key, v);
      });
    } else if (isObject(val)) {
      for(var subkey in val) {
        pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
      }
    } else {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(val));
    }
  } else if (val === null) {
    pairs.push(encodeURIComponent(key));
  }
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var pair;
  var pos;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    pos = pair.indexOf('=');
    if (pos == -1) {
      obj[decodeURIComponent(pair)] = '';
    } else {
      obj[decodeURIComponent(pair.slice(0, pos))] =
        decodeURIComponent(pair.slice(pos + 1));
    }
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Check if `mime` is json or has +json structured syntax suffix.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api private
 */

function isJSON(mime) {
  return /[\/+]json\b/.test(mime);
}

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req) {
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
     ? this.xhr.responseText
     : null;
  this.statusText = this.req.xhr.statusText;
  var status = this.xhr.status;
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
      status = 204;
  }
  this._setStatusProperties(status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this._setHeaderProperties(this.header);

  if (null === this.text && req._responseType) {
    this.body = this.xhr.response;
  } else {
    this.body = this.req.method != 'HEAD'
      ? this._parseBody(this.text ? this.text : this.xhr.response)
      : null;
  }
}

ResponseBase(Response.prototype);

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype._parseBody = function(str){
  var parse = request.parse[this.type];
  if(this.req._parser) {
    return this.req._parser(this, str);
  }
  if (!parse && isJSON(this.type)) {
    parse = request.parse['application/json'];
  }
  return parse && str && (str.length || str instanceof Object)
    ? parse(str)
    : null;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {}; // preserves header name case
  this._header = {}; // coerces header names to lowercase
  this.on('end', function(){
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch(e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      // issue #675: return the raw response if the response parsing fails
      if (self.xhr) {
        // ie9 doesn't have 'response' property
        err.rawResponse = typeof self.xhr.responseType == 'undefined' ? self.xhr.responseText : self.xhr.response;
        // issue #876: return the http status code if the response parsing fails
        err.status = self.xhr.status ? self.xhr.status : null;
        err.statusCode = err.status; // backwards-compat only
      } else {
        err.rawResponse = null;
        err.status = null;
      }

      return self.callback(err);
    }

    self.emit('response', res);

    var new_err;
    try {
      if (!self._isResponseOK(res)) {
        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
        new_err.original = err;
        new_err.response = res;
        new_err.status = res.status;
      }
    } catch(e) {
      new_err = e; // #985 touching res may cause INVALID_STATE_ERR on old Android
    }

    // #1000 don't catch errors from the callback to avoid double calling it
    if (new_err) {
      self.callback(new_err, res);
    } else {
      self.callback(null, res);
    }
  });
}

/**
 * Mixin `Emitter` and `RequestBase`.
 */

Emitter(Request.prototype);
RequestBase(Request.prototype);

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} [pass] optional in case of using 'bearer' as type
 * @param {Object} options with 'type' property 'auto', 'basic' or 'bearer' (default 'basic')
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass, options){
  if (typeof pass === 'object' && pass !== null) { // pass is optional and can substitute for options
    options = pass;
  }
  if (!options) {
    options = {
      type: 'function' === typeof btoa ? 'basic' : 'auto',
    }
  }

  switch (options.type) {
    case 'basic':
      this.set('Authorization', 'Basic ' + btoa(user + ':' + pass));
    break;

    case 'auto':
      this.username = user;
      this.password = pass;
    break;
      
    case 'bearer': // usage would be .auth(accessToken, { type: 'bearer' })
      this.set('Authorization', 'Bearer ' + user);
    break;  
  }
  return this;
};

/**
 * Add query-string `val`.
 *
 * Examples:
 *
 *   request.get('/shoes')
 *     .query('size=10')
 *     .query({ color: 'blue' })
 *
 * @param {Object|String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `options` (or filename).
 *
 * ``` js
 * request.post('/upload')
 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String|Object} options
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, options){
  if (file) {
    if (this._data) {
      throw Error("superagent can't mix .send() and .attach()");
    }

    this._getFormData().append(field, file, options || file.name);
  }
  return this;
};

Request.prototype._getFormData = function(){
  if (!this._formData) {
    this._formData = new root.FormData();
  }
  return this._formData;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  // console.log(this._retries, this._maxRetries)
  if (this._maxRetries && this._retries++ < this._maxRetries && shouldRetry(err, res)) {
    return this._retry();
  }

  var fn = this._callback;
  this.clearTimeout();

  if (err) {
    if (this._maxRetries) err.retries = this._retries - 1;
    this.emit('error', err);
  }

  fn(err, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
  err.crossDomain = true;

  err.status = this.status;
  err.method = this.method;
  err.url = this.url;

  this.callback(err);
};

// This only warns, because the request is still likely to work
Request.prototype.buffer = Request.prototype.ca = Request.prototype.agent = function(){
  console.warn("This is not supported in browser version of superagent");
  return this;
};

// This throws, because it can't send/receive data as expected
Request.prototype.pipe = Request.prototype.write = function(){
  throw Error("Streaming is not supported in browser version of superagent");
};

/**
 * Compose querystring to append to req.url
 *
 * @api private
 */

Request.prototype._appendQueryString = function(){
  var query = this._query.join('&');
  if (query) {
    this.url += (this.url.indexOf('?') >= 0 ? '&' : '?') + query;
  }

  if (this._sort) {
    var index = this.url.indexOf('?');
    if (index >= 0) {
      var queryArr = this.url.substring(index + 1).split('&');
      if (isFunction(this._sort)) {
        queryArr.sort(this._sort);
      } else {
        queryArr.sort();
      }
      this.url = this.url.substring(0, index) + '?' + queryArr.join('&');
    }
  }
};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */
Request.prototype._isHost = function _isHost(obj) {
  // Native objects stringify to [object File], [object Blob], [object FormData], etc.
  return obj && 'object' === typeof obj && !Array.isArray(obj) && Object.prototype.toString.call(obj) !== '[object Object]';
}

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  if (this._endCalled) {
    console.warn("Warning: .end() was called twice. This is not supported in superagent");
  }
  this._endCalled = true;

  // store callback
  this._callback = fn || noop;

  // querystring
  this._appendQueryString();

  return this._end();
};

Request.prototype._end = function() {
  var self = this;
  var xhr = this.xhr = request.getXHR();
  var data = this._formData || this._data;

  this._setTimeouts();

  // state change
  xhr.onreadystatechange = function(){
    var readyState = xhr.readyState;
    if (readyState >= 2 && self._responseTimeoutTimer) {
      clearTimeout(self._responseTimeoutTimer);
    }
    if (4 != readyState) {
      return;
    }

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try { status = xhr.status } catch(e) { status = 0; }

    if (!status) {
      if (self.timedout || self._aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  var handleProgress = function(direction, e) {
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    e.direction = direction;
    self.emit('progress', e);
  }
  if (this.hasListeners('progress')) {
    try {
      xhr.onprogress = handleProgress.bind(null, 'download');
      if (xhr.upload) {
        xhr.upload.onprogress = handleProgress.bind(null, 'upload');
      }
    } catch(e) {
      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
      // Reported here:
      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
    }
  }

  // initiate request
  try {
    if (this.username && this.password) {
      xhr.open(this.method, this.url, true, this.username, this.password);
    } else {
      xhr.open(this.method, this.url, true);
    }
  } catch (err) {
    // see #1149
    return this.callback(err);
  }

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if (!this._formData && 'GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
    // serialize stuff
    var contentType = this._header['content-type'];
    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
    if (!serialize && isJSON(contentType)) {
      serialize = request.serialize['application/json'];
    }
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;

    if (this.header.hasOwnProperty(field))
      xhr.setRequestHeader(field, this.header[field]);
  }

  if (this._responseType) {
    xhr.responseType = this._responseType;
  }

  // send stuff
  this.emit('request', this);

  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
  // We need null here if data is undefined
  xhr.send(typeof data !== 'undefined' ? data : null);
  return this;
};

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * OPTIONS query to `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.options = function(url, data, fn){
  var req = request('OPTIONS', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

function del(url, data, fn){
  var req = request('DELETE', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

request['del'] = del;
request['delete'] = del;

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};


/***/ }),
/* 15 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const superagent = __webpack_require__(14);

const normalizeOptions = __webpack_require__(5);
const queryByHose = __webpack_require__(37);
const spinus = __webpack_require__(38);
const twoD = __webpack_require__(39);

const defaultProtonUrl = 'https://raw.githubusercontent.com/cheminfo-js/spectra/master/packages/nmr-predictor/data/h1.json';
const defaultCarbonUrl = 'https://raw.githubusercontent.com/cheminfo-js/spectra/master/packages/nmr-predictor/data/nmrshiftdb2-13c.json';

const databases = {};

function fetchProton(url = defaultProtonUrl, dbName = 'proton') {
    return fetch(url, dbName, 'proton');
}

function fetchCarbon(url = defaultCarbonUrl, dbName = 'carbon') {
    return fetch(url, dbName, 'carbon');
}

function fetch(url, dbName, type) {
    if (databases[dbName] && databases[dbName].type === type && databases[dbName].url === url) {
        if (databases[dbName].fetching) {
            return databases[dbName].fetching;
        }
        return Promise.resolve(databases[dbName].db);
    }
    const database = {
        type,
        url,
        db: null,
        fetching: null
    };
    databases[dbName] = database;
    const fetching = superagent.get(url).then((res) => {
        const db = res.body ? res.body : JSON.parse(res.text);
        database.db = db;
        database.fetching = false;
        return db;
    }).catch((e) => {
        delete databases[dbName];
        throw e;
    });
    database.fetching = fetching;
    return fetching;
}

function proton(molecule, options) {
    options.atomLabel = 'H';
    [molecule, options] = normalizeOptions(molecule, options);
    const db = getDb(options.db || 'proton', 'proton');
    return queryByHose(molecule, db, options);
}

function carbon(molecule, options) {
    options.atomLabel = 'C';
    [molecule, options] = normalizeOptions(molecule, options);
    const db = getDb(options.db || 'carbon', 'carbon');
    return queryByHose(molecule, db, options);
}

function getDb(option, type) {
    if (typeof option === 'object') return option;
    if (typeof option !== 'string') throw new TypeError('database option must be a string or array');
    const db = databases[option];
    if (!db) throw new Error(`database ${option} does not exist. Did you forget to fetch it?`);
    if (db.fetching) throw new Error(`database ${option} is not fetched yet`);
    if (db.type !== type) throw new Error(`database ${option} is of type ${db.type} instead of ${type}`);
    return db.db;
}

module.exports = {
    fetchProton,
    fetchCarbon,
    proton,
    carbon,
    spinus,
    twoD
};


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(16);

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Expose `Emitter`.
 */

if (true) {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Stat = __webpack_require__(12).array;
/**
 * Function that returns an array of points given 1D array as follows:
 *
 * [x1, y1, .. , x2, y2, ..]
 *
 * And receive the number of dimensions of each point.
 * @param array
 * @param dimensions
 * @returns {Array} - Array of points.
 */
function coordArrayToPoints(array, dimensions) {
    if(array.length % dimensions !== 0) {
        throw new RangeError('Dimensions number must be accordance with the size of the array.');
    }

    var length = array.length / dimensions;
    var pointsArr = new Array(length);

    var k = 0;
    for(var i = 0; i < array.length; i += dimensions) {
        var point = new Array(dimensions);
        for(var j = 0; j < dimensions; ++j) {
            point[j] = array[i + j];
        }

        pointsArr[k] = point;
        k++;
    }

    return pointsArr;
}


/**
 * Function that given an array as follows:
 * [x1, y1, .. , x2, y2, ..]
 *
 * Returns an array as follows:
 * [[x1, x2, ..], [y1, y2, ..], [ .. ]]
 *
 * And receives the number of dimensions of each coordinate.
 * @param array
 * @param dimensions
 * @returns {Array} - Matrix of coordinates
 */
function coordArrayToCoordMatrix(array, dimensions) {
    if(array.length % dimensions !== 0) {
        throw new RangeError('Dimensions number must be accordance with the size of the array.');
    }

    var coordinatesArray = new Array(dimensions);
    var points = array.length / dimensions;
    for (var i = 0; i < coordinatesArray.length; i++) {
        coordinatesArray[i] = new Array(points);
    }

    for(i = 0; i < array.length; i += dimensions) {
        for(var j = 0; j < dimensions; ++j) {
            var currentPoint = Math.floor(i / dimensions);
            coordinatesArray[j][currentPoint] = array[i + j];
        }
    }

    return coordinatesArray;
}

/**
 * Function that receives a coordinate matrix as follows:
 * [[x1, x2, ..], [y1, y2, ..], [ .. ]]
 *
 * Returns an array of coordinates as follows:
 * [x1, y1, .. , x2, y2, ..]
 *
 * @param coordMatrix
 * @returns {Array}
 */
function coordMatrixToCoordArray(coordMatrix) {
    var coodinatesArray = new Array(coordMatrix.length * coordMatrix[0].length);
    var k = 0;
    for(var i = 0; i < coordMatrix[0].length; ++i) {
        for(var j = 0; j < coordMatrix.length; ++j) {
            coodinatesArray[k] = coordMatrix[j][i];
            ++k;
        }
    }

    return coodinatesArray;
}

/**
 * Tranpose a matrix, this method is for coordMatrixToPoints and
 * pointsToCoordMatrix, that because only transposing the matrix
 * you can change your representation.
 *
 * @param matrix
 * @returns {Array}
 */
function transpose(matrix) {
    var resultMatrix = new Array(matrix[0].length);
    for(var i = 0; i < resultMatrix.length; ++i) {
        resultMatrix[i] = new Array(matrix.length);
    }

    for (i = 0; i < matrix.length; ++i) {
        for(var j = 0; j < matrix[0].length; ++j) {
            resultMatrix[j][i] = matrix[i][j];
        }
    }

    return resultMatrix;
}

/**
 * Function that transform an array of points into a coordinates array
 * as follows:
 * [x1, y1, .. , x2, y2, ..]
 *
 * @param points
 * @returns {Array}
 */
function pointsToCoordArray(points) {
    var coodinatesArray = new Array(points.length * points[0].length);
    var k = 0;
    for(var i = 0; i < points.length; ++i) {
        for(var j = 0; j < points[0].length; ++j) {
            coodinatesArray[k] = points[i][j];
            ++k;
        }
    }

    return coodinatesArray;
}

/**
 * Apply the dot product between the smaller vector and a subsets of the
 * largest one.
 *
 * @param firstVector
 * @param secondVector
 * @returns {Array} each dot product of size of the difference between the
 *                  larger and the smallest one.
 */
function applyDotProduct(firstVector, secondVector) {
    var largestVector, smallestVector;
    if(firstVector.length <= secondVector.length) {
        smallestVector = firstVector;
        largestVector = secondVector;
    } else {
        smallestVector = secondVector;
        largestVector = firstVector;
    }

    var difference = largestVector.length - smallestVector.length + 1;
    var dotProductApplied = new Array(difference);

    for (var i = 0; i < difference; ++i) {
        var sum = 0;
        for (var j = 0; j < smallestVector.length; ++j) {
            sum += smallestVector[j] * largestVector[i + j];
        }
        dotProductApplied[i] = sum;
    }

    return dotProductApplied;
}
/**
 * To scale the input array between the specified min and max values. The operation is performed inplace
 * if the options.inplace is specified. If only one of the min or max parameters is specified, then the scaling
 * will multiply the input array by min/min(input) or max/max(input)
 * @param input
 * @param options
 * @returns {*}
 */
function scale(input, options){
    var y;
    if(options.inPlace){
        y = input;
    }
    else{
        y = new Array(input.length);
    }
    const max = options.max;
    const min = options.min;
    if(typeof max === "number"){
        if(typeof min === "number"){
            var minMax = Stat.minMax(input);
            var factor = (max - min)/(minMax.max-minMax.min);
            for(var i=0;i< y.length;i++){
                y[i]=(input[i]-minMax.min)*factor+min;
            }
        }
        else{
            var currentMin = Stat.max(input);
            var factor = max/currentMin;
            for(var i=0;i< y.length;i++){
                y[i] = input[i]*factor;
            }
        }
    }
    else{
        if(typeof min === "number"){
            var currentMin = Stat.min(input);
            var factor = min/currentMin;
            for(var i=0;i< y.length;i++){
                y[i] = input[i]*factor;
            }
        }
    }
    return y;
}

module.exports = {
    coordArrayToPoints: coordArrayToPoints,
    coordArrayToCoordMatrix: coordArrayToCoordMatrix,
    coordMatrixToCoordArray: coordMatrixToCoordArray,
    coordMatrixToPoints: transpose,
    pointsToCoordArray: pointsToCoordArray,
    pointsToCoordMatrix: transpose,
    applyDotProduct: applyDotProduct,
    scale:scale
};



/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 *
 * Function that returns a Number array of equally spaced numberOfPoints
 * containing a representation of intensities of the spectra arguments x
 * and y.
 *
 * The options parameter contains an object in the following form:
 * from: starting point
 * to: last point
 * numberOfPoints: number of points between from and to
 * variant: "slot" or "smooth" - smooth is the default option
 *
 * The slot variant consist that each point in the new array is calculated
 * averaging the existing points between the slot that belongs to the current
 * value. The smooth variant is the same but takes the integral of the range
 * of the slot and divide by the step size between two points in the new array.
 *
 * @param x - sorted increasing x values
 * @param y
 * @param options
 * @returns {Array} new array with the equally spaced data.
 *
 */
function getEquallySpacedData(x, y, options) {
    if (x.length>1 && x[0]>x[1]) {
        x=x.slice().reverse();
        y=y.slice().reverse();
    }

    var xLength = x.length;
    if(xLength !== y.length)
        throw new RangeError("the x and y vector doesn't have the same size.");

    if (options === undefined) options = {};

    var from = options.from === undefined ? x[0] : options.from
    if (isNaN(from) || !isFinite(from)) {
        throw new RangeError("'From' value must be a number");
    }
    var to = options.to === undefined ? x[x.length - 1] : options.to;
    if (isNaN(to) || !isFinite(to)) {
        throw new RangeError("'To' value must be a number");
    }

    var reverse = from > to;
    if(reverse) {
        var temp = from;
        from = to;
        to = temp;
    }

    var numberOfPoints = options.numberOfPoints === undefined ? 100 : options.numberOfPoints;
    if (isNaN(numberOfPoints) || !isFinite(numberOfPoints)) {
        throw new RangeError("'Number of points' value must be a number");
    }
    if(numberOfPoints < 1)
        throw new RangeError("the number of point must be higher than 1");

    var algorithm = options.variant === "slot" ? "slot" : "smooth"; // default value: smooth

    var output = algorithm === "slot" ? getEquallySpacedSlot(x, y, from, to, numberOfPoints) : getEquallySpacedSmooth(x, y, from, to, numberOfPoints);

    return reverse ? output.reverse() : output;
}

/**
 * function that retrieves the getEquallySpacedData with the variant "smooth"
 *
 * @param x
 * @param y
 * @param from - Initial point
 * @param to - Final point
 * @param numberOfPoints
 * @returns {Array} - Array of y's equally spaced with the variant "smooth"
 */
function getEquallySpacedSmooth(x, y, from, to, numberOfPoints) {
    var xLength = x.length;

    var step = (to - from) / (numberOfPoints - 1);
    var halfStep = step / 2;

    var start = from - halfStep;
    var output = new Array(numberOfPoints);

    var initialOriginalStep = x[1] - x[0];
    var lastOriginalStep = x[x.length - 1] - x[x.length - 2];

    // Init main variables
    var min = start;
    var max = start + step;

    var previousX = Number.MIN_VALUE;
    var previousY = 0;
    var nextX = x[0] - initialOriginalStep;
    var nextY = 0;

    var currentValue = 0;
    var slope = 0;
    var intercept = 0;
    var sumAtMin = 0;
    var sumAtMax = 0;

    var i = 0; // index of input
    var j = 0; // index of output

    function getSlope(x0, y0, x1, y1) {
        return (y1 - y0) / (x1 - x0);
    }

    main: while(true) {
        while (nextX - max >= 0) {
            // no overlap with original point, just consume current value
            var add = integral(0, max - previousX, slope, previousY);
            sumAtMax = currentValue + add;

            output[j] = (sumAtMax - sumAtMin) / step;
            j++;

            if (j === numberOfPoints)
                break main;

            min = max;
            max += step;
            sumAtMin = sumAtMax;
        }

        if(previousX <= min && min <= nextX) {
            add = integral(0, min - previousX, slope, previousY);
            sumAtMin = currentValue + add;
        }

        currentValue += integral(previousX, nextX, slope, intercept);

        previousX = nextX;
        previousY = nextY;

        if (i < xLength) {
            nextX = x[i];
            nextY = y[i];
            i++;
        } else if (i === xLength) {
            nextX += lastOriginalStep;
            nextY = 0;
        }
        // updating parameters
        slope = getSlope(previousX, previousY, nextX, nextY);
        intercept = -slope*previousX + previousY;
    }

    return output;
}

/**
 * function that retrieves the getEquallySpacedData with the variant "slot"
 *
 * @param x
 * @param y
 * @param from - Initial point
 * @param to - Final point
 * @param numberOfPoints
 * @returns {Array} - Array of y's equally spaced with the variant "slot"
 */
function getEquallySpacedSlot(x, y, from, to, numberOfPoints) {
    var xLength = x.length;

    var step = (to - from) / (numberOfPoints - 1);
    var halfStep = step / 2;
    var lastStep = x[x.length - 1] - x[x.length - 2];

    var start = from - halfStep;
    var output = new Array(numberOfPoints);

    // Init main variables
    var min = start;
    var max = start + step;

    var previousX = -Number.MAX_VALUE;
    var previousY = 0;
    var nextX = x[0];
    var nextY = y[0];
    var frontOutsideSpectra = 0;
    var backOutsideSpectra = true;

    var currentValue = 0;

    // for slot algorithm
    var currentPoints = 0;

    var i = 1; // index of input
    var j = 0; // index of output

    main: while(true) {
        if (previousX>=nextX) throw (new Error('x must be an increasing serie'));
        while (previousX - max > 0) {
            // no overlap with original point, just consume current value
            if(backOutsideSpectra) {
                currentPoints++;
                backOutsideSpectra = false;
            }

            output[j] = currentPoints <= 0 ? 0 : currentValue / currentPoints;
            j++;

            if (j === numberOfPoints)
                break main;

            min = max;
            max += step;
            currentValue = 0;
            currentPoints = 0;
        }

        if(previousX > min) {
            currentValue += previousY;
            currentPoints++;
        }

        if(previousX === -Number.MAX_VALUE || frontOutsideSpectra > 1)
            currentPoints--;

        previousX = nextX;
        previousY = nextY;

        if (i < xLength) {
            nextX = x[i];
            nextY = y[i];
            i++;
        } else {
            nextX += lastStep;
            nextY = 0;
            frontOutsideSpectra++;
        }
    }

    return output;
}
/**
 * Function that calculates the integral of the line between two
 * x-coordinates, given the slope and intercept of the line.
 *
 * @param x0
 * @param x1
 * @param slope
 * @param intercept
 * @returns {number} integral value.
 */
function integral(x0, x1, slope, intercept) {
    return (0.5 * slope * x1 * x1 + intercept * x1) - (0.5 * slope * x0 * x0 + intercept * x0);
}

exports.getEquallySpacedData = getEquallySpacedData;
exports.integral = integral;

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = exports = __webpack_require__(19);


exports.getEquallySpacedData = __webpack_require__(20).getEquallySpacedData;
exports.SNV = __webpack_require__(22).SNV;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.SNV = SNV;
var Stat = __webpack_require__(12).array;

/**
 * Function that applies the standard normal variate (SNV) to an array of values.
 *
 * @param data - Array of values.
 * @returns {Array} - applied the SNV.
 */
function SNV(data) {
    var mean = Stat.mean(data);
    var std = Stat.standardDeviation(data);
    var result = data.slice();
    for (var i = 0; i < data.length; i++) {
        result[i] = (result[i] - mean) / std;
    }
    return result;
}


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(0).Matrix;

// https://github.com/lutzroeder/Mapack/blob/master/Source/CholeskyDecomposition.cs
function CholeskyDecomposition(value) {
    if (!(this instanceof CholeskyDecomposition)) {
        return new CholeskyDecomposition(value);
    }
    value = Matrix.checkMatrix(value);
    if (!value.isSymmetric()) {
        throw new Error('Matrix is not symmetric');
    }

    var a = value,
        dimension = a.rows,
        l = new Matrix(dimension, dimension),
        positiveDefinite = true,
        i, j, k;

    for (j = 0; j < dimension; j++) {
        var Lrowj = l[j];
        var d = 0;
        for (k = 0; k < j; k++) {
            var Lrowk = l[k];
            var s = 0;
            for (i = 0; i < k; i++) {
                s += Lrowk[i] * Lrowj[i];
            }
            Lrowj[k] = s = (a[j][k] - s) / l[k][k];
            d = d + s * s;
        }

        d = a[j][j] - d;

        positiveDefinite &= (d > 0);
        l[j][j] = Math.sqrt(Math.max(d, 0));
        for (k = j + 1; k < dimension; k++) {
            l[j][k] = 0;
        }
    }

    if (!positiveDefinite) {
        throw new Error('Matrix is not positive definite');
    }

    this.L = l;
}

CholeskyDecomposition.prototype = {
    get lowerTriangularMatrix() {
        return this.L;
    },
    solve: function (value) {
        value = Matrix.checkMatrix(value);

        var l = this.L,
            dimension = l.rows;

        if (value.rows !== dimension) {
            throw new Error('Matrix dimensions do not match');
        }

        var count = value.columns,
            B = value.clone(),
            i, j, k;

        for (k = 0; k < dimension; k++) {
            for (j = 0; j < count; j++) {
                for (i = 0; i < k; i++) {
                    B[k][j] -= B[i][j] * l[k][i];
                }
                B[k][j] /= l[k][k];
            }
        }

        for (k = dimension - 1; k >= 0; k--) {
            for (j = 0; j < count; j++) {
                for (i = k + 1; i < dimension; i++) {
                    B[k][j] -= B[i][j] * l[i][k];
                }
                B[k][j] /= l[k][k];
            }
        }

        return B;
    }
};

module.exports = CholeskyDecomposition;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Matrix = __webpack_require__(0).Matrix;
const util = __webpack_require__(3);
const hypotenuse = util.hypotenuse;
const getFilled2DArray = util.getFilled2DArray;

const defaultOptions = {
    assumeSymmetric: false
};

// https://github.com/lutzroeder/Mapack/blob/master/Source/EigenvalueDecomposition.cs
function EigenvalueDecomposition(matrix, options) {
    options = Object.assign({}, defaultOptions, options);
    if (!(this instanceof EigenvalueDecomposition)) {
        return new EigenvalueDecomposition(matrix, options);
    }
    matrix = Matrix.checkMatrix(matrix);
    if (!matrix.isSquare()) {
        throw new Error('Matrix is not a square matrix');
    }

    var n = matrix.columns,
        V = getFilled2DArray(n, n, 0),
        d = new Array(n),
        e = new Array(n),
        value = matrix,
        i, j;

    var isSymmetric = false;
    if (options.assumeSymmetric) {
        isSymmetric = true;
    } else {
        isSymmetric = matrix.isSymmetric();
    }

    if (isSymmetric) {
        for (i = 0; i < n; i++) {
            for (j = 0; j < n; j++) {
                V[i][j] = value.get(i, j);
            }
        }
        tred2(n, e, d, V);
        tql2(n, e, d, V);
    } else {
        var H = getFilled2DArray(n, n, 0),
            ort = new Array(n);
        for (j = 0; j < n; j++) {
            for (i = 0; i < n; i++) {
                H[i][j] = value.get(i, j);
            }
        }
        orthes(n, H, ort, V);
        hqr2(n, e, d, V, H);
    }

    this.n = n;
    this.e = e;
    this.d = d;
    this.V = V;
}

EigenvalueDecomposition.prototype = {
    get realEigenvalues() {
        return this.d;
    },
    get imaginaryEigenvalues() {
        return this.e;
    },
    get eigenvectorMatrix() {
        if (!Matrix.isMatrix(this.V)) {
            this.V = new Matrix(this.V);
        }
        return this.V;
    },
    get diagonalMatrix() {
        var n = this.n,
            e = this.e,
            d = this.d,
            X = new Matrix(n, n),
            i, j;
        for (i = 0; i < n; i++) {
            for (j = 0; j < n; j++) {
                X[i][j] = 0;
            }
            X[i][i] = d[i];
            if (e[i] > 0) {
                X[i][i + 1] = e[i];
            } else if (e[i] < 0) {
                X[i][i - 1] = e[i];
            }
        }
        return X;
    }
};

function tred2(n, e, d, V) {

    var f, g, h, i, j, k,
        hh, scale;

    for (j = 0; j < n; j++) {
        d[j] = V[n - 1][j];
    }

    for (i = n - 1; i > 0; i--) {
        scale = 0;
        h = 0;
        for (k = 0; k < i; k++) {
            scale = scale + Math.abs(d[k]);
        }

        if (scale === 0) {
            e[i] = d[i - 1];
            for (j = 0; j < i; j++) {
                d[j] = V[i - 1][j];
                V[i][j] = 0;
                V[j][i] = 0;
            }
        } else {
            for (k = 0; k < i; k++) {
                d[k] /= scale;
                h += d[k] * d[k];
            }

            f = d[i - 1];
            g = Math.sqrt(h);
            if (f > 0) {
                g = -g;
            }

            e[i] = scale * g;
            h = h - f * g;
            d[i - 1] = f - g;
            for (j = 0; j < i; j++) {
                e[j] = 0;
            }

            for (j = 0; j < i; j++) {
                f = d[j];
                V[j][i] = f;
                g = e[j] + V[j][j] * f;
                for (k = j + 1; k <= i - 1; k++) {
                    g += V[k][j] * d[k];
                    e[k] += V[k][j] * f;
                }
                e[j] = g;
            }

            f = 0;
            for (j = 0; j < i; j++) {
                e[j] /= h;
                f += e[j] * d[j];
            }

            hh = f / (h + h);
            for (j = 0; j < i; j++) {
                e[j] -= hh * d[j];
            }

            for (j = 0; j < i; j++) {
                f = d[j];
                g = e[j];
                for (k = j; k <= i - 1; k++) {
                    V[k][j] -= (f * e[k] + g * d[k]);
                }
                d[j] = V[i - 1][j];
                V[i][j] = 0;
            }
        }
        d[i] = h;
    }

    for (i = 0; i < n - 1; i++) {
        V[n - 1][i] = V[i][i];
        V[i][i] = 1;
        h = d[i + 1];
        if (h !== 0) {
            for (k = 0; k <= i; k++) {
                d[k] = V[k][i + 1] / h;
            }

            for (j = 0; j <= i; j++) {
                g = 0;
                for (k = 0; k <= i; k++) {
                    g += V[k][i + 1] * V[k][j];
                }
                for (k = 0; k <= i; k++) {
                    V[k][j] -= g * d[k];
                }
            }
        }

        for (k = 0; k <= i; k++) {
            V[k][i + 1] = 0;
        }
    }

    for (j = 0; j < n; j++) {
        d[j] = V[n - 1][j];
        V[n - 1][j] = 0;
    }

    V[n - 1][n - 1] = 1;
    e[0] = 0;
}

function tql2(n, e, d, V) {

    var g, h, i, j, k, l, m, p, r,
        dl1, c, c2, c3, el1, s, s2,
        iter;

    for (i = 1; i < n; i++) {
        e[i - 1] = e[i];
    }

    e[n - 1] = 0;

    var f = 0,
        tst1 = 0,
        eps = Math.pow(2, -52);

    for (l = 0; l < n; l++) {
        tst1 = Math.max(tst1, Math.abs(d[l]) + Math.abs(e[l]));
        m = l;
        while (m < n) {
            if (Math.abs(e[m]) <= eps * tst1) {
                break;
            }
            m++;
        }

        if (m > l) {
            iter = 0;
            do {
                iter = iter + 1;

                g = d[l];
                p = (d[l + 1] - g) / (2 * e[l]);
                r = hypotenuse(p, 1);
                if (p < 0) {
                    r = -r;
                }

                d[l] = e[l] / (p + r);
                d[l + 1] = e[l] * (p + r);
                dl1 = d[l + 1];
                h = g - d[l];
                for (i = l + 2; i < n; i++) {
                    d[i] -= h;
                }

                f = f + h;

                p = d[m];
                c = 1;
                c2 = c;
                c3 = c;
                el1 = e[l + 1];
                s = 0;
                s2 = 0;
                for (i = m - 1; i >= l; i--) {
                    c3 = c2;
                    c2 = c;
                    s2 = s;
                    g = c * e[i];
                    h = c * p;
                    r = hypotenuse(p, e[i]);
                    e[i + 1] = s * r;
                    s = e[i] / r;
                    c = p / r;
                    p = c * d[i] - s * g;
                    d[i + 1] = h + s * (c * g + s * d[i]);

                    for (k = 0; k < n; k++) {
                        h = V[k][i + 1];
                        V[k][i + 1] = s * V[k][i] + c * h;
                        V[k][i] = c * V[k][i] - s * h;
                    }
                }

                p = -s * s2 * c3 * el1 * e[l] / dl1;
                e[l] = s * p;
                d[l] = c * p;

            }
            while (Math.abs(e[l]) > eps * tst1);
        }
        d[l] = d[l] + f;
        e[l] = 0;
    }

    for (i = 0; i < n - 1; i++) {
        k = i;
        p = d[i];
        for (j = i + 1; j < n; j++) {
            if (d[j] < p) {
                k = j;
                p = d[j];
            }
        }

        if (k !== i) {
            d[k] = d[i];
            d[i] = p;
            for (j = 0; j < n; j++) {
                p = V[j][i];
                V[j][i] = V[j][k];
                V[j][k] = p;
            }
        }
    }
}

function orthes(n, H, ort, V) {

    var low = 0,
        high = n - 1,
        f, g, h, i, j, m,
        scale;

    for (m = low + 1; m <= high - 1; m++) {
        scale = 0;
        for (i = m; i <= high; i++) {
            scale = scale + Math.abs(H[i][m - 1]);
        }

        if (scale !== 0) {
            h = 0;
            for (i = high; i >= m; i--) {
                ort[i] = H[i][m - 1] / scale;
                h += ort[i] * ort[i];
            }

            g = Math.sqrt(h);
            if (ort[m] > 0) {
                g = -g;
            }

            h = h - ort[m] * g;
            ort[m] = ort[m] - g;

            for (j = m; j < n; j++) {
                f = 0;
                for (i = high; i >= m; i--) {
                    f += ort[i] * H[i][j];
                }

                f = f / h;
                for (i = m; i <= high; i++) {
                    H[i][j] -= f * ort[i];
                }
            }

            for (i = 0; i <= high; i++) {
                f = 0;
                for (j = high; j >= m; j--) {
                    f += ort[j] * H[i][j];
                }

                f = f / h;
                for (j = m; j <= high; j++) {
                    H[i][j] -= f * ort[j];
                }
            }

            ort[m] = scale * ort[m];
            H[m][m - 1] = scale * g;
        }
    }

    for (i = 0; i < n; i++) {
        for (j = 0; j < n; j++) {
            V[i][j] = (i === j ? 1 : 0);
        }
    }

    for (m = high - 1; m >= low + 1; m--) {
        if (H[m][m - 1] !== 0) {
            for (i = m + 1; i <= high; i++) {
                ort[i] = H[i][m - 1];
            }

            for (j = m; j <= high; j++) {
                g = 0;
                for (i = m; i <= high; i++) {
                    g += ort[i] * V[i][j];
                }

                g = (g / ort[m]) / H[m][m - 1];
                for (i = m; i <= high; i++) {
                    V[i][j] += g * ort[i];
                }
            }
        }
    }
}

function hqr2(nn, e, d, V, H) {
    var n = nn - 1,
        low = 0,
        high = nn - 1,
        eps = Math.pow(2, -52),
        exshift = 0,
        norm = 0,
        p = 0,
        q = 0,
        r = 0,
        s = 0,
        z = 0,
        iter = 0,
        i, j, k, l, m, t, w, x, y,
        ra, sa, vr, vi,
        notlast, cdivres;

    for (i = 0; i < nn; i++) {
        if (i < low || i > high) {
            d[i] = H[i][i];
            e[i] = 0;
        }

        for (j = Math.max(i - 1, 0); j < nn; j++) {
            norm = norm + Math.abs(H[i][j]);
        }
    }

    while (n >= low) {
        l = n;
        while (l > low) {
            s = Math.abs(H[l - 1][l - 1]) + Math.abs(H[l][l]);
            if (s === 0) {
                s = norm;
            }
            if (Math.abs(H[l][l - 1]) < eps * s) {
                break;
            }
            l--;
        }

        if (l === n) {
            H[n][n] = H[n][n] + exshift;
            d[n] = H[n][n];
            e[n] = 0;
            n--;
            iter = 0;
        } else if (l === n - 1) {
            w = H[n][n - 1] * H[n - 1][n];
            p = (H[n - 1][n - 1] - H[n][n]) / 2;
            q = p * p + w;
            z = Math.sqrt(Math.abs(q));
            H[n][n] = H[n][n] + exshift;
            H[n - 1][n - 1] = H[n - 1][n - 1] + exshift;
            x = H[n][n];

            if (q >= 0) {
                z = (p >= 0) ? (p + z) : (p - z);
                d[n - 1] = x + z;
                d[n] = d[n - 1];
                if (z !== 0) {
                    d[n] = x - w / z;
                }
                e[n - 1] = 0;
                e[n] = 0;
                x = H[n][n - 1];
                s = Math.abs(x) + Math.abs(z);
                p = x / s;
                q = z / s;
                r = Math.sqrt(p * p + q * q);
                p = p / r;
                q = q / r;

                for (j = n - 1; j < nn; j++) {
                    z = H[n - 1][j];
                    H[n - 1][j] = q * z + p * H[n][j];
                    H[n][j] = q * H[n][j] - p * z;
                }

                for (i = 0; i <= n; i++) {
                    z = H[i][n - 1];
                    H[i][n - 1] = q * z + p * H[i][n];
                    H[i][n] = q * H[i][n] - p * z;
                }

                for (i = low; i <= high; i++) {
                    z = V[i][n - 1];
                    V[i][n - 1] = q * z + p * V[i][n];
                    V[i][n] = q * V[i][n] - p * z;
                }
            } else {
                d[n - 1] = x + p;
                d[n] = x + p;
                e[n - 1] = z;
                e[n] = -z;
            }

            n = n - 2;
            iter = 0;
        } else {
            x = H[n][n];
            y = 0;
            w = 0;
            if (l < n) {
                y = H[n - 1][n - 1];
                w = H[n][n - 1] * H[n - 1][n];
            }

            if (iter === 10) {
                exshift += x;
                for (i = low; i <= n; i++) {
                    H[i][i] -= x;
                }
                s = Math.abs(H[n][n - 1]) + Math.abs(H[n - 1][n - 2]);
                x = y = 0.75 * s;
                w = -0.4375 * s * s;
            }

            if (iter === 30) {
                s = (y - x) / 2;
                s = s * s + w;
                if (s > 0) {
                    s = Math.sqrt(s);
                    if (y < x) {
                        s = -s;
                    }
                    s = x - w / ((y - x) / 2 + s);
                    for (i = low; i <= n; i++) {
                        H[i][i] -= s;
                    }
                    exshift += s;
                    x = y = w = 0.964;
                }
            }

            iter = iter + 1;

            m = n - 2;
            while (m >= l) {
                z = H[m][m];
                r = x - z;
                s = y - z;
                p = (r * s - w) / H[m + 1][m] + H[m][m + 1];
                q = H[m + 1][m + 1] - z - r - s;
                r = H[m + 2][m + 1];
                s = Math.abs(p) + Math.abs(q) + Math.abs(r);
                p = p / s;
                q = q / s;
                r = r / s;
                if (m === l) {
                    break;
                }
                if (Math.abs(H[m][m - 1]) * (Math.abs(q) + Math.abs(r)) < eps * (Math.abs(p) * (Math.abs(H[m - 1][m - 1]) + Math.abs(z) + Math.abs(H[m + 1][m + 1])))) {
                    break;
                }
                m--;
            }

            for (i = m + 2; i <= n; i++) {
                H[i][i - 2] = 0;
                if (i > m + 2) {
                    H[i][i - 3] = 0;
                }
            }

            for (k = m; k <= n - 1; k++) {
                notlast = (k !== n - 1);
                if (k !== m) {
                    p = H[k][k - 1];
                    q = H[k + 1][k - 1];
                    r = (notlast ? H[k + 2][k - 1] : 0);
                    x = Math.abs(p) + Math.abs(q) + Math.abs(r);
                    if (x !== 0) {
                        p = p / x;
                        q = q / x;
                        r = r / x;
                    }
                }

                if (x === 0) {
                    break;
                }

                s = Math.sqrt(p * p + q * q + r * r);
                if (p < 0) {
                    s = -s;
                }

                if (s !== 0) {
                    if (k !== m) {
                        H[k][k - 1] = -s * x;
                    } else if (l !== m) {
                        H[k][k - 1] = -H[k][k - 1];
                    }

                    p = p + s;
                    x = p / s;
                    y = q / s;
                    z = r / s;
                    q = q / p;
                    r = r / p;

                    for (j = k; j < nn; j++) {
                        p = H[k][j] + q * H[k + 1][j];
                        if (notlast) {
                            p = p + r * H[k + 2][j];
                            H[k + 2][j] = H[k + 2][j] - p * z;
                        }

                        H[k][j] = H[k][j] - p * x;
                        H[k + 1][j] = H[k + 1][j] - p * y;
                    }

                    for (i = 0; i <= Math.min(n, k + 3); i++) {
                        p = x * H[i][k] + y * H[i][k + 1];
                        if (notlast) {
                            p = p + z * H[i][k + 2];
                            H[i][k + 2] = H[i][k + 2] - p * r;
                        }

                        H[i][k] = H[i][k] - p;
                        H[i][k + 1] = H[i][k + 1] - p * q;
                    }

                    for (i = low; i <= high; i++) {
                        p = x * V[i][k] + y * V[i][k + 1];
                        if (notlast) {
                            p = p + z * V[i][k + 2];
                            V[i][k + 2] = V[i][k + 2] - p * r;
                        }

                        V[i][k] = V[i][k] - p;
                        V[i][k + 1] = V[i][k + 1] - p * q;
                    }
                }
            }
        }
    }

    if (norm === 0) {
        return;
    }

    for (n = nn - 1; n >= 0; n--) {
        p = d[n];
        q = e[n];

        if (q === 0) {
            l = n;
            H[n][n] = 1;
            for (i = n - 1; i >= 0; i--) {
                w = H[i][i] - p;
                r = 0;
                for (j = l; j <= n; j++) {
                    r = r + H[i][j] * H[j][n];
                }

                if (e[i] < 0) {
                    z = w;
                    s = r;
                } else {
                    l = i;
                    if (e[i] === 0) {
                        H[i][n] = (w !== 0) ? (-r / w) : (-r / (eps * norm));
                    } else {
                        x = H[i][i + 1];
                        y = H[i + 1][i];
                        q = (d[i] - p) * (d[i] - p) + e[i] * e[i];
                        t = (x * s - z * r) / q;
                        H[i][n] = t;
                        H[i + 1][n] = (Math.abs(x) > Math.abs(z)) ? ((-r - w * t) / x) : ((-s - y * t) / z);
                    }

                    t = Math.abs(H[i][n]);
                    if ((eps * t) * t > 1) {
                        for (j = i; j <= n; j++) {
                            H[j][n] = H[j][n] / t;
                        }
                    }
                }
            }
        } else if (q < 0) {
            l = n - 1;

            if (Math.abs(H[n][n - 1]) > Math.abs(H[n - 1][n])) {
                H[n - 1][n - 1] = q / H[n][n - 1];
                H[n - 1][n] = -(H[n][n] - p) / H[n][n - 1];
            } else {
                cdivres = cdiv(0, -H[n - 1][n], H[n - 1][n - 1] - p, q);
                H[n - 1][n - 1] = cdivres[0];
                H[n - 1][n] = cdivres[1];
            }

            H[n][n - 1] = 0;
            H[n][n] = 1;
            for (i = n - 2; i >= 0; i--) {
                ra = 0;
                sa = 0;
                for (j = l; j <= n; j++) {
                    ra = ra + H[i][j] * H[j][n - 1];
                    sa = sa + H[i][j] * H[j][n];
                }

                w = H[i][i] - p;

                if (e[i] < 0) {
                    z = w;
                    r = ra;
                    s = sa;
                } else {
                    l = i;
                    if (e[i] === 0) {
                        cdivres = cdiv(-ra, -sa, w, q);
                        H[i][n - 1] = cdivres[0];
                        H[i][n] = cdivres[1];
                    } else {
                        x = H[i][i + 1];
                        y = H[i + 1][i];
                        vr = (d[i] - p) * (d[i] - p) + e[i] * e[i] - q * q;
                        vi = (d[i] - p) * 2 * q;
                        if (vr === 0 && vi === 0) {
                            vr = eps * norm * (Math.abs(w) + Math.abs(q) + Math.abs(x) + Math.abs(y) + Math.abs(z));
                        }
                        cdivres = cdiv(x * r - z * ra + q * sa, x * s - z * sa - q * ra, vr, vi);
                        H[i][n - 1] = cdivres[0];
                        H[i][n] = cdivres[1];
                        if (Math.abs(x) > (Math.abs(z) + Math.abs(q))) {
                            H[i + 1][n - 1] = (-ra - w * H[i][n - 1] + q * H[i][n]) / x;
                            H[i + 1][n] = (-sa - w * H[i][n] - q * H[i][n - 1]) / x;
                        } else {
                            cdivres = cdiv(-r - y * H[i][n - 1], -s - y * H[i][n], z, q);
                            H[i + 1][n - 1] = cdivres[0];
                            H[i + 1][n] = cdivres[1];
                        }
                    }

                    t = Math.max(Math.abs(H[i][n - 1]), Math.abs(H[i][n]));
                    if ((eps * t) * t > 1) {
                        for (j = i; j <= n; j++) {
                            H[j][n - 1] = H[j][n - 1] / t;
                            H[j][n] = H[j][n] / t;
                        }
                    }
                }
            }
        }
    }

    for (i = 0; i < nn; i++) {
        if (i < low || i > high) {
            for (j = i; j < nn; j++) {
                V[i][j] = H[i][j];
            }
        }
    }

    for (j = nn - 1; j >= low; j--) {
        for (i = low; i <= high; i++) {
            z = 0;
            for (k = low; k <= Math.min(j, high); k++) {
                z = z + V[i][k] * H[k][j];
            }
            V[i][j] = z;
        }
    }
}

function cdiv(xr, xi, yr, yi) {
    var r, d;
    if (Math.abs(yr) > Math.abs(yi)) {
        r = yi / yr;
        d = yr + r * yi;
        return [(xr + r * xi) / d, (xi - r * xr) / d];
    } else {
        r = yr / yi;
        d = yi + r * yr;
        return [(r * xr + xi) / d, (r * xi - xr) / d];
    }
}

module.exports = EigenvalueDecomposition;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(0).Matrix;
var hypotenuse = __webpack_require__(3).hypotenuse;

//https://github.com/lutzroeder/Mapack/blob/master/Source/QrDecomposition.cs
function QrDecomposition(value) {
    if (!(this instanceof QrDecomposition)) {
        return new QrDecomposition(value);
    }
    value = Matrix.checkMatrix(value);

    var qr = value.clone(),
        m = value.rows,
        n = value.columns,
        rdiag = new Array(n),
        i, j, k, s;

    for (k = 0; k < n; k++) {
        var nrm = 0;
        for (i = k; i < m; i++) {
            nrm = hypotenuse(nrm, qr[i][k]);
        }
        if (nrm !== 0) {
            if (qr[k][k] < 0) {
                nrm = -nrm;
            }
            for (i = k; i < m; i++) {
                qr[i][k] /= nrm;
            }
            qr[k][k] += 1;
            for (j = k + 1; j < n; j++) {
                s = 0;
                for (i = k; i < m; i++) {
                    s += qr[i][k] * qr[i][j];
                }
                s = -s / qr[k][k];
                for (i = k; i < m; i++) {
                    qr[i][j] += s * qr[i][k];
                }
            }
        }
        rdiag[k] = -nrm;
    }

    this.QR = qr;
    this.Rdiag = rdiag;
}

QrDecomposition.prototype = {
    solve: function (value) {
        value = Matrix.checkMatrix(value);

        var qr = this.QR,
            m = qr.rows;

        if (value.rows !== m) {
            throw new Error('Matrix row dimensions must agree');
        }
        if (!this.isFullRank()) {
            throw new Error('Matrix is rank deficient');
        }

        var count = value.columns;
        var X = value.clone();
        var n = qr.columns;
        var i, j, k, s;

        for (k = 0; k < n; k++) {
            for (j = 0; j < count; j++) {
                s = 0;
                for (i = k; i < m; i++) {
                    s += qr[i][k] * X[i][j];
                }
                s = -s / qr[k][k];
                for (i = k; i < m; i++) {
                    X[i][j] += s * qr[i][k];
                }
            }
        }
        for (k = n - 1; k >= 0; k--) {
            for (j = 0; j < count; j++) {
                X[k][j] /= this.Rdiag[k];
            }
            for (i = 0; i < k; i++) {
                for (j = 0; j < count; j++) {
                    X[i][j] -= X[k][j] * qr[i][k];
                }
            }
        }

        return X.subMatrix(0, n - 1, 0, count - 1);
    },
    isFullRank: function () {
        var columns = this.QR.columns;
        for (var i = 0; i < columns; i++) {
            if (this.Rdiag[i] === 0) {
                return false;
            }
        }
        return true;
    },
    get upperTriangularMatrix() {
        var qr = this.QR,
            n = qr.columns,
            X = new Matrix(n, n),
            i, j;
        for (i = 0; i < n; i++) {
            for (j = 0; j < n; j++) {
                if (i < j) {
                    X[i][j] = qr[i][j];
                } else if (i === j) {
                    X[i][j] = this.Rdiag[i];
                } else {
                    X[i][j] = 0;
                }
            }
        }
        return X;
    },
    get orthogonalMatrix() {
        var qr = this.QR,
            rows = qr.rows,
            columns = qr.columns,
            X = new Matrix(rows, columns),
            i, j, k, s;

        for (k = columns - 1; k >= 0; k--) {
            for (i = 0; i < rows; i++) {
                X[i][k] = 0;
            }
            X[k][k] = 1;
            for (j = k; j < columns; j++) {
                if (qr[k][k] !== 0) {
                    s = 0;
                    for (i = k; i < rows; i++) {
                        s += qr[i][k] * X[i][j];
                    }

                    s = -s / qr[k][k];

                    for (i = k; i < rows; i++) {
                        X[i][j] += s * qr[i][k];
                    }
                }
            }
        }
        return X;
    }
};

module.exports = QrDecomposition;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Matrix = __webpack_require__(0).Matrix;

var SingularValueDecomposition = __webpack_require__(10);
var EigenvalueDecomposition = __webpack_require__(24);
var LuDecomposition = __webpack_require__(9);
var QrDecomposition = __webpack_require__(25);
var CholeskyDecomposition = __webpack_require__(23);

function inverse(matrix) {
    matrix = Matrix.checkMatrix(matrix);
    return solve(matrix, Matrix.eye(matrix.rows));
}

/**
 * Returns the inverse
 * @memberOf Matrix
 * @static
 * @param {Matrix} matrix
 * @return {Matrix} matrix
 * @alias inv
 */
Matrix.inverse = Matrix.inv = inverse;

/**
 * Returns the inverse
 * @memberOf Matrix
 * @static
 * @param {Matrix} matrix
 * @return {Matrix} matrix
 * @alias inv
 */
Matrix.prototype.inverse = Matrix.prototype.inv = function () {
    return inverse(this);
};

function solve(leftHandSide, rightHandSide) {
    leftHandSide = Matrix.checkMatrix(leftHandSide);
    rightHandSide = Matrix.checkMatrix(rightHandSide);
    return leftHandSide.isSquare() ? new LuDecomposition(leftHandSide).solve(rightHandSide) : new QrDecomposition(leftHandSide).solve(rightHandSide);
}

Matrix.solve = solve;
Matrix.prototype.solve = function (other) {
    return solve(this, other);
};

module.exports = {
    SingularValueDecomposition: SingularValueDecomposition,
    SVD: SingularValueDecomposition,
    EigenvalueDecomposition: EigenvalueDecomposition,
    EVD: EigenvalueDecomposition,
    LuDecomposition: LuDecomposition,
    LU: LuDecomposition,
    QrDecomposition: QrDecomposition,
    QR: QrDecomposition,
    CholeskyDecomposition: CholeskyDecomposition,
    CHO: CholeskyDecomposition,
    inverse: inverse,
    solve: solve
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (!Symbol.species) {
    Symbol.species = Symbol.for('@@species');
}


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BaseView = __webpack_require__(1);

class MatrixColumnView extends BaseView {
    constructor(matrix, column) {
        super(matrix, matrix.rows, 1);
        this.column = column;
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(rowIndex, this.column, value);
        return this;
    }

    get(rowIndex) {
        return this.matrix.get(rowIndex, this.column);
    }
}

module.exports = MatrixColumnView;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BaseView = __webpack_require__(1);

class MatrixFlipColumnView extends BaseView {
    constructor(matrix) {
        super(matrix, matrix.rows, matrix.columns);
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(rowIndex, this.columns - columnIndex - 1, value);
        return this;
    }

    get(rowIndex, columnIndex) {
        return this.matrix.get(rowIndex, this.columns - columnIndex - 1);
    }
}

module.exports = MatrixFlipColumnView;


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BaseView = __webpack_require__(1);

class MatrixFlipRowView extends BaseView {
    constructor(matrix) {
        super(matrix, matrix.rows, matrix.columns);
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(this.rows - rowIndex - 1, columnIndex, value);
        return this;
    }

    get(rowIndex, columnIndex) {
        return this.matrix.get(this.rows - rowIndex - 1, columnIndex);
    }
}

module.exports = MatrixFlipRowView;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BaseView = __webpack_require__(1);

class MatrixRowView extends BaseView {
    constructor(matrix, row) {
        super(matrix, 1, matrix.columns);
        this.row = row;
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(this.row, columnIndex, value);
        return this;
    }

    get(rowIndex, columnIndex) {
        return this.matrix.get(this.row, columnIndex);
    }
}

module.exports = MatrixRowView;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BaseView = __webpack_require__(1);
var util = __webpack_require__(2);

class MatrixSelectionView extends BaseView {
    constructor(matrix, rowIndices, columnIndices) {
        var indices = util.checkIndices(matrix, rowIndices, columnIndices);
        super(matrix, indices.row.length, indices.column.length);
        this.rowIndices = indices.row;
        this.columnIndices = indices.column;
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(this.rowIndices[rowIndex], this.columnIndices[columnIndex], value);
        return this;
    }

    get(rowIndex, columnIndex) {
        return this.matrix.get(this.rowIndices[rowIndex], this.columnIndices[columnIndex]);
    }
}

module.exports = MatrixSelectionView;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BaseView = __webpack_require__(1);
var util = __webpack_require__(2);

class MatrixSubView extends BaseView {
    constructor(matrix, startRow, endRow, startColumn, endColumn) {
        util.checkRange(matrix, startRow, endRow, startColumn, endColumn);
        super(matrix, endRow - startRow + 1, endColumn - startColumn + 1);
        this.startRow = startRow;
        this.startColumn = startColumn;
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(this.startRow + rowIndex, this.startColumn + columnIndex, value);
        return this;
    }

    get(rowIndex, columnIndex) {
        return this.matrix.get(this.startRow + rowIndex, this.startColumn + columnIndex);
    }
}

module.exports = MatrixSubView;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var BaseView = __webpack_require__(1);

class MatrixTransposeView extends BaseView {
    constructor(matrix) {
        super(matrix, matrix.columns, matrix.rows);
    }

    set(rowIndex, columnIndex, value) {
        this.matrix.set(columnIndex, rowIndex, value);
        return this;
    }

    get(rowIndex, columnIndex) {
        return this.matrix.get(columnIndex, rowIndex);
    }
}

module.exports = MatrixTransposeView;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var arrayStat = __webpack_require__(11);

function compareNumbers(a, b) {
    return a - b;
}

exports.max = function max(matrix) {
    var max = -Infinity;
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] > max) max = matrix[i][j];
        }
    }
    return max;
};

exports.min = function min(matrix) {
    var min = Infinity;
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] < min) min = matrix[i][j];
        }
    }
    return min;
};

exports.minMax = function minMax(matrix) {
    var min = Infinity;
    var max = -Infinity;
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] < min) min = matrix[i][j];
            if (matrix[i][j] > max) max = matrix[i][j];
        }
    }
    return {
        min:min,
        max:max
    };
};

exports.entropy = function entropy(matrix, eps) {
    if (typeof (eps) === 'undefined') {
        eps = 0;
    }
    var sum = 0,
        l1 = matrix.length,
        l2 = matrix[0].length;
    for (var i = 0; i < l1; i++) {
        for (var j = 0; j < l2; j++) {
            sum += matrix[i][j] * Math.log(matrix[i][j] + eps);
        }
    }
    return -sum;
};

exports.mean = function mean(matrix, dimension) {
    if (typeof (dimension) === 'undefined') {
        dimension = 0;
    }
    var rows = matrix.length,
        cols = matrix[0].length,
        theMean, N, i, j;

    if (dimension === -1) {
        theMean = [0];
        N = rows * cols;
        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                theMean[0] += matrix[i][j];
            }
        }
        theMean[0] /= N;
    } else if (dimension === 0) {
        theMean = new Array(cols);
        N = rows;
        for (j = 0; j < cols; j++) {
            theMean[j] = 0;
            for (i = 0; i < rows; i++) {
                theMean[j] += matrix[i][j];
            }
            theMean[j] /= N;
        }
    } else if (dimension === 1) {
        theMean = new Array(rows);
        N = cols;
        for (j = 0; j < rows; j++) {
            theMean[j] = 0;
            for (i = 0; i < cols; i++) {
                theMean[j] += matrix[j][i];
            }
            theMean[j] /= N;
        }
    } else {
        throw new Error('Invalid dimension');
    }
    return theMean;
};

exports.sum = function sum(matrix, dimension) {
    if (typeof (dimension) === 'undefined') {
        dimension = 0;
    }
    var rows = matrix.length,
        cols = matrix[0].length,
        theSum, i, j;

    if (dimension === -1) {
        theSum = [0];
        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                theSum[0] += matrix[i][j];
            }
        }
    } else if (dimension === 0) {
        theSum = new Array(cols);
        for (j = 0; j < cols; j++) {
            theSum[j] = 0;
            for (i = 0; i < rows; i++) {
                theSum[j] += matrix[i][j];
            }
        }
    } else if (dimension === 1) {
        theSum = new Array(rows);
        for (j = 0; j < rows; j++) {
            theSum[j] = 0;
            for (i = 0; i < cols; i++) {
                theSum[j] += matrix[j][i];
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }
    return theSum;
};

exports.product = function product(matrix, dimension) {
    if (typeof (dimension) === 'undefined') {
        dimension = 0;
    }
    var rows = matrix.length,
        cols = matrix[0].length,
        theProduct, i, j;

    if (dimension === -1) {
        theProduct = [1];
        for (i = 0; i < rows; i++) {
            for (j = 0; j < cols; j++) {
                theProduct[0] *= matrix[i][j];
            }
        }
    } else if (dimension === 0) {
        theProduct = new Array(cols);
        for (j = 0; j < cols; j++) {
            theProduct[j] = 1;
            for (i = 0; i < rows; i++) {
                theProduct[j] *= matrix[i][j];
            }
        }
    } else if (dimension === 1) {
        theProduct = new Array(rows);
        for (j = 0; j < rows; j++) {
            theProduct[j] = 1;
            for (i = 0; i < cols; i++) {
                theProduct[j] *= matrix[j][i];
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }
    return theProduct;
};

exports.standardDeviation = function standardDeviation(matrix, means, unbiased) {
    var vari = exports.variance(matrix, means, unbiased), l = vari.length;
    for (var i = 0; i < l; i++) {
        vari[i] = Math.sqrt(vari[i]);
    }
    return vari;
};

exports.variance = function variance(matrix, means, unbiased) {
    if (typeof (unbiased) === 'undefined') {
        unbiased = true;
    }
    means = means || exports.mean(matrix);
    var rows = matrix.length;
    if (rows === 0) return [];
    var cols = matrix[0].length;
    var vari = new Array(cols);

    for (var j = 0; j < cols; j++) {
        var sum1 = 0, sum2 = 0, x = 0;
        for (var i = 0; i < rows; i++) {
            x = matrix[i][j] - means[j];
            sum1 += x;
            sum2 += x * x;
        }
        if (unbiased) {
            vari[j] = (sum2 - ((sum1 * sum1) / rows)) / (rows - 1);
        } else {
            vari[j] = (sum2 - ((sum1 * sum1) / rows)) / rows;
        }
    }
    return vari;
};

exports.median = function median(matrix) {
    var rows = matrix.length, cols = matrix[0].length;
    var medians = new Array(cols);

    for (var i = 0; i < cols; i++) {
        var data = new Array(rows);
        for (var j = 0; j < rows; j++) {
            data[j] = matrix[j][i];
        }
        data.sort(compareNumbers);
        var N = data.length;
        if (N % 2 === 0) {
            medians[i] = (data[N / 2] + data[(N / 2) - 1]) * 0.5;
        } else {
            medians[i] = data[Math.floor(N / 2)];
        }
    }
    return medians;
};

exports.mode = function mode(matrix) {
    var rows = matrix.length,
        cols = matrix[0].length,
        modes = new Array(cols),
        i, j;
    for (i = 0; i < cols; i++) {
        var itemCount = new Array(rows);
        for (var k = 0; k < rows; k++) {
            itemCount[k] = 0;
        }
        var itemArray = new Array(rows);
        var count = 0;

        for (j = 0; j < rows; j++) {
            var index = itemArray.indexOf(matrix[j][i]);
            if (index >= 0) {
                itemCount[index]++;
            } else {
                itemArray[count] = matrix[j][i];
                itemCount[count] = 1;
                count++;
            }
        }

        var maxValue = 0, maxIndex = 0;
        for (j = 0; j < count; j++) {
            if (itemCount[j] > maxValue) {
                maxValue = itemCount[j];
                maxIndex = j;
            }
        }

        modes[i] = itemArray[maxIndex];
    }
    return modes;
};

exports.skewness = function skewness(matrix, unbiased) {
    if (typeof (unbiased) === 'undefined') unbiased = true;
    var means = exports.mean(matrix);
    var n = matrix.length, l = means.length;
    var skew = new Array(l);

    for (var j = 0; j < l; j++) {
        var s2 = 0, s3 = 0;
        for (var i = 0; i < n; i++) {
            var dev = matrix[i][j] - means[j];
            s2 += dev * dev;
            s3 += dev * dev * dev;
        }

        var m2 = s2 / n;
        var m3 = s3 / n;
        var g = m3 / Math.pow(m2, 3 / 2);

        if (unbiased) {
            var a = Math.sqrt(n * (n - 1));
            var b = n - 2;
            skew[j] = (a / b) * g;
        } else {
            skew[j] = g;
        }
    }
    return skew;
};

exports.kurtosis = function kurtosis(matrix, unbiased) {
    if (typeof (unbiased) === 'undefined') unbiased = true;
    var means = exports.mean(matrix);
    var n = matrix.length, m = matrix[0].length;
    var kurt = new Array(m);

    for (var j = 0; j < m; j++) {
        var s2 = 0, s4 = 0;
        for (var i = 0; i < n; i++) {
            var dev = matrix[i][j] - means[j];
            s2 += dev * dev;
            s4 += dev * dev * dev * dev;
        }
        var m2 = s2 / n;
        var m4 = s4 / n;

        if (unbiased) {
            var v = s2 / (n - 1);
            var a = (n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3));
            var b = s4 / (v * v);
            var c = ((n - 1) * (n - 1)) / ((n - 2) * (n - 3));
            kurt[j] = a * b - 3 * c;
        } else {
            kurt[j] = m4 / (m2 * m2) - 3;
        }
    }
    return kurt;
};

exports.standardError = function standardError(matrix) {
    var samples = matrix.length;
    var standardDeviations = exports.standardDeviation(matrix);
    var l = standardDeviations.length;
    var standardErrors = new Array(l);
    var sqrtN = Math.sqrt(samples);

    for (var i = 0; i < l; i++) {
        standardErrors[i] = standardDeviations[i] / sqrtN;
    }
    return standardErrors;
};

exports.covariance = function covariance(matrix, dimension) {
    return exports.scatter(matrix, undefined, dimension);
};

exports.scatter = function scatter(matrix, divisor, dimension) {
    if (typeof (dimension) === 'undefined') {
        dimension = 0;
    }
    if (typeof (divisor) === 'undefined') {
        if (dimension === 0) {
            divisor = matrix.length - 1;
        } else if (dimension === 1) {
            divisor = matrix[0].length - 1;
        }
    }
    var means = exports.mean(matrix, dimension);
    var rows = matrix.length;
    if (rows === 0) {
        return [[]];
    }
    var cols = matrix[0].length,
        cov, i, j, s, k;

    if (dimension === 0) {
        cov = new Array(cols);
        for (i = 0; i < cols; i++) {
            cov[i] = new Array(cols);
        }
        for (i = 0; i < cols; i++) {
            for (j = i; j < cols; j++) {
                s = 0;
                for (k = 0; k < rows; k++) {
                    s += (matrix[k][j] - means[j]) * (matrix[k][i] - means[i]);
                }
                s /= divisor;
                cov[i][j] = s;
                cov[j][i] = s;
            }
        }
    } else if (dimension === 1) {
        cov = new Array(rows);
        for (i = 0; i < rows; i++) {
            cov[i] = new Array(rows);
        }
        for (i = 0; i < rows; i++) {
            for (j = i; j < rows; j++) {
                s = 0;
                for (k = 0; k < cols; k++) {
                    s += (matrix[j][k] - means[j]) * (matrix[i][k] - means[i]);
                }
                s /= divisor;
                cov[i][j] = s;
                cov[j][i] = s;
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }

    return cov;
};

exports.correlation = function correlation(matrix) {
    var means = exports.mean(matrix),
        standardDeviations = exports.standardDeviation(matrix, true, means),
        scores = exports.zScores(matrix, means, standardDeviations),
        rows = matrix.length,
        cols = matrix[0].length,
        i, j;

    var cor = new Array(cols);
    for (i = 0; i < cols; i++) {
        cor[i] = new Array(cols);
    }
    for (i = 0; i < cols; i++) {
        for (j = i; j < cols; j++) {
            var c = 0;
            for (var k = 0, l = scores.length; k < l; k++) {
                c += scores[k][j] * scores[k][i];
            }
            c /= rows - 1;
            cor[i][j] = c;
            cor[j][i] = c;
        }
    }
    return cor;
};

exports.zScores = function zScores(matrix, means, standardDeviations) {
    means = means || exports.mean(matrix);
    if (typeof (standardDeviations) === 'undefined') standardDeviations = exports.standardDeviation(matrix, true, means);
    return exports.standardize(exports.center(matrix, means, false), standardDeviations, true);
};

exports.center = function center(matrix, means, inPlace) {
    means = means || exports.mean(matrix);
    var result = matrix,
        l = matrix.length,
        i, j, jj;

    if (!inPlace) {
        result = new Array(l);
        for (i = 0; i < l; i++) {
            result[i] = new Array(matrix[i].length);
        }
    }

    for (i = 0; i < l; i++) {
        var row = result[i];
        for (j = 0, jj = row.length; j < jj; j++) {
            row[j] = matrix[i][j] - means[j];
        }
    }
    return result;
};

exports.standardize = function standardize(matrix, standardDeviations, inPlace) {
    if (typeof (standardDeviations) === 'undefined') standardDeviations = exports.standardDeviation(matrix);
    var result = matrix,
        l = matrix.length,
        i, j, jj;

    if (!inPlace) {
        result = new Array(l);
        for (i = 0; i < l; i++) {
            result[i] = new Array(matrix[i].length);
        }
    }

    for (i = 0; i < l; i++) {
        var resultRow = result[i];
        var sourceRow = matrix[i];
        for (j = 0, jj = resultRow.length; j < jj; j++) {
            if (standardDeviations[j] !== 0 && !isNaN(standardDeviations[j])) {
                resultRow[j] = sourceRow[j] / standardDeviations[j];
            }
        }
    }
    return result;
};

exports.weightedVariance = function weightedVariance(matrix, weights) {
    var means = exports.mean(matrix);
    var rows = matrix.length;
    if (rows === 0) return [];
    var cols = matrix[0].length;
    var vari = new Array(cols);

    for (var j = 0; j < cols; j++) {
        var sum = 0;
        var a = 0, b = 0;

        for (var i = 0; i < rows; i++) {
            var z = matrix[i][j] - means[j];
            var w = weights[i];

            sum += w * (z * z);
            b += w;
            a += w * w;
        }

        vari[j] = sum * (b / (b * b - a));
    }

    return vari;
};

exports.weightedMean = function weightedMean(matrix, weights, dimension) {
    if (typeof (dimension) === 'undefined') {
        dimension = 0;
    }
    var rows = matrix.length;
    if (rows === 0) return [];
    var cols = matrix[0].length,
        means, i, ii, j, w, row;

    if (dimension === 0) {
        means = new Array(cols);
        for (i = 0; i < cols; i++) {
            means[i] = 0;
        }
        for (i = 0; i < rows; i++) {
            row = matrix[i];
            w = weights[i];
            for (j = 0; j < cols; j++) {
                means[j] += row[j] * w;
            }
        }
    } else if (dimension === 1) {
        means = new Array(rows);
        for (i = 0; i < rows; i++) {
            means[i] = 0;
        }
        for (j = 0; j < rows; j++) {
            row = matrix[j];
            w = weights[j];
            for (i = 0; i < cols; i++) {
                means[j] += row[i] * w;
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }

    var weightSum = arrayStat.sum(weights);
    if (weightSum !== 0) {
        for (i = 0, ii = means.length; i < ii; i++) {
            means[i] /= weightSum;
        }
    }
    return means;
};

exports.weightedCovariance = function weightedCovariance(matrix, weights, means, dimension) {
    dimension = dimension || 0;
    means = means || exports.weightedMean(matrix, weights, dimension);
    var s1 = 0, s2 = 0;
    for (var i = 0, ii = weights.length; i < ii; i++) {
        s1 += weights[i];
        s2 += weights[i] * weights[i];
    }
    var factor = s1 / (s1 * s1 - s2);
    return exports.weightedScatter(matrix, weights, means, factor, dimension);
};

exports.weightedScatter = function weightedScatter(matrix, weights, means, factor, dimension) {
    dimension = dimension || 0;
    means = means || exports.weightedMean(matrix, weights, dimension);
    if (typeof (factor) === 'undefined') {
        factor = 1;
    }
    var rows = matrix.length;
    if (rows === 0) {
        return [[]];
    }
    var cols = matrix[0].length,
        cov, i, j, k, s;

    if (dimension === 0) {
        cov = new Array(cols);
        for (i = 0; i < cols; i++) {
            cov[i] = new Array(cols);
        }
        for (i = 0; i < cols; i++) {
            for (j = i; j < cols; j++) {
                s = 0;
                for (k = 0; k < rows; k++) {
                    s += weights[k] * (matrix[k][j] - means[j]) * (matrix[k][i] - means[i]);
                }
                cov[i][j] = s * factor;
                cov[j][i] = s * factor;
            }
        }
    } else if (dimension === 1) {
        cov = new Array(rows);
        for (i = 0; i < rows; i++) {
            cov[i] = new Array(rows);
        }
        for (i = 0; i < rows; i++) {
            for (j = i; j < rows; j++) {
                s = 0;
                for (k = 0; k < cols; k++) {
                    s += weights[k] * (matrix[j][k] - means[j]) * (matrix[i][k] - means[i]);
                }
                cov[i][j] = s * factor;
                cov[j][i] = s * factor;
            }
        }
    } else {
        throw new Error('Invalid dimension');
    }

    return cov;
};


/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = newArray

function newArray (n, value) {
  n = n || 0
  var array = new Array(n)
  for (var i = 0; i < n; i++) {
    array[i] = value
  }
  return array
}


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const numSort = __webpack_require__(40);

const getOcleFromOptions = __webpack_require__(13);

module.exports = function queryByHose(molecule, db, options) {
    const {Util} = getOcleFromOptions(options);
    const {
        atomLabel = 'H',
        use = null,
        algorithm = 0,
        levels = [4, 3, 2, 1, 0]
    } = options;

    levels.sort(numSort.desc);

    const diaIds = molecule.getGroupedDiastereotopicAtomIDs({atomLabel});
    const atoms = {};
    const atomNumbers = [];

    for (const diaId of diaIds) {
        const hoseCodes = Util.getHoseCodesFromDiastereotopicID(diaId.oclID, {
            maxSphereSize: levels[0],
            type: algorithm
        });
        const atom = {
            diaIDs: [diaId.oclID]
        };
        for (const level of levels) {
            if (hoseCodes[level]) {
                atom['hose' + level] = hoseCodes[level];
            }
        }
        for (const diaIdAtom of diaId.atoms) {
            atoms[diaIdAtom] = JSON.parse(JSON.stringify(atom));
            atomNumbers.push(diaIdAtom);
        }
    }

    const toReturn = [];
    for (const atomNumber of atomNumbers) {
        const atom = atoms[atomNumber];
        let res;
        let k = 0;
        while (!res && k < levels.length) {
            if (db[levels[k]]) {
                res = db[levels[k]][atom['hose' + levels[k]]];
            }
            k++;
        }
        if (!res) {
            res = {cs: null, ncs: 0, std: 0, min: 0, max: 0};
        }
        atom.atomLabel = atomLabel;
        atom.level = levels[k - 1];
        if (use === 'median') {
            atom.delta = res.median;
        } else if (use === 'mean') {
            atom.delta = res.mean;
        }
        atom.integral = 1;
        atom.atomIDs = [atomNumber];
        atom.ncs = res.ncs;
        atom.std = res.std;
        atom.min = res.min;
        atom.max = res.max;

        toReturn.push(atom);
    }

    if (options.ignoreLabile) {
        const linksOH = molecule.getAllPaths({
            fromLabel: 'H',
            toLabel: 'O',
            minLength: 1,
            maxLength: 1
        });
        const linksNH = molecule.getAllPaths({
            fromLabel: 'H',
            toLabel: 'N',
            minLength: 1,
            maxLength: 1
        });
        for (let j = toReturn.length - 1; j >= 0; j--) {
            for (const linkOH of linksOH) {
                if (toReturn[j].diaIDs[0] === linkOH.fromDiaID) {
                    toReturn.splice(j, 1);
                    break;
                }
            }
        }

        for (let j = toReturn.length - 1; j >= 0; j--) {
            for (const linkNH of linksNH) {
                if (toReturn[j].diaIDs[0] === linkNH.fromDiaID) {
                    toReturn.splice(j, 1);
                    break;
                }
            }
        }
    }
    return toReturn;
};


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const newArray = __webpack_require__(36);
const superagent = __webpack_require__(14);
const {group} = __webpack_require__(71);
const normalizeOptions = __webpack_require__(5);

/**
 * Makes a prediction using spinus
 * @param {string|Molecule} molecule
 * @param {object} [options]
 * @return {Promise<Array>}
 */
module.exports = function spinus(molecule, options) {
    [molecule, options] = normalizeOptions(molecule, options);
    return fromSpinus(molecule).then(prediction => {
        if (options.group) {
            prediction = group(prediction);
        }
        return prediction;
    });
};

function fromSpinus(molecule) {
    const request = superagent.post('https://www.nmrdb.org/service/predictor');
    request.field('molfile', molecule.toMolfile());

    return request.then(response => {
        //Convert to the ranges format and include the diaID for each atomID
        const data = spinusParser(response.text);
        const ids = data.ids;
        const jc = data.couplingConstants;
        const cs = data.chemicalShifts;
        const multiplicity = data.multiplicity;
        const integrals = data.integrals;
        const nspins = cs.length;
        const diaIDs = molecule.getGroupedDiastereotopicAtomIDs({atomLabel: 'H'});
        const distanceMatrix = molecule.getConnectivityMatrix({pathLength: true});
        var result = new Array(nspins);
        var atoms = {};
        var atomNumbers = [];
        var i, j, k, oclID, tmpCS;
        var csByOclID = {};
        for (j = diaIDs.length - 1; j >= 0; j--) {
            oclID = diaIDs[j].oclID + '';
            for (k = diaIDs[j].atoms.length - 1; k >= 0; k--) {
                atoms[diaIDs[j].atoms[k]] = oclID;
                atomNumbers.push(diaIDs[j].atoms[k]);
                if (!csByOclID[oclID]) {
                    csByOclID[oclID] = {nc: 1, cs: cs[ids[diaIDs[j].atoms[k]]]};
                } else {
                    csByOclID[oclID].nc++;
                    csByOclID[oclID].cs += cs[ids[diaIDs[j].atoms[k]]];
                }
            }
        }

        var idsKeys = Object.keys(ids);
        for (i = 0; i < nspins; i++) {
            tmpCS = csByOclID[atoms[idsKeys[i]]].cs / csByOclID[atoms[idsKeys[i]]].nc;
            result[i] = {
                atomIDs: [idsKeys[i]], //It's not in eln format
                diaIDs: [atoms[idsKeys[i]]],
                nbAtoms: integrals[i],
                delta: tmpCS,
                atomLabel: 'H',
                j: []
            };

            for (j = 0; j < nspins; j++) {
                if (jc[i][j] !== 0) {
                    result[i].j.push({
                        assignment: [idsKeys[j]],
                        diaID: atoms[idsKeys[j]],
                        coupling: jc[i][j],
                        multiplicity: multiplicity[j],
                        distance: distanceMatrix[idsKeys[i]][idsKeys[j]]
                    });
                }
            }
        }
        return result;
    });
}

function spinusParser(result) {
    var lines = result.split('\n');
    var nspins = lines.length - 1;
    var cs = new Array(nspins);
    var integrals = new Array(nspins);
    var ids = {};
    var jc = new Array(nspins);
    var i, j;

    for (i = 0; i < nspins; i++) {
        jc[i] = newArray(nspins, 0);
        var tokens = lines[i].split('\t');
        cs[i] = +tokens[2];
        ids[tokens[0] - 1] = i;
        integrals[i] = 1;//+tokens[5];//Is it always 1??
    }

    for (i = 0; i < nspins; i++) {
        tokens = lines[i].split('\t');
        var nCoup = (tokens.length - 4) / 3;
        for (j = 0; j < nCoup; j++) {
            var withID = tokens[4 + 3 * j] - 1;
            var idx = ids[withID];
            jc[i][idx] = (+tokens[6 + 3 * j]);
        }
    }

    for (j = 0; j < nspins; j++) {
        for (i = j; i < nspins; i++) {
            jc[j][i] = jc[i][j];
        }
    }

    return {
        ids,
        chemicalShifts: cs,
        integrals,
        couplingConstants: jc,
        multiplicity: newArray(nspins, 'd')
    };
}


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const normalizeOptions = __webpack_require__(5);

module.exports = function twoD(dim1, dim2, molecule, options) {
    [molecule, options] = normalizeOptions(molecule, options);
    var fromAtomLabel = '';
    var toAtomLabel = '';
    if (dim1 && dim1.length > 0) {
        fromAtomLabel = dim1[0].atomLabel;
    }
    if (dim2 && dim2.length > 0) {
        toAtomLabel = dim2[0].atomLabel;
    }

    options = Object.assign({minLength: 1, maxLength: 3}, options, {fromLabel: fromAtomLabel, toLabel: toAtomLabel});

    var paths = molecule.getAllPaths(options);
    var inverseMap = {};
    if (fromAtomLabel === 'C' || toAtomLabel === 'C') {
        molecule.removeExplicitHydrogens();
        var diaIDsC = molecule.getGroupedDiastereotopicAtomIDs({atomLabel: 'C'});
        diaIDsC.forEach(diaID => {
            inverseMap[diaID.atoms.join(',')] = diaID.oclID;
        });
    }

    paths.forEach(path => {
        if (path.fromLabel === 'C') {
            path.fromDiaID = inverseMap[path.fromAtoms.join(',')];
        }
        if (path.toLabel === 'C') {
            path.toDiaID = inverseMap[path.toAtoms.join(',')];
        }
    });

    var idMap1 = {};
    dim1.forEach(prediction => idMap1[prediction.diaIDs[0]] = prediction);

    var idMap2 = {};
    dim2.forEach(prediction => idMap2[prediction.diaIDs[0]] = prediction);

    paths.forEach(element => {
        element.fromChemicalShift = idMap1[element.fromDiaID].delta;
        element.toChemicalShift = idMap2[element.toDiaID].delta;
        element.fromAtomLabel = fromAtomLabel;
        element.toAtomLabel = toAtomLabel;
        //@TODO Add the coupling constants in any case!!!!!!
        element.j = getCouplingConstant(idMap1, element.fromDiaID, element.toDiaID);
    });

    return paths;
};

function getCouplingConstant(idMap, fromDiaID, toDiaID) {
    const j = idMap[fromDiaID].j;
    if (j) {
        var index = j.length - 1;
        while (index-- > 0) {
            if (j[index].diaID === toDiaID) {
                return j[index].coupling;
            }
        }
    }
    return 0;
}


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var numberIsNan = __webpack_require__(41);

function assertNum(x) {
	if (typeof x !== 'number' || numberIsNan(x)) {
		throw new TypeError('Expected a number');
	}
}

exports.asc = function (a, b) {
	assertNum(a);
	assertNum(b);
	return a - b;
};

exports.desc = function (a, b) {
	assertNum(a);
	assertNum(b);
	return b - a;
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = Number.isNaN || function (x) {
	return x !== x;
};


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(45)(__webpack_require__(65));


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setImmediate) {

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _parseSDF = __webpack_require__(69);
var Papa = __webpack_require__(66);

var getMoleculeCreators = __webpack_require__(44);

module.exports = function (OCL) {
    var cHelperRings = OCL.Molecule.cHelperRings;
    var Molecule = OCL.Molecule;

    var moleculeCreators = getMoleculeCreators(Molecule);

    var defaultDBOptions = {
        length: 0,
        computeProperties: false
    };

    var defaultSDFOptions = {
        onStep: function onStep() /*current, total*/{
            // empty function
        }
    };

    var defaultCSVOptions = {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        onStep: function onStep() /*current, total*/{
            // empty function
        }
    };

    var defaultSearchOptions = {
        format: 'oclid',
        mode: 'substructure',
        limit: 0
    };

    var MoleculeDB = function () {
        function MoleculeDB(options) {
            _classCallCheck(this, MoleculeDB);

            options = Object.assign({}, defaultDBOptions, options);
            this.data = new Array(options.length);
            this.molecules = new Array(options.length);
            this.statistics = null;
            this.length = 0;
            this.computeProperties = !!options.computeProperties;
            this.searcher = null;
        }

        _createClass(MoleculeDB, [{
            key: 'push',
            value: function push(molecule, data) {
                if (data === undefined) data = {};
                this.molecules[this.length] = molecule;
                // ensure helper arrays needed for substructure search
                molecule.ensureHelperArrays(cHelperRings);
                var molecularFormula = void 0;
                if (!molecule.index) {
                    molecule.index = molecule.getIndex();
                }
                if (!molecule.idcode) {
                    molecule.idcode = molecule.getIDCode();
                }
                if (!molecule.mw) {
                    molecularFormula = molecule.getMolecularFormula();
                    molecule.mw = molecularFormula.relativeWeight;
                }
                this.data[this.length++] = data;
                if (this.computeProperties) {
                    if (!molecularFormula) {
                        molecularFormula = molecule.getMolecularFormula();
                    }
                    var properties = new OCL.MoleculeProperties(molecule);
                    data.properties = {
                        absoluteWeight: molecularFormula.absoluteWeight,
                        relativeWeight: molecule.mw,
                        formula: molecularFormula.formula,
                        acceptorCount: properties.acceptorCount,
                        donorCount: properties.donorCount,
                        logP: properties.logP,
                        logS: properties.logS,
                        polarSurfaceArea: properties.polarSurfaceArea,
                        rotatableBondCount: properties.rotatableBondCount,
                        stereoCenterCount: properties.stereoCenterCount
                    };
                }
            }
        }, {
            key: 'search',
            value: function search(query, options) {
                options = Object.assign({}, defaultSearchOptions, options);

                if (typeof query === 'string') {
                    query = moleculeCreators.get(options.format.toLowerCase())(query);
                } else if (!(query instanceof Molecule)) {
                    throw new TypeError('toSearch must be a Molecule or string');
                }

                var result = void 0;
                switch (options.mode.toLowerCase()) {
                    case 'exact':
                        result = this.exactSearch(query, options.limit);
                        break;
                    case 'substructure':
                        result = this.subStructureSearch(query, options.limit);
                        break;
                    case 'similarity':
                        result = this.similaritySearch(query, options.limit);
                        break;
                    default:
                        throw new Error('unknown search mode: ' + options.mode);
                }
                return result;
            }
        }, {
            key: 'exactSearch',
            value: function exactSearch(query, limit) {
                var queryIdcode = query.getIDCode();
                var result = new MoleculeDB();
                limit = limit || Number.MAX_SAFE_INTEGER;
                for (var i = 0; i < this.length; i++) {
                    if (this.molecules[i].idcode === queryIdcode) {
                        result.push(this.molecules[i], this.data[i]);
                        if (result.length >= limit) break;
                    }
                }
                return result;
            }
        }, {
            key: 'subStructureSearch',
            value: function subStructureSearch(query, limit) {
                var needReset = false;

                if (!query.isFragment()) {
                    needReset = true;
                    query.setFragment(true);
                }

                var queryMW = getMW(query);

                var queryIndex = query.getIndex();
                var searcher = this.getSearcher();

                searcher.setFragment(query, queryIndex);
                var searchResult = [];
                for (var i = 0; i < this.length; i++) {
                    searcher.setMolecule(this.molecules[i], this.molecules[i].index);
                    if (searcher.isFragmentInMolecule()) {
                        searchResult.push([this.molecules[i], i]);
                    }
                }
                searchResult.sort(function (a, b) {
                    return Math.abs(queryMW - a[0].mw) - Math.abs(queryMW - b[0].mw);
                });

                var length = Math.min(limit || searchResult.length, searchResult.length);
                var result = new MoleculeDB({ length: length });
                for (var _i = 0; _i < length; _i++) {
                    result.push(this.molecules[searchResult[_i][1]], this.data[searchResult[_i][1]]);
                }

                if (needReset) {
                    query.setFragment(false);
                }
                return result;
            }
        }, {
            key: 'similaritySearch',
            value: function similaritySearch(query, limit) {
                var queryIndex = query.getIndex();

                var queryMW = getMW(query);
                var queryIDCode = query.getIDCode();

                var searchResult = new Array(this.length);
                var similarity = void 0;
                for (var i = 0; i < this.length; i++) {
                    if (this.molecules[i].idcode === queryIDCode) {
                        similarity = 1e10;
                    } else {
                        similarity = OCL.SSSearcherWithIndex.getSimilarityTanimoto(queryIndex, this.molecules[i].index) * 100000 - Math.abs(queryMW - this.molecules[i].mw) / 1000;
                    }
                    searchResult[i] = [similarity, i];
                }
                searchResult.sort(function (a, b) {
                    return b[0] - a[0];
                });

                var length = Math.min(limit || searchResult.length, searchResult.length);
                var result = new MoleculeDB({ length: length });
                for (var _i2 = 0; _i2 < length; _i2++) {
                    result.push(this.molecules[searchResult[_i2][1]], this.data[searchResult[_i2][1]]);
                }
                return result;
            }
        }, {
            key: 'getSearcher',
            value: function getSearcher() {
                return this.searcher || (this.searcher = new OCL.SSSearcherWithIndex());
            }
        }], [{
            key: 'parseSDF',
            value: function parseSDF(sdf, options) {
                if (typeof sdf !== 'string') {
                    throw new TypeError('sdf must be a string');
                }
                options = Object.assign({}, defaultSDFOptions, options);
                return new Promise(function (resolve, reject) {
                    var parsed = _parseSDF(sdf);
                    var molecules = parsed.molecules;
                    var db = new MoleculeDB(options);
                    db.statistics = parsed.statistics;
                    var i = 0;
                    var l = molecules.length;
                    parseNext();
                    function parseNext() {
                        if (i === l) {
                            resolve(db);
                            return;
                        }
                        try {
                            db.push(Molecule.fromMolfile(molecules[i].molfile), molecules[i]);
                        } catch (e) {
                            reject(e);
                            return;
                        }
                        options.onStep(++i, l);
                        setImmediate(parseNext);
                    }
                });
            }
        }, {
            key: 'parseCSV',
            value: function parseCSV(csv, options) {
                if (typeof csv !== 'string') {
                    throw new TypeError('csv must be a string');
                }
                options = Object.assign({}, defaultCSVOptions, options);
                return new Promise(function (resolve, reject) {
                    var parsed = Papa.parse(csv, options);
                    var fields = parsed.meta.fields;
                    var stats = new Array(fields.length);
                    var firstElement = parsed.data[0];
                    var datatype = void 0,
                        datafield = void 0;
                    for (var _i3 = 0; _i3 < fields.length; _i3++) {
                        stats[_i3] = {
                            label: fields[_i3],
                            isNumeric: typeof firstElement[fields[_i3]] === 'number'
                        };
                        var lowerField = fields[_i3].toLowerCase();
                        if (moleculeCreators.has(lowerField)) {
                            datatype = moleculeCreators.get(lowerField);
                            datafield = fields[_i3];
                        }
                    }
                    if (!datatype) {
                        throw new Error('this document does not contain any molecule field');
                    }
                    var db = new MoleculeDB(options);
                    db.statistics = stats;

                    var i = 0;
                    var l = parsed.data.length;
                    parseNext();
                    function parseNext() {
                        if (i === l) {
                            resolve(db);
                            return;
                        }
                        try {
                            db.push(datatype(parsed.data[i][datafield]), parsed.data[i]);
                        } catch (e) {
                            reject(e);
                            return;
                        }
                        options.onStep(++i, l);
                        setImmediate(parseNext);
                    }
                });
            }
        }]);

        return MoleculeDB;
    }();

    return MoleculeDB;
};

function getMW(query) {
    var copy = query.getCompactCopy();
    copy.setFragment(false);
    return copy.getMolecularFormula().relativeWeight;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(77).setImmediate))

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (Molecule) {
    var fields = new Map();

    fields.set('oclid', Molecule.fromIDCode);
    fields.set('idcode', Molecule.fromIDCode);
    fields.set('smiles', Molecule.fromSmiles);
    fields.set('molfile', Molecule.fromMolfile);

    return fields;
};

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var staticMethods = {
    DB: __webpack_require__(43),
    RXN: __webpack_require__(63)
};

// These methods don't need to directly access OCL
var moleculePrototypeMethods = {
    getAllPaths: __webpack_require__(49),
    getFunctions: __webpack_require__(56),
    getGroupedDiastereotopicAtomIDs: __webpack_require__(57),
    getMF: __webpack_require__(59),
    getCouplings: __webpack_require__(52),
    getNumberOfAtoms: __webpack_require__(60),
    toDiastereotopicSVG: __webpack_require__(61),
    toVisualizerMolfile: __webpack_require__(62)
};

// These methods need a direct access to OCL. The must be exported as a function
// that receives OCL and returns the method that will use it.
var moleculePrototypeMethodsNeedOCL = {
    getAtomsInfo: __webpack_require__(50),
    getConnectivityMatrix: __webpack_require__(51),
    getDiastereotopicHoseCodes: __webpack_require__(53),
    getExtendedDiastereotopicAtomIDs: __webpack_require__(54),
    getFunctionCodes: __webpack_require__(55),
    getGroupedHOSECodes: __webpack_require__(58)
};

module.exports = function extend(OCL) {
    var key = void 0;
    for (key in staticMethods) {
        OCL[key] = staticMethods[key](OCL);
    }

    var MoleculePrototype = OCL.Molecule.prototype;
    for (key in moleculePrototypeMethods) {
        MoleculePrototype[key] = moleculePrototypeMethods[key];
    }
    for (key in moleculePrototypeMethodsNeedOCL) {
        MoleculePrototype[key] = moleculePrototypeMethodsNeedOCL[key](OCL);
    }
    return OCL;
};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    H: 2.20,
    Li: 0.98,
    Be: 1.57,
    B: 2.04,
    C: 2.55,
    N: 3.04,
    O: 3.44,
    F: 3.98,
    Na: 0.93,
    Mg: 1.31,
    Al: 1.61,
    Si: 1.90,
    P: 2.19,
    S: 2.58,
    Cl: 3.16,
    K: 0.82,
    Ca: 1.00,
    Sc: 1.36,
    Ti: 1.54,
    V: 1.63,
    Cr: 1.66,
    Mn: 1.55,
    Fe: 1.83,
    Co: 1.88,
    Ni: 1.91,
    Cu: 1.90,
    Zn: 1.65,
    Ga: 1.81,
    Ge: 2.01,
    As: 2.18,
    Se: 2.55,
    Br: 2.96,
    Kr: 3.00,
    Rb: 0.82,
    Sr: 0.95,
    Y: 1.22,
    Zr: 1.33,
    Nb: 1.6,
    Mo: 2.16,
    Tc: 1.9,
    Ru: 2.2,
    Rh: 2.28,
    Pd: 2.20,
    Ag: 1.93,
    Cd: 1.69,
    In: 1.78,
    Sn: 1.96,
    Sb: 2.05,
    Te: 2.1,
    I: 2.66,
    Xe: 2.6,
    Cs: 0.79,
    Ba: 0.89,
    La: 1.10,
    Ce: 1.12,
    Pr: 1.13,
    Nd: 1.14,
    Sm: 1.17,
    Gd: 1.20,
    Dy: 1.22,
    Ho: 1.23,
    Er: 1.24,
    Tm: 1.25,
    Lu: 1.27,
    Hf: 1.3,
    Ta: 1.5,
    W: 2.36,
    Re: 1.9,
    Os: 2.2,
    Ir: 2.20,
    Pt: 2.28,
    Au: 2.54,
    Hg: 2.00,
    Tl: 1.62,
    Pb: 2.33,
    Bi: 2.02,
    Po: 2.0,
    At: 2.2,
    Fr: 0.7,
    Ra: 0.9,
    Ac: 1.1,
    Th: 1.3,
    Pa: 1.5,
    U: 1.38,
    Np: 1.36,
    Pu: 1.28,
    Am: 1.3,
    Cm: 1.3,
    Bk: 1.3,
    Cf: 1.3,
    Es: 1.3,
    Fm: 1.3,
    Md: 1.3,
    No: 1.3
};

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
    'gFp@DiTt@@B !Bg~wK_}mvw@`': { '0-1': 8, '0-2': 8, '1-3': 8, '3-5': 8, '4-5': 8, '2-4': 8, '0-3': 2.5, '0-4': 2.5, '3-4': 2.5, '1-2': 2.5, '1-5': 2.5, '2-5': 2.5, '2-3': 1, '1-4': 1, '0-5': 1 },
    'gKQ@@eKcRpD !BcLbLypAe@Bh': { '1-3': 1.8, '2-4': 1.8, '1-4': 0.5, '2-3': 0.5, '1-2': 1.55, '3-4': 3.5 },
    'gKX@@eKcRpD !BcLbLipBe@Lh': { '1-3': 2.2, '2-4': 2.2, '1-4': 1.25, '2-3': 1.25, '1-2': 2.05, '3-4': 3.4 },
    'gKPH@DIRxtlA@ !BcLbLqp@e@Dh': { '1-3': 5.2, '2-4': 5.2, '1-4': 1.25, '2-3': 1.25, '1-2': 2.7, '3-4': 3.6 },
    'gFx@@eJf`@@P !BbOsWGx@_`CW@': { '1-3': 5.3, '2-4': 5.3, '1-4': 0.9, '2-3': 0.9, '1-2': 0.35, '3-4': 1.65, '1-5': 1.8, '2-5': 1.8, '3-5': 7.85, '4-5': 7.85 },
    'gKT@Adi\\Vf@` !Bo`@oIR}jXq`': { '2-4': 1.5, '1-4': 1.5, '1-2': 0.75 },
    'gKT@ADi\\Yi@` !BKrk~_qLgKtT': { '2-4': 1.5, '3-4': 2.5, '2-3': 0.75 },
    'gKY@LDi\\ZV@` !BXNTSIwysA\\\\': { '1-2': 0.5, '2-4': 0.8 },
    'gKXHL@aJWFe`H !BXNTSIwysA\\\\': { '1-2': 1.9, '2-4': 3.2 },
    'gKXHL@aJWFe`H !BHFTSI{ycA\\\\': { '2-4': 4.7, '3-4': 1.7 },
    'gFxA@IReSP@@H !BlCvwO[yog~wOP': { '1-3': 6, '2-4': 6, '2-5': 1.5, '1-5': 2.5, '2-3': 0.8, '1-4': 0.8, '1-2': 1, '3-5': 8, '4-5': 8, '3-4': 1.4 },
    'gFt@ADiTt@@B !Bmsr~_{_}mv~_p': { '2-4': 4.9, '3-5': 4.9, '2-5': 2, '3-4': 2, '2-3': 3.5, '4-5': 8.4 },
    'gFt@AdiTt@@B !Bo`BWoY_|epJWoP': { '4-5': 5, '2-5': 2.5, '1-5': 1.5, '1-4': 0 },
    'gFt@ATiTt@@B !Br@KgCx@O`Cg@': { '1-3': 1.8, '2-4': 1.8, '1-4': 1.8, '2-3': 1.8, '1-2': 0.5, '3-4': 0.5 }
};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint-disable quote-props */


module.exports = {
    'gJQLBEeKNVTfjh@': {
        name: 'tertiary alcohol'
    },
    'eF@HxP': {
        name: 'alkyne'
    },
    'eF@HhP': {
        name: 'alkene'
    },
    'eM`BN`p`': {
        name: 'secondary amine'
    },
    'gC``@deZ@~d\\': {
        name: 'ester'
    },
    'eMHBN``': {
        name: 'ether'
    },
    'gC``Adij@pf}IX': {
        name: 'hemiacetal'
    },
    'gJP`AdizhCzRp': {
        name: 'acetal'
    },
    'gCh@AGj@`': {
        name: 'tertiary amine'
    },
    'gJP`AdizhCzQp': {
        name: 'cetal'
    },
    'gJP`AdizhCzSP': {
        name: 'acetal'
    },
    'gJY@DDefhCzQp': {
        name: 'tertiary amide'
    },
    'eMJDVTfP@': {
        name: 'aldehyde'
    },
    'gCaDLEeKJST`@': {
        name: 'ketone'
    },
    'eF`BLFD@': {
        name: 'primary amine'
    },
    'eFHBLFD@': {
        name: ''
    },
    'eMJDVTf`@': {
        name: 'primary alcohol'
    },
    'gCaDLEeKJSU@@': {
        name: 'secondary alcohol'
    },
    'eMDARVCB_Tx': {
        name: 'carboxylic acid'
    }
};

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var floydWarshall = __webpack_require__(7);
var Matrix = __webpack_require__(4);

module.exports = function getAllPaths() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var fromLabel = options.fromLabel || '';
    var toLabel = options.toLabel || '';
    var minLength = options.minLength === undefined ? 1 : options.minLength;
    var maxLength = options.maxLength === undefined ? 4 : options.maxLength;

    // we need to find all the atoms 'fromLabel' and 'toLabel'
    var results = {};
    var diaIDs = this.getDiastereotopicAtomIDs();

    var connectivityMatrix = this.getConnectivityMatrix();
    // TODO have a package that allows to convert the connectivityMatrix to a distanceMatrix
    var pathLengthMatrix = floydWarshall(new Matrix(connectivityMatrix));

    for (var from = 0; from < this.getAllAtoms(); from++) {
        for (var to = 0; to < this.getAllAtoms(); to++) {
            if (!fromLabel || this.getAtomLabel(from) === fromLabel) {
                if (!toLabel || this.getAtomLabel(to) === toLabel) {
                    var key = diaIDs[from] + '_' + diaIDs[to];
                    var pathLength = pathLengthMatrix[from][to];
                    if (pathLength >= minLength && pathLength <= maxLength) {
                        if (!results[key]) {
                            results[key] = {
                                fromDiaID: diaIDs[from],
                                toDiaID: diaIDs[to],
                                fromAtoms: [],
                                toAtoms: [],
                                fromLabel: this.getAtomLabel(from),
                                toLabel: this.getAtomLabel(to),
                                pathLength: pathLength
                            };
                        }
                        if (results[key].fromAtoms.indexOf(from) === -1) results[key].fromAtoms.push(from);
                        if (results[key].toAtoms.indexOf(to) === -1) results[key].toAtoms.push(to);
                    }
                }
            }
        }
    }

    var finalResults = [];
    for (var _key in results) {
        results[_key].fromAtoms.sort(function (a, b) {
            return a - b;
        });
        results[_key].toAtoms.sort(function (a, b) {
            return a - b;
        });
        finalResults.push(results[_key]);
    }
    return finalResults;
};

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (OCL) {
    return function getAtomsInfo() {

        this.ensureHelperArrays(OCL.Molecule.cHelperRings);

        var diaIDs = this.getDiastereotopicAtomIDs();

        var results = [];
        for (var i = 0; i < diaIDs.length; i++) {
            var result = {
                oclID: diaIDs[i],
                extra: {
                    singleBonds: 0,
                    doubleBonds: 0,
                    tripleBonds: 0,
                    aromaticBonds: 0,
                    cnoHybridation: 0 // should be 1 (sp), 2 (sp2) or 3 (sp3)
                }
            };
            var extra = result.extra;
            results.push(result);
            result.abnormalValence = this.getAtomAbnormalValence(i); // -1 is normal otherwise specified
            result.charge = this.getAtomCharge(i);
            result.cipParity = this.getAtomCIPParity(i);
            result.color = this.getAtomColor(i);
            result.customLabel = this.getAtomCustomLabel(i);
            //        result.esrGroup=this.getAtomESRGroup(i);
            //        result.esrType=this.getAtomESRType(i);
            result.atomicNo = this.getAtomicNo(i);
            result.label = this.getAtomLabel(i);
            //        result.list=this.getAtomList(i);
            //        result.listString=this.getAtomListString(i);
            //        result.mapNo=this.getAtomMapNo(i);
            result.mass = this.getAtomMass(i);
            //        result.parity=this.getAtomParity(i);
            //        result.pi=this.getAtomPi(i);
            //        result.preferredStereoBond=this.getAtomPreferredStereoBond(i);
            //        result.queryFeatures=this.getAtomQueryFeatures(i);
            result.radical = this.getAtomRadical(i);
            result.ringBondCount = this.getAtomRingBondCount(i);
            //        result.ringCount=this.getAtomRingCount(i);
            result.ringSize = this.getAtomRingSize(i);
            result.x = this.getAtomX(i);
            result.y = this.getAtomY(i);
            result.z = this.getAtomZ(i);
            result.allHydrogens = this.getAllHydrogens(i);
            result.connAtoms = this.getConnAtoms(i);
            result.allConnAtoms = this.getAllConnAtoms(i);

            result.implicitHydrogens = result.allHydrogens + result.connAtoms - result.allConnAtoms;

            result.isAromatic = this.isAromaticAtom(i);
            result.isAllylic = this.isAllylicAtom(i);
            result.isStereoCenter = this.isAtomStereoCenter(i);
            result.isRing = this.isRingAtom(i);
            result.isSmallRing = this.isSmallRingAtom(i);
            result.isStabilized = this.isStabilizedAtom(i);

            // todo HACK to circumvent bug in OCL that consider than an hydrogen is connected to itself
            result.extra.singleBonds = result.atomicNo === 1 ? 0 : result.implicitHydrogens;
            for (var j = 0; j < this.getAllConnAtoms(i); j++) {
                var bond = this.getConnBond(i, j);
                var bondOrder = this.getBondOrder(bond);
                if (this.isAromaticBond(bond)) {
                    extra.aromaticBonds++;
                } else if (bondOrder === 1) {
                    // not an hydrogen
                    extra.singleBonds++;
                } else if (bondOrder === 2) {
                    extra.doubleBonds++;
                } else if (bondOrder === 3) {
                    extra.tripleBonds++;
                }
            }
            result.extra.totalBonds = result.extra.singleBonds + result.extra.doubleBonds + result.extra.tripleBonds + result.extra.aromaticBonds;

            if (result.atomicNo === 6) {
                result.extra.cnoHybridation = result.extra.totalBonds - 1;
            } else if (result.atomicNo === 7) {
                result.extra.cnoHybridation = result.extra.totalBonds;
            } else if (result.atomicNo === 8) {
                result.extra.cnoHybridation = result.extra.totalBonds + 1;
            } else if (result.atomicNo === 1) {
                var connectedAtom = this.getAllConnAtoms(i) === 0 ? 0 : this.getAtomicNo(this.getConnAtom(i, 0));
                result.extra.hydrogenOnAtomicNo = connectedAtom;
                if (connectedAtom === 7 || connectedAtom === 8) {
                    result.extra.labileHydrogen = true;
                }
            }
        }
        return results;
    };
};

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var floydWarshall = __webpack_require__(7);
var Matrix = __webpack_require__(4);

module.exports = function (OCL) {
    return function getConnectivityMatrix() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        this.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);
        var nbAtoms = this.getAllAtoms();
        var i, j, l;
        var result = new Array(nbAtoms).fill();
        result = result.map(function () {
            return new Array(nbAtoms).fill(0);
        });

        if (!options.pathLength) {
            if (options.atomicNo) {
                for (i = 0; i < nbAtoms; i++) {
                    result[i][i] = this.getAtomicNo(i);
                }
            } else if (options.mass) {
                for (i = 0; i < nbAtoms; i++) {
                    result[i][i] = OCL.Molecule.cRoundedMass[this.getAtomicNo(i)];
                }
            } else {
                for (i = 0; i < nbAtoms; i++) {
                    result[i][i] = 1;
                }
            }
        }

        if (options.sdt) {
            for (i = 0; i < nbAtoms; i++) {
                l = this.getAllConnAtoms(i);
                for (j = 0; j < l; j++) {
                    result[i][this.getConnAtom(i, j)] = this.getConnBondOrder(i, j);
                }
            }
        } else {
            for (i = 0; i < nbAtoms; i++) {
                l = this.getAllConnAtoms(i);
                for (j = 0; j < l; j++) {
                    result[i][this.getConnAtom(i, j)] = 1;
                }
            }
        }

        if (options.pathLength) {
            result = floydWarshall(new Matrix(result)).to2DArray();
        }

        return result;
    };
};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var electronegativities = __webpack_require__(46);
var fragments = __webpack_require__(47);

module.exports = function getAllCouplings() {
    var molecule = this.getCompactCopy();
    var diaIDs = molecule.getDiastereotopicAtomIDs();
    var matchFragments = molecule.getFragments();
    var fragmentsId = {};
    var couplings = [];
    for (var i = 0; i < molecule.getAllAtoms(); i++) {
        if (molecule.getAtomLabel(i) === 'H') {
            for (var j = i + 1; j < molecule.getAllAtoms(); j++) {
                if (molecule.getAtomLabel(j) === 'H') {
                    if (!isAttachedToHeteroAtom(molecule, i) && !isAttachedToHeteroAtom(molecule, j)) {
                        if (!(diaIDs[i].toLowerCase() === diaIDs[j].toLowerCase())) {
                            var atoms = [];
                            var xyz = []; //TODO
                            getPath(molecule, i, i, j, 0, atoms, xyz);
                            if (atoms.length !== 0) {
                                var fragmentId = -1;
                                var coupling = {};
                                coupling.atoms = atoms;
                                coupling.xyz = xyz;
                                coupling.fromDiaID = diaIDs[j];
                                coupling.toDiaID = diaIDs[i];
                                if (matchFragments !== null) {
                                    fragmentId = couplingBelongToFragment(atoms, matchFragments);
                                    coupling.fragmentId = fragmentId;
                                }
                                if (calculatedCoupling(molecule, coupling, fragmentsId, matchFragments)) {
                                    couplings.push(coupling);
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return couplings;
};

function getPath(molecule, parent, idInit, idEnd, pathLength, atoms, xyz) {
    if (pathLength > 3) {
        return;
    }
    var nbConnectedAtoms = molecule.getAllConnAtoms(idInit);
    for (var i = 0; i < nbConnectedAtoms; i++) {
        if (molecule.getConnAtom(idInit, i) === idEnd) {
            var coordinates = new Array(3);
            coordinates[0] = molecule.getAtomX(idEnd);
            coordinates[1] = molecule.getAtomY(idEnd);
            coordinates[2] = molecule.getAtomZ(idEnd);
            atoms.push(idEnd);
            xyz.push(coordinates);

            coordinates = new Array(3);
            coordinates[0] = molecule.getAtomX(idInit);
            coordinates[1] = molecule.getAtomY(idInit);
            coordinates[2] = molecule.getAtomZ(idInit);
            atoms.push(idInit);
            xyz.push(coordinates);
            pathLength++;
            return;
        }
    }

    pathLength++;

    for (var _i = 0; _i < nbConnectedAtoms; _i++) {
        var connectivityAtom = molecule.getConnAtom(idInit, _i);
        if (connectivityAtom !== parent) {
            getPath(molecule, idInit, connectivityAtom, idEnd, pathLength, atoms, xyz);
            if (atoms.length !== 0) {
                coordinates = new Array(3);
                coordinates[0] = molecule.getAtomX(idInit);
                coordinates[1] = molecule.getAtomY(idInit);
                coordinates[2] = molecule.getAtomZ(idInit);
                atoms.push(idInit);
                xyz.push(coordinates);
                break;
            }
        }
    }
}

function couplingBelongToFragment(atoms, matchFragments) {
    var match;
    var result = -1;
    var index = atoms.length - 1;
    for (var i = 0; i < matchFragments.length; i++) {
        match = 0;
        for (var j = 0; j < matchFragments[i].length; j++) {
            for (var k = 1; k < index; k++) {
                if (matchFragments[i][j] === atoms[k]) {
                    match++;
                }
            }
        }

        if (match === atoms.length - 2) {
            result = i;
            i = matchFragments.length;
        }
    }
    return result;
}

function calculatedCoupling(molecule, coupling, fragmentsId, matchFragments) {
    var atoms = coupling.atoms;
    var bondLength = atoms.length - 1;
    var fragmentId = coupling.fragmentId;
    if (fragmentId !== -1) {
        coupling.type = 0;
        var C1 = -1;
        var C2 = -1;
        var possibleCouplings = fragments[fragmentsId[fragmentId]];

        for (var i = 0; i < matchFragments[coupling.getFragmentId()].length; i++) {
            if (atoms[1] === matchFragments[fragmentId][i]) {
                C1 = i;
            }
            if (atoms[atoms.length - 2] === matchFragments[fragmentId][i]) {
                C2 = i;
            }
        }

        if (C1 > C2) {
            var _ref = [C2, C1];
            C1 = _ref[0];
            C2 = _ref[1];
        }

        if (possibleCouplings !== null) {
            coupling.value = possibleCouplings[C1 + '-' + C2];
        }

        return true;
    }

    switch (bondLength) {
        case 2:
            if (molecule.getAllConnAtoms(atoms[1]) < 4) {
                coupling.type = 1; // geminal coupling of alkene
                coupling.value = geminalCoupling();
            } else {
                coupling.value = 16; // generic coupling between geminal hydrogens
            }
            break;
        case 3:
            {
                var angle, xyz, coords;
                if (isDoubleBond(molecule, atoms[1], atoms[2])) {
                    // coupling
                    // through
                    // double
                    // bond
                    // It have to be plain
                    coupling.type = 2;
                    coords = new Array(3);
                    xyz = coupling.xyz;
                    for (var _i2 = 0; _i2 < xyz.length; _i2++) {
                        coords[_i2] = new Array(3);
                        for (var j = 0; j < 3; j++) {
                            coords[_i2][j] = xyz[_i2][j];
                        }
                    }

                    angle = getDihedralAngle(coords);

                    if (angle > 60) {
                        coupling.type = 22;
                        coupling.value = doubleBondCoupling(molecule, 2, atoms);
                    } else {
                        coupling.type = 21;
                        coupling.value = doubleBondCoupling(molecule, 1, atoms);
                    }
                } else {
                    var sumZ = 0;
                    angle = 0.0;
                    xyz = coupling.xyz;
                    coords = new Array(3);

                    for (var _i3 = 0; _i3 < xyz.length; _i3++) {
                        coords[_i3] = new Array(3);
                        for (var _j = 0; _j < 3; _j++) {
                            coords[_i3][_j] = xyz[_i3][_j];
                        }
                        sumZ += Math.abs(coords[_i3][2]);
                    }
                    if (sumZ === 0 && !isDoubleOrTripleBond(molecule, atoms[1], atoms[2])) {
                        // If
                        // it
                        // is
                        // single
                        // and
                        // no
                        // Z
                        // coordinate
                        angle = 60;
                    } else {
                        angle = getDihedralAngle(coords);
                    }
                    if (true === checkVynilicCoupling(molecule, atoms)) {
                        coupling.type = 3;
                        coupling.value = vinylCoupling(angle);
                    } else {
                        coupling.type = 4;
                        coupling.value = jCouplingVicinal(molecule, angle, 1, atoms);
                    }
                }
                coupling.angle = angle;
                break;
            }
        case 4:
            {
                // allylic Coupling
                coupling.type = 5;
                if (isDoubleOrTripleBond(molecule, atoms[1], atoms[2]) && isNotAromatic(molecule, atoms[1], atoms[2])) {
                    coupling.value = 2;
                } else if (isDoubleOrTripleBond(molecule, atoms[2], atoms[3]) && isNotAromatic(molecule, atoms[2], atoms[3])) {
                    coupling.value = 2;
                } else if (isAromatic(molecule, atoms[1], atoms[2]) && isAromatic(molecule, atoms[2], atoms[3])) {
                    coupling.value = 2;
                } else {
                    if (isAromatic(molecule, atoms[1], atoms[1]) && !isAromatic(molecule, atoms[2], atoms[3])) {
                        if (isOnlyAttachedToHC(molecule, atoms[3])) {
                            coupling.value = 1.5;
                            return true;
                        }
                    } else {
                        if (!isAromatic(molecule, atoms[1], atoms[1]) && isAromatic(molecule, atoms[2], atoms[3])) {
                            if (isOnlyAttachedToHC(molecule, atoms[1])) {
                                coupling.value = 1.5;
                                return true;
                            }
                        }
                    }
                    coupling.value = 0;
                    return false;
                }
                break;
            }
        default:
            coupling.value = 7; // check default value
            break;
    }

    return true;
}

function getDihedralAngle(xyz) {
    /*
     * double sum=0; //Check if we have the Z coordinate for (int
     * i=0;i<xyz.length;i++) sum+=Math.abs(xyz[i][2]); if(sum==0) return 60;
     */
    var cosAng, P, Q;
    var distances = new Array(6);
    var Sdistances = new Array(6);
    var k = 0;

    for (var i = 0; i < xyz.length; i++) {
        for (var j = i + 1; j < xyz.length; j++) {
            Sdistances[k] = (xyz[i][0] - xyz[j][0]) * (xyz[i][0] - xyz[j][0]) + (xyz[i][1] - xyz[j][1]) * (xyz[i][1] - xyz[j][1]) + (xyz[i][2] - xyz[j][2]) * (xyz[i][2] - xyz[j][2]);
            distances[k] = Math.sqrt(Sdistances[k]);
            k++;
        }
    }

    P = Sdistances[0] * (Sdistances[3] + Sdistances[5] - Sdistances[4]) + Sdistances[3] * (-Sdistances[3] + Sdistances[5] + Sdistances[4]) + Sdistances[1] * (Sdistances[3] - Sdistances[5] + Sdistances[4]) - 2 * Sdistances[3] * Sdistances[2];

    Q = (distances[0] + distances[3] + distances[1]) * (distances[0] + distances[3] - distances[1]) * (distances[0] - distances[3] + distances[1]) * (-distances[0] + distances[3] + distances[1]) * (distances[3] + distances[5] + distances[4]) * (distances[3] + distances[5] - distances[4]) * (distances[3] - distances[5] + distances[4]) * (-distances[3] + distances[5] + distances[4]);

    cosAng = P / Math.sqrt(Q);

    if (cosAng > 1 || cosAng < -1) {
        cosAng = 1;
    }

    return Math.acos(cosAng) * 180 / Math.PI;
}

function jCouplingVicinal(molecule, dihedralAngle, model, atoms) {
    var J = 0.0;
    var delta;
    var nbConnectedAtoms;
    var electH = electronegativities.H;
    var direction = [1, -1, 1, -1];
    var p = [];
    switch (model) {
        case 1:
            // type = "karplus";

            p = [7.76, -1.10, 1.40];
            J = p[0] * Math.cos(dihedralAngle) * Math.cos(dihedralAngle) + p[1] * Math.cos(dihedralAngle) + p[2];
            break;

        case 2:

            // type = "Karplus-altona";

            // p = [13.88, -0.81, 0, 0.56, -2.32, 17.9];
            p = [13.7, -0.73, 0, 0.56, -2.47, 16.9];
            for (var j = 1; j < atoms.length - 1; j++) {
                nbConnectedAtoms = molecule.getAllConnAtoms(j);
                for (var i = 0; i < nbConnectedAtoms; i++) {
                    delta = electronegativities[molecule.getAtomLabel(molecule.getConnAtom(j, i))] - electH;
                    J += delta * (p[3] + p[4] * Math.cos(direction[j] * dihedralAngle + p[5] * Math.abs(delta)) * Math.cos(direction[j] * dihedralAngle + p[5] * Math.abs(delta)));
                }
            }
            J += p[0] * Math.cos(dihedralAngle) * Math.cos(dihedralAngle) + p[1] * Math.cos(dihedralAngle) + p[2];
            break;

        case 3:

            // type = "Karplus-altona beta effect";
            p = [13.7, -0.73, 0, 0.56, -2.47, 16.9, -0.14];
            var I;
            var atom2;
            var nbConnectedAtoms2;

            for (var _j2 = 1; _j2 < atoms.length - 1; _j2++) {
                nbConnectedAtoms = molecule.getAllConnAtoms(_j2);
                I = 0;
                for (var _i4 = 0; _i4 < nbConnectedAtoms; _i4++) {
                    atom2 = molecule.getConnAtom(_j2, _i4);
                    delta = electronegativities[molecule.getAtomLabel(atom2)] - electH;
                    atom2 = molecule.getConnAtom(_j2, _i4);
                    nbConnectedAtoms2 = molecule.getAllConnAtoms(atom2);
                    for (var k = 0; k < nbConnectedAtoms2; k++) {
                        // i = (Ca -CH) + p7 S ( Cb -CH)
                        I += electronegativities[molecule.getAtomLabel(molecule.getConnAtom(atom2, k))] - electH;
                    }
                    I = delta + p[6] * I;
                }

                J += I * (p[3] + p[4] * (Math.cos(direction[_j2] * dihedralAngle + p[5] * Math.abs(I)) * Math.cos(direction[_j2] * dihedralAngle + p[5] * Math.abs(I))));
            }
            J += p[0] * Math.cos(dihedralAngle) * Math.cos(dihedralAngle) + p[1] * Math.cos(dihedralAngle) + p[2];
            break;
        default:
            J = 0.0;
    }
    return J;
}

function vinylCoupling(phi) {
    var J = 0.0;
    if (phi <= 90) {
        J = 6.6 * Math.cos(phi) * Math.cos(phi) + 2.6 * Math.sin(phi) * Math.sin(phi);
    } else {
        J = 11.6 * Math.cos(phi) * Math.cos(phi) + 2.6 * Math.sin(phi) * Math.sin(phi);
    }
    return J;
}

function geminalCoupling() {
    return 1.6; // average over a sample of experimental spectra
}

function doubleBondCoupling(molecule, type, atoms) {
    var x = 0;
    var nbConnectedAtoms;
    for (var j = 1; j < atoms.length - 1; j++) {
        nbConnectedAtoms = molecule.getAllConnAtoms(j);
        for (var i = 0; i < nbConnectedAtoms; i++) {
            x += electronegativities[molecule.getAtomLabel(molecule.getConnAtom(j, i))] - electronegativities.H;
        }
    }

    var result;
    switch (type) {
        case 1:
            // cis, empirical formula from a sample of experimental spectra
            result = -4.724 * x + 13.949;
            break;
        case 2:
            // trans, empirical formula from a sample of experimental
            // spectra
            result = -3.063 * x + 17.519;
            break;
        default:
            result = 0;
    }

    return result;
}

function checkVynilicCoupling(molecule, atoms) {
    var nbConnectedAtoms;
    var result = false;
    for (var j = 1, l = atoms.length - 1; j < l; j++) {
        nbConnectedAtoms = molecule.getAllConnAtoms(atoms[j]);
        if (nbConnectedAtoms < 4) {
            result = true;
            j = l;
        }
    }
    return result;
}

function isDoubleBond(molecule, atom1, atom2) {
    var bond = molecule.getBond(atom1, atom2);
    var bondType = molecule.getBondType(bond);
    return bondType === 2;
}

function isDoubleOrTripleBond(molecule, atom1, atom2) {
    var bond = molecule.getBond(atom1, atom2);
    var bondType = molecule.getBondType(bond);
    return bondType === 2 || bondType === 4;
}

function isNotAromatic(molecule, atom1, atom2) {
    var bond = molecule.getBond(atom1, atom2);
    return !molecule.isAromaticBond(bond);
}

function isAromatic(molecule, atom1, atom2) {
    var bond = molecule.getBond(atom1, atom2);
    return molecule.isAromaticBond(bond);
}

function isAttachedToHeteroAtom(molecule, atom) {
    var result = false;
    var nbConnectedAtoms = molecule.getAllConnAtoms(atom);
    for (var j = 0; j < nbConnectedAtoms; j++) {
        var connAtom = molecule.getConnAtom(atom, j);
        if (!(molecule.getAtomLabel(connAtom) === 'C')) {
            result = true;
            j = nbConnectedAtoms;
        }
    }
    return result;
}

function isOnlyAttachedToHC(molecule, atom) {
    var nbConnectedAtoms = molecule.getAllConnAtoms(atom);
    for (var j = 0; j < nbConnectedAtoms; j++) {
        var connAtom = molecule.getConnAtom(atom, j);
        if (!(molecule.getAtomLabel(connAtom) === 'C' || molecule.getAtomLabel(connAtom) === 'H')) {
            return false;
        }
    }
    return true;
}

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (OCL) {
    var Util = OCL.Util;
    return function getDiastereotopicHoseCodes() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var diaIDs = this.getDiastereotopicAtomIDs(options).map(function (a) {
            return { oclID: a };
        });
        diaIDs.forEach(function (diaID) {
            var hoses = Util.getHoseCodesFromDiastereotopicID(diaID.oclID, options);
            diaID.hoses = [];
            var level = 1;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = hoses[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var hose = _step.value;

                    diaID.hoses.push({
                        level: level++,
                        oclID: hose
                    });
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        });
        return diaIDs;
    };
};

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (OCL) {
    return function getExtendedDiastereotopicAtomIDs() {
        var molecule = this.getCompactCopy();
        molecule.addImplicitHydrogens();
        // TODO Temporary code ???
        molecule.ensureHelperArrays(OCL.Molecule.cHelperNeighbours);

        var diaIDs = molecule.getDiastereotopicAtomIDs();
        var newDiaIDs = [];

        for (var i = 0; i < diaIDs.length; i++) {
            var diaID = diaIDs[i];
            var newDiaID = {
                oclID: diaID,
                hydrogenOCLIDs: [],
                nbHydrogens: 0
            };
            for (var j = 0; j < molecule.getAllConnAtoms(i); j++) {
                var atom = molecule.getConnAtom(i, j);
                if (molecule.getAtomicNo(atom) === 1) {
                    newDiaID.nbHydrogens++;
                    if (newDiaID.hydrogenOCLIDs.indexOf(diaIDs[atom]) === -1) {
                        newDiaID.hydrogenOCLIDs.push(diaIDs[atom]);
                    }
                }
            }

            newDiaIDs.push(newDiaID);
        }

        return newDiaIDs;
    };
};

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (OCL) {
    return function getFunctionCodes() {
        var molecule = this.getCompactCopy();
        var atoms = molecule.getAtomsInfo();
        for (var i = 0; i < molecule.getAllAtoms(); i++) {
            var atom = atoms[i];
            atom.i = i;
            atom.mapNo = molecule.getAtomMapNo(i);
            atom.links = []; // we will store connected atoms of broken bonds
        }

        var bonds = [];
        for (var _i = 0; _i < molecule.getAllBonds(); _i++) {
            var bond = {};
            bonds.push(bond);
            bond.i = _i;
            bond.order = molecule.getBondOrder(_i);
            bond.atom1 = molecule.getBondAtom(0, _i);
            bond.atom2 = molecule.getBondAtom(1, _i);
            bond.type = molecule.getBondType(_i);
            bond.isAromatic = molecule.isAromaticBond(_i);

            if (!bond.isAromatic && molecule.getBondTypeSimple(_i) === 1 && molecule.getAtomicNo(bond.atom1) === 6 && molecule.getAtomicNo(bond.atom2) === 6 && (atoms[bond.atom1].extra.cnoHybridation === 3 || atoms[bond.atom2].extra.cnoHybridation === 3)) {

                bond.selected = true;
                atoms[bond.atom1].links.push(bond.atom2);
                atoms[bond.atom2].links.push(bond.atom1);
            }
        }

        var brokenMolecule = molecule.getCompactCopy();
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = bonds[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _bond = _step.value;

                if (_bond.selected) {
                    brokenMolecule.markBondForDeletion(_bond.i);
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        brokenMolecule.deleteMarkedAtomsAndBonds();
        var fragmentMap = [];
        var nbFragments = brokenMolecule.getFragmentNumbers(fragmentMap);

        var results = {};

        var _loop = function _loop(_i2) {
            result = {};

            result.atomMap = [];
            includeAtom = fragmentMap.map(function (id) {
                return id === _i2;
            });
            fragment = new OCL.Molecule();
            atomMap = [];

            brokenMolecule.copyMoleculeByAtoms(fragment, includeAtom, false, atomMap);
            parent = fragment.getCompactCopy();

            parent.setFragment(true);
            // we will remove the hydrogens of the broken carbon
            for (var j = 0; j < atomMap.length; j++) {
                if (atomMap[j] > -1) {
                    //                var numberDeletedHydrogens = 0;
                    if (atoms[j].links.length > 0) {
                        for (var k = 0; k < atoms[j].links.length; k++) {
                            if (parent.getAtomicNo(atoms[j].links[k]) === 1) {
                                //                           numberDeletedHydrogens++;
                                fragment.deleteAtom(atoms[j].links[k]);
                            }
                        }
                    }
                    fragment.ensureHelperArrays(OCL.Molecule.cHelperBitNeighbours);
                    // we will allow any substitution on sp3 hydrogens
                    // that is at an extremety (only one connection)

                    if (atoms[j].atomicNo === 6 && fragment.getConnAtoms(atomMap[j]) > 1) {
                        if (atoms[j].allHydrogens !== 0) parent.setAtomQueryFeature(atomMap[j], OCL.Molecule.cAtomQFNot0Hydrogen, true);
                        if (atoms[j].allHydrogens !== 1) parent.setAtomQueryFeature(atomMap[j], OCL.Molecule.cAtomQFNot1Hydrogen, true);
                        if (atoms[j].allHydrogens !== 2) parent.setAtomQueryFeature(atomMap[j], OCL.Molecule.cAtomQFNot2Hydrogen, true);
                        if (atoms[j].allHydrogens !== 3) parent.setAtomQueryFeature(atomMap[j], OCL.Molecule.cAtomQFNot3Hydrogen, true);
                    }
                    if (atoms[j].atomicNo !== 6) {
                        parent.setAtomQueryFeature(atomMap[j], OCL.Molecule.cAtomQFNoMoreNeighbours, true);
                    }
                }
            }

            result.parent = parent.getIDCode();
            fragment.setFragment(false); // required for small molecules like methanol

            // we will add some R groups at the level of the broken bonds
            for (var _j = 0; _j < atomMap.length; _j++) {
                if (atomMap[_j] > -1) {
                    result.atomMap.push(_j);
                    if (atoms[_j].links.length > 0) {
                        for (var _k = 0; _k < atoms[_j].links.length; _k++) {
                            rGroup = fragment.addAtom(154);
                            x = molecule.getAtomX(atoms[_j].links[_k]);
                            y = molecule.getAtomY(atoms[_j].links[_k]);

                            fragment.setAtomX(rGroup, x);
                            fragment.setAtomY(rGroup, y);
                            fragment.addBond(atomMap[_j], rGroup, 1);
                        }
                    }
                }
            }
            result.idCode = fragment.getIDCode();

            if (results[result.idCode]) {
                results[result.idCode].atomMap = results[result.idCode].atomMap.concat(result.atomMap);
            } else {
                results[result.idCode] = {
                    atomMap: result.atomMap,
                    idCode: result.idCode
                };
            }

            if (results[result.parent]) {
                results[result.parent].atomMap = results[result.parent].atomMap.concat(result.atomMap);
            } else {
                results[result.parent] = {
                    atomMap: result.atomMap,
                    idCode: result.parent
                };
            }
        };

        for (var _i2 = 0; _i2 < nbFragments; _i2++) {
            var result;
            var includeAtom;
            var fragment;
            var atomMap;
            var parent;
            var rGroup;
            var x;
            var y;

            _loop(_i2);
        }

        // fragments should be unique
        var fragments = [];
        Object.keys(results).forEach(function (key) {
            fragments.push(results[key]);
        });
        return fragments;
    };
};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var functionIndex = __webpack_require__(48);

module.exports = function getFunctions() {
    var currentFunctionCodes = this.getFunctionCodes();
    var currentFunctions = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = currentFunctionCodes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var fragment = _step.value;

            if (functionIndex[fragment.idCode]) {
                var currentFunction = JSON.parse(JSON.stringify(functionIndex[fragment.idCode]));
                currentFunction.atomMap = fragment.atomMap;
                currentFunctions.push(currentFunction);
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return currentFunctions;
};

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function getGroupedDiastereotopicAtomIDs() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var label = options.atomLabel;

    var diaIDs = this.getDiastereotopicAtomIDs(options);
    var diaIDsObject = {};

    for (var i = 0; i < diaIDs.length; i++) {
        if (!label || this.getAtomLabel(i) === label) {
            var diaID = diaIDs[i];
            if (!diaIDsObject[diaID]) {
                diaIDsObject[diaID] = {
                    counter: 1,
                    atoms: [i],
                    oclID: diaID,
                    atomLabel: this.getAtomLabel(i),
                    _highlight: [diaID]
                };
            } else {
                diaIDsObject[diaID].counter++;
                diaIDsObject[diaID].atoms.push(i);
            }
        }
    }

    var diaIDsTable = [];
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = Object.keys(diaIDsObject)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var key = _step.value;

            diaIDsTable.push(diaIDsObject[key]);
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return diaIDsTable;
};

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (OCL) {
    var Util = OCL.Util;
    return function getGroupedHOSECodes() {
        var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        var diaIDs = this.getGroupedDiastereotopicAtomIDs(options);
        diaIDs.forEach(function (diaID) {
            var hoses = Util.getHoseCodesFromDiastereotopicID(diaID.oclID, options);

            diaID.hoses = [];
            var level = 1;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = hoses[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var hose = _step.value;

                    diaID.hoses.push({
                        level: level++,
                        oclID: hose
                    });
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
        });

        return diaIDs;
    };
};

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Calculate the molecular formula in 'chemcalc' notation taking into account fragments, isotopes and charges
 * @returns {String}
 */

module.exports = function getMF() {
    var entries = this.getFragments();
    var result = {};
    var parts = [];
    var allAtoms = [];
    entries.forEach(function (entry) {
        var mf = getFragmentMF(entry);
        parts.push(mf);
    });

    var counts = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = parts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var part = _step.value;

            if (!counts[part]) counts[part] = 0;
            counts[part]++;
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    parts = [];
    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = Object.keys(counts).sort()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var key = _step2.value;

            if (counts[key] > 1) {
                parts.push(counts[key] + key);
            } else {
                parts.push(key);
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    result.parts = parts;
    result.mf = getMF(allAtoms);
    return result;

    function getFragmentMF(molecule) {
        var atoms = [];
        for (var i = 0; i < molecule.getAllAtoms(); i++) {
            var atom = {};
            atom.charge = molecule.getAtomCharge(i);
            atom.label = molecule.getAtomLabel(i);
            atom.mass = molecule.getAtomMass(i);
            atom.implicitHydrogens = molecule.getImplicitHydrogens(i);
            atoms.push(atom);
            allAtoms.push(atom);
        }
        return getMF(atoms);
    }

    function getMF(atoms) {
        var charge = 0;
        var mfs = {};
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = atoms[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var atom = _step3.value;

                var label = atom.label;
                charge += atom.charge;
                if (atom.mass) {
                    label = '[' + atom.mass + label + ']';
                }
                var mfAtom = mfs[label];
                if (!mfAtom) {
                    mfs[label] = 0;
                }
                mfs[label] += 1;
                if (atom.implicitHydrogens) {
                    if (!mfs.H) mfs.H = 0;
                    mfs.H += atom.implicitHydrogens;
                }
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                    _iterator3.return();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        var mf = '';
        var keys = Object.keys(mfs).sort(function (a, b) {
            if (a === 'C') return -1;
            if (b === 'C') return 1;
            if (a === 'H' && b !== 'C') return -1;
            if (a !== 'C' && b === 'H') return 1;
            if (a < b) return -1;
            return 1;
        });
        var _iteratorNormalCompletion4 = true;
        var _didIteratorError4 = false;
        var _iteratorError4 = undefined;

        try {
            for (var _iterator4 = keys[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var key = _step4.value;

                mf += key;
                if (mfs[key] > 1) mf += mfs[key];
            }
        } catch (err) {
            _didIteratorError4 = true;
            _iteratorError4 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                    _iterator4.return();
                }
            } finally {
                if (_didIteratorError4) {
                    throw _iteratorError4;
                }
            }
        }

        if (charge > 0) {
            mf += '(+' + (charge > 1 ? charge : '') + ')';
        } else if (charge < 0) {
            mf += '(' + (charge < -1 ? charge : '-') + ')';
        }
        return mf;
    }
};

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function getNumberOfAtoms() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var label = options.atomLabel;
    var mf = this.getMolecularFormula().formula;
    var parts = mf.split(/(?=[A-Z])/);
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = parts[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var part = _step.value;

            var atom = part.replace(/[0-9]/g, '');
            if (atom === label) {
                return part.replace(/[^0-9]/g, '') * 1 || 1;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    return 0;
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function toDiastereotopicSVG() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var _options$width = options.width,
        width = _options$width === undefined ? 300 : _options$width,
        _options$height = options.height,
        height = _options$height === undefined ? 200 : _options$height,
        _options$prefix = options.prefix,
        prefix = _options$prefix === undefined ? 'ocl' : _options$prefix;

    var svg = options.svg;
    var diaIDs = this.getDiastereotopicAtomIDs();
    if (!svg) svg = this.toSVG(width, height, prefix);

    svg = svg.replace(/Atom:[0-9]+\"/g, function (value) {
        var atom = value.replace(/[^0-9]/g, '');
        return value + ' data-atomid="' + diaIDs[atom] + '"';
    });

    return svg;
};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function toVisualizerMolfile() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var diastereotopic = options.diastereotopic;

    var highlight = [];
    var atoms = {};
    if (diastereotopic) {
        var heavyAtomHydrogen = options.heavyAtomHydrogen;
        var hydrogenInfo = {};
        this.getExtendedDiastereotopicAtomIDs().forEach(function (line) {
            hydrogenInfo[line.oclID] = line;
        });

        var diaIDs = this.getGroupedDiastereotopicAtomIDs();
        diaIDs.forEach(function (diaID) {
            atoms[diaID.oclID] = diaID.atoms;
            highlight.push(diaID.oclID);
            if (heavyAtomHydrogen) {
                if (hydrogenInfo[diaID.oclID] && hydrogenInfo[diaID.oclID].nbHydrogens > 0) {
                    hydrogenInfo[diaID.oclID].hydrogenOCLIDs.forEach(function (id) {
                        highlight.push(id);
                        atoms[id] = diaID.atoms;
                    });
                }
            }
        });
    } else {
        var size = this.getAllAtoms();
        highlight = new Array(size).fill(0).map(function (a, index) {
            return index;
        });
        atoms = highlight.map(function (a) {
            return [a];
        });
    }

    var molfile = {
        type: 'mol2d',
        value: this.toMolfile(),
        _highlight: highlight,
        _atoms: atoms
    };

    return molfile;
};

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var parseRXN = __webpack_require__(68);

module.exports = function (OCL) {
    function RXN(rxn) {
        if (!rxn) {
            this.reagents = [];
            this.products = [];
        } else {
            var parsed = parseRXN(rxn);
            this.reagents = generateInfo(parsed.reagents);
            this.products = generateInfo(parsed.products);
        }
    }

    RXN.prototype.addReagent = function (molfile) {
        this.reagents.push(getMolfileInfo(molfile));
    };

    RXN.prototype.addProduct = function (molfile) {
        this.products.push(getMolfileInfo(molfile));
    };

    RXN.prototype.toRXN = function () {
        var result = [];
        result.push('$RXN');
        result.push('');
        result.push('');
        result.push('Openchemlib');
        result.push(format3(this.reagents.length) + format3(this.products.length));
        for (var i = 0; i < this.reagents.length; i++) {
            result.push('$MOL');
            result.push(getMolfile(this.reagents[i].molfile));
        }
        for (var _i = 0; _i < this.products.length; _i++) {
            result.push('$MOL');
            result.push(getMolfile(this.products[_i].molfile));
        }
        return result.join('\n');
    };

    function getMolfile(molfile) {
        var lines = ~molfile.indexOf('\r\n') ? molfile.split('\r\n') : molfile.split(/[\r\n]/);
        return lines.join('\n');
    }

    function format3(number) {
        var length = (number + '').length;
        return '   '.substring(0, 3 - length) + number;
    }

    function generateInfo(molecules) {
        for (var i = 0; i < molecules.length; i++) {
            molecules[i] = getMolfileInfo(molecules[i]);
        }
        return molecules;
    }

    function getMolfileInfo(molfile) {
        var ocl = OCL.Molecule.fromMolfile(molfile);
        return {
            molfile: molfile,
            smiles: ocl.toSmiles(),
            mf: ocl.getMolecularFormula().formula,
            mw: ocl.getMolecularFormula().relativeWeight,
            idCode: ocl.getIDCode
        };
    }

    return RXN;
};

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * openchemlib - Manipulate molecules
 * @version v5.2.9
 * @date 2017-07-07T15:17:52.707Z
 * @link https://github.com/cheminfo/openchemlib-js
 * @license BSD-3-Clause
*/
(function (root) {
    'use strict';

    function getExports($wnd) {

        var $doc = $wnd.document;
        var $gwt = {};
        var navigator = {
            userAgent: 'webkit'
        };

        function noop(){}

        var __gwtModuleFunction = noop;
        __gwtModuleFunction.__moduleStartupDone = noop;
        var $sendStats = noop;
        var $moduleName, $moduleBase;

        // Start GWT code 
var BS='object',CS='anonymous',DS='fnStack',ES='\n',FS={4:1,10:1,7:1},GS='Unknown',HS='boolean',IS='number',JS='string',KS=2147483647,LS='__java$exception',MS='For input string: "',NS='null',OS=524288,PS=1048576,QS='__noinit__',RS={4:1,12:1,14:1},SS=65536,TS=65535,US=10000,VS='fromIndex: 0, toIndex: ',WS=', length: ',XS='fromIndex: ',YS={6:1,4:1},ZS=16777215,$S=0.30000001192092896,_S={13:1,4:1},aT={11:1,4:1},bT=536870912,cT=2.617993878,dT=3.665191429,eT=6.283185307179586,fT=3.141592653589793,gT=1.5707963267948966,hT=4096,iT=2048,jT=1920,kT=1024,lT=234881024,mT=100663296,nT=201326592,oT=114688,pT=16384,qT=4063232,rT=2097152,sT=393216,tT=29360128,uT=268435456,vT=-1.5707963267948966,wT=32640,xT=1572864,yT=229376,zT=1.0471975511965976,AT=0.5235987755982988,BT={4:1,7:1},CT=262144,DT={22:1,4:1,10:1,7:1},ET={4:1,18:1,7:1},FT={4:1},GT=-16777216,HT={8:1,4:1},IT=131072,JT=8192,KT=-65536,LT={4:1,10:1,27:1,18:1,7:1,28:1},MT='??',NT={72:1,4:1,10:1,7:1},OT=-268435456,PT=65011712,QT=3072,RT=126976,ST=1.7976931348623157E308,TT=67108864,UT=134217728,VT=16777216,WT=-66584577,XT=-3.141592653589793,YT=0.7853981633974483,ZT=3.061592653589793,$T={9:1,4:1,7:1},_T='ATOMS',aU='M  END',bU='$$$$',cU='M  V30 ',dU=')\n',eU='M  V30 MDLV30/STEREL',fU='M  V30 MDLV30/STERAC',gU=3.4028234663852886E38,hU=4194303,iU=239060990,jU='" ',kU='stroke-width:',lU='class="event" ',mU='Assignment of aromatic double bonds failed',nU='Members of ESR groups must only be stereo centers with known configuration.',oU='Ambiguous configuration at stereo center because of 2 parallel bonds',pU=-0.5235987755982988,qU=-1.0471975511965976,rU=-0.7853981633974483,sU=2.0943951023931953,tU=0.17453292519943295,uU='Over- or under-specified stereo feature or more than one racemic type bond',vU='undefined',wU=0.08726646502812703,xU='Too many percent/per mille characters in pattern "',yU=1048575,zU=4194304,AU=17592186044416,BU=-17592186044416,CU='CSS1Compat',DU=5.56,EU=11.12,FU=13.34,GU=14.44,HU=1.52587890625E-5,IU={4:1,10:1,18:1,7:1},JU={25:1,45:1},KU={55:1},LU=15525485,MU=5.9604644775390625E-8,NU={4:1,25:1,46:1,38:1},OU='Invalid UTF8 sequence';var fS={};var gS={};var hS={};var iS={};var jS={};var kS={};var lS={};var mS={};var nS={};var oS={};var pS={};var qS={};var rS={};var sS={};var tS={};var uS={};var vS={};var wS={};var xS={};var yS={};var zS={};var AS={};var _;var jH;var dH;var DG=-1;fS.EG=function EG(){};function iH(a,b){typeof window===BS&&typeof window['$gwt']===BS&&(window['$gwt'][a]=b)}
function hH(b,c,d,e){fS.gH();var f=dH;$moduleName=c;$moduleBase=d;DG=e;function g(){for(var a=0;a<f.length;a++){f[a]()}}
if(b){try{eS(g)()}catch(a){b(c,a)}}else{eS(g)()}}
fS.gH=function gH(){dH==null&&(dH=[])};function fH(){fS.gH();var a=dH;for(var b=0;b<arguments.length;b++){a.push(arguments[b])}}
fS.eH=function eH(){};function uH(){}
function tH(a){if(Array.isArray(a)&&a.Kb===uH){return gS.Ac(a)}return a.toString()}
function sH(a,b){var c=$wnd;if(a===''){return c}var d=a.split('.');!(d[0] in c)&&c.execScript&&c.execScript('var '+d[0]);for(var e;d.length&&(e=d.shift());){c=c[e]=c[e]||!d.length&&b||{}}return c}
fS.rH=function rH(a){function b(){}
;b.prototype=a||{};return new b};fS.qH=function qH(a){return a instanceof Array?a[0]:null};function pH(){}
function oH(a,b){for(var c in b){b[c]['configurable']=true}Object.defineProperties(a,b)}
function nH(a,b,c){var d=jH;var e=d[a];var f=fS.qH(e);if(e&&!f){_=e}else{_=fS.mH(b);_.Jb=c;_.constructor=_;!b&&(_.Kb=uH);d[a]=_}for(var g=3;g<arguments.length;++g){arguments[g].prototype=_}f&&(_.Ib=f)}
fS.mH=function mH(a){var b=a&&a.prototype;!b&&(b=jH[a]);return fS.rH(b)};function lH(){jH={};!Array.isArray&&(Array.isArray=function(a){return Object.prototype.toString.call(a)==='[object Array]'})}
fS.kH=function kH(){};lH();gS.pc=function pc(a,b){return a===b};gS.qc=function qc(a){return a.Ib};gS.rc=function rc(a){return jS.UR(a)};function sc(){}
gS.uc=function uc(a,b){return FD(a)?gS.sK(a,b):CD(a)?gS.uJ(a,b):BD(a)?gS.yI(a,b):zD(a)?a.ab(b):QC(a)?gS.pc(a,b):hS.YA(a,b)};gS.wc=function wc(a){return FD(a)?gS.uK():CD(a)?gS.vJ():BD(a)?gS.zI():zD(a)?a.Ib:QC(a)?gS.qc(a):hS.ZA(a)};gS.yc=function yc(a){return FD(a)?gS.vK(a):CD(a)?gS.wJ(a):BD(a)?gS.AI(a):zD(a)?a.cb():QC(a)?gS.rc(a):hS.$A(a)};gS.Ac=function Ac(a){return gS.SI(gS.wc(a))+'@'+gS.XJ(gS.yc(a),16)};nH(1,null,{},sc);_.ab=function tc(a){return gS.pc(this,a)};_.bb=function vc(){return gS.qc(this)};_.cb=function xc(){return gS.rc(this)};_.db=function zc(){return gS.SI(gS.wc(this))+'@'+gS.XJ(gS.yc(this),16)};_.equals=function(a){return this.ab(a)};_.hashCode=function(){return this.cb()};_.toString=function(){return this.db()};hS.YA=function YA(a,b){return hS.cB(a)?hS._A(a,b):ID(a)===ID(b)};hS.ZA=function ZA(a){return a.Ib||Array.isArray(a)&&IC(fS.UE,1)||fS.UE};hS.$A=function $A(a){return hS.dB(a)?hS.aB(a):jS.UR(a)};hS._A=function _A(a,b){return a.equals(b)};hS.aB=function aB(a){return a.hashCode()};hS.bB=function bB(){return []};hS.cB=function cB(a){return !!a&&!!a.equals};hS.dB=function dB(a){return !!a&&!!a.hashCode};hS.eB=function eB(a){return a.toString?a.toString():'[JavaScriptObject]'};iS.JB=function JB(){iS.JB=pH;var a,b;b=!iS.SB();a=new iS._B;iS.IB=b?new iS.TB:a};iS.KB=function KB(a){iS.JB();iS.IB.ob(a)};iS.LB=function LB(a){iS.JB();var b;b=iS.IB.pb(a);return iS.MB(b)};iS.MB=function MB(a){var b,c,d,e;b='KB';c='AA';e=gS.bK(a.length,5);for(d=e-1;d>=0;d--){if(gS.sK(a[d].d,b)||gS.sK(a[d].d,c)){a.length>=d+1&&jS.hR(a,0,d+1);break}}return a};iS.NB=function NB(a){var b=/function(?:\s+([\w$]+))?\s*\(/;var c=b.exec(a);return c&&c[1]||CS};iS.OB=function OB(a){iS.JB();return a&&a[DS]?a[DS]:[]};iS.PB=function PB(a){iS.JB();return a.name||(a.name=iS.NB(a.toString()))};iS.QB=function QB(a){iS.JB();return parseInt(a)||-1};iS.RB=function RB(a){iS.JB();var b=a.backingJsObject;return b&&b.stack?b.stack.split(ES):[]};iS.SB=function SB(){if(Error.stackTraceLimit>0){$wnd.Error.stackTraceLimit=Error.stackTraceLimit=64;return true}return 'stack' in new Error};nH(170,1,{});iS.TB=function TB(){};nH(124,170,{},iS.TB);_.ob=function UB(a){var b={};var c=[];a[DS]=c;var d=arguments.callee.caller;while(d){var e=iS.PB(d);c.push(e);var f=':'+e;var g=b[f];if(g){var h,i;for(h=0,i=g.length;h<i;h++){if(g[h]===d){return}}}(g||(b[f]=[])).push(d);d=d.caller}};_.pb=function VB(a){var b,c,d,e;d=iS.OB(a);c=hS.jB(d);e=OC(fS.IF,FS,39,c,0,1);for(b=0;b<c;b++){e[b]=new gS.iK(hS.iB(d,b),null,-1)}return e};iS.WB=function WB(a,b){var c,d,e,f,g,h,i,j,k;if(gS.GK(b).length==0){return a.qb(GS,CS,-1,-1)}k=gS.DK(b);gS.sK(gS.GK(k).substr(0,3),'at ')&&(k=gS.GK(k).substr(3,gS.GK(k).length-3));k=iS.XB(k);g=gS.GK(k).indexOf('(');if(g==-1){g=gS.GK(k).indexOf('@');if(g==-1){j=k;k=''}else{j=gS.DK(gS.GK(k).substr(g+1,gS.GK(k).length-(g+1)));k=gS.DK(gS.GK(k).substr(0,g))}}else{c=gS.GK(k).indexOf(')',g);j=gS.GK(k).substr(g+1,c-(g+1));k=gS.DK(gS.GK(k).substr(0,g))}g=gS.wK(k,FK(46));g!=-1&&(k=gS.GK(k).substr(g+1,gS.GK(k).length-(g+1)));(gS.GK(k).length==0||gS.sK(k,'Anonymous function'))&&(k=CS);h=gS.zK(j,FK(58));e=gS.AK(j,FK(58),h-1);i=-1;d=-1;f=GS;if(h!=-1&&e!=-1){f=gS.GK(j).substr(0,e);i=iS.QB(gS.GK(j).substr(e+1,h-(e+1)));d=iS.QB(gS.GK(j).substr(h+1,gS.GK(j).length-(h+1)))}return a.qb(f,k,i,d)};iS.XB=function XB(a){return a.replace(/\[.*?\]/g,'')};nH(171,170,{});_.ob=function YB(a){};_.qb=function ZB(a,b,c,d){return new gS.iK(b,a+'@'+d,c<0?-1:c)};_.pb=function $B(a){var b,c,d,e,f,g;e=iS.RB(a);f=OC(fS.IF,FS,39,0,0,1);b=0;d=hS.jB(e);if(d==0){return f}g=iS.WB(this,hS.iB(e,0));gS.sK(g.d,CS)||(f[b++]=g);for(c=1;c<d;c++){f[b++]=iS.WB(this,hS.iB(e,c))}return f};iS._B=function _B(){};nH(125,171,{},iS._B);_.qb=function aC(a,b,c,d){return new gS.iK(b,a,-1)};fS.HC=function HC(a){return a};function IC(a,b){return fS.JC(a,b)}
fS.JC=function JC(a,b){return gS.aJ(a,b)};fS.KC=function KC(a){return a.__elementTypeCategory$==null?10:a.__elementTypeCategory$};fS.LC=function LC(a){return a.__elementTypeId$};function MC(a,b,c,d,e,f){return fS.NC(a,b,c,d,e,0,f)}
fS.NC=function NC(a,b,c,d,e,f,g){var h,i,j,k,l;k=e[f];j=f==g-1;h=j?d:0;l=fS.PC(h,k);d!=10&&WC(IC(a,g-f),b[f],c[f],h,l);if(!j){++f;for(i=0;i<k;++i){fS.RC(l,i,fS.NC(a,b,c,d,e,f,g))}}return l};function OC(a,b,c,d,e,f){var g;g=fS.PC(e,d);e!=10&&WC(IC(a,f),b,c,e,g);return g}
fS.PC=function PC(a,b){var c=new Array(b);var d;switch(a){case 14:case 15:d=0;break;case 16:d=false;break;default:return c;}for(var e=0;e<b;++e){c[e]=d}return c};function QC(a){return Array.isArray(a)&&a.Kb===uH}
fS.RC=function RC(a,b,c){return a[b]=c};function SC(a,b,c){return fS.RC(a,b,c)}
fS.TC=function TC(a,b){a.Ib=b};fS.UC=function UC(a,b){a.__elementTypeCategory$=b};fS.VC=function VC(a,b){a.__elementTypeId$=b};function WC(a,b,c,d,e){fS.TC(e,a);e.Jb=b;e.Kb=uH;fS.VC(e,c);fS.UC(e,d);return e}
fS.XC=function XC(a,b){fS.KC(b)!=10&&WC(gS.wc(b),b.Jb,fS.LC(b),fS.KC(b),a);return fS.HC(a)};function yD(a,b){if(FD(a)){return !!xD[b]}else if(a.Jb){return !!a.Jb[b]}else if(CD(a)){return !!wD[b]}else if(BD(a)){return !!vD[b]}return false}
function zD(a){return !Array.isArray(a)&&a.Kb===uH}
function AD(a,b){return a!=null&&yD(a,b)}
function BD(a){return typeof a===HS}
function CD(a){return typeof a===IS}
function DD(a){return a!=null&&fS.GD(a)&&!(a.Kb===uH)}
function ED(a,b){return fS.HD(a,b)}
function FD(a){return typeof a===JS}
fS.GD=function GD(a){return typeof a===BS||typeof a==='function'};fS.HD=function HD(a,b){return a&&b&&a instanceof b};function ID(a){return a==null?null:a}
function JD(a){return Math.max(Math.min(a,KS),-2147483648)|0}
var vD;var wD;var xD;fS.FG=function FG(a){return a&&a[LS]};function GG(a){var b;if(AD(a,14)){return a}b=fS.FG(a);if(!b){b=new hS.SA(a);iS.KB(b)}return b}
function HG(a){return a.backingJsObject}
function kJ(a){var b;b=jS.PR(a);if(gS.sK(b,HS)||gS.sK(b,IS)||gS.sK(b,JS)){return true}return a!=null&&jS.IR(a)}
gS.vI=function vI(){gS.vI=pH;uI=gS.EI(false);gS.EI(true)};gS.wI=function wI(a,b){return CI(jS.QR((jS.yR(a),a)),jS.QR((jS.yR(b),b)))};gS.xI=function xI(a,b){return gS.wI(a,b)};gS.yI=function yI(a,b){return jS.yR(a),a===b};gS.zI=function zI(){return fS.sF};gS.AI=function AI(a){return jS.QR((jS.yR(a),a))?1231:1237};function BI(a){gS.vI();return gS.sK(HS,jS.PR(a))}
function CI(a,b){gS.vI();return a==b?0:a?1:-1}
gS.DI=function DI(a,b){gS.vI();return FD(a)?gS.nK(a,b):CD(a)?gS.tJ(a,b):BD(a)?gS.xI(a,b):a.fb(b)};gS.EI=function EI(a){return a};vD={4:1,121:1,25:1};var uI;function FI(a){if(gS.sK(jS.PR(a),JS)){return true}return a!=null&&jS.HR(a)}
gS.QI=function QI(a){a.g=OI++};gS.RI=function RI(a){if(a.k!=null){return}gS.eJ(a)};gS.SI=function SI(a){gS.RI(a);return a.k};gS.TI=function TI(a){return (a.e&4)!=0};gS.UI=function UI(a){return (a.e&1)!=0};gS.VI=function VI(){gS.QI(this);this.k=null;this.i=null;this.f=null;this.d=null;this.b=null;this.j=null;this.a=null};gS.XI=function XI(a){var b;b=new gS.VI;b.k='Class$'+(a?'S'+a:''+b.g);b.b=b.k;b.i=b.k;return b};function YI(a){var b;b=gS.XI(a);gS.iJ(a,b);return b}
function ZI(a,b){var c;c=gS.XI(a);gS.iJ(a,c);c.e=b?8:0;return c}
function $I(a){var b;b=gS.XI(a);b.j=a;b.e=1;return b}
gS.aJ=function aJ(a,b){var c=a.a=a.a||[];return c[b]||(c[b]=a.rb(b))};function cJ(a){if(a.wb()){return null}var b=a.j;var c=jH[b];return c}
gS.eJ=function eJ(a){if(a.vb()){var b=a.c;b.wb()?(a.k='['+b.j):!b.vb()?(a.k='[L'+b.tb()+';'):(a.k='['+b.tb());a.b=b.sb()+'[]';a.i=b.ub()+'[]';return}var c=a.f;var d=a.d;d=d.split('/');a.k=gS.hJ('.',[c,gS.hJ('$',d)]);a.b=gS.hJ('.',[c,gS.hJ('.',d)]);a.i=d[d.length-1]};gS.hJ=function hJ(a,b){var c=0;while(!b[c]||b[c]==''){c++}var d=b[c++];for(;c<b.length;c++){if(!b[c]||b[c]==''){continue}d+=a+b[c]}return d};gS.iJ=function iJ(a,b){var c;if(!a){return}b.j=a;var d=cJ(b);if(!d){jH[a]=[b];return}d.Ib=b};nH(81,1,{},gS.VI);_.rb=function WI(a){var b;b=new gS.VI;b.e=4;a>1?(b.c=gS.aJ(this,a-1)):(b.c=this);return b};_.sb=function _I(){gS.RI(this);return this.b};_.tb=function bJ(){return gS.SI(this)};_.ub=function dJ(){gS.RI(this);return this.i};_.vb=function fJ(){return gS.TI(this)};_.wb=function gJ(){return gS.UI(this)};_.db=function jJ(){return ((this.e&2)!=0?'interface ':(this.e&1)!=0?'':'class ')+(gS.RI(this),this.k)};_.e=0;_.g=0;var OI=1;gS.mJ=function mJ(a){return gS.sK(IS,jS.PR(a))||gS.qJ(a)};gS.nJ=function nJ(a){gS.lJ==null&&(gS.lJ=gS.pJ());if(!gS.lJ.test(a)){throw HG(new gS.hK(MS+a+'"'))}return gS.rJ(a)};gS.oJ=function oJ(a){var b,c,d,e,f;if(a==null){throw HG(new gS.hK(NS))}d=gS.GK(a).length;e=d>0&&(gS.GK(a).charCodeAt(0)==45||gS.GK(a).charCodeAt(0)==43)?1:0;for(b=e;b<d;b++){if(II(gS.GK(a).charCodeAt(b))==-1){throw HG(new gS.hK(MS+a+'"'))}}f=jS.MR(a,10);c=f<-2147483648;if(jS.KR(f)){throw HG(new gS.hK(MS+a+'"'))}else if(c||f>KS){throw HG(new gS.hK(MS+a+'"'))}return f};gS.pJ=function pJ(){return /^\s*[+-]?(NaN|Infinity|((\d+\.?\d*)|(\.\d+))([eE][+-]?\d+)?[dDfF]?)\s*$/};gS.qJ=function qJ(a){return a instanceof Number};gS.rJ=function rJ(a){return parseFloat(a)};nH(73,1,{4:1,73:1});gS.sJ=function sJ(a,b){return yJ(jS.RR((jS.yR(a),a)),jS.RR((jS.yR(b),b)))};gS.tJ=function tJ(a,b){return gS.sJ(a,b)};gS.uJ=function uJ(a,b){return jS.yR(a),a===b};gS.vJ=function vJ(){return fS.uF};gS.wJ=function wJ(a){return JD(jS.RR((jS.yR(a),a)))};function xJ(a){return gS.sK(IS,jS.PR(a))}
function yJ(a,b){if(a<b){return -1}if(a>b){return 1}if(a==b){return 0}return jS.KR(a)?jS.KR(b)?0:1:-1}
function zJ(a){var b,c,d,e,f,g;if(jS.KR(a)){return {l:0,m:0,h:524160}}g=false;if(a==0){return 1/a==-Infinity?{l:0,m:0,h:OS}:0}if(a<0){g=true;a=-a}if(!jS.KR(a)&&!jS.JR(a)){return g?{l:0,m:0,h:1048320}:{l:0,m:0,h:524032}}c=0;if(a<1){b=512;for(d=0;d<10;++d,b>>=1){if(a<(gS.CJ(),gS.AJ)[d]&&c-b>=-1023){a*=gS.BJ[d];c-=b}}if(a<1&&c-1>=-1023){a*=2;--c}}else if(a>=2){b=512;for(d=0;d<10;++d,b>>=1){if(a>=(gS.CJ(),gS.BJ)[d]){a*=gS.AJ[d];c+=b}}}c>-1023?(a-=1):(a*=0.5);e=TG(a*PS);a-=bH(e)*9.5367431640625E-7;f=TG(a*4503599627370496);e=ZG(e,fS.RG(c+1023<<20));g&&(e=ZG(e,2147483648));return ZG($G(e,32),f)}
wD={4:1,25:1,122:1,73:1};gS.mA=function mA(a){a.g=OC(fS.IF,FS,39,0,0,1)};gS.nA=function nA(a){iS.KB(a)};gS.oA=function oA(a){return iS.LB(a)};gS.pA=function pA(a){if(a.j){a.backingJsObject!==QS&&a.mb();a.g=null}return a};gS.qA=function qA(a,b,c){var d,e,f,g,h;gS.rA(a);for(e=(a.i==null&&(a.i=OC(fS.NF,FS,14,0,0,1)),a.i),f=0,g=e.length;f<g;++f){d=e[f];gS.qA(d,b,'\t'+c)}h=a.e;!!h&&gS.qA(h,b,c)};gS.rA=function rA(a){var b,c,d;for(b=(a.g==null&&(a.g=gS.oA(a)),a.g),c=0,d=b.length;c<d;++c);};gS.sA=function sA(a,b){a.backingJsObject=b;b!=null&&jS.OR(b,LS,a)};gS.tA=function tA(a){return gS.uA(a,a.lb())};gS.uA=function uA(a,b){var c;c=gS.SI(a.Ib);return b==null?c:c+': '+b};gS.vA=function vA(){gS.mA(this);gS.pA(this);this.mb()};gS.wA=function wA(a){gS.mA(this);this.f=a;gS.pA(this);this.mb()};gS.yA=function yA(b){if(!('stack' in b)){try{throw b}catch(a){}}return b};function BA(a){var b;if(a!=null){b=jS.GR(a,LS);if(b){return b}}return ED(a,$wnd.TypeError)?new gS.eK(a):new gS.KA(a)}
nH(14,1,{4:1,14:1});_.kb=function xA(a){return new $wnd.Error(a)};_.lb=function zA(){return this.f};_.mb=function AA(){var a,b,c;c=this.f==null?null:gS.GK(this.f).replace(new $wnd.RegExp(ES,'g'),' ');b=(a=gS.SI(this.Ib),c==null?a:a+': '+c);gS.sA(this,gS.yA(this.kb(b)));gS.nA(this)};_.db=function CA(){return gS.tA(this)};_.backingJsObject=QS;_.j=true;gS.DA=function DA(){gS.vA.call(this)};gS.EA=function EA(a){gS.mA(this);gS.pA(this);this.backingJsObject=a;a!=null&&jS.OR(a,LS,this);this.f=a==null?NS:tH(a)};gS.FA=function FA(a){gS.wA.call(this,a)};nH(12,14,RS,gS.FA);gS.QJ=function QJ(a,b){return SJ(a.a,b.a)};gS.RJ=function RJ(a){this.a=a};function SJ(a,b){return a<b?-1:a>b?1:0}
gS.XJ=function XJ(a,b){return (a>>>0).toString(b)};gS.YJ=function YJ(a){var b,c;if(a>-129&&a<128){b=a+128;c=(gS.$J(),gS.ZJ)[b];!c&&(c=gS.ZJ[b]=new gS.RJ(a));return c}return new gS.RJ(a)};nH(30,73,{4:1,25:1,30:1,73:1},gS.RJ);_.fb=function TJ(a){return gS.QJ(this,a)};_.ab=function UJ(a){return AD(a,30)&&a.a==this.a};_.cb=function VJ(){return this.a};_.db=function WJ(){return ''+this.a};_.a=0;gS.GA=function GA(){gS.DA.call(this)};gS.HA=function HA(a){gS.EA.call(this,a)};gS.IA=function IA(a){gS.FA.call(this,a)};nH(26,12,RS);gS.JA=function JA(){gS.GA.call(this)};gS.KA=function KA(a){gS.HA.call(this,a)};gS.LA=function LA(a){gS.IA.call(this,a)};nH(50,26,RS,gS.KA);gS.dK=function dK(){gS.JA.call(this)};gS.eK=function eK(a){gS.KA.call(this,a)};gS.fK=function fK(a){gS.LA.call(this,a)};nH(67,50,RS,gS.dK,gS.eK,gS.fK);_.kb=function gK(a){return new $wnd.TypeError(a)};gS.mK=function mK(a,b){return gS.GK(a).charCodeAt(b)};gS.nK=function nK(a,b){return gS.oK(a,b)};gS.oK=function oK(a,b){return jS.FR((jS.yR(a),a),(jS.yR(b),b))};gS.pK=function pK(a,b){return gS.oK(gS.GK(a).toLowerCase(),gS.GK(b).toLowerCase())};gS.qK=function qK(a,b){return jS.yR(a),a+(jS.yR(b),b)};gS.rK=function rK(a){var b;return gS.HK(jS.pR(a,0,(b=a.length,jS.mR(),b)))};gS.sK=function sK(a,b){return jS.yR(a),a===b};gS.tK=function tK(a,b){jS.yR(a);if(b==null){return false}if(gS.sK(a,b)){return true}return gS.GK(a).length==gS.GK(b).length&&gS.sK(gS.GK(a).toLowerCase(),gS.GK(b).toLowerCase())};gS.uK=function uK(){return fS.MF};gS.vK=function vK(a){return jS.aS(a)};gS.wK=function wK(a,b){return gS.GK(a).indexOf(b)};gS.xK=function xK(a,b,c){return gS.GK(a).indexOf(b,c)};function yK(a){return gS.sK(JS,jS.PR(a))}
gS.zK=function zK(a,b){return gS.GK(a).lastIndexOf(b)};gS.AK=function AK(a,b,c){return gS.GK(a).lastIndexOf(b,c)};gS.BK=function BK(a,b){return gS.GK(a).substr(b,gS.GK(a).length-b)};gS.CK=function CK(a,b,c){return gS.GK(a).substr(b,c-b)};gS.DK=function DK(a){var b,c,d;c=gS.GK(a).length;d=0;while(d<c&&gS.GK(a).charCodeAt(d)<=32){++d}b=c;while(b>d&&gS.GK(a).charCodeAt(b-1)<=32){--b}return d>0||b<c?gS.GK(a).substr(d,b-d):a};gS.EK=function EK(a){return String.fromCharCode.apply(null,a)};function FK(a){var b,c;if(a>=SS){b=55296+(a-SS>>10&1023)&TS;c=56320+(a-SS&1023)&TS;return String.fromCharCode(b)+(''+String.fromCharCode(c))}else{return String.fromCharCode(a&TS)}}
gS.GK=function GK(a){return a};gS.HK=function HK(a){return gS.IK(a,a.length)};gS.IK=function IK(a,b){var c,d,e;jS.DR(b,a.length);e='';for(d=0;d<b;){c=d+US<b?d+US:b;e+=gS.EK(jS.jR(a,d,c));d=c}return e};xD={4:1,82:1,25:1,2:1};jS.tR=function tR(a){if(!a){throw HG(new gS.NJ)}};jS.uR=function uR(a,b){if(0>a){throw HG(new gS.OJ('fromIndex: 0 > toIndex: '+a))}if(a>b){throw HG(new gS.tI(VS+a+WS+b))}};jS.vR=function vR(a){if(a<0){throw HG(new gS.cK('Negative array size: '+a))}};jS.wR=function wR(a){if(!a){throw HG(new AS.cP)}};jS.xR=function xR(a,b){if(a<0||a>=b){throw HG(new gS.rI('Index: '+a+', Size: '+b))}};jS.yR=function yR(a){if(a==null){throw HG(new gS.dK)}return a};jS.zR=function zR(a,b){if(a==null){throw HG(new gS.fK(b))}};jS.AR=function AR(a,b){if(a<0||a>b){throw HG(new gS.rI('Index: '+a+', Size: '+b))}};jS.BR=function BR(a,b,c){if(a<0||b>c){throw HG(new gS.rI(XS+a+', toIndex: '+b+', size: '+c))}if(a>b){throw HG(new gS.OJ(XS+a+' > toIndex: '+b))}};jS.CR=function CR(a){if(!a){throw HG(new gS.PJ)}};jS.DR=function DR(a,b){if(a>b||a<0){throw HG(new gS.UK(VS+a+WS+b))}};jS.ER=function ER(a){jS.yR(a);return a};jS.FR=function FR(a,b){return a==b?0:a<b?-1:1};jS.GR=function GR(a,b){return a[b]};jS.HR=function HR(a){return a.$implements__java_lang_CharSequence};jS.IR=function IR(a){return a.$implements__java_lang_Comparable};jS.JR=function JR(a){return isFinite(a)};jS.KR=function KR(a){return isNaN(a)};jS.LR=function LR(a){return a===undefined};jS.MR=function MR(a,b){return parseInt(a,b)};jS.NR=function NR(a,b,c){a[b]=c};jS.OR=function OR(b,c,d){try{b[c]=d}catch(a){}};jS.PR=function PR(a){return typeof a};jS.QR=function QR(a){return a};jS.RR=function RR(a){return a};jS.UR=function UR(a){return a.$H||(a.$H=jS.VR())};jS.VR=function VR(){return ++jS.TR};jS.TR=0;jS.ZR=function ZR(){jS.ZR=pH;jS.WR=jS._R();jS.YR=jS._R()};jS.$R=function $R(a){var b,c,d,e;b=0;d=gS.GK(a).length;e=d-4;c=0;while(c<e){b=gS.GK(a).charCodeAt(c+3)+31*(gS.GK(a).charCodeAt(c+2)+31*(gS.GK(a).charCodeAt(c+1)+31*(gS.GK(a).charCodeAt(c)+31*b)));b=b|0;c+=4}while(c<d){b=b*31+gS.mK(a,c++)}b=b|0;return b};jS._R=function _R(){return {}};jS.aS=function aS(a){jS.ZR();var b,c,d;c=':'+a;d=jS.bS(jS.YR,c);if(!jS.LR(d)){return jS.dS(d)}d=jS.bS(jS.WR,c);b=jS.LR(d)?jS.$R(a):jS.dS(d);jS.cS();jS.NR(jS.YR,c,b);return b};jS.bS=function bS(a,b){return a[b]};jS.cS=function cS(){if(jS.XR==256){jS.WR=jS.YR;jS.YR=jS._R();jS.XR=0}++jS.XR};jS.dS=function dS(a){return a};jS.XR=0;fS.GF=YI(1);fS.UE=YI(0);fS._E=YI(170);fS.YE=YI(124);fS.$E=YI(171);fS.ZE=YI(125);fS.sF=YI(121);fS.tF=YI(81);fS.FF=YI(73);fS.uF=YI(122);fS.NF=YI(14);fS.wF=YI(12);fS.AF=YI(30);fS.HF=YI(26);fS.BF=YI(50);fS.DF=YI(67);fS.MF=YI(2);kS.Nc=function Nc(){kS.Nc=pH;kS.Bc=WC(IC(fS.OD,1),YS,5,15,[0,ZS,14286847,13402367,12779264,16758197,9474192,3166456,16715021,9494608,11789301,11230450,9109248,12560038,15780000,16744448,16777008,2093087,8442339,9388244,4062976,15132390,12567239,10921643,9083335,10255047,14706227,15765664,5296208,13140019,8224944,12750735,6721423,12419299,16752896,10889513,6076625,7351984,65280,9764863,9756896,7586505,5551541,3907230,2396047,687500,27013,12632256,16767375,10909043,6717568,10380213,13924864,9699476,4366000,5707663,51456,7394559,16777159,14286791,13107143,10747847,9437127,6422471,4587463,3211207,2097095,65436,58997,54354,48952,43812,5096191,5089023,2200790,2522539,2516630,1528967,13684960,16765219,12105936,10900557,5724513,10375093,11230208,7688005,4358806,4325478,32000,7384058,47871,41471,36863,33023,27647,5528818,7888099,9064419,10565332,11739092,11739066,11734438,12389767,13041766,13369433,13697103,14221381,14680120,15073326,15400998,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,13158600,1334015,56540,15075850,15132160,56540,15075850,15461355,8553170,1016335,1016335,1334015,15132160,3289770,14456450,16422400,16422400,11819700,3289770,1016335]);kS.Ec=new vS.GH(255,128,0);kS.Dc=new vS.GH(92,160,255);kS.Mc=new vS.GH(160,0,64);kS.Cc=new vS.GH(255,160,255);kS.Fc=new vS.GH(32,96,255);kS.Lc=new vS.GH(255,0,0);kS.Ic=new vS.GH(0,255,0);kS.Jc=new vS.GH(192,0,255);kS.Kc=new vS.GH(255,160,0);kS.Gc=new vS.GH(0,128,0);kS.Hc=new vS.GH(160,0,0)};kS.Oc=function Oc(a){a.t=new wS.bI};kS.Pc=function Pc(a){var b,c;if((a.B&32)!=0)return;c=kS.To(a.H);if(c!=null){if(a.u.a==0&&a.u.b==0){b=a.L.c*kS.bi(a.H);kS.Id(a);kS.Yc(a,b);kS.Fd(a,null,b,0)}kS.no(a,JD(a.v));kS.Gd(a,448);kS.ho(a,c,a.u.a,a.u.b+$S*a.v)}};kS.Qc=function Qc(a,b){return a==null?b:a+','+b};kS.Rc=function Rc(a){var b;b=a.L.c*kS.bi(a.H);a.S=b*0.06;a.N=b*0.15;a.M=b*0.38;a.Q=b*0.47;a.R=JD(b*a.F*0.6+0.5);a.P=b*0.12;a.T=b*0.4;a.v=b*0.5+0.5};kS.Sc=function Sc(a,b,c,d){var e,f;e=new kS.Od;f=new kS.Od;e.a=b.a;e.c=b.c;e.b=(b.a+b.b)/2;e.d=(b.c+b.d)/2;f.a=e.b;f.c=e.d;f.b=b.b;f.d=b.d;if(kS.Cd(a,e)){kS.Gd(a,a.o[c]);kS.eo(a,e)}if(kS.Cd(a,f)){kS.Gd(a,a.o[d]);kS.eo(a,f)}kS.Gd(a,a.K)};kS.Tc=function Tc(a,b,c,d){var e,f,g,h,i;h=(b.b-b.a)/10;i=(b.d-b.c)/10;e=new kS.Od;if(kS.Hi(a.H,kS.Ek(a.H,c,d))){f=-3;g=-3}else{f=a.o[c];g=a.o[d]}kS.Gd(a,f);e.a=b.a;e.c=b.c;e.b=b.a+h*2;e.d=b.c+i*2;kS.eo(a,e);e.a=b.a+h*4;e.c=b.c+i*4;e.b=b.a+h*5;e.d=b.c+i*5;kS.eo(a,e);kS.Gd(a,g);e.a=b.a+h*5;e.c=b.c+i*5;e.b=b.a+h*6;e.d=b.c+i*6;kS.eo(a,e);e.a=b.a+h*8;e.c=b.c+i*8;e.b=b.b;e.d=b.d;kS.eo(a,e);kS.Gd(a,a.K)};kS.Uc=function Uc(a,b,c){kS.io(a,b-a.P/2,c-a.P/2,a.P)};kS.Vc=function Vc(a,b,c,d){if(kS.Hi(a.H,kS.Ek(a.H,c,d))){kS.Gd(a,-3);kS.eo(a,b);kS.Gd(a,a.K)}else if(a.o[c]!==a.o[d]){kS.Sc(a,b,c,d)}else if(a.o[c]!=0){kS.Gd(a,a.o[c]);kS.eo(a,b);kS.Gd(a,a.K)}else{kS.eo(a,b)}};kS.Wc=function Wc(a,b,c,d){var e,f,g,h,i,j,k,l,m,n,o,p;l=b.b-b.a;o=b.d-b.c;i=$wnd.Math.sqrt(l*l+o*o);j=2*cH(TG($wnd.Math.round(i/(4*a.S))));m=l/(j-1);p=o/(j-1);if(kS.Hi(a.H,kS.Ek(a.H,c,d))){e=-3;f=-3}else{e=a.o[c];f=a.o[d]}k=b.a-a.S/2;n=b.c-a.S/2;kS.Gd(a,e);for(h=0;h<(j/2|0);h++){kS.io(a,k,n,a.S);k+=m;n+=p}kS.Gd(a,f);for(g=0;g<(j/2|0);g++){kS.io(a,k,n,a.S);k+=m;n+=p}kS.Gd(a,a.K)};kS.Xc=function Xc(a,b,c,d){var e,f,g,h,i,j,k,l;k=(b.c-b.d)/9;l=(b.b-b.a)/9;g=OC(fS.MD,_S,5,3,15,1);h=OC(fS.MD,_S,5,3,15,1);i=OC(fS.MD,_S,5,4,15,1);j=OC(fS.MD,_S,5,4,15,1);g[0]=b.a;h[0]=b.c;i[2]=b.b+k;j[2]=b.d+l;i[3]=b.b-k;j[3]=b.d-l;g[1]=(g[0]+i[2])/2;h[1]=(h[0]+j[2])/2;g[2]=(g[0]+i[3])/2;h[2]=(h[0]+j[3])/2;i[0]=g[2];j[0]=h[2];i[1]=g[1];j[1]=h[1];if(kS.Hi(a.H,kS.Ek(a.H,c,d))){e=-3;f=-3}else{e=a.o[c];f=kS._c(a,c);e==kS.Mh(a.H,c)&&(e=f)}kS.Gd(a,e);kS.go(a,g,h,3);kS.Gd(a,f);kS.go(a,i,j,4);kS.Gd(a,a.K)};kS.Yc=function Yc(a,b){var c,d;for(d=0;d<a.U.a.length;d++)a.t=wS._H(a.t,AS.LN(a.U,d));kS.Zc(a,b);c=0.1*b;a.t.c-=c;a.t.d-=c;a.t.b+=2*c;a.t.a+=2*c};kS.Zc=function Zc(a,b){var c,d,e,f,g,h,i;e=OC(fS.CG,aT,5,a.H.o,16,1);for(d=0;d<a.H.p;d++){if(kS.Fi(a.H,d)){e[kS.ei(a.H,0,d)]=true;e[kS.ei(a.H,1,d)]=true}}g=new wS.bI;for(c=0;c<a.H.o;c++){f=(kS.Xh(a.H,c)&bT)!=0?b*0.47:e[c]?b*0.38:0;if(f!=0){h=kS.Rg(a.L,kS.Zh(a.H,c));i=kS.Sg(a.L,kS.$h(a.H,c));wS.aI(g,h-f,i-f,f*2,f*2);a.t=wS._H(a.t,g)}}};kS.$c=function $c(a){var b,c;b=(vS.BH(),vS.xH);c=new vS.FH(a);return pS.fA(c,b)};kS._c=function _c(a,b){var c,d;if((a.B&128)!=0)return a.o[b];d=kS.ad(a,b);if(d==-1){c=kS.ok(a.H,b);if(c!=-1){b=c;d=kS.ad(a,c)}}if(d==-1)return a.o[b];switch(d&255){case 1:return 384;case 2:return 64;default:return 448;}};kS.ad=function ad(a,b){var c,d,e;e=-1;d=-1;if((a.B&128)!=0)return -1;if(kS.Di(a.H,b)){e=kS.Qh(a.H,b);d=kS.Ph(a.H,b)}c=kS.pk(a.H,b);if(c!=-1){e=kS.ji(a.H,c);d=kS.ii(a.H,c)}e!=-1&&e!=0&&(e|=d<<8);return e};kS.bd=function bd(a){var b,c,d,e;kS.mo(a,2*a.M);e=new kS.Od;for(d=0;d<a.H.p;d++){b=kS.ei(a.H,0,d);c=kS.ei(a.H,1,d);if(kS.Fi(a.H,d)){e.a=kS.Rg(a.L,kS.Zh(a.H,b));e.c=kS.Sg(a.L,kS.$h(a.H,b));e.b=kS.Rg(a.L,kS.Zh(a.H,c));e.d=kS.Sg(a.L,kS.$h(a.H,c));kS.Gd(a,-2);kS.eo(a,e)}}};kS.cd=function cd(a){var b,c,d,e,f,g;if(a.H.I){g=a.Q;kS.Gd(a,-7);for(b=0;b<a.H.d;b++)(kS.Xh(a.H,b)&bT)!=0&&kS.io(a,kS.Rg(a.L,kS.Zh(a.H,b))-g,kS.Sg(a.L,kS.$h(a.H,b))-g,2*g);kS.mo(a,2*a.Q);f=new kS.Od;for(e=0;e<a.H.p;e++){c=kS.ei(a.H,0,e);d=kS.ei(a.H,1,e);if((kS.Xh(a.H,c)&kS.Xh(a.H,d)&bT)!=0){f.a=kS.Rg(a.L,kS.Zh(a.H,c));f.c=kS.Sg(a.L,kS.$h(a.H,c));f.b=kS.Rg(a.L,kS.Zh(a.H,d));f.d=kS.Sg(a.L,kS.$h(a.H,d));kS.eo(a,f)}}}};kS.dd=function dd(a){var b,c,d,e;if(a.H.I){kS.Gd(a,320);if((a.B&8)!=0)for(b=0;b<a.H.d;b++)(kS.Xh(a.H,b)&-536870913)!=0&&kS.io(a,kS.Rg(a.L,kS.Zh(a.H,b))-a.T/2,kS.Sg(a.L,kS.$h(a.H,b))-a.T/2,a.T);for(e=0;e<a.H.e;e++){if(kS.oi(a.H,e)!=0){c=kS.ei(a.H,0,e);d=kS.ei(a.H,1,e);kS.io(a,(kS.Rg(a.L,kS.Zh(a.H,c))+kS.Rg(a.L,kS.Zh(a.H,d))-a.T)/2,(kS.Sg(a.L,kS.$h(a.H,c))+kS.Sg(a.L,kS.$h(a.H,d))-a.T)/2,a.T)}}}};kS.ed=function ed(a){a.F=1;a.L=new kS.Tg;a.U=new AS.ZN;a.O=new AS.ZN;a.q=OC(fS.CG,aT,5,a.H.o,16,1);a.u=new wS.RH;a.K=0;a.w=-1;kS.Kd(a)};kS.fd=function fd(a,b){var c;if(kS.tk(a.H,b)==0)return false;for(c=0;c<kS.tk(a.H,b);c++)if(!kS.Hi(a.H,kS.Ik(a.H,b,c)))return false;return true};kS.gd=function gd(a){var b;a.p=OC(fS.CG,aT,5,a.H.o,16,1);for(b=0;b<a.H.p;b++){a.p[kS.ei(a.H,0,b)]=true;a.p[kS.ei(a.H,1,b)]=true}};kS.hd=function hd(a,b){var c;if(kS.Hk(a.H,b)!=2)return false;for(c=0;c<2;c++)if(kS.Jk(a.H,b,c)!=2)return false;return true};kS.jd=function jd(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o;m=false;e.a=0;e.b=0;d>0?(f=cT):(f=dT);o=kS.di(a.H,b,c);for(k=0;k<kS.Hk(a.H,b);k++){g=kS.Ik(a.H,b,k);h=o;kS.ei(a.H,0,g)==b?(l=kS.ei(a.H,1,g)):(l=kS.ei(a.H,0,g));if(l==c)continue;n=kS.di(a.H,b,l);o<n&&(h+=eT);i=h-n;if(d>0){i<fT&&(m=true);i>cT&&(i=cT);i<0.523598776&&(i=0.523598776);if(i<=f){f=i;j=a.N*$wnd.Math.tan(i-gT)/2;e.a=-(j*$wnd.Math.sin(h));e.b=-(j*$wnd.Math.cos(h))}}else{i>=fT&&(m=true);i<dT&&(i=dT);i>5.759586531&&(i=5.759586531);if(i>=f){f=i;j=a.N*$wnd.Math.tan(4.712388981-i)/2;e.a=-(j*$wnd.Math.sin(h));e.b=-(j*$wnd.Math.cos(h))}}}return m};kS.kd=function kd(a,b,c,d){var e;if(b==0){c<0?(d.a=a.N):(d.a=-a.N);d.b=0;return}e=$wnd.Math.atan(c/b);b<0&&(e+=fT);d.a=-(a.N*$wnd.Math.sin(e));d.b=a.N*$wnd.Math.cos(e)};kS.ld=function ld(a,b,c,d){var e,f,g,h,i,j,k,l,m,n,o,p;e=new kS.Od;i=new kS.Od;k=new wS.RH;j=new wS.RH;g=kS.ei(a.H,0,c);h=kS.ei(a.H,1,c);if(d){m=b.a;b.a=b.b;b.b=m;m=b.c;b.c=b.d;b.d=m;n=g;g=h;h=n}if(!kS.Cd(a,b))return;if(kS.vl(a.H,c)){e.a=b.a;e.c=b.c;e.b=b.b;e.d=b.d;l=d?-kS.Bd(a,c):kS.Bd(a,c);l==0&&(l=1);kS.kd(a,b.b-b.a,b.d-b.c,k);if(l>0){i.a=b.a+k.a;i.c=b.c+k.b;i.b=b.b+k.a;i.d=b.d+k.b;if(kS.jd(a,g,h,1,j)||kS.Hk(a.H,g)>1){i.a+=j.a+k.b;i.c+=j.b-k.a}}else{i.a=b.a-k.a;i.c=b.c-k.b;i.b=b.b-k.a;i.d=b.d-k.b;if(kS.jd(a,g,h,-1,j)||kS.Hk(a.H,g)>1){i.a+=j.a+k.b;i.c+=j.b-k.a}}kS.pi(a.H,c)==26&&kS.Ad(e,i);kS.Cd(a,e)&&kS.Vc(a,e,g,h);kS.pi(a.H,c)==64?kS.Cd(a,i)&&kS.Tc(a,i,g,h):kS.Cd(a,i)&&kS.Vc(a,i,g,h)}else{kS.kd(a,b.b-b.a,b.d-b.c,k);o=k.a/2;p=k.b/2;f=false;e.a=b.a+o;e.c=b.c+p;e.b=b.b+o;e.d=b.d+p;if(kS.Hk(a.H,g)>1){if(kS.jd(a,g,h,1,j)){e.a+=j.a;e.c+=j.b;if(kS.Hk(a.H,g)==2){if(j.a!=0||j.b!=0){e.a+=k.b;e.c-=k.a}}}else{a.n[g]=new wS.SH(e.a,e.c)}}i.a=b.a-o;i.c=b.c-p;i.b=b.b-o;i.d=b.d-p;if(kS.Hk(a.H,g)>1){if(kS.jd(a,g,h,0,j)){i.a+=j.a;i.c+=j.b;if(kS.Hk(a.H,g)==2){if(j.a!=0||j.b!=0){i.a+=k.b;i.c-=k.a}}}else{a.n[g]=new wS.SH(i.a,i.c);f=true}}kS.pi(a.H,c)==26&&kS.Ad(e,i);if(kS.pi(a.H,c)==64){if(f){kS.Tc(a,e,g,h);kS.Vc(a,i,g,h)}else{kS.Vc(a,e,g,h);kS.Tc(a,i,g,h)}}else{kS.Vc(a,e,g,h);kS.Vc(a,i,g,h)}}};
kS.md=function md(a){var b,c,d,e,f,g,h,i,j,k,l;a.n=OC(fS.fF,FS,36,a.H.o,0,1);for(h=0;h<a.H.p;h++)(kS.pi(a.H,h)==2||kS.pi(a.H,h)==26||kS.pi(a.H,h)==64)&&kS.pd(a,h);for(i=0;i<a.H.p;i++)kS.pi(a.H,i)!=2&&kS.pi(a.H,i)!=26&&kS.pi(a.H,i)!=64&&kS.pd(a,i);if((a.B&64)==0){for(g=0;g<a.H.p;g++){if(kS.hi(a.H,g)!=0){switch(kS.hi(a.H,g)){case 1:d=kS.mi(a.H,g)==2?'E':kS.Ji(a.H,g)?'p':'P';break;case 2:d=kS.mi(a.H,g)==2?'Z':kS.Ji(a.H,g)?'m':'M';break;default:d='?';}kS.no(a,(a.R*2+1)/3|0);kS.Gd(a,kS.Hi(a.H,g)?-3:448);b=kS.ei(a.H,0,g);c=kS.ei(a.H,1,g);k=(kS.Rg(a.L,kS.Zh(a.H,b))+kS.Rg(a.L,kS.Zh(a.H,c)))/2;l=(kS.Sg(a.L,kS.$h(a.H,b))+kS.Sg(a.L,kS.$h(a.H,c)))/2;e=(kS.Rg(a.L,kS.Zh(a.H,b))-kS.Rg(a.L,kS.Zh(a.H,c)))/3;f=(kS.Sg(a.L,kS.$h(a.H,b))-kS.Sg(a.L,kS.$h(a.H,c)))/3;kS.sd(a,k+f,l-e,d,true);kS.Gd(a,a.K);kS.no(a,a.R)}}}if((a.B&4)!=0){kS.no(a,(a.R*2+1)/3|0);kS.Gd(a,384);for(g=0;g<a.H.p;g++){b=kS.ei(a.H,0,g);c=kS.ei(a.H,1,g);j=kS.rl(a.H,g)?'d':kS.pl(a.H,g)?'a':'';k=(kS.Rg(a.L,kS.Zh(a.H,b))+kS.Rg(a.L,kS.Zh(a.H,c)))/2;l=(kS.Sg(a.L,kS.$h(a.H,b))+kS.Sg(a.L,kS.$h(a.H,c)))/2;kS.sd(a,k,l,j+(''+g),true)}kS.Gd(a,a.K);kS.no(a,a.R)}};kS.nd=function nd(a){var b,c;for(c=new AS.tO(a.O);c.a<c.c.a.length;){b=AS.sO(c);kS.Gd(a,b.a);kS.Uc(a,b.b,b.c)}kS.Gd(a,a.K)};kS.od=function od(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W;a.G||kS.jo(a,b,(kS.Rh(a.H,b),kS.Rg(a.L,kS.Zh(a.H,b))),kS.Sg(a.L,kS.$h(a.H,b)));I=null;if(kS.Lh(a.H,b)!=0){Q=gS._J(kS.Lh(a.H,b))==1?'':''+gS._J(kS.Lh(a.H,b));I=kS.Lh(a.H,b)<0?Q+'-':Q+'+'}A=null;J=kS.Xh(a.H,b);if(J!=0){(J&2)!=0&&(A='a');(J&4)!=0&&(A=A==null?'!a':A+','+'!a');(J&hT)!=0&&(A=A==null?'s':A+','+'s');(J&iT)!=0&&(A=A==null?'!s':A+','+'!s');if((J&jT)!=0){t=J&jT;t==1792?(A=A==null?'h0':A+','+'h0'):t==1664?(A=A==null?'h1':A+','+'h1'):t==1408?(A=A==null?'h2':A+','+'h2'):t==128?(A=A==null?'h>0':A+','+'h>0'):t==384?(A=A==null?'h>1':A+','+'h>1'):t==896?(A=A==null?'h>2':A+','+'h>2'):t==kT?(A=A==null?'h<3':A+','+'h<3'):t==1536&&(A=A==null?'h<2':A+','+'h<2')}if((J&lT)!=0){h=J&lT;h==167772160?(A=A==null?'c0':A+','+'c0'):h==mT?(A=A==null?'c+':A+','+'c+'):h==nT&&(A=A==null?'c-':A+','+'c-')}if((J&oT)!=0){H=J&oT;H==98304?(A=A==null?'pi0':A+','+'pi0'):H==81920?(A=A==null?'pi1':A+','+'pi1'):H==49152?(A=A==null?'pi2':A+','+'pi2'):H==pT&&(A=A==null?'pi>0':A+','+'pi>0')}if((J&qT)!=0){G=J&qT;G==3801088?(A=A==null?'n1':A+','+'n1'):G==3538944?(A=A==null?'n2':A+','+'n2'):G==3014656?(A=A==null?'n3':A+','+'n3'):G==3145728?(A=A==null?'n<3':A+','+'n<3'):G==rT?(A=A==null?'n<4':A+','+'n<4'):G==sT?(A=A==null?'n>1':A+','+'n>1'):G==917504?(A=A==null?'n>2':A+','+'n>2'):G==1966080&&(A=A==null?'n>3':A+','+'n>3')}if((J&120)!=0){M=J&120;M==112?(A=A==null?'!r':A+','+'!r'):M==8?(A=A==null?'r':A+','+'r'):M==104?(A=A==null?'rb2':A+','+'rb2'):M==88?(A=A==null?'rb3':A+','+'rb3'):M==56&&(A=A==null?'rb4':A+','+'rb4')}(J&tT)!=0&&(A=A==null?'r'+((J&tT)>>22):A+','+('r'+((J&tT)>>22)));(J&uT)!=0&&(A=A==null?'f':A+','+'f')}kS.Vh(a.H,b)!=0&&(A=kS.Qc(A,''+kS.Vh(a.H,b)));P=0;if(kS.Yh(a.H,b)!=0){switch(kS.Yh(a.H,b)){case 16:I=I==null?'|':I+','+'|';break;case 32:P=1;break;case 48:P=2;}}k=null;if((a.B&64)==0){if(kS.Ai(a.H,b))k='?';else if(kS.Kh(a.H,b)!=0){if(kS.Hk(a.H,b)==2){switch(kS.Kh(a.H,b)){case 2:k=kS.Ci(a.H,b)?'p':'P';break;case 1:k=kS.Ci(a.H,b)?'m':'M';break;default:k='*';}}else{switch(kS.Kh(a.H,b)){case 1:k=kS.Ci(a.H,b)?'r':'R';break;case 2:k=kS.Ci(a.H,b)?'s':'S';break;default:k='*';}}}}(a.B&1792)!=0&&(k=kS.Qc(k,''+kS.$o(a.H,b)));D=null;(a.B&16)!=0&&kS.Uh(a.H,b)!=0&&(D=''+kS.Uh(a.H,b));o=null;if(kS.el(a.H,b)!=-1){n=kS.ad(a,b);n!=-1&&(o=n==0?'abs':((n&255)==1?'&':'or')+(1+(n>>8)))}u=0;a.H.I?((kS.ai(a.H,b)!=6||!a.p[b])&&(kS.Xh(a.H,b)&iT)!=0&&kS.Lh(a.H,b)!=0||kS.Yh(a.H,b)!=0)&&(u=kS.Tk(a.H,b)):(kS.ai(a.H,b)!=6||!a.p[b]||kS.Yh(a.H,b)!=0)&&(u=kS.Tk(a.H,b));e=kS.Nh(a.H,b);if(e!=null){u=0}else if(kS.Sh(a.H,b)!=null){d=(kS.Xh(a.H,b)&1)!=0?'[!':'[';e=d+kS.Th(a.H,b)+']';gS.GK(e).length>5&&(e=d+kS.Sh(a.H,b).length+']');(kS.Xh(a.H,b)&iT)!=0&&(u=-1)}else if((kS.Xh(a.H,b)&1)!=0){e='?';(kS.Xh(a.H,b)&iT)!=0&&(u=-1)}else (kS.ai(a.H,b)!=6||I!=null||A!=null||u>0||!a.p[b])&&(e=kS.Rh(a.H,b));C=0;!kS.Si(a.H,b)&(kS.Xh(a.H,b)&bT)!=0&&kS.Gd(a,-8);if(e!=null){C=(K=(R=vS.MH(a.e,e),new wS.cI(0,0,R,0)).b,K);kS.sd(a,kS.Rg(a.L,kS.Zh(a.H,b)),kS.Sg(a.L,kS.$h(a.H,b)),e,true);a.q[b]=true}else kS.hd(a,b)&&kS.rd(a,kS.Rg(a.L,kS.Zh(a.H,b)),kS.Sg(a.L,kS.$h(a.H,b)),b);if(I!=null){kS.no(a,(a.R*2+1)/3|0);T=kS.Rg(a.L,kS.Zh(a.H,b))+((C+(K=(R=vS.MH(a.e,I),new wS.cI(0,0,R,0)).b,K))/2+1);V=kS.Sg(a.L,kS.$h(a.H,b))-((a.j*4-4)/8|0);kS.sd(a,T,V,I,true);kS.no(a,a.R)}(a.B&2)!=0&&(A=''+b);if(A!=null){kS.no(a,(a.R*2+1)/3|0);T=kS.Rg(a.L,kS.Zh(a.H,b))-(C+(K=(R=vS.MH(a.e,A),new wS.cI(0,0,R,0)).b,K))/2;V=kS.Sg(a.L,kS.$h(a.H,b))-((a.j*4-4)/8|0);kS.sd(a,T,V,A,true);kS.no(a,a.R)}if(k!=null){kS.no(a,(a.R*2+1)/3|0);T=kS.Rg(a.L,kS.Zh(a.H,b))-(C+(K=(R=vS.MH(a.e,k),new wS.cI(0,0,R,0)).b,K))/2;V=kS.Sg(a.L,kS.$h(a.H,b))+((a.j*4+4)/8|0);O=a.w;kS.Gd(a,448);kS.sd(a,T,V,k,false);kS.Gd(a,O);kS.no(a,a.R)}if(D!=null){kS.no(a,(a.R*2+1)/3|0);T=kS.Rg(a.L,kS.Zh(a.H,b))+((C+(K=(R=vS.MH(a.e,D),new wS.cI(0,0,R,0)).b,K))/2+1);V=kS.Sg(a.L,kS.$h(a.H,b))+((a.j*4+4)/8|0);O=a.w;kS.Gd(a,kS.Ei(a.H,b)?384:448);kS.sd(a,T,V,D,true);kS.Gd(a,O);kS.no(a,a.R)}if(o!=null){c=kS.wd(a,b);kS.no(a,(a.R*2+1)/3|0);T=kS.Rg(a.L,kS.Zh(a.H,b))+0.7*a.j*$wnd.Math.sin(c);V=kS.Sg(a.L,kS.$h(a.H,b))+0.7*a.j*$wnd.Math.cos(c);O=a.w;kS.Gd(a,kS._c(a,b));kS.sd(a,T,V,o,false);kS.Gd(a,O);kS.no(a,a.R)}if(u==0&&P==0){a.w==-8&&kS.Gd(a,-9);return}r=OC(fS.MD,_S,5,4,15,1);for(w=0;w<kS.uk(a.H,b);w++){g=kS.Ik(a.H,b,w);for(B=0;B<2;B++){if(kS.ei(a.H,B,g)==b){N=kS.di(a.H,kS.ei(a.H,B,g),kS.ei(a.H,1-B,g));if(N<vT){r[0]-=N+gT;r[3]+=N+fT}else if(N<0){r[2]+=N+gT;r[3]-=N}else if(N<gT){r[1]+=N;r[2]+=gT-N}else{r[0]+=N-gT;r[1]+=fT-N}}}}kS.Hk(a.H,b)==0?kS.Li(a.H,b)?(r[3]-=0.2):(r[1]-=0.2):(r[1]-=0.1);(I!=null||D!=null)&&(r[1]+=10);(A!=null||k!=null)&&(r[3]+=10);p='';if(u!=0){s=(L=(S=vS.MH(a.e,'H'),new wS.cI(0,0,S,0)).b,L);q=0;if(u==-1){p='n';kS.no(a,(a.R*2+1)/3|0);q=(K=(R=vS.MH(a.e,'n'),new wS.cI(0,0,R,0)).b,K)}else if(u>1){p=''+u;kS.no(a,(a.R*2+1)/3|0);q=(K=(R=vS.MH(a.e,p),new wS.cI(0,0,R,0)).b,K)}if(r[1]<0.6||r[3]<0.6){j=kS.Sg(a.L,kS.$h(a.H,b));if(r[1]<=r[3]){r[1]+=10;i=kS.Rg(a.L,kS.Zh(a.H,b))+(C+s)/2}else{r[3]+=10;i=kS.Rg(a.L,kS.Zh(a.H,b))-(C+s)/2-q}}else{i=kS.Rg(a.L,kS.Zh(a.H,b));if(r[0]<r[2]){r[0]+=10;j=kS.Sg(a.L,kS.$h(a.H,b))-a.j}else{r[2]+=10;j=kS.Sg(a.L,kS.$h(a.H,b))+a.j}}if(q>0){T=i+(s+q)/2;V=j+((a.j*4+4)/8|0);kS.sd(a,T,V,p,true);kS.no(a,a.R)}kS.sd(a,i,j,'H',true)}f=0;if(P!=0){F=50;l=0;for(v=0;v<4;v++){m=v>1?v-2:v+2;if(r[v]<F){f=v;F=r[v];l=r[m]}else if(r[v]==F){if(r[m]>l){f=v;l=r[m]}}}switch(f){case 0:i=kS.Rg(a.L,kS.Zh(a.H,b));j=kS.Sg(a.L,kS.$h(a.H,b))-a.P-C/2;break;case 1:i=kS.Rg(a.L,kS.Zh(a.H,b))+a.P+C/2;j=kS.Sg(a.L,kS.$h(a.H,b));break;case 2:i=kS.Rg(a.L,kS.Zh(a.H,b));j=kS.Sg(a.L,kS.$h(a.H,b))+a.P+C/2;break;default:i=kS.Rg(a.L,kS.Zh(a.H,b))-a.P-C/2;j=kS.Sg(a.L,kS.$h(a.H,b));}if(P==1){AS.GN(a.U,new wS.cI(i-a.P,j-a.P,2*a.P,2*a.P));a.G||AS.GN(a.O,new kS.Nd(i,j,kS.fd(a,b)?-3:a.o[b]))}else{switch(f){case 2:case 0:U=2*a.P;W=0;i-=a.P;break;case 1:U=0;W=2*a.P;j-=a.P;break;default:U=0;W=2*a.P;j-=a.P;}AS.GN(a.U,new wS.cI(i-a.P,j-a.P,2*a.P,2*a.P));a.G||AS.GN(a.O,new kS.Nd(i,j,kS.fd(a,b)?-3:a.o[b]));AS.GN(a.U,new wS.cI(i+U-a.P,j+W-a.P,2*a.P,2*a.P));a.G||AS.GN(a.O,new kS.Nd(i+U,j+W,kS.fd(a,b)?-3:a.o[b]))}}a.w==-8&&kS.Gd(a,-9)};kS.pd=function pd(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p;n=new kS.Od;c=new kS.Od;f=new kS.Od;l=new wS.RH;k=new wS.RH;d=kS.ei(a.H,0,b);e=kS.ei(a.H,1,b);((kS.Xh(a.H,d)|kS.Xh(a.H,e))&bT)!=0;kS.ko(a,d,e,kS.Rg(a.L,kS.Zh(a.H,d)),kS.Sg(a.L,kS.$h(a.H,d)),kS.Rg(a.L,kS.Zh(a.H,e)),kS.Sg(a.L,kS.$h(a.H,e)));!kS.Si(a.H,d)&&!kS.Si(a.H,e)&&((kS.Xh(a.H,d)|kS.Xh(a.H,e))&bT)!=0&&kS.Gd(a,-8);if(!a.n[d]){n.a=kS.Rg(a.L,kS.Zh(a.H,d));n.c=kS.Sg(a.L,kS.$h(a.H,d))}else{n.a=a.n[d].a;n.c=a.n[d].b}if(!a.n[e]){n.b=kS.Rg(a.L,kS.Zh(a.H,e));n.d=kS.Sg(a.L,kS.$h(a.H,e))}else{n.b=a.n[e].a;n.d=a.n[e].b}if((kS.oi(a.H,b)&wT)!=0){kS.Cd(a,n)&&kS.fo(a,n);kS.Gd(a,-9);return}g=kS.pi(a.H,b)==64?0:kS.pi(a.H,b)==32?1:kS.mi(a.H,b);switch(g){case 1:switch(kS.pi(a.H,b)){case 1:kS.Cd(a,n)&&kS.Vc(a,n,d,e);break;case 17:kS.yd(a,n,d,e);break;case 9:o=n.b-n.a;p=n.d-n.c;if(kS.Hi(a.H,kS.Ek(a.H,d,e))){h=-3;i=-3}else{h=a.o[d];i=kS._c(a,d);h==kS.Mh(a.H,d)&&(h=i)}for(j=2;j<17;j+=2){c.a=n.a+j*o/17-j*p/128;c.c=n.c+j*p/17+j*o/128;c.b=n.a+j*o/17+j*p/128;c.d=n.c+j*p/17-j*o/128;if(kS.Cd(a,c)){kS.Gd(a,j<9?h:i);kS.eo(a,c);kS.Gd(a,a.K)}}break;case 32:kS.Cd(a,n)&&kS.Wc(a,n,d,e);}break;case 0:case 2:if((a.q[d]||kS.xk(a.H,d)==2)&&(a.q[e]||kS.xk(a.H,e)==2)&&!kS.vl(a.H,b)&&g==2){if(!kS.Cd(a,n))break;kS.kd(a,n.b-n.a,n.d-n.c,l);o=l.a/2;p=l.b/2;c.a=n.a+o;c.c=n.c+p;c.b=n.b+o;c.d=n.d+p;f.a=n.a-o;f.c=n.c-p;f.b=n.b-o;f.d=n.d-p;kS.pi(a.H,b)==26&&kS.Ad(c,f);kS.Vc(a,c,d,e);kS.Vc(a,f,d,e)}else if((a.q[e]||kS.xk(a.H,e)==2)&&g==2){kS.ld(a,n,b,false)}else if((a.q[d]||kS.xk(a.H,d)==2)&&g==2){kS.ld(a,n,b,true)}else{m=kS.Bd(a,b);m==0&&(m=1);c.a=n.a;c.c=n.c;c.b=n.b;c.d=n.d;kS.kd(a,n.b-n.a,n.d-n.c,l);if(m>0){f.a=n.a+l.a;f.c=n.c+l.b;f.b=n.b+l.a;f.d=n.d+l.b;if(kS.jd(a,d,e,1,k)||kS.Hk(a.H,d)>1){f.a+=k.a+l.b;f.c+=k.b-l.a}if(kS.jd(a,e,d,-1,k)||kS.Hk(a.H,e)>1){f.b+=k.a-l.b;f.d+=k.b+l.a}}else{f.a=n.a-l.a;f.c=n.c-l.b;f.b=n.b-l.a;f.d=n.d-l.b;if(kS.jd(a,d,e,-1,k)||kS.Hk(a.H,d)>1){f.a+=k.a+l.b;f.c+=k.b-l.a}if(kS.jd(a,e,d,1,k)||kS.Hk(a.H,e)>1){f.b+=k.a-l.b;f.d+=k.b+l.a}}kS.pi(a.H,b)==26&&kS.Ad(c,f);kS.Cd(a,c)&&kS.Vc(a,c,d,e);g==2?kS.Cd(a,f)&&kS.Vc(a,f,d,e):kS.Cd(a,f)&&kS.Tc(a,f,d,e)}break;case 3:if(kS.Cd(a,n)){kS.Vc(a,n,d,e);kS.kd(a,n.b-n.a,n.d-n.c,l);c.a=n.a+l.a;c.c=n.c+l.b;c.b=n.b+l.a;c.d=n.d+l.b;kS.Vc(a,c,d,e);c.a=n.a-l.a;c.c=n.c-l.b;c.b=n.b-l.a;c.d=n.d-l.b;kS.Vc(a,c,d,e)}}a.w==-8&&kS.Gd(a,-9)};kS.qd=function qd(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r;o=false;for(d=0;d<a.H.e;d++){j=null;if(kS.Gi(a.H,d)){l=kS.gi(a.H,d);k=kS.fi(a.H,d);j=l==k?'['+l+']':'['+l+':'+k+']'}else (kS.oi(a.H,d)&xT)!=0?(j=(kS.oi(a.H,d)&xT)==OS?'a':(kS.oi(a.H,d)&96)==64?'r!a':'!a'):(kS.oi(a.H,d)&96)!=0&&(j=(kS.oi(a.H,d)&96)==64?'r':'!r');n=(kS.oi(a.H,d)&yT)>>15;n!=0&&(j=(j==null?'':j)+n);if(j!=null){b=kS.ei(a.H,0,d);c=kS.ei(a.H,1,d);if(!o){kS.no(a,(a.R*2+1)/3|0);o=true}q=(kS.Rg(a.L,kS.Zh(a.H,b))+kS.Rg(a.L,kS.Zh(a.H,c)))/2;r=(kS.Sg(a.L,kS.$h(a.H,b))+kS.Sg(a.L,kS.$h(a.H,c)))/2;f=kS.Rg(a.L,kS.Zh(a.H,c))-kS.Rg(a.L,kS.Zh(a.H,b));g=kS.Sg(a.L,kS.$h(a.H,c))-kS.Sg(a.L,kS.$h(a.H,b));e=$wnd.Math.sqrt(f*f+g*g);i=(m=(p=vS.MH(a.e,j),new wS.cI(0,0,p,0)).b,0.6*m);h=0.55*a.j;e!=0&&(f>0?kS.sd(a,q+i*g/e,r-h*f/e,j,true):kS.sd(a,q-i*g/e,r+h*f/e,j,true))}}o&&kS.no(a,a.R)};kS.rd=function rd(a,b,c,d){AS.GN(a.U,new wS.cI(b-a.P,c-a.P,2*a.P,2*a.P));a.G||AS.GN(a.O,new kS.Nd(b,c,kS.fd(a,d)?-3:a.o[d]))};kS.sd=function sd(a,b,c,d,e){var f,g,h,i,j;if(e){g=(f=(h=vS.MH(a.e,d),new wS.cI(0,0,h,0)).b,f);i=g/2+(a.j/8|0);j=a.j/2|0;(d=='+'||d=='-')&&(j=j*2/3);AS.GN(a.U,new wS.cI(b-i,c-j,2*i,2*j))}a.G||kS.ho(a,d,b,c)};kS.td=function td(a){var b;b=a.a;a.a=a.b;a.b=b;b=a.c;a.c=a.d;a.d=b};kS.ud=function ud(a,b,c){var d;d=b==0?eT+a[0]-a[a.length-1]:a[b]-a[b-1];c>-2.0943951023931953&&c<zT?(d-=2*$wnd.Math.cos(c+AT)):(d-=0.5*$wnd.Math.cos(c+AT));return d};kS.vd=function vd(a){var b;b=new wS.bI;if(a.a<=a.b){b.c=a.a;b.b=a.b-a.a}else{b.c=a.b;b.b=a.a-a.b}if(a.c<=a.d){b.d=a.c;b.a=a.d-a.c}else{b.d=a.d;b.a=a.c-a.d}return b};kS.wd=function wd(a,b){var c,d,e,f,g,h,i;c=OC(fS.MD,_S,5,kS.tk(a.H,b),15,1);for(e=0;e<kS.tk(a.H,b);e++)c[e]=kS.di(a.H,b,kS.Gk(a.H,b,e));AS.OO(c);f=kS.xd(c,0);g=kS.ud(c,0,f);for(d=1;d<c.length;d++){h=kS.xd(c,d);i=kS.ud(c,d,h);if(g<i){g=i;f=h}}return f};kS.xd=function xd(a,b){var c;if(b>0)return (a[b]+a[b-1])/2;c=fT+(a[0]+a[a.length-1])/2;return c>fT?c-eT:c};kS.yd=function yd(a,b,c,d){var e,f,g,h;h=new kS.Od;if(b.a==b.b&&b.c==b.d)return;h.a=b.a;h.c=b.c;h.b=b.b;h.d=b.d;g=kS.vd(h);for(e=0;e<a.U.a.length;e++){f=AS.LN(a.U,e);if(f.c>g.c+g.b||f.d>g.d+g.a||g.c>f.c+f.b||g.d>f.d+f.a)continue;if(kS.zd(a,h.a,h.c,e)){if(kS.zd(a,h.b,h.d,e))return;kS.Dd(a,h,0,e);kS.yd(a,h,c,d);return}if(kS.zd(a,h.b,h.d,e)){kS.Dd(a,h,1,e);kS.yd(a,h,c,d);return}}kS.Xc(a,h,c,d)};kS.zd=function zd(a,b,c,d){var e;if((a.B&1)!=0)return false;e=AS.LN(a.U,d);return b>e.c&&b<e.c+e.b&&c>e.d&&c<e.d+e.a};kS.Ad=function Ad(a,b){var c;c=a.b;a.b=b.b;b.b=c;c=a.d;a.d=b.d;b.d=c};kS.Bd=function Bd(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o;k=OC(fS.CG,aT,5,16,16,1);l=OC(fS.CG,aT,5,16,16,1);c=OC(fS.MD,_S,5,16,15,1);f=OC(fS.MD,_S,5,2,15,1);d=0;for(j=0;j<2;j++){e=kS.ei(a.H,j,b);for(m=0;m<kS.Hk(a.H,e);m++){h=kS.Ik(a.H,e,m);if(h==b)continue;if(d==4)return 0;k[d]=kS.pl(a.H,h);l[d]=kS.vl(a.H,h);c[d++]=kS.di(a.H,e,kS.Gk(a.H,e,m))}}f[0]=kS.di(a.H,kS.ei(a.H,0,b),kS.ei(a.H,1,b));if(f[0]<0){f[1]=f[0]+fT;g=false}else{f[1]=f[0];f[0]=f[1]-fT;g=true}n=0;for(i=0;i<d;i++){k[i]?(o=20):l[i]?(o=17):(o=16);c[i]>f[0]&&c[i]<f[1]?(n-=o):(n+=o)}return g?-n:n};kS.Cd=function Cd(a,b){var c,d,e,f,g,h;if(b.a==b.b&&b.c==b.d){for(e=0;e<a.U.a.length;e++){g=AS.LN(a.U,e);if(wS.VH(g,b.a,b.c))return false}return true}h=kS.vd(b);c=false;if(b.a>b.b){kS.td(b);c=true}for(d=0;d<a.U.a.length;d++){g=AS.LN(a.U,d);if(g.c>h.c+h.b||g.d>h.d+h.a||h.c>g.c+g.b||h.d>g.d+g.a)continue;if(kS.zd(a,b.a,b.c,d)){if(kS.zd(a,b.b,b.d,d)){c&&kS.td(b);return false}kS.Dd(a,b,0,d);f=kS.Cd(a,b);c&&kS.td(b);return f}if(kS.zd(a,b.b,b.d,d)){kS.Dd(a,b,1,d);f=kS.Cd(a,b);c&&kS.td(b);return f}}c&&kS.td(b);return true};kS.Dd=function Dd(a,b,c,d){var e,f,g,h,i,j,k,l,m,n,o;if(c==0){l=b.a;n=b.c;m=b.b;o=b.d}else{l=b.b;n=b.d;m=b.a;o=b.c}k=AS.LN(a.U,d);i=m>l?k.c+k.b:k.c;j=o>n?k.d+k.a:k.d;e=m-l;f=o-n;if($wnd.Math.abs(e)>$wnd.Math.abs(f)){if(n==o){g=i;h=n}else{g=l+e*(j-n)/f;if(m>l==i>g){h=j}else{g=i;h=n+f*(i-l)/e}}}else{if(l==m){g=l;h=j}else{h=n+f*(i-l)/e;if(o>n==j>h){g=i}else{g=l+e*(j-n)/f;h=j}}}if(c==0){b.a=g;b.c=h}else{b.b=g;b.d=h}};kS.Ed=function Ed(a){var b,c,d;if(a.H.o==0)return;kS.Qo(a.H,(a.B&256)!=0?31:(a.B&512)!=0?47:(a.B&kT)!=0?79:15);kS.Rc(a);c=false;a.o=OC(fS.OD,YS,5,a.H.o,15,1);for(b=0;b<a.H.o;b++){a.o[b]=kS.Mh(a.H,b);a.o[b]!=0&&(c=true);kS.Si(a.H,b)&&(a.o[b]=128);kS.wi(a.H,b)&&(a.B&hT)==0&&(a.o[b]=256)}kS.Gd(a,-10);kS.cd(a);kS.bd(a);kS.dd(a);kS.Pc(a);kS.no(a,a.R);kS.mo(a,a.S);kS.Gd(a,a.K);kS.gd(a);a.O.a=OC(fS.GF,BT,1,0,5,1);a.U.a=OC(fS.GF,BT,1,0,5,1);for(d=0;d<a.H.o;d++){if(kS.fd(a,d)){kS.Gd(a,-3);kS.od(a,d);kS.Gd(a,a.K)}else if(a.o[d]!=0){kS.Gd(a,a.o[d]);kS.od(a,d);kS.Gd(a,a.K)}else if(!c&&kS.ai(a.H,d)!=1&&kS.ai(a.H,d)!=6&&(a.B&iT)==0&&kS.Sh(a.H,d)==null&&kS.ai(a.H,d)<kS.Bc.length){kS.Hd(a,kS.$c(kS.Bc[kS.ai(a.H,d)]));kS.od(a,d);kS.Gd(a,a.K)}else{kS.od(a,d)}}kS.nd(a);kS.qd(a);kS.md(a)};kS.Fd=function Fd(a,b,c,d){var e;e=c/2;switch(d&786432){case 786432:if(b){a.u.a=b.c+b.b/2;a.u.b=b.d+b.a-e;break}case 0:a.u.a=a.t.c+a.t.b/2;a.u.b=a.t.d+a.t.a+e;!!b&&a.u.b>b.d+b.a-e&&(a.u.b=b.d+b.a-e);break;case OS:if(b){a.u.a=b.c+b.b/2;a.u.b=b.d+e;break}case CT:a.u.a=a.t.c+a.t.b/2;a.u.b=a.t.d-e;!!b&&a.u.b<b.d+e&&(a.u.b=b.d+e);}};kS.Gd=function Gd(a,b){if(a.G)return;if(b==-10){a.w=-999;b=a.K}if(b==a.w)return;if(a.w==-8&&b!=-9)return;b==-8&&(a.J=a.w);b==-9&&(b=a.J);a.w=b;switch(b){case 0:kS.lo(a,(vS.BH(),vS.yH));break;case -6:kS.lo(a,a.A);break;case -4:kS.lo(a,a.I);break;case -2:kS.lo(a,a.r);break;case -3:kS.lo(a,a.s);break;case -7:kS.lo(a,a.C);break;case -8:kS.lo(a,a.D);break;case 64:kS.lo(a,kS.Fc);break;case 128:kS.lo(a,kS.Lc);break;case 256:kS.lo(a,kS.Jc);break;case 192:kS.lo(a,kS.Ic);break;case 320:kS.lo(a,kS.Kc);break;case 384:kS.lo(a,kS.Gc);break;case 448:kS.lo(a,kS.Hc);break;case 1:kS.lo(a,(vS.BH(),vS.zH));break;default:kS.lo(a,(vS.BH(),vS.yH));}};kS.Hd=function Hd(a,b){a.w=-5;a.d='rgb('+(b.c>>16&255)+','+(b.c>>8&255)+','+(b.c&255)+')'};kS.Id=function Id(a){var b,c,d,e,f;e=kS.Rg(a.L,kS.Zh(a.H,0));c=kS.Rg(a.L,kS.Zh(a.H,0));f=kS.Sg(a.L,kS.$h(a.H,0));d=kS.Sg(a.L,kS.$h(a.H,0));for(b=0;b<a.H.o;b++){e>kS.Rg(a.L,kS.Zh(a.H,b))&&(e=kS.Rg(a.L,kS.Zh(a.H,b)));c<kS.Rg(a.L,kS.Zh(a.H,b))&&(c=kS.Rg(a.L,kS.Zh(a.H,b)));f>kS.Sg(a.L,kS.$h(a.H,b))&&(f=kS.Sg(a.L,kS.$h(a.H,b)));d<kS.Sg(a.L,kS.$h(a.H,b))&&(d=kS.Sg(a.L,kS.$h(a.H,b)))}a.t=new wS.cI(e,f,c-e,d-f)};kS.Jd=function Jd(a,b){var c,d;if(a.H.o==0)return null;kS.Id(a);c=a.L.c*kS.bi(a.H);d=new kS.Ug(a.t,b,c);if(d.c==1&&d.a==0&&d.b==0){d=null}else{kS.Ng(d,a.L);kS.Pg(d,a.t)}kS.Fd(a,b,c,SS);return d};kS.Kd=function Kd(a){var b;b=(vS.BH(),vS.xH);a.r=pS.gA(b,kS.Dc);a.s=pS.fA(kS.Ec,b);a.C=kS.Cc;a.D=kS.Mc};kS.Ld=function Ld(a,b){var c,d,e,f;if(a.H.o==0)return null;e=kS.oo(a,b);kS.Qo(a.H,(a.B&256)!=0?31:(a.B&512)!=0?47:(a.B&kT)!=0?79:15);kS.gd(a);a.O.a=OC(fS.GF,BT,1,0,5,1);a.U.a=OC(fS.GF,BT,1,0,5,1);kS.Rc(a);kS.no(a,a.R);a.G=true;for(d=0;d<a.H.o;d++)kS.od(a,d);a.G=false;c=a.L.c*kS.bi(a.H);kS.Yc(a,c);kS.Fd(a,b,c,SS);if(wS.TH(b,a.t))return e;f=new kS.Ug(a.t,b,c);kS.Ng(f,a.L);kS.Pg(f,a.t);kS.Og(f,a.u);if(!e)return f;kS.Ng(f,e);return e};kS.Md=function Md(a,b){kS.Oc(this);this.H=a;this.B=b;kS.ed(this)};nH(129,1,{});_.v=0;_.w=0;_.B=0;_.F=0;_.G=false;_.J=0;_.K=0;_.M=0;_.N=0;_.P=0;_.Q=0;_.R=0;_.S=0;_.T=0;fS.SD=YI(129);kS.Nd=function Nd(a,b,c){this.b=a;this.c=b;this.a=c};nH(54,1,{54:1},kS.Nd);_.a=0;_.b=0;_.c=0;fS.QD=YI(54);kS.Od=function Od(){};nH(33,1,{},kS.Od);_.a=0;_.b=0;_.c=0;_.d=0;fS.RD=YI(33);kS.Pd=function Pd(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X;J=OC(fS.CG,aT,5,b.i.a.length,16,1);A=OC(fS.OD,YS,5,a.e.d,15,1);for(T=0;T<b.i.a.length;T++){J[T]=true;for(q=AS.LN(b.j,T),r=0,s=q.length;r<s;++r){t=q[r];if(!a.d[t]){J[T]=false;break}}if(J[T])for(d=AS.LN(b.i,T),g=0,j=d.length;g<j;++g){c=d[g];++A[c]}}I=OC(fS.CG,aT,5,a.e.d,16,1);for(U=0;U<b.i.a.length;U++){V=AS.LN(b.j,U).length;if(V==3||V==5||V==6||V==7){if(J[U]){for(e=AS.LN(b.i,U),h=0,k=e.length;h<k;++h){c=e[h];I[c]=true}Q=true;M=-1;N=0;for(f=AS.LN(b.i,U),i=0,l=f.length;i<l;++i){c=f[i];if(V==6||A[c]>1){if(!kS.Td(a,c,false)){Q=false;break}}else{S=V==5?kS.Qd(a,c,false):kS.Rd(a,c,false);if(kS.Td(a,c,false)){if(N<S){N=S;M=c}}else{if(N==10){Q=false;break}M=c;N=20}}}if(Q){for(d=AS.LN(b.i,U),g=0,j=d.length;g<j;++g){c=d[g];if(c==M){V==5?kS.Qd(a,c,true):kS.Rd(a,c,true);kS.ce(a,c)}else{kS.Td(a,c,true)}}}}}}w=OC(fS.OD,YS,5,a.e.d,15,1);C=OC(fS.CG,aT,5,a.e.d,16,1);for(p=0;p<a.e.e;p++){m=kS.ei(a.e,0,p);n=kS.ei(a.e,1,p);if(!I[m]&&!I[n]){if(a.d[p]){++w[m];++w[n]}if(kS.pi(a.e,p)==32){C[m]=true;C[n]=true}}}R=OC(fS.OD,YS,5,a.e.d,15,1);B=OC(fS.OD,YS,5,a.e.d,15,1);for(X=0;X<a.e.d;X++){if(w[X]==1){B[0]=X;v=0;D=0;while(v<=D){for(F=0;F<kS.Hk(a.e,B[v]);F++){if(a.d[kS.Ik(a.e,B[v],F)]){u=kS.Gk(a.e,B[v],F);if((v==0||u!=B[v-1])&&w[u]!=0){B[++D]=u;if((w[u]&1)!=0){for(L=1;L<D;L+=2)R[B[L]]=-1;D=0}break}}}++v}}}o=OC(fS.CG,aT,5,a.e.d,16,1);for(W=0;W<a.e.d;W++){if(!o[W]&&w[W]!=0){B[0]=W;o[W]=true;v=0;D=0;while(v<=D){for(F=0;F<kS.Hk(a.e,B[v]);F++){if(a.d[kS.Ik(a.e,B[v],F)]){u=kS.Gk(a.e,B[v],F);if(!o[u]){B[++D]=u;o[u]=true}}}++v}if((D&1)==0){for(G=0;G<=D;G++)R[B[G]]==0&&(R[B[G]]=kS.Sd(a,B[G],false));K=true;for(H=0;H<=D;H++){if(R[B[H]]<=0){if(!kS.Td(a,B[H],false)){K=false;break}}}if(K){P=0;O=-1;for(F=0;F<=D;F++){if(P<R[B[F]]){P=R[B[F]];O=B[F]}}if(P>0){kS.Sd(a,O,true);kS.ce(a,O)}}}}}};kS.Qd=function Qd(a,b,c){if(kS.ai(a.e,b)==7){if(kS.tk(a.e,b)==3)return 6;else if(kS.Hk(a.e,b)==2)return 4}else if(kS.ai(a.e,b)==8){return 10}else if(kS.ai(a.e,b)==15||kS.ai(a.e,b)==33){if(kS.Hk(a.e,b)==3)return 8}else if(kS.ai(a.e,b)==16||kS.ai(a.e,b)==34){if(kS.Hk(a.e,b)==2)return 12}else if(kS.ai(a.e,b)==6){c&&kS.kj(a.e,b,-1);return kS.tk(a.e,b)!=kS.uk(a.e,b)?2:3}return 0};kS.Rd=function Rd(a,b,c){if(a.a){if(kS.tk(a.e,b)!=3)return 0}else{if(kS.tk(a.e,b)>3)return 0}if(kS.ai(a.e,b)==6){c&&kS.kj(a.e,b,1);return 2}if(kS.ai(a.e,b)==5){return 4}return 0};kS.Sd=function Sd(a,b,c){if(kS.Lh(a.e,b)!=0)return 0;if(a.a){if(kS.ai(a.e,b)==5){if(kS.Yk(a.e,b)!=2)return 0;c&&kS.kj(a.e,b,1);return 1}if(kS.ai(a.e,b)==7){if(kS.Yk(a.e,b)!=2)return 0;c&&kS.kj(a.e,b,-1);return kS.Vd(a,b)?6:3}if(kS.ai(a.e,b)==8){if(kS.Yk(a.e,b)!=1)return 0;c&&kS.kj(a.e,b,-1);return kS.Vd(a,b)?7:4}if(kS.ai(a.e,b)==16){if(kS.Yk(a.e,b)!=1)return 0;c&&kS.kj(a.e,b,-1);return kS.Vd(a,b)?5:2}}else{if(kS.ai(a.e,b)==5){if(kS.Yk(a.e,b)>2)return 0;c&&kS.kj(a.e,b,1);return 1}if(kS.ai(a.e,b)==7){if(kS.Yk(a.e,b)>2)return 0;c&&kS.kj(a.e,b,-1);return kS.Vd(a,b)?5:3}if(kS.ai(a.e,b)==8){if(kS.Yk(a.e,b)>1)return 0;c&&kS.kj(a.e,b,-1);return kS.Vd(a,b)?7:4}if(kS.ai(a.e,b)==16){if(kS.Yk(a.e,b)>1)return 0;c&&kS.kj(a.e,b,-1);return kS.Vd(a,b)?5:2}}return 0};kS.Td=function Td(a,b,c){var d,e;d=kS.ai(a.e,b);if(d>=5&&d<=8||d==15||d==16||d==33||d==34){e=kS.Qk(a.e,b);if(e==1||e==2)return true;if(kS.Lh(a.e,b)==0){if((d==15||d==33)&&e==3){c&&kS.kj(a.e,b,1);return true}if((d==16||d==34)&&e==4){c&&kS.kj(a.e,b,1);return true}if(d==5&&e==0){c&&kS.kj(a.e,b,-1);return true}if((d==7||d==8)&&e==0){c&&kS.kj(a.e,b,1);return true}}}return false};kS.Ud=function Ud(a,b,c,d){var e;for(e=0;e<kS.Hk(a.e,b);e++)if(d[kS.Ik(a.e,b,e)]==1&&kS.Gk(a.e,b,e)!=c)return e;return -1};kS.Vd=function Vd(a,b){var c;for(c=0;c<kS.Hk(a.e,b);c++)if(kS.Oi(a.e,kS.Gk(a.e,b,c)))return true;return false};kS.Wd=function Wd(a,b,c){var d;for(d=0;d<kS.Hk(a.e,b);d++)if(c[kS.Ik(a.e,b,d)]>1)return true;return false};kS.Xd=function Xd(a,b){var c;for(c=0;c<kS.Hk(a.e,b);c++)if(a.d[kS.Ik(a.e,b,c)])return true;return false};kS.Yd=function Yd(a,b,c){var d,e,f,g,h,i,j,k,l,m,n;kS.Qo(a.e,1);if(b!=null){a.d=b}else{a.d=OC(fS.CG,aT,5,a.e.e,16,1);for(e=0;e<a.e.e;e++){if(kS.pi(a.e,e)==64){a.d[e]=true;kS.Nj(a.e,e,1)}}}a.f=0;j=OC(fS.CG,aT,5,a.e.d,16,1);for(f=0;f<a.e.e;f++){if(a.d[f]){++a.c;for(h=0;h<2;h++){if(!j[kS.ei(a.e,h,f)]){j[kS.ei(a.e,h,f)]=true;++a.b}}}}if(a.c==0)return true;a.a=false;a.e.I&&kS.$d(a);n=new kS.kn(a.e,1);c&&kS.Pd(a,n);kS.ee(a,n);kS.be(a,n);kS.de(a);kS._d(a);while(kS.ae(a,n))kS._d(a);while(a.c!=0){g=false;for(l=0;l<n.i.a.length;l++){if(AS.LN(n.j,l).length==6){k=true;m=AS.LN(n.j,l);for(i=0;i<6;i++){if(!a.d[m[i]]){k=false;break}}if(k){for(h=0;h<6;h+=2)kS.Zd(a,m[h]);g=true;break}}}if(!g){for(d=0;d<a.e.e;d++){if(a.d[d]){kS.Zd(a,d);kS._d(a);break}}}}return a.b==a.f};kS.Zd=function Zd(a,b){var c,d,e,f;if(kS.pi(a.e,b)==1){kS.Nj(a.e,b,2);a.f+=2}for(e=0;e<2;e++){c=kS.ei(a.e,e,b);for(f=0;f<kS.Hk(a.e,c);f++){d=kS.Ik(a.e,c,f);if(a.d[d]){a.d[d]=false;--a.c}}}};kS.$d=function $d(a){var b,c,d,e,f,g,h,i;for(c=0;c<a.e.e;c++){if(a.d[c]){for(e=0;e<2;e++){h=kS.ei(a.e,e,c);b=false;for(g=0;g<kS.Hk(a.e,h);g++){if(c!=kS.Ik(a.e,h,g)&&a.d[kS.Ik(a.e,h,g)]){b=true;break}}if(!b){i=c;d=kS.ei(a.e,1-e,c);while(i!=-1){a.d[i]=false;--a.c;kS.Nj(a.e,i,64);i=-1;h=d;for(f=0;f<kS.Hk(a.e,h);f++){if(a.d[kS.Ik(a.e,h,f)]){if(i==-1){i=kS.Ik(a.e,h,f);d=kS.Gk(a.e,h,f)}else{i=-1;break}}}}break}}}}};kS._d=function _d(a){var b,c,d,e,f,g,h;do{h=false;for(c=0;c<a.e.e;c++){if(a.d[c]){f=false;for(e=0;e<2;e++){d=kS.ei(a.e,e,c);b=false;for(g=0;g<kS.Hk(a.e,d);g++){if(c!=kS.Ik(a.e,d,g)&&a.d[kS.Ik(a.e,d,g)]){b=true;break}}if(!b){f=true;break}}if(f){h=true;kS.Zd(a,c)}}}}while(h)};kS.ae=function ae(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o;o=OC(fS.OD,YS,5,a.e.e,15,1);for(m=0;m<b.i.a.length;m++){n=AS.LN(b.j,m);l=true;for(k=0;k<n.length;k++){if(!a.d[n[k]]){l=false;break}}if(l)for(j=0;j<n.length;j++)++o[n[j]]}i=a.c;for(f=0;f<a.e.e;f++){if(o[f]==1){for(j=0;j<2&&a.d[f];j++){c=kS.ei(a.e,j,f);d=kS.ei(a.e,1-j,f);if(kS.Wd(a,c,o)&&!kS.Wd(a,d,o)){while(-1!=(h=kS.Ud(a,d,c,o))){e=kS.Gk(a.e,d,h);g=kS.Ik(a.e,d,h);if(!a.d[g])break;kS.Zd(a,g);h=kS.Ud(a,e,d,o);if(h==-1)break;c=e;d=kS.Gk(a.e,e,h)}}}}}return i!=a.c};kS.be=function be(a,b){var c;for(c=0;c<a.e.e;c++){if(a.d[c]&&kS.fn(b,c)){kS.ce(a,kS.ei(a.e,0,c));kS.ce(a,kS.ei(a.e,1,c))}}};kS.ce=function ce(a,b){var c,d;--a.b;for(d=0;d<kS.Hk(a.e,b);d++){c=kS.Ik(a.e,b,d);if(a.d[c]){a.d[c]=false;--a.c}}};kS.de=function de(a){var b,c,d,e,f;for(c=0;c<a.e.e;c++){if(kS.mi(a.e,c)==2){for(e=0;e<2;e++){b=kS.ei(a.e,e,c);for(f=0;f<kS.Hk(a.e,b);f++){d=kS.Ik(a.e,b,f);if(a.d[d]){kS.ce(a,b);break}}}}}};kS.ee=function ee(a,b){var c,d,e,f,g,h,i,j,k,l;for(c=0;c<a.e.d;c++){if(kS.Xd(a,c)){(b.a[c]==3||b.a[c]==7)&&(kS.ai(a.e,c)==5&&kS.Lh(a.e,c)==0&&kS.tk(a.e,c)==3||kS.ai(a.e,c)==6&&kS.Lh(a.e,c)==1)&&kS.ce(a,c);b.a[c]==5&&(kS.ai(a.e,c)==6&&kS.Lh(a.e,c)==-1&&kS.tk(a.e,c)==3||kS.ai(a.e,c)==7&&kS.Lh(a.e,c)==0&&kS.tk(a.e,c)==3||kS.ai(a.e,c)==8&&kS.Lh(a.e,c)==0&&kS.Hk(a.e,c)==2||kS.ai(a.e,c)==16&&kS.Lh(a.e,c)==0&&kS.Hk(a.e,c)==2)&&kS.ce(a,c)}}for(j=0;j<b.i.a.length;j++){if(AS.LN(b.j,j).length==5){l=AS.LN(b.j,j);f=true;for(e=0;e<l.length;e++){if(!a.d[l[e]]){f=false;break}}if(f){k=AS.LN(b.i,j);h=0;g=-1;for(d=0;d<l.length;d++){if(kS.Lh(a.e,k[d])==-1&&kS.ai(a.e,k[d])==6){i=kS.tk(a.e,k[d])==3?3:kS.uk(a.e,k[d])==3?2:1;if(h<i){h=i;g=k[d]}}}g!=-1&&kS.ce(a,g)}}}};kS.fe=function fe(a){this.e=a};nH(60,1,{},kS.fe);_.a=false;_.b=0;_.c=0;_.f=0;fS.TD=YI(60);kS.ge=function ge(a,b,c,d,e,f,g){var h,i,j,k;j=0;for(i=0;i<a.L.d;i++)(kS.Xh(a.L,a.t[i])&e)!=0&&++j;if(j==0)return false;if(b>15){kS.$e(a,c);b-=16}kS.Ve(a,1,1);kS.Ve(a,b,4);kS.Ve(a,j,d);for(h=0;h<a.L.d;h++){k=kS.Xh(a.L,a.t[h])&e;if(k!=0){kS.Ve(a,h,d);f!=1&&kS.Ve(a,k>>g,f)}}return true};kS.he=function he(a,b,c,d,e,f,g){var h,i,j,k;j=0;for(i=0;i<a.L.e;i++)(kS.oi(a.L,a.u[i])&e)!=0&&++j;if(j==0)return false;if(b>15){kS.$e(a,c);b-=16}kS.Ve(a,1,1);kS.Ve(a,b,4);kS.Ve(a,j,d);for(h=0;h<a.L.e;h++){k=kS.oi(a.L,a.u[h])&e;if(k!=0){kS.Ve(a,h,d);f!=1&&kS.Ve(a,k>>g,f)}}return true};kS.ie=function ie(a,b,c){var d,e,f,g,h,i,j;if(kS.ai(a.L,b)!=6&&kS.ai(a.L,b)!=7)return false;e=kS.Gk(a.L,b,0);f=kS.Gk(a.L,b,1);if(kS.xk(a.L,e)!=1||kS.xk(a.L,f)!=1)return false;if(kS.Hk(a.L,e)==1||kS.Hk(a.L,f)==1)return false;if(kS.tk(a.L,e)>3||kS.tk(a.L,f)>3)return false;g=new kS.Yg(a.L,a.c,b,e);if(g.f&&!c)return false;h=new kS.Yg(a.L,a.c,b,f);if(h.f&&!c)return false;if(g.f&&h.f)return false;if(c){g.f&&g.c&&(a.P[b]=true);h.f&&h.c&&(a.P[b]=true)}i=kS.Xg(g);j=kS.Xg(h);if(i==-1||j==-1||(i+j&1)==0){c||(a.W[b]=3);return true}d=0;switch(i+j){case 3:case 7:d=2;break;case 5:d=1;}if(c){if(a.Q&&(a.K&2)!=0||!a.Q&&(a.K&4)!=0){if(g.f){if(d==1){kS.Nf(a.b[g.b],64);kS.Nf(a.b[g.d],16)}else{kS.Nf(a.b[g.b],16);kS.Nf(a.b[g.d],64)}}if(h.f){if(d==2){kS.Nf(a.b[h.b],64);kS.Nf(a.b[h.d],16)}else{kS.Nf(a.b[h.b],16);kS.Nf(a.b[h.d],64)}}}}else{a.W[b]=d}return true};kS.je=function je(a,b,c){var d,e,f,g,h;if(!kS.ql(a.L,b))return false;d=kS.ei(a.L,0,b);e=kS.ei(a.L,1,b);g=new kS.Yg(a.L,a.c,d,e);if(g.f&&!c)return false;h=new kS.Yg(a.L,a.c,e,d);if(h.f&&!c)return false;if(g.f&&h.f)return false;if(c){g.f&&(a.O[b]=kS.kf(a,e));h.f&&(a.O[b]=kS.kf(a,d))}f=a._?kS.le(a,g,h):kS.ke(g,h);if(c){if(a.Q&&(a.K&2)!=0||!a.Q&&(a.K&4)!=0){if(g.f){if(f==2){kS.Nf(a.b[g.b],4);kS.Nf(a.b[g.d],1)}else{kS.Nf(a.b[g.b],1);kS.Nf(a.b[g.d],4)}}if(h.f){if(f==2){kS.Nf(a.b[h.b],4);kS.Nf(a.b[h.d],1)}else{kS.Nf(a.b[h.b],1);kS.Nf(a.b[h.d],4)}}}}else{a.k[b]=f}return true};kS.ke=function ke(a,b){var c,d,e;d=kS.Xg(a);e=kS.Xg(b);if(d==-1||e==-1||(d+e&1)==0)return 3;c=0;switch(d+e){case 3:case 7:c=1;break;case 5:c=2;}return c};kS.le=function le(a,b,c){var d,e;d=OC(fS.OD,YS,5,4,15,1);d[0]=b.b;d[1]=b.a;d[2]=c.a;d[3]=c.b;e=kS.ph(a.L,d);if($wnd.Math.abs(e)<0.3||$wnd.Math.abs(e)>2.8415926535897933)return 3;return e<0?1:2};kS.me=function me(a,b,c){var d,e,f,g,h;if(a.k[b]!=0)return false;if(kS.mi(a.L,b)==1)return kS.je(a,b,c);if(kS.mi(a.L,b)!=2)return false;if(kS.pl(a.L,b))return false;e=kS.ei(a.L,0,b);f=kS.ei(a.L,1,b);if(kS.Hk(a.L,e)==1||kS.Hk(a.L,f)==1)return false;if(kS.Hk(a.L,e)>3||kS.Hk(a.L,f)>3)return false;if(kS.xk(a.L,e)==2||kS.xk(a.L,f)==2)return false;g=new kS.Yg(a.L,a.c,f,e);if(g.f&&!c)return false;h=new kS.Yg(a.L,a.c,e,f);if(h.f&&!c)return false;if(g.f&&h.f)return false;if(c){g.f&&g.c&&(a.O[b]=true);h.f&&h.c&&(a.O[b]=true)}d=kS.Ki(a.L,b)?3:a._?kS.oe(a,g,h):kS.ne(g,h);if(c){if((a.K&2)!=0){if(g.f){if(d==1){kS.Nf(a.b[g.b],4);kS.Nf(a.b[g.d],1)}else if(d==2){kS.Nf(a.b[g.b],1);kS.Nf(a.b[g.d],4)}}if(h.f){if(d==1){kS.Nf(a.b[h.b],4);kS.Nf(a.b[h.d],1)}else if(d==2){kS.Nf(a.b[h.b],1);kS.Nf(a.b[h.d],4)}}}}else{a.k[b]=d}return true};kS.ne=function ne(a,b){if(kS.Xg(a)==-1||kS.Xg(b)==-1)return 3;if(((kS.Xg(a)|kS.Xg(b))&1)!=0)return 3;return kS.Xg(a)==kS.Xg(b)?1:2};kS.oe=function oe(a,b,c){var d,e,f,g,h,i,j;f=OC(fS.MD,_S,5,3,15,1);f[0]=kS.Zh(a.L,c.a)-kS.Zh(a.L,b.a);f[1]=kS.$h(a.L,c.a)-kS.$h(a.L,b.a);f[2]=kS._h(a.L,c.a)-kS._h(a.L,b.a);i=OC(fS.MD,_S,5,3,15,1);i[0]=kS.Zh(a.L,b.b)-kS.Zh(a.L,b.a);i[1]=kS.$h(a.L,b.b)-kS.$h(a.L,b.a);i[2]=kS._h(a.L,b.b)-kS._h(a.L,b.a);j=OC(fS.MD,_S,5,3,15,1);j[0]=kS.Zh(a.L,c.b)-kS.Zh(a.L,c.a);j[1]=kS.$h(a.L,c.b)-kS.$h(a.L,c.a);j[2]=kS._h(a.L,c.b)-kS._h(a.L,c.a);g=OC(fS.MD,_S,5,3,15,1);g[0]=f[1]*i[2]-f[2]*i[1];g[1]=f[2]*i[0]-f[0]*i[2];g[2]=f[0]*i[1]-f[1]*i[0];h=OC(fS.MD,_S,5,3,15,1);h[0]=f[1]*g[2]-f[2]*g[1];h[1]=f[2]*g[0]-f[0]*g[2];h[2]=f[0]*g[1]-f[1]*g[0];d=(i[0]*h[0]+i[1]*h[1]+i[2]*h[2])/($wnd.Math.sqrt(i[0]*i[0]+i[1]*i[1]+i[2]*i[2])*$wnd.Math.sqrt(h[0]*h[0]+h[1]*h[1]+h[2]*h[2]));e=(j[0]*h[0]+j[1]*h[1]+j[2]*h[2])/($wnd.Math.sqrt(j[0]*j[0]+j[1]*j[1]+j[2]*j[2])*$wnd.Math.sqrt(h[0]*h[0]+h[1]*h[1]+h[2]*h[2]));return d<0^e<0?1:2};kS.pe=function pe(a,b){var c,d,e,f;c=kS.Jh(a.L,b);d=kS.Sk(a.L,b,false);e=kS.Sk(a.L,b,true);f=-1;if(d!=e){c!=-1&&c>d?(f=c<<24>>24):(f=d<<24>>24)}else if(c!=-1){(c>e||c<e&&c>=kS.Yk(a.L,b))&&(f=c<<24>>24)}else if(!kS.Ml(a.L,b)&&kS.Lk(a.L,b)!=0){f=kS.Yk(a.L,b);f-=kS.si(a.L,b,f)}kS.Ke(a,b,f);return f};kS.qe=function qe(a){var b,c,d,e,f,g,h,i,j,k,l;d=OC(fS.OD,YS,5,a.I,15,1);for(b=0;b<a.L.d;b++){k=kS.Hk(a.L,b)+kS.Vk(a.L,b);j=0;for(f=0;f<kS.uk(a.L,b);f++){if(f<kS.Hk(a.L,b)||f>=kS.tk(a.L,b)){l=2*a.c[kS.Gk(a.L,b,f)];c=kS.Ik(a.L,b,f);kS.mi(a.L,c)==2&&(kS.pl(a.L,c)||++l);for(h=0;h<j;h++)if(l<d[h])break;for(i=j;i>h;i--)d[i]=d[i-1];d[h]=l;++j}}kS.Pf(a.b[b],b);kS.Mf(a.b[b],16,UG(a.c[b]));for(g=k;g<a.I;g++)kS.Mf(a.b[b],17,0);for(e=0;e<k;e++)kS.Mf(a.b[b],17,fS.RG(d[e]))}};
kS.re=function re(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o;if(a.W[b]!=0)return false;if(kS.ai(a.L,b)!=5&&kS.ai(a.L,b)!=6&&kS.ai(a.L,b)!=7&&kS.ai(a.L,b)!=14&&kS.ai(a.L,b)!=15&&kS.ai(a.L,b)!=16)return false;if(kS.xk(a.L,b)!=0){if(kS.Hk(a.L,b)==2&&kS.Jk(a.L,b,0)==2&&kS.Jk(a.L,b,1)==2)return kS.ie(a,b,c);if(kS.ai(a.L,b)!=15&&kS.ai(a.L,b)!=16)return false}if(kS.Hk(a.L,b)<3||kS.tk(a.L,b)>4)return false;if(kS.ai(a.L,b)==5&&kS.tk(a.L,b)!=4)return false;if(kS.ai(a.L,b)==7&&!a.M[b])return false;n=OC(fS.OD,YS,5,4,15,1);o=OC(fS.OD,YS,5,4,15,1);j=OC(fS.CG,aT,5,4,16,1);for(h=0;h<kS.tk(a.L,b);h++){f=-1;e=0;for(i=0;i<kS.tk(a.L,b);i++){if(!j[i]){if(f<a.c[kS.Gk(a.L,b,i)]){f=a.c[kS.Gk(a.L,b,i)];e=i}}}n[h]=e;o[h]=f;j[e]=true}if(kS.tk(a.L,b)==4&&o[0]===o[1]&&o[2]===o[3])return false;if(kS.tk(a.L,b)==4&&(o[0]===o[2]||o[1]===o[3]))return false;if(kS.tk(a.L,b)==3&&o[0]===o[2])return false;k=0;l=0;m=false;for(g=1;g<kS.tk(a.L,b);g++){if(o[g-1]===o[g]){if(!c||o[g]==0)return false;k=kS.Gk(a.L,b,n[g-1]);l=kS.Gk(a.L,b,n[g]);kS.vl(a.L,kS.Ik(a.L,b,n[g]))&&(a.P[b]=true);m=true}}if(c&&!m)return false;d=a._?kS.te(a,b,n):kS.se(a,b,n);if(c){if(a.Q&&(a.K&2)!=0||!a.Q&&(a.K&4)!=0){if(d==1){kS.Nf(a.b[k],kT);kS.Nf(a.b[l],256)}else if(d==2){kS.Nf(a.b[k],256);kS.Nf(a.b[l],kT)}}}else{a.W[b]=d}return true};kS.se=function se(a,b,c){var d,e,f,g,h,i,j,k,l,m;m=WC(IC(fS.OD,2),DT,6,0,[WC(IC(fS.OD,1),YS,5,15,[2,1,2,1]),WC(IC(fS.OD,1),YS,5,15,[1,2,2,1]),WC(IC(fS.OD,1),YS,5,15,[1,1,2,2]),WC(IC(fS.OD,1),YS,5,15,[2,1,1,2]),WC(IC(fS.OD,1),YS,5,15,[2,2,1,1]),WC(IC(fS.OD,1),YS,5,15,[1,2,1,2])]);d=OC(fS.MD,_S,5,kS.tk(a.L,b),15,1);for(g=0;g<kS.tk(a.L,b);g++)d[g]=kS.di(a.L,kS.Gk(a.L,b,c[g]),b);j=kS.Nk(a.L,b,c,d,null)<<24>>24;if(j!=3)return j;k=0;l=0;for(h=0;h<kS.tk(a.L,b);h++){e=kS.Ik(a.L,b,c[h]);if(kS.ei(a.L,0,e)==b){if(kS.pi(a.L,e)==9){l!=0&&kS.Uj(a.L,b);k=h;l=1}if(kS.pi(a.L,e)==17){l!=0&&kS.Uj(a.L,b);k=h;l=2}}}if(l==0)return 3;for(f=1;f<kS.tk(a.L,b);f++)d[f]<d[0]&&(d[f]+=eT);if(kS.tk(a.L,b)==3){switch(k){case 0:(d[1]<d[2]&&d[2]-d[1]<fT||d[1]>d[2]&&d[1]-d[2]>fT)&&(l=3-l);break;case 1:d[2]-d[0]>fT&&(l=3-l);break;case 2:d[1]-d[0]<fT&&(l=3-l);}return l==1?2:1}i=0;d[1]<=d[2]&&d[2]<=d[3]?(i=0):d[1]<=d[3]&&d[3]<=d[2]?(i=1):d[2]<=d[1]&&d[1]<=d[3]?(i=2):d[2]<=d[3]&&d[3]<=d[1]?(i=3):d[3]<=d[1]&&d[1]<=d[2]?(i=4):d[3]<=d[2]&&d[2]<=d[1]&&(i=5);return m[i][k]==l?2:1};kS.te=function te(a,b,c){var d,e,f,g,h,i;d=OC(fS.OD,YS,5,4,15,1);for(h=0;h<kS.tk(a.L,b);h++)d[h]=kS.Gk(a.L,b,c[h]);kS.tk(a.L,b)==3&&(d[3]=b);e=MC(fS.MD,[FS,_S],[13,5],15,[3,3],2);for(g=0;g<3;g++){e[g][0]=kS.Zh(a.L,d[g+1])-kS.Zh(a.L,d[0]);e[g][1]=kS.$h(a.L,d[g+1])-kS.$h(a.L,d[0]);e[g][2]=kS._h(a.L,d[g+1])-kS._h(a.L,d[0])}i=OC(fS.MD,_S,5,3,15,1);i[0]=e[0][1]*e[1][2]-e[0][2]*e[1][1];i[1]=e[0][2]*e[1][0]-e[0][0]*e[1][2];i[2]=e[0][0]*e[1][1]-e[0][1]*e[1][0];f=(e[2][0]*i[0]+e[2][1]*i[1]+e[2][2]*i[2])/($wnd.Math.sqrt(e[2][0]*e[2][0]+e[2][1]*e[2][1]+e[2][2]*e[2][2])*$wnd.Math.sqrt(i[0]*i[0]+i[1]*i[1]+i[2]*i[2]));return f>0?1:2};kS.ue=function ue(a){var b,c;b=0;AS.PO(a.b);for(c=0;c<a.b.length;c++){(c==0||kS.Of(a.b[c],a.b[c-1])!=0)&&++b;a.c[a.b[c].a]=b}return b};kS.ve=function ve(a){var b,c,d,e,f,g,h,i,j,k,l,m;if(a.s)return;a.s=new AS.ZN;k=0;l=OC(fS.OD,YS,5,a.L.d,15,1);g=OC(fS.OD,YS,5,a.L.d,15,1);i=OC(fS.OD,YS,5,a.L.e,15,1);for(b=0;b<a.L.d;b++){if(l[b]==0&&(kS.ul(a.L,b)||kS.xk(a.L,b)==1)){g[0]=b;h=1;j=0;l[b]=++k;c=OC(fS.CG,aT,5,a.L.e,16,1);for(f=0;f<h;f++){for(m=0;m<kS.Hk(a.L,g[f]);m++){e=kS.Ik(a.L,g[f],m);if(kS.vl(a.L,e)||kS.mi(a.L,e)==2||kS.ql(a.L,e)){d=kS.Gk(a.L,g[f],m);if(!c[e]){i[j++]=e;c[e]=true}if(l[d]==0){g[h++]=d;l[d]=k}}}}AS.GN(a.s,new kS.Sf(g,h,i,j))}}};kS.we=function we(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v;a.M=OC(fS.CG,aT,5,a.L.d,16,1);for(b=0;b<a.L.d;b++){if(kS.ai(a.L,b)==7){if(kS.Hk(a.L,b)==4){a.M[b]=true;continue}if(kS.Hk(a.L,b)==3){if(kS.Lh(a.L,b)==1){a.M[b]=true;continue}if(kS.sl(a.L,b))continue;if((a.K&32)!=0){a.M[b]=true;continue}if(kS.zk(a.L,b)!=3)continue;v=kS.Bk(a.L,b);if(v>7)continue;t=kS.bl(a.L);u=0;while(u<t.i.a.length){if(AS.LN(t.j,u).length==v&&kS.cn(t,u,b))break;++u}i=-1;j=-1;for(l=0;l<3;l++){h=kS.Ik(a.L,b,l);if(!kS.dn(t,u,h)){i=kS.Gk(a.L,b,l);j=h;break}}n=OC(fS.CG,aT,5,a.L.e,16,1);n[j]=true;o=OC(fS.OD,YS,5,11,15,1);p=kS.Zk(a.L,o,i,b,10,n);if(p==-1)continue;d=1;while(!kS.cn(t,u,o[d]))++d;c=p-d;e=o[d];if(v==6&&c==2&&d==3){if(kS.zk(a.L,o[1])>=3){m=false;s=AS.LN(t.i,u);for(k=0;k<6;k++){if(b==s[k]){r=kS.jn(t,u,e==s[kS.jn(t,u,k+2)]?k-2:k+2);q=s[r];kS.zk(a.L,q)>=3&&kS.al(a.L,o[1],q,2,null)==2&&(m=true);break}}if(m){a.M[b]=true;continue}}}f=kS.xk(a.L,e)==1||kS.ol(a.L,e)||kS.sl(a.L,e);g=!f&&kS.ai(a.L,e)==7&&kS.Lh(a.L,e)!=1;if(c==1){!f&&!g&&v<=4&&d<=3&&(a.M[b]=true);continue}switch(v){case 4:!f&&!g&&d<=4&&(a.M[b]=true);break;case 5:g?d<=3&&(a.M[b]=true):f||d<=4&&(a.M[b]=true);break;case 6:c==2?f?d<=4&&(a.M[b]=true):g||d<=3&&(a.M[b]=true):c==3&&(f?d<=6&&(a.M[b]=true):d<=4&&(a.M[b]=true));break;case 7:c==3&&d<=3&&(a.M[b]=true);}}}}};kS.xe=function xe(a,b){var c,d,e,f;e=false;for(d=0;d<a.L.e;d++)if(kS.me(a,d,false)){a.o[d]=a.G;b&&kS.Le(a,d);e=true}f=false;for(c=0;c<a.L.d;c++)if(kS.re(a,c,false)){a.$[c]=a.G;b&&kS.Me(a,c);f=true}f&&(a.G=!a.G);return e||f};kS.ye=function ye(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B;s=OC(fS.CG,aT,5,a.L.d,16,1);t=OC(fS.CG,aT,5,a.L.e,16,1);b=0;v=false;for(d=0;d<a.L.d;d++){if(a.P[d]){if(!a.X[d]){if(kS.re(a,d,false)){a.X[d]=true;s[d]=true;++b}}}}for(f=0;f<a.L.e;f++){if(a.O[f]){if(!a.n[f]){if(kS.me(a,f,false)){a.n[f]=true;t[f]=true;++b}}}}if(b==1){for(c=0;c<a.L.d;c++){if(s[c]){a.W[c]=0;break}}for(e=0;e<a.L.e;e++){if(t[e]){a.k[e]=0;break}}}else if(b>1){kS.ve(a);for(h=new AS.tO(a.s);h.a<h.c.a.length;){g=AS.sO(h);u=0;w=0;k=0;j=0;l=-1;i=-1;for(o=0;o<g.a.length;o++){if(s[g.a[o]]){++u;if(a.W[g.a[o]]==1||a.W[g.a[o]]==2){++w;v=true;if(l<a.c[g.a[o]]){l=a.c[g.a[o]];k=g.a[o]}}}}for(p=0;p<g.b.length;p++){if(t[g.b[p]]){++u;A=a.c[kS.ei(a.L,0,g.b[p])];B=a.c[kS.ei(a.L,1,g.b[p])];m=A>B?(A<<16)+B:(B<<16)+A;if(a.k[g.b[p]]==1||a.k[g.b[p]]==2){++w;v=true;if(i<m){i=m;j=g.b[p]}}}}if(u==0)continue;if(u==1){for(q=0;q<g.a.length;q++)s[g.a[q]]&&(a.W[g.a[q]]=0);for(n=0;n<g.b.length;n++)t[g.b[n]]&&(a.k[g.b[n]]=0)}else{if(w==1){for(q=0;q<g.a.length;q++)s[g.a[q]]&&(a.W[g.a[q]]=3);for(n=0;n<g.b.length;n++)t[g.b[n]]&&(a.k[g.b[n]]=3)}else{r=false;l!=-1?a.W[k]==2&&(r=true):a.k[j]==2&&(r=true);if(r){for(q=0;q<g.a.length;q++){if(s[g.a[q]]){switch(a.W[g.a[q]]){case 1:a.W[g.a[q]]=2;break;case 2:a.W[g.a[q]]=1;}}}for(n=0;n<g.b.length;n++){if(t[g.b[n]]){switch(a.k[g.b[n]]){case 1:a.k[g.b[n]]=2;break;case 2:a.k[g.b[n]]=1;}}}}}}}}return v};kS.ze=function ze(a,b){var c,d,e,f,g,h,i,j,k,l,m;f=MC(fS.OD,[DT,YS],[6,5],15,[2,32],2);for(g=0;g<2;g++){c=OC(fS.OD,DT,6,32,0,2);m=0;for(e=0;e<32;e++){if(b[g][e]!=null){k=b[g][e].length;c[e]=OC(fS.OD,YS,5,k,15,1);for(h=0;h<k;h++)c[e][h]=a.c[b[g][e][h]];AS.OO(c[e]);++m}}for(l=m;l>0;l--){j=0;i=null;for(d=0;d<32;d++){if(c[d]!=null){if(i==null||i.length<c[d].length){i=c[d];j=d}else if(i.length==c[d].length){for(h=i.length-1;h>=0;h--){if(i[h]<c[d][h]){i=c[d];j=d;break}}}}}f[g][j]=l;c[j]=null}}return f};kS.Ae=function Ae(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t;l=false;if(a.L.I){for(j=0;j<a.L.e;j++){if(kS.oi(a.L,j)!=0){l=true;break}}}a.I=2;for(c=0;c<a.L.d;c++)a.I=gS.aK(a.I,kS.Hk(a.L,c)+kS.Vk(a.L,c));i=gS.aK(2,l?(78+a.I*37)/63|0:(78+a.I*21)/63|0);a.c=OC(fS.OD,YS,5,a.L.o,15,1);a.b=OC(fS.YD,ET,53,a.L.d,0,1);for(d=0;d<a.L.d;d++)a.b[d]=new kS.Qf(i);h=false;for(e=0;e<a.L.d;e++){kS.Pf(a.b[e],e);(kS.Xh(a.L,e)&1)!=0||kS.Sh(a.L,e)!=null?kS.Mf(a.b[e],8,6):kS.Mf(a.b[e],8,UG(kS.ai(a.L,e)));kS.Mf(a.b[e],8,UG(kS.Vh(a.L,e)));kS.Mf(a.b[e],2,UG(kS.xk(a.L,e)));kS.Mf(a.b[e],4,UG(kS.Hk(a.L,e)+kS.Vk(a.L,e)));(kS.Xh(a.L,e)&1)!=0?kS.Mf(a.b[e],4,8):kS.Mf(a.b[e],4,UG(8+kS.Lh(a.L,e)));kS.Mf(a.b[e],5,UG(gS.bK(31,kS.Bk(a.L,e))));kS.Mf(a.b[e],4,UG(kS.pe(a,e)+1));kS.Mf(a.b[e],2,UG(kS.Yh(a.L,e)>>4));if(a.L.I){kS.Mf(a.b[e],30,UG(kS.Xh(a.L,e)));kS.Sh(a.L,e)!=null&&(h=true)}}a.N=kS.De(a);if(a.N<a.L.d){for(b=0;b<a.L.d;b++){kS.Pf(a.b[b],b);kS.Mf(a.b[b],16,UG(a.c[b]));m=OC(fS.OD,YS,5,kS.Hk(a.L,b),15,1);for(o=0;o<kS.Hk(a.L,b);o++){m[o]=a.c[kS.Gk(a.L,b,o)]<<5;m[o]|=gS.bK(31,kS.Fk(a.L,kS.Ik(a.L,b,o)))}AS.OO(m);for(p=a.I;p>m.length;p--)kS.Mf(a.b[b],21,0);for(n=m.length-1;n>=0;n--)kS.Mf(a.b[b],21,fS.RG(m[n]))}a.N=kS.De(a)}if(h&&a.N<a.L.d){for(b=0;b<a.L.d;b++){kS.Pf(a.b[b],b);kS.Mf(a.b[b],16,UG(a.c[b]));g=kS.Sh(a.L,b);s=g==null?0:gS.bK(12,g.length);for(o=12;o>s;o--)kS.Mf(a.b[b],8,0);for(n=s-1;n>=0;n--)kS.Mf(a.b[b],8,fS.RG(g[n]))}a.N=kS.De(a)}if(l&&a.N<a.L.d){for(b=0;b<a.L.d;b++){kS.Pf(a.b[b],b);kS.Mf(a.b[b],16,UG(a.c[b]));k=OC(fS.PD,FT,5,kS.Hk(a.L,b)+kS.Vk(a.L,b),14,1);q=0;for(o=0;o<kS.uk(a.L,b);o++){if(o<kS.Hk(a.L,b)||o>=kS.tk(a.L,b)){k[q]=UG(a.c[kS.Gk(a.L,b,o)]);k[q]=$G(k[q],21);k[q]=ZG(k[q],UG(kS.oi(a.L,kS.Ik(a.L,b,o))));++q}}AS.NO(k,jS.SR());for(p=a.I;p>k.length;p--)kS.Mf(a.b[b],37,0);for(n=k.length-1;n>=0;n--)kS.Mf(a.b[b],37,k[n])}a.N=kS.De(a)}if((a.K&8)!=0&&a.N<a.L.d){r=new kS.Oo;for(f=0;f<a.L.d;f++)kS.Nh(a.L,f)!=null&&kS.Mo(r,kS.Nh(a.L,f));for(b=0;b<a.L.d;b++){t=kS.Nh(a.L,b)==null?0:1+kS.No(r,kS.Nh(a.L,b));kS.Pf(a.b[b],b);kS.Mf(a.b[b],16,UG(a.c[b]));kS.Mf(a.b[b],16,fS.RG(t))}a.N=kS.De(a)}if((a.K&16)!=0&&a.N<a.L.d){for(b=0;b<a.L.d;b++){kS.Pf(a.b[b],b);kS.Mf(a.b[b],16,UG(a.c[b]));kS.Mf(a.b[b],1,UG(kS.Si(a.L,b)?1:0))}a.N=kS.De(a)}};kS.Be=function Be(a){var b,c,d,e,f,g,h,i,j,k;f=0;for(c=0;c<a.L.d;c++)a.U[c]!=0&&++f;if(f==0)return;k=OC(fS.OD,YS,5,f,15,1);f=0;for(d=0;d<a.L.d;d++){if(a.U[d]!=0){k[f]=a.U[d]<<29|a.T[d]<<24|a.c[d]<<12|d;++f}}AS.OO(k);g=0;j=0;h=k[0]&GT;while(true){++j;if(j==k.length||h!=(k[j]&GT)){e=OC(fS.OD,YS,5,j-g,15,1);for(i=g;i<j;i++){b=k[i]&4095;e[i-g]=b;a.Y[b]=true}AS.GN(a.Z,e);if(j==k.length)break;h=k[j]&GT;g=j}}};kS.Ce=function Ce(a){var b,c,d,e,f,g,h,i,j,k,l;e=false;for(f=0;f<a.Z.a.length;f++){d=AS.LN(a.Z,f);b=true;l=-1;g=false;for(j=0;j<d.length;j++){c=d[j];if(a.W[c]==0){b=false;break}if(a.W[c]!=3){h=true;for(k=0;k<d.length;k++){if(k!=j&&a.c[c]===a.c[d[k]]){h=false;break}}if(h&&l<a.c[c]){l=a.c[c];g=a.W[c]==1}}}if(b&&l!=-1){for(i=0;i<d.length;i++){c=d[i];g&&(a.W[c]==1?(a.W[c]=2):a.W[c]==2&&(a.W[c]=1));a.Y[c]=false}AS.SN(a.Z,d);e=true;--f}}return e};kS.De=function De(a){var b,c;b=kS.ue(a);do{c=b;kS.qe(a);b=kS.ue(a)}while(c!=b);return b};kS.Ee=function Ee(a){var b,c,d,e,f,g,h;a.P=OC(fS.CG,aT,5,a.L.d,16,1);a.O=OC(fS.CG,aT,5,a.L.e,16,1);if((a.K&6)!=0){for(b=0;b<a.L.d;b++){kS.Pf(a.b[b],b);kS.Mf(a.b[b],28,UG(a.c[b]<<12))}}if(a.N<a.L.d){f=0;for(b=0;b<a.L.d;b++)kS.re(a,b,true)&&++f;for(e=0;e<a.L.e;e++)kS.me(a,e,true)&&++f}(a.K&6)!=0&&(a.N=kS.De(a));if((a.K&1)!=0){a.d=OC(fS.OD,YS,5,a.L.d,15,1);for(b=0;b<a.L.d;b++)a.d[b]=a.c[b]}while(a.N<a.L.d){for(c=0;c<a.L.d;c++){kS.Pf(a.b[c],c);kS.Mf(a.b[c],17,UG(2*a.c[c]))}h=OC(fS.OD,YS,5,a.N+1,15,1);for(d=0;d<a.L.d;d++)++h[a.c[d]];g=1;while(h[g]==1)++g;for(b=0;b<a.L.d;b++){if(a.c[b]==g){kS.Nf(a.b[b],1);break}}a.N=kS.De(a);kS.Ce(a);!!a.J&&kS.bg(a.J,a.c)}kS.Ce(a);kS.ye(a);kS._e(a)};kS.Fe=function Fe(a){var b,c,d,e,f,g;g=a.N;f=OC(fS.OD,YS,5,a.L.d,15,1);for(c=0;c<a.L.d;c++)f[c]=a.c[c];if(!a.L.I){kS.He(a);kS.qf(a,g,f)}a.U=OC(fS.KD,HT,5,a.L.d,15,1);a.T=OC(fS.KD,HT,5,a.L.d,15,1);for(d=0;d<a.L.d;d++){a.U[d]=kS.Qh(a.L,d)<<24>>24;a.T[d]=kS.Ph(a.L,d)<<24>>24}a.j=OC(fS.KD,HT,5,a.L.e,15,1);a.i=OC(fS.KD,HT,5,a.L.e,15,1);for(e=0;e<a.L.e;e++){a.j[e]=kS.ji(a.L,e)<<24>>24;a.i[e]=kS.ii(a.L,e)<<24>>24}kS.Ge(a);a.Q=false;a.H=OC(fS.CG,aT,5,a.L.d,16,1);for(b=0;b<a.L.d;b++){if(a.W[b]!=0){a.H[b]=true;a.Q=true}}kS.Je(a);a.J=null;a.V=OC(fS.CG,aT,5,a.L.d,16,1);if(a.Q){a.J=new kS.hg(a.L,f,a.H,a.W,a.k,a.U,a.T,a.$,a.o,a.V);kS.cg(a.J)}a.Y=OC(fS.CG,aT,5,a.L.d,16,1);a.Z=new AS.ZN;kS.Be(a);kS.qf(a,g,f);kS.Ie(a);!!a.J&&(a.F=kS.$f(a.J));kS.Te(a)};kS.Ge=function Ge(a){var b,c,d,e,f,g;a.G=true;f=kS.xe(a,false);while(a.N<a.L.d&&f){for(b=0;b<a.L.d;b++){kS.Pf(a.b[b],b);kS.Mf(a.b[b],16,UG(a.c[b]));g=a.W[b]<<7;if((a.W[b]==1||a.W[b]==2)&&a.U[b]!=0){g|=a.U[b]<<5;g|=a.T[b]}kS.Mf(a.b[b],18,fS.RG(g<<9))}for(c=0;c<a.L.e;c++){d=a.k[c]<<7;if((a.k[c]==1||a.k[c]==2)&&kS.pi(a.L,c)==1&&a.j[c]!=0){d|=a.j[c]<<5;d|=a.i[c]}kS.Nf(a.b[kS.ei(a.L,0,c)],fS.RG(d));kS.Nf(a.b[kS.ei(a.L,1,c)],fS.RG(d))}e=kS.De(a);if(a.N==e)break;a.N=e;f=kS.xe(a,false)}};kS.He=function He(a){var b,c,d,e;a.G=true;a.R=OC(fS.KD,HT,5,a.L.d,15,1);a.f=OC(fS.KD,HT,5,a.L.e,15,1);e=kS.xe(a,true);while(a.N<a.L.d&&e){for(b=0;b<a.L.d;b++){kS.Pf(a.b[b],b);kS.Mf(a.b[b],20,UG(a.c[b]<<4|a.W[b]<<2))}for(c=0;c<a.L.e;c++){kS.Nf(a.b[kS.ei(a.L,0,c)],UG(a.k[c]));kS.Nf(a.b[kS.ei(a.L,1,c)],UG(a.k[c]))}d=kS.De(a);if(a.N==d)break;a.N=d;e=kS.xe(a,true)}};kS.Ie=function Ie(a){var b,c,d,e,f,g;a.G=true;d=kS.Se(a);!!a.J&&kS.bg(a.J,a.c)&&(d=kS.Se(a));kS.xe(a,false)&&kS.Ce(a);g=true;while(a.N<a.L.d&&g){e=kS.ze(a,d);for(b=0;b<a.L.d;b++){kS.Pf(a.b[b],b);kS.Mf(a.b[b],16,UG(a.c[b]));kS.Mf(a.b[b],20,0);!a.V[b]&&a.U[b]!=0&&kS.Nf(a.b[b],UG((a.U[b]<<18)+(e[a.U[b]==1?0:1][a.T[b]]<<8)));kS.Nf(a.b[b],UG(a.W[b]<<4))}for(c=0;c<a.L.e;c++){kS.Nf(a.b[kS.ei(a.L,0,c)],UG(a.k[c]));kS.Nf(a.b[kS.ei(a.L,1,c)],UG(a.k[c]))}f=kS.De(a);if(a.N==f)break;a.N=f;g=false;if(!!a.J&&kS.bg(a.J,a.c)){g=true;d=kS.Se(a)}if(kS.xe(a,false)){g=true;kS.Ce(a)}}};kS.Je=function Je(a){var b,c;for(b=0;b<a.L.d;b++)(!a.H[b]||a.W[b]==3)&&(a.U[b]=0);for(c=0;c<a.L.e;c++)(kS.pi(a.L,c)!=1||a.k[c]==0||a.k[c]==3)&&(a.j[c]=0)};kS.Ke=function Ke(a,b,c){if(a.a==null){a.a=OC(fS.KD,HT,5,a.L.d,15,1);AS.BO(a.a)}a.a[b]=c<<24>>24};kS.Le=function Le(b,c){var d,e,f,g,h,i;if((b.k[c]==1||b.k[c]==2)&&!kS.yl(b.L,c)){h=false;try{for(g=0;g<2;g++){d=kS.ei(b.L,g,c);if(kS.Hk(b.L,d)==3){e=OC(fS.OD,YS,5,2,15,1);f=0;for(i=0;i<kS.Hk(b.L,d);i++)kS.Ik(b.L,d,i)!=c&&(e[f++]=kS.Gk(b.L,d,i));b.c[e[0]]>b.c[e[1]]^kS.Ne(b,d,e[0],e[1])&&(h=!h)}}}catch(a){a=GG(a);if(AD(a,12)){b.f[c]=3;return}else throw HG(a)}b.k[c]==1^h?(b.f[c]=1):(b.f[c]=2)}};kS.Me=function Me(b,c){var d,e,f,g,h,i,j;if(b.W[c]==1||b.W[c]==2){i=false;if(kS.xk(b.L,c)==2){try{for(h=0;h<2;h++){d=kS.Gk(b.L,c,h);if(kS.Hk(b.L,d)==3){f=OC(fS.OD,YS,5,2,15,1);g=0;for(j=0;j<kS.Hk(b.L,d);j++)kS.Jk(b.L,d,j)==1&&(f[g++]=kS.Gk(b.L,d,j));b.c[f[0]]>b.c[f[1]]^kS.Ne(b,d,f[0],f[1])&&(i=!i)}}}catch(a){a=GG(a);if(AD(a,12)){b.R[c]=3;return}else throw HG(a)}}else{try{e=kS.Pe(b,c)}catch(a){a=GG(a);if(AD(a,12)){b.R[c]=3;return}else throw HG(a)}for(h=1;h<e.length;h++)for(j=0;j<h;j++)b.c[e[h]]<b.c[e[j]]&&(i=!i)}b.W[c]==1^i?(b.R[c]=1):(b.R[c]=2)}};kS.Ne=function Ne(a,b,c,d){var e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G,H,I,J,K,L;if(kS.ai(a.L,c)!=kS.ai(a.L,d))return kS.ai(a.L,c)>kS.ai(a.L,d);if(kS.Vh(a.L,c)!=kS.Vh(a.L,d)){H=kS.Pi(a.L,c)?(kS.dh(),kS.ah)[kS.ai(a.L,c)]:kS.Vh(a.L,c);I=kS.Pi(a.L,d)?(kS.dh(),kS.ah)[kS.ai(a.L,d)]:kS.Vh(a.L,d);return H>I}w=a.L.d;s=OC(fS.OD,YS,5,w,15,1);u=OC(fS.OD,YS,5,w,15,1);v=OC(fS.OD,YS,5,w,15,1);t=OC(fS.CG,aT,5,w,16,1);i=OC(fS.CG,aT,5,a.L.o,16,1);s[0]=b;s[1]=c;s[2]=d;u[0]=-1;u[1]=0;u[2]=0;i[b]=true;i[c]=true;i[d]=true;m=1;A=2;G=OC(fS.OD,YS,5,64,15,1);G[1]=1;G[2]=3;o=2;while(m<=A){while(m<G[o]){n=s[m];if(!t[m]){p=0;q=0;for(C=0;C<kS.Hk(a.L,n);C++){k=kS.Gk(a.L,n,C);if(A+kS.Jk(a.L,n,C)+1>=w){w+=a.L.d;s=kS.sf(s,w);u=kS.sf(u,w);v=kS.sf(v,w);t=kS.tf(t,w)}if(kS.rl(a.L,kS.Ik(a.L,n,C))){++p;q+=kS.ai(a.L,k)}else{for(F=1;F<kS.Jk(a.L,n,C);F++){++A;s[A]=k;u[A]=m;t[A]=true}}K=u[m];if(k==s[K])continue;h=false;if(i[k]){J=u[K];while(J!=-1){if(k==s[J]){h=true;break}J=u[J]}}if(h){++A;s[A]=k;u[A]=m;t[A]=true}else{++A;s[A]=k;u[A]=m;i[k]=true}}if(p!=0){++A;v[A]=(q<<2)/p|0;u[A]=m;t[A]=true}}++m;if(m==US){throw HG(new gS.FA('Emergency break in while loop.'))}}G.length==o+1&&(G=kS.sf(G,G.length+64));G[o+1]=A+1;for(B=G[o];B<G[o+1];B++){v[B]==0&&(v[B]=(kS.ai(a.L,s[B])==151?1:kS.ai(a.L,s[B])==152?1:kS.ai(a.L,s[B]))<<2);v[B]+=v[u[B]]<<16}kS.Re(a,t,v,u,s,G,o);if(v[1]!==v[2])return v[1]>v[2];o>1&&kS.Oe(v,u,G,o);++o}l=OC(fS.OD,YS,5,a.L.d,15,1);D=false;for(f=0;f<a.L.d;f++){if(i[f]&&!kS.Pi(a.L,f)){D=true;break}}if(D){for(g=0;g<a.L.d;g++)l[g]=kS.Pi(a.L,g)?(kS.dh(),kS.ah)[kS.ai(a.L,g)]:kS.Vh(a.L,g);if(kS.Qe(a,t,v,u,s,l,G,o))return v[1]>v[2]}AS.FO(l,l.length,0);r=false;for(j=0;j<a.L.e;j++){if(i[kS.ei(a.L,0,j)]||i[kS.ei(a.L,1,j)]){if(a.f[j]==1){l[kS.ei(a.L,0,j)]=1;l[kS.ei(a.L,1,j)]=1;r=true}else if(a.f[j]==2){l[kS.ei(a.L,0,j)]=2;l[kS.ei(a.L,1,j)]=2;r=true}}}if(r&&kS.Qe(a,t,v,u,s,l,G,o))return v[1]>v[2];AS.FO(l,l.length,0);L=false;for(e=0;e<a.L.d;e++){if(i[e]){if(a.R[e]==2){l[e]=1;L=true}else if(a.R[e]==1){l[e]=2;L=true}}}if(L&&kS.Qe(a,t,v,u,s,l,G,o))return v[1]>v[2];throw HG(new gS.FA('no distinction applying CIP rules'))};kS.Oe=function Oe(a,b,c,d){var e,f,g,h,i,j,k,l,m;l=c[d];g=c[d+1]-l;m=OC(fS.WD,BT,76,g,0,1);for(i=0;i<g;i++){m[i]=new kS.Lf;m[i].c=a[i+l];m[i].b=b[i+l];m[i].a=i+l}e=new kS.If;for(k=d;k>1;k--){for(j=0;j<g;j++){m[j].c+=a[m[j].b]<<16;m[j].b=b[m[j].b]}AS.LO(m,0,m.length,e);f=1;for(h=0;h<g;h++){a[m[h].a]=f;h!=g-1&&kS.Hf(m[h],m[h+1])!=0&&++f}}};kS.Pe=function Pe(a,b){var c,d,e,f,g,h,i;g=kS.tk(a.L,b);h=OC(fS.OD,YS,5,g,15,1);for(e=0;e<g;e++)h[e]=kS.Gk(a.L,b,e);for(d=g;d>1;d--){c=false;for(f=1;f<d;f++){if(kS.Ne(a,b,h[f-1],h[f])){c=true;i=h[f-1];h[f-1]=h[f];h[f]=i}}if(!c)break}return h};kS.Qe=function Qe(a,b,c,d,e,f,g,h){var i,j;for(j=1;j<h;j++){for(i=g[j];i<g[j+1];i++)c[i]=f[e[i]]+(c[d[i]]<<8);kS.Re(a,b,c,d,e,g,j);if(c[1]!==c[2])return true;j>1&&kS.Oe(c,d,g,j)}return false};kS.Re=function Re(a,b,c,d,e,f,g){var h,i,j,k,l,m,n,o,p,q,r;for(l=g;l>1;l--){p=f[l]-f[l-1];r=OC(fS.UD,BT,75,p,0,1);h=f[l];for(o=0;o<p;o++){q=f[l-1]+o;m=h;while(m<f[l+1]&&d[m]==q)++m;r[o]=new kS.Ff;r[o].c=q;r[o].d=c[q];r[o].b=b[q]?0:kS.vk(a.L,e[q]);r[o].a=OC(fS.OD,YS,5,m-h,15,1);for(k=h;k<m;k++)r[o].a[k-h]=c[k];AS.OO(r[o].a);h=m}i=new kS.Cf;AS.LO(r,0,r.length,i);j=1;for(n=0;n<p;n++){c[r[n].c]=j;n!=p-1&&kS.Bf(r[n],r[n+1])!=0&&++j}}};kS.Se=function Se(a){var b,c;c=MC(fS.OD,[FS,DT],[22,6],0,[2,32],2);for(b=0;b<a.L.d;b++){a.H[b]&&(a.U[b]==1?(c[0][a.T[b]]=kS.ig(c[0][a.T[b]],b)):a.U[b]==2&&(c[1][a.T[b]]=kS.ig(c[0][a.T[b]],b)))}return c};kS.Te=function Te(a){var b,c,d,e,f,g,h,i,j,k,l,m;f=0;k=0;g=0;h=0;i=0;j=0;l=0;m=false;b=OC(fS.CG,aT,5,32,16,1);for(c=0;c<a.L.d;c++){if(a.W[c]!=0){++f;if(a.W[c]==3){++k}else{if(a.U[c]==0){++g;!!a.J&&kS.Zf(a.J,c)&&++h}else if(a.U[c]==2){a.T[c]==0&&++j}else if(a.U[c]==1){e=a.T[c];if(!b[e]){++l;b[e]=true}a.T[c]==0&&++i;!!a.J&&kS.Zf(a.J,c)&&(m=true)}}}}for(d=0;d<a.L.e;d++){if(a.k[d]!=0&&kS.pi(a.L,d)==1){++f;if(a.k[d]==3){++k}else{if(a.j[d]==0){++g;!!a.J&&kS.Zf(a.J,kS.ei(a.L,0,d))&&kS.Zf(a.J,kS.ei(a.L,1,d))&&++h}else if(a.j[d]==2){a.i[d]==0&&++j}else if(a.j[d]==1){e=a.i[d];if(!b[e]){++l;b[e]=true}a.i[d]==0&&++i;!!a.J&&kS.Zf(a.J,kS.ei(a.L,0,d))&&kS.Zf(a.J,kS.ei(a.L,1,d))&&(m=true)}}}}if(f==0){kS.Oj(a.L,SS);return}if(k!=0){kS.Oj(a.L,0);return}if(a.F){kS.Oj(a.L,IT+(1<<l));return}i+h==f&&!m?kS.Oj(a.L,196608):g==f?kS.Oj(a.L,CT):j==f?kS.Oj(a.L,327680):g==f-1&&i==1?kS.Oj(a.L,sT):kS.Oj(a.L,458752+(1<<l))};kS.Ue=function Ue(a,b,c,d,e,f){var g,h,i;g=c==-1?(kS.Zh(a.L,b)-kS.Zh(a.L,a.t[0]))/8:kS.Zh(a.L,b)-kS.Zh(a.L,c);h=c==-1?(kS.$h(a.L,b)-kS.$h(a.L,a.t[0]))/8:kS.$h(a.L,b)-kS.$h(a.L,c);kS.Ve(a,JD((d+g)/e),f);kS.Ve(a,JD((d+h)/e),f);if(a._){i=c==-1?(kS._h(a.L,b)-kS._h(a.L,a.t[0]))/8:kS._h(a.L,b)-kS._h(a.L,c);kS.Ve(a,JD((d+i)/e),f)}};kS.Ve=function Ve(a,b,c){while(c!=0){if(a.p==0){gS.LK(a.q,a.r+64&TS);a.p=6;a.r=0}a.r<<=1;a.r|=b&1;b>>=1;--c;--a.p}};kS.We=function We(a){a.r<<=a.p;gS.LK(a.q,a.r+64&TS);return a.q.a};kS.Xe=function Xe(a){a.q=new gS.RK;a.p=6;a.r=0};kS.Ye=function Ye(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p;if(a.L.d==0){a.e='';return}k=false;if(a._&&a.L.o>a.L.d&&!a.L.I){k=true;for(h=0;h<a.L.d;h++){if(kS.Tk(a.L,h)!=0){k=false;break}}}p=a._?16:8;kS.Xe(a);gS.LK(a.q,k?35:33);kS.Ve(a,a._?1:0,1);kS.Ve(a,b?1:0,1);kS.Ve(a,p/2|0,4);n=0;for(i=1;i<a.L.d;i++)n=kS.gf(a,a.t[i],a.w[i]==-1?-1:a.t[a.w[i]],n);if(k){for(h=0;h<a.L.d;h++){c=a.t[h];for(m=kS.Hk(a.L,c);m<kS.tk(a.L,c);m++)n=kS.gf(a,kS.Gk(a.L,c,m),c,n)}}if(n==0){a.e='';return}f=1<<p;l=n/(f/2-1);o=n+l/2;for(j=1;j<a.L.d;j++)kS.Ue(a,a.t[j],a.w[j]==-1?-1:a.t[a.w[j]],o,l,p);if(k){for(g=0;g<a.L.d;g++){c=a.t[g];for(m=kS.Hk(a.L,c);m<kS.tk(a.L,c);m++)kS.Ue(a,kS.Gk(a.L,c,m),c,o,l,p)}}if(b){e=a._?1.5:(kS.dh(),kS.dh(),kS.bh);d=kS.ci(a.L,a.L.d,a.L.e,e);kS.Ve(a,gS.bK(f-1,gS.aK(0,JD(0.5+$wnd.Math.log(d/0.1)*$wnd.Math.LOG10E/($wnd.Math.log(2000)*$wnd.Math.LOG10E)*(f-1)))),p);kS.Ve(a,kS.Ze(kS.Zh(a.L,a.t[0])/d,f),p);kS.Ve(a,kS.Ze(kS.$h(a.L,a.t[0])/d,f),p);a._&&kS.Ve(a,kS.Ze(kS._h(a.L,a.t[0]),f),p)}a.e=kS.We(a)};kS.Ze=function Ze(a,b){var c,d,e,f;c=b/2|0;e=a<0;a=$wnd.Math.abs(a);f=b/32|0;d=gS.bK(c-1,cH(TG($wnd.Math.round(a*c/(a+f)))));return e?c+d:d};kS.$e=function $e(a,b){if(!b){kS.Ve(a,1,1);kS.Ve(a,15,4)}return true};kS._e=function _e(a){var b,c,d;for(b=0;b<a.L.d;b++){kS.Ai(a.L,b)^a.W[b]==3&&kS.Uj(a.L,b);(kS.Qh(a.L,b)==1||kS.Qh(a.L,b)==2)&&(!a.H[b]||a.W[b]==3)&&kS.Uj(a.L,b)}for(d=0;d<a.L.p;d++)kS.Ui(a.L,d)&&!kS.rf(a,d)&&kS.Uj(a.L,kS.ei(a.L,0,d));for(c=0;c<a.L.e;c++){if(kS.mi(a.L,c)==2){if(kS.Ki(a.L,c)&&(a.k[c]==1||a.k[c]==2)){a.k[c]=3;kS.Nj(a.L,c,26)}if(a.k[c]==3&&!a.n[c]){if(kS.pi(a.L,c)!=26){kS.Uj(a.L,kS.ei(a.L,0,c));kS.Uj(a.L,kS.ei(a.L,1,c))}}}if(kS.pi(a.L,c)==1&&a.k[c]==3){kS.Uj(a.L,kS.ei(a.L,0,c));kS.Uj(a.L,kS.ei(a.L,1,c))}if((kS.ji(a.L,c)==1||kS.ji(a.L,c)==2)&&(kS.pi(a.L,c)!=1||a.k[c]!=1&&a.k[c]!=2)){kS.Uj(a.L,kS.ei(a.L,0,c));kS.Uj(a.L,kS.ei(a.L,1,c))}}};kS.af=function af(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v;if(a.L.d==0)return;if(a.A)return;a.C=0;v=0;for(c=1;c<a.L.d;c++)a.c[c]>a.c[v]&&(v=c);d=OC(fS.CG,aT,5,a.L.d,16,1);g=OC(fS.CG,aT,5,a.L.e,16,1);a.B=OC(fS.OD,YS,5,a.L.d,15,1);a.t=OC(fS.OD,YS,5,a.L.d,15,1);a.w=OC(fS.OD,YS,5,a.L.d,15,1);a.u=OC(fS.OD,YS,5,a.L.e,15,1);a.t[0]=v;a.B[v]=0;d[v]=true;e=1;i=0;j=1;k=0;while(i<a.L.d){if(i<j){while(true){o=0;p=0;m=-1;b=a.t[i];for(q=0;q<kS.uk(a.L,b);q++){if(q<kS.Hk(a.L,b)||q>=kS.tk(a.L,b)){h=kS.Gk(a.L,b,q);if(!d[h]&&a.c[h]>m){o=h;p=kS.Ik(a.L,b,q);m=a.c[h]}}}if(m==-1)break;a.B[o]=j;a.w[j]=i;a.t[j++]=o;a.u[k++]=p;d[o]=true;g[p]=true}++i}else{n=0;m=-1;for(b=0;b<a.L.d;b++){if(!d[b]&&a.c[b]>m){n=b;m=a.c[b]}}++e;a.B[n]=j;a.w[j]=-1;a.t[j++]=n;d[n]=true}}a.v=OC(fS.OD,YS,5,2*(a.L.e-k),15,1);while(true){s=a.L.K;t=a.L.K;u=-1;for(f=0;f<a.L.e;f++){if(!g[f]){if(a.B[kS.ei(a.L,0,f)]<a.B[kS.ei(a.L,1,f)]){r=a.B[kS.ei(a.L,0,f)];l=a.B[kS.ei(a.L,1,f)]}else{r=a.B[kS.ei(a.L,1,f)];l=a.B[kS.ei(a.L,0,f)]}if(r<s||r==s&&l<t){s=r;t=l;u=f}}}if(u==-1)break;g[u]=true;a.u[k++]=u;a.v[2*a.C]=s;a.v[2*a.C+1]=t;++a.C}a.A=true};kS.bf=function bf(a){var b,c,d,e,f,g,h,i,j,k,l,m,n;h=null;n=kS.bl(a.L);for(k=0;k<n.i.a.length;k++){if(n.e[k]){e=0;l=AS.LN(n.i,k);for(c=0,d=l.length;c<d;++c){b=l[c];kS.lf(a,b)&&++e}if(e!=0){m=AS.LN(n.j,k);h==null&&(h=OC(fS.CG,aT,5,a.L.e,16,1));if(e==l.length){i=-1;j=KS;for(f=0;f<l.length;f++){if(j>a.t[m[f]]){j=a.t[m[f]];i=f}}while(e>0){h[m[i]]=true;i=kS.yf(i+2,l.length);e-=2}}else{g=0;while(kS.lf(a,l[g]))++g;while(!kS.lf(a,l[g]))g=kS.yf(g+1,l.length);while(e>0){h[m[g]]=true;g=kS.yf(g+2,l.length);e-=2;while(!kS.lf(a,l[g]))g=kS.yf(g+1,l.length)}}}}}return h};kS.cf=function cf(a,b){return a.k[b]};kS.df=function df(a){return kS.ef(a,a._)};kS.ef=function ef(a,b){if(a.e==null){kS.af(a);kS.Ye(a,b)}return a.e};kS.ff=function ff(a){if(a.D==null){kS.af(a);kS.nf(a);kS.pf(a,1);kS.pf(a,2);kS.mf(a)}return a.D};kS.gf=function gf(a,b,c,d){var e,f,g;e=c==-1?$wnd.Math.abs(kS.Zh(a.L,b)-kS.Zh(a.L,a.t[0]))/8:$wnd.Math.abs(kS.Zh(a.L,b)-kS.Zh(a.L,c));d<e&&(d=e);f=c==-1?$wnd.Math.abs(kS.$h(a.L,b)-kS.$h(a.L,a.t[0]))/8:$wnd.Math.abs(kS.$h(a.L,b)-kS.$h(a.L,c));d<f&&(d=f);if(a._){g=c==-1?$wnd.Math.abs(kS._h(a.L,b)-kS._h(a.L,a.t[0]))/8:$wnd.Math.abs(kS._h(a.L,b)-kS._h(a.L,c));d<g&&(d=g)}return d};kS.hf=function hf(a,b){return a.d==null?-1:a.d[b]};kS.jf=function jf(a,b){return a.W[b]};kS.kf=function kf(a,b){var c,d,e,f,g,h,i;i=kS.bl(a.L);for(c=0;c<i.i.a.length;c++){if(i.d[c]&&kS.cn(i,c,b)){for(e=AS.LN(i.i,c),f=0,g=e.length;f<g;++f){d=e[f];if(d!=b)for(h=0;h<kS.Hk(a.L,d);h++)if(kS.ql(a.L,kS.Ik(a.L,d,h)))return true}return false}}return false};kS.lf=function lf(a,b){var c,d,e;if(kS.xk(a.L,b)<2)return false;if(kS.Hk(a.L,b)==2)return true;c=0;for(e=0;e<kS.Hk(a.L,b);e++){d=kS.Ik(a.L,b,e);kS.pl(a.L,d)&&(c+=kS.mi(a.L,d)-1)}return c>1};kS.mf=function mf(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y;kS.Xe(a);kS.Ve(a,9,4);U=gS.aK(kS.of(a.L.d),kS.of(a.L.e));kS.Ve(a,U,4);if(U==0){kS.Ve(a,a.L.I?1:0,1);kS.Ve(a,0,1);a.D=kS.We(a);return}V=X=W=H=0;for(f=0;f<a.L.d;f++){if((kS.Xh(a.L,f)&1)==0){switch(kS.ai(a.L,f)){case 6:break;case 7:++V;break;case 8:++X;break;default:++W;}kS.Lh(a.L,f)!=0&&++H}}kS.Ve(a,a.L.d,U);kS.Ve(a,a.L.e,U);kS.Ve(a,V,U);kS.Ve(a,X,U);kS.Ve(a,W,U);kS.Ve(a,H,U);for(g=0;g<a.L.d;g++)kS.ai(a.L,a.t[g])==7&&(kS.Xh(a.L,a.t[g])&1)==0&&kS.Ve(a,g,U);for(l=0;l<a.L.d;l++)kS.ai(a.L,a.t[l])==8&&(kS.Xh(a.L,a.t[l])&1)==0&&kS.Ve(a,l,U);for(m=0;m<a.L.d;m++)if(kS.ai(a.L,a.t[m])!=6&&kS.ai(a.L,a.t[m])!=7&&kS.ai(a.L,a.t[m])!=8&&(kS.Xh(a.L,a.t[m])&1)==0){kS.Ve(a,m,U);kS.Ve(a,kS.ai(a.L,a.t[m]),8)}for(n=0;n<a.L.d;n++)if(kS.Lh(a.L,a.t[n])!=0&&(kS.Xh(a.L,a.t[n])&1)==0){kS.Ve(a,n,U);kS.Ve(a,8+kS.Lh(a.L,a.t[n]),4)}T=0;u=0;for(o=1;o<a.L.d;o++){if(a.w[o]==-1){L=0}else{L=1+a.w[o]-u;u=a.w[o]}T<L&&(T=L)}K=kS.of(T);kS.Ve(a,K,4);u=0;for(p=1;p<a.L.d;p++){if(a.w[p]==-1){L=0}else{L=1+a.w[p]-u;u=a.w[p]}kS.Ve(a,L,K)}for(N=0;N<2*a.C;N++)kS.Ve(a,a.v[N],U);for(w=0;w<a.L.e;w++){G=(kS.oi(a.L,a.u[w])&wT)!=0||kS.pi(a.L,a.u[w])==32?1:kS.rl(a.L,a.u[w])?0:kS.mi(a.L,a.u[w]);kS.Ve(a,G,2)}c=0;for(q=0;q<a.L.d;q++)a.S[a.t[q]]!=0&&a.S[a.t[q]]!=3&&++c;kS.Ve(a,c,U);for(r=0;r<a.L.d;r++)if(a.S[a.t[r]]!=0&&a.S[a.t[r]]!=3){kS.Ve(a,r,U);if(a.U[a.t[r]]==0){kS.Ve(a,a.S[a.t[r]],3)}else{Y=a.S[a.t[r]]==1?a.U[a.t[r]]==1?4:6:a.U[a.t[r]]==1?5:7;kS.Ve(a,Y,3);kS.Ve(a,a.T[a.t[r]],3)}}b=0;for(A=0;A<a.L.e;A++)a.g[a.u[A]]!=0&&a.g[a.u[A]]!=3&&(!kS.yl(a.L,a.u[A])||kS.pi(a.L,a.u[A])==1)&&++b;kS.Ve(a,b,U);for(B=0;B<a.L.e;B++)if(a.g[a.u[B]]!=0&&a.g[a.u[B]]!=3&&(!kS.yl(a.L,a.u[B])||kS.pi(a.L,a.u[B])==1)){kS.Ve(a,B,U);if(kS.pi(a.L,a.u[B])==1){if(a.j[a.u[B]]==0){kS.Ve(a,a.g[a.u[B]],3)}else{Y=a.g[a.u[B]]==1?a.j[a.u[B]]==1?4:6:a.j[a.u[B]]==1?5:7;kS.Ve(a,Y,3);kS.Ve(a,a.i[a.u[B]],3)}}else{kS.Ve(a,a.g[a.u[B]],2)}}kS.Ve(a,a.L.I?1:0,1);I=0;for(s=0;s<a.L.d;s++)kS.Vh(a.L,a.t[s])!=0&&++I;if(I!=0){kS.Ve(a,1,1);kS.Ve(a,1,4);kS.Ve(a,I,U);for(h=0;h<a.L.d;h++){if(kS.Vh(a.L,a.t[h])!=0){kS.Ve(a,h,U);kS.Ve(a,kS.Vh(a.L,a.t[h]),8)}}}P=false;if(a.L.I){kS.ge(a,0,false,U,iT,1,-1);kS.he(a,2,false,U,64,1,-1);kS.ge(a,3,false,U,hT,1,-1);kS.ge(a,4,false,U,120,4,3);kS.ge(a,5,false,U,6,2,1);kS.ge(a,6,false,U,1,1,-1);kS.ge(a,7,false,U,jT,4,7);I=0;for(h=0;h<a.L.d;h++)kS.Sh(a.L,a.t[h])!=null&&++I;if(I>0){kS.Ve(a,1,1);kS.Ve(a,8,4);kS.Ve(a,I,U);for(i=0;i<a.L.d;i++){t=kS.Sh(a.L,a.t[i]);if(t!=null){kS.Ve(a,i,U);kS.Ve(a,t.length,4);for(M=0;M<t.length;M++)kS.Ve(a,t[M],8)}}}kS.he(a,9,false,U,96,2,5);kS.he(a,10,false,U,31,5,0);kS.ge(a,11,false,U,JT,1,-1);kS.he(a,12,false,U,wT,8,7);kS.ge(a,13,false,U,oT,3,14);kS.ge(a,14,false,U,qT,5,17);P=P|kS.ge(a,16,false,U,tT,3,22)}I=0;for(j=0;j<a.L.d;j++)a.a!=null&&a.a[a.t[j]]!=-1&&++I;if(I!=0){P=kS.$e(a,P);kS.Ve(a,1,1);kS.Ve(a,1,4);kS.Ve(a,I,U);for(h=0;h<a.L.d;h++){if(a.a!=null&&a.a[a.t[h]]!=-1){kS.Ve(a,h,U);kS.Ve(a,a.a[a.t[h]],4)}}}if((a.K&8)!=0){I=0;S=0;for(h=0;h<a.L.d;h++){Q=kS.Nh(a.L,a.t[h]);if(Q!=null){++I;S=gS.aK(S,gS.GK(Q).length)}}if(I!=0){P=kS.$e(a,P);R=kS.of(S);kS.Ve(a,1,1);kS.Ve(a,2,4);kS.Ve(a,I,U);kS.Ve(a,R,4);for(i=0;i<a.L.d;i++){J=kS.Nh(a.L,a.t[i]);if(J!=null){kS.Ve(a,i,U);kS.Ve(a,gS.GK(J).length,R);for(M=0;M<gS.GK(J).length;M++)kS.Ve(a,gS.GK(J).charCodeAt(M),7)}}}}if(a.L.I){P=P|kS.ge(a,19,P,U,lT,3,25);P=P|kS.he(a,20,P,U,yT,3,15)}I=0;for(k=0;k<a.L.d;k++)kS.Yh(a.L,a.t[k])!=0&&++I;if(I!=0){P=kS.$e(a,P);kS.Ve(a,1,1);kS.Ve(a,5,4);kS.Ve(a,I,U);for(e=0;e<a.L.d;e++){if(kS.Yh(a.L,a.t[e])!=0){kS.Ve(a,e,U);kS.Ve(a,kS.Yh(a.L,a.t[e])>>4,2)}}}if(a.L.I){P=P|kS.ge(a,22,P,U,uT,1,-1);P=P|kS.he(a,23,P,U,CT,1,-1);P=P|kS.he(a,24,P,U,xT,2,19)}if((a.K&16)!=0){for(e=0;e<a.L.d;e++){if(kS.Si(a.L,a.t[e])){P=kS.$e(a,P);kS.Ve(a,1,1);kS.Ve(a,9,4);for(d=0;d<a.L.d;d++)kS.Ve(a,kS.Si(a.L,a.t[d])?1:0,1);break}}}O=kS.bf(a);if(O!=null){I=0;for(C=0;C<a.L.e;C++)O[a.u[C]]&&++I;P=kS.$e(a,P);kS.Ve(a,1,1);kS.Ve(a,10,4);kS.Ve(a,I,U);for(D=0;D<a.L.e;D++)O[a.u[D]]&&kS.Ve(a,D,U)}a.L.I&&(P=P|kS.ge(a,27,P,U,bT,1,-1));I=0;for(F=0;F<a.L.e;F++)kS.pi(a.L,a.u[F])==32&&++I;if(I!=0){kS.$e(a,P);kS.Ve(a,1,1);kS.Ve(a,12,4);kS.Ve(a,I,U);for(v=0;v<a.L.e;v++)kS.pi(a.L,a.u[v])==32&&kS.Ve(a,v,U)}kS.Ve(a,0,1);a.D=kS.We(a)};kS.nf=function nf(a){var b,c,d,e,f,g,h,i,j,k,l;a.S=OC(fS.KD,HT,5,a.L.d,15,1);for(b=0;b<a.L.d;b++){if(a.W[b]==1||a.W[b]==2){i=false;if(kS.Hk(a.L,b)==2&&kS.Jk(a.L,b,0)==2&&kS.Jk(a.L,b,1)==2){for(h=0;h<kS.Hk(a.L,b);h++){e=kS.Gk(a.L,b,h);l=0;k=OC(fS.OD,YS,5,3,15,1);for(j=0;j<kS.Hk(a.L,e);j++){k[l]=kS.Gk(a.L,e,j);k[l]!=b&&++l}l==2&&a.c[k[0]]>a.c[k[1]]^a.B[k[0]]<a.B[k[1]]&&(i=!i)}}else{for(h=1;h<kS.Hk(a.L,b);h++){for(j=0;j<h;j++){f=kS.Gk(a.L,b,h);g=kS.Gk(a.L,b,j);a.c[f]>a.c[g]&&(i=!i);a.B[f]<a.B[g]&&(i=!i)}}}a.S[b]=a.W[b]==1^i?1:2}else{a.S[b]=a.W[b]}}a.g=OC(fS.KD,HT,5,a.L.e,15,1);for(c=0;c<a.L.e;c++){if(a.k[c]==1||a.k[c]==2){i=false;for(h=0;h<2;h++){d=kS.ei(a.L,h,c);if(kS.Hk(a.L,d)==3){k=OC(fS.OD,YS,5,2,15,1);l=0;for(j=0;j<3;j++)kS.Gk(a.L,d,j)!=kS.ei(a.L,1-h,c)&&(k[l++]=kS.Gk(a.L,d,j));a.c[k[0]]>a.c[k[1]]&&(i=!i);a.B[k[0]]<a.B[k[1]]&&(i=!i)}}a.g[c]=a.k[c]==1^i?1:2}else{a.g[c]=a.k[c]}}};kS.of=function of(a){var b;b=0;while(a>0){a>>=1;++b}return b};kS.pf=function pf(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o;i=OC(fS.OD,YS,5,32,15,1);j=0;for(d=0;d<a.L.d;d++){if((a.S[d]==1||a.S[d]==2)&&a.U[d]==b){h=a.T[d];if(i[h]<a.c[d]){i[h]==0&&++j;i[h]=a.c[d]}}}for(f=0;f<a.L.e;f++){if((a.g[f]==1||a.g[f]==2)&&a.j[f]==b&&kS.pi(a.L,f)==1){h=a.i[f];o=gS.aK(a.c[kS.ei(a.L,0,f)],a.c[kS.ei(a.L,1,f)]);if(i[h]<o){i[h]==0&&++j;i[h]=o}}}g=OC(fS.KD,HT,5,32,15,1);for(k=0;k<j;k++){m=-1;n=0;for(l=0;l<32;l++){if(n<i[l]){n=i[l];m=l}}i[m]=0;g[m]=k<<24>>24}for(c=0;c<a.L.d;c++)(a.S[c]==1||a.S[c]==2)&&a.U[c]==b&&(a.T[c]=g[a.T[c]]);for(e=0;e<a.L.e;e++)(a.g[e]==1||a.g[e]==2)&&a.j[e]==b&&kS.pi(a.L,e)==1&&(a.i[e]=g[a.i[e]])};
kS.qf=function qf(a,b,c){var d,e;a.N=b;for(d=0;d<a.L.d;d++){a.c[d]=c[d];a.W[d]=0;a.$[d]=false}for(e=0;e<a.L.e;e++){a.k[e]=0;a.o[e]=false}};kS.rf=function rf(a,b){var c,d,e;c=kS.ei(a.L,0,b);if(c>=a.L.d)return false;if(a.W[c]==1||a.W[c]==2)return true;if(a.W[c]==3)return false;d=kS.pk(a.L,c);if(d!=-1)return a.k[d]==1||a.k[d]==2;for(e=0;e<kS.Hk(a.L,c);e++){if(kS.Jk(a.L,c,e)==2){if(a.W[kS.Gk(a.L,c,e)]==1||a.W[kS.Gk(a.L,c,e)]==2)return true}}return false};kS.sf=function sf(a,b){var c;c=OC(fS.OD,YS,5,b,15,1);gS.XK(a,c,a.length);return c};kS.tf=function tf(a,b){var c;c=OC(fS.CG,aT,5,b,16,1);gS.XK(a,c,a.length);return c};kS.uf=function uf(a){var b,c;if(a.R!=null)for(b=0;b<a.L.d;b++)kS.jj(a.L,b,a.R[b]);if(a.f!=null)for(c=0;c<a.L.e;c++)kS.Gj(a.L,c,a.f[c])};kS.vf=function vf(a){var b,c,d,e,f,g,h,i,j,k,l;for(b=0;b<a.L.d;b++){if(a.W[b]==1||a.W[b]==2){i=false;if(kS.xk(a.L,b)!=0&&kS.Hk(a.L,b)==2&&kS.Jk(a.L,b,0)==2&&kS.Jk(a.L,b,1)==2){for(h=0;h<kS.Hk(a.L,b);h++){e=kS.Gk(a.L,b,h);l=0;k=OC(fS.OD,YS,5,3,15,1);for(j=0;j<kS.Hk(a.L,e);j++){k[l]=kS.Gk(a.L,e,j);k[l]!=b&&++l}l==2&&a.c[k[0]]>a.c[k[1]]^k[0]<k[1]&&(i=!i)}}else{for(h=1;h<kS.Hk(a.L,b);h++){for(j=0;j<h;j++){f=kS.Gk(a.L,b,h);g=kS.Gk(a.L,b,j);a.c[f]>a.c[g]&&(i=!i);f<g&&(i=!i)}}}kS.vj(a.L,b,a.W[b]==1^i?1:2,a.X[b])}else{kS.vj(a.L,b,a.W[b],a.X[b])}}for(c=0;c<a.L.e;c++){if(a.k[c]==1||a.k[c]==2){i=false;for(h=0;h<2;h++){d=kS.ei(a.L,h,c);if(kS.Hk(a.L,d)==3){k=OC(fS.OD,YS,5,2,15,1);l=0;for(j=0;j<3;j++)kS.Gk(a.L,d,j)!=kS.ei(a.L,1-h,c)&&(k[l++]=kS.Gk(a.L,d,j));a.c[k[0]]>a.c[k[1]]&&(i=!i);k[0]<k[1]&&(i=!i)}}kS.Kj(a.L,c,a.k[c]==1^i?1:2,a.n[c])}else{kS.Kj(a.L,c,a.k[c],a.n[c])}}};kS.wf=function wf(a){var b;for(b=0;b<a.L.d;b++){kS.zj(a.L,b,a.H[b])}};kS.xf=function xf(a){var b,c;for(b=0;b<a.L.d;b++)!kS.Ai(a.L,b)&&a.W[b]==3&&kS.mj(a.L,b,true);for(c=0;c<a.L.e;c++){a.k[c]==3&&kS.mi(a.L,c)==2&&kS.Nj(a.L,c,26)}};kS.yf=function yf(a,b){return a<b?a:a-b};kS.zf=function zf(a,b){var c;if(a.o>TS)throw HG(new gS.OJ('Cannot canonize a molecule having more than 65535 atoms'));if(a.p>TS)throw HG(new gS.OJ('Cannot canonize a molecule having more than 65535 bonds'));this.L=a;this.K=b;kS.Qo(this.L,3);kS.we(this);this._=(b&64)!=0;if(!this._){for(c=0;c<this.L.o;c++){if(kS._h(this.L,c)!=0){this._=true;break}}}this.W=OC(fS.KD,HT,5,this.L.d,15,1);this.X=OC(fS.CG,aT,5,this.L.d,16,1);this.$=OC(fS.CG,aT,5,this.L.d,16,1);this.k=OC(fS.KD,HT,5,this.L.e,15,1);this.o=OC(fS.CG,aT,5,this.L.e,16,1);this.n=OC(fS.CG,aT,5,this.L.e,16,1);kS.Ae(this);kS.Fe(this);kS.Ee(this)};nH(59,1,{},kS.zf);_.p=0;_.r=0;_.A=false;_.C=0;_.F=false;_.G=false;_.I=0;_.K=0;_.N=0;_.Q=false;_._=false;fS.cE=YI(59);kS.Af=function Af(a,b){var c,d,e,f;if(a.d!=b.d)return a.d>b.d?1:-1;e=a.a.length;f=b.a.length;c=e<f?e:f;for(d=0;d<c;d++){--e;--f;if(a.a[e]!==b.a[f])return a.a[e]>b.a[f]?1:-1}if(e!=f)return e>f?1:-1;if(a.b!=b.b)return a.b>b.b?1:-1;return 0};kS.Bf=function Bf(a,b){return kS.Af(a,b)};kS.Cf=function Cf(){};nH(133,1,{},kS.Cf);_.eb=function Df(a,b){return kS.Bf(a,b)};_.ab=function Ef(a){return this===a};fS.VD=YI(133);kS.Ff=function Ff(){};nH(75,1,{75:1},kS.Ff);_.b=0;_.c=0;_.d=0;fS.UD=YI(75);kS.Gf=function Gf(a,b){if(a.c!=b.c)return a.c>b.c?1:-1;return 0};kS.Hf=function Hf(a,b){return kS.Gf(a,b)};kS.If=function If(){};nH(134,1,{},kS.If);_.eb=function Jf(a,b){return kS.Hf(a,b)};_.ab=function Kf(a){return this===a};fS.XD=YI(134);kS.Lf=function Lf(){};nH(76,1,{76:1},kS.Lf);_.a=0;_.b=0;_.c=0;fS.WD=YI(76);kS.Mf=function Mf(a,b,c){if(a.b==0){++a.c;a.b=63}if(a.b==63){a.d[a.c]=ZG(a.d[a.c],c);a.b-=b}else{if(a.b>=b){a.d[a.c]=$G(a.d[a.c],b);a.d[a.c]=ZG(a.d[a.c],c);a.b-=b}else{a.d[a.c]=$G(a.d[a.c],a.b);a.d[a.c]=ZG(a.d[a.c],_G(c,b-a.b));b-=a.b;++a.c;a.b=63-b;a.d[a.c]=ZG(a.d[a.c],JG(c,fS.RG((1<<b)-1)))}}};kS.Nf=function Nf(a,b){a.d[a.c]=IG(a.d[a.c],b)};kS.Of=function Of(a,b){var c;for(c=0;c<a.c;c++)if(YG(a.d[c],b.d[c]))return WG(a.d[c],b.d[c])?-1:1;return SG(a.d[a.c],b.d[a.c])?0:WG(a.d[a.c],b.d[a.c])?-1:1};kS.Pf=function Pf(a,b){a.a=b;a.c=0;a.b=63;AS.DO(a.d)};kS.Qf=function Qf(a){this.d=OC(fS.PD,FT,5,a,14,1)};nH(53,1,{53:1,25:1},kS.Qf);_.fb=function Rf(a){return kS.Of(this,a)};_.a=0;_.b=0;_.c=0;fS.YD=YI(53);kS.Sf=function Sf(a,b,c,d){var e,f;this.a=OC(fS.OD,YS,5,b,15,1);this.b=OC(fS.OD,YS,5,d,15,1);for(e=0;e<b;e++)this.a[e]=a[e];for(f=0;f<d;f++)this.b[f]=c[f]};nH(101,1,{101:1},kS.Sf);fS.ZD=YI(101);kS.Tf=function Tf(a,b,c){var d,e,f,g,h,i,j,k,l;if(b==null)return;h=0;for(e=0;e<a.i.d;e++)b[e]&&++h;l=OC(fS.OD,YS,5,h,15,1);h=0;for(d=0;d<a.i.d;d++)b[d]&&(l[h++]=d);j=false;for(g=new AS.tO(c);g.a<g.c.a.length;){f=AS.sO(g);if(f.length==l.length){i=false;for(k=0;k<f.length;k++){if(f[k]!==l[k]){i=true;break}}if(!i){j=true;break}}}j||(c.a[c.a.length]=l,true)};kS.Uf=function Uf(a,b){var c,d;for(d=0;d<a.g[b].length;d++){c=a.g[b][d];if(a.f[c]&&(a.o[c]==1||a.o[c]==2)&&a.k[c]==0)return true}return false};kS.Vf=function Vf(a,b,c){var d,e,f,g,h;e=0;g=0;for(h=0;h<a.g[b].length;h++){d=a.g[b][h];if(a.k[d]==c){f=1<<a.j[d];if((g&f)==0){g|=f;++e}}}return e};kS.Wf=function Wf(a){var b,c,d,e,f,g,h,i,j,k,l,m;k=new AS.ZN;for(l=0;l<a.i.d;l++){if(kS.xk(a.i,l)<2||kS.Hk(a.i,l)>2){for(g=1;g<kS.Hk(a.i,l);g++){b=kS.Gk(a.i,l,g);for(j=0;j<g;j++){c=kS.Gk(a.i,l,j);kS._f(a,b,c)&&kS.Tf(a,kS.gg(a,b,c),k)}}}}for(m=0;m<a.i.e;m++){if(a.c[m]!=0){if(kS.mi(a.i,m)!=2||a.c[m]!=2)continue}b=kS.ei(a.i,0,m);c=kS.ei(a.i,1,m);kS._f(a,b,c)&&kS.Tf(a,kS.gg(a,b,c),k)}for(h=k.a.length-1;h>=0;h--){d=(jS.xR(h,k.a.length),k.a[h]);e=false;for(j=0;j<d.length;j++){if(a.f[d[j]]){e=true;break}}e||AS.SN(k,d)}a.g=AS.YN(k,MC(fS.OD,[DT,YS],[6,5],15,[0,0],2));AS.RO(a.g,new kS.kg);a.e=OC(fS.CG,aT,5,a.i.d,16,1);for(f=0;f<a.g.length;f++)for(i=0;i<a.g[f].length;i++)a.e[a.g[f][i]]=true};kS.Xf=function Xf(a,b,c,d){var e,f;for(f=0;f<kS.Hk(a.i,c);f++){e=kS.Gk(a.i,c,f);if(!d[e]&&kS._f(a,b,e))return e}return -1};kS.Yf=function Yf(a,b){return a.f[b]&&(a.o[b]==1||a.o[b]==2)};kS.Zf=function Zf(a,b){return a.e[b]};kS.$f=function $f(a){var b,c;c=true;for(b=0;b<a.i.d;b++){if(a.o[b]!=0&&!a.e[b]){c=false;break}}return c};kS._f=function _f(a,b,c){var d,e,f,g,h;if(b==c)return false;if(a.a[b]!==a.a[c])return false;if(a.o[b]!=0){if(a.o[b]==3||a.o[c]==3)return false;if(a.p[b]^a.o[b]!==a.o[c])return false;if(a.k[b]!==a.k[c]||a.j[b]!==a.j[c])return false}d=kS.Ek(a.i,b,c);if(d!=-1){if(kS.mi(a.i,d)==1&&a.c[d]!=0)return false;if(kS.mi(a.i,d)==2&&a.c[d]==2)return false}if(kS.xk(a.i,b)==1&&!kS.ol(a.i,b)){e=-1;for(h=0;h<kS.Hk(a.i,b);h++){if(kS.Gk(a.i,b,h)!=c&&kS.Jk(a.i,b,h)==2){e=kS.Ik(a.i,b,h);break}}f=-1;for(g=0;g<kS.Hk(a.i,c);g++){if(kS.Gk(a.i,c,g)!=b&&kS.Jk(a.i,c,g)==2){f=kS.Ik(a.i,c,g);break}}if(e!=-1&&a.c[e]!=0&&a.d[e]^a.c[e]===a.c[f])return false}return true};kS.ag=function ag(a,b,c,d,e){var f,g,h,i,j,k;i=null;f=null;for(k=0;k<a.g[b].length;k++){g=a.g[b][k];a.f[g]&&(a.o[g]==1||a.o[g]==2)&&(a.k[g]==0?(f=kS.ig(f,(e[g]<<16)+g)):a.k[g]==d&&a.j[g]==c&&(i=kS.ig(i,(e[g]<<16)+g)))}h=kS.Ag(i,f);if(h==0)return false;if(h<0){for(j=0;j<a.g[b].length;j++){g=a.g[b][j];if(a.f[g]&&(a.o[g]==1||a.o[g]==2)){if(a.k[g]==0){a.k[g]=d<<24>>24;a.j[g]=c<<24>>24}else if(a.k[g]==d&&a.j[g]==c){a.k[g]=0;a.j[g]=-1}}}}return true};kS.bg=function bg(a,b){var c,d,e,f,g,h;if(!a.b)return false;e=false;for(f=a.b.a.length-1;f>=0;f--){d=false;g=AS.LN(a.b,f);g.a==2?(d=kS.ag(a,g.b,g.c,g.d,b)):g.a==1&&(d=kS.fg(a,g.b,b));if(d){AS.SN(a.b,g);for(h=0;h<a.g[g.b].length;h++){c=a.g[g.b][h];a.n[c]=false}e=true}}return e};kS.cg=function cg(a){var b,c,d,e,f,g,h,i;if(a.g!=null){g=new kS.zg(a);a.b=new AS.ZN;for(e=0;e<a.g.length;e++){d=kS.rg(g,e);if(d==0){kS.ng(g,e);h=kS.Vf(a,e,2);b=kS.Vf(a,e,1);c=kS.Uf(a,e);if(h==1&&b==1&&!c){kS.eg(a,e,g.a+g.f++);AS.GN(a.b,new kS.Wg(e,1,-1,-1))}if(h>0){if(c){kS.dg(a,e,g.i+g.g++,2);++h}AS.GN(a.b,new kS.Wg(e,1,-1,-1))}else if(b>0){c&&kS.dg(a,e,g.a+g.f++,1);AS.GN(a.b,new kS.Wg(e,1,-1,-1))}else if(c){kS.dg(a,e,g.a+g.f++,1);AS.GN(a.b,new kS.Wg(e,1,-1,-1))}}else if(d==1){if(kS.Uf(a,e)){f=kS.qg(g,e);i=kS.sg(g,e);AS.GN(a.b,new kS.Wg(e,2,f,i))}else{kS.ng(g,e);AS.GN(a.b,new kS.Wg(e,1,-1,-1))}}}}};kS.dg=function dg(a,b,c,d){var e,f;for(f=0;f<a.g[b].length;f++){e=a.g[b][f];if(a.f[e]&&(a.o[e]==1||a.o[e]==2)&&a.k[e]==0){a.k[e]=d<<24>>24;a.j[e]=c<<24>>24}}};kS.eg=function eg(a,b,c){var d,e;for(e=0;e<a.g[b].length;e++){d=a.g[b][e];if(a.k[d]==2){a.k[d]=1;a.j[d]=c<<24>>24}}};kS.fg=function fg(a,b,c){var d,e,f,g,h,i,j,k;f=a.g[b];e=1;for(i=0;i<f.length;i++){d=f[i];if(a.f[d]&&a.k[d]==2){e=2;break}}g=OC(fS.OD,DT,6,32,0,2);for(j=0;j<f.length;j++){d=f[j];a.f[d]&&a.k[d]==e&&(g[a.j[d]]=kS.ig(g[a.j[d]],(c[d]<<16)+d))}for(k=0;k<32;k++)g[k]!=null&&AS.OO(g[k]);AS.RO(g,new kS.Bg);if(kS.Ag(g[0],g[1])==0)return false;for(h=0;h<g[0].length;h++){d=g[0][h]&TS;a.k[d]=0;a.j[d]=-1}return true};kS.gg=function gg(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v;i=OC(fS.OD,YS,5,a.i.d,15,1);s=OC(fS.OD,YS,5,a.i.d,15,1);o=OC(fS.CG,aT,5,a.i.d,16,1);p=OC(fS.CG,aT,5,a.i.d,16,1);j=OC(fS.CG,aT,5,a.i.d,16,1);i[0]=b;s[b]=c;s[c]=-2;o[b]=true;o[c]=true;f=0;k=0;while(f<=k){g=i[f];if(s[g]==g){for(l=0;l<kS.Hk(a.i,g);l++){d=kS.Gk(a.i,g,l);if(!o[d]){if(kS.Jk(a.i,g,l)==2&&kS.ai(a.i,d)<10){i[++k]=d;s[d]=d;j[d]=j[g]||kS.xk(a.i,d)==2;p[d]=j[g]&&!p[g];o[d]=true}else if(j[g]&&p[g]){t=kS.Xf(a,d,s[g],o);if(t==-1)return null;i[++k]=d;s[d]=t;s[t]=-2;j[d]=false;o[d]=true;o[t]=true}else if(kS.vl(a.i,kS.Ik(a.i,g,l))){i[++k]=d;s[d]=d;j[d]=false;o[d]=true;if((kS.ai(a.i,d)==6&&kS.xk(a.i,d)==0||kS.ai(a.i,d)==7&&kS.Lh(a.i,d)==1||kS.ai(a.i,d)==14||kS.ai(a.i,d)==15&&kS.Hk(a.i,d)>2||kS.ai(a.i,d)==16&&kS.Hk(a.i,d)>2)&&kS.Hk(a.i,d)>2){h=false;for(q=1;q<kS.Hk(a.i,d);q++){u=kS.Gk(a.i,d,q);if(!o[u]){for(r=0;r<q;r++){v=kS.Gk(a.i,d,r);if(!o[v]){if(kS._f(a,u,v)){i[++k]=u;s[u]=v;s[v]=-2;j[u]=false;o[u]=true;o[v]=true;h=true}}}}}if(!h)return null}}}}}else{e=OC(fS.CG,aT,5,kS.Hk(a.i,g),16,1);for(m=0;m<kS.Hk(a.i,g);m++){d=kS.Gk(a.i,g,m);if(o[d]){e[m]=s[d]==d}else{for(q=0;q<kS.Hk(a.i,d);q++){if(kS.Gk(a.i,d,q)==s[g]){e[m]=true;break}}}}for(n=0;n<kS.Hk(a.i,g);n++){if(e[n]){d=kS.Gk(a.i,g,n);if(o[d]){if(kS.Ek(a.i,d,s[g])==-1)return null}else{i[++k]=d;s[d]=d;p[d]=false;j[d]=true;o[d]=true}}}for(l=0;l<kS.Hk(a.i,g);l++){if(!e[l]){d=kS.Gk(a.i,g,l);if(!o[d]){t=kS.Xf(a,d,s[g],o);if(t==-1)return null;i[++k]=d;s[d]=t;s[t]=-2;j[d]=false;o[d]=true;o[t]=true}}}}++f}return o};kS.hg=function hg(a,b,c,d,e,f,g,h,i,j){this.i=a;this.a=b;this.f=c;this.o=d;this.c=e;this.k=f;this.j=g;this.p=h;this.d=i;this.n=j;kS.Wf(this)};kS.ig=function ig(a,b){var c,d;d=OC(fS.OD,YS,5,a==null?1:a.length+1,15,1);for(c=0;c<d.length-1;c++)d[c]=a[c];d[d.length-1]=b;return d};nH(142,1,{},kS.hg);fS.aE=YI(142);kS.jg=function jg(a,b){var c;if(a.length!=b.length)return a.length<b.length?-1:1;for(c=0;c<a.length;c++)if(a[c]!==b[c])return a[c]<b[c]?-1:1;return 0};kS.kg=function kg(){};nH(145,1,{},kS.kg);_.eb=function lg(a,b){return kS.jg(a,b)};_.ab=function mg(a){return this===a};fS.$D=YI(145);kS.ng=function ng(a,b){var c,d,e,f,g,h;for(e=0;e<a.b;e++){if(a.e[e][b]&&a.c[e]!=-3){for(d=0;d<=a.j.g.length;d++){if(d!=b&&a.e[e][d]){a.e[e][b]=false;h=e<a.a?e:e<a.b?e-a.a:-1;g=kS.xg(a,e<a.a?1:e<a.b?2:0);for(f=0;f<a.j.g[b].length;f++){c=a.j.g[b][f];kS.Yf(a.j,c)&&a.j.j[c]==h&&(a.j.j[c]=g<<24>>24)}}}}}};kS.og=function og(a,b,c){var d,e,f,g,h;h=false;g=1;b[c]=1;d=true;while(d){d=false;for(e=0;e<a.b;e++){if(b[e]==g){for(f=0;f<a.b;f++){if(b[f]==0&&kS.wg(a,e,f)){if(a.c[f]==-2){b[f]=g+1;d=true}else if(a.c[f]!==a.c[c]){b[f]=g+1;h=true}}}}}++g}return h};kS.pg=function pg(a,b,c,d){var e,f,g,h,i,j,k,l,m,n,o;for(i=d+1;i<a.j.g.length;i++){if(i!=d&&a.e[b][i]&&a.e[c][i]){g=OC(fS.OD,YS,5,2,15,1);g[0]=c;g[1]=b;return g}}o=OC(fS.OD,YS,5,a.b,15,1);k=OC(fS.OD,YS,5,a.b,15,1);j=OC(fS.OD,YS,5,a.b,15,1);f=0;l=0;j[0]=b;k[b]=1;while(f<=l){for(m=0;m<a.d[j[f]].length;m++){e=a.d[j[f]][m];if(e==c){if(f==0)continue;h=k[j[f]]+1;g=OC(fS.OD,YS,5,h,15,1);g[0]=e;g[1]=j[f];for(n=2;n<h;n++)g[n]=o[g[n-1]];return g}if(k[e]==0&&a.c[e]!=-3){k[e]=k[j[f]]+1;j[++l]=e;o[e]=j[f]}}++f}return null};kS.qg=function qg(a,b){var c;for(c=0;c<a.b;c++)if(a.e[c][b]&&a.c[c]==-3)return c<a.a?c:c<a.b?c-a.a:-1;return -1};kS.rg=function rg(a,b){var c,d;c=0;for(d=0;d<a.b;d++)a.e[d][b]&&a.c[d]==-3&&++c;return c};kS.sg=function sg(a,b){var c;for(c=0;c<a.b;c++)if(a.e[c][b]&&a.c[c]==-3)return c<a.a?1:c<a.b?2:0;return -1};kS.tg=function tg(a,b){return b<a.a?b:b<a.b?b-a.a:-1};kS.ug=function ug(a,b){return b<a.a?1:b<a.b?2:0};kS.vg=function vg(a,b){var c,d;d=a.j.k[b];c=a.j.j[b];return d==0?a.b:d==1?c:a.a+c};kS.wg=function wg(a,b,c){var d;for(d=0;d<a.j.g.length;d++)if(a.e[b][d]&&a.e[c][d])return true;return false};kS.xg=function xg(a,b){return b==1?a.a+a.f++:a.i+a.g++};kS.yg=function yg(a,b){var c,d,e,f,g,h,i,j,k,l;k=KS;i=-1;l=-1;j=-1;for(d=0;d<a.j.i.d;d++){if(kS.Yf(a.j,d)&&a.j.k[d]!=0){for(h=0;h<b.length;h++){e=kS.tg(a,b[h]);f=kS.ug(a,b[h]);if(a.j.k[d]==f&&a.j.j[d]==e){if(k>a.j.a[d]+(f==1?SS:0)){k=a.j.a[d]+(f==1?SS:0);i=e;l=f;j=b[h]}}}}}for(c=0;c<a.j.i.d;c++){if(kS.Yf(a.j,c)&&a.j.k[c]==l&&a.j.j[c]==i){a.j.k[c]=0;a.j.j[c]=-1}}for(g=0;g<a.j.g.length;g++)a.e[j][g]=false};kS.zg=function zg(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q;this.j=a;for(d=0;d<a.i.d;d++){a.f[d]&&(a.o[d]==1||a.o[d]==2)&&(a.k[d]==1?this.a<=a.j[d]&&(this.a=1+a.j[d]):a.k[d]==2&&this.i<=a.j[d]&&(this.i=1+a.j[d]))}this.b=this.a+this.i;this.e=MC(fS.CG,[FS,aT],[11,5],16,[this.b+1,a.g.length+1],2);for(e=0;e<a.i.d;e++)a.f[e]&&(a.o[e]==1||a.o[e]==2)&&!a.e[e]&&(this.e[kS.vg(this,e)][a.g.length]=true);for(i=0;i<a.g.length;i++){for(q=0;q<a.g[i].length;q++){c=a.g[i][q];a.f[c]&&(a.o[c]==1||a.o[c]==2)&&(this.e[kS.vg(this,c)][i]=true)}}this.d=OC(fS.OD,DT,6,this.b,0,2);for(j=0;j<a.g.length;j++){for(n=1;n<this.b;n++){if(this.e[n][j]){for(o=0;o<n;o++){if(this.e[o][j]){this.d[n]=kS.ig(this.d[n],o);this.d[o]=kS.ig(this.d[o],n)}}}}}this.c=OC(fS.OD,YS,5,this.b+1,15,1);for(m=0;m<this.b;m++){this.e[m][a.g.length]?(this.c[m]=-1):(this.c[m]=-2)}for(k=0;k<a.g.length;k++){if(this.e[this.b][k]){for(l=0;l<this.b;l++){this.e[l][k]&&this.c[l]!=k&&(this.c[l]==-2?(this.c[l]=k):(this.c[l]=-3))}}}for(b=0;b<this.b;b++){if(this.c[b]>=-1){f=OC(fS.OD,YS,5,this.b,15,1);if(kS.og(this,f,b)){for(l=0;l<this.b;l++){f[l]!=0&&(this.c[l]=-3)}}}}for(h=0;h<a.g.length-1;h++){for(n=1;n<this.b;n++){if(this.e[n][h]&&this.c[n]!=-3){for(o=0;o<n;o++){if(this.e[o][h]&&this.c[o]!=-3){g=kS.pg(this,n,o,h);if(g!=null){for(p=0;p<g.length;p++)this.c[g[p]]=-3;kS.yg(this,g);break}}}}}}};nH(143,1,{},kS.zg);_.a=0;_.b=0;_.f=0;_.g=0;_.i=0;fS._D=YI(143);kS.Ag=function Ag(a,b){var c,d;if(a==null)return b==null?0:1;if(b==null)return -1;c=gS.bK(a.length,b.length);for(d=0;d<c;d++)if((a[d]&KT)!=(b[d]&KT))return (a[d]&KT)<(b[d]&KT)?-1:1;return a.length==b.length?0:a.length<b.length?-1:1};kS.Bg=function Bg(){};nH(144,1,{},kS.Bg);_.eb=function Cg(a,b){return kS.Ag(a,b)};_.ab=function Dg(a){return this===a};fS.bE=YI(144);kS.Eg=function Eg(a,b){if(a.a!=b.a)return a.a<b.a?-1:1;if(a.b!=b.b)return a.b<b.b?-1:1;if(a.c!=b.c)return a.c<b.c?-1:1;return 0};kS.Fg=function Fg(a,b){return $wnd.Math.sqrt((b.a-a.a)*(b.a-a.a)+(b.b-a.b)*(b.b-a.b)+(b.c-a.c)*(b.c-a.c))};kS.Gg=function Gg(a,b,c,d){a.a=b;a.b=c;a.c=d};kS.Hg=function Hg(a,b){kS.Gg(a,b.a,b.b,b.c);return a};kS.Ig=function Ig(){};kS.Jg=function Jg(a,b,c){this.a=a;this.b=b;this.c=c};nH(35,1,{35:1,4:1,25:1},kS.Ig,kS.Jg);_.fb=function Kg(a){return kS.Eg(this,a)};_.ab=function Lg(a){var b;if(a==null||!AD(a,35))return false;b=a;return $wnd.Math.abs(b.a-this.a)+$wnd.Math.abs(b.b-this.b)+$wnd.Math.abs(b.c-this.c)<1.0E-6};_.db=function Mg(){var a;a=new zS.fL('0.00');return '['+zS.eL(a,this.a)+', '+zS.eL(a,this.b)+', '+zS.eL(a,this.c)+']'};_.a=0;_.b=0;_.c=0;fS.dE=YI(35);kS.Ng=function Ng(a,b){b.c*=a.c;b.a=b.a*a.c+a.a;b.b=b.b*a.c+a.b};kS.Og=function Og(a,b){b.a=b.a*a.c+a.a;b.b=b.b*a.c+a.b};kS.Pg=function Pg(a,b){b.c=b.c*a.c+a.a;b.d=b.d*a.c+a.b;b.b*=a.c;b.a*=a.c};kS.Qg=function Qg(a){a.a=0;a.b=0;a.c=1};kS.Rg=function Rg(a,b){return b*a.c+a.a};kS.Sg=function Sg(a,b){return b*a.c+a.b};kS.Tg=function Tg(){kS.Qg(this)};kS.Ug=function Ug(a,b,c){var d,e,f,g;kS.Qg(this);e=b.b/a.b;g=b.a/a.a;f=0;f==0&&(f=24);d=f/c;this.c=$wnd.Math.min(d,$wnd.Math.min(e,g));this.a=b.c+b.b/2-this.c*(a.c+a.b/2);this.b=b.d+b.a/2-this.c*(a.d+a.a/2)};nH(74,1,{},kS.Tg,kS.Ug);_.db=function Vg(){return 'DepictorTransformation Offset: '+this.a+','+this.b+' Scaling: '+this.c};_.a=0;_.b=0;_.c=0;fS.eE=YI(74);kS.Wg=function Wg(a,b,c,d){this.b=a;this.a=b;this.c=c;this.d=d};nH(43,1,{43:1},kS.Wg);_.a=0;_.b=0;_.c=0;_.d=0;fS.fE=YI(43);kS.Xg=function Xg(a){var b,c,d,e,f,g;if(a.j!=0)return a.j;if(a.i&&kS.ai(a.e,a.a)!=15&&kS.ai(a.e,a.a)!=16){for(g=0;g<kS.tk(a.e,a.a);g++){f=kS.Ik(a.e,a.a,g);if(kS.Vi(a.e,f,a.a)){kS.Gk(a.e,a.a,g)==a.b?(a.j=kS.pi(a.e,f)==17?3:1):(a.j=kS.pi(a.e,f)==17?1:3);return a.j}}}b=kS.di(a.e,a.a,a.g);d=kS.di(a.e,a.a,a.b);d<b&&(d+=eT);if(kS.tk(a.e,a.a)==2){c=d-b;if(c>3.0915926535897933&&c<3.191592653589793){a.j=-1;return a.j}a.j=c<fT?4:2;return a.j}else{e=kS.di(a.e,a.a,a.d);e<b&&(e+=eT);a.j=e<d?2:4;return a.j}};kS.Yg=function Yg(a,b,c,d){var e,f,g,h;this.e=a;this.g=c;this.a=d;g=-1;for(h=0;h<kS.tk(this.e,this.a);h++){e=kS.Gk(this.e,this.a,h);f=kS.Ik(this.e,this.a,h);if(e==this.g){kS.pi(this.e,f)==26&&(this.j=-1);continue}if(kS.Vi(this.e,f,this.a)){this.i&&(a.s[d]|=IT);this.i=true}if(g==b[e]){this.d=e;this.f=true;this.c=kS.vl(this.e,f);continue}else if(g<b[e]){g=b[e];this.d=this.b;this.b=e}else{this.d=e}}};nH(48,1,{},kS.Yg);_.a=0;_.b=0;_.c=false;_.d=0;_.f=false;_.g=0;_.i=false;_.j=0;fS.gE=YI(48);kS.dh=function dh(){kS.dh=pH;kS.Zg=WC(IC(fS.MF,1),LT,2,6,['?','H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Cl','Ar','K','Ca','Sc','Ti','V','Cr','Mn','Fe','Co','Ni','Cu','Zn','Ga','Ge','As','Se','Br','Kr','Rb','Sr','Y','Zr','Nb','Mo','Tc','Ru','Rh','Pd','Ag','Cd','In','Sn','Sb','Te','I','Xe','Cs','Ba','La','Ce','Pr','Nd','Pm','Sm','Eu','Gd','Tb','Dy','Ho','Er','Tm','Yb','Lu','Hf','Ta','W','Re','Os','Ir','Pt','Au','Hg','Tl','Pb','Bi','Po','At','Rn','Fr','Ra','Ac','Th','Pa','U','Np','Pu','Am','Cm','Bk','Cf','Es','Fm','Md','No','Lr',MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,'R4','R5','R6','R7','R8','R9','R10','R11','R12','R13','R14','R15','R16','R1','R2','R3','A','A1','A2','A3',MT,MT,'D','T','X','R','H2','H+','Nnn','HYD','Pol',MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,'Ala','Arg','Asn','Asp','Cys','Gln','Glu','Gly','His','Ile','Leu','Lys','Met','Phe','Pro','Ser','Thr','Trp','Tyr','Val']);kS.ah=WC(IC(fS.BG,1),FT,5,15,[0,1,4,7,9,11,12,14,16,19,20,23,24,27,28,31,32,35,40,39,40,45,48,51,52,55,56,59,58,63,64,69,74,75,80,79,84,85,88,89,90,93,98,0,102,103,106,107,114,115,120,121,130,127,132,133,138,139,140,141,142,0,152,153,158,159,164,165,166,169,174,175,180,181,184,187,192,193,195,197,202,205,208,209,0,0,0,0,0,0,232,0,238,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,71,156,114,115,103,128,129,57,137,113,113,128,131,147,97,87,101,186,163,99]);kS.$g=WC(IC(fS.KD,2),NT,8,0,[null,WC(IC(fS.KD,1),HT,5,15,[1]),WC(IC(fS.KD,1),HT,5,15,[0]),WC(IC(fS.KD,1),HT,5,15,[1]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[4]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[1]),WC(IC(fS.KD,1),HT,5,15,[0]),WC(IC(fS.KD,1),HT,5,15,[1]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[4]),WC(IC(fS.KD,1),HT,5,15,[3,5]),WC(IC(fS.KD,1),HT,5,15,[2,4,6]),WC(IC(fS.KD,1),HT,5,15,[1,3,5,7]),WC(IC(fS.KD,1),HT,5,15,[0]),WC(IC(fS.KD,1),HT,5,15,[1]),WC(IC(fS.KD,1),HT,5,15,[2]),null,null,null,null,null,null,null,null,null,null,WC(IC(fS.KD,1),HT,5,15,[2,3]),WC(IC(fS.KD,1),HT,5,15,[2,4]),WC(IC(fS.KD,1),HT,5,15,[3,5]),WC(IC(fS.KD,1),HT,5,15,[2,4,6]),WC(IC(fS.KD,1),HT,5,15,[1,3,5,7]),WC(IC(fS.KD,1),HT,5,15,[0,2]),WC(IC(fS.KD,1),HT,5,15,[1,2,3,4]),WC(IC(fS.KD,1),HT,5,15,[2]),null,null,null,null,null,null,null,null,null,null,WC(IC(fS.KD,1),HT,5,15,[1,2,3]),WC(IC(fS.KD,1),HT,5,15,[2,4]),WC(IC(fS.KD,1),HT,5,15,[3,5]),WC(IC(fS.KD,1),HT,5,15,[2,4,6]),WC(IC(fS.KD,1),HT,5,15,[1,3,5,7]),WC(IC(fS.KD,1),HT,5,15,[0,2,4,6]),WC(IC(fS.KD,1),HT,5,15,[1]),WC(IC(fS.KD,1),HT,5,15,[2]),null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[2])]);kS._g=WC(IC(fS.KD,2),NT,8,0,[null,WC(IC(fS.KD,1),HT,5,15,[1]),null,WC(IC(fS.KD,1),HT,5,15,[1]),WC(IC(fS.KD,1),HT,5,15,[2]),null,null,WC(IC(fS.KD,1),HT,5,15,[-3]),WC(IC(fS.KD,1),HT,5,15,[-2]),WC(IC(fS.KD,1),HT,5,15,[-1]),null,WC(IC(fS.KD,1),HT,5,15,[1]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[3]),null,WC(IC(fS.KD,1),HT,5,15,[-3]),WC(IC(fS.KD,1),HT,5,15,[-2]),WC(IC(fS.KD,1),HT,5,15,[-1]),null,WC(IC(fS.KD,1),HT,5,15,[1]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[2,3,4]),WC(IC(fS.KD,1),HT,5,15,[2,3,4,5]),WC(IC(fS.KD,1),HT,5,15,[2,3,6]),WC(IC(fS.KD,1),HT,5,15,[2,3,4,7]),WC(IC(fS.KD,1),HT,5,15,[2,3]),WC(IC(fS.KD,1),HT,5,15,[2,3]),WC(IC(fS.KD,1),HT,5,15,[2,3]),WC(IC(fS.KD,1),HT,5,15,[1,2]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[2,4]),WC(IC(fS.KD,1),HT,5,15,[-3,3,5]),WC(IC(fS.KD,1),HT,5,15,[-2]),WC(IC(fS.KD,1),HT,5,15,[-1]),null,WC(IC(fS.KD,1),HT,5,15,[1]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[4]),WC(IC(fS.KD,1),HT,5,15,[3,5]),WC(IC(fS.KD,1),HT,5,15,[6]),WC(IC(fS.KD,1),HT,5,15,[4,6,7]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[2,4]),WC(IC(fS.KD,1),HT,5,15,[1]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[2,4]),WC(IC(fS.KD,1),HT,5,15,[-3,3,5]),WC(IC(fS.KD,1),HT,5,15,[-2,4,6]),WC(IC(fS.KD,1),HT,5,15,[-1]),null,WC(IC(fS.KD,1),HT,5,15,[1]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[3,4]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[2,3]),WC(IC(fS.KD,1),HT,5,15,[2,3]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[2,3]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[4]),WC(IC(fS.KD,1),HT,5,15,[5]),WC(IC(fS.KD,1),HT,5,15,[6]),WC(IC(fS.KD,1),HT,5,15,[4,6,7]),WC(IC(fS.KD,1),HT,5,15,[3,4]),WC(IC(fS.KD,1),HT,5,15,[3,4]),WC(IC(fS.KD,1),HT,5,15,[2,4]),WC(IC(fS.KD,1),HT,5,15,[1,3]),WC(IC(fS.KD,1),HT,5,15,[1,2]),WC(IC(fS.KD,1),HT,5,15,[1,3]),WC(IC(fS.KD,1),HT,5,15,[2,4]),WC(IC(fS.KD,1),HT,5,15,[3,5]),WC(IC(fS.KD,1),HT,5,15,[-2,2,4]),WC(IC(fS.KD,1),HT,5,15,[-1,1]),null,WC(IC(fS.KD,1),HT,5,15,[1]),WC(IC(fS.KD,1),HT,5,15,[2]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[4]),WC(IC(fS.KD,1),HT,5,15,[4,5]),WC(IC(fS.KD,1),HT,5,15,[3,4,5,6]),WC(IC(fS.KD,1),HT,5,15,[3,4,5,6]),WC(IC(fS.KD,1),HT,5,15,[3,4,5,6]),WC(IC(fS.KD,1),HT,5,15,[3,4,5,6]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[3,4]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[3]),WC(IC(fS.KD,1),HT,5,15,[2,3]),WC(IC(fS.KD,1),HT,5,15,[2,3]),WC(IC(fS.KD,1),HT,5,15,[3])])};kS.eh=function eh(a,b,c,d){var e;e=kS.fh(a,6);kS.Gg(a.H[e],b,c,d);return e};kS.fh=function fh(a,b){a.o>=a.K&&kS.Rj(a,a.K*2);a.A[a.o]=0;kS.Dj(a,a.o,b);a.q[a.o]=0;a.s[a.o]=0;a.w[a.o]=0;a.u[a.o]=0;kS.Gg(a.H[a.o],0,0,0);a.t!=null&&(a.t[a.o]=null);a.r!=null&&(a.r[a.o]=null);a.Q=0;return a.o++};kS.gh=function gh(a,b,c){var d,e;return kS.hh(a,b,c,(e=a.A[b],e>=3&&e<=4||e>=11&&e<=13||e>=19&&e<=31||e>=37&&e<=51||e>=55&&e<=84||e>=87&&e<=103||(d=a.A[c],d>=3&&d<=4||d>=11&&d<=13||d>=19&&d<=31||d>=37&&d<=51||d>=55&&d<=84||d>=87&&d<=103)?32:1))};kS.hh=function hh(a,b,c,d){var e;if(b==c)return -1;for(e=0;e<a.p;e++){if(a.B[0][e]==b&&a.B[1][e]==c||a.B[0][e]==c&&a.B[1][e]==b){a.F[e]<d&&(a.F[e]=d);return e}}a.p>=a.L&&kS.Sj(a,a.L*2);a.B[0][a.p]=b;a.B[1][a.p]=c;a.F[a.p]=d;a.C[a.p]=0;a.D[a.p]=0;a.Q=0;return a.p++};kS.ih=function ih(a,b){var c,d,e,f,g;a.I=a.I|b.I;d=OC(fS.OD,YS,5,b.o,15,1);f=kS.ej(a,1);g=kS.ej(a,2);for(c=0;c<b.o;c++){d[c]=kS.uh(b,a,c,f,g)}for(e=0;e<b.p;e++){kS.vh(b,a,e,f,g,d[b.B[0][e]],d[b.B[1][e]],false)}a.J=a.J&&b.J;a.G=0;a.Q=0;return d};kS.jh=function jh(a,b,c,d,e,f,g){var h;h=kS.Hh(a,b,c);if(h==-1){a.o>=a.K&&kS.Rj(a,a.K*2);h=kS.fh(a,d);kS.Gg(a.H[h],b,c,0);a.v[h]=e;kS.ij(a,h,f);kS.xj(a,h,g);return true}return kS.qh(a,h,d,e,f,g)};kS.kh=function kh(a,b,c,d){var e;for(e=0;e<a.p;e++){if(a.B[0][e]==b&&a.B[1][e]==c||a.B[0][e]==c&&a.B[1][e]==b){kS.sh(a,e,d);a.Q=0;return e}}a.p>=a.L&&kS.Sj(a,a.L*2);a.B[0][a.p]=b;a.B[1][a.p]=c;a.F[a.p]=d;a.C[a.p]=0;a.D[a.p]=0;a.Q=0;return a.p++};kS.lh=function lh(a,b,c,d,e){var f,g,h;while(a.o+d>a.K)kS.Rj(a,a.K*2);while(a.p+d>a.L)kS.Sj(a,a.L*2);f=kS.Hh(a,b,c);if(f!=-1)return kS.mh(a,f,d,e);g=kS.Ih(a,b,c);if(g!=-1)return kS.nh(a,g,d,e);f=kS.eh(a,b,c,0);h=fT*(d-2)/d;kS.Yi(a,f,d,f,e,0,fT-h);a.Q=0;return true};kS.mh=function mh(a,b,c,d){var e,f,g,h,i,j;if(d&&kS.Yk(a,b)>1||!d&&kS.Yk(a,b)>2)return false;f=0;e=OC(fS.MD,_S,5,4,15,1);for(h=0;h<a.p;h++){for(i=0;i<2;i++){if(a.B[i][h]==b){if(f==2){f=3;break}e[f++]=kS.di(a,b,a.B[1-i][h])}}if(f==3)break}if(f==3)return false;j=f==1?e[0]+fT:$wnd.Math.abs(e[0]-e[1])>fT?(e[0]+e[1])/2:(e[0]+e[1])/2+fT;g=fT*(c-2)/c;kS.Yi(a,b,c,b,d,j-g/2,fT-g);a.Q=0;return true};kS.nh=function nh(a,b,c,d){var e,f,g,h,i,j,k,l,m,n,o;i=OC(fS.OD,YS,5,2,15,1);h=OC(fS.MD,_S,5,2,15,1);i[0]=a.B[0][b];i[1]=a.B[1][b];if(kS.Yk(a,i[0])>3)return false;if(kS.Yk(a,i[1])>3)return false;f=0;e=OC(fS.MD,_S,5,4,15,1);for(l=0;l<a.p;l++){if(l==b)continue;for(m=0;m<2;m++){for(n=0;n<2;n++){if(a.B[m][l]===i[n]){if(f==4){f=5;break}e[f++]=kS.di(a,i[n],a.B[1-m][l])}}if(f==5)break}if(f==5)break}if(f==5)return false;h[0]=kS.di(a,i[0],i[1]);if(h[0]<0){h[1]=h[0]+fT;g=0}else{h[1]=h[0];h[0]=h[1]-fT;g=1}o=0;for(k=0;k<f;k++){e[k]>h[0]&&e[k]<h[1]?--o:++o}g=o>0?1-g:g;j=fT*(c-2)/c;kS.Yi(a,i[g],c-1,i[1-g],d,h[o>0?0:1]+fT-j,fT-j);a.Q=0;return true};kS.oh=function oh(a,b,c){var d,e,f,g,h;e=OC(fS.OD,YS,5,b.o,15,1);g=kS.ej(a,1);h=kS.ej(a,2);for(d=0;d<b.o;d++){b.A[d]!=0?(e[d]=kS.uh(b,a,d,g,h)):(e[d]=c)}for(f=0;f<b.p;f++){kS.vh(b,a,f,g,h,e[b.B[0][f]],e[b.B[1][f]],false)}a.J=a.J&&b.J;a.G=0;a.Q=0;return e};kS.ph=function ph(a,b){var c,d,e,f,g,h,i,j,k;c=a.H[b[0]];d=a.H[b[1]];e=a.H[b[2]];f=a.H[b[3]];i=new kS.Jg(d.a-c.a,d.b-c.b,d.c-c.c);j=new kS.Jg(e.a-d.a,e.b-d.b,e.c-d.c);k=new kS.Jg(f.a-e.a,f.b-e.b,f.c-e.c);g=new kS.Jg(i.b*j.c-i.c*j.b,-(i.a*j.c-i.c*j.a),i.a*j.b-i.b*j.a);h=new kS.Jg(j.b*k.c-j.c*k.b,-(j.a*k.c-j.c*k.a),j.a*k.b-j.b*k.a);return -$wnd.Math.atan2($wnd.Math.sqrt(j.a*j.a+j.b*j.b+j.c*j.c)*(i.a*h.a+i.b*h.b+i.c*h.c),g.a*h.a+g.b*h.b+g.c*h.c)};kS.qh=function qh(a,b,c,d,e,f){if((c==1||c==151||c==152)&&kS.Yk(a,b)>1)return false;a.w[b]&=-2;a.t!=null&&(a.t[b]=null);a.r!=null&&(a.r[b]=null);if(c==a.A[b]&&d==a.v[b]&&e==((a.s[b]&OT)>>>28)-1&&f==(a.s[b]&48))return false;if(c==151||c==152){d=c-149;c=1}a.s[b]&=960;a.A[b]=c;a.v[b]=d;a.q[b]=0;a.w[b]=0;kS.ij(a,b,e);kS.xj(a,b,f);kS.cj(a,a.u[b]);a.Q=0;return true};kS.rh=function rh(a,b,c){if(c){if(a.q[b]>8)return false;++a.q[b]}else{if(a.q[b]<-8)return false;--a.q[b]}a.Q=0;return true};kS.sh=function sh(a,b,c){var d,e,f,g,h;f=false;g=a.F[b];if(c==127){f=kS.xi(a,b)}else if(kS.Ol(a,b,c)){if(c==17||c==9){d=kS.Zi(a,b,a.B[0][b]);e=kS.Zi(a,b,a.B[1][b]);if(c==g){if(d==e||e){h=a.B[0][b];a.B[0][b]=a.B[1][b];a.B[1][b]=h;f=true}}else{if(!d&&e){h=a.B[0][b];a.B[0][b]=a.B[1][b];a.B[1][b]=h}a.F[b]=c;f=true}}else{a.F[b]=c;f=true}}if(f){a.Q=(g&103)==(c&103)?a.Q&3:0;a.D[b]=0}return f};kS.th=function th(a){var b,c,d,e,f,g,h,i;for(g=0;g<a.p;g++){if(a.F[g]==128){c=a.B[0][g];d=a.B[1][g];if(a.A[c]==-1^a.A[d]==-1){if(a.q[c]!=0&&a.q[d]!=0){if(a.q[c]<0^a.q[d]<0){if(a.q[c]<0){++a.q[c];--a.q[d]}else{--a.q[c];++a.q[d]}}}}}}i=OC(fS.OD,YS,5,a.o,15,1);e=0;for(b=0;b<a.o;b++){if(a.A[b]==-1){i[b]=-1;continue}if(e<b){a.A[e]=a.A[b];a.q[e]=a.q[b];a.v[e]=a.v[b];a.s[e]=a.s[b];a.w[e]=a.w[b];a.u[e]=a.u[b];kS.Hg(a.H[e],a.H[b]);a.t!=null&&(a.t[e]=a.t[b]);a.r!=null&&(a.r[e]=a.r[b])}i[b]=e;++e}a.o=e;h=0;for(f=0;f<a.p;f++){if(a.F[f]==128)continue;a.F[h]=a.F[f];a.C[h]=a.C[f];a.D[h]=a.D[f];a.B[0][h]=i[a.B[0][f]];a.B[1][h]=i[a.B[1][f]];++h}a.p=h;return i};kS.uh=function uh(a,b,c,d,e){var f,g,h,i;f=b.o;f>=b.K&&kS.Rj(b,b.K*2);h=(a.s[c]&xT)>>19;g=-1;h==1?d==-1?(g=kS.ej(b,1)):(g=gS.bK(32,d+((a.s[c]&xT)>>19!=1&&(a.s[c]&xT)>>19!=2?-1:(a.s[c]&PT)>>21))):h==2&&(e==-1?(g=kS.ej(b,2)):(g=gS.bK(32,e+((a.s[c]&xT)>>19!=1&&(a.s[c]&xT)>>19!=2?-1:(a.s[c]&PT)>>21))));b.A[f]=a.A[c];b.q[f]=a.q[c];b.v[f]=a.v[c];b.s[f]=a.s[c];b.w[f]=b.I?a.w[c]:0;kS.Hg(b.H[f],a.H[c]);b.u[f]=a.u[c];b.t!=null&&(b.t[f]=null);if(a.t!=null&&a.t[c]!=null&&b.I){b.t==null&&(b.t=OC(fS.OD,DT,6,b.A.length,0,2));b.t[f]=OC(fS.OD,YS,5,a.t[c].length,15,1);for(i=0;i<a.t[c].length;i++)b.t[f][i]=a.t[c][i]}b.r!=null&&(b.r[f]=null);if(a.r!=null&&a.r[c]!=null){b.r==null&&(b.r=OC(fS.KD,NT,8,b.A.length,0,2));b.r[f]=OC(fS.KD,HT,5,a.r[c].length,15,1);for(i=0;i<a.r[c].length;i++)b.r[f][i]=a.r[c][i]}if(g!=-1){b.s[f]&=-65011713;b.s[f]|=g<<21}++b.o;b.Q=0;return f};
kS.vh=function vh(a,b,c,d,e,f,g,h){var i,j,k,l;j=b.p;j>=b.L&&kS.Sj(b,b.L*2);l=(a.C[c]&QT)>>10;k=-1;l==1&&(d==-1?(k=kS.ej(b,1)):(k=gS.bK(32,d+((a.C[c]&QT)>>10!=1&&(a.C[c]&QT)>>10!=2?-1:(a.C[c]&RT)>>12))));l==2&&(e==-1?(k=kS.ej(b,2)):(k=gS.bK(32,e+((a.C[c]&QT)>>10!=1&&(a.C[c]&QT)>>10!=2?-1:(a.C[c]&RT)>>12))));b.B[0][j]=f;b.B[1][j]=g;i=h&&(a.C[c]&512)!=0?64:a.F[c];b.F[j]=i;b.C[j]=a.C[c];b.D[j]=b.I?a.D[c]:0;if(k!=-1){b.C[j]&=-126977;b.C[j]|=k<<12}++b.p;b.Q=0;return j};kS.wh=function wh(a,b,c,d,e,f,g){return kS.vh(a,b,c,d,e,f==null?a.B[0][c]:f[a.B[0][c]],f==null?a.B[1][c]:f[a.B[1][c]],g)};kS.xh=function xh(a,b){var c,d;b.t=null;b.r=null;b.I=a.I;b.o=0;for(c=0;c<a.o;c++)kS.uh(a,b,c,0,0);b.p=0;for(d=0;d<a.p;d++)kS.vh(a,b,d,0,0,a.B[0][d],a.B[1][d],false);kS.yh(a,b);!!a.b&&(b.Q=0)};kS.yh=function yh(a,b){b.I=a.I;b.J=a.J;b.P=a.P;b.G=a.G;b.M=a.M==null?null:jS.ER(a.M);b.Q=a.Q&12};kS.zh=function zh(a,b){var c,d,e,f;for(c=0;c<a.p;c++){for(e=0;e<2;e++){if(a.B[e][c]==b){a.F[c]=128;d=0;for(f=0;f<a.p;f++){if(f==c)continue;(a.B[0][f]===a.B[1-e][c]||a.B[1][f]===a.B[1-e][c])&&++d}if(d==0){kS.cj(a,a.u[a.B[1-e][c]]);a.A[a.B[1-e][c]]=-1}}}}kS.cj(a,a.u[b]);a.A[b]=-1;a.t!=null&&(a.t[b]=null);a.r!=null&&(a.r[b]=null);kS.th(a);a.Q=0};kS.Ah=function Ah(a,b,c){var d,e;d=kS.Hh(a,b,c);if(d!=-1){(a.s[d]&512)!=0?kS.Gh(a):kS.zh(a,d);a.Q=0;return true}e=kS.Ih(a,b,c);if(e!=-1){(a.s[a.B[0][e]]&a.s[a.B[1][e]]&512)!=0?kS.Gh(a):kS.Dh(a,e);a.Q=0;return true}return false};kS.Bh=function Bh(a,b){var c;if(b.length==0)return null;for(c=0;c<b.length;c++)kS.Wi(a,b[c]);return kS.Eh(a)};kS.Ch=function Ch(a,b){a.F[b]=128;kS.th(a);a.Q=0};kS.Dh=function Dh(a,b){var c,d,e;for(d=0;d<2;d++){c=0;for(e=0;e<a.p;e++){if(e==b)continue;(a.B[0][e]===a.B[d][b]||a.B[1][e]===a.B[d][b])&&++c}if(c==0){kS.cj(a,a.u[a.B[d][b]]);a.A[a.B[d][b]]=-1}}a.F[b]=128;kS.th(a);a.Q=0};kS.Eh=function Eh(a){var b,c,d;d=false;for(b=0;b<a.o;b++){if(a.A[b]==-1){d=true;kS.cj(a,a.u[b])}}for(c=0;c<a.p;c++){if(a.F[c]==128){d=true}else if(a.A[a.B[0][c]]==-1||a.A[a.B[1][c]]==-1){a.F[c]=128;d=true}}if(d){a.Q=0;return kS.th(a)}return null};kS.Fh=function Fh(a){a.o=0;a.p=0;a.I=false;a.J=false;a.G=0;a.t=null;a.r=null;a.M=null;a.Q=0};kS.Gh=function Gh(a){var b,c;c=false;for(b=0;b<a.o;b++){if((a.s[b]&512)!=0){a.A[b]=-1;c=true}}return c&&kS.Eh(a)!=null};kS.Hh=function Hh(a,b,c){var d,e,f,g,h,i,j,k;g=-1;e=kS.ci(a,a.o,a.p,kS.bh);h=ST;i=e*e/12;for(d=0;d<a.o;d++){j=a.H[d].a;k=a.H[d].b;f=(b-j)*(b-j)+(c-k)*(c-k);if(f<i&&f<h){h=f;g=d}}return g};kS.Ih=function Ih(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s;m=-1;o=kS.ci(a,a.o,a.p,kS.bh);n=ST;for(d=0;d<a.p;d++){p=a.H[a.B[0][d]].a;r=a.H[a.B[0][d]].b;q=a.H[a.B[1][d]].a;s=a.H[a.B[1][d]].b;k=q-p;l=s-r;e=$wnd.Math.sqrt(k*k+l*l);f=(p+q)/2;g=(r+s)/2;k=b-f;l=c-g;if($wnd.Math.sqrt(k*k+l*l)>e/2)continue;if(q==p)j=$wnd.Math.abs(p-b);else{h=(s-r)/(p-q);i=-h*p-r;j=$wnd.Math.abs((h*b+c+i)/$wnd.Math.sqrt(h*h+1))}if(j<o&&j<n){n=j;m=d}}return m};kS.Jh=function Jh(a,b){return ((a.s[b]&OT)>>>28)-1};kS.Kh=function Kh(a,b){return (a.s[b]&98304)>>15};kS.Lh=function Lh(a,b){return a.q[b]};kS.Mh=function Mh(a,b){return a.s[b]&448};kS.Nh=function Nh(a,b){return a.r==null?null:a.r[b]==null?null:gS.rK(a.r[b])};kS.Oh=function Oh(a,b){return a.r==null?null:a.r[b]};kS.Ph=function Ph(a,b){return (a.s[b]&xT)>>19!=1&&(a.s[b]&xT)>>19!=2?-1:(a.s[b]&PT)>>21};kS.Qh=function Qh(a,b){return (a.s[b]&xT)>>19};kS.Rh=function Rh(a,b){return kS.Zg[a.A[b]]};kS.Sh=function Sh(a,b){return a.t==null?null:a.t[b]};kS.Th=function Th(a,b){var c,d,e;if(a.t==null||a.t[b]==null)return (a.w[b]&1)!=0?'':kS.Zg[a.A[b]];e='';for(d=0;d<a.t[b].length;d++){d>0&&(e=(jS.yR(e),e+(jS.yR(','),',')));c=a.t[b][d];e=gS.qK(e,kS.Zg[c])}return e};kS.Uh=function Uh(a,b){return gS._J(a.u[b])};kS.Vh=function Vh(a,b){return a.v[b]};kS.Wh=function Wh(a,b){return a.s[b]&3};kS.Xh=function Xh(a,b){return a.w[b]};kS.Yh=function Yh(a,b){return a.s[b]&48};kS.Zh=function Zh(a,b){return a.H[b].a};kS.$h=function $h(a,b){return a.H[b].b};kS._h=function _h(a,b){return a.H[b].c};kS.ai=function ai(a,b){return a.A[b]};kS.bi=function bi(a){return kS.ci(a,a.o,a.p,kS.bh)};kS.ci=function ci(a,b,c,d){var e,f,g,h,i,j,k,l,m,n;k=false;l=0;for(i=0;i<c;i++)a.F[i]!=32&&(a.D[i]&wT)==0&&++l;if(l==0){for(j=0;j<c;j++)(a.D[j]&wT)==0&&++l;k=true}if(l==0){if(b<2)return d;n=ST;for(e=1;e<b;e++){for(f=0;f<e;f++){m=kS.Fg(a.H[e],a.H[f]);m>0&&m<n&&(n=m)}}return n!=ST?0.6*n:d}g=0;for(h=0;h<c;h++){(k||a.F[h]!=32)&&(a.D[h]&wT)==0&&(g+=kS.Fg(a.H[a.B[1][h]],a.H[a.B[0][h]]))}return g/l};kS.di=function di(a,b,c){return kS.ck(a.H[b].a,a.H[b].b,a.H[c].a,a.H[c].b)};kS.ei=function ei(a,b,c){return a.B[b][c]};kS.fi=function fi(a,b){return ((a.D[b]&jT)>>7)+((a.D[b]&30720)>>11)};kS.gi=function gi(a,b){return (a.D[b]&jT)>>7};kS.hi=function hi(a,b){return (a.C[b]&48)>>4};kS.ii=function ii(a,b){return (a.C[b]&QT)>>10!=1&&(a.C[b]&QT)>>10!=2?-1:(a.C[b]&RT)>>12};kS.ji=function ji(a,b){return (a.C[b]&QT)>>10};kS.ki=function ki(a,b){var c,d,e,f;c=a.B[0][b];d=a.B[1][b];e=a.H[d].a-a.H[c].a;f=a.H[d].b-a.H[c].b;return $wnd.Math.sqrt(e*e+f*f)};kS.li=function li(a,b,c){var d;for(d=0;d<a.p;d++)if(a.B[0][d]==b&&a.B[1][d]==c||a.B[0][d]==c&&a.B[1][d]==b)if(a.F[d]!=128)return d;return -1};kS.mi=function mi(a,b){switch(a.F[b]&103){case 1:case 64:return 1;case 2:return 2;case 4:return 3;default:return 0;}};kS.ni=function ni(a,b){return a.C[b]&3};kS.oi=function oi(a,b){return a.D[b]};kS.pi=function pi(a,b){return a.F[b]};kS.qi=function qi(a,b){return a.F[b]&103};kS.ri=function ri(a,b){var c;c=a.A[b]<kS.$g.length?kS.$g[a.A[b]]:null;return c==null?6:c[c.length-1]};kS.si=function si(a,b,c){var d,e;if(a.A[b]>=171&&a.A[b]<=190)return 0;e=0;(a.s[b]&48)==32&&(e-=1);((a.s[b]&48)==16||(a.s[b]&48)==48)&&(e-=2);d=a.q[b];if(d==0&&a.I){(a.w[b]&lT)==nT&&(d=-1);(a.w[b]&lT)==mT&&(d=1)}a.A[b]==7||a.A[b]==8||a.A[b]==9?(e+=d):a.A[b]==6||a.A[b]==14||a.A[b]==32?(e-=d<0?-d:d):a.A[b]==15||a.A[b]==33?c-e-d<=3?(e+=d):(e-=d):a.A[b]==16||a.A[b]==34||a.A[b]==52?c-e-d<=4?(e+=d):(e-=d<0?-d:d):a.A[b]==17||a.A[b]==35||a.A[b]==53?c-e-d<=5?(e+=d):(e-=d<0?-d:d):(e-=d);return e};kS.ti=function ti(a,b){var c;c=kS.ui(a,b);return c+kS.si(a,b,c)};kS.ui=function ui(a,b){var c,d;c=((a.s[b]&OT)>>>28)-1;c==-1&&(c=(d=a.A[b]<kS.$g.length?kS.$g[a.A[b]]:null,d==null?6:d[d.length-1]));return c};kS.vi=function vi(a,b){var c,d,e,f,g;f=3;for(d=0;d<2;d++){c=a.B[d][b];e=kS.mi(a,b)+(g=kS.ui(a,c),g+kS.si(a,c,g))-kS.Yk(a,c);f>e&&(f=e)}return f};kS.wi=function wi(a,b){return (a.s[b]&IT)!=0};kS.xi=function xi(a,b){var c,d,e;d=kS.vi(a,b);c=kS.Oi(a,a.B[0][b])||kS.Oi(a,a.B[1][b]);e=c?32:1;if(a.F[b]==4){a.F[b]=e;a.Q=0;return true}if(a.F[b]==2){a.F[b]=26;a.Q&=3;if((a.C[b]&128)==0)return true}if(a.F[b]==26){d==3?(a.F[b]=4):(a.F[b]=e);a.Q=0;return true}if((24&a.F[b])!=0){a.F[b]=1;a.Q&=3;return true}if(!c&&d<2)return false;if(a.F[b]==1){a.F[b]=2;a.Q=0;return true}if(d<1)return false;if(a.F[b]==32){a.F[b]=1;a.Q=0;return true}return false};kS.yi=function yi(a){var b;a.Q=0;a.A=OC(fS.OD,YS,5,a.K,15,1);a.q=OC(fS.OD,YS,5,a.K,15,1);a.u=OC(fS.OD,YS,5,a.K,15,1);a.H=OC(fS.dE,{183:1,4:1,10:1,18:1,7:1},35,a.K,0,1);for(b=0;b<a.K;b++)a.H[b]=new kS.Ig;a.v=OC(fS.OD,YS,5,a.K,15,1);a.s=OC(fS.OD,YS,5,a.K,15,1);a.w=OC(fS.OD,YS,5,a.K,15,1);a.t=null;a.r=null;a.B=MC(fS.OD,[DT,YS],[6,5],15,[2,a.L],2);a.F=OC(fS.OD,YS,5,a.L,15,1);a.C=OC(fS.OD,YS,5,a.L,15,1);a.D=OC(fS.OD,YS,5,a.L,15,1)};kS.zi=function zi(a,b){a.Q&=~b};kS.Ai=function Ai(a,b){return (a.s[b]&TT)!=0};kS.Bi=function Bi(a,b){return a.A[b]==-1};kS.Ci=function Ci(a,b){return (a.s[b]&4)!=0};kS.Di=function Di(a,b){return (a.s[b]&UT)!=0};kS.Ei=function Ei(a,b){return a.u[b]<0};kS.Fi=function Fi(a,b){return (a.C[b]&IT)!=0};kS.Gi=function Gi(a,b){return (a.D[b]&wT)!=0};kS.Hi=function Hi(a,b){return (a.C[b]&CT)!=0};kS.Ii=function Ii(a,b){return a.F[b]==128};kS.Ji=function Ji(a,b){return (a.C[b]&4)!=0};kS.Ki=function Ki(a,b){return (a.C[b]&VT)!=0};kS.Li=function Li(a,b){return kS.fk(a.A[b])};kS.Mi=function Mi(a,b){return kS.gk(a.A[b])};kS.Ni=function Ni(a,b){return (a.s[b]&CT)!=0};kS.Oi=function Oi(a,b){var c;c=a.A[b];return c>=3&&c<=4||c>=11&&c<=13||c>=19&&c<=31||c>=37&&c<=51||c>=55&&c<=84||c>=87&&c<=103};kS.Pi=function Pi(a,b){return a.v[b]==0};kS.Qi=function Qi(a,b){var c;c=a.A[b];return c==1||c>=5&&c<=9||c>=14&&c<=17||c>=32&&c<=35||c>=52&&c<=53};kS.Ri=function Ri(a){var b;for(b=0;b<a.o;b++){switch(a.A[b]){case 1:case 5:case 6:case 7:case 8:case 9:case 14:case 15:case 16:case 17:case 33:case 34:case 35:case 52:case 53:continue;default:return false;}}return true};kS.Si=function Si(a,b){return (a.s[b]&512)!=0};kS.Ti=function Ti(a,b){return (a.s[a.B[0][b]]&a.s[a.B[1][b]]&512)!=0};kS.Ui=function Ui(a,b){return a.F[b]==17||a.F[b]==9};kS.Vi=function Vi(a,b,c){return (a.F[b]==17||a.F[b]==9)&&a.B[0][b]==c};kS.Wi=function Wi(a,b){a.A[b]=-1};kS.Xi=function Xi(a,b){a.F[b]=128};kS.Yi=function Yi(a,b,c,d,e,f,g){var h,i,j,k,l,m,n,o,p,q,r,s,t,u,v;if(b==d){n=kS.ci(a,a.o,a.p,kS.bh)}else{u=a.H[b].a-a.H[d].a;v=a.H[b].b-a.H[d].b;n=$wnd.Math.sqrt(u*u+v*v)}h=b;o=kS.Vj(a,b)!=3;for(t=1;t<c;t++){q=a.H[h].a+n*$wnd.Math.sin(f);r=a.H[h].b+n*$wnd.Math.cos(f);s=-1;for(p=0;p<a.o;p++){if($wnd.Math.abs(q-a.H[p].a)<4&&$wnd.Math.abs(r-a.H[p].b)<4){s=p;break}}if(s==-1){s=kS.eh(a,q,r,0);a.H[s].a=q;a.H[s].b=r;a.H[s].c=0}m=kS.li(a,h,s);if(m==-1){m=kS.hh(a,h,s,(j=a.A[h],j>=3&&j<=4||j>=11&&j<=13||j>=19&&j<=31||j>=37&&j<=51||j>=55&&j<=84||j>=87&&j<=103||(k=a.A[s],k>=3&&k<=4||k>=11&&k<=13||k>=19&&k<=31||k>=37&&k<=51||k>=55&&k<=84||k>=87&&k<=103)?32:1));if(e){o&&kS.Vj(a,a.B[0][m])<4&&kS.Vj(a,a.B[1][m])<3&&(a.F[m]=2);o=!o}}h=s;f+=g}m=kS.li(a,h,d);m==-1&&(m=kS.hh(a,h,d,(l=a.A[h],l>=3&&l<=4||l>=11&&l<=13||l>=19&&l<=31||l>=37&&l<=51||l>=55&&l<=84||l>=87&&l<=103||(i=a.A[d],i>=3&&i<=4||i>=11&&i<=13||i>=19&&i<=31||i>=37&&i<=51||i>=55&&i<=84||i>=87&&i<=103)?32:1)));e&&o&&kS.Vj(a,a.B[0][m])<4&&kS.Vj(a,a.B[1][m])<4&&(a.F[m]=2)};kS.Zi=function Zi(a,b,c){var d,e;if(kS.mi(a,b)!=1)return false;if((a.s[c]&3)!=0)return true;for(e=0;e<a.p;e++)if(e!=b&&a.F[e]==2&&(a.B[0][e]==c&&(a.s[a.B[1][e]]&3)!=0||a.B[1][e]==c&&(a.s[a.B[0][e]]&3)!=0))return true;for(d=0;d<a.p;d++)if(d!=b&&a.F[d]==1&&(a.B[0][d]==c||a.B[1][d]==c)&&(a.C[d]&3)!=0)return true;return false};kS.$i=function $i(a){var b;for(b=0;b<a.o;b++)a.s[b]&=-449};kS._i=function _i(a){var b;for(b=0;b<a.o;b++)a.s[b]&=-262145};kS.aj=function aj(a){var b;for(b=0;b<a.o;b++)a.s[b]&=-513};kS.bj=function bj(a){var b;for(b=0;b<a.p;b++)a.C[b]&=-393217};kS.cj=function cj(a,b){var c;for(c=0;c<a.o;c++)gS._J(a.u[c])==(b<0?-b:b)&&(a.u[c]=0)};kS.dj=function dj(a){var b,c,d;d=false;if(a.t!=null){a.t=null;d=true}for(b=0;b<a.o;b++){if(a.w[b]!=0){a.w[b]=0;d=true}}for(c=0;c<a.p;c++){if(a.D[c]!=0){a.D[c]=0;d=true}if(a.F[c]==64){a.F[c]=1;d=true}}d&&(a.Q=0);return d};kS.ej=function ej(a,b){var c,d,e,f,g,h,i,j,k;if(b==0)return 0;h=null;for(d=0;d<a.o;d++){if((a.s[d]&xT)>>19==b){h==null&&(h=OC(fS.CG,aT,5,32,16,1));h[(a.s[d]&xT)>>19!=1&&(a.s[d]&xT)>>19!=2?-1:(a.s[d]&PT)>>21]=true}}for(f=0;f<a.p;f++){if((a.C[f]&QT)>>10==b){h==null&&(h=OC(fS.CG,aT,5,32,16,1));h[(a.C[f]&QT)>>10!=1&&(a.C[f]&QT)>>10!=2?-1:(a.C[f]&RT)>>12]=true}}k=0;if(h!=null){j=OC(fS.OD,YS,5,32,15,1);for(i=0;i<32;i++)h[i]&&(j[i]=k++);for(c=0;c<a.o;c++){if((a.s[c]&xT)>>19==b){g=j[(a.s[c]&xT)>>19!=1&&(a.s[c]&xT)>>19!=2?-1:(a.s[c]&PT)>>21];a.s[c]&=-65011713;a.s[c]|=g<<21}}for(e=0;e<a.p;e++){if((a.C[e]&QT)>>10==b){g=j[(a.C[e]&QT)>>10!=1&&(a.C[e]&QT)>>10!=2?-1:(a.C[e]&RT)>>12];a.C[e]&=-126977;a.C[e]|=g<<12}}}return k};kS.fj=function fj(a,b){var c;for(c=0;c<a.o;c++){a.H[c].a*=b;a.H[c].b*=b}};kS.gj=function gj(a,b){a.o=b;a.Q=0};kS.hj=function hj(a,b){a.p=b;a.Q=0};kS.ij=function ij(a,b,c){if(c>=-1&&c<=14){a.s[b]&=268435455;a.s[b]|=1+c<<28;if(a.A[b]==6){if(c==-1||c==0||c==2||c==4){a.s[b]&=-49;c==2&&(a.s[b]|=16)}}}};kS.jj=function jj(a,b,c){a.s[b]&=-98305;a.s[b]|=c<<15};kS.kj=function kj(a,b,c){a.q[b]=c;a.Q=0};kS.lj=function lj(a,b,c){a.s[b]&=-449;a.s[b]|=c};kS.mj=function mj(a,b,c){c?(a.s[b]|=TT):(a.s[b]&=-67108865);a.Q&=3};kS.nj=function nj(a,b,c){var d,e;if(c!=null){if(gS.GK(c).length==0)c=null;else{d=kS.ek(c);if(d!=0&&gS.sK(c,kS.Zg[d])||gS.sK(c,'?')){kS.Dj(a,b,d);c=null}}}if(c==null){a.r!=null&&(a.r[b]=null)}else{a.r==null&&(a.r=OC(fS.KD,NT,8,a.K,0,2));a.r[b]=jS.rR((e=c,jS.mR(),e))}};kS.oj=function oj(a,b,c){c!=null&&c.length==0&&(c=null);if(c==null){a.r!=null&&(a.r[b]=null)}else{a.r==null&&(a.r=OC(fS.KD,NT,8,a.K,0,2));a.r[b]=c}};kS.pj=function pj(a,b,c,d){var e,f,g;if(c==0){a.s[b]&=WT;a.s[b]|=0}else{if(d>=32)return;if(d==-1){g=-1;for(f=0;f<a.o;f++)f!=b&&c==(a.s[f]&xT)>>19&&g<((a.s[f]&xT)>>19!=1&&(a.s[f]&xT)>>19!=2?-1:(a.s[f]&PT)>>21)&&(g=(a.s[f]&xT)>>19!=1&&(a.s[f]&xT)>>19!=2?-1:(a.s[f]&PT)>>21);for(e=0;e<a.p;e++)c==(a.C[e]&QT)>>10&&g<((a.C[e]&QT)>>10!=1&&(a.C[e]&QT)>>10!=2?-1:(a.C[e]&RT)>>12)&&(g=(a.C[e]&QT)>>10!=1&&(a.C[e]&QT)>>10!=2?-1:(a.C[e]&RT)>>12);d=g+1;if(d>=32)return}a.s[b]&=WT;a.s[b]|=c<<19|d<<21}a.Q&=3};kS.qj=function qj(a,b,c){a.t==null&&(a.t=OC(fS.OD,DT,6,a.K,0,2));AS.OO(c);a.t[b]=c;a.Q=0;a.I=true};kS.rj=function rj(a,b,c,d){var e;if(c==null){a.t!=null&&(a.t[b]=null);return}if(c.length==1&&!d){e=c[0];a.A[b]!=e&&kS.qh(a,b,e,0,-1,0);a.t!=null&&(a.t[b]=null);return}a.t==null&&(a.t=OC(fS.OD,DT,6,a.K,0,2));a.t[b]=c;d&&(a.w[b]|=1);a.Q=0;a.I=true};kS.sj=function sj(a,b,c,d){a.u[b]=d?-c:c};kS.tj=function tj(a,b,c){c?(a.s[b]|=CT):(a.s[b]&=-262145)};kS.uj=function uj(a,b,c){a.v[b]=c;a.Q&=3};kS.vj=function vj(a,b,c,d){a.s[b]&=-8;a.s[b]|=c;d&&(a.s[b]|=4)};kS.wj=function wj(a,b,c,d){d?(a.w[b]|=c):(a.w[b]&=~c);a.Q=0;a.I=true};kS.xj=function xj(a,b,c){a.s[b]&=-49;a.s[b]|=c;a.Q&=3};kS.yj=function yj(a,b,c){c?(a.s[b]|=512):(a.s[b]&=-513)};kS.zj=function zj(a,b,c){a.s[b]&=-134217729;c&&(a.s[b]|=UT)};kS.Aj=function Aj(a,b,c){a.H[b].a=c;a.Q&=3};kS.Bj=function Bj(a,b,c){a.H[b].b=c;a.Q&=3};kS.Cj=function Cj(a,b,c){a.H[b].c=c;a.Q&=3};kS.Dj=function Dj(a,b,c){if(c>=0&&c<=190){if(c==151||c==152){a.A[b]=1;a.v[b]=c-149}else{a.A[b]=c;a.v[b]=0}a.s[b]&=268435455;a.Q=0}};kS.Ej=function Ej(a,b,c,d){a.B[b][c]=d;a.Q=0};kS.Fj=function Fj(a,b,c){c?(a.C[b]|=IT):(a.C[b]&=-131073)};kS.Gj=function Gj(a,b,c){a.C[b]&=-49;a.C[b]|=c<<4};kS.Hj=function Hj(a,b,c,d){var e,f,g;if(c==0){a.C[b]&=-130049;a.C[b]|=0}else{if(d>=32)return;if(d==-1){g=-1;for(f=0;f<a.o;f++)c==(a.s[f]&xT)>>19&&g<((a.s[f]&xT)>>19!=1&&(a.s[f]&xT)>>19!=2?-1:(a.s[f]&PT)>>21)&&(g=(a.s[f]&xT)>>19!=1&&(a.s[f]&xT)>>19!=2?-1:(a.s[f]&PT)>>21);for(e=0;e<a.p;e++)e!=b&&c==(a.C[e]&QT)>>10&&g<((a.C[e]&QT)>>10!=1&&(a.C[e]&QT)>>10!=2?-1:(a.C[e]&RT)>>12)&&(g=(a.C[e]&QT)>>10!=1&&(a.C[e]&QT)>>10!=2?-1:(a.C[e]&RT)>>12);d=g+1;if(d>=32)return}a.C[b]&=-130049;a.C[b]|=c<<10|d<<12}a.Q&=3};kS.Ij=function Ij(a,b,c){c?(a.C[b]|=CT):(a.C[b]&=-262145)};kS.Jj=function Jj(a,b,c){a.F[b]=c==1?1:c==2?2:c==3?4:32;a.Q=0};kS.Kj=function Kj(a,b,c,d){a.C[b]&=-16777224;a.C[b]|=c;d&&(a.C[b]|=4)};kS.Lj=function Lj(a,b){a.C[b]|=VT};kS.Mj=function Mj(a,b,c,d){d?(a.D[b]|=c):(a.D[b]&=~c);a.Q=0;a.I=true};kS.Nj=function Nj(a,b,c){a.F[b]=c;a.Q=0};kS.Oj=function Oj(a,b){a.G=b};kS.Pj=function Pj(a,b){if(a.I!=b){a.I=b;b||kS.dj(a);a.Q=0}};kS.Qj=function Qj(a,b){a.P=b};kS.Rj=function Rj(a,b){var c,d;a.A=AS.yO(a.A,b);a.q=AS.yO(a.q,b);a.u=AS.yO(a.u,b);d=a.H.length;a.H=AS.zO(a.H,b);for(c=d;c<b;c++)a.H[c]=new kS.Ig;a.v=AS.yO(a.v,b);a.s=AS.yO(a.s,b);a.w=AS.yO(a.w,b);a.t!=null&&(a.t=AS.zO(a.t,b));a.r!=null&&(a.r=AS.zO(a.r,b));a.K=b};kS.Sj=function Sj(a,b){a.B[0]=AS.yO(a.B[0],b);a.B[1]=AS.yO(a.B[1],b);a.F=AS.yO(a.F,b);a.C=AS.yO(a.C,b);a.D=AS.yO(a.D,b);a.L=b};kS.Tj=function Tj(a,b){a.M=b};kS.Uj=function Uj(a,b){a.s[b]|=IT};kS.Vj=function Vj(a,b){var c,d;d=0;for(c=0;c<a.p;c++)(a.B[0][c]==b||a.B[1][c]==b)&&(d+=kS.mi(a,c));return d};kS.Wj=function Wj(a){var b,c,d;c=false;d=false;for(b=0;b<a.o;b++){if(a.v[b]!=0){a.v[b]=0;c=true;a.A[b]==1&&(d=true)}}d&&(a.Q=0);return c};kS.Xj=function Xj(a,b,c){var d,e;return e=a.A[b],e>=3&&e<=4||e>=11&&e<=13||e>=19&&e<=31||e>=37&&e<=51||e>=55&&e<=84||e>=87&&e<=103||(d=a.A[c],d>=3&&d<=4||d>=11&&d<=13||d>=19&&d<=31||d>=37&&d<=51||d>=55&&d<=84||d>=87&&d<=103)?32:1};kS.Yj=function Yj(a,b,c){var d,e,f,g,h;g=a.A[b];a.A[b]=a.A[c];a.A[c]=g;g=a.q[b];a.q[b]=a.q[c];a.q[c]=g;g=a.v[b];a.v[b]=a.v[c];a.v[c]=g;g=a.s[b];a.s[b]=a.s[c];a.s[c]=g;g=a.w[b];a.w[b]=a.w[c];a.w[c]=g;g=a.u[b];a.u[b]=a.u[c];a.u[c]=g;f=a.H[b];a.H[b]=a.H[c];a.H[c]=f;if(a.t!=null){h=a.t[b];a.t[b]=a.t[c];a.t[c]=h}if(a.r!=null){h=a.r[b];a.r[b]=a.r[c];a.r[c]=h}for(d=0;d<a.p;d++){for(e=0;e<2;e++){a.B[e][d]==b?(a.B[e][d]=c):a.B[e][d]==c&&(a.B[e][d]=b)}}a.Q=0};kS.Zj=function Zj(a,b,c){var d;for(d=0;d<a.o;d++){a.H[d].a+=b;a.H[d].b+=c}a.R+=b;a.S+=c};kS.$j=function $j(a,b,c){var d,e;e=c&103;d=kS.vi(a,b);switch(e){case 1:case 64:return d>=1;case 2:return d>=2;case 4:return d>=3;case 32:return true;default:return false;}};kS._j=function _j(a,b,c,d){var e,f,g;for(e=0;e<a.o;e++){if(!d||(a.s[e]&512)!=0){g=a.O[e]*b;f=a.N[e]-c;a.H[e].a=a.R+g*$wnd.Math.sin(f);a.H[e].b=a.S+g*$wnd.Math.cos(f)}}d&&(a.Q&=3)};kS.ak=function ak(a,b,c){var d,e,f;a.R=b;a.S=c;a.N=OC(fS.MD,_S,5,a.o,15,1);a.O=OC(fS.MD,_S,5,a.o,15,1);for(d=0;d<a.o;d++){e=b-a.H[d].a;f=c-a.H[d].b;a.O[d]=$wnd.Math.sqrt(e*e+f*f);a.N[d]=kS.ck(b,c,a.H[d].a,a.H[d].b)}};kS.bk=function bk(a,b){this.K=1>a?1:a;this.L=1>b?1:b;kS.yi(this)};kS.ck=function ck(a,b,c,d){kS.dh();var e,f,g;f=c-a;g=d-b;if(g!=0){e=$wnd.Math.atan(f/g);g<0&&(f<0?(e-=fT):(e+=fT))}else e=f>0?gT:vT;return e};kS.dk=function dk(a,b){kS.dh();var c;c=a-b;while(c<XT)c+=eT;while(c>fT)c-=eT;return c};kS.ek=function ek(a){kS.dh();var b;for(b=1;b<kS.Zg.length;b++)if(gS.tK(a,kS.Zg[b]))return b;return 0};kS.fk=function fk(a){kS.dh();switch(a){case 7:case 8:case 9:case 15:case 16:case 17:case 33:case 34:case 35:case 53:return true;}return false};kS.gk=function gk(a){kS.dh();if(a==1||a==6)return false;if(kS.fk(a))return false;if(a==2||a==10||a==18||a==36||a==54)return false;if(a>103)return false;return true};nH(51,1,{51:1,4:1});_.o=0;_.p=0;_.G=0;_.I=false;_.J=false;_.K=0;_.L=0;_.P=false;_.Q=0;_.R=0;_.S=0;kS.bh=24;fS.lE=YI(51);kS.hk=function hk(a,b,c,d){var e,f,g,h,i,j,k,l,m;kS.Qo(b,1);d==null&&(d=OC(fS.OD,YS,5,b.o,15,1));h=kS.ej(a,1);i=kS.ej(a,2);m=OC(fS.CG,aT,5,b.o,16,1);j=OC(fS.OD,YS,5,b.o,15,1);j[0]=c;m[c]=true;d[c]=kS.uh(b,a,c,h,i);g=0;k=0;while(g<=k){for(l=0;l<kS.tk(b,j[g]);l++){f=b.f[j[g]][l];if(!m[f]){j[++k]=f;m[f]=true;d[f]=kS.uh(b,a,f,h,i)}}++g}for(e=0;e<b.p;e++)m[b.B[0][e]]&&kS.vh(b,a,e,h,i,d==null?b.B[0][e]:d[b.B[0][e]],d==null?b.B[1][e]:d[b.B[1][e]],false);kS.ej(a,1);kS.ej(a,2);a.Q=0};kS.ik=function ik(a){var b,c,d,e,f,g,h,i,j,k,l,m,n;a.g=OC(fS.OD,YS,5,a.o,15,1);a.c=OC(fS.OD,YS,5,a.o,15,1);a.f=OC(fS.OD,DT,6,a.o,0,2);a.i=OC(fS.OD,DT,6,a.o,0,2);a.j=OC(fS.OD,DT,6,a.o,0,2);a.k=OC(fS.OD,YS,5,a.d,15,1);k=OC(fS.OD,YS,5,a.o,15,1);for(h=0;h<a.p;h++){++k[a.B[0][h]];++k[a.B[1][h]]}for(d=0;d<a.o;d++){a.f[d]=OC(fS.OD,YS,5,k[d],15,1);a.i[d]=OC(fS.OD,YS,5,k[d],15,1);a.j[d]=OC(fS.OD,YS,5,k[d],15,1)}m=false;for(i=0;i<a.e;i++){n=kS.mi(a,i);if(n==0){m=true;continue}for(l=0;l<2;l++){e=a.B[l][i];b=a.c[e];a.j[e][b]=n;a.f[e][b]=a.B[1-l][i];a.i[e][b]=i;++a.c[e];++a.g[e];e<a.d&&(n>1?(a.k[e]+=n+n-2):a.F[i]==64&&(a.k[e]=2))}}for(j=a.e;j<a.p;j++){n=kS.mi(a,j);if(n==0){m=true;continue}for(l=0;l<2;l++){e=a.B[l][j];b=a.c[e];a.j[e][b]=n;a.f[e][b]=a.B[1-l][j];a.i[e][b]=j;++a.c[e];a.B[1-l][j]<a.d&&++a.g[e]}}if(m){b=OC(fS.OD,YS,5,a.o,15,1);for(e=0;e<a.o;e++)b[e]=a.c[e];for(g=0;g<a.p;g++){n=kS.mi(a,g);if(n==0){for(l=0;l<2;l++){f=a.B[l][g];a.j[f][b[f]]=0;a.f[f][b[f]]=a.B[1-l][g];a.i[f][b[f]]=g;++b[f]}}}}for(c=0;c<a.d;c++)a.k[c]=a.k[c]/2|0};kS.jk=function jk(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r;kS.Qo(a,1);for(j=0;j<a.p;j++){k=kS.mi(a,j);if(k==1||k==2){if(a.q[a.B[0][j]]>0&&a.q[a.B[1][j]]<0){e=a.B[0][j];f=a.B[1][j]}else if(a.q[a.B[0][j]]<0&&a.q[a.B[1][j]]>0){e=a.B[1][j];f=a.B[0][j]}else continue;i=a.A[e];if(i>=3&&i<=4||i>=11&&i<=13||i>=19&&i<=31||i>=37&&i<=51||i>=55&&i<=84||i>=87&&i<=103||(h=a.A[f],h>=3&&h<=4||h>=11&&h<=13||h>=19&&h<=31||h>=37&&h<=51||h>=55&&h<=84||h>=87&&h<=103))continue;if(a.A[e]<9&&kS.Yk(a,e)>3||a.A[f]<9&&kS.Yk(a,f)>3)continue;a.q[e]-=1;a.q[f]+=1;k==1?(a.F[j]=2):(a.F[j]=4);a.Q=0}}q=0;p=0;n=0;for(d=0;d<a.o;d++){q+=a.q[d];if(a.q[d]<0){++p;kS.fk(a.A[d])&&(n+=a.q[d])}}if(!b&&q!=0)throw HG(new gS.FA("molecule's overall charges are not balanced"));kS.Qo(a,1);r=0;for(g=0;g<a.o;g++){if(a.q[g]>0){if(!kS.kl(a,g)&&kS.fk(a.A[g])){l=gS.bK(kS.Tk(a,g),a.q[g]);if(l!=0&&n>=l){r-=l;n+=l;a.q[g]-=l;a.Q&=1}}}}if(r<0){o=OC(fS.OD,YS,5,p,15,1);p=0;for(e=0;e<a.o;e++){a.q[e]<0&&(kS.ll(a,e)||(o[p++]=(a.A[e]<<16)+e))}AS.OO(o);for(m=o.length-1;q<0&&m>=o.length-p;m--){c=o[m]&TS;if(kS.fk(a.A[c])){l=gS.bK(-r,-a.q[c]);r+=l;a.q[c]+=l;a.Q&=1}}}return q};kS.kk=function kk(a,b){var c,d;for(d=0;d<a.c[b];d++){c=a.i[b][d];(a.F[c]==17||a.F[c]==9)&&a.B[0][c]==b&&(a.F[c]=1)}};kS.lk=function lk(a,b,c,d,e){var f,g,h,i,j;d&&kS.Qo(a,3);b.t=null;a.I&&kS.Pj(b,true);i=c.length;e==null&&(e=OC(fS.OD,YS,5,i,15,1));b.o=0;for(f=0;f<i;f++)e[f]=c[f]?kS.uh(a,b,f,0,0):-1;b.p=0;for(j=0;j<a.p;j++){g=a.B[0][j];h=a.B[1][j];if(g<i&&h<i){if(c[g]&&c[h])kS.vh(a,b,j,0,0,e==null?a.B[0][j]:e[a.B[0][j]],e==null?a.B[1][j]:e[a.B[1][j]],d);else if(a.q[g]!=0&&a.q[h]!=0&&a.q[g]<0^a.q[h]<0){c[g]&&(b.q[e[g]]+=a.q[g]<0?1:-1);c[h]&&(b.q[e[h]]+=a.q[h]<0?1:-1)}}}kS.yh(a,b);!!a.b&&(b.Q=0);b.Q=0;kS.ej(b,1);kS.ej(b,2);b.o!=i&&kS.Pj(b,true);d&&kS.Yd(new kS.fe(b),null,false)};kS.mk=function mk(a,b,c,d,e){var f,g,h,i,j;d&&kS.Qo(a,3);b.t=null;a.I&&kS.Pj(b,true);e==null&&(e=OC(fS.OD,YS,5,a.o,15,1));b.o=0;for(f=0;f<a.o;f++){e[f]=-1;for(j=0;j<a.g[f];j++){if(c[a.i[f][j]]){e[f]=kS.uh(a,b,f,0,0);break}}}b.p=0;for(i=0;i<a.p;i++)if(c[i]){kS.vh(a,b,i,0,0,e==null?a.B[0][i]:e[a.B[0][i]],e==null?a.B[1][i]:e[a.B[1][i]],d)}else{g=a.B[0][i];h=a.B[1][i];if(e[g]==-1^e[h]==-1){if(a.q[g]!=0&&a.q[h]!=0&&a.q[g]<0^a.q[h]<0){e[g]!=-1&&(b.q[e[g]]+=a.q[g]<0?1:-1);e[h]!=-1&&(b.q[e[h]]+=a.q[h]<0?1:-1)}}}kS.yh(a,b);!!a.b&&(b.Q=0);b.Q=0;kS.ej(b,1);kS.ej(b,2);b.o!=a.o&&kS.Pj(b,true);d&&kS.Yd(new kS.fe(b),null,false);return e};kS.nk=function nk(a,b){var c,d,e,f,g,h,i,j,k,l,m;if((b&~a.Q)==0)return;if((a.Q&1)==0){kS.jl(a);kS.ik(a);a.Q|=1;if(kS.Pl(a)){kS.jl(a);kS.ik(a)}}if((b&~a.Q)==0)return;if((a.Q&2)==0){for(d=0;d<a.d;d++)a.s[d]&=-31753;for(g=0;g<a.e;g++)a.C[g]&=-961;kS.rk(a);for(f=0;f<a.e;f++){if(a.F[f]==64){a.s[a.B[0][f]]|=hT;a.s[a.B[1][f]]|=hT;a.C[f]|=256;a.C[f]|=512}}for(e=0;e<a.d;e++){for(l=0;l<a.g[e];l++){j=a.i[e][l];if((a.C[j]&256)!=0)continue;i=a.f[e][l];for(m=0;m<a.g[i];m++){if(a.i[i][m]==j)continue;a.j[i][m]>1&&(a.A[a.f[i][m]]==6?(a.s[e]|=JT):!kS.pl(a,a.i[i][m])&&kS.Li(a,a.f[i][m])&&(a.s[e]|=pT))}}}while(true){k=false;for(c=0;c<a.d;c++){if(a.k[c]>0&&(20480&a.s[c])==pT){for(l=0;l<a.g[c];l++){if(a.j[c][l]>1){i=a.f[c][l];j=a.i[c][l];for(m=0;m<a.g[i];m++){if(a.i[i][m]!=j){h=a.f[i][m];if((a.s[h]&pT)==0){a.s[h]|=pT;k=true}}}}}}}if(!k)break}a.Q|=2}};kS.ok=function ok(a,b){var c,d,e,f,g;c=-1;if(a.k[b]==1){for(f=0;f<a.g[b];f++){if(a.j[b][f]==2){d=a.f[b][f];if(a.g[d]==2&&a.k[d]==2){for(g=0;g<2;g++){e=a.f[d][g];if(e!=b&&a.k[e]==1){c=d;break}}}break}}}return c};kS.pk=function pk(a,b){var c;if(a.g[b]==3&&(a.s[b]&hT)!=0&&(!!a.n&&b<a.d?kS.Xm(a.n,b):0)>=6)for(c=0;c<a.g[b];c++)if(kS.ql(a,a.i[b][c]))return a.i[b][c];return -1};kS.qk=function qk(a,b,c,d,e){var f,g,h,i,j,k;kS.Qo(a,3);if((a.s[b]&QT)==0||c&&(a.s[b]&hT)==0)return;i=OC(fS.OD,YS,5,a.d,15,1);i[0]=b;d[b]=true;h=0;j=0;while(h<=j){for(k=0;k<a.g[i[h]];k++){g=a.i[i[h]][k];if(!e[g]&&(a.C[g]&64)!=0&&(!c||(a.C[g]&256)!=0)){e[g]=true;f=a.f[i[h]][k];if(!d[f]){d[f]=true;i[++j]=f}}}++h}};kS.rk=function rk(a){var b,c,d,e,f,g,h,i;a.n=new kS.kn(a,7);c=OC(fS.OD,YS,5,a.d,15,1);for(d=0;d<a.e;d++){if(kS.Ym(a.n,d)!=0){a.C[d]|=64;++c[a.B[0][d]];++c[a.B[1][d]]}}for(b=0;b<a.d;b++){c[b]==2?(a.s[b]|=kT):c[b]==3?(a.s[b]|=iT):c[b]>3&&(a.s[b]|=QT)}for(i=0;i<a.n.i.a.length;i++){f=kS.Zm(a.n,i);h=kS.$m(a.n,i);g=f.length;for(e=0;e<g;e++){a.s[f[e]]|=8;a.C[h[e]]|=128;if(kS.bn(a.n,i)){a.s[f[e]]|=hT;a.C[h[e]]|=256}kS.en(a.n,i)&&(a.C[h[e]]|=512);a.F[h[e]]==26&&(a.F[h[e]]=2)}}};kS.sk=function sk(a){var b,c,d,e,f,g,h,i,j,k;j=OC(fS.CG,aT,5,a.o,16,1);for(c=0;c<a.o;c++)j[c]=a.A[c]==1&&a.v[c]==0&&a.q[c]==0&&(a.r==null||a.r[c]==null);k=OC(fS.CG,aT,5,a.o,16,1);for(i=0;i<a.p;i++){d=a.B[0][i];e=a.B[1][i];if(kS.mi(a,i)!=1){j[d]=false;j[e]=false;continue}k[d]&&(j[d]=false);k[e]&&(j[e]=false);j[d]&&(g=a.A[e],g>=3&&g<=4||g>=11&&g<=13||g>=19&&g<=31||g>=37&&g<=51||g>=55&&g<=84||g>=87&&g<=103)&&(j[d]=false);j[e]&&(f=a.A[d],f>=3&&f<=4||f>=11&&f<=13||f>=19&&f<=31||f>=37&&f<=51||f>=55&&f<=84||f>=87&&f<=103)&&(j[e]=false);k[d]=true;k[e]=true}for(h=0;h<a.p;h++){if(j[a.B[0][h]]&&j[a.B[1][h]]){j[a.B[0][h]]=false;j[a.B[1][h]]=false}}for(b=0;b<a.o;b++)k[b]||(j[b]=false);return j};kS.tk=function tk(a,b){return a.c[b]};kS.uk=function uk(a,b){return a.f[b].length};kS.vk=function vk(a,b){return a.c[b]-a.g[b]+kS.Tk(a,b)};kS.wk=function wk(a){var b,c;kS.Qo(a,3);b=0;for(c=0;c<a.n.i.a.length;c++)kS.bn(a.n,c)&&++b;return b};kS.xk=function xk(a,b){return a.k[b]};kS.yk=function yk(a,b){kS.Qo(a,3);return a.k[b]==2&&a.g[b]==2?kS.Bl(a,b):kS.Dl(a,b)};kS.zk=function zk(a,b){var c;c=a.s[b]&QT;return c==0?0:c==kT?2:c==iT?3:4};kS.Ak=function Ak(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o;kS.Qo(a,3);f=OC(fS.CG,aT,5,a.e,16,1);l=OC(fS.CG,aT,5,a.e,16,1);o=OC(fS.OD,YS,5,a.d,15,1);g=0;for(h=1;h<a.g[b];h++){d=a.i[b][h];if((a.C[d]&64)!=0){for(j=0;j<h;j++){e=a.i[b][j];if((a.C[e]&64)!=0){l[d]=true;l[e]=true;n=kS.Zk(a,o,a.f[b][h],a.f[b][j],c-2,l);l[d]=false;l[e]=false;if(n!=-1){i=false;m=OC(fS.OD,YS,5,n,15,1);kS.$k(a,o,m,n);for(k=0;k<n;k++){if(!f[m[k]]){f[m[k]]=true;i=true}}i&&++g}}}}}return g};kS.Bk=function Bk(a,b){return !!a.n&&b<a.d?kS.Xm(a.n,b):0};kS.Ck=function Ck(a,b){if(b){kS.Qo(a,1);return kS.ci(a,a.d,a.e,kS.bh)}else{return kS.ci(a,a.o,a.p,kS.bh)}};kS.Dk=function Dk(a){var b,c,d,e,f,g,h,i;kS.Qo(a,1);h=OC(fS.ND,FT,5,a.d,15,1);d=OC(fS.OD,YS,5,a.d,15,1);for(i=0;i<a.d;i++){d[0]=i;e=OC(fS.OD,YS,5,a.d,15,1);e[i]=1;c=0;f=0;while(c<=f){for(g=0;g<a.g[d[c]];g++){b=a.f[d[c]][g];if(e[b]==0){e[b]=e[d[c]]+1;d[++f]=b;h[i]+=e[b]-1}}++c}h[i]/=f}return h};kS.Ek=function Ek(a,b,c){var d;for(d=0;d<a.f[b].length;d++)if(a.f[b][d]==c)return a.i[b][d];return -1};kS.Fk=function Fk(a,b){return !!a.n&&b<a.e?kS.Ym(a.n,b):0};kS.Gk=function Gk(a,b,c){return a.f[b][c]};kS.Hk=function Hk(a,b){return a.g[b]};kS.Ik=function Ik(a,b,c){return a.i[b][c]};kS.Jk=function Jk(a,b,c){return a.j[b][c]};kS.Kk=function Kk(a,b){var c,d;kS.Qo(a,1);d=0;for(c=0;c<a.c[b];c++)a.I&&(a.w[a.f[b][c]]&bT)!=0&&(d+=a.j[b][c]);return d};kS.Lk=function Lk(a,b){return a.c[b]-a.g[b]};kS.Mk=function Mk(a,b,c,d,e){var f,g,h,i;g=a.c[b];if(a.k[b]!=0||(a.s[b]&hT)!=0||a.g[b]<3||g>4)return false;i=OC(fS.CG,aT,5,4,16,1);for(h=0;h<g;h++){f=3.9269908169872414-d[h];if($wnd.Math.abs(YT-f%gT)>0.0872664675116539)return false;e[h]=3&JD(f/gT);if(i[e[h]])return false;i[e[h]]=true;if((e[h]&1)==0){if(a.F[a.i[b][c[h]]]!=1)return false}else{if(!kS.Vi(a,a.i[b][c[h]],b))return false}}return i[0]&&i[2]};kS.Nk=function Nk(a,b,c,d,e){var f,g,h,i,j,k,l,m;f=a.c[b];e==null&&(e=OC(fS.OD,YS,5,f,15,1));if(!kS.Mk(a,b,c,d,e))return 3;i=-1;for(j=0;j<f;j++){if((e[j]&1)==1){g=a.F[a.i[b][c[j]]];if(i!=-1&&i!=g)return 3;i=g}}k=gS._J(e[0]-e[1])==2?1:0;h=e[k]-e[k+1];m=(h<0?-h:h)==3^e[k]<e[k+1];l=f==3||(e[3]&1)==1;return m^l^i==9?1:2};kS.Ok=function Ok(a,b,c){var d,e,f,g,h,i,j,k,l,m;kS.Qo(a,1);m=OC(fS.CG,aT,5,a.o,16,1);j=OC(fS.OD,YS,5,a.o,15,1);j[0]=b;m[b]=true;g=0;k=0;i=1;while(g<=k){f=c?kS.uk(a,j[g]):a.c[j[g]];for(l=0;l<f;l++){e=a.f[j[g]][l];if(!m[e]){j[++k]=e;m[e]=true;++i}}++g}h=OC(fS.OD,YS,5,i,15,1);i=0;for(d=0;d<a.o;d++)m[d]&&(h[i++]=d);return h};kS.Pk=function Pk(a,b,c,d){var e,f,g,h,i,j,k,l,m;kS.Qo(a,1);for(f=0;f<a.o;f++)b[f]=-1;j=0;for(e=0;e<a.o;e++){if(b[e]==-1&&(!c||(a.s[e]&CT)!=0)){b[e]=j;k=OC(fS.OD,YS,5,a.o,15,1);k[0]=e;i=0;l=0;while(i<=l){h=d?kS.uk(a,k[i]):a.c[k[i]];for(m=0;m<h;m++){g=a.f[k[i]][m];if(b[g]==-1&&(!c||(a.s[g]&CT)!=0)){k[++l]=g;b[g]=j}}++i}++j}}return j};kS.Qk=function Qk(a,b){var c;return c=kS.ui(a,b),c+kS.si(a,b,c)-kS.Yk(a,b)};kS.Rk=function Rk(a){var b,c,d,e;e=OC(fS.OD,YS,5,a.o,15,1);c=kS.sk(a);d=a.o-1;while(d>=0&&c[d]){e[d]=d;--d}for(b=0;b<=d;b++){if(c[b]){e[b]=d;e[d]=b;--d;while(d>=0&&c[d]){e[d]=d;--d}}else{e[b]=b}}return e};kS.Sk=function Sk(a,b,c){var d,e,f,g;e=kS.Yk(a,b);e-=kS.si(a,b,e);c&&(e-=a.c[b]-a.g[b]);g=a.A[b]<kS.$g.length?kS.$g[a.A[b]]:null;f=g==null?6:g[0];if(e<=f)return -1;if(g!=null)for(d=1;f<e&&d<g.length;d++)f=g[d];return f>e?f:e};kS.Tk=function Tk(a,b){var c,d,e,f,g,h;if(a.I&&(a.w[b]&iT)==0)return 0;if(!kS.Ml(a,b))return 0;kS.Qo(a,1);g=0;for(e=0;e<a.c[b];e++)g+=a.j[b][e];if(a.I){c=1;for(d=0;d<a.g[b];d++)a.F[a.i[b][d]]==64&&++c;g+=c>>1}g-=kS.si(a,b,g);f=((a.s[b]&OT)>>>28)-1;if(f==-1){if(a.A[b]>=171&&a.A[b]<=190){f=2}else{h=a.A[b]<kS.$g.length?kS.$g[a.A[b]]:null;if(h==null){f=6}else{f=h[0];for(d=1;f<g&&d<h.length;d++)f=h[d]}}}return 0>f-g?0:f-g};kS.Uk=function Uk(a,b){var c,d,e,f;d=kS.Yk(a,b);d+=kS.si(a,b,d);e=((a.s[b]&OT)>>>28)-1;if(e==-1){f=a.A[b]<kS.$g.length?kS.$g[a.A[b]]:null;if(f==null){e=6}else{c=0;while(d>f[c]&&c<f.length-1)++c;e=f[c]}}return e-d};kS.Vk=function Vk(a,b){return a.f[b].length-a.c[b]};kS.Wk=function Wk(a){var b,c,d,e;kS.Qo(a,1);e=0;for(b=0;b<a.o;b++){d=a.v[b]!=0?a.v[b]:kS.ah[a.A[b]];e+=d+kS.Tk(a,b)*kS.ah[1];if(a.A[b]>=171&&a.A[b]<=190){c=a.c[b];c>2&&(e-=(c-2)*kS.ah[1])}}return e};kS.Xk=function Xk(a,b){var c,d;c=a.g[b];for(d=0;d<a.g[b];d++)a.A[a.f[b][d]]==1&&--c;return c};kS.Yk=function Yk(a,b){var c,d;a.gb(1);d=0;for(c=0;c<a.c[b];c++)d+=a.j[b][c];return d};kS.Zk=function Zk(a,b,c,d,e,f){var g,h,i,j,k,l,m,n,o;if(c==d){b[0]=c;return 0}kS.Qo(a,1);j=OC(fS.OD,YS,5,a.o,15,1);i=OC(fS.OD,YS,5,a.o,15,1);o=OC(fS.OD,YS,5,a.o,15,1);i[0]=c;j[c]=1;h=0;k=0;while(h<=k&&j[i[h]]<=e){n=i[h];for(l=0;l<a.c[n];l++){if(f==null||f.length<=a.i[n][l]||!f[a.i[n][l]]){g=a.f[n][l];if(g==d){m=j[n];b[m]=g;b[--m]=n;while(m>0){b[m-1]=o[b[m]];--m}return j[n]}if(j[g]==0){i[++k]=g;j[g]=j[n]+1;o[g]=n}}}++h}return -1};kS.$k=function $k(a,b,c,d){var e,f;kS.Qo(a,1);for(e=0;e<d;e++){for(f=0;f<a.c[b[e]];f++){if(a.f[b[e]][f]===b[e+1]){c[e]=a.i[b[e]][f];break}}}};
kS._k=function _k(a,b,c){var d,e,f,g,h,i;if(b==c)return 0;kS.Qo(a,1);g=OC(fS.OD,YS,5,a.o,15,1);f=OC(fS.OD,YS,5,a.o,15,1);f[0]=b;g[b]=1;e=0;h=0;while(e<=h){for(i=0;i<a.c[f[e]];i++){d=a.f[f[e]][i];if(d==c)return g[f[e]];if(g[d]==0){f[++h]=d;g[d]=g[f[e]]+1}}++e}return -1};kS.al=function al(a,b,c,d,e){var f,g,h,i,j,k;if(b==c)return 0;kS.Qo(a,1);i=OC(fS.OD,YS,5,a.o,15,1);h=OC(fS.OD,YS,5,a.o,15,1);h[0]=b;i[b]=1;g=0;j=0;while(g<=j&&i[h[g]]<=d){for(k=0;k<a.c[h[g]];k++){f=a.f[h[g]][k];if(f==c)return i[h[g]];if(i[f]==0&&(e==null||e.length<=f||!e[f])){h[++j]=f;i[f]=i[h[g]]+1}}++g}return -1};kS.bl=function bl(a){kS.Qo(a,3);return a.n};kS.cl=function cl(a){var b,c,d,e,f,g,h,i,j;j=0;kS.Qo(a,3);for(d=0;d<a.e;d++){if(kS.mi(a,d)==1&&(a.C[d]&64)==0){h=true;for(g=0;g<2;g++){b=a.B[g][d];if(a.g[b]==1){h=false;break}if(a.A[b]==7&&(a.s[b]&hT)==0){c=a.B[1-g][d];for(i=0;i<a.g[c];i++){e=a.f[c][i];f=a.i[c][i];if(f!=d&&kS.mi(a,f)>1&&(a.s[e]&hT)==0&&kS.fk(a.A[e])){h=false;break}}}}h&&!kS.tl(a,d)&&++j}}return j};kS.dl=function dl(a,b){var c,d,e,f;c=a.c[b];f=OC(fS.OD,YS,5,c,15,1);for(e=0;e<c;e++)f[e]=(a.f[b][e]<<16)+e;AS.OO(f);for(d=0;d<c;d++)f[d]&=TS;return f};kS.el=function el(a,b){var c,d;kS.Qo(a,1);if(a.g[b]==2&&a.j[b][0]==2&&a.j[b][1]==2){for(c=0;c<2;c++)for(d=0;d<a.c[a.f[b][c]];d++)if(kS.Vi(a,a.i[a.f[b][c]][d],a.f[b][c]))return a.i[a.f[b][c]][d]}else{for(c=0;c<a.c[b];c++)if(kS.Vi(a,a.i[b][c],b))return a.i[b][c]}return -1};kS.fl=function fl(a,b,c){if(kS.mi(a,b)!=1)return 0;return 16-a.c[c]+(a.A[c]==1?hT:0)+((a.F[b]&24)==0||a.B[0][b]!=c?iT:0)+((a.s[c]&3)==0?kT:0)+((a.C[b]&64)!=0?0:512)+(a.A[c]!=6?256:0)};kS.gl=function gl(a,b,c,d,e,f){var g,h,i,j,k,l;kS.Qo(a,1);if(e){kS.Fh(e);e.I=false}j=OC(fS.OD,YS,5,a.o,15,1);d==null?(d=OC(fS.CG,aT,5,a.o,16,1)):AS.HO(d,d.length);j[0]=b;j[1]=c;d[b]=true;d[c]=true;i=1;k=1;while(i<=k){h=kS.uk(a,j[i]);for(l=0;l<h;l++){g=a.f[j[i]][l];if(g==b){if(i!=1)return -1}if(!d[g]){d[g]=true;j[++k]=g}}++i}if(e){f==null&&(f=OC(fS.OD,YS,5,d.length,15,1));kS.lk(a,e,d,false,f);kS.qh(e,f[b],0,0,-1,0)}d[b]=false;return k};kS.hl=function hl(a,b,c){var d,e,f,g,h,i;kS.Qo(a,1);f=OC(fS.OD,YS,5,a.d,15,1);i=OC(fS.CG,aT,5,a.d,16,1);f[0]=b;f[1]=c;i[b]=true;i[c]=true;e=1;g=1;while(e<=g){for(h=0;h<a.g[f[e]];h++){d=a.f[f[e]][h];if(d==b){if(e!=1)return -1}if(!i[d]){i[d]=true;f[++g]=d}}++e}return g};kS.il=function il(a,b,c){var d,e,f,g,h,i,j,k,l,m,n;if(kS.mi(a,c)!=2&&(a.C[c]&256)==0)return -1;n=a.C[c]&3;if(n!=1&&n!=2)return -1;for(i=0;i<2;i++){d=a.B[i][c];e=a.B[1-i][c];m=-1;g=false;for(k=0;k<a.g[d];k++){f=a.f[d][k];f!=e&&(f==b?(g=true):(m=f))}if(g){l=-1;h=-1;for(j=0;j<a.g[e];j++){f=a.f[e][j];if(f!=d){if(l==-1)l=f;else if(f>l)h=f;else{h=l;l=f}}}if(a.g[d]==2){if(a.g[e]==2)return n==2?l:-1;return n==2?l:h}else{if(a.g[e]==2)return n==2^b<m?-1:l;return n==2^b<m?h:l}}}return -1};kS.jl=function jl(a){var b,c,d,e,f,g,h,i,j,k,l;h=kS.sk(a);i=a.o;do --i;while(i>=0&&h[i]);for(b=0;b<i;b++){if(h[b]){kS.Yj(a,b,i);k=h[b];h[b]=h[i];h[i]=k;do --i;while(h[i])}}a.d=i+1;if(a.o==a.d){a.e=a.p;return}g=OC(fS.CG,aT,5,a.p,16,1);for(f=0;f<a.p;f++){c=a.B[0][f];d=a.B[1][f];(h[c]||h[d])&&(g[f]=true)}j=a.p;do --j;while(j>=0&&g[j]);for(e=0;e<j;e++){if(g[e]){l=a.B[0][e];a.B[0][e]=a.B[0][j];a.B[0][j]=l;l=a.B[1][e];a.B[1][e]=a.B[1][j];a.B[1][j]=l;l=a.F[e];a.F[e]=a.F[j];a.F[j]=l;g[e]=false;do --j;while(g[j])}}a.e=j+1};kS.kl=function kl(a,b){var c;for(c=0;c<a.g[b];c++)if(a.q[a.f[b][c]]<0)return true;return false};kS.ll=function ll(a,b){var c;for(c=0;c<a.g[b];c++)if(a.q[a.f[b][c]]>0)return true;return false};kS.ml=function ml(a,b){return (a.s[b]&JT)!=0};kS.nl=function nl(a,b){var c,d,e,f,g,h;a.gb(1);for(g=0;g<2;g++){c=a.B[g][b];if(a.A[c]==7){d=a.B[1-g][b];for(h=0;h<a.g[d];h++){e=a.f[d][h];f=a.i[d][h];if((a.A[e]==7||a.A[e]==8||a.A[e]==16)&&kS.mi(a,f)>=2)return true}}}return false};kS.ol=function ol(a,b){return (a.s[b]&hT)!=0};kS.pl=function pl(a,b){return (a.C[b]&256)!=0};kS.ql=function ql(a,b){var c,d,e,f,g,h;if(a.F[b]!=1||(a.C[b]&256)!=0||(a.C[b]&64)!=0&&(!!a.n&&b<a.e?kS.Ym(a.n,b):0)<7)return false;c=a.B[0][b];if((a.s[c]&hT)==0||(!!a.n&&c<a.d?kS.Xm(a.n,c):0)<6)return false;d=a.B[1][b];if((a.s[d]&hT)==0||(!!a.n&&d<a.d?kS.Xm(a.n,d):0)<6)return false;h=0;for(g=0;g<a.g[c];g++){e=a.f[c][g];e!=d&&a.g[e]>2&&++h}for(f=0;f<a.g[d];f++){e=a.f[d][f];e!=c&&a.g[e]>2&&++h}return h>2};kS.rl=function rl(a,b){return (a.C[b]&512)!=0};kS.sl=function sl(a,b){var c,d,e,f,g,h,i,j,k,l,m;if(a.A[b]!=7)return false;if((a.s[b]&hT)!=0||a.k[b]!=0||(a.w[b]&uT)!=0)return true;if(a.q[b]==1)return false;f=0;for(h=0;h<a.g[b];h++){if(a.j[b][h]==1){c=a.A[a.f[b][h]];(c==8||c==9||c==17)&&++f}}if(f==0){for(g=0;g<a.g[b];g++){d=a.f[b][g];if(a.k[d]!=0){if((a.s[d]&hT)!=0){if((!!a.n&&d<a.d?kS.Xm(a.n,d):0)>=5){m=0;for(k=0;k<a.g[d];k++){l=a.f[d][k];l!=b&&a.g[l]>=3&&++m}if(m==2||m==1&&a.g[b]==3)continue}return true}for(j=0;j<a.g[d];j++){if((a.j[d][j]==2||kS.pl(a,a.i[d][j]))&&kS.zl(a,a.f[d][j]))return true}}}}if(f<2){for(g=0;g<a.g[b];g++){d=a.f[b][g];i=false;e=false;for(j=0;j<a.g[d];j++){if(a.f[d][j]!=b){a.j[d][j]!=1&&(a.A[a.f[d][j]]==7||a.A[a.f[d][j]]==8||a.A[a.f[d][j]]==16)&&(i=true);a.j[d][j]==1&&a.A[a.f[d][j]]==7&&(e=true)}}if(i&&(!e||f==0))return true}}return false};kS.tl=function tl(a,b){var c,d,e,f,g,h;if(kS.mi(a,b)!=1)return false;for(f=0;f<2;f++){c=a.B[f][b];h=a.B[1-f][b];while(a.k[c]==2&&a.g[c]==2&&a.A[c]<10){for(g=0;g<2;g++){d=a.f[c][g];if(d!=h){if(a.g[d]==1)return true;e=a.i[c][g];if(kS.mi(a,e)==1&&e<b)return true;h=c;c=d;break}}}if(a.g[c]==1)return true}return false};kS.ul=function ul(a,b){return (a.s[b]&QT)!=0};kS.vl=function vl(a,b){return (a.C[b]&64)!=0};kS.wl=function wl(a,b){return a.A[b]==1&&a.v[b]==0&&a.q[b]==0&&(a.r==null||a.r[b]==null)};kS.xl=function xl(a,b){return (a.s[b]&8)!=0};kS.yl=function yl(a,b){return (a.C[b]&128)!=0};kS.zl=function zl(a,b){return (a.s[b]&pT)!=0};kS.Al=function Al(a){var b,c,d,e,f,g,h,i,j,k;kS.Qo(a,1);i=false;for(c=0;c<a.d;c++){if(a.A[c]==7&&a.q[c]==0){k=kS.Yk(a,c);if(k==4){for(j=0;j<a.g[c];j++){g=a.f[c][j];if(a.j[c][j]==1&&a.A[g]==8&&a.g[g]==1&&a.q[g]==0){i=true;++a.q[c];--a.q[g];break}}}else if(k==5){for(j=0;j<a.g[c];j++){g=a.f[c][j];h=a.i[c][j];if(a.j[c][j]==2&&a.A[g]==8){i=true;++a.q[c];--a.q[g];a.F[h]=1;break}if(a.j[c][j]==3&&a.A[g]==7){i=true;++a.q[c];--a.q[g];a.F[h]=2;break}}}}}f=false;for(e=0;e<a.e;e++){for(j=0;j<2;j++){if(kS.Li(a,a.B[j][e])){b=a.B[1-j][e];d=a.A[b];if(d==3||d==11||d==12||d==19||d==20||d==37||d==38||d==55||d==56){if(kS.mi(a,e)==1){++a.q[b];--a.q[a.B[j][e]];a.F[e]=128;f=true}else if(a.F[e]==32){a.F[e]=128;f=true}}break}}}if(f){kS.th(a);i=true}i&&(a.Q=0);return i};kS.Bl=function Bl(a,b){var c,d,e,f,g,h,i,j;i=-1;d=0;for(g=0;g<2;g++){c=a.f[b][g];for(h=0;h<a.c[c];h++){e=a.f[c][h];if(e!=b){f=a.i[c][h];j=kS.fl(a,f,e);if(d<j){d=j;i=f}}}}return i};kS.Cl=function Cl(a,b){var c,d,e,f,g,h,i,j;i=-1;d=0;for(g=0;g<2;g++){c=a.B[g][b];for(h=0;h<a.c[c];h++){e=a.f[c][h];if(e!=a.B[1-g][b]){f=a.i[c][h];j=kS.fl(a,f,e);if(d<j){d=j;i=f}}}}return i};kS.Dl=function Dl(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r;c=a.c[b];d=OC(fS.MD,_S,5,c,15,1);for(m=0;m<c;m++)d[m]=kS.di(a,b,a.f[b][m]);for(n=1;n<c;n++){for(o=0;o<n;o++){e=$wnd.Math.abs(kS.dk(d[n],d[o]));if(e<0.08||e>ZT){f=0;g=0;for(p=0;p<c;p++){if(p!=n&&p!=o){f+=$wnd.Math.abs(pS.bA(d[n],d[p]));g+=$wnd.Math.abs(pS.bA(d[o],d[p]))}}i=f<g?a.i[b][n]:a.i[b][o];if(kS.mi(a,i)==1)return i}}}q=-1;h=0;for(l=0;l<c;l++){j=a.f[b][l];k=a.i[b][l];r=kS.fl(a,k,j);if(h<r){h=r;q=k}}return q};kS.El=function El(a){var b,c,d,e;kS.Qo(a,7);a.o=a.d;a.p=a.e;for(c=0;c<a.d;c++){if(a.c[c]!==a.g[c]){b=kS.Sk(a,c,false);a.c[c]=a.g[c];if(b!=-1){e=kS.Sk(a,c,true);if(b!=e){d=((a.s[c]&OT)>>>28)-1;(d==-1||d<b)&&kS.ij(a,c,b)}}}}kS.Kl(a);a.Q=0};kS.Fl=function Fl(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B;if(a.g[b]!=2||a.j[b][0]!=2||a.j[b][1]!=2||a.g[a.f[b][0]]<2||a.g[a.f[b][1]]<2||a.k[a.f[b][0]]!=1||a.k[a.f[b][1]]!=1){kS.vj(a,b,0,false);return}w=-1;v=-1;u=-1;r=-1;f=0;for(l=0;l<2;l++){d=a.f[b][l];for(p=0;p<a.c[d];p++){g=a.f[d][p];if(g!=b){h=a.i[d][p];A=kS.fl(a,h,g);if(f<A){f=A;v=g;w=h;u=d;r=a.f[b][1-l]}}}}if(v==-1)return;for(m=0;m<2;m++)for(o=0;o<a.c[a.f[b][m]];o++)a.f[a.f[b][m]][o]!=b&&(a.F[a.i[a.f[b][m]][o]]=1);if(a.B[1][w]!=v){a.B[0][w]=a.B[1][w];a.B[1][w]=v}i=KS;for(n=0;n<a.g[u];n++){g=a.f[u][n];g!=b&&i>g&&(i=g)}s=OC(fS.OD,YS,5,2,15,1);t=0;for(k=0;k<a.g[r];k++){g=a.f[r][k];g!=b&&(s[t++]=g)}c=kS.ck(a.H[b].a,a.H[b].b,a.H[r].a,a.H[r].b);if(t==2){if(s[0]>s[1]){B=s[0];s[0]=s[1];s[1]=B}j=kS.dk(c,kS.di(a,r,s[0]));q=kS.dk(c,kS.di(a,r,s[1]));e=j-q}else{e=kS.dk(c,kS.di(a,r,s[0]))}e<0^(a.s[b]&3)==1^i==v?(a.F[w]=17):(a.F[w]=9)};kS.Gl=function Gl(a,b,c,d){var e,f,g,h,i,j;e=a.c[b];h=OC(fS.OD,YS,5,e,15,1);j=kS.Nk(a,b,c,d,h);if(j==3)return false;g=(a.s[b]&3)==j?17:9;for(i=0;i<e;i++){if((h[i]&1)==1){f=a.i[b][c[i]];a.F[f]=g;if(a.B[0][f]!=b){a.B[1][f]=a.B[0][f];a.B[0][f]=b}}}return true};kS.Hl=function Hl(a,b){a.Q|=252&(4|b)};kS.Il=function Il(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s;if((a.s[b]&3)==0||(a.s[b]&3)==3)return;if(a.k[b]==2&&a.g[b]==2){kS.Fl(a,b);return}if(a.g[b]<3||a.g[b]>4){kS.vj(a,b,0,false);return}c=a.c[b];q=false;for(h=0;h<c;h++){if(kS.mi(a,a.i[b][h])==1){q=true;break}}if(!q)return;r=kS.dl(a,b);d=OC(fS.MD,_S,5,c,15,1);for(i=0;i<c;i++)d[i]=kS.di(a,a.f[b][r[i]],b);for(j=0;j<c;j++)a.B[0][a.i[b][j]]==b&&kS.mi(a,a.i[b][j])==1&&(a.F[a.i[b][j]]=1);if(kS.Gl(a,b,r,d))return;o=-1;for(k=0;k<c;k++){f=a.i[b][k];if((a.F[f]==17||a.F[f]==9)&&a.B[0][f]==b){a.F[a.i[b][k]]=1;o==-1?(o=f):(o=-2)}}o<0&&(o=kS.Dl(a,b));if(a.B[0][o]!=b){a.B[1][o]=a.B[0][o];a.B[0][o]=b}p=-1;for(l=0;l<c;l++){if(o==a.i[b][r[l]]){p=l;break}}s=WC(IC(fS.OD,2),DT,6,0,[WC(IC(fS.OD,1),YS,5,15,[2,1,2,1]),WC(IC(fS.OD,1),YS,5,15,[1,2,2,1]),WC(IC(fS.OD,1),YS,5,15,[1,1,2,2]),WC(IC(fS.OD,1),YS,5,15,[2,1,1,2]),WC(IC(fS.OD,1),YS,5,15,[2,2,1,1]),WC(IC(fS.OD,1),YS,5,15,[1,2,1,2])]);for(g=1;g<c;g++)d[g]<d[0]&&(d[g]+=eT);if(c==3){m=false;switch(p){case 0:m=d[1]<d[2]&&d[2]-d[1]<fT||d[1]>d[2]&&d[1]-d[2]>fT;break;case 1:m=d[2]-d[0]>fT;break;case 2:m=d[1]-d[0]<fT;}e=(a.s[b]&3)==1^m?17:9}else{n=0;d[1]<=d[2]&&d[2]<=d[3]?(n=0):d[1]<=d[3]&&d[3]<=d[2]?(n=1):d[2]<=d[1]&&d[1]<=d[3]?(n=2):d[2]<=d[3]&&d[3]<=d[1]?(n=3):d[3]<=d[1]&&d[1]<=d[2]?(n=4):d[3]<=d[2]&&d[2]<=d[1]&&(n=5);e=(a.s[b]&3)==1^s[n][p]==1?9:17}a.F[o]=e};kS.Jl=function Jl(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A;if((a.C[b]&3)==0||(a.C[b]&3)==3||!kS.ql(a,b))return;v=-1;t=-1;u=-1;s=-1;e=0;for(l=0;l<2;l++){d=a.B[l][b];for(o=0;o<a.c[d];o++){h=a.i[d][o];if(h!=b&&kS.mi(a,h)==1){g=a.f[d][o];w=kS.fl(a,h,g);if(e<w){e=w;t=g;v=h;u=d;s=a.B[1-l][b]}}}}if(t==-1)return;for(m=0;m<2;m++){for(o=0;o<a.c[a.B[m][b]];o++){h=a.i[a.B[m][b]][o];h!=b&&kS.mi(a,h)==1&&(a.F[h]=1)}}if(a.B[1][v]!=t){a.B[0][v]=a.B[1][v];a.B[1][v]=t}i=KS;for(n=0;n<a.g[u];n++){g=a.f[u][n];a.i[u][n]!=b&&i>g&&(i=g)}q=OC(fS.OD,YS,5,2,15,1);r=0;for(k=0;k<a.g[s];k++)a.i[s][k]!=b&&(q[r++]=a.f[s][k]);f=kS.ck(a.H[u].a,a.H[u].b,a.H[s].a,a.H[s].b);if(r==2){if(q[0]>q[1]){A=q[0];q[0]=q[1];q[1]=A}j=kS.dk(f,kS.di(a,s,q[0]));p=kS.dk(f,kS.di(a,s,q[1]));c=j-p}else{c=kS.dk(f,kS.di(a,s,q[0]))}c<0^(a.C[b]&3)==2^i==t?(a.F[v]=17):(a.F[v]=9)};kS.Kl=function Kl(a){var b,c;kS.Qo(a,3);for(b=0;b<a.d;b++)kS.Il(a,b);for(c=0;c<a.e;c++)kS.Jl(a,c)};kS.Ll=function Ll(b,c){var d,e,f,g,h,i,j,k,l,m;i=OC(fS.OD,YS,5,b.o,15,1);h=kS.Pk(b,i,false,c);if(h<=1)return null;j=OC(fS.OD,YS,5,h,15,1);for(e=0;e<b.d;e++)++j[i[e]];l=0;m=j[0];for(k=1;k<h;k++){if(m<j[k]){m=j[k];l=k}}for(d=0;d<b.o;d++)i[d]!=l&&(b.A[d]=-1);for(g=0;g<b.p;g++)(!c&&b.F[g]==32||i[b.B[0][g]]!=l)&&(b.F[g]=128);f=kS.th(b);b.Q=0;try{kS.jk(b,true)}catch(a){a=GG(a);if(!AD(a,12))throw HG(a)}return f};kS.Ml=function Ml(a,b){var c;if((a.s[b]&OT)!=0)return true;if(a.A[b]==1)return false;return c=a.A[b],c==1||c>=5&&c<=9||c>=14&&c<=17||c>=32&&c<=35||c>=52&&c<=53||a.A[b]==13||a.A[b]>=171};kS.Nl=function Nl(a){var b,c,d,e,f,g,h,i,j;f=kS.ci(a,a.o,a.p,kS.bh);g=f*f/16;for(d=1;d<a.o;d++){for(e=0;e<d;e++){i=a.H[e].a-a.H[d].a;j=a.H[e].b-a.H[d].b;if(i*i+j*j<g)throw HG(new gS.FA('The distance between two atoms is too close.'))}}kS.Qo(a,1);b=0;for(c=0;c<a.d;c++){if(kS.Yk(a,c)>(h=kS.ui(a,c),h+kS.si(a,c,h)))throw HG(new gS.FA('atom valence exceeded'));b+=a.q[c]}if(b!=0)throw HG(new gS.FA('unbalanced atom charge'))};kS.Ol=function Ol(a,b,c){var d;d=kS.$j(a,b,c);if(d&&c==26){kS.Qo(a,3);d=d&(a.C[b]&128)==0}return d};kS.Pl=function Pl(a){var b,c,d,e,f,g,h,i,j,k,l,m;if(!a.I)return false;for(c=0;c<a.o;c++)kS.Yk(a,c)>=(m=kS.ui(a,c),m+kS.si(a,c,m))&&(a.w[c]&=-6145);e=false;for(b=0;b<a.d;b++){f=a.c[b]-a.g[b];if(!a.P&&f>0){if((a.w[b]&iT)==0){i=(a.w[b]&jT)==896?3:(a.w[b]&jT)==384?2:(a.w[b]&128)==128?1:0;g=(l=kS.ui(a,b),l+kS.si(a,b,l)-kS.Yk(a,b));a.q[b]==0&&(a.w[b]&lT)==0&&a.A[b]!=6&&++g;j=f;f>3-i&&(j=3-i);j>g+f-i&&(j=g+f-i);if(j>0){k=i==0?0:(a.w[b]&jT)<<j;k|=(j==3?7:f==2?3:1)<<7;a.w[b]&=-1921;a.w[b]|=jT&k}}for(h=a.g[b];h<a.c[b];h++){d=a.i[b][h];if(a.F[d]==1){a.A[a.f[b][h]]=-1;a.F[d]=128;e=true}}}(a.w[b]&2)!=0&&(a.w[b]&=-9);a.q[b]!=0&&(a.s[b]&=-234881025)}e&&kS.th(a);return e};kS.Ql=function Ql(a,b){kS.bk.call(this,a,b)};kS.Rl=function Rl(a){kS.bk.call(this,!a?256:a.K,!a?256:a.L);!!a&&kS.xh(a,this)};nH(58,51,{58:1,51:1,4:1});_.gb=function Sl(a){kS.nk(this,a)};_.d=0;_.e=0;fS.hE=YI(58);kS.Tl=function Tl(a,b){return $wnd.Math.pow(10,$wnd.Math.log(2000)*$wnd.Math.LOG10E*a/(b-1)-1)};kS.Ul=function Ul(a,b){var c,d;c=b;d=0;while(b!=0){if(a.c==0){a.e=(a.a[++a.d]&63)<<11;a.c=6}d|=(SS&a.e)>>16-c+b;a.e<<=1;--b;--a.c}return d};kS.Vl=function Vl(a,b,c){a.c=6;a.d=c;a.a=b;a.e=(b[a.d]&63)<<11};kS.Wl=function Wl(a,b){var c,d,e,f;d=b/2|0;e=a>=d;e&&(a-=d);f=b/32|0;c=f*a/(d-a);return e?-c:c};kS.Xl=function Xl(a,b){var c;return b==null||gS.GK(b).length==0?null:kS.Zl(a,jS.rR((c=b,jS.mR(),c)),null)};kS.Yl=function Yl(a,b,c){var d,e;return b==null?null:kS.Zl(a,jS.rR((e=b,jS.mR(),e)),c==null?null:jS.rR((d=c,d)))};kS.Zl=function Zl(a,b,c){var d,e,f,g,h;if(b==null)return null;kS.Vl(a,b,0);d=kS.Ul(a,4);g=kS.Ul(a,4);d>8&&(d=g);e=kS.Ul(a,d);f=kS.Ul(a,g);h=new kS.ep(e,f);kS.$l(a,h,b,c);return h};kS.$l=function $l(b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,$,ab,bb,cb,db,eb,fb,gb,hb,ib,jb,kb,lb,mb,nb,ob,pb,qb,rb,sb,tb,ub,vb,wb,xb,yb,zb,Ab,Bb,Cb,Db,Eb,Fb,Gb,Hb,Ib,Jb,Kb,Lb,Mb,Nb,Ob,Pb,Qb,Rb,Sb,Tb,Ub,Vb,Wb,Xb,Yb,Zb,$b,_b,ac,bc,cc,dc,ec,fc,gc,hc,ic,jc,kc,lc,mc,nc,oc;ic=8;b.f=c;kS.Fh(b.f);if(d==null||d.length==0)return;e!=null&&e.length==0&&(e=null);kS.Vl(b,d,0);h=kS.Ul(b,4);A=kS.Ul(b,4);if(h>8){ic=h;h=A}if(h==0){kS.Pj(b.f,kS.Ul(b,1)==1);return}i=kS.Ul(b,h);j=kS.Ul(b,A);Zb=kS.Ul(b,h);bc=kS.Ul(b,h);ac=kS.Ul(b,h);L=kS.Ul(b,h);for(n=0;n<i;n++)kS.fh(b.f,6);for(gb=0;gb<Zb;gb++)kS.Dj(b.f,kS.Ul(b,h),7);for(hb=0;hb<bc;hb++)kS.Dj(b.f,kS.Ul(b,h),8);for(sb=0;sb<ac;sb++)kS.Dj(b.f,kS.Ul(b,h),kS.Ul(b,8));for(Db=0;Db<L;Db++)kS.kj(b.f,kS.Ul(b,h),kS.Ul(b,4)-8);M=1+j-i;T=kS.Ul(b,4);w=0;kS.Aj(b.f,0,0);kS.Bj(b.f,0,0);kS.Cj(b.f,0,0);U=e!=null&&e[0]>=39;hc=0;kc=0;mc=0;oc=0;P=false;Q=false;if(U){if(e.length>2*i-2&&e[2*i-2]==39||e.length>3*i-3&&e[3*i-3]==39){Q=true;P=e.length==3*i-3+9;Pb=P?3*i-3:2*i-2;v=86*(e[Pb+1]-40)+e[Pb+2]-40;hc=$wnd.Math.pow(10,v/2000-1);Pb+=2;jc=86*(e[Pb+1]-40)+e[Pb+2]-40;kc=$wnd.Math.pow(10,jc/1500-1);Pb+=2;lc=86*(e[Pb+1]-40)+e[Pb+2]-40;mc=$wnd.Math.pow(10,lc/1500-1);if(P){Pb+=2;nc=86*(e[Pb+1]-40)+e[Pb+2]-40;oc=$wnd.Math.pow(10,nc/1500-1)}}else{P=e.length==3*i-3}}if(b.b&&P){e=null;U=false}for(Jb=1;Jb<i;Jb++){V=kS.Ul(b,T);if(V==0){if(U){kS.Aj(b.f,Jb,kS.Zh(b.f,0)+8*(e[Jb*2-2]-83));kS.Bj(b.f,Jb,kS.$h(b.f,0)+8*(e[Jb*2-1]-83));P&&kS.Cj(b.f,Jb,kS._h(b.f,0)+8*(e[2*i-3+Jb]-83))}++M;continue}w+=V-1;if(U){kS.Aj(b.f,Jb,kS.Zh(b.f,w)+e[Jb*2-2]-83);kS.Bj(b.f,Jb,kS.$h(b.f,w)+e[Jb*2-1]-83);P&&kS.Cj(b.f,Jb,kS._h(b.f,w)+(e[2*i-3+Jb]-83))}kS.hh(b.f,w,Jb,1)}for(Kb=0;Kb<M;Kb++)kS.hh(b.f,kS.Ul(b,h),kS.Ul(b,h),1);Rb=OC(fS.CG,aT,5,j,16,1);for(G=0;G<j;G++){H=kS.Ul(b,2);switch(H){case 0:Rb[G]=true;break;case 2:kS.Nj(b.f,G,2);break;case 3:kS.Nj(b.f,G,4);}}g=kS.Ul(b,h);for(Lb=0;Lb<g;Lb++){m=kS.Ul(b,h);if(ic==8){cc=kS.Ul(b,2);if(cc==3){kS.pj(b.f,m,1,0);kS.vj(b.f,m,1,false)}else{kS.vj(b.f,m,cc,false)}}else{cc=kS.Ul(b,3);switch(cc){case 4:kS.vj(b.f,m,1,false);kS.pj(b.f,m,1,kS.Ul(b,3));break;case 5:kS.vj(b.f,m,2,false);kS.pj(b.f,m,1,kS.Ul(b,3));break;case 6:kS.vj(b.f,m,1,false);kS.pj(b.f,m,2,kS.Ul(b,3));break;case 7:kS.vj(b.f,m,2,false);kS.pj(b.f,m,2,kS.Ul(b,3));break;default:kS.vj(b.f,m,cc,false);}}}ic==8&&kS.Ul(b,1)==0&&(b.f.J=true);f=kS.Ul(b,A);for(Mb=0;Mb<f;Mb++){C=kS.Ul(b,A);if(kS.pi(b.f,C)==1){cc=kS.Ul(b,3);switch(cc){case 4:kS.Kj(b.f,C,1,false);kS.Hj(b.f,C,1,kS.Ul(b,3));break;case 5:kS.Kj(b.f,C,2,false);kS.Hj(b.f,C,1,kS.Ul(b,3));break;case 6:kS.Kj(b.f,C,1,false);kS.Hj(b.f,C,2,kS.Ul(b,3));break;case 7:kS.Kj(b.f,C,2,false);kS.Hj(b.f,C,2,kS.Ul(b,3));break;default:kS.Kj(b.f,C,cc,false);}}else{kS.Kj(b.f,C,kS.Ul(b,2),false)}}kS.Pj(b.f,kS.Ul(b,1)==1);l=null;_b=0;while(kS.Ul(b,1)==1){S=_b+kS.Ul(b,4);switch(S){case 0:$b=kS.Ul(b,h);for(Nb=0;Nb<$b;Nb++){m=kS.Ul(b,h);kS.wj(b.f,m,iT,true)}break;case 1:$b=kS.Ul(b,h);for(Ob=0;Ob<$b;Ob++){m=kS.Ul(b,h);Xb=kS.Ul(b,8);kS.uj(b.f,m,Xb)}break;case 2:$b=kS.Ul(b,A);for(ib=0;ib<$b;ib++){C=kS.Ul(b,A);kS.Nj(b.f,C,64)}break;case 3:$b=kS.Ul(b,h);for(jb=0;jb<$b;jb++){m=kS.Ul(b,h);kS.wj(b.f,m,hT,true)}break;case 4:$b=kS.Ul(b,h);for(kb=0;kb<$b;kb++){m=kS.Ul(b,h);gc=kS.Ul(b,4)<<3;kS.wj(b.f,m,gc,true)}break;case 5:$b=kS.Ul(b,h);for(lb=0;lb<$b;lb++){m=kS.Ul(b,h);k=kS.Ul(b,2)<<1;kS.wj(b.f,m,k,true)}break;case 6:$b=kS.Ul(b,h);for(mb=0;mb<$b;mb++){m=kS.Ul(b,h);kS.wj(b.f,m,1,true)}break;case 7:$b=kS.Ul(b,h);for(nb=0;nb<$b;nb++){m=kS.Ul(b,h);db=kS.Ul(b,4)<<7;kS.wj(b.f,m,db,true)}break;case 8:$b=kS.Ul(b,h);for(ob=0;ob<$b;ob++){m=kS.Ul(b,h);s=kS.Ul(b,4);q=OC(fS.OD,YS,5,s,15,1);for(Sb=0;Sb<s;Sb++){r=kS.Ul(b,8);q[Sb]=r}kS.qj(b.f,m,q)}break;case 9:$b=kS.Ul(b,A);for(pb=0;pb<$b;pb++){C=kS.Ul(b,A);gc=kS.Ul(b,2)<<5;kS.Mj(b.f,C,gc,true)}break;case 10:$b=kS.Ul(b,A);for(qb=0;qb<$b;qb++){C=kS.Ul(b,A);I=kS.Ul(b,5);kS.Mj(b.f,C,I,true)}break;case 11:$b=kS.Ul(b,h);for(rb=0;rb<$b;rb++){m=kS.Ul(b,h);kS.wj(b.f,m,JT,true)}break;case 12:$b=kS.Ul(b,A);for(tb=0;tb<$b;tb++){C=kS.Ul(b,A);J=kS.Ul(b,8)<<7;kS.Mj(b.f,C,J,true)}break;case 13:$b=kS.Ul(b,h);for(ub=0;ub<$b;ub++){m=kS.Ul(b,h);dc=kS.Ul(b,3)<<14;kS.wj(b.f,m,dc,true)}break;case 14:$b=kS.Ul(b,h);for(vb=0;vb<$b;vb++){m=kS.Ul(b,h);Yb=kS.Ul(b,5)<<17;kS.wj(b.f,m,Yb,true)}break;case 15:_b=16;break;case 16:$b=kS.Ul(b,h);for(wb=0;wb<$b;wb++){m=kS.Ul(b,h);fc=kS.Ul(b,3)<<22;kS.wj(b.f,m,fc,true)}break;case 17:$b=kS.Ul(b,h);for(xb=0;xb<$b;xb++){m=kS.Ul(b,h);kS.ij(b.f,m,kS.Ul(b,4))}break;case 18:$b=kS.Ul(b,h);Wb=kS.Ul(b,4);for(yb=0;yb<$b;yb++){m=kS.Ul(b,h);R=kS.Ul(b,Wb);Tb=OC(fS.KD,HT,5,R,15,1);for(Sb=0;Sb<R;Sb++)Tb[Sb]=kS.Ul(b,7)<<24>>24;kS.nj(b.f,m,gS.HK(jS.pR(Tb,0,(Ub=Tb.length,jS.mR(),Ub))))}break;case 19:$b=kS.Ul(b,h);for(zb=0;zb<$b;zb++){m=kS.Ul(b,h);K=kS.Ul(b,3)<<25;kS.wj(b.f,m,K,true)}break;case 20:$b=kS.Ul(b,A);for(Ab=0;Ab<$b;Ab++){C=kS.Ul(b,A);fc=kS.Ul(b,3)<<15;kS.Mj(b.f,C,fc,true)}break;case 21:$b=kS.Ul(b,h);for(Bb=0;Bb<$b;Bb++){m=kS.Ul(b,h);kS.xj(b.f,m,kS.Ul(b,2)<<4)}break;case 22:$b=kS.Ul(b,h);for(Cb=0;Cb<$b;Cb++){m=kS.Ul(b,h);kS.wj(b.f,m,uT,true)}break;case 23:$b=kS.Ul(b,A);for(Eb=0;Eb<$b;Eb++){C=kS.Ul(b,A);kS.Mj(b.f,C,CT,true)}break;case 24:$b=kS.Ul(b,A);for(Fb=0;Fb<$b;Fb++){C=kS.Ul(b,A);k=kS.Ul(b,2)<<19;kS.Mj(b.f,C,k,true)}break;case 25:for(Gb=0;Gb<i;Gb++)kS.Ul(b,1)==1&&kS.yj(b.f,Gb,true);break;case 26:$b=kS.Ul(b,A);l=OC(fS.OD,YS,5,$b,15,1);for(Hb=0;Hb<$b;Hb++)l[Hb]=kS.Ul(b,A);break;case 27:$b=kS.Ul(b,h);for(Ib=0;Ib<$b;Ib++){m=kS.Ul(b,h);kS.wj(b.f,m,bT,true)}break;case 28:$b=kS.Ul(b,A);for(fb=0;fb<$b;fb++)kS.Nj(b.f,kS.Ul(b,A),32);}}kS.Yd(new kS.fe(b.f),Rb,false);if(l!=null)for(D=0,F=l.length;D<F;++D){C=l[D];kS.Nj(b.f,C,kS.pi(b.f,C)==2?4:2)}N=0;if(e==null&&d.length>b.d+1&&(d[b.d+1]==32||d[b.d+1]==9)){e=d;N=b.d+2}if(e!=null){try{if(e[N]==33||e[N]==35){kS.Vl(b,e,N+1);P=kS.Ul(b,1)==1;Q=kS.Ul(b,1)==1;ec=2*kS.Ul(b,4);B=1<<ec;C=0;for(o=1;o<i;o++){if(C<j&&kS.ei(b.f,1,C)==o){bb=kS.ei(b.f,0,C++);ab=1}else{bb=0;ab=8}kS.Aj(b.f,o,kS.Zh(b.f,bb)+ab*(kS.Ul(b,ec)-(B/2|0)));kS.Bj(b.f,o,kS.$h(b.f,bb)+ab*(kS.Ul(b,ec)-(B/2|0)));P&&kS.Cj(b.f,o,kS._h(b.f,bb)+ab*(kS.Ul(b,ec)-(B/2|0)))}u=P?1.5:(kS.dh(),kS.dh(),kS.bh);t=kS.ci(b.f,i,j,u);if(e[N]==35){eb=0;cb=OC(fS.OD,YS,5,i,15,1);for(p=0;p<i;p++)eb+=cb[p]=kS.Tk(b.f,p);for(m=0;m<i;m++){for(fb=0;fb<cb[m];fb++){db=kS.fh(b.f,1);kS.hh(b.f,m,db,1);kS.Aj(b.f,db,kS.Zh(b.f,m)+(kS.Ul(b,ec)-(B/2|0)));kS.Bj(b.f,db,kS.$h(b.f,m)+(kS.Ul(b,ec)-(B/2|0)));P&&kS.Cj(b.f,db,kS._h(b.f,m)+(kS.Ul(b,ec)-(B/2|0)))}}i+=eb;j+=eb}if(Q){hc=kS.Tl(kS.Ul(b,ec),B);kc=hc*kS.Wl(kS.Ul(b,ec),B);mc=hc*kS.Wl(kS.Ul(b,ec),B);P&&(oc=hc*kS.Wl(kS.Ul(b,ec),B));ab=hc/t;for(m=0;m<i;m++){kS.Aj(b.f,m,kc+ab*kS.Zh(b.f,m));kS.Bj(b.f,m,mc+ab*kS.$h(b.f,m));P&&kS.Cj(b.f,m,oc+ab*kS._h(b.f,m))}}else{ab=1.5/t;for(m=0;m<i;m++){kS.Aj(b.f,m,ab*kS.Zh(b.f,m));kS.Bj(b.f,m,ab*kS.$h(b.f,m));P&&kS.Cj(b.f,m,ab*kS._h(b.f,m))}}}else{P&&!Q&&hc==0&&(hc=1.5);if(hc!=0&&b.f.p!=0){t=0;for(C=0;C<b.f.p;C++){W=kS.Zh(b.f,kS.ei(b.f,0,C))-kS.Zh(b.f,kS.ei(b.f,1,C));X=kS.$h(b.f,kS.ei(b.f,0,C))-kS.$h(b.f,kS.ei(b.f,1,C));Y=P?kS._h(b.f,kS.ei(b.f,0,C))-kS._h(b.f,kS.ei(b.f,1,C)):0;t+=$wnd.Math.sqrt(W*W+X*X+Y*Y)}t/=b.f.p;$=hc/t;for(m=0;m<b.f.o;m++){kS.Aj(b.f,m,kS.Zh(b.f,m)*$+kc);kS.Bj(b.f,m,kS.$h(b.f,m)*$+mc);P&&kS.Cj(b.f,m,kS._h(b.f,m)*$+oc)}}}}catch(a){a=GG(a);if(AD(a,12)){Z=a;gS.qA(Z,(gS.WK(),gS.VK),'');'Faulty id-coordinates:'+gS.uA(Z,Z.lb())+' '+gS.HK(jS.pR(d,0,(Vb=d.length,jS.mR(),Vb)))+' '+gS.HK(jS.pR(e,0,(Ub=e.length,Ub)));e=null;P=false}else throw HG(a)}}O=e!=null&&!P;if(O||b.b){kS.Qo(b.f,3);for(C=0;C<b.f.e;C++)kS.mi(b.f,C)==2&&!kS.yl(b.f,C)&&kS.ni(b.f,C)==0&&kS.Lj(b.f,C)}if(!O&&b.b){kS.Hl(b.f,0);try{Qb=new mS.rq;Qb.g=new AS.nP(78187493520);mS.bq(Qb,b.f);O=true}catch(a){a=GG(a);if(AD(a,12)){Z=a;gS.qA(Z,(gS.WK(),gS.VK),'');'2D-coordinate creation failed:'+gS.uA(Z,Z.lb())+' '+gS.HK(jS.pR(d,0,(Ub=d.length,jS.mR(),Ub)))}else throw HG(a)}}if(O){kS.Kl(b.f);kS.ap(b.f)}else P||kS.Hl(b.f,0)};kS._l=function _l(a){this.b=a};nH(47,1,{},kS._l);_.b=false;_.c=0;_.d=0;_.e=0;fS.iE=YI(47);kS.am=function am(a,b){this.b=a;this.a=b};nH(3,1,{3:1},kS.am);_.a=0;_.b=0;fS.jE=YI(3);
kS.cm=function cm(){kS.cm=pH;kS.bm=WC(IC(fS.jE,2),FS,9,0,[null,WC(IC(fS.jE,1),$T,3,0,[new kS.am(0,1.007825032),new kS.am(1,2.014101778),new kS.am(2,3.016049268),new kS.am(3,4.027834627),new kS.am(4,5.039542911),new kS.am(5,6.044942608)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(1,3.01602931),new kS.am(2,4.00260325),new kS.am(3,5.012223628),new kS.am(4,6.018888072),new kS.am(5,7.028030527),new kS.am(6,8.033921838),new kS.am(7,9.043820323),new kS.am(8,10.052399713)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(1,4.027182329),new kS.am(2,5.012537796),new kS.am(3,6.015122281),new kS.am(4,7.016004049),new kS.am(5,8.02248667),new kS.am(6,9.026789122),new kS.am(7,10.035480884),new kS.am(8,11.043796166),new kS.am(9,12.05378)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(1,5.04079),new kS.am(2,6.019725804),new kS.am(3,7.016929246),new kS.am(4,8.005305094),new kS.am(5,9.012182135),new kS.am(6,10.01353372),new kS.am(7,11.021657653),new kS.am(8,12.026920631),new kS.am(9,13.036133834),new kS.am(10,14.042815522)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(2,7.029917389),new kS.am(3,8.024606713),new kS.am(4,9.013328806),new kS.am(5,10.012937027),new kS.am(6,11.009305466),new kS.am(7,12.014352109),new kS.am(8,13.017780267),new kS.am(9,14.025404064),new kS.am(10,15.031097291),new kS.am(11,16.039808836),new kS.am(12,17.046931399),new kS.am(13,18.05617),new kS.am(14,19.06373)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(2,8.037675026),new kS.am(3,9.031040087),new kS.am(4,10.01685311),new kS.am(5,11.011433818),new kS.am(6,12),new kS.am(7,13.003354838),new kS.am(8,14.003241988),new kS.am(9,15.010599258),new kS.am(10,16.014701243),new kS.am(11,17.022583712),new kS.am(12,18.026757058),new kS.am(13,19.035248094),new kS.am(14,20.040322395),new kS.am(15,21.04934),new kS.am(16,22.05645)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(3,10.042618),new kS.am(4,11.026796226),new kS.am(5,12.018613202),new kS.am(6,13.005738584),new kS.am(7,14.003074005),new kS.am(8,15.000108898),new kS.am(9,16.006101417),new kS.am(10,17.008449673),new kS.am(11,18.014081827),new kS.am(12,19.017026896),new kS.am(13,20.023367295),new kS.am(14,21.027087574),new kS.am(15,22.034440259),new kS.am(16,23.04051),new kS.am(17,24.0505)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(4,12.034404776),new kS.am(5,13.0248104),new kS.am(6,14.008595285),new kS.am(7,15.003065386),new kS.am(8,15.994914622),new kS.am(9,16.999131501),new kS.am(10,17.999160419),new kS.am(11,19.00357873),new kS.am(12,20.00407615),new kS.am(13,21.008654631),new kS.am(14,22.009967157),new kS.am(15,23.015691325),new kS.am(16,24.020369922),new kS.am(17,25.02914),new kS.am(18,26.03775)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(5,14.03608),new kS.am(6,15.018010856),new kS.am(7,16.01146573),new kS.am(8,17.002095238),new kS.am(9,18.000937667),new kS.am(10,18.998403205),new kS.am(11,19.999981324),new kS.am(12,20.999948921),new kS.am(13,22.00299925),new kS.am(14,23.003574385),new kS.am(15,24.008099371),new kS.am(16,25.012094963),new kS.am(17,26.019633157),new kS.am(18,27.026892316),new kS.am(19,28.03567),new kS.am(20,29.04326)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(6,16.025756907),new kS.am(7,17.017697565),new kS.am(8,18.005697066),new kS.am(9,19.001879839),new kS.am(10,19.992440176),new kS.am(11,20.993846744),new kS.am(12,21.99138551),new kS.am(13,22.994467337),new kS.am(14,23.993615074),new kS.am(15,24.997789899),new kS.am(16,26.000461498),new kS.am(17,27.0076152),new kS.am(18,28.012108072),new kS.am(19,29.019345902),new kS.am(20,30.023872),new kS.am(21,31.03311),new kS.am(22,32.03991)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(7,18.02718),new kS.am(8,19.01387945),new kS.am(9,20.00734826),new kS.am(10,20.997655099),new kS.am(11,21.994436782),new kS.am(12,22.989769675),new kS.am(13,23.990963332),new kS.am(14,24.989954352),new kS.am(15,25.992589898),new kS.am(16,26.994008702),new kS.am(17,27.99889041),new kS.am(18,29.002811301),new kS.am(19,30.009226487),new kS.am(20,31.013595108),new kS.am(21,32.019649792),new kS.am(22,33.027386),new kS.am(23,34.0349),new kS.am(24,35.04418)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(8,20.018862744),new kS.am(9,21.011714174),new kS.am(10,21.999574055),new kS.am(11,22.99412485),new kS.am(12,23.985041898),new kS.am(13,24.985837023),new kS.am(14,25.98259304),new kS.am(15,26.984340742),new kS.am(16,27.983876703),new kS.am(17,28.988554743),new kS.am(18,29.990464529),new kS.am(19,30.996548459),new kS.am(20,31.999145889),new kS.am(21,33.005586975),new kS.am(22,34.00907244),new kS.am(23,35.018669),new kS.am(24,36.02245),new kS.am(25,37.03124)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(8,21.02804),new kS.am(9,22.01952),new kS.am(10,23.0072649),new kS.am(11,23.999940911),new kS.am(12,24.990428555),new kS.am(13,25.986891659),new kS.am(14,26.981538441),new kS.am(15,27.981910184),new kS.am(16,28.980444848),new kS.am(17,29.982960304),new kS.am(18,30.983946023),new kS.am(19,31.988124379),new kS.am(20,32.990869587),new kS.am(21,33.996927255),new kS.am(22,34.99993765),new kS.am(23,36.006351501),new kS.am(24,37.01031),new kS.am(25,38.0169),new kS.am(26,39.0219)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(8,22.03453),new kS.am(9,23.02552),new kS.am(10,24.011545711),new kS.am(11,25.00410664),new kS.am(12,25.992329935),new kS.am(13,26.986704764),new kS.am(14,27.976926533),new kS.am(15,28.976494719),new kS.am(16,29.973770218),new kS.am(17,30.975363275),new kS.am(18,31.974148129),new kS.am(19,32.97800052),new kS.am(20,33.978575745),new kS.am(21,34.984584158),new kS.am(22,35.986687363),new kS.am(23,36.99299599),new kS.am(24,37.99598),new kS.am(25,39.0023),new kS.am(26,40.0058),new kS.am(27,41.0127),new kS.am(28,42.0161)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(9,24.03435),new kS.am(10,25.02026),new kS.am(11,26.01178),new kS.am(12,26.999191645),new kS.am(13,27.99231233),new kS.am(14,28.981801376),new kS.am(15,29.978313807),new kS.am(16,30.973761512),new kS.am(17,31.973907163),new kS.am(18,32.971725281),new kS.am(19,33.973636381),new kS.am(20,34.973314249),new kS.am(21,35.978259824),new kS.am(22,36.979608338),new kS.am(23,37.98447),new kS.am(24,38.98642),new kS.am(25,39.99105),new kS.am(26,40.9948),new kS.am(27,42.00009),new kS.am(28,43.00331),new kS.am(29,44.00988),new kS.am(30,45.01514),new kS.am(31,46.02383)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(10,26.02788),new kS.am(11,27.018795),new kS.am(12,28.004372661),new kS.am(13,28.996608805),new kS.am(14,29.984902954),new kS.am(15,30.979554421),new kS.am(16,31.97207069),new kS.am(17,32.971458497),new kS.am(18,33.967866831),new kS.am(19,34.96903214),new kS.am(20,35.96708088),new kS.am(21,36.971125716),new kS.am(22,37.971163443),new kS.am(23,38.975135275),new kS.am(24,39.97547),new kS.am(25,40.98003),new kS.am(26,41.98149),new kS.am(27,42.9866),new kS.am(28,43.98832),new kS.am(29,44.99482),new kS.am(30,45.99957),new kS.am(31,47.00762),new kS.am(32,48.01299),new kS.am(33,49.02201)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(11,28.02851),new kS.am(12,29.01411),new kS.am(13,30.00477),new kS.am(14,30.992416014),new kS.am(15,31.985688908),new kS.am(16,32.977451798),new kS.am(17,33.973761967),new kS.am(18,34.968852707),new kS.am(19,35.968306945),new kS.am(20,36.9659026),new kS.am(21,37.96801055),new kS.am(22,38.968007677),new kS.am(23,39.970415555),new kS.am(24,40.970650212),new kS.am(25,41.973174994),new kS.am(26,42.974203385),new kS.am(27,43.978538712),new kS.am(28,44.9797),new kS.am(29,45.98412),new kS.am(30,46.98795),new kS.am(31,47.99485),new kS.am(32,48.99989),new kS.am(33,50.00773),new kS.am(34,51.01353)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(12,30.02156),new kS.am(13,31.012126),new kS.am(14,31.99766066),new kS.am(15,32.989928719),new kS.am(16,33.980270118),new kS.am(17,34.975256726),new kS.am(18,35.967546282),new kS.am(19,36.966775912),new kS.am(20,37.962732161),new kS.am(21,38.964313413),new kS.am(22,39.962383123),new kS.am(23,40.964500828),new kS.am(24,41.963046386),new kS.am(25,42.965670701),new kS.am(26,43.965365269),new kS.am(27,44.968094979),new kS.am(28,45.968093467),new kS.am(29,46.972186238),new kS.am(30,47.97507),new kS.am(31,48.98218),new kS.am(32,49.98594),new kS.am(33,50.99324),new kS.am(34,51.99817),new kS.am(35,53.006227)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(13,32.02192),new kS.am(14,33.00726),new kS.am(15,33.99841),new kS.am(16,34.988011615),new kS.am(17,35.981293405),new kS.am(18,36.973376915),new kS.am(19,37.969080107),new kS.am(20,38.963706861),new kS.am(21,39.963998672),new kS.am(22,40.961825972),new kS.am(23,41.962403059),new kS.am(24,42.960715746),new kS.am(25,43.961556146),new kS.am(26,44.960699658),new kS.am(27,45.961976203),new kS.am(28,46.961677807),new kS.am(29,47.965512946),new kS.am(30,48.967450084),new kS.am(31,49.972782832),new kS.am(32,50.97638),new kS.am(33,51.98261),new kS.am(34,52.98712),new kS.am(35,53.99399),new kS.am(36,54.999388)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(14,34.01412),new kS.am(15,35.004765),new kS.am(16,35.993087234),new kS.am(17,36.985871505),new kS.am(18,37.976318637),new kS.am(19,38.970717729),new kS.am(20,39.962591155),new kS.am(21,40.962278349),new kS.am(22,41.958618337),new kS.am(23,42.958766833),new kS.am(24,43.955481094),new kS.am(25,44.956185938),new kS.am(26,45.953692759),new kS.am(27,46.954546459),new kS.am(28,47.952533512),new kS.am(29,48.955673302),new kS.am(30,49.957518286),new kS.am(31,50.961474238),new kS.am(32,51.9651),new kS.am(33,52.97005),new kS.am(34,53.97468),new kS.am(35,54.98055),new kS.am(36,55.98579),new kS.am(37,56.992356)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(15,36.01492),new kS.am(16,37.00305),new kS.am(17,37.9947),new kS.am(18,38.984790009),new kS.am(19,39.977964014),new kS.am(20,40.969251316),new kS.am(21,41.965516761),new kS.am(22,42.96115098),new kS.am(23,43.959403048),new kS.am(24,44.955910243),new kS.am(25,45.95517025),new kS.am(26,46.952408027),new kS.am(27,47.952234991),new kS.am(28,48.950024065),new kS.am(29,49.952187008),new kS.am(30,50.9536027),new kS.am(31,51.95665),new kS.am(32,52.95817),new kS.am(33,53.963),new kS.am(34,54.9694),new kS.am(35,55.97266),new kS.am(36,56.97704),new kS.am(37,57.98307),new kS.am(38,58.988041)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(16,38.00977),new kS.am(17,39.001323),new kS.am(18,39.990498907),new kS.am(19,40.983131),new kS.am(20,41.973031622),new kS.am(21,42.968523342),new kS.am(22,43.959690235),new kS.am(23,44.958124349),new kS.am(24,45.952629491),new kS.am(25,46.951763792),new kS.am(26,47.947947053),new kS.am(27,48.947870789),new kS.am(28,49.944792069),new kS.am(29,50.946616017),new kS.am(30,51.946898175),new kS.am(31,52.949731709),new kS.am(32,53.95087),new kS.am(33,54.95512),new kS.am(34,55.95799),new kS.am(35,56.9643),new kS.am(36,57.96611),new kS.am(37,58.97196),new kS.am(38,59.97564),new kS.am(39,60.982018)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(17,40.01109),new kS.am(18,40.99974),new kS.am(19,41.99123),new kS.am(20,42.98065),new kS.am(21,43.9744),new kS.am(22,44.965782286),new kS.am(23,45.960199491),new kS.am(24,46.954906918),new kS.am(25,47.95225448),new kS.am(26,48.948516914),new kS.am(27,49.947162792),new kS.am(28,50.943963675),new kS.am(29,51.944779658),new kS.am(30,52.944342517),new kS.am(31,53.946444381),new kS.am(32,54.947238194),new kS.am(33,55.95036),new kS.am(34,56.95236),new kS.am(35,57.95665),new kS.am(36,58.9593),new kS.am(37,59.9645),new kS.am(38,60.96741),new kS.am(39,61.97314),new kS.am(40,62.97675)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(18,42.00643),new kS.am(19,42.997707),new kS.am(20,43.98547),new kS.am(21,44.97916),new kS.am(22,45.968361649),new kS.am(23,46.962906512),new kS.am(24,47.954035861),new kS.am(25,48.951341135),new kS.am(26,49.946049607),new kS.am(27,50.944771767),new kS.am(28,51.940511904),new kS.am(29,52.940653781),new kS.am(30,53.938884921),new kS.am(31,54.940844164),new kS.am(32,55.940645238),new kS.am(33,56.9437538),new kS.am(34,57.94425),new kS.am(35,58.94863),new kS.am(36,59.94973),new kS.am(37,60.95409),new kS.am(38,61.9558),new kS.am(39,62.96186),new kS.am(40,63.9642),new kS.am(41,64.97037)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(19,44.00687),new kS.am(20,44.99451),new kS.am(21,45.98672),new kS.am(22,46.9761),new kS.am(23,47.96887),new kS.am(24,48.959623415),new kS.am(25,49.95424396),new kS.am(26,50.948215487),new kS.am(27,51.945570079),new kS.am(28,52.941294702),new kS.am(29,53.940363247),new kS.am(30,54.938049636),new kS.am(31,55.938909366),new kS.am(32,56.938287458),new kS.am(33,57.939986451),new kS.am(34,58.940447166),new kS.am(35,59.943193998),new kS.am(36,60.94446),new kS.am(37,61.94797),new kS.am(38,62.94981),new kS.am(39,63.95373),new kS.am(40,64.9561),new kS.am(41,65.96082),new kS.am(42,66.96382)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(19,45.01456),new kS.am(20,46.00081),new kS.am(21,46.99289),new kS.am(22,47.98056),new kS.am(23,48.97361),new kS.am(24,49.962993316),new kS.am(25,50.956824936),new kS.am(26,51.948116526),new kS.am(27,52.945312282),new kS.am(28,53.939614836),new kS.am(29,54.938298029),new kS.am(30,55.934942133),new kS.am(31,56.935398707),new kS.am(32,57.933280458),new kS.am(33,58.934880493),new kS.am(34,59.934076943),new kS.am(35,60.936749461),new kS.am(36,61.936770495),new kS.am(37,62.940118442),new kS.am(38,63.94087),new kS.am(39,64.94494),new kS.am(40,65.94598),new kS.am(41,66.95),new kS.am(42,67.95251),new kS.am(43,68.9577)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(21,48.00176),new kS.am(22,48.98972),new kS.am(23,49.98154),new kS.am(24,50.97072),new kS.am(25,51.96359),new kS.am(26,52.954224985),new kS.am(27,53.948464147),new kS.am(28,54.942003149),new kS.am(29,55.939843937),new kS.am(30,56.936296235),new kS.am(31,57.935757571),new kS.am(32,58.933200194),new kS.am(33,59.933822196),new kS.am(34,60.932479381),new kS.am(35,61.934054212),new kS.am(36,62.933615218),new kS.am(37,63.935813523),new kS.am(38,64.936484581),new kS.am(39,65.939825412),new kS.am(40,66.94061),new kS.am(41,67.94436),new kS.am(42,68.9452),new kS.am(43,69.94981),new kS.am(44,70.95173),new kS.am(45,71.95641)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(22,49.99593),new kS.am(23,50.98772),new kS.am(24,51.97568),new kS.am(25,52.96846),new kS.am(26,53.957910508),new kS.am(27,54.951336329),new kS.am(28,55.942136339),new kS.am(29,56.939800489),new kS.am(30,57.935347922),new kS.am(31,58.934351553),new kS.am(32,59.930790633),new kS.am(33,60.931060442),new kS.am(34,61.928348763),new kS.am(35,62.929672948),new kS.am(36,63.927969574),new kS.am(37,64.930088013),new kS.am(38,65.929115232),new kS.am(39,66.931569638),new kS.am(40,67.931844932),new kS.am(41,68.935181837),new kS.am(42,69.93614),new kS.am(43,70.94),new kS.am(44,71.9413),new kS.am(45,72.94608),new kS.am(46,73.94791),new kS.am(47,74.95297),new kS.am(48,75.95533),new kS.am(49,76.96083),new kS.am(50,77.9638)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(23,51.99718),new kS.am(24,52.98555),new kS.am(25,53.97671),new kS.am(26,54.96605),new kS.am(27,55.95856),new kS.am(28,56.949215695),new kS.am(29,57.944540734),new kS.am(30,58.939504114),new kS.am(31,59.937368123),new kS.am(32,60.933462181),new kS.am(33,61.932587299),new kS.am(34,62.929601079),new kS.am(35,63.929767865),new kS.am(36,64.927793707),new kS.am(37,65.928873041),new kS.am(38,66.927750294),new kS.am(39,67.929637875),new kS.am(40,68.929425281),new kS.am(41,69.932409287),new kS.am(42,70.932619818),new kS.am(43,71.93552),new kS.am(44,72.93649),new kS.am(45,73.9402),new kS.am(46,74.9417),new kS.am(47,75.94599),new kS.am(48,76.94795),new kS.am(49,77.95281),new kS.am(50,78.95528),new kS.am(51,79.96189)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(24,53.99295),new kS.am(25,54.98398),new kS.am(26,55.97238),new kS.am(27,56.96491),new kS.am(28,57.954596465),new kS.am(29,58.949267074),new kS.am(30,59.941832031),new kS.am(31,60.939513907),new kS.am(32,61.934334132),new kS.am(33,62.933215563),new kS.am(34,63.929146578),new kS.am(35,64.929245079),new kS.am(36,65.926036763),new kS.am(37,66.927130859),new kS.am(38,67.924847566),new kS.am(39,68.926553538),new kS.am(40,69.92532487),new kS.am(41,70.927727195),new kS.am(42,71.926861122),new kS.am(43,72.929779469),new kS.am(44,73.929458261),new kS.am(45,74.932937379),new kS.am(46,75.933394207),new kS.am(47,76.937085857),new kS.am(48,77.938569576),new kS.am(49,78.942095175),new kS.am(50,79.944414722),new kS.am(51,80.95048),new kS.am(52,81.95484)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(25,55.99491),new kS.am(26,56.98293),new kS.am(27,57.97425),new kS.am(28,58.96337),new kS.am(29,59.95706),new kS.am(30,60.94917),new kS.am(31,61.944179608),new kS.am(32,62.939141527),new kS.am(33,63.936838307),new kS.am(34,64.932739322),new kS.am(35,65.931592355),new kS.am(36,66.928204915),new kS.am(37,67.927983497),new kS.am(38,68.925580912),new kS.am(39,69.926027741),new kS.am(40,70.92470501),new kS.am(41,71.92636935),new kS.am(42,72.925169832),new kS.am(43,73.926940999),new kS.am(44,74.926500645),new kS.am(45,75.928928262),new kS.am(46,76.929281189),new kS.am(47,77.93165595),new kS.am(48,78.932916371),new kS.am(49,79.936588154),new kS.am(50,80.937752955),new kS.am(51,81.94316),new kS.am(52,82.94687),new kS.am(53,83.95234)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(26,57.99101),new kS.am(27,58.98175),new kS.am(28,59.97019),new kS.am(29,60.96379),new kS.am(30,61.95465),new kS.am(31,62.94964),new kS.am(32,63.941572638),new kS.am(33,64.939440762),new kS.am(34,65.933846798),new kS.am(35,66.932738415),new kS.am(36,67.928097266),new kS.am(37,68.927972002),new kS.am(38,69.924250365),new kS.am(39,70.924953991),new kS.am(40,71.922076184),new kS.am(41,72.923459361),new kS.am(42,73.921178213),new kS.am(43,74.922859494),new kS.am(44,75.921402716),new kS.am(45,76.923548462),new kS.am(46,77.922852886),new kS.am(47,78.92540156),new kS.am(48,79.925444764),new kS.am(49,80.928821065),new kS.am(50,81.929550326),new kS.am(51,82.93451),new kS.am(52,83.93731),new kS.am(53,84.94269),new kS.am(54,85.94627)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(27,59.99313),new kS.am(28,60.98062),new kS.am(29,61.9732),new kS.am(30,62.96369),new kS.am(31,63.957572),new kS.am(32,64.949484),new kS.am(33,65.944099147),new kS.am(34,66.939190417),new kS.am(35,67.936792976),new kS.am(36,68.932280154),new kS.am(37,69.930927811),new kS.am(38,70.927114724),new kS.am(39,71.926752647),new kS.am(40,72.923825288),new kS.am(41,73.923929076),new kS.am(42,74.921596417),new kS.am(43,75.922393933),new kS.am(44,76.920647703),new kS.am(45,77.921828577),new kS.am(46,78.920948498),new kS.am(47,79.922578162),new kS.am(48,80.922132884),new kS.am(49,81.924504668),new kS.am(50,82.924980625),new kS.am(51,83.92906),new kS.am(52,84.93181),new kS.am(53,85.93623),new kS.am(54,86.93958),new kS.am(55,87.94456),new kS.am(56,88.94923)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(31,64.96466),new kS.am(32,65.95521),new kS.am(33,66.95009),new kS.am(34,67.94187),new kS.am(35,68.939562155),new kS.am(36,69.933504),new kS.am(37,70.931868378),new kS.am(38,71.927112313),new kS.am(39,72.9267668),new kS.am(40,73.922476561),new kS.am(41,74.922523571),new kS.am(42,75.919214107),new kS.am(43,76.91991461),new kS.am(44,77.917309522),new kS.am(45,78.918499802),new kS.am(46,79.916521828),new kS.am(47,80.917992931),new kS.am(48,81.9167),new kS.am(49,82.919119072),new kS.am(50,83.918464523),new kS.am(51,84.922244678),new kS.am(52,85.924271165),new kS.am(53,86.928520749),new kS.am(54,87.931423982),new kS.am(55,88.93602),new kS.am(56,89.93942),new kS.am(57,90.94537),new kS.am(58,91.94933)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(32,66.96479),new kS.am(33,67.958248),new kS.am(34,68.950178),new kS.am(35,69.944208),new kS.am(36,70.939246),new kS.am(37,71.936496876),new kS.am(38,72.931794889),new kS.am(39,73.929891152),new kS.am(40,74.92577641),new kS.am(41,75.924541974),new kS.am(42,76.921380123),new kS.am(43,77.92114613),new kS.am(44,78.918337647),new kS.am(45,79.918529952),new kS.am(46,80.91629106),new kS.am(47,81.916804666),new kS.am(48,82.915180219),new kS.am(49,83.916503685),new kS.am(50,84.915608027),new kS.am(51,85.918797162),new kS.am(52,86.920710713),new kS.am(53,87.924065908),new kS.am(54,88.92638726),new kS.am(55,89.930634988),new kS.am(56,90.9339653),new kS.am(57,91.939255258),new kS.am(58,92.9431),new kS.am(59,93.94868)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(33,68.96532),new kS.am(34,69.95601),new kS.am(35,70.95051),new kS.am(36,71.94190754),new kS.am(37,72.938931115),new kS.am(38,73.933258225),new kS.am(39,74.931033794),new kS.am(40,75.925948304),new kS.am(41,76.92466788),new kS.am(42,77.920386271),new kS.am(43,78.920082992),new kS.am(44,79.91637804),new kS.am(45,80.916592419),new kS.am(46,81.913484601),new kS.am(47,82.914135952),new kS.am(48,83.911506627),new kS.am(49,84.912526954),new kS.am(50,85.910610313),new kS.am(51,86.913354251),new kS.am(52,87.914446951),new kS.am(53,88.917632505),new kS.am(54,89.919523803),new kS.am(55,90.923442418),new kS.am(56,91.926152752),new kS.am(57,92.931265246),new kS.am(58,93.934362),new kS.am(59,94.93984),new kS.am(60,95.94307),new kS.am(61,96.94856)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(34,70.96532),new kS.am(35,71.95908),new kS.am(36,72.950366),new kS.am(37,73.944470376),new kS.am(38,74.938569199),new kS.am(39,75.935071448),new kS.am(40,76.930406599),new kS.am(41,77.928141485),new kS.am(42,78.923996719),new kS.am(43,79.922519322),new kS.am(44,80.918994165),new kS.am(45,81.918207691),new kS.am(46,82.915111951),new kS.am(47,83.914384676),new kS.am(48,84.911789341),new kS.am(49,85.91116708),new kS.am(50,86.909183465),new kS.am(51,87.911318556),new kS.am(52,88.912279939),new kS.am(53,89.914808941),new kS.am(54,90.91653416),new kS.am(55,91.919725442),new kS.am(56,92.922032765),new kS.am(57,93.926407326),new kS.am(58,94.92931926),new kS.am(59,95.934283962),new kS.am(60,96.937342863),new kS.am(61,97.941703557),new kS.am(62,98.945420616),new kS.am(63,99.94987),new kS.am(64,100.953195994),new kS.am(65,101.95921)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(35,72.96597),new kS.am(36,73.95631),new kS.am(37,74.94992),new kS.am(38,75.94161),new kS.am(39,76.937761511),new kS.am(40,77.932179362),new kS.am(41,78.929707076),new kS.am(42,79.924524588),new kS.am(43,80.923213095),new kS.am(44,81.918401258),new kS.am(45,82.917555029),new kS.am(46,83.913424778),new kS.am(47,84.912932689),new kS.am(48,85.909262351),new kS.am(49,86.908879316),new kS.am(50,87.905614339),new kS.am(51,88.907452906),new kS.am(52,89.907737596),new kS.am(53,90.910209845),new kS.am(54,91.911029895),new kS.am(55,92.91402241),new kS.am(56,93.915359856),new kS.am(57,94.919358213),new kS.am(58,95.921680473),new kS.am(59,96.926148757),new kS.am(60,97.928471177),new kS.am(61,98.933315038),new kS.am(62,99.935351729),new kS.am(63,100.940517434),new kS.am(64,101.943018795),new kS.am(65,102.94895),new kS.am(66,103.95233)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(38,76.94962),new kS.am(39,77.9435),new kS.am(40,78.937350712),new kS.am(41,79.931982402),new kS.am(42,80.929128719),new kS.am(43,81.926792071),new kS.am(44,82.922352572),new kS.am(45,83.920387768),new kS.am(46,84.916427076),new kS.am(47,85.914887724),new kS.am(48,86.910877833),new kS.am(49,87.909503361),new kS.am(50,88.905847902),new kS.am(51,89.907151443),new kS.am(52,90.907303415),new kS.am(53,91.908946832),new kS.am(54,92.909581582),new kS.am(55,93.911594008),new kS.am(56,94.912823709),new kS.am(57,95.915897787),new kS.am(58,96.918131017),new kS.am(59,97.922219525),new kS.am(60,98.924634736),new kS.am(61,99.927756402),new kS.am(62,100.930313395),new kS.am(63,101.933555501),new kS.am(64,102.93694),new kS.am(65,103.94145),new kS.am(66,104.94509),new kS.am(67,105.95022)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(39,78.94916),new kS.am(40,79.94055),new kS.am(41,80.936815296),new kS.am(42,81.931086249),new kS.am(43,82.92865213),new kS.am(44,83.92325),new kS.am(45,84.92146522),new kS.am(46,85.916472851),new kS.am(47,86.914816578),new kS.am(48,87.910226179),new kS.am(49,88.908888916),new kS.am(50,89.904703679),new kS.am(51,90.905644968),new kS.am(52,91.905040106),new kS.am(53,92.906475627),new kS.am(54,93.906315765),new kS.am(55,94.908042739),new kS.am(56,95.908275675),new kS.am(57,96.910950716),new kS.am(58,97.912746366),new kS.am(59,98.916511084),new kS.am(60,99.917761704),new kS.am(61,100.921139958),new kS.am(62,101.922981089),new kS.am(63,102.926597062),new kS.am(64,103.92878),new kS.am(65,104.93305),new kS.am(66,105.93591),new kS.am(67,106.94086),new kS.am(68,107.94428)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(40,80.94905),new kS.am(41,81.94313),new kS.am(42,82.936703713),new kS.am(43,83.93357),new kS.am(44,84.927906486),new kS.am(45,85.925037588),new kS.am(46,86.920361435),new kS.am(47,87.91833144),new kS.am(48,88.913495503),new kS.am(49,89.911264109),new kS.am(50,90.906990538),new kS.am(51,91.907193214),new kS.am(52,92.906377543),new kS.am(53,93.907283457),new kS.am(54,94.906835178),new kS.am(55,95.908100076),new kS.am(56,96.908097144),new kS.am(57,97.91033069),new kS.am(58,98.911617864),new kS.am(59,99.914181434),new kS.am(60,100.915251567),new kS.am(61,101.918037417),new kS.am(62,102.919141297),new kS.am(63,103.922459464),new kS.am(64,104.923934023),new kS.am(65,105.92819),new kS.am(66,106.93031),new kS.am(67,107.93501),new kS.am(68,108.93763),new kS.am(69,109.94268)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(41,82.94874),new kS.am(42,83.94009),new kS.am(43,84.93659),new kS.am(44,85.930695167),new kS.am(45,86.92732683),new kS.am(46,87.921952728),new kS.am(47,88.919480562),new kS.am(48,89.913936161),new kS.am(49,90.911750754),new kS.am(50,91.90681048),new kS.am(51,92.906812213),new kS.am(52,93.905087578),new kS.am(53,94.905841487),new kS.am(54,95.904678904),new kS.am(55,96.906021033),new kS.am(56,97.905407846),new kS.am(57,98.907711598),new kS.am(58,99.907477149),new kS.am(59,100.910346543),new kS.am(60,101.910297162),new kS.am(61,102.913204596),new kS.am(62,103.913758387),new kS.am(63,104.916972087),new kS.am(64,105.918134284),new kS.am(65,106.921694724),new kS.am(66,107.923973837),new kS.am(67,108.92781),new kS.am(68,109.92973),new kS.am(69,110.93451),new kS.am(70,111.93684),new kS.am(71,112.94203)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(42,84.94894),new kS.am(43,85.94288),new kS.am(44,86.93653),new kS.am(45,87.93283),new kS.am(46,88.92754288),new kS.am(47,89.92355583),new kS.am(48,90.9184282),new kS.am(49,91.915259655),new kS.am(50,92.910248473),new kS.am(51,93.909656309),new kS.am(52,94.907656454),new kS.am(53,95.907870803),new kS.am(54,96.906364843),new kS.am(55,97.907215692),new kS.am(56,98.906254554),new kS.am(57,99.907657594),new kS.am(58,100.90731438),new kS.am(59,101.909212938),new kS.am(60,102.909178805),new kS.am(61,103.911444898),new kS.am(62,104.911658043),new kS.am(63,105.914355408),new kS.am(64,106.915081691),new kS.am(65,107.918479973),new kS.am(66,108.919980998),new kS.am(67,109.92339),new kS.am(68,110.92505),new kS.am(69,111.92924),new kS.am(70,112.93133),new kS.am(71,113.93588),new kS.am(72,114.93828)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(43,86.94918),new kS.am(44,87.94042),new kS.am(45,88.93611),new kS.am(46,89.92978),new kS.am(47,90.926377434),new kS.am(48,91.92012),new kS.am(49,92.917051523),new kS.am(50,93.911359569),new kS.am(51,94.910412729),new kS.am(52,95.907597681),new kS.am(53,96.907554546),new kS.am(54,97.905287111),new kS.am(55,98.905939307),new kS.am(56,99.904219664),new kS.am(57,100.905582219),new kS.am(58,101.904349503),new kS.am(59,102.906323677),new kS.am(60,103.905430145),new kS.am(61,104.907750341),new kS.am(62,105.907326913),new kS.am(63,106.909907207),new kS.am(64,107.910192211),new kS.am(65,108.913201565),new kS.am(66,109.913966185),new kS.am(67,110.91756),new kS.am(68,111.918821673),new kS.am(69,112.92254),new kS.am(70,113.923891981),new kS.am(71,114.92831),new kS.am(72,115.93016),new kS.am(73,116.93479),new kS.am(74,117.93703)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(44,88.94938),new kS.am(45,89.94287),new kS.am(46,90.93655),new kS.am(47,91.93198),new kS.am(48,92.92574),new kS.am(49,93.921698),new kS.am(50,94.915898541),new kS.am(51,95.914518212),new kS.am(52,96.911336643),new kS.am(53,97.910716431),new kS.am(54,98.908132101),new kS.am(55,99.90811663),new kS.am(56,100.906163526),new kS.am(57,101.906842845),new kS.am(58,102.905504182),new kS.am(59,103.906655315),new kS.am(60,104.905692444),new kS.am(61,105.907284615),new kS.am(62,106.90675054),new kS.am(63,107.908730768),new kS.am(64,108.908735621),new kS.am(65,109.910949525),new kS.am(66,110.91166),new kS.am(67,111.913969253),new kS.am(68,112.91542),new kS.am(69,113.91734336),new kS.am(70,114.920124676),new kS.am(71,115.922746643),new kS.am(72,116.92535),new kS.am(73,117.92943),new kS.am(74,118.93136),new kS.am(75,119.93578),new kS.am(76,120.93808)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(45,90.94948),new kS.am(46,91.94042),new kS.am(47,92.93591),new kS.am(48,93.92877),new kS.am(49,94.92469),new kS.am(50,95.91822194),new kS.am(51,96.916478921),new kS.am(52,97.912720751),new kS.am(53,98.911767757),new kS.am(54,99.908504596),new kS.am(55,100.908289144),new kS.am(56,101.905607716),new kS.am(57,102.906087204),new kS.am(58,103.904034912),new kS.am(59,104.905084046),new kS.am(60,105.903483087),new kS.am(61,106.905128453),new kS.am(62,107.903894451),new kS.am(63,108.905953535),new kS.am(64,109.905152385),new kS.am(65,110.907643952),new kS.am(66,111.907313277),new kS.am(67,112.910151346),new kS.am(68,113.910365322),new kS.am(69,114.91368341),new kS.am(70,115.914158288),new kS.am(71,116.91784),new kS.am(72,117.918983915),new kS.am(73,118.92268),new kS.am(74,119.92403),new kS.am(75,120.92818),new kS.am(76,121.9298),new kS.am(77,122.93426)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(47,93.94278),new kS.am(48,94.93548),new kS.am(49,95.93068),new kS.am(50,96.924),new kS.am(51,97.921759995),new kS.am(52,98.917597103),new kS.am(53,99.916069387),new kS.am(54,100.912802135),new kS.am(55,101.911999996),new kS.am(56,102.908972453),new kS.am(57,103.908628228),new kS.am(58,104.906528234),new kS.am(59,105.906666431),new kS.am(60,106.90509302),new kS.am(61,107.905953705),new kS.am(62,108.904755514),new kS.am(63,109.90611046),new kS.am(64,110.905294679),new kS.am(65,111.907004132),new kS.am(66,112.906565708),new kS.am(67,113.908807907),new kS.am(68,114.908762282),new kS.am(69,115.911359558),new kS.am(70,116.911684187),new kS.am(71,117.914582383),new kS.am(72,118.915666045),new kS.am(73,119.918788609),new kS.am(74,120.919851074),new kS.am(75,121.92332),new kS.am(76,122.9249),new kS.am(77,123.92853),new kS.am(78,124.93054),new kS.am(79,125.9345),new kS.am(80,126.93688)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(48,95.93977),new kS.am(49,96.93494),new kS.am(50,97.927579),new kS.am(51,98.92501),new kS.am(52,99.920230232),new kS.am(53,100.918681442),new kS.am(54,101.914777255),new kS.am(55,102.913418952),new kS.am(56,103.909848091),new kS.am(57,104.909467818),new kS.am(58,105.906458007),new kS.am(59,106.906614232),new kS.am(60,107.904183403),new kS.am(61,108.904985569),new kS.am(62,109.903005578),new kS.am(63,110.904181628),new kS.am(64,111.902757226),new kS.am(65,112.904400947),new kS.am(66,113.903358121),new kS.am(67,114.905430553),new kS.am(68,115.904755434),new kS.am(69,116.907218242),new kS.am(70,117.906914144),new kS.am(71,118.909922582),new kS.am(72,119.909851352),new kS.am(73,120.91298039),new kS.am(74,121.9135),new kS.am(75,122.917003675),new kS.am(76,123.917648302),new kS.am(77,124.92124717),new kS.am(78,125.922353996),new kS.am(79,126.926434822),new kS.am(80,127.927760617),new kS.am(81,128.93226),new kS.am(82,129.93398)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(49,97.94224),new kS.am(50,98.93461),new kS.am(51,99.931149033),new kS.am(52,100.92656),new kS.am(53,101.924707541),new kS.am(54,102.919913896),new kS.am(55,103.918338416),new kS.am(56,104.914673434),new kS.am(57,105.913461134),new kS.am(58,106.910292195),new kS.am(59,107.909719683),new kS.am(60,108.907154078),new kS.am(61,109.907168783),new kS.am(62,110.905110677),new kS.am(63,111.905533338),new kS.am(64,112.904061223),new kS.am(65,113.904916758),new kS.am(66,114.903878328),new kS.am(67,115.905259995),new kS.am(68,116.904515731),new kS.am(69,117.906354623),new kS.am(70,118.905846334),new kS.am(71,119.907961505),new kS.am(72,120.907848847),new kS.am(73,121.910277103),new kS.am(74,122.910438951),new kS.am(75,123.913175916),new kS.am(76,124.913601387),new kS.am(77,125.916464532),new kS.am(78,126.917344048),new kS.am(79,127.920170658),new kS.am(80,128.921657958),new kS.am(81,129.924854941),new kS.am(82,130.926767408),new kS.am(83,131.932919005),new kS.am(84,132.93834),new kS.am(85,133.94466)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(50,99.938954),new kS.am(51,100.93606),new kS.am(52,101.93049),new kS.am(53,102.92813),new kS.am(54,103.923185469),new kS.am(55,104.921390409),new kS.am(56,105.916880472),new kS.am(57,106.915666702),new kS.am(58,107.911965339),new kS.am(59,108.911286879),new kS.am(60,109.907852688),new kS.am(61,110.907735404),new kS.am(62,111.90482081),new kS.am(63,112.905173373),new kS.am(64,113.902781816),new kS.am(65,114.903345973),new kS.am(66,115.901744149),new kS.am(67,116.902953765),new kS.am(68,117.901606328),new kS.am(69,118.90330888),new kS.am(70,119.902196571),new kS.am(71,120.904236867),new kS.am(72,121.903440138),new kS.am(73,122.905721901),new kS.am(74,123.90527463),new kS.am(75,124.907784924),new kS.am(76,125.907653953),new kS.am(77,126.91035098),new kS.am(78,127.910534953),new kS.am(79,128.913439976),new kS.am(80,129.913852185),new kS.am(81,130.916919144),new kS.am(82,131.917744455),new kS.am(83,132.923814085),new kS.am(84,133.928463576),new kS.am(85,134.93473),new kS.am(86,135.93934),new kS.am(87,136.94579)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(52,102.94012),new kS.am(53,103.936287),new kS.am(54,104.931528593),new kS.am(55,105.928183134),new kS.am(56,106.92415),new kS.am(57,107.92216),new kS.am(58,108.918136092),new kS.am(59,109.917533911),new kS.am(60,110.912534147),new kS.am(61,111.91239464),new kS.am(62,112.909377941),new kS.am(63,113.909095876),new kS.am(64,114.906598812),new kS.am(65,115.906797235),new kS.am(66,116.90483959),new kS.am(67,117.905531885),new kS.am(68,118.90394646),new kS.am(69,119.905074315),new kS.am(70,120.903818044),new kS.am(71,121.905175415),new kS.am(72,122.904215696),new kS.am(73,123.905937525),new kS.am(74,124.905247804),new kS.am(75,125.907248153),new kS.am(76,126.906914564),new kS.am(77,127.90916733),new kS.am(78,128.909150092),new kS.am(79,129.911546459),new kS.am(80,130.911946487),new kS.am(81,131.914413247),new kS.am(82,132.915236466),new kS.am(83,133.920551554),new kS.am(84,134.925167962),new kS.am(85,135.93066),new kS.am(86,136.93531),new kS.am(87,137.94096),new kS.am(88,138.94571)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(54,105.937702),new kS.am(55,106.935036),new kS.am(56,107.929486838),new kS.am(57,108.927456483),new kS.am(58,109.922407164),new kS.am(59,110.921120589),new kS.am(60,111.917061617),new kS.am(61,112.915452551),new kS.am(62,113.912498025),new kS.am(63,114.911578627),new kS.am(64,115.908420253),new kS.am(65,116.90863418),new kS.am(66,117.905825187),new kS.am(67,118.90640811),new kS.am(68,119.904019891),new kS.am(69,120.904929815),new kS.am(70,121.903047064),new kS.am(71,122.904272951),new kS.am(72,123.902819466),new kS.am(73,124.904424718),new kS.am(74,125.903305543),new kS.am(75,126.90521729),new kS.am(76,127.904461383),new kS.am(77,128.906595593),new kS.am(78,129.906222753),new kS.am(79,130.90852188),new kS.am(80,131.908523782),new kS.am(81,132.910939068),new kS.am(82,133.911540546),new kS.am(83,134.916450782),new kS.am(84,135.920103155),new kS.am(85,136.925324769),new kS.am(86,137.92922),new kS.am(87,138.93473),new kS.am(88,139.9387),new kS.am(89,140.94439),new kS.am(90,141.9485)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(55,107.943291),new kS.am(56,108.938191658),new kS.am(57,109.934634181),new kS.am(58,110.930276),new kS.am(59,111.92797),new kS.am(60,112.923644245),new kS.am(61,113.92185),new kS.am(62,114.918272),new kS.am(63,115.916735014),new kS.am(64,116.913647692),new kS.am(65,117.91337523),new kS.am(66,118.910180837),new kS.am(67,119.910047843),new kS.am(68,120.907366063),new kS.am(69,121.907592451),new kS.am(70,122.905597944),new kS.am(71,123.906211423),new kS.am(72,124.90462415),new kS.am(73,125.905619387),new kS.am(74,126.90446842),new kS.am(75,127.905805254),new kS.am(76,128.904987487),new kS.am(77,129.906674018),new kS.am(78,130.906124168),new kS.am(79,131.907994525),new kS.am(80,132.907806465),new kS.am(81,133.909876552),new kS.am(82,134.91005031),new kS.am(83,135.914655105),new kS.am(84,136.917872653),new kS.am(85,137.922383666),new kS.am(86,138.926093402),new kS.am(87,139.93121),new kS.am(88,140.93483),new kS.am(89,141.94018),new kS.am(90,142.94407),new kS.am(91,143.94961)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(56,109.944476),new kS.am(57,110.941632),new kS.am(58,111.93566535),new kS.am(59,112.933382836),new kS.am(60,113.928145),new kS.am(61,114.926979032),new kS.am(62,115.921394197),new kS.am(63,116.920564355),new kS.am(64,117.91657092),new kS.am(65,118.915554295),new kS.am(66,119.91215199),new kS.am(67,120.911386497),new kS.am(68,121.908548396),new kS.am(69,122.908470748),new kS.am(70,123.905895774),new kS.am(71,124.906398236),new kS.am(72,125.904268868),new kS.am(73,126.905179581),new kS.am(74,127.903530436),new kS.am(75,128.904779458),new kS.am(76,129.903507903),new kS.am(77,130.90508192),new kS.am(78,131.904154457),new kS.am(79,132.90590566),new kS.am(80,133.905394504),new kS.am(81,134.907207499),new kS.am(82,135.907219526),new kS.am(83,136.911562939),new kS.am(84,137.913988549),new kS.am(85,138.918786859),new kS.am(86,139.921635665),new kS.am(87,140.926646282),new kS.am(88,141.929702981),new kS.am(89,142.93489),new kS.am(90,143.93823),new kS.am(91,144.94367),new kS.am(92,145.9473),new kS.am(93,146.95301)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(57,111.950331),new kS.am(58,112.944535512),new kS.am(59,113.940841319),new kS.am(60,114.935939),new kS.am(61,115.932914152),new kS.am(62,116.928639484),new kS.am(63,117.926554883),new kS.am(64,118.922370879),new kS.am(65,119.920678219),new kS.am(66,120.917183637),new kS.am(67,121.916121946),new kS.am(68,122.912990168),new kS.am(69,123.912245731),new kS.am(70,124.909724871),new kS.am(71,125.909447953),new kS.am(72,126.9074176),new kS.am(73,127.907747919),new kS.am(74,128.906063369),new kS.am(75,129.906706163),new kS.am(76,130.905460232),new kS.am(77,131.906429799),new kS.am(78,132.90544687),new kS.am(79,133.906713419),new kS.am(80,134.905971903),new kS.am(81,135.907305741),new kS.am(82,136.907083505),new kS.am(83,137.911010537),new kS.am(84,138.913357921),new kS.am(85,139.917277075),new kS.am(86,140.920043984),new kS.am(87,141.924292317),new kS.am(88,142.927330292),new kS.am(89,143.932027373),new kS.am(90,144.935388226),new kS.am(91,145.940162028),new kS.am(92,146.943864435),new kS.am(93,147.948899539),new kS.am(94,148.95272),new kS.am(95,149.95797),new kS.am(96,150.962)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(58,113.950941),new kS.am(59,114.94771),new kS.am(60,115.94168),new kS.am(61,116.937700229),new kS.am(62,117.93344),new kS.am(63,118.931051927),new kS.am(64,119.926045941),new kS.am(65,120.924485908),new kS.am(66,121.92026),new kS.am(67,122.91885),new kS.am(68,123.915088437),new kS.am(69,124.914620234),new kS.am(70,125.911244146),new kS.am(71,126.911121328),new kS.am(72,127.90830887),new kS.am(73,128.908673749),new kS.am(74,129.906310478),new kS.am(75,130.906930798),new kS.am(76,131.905056152),new kS.am(77,132.906002368),new kS.am(78,133.904503347),new kS.am(79,134.905682749),new kS.am(80,135.904570109),new kS.am(81,136.905821414),new kS.am(82,137.905241273),new kS.am(83,138.908835384),new kS.am(84,139.910599485),new kS.am(85,140.914406439),new kS.am(86,141.916448175),new kS.am(87,142.920617184),new kS.am(88,143.922940468),new kS.am(89,144.926923807),new kS.am(90,145.930106645),new kS.am(91,146.933992519),new kS.am(92,147.937682377),new kS.am(93,148.94246),new kS.am(94,149.94562),new kS.am(95,150.9507),new kS.am(96,151.95416),new kS.am(97,152.95961)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(60,116.95001),new kS.am(61,117.94657),new kS.am(62,118.94099),new kS.am(63,119.93807),new kS.am(64,120.93301),new kS.am(65,121.93071),new kS.am(66,122.92624),new kS.am(67,123.92453),new kS.am(68,124.92067),new kS.am(69,125.91937),new kS.am(70,126.91616),new kS.am(71,127.91544794),new kS.am(72,128.912667334),new kS.am(73,129.91232),new kS.am(74,130.910108489),new kS.am(75,131.910110399),new kS.am(76,132.908396372),new kS.am(77,133.908489607),new kS.am(78,134.906971003),new kS.am(79,135.907651181),new kS.am(80,136.906465656),new kS.am(81,137.907106826),new kS.am(82,138.90634816),new kS.am(83,139.909472552),new kS.am(84,140.910957016),new kS.am(85,141.914074489),new kS.am(86,142.916058646),new kS.am(87,143.919591666),new kS.am(88,144.92163837),new kS.am(89,145.925700146),new kS.am(90,146.927819639),new kS.am(91,147.932191197),new kS.am(92,148.93437),new kS.am(93,149.93857),new kS.am(94,150.94156),new kS.am(95,151.94611),new kS.am(96,152.94945),new kS.am(97,153.9544),new kS.am(98,154.95813)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(61,118.95276),new kS.am(62,119.94664),new kS.am(63,120.94367),new kS.am(64,121.93801),new kS.am(65,122.93551),new kS.am(66,123.93052),new kS.am(67,124.92854),new kS.am(68,125.9241),new kS.am(69,126.92275),new kS.am(70,127.91887),new kS.am(71,128.918679183),new kS.am(72,129.914339361),new kS.am(73,130.914424137),new kS.am(74,131.91149),new kS.am(75,132.91155),new kS.am(76,133.909026379),new kS.am(77,134.909145555),new kS.am(78,135.907143574),new kS.am(79,136.907777634),new kS.am(80,137.905985574),new kS.am(81,138.906646605),new kS.am(82,139.905434035),new kS.am(83,140.908271103),new kS.am(84,141.909239733),new kS.am(85,142.912381158),new kS.am(86,143.913642686),new kS.am(87,144.917227871),new kS.am(88,145.918689722),new kS.am(89,146.922510962),new kS.am(90,147.924394738),new kS.am(91,148.928289207),new kS.am(92,149.930226399),new kS.am(93,150.93404),new kS.am(94,151.93638),new kS.am(95,152.94058),new kS.am(96,153.94332),new kS.am(97,154.94804),new kS.am(98,155.95126),new kS.am(99,156.95634)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(62,120.955364),new kS.am(63,121.95165),new kS.am(64,122.94596),new kS.am(65,123.94296),new kS.am(66,124.93783),new kS.am(67,125.93531),new kS.am(68,126.93083),new kS.am(69,127.9288),new kS.am(70,128.92486),new kS.am(71,129.92338),new kS.am(72,130.920060245),new kS.am(73,131.91912),new kS.am(74,132.9162),new kS.am(75,133.915672),new kS.am(76,134.91313914),new kS.am(77,135.912646935),new kS.am(78,136.910678351),new kS.am(79,137.910748891),new kS.am(80,138.908932181),new kS.am(81,139.909071204),new kS.am(82,140.907647726),new kS.am(83,141.910039865),new kS.am(84,142.910812233),new kS.am(85,143.913300595),new kS.am(86,144.914506897),new kS.am(87,145.917588016),new kS.am(88,146.918979001),new kS.am(89,147.922183237),new kS.am(90,148.923791056),new kS.am(91,149.926995031),new kS.am(92,150.928227869),new kS.am(93,151.9316),new kS.am(94,152.93365),new kS.am(95,153.93739),new kS.am(96,154.93999),new kS.am(97,155.94412),new kS.am(98,156.94717),new kS.am(99,157.95178),new kS.am(100,158.95523)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(66,125.94307),new kS.am(67,126.9405),new kS.am(68,127.93539),new kS.am(69,128.932385),new kS.am(70,129.92878),new kS.am(71,130.927102697),new kS.am(72,131.92312),new kS.am(73,132.92221),new kS.am(74,133.918645),new kS.am(75,134.91824),new kS.am(76,135.915020542),new kS.am(77,136.91463973),new kS.am(78,137.91291745),new kS.am(79,138.91192415),new kS.am(80,139.909309824),new kS.am(81,140.9096048),new kS.am(82,141.907718643),new kS.am(83,142.909809626),new kS.am(84,143.910082629),new kS.am(85,144.912568847),new kS.am(86,145.913112139),new kS.am(87,146.916095794),new kS.am(88,147.916888516),new kS.am(89,148.92014419),new kS.am(90,149.920886563),new kS.am(91,150.923824739),new kS.am(92,151.924682428),new kS.am(93,152.927694534),new kS.am(94,153.929483295),new kS.am(95,154.932629551),new kS.am(96,155.9352),new kS.am(97,156.93927),new kS.am(98,157.94187),new kS.am(99,158.94639),new kS.am(100,159.94939),new kS.am(101,160.95433)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(67,127.94826),new kS.am(68,128.94316),new kS.am(69,129.94045),new kS.am(70,130.9358),new kS.am(71,131.93375),new kS.am(72,132.92972),new kS.am(73,133.92849),new kS.am(74,134.924617),new kS.am(75,135.923447865),new kS.am(76,136.920713),new kS.am(77,137.920432261),new kS.am(78,138.916759814),new kS.am(79,139.915801649),new kS.am(80,140.913606636),new kS.am(81,141.912950738),new kS.am(82,142.910927571),new kS.am(83,143.912585768),new kS.am(84,144.912743879),new kS.am(85,145.914692165),new kS.am(86,146.915133898),new kS.am(87,147.917467786),new kS.am(88,148.918329195),new kS.am(89,149.920979477),new kS.am(90,150.921202693),new kS.am(91,151.923490557),new kS.am(92,152.924113189),new kS.am(93,153.926547019),new kS.am(94,154.928097047),new kS.am(95,155.931060357),new kS.am(96,156.9332),new kS.am(97,157.93669),new kS.am(98,158.93913),new kS.am(99,159.94299),new kS.am(100,160.94586),new kS.am(101,161.95029),new kS.am(102,162.95352)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(68,129.94863),new kS.am(69,130.94589),new kS.am(70,131.94082),new kS.am(71,132.93873),new kS.am(72,133.93402),new kS.am(73,134.93235),new kS.am(74,135.9283),new kS.am(75,136.927046709),new kS.am(76,137.92354),new kS.am(77,138.922302),new kS.am(78,139.918991),new kS.am(79,140.918468512),new kS.am(80,141.915193274),new kS.am(81,142.914623555),new kS.am(82,143.91199473),new kS.am(83,144.913405611),new kS.am(84,145.91303676),new kS.am(85,146.914893275),new kS.am(86,147.914817914),new kS.am(87,148.917179521),new kS.am(88,149.917271454),new kS.am(89,150.919928351),new kS.am(90,151.919728244),new kS.am(91,152.922093907),new kS.am(92,153.922205303),new kS.am(93,154.92463594),new kS.am(94,155.925526236),new kS.am(95,156.928354506),new kS.am(96,157.929987938),new kS.am(97,158.9332),new kS.am(98,159.93514),new kS.am(99,160.93883),new kS.am(100,161.94122),new kS.am(101,162.94536),new kS.am(102,163.94828),new kS.am(103,164.95298)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(69,131.95416),new kS.am(70,132.9489),new kS.am(71,133.94632),new kS.am(72,134.94172),new kS.am(73,135.9395),new kS.am(74,136.93521),new kS.am(75,137.93345),new kS.am(76,138.92882915),new kS.am(77,139.928083921),new kS.am(78,140.924885867),new kS.am(79,141.923400033),new kS.am(80,142.920286634),new kS.am(81,143.918774116),new kS.am(82,144.916261285),new kS.am(83,145.917199714),new kS.am(84,146.916741206),new kS.am(85,147.918153775),new kS.am(86,148.917925922),new kS.am(87,149.919698294),new kS.am(88,150.919846022),new kS.am(89,151.921740399),new kS.am(90,152.921226219),new kS.am(91,153.922975386),new kS.am(92,154.922889429),new kS.am(93,155.924750855),new kS.am(94,156.925419435),new kS.am(95,157.927841923),new kS.am(96,158.9290845),new kS.am(97,159.931460406),new kS.am(98,160.93368),new kS.am(99,161.93704),new kS.am(100,162.93921),new kS.am(101,163.94299),new kS.am(102,164.94572),new kS.am(103,165.94997),new kS.am(104,166.95305)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(72,135.94707),new kS.am(73,136.94465),new kS.am(74,137.93997),new kS.am(75,138.93808),new kS.am(76,139.933236934),new kS.am(77,140.93221),new kS.am(78,141.927908919),new kS.am(79,142.926738636),new kS.am(80,143.923390357),new kS.am(81,144.921687498),new kS.am(82,145.918305344),new kS.am(83,146.919089446),new kS.am(84,147.918109771),new kS.am(85,148.919336427),new kS.am(86,149.918655455),new kS.am(87,150.920344273),new kS.am(88,151.919787882),new kS.am(89,152.921746283),new kS.am(90,153.920862271),new kS.am(91,154.922618801),new kS.am(92,155.922119552),new kS.am(93,156.923956686),new kS.am(94,157.924100533),new kS.am(95,158.926385075),new kS.am(96,159.927050616),new kS.am(97,160.929665688),new kS.am(98,161.930981211),new kS.am(99,162.93399),new kS.am(100,163.93586),new kS.am(101,164.93938),new kS.am(102,165.9416),new kS.am(103,166.94557),new kS.am(104,167.94836),new kS.am(105,168.95287)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(73,137.95287),new kS.am(74,138.94803),new kS.am(75,139.945367985),new kS.am(76,140.94116),new kS.am(77,141.939073781),new kS.am(78,142.93475),new kS.am(79,143.93253),new kS.am(80,144.92888),new kS.am(81,145.927180629),new kS.am(82,146.924037176),new kS.am(83,147.924298636),new kS.am(84,148.92324163),new kS.am(85,149.923654158),new kS.am(86,150.923098169),new kS.am(87,151.924071324),new kS.am(88,152.923430858),new kS.am(89,153.924686236),new kS.am(90,154.923500411),new kS.am(91,155.924743749),new kS.am(92,156.924021155),new kS.am(93,157.92541026),new kS.am(94,158.925343135),new kS.am(95,159.927164021),new kS.am(96,160.927566289),new kS.am(97,161.929484803),new kS.am(98,162.930643942),new kS.am(99,163.933347253),new kS.am(100,164.93488),new kS.am(101,165.93805),new kS.am(102,166.94005),new kS.am(103,167.94364),new kS.am(104,168.94622),new kS.am(105,169.95025),new kS.am(106,170.9533)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(74,139.95379),new kS.am(75,140.95119),new kS.am(76,141.946695946),new kS.am(77,142.94383),new kS.am(78,143.93907),new kS.am(79,144.936717),new kS.am(80,145.932720118),new kS.am(81,146.930878496),new kS.am(82,147.927177882),new kS.am(83,148.927333981),new kS.am(84,149.925579728),new kS.am(85,150.92617963),new kS.am(86,151.924713874),new kS.am(87,152.925760865),new kS.am(88,153.924422046),new kS.am(89,154.92574895),new kS.am(90,155.924278273),new kS.am(91,156.925461256),new kS.am(92,157.924404637),new kS.am(93,158.92573566),new kS.am(94,159.925193718),new kS.am(95,160.926929595),new kS.am(96,161.926794731),new kS.am(97,162.928727532),new kS.am(98,163.929171165),new kS.am(99,164.931699828),new kS.am(100,165.932803241),new kS.am(101,166.935649025),new kS.am(102,167.93723),new kS.am(103,168.940303648),new kS.am(104,169.94267),new kS.am(105,170.94648),new kS.am(106,171.94911),new kS.am(107,172.95344)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(75,141.95986),new kS.am(76,142.95469),new kS.am(77,143.95164),new kS.am(78,144.94688),new kS.am(79,145.9441),new kS.am(80,146.93984),new kS.am(81,147.937269),new kS.am(82,148.933789944),new kS.am(83,149.932760914),new kS.am(84,150.931680791),new kS.am(85,151.931740598),new kS.am(86,152.930194506),new kS.am(87,153.930596268),new kS.am(88,154.929079084),new kS.am(89,155.929001869),new kS.am(90,156.928188059),new kS.am(91,157.92894573),new kS.am(92,158.927708537),new kS.am(93,159.928725679),new kS.am(94,160.927851662),new kS.am(95,161.92909242),new kS.am(96,162.928730286),new kS.am(97,163.930230577),new kS.am(98,164.930319169),new kS.am(99,165.932281267),new kS.am(100,166.933126195),new kS.am(101,167.935496424),new kS.am(102,168.936868306),new kS.am(103,169.939614951),new kS.am(104,170.941461227),new kS.am(105,171.94482),new kS.am(106,172.94729),new kS.am(107,173.95115),new kS.am(108,174.95405)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(76,143.96059),new kS.am(77,144.95746),new kS.am(78,145.95212),new kS.am(79,146.94931),new kS.am(80,147.94444),new kS.am(81,148.942780527),new kS.am(82,149.937171034),new kS.am(83,150.93746),new kS.am(84,151.935078452),new kS.am(85,152.935093125),new kS.am(86,153.932777294),new kS.am(87,154.933204273),new kS.am(88,155.931015001),new kS.am(89,156.931945517),new kS.am(90,157.929912),new kS.am(91,158.930680718),new kS.am(92,159.929078924),new kS.am(93,160.930001348),new kS.am(94,161.928774923),new kS.am(95,162.930029273),new kS.am(96,163.929196996),new kS.am(97,164.9307228),new kS.am(98,165.93028997),new kS.am(99,166.932045448),new kS.am(100,167.932367781),new kS.am(101,168.934588082),new kS.am(102,169.935460334),new kS.am(103,170.938025885),new kS.am(104,171.939352149),new kS.am(105,172.9424),new kS.am(106,173.94434),new kS.am(107,174.94793),new kS.am(108,175.95029),new kS.am(109,176.95437)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(77,145.966495),new kS.am(78,146.961081),new kS.am(79,147.95755),new kS.am(80,148.95265),new kS.am(81,149.94967),new kS.am(82,150.944842),new kS.am(83,151.9443),new kS.am(84,152.942027631),new kS.am(85,153.940832325),new kS.am(86,154.939191562),new kS.am(87,155.939006895),new kS.am(88,156.936756069),new kS.am(89,157.936996),new kS.am(90,158.934808966),new kS.am(91,159.935090772),new kS.am(92,160.933398042),new kS.am(93,161.933970147),new kS.am(94,162.932647648),new kS.am(95,163.933450972),new kS.am(96,164.932432463),new kS.am(97,165.933553133),new kS.am(98,166.932848844),new kS.am(99,167.934170375),new kS.am(100,168.934211117),new kS.am(101,169.935797877),new kS.am(102,170.936425817),new kS.am(103,171.938396118),new kS.am(104,172.939600336),new kS.am(105,173.942164618),new kS.am(106,174.943832897),new kS.am(107,175.946991412),new kS.am(108,176.94904),new kS.am(109,177.95264),new kS.am(110,178.95534)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(78,147.96676),new kS.am(79,148.96348),new kS.am(80,149.95799),new kS.am(81,150.954657965),new kS.am(82,151.950167),new kS.am(83,152.94921),new kS.am(84,153.945651145),new kS.am(85,154.945792),new kS.am(86,155.942847109),new kS.am(87,156.94265865),new kS.am(88,157.939857897),new kS.am(89,158.940153735),new kS.am(90,159.93756),new kS.am(91,160.937357719),new kS.am(92,161.93575),new kS.am(93,162.936265492),new kS.am(94,163.93452),new kS.am(95,164.935397592),new kS.am(96,165.933879623),new kS.am(97,166.934946862),new kS.am(98,167.933894465),new kS.am(99,168.93518712),new kS.am(100,169.934758652),new kS.am(101,170.936322297),new kS.am(102,171.936377696),new kS.am(103,172.938206756),new kS.am(104,173.938858101),new kS.am(105,174.941272494),new kS.am(106,175.942568409),new kS.am(107,176.945257126),new kS.am(108,177.946643396),new kS.am(109,178.95017),new kS.am(110,179.95233),new kS.am(111,180.95615)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(79,149.972668),new kS.am(80,150.967147),new kS.am(81,151.96361),new kS.am(82,152.95869),new kS.am(83,153.9571),new kS.am(84,154.953641324),new kS.am(85,155.952907),new kS.am(86,156.950101536),new kS.am(87,157.948577981),new kS.am(88,158.946615113),new kS.am(89,159.945383),new kS.am(90,160.943047504),new kS.am(91,161.943222),new kS.am(92,162.941203796),new kS.am(93,163.941215),new kS.am(94,164.939605886),new kS.am(95,165.939762646),new kS.am(96,166.938307056),new kS.am(97,167.938698576),new kS.am(98,168.937648757),new kS.am(99,169.93847219),new kS.am(100,170.937909903),new kS.am(101,171.939082239),new kS.am(102,172.938926901),new kS.am(103,173.940333522),new kS.am(104,174.940767904),new kS.am(105,175.942682399),new kS.am(106,176.943754987),new kS.am(107,177.945951366),new kS.am(108,178.947324216),new kS.am(109,179.949879968),new kS.am(110,180.95197),new kS.am(111,181.95521),new kS.am(112,182.95757),new kS.am(113,183.96117)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(82,153.96425),new kS.am(83,154.96276),new kS.am(84,155.959247),new kS.am(85,156.958127),new kS.am(86,157.95405528),new kS.am(87,158.954003),new kS.am(88,159.950713588),new kS.am(89,160.950330852),new kS.am(90,161.947202977),new kS.am(91,162.947057),new kS.am(92,163.944422),new kS.am(93,164.94454),new kS.am(94,165.94225),new kS.am(95,166.9426),new kS.am(96,167.94063),new kS.am(97,168.941158567),new kS.am(98,169.93965),new kS.am(99,170.94049),new kS.am(100,171.93945798),new kS.am(101,172.94065),new kS.am(102,173.940040159),new kS.am(103,174.941502991),new kS.am(104,175.941401828),new kS.am(105,176.943220013),new kS.am(106,177.943697732),new kS.am(107,178.945815073),new kS.am(108,179.94654876),new kS.am(109,180.949099124),new kS.am(110,181.950552893),new kS.am(111,182.953531012),new kS.am(112,183.95544788),new kS.am(113,184.95878),new kS.am(114,185.96092)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(83,155.971689),new kS.am(84,156.968145),new kS.am(85,157.966368),new kS.am(86,158.96232309),new kS.am(87,159.961358),new kS.am(88,160.958372992),new kS.am(89,161.956556553),new kS.am(90,162.95431665),new kS.am(91,163.95357),new kS.am(92,164.950817),new kS.am(93,165.95047),new kS.am(94,166.948639),new kS.am(95,167.947787),new kS.am(96,168.94592),new kS.am(97,169.94609),new kS.am(98,170.94446),new kS.am(99,171.944739818),new kS.am(100,172.94459),new kS.am(101,173.944167937),new kS.am(102,174.94365),new kS.am(103,175.944740551),new kS.am(104,176.944471766),new kS.am(105,177.945750349),new kS.am(106,178.945934113),new kS.am(107,179.947465655),new kS.am(108,180.947996346),new kS.am(109,181.950152414),new kS.am(110,182.951373188),new kS.am(111,183.954009331),new kS.am(112,184.955559086),new kS.am(113,185.9585501),new kS.am(114,186.96041),new kS.am(115,187.96371)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(84,157.973939),new kS.am(85,158.97228),new kS.am(86,159.968369),new kS.am(87,160.967089),new kS.am(88,161.962750303),new kS.am(89,162.962532),new kS.am(90,163.95898381),new kS.am(91,164.958335962),new kS.am(92,165.955019896),new kS.am(93,166.954672),new kS.am(94,167.951863),new kS.am(95,168.951759),new kS.am(96,169.948473988),new kS.am(97,170.94946),new kS.am(98,171.948228837),new kS.am(99,172.948884),new kS.am(100,173.94616),new kS.am(101,174.94677),new kS.am(102,175.94559),new kS.am(103,176.94662),new kS.am(104,177.945848364),new kS.am(105,178.947071733),new kS.am(106,179.946705734),new kS.am(107,180.948198054),new kS.am(108,181.948205519),new kS.am(109,182.950224458),new kS.am(110,183.950932553),new kS.am(111,184.953420586),new kS.am(112,185.954362204),new kS.am(113,186.957158365),new kS.am(114,187.958486954),new kS.am(115,188.96191222),new kS.am(116,189.963179541)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(85,159.981485),new kS.am(86,160.977661),new kS.am(87,161.975707),new kS.am(88,162.971375872),new kS.am(89,163.970319),new kS.am(90,164.967050268),new kS.am(91,165.965211372),new kS.am(92,166.962564),new kS.am(93,167.961609),new kS.am(94,168.95883),new kS.am(95,169.958163),new kS.am(96,170.955547),new kS.am(97,171.955285),new kS.am(98,172.953062),new kS.am(99,173.952114),new kS.am(100,174.951393),new kS.am(101,175.95157),new kS.am(102,176.95027),new kS.am(103,177.950851081),new kS.am(104,178.949981038),new kS.am(105,179.95078768),new kS.am(106,180.950064596),new kS.am(107,181.951211444),new kS.am(108,182.950821349),new kS.am(109,183.952524289),new kS.am(110,184.952955747),new kS.am(111,185.954986529),new kS.am(112,186.955750787),new kS.am(113,187.958112287),new kS.am(114,188.959228359),new kS.am(115,189.961816139),new kS.am(116,190.963123592),new kS.am(117,191.96596)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(86,161.983819),new kS.am(87,162.982048),new kS.am(88,163.977927),new kS.am(89,164.976475),new kS.am(90,165.971934911),new kS.am(91,166.971554),new kS.am(92,167.967832911),new kS.am(93,168.967076205),new kS.am(94,169.963569716),new kS.am(95,170.96304),new kS.am(96,171.960078),new kS.am(97,172.959791),new kS.am(98,173.956307704),new kS.am(99,174.95708),new kS.am(100,175.953757941),new kS.am(101,176.955045),new kS.am(102,177.953348225),new kS.am(103,178.953951),new kS.am(104,179.952308241),new kS.am(105,180.953274494),new kS.am(106,181.952186222),new kS.am(107,182.95311),new kS.am(108,183.952490808),new kS.am(109,184.954043023),new kS.am(110,185.953838355),new kS.am(111,186.955747928),new kS.am(112,187.955835993),new kS.am(113,188.958144866),new kS.am(114,189.95844521),new kS.am(115,190.960927951),new kS.am(116,191.961479047),new kS.am(117,192.964148083),new kS.am(118,193.965179314),new kS.am(119,194.968123889),new kS.am(120,195.96962255)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(88,164.98758),new kS.am(89,165.985506),new kS.am(90,166.980951577),new kS.am(91,167.979966),new kS.am(92,168.976390868),new kS.am(93,169.974441697),new kS.am(94,170.971779),new kS.am(95,171.970643),new kS.am(96,172.967707),new kS.am(97,173.966804),new kS.am(98,174.964279),new kS.am(99,175.963511),new kS.am(100,176.96117),new kS.am(101,177.960084944),new kS.am(102,178.95915),new kS.am(103,179.958555615),new kS.am(104,180.957642156),new kS.am(105,181.958127689),new kS.am(106,182.956814),new kS.am(107,183.957388318),new kS.am(108,184.95659),new kS.am(109,185.957951104),new kS.am(110,186.95736083),new kS.am(111,187.958851962),new kS.am(112,188.958716473),new kS.am(113,189.960592299),new kS.am(114,190.960591191),new kS.am(115,191.962602198),new kS.am(116,192.9629237),new kS.am(117,193.96507561),new kS.am(118,194.9659768),new kS.am(119,195.968379906),new kS.am(120,196.969636496),new kS.am(121,197.97228),new kS.am(122,198.973787159)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(90,167.988035),new kS.am(91,168.986421),new kS.am(92,169.981734918),new kS.am(93,170.981251),new kS.am(94,171.977376138),new kS.am(95,172.976499642),new kS.am(96,173.972811276),new kS.am(97,174.972276),new kS.am(98,175.969),new kS.am(99,176.968453),new kS.am(100,177.964894223),new kS.am(101,178.965475),new kS.am(102,179.962023729),new kS.am(103,180.963177),new kS.am(104,181.961267637),new kS.am(105,182.961729),new kS.am(106,183.959851685),new kS.am(107,184.960753782),new kS.am(108,185.959432346),new kS.am(109,186.960697),new kS.am(110,187.959395697),new kS.am(111,188.9608319),new kS.am(112,189.959930073),new kS.am(113,190.961684653),new kS.am(114,191.961035158),new kS.am(115,192.962984504),new kS.am(116,193.962663581),new kS.am(117,194.964774449),new kS.am(118,195.964934884),new kS.am(119,196.967323401),new kS.am(120,197.967876009),new kS.am(121,198.970576213),new kS.am(122,199.971423885),new kS.am(123,200.974496467),new kS.am(124,201.97574)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(92,170.991183),new kS.am(93,171.990109),new kS.am(94,172.986398138),new kS.am(95,173.984325861),new kS.am(96,174.981552),new kS.am(97,175.980269),new kS.am(98,176.977215),new kS.am(99,177.975975),new kS.am(100,178.973412),new kS.am(101,179.972396),new kS.am(102,180.969948),new kS.am(103,181.968621416),new kS.am(104,182.96762),new kS.am(105,183.966776046),new kS.am(106,184.965806956),new kS.am(107,185.965997671),new kS.am(108,186.964562),new kS.am(109,187.965321662),new kS.am(110,188.9642243),new kS.am(111,189.964698757),new kS.am(112,190.963649239),new kS.am(113,191.964810107),new kS.am(114,192.964131745),new kS.am(115,193.96533889),new kS.am(116,194.965017928),new kS.am(117,195.966551315),new kS.am(118,196.966551609),new kS.am(119,197.968225244),new kS.am(120,198.968748016),new kS.am(121,199.970717886),new kS.am(122,200.971640839),new kS.am(123,201.973788431),new kS.am(124,202.975137256),new kS.am(125,203.977705),new kS.am(126,204.97961)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(95,174.991411),new kS.am(96,175.987413248),new kS.am(97,176.986336874),new kS.am(98,177.982476325),new kS.am(99,178.981783),new kS.am(100,179.978322),new kS.am(101,180.977806),new kS.am(102,181.97393546),new kS.am(103,182.974561),new kS.am(104,183.970705219),new kS.am(105,184.971983),new kS.am(106,185.969460021),new kS.am(107,186.969785),new kS.am(108,187.967511693),new kS.am(109,188.968733187),new kS.am(110,189.966958568),new kS.am(111,190.96706311),new kS.am(112,191.965921572),new kS.am(113,192.966644169),new kS.am(114,193.965381832),new kS.am(115,194.966638981),new kS.am(116,195.965814846),new kS.am(117,196.967195333),new kS.am(118,197.96675183),new kS.am(119,198.968262489),new kS.am(120,199.968308726),new kS.am(121,200.970285275),new kS.am(122,201.970625604),new kS.am(123,202.972857096),new kS.am(124,203.97347564),new kS.am(125,204.976056104),new kS.am(126,205.977498672),new kS.am(127,206.982577025),new kS.am(128,207.98594)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(96,176.996881),new kS.am(97,177.994637),new kS.am(98,178.991466),new kS.am(99,179.990194),new kS.am(100,180.986904),new kS.am(101,181.98561),new kS.am(102,182.982697),new kS.am(103,183.98176),new kS.am(104,184.9791),new kS.am(105,185.977549881),new kS.am(106,186.97617),new kS.am(107,187.97592),new kS.am(108,188.974290451),new kS.am(109,189.974473379),new kS.am(110,190.972261952),new kS.am(111,191.972770785),new kS.am(112,192.970548),new kS.am(113,193.971053),new kS.am(114,194.96965),new kS.am(115,195.970515),new kS.am(116,196.9695362),new kS.am(117,197.970466294),new kS.am(118,198.969813837),new kS.am(119,199.970945394),new kS.am(120,200.97080377),new kS.am(121,201.972090569),new kS.am(122,202.972329088),new kS.am(123,203.973848646),new kS.am(124,204.97441227),new kS.am(125,205.976095321),new kS.am(126,206.977407908),new kS.am(127,207.982004653),new kS.am(128,208.985349125),new kS.am(129,209.990065574)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(99,180.996714),new kS.am(100,181.992676101),new kS.am(101,182.99193),new kS.am(102,183.988198),new kS.am(103,184.98758),new kS.am(104,185.983485388),new kS.am(105,186.98403),new kS.am(106,187.979869108),new kS.am(107,188.98088),new kS.am(108,189.978180008),new kS.am(109,190.9782),new kS.am(110,191.975719811),new kS.am(111,192.97608),new kS.am(112,193.974648056),new kS.am(113,194.975920279),new kS.am(114,195.97271),new kS.am(115,196.97338),new kS.am(116,197.97198),new kS.am(117,198.972909384),new kS.am(118,199.97181556),new kS.am(119,200.972846589),new kS.am(120,201.972143786),new kS.am(121,202.973375491),new kS.am(122,203.973028761),new kS.am(123,204.974467112),new kS.am(124,205.974449002),new kS.am(125,206.975880605),new kS.am(126,207.97663585),new kS.am(127,208.981074801),new kS.am(128,209.984173129),new kS.am(129,210.988731474),new kS.am(130,211.991887495),new kS.am(131,212.9965),new kS.am(132,213.999798147)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(102,184.997708),new kS.am(103,185.99648),new kS.am(104,186.993458),new kS.am(105,187.992173),new kS.am(106,188.989505),new kS.am(107,189.987520007),new kS.am(108,190.986053),new kS.am(109,191.985368),new kS.am(110,192.983662229),new kS.am(111,193.983430186),new kS.am(112,194.98112697),new kS.am(113,195.981236107),new kS.am(114,196.978934287),new kS.am(115,197.979024396),new kS.am(116,198.977576953),new kS.am(117,199.978141983),new kS.am(118,200.976970721),new kS.am(119,201.977674504),new kS.am(120,202.976868118),new kS.am(121,203.977805161),new kS.am(122,204.977374688),new kS.am(123,205.978482854),new kS.am(124,206.978455217),new kS.am(125,207.979726699),new kS.am(126,208.980383241),new kS.am(127,209.984104944),new kS.am(128,210.987258139),new kS.am(129,211.991271542),new kS.am(130,212.994374836),new kS.am(131,213.998698664),new kS.am(132,215.001832349),new kS.am(133,216.006199)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(106,189.994293888),new kS.am(107,190.994653),new kS.am(108,191.99033039),new kS.am(109,192.991102),new kS.am(110,193.988284107),new kS.am(111,194.988045),new kS.am(112,195.985469432),new kS.am(113,196.985567),new kS.am(114,197.984024384),new kS.am(115,198.985044507),new kS.am(116,199.981735),new kS.am(117,200.982209),new kS.am(118,201.980704),new kS.am(119,202.981412863),new kS.am(120,203.980307113),new kS.am(121,204.981165396),new kS.am(122,205.980465241),new kS.am(123,206.981578228),new kS.am(124,207.981231059),new kS.am(125,208.982415788),new kS.am(126,209.982857396),new kS.am(127,210.986636869),new kS.am(128,211.988851755),new kS.am(129,212.992842522),new kS.am(130,213.995185949),new kS.am(131,214.999414609),new kS.am(132,216.001905198),new kS.am(133,217.006253),new kS.am(134,218.008965773)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(108,193.000188),new kS.am(109,193.997973),new kS.am(110,194.996554),new kS.am(111,195.995702),new kS.am(112,196.993891293),new kS.am(113,197.99343368),new kS.am(114,198.991008569),new kS.am(115,199.990920883),new kS.am(116,200.988486908),new kS.am(117,201.988448629),new kS.am(118,202.986847216),new kS.am(119,203.987261559),new kS.am(120,204.986036352),new kS.am(121,205.986599242),new kS.am(122,206.985775861),new kS.am(123,207.986582508),new kS.am(124,208.986158678),new kS.am(125,209.987131308),new kS.am(126,210.987480806),new kS.am(127,211.990734657),new kS.am(128,212.99292115),new kS.am(129,213.996356412),new kS.am(130,214.998641245),new kS.am(131,216.002408839),new kS.am(132,217.004709619),new kS.am(133,218.008681458),new kS.am(134,219.011296478),new kS.am(135,220.015301),new kS.am(136,221.01814),new kS.am(137,222.02233),new kS.am(138,223.02534)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(110,196.001117268),new kS.am(111,197.001661),new kS.am(112,197.998779978),new kS.am(113,198.998309),new kS.am(114,199.995634148),new kS.am(115,200.995535),new kS.am(116,201.993899382),new kS.am(117,202.994765192),new kS.am(118,203.991365),new kS.am(119,204.991668),new kS.am(120,205.99016),new kS.am(121,206.990726826),new kS.am(122,207.989631237),new kS.am(123,208.990376634),new kS.am(124,209.989679862),new kS.am(125,210.99058541),new kS.am(126,211.990688899),new kS.am(127,212.993868354),new kS.am(128,213.995346275),new kS.am(129,214.998729195),new kS.am(130,216.000258153),new kS.am(131,217.003914555),new kS.am(132,218.005586315),new kS.am(133,219.009474831),new kS.am(134,220.011384149),new kS.am(135,221.015455),new kS.am(136,222.017570472),new kS.am(137,223.02179),new kS.am(138,224.02409),new kS.am(139,225.02844),new kS.am(140,226.03089),new kS.am(141,227.035407),new kS.am(142,228.038084)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(113,200.006499),new kS.am(114,201.00458692),new kS.am(115,202.00396885),new kS.am(116,203.001423829),new kS.am(117,204.001221209),new kS.am(118,204.998663961),new kS.am(119,205.998486886),new kS.am(120,206.996859385),new kS.am(121,207.997133849),new kS.am(122,208.995915421),new kS.am(123,209.996398327),new kS.am(124,210.995529332),new kS.am(125,211.996194988),new kS.am(126,212.996174845),new kS.am(127,213.99895474),new kS.am(128,215.000326029),new kS.am(129,216.003187873),new kS.am(130,217.004616452),new kS.am(131,218.007563326),new kS.am(132,219.009240843),new kS.am(133,220.012312978),new kS.am(134,221.014245654),new kS.am(135,222.017543957),new kS.am(136,223.019730712),new kS.am(137,224.023235513),new kS.am(138,225.025606914),new kS.am(139,226.029343423),new kS.am(140,227.031833167),new kS.am(141,228.034776087),new kS.am(142,229.038426),new kS.am(143,230.04251),new kS.am(144,231.045407),new kS.am(145,232.049654)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(115,203.00921),new kS.am(116,204.006434513),new kS.am(117,205.006187),new kS.am(118,206.004463814),new kS.am(119,207.005176607),new kS.am(120,208.001776),new kS.am(121,209.001944),new kS.am(122,210.000446),new kS.am(123,211.000893996),new kS.am(124,211.999783492),new kS.am(125,213.000345847),new kS.am(126,214.000091141),new kS.am(127,215.002704195),new kS.am(128,216.003518402),new kS.am(129,217.00630601),new kS.am(130,218.007123948),new kS.am(131,219.010068787),new kS.am(132,220.011014669),new kS.am(133,221.013907762),new kS.am(134,222.01536182),new kS.am(135,223.01849714),new kS.am(136,224.020202004),new kS.am(137,225.023604463),new kS.am(138,226.025402555),new kS.am(139,227.029170677),new kS.am(140,228.031064101),new kS.am(141,229.034820309),new kS.am(142,230.037084774),new kS.am(143,231.04122),new kS.am(144,232.043693),new kS.am(145,233.047995),new kS.am(146,234.050547)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(118,207.012469754),new kS.am(119,208.012112949),new kS.am(120,209.009568736),new kS.am(121,210.009256802),new kS.am(122,211.007648196),new kS.am(123,212.007811441),new kS.am(124,213.006573689),new kS.am(125,214.006893072),new kS.am(126,215.006450832),new kS.am(127,216.008721268),new kS.am(128,217.009332676),new kS.am(129,218.011625045),new kS.am(130,219.012404918),new kS.am(131,220.014752105),new kS.am(132,221.015575746),new kS.am(133,222.017828852),new kS.am(134,223.01912603),new kS.am(135,224.021708435),new kS.am(136,225.023220576),new kS.am(137,226.026089848),new kS.am(138,227.027746979),new kS.am(139,228.031014825),new kS.am(140,229.032930871),new kS.am(141,230.036025144),new kS.am(142,231.038551503),new kS.am(143,232.042022474),new kS.am(144,233.04455),new kS.am(145,234.04842),new kS.am(146,235.051102),new kS.am(147,236.055178)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(120,210.015711883),new kS.am(121,211.016306912),new kS.am(122,212.012916),new kS.am(123,213.012962),new kS.am(124,214.011451),new kS.am(125,215.011726597),new kS.am(126,216.011050963),new kS.am(127,217.013066169),new kS.am(128,218.013267744),new kS.am(129,219.015521253),new kS.am(130,220.015733126),new kS.am(131,221.018171499),new kS.am(132,222.018454131),new kS.am(133,223.020795153),new kS.am(134,224.02145925),new kS.am(135,225.023941441),new kS.am(136,226.024890681),new kS.am(137,227.027698859),new kS.am(138,228.028731348),new kS.am(139,229.03175534),new kS.am(140,230.033126574),new kS.am(141,231.03629706),new kS.am(142,232.03805036),new kS.am(143,233.041576923),new kS.am(144,234.043595497),new kS.am(145,235.04750442),new kS.am(146,236.04971),new kS.am(147,237.053894),new kS.am(148,238.056243)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(122,213.021183209),new kS.am(123,214.02073923),new kS.am(124,215.019097612),new kS.am(125,216.019109649),new kS.am(126,217.018288571),new kS.am(127,218.020007906),new kS.am(128,219.019880348),new kS.am(129,220.021876493),new kS.am(130,221.021863742),new kS.am(131,222.023726),new kS.am(132,223.023963748),new kS.am(133,224.025614854),new kS.am(134,225.026115172),new kS.am(135,226.02793275),new kS.am(136,227.028793151),new kS.am(137,228.031036942),new kS.am(138,229.032088601),new kS.am(139,230.034532562),new kS.am(140,231.035878898),new kS.am(141,232.03858172),new kS.am(142,233.040240235),new kS.am(143,234.043302325),new kS.am(144,235.045436759),new kS.am(145,236.048675176),new kS.am(146,237.05113943),new kS.am(147,238.054497046),new kS.am(148,239.05713),new kS.am(149,240.06098)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(126,218.023487),new kS.am(127,219.024915423),new kS.am(128,220.024712),new kS.am(129,221.026351),new kS.am(130,222.02607),new kS.am(131,223.027722956),new kS.am(132,224.027590139),new kS.am(133,225.029384369),new kS.am(134,226.02933975),new kS.am(135,227.031140069),new kS.am(136,228.031366357),new kS.am(137,229.033496137),new kS.am(138,230.033927392),new kS.am(139,231.036289158),new kS.am(140,232.03714628),new kS.am(141,233.039628196),new kS.am(142,234.040945606),new kS.am(143,235.043923062),new kS.am(144,236.045561897),new kS.am(145,237.048723955),new kS.am(146,238.050782583),new kS.am(147,239.054287777),new kS.am(148,240.056585734),new kS.am(149,241.06033),new kS.am(150,242.062925)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(132,225.033899689),new kS.am(133,226.035129),new kS.am(134,227.034958261),new kS.am(135,228.03618),new kS.am(136,229.036246866),new kS.am(137,230.037812591),new kS.am(138,231.038233161),new kS.am(139,232.040099),new kS.am(140,233.04073235),new kS.am(141,234.042888556),new kS.am(142,235.044055876),new kS.am(143,236.046559724),new kS.am(144,237.048167253),new kS.am(145,238.050940464),new kS.am(146,239.052931399),new kS.am(147,240.056168828),new kS.am(148,241.058246266),new kS.am(149,242.061635),new kS.am(150,243.064273),new kS.am(151,244.06785)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(134,228.038727686),new kS.am(135,229.040138934),new kS.am(136,230.039645603),new kS.am(137,231.041258),new kS.am(138,232.041179445),new kS.am(139,233.04298757),new kS.am(140,234.043304681),new kS.am(141,235.0452815),new kS.am(142,236.046048088),new kS.am(143,237.048403774),new kS.am(144,238.0495534),new kS.am(145,239.052156519),new kS.am(146,240.05380746),new kS.am(147,241.056845291),new kS.am(148,242.058736847),new kS.am(149,243.061997013),new kS.am(150,244.06419765),new kS.am(151,245.067738657),new kS.am(152,246.070198429),new kS.am(153,247.07407)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(136,231.04556),new kS.am(137,232.04659),new kS.am(138,233.046472),new kS.am(139,234.047794),new kS.am(140,235.048029),new kS.am(141,236.049569),new kS.am(142,237.049970748),new kS.am(143,238.051977839),new kS.am(144,239.053018481),new kS.am(145,240.055287826),new kS.am(146,241.056822944),new kS.am(147,242.059543039),new kS.am(148,243.061372686),new kS.am(149,244.064279429),new kS.am(150,245.066445398),new kS.am(151,246.069768438),new kS.am(152,247.072086),new kS.am(153,248.075745),new kS.am(154,249.07848)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(137,233.0508),new kS.am(138,234.05024),new kS.am(139,235.051591),new kS.am(140,236.051405),new kS.am(141,237.052891),new kS.am(142,238.053016298),new kS.am(143,239.054951),new kS.am(144,240.055519046),new kS.am(145,241.057646736),new kS.am(146,242.058829326),new kS.am(147,243.061382249),new kS.am(148,244.062746349),new kS.am(149,245.065485586),new kS.am(150,246.067217551),new kS.am(151,247.070346811),new kS.am(152,248.072342247),new kS.am(153,249.075947062),new kS.am(154,250.078350687),new kS.am(155,251.082277873),new kS.am(156,252.08487)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(138,235.05658),new kS.am(139,236.05733),new kS.am(140,237.057127),new kS.am(141,238.058266),new kS.am(142,239.058362),new kS.am(143,240.059749),new kS.am(144,241.060223),new kS.am(145,242.06205),new kS.am(146,243.06300157),new kS.am(147,244.065167882),new kS.am(148,245.066355386),new kS.am(149,246.068666836),new kS.am(150,247.070298533),new kS.am(151,248.07308),new kS.am(152,249.074979937),new kS.am(153,250.078310529),new kS.am(154,251.08075344),new kS.am(155,252.084303),new kS.am(156,253.08688),new kS.am(157,254.0906)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(139,237.06207),new kS.am(140,238.06141),new kS.am(141,239.062579),new kS.am(142,240.062295),new kS.am(143,241.063716),new kS.am(144,242.063688713),new kS.am(145,243.065421),new kS.am(146,244.06599039),new kS.am(147,245.068039),new kS.am(148,246.068798807),new kS.am(149,247.070992043),new kS.am(150,248.07217808),new kS.am(151,249.074846818),new kS.am(152,250.076399951),new kS.am(153,251.079580056),new kS.am(154,252.081619582),new kS.am(155,253.085126791),new kS.am(156,254.087316198),new kS.am(157,255.091039),new kS.am(158,256.09344)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(141,240.06892),new kS.am(142,241.068662),new kS.am(143,242.069699),new kS.am(144,243.069631),new kS.am(145,244.070969),new kS.am(146,245.071317),new kS.am(147,246.072965),new kS.am(148,247.07365),new kS.am(149,248.075458),new kS.am(150,249.076405),new kS.am(151,250.078654),new kS.am(152,251.079983592),new kS.am(153,252.082972247),new kS.am(154,253.084817974),new kS.am(155,254.088016026),new kS.am(156,255.090266386),new kS.am(157,256.093592),new kS.am(158,257.095979)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(142,242.07343),new kS.am(143,243.07451),new kS.am(144,244.074077),new kS.am(145,245.075375),new kS.am(146,246.075281634),new kS.am(147,247.076819),new kS.am(148,248.077184411),new kS.am(149,249.079024),new kS.am(150,250.079514759),new kS.am(151,251.081566467),new kS.am(152,252.082460071),new kS.am(153,253.085176259),new kS.am(154,254.086847795),new kS.am(155,255.089955466),new kS.am(156,256.091766522),new kS.am(157,257.095098635),new kS.am(158,258.097069),new kS.am(159,259.100588)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(144,245.081017),new kS.am(145,246.081933),new kS.am(146,247.081804),new kS.am(147,248.082909),new kS.am(148,249.083002),new kS.am(149,250.084488),new kS.am(150,251.084919),new kS.am(151,252.08663),new kS.am(152,253.08728),new kS.am(153,254.089725),new kS.am(154,255.091075196),new kS.am(155,256.094052757),new kS.am(156,257.095534643),new kS.am(157,258.098425321),new kS.am(158,259.100503),new kS.am(159,260.103645)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(147,249.087823),new kS.am(148,250.087493),new kS.am(149,251.08896),new kS.am(150,252.088965909),new kS.am(151,253.090649),new kS.am(152,254.090948746),new kS.am(153,255.093232449),new kS.am(154,256.094275879),new kS.am(155,257.096852778),new kS.am(156,258.0982),new kS.am(157,259.101024),new kS.am(158,260.102636),new kS.am(159,261.105743),new kS.am(160,262.10752)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(148,251.09436),new kS.am(149,252.09533),new kS.am(150,253.095258),new kS.am(151,254.096587),new kS.am(152,255.096769),new kS.am(153,256.098763),new kS.am(154,257.099606),new kS.am(155,258.101883),new kS.am(156,259.10299),new kS.am(157,260.105572),new kS.am(158,261.106941),new kS.am(159,262.109692),new kS.am(160,263.111394)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(149,253.100679),new kS.am(150,254.100166),new kS.am(151,255.101492),new kS.am(152,256.101179573),new kS.am(153,257.103072),new kS.am(154,258.103568),new kS.am(155,259.105628),new kS.am(156,260.106434),new kS.am(157,261.108752),new kS.am(158,262.109918),new kS.am(159,263.11254),new kS.am(160,264.113978)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(150,255.107398),new kS.am(151,256.10811),new kS.am(152,257.107858),new kS.am(153,258.109438),new kS.am(154,259.109721),new kS.am(155,260.111427),new kS.am(156,261.112106),new kS.am(157,262.114153),new kS.am(158,263.115078),new kS.am(159,264.117473),new kS.am(160,265.118659)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(152,258.113151),new kS.am(153,259.114652),new kS.am(154,260.114435447),new kS.am(155,261.116199),new kS.am(156,262.116477),new kS.am(157,263.118313),new kS.am(158,264.118924),new kS.am(159,265.121066),new kS.am(160,266.121928)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(153,260.121803),new kS.am(154,261.1218),new kS.am(155,262.123009),new kS.am(156,263.123146),new kS.am(157,264.12473),new kS.am(158,265.125198),new kS.am(159,266.127009),new kS.am(160,267.12774)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(155,263.12871),new kS.am(156,264.128408258),new kS.am(157,265.130001),new kS.am(158,266.130042),new kS.am(159,267.131774),new kS.am(160,268.132156),new kS.am(161,269.134114)]),WC(IC(fS.jE,1),$T,3,0,[new kS.am(156,265.136567),new kS.am(157,266.13794),new kS.am(158,267.137526),new kS.am(159,268.138816),new kS.am(160,269.139106),new kS.am(161,270.140723),new kS.am(162,271.141229)])])};
kS.dm=function dm(a,b){kS.cm();var c,d;d=b-a;for(c=0;c<kS.bm[a].length;c++)if(kS.bm[a][c].b==d)return kS.bm[a][c].a;return NaN};kS.hm=function hm(){kS.hm=pH;kS.gm=WC(IC(fS.MD,1),_S,5,15,[0,1.00794,4.0026,6.941,9.0122,10.811,12.011,14.007,15.999,18.998,20.18,22.99,24.305,26.982,28.086,30.974,32.066,35.453,39.948,39.098,40.078,44.956,47.867,50.942,51.996,54.938,55.845,58.933,58.693,63.546,65.39,69.723,72.61,74.922,78.96,79.904,83.8,85.468,87.62,88.906,91.224,92.906,95.94,98.906,101.07,102.91,106.42,107.87,112.41,114.82,118.71,121.76,127.6,126.9,131.29,132.91,137.33,138.91,140.12,140.91,144.24,146.92,150.36,151.96,157.25,158.93,162.5,164.93,167.26,168.93,173.04,174.97,178.49,180.95,183.84,186.21,190.23,192.22,195.08,196.97,200.59,204.38,207.2,208.98,209.98,209.99,222.02,223.02,226.03,227.03,232.04,231.04,238.03,237.05,239.05,241.06,244.06,249.08,252.08,252.08,257.1,258.1,259.1,262.11,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2.0141,3.016,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);kS.em=WC(IC(fS.MD,1),_S,5,15,[0,1.007825,4.0026,7.016003,9.012182,11.009305,12,14.003074,15.994915,18.998403,19.992435,22.989767,23.985042,26.98153,27.976927,30.973762,31.97207,34.968852,39.962384,38.963707,39.962591,44.95591,47.947947,50.943962,51.940509,54.938047,55.934939,58.933198,57.935346,62.939598,63.929145,68.92558,73.921177,74.921594,79.91652,78.918336,83.911507,84.911794,87.905619,88.905849,89.904703,92.906377,97.905406,89.92381,101.904348,102.9055,105.903478,106.905092,113.903357,114.90388,119.9022,120.903821,129.906229,126.904473,131.904144,132.905429,137.905232,138.906346,139.905433,140.907647,141.907719,135.92398,151.919729,152.921225,157.924099,158.925342,163.929171,164.930319,165.93029,168.934212,173.938859,174.94077,179.946545,180.947992,183.950928,186.955744,191.961467,192.962917,194.964766,196.966543,201.970617,204.974401,207.976627,208.980374,193.98818,195.99573,199.9957,201.00411,206.0038,210.00923,232.038054,216.01896,238.050784,229.03623,232.041169,237.05005,238.05302,242.06194,240.06228,243.06947,243.07446,248.08275,251.08887,253.09515,257.10295,257.10777,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2.014,3.01605,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);kS.fm=WC(IC(fS.OD,1),YS,5,15,[6,1,7,8])};kS.im=function im(a){var b,c;c=a.a;for(b=0;b<a.b.length;b++)c+=a.b[b]*kS.em[a.c[b]];return c};kS.jm=function jm(a){var b,c;b=new gS.KK;for(c=0;c<a.b.length;c++){gS.JK(b,(kS.dh(),kS.Zg)[a.c[c]]);a.b[c]>1&&gS.JK(b,''+a.b[c])}return b.a};kS.km=function km(a){var b,c;c=a.d;for(b=0;b<a.b.length;b++)c+=a.b[b]*kS.gm[a.c[b]];return c};kS.lm=function lm(a){var b,c,d,e,f,g,h,i,j,k,l;kS.Qo(a,1);e=OC(fS.OD,YS,5,191,15,1);for(c=0;c<a.o;c++){switch(a.A[c]){case 171:e[1]+=5;e[6]+=3;e[7]+=1;e[8]+=1;break;case 172:e[1]+=12;e[6]+=6;e[7]+=4;e[8]+=1;break;case 173:e[1]+=6;e[6]+=4;e[7]+=2;e[8]+=2;break;case 174:e[1]+=5;e[6]+=4;e[7]+=1;e[8]+=3;break;case 175:e[1]+=5;e[6]+=3;e[7]+=1;e[8]+=1;e[16]+=1;break;case 176:e[1]+=8;e[6]+=5;e[7]+=2;e[8]+=2;break;case 177:e[1]+=7;e[6]+=5;e[7]+=1;e[8]+=3;break;case 178:e[1]+=3;e[6]+=2;e[7]+=1;e[8]+=1;break;case 179:e[1]+=7;e[6]+=6;e[7]+=3;e[8]+=1;break;case 181:case 180:e[1]+=11;e[6]+=6;e[7]+=1;e[8]+=1;break;case 182:e[1]+=12;e[6]+=6;e[7]+=2;e[8]+=1;break;case 183:e[1]+=9;e[6]+=5;e[7]+=1;e[8]+=1;e[16]+=1;break;case 184:e[1]+=9;e[6]+=9;e[7]+=1;e[8]+=1;break;case 185:e[1]+=7;e[6]+=5;e[7]+=1;e[8]+=1;break;case 186:e[1]+=5;e[6]+=3;e[7]+=1;e[8]+=2;break;case 187:e[1]+=7;e[6]+=4;e[7]+=1;e[8]+=2;break;case 188:e[1]+=10;e[6]+=11;e[7]+=2;e[8]+=1;break;case 189:e[1]+=9;e[6]+=9;e[7]+=1;e[8]+=2;break;case 190:e[1]+=9;e[6]+=5;e[7]+=1;e[8]+=1;break;case 1:switch(a.v[c]){case 0:case 1:++e[1];break;case 2:++e[151];break;case 3:++e[152];}break;default:++e[a.A[c]];}}for(d=0;d<a.o;d++)a.A[d]>=171&&a.A[d]<=190?(e[1]+=2-kS.Yk(a,d)):(e[1]+=kS.Tk(a,d));h=0;for(j=1;j<=190;j++)e[j]!=0&&++h;this.b=OC(fS.OD,YS,5,h,15,1);this.c=OC(fS.OD,YS,5,h,15,1);h=0;for(i=0;i<kS.fm.length;i++){if(e[kS.fm[i]]!=0){this.b[h]=e[kS.fm[i]];this.c[h]=kS.fm[i];++h;e[kS.fm[i]]=0}}while(true){l='zzz';k=-1;for(g=1;g<=190;g++)if(e[g]>0&&gS.oK(l,(kS.dh(),kS.Zg)[g])>0){l=(kS.dh(),kS.Zg)[g];k=g}if(k==-1)break;this.b[h]=e[k];this.c[h]=k;++h;e[k]=0}this.a=0;this.d=0;for(b=0;b<a.d;b++){if(a.A[b]!=1&&a.v[b]!=0){g=a.A[b];f=a.v[b];this.a+=kS.dm(g,f)-kS.em[g];this.d+=kS.dm(g,f)-kS.gm[g]}}};nH(118,1,{});_.a=0;_.d=0;fS.kE=YI(118);kS.mm=function mm(a){a.a=new zS.gL('0.0000')};kS.nm=function nm(a,b){var c,d;d=zS.eL(a.a,b);for(c=gS.GK(d).length;c<10;c++)gS.LK(a.b,32);gS.OK(a.b,d)};kS.om=function om(a,b){var c,d,e;if(b<0||b>999){gS.OK(a.b,'  ?');return}c=false;for(d=0;d<3;d++){e=b/100|0;if(e==0){d==2||c?gS.LK(a.b,48):gS.LK(a.b,32)}else{gS.LK(a.b,48+e&TS);c=true}b=10*(b%100)}};kS.pm=function pm(a){kS.qm.call(this,a)};kS.qm=function qm(a){kS.rm.call(this,a,new gS.SK)};kS.rm=function rm(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T;kS.mm(this);kS.Qo(a,7);H=true;for(d=0;d<a.d;d++){if((a.s[d]&3)!=0&&(a.s[d]&3)!=3&&(a.s[d]&xT)>>19!=1){H=false;break}}J=-1;if(H){A=OC(fS.OD,YS,5,32,15,1);for(e=0;e<a.d;e++){if((a.s[e]&3)!=0&&(a.s[e]&3)!=3&&(a.s[e]&xT)>>19==1){C=(a.s[e]&xT)>>19!=1&&(a.s[e]&xT)>>19!=2?-1:(a.s[e]&PT)>>21;++A[C];0<A[C]&&(J=C);break}}}this.b=b;L=a.M!=null?a.M:'';gS.OK(this.b,L+ES);gS.OK(this.b,'Actelion Java MolfileCreator 1.0\n\n');kS.om(this,a.o);kS.om(this,a.p);gS.OK(this.b,'  0  0');kS.om(this,H?0:1);gS.OK(this.b,'  0  0  0  0  0999 V2000\n');D=a.o==1;for(g=1;g<a.o;g++){if(a.H[g].a!=a.H[0].a||a.H[g].b!=a.H[0].b||a.H[g].c!=a.H[0].c){D=true;break}}B=1;if(D){p=kS.ci(a,a.o,a.p,(kS.dh(),kS.bh));if(p!=0){(p<1||p>3)&&(B=1.5/p)}else{K=ST;for(e=1;e<a.o;e++){for(f=0;f<e;f++){u=a.H[f].a-a.H[e].a;v=a.H[f].b-a.H[e].b;w=a.H[f].c-a.H[e].c;t=u*u+v*v+w*w;K>t&&(K=t)}}B=3/K}}for(h=0;h<a.o;h++){if(D){kS.nm(this,B*a.H[h].a);kS.nm(this,B*-a.H[h].b);kS.nm(this,B*-a.H[h].c)}else{gS.OK(this.b,'    0.0000    0.0000    0.0000')}if((a.t==null?null:a.t[h])!=null)gS.OK(this.b,' L  ');else if((a.w[h]&1)!=0)gS.OK(this.b,' A  ');else{n=(kS.dh(),kS.Zg)[a.A[h]];gS.OK(this.b,' '+n);gS.GK(n).length==1?gS.OK(this.b,'  '):gS.GK(n).length==2&&gS.OK(this.b,' ')}gS.OK(this.b,' 0  0  0');F=jT&a.w[h];F==0?gS.OK(this.b,'  0'):F==384?gS.OK(this.b,'  3'):F==128?gS.OK(this.b,'  2'):F==1792?gS.OK(this.b,'  1'):F==1664&&gS.OK(this.b,'  2');gS.OK(this.b,(a.w[h]&JT)!=0?'  1':'  0');T=((a.s[h]&OT)>>>28)-1;T==-1?gS.OK(this.b,'  0'):T==0?gS.OK(this.b,' 15'):kS.om(this,T);gS.OK(this.b,'  0  0  0');kS.om(this,gS._J(a.u[h]));gS.OK(this.b,'  0  0\n')}for(q=0;q<a.p;q++){switch(a.F[q]){case 1:N=1;Q=0;break;case 2:N=2;Q=0;break;case 4:N=3;Q=0;break;case 9:N=1;Q=6;break;case 17:N=1;Q=1;break;case 26:N=2;Q=3;break;case 64:N=4;Q=0;break;case 32:N=8;Q=0;break;default:N=1;Q=0;}H&&(Q==1||Q==6)&&kS.Ph(a,a.B[0][q])!=J&&(Q=0);r=a.D[q]&31;r!=0&&(r==8?(N=4):r==3?(N=5):r==9?(N=6):r==10?(N=7):(N=8));P=a.D[q]&96;S=P==0?0:P==64?1:2;kS.om(this,1+a.B[0][q]);kS.om(this,1+a.B[1][q]);kS.om(this,N);kS.om(this,Q);gS.OK(this.b,'  0');kS.om(this,S);gS.OK(this.b,'  0\n')}M=0;for(i=0;i<a.o;i++)a.q[i]!=0&&++M;if(M!=0){gS.OK(this.b,'M  CHG');kS.om(this,M);for(e=0;e<a.o;e++){if(a.q[e]!=0){gS.OK(this.b,' ');kS.om(this,e+1);s=a.q[e];if(s<0){gS.OK(this.b,'  -');s=-s}else gS.OK(this.b,'   ');gS.LK(this.b,48+s&TS)}}gS.OK(this.b,ES)}M=0;for(j=0;j<a.o;j++)a.v[j]==0||++M;if(M!=0){gS.OK(this.b,'M  ISO');kS.om(this,M);for(e=0;e<a.o;e++){if(a.v[e]!=0){gS.OK(this.b,' ');kS.om(this,e+1);gS.OK(this.b,' ');kS.om(this,a.v[e])}}gS.OK(this.b,ES)}M=0;for(k=0;k<a.o;k++)(a.s[k]&48)!=0&&++M;if(M!=0){gS.OK(this.b,'M  RAD');kS.om(this,M);for(c=0;c<a.o;c++){if((a.s[c]&48)!=0){gS.OK(this.b,' ');kS.om(this,c+1);switch(a.s[c]&48){case 16:gS.OK(this.b,'   1');break;case 32:gS.OK(this.b,'   2');break;case 48:gS.OK(this.b,'   3');}}}gS.OK(this.b,ES)}if(a.I){M=0;for(e=0;e<a.o;e++)(a.w[e]&120)!=0&&++M;if(M!=0){gS.OK(this.b,'M  RBD');kS.om(this,M);for(f=0;f<a.o;f++){O=a.w[f]&120;if(O!=0){gS.OK(this.b,' ');kS.om(this,f+1);switch(O){case 112:gS.OK(this.b,'  -1');break;case 8:gS.OK(this.b,'   1');break;case 104:gS.OK(this.b,'   2');break;case 88:gS.OK(this.b,'   3');break;case 56:gS.OK(this.b,'   4');}}}gS.OK(this.b,ES)}for(l=0;l<a.o;l++){o=a.t==null?null:a.t[l];if(o!=null){gS.OK(this.b,'M  ALS ');kS.om(this,l+1);kS.om(this,o.length);gS.OK(this.b,(a.w[l]&1)!=0?' T ':' F ');for(G=0;G<o.length;G++){I=(kS.dh(),kS.Zg)[o[G]];switch(gS.GK(I).length){case 1:gS.OK(this.b,I+'   ');break;case 2:gS.OK(this.b,I+'  ');break;case 3:gS.OK(this.b,I+' ');break;default:gS.OK(this.b,'   ?');}}gS.OK(this.b,ES)}}M=0;for(m=0;m<a.o;m++)(a.w[m]&6144)!=0&&++M;if(M!=0){gS.OK(this.b,'M  SUB');kS.om(this,M);for(c=0;c<a.o;c++){R=a.w[c]&6144;if(R!=0){gS.OK(this.b,' ');kS.om(this,c+1);(R&hT)!=0?gS.OK(this.b,'   '+(a.c[c]+1)):gS.OK(this.b,'  -2')}}gS.OK(this.b,ES)}}gS.OK(this.b,'M  END\n')};nH(68,1,{},kS.pm);fS.mE=YI(68);kS.sm=function sm(a,b,c,d,e,f){var g,h,i,j;j=1;h=false;switch(e){case 1:j=17;break;case 3:j=26;break;case 4:j=17;h=true;break;case 6:j=9;break;default:switch(d){case 1:j=1;break;case 2:j=2;break;case 3:j=4;break;case 4:j=64;break;case 8:a.f&&(j=32);break;case 9:j=32;}}g=kS.hh(a.e,b,c,j);i=0;h&&kS.pj(a.e,b,1,-1);if(d>4){switch(d){case 5:i|=3;break;case 6:i|=9;break;case 7:i|=10;break;case 8:a.f||(i|=31);}}f==1&&(i|=64);f==2&&(i|=32);i!=0&&kS.Mj(a.e,g,i,true);return g};kS.tm=function tm(a){var b,c,d,e,f,g,h,i,j,k,l;g=OC(fS.OD,YS,5,a.e.o,15,1);for(c=0;c<a.e.o;c++)g[c]=-kS.Lh(a.e,c);kS.Yd(new kS.fe(a.e),null,true);for(d=0;d<a.e.o;d++)g[d]+=kS.Lh(a.e,d);for(b=0;b<a.e.o;b++){if(g[b]!=0){h=-g[b];for(e=0;e<a.e.p;e++){for(j=0;j<2;j++){if(h>0&&kS.pi(a.e,e)==32&&kS.ei(a.e,1-j,e)==b){l=kS.ei(a.e,j,e);if(kS.Oi(a.e,l)){k=kS.vm(a,l);f=kS.Lh(a.e,l);if(f<k){i=h<k-f?h:k-f;kS.kj(a.e,l,f+i);h-=i}}}}}}}};kS.um=function um(a,b){a.e=null;return kS.Km(a,new xS.fI(new xS.iI(b)))?a.e:null};kS.vm=function vm(a,b){var c,d;c=kS.ai(a.e,b);d=c<(kS.dh(),kS._g).length?kS._g[c]:null;return d==null?0:d[d.length-1]};kS.wm=function wm(a,b){var c;c=!a.a?null:AS.gN(a.a,new gS.RJ(b));return !c?b-1:c.a};kS.xm=function xm(a,b){var c;c=!a.b?null:AS.gN(a.b,new gS.RJ(b));return !c?b-1:c.a};kS.ym=function ym(a,b){var c;if(b==-1){return -1}for(c=b+1;c<gS.GK(a).length;c++){if(gS.GK(a).charCodeAt(c)!=32&&gS.GK(a).charCodeAt(c)!=9){return c}}return -1};kS.zm=function zm(a,b){var c;for(c=b;c<gS.GK(a).length;c++){if(gS.GK(a).charCodeAt(c)==32||gS.GK(a).charCodeAt(c)==9){return c}}return -1};kS.Am=function Am(a){if(gS.GK(a).indexOf('ATOMS=(')!=-1)return _T;if(gS.GK(a).indexOf('BONDS=(')!=-1)return 'BONDS';return null};kS.Bm=function Bm(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F;q=(h=kS.zm(b,1),h==-1?gS.GK(b).length:h);d=gS.oJ(gS.GK(b).substr(0,q));p=kS.ym(b,q);q=(i=kS.zm(b,p+1),i==-1?gS.GK(b).length:i);s=gS.GK(b).substr(p,q-p);A=null;e=false;r=kS.Im(b);if(r!=0){A=kS.Cm(b);r<0&&(e=true);q=r<0?-r:r}p=kS.ym(b,q);q=(j=kS.zm(b,p+1),j==-1?gS.GK(b).length:j);C=MJ(gS.GK(b).substr(p,q-p));p=kS.ym(b,q);q=(k=kS.zm(b,p+1),k==-1?gS.GK(b).length:k);D=MJ(gS.GK(b).substr(p,q-p));p=kS.ym(b,q);q=(l=kS.zm(b,p+1),l==-1?gS.GK(b).length:l);F=MJ(gS.GK(b).substr(p,q-p));p=kS.ym(b,q);q=(m=kS.zm(b,p+1),m==-1?gS.GK(b).length:m);u=gS.oJ(gS.GK(b).substr(p,q-p));c=kS.eh(a.e,C,-D,-F);c+1!=d&&(!a.a&&(a.a=new AS.IP),AS.AP(a.a,new gS.RJ(d),new gS.RJ(c)));A!=null&&kS.rj(a.e,c,A,e);u!=0&&kS.sj(a.e,c,u,false);if(gS.sK(s,'A')){kS.wj(a.e,c,1,true)}else if(gS.sK(s,'Q')){t=OC(fS.OD,YS,5,1,15,1);t[0]=6;kS.rj(a.e,c,t,true)}else{kS.Dj(a.e,c,kS.ek(s))}while((p=kS.ym(b,q))!=-1){q=(g=kS.zm(b,p+1),g==-1?gS.GK(b).length:g);v=gS.GK(b).substr(p,q-p);o=gS.wK(v,FK(61));n=gS.GK(v).substr(0,o);B=gS.oJ(gS.GK(v).substr(o+1,gS.GK(v).length-(o+1)));if(gS.sK(n,'CHG')){kS.kj(a.e,c,B)}else if(gS.sK(n,'RAD')){switch(B){case 1:kS.xj(a.e,c,16);break;case 2:kS.xj(a.e,c,32);break;case 3:kS.xj(a.e,c,48);}}else if(gS.sK(n,'CFG'));else if(gS.sK(n,'MASS')){kS.uj(a.e,c,B)}else if(gS.sK(n,'VAL')){kS.ij(a.e,c,B==-1?0:B==0?-1:B)}else if(gS.sK(n,'HCOUNT')){switch(B){case 0:break;case -1:kS.wj(a.e,c,1792,true);break;case 1:kS.wj(a.e,c,128,true);break;case 2:kS.wj(a.e,c,384,true);break;default:kS.wj(a.e,c,896,true);}}else if(gS.sK(n,'SUBST')){if(B==-1){kS.wj(a.e,c,iT,true)}else if(B>0){w=0;for(f=0;f<a.e.p;f++){(kS.ei(a.e,0,f)==c||kS.ei(a.e,1,f)==c)&&++w}B>w&&kS.wj(a.e,c,hT,true)}}else if(gS.sK(n,'RBCNT')){switch(B){case 3:case -1:kS.wj(a.e,c,112,true);break;case 1:kS.wj(a.e,c,8,true);break;case 2:kS.wj(a.e,c,104,true);break;case 4:kS.wj(a.e,c,56,true);}}}};kS.Cm=function Cm(a){var b,c,d,e,f,g,h,i;h=null;c=gS.GK(a).indexOf('[');d=gS.GK(a).indexOf(']',c);if(c>=0&&d>0){b=OC(fS.OD,YS,5,16,15,1);i=gS.GK(a).substr(c+1,d-(c+1));e=0;g=true;while(g&&e<16){c=gS.GK(i).indexOf(',');if(c==-1){f=i;g=false}else{f=gS.GK(i).substr(0,c);i=gS.GK(i).substr(c+1,gS.GK(i).length-(c+1))}b[e++]=kS.ek(f)}h=OC(fS.OD,YS,5,e,15,1);gS.XK(b,h,e)}return h};kS.Dm=function Dm(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t;p=(i=kS.zm(b,1),i==-1?gS.GK(b).length:i);f=gS.oJ(gS.GK(b).substr(0,p));o=kS.ym(b,p);p=(j=kS.zm(b,o+1),j==-1?gS.GK(b).length:j);g=gS.oJ(gS.GK(b).substr(o,p-o));o=kS.ym(b,p);p=(k=kS.zm(b,o+1),k==-1?gS.GK(b).length:k);c=kS.wm(a,gS.oJ(gS.GK(b).substr(o,p-o)));o=kS.ym(b,p);p=(l=kS.zm(b,o+1),l==-1?gS.GK(b).length:l);d=kS.wm(a,gS.oJ(gS.GK(b).substr(o,p-o)));r=0;s=0;while((o=kS.ym(b,p))!=-1){p=(h=kS.zm(b,o+1),h==-1?gS.GK(b).length:h);q=gS.GK(b).substr(o,p-o);n=gS.wK(q,FK(61));m=gS.GK(q).substr(0,n);t=gS.oJ(gS.GK(q).substr(n+1,gS.GK(q).length-(n+1)));if(gS.sK(m,'CFG')){switch(t){case 1:r=1;break;case 2:r=g==2?3:4;break;case 3:r=6;}}else gS.sK(m,'TOPO')?(s=t):undefined}e=kS.sm(a,c,d,g,r,s);e+1!=f&&(!a.b&&(a.b=new AS.IP),AS.AP(a.b,new gS.RJ(f),new gS.RJ(e)))};kS.Em=function Em(a,b){var c,d,e,f,g,h;h=kS.Am(b);if(h!=null){g=kS.Gm(b,h);if(gS.sK(gS.GK(b).substr(0,13),'MDLV30/STEABS')){if(gS.sK(h,_T))for(f=0;f<g.length;f++)kS.pj(a.e,kS.wm(a,g[f]),0,-1);else for(e=0;e<g.length;e++)kS.Hj(a.e,kS.xm(a,g[e]),0,-1)}else if(gS.sK(gS.GK(b).substr(0,13),'MDLV30/STERAC')){d=gS.oJ(gS.CK(b,13,kS.zm(b,13)));if(gS.sK(h,_T))for(f=0;f<g.length;f++)kS.pj(a.e,kS.wm(a,g[f]),1,d-1);else for(e=0;e<g.length;e++)kS.Hj(a.e,kS.xm(a,g[e]),1,d-1)}else if(gS.sK(gS.GK(b).substr(0,13),'MDLV30/STEREL')){d=gS.oJ(gS.CK(b,13,kS.zm(b,13)));if(gS.sK(h,_T))for(f=0;f<g.length;f++)kS.pj(a.e,kS.wm(a,g[f]),2,d-1);else for(e=0;e<g.length;e++)kS.Hj(a.e,kS.xm(a,g[e]),2,d-1)}else if(gS.sK(gS.GK(b).substr(0,13),'MDLV30/HILITE')){if(gS.sK(h,_T)){for(e=0;e<g.length;e++)kS.lj(a.e,kS.wm(a,g[e]),448)}else{for(e=0;e<g.length;e++){c=kS.xm(a,g[e]);kS.lj(a.e,kS.ei(a.e,0,c),448);kS.lj(a.e,kS.ei(a.e,1,c),448)}}}}};kS.Fm=function Fm(a,b){var c,d,e;if(!a.e){if(gS.sK(gS.GK(b).substr(0,6),'COUNTS')){c=kS.ym(b,kS.zm(b,7));d=gS.oJ(gS.CK(b,7,kS.zm(b,7)));e=gS.oJ(gS.CK(b,c,kS.zm(b,c)));a.e=new kS.ep(d,e)}}};kS.Gm=function Gm(a,b){var c,d,e,f,g,h;f=gS.GK(a).indexOf(b+'=(')+gS.GK(b).length+2;g=gS.xK(a,FK(41),f);e=kS.zm(a,f);c=gS.oJ(gS.GK(a).substr(f,e-f));h=OC(fS.OD,YS,5,c,15,1);for(d=0;d<c;d++){f=kS.ym(a,e);e=kS.zm(a,f);(e==-1||e>g)&&(e=g);h[d]=gS.oJ(gS.GK(a).substr(f,e-f))}return h};kS.Hm=function Hm(a){var b,c,d,e,f,g,h,i,j;i=OC(fS.OD,YS,5,a.e.o,15,1);for(d=0;d<a.e.p;d++)if(kS.pi(a.e,d)==64)for(g=0;g<2;g++)i[kS.ei(a.e,g,d)]=1;for(e=0;e<a.e.p;e++){j=kS.mi(a.e,e);for(f=0;f<2;f++)i[kS.ei(a.e,f,e)]+=j}for(c=0;c<a.e.p;c++){if(kS.mi(a.e,c)==1){for(f=0;f<2;f++){h=kS.ei(a.e,1-f,c);if(kS.Oi(a.e,h)){b=kS.ei(a.e,f,c);if(kS.Li(a.e,b)&&i[b]>kS.ti(a.e,b)){kS.Nj(a.e,c,32);continue}}}}}};kS.Im=function Im(a){var b,c;if(gS.GK(a).indexOf('[')>=0){b=gS.GK(a).indexOf(' NOT[');c=gS.GK(a).indexOf(']',b);if(b>=0&&c>0){return -(c+1)}else{b=gS.GK(a).indexOf(' [');c=gS.GK(a).indexOf(']',b);if(b>=0&&c>0){return c+1}}b=gS.GK(a).indexOf(" 'NOT[");c=gS.GK(a).indexOf("]'",b);if(b>=0&&c>0){return -(c+2)}else{b=gS.GK(a).indexOf(" '[");c=gS.GK(a).indexOf("]'",b);if(b>=0&&c>0){return c+2}}gS.WK()}return 0};kS.Jm=function Jm(a){return gS.GK(a).length==0?0:gS.oJ(a)};kS.Km=function Km(b,c){var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X;try{if(b.e){kS.Fh(b.e);kS.Pj(b.e,false)}D=xS.eI(c);if(null==D){return false}if(null==xS.eI(c)){return false}if(null==(w=xS.eI(c))){return false}b.f=gS.GK(w).indexOf("From CSD data. Using bond type 'Any'")!=-1;b.c=gS.GK(w).indexOf('From CSD data.')!=-1;if(null==(w=xS.eI(c))){return false}try{F=gS.oJ(gS.DK(gS.GK(w).substr(0,3)));G=gS.oJ(gS.DK(gS.GK(w).substr(3,3)));H=kS.Jm(gS.DK(gS.GK(w).substr(6,3)));n=kS.Jm(gS.DK(gS.GK(w).substr(12,3)));T=gS.GK(w).length>=39&&gS.sK(gS.GK(w).substr(34,5),'V3000')?3:2}catch(a){a=GG(a);if(AD(a,12)){return false}else throw HG(a)}if(T==3){K=kS.Lm(b,c);kS.Tj(b.e,D);return K}!b.e&&(b.e=new kS.ep(F,G));kS.Tj(b.e,D);n==0&&(b.e.J=true);if(0==F){while(w!=null&&!(gS.sK(w,aU)||gS.sK(w,bU)||gS.sK(gS.GK(w).substr(1,gS.GK(w).length-1),'$'))){w=xS.eI(c)}return true}for(r=0;r<F;r++){if(null==(w=xS.eI(c))){return false}V=MJ(gS.DK(gS.GK(w).substr(0,10)));W=MJ(gS.DK(gS.GK(w).substr(10,10)));X=MJ(gS.DK(gS.GK(w).substr(20,10)));e=kS.eh(b.e,V,-W,-X);v=gS.DK(gS.GK(w).substr(31,3));h=kS.ek(v);kS.Dj(b.e,e,h);gS.sK(v,'A')&&kS.wj(b.e,e,1,true);C=kS.Jm(gS.DK(gS.GK(w).substr(34,2)));C!=0&&kS.uj(b.e,e,(kS.dh(),kS.ah)[h]+C);m=kS.Jm(gS.DK(gS.GK(w).substr(36,3)));m!=0&&kS.kj(b.e,e,4-m);A=gS.GK(w).length<63?0:kS.Jm(gS.DK(gS.GK(w).substr(60,3)));kS.sj(b.e,e,A,false);p=gS.GK(w).length<45?0:kS.Jm(gS.DK(gS.GK(w).substr(42,3)));switch(p){case 0:break;case 1:kS.wj(b.e,e,768,true);break;case 2:kS.wj(b.e,e,128,true);break;case 3:kS.wj(b.e,e,384,true);break;default:kS.wj(b.e,e,896,true);}gS.GK(w).length>=48&&gS.GK(w).charCodeAt(47)==49&&kS.wj(b.e,e,JT,true);S=gS.GK(w).length<51?0:kS.Jm(gS.DK(gS.GK(w).substr(48,3)));switch(S){case 0:break;case 15:kS.ij(b.e,e,0);break;default:kS.ij(b.e,e,S);}}for(s=0;s<G;s++){if(null==(w=xS.eI(c))){return false}f=gS.oJ(gS.DK(gS.GK(w).substr(0,3)))-1;g=gS.oJ(gS.DK(gS.GK(w).substr(3,3)))-1;k=gS.oJ(gS.DK(gS.GK(w).substr(6,3)));M=gS.GK(w).length<12?0:kS.Jm(gS.DK(gS.GK(w).substr(9,3)));Q=gS.GK(w).length<18?0:kS.Jm(gS.DK(gS.GK(w).substr(15,3)));kS.sm(b,f,g,k,M,Q)}for(q=0;q<H;q++){if(null==xS.eI(c)){return false}}if(null==(w=xS.eI(c))){if(n==0){(b.d&1)!=0&&kS.Rk(b.e);kS.Qo(b.e,7)}return true}while(w!=null&&!(gS.sK(w,aU)||gS.sK(w,bU))){if(gS.sK(gS.GK(w).substr(0,6),'M  CHG')){t=gS.oJ(gS.DK(gS.GK(w).substr(6,3)));if(t>0){d=10;U=14;for(u=1;u<=t;++u,d+=8,U+=8){e=gS.oJ(gS.DK(gS.GK(w).substr(d,d+3-d)))-1;l=gS.oJ(gS.DK(gS.GK(w).substr(U,U+3-U)));kS.kj(b.e,e,l)}}}if(gS.sK(gS.GK(w).substr(0,6),'M  ISO')){t=gS.oJ(gS.DK(gS.GK(w).substr(6,3)));if(t>0){d=10;U=14;for(u=1;u<=t;++u,d+=8,U+=8){e=gS.oJ(gS.DK(gS.GK(w).substr(d,d+3-d)))-1;B=gS.oJ(gS.DK(gS.GK(w).substr(U,U+3-U)));kS.uj(b.e,e,B)}}}if(gS.sK(gS.GK(w).substr(0,6),'M  RAD')){t=gS.oJ(gS.DK(gS.GK(w).substr(6,3)));if(t>0){d=10;U=14;for(u=1;u<=t;++u,d+=8,U+=8){e=gS.oJ(gS.DK(gS.GK(w).substr(d,d+3-d)))-1;J=gS.oJ(gS.DK(gS.GK(w).substr(U,U+3-U)));switch(J){case 1:kS.xj(b.e,e,16);break;case 2:kS.xj(b.e,e,32);break;case 3:kS.xj(b.e,e,48);}}}}if(gS.sK(gS.GK(w).substr(0,6),'M  RBD')){t=gS.oJ(gS.DK(gS.GK(w).substr(6,3)));if(t>0){d=10;U=14;for(u=1;u<=t;++u,d+=8,U+=8){e=gS.oJ(gS.DK(gS.GK(w).substr(d,d+3-d)))-1;L=gS.oJ(gS.DK(gS.GK(w).substr(U,U+3-U)));switch(L){case 3:case -1:kS.wj(b.e,e,112,true);break;case 1:kS.wj(b.e,e,8,true);break;case 2:kS.wj(b.e,e,104,true);break;case 4:kS.wj(b.e,e,56,true);}}}}if(gS.sK(gS.GK(w).substr(0,6),'M  ALS')){e=gS.oJ(gS.DK(gS.GK(w).substr(7,3)))-1;if(e>=0){I=gS.oJ(gS.DK(gS.GK(w).substr(10,3)));i=gS.GK(w).charCodeAt(14)==84;R=OC(fS.OD,YS,5,I,15,1);d=16;for(u=0;u<I;++u,d+=4){P=gS.DK(gS.GK(w).substr(d,d+4-d));R[u]=kS.ek(P)}kS.rj(b.e,e,R,i)}}if(gS.sK(gS.GK(w).substr(0,6),'M  SUB')){t=gS.oJ(gS.DK(gS.GK(w).substr(6,3)));if(t>0){d=10;U=14;for(u=1;u<=t;++u,d+=8,U+=8){e=gS.oJ(gS.DK(gS.GK(w).substr(d,d+3-d)))-1;N=gS.oJ(gS.DK(gS.GK(w).substr(U,U+3-U)));if(N==-2){kS.wj(b.e,e,iT,true)}else if(N>0){O=0;for(j=0;j<b.e.p;j++){(kS.ei(b.e,0,j)==e||kS.ei(b.e,1,j)==e)&&++O}N>O&&kS.wj(b.e,e,hT,true)}}}}w=xS.eI(c)}}catch(a){a=GG(a);if(AD(a,12)){o=a;gS.qA(o,(gS.WK(),gS.VK),'');return false}else throw HG(a)}if(b.c){kS.Hm(b);kS.tm(b)}(b.d&1)!=0&&kS.Rk(b.e);kS.Qo(b.e,7);return true};kS.Lm=function Lm(a,b){var c,d,e,f,g;!!a.a&&AS.tP(a.a);!!a.b&&AS.tP(a.b);e=0;d=xS.eI(b);while(d!=null&&gS.sK(gS.GK(d).substr(0,7),cU)){d=gS.DK(gS.GK(d).substr(7,gS.GK(d).length-7));while(g=gS.GK('-').length,gS.sK(gS.GK(d).substr(gS.GK(d).length-g,g),'-')){c=xS.eI(b);if(!gS.sK(gS.GK(c).substr(0,7),cU)){return false}d=gS.DK(gS.qK(gS.CK(d,0,gS.GK(d).length-1),gS.GK(c).substr(7,gS.GK(c).length-7)))}if(gS.sK(gS.GK(d).substr(0,5),'BEGIN')){f=gS.DK(gS.GK(d).substr(6,gS.GK(d).length-6));if(gS.sK(gS.GK(f).substr(0,4),'CTAB')){e=1}else if(gS.sK(gS.GK(f).substr(0,4),'ATOM')){e=2}else if(gS.sK(gS.GK(f).substr(0,4),'BOND')){e=3}else if(gS.sK(gS.GK(f).substr(0,10),'COLLECTION')){e=4}else{return false}}else if(gS.sK(gS.GK(d).substr(0,3),'END')){e=0}else if(e==1){kS.Fm(a,d)}else if(e==2){kS.Bm(a,d)}else if(e==3){kS.Dm(a,d)}else if(e==4){kS.Em(a,d)}else{return false}d=xS.eI(b)}while(d!=null&&!(gS.sK(gS.GK(d).substr(0,6),aU)||gS.sK(d,bU))){d=xS.eI(b)}return true};kS.Mm=function Mm(){this.d=0};nH(84,1,{},kS.Mm);_.c=false;_.d=0;_.f=false;fS.nE=YI(84);kS.Nm=function Nm(a){};kS.Om=function Om(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G,H,I;gS.OK(a.a,'M  V30 BEGIN CTAB\n');gS.OK(a.a,'M  V30 COUNTS '+b.o+' '+b.p+' 0 0 0\n');gS.OK(a.a,'M  V30 BEGIN ATOM\n');for(i=0;i<b.o;i++){gS.OK(a.a,cU+(i+1));if((b.t==null?null:b.t[i])!=null){k=b.t==null?null:b.t[i];t=(b.w[i]&1)!=0;gS.OK(a.a,t?' NOT[':' [');for(r=0;r<k.length;r++){r>0&&gS.OK(a.a,',');s=(kS.dh(),kS.Zg)[k[r]];switch(gS.GK(s).length){case 2:case 3:case 1:gS.OK(a.a,s);break;default:gS.OK(a.a,'?');}}gS.OK(a.a,']')}else (b.w[i]&1)!=0?gS.OK(a.a,' A'):gS.OK(a.a,' '+(kS.dh(),kS.Zg)[b.A[i]]);if(c){gS.OK(a.a,' '+JD(US*a.b*b.H[i].a)/US);gS.OK(a.a,' '+JD(US*a.b*-b.H[i].b)/US);gS.OK(a.a,' '+JD(US*a.b*-b.H[i].c)/US)}else{gS.OK(a.a,' 0 0 0')}gS.OK(a.a,' '+gS._J(b.u[i]));b.q[i]!=0&&gS.OK(a.a,' CHG='+b.q[i]);if((b.s[i]&48)!=0){gS.OK(a.a,' RAD=');switch(b.s[i]&48){case 16:gS.OK(a.a,'1');break;case 32:gS.OK(a.a,'2');break;case 48:gS.OK(a.a,'3');}}if((b.s[i]&3)==1||(b.s[i]&3)==2){gS.OK(a.a,' CFG=');(b.s[i]&3)==1?gS.OK(a.a,'1'):gS.OK(a.a,'2')}b.v[i]!=0&&gS.OK(a.a,' MASS='+b.v[i]);I=((b.s[i]&OT)>>>28)-1;I!=-1&&gS.OK(a.a,' VAL='+(I==0?'-1':gS.YJ(I)));q=jT&b.w[i];q==384?gS.OK(a.a,' HCOUNT=2'):q==128?gS.OK(a.a,' HCOUNT=1'):q==1792?gS.OK(a.a,' HCOUNT=-1'):q==1664&&gS.OK(a.a,' HCOUNT=1');F=b.w[i]&6144;F!=0&&((F&hT)!=0?gS.OK(a.a,' SUBST='+(b.c[i]+1)):gS.OK(a.a,' SUBST=-1'));B=b.w[i]&120;if(B!=0){switch(B){case 112:gS.OK(a.a,' RBCNT=-1');break;case 104:case 8:gS.OK(a.a,' RBCNT=2');break;case 88:gS.OK(a.a,' RBCNT=3');break;case 56:gS.OK(a.a,' RBCNT=4');}}gS.OK(a.a,ES)}gS.OK(a.a,'M  V30 END ATOM\n');gS.OK(a.a,'M  V30 BEGIN BOND\n');for(m=0;m<b.p;m++){gS.OK(a.a,cU+(m+1));switch(b.F[m]){case 1:w=1;D=0;break;case 2:w=2;D=0;break;case 4:w=3;D=0;break;case 9:w=1;D=3;break;case 17:w=1;D=1;break;case 26:w=2;D=2;break;case 64:w=4;D=0;break;case 32:w=9;D=0;break;default:w=1;D=0;}o=b.D[m]&31;o!=0&&(o==8?(w=4):o==3?(w=5):o==9?(w=6):o==10?(w=7):(w=8));gS.OK(a.a,' '+w+' '+(b.B[0][m]+1)+' '+(b.B[1][m]+1));D!=0&&gS.OK(a.a,' CFG='+D);C=b.D[m]&96;G=C==0?0:C==64?1:2;G!=0&&gS.OK(a.a,' TOPO='+G);gS.OK(a.a,ES)}gS.OK(a.a,'M  V30 END BOND\n');A=false;d=0;u=OC(fS.OD,YS,5,32,15,1);f=OC(fS.OD,YS,5,32,15,1);for(j=0;j<b.d;j++){if((b.s[j]&3)==1||(b.s[j]&3)==2){A=true;H=(b.s[j]&xT)>>19;H==1?++f[(b.s[j]&xT)>>19!=1&&(b.s[j]&xT)>>19!=2?-1:(b.s[j]&PT)>>21]:H==2?++u[(b.s[j]&xT)>>19!=1&&(b.s[j]&xT)>>19!=2?-1:(b.s[j]&PT)>>21]:++d}}e=0;v=OC(fS.OD,YS,5,32,15,1);g=OC(fS.OD,YS,5,32,15,1);for(n=0;n<b.e;n++){if(kS.mi(b,n)!=2&&((b.C[n]&3)==1||(b.C[n]&3)==2)){A=true;H=(b.C[n]&QT)>>10;H==1?++g[(b.C[n]&QT)>>10!=1&&(b.C[n]&QT)>>10!=2?-1:(b.C[n]&RT)>>12]:H==2?++v[(b.C[n]&QT)>>10!=1&&(b.C[n]&QT)>>10!=2?-1:(b.C[n]&RT)>>12]:++e}}if(A){gS.OK(a.a,'M  V30 BEGIN COLLECTION\n');if(d!=0){gS.OK(a.a,'M  V30 MDLV30/STEABS ATOMS=('+d);for(h=0;h<b.d;h++){((b.s[h]&3)==1||(b.s[h]&3)==2)&&(b.s[h]&xT)>>19==0&&gS.OK(a.a,' '+(h+1))}gS.OK(a.a,dU)}if(e!=0){gS.OK(a.a,'M  V30 MDLV30/STEABS BONDS=('+e);for(l=0;l<b.e;l++){kS.mi(b,l)!=2&&((b.C[l]&3)==1||(b.C[l]&3)==2)&&(b.C[l]&QT)>>10==0&&gS.OK(a.a,' '+(l+1))}gS.OK(a.a,dU)}for(p=0;p<32;p++){if(u[p]!=0){gS.OK(a.a,eU+(p+1)+' ATOMS=('+u[p]);for(h=0;h<b.d;h++){((b.s[h]&3)==1||(b.s[h]&3)==2)&&(b.s[h]&xT)>>19==2&&((b.s[h]&xT)>>19!=1&&(b.s[h]&xT)>>19!=2?-1:(b.s[h]&PT)>>21)==p&&gS.OK(a.a,' '+(h+1))}gS.OK(a.a,dU)}if(f[p]!=0){gS.OK(a.a,fU+(p+1)+' ATOMS=('+f[p]);for(h=0;h<b.d;h++){((b.s[h]&3)==1||(b.s[h]&3)==2)&&(b.s[h]&xT)>>19==1&&((b.s[h]&xT)>>19!=1&&(b.s[h]&xT)>>19!=2?-1:(b.s[h]&PT)>>21)==p&&gS.OK(a.a,' '+(h+1))}gS.OK(a.a,dU)}if(v[p]!=0){gS.OK(a.a,eU+(p+1)+' BONDS=('+v[p]);for(l=0;l<b.e;l++){kS.mi(b,l)!=2&&((b.C[l]&3)==1||(b.C[l]&3)==2)&&(b.C[l]&QT)>>10==2&&((b.C[l]&QT)>>10!=1&&(b.C[l]&QT)>>10!=2?-1:(b.C[l]&RT)>>12)==p&&gS.OK(a.a,' '+(l+1))}gS.OK(a.a,dU)}if(g[p]!=0){gS.OK(a.a,fU+(p+1)+' BONDS=('+g[p]);for(l=0;l<b.e;l++){kS.mi(b,l)!=2&&((b.C[l]&3)==1||(b.C[l]&3)==2)&&(b.C[l]&QT)>>10==1&&((b.C[l]&QT)>>10!=1&&(b.C[l]&QT)>>10!=2?-1:(b.C[l]&RT)>>12)==p&&gS.OK(a.a,' '+(l+1))}gS.OK(a.a,dU)}}gS.OK(a.a,'M  V30 END COLLECTION\n')}gS.OK(a.a,'M  V30 END CTAB\n')};kS.Pm=function Pm(a){kS.Qm.call(this,a)};kS.Qm=function Qm(a){kS.Rm.call(this,a,new gS.SK)};kS.Rm=function Rm(a,b){var c,d,e,f,g,h,i,j,k,l,m;kS.Nm(this);kS.Qo(a,7);this.a=b;m=a.M!=null?a.M:'';gS.OK(this.a,m+ES);gS.OK(this.a,'Actelion Java MolfileCreator 2.0\n\n');gS.OK(this.a,'  0  0  0  0  0  0              0 V3000\n');k=a.o==1;for(c=1;c<a.o;c++){if(a.H[c].a!=a.H[0].a||a.H[c].b!=a.H[0].b||a.H[c].c!=a.H[0].c){k=true;break}}this.b=1;if(k){f=kS.ci(a,a.o,a.p,(kS.dh(),kS.bh));if(f!=0){(f<1||f>3)&&(this.b=1.5/f)}else{l=gU;for(d=1;d<a.o;d++){for(e=0;e<d;e++){h=a.H[e].a-a.H[d].a;i=a.H[e].b-a.H[d].b;j=a.H[e].c-a.H[d].c;g=h*h+i*i+j*j;l>g&&(l=g)}}this.b=3/l}}kS.Om(this,a,k);gS.OK(this.a,'M  END\n')};nH(69,1,{},kS.Pm);_.b=1;fS.oE=YI(69);kS.Sm=function Sm(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o,p;k=a.g.K;l=0;for(f=0;f<c;f++){if(k>b[f]){k=b[f];l=f}}p=OC(fS.OD,YS,5,c,15,1);j=l>0?l-1:c-1;m=l<c-1?l+1:0;h=b[j]<b[m];for(g=0;g<c;g++){p[g]=b[l];h?--l<0&&(l=c-1):++l==c&&(l=0)}for(e=0;e<a.i.a.length;e++){o=AS.LN(a.i,e);if(o.length!=c)continue;d=true;for(i=0;i<c;i++){if(o[i]!==p[i]){d=false;break}}if(d)return}AS.GN(a.i,p);n=kS._m(a,p);AS.GN(a.j,n);kS.hn(a,p,n)};kS.Tm=function Tm(a,b,c){var d,e,f,g,h,i,j;i=OC(fS.OD,YS,5,a.f,15,1);g=OC(fS.OD,YS,5,a.f,15,1);j=OC(fS.CG,aT,5,a.g.d,16,1);d=kS.ei(a.g,0,b);e=kS.ei(a.g,1,b);i[0]=d;i[1]=e;g[1]=-1;j[e]=true;h=1;while(h>=1){++g[h];if(g[h]==kS.Hk(a.g,i[h])){j[i[h]]=false;--h;continue}f=kS.Gk(a.g,i[h],g[h]);if(j[f]||c[f])continue;if(f==d&&h>1){kS.Sm(a,i,h+1);if(a.i.a.length>=256)return;continue}if(h+1<a.f){++h;i[h]=f;j[f]=true;g[h]=-1}}};kS.Um=function Um(a,b,c,d,e,f,g){var h,i,j,k,l,m,n,o,p,q,r,s,t,u,v;s=AS.LN(a.i,b);t=AS.LN(a.j,b);u=t.length;j=0;i=0;v=false;for(q=0;q<u;q++){j<<=1;i<<=1;if(kS.gn(a,t[q])){j|=1}else{h=c[b][q];if(h!=-1){if(d[h]){if(e[h]){j|=1;f[h]||(i|=1)}}else{v=true}}}}p=false;switch(u){case 3:k=WC(IC(fS.OD,1),YS,5,15,[2,1,4]);p=true;for(o=0;o<3;o++){if((j&k[o])==k[o]){if(kS.ai(a.g,s[o])==6&&kS.Lh(a.g,s[o])==1||kS.ai(a.g,s[o])==5&&kS.Lh(a.g,s[o])==0){e[b]=true;g[b]=o;(i&k[o])==0&&(p=false)}}}break;case 5:l=WC(IC(fS.OD,1),YS,5,15,[10,5,18,9,20]);p=true;for(r=0;r<5;r++){if((j&l[r])==l[r]){switch(kS.ai(a.g,s[r])){case 6:if(kS.Lh(a.g,s[r])==-1){e[b]=true;g[b]=r;(i&l[r])==0&&(p=false)}break;case 7:if(kS.Lh(a.g,s[r])<=0){e[b]=true;g[b]=r}break;case 8:e[b]=true;g[b]=r;break;case 16:if(kS.Hk(a.g,s[r])==2){e[b]=true;g[b]=r}}}}break;case 6:p=true;if((j&21)==21){e[b]=true;(i&21)==0&&(p=false)}if((j&42)==42){e[b]=true;(i&42)==0&&(p=false)}break;case 7:m=WC(IC(fS.OD,1),YS,5,15,[42,21,74,37,82,41,84]);p=true;for(n=0;n<7;n++){if((j&m[n])==m[n]){if(kS.ai(a.g,s[n])==6&&kS.Lh(a.g,s[n])==1||kS.ai(a.g,s[n])==5&&kS.Lh(a.g,s[n])==0){e[b]=true;g[b]=n;(i&m[n])==0&&(p=false)}}}}e[b]&&!p&&(f[b]=true);if(e[b])return true;return !v};kS.Vm=function Vm(a,b,c,d){var e,f,g,h,i,j,k,l,m,n,o,p;e=OC(fS.OD,DT,6,a.i.a.length,0,2);for(i=0;i<a.i.a.length;i++){e[i]=OC(fS.OD,YS,5,AS.LN(a.i,i).length,15,1);for(j=0;j<AS.LN(a.i,i).length;j++)e[i][j]=-1}o=OC(fS.OD,YS,5,a.g.e,15,1);for(m=0;m<a.j.a.length;m++){n=AS.LN(a.j,m);if(n.length==3||n.length>=5&&n.length<=7){for(h=0;h<n.length;h++){g=n[h];if(kS.Hk(a.g,kS.ei(a.g,0,g))==3&&kS.Hk(a.g,kS.ei(a.g,1,g))==3){if(o[g]>0){e[o[g]>>>16][o[g]&32767]=m;e[m][h]=o[g]>>>16}else{o[g]=(m<<16)+32768+h}}}}}f=OC(fS.CG,aT,5,a.i.a.length,16,1);p=0;k=-1;while(p>k){k=p;for(l=0;l<a.i.a.length;l++){if(!f[l]){if(kS.Um(a,l,e,f,b,c,d)){f[l]=true;++p}}}}};kS.Wm=function Wm(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o;e=kS.ei(a.g,0,b);f=kS.ei(a.g,1,b);i=OC(fS.OD,YS,5,a.g.d,15,1);j=OC(fS.OD,YS,5,a.g.d,15,1);k=OC(fS.OD,YS,5,a.g.d,15,1);i[0]=e;i[1]=f;j[e]=1;j[f]=2;k[e]=-1;k[f]=e;h=1;l=1;while(h<=l){for(m=0;m<kS.Hk(a.g,i[h]);m++){g=kS.Gk(a.g,i[h],m);if(h>1&&g==e){o=OC(fS.OD,YS,5,j[i[h]],15,1);d=i[h];for(n=0;n<o.length;n++){o[n]=d;d=k[d]}return o}if(j[g]==0&&!c[g]){i[++l]=g;j[g]=j[i[h]]+1;k[g]=i[h]}}++h}return null};kS.Xm=function Xm(a,b){return a.a[b]};kS.Ym=function Ym(a,b){return a.b[b]};kS.Zm=function Zm(a,b){return AS.LN(a.i,b)};kS.$m=function $m(a,b){return AS.LN(a.j,b)};kS._m=function _m(a,b){var c,d,e,f,g;f=b.length;g=OC(fS.OD,YS,5,f,15,1);for(d=0;d<f;d++){c=d==f-1?b[0]:b[d+1];for(e=0;e<kS.Hk(a.g,b[d]);e++){if(kS.Gk(a.g,b[d],e)==c){g[d]=kS.Ik(a.g,b[d],e);break}}}return g};kS.an=function an(a,b,c){var d;for(d=0;d<a.j.a.length;d++)if(kS.dn(a,d,b)&&kS.dn(a,d,c))return d;return -1};kS.bn=function bn(a,b){return a.d[b]};kS.cn=function cn(a,b,c){var d,e;e=AS.LN(a.i,b);for(d=0;d<e.length;d++)if(c==e[d])return true;return false};kS.dn=function dn(a,b,c){var d,e;e=AS.LN(a.j,b);for(d=0;d<e.length;d++)if(c==e[d])return true;return false};
kS.en=function en(a,b){return a.e[b]};kS.fn=function fn(a,b){var c,d,e,f,g,h;for(g=0;g<2;g++){c=kS.ei(a.g,g,b);if(kS.ai(a.g,c)==7&&kS.Hk(a.g,c)==2){d=kS.ei(a.g,1-g,b);for(h=0;h<kS.Hk(a.g,d);h++){e=kS.Gk(a.g,d,h);f=kS.Ik(a.g,d,h);if((kS.ai(a.g,e)==8||kS.ai(a.g,e)==16)&&kS.mi(a.g,f)==2&&kS.Hk(a.g,e)==1)return true}}}return false};kS.gn=function gn(a,b){return kS.mi(a.g,b)>1||kS.pi(a.g,b)==64};kS.hn=function hn(a,b,c){var d,e,f;f=b.length;for(e=0;e<f;e++)(a.a[b[e]]==0||a.a[b[e]]>f)&&(a.a[b[e]]=f);for(d=0;d<f;d++)(a.b[c[d]]==0||a.b[c[d]]>f)&&(a.b[c[d]]=f)};kS.jn=function jn(a,b,c){var d;d=AS.LN(a.j,b).length;while(c>=d)c-=d;while(c<0)c+=d;return c};kS.kn=function kn(a,b){kS.ln.call(this,a,b)};kS.ln=function ln(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s;this.g=a;this.f=7;this.i=new AS.ZN;this.j=new AS.ZN;this.a=OC(fS.OD,YS,5,this.g.d,15,1);this.b=OC(fS.OD,YS,5,this.g.e,15,1);this.g.gb(1);m=OC(fS.CG,aT,5,this.g.d,16,1);n=OC(fS.CG,aT,5,this.g.e,16,1);do{g=false;for(c=0;c<this.g.d;c++){if(!m[c]){q=0;for(l=0;l<kS.Hk(this.g,c);l++)m[kS.Gk(this.g,c,l)]||++q;if(q<2){m[c]=true;for(k=0;k<kS.Hk(this.g,c);k++)n[kS.Ik(this.g,c,k)]=true;g=true}}}}while(g);s=0;while(s<this.g.d&&m[s])++s;if(s==this.g.d)return;i=OC(fS.OD,YS,5,this.g.d,15,1);i[0]=s;p=OC(fS.OD,YS,5,this.g.d,15,1);p[0]=-1;h=OC(fS.OD,YS,5,this.g.d,15,1);h[s]=1;f=0;j=0;o=1;while(f<=j){for(k=0;k<kS.Hk(this.g,i[f]);k++){e=kS.Gk(this.g,i[f],k);if(e==p[i[f]])continue;if(h[e]!=0){kS.Tm(this,kS.Ik(this.g,i[f],k),m);continue}if(!m[e]){h[e]=o;p[e]=i[f];i[++j]=e}}++f;if(f>j){for(c=0;c<this.g.d;c++){if(h[c]==0&&!m[c]){h[c]=++o;i[++j]=c;p[c]=-1;break}}}}if((b&4)!=0){this.d=OC(fS.CG,aT,5,this.i.a.length,16,1);this.e=OC(fS.CG,aT,5,this.i.a.length,16,1);this.c=OC(fS.OD,YS,5,this.i.a.length,15,1);kS.Vm(this,this.d,this.e,this.c)}if((b&2)!=0){for(d=0;d<this.g.e;d++){if(!n[d]&&kS.mi(this.g,d)!=0){r=kS.Wm(this,d,m);r!=null&&kS.hn(this,r,kS._m(this,r))}}}};nH(61,1,{},kS.kn);_.f=0;fS.pE=YI(61);kS.mn=function mn(a){var b;b=kS.Mn(a.w,a.w.length);if(a.j!=0){AS.OO(b);if(!AS.uQ(a.H,b)){AS.sQ(a.H,b);AS.GN(a.v,kS.Mn(a.w,a.w.length))}return}return};kS.nn=function nn(a,b,c){var d,e,f,g,h,i,j,k,l,m;i=kS.Hk(a.A,b);e=a.i[c];if(e>i)return false;k=kS.Xh(a.A,b);g=kS.Xh(a.d,c);f=kS.Sh(a.d,c);j=kS.Sh(a.A,b);if((g&1)!=0){if(f!=null){if((k&1)!=0){if(j==null)return false;if(!kS.Bn(f,j))return false}else{if(j!=null){if(kS.Dn(j,f))return false}else{if(kS.An(kS.ai(a.A,b),f))return false}}}}else{if((k&1)!=0)return false;if(f!=null){if(j!=null){if(!kS.Bn(j,f))return false}else{if(!kS.An(kS.ai(a.A,b),f))return false}}else{if(j!=null)return false;if(a.C[b]!==a.f[c])return false}}if((k|g)!=0){if((g&iT)!=0){if(a.A.I&&(k&iT)==0)return false;else if(e!=i)return false}if((g&hT)!=0){if(e>=i&&(k&hT)==0)return false}}if((a.B[b]&~a.e[c])!=0)return false;if(kS.Lh(a.d,c)!=0&&kS.Lh(a.d,c)!=kS.Lh(a.A,b))return false;if(kS.Vh(a.d,c)!=0&&kS.Vh(a.d,c)!=kS.Vh(a.A,b))return false;m=(kS.Xh(a.d,c)&tT)>>22;if(m!=0){if(a.A.I&&m==(kS.Xh(a.A,c)&tT)>>22)return true;d=false;l=kS.bl(a.A);for(h=0;h<l.i.a.length;h++){if(AS.LN(l.j,h).length==m){if(kS.cn(l,h,b)){d=true;break}}}if(!d)return false}return true};kS.on=function on(a,b,c){var d,e,f,g;if((a.D[b]&~a.g[c])!=0)return false;g=(kS.oi(a.d,c)&yT)>>15;if(g!=0){if(a.A.I&&g==(kS.oi(a.A,c)&yT)>>15)return true;d=false;f=kS.bl(a.A);for(e=0;e<f.i.a.length;e++){if(AS.LN(f.j,e).length==g){if(kS.dn(f,e,b)){d=true;break}}}if(!d)return false}return true};kS.pn=function pn(a){var b,c;a.a=null;for(b=0;b<a.d.e;b++){if(kS.Gi(a.d,b)){!a.a&&(a.a=new AS.ZN);c=new kS.Nn;c.a=kS.ei(a.d,0,b);c.b=kS.ei(a.d,1,b);c.d=kS.gi(a.d,b);c.c=kS.fi(a.d,b);AS.GN(a.a,c)}}};kS.qn=function qn(a){var b,c,d,e,f,g,h,i,j;kS.Qo(a.d,a.G);h=a.d.e+12;a.o=OC(fS.OD,YS,5,h,15,1);a.q=OC(fS.OD,YS,5,h,15,1);a.r=OC(fS.OD,YS,5,h,15,1);a.p=OC(fS.CG,aT,5,h+1,16,1);f=OC(fS.CG,aT,5,a.d.d,16,1);g=OC(fS.CG,aT,5,a.d.e,16,1);e=0;for(c=0;c<a.d.d;c++){if(!a.u[c]&&!f[c]){a.o[e]=c;a.r[e]=-1;a.q[e]=-1;i=e;while(e<=i){for(j=0;j<kS.uk(a.d,a.o[e]);j++){d=kS.Gk(a.d,a.o[e],j);d<a.d.d&&!a.u[d]&&(i=kS.Kn(a,e,i,j,f,g))}while(a.p[++e]);}}}a.s=e;if(a.j!=0){i=e-1;e=0;while(e<=i){for(j=0;j<kS.uk(a.d,a.o[e]);j++){d=kS.Gk(a.d,a.o[e],j);d<a.d.d&&(a.u[d]||a.u[a.o[e]])&&(i=kS.Kn(a,e,i,j,f,g))}while(a.p[++e]);}for(b=0;b<a.d.d;b++){if(a.u[b]&&!f[b]){a.o[e]=b;a.r[e]=-1;a.q[e]=-1;i=e;while(e<=i){for(j=0;j<kS.uk(a.d,a.o[e]);j++)kS.Gk(a.d,a.o[e],j)<a.d.d&&(i=kS.Kn(a,e,i,j,f,g));while(a.p[++e]);}}}}a.t=e};kS.rn=function rn(a,b,c){var d,e,f;if(a.a){for(e=new AS.tO(a.a);e.a<e.c.a.length;){d=AS.sO(e);if((a.u[d.a]||a.u[d.b])==c){f=kS.al(a.A,a.w[d.a],a.w[d.b],d.c+1,b)-1;if(f<d.d||f>d.c)return false}}}return true};kS.sn=function sn(a,b){var c,d,e,f,g,h,i,j;for(e=0;e<a.d.e;e++){if((kS.oi(a.d,e)&CT)!=0){f=kS.ni(a.d,e);if(f==0)continue;c=kS.ei(a.d,0,e);d=kS.ei(a.d,1,e);if((a.u[c]||a.u[d])==b){g=a.w[c];h=a.w[d];i=kS.Ek(a.A,g,h);j=kS.ni(a.A,i);if(j==0)continue;if(f==3)continue;if(j==3)continue;if(kS.yn(a,e,i)==(f==j))return false}}}return true};kS.tn=function tn(a,b,c){var d,e,f,g,h;for(g=a.s;g<a.t;g++)c[g]=-1;f=a.s;while(true){h=a.q[f]==-1?a.A.d:kS.uk(a.A,a.w[a.q[f]]);++c[f];if(c[f]==h){c[f]=-1;if(f==a.s)break;--f;if(!a.p[f]){b[a.w[a.o[f]]]=false;a.w[a.o[f]]=-1}continue}if(a.q[f]==-1){if(!b[c[f]]){if(kS.nn(a,c[f],a.o[f])){a.w[a.o[f]]=c[f];b[c[f]]=true;++f}}}else{if(kS.Gk(a.A,a.w[a.q[f]],c[f])>=a.A.d){++c[f];continue}e=kS.Gk(a.A,a.w[a.q[f]],c[f]);if(a.p[f]){e==a.w[a.o[f]]&&kS.on(a,kS.Ik(a.A,a.w[a.q[f]],c[f]),a.r[f])&&++f}else{if(!b[e]){if(kS.nn(a,e,a.o[f])&&kS.on(a,kS.Ik(a.A,a.w[a.q[f]],c[f]),a.r[f])){b[e]=true;a.w[a.o[f]]=e;++f}}}}if(f==a.t){if(kS.un(a,true)&&kS.sn(a,true)&&kS.rn(a,b,true)){for(d=0;d<a.d.d;d++){if(a.u[d]){b[a.w[d]]=false;a.w[d]=-1}}return true}--f;if(!a.p[f]){b[a.w[a.o[f]]]=false;a.w[a.o[f]]=-1}}}return false};kS.un=function un(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p;g=0;for(i=0;i<a.d.d;i++){if(a.u[i]==b&&(kS.Xh(a.d,i)&JT)!=0){m=a.w[i];l=kS.Wh(a.d,i);o=kS.Wh(a.A,m);if(l==0)continue;if(o==0)continue;if(l==3)continue;if(o==3)continue;if(kS.Qh(a.d,i)==1){++g;continue}if(kS.Qh(a.A,m)==1)return false;if(kS.Qh(a.d,i)==2){++g;continue}if(kS.Qh(a.A,m)==2)return false;if(kS.Cn(a,i)==(l==o))return false}}if(g!=0){e=OC(fS.OD,YS,5,g,15,1);f=0;for(j=0;j<a.d.d;j++){if(a.u[j]==b&&(kS.Xh(a.d,j)&JT)!=0){l=kS.Wh(a.d,j);l!=0&&l!=3&&(e[f++]=kS.Ph(a.d,j)<<24|kS.Qh(a.d,j)<<22|j)}}AS.OO(e);f=0;while(f<e.length){k=e[f]&hU;n=a.w[k];c=e[f]&-4194304;d=kS.Cn(a,k)^kS.Wh(a.d,k)==kS.Wh(a.A,n);for(++f;f<e.length&&(e[f]&-4194304)==c;f++){h=e[f]&hU;m=a.w[h];if(kS.Qh(a.A,m)!=kS.Qh(a.A,n)||kS.Ph(a.A,m)!=kS.Ph(a.A,n))return false;p=kS.Cn(a,h)^kS.Wh(a.d,h)==kS.Wh(a.A,m);if(p!=d)return false}}}return true};kS.vn=function vn(a,b){var c,d,e,f,g,h,i,j,k,l;a.v=new AS.ZN;AS.tP(a.H.a);AS.tP(a.c.a);if(!a.A||!a.d)return 0;if(a.d.d-a.j>a.A.d||a.d.e-a.k>a.A.e)return 0;if(a.d.d-a.j==0)return 0;kS.Gn(a,b);c=OC(fS.CG,aT,5,a.A.d,16,1);a.w=OC(fS.OD,YS,5,a.d.d,15,1);AS.CO(a.w);g=OC(fS.OD,YS,5,a.t,15,1);AS.FO(g,g.length,-1);e=0;while(true){j=a.q[e]==-1?a.A.d:kS.uk(a.A,a.w[a.q[e]]);++g[e];if(g[e]==j){g[e]=-1;if(e==0)break;--e;a.p[e]||(c[a.w[a.o[e]]]=false);continue}if(a.q[e]==-1){if(!c[g[e]]){if(kS.nn(a,g[e],a.o[e])){a.w[a.o[e]]=g[e];c[g[e]]=true;++e}}}else{if(kS.Gk(a.A,a.w[a.q[e]],g[e])>=a.A.d)continue;d=kS.Gk(a.A,a.w[a.q[e]],g[e]);if(a.p[e]){d==a.w[a.o[e]]&&kS.on(a,kS.Ik(a.A,a.w[a.q[e]],g[e]),a.r[e])&&++e}else{if(!c[d]){if(kS.nn(a,d,a.o[e])&&kS.on(a,kS.Ik(a.A,a.w[a.q[e]],g[e]),a.r[e])){c[d]=true;a.w[a.o[e]]=d;++e}}}}if(e==a.s){if(kS.un(a,false)&&kS.sn(a,false)&&kS.rn(a,c,false)){if(a.j==0)return 1;h=false;if(a.j!=0){k=kS.Mn(a.w,a.w.length);AS.OO(k);if(AS.uQ(a.c,k)){h=true}else if(kS.tn(a,c,g)){AS.sQ(a.c,k);l=OC(fS.OD,YS,5,k.length,15,1);for(f=a.v.a.length-1;f>=0;f--){i=AS.LN(a.v,f);gS.XK(i,l,l.length);AS.OO(l);pS.iA(l,k)==0&&AS.RN(a.v,f)}h=true}}h||kS.mn(a)}--e;a.p[e]||(c[a.w[a.o[e]]]=false)}}return a.v.a.length};kS.wn=function wn(a,b){var c,d,e,f,g,h,i,j;i=0;if(a.I){(a.s[b]&hT)!=0&&(i|=2);j=(d=a.s[b]&QT,d==0?0:d==kT?2:d==iT?3:4);if(j!=0){i|=8;j>2&&(i|=16);j>3&&(i|=32)}c=a.q[b];c<0?(i|=nT):c>0&&(i|=mT);f=a.g[b];switch(f){case 0:break;case 1:i|=IT;break;case 2:i|=sT;break;case 3:i|=917504;break;default:i|=1966080;}}else{(a.s[b]&hT)!=0?(i|=2):(i|=4);j=(d=a.s[b]&QT,d==0?0:d==kT?2:d==iT?3:4);j==0?(i|=112):j==2?(i|=104):j==3?(i|=88):(i|=56);c=a.q[b];c==0?(i|=167772160):c<0?(i|=nT):c>0&&(i|=mT);e=a.c[b]-a.g[b]+kS.Tk(a,b);switch(e){case 0:i|=1792;break;case 1:i|=1664;break;case 2:i|=1408;break;default:i|=896;}f=a.g[b];switch(f){case 0:i|=3932160;break;case 1:i|=3801088;break;case 2:i|=3538944;break;case 3:i|=3014656;break;default:i|=1966080;}h=a.k[b];switch(h){case 0:i|=98304;break;case 1:i|=81920;break;default:i|=49152;}}g=a.k[b];g>0&&(i|=pT);g>1&&(i|=32768);return i};kS.xn=function xn(a,b){var c;c=0;if((a.C[b]&512)!=0||a.F[b]==64)c|=8;else switch(kS.mi(a,b)){case 0:c|=32;break;case 1:c|=1;break;case 2:c|=2;break;case 3:c|=4;}(a.C[b]&64)!=0?(c|=64):a.I||(c|=32);(a.C[b]&256)!=0?(c|=OS):a.I||(c|=PS);return c};kS.yn=function yn(a,b,c){var d,e,f,g,h,i,j,k,l,m;h=false;for(g=0;g<2;g++){d=kS.ei(a.d,g,b);k=a.w[d];if(kS.Hk(a.d,d)==2){if(kS.Hk(a.A,k)==2)continue;e=-1;for(j=0;j<2;j++)kS.Ik(a.d,d,j)!=b&&(e=kS.Gk(a.d,d,j));m=0;l=OC(fS.OD,YS,5,2,15,1);for(i=0;i<3;i++)kS.Ik(a.A,k,i)!=c&&(l[m++]=kS.Gk(a.A,k,i));a.w[e]!==l[0]&&(h=!h)}else if(kS.Hk(a.d,d)==3&&kS.Hk(a.A,k)==3){e=OC(fS.OD,YS,5,2,15,1);f=0;for(i=0;i<3;i++)kS.Ik(a.d,d,i)!=b&&(e[f++]=kS.Gk(a.d,d,i));a.w[e[0]]>a.w[e[1]]^e[0]>e[1]&&(h=!h)}}return h};kS.zn=function zn(a){return kS.vn(a,a.b)>0};kS.An=function An(a,b){var c;for(c=0;c<b.length;c++)if(b[c]==a)return true;return false};kS.Bn=function Bn(a,b){var c,d,e;e=0;for(d=0;d<a.length;d++){c=a[d];while(b[e]<c){++e;if(e==b.length)return false}if(b[e]>c)return false}return true};kS.Cn=function Cn(a,b){var c,d,e,f,g,h,i,j;g=false;if(kS.xk(a.d,b)==0){for(f=1;f<kS.Hk(a.d,b);f++){for(h=0;h<f;h++){d=kS.Gk(a.d,b,f);e=kS.Gk(a.d,b,h);a.w[d]>a.w[e]^d>e&&(g=!g)}}}else{for(f=0;f<kS.Hk(a.d,b);f++){c=kS.Gk(a.d,b,f);j=0;i=OC(fS.OD,YS,5,3,15,1);for(h=0;h<kS.Hk(a.d,c);h++){i[j]=kS.Gk(a.d,c,h);i[j]!=b&&++j}j==2&&a.w[i[0]]>a.w[i[1]]^i[0]>i[1]&&(g=!g)}}return g};kS.Dn=function Dn(a,b){var c,d,e,f;e=0;f=0;while(e<a.length&&f<b.length){c=a[e];d=b[f];if(c==d)return true;c<d?++e:++f}return false};kS.En=function En(a,b){var c,d,e,f;if(b.o==0||!b.I){a.d=null;return}a.d=b;a.n=false;kS.Qo(a.d,1);a.G=3;for(d=0;d<a.d.d;d++)(kS.Xh(a.d,d)&JT)!=0&&(a.G=7);for(f=0;f<a.d.e;f++)(kS.oi(a.d,f)&CT)!=0&&(a.G=7);a.F&&a.G!=3&&kS.Qo(a.A,a.G);a.j=0;a.u=OC(fS.CG,aT,5,a.d.d,16,1);for(c=0;c<a.d.d;c++){a.u[c]=(kS.Xh(a.d,c)&bT)!=0;a.u[c]&&++a.j}a.k=0;if(a.j!=0)for(e=0;e<a.d.e;e++)(a.u[kS.ei(a.d,0,e)]||a.u[kS.ei(a.d,1,e)])&&++a.k};kS.Fn=function Fn(a,b){if(b.o==0){a.A=null;return}a.A=b;a.F=false;kS.Qo(a.A,1)};kS.Gn=function Gn(a,b){if(!a.F){kS.Jn(a,b);a.F=true}if(!a.n){kS.Hn(a,b);kS.qn(a);kS.pn(a);a.n=true}};kS.Hn=function Hn(a,b){var c,d,e,f,g,h,i,j,k,l;f=null;i=null;g=null;kS.Qo(a.d,a.G);a.i=OC(fS.OD,YS,5,a.d.d,15,1);for(d=0;d<a.d.d;d++)a.i[d]=kS.Hk(a.d,d);if(a.j!=0){j=new kS.ep(a.d.o,a.d.p);l=OC(fS.CG,aT,5,a.d.o,16,1);for(e=0;e<a.d.o;e++)l[e]=!a.u[e];kS.lk(a.d,j,l,true,null);kS.Qo(j,a.G);kS.In(a,j,b);f=a.e;i=a.g;g=a.f;k=0;for(c=0;c<a.d.d;c++)a.u[c]||(a.i[c]=kS.Hk(j,k++))}kS.In(a,a.d,b);if(a.j!=0){k=0;for(c=0;c<a.d.o;c++){if(!a.u[c]){a.e[c]=f[k];a.f[c]=g[k++]}}k=0;for(h=0;h<a.d.p;h++){!a.u[kS.ei(a.d,0,h)]&&!a.u[kS.ei(a.d,1,h)]&&(a.g[h]=i[k++])}}};kS.In=function In(a,b,c){var d,e,f,g;f=b.d;a.e=OC(fS.OD,YS,5,b.d,15,1);a.f=OC(fS.OD,YS,5,b.d,15,1);for(d=0;d<f;d++){a.e[d]=(kS.wn(b,d)|b.w[d])&iU^iU;a.f[d]=b.A[d];(c&1)!=0&&(a.f[d]+=b.q[d]+16<<8);(c&2)!=0&&(a.f[d]+=b.v[d]<<16)}g=b.e;a.g=OC(fS.OD,YS,5,b.e,15,1);for(e=0;e<g;e++){a.g[e]=(kS.xn(b,e)|b.D[e])&1572991^1572960;(c&4)!=0?(a.g[e]&2)!=0&&(a.g[e]|=8):(c&8)!=0&&(a.g[e]&2)!=0&&(b.C[e]&256)!=0&&(a.g[e]|=8)}};kS.Jn=function Jn(a,b){var c,d,e,f;kS.Qo(a.A,a.G);e=a.A.d;a.C=OC(fS.OD,YS,5,e,15,1);a.B=OC(fS.OD,YS,5,e,15,1);for(c=0;c<e;c++){a.B[c]=(kS.wn(a.A,c)|kS.Xh(a.A,c))&iU^iU;a.C[c]=kS.ai(a.A,c);(b&1)!=0&&(a.C[c]+=kS.Lh(a.A,c)+16<<8);(b&2)!=0&&(a.C[c]+=kS.Vh(a.A,c)<<16)}f=a.A.e;a.D=OC(fS.OD,YS,5,f,15,1);for(d=0;d<f;d++)a.D[d]=(kS.xn(a.A,d)|kS.oi(a.A,d))&1605631^1572960};kS.Kn=function Kn(a,b,c,d,e,f){var g,h;g=kS.Gk(a.d,a.o[b],d);if(g!=a.q[b]){h=kS.Ik(a.d,a.o[b],d);if(!f[h]&&!kS.Gi(a.d,h)){a.o[++c]=g;a.q[c]=a.o[b];a.r[c]=h;f[h]=true;e[g]?(a.p[c]=true):(e[g]=true)}}return c};kS.Ln=function Ln(){this.b=8;this.v=new AS.ZN;this.H=new AS.vQ(new pS.jA);this.c=new AS.vQ(new pS.jA)};kS.Mn=function Mn(a,b){var c;c=OC(fS.OD,YS,5,b,15,1);gS.XK(a,c,gS.bK(a.length,b));return c};nH(88,1,{},kS.Ln);_.b=0;_.j=0;_.k=0;_.n=false;_.s=0;_.t=0;_.F=false;_.G=0;fS.sE=YI(88);kS.Nn=function Nn(){};nH(91,1,{91:1},kS.Nn);_.a=0;_.b=0;_.c=0;_.d=0;fS.qE=YI(91);kS.Qn=function Qn(){kS.Qn=pH;kS.On=WC(IC(fS.MF,1),LT,2,6,['QM@HzAmdqjF@','RF@Q``','qC`@ISTAlQE`','`J@H','QM@HzAmdqbF@','qC`@ISTAlQEhqPp@','sJP@DiZhAmQEb','RF@QPvR@','QM@HzA@','qC`@ISTAlQEhpPp@','qC`@Qz`MbHl','sJP@DiZhAmQEcFZF@','RFPDXH','qC`@IVtAlQE`','QM@HvAmdqfF@','sGP@DiVj`FsDVM@','`L@H','sJP@DizhAmQEcFBF@','sJP@DjvhAmQEb','sFp@DiTt@@AlqEcP','sGP@LdbMU@MfHlZ','QMHAIhD','QM@HzAy@','sJP@DkVhAmQEb','sNp@DiUjj@[\\QXu`','sJP@DiZhAmQEcFBF@','sGP@DjVj`FsDVM@','RFPDTH','RG@DXOH@','sGP@Divj`FsDVMcAC@','sGP@Dj}j`FsDVM@','qC`@Qz`MbHmFRF@','sNp@LdbJjj@[\\QXu`','QMHAIhGe@','QM@HzAyd`','QM`AIhD','qC`@ISTA@','sGP@DkUj`FsDVM@','qC`@IVtAlQEhqPp@','sNp@DiUjj@[\\QXuqea`@','KAx@@IRjuUPAlHPfES\\','QM`BN`P','sJP@DjZhAmQEcFJF@','Hid@@DjU^nBBH@FtaBXUMp`','sNp@Diujj@[\\QXuq`a`@','sJP@DjvhAmQEcFZF@','sJP@DjZhAmQEcFFF@','sOp@DjWkB@@FwDVM\\YhX@','sNp@Dj}Zj@[\\QXu`','sNp@DiWjj@[\\QXuq`a`@','sOp@DjWkB@@D','KAx@@ITouUPAlHPfES\\','KAx@@YIDTjjh@vDHSBin@','sNp@DkUZj@[\\QXu`','RFPDXOH@','QM`BN`^L`','qC`@ISTAy@','sGP@LdbMU@MfHl[FVF@','qCb@AIZ`H','KAx@@IRjuUPAlHPfES]FFa`@','KAx@@ITnuUPAlHPfES\\','HiD@@DiUVjj`AmHPfES\\H','sNp@DjUjj@[\\QXu`','sJP@DkVhAmQEcFJF@','sGP@DjVj`FsDVMcCC@','qC`@Qz`MbHmFBF@','sJP@DkfhAmQEb','qC`@IVtAlQEhsPp@','sGP@Djuj`FsDVM@','sGP@Dj}j`FsDVMcMC@','sJP@DiZhA@','KAx@@ISjuUPAlHPfES]F@a`@','sJP@DjZhAmQEcFRF@','KAx@@IRnuUPAlHPfES]F@a`@','HiD@@DjWvjj`AmHPfES\\H','QMHAIhGd@','sNp@DiUjj@[\\QXuq`a`@','KAx@@IVjmUPAlHPfES\\','sGP@DjVj`FsDVMcMC@','QM`AIhGe@','HiD@@LdbJRjjh@[RDIaTwB','qCp@AIZ`H','sGP@LdbMU@MfHl[FFF@','QMDARVA@','sNp@LdbJjj@[\\QXuqba`@','sNp@LdbJjj@[\\QXuqca`@','sGP@Dkej`FsDVM@','qCb@AIZ`OI@','HaD@@DjUZxHH@AlHPfES]FLa`@','sGP@DkYj`FsDVM@','qCb@AIV`H','sNp@LdbJjj@[\\QXuqea`@','sGP@DkUj`FsDVMcEC@','sFp@DiTt@@Axa@','Hmt@@DjU_ZxHHj@AmhPfES\\Lj','QM`BN`^P','qCb@AIZ`OH`','sFp@DiTt@@AxaP','sGP@Djuj`FsDVMcEC@','sGP@Djuj`FsDVMcIC@','sGP@DkUj`FsDVMcKC@','sJP@DkfhAmQEcFRF@','sGP@DjVj`FsDVMcIC@','HaD@@DjUZxHH@AlHPfES]FFa`@','qC`@IRtDVqDV@','sNp@Dj}Zj@[\\QXuqfa`@','KAx@@ITnuUPAlHPfES]FFa`@','HiD@@DkUUjj`AmHPfES\\H','sJQ@@dkU@H','qC`@Qz`H','KAx@@IUkmUPAlHPfES\\','KAx@@ITouUPAlHPfES]FJa`@','sJP@H~j@[TQX`','sGP@DjZj`FsDVM@','sJP@DkVhAmQEcFFF@','sJX@@eKU@H','sJP@DizhAy@','QMHAIhGbP','KAx@@ITouUPAlHPfES]FNa`@','HaD@@DjUZxHD@AlHPfES\\','HaD@@DjUZxHH@A@','sNp@LdbJjj@[\\QXuqaa`@','Hed@@LdbRQUUUP@vTHSBinFP','KAx@@ITouUPAlHPfES]FLa`@','sNp@DkUZj@[\\QXuqba`@','KAx@@ITjuUPAlHPfES]FNa`@','KAx@@YIDTjjh@vDHSBincGPp@','HaD@@DjYvxH`@AlHPfES]FLa`@','RF@QP`','qCb@AIj`H','sNp@DjUjj@[\\QXuqaa`@','sNp@DkVZj@[\\QXu`','KAx@@YIDUJjh@vDHSBin@','sGP@DkYj`FsDVMcIC@','sGP@DjVj`FsDVMcAC@','sGP@DiVj`D','sJP@DkVhAmQEcFZF@','sNp@LdbLjj@[\\QXu`','QM@HvAmdqbF@','HaD@@DjWjXHB@AlHPfES\\','sNp@DjwZj@[\\QXuqba`@','sNp@LdbJjj@[\\QXuqda`@','sFp@DiTt@@Axa`','HiD@@Djuujj`AmHPfES\\H','sNp@DkUZj@[\\QXuqca`@','sJP@DiZhAy@','KAx@@YIDTjjh@vDHSBincCPp@','KAx@@IWNmUPAlHPfES\\','KAx@@IVkMUPAlHPfES\\','sJQ@@dju@H','qCb@AIZ`OH@','qC`@ISTAxa@','sNp@DjyZj@[\\QXu`','Hid@@DjUfaBB`@FtaBXUMp`','HiD@@DiUVjj`AmHPfES\\LXBF@','KAx@@IUjmUPAlHPfES\\','HiD@@DjWvjj`AmHPfES\\LXjF@','sJP@DjVhAmQEb','qCb@AIV`OH`','HiD@@LdbJRjjh@[RDIaTwCFDa`@','KAx@@YIDTjjh@vDHSBinc@Pp@','sNp@DjUjj@[\\QXuqda`@','qC`@Qz`OED','sJP@DkfhAmQEcFZF@','KAx@@YIDbjjh@vDHSBincDPp@','sGP@Djyj`FsDVMcMC@','KAx@@IVrmUPAlHPfES\\','qCp@AIZ`OI@','sJX@@dkU@H','sJQ@@dkU@OH`','sNp@Di]ZjBBvxbqk@','Hkl@@DjU_Uk``bj`@[VDIaTwCJzX','sGP@DjZj`FsDVMcEC@','Hid@@DjU^nBBH@FtaBXUMpqcHX@','sNp@DkeZj@[\\QXu`','sNp@DjYjj@[\\QXuqca`@','sGQ@@djuT@`','HiD@@LdbJTjjh@[RDIaTwB','sOp@DjWkB@@Gd`','HeT@@LdbbRKBDQD@CYPaLJfxY@','qCr@XIKTA@','HiD@@DjW^jj`AmHPfES\\LXJF@','HeT@@DjU]k``b`@[JDIaTwCH','sGP@Djuj`FsDVMcCC@','`IH`B','sOp@DjWkB@@GdX','sJQ@@eKU@H','KAx@@YIDUJjh@vDHSBincBPp@','sJX@@eKU@OH@','KAx@@YIDTjjh@vDHSBincAPp@','sOq@@drm\\@@@`','KAx@@IUkMUPAlHPfES\\','qCp@AIj`H','Hed@@DjUUjjj@FraBXUMpr','sGX@@eJuT@`','sGP@DkUj`FsDVMcCC@','HiD@@Dj}Ujj`AmHPfES\\LXrF@','KAx@@ITouUPAlHPfES]FHa`@','Hed@@DjWujjj@FraBXUMpsFIa`@','sGP@DiUj``mfHlZ','sFp@DiTvjhAlqEcP','Hid@@DjU^nBBH@FtaBXUMpq`XX@','sJP@DkVdAmQEb','qCp@AIZ`OH`','QMhDRVA@','qC`@ISJAlQE`','qCp@BOTAyhl','sJX@@eOU@ODB','sFp@DiTt@@AyaB','sGP@DkUj`FsDVMcMC@','Hid@@DjYUaBH`@FtaBXUMpqcHX@','qC`@Qz`OH@','HiD@@DjUVjj`AmHPfES\\LXZF@','sJP@H~j@[TQXqda`@','sJX@@eKU@OI@','sNp@Djejj@[\\QXu`','sJQ@@dsU@H','sJQ@@dkU@OI`','KAx@@YIMDVjh@vDHSBin@','Hid@@DjU^nBBD@FtaBXUMp`','sNp@DkgZj@[\\QXuqca`@','qC`@IRtDVqDVcEC@','Hed@@LdbRQeUUP@vTHSBinFP','sNp@DiUjj@P','qC`@IRtDT','sNp@DkYZj@[\\QXuqca`@','KAx@@IUkmUPAlHPfES]FDa`@','KAx@@IVjmUPAlHPfES]FNa`@','sOx@@drm\\@@@`','KAx@@ITjuUPAlHPfES]FBa`@','QMDARVAyH','sJP`@dfvhA@','HeT@@DjU_k``b`@[JDIaTwCLXfF@','KAx@@IToUUPAlHPfES]FJa`@','sGP@DkYj`FsDVMcEC@','qCb@AIZ`ODH','`I@`B','KAx@@IUzmUPAlHPfES]FFa`@','sNp@DkfZj@[\\QXu`','KAx@@ITnuUPAlHPfES]F@a`@','HiD@@LddURjjh@[RDIaTwB','sNp@Dj~Zj@[\\QXuqfa`@','Hed@@Dj{uZjj@FraBXUMpr','KAx@@ITsUUPAlHPfES\\','Hid@@LdbRQk``b@AmHPfES\\LXrF@','sOp@DjWkB@@GdH','sJQ@@dkU@OH@','Hid@@DjU^nBBH@FtaBXUMpqahX@','sGP@DiYj``mfHlZ','KAx@@IToUUPAlHPfES]FLa`@','qCp@AJZ`ODH','Hmt@@DjU]ZxHHj@AmhPfES\\Lj','sGP@DkUjPFsDVM@','qC`@IVtA@','Hed@@LdbJReUUP@vTHSBinFP','sNp@DjuZj@[\\QXuqea`@','KAx@@IUkmUPAlHPfES]FNa`@','HiD@@DkVUjj`AmHPfES\\H','Hed@@DkUeZjj@FraBXUMpr','sNp@DkVZj@[\\QXuqea`@','sJP@DiVhHKZbKFLLL@','HiD@@Djuyjj`AmHPfES\\H','sNp@DjUjj@[\\QXuq`a`@','HeT@@DjYUXPbH`@[JDIaTwCH','HiD@@DjwUjj`AmHPfES\\LXRF@','sNq@@djmUPB','KAx@@YIEEZjh@vDHSBincCPp@','sGP@Di^V`dmfHlZ','Hid@@DjYUaBHP@FtaBXUMp`','sNp@DjYjj@[\\QXuqba`@','sGP@Dkej`FsDVMcKC@','HeT@@DjU^k``b`@[JDIaTwCH','qC`@Qv`MbHmFBF@','sGQ@@djmT@`','qCr@XIKTAyH','qC`@IVtAlQEhpPp@','Hid@@LdbbQxXF@@AmHPfES\\LXjF@','sGP@DkYj`FsDVMcCC@','KAx@@IVsMUPAlHPfES\\','qCp@AIj`ODl','HiD@@DkeUjj`AmHPfES\\H','HeT@@DjU[kjjjh@ZLDXSSYPaLJfxY@','sJP@DkVdAmQEcFRF@','HiD@@LdbJTjjh@[RDIaTwCFDa`@','HiD@@DkYyjj`AmHPfES\\H','sJP@DjZhAyH','KAx@@IVkMUPAlHPfES]FDa`@','sJX@@dkU@OI@','Hed@@LdbRQUUUP@vTHSBinFXpLL@','Hed@@DjuUZjj@FraBXUMpr','sGP@Djfj`FsDVMcKC@','sNp@DkVZj@[\\QXuqba`@','sNp@DjyZj@[\\QXuqfa`@','qCb@AIj`OH@','sNp@DjUZj@[\\QXu`','KAx@@IWOMUPAlHPfES\\','Hid@@DjU^nBBH@D','Hed@@DjuvZjj@FraBXUMpr','sJP@DiVhHKZbKFLtL@','Hmt@@DjU_Zzjjj`AhpQaLmmBDpj[aeXplL@','sNp@DjuZj@[\\QXuqca`@','sJP@DkfhAmQEcFJF@','sNp@LdbJZj@[\\QXu`','HeT@@DjU_k``b`@[JDIaTwCLXFF@','KAx@@IVlmUPAlHPfES]FNa`@','HeT@@LdbbRKBDQD@CYPaLJfxYcEPp@','Hid@@DjUZnBBH@FtaBXUMpqcHX@','qCa@CIKTA@','HiD@@Dj~]jj`AmHPfES\\LXFF@','sKP@Di\\Zj@[TQX`','sGP@Djfj`FsDVMcEC@','HiD@@DkgYjj`AmHPfES\\H','sNp@DjuZj@[\\QXuqaa`@','KAx@@YIMDVjh@vDHSBincDPp@','sJP@DjVhHKZbKFLTL@','Hid@@LdbRQk``b@AmHPfES\\LXZF@','HiD@@Dj}Ujj`AmHPfES\\LXzF@','HeT@@DjU_k``bP@[JDIaTwCH','sNp@DkUZi@[\\QXu`','HiD@@DjYfjj`AmHPfES\\H','sGP@DjZj`FsDVMcAC@','Hmt@@DjU_jxHHj@AmhPfES\\Lj','Hid@@LdbRQk``R@AmHPfES\\H','KAx@@YIDUJjh@vDHSBincDPp@','qCr@XIKTAyD','sOq@@drm\\@@@|`@','Hed@@DjW^jjj@FraBXUMpsFBa`@','HeT@@DjY]zXFB@@[JDIaTwCH','Hkl@@DjU_Vk``bj`@[VDIaTwCJzX','Hid@@DjY}nBHH@FtaBXUMpqcHX@','sGX@@eKuT@|d@','sGP@Dj^Y`FsDVM@','HcL@@DjU_ZnBBJh@FqaBXUMprn`','sJP@DkVdAmQEcFJF@','sOq@@drm\\@@@|b@','sNp@DjyZj@[\\QXuqaa`@','HaD@@DjUZxHH@AyD@','qC`@Qv`H','Hmt@@DjU_Zzjjj`AhpQaLmmBDpj[aeXqdL@','sGP@Dkej`FsDVMcMC@','Hed@@DjUUjjj@FraBXUMpsFHa`@','HeT@@LdbbRkBDQD@CYPaLJfxY@','KAx@@IU{MUPAlHPfES]FLa`@','RG@DTH','sJY@DDeVhA@','KAx@@YIDUJjh@vDHSBinc@Pp@','sJX@@dkU@OI`','sJQ@@dju@OI`','HeT@@LdbbRKBDQD@CYPaLJfxYcFPp@','sFp@DiTvjhAlqEcXpPp@','HaD@@DjUZxHH@AyG@','sNx@@eJ}UPB','sNp@LddUjj@[\\QXuqca`@','HaDH@@RVU[j@@@D','sNp@DkgZi@[\\QXu`','sGY@LDeVj`D','sNp@LdbJfZBZvxbqk@','sJP`@dfvhAyL','sGX@AddQjhAxe`','Hmt@@DjU_ZxHHj@AmhPfES\\LkFIa`@','qCh@CIKTA@','sNp@LdbLjj@[\\QXuq`a`@','sOq@@drm\\@@@|a@','KAx@@IUzmUPAlHPfES]FJa`@','sNx@AddQUUPB','sGP@Di]jP`mfHlZ','sJP`@TeZhA@','KAx@@IRjmUPHKXPaLJfx','HeT@@LdbRTM\\DDT@CYPaLJfxY@','HaF@@@Rfu[j@@@D','Hid@@DjYUaBH`@FtaBXUMpqchX@','KAx@@IUjmTpAlHPfES\\','Hid@@DjU^nBBD@FtaBXUMpqcHX@','sGP@DiUj``mfHl[FFF@','KAx@@IUvmUPAlHPfES]FLa`@','Hed@@LdbQTUUUP@vTHSBinFXqDL@','sJP@DkVhA@','sOx@@drm\\@@@|b@','KAx@@IUkMUPAlHPfES]FDa`@','HeT@@LdbRQU\\DDT@CYPaLJfxY@','HiD@@Dj}Yjj`AmHPfES\\LXrF@','HiD@@Dj{ujj`AmHPfES\\LXFF@','KAx@@IWNmUPAlHPfES]FFa`@','KAx@@IRkMUPHKXPaLJfx','sJP@DjYdAmQEcFZF@','sJY@LDeZhAyL','HaDH@@RVU[f@@@D','sJP`@deVhAyB','HaD@@DjWjZjj`AlHPfES\\','sGP@DkYj`FsDVMcMC@','sNp@DkgZj@[\\QXuqea`@','sJQ@@dlu@H','HeT@@DjU]k``b`@[JDIaTwCLXrF@','sJX@@dkU@OH`','RFDDQFCr`','sJP@DiYXIKZbKFLLL@','KAx@@YIHjjjh@vDHSBincGPp@','Hk\\@@DjU^ukmLHH@@@AmXPfES\\Lki`','sGQ@@djmT@|b@','Hid@@DjUfaBB`@FtaBXUMpqahX@','sNx@@eRmUPB','Hmt@@LdbRVak``ah@FvaBXUMprh','qCr@XIJtA@','KAx@@IWMmUPAlHPfES]FNa`@','HeT@@DjYYZPbJ@@[JDIaTwCH','sNp@DkfZj@[\\QXuqea`@','Hid@@DjU^nBAHAEVtaBXUMp`','Hmt@@DjYU^Vjjj`AhtISRmmBDpj[aeP','sGP@DkejPFsDVM@','sNx@@eJmUPB','qCb@AIf`H','HcL@@DjU_VnBBJh@FqaBXUMprnqcXX@','Hid@@DjUZnBBH@FtaBXUMpqahX@','sNp@LdbQZjBBvxbqkcGC@','sOx@@drm\\@@@|c@','sJP@H~j@^R@','KAx@@YIDcFjhDElHPfES\\','Hid@@DjUZnBAH@FtaBXUMp`','sNp@LddUji@[\\QXu`','sGP@DjfjPFsDVM@','HeT@@DjYUXPbD`@[JDIaTwCH','KAx@@IUoMUPAlHPfES]FDa`@','sFp@DiTt@@AyaD','Hed@@DjuuZjj@FraBXUMpsFIa`@','HeT@@DjUghP`h`@[JDIaTwCLXfF@','sOp@DjWkjj`FwDVM\\YhX@','sGP@Djfj`FsDVMcIC@','KAx@@IRkmUPHKXPaLJfzL]C@','sNx@@djmUPB','QM`AIdD','sOp@DjWkB@@Gbe@','sNp@DjyZj@[\\QXuqca`@','QM@HuAmd`','sNp@LddUjj@[\\QXuqea`@','HaD@@DkeVyjj`AhrXUMuaBDpj[hpDL@','qCb@AIZPH','HiD@@LdbJTjjh@[RDIaTwCF@a`@','Hmt@@DjU_ZxHHi@AmhPfES\\Lj','HaDH@@RYWih@H@D','HiD@@LdbJTjjh@[RDIaTwCFHa`@','sGX@@djuT@|a@','sNp@DkfZj@[\\QXuqaa`@','Hid@@DjU^nBBH@GdL','KAx@@IVkMUPAlHPfES]FJa`@','qCr@XIKTAy@','HmT@@Dj{uVjjh@[ZDIaTwCJqaXX@','Hmt@@DjYWVFjjj`AhpQe\\mmBDpj[aeP','Hif@@@RUe^Fh@@@P','HaDH@@Rfu[j@@@GdH','KAx@@IVsMUPAlHPfES]FDa`@','sKP@Di\\Zj@[TQXq`a`@','sJX@@eMU@OH@','HeT@@DjU^k``b`@[JDIaTwCLXFF@','Hmt@@LdbbRJXPbHh@FvaBXUMprh','sJP@DjvhAmQEcFBF@','Hmt@@LdbbRNXZjjj@FcAFUrvtHSBinFUcBpp@','sJP`@dfvhAyD','sGP@Di^V`dmfHl[FVF@','KAx@@IVsmUPAlHPfES]FBa`@','sOq@@drm\\@@@|PP','sJY@BDeZhA@','HeT@@LdbRbmBDED@CYPaLJfxY@','Hed@@Djy[Zjj@FraBXUMpr','HeT@@DjU]k``b`@[JDIaTwCLXFF@','Hid@@DjUfaBB`@D','qCa@CIJtA@','QMPARVA@','Hid@@DjUfaBB`@FtaBXUMpqcHX@','sJY@BDfZhA@','HeT@@DjUghP`hP@[JDIaTwCH','Hed@@Dj{uZjj@FraBXUMpsFIa`@','Hmt@@LdbbRUXZjjj@FcAFUrvtHSBinFUcFPp@','sNp`@dfuZj@P','sJQ@@dmU@OH@','sJX@@dmU@H','HeT@@DjU]k``b`@[JDIaTwCLXZF@','HiD@@LdfbJZjh@[RDIaTwCFAa`@','sOx@@drm\\@@@|a@','HeT@@LdbbQgCUUU@CQhRfz[JDIaTwCH','Hmt@@DjU]Zzjjj`AhpQaLmmBDpj[aeXplL@','sOp@DjWkjj`FwDVM\\XHX@','HcL@@LdbbRNSBDQEP@McBDpj[ae]cFpp@','HiD@@Dj}Yji`AmHPfES\\H','HaDH@@RYe[hB@@D','Hid@@DjU^njjj@FtaBXUMpq`XX@','HeT@@DkYeFVjjh@ZMaUpsYPaLJfxY@','QMPARZA@','sOq@@drm\\@@@|QX','HaD@@DjYvxH`@A@','HcL@@LdbbRNcBDQEP@McBDpj[ae]@','QMhDRZA@','RG@DXLHmP','QM`BN`XQYd','RG@DTLHmP','QMHAIXFEVd','QMDARVAaH','RFPDXLHmP','RF@Q`vRbdLEC@','RF@QpvR@','QO@HyjAmd`','`II@B','`II@CFspqJp','`II@CF[@hM@prB`','`H@[T[|B`XN@PdM@p|@bHrBcDk@','RG@DXMj}F@','QM`BN`[L~b@','RG@DTMj}D@','QMHAIXFt~j@','QMDARVA}L@','RFPDXMj}D@','sKP@Di\\YZ@[TQXqaa`@','RG@DXMH'])};kS.Rn=function Rn(a,b){var c,d;if(!b)return null;d=OC(fS.OD,YS,5,(kS.On.length+31)/32|0,15,1);b=kS.Un(b);kS.Fn(a.g,b);for(c=0;c<kS.On.length;c++){kS.En(a.g,kS.Pn[c]);kS.vn(a.g,4)>0&&(d[c/32|0]|=1<<31-c%32)}return d};kS.Sn=function Sn(){var a,b;if(kS.Pn==null){b=new kS._l(false);kS.Pn=OC(fS.yE,FS,29,kS.On.length,0,1);for(a=0;a<kS.On.length;a++){kS.Pn[a]=kS.Xl(b,kS.On[a]);kS.Qo(kS.Pn[a],1)}}};kS.Tn=function Tn(a){var b;for(b=0;b<a.f.length;b++)if((a.c[b]&~a.f[b])!=0)return false;!a.d&&(a.d=kS.Zl(new kS._l(false),a.e,null));!a.a&&(a.a=kS.Zl(new kS._l(false),a.b,null));kS.Fn(a.g,a.d);kS.En(a.g,a.a);return kS.zn(a.g)};kS.Un=function Un(a){var b,c;if(a.I){for(b=0;b<a.o;b++){if((a.w[b]&bT)!=0){a=new kS.fp(a);for(c=b;c<a.o;c++)(a.w[c]&bT)!=0&&(a.A[c]=-1);kS.Eh(a)}}}return a};kS.Vn=function Vn(a,b,c){a.b=null;a.a=b;c==null?(a.c=kS.Rn(a,b)):(a.c=c)};kS.Wn=function Wn(a,b,c){a.e=null;a.d=b;c==null?(a.f=kS.Rn(a,b)):(a.f=c)};kS.Xn=function Xn(){kS.Qn();this.g=new kS.Ln;kS.Sn()};kS.Yn=function Yn(a){kS.Qn();a=(a&1431655765)+(a>>>1&1431655765);a=(a&858993459)+(a>>>2&858993459);a=(a&117901063)+(a>>>4&117901063);a=(a&983055)+(a>>>8&983055);return (a&31)+(a>>>16)};kS.Zn=function Zn(a){kS.Qn();var b,c,d,e,f,g;if(a==null)return null;b=OC(fS.KD,HT,5,a.length*8,15,1);for(d=0;d<a.length;d++){g=a[d];for(e=7;e>=0;e--){c=g&15;c>9&&(c+=7);b[d*8+e]=48+c<<24>>24;g>>=4}}return gS.HK(jS.pR(b,0,(f=b.length,jS.mR(),f)))};kS.$n=function $n(a){kS.Qn();var b,c,d,e;if(gS.GK(a).length==0||(gS.GK(a).length&7)!=0)return null;d=OC(fS.OD,YS,5,gS.GK(a).length/8|0,15,1);for(c=0;c<gS.GK(a).length;c++){e=c/8|0;b=gS.GK(a).charCodeAt(c)-48;b>16&&(b-=7);d[e]<<=4;d[e]+=b}return d};kS._n=function _n(a,b){kS.Qn();var c,d,e,f;f=0;d=0;e=0;for(c=0;c<a.length;c++){f+=kS.Yn(a[c]&b[c]);d+=kS.Yn(a[c]);e+=kS.Yn(b[c])}return f/$wnd.Math.sqrt(d*e)};kS.ao=function ao(a,b){kS.Qn();var c,d,e,f,g;g=0;c=0;for(d=0;d<a.length;d++){e=a[d];f=b[d];g+=kS.Yn(e&f);c+=kS.Yn(e|f)}return g/c};nH(85,1,{},kS.Xn);fS.rE=YI(85);kS.co=function co(a){a.i=1;a.j=10;a.k=400;a.f=400;a.d='black';a.b=new AS.ZN;a.a=new AS.ZN;a.c=new gS.KK;a.e=new vS.OH(12)};kS.eo=function eo(a,b){var c,d,e,f,g;d=JD(b.a);e=JD(b.b);f=JD(b.c);g=JD(b.d);c='<line x1="'+d+jU+'y1="'+f+jU+'x2="'+e+jU+'y2="'+g+jU+'style="stroke:'+a.d+';'+kU+JD(a.i)+'"/>';kS.qo(a,c)};kS.fo=function fo(a,b){var c,d,e,f,g;d=JD(b.a);e=JD(b.b);f=JD(b.c);g=JD(b.d);c='<line stroke-dasharray="3, 3" x1="'+d+jU+'y1="'+f+jU+'x2="'+e+jU+'y2="'+g+jU+'stroke="'+a.d+jU+kU+JD(a.i)+'"/>';kS.qo(a,c)};kS.go=function go(a,b,c,d){var e,f;f=new gS.TK('<polygon points="');for(e=0;e<d;e++){gS.MK(f,JD(b[e]));f.a+=',';gS.MK(f,JD(c[e]));f.a+=' '}gS.OK(f,'" style="fill:'+a.d+';'+'stroke:'+a.d+';'+'stroke-width:1"/>');kS.qo(a,f.a)};kS.ho=function ho(a,b,c,d){var e,f,g,h;g=(e=(h=vS.MH(a.e,b),new wS.cI(0,0,h,0)).b,e);f='<text x="'+JD(c-g/2)+jU+'y="'+JD(d+(a.j/3|0))+jU+'font-family=" '+a.e.a+jU+'font-size="'+a.e.b+jU+'fill="'+a.d+'">'+b+'<\/text>';kS.qo(a,f)};kS.io=function io(a,b,c,d){var e;e='<circle cx="'+JD(b)+jU+'cy="'+JD(c)+jU+'r="'+JD(d)+jU+'fill="'+a.d+'" />';kS.qo(a,e)};kS.jo=function jo(a,b,c,d){var e;e='<circle id="'+(a.g!=null?a.g:'mol'+kS.bo)+':Atom:'+b+jU+lU+'cx="'+JD(c)+jU+'cy="'+JD(d)+jU+'r="'+8+jU+'fill-opacity="0"/>';AS.GN(a.a,e)};kS.ko=function ko(a,b,c,d,e,f,g){var h;h='<line id="'+(a.g!=null?a.g:'mol'+kS.bo)+':Bond:'+b+'-'+c+jU+lU+'x1="'+JD(d)+jU+'y1="'+JD(e)+jU+'x2="'+JD(f)+jU+'y2="'+JD(g)+jU+'stroke-width="'+8+jU+'stroke-opacity="0"'+'/>';AS.GN(a.b,h)};kS.lo=function lo(a,b){a.d='rgb('+(b.c>>16&255)+','+(b.c>>8&255)+','+(b.c&255)+')'};kS.mo=function mo(a,b){a.i=$wnd.Math.max(b,1)};kS.no=function no(a,b){if(a.j!=b){a.j=b;a.e=new vS.OH(b)}};kS.oo=function oo(a,b){a.k=JD(b.b);a.f=JD(b.a);return kS.Jd(a,b)};kS.po=function po(a){var b,c,d,e,f,g;f='<svg id="'+(a.g!=null?a.g:'mol'+kS.bo)+jU+'xmlns="http://www.w3.org/2000/svg" version="1.1" '+'width="'+a.k+'px" '+'height="'+a.f+'px" '+'viewBox="0 0 '+a.k+' '+a.f+'">\n';g='<style> #'+(a.g!=null?a.g:'mol'+kS.bo)+' {pointer-events:none; } '+' #'+(a.g!=null?a.g:'mol'+kS.bo)+' .event '+' { pointer-events:all;} '+' <\/style>\n';f+='\t';f+=g;for(e=new AS.tO(a.b);e.a<e.c.a.length;){d=AS.sO(e);kS.qo(a,d)}for(c=new AS.tO(a.a);c.a<c.c.a.length;){b=AS.sO(c);kS.qo(a,b)}return f+a.c.a+'<\/svg>'};kS.qo=function qo(a,b){gS.JK(a.c,'\t');gS.JK(a.c,b);gS.JK(a.c,ES)};kS.ro=function ro(a,b,c){kS.Nc();kS.Md.call(this,a,b);kS.co(this);this.g=c;++kS.bo};nH(115,129,{},kS.ro);_.db=function so(){return kS.po(this)};_.f=0;_.i=0;_.j=0;_.k=0;kS.bo=0;fS.tE=YI(115);kS.to=function to(a,b){var c,d,e,f;f=false;a.b=b;kS.Qo(a.b,7);c=a.b.d;d=a.b.e;a.j=OC(fS.CG,aT,5,d,16,1);for(e=0;e<d;++e)a.j[e]=false;a.g=OC(fS.CG,aT,5,c,16,1);a.c=OC(fS.OD,YS,5,c,15,1);for(e=0;e<c;++e){a.g[e]=false;a.c[e]=-1}a.e=OC(fS.MF,LT,2,3*c,6,1);a.i=0;a.d=0;a.a=0;while(!f){for(e=0;e<c;++e){if(!a.g[e]){a.a>0&&(a.e[a.i++]='.');kS.vo(a,e,-1);++a.a;break}}e==c&&(f=true)}a.f='';for(e=0;e<a.i;++e)a.f+=''+a.e[e];return a.f};kS.uo=function uo(a){switch(a){case 5:case 6:case 7:case 8:case 9:case 15:case 16:case 17:case 36:case 53:return true;default:return false;}};kS.vo=function vo(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o,p;d=true;i=0;p=0;m=a.i;a.c[b]=m;h=kS.ai(a.b,b);g=kS.Rh(a.b,b);e=kS.Lh(a.b,b);f=kS.Vh(a.b,b);k=kS.Hk(a.b,b);e==0&&f==0&&kS.uo(h)&&(d=false);a.e[m]='';if(c!=-1){switch(kS.mi(a.b,c)){case 0:a.e[m]+='~';break;case 2:a.e[m]+='=';break;case 3:a.e[m]+='#';}}d&&(a.e[m]+='[');f!=0&&(a.e[m]+=''+f);a.e[m]+=''+g;if(d){if(0<(o=kS.Tk(a.b,b))){a.e[m]+='H';1<o&&(a.e[m]+=o)}}if(e!=0){e>0?(a.e[m]+='+'):(a.e[m]+='-');(e<0?-e:e)>1&&(a.e[m]+=''+(e<0?-e:e))}d&&(a.e[m]+=']');c!=-1&&(a.j[c]=true);a.g[b]=true;++a.i;for(n=0;n<k;++n)a.j[kS.Ik(a.b,b,n)]||++i;for(n=0;n<k;++n){j=kS.Gk(a.b,b,n);l=kS.Ik(a.b,b,n);if(a.j[l]){++p;continue}if(a.g[j]){++a.d;a.j[l]=true;switch(kS.mi(a.b,l)){case 0:a.e[a.c[j]]+='~';a.e[m]+='~';break;case 2:a.e[a.c[j]]+='=';a.e[m]+='=';break;case 3:a.e[a.c[j]]+='#';a.e[m]+='3';}if(a.d>9){a.e[a.c[j]]+='%';a.e[m]+='%'}a.e[a.c[j]]+=''+a.d;a.e[m]+=''+a.d;continue}n-p<i-1&&(a.e[a.i++]='(');kS.vo(a,j,l);n-p<i-1&&(a.e[a.i++]=')')}};kS.wo=function wo(){};nH(114,1,{},kS.wo);_.a=0;_.d=0;_.i=0;fS.uE=YI(114);
kS.xo=function xo(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o;j=OC(fS.OD,YS,5,a.d.d,15,1);h=OC(fS.OD,YS,5,a.d.d,15,1);i=OC(fS.OD,YS,5,a.d.d,15,1);k=OC(fS.OD,YS,5,a.d.d,15,1);c=kS.ei(a.d,0,b);d=kS.ei(a.d,1,b);h[0]=c;h[1]=d;i[0]=-1;i[1]=b;j[c]=1;j[d]=2;k[c]=-1;k[d]=c;g=1;l=1;while(g<=l&&j[h[g]]<15){o=h[g];for(m=0;m<kS.Hk(a.d,o);m++){e=kS.Gk(a.d,o,m);if(e!=k[o]){f=kS.Ik(a.d,o,m);if(e==c){i[0]=f;for(n=0;n<=l;n++){if(!a.c[i[m]]){a.c[i[m]]=true;++a.b}}return}if(kS.Ni(a.d,e)&&j[e]==0){++l;h[l]=e;i[l]=f;j[e]=j[o]+1;k[e]=o}}}++g}return};kS.yo=function yo(a,b){var c,d,e,f,g,h,i,j,k,l,m;for(c=0;c<a.d.d;c++){if(kS.Ni(a.d,c)){i=OC(fS.OD,YS,5,a.d.d,15,1);h=OC(fS.OD,YS,5,a.d.d,15,1);j=OC(fS.OD,YS,5,a.d.d,15,1);h[0]=c;i[c]=1;j[c]=-1;g=0;k=0;while(g<=k){e=(i[h[g]]&1)==1?1:2;for(l=0;l<kS.Hk(a.d,h[g]);l++){d=kS.Ik(a.d,h[g],l);if(kS.mi(a.d,d)==e&&b[d]){f=kS.Gk(a.d,h[g],l);if(i[f]==0){if(e==1&&kS.Ni(a.d,f)){m=h[g];while(m!=-1){kS.Nj(a.d,kS.Ek(a.d,f,m),e==1?2:1);e=3-e;f=m;m=j[m]}kS.tj(a.d,c,false);kS.tj(a.d,f,false);a.a-=2;return true}h[++k]=f;j[f]=h[g];i[f]=i[h[g]]+1}}}++g}}}return false};kS.zo=function zo(a){var b,c,d,e;for(b=0;b<a.d.d;b++){if(kS.ai(a.d,b)==7&&kS.Lh(a.d,b)==0&&kS.Yk(a.d,b)>3&&kS.xk(a.d,b)>0){for(e=0;e<kS.Hk(a.d,b);e++){c=kS.Gk(a.d,b,e);d=kS.Ik(a.d,b,e);if(kS.mi(a.d,d)>1&&kS.Li(a.d,c)){kS.pi(a.d,d)==4?kS.Nj(a.d,d,2):kS.Nj(a.d,d,1);kS.kj(a.d,b,kS.Lh(a.d,b)+1);kS.kj(a.d,c,kS.Lh(a.d,c)-1);break}}}}};kS.Ao=function Ao(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B;kS.Qo(a.d,1);a.c=OC(fS.CG,aT,5,a.d.e,16,1);a.b=0;for(f=0;f<a.d.e;f++){if(kS.pi(a.d,f)==64){kS.Nj(a.d,f,1);a.c[f]=true;++a.b}}B=new kS.kn(a.d,3);o=OC(fS.CG,aT,5,B.i.a.length,16,1);for(u=0;u<B.i.a.length;u++){w=AS.LN(B.i,u);o[u]=true;for(k=0;k<w.length;k++){if(!kS.Ni(a.d,w[k])){o[u]=false;break}}if(o[u]){A=AS.LN(B.j,u);for(l=0;l<A.length;l++){if(!a.c[A[l]]){a.c[A[l]]=true;++a.b}}}}for(g=0;g<a.d.e;g++){!a.c[g]&&B.b[g]!=0&&kS.Ni(a.d,kS.ei(a.d,0,g))&&kS.Ni(a.d,kS.ei(a.d,1,g))&&kS.xo(a,g)}kS.Qo(a.d,3);n=OC(fS.CG,aT,5,a.d.e,16,1);for(m=0;m<a.d.e;m++)n[m]=a.c[m];for(v=0;v<B.i.a.length;v++){if(o[v]){w=AS.LN(B.i,v);for(j=0;j<w.length;j++){if(!kS.Eo(a,w[j])){if(kS.Ni(a.d,w[j])){kS.tj(a.d,w[j],false);--a.a}for(q=0;q<kS.Hk(a.d,w[j]);q++){i=kS.Ik(a.d,w[j],q);if(a.c[i]){a.c[i]=false;--a.b}}}}}}kS.Do(a);for(t=0;t<B.i.a.length;t++){if(o[t]&&AS.LN(B.j,t).length==6){A=AS.LN(B.j,t);p=true;for(d=0,e=A.length;d<e;++d){c=A[d];if(!a.c[c]){p=false;break}}if(p){kS.Co(a,A[0]);kS.Co(a,A[2]);kS.Co(a,A[4]);kS.Do(a)}}}for(s=5;s>=4;s--){do{r=false;for(c=0;c<a.d.e;c++){if(a.c[c]){b=0;for(j=0;j<2;j++){h=kS.ei(a.d,j,c);for(q=0;q<kS.Hk(a.d,h);q++)a.c[kS.Ik(a.d,h,q)]&&++b}if(b==s){kS.Co(a,c);kS.Do(a);r=true;break}}}}while(r)}while(a.a>=2)if(!kS.yo(a,n))break;if(a.a!=0)throw HG(new gS.FA(mU));if(a.b!=0)throw HG(new gS.FA(mU))};kS.Bo=function Bo(a,b,c,d){var e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z;a.d=b;kS.Fh(a.d);L=null;i=OC(fS.OD,YS,5,64,15,1);i[0]=-1;O=OC(fS.OD,YS,5,64,15,1);Q=OC(fS.OD,YS,5,64,15,1);P=OC(fS.OD,YS,5,64,15,1);for(v=0;v<64;v++)O[v]=-1;N=0;g=0;T=false;M=false;R=false;k=0;S=c.length;j=1;while(c[N]<=32)++N;while(N<S){U=c[N++]&TS;if(KI(U)||U==42){h=0;q=-1;A=false;K=false;w=false;if(T){if(U==82&&JI(c[N]&TS)){F=JI(c[N+1]&TS)?2:1;h=kS.ek(gS.HK(jS.pR(c,N-1,(C=1+F,jS.mR(),C))));N+=F}else{B=NI(c[N]&TS)==(c[N]&TS)&&KI(c[N]&TS)?2:1;h=kS.ek(gS.HK(jS.pR(c,N-1,(jS.mR(),B))));N+=B-1;q=0}if(c[N]==64){++N;if(c[N]==64){w=true;++N}K=true}if(c[N]==72){++N;q=1;if(JI(c[N]&TS)){q=c[N]-48;++N}}}else if(U==42){h=6;A=true}else{switch(String.fromCharCode(U).toUpperCase().charCodeAt(0)){case 66:if(N<S&&c[N]==114){h=35;++N}else h=5;break;case 67:if(N<S&&c[N]==108){h=17;++N}else h=6;break;case 70:h=9;break;case 73:h=53;break;case 78:h=7;break;case 79:h=8;break;case 80:h=15;break;case 83:h=16;}}if(h==0)throw HG(new gS.FA('SmilesParser: unknown element label found'));f=kS.fh(a.d,h);if(A){R=true;kS.wj(a.d,f,1,true)}if(NI(U)==U&&KI(U)){kS.tj(a.d,f,true);++a.a}else{kS.tj(a.d,f,false)}if(q!=-1&&h!=1){l=OC(fS.KD,HT,5,1,15,1);l[0]=q<<24>>24;kS.oj(a.d,f,l)}r=i[k];i[k]!=-1&&j!=128&&kS.hh(a.d,f,i[k],j);j=1;i[k]=f;if(g!=0){kS.uj(a.d,f,g);g=0}if(d){I=!L?null:AS.gN(L,gS.YJ(r));!!I&&kS.Ho(I,f,N,h==1);if(K){!L&&(L=new AS.IP);AS.AP(L,gS.YJ(f),new kS.Ko(a,f,r,q,N,w))}}continue}if(U==46){j=128;continue}if(U==61){j=2;continue}if(U==35){j=4;continue}if(JI(U)){G=U-48;if(T){while(N<S&&JI(c[N]&TS)){G=10*G+c[N]-48;++N}g=G}else{t=c[N-2]==45||c[N-2]==61||c[N-2]==35||c[N-2]==58;if(M&&N<S&&JI(c[N]&TS)){G=10*G+c[N]-48;++N}M=false;if(G>=64)throw HG(new gS.FA('SmilesParser: ringClosureAtom number out of range'));if(O[G]==-1){O[G]=i[k];Q[G]=N-1;P[G]=t?j:-1}else{if(O[G]===i[k])throw HG(new gS.FA('SmilesParser: ring closure to same atom'));if(d&&!!L){I=AS.gN(L,gS.YJ(O[G]));!!I&&kS.Ho(I,i[k],Q[G],false);I=AS.gN(L,gS.YJ(i[k]));!!I&&kS.Ho(I,O[G],N-1,false)}P[G]!=-1&&(j=P[G]);kS.hh(a.d,i[k],O[G],j);O[G]=-1}j=1}continue}if(U==43){if(!T)throw HG(new gS.FA("SmilesParser: '+' found outside brackets"));m=1;while(c[N]==43){++m;++N}if(m==1&&JI(c[N]&TS)){m=c[N]-48;++N}kS.kj(a.d,i[k],m);continue}if(U==45){if(!T)continue;m=-1;while(c[N]==45){--m;++N}if(m==-1&&JI(c[N]&TS)){m=48-c[N];++N}kS.kj(a.d,i[k],m);continue}if(U==40){if(i[k]==-1)throw HG(new gS.FA('Smiles with leading parenthesis are not supported'));i[k+1]=i[k];++k;continue}if(U==41){--k;continue}if(U==91){if(T)throw HG(new gS.FA('SmilesParser: nested square brackets found'));T=true;continue}if(U==93){if(!T)throw HG(new gS.FA('SmilesParser: closing bracket without opening one'));T=false;continue}if(U==37){M=true;continue}if(U==58){if(!T){j=64;continue}D=0;while(JI(c[N]&TS)){D=10*D+c[N]-48;++N}kS.sj(a.d,i[k],D,false);continue}if(U==47){d&&(j=17);continue}if(U==92){d&&(j=9);continue}throw HG(new gS.FA("SmilesParser: unexpected character found: '"+String.fromCharCode(U)+"'"))}if(j!=1)throw HG(new gS.FA('SmilesParser: dangling open bond'));for(u=0;u<64;u++)if(O[u]!=-1)throw HG(new gS.FA('SmilesParser: dangling ring closure'));s=kS.Rk(a.d);kS.Qj(a.d,true);kS.Qo(a.d,1);for(e=0;e<a.d.o;e++){if((b.r==null?null:b.r[e]==null?null:gS.rK(b.r[e]))!=null){if(!kS.Ni(a.d,e)){p=kS.Oh(a.d,e)[0];if(kS.ai(a.d,e)<(kS.dh(),kS.$g).length&&kS.$g[kS.ai(a.d,e)]!=null){n=false;V=kS.Yk(a.d,e);V-=kS.si(a.d,e,V);for(X=kS.$g[kS.ai(a.d,e)],Y=0,Z=X.length;Y<Z;++Y){W=X[Y];if(V<=W){n=true;W!=V+p&&kS.ij(a.d,e,V+p);break}}n||kS.ij(a.d,e,V+p)}}}}kS.zo(a);kS.Ao(a);a.d.r=null;kS.Qj(a.d,false);d&&kS.Fo(a)&&kS.Hl(a.d,0);if(d){mS.bq(new mS.rq,a.d);if(L){for(J=(H=new AS.SP((new AS.XP((new AS.LM(L)).a)).b),new AS.SM(H));AS.ML(J.a.a);){I=(o=AS.QP(J.a),o.Fb());kS.vj(a.d,I.a,kS.Io(I,s),false)}kS.Hl(a.d,0)}kS.Kl(a.d);kS.ap(a.d)}R&&kS.Pj(a.d,true)};kS.Co=function Co(a,b){var c,d,e,f;kS.pi(a.d,b)==1&&kS.Nj(a.d,b,2);for(e=0;e<2;e++){c=kS.ei(a.d,e,b);if(kS.Ni(a.d,c)){kS.tj(a.d,c,false);--a.a}for(f=0;f<kS.Hk(a.d,c);f++){d=kS.Ik(a.d,c,f);if(a.c[d]){a.c[d]=false;--a.b}}}};kS.Do=function Do(a){var b,c,d,e,f,g,h;do{h=false;for(c=0;c<a.d.e;c++){if(a.c[c]){f=false;for(e=0;e<2;e++){b=false;d=kS.ei(a.d,e,c);for(g=0;g<kS.Hk(a.d,d);g++){if(c!=kS.Ik(a.d,d,g)&&a.c[kS.Ik(a.d,d,g)]){b=true;break}}if(!b){f=true;break}}if(f){h=true;kS.Co(a,c)}}}}while(h)};kS.Eo=function Eo(a,b){var c;if(kS.ai(a.d,b)==16&&kS.Lh(a.d,b)<=0||kS.ai(a.d,b)==6&&kS.Lh(a.d,b)!=0||!kS.Ni(a.d,b))return false;c=kS.Nh(a.d,b)==null?0:kS.Oh(a.d,b)[0];if(kS.Qk(a.d,b)-c<1)return false;if(kS.ai(a.d,b)!=5&&kS.ai(a.d,b)!=6&&kS.ai(a.d,b)!=7&&kS.ai(a.d,b)!=8&&kS.ai(a.d,b)!=15&&kS.ai(a.d,b)!=16&&kS.ai(a.d,b)!=33&&kS.ai(a.d,b)!=34)return false;return true};kS.Fo=function Fo(a){var b,c,d,e,f,g,h,i,j,k,l,m,n;kS.Qo(a.d,3);l=false;m=OC(fS.OD,YS,5,2,15,1);n=OC(fS.OD,YS,5,2,15,1);k=OC(fS.OD,YS,5,2,15,1);for(d=0;d<a.d.e;d++){if(!kS.yl(a.d,d)&&kS.pi(a.d,d)==2){for(g=0;g<2;g++){m[g]=-1;k[g]=-1;b=kS.ei(a.d,g,d);for(j=0;j<kS.Hk(a.d,b);j++){e=kS.Ik(a.d,b,j);if(e!=d){if(kS.pi(a.d,e)==17||kS.pi(a.d,e)==9){m[g]=kS.Gk(a.d,b,j);n[g]=e}else{k[g]=kS.Gk(a.d,b,j)}}}if(m[g]==-1)break}if(m[0]!=-1&&m[1]!=-1){i=kS.pi(a.d,n[0])!=kS.pi(a.d,n[1]);h=false;for(f=0;f<2;f++){k[f]!=-1&&k[f]<m[f]&&(h=!h)}kS.Kj(a.d,d,i^h?2:1,false);l=true}}}for(c=0;c<a.d.e;c++)(kS.pi(a.d,c)==17||kS.pi(a.d,c)==9)&&kS.Nj(a.d,c,1);return l};kS.Go=function Go(){};nH(117,1,{},kS.Go);_.a=0;_.b=0;fS.wE=YI(117);kS.Ho=function Ho(a,b,c,d){if(a.b)return;if(a.g==4||a.g==3&&a.c!=-1){a.b=true;return}a.i[a.g]=d;a.f[a.g]=b;a.j[a.g]=c;++a.g};kS.Io=function Io(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p;if(a.b)return 3;a.c!=-1&&(a.c=b[a.c]);for(g=0;g<a.g;g++)a.f[g]!=KS&&(a.f[g]=b[a.f[g]]);if(a.c==-1&&a.d==0){n=KS;m=-1;for(h=0;h<a.g;h++){if(n>a.j[h]){n=a.j[h];m=h}}a.c=a.f[m];for(i=m+1;i<a.g;i++){a.f[i-1]=a.f[i];a.j[i-1]=a.j[i];a.i[i-1]=a.i[i]}--a.g}p=(a.c==-1?0:1)+a.d+a.g;if(p>4||p<3)return 3;c=a.c==-1&&a.d==1||a.c!=-1&&kS.wl(a.k.d,a.c);e=-1;for(j=0;j<a.g;j++){if(a.i[j]){if(e!=-1||c)return 3;e=j}}l=false;if(e!=-1)for(k=0;k<a.g;k++)!a.i[k]&&a.f[e]<a.f[k]&&(l=!l);d=false;if(a.c!=-1&&!c)for(f=0;f<a.g;f++)a.c<a.f[f]&&(d=!d);o=a.e^kS.Jo(a.f,a.j,a.g)^d^l?2:1;return o};kS.Jo=function Jo(a,b,c){var d,e,f;e=false;for(d=1;d<c;d++){for(f=0;f<d;f++){a[f]>a[d]&&(e=!e);b[f]>b[d]&&(e=!e)}}return e};kS.Ko=function Ko(a,b,c,d,e,f){this.k=a;if(d!=0&&d!=1){this.b=true}else{this.a=b;this.c=c;this.d=d;this.e=f;this.g=0;this.i=OC(fS.CG,aT,5,4,16,1);this.f=OC(fS.OD,YS,5,4,15,1);this.j=OC(fS.OD,YS,5,4,15,1);if(c!=-1&&d==1){kS.Ho(this,KS,e,true);this.d=0}}};nH(97,1,{97:1},kS.Ko);_.a=0;_.b=false;_.c=0;_.d=0;_.e=false;_.g=0;fS.vE=YI(97);kS.Lo=function Lo(a){a.c=new AS.ZN};kS.Mo=function Mo(a,b){var c,d,e,f;f=a.c.a.length;if(f==0){AS.FN(a.c,0,b);return 0}e=1;while(2*e<=f)e<<=1;d=e;--e;while(d!=0){d>>=1;if(e>=f){e-=d;continue}c=gS.oK(b,AS.LN(a.c,e));if(c==0)return -1;if(d==0)break;c<0?(e-=d):(e+=d)}e<f&&gS.oK(b,AS.LN(a.c,e))>0&&++e;AS.FN(a.c,e,b);return e};kS.No=function No(a,b){var c,d,e,f;f=a.c.a.length;if(f==0)return -1;e=1;while(2*e<=f)e<<=1;d=e;--e;while(d!=0){d>>=1;if(e>=f){e-=d;continue}c=gS.oK(b,AS.LN(a.c,e));if(c==0)return e;if(d==0)break;c<0?(e-=d):(e+=d)}return -1};kS.Oo=function Oo(){kS.Lo(this)};nH(109,1,FT,kS.Oo);fS.xE=YI(109);kS.Po=function Po(a,b){kS.yh(a,b);!!a.b&&(b.Q=0)};kS.Qo=function Qo(a,b){var c,d,e,f;kS.nk(a,b);if((b&~a.Q)==0)return;a.a&&(b|=128);for(c=0;c<a.o;c++)a.s[c]&=-134447112;for(d=0;d<a.e;d++)a.C[d]&=-64;e=0;f=0;if((b&16)!=0){e=16;f=1}else if((b&32)!=0){e=32;f=3}else if((b&64)!=0){e=64;f=5}if((b&128)!=0){e|=128;f|=32}a.b=new kS.zf(a,f);kS.vf(a.b);kS.wf(a.b);kS.uf(a.b);kS.dp(a)&&(a.b=new kS.zf(a,f));a.Q|=12|e};kS.Ro=function Ro(a,b){return kS.jf(a.b,b)};kS.So=function So(a,b){return kS.cf(a.b,b)};kS.To=function To(a){var b;kS.Qo(a,15);b=a.G&TS;switch(a.G&KT){case SS:return null;case IT:return b==1?'meso':''+b+' meso diastereomers';case 0:return 'unknown chirality';case 196608:return 'racemate';case CT:return 'this enantiomer';case 327680:return 'this or other enantiomer';case sT:return 'two epimers';default:return b==1?'one stereo isomer':''+b+' stereo isomers';}};kS.Uo=function Uo(a){var b;b=new kS.ep(a.o,a.p);kS.xh(a,b);return b};kS.Vo=function Vo(a){var b,c;b=OC(fS.OD,YS,5,a.o,15,1);c=kS.Pk(a,b,false,false);return kS.Wo(a,b,c)};kS.Wo=function Wo(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o,p,q;p=OC(fS.yE,FS,29,c,0,1);g=OC(fS.OD,YS,5,c,15,1);j=OC(fS.OD,YS,5,c,15,1);f=OC(fS.OD,YS,5,a.o,15,1);for(e=0;e<a.o;e++)b[e]!=-1&&(f[e]=g[b[e]]++);for(i=0;i<a.p;i++){n=b[a.B[0][i]];o=b[a.B[1][i]];n==o&&n!=-1&&++j[n]}for(q=0;q<c;q++){p[q]=new kS.ep(g[q],j[q]);kS.Po(a,p[q])}for(d=0;d<a.o;d++)b[d]!=-1&&kS.uh(a,p[b[d]],d,0,0);for(h=0;h<a.p;h++){n=b[a.B[0][h]];o=b[a.B[1][h]];n==o&&n!=-1&&kS.wh(a,p[n],h,0,0,f,false)}for(l=0,m=p.length;l<m;++l){k=p[l];kS.ej(k,1);kS.ej(k,2)}return p};kS.Xo=function Xo(a){kS.Qo(a,7);return !a.b?null:kS.ff(a.b)};kS.Yo=function Yo(a){kS.Qo(a,7);return !a.b?null:kS.df(a.b)};kS.Zo=function Zo(a){var b,c;kS.Qo(a,15);c=0;for(b=0;b<a.d;b++)(a.s[b]&3)!=0&&(a.s[b]&4)==0&&++c;return c};kS.$o=function $o(a,b){return kS.hf(a.b,b)};kS._o=function _o(a,b){a.a=b;a.Q&=-136};kS.ap=function ap(a){kS.Qo(a,15);!!a.b&&kS.xf(a.b)};kS.bp=function bp(a){var b,c;kS.Qo(a,7);a.J=false;for(b=0;b<a.o;b++){a.s[b]&=WT;(a.s[b]&3)!=0?(a.s[b]|=TT):(a.s[b]&=-67108865)}for(c=0;c<a.p;c++)(a.C[c]&3)!=0&&kS.mi(a,c)==2?(a.F[c]=26):(a.F[c]&=-25);a.Q&=-253};kS.cp=function cp(a){var b,c,d,e,f,g;kS.Nl(a);kS.Qo(a,15);for(d=0;d<a.d;d++){if(((a.s[d]&xT)>>19==1||(a.s[d]&xT)>>19==2)&&((a.s[d]&UT)==0||(a.s[d]&3)==3))throw HG(new gS.FA(nU));if((a.s[d]&IT)!=0)throw HG(new gS.FA('Over- or under-specified stereofeature or more than one racemic type bond'));if(((a.s[d]&3)==1||(a.s[d]&3)==2)&&a.k[d]==0){b=OC(fS.MD,_S,5,a.g[d],15,1);for(f=0;f<a.g[d];f++)b[f]=kS.di(a,d,a.f[d][f]);for(e=1;e<a.g[d];e++)if(!kS.Vi(a,a.i[d][e],d))for(g=0;g<e;g++)if(!kS.Vi(a,a.i[d][g],d)){c=$wnd.Math.abs(kS.dk(b[e],b[g]));if(c<0.08||c>ZT)throw HG(new gS.FA(oU))}}}};kS.dp=function dp(a){var b,c,d,e,f,g;g=false;for(c=0;c<a.d;c++)((a.s[c]&UT)==0||(a.s[c]&3)==3)&&(a.s[c]&=WT);if(a.J){if((a.G&KT)!=IT){f=OC(fS.CG,aT,5,a.d,16,1);for(d=0;d<a.d;d++)(a.s[d]&UT)!=0&&(a.s[d]&3)!=3&&(a.s[d]&xT)>>19==1&&(f[d]=true);for(e=0;e<a.d;e++){if((a.s[e]&UT)!=0&&(a.s[e]&3)!=3){kS.pj(a,e,1,0);g=true}}for(b=0;b<a.d;b++){if(f[b]){kS.vj(a,b,1,false);kS.pj(a,b,1,-1);g=true}}}a.J=false}kS.ej(a,1);kS.ej(a,2);return g};kS.ep=function ep(a,b){kS.dh();kS.Ql.call(this,a,b)};kS.fp=function fp(a){kS.dh();kS.Rl.call(this,a)};nH(29,58,{58:1,51:1,29:1,4:1},kS.ep,kS.fp);_.gb=function gp(a){kS.Qo(this,a)};_.a=false;fS.yE=YI(29);kS.hp=function hp(a){a.b=new AS.ZN;a.a=new AS.ZN};kS.ip=function ip(a,b){var c,d;c=kS.Mo(a,b);if(c==-1)return -1;d=a.b.a.length;AS.GN(a.b,b);AS.FN(a.a,c,new gS.RJ(d));return d};kS.jp=function jp(){kS.Oo.call(this);kS.hp(this)};nH(120,109,FT,kS.jp);fS.zE=YI(120);lS.lp=function lp(){lS.lp=pH;lS.kp=kS.ek('X')};lS.mp=function mp(a){lS.lp();var b,c,d,e,f;for(d=0;d<a.o;d++){f=kS.Uo(a);kS.Dj(f,d,lS.kp);kS.Qo(f,7);for(c=0;c<f.d;c++){if((f.s[c]&UT)!=0&&kS.el(f,c)==-1){e=(kS.Qo(f,3),f.k[c]==2&&f.g[c]==2?kS.Bl(f,c):kS.Dl(f,c));if(e!=-1){a.F[e]=17;a.Q=0;if(a.B[1][e]==c){b=a.B[0][e];a.B[0][e]=c;a.Q=0;a.B[1][e]=b;a.Q=0}kS.pj(a,c,1,0)}}}}};lS.np=function np(a){lS.lp();var b,c,d,e;lS.mp(a);d=a.o;c=OC(fS.MF,LT,2,d,6,1);for(b=0;b<d;b++){e=kS.Uo(a);kS.nj(e,b,(kS.dh(),kS.Zg)[e.A[b]]+'*');e.A[b]==1?kS.Dj(e,b,lS.kp):kS.uj(e,b,e.v[b]+5);lS.op(e);c[b]=kS.ff(new kS.zf(e,8))}return c};lS.op=function op(a){var b;kS.Qo(a,7);for(b=0;b<a.o;b++){(a.s[b]&3)!=0&&kS.pj(a,b,1,0)}};lS.kp=0;lS.pp=function pp(a,b,c){var d,e;d=MC(fS.MF,[FS,LT],[28,2],6,[a.d,b],2);kS.Qo(a,3);for(e=0;e<a.d;e++){d[e]=lS.qp(a,e,b,c)}return d};lS.qp=function qp(a,b,c,d){var e,f,g,h,i,j,k,l,m,n,o,p;i=new kS.ep(a.d,a.e);k=new AS.FQ;n=0;m=0;g=OC(fS.CG,aT,5,a.d,16,1);f=OC(fS.OD,YS,5,a.d,15,1);for(p=0;p<c&&m<a.d;p++){if(m==0){f[0]=b;g[b]=true;m=1}else{o=m;for(j=n;j<m;j++){e=f[j];for(l=0;l<a.g[e];l++){h=a.f[e][l];if(!g[h]){switch(d){case 0:g[h]=true;f[o++]=h;break;case 1:if(!(lS.sp(a,e)&&lS.sp(a,h))){g[h]=true;f[o++]=h}}}}}n=m;m=o}kS.lk(a,i,g,true,null);AS.CQ(k,kS.ff(new kS.zf(i,8)))}return AS.EQ(k,OC(fS.MF,LT,2,k.a.a.length,6,1))};lS.rp=function rp(a,b,c){var d,e,f,g,h;g=kS.Xl(new kS._l(true),a);e=-1;for(f=0;f<g.o;f++){d=g.r==null?null:g.r[f]==null?null:gS.rK(g.r[f]);if(d!=null&&(h=gS.GK('*').length,gS.sK(gS.GK(d).substr(gS.GK(d).length-h,h),'*'))){e=f;break}}if(e>=0){return lS.qp(g,e,b,c)}return OC(fS.MF,LT,2,0,6,1)};lS.sp=function sp(a,b){if(a.A[b]!=6)return false;if(a.q[b]!=0)return false;if(kS.Tk(a,b)+a.g[b]!=4)return false;return true};lS.Dp=function Dp(){lS.Dp=pH;lS.tp=$wnd.Math.cos(AT);lS.yp=$wnd.Math.sin(AT);lS.vp=$wnd.Math.cos(pU);lS.Ap=$wnd.Math.sin(pU);lS.xp=$wnd.Math.cos(zT);lS.Cp=$wnd.Math.sin(zT);lS.up=$wnd.Math.cos(qU);lS.zp=$wnd.Math.sin(qU);lS.wp=$wnd.Math.cos(YT);lS.Bp=$wnd.Math.sin(YT);$wnd.Math.cos(rU);$wnd.Math.sin(rU)};lS.Ep=function Ep(a){lS.Dp();var b,c;kS.Qo(a,1);c=a.d;for(b=0;b<c;b++){lS.Fp(a,b)}};lS.Fp=function Fp(a,b){lS.Dp();var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G,H,I,J,K,L,M,N,O,P;H=kS.Tk(a,b);O=a.H[b].a;P=a.H[b].b;switch(H){case 1:{J=a.g[b];if(J==0){n=ST;B=-1;for(f=0;f<a.o;f++){if(f==b)continue;l=O-a.H[f].a;m=P-a.H[f].b;j=$wnd.Math.sqrt(l*l+m*m);if(n>j){n=j;B=f}}p=O-a.H[B].a;s=P-a.H[B].b}else{p=O-kS.Zh(a,a.f[b][0]);s=P-kS.$h(a,a.f[b][0])}if(J==1){C=kS.eh(a,O+lS.wp*p+lS.Bp*s,P-lS.Bp*p+lS.wp*s,0)}else if(J==2){p=O-0.5*(kS.Zh(a,a.f[b][0])+kS.Zh(a,a.f[b][1]));s=P-0.5*(kS.$h(a,a.f[b][0])+kS.$h(a,a.f[b][1]));C=kS.eh(a,O+p,P+s,0)}else if(J==3){L=a.f[b][0];for(w=1;w<3;w++){i=a.i[b][w];(a.F[i]==9||a.F[i]==17)&&(L=a.f[b][w])}c=$wnd.Math.abs(kS.dk(kS.ck(a.H[b].a,a.H[b].b,kS.Zh(a,a.f[b][0]),kS.$h(a,a.f[b][0])),kS.ck(a.H[b].a,a.H[b].b,kS.Zh(a,a.f[b][1]),kS.$h(a,a.f[b][1]))));d=$wnd.Math.abs(kS.dk(kS.ck(a.H[b].a,a.H[b].b,kS.Zh(a,a.f[b][0]),kS.$h(a,a.f[b][0])),kS.ck(a.H[b].a,a.H[b].b,kS.Zh(a,a.f[b][2]),kS.$h(a,a.f[b][2]))));e=$wnd.Math.abs(kS.dk(kS.ck(a.H[b].a,a.H[b].b,kS.Zh(a,a.f[b][1]),kS.$h(a,a.f[b][1])),kS.ck(a.H[b].a,a.H[b].b,kS.Zh(a,a.f[b][2]),kS.$h(a,a.f[b][2]))));K=true;if(c>d&&c>e){if(d+e<fT){K=false;p=O-0.5*(kS.Zh(a,a.f[b][0])+kS.Zh(a,a.f[b][1]));s=P-0.5*(kS.$h(a,a.f[b][0])+kS.$h(a,a.f[b][1]))}}else if(d>c&&d>e){if(c+e<fT){K=false;p=O-0.5*(kS.Zh(a,a.f[b][0])+kS.Zh(a,a.f[b][2]));s=P-0.5*(kS.$h(a,a.f[b][0])+kS.$h(a,a.f[b][2]))}}else{if(c+d<fT){K=false;p=O-0.5*(kS.Zh(a,a.f[b][1])+kS.Zh(a,a.f[b][2]));s=P-0.5*(kS.$h(a,a.f[b][1])+kS.$h(a,a.f[b][2]))}}if(K){M=a.f[b][0];o=ST;for(v=0;v<3;v++){g=a.f[b][v];if(g!=L){k=$wnd.Math.pow(a.H[b].a-a.H[g].a,2)+$wnd.Math.pow(a.H[b].b-a.H[g].b,2);if(k<o){M=g;o=k;gS.WK()}}}C=kS.eh(a,(a.H[L].a+a.H[M].a)/2,(a.H[L].b+a.H[M].b)/2,0)}else{C=kS.eh(a,O+p,P+s,0)}}else{C=kS.eh(a,O+p,P+s,0)}kS.Dj(a,C,1);kS.hh(a,b,C,1)}break;case 2:I=a.g[b];if(I==1){p=O-kS.Zh(a,a.f[b][0]);s=P-kS.$h(a,a.f[b][0]);C=kS.eh(a,O+(lS.xp*p-lS.Cp*s)*0.7,P+(lS.Cp*p+lS.xp*s)*0.7,0);kS.Dj(a,C,1);kS.hh(a,b,C,1);C=kS.eh(a,O+(lS.up*p-lS.zp*s)*0.7,P+(lS.zp*p+lS.up*s)*0.7,0);kS.Dj(a,C,1);kS.hh(a,b,C,1)}else if(I==2){q=O-kS.Zh(a,a.f[b][0]);t=P-kS.$h(a,a.f[b][0]);r=O-kS.Zh(a,a.f[b][1]);u=P-kS.$h(a,a.f[b][1]);F=$wnd.Math.sqrt(q*q+t*t)*0.7;G=$wnd.Math.sqrt(r*r+u*u)*0.7;p=q+r;s=t+u;D=$wnd.Math.sqrt(p*p+s*s);h=(F+G)/2;p=p/D*h;s=s/D*h;N=kS.el(a,b);C=kS.eh(a,O+lS.tp*p-lS.yp*s,P+lS.yp*p+lS.tp*s,0);kS.Dj(a,C,1);N>-1?kS.hh(a,b,C,1):kS.hh(a,b,C,17);C=kS.eh(a,O+lS.vp*p-lS.Ap*s,P+lS.Ap*p+lS.vp*s,0);kS.Dj(a,C,1);kS.hh(a,b,C,1)}else{for(A=0;A<2;A++){C=kS.eh(a,O,P,0);kS.Dj(a,C,1);kS.hh(a,b,C,1)}}break;case 3:{p=(O-kS.Zh(a,a.f[b][0]))*0.7;s=(P-kS.$h(a,a.f[b][0]))*0.7;C=kS.eh(a,O+p,P+s,0);kS.Dj(a,C,1);kS.hh(a,b,C,1);C=kS.eh(a,O-s,P+p,0);kS.Dj(a,C,1);kS.hh(a,b,C,1);C=kS.eh(a,O+s,P-p,0);kS.Dj(a,C,1);kS.hh(a,b,C,1)}break;default:{for(A=0;A<H;A++){C=kS.eh(a,O,P,0);kS.Dj(a,C,1);kS.hh(a,b,C,1)}break}}};lS.Gp=function Gp(a){lS.Dp();var b,c;kS.Qo(a,1);c=0;for(b=0;b<a.o;b++){a.A[b]==1?++c:(c+=a.c[b]-a.g[b]+kS.Tk(a,b))}return c};lS.tp=0;lS.up=0;lS.vp=0;lS.wp=0;lS.xp=0;lS.yp=0;lS.zp=0;lS.Ap=0;lS.Bp=0;lS.Cp=0;mS.Hp=function Hp(a,b,c){var d,e,f;f=b.length;d=new mS.ar(a.f,f,a.e);d.a[0]=0;d.b[0]=0;for(e=0;e<f;e++){d.k[e]=128-f;d.e[e]=b[e]}f<8?mS.Qp(d):mS.Op(a,d,b,c);AS.GN(a.c,d)};mS.Ip=function Ip(a,b,c){var d,e,f,g,h,i,j,k;e=OC(fS.OD,YS,5,16,15,1);for(d=0;d<a.f.o;d++){for(g=0;g<kS.tk(a.f,d);g++){k=c[kS.Gk(a.f,d,g)];for(h=0;h<g;h++)if(k<e[h])break;for(i=g;i>h;i--)e[i]=e[i-1];e[h]=k}j=gS.bK(6,kS.tk(a.f,d));kS.Pf(b[d],d);kS.Mf(b[d],16,fS.RG(c[d]));kS.Mf(b[d],(6-j)*17,0);for(f=0;f<j;f++)kS.Mf(b[d],17,fS.RG(e[f]))}};mS.Jp=function Jp(a){var b,c,d,e,f,g,h;c=OC(fS.YD,ET,53,a.f.o,0,1);for(b=0;b<a.f.o;b++){c[b]=new kS.Qf(2);kS.Pf(c[b],b)}h=OC(fS.OD,YS,5,a.f.o,15,1);for(d=0;d<a.f.e;d++){e=kS.ni(a.f,d);if(e==1||e==2){kS.Nf(c[kS.ei(a.f,0,d)],fS.RG(e));kS.Nf(c[kS.ei(a.f,1,d)],fS.RG(e))}}f=mS.Kp(c,h);do{g=f;mS.Ip(a,c,h);f=mS.Kp(c,h)}while(g!=f);return h};mS.Kp=function Kp(a,b){var c,d;d=0;AS.LO(a,0,a.length,null);for(c=0;c<a.length;c++){(c==0||kS.Of(a[c],a[c-1])!=0)&&++d;b[a[c].a]=d}return d};mS.Lp=function Lp(a){var b,c,d,e,f,g,h,i,j,k,l,m;for(i=0;i<a.c.a.length;i++){h=AS.LN(a.c,i);for(j=0;j<h.f.length;j++){d=h.f[j];if(kS.mi(a.f,d)==2){!kS.yl(a.f,d)&&kS.ni(a.f,d)==0&&kS.Lj(a.f,d);if(!kS.vl(a.f,d)&&kS.Hk(a.f,kS.ei(a.f,0,d))>1&&kS.Hk(a.f,kS.ei(a.f,1,d))>1&&(kS.ni(a.f,d)==1||kS.ni(a.f,d)==2)){m=OC(fS.OD,YS,5,2,15,1);e=OC(fS.OD,YS,5,2,15,1);for(k=0;k<2;k++){m[k]=a.f.K;e[k]=kS.ei(a.f,k,d);for(l=0;l<kS.tk(a.f,e[k]);l++){f=kS.Gk(a.f,e[k],l);f!=kS.ei(a.f,1-k,d)&&m[k]>f&&(m[k]=f)}}g=mS.Lq(h.a[h.g[e[0]]],h.b[h.g[e[0]]],h.a[h.g[e[1]]],h.b[h.g[e[1]]]);b=mS.Lq(h.a[h.g[m[0]]],h.b[h.g[m[0]]],h.a[h.g[e[0]]],h.b[h.g[e[0]]]);c=mS.Lq(h.a[h.g[e[1]]],h.b[h.g[e[1]]],h.a[h.g[m[1]]],h.b[h.g[m[1]]]);mS.Sp(g,b)<0^mS.Sp(g,c)<0^kS.ni(a.f,d)==2&&mS.Rq(h,d)}}}}};mS.Mp=function Mp(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r;m=new AS.ZN;r=new AS.ZN;d=new AS.ZN;for(f=new AS.tO(a.c);f.a<f.c.a.length;){e=AS.sO(f);g=0;d.a=OC(fS.GF,BT,1,0,5,1);for(h=0;h<e.e.length;h++){b=e.e[h];c=a.i[b];if(c!=0){AS.GN(d,new mS.Nq(e,h,c));g+=c}}if(g!=0){AS.WN(d,new mS.uq);for(j=new AS.tO(d);j.a<j.c.a.length;){i=AS.sO(j);if(g*i.b>0){c=(g<0?-g:g)>=gS._J(i.b)?i.b:g;g-=c;AS.GN(c<0?m:r,new mS.Nq(e,i.a,c));if(g==0)break}}}}if(m.a.length==0||r.a.length==0)return null;AS.WN(r,new mS.yq);AS.WN(m,new mS.Cq);for(p=new AS.tO(r);p.a<p.c.a.length;){n=AS.sO(p);for(l=new AS.tO(m);l.a<l.c.a.length;){k=AS.sO(l);if(n.b==-k.b){a.i[mS.Vq(n.c,n.a)]-=n.b;a.i[mS.Vq(k.c,k.a)]-=k.b;return new mS.Iq(n.c,k.c,n.a,k.a)}}}for(q=new AS.tO(r);q.a<q.c.a.length;){n=AS.sO(q);for(l=new AS.tO(m);l.a<l.c.a.length;){k=AS.sO(l);if(n.b>-k.b){a.i[mS.Vq(n.c,n.a)]+=k.b;a.i[mS.Vq(k.c,k.a)]-=k.b;return new mS.Iq(n.c,k.c,n.a,k.a)}}}for(o=new AS.tO(r);o.a<o.c.a.length;){n=AS.sO(o);for(l=new AS.tO(m);l.a<l.c.a.length;){k=AS.sO(l);if(n.b<-k.b){a.i[mS.Vq(n.c,n.a)]-=n.b;a.i[mS.Vq(k.c,k.a)]+=n.b;return new mS.Iq(n.c,k.c,n.a,k.a)}}}return null};mS.Np=function Np(a){if(a.c.a.length<2)return null;return new mS.Hq(AS.LN(a.c,0),AS.LN(a.c,1))};mS.Op=function Op(a,b,c,d){var e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v;k=WC(IC(fS.MD,2),FS,13,0,[WC(IC(fS.MD,1),_S,5,15,[-20]),null,null,null,null,null,WC(IC(fS.MD,1),_S,5,15,[-4,12]),WC(IC(fS.MD,1),_S,5,15,[0,0,7.5]),null,null,null,null,WC(IC(fS.MD,1),_S,5,15,[8,-8]),null,null,null,WC(IC(fS.MD,1),_S,5,15,[-2.4])]);l=WC(IC(fS.OD,2),DT,6,0,[WC(IC(fS.OD,1),YS,5,15,[146]),WC(IC(fS.OD,1),YS,5,15,[627]),null,WC(IC(fS.OD,1),YS,5,15,[2457]),null,WC(IC(fS.OD,1),YS,5,15,[2451,8643,2519]),WC(IC(fS.OD,1),YS,5,15,[9362,14798]),WC(IC(fS.OD,1),YS,5,15,[34377,-2147448999,26214]),null,WC(IC(fS.OD,1),YS,5,15,[37449,137313,95703,34371,37815,54891,132867,-2147309741,54857,55129,-2147449005,-2147449065]),null,WC(IC(fS.OD,1),YS,5,15,[530697,531819,899169,137289,694617,-2146951863,-2146952797,-2146939175,-2146929547,-2146929564,-2146625111,-2146931799,-2146940503,-2146931935]),WC(IC(fS.OD,1),YS,5,15,[1007293,610915]),WC(IC(fS.OD,1),YS,5,15,[542985,137283,2122017,530691,2206773,-2144711351,219209,2840841,137555,-2146871031,-2147264167,613705,-2145360543,-2146625271,694611,2454837,-2145356703,-2147345133,-2146928951,-2146931805,-2144641719,-2146951869,-2146625237,-2146624183,2841963,1074905,-2146625117,2799955,-2144723645,138583,859225,-2145264843,-2145216253,-2146624149,-2144700727,-2146928917,-2143905527,-2144045771,-2146789097,2288547,544407,2104323,-2146911977,-2144479405,3633737,-2146870089,-2146952169]),null,WC(IC(fS.OD,1),YS,5,15,[8487297,2172633,2116611,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8829813]),WC(IC(fS.OD,1),YS,5,15,[14071213])]);q=1<<b.e.length;g=0;i=0;if(b.e.length>7){for(n=0;n<b.e.length;n++){h=mS.Wp(a,c,d,n);h==1?(g+=q):h==2&&(i+=q);g>>>=1;i>>>=1}}s=b.e.length-9;if(b.e.length>=9&&b.e.length<=25&&l[s]!=null){for(v=0;v<l[s].length;v++){p=(-2147483648&l[s][v])==0;j=KS&l[s][v];for(o=false;!o;o=!o){if(o){if(p)break;r=0;for(e=1;e!=q;e<<=1){r<<=1;(j&e)!=0&&(r|=1)}j=r}for(t=0;t<b.e.length;t++){if((j&g)==0&&(~j&i)==0){f=0;m=0.017453292519943295*(k[s]==null?0:k[s][v]);u=true;for(n=1;n<b.e.length;n++){b.a[n]=b.a[n-1]+$wnd.Math.sin(f);b.b[n]=b.b[n-1]+$wnd.Math.cos(f);(j&1)==0&&(u=!u);f+=m+(u?zT:qU);j>>>=1}return}(j&1)!=0&&(j|=q);j>>>=1}}}}mS.Rp(b,g,i)};mS.Pp=function Pp(a){var b,c,d,e,f,g,h,i,j,k;b=null;j=null;for(g=0;g<a.f.e;g++){if(kS.pi(a.f,g)==32){c=kS.ei(a.f,0,g);e=-1;h=0;for(;h<a.c.a.length;h++){e=mS.Wq(AS.LN(a.c,h),c);if(e!=-1)break}d=kS.ei(a.f,1,g);f=-1;i=0;for(;i<a.c.a.length;i++){f=mS.Wq(AS.LN(a.c,i),d);if(f!=-1)break}if(h!=i){if(h>i){k=h;h=i;i=k;k=e;e=f;f=k}j==null&&(j=OC(fS.EE,FS,180,a.c.a.length,0,2));j[i]==null&&(j[i]=OC(fS.EE,{180:1,4:1,7:1},41,i,0,1));if(j[i][h])mS.Fq(j[i][h],e,f);else{SC(j[i],h,new mS.Iq(AS.LN(a.c,h),AS.LN(a.c,i),e,f));!b&&(b=new AS.ZN);AS.GN(b,j[i][h])}}}}return b};mS.Qp=function Qp(a){var b,c;b=fT-fT*(a.e.length-2)/a.e.length;for(c=1;c<a.e.length;c++){a.a[c]=a.a[c-1]+$wnd.Math.sin(b*(c-1));a.b[c]=a.b[c-1]+$wnd.Math.cos(b*(c-1))}};mS.Rp=function Rp(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r;if(b==0||(b&c)!=0){mS.Qp(a);return}q=-1;r=0;f=1<<a.e.length-2;e=1<<a.e.length-1;h=1;g=2;for(j=0;j<a.e.length;j++){if((c&(e|h))==0&&(b&(e|h))!=0&&(b&f)==0){o=0;(c&f)!=0&&(o+=4);(b&e)!=0&&(o+=2);(b&h)!=0&&(o+=1);if(r<o){r=o;q=j}}f=e;e=h;h=g;g=1<<(j+2<a.e.length?j+2:j+2-a.e.length)}if(q==-1){mS.Qp(a);return}m=0;m|=1<<q;n=2;while(n<a.e.length-1){l=q+n<a.e.length?q+n:q+n-a.e.length;e=1<<(l==0?a.e.length-1:l-1);if((c&e)!=0){++n;continue}h=1<<l;if((b&e)!=0){if((c&h)!=0){mS.Qp(a);return}m|=h;n+=2;continue}g=1<<(l+1<a.e.length?l+1:l+1-a.e.length);if((b&h)!=0&&(c&g)!=0){m|=h;n+=3;continue}++n}if(m==0){mS.Qp(a);return}d=fT-fT*(a.e.length-2)/a.e.length;for(k=1;k<a.e.length;k++){a.a[k]=a.a[k-1]+$wnd.Math.sin(d*(k-1));a.b[k]=a.b[k-1]+$wnd.Math.cos(d*(k-1))}h=1;p=2*$wnd.Math.sin(d/2);for(i=0;i<a.e.length;i++){if((m&h)!=0){a.a[i]+=p*$wnd.Math.cos(d*(i-0.5));a.b[i]-=p*$wnd.Math.sin(d*(i-0.5))}h<<=1}};mS.Sp=function Sp(a,b){var c;c=a-b;while(c<XT)c+=eT;while(c>fT)c-=eT;return c};mS.Tp=function Tp(a,b,c){var d,e;d=0;for(e=0;e<kS.tk(a.f,c);e++){mS.Xq(b,kS.Gk(a.f,c,e))&&++d}return d};mS.Up=function Up(a,b,c,d){var e,f,g,h,i;h=mS.Wq(b,d);i=mS.Wq(c,d);mS._q(c,b.a[h]-c.a[i],b.b[h]-c.b[i]);e=mS.pq(a,b,d);f=mS.pq(a,c,d);g=0;mS.Tp(a,b,d)==1&&mS.Tp(a,c,d)==1&&(g=zT);mS.$q(c,c.a[i],c.b[i],e-f+g+fT);return mS.Zp(a,b,c,1)};mS.Vp=function Vp(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G,H,I,J,K,L;t=OC(fS.OD,YS,5,e,15,1);u=OC(fS.OD,YS,5,e,15,1);for(p=0;p<e;p++){t[p]=mS.Wq(b,d[p]);u[p]=mS.Wq(c,d[p])}F=0;H=0;G=0;I=0;for(q=0;q<e;q++){F+=b.a[t[q]];H+=b.b[t[q]];G+=c.a[u[q]];I+=c.b[u[q]]}F/=e;H/=e;G/=e;I/=e;mS._q(c,F-G,H-I);j=OC(fS.FE,BT,17,e,0,1);l=OC(fS.FE,BT,17,e,0,1);f=OC(fS.FE,BT,17,e,0,1);g=OC(fS.FE,BT,17,e,0,1);for(r=0;r<e;r++){j[r]=new mS.Kq(F,H,b.a[t[r]],b.b[t[r]]);l[r]=new mS.Kq(F,H,c.a[u[r]],c.b[u[r]]);f[r]=new mS.Jq(j[r].a-l[r].a,j[r].b*l[r].b);g[r]=new mS.Jq(j[r].a+l[r].a,j[r].b*l[r].b)}w=mS.sq(f,e);A=mS.sq(g,e);K=0;L=0;for(s=0;s<e;s++){for(v=0;v<kS.tk(a.f,d[s]);v++){h=kS.Gk(a.f,d[s],v);mS.Xq(b,h)&&!mS.Xq(c,h)&&++K;!mS.Xq(b,h)&&mS.Xq(c,h)&&++L}}k=OC(fS.FE,BT,17,K,0,1);m=OC(fS.FE,BT,17,L,0,1);n=OC(fS.FE,BT,17,L,0,1);K=0;L=0;for(o=0;o<e;o++){for(v=0;v<kS.tk(a.f,d[o]);v++){h=kS.Gk(a.f,d[o],v);if(mS.Xq(b,h)&&!mS.Xq(c,h)){i=mS.Wq(b,h);k[K]=new mS.Kq(b.a[t[o]],b.b[t[o]],b.a[i],b.b[i]);++K}if(!mS.Xq(b,h)&&mS.Xq(c,h)){i=mS.Wq(c,h);J=new mS.Kq(c.a[u[o]],c.b[u[o]],c.a[i],c.b[i]);m[L]=new mS.Jq(w.a+J.a,J.b);n[L]=new mS.Jq(A.a-J.a,J.b);++L}}}B=mS.sq(k,K);C=mS.sq(m,L);D=mS.sq(n,L);if($wnd.Math.abs(mS.Sp(B.a,C.a))>$wnd.Math.abs(mS.Sp(B.a,D.a))){mS.$q(c,F,H,w.a)}else{mS.Qq(c,F,H);mS.$q(c,F,H,A.a)}return mS.Zp(a,b,c,e)};mS.Wp=function Wp(a,b,c,d){var e,f,g,h,i,j;f=d==b.length-1?0:d+1;h=d==0?b.length-1:d-1;g=f==b.length-1?0:f+1;if(kS.mi(a.f,c[d])==2){e=kS.ni(a.f,c[d]);if(e==1||e==2){mS.cq(a,b[h],b[d],b[f])^mS.cq(a,b[g],b[f],b[d])&&(e=e==1?2:1);return e}}if(kS.yl(a.f,c[d])){i=kS.an(kS.bl(a.f),c[h],c[d]);j=kS.an(kS.bl(a.f),c[f],c[d]);if(i!=-1||j!=-1)return i==j?2:1}return 0};mS.Xp=function Xp(a,b){var c,d,e,f,g,h,i,j,k,l,m,n;e=OC(fS.OD,YS,5,a.f.o,15,1);f=OC(fS.OD,YS,5,a.f.o,15,1);g=OC(fS.OD,YS,5,a.f.o,15,1);h=OC(fS.OD,YS,5,a.f.o,15,1);e[0]=b;g[b]=1;h[0]=-1;d=0;i=0;while(d<=i){if(d==0||!a.a[e[d]]){for(j=0;j<kS.tk(a.f,e[d]);j++){c=kS.Gk(a.f,e[d],j);m=kS.Ik(a.f,e[d],j);if(g[c]==0&&!a.b[m]){e[++i]=c;f[i]=m;g[c]=g[e[d]]+1;h[i]=d}}}if(d==i){n=new mS.Mq(g[e[d]]);k=d;for(l=0;l<n.a.length;l++){n.a[l]=e[k];n.b[l]=f[k];k=h[k]}return n}++d}return null};mS.Yp=function Yp(a){var b,c,d,e;e=0;d=null;for(c=new AS.tO(a);c.a<c.c.a.length;){b=AS.sO(c);if(e<b.b[0].e.length*b.b[1].e.length){e=b.b[0].e.length*b.b[1].e.length;d=b}}return d};mS.Zp=function Zp(a,b,c,d){var e,f,g,h,i;f=new mS.ar(a.f,b.e.length+c.e.length-d,a.e);e=0;for(h=0;h<b.e.length;h++){f.e[e]=b.e[h];f.k[e]=b.k[h];f.a[e]=b.a[h];f.b[e++]=b.b[h]}for(g=0;g<c.e.length;g++){i=mS.Wq(b,c.e[g]);if(i==-1){f.e[e]=c.e[g];f.k[e]=c.k[g];f.a[e]=c.a[g];f.b[e++]=c.b[g]}else{if(f.k[i]<c.k[g]){f.k[i]=c.k[g];f.a[i]=c.a[g];f.b[i]=c.b[g]}}}return f};mS.$p=function $p(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o;h=OC(fS.OD,YS,5,a.f.o,15,1);i=OC(fS.OD,YS,5,a.f.o,15,1);j=OC(fS.OD,YS,5,a.f.o,15,1);k=OC(fS.OD,YS,5,a.f.o,15,1);h[0]=c;j[c]=1;k[0]=-1;g=0;l=0;while(g<=l){for(m=0;m<kS.tk(a.f,h[g]);m++){e=kS.Gk(a.f,h[g],m);o=kS.Ik(a.f,h[g],m);if(e==b){f=j[h[g]];d=OC(fS.OD,YS,5,f,15,1);d[0]=o;for(n=1;n<f;n++){d[n]=i[g];g=k[g]}return d}if(j[e]==0){h[++l]=e;i[l]=o;j[e]=j[h[g]]+1;k[l]=g}}if(g==l)return null;++g}return null};mS._p=function _p(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o;c=kS.ei(a.f,0,b);d=kS.ei(a.f,1,b);g=OC(fS.OD,YS,5,a.f.o,15,1);h=OC(fS.OD,YS,5,a.f.o,15,1);i=OC(fS.OD,YS,5,a.f.o,15,1);j=OC(fS.OD,YS,5,a.f.o,15,1);g[0]=c;g[1]=d;h[1]=b;i[c]=1;i[d]=2;j[0]=-1;j[1]=0;f=1;k=1;while(f<=k){for(l=0;l<kS.tk(a.f,g[f]);l++){e=kS.Gk(a.f,g[f],l);if(f>1&&e==c){o=new mS.Mq(i[g[f]]);h[0]=kS.Ik(a.f,g[f],l);m=f;for(n=0;n<o.a.length;n++){o.a[n]=g[m];o.b[n]=h[m];m=j[m]}return o}if(i[e]==0&&kS.ul(a.f,e)){g[++k]=e;h[k]=kS.Ik(a.f,g[f],l);i[e]=i[g[f]]+1;j[k]=f}}++f}return null};
mS.aq=function aq(a,b,c,d){var e,f,g,h,i,j;g=OC(fS.OD,YS,5,a.f.o,15,1);h=OC(fS.OD,YS,5,a.f.o,15,1);g[0]=c;g[1]=b;h[c]=1;h[b]=2;f=1;i=1;while(f<=i){for(j=0;j<kS.tk(a.f,g[f]);j++){e=kS.Gk(a.f,g[f],j);if(e==d)return 1+h[g[f]];if(h[e]==0&&kS.ul(a.f,e)){g[++i]=e;h[e]=h[g[f]]+1}}++f}return 0};mS.bq=function bq(a,b){var c,d,e,f,g,h,i;!a.g&&(a.g=new AS.mP);(a.e&1)!=0&&kS.El(b);a.f=b;kS.Qo(a.f,3);a.c=new AS.ZN;a.a=OC(fS.CG,aT,5,a.f.o,16,1);a.b=OC(fS.CG,aT,5,a.f.p,16,1);a.d=OC(fS.CG,aT,5,a.f.p,16,1);for(e=0;e<a.f.p;e++)a.d[e]=kS.pi(a.f,e)!=32;a.i=OC(fS.OD,YS,5,a.f.o,15,1);for(c=0;c<a.f.o;c++)a.i[c]=kS.Lh(a.f,c);if((a.e&6)!=0){for(d=0;d<a.f.p;d++)a.d[d]=!a.d[d]&&kS.Ni(a.f,kS.ei(a.f,0,d))&&kS.Ni(a.f,kS.ei(a.f,1,d));mS.kq(a)}mS.mq(a);mS.hq(a);mS.jq(a);mS.hq(a);for(g=new AS.tO(a.c);g.a<g.c.a.length;){f=AS.sO(g);mS.Yq(f)}mS.Lp(a);mS.oq(a);mS.nq(a);mS.gq(a);mS.eq(a);mS.iq(a);for(h=0;h<a.c.a.length;h++){f=AS.LN(a.c,h);for(i=0;i<f.e.length;i++){kS.Aj(a.f,f.e[i],f.a[i]);kS.Bj(a.f,f.e[i],f.b[i]);kS.Cj(a.f,f.e[i],0)}}};mS.cq=function cq(a,b,c,d){var e,f;for(f=0;f<kS.Hk(a.f,c);f++){e=kS.Gk(a.f,c,f);if(e!=d&&e<b)return false}return true};mS.dq=function dq(a,b,c){var d;mS.Gq(b,c,(a.e&6)!=0);d=mS.Zp(a,b.b[0],b.b[1],0);mS.qq(a,b.b[0],b.b[1],d)};mS.eq=function eq(a){var b;b=mS.Mp(a);while(b){mS.dq(a,b,1.5);b=mS.Mp(a)}};mS.fq=function fq(a,b,c,d){var e,f,g,h,i;e=OC(fS.OD,YS,5,d,15,1);f=0;for(g=0;g<b.e.length;g++)for(h=0;h<c.e.length;h++)b.e[g]===c.e[h]&&(e[f++]=b.e[g]);i=d==1?mS.Up(a,b,c,e[0]):mS.Vp(a,b,c,e,d);mS.qq(a,b,c,i)};mS.gq=function gq(a){var b,c;c=mS.Pp(a);while(c){b=mS.Yp(c);mS.dq(a,b,1.2);c=mS.Pp(a)}};mS.hq=function hq(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s;while(true){s=0;n=0;q=null;r=null;for(g=1;g<a.c.a.length;g++){d=AS.LN(a.c,g);for(h=0;h<g;h++){e=AS.LN(a.c,h);b=0;c=0;o=0;p=0;for(k=0;k<d.e.length;k++){for(m=0;m<e.e.length;m++){if(d.e[k]===e.e[m]){++c;b=d.e[k];o<d.k[k]&&(o=d.k[k]);p<e.k[m]&&(p=e.k[m])}}}if(c>0){f=c==1&&mS.Tp(a,d,b)==1&&mS.Tp(a,e,b)==1?0:1;o>p?(i=(f<<24)+(o<<16)+(p<<8)+c):(i=(f<<24)+(p<<16)+(o<<8)+c);if(s<i){s=i;n=c;o=0;p=0;for(l=0;l<d.e.length;l++)o<d.k[l]&&(o=d.k[l]);for(j=0;j<e.e.length;j++)p<e.k[j]&&(p=e.k[j]);if(o>p){q=d;r=e}else{q=e;r=d}}}}}if(s==0)break;n==q.e.length?AS.SN(a.c,q):n==r.e.length?AS.SN(a.c,r):mS.fq(a,q,r,n)}};mS.iq=function iq(a){var b;b=mS.Np(a);while(b){mS.dq(a,b,1.8);b=mS.Np(a)}};mS.jq=function jq(a){var b,c,d,e,f,g,h;while(true){f=null;for(b=0;b<a.f.o;b++){h=0;for(e=0;e<kS.tk(a.f,b);e++)a.b[kS.Ik(a.f,b,e)]||++h;if(h==1){g=mS.Xp(a,b);(!f||g.a.length>f.a.length)&&(f=g)}}if(!f)break;c=new mS.ar(a.f,f.a.length,a.e);for(d=0;d<f.a.length;d++){a.a[f.a[d]]=true;d<f.a.length-1&&(a.b[f.b[d]]=true);c.e[d]=f.a[d];c.a[d]=$wnd.Math.cos(AT)*d;c.b[d]=(d&1)==1?0:0.5;c.k[d]=128+f.a.length}AS.GN(a.c,c)}};mS.kq=function kq(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r;h=0;f=0;for(g=0;g<a.f.p;g++){if(kS.Ni(a.f,kS.ei(a.f,0,g))&&kS.Ni(a.f,kS.ei(a.f,1,g))){a.b[g]=true;f+=kS.ki(a.f,g);++h}}if(h==0||f==0)return;f/=h;for(c=0;c<a.f.o;c++){kS.Ni(a.f,c)&&(kS.uk(a.f,c)==0?kS.tj(a.f,c,false):(a.a[c]=true))}p=OC(fS.OD,YS,5,a.f.o,15,1);i=kS.Pk(a.f,p,true,true);o=OC(fS.OD,YS,5,i,15,1);for(d=0;d<a.f.o;d++)p[d]!=-1&&++o[p[d]];n=OC(fS.IE,BT,23,i,0,1);for(k=0;k<i;k++)n[k]=new mS.ar(a.f,o[k],a.e);e=OC(fS.OD,YS,5,i,15,1);for(b=0;b<a.f.o;b++){l=p[b];if(l!=-1){n[l].k[e[l]]=256;n[l].e[e[l]]=b;n[l].a[e[l]]=kS.Zh(a.f,b)/f;n[l].b[e[l]]=kS.$h(a.f,b)/f;++e[l]}}q=-1;r=0;for(m=0;m<i;m++){if(r<o[m]){r=o[m];q=m}}AS.GN(a.c,n[q]);for(j=0;j<i;j++)j!=q&&AS.GN(a.c,n[j])};mS.lq=function lq(a,b,c){var d,e,f,g,h,i,j,k,l,m;for(f=0;f<a.f.p;f++){d=kS.ei(a.f,0,f);e=kS.ei(a.f,1,f);if(kS.vl(a.f,f)||kS.mi(a.f,f)!=1||kS.tk(a.f,d)==1||kS.tk(a.f,e)==1)continue;if((a.e&2)!=0&&kS.Ni(a.f,d)&&kS.Ni(a.f,e))continue;l=false;for(j=0;j<2;j++){g=kS.ei(a.f,j,f);if(kS.tk(a.f,g)>2){m=true;i=-1;for(k=0;k<kS.tk(a.f,g);k++){h=kS.Gk(a.f,g,k);h!=kS.ei(a.f,1-j,f)&&(i==-1?(i=c[h]):i!=c[h]&&(m=false))}if(m){l=true;break}}}l||((a.e&4)!=0&&kS.Ni(a.f,d)&&kS.Ni(a.f,e)?(b[f]=1):(b[f]=2))}};mS.mq=function mq(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G,H,I,J,K,L,M;for(d=0;d<a.f.o;d++){if(kS.tk(a.f,d)>4){m=new mS.ar(a.f,1+kS.tk(a.f,d),a.e);m.a[kS.tk(a.f,d)]=0;m.b[kS.tk(a.f,d)]=0;m.k[kS.tk(a.f,d)]=32;m.e[kS.tk(a.f,d)]=d;a.a[d]=true;for(o=0;o<kS.tk(a.f,d);o++){j=kS.Gk(a.f,d,o);m.a[o]=$wnd.Math.sin(zT*o-sU);m.b[o]=$wnd.Math.cos(zT*o-sU);m.k[o]=32;m.e[o]=j;a.a[j]=true;a.b[kS.Ik(a.f,d,o)]=true}AS.GN(a.c,m)}}I=kS.bl(a.f);for(H=0;H<I.i.a.length;H++){J=AS.LN(I.j,H).length;F=AS.LN(I.i,H);K=false;if((a.e&6)!=0){K=true;for(o=0;o<J;o++){if(!kS.Ni(a.f,F[o])){K=false;break}}}if(!K){r=false;for(p=0;p<J;p++){if(kS.Bk(a.f,F[p])==J){r=true;break}}if(r){G=AS.LN(I.j,H);mS.Hp(a,F,G);for(o=0;o<J;o++){a.a[F[o]]=true;a.b[G[o]]=true}}}}for(h=0;h<a.f.p;h++){if(kS.vl(a.f,h)&&!a.b[h]){M=mS._p(a,h);F=M.a;G=M.b;mS.Hp(a,F,G);for(o=0;o<M.a.length;o++){a.a[F[o]]=true;a.b[G[o]]=true}}}for(i=0;i<a.f.p;i++){if(!a.b[i]&&kS.mi(a.f,i)==3){e=kS.ei(a.f,0,i);f=kS.ei(a.f,1,i);w=kS.tk(a.f,e)+kS.tk(a.f,f);if(w>2){m=new mS.ar(a.f,w,a.e);k=0;for(p=0;p<kS.tk(a.f,e);p++){j=kS.Gk(a.f,e,p);if(j!=f){m.e[k++]=j;a.a[j]=true;a.b[kS.Ik(a.f,e,p)]=true}}m.e[k++]=e;m.e[k++]=f;for(q=0;q<kS.tk(a.f,f);q++){j=kS.Gk(a.f,f,q);if(j!=e){m.e[k++]=j;a.a[j]=true;a.b[kS.Ik(a.f,f,q)]=true}}for(o=0;o<w;o++){m.a[o]=o;m.b[o]=0;m.k[o]=1}a.a[e]=true;a.a[f]=true;a.b[i]=true;AS.GN(a.c,m)}}}for(g=0;g<a.f.p;g++){if(!a.b[g]&&kS.mi(a.f,g)==2){b=OC(fS.OD,YS,5,a.f.o,15,1);for(o=0;o<2;o++){b[0]=kS.ei(a.f,o,g);b[1]=kS.ei(a.f,1-o,g);if(kS.xk(a.f,b[0])==1&&kS.xk(a.f,b[1])==2&&kS.tk(a.f,b[1])==2){a.a[b[0]]=true;a.a[b[1]]=true;a.b[g]=true;v=1;do{A=kS.Gk(a.f,b[v],0)==b[v-1]?1:0;b[v+1]=kS.Gk(a.f,b[v],A);if(kS.xk(a.f,b[v+1])==2&&kS.tk(a.f,b[v+1])>2)break;a.a[b[v+1]]=true;a.b[kS.Ik(a.f,b[v],A)]=true;++v}while(kS.xk(a.f,b[v])==2&&kS.tk(a.f,b[v])==2);w=kS.tk(a.f,b[0])+kS.tk(a.f,b[v])+v-1;m=new mS.ar(a.f,w,a.e);for(t=0;t<=v;t++){m.a[t]=t;m.b[t]=0;m.k[t]=64;m.e[t]=b[t]}l=v+1;n=false;for(u=0;u<kS.tk(a.f,b[0]);u++){j=kS.Gk(a.f,b[0],u);if(j!=b[1]){m.a[l]=-0.5;m.b[l]=n?$wnd.Math.sin(zT):-$wnd.Math.sin(zT);m.k[l]=64;m.e[l]=j;++l;n=true}}n=false;for(s=0;s<kS.tk(a.f,b[v]);s++){j=kS.Gk(a.f,b[v],s);if(j!=b[v-1]){m.a[l]=v+0.5;m.b[l]=n?-$wnd.Math.sin(zT):$wnd.Math.sin(zT);m.k[l]=64;m.e[l]=j;++l;n=true}}AS.GN(a.c,m)}}}}for(c=0;c<a.f.o;c++){if(kS.tk(a.f,c)==4){B=OC(fS.OD,YS,5,4,15,1);C=OC(fS.OD,YS,5,4,15,1);D=0;for(p=0;p<4;p++){B[D]=kS.Gk(a.f,c,p);C[D]=kS.Ik(a.f,c,p);kS.tk(a.f,B[D])==1&&!a.b[C[D]]&&++D}if(D==2){m=new mS.ar(a.f,3,a.e);for(o=0;o<2;o++){a.a[B[o]]=true;a.b[C[o]]=true;m.e[o]=B[o];m.k[o]=32}m.a[0]=-0.5;m.b[0]=0.866;m.a[1]=0.5;m.b[1]=0.866;m.a[2]=0;m.b[2]=0;m.k[2]=32;m.e[2]=c;AS.GN(a.c,m)}if(D==3){for(q=0;q<2;q++){if(kS.mi(a.f,C[q])==1){L=B[q];B[q]=B[2];B[2]=L;L=C[q];C[q]=C[2];C[2]=L}}m=new mS.ar(a.f,4,a.e);for(o=0;o<3;o++){a.a[B[o]]=true;a.b[C[o]]=true;m.e[o]=B[o];m.k[o]=32}m.a[0]=-1;m.b[0]=0;m.a[1]=1;m.b[1]=0;m.a[2]=0;m.b[2]=1;m.a[3]=0;m.b[3]=0;m.k[3]=32;m.e[3]=c;AS.GN(a.c,m)}}}};mS.nq=function nq(a){var b,c;for(b=0;b<a.f.o;b++){if(!kS.Ni(a.f,b)&&kS.tk(a.f,b)==0){c=new mS.ar(a.f,1,a.e);a.a[b]=true;c.e[0]=b;c.a[0]=0;c.b[0]=0;c.k[0]=0;AS.GN(a.c,c)}}};mS.oq=function oq(a){var b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u;b=mS.Jp(a);f=OC(fS.KD,HT,5,a.f.p,15,1);mS.lq(a,f,b);for(e=0;e<a.f.p;e++)f[e]==2&&(kS.ul(a.f,kS.ei(a.f,0,e))||kS.ul(a.f,kS.ei(a.f,1,e)))&&(f[e]=3);for(n=0;n<a.c.a.length;n++){l=AS.LN(a.c,n);i=mS.Uq(l);r=l.c;q=new mS.br(l,a.e);p=-1;for(m=0;m<224&&i.a.length!=0;m++){j=AS.jP(a.g,i.a.length);h=(jS.xR(j,i.a.length),i.a[j]);g=mS.$p(a,h[0],h[1]);c=OC(fS.OD,YS,5,g.length,15,1);d=0;if(m<32){for(o=1;o<g.length-1;o++)f[g[o]]==3&&(c[d++]=g[o])}else if(m<96){for(o=1;o<g.length-1;o++)f[g[o]]>=2&&(c[d++]=g[o])}else{for(o=1;o<g.length-1;o++)f[g[o]]>=1&&(c[d++]=g[o])}if(d!=0){t=c[0];if(d>1){do{t=c[AS.jP(a.g,d)]}while(t==p)}if(t!=p){p=t;mS.Rq(l,t);i=mS.Uq(l);if(r>l.c){r=l.c;q=new mS.br(l,a.e)}}}}AS.UN(a.c,n,q);l=q;k=1;do{s=9999;for(o=0;o<l.e.length;o++){u=b[l.e[o]];u==k?mS.Zq(l,o):u>k&&u<s&&(s=u)}k=s}while(s!=9999)}};mS.pq=function pq(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t;e=OC(fS.MD,_S,5,kS.tk(a.f,c)+1,15,1);g=OC(fS.OD,YS,5,kS.tk(a.f,c)+1,15,1);h=OC(fS.OD,YS,5,kS.tk(a.f,c)+1,15,1);q=mS.Wq(b,c);f=0;for(j=0;j<kS.tk(a.f,c);j++){g[f]=kS.Gk(a.f,c,j);h[f]=kS.Ik(a.f,c,j);l=mS.Wq(b,g[f]);l!=-1&&(e[f++]=mS.Lq(b.a[q],b.b[q],b.a[l],b.b[l]))}if(f==1)return e[0]+fT;for(k=f-1;k>0;k--){for(m=0;m<k;m++){if(e[m]>e[m+1]){r=e[m];e[m]=e[m+1];e[m+1]=r;s=g[m];g[m]=g[m+1];g[m+1]=s;t=h[m];h[m]=h[m+1];h[m+1]=t}}}e[f]=e[0]+eT;g[f]=g[0];h[f]=h[0];n=-100;o=0;for(i=0;i<f;i++){d=e[i+1]-e[i];if(f>2&&kS.vl(a.f,h[i])&&kS.vl(a.f,h[i+1])){p=mS.aq(a,g[i],c,g[i+1]);p!=0&&(d-=100-p)}if(n<d){n=d;o=i}}return (e[o]+e[o+1])/2};mS.qq=function qq(a,b,c,d){var e;e=gS.bK(AS.NN(a.c,b,0),AS.NN(a.c,c,0));AS.FN(a.c,e,d);AS.SN(a.c,b);AS.SN(a.c,c)};mS.rq=function rq(){this.e=1};mS.sq=function sq(a,b){var c,d,e,f,g;g=0;c=0;for(d=0;d<b;d++){g+=a[d].b*$wnd.Math.sin(a[d].a);c+=a[d].b*$wnd.Math.cos(a[d].a)}if(c==0)f=g>0?gT:vT;else{f=$wnd.Math.atan(g/c);c<0&&(f+=fT)}e=$wnd.Math.sqrt(g*g+c*c)/b;return new mS.Jq(f,e)};nH(70,1,{},mS.rq);_.e=0;fS.DE=YI(70);mS.tq=function tq(a,b){var c,d;c=gS._J(a.b);d=gS._J(b.b);return c<d?-1:c==d?0:1};mS.uq=function uq(){};nH(126,1,{},mS.uq);_.eb=function vq(a,b){return mS.tq(a,b)};_.ab=function wq(a){return this===a};fS.AE=YI(126);mS.xq=function xq(a){var b,c;b=a.c.e.length;c=a.c.e.length;return b<c?1:b==c?0:-1};mS.yq=function yq(){};nH(127,1,{},mS.yq);_.eb=function zq(a,b){var c;return mS.xq((c=a,b,c))};_.ab=function Aq(a){return this===a};fS.BE=YI(127);mS.Bq=function Bq(a){var b,c;b=a.c.e.length;c=a.c.e.length;return b<c?-1:b==c?0:1};mS.Cq=function Cq(){};nH(128,1,{},mS.Cq);_.eb=function Dq(a,b){var c;return mS.Bq((c=a,b,c))};_.ab=function Eq(a){return this===a};fS.CE=YI(128);mS.Fq=function Fq(a,b,c){a.c[0]+=mS.Sq(a.b[0],b);a.d[0]+=mS.Tq(a.b[0],b);a.c[1]+=mS.Sq(a.b[1],c);a.d[1]+=mS.Tq(a.b[1],c);++a.a[0];++a.a[1]};mS.Gq=function Gq(a,b,c){var d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w;d=OC(fS.MD,_S,5,2,15,1);for(j=0;j<2;j++){a.c[j]/=a.a[j];a.d[j]/=a.a[j];d[j]=mS.Oq(a.b[j],a.c[j],a.d[j],a.b[1-j].e.length,b)}mS.$q(a.b[0],a.c[0],a.d[0],gT-d[0]);mS.$q(a.b[1],a.c[1],a.d[1],4.71238898038469-d[1]);w=ST;v=-1.7976931348623157E308;g=a.d[0]-a.d[1];for(k=0;k<a.b[1].b.length;k++){a.b[1].b[k]+=g;w>a.b[1].b[k]&&(w=a.b[1].b[k]);v<a.b[1].b[k]&&(v=a.b[1].b[k])}t=v-w+2*b;e=JD($wnd.Math.ceil(t));w+=(t-e)/2-b;r=OC(fS.MD,_S,5,e,15,1);for(l=0;l<e;l++)r[l]=a.c[1]+b;for(m=0;m<a.b[1].b.length;m++){u=a.b[1].b[m]-w;s=JD(u-b);h=gS.bK(JD(u+b),e-1);for(q=s;q<=h;q++){r[q]>a.b[1].a[m]&&(r[q]=a.b[1].a[m])}}for(n=0;n<e;n++)r[n]-=b;f=a.c[0]-a.c[1];for(o=0;o<a.b[0].a.length;o++){p=JD(a.b[0].b[o]-w);p>=0&&p<r.length&&f<a.b[0].a[o]-r[p]&&(f=a.b[0].a[o]-r[p])}for(i=0;i<a.b[1].a.length;i++)a.b[1].a[i]+=f;if(c){mS.$q(a.b[0],a.c[0],a.d[0],d[0]-gT);mS.$q(a.b[1],a.c[0],a.d[0],d[0]-gT)}};mS.Hq=function Hq(a,b){var c,d;this.b=OC(fS.IE,BT,23,2,0,1);this.b[0]=a;this.b[1]=b;this.c=OC(fS.MD,_S,5,2,15,1);this.d=OC(fS.MD,_S,5,2,15,1);this.a=OC(fS.OD,YS,5,2,15,1);for(c=0;c<2;c++){for(d=0;d<this.b[c].e.length;d++){this.c[c]+=mS.Sq(this.b[c],d);this.d[c]+=mS.Tq(this.b[c],d)}this.a[c]=this.b[c].e.length}};mS.Iq=function Iq(a,b,c,d){this.b=OC(fS.IE,BT,23,2,0,1);this.b[0]=a;this.b[1]=b;this.c=OC(fS.MD,_S,5,2,15,1);this.d=OC(fS.MD,_S,5,2,15,1);this.c[0]=mS.Sq(this.b[0],c);this.d[0]=mS.Tq(this.b[0],c);this.c[1]=mS.Sq(this.b[1],d);this.d[1]=mS.Tq(this.b[1],d);this.a=OC(fS.OD,YS,5,2,15,1);this.a[0]=1;this.a[1]=1};nH(41,1,{41:1},mS.Hq,mS.Iq);fS.EE=YI(41);mS.Jq=function Jq(a,b){this.a=a;this.b=b};mS.Kq=function Kq(a,b,c,d){var e,f;this.a=mS.Lq(a,b,c,d);e=c-a;f=d-b;this.b=$wnd.Math.sqrt(e*e+f*f)};mS.Lq=function Lq(a,b,c,d){var e,f,g;f=c-a;g=d-b;if(g!=0){e=$wnd.Math.atan(f/g);g<0&&(f<0?(e-=fT):(e+=fT))}else e=f>0?gT:vT;return e};nH(17,1,{17:1},mS.Jq,mS.Kq);_.a=0;_.b=0;fS.FE=YI(17);mS.Mq=function Mq(a){this.a=OC(fS.OD,YS,5,a,15,1);this.b=OC(fS.OD,YS,5,a,15,1)};nH(107,1,{},mS.Mq);fS.GE=YI(107);mS.Nq=function Nq(a,b,c){this.c=a;this.a=b;this.b=c};nH(78,1,{78:1},mS.Nq);_.a=0;_.b=0;fS.HE=YI(78);mS.Oq=function Oq(a,b,c,d,e){var f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G;if(a.e.length==1)return 0;C=e+$wnd.Math.sqrt(d);k=OC(fS.MD,_S,5,36,15,1);for(o=0;o<a.e.length;o++){f=mS.Lq(b,c,a.a[o],a.b[o]);h=mS.Pq(cH(TG($wnd.Math.round(f*36/eT))));l=b-a.a[o];m=c-a.b[o];F=l*l+m*m;k[h]<F&&(k[h]=F)}v=-1;u=-1;for(p=0;p<36;p++){k[p]=$wnd.Math.sqrt(k[p]);if(v<k[p]){v=k[p];u=p}}D=u-18<0?u-18+36:u-18>=36?u-18-36:u-18;for(q=0;q<=18;q++){k[D+q<0?D+q+36:D+q>=36?D+q-36:D+q]+=0.01*q;k[D-q<0?D-q+36:D-q>=36?D-q-36:D-q]+=0.01*q}G=OC(fS.MD,_S,5,9,15,1);i=OC(fS.MD,_S,5,9,15,1);for(r=1;r<9;r++){G[r]=$wnd.Math.sin(r*tU);i[r]=$wnd.Math.cos(r*tU)}A=ST;w=-1;for(g=0;g<36;g++){if(k[g]>=A)continue;t=k[g];for(n=1;n<9;n++){for(s=-1;s<=1;s+=2){B=g+s*n<0?g+s*n+36:g+s*n>=36?g+s*n-36:g+s*n;if(k[B]*i[n]<=t)continue;j=i[n]*$wnd.Math.min(k[B],C/G[n]);if(t<j){t=j;if(A<=j)break}}if(A<=t)break}if(A>t){A=t;w=g}}return eT*w/36};mS.Pq=function Pq(a){return a<0?a+36:a>=36?a-36:a};mS.Qq=function Qq(a,b,c){var d,e,f;for(f=0;f<a.e.length;f++){e=$wnd.Math.sqrt((a.a[f]-b)*(a.a[f]-b)+(a.b[f]-c)*(a.b[f]-c));d=0-mS.Lq(b,c,a.a[f],a.b[f]);a.a[f]=b+e*$wnd.Math.sin(d);a.b[f]=c+e*$wnd.Math.cos(d)}};mS.Rq=function Rq(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v;a.d==null&&(a.d=OC(fS.OD,DT,6,a.j.p,0,2));if(a.d[b]==null){m=OC(fS.OD,YS,5,a.e.length,15,1);s=OC(fS.CG,aT,5,a.j.o,16,1);d=kS.ei(a.j,0,b);e=kS.ei(a.j,1,b);m[0]=d;s[d]=true;j=0;n=0;while(j<=n){for(p=0;p<kS.tk(a.j,m[j]);p++){f=kS.Gk(a.j,m[j],p);if(!s[f]&&f!=e){m[++n]=f;s[f]=true}}if(j==n)break;++j}l=n+1>(a.e.length/2|0);if((a.i&6)!=0){h=false;g=false;for(p=0;p<a.e.length;p++){kS.Ni(a.j,a.e[p])&&(s[a.e[p]]?(h=true):(g=true))}h!=g&&(l=h)}i=2;a.d[b]=OC(fS.OD,YS,5,l?a.e.length-n:n+2,15,1);for(q=0;q<a.e.length;q++){a.e[q]==d?(a.d[b][l?0:1]=q):a.e[q]==e?(a.d[b][l?1:0]=q):l^s[a.e[q]]&&(a.d[b][i++]=q)}}u=a.a[a.d[b][0]];v=a.b[a.d[b][0]];t=mS.Lq(u,v,a.a[a.d[b][1]],a.b[a.d[b][1]]);for(o=2;o<a.d[b].length;o++){r=a.d[b][o];k=$wnd.Math.sqrt((a.a[r]-u)*(a.a[r]-u)+(a.b[r]-v)*(a.b[r]-v));c=2*t-mS.Lq(u,v,a.a[r],a.b[r]);a.a[r]=u+k*$wnd.Math.sin(c);a.b[r]=v+k*$wnd.Math.cos(c)}};mS.Sq=function Sq(a,b){return a.a[b]};mS.Tq=function Tq(a,b){return a.b[b]};mS.Uq=function Uq(a){var b,c,d,e,f,g,h,i;a.c=0;c=new AS.ZN;for(e=1;e<a.e.length;e++){for(f=0;f<e;f++){h=$wnd.Math.abs(a.a[e]-a.a[f]);i=$wnd.Math.abs(a.b[e]-a.b[f]);d=$wnd.Math.sqrt(h*h+i*i);if(d<0.8){b=OC(fS.OD,YS,5,2,15,1);b[0]=a.e[e];b[1]=a.e[f];c.a[c.a.length]=b}g=1-$wnd.Math.min(d,1);a.c+=g*g}}return c};mS.Vq=function Vq(a,b){return a.e[b]};mS.Wq=function Wq(a,b){var c;for(c=0;c<a.e.length;c++)if(b==a.e[c])return c;return -1};mS.Xq=function Xq(a,b){var c;for(c=0;c<a.e.length;c++)if(b==a.e[c])return true;return false};mS.Yq=function Yq(a){var b,c,d,e,f,g;d=0;for(f=0;f<a.e.length;f++){b=a.e[f];c=kS.tk(a.j,b);for(g=0;g<c;g++)kS.Gk(a.j,b,g)>b&&++d}a.f=OC(fS.OD,YS,5,d,15,1);a.g=OC(fS.OD,YS,5,a.j.o,15,1);d=0;for(e=0;e<a.e.length;e++){b=a.e[e];c=kS.tk(a.j,b);a.g[b]=e;for(g=0;g<c;g++)kS.Gk(a.j,b,g)>b&&(a.f[d++]=kS.Ik(a.j,b,g))}};mS.Zq=function Zq(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v;o=a.a[b];s=a.b[b];f=OC(fS.FE,BT,17,4,0,1);k=0;for(l=0;l<a.f.length;l++){if(k>=4)break;if(b==a.g[kS.ei(a.j,0,a.f[l])]||b==a.g[kS.ei(a.j,1,a.f[l])])continue;p=a.a[a.g[kS.ei(a.j,0,a.f[l])]];t=a.b[a.g[kS.ei(a.j,0,a.f[l])]];q=a.a[a.g[kS.ei(a.j,1,a.f[l])]];u=a.b[a.g[kS.ei(a.j,1,a.f[l])]];h=$wnd.Math.sqrt((p-o)*(p-o)+(t-s)*(t-s));i=$wnd.Math.sqrt((q-o)*(q-o)+(u-s)*(u-s));e=$wnd.Math.sqrt((q-p)*(q-p)+(u-t)*(u-t));if(h<e&&i<e){if(p==q){g=$wnd.Math.abs(o-p);g<0.5&&(f[k++]=new mS.Jq(mS.Lq(p,s,o,s),(0.5-g)/2))}else if(t==u){g=$wnd.Math.abs(s-t);g<0.5&&(f[k++]=new mS.Jq(mS.Lq(o,t,o,s),(0.5-g)/2))}else{m=(u-t)/(q-p);n=-1/m;c=t-m*p;d=s-n*o;r=(d-c)/(m-n);v=m*r+c;g=$wnd.Math.sqrt((r-o)*(r-o)+(v-s)*(v-s));g<0.5&&(f[k++]=new mS.Jq(mS.Lq(r,v,o,s),(0.5-g)/2))}continue}if(h<0.5){f[k++]=new mS.Jq(mS.Lq(p,t,o,s),(0.5-h)/2);continue}if(i<0.5){f[k++]=new mS.Jq(mS.Lq(q,u,o,s),(0.5-i)/2);continue}}if(k>0){j=mS.sq(f,k);a.a[b]+=j.b*$wnd.Math.sin(j.a);a.b[b]+=j.b*$wnd.Math.cos(j.a)}};mS.$q=function $q(a,b,c,d){var e,f,g;for(g=0;g<a.e.length;g++){f=$wnd.Math.sqrt((a.a[g]-b)*(a.a[g]-b)+(a.b[g]-c)*(a.b[g]-c));e=mS.Lq(b,c,a.a[g],a.b[g])+d;a.a[g]=b+f*$wnd.Math.sin(e);a.b[g]=c+f*$wnd.Math.cos(e)}};mS._q=function _q(a,b,c){var d;for(d=0;d<a.e.length;d++){a.a[d]+=b;a.b[d]+=c}};mS.ar=function ar(a,b,c){this.j=a;this.i=c;this.e=OC(fS.OD,YS,5,b,15,1);this.k=OC(fS.OD,YS,5,b,15,1);this.a=OC(fS.MD,_S,5,b,15,1);this.b=OC(fS.MD,_S,5,b,15,1)};mS.br=function br(a,b){var c,d;this.j=a.j;this.i=b;this.e=OC(fS.OD,YS,5,a.e.length,15,1);this.k=OC(fS.OD,YS,5,a.e.length,15,1);this.a=OC(fS.MD,_S,5,a.e.length,15,1);this.b=OC(fS.MD,_S,5,a.e.length,15,1);for(d=0;d<a.e.length;d++){this.e[d]=a.e[d];this.k[d]=a.k[d];this.a[d]=a.a[d];this.b[d]=a.b[d]}if(a.f!=null){this.f=OC(fS.OD,YS,5,a.f.length,15,1);for(c=0;c<a.f.length;c++)this.f[c]=a.f[c]}if(a.g!=null){this.g=OC(fS.OD,YS,5,a.g.length,15,1);for(c=0;c<a.g.length;c++)this.g[c]=a.g[c]}};nH(23,1,{23:1},mS.ar,mS.br);_.c=0;_.i=0;fS.IE=YI(23);nH(157,1,{});fS.JE=YI(157);nS.dr=function dr(){nS.dr=pH;nS.cr=WC(IC(fS.MF,1),LT,2,6,['Idorsia No','Actelion No','ID','IDNUMBER','COMPOUND_ID','NAME','COMPND'])};nS.er=function er(b){var c,d,e,f,g,h,i,j,k;if(!b.g)return false;gS.mI(b.f);gS.mI(b.a);b.e=null;k=false;d=-1;b.b=b.c==null?null:OC(fS.MF,LT,2,b.c.length,6,1);b.d=-1;do{try{j=xS.eI(b.g);if(j==null){gS.mI(b.f);return false}}catch(a){a=GG(a);if(AD(a,56)){gS.mI(b.f);return false}else throw HG(a)}if(k){gS.OK(b.a,j);gS.LK(b.a,10)}else{if(gS.sK(gS.GK(j).substr(0,1),'>')){k=true;gS.OK(b.f,aU);gS.LK(b.f,10);gS.OK(b.a,j);gS.LK(b.a,10)}else{gS.OK(b.f,j);gS.LK(b.f,10);gS.sK(gS.GK(j).substr(0,6),aU)&&(k=true);continue}}if(b.c!=null){if(gS.GK(j).length==0){d=-1}else if(d==-1){e=nS.gr(j);if(e!=null){d=-1;for(c=0;c<b.c.length;c++){if(gS.sK(e,b.c[c])){d=c;break}}if(b.d==-1){for(g=nS.cr,h=0,i=g.length;h<i;++h){f=g[h];if(gS.sK(e,f)){b.d=d;break}}}}}else{b.b[d]==null?(b.b[d]=j):(b.b[d]=gS.qK(gS.qK(b.b[d],ES),j))}}}while(!gS.sK(gS.GK(j).substr(0,4),bU));return true};nS.fr=function fr(b,c){var d,e,f,g;g=0;e=new kS.jp;while(g<c){try{f=xS.eI(b.g)}catch(a){a=GG(a);if(AD(a,56)){break}else throw HG(a)}if(f==null){break}gS.sK(gS.GK(f).substr(0,4),bU)&&++g;if(gS.sK(gS.GK(f).substr(0,1),'>')){d=nS.gr(f);d!=null&&kS.ip(e,d)}}b.c=AS.YN(e.b,OC(fS.MF,LT,2,0,6,1))};nS.gr=function gr(a){var b,c,d,e;if(gS.GK(a).length==0||gS.GK(a).charCodeAt(0)!=62)return null;d=1;e=0;b=0;while(d<gS.GK(a).length){if(gS.GK(a).charCodeAt(d)==60){if(e!=0)return null;e=d}else if(gS.GK(a).charCodeAt(d)==62){if(b!=0)return null;b=d}++d}if(e!=0&&e<b)return gS.GK(a).substr(e+1,b-(e+1));d=gS.GK(a).indexOf('DT',1);if(d==-1)return null;c=d+2;while(JI(gS.GK(a).charCodeAt(c)))++c;return c==d+2?null:gS.GK(a).substr(d,c-d)};nS.hr=function hr(a,b){if(a.b==null)return null;return a.b[b]};nS.ir=function ir(a){a.c==null&&nS.fr(a,10240);return a.c};nS.jr=function jr(a,b){a.c==null&&nS.fr(a,b);return a.c};nS.kr=function kr(a){var b;if(a.e)return a.e;a.e=kS.um(new kS.Mm,(b=a.f.a,b));!!a.e&&(a.e.M==null||gS.GK(a.e.M).length==0)&&kS.Tj(a.e,a.d==-1||a.b==null?null:a.b[a.d]);return a.e};nS.lr=function lr(a,b){nS.dr();this.c=b;this.g=new xS.fI(a);this.f=new gS.SK;this.a=new gS.SK};nH(119,157,{},nS.lr);_.d=0;fS.KE=YI(119);oS.uu=function uu(){oS.uu=pH;oS.tu=(!oS.Yz&&(oS.Yz=new oS._z),oS.Yz);oS.Er=WC(IC(fS.MF,1),LT,2,6,['?','H','He','Li','Be','B','C','N','O','F','Ne','Na','Mg','Al','Si','P','S','Cl','Ar','K','Ca','Sc','Ti','V','Cr','Mn','Fe','Co','Ni','Cu','Zn','Ga','Ge','As','Se','Br','Kr','Rb','Sr','Y','Zr','Nb','Mo','Tc','Ru','Rh','Pd','Ag','Cd','In','Sn','Sb','Te','I','Xe','Cs','Ba','La','Ce','Pr','Nd','Pm','Sm','Eu','Gd','Tb','Dy','Ho','Er','Tm','Yb','Lu','Hf','Ta','W','Re','Os','Ir','Pt','Au','Hg','Tl','Pb','Bi','Po','At','Rn','Fr','Ra','Ac','Th','Pa','U','Np','Pu','Am','Cm','Bk','Cf','Es','Fm','Md','No','Lr',MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,'R4','R5','R6','R7','R8','R9','R10','R11','R12','R13','R14','R15','R16','R1','R2','R3','A','A1','A2','A3',MT,MT,'D','T','X','R','H2','H+','Nnn','HYD','Pol',MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,MT,'Ala','Arg','Asn','Asp','Cys','Gln','Glu','Gly','His','Ile','Leu','Lys','Met','Phe','Pro','Ser','Thr','Trp','Tyr','Val']);oS.su=WC(IC(fS.BG,1),FT,5,15,[0,1,4,7,9,11,12,14,16,19,20,23,24,27,28,31,32,35,40,39,40,45,48,51,52,55,56,59,58,63,64,69,74,75,80,79,84,85,88,89,90,93,98,0,102,103,106,107,114,115,120,121,130,127,132,133,138,139,140,141,142,0,152,153,158,159,164,165,166,169,174,175,180,181,184,187,192,193,195,197,202,205,208,209,0,0,0,0,0,0,232,0,238,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,71,156,114,115,103,128,129,57,137,113,113,128,131,147,97,87,101,186,163,99]);oS.or=WC(IC(fS.MF,1),LT,2,6,[nU,uU,oU])};oS.vu=function vu(a){var b;b=new mS.rq;b.g=new AS.nP(0);mS.bq(b,a.a);kS.Kl(a.a)};oS.wu=function wu(){oS.xu.call(this,null)};oS.xu=function xu(a){oS.uu();!a&&(a=new kS.ep(32,32));this.a=a};oS.kv=function kv(a,b){oS.uu();var c;typeof b===vU&&(b=true);if(typeof b===HS){c=oS.mv(a,false);b===true&&c.inventCoordinates()}else typeof b===JS&&(c=oS.lv(a,b));return c};oS.lv=function lv(a,b){return new oS.xu(kS.Yl(new kS._l(false),a,b))};oS.mv=function mv(a,b){return new oS.xu(kS.Xl(new kS._l(b),a))};oS.nv=function nv(a){oS.uu();return new oS.xu(kS.um(new kS.Mm,a))};oS.ov=function ov(a,b){oS.uu();b=b||{};var c=!b.noCoordinates;var d=!b.noStereo;return oS.pv(a,c,d)};oS.pv=function pv(a,b,c){var d,e;e=new oS.wu;kS.Bo(new kS.Go,e.a,jS.rR((d=a,jS.mR(),d)),c);b&&oS.vu(e);return e};oS.xv=function xv(a,b,c,d){oS.uu();return kS.ck(a,b,c,d)};oS.yv=function yv(a,b){oS.uu();return kS.dk(a,b)};oS.Yv=function Yv(a){oS.uu();return kS.ek(a)};oS.yw=function yw(){oS.uu();return kS.dh(),kS.dh(),kS.bh};oS.yx=function yx(a){oS.uu();return kS.fk(a)};oS.zx=function zx(a){oS.uu();return kS.gk(a)};oS.Sy=function Sy(a){oS.uu();kS.dh();kS.bh=a};nH(34,1,{34:1},oS.wu,oS.xu);_.addAtom=function yu(a){return kS.fh(this.a,a)};_.addBond=function zu(a,b){return kS.gh(this.a,a,b)};_.addFragment=function Au(a,b,c){kS.hk(this.a,a.a,b,c)};_.hb=function Bu(){lS.Ep(this.a)};_.ib=function Cu(a){lS.Fp(this.a,a)};_.addImplicitHydrogens=function Du(a){a===undefined?this.hb():this.ib(a)};_.addMissingChirality=function Eu(){lS.mp(this.a)};_.addMolecule=function Fu(a){return kS.ih(this.a,a.a)};_.addOrChangeAtom=function Gu(a,b,c,d,e,f){return kS.jh(this.a,a,b,c,d,e,f)};_.addOrChangeBond=function Hu(a,b,c){return kS.kh(this.a,a,b,c)};_.addRing=function Iu(a,b,c,d){return kS.lh(this.a,a,b,c,d)};_.addRingToAtom=function Ju(a,b,c){return kS.mh(this.a,a,b,c)};_.addRingToBond=function Ku(a,b,c){return kS.nh(this.a,a,b,c)};_.addSubstituent=function Lu(a,b){return kS.oh(this.a,a.a,b)};_.calculateTorsion=function Mu(a){return kS.ph(this.a,a)};_.canonizeCharge=function Nu(a){return kS.jk(this.a,a)};_.changeAtom=function Ou(a,b,c,d,e){return kS.qh(this.a,a,b,c,d,e)};_.changeAtomCharge=function Pu(a,b){return kS.rh(this.a,a,b)};_.changeBond=function Qu(a,b){return kS.sh(this.a,a,b)};_.convertStereoBondsToSingleBonds=function Ru(a){kS.kk(this.a,a)};_.copyAtom=function Su(a,b,c,d){return kS.uh(this.a,a.a,b,c,d)};_.copyBond=function Tu(a,b,c,d,e,f){return kS.wh(this.a,a.a,b,c,d,e,f)};_.copyMolecule=function Uu(a){kS.xh(this.a,a.a)};_.copyMoleculeByAtoms=function Vu(a,b,c,d){kS.lk(this.a,a.a,b,c,d)};_.copyMoleculeByBonds=function Wu(a,b,c,d){return kS.mk(this.a,a.a,b,c,d)};_.copyMoleculeProperties=function Xu(a){kS.Po(this.a,a.a)};_.deleteAtom=function Yu(a){kS.zh(this.a,a)};_.deleteAtomOrBond=function Zu(a,b){return kS.Ah(this.a,a,b)};_.deleteAtoms=function $u(a){return kS.Bh(this.a,a)};_.deleteBond=function _u(a){kS.Ch(this.a,a)};_.deleteBondAndSurrounding=function av(a){kS.Dh(this.a,a)};_.deleteMarkedAtomsAndBonds=function bv(){return kS.Eh(this.a)};_.deleteMolecule=function cv(){kS.Fh(this.a)};_.deleteSelectedAtoms=function dv(){return kS.Gh(this.a)};_.ensureHelperArrays=function ev(a){kS.Qo(this.a,a)};_.findAlleneCenterAtom=function fv(a){return kS.ok(this.a,a)};_.findAtom=function gv(a,b){return kS.Hh(this.a,a,b)};_.findBINAPChiralityBond=function hv(a){return kS.pk(this.a,a)};_.findBond=function iv(a,b){return kS.Ih(this.a,a,b)};_.findRingSystem=function jv(a,b,c,d){kS.qk(this.a,a,b,c,d)};_.getAbsoluteAtomParity=function qv(a){return kS.Ro(this.a,a)};_.getAbsoluteBondParity=function rv(a){return kS.So(this.a,a)};_.getAllAtoms=function sv(){return this.a.o};_.getAllBonds=function tv(){return this.a.p};_.getAllConnAtoms=function uv(a){return kS.tk(this.a,a)};_.getAllConnAtomsPlusMetalBonds=function vv(a){return kS.uk(this.a,a)};_.getAllHydrogens=function wv(a){return kS.vk(this.a,a)};_.getAromaticRingCount=function zv(){return kS.wk(this.a)};_.getAtomAbnormalValence=function Av(a){return kS.Jh(this.a,a)};_.getAtomCIPParity=function Bv(a){return kS.Kh(this.a,a)};_.getAtomCharge=function Cv(a){return kS.Lh(this.a,a)};_.getAtomColor=function Dv(a){return kS.Mh(this.a,a)};_.getAtomCustomLabel=function Ev(a){return kS.Nh(this.a,a)};_.getAtomESRGroup=function Fv(a){return kS.Ph(this.a,a)};_.getAtomESRType=function Gv(a){return kS.Qh(this.a,a)};_.getAtomLabel=function Hv(a){return kS.Rh(this.a,a)};_.getAtomList=function Iv(a){return kS.Sh(this.a,a)};_.getAtomListString=function Jv(a){return kS.Th(this.a,a)};_.getAtomMapNo=function Kv(a){return kS.Uh(this.a,a)};_.getAtomMass=function Lv(a){return kS.Vh(this.a,a)};_.getAtomParity=function Mv(a){return kS.Wh(this.a,a)};_.getAtomPi=function Nv(a){return kS.xk(this.a,a)};_.getAtomPreferredStereoBond=function Ov(a){return kS.yk(this.a,a)};_.getAtomQueryFeatures=function Pv(a){return kS.Xh(this.a,a)};_.getAtomRadical=function Qv(a){return kS.Yh(this.a,a)};_.getAtomRingBondCount=function Rv(a){return kS.zk(this.a,a)};_.getAtomRingCount=function Sv(a,b){return kS.Ak(this.a,a,b)};_.getAtomRingSize=function Tv(a){return kS.Bk(this.a,a)};_.getAtomX=function Uv(a){return kS.Zh(this.a,a)};_.getAtomY=function Vv(a){return kS.$h(this.a,a)};_.getAtomZ=function Wv(a){return kS._h(this.a,a)};_.getAtomicNo=function Xv(a){return kS.ai(this.a,a)};_.getAtoms=function Zv(){return this.a.d};_.getAverageBondLength=function $v(a){return kS.Ck(this.a,a)};_.getAverageTopologicalAtomDistance=function _v(){return kS.Dk(this.a)};_.getBond=function aw(a,b){return kS.Ek(this.a,a,b)};_.getBondAngle=function bw(a,b){return kS.di(this.a,a,b)};_.getBondAtom=function cw(a,b){return kS.ei(this.a,a,b)};_.getBondBridgeMaxSize=function dw(a){return kS.fi(this.a,a)};_.getBondBridgeMinSize=function ew(a){return kS.gi(this.a,a)};_.getBondCIPParity=function fw(a){return kS.hi(this.a,a)};_.getBondESRGroup=function gw(a){return kS.ii(this.a,a)};_.getBondESRType=function hw(a){return kS.ji(this.a,a)};_.getBondLength=function iw(a){return kS.ki(this.a,a)};_.getBondOrder=function jw(a){return kS.mi(this.a,a)};_.getBondParity=function kw(a){return kS.ni(this.a,a)};_.getBondPreferredStereoBond=function lw(a){return kS.Cl(this.a,a)};_.getBondQueryFeatures=function mw(a){return kS.oi(this.a,a)};_.getBondRingSize=function nw(a){return kS.Fk(this.a,a)};_.getBondType=function ow(a){return kS.pi(this.a,a)};_.getBondTypeSimple=function pw(a){return kS.qi(this.a,a)};_.getBonds=function qw(){return this.a.e};_.getChiralText=function rw(){return kS.To(this.a)};_.getChirality=function sw(){return this.a.G};_.getCompactCopy=function tw(){return new oS.xu(kS.Uo(this.a))};_.getConnAtom=function uw(a,b){return kS.Gk(this.a,a,b)};_.getConnAtoms=function vw(a){return kS.Hk(this.a,a)};_.getConnBond=function ww(a,b){return kS.Ik(this.a,a,b)};_.getConnBondOrder=function xw(a,b){return kS.Jk(this.a,a,b)};_.getDefaultMaxValenceUncharged=function zw(a){return kS.ri(this.a,a)};_.getDiastereotopicAtomIDs=function Aw(){return lS.np(this.a)};_.getElectronValenceCorrection=function Bw(a,b){return kS.si(this.a,a,b)};_.getExcludeGroupValence=function Cw(a){return kS.Kk(this.a,a)};_.getExplicitHydrogens=function Dw(a){return kS.Lk(this.a,a)};_.getFisherProjectionParity=function Ew(a,b,c,d){return kS.Nk(this.a,a,b,c,d)};_.getFragmentAtoms=function Fw(a,b){return kS.Ok(this.a,a,b)};_.getFragmentNumbers=function Gw(a,b,c){return kS.Pk(this.a,a,b,c)};_.getFragments=function Hw(){var a,b,c;a=kS.Vo(this.a);c=OC(fS.LE,BT,34,a.length,0,1);for(b=0;b<a.length;b++){c[b]=new oS.xu(a[b])}return c};_.getFreeValence=function Iw(a){return kS.Qk(this.a,a)};_.getHandleHydrogenMap=function Jw(){return kS.Rk(this.a)};_.getHelperArrayStatus=function Kw(){return this.a.Q};_.getHoseCodes=function Lw(a){a=a||{};var b=(typeof a.maxSphereSize===vU?5:a.maxSphereSize)|0;var c=(typeof a.type===vU?0:a.type)|0;return lS.pp(this.a,b,c)};_.getIDCode=function Mw(){return kS.Xo(this.a)};_.getIDCodeAndCoordinates=function Nw(){return {idCode:this.getIDCode(),coordinates:this.getIDCoordinates()}};_.getIDCoordinates=function Ow(){return kS.Yo(this.a)};_.getImplicitHigherValence=function Pw(a,b){return kS.Sk(this.a,a,b)};_.getImplicitHydrogens=function Qw(a){return kS.Tk(this.a,a)};_.getIndex=function Rw(){return kS.Rn(oS.$z(oS.tu),this.a)};_.getLowestFreeValence=function Sw(a){return kS.Uk(this.a,a)};_.getMaxAtoms=function Tw(){return this.a.K};_.getMaxBonds=function Uw(){return this.a.L};_.getMaxValence=function Vw(a){return kS.ti(this.a,a)};_.getMaxValenceUncharged=function Ww(a){return kS.ui(this.a,a)};_.getMetalBondedConnAtoms=function Xw(a){return kS.Vk(this.a,a)};_.getMolecularFormula=function Yw(){return new oS.Uz(this.a)};_.getMolweight=function Zw(){return kS.Wk(this.a)};_.getName=function $w(){return this.a.M};_.getNonHydrogenNeighbourCount=function _w(a){return kS.Xk(this.a,a)};_.getNumberOfHydrogens=function ax(){return lS.Gp(this.a)};_.getOccupiedValence=function bx(a){return kS.Yk(this.a,a)};_.getPath=function cx(a,b,c,d,e){return kS.Zk(this.a,a,b,c,d,e)};_.getPathBonds=function dx(a,b,c){kS.$k(this.a,a,b,c)};
_.getPathLength=function ex(a,b){return kS._k(this.a,a,b)};_.getRotatableBondCount=function fx(){return kS.cl(this.a)};_.jb=function gx(a,b,c,d){var e,f;f=oS.aA(d);e=new kS.ro(this.a,f,c);kS.Ld(e,new wS.cI(0,0,a,b));kS.Ed(e);return kS.po(e)};_.getStereoBond=function hx(a){return kS.el(this.a,a)};_.getStereoCenterCount=function ix(){return kS.Zo(this.a)};_.getStereoProblem=function jx(a){return kS.wi(this.a,a)};_.getSubstituent=function kx(a,b,c,d,e){return kS.gl(this.a,a,b,c,d.a,e)};_.getSubstituentSize=function lx(a,b){return kS.hl(this.a,a,b)};_.getSymmetryRank=function mx(a){return kS.$o(this.a,a)};_.getZNeighbour=function nx(a,b){return kS.il(this.a,a,b)};_.invalidateHelperArrays=function ox(a){kS.zi(this.a,a)};_.inventCoordinates=function px(){oS.vu(this)};_.isAllylicAtom=function qx(a){return kS.ml(this.a,a)};_.isAmideTypeBond=function rx(a){return kS.nl(this.a,a)};_.isAromaticAtom=function sx(a){return kS.ol(this.a,a)};_.isAromaticBond=function tx(a){return kS.pl(this.a,a)};_.isAtomConfigurationUnknown=function ux(a){return kS.Ai(this.a,a)};_.isAtomMarkedForDeletion=function vx(a){return kS.Bi(this.a,a)};_.isAtomParityPseudo=function wx(a){return kS.Ci(this.a,a)};_.isAtomStereoCenter=function xx(a){return kS.Di(this.a,a)};_.isAutoMappedAtom=function Ax(a){return kS.Ei(this.a,a)};_.isBINAPChiralityBond=function Bx(a){return kS.ql(this.a,a)};_.isBondBackgroundHilited=function Cx(a){return kS.Fi(this.a,a)};_.isBondBridge=function Dx(a){return kS.Gi(this.a,a)};_.isBondForegroundHilited=function Ex(a){return kS.Hi(this.a,a)};_.isBondMarkedForDeletion=function Fx(a){return kS.Ii(this.a,a)};_.isBondParityPseudo=function Gx(a){return kS.Ji(this.a,a)};_.isBondParityUnknownOrNone=function Hx(a){return kS.Ki(this.a,a)};_.isDelocalizedBond=function Ix(a){return kS.rl(this.a,a)};_.isElectronegative=function Jx(a){return kS.Li(this.a,a)};_.isElectropositive=function Kx(a){return kS.Mi(this.a,a)};_.isFlatNitrogen=function Lx(a){return kS.sl(this.a,a)};_.isFragment=function Mx(){return this.a.I};_.isMarkedAtom=function Nx(a){return kS.Ni(this.a,a)};_.isMetalAtom=function Ox(a){return kS.Oi(this.a,a)};_.isNaturalAbundance=function Px(a){return kS.Pi(this.a,a)};_.isOrganicAtom=function Qx(a){return kS.Qi(this.a,a)};_.isPseudoRotatableBond=function Rx(a){return kS.tl(this.a,a)};_.isPurelyOrganic=function Sx(){return kS.Ri(this.a)};_.isRingAtom=function Tx(a){return kS.ul(this.a,a)};_.isRingBond=function Ux(a){return kS.vl(this.a,a)};_.isSelectedAtom=function Vx(a){return kS.Si(this.a,a)};_.isSelectedBond=function Wx(a){return kS.Ti(this.a,a)};_.isSimpleHydrogen=function Xx(a){return kS.wl(this.a,a)};_.isSmallRingAtom=function Yx(a){return kS.xl(this.a,a)};_.isSmallRingBond=function Zx(a){return kS.yl(this.a,a)};_.isStabilizedAtom=function $x(a){return kS.zl(this.a,a)};_.isStereoBond=function _x(a){return kS.Ui(this.a,a)};_.markAtomForDeletion=function ay(a){kS.Wi(this.a,a)};_.markBondForDeletion=function by(a){kS.Xi(this.a,a)};_.normalizeAmbiguousBonds=function cy(){return kS.Al(this.a)};_.removeAtomColors=function dy(){kS.$i(this.a)};_.removeAtomCustomLabels=function ey(){this.a.r=null};_.removeAtomMarkers=function fy(){kS._i(this.a)};_.removeAtomSelection=function gy(){kS.aj(this.a)};_.removeBondHiliting=function hy(){kS.bj(this.a)};_.removeExplicitHydrogens=function iy(){kS.El(this.a)};_.renumberESRGroups=function jy(a){return kS.ej(this.a,a)};_.scaleCoords=function ky(a){kS.fj(this.a,a)};_.setAllAtoms=function ly(a){kS.gj(this.a,a)};_.setAllBonds=function my(a){kS.hj(this.a,a)};_.setAssignParitiesToNitrogen=function ny(a){kS._o(this.a,a)};_.setAtomAbnormalValence=function oy(a,b){kS.ij(this.a,a,b)};_.setAtomCIPParity=function py(a,b){kS.jj(this.a,a,b)};_.setAtomCharge=function qy(a,b){kS.kj(this.a,a,b)};_.setAtomColor=function ry(a,b){kS.lj(this.a,a,b)};_.setAtomConfigurationUnknown=function sy(a,b){kS.mj(this.a,a,b)};_.setAtomCustomLabel=function ty(a,b){kS.nj(this.a,a,b)};_.setAtomESR=function uy(a,b,c){kS.pj(this.a,a,b,c)};_.setAtomList=function vy(a,b,c){kS.rj(this.a,a,b,c)};_.setAtomMapNo=function wy(a,b,c){kS.sj(this.a,a,b,c)};_.setAtomMarker=function xy(a,b){kS.tj(this.a,a,b)};_.setAtomMass=function yy(a,b){kS.uj(this.a,a,b)};_.setAtomParity=function zy(a,b,c){kS.vj(this.a,a,b,c)};_.setAtomQueryFeature=function Ay(a,b,c){kS.wj(this.a,a,b,c)};_.setAtomRadical=function By(a,b){kS.xj(this.a,a,b)};_.setAtomSelection=function Cy(a,b){kS.yj(this.a,a,b)};_.setAtomX=function Dy(a,b){kS.Aj(this.a,a,b)};_.setAtomY=function Ey(a,b){kS.Bj(this.a,a,b)};_.setAtomZ=function Fy(a,b){kS.Cj(this.a,a,b)};_.setAtomicNo=function Gy(a,b){kS.Dj(this.a,a,b)};_.setBondAtom=function Hy(a,b,c){kS.Ej(this.a,a,b,c)};_.setBondBackgroundHiliting=function Iy(a,b){kS.Fj(this.a,a,b)};_.setBondCIPParity=function Jy(a,b){kS.Gj(this.a,a,b)};_.setBondESR=function Ky(a,b,c){kS.Hj(this.a,a,b,c)};_.setBondForegroundHiliting=function Ly(a,b){kS.Ij(this.a,a,b)};_.setBondOrder=function My(a,b){kS.Jj(this.a,a,b)};_.setBondParity=function Ny(a,b,c){kS.Kj(this.a,a,b,c)};_.setBondParityUnknownOrNone=function Oy(a){kS.Lj(this.a,a)};_.setBondQueryFeature=function Py(a,b,c){kS.Mj(this.a,a,b,c)};_.setBondType=function Qy(a,b){kS.Nj(this.a,a,b)};_.setChirality=function Ry(a){kS.Oj(this.a,a)};_.setFragment=function Ty(a){kS.Pj(this.a,a)};_.setHydrogenProtection=function Uy(a){kS.Qj(this.a,a)};_.setMaxAtoms=function Vy(a){kS.Rj(this.a,a)};_.setMaxBonds=function Wy(a){kS.Sj(this.a,a)};_.setName=function Xy(a){kS.Tj(this.a,a)};_.setParitiesValid=function Yy(a){kS.Hl(this.a,a)};_.setStereoBondFromAtomParity=function Zy(a){kS.Il(this.a,a)};_.setStereoBondFromBondParity=function $y(a){kS.Jl(this.a,a)};_.setStereoBondsFromParity=function _y(){kS.Kl(this.a)};_.setToRacemate=function az(){this.a.J=true};_.setUnknownParitiesToExplicitlyUnknown=function bz(){kS.ap(this.a)};_.shareSameFragment=function cz(a,b){return kS._k(this.a,a,b)!=-1};_.stripIsotopInfo=function dz(){return kS.Wj(this.a)};_.stripSmallFragments=function ez(a){return kS.Ll(this.a,a)};_.stripStereoInformation=function fz(){kS.bp(this.a)};_.suggestBondType=function gz(a,b){return kS.Xj(this.a,a,b)};_.supportsImplicitHydrogen=function hz(a){return kS.Ml(this.a,a)};_.toMolfile=function iz(){var a;a=new kS.pm(this.a);return a.b.a};_.toMolfileV3=function jz(){var a;a=new kS.Pm(this.a);return a.a.a};_.toSVG=function kz(a,b,c,d){d=d||{};var e=this.jb(a,b,c,d);d.fontWeight&&(e=e.replace(/font-family=" Helvetica" /g,'font-family=" Helvetica" font-weight="'+d.fontWeight+jU));d.strokeWidth&&(e=e.replace(/stroke-width:1/g,kU+d.strokeWidth+' '));return e};_.toSmiles=function lz(){return kS.to(new kS.wo,this.a)};_.translateCoords=function mz(a,b){kS.Zj(this.a,a,b)};_.validate=function nz(){kS.cp(this.a)};_.zoomAndRotate=function oz(a,b,c){kS._j(this.a,a,b,c)};_.zoomAndRotateInit=function pz(a,b){kS.ak(this.a,a,b)};oS.mr=wU;oS.nr=wU;oS.pr=oU;oS.qr=nU;oS.rr=uU;oS.sr=0;oS.tr=3;oS.ur=1;oS.vr=2;oS.wr=64;oS.xr=384;oS.yr=448;oS.zr=192;oS.Ar=256;oS.Br=0;oS.Cr=320;oS.Dr=128;oS.Fr=1;oS.Gr=2;oS.Hr=4;oS.Ir=0;oS.Jr=3;oS.Kr=1;oS.Lr=6;oS.Mr=2;oS.Nr=1;oS.Or=2;oS.Pr=lT;oS.Qr=3;oS.Rr=25;oS.Sr=bT;oS.Tr=uT;oS.Ur=jT;oS.Vr=4;oS.Wr=7;oS.Xr=JT;oS.Yr=hT;oS.Zr=iU;oS.$r=5;oS._r=17;oS.as=qT;oS.bs=iT;oS.cs=30;oS.ds=128;oS.es=IT;oS.fs=pT;oS.gs=256;oS.hs=CT;oS.is=32768;oS.js=512;oS.ks=OS;oS.ls=SS;oS.ms=16;oS.ns=kT;oS.os=PS;oS.ps=32;oS.qs=rT;oS.rs=64;oS.ss=4;oS.ts=8;oS.us=TT;oS.vs=33554432;oS.ws=UT;oS.xs=3;oS.ys=14;oS.zs=oT;oS.As=tT;oS.Bs=3;oS.Cs=22;oS.Ds=120;oS.Es=4;oS.Fs=3;oS.Gs=iU;oS.Hs=48;oS.Is=32;oS.Js=0;oS.Ks=16;oS.Ls=4;oS.Ms=48;oS.Ns=1;oS.Os=0;oS.Ps=3;oS.Qs=2;oS.Rs=1;oS.Ss=0;oS.Ts=3;oS.Us=2;oS.Vs=2097151;oS.Ws=xT;oS.Xs=2;oS.Ys=19;oS.Zs=OS;oS.$s=31;oS._s=5;oS.at=0;oS.bt=wT;oS.ct=8;oS.dt=jT;oS.et=4;oS.ft=7;oS.gt=7;oS.ht=30720;oS.it=4;oS.jt=11;oS.kt=8;oS.lt=2;oS.mt=CT;oS.nt=16;oS.ot=1572960;oS.pt=21;oS.qt=PS;oS.rt=32;oS.st=64;oS.tt=yT;oS.ut=3;oS.vt=15;oS.wt=96;oS.xt=2;oS.yt=5;oS.zt=1572991;oS.At=1;oS.Bt=4;oS.Ct=26;oS.Dt=128;oS.Et=64;oS.Ft=2;oS.Gt=9;oS.Ht=127;oS.It=32;oS.Jt=1;oS.Kt=4;oS.Lt=17;oS.Mt=458752;oS.Nt=sT;oS.Ot=TS;oS.Pt=CT;oS.Qt=IT;oS.Rt=SS;oS.St=196608;oS.Tt=0;oS.Ut=327680;oS.Vt=6;oS.Wt=5;oS.Xt=32;oS.Yt=0;oS.Zt=1;oS.$t=2;oS._t=8;oS.au=128;oS.bu=1;oS.cu=4;oS.du=2;oS.eu=32;oS.fu=64;oS.gu=16;oS.hu=252;oS.iu=15;oS.ju=1;oS.ku=0;oS.lu=7;oS.mu=3;oS.nu=47;oS.ou=79;oS.pu=31;oS.qu=190;oS.ru=16;fS.LE=YI(34);oS.qz=function qz(a,b){this.a=new nS.lr(new xS.iI(a),b)};nH(156,1,{},oS.qz);_.getField=function rz(a){var b,c;c=nS.ir(this.a);for(b=0;b<c.length;b++){if(gS.sK(c[b],a)){return nS.hr(this.a,b)}}return null};_.getFieldData=function sz(a){return nS.hr(this.a,a)};_.getFieldNames=function tz(a){return nS.jr(this.a,a)};_.getMolecule=function uz(){return new oS.xu(nS.kr(this.a))};_.getNextFieldData=function vz(){var a;return a=this.a.a.a,a};_.getNextMolFile=function wz(){var a;return a=this.a.f.a,a};_.next=function xz(){return nS.er(this.a)};fS.ME=YI(156);oS.yz=function yz(a){a.a=new kS.Ln};oS.zz=function zz(a,b){kS.En(a.a,b.a)};oS.Az=function Az(a,b){kS.Fn(a.a,b.a)};oS.Bz=function Bz(){oS.yz(this)};nH(158,1,{},oS.Bz);_.isFragmentInMolecule=function Cz(){return kS.zn(this.a)};_.setFragment=function Dz(a){oS.zz(this,a)};_.setMol=function Ez(a,b){kS.Fn(this.a,b.a);kS.En(this.a,a.a)};_.setMolecule=function Fz(a){oS.Az(this,a)};fS.OE=YI(158);oS.Gz=function Gz(a){a.a=new kS.Xn};oS.Hz=function Hz(){oS.Gz(this)};oS.Iz=function Iz(a){return kS.Yn(a)};oS.Kz=function Kz(a){return kS.Zn(a)};oS.Lz=function Lz(a){return kS.$n(a)};oS.Mz=function Mz(){return kS.Qn(),kS.On};oS.Nz=function Nz(a,b){return kS._n(a,b)};oS.Oz=function Oz(a,b){return kS.ao(a,b)};nH(159,1,{},oS.Hz);_.createIndex=function Jz(a){return kS.Rn(this.a,a.a)};_.isFragmentInMolecule=function Pz(){return kS.Tn(this.a)};_.setFragment=function Qz(a,b){kS.Vn(this.a,a.a,b)};_.setMolecule=function Rz(a,b){kS.Wn(this.a,a.a,b)};fS.NE=YI(159);oS.Sz=function Sz(){};oS.Tz=function Tz(a,b){b=b||{};var c=(typeof b.maxSphereSize===vU?5:b.maxSphereSize)|0;var d=(typeof b.type===vU?0:b.type)|0;return lS.rp(a,c,d)};nH(160,1,{},oS.Sz);fS.PE=YI(160);oS.Uz=function Uz(a){kS.hm();kS.lm.call(this,a)};nH(116,118,{},oS.Uz);oH(_,{absoluteWeight:{'get':function Vz(){return kS.im(this)}}});oH(_,{formula:{'get':function Wz(){return kS.jm(this)}}});oH(_,{relativeWeight:{'get':function Xz(){return kS.km(this)}}});fS.QE=YI(116);oS.Zz=function Zz(a){};oS.$z=function $z(a){!a.a&&(a.a=new kS.Xn);return a.a};oS._z=function _z(){oS.Zz(this)};nH(113,1,{},oS._z);_.a=null;oS.Yz=null;fS.RE=YI(113);oS.aA=function aA(a){if(!a)return 0;var b=0;a.inflateToMaxAVBL&&(b|=SS);a.inflateToHighResAVBL&&(b|=IT);a.chiralTextBelowMolecule&&(b|=0);a.chiralTextAboveMolecule&&(b|=CT);a.chiralTextOnFrameTop&&(b|=OS);a.chiralTextOnFrameBottom&&(b|=786432);a.noTabus&&(b|=1);a.showAtomNumber&&(b|=2);a.showBondNumber&&(b|=4);a.highlightQueryFeatures&&(b|=8);a.showMapping&&(b|=16);a.suppressChiralText&&(b|=32);a.suppressCIPParity&&(b|=64);a.suppressESR&&(b|=128);a.showSymmetrySimple&&(b|=256);a.showSymmetryDiastereotopic&&(b|=512);a.showSymmetryEnantiotopic&&(b|=kT);a.noImplicitAtomLabelColors&&(b|=iT);a.noStereoProblem&&(b|=hT);return b};pS.bA=function bA(a,b){var c;c=a-b;c>=fT?(c-=eT):c<XT&&(c+=eT);return c};pS.dA=function dA(){pS.dA=pH;pS.cA=WC(IC(fS.ND,1),FT,5,15,[0.29899999499320984,0.5870000123977661,0.11400000005960464])};pS.eA=function eA(a,b){var c,d,e,f,g,h,i,j,k;c=vS.DH(a);h=!a?1:(pS.cA[0]*(a.c>>16&255)+pS.cA[1]*(a.c>>8&255)+pS.cA[2]*(a.c&255))/255;if(h==0)return new vS.EH(h,h,h,c[3]);d=b/(!a?1:(pS.cA[0]*(a.c>>16&255)+pS.cA[1]*(a.c>>8&255)+pS.cA[2]*(a.c&255))/255);k=0;j=0;for(f=0;f<3;f++){c[f]*=d;if(c[f]<1){j+=pS.cA[f]}else{k+=(c[f]-1)*pS.cA[f];c[f]=1}}if(k!=0){i=0;for(g=0;g<3;g++){if(c[g]<1){c[g]+=k/j;if(c[g]>1){i+=(c[g]-1)*pS.cA[g];c[g]=1}}}if(i!=0){for(e=0;e<3;e++){if(c[e]<1){c[e]+=i/pS.cA[e];c[e]>1&&(c[e]=1)}}}}return new vS.EH(c[0],c[1],c[2],c[3])};pS.fA=function fA(a,b){pS.dA();var c,d,e,f,g,h,i,j,k,l,m;c=!b?1:(pS.cA[0]*(b.c>>16&255)+pS.cA[1]*(b.c>>8&255)+pS.cA[2]*(b.c&255))/255;g=!a?1:(pS.cA[0]*(a.c>>16&255)+pS.cA[1]*(a.c>>8&255)+pS.cA[2]*(a.c&255))/255;e=$wnd.Math.abs(c-g);if(e>$S)return a;h=OC(fS.ND,FT,5,3,15,1);vS.BH();vS.IH((b.c>>16&255)/255,(b.c>>8&255)/255,(b.c&255)/255,h);i=OC(fS.ND,FT,5,3,15,1);vS.IH((a.c>>16&255)/255,(a.c>>8&255)/255,(a.c&255)/255,i);j=$wnd.Math.abs(i[0]-h[0]);j>0.5&&(j=1-j);m=1-$wnd.Math.max(i[1],h[1]);d=$wnd.Math.abs(g+c-1);k=$wnd.Math.cos(fT*j*3);l=$S*$wnd.Math.max(m,$wnd.Math.max(d,k));if(e>l)return a;f=g>c?g+l>1:g-l>0;return pS.eA(a,f?c-l:c+l)};pS.gA=function gA(a,b){pS.dA();return new vS.GH(JD((a.c>>16&255)+$S*((b.c>>16&255)-(a.c>>16&255))),JD((a.c>>8&255)+$S*((b.c>>8&255)-(a.c>>8&255))),JD((a.c&255)+$S*((b.c&255)-(a.c&255))))};pS.hA=function hA(a,b){return pS.iA(a,b)};pS.iA=function iA(a,b){var c;if(a==null)return b==null?0:1;if(b==null)return -1;for(c=0;c<a.length;c++){if(b.length==c)return 1;if(a[c]!==b[c])return a[c]<b[c]?-1:1}return b.length>a.length?-1:0};pS.jA=function jA(){};nH(89,1,FT,pS.jA);_.eb=function kA(a,b){return pS.hA(a,b)};_.ab=function lA(a){return this===a};fS.SE=YI(89);iS.MA=function MA(a){gS.KA.call(this,a)};nH(130,50,RS);fS.WE=YI(130);hS.OA=function OA(){hS.OA=pH;hS.NA=new sc};hS.PA=function PA(a){a.a=''};hS.QA=function QA(a){var b;if(a.c==null){b=ID(a.b)===ID(hS.NA)?null:a.b;a.d=b==null?NS:DD(b)?hS.VA(b):FD(b)?'String':gS.SI(gS.wc(b));a.a=a.a+': '+(DD(b)?hS.UA(b):b+'');a.c='('+a.d+') '+a.a}};hS.RA=function RA(a){return ID(a.b)===ID(hS.NA)?null:a.b};hS.SA=function SA(a){hS.OA();hS.TA.call(this,a)};hS.TA=function TA(a){iS.MA.call(this,a);hS.PA(this);this.b=a;this.a=''};hS.UA=function UA(a){return a==null?null:a.message};hS.VA=function VA(a){return a==null?null:a.name};nH(62,130,{62:1,4:1,12:1,14:1},hS.SA);_.lb=function WA(){hS.QA(this);return this.c};_.nb=function XA(){return hS.RA(this)};fS.TE=YI(62);hS.fB=function fB(b,a){return b[a]};hS.gB=function gB(a){return a.length};hS.hB=function hB(b,a){b[b.length]=a};hS.iB=function iB(b,a){return b[a]};hS.jB=function jB(a){return a.length};hS.kB=function kB(){if(Date.now){return Date.now()}return (new Date).getTime()};nH(153,1,{});fS.VE=YI(153);iS.oB=function oB(){iS.oB=pH;!!(iS.JB(),iS.IB)};iS.pB=function pB(a,b,c){return a.apply(b,c);var d};iS.qB=function qB(){var a;if(lB!=0){a=hS.kB();if(a-mB>2000){mB=a;nB=iS.xB()}}if(lB++==0){iS.AB((iS.zB(),iS.yB));return true}return false};function rB(b){iS.oB();return function(){return iS.sB(b,this,arguments);var a}}
iS.sB=function sB(a,b,c){var d;d=iS.qB();try{return iS.pB(a,b,c)}finally{iS.tB(d)}};iS.tB=function tB(a){a&&iS.BB((iS.zB(),iS.yB));--lB;if(a){if(nB!=-1){iS.vB(nB);nB=-1}}};iS.uB=function uB(a){iS.oB();$wnd.setTimeout(function(){throw a},0)};iS.vB=function vB(a){$wnd.clearTimeout(a)};iS.wB=function wB(){lB!=0&&(lB=0);nB=-1};iS.xB=function xB(){return $wnd.setTimeout(iS.wB,10)};var lB=0;var mB=0;var nB=-1;iS.zB=function zB(){iS.zB=pH;iS.yB=new iS.CB};iS.AB=function AB(a){var b,c;if(a.a){c=null;do{b=a.a;a.a=null;c=iS.EB(b,c)}while(a.a);a.a=c}};iS.BB=function BB(a){var b,c;if(a.b){c=null;do{b=a.b;a.b=null;c=iS.EB(b,c)}while(a.b);a.b=c}};iS.CB=function CB(){};iS.DB=function DB(a,b){!a&&(a=hS.bB());hS.hB(a,b);return a};iS.EB=function EB(b,c){var d,e,f,g;for(e=0,f=hS.gB(b);e<f;e++){g=hS.fB(b,e);try{iS.HB(g)?iS.FB(g).Lb()&&(c=iS.DB(c,g)):iS.GB(g).Lb()}catch(a){a=GG(a);if(AD(a,14)){d=a;iS.oB();iS.uB(AD(d,62)?d.nb():d)}else throw HG(a)}}return c};nH(147,153,{},iS.CB);fS.XE=YI(147);iS.FB=function FB(a){return a[0]};iS.GB=function GB(a){return a[0]};iS.HB=function HB(a){return a[1]};qS.bC=function bC(a){return a.compatMode};qS.cC=function cC(){return $doc};rS.dC=function dC(){return ['USD','US$',2,'US$','$']};rS.fC=function fC(){rS.fC=pH;rS.eC=new rS.hC};rS.gC=function gC(a){!a.a&&(a.a=new sS.CC);return a.a};rS.hC=function hC(){};nH(149,1,{},rS.hC);fS.aF=YI(149);rS.iC=function iC(){rS.iC=pH;rS.gC((rS.fC(),rS.fC(),rS.eC))};rS.jC=function jC(a){};rS.kC=function kC(a,b){var c,d;b.a+='E';if(a.e<0){a.e=-a.e;b.a+='-'}c=''+a.e;for(d=gS.GK(c).length;d<a.k;++d){b.a+='0'}b.a+=c};rS.lC=function lC(a,b,c){if(a.d==0){b.a=gS.CK(b.a,0,0)+'0'+gS.BK(b.a,0);++a.b;++a.d}if(a.b<a.d||a.c){gS.QK(b,a.b,String.fromCharCode(c));++a.d}};rS.mC=function mC(a,b){var c,d;c=a.b+a.n;if(a.d<c){while(a.d<c){b.a+='0';++a.d}}else{d=a.b+a.i;d>a.d&&(d=a.d);while(d>c&&gS.mK(b.a,d-1)==48){--d}if(d<a.d){gS.PK(b,d,a.d);a.d=d}}};rS.nC=function nC(a,b){var c,d;d=0;while(d<a.d-1&&gS.mK(b.a,d)==48){++d}if(d>0){b.a=gS.CK(b.a,0,0)+''+gS.BK(b.a,d);a.d-=d;a.e-=d}if(a.j>a.o&&a.j>0){a.e+=a.b-1;c=a.e%a.j;c<0&&(c+=a.j);a.b=c+1;a.e-=c}else{a.e+=a.b-a.o;a.b=a.o}if(a.d==1&&gS.mK(b.a,0)==48){a.e=0;a.b=a.o}};rS.oC=function oC(a,b){var c,d,e,f;if(jS.KR(b)){return 'NaN'}d=b<0||b==0&&1/b<0;d&&(b=-b);c=new gS.RK;if(!jS.KR(b)&&!jS.JR(b)){gS.OK(c,d?a.q:a.t);c.a+='\u221E';gS.OK(c,d?a.r:a.u);return c.a}b*=a.p;f=rS.BC(c,b);e=gS.GK(c.a).length+f+a.i+3;if(e>0&&e<gS.GK(c.a).length&&gS.mK(c.a,e)==57){rS.wC(a,c,e-1);f+=gS.GK(c.a).length-e;gS.PK(c,e,gS.GK(c.a).length)}rS.pC(a,d,c,f);return c.a};rS.pC=function pC(a,b,c,d){var e,f,g,h,i;if(a.g){f=gS.GK('.').charCodeAt(0);g=gS.GK(',').charCodeAt(0)}else{f=gS.GK('.').charCodeAt(0);g=gS.GK(',').charCodeAt(0)}a.e=0;a.d=gS.GK(c.a).length;a.b=a.d+d;h=a.v;e=a.f;a.b>kT&&(h=true);h&&rS.nC(a,c);rS.vC(a,c);rS.xC(a,c);rS.qC(a,c,g,e);rS.mC(a,c);rS.lC(a,c,f);h&&rS.kC(a,c);i=gS.GK('0').charCodeAt(0);i!=48&&rS.rC(c,i);gS.QK(c,0,b?a.q:a.t);gS.OK(c,b?a.r:a.u)};rS.qC=function qC(a,b,c,d){var e;if(d>0){for(e=d;e<a.b;e+=d+1){gS.QK(b,a.b-e,String.fromCharCode(c));++a.b;++a.d}}};rS.rC=function rC(a,b){var c,d,e;e=gS.GK(a.a).length;for(d=0;d<e;++d){c=gS.mK(a.a,d);c>=48&&c<=57&&gS.lI(a,d,c-48+b&TS)}};rS.sC=function sC(a,b,c,d,e){var f,g,h,i;gS.PK(d,0,gS.GK(d.a).length);g=false;h=gS.GK(b).length;for(i=c;i<h;++i){f=gS.GK(b).charCodeAt(i);if(f==39){if(i+1<h&&gS.GK(b).charCodeAt(i+1)==39){++i;d.a+="'"}else{g=!g}continue}if(g){d.a+=String.fromCharCode(f)}else{switch(f){case 35:case 48:case 44:case 46:case 59:return i-c;case 164:a.g=true;if(i+1<h&&gS.GK(b).charCodeAt(i+1)==164){++i;if(i<h-2&&gS.GK(b).charCodeAt(i+1)==164&&gS.GK(b).charCodeAt(i+2)==164){i+=2;gS.OK(d,tS.GC(a.a))}else{gS.OK(d,tS.DC(a.a))}}else{gS.OK(d,tS.EC(a.a))}break;case 37:if(!e){if(a.p!=1){throw HG(new gS.OJ(xU+b+'"'))}a.p=100}d.a+='%';break;case 8240:if(!e){if(a.p!=1){throw HG(new gS.OJ(xU+b+'"'))}a.p=1000}d.a+='\u2030';break;case 45:d.a+='-';break;default:d.a+=String.fromCharCode(f);}}}return h-c};rS.tC=function tC(a,b){var c,d;d=0;c=new gS.RK;d+=rS.sC(a,b,0,c,false);a.t=c.a;d+=rS.uC(a,b,d,false);d+=rS.sC(a,b,d,c,false);a.u=c.a;if(d<gS.GK(b).length&&gS.GK(b).charCodeAt(d)==59){++d;d+=rS.sC(a,b,d,c,true);a.q=c.a;d+=rS.uC(a,b,d,true);d+=rS.sC(a,b,d,c,true);a.r=c.a}else{a.q='-'+a.t;a.r=a.u}};rS.uC=function uC(a,b,c,d){var e,f,g,h,i,j,k,l,m,n,o,p;f=-1;g=0;p=0;h=0;j=-1;k=gS.GK(b).length;n=c;l=true;for(;n<k&&l;++n){e=gS.GK(b).charCodeAt(n);switch(e){case 35:p>0?++h:++g;j>=0&&f<0&&++j;break;case 48:if(h>0){throw HG(new gS.OJ("Unexpected '0' in pattern \""+b+'"'))}++p;j>=0&&f<0&&++j;break;case 44:j=0;break;case 46:if(f>=0){throw HG(new gS.OJ('Multiple decimal separators in pattern "'+b+'"'))}f=g+p+h;break;case 69:if(!d){if(a.v){throw HG(new gS.OJ('Multiple exponential symbols in pattern "'+b+'"'))}a.v=true;a.k=0}while(n+1<k&&gS.GK(b).charCodeAt(n+1)==48){++n;d||++a.k}if(!d&&g+p<1||a.k<1){throw HG(new gS.OJ('Malformed exponential pattern "'+b+'"'))}l=false;break;default:--n;l=false;}}if(p==0&&g>0&&f>=0){m=f;f==0&&++m;h=g-m;g=m-1;p=1}if(f<0&&h>0||f>=0&&(f<g||f>g+p)||j==0){throw HG(new gS.OJ('Malformed pattern "'+b+'"'))}if(d){return n-c}o=g+p+h;a.i=f>=0?o-f:0;if(f>=0){a.n=g+p-f;a.n<0&&(a.n=0)}i=f>=0?f:o;a.o=i-g;if(a.v){a.j=g+a.o;a.i==0&&a.o==0&&(a.o=1)}a.f=j>0?j:0;a.c=f==0||f==o;return n-c};rS.vC=function vC(a,b){var c,d,e;if(a.b>a.d){while(a.d<a.b){b.a+='0';++a.d}}if(!a.v){if(a.b<a.o){d=new gS.RK;while(a.b<a.o){d.a+='0';++a.b;++a.d}gS.QK(b,0,d.a)}else if(a.b>a.o){e=a.b-a.o;for(c=0;c<e;++c){if(gS.mK(b.a,c)!=48){e=c;break}}if(e>0){b.a=gS.CK(b.a,0,0)+''+gS.BK(b.a,e);a.d-=e;a.b-=e}}}};rS.wC=function wC(a,b,c){var d,e;d=true;while(d&&c>=0){e=gS.mK(b.a,c);if(e==57){gS.lI(b,c--,48)}else{gS.lI(b,c,e+1&TS);d=false}}if(d){b.a=gS.CK(b.a,0,0)+'1'+gS.BK(b.a,0);++a.b;++a.d}};rS.xC=function xC(a,b){var c;if(a.d>a.b+a.i&&gS.jI(b,a.b+a.i)>=53){c=a.b+a.i-1;rS.wC(a,b,c)}};rS.yC=function yC(a,b,c){rS.jC(this);if(!b){throw HG(new gS.OJ('Unknown currency code'))}this.s=a;this.a=b;rS.tC(this,this.s);if(!c&&this.g){this.n=tS.FC(this.a)&7;this.i=this.n}};rS.zC=function zC(a,b){rS.iC();rS.yC.call(this,a,b,true)};rS.AC=function AC(a,b){return a.toPrecision(b)};rS.BC=function BC(a,b){var c,d,e,f,g;g=gS.GK(a.a).length;gS.OK(a,rS.AC(b,20));f=0;e=gS.xK(a.a,'e',g);e<0&&(e=gS.xK(a.a,'E',g));if(e>=0){d=e+1;d<gS.GK(a.a).length&&gS.mK(a.a,d)==43&&++d;d<gS.GK(a.a).length&&(f=gS.oJ(gS.BK(a.a,d)));gS.PK(a,e,gS.GK(a.a).length)}c=gS.xK(a.a,'.',g);if(c>=0){a.a=gS.CK(a.a,0,c)+''+gS.BK(a.a,c+1);f-=gS.GK(a.a).length-c}return f};nH(110,1,{},rS.zC);_.b=0;_.c=false;_.d=0;_.e=0;_.f=3;_.g=false;_.i=3;_.j=40;_.k=0;_.n=0;_.o=1;_.p=1;_.q='-';_.r='';_.t='';_.u='';_.v=false;fS.bF=YI(110);sS.CC=function CC(){};nH(151,1,{},sS.CC);fS.cF=YI(151);tS.DC=function DC(a){return a[0]};tS.EC=function EC(a){return a[1]};tS.FC=function FC(a){return a[2]};tS.GC=function GC(a){return a[4]||a[1]};fS.YC=function YC(a){var b,c,d;b=a&hU;c=a>>22&hU;d=a<0?yU:0;return fS.ZC(b,c,d)};fS.ZC=function ZC(a,b,c){return {l:a,m:b,h:c}};fS.$C=function $C(a){return a.h};fS._C=function _C(a){return a.l};fS.aD=function aD(a){return a.m};fS.bD=function bD(a){var b,c,d;b=~fS._C(a)+1&hU;c=~fS.aD(a)+(b==0?1:0)&hU;d=~fS.$C(a)+(b==0&&c==0?1:0)&yU;fS.dD(a,b);fS.eD(a,c);fS.cD(a,d)};fS.cD=function cD(a,b){a.h=b};fS.dD=function dD(a,b){a.l=b};fS.eD=function eD(a,b){a.m=b};fS.fD=function fD(a){return fS._C(a)+fS.aD(a)*zU+fS.$C(a)*AU};fS.gD=function gD(a,b){var c,d,e;c=fS._C(a)+fS._C(b);d=fS.aD(a)+fS.aD(b)+(c>>22);e=fS.$C(a)+fS.$C(b)+(d>>22);return fS.ZC(c&hU,d&hU,e&yU)};fS.hD=function hD(a,b){return fS.ZC(fS._C(a)&fS._C(b),fS.aD(a)&fS.aD(b),fS.$C(a)&fS.$C(b))};fS.iD=function iD(a,b){var c,d,e,f,g,h,i,j;i=fS.$C(a)>>19;j=fS.$C(b)>>19;if(i!=j){return j-i}e=fS.$C(a);h=fS.$C(b);if(e!=h){return e-h}d=fS.aD(a);g=fS.aD(b);if(d!=g){return d-g}c=fS._C(a);f=fS._C(b);return c-f};fS.jD=function jD(a){var b,c,d,e,f;if(jS.KR(a)){return fS.uD(),fS.tD}if(a<-9223372036854775808){return fS.uD(),fS.sD}if(a>=9223372036854775807){return fS.uD(),fS.rD}e=false;if(a<0){e=true;a=-a}d=0;if(a>=AU){d=JD(a/AU);a-=d*AU}c=0;if(a>=zU){c=JD(a/zU);a-=c*zU}b=JD(a);f=fS.ZC(b,c,d);e&&fS.bD(f);return f};fS.kD=function kD(a,b){var c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,A,B,C,D,F,G;c=fS._C(a)&8191;d=fS._C(a)>>13|(fS.aD(a)&15)<<9;e=fS.aD(a)>>4&8191;f=fS.aD(a)>>17|(fS.$C(a)&255)<<5;g=(fS.$C(a)&1048320)>>8;h=fS._C(b)&8191;i=fS._C(b)>>13|(fS.aD(b)&15)<<9;j=fS.aD(b)>>4&8191;k=fS.aD(b)>>17|(fS.$C(b)&255)<<5;l=(fS.$C(b)&1048320)>>8;B=c*h;C=d*h;D=e*h;F=f*h;G=g*h;if(i!=0){C+=c*i;D+=d*i;F+=e*i;G+=f*i}if(j!=0){D+=c*j;F+=d*j;G+=e*j}if(k!=0){F+=c*k;G+=d*k}l!=0&&(G+=c*l);n=B&hU;o=(C&511)<<13;m=n+o;q=B>>22;r=C>>9;s=(D&262143)<<4;t=(F&31)<<17;p=q+r+s+t;v=D>>18;w=F>>5;A=(G&4095)<<8;u=v+w+A;p+=m>>22;m&=hU;u+=p>>22;p&=hU;u&=yU;return fS.ZC(m,p,u)};fS.lD=function lD(a){var b,c,d;b=~fS._C(a)+1&hU;c=~fS.aD(a)+(b==0?1:0)&hU;d=~fS.$C(a)+(b==0&&c==0?1:0)&yU;return fS.ZC(b,c,d)};fS.mD=function mD(a,b){return fS.ZC(fS._C(a)|fS._C(b),fS.aD(a)|fS.aD(b),fS.$C(a)|fS.$C(b))};fS.nD=function nD(a,b){var c,d,e;b&=63;if(b<22){c=fS._C(a)<<b;d=fS.aD(a)<<b|fS._C(a)>>22-b;e=fS.$C(a)<<b|fS.aD(a)>>22-b}else if(b<44){c=0;d=fS._C(a)<<b-22;e=fS.aD(a)<<b-22|fS._C(a)>>44-b}else{c=0;d=0;e=fS._C(a)<<b-44}return fS.ZC(c&hU,d&hU,e&yU)};fS.oD=function oD(a,b){var c,d,e,f,g;b&=63;c=fS.$C(a);d=(c&OS)!=0;d&&(c|=-1048576);if(b<22){g=c>>b;f=fS.aD(a)>>b|c<<22-b;e=fS._C(a)>>b|fS.aD(a)<<22-b}else if(b<44){g=d?yU:0;f=c>>b-22;e=fS.aD(a)>>b-22|c<<44-b}else{g=d?yU:0;f=d?hU:0;e=c>>b-44}return fS.ZC(e&hU,f&hU,g&yU)};fS.pD=function pD(a){if(fS.iD(a,(fS.uD(),fS.tD))<0){return -fS.fD(fS.lD(a))}return fS._C(a)+fS.aD(a)*zU+fS.$C(a)*AU};fS.qD=function qD(a){return fS._C(a)|fS.aD(a)<<22};fS.uD=function uD(){fS.uD=pH;fS.rD=fS.ZC(hU,hU,524287);fS.sD=fS.ZC(0,0,OS);fS.YC(1);fS.YC(2);fS.tD=fS.YC(0)};function IG(a,b){var c;if(fS.VG(a)&&fS.VG(b)){c=fS.LG(fS.MG(a))+fS.LG(fS.MG(b));if(BU<c&&c<AU){return fS.RG(c)}}return fS.QG(fS.gD(fS.VG(a)?fS.aH(fS.MG(a)):fS.KG(a),fS.VG(b)?fS.aH(fS.MG(b)):fS.KG(b)))}
function JG(a,b){return fS.QG(fS.hD(fS.VG(a)?fS.aH(fS.MG(a)):fS.KG(a),fS.VG(b)?fS.aH(fS.MG(b)):fS.KG(b)))}
fS.KG=function KG(a){return a};fS.LG=function LG(a){return a};fS.MG=function MG(a){return a};fS.NG=function NG(a){return a|0};function OG(a,b){var c;if(fS.VG(a)&&fS.VG(b)){c=fS.LG(fS.MG(a))-fS.LG(fS.MG(b));if(!jS.KR(c)){return c}}return fS.iD(fS.VG(a)?fS.aH(fS.MG(a)):fS.KG(a),fS.VG(b)?fS.aH(fS.MG(b)):fS.KG(b))}
fS.PG=function PG(a){return a};fS.QG=function QG(a){var b;b=fS.$C(a);if(b==0){return fS.RG(fS._C(a)+fS.aD(a)*zU)}if(b==yU){return fS.RG(fS._C(a)+fS.aD(a)*zU-AU)}return fS.PG(a)};fS.RG=function RG(a){return a};function SG(a,b){return OG(a,b)==0}
function TG(a){if(BU<a&&a<AU){return fS.RG(a<0?$wnd.Math.ceil(a):$wnd.Math.floor(a))}return fS.QG(fS.jD(a))}
function UG(a){return fS.RG(a)}
fS.VG=function VG(a){return typeof a===IS};function WG(a,b){return OG(a,b)<0}
function XG(a,b){var c;if(fS.VG(a)&&fS.VG(b)){c=fS.LG(fS.MG(a))*fS.LG(fS.MG(b));if(BU<c&&c<AU){return fS.RG(c)}}return fS.QG(fS.kD(fS.VG(a)?fS.aH(fS.MG(a)):fS.KG(a),fS.VG(b)?fS.aH(fS.MG(b)):fS.KG(b)))}
function YG(a,b){return OG(a,b)!=0}
function ZG(a,b){return fS.QG(fS.mD(fS.VG(a)?fS.aH(fS.MG(a)):fS.KG(a),fS.VG(b)?fS.aH(fS.MG(b)):fS.KG(b)))}
function $G(a,b){return fS.QG(fS.nD(fS.VG(a)?fS.aH(fS.MG(a)):fS.KG(a),b))}
function _G(a,b){return fS.QG(fS.oD(fS.VG(a)?fS.aH(fS.MG(a)):fS.KG(a),b))}
fS.aH=function aH(a){var b,c,d,e;e=fS.LG(a);d=0;if(e<0){e+=AU;d=yU}c=JD(e/zU);b=JD(e-c*zU);return fS.ZC(b,c,d)};function bH(a){var b;if(fS.VG(a)){b=fS.LG(fS.MG(a));return b==-0.?0:b}return fS.pD(fS.KG(a))}
function cH(a){if(fS.VG(a)){return fS.NG(fS.LG(fS.MG(a)))}return fS.qD(fS.KG(a))}
function vH(){uS.wH()}
uS.wH=function wH(){var a,b,c;b=qS.bC(qS.cC());a=WC(IC(fS.MF,1),LT,2,6,[CU]);for(c=0;c<a.length;c++){if(gS.sK(a[c],b)){return}}a.length==1&&gS.sK(CU,a[0])&&gS.sK('BackCompat',b)?"GWT no longer supports Quirks Mode (document.compatMode=' BackCompat').<br>Make sure your application's host HTML page has a Standards Mode (document.compatMode=' CSS1Compat') doctype,<br>e.g. by using &lt;!doctype html&gt; at the start of your application's HTML page.<br><br>To continue using this unsupported rendering mode and risk layout problems, suppress this message by adding<br>the following line to your*.gwt.xml module file:<br>&nbsp;&nbsp;&lt;extend-configuration-property name=\"document.compatMode\" value=\""+b+'"/&gt;':"Your *.gwt.xml module configuration prohibits the use of the current document rendering mode (document.compatMode=' "+b+"').<br>Modify your application's host HTML page doctype, or update your custom "+"'document.compatMode' configuration property settings."};vS.BH=function BH(){vS.BH=pH;vS.AH=new vS.GH(255,255,255);vS.xH=vS.AH;vS.zH=new vS.GH(128,128,128);vS.yH=new vS.GH(0,0,0)};vS.CH=function CH(a){};vS.DH=function DH(a){var b;b=OC(fS.ND,FT,5,4,15,1);if(a.b==null){b[0]=(a.c>>16&255)/255;b[1]=(a.c>>8&255)/255;b[2]=(a.c&255)/255;b[3]=(a.c>>24&255)/255}else{b[0]=a.b[0];b[1]=a.b[1];b[2]=a.b[2];b[3]=a.a}return b};vS.EH=function EH(a,b,c,d){vS.BH();vS.HH.call(this,JD(a*255+0.5),JD(b*255+0.5),JD(c*255+0.5),JD(d*255+0.5));this.b=OC(fS.ND,FT,5,3,15,1);this.b[0]=a;this.b[1]=b;this.b[2]=c;this.a=d};vS.FH=function FH(a){vS.BH();vS.CH(this);this.c=GT|a};vS.GH=function GH(a,b,c){vS.BH();vS.HH.call(this,a,b,c,255)};vS.HH=function HH(a,b,c,d){vS.CH(this);this.c=(d&255)<<24|(a&255)<<16|(b&255)<<8|c&255};vS.IH=function IH(a,b,c,d){vS.BH();var e,f,g,h,i;i=0;h=$wnd.Math.min(a,$wnd.Math.min(b,c));g=$wnd.Math.max(a,$wnd.Math.max(b,c));e=g-h;if(e==0){f=0;d[0]=f;d[1]=i;d[2]=h;return d}if(g!=0)i=e/g;else{i=0;f=0;d[0]=f;d[1]=i;d[2]=g;return d}a==g?(f=(b-c)/e):b==g?(f=2+(c-a)/e):(f=4+(a-b)/e);f*=60;f<0&&(f+=360);d[0]=f/360;d[1]=i;d[2]=g;return d};nH(20,1,{},vS.EH,vS.FH,vS.GH);_.a=0;_.b=null;_.c=0;fS.dF=YI(20);vS.LH=function LH(){vS.LH=pH;vS.KH=WC(IC(fS.MD,1),_S,5,15,[5.55,15,15,15,15,15,15,15,15,DU,DU,DU,DU,DU,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,DU,DU,7.1,EU,EU,17.78,FU,3.82,6.66,6.66,7.78,11.68,DU,6.66,DU,DU,EU,EU,EU,EU,EU,EU,EU,EU,EU,EU,DU,DU,11.68,11.68,11.68,EU,20.3,FU,FU,GU,GU,FU,12.22,15.56,GU,DU,10,FU,EU,16.66,GU,15.56,FU,15.56,GU,FU,12.22,GU,FU,18.88,FU,FU,12.22,DU,DU,DU,9.38,EU,6.66,EU,EU,10,EU,EU,DU,EU,EU,4.44,4.44,10,4.44,16.66,EU,EU,EU,EU,6.66,10,DU,EU,10,GU,10,10,10,6.68,5.2,6.68,11.68,10.5])};vS.MH=function MH(a,b){var c,d,e,f,g;if(gS.sK(a.a,'Helvetica')){f=0;for(d=0,e=gS.GK(b).length;d<e;d++){c=gS.GK(b).charCodeAt(d);f+=(c<128?(g=vS.KH[c]):(g=DU),g*a.b/20)}return f}else{return vS.NH(a,b)}};vS.NH=function NH(e,a){var b=vS.JH;if(!b){b=$doc.createElement('canvas');vS.JH=b}var c=''+e.b+'px '+e.a;var d=b.getContext('2d');d.font=c;var a=d.measureText(a);return a.width};vS.OH=function OH(a){vS.LH();this.a='Helvetica';this.b=a};nH(108,1,{},vS.OH);_.b=0;vS.JH=null;fS.eF=YI(108);nH(95,1,{95:1});_.ab=function PH(a){var b;if(this===a)return true;if(AD(a,36)){b=a;return this.a==b.a&&this.b==b.b}return this===a};_.cb=function QH(){var a;a=this.a+this.b;return JD(a)*37};fS.gF=YI(95);wS.RH=function RH(){};wS.SH=function SH(a,b){this.a=a;this.b=b};nH(36,95,{95:1,36:1,4:1},wS.RH,wS.SH);_.a=0;_.b=0;fS.fF=YI(36);wS.TH=function TH(a,b){return wS.WH(a,b.c,b.d,b.b,b.a)};wS.UH=function UH(a,b,c,d,e){var f;if(d<b){f=b;b=d;d=f}if(e<c){f=c;c=e;e=f}wS.aI(a,b,c,d-b,e-c)};nH(172,1,{});fS.jF=YI(172);wS.VH=function VH(a,b,c){var d,e;d=a.c;e=a.d;return b>=d&&c>=e&&b<d+a.b&&c<e+a.a};wS.WH=function WH(a,b,c,d,e){var f,g;if(a.b<=0||a.a<=0||d<=0||e<=0){return false}f=a.c;g=a.d;return b>=f&&c>=g&&b+d<=f+a.b&&c+e<=g+a.a};
wS.ZH=function ZH(a,b,c){var d,e,f,g;d=$wnd.Math.min(a.c,b.c);f=$wnd.Math.min(a.d,b.d);e=$wnd.Math.max(a.c+a.b,b.c+b.b);g=$wnd.Math.max(a.d+a.a,b.d+b.a);wS.UH(c,d,f,e,g)};nH(96,172,{96:1});_.ab=function XH(a){var b;if(a===this){return true}if(AD(a,15)){b=a;return this.c==b.c&&this.d==b.d&&this.b==b.b&&this.a==b.a}return false};_.cb=function YH(){var a;a=zJ(this.c);a=IG(a,XG(zJ(this.d),37));a=IG(a,XG(zJ(this.b),43));a=IG(a,XG(zJ(this.a),47));return cH(a)^cH(_G(a,32))};fS.iF=YI(96);wS._H=function _H(a,b){var c;c=new wS.bI;wS.ZH(a,b,c);return c};wS.aI=function aI(a,b,c,d,e){a.c=b;a.d=c;a.b=d;a.a=e};wS.bI=function bI(){};wS.cI=function cI(a,b,c,d){wS.aI(this,a,b,c,d)};nH(15,96,{96:1,15:1},wS.bI,wS.cI);_.a=0;_.b=0;_.c=0;_.d=0;fS.hF=YI(15);nH(173,1,{});fS.oF=YI(173);xS.dI=function dI(a){var b;if(a.a!=-2){b=a.a;a.a=-2}else{b=xS.hI(a.b)}return b};xS.eI=function eI(a){var b,c,d;c=xS.dI(a);if(c==-1)return null;d=new gS.RK;b=false;while(!b){if(c==10){b=true}else if(c==13){b=true;c=xS.dI(a);c!=10&&(a.a=c)}if(!b){if(c==-1){break}gS.LK(d,c&TS);c=xS.dI(a)}}return d.a};xS.fI=function fI(a){this.b=a;this.a=-2};nH(87,173,{},xS.fI);_.a=0;fS.kF=YI(87);nH(155,1,{});fS.mF=YI(155);nH(154,155,{});fS.lF=YI(154);xS.gI=function gI(){};nH(112,154,{},xS.gI);fS.nF=YI(112);xS.hI=function hI(a){return a.a==gS.GK(a.b).length?-1:gS.mK(a.b,a.a++)};xS.iI=function iI(a){this.b=a;this.a=0};nH(86,173,{},xS.iI);_.a=0;fS.pF=YI(86);gS.jI=function jI(a,b){return gS.mK(a.a,b)};gS.kI=function kI(a,b,c,d){a.a=gS.CK(a.a,0,b)+(''+d)+gS.BK(a.a,c)};gS.lI=function lI(a,b,c){gS.kI(a,b,b+1,String.fromCharCode(c))};gS.mI=function mI(a){var b;b=gS.GK(a.a).length;0<b?(a.a=gS.CK(a.a,0,0)):0>b&&(a.a+=gS.HK(OC(fS.LD,FT,5,-b,15,1)))};gS.nI=function nI(a){return a.a};gS.oI=function oI(a){this.a=a};nH(57,1,{82:1});_.db=function pI(){return gS.nI(this)};fS.qF=YI(57);gS.qI=function qI(){gS.GA.call(this)};gS.rI=function rI(a){gS.IA.call(this,a)};nH(40,26,RS,gS.qI,gS.rI);fS.zF=YI(40);gS.sI=function sI(){gS.qI.call(this)};gS.tI=function tI(a){gS.rI.call(this,a)};nH(111,40,RS,gS.sI,gS.tI);fS.rF=YI(111);function GI(a){if(!a){throw HG(new gS.NJ)}}
function HI(a,b,c){var d,e;d=gS.mK(a,b++);if(d>=55296&&d<=56319&&b<c&&LI(e=gS.GK(a).charCodeAt(b))){return SS+((d&1023)<<10)+(e&1023)}return d}
function II(a){if(a>=48&&a<58){return a-48}if(a>=97&&a<97){return a-97+10}if(a>=65&&a<65){return a-65+10}return -1}
function JI(a){return null!=String.fromCharCode(a).match(/\d/)}
function KI(a){return null!=String.fromCharCode(a).match(/[A-Z]/i)}
function LI(a){return a>=56320&&a<=57343}
function MI(a,b,c){GI(a>=0&&a<=1114111);if(a>=SS){b[c++]=55296+(a-SS>>10&1023)&TS;b[c]=56320+(a-SS&1023)&TS;return 2}else{b[c]=a&TS;return 1}}
function NI(a){return String.fromCharCode(a).toLowerCase().charCodeAt(0)}
gS.CJ=function CJ(){gS.CJ=pH;gS.BJ=WC(IC(fS.MD,1),_S,5,15,[1.3407807929942597E154,1.157920892373162E77,3.4028236692093846E38,1.8446744073709552E19,4294967296,SS,256,16,4,2]);gS.AJ=WC(IC(fS.MD,1),_S,5,15,[7.458340731200207E-155,8.636168555094445E-78,2.9387358770557188E-39,5.421010862427522E-20,2.3283064365386963E-10,HU,0.00390625,0.0625,0.25,0.5])};gS.DJ=function DJ(a,b){return a.b-b.b};gS.EJ=function EJ(a){return a.a!=null?a.a:''+a.b};nH(46,1,{4:1,25:1,46:1});_.fb=function GJ(a){return gS.DJ(this,a)};_.compareTo=function FJ(a){return gS.DJ(this,a)};_.equals=function HJ(a){return this===a};_.ab=function(a){return this.equals(a)};_.hashCode=function IJ(){return jS.UR(this)};_.cb=function(){return this.hashCode()};_.name=function JJ(){return gS.EJ(this)};_.ordinal=function KJ(){return this.b};_.toString=function LJ(){return this.a!=null?this.a:''+this.b};_.db=function(){return this.toString()};_.b=0;fS.vF=YI(46);function MJ(a){var b;b=gS.nJ(a);if(b>gU){return Infinity}else if(b<-3.4028234663852886E38){return -Infinity}return b}
gS.NJ=function NJ(){gS.GA.call(this)};gS.OJ=function OJ(a){gS.IA.call(this,a)};nH(19,26,RS,gS.NJ,gS.OJ);fS.xF=YI(19);gS.PJ=function PJ(){gS.GA.call(this)};nH(131,26,RS,gS.PJ);fS.yF=YI(131);gS.$J=function $J(){gS.$J=pH;gS.ZJ=OC(fS.AF,IU,30,256,0,1)};gS._J=function _J(a){return a<0?-a:a};gS.aK=function aK(a,b){return a>b?a:b};gS.bK=function bK(a,b){return a<b?a:b};gS.cK=function cK(a){gS.IA.call(this,a)};nH(148,26,RS,gS.cK);fS.CF=YI(148);gS.hK=function hK(a){gS.OJ.call(this,a)};nH(52,19,RS,gS.hK);fS.EF=YI(52);gS.iK=function iK(a,b,c){this.a=GS;this.d=a;this.b=b;this.c=c};nH(39,1,{4:1,39:1},gS.iK);_.ab=function jK(a){var b;if(AD(a,39)){b=a;return this.c==b.c&&AS.dP(this.d,b.d)&&AS.dP(this.a,b.a)&&AS.dP(this.b,b.b)}return false};_.cb=function kK(){return AS.IO(WC(IC(fS.GF,1),BT,1,5,[gS.YJ(this.c),this.a,this.d,this.b]))};_.db=function lK(){return this.a+'.'+this.d+'('+(this.b!=null?this.b:'Unknown Source')+(this.c>=0?':'+this.c:'')+')'};_.c=0;fS.IF=YI(39);gS.JK=function JK(a,b){a.a+=''+b;return a};gS.KK=function KK(){gS.oI.call(this,'')};nH(83,57,{82:1},gS.KK);fS.JF=YI(83);gS.LK=function LK(a,b){a.a+=String.fromCharCode(b);return a};gS.MK=function MK(a,b){a.a+=b;return a};gS.NK=function NK(a,b){a.a+=''+b;return a};gS.OK=function OK(a,b){a.a+=''+b;return a};gS.PK=function PK(a,b,c){a.a=gS.CK(a.a,0,b)+''+gS.BK(a.a,c);return a};gS.QK=function QK(a,b,c){a.a=gS.CK(a.a,0,b)+(''+c)+gS.BK(a.a,b);return a};gS.RK=function RK(){gS.oI.call(this,'')};gS.SK=function SK(){gS.oI.call(this,'')};gS.TK=function TK(a){gS.oI.call(this,(jS.yR(a),a))};nH(32,57,{82:1},gS.RK,gS.SK,gS.TK);fS.KF=YI(32);gS.UK=function UK(a){gS.rI.call(this,a)};nH(132,40,RS,gS.UK);fS.LF=YI(132);gS.WK=function WK(){gS.WK=pH;gS.VK=new xS.gI};gS.XK=function XK(a,b,c){gS.WK();var d,e;jS.zR(a,'src');jS.zR(b,'dest');gS.wc(a);gS.wc(b);e=jS.eR(a);d=jS.eR(b);if(c<0||c>e||c>d){throw HG(new gS.qI)}c>0&&jS.cR(a,0,b,0,c,true)};nH(200,1,{});gS.YK=function YK(){gS.GA.call(this)};gS.ZK=function ZK(a){gS.IA.call(this,a)};nH(44,26,RS,gS.YK,gS.ZK);fS.OF=YI(44);yS.$K=function $K(a,b){return gS.pK(a.a,b.a)};yS._K=function _K(a){this.a=a};nH(45,1,JU);_.fb=function aL(a){return yS.$K(this,a)};_.ab=function bL(a){var b;if(a===this){return true}if(!AD(a,45)){return false}b=a;return gS.sK(this.a,b.a)};_.cb=function cL(){return jS.aS(this.a)};_.db=function dL(){return this.a};fS.PF=YI(45);nH(179,1,{});fS.RF=YI(179);zS.eL=function eL(a,b){return rS.oC(a.a,b)};zS.fL=function fL(a){this.a=(rS.iC(),new rS.zC(a,rS.dC()))};zS.gL=function gL(a){zS.fL.call(this,a)};nH(79,179,{},zS.fL,zS.gL);fS.QF=YI(79);AS.hL=function hL(a,b,c){var d,e;for(e=a.xb();e.Ab();){d=e.Bb();if(ID(b)===ID(d)||b!=null&&gS.uc(b,d)){c&&e.Cb();return true}}return false};AS.iL=function iL(a,b){var c,d;jS.yR(b);for(d=b.xb();d.Ab();){c=d.Bb();if(!a.contains(c)){return false}}return true};AS.jL=function jL(a,b){var c,d,e;jS.yR(b);c=false;for(d=a.xb();d.Ab();){e=d.Bb();if(b.contains(e)){d.Cb();c=true}}return c};AS.kL=function kL(a){var b,c,d;d=new AS.qP('[',']');for(c=a.xb();c.Ab();){b=c.Bb();AS.oP(d,b===a?'(this Collection)':b==null?NS:tH(b))}return !d.a?d.c:gS.GK(d.e).length==0?d.a.a:d.a.a+(''+d.e)};nH(174,1,{});_.add=function lL(a){throw HG(new gS.ZK('Add not supported on this collection'))};_.addAll=function mL(a){var b,c,d;jS.yR(a);b=false;for(d=a.xb();d.Ab();){c=d.Bb();b=b|this.add(c)}return b};_.clear=function nL(){var a;for(a=this.xb();a.Ab();){a.Bb();a.Cb()}};_.contains=function oL(a){return AS.hL(this,a,false)};_.containsAll=function pL(a){return AS.iL(this,a)};_.isEmpty=function qL(){return this.size()==0};_.remove=function rL(a){return AS.hL(this,a,true)};_.removeAll=function sL(a){return AS.jL(this,a)};_.retainAll=function tL(a){var b,c,d;jS.yR(a);b=false;for(c=this.xb();c.Ab();){d=c.Bb();if(!a.contains(d)){c.Cb();b=true}}return b};_.toArray=function uL(){return this.yb(OC(fS.GF,BT,1,this.size(),5,1))};_.yb=function vL(a){var b,c,d,e;e=this.size();a.length<e&&(a=(d=jS.dR(e),jS.kR(d,a)));c=this.xb();for(b=0;b<e;++b){SC(a,b,c.Bb())}a.length>e&&fS.RC(a,e,null);return a};_.db=function wL(){return AS.kL(this)};fS.SF=YI(174);AS.xL=function xL(a,b,c){return new AS.WL(a,b,c)};nH(175,174,{80:1});_.addAtIndex=function yL(a,b){throw HG(new gS.ZK('Add not supported on this list'))};_.add=function zL(a){this.addAtIndex(this.size(),a);return true};_.addAllAtIndex=function AL(a,b){var c,d,e;jS.yR(b);c=false;for(e=b.xb();e.Ab();){d=e.Bb();this.addAtIndex(a++,d);c=true}return c};_.clear=function BL(){this.zb(0,this.size())};_.ab=function CL(a){var b,c,d,e,f;if(a===this){return true}if(!AD(a,80)){return false}f=a;if(this.size()!=f.size()){return false}e=f.xb();for(c=this.xb();c.Ab();){b=c.Bb();d=e.Bb();if(!(ID(b)===ID(d)||b!=null&&gS.uc(b,d))){return false}}return true};_.cb=function DL(){return AS.TO(this)};_.indexOf=function EL(a){var b,c;for(b=0,c=this.size();b<c;++b){if(AS.dP(a,this.getAtIndex(b))){return b}}return -1};_.xb=function FL(){return new AS.PL(this)};_.lastIndexOf=function GL(a){var b;for(b=this.size()-1;b>-1;--b){if(AS.dP(a,this.getAtIndex(b))){return b}}return -1};_.removeAtIndex=function HL(a){throw HG(new gS.ZK('Remove not supported on this list'))};_.zb=function IL(a,b){var c,d;d=new AS.UL(this,a);for(c=a;c<b;++c){jS.wR(d.a<d.c.size());d.c.getAtIndex(d.b=d.a++);AS.OL(d)}};_.setAtIndex=function JL(a,b){throw HG(new gS.ZK('Set not supported on this list'))};_.subList=function KL(a,b){return AS.xL(this,a,b)};fS.WF=YI(175);AS.$O=function $O(){throw HG(new gS.YK)};AS.LL=function LL(a){};AS.ML=function ML(a){return a.a<a.c.size()};AS.NL=function NL(a){jS.wR(a.a<a.c.size());return a.c.getAtIndex(a.b=a.a++)};AS.OL=function OL(a){jS.CR(a.b!=-1);a.c.removeAtIndex(a.b);a.a=a.b;a.b=-1};AS.PL=function PL(a){this.c=a;AS.LL(this)};nH(98,1,{},AS.PL);_.Ab=function QL(){return AS.ML(this)};_.Bb=function RL(){return AS.NL(this)};_.Cb=function SL(){AS.OL(this)};_.a=0;_.b=-1;fS.TF=YI(98);AS.TL=function TL(a){AS.OL(a)};AS.UL=function UL(a,b){AS.PL.call(this,a);jS.AR(b,a.size());this.a=b};nH(99,98,{},AS.UL);_.Cb=function VL(){AS.TL(this)};fS.UF=YI(99);AS.WL=function WL(a,b,c){jS.BR(b,c,a.size());this.c=a;this.a=b;this.b=c-b};nH(100,175,{80:1},AS.WL);_.addAtIndex=function XL(a,b){jS.AR(a,this.b);this.c.addAtIndex(this.a+a,b);++this.b};_.getAtIndex=function YL(a){jS.xR(a,this.b);return this.c.getAtIndex(this.a+a)};_.removeAtIndex=function ZL(a){var b;jS.xR(a,this.b);b=this.c.removeAtIndex(this.a+a);--this.b;return b};_.setAtIndex=function $L(a,b){jS.xR(a,this.b);return this.c.setAtIndex(this.a+a,b)};_.size=function _L(){return this.b};_.a=0;_.b=0;fS.VF=YI(100);AS._O=function _O(a,b,c){var d;d=AS.jM(AS.vP(a,b));return d==null&&!AS.vP(a,b)?c:d};AS.aP=function aP(a,b,c){var d;d=AS.jM(AS.vP(a,b));return d!=null?d:AS.AP(a,b,c)};AS.bP=function bP(a,b,c){return AS.vP(a,b)?AS.AP(a,b,c):null};AS.aM=function aM(a,b){var c,d,e;for(d=new AS.SP((new AS.XP(a)).b);AS.ML(d.a);){c=d.b=AS.NL(d.a);e=c.Fb();if(ID(b)===ID(e)||b!=null&&gS.uc(b,e)){return true}}return false};AS.bM=function bM(a,b,c){var d,e,f;for(e=new AS.SP((new AS.XP(a)).b);AS.ML(e.a);){d=e.b=AS.NL(e.a);f=d.Eb();if(ID(b)===ID(f)||b!=null&&gS.uc(b,f)){if(c){d=new AS.dN(d.Eb(),d.Fb());AS.RP(e)}return d}}return null};AS.cM=function cM(a,b){return b===a?'(this Map)':b==null?NS:tH(b)};AS.dM=function dM(a){return new AS.LM(a)};AS.jM=function jM(a){return !a?null:a.Fb()};nH(176,1,{152:1});_.getOrDefault=function kM(a,b){var c;return c=this.get(a),c==null&&!this.containsKey(a)?b:c};_.putIfAbsent=function qM(a,b){var c;return c=this.get(a),c!=null?c:this.put(a,b)};_.replace=function sM(a,b){return this.containsKey(a)?this.put(a,b):null};_.clear=function eM(){this.Db().clear()};_.containsKey=function fM(a){return !!AS.bM(this,a,false)};_.containsValue=function gM(a){return AS.aM(this,a)};_.ab=function hM(a){var b,c,d;if(a===this){return true}if(!AD(a,42)){return false}d=a;if(this.c!=d.c){return false}for(c=new AS.SP((new AS.XP(d)).b);AS.ML(c.a);){b=c.b=AS.NL(c.a);if(!AS.eN(this,b)){return false}}return true};_.get=function iM(a){return AS.jM(AS.bM(this,a,false))};_.cb=function lM(){return AS.SO(this.Db())};_.isEmpty=function mM(){return this.c==0};_.keySet=function nM(){return new AS.AM(this)};_.put=function oM(a,b){throw HG(new gS.ZK('Put not supported on this map'))};_.putAll=function pM(a){var b,c;jS.yR(a);for(c=new AS.SP(a.Db().b);AS.ML(c.a);){b=c.b=AS.NL(c.a);AS.AP(this,b.Eb(),b.Fb())}};_.remove=function rM(a){return AS.jM(AS.bM(this,a,true))};_.size=function uM(){return this.Db().b.c};_.db=function vM(){var a,b,c;c=new AS.qP('{','}');for(b=new AS.SP(this.Db().b);AS.ML(b.a);){a=b.b=AS.NL(b.a);AS.oP(c,AS.cM(this,a.Eb())+'='+AS.cM(this,a.Fb()))}return !c.a?c.c:gS.GK(c.e).length==0?c.a.a:c.a.a+(''+c.e)};_.values=function wM(){return AS.dM(this)};fS.bG=YI(176);nH(178,174,KU);_.ab=function xM(a){var b;if(a===this){return true}if(!AD(a,55)){return false}b=a;if(b.size()!=this.size()){return false}return AS.iL(this,b)};_.cb=function yM(){return AS.SO(this)};_.removeAll=function zM(a){var b,c,d,e;jS.yR(a);e=this.size();if(e<a.size()){for(b=this.xb();b.Ab();){c=b.Bb();a.contains(c)&&b.Cb()}}else{for(d=a.xb();d.Ab();){c=d.Bb();this.remove(c)}}return e!=this.size()};fS.gG=YI(178);AS.AM=function AM(a){this.a=a};nH(138,178,KU,AS.AM);_.clear=function BM(){AS.tP(this.a)};_.contains=function CM(a){return AS.fN(this.a,a)};_.xb=function DM(){var a;a=new AS.SP((new AS.XP(this.a)).b);return new AS.GM(a)};_.remove=function EM(a){if(AS.fN(this.a,a)){AS.BP(this.a,a);return true}return false};_.size=function FM(){return this.a.c};fS.YF=YI(138);AS.GM=function GM(a){this.a=a};nH(139,1,{},AS.GM);_.Ab=function HM(){return AS.ML(this.a.a)};_.Bb=function IM(){var a;a=AS.QP(this.a);return a.Eb()};_.Cb=function JM(){AS.RP(this.a)};fS.XF=YI(139);AS.KM=function KM(a){var b;b=new AS.SP((new AS.XP(a.a)).b);return new AS.SM(b)};AS.LM=function LM(a){this.a=a};nH(105,174,{},AS.LM);_.clear=function MM(){AS.tP(this.a)};_.contains=function NM(a){return AS.aM(this.a,a)};_.xb=function OM(){return AS.KM(this)};_.size=function PM(){return this.a.c};fS.$F=YI(105);AS.QM=function QM(a){return AS.ML(a.a.a)};AS.RM=function RM(a){var b;b=AS.QP(a.a);return b.Fb()};AS.SM=function SM(a){this.a=a};nH(106,1,{},AS.SM);_.Ab=function TM(){return AS.QM(this)};_.Bb=function UM(){return AS.RM(this)};_.Cb=function VM(){AS.RP(this.a)};fS.ZF=YI(106);AS.WM=function WM(a){return a.c};AS.XM=function XM(a){return a.d};AS.YM=function YM(a,b){var c;c=a.d;a.d=b;return c};AS.ZM=function ZM(a,b){this.c=a;this.d=b};nH(63,1,{63:1,65:1});_.ab=function $M(a){var b;if(!AD(a,65)){return false}b=a;return AS.dP(this.c,b.Eb())&&AS.dP(this.d,b.Fb())};_.Eb=function _M(){return AS.WM(this)};_.Fb=function aN(){return AS.XM(this)};_.cb=function bN(){return AS.eP(this.c)^AS.eP(this.d)};_.db=function cN(){return this.c+'='+this.d};fS._F=YI(63);AS.dN=function dN(a,b){AS.ZM.call(this,a,b)};nH(64,63,{63:1,64:1,65:1},AS.dN);fS.aG=YI(64);AS.eN=function eN(a,b){var c,d;c=b.Eb();d=AS.vP(a,c);return !!d&&AS.dP(d.d,b.Fb())};AS.fN=function fN(a,b){return !!AS.vP(a,b)};AS.gN=function gN(a,b){return AS.jM(AS.vP(a,b))};AS.hN=function hN(a){return new AS.uN(a)};nH(177,176,{152:1});_.containsKey=function iN(a){return AS.fN(this,a)};_.Db=function jN(){return new AS.oN(this)};_.get=function kN(a){return AS.gN(this,a)};_.keySet=function lN(){return AS.hN(this)};fS.fG=YI(177);AS.mN=function mN(a){return new AS.SP(a.b)};AS.nN=function nN(a){return a.b.c};AS.oN=function oN(a){this.b=a};nH(102,178,KU,AS.oN);_.contains=function pN(a){return AD(a,65)&&AS.eN(this.b,a)};_.xb=function qN(){return AS.mN(this)};_.remove=function rN(a){var b;if(AD(a,65)){b=a;return AS.CP(this.b,b)}return false};_.size=function sN(){return AS.nN(this)};fS.cG=YI(102);AS.tN=function tN(a){var b;b=new AS.SP((new AS.XP(a.a)).b);return new AS.AN(b)};AS.uN=function uN(a){this.a=a};nH(103,178,KU,AS.uN);_.clear=function vN(){AS.tP(this.a)};_.contains=function wN(a){return AS.fN(this.a,a)};_.xb=function xN(){return AS.tN(this)};_.remove=function yN(a){if(AS.fN(this.a,a)){AS.BP(this.a,a);return true}return false};_.size=function zN(){return this.a.c};fS.eG=YI(103);AS.AN=function AN(a){this.a=a};nH(104,1,{},AS.AN);_.Ab=function BN(){return AS.ML(this.a.a)};_.Bb=function CN(){var a;a=AS.QP(this.a);return a.Eb()};_.Cb=function DN(){AS.RP(this.a)};fS.dG=YI(104);AS.EN=function EN(a){a.a=OC(fS.GF,BT,1,0,5,1)};AS.FN=function FN(a,b,c){jS.AR(b,a.a.length);jS.fR(a.a,b,c)};AS.GN=function GN(a,b){a.a[a.a.length]=b;return true};AS.HN=function HN(a,b,c){var d,e;jS.AR(b,a.a.length);d=c.toArray();e=d.length;if(e==0){return false}jS.gR(a.a,b,d);return true};AS.IN=function IN(a,b){var c,d;c=b.toArray();d=c.length;if(d==0){return false}jS.gR(a.a,a.a.length,c);return true};AS.JN=function JN(a){a.a=OC(fS.GF,BT,1,0,5,1)};AS.KN=function KN(a,b){return AS.NN(a,b,0)!=-1};AS.LN=function LN(a,b){jS.xR(b,a.a.length);return a.a[b]};AS.MN=function MN(a,b){return AS.NN(a,b,0)};AS.NN=function NN(a,b,c){for(;c<a.a.length;++c){if(AS.dP(b,a.a[c])){return c}}return -1};AS.ON=function ON(a){return new AS.tO(a)};AS.PN=function PN(a,b){return AS.QN(a,b,a.a.length-1)};AS.QN=function QN(a,b,c){for(;c>=0;--c){if(AS.dP(b,a.a[c])){return c}}return -1};AS.RN=function RN(a,b){var c;c=(jS.xR(b,a.a.length),a.a[b]);jS.hR(a.a,b,1);return c};AS.SN=function SN(a,b){var c;c=AS.NN(a,b,0);if(c==-1){return false}AS.RN(a,c);return true};AS.TN=function TN(a,b,c){var d;jS.BR(b,c,a.a.length);d=c-b;jS.hR(a.a,b,d)};AS.UN=function UN(a,b,c){var d;d=(jS.xR(b,a.a.length),a.a[b]);a.a[b]=c;return d};AS.VN=function VN(a){return a.a.length};AS.WN=function WN(a,b){AS.QO(a.a,a.a.length,b)};AS.XN=function XN(a){return jS.bR(a.a,a.a.length)};AS.YN=function YN(a,b){var c,d,e;e=a.a.length;b.length<e&&(b=(d=jS.dR(e),jS.kR(d,b)));for(c=0;c<e;++c){SC(b,c,a.a[c])}b.length>e&&fS.RC(b,e,null);return b};AS.ZN=function ZN(){AS.EN(this)};nH(16,175,{4:1,80:1},AS.ZN);_.addAtIndex=function $N(a,b){AS.FN(this,a,b)};_.add=function _N(a){return AS.GN(this,a)};_.addAllAtIndex=function aO(a,b){return AS.HN(this,a,b)};_.addAll=function bO(a){return AS.IN(this,a)};_.clear=function cO(){AS.JN(this)};_.contains=function dO(a){return AS.KN(this,a)};_.getAtIndex=function eO(a){return AS.LN(this,a)};_.indexOf=function fO(a){return AS.MN(this,a)};_.isEmpty=function gO(){return this.a.length==0};_.xb=function hO(){return AS.ON(this)};_.lastIndexOf=function iO(a){return AS.PN(this,a)};_.removeAtIndex=function jO(a){return AS.RN(this,a)};_.remove=function kO(a){return AS.SN(this,a)};_.zb=function lO(a,b){AS.TN(this,a,b)};_.setAtIndex=function mO(a,b){return AS.UN(this,a,b)};_.size=function nO(){return AS.VN(this)};_.toArray=function oO(){return AS.XN(this)};_.yb=function pO(a){return AS.YN(this,a)};fS.iG=YI(16);AS.qO=function qO(a){};AS.rO=function rO(a){return a.a<a.c.a.length};AS.sO=function sO(a){jS.wR(a.a<a.c.a.length);a.b=a.a++;return a.c.a[a.b]};AS.tO=function tO(a){this.c=a;AS.qO(this)};nH(21,1,{},AS.tO);_.Ab=function uO(){return AS.rO(this)};_.Bb=function vO(){return AS.sO(this)};_.Cb=function wO(){jS.CR(this.b!=-1);AS.RN(this.c,this.a=this.b);this.b=-1};_.a=0;_.b=-1;fS.hG=YI(21);AS.xO=function xO(a,b){var c,d;c=(d=jS.jR(a,0,b),jS.kR(d,a));jS.iR(c,b);return c};AS.yO=function yO(a,b){jS.vR(b);return AS.AO(a,OC(fS.OD,YS,5,b,15,1),b)};AS.zO=function zO(a,b){jS.vR(b);return AS.xO(a,b)};AS.AO=function AO(a,b,c){var d,e;e=jS.eR(a);d=c<e?c:e;jS.cR(a,0,b,0,d,true);return b};AS.BO=function BO(a){AS.EO(a,a.length)};AS.CO=function CO(a){AS.FO(a,a.length,-1)};AS.DO=function DO(a){AS.GO(a,a.length)};AS.EO=function EO(a,b){var c;for(c=0;c<b;++c){a[c]=-1}};AS.FO=function FO(a,b,c){var d;for(d=0;d<b;++d){a[d]=c}};AS.GO=function GO(a,b){var c;for(c=0;c<b;++c){a[c]=0}};AS.HO=function HO(a,b){var c;for(c=0;c<b;++c){a[c]=false}};AS.IO=function IO(a){var b,c,d,e;e=1;for(c=0,d=a.length;c<d;++c){b=a[c];e=31*e+(b!=null?gS.yc(b):0);e=e|0}return e};AS.JO=function JO(a,b,c,d){var e,f,g;for(e=b+1;e<c;++e){for(f=e;f>b&&d.eb(a[f-1],a[f])>0;--f){g=a[f];fS.RC(a,f,a[f-1]);fS.RC(a,f-1,g)}}};AS.KO=function KO(a,b,c,d,e,f,g,h){var i;i=c;while(f<g){i>=d||b<c&&h.eb(a[b],a[i])<=0?SC(e,f++,a[b++]):SC(e,f++,a[i++])}};AS.LO=function LO(a,b,c,d){var e;d=(AS.VO(),!d?AS.UO:d);e=jS.jR(a,b,c);AS.MO(e,a,b,c,-b,d)};AS.MO=function MO(a,b,c,d,e,f){var g,h,i,j;g=d-c;if(g<7){AS.JO(b,c,d,f);return}i=c+e;h=d+e;j=i+(h-i>>1);AS.MO(b,a,i,j,-e,f);AS.MO(b,a,j,h,-e,f);if(f.eb(a[j-1],a[j])<=0){while(c<d){SC(b,c++,a[i++])}return}AS.KO(a,i,j,h,b,c,d,f)};AS.NO=function NO(a,b){a.sort(b)};AS.OO=function OO(c){c.sort(function(a,b){return a-b})};AS.PO=function PO(a){AS.LO(a,0,a.length,null)};AS.QO=function QO(a,b,c){jS.uR(b,a.length);AS.LO(a,0,b,c)};AS.RO=function RO(a,b){AS.LO(a,0,a.length,b)};AS.SO=function SO(a){var b,c,d;d=0;for(c=a.xb();c.Ab();){b=c.Bb();d=d+(b!=null?gS.yc(b):0);d=d|0}return d};AS.TO=function TO(a){var b,c,d;d=1;for(c=a.xb();c.Ab();){b=c.Bb();d=31*d+(b!=null?gS.yc(b):0);d=d|0}return d};AS.VO=function VO(){AS.VO=pH;AS.UO=new AS.XO};AS.WO=function WO(a,b){return jS.yR(a),gS.DI(a,(jS.yR(b),b))};AS.XO=function XO(){};nH(146,1,FT,AS.XO);_.eb=function YO(a,b){return AS.WO(a,b)};_.ab=function ZO(a){return this===a};fS.jG=YI(146);AS.cP=function cP(){gS.GA.call(this)};nH(150,26,RS,AS.cP);fS.kG=YI(150);AS.dP=function dP(a,b){return ID(a)===ID(b)||a!=null&&gS.uc(a,b)};AS.eP=function eP(a){return a!=null?gS.yc(a):0};AS.iP=function iP(){AS.iP=pH;var a,b,c,d;AS.fP=OC(fS.MD,_S,5,25,15,1);AS.gP=OC(fS.MD,_S,5,33,15,1);d=HU;for(b=32;b>=0;b--){AS.gP[b]=d;d*=0.5}c=1;for(a=24;a>=0;a--){AS.fP[a]=c;c*=0.5}};AS.jP=function jP(a,b){var c,d;jS.tR(b>0);if((b&-b)==b){return JD(b*AS.kP(a)*4.6566128730773926E-10)}do{c=AS.kP(a);d=c%b}while(c-d+(b-1)<0);return JD(d)};AS.kP=function kP(a){var b,c,d,e,f,g;e=a.a*LU+a.b*1502;g=a.b*LU+11;b=$wnd.Math.floor(g*MU);e+=b;g-=b*VT;e%=VT;a.a=e;a.b=g;d=a.a*128;f=$wnd.Math.floor(a.b*AS.gP[31]);c=d+f;c>=2147483648&&(c-=4294967296);return c};AS.lP=function lP(a,b,c){a.a=b^1502;a.b=c^LU};AS.mP=function mP(){AS.iP();var a,b,c;c=AS.hP+++jS.lR();a=JD($wnd.Math.floor(c*MU))&ZS;b=JD(c-a*VT);this.a=a^1502;this.b=b^LU};AS.nP=function nP(a){AS.iP();AS.lP(this,cH(JG(_G(a,24),ZS)),cH(JG(a,ZS)))};nH(71,1,{},AS.mP,AS.nP);_.a=0;_.b=0;AS.hP=0;fS.lG=YI(71);AS.oP=function oP(a,b){!a.a?(a.a=new gS.TK(a.d)):gS.OK(a.a,a.b);gS.NK(a.a,b);return a};AS.pP=function pP(a){return !a.a?a.c:gS.GK(a.e).length==0?a.a.a:a.a.a+(''+a.e)};AS.qP=function qP(a,b){this.b=', ';this.d=a;this.e=b;this.c=this.d+(''+this.e)};nH(92,1,{},AS.qP);_.db=function rP(){return AS.pP(this)};fS.mG=YI(92);AS.sP=function sP(a){};AS.tP=function tP(a){a.b=null;a.c=0};AS.uP=function uP(a){return new AS.XP(a)};AS.vP=function vP(a,b){var c,d,e;e=a.b;while(e){c=a.a.eb(b,e.c);if(c==0){return e}d=c<0?0:1;e=e.a[d]}return null};AS.wP=function wP(a,b,c,d,e,f,g,h){var i,j;if(!d){return}i=d.a[0];!!i&&AS.wP(a,b,c,i,e,f,g,h);AS.xP(a,c,d.c,e,f,g,h)&&b.add(d);j=d.a[1];!!j&&AS.wP(a,b,c,j,e,f,g,h)};AS.xP=function xP(a,b,c,d,e,f,g){var h,i;if(b.Gb()&&(i=a.a.eb(c,d),i<0||!e&&i==0)){return false}if(b.Hb()&&(h=a.a.eb(c,f),h>0||!g&&h==0)){return false}return true};AS.yP=function yP(a,b,c,d){var e,f;if(!b){return c}else{e=a.a.eb(c.c,b.c);if(e==0){d.d=AS.YM(b,c.d);d.b=true;return b}f=e<0?0:1;b.a[f]=AS.yP(a,b.a[f],c,d);if(AS.zP(b.a[f])){if(AS.zP(b.a[1-f])){b.b=true;b.a[0].b=false;b.a[1].b=false}else{AS.zP(b.a[f].a[f])?(b=AS.GP(b,1-f)):AS.zP(b.a[f].a[1-f])&&(b=AS.FP(b,1-f))}}}return b};AS.zP=function zP(a){return !!a&&a.b};AS.AP=function AP(a,b,c){var d,e;d=new AS.$P(b,c);e=new AS.aQ;a.b=AS.yP(a,a.b,d,e);e.b||++a.c;a.b.b=false;return e.d};AS.BP=function BP(a,b){var c;c=new AS.aQ;AS.DP(a,b,c);return c.d};AS.CP=function CP(a,b){var c;c=new AS.aQ;c.c=true;c.d=b.Fb();return AS.DP(a,b.Eb(),c)};AS.DP=function DP(a,b,c){var d,e,f,g,h,i,j,k,l,m,n;if(!a.b){return false}g=null;m=null;i=new AS.$P(null,null);e=1;i.a[1]=a.b;l=i;while(l.a[e]){j=e;h=m;m=l;l=l.a[e];d=a.a.eb(b,l.c);e=d<0?0:1;d==0&&(!c.c||AS.dP(l.d,c.d))&&(g=l);if(!(!!l&&l.b)&&!AS.zP(l.a[e])){if(AS.zP(l.a[1-e])){m=m.a[j]=AS.GP(l,e)}else if(!AS.zP(l.a[1-e])){n=m.a[1-j];if(n){if(!AS.zP(n.a[1-j])&&!AS.zP(n.a[j])){m.b=false;n.b=true;l.b=true}else{f=h.a[1]==m?1:0;AS.zP(n.a[j])?(h.a[f]=AS.FP(m,j)):AS.zP(n.a[1-j])&&(h.a[f]=AS.GP(m,j));l.b=h.a[f].b=true;h.a[f].a[0].b=false;h.a[f].a[1].b=false}}}}}if(g){c.b=true;c.d=g.d;if(l!=g){k=new AS.$P(l.c,l.d);AS.EP(a,i,g,k);m==g&&(m=k)}m.a[m.a[1]==l?1:0]=l.a[!l.a[0]?1:0];--a.c}a.b=i.a[1];!!a.b&&(a.b.b=false);return c.b};AS.EP=function EP(a,b,c,d){var e,f;f=b;e=f.c==null||a.a.eb(c.c,f.c)>0?1:0;while(f.a[e]!=c){f=f.a[e];e=a.a.eb(c.c,f.c)>0?1:0}f.a[e]=d;d.b=c.b;d.a[0]=c.a[0];d.a[1]=c.a[1];c.a[0]=null;c.a[1]=null};AS.FP=function FP(a,b){var c;c=1-b;a.a[c]=AS.GP(a.a[c],c);return AS.GP(a,b)};AS.GP=function GP(a,b){var c,d;c=1-b;d=a.a[c];a.a[c]=d.a[b];d.a[b]=a;a.b=true;d.b=false;return d};AS.HP=function HP(a){return a.c};AS.IP=function IP(){AS.JP.call(this,null)};AS.JP=function JP(a){AS.sP(this);this.b=null;this.a=(AS.VO(),!a?AS.UO:a)};nH(42,177,{4:1,152:1,42:1},AS.IP,AS.JP);_.clear=function KP(){AS.tP(this)};_.Db=function LP(){return AS.uP(this)};_.put=function MP(a,b){return AS.AP(this,a,b)};_.remove=function NP(a){return AS.BP(this,a)};_.size=function OP(){return AS.HP(this)};_.c=0;fS.vG=YI(42);AS.PP=function PP(a){return AS.ML(a.a)};AS.QP=function QP(a){return a.b=AS.NL(a.a)};AS.RP=function RP(a){AS.OL(a.a);AS.CP(a.c,a.b);a.b=null};AS.SP=function SP(a){AS.TP.call(this,a,(AS.gQ(),AS.cQ))};AS.TP=function TP(a,b){var c;this.c=a;c=new AS.ZN;AS.wP(a,c,b,a.b,null,false,null,false);this.a=new AS.UL(c,0)};nH(31,1,{},AS.SP);_.Bb=function VP(){return AS.QP(this)};_.Ab=function UP(){return AS.PP(this)};_.Cb=function WP(){AS.RP(this)};fS.nG=YI(31);AS.XP=function XP(a){this.a=a;AS.oN.call(this,a)};nH(37,102,KU,AS.XP);_.clear=function YP(){AS.tP(this.a)};fS.oG=YI(37);AS.ZP=function ZP(a){a.a=OC(fS.pG,BT,49,2,0,1)};AS.$P=function $P(a,b){AS._P.call(this,a,b)};AS._P=function _P(a,b){AS.dN.call(this,a,b);AS.ZP(this);this.b=true};nH(49,64,{63:1,64:1,65:1,49:1},AS.$P);_.b=false;fS.pG=YI(49);AS.aQ=function aQ(){};nH(77,1,{},AS.aQ);_.db=function bQ(){return 'State: mv='+this.c+' value='+this.d+' done='+this.a+' found='+this.b};_.a=false;_.b=false;_.c=false;fS.qG=YI(77);AS.gQ=function gQ(){AS.gQ=pH;AS.cQ=new AS.hQ('All',0);AS.dQ=new AS.lQ;AS.eQ=new AS.nQ;AS.fQ=new AS.qQ};AS.hQ=function hQ(a,b){this.a=a;this.b=b};AS.kQ=function kQ(){AS.gQ();return WC(IC(fS.uG,1),IU,38,0,[AS.cQ,AS.dQ,AS.eQ,AS.fQ])};nH(38,46,NU,AS.hQ);_.Gb=function iQ(){return false};_.Hb=function jQ(){return false};fS.uG=ZI(38,AS.kQ);AS.lQ=function lQ(){AS.hQ.call(this,'Head',1)};nH(135,38,NU,AS.lQ);_.Hb=function mQ(){return true};fS.rG=ZI(135,null);AS.nQ=function nQ(){AS.hQ.call(this,'Range',2)};nH(136,38,NU,AS.nQ);_.Gb=function oQ(){return true};_.Hb=function pQ(){return true};fS.sG=ZI(136,null);AS.qQ=function qQ(){AS.hQ.call(this,'Tail',3)};nH(137,38,NU,AS.qQ);_.Gb=function rQ(){return true};fS.tG=ZI(137,null);AS.sQ=function sQ(a,b){return AS.AP(a.a,b,(gS.vI(),uI))==null};AS.tQ=function tQ(a){AS.tP(a.a)};AS.uQ=function uQ(a,b){return AS.fN(a.a,b)};AS.vQ=function vQ(a){this.a=new AS.JP(a)};nH(90,178,{4:1,55:1},AS.vQ);_.add=function wQ(a){return AS.sQ(this,a)};_.clear=function xQ(){AS.tQ(this)};_.contains=function yQ(a){return AS.uQ(this,a)};_.xb=function zQ(){var a;return a=new AS.SP((new AS.XP((new AS.uN(this.a)).a)).b),new AS.AN(a)};_.remove=function AQ(a){return AS.BP(this.a,a)!=null};_.size=function BQ(){return this.a.c};fS.wG=YI(90);AS.CQ=function CQ(a,b){return AS.GN(a.a,b)};AS.DQ=function DQ(a){return a.a.a.length};AS.EQ=function EQ(a,b){return AS.YN(a.a,b)};AS.FQ=function FQ(){this.a=new AS.ZN};AS.KQ=function KQ(a,b){if(a<0||a>=b){throw HG(new gS.sI)}};nH(140,175,{4:1,80:1},AS.FQ);_.addAtIndex=function GQ(a,b){AS.KQ(a,this.a.a.length+1);AS.FN(this.a,a,b)};_.add=function HQ(a){return AS.CQ(this,a)};_.addAllAtIndex=function IQ(a,b){AS.KQ(a,this.a.a.length+1);return AS.HN(this.a,a,b)};_.addAll=function JQ(a){return AS.IN(this.a,a)};_.clear=function LQ(){this.a.a=OC(fS.GF,BT,1,0,5,1)};_.contains=function MQ(a){return AS.NN(this.a,a,0)!=-1};_.containsAll=function NQ(a){return AS.iL(this.a,a)};_.getAtIndex=function OQ(a){AS.KQ(a,this.a.a.length);return AS.LN(this.a,a)};_.indexOf=function PQ(a){return AS.NN(this.a,a,0)};_.isEmpty=function QQ(){return this.a.a.length==0};_.xb=function RQ(){return new AS.tO(this.a)};_.lastIndexOf=function SQ(a){return AS.PN(this.a,a)};_.removeAtIndex=function TQ(a){AS.KQ(a,this.a.a.length);return AS.RN(this.a,a)};_.removeAll=function UQ(a){return AS.jL(this.a,a)};_.zb=function VQ(a,b){AS.TN(this.a,a,b)};_.setAtIndex=function WQ(a,b){AS.KQ(a,this.a.a.length);return AS.UN(this.a,a,b)};_.size=function XQ(){return AS.DQ(this)};_.subList=function YQ(a,b){return new AS.WL(this.a,a,b)};_.toArray=function ZQ(){return AS.XN(this.a)};_.yb=function $Q(a){return AS.EQ(this,a)};_.db=function _Q(){return AS.kL(this.a)};fS.xG=YI(140);jS.aR=function aR(a,b,c,d){Array.prototype.splice.apply(a,[b,c].concat(d))};jS.bR=function bR(a,b){var c;c=jS.jR(a,0,b);return jS.kR(c,a)};jS.cR=function cR(a,b,c,d,e,f){var g,h,i;if(ID(a)===ID(c)){a=jS.jR(a,b,b+e);b=0}for(h=b,i=b+e;h<i;){g=h+US<i?h+US:i;e=g-h;jS.aR(c,d,f?e:0,jS.jR(a,h,g));h=g;d+=e}};jS.dR=function dR(a){return new Array(a)};jS.eR=function eR(a){return a.length};jS.fR=function fR(a,b,c){a.splice(b,0,c)};jS.gR=function gR(a,b,c){jS.cR(c,0,a,b,c.length,false)};jS.hR=function hR(a,b,c){a.splice(b,c)};jS.iR=function iR(a,b){a.length=b};jS.jR=function jR(a,b,c){return a.slice(b,c)};jS.kR=function kR(a,b){return fS.XC(a,b)};jS.lR=function lR(){if(Date.now){return Date.now()}return (new Date).getTime()};jS.mR=function mR(){jS.mR=pH;new jS.sR;new jS.oR('ISO-LATIN-1');new jS.oR('ISO-8859-1')};jS.nR=function nR(a){yS._K.call(this,a)};nH(93,45,JU);fS.AG=YI(93);jS.oR=function oR(a){jS.nR.call(this,a)};nH(94,93,JU,jS.oR);fS.yG=YI(94);
jS.pR=function pR(a,b,c){var d,e,f,g,h,i,j,k;f=0;for(j=0;j<c;){++f;e=a[b+j];if((e&192)==128){throw HG(new gS.OJ(OU))}else if((e&128)==0){++j}else if((e&224)==192){j+=2}else if((e&240)==224){j+=3}else if((e&248)==240){j+=4}else{throw HG(new gS.OJ(OU))}if(j>c){throw HG(new gS.rI(OU))}}g=OC(fS.LD,FT,5,f,15,1);k=0;h=0;for(i=0;i<c;){e=a[b+i++];if((e&128)==0){h=1;e&=127}else if((e&224)==192){h=2;e&=31}else if((e&240)==224){h=3;e&=15}else if((e&248)==240){h=4;e&=7}else if((e&252)==248){h=5;e&=3}while(--h>0){d=a[b+i++];if((d&192)!=128){throw HG(new gS.OJ('Invalid UTF8 sequence at '+(b+i-1)+', byte='+gS.XJ(d,16)))}e=e<<6|d&63}k+=MI(e,g,k)}return g};jS.qR=function qR(a,b,c){if(c<128){a[b]=(c&127)<<24>>24;return 1}else if(c<iT){a[b++]=(c>>6&31|192)<<24>>24;a[b]=(c&63|128)<<24>>24;return 2}else if(c<SS){a[b++]=(c>>12&15|224)<<24>>24;a[b++]=(c>>6&63|128)<<24>>24;a[b]=(c&63|128)<<24>>24;return 3}else if(c<rT){a[b++]=(c>>18&7|240)<<24>>24;a[b++]=(c>>12&63|128)<<24>>24;a[b++]=(c>>6&63|128)<<24>>24;a[b]=(c&63|128)<<24>>24;return 4}else if(c<TT){a[b++]=(c>>24&3|248)<<24>>24;a[b++]=(c>>18&63|128)<<24>>24;a[b++]=(c>>12&63|128)<<24>>24;a[b++]=(c>>6&63|128)<<24>>24;a[b]=(c&63|128)<<24>>24;return 5}throw HG(new gS.OJ('Character out of range: '+c))};jS.rR=function rR(a){var b,c,d,e,f,g,h;g=gS.GK(a).length;b=0;for(f=0;f<g;){d=HI(a,f,gS.GK(a).length);f+=d>=SS?2:1;d<128?++b:d<iT?(b+=2):d<SS?(b+=3):d<rT?(b+=4):d<TT&&(b+=5)}c=OC(fS.KD,HT,5,b,15,1);h=0;for(e=0;e<g;){d=HI(a,e,gS.GK(a).length);e+=d>=SS?2:1;h+=jS.qR(c,h,d)}return c};jS.sR=function sR(){jS.nR.call(this,'UTF-8')};nH(123,93,JU,jS.sR);fS.zG=YI(123);jS.SR=function SR(){return OG};fS.LD=$I('C');fS.BG=$I('S');fS.OD=$I('I');fS.CG=$I('Z');fS.MD=$I('D');fS.ND=$I('F');fS.KD=$I('B');fS.PD=$I('J');oS.uu();_=sH('OCL.Molecule',oS.xu);_.FISCHER_PROJECTION_LIMIT=oS.mr;_.STEREO_ANGLE_LIMIT=oS.nr;_.VALIDATION_ERRORS_STEREO=oS.or;_.VALIDATION_ERROR_AMBIGUOUS_CONFIGURATION=oS.pr;_.VALIDATION_ERROR_ESR_CENTER_UNKNOWN=oS.qr;_.VALIDATION_ERROR_OVER_UNDER_SPECIFIED=oS.rr;_.cAtomCIPParityNone=oS.sr;_.cAtomCIPParityProblem=oS.tr;_.cAtomCIPParityRorM=oS.ur;_.cAtomCIPParitySorP=oS.vr;_.cAtomColorBlue=oS.wr;_.cAtomColorDarkGreen=oS.xr;_.cAtomColorDarkRed=oS.yr;_.cAtomColorGreen=oS.zr;_.cAtomColorMagenta=oS.Ar;_.cAtomColorNone=oS.Br;_.cAtomColorOrange=oS.Cr;_.cAtomColorRed=oS.Dr;_.cAtomLabel=oS.Er;_.cAtomParity1=oS.Fr;_.cAtomParity2=oS.Gr;_.cAtomParityIsPseudo=oS.Hr;_.cAtomParityNone=oS.Ir;_.cAtomParityUnknown=oS.Jr;_.cAtomQFAny=oS.Kr;_.cAtomQFAromState=oS.Lr;_.cAtomQFAromStateBits=oS.Mr;_.cAtomQFAromStateShift=oS.Nr;_.cAtomQFAromatic=oS.Or;_.cAtomQFCharge=oS.Pr;_.cAtomQFChargeBits=oS.Qr;_.cAtomQFChargeShift=oS.Rr;_.cAtomQFExcludeGroup=oS.Sr;_.cAtomQFFlatNitrogen=oS.Tr;_.cAtomQFHydrogen=oS.Ur;_.cAtomQFHydrogenBits=oS.Vr;_.cAtomQFHydrogenShift=oS.Wr;_.cAtomQFMatchStereo=oS.Xr;_.cAtomQFMoreNeighbours=oS.Yr;_.cAtomQFNarrowing=oS.Zr;_.cAtomQFNeighbourBits=oS.$r;_.cAtomQFNeighbourShift=oS._r;_.cAtomQFNeighbours=oS.as;_.cAtomQFNoMoreNeighbours=oS.bs;_.cAtomQFNoOfBits=oS.cs;_.cAtomQFNot0Hydrogen=oS.ds;_.cAtomQFNot0Neighbours=oS.es;_.cAtomQFNot0PiElectrons=oS.fs;_.cAtomQFNot1Hydrogen=oS.gs;_.cAtomQFNot1Neighbour=oS.hs;_.cAtomQFNot1PiElectron=oS.is;_.cAtomQFNot2Hydrogen=oS.js;_.cAtomQFNot2Neighbours=oS.ks;_.cAtomQFNot2PiElectrons=oS.ls;_.cAtomQFNot2RingBonds=oS.ms;_.cAtomQFNot3Hydrogen=oS.ns;_.cAtomQFNot3Neighbours=oS.os;_.cAtomQFNot3RingBonds=oS.ps;_.cAtomQFNot4Neighbours=oS.qs;_.cAtomQFNot4RingBonds=oS.rs;_.cAtomQFNotAromatic=oS.ss;_.cAtomQFNotChain=oS.ts;_.cAtomQFNotCharge0=oS.us;_.cAtomQFNotChargeNeg=oS.vs;_.cAtomQFNotChargePos=oS.ws;_.cAtomQFPiElectronBits=oS.xs;_.cAtomQFPiElectronShift=oS.ys;_.cAtomQFPiElectrons=oS.zs;_.cAtomQFRingSize=oS.As;_.cAtomQFRingSizeBits=oS.Bs;_.cAtomQFRingSizeShift=oS.Cs;_.cAtomQFRingState=oS.Ds;_.cAtomQFRingStateBits=oS.Es;_.cAtomQFRingStateShift=oS.Fs;_.cAtomQFSimpleFeatures=oS.Gs;_.cAtomRadicalState=oS.Hs;_.cAtomRadicalStateD=oS.Is;_.cAtomRadicalStateNone=oS.Js;_.cAtomRadicalStateS=oS.Ks;_.cAtomRadicalStateShift=oS.Ls;_.cAtomRadicalStateT=oS.Ms;_.cBondCIPParityEorP=oS.Ns;_.cBondCIPParityNone=oS.Os;_.cBondCIPParityProblem=oS.Ps;_.cBondCIPParityZorM=oS.Qs;_.cBondParityEor1=oS.Rs;_.cBondParityNone=oS.Ss;_.cBondParityUnknown=oS.Ts;_.cBondParityZor2=oS.Us;_.cBondQFAllFeatures=oS.Vs;_.cBondQFAromState=oS.Ws;_.cBondQFAromStateBits=oS.Xs;_.cBondQFAromStateShift=oS.Ys;_.cBondQFAromatic=oS.Zs;_.cBondQFBondTypes=oS.$s;_.cBondQFBondTypesBits=oS._s;_.cBondQFBondTypesShift=oS.at;_.cBondQFBridge=oS.bt;_.cBondQFBridgeBits=oS.ct;_.cBondQFBridgeMin=oS.dt;_.cBondQFBridgeMinBits=oS.et;_.cBondQFBridgeMinShift=oS.ft;_.cBondQFBridgeShift=oS.gt;_.cBondQFBridgeSpan=oS.ht;_.cBondQFBridgeSpanBits=oS.it;_.cBondQFBridgeSpanShift=oS.jt;_.cBondQFDelocalized=oS.kt;_.cBondQFDouble=oS.lt;_.cBondQFMatchStereo=oS.mt;_.cBondQFMetalLigand=oS.nt;_.cBondQFNarrowing=oS.ot;_.cBondQFNoOfBits=oS.pt;_.cBondQFNotAromatic=oS.qt;_.cBondQFNotRing=oS.rt;_.cBondQFRing=oS.st;_.cBondQFRingSize=oS.tt;_.cBondQFRingSizeBits=oS.ut;_.cBondQFRingSizeShift=oS.vt;_.cBondQFRingState=oS.wt;_.cBondQFRingStateBits=oS.xt;_.cBondQFRingStateShift=oS.yt;_.cBondQFSimpleFeatures=oS.zt;_.cBondQFSingle=oS.At;_.cBondQFTriple=oS.Bt;_.cBondTypeCross=oS.Ct;_.cBondTypeDeleted=oS.Dt;_.cBondTypeDelocalized=oS.Et;_.cBondTypeDouble=oS.Ft;_.cBondTypeDown=oS.Gt;_.cBondTypeIncreaseOrder=oS.Ht;_.cBondTypeMetalLigand=oS.It;_.cBondTypeSingle=oS.Jt;_.cBondTypeTriple=oS.Kt;_.cBondTypeUp=oS.Lt;_.cChiralityDiastereomers=oS.Mt;_.cChiralityEpimers=oS.Nt;_.cChiralityIsomerCountMask=oS.Ot;_.cChiralityKnownEnantiomer=oS.Pt;_.cChiralityMeso=oS.Qt;_.cChiralityNotChiral=oS.Rt;_.cChiralityRacemic=oS.St;_.cChiralityUnknown=oS.Tt;_.cChiralityUnknownEnantiomer=oS.Ut;_.cDefaultAtomValence=oS.Vt;_.cESRGroupBits=oS.Wt;_.cESRMaxGroups=oS.Xt;_.cESRTypeAbs=oS.Yt;_.cESRTypeAnd=oS.Zt;_.cESRTypeOr=oS.$t;_.cHelperBitCIP=oS._t;_.cHelperBitIncludeNitrogenParities=oS.au;_.cHelperBitNeighbours=oS.bu;_.cHelperBitParities=oS.cu;_.cHelperBitRings=oS.du;_.cHelperBitSymmetryDiastereotopic=oS.eu;_.cHelperBitSymmetryEnantiotopic=oS.fu;_.cHelperBitSymmetrySimple=oS.gu;_.cHelperBitsStereo=oS.hu;_.cHelperCIP=oS.iu;_.cHelperNeighbours=oS.ju;_.cHelperNone=oS.ku;_.cHelperParities=oS.lu;_.cHelperRings=oS.mu;_.cHelperSymmetryDiastereotopic=oS.nu;_.cHelperSymmetryEnantiotopic=oS.ou;_.cHelperSymmetrySimple=oS.pu;_.cMaxAtomicNo=oS.qu;_.cMaxConnAtoms=oS.ru;_.cRoundedMass=oS.su;_.fromIDCode=oS.kv;_.fromMolfile=oS.nv;_.fromSmiles=oS.ov;_.getAngle=oS.xv;_.getAngleDif=oS.yv;_.getAtomicNoFromLabel=oS.Yv;_.getDefaultAverageBondLength=oS.yw;_.isAtomicNoElectronegative=oS.yx;_.isAtomicNoElectropositive=oS.zx;_.setDefaultAverageBondLength=oS.Sy;_=sH('OCL.SDFileParser',oS.qz);_=sH('OCL.SSSearcher',oS.Bz);_=sH('OCL.SSSearcherWithIndex',oS.Hz);_.bitCount=oS.Iz;_.getHexStringFromIndex=oS.Kz;_.getIndexFromHexString=oS.Lz;_.getKeyIDCode=oS.Mz;_.getSimilarityAngleCosine=oS.Nz;_.getSimilarityTanimoto=oS.Oz;_=sH('OCL.Util',oS.Sz);_.getHoseCodesFromDiastereotopicID=oS.Tz;gS.vI();_=sH('java.lang.Boolean');_.$isInstance=BI;_=sH('java.lang.CharSequence');_.$isInstance=FI;_=sH('java.lang.Comparable');_.$isInstance=kJ;_=sH('java.lang.Double');_.$isInstance=xJ;_=sH('java.lang.Number');_.$isInstance=gS.mJ;_=sH('java.lang.String');_.$isInstance=yK;_=sH('java.lang.Throwable');_.of=BA;var eS=(iS.oB(),rB);var gwtOnLoad=gwtOnLoad=hH;fH(vH);iH('permProps',[[['locale','default'],['user.agent','safari']]]);$sendStats('moduleStartup', 'moduleEvalEnd');gwtOnLoad(__gwtModuleFunction.__errFn, __gwtModuleFunction.__moduleName, __gwtModuleFunction.__moduleBase, __gwtModuleFunction.__softPermutationId,__gwtModuleFunction.__computePropValue);$sendStats('moduleStartup', 'end');$gwt && $gwt.permProps && __gwtModuleFunction.__moduleStartupDone($gwt.permProps);


        // End GWT code

        var toReturn = $wnd["OCL"];

        toReturn.version = '5.2.9';

        return toReturn;
    }

    var isBrowser, globalEnv;

    if (typeof self !== 'undefined') { // Usual Browser Window or Web Worker
        isBrowser = true;
        globalEnv = self;
    } else if (typeof global !== 'undefined') { // Node.js
        isBrowser = false;
        globalEnv = global;
    } else { // Other environment (example: CouchDB)
        isBrowser = false;
        globalEnv = root;
    }

    var document = globalEnv.document || {};

    if (!document.compatMode) {
        document.compatMode = 'CSS1Compat';
    }

    var fakeWindow;
    if (isBrowser && !true) {
        fakeWindow = globalEnv;
    } else {
        fakeWindow = {};
        fakeWindow.setTimeout = globalEnv.setTimeout ? globalEnv.setTimeout.bind(globalEnv) : noop;
        fakeWindow.clearTimeout = globalEnv.clearTimeout ? globalEnv.clearTimeout.bind(globalEnv) : noop;
        fakeWindow.setInterval = globalEnv.setInterval ? globalEnv.setInterval.bind(globalEnv) : noop;
        fakeWindow.clearInterval = globalEnv.clearInterval ? globalEnv.clearInterval.bind(globalEnv) : noop;
        // required since GWT 2.8.0
        fakeWindow.Error = globalEnv.Error;
        fakeWindow.Math = globalEnv.Math;
        fakeWindow.RegExp = globalEnv.RegExp;
        fakeWindow.TypeError = globalEnv.TypeError;
    }

    if (!fakeWindow.document) {
        fakeWindow.document = document;
    }

    var exportedApi = getExports(fakeWindow);

    if (true) { // NodeJS
        fillExports(exportedApi, exports);
    } else if (typeof define === 'function' && define.amd) { // AMD
        define(function () {
            var exportsObj = {};
            fillExports(exportedApi, exportsObj);
            return exportsObj;
        });
    } else { // Global
        var path = ["OCL"];
        var l = path.length - 1;
        var obj = globalEnv;
        for (var i = 0; i < l; i++) {
            obj = obj[path[i]] || (obj[path[i]] = {});
        }
        obj[path[l]] = {};
        fillExports(exportedApi, obj[path[l]]);
    }

    function fillExports(obj, exports) {
        var keys = Object.keys(obj);
        for (var i = 0; i < keys.length; i++) {
            exports[keys[i]] = obj[keys[i]];
        }
    }

    function noop() {}

})(this);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)))

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(64);


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
	Papa Parse
	v4.3.3
	https://github.com/mholt/PapaParse
	License: MIT
*/
(function(root, factory)
{
	if (true)
	{
		// AMD. Register as an anonymous module.
		!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}
	else if (typeof module === 'object' && typeof exports !== 'undefined')
	{
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory();
	}
	else
	{
		// Browser globals (root is window)
		root.Papa = factory();
	}
}(this, function()
{
	'use strict';

	var global = (function () {
		// alternative method, similar to `Function('return this')()`
		// but without using `eval` (which is disabled when
		// using Content Security Policy).

		if (typeof self !== 'undefined') { return self; }
		if (typeof window !== 'undefined') { return window; }
		if (typeof global !== 'undefined') { return global; }

		// When running tests none of the above have been defined
		return {};
	})();


	var IS_WORKER = !global.document && !!global.postMessage,
		IS_PAPA_WORKER = IS_WORKER && /(\?|&)papaworker(=|&|$)/.test(global.location.search),
		LOADED_SYNC = false, AUTO_SCRIPT_PATH;
	var workers = {}, workerIdCounter = 0;

	var Papa = {};

	Papa.parse = CsvToJson;
	Papa.unparse = JsonToCsv;

	Papa.RECORD_SEP = String.fromCharCode(30);
	Papa.UNIT_SEP = String.fromCharCode(31);
	Papa.BYTE_ORDER_MARK = '\ufeff';
	Papa.BAD_DELIMITERS = ['\r', '\n', '"', Papa.BYTE_ORDER_MARK];
	Papa.WORKERS_SUPPORTED = !IS_WORKER && !!global.Worker;
	Papa.SCRIPT_PATH = null;	// Must be set by your code if you use workers and this lib is loaded asynchronously

	// Configurable chunk sizes for local and remote files, respectively
	Papa.LocalChunkSize = 1024 * 1024 * 10;	// 10 MB
	Papa.RemoteChunkSize = 1024 * 1024 * 5;	// 5 MB
	Papa.DefaultDelimiter = ',';			// Used if not specified and detection fails

	// Exposed for testing and development only
	Papa.Parser = Parser;
	Papa.ParserHandle = ParserHandle;
	Papa.NetworkStreamer = NetworkStreamer;
	Papa.FileStreamer = FileStreamer;
	Papa.StringStreamer = StringStreamer;
	Papa.ReadableStreamStreamer = ReadableStreamStreamer;

	if (global.jQuery)
	{
		var $ = global.jQuery;
		$.fn.parse = function(options)
		{
			var config = options.config || {};
			var queue = [];

			this.each(function(idx)
			{
				var supported = $(this).prop('tagName').toUpperCase() === 'INPUT'
								&& $(this).attr('type').toLowerCase() === 'file'
								&& global.FileReader;

				if (!supported || !this.files || this.files.length === 0)
					return true;	// continue to next input element

				for (var i = 0; i < this.files.length; i++)
				{
					queue.push({
						file: this.files[i],
						inputElem: this,
						instanceConfig: $.extend({}, config)
					});
				}
			});

			parseNextFile();	// begin parsing
			return this;		// maintains chainability


			function parseNextFile()
			{
				if (queue.length === 0)
				{
					if (isFunction(options.complete))
						options.complete();
					return;
				}

				var f = queue[0];

				if (isFunction(options.before))
				{
					var returned = options.before(f.file, f.inputElem);

					if (typeof returned === 'object')
					{
						if (returned.action === 'abort')
						{
							error('AbortError', f.file, f.inputElem, returned.reason);
							return;	// Aborts all queued files immediately
						}
						else if (returned.action === 'skip')
						{
							fileComplete();	// parse the next file in the queue, if any
							return;
						}
						else if (typeof returned.config === 'object')
							f.instanceConfig = $.extend(f.instanceConfig, returned.config);
					}
					else if (returned === 'skip')
					{
						fileComplete();	// parse the next file in the queue, if any
						return;
					}
				}

				// Wrap up the user's complete callback, if any, so that ours also gets executed
				var userCompleteFunc = f.instanceConfig.complete;
				f.instanceConfig.complete = function(results)
				{
					if (isFunction(userCompleteFunc))
						userCompleteFunc(results, f.file, f.inputElem);
					fileComplete();
				};

				Papa.parse(f.file, f.instanceConfig);
			}

			function error(name, file, elem, reason)
			{
				if (isFunction(options.error))
					options.error({name: name}, file, elem, reason);
			}

			function fileComplete()
			{
				queue.splice(0, 1);
				parseNextFile();
			}
		}
	}


	if (IS_PAPA_WORKER)
	{
		global.onmessage = workerThreadReceivedMessage;
	}
	else if (Papa.WORKERS_SUPPORTED)
	{
		AUTO_SCRIPT_PATH = getScriptPath();

		// Check if the script was loaded synchronously
		if (!document.body)
		{
			// Body doesn't exist yet, must be synchronous
			LOADED_SYNC = true;
		}
		else
		{
			document.addEventListener('DOMContentLoaded', function () {
				LOADED_SYNC = true;
			}, true);
		}
	}




	function CsvToJson(_input, _config)
	{
		_config = _config || {};
		var dynamicTyping = _config.dynamicTyping || false;
		if (isFunction(dynamicTyping)) {
			_config.dynamicTypingFunction = dynamicTyping;
			// Will be filled on first row call
			dynamicTyping = {};
		}
		_config.dynamicTyping = dynamicTyping;

		if (_config.worker && Papa.WORKERS_SUPPORTED)
		{
			var w = newWorker();

			w.userStep = _config.step;
			w.userChunk = _config.chunk;
			w.userComplete = _config.complete;
			w.userError = _config.error;

			_config.step = isFunction(_config.step);
			_config.chunk = isFunction(_config.chunk);
			_config.complete = isFunction(_config.complete);
			_config.error = isFunction(_config.error);
			delete _config.worker;	// prevent infinite loop

			w.postMessage({
				input: _input,
				config: _config,
				workerId: w.id
			});

			return;
		}

		var streamer = null;
		if (typeof _input === 'string')
		{
			if (_config.download)
				streamer = new NetworkStreamer(_config);
			else
				streamer = new StringStreamer(_config);
		}
		else if (_input.readable === true && isFunction(_input.read) && isFunction(_input.on))
		{
			streamer = new ReadableStreamStreamer(_config);
		}
		else if ((global.File && _input instanceof File) || _input instanceof Object)	// ...Safari. (see issue #106)
			streamer = new FileStreamer(_config);

		return streamer.stream(_input);
	}






	function JsonToCsv(_input, _config)
	{
		var _output = '';
		var _fields = [];

		// Default configuration

		/** whether to surround every datum with quotes */
		var _quotes = false;

		/** whether to write headers */
		var _writeHeader = true;

		/** delimiting character */
		var _delimiter = ',';

		/** newline character(s) */
		var _newline = '\r\n';

		/** quote character */
		var _quoteChar = '"';

		unpackConfig();

		var quoteCharRegex = new RegExp(_quoteChar, 'g');

		if (typeof _input === 'string')
			_input = JSON.parse(_input);

		if (_input instanceof Array)
		{
			if (!_input.length || _input[0] instanceof Array)
				return serialize(null, _input);
			else if (typeof _input[0] === 'object')
				return serialize(objectKeys(_input[0]), _input);
		}
		else if (typeof _input === 'object')
		{
			if (typeof _input.data === 'string')
				_input.data = JSON.parse(_input.data);

			if (_input.data instanceof Array)
			{
				if (!_input.fields)
					_input.fields =  _input.meta && _input.meta.fields;

				if (!_input.fields)
					_input.fields =  _input.data[0] instanceof Array
									? _input.fields
									: objectKeys(_input.data[0]);

				if (!(_input.data[0] instanceof Array) && typeof _input.data[0] !== 'object')
					_input.data = [_input.data];	// handles input like [1,2,3] or ['asdf']
			}

			return serialize(_input.fields || [], _input.data || []);
		}

		// Default (any valid paths should return before this)
		throw 'exception: Unable to serialize unrecognized input';


		function unpackConfig()
		{
			if (typeof _config !== 'object')
				return;

			if (typeof _config.delimiter === 'string'
				&& _config.delimiter.length === 1
				&& Papa.BAD_DELIMITERS.indexOf(_config.delimiter) === -1)
			{
				_delimiter = _config.delimiter;
			}

			if (typeof _config.quotes === 'boolean'
				|| _config.quotes instanceof Array)
				_quotes = _config.quotes;

			if (typeof _config.newline === 'string')
				_newline = _config.newline;

			if (typeof _config.quoteChar === 'string')
				_quoteChar = _config.quoteChar;

			if (typeof _config.header === 'boolean')
				_writeHeader = _config.header;
		}


		/** Turns an object's keys into an array */
		function objectKeys(obj)
		{
			if (typeof obj !== 'object')
				return [];
			var keys = [];
			for (var key in obj)
				keys.push(key);
			return keys;
		}

		/** The double for loop that iterates the data and writes out a CSV string including header row */
		function serialize(fields, data)
		{
			var csv = '';

			if (typeof fields === 'string')
				fields = JSON.parse(fields);
			if (typeof data === 'string')
				data = JSON.parse(data);

			var hasHeader = fields instanceof Array && fields.length > 0;
			var dataKeyedByField = !(data[0] instanceof Array);

			// If there a header row, write it first
			if (hasHeader && _writeHeader)
			{
				for (var i = 0; i < fields.length; i++)
				{
					if (i > 0)
						csv += _delimiter;
					csv += safe(fields[i], i);
				}
				if (data.length > 0)
					csv += _newline;
			}

			// Then write out the data
			for (var row = 0; row < data.length; row++)
			{
				var maxCol = hasHeader ? fields.length : data[row].length;

				for (var col = 0; col < maxCol; col++)
				{
					if (col > 0)
						csv += _delimiter;
					var colIdx = hasHeader && dataKeyedByField ? fields[col] : col;
					csv += safe(data[row][colIdx], col);
				}

				if (row < data.length - 1)
					csv += _newline;
			}

			return csv;
		}

		/** Encloses a value around quotes if needed (makes a value safe for CSV insertion) */
		function safe(str, col)
		{
			if (typeof str === 'undefined' || str === null)
				return '';

			str = str.toString().replace(quoteCharRegex, _quoteChar+_quoteChar);

			var needsQuotes = (typeof _quotes === 'boolean' && _quotes)
							|| (_quotes instanceof Array && _quotes[col])
							|| hasAny(str, Papa.BAD_DELIMITERS)
							|| str.indexOf(_delimiter) > -1
							|| str.charAt(0) === ' '
							|| str.charAt(str.length - 1) === ' ';

			return needsQuotes ? _quoteChar + str + _quoteChar : str;
		}

		function hasAny(str, substrings)
		{
			for (var i = 0; i < substrings.length; i++)
				if (str.indexOf(substrings[i]) > -1)
					return true;
			return false;
		}
	}

	/** ChunkStreamer is the base prototype for various streamer implementations. */
	function ChunkStreamer(config)
	{
		this._handle = null;
		this._paused = false;
		this._finished = false;
		this._input = null;
		this._baseIndex = 0;
		this._partialLine = '';
		this._rowCount = 0;
		this._start = 0;
		this._nextChunk = null;
		this.isFirstChunk = true;
		this._completeResults = {
			data: [],
			errors: [],
			meta: {}
		};
		replaceConfig.call(this, config);

		this.parseChunk = function(chunk)
		{
			// First chunk pre-processing
			if (this.isFirstChunk && isFunction(this._config.beforeFirstChunk))
			{
				var modifiedChunk = this._config.beforeFirstChunk(chunk);
				if (modifiedChunk !== undefined)
					chunk = modifiedChunk;
			}
			this.isFirstChunk = false;

			// Rejoin the line we likely just split in two by chunking the file
			var aggregate = this._partialLine + chunk;
			this._partialLine = '';

			var results = this._handle.parse(aggregate, this._baseIndex, !this._finished);

			if (this._handle.paused() || this._handle.aborted())
				return;

			var lastIndex = results.meta.cursor;

			if (!this._finished)
			{
				this._partialLine = aggregate.substring(lastIndex - this._baseIndex);
				this._baseIndex = lastIndex;
			}

			if (results && results.data)
				this._rowCount += results.data.length;

			var finishedIncludingPreview = this._finished || (this._config.preview && this._rowCount >= this._config.preview);

			if (IS_PAPA_WORKER)
			{
				global.postMessage({
					results: results,
					workerId: Papa.WORKER_ID,
					finished: finishedIncludingPreview
				});
			}
			else if (isFunction(this._config.chunk))
			{
				this._config.chunk(results, this._handle);
				if (this._paused)
					return;
				results = undefined;
				this._completeResults = undefined;
			}

			if (!this._config.step && !this._config.chunk) {
				this._completeResults.data = this._completeResults.data.concat(results.data);
				this._completeResults.errors = this._completeResults.errors.concat(results.errors);
				this._completeResults.meta = results.meta;
			}

			if (finishedIncludingPreview && isFunction(this._config.complete) && (!results || !results.meta.aborted))
				this._config.complete(this._completeResults, this._input);

			if (!finishedIncludingPreview && (!results || !results.meta.paused))
				this._nextChunk();

			return results;
		};

		this._sendError = function(error)
		{
			if (isFunction(this._config.error))
				this._config.error(error);
			else if (IS_PAPA_WORKER && this._config.error)
			{
				global.postMessage({
					workerId: Papa.WORKER_ID,
					error: error,
					finished: false
				});
			}
		};

		function replaceConfig(config)
		{
			// Deep-copy the config so we can edit it
			var configCopy = copy(config);
			configCopy.chunkSize = parseInt(configCopy.chunkSize);	// parseInt VERY important so we don't concatenate strings!
			if (!config.step && !config.chunk)
				configCopy.chunkSize = null;  // disable Range header if not streaming; bad values break IIS - see issue #196
			this._handle = new ParserHandle(configCopy);
			this._handle.streamer = this;
			this._config = configCopy;	// persist the copy to the caller
		}
	}


	function NetworkStreamer(config)
	{
		config = config || {};
		if (!config.chunkSize)
			config.chunkSize = Papa.RemoteChunkSize;
		ChunkStreamer.call(this, config);

		var xhr;

		if (IS_WORKER)
		{
			this._nextChunk = function()
			{
				this._readChunk();
				this._chunkLoaded();
			};
		}
		else
		{
			this._nextChunk = function()
			{
				this._readChunk();
			};
		}

		this.stream = function(url)
		{
			this._input = url;
			this._nextChunk();	// Starts streaming
		};

		this._readChunk = function()
		{
			if (this._finished)
			{
				this._chunkLoaded();
				return;
			}

			xhr = new XMLHttpRequest();

			if (this._config.withCredentials)
			{
				xhr.withCredentials = this._config.withCredentials;
			}

			if (!IS_WORKER)
			{
				xhr.onload = bindFunction(this._chunkLoaded, this);
				xhr.onerror = bindFunction(this._chunkError, this);
			}

			xhr.open('GET', this._input, !IS_WORKER);
			// Headers can only be set when once the request state is OPENED
			if (this._config.downloadRequestHeaders)
			{
				var headers = this._config.downloadRequestHeaders;

				for (var headerName in headers)
				{
					xhr.setRequestHeader(headerName, headers[headerName]);
				}
			}

			if (this._config.chunkSize)
			{
				var end = this._start + this._config.chunkSize - 1;	// minus one because byte range is inclusive
				xhr.setRequestHeader('Range', 'bytes='+this._start+'-'+end);
				xhr.setRequestHeader('If-None-Match', 'webkit-no-cache'); // https://bugs.webkit.org/show_bug.cgi?id=82672
			}

			try {
				xhr.send();
			}
			catch (err) {
				this._chunkError(err.message);
			}

			if (IS_WORKER && xhr.status === 0)
				this._chunkError();
			else
				this._start += this._config.chunkSize;
		}

		this._chunkLoaded = function()
		{
			if (xhr.readyState != 4)
				return;

			if (xhr.status < 200 || xhr.status >= 400)
			{
				this._chunkError();
				return;
			}

			this._finished = !this._config.chunkSize || this._start > getFileSize(xhr);
			this.parseChunk(xhr.responseText);
		}

		this._chunkError = function(errorMessage)
		{
			var errorText = xhr.statusText || errorMessage;
			this._sendError(errorText);
		}

		function getFileSize(xhr)
		{
			var contentRange = xhr.getResponseHeader('Content-Range');
			if (contentRange === null) { // no content range, then finish!
					return -1;
					}
			return parseInt(contentRange.substr(contentRange.lastIndexOf('/') + 1));
		}
	}
	NetworkStreamer.prototype = Object.create(ChunkStreamer.prototype);
	NetworkStreamer.prototype.constructor = NetworkStreamer;


	function FileStreamer(config)
	{
		config = config || {};
		if (!config.chunkSize)
			config.chunkSize = Papa.LocalChunkSize;
		ChunkStreamer.call(this, config);

		var reader, slice;

		// FileReader is better than FileReaderSync (even in worker) - see http://stackoverflow.com/q/24708649/1048862
		// But Firefox is a pill, too - see issue #76: https://github.com/mholt/PapaParse/issues/76
		var usingAsyncReader = typeof FileReader !== 'undefined';	// Safari doesn't consider it a function - see issue #105

		this.stream = function(file)
		{
			this._input = file;
			slice = file.slice || file.webkitSlice || file.mozSlice;

			if (usingAsyncReader)
			{
				reader = new FileReader();		// Preferred method of reading files, even in workers
				reader.onload = bindFunction(this._chunkLoaded, this);
				reader.onerror = bindFunction(this._chunkError, this);
			}
			else
				reader = new FileReaderSync();	// Hack for running in a web worker in Firefox

			this._nextChunk();	// Starts streaming
		};

		this._nextChunk = function()
		{
			if (!this._finished && (!this._config.preview || this._rowCount < this._config.preview))
				this._readChunk();
		}

		this._readChunk = function()
		{
			var input = this._input;
			if (this._config.chunkSize)
			{
				var end = Math.min(this._start + this._config.chunkSize, this._input.size);
				input = slice.call(input, this._start, end);
			}
			var txt = reader.readAsText(input, this._config.encoding);
			if (!usingAsyncReader)
				this._chunkLoaded({ target: { result: txt } });	// mimic the async signature
		}

		this._chunkLoaded = function(event)
		{
			// Very important to increment start each time before handling results
			this._start += this._config.chunkSize;
			this._finished = !this._config.chunkSize || this._start >= this._input.size;
			this.parseChunk(event.target.result);
		}

		this._chunkError = function()
		{
			this._sendError(reader.error);
		}

	}
	FileStreamer.prototype = Object.create(ChunkStreamer.prototype);
	FileStreamer.prototype.constructor = FileStreamer;


	function StringStreamer(config)
	{
		config = config || {};
		ChunkStreamer.call(this, config);

		var string;
		var remaining;
		this.stream = function(s)
		{
			string = s;
			remaining = s;
			return this._nextChunk();
		}
		this._nextChunk = function()
		{
			if (this._finished) return;
			var size = this._config.chunkSize;
			var chunk = size ? remaining.substr(0, size) : remaining;
			remaining = size ? remaining.substr(size) : '';
			this._finished = !remaining;
			return this.parseChunk(chunk);
		}
	}
	StringStreamer.prototype = Object.create(StringStreamer.prototype);
	StringStreamer.prototype.constructor = StringStreamer;


	function ReadableStreamStreamer(config)
	{
		config = config || {};

		ChunkStreamer.call(this, config);

		var queue = [];
		var parseOnData = true;

		this.stream = function(stream)
		{
			this._input = stream;

			this._input.on('data', this._streamData);
			this._input.on('end', this._streamEnd);
			this._input.on('error', this._streamError);
		}

		this._nextChunk = function()
		{
			if (queue.length)
			{
				this.parseChunk(queue.shift());
			}
			else
			{
				parseOnData = true;
			}
		}

		this._streamData = bindFunction(function(chunk)
		{
			try
			{
				queue.push(typeof chunk === 'string' ? chunk : chunk.toString(this._config.encoding));

				if (parseOnData)
				{
					parseOnData = false;
					this.parseChunk(queue.shift());
				}
			}
			catch (error)
			{
				this._streamError(error);
			}
		}, this);

		this._streamError = bindFunction(function(error)
		{
			this._streamCleanUp();
			this._sendError(error.message);
		}, this);

		this._streamEnd = bindFunction(function()
		{
			this._streamCleanUp();
			this._finished = true;
			this._streamData('');
		}, this);

		this._streamCleanUp = bindFunction(function()
		{
			this._input.removeListener('data', this._streamData);
			this._input.removeListener('end', this._streamEnd);
			this._input.removeListener('error', this._streamError);
		}, this);
	}
	ReadableStreamStreamer.prototype = Object.create(ChunkStreamer.prototype);
	ReadableStreamStreamer.prototype.constructor = ReadableStreamStreamer;


	// Use one ParserHandle per entire CSV file or string
	function ParserHandle(_config)
	{
		// One goal is to minimize the use of regular expressions...
		var FLOAT = /^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i;

		var self = this;
		var _stepCounter = 0;	// Number of times step was called (number of rows parsed)
		var _input;				// The input being parsed
		var _parser;			// The core parser being used
		var _paused = false;	// Whether we are paused or not
		var _aborted = false;	// Whether the parser has aborted or not
		var _delimiterError;	// Temporary state between delimiter detection and processing results
		var _fields = [];		// Fields are from the header row of the input, if there is one
		var _results = {		// The last results returned from the parser
			data: [],
			errors: [],
			meta: {}
		};

		if (isFunction(_config.step))
		{
			var userStep = _config.step;
			_config.step = function(results)
			{
				_results = results;

				if (needsHeaderRow())
					processResults();
				else	// only call user's step function after header row
				{
					processResults();

					// It's possbile that this line was empty and there's no row here after all
					if (_results.data.length === 0)
						return;

					_stepCounter += results.data.length;
					if (_config.preview && _stepCounter > _config.preview)
						_parser.abort();
					else
						userStep(_results, self);
				}
			};
		}

		/**
		 * Parses input. Most users won't need, and shouldn't mess with, the baseIndex
		 * and ignoreLastRow parameters. They are used by streamers (wrapper functions)
		 * when an input comes in multiple chunks, like from a file.
		 */
		this.parse = function(input, baseIndex, ignoreLastRow)
		{
			if (!_config.newline)
				_config.newline = guessLineEndings(input);

			_delimiterError = false;
			if (!_config.delimiter)
			{
				var delimGuess = guessDelimiter(input, _config.newline);
				if (delimGuess.successful)
					_config.delimiter = delimGuess.bestDelimiter;
				else
				{
					_delimiterError = true;	// add error after parsing (otherwise it would be overwritten)
					_config.delimiter = Papa.DefaultDelimiter;
				}
				_results.meta.delimiter = _config.delimiter;
			}
			else if(isFunction(_config.delimiter))
			{
				_config.delimiter = _config.delimiter(input);
				_results.meta.delimiter = _config.delimiter;
			}

			var parserConfig = copy(_config);
			if (_config.preview && _config.header)
				parserConfig.preview++;	// to compensate for header row

			_input = input;
			_parser = new Parser(parserConfig);
			_results = _parser.parse(_input, baseIndex, ignoreLastRow);
			processResults();
			return _paused ? { meta: { paused: true } } : (_results || { meta: { paused: false } });
		};

		this.paused = function()
		{
			return _paused;
		};

		this.pause = function()
		{
			_paused = true;
			_parser.abort();
			_input = _input.substr(_parser.getCharIndex());
		};

		this.resume = function()
		{
			_paused = false;
			self.streamer.parseChunk(_input);
		};

		this.aborted = function ()
		{
			return _aborted;
		};

		this.abort = function()
		{
			_aborted = true;
			_parser.abort();
			_results.meta.aborted = true;
			if (isFunction(_config.complete))
				_config.complete(_results);
			_input = '';
		};

		function processResults()
		{
			if (_results && _delimiterError)
			{
				addError('Delimiter', 'UndetectableDelimiter', 'Unable to auto-detect delimiting character; defaulted to \''+Papa.DefaultDelimiter+'\'');
				_delimiterError = false;
			}

			if (_config.skipEmptyLines)
			{
				for (var i = 0; i < _results.data.length; i++)
					if (_results.data[i].length === 1 && _results.data[i][0] === '')
						_results.data.splice(i--, 1);
			}

			if (needsHeaderRow())
				fillHeaderFields();

			return applyHeaderAndDynamicTyping();
		}

		function needsHeaderRow()
		{
			return _config.header && _fields.length === 0;
		}

		function fillHeaderFields()
		{
			if (!_results)
				return;
			for (var i = 0; needsHeaderRow() && i < _results.data.length; i++)
				for (var j = 0; j < _results.data[i].length; j++)
					_fields.push(_results.data[i][j]);
			_results.data.splice(0, 1);
		}

		function shouldApplyDynamicTyping(field) {
			// Cache function values to avoid calling it for each row
			if (_config.dynamicTypingFunction && _config.dynamicTyping[field] === undefined) {
				_config.dynamicTyping[field] = _config.dynamicTypingFunction(field);
			}
			return (_config.dynamicTyping[field] || _config.dynamicTyping) === true
		}

		function parseDynamic(field, value)
		{
			if (shouldApplyDynamicTyping(field))
			{
				if (value === 'true' || value === 'TRUE')
					return true;
				else if (value === 'false' || value === 'FALSE')
					return false;
				else
					return tryParseFloat(value);
			}
			return value;
		}

		function applyHeaderAndDynamicTyping()
		{
			if (!_results || (!_config.header && !_config.dynamicTyping))
				return _results;

			for (var i = 0; i < _results.data.length; i++)
			{
				var row = _config.header ? {} : [];

				for (var j = 0; j < _results.data[i].length; j++)
				{
					var field = j;
					var value = _results.data[i][j];

					if (_config.header)
						field = j >= _fields.length ? '__parsed_extra' : _fields[j];

					value = parseDynamic(field, value);

					if (field === '__parsed_extra')
					{
						row[field] = row[field] || [];
						row[field].push(value);
					}
					else
						row[field] = value;
				}

				_results.data[i] = row;

				if (_config.header)
				{
					if (j > _fields.length)
						addError('FieldMismatch', 'TooManyFields', 'Too many fields: expected ' + _fields.length + ' fields but parsed ' + j, i);
					else if (j < _fields.length)
						addError('FieldMismatch', 'TooFewFields', 'Too few fields: expected ' + _fields.length + ' fields but parsed ' + j, i);
				}
			}

			if (_config.header && _results.meta)
				_results.meta.fields = _fields;
			return _results;
		}

		function guessDelimiter(input, newline)
		{
			var delimChoices = [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP];
			var bestDelim, bestDelta, fieldCountPrevRow;

			for (var i = 0; i < delimChoices.length; i++)
			{
				var delim = delimChoices[i];
				var delta = 0, avgFieldCount = 0;
				fieldCountPrevRow = undefined;

				var preview = new Parser({
					delimiter: delim,
					newline: newline,
					preview: 10
				}).parse(input);

				for (var j = 0; j < preview.data.length; j++)
				{
					var fieldCount = preview.data[j].length;
					avgFieldCount += fieldCount;

					if (typeof fieldCountPrevRow === 'undefined')
					{
						fieldCountPrevRow = fieldCount;
						continue;
					}
					else if (fieldCount > 1)
					{
						delta += Math.abs(fieldCount - fieldCountPrevRow);
						fieldCountPrevRow = fieldCount;
					}
				}

				if (preview.data.length > 0)
					avgFieldCount /= preview.data.length;

				if ((typeof bestDelta === 'undefined' || delta < bestDelta)
					&& avgFieldCount > 1.99)
				{
					bestDelta = delta;
					bestDelim = delim;
				}
			}

			_config.delimiter = bestDelim;

			return {
				successful: !!bestDelim,
				bestDelimiter: bestDelim
			}
		}

		function guessLineEndings(input)
		{
			input = input.substr(0, 1024*1024);	// max length 1 MB

			var r = input.split('\r');

			var n = input.split('\n');

			var nAppearsFirst = (n.length > 1 && n[0].length < r[0].length);

			if (r.length === 1 || nAppearsFirst)
				return '\n';

			var numWithN = 0;
			for (var i = 0; i < r.length; i++)
			{
				if (r[i][0] === '\n')
					numWithN++;
			}

			return numWithN >= r.length / 2 ? '\r\n' : '\r';
		}

		function tryParseFloat(val)
		{
			var isNumber = FLOAT.test(val);
			return isNumber ? parseFloat(val) : val;
		}

		function addError(type, code, msg, row)
		{
			_results.errors.push({
				type: type,
				code: code,
				message: msg,
				row: row
			});
		}
	}





	/** The core parser implements speedy and correct CSV parsing */
	function Parser(config)
	{
		// Unpack the config object
		config = config || {};
		var delim = config.delimiter;
		var newline = config.newline;
		var comments = config.comments;
		var step = config.step;
		var preview = config.preview;
		var fastMode = config.fastMode;
		var quoteChar = config.quoteChar || '"';

		// Delimiter must be valid
		if (typeof delim !== 'string'
			|| Papa.BAD_DELIMITERS.indexOf(delim) > -1)
			delim = ',';

		// Comment character must be valid
		if (comments === delim)
			throw 'Comment character same as delimiter';
		else if (comments === true)
			comments = '#';
		else if (typeof comments !== 'string'
			|| Papa.BAD_DELIMITERS.indexOf(comments) > -1)
			comments = false;

		// Newline must be valid: \r, \n, or \r\n
		if (newline != '\n' && newline != '\r' && newline != '\r\n')
			newline = '\n';

		// We're gonna need these at the Parser scope
		var cursor = 0;
		var aborted = false;

		this.parse = function(input, baseIndex, ignoreLastRow)
		{
			// For some reason, in Chrome, this speeds things up (!?)
			if (typeof input !== 'string')
				throw 'Input must be a string';

			// We don't need to compute some of these every time parse() is called,
			// but having them in a more local scope seems to perform better
			var inputLen = input.length,
				delimLen = delim.length,
				newlineLen = newline.length,
				commentsLen = comments.length;
			var stepIsFunction = isFunction(step);

			// Establish starting state
			cursor = 0;
			var data = [], errors = [], row = [], lastCursor = 0;

			if (!input)
				return returnable();

			if (fastMode || (fastMode !== false && input.indexOf(quoteChar) === -1))
			{
				var rows = input.split(newline);
				for (var i = 0; i < rows.length; i++)
				{
					var row = rows[i];
					cursor += row.length;
					if (i !== rows.length - 1)
						cursor += newline.length;
					else if (ignoreLastRow)
						return returnable();
					if (comments && row.substr(0, commentsLen) === comments)
						continue;
					if (stepIsFunction)
					{
						data = [];
						pushRow(row.split(delim));
						doStep();
						if (aborted)
							return returnable();
					}
					else
						pushRow(row.split(delim));
					if (preview && i >= preview)
					{
						data = data.slice(0, preview);
						return returnable(true);
					}
				}
				return returnable();
			}

			var nextDelim = input.indexOf(delim, cursor);
			var nextNewline = input.indexOf(newline, cursor);
			var quoteCharRegex = new RegExp(quoteChar+quoteChar, 'g');

			// Parser loop
			for (;;)
			{
				// Field has opening quote
				if (input[cursor] === quoteChar)
				{
					// Start our search for the closing quote where the cursor is
					var quoteSearch = cursor;

					// Skip the opening quote
					cursor++;

					for (;;)
					{
						// Find closing quote
						var quoteSearch = input.indexOf(quoteChar, quoteSearch+1);

						if (quoteSearch === -1)
						{
							if (!ignoreLastRow) {
								// No closing quote... what a pity
								errors.push({
									type: 'Quotes',
									code: 'MissingQuotes',
									message: 'Quoted field unterminated',
									row: data.length,	// row has yet to be inserted
									index: cursor
								});
							}
							return finish();
						}

						if (quoteSearch === inputLen-1)
						{
							// Closing quote at EOF
							var value = input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar);
							return finish(value);
						}

						// If this quote is escaped, it's part of the data; skip it
						if (input[quoteSearch+1] === quoteChar)
						{
							quoteSearch++;
							continue;
						}

						if (input[quoteSearch+1] === delim)
						{
							// Closing quote followed by delimiter
							row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar));
							cursor = quoteSearch + 1 + delimLen;
							nextDelim = input.indexOf(delim, cursor);
							nextNewline = input.indexOf(newline, cursor);
							break;
						}

						if (input.substr(quoteSearch+1, newlineLen) === newline)
						{
							// Closing quote followed by newline
							row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar));
							saveRow(quoteSearch + 1 + newlineLen);
							nextDelim = input.indexOf(delim, cursor);	// because we may have skipped the nextDelim in the quoted field

							if (stepIsFunction)
							{
								doStep();
								if (aborted)
									return returnable();
							}

							if (preview && data.length >= preview)
								return returnable(true);

							break;
						}
					}

					continue;
				}

				// Comment found at start of new line
				if (comments && row.length === 0 && input.substr(cursor, commentsLen) === comments)
				{
					if (nextNewline === -1)	// Comment ends at EOF
						return returnable();
					cursor = nextNewline + newlineLen;
					nextNewline = input.indexOf(newline, cursor);
					nextDelim = input.indexOf(delim, cursor);
					continue;
				}

				// Next delimiter comes before next newline, so we've reached end of field
				if (nextDelim !== -1 && (nextDelim < nextNewline || nextNewline === -1))
				{
					row.push(input.substring(cursor, nextDelim));
					cursor = nextDelim + delimLen;
					nextDelim = input.indexOf(delim, cursor);
					continue;
				}

				// End of row
				if (nextNewline !== -1)
				{
					row.push(input.substring(cursor, nextNewline));
					saveRow(nextNewline + newlineLen);

					if (stepIsFunction)
					{
						doStep();
						if (aborted)
							return returnable();
					}

					if (preview && data.length >= preview)
						return returnable(true);

					continue;
				}

				break;
			}


			return finish();


			function pushRow(row)
			{
				data.push(row);
				lastCursor = cursor;
			}

			/**
			 * Appends the remaining input from cursor to the end into
			 * row, saves the row, calls step, and returns the results.
			 */
			function finish(value)
			{
				if (ignoreLastRow)
					return returnable();
				if (typeof value === 'undefined')
					value = input.substr(cursor);
				row.push(value);
				cursor = inputLen;	// important in case parsing is paused
				pushRow(row);
				if (stepIsFunction)
					doStep();
				return returnable();
			}

			/**
			 * Appends the current row to the results. It sets the cursor
			 * to newCursor and finds the nextNewline. The caller should
			 * take care to execute user's step function and check for
			 * preview and end parsing if necessary.
			 */
			function saveRow(newCursor)
			{
				cursor = newCursor;
				pushRow(row);
				row = [];
				nextNewline = input.indexOf(newline, cursor);
			}

			/** Returns an object with the results, errors, and meta. */
			function returnable(stopped)
			{
				return {
					data: data,
					errors: errors,
					meta: {
						delimiter: delim,
						linebreak: newline,
						aborted: aborted,
						truncated: !!stopped,
						cursor: lastCursor + (baseIndex || 0)
					}
				};
			}

			/** Executes the user's step function and resets data & errors. */
			function doStep()
			{
				step(returnable());
				data = [], errors = [];
			}
		};

		/** Sets the abort flag */
		this.abort = function()
		{
			aborted = true;
		};

		/** Gets the cursor position */
		this.getCharIndex = function()
		{
			return cursor;
		};
	}


	// If you need to load Papa Parse asynchronously and you also need worker threads, hard-code
	// the script path here. See: https://github.com/mholt/PapaParse/issues/87#issuecomment-57885358
	function getScriptPath()
	{
		var scripts = document.getElementsByTagName('script');
		return scripts.length ? scripts[scripts.length - 1].src : '';
	}

	function newWorker()
	{
		if (!Papa.WORKERS_SUPPORTED)
			return false;
		if (!LOADED_SYNC && Papa.SCRIPT_PATH === null)
			throw new Error(
				'Script path cannot be determined automatically when Papa Parse is loaded asynchronously. ' +
				'You need to set Papa.SCRIPT_PATH manually.'
			);
		var workerUrl = Papa.SCRIPT_PATH || AUTO_SCRIPT_PATH;
		// Append 'papaworker' to the search string to tell papaparse that this is our worker.
		workerUrl += (workerUrl.indexOf('?') !== -1 ? '&' : '?') + 'papaworker';
		var w = new global.Worker(workerUrl);
		w.onmessage = mainThreadReceivedMessage;
		w.id = workerIdCounter++;
		workers[w.id] = w;
		return w;
	}

	/** Callback when main thread receives a message */
	function mainThreadReceivedMessage(e)
	{
		var msg = e.data;
		var worker = workers[msg.workerId];
		var aborted = false;

		if (msg.error)
			worker.userError(msg.error, msg.file);
		else if (msg.results && msg.results.data)
		{
			var abort = function() {
				aborted = true;
				completeWorker(msg.workerId, { data: [], errors: [], meta: { aborted: true } });
			};

			var handle = {
				abort: abort,
				pause: notImplemented,
				resume: notImplemented
			};

			if (isFunction(worker.userStep))
			{
				for (var i = 0; i < msg.results.data.length; i++)
				{
					worker.userStep({
						data: [msg.results.data[i]],
						errors: msg.results.errors,
						meta: msg.results.meta
					}, handle);
					if (aborted)
						break;
				}
				delete msg.results;	// free memory ASAP
			}
			else if (isFunction(worker.userChunk))
			{
				worker.userChunk(msg.results, handle, msg.file);
				delete msg.results;
			}
		}

		if (msg.finished && !aborted)
			completeWorker(msg.workerId, msg.results);
	}

	function completeWorker(workerId, results) {
		var worker = workers[workerId];
		if (isFunction(worker.userComplete))
			worker.userComplete(results);
		worker.terminate();
		delete workers[workerId];
	}

	function notImplemented() {
		throw 'Not implemented.';
	}

	/** Callback when worker thread receives a message */
	function workerThreadReceivedMessage(e)
	{
		var msg = e.data;

		if (typeof Papa.WORKER_ID === 'undefined' && msg)
			Papa.WORKER_ID = msg.workerId;

		if (typeof msg.input === 'string')
		{
			global.postMessage({
				workerId: Papa.WORKER_ID,
				results: Papa.parse(msg.input, msg.config),
				finished: true
			});
		}
		else if ((global.File && msg.input instanceof File) || msg.input instanceof Object)	// thank you, Safari (see issue #106)
		{
			var results = Papa.parse(msg.input, msg.config);
			if (results)
				global.postMessage({
					workerId: Papa.WORKER_ID,
					results: results,
					finished: true
				});
		}
	}

	/** Makes a deep copy of an array or object (mostly) */
	function copy(obj)
	{
		if (typeof obj !== 'object')
			return obj;
		var cpy = obj instanceof Array ? [] : {};
		for (var key in obj)
			cpy[key] = copy(obj[key]);
		return cpy;
	}

	function bindFunction(f, self)
	{
		return function() { f.apply(self, arguments); };
	}

	function isFunction(func)
	{
		return typeof func === 'function';
	}

	return Papa;
}));


/***/ }),
/* 67 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function parse(rxn) {
    if (typeof rxn !== 'string') {
        throw new TypeError('Parameter "rxn" must be a string');
    }
    // we will find the delimiter in order to be much faster and not use regular expression
    var header = rxn.substr(0, 1000);
    var crlf = '\n';
    if (header.indexOf('\r\n') > -1) {
        crlf = '\r\n';
    } else if (header.indexOf('\r') > -1) {
        crlf = '\r';
    }

    var rxnParts = rxn.split(crlf + '$MOL' + crlf);

    var reagents=[];
    var products=[];

    var result={};
    result.reagents=reagents;
    result.products=products;


    // the first part is expected to contain the number of reagents and products

    // First part should start with $RXN
    // and the fifth line should contain the number of reagents and products
    if (rxnParts.length===0) throw new Error('file looks empty');

    var header=rxnParts[0];
    if (header.indexOf("$RXN")!=0) throw new Error('file does not start with $RXN');

    var lines=header.split(crlf);
    if (lines.length<5) throw new Error('incorrect number of lines in header');

    var numberReagents=lines[4].substring(0,3) >> 0;
    var numberProducts=lines[4].substring(3,6) >> 0;

    if (numberReagents+numberProducts!=rxnParts.length-1) throw new Error('not the correct number of molecules');

    for (var i=1; i<rxnParts.length; i++) {
        if (i<=numberReagents) {
            reagents.push(rxnParts[i]);
        } else {
            products.push(rxnParts[i]);
        }
    }
    return result;

}

module.exports = parse;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// options: an object

function parse(sdf, options) {
    // we will find the delimiter in order to be much faster and not use regular expression
    var header = sdf.substr(0, 1000);
    var crlf = '\n';
    if (header.indexOf('\r\n') > -1) {
        crlf = '\r\n';
    } else if (header.indexOf('\r') > -1) {
        crlf = '\r';
    }

    var sdfParts = sdf.split(crlf + '$$$$' + crlf);
    var molecules = [];
    var labels = {};

    var start = Date.now();

    var i = 0, ii = sdfParts.length,
        sdfPart, parts, molecule, j, jj,
        lines, from, to, label, k, kk;
    for (; i < ii; i++) {
        sdfPart = sdfParts[i];
        parts = sdfPart.split(crlf + '>');
        if (parts.length > 0 && parts[0].length > 5) {
            molecule = {};
            molecules.push(molecule);
            molecule.molfile = {type: 'mol2d', value: parts[0] + crlf};
            jj = parts.length;
            for (j = 1; j < jj; j++) {
                lines = parts[j].split(crlf);
                from = lines[0].indexOf('<');
                to = lines[0].indexOf('>');
                label = lines[0].substring(from + 1, to);
                if (labels[label]) {
                    labels[label].counter++;
                } else {
                    labels[label] = {counter: 1, isNumeric: true};
                }
                kk = lines.length - 1;
                for (k = 1; k < kk; k++) {
                    if (molecule[label]) {
                        molecule[label] += crlf + lines[k];
                    } else {
                        molecule[label] = lines[k];
                    }
                }
                if (labels[label].isNumeric) {
                    if (!isFinite(molecule[label])) {
                        labels[label].isNumeric = false;
                    }
                }
            }
        }
    }

    // all numeric fields should be converted to numbers
    var numericFields=[];
    for (var label in labels) {
        var currentLabel=labels[label];
        if (currentLabel.isNumeric) {
            currentLabel.minValue=Number.MAX_VALUE;
            currentLabel.maxValue=Number.MIN_VALUE;
            for (var j=0; j < molecules.length; j++) {
                if (molecules[j][label]) {
                    var value=parseFloat(molecules[j][label]);
                    molecules[j][label]=value;
                    if (value>currentLabel.maxValue) currentLabel.maxValue=value;
                    if (value<currentLabel.minValue) currentLabel.minValue=value;
                }
            }
        }
    }

    // we check that a label is in all the records
    for (var key in labels) {
        if (labels[key].counter==molecules.length) {
            labels[key].always=true;
        } else {
            labels[key].always=false;
        }
    }

    var statistics = [];
    for (var key in labels) {
        var statistic=labels[key];
        statistic.label=key;
        statistics.push(statistic);
    }

    return {
        time: Date.now() - start,
        molecules: molecules,
        labels: Object.keys(labels),
        statistics: statistics
    };

}

module.exports = parse;


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15), __webpack_require__(67)))

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const patterns = ['s', 'd', 't', 'q', 'quint', 'h', 'sept', 'o', 'n'];

module.exports.nmrJ = function nmrJ(Js, options = {}) {
    var jString = '';
    options = Object.assign({}, {separator: ', ', nbDecimal: 2}, options);
    let j, i;
    for (i = 0; i < Js.length; i++) {
        j = Js[i];
        if (j.length > 11) {
            j += options.separator;
        }
        jString += j.multiplicity + ' ' + j.coupling.toFixed(options.nbDecimal);
    }
    return jString;
};

module.exports.joinCoupling = function joinCoupling(signal, tolerance = 0.05) {
    var jc = signal.j;
    if (jc && jc.length > 0) {
        var cont = jc[0].assignment ? jc[0].assignment.length : 1;
        var pattern = '';
        var newNmrJs = [];
        var diaIDs = [];
        var atoms = [];
        jc.sort(function (a, b) {
            return b.coupling - a.coupling;
        });
        if (jc[0].diaID) {
            diaIDs = [jc[0].diaID];
        }
        if (jc[0].assignment) {
            atoms = jc[0].assignment;
        }
        for (var i = 0; i < jc.length - 1; i++) {
            if (Math.abs(jc[i].coupling - jc[i + 1].coupling) < tolerance) {
                cont += jc[i + 1].assignment ? jc[i + 1].assignment.length : 1;
                diaIDs.push(jc[i].diaID);
                atoms = atoms.concat(jc[i + 1].assignment);
            } else {
                let jTemp = {
                    coupling: Math.abs(jc[i].coupling),
                    multiplicity: patterns[cont]
                };
                if (diaIDs.length > 0) {
                    jTemp.diaID = diaIDs;
                }
                if (atoms.length > 0) {
                    jTemp.assignment = atoms;
                }
                newNmrJs.push(jTemp);
                if (jc[0].diaID) {
                    diaIDs = [jc[i].diaID];
                }
                if (jc[0].assignment) {
                    atoms = jc[i].assignment;
                }
                pattern += patterns[cont];
                cont = jc[i + 1].assignment ? jc[i + 1].assignment.length : 1;
            }
        }
        let jTemp = {
            coupling: Math.abs(jc[i].coupling),
            multiplicity: patterns[cont]
        };
        if (diaIDs.length > 0) {
            jTemp.diaID = diaIDs;
        }
        if (atoms.length > 0) {
            jTemp.assignment = atoms;
        }
        newNmrJs.push(jTemp);

        pattern += patterns[cont];
        signal.j = newNmrJs;

    } else if (signal.delta) {
        pattern = 's';
    } else {
        pattern = 'm';
    }
    return pattern;
};

module.exports.group = function group(signals, options = {}) {
    var i, k;
    for (i = 0; i < signals.length; i++) {
        var j = signals[i].j;
        if (j && j.lengthpublish > 0) {
            for (k = j.length - 2; k >= 0; k--) {
                for (var m = j.length - 1; m > k; m--) {
                    if (j[k].diaID === j[m].diaID &&
                        j[k].coupling === j[m].coupling &&
                        j[k].distance === j[m].distance) {
                        j[k].assignment = j[k].assignment.concat(j[m].assignment);
                        j.splice(m, 1);
                    }
                }
            }
        }
    }
    signals.sort((a, b) => {
        if (a.diaIDs[0] < b.diaIDs[0]) return -1;
        if (a.diaIDs[0] > b.diaIDs[0]) return 1;
        return 0;
    });

    for (i = signals.length - 2; i >= 0; i--) {
        if (signals[i].diaIDs[0] === signals[i + 1].diaIDs[0]) {
            signals[i].nbAtoms += signals[i + 1].nbAtoms;
            signals[i].atomIDs = signals[i].atomIDs.concat(signals[i + 1].atomIDs);
            signals.splice(i + 1, 1);
        }
    }
    for (i = 0; i < signals.length; i++) {
        j = signals[i].j;
        for (k = 0; k < j.length; k++) {
            j[k].multiplicity = patterns[j[k].assignment.length];
        }
        signals[i].multiplicity = module.exports.compilePattern(signals[i], options.tolerance);
    }
    return signals;
};


module.exports.compilePattern = function compilePattern(signal, tolerance = 0.05) {
    var jc = signal.j;
    var pattern = '';
    if (jc && jc.length > 0) {
        var cont = jc[0].assignment ? jc[0].assignment.length : 0;
        jc.sort(function (a, b) {
            return b.coupling - a.coupling;
        });
        for (var i = 0; i < jc.length - 1; i++) {
            if (Math.abs(jc[i].coupling - jc[i + 1].coupling) < tolerance) {
                cont += jc[i + 1].assignment ? jc[i + 1].assignment.length : 1;
            } else {
                pattern += patterns[cont];
                cont = jc[i + 1].assignment ? jc[i + 1].assignment.length : 1;
            }
        }
        pattern += patterns[cont];
    } else if (signal.delta) {
        pattern = 's';
    } else {
        pattern = 'm';
    }
    return pattern;
};



/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Check if `fn` is a function.
 *
 * @param {Function} fn
 * @return {Boolean}
 * @api private
 */
var isObject = __webpack_require__(6);

function isFunction(fn) {
  var tag = isObject(fn) ? Object.prototype.toString.call(fn) : '';
  return tag === '[object Function]';
}

module.exports = isFunction;


/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Module of mixed-in functions shared between node and client code
 */
var isObject = __webpack_require__(6);

/**
 * Expose `RequestBase`.
 */

module.exports = RequestBase;

/**
 * Initialize a new `RequestBase`.
 *
 * @api public
 */

function RequestBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in RequestBase.prototype) {
    obj[key] = RequestBase.prototype[key];
  }
  return obj;
}

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.clearTimeout = function _clearTimeout(){
  clearTimeout(this._timer);
  clearTimeout(this._responseTimeoutTimer);
  delete this._timer;
  delete this._responseTimeoutTimer;
  return this;
};

/**
 * Override default response body parser
 *
 * This function will be called to convert incoming data into request.body
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.parse = function parse(fn){
  this._parser = fn;
  return this;
};

/**
 * Set format of binary response body.
 * In browser valid formats are 'blob' and 'arraybuffer',
 * which return Blob and ArrayBuffer, respectively.
 *
 * In Node all values result in Buffer.
 *
 * Examples:
 *
 *      req.get('/')
 *        .responseType('blob')
 *        .end(callback);
 *
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.responseType = function(val){
  this._responseType = val;
  return this;
};

/**
 * Override default request body serializer
 *
 * This function will be called to convert data set via .send or .attach into payload to send
 *
 * @param {Function}
 * @api public
 */

RequestBase.prototype.serialize = function serialize(fn){
  this._serializer = fn;
  return this;
};

/**
 * Set timeouts.
 *
 * - response timeout is time between sending request and receiving the first byte of the response. Includes DNS and connection time.
 * - deadline is the time from start of the request to receiving response body in full. If the deadline is too short large files may not load at all on slow connections.
 *
 * Value of 0 or false means no timeout.
 *
 * @param {Number|Object} ms or {response, read, deadline}
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.timeout = function timeout(options){
  if (!options || 'object' !== typeof options) {
    this._timeout = options;
    this._responseTimeout = 0;
    return this;
  }

  for(var option in options) {
    switch(option) {
      case 'deadline':
        this._timeout = options.deadline;
        break;
      case 'response':
        this._responseTimeout = options.response;
        break;
      default:
        console.warn("Unknown timeout option", option);
    }
  }
  return this;
};

/**
 * Set number of retry attempts on error.
 *
 * Failed requests will be retried 'count' times if timeout or err.code >= 500.
 *
 * @param {Number} count
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.retry = function retry(count){
  // Default to 1 if no count passed or true
  if (arguments.length === 0 || count === true) count = 1;
  if (count <= 0) count = 0;
  this._maxRetries = count;
  this._retries = 0;
  return this;
};

/**
 * Retry request
 *
 * @return {Request} for chaining
 * @api private
 */

RequestBase.prototype._retry = function() {
  this.clearTimeout();

  // node
  if (this.req) {
    this.req = null;
    this.req = this.request();
  }

  this._aborted = false;
  this.timedout = false;

  return this._end();
};

/**
 * Promise support
 *
 * @param {Function} resolve
 * @param {Function} [reject]
 * @return {Request}
 */

RequestBase.prototype.then = function then(resolve, reject) {
  if (!this._fullfilledPromise) {
    var self = this;
    if (this._endCalled) {
      console.warn("Warning: superagent request was sent twice, because both .end() and .then() were called. Never call .end() if you use promises");
    }
    this._fullfilledPromise = new Promise(function(innerResolve, innerReject){
      self.end(function(err, res){
        if (err) innerReject(err); else innerResolve(res);
      });
    });
  }
  return this._fullfilledPromise.then(resolve, reject);
}

RequestBase.prototype.catch = function(cb) {
  return this.then(undefined, cb);
};

/**
 * Allow for extension
 */

RequestBase.prototype.use = function use(fn) {
  fn(this);
  return this;
}

RequestBase.prototype.ok = function(cb) {
  if ('function' !== typeof cb) throw Error("Callback required");
  this._okCallback = cb;
  return this;
};

RequestBase.prototype._isResponseOK = function(res) {
  if (!res) {
    return false;
  }

  if (this._okCallback) {
    return this._okCallback(res);
  }

  return res.status >= 200 && res.status < 300;
};


/**
 * Get request header `field`.
 * Case-insensitive.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

RequestBase.prototype.get = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Get case-insensitive header `field` value.
 * This is a deprecated internal API. Use `.get(field)` instead.
 *
 * (getHeader is no longer used internally by the superagent code base)
 *
 * @param {String} field
 * @return {String}
 * @api private
 * @deprecated
 */

RequestBase.prototype.getHeader = RequestBase.prototype.get;

/**
 * Set header `field` to `val`, or multiple fields with one object.
 * Case-insensitive.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 * Case-insensitive.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 */
RequestBase.prototype.unset = function(field){
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Write the field `name` and `val`, or multiple fields with one object
 * for "multipart/form-data" request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 *
 * request.post('/upload')
 *   .field({ foo: 'bar', baz: 'qux' })
 *   .end(callback);
 * ```
 *
 * @param {String|Object} name
 * @param {String|Blob|File|Buffer|fs.ReadStream} val
 * @return {Request} for chaining
 * @api public
 */
RequestBase.prototype.field = function(name, val) {

  // name should be either a string or an object.
  if (null === name ||  undefined === name) {
    throw new Error('.field(name, val) name can not be empty');
  }

  if (this._data) {
    console.error(".field() can't be used if .send() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObject(name)) {
    for (var key in name) {
      this.field(key, name[key]);
    }
    return this;
  }

  if (Array.isArray(val)) {
    for (var i in val) {
      this.field(name, val[i]);
    }
    return this;
  }

  // val should be defined now
  if (null === val || undefined === val) {
    throw new Error('.field(name, val) val can not be empty');
  }
  if ('boolean' === typeof val) {
    val = '' + val;
  }
  this._getFormData().append(name, val);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */
RequestBase.prototype.abort = function(){
  if (this._aborted) {
    return this;
  }
  this._aborted = true;
  this.xhr && this.xhr.abort(); // browser
  this.req && this.req.abort(); // node
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

RequestBase.prototype.withCredentials = function(on){
  // This is browser-only functionality. Node side is no-op.
  if(on==undefined) on = true;
  this._withCredentials = on;
  return this;
};

/**
 * Set the max redirects to `n`. Does noting in browser XHR implementation.
 *
 * @param {Number} n
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.redirects = function(n){
  this._maxRedirects = n;
  return this;
};

/**
 * Convert to a plain javascript object (not JSON string) of scalar properties.
 * Note as this method is designed to return a useful non-this value,
 * it cannot be chained.
 *
 * @return {Object} describing method, url, and data of this request
 * @api public
 */

RequestBase.prototype.toJSON = function(){
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header
  };
};


/**
 * Send `data` as the request body, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
 *      request.post('/user')
 *        .send('name=tobi')
 *        .send('species=ferret')
 *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.send = function(data){
  var isObj = isObject(data);
  var type = this._header['content-type'];

  if (this._formData) {
    console.error(".send() can't be used if .attach() or .field() is used. Please use only .send() or only .field() & .attach()");
  }

  if (isObj && !this._data) {
    if (Array.isArray(data)) {
      this._data = [];
    } else if (!this._isHost(data)) {
      this._data = {};
    }
  } else if (data && this._data && this._isHost(this._data)) {
    throw Error("Can't merge these send calls");
  }

  // merge
  if (isObj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    // default to x-www-form-urlencoded
    if (!type) this.type('form');
    type = this._header['content-type'];
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!isObj || this._isHost(data)) {
    return this;
  }

  // default to json
  if (!type) this.type('json');
  return this;
};


/**
 * Sort `querystring` by the sort function
 *
 *
 * Examples:
 *
 *       // default order
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery()
 *         .end(callback)
 *
 *       // customized sort function
 *       request.get('/user')
 *         .query('name=Nick')
 *         .query('search=Manny')
 *         .sortQuery(function(a, b){
 *           return a.length - b.length;
 *         })
 *         .end(callback)
 *
 *
 * @param {Function} sort
 * @return {Request} for chaining
 * @api public
 */

RequestBase.prototype.sortQuery = function(sort) {
  // _sort default to true but otherwise can be a function or boolean
  this._sort = typeof sort === 'undefined' ? true : sort;
  return this;
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

RequestBase.prototype._timeoutError = function(reason, timeout, errno){
  if (this._aborted) {
    return;
  }
  var err = new Error(reason + timeout + 'ms exceeded');
  err.timeout = timeout;
  err.code = 'ECONNABORTED';
  err.errno = errno;
  this.timedout = true;
  this.abort();
  this.callback(err);
};

RequestBase.prototype._setTimeouts = function() {
  var self = this;

  // deadline
  if (this._timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self._timeoutError('Timeout of ', self._timeout, 'ETIME');
    }, this._timeout);
  }
  // response timeout
  if (this._responseTimeout && !this._responseTimeoutTimer) {
    this._responseTimeoutTimer = setTimeout(function(){
      self._timeoutError('Response timeout of ', self._responseTimeout, 'ETIMEDOUT');
    }, this._responseTimeout);
  }
}


/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Module dependencies.
 */

var utils = __webpack_require__(76);

/**
 * Expose `ResponseBase`.
 */

module.exports = ResponseBase;

/**
 * Initialize a new `ResponseBase`.
 *
 * @api public
 */

function ResponseBase(obj) {
  if (obj) return mixin(obj);
}

/**
 * Mixin the prototype properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in ResponseBase.prototype) {
    obj[key] = ResponseBase.prototype[key];
  }
  return obj;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

ResponseBase.prototype.get = function(field){
    return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

ResponseBase.prototype._setHeaderProperties = function(header){
    // TODO: moar!
    // TODO: make this a util

    // content-type
    var ct = header['content-type'] || '';
    this.type = utils.type(ct);

    // params
    var params = utils.params(ct);
    for (var key in params) this[key] = params[key];

    this.links = {};

    // links
    try {
        if (header.link) {
            this.links = utils.parseLinks(header.link);
        }
    } catch (err) {
        // ignore
    }
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

ResponseBase.prototype._setStatusProperties = function(status){
    var type = status / 100 | 0;

    // status / class
    this.status = this.statusCode = status;
    this.statusType = type;

    // basics
    this.info = 1 == type;
    this.ok = 2 == type;
    this.redirect = 3 == type;
    this.clientError = 4 == type;
    this.serverError = 5 == type;
    this.error = (4 == type || 5 == type)
        ? this.toError()
        : false;

    // sugar
    this.accepted = 202 == status;
    this.noContent = 204 == status;
    this.badRequest = 400 == status;
    this.unauthorized = 401 == status;
    this.notAcceptable = 406 == status;
    this.forbidden = 403 == status;
    this.notFound = 404 == status;
};


/***/ }),
/* 75 */
/***/ (function(module, exports) {

var ERROR_CODES = [
  'ECONNRESET',
  'ETIMEDOUT',
  'EADDRINFO',
  'ESOCKETTIMEDOUT'
];

/**
 * Determine if a request should be retried.
 * (Borrowed from segmentio/superagent-retry)
 *
 * @param {Error} err
 * @param {Response} [res]
 * @returns {Boolean}
 */
module.exports = function shouldRetry(err, res) {
  if (err && err.code && ~ERROR_CODES.indexOf(err.code)) return true;
  if (res && res.status && res.status >= 500) return true;
  // Superagent timeout
  if (err && 'timeout' in err && err.code == 'ECONNABORTED') return true;
  if (err && 'crossDomain' in err) return true;
  return false;
};


/***/ }),
/* 76 */
/***/ (function(module, exports) {


/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

exports.type = function(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.params = function(str){
  return str.split(/ *; */).reduce(function(obj, str){
    var parts = str.split(/ *= */);
    var key = parts.shift();
    var val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Parse Link header fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

exports.parseLinks = function(str){
  return str.split(/ *, */).reduce(function(obj, str){
    var parts = str.split(/ *; */);
    var url = parts[0].slice(1, -1);
    var rel = parts[1].split(/ *= */)[1].slice(1, -1);
    obj[rel] = url;
    return obj;
  }, {});
};

/**
 * Strip content related fields from `header`.
 *
 * @param {Object} header
 * @return {Object} header
 * @api private
 */

exports.cleanHeader = function(header, shouldStripCookie){
  delete header['content-type'];
  delete header['content-length'];
  delete header['transfer-encoding'];
  delete header['host'];
  if (shouldStripCookie) {
    delete header['cookie'];
  }
  return header;
};

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(70);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;


/***/ })
/******/ ]);
});