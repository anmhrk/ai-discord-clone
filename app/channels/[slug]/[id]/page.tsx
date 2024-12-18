export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;

  // here slug could be @me or server id
  // if @me then id is friend id
  // if server id then id is channel id
  // do valid checks here

  return (
    <div>
      {slug} {id}
    </div>
  );
}
