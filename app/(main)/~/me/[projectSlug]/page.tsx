export default async function PersonalProjectPage({
  params,
}: {
  params: { projectSlug: string };
}) {
  const param = await params;

  return (
    <div>
      <div className="mt-6">
        <h1 className="text-sm font-medium">Project Name</h1>
      </div>
    </div>
  );
}
