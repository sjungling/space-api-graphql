/* eslint-disable @typescript-eslint/no-explicit-any */
import { SQLDataSource } from "datasource-sql";
import { DataSource } from "apollo-datasource";
import { join } from "path";

const databasePath = join(__dirname, "db", "apollo.sqlite3");
const knexConfig = {
  client: "sqlite3",
  connection: {
    filename: databasePath,
  },
  useNullAsDefault: false,
};

class MyDatabase extends SQLDataSource {
  knex: any;
  constructor(config: any) {
    super(config);
  }
  getMissions() {
    return this.knex.select("*").from("missions");
  }
  getMissionById(mission_id: number) {
    return this.knex
      .select("*")
      .from("missions")
      .where({ id: mission_id })
      .limit(1);
  }
  getMissionMediaById(mission_id: number) {
    return this.knex.select("*").from("media").where({ mission_id });
  }
  getMissionsByAstronaut(crew_id: number) {
    return this.knex
      .select("missions.*")
      .from("missions")
      .join("mission_crew", "missions.id", "=", "mission_crew.mission_id")
      .where({
        crew_id: crew_id,
      });
  }
  getAstronautsByMission(mission_id: number) {
    return this.knex
      .select("crew.*")
      .from("crew")
      .join("mission_crew", "crew.id", "=", "mission_crew.crew_id")
      .where({
        mission_id: mission_id,
      });
  }
  getAstronauts() {
    return this.knex.select("*").from("crew");
  }
  getAstronautById(astronaut_id: number) {
    return this.knex
      .select("*")
      .from("crew")
      .where({ id: astronaut_id })
      .limit(1);
  }
}

export const dataSources = (): { [key: string]: DataSource } => ({
  db: new MyDatabase(knexConfig) as DataSource,
});
