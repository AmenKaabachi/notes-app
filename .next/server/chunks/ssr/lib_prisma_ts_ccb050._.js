module.exports = {

"[project]/lib/prisma.ts [app-rsc] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "prisma": ()=>prisma
});
var __TURBOPACK__commonjs__external__$40$prisma$2f$client__ = __turbopack_external_require__("@prisma/client", true);
var __TURBOPACK__commonjs__external__$40$prisma$2f$extension$2d$accelerate__ = __turbopack_external_require__("@prisma/extension-accelerate", true);
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
const globalForPrisma = globalThis;
function createPrismaClient() {
    // Determine log levels based on environment variables
    let devLogs = [
        'error'
    ]; // Default fallback
    if ("TURBOPACK compile-time truthy", 1) {
        if (process.env.PRISMA_LOG_LEVEL === 'verbose') {
            devLogs = [
                'query',
                'warn',
                'error'
            ];
            console.log('🔍 Prisma logging: VERBOSE mode (queries + warnings + errors)');
        } else {
            // 'basic' or any other value = no queries, just warnings and errors
            devLogs = [
                'warn',
                'error'
            ];
            console.log('🎯 Prisma logging: BASIC mode (warnings + errors only)');
        }
    } else {
        "TURBOPACK unreachable";
    }
    return new __TURBOPACK__commonjs__external__$40$prisma$2f$client__["PrismaClient"]({
        log: devLogs
    }).$extends((0, __TURBOPACK__commonjs__external__$40$prisma$2f$extension$2d$accelerate__["withAccelerate"])());
}
const prisma = globalForPrisma.prisma ?? createPrismaClient();
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = prisma;

})()),

};

//# sourceMappingURL=lib_prisma_ts_ccb050._.js.map