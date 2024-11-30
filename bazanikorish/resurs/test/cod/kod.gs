function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  const data = sheet.getDataRange().getValues();

  const time = data[0][1]; // Test vaqti
  const questionCount = data[1][1]; // Savollar soni
  const questions = [];

  for (let i = 2; i < data.length; i++) {
    questions.push({
      question: data[i][0],
      correct: data[i][1],
      options: [data[i][1], data[i][2], data[i][3], data[i][4]]
    });
  }

  // Random orqali savollar olish
  const selectedQuestions = [];
  while (selectedQuestions.length < questionCount) {
    const randomIndex = Math.floor(Math.random() * questions.length);
    if (!selectedQuestions.includes(questions[randomIndex])) {
      selectedQuestions.push(questions[randomIndex]);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({
    time: time,
    questions: selectedQuestions
  })).setMimeType(ContentService.MimeType.JSON);
}
