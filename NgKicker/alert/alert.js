// ★解説済み★
(() => {
    document.querySelector('.button1').addEventListener('click', function(){
        // ブラウザの履歴が1つ前のページに戻ります。
        history.back();
    });
    document.querySelector('.button2').addEventListener('click', function(){
        // ブラウザの履歴が2つ前のページに戻ります。
        history.go(-2);
    });
})();

