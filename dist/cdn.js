(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
  var __commonJS = (callback, module) => () => {
    if (!module) {
      module = {exports: {}};
      callback(module.exports, module);
    }
    return module.exports;
  };
  var __exportStar = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, {get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable});
    }
    return target;
  };
  var __toModule = (module) => {
    return __exportStar(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? {get: () => module.default, enumerable: true} : {value: module, enumerable: true})), module);
  };

  // node_modules/mousetrap/mousetrap.js
  var require_mousetrap = __commonJS((exports, module) => {
    (function(window2, document2, undefined2) {
      if (!window2) {
        return;
      }
      var _MAP = {
        8: "backspace",
        9: "tab",
        13: "enter",
        16: "shift",
        17: "ctrl",
        18: "alt",
        20: "capslock",
        27: "esc",
        32: "space",
        33: "pageup",
        34: "pagedown",
        35: "end",
        36: "home",
        37: "left",
        38: "up",
        39: "right",
        40: "down",
        45: "ins",
        46: "del",
        91: "meta",
        93: "meta",
        224: "meta"
      };
      var _KEYCODE_MAP = {
        106: "*",
        107: "+",
        109: "-",
        110: ".",
        111: "/",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        190: ".",
        191: "/",
        192: "`",
        219: "[",
        220: "\\",
        221: "]",
        222: "'"
      };
      var _SHIFT_MAP = {
        "~": "`",
        "!": "1",
        "@": "2",
        "#": "3",
        $: "4",
        "%": "5",
        "^": "6",
        "&": "7",
        "*": "8",
        "(": "9",
        ")": "0",
        _: "-",
        "+": "=",
        ":": ";",
        '"': "'",
        "<": ",",
        ">": ".",
        "?": "/",
        "|": "\\"
      };
      var _SPECIAL_ALIASES = {
        option: "alt",
        command: "meta",
        return: "enter",
        escape: "esc",
        plus: "+",
        mod: /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? "meta" : "ctrl"
      };
      var _REVERSE_MAP;
      for (var i = 1; i < 20; ++i) {
        _MAP[111 + i] = "f" + i;
      }
      for (i = 0; i <= 9; ++i) {
        _MAP[i + 96] = i.toString();
      }
      function _addEvent(object, type, callback) {
        if (object.addEventListener) {
          object.addEventListener(type, callback, false);
          return;
        }
        object.attachEvent("on" + type, callback);
      }
      function _characterFromEvent(e) {
        if (e.type == "keypress") {
          var character = String.fromCharCode(e.which);
          if (!e.shiftKey) {
            character = character.toLowerCase();
          }
          return character;
        }
        if (_MAP[e.which]) {
          return _MAP[e.which];
        }
        if (_KEYCODE_MAP[e.which]) {
          return _KEYCODE_MAP[e.which];
        }
        return String.fromCharCode(e.which).toLowerCase();
      }
      function _modifiersMatch(modifiers1, modifiers2) {
        return modifiers1.sort().join(",") === modifiers2.sort().join(",");
      }
      function _eventModifiers(e) {
        var modifiers = [];
        if (e.shiftKey) {
          modifiers.push("shift");
        }
        if (e.altKey) {
          modifiers.push("alt");
        }
        if (e.ctrlKey) {
          modifiers.push("ctrl");
        }
        if (e.metaKey) {
          modifiers.push("meta");
        }
        return modifiers;
      }
      function _preventDefault(e) {
        if (e.preventDefault) {
          e.preventDefault();
          return;
        }
        e.returnValue = false;
      }
      function _stopPropagation(e) {
        if (e.stopPropagation) {
          e.stopPropagation();
          return;
        }
        e.cancelBubble = true;
      }
      function _isModifier(key) {
        return key == "shift" || key == "ctrl" || key == "alt" || key == "meta";
      }
      function _getReverseMap() {
        if (!_REVERSE_MAP) {
          _REVERSE_MAP = {};
          for (var key in _MAP) {
            if (key > 95 && key < 112) {
              continue;
            }
            if (_MAP.hasOwnProperty(key)) {
              _REVERSE_MAP[_MAP[key]] = key;
            }
          }
        }
        return _REVERSE_MAP;
      }
      function _pickBestAction(key, modifiers, action) {
        if (!action) {
          action = _getReverseMap()[key] ? "keydown" : "keypress";
        }
        if (action == "keypress" && modifiers.length) {
          action = "keydown";
        }
        return action;
      }
      function _keysFromString(combination) {
        if (combination === "+") {
          return ["+"];
        }
        combination = combination.replace(/\+{2}/g, "+plus");
        return combination.split("+");
      }
      function _getKeyInfo(combination, action) {
        var keys;
        var key;
        var i2;
        var modifiers = [];
        keys = _keysFromString(combination);
        for (i2 = 0; i2 < keys.length; ++i2) {
          key = keys[i2];
          if (_SPECIAL_ALIASES[key]) {
            key = _SPECIAL_ALIASES[key];
          }
          if (action && action != "keypress" && _SHIFT_MAP[key]) {
            key = _SHIFT_MAP[key];
            modifiers.push("shift");
          }
          if (_isModifier(key)) {
            modifiers.push(key);
          }
        }
        action = _pickBestAction(key, modifiers, action);
        return {
          key,
          modifiers,
          action
        };
      }
      function _belongsTo(element, ancestor) {
        if (element === null || element === document2) {
          return false;
        }
        if (element === ancestor) {
          return true;
        }
        return _belongsTo(element.parentNode, ancestor);
      }
      function Mousetrap3(targetElement) {
        var self = this;
        targetElement = targetElement || document2;
        if (!(self instanceof Mousetrap3)) {
          return new Mousetrap3(targetElement);
        }
        self.target = targetElement;
        self._callbacks = {};
        self._directMap = {};
        var _sequenceLevels = {};
        var _resetTimer;
        var _ignoreNextKeyup = false;
        var _ignoreNextKeypress = false;
        var _nextExpectedAction = false;
        function _resetSequences(doNotReset) {
          doNotReset = doNotReset || {};
          var activeSequences = false, key;
          for (key in _sequenceLevels) {
            if (doNotReset[key]) {
              activeSequences = true;
              continue;
            }
            _sequenceLevels[key] = 0;
          }
          if (!activeSequences) {
            _nextExpectedAction = false;
          }
        }
        function _getMatches(character, modifiers, e, sequenceName, combination, level) {
          var i2;
          var callback;
          var matches = [];
          var action = e.type;
          if (!self._callbacks[character]) {
            return [];
          }
          if (action == "keyup" && _isModifier(character)) {
            modifiers = [character];
          }
          for (i2 = 0; i2 < self._callbacks[character].length; ++i2) {
            callback = self._callbacks[character][i2];
            if (!sequenceName && callback.seq && _sequenceLevels[callback.seq] != callback.level) {
              continue;
            }
            if (action != callback.action) {
              continue;
            }
            if (action == "keypress" && !e.metaKey && !e.ctrlKey || _modifiersMatch(modifiers, callback.modifiers)) {
              var deleteCombo = !sequenceName && callback.combo == combination;
              var deleteSequence = sequenceName && callback.seq == sequenceName && callback.level == level;
              if (deleteCombo || deleteSequence) {
                self._callbacks[character].splice(i2, 1);
              }
              matches.push(callback);
            }
          }
          return matches;
        }
        function _fireCallback(callback, e, combo, sequence) {
          if (self.stopCallback(e, e.target || e.srcElement, combo, sequence)) {
            return;
          }
          if (callback(e, combo) === false) {
            _preventDefault(e);
            _stopPropagation(e);
          }
        }
        self._handleKey = function(character, modifiers, e) {
          var callbacks = _getMatches(character, modifiers, e);
          var i2;
          var doNotReset = {};
          var maxLevel = 0;
          var processedSequenceCallback = false;
          for (i2 = 0; i2 < callbacks.length; ++i2) {
            if (callbacks[i2].seq) {
              maxLevel = Math.max(maxLevel, callbacks[i2].level);
            }
          }
          for (i2 = 0; i2 < callbacks.length; ++i2) {
            if (callbacks[i2].seq) {
              if (callbacks[i2].level != maxLevel) {
                continue;
              }
              processedSequenceCallback = true;
              doNotReset[callbacks[i2].seq] = 1;
              _fireCallback(callbacks[i2].callback, e, callbacks[i2].combo, callbacks[i2].seq);
              continue;
            }
            if (!processedSequenceCallback) {
              _fireCallback(callbacks[i2].callback, e, callbacks[i2].combo);
            }
          }
          var ignoreThisKeypress = e.type == "keypress" && _ignoreNextKeypress;
          if (e.type == _nextExpectedAction && !_isModifier(character) && !ignoreThisKeypress) {
            _resetSequences(doNotReset);
          }
          _ignoreNextKeypress = processedSequenceCallback && e.type == "keydown";
        };
        function _handleKeyEvent(e) {
          if (typeof e.which !== "number") {
            e.which = e.keyCode;
          }
          var character = _characterFromEvent(e);
          if (!character) {
            return;
          }
          if (e.type == "keyup" && _ignoreNextKeyup === character) {
            _ignoreNextKeyup = false;
            return;
          }
          self.handleKey(character, _eventModifiers(e), e);
        }
        function _resetSequenceTimer() {
          clearTimeout(_resetTimer);
          _resetTimer = setTimeout(_resetSequences, 1e3);
        }
        function _bindSequence(combo, keys, callback, action) {
          _sequenceLevels[combo] = 0;
          function _increaseSequence(nextAction) {
            return function() {
              _nextExpectedAction = nextAction;
              ++_sequenceLevels[combo];
              _resetSequenceTimer();
            };
          }
          function _callbackAndReset(e) {
            _fireCallback(callback, e, combo);
            if (action !== "keyup") {
              _ignoreNextKeyup = _characterFromEvent(e);
            }
            setTimeout(_resetSequences, 10);
          }
          for (var i2 = 0; i2 < keys.length; ++i2) {
            var isFinal = i2 + 1 === keys.length;
            var wrappedCallback = isFinal ? _callbackAndReset : _increaseSequence(action || _getKeyInfo(keys[i2 + 1]).action);
            _bindSingle(keys[i2], wrappedCallback, action, combo, i2);
          }
        }
        function _bindSingle(combination, callback, action, sequenceName, level) {
          self._directMap[combination + ":" + action] = callback;
          combination = combination.replace(/\s+/g, " ");
          var sequence = combination.split(" ");
          var info;
          if (sequence.length > 1) {
            _bindSequence(combination, sequence, callback, action);
            return;
          }
          info = _getKeyInfo(combination, action);
          self._callbacks[info.key] = self._callbacks[info.key] || [];
          _getMatches(info.key, info.modifiers, {type: info.action}, sequenceName, combination, level);
          self._callbacks[info.key][sequenceName ? "unshift" : "push"]({
            callback,
            modifiers: info.modifiers,
            action: info.action,
            seq: sequenceName,
            level,
            combo: combination
          });
        }
        self._bindMultiple = function(combinations, callback, action) {
          for (var i2 = 0; i2 < combinations.length; ++i2) {
            _bindSingle(combinations[i2], callback, action);
          }
        };
        _addEvent(targetElement, "keypress", _handleKeyEvent);
        _addEvent(targetElement, "keydown", _handleKeyEvent);
        _addEvent(targetElement, "keyup", _handleKeyEvent);
      }
      Mousetrap3.prototype.bind = function(keys, callback, action) {
        var self = this;
        keys = keys instanceof Array ? keys : [keys];
        self._bindMultiple.call(self, keys, callback, action);
        return self;
      };
      Mousetrap3.prototype.unbind = function(keys, action) {
        var self = this;
        return self.bind.call(self, keys, function() {
        }, action);
      };
      Mousetrap3.prototype.trigger = function(keys, action) {
        var self = this;
        if (self._directMap[keys + ":" + action]) {
          self._directMap[keys + ":" + action]({}, keys);
        }
        return self;
      };
      Mousetrap3.prototype.reset = function() {
        var self = this;
        self._callbacks = {};
        self._directMap = {};
        return self;
      };
      Mousetrap3.prototype.stopCallback = function(e, element) {
        var self = this;
        if ((" " + element.className + " ").indexOf(" mousetrap ") > -1) {
          return false;
        }
        if (_belongsTo(element, self.target)) {
          return false;
        }
        if ("composedPath" in e && typeof e.composedPath === "function") {
          var initialEventTarget = e.composedPath()[0];
          if (initialEventTarget !== e.target) {
            element = initialEventTarget;
          }
        }
        return element.tagName == "INPUT" || element.tagName == "SELECT" || element.tagName == "TEXTAREA" || element.isContentEditable;
      };
      Mousetrap3.prototype.handleKey = function() {
        var self = this;
        return self._handleKey.apply(self, arguments);
      };
      Mousetrap3.addKeycodes = function(object) {
        for (var key in object) {
          if (object.hasOwnProperty(key)) {
            _MAP[key] = object[key];
          }
        }
        _REVERSE_MAP = null;
      };
      Mousetrap3.init = function() {
        var documentMousetrap = Mousetrap3(document2);
        for (var method in documentMousetrap) {
          if (method.charAt(0) !== "_") {
            Mousetrap3[method] = function(method2) {
              return function() {
                return documentMousetrap[method2].apply(documentMousetrap, arguments);
              };
            }(method);
          }
        }
      };
      Mousetrap3.init();
      window2.Mousetrap = Mousetrap3;
      if (typeof module !== "undefined" && module.exports) {
        module.exports = Mousetrap3;
      }
      if (typeof define === "function" && define.amd) {
        define(function() {
          return Mousetrap3;
        });
      }
    })(typeof window !== "undefined" ? window : null, typeof window !== "undefined" ? document : null);
  });

  // src/index.js
  var import_mousetrap = __toModule(require_mousetrap());

  // node_modules/mousetrap/plugins/global-bind/mousetrap-global-bind.js
  (function(Mousetrap3) {
    if (!Mousetrap3) {
      return;
    }
    var _globalCallbacks = {};
    var _originalStopCallback = Mousetrap3.prototype.stopCallback;
    Mousetrap3.prototype.stopCallback = function(e, element, combo, sequence) {
      var self = this;
      if (self.paused) {
        return true;
      }
      if (_globalCallbacks[combo] || _globalCallbacks[sequence]) {
        return false;
      }
      return _originalStopCallback.call(self, e, element, combo);
    };
    Mousetrap3.prototype.bindGlobal = function(keys, callback, action) {
      var self = this;
      self.bind(keys, callback, action);
      if (keys instanceof Array) {
        for (var i = 0; i < keys.length; i++) {
          _globalCallbacks[keys[i]] = true;
        }
        return;
      }
      _globalCallbacks[keys] = true;
    };
    Mousetrap3.init();
  })(typeof Mousetrap !== "undefined" ? Mousetrap : void 0);

  // src/index.js
  var src_default = (Alpine) => {
    Alpine.directive("mousetrap", (el, {modifiers, expression}, {evaluate}) => {
      const action = () => expression ? evaluate(expression) : el.click();
      modifiers = modifiers.map((modifier) => modifier.replace("-", "+"));
      if (modifiers.includes("global")) {
        modifiers = modifiers.filter((modifier) => modifier !== "global");
        import_mousetrap.default.bindGlobal(modifiers, ($event) => {
          $event.preventDefault();
          action();
        });
      }
      import_mousetrap.default.bind(modifiers, ($event) => {
        $event.preventDefault();
        action();
      });
    });
  };

  // builds/cdn.js
  document.addEventListener("alpine:initializing", () => {
    src_default(window.Alpine);
  });
})();
