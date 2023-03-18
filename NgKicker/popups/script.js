(() => {
    
    constlength = localStorage.length;
    console.log(constlength);
    word_list = [];
    
    function ListPrint(){
        for(let i=0 ;i<constlength;i++){
            const newForm=document.createElement('li');
            newForm.textContent=localStorage.getItem(i);
            newForm.className='List_index';
            newForm.style.width = "150px";
            const newbutton = document.createElement('button');
            newbutton.className = 'del-button';
            newbutton.textContent = '-';
            const newLabel = document.createElement('label');
            newLabel.className = 'label';
            newLabel.style.width = "300px";
            newLabel.appendChild(newForm);
            newLabel.appendChild(newbutton);
            document.querySelector('.List_ul').appendChild(newLabel);
        }
    }
    ListPrint();
    
    //ページをリロードする関数
    function doReload(){
        window.location.reload();
        for (i = 0; i < localStorage.length; i++) {
            word_list[i] = localStorage.getItem(i);
        }
        //メッセージを送る。
        let rtnPromise = chrome.runtime.sendMessage({content: "save_words",package: word_list});
        rtnPromise
        .then(handleResponse, handleError);
    }
    
    //ストレージで消えた分を詰める関数。キーを再設定する。xは消されたデータのキー
    function index(x){
        //現在のデータ数を更新
        constlength=localStorage.length;
        
        //消された番号を持つキーから順に詰める
        for(let i=x;i<constlength;i++){
            //1つ先のキーの文字列を取得する。
            buf=localStorage.getItem(i+1);
            //更新
            localStorage.setItem(i,buf);
        }
        
        //最後のデータだけ消す
        localStorage.removeItem(constlength);
    }
    
    //消去関数
    function delbuttonf(event){
        //消去したいワードをローカルストレージ上から消去する。
        for(let i=0;i<constlength;i++){
            console.log(event.currentTarget.previousElementSibling.textContent)
            if(event.currentTarget.previousElementSibling.textContent === localStorage.getItem(i)){
                localStorage.removeItem(i);
                index(i);
                break;
            }                
        }
        //新しく更新されたローカルストレージを使って再表示するためにwebページをリロードする。
        doReload();
    }
    
    
    let delbutton = document.getElementsByClassName('del-button');
    // 取得したすべての要素に対しdelbuttonf関数を付与する。
    for(let i=0;i<delbutton.length;i++){
        delbutton[i].addEventListener('click',delbuttonf);
    }
    
    //入力欄を増やす関数
    function addStorage(event){
        //ローカルストレージ上のデータ数を取得
        constlength = localStorage.length;
        console.log(constlength);
        //event.currentTarget:クリックイベントを定義した要素が対象になる
        localStorage.setItem(constlength,event.currentTarget.value);
    }
    
    //+ボタンが押されるとinputタグの中のワードがローカルストレージ上に保存される。
    document.querySelector('.add-button').addEventListener('click', function(){
        //ローカルストレージの数を再取得
        constlength=localStorage.length;
        //inputタグのテキストを取得
        text=document.getElementById('word').value;
        if(text.length !== 0){
            localStorage.setItem(constlength,text);
            doReload();
        }
    });
    
    const elements = document.querySelectorAll(".add-button");
    
    elements.forEach(function(element) {
        let shadow = 0;
        let intervalId;
        
        element.addEventListener("mouseenter", function() {
            intervalId = setInterval(function() {
                shadow += 1.3;
                element.style.boxShadow = `0 0 ${shadow}px rgba(0, 0, 0, 0.5)`;
                if (shadow >= 10) {
                    clearInterval(intervalId);
                }
            }, 50);
        });
        
        element.addEventListener("mouseleave", function() {
            let shadow = 10;
            let intervalId = setInterval(function() {
                shadow -= 1.3;
                element.style.boxShadow = `0 0 ${shadow}px rgba(0, 0, 0, 0.5)`;
                if (shadow <= 0) {
                    clearInterval(intervalId);
                    element.style.boxShadow = "none";
                }
            }, 50);
        });
    });
//=======================================================================================
// スイッチ処理
//=======================================================================================
    document.getElementById('switch').addEventListener('click', function() {
        chrome.storage.local.set({bool:document.getElementById('switch').checked}, function() {console.log("bool型変数格納")});
        console.log(document.getElementById('switch').checked);
    })
    

    function handleResponse(message) {
        if (message.to == "script") {
            console.log(message.res);
        }
    }
    function handleError(error) {
		console.log(`Error: ${error}`);
	}
})();