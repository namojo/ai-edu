import SlideViewer from '../../components/SlideViewer';
import type { SlidesData } from '../../types';

export async function generateStaticParams() {
  const fs = await import('fs');
  const path = await import('path');
  const filePath = path.join(process.cwd(), 'public', 'slides.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const data: SlidesData = JSON.parse(raw);
  return data.modules.map((m) => ({ moduleId: m.id }));
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const { moduleId } = await params;
  return <SlideViewer moduleId={moduleId} />;
}
