module.exports = {

"[project]/lib/auth.ts [app-route] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "auth": ()=>auth,
    "handlers": ()=>handlers,
    "signIn": ()=>signIn,
    "signOut": ()=>signOut
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_import__("[project]/node_modules/next-auth/index.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_import__("[project]/node_modules/next-auth/index.js [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_import__("[project]/node_modules/next-auth/providers/credentials.js [app-route] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/@auth/core/providers/credentials.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
;
// Base configuration that works in Edge Runtime (middleware)
const baseConfig = {
    providers: [
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$auth$2f$core$2f$providers$2f$credentials$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"])({
            name: 'credentials',
            credentials: {
                email: {
                    label: 'Email',
                    type: 'email'
                },
                password: {
                    label: 'Password',
                    type: 'password'
                }
            },
            async authorize (credentials) {
                // Import prisma only when needed (in Node.js runtime)
                if (typeof window !== 'undefined') return null;
                try {
                    const { prisma } = await __turbopack_require__("[project]/lib/prisma.ts [app-route] (ecmascript, async loader)")(__turbopack_import__);
                    if (!credentials?.email || !credentials?.password) {
                        return null;
                    }
                    const user = await prisma.user.findUnique({
                        where: {
                            email: credentials.email
                        }
                    });
                    if (!user) {
                        return null;
                    }
                    const isPasswordValid = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].compare(credentials.password, user.password);
                    if (!isPasswordValid) {
                        return null;
                    }
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            }
        })
    ],
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt ({ token, user }) {
            if (user) {
                return {
                    ...token,
                    id: user.id
                };
            }
            return token;
        },
        async session ({ session, token }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id
                }
            };
        }
    }
};
const { handlers, auth, signIn, signOut } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$auth$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["default"])(baseConfig);

})()),
"[project]/lib/prisma.ts [app-route] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
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
"[project]/app/api/notes/route.ts [app-route] (ecmascript)": (({ r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__ }) => (() => {
"use strict";

__turbopack_esm__({
    "GET": ()=>GET,
    "POST": ()=>POST
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/lib/prisma.ts [app-route] (ecmascript)");
"__TURBOPACK__ecmascript__hoisting__location__";
;
;
;
async function GET(request) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
        if (!session?.user?.id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const notes = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].note.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                category: true,
                noteTags: {
                    include: {
                        tag: true
                    }
                }
            },
            orderBy: [
                {
                    isPinned: 'desc'
                },
                {
                    order: 'asc'
                },
                {
                    updatedAt: 'desc'
                }
            ]
        });
        // Transform the data to match the expected format
        const transformedNotes = notes.map((note)=>({
                id: note.id,
                title: note.title,
                content: note.content,
                category: note.category?.name || '',
                tags: note.noteTags.map((nt)=>nt.tag.name),
                createdAt: note.createdAt,
                updatedAt: note.updatedAt,
                isPinned: note.isPinned,
                order: note.order,
                categoryId: note.categoryId,
                userId: note.userId
            }));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(transformedNotes);
    } catch (error) {
        console.error('Error fetching notes:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const session = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["auth"])();
        if (!session?.user?.id) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Unauthorized'
            }, {
                status: 401
            });
        }
        const { title, content, category, tags, isPinned } = await request.json();
        if (!title || !content) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Title and content are required'
            }, {
                status: 400
            });
        }
        // Get the maximum order value for this user's notes
        const maxOrderNote = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].note.findFirst({
            where: {
                userId: session.user.id
            },
            orderBy: {
                order: 'desc'
            }
        });
        const nextOrder = (maxOrderNote?.order ?? -1) + 1;
        // Create or find category
        let categoryRecord = null;
        if (category) {
            categoryRecord = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].category.upsert({
                where: {
                    name_userId: {
                        name: category,
                        userId: session.user.id
                    }
                },
                create: {
                    name: category,
                    userId: session.user.id
                },
                update: {}
            });
        }
        // Create note
        const note = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].note.create({
            data: {
                title,
                content,
                isPinned: isPinned || false,
                order: nextOrder,
                userId: session.user.id,
                categoryId: categoryRecord?.id
            },
            include: {
                category: true,
                noteTags: {
                    include: {
                        tag: true
                    }
                }
            }
        });
        // Handle tags
        if (tags && Array.isArray(tags)) {
            for (const tagName of tags){
                // Create or find tag
                const tag = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].tag.upsert({
                    where: {
                        name_userId: {
                            name: tagName,
                            userId: session.user.id
                        }
                    },
                    create: {
                        name: tagName,
                        userId: session.user.id
                    },
                    update: {}
                });
                // Create note-tag relationship
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].noteTag.create({
                    data: {
                        noteId: note.id,
                        tagId: tag.id
                    }
                });
            }
        }
        // Fetch the complete note with relationships
        const completeNote = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$prisma$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].note.findUnique({
            where: {
                id: note.id
            },
            include: {
                category: true,
                noteTags: {
                    include: {
                        tag: true
                    }
                }
            }
        });
        // Transform the data
        const transformedNote = {
            id: completeNote.id,
            title: completeNote.title,
            content: completeNote.content,
            category: completeNote.category?.name || '',
            tags: completeNote.noteTags.map((nt)=>nt.tag.name),
            createdAt: completeNote.createdAt,
            updatedAt: completeNote.updatedAt,
            isPinned: completeNote.isPinned,
            order: completeNote.order,
            categoryId: completeNote.categoryId,
            userId: completeNote.userId
        };
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(transformedNote, {
            status: 201
        });
    } catch (error) {
        console.error('Error creating note:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Internal server error'
        }, {
            status: 500
        });
    }
}

})()),

};

//# sourceMappingURL=_55e142._.js.map