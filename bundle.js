(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
(function (process){(function (){
// 'path' module extracted from Node.js v8.11.1 (only the posix part)
// transplited with Babel

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

function assertPath(path) {
  if (typeof path !== 'string') {
    throw new TypeError('Path must be a string. Received ' + JSON.stringify(path));
  }
}

// Resolves . and .. elements in a path with directory names
function normalizeStringPosix(path, allowAboveRoot) {
  var res = '';
  var lastSegmentLength = 0;
  var lastSlash = -1;
  var dots = 0;
  var code;
  for (var i = 0; i <= path.length; ++i) {
    if (i < path.length)
      code = path.charCodeAt(i);
    else if (code === 47 /*/*/)
      break;
    else
      code = 47 /*/*/;
    if (code === 47 /*/*/) {
      if (lastSlash === i - 1 || dots === 1) {
        // NOOP
      } else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || lastSegmentLength !== 2 || res.charCodeAt(res.length - 1) !== 46 /*.*/ || res.charCodeAt(res.length - 2) !== 46 /*.*/) {
          if (res.length > 2) {
            var lastSlashIndex = res.lastIndexOf('/');
            if (lastSlashIndex !== res.length - 1) {
              if (lastSlashIndex === -1) {
                res = '';
                lastSegmentLength = 0;
              } else {
                res = res.slice(0, lastSlashIndex);
                lastSegmentLength = res.length - 1 - res.lastIndexOf('/');
              }
              lastSlash = i;
              dots = 0;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSegmentLength = 0;
            lastSlash = i;
            dots = 0;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0)
            res += '/..';
          else
            res = '..';
          lastSegmentLength = 2;
        }
      } else {
        if (res.length > 0)
          res += '/' + path.slice(lastSlash + 1, i);
        else
          res = path.slice(lastSlash + 1, i);
        lastSegmentLength = i - lastSlash - 1;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === 46 /*.*/ && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}

function _format(sep, pathObject) {
  var dir = pathObject.dir || pathObject.root;
  var base = pathObject.base || (pathObject.name || '') + (pathObject.ext || '');
  if (!dir) {
    return base;
  }
  if (dir === pathObject.root) {
    return dir + base;
  }
  return dir + sep + base;
}

var posix = {
  // path.resolve([from ...], to)
  resolve: function resolve() {
    var resolvedPath = '';
    var resolvedAbsolute = false;
    var cwd;

    for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
      var path;
      if (i >= 0)
        path = arguments[i];
      else {
        if (cwd === undefined)
          cwd = process.cwd();
        path = cwd;
      }

      assertPath(path);

      // Skip empty entries
      if (path.length === 0) {
        continue;
      }

      resolvedPath = path + '/' + resolvedPath;
      resolvedAbsolute = path.charCodeAt(0) === 47 /*/*/;
    }

    // At this point the path should be resolved to a full absolute path, but
    // handle relative paths to be safe (might happen when process.cwd() fails)

    // Normalize the path
    resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);

    if (resolvedAbsolute) {
      if (resolvedPath.length > 0)
        return '/' + resolvedPath;
      else
        return '/';
    } else if (resolvedPath.length > 0) {
      return resolvedPath;
    } else {
      return '.';
    }
  },

  normalize: function normalize(path) {
    assertPath(path);

    if (path.length === 0) return '.';

    var isAbsolute = path.charCodeAt(0) === 47 /*/*/;
    var trailingSeparator = path.charCodeAt(path.length - 1) === 47 /*/*/;

    // Normalize the path
    path = normalizeStringPosix(path, !isAbsolute);

    if (path.length === 0 && !isAbsolute) path = '.';
    if (path.length > 0 && trailingSeparator) path += '/';

    if (isAbsolute) return '/' + path;
    return path;
  },

  isAbsolute: function isAbsolute(path) {
    assertPath(path);
    return path.length > 0 && path.charCodeAt(0) === 47 /*/*/;
  },

  join: function join() {
    if (arguments.length === 0)
      return '.';
    var joined;
    for (var i = 0; i < arguments.length; ++i) {
      var arg = arguments[i];
      assertPath(arg);
      if (arg.length > 0) {
        if (joined === undefined)
          joined = arg;
        else
          joined += '/' + arg;
      }
    }
    if (joined === undefined)
      return '.';
    return posix.normalize(joined);
  },

  relative: function relative(from, to) {
    assertPath(from);
    assertPath(to);

    if (from === to) return '';

    from = posix.resolve(from);
    to = posix.resolve(to);

    if (from === to) return '';

    // Trim any leading backslashes
    var fromStart = 1;
    for (; fromStart < from.length; ++fromStart) {
      if (from.charCodeAt(fromStart) !== 47 /*/*/)
        break;
    }
    var fromEnd = from.length;
    var fromLen = fromEnd - fromStart;

    // Trim any leading backslashes
    var toStart = 1;
    for (; toStart < to.length; ++toStart) {
      if (to.charCodeAt(toStart) !== 47 /*/*/)
        break;
    }
    var toEnd = to.length;
    var toLen = toEnd - toStart;

    // Compare paths to find the longest common path from root
    var length = fromLen < toLen ? fromLen : toLen;
    var lastCommonSep = -1;
    var i = 0;
    for (; i <= length; ++i) {
      if (i === length) {
        if (toLen > length) {
          if (to.charCodeAt(toStart + i) === 47 /*/*/) {
            // We get here if `from` is the exact base path for `to`.
            // For example: from='/foo/bar'; to='/foo/bar/baz'
            return to.slice(toStart + i + 1);
          } else if (i === 0) {
            // We get here if `from` is the root
            // For example: from='/'; to='/foo'
            return to.slice(toStart + i);
          }
        } else if (fromLen > length) {
          if (from.charCodeAt(fromStart + i) === 47 /*/*/) {
            // We get here if `to` is the exact base path for `from`.
            // For example: from='/foo/bar/baz'; to='/foo/bar'
            lastCommonSep = i;
          } else if (i === 0) {
            // We get here if `to` is the root.
            // For example: from='/foo'; to='/'
            lastCommonSep = 0;
          }
        }
        break;
      }
      var fromCode = from.charCodeAt(fromStart + i);
      var toCode = to.charCodeAt(toStart + i);
      if (fromCode !== toCode)
        break;
      else if (fromCode === 47 /*/*/)
        lastCommonSep = i;
    }

    var out = '';
    // Generate the relative path based on the path difference between `to`
    // and `from`
    for (i = fromStart + lastCommonSep + 1; i <= fromEnd; ++i) {
      if (i === fromEnd || from.charCodeAt(i) === 47 /*/*/) {
        if (out.length === 0)
          out += '..';
        else
          out += '/..';
      }
    }

    // Lastly, append the rest of the destination (`to`) path that comes after
    // the common path parts
    if (out.length > 0)
      return out + to.slice(toStart + lastCommonSep);
    else {
      toStart += lastCommonSep;
      if (to.charCodeAt(toStart) === 47 /*/*/)
        ++toStart;
      return to.slice(toStart);
    }
  },

  _makeLong: function _makeLong(path) {
    return path;
  },

  dirname: function dirname(path) {
    assertPath(path);
    if (path.length === 0) return '.';
    var code = path.charCodeAt(0);
    var hasRoot = code === 47 /*/*/;
    var end = -1;
    var matchedSlash = true;
    for (var i = path.length - 1; i >= 1; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          if (!matchedSlash) {
            end = i;
            break;
          }
        } else {
        // We saw the first non-path separator
        matchedSlash = false;
      }
    }

    if (end === -1) return hasRoot ? '/' : '.';
    if (hasRoot && end === 1) return '//';
    return path.slice(0, end);
  },

  basename: function basename(path, ext) {
    if (ext !== undefined && typeof ext !== 'string') throw new TypeError('"ext" argument must be a string');
    assertPath(path);

    var start = 0;
    var end = -1;
    var matchedSlash = true;
    var i;

    if (ext !== undefined && ext.length > 0 && ext.length <= path.length) {
      if (ext.length === path.length && ext === path) return '';
      var extIdx = ext.length - 1;
      var firstNonSlashEnd = -1;
      for (i = path.length - 1; i >= 0; --i) {
        var code = path.charCodeAt(i);
        if (code === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else {
          if (firstNonSlashEnd === -1) {
            // We saw the first non-path separator, remember this index in case
            // we need it if the extension ends up not matching
            matchedSlash = false;
            firstNonSlashEnd = i + 1;
          }
          if (extIdx >= 0) {
            // Try to match the explicit extension
            if (code === ext.charCodeAt(extIdx)) {
              if (--extIdx === -1) {
                // We matched the extension, so mark this as the end of our path
                // component
                end = i;
              }
            } else {
              // Extension does not match, so our result is the entire path
              // component
              extIdx = -1;
              end = firstNonSlashEnd;
            }
          }
        }
      }

      if (start === end) end = firstNonSlashEnd;else if (end === -1) end = path.length;
      return path.slice(start, end);
    } else {
      for (i = path.length - 1; i >= 0; --i) {
        if (path.charCodeAt(i) === 47 /*/*/) {
            // If we reached a path separator that was not part of a set of path
            // separators at the end of the string, stop now
            if (!matchedSlash) {
              start = i + 1;
              break;
            }
          } else if (end === -1) {
          // We saw the first non-path separator, mark this as the end of our
          // path component
          matchedSlash = false;
          end = i + 1;
        }
      }

      if (end === -1) return '';
      return path.slice(start, end);
    }
  },

  extname: function extname(path) {
    assertPath(path);
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;
    for (var i = path.length - 1; i >= 0; --i) {
      var code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1)
            startDot = i;
          else if (preDotState !== 1)
            preDotState = 1;
      } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
        // We saw a non-dot character immediately before the dot
        preDotState === 0 ||
        // The (right-most) trimmed path component is exactly '..'
        preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      return '';
    }
    return path.slice(startDot, end);
  },

  format: function format(pathObject) {
    if (pathObject === null || typeof pathObject !== 'object') {
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof pathObject);
    }
    return _format('/', pathObject);
  },

  parse: function parse(path) {
    assertPath(path);

    var ret = { root: '', dir: '', base: '', ext: '', name: '' };
    if (path.length === 0) return ret;
    var code = path.charCodeAt(0);
    var isAbsolute = code === 47 /*/*/;
    var start;
    if (isAbsolute) {
      ret.root = '/';
      start = 1;
    } else {
      start = 0;
    }
    var startDot = -1;
    var startPart = 0;
    var end = -1;
    var matchedSlash = true;
    var i = path.length - 1;

    // Track the state of characters (if any) we see before our first dot and
    // after any path separator we find
    var preDotState = 0;

    // Get non-dir info
    for (; i >= start; --i) {
      code = path.charCodeAt(i);
      if (code === 47 /*/*/) {
          // If we reached a path separator that was not part of a set of path
          // separators at the end of the string, stop now
          if (!matchedSlash) {
            startPart = i + 1;
            break;
          }
          continue;
        }
      if (end === -1) {
        // We saw the first non-path separator, mark this as the end of our
        // extension
        matchedSlash = false;
        end = i + 1;
      }
      if (code === 46 /*.*/) {
          // If this is our first dot, mark it as the start of our extension
          if (startDot === -1) startDot = i;else if (preDotState !== 1) preDotState = 1;
        } else if (startDot !== -1) {
        // We saw a non-dot and non-path separator before our dot, so we should
        // have a good chance at having a non-empty extension
        preDotState = -1;
      }
    }

    if (startDot === -1 || end === -1 ||
    // We saw a non-dot character immediately before the dot
    preDotState === 0 ||
    // The (right-most) trimmed path component is exactly '..'
    preDotState === 1 && startDot === end - 1 && startDot === startPart + 1) {
      if (end !== -1) {
        if (startPart === 0 && isAbsolute) ret.base = ret.name = path.slice(1, end);else ret.base = ret.name = path.slice(startPart, end);
      }
    } else {
      if (startPart === 0 && isAbsolute) {
        ret.name = path.slice(1, startDot);
        ret.base = path.slice(1, end);
      } else {
        ret.name = path.slice(startPart, startDot);
        ret.base = path.slice(startPart, end);
      }
      ret.ext = path.slice(startDot, end);
    }

    if (startPart > 0) ret.dir = path.slice(0, startPart - 1);else if (isAbsolute) ret.dir = '/';

    return ret;
  },

  sep: '/',
  delimiter: ':',
  win32: null,
  posix: null
};

posix.posix = posix;

module.exports = posix;

}).call(this)}).call(this,require('_process'))
},{"_process":3}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){

function Node(n,op,left,right){
    let str = "N"+n + "("+op+");";
    if(left != null && left != "") {
        if(Array.isArray(left)) {
            left.forEach(element=>{
                str += "\n";
                str += element.code + "\n";
                str += "N"+n + "-->" + "N" + element.count+";";
            });
        } else {
            str += "\n";
            str += left.code + "\n";
            str += "N"+n + "-->" + "N" + left.count+";";
        }
    }
    if(right != null && right != "") {
        
            str += "\n";
            str += right.code + "\n";
            str += "N"+n + "-->" + "N" + right.count+";";
        
    }
    return {code:str,count:n}
}

function Leaf(n,value){
    return {code:"N"+n + "("+value+");",count:n};
}




module.exports = {
    Leaf:Leaf,
    Node:Node
}
},{}],5:[function(require,module,exports){
const tsObject = require('./tsObject');

class ArrList {
    constructor(param) {
        this.param = param;
        
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        
        let newTsObject = new tsObject(0,0,null,null)
        newTsObject.isArray = true;
        let res = null;
        let pointer = 't' + scope.getNewTemp();
        let aux = 't' + scope.getNewTemp();
        
        
        let arrs = [];

        this.param.forEach(element => {
            res = element.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
            newTsObject.code3d += res.code3d;

            

            let typel = '';
            if(res.isArray) {
                typel = '-4';
                newTsObject.list.push({fin:res.arrFinal,tipo:res.type,len:res.arrLen,pointer:res.pointer});
            } else if(res.isType) {
                typel = '-5';
            }else if(res.type == 'number') {
                typel = '-1';
            } else if(res.type == 'boolean') {
                typel = '-2';
            } else if (res.type == 'string') {
                typel = '-30';
            } 
            arrs.push({type:typel,pointer:res.pointer});
            
            
        });
        newTsObject.arrLen = this.param.length;

        newTsObject.code3d += "//=================ARRLIST==========================\n";

        newTsObject.code3d += pointer + '=H;\n';
        newTsObject.code3d += aux + '=H;\n';
        arrs.forEach(element => {
            newTsObject.code3d += 'Heap[(int)'+aux+'] = '+element.type+';\n';
            newTsObject.code3d += 'H = H + 1;\n';
            newTsObject.code3d += aux + ' = H;\n';
            ////////////////////////////////
            newTsObject.code3d += 'Heap[(int)'+aux+'] = '+element.pointer+';\n';
            newTsObject.code3d += 'H = H + 1;\n';
            newTsObject.code3d += aux + ' = H;\n';
        });

            
        let lastPosition = 't' + scope.getNewTemp();
        //newTsObject.code3d += lastPosition + ' = ' + aux + ' - 1;\n';
        newTsObject.code3d += lastPosition + ' = ' + aux + ';\n';
        newTsObject.arrFinal = lastPosition; 
        newTsObject.type = res.type;

        /*let newPointer = 't' + scope.getNewTemp();
        newTsObject.code3d += newPointer + ' = P;\n';
        newTsObject.code3d += 'Stack[(int)'+newPointer+'] = '+pointer+';\n';
        newTsObject.code3d += 'P = P + 1;\n';
        newTsObject.pointer = newPointer;*/
        newTsObject.pointer = pointer;
        
        newTsObject.code3d += "//===========================================\n";
        return newTsObject;

    }
}
module.exports = ArrList;

},{"./tsObject":33}],6:[function(require,module,exports){
const tsObject = require('./tsObject');

class Arrayl {
    constructor(id,exp) {
        this.id = id;
        this.exp = exp;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {

        if(this.id == "Array") {

            const E = this.exp.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
            if(E.type == 'number') {
                let newTsObject = new tsObject(0,0,null,null)
                newTsObject.type = 'Array'
                let x = 't' + scope.getNewTemp();
                newTsObject.code3d += E.code3d; 
                newTsObject.code3d += x + ' = '+E.pointer+';\n';
                newTsObject.pointer = x;
                return newTsObject;
            }

        } else {
            console.log("ERROR");
        }
        return null;
    }
}
module.exports = Arrayl;
},{"./tsObject":33}],7:[function(require,module,exports){
const tsObject = require('./tsObject');

class Break {
    constructor() {

    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        let newTsObject = new tsObject(0,0,null,null);
        newTsObject.code3d += 'goto '+breaklbl+';\n';
        return newTsObject;
    }
}
module.exports = Break;
},{"./tsObject":33}],8:[function(require,module,exports){
const tsObject = require('./tsObject');

class Continue {
    constructor() {

    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        let newTsObject = new tsObject(0,0,null,null);
        newTsObject.code3d += 'goto '+continuelbl+';\n';
        return newTsObject;
    }
}
module.exports = Continue;
},{"./tsObject":33}],9:[function(require,module,exports){
const tsObject = require('./tsObject')
const Scope = require('./Scope')

class DoWhile {
    constructor(line,column,exp,stmt) {
        this.line = line;
        this.column = column;
        this.exp = exp;
        this.stmt = stmt;       
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {

        let returnLabel = 'L'+scope.getNewLabel();
        let exitLabel = 'L'+scope.getNewLabel();
        let bodyLabel = 'L'+scope.getNewLabel();
        let tempStack = 't' + scope.getNewTemp();
        let CONTINUELABEL = 't' + scope.getNewLabel();

        let newTsObject = new tsObject(0,0,null,null);
        let E;
        let Statement = '';

        newTsObject.code3d += tempStack + '= P;\n';
        newTsObject.code3d += returnLabel + ':\n';
        let newScope = new Scope(scope,scope.terminal,scope.label);
        this.stmt.forEach(element => {
            Statement += element.translate(newScope,returnlbl,exitLabel,CONTINUELABEL,funcID,sCounter).code3d;
        });
        newTsObject.code3d += Statement
        scope.terminal = newScope.terminal;
        scope.label = newScope.label;
        //-------------------------
        E = this.exp.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        newTsObject.code3d += E.code3d;
        newTsObject.code3d += CONTINUELABEL + ':\n';
        newTsObject.code3d += 'if('+E.pointer+') goto '+returnLabel+';\n'
        newTsObject.code3d += 'goto '+exitLabel+';\n'
        newTsObject.code3d += exitLabel + ':\n\n';
        newTsObject.code3d += 'P = '+tempStack+';\n';
        return newTsObject;

    }
}

module.exports = DoWhile;
},{"./Scope":25,"./tsObject":33}],10:[function(require,module,exports){
const tsObject = require('./tsObject')
const Scope = require('./Scope')
const Variables = require('./Variable')
const defLast = require('./defLast')
class For {
    constructor(asign,id,typeId,expId,cond,iterate,stmt) {
        this.asign = asign;
        this.id = id;
        this.expId = expId;
        this.typeId = typeId;
        this.cond = cond;
        this.iterate = iterate;
        this.stmt = stmt;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        
        
        let Lloop = 'L'+scope.getNewLabel()
        let lbody = 'L' + scope.getNewLabel()
        let LExit = 'L' + scope.getNewLabel()
        let tempStack = 't' + scope.getNewTemp();

        let newTsObject = new tsObject(0,0,null,null);
        
        //newTsObject.code3d += entryLabel + ':\n';
        newTsObject.code3d += tempStack + '= P;\n';
        let asignVar = new Variables(this.asign,this.id,new defLast({type:'number',list:0},this.expId),null);
        let prevForScope = new Scope(scope,scope.terminal,scope.label);
        asignVar = asignVar.translate(prevForScope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        //scope.terminal = prevForScope.terminal;
        //scope.label = prevForScope.label;
        //let newScope = new Scope(prevForScope,prevForScope.terminal,prevForScope.label);
        newTsObject.code3d +=  asignVar.code3d;
        newTsObject.code3d += Lloop + ':\n';
        let condT = this.cond.translate(prevForScope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        newTsObject.code3d += condT.code3d;

        newTsObject.code3d += 'if(' + condT.pointer + ')goto '+lbody+';\n';
        newTsObject.code3d += 'goto '+LExit+';\n';
        newTsObject.code3d += lbody + ':\n';
        let newScope = new Scope(prevForScope,prevForScope.terminal,prevForScope.label);
        
        let Statement = '';
        let continueLABEL = 'L' + prevForScope.getNewLabel();
        this.stmt.forEach(element => {
            Statement += element.translate(newScope,returnlbl,LExit,continueLABEL,funcID,sCounter).code3d;
        });
        newTsObject.code3d += Statement;
        prevForScope.terminal = newScope.terminal;
        prevForScope.label = newScope.label;

        
        newTsObject.code3d += continueLABEL + ':\n';
        let iter = this.iterate.translate(prevForScope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        
        newTsObject.code3d += iter.code3d;
        newTsObject.code3d += 'goto '+Lloop+';\n';
        newTsObject.code3d += LExit + ':\n\n';
        
        scope.terminal = prevForScope.terminal;
        scope.label = prevForScope.label;
        
        newTsObject.code3d += 'P = '+tempStack+';\n';
        return newTsObject;
    }
}
module.exports = For;
},{"./Scope":25,"./Variable":28,"./defLast":32,"./tsObject":33}],11:[function(require,module,exports){
const tsObject = require('./tsObject');
const Operation = require('./Operation')
const Scope = require('./Scope')
const VariableChange = require('./VariableChange')


class For2 {
    constructor(id,exp,cond,iterate,stmt) {
        this.id = id;
        this.exp = exp;
        this.cond = cond;
        this.iterate = iterate;
        this.stmt = stmt;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {

        if(this.id.constructor.name == "Id") {
            
            
            let id = this.id.id;
            

            let Lloop = 'L'+scope.getNewLabel()
            let lbody = 'L' + scope.getNewLabel()
            let LExit = 'L' + scope.getNewLabel()
            let tempStack = 't' + scope.getNewTemp();
            let CONTINUELABEL = 'L'+scope.getNewLabel();

            let newTsObject = new tsObject(0,0,null,null);
            
            
            newTsObject.code3d += tempStack + '= P;\n';
            //let asignVar = new Variables(this.asign,this.id,new defLast({type:'number',list:0},this.expId),null);
            //let prevForScope = new Scope(scope,scope.terminal,scope.label);
            
            let chngVar = new VariableChange(id,{tipo:'=',value:this.exp});
            chngVar = chngVar.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);

            newTsObject.code3d +=  chngVar.code3d;
            newTsObject.code3d += Lloop + ':\n';
            let condT = this.cond.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
            newTsObject.code3d += condT.code3d;

            newTsObject.code3d += 'if(' + condT.pointer + ')goto '+lbody+';\n';
            newTsObject.code3d += 'goto '+LExit+';\n';
            newTsObject.code3d += lbody + ':\n';
            let newScope = new Scope(scope,scope.terminal,scope.label);
            
            let Statement = '';
            this.stmt.forEach(element => {
                Statement += element.translate(newScope,returnlbl,LExit,CONTINUELABEL,funcID,sCounter).code3d;
            });
            newTsObject.code3d += Statement;
            scope.terminal = newScope.terminal;
            scope.label = newScope.label;
            let iter = this.iterate.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
            newTsObject.code3d += CONTINUELABEL + ':\n';
            newTsObject.code3d += iter.code3d;
            newTsObject.code3d += 'goto '+Lloop+';\n';
            newTsObject.code3d += LExit + ':\n\n';
            
            
            newTsObject.code3d += 'P = '+tempStack+';\n';
            return newTsObject;
        }
    }
}
module.exports = For2;
},{"./Operation":21,"./Scope":25,"./VariableChange":29,"./tsObject":33}],12:[function(require,module,exports){
const tsObject = require('./tsObject');
const Variables = require('./Variable');
const defLast = require('./defLast');
const Scope = require('./Scope');

class ForIO {
    constructor(id,ofIn,exp,stmt) {
        this.idExp = id;
        this.ofIn = ofIn;
        this.exp = exp;
        this.stmt = stmt;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        if(this.ofIn == 2) {
            return this.forOf(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        } else {
            return this.forIn(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        }
    }

    forOf(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        
        let id = this.idExp;
        let arrObj = this.exp.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        
        let ArraySize = arrObj.arrLen;

        let Lloop = 'L'+scope.getNewLabel()
        let lbody = 'L' + scope.getNewLabel()
        let LExit = 'L' + scope.getNewLabel()
        let tempStack = 't' + scope.getNewTemp();
        let contadorFor = 't' + scope.getNewTemp();
        let condTemp = 't' + scope.getNewTemp();
        let heapPointer = 't' + scope.getNewTemp();
        let varPointer = 't' + scope.getNewTemp();
        //console.log(this.idExp);
        let newTsObject = new tsObject(0,0,null,null);
        
        //newTsObject.code3d += entryLabel + ':\n';
        newTsObject.code3d += tempStack + '= P;\n';
        
        let asignVar;
        let prevForScope;
        if(arrObj.list.length == 0) {
            asignVar = new Variables(this.asign,id,new defLast({type:arrObj.type,list:0},this.defaultValue(arrObj.type)),null);
            prevForScope = new Scope(scope,scope.terminal,scope.label);
            asignVar = asignVar.translate(prevForScope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        } else {
            
        }
        

        //console.log(arrObj);
        //console.log("==============");
        //console.log(asignVar);
        const variableInfo = prevForScope.findVariable(id);
       // console.log(variableInfo);
        
        newTsObject.code3d += arrObj.code3d;
        newTsObject.code3d +=  asignVar.code3d;
        newTsObject.code3d += varPointer + '='+variableInfo.pointer+';\n';
        newTsObject.code3d += heapPointer + '='+arrObj.pointer+';\n';
        newTsObject.code3d += heapPointer + '= '+heapPointer+'+1;\n'
        newTsObject.code3d += contadorFor + '= 0;\n';
        newTsObject.code3d += Lloop + ':\n';
        newTsObject.code3d += 'if(' + contadorFor + ' >= '+ArraySize+')goto '+LExit+';\n';
        newTsObject.code3d += condTemp + '=2*'+contadorFor+';\n';
        newTsObject.code3d += condTemp + '='+heapPointer+'+'+condTemp+';\n';
        newTsObject.code3d += condTemp + '=Heap[(int)'+condTemp+'];\n';
        newTsObject.code3d += 'Stack[(int)'+varPointer+'] = '+condTemp+';\n';
        //newTsObject.code3d += 'goto '+LExit+';\n';
        newTsObject.code3d += lbody + ':\n';
        let newScope = new Scope(prevForScope,prevForScope.terminal,prevForScope.label);
        
        let Statement = '';
        let continueLABEL = 'L' + prevForScope.getNewLabel();
        this.stmt.forEach(element => {
            Statement += element.translate(newScope,returnlbl,LExit,continueLABEL,funcID,sCounter).code3d;
        });
        newTsObject.code3d += Statement;
        prevForScope.terminal = newScope.terminal;
        prevForScope.label = newScope.label;

        
        newTsObject.code3d += continueLABEL + ':\n';
        //let iter = this.iterate.translate(prevForScope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        
        //newTsObject.code3d += iter.code3d;
        newTsObject.code3d += contadorFor + '='+contadorFor+' + 1;\n'
        //newTsObject.code3d += 'Stack[(int)'+variableInfo.pointer+'] = '+condTemp+';\n'
        newTsObject.code3d += 'goto '+Lloop+';\n';
        newTsObject.code3d += LExit + ':\n\n';
        
        scope.terminal = prevForScope.terminal;
        scope.label = prevForScope.label;
        
        newTsObject.code3d += 'P = '+tempStack+';\n';
        
        return newTsObject;
    }

    forIn(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        
        let id = this.idExp;
        let arrObj = this.exp.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        
        let ArraySize = arrObj.arrLen;

        let Lloop = 'L'+scope.getNewLabel()
        let lbody = 'L' + scope.getNewLabel()
        let LExit = 'L' + scope.getNewLabel()
        let tempStack = 't' + scope.getNewTemp();
        //let contadorFor = 't' + scope.getNewTemp();
        let condTemp = 't' + scope.getNewTemp();
        //console.log(this.idExp);
        let newTsObject = new tsObject(0,0,null,null);
        
        //newTsObject.code3d += entryLabel + ':\n';
        newTsObject.code3d += tempStack + '= P;\n';
        let asignVar = new Variables(this.asign,id,new defLast({type:'number',list:0},new tsObject(0,0,0,'number')),null);
        let prevForScope = new Scope(scope,scope.terminal,scope.label);
        asignVar = asignVar.translate(prevForScope,returnlbl,breaklbl,continuelbl,funcID,sCounter);

        //console.log(arrObj);
        //console.log("==============");
        //console.log(asignVar);
        const variableInfo = prevForScope.findVariable(id);
       // console.log(variableInfo);
        
        newTsObject.code3d += arrObj.code3d;
        newTsObject.code3d +=  asignVar.code3d;
        newTsObject.code3d += Lloop + ':\n';
        newTsObject.code3d += condTemp + '=Stack[(int)'+variableInfo.pointer+'];\n';
        newTsObject.code3d += 'if(' + condTemp + ' < '+ArraySize+')goto '+lbody+';\n';
        newTsObject.code3d += 'goto '+LExit+';\n';
        newTsObject.code3d += lbody + ':\n';
        let newScope = new Scope(prevForScope,prevForScope.terminal,prevForScope.label);
        
        let Statement = '';
        let continueLABEL = 'L' + prevForScope.getNewLabel();
        this.stmt.forEach(element => {
            Statement += element.translate(newScope,returnlbl,LExit,continueLABEL,funcID,sCounter).code3d;
        });
        newTsObject.code3d += Statement;
        prevForScope.terminal = newScope.terminal;
        prevForScope.label = newScope.label;

        
        newTsObject.code3d += continueLABEL + ':\n';
        //let iter = this.iterate.translate(prevForScope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        
        //newTsObject.code3d += iter.code3d;
        newTsObject.code3d += condTemp + '='+condTemp+' + 1;\n'
        newTsObject.code3d += 'Stack[(int)'+variableInfo.pointer+'] = '+condTemp+';\n'
        newTsObject.code3d += 'goto '+Lloop+';\n';
        newTsObject.code3d += LExit + ':\n\n';
        
        scope.terminal = prevForScope.terminal;
        scope.label = prevForScope.label;
        
        newTsObject.code3d += 'P = '+tempStack+';\n';
        
        return newTsObject;
    }

    defaultValue(type) {
        if(type == 'number') {
            return new tsObject(0,0,0,type);
        } else if(type == 'boolean') {
            return new tsObject(0,0,0,type);
        } else if(type == 'string') {
            return new tsObject(0,0,"",type);
        }
    }
}
module.exports = ForIO;
},{"./Scope":25,"./Variable":28,"./defLast":32,"./tsObject":33}],13:[function(require,module,exports){
const tsObject = require('./tsObject');
const Operation = require('./Operation')
const Scope = require('./Scope')
const VariableChange = require('./VariableChange')


class ForThree {
    constructor(id,cond,iterate,stmt) {
        this.id = id;
        this.cond = cond;
        this.iterate = iterate;
        this.stmt = stmt;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {

        if(this.id.constructor.name == "Id") {
            
            
            let id = this.id.id;
            

            let Lloop = 'L'+scope.getNewLabel()
            let lbody = 'L' + scope.getNewLabel()
            let LExit = 'L' + scope.getNewLabel()
            let tempStack = 't' + scope.getNewTemp();
            let CONTINUELABEL = 'L'+scope.getNewLabel();
            let newTsObject = new tsObject(0,0,null,null);
            
            
            newTsObject.code3d += tempStack + '= P;\n';
            //let asignVar = new Variables(this.asign,this.id,new defLast({type:'number',list:0},this.expId),null);
            //let prevForScope = new Scope(scope,scope.terminal,scope.label);
            //asignVar = asignVar.translate(prevForScope);
           /* let chngVar = new VariableChange(id,{tipo:'=',value:this.exp});
            chngVar = chngVar.translate(scope);

            newTsObject.code3d +=  chngVar.code3d;*/
            newTsObject.code3d += Lloop + ':\n';
            let condT = this.cond.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
            newTsObject.code3d += condT.code3d;

            newTsObject.code3d += 'if(' + condT.pointer + ')goto '+lbody+';\n';
            newTsObject.code3d += 'goto '+LExit+';\n';
            newTsObject.code3d += lbody + ':\n';
            let newScope = new Scope(scope,scope.terminal,scope.label);
            
            let Statement = '';
            this.stmt.forEach(element => {
                Statement += element.translate(newScope,returnlbl,LExit,CONTINUELABEL,funcID,sCounter).code3d;
            });
            newTsObject.code3d += Statement;
            scope.terminal = newScope.terminal;
            scope.label = newScope.label;
            let iter = this.iterate.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
            
            newTsObject.code3d += CONTINUELABEL + ':\n';
            newTsObject.code3d += iter.code3d;
            newTsObject.code3d += 'goto '+Lloop+';\n';
            newTsObject.code3d += LExit + ':\n\n';
            
            
            newTsObject.code3d += 'P = '+tempStack+';\n';
            return newTsObject;
        }
    }
}
module.exports = ForThree;
},{"./Operation":21,"./Scope":25,"./VariableChange":29,"./tsObject":33}],14:[function(require,module,exports){
const tsObject = require('./tsObject');
const Scope = require('./Scope')

class Function {
    constructor(id,params,funcdec) {
        this.id = id;
        this.params = params;
        this.funcdec = funcdec;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        
        const ftype = this.funcdec.type;
        const type = ftype.type;
        const list = ftype.list;
        const stmt = this.funcdec.stmt
        let StackCounter = 0;

        const newScope = new Scope(scope,scope.terminal,scope.label);
        newScope.isFuncScope = true;
        //console.log(this.params);
        let paramsList = [];
        const returnTemp = 't' + newScope.getNewTemp()
        this.params.forEach(element => {

            const newTemp = 't'+newScope.getNewTemp();
            const paramId = element.id;
            const paramType = element.types.type;
            const paramDim = element.types.list;
            paramsList.push(newTemp);
            newScope.insertVariable(paramId,newTemp,paramType,false,paramDim);

        });
        
        scope.insertFunction(this.id,type,list,paramsList,returnTemp); 

        let newTsObject = new tsObject(0,0,null,null);
        let returnLabel = 'L'+ newScope.getNewLabel()
        newTsObject.code3d += 'void ' + this.id + '(){\n';
        let StatementCod3d = '';

        //console.log(scope.funcTable);

        stmt.forEach(element => {
            StatementCod3d += element.translate(newScope,returnLabel,breaklbl,continuelbl,this.id,StackCounter).code3d;
        });
        newTsObject.code3d += StatementCod3d;
        newTsObject.code3d += returnLabel + ':\n';
        //newTsObject.code3d += 'P = '+tempStack+';\n';
        newTsObject.code3d += 'return;\n'
        newTsObject.code3d += '}\n';
        

        scope.terminal = newScope.terminal;
        scope.label = newScope.label;

        return newTsObject
    }
}
module.exports = Function;
},{"./Scope":25,"./tsObject":33}],15:[function(require,module,exports){
const tsObject = require('./tsObject')

class Id {
    constructor(line,column,id) {
        this.line = line;
        this.column = column;
        this.id = id;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        let varRes = scope.findVariable(this.id);
        if(varRes == null) {
            console.log("ERROR en id")
        }
        //console.log(varRes);

        let newTSObject = new tsObject(0,0,null,varRes.type);
        if(varRes.dimention > 0) {
            let newTemp = 't'+ scope.getNewTemp();
            let pointer = 't' + scope.getNewTemp();

            newTSObject.isArray = true;
            newTSObject.code3d += "//-----------------ID-------------------------\n";
            newTSObject.code3d += newTemp+' = ' + varRes.pointer + ';\n';
            newTSObject.code3d += pointer + '=Stack[(int)' + newTemp + '];\n';
            //newTSObject.code3d += pointer + '=Stack[(int)' + pointer + '];\n';
            newTSObject.pointer = pointer;
            newTSObject.list = varRes.length.list;
            newTSObject.arrFinal = varRes.length.arrFinal;
            newTSObject.arrLen = varRes.length.len
            scope.tempList.push(newTemp);
            //console.log(newTSObject);
            newTSObject.code3d += "//------------------------------------------\n";
        } else {
            let newTemp = 't'+ scope.getNewTemp();
            newTSObject.code3d += newTemp+' = Stack[(int)' + varRes.pointer + '];\n';
            newTSObject.pointer = newTemp;
            scope.tempList.push(newTemp);
        }
        
        
        return newTSObject
    }
}
module.exports = Id;    
},{"./tsObject":33}],16:[function(require,module,exports){
const tsObject = require('./tsObject');
const Id = require('./Id');

class IdAccess {
    constructor(id,varLast) {
        this.id = id;
        this.varLast = varLast;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        let IdRes = new Id(0,0,this.id);
        IdRes = IdRes.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        //console.log(IdRes);
        //console.log("######################################")
        if(IdRes.isArray) {

            this.varLast.obj = IdRes;
            let r = this.varLast.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
            //console.log(r);
            return r;

        } else if(IdRes.isType) {//puede ser type o una propiedad de arreglo o string

            

        } else if(IdRes.type == 'string') {
            this.varLast.obj = IdRes;
            let r = this.varLast.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
            //console.log(r);
            return r;
        } else {
            console.log("ERROR");
        }
    }
}
module.exports = IdAccess;
},{"./Id":15,"./tsObject":33}],17:[function(require,module,exports){
const tsObject = require('./tsObject');
const Scope = require('./Scope')

class If {
    constructor(exp,stmt,iflast) {
        this.exp = exp;
        this.stmt = stmt;
        this.iflast = iflast;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        
        
        if(this.exp) {
            let tempStack = 't' + scope.getNewTemp();
            const E = this.exp.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
            if(E.type == 'boolean' || E.type == 'number') {
                
                let newTsObj = new tsObject(0,0,null,null);
                newTsObj.code3d += tempStack + '= P;\n';
                newTsObj.code3d += E.code3d;
                let tLabel ='L'+ scope.getNewLabel();
                let fLabel ='L'+ scope.getNewLabel(); 
                let exitLabel = 'L'+scope.getNewLabel(); 
                newTsObj.code3d += 'if('+E.pointer+') goto '+tLabel+';\n'
                newTsObj.code3d += 'goto '+fLabel+';\n';
                newTsObj.code3d += tLabel + ':\n';

                const newScope = new Scope(scope,scope.terminal,scope.label)
                let Statement = '';
                this.stmt.forEach(element => {
                    Statement += element.translate(newScope,returnlbl,breaklbl,continuelbl,funcID,sCounter).code3d;
                });
                scope.terminal = newScope.terminal;
                scope.label = newScope.label;

                newTsObj.code3d += Statement;
                newTsObj.code3d += 'goto '+exitLabel+';\n';
                newTsObj.code3d += fLabel + ':\n\n';
    
                if(this.iflast) {
                    const last = this.iflast.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
                    newTsObj.code3d += last.code3d;
                }
                newTsObj.code3d += exitLabel + ':\n\n';
                newTsObj.code3d += 'P = '+tempStack+';\n';
                return newTsObj;
            } else {
    
                console.error("ERROR");
                return null;
            }
        } else {
            let tempStack = 't' + scope.getNewTemp();
            const newScope = new Scope(scope,scope.terminal,scope.label)
            let st = '';
            this.stmt.forEach(element => {
                st += element.translate(newScope,returnlbl,breaklbl,continuelbl,funcID,sCounter).code3d;
            });
            let Statement = new tsObject(0,0,null,null);
            Statement.code3d += tempStack + '= P;\n';
            Statement.code3d += st;

            scope.terminal = newScope.terminal;
            scope.label = newScope.label;
            Statement.code3d += 'P = '+tempStack+';\n';
            return Statement;
        }

        
        
    }
}
module.exports = If;
},{"./Scope":25,"./tsObject":33}],18:[function(require,module,exports){
const tsObject = require('./tsObject')
const Operation = require('./Operation')

class IncDecOp {
    constructor(exp,op) {
        this.exp = exp;
        this.op = op;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        let E = new tsObject(0,0,1,'number');
        let Op = new Operation(this.exp,E,this.op,0,0);
        if(this.exp.constructor.name == 'Id') {

            let id = this.exp.id;
            let r = Op.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
            let searchId = scope.findVariable(id);

            if(searchId) {
                let newTsObject = new tsObject(0,0,null,null)
                //COMPROBACION DE TIPOS
                if(searchId.type != r.type ) {
                    console.log("ERROR en los tipos")
                    return null;
                }
                newTsObject.code3d += r.code3d;
                newTsObject.code3d += 'Stack[(int)'+searchId.pointer+'] = '+r.pointer+' ;\n'
                return newTsObject;

            } else {
                console.log("ERROR en el id")
                return null;
            }

        }
        return Op.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        
    }

}
module.exports = IncDecOp;

},{"./Operation":21,"./tsObject":33}],19:[function(require,module,exports){
const tsObject = require('./tsObject');

class List {
    constructor(isArray,expOrId,auxP) {
        this.isArray = isArray;
        this.expOrId = expOrId;
        this.auxP = auxP;
        this.obj = null;
        this.param = null;
        this.cond = false;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {

        //console.log(this.obj);
        if(this.obj.isArray && !this.isArray) {
            if(this.expOrId == 'length' && this.auxP == null) {
                //console.log(this.obj);
                let newTsObject = new tsObject(0,0,null,'number');
                
                newTsObject.code3d += this.obj.code3d;
                if(this.obj.arrLen != 0) {
                    let auxTemp = 't' + scope.getNewTemp();
                    newTsObject.code3d += auxTemp + '='+this.obj.arrLen+';\n';
                    newTsObject.pointer = auxTemp;
                } else {
                    let posFinal = 't' + scope.getNewTemp();
                    let posInicial = 't' + scope.getNewTemp();
                    let pointer = 't' + scope.getNewTemp();
                    newTsObject.code3d += posFinal + '='+this.obj.arrFinal+';\n';
                    newTsObject.code3d += posInicial + '='+this.obj.pointer+';\n';
                    newTsObject.code3d += pointer + '='+posFinal+'-'+posInicial+';\n';
                    newTsObject.code3d += pointer + '='+pointer+'/2;\n';
                    newTsObject.pointer = pointer;
                }
                
                return newTsObject;
            } else {
                console.log("ERROR un arreglo no tiene esa propiedad");
                return null;
            }
        }

        if(this.obj.type == 'string' && !this.isArray) {
            
            if(this.expOrId == 'length' && this.auxP == null) {
                console.log("aqui no deberia de entrar");
                let newTsObject = new tsObject(0,0,null,'number');
                newTsObject.code3d += this.obj.code3d;

                let stringPointer = 't'+scope.getNewTemp();
                let counTemp = 't' + scope.getNewTemp();

                
                let stringLabel = 'L'+scope.getNewLabel();
                let integerLabel = 'L' + scope.getNewLabel();
                let doubleLabel = 'L' + scope.getNewLabel();
                let booleanLabel = 'L' + scope.getNewLabel();
                let booleanLabelT = 'L' + scope.getNewLabel();
                let endStringLabel = 'L' + scope.getNewLabel();
                let endLabel = 'L' + scope.getNewLabel();
                
                let temp = 't'+scope.getNewTemp(); 

                newTsObject.code3d += stringPointer + '=' + this.obj.pointer+';\n';
                newTsObject.code3d += counTemp + '= 0;\n';

                newTsObject.code3d+= stringLabel +':\n';
                newTsObject.code3d+=temp + '=Heap[(int)'+stringPointer+'];\n';
                newTsObject.code3d+='if('+temp + '==' +'\0'.charCodeAt(0) + ') goto ' + endStringLabel + ';\n';
                newTsObject.code3d+= 'if('+temp + '=='+ '-1) goto ' + integerLabel + ';\n';
                newTsObject.code3d+= 'if('+temp + '=='+ '-2) goto ' + doubleLabel + ';\n';
                newTsObject.code3d+= 'if('+temp + '=='+ '-3) goto ' + booleanLabel + ';\n';
                //this.code3d+= 'printf("%c",(int)'+temp+');\n';
                newTsObject.code3d+= counTemp + '= '+counTemp+' + 1;\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';

                newTsObject.code3d+= integerLabel + ':\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                //this.code3d+= 'printf("%f",'+temp+');\n';
                newTsObject.code3d+= counTemp + '= '+counTemp+' + 1;\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';
                
                newTsObject.code3d+= doubleLabel + ':\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                //this.code3d+= 'printf("%f",'+temp+');\n';
                newTsObject.code3d+= counTemp + '= '+counTemp+' + 1;\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';
                
                newTsObject.code3d+= booleanLabel + ':\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                //this.code3d+= 'printf("%c",(int)'+temp+');\n';
                newTsObject.code3d+= counTemp + '= '+counTemp+' + 1;\n';
                newTsObject.code3d+= 'goto ' + endLabel + ';\n';
                
                
                newTsObject.code3d+= endLabel + ':\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';

                newTsObject.code3d+=endStringLabel+':\n\n';
                newTsObject.pointer = counTemp;

                return newTsObject;

            } if(this.expOrId == 'CharAt' && this.auxP == null && this.param != null) {
                console.log("aqui si")
                let charAt = this.param[0];
                charAt = charAt.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);

                let newTsObject = new tsObject(0,0,null,'string');
                newTsObject.code3d += this.obj.code3d;
                newTsObject.code3d += charAt.code3d;
                //newTsObject.code3d += 'printf("char: %f",'+charAt.pointer+');'

                let stringPointer = 't'+scope.getNewTemp();
                let counTemp = 't' + scope.getNewTemp();

                
                let stringLabel = 'L'+scope.getNewLabel();
                let integerLabel = 'L' + scope.getNewLabel();
                let doubleLabel = 'L' + scope.getNewLabel();
                let booleanLabel = 'L' + scope.getNewLabel();
                let booleanLabelT = 'L' + scope.getNewLabel();
                let endStringLabel = 'L' + scope.getNewLabel();
                let endLabel = 'L' + scope.getNewLabel();
                
                let temp = 't'+scope.getNewTemp(); 

                newTsObject.code3d += stringPointer + '=' + this.obj.pointer+';\n';
                newTsObject.code3d += counTemp + '= 0;\n';

                newTsObject.code3d+= stringLabel +':\n';
                newTsObject.code3d+=temp + '=Heap[(int)'+stringPointer+'];\n';
                newTsObject.code3d+='if('+counTemp + '==' +charAt.pointer+ ') goto ' + endStringLabel + ';\n';
                newTsObject.code3d+='if('+temp + '==' +'\0'.charCodeAt(0) + ') goto ' + endStringLabel + ';\n';
                newTsObject.code3d+= 'if('+temp + '=='+ '-1) goto ' + integerLabel + ';\n';
                newTsObject.code3d+= 'if('+temp + '=='+ '-2) goto ' + doubleLabel + ';\n';
                newTsObject.code3d+= 'if('+temp + '=='+ '-3) goto ' + booleanLabel + ';\n';
                //this.code3d+= 'printf("%c",(int)'+temp+');\n';
                newTsObject.code3d+= counTemp + '= '+counTemp+' + 1;\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';

                newTsObject.code3d+= integerLabel + ':\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                //this.code3d+= 'printf("%f",'+temp+');\n';
                newTsObject.code3d+= counTemp + '= '+counTemp+' + 1;\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';
                
                newTsObject.code3d+= doubleLabel + ':\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                //this.code3d+= 'printf("%f",'+temp+');\n';
                newTsObject.code3d+= counTemp + '= '+counTemp+' + 1;\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';
                
                newTsObject.code3d+= booleanLabel + ':\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                //this.code3d+= 'printf("%c",(int)'+temp+');\n';
                newTsObject.code3d+= counTemp + '= '+counTemp+' + 1;\n';
                newTsObject.code3d+= 'goto ' + endLabel + ';\n';
                
                
                newTsObject.code3d+= endLabel + ':\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';

                newTsObject.code3d+=endStringLabel+':\n\n';
                //newTsObject.pointer = temp;


                let newTemp = 't' + scope.getNewTemp();
                let newTempCounter = 't' + scope.getNewTemp();
                newTsObject.pointer = newTemp;
                
                newTsObject.code3d += '\n//////////////////////////////////\n';
                newTsObject.code3d += newTemp + '=H;\n';
                newTsObject.code3d += newTempCounter + '=H;\n';
                newTsObject.code3d += 'Heap[(int)' + newTempCounter + '] = ' + temp + ';\n'
                newTsObject.code3d += newTempCounter + '=' + newTempCounter + '+1;\n'
                newTsObject.code3d += 'Heap[(int)'+newTempCounter+']='+'\0'.charCodeAt(0)+';\n';
                newTsObject.code3d += newTempCounter + '='+newTempCounter + '+1;\n';
                newTsObject.code3d += 'H=' + newTempCounter +';\n';
                newTsObject.value = undefined;
                newTsObject.code3d += '\n//////////////////////////////////\n';

                return newTsObject;

            } if(this.expOrId == 'ToLowerCase' && this.auxP == null) {
                //console.log("aqui si")
                //let charAt = this.param[0];
                //charAt = charAt.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);

                let newTsObject = new tsObject(0,0,null,'string');
                newTsObject.code3d += this.obj.code3d;
                //newTsObject.code3d += charAt.code3d;
                //newTsObject.code3d += 'printf("char: %f",'+charAt.pointer+');'

                let newstringPointer = 't' + scope.getNewTemp();
                let newPointer = 't' + scope.getNewTemp();
                let stringPointer = 't'+scope.getNewTemp();
                let counTemp = 't' + scope.getNewTemp();

                
                let stringLabel = 'L'+scope.getNewLabel();
                let integerLabel = 'L' + scope.getNewLabel();
                let doubleLabel = 'L' + scope.getNewLabel();
                let booleanLabel = 'L' + scope.getNewLabel();
                let booleanLabelT = 'L' + scope.getNewLabel();
                let endStringLabel = 'L' + scope.getNewLabel();
                let endLabel = 'L' + scope.getNewLabel();
                let lowLabel = 'L' + scope.getNewLabel();
                
                let temp = 't'+scope.getNewTemp(); 
                
                newTsObject.code3d += newstringPointer + '=H;\n'
                newTsObject.code3d += newPointer + '=H;\n'
                newTsObject.code3d += stringPointer + '=' + this.obj.pointer+';\n';
                

                newTsObject.code3d+= stringLabel +':\n';
                newTsObject.code3d+=temp + '=Heap[(int)'+stringPointer+'];\n';
                newTsObject.code3d+='if('+temp + '==' +'\0'.charCodeAt(0) + ') goto ' + endStringLabel + ';\n';
                newTsObject.code3d+= 'if('+temp + '=='+ '-1) goto ' + integerLabel + ';\n';
                newTsObject.code3d+= 'if('+temp + '=='+ '-2) goto ' + doubleLabel + ';\n';
                //newTsObject.code3d+= 'if('+temp + '=='+ '-3) goto ' + booleanLabel + ';\n';
                
                newTsObject.code3d += 'if(' + temp + ' > 90) goto ' + lowLabel + ';\n';
                newTsObject.code3d += 'if(' + temp + ' < 65) goto ' + lowLabel + ';\n';
                newTsObject.code3d += temp + ' = ' + temp + ' + 32;\n';
                newTsObject.code3d+=lowLabel+':\n';
                newTsObject.code3d+= 'Heap[(int)'+newstringPointer+']='+temp+';\n';
                newTsObject.code3d+= newstringPointer + '=' + newstringPointer + '+1;\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';

                //INT
                newTsObject.code3d+= integerLabel + ':\n';
                newTsObject.code3d+= 'Heap[(int)'+newstringPointer+']='+temp+';\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= newstringPointer + '=' + newstringPointer + '+1;\n';
                newTsObject.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                newTsObject.code3d+= 'Heap[(int)'+newstringPointer+']='+temp+';\n';
                newTsObject.code3d+= newstringPointer + '=' + newstringPointer + '+1;\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';
                //DOUBLE
                newTsObject.code3d+= doubleLabel + ':\n';
                newTsObject.code3d+= 'Heap[(int)'+newstringPointer+']='+temp+';\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= newstringPointer + '=' + newstringPointer + '+1;\n';
                newTsObject.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                newTsObject.code3d+= 'Heap[(int)'+newstringPointer+']='+temp+';\n';
                newTsObject.code3d+= newstringPointer + '=' + newstringPointer + '+1;\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';
                
                /*newTsObject.code3d+= booleanLabel + ':\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                //this.code3d+= 'printf("%c",(int)'+temp+');\n';
                newTsObject.code3d+= counTemp + '= '+counTemp+' + 1;\n';
                newTsObject.code3d+= 'goto ' + endLabel + ';\n';*/
                
                
                //newTsObject.code3d+= endLabel + ':\n';
                

                newTsObject.code3d+=endStringLabel+':\n';
                newTsObject.code3d+= 'Heap[(int)'+newstringPointer+']='+temp+';\n';
                newTsObject.code3d+= newstringPointer + '=' + newstringPointer + '+1;\n';
                newTsObject.code3d += 'H=' + newstringPointer +';\n';
                newTsObject.pointer = newPointer;
                


                

                return newTsObject;

            } if(this.expOrId == 'ToUpperCase' && this.auxP == null) {
                //console.log("aqui si")
                //let charAt = this.param[0];
                //charAt = charAt.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);

                let newTsObject = new tsObject(0,0,null,'string');
                newTsObject.code3d += this.obj.code3d;
                //newTsObject.code3d += charAt.code3d;
                //newTsObject.code3d += 'printf("char: %f",'+charAt.pointer+');'

                let newstringPointer = 't' + scope.getNewTemp();
                let newPointer = 't' + scope.getNewTemp();
                let stringPointer = 't'+scope.getNewTemp();
                let counTemp = 't' + scope.getNewTemp();

                
                let stringLabel = 'L'+scope.getNewLabel();
                let integerLabel = 'L' + scope.getNewLabel();
                let doubleLabel = 'L' + scope.getNewLabel();
                let booleanLabel = 'L' + scope.getNewLabel();
                let booleanLabelT = 'L' + scope.getNewLabel();
                let endStringLabel = 'L' + scope.getNewLabel();
                let endLabel = 'L' + scope.getNewLabel();
                let lowLabel = 'L' + scope.getNewLabel();
                
                let temp = 't'+scope.getNewTemp(); 
                
                newTsObject.code3d += newstringPointer + '=H;\n'
                newTsObject.code3d += newPointer + '=H;\n'
                newTsObject.code3d += stringPointer + '=' + this.obj.pointer+';\n';
                

                newTsObject.code3d+= stringLabel +':\n';
                newTsObject.code3d+=temp + '=Heap[(int)'+stringPointer+'];\n';
                newTsObject.code3d+='if('+temp + '==' +'\0'.charCodeAt(0) + ') goto ' + endStringLabel + ';\n';
                newTsObject.code3d+= 'if('+temp + '=='+ '-1) goto ' + integerLabel + ';\n';
                newTsObject.code3d+= 'if('+temp + '=='+ '-2) goto ' + doubleLabel + ';\n';
                //newTsObject.code3d+= 'if('+temp + '=='+ '-3) goto ' + booleanLabel + ';\n';
                
                newTsObject.code3d += 'if(' + temp + ' > 122) goto ' + lowLabel + ';\n';
                newTsObject.code3d += 'if(' + temp + ' < 97) goto ' + lowLabel + ';\n';
                newTsObject.code3d += temp + ' = ' + temp + ' - 32;\n';
                newTsObject.code3d+=lowLabel+':\n';
                newTsObject.code3d+= 'Heap[(int)'+newstringPointer+']='+temp+';\n';
                newTsObject.code3d+= newstringPointer + '=' + newstringPointer + '+1;\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';

                //INT
                newTsObject.code3d+= integerLabel + ':\n';
                newTsObject.code3d+= 'Heap[(int)'+newstringPointer+']='+temp+';\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= newstringPointer + '=' + newstringPointer + '+1;\n';
                newTsObject.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                newTsObject.code3d+= 'Heap[(int)'+newstringPointer+']='+temp+';\n';
                newTsObject.code3d+= newstringPointer + '=' + newstringPointer + '+1;\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';
                //DOUBLE
                newTsObject.code3d+= doubleLabel + ':\n';
                newTsObject.code3d+= 'Heap[(int)'+newstringPointer+']='+temp+';\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= newstringPointer + '=' + newstringPointer + '+1;\n';
                newTsObject.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                newTsObject.code3d+= 'Heap[(int)'+newstringPointer+']='+temp+';\n';
                newTsObject.code3d+= newstringPointer + '=' + newstringPointer + '+1;\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= 'goto ' + stringLabel + ';\n';
                
                /*newTsObject.code3d+= booleanLabel + ':\n';
                newTsObject.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                newTsObject.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                //this.code3d+= 'printf("%c",(int)'+temp+');\n';
                newTsObject.code3d+= counTemp + '= '+counTemp+' + 1;\n';
                newTsObject.code3d+= 'goto ' + endLabel + ';\n';*/
                
                
                //newTsObject.code3d+= endLabel + ':\n';
                

                newTsObject.code3d+=endStringLabel+':\n';
                newTsObject.code3d+= 'Heap[(int)'+newstringPointer+']='+temp+';\n';
                newTsObject.code3d+= newstringPointer + '=' + newstringPointer + '+1;\n';
                newTsObject.code3d += 'H=' + newstringPointer +';\n';
                newTsObject.pointer = newPointer;
                


                

                return newTsObject;

            } if(this.expOrId == 'Concat' && this.auxP == null && this.param != null) {

                let str = this.param[0];
                str = str.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);

                let newTsObject = new tsObject(0,0,null,'string');
                newTsObject.code3d += this.obj.code3d;
                newTsObject.code3d += str.code3d;
                
                let actualPointer = 't'+scope.getNewTemp();
                let newActualPointer = 't' + scope.getNewTemp();
                let temp = 't' + scope.getNewTemp();
                let auxTemp = 't'+scope.getNewTemp();
                let stringPos1 = 't' + scope.getNewTemp();
                let stringPos2 = 't' + scope.getNewTemp();
                let leftString = 'L' + scope.getNewLabel();
                let exitLeftString = 'L' + scope.getNewLabel();
                let rigthString = 'L' + scope.getNewLabel();
                let exitRigthString = 'L' + scope.getNewLabel();
                let exitLabel = 'L' + scope.getNewLabel();

                newTsObject.code3d += actualPointer + '=H;\n';
                newTsObject.code3d += newActualPointer + '=H;\n';
                newTsObject.code3d += stringPos1 + '=' + this.obj.pointer + ';\n';
                //newObject.code3d += 'Aqui pongo el apuntador 1\n';
                newTsObject.code3d += stringPos2 + '=' + str.pointer + ';\n';
                //newObject.code3d += 'Aqui pongo el apuntador 2\n';

                newTsObject.code3d += leftString + ':\n';
                newTsObject.code3d += temp + '= Heap[(int)' + stringPos1 + '];\n';
                newTsObject.code3d += 'if('+ temp +' == ' + '\0'.charCodeAt(0) + ') goto ' + exitLeftString +';\n';
                newTsObject.code3d += 'Heap[(int)' + newActualPointer + '] = ' + temp + ';\n';
                newTsObject.code3d += newActualPointer + '=' + newActualPointer + '+1;\n';
                newTsObject.code3d += stringPos1 + '=' + stringPos1 + '+1;\n';
                //newObject.code3d += temp + '= Heap[' + newActualPointer + '];\n';
                newTsObject.code3d += 'goto ' + leftString + ';\n';
                newTsObject.code3d += exitLeftString + ':\n\n';
                
                newTsObject.code3d += rigthString + ':\n';
                newTsObject.code3d += temp + ' = Heap[(int)' + stringPos2 + '];\n';
                newTsObject.code3d += 'if('+ temp + ' == ' + '\0'.charCodeAt(0) + ') goto ' + exitLabel +';\n';
                newTsObject.code3d += 'Heap[(int)' + newActualPointer + '] = ' + temp + ';\n';
                newTsObject.code3d += newActualPointer + '=' + newActualPointer + '+1;\n';
                newTsObject.code3d += stringPos2 + '=' + stringPos2 + '+1;\n';
                newTsObject.code3d += 'goto ' + rigthString + ';\n';
                newTsObject.code3d += exitLabel + ':\n';
                newTsObject.code3d += 'Heap[(int)' + newActualPointer +'] = ' + '\0'.charCodeAt(0) + ';\n';
                newTsObject.code3d += newActualPointer + '=' + newActualPointer + '+ 1;\n';
                newTsObject.code3d += 'H = ' + newActualPointer + ';\n\n';
                newTsObject.pointer = actualPointer;
                
                return newTsObject;
            }
            
            else {  
                console.log("ERROR de string");
                return null;
            }
        }
        
        if(this.cond) {
            if(this.isArray) {

                const index = this.expOrId.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
                if(index.type == 'number') {
    
                    let counter = 't' + scope.getNewTemp();
                    let position = 't' + scope.getNewTemp();
                    let cond = 't' + scope.getNewTemp();
                    let pointer = 't' + scope.getNewTemp();
    
                    let startLabel = 'L' + scope.getNewLabel();
                    let valueLabel = 'L' + scope.getNewLabel();
                    let numberLabel = 'L' + scope.getNewLabel();
                    let booleanLabel = 'L' + scope.getNewLabel();
                    let stringLabel = 'L' + scope.getNewLabel();
                    let arrayLabel = 'L' + scope.getNewLabel();
                    let typeLabel = 'L' + scope.getNewLabel();
                    let primLabel = 'L' + scope.getNewLabel();
                    let exitLabel = 'L' + scope.getNewLabel();
                   
                    
    
    
                    let newTsObject = new tsObject(0,0,null,null);
                    newTsObject.type = this.obj.type;
                    newTsObject.code3d += this.obj.code3d;
                    newTsObject.pointer = pointer;
                    newTsObject.code3d += index.code3d;
                    newTsObject.code3d += counter + ' = 0;\n';
                    newTsObject.code3d += position + ' = '+this.obj.pointer+';\n';

                    newTsObject.code3d += startLabel + ':\n';
                    newTsObject.code3d += 'if('+index.pointer+'=='+counter+') goto '+valueLabel+';/////////\n';
                    newTsObject.code3d += counter + '='+counter+' +1;\n';
                    newTsObject.code3d += position + '='+position+' +2;\n';
                    newTsObject.code3d += 'goto '+startLabel+';\n';
                    newTsObject.code3d += valueLabel + ':\n';
                    newTsObject.code3d += cond +'=Heap[(int)'+position+'];\n';
                    //newTsObject.code3d += 'if('+cond+'==-1) goto '+numberLabel+';\n';
                    /*newTsObject.code3d += 'if('+cond+'==-2) goto '+booleanLabel+';\n';
                    newTsObject.code3d += 'if('+cond+'==-30) goto '+stringLabel+';\n';*/
                    newTsObject.code3d += 'if('+cond+'==-4) goto '+arrayLabel+';\n';
                    newTsObject.code3d += 'if('+cond+'==-5) goto '+typeLabel+';\n';
    
                    newTsObject.code3d += primLabel + ':\n';
                    newTsObject.code3d += position + '='+ position + '+1;\n';
                    newTsObject.code3d += pointer + ' = '+position+';\n'
                    newTsObject.code3d += 'goto '+exitLabel+';\n';
    
                    
                    newTsObject.code3d += arrayLabel + ':\n';
                    newTsObject.code3d += position + '='+ position + '+1;\n';
                    
                    if(this.auxP) {

                        newTsObject.code3d += pointer + '=Heap[(int)'+position+'];\n'
                        let outLabel = 'L' + scope.getNewLabel();
                        let endTemp = 't' + scope.getNewTemp();
                        if(this.obj.list.length > 0) {
                            newTsObject.isArray = true;
                            newTsObject.arrFinal = endTemp;
                            this.obj.list.forEach(element => {
                                newTsObject.code3d += endTemp + '='+element.fin+';\n';
                                newTsObject.code3d += 'if('+element.pointer+'=='+pointer+')goto '+outLabel+';\n';
                            });
                        }
                        newTsObject.code3d += outLabel + ':\n';

                    } else {
                        
                        newTsObject.code3d += pointer + '=Heap[(int)'+position+'];\n'
                    }

                    newTsObject.code3d += 'goto '+exitLabel+';\n';
    
    
                    newTsObject.code3d += typeLabel + ':\n';
                    newTsObject.code3d += position + '='+ position + '+1;\n';
                    //FALTA
                    newTsObject.code3d += 'goto '+exitLabel+';\n';
    
                    newTsObject.code3d += exitLabel + ':\n';
    
                    if(this.auxP) {
                        this.auxP.obj = newTsObject;
                        this.auxP.cond = true;
                        //console.log(newTsObject);
                        const auxPRes = this.auxP.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
                        //newTsObject.code3d += auxPRes.code3d;
                        //newTsObject.isArray = auxPRes.isArray;
                        //newTsObject.arrFinal = auxPRes.arrFinal;
                        //newTsObject.pointer = auxPRes.pointer;
                        
                        return auxPRes;
                    }
    
                    return newTsObject;
                } else {
                    console.log("La posicion del arreglo debe ser un tipo number");
                }
    
            } else {
                //TYPE
            }
        } else {
            if(this.isArray) {

                const index = this.expOrId.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
                if(index.type == 'number') {
    
                    let counter = 't' + scope.getNewTemp();
                    let position = 't' + scope.getNewTemp();
                    let cond = 't' + scope.getNewTemp();
                    let pointer = 't' + scope.getNewTemp();
    
                    let startLabel = 'L' + scope.getNewLabel();
                    let valueLabel = 'L' + scope.getNewLabel();
                    let numberLabel = 'L' + scope.getNewLabel();
                    let booleanLabel = 'L' + scope.getNewLabel();
                    let stringLabel = 'L' + scope.getNewLabel();
                    let arrayLabel = 'L' + scope.getNewLabel();
                    let typeLabel = 'L' + scope.getNewLabel();
                    let primLabel = 'L' + scope.getNewLabel();
                    let exitLabel = 'L' + scope.getNewLabel();
                   
                    
    
    
                    let newTsObject = new tsObject(0,0,null,null);
                    newTsObject.type = this.obj.type;
                    newTsObject.code3d += this.obj.code3d;
                    newTsObject.pointer = pointer;
                    newTsObject.code3d += index.code3d;
                    newTsObject.code3d += counter + ' = 0;\n';
                    newTsObject.code3d += position + ' = '+this.obj.pointer+';\n';
                    newTsObject.code3d += startLabel + ':\n';
                    newTsObject.code3d += 'if('+index.pointer+'=='+counter+') goto '+valueLabel+';/////////\n';
                    newTsObject.code3d += counter + '='+counter+' +1;\n';
                    newTsObject.code3d += position + '='+position+' +2;\n';
                    newTsObject.code3d += 'goto '+startLabel+';\n';
                    newTsObject.code3d += valueLabel + ':\n';
                    newTsObject.code3d += cond +'=Heap[(int)'+position+'];\n';
                    //newTsObject.code3d += 'if('+cond+'==-1) goto '+numberLabel+';\n';
                    /*newTsObject.code3d += 'if('+cond+'==-2) goto '+booleanLabel+';\n';
                    newTsObject.code3d += 'if('+cond+'==-30) goto '+stringLabel+';\n';*/
                    newTsObject.code3d += 'if('+cond+'==-4) goto '+arrayLabel+';\n';
                    newTsObject.code3d += 'if('+cond+'==-5) goto '+typeLabel+';\n';
    
                    newTsObject.code3d += primLabel + ':\n';
                    newTsObject.code3d += position + '='+ position + '+1;\n';
                    newTsObject.code3d += pointer + '=Heap[(int)'+position+'];\n'
                    newTsObject.code3d += 'goto '+exitLabel+';\n';
    
                    
                    newTsObject.code3d += arrayLabel + ':\n';
                    newTsObject.code3d += position + '='+ position + '+1;\n';
                    newTsObject.code3d += pointer + '=Heap[(int)'+position+'];\n'
                    //newTsObject.code3d += pointer + '=Stack[(int)'+pointer+'];\n'
                    let outLabel = 'L' + scope.getNewLabel();
                    let endTemp = 't' + scope.getNewTemp();
    
                   // console.log(this.obj);
                    if(this.obj.list.length > 0) {
                        newTsObject.isArray = true;
                        newTsObject.arrFinal = endTemp;
                        this.obj.list.forEach(element => {
                            newTsObject.code3d += endTemp + '='+element.fin+';\n';
                            newTsObject.code3d += 'if('+element.pointer+'=='+pointer+')goto '+outLabel+';\n';
                        });
                    }
                    
                   
                    newTsObject.code3d += outLabel + ':\n';
                    newTsObject.code3d += 'goto '+exitLabel+';\n';
    
    
                    newTsObject.code3d += typeLabel + ':\n';
                    newTsObject.code3d += position + '='+ position + '+1;\n';
                    //FALTA
                    newTsObject.code3d += 'goto '+exitLabel+';\n';
    
                    newTsObject.code3d += exitLabel + ':\n';
    
                    if(this.auxP) {
                        this.auxP.obj = newTsObject;
                        //console.log(newTsObject);
                        const auxPRes = this.auxP.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
                        //newTsObject.code3d += auxPRes.code3d;
                        //newTsObject.isArray = auxPRes.isArray;
                        //newTsObject.arrFinal = auxPRes.arrFinal;
                        //newTsObject.pointer = auxPRes.pointer;
                        
                        return auxPRes;
                    }
    
                    return newTsObject;
                } else {
                    console.log("La posicion del arreglo debe ser un tipo number");
                }
    
            } else {
                //Type
            }
        }

        

    }
}
module.exports = List;
},{"./tsObject":33}],20:[function(require,module,exports){
const tsObject = require('./tsObject');

class Logical {
    constructor(nodeLeft,nodeRight,op,line,column) {
        this.nodeLeft = nodeLeft;
        this.nodeRight = nodeRight;
        this.op = op;
        this.line = line;
        this.column = column;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        switch(this.op) {
            case '||':
                return this.or(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            case '&&':
                return this.and(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            case '!':
                return this.not(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        }
    }

    or(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        let type = null;
        if(obj1 == null || obj2 == null || obj1 == undefined || obj2 == undefined) {
            console.log("ERROR");
            return;
        }      
        
        if(obj1.type == 'boolean'&& obj2.type=='boolean'){type = 'boolean';}
        else{
            console.log("ERROR tipos");
            return;
        }

        let newTSObject = new tsObject(0,0,null,type);
        newTSObject.code3d += obj1.code3d;
        newTSObject.code3d += obj2.code3d;
        let l1temp = 'L'+scope.getNewLabel()
        let l3temp = 'L'+scope.getNewLabel()
        let newTemp = 't'+scope.getNewTemp()
        newTSObject.code3d += 'if('+obj1.pointer+') goto '+l1temp+';\n';
        newTSObject.code3d += 'if('+obj2.pointer+') goto '+l1temp+';\n';
        newTSObject.code3d += newTemp + ' = 0;\n';
        newTSObject.code3d += 'goto ' + l3temp + ';\n';
        newTSObject.code3d += l1temp + ':\n';
        newTSObject.code3d += newTemp + '= 1;\n';
        newTSObject.code3d += 'goto ' + l3temp + ';\n';
        newTSObject.code3d += l3temp + ':\n\n\n';
        newTSObject.pointer = newTemp;

        return newTSObject;
    }

    and(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        let type = null;
        if(obj1 == null || obj2 == null || obj1 == undefined || obj2 == undefined) {
            console.log("ERROR");
            return;
        }      
        
        if(obj1.type == 'boolean'&& obj2.type=='boolean'){type = 'boolean';}
        else{
            console.log("ERROR tipos");
            return;
        }

        let newTSObject = new tsObject(0,0,null,type);
        newTSObject.code3d += obj1.code3d;
        newTSObject.code3d += obj2.code3d;
        let l1temp = 'L'+scope.getNewLabel()
        let l3temp = 'L'+scope.getNewLabel()
        let newTemp = 't'+scope.getNewTemp()
        newTSObject.code3d += 'if('+obj1.pointer+'== 0) goto '+l1temp+';\n';
        newTSObject.code3d += 'if('+obj2.pointer+'== 0) goto '+l1temp+';\n';
        newTSObject.code3d += newTemp + ' = 1;\n';
        newTSObject.code3d += 'goto ' + l3temp + ';\n';
        newTSObject.code3d += l1temp + ':\n';
        newTSObject.code3d += newTemp + '= 0;\n';
        newTSObject.code3d += 'goto ' + l3temp + ';\n';
        newTSObject.code3d += l3temp + ':\n\n\n';
        newTSObject.pointer = newTemp;
        
        return newTSObject;
    }

    not(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {

        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        let type = null;
        if(obj1 == null || obj1 == undefined) {
            console.log("ERROR");
            return;
        }      
        
        if(obj1.type == 'boolean'){type = 'boolean';}
        else{
            console.log("ERROR tipos");
            return;
        }

        let newTSObject = new tsObject(0,0,null,type);
        newTSObject.code3d += obj1.code3d;
        let l1temp = 'L'+scope.getNewLabel()
        let l3temp = 'L'+scope.getNewLabel()
        let newTemp = 't'+scope.getNewTemp()
        newTSObject.code3d += 'if('+obj1.pointer+') goto '+l1temp+';\n';
        newTSObject.code3d += newTemp + ' = 1;\n';
        newTSObject.code3d += 'goto ' + l3temp + ';\n';
        newTSObject.code3d += l1temp + ':\n';
        newTSObject.code3d += newTemp + '= 0;\n';
        newTSObject.code3d += 'goto ' + l3temp + ';\n';
        newTSObject.code3d += l3temp + ':\n\n\n';
        newTSObject.pointer = newTemp;
        
        return newTSObject;
    }
}

module.exports = Logical;
},{"./tsObject":33}],21:[function(require,module,exports){
const tsObject = require('./tsObject')

class Operation {

    constructor(nodeLeft,nodeRight,op,line,column) {
        this.nodeLeft = nodeLeft;
        this.nodeRight = nodeRight;
        this.op = op;
        this.line = line;
        this.column = column;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        switch(this.op) {
            case '+':
                return this.add(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            case '-':
                return this.sub(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            case '*':
                return this.mul(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            case '/':
                return this.div(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            case '**':
                return this.pow(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            case '%':
                return this.mod(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            case '--':
                return this.neg(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        }
    }

    add(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        let newTsObject;
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        
        if(obj1.type == 'number' && obj2.type == 'number') {
            this.type = 'number';
        } else if (obj1.type == 'string' && obj2.type == 'string') {
            
            this.type = 'string'

        } else if (obj1.type == 'string' && obj2.type == 'number') {
            
            this.type = 'string'
            let actualPointer = 't' + scope.getNewTemp();
            let stringPos = 't' + scope.getNewTemp();
            obj2.code3d += actualPointer + '=H;\n';
            obj2.code3d += stringPos + '=H;\n';
            obj2.code3d += 'Heap[(int)' + stringPos + '] = -1;\n';
            obj2.code3d += stringPos + '=' + stringPos + '+1;\n';
            obj2.code3d += 'Heap[(int)' + stringPos + '] = ' + obj2.pointer + ';\n';
            obj2.code3d += stringPos + '=' + stringPos + '+1;\n';
            obj2.code3d += 'Heap[(int)' + stringPos + '] = ' + '\0'.charCodeAt(0)+ ';\n';
            obj2.code3d += stringPos + '=' + stringPos + '+1;\n';
            obj2.code3d += 'H=' + stringPos + ';\n';
            obj2.pointer = actualPointer;

        } else if (obj1.type == 'string' && obj2.type == 'boolean') {
            
            this.type = 'string'
            let actualPointer = 't' + scope.getNewTemp();
            let boolPos = 't' + scope.getNewTemp();
            obj2.code3d += actualPointer + '=H;\n';
            obj2.code3d += boolPos + '=H;\n';
            
            let falseLabel = 'L' + scope.getNewLabel();
            let trueLabel = 'L' + scope.getNewLabel();
            let exitLabel = 'L' + scope.getNewLabel();

            //obj2.code3d += 'Heap[(int)' + boolPos + '] = -3;\n';
            //obj2.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj2.code3d += 'if(' + obj2.pointer + '== 0) goto '+falseLabel+';\n';
            obj2.code3d += 'goto ' + trueLabel +';\n';
            obj2.code3d += falseLabel + ':\n';
            obj2.code3d += 'Heap[(int)'+boolPos+']='+'f'.charCodeAt(0)+';\n'
            obj2.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj2.code3d += 'Heap[(int)'+boolPos+']='+'a'.charCodeAt(0)+';\n'
            obj2.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj2.code3d += 'Heap[(int)'+boolPos+']='+'l'.charCodeAt(0)+';\n'
            obj2.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj2.code3d += 'Heap[(int)'+boolPos+']='+'s'.charCodeAt(0)+';\n'
            obj2.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj2.code3d += 'Heap[(int)'+boolPos+']='+'e'.charCodeAt(0)+';\n'
            obj2.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj2.code3d += 'Heap[(int)'+boolPos+']='+'\0'.charCodeAt(0)+';\n'
            obj2.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj2.code3d += 'goto ' +exitLabel + ';\n';
            
            obj2.code3d += trueLabel + ':\n';
            obj2.code3d += 'Heap[(int)'+boolPos+']='+'t'.charCodeAt(0)+';\n'
            obj2.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj2.code3d += 'Heap[(int)'+boolPos+']='+'r'.charCodeAt(0)+';\n'
            obj2.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj2.code3d += 'Heap[(int)'+boolPos+']='+'u'.charCodeAt(0)+';\n'
            obj2.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj2.code3d += 'Heap[(int)'+boolPos+']='+'e'.charCodeAt(0)+';\n'
            obj2.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj2.code3d += 'Heap[(int)'+boolPos+']='+'\0'.charCodeAt(0)+';\n'
            obj2.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj2.code3d += 'goto ' +exitLabel + ';\n';
            obj2.code3d += exitLabel + ':\n\n';

            obj2.code3d += 'H=' + boolPos + ';\n';
            obj2.pointer = actualPointer;

        } else if (obj1.type == 'number' && obj2.type == 'string') {
            
            this.type = 'string'
            let actualPointer = 't' + scope.getNewTemp();
            let stringPos = 't' + scope.getNewTemp();
            obj1.code3d += actualPointer + '=H;\n';
            obj1.code3d += stringPos + '=H;\n';

            obj1.code3d += 'Heap[(int)' + stringPos + '] = -1;\n';
            obj1.code3d += stringPos + '=' + stringPos + '+1;\n';
            obj1.code3d += 'Heap[(int)' + stringPos + '] = ' + obj1.pointer + ';\n';
            obj1.code3d += stringPos + '=' + stringPos + '+1;\n';
            obj1.code3d += 'Heap[(int)' + stringPos + '] = ' + '\0'.charCodeAt(0)+ ';\n';
            obj1.code3d += stringPos + '=' + stringPos + '+1;\n';
            obj1.code3d += 'H=' + stringPos + ';\n';
            obj1.pointer = actualPointer;
        
        } else if (obj1.type == 'boolean' && obj2.type == 'string') {
            
            this.type = 'string'
            
            let actualPointer = 't' + scope.getNewTemp();
            let boolPos = 't' + scope.getNewTemp();
            obj1.code3d += actualPointer + '=H;\n';
            obj1.code3d += boolPos + '=H;\n';
            
            let falseLabel = 'L' + scope.getNewLabel();
            let trueLabel = 'L' + scope.getNewLabel();
            let exitLabel = 'L' + scope.getNewLabel();

            //obj1.code3d += 'Heap[(int)' + boolPos + '] = -3;\n';
            //obj1.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj1.code3d += 'if(' + obj1.pointer + '== 0) goto '+falseLabel+';\n';
            obj1.code3d += 'goto ' + trueLabel +';\n';
            obj1.code3d += falseLabel + ':\n';
            obj1.code3d += 'Heap[(int)'+boolPos+']='+'f'.charCodeAt(0)+';\n'
            obj1.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj1.code3d += 'Heap[(int)'+boolPos+']='+'a'.charCodeAt(0)+';\n'
            obj1.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj1.code3d += 'Heap[(int)'+boolPos+']='+'l'.charCodeAt(0)+';\n'
            obj1.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj1.code3d += 'Heap[(int)'+boolPos+']='+'s'.charCodeAt(0)+';\n'
            obj1.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj1.code3d += 'Heap[(int)'+boolPos+']='+'e'.charCodeAt(0)+';\n'
            obj1.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj1.code3d += 'Heap[(int)'+boolPos+']='+'\0'.charCodeAt(0)+';\n'
            obj1.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj1.code3d += 'goto ' +exitLabel + ';\n';
            
            obj1.code3d += trueLabel + ':\n';
            obj1.code3d += 'Heap[(int)'+boolPos+']='+'t'.charCodeAt(0)+';\n'
            obj1.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj1.code3d += 'Heap[(int)'+boolPos+']='+'r'.charCodeAt(0)+';\n'
            obj1.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj1.code3d += 'Heap[(int)'+boolPos+']='+'u'.charCodeAt(0)+';\n'
            obj1.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj1.code3d += 'Heap[(int)'+boolPos+']='+'e'.charCodeAt(0)+';\n'
            obj1.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj1.code3d += 'Heap[(int)'+boolPos+']='+'\0'.charCodeAt(0)+';\n'
            obj1.code3d += boolPos + '=' + boolPos + '+1;\n';
            obj1.code3d += 'goto ' +exitLabel + ';\n';
            obj1.code3d += exitLabel + ':\n\n';

            obj1.code3d += 'H=' + boolPos + ';\n';
            obj1.pointer = actualPointer;


        } else {
            console.log("ERROR")
            return;
        }

        if(this.type == 'string') {

            newTsObject = new tsObject(0,0,null,this.type);
            newTsObject.code3d += obj1.code3d;
            newTsObject.code3d += obj2.code3d;
            
            let actualPointer = 't'+scope.getNewTemp();
            let newActualPointer = 't' + scope.getNewTemp();
            let temp = 't' + scope.getNewTemp();
            let auxTemp = 't'+scope.getNewTemp();
            let stringPos1 = 't' + scope.getNewTemp();
            let stringPos2 = 't' + scope.getNewTemp();
            let leftString = 'L' + scope.getNewLabel();
            let exitLeftString = 'L' + scope.getNewLabel();
            let rigthString = 'L' + scope.getNewLabel();
            let exitRigthString = 'L' + scope.getNewLabel();
            let exitLabel = 'L' + scope.getNewLabel();

            newTsObject.code3d += actualPointer + '=H;\n';
            newTsObject.code3d += newActualPointer + '=H;\n';
            newTsObject.code3d += stringPos1 + '=' + obj1.pointer + ';\n';
            //newObject.code3d += 'Aqui pongo el apuntador 1\n';
            newTsObject.code3d += stringPos2 + '=' + obj2.pointer + ';\n';
            //newObject.code3d += 'Aqui pongo el apuntador 2\n';

            newTsObject.code3d += leftString + ':\n';
            newTsObject.code3d += temp + '= Heap[(int)' + stringPos1 + '];\n';
            newTsObject.code3d += 'if('+ temp +' == ' + '\0'.charCodeAt(0) + ') goto ' + exitLeftString +';\n';
            newTsObject.code3d += 'Heap[(int)' + newActualPointer + '] = ' + temp + ';\n';
            newTsObject.code3d += newActualPointer + '=' + newActualPointer + '+1;\n';
            newTsObject.code3d += stringPos1 + '=' + stringPos1 + '+1;\n';
            //newObject.code3d += temp + '= Heap[' + newActualPointer + '];\n';
            newTsObject.code3d += 'goto ' + leftString + ';\n';
            newTsObject.code3d += exitLeftString + ':\n\n';
            
            newTsObject.code3d += rigthString + ':\n';
            newTsObject.code3d += temp + ' = Heap[(int)' + stringPos2 + '];\n';
            newTsObject.code3d += 'if('+ temp + ' == ' + '\0'.charCodeAt(0) + ') goto ' + exitLabel +';\n';
            newTsObject.code3d += 'Heap[(int)' + newActualPointer + '] = ' + temp + ';\n';
            newTsObject.code3d += newActualPointer + '=' + newActualPointer + '+1;\n';
            newTsObject.code3d += stringPos2 + '=' + stringPos2 + '+1;\n';
            newTsObject.code3d += 'goto ' + rigthString + ';\n';
            newTsObject.code3d += exitLabel + ':\n';
            newTsObject.code3d += 'Heap[(int)' + newActualPointer +'] = ' + '\0'.charCodeAt(0) + ';\n';
            newTsObject.code3d += newActualPointer + '=' + newActualPointer + '+ 1;\n';
            newTsObject.code3d += 'H = ' + newActualPointer + ';\n\n';
            newTsObject.pointer = actualPointer;
            
            
        } else {
            newTsObject = new tsObject(0,0,null,this.type);
            newTsObject.code3d += obj1.code3d;
            newTsObject.code3d += obj2.code3d;
            let newTemp = 't' + scope.getNewTemp()
            newTsObject.pointer = newTemp;
            newTsObject.code3d += newTemp + '=' + obj1.pointer + '+' + obj2.pointer + ';\n';
        }
        return newTsObject
    }

    sub(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        let newTsObject;
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        if(obj1.type == 'number' && obj2.type == 'number') {
            this.type = 'number';
        } else {
            console.log("ERROR")
            return null;
        }

        newTsObject = new tsObject(0,0,null,this.type);
        newTsObject.code3d += obj1.code3d;
        newTsObject.code3d += obj2.code3d;
        let newTemp = 't' + scope.getNewTemp()
        newTsObject.pointer = newTemp;
        newTsObject.code3d += newTemp + '=' + obj1.pointer + '-' + obj2.pointer + ';\n';
        
        return newTsObject;
    }

    mul(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        let newTsObject;
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        if(obj1.type == 'number' && obj2.type == 'number') {
            this.type = 'number';
        } else {
            console.log("ERROR")
            return null;
        }

        newTsObject = new tsObject(0,0,null,this.type);
        newTsObject.code3d += obj1.code3d;
        newTsObject.code3d += obj2.code3d;
        let newTemp = 't' + scope.getNewTemp()
        newTsObject.pointer = newTemp;
        newTsObject.code3d += newTemp + '=' + obj1.pointer + '*' + obj2.pointer + ';\n';
        
        return newTsObject;
    }

    div(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        let newTsObject;
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        if(obj1.type == 'number' && obj2.type == 'number') {
            this.type = 'number';
        } else {
            console.log("ERROR")
            return null;
        }

        newTsObject = new tsObject(0,0,null,this.type);
        newTsObject.code3d += obj1.code3d;
        newTsObject.code3d += obj2.code3d;
        let newTemp = 't' + scope.getNewTemp()
        newTsObject.pointer = newTemp;
        newTsObject.code3d += newTemp + '=' + obj1.pointer + '/' + obj2.pointer + ';\n';
        
        return newTsObject;
    }

    mod(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        let newTsObject;
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        if(obj1.type == 'number' && obj2.type == 'number') {
            this.type = 'number';
        } else {
            console.log("ERROR")
            return null;
        }

        newTsObject = new tsObject(0,0,null,this.type);
        newTsObject.code3d += obj1.code3d;
        newTsObject.code3d += obj2.code3d;
        let newTemp = 't' + scope.getNewTemp()
        newTsObject.pointer = newTemp;
        newTsObject.code3d += newTemp + '=' + obj1.pointer + '%' + obj2.pointer + ';\n';
        
        return newTsObject;
    }

    neg(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        let newTsObject;
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        if(obj1.type == 'number') {
            this.type = 'number';
        } else {
            console.log("ERROR")
            return null;
        }

        newTsObject = new tsObject(0,0,null,this.type);
        newTsObject.code3d += obj1.code3d;
        let newTemp = 't' + scope.getNewTemp()
        newTsObject.pointer = newTemp;
        newTsObject.code3d += newTemp + '= -' + obj1.pointer + ';\n';
        
        return newTsObject;
    }

    pow(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        let newTsObject;
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        if(obj1.type == 'number' && obj2.type == 'number') {
            this.type = 'number';
        } else {
            console.log("ERROR")
            return null;
        }

        newTsObject = new tsObject(0,0,null,this.type);
        newTsObject.code3d+=obj1.code3d;
        newTsObject.code3d+=obj2.code3d;


        let newTemp = 't'+scope.getNewTemp();
        let ceroLabel = 'L' + scope.getNewLabel();
        let initLabel = 'L' + scope.getNewLabel();
        let powLabel = 'L'  + scope.getNewLabel();
        newTsObject.pointer = newTemp;
        

        newTsObject.code3d += newTemp + '=' + '1' + ';\n';
        
        let tempCounter = 't'+scope.getNewTemp();
        newTsObject.code3d += tempCounter + '= 0;\n';
        let exp = 't'+scope.getNewTemp();
        newTsObject.code3d += exp + '='+ obj2.pointer + '-1;\n'
        
        newTsObject.code3d += 'if(' + obj2.pointer + ' == 0) goto ' + ceroLabel + ';\n';
        newTsObject.code3d += newTemp + '='+ obj1.pointer + ';\n';
        newTsObject.code3d += 'if(' + obj2.pointer + ' > 0) goto ' + powLabel + ';\n';

        newTsObject.code3d += powLabel + ':\n';
        newTsObject.code3d += newTemp + '=' + newTemp + '*' + obj1.pointer + ';\n';
        newTsObject.code3d += tempCounter + '=' + tempCounter + '+1;\n';
        newTsObject.code3d += initLabel + ':\n'; 
        newTsObject.code3d += 'if(' + tempCounter + '==' + exp + ') goto ' + ceroLabel +';\n';
        newTsObject.code3d += 'goto '+powLabel + ';\n'; 
        newTsObject.code3d += ceroLabel + ':\n\n';
        
        

        return newTsObject;
    }
}

module.exports = Operation;
},{"./tsObject":33}],22:[function(require,module,exports){
const tsObject = require('./tsObject');
class Print {

    constructor(value,line){
        this.pointer = null;
        this.type = null;
        this.value = value;
        this.line = line;
        this.code3d = '';
        this.dataType = 'print';
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
            
        let printValue = this.value[0].translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        
        this.code3d = '';
        //console.log(printValue);
        if(printValue === null || printValue === undefined) {
            //add to errors table
            console.log('ERROR en print')
            
            return;
        }
        //console.log(printValue)
        this.code3d += printValue.code3d;
        if(printValue.isArray) {

            let counterTemp = 't' + scope.getNewTemp(); 
            let finalPosition = 't' + scope.getNewTemp();
            let condTemp = 't' + scope.getNewTemp();
            let auxTemp = 't' + scope.getNewTemp();
            let comaTemp = 't' + scope.getNewTemp();
            let countCommaTemp = 't' + scope.getNewTemp();
            //let secondTemp = 't' + scope.getNewTemp();
            let newObj = null;
            let pclone = null;
            let list = null;

            
            let loopArray = 'L' + scope.getNewLabel();
            let exitLable = 'L' + scope.getNewLabel();
            let intLabel = 'L' + scope.getNewLabel();
            let boolLabel = 'L' + scope.getNewLabel();
            let stringLabel = 'L' + scope.getNewLabel();
            let arrayLabel = 'L' + scope.getNewLabel();
            let typeLabel = 'L' + scope.getNewLabel();
            let commaLabel = 'L' + scope.getNewLabel();

            this.code3d += 'printf("[");\n';
            //this.code3d += counterTemp + ' = Stack[(int)' + printValue.pointer + '];\n';
            this.code3d += counterTemp + ' ='+ printValue.pointer + ';\n';
            this.code3d += finalPosition + ' = '+printValue.arrFinal+';\n';
            this.code3d += countCommaTemp + '=0;\n';

            this.code3d += loopArray + ':\n';
            this.code3d += condTemp + '= ' + counterTemp + ' == ' + finalPosition + ';\n';
            this.code3d += 'if('+condTemp+') goto '+exitLable+';\n';

            this.code3d += comaTemp + '='+countCommaTemp+' == 0;\n';
            this.code3d += 'if('+comaTemp+')goto '+commaLabel+';\n';
            this.code3d += 'printf(",");\n'
            this.code3d += commaLabel + ':\n';
            this.code3d += countCommaTemp + '=' + countCommaTemp + '+1;\n';


            this.code3d += auxTemp + ' = Heap[(int)'+counterTemp+'];\n';
            //condiciones
            this.code3d += condTemp + '= '+auxTemp+' == -1;\n';
            this.code3d += 'if('+condTemp+') goto '+intLabel+';\n';
            this.code3d += condTemp + '= '+auxTemp+' == -2;\n';
            this.code3d += 'if('+condTemp+') goto '+boolLabel+';\n';
            this.code3d += condTemp + '= '+auxTemp+' == -30;\n';
            this.code3d += 'if('+condTemp+') goto '+stringLabel+';\n';
            this.code3d += condTemp + '= '+auxTemp+' == -4;\n';
            this.code3d += 'if('+condTemp+') goto '+arrayLabel+';\n';
            this.code3d += condTemp + '= '+auxTemp+' == -5;\n';
            this.code3d += 'if('+condTemp+') goto '+typeLabel+';\n';

            this.code3d += intLabel + ':\n';//INT LABEL
            this.code3d += counterTemp + ' = ' + counterTemp + ' + 1;\n';
            this.code3d += auxTemp + '=Heap[(int)'+counterTemp+'];\n'//puntero
            this.code3d += 'printf("%f",'+auxTemp+');\n';
            //this.code3d += 'printf(",");\n';
            this.code3d += counterTemp + ' = ' + counterTemp + ' + 1;\n';
            this.code3d += 'goto '+loopArray+';\n';//FIN INT LABEL

            this.code3d += boolLabel + ':\n';//BOOL LABEL
            this.code3d += counterTemp + ' = ' + counterTemp + ' + 1;\n';
            this.code3d += auxTemp + '=Heap[(int)'+counterTemp+'];\n'//puntero
            newObj = new tsObject(0,0,null,'boolean');
            newObj.pointer = auxTemp;
            pclone = new Print([newObj]);
            pclone = pclone.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
            this.code3d += pclone.code3d;
            //this.code3d += 'printf(",");\n';
            this.code3d += counterTemp + ' = ' + counterTemp + ' + 1;\n';
            this.code3d += 'goto '+loopArray+';\n';//FIN BOOL LABEL


            this.code3d += stringLabel + ':\n';
            this.code3d += counterTemp + ' = ' + counterTemp + ' + 1;\n';
            this.code3d += auxTemp + '=Heap[(int)'+counterTemp+'];\n'//puntero
            newObj = new tsObject(0,0,null,'string');
            newObj.pointer = auxTemp;
            pclone = new Print([newObj]);
            pclone = pclone.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
            this.code3d += pclone.code3d;
            this.code3d += counterTemp + ' = ' + counterTemp + ' + 1;\n';
            this.code3d += 'goto '+loopArray+';\n';//FIN BOOL LABEL
            

            this.code3d += arrayLabel + ':\n';//INITial ARRAY
            //this.code3d += 'printf("\\n[");\n';
            
            if(printValue.list.length > 0) {
                let count = 0;
                printValue.list.forEach(val => {
                    if(count > 0) {
                        this.code3d += 'printf(",");\n';
                    }
                    list = val;
                    //console.log(list);
                    this.code3d += counterTemp + ' = ' + counterTemp + ' + 1;\n';
                    this.code3d += auxTemp + '=Heap[(int)'+counterTemp+'];\n'//puntero
                    //this.code3d += auxTemp + '=Stack[(int)'+auxTemp+'];\n'//puntero
                    newObj = new tsObject(0,0,null,list.tipo);
                    newObj.pointer = auxTemp;
                    newObj.arrFinal = list.fin;
                    newObj.isArray = true;
                    pclone = new Print([newObj]);
                    pclone = pclone.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
                    this.code3d += pclone.code3d;
                    this.code3d += counterTemp + ' = ' + counterTemp + ' + 1;\n';
                    count++;
                });

                /*console.log(printValue);
                list = printValue.list.pop();
                console.log(list);*/
                
                
            }
            //this.code3d += 'printf("]");\n';
            this.code3d += 'goto '+loopArray+';\n';//FIN ARRAY

            this.code3d += typeLabel + ':\n';

            this.code3d += exitLable + ':\n\n';
            this.code3d += 'printf("]");\n';

        }else if(printValue.type == 'number') {
            this.code3d += 'printf("%f",' + printValue.pointer + ');\n';
            //this.code3d += 'printf("\\n");\n';
        } else if(printValue.type === 'string') {

            let stringPointer = 't'+scope.getNewTemp();
            this.code3d += stringPointer + '=' + printValue.pointer+';\n';
            let stringLabel = 'L'+scope.getNewLabel();
            let integerLabel = 'L' + scope.getNewLabel();
            let doubleLabel = 'L' + scope.getNewLabel();
            let booleanLabel = 'L' + scope.getNewLabel();
            let endStringLabel = 'L' + scope.getNewLabel();
            let endLabel = 'L' + scope.getNewLabel();
            
            let temp = 't'+scope.getNewTemp(); 
            this.code3d+= stringLabel +':\n';
            this.code3d+=temp + '=Heap[(int)'+stringPointer+'];\n';
            this.code3d+='if('+temp + '==' +'\0'.charCodeAt(0) + ') goto ' + endStringLabel + ';\n';
            this.code3d+= 'if('+temp + '=='+ '-1) goto ' + integerLabel + ';\n';
            this.code3d+= 'if('+temp + '=='+ '-2) goto ' + doubleLabel + ';\n';
            this.code3d+= 'if('+temp + '=='+ '-3) goto ' + booleanLabel + ';\n';
            this.code3d+= 'printf("%c",(int)'+temp+');\n';
            this.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
            this.code3d+= 'goto ' + stringLabel + ';\n';

            this.code3d+= integerLabel + ':\n';
            this.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
            this.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
            this.code3d+= 'printf("%f",'+temp+');\n';
            this.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
            this.code3d+= 'goto ' + stringLabel + ';\n';
            
            this.code3d+= doubleLabel + ':\n';
            this.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
            this.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
            this.code3d+= 'printf("%f",'+temp+');\n';
            this.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
            this.code3d+= 'goto ' + stringLabel + ';\n';
            
            this.code3d+= booleanLabel + ':\n';
                this.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                this.code3d+= temp + '=Heap[(int)'+stringPointer+'];\n';
                this.code3d+= 'printf("%c",(int)'+temp+');\n';
                this.code3d+= 'goto ' + endLabel + ';\n';
                
                
                this.code3d+= endLabel + ':\n';
                this.code3d+= stringPointer + '=' + stringPointer + '+1;\n';
                this.code3d+= 'goto ' + stringLabel + ';\n';

            this.code3d+=endStringLabel+':\n\n';
                
        } else if(printValue.type === 'boolean') {
            let labelTrue = 'L'+scope.getNewLabel();
            let labelFalse = 'L'+scope.getNewLabel();
            let exitLabel = 'L'+scope.getNewLabel();
            this.code3d += 'if(' + printValue.pointer  + '== 1)goto '+ labelTrue +';\n'
            this.code3d += labelFalse + ':\n';
            this.code3d += 'printf("%c",102);\n';
            this.code3d += 'printf("%c",97);\n';
            this.code3d += 'printf("%c",108);\n';
            this.code3d += 'printf("%c",115);\n';
            this.code3d += 'printf("%c",101);\n';
            this.code3d += 'goto ' + exitLabel + ';\n';
            this.code3d += labelTrue + ':\n';
            this.code3d += 'printf("%c",116);\n';
            this.code3d += 'printf("%c",114);\n';
            this.code3d += 'printf("%c",117);\n';
            this.code3d += 'printf("%c",101);\n\n';

            this.code3d += exitLabel + ':\n\n\n';
        } 
        return this;
    }

}
module.exports = Print;
},{"./tsObject":33}],23:[function(require,module,exports){
const tsObject = require('./tsObject')

class Relational {
    constructor(nodeLeft,nodeRight,op,line,column) {
        this.nodeLeft = nodeLeft;
        this.nodeRight = nodeRight;
        this.op = op;
        this.line = line;
        this.column = column;
    }
    
    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        switch(this.op) {
            case '>':
                return this.greater(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            case '<':
                return this.less(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            case '>=':
                return this.greaterE(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            case '<=':
                return this.lessE(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            case '==':
                return this.equal(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            case '!=':
                return this.notEqual(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        }
    }

    greater(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        let type = null;
        if(obj1 == null || obj2 == null || obj1 == undefined || obj2 == undefined) {
            console.log("ERROR");
            return;
        }      
        
        
        if(obj1.type == 'number'&& obj2.type=='number'){type = 'boolean';}
        else if(obj1.type == 'number'&& obj2.type=='boolean'){type = 'boolean';}
        else if(obj1.type == 'boolean'&& obj2.type=='number'){type = 'boolean';}
        else if(obj1.type == 'boolean'&& obj2.type=='boolean'){type = 'boolean';}
        else{
            console.log("ERROR tipos");
            return;
        }
        

       

        let newTSObject = new tsObject(0,0,null,type);
        newTSObject.code3d += obj1.code3d;
        newTSObject.code3d += obj2.code3d;
        let newTemp = 't' + scope.getNewTemp()
        newTSObject.pointer = newTemp;
        newTSObject.code3d += newTemp + '=' + obj1.pointer + '>' + obj2.pointer + ';\n';
        
        return newTSObject;
    }

    less(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        let type = null;
        if(obj1 == null || obj2 == null || obj1 == undefined || obj2 == undefined) {
            console.log("ERROR");
            return;
        }      
        
        
        if(obj1.type == 'number'&& obj2.type=='number'){type = 'boolean';}
        else if(obj1.type == 'number'&& obj2.type=='boolean'){type = 'boolean';}
        else if(obj1.type == 'boolean'&& obj2.type=='number'){type = 'boolean';}
        else if(obj1.type == 'boolean'&& obj2.type=='boolean'){type = 'boolean';}
        else{
            console.log("ERROR tipos");
            return;
        }

        let newTSObject = new tsObject(0,0,null,type);
        newTSObject.code3d += obj1.code3d;
        newTSObject.code3d += obj2.code3d;
        let newTemp = 't' + scope.getNewTemp()
        newTSObject.pointer = newTemp;
        newTSObject.code3d += newTemp + '=' + obj1.pointer + '<' + obj2.pointer + ';\n';
        
        return newTSObject;
    }

    greaterE(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        let type = null;
        if(obj1 == null || obj2 == null || obj1 == undefined || obj2 == undefined) {
            console.log("ERROR");
            return;
        }      
        
        
        if(obj1.type == 'number'&& obj2.type=='number'){type = 'boolean';}
        else if(obj1.type == 'number'&& obj2.type=='boolean'){type = 'boolean';}
        else if(obj1.type == 'boolean'&& obj2.type=='number'){type = 'boolean';}
        else if(obj1.type == 'boolean'&& obj2.type=='boolean'){type = 'boolean';}
        else{
            console.log("ERROR tipos");
            return;
        }
        
        let newTSObject = new tsObject(0,0,null,type);
        newTSObject.code3d += obj1.code3d;
        newTSObject.code3d += obj2.code3d;
        let newTemp = 't' + scope.getNewTemp()
        newTSObject.pointer = newTemp;
        newTSObject.code3d += newTemp + '=' + obj1.pointer + '>=' + obj2.pointer + ';\n';
        
        return newTSObject;
    }

    lessE(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        let type = null;
        if(obj1 == null || obj2 == null || obj1 == undefined || obj2 == undefined) {
            console.log("ERROR");
            return;
        }      
        
        
        if(obj1.type == 'number'&& obj2.type=='number'){type = 'boolean';}
        else if(obj1.type == 'number'&& obj2.type=='boolean'){type = 'boolean';}
        else if(obj1.type == 'boolean'&& obj2.type=='number'){type = 'boolean';}
        else if(obj1.type == 'boolean'&& obj2.type=='boolean'){type = 'boolean';}
        else{
            console.log("ERROR tipos");
            return;
        }
        
        let newTSObject = new tsObject(0,0,null,type);
        newTSObject.code3d += obj1.code3d;
        newTSObject.code3d += obj2.code3d;
        let newTemp = 't' + scope.getNewTemp()
        newTSObject.pointer = newTemp;
        newTSObject.code3d += newTemp + '=' + obj1.pointer + '<=' + obj2.pointer + ';\n';
        
        return newTSObject;
    }

    equal(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {

        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        let type = null;
        let kind = null;
        if(obj1 == null || obj2 == null || obj1 == undefined || obj2 == undefined) {
            console.log("ERROR");
            return;
        }      
        
        if(obj1.isArray && obj2.type == 'null') {
            type = 'boolean';
            let newTSObject = new tsObject(0,0,null,type);
                newTSObject.code3d += obj1.code3d;
                newTSObject.code3d += obj2.code3d;
                let newTemp = 't' + scope.getNewTemp()
                let stringPointer = 't' + scope.getNewTemp();
                let lbl1 = 'L' + scope.getNewLabel()
                let lbl2 = 'L' + scope.getNewLabel()
                
                newTSObject.code3d += stringPointer + '=Heap[(int)'+obj1.pointer+'];\n';
                newTSObject.code3d += 'if(' + stringPointer + '==' + obj2.pointer+') goto '+lbl1+';\n'
                newTSObject.code3d += newTemp + '=0;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl1 +':\n';
                newTSObject.code3d += newTemp + '=1;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl2 +':\n\n\n';
                newTSObject.pointer = newTemp;
                
                return newTSObject;
        } else if(obj2.isArray && obj1.type == 'null') {
            type = 'boolean';
            let newTSObject = new tsObject(0,0,null,type);
                newTSObject.code3d += obj1.code3d;
                newTSObject.code3d += obj2.code3d;
                let newTemp = 't' + scope.getNewTemp()
                let stringPointer = 't' + scope.getNewTemp();
                let lbl1 = 'L' + scope.getNewLabel()
                let lbl2 = 'L' + scope.getNewLabel()
                
                newTSObject.code3d += stringPointer + '=Heap[(int)'+obj2.pointer+'];\n';
                newTSObject.code3d += 'if(' + stringPointer + '==' + obj1.pointer+') goto '+lbl1+';\n'
                newTSObject.code3d += newTemp + '=0;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl1 +':\n';
                newTSObject.code3d += newTemp + '=1;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl2 +':\n\n\n';
                newTSObject.pointer = newTemp;
                
                return newTSObject;
        }

        if(obj1.type == 'number'&& obj2.type == 'number'){type = 'boolean';}
        else if(obj1.type == 'number'&& obj2.type == 'boolean'){type = 'boolean';}
        else if(obj1.type == 'boolean'&& obj2.type == 'number'){type = 'boolean';}
        else if(obj1.type == 'boolean'&& obj2.type == 'boolean'){type = 'boolean';}
        else if(obj1.type == 'string' && obj2.type == 'string') {
            type = 'boolean';
            kind = 'string';

            let newTsObject = new tsObject(0,0,null,type);

            let stringPointer = 't'+scope.getNewTemp();
            let stringPointer2 = 't'+scope.getNewTemp();
            
            //this.code3d += 
            let stringLabel = 'L'+scope.getNewLabel();
            let falseLabel = 'L' + scope.getNewLabel();
            let trueLabel = 'L' + scope.getNewLabel();
            let endStringLabel = 'L' + scope.getNewLabel();
            let exitLabel = 'L'+scope.getNewLabel();
            
            let temp = 't'+scope.getNewTemp();
            let temp2 = 't'+scope.getNewTemp();

            let newPointer = 't' + scope.getNewTemp();

            newTsObject.code3d += obj1.code3d;
            newTsObject.code3d += obj2.code3d;
            newTsObject.code3d += stringPointer + '=' + obj1.pointer+';\n';
            newTsObject.code3d += stringPointer2 + '=' + obj2.pointer+';\n';
            newTsObject.code3d+= stringLabel +':\n';
            newTsObject.code3d+=temp + '=Heap[(int)'+stringPointer+'];\n';
            newTsObject.code3d+=temp2 + '=Heap[(int)'+stringPointer2+'];\n';
            newTsObject.code3d+='if('+temp + '==' +'\0'.charCodeAt(0) + ') goto ' + endStringLabel + ';\n';
            newTsObject.code3d+= 'if('+temp+'!='+temp2+') goto '+falseLabel+';\n';
            newTsObject.code3d+= stringPointer + '= '+stringPointer+' +1;\n';
            newTsObject.code3d+= stringPointer2 + '= '+stringPointer2+' +1;\n';
            newTsObject.code3d+= 'goto '+stringLabel+';\n';

            newTsObject.code3d+=endStringLabel+':\n';
            newTsObject.code3d+='if('+temp2 + '==' +'\0'.charCodeAt(0) + ') goto ' + trueLabel + ';\n';

            newTsObject.code3d+=falseLabel+':\n';
            newTsObject.code3d+=newPointer + '=0;\n';
            newTsObject.code3d+= 'goto '+exitLabel+';\n';

            newTsObject.code3d+=trueLabel+':\n';
            newTsObject.code3d+=newPointer + '=1;\n';
            newTsObject.code3d+= 'goto '+exitLabel+';\n';

            newTsObject.code3d+=exitLabel+':\n\n';
            newTsObject.pointer = newPointer;
            return newTsObject;

        } else if(obj1.type == 'string' && obj2.type == 'null') {
            type = 'boolean'
            
            if(obj1.isArray) {

                let newTSObject = new tsObject(0,0,null,type);
                newTSObject.code3d += obj1.code3d;
                newTSObject.code3d += obj2.code3d;
                let newTemp = 't' + scope.getNewTemp()
                let stringPointer = 't' + scope.getNewTemp();
                let lbl1 = 'L' + scope.getNewLabel()
                let lbl2 = 'L' + scope.getNewLabel()
                
                newTSObject.code3d += stringPointer + '=Heap[(int)'+obj1.pointer+'];\n';
                newTSObject.code3d += 'if(' + stringPointer + '==' + obj2.pointer+') goto '+lbl1+';\n'
                newTSObject.code3d += newTemp + '=0;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl1 +':\n';
                newTSObject.code3d += newTemp + '=1;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl2 +':\n\n\n';
                newTSObject.pointer = newTemp;
                
                return newTSObject;

            } else {

                let newTSObject = new tsObject(0,0,null,type);
                newTSObject.code3d += obj1.code3d;
                newTSObject.code3d += obj2.code3d;
                let newTemp = 't' + scope.getNewTemp()
                let stringPointer = 't' + scope.getNewTemp();
                let lbl1 = 'L' + scope.getNewLabel()
                let lbl2 = 'L' + scope.getNewLabel()
                //newTSObject.code3d += stringPointer + '=Heap[(int)'+obj1.pointer+'];\n';
                newTSObject.code3d += 'if(' + obj1.pointer + '==' + obj2.pointer+') goto '+lbl1+';\n'
                newTSObject.code3d += newTemp + '=0;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl1 +':\n';
                newTSObject.code3d += newTemp + '=1;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl2 +':\n\n\n';
                newTSObject.pointer = newTemp;
                
                return newTSObject;
            }

        } else if(obj1.type == 'null' && obj2.type == 'string') {
            type = 'boolean'
            if(obj2.isArray) {
                let newTSObject = new tsObject(0,0,null,type);
                newTSObject.code3d += obj1.code3d;
                newTSObject.code3d += obj2.code3d;
                let newTemp = 't' + scope.getNewTemp()
                let stringPointer = 't' + scope.getNewTemp();
                let lbl1 = 'L' + scope.getNewLabel()
                let lbl2 = 'L' + scope.getNewLabel()
                
                newTSObject.code3d += stringPointer + '=Heap[(int)'+obj2.pointer+'];\n';
                newTSObject.code3d += 'if(' + stringPointer + '==' + obj1.pointer+') goto '+lbl1+';\n'
                newTSObject.code3d += newTemp + '=0;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl1 +':\n';
                newTSObject.code3d += newTemp + '=1;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl2 +':\n\n\n';
                newTSObject.pointer = newTemp;
                
                return newTSObject;
            } else {

                let newTSObject = new tsObject(0,0,null,type);
                newTSObject.code3d += obj1.code3d;
                newTSObject.code3d += obj2.code3d;
                let newTemp = 't' + scope.getNewTemp()
                let stringPointer = 't' + scope.getNewTemp();
                let lbl1 = 'L' + scope.getNewLabel()
                let lbl2 = 'L' + scope.getNewLabel()
                //newTSObject.code3d += stringPointer + '=Heap[(int)'+obj1.pointer+'];\n';
                newTSObject.code3d += 'if(' + obj1.pointer + '==' + obj2.pointer+') goto '+lbl1+';\n'
                newTSObject.code3d += newTemp + '=0;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl1 +':\n';
                newTSObject.code3d += newTemp + '=1;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl2 +':\n\n\n';
                newTSObject.pointer = newTemp;
                
                return newTSObject;
            }
        } 
        

        else{
            console.log("ERROR tipos");
            return;
        }

        //console.log(obj2)

        let newTSObject = new tsObject(0,0,null,type);
        newTSObject.code3d += obj1.code3d;
        newTSObject.code3d += obj2.code3d;
        let newTemp = 't' + scope.getNewTemp()
        let lbl1 = 'L' + scope.getNewLabel()
        let lbl2 = 'L' + scope.getNewLabel()
        newTSObject.code3d += 'if(' + obj1.pointer + '==' + obj2.pointer+') goto '+lbl1+';\n'
        newTSObject.code3d += newTemp + '=0;\n';
        newTSObject.code3d += 'goto '+lbl2+';\n';
        newTSObject.code3d += lbl1 +':\n';
        newTSObject.code3d += newTemp + '=1;\n';
        newTSObject.code3d += 'goto '+lbl2+';\n';
        newTSObject.code3d += lbl2 +':\n\n\n';
        newTSObject.pointer = newTemp;

        return newTSObject;
    }

    notEqual(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        const obj1 = this.nodeLeft.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        const obj2 = this.nodeRight.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        let type = null;
        let kind = null;
        if(obj1 == null || obj2 == null || obj1 == undefined || obj2 == undefined) {
            console.log("ERROR");
            return;
        }      
        
        if(obj1.isArray && obj2.type == 'null') {
            type = 'boolean';
            let newTSObject = new tsObject(0,0,null,type);
                newTSObject.code3d += obj1.code3d;
                newTSObject.code3d += obj2.code3d;
                let newTemp = 't' + scope.getNewTemp()
                let stringPointer = 't' + scope.getNewTemp();
                let lbl1 = 'L' + scope.getNewLabel()
                let lbl2 = 'L' + scope.getNewLabel()
                
                newTSObject.code3d += stringPointer + '=Heap[(int)'+obj1.pointer+'];\n';
                newTSObject.code3d += 'if(' + stringPointer + '!=' + obj2.pointer+') goto '+lbl1+';\n'
                newTSObject.code3d += newTemp + '=0;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl1 +':\n';
                newTSObject.code3d += newTemp + '=1;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl2 +':\n\n\n';
                newTSObject.pointer = newTemp;
                
                return newTSObject;
        } else if(obj2.isArray && obj1.type == 'null') {
            type = 'boolean';
            let newTSObject = new tsObject(0,0,null,type);
                newTSObject.code3d += obj1.code3d;
                newTSObject.code3d += obj2.code3d;
                let newTemp = 't' + scope.getNewTemp()
                let stringPointer = 't' + scope.getNewTemp();
                let lbl1 = 'L' + scope.getNewLabel()
                let lbl2 = 'L' + scope.getNewLabel()
                
                newTSObject.code3d += stringPointer + '=Heap[(int)'+obj2.pointer+'];\n';
                newTSObject.code3d += 'if(' + stringPointer + '!=' + obj1.pointer+') goto '+lbl1+';\n'
                newTSObject.code3d += newTemp + '=0;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl1 +':\n';
                newTSObject.code3d += newTemp + '=1;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl2 +':\n\n\n';
                newTSObject.pointer = newTemp;
                
                return newTSObject;
        }


        if(obj1.type == 'number'&& obj2.type == 'number'){type = 'boolean';}
        else if(obj1.type == 'number'&& obj2.type == 'boolean'){type = 'boolean';}
        else if(obj1.type == 'boolean'&& obj2.type == 'number'){type = 'boolean';}
        else if(obj1.type == 'boolean'&& obj2.type == 'boolean'){type = 'boolean';}
        else if(obj1.type == 'string' && obj2.type == 'string') {
            type = 'boolean';
            kind = 'string';

            let newTsObject = new tsObject(0,0,null,type);

            let stringPointer = 't'+scope.getNewTemp();
            let stringPointer2 = 't'+scope.getNewTemp();
            
            //this.code3d += 
            let stringLabel = 'L'+scope.getNewLabel();
            let falseLabel = 'L' + scope.getNewLabel();
            let trueLabel = 'L' + scope.getNewLabel();
            let endStringLabel = 'L' + scope.getNewLabel();
            let exitLabel = 'L'+scope.getNewLabel();
            
            let temp = 't'+scope.getNewTemp();
            let temp2 = 't'+scope.getNewTemp();

            let newPointer = 't' + scope.getNewTemp();

            newTsObject.code3d += obj1.code3d;
            newTsObject.code3d += obj2.code3d;
            newTsObject.code3d += stringPointer + '=' + obj1.pointer+';\n';
            newTsObject.code3d += stringPointer2 + '=' + obj2.pointer+';\n';
            newTsObject.code3d+= stringLabel +':\n';
            newTsObject.code3d+=temp + '=Heap[(int)'+stringPointer+'];\n';
            newTsObject.code3d+=temp2 + '=Heap[(int)'+stringPointer2+'];\n';
            newTsObject.code3d+='if('+temp + '==' +'\0'.charCodeAt(0) + ') goto ' + endStringLabel + ';\n';
            newTsObject.code3d+= 'if('+temp+'=='+temp2+') goto '+falseLabel+';\n';
            newTsObject.code3d+= stringPointer + '= '+stringPointer+' +1;\n';
            newTsObject.code3d+= stringPointer2 + '= '+stringPointer2+' +1;\n';
            newTsObject.code3d+= 'goto '+stringLabel+';\n';

            newTsObject.code3d+=endStringLabel+':\n';
            newTsObject.code3d+='if('+temp2 + '==' +'\0'.charCodeAt(0) + ') goto ' + trueLabel + ';\n';

            newTsObject.code3d+=falseLabel+':\n';
            newTsObject.code3d+=newPointer + '=0;\n';
            newTsObject.code3d+= 'goto '+exitLabel+';\n';

            newTsObject.code3d+=trueLabel+':\n';
            newTsObject.code3d+=newPointer + '=1;\n';
            newTsObject.code3d+= 'goto '+exitLabel+';\n';

            newTsObject.code3d+=exitLabel+':\n\n';
            newTsObject.pointer = newPointer;
            return newTsObject;

        } else if(obj1.type == 'string' && obj2.type == 'null') {
            type = 'boolean'
            
            if(obj1.isArray) {

                let newTSObject = new tsObject(0,0,null,type);
                newTSObject.code3d += obj1.code3d;
                newTSObject.code3d += obj2.code3d;
                let newTemp = 't' + scope.getNewTemp()
                let stringPointer = 't' + scope.getNewTemp();
                let lbl1 = 'L' + scope.getNewLabel()
                let lbl2 = 'L' + scope.getNewLabel()
                
                newTSObject.code3d += stringPointer + '=Heap[(int)'+obj1.pointer+'];\n';
                newTSObject.code3d += 'if(' + stringPointer + '!=' + obj2.pointer+') goto '+lbl1+';\n'
                newTSObject.code3d += newTemp + '=0;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl1 +':\n';
                newTSObject.code3d += newTemp + '=1;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl2 +':\n\n\n';
                newTSObject.pointer = newTemp;
                
                return newTSObject;

            } else {

                let newTSObject = new tsObject(0,0,null,type);
                newTSObject.code3d += obj1.code3d;
                newTSObject.code3d += obj2.code3d;
                let newTemp = 't' + scope.getNewTemp()
                let stringPointer = 't' + scope.getNewTemp();
                let lbl1 = 'L' + scope.getNewLabel()
                let lbl2 = 'L' + scope.getNewLabel()
                //newTSObject.code3d += stringPointer + '=Heap[(int)'+obj1.pointer+'];\n';
                newTSObject.code3d += 'if(' + obj1.pointer + '!=' + obj2.pointer+') goto '+lbl1+';\n'
                newTSObject.code3d += newTemp + '=0;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl1 +':\n';
                newTSObject.code3d += newTemp + '=1;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl2 +':\n\n\n';
                newTSObject.pointer = newTemp;
                
                return newTSObject;
            }

        } else if(obj1.type == 'null' && obj2.type == 'string') {
            type = 'boolean'
            if(obj2.isArray) {
                let newTSObject = new tsObject(0,0,null,type);
                newTSObject.code3d += obj1.code3d;
                newTSObject.code3d += obj2.code3d;
                let newTemp = 't' + scope.getNewTemp()
                let stringPointer = 't' + scope.getNewTemp();
                let lbl1 = 'L' + scope.getNewLabel()
                let lbl2 = 'L' + scope.getNewLabel()
                
                newTSObject.code3d += stringPointer + '=Heap[(int)'+obj2.pointer+'];\n';
                newTSObject.code3d += 'if(' + stringPointer + '!=' + obj1.pointer+') goto '+lbl1+';\n'
                newTSObject.code3d += newTemp + '=0;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl1 +':\n';
                newTSObject.code3d += newTemp + '=1;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl2 +':\n\n\n';
                newTSObject.pointer = newTemp;
                
                return newTSObject;
            } else {

                let newTSObject = new tsObject(0,0,null,type);
                newTSObject.code3d += obj1.code3d;
                newTSObject.code3d += obj2.code3d;
                let newTemp = 't' + scope.getNewTemp()
                let stringPointer = 't' + scope.getNewTemp();
                let lbl1 = 'L' + scope.getNewLabel()
                let lbl2 = 'L' + scope.getNewLabel()
                //newTSObject.code3d += stringPointer + '=Heap[(int)'+obj1.pointer+'];\n';
                newTSObject.code3d += 'if(' + obj1.pointer + '!=' + obj2.pointer+') goto '+lbl1+';\n'
                newTSObject.code3d += newTemp + '=0;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl1 +':\n';
                newTSObject.code3d += newTemp + '=1;\n';
                newTSObject.code3d += 'goto '+lbl2+';\n';
                newTSObject.code3d += lbl2 +':\n\n\n';
                newTSObject.pointer = newTemp;
                
                return newTSObject;
            }
        } 
        //FALTA NULL Y FALTA ALGUNAS COMPROBACIONES CON CADENAS

        else{
            console.log("ERROR tipos");
            return;
        }

        if(kind == 'string') {

        }

        //console.log(obj2)

        let newTSObject = new tsObject(0,0,null,type);
        newTSObject.code3d += obj1.code3d;
        newTSObject.code3d += obj2.code3d;
        let newTemp = 't' + scope.getNewTemp()
        let lbl1 = 'L' + scope.getNewLabel()
        let lbl2 = 'L' + scope.getNewLabel()
        newTSObject.code3d += 'if(' + obj1.pointer + '==' + obj2.pointer+') goto '+lbl1+';\n'
        newTSObject.code3d += newTemp + '=1;\n';
        newTSObject.code3d += 'goto '+lbl2+';\n';
        newTSObject.code3d += lbl1 +':\n';
        newTSObject.code3d += newTemp + '=0;\n';
        newTSObject.code3d += 'goto '+lbl2+';\n';
        newTSObject.code3d += lbl2 +':\n\n\n';
        newTSObject.pointer = newTemp;
        return newTSObject;
    }
}
module.exports = Relational;
},{"./tsObject":33}],24:[function(require,module,exports){
const tsObject = require('./tsObject')

class Return {
    constructor(value) {
        this.value = value;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        
        if(this.value) {
            
            //id 
            //
            const func = scope.existsFunction(funcID);
            
            func.returnValue = 0;
            scope.changeFunction(funcID,func)
            console.log("ESTO ES EN RETURN");
            console.log(this.value)
            console.log("%%%%%%%%%%%%%%%%%%%%%")

            const rexp = this.value.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            
            
            let newTsObject = new tsObject(0,0,null,null);
            newTsObject.code3d += rexp.code3d;
            //let newTemp = 't'+scope.getNewTemp()

            newTsObject.code3d += func.returnTemp + ' = '+rexp.pointer+';\n';
            //newTsObject.code3d += func.returnTemp + '= P;\n';
            //newTsObject.code3d += 'Stack[(int)'+func.returnTemp+'] ='+newTemp+';\n';
            //newTsObject.code3d += 'P=P+1;\n';
            newTsObject.code3d += 'goto '+returnlbl + ';\n';

            return newTsObject;


        } else {
            let newTsObject = new tsObject(0,0,null,null);
            newTsObject.code3d += 'goto '+returnlbl + ';\n';
            return newTsObject;
        }
    }
}
module.exports = Return;
},{"./tsObject":33}],25:[function(require,module,exports){
class Scope {

    constructor(prev,terminal,label){
        this.terminal = terminal;
        this.label = label;
        this.prev = prev;
        this.table = new Map();
        this.funcTable = new Map();
        this.prevSize = 0;
        this.isFuncScope = null;
        this.tempList = [];
        if(prev != null) {
            this.prevSize = prev.table.size;
        }
        
    }

    getSize() {
        return this.table.size
    }

    findVariable(id) {
        var sc= null;

        for(sc = this;sc != null;sc = sc.prev){
            if(sc.table.has(id)) {
                return sc.table.get(id);
            }
        }
        return null;
    }

    getFunctionParameters() {
        let parameters = [];

        var sc= null;

        for(sc = this;sc != null;sc = sc.prev){

            if(sc.isFuncScope) {

                for (let [key, value] of sc.table) {
                    parameters.push(value.pointer);
                }

                return parameters;
            } 
        }

        return parameters;
    }

    getVariablesInFunc() {
        let variables = [];

        var sc= null;

        for(sc = this;sc != null;sc = sc.prev){

            if(sc.isFuncScope) {

                sc.tempList.forEach(val => {
                    variables.push(val);
                });

                /*for (let [key, value] of sc.table) {
                    variables.push(value.pointer);
                }*/

                break;
            } else {
                sc.tempList.forEach(val => {
                    variables.push(val);
                });
            }
        }

        return variables;
    }

    modifyVariable(id,value) {
        var sc= null;

        for(sc = this;sc != null;sc = sc.prev){
            if(sc.table.has(id)) {
                sc.table.set(id,value);
            }
        }
    }

    insertVariable(id,pointer,type,len,dim) {
        const newVar = {
            pointer:pointer,
            type:type,
            dimention:dim,
            length:len
        }

        if(!this.existsLocalVariable(id)) {
            this.table.set(id,newVar);
            return true;
        } 
        console.log("ERROR la variable " + id + " ya existe")
        return false;
    }

    existsFunction(id) {
        var sc= null;

        for(sc = this;sc != null;sc = sc.prev){
            if(sc.funcTable.has(id)) {
                return sc.funcTable.get(id);
            }
        }
        return null;
    }
    
    insertFunction(id,type,dim,paramsList,returnTemp) {
        const newVar = {
            type:type,
            dim:dim,
            paramsList:paramsList,
            returnTemp:returnTemp,
            returnValue:-1
        }

        if(!this.existsFunction(id)) {
            this.funcTable.set(id,newVar);
            return true;
        } 
        console.log("ERROR la variable " + id + " ya existe")
        return false;
    }

    changeFunction(id,value) {
        var sc= null;

        for(sc = this;sc != null;sc = sc.prev){
            if(sc.funcTable.has(id)) {
                sc.funcTable.set(id,value);
            }
        }
    }

    existsLocalVariable(id){
        return this.table.has(id);
    }

    getTable() {
        return this.table;
    }

    getFunctionTable() {
        return this.funcTable;
    }

    getNewTemp() {
        this.terminal++;
        return this.terminal;
    }

    getNewLabel() {
        this.label++;
        return this.label;
    }
}

module.exports = Scope;
},{}],26:[function(require,module,exports){
const Scope = require('./Scope');
const tsObject = require('./tsObject')
const Relational = require('./Relational')

class Switch {
    constructor(exp,firstcase,lastcase) {
        this.exp = exp;
        this.firstcase = firstcase;
        this.lastcase = lastcase;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {

        let newTsObject = new tsObject(0,0,null,null);

        let Labels = [];
        let deflabel = '';

        let lxLabel = 'L' + scope.getNewLabel();
        let lfinLabel = 'L' + scope.getNewLabel();
        let tempStack = 't' + scope.getNewTemp();

        newTsObject.code3d += tempStack + '= P;\n';
        newTsObject.code3d += 'goto '+lxLabel+';\n';

        if(this.firstcase != null) {
            this.firstcase.forEach(element => {
                
                let bodyCase = '';
                let actualLabel = 'L' + scope.getNewLabel();
                Labels.push(actualLabel);
                newTsObject.code3d += actualLabel + ':\n';

                element.stmt.forEach(obj => {
                    
                    let newScope = new Scope(scope,scope.terminal,scope.label);
                    bodyCase += obj.translate(newScope,returnlbl,lfinLabel,continuelbl,funcID,sCounter).code3d;
                    scope.terminal = newScope.terminal;
                    scope.label = newScope.label;
                })
                newTsObject.code3d += bodyCase;

            });
        }

        let stat = '';
        let deflbl = 'L' + scope.getNewLabel();
        newTsObject.code3d += deflbl + ':\n';

        this.lastcase.forEach(obj => {
            let newScope = new Scope(scope,scope.terminal,scope.label);
            stat += obj.translate(newScope,returnlbl,breaklbl,continuelbl,funcID,sCounter).code3d;
            scope.terminal = newScope.terminal;
            scope.label = newScope.label;
        });
        newTsObject.code3d += stat;
        newTsObject.code3d += 'goto '+lfinLabel+';\n';
        newTsObject.code3d += lxLabel + ':\n';

        let index = 0;
        this.firstcase.forEach(element => {

            let cond =  new Relational(this.exp,element.exp,'==',0,0);
            cond = cond.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
            newTsObject.code3d += cond.code3d;
            newTsObject.code3d += 'if('+cond.pointer+')goto '+Labels[index]+';\n';
            index++;

        });

        newTsObject.code3d += 'goto '+deflbl+';\n';
        newTsObject.code3d += lfinLabel + ':\n';
        newTsObject.code3d += 'P = '+tempStack+';\n';

        return newTsObject;

    }

}
module.exports = Switch;
},{"./Relational":23,"./Scope":25,"./tsObject":33}],27:[function(require,module,exports){
const tsObject = require('./tsObject');

class Ternary {
    constructor(exp1,exp2,exp3) {
        this.exp1 = exp1;
        this.exp2 = exp2;
        this.exp3 = exp3;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {

        const cond = this.exp1.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        const expTrue = this.exp2.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        const expFalse = this.exp3.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);

        let tLabel ='L'+ scope.getNewLabel();
        let fLabel ='L'+ scope.getNewLabel(); 
        let exitLabel = 'L'+scope.getNewLabel(); 
        let pointer = 't' + scope.getNewTemp();

        let newTsObject = new tsObject(0,0,null,expTrue.type);
        newTsObject.code3d += cond.code3d;
        newTsObject.code3d += 'if('+cond.pointer+') goto '+tLabel+';\n';
        newTsObject.code3d += 'goto '+fLabel+';\n';

        newTsObject.code3d += tLabel + ':\n';
        newTsObject.code3d += expTrue.code3d;
        newTsObject.code3d += pointer + ' = '+expTrue.pointer+';\n';
        newTsObject.code3d += 'goto '+exitLabel+';\n';

        newTsObject.code3d += fLabel + ':\n';
        newTsObject.code3d += expFalse.code3d;
        newTsObject.code3d += pointer + ' = '+expFalse.pointer+';\n';
        newTsObject.code3d += 'goto '+exitLabel+';\n';

        newTsObject.code3d += exitLabel + ':\n\n';
        newTsObject.pointer = pointer;

        return newTsObject;
    }
}
module.exports = Ternary;
},{"./tsObject":33}],28:[function(require,module,exports){
const defLast = require('./defLast');
const tsObject = require('./tsObject');

class Variable {
    constructor(asignType,id,deflast,defvarlast) {
        this.asignType = asignType;
        this.id = id;
        this.deflast = deflast;
        this.defvarlast = deflast;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        const objdef = this.deflast.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter)
        let type = objdef.type;
        let valueType = objdef.value.type;
        let newObj = new tsObject(0,0,null,type);
        
        if(valueType == 'null') {

            if(objdef.dim == 0) {
                if(scope.prev != null) {
                    
                    newObj.code3d += objdef.value.code3d;
                    let newTemp = 't'+scope.getNewTemp();
                    let saveTemp = 't'+scope.getNewTemp();
                    newObj.code3d += newTemp + '=P + '+scope.prevSize+';\n';
                    
                    newObj.code3d += newTemp + '='+newTemp+' + '+scope.getSize()+';\n';
                    newObj.code3d += saveTemp + '=' + objdef.value.pointer + ';\n';
                    newObj.code3d += 'Stack[(int)'+newTemp+'] = ' + saveTemp + ';\n';
                    //newObj.code3d += 'P = P +1;\n';
                    scope.insertVariable(this.id,newTemp,type,false,0);
                } else {
                    newObj.code3d += objdef.value.code3d;
                    let newTemp = 't'+scope.getNewTemp();
                    let saveTemp = 't'+scope.getNewTemp();
                    newObj.code3d += newTemp + '=P;\n';
                    newObj.code3d += saveTemp + '=' + objdef.value.pointer + ';\n';
                    newObj.code3d += 'Stack[(int)'+newTemp+'] = ' + saveTemp + ';\n';
                    newObj.code3d += 'P = P +1;\n';
                    //sCounter++;
                    scope.insertVariable(this.id,newTemp,type,false,0);
                }
                
                return newObj;
            } else {

            }

        } else if(type == valueType) {

            if(objdef.dim == 0) {
                
                if(scope.prev != null) {
                    
                    newObj.code3d += objdef.value.code3d;
                    let newTemp = 't'+scope.getNewTemp();
                    let saveTemp = 't'+scope.getNewTemp();
                    newObj.code3d += newTemp + '=P + '+scope.prevSize+';\n';
                    
                    newObj.code3d += newTemp + '='+newTemp+' + '+scope.getSize()+';\n';
                    newObj.code3d += saveTemp + '=' + objdef.value.pointer + ';\n';
                    newObj.code3d += 'Stack[(int)'+newTemp+'] = ' + saveTemp + ';\n';
                    //newObj.code3d += 'P = P +1;\n';
                    scope.insertVariable(this.id,newTemp,type,false,0);
                } else {
                    newObj.code3d += objdef.value.code3d;
                    let newTemp = 't'+scope.getNewTemp();
                    let saveTemp = 't'+scope.getNewTemp();
                    newObj.code3d += newTemp + '=P;\n';
                    newObj.code3d += saveTemp + '=' + objdef.value.pointer + ';\n';
                    newObj.code3d += 'Stack[(int)'+newTemp+'] = ' + saveTemp + ';\n';
                    newObj.code3d += 'P = P +1;\n';
                    //sCounter++;
                    scope.insertVariable(this.id,newTemp,type,false,0);
                }
                
                return newObj;
            } else {
                //console.log(objdef);
                if(scope.prev != null) {
                    
                    newObj.code3d += objdef.value.code3d;
                    let newTemp = 't'+scope.getNewTemp();
                    let saveTemp = 't'+scope.getNewTemp();
                    newObj.code3d += newTemp + '=P + '+scope.prevSize+';\n';
                    
                    newObj.code3d += newTemp + '='+newTemp+' + '+scope.getSize()+';\n';
                    newObj.code3d += saveTemp + '=' + objdef.value.pointer + ';\n';
                    newObj.code3d += 'Stack[(int)'+newTemp+'] = ' + saveTemp + ';\n';
                    //newObj.code3d += 'P = P +1;\n';
                    scope.insertVariable(this.id,newTemp,type,{list:objdef.value.list,arrFinal:objdef.value.arrFinal,len:objdef.value.arrLen,pointer:objdef.value.pointer},objdef.dim);
                } else {
                    newObj.code3d += objdef.value.code3d;
                    let newTemp = 't'+scope.getNewTemp();
                    let saveTemp = 't'+scope.getNewTemp();
                    newObj.code3d += newTemp + '=P;\n';
                    newObj.code3d += saveTemp + '=' + objdef.value.pointer + ';\n';
                    newObj.code3d += 'Stack[(int)'+newTemp+'] = ' + saveTemp + ';\n';
                    newObj.code3d += 'P = P +1;\n';
                    //sCounter++;
                    scope.insertVariable(this.id,newTemp,type,{list:objdef.value.list,arrFinal:objdef.value.arrFinal,len:objdef.value.arrLen,pointer:objdef.value.pointer},objdef.dim);
                }
                
                return newObj;
            }

        } else if(valueType == 'Array') {
            
            if(objdef.dim == 1 || objdef.dim == 2) {

                let pointer = 't' + scope.getNewTemp();
                let index = 't' + scope.getNewTemp();
                let counterTemp = 't' + scope.getNewTemp();
                let condTemp = 't' + scope.getNewTemp();
                let auxTemp = 't'+scope.getNewTemp();
                let arrFinal = 't' + scope.getNewTemp();

                let labelEntry = 'L' + scope.getNewLabel();
                //let fillArrayLabel = 'L' + scope.getNewLabel();
                let exitLabel = 'L'+ scope.getNewLabel();
                console.log(objdef);
                let newTsObject = new tsObject(0,0,null,null);
                newTsObject.code3d += objdef.value.code3d;
                newTsObject.code3d += pointer +' = H;\n';
                newTsObject.code3d += index +' = H;\n';
                newTsObject.code3d += counterTemp + '=0;\n';

                newTsObject.code3d += labelEntry + ':\n';
                //newTsObject.code3d += auxTemp + ' = '+counterTemp+' + 1;\n'
                newTsObject.code3d += condTemp + '= ' + counterTemp + '=='+objdef.value.pointer + ';\n';
                newTsObject.code3d += 'if('+condTemp+') goto '+exitLabel+';\n';
                newTsObject.code3d += 'Heap[(int)'+index+'] = -100;\n';
                newTsObject.code3d += 'H = H + 1;\n';
                newTsObject.code3d += index +' = H;\n';
                newTsObject.code3d += 'Heap[(int)'+index+'] = -100;\n';
                newTsObject.code3d += 'H = H + 1;\n';
                newTsObject.code3d += index +' = H;\n';
                newTsObject.code3d += counterTemp + ' = ' + counterTemp + ' + 1;\n';
                newTsObject.code3d += 'goto '+labelEntry+';\n';
                newTsObject.code3d += exitLabel + ':\n';
                newTsObject.code3d += arrFinal + '='+index+';\n';
                //console.log(this.asignType)
                //id,pointer,type,len,dim
                
                //asignar a pointer del heap al stack
                if(scope.prev != null) {

                    let newTemp = 't'+scope.getNewTemp();
                    let saveTemp = 't'+scope.getNewTemp();
                    newTsObject.code3d += '////////////new ARRAY///////////\n';
                    newTsObject.code3d += newTemp + '=P + '+scope.prevSize+';\n';
                    newTsObject.code3d += newTemp + '='+newTemp+' + '+scope.getSize()+';\n';
                    
                    newTsObject.code3d += saveTemp + '=' + pointer + ';\n';
                    newTsObject.code3d += 'Stack[(int)'+newTemp+'] = ' + saveTemp + ';\n';
                    newTsObject.code3d += '/////////////FIN new ARRAY//////////\n';

                    scope.insertVariable(this.id,newTemp,type,{list:[],arrFinal:arrFinal,len:objdef.value.pointer,pointer:pointer},objdef.dim);
                    
                } else {
                    
                    let newTemp = 't'+scope.getNewTemp();
                    let saveTemp = 't'+scope.getNewTemp();
                    newTsObject.code3d += '//////////////new ARRAY/////////\n';
                    newTsObject.code3d += newTemp + '=P;\n';
                    newTsObject.code3d += saveTemp + '=' + pointer + ';\n';
                    newTsObject.code3d += 'Stack[(int)'+newTemp+'] = ' + saveTemp + ';\n';
                    newTsObject.code3d += 'P = P +1;\n';
                    newTsObject.code3d += '/////////////FIN new ARRAY//////////\n';
                    //newObj.pointer = newTemp;
                    scope.insertVariable(this.id,newTemp,type,{list:[],arrFinal:arrFinal,len:objdef.value.pointer,pointer:pointer},objdef.dim);
                
                }

                return newTsObject;
            } else {
                console.log("Error tama├▒o incorrecto");
            }

        } else {
            console.log("ERROR los tipos no son igualesP");
        }
    }
}

module.exports = Variable;
},{"./defLast":32,"./tsObject":33}],29:[function(require,module,exports){
const tsObject = require('./tsObject');
const Id = require('./Id')
const Operation = require('./Operation')

class VariableChange {
    constructor(id,asingLast) {
        this.id = id;
        this.asingLast = asingLast;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        
        const countP = Object.keys(this.asingLast).length;
        if(countP == 3) {
            
            const variableObj = scope.findVariable(this.id);
            if(variableObj) {

                let newObj = new Id(0,0,this.id);
                newObj = newObj.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);

                let varLast = this.asingLast.varLast;
                varLast.cond = true;
                varLast.obj = newObj;

                let r = varLast.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);

                let asingLastF = this.asingLast.asignLastF;
                //console.log(asingLastF);
                if(asingLastF.tipo == '=') {
                    const E = asingLastF.value.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
                    if(variableObj.type == E.type) {
                        let newCod3dObj = new tsObject(0,0,null,null);
                        newCod3dObj.code3d += r.code3d;
                        newCod3dObj.code3d += E.code3d;
                        if(E.isArray) {
                            
                            let originalTemp = 't'+ scope.getNewTemp();
                            let nuevoTemp = 't' + scope.getNewTemp();
                            let salidaNuevoTemp = 't' + scope.getNewTemp();
                            let auxTemp = 't' + scope.getNewTemp();

                            let lloopLabel = 'L'+scope.getNewLabel();
                            let exitLabel = 'L' + scope.getNewLabel();

                            newCod3dObj.code3d += originalTemp + '='+r.pointer+';\n';
                            newCod3dObj.code3d += nuevoTemp + '='+E.pointer+';\n';
                            newCod3dObj.code3d += salidaNuevoTemp + '='+E.arrFinal+';\n';

                            newCod3dObj.code3d += lloopLabel + ':\n';
                            newCod3dObj.code3d += 'if('+nuevoTemp+'=='+salidaNuevoTemp+') goto '+exitLabel+';\n';
                            newCod3dObj.code3d += auxTemp + '=Heap[(int)'+nuevoTemp+'];\n';
                            newCod3dObj.code3d += 'Heap[(int)'+originalTemp+']='+auxTemp+';\n';
                            newCod3dObj.code3d += originalTemp + '='+originalTemp+'+1;\n';
                            newCod3dObj.code3d += nuevoTemp + '='+nuevoTemp+'+1;\n';
                            newCod3dObj.code3d += 'goto '+lloopLabel+';\n';
                            newCod3dObj.code3d += exitLabel + ':\n';

                            

                        } else {
                            
                            
                            newCod3dObj.code3d += 'Heap[(int)'+r.pointer+']='+E.pointer+';\n'
                        }

                        newCod3dObj.isArray  = newObj.isArray;
                        newCod3dObj.pointer  = newObj.pointer;
                        newCod3dObj.type     = newObj.type;
                        newCod3dObj.arrFinal = newObj.arrFinal;
                        newCod3dObj.arrLen   = newObj.arrLen;
                        newCod3dObj.list     = newObj.list;
                        newCod3dObj.dim      = newObj.dim;

                        return newCod3dObj;
                        
                    } else if(E.type == 'null') {

                    } else {
                        console.log("ERROR");
                        return null;
                    }
                }

            } else {
                console.log("ERROR La variable no existe")
                return null;
            }

            

        } else {
            const variableObj = scope.findVariable(this.id);
            if(variableObj) {

                if(this.asingLast.tipo == '=') {
                    const E = this.asingLast.value.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
                    console.log(this.asingLast.value);
                    if(variableObj.type == E.type) {
                        
                        let newCod3dObj = new tsObject(0,0,null,null);
                        newCod3dObj.code3d += E.code3d;
                        newCod3dObj.code3d += 'Stack[(int)'+variableObj.pointer+']='+E.pointer+';\n'
                        
                        return newCod3dObj;
                        
                    } else if(E.type == 'null') {

                    } else {
                        console.log("ERROR");
                        return null;
                    }
                } else if(this.asingLast.tipo == '++' || this.asingLast.tipo == '--') {

                    if(this.asingLast.tipo == '++') {
                        this.asingLast.tipo = '+'
                    } else {
                        this.asingLast.tipo = '-'
                    }

                    let varObj = new Id(0,0,this.id);
                    //let op2 = this.asingLast.value;
                    let result =  new Operation(varObj,new tsObject(0,0,'1','number'),this.asingLast.tipo,0,0);
                    result = result.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);

                    if(variableObj.type == result.type) {
                        let newCod3dObj = new tsObject(0,0,null,null);
                        newCod3dObj.code3d += result.code3d;
                        newCod3dObj.code3d += 'Stack[(int)'+variableObj.pointer+']='+result.pointer+';\n'
                        
                        return newCod3dObj;

                    } else {
                        console.log("ERROR tipos incorrectos");
                        return null;
                    }
                } else {
                    
                    //obtengo el puntero de la variable
                    //creo un nuevo temporal
                    //con el puntero de la variable obtengo el valor en el STACK
                    //y lo guardo en el temporal que cree
                    //creo una nueva instancia de operacion y le paso el valor de la variable
                    //y E
                    
                    let varObj = new Id(0,0,this.id);
                    let op2 = this.asingLast.value;
                    let result =  new Operation(varObj,op2,this.asingLast.tipo,0,0);
                    result = result.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);

                    if(variableObj.type == result.type) {
                        let newCod3dObj = new tsObject(0,0,null,null);
                        newCod3dObj.code3d += result.code3d;
                        newCod3dObj.code3d += 'Stack[(int)'+variableObj.pointer+']='+result.pointer+';\n'
                        
                        return newCod3dObj;

                    } else {
                        console.log("ERROR tipos incorrectos");
                        return null;
                    }
                }

            } else {
                console.log("ERROR La variable no existe")
                return null;
            }
        }
        

        
    }
}
module.exports = VariableChange;
},{"./Id":15,"./Operation":21,"./tsObject":33}],30:[function(require,module,exports){
const tsObject = require('./tsObject');
const Scope = require('./Scope');

class While {
    constructor(line,column,exp,stmt) {
        this.line = line;
        this.column = column;
        this.exp = exp;
        this.stmt = stmt;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {

        let entryLabel = 'L'+scope.getNewLabel();
        let exitLabel = 'L'+scope.getNewLabel();
        let bodyLabel = 'L'+scope.getNewLabel();
        let tempStack = 't' + scope.getNewTemp();

        let newTsObject = new tsObject(0,0,null,null);
        let E;
        let Statement = '';

        newTsObject.code3d += tempStack + '= P;\n';
        newTsObject.code3d += entryLabel + ':\n';
        E = this.exp.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        newTsObject.code3d += E.code3d;
        newTsObject.code3d += 'if('+E.pointer+') goto '+bodyLabel+';\n'
        newTsObject.code3d += 'goto '+exitLabel+';\n'
        newTsObject.code3d += bodyLabel + ':\n';
        let newScope = new Scope(scope,scope.terminal,scope.label);

        this.stmt.forEach(element => {
            Statement += element.translate(newScope,returnlbl,exitLabel,entryLabel,funcID,sCounter).code3d;
        });
        //Statement = this.stmt.translate(newScope)
        newTsObject.code3d += Statement

        scope.terminal = newScope.terminal;
        scope.label = newScope.label;

        newTsObject.code3d += 'goto '+entryLabel+';\n'
        newTsObject.code3d += exitLabel + ':\n\n';
        newTsObject.code3d += 'P = '+tempStack+';\n';
        return newTsObject;
    }
}
module.exports = While;
},{"./Scope":25,"./tsObject":33}],31:[function(require,module,exports){
const tsObject = require('./tsObject');
const Print = require('./Print')
const Id = require('./Id');

class callFunction {
    constructor(id,Pl,paramFunc) {
        this.id = id;
        this.Pl = Pl;
        this.paramFunc = paramFunc;
    }

    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        let func = scope.existsFunction(this.id);

        if(this.id == 'console') {
            let prnt = new Print(this.paramFunc,0);
            prnt = prnt.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
            prnt.code3d+='printf("\\n");\n';
            return prnt;
        } else {
            if(func) {

                
                    //console.log(func);
                    let newTsObject = new tsObject(0,0,null,func.type);//cambie el typo de null a func.type
                    if(this.paramFunc.length == func.paramsList.length) {
                        newTsObject.code3d += "\n/////////////////CALL INICIO/////////////////////////\n";
                        let prevTemps = [];
                        let StackC = 0;
                        //RECURSIVIDAD
                        let newTemp = 't' + scope.getNewTemp()
                        let palist;
                        let param;
                        if(funcID) {
                            if(funcID == this.id) {
                                palist = scope.getVariablesInFunc();
                                let auxTemp = 't'+scope.getNewTemp();
                                console.log(palist)
                                for(let i = 0;i<palist.length;i++) {
                                    //let ptemp = 't' + scope.getNewTemp()
                                    
                                    newTsObject.code3d += auxTemp + '=P;\n';
                                    //newTsObject.code3d += ptemp + '=Stack[(int)'+palist[i]+'];\n';
                                    newTsObject.code3d += 'Stack[(int)'+auxTemp+'] = '+palist[i]+';\n';
                                    newTsObject.code3d += 'P = P + 1;\n';
                                    StackC++;
                                    if(sCounter)
                                        sCounter++;                               
                                }
                                param = scope.getFunctionParameters();
                                console.log(param);
                                for(let i = 0;i<param.length;i++) {
                                    let ptemp = 't' + scope.getNewTemp();
                                    newTsObject.code3d += ptemp + ' = '+param[i]+';\n';
                                    newTsObject.code3d += auxTemp +'=P;\n';
                                    newTsObject.code3d += 'Stack[(int)'+auxTemp+']='+ptemp+';\n';
                                    newTsObject.code3d += 'P = P + 1;\n';
                                    StackC++;
                                }

                            } else {
                                newTsObject.code3d += newTemp +'=P;\n';
                            }
                        } else {
                            newTsObject.code3d += newTemp +'=P;\n';
                        }

                        let plist = '';
                            
                        for (let i = 0; i < this.paramFunc.length; i++) {
                            let obj = this.paramFunc[i].translate(scope,returnlbl,breaklbl,continuelbl,this.id,sCounter);
                            plist += obj.code3d;
                            plist += func.paramsList[i] + '=P;\n';
                            plist += 'Stack[(int)'+func.paramsList[i]+']='+obj.pointer+';\n';
                            plist += 'P = P + 1;\n';
                            StackC++;
                            if(sCounter)
                                sCounter++;
                        }
                        
                        newTsObject.code3d += plist;
                        newTsObject.code3d += this.id + '();\n';
                        let funcs = scope.existsFunction(this.id);

                        if(funcs.returnValue == 0) {
                            
                            let retTemp = 't'+scope.getNewTemp()
                            newTsObject.code3d += retTemp + '='+funcs.returnTemp+';\n';
                            
                            newTsObject.pointer = retTemp;
                            newTsObject.type = funcs.type;
                            scope.tempList.push(retTemp);
                        }
                        

                        //RECURSIVIDAD
                        if(funcID) {
                            if(funcID == this.id) {
                                newTsObject.code3d += 'P = P - '+StackC+';\n';
                                let finalTemp = 't' + scope.getNewTemp();
                                StackC = 0;

                                
                                for(let i = 0;i<palist.length;i++) {
                                    newTsObject.code3d += finalTemp + ' = P;\n';
                                    newTsObject.code3d += palist[i] + ' = Stack[(int)'+finalTemp+'];\n';
                                    newTsObject.code3d += 'P = P + 1;\n';
                                    StackC++;
                                }
                                let auxTemp = 't'+scope.getNewTemp();
                                for(let i = 0;i<param.length;i++) {
                                    let ptemp = 't' + scope.getNewTemp();

                                    newTsObject.code3d += auxTemp +'=P;\n';
                                    newTsObject.code3d += ptemp + '=Stack[(int)'+auxTemp+'];\n';
                                    //newTsObject.code3d += 'Stack[(int)'+param[i]+']='+ptemp+';\n';
                                    newTsObject.code3d += param[i] + '= '+ptemp+';\n';
                                    newTsObject.code3d += 'P = P + 1;\n';
                                    StackC++;
                                }

                                newTsObject.code3d += 'P = P - '+StackC+';\n';
                                if(sCounter)
                                    sCounter=0;
                            } else {
                                newTsObject.code3d += 'P='+newTemp+';\n';
                            }
                        } else {
                            newTsObject.code3d += 'P='+newTemp+';\n';
                        }

                        newTsObject.code3d += "/////////////////CALL FIN/////////////////////////\n\n";
                        return newTsObject;

                    } else {
                        console.log("ERROR")
                    }
                
                
            } else {

                if(this.Pl != null) {
                    
                    let IdRes = new Id(0,0,this.id);
                    IdRes = IdRes.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        
                    this.Pl.param = this.paramFunc;
                    this.Pl.obj = IdRes;
                    let r = this.Pl.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
                    //console.log(r);
                    return r;
                } else {

                    console.log("ERROR la funcion no existe");
                }
            }
        }
    }

}
module.exports = callFunction;
},{"./Id":15,"./Print":22,"./tsObject":33}],32:[function(require,module,exports){
const tsObject = require('./tsObject');

class defLast {
    constructor(type,value) {
        this.type = type;
        this.value = value;
    }
    
    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {
        const E = this.value.translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter);
        return {type:this.type.type,value:E,dim:this.type.list}
    }
}

module.exports = defLast;
},{"./tsObject":33}],33:[function(require,module,exports){
class tsObject{

    constructor(line,column,value,type) {
        this.line = line;
        this.column = column;
        this.value = value;
        this.type = type;
        this.code3d = '';
        this.isArray = false;
        this.isType = false;
        this.dim = [];
        this.arrFinal = 0;
        this.list = [];
        this.arrLen = 0;
        this.isNull = false;
        
        if(this.type == 'null')
            this.isNull == true;
        //number
        if(this.type == 'number' || this.type == 'boolean' || this.type == 'null')
            this.pointer = this.value;
    }

    
    translate(scope,returnlbl,breaklbl,continuelbl,funcID,sCounter) {

        if(this.type == 'string') {
            if(this.value != null) {

            
                let string = this.value.substring(1,this.value.length-1);
            
            //if(string.length == 2) {
                
                /*if(string == '\\n') {

                    
                    let newTemp = 't' + scope.getNewTemp();
                    let newTempCounter = 't' + scope.getNewTemp();
                    this.pointer = newTemp;
                    this.code3d += newTemp + '=H;\n';
                    this.code3d += newTempCounter + '=H;\n';
                    
                        this.code3d += 'Heap[(int)' + newTempCounter + '] = 10;\n'
                        this.code3d += newTempCounter + '=' + newTempCounter + '+1;\n'
                    
                    this.code3d += 'Heap[(int)'+newTempCounter+']='+'\0'.charCodeAt(0)+';\n';
                    this.code3d += newTempCounter + '='+newTempCounter + '+1;\n';
                    this.code3d += 'H=' + newTempCounter +';\n';
                    this.value = undefined;

                    return this;
                }*/
            //}
                
                //string = string.replace("\n","\\n")
                
                let newTemp = 't' + scope.getNewTemp();
                let newTempCounter = 't' + scope.getNewTemp();
                this.pointer = newTemp;
                
                this.code3d += '\n//////////////////////////////////\n';

                this.code3d += newTemp + '=H;\n';
                this.code3d += newTempCounter + '=H;\n';

                for(let i =0;i<string.length;i++) {

                    if(string[i] == "\\" && i<string.length-1) {
                        if(string[i+1]=='n') {
                            this.code3d += 'Heap[(int)' + newTempCounter + '] = 10;\n'
                            this.code3d += newTempCounter + '=' + newTempCounter + '+1;\n'
                            i++;
                        } else {
                            this.code3d += 'Heap[(int)' + newTempCounter + '] = ' + string.charCodeAt(i) + ';\n'
                            this.code3d += newTempCounter + '=' + newTempCounter + '+1;\n'
                        }
                    } else {
                        this.code3d += 'Heap[(int)' + newTempCounter + '] = ' + string.charCodeAt(i) + ';\n'
                        this.code3d += newTempCounter + '=' + newTempCounter + '+1;\n'
                    }
                }
                this.code3d += 'Heap[(int)'+newTempCounter+']='+'\0'.charCodeAt(0)+';\n';
                this.code3d += newTempCounter + '='+newTempCounter + '+1;\n';
                this.code3d += 'H=' + newTempCounter +';\n';
                this.value = undefined;
                this.code3d += '\n//////////////////////////////////\n';
            }
        }

        return this;
    }
}

module.exports = tsObject;
},{}],34:[function(require,module,exports){
(function (process){(function (){
/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var astGraph = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,6],$V1=[1,13],$V2=[1,15],$V3=[1,16],$V4=[1,17],$V5=[1,18],$V6=[1,19],$V7=[1,20],$V8=[1,21],$V9=[1,22],$Va=[5,9,10,30,42,47,48,49,57,58,81],$Vb=[1,32],$Vc=[2,15],$Vd=[1,30],$Ve=[1,31],$Vf=[1,33],$Vg=[1,34],$Vh=[1,35],$Vi=[1,36],$Vj=[1,37],$Vk=[1,38],$Vl=[5,9,10,14,30,38,39,40,42,47,48,49,53,56,57,58,81],$Vm=[2,14],$Vn=[5,9,10,14,15,25,30,38,39,40,42,47,48,49,53,56,57,58,81],$Vo=[1,60],$Vp=[1,53],$Vq=[1,61],$Vr=[1,51],$Vs=[1,52],$Vt=[1,54],$Vu=[1,55],$Vv=[1,56],$Vw=[1,57],$Vx=[1,58],$Vy=[1,59],$Vz=[1,65],$VA=[15,28],$VB=[2,95],$VC=[1,72],$VD=[1,71],$VE=[1,85],$VF=[1,86],$VG=[1,87],$VH=[2,17],$VI=[1,111],$VJ=[1,112],$VK=[1,96],$VL=[1,97],$VM=[1,98],$VN=[1,99],$VO=[1,100],$VP=[1,101],$VQ=[1,102],$VR=[1,103],$VS=[1,104],$VT=[1,105],$VU=[1,106],$VV=[1,107],$VW=[1,108],$VX=[1,109],$VY=[1,110],$VZ=[5,9,10,11,14,15,25,28,30,33,38,39,40,42,47,48,49,53,56,57,58,61,62,69,76,77,81,89,90,91,92,93,94,95,96,97,98,99,100,101,102,104],$V_=[5,9,10,11,14,15,23,25,28,30,33,38,39,40,42,47,48,49,53,56,57,58,61,62,69,72,73,74,75,76,77,81,89,90,91,92,93,94,95,96,97,98,99,100,101,102,104],$V$=[2,76],$V01=[5,9,10,14,15,25,28,30,38,39,40,42,47,48,49,53,56,57,58,69,81],$V11=[1,127],$V21=[1,135],$V31=[1,131],$V41=[1,132],$V51=[1,133],$V61=[1,134],$V71=[10,14,38,39,40,42,47,48,49,53,56,57,58,81],$V81=[1,154],$V91=[1,155],$Va1=[1,159],$Vb1=[25,28],$Vc1=[28,69],$Vd1=[1,186],$Ve1=[1,185],$Vf1=[14,15,28],$Vg1=[11,12,14,15,25,28],$Vh1=[2,102],$Vi1=[1,194],$Vj1=[10,23,68,90,103,105,106,107,108,109,110],$Vk1=[5,9,10,11,14,15,25,28,30,33,38,39,40,42,47,48,49,53,56,57,58,61,62,69,81,89,90,95,96,97,98,99,100,101,102,104],$Vl1=[5,9,10,11,14,15,25,28,30,33,38,39,40,42,47,48,49,53,56,57,58,61,62,69,81,89,90,91,92,94,95,96,97,98,99,100,101,102,104],$Vm1=[5,9,10,11,14,15,25,28,30,33,38,39,40,42,47,48,49,53,56,57,58,61,62,69,81,95,96,97,98,99,100,101,102,104],$Vn1=[1,238],$Vo1=[11,12,14,15,25,28,68],$Vp1=[1,261],$Vq1=[2,43],$Vr1=[1,273],$Vs1=[14,53,56];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"S":3,"Bloque":4,"EOF":5,"Instruccion":6,"llamadaFuncion":7,"variables":8,"Type":9,"id":10,"igual":11,"curlyBraceOpen":12,"parsObj":13,"curlyBraceClose":14,"semicolon":15,"funciones":16,"IF":17,"WHILE":18,"DOWHILE":19,"SWITCH":20,"FOR":21,"PL":22,"bracketOpen":23,"paramFunc":24,"bracketClose":25,"varLast":26,"paramFuncList":27,"comma":28,"E":29,"function":30,"funcParam":31,"funcDec":32,"dosPuntos":33,"types":34,"STMT":35,"funcParamList":36,"InstruccionI":37,"Break":38,"Continue":39,"return":40,"OP":41,"if":42,"exp":43,"IFLAST":44,"else":45,"IFCOND":46,"while":47,"do":48,"switch":49,"FIRSTCASE":50,"LASTCASE":51,"CASE":52,"case":53,"DEFCASE":54,"ENDCASE":55,"default":56,"for":57,"let":58,"asignLast":59,"forOP":60,"in":61,"of":62,"defVarLast":63,"defVarLastP":64,"defLast":65,"defType":66,"asignLastF":67,"sqBracketOpen":68,"sqBracketClose":69,"auxP":70,"point":71,"masIgual":72,"menosIgual":73,"porIgual":74,"divisionIgual":75,"increment":76,"decrement":77,"objType":78,"opkv":79,"keyvalueT":80,"const":81,"number":82,"typesList":83,"boolean":84,"string":85,"void":86,"typesL":87,"objetoParam":88,"mas":89,"menos":90,"por":91,"division":92,"potencia":93,"modulo":94,"mayorque":95,"menorque":96,"mayorigualque":97,"menorigualque":98,"igualdad":99,"diferencia":100,"and":101,"or":102,"not":103,"question":104,"NUMBER":105,"STRING":106,"true":107,"false":108,"null":109,"new":110,"arrParam":111,"listArrParam":112,"objetoParamList":113,"keyvalue":114,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",9:"Type",10:"id",11:"igual",12:"curlyBraceOpen",14:"curlyBraceClose",15:"semicolon",23:"bracketOpen",25:"bracketClose",28:"comma",30:"function",33:"dosPuntos",38:"Break",39:"Continue",40:"return",42:"if",45:"else",47:"while",48:"do",49:"switch",53:"case",56:"default",57:"for",58:"let",61:"in",62:"of",68:"sqBracketOpen",69:"sqBracketClose",71:"point",72:"masIgual",73:"menosIgual",74:"porIgual",75:"divisionIgual",76:"increment",77:"decrement",81:"const",82:"number",84:"boolean",85:"string",86:"void",89:"mas",90:"menos",91:"por",92:"division",93:"potencia",94:"modulo",95:"mayorque",96:"menorque",97:"mayorigualque",98:"menorigualque",99:"igualdad",100:"diferencia",101:"and",102:"or",103:"not",104:"question",105:"NUMBER",106:"STRING",107:"true",108:"false",109:"null",110:"new"},
productions_: [0,[3,2],[4,2],[4,1],[6,1],[6,1],[6,7],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[7,6],[22,1],[22,0],[24,1],[24,0],[27,3],[27,1],[16,6],[32,5],[32,3],[31,1],[31,0],[36,5],[36,3],[35,2],[35,1],[37,1],[37,1],[37,1],[37,1],[37,1],[37,1],[37,1],[37,2],[37,2],[37,2],[41,2],[41,1],[17,8],[44,2],[44,0],[46,8],[46,3],[18,7],[19,9],[20,8],[50,1],[50,0],[52,5],[52,4],[51,2],[54,3],[55,1],[55,0],[21,15],[21,14],[21,12],[21,10],[21,9],[60,1],[60,1],[63,2],[63,0],[64,4],[64,2],[8,5],[8,3],[8,2],[59,2],[59,1],[26,4],[26,3],[70,1],[70,0],[67,2],[67,2],[67,2],[67,2],[67,2],[67,1],[67,1],[13,1],[13,0],[78,3],[78,1],[79,1],[79,1],[80,3],[66,1],[66,1],[65,4],[65,2],[65,0],[34,2],[34,2],[34,2],[34,2],[34,2],[83,1],[83,0],[87,3],[87,2],[29,1],[29,3],[43,3],[43,3],[43,3],[43,3],[43,2],[43,3],[43,3],[43,3],[43,3],[43,3],[43,3],[43,3],[43,3],[43,3],[43,3],[43,2],[43,3],[43,5],[43,2],[43,2],[43,1],[43,1],[43,1],[43,1],[43,1],[43,5],[43,2],[43,1],[43,5],[43,3],[111,1],[111,0],[112,3],[112,1],[88,1],[88,0],[113,3],[113,1],[114,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 
	contador++;
	return ast.Node(contador,"S",$$[$0-1],null);	
	 

break;
case 2: case 27:
 
			contador++;
			this.$ = ast.Node(contador,"Bloque",$$[$0-1],$$[$0]);
		
break;
case 3:
 
		contador++;
		this.$ = ast.Node(contador,"Instruccion",$$[$0],null);
	
break;
case 4: case 7: case 8: case 10: case 11: case 12: case 29: case 30: case 31: case 32: case 33: case 34: case 35:
 this.$=$$[$0]; 
break;
case 5: case 9: case 16:
 this.$=$$[$0];
break;
case 6:

				contador++;
				var id = ast.Leaf(contador,$$[$0-5]);
				contador++;
				var igual = ast.Leaf(contador,"=");
				contador++;
				var curlyO = ast.Leaf(contador,"\"{\"")
				contador++;
				var curlyC = ast.Leaf(contador,"\"}\"")
				var arr = [];
				arr.push(id)
				arr.push(igual)
				arr.push(curlyO)
				if($$[$0-2]) {
					arr.push($$[$0-2])
				}
				arr.push(curlyC)

				contador++;
				this.$ = ast.Node(contador,"TYPE",arr,null);
			
break;
case 13:

					contador++;
					var id = ast.Leaf(contador,$$[$0-5]);
					contador++;
					var bkOp = ast.Leaf(contador,"ParentesisAbre")
					contador++;
					var bkC = ast.Leaf(contador,"ParentesisCierra")
					var arr = [];
					arr.push(id)
					if($$[$0-4]!=null) {
						arr.push($$[$0-4])
					}
					arr.push(bkOp)
					if($$[$0-2]) {
						arr.push($$[$0-2])
					}
					arr.push(bkC)
					contador++;
					this.$ = ast.Node(contador,"LlamadaFuncion",arr,null);
				
break;
case 14:
this.$= $$[$0];
break;
case 15: case 85: case 138:
this.$ = null;
break;
case 17:
 this.$=null;
break;
case 18:

					  contador++;
					  this.$ = ast.Node(contador,"listaParametros",$$[$0-2],$$[$0]);
					
break;
case 19: case 84: case 88: case 89:
this.$ = $$[$0];
break;
case 20:

		contador++;
		var id = ast.Leaf(contador,$$[$0-4]);
		contador++;
		var bo = ast.Leaf(contador,"ParentesisAbre")
		contador++;
		var bc = ast.Leaf(contador,"ParentesisCierre")
		var arr = []
		arr.push(id)
		arr.push(bo)
		if($$[$0-2]) {
			arr.push($$[$0-2])
		}
		arr.push(bc)
		if($$[$0].hasOwnProperty("type")) {
			arr.push($$[$0].type)
			arr.push($$[$0].value)
		} else {
			arr.push($$[$0].value)
		}
		contador++;
		this.$ = ast.Node(contador,"Funcion",arr,null)


break;
case 21:

			contador++;
			var type = ast.Leaf(contador,$$[$0-3])
			this.$ = {value:$$[$0-1],type:type}
		
break;
case 22:

			this.$ = {value:$$[$0-1]};	
		
break;
case 23:
 this.$ =$$[$0];
break;
case 24: case 40: case 43: case 50: case 56: case 95:
 this.$ = null; 
break;
case 25:

					contador++;
				  	var id = ast.Leaf(contador,$$[$0-2]);
				  	contador++;
				  	var types = ast.Leaf(contador,$$[$0]);
				  	contador++;
				  	var param = ast.Node(contador,"Parametro",id,types)
					contador++;
					this.$ = ast.Node(contador,"ListaParametro",$$[$0-4],param)
			   
break;
case 26:

				  contador++;
				  var id = ast.Leaf(contador,$$[$0-2]);
				  contador++;
				  var types = ast.Leaf(contador,$$[$0]);
				  contador++;
				  this.$ = ast.Node(contador,"Parametro",id,types)
			  
break;
case 28:
 
		contador++;
		this.$ = ast.Node(contador,"Instruccion",$$[$0],null);
	 
break;
case 36:
 
				contador++;
				this.$ = ast.Leaf(contador,"Break"); 
			
break;
case 37:

				contador++;
				this.$ = ast.Leaf(contador,"Continue"); 
			
break;
case 38:
 
				contador++;
				this.$ = ast.Node(contador,"RETURN",$$[$0],null);
			
break;
case 39:
 this.$ = $$[$0-1];
break;
case 41:
 
		contador++;
		var Condicion = ast.Node(contador,"Condicion",$$[$0-5],null)
		contador++;
		var IF_STMT = ast.Node(contador,"IF",[Condicion,$$[$0-2]],$$[$0])
		this.$ = IF_STMT;
	
break;
case 42:
 
			contador++;
		   	this.$ = ast.Node(contador,"ELSE",$$[$0],null);
		
break;
case 44:

		   contador++;
		   var conditon = ast.Node(contador,"Condicion",$$[$0-5],null);
		   contador++;
		   this.$ = ast.Node(contador,"IF",[conditon,$$[$0-2]],$$[$0])
	   
break;
case 45:

		   this.$ = $$[$0-1];
	   
break;
case 46:

			contador++;
			var condition = ast.Node(contador,"Condicion",$$[$0-4],null)
			contador++;
			this.$=  ast.Node(contador,"WHILE",condition,$$[$0-1])
		
break;
case 47:

			contador++;
			var condition = ast.Node(contador,"Condicion",$$[$0-2],null)
			contador++;
			this.$ =  ast.Node(contador,"DOWHILE",$$[$0-6],condition)
		
break;
case 48:

			contador++;
			var param = [];
			param.push($$[$0-5]);
			if($$[$0-2] != null) {
				param.push($$[$0-2])
			}
			if($$[$0-1] != null) {
				param.push($$[$0-1])
			}
			this.$ = ast.Node(contador,"SWITCH",param,null)
		
break;
case 49:
this.$ =$$[$0]; 
break;
case 51:

		contador++;
		var caseT = ast.Node(contador,"CASE",$$[$0-2],$$[$0]);
		contador++;
		this.$ = ast.Node(contador,"CaseList",$$[$0-4],caseT);
	 
break;
case 52:

		contador++;
		this.$ = ast.Node(contador,"CASE",$$[$0-2],$$[$0]);
	 
break;
case 53:

		this.$ = $$[$0-1];
	
break;
case 54:

	contador++;
	this.$ = ast.Node(contador,"DEFAULT",$$[$0],null)

break;
case 55: case 62: case 63: case 91: case 92: case 137: case 141:
 this.$ = $$[$0]; 
break;
case 57:

		contador++;
		var dect = ast.Leaf(contador,"let");
		contador++;
		var id = ast.Leaf(contador,$$[$0-11]);
		contador++;
		var igual = ast.Leaf(contador,"=");
		var asign = [dect,id,igual,$$[$0-9]]
		
		contador++;
		var asignacion = ast.Node(contador,"ASIGNACION",asign,null);
		
		contador++;
		var condicion = ast.Node(contador,"CONDICION",$$[$0-7],null);
		
		var arr = [];
		arr.push(asignacion)
		arr.push(condicion)
		
		if($$[$0-4].hasOwnProperty("varlast")) {
			contador++;
			var id = ast.Leaf(contador,$$[$0-5]);
			if($$[$0-4].value.length == 2) {
				contador++;
				var inc = ast.Node(contador,$$[$0-4].value[0],id,$$[$0-4].value[1])
				arr.push(inc)
			} else {
				contador++;
				var inc = ast.Node(contador,$$[$0-4].value[0],id,null);
				arr.push(inc)
			}
			
		} else {
			contador++;
			var id = ast.Leaf(contador,$$[$0-5]);
			if($$[$0-4].value.length == 2) {
				contador++;
				var inc = ast.Node(contador,$$[$0-4].value[0],id,$$[$0-4].value[1])
				arr.push(inc)
			} else {
				contador++;
				var inc = ast.Node(contador,$$[$0-4].value[0],id,null);
				arr.push(inc)
			}
		}
		arr.push($$[$0-1])
		contador++;
		this.$ = ast.Node(contador,"FOR",arr,null)
		
	
break;
case 58:

		
		
		contador++;
		var igual = ast.Leaf(contador,"=");

		var asign = [$$[$0-11],igual,$$[$0-9]]
		
		contador++;
		var asignacion = ast.Node(contador,"ASIGNACION",asign,null);
		
		contador++;
		var condicion = ast.Node(contador,"CONDICION",$$[$0-7],null);
		
		var arr = [];
		arr.push(asignacion)
		arr.push(condicion)
		
		if($$[$0-4].hasOwnProperty("varlast")) {
			contador++;
			var id = ast.Leaf(contador,$$[$0-5]);
			arr.push(id)
			arr.push($$[$0-4].varlast)
		} else {
			contador++;
			var id = ast.Leaf(contador,$$[$0-5]);
			if($$[$0-4].value.length == 2) {
				contador++;
				var inc = ast.Node(contador,$$[$0-4].value[0],id,$$[$0-4].value[1])
				arr.push(inc)
			} else {
				contador++;
				var inc = ast.Node(contador,$$[$0-4].value[0],id,null);
				arr.push(inc)
			}
		}
		arr.push($$[$0-1])
		contador++;
		this.$ = ast.Node(contador,"FOR",arr,null)
	
break;
case 59:

		
		
		contador++;
		var asignacion = ast.Node(contador,"ASIGNACION",$$[$0-9],null);
		
		contador++;
		var condicion = ast.Node(contador,"CONDICION",$$[$0-7],null);
		
		var arr = [];
		arr.push(asignacion)
		arr.push(condicion)
		
		if($$[$0-4].hasOwnProperty("varlast")) {
			contador++;
			var id = ast.Leaf(contador,$$[$0-5]);
			arr.push(id)
			arr.push($$[$0-4].varlast)
		} else {
			contador++;
			var id = ast.Leaf(contador,$$[$0-5]);
			
			if($$[$0-4].value.length == 2) {
				contador++;
				var inc = ast.Node(contador,$$[$0-4].value[0],id,$$[$0-4].value[1])
				arr.push(inc)
			} else {
				contador++;
				var inc = ast.Node(contador,$$[$0-4].value[0],id,null);
				arr.push(inc)
			}
		}
		arr.push($$[$0-1])
		contador++;
		this.$ = ast.Node(contador,"FOR",arr,null)
	
break;
case 60:

		contador++;
		var dec = ast.Leaf(contador,"let")
		contador++;
		var id = ast.Leaf(contador,$$[$0-6])
		contador++;
		var forOP = ast.Leaf(contador,$$[$0-5])
		var arr = []
		arr.push(dec)
		arr.push(id)
		arr.push(forOP)
		arr.push($$[$0-4])
		arr.push($$[$0-1])
		contador++;
		this.$ = ast.Node(contador,"FOR",arr,null)


	
break;
case 61:

		
		
		contador++;
		var forOP = ast.Leaf(contador,$$[$0-5])
		var arr = []
		arr.push($$[$0-6])
		arr.push(forOP)
		arr.push($$[$0-4])
		arr.push($$[$0-1])
		contador++;
		this.$ = ast.Node(contador,"FOR",arr,null)
	
break;
case 64:

				contador++;
				var comma = ast.Leaf(contador,",");
				contador++;
				this.$ = ast.Node(contador,"defVar",comma,$$[$0]);
			
break;
case 65:
this.$=null;
break;
case 66:

				var result;
				contador++;
				var comma = ast.Leaf(contador,",");
				contador++;
				var id = ast.Leaf(contador,$$[$0-1]);
				if($$[$0] == null){
					result = ast.Node(contador,"defVarList",[$$[$0-3],comma,id],null)
				} else {
					if($$[$0].hasOwnProperty("type")) {
						contador++;
						var par3 = ast.Leaf(contador,$$[$0].type);
						contador++;
						result = ast.Node(contador,"defVarList",[$$[$0-3],comma,id,par3,$$[$0].value],null);
					} else {
						contador++;
						result = ast.Node(contador,"defVarList",[$$[$0-3],comma,id,$$[$0].value],null);
					}
				}
				this.$ = result;
			
break;
case 67:

				var result;
				contador++;
				var id = ast.Leaf(contador,$$[$0-1]);
				if($$[$0] == null) {
					result = ast.Node(contador,"defVarList",id,null)
				} else {
					if($$[$0].hasOwnProperty("type")) {
						contador++;
						var par3 = ast.Leaf(contador,$$[$0].type);
						contador++;
						result = ast.Node(contador,"defVarList",[id,par3,$$[$0].value],null);
					} else {
						contador++;
						result = ast.Node(contador,"defVarList",[id,$$[$0].value],null);
					}
				}
				this.$ = result;
			
break;
case 68:

				contador++;
				var decType = ast.Leaf(contador,$$[$0-4]);
				contador++;
				var id = ast.Leaf(contador,$$[$0-3]);

				var result;
				if($$[$0-2] == null) {
					contador++;
					result = ast.Node(contador,"Asignacion",[decType,id],$$[$0-1]);
				} else {
					var par3;
					if($$[$0-2].hasOwnProperty("type")) {
						contador++;
						par3 = ast.Leaf(contador,$$[$0-2].type);
						contador++;
						result = ast.Node(contador,"Asignacion",[decType,id,par3,$$[$0-2].value],$$[$0-1]);
					} else {
						contador++;
						result = ast.Node(contador,"Asignacion",[decType,id,$$[$0-2].value],$$[$0-1]);
					}
					this.$ = result;
				}
			
break;
case 69:
	
			  var r;
			  if($$[$0-1].value.length == 2) {
				  	contador++;
					var id;
					if($$[$0-1].hasOwnProperty("varlast")) {
						id = ast.Leaf(contador,$$[$0-2]);
						id = [id,$$[$0-1].varlast];
						console.log(id)
					} else {
			  			id = ast.Leaf(contador,$$[$0-2]);
					}
					contador++;
					r = this.$ = ast.Node(contador,$$[$0-1].value[0],id,$$[$0-1].value[1]);
			  } else {
				  contador++;
					var id;
					if($$[$0-1].hasOwnProperty("varlast")) {
						id = ast.Leaf(contador,$$[$0-2]);
						id = [id,$$[$0-1].varlast];
						console.log(id)
					} else {
			  			id = ast.Leaf(contador,$$[$0-2]);
					}
					contador++;
					r = this.$ = ast.Node(contador,$$[$0-1].value[0],id,null);
			  
			  }
			 this.$ = r;
		  
break;
case 70:

			var r;
			  if($$[$0].value.length == 2) {
				  	contador++;
					var id;
					if($$[$0].hasOwnProperty("varlast")) {
						id = ast.Leaf(contador,$$[$0-1]);
						id = [id,$$[$0].varlast];
						console.log(id)
					} else {
			  			id = ast.Leaf(contador,$$[$0-1]);
					}
					contador++;
					r = ast.Node(contador,$$[$0].value[0],id,$$[$0].value[1]);
			  } else {
				  contador++;
					var id;
					if($$[$0].hasOwnProperty("varlast")) {
						id = ast.Leaf(contador,$$[$0-1]);
						id = [id,$$[$0].varlast];
						console.log(id)
					} else {
			  			id = ast.Leaf(contador,$$[$0-1]);
					}
					contador++;
					r = this.$ = ast.Node(contador,$$[$0].value[0],id,null);
			  
			  }
			 this.$ = r;
		  
break;
case 71:

				$$[$0].varlast = $$[$0-1];
				this.$ = $$[$0];
			
break;
case 72:

			this.$ =$$[$0];
		 
break;
case 73:
 
			contador++;
			var p1 = ast.Leaf(contador,"corchete Abre");
			contador++;
			var p2 = ast.Leaf(contador,"corchete cierra");
			contador++;
			this.$ = ast.Node(contador,"varLast",[p1,$$[$0-2],p2],$$[$0])
			
		
break;
case 74:
 
			contador++;
			var pi = ast.Leaf(contador,$$[$0-2]+$$[$0-1]);
			contador++;
			this.$ = ast.Node(contador,"varLast",pi,$$[$0])
		
break;
case 75:
 this.$ = $$[$0];
break;
case 76:
 this.$ = null;
break;
case 77: case 78: case 79: case 80: case 81:
	
				this.$ = {value:[$$[$0-1],$$[$0]]}
			
break;
case 82:

				this.$={value:[$$[$0]]}
			
break;
case 83:

				this.$={value:["'--'"]}
			
break;
case 86:

			contador++;
			this.$ = ast.Node(contador,"ListType",$$[$0-2],$$[$0]);
		
break;
case 87:
this.$ =$$[$0];
break;
case 90:

			contador++;
			var id = ast.Leaf(contador,$$[$0-2]);
			contador++;
			var types = ast.Leaf(contador,$$[$0]);
			contador++;
			this.$ = ast.Node(contador,"KeyValue",id,types);
		
break;
case 93:

			this.$ = {value:$$[$0],type:$$[$0-2]}
		
break;
case 94:
 
			this.$ = {value:$$[$0]}
		
break;
case 96: case 98: case 100:

		   this.$ = $$[$0] + $$[$0-1];
	   
break;
case 97:

		   this.$ = $$[$0] + $$[$0-1];
	  
break;
case 99:

		  this.$ = $$[$0] + $$[$0-1];
	   
break;
case 101:
 this.$ = "arreglo de dimension " + $$[$0]+ " " ; 
break;
case 102:
 this.$ = ""; 
break;
case 103:

			this.$ = $$[$0-2] + 1;
		
break;
case 104:

			this.$ = 1;
		
break;
case 105:

			contador++;
			this.$ =  ast.Node(contador,"E",$$[$0],null);
		
break;
case 106:

		contador++;
		var curlyO = ast.Leaf(contador,"\"{\"");
		contador++;
		var curlyC = ast.Leaf(contador,"\"}\"");
		var arr = []
		arr.push(curlyO)
		if($$[$0-1] != null) {
			arr.push($$[$0-1])
		}
		arr.push(curlyC)
		contador++;
		var obj = ast.Node(contador,"OBJETO",arr,null);
		contador++;
		this.$ = ast.Node(contador,"E",obj,null)
	
break;
case 107:
 
		contador++;
		var e =  ast.Node(contador,"+",$$[$0-2],$$[$0]);
		contador++;
		this.$ = ast.Node(contador,"exp",e,null)
	
break;
case 108:
 
		contador++;
		var e =  ast.Node(contador,"'-'",$$[$0-2],$$[$0]);
		contador++;
		this.$ = ast.Node(contador,"exp",e,null)
	
break;
case 109:
 
		contador++;
		var e =  ast.Node(contador,"*",$$[$0-2],$$[$0]);
		contador++;
		this.$ = ast.Node(contador,"exp",e,null)
	
break;
case 110:
 
		contador++;
		var e =  ast.Node(contador,"/",$$[$0-2],$$[$0]);
		contador++;
		this.$ = ast.Node(contador,"exp",e,null)
	
break;
case 111:

		contador++;
		var e =  ast.Node(contador,"'-'",$$[$0],null);
		contador++;
		this.$ = ast.Node(contador,"exp",e,null)
	
break;
case 112:
 
		contador++;
		var e =  ast.Node(contador,"**",$$[$0-2],$$[$0]);
		contador++;
		this.$ = ast.Node(contador,"exp",e,null)
	
break;
case 113:
 
		contador++;
		var e =  ast.Node(contador,"%",$$[$0-2],$$[$0]);
		contador++;
		this.$ = ast.Node(contador,"exp",e,null)
	
break;
case 114:
 
		contador++;
		var e =  ast.Node(contador,">",$$[$0-2],$$[$0]);
		contador++;
		this.$ = ast.Node(contador,"exp",e,null)
	
break;
case 115:
 
		contador++;
		var e =  ast.Node(contador,"<",$$[$0-2],$$[$0]);
		contador++;
		this.$ = ast.Node(contador,"exp",e,null)
	
break;
case 116:
 
		contador++;
		var e =  ast.Node(contador,">=",$$[$0-2],$$[$0]);
		contador++;
		this.$ = ast.Node(contador,"exp",e,null)
	
break;
case 117:
 
		contador++;
		var e =  ast.Node(contador,"<=",$$[$0-2],$$[$0]);
		contador++;
		this.$ = ast.Node(contador,"exp",e,null)
	
break;
case 118:
 
		contador++;
		var e =  ast.Node(contador,"==",$$[$0-2],$$[$0]);
		contador++;
		this.$ = ast.Node(contador,"exp",e,null)
	
break;
case 119:
 
		contador++;
		var e =  ast.Node(contador,"!=",$$[$0-2],$$[$0]);
		contador++;
		this.$ = ast.Node(contador,"exp",e,null)
	
break;
case 120:
 
		contador++;
		var e =  ast.Node(contador,"&&",$$[$0-2],$$[$0]);
		contador++;
		this.$ = ast.Node(contador,"exp",e,null)
	
break;
case 121:
 
		contador++;
		var e =  ast.Node(contador,"||",$$[$0-2],$$[$0]);
		contador++;
		this.$ = ast.Node(contador,"exp",e,null)
	
break;
case 122:
 
		contador++;
		var e =  ast.Node(contador,"!",$$[$0],null);
		contador++;
		this.$ = ast.Node(contador,"exp",e,null)
	
break;
case 123:

		contador++;
		parA = ast.Leaf(contador,"Parentesis Abre")
		contador++;
		parC = ast.Leaf(contador,"Parentesis Cierra")
		contador++;
		this.$ = ast.Node(contador,"exp",[parA,$$[$0-1],parC],null)
	
break;
case 124:
	
		contador++;
		var e1 = ast.Node(contador,"?",$$[$0-2],null);
		contador++;
		var e2 = ast.Node(contador,":",$$[$0],null);
		contador++;
		this.$ = ast.Node(contador,"OperadorTernario",[$$[$0-4],e1,e2],null)
	
break;
case 125:

		contador++;
		var inc = ast.Node(contador,"++",$$[$0-1],null)
		contador++;
		this.$ = ast.Node(contador,"exp",inc,null)
	
break;
case 126:

		contador++;
		var dec = ast.Node(contador,"'--'",$$[$0-1],null)
		contador++;
		this.$ = ast.Node(contador,"exp",dec,null)
	
break;
case 127: case 128: case 134:
 
		contador++;
		this.$ = ast.Leaf(contador,$$[$0]);
	
break;
case 129:
 
		contador++;
		this.$ = ast.Leaf(contador,"true");
	
break;
case 130:
 
		contador++;
		this.$ = ast.Leaf(contador,"false");
	
break;
case 131:
 
		contador++;
		this.$ = ast.Leaf(contador,"null");
	
break;
case 132:
   
        
        contador++;
		var exp = ast.Node(contador,"exp",$$[$0-1],null)
		contador++;
		var id = ast.Leaf(contador,$$[$0-3])
        contador++;
		this.$ = ast.Node(contador,"newArray",id,exp)

	
break;
case 133:

		contador++;
		var id = ast.Leaf(contador,$$[$0-1]);
		contador++;
		this.$ = ast.Node(contador,"exp",id,$$[$0])
	
break;
case 135:

		contador++;
		var id = ast.Leaf(contador,$$[$0-4]);
		contador++;
		var bkOp = ast.Leaf(contador,"ParentesisAbre")
		contador++;
		var bkC = ast.Leaf(contador,"ParentesisCierra")
		var arr = [];
		arr.push(id)
		if($$[$0-3]!=null) {
			arr.push($$[$0-3])
		}
		arr.push(bkOp)
		if($$[$0-1]) {
			arr.push($$[$0-1])
		}
		arr.push(bkC)
		contador++;
		this.$ = ast.Node(contador,"LlamadaFuncion",arr,null);
		

	
break;
case 136:

		contador++;
		var sqBO = ast.Leaf(contador,"corcheteA")
		contador++;
		var sqBC = ast.Leaf(contador,"corcheteC")
		contador++;
		var arr = [];
		arr.push(sqBO)
		if($$[$0-1] != null) {
			arr.push($$[$0-1])
		}
		arr.push(sqBC)
		this.$ = ast.Node(contador,"exp",arr,null)
	
break;
case 139:

				   contador++;
				   var comma = ast.Leaf(contador,",");
				   
				   contador++;
				   this.$ = ast.Node(contador,"ListaArreglos",[$$[$0-2],comma,$$[$0]],null)
			   
break;
case 140:
this.$=$$[$0]; 
break;
case 142:
this.$= null;
break;
case 143:

					contador++;
					this.$ = ast.Node(contador,"ListaObjeto",$$[$0-2],$$[$0]);
				
break;
case 144:
 this.$ =$$[$0]; 
break;
case 145:

		contador++;
		var id = ast.Leaf(contador,$$[$0-2])
		contador++;
		this.$ = ast.Node(contador,"KeyValue",id,$$[$0])
	
break;
}
},
table: [{3:1,4:2,6:3,7:4,8:5,9:$V0,10:$V1,16:7,17:8,18:9,19:10,20:11,21:12,30:$V2,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},{1:[3]},{5:[1,23],6:24,7:4,8:5,9:$V0,10:$V1,16:7,17:8,18:9,19:10,20:11,21:12,30:$V2,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},o($Va,[2,3]),o($Va,[2,4]),o($Va,[2,5]),{10:[1,25]},o($Va,[2,7]),o($Va,[2,8]),o($Va,[2,9]),o($Va,[2,10]),o($Va,[2,11]),o($Va,[2,12]),{11:$Vb,22:26,23:$Vc,26:28,59:27,67:29,68:$Vd,71:$Ve,72:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},{10:[1,39]},{10:[1,40]},{23:[1,41]},{23:[1,42]},{12:[1,43]},{23:[1,44]},{23:[1,45]},{10:[2,91]},{10:[2,92]},{1:[2,1]},o($Va,[2,2]),{11:[1,46]},{23:[1,47]},o($Vl,[2,70],{15:[1,48]}),{11:$Vb,23:$Vm,67:49,72:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},o($Vn,[2,72]),{10:$Vo,23:$Vp,43:50,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:[1,62]},{10:$Vo,12:$Vz,23:$Vp,29:63,43:64,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,12:$Vz,23:$Vp,29:66,43:64,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,12:$Vz,23:$Vp,29:67,43:64,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,12:$Vz,23:$Vp,29:68,43:64,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,12:$Vz,23:$Vp,29:69,43:64,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},o($Vn,[2,82]),o($Vn,[2,83]),o($VA,$VB,{65:70,11:$VC,33:$VD}),{23:[1,73]},{10:$Vo,23:$Vp,43:74,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,23:$Vp,43:75,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{7:78,8:79,10:$V1,17:80,18:81,19:82,20:83,21:84,35:76,37:77,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},{10:$Vo,23:$Vp,43:88,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,23:$Vp,43:90,58:[1,89],68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{12:[1,91]},{10:$Vo,12:$Vz,23:$Vp,24:92,25:$VH,27:93,29:94,43:64,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},o($Vl,[2,69]),o($Vn,[2,71]),{69:[1,95],76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP,95:$VQ,96:$VR,97:$VS,98:$VT,99:$VU,100:$VV,101:$VW,102:$VX,104:$VY},{10:$Vo,23:$Vp,43:113,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,23:$Vp,43:114,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,23:$Vp,43:115,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},o($VZ,[2,127]),o($VZ,[2,128]),o($VZ,[2,129]),o($VZ,[2,130]),o($VZ,[2,131]),{10:[1,116]},o($VZ,[2,134],{26:117,22:118,23:$Vc,68:$Vd,71:$Ve}),{10:$Vo,12:$Vz,23:$Vp,29:121,43:64,68:$Vq,69:[2,138],90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy,111:119,112:120},o($V_,$V$,{70:122,26:123,68:$Vd,71:$Ve}),o($Vn,[2,77]),o($V01,[2,105],{76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP,95:$VQ,96:$VR,97:$VS,98:$VT,99:$VU,100:$VV,101:$VW,102:$VX,104:$VY}),{10:$V11,14:[2,142],88:124,113:125,114:126},o($Vn,[2,78]),o($Vn,[2,79]),o($Vn,[2,80]),o($Vn,[2,81]),{15:[2,65],28:[1,129],63:128},{10:$V21,34:130,82:$V31,84:$V41,85:$V51,86:$V61},{10:$Vo,12:$Vz,23:$Vp,29:136,43:64,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:[1,139],25:[2,24],31:137,36:138},{25:[1,140],76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP,95:$VQ,96:$VR,97:$VS,98:$VT,99:$VU,100:$VV,101:$VW,102:$VX,104:$VY},{25:[1,141],76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP,95:$VQ,96:$VR,97:$VS,98:$VT,99:$VU,100:$VV,101:$VW,102:$VX,104:$VY},{7:78,8:79,10:$V1,14:[1,142],17:80,18:81,19:82,20:83,21:84,37:143,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},o($V71,[2,28]),o($V71,[2,29]),o($V71,[2,30]),o($V71,[2,31]),o($V71,[2,32]),o($V71,[2,33]),o($V71,[2,34]),o($V71,[2,35]),{15:[1,144]},{15:[1,145]},{10:$Vo,12:$Vz,15:[1,148],23:$Vp,29:147,41:146,43:64,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{25:[1,149],76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP,95:$VQ,96:$VR,97:$VS,98:$VT,99:$VU,100:$VV,101:$VW,102:$VX,104:$VY},{10:[1,150]},{11:[1,151],15:[1,152],60:153,61:$V81,62:$V91,76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP,95:$VQ,96:$VR,97:$VS,98:$VT,99:$VU,100:$VV,101:$VW,102:$VX,104:$VY},{10:$Va1,13:156,14:[2,85],78:157,80:158},{25:[1,160]},{25:[2,16],28:[1,161]},o($Vb1,[2,19]),o($V_,$V$,{26:123,70:162,68:$Vd,71:$Ve}),{10:$Vo,23:$Vp,43:163,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,23:$Vp,43:164,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,23:$Vp,43:165,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,23:$Vp,43:166,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,23:$Vp,43:167,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,23:$Vp,43:168,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,23:$Vp,43:169,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,23:$Vp,43:170,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,23:$Vp,43:171,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,23:$Vp,43:172,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,23:$Vp,43:173,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,23:$Vp,43:174,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,23:$Vp,43:175,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,23:$Vp,43:176,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,23:$Vp,43:177,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},o($VZ,[2,125]),o($VZ,[2,126]),o($VZ,[2,111]),o($VZ,[2,122]),{25:[1,178],76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP,95:$VQ,96:$VR,97:$VS,98:$VT,99:$VU,100:$VV,101:$VW,102:$VX,104:$VY},{23:[1,179]},o($VZ,[2,133],{23:$Vm}),{23:[1,180]},{69:[1,181]},{28:[1,182],69:[2,137]},o($Vc1,[2,140]),o($V_,[2,74]),o($V_,[2,75]),{14:[1,183]},{14:[2,141],15:$Vd1,28:$Ve1,79:184},o($Vf1,[2,144]),{33:[1,187]},{15:[1,188]},{10:[1,190],64:189},{11:[1,191]},o($Vg1,$Vh1,{83:192,87:193,68:$Vi1}),o($Vg1,$Vh1,{87:193,83:195,68:$Vi1}),o($Vg1,$Vh1,{87:193,83:196,68:$Vi1}),o($Vg1,$Vh1,{87:193,83:197,68:$Vi1}),o($Vg1,$Vh1,{87:193,83:198,68:$Vi1}),o($VA,[2,94]),{25:[1,199]},{25:[2,23],28:[1,200]},{33:[1,201]},{12:[1,202]},{12:[1,203]},{47:[1,204]},o($V71,[2,27]),o($V71,[2,36]),o($V71,[2,37]),o($V71,[2,38]),{15:[1,205]},o($V71,[2,40]),{12:[1,206]},{11:[1,207],60:208,61:$V81,62:$V91},{10:$Vo,23:$Vp,43:209,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,23:$Vp,43:210,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,23:$Vp,43:211,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},o($Vj1,[2,62]),o($Vj1,[2,63]),{14:[1,212]},{14:[2,84],15:$Vd1,28:$Ve1,79:213},o($Vf1,[2,87]),{33:[1,214]},{15:[1,215]},{10:$Vo,12:$Vz,23:$Vp,29:216,43:64,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},o($V_,[2,73]),o($Vk1,[2,107],{76:$VI,77:$VJ,91:$VM,92:$VN,93:$VO,94:$VP}),o($Vk1,[2,108],{76:$VI,77:$VJ,91:$VM,92:$VN,93:$VO,94:$VP}),o($Vl1,[2,109],{76:$VI,77:$VJ,93:$VO}),o($Vl1,[2,110],{76:$VI,77:$VJ,93:$VO}),o($VZ,[2,112]),o($Vl1,[2,113],{76:$VI,77:$VJ,93:$VO}),o($Vm1,[2,114],{76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP}),o($Vm1,[2,115],{76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP}),o($Vm1,[2,116],{76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP}),o($Vm1,[2,117],{76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP}),o($Vm1,[2,118],{76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP}),o($Vm1,[2,119],{76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP}),o([5,9,10,11,14,15,25,28,30,33,38,39,40,42,47,48,49,53,56,57,58,61,62,69,81,101,102,104],[2,120],{76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP,95:$VQ,96:$VR,97:$VS,98:$VT,99:$VU,100:$VV}),o([5,9,10,11,14,15,25,28,30,33,38,39,40,42,47,48,49,53,56,57,58,61,62,69,81,102,104],[2,121],{76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP,95:$VQ,96:$VR,97:$VS,98:$VT,99:$VU,100:$VV,101:$VW}),{33:[1,217],76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP,95:$VQ,96:$VR,97:$VS,98:$VT,99:$VU,100:$VV,101:$VW,102:$VX,104:$VY},o($VZ,[2,123]),{10:$Vo,23:$Vp,43:218,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,12:$Vz,23:$Vp,24:219,25:$VH,27:93,29:94,43:64,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},o($VZ,[2,136]),{10:$Vo,12:$Vz,23:$Vp,29:220,43:64,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},o($V01,[2,106]),{10:$V11,114:221},{10:[2,88]},{10:[2,89]},{10:$Vo,12:$Vz,23:$Vp,29:222,43:64,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},o($Vl,[2,68]),{15:[2,64],28:[1,223]},o($VA,$VB,{65:224,11:$VC,33:$VD}),{10:$Vo,12:$Vz,23:$Vp,29:225,43:64,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},o($Vg1,[2,96]),o($Vg1,[2,101],{68:[1,226]}),{69:[1,227]},o($Vg1,[2,97]),o($Vg1,[2,98]),o($Vg1,[2,99]),o($Vg1,[2,100]),{12:[1,230],32:228,33:[1,229]},{10:[1,231]},{10:$V21,34:232,82:$V31,84:$V41,85:$V51,86:$V61},{7:78,8:79,10:$V1,17:80,18:81,19:82,20:83,21:84,35:233,37:77,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},{7:78,8:79,10:$V1,17:80,18:81,19:82,20:83,21:84,35:234,37:77,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},{23:[1,235]},o($V71,[2,39]),{50:236,52:237,53:$Vn1,56:[2,50]},{10:$Vo,23:$Vp,43:239,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:$Vo,23:$Vp,43:240,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{15:[1,241],76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP,95:$VQ,96:$VR,97:$VS,98:$VT,99:$VU,100:$VV,101:$VW,102:$VX,104:$VY},{15:[1,242],76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP,95:$VQ,96:$VR,97:$VS,98:$VT,99:$VU,100:$VV,101:$VW,102:$VX,104:$VY},{25:[1,243],76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP,95:$VQ,96:$VR,97:$VS,98:$VT,99:$VU,100:$VV,101:$VW,102:$VX,104:$VY},{15:[1,244]},{10:$Va1,80:245},{10:$V21,34:246,82:$V31,84:$V41,85:$V51,86:$V61},o($Vl,[2,13]),o($Vb1,[2,18]),{10:$Vo,23:$Vp,43:247,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{25:[1,248],76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP,95:$VQ,96:$VR,97:$VS,98:$VT,99:$VU,100:$VV,101:$VW,102:$VX,104:$VY},{25:[1,249]},o($Vc1,[2,139]),o($Vf1,[2,143]),o($Vf1,[2,145]),{10:[1,250]},o($VA,[2,67]),o($VA,[2,93]),{69:[1,251]},o($Vo1,[2,104]),o($Va,[2,20]),{10:$V21,34:252,82:$V31,84:$V41,85:$V51,86:$V61},{7:78,8:79,10:$V1,17:80,18:81,19:82,20:83,21:84,35:253,37:77,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},{33:[1,254]},o($Vb1,[2,26]),{7:78,8:79,10:$V1,14:[1,255],17:80,18:81,19:82,20:83,21:84,37:143,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},{7:78,8:79,10:$V1,14:[1,256],17:80,18:81,19:82,20:83,21:84,37:143,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},{10:$Vo,23:$Vp,43:257,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{51:258,54:259,56:[1,260]},{53:$Vp1,56:[2,49]},{10:$Vo,23:$Vp,43:262,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{15:[1,263],76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP,95:$VQ,96:$VR,97:$VS,98:$VT,99:$VU,100:$VV,101:$VW,102:$VX,104:$VY},{25:[1,264],76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP,95:$VQ,96:$VR,97:$VS,98:$VT,99:$VU,100:$VV,101:$VW,102:$VX,104:$VY},{10:$Vo,23:$Vp,43:265,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{10:[1,266]},{12:[1,267]},o($Va,[2,6]),o($Vf1,[2,86]),o($Vf1,[2,90]),o([5,9,10,11,14,15,25,28,30,33,38,39,40,42,47,48,49,53,56,57,58,61,62,69,81],[2,124],{76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP,95:$VQ,96:$VR,97:$VS,98:$VT,99:$VU,100:$VV,101:$VW,102:$VX,104:$VY}),o($VZ,[2,132]),o($VZ,[2,135]),o($VA,$VB,{65:268,11:$VC,33:$VD}),o($Vo1,[2,103]),{12:[1,269]},{7:78,8:79,10:$V1,14:[1,270],17:80,18:81,19:82,20:83,21:84,37:143,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},{10:$V21,34:271,82:$V31,84:$V41,85:$V51,86:$V61},o($Vl,$Vq1,{44:272,45:$Vr1}),o($Vl,[2,46]),{25:[1,274],76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP,95:$VQ,96:$VR,97:$VS,98:$VT,99:$VU,100:$VV,101:$VW,102:$VX,104:$VY},{14:[1,275]},{14:[2,56],52:277,53:$Vn1,55:276},{33:[1,278]},{10:$Vo,23:$Vp,43:279,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{33:[1,280],76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP,95:$VQ,96:$VR,97:$VS,98:$VT,99:$VU,100:$VV,101:$VW,102:$VX,104:$VY},{10:$Vo,23:$Vp,43:281,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{12:[1,282]},{15:[1,283],76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP,95:$VQ,96:$VR,97:$VS,98:$VT,99:$VU,100:$VV,101:$VW,102:$VX,104:$VY},{11:$Vb,26:285,59:284,67:29,68:$Vd,71:$Ve,72:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},{7:78,8:79,10:$V1,17:80,18:81,19:82,20:83,21:84,35:286,37:77,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},o($VA,[2,66]),{7:78,8:79,10:$V1,17:80,18:81,19:82,20:83,21:84,35:287,37:77,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},o($Va,[2,22]),o($Vb1,[2,25]),o($Vl,[2,41]),{12:[1,290],42:[1,289],46:288},{15:[1,291]},o($Vl,[2,48]),{14:[2,53]},{14:[2,55],53:$Vp1},{7:78,8:79,10:$V1,17:80,18:81,19:82,20:83,21:84,35:292,37:77,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},{33:[1,293],76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP,95:$VQ,96:$VR,97:$VS,98:$VT,99:$VU,100:$VV,101:$VW,102:$VX,104:$VY},{7:78,8:79,10:$V1,17:80,18:81,19:82,20:83,21:84,35:294,37:77,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},{15:[1,295],76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP,95:$VQ,96:$VR,97:$VS,98:$VT,99:$VU,100:$VV,101:$VW,102:$VX,104:$VY},{7:78,8:79,10:$V1,17:80,18:81,19:82,20:83,21:84,35:296,37:77,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},{10:[1,297]},{25:[1,298]},{11:$Vb,67:49,72:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},{7:78,8:79,10:$V1,14:[1,299],17:80,18:81,19:82,20:83,21:84,37:143,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},{7:78,8:79,10:$V1,14:[1,300],17:80,18:81,19:82,20:83,21:84,37:143,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},o($Vl,[2,42]),{23:[1,301]},{7:78,8:79,10:$V1,17:80,18:81,19:82,20:83,21:84,35:302,37:77,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},o($Vl,[2,47]),o([14,53],[2,54],{66:14,7:78,8:79,17:80,18:81,19:82,20:83,21:84,37:143,10:$V1,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,81:$V9}),{7:78,8:79,10:$V1,17:80,18:81,19:82,20:83,21:84,35:303,37:77,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},o($Vs1,[2,52],{66:14,7:78,8:79,17:80,18:81,19:82,20:83,21:84,37:143,10:$V1,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,81:$V9}),{10:[1,304]},{7:78,8:79,10:$V1,14:[1,305],17:80,18:81,19:82,20:83,21:84,37:143,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},{11:$Vb,26:285,59:306,67:29,68:$Vd,71:$Ve,72:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},{12:[1,307]},o($Vl,[2,61]),o($Va,[2,21]),{10:$Vo,23:$Vp,43:308,68:$Vq,90:$Vr,103:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:$Vy},{7:78,8:79,10:$V1,14:[1,309],17:80,18:81,19:82,20:83,21:84,37:143,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},o($Vs1,[2,51],{66:14,7:78,8:79,17:80,18:81,19:82,20:83,21:84,37:143,10:$V1,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,81:$V9}),{11:$Vb,26:285,59:310,67:29,68:$Vd,71:$Ve,72:$Vf,73:$Vg,74:$Vh,75:$Vi,76:$Vj,77:$Vk},o($Vl,[2,60]),{25:[1,311]},{7:78,8:79,10:$V1,17:80,18:81,19:82,20:83,21:84,35:312,37:77,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},{25:[1,313],76:$VI,77:$VJ,89:$VK,90:$VL,91:$VM,92:$VN,93:$VO,94:$VP,95:$VQ,96:$VR,97:$VS,98:$VT,99:$VU,100:$VV,101:$VW,102:$VX,104:$VY},o($Vl,[2,45]),{25:[1,314]},{12:[1,315]},{7:78,8:79,10:$V1,14:[1,316],17:80,18:81,19:82,20:83,21:84,37:143,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},{12:[1,317]},{12:[1,318]},{7:78,8:79,10:$V1,17:80,18:81,19:82,20:83,21:84,35:319,37:77,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},o($Vl,[2,59]),{7:78,8:79,10:$V1,17:80,18:81,19:82,20:83,21:84,35:320,37:77,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},{7:78,8:79,10:$V1,17:80,18:81,19:82,20:83,21:84,35:321,37:77,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},{7:78,8:79,10:$V1,14:[1,322],17:80,18:81,19:82,20:83,21:84,37:143,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},{7:78,8:79,10:$V1,14:[1,323],17:80,18:81,19:82,20:83,21:84,37:143,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},{7:78,8:79,10:$V1,14:[1,324],17:80,18:81,19:82,20:83,21:84,37:143,38:$VE,39:$VF,40:$VG,42:$V3,47:$V4,48:$V5,49:$V6,57:$V7,58:$V8,66:14,81:$V9},o($Vl,[2,58]),o($Vl,$Vq1,{44:325,45:$Vr1}),o($Vl,[2,57]),o($Vl,[2,44])],
defaultActions: {21:[2,91],22:[2,92],23:[2,1],185:[2,88],186:[2,89],276:[2,53]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

	var contador = 0;

	
	const ast = require('./AST/ast.js');
	
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"case-sensitive":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0://Comentario Linea
break;
case 1://Comentaio Multilinea
break;
case 2:return 39;
break;
case 3:return 38;
break;
case 4:return 109;
break;
case 5:return 9;
break;
case 6:return 81;
break;
case 7:return 58;
break;
case 8:return 81;
break;
case 9:return 30;
break;
case 10:return 42;
break;
case 11:return 45;
break;
case 12:return 47;
break;
case 13:return 48;
break;
case 14:return 49;
break;
case 15:return 53;
break;
case 16:return 56;
break;
case 17:return 57;
break;
case 18:return 61;
break;
case 19:return 62;
break;
case 20:return 82;
break;
case 21:return 84;
break;
case 22:return 85;
break;
case 23:return 86;
break;
case 24:return 107;
break;
case 25:return 108;
break;
case 26:return 'undefined';
break;
case 27:return 40;
break;
case 28:return 110;
break;
case 29:return 72;
break;
case 30:return 73;
break;
case 31:return 74;
break;
case 32:return 75;
break;
case 33:return 12;
break;
case 34:return 14;
break;
case 35:return 23;
break;
case 36:return 25;
break;
case 37:return 28;
break;
case 38:return 15;
break;
case 39:return 33;
break;
case 40:return 71;
break;
case 41:return 76;
break;
case 42:return 77;
break;
case 43:return 89;
break;
case 44:return 90;
break;
case 45:return 93;
break;
case 46:return 91;
break;
case 47:return 92;
break;
case 48:return 94;
break;
case 49:return 97;
break;
case 50:return 98;
break;
case 51:return 95;
break;
case 52:return 96;
break;
case 53:return 99;
break;
case 54:return 11;
break;
case 55:return 100;
break;
case 56:return 101;
break;
case 57:return 102;
break;
case 58:return 103;
break;
case 59:return 104;
break;
case 60:return 68;
break;
case 61:return 69;
break;
case 62:
break;
case 63:
break;
case 64:
break;
case 65:
break;
case 66:return 105;
break;
case 67:return 106;
break;
case 68:return 10;
break;
case 69:return 5;
break;
case 70: console.error('Este es un error l├®xico: ' + yy_.yytext + ', en la linea: ' + yy_.yylloc.first_line + ', en la columna: ' + yy_.yylloc.first_column); 
break;
}
},
rules: [/^(?:\/\/.*)/,/^(?:[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/])/,/^(?:continue\b)/,/^(?:break\b)/,/^(?:null\b)/,/^(?:type\b)/,/^(?:const\b)/,/^(?:let\b)/,/^(?:const\b)/,/^(?:function\b)/,/^(?:if\b)/,/^(?:else\b)/,/^(?:while\b)/,/^(?:do\b)/,/^(?:switch\b)/,/^(?:case\b)/,/^(?:default\b)/,/^(?:for\b)/,/^(?:in\b)/,/^(?:of\b)/,/^(?:number\b)/,/^(?:boolean\b)/,/^(?:string\b)/,/^(?:void\b)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:undefined\b)/,/^(?:return\b)/,/^(?:new\b)/,/^(?:\+=)/,/^(?:-=)/,/^(?:\*=)/,/^(?:\/=)/,/^(?:\{)/,/^(?:\})/,/^(?:\()/,/^(?:\))/,/^(?:,)/,/^(?:;)/,/^(?::)/,/^(?:\.)/,/^(?:\+\+)/,/^(?:--)/,/^(?:\+)/,/^(?:-)/,/^(?:\*\*)/,/^(?:\*)/,/^(?:\/)/,/^(?:%)/,/^(?:>=)/,/^(?:<=)/,/^(?:>)/,/^(?:<)/,/^(?:==)/,/^(?:=)/,/^(?:!=)/,/^(?:&&)/,/^(?:\|\|)/,/^(?:!)/,/^(?:\?)/,/^(?:\[)/,/^(?:\])/,/^(?:\s+)/,/^(?:\t+)/,/^(?:\r+)/,/^(?:\n+)/,/^(?:[0-9]+(\.[0-9]+)?\b)/,/^(?:"[^\"]*"|'[^\']*'|`[^\`]*`)/,/^(?:([a-zA-Z$_])[a-zA-Z0-9_$]*)/,/^(?:$)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = astGraph;
exports.Parser = astGraph.Parser;
exports.parse = function () { return astGraph.parse.apply(astGraph, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this)}).call(this,require('_process'))
},{"./AST/ast.js":4,"_process":3,"fs":1,"path":2}],35:[function(require,module,exports){
(function (process){(function (){
/* parser generated by jison 0.4.18 */
/*
  Returns a Parser object of the following structure:

  Parser: {
    yy: {}
  }

  Parser.prototype: {
    yy: {},
    trace: function(),
    symbols_: {associative list: name ==> number},
    terminals_: {associative list: number ==> name},
    productions_: [...],
    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
    table: [...],
    defaultActions: {...},
    parseError: function(str, hash),
    parse: function(input),

    lexer: {
        EOF: 1,
        parseError: function(str, hash),
        setInput: function(input),
        input: function(),
        unput: function(str),
        more: function(),
        less: function(n),
        pastInput: function(),
        upcomingInput: function(),
        showPosition: function(),
        test_match: function(regex_match_array, rule_index),
        next: function(),
        lex: function(),
        begin: function(condition),
        popState: function(),
        _currentRules: function(),
        topState: function(),
        pushState: function(condition),

        options: {
            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
        },

        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
        rules: [...],
        conditions: {associative list: name ==> set},
    }
  }


  token location info (@$, _$, etc.): {
    first_line: n,
    last_line: n,
    first_column: n,
    last_column: n,
    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
  }


  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
    text:        (matched text)
    token:       (the produced terminal token, if any)
    line:        (yylineno)
  }
  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
    loc:         (yylloc)
    expected:    (string describing the set of expected tokens)
    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
  }
*/
var gramatica = (function(){
var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,12],$V1=[1,14],$V2=[1,15],$V3=[1,16],$V4=[1,17],$V5=[1,18],$V6=[1,19],$V7=[1,20],$V8=[1,21],$V9=[5,15,25,39,44,45,46,54,55,80],$Va=[2,14],$Vb=[1,30],$Vc=[1,28],$Vd=[1,29],$Ve=[1,31],$Vf=[1,32],$Vg=[1,33],$Vh=[1,34],$Vi=[1,35],$Vj=[1,36],$Vk=[5,15,25,32,35,36,37,39,44,45,46,50,53,54,55,80],$Vl=[2,13],$Vm=[5,15,20,25,32,35,36,37,39,44,45,46,50,53,54,55,80],$Vn=[1,56],$Vo=[1,50],$Vp=[1,58],$Vq=[1,48],$Vr=[1,49],$Vs=[1,51],$Vt=[1,52],$Vu=[1,53],$Vv=[1,54],$Vw=[1,55],$Vx=[1,57],$Vy=[1,62],$Vz=[1,68],$VA=[1,82],$VB=[1,83],$VC=[1,84],$VD=[2,16],$VE=[1,107],$VF=[1,108],$VG=[1,92],$VH=[1,93],$VI=[1,94],$VJ=[1,95],$VK=[1,96],$VL=[1,97],$VM=[1,98],$VN=[1,99],$VO=[1,100],$VP=[1,101],$VQ=[1,102],$VR=[1,103],$VS=[1,104],$VT=[1,105],$VU=[1,106],$VV=[5,15,19,20,23,25,28,32,35,36,37,39,44,45,46,50,53,54,55,56,67,74,75,80,88,89,90,91,92,93,94,95,96,97,98,99,100,101,103],$VW=[5,15,17,19,20,23,25,28,32,35,36,37,39,44,45,46,50,53,54,55,56,67,70,71,72,73,74,75,80,88,89,90,91,92,93,94,95,96,97,98,99,100,101,103],$VX=[2,77],$VY=[5,15,19,20,23,25,32,35,36,37,39,44,45,46,50,53,54,55,67,80],$VZ=[1,123],$V_=[1,131],$V$=[1,127],$V01=[1,128],$V11=[1,129],$V21=[1,130],$V31=[15,25,32,35,36,37,39,44,45,46,50,53,54,55,80],$V41=[19,23],$V51=[23,67],$V61=[20,23,32],$V71=[20,23],$V81=[19,20,23,30,56],$V91=[2,100],$Va1=[1,182],$Vb1=[5,15,19,20,23,25,28,32,35,36,37,39,44,45,46,50,53,54,55,56,67,80,88,89,94,95,96,97,98,99,100,101,103],$Vc1=[5,15,19,20,23,25,28,32,35,36,37,39,44,45,46,50,53,54,55,56,67,80,88,89,90,91,93,94,95,96,97,98,99,100,101,103],$Vd1=[5,15,19,20,23,25,28,32,35,36,37,39,44,45,46,50,53,54,55,56,67,80,94,95,96,97,98,99,100,101,103],$Ve1=[1,224],$Vf1=[15,17,66,89,102,104,105,106,107,108,109],$Vg1=[19,20,23,30,56,66],$Vh1=[1,243],$Vi1=[2,43],$Vj1=[1,254],$Vk1=[32,50,53];
var parser = {trace: function trace () { },
yy: {},
symbols_: {"error":2,"S":3,"Bloque":4,"EOF":5,"Instruccion":6,"llamadaFuncion":7,"variables":8,"funciones":9,"IF":10,"WHILE":11,"DOWHILE":12,"SWITCH":13,"FOR":14,"id":15,"PL":16,"bracketOpen":17,"paramFunc":18,"bracketClose":19,"semicolon":20,"varLast":21,"paramFuncList":22,"comma":23,"E":24,"function":25,"funcParam":26,"funcDec":27,"dosPuntos":28,"types":29,"curlyBraceOpen":30,"STMT":31,"curlyBraceClose":32,"funcParamList":33,"InstruccionI":34,"Break":35,"Continue":36,"return":37,"OP":38,"if":39,"exp":40,"IFLAST":41,"else":42,"IFCOND":43,"while":44,"do":45,"switch":46,"FIRSTCASE":47,"LASTCASE":48,"CASE":49,"case":50,"DEFCASE":51,"ENDCASE":52,"default":53,"for":54,"let":55,"igual":56,"forOP":57,"in":58,"of":59,"defVarLast":60,"defVarLastP":61,"defLast":62,"defType":63,"asignLast":64,"asignLastF":65,"sqBracketOpen":66,"sqBracketClose":67,"auxP":68,"point":69,"masIgual":70,"menosIgual":71,"porIgual":72,"divisionIgual":73,"increment":74,"decrement":75,"parsObj":76,"objType":77,"opkv":78,"keyvalueT":79,"const":80,"number":81,"typesList":82,"boolean":83,"string":84,"void":85,"typesL":86,"objetoParam":87,"mas":88,"menos":89,"por":90,"division":91,"potencia":92,"modulo":93,"mayorque":94,"menorque":95,"mayorigualque":96,"menorigualque":97,"igualdad":98,"diferencia":99,"and":100,"or":101,"not":102,"question":103,"NUMBER":104,"STRING":105,"true":106,"false":107,"null":108,"new":109,"arrParam":110,"listArrParam":111,"objetoParamList":112,"keyvalue":113,"$accept":0,"$end":1},
terminals_: {2:"error",5:"EOF",15:"id",17:"bracketOpen",19:"bracketClose",20:"semicolon",23:"comma",25:"function",28:"dosPuntos",30:"curlyBraceOpen",32:"curlyBraceClose",35:"Break",36:"Continue",37:"return",39:"if",42:"else",44:"while",45:"do",46:"switch",50:"case",53:"default",54:"for",55:"let",56:"igual",58:"in",59:"of",66:"sqBracketOpen",67:"sqBracketClose",69:"point",70:"masIgual",71:"menosIgual",72:"porIgual",73:"divisionIgual",74:"increment",75:"decrement",80:"const",81:"number",83:"boolean",84:"string",85:"void",88:"mas",89:"menos",90:"por",91:"division",92:"potencia",93:"modulo",94:"mayorque",95:"menorque",96:"mayorigualque",97:"menorigualque",98:"igualdad",99:"diferencia",100:"and",101:"or",102:"not",103:"question",104:"NUMBER",105:"STRING",106:"true",107:"false",108:"null",109:"new"},
productions_: [0,[3,2],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[6,1],[7,6],[16,1],[16,0],[18,1],[18,0],[22,3],[22,1],[9,6],[27,5],[27,3],[26,1],[26,0],[33,5],[33,3],[31,2],[31,1],[34,1],[34,1],[34,1],[34,1],[34,1],[34,1],[34,1],[34,1],[34,2],[34,2],[34,2],[38,2],[38,1],[10,8],[41,2],[41,0],[43,8],[43,3],[11,7],[12,9],[13,8],[47,1],[47,0],[49,5],[49,4],[48,2],[51,3],[52,1],[52,0],[14,16],[14,13],[14,11],[14,10],[57,1],[57,1],[60,2],[60,0],[61,4],[61,2],[8,5],[8,3],[8,2],[62,4],[62,2],[64,2],[64,1],[21,4],[21,3],[68,1],[68,0],[65,2],[65,2],[65,2],[65,2],[65,2],[65,1],[65,1],[76,1],[76,0],[77,3],[77,1],[78,1],[78,1],[79,3],[63,1],[63,1],[29,2],[29,2],[29,2],[29,2],[29,2],[82,1],[82,0],[86,3],[86,2],[24,1],[24,3],[40,3],[40,3],[40,3],[40,3],[40,2],[40,3],[40,3],[40,3],[40,3],[40,3],[40,3],[40,3],[40,3],[40,3],[40,3],[40,2],[40,3],[40,5],[40,2],[40,2],[40,1],[40,1],[40,1],[40,1],[40,1],[40,2],[40,5],[40,1],[40,5],[40,3],[110,1],[110,0],[111,3],[111,1],[87,1],[87,0],[112,3],[112,1],[113,3]],
performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
/* this == yyval */

var $0 = $$.length - 1;
switch (yystate) {
case 1:
 return {ast:$$[$0-1],tabla:tablaErrores}; 
break;
case 2: case 26:
 $$[$0-1].push($$[$0]); this.$=$$[$0-1];
break;
case 3: case 18:
 this.$ = [$$[$0]]; 
break;
case 4: case 15: case 42: case 103:
 this.$ = $$[$0]; 
break;
case 5: case 6:
 this.$=$$[$0]; 
break;
case 7:
 this.$ =$$[$0]; 
break;
case 8:
this.$ =$$[$0];
break;
case 9: case 10: case 11: case 13: case 22: case 28: case 29: case 31: case 32: case 33: case 34: case 35: case 49: case 55: case 76: case 92: case 93: case 99:
this.$=$$[$0];
break;
case 12:

					this.$ = new callFunction($$[$0-5],$$[$0-4],$$[$0-2]);
				
break;
case 14: case 40: case 56: case 64: case 77:
this.$=null;
break;
case 17:

					$$[$0-2].push($$[$0]);
					this.$ = $$[$0-2];
				
break;
case 19:

			   this.$ = new Function($$[$0-4],$$[$0-2],$$[$0]);
		   
break;
case 20:

			this.$ = {type:$$[$0-3],stmt:$$[$0-1]}
		
break;
case 21:

			this.$ = {type:null,stmt:$$[$0-1]}
		
break;
case 23: case 43: case 50: case 136:
this.$ = null;
break;
case 24:
$$[$0-4].push({id:$$[$0-2],types:$$[$0]}); this.$=$$[$0-4];
break;
case 25:
this.$ = [{id:$$[$0-2],types:$$[$0]}];
break;
case 27:
this.$=[$$[$0]];
break;
case 36:
this.$=new Break();
break;
case 37:
this.$=new Continue();
break;
case 38:
 this.$=new Return($$[$0]); 
break;
case 39:
this.$=$$[$0-1];
break;
case 41:

		this.$ = new If($$[$0-5],$$[$0-2],$$[$0]);
	
break;
case 44:

		   this.$ = new If($$[$0-5],$$[$0-2],$$[$0]);
	   
break;
case 45:

		   this.$ = new If(null,$$[$0-1],null);
	   
break;
case 46:

	this.$ = new While(0,0,$$[$0-4],$$[$0-1]);

break;
case 47:

	this.$ = new DoWhile(0,0,$$[$0-2],$$[$0-6]);

break;
case 48:

			this.$ = new Switch($$[$0-5],$$[$0-2],$$[$0-1]);
		
break;
case 51:

			$$[$0-4].push({exp:$$[$0-2],stmt:$$[$0]});
			this.$ = $$[$0-4];
	  
break;
case 52:

			this.$ = [{exp:$$[$0-2],stmt:$$[$0]}]
	 
break;
case 53:

	this.$ = $$[$0-1];

break;
case 54:

	this.$ = $$[$0];

break;
case 57:

		this.$ = new For($$[$0-13],$$[$0-12],$$[$0-10],$$[$0-8],$$[$0-6],$$[$0-4],$$[$0-1]);
	
break;
case 58:

		this.$ = new For2($$[$0-10],$$[$0-8],$$[$0-6],$$[$0-4],$$[$0-1]);
	
break;
case 59:

		this.$ = new ForThree($$[$0-8],$$[$0-6],$$[$0-4],$$[$0-1]);
	
break;
case 60:

		this.$ = new ForIO($$[$0-6],$$[$0-5],$$[$0-4],$$[$0-1]);
	
break;
case 61:
this.$=1;
break;
case 62:
this.$=2;
break;
case 67:

				this.$ = new Variables($$[$0-4],$$[$0-3],$$[$0-2],$$[$0-1]);
			
break;
case 68:

				this.$ = new VariableChange($$[$0-2],$$[$0-1]);
		  	
break;
case 69:

				this.$ = new VariableChange($$[$0-1],$$[$0]);
		  	
break;
case 70:

			this.$ = new defLast($$[$0-2],$$[$0]);
		
break;
case 71:

			this.$ = new defLast($$[$0],null);
		
break;
case 72:
 this.$={varLast:$$[$0-1],asignLastF:$$[$0],temp:true}; 
break;
case 73: case 135:
this.$ = $$[$0];
break;
case 74:

			this.$ = new List(true,$$[$0-2],$$[$0]);
		
break;
case 75:

			this.$ = new List(false,$$[$0-1],$$[$0]);
		
break;
case 78:

				this.$ = {tipo:'=',value:$$[$0]}
			
break;
case 79:

				this.$ = {tipo:'+',value:$$[$0]}
			
break;
case 80:

				this.$ = {tipo:'-',value:$$[$0]}
			
break;
case 81:

				this.$ = {tipo:'*',value:$$[$0]}
			
break;
case 82:

				this.$ = {tipo:'/',value:$$[$0]}
			
break;
case 83:

				this.$ = {tipo:'++',value:null}
			
break;
case 84:

				this.$ = {tipo:'--',value:null}
			
break;
case 94: case 95: case 96: case 97: case 98:

			this.$ = {type:$$[$0-1],list:$$[$0]}
		
break;
case 100:
this.$ = 0;
break;
case 101:

			this.$ = $$[$0-2] + 1;
		
break;
case 102:

			this.$ = 1;
		
break;
case 105:

		this.$ = new Operation($$[$0-2],$$[$0],'+',0,0);
	
break;
case 106:

		this.$ = new Operation($$[$0-2],$$[$0],'-',0,0);
	
break;
case 107:

		this.$ = new Operation($$[$0-2],$$[$0],'*',0,0);
	
break;
case 108:

		this.$ = new Operation($$[$0-2],$$[$0],'/',0,0);
	
break;
case 109:

		this.$ = new Operation($$[$0],null,'--',0,0);
	
break;
case 110:

		this.$ = new Operation($$[$0-2],$$[$0],'**',0,0);
	
break;
case 111:

		this.$ = new Operation($$[$0-2],$$[$0],'%',0,0);
	
break;
case 112:

		this.$ = new Relational($$[$0-2],$$[$0],'>',0,0);
	
break;
case 113:

		this.$ = new Relational($$[$0-2],$$[$0],'<',0,0);
	
break;
case 114:

		this.$ = new Relational($$[$0-2],$$[$0],'>=',0,0);
	
break;
case 115:

		this.$ = new Relational($$[$0-2],$$[$0],'<=',0,0);
	
break;
case 116:

		this.$ = new Relational($$[$0-2],$$[$0],'==',0,0);
	
break;
case 117:

		this.$ = new Relational($$[$0-2],$$[$0],'!=',0,0);
	
break;
case 118:

		this.$ = new Logical($$[$0-2],$$[$0],'&&',0,0);
	
break;
case 119:

		this.$ = new Logical($$[$0-2],$$[$0],'||',0,0);
	
break;
case 120:

		this.$ = new Logical($$[$0],null,'!',0,0);
	
break;
case 121:

		this.$ =$$[$0-1];
	
break;
case 122:

		this.$ = new Ternary($$[$0-4],$$[$0-2],$$[$0]);	
	
break;
case 123:

		this.$ = new IncDecOp($$[$0-1],'+');
	
break;
case 124:

		this.$ = new IncDecOp($$[$0-1],'-');
	
break;
case 125:

		this.$ = new tsObject(0,0,$$[$0],'number');
	
break;
case 126:

		this.$ = new tsObject(0,0,$$[$0],'string');
	
break;
case 127:

		this.$ = new tsObject(0,0,1,'boolean');
	
break;
case 128:

		this.$ = new tsObject(0,0,0,'boolean');
	
break;
case 129:

		this.$ = new tsObject(0,0,-100,'null');
	
break;
case 130:

		this.$ = new IdAccess($$[$0-1],$$[$0]);
	
break;
case 131:

		this.$ = new Arrayl($$[$0-3],$$[$0-1]);
	
break;
case 132:

		this.$ = new Id(0,0,$$[$0]);
	
break;
case 133:

		this.$ = new callFunction($$[$0-4],$$[$0-3],$$[$0-1]);
	
break;
case 134:

		this.$ = new ArrList($$[$0-1]);
	
break;
case 137:

				$$[$0-2].push($$[$0]);
				this.$ = $$[$0-2];
			
break;
case 138:
this.$ = [$$[$0]];
break;
}
},
table: [{3:1,4:2,6:3,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:$V0,25:$V1,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},{1:[3]},{5:[1,22],6:23,7:4,8:5,9:6,10:7,11:8,12:9,13:10,14:11,15:$V0,25:$V1,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},o($V9,[2,3]),o($V9,[2,4]),o($V9,[2,5]),o($V9,[2,6]),o($V9,[2,7]),o($V9,[2,8]),o($V9,[2,9]),o($V9,[2,10]),o($V9,[2,11]),{16:24,17:$Va,21:26,56:$Vb,64:25,65:27,66:$Vc,69:$Vd,70:$Ve,71:$Vf,72:$Vg,73:$Vh,74:$Vi,75:$Vj},{15:[1,37]},{15:[1,38]},{17:[1,39]},{17:[1,40]},{30:[1,41]},{17:[1,42]},{17:[1,43]},{15:[2,92]},{15:[2,93]},{1:[2,1]},o($V9,[2,2]),{17:[1,44]},o($Vk,[2,69],{20:[1,45]}),{17:$Vl,56:$Vb,65:46,70:$Ve,71:$Vf,72:$Vg,73:$Vh,74:$Vi,75:$Vj},o($Vm,[2,73]),{15:$Vn,17:$Vo,40:47,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:[1,59]},{15:$Vn,17:$Vo,24:60,30:$Vy,40:61,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,24:63,30:$Vy,40:61,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,24:64,30:$Vy,40:61,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,24:65,30:$Vy,40:61,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,24:66,30:$Vy,40:61,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},o($Vm,[2,83]),o($Vm,[2,84]),{28:$Vz,62:67},{17:[1,69]},{15:$Vn,17:$Vo,40:70,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,40:71,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,15:$V0,25:$V1,31:72,34:73,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},{15:$Vn,17:$Vo,40:85,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,40:87,55:[1,86],66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,18:88,19:$VD,22:89,24:90,30:$Vy,40:61,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},o($Vk,[2,68]),o($Vm,[2,72]),{67:[1,91],74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL,94:$VM,95:$VN,96:$VO,97:$VP,98:$VQ,99:$VR,100:$VS,101:$VT,103:$VU},{15:$Vn,17:$Vo,40:109,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,40:110,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,40:111,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},o($VV,[2,125]),o($VV,[2,126]),o($VV,[2,127]),o($VV,[2,128]),o($VV,[2,129]),o($VV,[2,132],{21:112,16:113,17:$Va,66:$Vc,69:$Vd}),{15:[1,114]},{15:$Vn,17:$Vo,24:117,30:$Vy,40:61,66:$Vp,67:[2,136],89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx,110:115,111:116},o($VW,$VX,{68:118,21:119,66:$Vc,69:$Vd}),o($Vm,[2,78]),o($VY,[2,103],{74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL,94:$VM,95:$VN,96:$VO,97:$VP,98:$VQ,99:$VR,100:$VS,101:$VT,103:$VU}),{15:$VZ,32:[2,140],87:120,112:121,113:122},o($Vm,[2,79]),o($Vm,[2,80]),o($Vm,[2,81]),o($Vm,[2,82]),{20:[2,64],23:[1,125],60:124},{15:$V_,29:126,81:$V$,83:$V01,84:$V11,85:$V21},{15:[1,134],19:[2,23],26:132,33:133},{19:[1,135],74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL,94:$VM,95:$VN,96:$VO,97:$VP,98:$VQ,99:$VR,100:$VS,101:$VT,103:$VU},{19:[1,136],74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL,94:$VM,95:$VN,96:$VO,97:$VP,98:$VQ,99:$VR,100:$VS,101:$VT,103:$VU},{7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,15:$V0,25:$V1,32:[1,137],34:138,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},o($V31,[2,27]),o($V31,[2,28]),o($V31,[2,29]),o($V31,[2,30]),o($V31,[2,31]),o($V31,[2,32]),o($V31,[2,33]),o($V31,[2,34]),o($V31,[2,35]),{20:[1,139]},{20:[1,140]},{15:$Vn,17:$Vo,20:[1,143],24:142,30:$Vy,38:141,40:61,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{19:[1,144],74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL,94:$VM,95:$VN,96:$VO,97:$VP,98:$VQ,99:$VR,100:$VS,101:$VT,103:$VU},{15:[1,145]},{20:[1,147],56:[1,146],74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL,94:$VM,95:$VN,96:$VO,97:$VP,98:$VQ,99:$VR,100:$VS,101:$VT,103:$VU},{19:[1,148]},{19:[2,15],23:[1,149]},o($V41,[2,18]),o($VW,$VX,{21:119,68:150,66:$Vc,69:$Vd}),{15:$Vn,17:$Vo,40:151,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,40:152,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,40:153,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,40:154,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,40:155,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,40:156,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,40:157,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,40:158,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,40:159,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,40:160,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,40:161,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,40:162,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,40:163,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,40:164,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,40:165,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},o($VV,[2,123]),o($VV,[2,124]),o($VV,[2,109]),o($VV,[2,120]),{19:[1,166],74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL,94:$VM,95:$VN,96:$VO,97:$VP,98:$VQ,99:$VR,100:$VS,101:$VT,103:$VU},o($VV,[2,130],{17:$Vl}),{17:[1,167]},{17:[1,168]},{67:[1,169]},{23:[1,170],67:[2,135]},o($V51,[2,138]),o($VW,[2,75]),o($VW,[2,76]),{32:[1,171]},{20:[1,174],23:[1,173],32:[2,139],78:172},o($V61,[2,142]),{28:[1,175]},{20:[1,176]},{15:[1,178],61:177},o($V71,[2,71],{56:[1,179]}),o($V81,$V91,{82:180,86:181,66:$Va1}),o($V81,$V91,{86:181,82:183,66:$Va1}),o($V81,$V91,{86:181,82:184,66:$Va1}),o($V81,$V91,{86:181,82:185,66:$Va1}),o($V81,$V91,{86:181,82:186,66:$Va1}),{19:[1,187]},{19:[2,22],23:[1,188]},{28:[1,189]},{30:[1,190]},{30:[1,191]},{44:[1,192]},o($V31,[2,26]),o($V31,[2,36]),o($V31,[2,37]),o($V31,[2,38]),{20:[1,193]},o($V31,[2,40]),{30:[1,194]},{28:[1,195],57:196,58:[1,197],59:[1,198]},{15:$Vn,17:$Vo,40:199,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,40:200,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{20:[1,201]},{15:$Vn,17:$Vo,24:202,30:$Vy,40:61,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},o($VW,[2,74]),o($Vb1,[2,105],{74:$VE,75:$VF,90:$VI,91:$VJ,92:$VK,93:$VL}),o($Vb1,[2,106],{74:$VE,75:$VF,90:$VI,91:$VJ,92:$VK,93:$VL}),o($Vc1,[2,107],{74:$VE,75:$VF,92:$VK}),o($Vc1,[2,108],{74:$VE,75:$VF,92:$VK}),o($VV,[2,110]),o($Vc1,[2,111],{74:$VE,75:$VF,92:$VK}),o($Vd1,[2,112],{74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL}),o($Vd1,[2,113],{74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL}),o($Vd1,[2,114],{74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL}),o($Vd1,[2,115],{74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL}),o($Vd1,[2,116],{74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL}),o($Vd1,[2,117],{74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL}),o([5,15,19,20,23,25,28,32,35,36,37,39,44,45,46,50,53,54,55,56,67,80,100,101,103],[2,118],{74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL,94:$VM,95:$VN,96:$VO,97:$VP,98:$VQ,99:$VR}),o([5,15,19,20,23,25,28,32,35,36,37,39,44,45,46,50,53,54,55,56,67,80,101,103],[2,119],{74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL,94:$VM,95:$VN,96:$VO,97:$VP,98:$VQ,99:$VR,100:$VS}),{28:[1,203],74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL,94:$VM,95:$VN,96:$VO,97:$VP,98:$VQ,99:$VR,100:$VS,101:$VT,103:$VU},o($VV,[2,121]),{15:$Vn,17:$Vo,18:204,19:$VD,22:89,24:90,30:$Vy,40:61,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,40:205,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},o($VV,[2,134]),{15:$Vn,17:$Vo,24:206,30:$Vy,40:61,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},o($VY,[2,104]),{15:$VZ,113:207},{15:[2,89]},{15:[2,90]},{15:$Vn,17:$Vo,24:208,30:$Vy,40:61,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},o($Vk,[2,67]),{20:[2,63],23:[1,209]},{28:$Vz,62:210},{15:$Vn,17:$Vo,24:211,30:$Vy,40:61,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},o($V81,[2,94]),o($V81,[2,99],{66:[1,212]}),{67:[1,213]},o($V81,[2,95]),o($V81,[2,96]),o($V81,[2,97]),o($V81,[2,98]),{27:214,28:[1,215],30:[1,216]},{15:[1,217]},{15:$V_,29:218,81:$V$,83:$V01,84:$V11,85:$V21},{7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,15:$V0,25:$V1,31:219,34:73,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},{7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,15:$V0,25:$V1,31:220,34:73,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},{17:[1,221]},o($V31,[2,39]),{47:222,49:223,50:$Ve1,53:[2,50]},{15:$V_,29:225,81:$V$,83:$V01,84:$V11,85:$V21},{15:$Vn,17:$Vo,40:226,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},o($Vf1,[2,61]),o($Vf1,[2,62]),{20:[1,227],74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL,94:$VM,95:$VN,96:$VO,97:$VP,98:$VQ,99:$VR,100:$VS,101:$VT,103:$VU},{20:[1,228],74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL,94:$VM,95:$VN,96:$VO,97:$VP,98:$VQ,99:$VR,100:$VS,101:$VT,103:$VU},o($Vk,[2,12]),o($V41,[2,17]),{15:$Vn,17:$Vo,40:229,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{19:[1,230]},{19:[1,231],74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL,94:$VM,95:$VN,96:$VO,97:$VP,98:$VQ,99:$VR,100:$VS,101:$VT,103:$VU},o($V51,[2,137]),o($V61,[2,141]),o($V61,[2,143]),{15:[1,232]},o($V71,[2,66]),o($V71,[2,70]),{67:[1,233]},o($Vg1,[2,102]),o($Vk,[2,19]),{15:$V_,29:234,81:$V$,83:$V01,84:$V11,85:$V21},{7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,15:$V0,25:$V1,31:235,34:73,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},{28:[1,236]},o($V41,[2,25]),{7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,15:$V0,25:$V1,32:[1,237],34:138,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},{7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,15:$V0,25:$V1,32:[1,238],34:138,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},{15:$Vn,17:$Vo,40:239,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{48:240,51:241,53:[1,242]},{50:$Vh1,53:[2,49]},{15:$Vn,17:$Vo,40:244,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{56:[1,245]},{19:[1,246],74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL,94:$VM,95:$VN,96:$VO,97:$VP,98:$VQ,99:$VR,100:$VS,101:$VT,103:$VU},{15:$Vn,17:$Vo,40:247,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{15:$Vn,17:$Vo,40:248,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},o([5,15,19,20,23,25,28,32,35,36,37,39,44,45,46,50,53,54,55,56,67,80],[2,122],{74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL,94:$VM,95:$VN,96:$VO,97:$VP,98:$VQ,99:$VR,100:$VS,101:$VT,103:$VU}),o($VV,[2,133]),o($VV,[2,131]),{28:$Vz,62:249},o($Vg1,[2,101]),{30:[1,250]},{7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,15:$V0,25:$V1,32:[1,251],34:138,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},{15:$V_,29:252,81:$V$,83:$V01,84:$V11,85:$V21},o($Vk,$Vi1,{41:253,42:$Vj1}),o($Vk,[2,46]),{19:[1,255],74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL,94:$VM,95:$VN,96:$VO,97:$VP,98:$VQ,99:$VR,100:$VS,101:$VT,103:$VU},{32:[1,256]},{32:[2,56],49:258,50:$Ve1,52:257},{28:[1,259]},{15:$Vn,17:$Vo,40:260,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{28:[1,261],74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL,94:$VM,95:$VN,96:$VO,97:$VP,98:$VQ,99:$VR,100:$VS,101:$VT,103:$VU},{15:$Vn,17:$Vo,40:262,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{30:[1,263]},{20:[1,264],74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL,94:$VM,95:$VN,96:$VO,97:$VP,98:$VQ,99:$VR,100:$VS,101:$VT,103:$VU},{19:[1,265],74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL,94:$VM,95:$VN,96:$VO,97:$VP,98:$VQ,99:$VR,100:$VS,101:$VT,103:$VU},o($V71,[2,65]),{7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,15:$V0,25:$V1,31:266,34:73,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},o($Vk,[2,21]),o($V41,[2,24]),o($Vk,[2,41]),{30:[1,269],39:[1,268],43:267},{20:[1,270]},o($Vk,[2,48]),{32:[2,53]},{32:[2,55],50:$Vh1},{7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,15:$V0,25:$V1,31:271,34:73,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},{28:[1,272],74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL,94:$VM,95:$VN,96:$VO,97:$VP,98:$VQ,99:$VR,100:$VS,101:$VT,103:$VU},{7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,15:$V0,25:$V1,31:273,34:73,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},{20:[1,274],74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL,94:$VM,95:$VN,96:$VO,97:$VP,98:$VQ,99:$VR,100:$VS,101:$VT,103:$VU},{7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,15:$V0,25:$V1,31:275,34:73,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},{15:$Vn,17:$Vo,40:276,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{30:[1,277]},{7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,15:$V0,25:$V1,32:[1,278],34:138,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},o($Vk,[2,42]),{17:[1,279]},{7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,15:$V0,25:$V1,31:280,34:73,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},o($Vk,[2,47]),o([32,50],[2,54],{63:13,7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,34:138,15:$V0,25:$V1,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,80:$V8}),{7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,15:$V0,25:$V1,31:281,34:73,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},o($Vk1,[2,52],{63:13,7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,34:138,15:$V0,25:$V1,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,80:$V8}),{15:$Vn,17:$Vo,40:282,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,15:$V0,25:$V1,32:[1,283],34:138,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},{19:[1,284],74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL,94:$VM,95:$VN,96:$VO,97:$VP,98:$VQ,99:$VR,100:$VS,101:$VT,103:$VU},{7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,15:$V0,25:$V1,31:285,34:73,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},o($Vk,[2,20]),{15:$Vn,17:$Vo,40:286,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,15:$V0,25:$V1,32:[1,287],34:138,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},o($Vk1,[2,51],{63:13,7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,34:138,15:$V0,25:$V1,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,80:$V8}),{20:[1,288],74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL,94:$VM,95:$VN,96:$VO,97:$VP,98:$VQ,99:$VR,100:$VS,101:$VT,103:$VU},o($Vk,[2,60]),{30:[1,289]},{7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,15:$V0,25:$V1,32:[1,290],34:138,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},{19:[1,291],74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL,94:$VM,95:$VN,96:$VO,97:$VP,98:$VQ,99:$VR,100:$VS,101:$VT,103:$VU},o($Vk,[2,45]),{15:$Vn,17:$Vo,40:292,66:$Vp,89:$Vq,102:$Vr,104:$Vs,105:$Vt,106:$Vu,107:$Vv,108:$Vw,109:$Vx},{7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,15:$V0,25:$V1,31:293,34:73,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},o($Vk,[2,59]),{30:[1,294]},{19:[1,295],74:$VE,75:$VF,88:$VG,89:$VH,90:$VI,91:$VJ,92:$VK,93:$VL,94:$VM,95:$VN,96:$VO,97:$VP,98:$VQ,99:$VR,100:$VS,101:$VT,103:$VU},{7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,15:$V0,25:$V1,32:[1,296],34:138,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},{7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,15:$V0,25:$V1,31:297,34:73,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},{30:[1,298]},o($Vk,[2,58]),{7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,15:$V0,25:$V1,32:[1,299],34:138,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},{7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,15:$V0,25:$V1,31:300,34:73,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},o($Vk,$Vi1,{41:301,42:$Vj1}),{7:74,8:75,9:76,10:77,11:78,12:79,13:80,14:81,15:$V0,25:$V1,32:[1,302],34:138,35:$VA,36:$VB,37:$VC,39:$V2,44:$V3,45:$V4,46:$V5,54:$V6,55:$V7,63:13,80:$V8},o($Vk,[2,44]),o($Vk,[2,57])],
defaultActions: {20:[2,92],21:[2,93],22:[2,1],173:[2,89],174:[2,90],257:[2,53]},
parseError: function parseError (str, hash) {
    if (hash.recoverable) {
        this.trace(str);
    } else {
        var error = new Error(str);
        error.hash = hash;
        throw error;
    }
},
parse: function parse(input) {
    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    var args = lstack.slice.call(arguments, 1);
    var lexer = Object.create(this.lexer);
    var sharedState = { yy: {} };
    for (var k in this.yy) {
        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
            sharedState.yy[k] = this.yy[k];
        }
    }
    lexer.setInput(input, sharedState.yy);
    sharedState.yy.lexer = lexer;
    sharedState.yy.parser = this;
    if (typeof lexer.yylloc == 'undefined') {
        lexer.yylloc = {};
    }
    var yyloc = lexer.yylloc;
    lstack.push(yyloc);
    var ranges = lexer.options && lexer.options.ranges;
    if (typeof sharedState.yy.parseError === 'function') {
        this.parseError = sharedState.yy.parseError;
    } else {
        this.parseError = Object.getPrototypeOf(this).parseError;
    }
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    _token_stack:
        var lex = function () {
            var token;
            token = lexer.lex() || EOF;
            if (typeof token !== 'number') {
                token = self.symbols_[token] || token;
            }
            return token;
        };
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol === null || typeof symbol == 'undefined') {
                symbol = lex();
            }
            action = table[state] && table[state][symbol];
        }
                    if (typeof action === 'undefined' || !action.length || !action[0]) {
                var errStr = '';
                expected = [];
                for (p in table[state]) {
                    if (this.terminals_[p] && p > TERROR) {
                        expected.push('\'' + this.terminals_[p] + '\'');
                    }
                }
                if (lexer.showPosition) {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
                } else {
                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
                }
                this.parseError(errStr, {
                    text: lexer.match,
                    token: this.terminals_[symbol] || symbol,
                    line: lexer.yylineno,
                    loc: yyloc,
                    expected: expected
                });
            }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(lexer.yytext);
            lstack.push(lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = lexer.yyleng;
                yytext = lexer.yytext;
                yylineno = lexer.yylineno;
                yyloc = lexer.yylloc;
                if (recovering > 0) {
                    recovering--;
                }
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {
                first_line: lstack[lstack.length - (len || 1)].first_line,
                last_line: lstack[lstack.length - 1].last_line,
                first_column: lstack[lstack.length - (len || 1)].first_column,
                last_column: lstack[lstack.length - 1].last_column
            };
            if (ranges) {
                yyval._$.range = [
                    lstack[lstack.length - (len || 1)].range[0],
                    lstack[lstack.length - 1].range[1]
                ];
            }
            r = this.performAction.apply(yyval, [
                yytext,
                yyleng,
                yylineno,
                sharedState.yy,
                action[1],
                vstack,
                lstack
            ].concat(args));
            if (typeof r !== 'undefined') {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}};

	let tablaErrores = [];	

	const Logical  = require('./CodigoIntermedio/Logical.js');
	const Operation = require('./CodigoIntermedio/Operation.js');
	const Relational = require('./CodigoIntermedio/Relational.js');
	const tsObject =  require('./CodigoIntermedio/tsObject.js')
	const Print =     require('./CodigoIntermedio/Print.js')
	const Variables = require('./CodigoIntermedio/Variable.js')
	const defLast = require('./CodigoIntermedio/defLast.js')
	const Id = require('./CodigoIntermedio/Id.js')
	const If = require('./CodigoIntermedio/If.js')
	const VariableChange = require('./CodigoIntermedio/VariableChange.js');
	const While = require('./CodigoIntermedio/While.js');
	const DoWhile = require('./CodigoIntermedio/DoWhile.js');
	const Switch = require('./CodigoIntermedio/Switch.js');
	const For = require('./CodigoIntermedio/For.js')
	const IncDecOp = require('./CodigoIntermedio/IncDecOp.js');
	const For2 = require('./CodigoIntermedio/For2.js');
	const ForThree = require('./CodigoIntermedio/ForThree.js');
	const Function = require('./CodigoIntermedio/Function.js');
	const callFunction = require('./CodigoIntermedio/callFunction.js');
	const Return = require('./CodigoIntermedio/Return.js');
	const Break = require('./CodigoIntermedio/Break.js');
	const Continue = require('./CodigoIntermedio/Continue.js');
	const Ternary = require('./CodigoIntermedio/Ternary.js');
	const Arrayl = require('./CodigoIntermedio/Arrayl.js');
	const ArrList = require('./CodigoIntermedio/ArrList.js');
	const IdAccess = require('./CodigoIntermedio/IdAccess.js');
	const List = require('./CodigoIntermedio/List.js');
	const ForIO = require('./CodigoIntermedio/ForIO.js');
	
/* generated by jison-lex 0.3.4 */
var lexer = (function(){
var lexer = ({

EOF:1,

parseError:function parseError(str, hash) {
        if (this.yy.parser) {
            this.yy.parser.parseError(str, hash);
        } else {
            throw new Error(str);
        }
    },

// resets the lexer, sets new input
setInput:function (input, yy) {
        this.yy = yy || this.yy || {};
        this._input = input;
        this._more = this._backtrack = this.done = false;
        this.yylineno = this.yyleng = 0;
        this.yytext = this.matched = this.match = '';
        this.conditionStack = ['INITIAL'];
        this.yylloc = {
            first_line: 1,
            first_column: 0,
            last_line: 1,
            last_column: 0
        };
        if (this.options.ranges) {
            this.yylloc.range = [0,0];
        }
        this.offset = 0;
        return this;
    },

// consumes and returns one char from the input
input:function () {
        var ch = this._input[0];
        this.yytext += ch;
        this.yyleng++;
        this.offset++;
        this.match += ch;
        this.matched += ch;
        var lines = ch.match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno++;
            this.yylloc.last_line++;
        } else {
            this.yylloc.last_column++;
        }
        if (this.options.ranges) {
            this.yylloc.range[1]++;
        }

        this._input = this._input.slice(1);
        return ch;
    },

// unshifts one char (or a string) into the input
unput:function (ch) {
        var len = ch.length;
        var lines = ch.split(/(?:\r\n?|\n)/g);

        this._input = ch + this._input;
        this.yytext = this.yytext.substr(0, this.yytext.length - len);
        //this.yyleng -= len;
        this.offset -= len;
        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
        this.match = this.match.substr(0, this.match.length - 1);
        this.matched = this.matched.substr(0, this.matched.length - 1);

        if (lines.length - 1) {
            this.yylineno -= lines.length - 1;
        }
        var r = this.yylloc.range;

        this.yylloc = {
            first_line: this.yylloc.first_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.first_column,
            last_column: lines ?
                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
              this.yylloc.first_column - len
        };

        if (this.options.ranges) {
            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
        }
        this.yyleng = this.yytext.length;
        return this;
    },

// When called from action, caches matched text and appends it on next action
more:function () {
        this._more = true;
        return this;
    },

// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
reject:function () {
        if (this.options.backtrack_lexer) {
            this._backtrack = true;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });

        }
        return this;
    },

// retain first n characters of the match
less:function (n) {
        this.unput(this.match.slice(n));
    },

// displays already matched input, i.e. for error messages
pastInput:function () {
        var past = this.matched.substr(0, this.matched.length - this.match.length);
        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
    },

// displays upcoming input, i.e. for error messages
upcomingInput:function () {
        var next = this.match;
        if (next.length < 20) {
            next += this._input.substr(0, 20-next.length);
        }
        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
    },

// displays the character position where the lexing error occurred, i.e. for error messages
showPosition:function () {
        var pre = this.pastInput();
        var c = new Array(pre.length + 1).join("-");
        return pre + this.upcomingInput() + "\n" + c + "^";
    },

// test the lexed token: return FALSE when not a match, otherwise return token
test_match:function(match, indexed_rule) {
        var token,
            lines,
            backup;

        if (this.options.backtrack_lexer) {
            // save context
            backup = {
                yylineno: this.yylineno,
                yylloc: {
                    first_line: this.yylloc.first_line,
                    last_line: this.last_line,
                    first_column: this.yylloc.first_column,
                    last_column: this.yylloc.last_column
                },
                yytext: this.yytext,
                match: this.match,
                matches: this.matches,
                matched: this.matched,
                yyleng: this.yyleng,
                offset: this.offset,
                _more: this._more,
                _input: this._input,
                yy: this.yy,
                conditionStack: this.conditionStack.slice(0),
                done: this.done
            };
            if (this.options.ranges) {
                backup.yylloc.range = this.yylloc.range.slice(0);
            }
        }

        lines = match[0].match(/(?:\r\n?|\n).*/g);
        if (lines) {
            this.yylineno += lines.length;
        }
        this.yylloc = {
            first_line: this.yylloc.last_line,
            last_line: this.yylineno + 1,
            first_column: this.yylloc.last_column,
            last_column: lines ?
                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
                         this.yylloc.last_column + match[0].length
        };
        this.yytext += match[0];
        this.match += match[0];
        this.matches = match;
        this.yyleng = this.yytext.length;
        if (this.options.ranges) {
            this.yylloc.range = [this.offset, this.offset += this.yyleng];
        }
        this._more = false;
        this._backtrack = false;
        this._input = this._input.slice(match[0].length);
        this.matched += match[0];
        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
        if (this.done && this._input) {
            this.done = false;
        }
        if (token) {
            return token;
        } else if (this._backtrack) {
            // recover context
            for (var k in backup) {
                this[k] = backup[k];
            }
            return false; // rule action called reject() implying the next rule should be tested instead.
        }
        return false;
    },

// return next match in input
next:function () {
        if (this.done) {
            return this.EOF;
        }
        if (!this._input) {
            this.done = true;
        }

        var token,
            match,
            tempMatch,
            index;
        if (!this._more) {
            this.yytext = '';
            this.match = '';
        }
        var rules = this._currentRules();
        for (var i = 0; i < rules.length; i++) {
            tempMatch = this._input.match(this.rules[rules[i]]);
            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
                match = tempMatch;
                index = i;
                if (this.options.backtrack_lexer) {
                    token = this.test_match(tempMatch, rules[i]);
                    if (token !== false) {
                        return token;
                    } else if (this._backtrack) {
                        match = false;
                        continue; // rule action called reject() implying a rule MISmatch.
                    } else {
                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
                        return false;
                    }
                } else if (!this.options.flex) {
                    break;
                }
            }
        }
        if (match) {
            token = this.test_match(match, rules[index]);
            if (token !== false) {
                return token;
            }
            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
            return false;
        }
        if (this._input === "") {
            return this.EOF;
        } else {
            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
                text: "",
                token: null,
                line: this.yylineno
            });
        }
    },

// return next match that has a token
lex:function lex () {
        var r = this.next();
        if (r) {
            return r;
        } else {
            return this.lex();
        }
    },

// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
begin:function begin (condition) {
        this.conditionStack.push(condition);
    },

// pop the previously active lexer condition state off the condition stack
popState:function popState () {
        var n = this.conditionStack.length - 1;
        if (n > 0) {
            return this.conditionStack.pop();
        } else {
            return this.conditionStack[0];
        }
    },

// produce the lexer rule set which is active for the currently active lexer condition state
_currentRules:function _currentRules () {
        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
        } else {
            return this.conditions["INITIAL"].rules;
        }
    },

// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
topState:function topState (n) {
        n = this.conditionStack.length - 1 - Math.abs(n || 0);
        if (n >= 0) {
            return this.conditionStack[n];
        } else {
            return "INITIAL";
        }
    },

// alias for begin(condition)
pushState:function pushState (condition) {
        this.begin(condition);
    },

// return the number of states currently on the stack
stateStackSize:function stateStackSize() {
        return this.conditionStack.length;
    },
options: {"case-sensitive":true},
performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
var YYSTATE=YY_START;
switch($avoiding_name_collisions) {
case 0://Comentario Linea
break;
case 1://Comentaio Multilinea
break;
case 2:return 36;
break;
case 3:return 35;
break;
case 4:return 108;
break;
case 5:return 'Type';
break;
case 6:return 80;
break;
case 7:return 55;
break;
case 8:return 80;
break;
case 9:return 25;
break;
case 10:return 39;
break;
case 11:return 42;
break;
case 12:return 44;
break;
case 13:return 45;
break;
case 14:return 46;
break;
case 15:return 50;
break;
case 16:return 53;
break;
case 17:return 54;
break;
case 18:return 58;
break;
case 19:return 59;
break;
case 20:return 81;
break;
case 21:return 83;
break;
case 22:return 84;
break;
case 23:return 85;
break;
case 24:return 106;
break;
case 25:return 107;
break;
case 26:return 'undefined';
break;
case 27:return 37;
break;
case 28:return 109;
break;
case 29:return 70;
break;
case 30:return 71;
break;
case 31:return 72;
break;
case 32:return 73;
break;
case 33:return 30;
break;
case 34:return 32;
break;
case 35:return 17;
break;
case 36:return 19;
break;
case 37:return 23;
break;
case 38:return 20;
break;
case 39:return 28;
break;
case 40:return 69;
break;
case 41:return 74;
break;
case 42:return 75;
break;
case 43:return 88;
break;
case 44:return 89;
break;
case 45:return 92;
break;
case 46:return 90;
break;
case 47:return 91;
break;
case 48:return 93;
break;
case 49:return 96;
break;
case 50:return 97;
break;
case 51:return 94;
break;
case 52:return 95;
break;
case 53:return 98;
break;
case 54:return 56;
break;
case 55:return 99;
break;
case 56:return 100;
break;
case 57:return 101;
break;
case 58:return 102;
break;
case 59:return 103;
break;
case 60:return 66;
break;
case 61:return 67;
break;
case 62:
break;
case 63:
break;
case 64:
break;
case 65:
break;
case 66:return 104;
break;
case 67:return 105;
break;
case 68:return 15;
break;
case 69:return 5;
break;
case 70: 
							console.error('Este es un error l├®xico: ' + yy_.yytext + ', en la linea: ' + yy_.yylloc.first_line + ', en la columna: ' + yy_.yylloc.first_column);
							tablaErrores.push({line:yy_.yylloc.first_line, column:yy_.yylloc.first_column, type:'Lexico',msg:'El caracter: ' + yy_.yytext + " no se esperaba"})
	
						
break;
}
},
rules: [/^(?:\/\/.*)/,/^(?:[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/])/,/^(?:continue\b)/,/^(?:break\b)/,/^(?:null\b)/,/^(?:type\b)/,/^(?:const\b)/,/^(?:let\b)/,/^(?:const\b)/,/^(?:function\b)/,/^(?:if\b)/,/^(?:else\b)/,/^(?:while\b)/,/^(?:do\b)/,/^(?:switch\b)/,/^(?:case\b)/,/^(?:default\b)/,/^(?:for\b)/,/^(?:in\b)/,/^(?:of\b)/,/^(?:number\b)/,/^(?:boolean\b)/,/^(?:string\b)/,/^(?:void\b)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:undefined\b)/,/^(?:return\b)/,/^(?:new\b)/,/^(?:\+=)/,/^(?:-=)/,/^(?:\*=)/,/^(?:\/=)/,/^(?:\{)/,/^(?:\})/,/^(?:\()/,/^(?:\))/,/^(?:,)/,/^(?:;)/,/^(?::)/,/^(?:\.)/,/^(?:\+\+)/,/^(?:--)/,/^(?:\+)/,/^(?:-)/,/^(?:\*\*)/,/^(?:\*)/,/^(?:\/)/,/^(?:%)/,/^(?:>=)/,/^(?:<=)/,/^(?:>)/,/^(?:<)/,/^(?:==)/,/^(?:=)/,/^(?:!=)/,/^(?:&&)/,/^(?:\|\|)/,/^(?:!)/,/^(?:\?)/,/^(?:\[)/,/^(?:\])/,/^(?:\s+)/,/^(?:\t+)/,/^(?:\r+)/,/^(?:\n+)/,/^(?:[0-9]+(\.[0-9]+)?\b)/,/^(?:"[^\"]*"|'[^\']*'|`[^\`]*`)/,/^(?:([a-zA-Z$_])[a-zA-Z0-9_$]*)/,/^(?:$)/,/^(?:.)/],
conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70],"inclusive":true}}
});
return lexer;
})();
parser.lexer = lexer;
function Parser () {
  this.yy = {};
}
Parser.prototype = parser;parser.Parser = Parser;
return new Parser;
})();


if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = gramatica;
exports.Parser = gramatica.Parser;
exports.parse = function () { return gramatica.parse.apply(gramatica, arguments); };
exports.main = function commonjsMain (args) {
    if (!args[1]) {
        console.log('Usage: '+args[0]+' FILE');
        process.exit(1);
    }
    var source = require('fs').readFileSync(require('path').normalize(args[1]), "utf8");
    return exports.parser.parse(source);
};
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(process.argv.slice(1));
}
}
}).call(this)}).call(this,require('_process'))
},{"./CodigoIntermedio/ArrList.js":5,"./CodigoIntermedio/Arrayl.js":6,"./CodigoIntermedio/Break.js":7,"./CodigoIntermedio/Continue.js":8,"./CodigoIntermedio/DoWhile.js":9,"./CodigoIntermedio/For.js":10,"./CodigoIntermedio/For2.js":11,"./CodigoIntermedio/ForIO.js":12,"./CodigoIntermedio/ForThree.js":13,"./CodigoIntermedio/Function.js":14,"./CodigoIntermedio/Id.js":15,"./CodigoIntermedio/IdAccess.js":16,"./CodigoIntermedio/If.js":17,"./CodigoIntermedio/IncDecOp.js":18,"./CodigoIntermedio/List.js":19,"./CodigoIntermedio/Logical.js":20,"./CodigoIntermedio/Operation.js":21,"./CodigoIntermedio/Print.js":22,"./CodigoIntermedio/Relational.js":23,"./CodigoIntermedio/Return.js":24,"./CodigoIntermedio/Switch.js":26,"./CodigoIntermedio/Ternary.js":27,"./CodigoIntermedio/Variable.js":28,"./CodigoIntermedio/VariableChange.js":29,"./CodigoIntermedio/While.js":30,"./CodigoIntermedio/callFunction.js":31,"./CodigoIntermedio/defLast.js":32,"./CodigoIntermedio/tsObject.js":33,"_process":3,"fs":1,"path":2}],36:[function(require,module,exports){
const parser = require('./gramatica');
const Scope = require('./CodigoIntermedio/Scope');
//const translate = require('./EjecutarTraductor');
const parserAST = require('./astGraph.js');

let scope = null;
var tablaErrores = null;
//const mermaid = require('mermaid');
//const chalk = require('chalk');

$(document).ready(function(){
	//code here...
	var code = $(".codemirror-textarea")[0];
	var editor = CodeMirror.fromTextArea(code, {
        lineNumbers : true,
        mode: 'javascript'
    });
    
    var code_translate = $(".codemirror-translate")[0];
    var editor_translate = CodeMirror.fromTextArea(code_translate, {
        lineNumbers : true,
        mode: 'javascript'
    });

    var consoleT = document.getElementsByClassName('console')[0];
    var treeDiv = document.getElementById("merTree");
    
    document.getElementById("ejecutar").onclick = function() {
        let entrada = editor.getValue();
        consoleT.value = "";
       ejecutar(entrada,consoleT,editor_translate);
    }
    document.getElementById("Arbol").onclick = function() {
        let entrada = editor.getValue();
        consoleT.value = "";
        var str = "graph TD; \n"+AST(entrada);
        //treeDiv.innerHTML = str;

        var insertSvg = function(svgCode, bindFunctions){
            treeDiv.innerHTML = svgCode;
        };
        
        var graph = mermaid.mermaidAPI.render('graphDiv', str, insertSvg);

        mermaid.initialize({startOnLoad:true});
        mermaid.init();
        
    }

    document.getElementById("tabla").onclick = function() {
        var table = document.getElementById("table-ts");
        table.innerHTML = "";
        if(scope != null) {

            var tab = scope.getTable();
            //var type = scope.getTypesTable();
            var func = scope.getFunctionTable();

            //console.log(func);
            var str = "<h2>Variables</h2>\n";
            str += "<table>\n"
            str += "<tr>\n" +
                   "<th>Nombre</th>\n"+
                   "<th>Tipo</th>\n" +
                   "<th>Temporal</th>\n" +
                   "<th>Ambito</th>\n" +
                   "</tr>\n";
            for(let obj of tab) {
                str += "<tr>\n"
                str += "<th>" + obj[0] + "</th>\n";
                str += "<th>" + obj[1].type + "</th>\n";
                str += "<th>" + obj[1].pointer + "</th>\n";
                str += "<th>1</th>";
            }
            str += "</table>\n";

            str += "<h2>Funciones</h2>\n";
            str += "<table>\n"
            str += "<tr>\n" +
                   "<th>Nombre</th>\n"+
                   "<th>Tipo</th>\n" +
                   "<th>Ambito</th>\n" +
                   "</tr>\n";
            for(let obj of func) {
                str += "<tr>\n"
                str += "<th>" + obj[0] + "</th>\n";
                str += "<th>" + obj[1].type + "</th>\n";
                str += "<th>1</th>";
            }
            str += "</table>\n";
            /*
            str += "<h2>Types</h2>\n";
            str += "<table>\n"
            str += "<tr>\n" +
                   "<th>Nombre</th>\n"+
                   //"<th>Tipo</th>\n" +
                   "</tr>\n";
            for(let obj of type) {
                str += "<tr>\n"
                str += "<th>" + obj[0] + "</th>\n";
               // str += "<th>" + obj[1].type + "</th>\n";
                //str += "<th>1</th>";
            }
            str += "</table>\n";*/
            table.innerHTML = str;
        }
    }

    /*document.getElementById("traducir").onclick = function() {
        let entrada = editor_translate.getValue();
        //consoleT.value = "";
        //traducir(entrada,editor);
    }*/

   /* document.getElementById("traducir-ejecutar").onclick = function() {
        let entrada = editor_translate.getValue();
        consoleT.value = "";
        //var traduccion = traducir(entrada,editor);
        //ejecutar(traduccion,consoleT);
    }*/
});


function traducir(entrada,editor) {
    /*var r = translate(entrada);
    editor.getDoc().setValue(r);
    return r;*/
}

function getValue(obj) {
    //console.log(obj);
    if(obj.value instanceof Map) {
        return getStrObj(obj.value,"");
    } else if(obj.value.isArray) {
        return getStrArr(obj.value.value);
    } else {
        return obj.value.value;
    }
}

function getStrArr(obj) {
    var str = "["
    var prop = "";
    //console.log(obj)
    obj.forEach((value) => {

        //prop += tab + "\t"+ key + ": ";
        if(value.constructor.name == "TObject") {
            prop += value.value;
        } else if(value.isArray) {
            prop += getStrArr(value.value)
        } else if(value.constructor.name == "Map"){
            prop += getStrObj(value,"\t");
        }
        prop += ",";
    });
    prop = prop.substring(0,prop.length-1)
    str += prop;
    str += "]"
    return str;
}

function getStrObj(obj,tab) {
    var str = tab+"{\n"
    var prop = "";
    obj.forEach((value,key) => {

        prop += tab + "\t"+ key + ": ";
        if(value.constructor.name == "TObject") {
            prop += value.value;
        } else if(value.isArray) {
            prop += getStrArr(value.value)
        } else if(value.constructor.name == "Map"){
            prop += getStrObj(value,"\t");
        }
        prop += ",\n";
    });
    prop = prop.substring(0,prop.length-2)
    str += prop;
    str += "\n"
    str += tab +"}"
    return str;
}

function AST(entrada) {
    let ast = parserAST.parse(entrada.toString());
    
    return ast.code;
}

function ejecutar(entrada,consoleT,editor_translate) {

    //console.log(console);
    
    parser.tablaErrores = [];

    
    scope = new Scope(null,0,0);
    let ast = parser.parse(entrada.toString());
    
    tablaErrores = null;
    tablaErrores = ast.tabla;
    ast = ast.ast;
    var ts = document.getElementById("table");
    ts.innerHTML = "";
    console.log(tablaErrores);

    if(tablaErrores.length > 0) {
        var str_ = "<table>\n";
        str_ += "<tr>\n" +
                       "<th>Linea</th>\n"+
                       "<th>Columna</th>\n" +
                       "<th>Tipo</th>\n" +
                       "<th>Mensaje</th>\n" +
                       "</tr>\n";
        tablaErrores.forEach(element => {
            str_ += "<tr>\n" +
                       "<th>"+element.line+"</th>\n"+
                       "<th>"+element.column+"</th>\n" +
                       "<th>"+element.type+"</th>\n" +
                       "<th>"+element.msg+"</th>\n" +
                       "</tr>\n";
    
        });
        str_ += "</table>\n";
        ts.innerHTML = str_;
        while(tablaErrores.length != 0) {
            tablaErrores.pop()
        }
        //return;
        consoleT.value = str;
    }

    let code = '';
    code += '#include <stdio.h>\n\n';
    code += 'float P = 0;\n';
    code += 'float H = 0;\n';
    code += 'float Stack[16394];\n';
    code += 'float Heap[16384];\n'
    let terminals = 'float t1';

    let Globales = 'void global_def___default(){\n';
    let Funciones = '';
    let Main = '\n\nvoid main(){\n';
    Main += 'global_def___default();\n';


    ast.forEach(element => {
        if(element.constructor.name == "Variable" /*||element.constructor.name == "VariableChange"*/ ) {
            //console.log(element)
            let r = element.translate(scope,null,null,null,null,null); 
            Globales += r.code3d;
        }
    })
    Globales += '}\n';

    ast.forEach(element => {
        if(element.constructor.name == "Function") {
            let r = element.translate(scope,null,null,null,null,null);
            Funciones += r.code3d;
        }
    })


    ast.forEach(element => {
        if(check(element)) {
            let r = element.translate(scope,null,null,null,null,null); 
            Main += r.code3d;
        }
    });
    Main += 'return;\n}';


    for(let i = 1;i<scope.terminal;i++){
    terminals +=  ',t'+(i+1);
    }
    terminals += ';\n\n';
    let resultado = code +  terminals + Globales + Funciones + Main;
    //consoleT.value = resultado;
    editor_translate.getDoc().setValue(resultado);
}

function check(element) {
    if(element.constructor.name == "Function") {
        return false;
    } else if(element.constructor.name == "Variable" /*||element.constructor.name == "asignVariable"*/ ) {
        return false;
    } else if(element.constructor.name == "decType") {
        return false;
    } else {
        return true;
    }
}

},{"./CodigoIntermedio/Scope":25,"./astGraph.js":34,"./gramatica":35}]},{},[36]);
