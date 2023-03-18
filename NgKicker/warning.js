//★解説済み★
// このコードは、ローカルストレージに保存された単語を取得し、取得した単語を元に
// Webページ内のテキストを検索して、特定の単語が含まれる場合は警告を表示する
// 機能を実装しています。

// まず、$(function() { ... });によって、jQueryを使った処理が開始されます。
$(function(){
	// chrome.storage.local.get()メソッドは、ローカルストレージから指定した
	// キーに対応する値を取得します。このコードでは、'word'と'bool'という2つの
	// キーを指定しています。valueには、取得した値がオブジェクト形式で格納されます。
	chrome.storage.local.get(['word','bool'],function(value) {
		console.log(`ローカルストレージの内容: ${value.word,value.bool}`);

		// この部分は、ローカルストレージに保存された値に基づいて、特定のURL内の
		// 単語を検索しています。
		// if (value.bool)は、value.boolがtrueの場合、つまりローカルストレージに
		// 保存されたboolがtrueの場合に条件が実行されます。
		if (value.bool) {
			// const url = "https://Chrome-extension.ryotaasai.repl.co?word=";
			// は、APIエンドポイントのURLを設定しています。このAPIは、与えられた単語を
			// 含む別の単語を返します。
			const url = "https://Chrome-extension.ryotaasai.repl.co?word=";

			// for (i = 0; i < value.word.length; i++)は、
			// ローカルストレージに保存された単語の数だけループします。
			for (i = 0; i < value.word.length; i++) {
				console.log(i + " : " + value.word[i]);

				// fetch(url + value.word[i])は、APIに対してリクエストを
				// 送信し、返されたデータをJSON形式で取得します。
				fetch(url + value.word[i])

				// then(response => response.json())は、レスポンスを
				// JSON形式に解析します。
				.then(response => response.json())

				// then(api_res => {...})は、JSONデータを処理します。
				// api_res.word1からapi_res.word5までのデータをwords変数に
				// 格納します。これらは、検索対象の単語として使用されます。
				.then(api_res => {

					// まず、レスポンスデータから必要な単語を抽出し、wordsという
					// 配列に格納しています。ここでは、APIからword1からword5の
					// 5つの単語を取得して、wordsに格納しています。
					words = [api_res.word1, api_res.word2, api_res.word3, api_res.word4, api_res.word5];

					// 次に、forループを使って、wordsの各要素に対して以下の処理を行っています。
					for (i = 0; i < 5; i++) {
						console.log(words[i] + "を検索");
						// もしコンテンツ内でwords[i]が含まれていれば、
						if ($("*").contents().text().indexOf(words[i]) != -1) {

							// chrome.runtime.sendMessage()を使って、メッセージをバックグラウンドスクリプト
							// に送信します。このとき、送信されるメッセージの内容は
							// {content:"save_url",package:location.href}で、現在のページのURLを含みます。
							let rtnPromise = chrome.runtime.sendMessage({content:"save_url",package:location.href});

							// chrome.runtime.sendMessage()の戻り値はPromiseオブジェクトであり、
							// .then()を使って、メッセージの送信が完了したら次の処理を実行します。
							// handleResponseとhandleErrorは、メッセージの送信に成功した場合と失敗した
							// 場合の処理を定義するコールバック関数です。
        					rtnPromise
        					.then(handleResponse, handleError);

							// このコードは、Chrome拡張機能のchrome.storage.local APIを使用して、
							// ローカルストレージから'url'というキーで保存された値を取得します。
							// その後、現在のページのURLと取得した値を比較し、異なる場合は
							// chrome.runtime.getURL("/alert/alert2.html")で取得したページに
							// リダイレクトします。つまり、異なるURLを開いたときに、アラートページに
							// リダイレクトするための機能を実装しています。
							chrome.storage.local.get('url',function(value) {
								if (location.href != value.url)
									location.href = chrome.runtime.getURL("/alert/alert2.html");
							});
						}
					}
				})

				// .catch() は、Promiseチェーン内で前の関数がエラーをスローした場合に実行される
				// コールバック関数です。つまり、何らかのエラーが発生した場合、この関数が
				// 呼び出され、エラー情報がコンソールに表示されます。
				// 
				// この部分の役割は、fetch()関数が失敗した場合、エラー情報をコンソールに
				// 出力することです。また、この場合、以降の処理はスキップされます。
				// 具体的には、次の .then() メソッドが呼び出されずに、代わりにこの 
				// .catch() メソッドが呼び出されます。
				.catch(error => console.error(error));
			}
		}else {
			// 関連語取得の部分が消えたバージョン
			for (i = 0; i < value.word.length; i++) {
				console.log(value.word[i] + "を検索");
				if ($("*").contents().text().indexOf(value.word[i]) != -1) {
					let rtnPromise = chrome.runtime.sendMessage({content:"save_url",package:location.href});
					rtnPromise
					.then(handleResponse, handleError);
					chrome.storage.local.get('url',function(value) {
						if (location.href != value.url)
							location.href = chrome.runtime.getURL("/alert/alert2.html");
					});
				}
			}
		}
	});

	// この関数 handleResponse は、Chrome 拡張機能の chrome.runtime.sendMessage()
	// メソッドによって送信されたメッセージを処理するために使用されます。
	// 
	// この関数は、引数 message を受け取ります。この message オブジェクトには、
	// Chrome 拡張機能から送信されたメッセージが含まれます。messageオブジェクトには、
	//  to という名前のプロパティがあり、これにはメッセージの宛先が含まれています。
	//  res という名前の別のプロパティには、受信したメッセージに対するレスポンスが
	// 含まれます。
	function handleResponse(message) {
        if (message.to == "warn") {
            console.log(message.res);
        }
    }

	// この関数handleErrorは、Promiseチェーンでエラーが発生した場合に呼び出される
	// コールバック関数です。この関数は引数としてエラーオブジェクトを
	// 受け取ります。そして、コンソールにエラーを出力します。
	//
	// 具体的には、この関数ではテンプレートリテラルを使って、エラーオブジェクトの
	// 情報を含む文字列を作成しています。そして、その文字列をコンソールに
	// 出力することで、エラー情報を開発者に知らせます。
    function handleError(error) {
		console.log(`Error: ${error}`);
	}
});