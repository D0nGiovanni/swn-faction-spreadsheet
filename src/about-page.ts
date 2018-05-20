export class AboutPage {
  public static showDialog() {
    const html = HtmlService.createHtmlOutputFromFile('public/about-page.html')
      .setWidth(300)
      .setHeight(200);
    SpreadsheetApp.getUi().showModalDialog(html, 'About');
  }
}
