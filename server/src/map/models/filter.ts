import { PoolClient } from "pg";
import db from "/database/map";

class Filter {
  
  async get() {
    let client: PoolClient | null = null;
    try {
      client = await db.connect();
      const country = await client.query<Map.Result.FilterCountry>(`SELECT fields_json FROM common._get_filter_values_country()`);
      const type = await client.query<Map.Result.FilterType>(`SELECT fields_json FROM common._get_filter_values_type()`);
      const capacity = await client.query<Map.Result.FilterCapacity>(`SELECT fields_json FROM common._get_filter_values_capacity()`);
      return {
        countries: country.rows[0].fields_json.map(i => i.name),
        types: type.rows[0].fields_json.map(i => i.name),
        capacity: [capacity].map(({ rows }) => ({ min: rows[0].fields_json.min_value, max: rows[0].fields_json.max_value }))[0],
      }
    } finally {
      client?.release();
    }
  }
  
  async getCities(country: string) {
    let client: PoolClient | null = null;
    try {
      client = await db.connect();
      const cities = await client.query<Map.Result.FilterCity>(
        `SELECT fields_json FROM common._get_filter_values_city($1::json);`,
        [JSON.stringify({ country })]
      );
      return cities.rows[0].fields_json.map(i => i.name);
    } finally {
      client?.release();
    }
  }
  
}

export default new Filter();
