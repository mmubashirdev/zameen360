// components/property-details/shared/VirtualTour.tsx
interface Props {
  videoUrl: string | null;
}

const VirtualTour = ({ videoUrl }: Props) => {
  if (!videoUrl) return null;

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Virtual Tour</h2>
      <div className="rounded-xl overflow-hidden border aspect-video bg-black">
        <video src={videoUrl} controls className="w-full h-full" />
      </div>
    </div>
  );
};

export default VirtualTour;