import React, { useEffect, useMemo, useRef, useState } from "react";
import { AutoComplete } from 'antd';
import styled from "styled-components";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { geocode } from "lib/api/map";
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { renderTerritory } from "sections/Home/components/MapBox/layers/territory";
import { getTerritory } from "lib/api/map";
import SearchIcon from "sections/Home/components/MapBox/icons/search.svg";

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
  const addressRef = useRef({ country, city });

  useEffect(() => { geocoderRef.current = geocoder }, [geocoder]);
  useEffect(() => { addressRef.current = { country, city } }, [country, city]);
  useEffect(() => { onChange(center) }, [center]); // eslint-disable-line

  useEffect(() => {
    (async () => {
      if (!map || !geocoderRef.current) return;
      if (country || city) {
        const address = `${city ? city + ', ' : ''}${country}`;
        await Promise.all([async () => {
          const g = await geocode(address);
          const result = g.results[0];
          if (result && geocoderRef.current && (addressRef.current.country || addressRef.current.city)) {
            const b = result.geometry.viewport;
            const countryInfo = result.address_components.find(c => c.types.includes("country"));
            const bounds = [b.southwest.lng, b.southwest.lat, b.northeast.lng, b.northeast.lat];
            geocoderRef.current.setBbox(bounds as any);
            map.fitBounds(bounds as any);
            if (countryInfo) {
              geocoderRef.current.setCountries(countryInfo.short_name.toLocaleLowerCase());
            }
          }
        }, async () => {
          const territory = await getTerritory(address);
          if (addressRef.current.country || addressRef.current.city) {
            renderTerritory(map, territory);
          }
        }].map(f => f()));
      } else {
        geocoderRef.current.setBbox(defaultBounds as any);
        geocoderRef.current.setCountries("");
        map.fitBounds(defaultBounds as any);
        renderTerritory(map);
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
    <Input
      dropdownClassName="map-dropdown"
      placeholder="E.g.: New World, 78"
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


const Input = styled(AutoComplete)`

  & .ant-input {
    background: #FFFFFF;
    border: 1px solid #e9e9e9;
    border-radius: 100px;
    color: #02020B;
    font-size: 14px;
  }

  & .ant-select-auto-complete.ant-select .ant-input[disabled] {
    color: #757575 !important;
  }

  &.ant-select-disabled .ant-select-selection {
    background: transparent;
  }

  & .ant-select-auto-complete.ant-select .ant-input:focus,
  & .ant-select-auto-complete.ant-select .ant-input:hover {
    border-color: #4095DA;
  }


  &.ant-select-open .ant-select-selection[aria-expanded="true"] {
    z-index: 100;
    
    &::before {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 60px;
      left: 0;
      top: calc(100% - 20px);
      background: #FFFFFF;
      border: 1px solid #F2F2F2;
      box-shadow: 0px 13px 10px rgb(50 50 71 / 5%), 0px 22px 28px rgb(50 50 71 / 5%);
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
    }
  }


  & {
    position: relative;

    .ant-select-selection__placeholder {
      padding-left: 38px;
    }

    .ant-input {
      padding-left: 48px;
    }

    &::after {
      content: '';
      display: inline-flex;
      width: 13px;
      height: 13px;
      background-image: url(${SearchIcon});
      background-repeat: no-repeat;
      background-size: contain;
      position: absolute;
      left: 22px;
      top: 9px;
      z-index: 100;
    }
  }

`;

export default AddressFilter;
