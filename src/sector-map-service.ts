import { Map } from 'core-js/library';
import { RangeService } from './range-service';
import { NamedRangeService, RangeNames } from './named-range-service';
// Google Apps Scripts does not support standard Map

export class SectorMapService {
  constructor(private namedRangeService: NamedRangeService) {}

  import(filename: string): void {
    const systemNames = [];
    const systemEntities = [];
    const systemCoords = [];
    const sectormap = this.getSectorMapFromDrive(filename);
    sectormap.forEach((system, key) => {
      systemNames.push([key]);
      systemCoords.push(system.coords);
      systemEntities.push(system.entities);
    });
    this.namedRangeService.setRange(RangeNames.SystemNames, systemNames);
    this.namedRangeService.setRange(RangeNames.SystemCoords, systemCoords);
    this.namedRangeService.setRange(RangeNames.SystemEntities, systemEntities);
  }

  private getSectorMapFromDrive(filename: string): Map<string, SystemData> {
    const file = this.getFileFromDrive(filename);
    const json = this.getJsonFromFile(file) as JsonMap;
    const rawMap = this.getRawMapFromJson(json);
    const sectorMap = this.getSectorMapFromRawMap(rawMap);
    return sectorMap;
  }

  private getRawMapFromJson(json: JsonMap) {
    const systems = this.getFromJson<RawSystem>(json.system);
    const entities = this.getFromJson<RawMapEntity>([
      json.planet,
      json.deepSpaceStation
    ]);
    const rawMap = new RawSectorMap(systems, entities);
    return rawMap;
  }

  private getSectorMapFromRawMap(
    rawMap: RawSectorMap
  ): Map<string, SystemData> {
    const hierachialMap = new Map<string, SystemData>();
    rawMap.entities.forEach((item, key) => {
      if (item.parentEntity == 'system') {
        const system = rawMap.systems.get(item.parent);
        const sysName = system.name;
        const coords = [system.y, system.x];
        // don't overwrite any existing systems
        if (hierachialMap.has(sysName)) {
          hierachialMap.get(sysName).entities.push(item.name);
        } else {
          hierachialMap.set(sysName, new SystemData(coords, [item.name]));
        }
      }
    });
    return hierachialMap;
  }

  private getFileFromDrive(filename: string): GoogleAppsScript.Drive.File {
    const iter = DriveApp.getFilesByName(filename);
    if (!iter.hasNext()) {
      SpreadsheetApp.getActiveSpreadsheet().toast(
        'Could not find file. Please make sure the file is on your Google Drive.'
      );
    }
    return iter.next();
  }

  private getJsonFromFile(file: GoogleAppsScript.Drive.File): object {
    return JSON.parse(file.getAs('application/json').getDataAsString());
  }

  private getFromJson<T>(obj: object): Map<string, T> {
    const systems = new Map<string, T>();
    if (obj instanceof Array) {
      obj.forEach(item => {
        this.addAllOf(systems, item);
      });
    } else {
      this.addAllOf<T>(systems, obj);
    }
    return systems;
  }

  private addAllOf<T>(target: Map<string, T>, source: object) {
    Object.keys(source).forEach(key => target.set(key, source[key]));
  }
}

// only the ones used are defined, there technically are more
interface JsonMap {
  system: any;
  planet: any;
  deepSpaceStation: any;
}

class RawSectorMap {
  constructor(
    public systems: Map<string, RawSystem>,
    public entities: Map<string, RawMapEntity>
  ) {}
}

interface RawMapEntity {
  name: string;
  parent: string;
  parentEntity: string;
}

interface RawSystem extends RawMapEntity {
  x: any;
  y: any;
}

class SystemData {
  constructor(public coords: number[], public entities: string[]) {}
}
