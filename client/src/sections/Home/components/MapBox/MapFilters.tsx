import React from "react";
import { Form, Select, Slider } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
import "mapbox-gl/dist/mapbox-gl.css";

export interface Filters {
  country: string;
  type: string;
  capacity: number[];
}

interface FiltersProps {
  onChange: (filters: Filters) => void;
  countries: string[];
  types: string[];
  capacity: { min: number; max: number };
}

const MapFilters: React.FC<FiltersProps & FormComponentProps<Filters>> = ({ form, countries, types, capacity }) => {
  return (
    <Form layout="vertical" >
      <Form.Item label="Country">
      {form.getFieldDecorator('country', { initialValue: countries[0] })(
        <Select
          placeholder="Choose a country"
          onChange={value => form.setFieldsValue({ country: value })}
        >
          {countries.map(value => (
            <Select.Option key={value} value={value}>{value ? value : 'All'}</Select.Option>
          ))}
        </Select>
      )}
      </Form.Item>
      <Form.Item label="Type">
        {form.getFieldDecorator('type', { initialValue: types[0] })(
          <Select
            placeholder="Choose a type"
            onChange={value => form.setFieldsValue({ type: value })}
          >
            {types.map(value => (
              <Select.Option key={value} value={value}>{value ? value : 'All'}</Select.Option>
            ))}
          </Select>
        )}
      </Form.Item>
      <Form.Item label="Capacity">
        {form.getFieldDecorator('capacity', { initialValue: [capacity.min, capacity.max] })(
          <Slider
            range
            min={capacity.min}
            max={capacity.max}
            onChange={value => form.setFieldsValue({ capacity: value })}
          />
        )}
      </Form.Item>
    </Form>
  );
}

const MapFiltersWrapper = Form.create<FiltersProps & FormComponentProps<Filters>>({ 
  name: "map_filters", 
  onValuesChange: props => props.onChange(props.form.getFieldsValue() as Filters)
})(MapFilters);

export default MapFiltersWrapper;
