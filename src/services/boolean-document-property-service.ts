export class BooleanDocumentPropertyService {
  private documentProperties = PropertiesService.getDocumentProperties();
  public initIfNotExists(name: string) {
    const property = this.documentProperties.getProperty(name);
    if (property == null) {
      this.set(name, false);
    }
  }

  public get(name: string): boolean {
    const value = this.documentProperties.getProperty(name);
    return value === 'true';
  }

  public set(name: string, value: boolean): void {
    this.documentProperties.setProperty(name, value.toString());
  }

  public toggle(name: string): boolean {
    const value = !this.get(name);
    this.set(name, value);
    return value;
  }
}

export const AutoNoteProperty = 'AutoNote';
export const OverwriteNoteProperty = 'OverwriteNote';
