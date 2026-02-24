import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isProtectedDashboard = createRouteMatcher(['/dashboard(.*)'])
const isProtectedAPI = createRouteMatcher(['/api(.*)'])
const isWebhook = createRouteMatcher(['/api/webhooks(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Protect dashboard routes - require authentication
  if (isProtectedDashboard(req)) {
    await auth.protect()
  }

  // Protect API routes except webhooks - require authentication
  if (isProtectedAPI(req) && !isWebhook(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
