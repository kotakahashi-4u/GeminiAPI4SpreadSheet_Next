# GeminiAPI4SpreadSheet_Next

## プロジェクトについて

Google Apps Scriptを用いて、Geminiから回答を取得し、スプレッドシートの行列にマッピングする。

## 使い方
1. スプレッドシートのコンテナバインド型としてGASを開く。  
   ※スプレッドシートは以下イメージのような状態  
   　![参考](http://drive.google.com/uc?export=view&id=1xrzPA98VYonXfzswi081xSefoeIjcfyA)
2. GASにmain.gsの内容をコピーする。
3. GEMINI_APIの値を以下「環境変数の一覧」を参考に変更する。
4. onEditTriggerに対して、編集時トリガーを設定する。  
   ![参考](http://drive.google.com/uc?export=view&id=1q3exCDPcIh5i4gv8882HdoGhxvmlSYfR)
5. 上記スプレッドシート上のB1セルに"Geminiへの問い合わせ"を書くことで、A3セル以降に回答が記述される。

## 環境変数の一覧
### GEMINI_API
以下手順により作成する（詳細はYoutubeを参照のこと）。
1. [Google AI Studio](https://ai.google.dev/aistudio)にアクセスする。
2. [Get API Key]よりGemini呼び出し用のAPIキーを作成する。
