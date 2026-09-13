export const dynamic = "force-dynamic";

function getEnvironment() {
  return process.env.VERCEL_ENV ?? null;
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const keyPresence = {
    hasPublishableKey: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    ),
    hasSecretKey: Boolean(process.env.SUPABASE_SECRET_KEY),
  };

  if (!supabaseUrl) {
    return Response.json(
      {
        environment: getEnvironment(),
        ...keyPresence,
        error: "NEXT_PUBLIC_SUPABASE_URL is not configured.",
      },
      { status: 500 },
    );
  }

  try {
    return Response.json({
      environment: getEnvironment(),
      supabaseHost: new URL(supabaseUrl).hostname,
      ...keyPresence,
    });
  } catch {
    return Response.json(
      {
        environment: getEnvironment(),
        ...keyPresence,
        error: "NEXT_PUBLIC_SUPABASE_URL is invalid.",
      },
      { status: 500 },
    );
  }
}
