import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  CircleMarker,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
} from "react-leaflet";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";
import { useTranslation } from "react-i18next";
import useScrollAnimation from "../../hooks/useScrollAnimation";

type ShopJson = {
  id?: number | string;
  name?: string;
  location?: string;
  cp?: string;
  city?: string;
  province?: string;
  country?: string;
  lat?: number;
  lng?: number;
  latitude?: number;
  longitude?: number;
};

type Shop = {
  id: number | string;
  name: string;
  location: string;
  lat?: number;
  lng?: number;
};

type ResolvedShop = Shop & {
  lat: number;
  lng: number;
};

type LatLng = { lat: number; lng: number };

type ShopWithDistance = ResolvedShop & {
  distanceKm: number | null;
};

const DEFAULT_CENTER: [number, number] = [40.4168, -3.7038];
const DEFAULT_ZOOM = 6;
const DEFAULT_RADIUS_KM = 25;
const SHOP_MARKER_SRC = "/MAN-BLANCO.png";

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("No se pudo cargar la imagen."));
    img.src = src;
  });

const makeBlackLogoDataUrl = (img: HTMLImageElement, size: number) => {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas no disponible.");

  ctx.clearRect(0, 0, size, size);
  ctx.drawImage(img, 0, 0, size, size);

  const imageData = ctx.getImageData(0, 0, size, size);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] ?? 0;
    const g = data[i + 1] ?? 0;
    const b = data[i + 2] ?? 0;
    const a = data[i + 3] ?? 0;
    if (a === 0) continue;

    const luminance = (r + g + b) / 3;
    if (luminance < 20) {
      data[i + 3] = 0;
      continue;
    }

    data[i] = 0;
    data[i + 1] = 0;
    data[i + 2] = 0;
    data[i + 3] = a;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
};

const createShopMarkerIcon = async () => {
  const img = await loadImage(SHOP_MARKER_SRC);
  const iconSize = 20;
  const dataUrl = makeBlackLogoDataUrl(img, iconSize);

  return L.icon({
    iconUrl: dataUrl,
    iconSize: [iconSize, iconSize],
    iconAnchor: [iconSize / 2, iconSize / 2],
    popupAnchor: [0, -iconSize / 2],
  });
};

const readCssVar = (name: string) => {
  try {
    return window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(name)
      .trim();
  } catch {
    return "";
  }
};

const normalizeShops = (data: unknown): Shop[] => {
  const asArray = Array.isArray(data) ? data : data ? [data] : [];

  return (asArray as ShopJson[])
    .filter((s) => !!s && typeof s === "object")
    .map((s, index) => {
      const lat = typeof s.lat === "number" ? s.lat : s.latitude;
      const lng = typeof s.lng === "number" ? s.lng : s.longitude;
      const locationParts = [
        s.location,
        s.cp,
        s.city,
        s.province,
        s.country,
      ].filter(
        (p): p is string => typeof p === "string" && p.trim().length > 0,
      );

      return {
        id: s.id ?? index + 1,
        name: s.name ?? `Shop ${index + 1}`,
        location: locationParts.join(", "),
        lat: typeof lat === "number" ? lat : undefined,
        lng: typeof lng === "number" ? lng : undefined,
      };
    })
    .filter(
      (s) =>
        s.location.trim().length > 0 ||
        (s.lat !== undefined && s.lng !== undefined),
    );
};

const sleep = (ms: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });

const storageKeyForLocation = (location: string) =>
  `mp_shop_geo:${location.trim().toLowerCase()}`;

const readCachedCoords = (location: string) => {
  try {
    const raw = window.localStorage.getItem(storageKeyForLocation(location));
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as { lat?: unknown; lng?: unknown };
    if (typeof parsed.lat === "number" && typeof parsed.lng === "number") {
      return { lat: parsed.lat, lng: parsed.lng };
    }
    return undefined;
  } catch {
    return undefined;
  }
};

const writeCachedCoords = (location: string, coords: LatLng) => {
  try {
    window.localStorage.setItem(
      storageKeyForLocation(location),
      JSON.stringify(coords),
    );
  } catch {
    return;
  }
};

