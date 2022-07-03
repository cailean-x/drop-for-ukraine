import React, { useEffect, useState } from "react";
import { Form, Select, Slider } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import { getFilters } from "lib/utils/map";
interface FiltersProps {
  onChange: (filters: Map.Filter) => void;
}

const MapFilters: React.FC<FiltersProps & FormComponentProps<Map.Filter>> = ({ form, onChange }) => {
  const [filters, setFilters] = useState<Map.Response.Filter | null>(null);

  useEffect(() => {
    (async () => {
      const filters = await getFilters();
      setFilters(filters);
      onChange({ country: '', type: '', capacity: [filters.capacity.min, filters.capacity.max] });
    })();
  }, []); // eslint-disable-line

  return (filters && (
    <Form layout="vertical" className="map-filters-form">
      <Form.Item label="Country">
      {form.getFieldDecorator('country', { initialValue: '' })(
        <Select
          placeholder="Choose a country"
          onChange={value => form.setFieldsValue({ country: value })}
        >
          {['', ...filters.countries].map(value => (
            <Select.Option key={value} value={value}>{value ? value : 'All'}</Select.Option>
          ))}
        </Select>
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
    </Form>
  ));
}

const MapFiltersWrapper = Form.create<FiltersProps & FormComponentProps<Map.Filter>>({ 
  name: "map_filters", 
  onValuesChange: props => props.onChange(props.form.getFieldsValue() as Map.Filter)
})(MapFilters);

export default React.memo(MapFiltersWrapper);
