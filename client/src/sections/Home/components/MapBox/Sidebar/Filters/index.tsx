import React, { useEffect, useMemo, useState, useContext } from "react";
import { Form, Select, Slider } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import styled, { css } from "styled-components";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { getFilters, getFilterCities } from "lib/api/map";
import { getRoundedCapacity, formatNumber } from "lib/utils/map";
import AddressFilter from "sections/Home/components/MapBox/Sidebar/Filters/AddressFilter";
import { MapContext } from "sections/Home/components/MapBox/Context";
import MarkerIcon from "sections/Home/components/MapBox/icons/marker.svg";

interface FiltersProps {
  map: mapboxgl.Map | null;
  filterBounds: boolean;
  onChange: (filters: Map.Filter) => void;
  showBorder: boolean;
}

const MapFilters: React.FC<FiltersProps & FormComponentProps<Map.Filter>> = ({ map, filterBounds, form, onChange, showBorder }) => {
  const { syncCountry, syncCity, center: syncCenter } = useContext(MapContext);
  const [filters, setFilters] = useState<Map.Response.Filter | null>(null);
  const [cities, setCities] = useState<string[] | null>(null);
  const country = useMemo(() => form.getFieldValue('country'), [form]);
  const city = useMemo(() => form.getFieldValue('city'), [form]);
  const center = useMemo(() => form.getFieldValue('center'), [form]);

  useEffect(() => {
    form.setFieldsValue({ center: syncCenter })
  }, [syncCenter]); // eslint-disable-line

  useEffect(() => {
    if (syncCountry && country) syncCountry(country);
  }, [syncCountry, country]);

  useEffect(() => {
    if (syncCity && city) syncCity(city);
  }, [syncCity, city]);

  useEffect(() => {
    (async () => {
      if (country) {
        const cities = await getFilterCities(country);
        setCities(cities);
      } else {
        setCities([]);
      }
      if (city) form.setFieldsValue({ city: '' });
    })();
  }, [country]); // eslint-disable-line

  useEffect(() => {
    (async () => {
      const filters = await getFilters();
      setFilters(filters);
      onChange({ country: '', city: '', type: '', capacity: [filters.capacity.min, filters.capacity.max] });
    })();
  }, []); // eslint-disable-line

  return (
    <>
      <Title showBorder={showBorder}>Search collection points</Title>
      <ScrollViewWrapper>
        <ScrollView options={{ scrollbars: { autoHide: "scroll" }, overflowBehavior: { x: "hidden" } }}>
          {filters && (
            <FiltersWrapper showBorder={showBorder}>
              <Form layout="vertical">
                <FIltersItem label="Filter by country" disabled={filterBounds}>
                  {form.getFieldDecorator('country', { initialValue: '' })(
                    <FilterSelect
                      dropdownClassName="map-dropdown"
                      placeholder="Choose a country"
                      disabled={filterBounds}
                      onChange={(value: any) => form.setFieldsValue({ country: value })}
                      onFocus={console.log}
                      getPopupContainer={(trigger: any) => trigger.parentNode}
                      dropdownRender={(menu: any) => (
                        <OverlayScrollbarsComponent
                          style={{ maxHeight: 300 }}
                          options={{ scrollbars: { autoHide: 'scroll' } }}
                        >
                          {menu}
                        </OverlayScrollbarsComponent>
                      )}
                    >
                      {['', ...filters.countries].map(value => (
                        <Select.Option key={value} value={value}>{value ? value : 'All'}</Select.Option>
                      ))}
                    </FilterSelect>
                  )}
                </FIltersItem>
                <FIltersItem label="Select city" disabled={!country || filterBounds}>  
                  {form.getFieldDecorator('city', { initialValue: '' })(
                    <FilterSelect
                      dropdownClassName="map-dropdown"
                      placeholder="Choose a city"
                      onChange={(value: any) => form.setFieldsValue({ city: value })}
                      getPopupContainer={(trigger: any) => trigger.parentNode}
                      disabled={!country || filterBounds}
                      dropdownRender={(menu: any) => (
                        <OverlayScrollbarsComponent
                          style={{ maxHeight: 300 }}
                          options={{ scrollbars: { autoHide: 'scroll' } }}
                        >
                          {menu}
                        </OverlayScrollbarsComponent>
                      )}
                    >
                      {['', ...(cities ? cities : [])].map(value => (
                        <Select.Option key={value} value={value}>{value ? value : 'All'}</Select.Option>
                      ))}
                    </FilterSelect>
                  )}
                </FIltersItem>
                <AddressItem label="Enter your address" disabled={filterBounds}>
                  {form.getFieldDecorator('center', { initialValue: null })(
                    <>
                      <AddressFilter 
                        map={map}
                        country={country}
                        city={city}
                        disabled={filterBounds}
                        onChange={center => form.setFieldsValue({ center })}
                      />
                    </>
                  )}
                </AddressItem>
                <FIltersItem label="Type">
                  {form.getFieldDecorator('type', { initialValue: '' })(
                    <FilterSelect
                      dropdownClassName="map-dropdown"
                      placeholder="Choose a type"
                      onChange={(value: any) => form.setFieldsValue({ type: value })}
                      getPopupContainer={(trigger: any) => trigger.parentNode}
                      dropdownRender={(menu: any) => (
                        <OverlayScrollbarsComponent
                          style={{ maxHeight: 300 }}
                          options={{ scrollbars: { autoHide: 'scroll' } }}
                        >
                          {menu}
                        </OverlayScrollbarsComponent>
                      )}
                    >
                      {['', ...filters.types].map(value => (
                        <Select.Option key={value} value={value}>{value ? value : 'All'}</Select.Option>
                      ))}
                    </FilterSelect>
                  )}
                </FIltersItem>
                <FIltersItem label="Capacity (m²)">
                  {form.getFieldDecorator('capacity', { initialValue: [filters.capacity.min, filters.capacity.max] })(
                    <FilterSlider
                      range
                      marks={{
                        [getRoundedCapacity(filters.capacity.min, "min")]: formatNumber(getRoundedCapacity(filters.capacity.min, "min")),
                        [getRoundedCapacity(filters.capacity.max, "max")]: formatNumber(getRoundedCapacity(filters.capacity.max, "max")),
                      }}
                      min={getRoundedCapacity(filters.capacity.min, "min")}
                      max={getRoundedCapacity(filters.capacity.max, "max")}
                      onChange={value => form.setFieldsValue({ capacity: value })}
                    />
                  )}
                </FIltersItem>
                <FIltersItem label="Distance (km)" disabled={!center || filterBounds}>
                  {form.getFieldDecorator('radius', { initialValue: 30 })(
                    <FilterSlider
                      min={1}
                      max={50}
                      marks={{ 1: '1', 50: '50' }}
                      disabled={!center || filterBounds}
                      onChange={value => form.setFieldsValue({ radius: value })}
                    />
                  )}
                </FIltersItem>
              </Form>
            </FiltersWrapper>
          )}
        </ScrollView>
      </ScrollViewWrapper>
    </>
  );
}

