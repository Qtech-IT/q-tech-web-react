import { Button } from '@/Components/UI/Button';
import { ButtonLoader } from '@/Components/UI/ButtonLoader';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/UI/Card';
import { Form } from '@/Components/UI/Form';
import { useTranslations } from '@/Hooks/useTranslations';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import {
    ArrowLeft,
    Check,
    ChevronDown,
    Loader2,
    MapPin,
    Plus,
    Save,
    Shield,
    Users,
    Wifi,
    X,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// ─── Types ───────────────────────────────────────────────────────────────────

interface DesignationOption {
    value: string;
    label: string;
}

interface AttendanceSettingsProps {
    distributionHub: {
        data: {
            uuid: string;
            name: string;
            latitude?: number;
            longitude?: number;
        };
    };
    attendanceSetting?: {
        data: {
            uuid?: string;
            gps_validation_required?: boolean;
            allowed_radius_meter?: number;
            latitude?: number;
            longitude?: number;
            ip_validation_required?: boolean;
            whitelisted_ips?: string[];
            priority?: number;
            status?: string | { value: string };
            assignments?: Array<{
                assignable_id: string;
                assignable_type: string;
                assignable?: { id: string; name: string, code?: string };
            }>;
        };
    } | null;
    designationOptions?: DesignationOption[];
    mapType?: 'open-street-map' | 'google-map';
    googleMapsApiKey?: string;
}

// ─── Schema ──────────────────────────────────────────────────────────────────

const attendanceSettingsSchema = z.object({
    latitude: z.any(),
    longitude: z.any(),
    allowed_radius_meter: z.number().min(10, 'Minimum radius is 10 meters'),
    ip_validation_required: z.boolean(),
    whitelisted_ips: z.array(z.string()).optional(),
    status: z.enum(['active', 'inactive']),
    designation_codes: z.array(z.string()).optional(),
});

type AttendanceSettingsFormType = z.infer<typeof attendanceSettingsSchema>;

// ─── Google Maps Loader ───────────────────────────────────────────────────────

declare global {
    interface Window {
        google: any;
        initMap: () => void;
        L: any;
    }
}

let googleMapsLoaded = false;
let googleMapsLoading = false;
const googleMapsCallbacks: Array<() => void> = [];

function loadGoogleMaps(apiKey: string): Promise<void> {
    return new Promise((resolve) => {
        if (googleMapsLoaded) return resolve();
        googleMapsCallbacks.push(resolve);
        if (googleMapsLoading) return;
        googleMapsLoading = true;
        window.initMap = () => {
            googleMapsLoaded = true;
            googleMapsCallbacks.forEach(cb => cb());
            googleMapsCallbacks.length = 0;
        };
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
    });
}

// ─── Leaflet Loader ───────────────────────────────────────────────────────────

let leafletLoaded = false;
let leafletLoading = false;
const leafletCallbacks: Array<() => void> = [];

function loadLeaflet(): Promise<void> {
    return new Promise((resolve) => {
        if (leafletLoaded) return resolve();
        leafletCallbacks.push(resolve);
        if (leafletLoading) return;
        leafletLoading = true;
        if (!document.querySelector('link[href*="leaflet"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => {
            leafletLoaded = true;
            leafletCallbacks.forEach(cb => cb());
            leafletCallbacks.length = 0;
        };
        document.head.appendChild(script);
    });
}

// ─── OSM Picker ───────────────────────────────────────────────────────────────

interface BaseMapProps {
    latitude: number;
    longitude: number;
    radius: number;
    onLocationChange: (lat: number, lng: number) => void;
    onRadiusChange: (radius: number) => void;
}

const OSMPicker: React.FC<BaseMapProps> = ({ latitude, longitude, radius, onLocationChange, onRadiusChange }) => {

    if (!radius || isNaN(radius) || radius < 0) radius = 0;

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const circleRef = useRef<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchVal, setSearchVal] = useState('');
    const [searching, setSearching] = useState(false);
    const [results, setResults] = useState<any[]>([]);
    const { t } = useTranslations();

    // Keep refs fresh for Leaflet event handlers (avoid stale closures)
    const onLocRef = useRef(onLocationChange);
    const onRadRef = useRef(onRadiusChange);
    useEffect(() => { onLocRef.current = onLocationChange; }, [onLocationChange]);
    useEffect(() => { onRadRef.current = onRadiusChange; }, [onRadiusChange]);

    // ── mount once ──
    useEffect(() => {
        loadLeaflet().then(() => {
            if (!mapRef.current || mapInstance.current) return;
            const L = window.L;
            const center: [number, number] = [latitude || 23.7956, longitude || 90.3537];

            const map = L.map(mapRef.current, { zoomControl: true }).setView(center, 15);
            mapInstance.current = map;

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 19,
            }).addTo(map);

            // Custom pin icon
            const pinIcon = L.divIcon({
                className: '',
                html: `<div style="width:0;height:0">
                    <div style="
                        position:absolute;
                        width:26px;height:26px;
                        background:#ef4444;
                        border-radius:50% 50% 50% 0;
                        transform:rotate(-45deg) translate(-50%,-50%);
                        border:3px solid #fff;
                        box-shadow:0 2px 8px rgba(0,0,0,.4);
                        top:0;left:0;
                    "></div>
                </div>`,
                iconSize: [0, 0],
                iconAnchor: [0, 0],
            });

            const marker = L.marker(center, { draggable: true, icon: pinIcon }).addTo(map);
            markerRef.current = marker;

            const circle = L.circle(center, {
                radius, color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.15, weight: 2,
            }).addTo(map);
            circleRef.current = circle;

            marker.on('dragend', () => {
                const { lat, lng } = marker.getLatLng();
                circle.setLatLng([lat, lng]);
                onLocRef.current(lat, lng);
            });

            map.on('click', (e: any) => {
                const { lat, lng } = e.latlng;
                marker.setLatLng([lat, lng]);
                circle.setLatLng([lat, lng]);
                onLocRef.current(lat, lng);
            });

            setLoading(false);
        });

        return () => {
            mapInstance.current?.remove();
            mapInstance.current = null;
            markerRef.current = null;
            circleRef.current = null;
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Sync lat/lng → map
    useEffect(() => {
        if (!markerRef.current || !circleRef.current) return;
        markerRef.current.setLatLng([latitude, longitude]);
        circleRef.current.setLatLng([latitude, longitude]);
    }, [latitude, longitude]);

    // Sync radius → map
    useEffect(() => {
        if (!circleRef.current) return;
        circleRef.current.setRadius(radius);
    }, [radius]);

    const handleSearch = async () => {
        if (!searchVal.trim()) return;
        setSearching(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchVal)}&limit=5`,
                { headers: { 'Accept-Language': 'en' } }
            );
            setResults(await res.json());
        } catch { setResults([]); }
        finally { setSearching(false); }
    };

    const selectResult = (r: any) => {
        const lat = parseFloat(r.lat);
        const lng = parseFloat(r.lon);
        mapInstance.current?.setView([lat, lng], 15);
        onLocationChange(lat, lng);
        setSearchVal(r.display_name);
        setResults([]);
    };

    return (
        <div className="space-y-3">
            {/* Search — sits above the map; isolation:isolate prevents the map's
                Leaflet stacking context from bleeding over the dropdown */}
            <div className="relative" style={{ zIndex: 1000, isolation: 'isolate' }}>
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" style={{ zIndex: 1 }} />
                <input
                    type="text"
                    value={searchVal}
                    onChange={e => { setSearchVal(e.target.value); setResults([]); }}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleSearch())}
                    placeholder={t('Search location...')}
                    className="w-full pl-9 pr-24 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                />
                <button
                    type="button"
                    onClick={handleSearch}
                    disabled={searching}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors disabled:opacity-60 flex items-center gap-1"
                >
                    {searching && <Loader2 className="w-3 h-3 animate-spin" />}
                    {t('Search')}
                </button>
                {results.length > 0 && (
                    <div
                        className="absolute top-full mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-52 overflow-y-auto"
                        style={{ zIndex: 1001 }}
                    >
                        {results.map((r, i) => (
                            <button
                                key={i} type="button" onClick={() => selectResult(r)}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-start gap-2"
                            >
                                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                                <span className="line-clamp-2 text-gray-700 dark:text-gray-300">{r.display_name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Map — isolation:isolate scopes Leaflet's internal z-indexes so they
                can't escape and cover the search dropdown above */}
            <div
                className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm"
                style={{ height: 380, isolation: 'isolate' }}
            >
                {loading && (
                    <div className="absolute inset-0 z-10 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    </div>
                )}
                <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                <span>💡</span> {t('Click on the map or drag the marker to set location. Adjust the radius using the input below.')}
            </p>
        </div>
    );
};

// ─── Google Map Picker ────────────────────────────────────────────────────────

const GoogleMapPicker: React.FC<BaseMapProps & { apiKey: string }> = ({
    latitude, longitude, radius, onLocationChange, onRadiusChange, apiKey,
}) => {

    if (!radius || isNaN(radius) || radius < 0) radius = 0;

    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const circleRef = useRef<any>(null);
    const searchRef = useRef<HTMLInputElement>(null);
    const [mapReady, setMapReady] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchVal, setSearchVal] = useState('');
    const { t } = useTranslations();

    const onLocRef = useRef(onLocationChange);
    const onRadRef = useRef(onRadiusChange);
    useEffect(() => { onLocRef.current = onLocationChange; }, [onLocationChange]);
    useEffect(() => { onRadRef.current = onRadiusChange; }, [onRadiusChange]);

    useEffect(() => {
        if (!apiKey) { setLoading(false); return; }
        loadGoogleMaps(apiKey).then(() => setMapReady(true));
    }, [apiKey]);

    useEffect(() => {
        if (!mapReady || !mapRef.current) return;
        const center = { lat: latitude || 23.7956, lng: longitude || 90.3537 };

        mapInstance.current = new window.google.maps.Map(mapRef.current, {
            center, zoom: 15, mapTypeControl: true, streetViewControl: false, fullscreenControl: true,
        });

        markerRef.current = new window.google.maps.Marker({
            position: center, map: mapInstance.current, draggable: true, title: 'Hub Location',
        });

        circleRef.current = new window.google.maps.Circle({
            strokeColor: '#ef4444', strokeOpacity: 0.8, strokeWeight: 2,
            fillColor: '#ef4444', fillOpacity: 0.2,
            map: mapInstance.current, center, radius, editable: true,
        });

        markerRef.current.addListener('dragend', () => {
            const p = markerRef.current.getPosition();
            circleRef.current.setCenter({ lat: p.lat(), lng: p.lng() });
            onLocRef.current(p.lat(), p.lng());
        });

        mapInstance.current.addListener('click', (e: any) => {
            const lat = e.latLng.lat(); const lng = e.latLng.lng();
            markerRef.current.setPosition({ lat, lng });
            circleRef.current.setCenter({ lat, lng });
            onLocRef.current(lat, lng);
        });

        circleRef.current.addListener('radius_changed', () => {
            onRadRef.current(Math.round(circleRef.current.getRadius() * 100) / 100);
        });

        if (searchRef.current) {
            const ac = new window.google.maps.places.Autocomplete(searchRef.current);
            ac.addListener('place_changed', () => {
                const place = ac.getPlace();
                if (!place.geometry) return;
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                mapInstance.current.setCenter({ lat, lng });
                markerRef.current.setPosition({ lat, lng });
                circleRef.current.setCenter({ lat, lng });
                onLocRef.current(lat, lng);
                setSearchVal(place.formatted_address || '');
            });
        }
        setLoading(false);
    }, [mapReady]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!markerRef.current || !circleRef.current) return;
        markerRef.current.setPosition({ lat: latitude, lng: longitude });
        circleRef.current.setCenter({ lat: latitude, lng: longitude });
    }, [latitude, longitude]);

    useEffect(() => {
        if (!circleRef.current) return;
        if (Math.abs(circleRef.current.getRadius() - radius) > 1) circleRef.current.setRadius(radius);
    }, [radius]);

    if (!apiKey) {
        return (
            <div className="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 h-80 flex flex-col items-center justify-center gap-3">
                <MapPin className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center px-6">
                    {t('Google Maps API key not configured')}.<br />
                    {t('Set')} <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">VITE_GOOGLE_MAPS_API_KEY</code> {t('to enable the map')}.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    ref={searchRef} type="text" value={searchVal}
                    onChange={e => setSearchVal(e.target.value)}
                    placeholder={t('Search location...')}
                    className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
                />
            </div>
            <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm" style={{ height: 380 }}>
                {loading && (
                    <div className="absolute inset-0 z-10 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    </div>
                )}
                <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                <span>💡</span> {t('Click on the map or drag the marker to set location. Drag the circle edge to adjust radius')}.
            </p>
        </div>
    );
};

// ─── Unified MapPicker ────────────────────────────────────────────────────────

const MapPicker: React.FC<BaseMapProps & { mapType?: 'open-street-map' | 'google-map'; googleMapsApiKey?: string }> = ({
    mapType = 'open-street-map', googleMapsApiKey = '', ...rest
}) => mapType === 'google-map'
        ? <GoogleMapPicker {...rest} apiKey={googleMapsApiKey} />
        : <OSMPicker {...rest} />;

// ─── IP Input ─────────────────────────────────────────────────────────────────

const IpListInput: React.FC<{ value: string[]; onChange: (ips: string[]) => void; disabled?: boolean }> = ({
    value = [], onChange, disabled,
}) => {
    const [inputVal, setInputVal] = useState('');
    const [error, setError] = useState('');

    const isValidIp = (ip: string) =>
        /^(\d{1,3}\.){3}\d{1,3}$/.test(ip) && ip.split('.').every(o => parseInt(o) <= 255);

    const addIp = () => {
        const ip = inputVal.trim();
        if (!ip) { setError('IP cannot be empty'); return; };
        if (!isValidIp(ip)) { setError('Invalid IPv4 address'); return; }
        if (value.includes(ip)) { setError('IP already added'); return; }
        onChange([...value, ip]);
        setInputVal('');
        setError('');
    };

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <input
                    type="text" value={inputVal} placeholder="e.g. 192.168.1.100" disabled={disabled}
                    onChange={e => { setInputVal(e.target.value); setError(''); }}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addIp())}
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all disabled:opacity-50"
                />
                <Button type="button" onClick={addIp} disabled={disabled} size="sm" variant="outline" className="shrink-0">
                    <Plus className="w-4 h-4" />
                </Button>
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            {value.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {value.map(ip => (
                        <span key={ip} className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full border border-blue-200 dark:border-blue-800">
                            <Wifi className="w-3 h-3" />
                            {ip}
                            <button type="button" onClick={() => onChange(value.filter(v => v !== ip))} disabled={disabled} className="hover:text-red-500 transition-colors">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

// ─── Designation Multi-select ─────────────────────────────────────────────────

const DesignationMultiSelect: React.FC<{
    options: DesignationOption[]; value: string[]; onChange: (val: string[]) => void; disabled?: boolean;
}> = ({ options = [], value = [], onChange, disabled }) => {


    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const { t } = useTranslations();

    useEffect(() => {
        const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
        document.addEventListener('mousedown', h);
        return () => document.removeEventListener('mousedown', h);
    }, []);

    const toggle = (val: string) =>
        onChange(value.includes(val) ? value.filter(v => v !== val) : [...value, val]);

    const selected = options.filter(o => value.includes(o.value));

    return (
        <div ref={ref} className="relative">
            <button
                type="button" disabled={disabled} onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all disabled:opacity-50 text-left"
            >
                <span className="flex-1 min-w-0">
                    {selected.length === 0
                        ? <span className="text-gray-400">{t('Select designations')}...</span>
                        : <span className="truncate text-gray-700 dark:text-gray-200">{selected.length} {t('selected')}</span>
                    }
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`} />
            </button>

            {selected.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {selected.map(opt => (
                        <span key={opt.value} className="inline-flex items-center gap-1 px-2 py-0.5 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full border border-purple-200 dark:border-purple-800">
                            {opt.label}
                            <button type="button" onClick={() => toggle(opt.value)} disabled={disabled} className="hover:text-red-500 transition-colors">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {open && (
                <div className="absolute z-50 top-full mt-1 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-52 overflow-y-auto">
                    {options.length === 0
                        ? <div className="px-3 py-6 text-center text-sm text-gray-400">{t('No designations available')}</div>
                        : options.map(opt => (
                            <button
                                key={opt.value} type="button" onClick={() => toggle(opt.value)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                            >
                                <span className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${value.includes(opt.value) ? 'bg-purple-600 border-purple-600 text-white' : 'border-gray-300 dark:border-gray-600'
                                    }`}>
                                    {value.includes(opt.value) && <Check className="w-3 h-3" />}
                                </span>
                                {opt.label}
                            </button>
                        ))
                    }
                </div>
            )}
        </div>
    );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FieldLabel: React.FC<{ label: string; required?: boolean; className?: string }> = ({ label, required, className = '' }) => (
    <label className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ${className}`}>
        {label} {required && <span className="text-red-500">*</span>}
    </label>
);

const FieldError: React.FC<{ message?: string }> = ({ message }) =>
    message ? <p className="mt-1 text-xs text-red-500">{message}</p> : null;

// ─── Main Form ────────────────────────────────────────────────────────────────

export const AttendanceSettingsSaveForm: React.FC<AttendanceSettingsProps> = ({
    distributionHub,
    attendanceSetting,
    designationOptions = [],
    mapType = 'open-street-map',
    googleMapsApiKey = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || '',
}) => {
    const { t } = useTranslations();
    const hub = distributionHub?.data || {};
    const setting = attendanceSetting?.data || null;
    const isUpdate = !!setting?.uuid;

    const extractDesignationCodes = () =>
        setting?.assignments?.map(a => (a?.assignable?.code)) ?? [];

    const defaultValues: AttendanceSettingsFormType = {
        latitude: Number(setting?.latitude) || Number(hub?.latitude) || 23.7956,
        longitude: Number(setting?.longitude) || Number(hub?.longitude) || 90.3537,
        allowed_radius_meter: Number(setting?.allowed_radius_meter) || 500,
        ip_validation_required: setting?.ip_validation_required ?? false,
        whitelisted_ips: setting?.whitelisted_ips || [],
        status: ((typeof setting?.status === 'object' ? setting.status.value : setting?.status) || 'active') as 'active' | 'inactive',
        designation_codes: extractDesignationCodes() as any,
    };

    const form = useForm<AttendanceSettingsFormType>({ resolver: zodResolver(attendanceSettingsSchema), defaultValues });
    const { register, watch, setValue, formState: { errors }, handleSubmit } = form;

    const watchedLat = watch('latitude');
    const watchedLng = watch('longitude');
    const watchedRadius = watch('allowed_radius_meter');
    const watchedIpRequired = watch('ip_validation_required');
    const watchedIps = watch('whitelisted_ips') || [];
    const watchedStatus = watch('status');
    const watchedDesignations = watch('designation_codes') || [];

    const [isSubmitting, setIsSubmitting] = useState(false);

    const onSubmit = (data: any) => {
        setIsSubmitting(true);
        const payload = { ...data, ...(isUpdate ? { attendance_setting_uuid: setting!.uuid } : {}) };
        router.post(
            route('backend.distribution-hubs.attendance.settings.save', hub.uuid as any),
            payload,
            { preserveScroll: true, preserveState: true, onFinish: () => setIsSubmitting(false) }
        );
    };

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

                {/* ── GPS Location & Radius ── */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-red-500" />
                            <CardTitle>{t('GPS Location & Radius')}</CardTitle>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {t('GPS validation is always required. Set the allowed check-in location and radius.')}
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        <MapPicker
                            mapType={mapType}
                            googleMapsApiKey={googleMapsApiKey}
                            latitude={watchedLat}
                            longitude={watchedLng}
                            radius={watchedRadius}
                            onLocationChange={(lat, lng) => {
                                setValue('latitude', parseFloat(lat.toFixed(7)), { shouldValidate: true });
                                setValue('longitude', parseFloat(lng.toFixed(7)), { shouldValidate: true });
                            }}
                            onRadiusChange={r => setValue('allowed_radius_meter', r, { shouldValidate: true })}
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <FieldLabel label={t('Latitude')} required />
                                <input type="number" step="any" {...register('latitude', { valueAsNumber: true })}
                                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" />
                                <FieldError message={errors.latitude?.message as any} />
                            </div>
                            <div>
                                <FieldLabel label={t('Longitude')} required />
                                <input type="number" step="any" {...register('longitude', { valueAsNumber: true })}
                                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" />
                                <FieldError message={errors.longitude?.message as any} />
                            </div>
                            <div>
                                <FieldLabel label={t('Radius (Meters)')} required />
                                <input type="number" step="0.01" min={10} {...register('allowed_radius_meter', { valueAsNumber: true })}
                                    className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all" />
                                <FieldError message={errors.allowed_radius_meter?.message as any} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ── IP Validation ── */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Wifi className="w-5 h-5 text-blue-500" />
                            <CardTitle>{t('IP Validation')}</CardTitle>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {t('Optionally restrict check-ins to specific IP addresses.')}
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-3">
                            <button
                                type="button" role="switch" aria-checked={watchedIpRequired}
                                onClick={() => setValue('ip_validation_required', !watchedIpRequired, { shouldValidate: true })}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${watchedIpRequired ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                                    }`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${watchedIpRequired ? 'translate-x-6' : 'translate-x-1'
                                    }`} />
                            </button>
                            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{t('Enable IP Validation')}</span>
                        </div>

                        {watchedIpRequired && (
                            <div>
                                <FieldLabel label={t('Whitelisted IP Addresses')} />
                                <IpListInput
                                    value={watchedIps}
                                    onChange={ips => setValue('whitelisted_ips', ips, { shouldValidate: true })}
                                    disabled={isSubmitting}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* ── Applicable Designations ── */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-purple-500" />
                            <CardTitle>{t('Applicable Designations')}</CardTitle>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {t('Select which designations this attendance setting applies to. Leave empty to apply to all.')}
                        </p>
                    </CardHeader>
                    <CardContent>
                        <DesignationMultiSelect
                            options={designationOptions}
                            value={watchedDesignations}
                            onChange={val => setValue('designation_codes', val, { shouldValidate: true })}
                            disabled={isSubmitting}
                        />
                    </CardContent>
                </Card>

                {/* ── Settings ── */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-amber-500" />
                            <CardTitle>{t('Settings')}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <FieldLabel label={t('Status')} required />
                                <div className="flex gap-3">
                                    {(['active', 'inactive'] as const).map(s => (
                                        <button
                                            key={s} type="button"
                                            onClick={() => setValue('status', s, { shouldValidate: true })}
                                            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg border transition-all capitalize ${watchedStatus === s
                                                ? s === 'active' ? 'bg-green-600 border-green-600 text-white shadow-sm' : 'bg-red-500 border-red-500 text-white shadow-sm'
                                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-gray-400'
                                                }`}
                                        >
                                            {t(s.charAt(0).toUpperCase() + s.slice(1))}
                                        </button>
                                    ))}
                                </div>
                                <FieldError message={errors.status?.message as any} />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Submit Bar ── */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2 sticky bottom-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4 border-t">
                    <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                        <ButtonLoader
                            isSubmitting={isSubmitting}
                            btnText={isUpdate ? 'Update Settings' : 'Save Settings'}
                            loaderText={isUpdate ? 'Updating...' : 'Saving...'}
                            icon={<Save className="w-4 h-4" />}
                        />
                    </Button>
                    <Button
                        type="button" variant="outline" className="w-full sm:w-auto"
                        onClick={() => router.visit(route('backend.distribution-hubs.index'))}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t('Back')}
                    </Button>
                </div>

            </form>
        </Form>
    );
};

export default AttendanceSettingsSaveForm;