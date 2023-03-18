// ★解説済み★
(() => {
    // Chrome拡張機能のランタイムに対して、
    // chrome.runtime.onMessageリスナーを登録して
    // います。このリスナーは、他のスクリプトからの
    // メッセージを待ち受け、メッセージを受信したら
    // handleMessage関数を呼び出します。
    chrome.runtime.onMessage.addListener(handleMessage);
    
    //handleMessage関数は3つの引数をとります。
    //request:受信したメッセージの内容が含まれるオブジェクト
    //sender:メッセージを送信したsクリプト情報を含むオブジェクト
    //sendResponse:応答メッセージを送信するための関数
    function handleMessage(request, sender, sendResponse) {
        console.log(`メッセージを受信しました: ${request.content}`);

        // request.contentって何？
        //request.contentは、メッセージの内容を示すプロパティです。
        // chrome.runtime.onMessage.addListener()メソッドによって、
        // 拡張機能が他のページやコンテンツスクリプトから受信したメッセージが、
        // handleMessage関数の第一引数として渡されます。
        //
        //この第一引数requestは、受信したメッセージをオブジェクトとして取得する
        // ためのものであり、その中にcontentプロパティが含まれます。
        // request.contentは、メッセージがどのような種類のものなのかを示す
        // 文字列を持ちます。
        switch (request.content) {

            // この文字列は、受信したメッセージの種類に応じて、switch文で
            // 判別され、処理が分岐されます。たとえば、"save_words"という
            // 文字列が渡された場合は、単語を保存する処理が実行されます。
            // "save_url"という文字列が渡された場合は、URLを保存する処理が
            // 実行されます。
            case "save_words":
                // 受信したパッケージ内容をログに出力します。ここでは、受信した単語を示す
                // プロパティ package をログに出力しています。
                console.log("受信 : " + request.package);

                // chrome.storage.local を使って、単語をローカルストレージに保存します。
                // {word:request.package}は、保存するデータを表すオブジェクトで、
                // wordというキーに単語の値を設定しています。function() {...}の部分は、
                // 保存が完了した際に実行されるコールバック関数で、保存完了のログを出力します。
                chrome.storage.local.set({word:request.package},function() {
                    console.log("ローカルストレージに保存完了");
                });

                // レスポンスを送信します。ここでは、{res:"sucsess", to:"script"}という
                // オブジェクトを返しています。これは、成功したことを示す res プロパティと、
                // レスポンスを送信したスクリプトを示す to プロパティを持つオブジェクトです。
                sendResponse({res:"sucsess", to:"script"});
                break;
                
            case "save_url":
                // まず、console.log()を使用して、受信したURLをコンソールに表示します。
                console.log("url受信 : " + request.package);

                // 次に、chrome.storage.local.set()メソッドを使用して、受信したURLを
                // ローカルストレージに保存します。この場合、{url: request.package}という
                // オブジェクトが使用されます。これは、ローカルストレージに保存される
                // データのキーが"url"で、値がrequest.packageであることを示します。
                chrome.storage.local.set({url:request.package},function() {
                    console.log("urlをローカルストレージに保存完了");
                });

                // 最後に、sendResponse()メソッドを使用して、処理が成功したことを呼び出し元の
                // スクリプトに通知します。sendResponse()メソッドに渡されるオブジェクトには、
                // {res: "success", to: "warn"}というプロパティが含まれています。これは、
                // 呼び出し元のスクリプトが "warn" に通知されることを示します。
                sendResponse({res:"sucsess", to:"warn"});
                break;
                
            default:
                break;
        }
    }

})();
