export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  return (
    <div>
      {slug} {id}
    </div>
  );
}
