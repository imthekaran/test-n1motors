import { revalidatePath } from 'next/cache';
import { clearCache } from '@/lib/vehicles';

/**
 * POST /api/revalidate
 * 
 * Webhook endpoint for on-demand ISR (Incremental Static Regeneration)
 * 
 * This endpoint allows external systems (like your XML CMS) to trigger
 * automatic cache invalidation and page revalidation when vehicle data changes.
 * 
 * Usage:
 * POST /api/revalidate
 * Body: { "secret": "your_webhook_secret_here" }
 * 
 * Environment variable required:
 * WEBHOOK_SECRET - Set in your .env.local file for security
 */
export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const { secret } = body;

    // Verify webhook secret for security
    // This prevents unauthorized cache invalidation
    const webhookSecret = process.env.WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.warn('[ISR] WEBHOOK_SECRET not configured');
      return new Response(
        JSON.stringify({ error: 'Webhook not configured' }),
        { status: 500 }
      );
    }

    if (secret !== webhookSecret) {
      console.warn('[ISR] Invalid webhook secret received');
      return new Response(
        JSON.stringify({ error: 'Invalid secret' }),
        { status: 401 }
      );
    }

    console.log('[ISR] Webhook received - Starting revalidation');

    // Clear in-memory cache
    clearCache();

    // Revalidate the vehicles listing page
    // This triggers Next.js to regenerate the page on next request
    revalidatePath('/vehicles');
    console.log('[ISR] Revalidated: /vehicles');

    // Revalidate manufacturer pages
    revalidatePath('/vehicles/[manufacturer]', 'page');
    console.log('[ISR] Revalidated: /vehicles/[manufacturer]');

    // Revalidate model pages
    revalidatePath('/vehicles/[manufacturer]/[model]', 'page');
    console.log('[ISR] Revalidated: /vehicles/[manufacturer]/[model]');

    // Revalidate all vehicle detail pages
    // The 'page' type tells Next.js to revalidate page routes (not API routes)
    revalidatePath('/vehicles/[manufacturer]/[model]/[id]', 'page');
    console.log('[ISR] Revalidated: /vehicles/[manufacturer]/[model]/[id]');

    return new Response(
      JSON.stringify({
        revalidated: true,
        message: 'Vehicles cache cleared and pages marked for revalidation',
        timestamp: new Date().toISOString(),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('[ISR] Revalidate endpoint error:', error);
    return new Response(
      JSON.stringify({ error: 'Revalidation failed' }),
      { status: 500 }
    );
  }
}
