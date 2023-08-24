// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"script.js":[function(require,module,exports) {
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

// Algolia client. Mandatory to instantiate the Helper.
// These secret should be hidden
var APPLICATION_ID = 'T6YWIILD53';
var API_KEY_SEARCH = 'fd5a18d06a2881e28b3fc3e02ffec21a';
var RESTAURANTS_INDEX = 'restaurants_demo';
var algolia = algoliasearch(APPLICATION_ID, API_KEY_SEARCH); // Algolia Helper

var helper = algoliasearchHelper(algolia, RESTAURANTS_INDEX, {
  disjunctiveFacets: ['payment_options', 'food_types'],
  hitsPerPage: 5,
  maxValuesPerFacet: 7,
  getRankingInfo: true
});
var userLocation = null;

var successCallback = function successCallback(position) {
  console.log(position);
  loc = position.coords;
  helper.setQueryParameter('aroundLatLng', "".concat(loc.latitude, ", ").concat(loc.longitude));
  helper.search();
};

var errorCallback = function errorCallback(error) {
  console.log(error);
  helper.setQueryParameter('aroundLatLngViaIP', true);
  helper.search();
};

navigator.geolocation.getCurrentPosition(successCallback, errorCallback); // Bind the result event to a function that will update the results

helper.on("result", searchCallback); // The different parts of the UI that we want to use in this example

var $inputfield = $("#search-box");
var $hits = $('#hits');
var $hitsFound = $('#hits-found');
var $foodTypesFacet = $('#food-types-facet');
var $paymentOptionsFacet = $('#payment-options-facet');
var $buttonShowMore = $('#button-show-more');
var showMoreInProgress = false;
$foodTypesFacet.on('click', handleFacetClick);
$paymentOptionsFacet.on('click', handleFacetClick);
$buttonShowMore.on('click', handleShowMoreClick); // When there is a new character input:
// - update the query
// - trigger the search

$inputfield.keyup(function (e) {
  helper.setQuery($inputfield.val()).search();
}); // Result event callback

function searchCallback(content) {
  if (content.hits.length === 0) {
    // If there is no result we display a friendly message
    // instead of an empty page.
    $hits.empty().html("No results :(");
    return;
  } // Hits/results rendering


  renderHits($hits, content);
  renderFacets($foodTypesFacet, $paymentOptionsFacet, content);
}

function renderHits($hits, results) {
  // Scan all hits and display them
  var hitsFound = "".concat(results.nbHits, " result(s) found&nbsp;<span>in ").concat(results.processingTimeMS / 1000, " second(s)</span>");
  $hitsFound.html(hitsFound);
  var hits = '';

  var _iterator = _createForOfIteratorHelper(results.hits),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var item = _step.value;
      var url = item.image_url; // Little trick => use unsplash random restaurant pictures

      url = url.replace('www.opentable.com/img/restimages/', 'source.unsplash.com/random/200x200?restaurant=');
      hits += '<div class="row hit-item">' + '    <div class="col-2 hit-img">' + "    <img src=\"".concat(url, "\">") + '    </div>' + '    <div class="col-10">' + '    <ul class="list-group list-card">' + '        <li class="list-group-item">' + "        <div class=\"hit-name\">".concat(item.name, "</div>") + '        <div class="hit-rating-inline">' + "            <div class=\"hit-rating-score\">".concat(item.stars_count.toFixed(1), "</div>") + '            <div class="rating hit-rating-star">' + "            <div class=\"rating-bg\" style=\"width: calc(".concat(item.stars_count, "/5*100%); \"></div>") + '            <svg><use xlink:href="#fivestars" /></svg>' + '            </div>' + "            <div class=\"hit-reviews\">&nbsp;(".concat(item.reviews_count, " reviews)</div>") + '        </div>' + "        <div class=\"hit-desc\">".concat(item.food_type, " | ").concat(item.neighborhood, " | ").concat(item.price_range, "</div>") + '        </li>' + '    </ul>' + '    </div>' + '</div>';
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  if (showMoreInProgress) {
    // Append Mode
    hits = $hits.html() + hits;
    showMoreInProgress = false;
  }

  $hits.html(hits);
}

function renderFacets($foodTypesFacet, $paymentOptionsFacet, results) {
  // We use the disjunctive facets attribute.
  var foodTypesFacet = '';
  var data = results.getFacetValues('food_types');

  var _iterator2 = _createForOfIteratorHelper(data),
      _step2;

  try {
    for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
      var item = _step2.value;
      foodTypesFacet += '' + "    <li class=\"list-group-item filter-inline ".concat(item.isRefined ? 'active' : '', "\">") + "      <div class=\"col-9\" data-attribute=\"food_types\" data-value=\"".concat(item.name, "\">").concat(item.name, "</div><div class=\"col-3 facet-values\">").concat(item.count, "</div>") + '    </li>';
    }
  } catch (err) {
    _iterator2.e(err);
  } finally {
    _iterator2.f();
  }

  $foodTypesFacet.html(foodTypesFacet);
  var paymentOptionsFacet = '';
  var data2 = results.getFacetValues('payment_options');

  var _iterator3 = _createForOfIteratorHelper(data2),
      _step3;

  try {
    for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
      var _item = _step3.value;
      paymentOptionsFacet += '' + "    <li class=\"list-group-item filter-inline ".concat(_item.isRefined ? 'active' : '', "\">") + "      <div class=\"col-10\" data-attribute=\"payment_options\" data-value=\"".concat(_item.name, "\">").concat(_item.name, "</div>") + '    </li>';
    }
  } catch (err) {
    _iterator3.e(err);
  } finally {
    _iterator3.f();
  }

  $paymentOptionsFacet.html(paymentOptionsFacet);
}

function handleFacetClick(e) {
  e.preventDefault();
  var target = e.target;
  var attribute = target.dataset.attribute;
  var value = target.dataset.value; // Because we are listening in the parent, the user might click where there is no data

  if (!attribute || !value) return; // The toggleRefine method works for disjunctive facets as well

  helper.toggleRefine(attribute, value).search();
}

function handleShowMoreClick(e) {
  showMoreInProgress = true; // Append mode (quick and dirty)

  helper.nextPage().search();
}
},{}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "58063" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","script.js"], null)
//# sourceMappingURL=/script.75da7f30.js.map