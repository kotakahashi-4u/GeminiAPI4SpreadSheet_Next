const GEMINI_API = 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
// GEMINI_APIの作成の仕方はYoutubeで！

// 本来はシンプルトリガーでやりたいところだが、
// シンプルトリガーの場合はUrlFetchAppはエラーとなる
// ※script.external_requestへのスコープを与えたとしてもエラー
function onEditTrigger(e) {
  const range = e.range;
  // 特定の行/列のときのみ実行
  if (range.getColumn() === 2 && range.getRow() === 1) {
    const sheet = e.source.getActiveSheet();
    try {
      const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API}`,
            payload = {
              'contents': [{
                'parts': [{
                  'text': e.value
                }]
              }]
            },
            options = {
              'method': 'post',
              'contentType': 'application/json',
              'payload': JSON.stringify(payload)
            },
            res = UrlFetchApp.fetch(url, options),
            resJson = JSON.parse(res.getContentText());
      if (resJson && resJson.candidates && resJson.candidates.length > 0) {
        // Geminiの回答を取得
        let geminiResponseText = resJson.candidates[0].content.parts[0].text,
            responses = geminiResponseText.split(/\n/),         // 改行ごとに分割
            textArray = new Array();
        responses.forEach(function(strLine){
          if (strLine.startsWith('|')) {                        // マークダウンの表記法である | が開始文字かを判断
            if (!strLine.startsWith('|--')) {                   // 表記法の 2 行目を示す |---| は除く
              textArray.push(strLine.slice(1, -1).split('|'));  // 表記法の場合、1カラムが | aaa | bbb | といった具合になる
            }
          } else if (strLine.trim().length > 0) {
            textArray.push([strLine]);                          // 通常文字列の場合も配列としてpush
          }
        });
        // textArrayはジャグ配列となっているため最大列数を把握する。
        // 参考：const maxColumns = Math.max(...textArray.map(row => row.length));
        let maxColumns = 0;
        textArray.forEach(function(row){
          if (row.length > maxColumns) {
            maxColumns = row.length;
          }
        });
        // ジャグ配列はそのままではスプレッドシートに一括貼り付けできないため、最大列数で作り直す
        const resultArray = textArray.map(function(row) {
          if (row.length < maxColumns) {
            // 要素数が足りない場合は空文字''を追加
            return row.concat(Array(maxColumns - row.length).fill(''));
          } else {
            return row;
          }
        });
        sheet.getRange(3, 1, resultArray.length, resultArray[0].length).setValues(resultArray);
      } else {
        sheet.getRange(3, 1).setValue('申し訳ございません。Geminiから回答を得ることができません');
      }
    } catch (ex) {
      console.log(ex.toString());
    }
  }
}