const geocodeLocation = async (location: string, signal: AbortSignal) => {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("q", location);

  const res = await fetch(url.toString(), {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return undefined;

  const json = (await res.json()) as Array<{ lat?: string; lon?: string }>;
  const item = json?.[0];
  if (!item?.lat || !item?.lon) return undefined;

  const lat = Number(item.lat);
  const lng = Number(item.lon);
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return undefined;
  return { lat, lng };
};

const haversineKm = (a: LatLng, b: LatLng) => {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
  return 2 * R * Math.asin(Math.sqrt(x));
};

const formatKm = (km: number) => {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
};

const mapsLinkFor = (shopName: string, location: string, coords?: LatLng) => {
  const name = shopName.trim();
  const loc = location.trim();
  const q =
    name.length > 0 && loc.length > 0
      ? `${name}, ${loc}`
      : name.length > 0
        ? name
        : loc.length > 0
          ? loc
          : coords
            ? `${coords.lat},${coords.lng}`
            : "";

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    q,
  )}`;
};

const FitBounds: React.FC<{ points: Array<[number, number]> }> = ({
  points,
}) => {
  const map = useMap();

  useEffect(() => {
    if (points.length === 0) return;
    const bounds = L.latLngBounds(points.map(([lat, lng]) => [lat, lng]));
    map.fitBounds(bounds, { padding: [28, 28], maxZoom: 14 });
  }, [map, points]);

  return null;
};

const FlyTo: React.FC<{ center: [number, number] }> = ({ center }) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, Math.max(map.getZoom(), 13), { duration: 0.7 });
  }, [center, map]);

  return null;
};

const Shops: React.FC = () => {
  const { t } = useTranslation();
  const [shops, setShops] = useState<Shop[]>([]);
  const [resolved, setResolved] = useState<ResolvedShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shopMarkerIcon, setShopMarkerIcon] = useState<L.Icon | null>(null);
  const [uiGreen, setUiGreen] = useState<string>("#16a34a");
  const listScrollRef = useRef<HTMLDivElement | null>(null);
  const [listMaxHeightPx, setListMaxHeightPx] = useState<number | null>(null);

  const [userPosition, setUserPosition] = useState<LatLng | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [radiusKm, setRadiusKm] = useState(DEFAULT_RADIUS_KM);
  const [onlyNearby, setOnlyNearby] = useState(true);
  const [sort, setSort] = useState<"distance" | "name">("distance");

  const [selectedId, setSelectedId] = useState<number | string | null>(null);

  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation();
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation();

  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2xUrl,
      iconUrl: markerIconUrl,
      shadowUrl: markerShadowUrl,
    });
  }, []);

  useEffect(() => {
    const color = readCssVar("--color-secondary");
    if (color) setUiGreen(color);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const icon = await createShopMarkerIcon();
        if (!cancelled) setShopMarkerIcon(icon);
      } catch {
        if (!cancelled) setShopMarkerIcon(null);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/shops.json", {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as unknown;
        const normalized = normalizeShops(data);
        if (!cancelled) setShops(normalized);
      } catch {
        if (!cancelled) setError(t("shops.errorLoadShops"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [t]);

  useEffect(() => {
    if (shops.length === 0) {
      setResolved([]);
      return;
    }

    const controller = new AbortController();

    const run = async () => {
      const next: ResolvedShop[] = [];

      for (const shop of shops) {
        if (controller.signal.aborted) return;

        if (typeof shop.lat === "number" && typeof shop.lng === "number") {
          next.push({ ...shop, lat: shop.lat, lng: shop.lng });
          continue;
        }

        const cached = readCachedCoords(shop.location);
        if (cached) {
          next.push({ ...shop, ...cached });
          continue;
        }

        if (shop.location.trim().length === 0) continue;

        const coords = await geocodeLocation(shop.location, controller.signal);
        if (coords) {
          writeCachedCoords(shop.location, coords);
          next.push({ ...shop, ...coords });
        }

        await sleep(1100);
      }

      setResolved(next);
    };

    void run();
    return () => {
      controller.abort();
    };
  }, [shops]);

  const requestUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError(t("shops.geoUnsupported"));
      return;
    }

    setGeoLoading(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGeoLoading(false);
      },
      () => {
        setGeoError(t("shops.geoFailed"));
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    );
  }, [t]);

  useEffect(() => {
    requestUserLocation();
  }, [requestUserLocation]);

  const shopsWithDistance = useMemo<ShopWithDistance[]>(() => {
    if (!userPosition) {
      return resolved.map((s) => ({ ...s, distanceKm: null }));
    }
    return resolved.map((s) => ({
      ...s,
      distanceKm: haversineKm(userPosition, { lat: s.lat, lng: s.lng }),
    }));
  }, [resolved, userPosition]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = shopsWithDistance;

    if (q.length > 0) {
      list = list.filter((s) => {
        const text = `${s.name} ${s.location}`.toLowerCase();
        return text.includes(q);
      });
    }

    if (userPosition && onlyNearby) {
      list = list.filter(
        (s) => s.distanceKm !== null && s.distanceKm <= radiusKm,
      );
    }

    if (sort === "name") {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    if (!userPosition) {
      return [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return [...list].sort((a, b) => {
      const da = a.distanceKm ?? Number.POSITIVE_INFINITY;
      const db = b.distanceKm ?? Number.POSITIVE_INFINITY;
      return da - db;
    });
  }, [onlyNearby, query, radiusKm, shopsWithDistance, sort, userPosition]);

  const selectedShop = useMemo(() => {
    if (selectedId === null) return null;
    return filtered.find((s) => s.id === selectedId) ?? null;
  }, [filtered, selectedId]);

  const listTitle = useMemo(() => {
    if (!userPosition) return t("shops.listTitle");
    return onlyNearby ? t("shops.listTitleNearby") : t("shops.listTitle");
  }, [onlyNearby, t, userPosition]);

  const shouldScrollList = filtered.length > 2;

  useEffect(() => {
    if (!shouldScrollList) {
      setListMaxHeightPx(null);
      return;
    }

    const root = listScrollRef.current;
    if (!root) return;

    const rows = Array.from(
      root.querySelectorAll('[data-shop-row="true"]'),
    ) as HTMLElement[];
    if (rows.length < 2) return;

    const firstTwo =
      (rows[0]?.offsetHeight ?? 0) + (rows[1]?.offsetHeight ?? 0);
    if (firstTwo > 0) setListMaxHeightPx(firstTwo);
  }, [shouldScrollList, filtered.length]);

  const points = useMemo(() => {
    const shopPoints = filtered.map((s) => [s.lat, s.lng] as [number, number]);
    if (userPosition) {
      return [[userPosition.lat, userPosition.lng] as [number, number]].concat(
        shopPoints,
      );
    }
    return shopPoints;
  }, [filtered, userPosition]);

  const center = useMemo<[number, number]>(() => {
    if (selectedShop) return [selectedShop.lat, selectedShop.lng];
    if (userPosition) return [userPosition.lat, userPosition.lng];
    if (points.length > 0) return points[0];
    return DEFAULT_CENTER;
  }, [points, selectedShop, userPosition]);

  if (error) {
    return (
      <section className="bg-[var(--color-primary)] text-black py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="w-full rounded-xl border border-black/10 bg-[var(--color-primary)] px-6 py-6 text-black shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <div className="text-lg font-bold">{t("shops.errorTitle")}</div>
            <div className="mt-2 text-base text-black/70">{error}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="shops"
      className="bg-[var(--color-primary)] text-black py-16 px-4"
    >
      <div className="max-w-7xl mx-auto">
        <div
          ref={titleRef as React.RefObject<HTMLDivElement>}
          className={`text-center transition-all duration-1000 ${
            titleVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-[0_0_20px_rgba(0,0,0,0.15)]">
            {t("shops.sectionTitle")}
          </h2>
          <div className="w-24 h-1 bg-[var(--color-secondary)] mx-auto mb-6" />
          <p className="text-xl md:text-2xl text-black/70 max-w-3xl mx-auto leading-relaxed">
            {t("shops.sectionDescription")}
          </p>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            {!userPosition && (
              <button
                type="button"
                onClick={requestUserLocation}
                className="inline-flex items-center justify-center rounded-full bg-[var(--color-secondary)] px-6 py-3 text-base font-bold text-white shadow-[0_10px_30px_rgba(0,0,0,0.15)] disabled:opacity-60"
                disabled={geoLoading}
              >
                {geoLoading
                  ? t("shops.searchingLocation")
                  : t("shops.useMyLocation")}
              </button>
            )}
            {userPosition && (
              <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-[var(--color-primary)] px-4 py-2 text-base text-black/70 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: uiGreen }}
                />
                {t("shops.locationEnabled")}
              </div>
            )}
          </div>
        </div>

        {geoError && (
          <div className="mt-6 rounded-xl border border-black/10 bg-[var(--color-primary)] px-5 py-4 text-base text-black/70 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            {geoError}
          </div>
        )}

        <div
          ref={contentRef as React.RefObject<HTMLDivElement>}
          className={`mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6 transition-all duration-1000 delay-200 ${
            contentVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-xl border border-black/10 bg-[var(--color-primary)] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              <div className="flex items-center justify-between gap-4">
                <div className="text-lg font-bold text-black">
                  {t("shops.filtersTitle")}
                </div>
                <button
                  type="button"
                  className="text-sm font-bold text-[var(--color-secondary)]"
                  onClick={() => {
                    setQuery("");
                    setRadiusKm(DEFAULT_RADIUS_KM);
                    setOnlyNearby(true);
                    setSort("distance");
                    setSelectedId(null);
                  }}
                >
                  {t("shops.clear")}
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <div className="text-sm font-bold text-black/70">
                    {t("shops.searchLabel")}
                  </div>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("shops.searchPlaceholder")}
                    className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base text-black outline-none focus:border-black/25"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-sm font-bold text-black/70">
                      {t("shops.radiusLabel")}
                    </div>
                    <select
                      value={radiusKm}
                      onChange={(e) => setRadiusKm(Number(e.target.value))}
                      className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base text-black outline-none focus:border-black/25"
                      disabled={!userPosition}
                    >
                      {[5, 10, 25, 50, 100, 250].map((km) => (
                        <option key={km} value={km}>
                          {km} km
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <div className="text-sm font-bold text-black/70">
                      {t("shops.sortLabel")}
                    </div>
                    <select
                      value={sort}
                      onChange={(e) =>
                        setSort(e.target.value as "distance" | "name")
                      }
                      className="mt-2 w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-base text-black outline-none focus:border-black/25"
                    >
                      <option value="distance">
                        {t("shops.sortByDistance")}
                      </option>
                      <option value="name">{t("shops.sortByName")}</option>
                    </select>
                  </div>
                </div>

                <label className="flex items-center gap-3 text-base font-semibold text-black/80 select-none">
                  <input
                    type="checkbox"
                    checked={onlyNearby}
                    onChange={(e) => setOnlyNearby(e.target.checked)}
                    className="h-4 w-4"
                    disabled={!userPosition}
                  />
                  {t("shops.onlyWithinRadius")}
                </label>
              </div>

              <div className="mt-5 flex items-center justify-between text-sm text-black/60">
                <div>
                  {loading
                    ? t("shops.loading")
                    : t("shops.locationsCount", { count: filtered.length })}
                </div>
                {!userPosition && (
                  <div className="text-sm text-black/60">
                    {t("shops.enableLocationToFilter")}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-black/10 bg-[var(--color-primary)] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              <div className="px-6 py-5 border-b border-black/10">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="text-lg font-bold text-black">
                      {listTitle}
                    </div>
                    <div className="mt-1 text-sm text-black/60">
                      {userPosition
                        ? t("shops.listSortedByDistance")
                        : t("shops.enableLocationToSeeDistances")}
                    </div>
                  </div>
                  <div className="text-sm font-bold text-black/60">
                    {loading ? "…" : `${filtered.length}`}
                  </div>
                </div>
              </div>
              <div
                ref={listScrollRef}
                className={shouldScrollList ? "overflow-auto" : ""}
                style={
                  shouldScrollList
                    ? {
                        maxHeight: listMaxHeightPx
                          ? `${listMaxHeightPx}px`
                          : "320px",
                      }
                    : undefined
                }
              >
                {filtered.length === 0 ? (
                  <div className="px-6 py-6 text-base text-black/70">
                    {t("shops.noMatches")}
                  </div>
                ) : (
                  <div className="divide-y divide-black/10">
                    {filtered.map((s) => {
                      const active = selectedId === s.id;
                      return (
                        <button
                          data-shop-row="true"
                          key={s.id}
                          type="button"
                          onClick={() => setSelectedId(s.id)}
                          className={`w-full text-left px-6 py-5 transition-colors hover:bg-black/5 ${
                            active ? "bg-black/5" : ""
                          } border-l-4 ${
                            active
                              ? "border-[var(--color-secondary)]"
                              : "border-transparent"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-base font-bold text-black truncate">
                                {s.name}
                              </div>
                              <div className="mt-1 text-sm text-black/60 line-clamp-2">
                                {s.location}
                              </div>
                            </div>
                            <div className="shrink-0 text-sm font-semibold text-black/70">
                              {s.distanceKm !== null
                                ? formatKm(s.distanceKm)
                                : ""}
                            </div>
                          </div>
                          <div className="mt-2">
                            <a
                              className="text-sm font-bold text-[var(--color-secondary)]"
                              href={mapsLinkFor(s.name, s.location, {
                                lat: s.lat,
                                lng: s.lng,
                              })}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {t("shops.openInMaps")}
                            </a>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="w-full rounded-xl border border-black/10 bg-[var(--color-primary)] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
              <div className="px-6 py-5 border-b border-black/10">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="text-lg font-bold text-black">
                      {t("shops.mapTitle")}
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative h-[520px] w-full">
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[var(--color-secondary)] to-transparent opacity-[0.08]" />
                <MapContainer
                  center={center}
                  zoom={DEFAULT_ZOOM}
                  zoomControl={false}
                  scrollWheelZoom={false}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  />
                  <ZoomControl position="bottomright" />

                  {selectedShop ? (
                    <FlyTo center={[selectedShop.lat, selectedShop.lng]} />
                  ) : points.length > 0 ? (
                    <FitBounds points={points} />
                  ) : null}

                  {userPosition && (
                    <CircleMarker
                      center={[userPosition.lat, userPosition.lng]}
                      radius={8}
                      pathOptions={{
                        color: uiGreen,
                        fillColor: uiGreen,
                        fillOpacity: 0.9,
                      }}
                    >
                      <Popup>
                        <div className="min-w-[160px]">
                          <div className="text-base font-semibold text-black">
                            {t("shops.yourLocation")}
                          </div>
                        </div>
                      </Popup>
                    </CircleMarker>
                  )}

                  {filtered.map((shop) => (
                    <Marker
                      key={shop.id}
                      position={[shop.lat, shop.lng]}
                      icon={shopMarkerIcon ?? undefined}
                    >
                      <Popup>
                        <div className="min-w-[220px]">
                          <div className="text-base font-semibold text-black">
                            {shop.name}
                          </div>
                          <div className="mt-1 text-sm text-black/70">
                            {shop.location}
                          </div>
                          <div className="mt-2 flex items-center justify-between gap-3">
                            <a
                              className="text-sm font-semibold text-[var(--color-secondary)]"
                              href={mapsLinkFor(shop.name, shop.location, {
                                lat: shop.lat,
                                lng: shop.lng,
                              })}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {t("shops.openInMaps")}
                            </a>
                            {shop.distanceKm !== null && (
                              <div className="text-sm font-semibold text-black/70">
                                {formatKm(shop.distanceKm)}
                              </div>
                            )}
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Shops;
