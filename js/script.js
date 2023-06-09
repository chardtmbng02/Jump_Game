(function () {
  function b(a, b) {
    return [].slice.call((b || document).querySelectorAll(a));
  }
  if (!window.addEventListener) return;
  var a = (window.StyleFix = {
    link: function (b) {
      try {
        if (b.rel !== "stylesheet" || b.hasAttribute("data-noprefix")) return;
      } catch (c) {
        return;
      }
      var d = b.href || b.getAttribute("data-href"),
        e = d.replace(/[^\/]+$/, ""),
        f = b.parentNode,
        g = new XMLHttpRequest(),
        h;
      (g.onreadystatechange = function () {
        g.readyState === 4 && h();
      }),
        (h = function () {
          var c = g.responseText;
          if (
            c &&
            b.parentNode &&
            (!g.status || g.status < 400 || g.status > 600)
          ) {
            c = a.fix(c, !0, b);
            if (e) {
              c = c.replace(
                /url\(\s*?((?:"|')?)(.+?)\1\s*?\)/gi,
                function (a, b, c) {
                  return /^([a-z]{3,10}:|\/|#)/i.test(c)
                    ? a
                    : 'url("' + e + c + '")';
                }
              );
              var d = e.replace(/([\\\^\$*+[\]?{}.=!:(|)])/g, "\\$1");
              c = c.replace(
                RegExp("\\b(behavior:\\s*?url\\('?\"?)" + d, "gi"),
                "$1"
              );
            }
            var h = document.createElement("style");
            (h.textContent = c),
              (h.media = b.media),
              (h.disabled = b.disabled),
              h.setAttribute("data-href", b.getAttribute("href")),
              f.insertBefore(h, b),
              f.removeChild(b),
              (h.media = b.media);
          }
        });
      try {
        g.open("GET", d), g.send(null);
      } catch (c) {
        typeof XDomainRequest != "undefined" &&
          ((g = new XDomainRequest()),
          (g.onerror = g.onprogress = function () {}),
          (g.onload = h),
          g.open("GET", d),
          g.send(null));
      }
      b.setAttribute("data-inprogress", "");
    },
    styleElement: function (b) {
      if (b.hasAttribute("data-noprefix")) return;
      var c = b.disabled;
      (b.textContent = a.fix(b.textContent, !0, b)), (b.disabled = c);
    },
    styleAttribute: function (b) {
      var c = b.getAttribute("style");
      (c = a.fix(c, !1, b)), b.setAttribute("style", c);
    },
    process: function () {
      b('link[rel="stylesheet"]:not([data-inprogress])').forEach(StyleFix.link),
        b("style").forEach(StyleFix.styleElement),
        b("[style]").forEach(StyleFix.styleAttribute);
    },
    register: function (b, c) {
      (a.fixers = a.fixers || []).splice(
        c === undefined ? a.fixers.length : c,
        0,
        b
      );
    },
    fix: function (b, c) {
      for (var d = 0; d < a.fixers.length; d++) b = a.fixers[d](b, c) || b;
      return b;
    },
    camelCase: function (a) {
      return a
        .replace(/-([a-z])/g, function (a, b) {
          return b.toUpperCase();
        })
        .replace("-", "");
    },
    deCamelCase: function (a) {
      return a.replace(/[A-Z]/g, function (a) {
        return "-" + a.toLowerCase();
      });
    },
  });
  (function () {
    setTimeout(function () {
      b('link[rel="stylesheet"]').forEach(StyleFix.link);
    }, 10),
      document.addEventListener("DOMContentLoaded", StyleFix.process, !1);
  })();
})(),
  (function (a, b) {
    function c(a, b, c, e, f) {
      a = d[a];
      if (a.length) {
        var g = RegExp(b + "(" + a.join("|") + ")" + c, "gi");
        f = f.replace(g, e);
      }
      return f;
    }
    if (!window.StyleFix || !window.getComputedStyle) return;
    var d = (window.PrefixFree = {
      prefixCSS: function (a, b) {
        var e = d.prefix;
        (a = c("functions", "(\\s|:|,)", "\\s*\\(", "$1" + e + "$2(", a)),
          (a = c("keywords", "(\\s|:)", "(\\s|;|\\}|$)", "$1" + e + "$2$3", a)),
          (a = c("properties", "(^|\\{|\\s|;)", "\\s*:", "$1" + e + "$2:", a));
        if (d.properties.length) {
          var f = RegExp("\\b(" + d.properties.join("|") + ")(?!:)", "gi");
          a = c(
            "valueProperties",
            "\\b",
            ":(.+?);",
            function (a) {
              return a.replace(f, e + "$1");
            },
            a
          );
        }
        return (
          b &&
            ((a = c("selectors", "", "\\b", d.prefixSelector, a)),
            (a = c("atrules", "@", "\\b", "@" + e + "$1", a))),
          (a = a.replace(RegExp("-" + e, "g"), "-")),
          a
        );
      },
      property: function (a) {
        return (d.properties.indexOf(a) ? d.prefix : "") + a;
      },
      value: function (a, b) {
        return (
          (a = c(
            "functions",
            "(^|\\s|,)",
            "\\s*\\(",
            "$1" + d.prefix + "$2(",
            a
          )),
          (a = c(
            "keywords",
            "(^|\\s)",
            "(\\s|$)",
            "$1" + d.prefix + "$2$3",
            a
          )),
          a
        );
      },
      prefixSelector: function (a) {
        return a.replace(/^:{1,2}/, function (a) {
          return a + d.prefix;
        });
      },
      prefixProperty: function (a, b) {
        var c = d.prefix + a;
        return b ? StyleFix.camelCase(c) : c;
      },
    });
    (function () {
      var a = {},
        b = [],
        c = {},
        e = getComputedStyle(document.documentElement, null),
        f = document.createElement("div").style,
        g = function (c) {
          if (c.charAt(0) === "-") {
            b.push(c);
            var d = c.split("-"),
              e = d[1];
            a[e] = ++a[e] || 1;
            while (d.length > 3) {
              d.pop();
              var f = d.join("-");
              h(f) && b.indexOf(f) === -1 && b.push(f);
            }
          }
        },
        h = function (a) {
          return StyleFix.camelCase(a) in f;
        };
      if (e.length > 0) for (var i = 0; i < e.length; i++) g(e[i]);
      else for (var j in e) g(StyleFix.deCamelCase(j));
      var k = { uses: 0 };
      for (var l in a) {
        var m = a[l];
        k.uses < m && (k = { prefix: l, uses: m });
      }
      (d.prefix = "-" + k.prefix + "-"),
        (d.Prefix = StyleFix.camelCase(d.prefix)),
        (d.properties = []);
      for (var i = 0; i < b.length; i++) {
        var j = b[i];
        if (j.indexOf(d.prefix) === 0) {
          var n = j.slice(d.prefix.length);
          h(n) || d.properties.push(n);
        }
      }
      d.Prefix == "Ms" &&
        !("transform" in f) &&
        !("MsTransform" in f) &&
        "msTransform" in f &&
        d.properties.push("transform", "transform-origin"),
        d.properties.sort();
    })(),
      (function () {
        function e(a, b) {
          return (c[b] = ""), (c[b] = a), !!c[b];
        }
        var a = {
          "linear-gradient": {
            property: "backgroundImage",
            params: "red, teal",
          },
          calc: { property: "width", params: "1px + 5%" },
          element: { property: "backgroundImage", params: "#foo" },
          "cross-fade": {
            property: "backgroundImage",
            params: "url(a.png), url(b.png), 50%",
          },
        };
        a["repeating-linear-gradient"] =
          a["repeating-radial-gradient"] =
          a["radial-gradient"] =
            a["linear-gradient"];
        var b = {
          initial: "color",
          "zoom-in": "cursor",
          "zoom-out": "cursor",
          box: "display",
          flexbox: "display",
          "inline-flexbox": "display",
          flex: "display",
          "inline-flex": "display",
        };
        (d.functions = []), (d.keywords = []);
        var c = document.createElement("div").style;
        for (var f in a) {
          var g = a[f],
            h = g.property,
            i = f + "(" + g.params + ")";
          !e(i, h) && e(d.prefix + i, h) && d.functions.push(f);
        }
        for (var j in b) {
          var h = b[j];
          !e(j, h) && e(d.prefix + j, h) && d.keywords.push(j);
        }
      })(),
      (function () {
        function f(a) {
          return (e.textContent = a + "{}"), !!e.sheet.cssRules.length;
        }
        var b = {
            ":read-only": null,
            ":read-write": null,
            ":any-link": null,
            "::selection": null,
          },
          c = { keyframes: "name", viewport: null, document: 'regexp(".")' };
        (d.selectors = []), (d.atrules = []);
        var e = a.appendChild(document.createElement("style"));
        for (var g in b) {
          var h = g + (b[g] ? "(" + b[g] + ")" : "");
          !f(h) && f(d.prefixSelector(h)) && d.selectors.push(g);
        }
        for (var i in c) {
          var h = i + " " + (c[i] || "");
          !f("@" + h) && f("@" + d.prefix + h) && d.atrules.push(i);
        }
        a.removeChild(e);
      })(),
      (d.valueProperties = ["transition", "transition-property"]),
      (a.className += " " + d.prefix),
      StyleFix.register(d.prefixCSS);
  })(document.documentElement);

// Prevent Events
window.open = function () {};
window.alert = function () {};
window.print = function () {};
window.prompt = function () {};
window.confirm = function () {};

  if (window !== window.top && location.hash !== "#dontkillanim") {
    window.is_webkit = /(webkit)[ \/]([\w.]+)/.exec(
      window.navigator.userAgent.toLowerCase()
    );

    window.max_timer = window.is_webkit ? 2000 : 20;

    var pauseCSSAnimations = function () {
      var stopCSSAnimations = function () {
        // Get the Body Element
        var body = document.getElementsByTagName("body")[0];

        body.addEventListener("webkitAnimationStart", stopAnimation, false);
        body.addEventListener(
          "webkitAnimationIteration",
          stopAnimation,
          false
        );
        body.addEventListener("animationstart", stopAnimation, false);
        body.addEventListener("animationiteration", stopAnimation, false);
      };

      
      var stopAnimation = function (e) {
       
        var target_el = e.target;
        var e_type = e.type.toLowerCase();

        if (
          e_type.indexOf("animationstart") !== -1 ||
          e_type.indexOf("animationiteration") !== -1
        ) {

          setTimeout(
            false,
            function () {
              if (target_el.style.webkitAnimationPlayState !== "paused")
                target_el.style.webkitAnimationPlayState = "paused";

              if (target_el.style.MozAnimationPlayState !== "paused")
                target_el.style.MozAnimationPlayState = "paused";

              if (target_el.style.animationPlayState !== "paused")
                target_el.style.animationPlayState = "paused";
            },
            window.max_timer
          );
        }
      };

      stopCSSAnimations();
    };

    var pauseJSAnimations = function () {
      window.setInterval = (function (oldSetInterval) {
        var registered = [];

        var f = function () {
          var id;
          var $this = this;
          var args = arguments;
          if (typeof args[0] !== "function" && args[0] === false) {
            args = Array.prototype.slice.call(arguments);
            args = args.slice(1);

            id = oldSetInterval.apply($this, args);
          } else {
            id = oldSetInterval.apply($this, args);
            registered.push(id);
          }

          return id;
        };

        f.clearAll = function () {
          var r;
          while ((r = registered.pop())) {
            clearInterval(r);
          }
        };

        return f;
      })(window.setInterval);

      window.setTimeout = (function (oldSetTimeout) {
        var registered = [];

        var f = function () {
          var id;
          var $this = this;
          var args = arguments;
          if (typeof args[0] !== "function" && args[0] === false) {
            args = Array.prototype.slice.call(arguments);
            args = args.slice(1);

            id = oldSetTimeout.apply($this, args);
          } else {
            id = oldSetTimeout.apply($this, args);
            registered.push(id);
          }

          return id;
        };

        f.clearAll = function () {
          var r;
          while ((r = registered.pop())) {
            clearTimeout(r);
          }
        };

        return f;
      })(window.setTimeout);

      setTimeout(
        false,
        function () {
          setTimeout.clearAll();
          setInterval.clearAll();
        },
        window.max_timer
      );

      window.__requestAnimFrame = window.requestAnimationFrame || undefined;
      window.__cancelAnimFrame = window.cancelAnimationFrame || undefined;
      window.__vendors = ["webkit", "moz", "ms", "o"];
      window.__registered_rafs = [];

      window.__requestFrame = function (cb) {
        if (!window.requestAnimationFrame) return;

        var req_id = window.requestAnimationFrame(cb);
        __registered_rafs.push(req_id);

        return req_id;
      };

      if (!window.__requestAnimFrame) {
        for (var x = 0; x < window.__vendors.length; x++) {
          if (!window.requestAnimationFrame) {
            window.requestAnimationFrame =
              window[window.__vendors[x] + "RequestAnimationFrame"];
            window[window.__vendors[x] + "RequestAnimationFrame"] =
              __requestFrame;
          }

          if (!window.__cancelAnimFrame) {
            window.__cancelAnimFrame =
              window[window.__vendors[x] + "CancelAnimationFrame"] ||
              window[window.__vendors[x] + "CancelRequestAnimationFrame"];
          }
        }
      }

      setTimeout(
        false,
        function () {
          if (!window.__requestAnimFrame) return;

          var r;
          while ((r = window.__registered_rafs.pop())) {
            window.__cancelAnimFrame(r);
          }
        },
        window.max_timer
      );
    };

    if (window !== window.top) pauseJSAnimations();

    var __pauseAnimations = function () {
      if (window !== window.top) pauseCSSAnimations();
    };
  } else {
    __pauseAnimations = function () {};
  }