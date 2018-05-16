export class BooleanDocumentPropertyService {
  private documentProperties = PropertiesService.getDocumentProperties();

  constructor() {}

  initIfNotExists(name: string) {
    var property = this.documentProperties.getProperty(name);
    if (property == null) this.set(name, false);
  }

  get(name: string): boolean {
    var value = this.documentProperties.getProperty(name);
    return value == 'true';
  }

  set(name: string, value: boolean): void {
    this.documentProperties.setProperty(name, value.toString());
  }

  toggle(name: string): boolean {
    const value = !this.get(name);
    this.set(name, value);
    return value;
  }
}

export const AutoNoteProperty = 'AutoNote';
export const OverwriteNoteProperty = 'OverwriteNote';
