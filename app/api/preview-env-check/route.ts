export const dynamic = "force-dynamic";

function getEnvironment() {
  return process.env.VERCEL_ENV ?? null;
}

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl) {
    return Response.json(
      {
        environment: getEnvironment(),
        error: "NEXT_PUBLIC_SUPABASE_URL is not configured.",
      },
      { status: 500 },
    );
  }

  try {
    return Response.json({
      environment: getEnvironment(),
      supabaseHost: new URL(supabaseUrl).hostname,
    });
  } catch {
    return Response.json(
      {
        environment: getEnvironment(),
        error: "NEXT_PUBLIC_SUPABASE_URL is invalid.",
      },
      { status: 500 },
    );
  }
}
