import SlideViewer from '../../components/SlideViewer';
import { MODULE_CONFIG } from '../../lib/modules';

export function generateStaticParams() {
  return MODULE_CONFIG.map((m) => ({ moduleId: m.id }));
}

export default async function SlidesPage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;

  return (
    <div data-theme="slides">
      <SlideViewer moduleId={moduleId} />
    </div>
  );
}
