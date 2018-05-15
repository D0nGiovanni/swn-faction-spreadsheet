import { Map } from 'core-js/library';
// Google Apps Scripts does not support standard Map

export class SectorMapService {
  constructor(private spreadsheet: GoogleAppsScript.Spreadsheet.Spreadsheet) {}

  import(filename: string): void {
    var sectormap = this.getSectorMapFromDrive(filename);
    var ranges = this.spreadsheet.getNamedRanges();
    var systemNameRange = ranges
      .filter(el => el.getName() == systemNameRangeName)[0]
      .getRange();
    var systemEntityRange = ranges
      .filter(el => el.getName() == systemEntityRangeName)[0]
      .getRange();

    var systemNames: string[][] = [];
    var systemEntities: string[][] = [];
    sectormap.forEach((val, key) => {
      systemNames.push([key]);
      systemEntities.push(val);
    });
    // Range.setValues requires the input arrays to have the same dimensions
    this.fillArrays(
      systemNames,
      systemEntities,
      systemNameRange.getHeight(),
      systemEntityRange.getWidth()
    );
    systemNameRange.setValues(systemNames);
    systemEntityRange.setValues(systemEntities);
  }

  private fillArrays(
    systemNames: string[][],
    systemEntities: string[][],
    height: number,
    width: number
  ): void {
    while (systemNames.length < height) {
      systemNames.push(['']);
      systemEntities.push(['']);
    }
    systemEntities.forEach(row => {
      while (row.length < width) row.push('');
    });
  }

  private getSectorMapFromDrive(filename: string): Map<string, string[]> {
    var file = this.getFileFromDrive(filename);
    var json = this.getJsonFromFile(file) as JsonMap;
    var rawMap = this.getRawMapFromJson(json);
    var sectorMap = this.getSectorMapFromRawMap(rawMap);
    return sectorMap;
  }

  private getRawMapFromJson(json: JsonMap) {
    var systems = this.getFromJson<System>(json.system);
    var entities = this.getFromJson<MapEntity>([
      json.planet,
      json.deepSpaceStation
    ]);
    var rawMap = new RawSectorMap(systems, entities);
    return rawMap;
  }

  private getSectorMapFromRawMap(rawMap: RawSectorMap): Map<string, string[]> {
    var hierachialMap = new Map<string, string[]>();
    rawMap.entities.forEach((item, key) => {
      if (item.parentEntity == 'system') {
        var sysName = rawMap.systems.get(item.parent).name;
        // don't overwrite any entries
        if (hierachialMap.has(sysName)) {
          hierachialMap.get(sysName).push(item.name);
        } else {
          hierachialMap.set(sysName, [item.name]);
        }
      }
    });
    return hierachialMap;
  }

  private getFileFromDrive(filename: string): GoogleAppsScript.Drive.File {
    var iter = DriveApp.getFilesByName(filename);
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
    var systems = new Map<string, T>();
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

// sreadsheet ranges
const systemNameRangeName = 'SystemNames';
const systemEntityRangeName = 'SystemEntities';

// only the ones used are defined, there technically are more
interface JsonMap {
  system: any;
  planet: any;
  deepSpaceStation: any;
}

class RawSectorMap {
  systems: Map<string, System>;
  entities: Map<string, MapEntity>;
  constructor(systems: Map<string, System>, entities: Map<string, MapEntity>) {
    this.systems = systems;
    this.entities = entities;
  }
}

interface MapEntity {
  name: string;
  parent: string;
  parentEntity: string;
}

interface System extends MapEntity {
  x: number;
  y: number;
}
