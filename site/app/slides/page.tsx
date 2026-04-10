import { buildAllSlides } from '../lib/build-slides';
import PresentationViewer from '../components/PresentationViewer';

export default function SlidesPage() {
  const slides = buildAllSlides();
  return <PresentationViewer slides={slides} />;
}