const MapFiltersWrapper = Form.create<FiltersProps & FormComponentProps<Map.Filter>>({ 
  name: "map_filters", 
  onValuesChange: props => props.onChange(props.form.getFieldsValue() as Map.Filter),
})(MapFilters);

const FiltersWrapper = styled.div<{ showBorder: boolean }>`
  padding: ${(props: { showBorder: boolean }) => props.showBorder ? '0 20px 0 2px' : '0 20px'};

  @media screen and (max-width: 750px) {
    padding: 0 20px !important;
  }
`;

const Title = styled.div<{ showBorder: boolean }>`
  font-family: 'Rubik';
  font-weight: 500;
  font-size: 16px;
  color: #02020B;
  padding: ${(props: { showBorder: boolean }) => props.showBorder ? '0 20px 0 2px' : '0 20px'};
  margin: 0px 0 15px 0;

  @media screen and (max-width: 750px) {
    padding: 0 20px !important;
  }
`;

const ScrollViewWrapper = styled.div`
  height: 1px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ScrollView = styled(OverlayScrollbarsComponent)`
  height: 100%;
  max-height: 100%;
`;

const FIltersItem = styled<any>(Form.Item)`
  margin-bottom: 15px;

  & .ant-form-item-label, & .ant-form-item-label label {
    margin-bottom: 10px;
    font-size: 14px;
    color: #02020B;
    ${(props: { disabled?: boolean }) => props.disabled && css`
      color: #757575;
    `}
  }
`;

const AddressItem = styled(FIltersItem)`
  @media screen and (max-width: 750px) {
    display: none;
  }
`;

const FilterSelect = styled<any>(Select)`

  position: relative;

  &:hover:not(.ant-select-disabled) .ant-select-selection,
  &.ant-select-focused:not(.ant-select-disabled) .ant-select-selection {
    border-color: #4095DA;
  }

  &:hover:not(.ant-select-disabled) .ant-select-arrow-icon,
  &.ant-select-focused:not(.ant-select-disabled) .ant-select-arrow-icon  {
    color: #4095DA;
  }

  &.ant-select-focused:not(.ant-select-disabled) .ant-select-selection {
    box-shadow: 0 0 0 2px rgb(24 144 255 / 20%);
  }

  & .ant-select-selection {
    background: #FFFFFF;
    border: 1px solid #e9e9e9;
    border-radius: 100px;
    color: #02020B;
    font-size: 14px;
  }

  &.ant-select-disabled .ant-select-selection {
    color: #757575 !important;
  }

  &.ant-select-open {
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
  }

  &[id=map_filters_country] .ant-select-selection-selected-value,
  &[id=map_filters_city] .ant-select-selection-selected-value {
    padding-left: 20px;

    &::before {
      content: '';
      display: inline-flex;
      width: 16px;
      height: 16px;
      background-image: url(${MarkerIcon});
      background-repeat: no-repeat;
      background-size: contain;
      transform: translate(-12px, 3px);
    }
  }

  &[id=map_filters_type] .ant-select-selection-selected-value {
    padding: 0 10px;
  }

`;

const FilterSlider = styled(Slider)`
  & .ant-slider-track {
    background-color: #4095DA;
  }

  & .ant-slider-handle {
    border: solid 2px #4095DA;
  }

  & .ant-slider-disabled .ant-slider-track {
    background-color: #757575 !important;
  }

  & .ant-slider-disabled .ant-slider-handle {
    border: solid 2px #757575;
  }
`;

export default React.memo(MapFiltersWrapper);
