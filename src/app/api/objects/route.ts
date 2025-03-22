// https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config#dynamic
// figure out which one to use

export async function GET() {
  const res = await fetch("https://data.mongodb-api.com/...", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.MONGODB_API_KEY}`,
    },
  });
  const data = await res.json();

  return Response.json({ data });
}
