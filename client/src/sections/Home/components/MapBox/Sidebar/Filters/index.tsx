import React, { useEffect, useMemo, useState } from "react";
import { Form, Select, Slider } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { getFilters, getFilterCities } from "lib/api/map";
import AddressFilter from "sections/Home/components/MapBox/Sidebar/Filters/AddressFilter";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import styled from "styled-components";

interface FiltersProps {
  map: mapboxgl.Map | null;
  filterBounds: boolean;
  onChange: (filters: Map.Filter) => void;
}

const MapFilters: React.FC<FiltersProps & FormComponentProps<Map.Filter>> = ({ map, filterBounds, form, onChange }) => {
  const [filters, setFilters] = useState<Map.Response.Filter | null>(null);
  const [cities, setCities] = useState<string[] | null>(null);
  const country = useMemo(() => form.getFieldValue('country'), [form]);
  const city = useMemo(() => form.getFieldValue('city'), [form]);
  const center = useMemo(() => form.getFieldValue('center'), [form]);

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
    <ScrollView options={{ scrollbars: { autoHide: "scroll" } }}>
      {filters && (
        <FiltersForm layout="vertical">
          <Form.Item label="Country">
            {form.getFieldDecorator('country', { initialValue: '' })(
              <Select
                placeholder="Choose a country"
                disabled={filterBounds}
                onChange={value => form.setFieldsValue({ country: value })}
              >
                {['', ...filters.countries].map(value => (
                  <Select.Option key={value} value={value}>{value ? value : 'All'}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="City">  
            {form.getFieldDecorator('city', { initialValue: '' })(
              <Select
                placeholder="Choose a city"
                onChange={value => form.setFieldsValue({ city: value })}
                disabled={!country || filterBounds}
              >
                {['', ...(cities ? cities : [])].map(value => (
                  <Select.Option key={value} value={value}>{value ? value : 'All'}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Address">
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
          </Form.Item>
          <Form.Item label="Type">
            {form.getFieldDecorator('type', { initialValue: '' })(
              <Select
                placeholder="Choose a type"
                onChange={value => form.setFieldsValue({ type: value })}
              >
                {['', ...filters.types].map(value => (
                  <Select.Option key={value} value={value}>{value ? value : 'All'}</Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item label="Capacity">
            {form.getFieldDecorator('capacity', { initialValue: [filters.capacity.min, filters.capacity.max] })(
              <Slider
                range
                min={filters.capacity.min}
                max={filters.capacity.max}
                onChange={value => form.setFieldsValue({ capacity: value })}
              />
            )}
          </Form.Item>
          <Form.Item label="Distance (km)">
            {form.getFieldDecorator('radius', { initialValue: 25 })(
              <Slider
                min={1}
                max={50}
                disabled={!center || filterBounds}
                onChange={value => form.setFieldsValue({ radius: value })}
              />
            )}
          </Form.Item>
        </FiltersForm>
      )}
    </ScrollView>
  );
}

const MapFiltersWrapper = Form.create<FiltersProps & FormComponentProps<Map.Filter>>({ 
  name: "map_filters", 
  onValuesChange: props => props.onChange(props.form.getFieldsValue() as Map.Filter),
})(MapFilters);

const ScrollView = styled(OverlayScrollbarsComponent)`
  height: 100%;
  max-height: 100%;
`;

const FiltersForm = styled(Form)`
  padding: 15px;

  & .ant-form-item {
    margin-bottom: 15px;
  }
`;

export default React.memo(MapFiltersWrapper);
