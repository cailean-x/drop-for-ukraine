import { PoolClient } from "pg";
import { Listing as IListing } from "/lib/types";
import db from "/database/map";

class Listing {
  
  async getByFilter(filters: Map.Filters, limit: number | null = 100, offset: number | null = 0) {
    const f = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v != null));
    let client: PoolClient | null = null;
    try {
      client = await db.connect();
      const result = await client.query<Map.Result.Listing>(
        `SELECT fields_json FROM common._get_data($1::json, '', $2::int, $3::int)`, 
        [JSON.stringify(f), limit, offset]
      );
      return result.rows[0].fields_json;
    } finally {
      client?.release();
    }
  }
  
  async getIdsByFilter(filters: Map.Filters, limit: number | null = 100, offset: number | null = 0) {
    const f = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v != null));
    let client: PoolClient | null = null;
    try {
      client = await db.connect();
      const result = await client.query<Map.Result.ListingId>(
        `SELECT fields_json FROM common._get_data_id($1::json, '', $2::int, $3::int)`, 
        [JSON.stringify(f), limit, offset]
      );
      return result.rows[0].fields_json;
    } finally {
      client?.release();
    }
  }

  async insert(listing: IListing) {
    let client: PoolClient | null = null;
    try {
      client = await db.connect();
      await client.query(`SELECT common._provider_insert($1::json)`, [JSON.stringify([listing])]);
    } finally {
      client?.release();
    }
  }

  async delete(id: string) {
    let client: PoolClient | null = null;
    try {
      client = await db.connect();
      await client.query(`SELECT common._provider_delete_user_object_id($1::text)`, [id]);
    } finally {
      client?.release();
    }
  }

}

export default new Listing();
