import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  MapPin,
  Bed,
  Bath,
  Maximize,
  Heart,
  ShieldCheck,
  Globe,
  Phone,
  ArrowLeft,
  FileCheck2,
  Landmark,
  Users,
  Camera,
  Grid3X3,
  LayoutGrid,
} from "lucide-react";
import DashboardNavbar from "../../marketplace/components/DashboardNavbar";
import { useAuthContext } from "@features/auth/hooks/useAuth";
import axiosInstance from "@shared/lib/axios";

interface Property {
  id: number;
  title: string;
  city: string;
  locality: string;
  price: string;
  bedrooms: string;
  bathrooms: string;
  areaSize: string;
  areaUnit: string;
  purpose: string;
  propertyType: string;
  amenities: string[];
  images: string[];
  status: string;
}

interface PlotFilter {
  size: number;
  unit: string;
  count: number;
}

const SocietyProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const { user: currentUser } = useAuthContext();

  const [society, setSociety] = useState<any>(null);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [localCover, setLocalCover] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [plotFilters, setPlotFilters] = useState<{
    marla: PlotFilter[];
    kanal: PlotFilter[];
  }>({ marla: [], kanal: [] });

  useEffect(() => {
    const fetchSocietyData = async () => {
      try {
        const response: any = await axiosInstance.get(`/schemes/public/${id}`);
        if (response?.success) {
          setSociety(response.society);
          const props = response.properties || [];
          setAllProperties(props);
          setFilteredProperties(props);
          buildFilters(props);
        }
      } catch (err) {
        console.error("Failed to fetch society profile:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchSocietyData();
  }, [id]);

  const buildFilters = (props: Property[]) => {
    const marlaMap: Record<number, number> = {};
    const kanalMap: Record<number, number> = {};

    props.forEach((p) => {
      const size = parseFloat(p.areaSize);
      const unit = p.areaUnit?.toLowerCase().trim();
      if (isNaN(size)) return;

      if (unit === "marla") {
        marlaMap[size] = (marlaMap[size] || 0) + 1;
      } else if (unit === "kanal") {
        kanalMap[size] = (kanalMap[size] || 0) + 1;
      }
    });

    const marlaFilters: PlotFilter[] = Object.entries(marlaMap)
      .map(([size, count]) => ({ size: Number(size), unit: "Marla", count }))
      .sort((a, b) => a.size - b.size);

    const kanalFilters: PlotFilter[] = Object.entries(kanalMap)
      .map(([size, count]) => ({ size: Number(size), unit: "Kanal", count }))
      .sort((a, b) => a.size - b.size);

    setPlotFilters({ marla: marlaFilters, kanal: kanalFilters });
  };

  const handleFilterClick = async (filterKey: string, size?: number, unit?: string) => {
    setActiveFilter(filterKey);
    setFilterLoading(true);

    // Simulate small delay for UX
    await new Promise((r) => setTimeout(r, 150));

    if (filterKey === "all") {
      setFilteredProperties(allProperties);
    } else if (size !== undefined && unit) {
      const filtered = allProperties.filter((p) => {
        const pSize = parseFloat(p.areaSize);
        const pUnit = p.areaUnit?.toLowerCase().trim();
        return pSize === size && pUnit === unit.toLowerCase();
      });
      setFilteredProperties(filtered);
    }

    setFilterLoading(false);
  };

  const formatPrice = (p: string | number) => {
    if (!p) return "N/A";
    return new Intl.NumberFormat("en-IN").format(Number(p));
  };

  const handleSeeMore = (propId: number) => navigate(`/property/${propId}`);

  const currentUserId = Number(currentUser?.userId || currentUser?.id);
  const ownerUserId = Number(society?.userId || society?.user?.id);
  const isProfileOwner = Boolean(
    currentUserId && ownerUserId && currentUserId === ownerUserId,
  );

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !id || !isProfileOwner) return;

    const previewUrl = URL.createObjectURL(file);
    const formData = new FormData();
    formData.append("coverImage", file);

    setLocalCover(previewUrl);
    setCoverUploading(true);

    try {
      const response: any = await axiosInstance.patch(
        `/schemes/applications/${id}/cover`,
        formData,
      );

      if (response?.success) {
        setSociety((prev: any) => ({
          ...prev,
          coverImage: response.coverImage,
        }));
        setLocalCover(null);
      }
    } catch (err) {
      console.error("Failed to update society cover:", err);
      setLocalCover(null);
    } finally {
      setCoverUploading(false);
      e.target.value = "";
      URL.revokeObjectURL(previewUrl);
    }
  };

  const coverSrc =
    localCover || society?.coverImage || society?.bannerImage || null;
  const logoSrc = society?.user?.profilePicture || null;

  const infoItems = [
    { label: "Type", value: society?.societyType, icon: <Landmark size={15} /> },
    { label: "NOC", value: society?.nocStatus, icon: <FileCheck2 size={15} /> },
    { label: "Developer", value: society?.developerCompany, icon: <Users size={15} /> },
    { label: "Contact", value: society?.officialContact, icon: <Phone size={15} /> },
    { label: "Website", value: society?.website, icon: <Globe size={15} />, isLink: true },
  ].filter((item) => item.value);

  const totalFilters =
    plotFilters.marla.length + plotFilters.kanal.length;

  return (
    <div className="min-h-screen bg-slate-50 pt-15">
      <DashboardNavbar />
      <main className="mx-auto w-[90%] py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-blue-600" />
          </div>
        ) : !society ? (
          <div className="py-20 text-center">
            <p className="text-lg font-semibold text-slate-600">Society not found</p>
            <p className="mt-1 text-sm text-slate-400">
              This society may not exist or is pending approval.
            </p>
          </div>
        ) : (
          <>
            {/* Back */}
            <button
              onClick={() => navigate(-1)}
              className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-800"
            >
              <ArrowLeft size={15} />
              Back
            </button>

            {/* ── Profile Card ─────────────────────────────────────── */}
            <div className="mb-10 w-full">
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {/* Cover */}
                <div className="group relative h-44 sm:h-52">
                  {coverSrc ? (
                    <img
                      src={coverSrc}
                      alt="cover"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
                      <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2230%22%20height%3D%2230%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%2010h10V0h10v10h10v10H20v10H10V20H0z%22%20fill%3D%22%23ffffff%22%20fill-opacity%3D%22.03%22%2F%3E%3C%2Fsvg%3E')] bg-repeat" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />

                  <div className="absolute bottom-4 left-24 right-4 sm:left-28">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-bold text-white drop-shadow-md sm:text-2xl">
                        {society.societyName}
                      </h2>
                      <ShieldCheck size={20} className="shrink-0 text-blue-400 drop-shadow-md" />
                    </div>
                    <p className="mt-0.5 flex items-center gap-1 text-[13px] text-white/75 drop-shadow-sm">
                      <MapPin size={12} />
                      {[society.areaSector, society.city].filter(Boolean).join(", ") ||
                        "Location not available"}
                    </p>
                  </div>

                  {isProfileOwner && (
                    <>
                      <button
                        onClick={() => coverInputRef.current?.click()}
                        disabled={coverUploading}
                        className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-black/40 px-3 py-1.5 text-[11px] font-medium text-white opacity-0 backdrop-blur-sm transition-all hover:bg-black/60 disabled:cursor-not-allowed disabled:opacity-70 group-hover:opacity-100"
                      >
                        <Camera size={13} />
                        {coverUploading
                          ? "Uploading..."
                          : coverSrc
                          ? "Change Cover"
                          : "Add Cover"}
                      </button>
                      <input
                        ref={coverInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleCoverUpload}
                      />
                    </>
                  )}
                </div>

                {/* Content */}
                <div className="relative px-5 pb-5">
                  <div className="-mt-10 mb-4 flex items-end gap-4">
                    <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl border-[3px] border-white bg-white shadow-md">
                      {logoSrc ? (
                        <img src={logoSrc} alt="logo" className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 text-2xl font-black text-blue-600">
                          {society.societyName?.charAt(0) || "S"}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 flex gap-6 border-b border-slate-100 pb-4">
                    <div>
                      <p className="text-2xl font-extrabold text-slate-900">
                        {allProperties.length}
                      </p>
                      <p className="text-[11px] font-medium text-slate-400">Properties</p>
                    </div>
                    {society.city && (
                      <div>
                        <p className="text-2xl font-extrabold text-slate-900">{society.city}</p>
                        <p className="text-[11px] font-medium text-slate-400">City</p>
                      </div>
                    )}
                  </div>

                  {infoItems.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {infoItems.map((item, idx) => (
                        <div
                          key={idx}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-2 text-[13px] text-slate-700 transition hover:border-slate-300 hover:bg-white"
                        >
                          <span className="text-slate-400">{item.icon}</span>
                          <span className="font-medium text-slate-500">{item.label}:</span>
                          {item.isLink ? (
                            <a
                              href={
                                item.value.startsWith("http")
                                  ? item.value
                                  : `https://${item.value}`
                              }
                              target="_blank"
                              rel="noreferrer"
                              className="font-semibold text-blue-600 hover:underline"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {item.value}
                            </a>
                          ) : (
                            <span className="font-semibold text-slate-800">{item.value}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {society.address && (
                    <p className="mt-3 text-[13px] leading-relaxed text-slate-500">
                      <span className="font-semibold text-slate-600">Address:</span>{" "}
                      {society.address}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Plot Size Filter Bar ─────────────────────────────── */}
            {totalFilters > 0 && (
              <div className="mb-8 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <Grid3X3 size={18} className="text-blue-600" />
                    <h3 className="text-[15px] font-bold text-slate-800">
                      Filter 
                    </h3>
                    <span className="ml-auto text-[12px] text-slate-400">
                      {filteredProperties.length} of {allProperties.length} shown
                    </span>
                  </div>
                </div>

                <div className="px-5 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* All */}
                    <button
                      onClick={() => handleFilterClick("all")}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all ${
                        activeFilter === "all"
                          ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white"
                      }`}
                    >
                      <LayoutGrid size={14} />
                      All
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                          activeFilter === "all"
                            ? "bg-white/20 text-white"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {allProperties.length}
                      </span>
                    </button>

                    {/* Divider */}
                    {plotFilters.marla.length > 0 && (
                      <div className="mx-1 flex items-center gap-2">
                        <div className="h-6 w-px bg-slate-200" />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                          Marla
                        </span>
                        <div className="h-6 w-px bg-slate-200" />
                      </div>
                    )}

                    {/* Marla filters */}
                    {plotFilters.marla.map((f) => {
                      const key = `${f.size}-marla`;
                      const isActive = activeFilter === key;
                      return (
                        <button
                          key={key}
                          onClick={() => handleFilterClick(key, f.size, "Marla")}
                          disabled={f.count === 0}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all ${
                            isActive
                              ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-600/20"
                              : f.count === 0
                              ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                          }`}
                        >
                          {f.size} Marla
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                              isActive
                                ? "bg-white/20 text-white"
                                : f.count === 0
                                ? "bg-slate-100 text-slate-300"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {f.count}
                          </span>
                        </button>
                      );
                    })}

                    {/* Divider */}
                    {plotFilters.kanal.length > 0 && (
                      <div className="mx-1 flex items-center gap-2">
                        <div className="h-6 w-px bg-slate-200" />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                          Kanal
                        </span>
                        <div className="h-6 w-px bg-slate-200" />
                      </div>
                    )}

                    {/* Kanal filters */}
                    {plotFilters.kanal.map((f) => {
                      const key = `${f.size}-kanal`;
                      const isActive = activeFilter === key;
                      return (
                        <button
                          key={key}
                          onClick={() => handleFilterClick(key, f.size, "Kanal")}
                          disabled={f.count === 0}
                          className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[13px] font-semibold transition-all ${
                            isActive
                              ? "border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                              : f.count === 0
                              ? "cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300"
                              : "border-slate-200 bg-slate-50 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50"
                          }`}
                        >
                          {f.size} Kanal
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${
                              isActive
                                ? "bg-white/20 text-white"
                                : f.count === 0
                                ? "bg-slate-100 text-slate-300"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {f.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── Properties Header ────────────────────────────────── */}
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">
                {activeFilter === "all"
                  ? `Available Properties in ${society.societyName}`
                  : `${activeFilter.replace("-", " ").replace(/^\w/, (c: string) => c.toUpperCase())} Properties`}{" "}
                <span className="font-normal text-slate-400">
                  ({filteredProperties.length})
                </span>
              </h3>
              {activeFilter !== "all" && (
                <button
                  onClick={() => handleFilterClick("all")}
                  className="text-[13px] font-semibold text-blue-600 transition hover:text-blue-800 hover:underline"
                >
                  Clear Filter
                </button>
              )}
            </div>

            {/* ── Properties Grid ──────────────────────────────────── */}
            {filterLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-[3px] border-slate-200 border-t-blue-600" />
                  <p className="text-sm text-slate-400">Filtering properties...</p>
                </div>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-base font-semibold text-slate-600">
                  No properties found
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  {activeFilter === "all"
                    ? "This society hasn't posted any available properties."
                    : "No properties match the selected plot size."}
                </p>
                {activeFilter !== "all" && (
                  <button
                    onClick={() => handleFilterClick("all")}
                    className="mt-4 rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Show All Properties
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProperties.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSeeMore(p.id)}
                    className="group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Image */}
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={
                          p.images?.[0] ||
                          "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400"
                        }
                        alt={p.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute left-3 top-3 rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold text-white shadow">
                        For {p.purpose}
                      </div>
                      {/* Plot size badge */}
                      <div className="absolute bottom-3 left-3 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                        {p.areaSize} {p.areaUnit}
                      </div>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-500 shadow backdrop-blur-sm transition hover:bg-white hover:text-red-500"
                      >
                        <Heart size={16} />
                      </button>
                    </div>

                    {/* Body */}
                    <div className="p-4">
                      <h4 className="mb-1 truncate text-[15px] font-bold text-slate-900">
                        {p.title}
                      </h4>

                      <div className="mb-2 flex items-center gap-1 text-[12px] text-slate-500">
                        <MapPin size={12} />
                        <span className="truncate">
                          {p.locality}, {p.city}
                        </span>
                      </div>

                      <p className="mb-3 text-lg font-extrabold text-blue-600">
                        PKR {formatPrice(p.price)}
                      </p>

                      {/* Specs */}
                      <div className="mb-3 flex gap-4 border-t border-slate-100 pt-3">
                        <div className="flex items-center gap-1.5 text-[12px] text-slate-600">
                          <Bed size={14} className="text-slate-400" />
                          <span>{p.bedrooms} Beds</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[12px] text-slate-600">
                          <Bath size={14} className="text-slate-400" />
                          <span>{p.bathrooms} Baths</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[12px] text-slate-600">
                          <Maximize size={14} className="text-slate-400" />
                          <span>
                            {p.areaSize} {p.areaUnit}
                          </span>
                        </div>
                      </div>

                      {/* Amenities */}
                      {p.amenities && p.amenities.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1.5">
                          {p.amenities.slice(0, 3).map((a, i) => (
                            <span
                              key={i}
                              className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600"
                            >
                              {a}
                            </span>
                          ))}
                          {p.amenities.length > 3 && (
                            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600">
                              +{p.amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* CTA */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSeeMore(p.id);
                        }}
                        className="w-full rounded-xl bg-slate-900 py-2.5 text-[13px] font-semibold text-white transition hover:bg-slate-800"
                      >
                        See More Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default SocietyProfile;
