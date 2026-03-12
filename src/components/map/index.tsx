import React, { useEffect, useMemo, useState } from "react";
import {
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

type ShopJson = {
  id?: number | string;
  name?: string;
  location?: string;
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

const DEFAULT_CENTER: [number, number] = [40.4168, -3.7038];
const DEFAULT_ZOOM = 6;

const normalizeShops = (data: unknown): Shop[] => {
  const asArray = Array.isArray(data) ? data : data ? [data] : [];

  return (asArray as ShopJson[])
    .filter((s) => !!s && typeof s === "object")
    .map((s, index) => {
      const lat = typeof s.lat === "number" ? s.lat : s.latitude;
      const lng = typeof s.lng === "number" ? s.lng : s.longitude;

      return {
        id: s.id ?? index + 1,
        name: s.name ?? `Shop ${index + 1}`,
        location: s.location ?? "",
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

const mapsLinkFor = (location: string, lat: number, lng: number) => {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${lat},${lng} ${location}`,
  )}`;
};

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

const writeCachedCoords = (
  location: string,
  coords: { lat: number; lng: number },
) => {
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

const ShopsMap: React.FC = () => {
  const { t } = useTranslation();
  const [shops, setShops] = useState<Shop[]>([]);
  const [resolved, setResolved] = useState<ResolvedShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: markerIcon2xUrl,
      iconUrl: markerIconUrl,
      shadowUrl: markerShadowUrl,
    });
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

  const points = useMemo(
    () => resolved.map((s) => [s.lat, s.lng] as [number, number]),
    [resolved],
  );

  const center = useMemo<[number, number]>(() => {
    if (points.length > 0) return points[0];
    return DEFAULT_CENTER;
  }, [points]);

  if (error) {
    return (
      <div className="w-full rounded-2xl border border-black/10 bg-white px-5 py-6 text-black">
        <div className="text-sm font-semibold">
          {t("shops.mapWidget.errorTitle")}
        </div>
        <div className="mt-2 text-sm text-black/70">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-black/10 bg-white overflow-hidden">
      <div className="px-5 py-4 border-b border-black/10">
        <div className="text-sm font-semibold text-black">
          {t("shops.mapWidget.title")}
        </div>
        <div className="mt-1 text-xs text-black/60">
          {loading
            ? t("shops.loading")
            : t("shops.mapWidget.locationsCount", { count: resolved.length })}
        </div>
      </div>
      <div className="h-[420px] w-full">
        <MapContainer
          center={center}
          zoom={DEFAULT_ZOOM}
          zoomControl={false}
          scrollWheelZoom={false}
          className="h-full w-full"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ZoomControl position="bottomright" />
          {points.length > 0 && <FitBounds points={points} />}
          {resolved.map((shop) => (
            <Marker key={shop.id} position={[shop.lat, shop.lng]}>
              <Popup>
                <div className="min-w-[220px]">
                  <div className="text-sm font-semibold text-black">
                    {shop.name}
                  </div>
                  <div className="mt-1 text-xs text-black/70">
                    {shop.location}
                  </div>
                  <a
                    className="mt-2 inline-block text-xs font-semibold text-[var(--color-secondary)]"
                    href={mapsLinkFor(shop.location, shop.lat, shop.lng)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("shops.openInMaps")}
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default ShopsMap;
