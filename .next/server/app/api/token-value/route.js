/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/token-value/route";
exports.ids = ["app/api/token-value/route"];
exports.modules = {

/***/ "(rsc)/./app/api/token-value/route.js":
/*!**************************************!*\
  !*** ./app/api/token-value/route.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var _supabase_supabase_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @supabase/supabase-js */ \"(rsc)/./node_modules/@supabase/supabase-js/dist/module/index.js\");\n/* harmony import */ var _lib_rateLimitConfig__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @/lib/rateLimitConfig */ \"(rsc)/./lib/rateLimitConfig.js\");\n\n\nconst supabase = (0,_supabase_supabase_js__WEBPACK_IMPORTED_MODULE_1__.createClient)(\"https://udarguklgjjlfnlsqdfw.supabase.co\", \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVkYXJndWtsZ2pqbGZubHNxZGZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MDQ0NzcsImV4cCI6MjA1NzI4MDQ3N30.jImV4Q1yRIsSFqn-R9u_wbk5gWMPLl8kSPJNYTX-5-E\");\nasync function GET(req) {\n    const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown';\n    const endpoint = '/api/token-value';\n    // Registrar la petición\n    await supabase.from('api_requests').insert({\n        ip,\n        endpoint\n    });\n    // Contar peticiones recientes\n    const since = new Date(Date.now() - _lib_rateLimitConfig__WEBPACK_IMPORTED_MODULE_0__.RATE_LIMIT_WINDOW_MS).toISOString();\n    const { count, error: countError } = await supabase.from('api_requests').select('*', {\n        count: 'exact',\n        head: true\n    }).eq('ip', ip).eq('endpoint', endpoint).gte('created_at', since);\n    if (countError) {\n        console.error('Rate check error:', countError.message);\n        return new Response(JSON.stringify({\n            error: 'Rate check failed'\n        }), {\n            status: 500,\n            headers: {\n                'Content-Type': 'application/json',\n                ...(0,_lib_rateLimitConfig__WEBPACK_IMPORTED_MODULE_0__.getRateLimitHeaders)(count ?? 0)\n            }\n        });\n    }\n    if (count >= _lib_rateLimitConfig__WEBPACK_IMPORTED_MODULE_0__.RATE_LIMIT_MAX) {\n        return new Response(JSON.stringify({\n            error: 'Rate limit exceeded. Try again later.'\n        }), {\n            status: 429,\n            headers: {\n                'Content-Type': 'application/json',\n                ...(0,_lib_rateLimitConfig__WEBPACK_IMPORTED_MODULE_0__.getRateLimitHeaders)(count)\n            }\n        });\n    }\n    // Query del valor del token\n    const { data, error } = await supabase.from('token_value_timeseries').select('cumulative_reward, hour').order('hour', {\n        ascending: false\n    }).limit(1);\n    if (error || !data || data.length === 0) {\n        return new Response(JSON.stringify({\n            error: 'Token value not available.'\n        }), {\n            status: 500,\n            headers: {\n                'Content-Type': 'application/json',\n                ...(0,_lib_rateLimitConfig__WEBPACK_IMPORTED_MODULE_0__.getRateLimitHeaders)(count)\n            }\n        });\n    }\n    // Respuesta con caché\n    return new Response(JSON.stringify({\n        value: parseFloat(data[0].cumulative_reward),\n        updatedAt: data[0].hour\n    }), {\n        headers: {\n            'Content-Type': 'application/json',\n            'Cache-Control': 'public, s-maxage=60',\n            ...(0,_lib_rateLimitConfig__WEBPACK_IMPORTED_MODULE_0__.getRateLimitHeaders)(count + 1)\n        }\n    });\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL3Rva2VuLXZhbHVlL3JvdXRlLmpzIiwibWFwcGluZ3MiOiI7Ozs7OztBQUFvRDtBQUt0QjtBQUU5QixNQUFNSSxXQUFXSixtRUFBWUEsQ0FDM0JLLDBDQUFvQyxFQUNwQ0Esa05BQXlDO0FBR3BDLGVBQWVJLElBQUlDLEdBQUc7SUFDM0IsTUFBTUMsS0FDSkQsSUFBSUUsT0FBTyxDQUFDQyxHQUFHLENBQUMsc0JBQXNCSCxJQUFJRSxPQUFPLENBQUNDLEdBQUcsQ0FBQyxnQkFBZ0I7SUFDeEUsTUFBTUMsV0FBVztJQUVqQix3QkFBd0I7SUFDeEIsTUFBTVYsU0FBU1csSUFBSSxDQUFDLGdCQUFnQkMsTUFBTSxDQUFDO1FBQUVMO1FBQUlHO0lBQVM7SUFFMUQsOEJBQThCO0lBQzlCLE1BQU1HLFFBQVEsSUFBSUMsS0FBS0EsS0FBS0MsR0FBRyxLQUFLakIsc0VBQW9CQSxFQUFFa0IsV0FBVztJQUVyRSxNQUFNLEVBQUVDLEtBQUssRUFBRUMsT0FBT0MsVUFBVSxFQUFFLEdBQUcsTUFBTW5CLFNBQ3hDVyxJQUFJLENBQUMsZ0JBQ0xTLE1BQU0sQ0FBQyxLQUFLO1FBQUVILE9BQU87UUFBU0ksTUFBTTtJQUFLLEdBQ3pDQyxFQUFFLENBQUMsTUFBTWYsSUFDVGUsRUFBRSxDQUFDLFlBQVlaLFVBQ2ZhLEdBQUcsQ0FBQyxjQUFjVjtJQUVyQixJQUFJTSxZQUFZO1FBQ2RLLFFBQVFOLEtBQUssQ0FBQyxxQkFBcUJDLFdBQVdNLE9BQU87UUFDckQsT0FBTyxJQUFJQyxTQUFTQyxLQUFLQyxTQUFTLENBQUM7WUFBRVYsT0FBTztRQUFvQixJQUFJO1lBQ2xFVyxRQUFRO1lBQ1JyQixTQUFTO2dCQUNQLGdCQUFnQjtnQkFDaEIsR0FBR1QseUVBQW1CQSxDQUFDa0IsU0FBUyxFQUFFO1lBQ3BDO1FBQ0Y7SUFDRjtJQUVBLElBQUlBLFNBQVNwQixnRUFBY0EsRUFBRTtRQUMzQixPQUFPLElBQUk2QixTQUFTQyxLQUFLQyxTQUFTLENBQUM7WUFBRVYsT0FBTztRQUF3QyxJQUFJO1lBQ3RGVyxRQUFRO1lBQ1JyQixTQUFTO2dCQUNQLGdCQUFnQjtnQkFDaEIsR0FBR1QseUVBQW1CQSxDQUFDa0IsTUFBTTtZQUMvQjtRQUNGO0lBQ0Y7SUFFQSw0QkFBNEI7SUFDNUIsTUFBTSxFQUFFYSxJQUFJLEVBQUVaLEtBQUssRUFBRSxHQUFHLE1BQU1sQixTQUMzQlcsSUFBSSxDQUFDLDBCQUNMUyxNQUFNLENBQUMsMkJBQ1BXLEtBQUssQ0FBQyxRQUFRO1FBQUVDLFdBQVc7SUFBTSxHQUNqQ0MsS0FBSyxDQUFDO0lBRVQsSUFBSWYsU0FBUyxDQUFDWSxRQUFRQSxLQUFLSSxNQUFNLEtBQUssR0FBRztRQUN2QyxPQUFPLElBQUlSLFNBQVNDLEtBQUtDLFNBQVMsQ0FBQztZQUFFVixPQUFPO1FBQTZCLElBQUk7WUFDM0VXLFFBQVE7WUFDUnJCLFNBQVM7Z0JBQ1AsZ0JBQWdCO2dCQUNoQixHQUFHVCx5RUFBbUJBLENBQUNrQixNQUFNO1lBQy9CO1FBQ0Y7SUFDRjtJQUVBLHNCQUFzQjtJQUN0QixPQUFPLElBQUlTLFNBQ1RDLEtBQUtDLFNBQVMsQ0FBQztRQUNiTyxPQUFPQyxXQUFXTixJQUFJLENBQUMsRUFBRSxDQUFDTyxpQkFBaUI7UUFDM0NDLFdBQVdSLElBQUksQ0FBQyxFQUFFLENBQUNTLElBQUk7SUFDekIsSUFDQTtRQUNFL0IsU0FBUztZQUNQLGdCQUFnQjtZQUNoQixpQkFBaUI7WUFDakIsR0FBR1QseUVBQW1CQSxDQUFDa0IsUUFBUSxFQUFFO1FBQ25DO0lBQ0Y7QUFFSiIsInNvdXJjZXMiOlsiL2hvbWUvY3JnL01hdGhzTWluZTMvYXBwL2FwaS90b2tlbi12YWx1ZS9yb3V0ZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjcmVhdGVDbGllbnQgfSBmcm9tICdAc3VwYWJhc2Uvc3VwYWJhc2UtanMnXG5pbXBvcnQge1xuICBSQVRFX0xJTUlUX01BWCxcbiAgUkFURV9MSU1JVF9XSU5ET1dfTVMsXG4gIGdldFJhdGVMaW1pdEhlYWRlcnNcbn0gZnJvbSAnQC9saWIvcmF0ZUxpbWl0Q29uZmlnJ1xuXG5jb25zdCBzdXBhYmFzZSA9IGNyZWF0ZUNsaWVudChcbiAgcHJvY2Vzcy5lbnYuTkVYVF9QVUJMSUNfU1VQQUJBU0VfVVJMLFxuICBwcm9jZXNzLmVudi5ORVhUX1BVQkxJQ19TVVBBQkFTRV9BTk9OX0tFWVxuKVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gR0VUKHJlcSkge1xuICBjb25zdCBpcCA9XG4gICAgcmVxLmhlYWRlcnMuZ2V0KCd4LWZvcndhcmRlZC1mb3InKSA/PyByZXEuaGVhZGVycy5nZXQoJ3gtcmVhbC1pcCcpID8/ICd1bmtub3duJ1xuICBjb25zdCBlbmRwb2ludCA9ICcvYXBpL3Rva2VuLXZhbHVlJ1xuXG4gIC8vIFJlZ2lzdHJhciBsYSBwZXRpY2nDs25cbiAgYXdhaXQgc3VwYWJhc2UuZnJvbSgnYXBpX3JlcXVlc3RzJykuaW5zZXJ0KHsgaXAsIGVuZHBvaW50IH0pXG5cbiAgLy8gQ29udGFyIHBldGljaW9uZXMgcmVjaWVudGVzXG4gIGNvbnN0IHNpbmNlID0gbmV3IERhdGUoRGF0ZS5ub3coKSAtIFJBVEVfTElNSVRfV0lORE9XX01TKS50b0lTT1N0cmluZygpXG5cbiAgY29uc3QgeyBjb3VudCwgZXJyb3I6IGNvdW50RXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG4gICAgLmZyb20oJ2FwaV9yZXF1ZXN0cycpXG4gICAgLnNlbGVjdCgnKicsIHsgY291bnQ6ICdleGFjdCcsIGhlYWQ6IHRydWUgfSlcbiAgICAuZXEoJ2lwJywgaXApXG4gICAgLmVxKCdlbmRwb2ludCcsIGVuZHBvaW50KVxuICAgIC5ndGUoJ2NyZWF0ZWRfYXQnLCBzaW5jZSlcblxuICBpZiAoY291bnRFcnJvcikge1xuICAgIGNvbnNvbGUuZXJyb3IoJ1JhdGUgY2hlY2sgZXJyb3I6JywgY291bnRFcnJvci5tZXNzYWdlKVxuICAgIHJldHVybiBuZXcgUmVzcG9uc2UoSlNPTi5zdHJpbmdpZnkoeyBlcnJvcjogJ1JhdGUgY2hlY2sgZmFpbGVkJyB9KSwge1xuICAgICAgc3RhdHVzOiA1MDAsXG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgIC4uLmdldFJhdGVMaW1pdEhlYWRlcnMoY291bnQgPz8gMClcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgaWYgKGNvdW50ID49IFJBVEVfTElNSVRfTUFYKSB7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZShKU09OLnN0cmluZ2lmeSh7IGVycm9yOiAnUmF0ZSBsaW1pdCBleGNlZWRlZC4gVHJ5IGFnYWluIGxhdGVyLicgfSksIHtcbiAgICAgIHN0YXR1czogNDI5LFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAuLi5nZXRSYXRlTGltaXRIZWFkZXJzKGNvdW50KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvLyBRdWVyeSBkZWwgdmFsb3IgZGVsIHRva2VuXG4gIGNvbnN0IHsgZGF0YSwgZXJyb3IgfSA9IGF3YWl0IHN1cGFiYXNlXG4gICAgLmZyb20oJ3Rva2VuX3ZhbHVlX3RpbWVzZXJpZXMnKVxuICAgIC5zZWxlY3QoJ2N1bXVsYXRpdmVfcmV3YXJkLCBob3VyJylcbiAgICAub3JkZXIoJ2hvdXInLCB7IGFzY2VuZGluZzogZmFsc2UgfSlcbiAgICAubGltaXQoMSlcblxuICBpZiAoZXJyb3IgfHwgIWRhdGEgfHwgZGF0YS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKEpTT04uc3RyaW5naWZ5KHsgZXJyb3I6ICdUb2tlbiB2YWx1ZSBub3QgYXZhaWxhYmxlLicgfSksIHtcbiAgICAgIHN0YXR1czogNTAwLFxuICAgICAgaGVhZGVyczoge1xuICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxuICAgICAgICAuLi5nZXRSYXRlTGltaXRIZWFkZXJzKGNvdW50KVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvLyBSZXNwdWVzdGEgY29uIGNhY2jDqVxuICByZXR1cm4gbmV3IFJlc3BvbnNlKFxuICAgIEpTT04uc3RyaW5naWZ5KHtcbiAgICAgIHZhbHVlOiBwYXJzZUZsb2F0KGRhdGFbMF0uY3VtdWxhdGl2ZV9yZXdhcmQpLFxuICAgICAgdXBkYXRlZEF0OiBkYXRhWzBdLmhvdXJcbiAgICB9KSxcbiAgICB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vanNvbicsXG4gICAgICAgICdDYWNoZS1Db250cm9sJzogJ3B1YmxpYywgcy1tYXhhZ2U9NjAnLFxuICAgICAgICAuLi5nZXRSYXRlTGltaXRIZWFkZXJzKGNvdW50ICsgMSlcbiAgICAgIH1cbiAgICB9XG4gIClcbn1cbiJdLCJuYW1lcyI6WyJjcmVhdGVDbGllbnQiLCJSQVRFX0xJTUlUX01BWCIsIlJBVEVfTElNSVRfV0lORE9XX01TIiwiZ2V0UmF0ZUxpbWl0SGVhZGVycyIsInN1cGFiYXNlIiwicHJvY2VzcyIsImVudiIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX1VSTCIsIk5FWFRfUFVCTElDX1NVUEFCQVNFX0FOT05fS0VZIiwiR0VUIiwicmVxIiwiaXAiLCJoZWFkZXJzIiwiZ2V0IiwiZW5kcG9pbnQiLCJmcm9tIiwiaW5zZXJ0Iiwic2luY2UiLCJEYXRlIiwibm93IiwidG9JU09TdHJpbmciLCJjb3VudCIsImVycm9yIiwiY291bnRFcnJvciIsInNlbGVjdCIsImhlYWQiLCJlcSIsImd0ZSIsImNvbnNvbGUiLCJtZXNzYWdlIiwiUmVzcG9uc2UiLCJKU09OIiwic3RyaW5naWZ5Iiwic3RhdHVzIiwiZGF0YSIsIm9yZGVyIiwiYXNjZW5kaW5nIiwibGltaXQiLCJsZW5ndGgiLCJ2YWx1ZSIsInBhcnNlRmxvYXQiLCJjdW11bGF0aXZlX3Jld2FyZCIsInVwZGF0ZWRBdCIsImhvdXIiXSwiaWdub3JlTGlzdCI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./app/api/token-value/route.js\n");

