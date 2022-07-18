import React, { useEffect, useMemo, useRef, useState, useContext, useCallback } from "react";
import { AutoComplete } from 'antd';
import debounce from 'lodash.debounce';
import styled from "styled-components";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { geocode } from "lib/api/map";
import { getTerritory } from "lib/api/map";
import { renderTerritory } from "sections/Home/components/MapBox/layers/territory";
import { MapContext } from "sections/Home/components/MapBox/Context";
import SearchIcon from "sections/Home/components/MapBox/icons/search.svg";
import FilterIcon from "sections/Home/components/MapBox/icons/filter.svg";
import FilterActiveIcon from "sections/Home/components/MapBox/icons/filter_active.svg";

interface Props {
  map: mapboxgl.Map | null;
  country: string | null;
  city: string | null;
  disabled?: boolean;
  onChange?: (center: number[] | null) => void;
}

const AddressFilter: React.FC<Props> = ({ map, country, city, disabled = false, onChange }) => {
  const { onToggleClick, isSidebarOpened, syncAddress, syncCenter, address } = useContext(MapContext);
  const [value, setValue] = useState("");
  const [center, setCenter] = useState<number[] | null>(null);
  const [geocoder, setGeocoder] = useState<MapboxGeocoder | null>(null);
  const [dataSource, setDataSource] = useState<Map.AddressFilterItem[]>();
  const defaultBounds = useMemo(() => [-19.199, 36.825, 52.159, 64.131], []);
  const geocoderRef = useRef(geocoder);
  const addressRef = useRef({ country, city });
  const valueRef = useRef(value);
  const syncAddressRef = useRef(syncAddress);
  const syncCenterRef = useRef(syncCenter);

  const updateAddress = useMemo(() => (
    debounce(async (v: string) => syncAddressRef.current && syncAddressRef.current(v), 500, { leading: true })
  ), []);

  const updateCenter = useMemo(() => (
    debounce(async (v: [number, number] | null) => syncCenterRef.current && syncCenterRef.current(v), 500, { leading: true })
  ), []);

  const onSearch = useCallback((value: string) => {
    if (geocoderRef.current && value) geocoderRef.current.setInput(value);
  }, []);

  const onInput = (value: any) => {
    if (geocoder && !value) {
      geocoder.query("");
      setValue("");
      updateAddress("");
      setCenter(null);
    } else {
      try {
        const v = JSON.parse(value) as Map.AddressFilterValue;
        const val = v.text || `${v}`;
        setValue(val);
        updateAddress(val);
      } catch {
        setValue(value);
        updateAddress(value);
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
    if (address !== valueRef.current) setValue(address || '');
  }, [address, onSearch]);

  useEffect(() => { if (syncAddress) syncAddressRef.current = syncAddress }, [syncAddress]);
  useEffect(() => { if (syncCenter) syncCenterRef.current = syncCenter }, [syncCenter]);
  useEffect(() => { geocoderRef.current = geocoder }, [geocoder]);
  useEffect(() => { addressRef.current = { country, city } }, [country, city]);
  useEffect(() => { valueRef.current = value }, [value]);
  useEffect(() => { if (onChange) onChange(center) }, [center]); // eslint-disable-line
  useEffect(() => { updateCenter(center as [number, number]) }, [updateCenter, center]); // eslint-disable-line

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
    <Wrapper>
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
        getPopupContainer={(trigger: any) => trigger.parentNode}
        dropdownRender={(menu: any) => (
          <OverlayScrollbarsComponent
            style={{ maxHeight: 300 }}
            options={{ scrollbars: { autoHide: 'scroll' } }}
          >
            {menu}
          </OverlayScrollbarsComponent>
        )}
      />
      <FilterButtonWrapper>
        <FilterButton onClick={() => onToggleClick && onToggleClick()} >
          <ImageWrapper><img src={isSidebarOpened ? FilterActiveIcon : FilterIcon} alt="" /></ImageWrapper>
        </FilterButton>
      </FilterButtonWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

const Input = styled(AutoComplete)`

  position: relative;
  width: 100%;

  @media screen and (max-width: 750px) {

    .ant-select-selection {
      box-shadow: 0px 13px 10px rgba(50, 50, 71, 0.05), 0px 22px 28px rgba(50, 50, 71, 0.05) !important;
      border-radius: 500px;
      transform: translateX(-1px);
      width: calc(100% + 1px);
    }

    .ant-select-search__field__wrap {
      cursor: default;
    }

    .ant-select-selection__rendered {
      padding: 7px;
      border-radius: 500px;
      background: #FFFFFF;
      border: 1px solid #F2F2F2;
      border-radius: 500px;
    }
    
    .ant-select-selection__clear {
      right: 56px;
      z-index: 100;
    }

  }

  .ant-select-selection__placeholder {
    padding-left: 38px;

    @media screen and (max-width: 750px) {
      margin-right: 66px !important;
      z-index: 102;
      cursor: text;
    }
  }

  .ant-input {
    padding-left: 48px;
    padding-right: 30px;
    background: #FFFFFF !important;
    border: 1px solid #e9e9e9;
    border-radius: 100px;
    color: #02020B;
    font-size: 14px;
    position: relative;
    
    @media screen and (max-width: 750px) {
      padding-left: 42px;
      border-bottom-right-radius: 20px;
      border-top-right-radius: 20px;
      width: calc(100% - 40px);
      z-index: 100;
      border-color: transparent;
    }
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
    top: 50%;
    transform: translateY(-50%);
    z-index: 100;
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
      box-shadow: -1px -6px 10px rgb(50 50 71 / 5%), 1px -6px 28px rgb(50 50 71 / 5%);
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
    }

    @media screen and (max-width: 750px) {
      & .ant-select-selection__rendered {
        border-bottom-color: transparent;
        border-radius: 25px 25px 0 0;
      }
    }
  }

`;

const FilterButtonWrapper = styled.div`
  background: #fff;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  border-bottom-right-radius: 100px;
  border-top-right-radius: 100px;
  z-index: 200;
  padding: 7px 7px 7px 0;
  display: none;

  @media screen and (max-width: 750px) {
    display: block;
  }
`;

const FilterButton = styled.button`
  background: transparent;
  border: none;
  padding: 8px;
  margin-left: 8px;
  border-bottom-right-radius: 100px;
  border-top-right-radius: 100px;
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  cursor: pointer;
  z-index: 100;
  outline: none;

  &:hover {
    background-color: #F2F2F2;
  }

  &::before {
    content: '';
    display: block;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.102);
    width: 1px;
    height: 40%;
    left: -3px;
    top: 50%;
    transform: translateY(-50%);
    cursor: default;
  }
`;

const ImageWrapper = styled.div`
  height: 15px;
  width: 15px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

export default AddressFilter;
