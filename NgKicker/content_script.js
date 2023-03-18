// ★解説済み★
// ＜$(function(){}); 形式について＞
// $(function(){}); は、jQueryにおいてDOMが読み込まれたときに自動的に
// 実行される関数です。
// 
// この形式は、$(document).ready()と同じ意味を持っています。つまり、
// HTMLドキュメントが読み込まれて、DOMが完全に構築された時点で
// JavaScriptコードを実行するためのものです。
// 
// この形式を使うことで、DOM要素がまだ完全にロードされていない場合に
// JavaScriptコードが実行されることを防ぐことができます。また、複数の
// スクリプトを含むWebページでも、必要なスクリプトが他のスクリプトよりも先に
// 実行されることを保証することができます。
// 
// なお、$()はjQueryのショートハンドで、これによってjQueryオブジェクトを
// 作成しています。このオブジェクトを利用して、DOM要素を操作したり、イベントを
// 処理したりすることができます。


// このコードは、Chrome拡張機能のコンテンツスクリプト内で実行されるものです。
// 具体的には、Chrome拡張機能でローカルストレージに保存されたキーワードに
// 基づいて、特定のWebページ上から特定の要素を削除するための処理を行います。
$(function(){
	// chrome.storage.localオブジェクトを使って、ローカルストレージ内に
	// 保存された"word"と"bool"という2つのキーを取得しています。
	// "value"という変数に、取得した値が格納されます。
	chrome.storage.local.get(['word','bool'],function(value) {

		// 取得した値をログに出力しています。
		// ${}を使って、テンプレートリテラルを使っています。
		// 
		// ＜テンプレートリテラルとは＞
		// テンプレートリテラルとは、JavaScriptにおける文字列の表現方法の
		// 一つで、バッククォート (`) を使って文字列を囲み、${} 内に式を
		// 記述することで、文字列内で動的に値を埋め込むことができます。
		// これにより、複雑な文字列を簡単に組み立てることができるようになります。
		console.log(`ローカルストレージの内容: ${value.word,value.bool}`);

		// ローカルストレージ内の"bool"の値がtrueである場合、以下の処理を実行します。
		if (value.bool) {
			// APIエンドポイントのURLを定義しています。
			const url = "https://Chrome-extension.ryotaasai.repl.co?word=";

			// ローカルストレージ内の"word"の値の数だけループを回します。
			// このコードブロックは、ローカルストレージに保存されたvalue.word配列内の
			// 各単語を使用してAPIにリクエストを送信し、取得した5つの単語を使用して
			// Webページのテキストをスキャンし、そのテキスト内に含まれる単語を
			// 非表示にするための処理を行います。
			for (i = 0; i < value.word.length; i++) {
				console.log(i + " : " + value.word[i]);

				// fetch関数を使用して、APIに対してvalue.word[i]単語を
				// 検索するリクエストを送信します。このリクエストには、
				// 検索クエリを含むURLが使用されます。APIからのレスポンスは、
				// JSON形式で返されます。
				fetch(url + value.word[i])

				// .then()メソッドは、APIのレスポンスを処理するために使用されます。
				// まず、api_res変数にAPIレスポンスを解析して格納されたオブジェクトが
				// 代入されます。このオブジェクトには、最も類似した5つの単語が含まれて
				// います。words変数には、5つの単語が配列として格納されます。
				.then(response => response.json())
				.then(api_res => {
					words = [api_res.word1, api_res.word2, api_res.word3, api_res.word4, api_res.word5];
					// 最後に、.MjjYudクラスを持つ各要素に対して、.each()メソッドを使用して、
					// Webページ内のテキストをスキャンします。
					$(".MjjYud").each(function() {
						// 内側のforループは、words配列内の各単語に対してループ処理を行い、
						for (j = 0; j < words.length; j++) {
							console.log(words[j] + "を検索");
							// $(this).contents().text().indexOf(words[j])を使用して、
							// 現在のテキストに各単語が含まれているかどうかを確認します。
							if ($(this).contents().text().indexOf(words[j]) != -1) {
								console.log(words[j] + "が含まれるものを消去");
								// テキストに単語が含まれている場合、.css('display','none')を使用して、
								// 該当する要素を非表示にします。これにより、単語が非表示になり、ユーザーが
								// それらを表示することができなくなります。
								$(this).css('display','none');
							}
						}
					});
				})
				// .catch() メソッドは、Promise オブジェクトが拒否された場合に実行される関数を
				// 定義するために使用されます。上記のコードの場合、Promise チェーン内の 
				// fetch() メソッドや response.json() メソッドが例外をスローした場合に、
				// エラーメッセージをコンソールに出力します。
				// 
				// つまり、下記のコードは、何らかの理由で fetch() メソッドや 
				// response.json() メソッドが成功しなかった場合に、その詳細を
				// デバッグ情報として提供するために、エラーメッセージをコンソールに
				// 表示します。これにより、問題がどこにあるかを特定し、プログラムを
				// 修正することができます。
				.catch(error => console.error(error));
			}
		}else {
			$(".MjjYud").each(function() {
				for (i = 0; i < value.word.length; i++) {
					console.log(value.word[i] + "を検索");
					if ($(this).contents().text().indexOf(value.word[i]) != -1) {
						console.log(value.word[i] + "が含まれるものを消去");
						$(this).css('display','none');
					}
				}
			});
		}
	});
});