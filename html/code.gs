function doPost(e) {
  try {
    var login = e.parameter.login;
    var password = e.parameter.password;
    var sheet = SpreadsheetApp.openById('15FfMitK9mYUP0IQNFMGoMIlipwJmWYIkvzct4zkFWAs').getSheetByName('Sheet1');
    var data = sheet.getDataRange().getValues();

    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === login && data[i][1] === password) {
        var userInfo = {
          name: data[i][2],
          surname: data[i][3],
          id: data[i][4],
          group: data[i][5],
          passport: data[i][6],
          phone: data[i][7],
          image: data[i][8]
        };
        return ContentService.createTextOutput(JSON.stringify(userInfo)).setMimeType(ContentService.MimeType.JSON);
      }
    }

    return ContentService.createTextOutput("error");
  } catch (error) {
    return ContentService.createTextOutput("Xato: " + error.message);
  }
}
