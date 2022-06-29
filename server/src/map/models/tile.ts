import { PoolClient } from "pg";
import db from "/database/map";

class Tile {

  async get(z: number, x: number, y: number, fields: string[]) {
    let client: PoolClient | null = null;
    try {
      client = await db.connect();
      const result = await client.query<Map.Result.Tile>(
        `SELECT geodata FROM common__tools._get_layer_tile_point($1::int, $2::int, $3::int, $4::text, '')`,
        [z, x, y, fields.join(',')]
      );
      return result.rows[0].geodata;
    } finally {
      client?.release();
    }
  }
  
}

export default new Tile();
