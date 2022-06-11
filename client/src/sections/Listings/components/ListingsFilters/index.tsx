import React from "react";
import { Select } from "antd";
import { ListingsFilter } from "../../../../lib/graphql/globalTypes";

interface Props {
  filter: ListingsFilter;
  setFilter: (filter: ListingsFilter) => void;
}

const { Option } = Select;

export const ListingsFilters = ({ filter, setFilter }: Props) => {
  return (
    <div className="listings-filters">
      <span>Filter By</span>
      <Select
        value={filter}
        onChange={(filter: ListingsFilter) => setFilter(filter)}
      >
        <Option value={ListingsFilter.PRICE_LOW_TO_HIGH}>
          Size: Small to Large
        </Option>
        <Option value={ListingsFilter.PRICE_HIGH_TO_LOW}>
          Size: Large to Small
        </Option>
      </Select>
    </div>
  );
};