/***/ }),

/***/ "(rsc)/./lib/rateLimitConfig.js":
/*!********************************!*\
  !*** ./lib/rateLimitConfig.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   RATE_LIMIT_MAX: () => (/* binding */ RATE_LIMIT_MAX),\n/* harmony export */   RATE_LIMIT_WINDOW_MS: () => (/* binding */ RATE_LIMIT_WINDOW_MS),\n/* harmony export */   RATE_LIMIT_WINDOW_SECONDS: () => (/* binding */ RATE_LIMIT_WINDOW_SECONDS),\n/* harmony export */   getRateLimitHeaders: () => (/* binding */ getRateLimitHeaders)\n/* harmony export */ });\nconst RATE_LIMIT_MAX = 10;\nconst RATE_LIMIT_WINDOW_SECONDS = 60;\nconst RATE_LIMIT_WINDOW_MS = RATE_LIMIT_WINDOW_SECONDS * 1000;\nfunction getRateLimitHeaders(countUsed) {\n    return {\n        'X-RateLimit-Limit': RATE_LIMIT_MAX,\n        'X-RateLimit-Remaining': Math.max(RATE_LIMIT_MAX - countUsed, 0),\n        'X-RateLimit-Reset': RATE_LIMIT_WINDOW_SECONDS\n    };\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvcmF0ZUxpbWl0Q29uZmlnLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBTyxNQUFNQSxpQkFBaUIsR0FBRTtBQUN6QixNQUFNQyw0QkFBNEIsR0FBRTtBQUNwQyxNQUFNQyx1QkFBdUJELDRCQUE0QixLQUFJO0FBRTdELFNBQVNFLG9CQUFvQkMsU0FBUztJQUMzQyxPQUFPO1FBQ0wscUJBQXFCSjtRQUNyQix5QkFBeUJLLEtBQUtDLEdBQUcsQ0FBQ04saUJBQWlCSSxXQUFXO1FBQzlELHFCQUFxQkg7SUFDdkI7QUFDRiIsInNvdXJjZXMiOlsiL2hvbWUvY3JnL01hdGhzTWluZTMvbGliL3JhdGVMaW1pdENvbmZpZy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgY29uc3QgUkFURV9MSU1JVF9NQVggPSAxMFxuZXhwb3J0IGNvbnN0IFJBVEVfTElNSVRfV0lORE9XX1NFQ09ORFMgPSA2MFxuZXhwb3J0IGNvbnN0IFJBVEVfTElNSVRfV0lORE9XX01TID0gUkFURV9MSU1JVF9XSU5ET1dfU0VDT05EUyAqIDEwMDBcblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJhdGVMaW1pdEhlYWRlcnMoY291bnRVc2VkKSB7XG4gIHJldHVybiB7XG4gICAgJ1gtUmF0ZUxpbWl0LUxpbWl0JzogUkFURV9MSU1JVF9NQVgsXG4gICAgJ1gtUmF0ZUxpbWl0LVJlbWFpbmluZyc6IE1hdGgubWF4KFJBVEVfTElNSVRfTUFYIC0gY291bnRVc2VkLCAwKSxcbiAgICAnWC1SYXRlTGltaXQtUmVzZXQnOiBSQVRFX0xJTUlUX1dJTkRPV19TRUNPTkRTXG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJSQVRFX0xJTUlUX01BWCIsIlJBVEVfTElNSVRfV0lORE9XX1NFQ09ORFMiLCJSQVRFX0xJTUlUX1dJTkRPV19NUyIsImdldFJhdGVMaW1pdEhlYWRlcnMiLCJjb3VudFVzZWQiLCJNYXRoIiwibWF4Il0sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./lib/rateLimitConfig.js\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ftoken-value%2Froute&page=%2Fapi%2Ftoken-value%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftoken-value%2Froute.js&appDir=%2Fhome%2Fcrg%2FMathsMine3%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fcrg%2FMathsMine3&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ftoken-value%2Froute&page=%2Fapi%2Ftoken-value%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftoken-value%2Froute.js&appDir=%2Fhome%2Fcrg%2FMathsMine3%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fcrg%2FMathsMine3&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D! ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   workAsyncStorage: () => (/* binding */ workAsyncStorage),\n/* harmony export */   workUnitAsyncStorage: () => (/* binding */ workUnitAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/route-kind */ \"(rsc)/./node_modules/next/dist/server/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _home_crg_MathsMine3_app_api_token_value_route_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/token-value/route.js */ \"(rsc)/./app/api/token-value/route.js\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"\"\nconst routeModule = new next_dist_server_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/token-value/route\",\n        pathname: \"/api/token-value\",\n        filename: \"route\",\n        bundlePath: \"app/api/token-value/route\"\n    },\n    resolvedPagePath: \"/home/crg/MathsMine3/app/api/token-value/route.js\",\n    nextConfigOutput,\n    userland: _home_crg_MathsMine3_app_api_token_value_route_js__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { workAsyncStorage, workUnitAsyncStorage, serverHooks } = routeModule;\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        workAsyncStorage,\n        workUnitAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIvaW5kZXguanM/bmFtZT1hcHAlMkZhcGklMkZ0b2tlbi12YWx1ZSUyRnJvdXRlJnBhZ2U9JTJGYXBpJTJGdG9rZW4tdmFsdWUlMkZyb3V0ZSZhcHBQYXRocz0mcGFnZVBhdGg9cHJpdmF0ZS1uZXh0LWFwcC1kaXIlMkZhcGklMkZ0b2tlbi12YWx1ZSUyRnJvdXRlLmpzJmFwcERpcj0lMkZob21lJTJGY3JnJTJGTWF0aHNNaW5lMyUyRmFwcCZwYWdlRXh0ZW5zaW9ucz10c3gmcGFnZUV4dGVuc2lvbnM9dHMmcGFnZUV4dGVuc2lvbnM9anN4JnBhZ2VFeHRlbnNpb25zPWpzJnJvb3REaXI9JTJGaG9tZSUyRmNyZyUyRk1hdGhzTWluZTMmaXNEZXY9dHJ1ZSZ0c2NvbmZpZ1BhdGg9dHNjb25maWcuanNvbiZiYXNlUGF0aD0mYXNzZXRQcmVmaXg9Jm5leHRDb25maWdPdXRwdXQ9JnByZWZlcnJlZFJlZ2lvbj0mbWlkZGxld2FyZUNvbmZpZz1lMzAlM0QhIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQStGO0FBQ3ZDO0FBQ3FCO0FBQ0M7QUFDOUU7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHlHQUFtQjtBQUMzQztBQUNBLGNBQWMsa0VBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxzREFBc0Q7QUFDOUQ7QUFDQSxXQUFXLDRFQUFXO0FBQ3RCO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDMEY7O0FBRTFGIiwic291cmNlcyI6WyIiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXBwUm91dGVSb3V0ZU1vZHVsZSB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL3JvdXRlLW1vZHVsZXMvYXBwLXJvdXRlL21vZHVsZS5jb21waWxlZFwiO1xuaW1wb3J0IHsgUm91dGVLaW5kIH0gZnJvbSBcIm5leHQvZGlzdC9zZXJ2ZXIvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIi9ob21lL2NyZy9NYXRoc01pbmUzL2FwcC9hcGkvdG9rZW4tdmFsdWUvcm91dGUuanNcIjtcbi8vIFdlIGluamVjdCB0aGUgbmV4dENvbmZpZ091dHB1dCBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSB0aGVtIGluIHRoZSByb3V0ZVxuLy8gbW9kdWxlLlxuY29uc3QgbmV4dENvbmZpZ091dHB1dCA9IFwiXCJcbmNvbnN0IHJvdXRlTW9kdWxlID0gbmV3IEFwcFJvdXRlUm91dGVNb2R1bGUoe1xuICAgIGRlZmluaXRpb246IHtcbiAgICAgICAga2luZDogUm91dGVLaW5kLkFQUF9ST1VURSxcbiAgICAgICAgcGFnZTogXCIvYXBpL3Rva2VuLXZhbHVlL3JvdXRlXCIsXG4gICAgICAgIHBhdGhuYW1lOiBcIi9hcGkvdG9rZW4tdmFsdWVcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL3Rva2VuLXZhbHVlL3JvdXRlXCJcbiAgICB9LFxuICAgIHJlc29sdmVkUGFnZVBhdGg6IFwiL2hvbWUvY3JnL01hdGhzTWluZTMvYXBwL2FwaS90b2tlbi12YWx1ZS9yb3V0ZS5qc1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHdvcmtBc3luY1N0b3JhZ2UsIHdvcmtVbml0QXN5bmNTdG9yYWdlLCBzZXJ2ZXJIb29rcyB9ID0gcm91dGVNb2R1bGU7XG5mdW5jdGlvbiBwYXRjaEZldGNoKCkge1xuICAgIHJldHVybiBfcGF0Y2hGZXRjaCh7XG4gICAgICAgIHdvcmtBc3luY1N0b3JhZ2UsXG4gICAgICAgIHdvcmtVbml0QXN5bmNTdG9yYWdlXG4gICAgfSk7XG59XG5leHBvcnQgeyByb3V0ZU1vZHVsZSwgd29ya0FzeW5jU3RvcmFnZSwgd29ya1VuaXRBc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sImlnbm9yZUxpc3QiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ftoken-value%2Froute&page=%2Fapi%2Ftoken-value%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftoken-value%2Froute.js&appDir=%2Fhome%2Fcrg%2FMathsMine3%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fcrg%2FMathsMine3&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "(ssr)/./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true!":
/*!******************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-flight-client-entry-loader.js?server=true! ***!
  \******************************************************************************************************/
/***/ (() => {



/***/ }),

/***/ "../app-render/work-async-storage.external":
/*!*****************************************************************************!*\
  !*** external "next/dist/server/app-render/work-async-storage.external.js" ***!
  \*****************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-async-storage.external.js");

/***/ }),

/***/ "./work-unit-async-storage.external":
/*!**********************************************************************************!*\
  !*** external "next/dist/server/app-render/work-unit-async-storage.external.js" ***!
  \**********************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/server/app-render/work-unit-async-storage.external.js");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("punycode");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/next","vendor-chunks/@supabase","vendor-chunks/tr46","vendor-chunks/whatwg-url","vendor-chunks/webidl-conversions"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader/index.js?name=app%2Fapi%2Ftoken-value%2Froute&page=%2Fapi%2Ftoken-value%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Ftoken-value%2Froute.js&appDir=%2Fhome%2Fcrg%2FMathsMine3%2Fapp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=%2Fhome%2Fcrg%2FMathsMine3&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();