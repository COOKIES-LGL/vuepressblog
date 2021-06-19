exports.id = 958;
exports.ids = [958];
exports.modules = {

/***/ 495:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ _404)
});

// EXTERNAL MODULE: external "vue"
var external_vue_ = __webpack_require__(103);
// EXTERNAL MODULE: external "@vue/server-renderer"
var server_renderer_ = __webpack_require__(745);
;// CONCATENATED MODULE: ./node_modules/vue-loader/dist/templateLoader.js??ruleSet[1].rules[1]!./node_modules/@vuepress/bundler-webpack/lib/build/ssr/vuepressLoader.js!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./node_modules/@vuepress/theme-default/lib/client/layouts/404.vue?vue&type=template&id=996641c0



function ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_RouterLink = (0,external_vue_.resolveComponent)("RouterLink")

  _push(`<div${
    (0,server_renderer_.ssrRenderAttrs)((0,external_vue_.mergeProps)({ class: "theme-container" }, _attrs))
  }><div class="theme-default-content"><h1>404</h1><blockquote>${
    (0,server_renderer_.ssrInterpolate)(_ctx.getMsg())
  }</blockquote>`)
  _push((0,server_renderer_.ssrRenderComponent)(_component_RouterLink, { to: _ctx.homeLink }, {
    default: (0,external_vue_.withCtx)((_, _push, _parent, _scopeId) => {
      if (_push) {
        _push(`${(0,server_renderer_.ssrInterpolate)(_ctx.homeText)}`)
      } else {
        return [
          (0,external_vue_.createTextVNode)((0,external_vue_.toDisplayString)(_ctx.homeText), 1)
        ]
      }
    }),
    _: 1
  }, _parent))
  _push(`</div></div>`)
}
;// CONCATENATED MODULE: ./node_modules/@vuepress/theme-default/lib/client/layouts/404.vue?vue&type=template&id=996641c0

// EXTERNAL MODULE: ./node_modules/@vuepress/client/lib/index.js
var lib = __webpack_require__(621);
// EXTERNAL MODULE: ./node_modules/@vuepress/theme-default/lib/client/composables/index.js + 6 modules
var composables = __webpack_require__(319);
;// CONCATENATED MODULE: ./node_modules/esbuild-loader/dist/index.js??clonedRuleSet-30.use[0]!./node_modules/@vuepress/bundler-webpack/lib/build/ssr/vuepressLoader.js!./node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!./node_modules/@vuepress/theme-default/lib/client/layouts/404.vue?vue&type=script&lang=ts



/* harmony default export */ const _404vue_type_script_lang_ts = ((0,external_vue_.defineComponent)({
  name: "404",
  setup() {
    var _a, _b, _c;
    const routeLocale = (0,lib/* useRouteLocale */.I)();
    const themeLocale = (0,composables/* useThemeLocaleData */.X6)();
    const messages = (_a = themeLocale.value.notFound) != null ? _a : ["Not Found"];
    const getMsg = () => messages[Math.floor(Math.random() * messages.length)];
    const homeLink = (_b = themeLocale.value.home) != null ? _b : routeLocale.value;
    const homeText = (_c = themeLocale.value.backToHome) != null ? _c : "Back to home";
    return {
      getMsg,
      homeLink,
      homeText
    };
  }
}));

;// CONCATENATED MODULE: ./node_modules/@vuepress/theme-default/lib/client/layouts/404.vue?vue&type=script&lang=ts
 
;// CONCATENATED MODULE: ./node_modules/@vuepress/theme-default/lib/client/layouts/404.vue



;
_404vue_type_script_lang_ts.ssrRender = (...args) => {
  const ssrContext = args[2].appContext.provides[external_vue_.ssrContextKey]
  ssrContext._registeredComponents.add("/Users/guilinli/private/project/BlogSite/vuepress@next/node_modules/@vuepress/bundler-webpack/lib/build/ssr/vuepressLoader.js!/Users/guilinli/private/project/BlogSite/vuepress@next/node_modules/vue-loader/dist/index.js??ruleSet[0].use[1]!/Users/guilinli/private/project/BlogSite/vuepress@next/node_modules/@vuepress/theme-default/lib/client/layouts/404.vue")
  return ssrRender(...args)
}


/* harmony default export */ const _404 = (_404vue_type_script_lang_ts);

/***/ })

};
;
//# sourceMappingURL=958.app.js.map