
import { Play } from "lucide-react";
import house1 from "../../../assets/00.webp";

const VirtualTour = () => {
  return (
    <div className="border-t border-t-gray-200 pt-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">3D VIRTUAL TOUR</h2>
        <a href="#" className="text-blue-600 text-sm hover:underline">
          View All
        </a>
      </div>

      <div className="relative rounded-xl overflow-hidden">
        <img src={house1} alt="3d tour" className="w-full h-72 object-cover" />
        <div className="absolute top-4 left-4 bg-green-500 text-white text-xs px-2 py-1 rounded">
          FEATURED
        </div>
        <div className="absolute inset-0 flex items-center justify-center gap-4">
          <button className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition">
            <span className="text-xs font-semibold text-gray-700">360°</span>
          </button>
          <button className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center hover:bg-white transition">
            <Play size={20} className="text-gray-700 fill-gray-700" />
          </button>
        </div>
        <button className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition">
          Start 3D Tour
        </button>

        <div className="absolute bottom-2 left-2 flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <img
              key={i}
              src={house1}
              alt="thumb"
              className="w-12 h-10 object-cover rounded border-2 border-white"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VirtualTour;
