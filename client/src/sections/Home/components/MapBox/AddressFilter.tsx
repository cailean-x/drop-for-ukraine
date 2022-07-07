import React, { useEffect, useMemo, useRef, useState } from "react";
import { AutoComplete } from 'antd';
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { geocode } from "lib/api/map";
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

interface Props {
  map: mapboxgl.Map | null;
  country: string | null;
  city: string | null;
  disabled?: boolean;
  onChange: (center: number[] | null) => void;
}

const AddressFilter: React.FC<Props> = ({ map, country, city, disabled = false, onChange }) => {
  const [value, setValue] = useState("");
  const [center, setCenter] = useState<number[] | null>(null);
  const [geocoder, setGeocoder] = useState<MapboxGeocoder | null>(null);
  const [dataSource, setDataSource] = useState<Map.AddressFilterItem[]>();
  const defaultBounds = useMemo(() => [-19.199, 36.825, 52.159, 64.131], []);
  const geocoderRef = useRef(geocoder);

  useEffect(() => { geocoderRef.current = geocoder }, [geocoder]);
  useEffect(() => { onChange(center) }, [center]); // eslint-disable-line

  useEffect(() => {
    (async () => {
      if (!map || !geocoderRef.current) return;
      if (country || city) {
        const address = `${city ? city + ', ' : ''}${country}`;
        const g = await geocode(address);
        if (g.results[0]) {
          const b = g.results[0].geometry.bounds;
          const bounds = [b.southwest.lng, b.southwest.lat, b.northeast.lng, b.northeast.lat];
          geocoderRef.current.setBbox(bounds as any);
          map.fitBounds(bounds as any);
        }
      } else {
        geocoderRef.current.setBbox(defaultBounds as any);
        map.fitBounds(defaultBounds as any);
      }
      setValue("");
      setCenter(null);
    })();
  }, [map, country, city, defaultBounds]);

  const onSearch = (value: string) => {
    if (geocoder && value) geocoder.setInput(value);
  }

  const onInput = (value: any) => {
    if (geocoder && !value) {
      geocoder.query("");
      setValue("");
      setCenter(null);
    } else {
      try {
        const v = JSON.parse(value) as Map.AddressFilterValue;
        setValue(v.text || `${v}`);
      } catch {
        setValue(value);
      }
    }
  }

  const onSelect = (value: any) => {
    const v = JSON.parse(value) as Map.AddressFilterValue;
    if (geocoder) {
      const limit = geocoder.getLimit();
      geocoder.setLimit(1);
      geocoder.query(v.query);
      setCenter(v.center);
      setDataSource([]);
      setTimeout(() => geocoder.setLimit(limit), 1000);
    }
  }

  useEffect(() => {
    if (!map) return;
    const accessToken = process.env.REACT_APP_MAPBOX_TOKEN || "";
    const geocoder = new MapboxGeocoder({ accessToken, marker: false, bbox: defaultBounds as any, language: 'en', flyTo: false });
    geocoder.on("results", (e: MapboxGeocoder.Results) => {
      if (e.features.length !== 1) {
        const results = e.features.map((f: any) => ({
          text: f.place_name,
          value: JSON.stringify({
            text: f.place_name,
            center: f.center,
            query: f.matching_place_name || f.place_name,
          }),
        }));
        setDataSource(results);
      }
    });
    map.addControl(geocoder);
    setGeocoder(geocoder);
  }, [map, defaultBounds]);

  return (
    <AutoComplete
      value={value}
      dataSource={dataSource}
      onSearch={onSearch}
      onSelect={onSelect}
      onChange={onInput}
      disabled={disabled}
      allowClear
    />
  );
}

export default AddressFilter;
