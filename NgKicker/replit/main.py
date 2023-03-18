# ★解説済み★
# このコードは、PythonのWebアプリケーションフレームワークであるFlaskを使用して、
# Yahoo! JAPANのリアルタイム検索ページからキーワードを検索し、検索結果のテキスト
# から名詞を抽出するWebアプリケーションです。
#
# このプログラムは、Flaskを使ってWeb APIを作成し、Yahoo!リアルタイム検索の
# 結果から取得したテキストデータをMeCabという形態素解析ツールを用いて名詞を
# 抽出し、その出現頻度をカウントして、JSON形式で返すものです。それでは、詳細を
# 見ていきましょう。


# from flask import Flask, request, jsonifyは、FlaskでAPIを作成するために
# 必要なパッケージをインポートしています。
from flask import Flask, request, jsonify
# from flask_cors import CORSは、CORS（Cross-Origin Resource Sharing）を
# 許可するために必要なパッケージです。これにより、このAPIが異なるドメインからの
# リクエストを受け入れることができます。
from flask_cors import CORS
# import MeCabは、日本語の形態素解析をするために必要なライブラリです。MeCabは、
# テキストを単語や品詞ごとに分割するツールです。このプログラムでは、
# Yahoo!リアルタイム検索で取得したテキストデータを解析するために使用されています。
import MeCab
# import collectionsは、Pythonのコレクション（集合型）を扱うためのライブラリで
# す。このプログラムでは、出現頻度をカウントするために使用されています。
import collections
# import requestsは、HTTPリクエストを送信するためのライブラリです。この
# プログラムでは、Yahoo!リアルタイム検索の結果を取得するために使用されています。
import requests
from bs4 import BeautifulSoup


# app = Flask(__name__)は、Flaskアプリケーションを作成しています。
app = Flask(__name__)
# CORS(app)は、CORS（Cross-Origin Resource Sharing）を許可するために必要な
# パッケージです。これにより、このAPIが異なるドメインからのリクエストを
# 受け入れることができます。
CORS(app)
# app.config["JSON_AS_ASCII"] = Falseは、JSONをASCIIでエンコードする代わりに
# Unicode文字をそのまま出力するために設定しています。
app.config["JSON_AS_ASCII"] = False
# tagger = MeCab.Tagger()は、日本語の形態素解析をするために必要なMeCabの
# タガーを作成しています。
tagger = MeCab.Tagger()
# tagger.parse('')は、MeCabのタガーを初期化するために空の文字列を解析しています。
tagger.parse('')
# url = "https://search.yahoo.co.jp/realtime/search?p="は、Yahoo! JAPANの
# リアルタイム検索ページのURLを設定しています。
url = "https://search.yahoo.co.jp/realtime/search?p="
# add = "&ei=UTF-8&ifr=tp_sc"は、検索クエリーのURLパラメーターを
# 設定しています。ここでは、検索エンジンのエンコード方式（UTF-8）と検索結果の
# 表示方法（tp_sc）を指定しています。
add = "&ei=UTF-8&ifr=tp_sc"


# この部分は、Flaskアプリケーションで "/" のGETリクエストを受け付け、引数として
# "word" パラメータを受け取ります。
# 
# 受け取った "word" パラメータを元に、search() 関数を呼び出して、
# Yahoo!リアルタイム検索で "word" を検索し、その結果から名詞を抽出し、
# 出現頻度をカウントします。
# 
# 最後に、JSON形式で抽出された上位5つの名詞を含む辞書オブジェクトを返します。
# このオブジェクトは、"word1"、"word2"、"word3"、"word4"、"word5"の5つの
# キーと、それぞれの出現頻度が最も高い上位5つの名詞の値を持ちます。これにより、
# APIのユーザーは、リクエストしたキーワードに関連する最も頻繁に出現する名詞を
# 知ることができます。
# 
# このコードは、FlaskアプリケーションでGETリクエストを処理するエンドポイントを
# 定義しています。エンドポイントは、/というURLにマッピングされ、methods引数で
# 指定されたHTTPメソッドでリクエストを受け付けます。
# 
@app.route("/", methods=["GET"])
def get_word():
  # このエンドポイントの実装では、request.args属性を使用して、
  # リクエストパラメータを取得しています。リクエストパラメータとは、
  # URLのクエリ文字列に含まれるパラメータで、?以降の部分です。たとえば、
  # /endpoint?word=helloというURLにアクセスすると、wordというパラメータの値が
  # helloになります。
  req = request.args
  # req.get("word")は、リクエストパラメータの中からwordという名前のパラメータの
  # 値を取得しています。この値は、search()関数に渡され、結果がresults変数に
  # 格納されます。
  word = req.get("word")
  results = search(word)
  # 最後に、jsonify()関数を使用して、results変数から最初の5つの単語を取り出して
  # 、JSON形式のレスポンスを生成しています。このレスポンスには、各単語の結果が
  # word1、word2、word3、word4、word5というキーで含まれます。jsonify()関数は、
  # JSON形式のデータを返すとともに、必要に応じてHTTPレスポンスの
  # Content-Typeヘッダーを設定します。
  return jsonify({
    "word1": results[0][0],
    "word2": results[1][0],
    "word3": results[2][0],
    "word4": results[3][0],
    "word5": results[4][0]
  })

# このコードは、Yahoo!リアルタイム検索から、特定のキーワードに関するツイートを
# 取得し、その中から頻出する名詞を抽出する関数です。
def search(word):
  # requests.get(url + word + add): 指定されたURLに対してGETリクエストを
  # 送信し、レスポンスを取得しています。URLは、Yahoo!リアルタイム検索の
  # 検索結果ページのURLで、キーワードを指定するためにword、エンコード方式を
  # 指定するためにaddが使用されています。
  r = requests.get(url + word + add)
  # BeautifulSoup(r.content, 'html.parser'): 取得したHTMLデータをパースし、
  # BeautifulSoupオブジェクトを生成しています。パーサーにはPython標準の
  # html.parserを使用しています。
  soup = BeautifulSoup(r.content, 'html.parser')
  # soup.find_all("p", class_="Tweet_body__3JAGe"): soupオブジェクトから、
  # クラス名が"Tweet_body__3JAGe"であるすべての<p>要素を取得しています。
  # これは、Yahoo!リアルタイム検索の検索結果ページで、ツイートの本文が
  # 格納されている要素です。
  results = soup.find_all("p", class_="Tweet_body__3JAGe")

  word_list = []  #取り出した名詞のリスト
  for parts in results:
    print(parts.get_text())

  for text in results:
    # tagger.parseToNode(text.get_text()): 取得したツイートの本文から、
    # MeCabを使用して形態素解析を行っています。get_text()によって、<p>要素内の
    # テキスト部分だけを取得しています。
    node = tagger.parseToNode(text.get_text())
    while node:
      # word_type = node.feature.split(',')[0]: MeCabによって解析された
      # 形態素の情報から、品詞を取得しています。feature属性には、形態素の
      # 表層形、品詞、読み、発音などの情報がカンマ区切りで格納されています。
      # ここでは、品詞を取得するために、カンマで分割し、最初の要素だけを
      # 取得しています。
      word_type = node.feature.split(',')[0]
      # if word_type in ["名詞"] and node.surface not in ["Twitter", "com", "返信","先","twitter","pic"]:
      #  word_list.append(node.surface): 抽出した品詞が名詞で、かつ、
      # 「Twitter」や「com」、「返信」などのよく出現する単語でない場合、
      # word_listに格納されます。
      if word_type in ["名詞"] and node.surface not in ["Twitter", "com", "返信","先","twitter","pic"]:
        word_list.append(node.surface)
      node = node.next  # 先頭の要素を消す [1,2,3] => [2,3]

  # collections.Counter(word_list): word_list内の要素の出現回数を
  # カウントし、collections.Counterオブジェクトを生成しています。
  c = collections.Counter(word_list)
  print(c)
  # most_common(n)は、collections.Counterオブジェクトに対して呼び出される
  # メソッドで、カウンターの中で最も多く出現する上位n個の要素と、それらが
  # 出現した回数のペアを、出現回数の多い順にリストで返します。
  # 
  # この場合、変数cはword_listの要素をカウントして、それぞれが何回出現したかを
  # 数えたものであるため、c.most_common(20)は、word_listの中で最も多く
  # 出現する上位20個の名詞と、それらが出現した回数のペアを、出現回数の多い順に
  # リストで返すことになります。
  return c.most_common(20)

# このコードは、Pythonファイルがスクリプトとして実行される場合に、
# app.run()メソッドが呼び出されるようにします。この条件式は、Pythonファイルが
# importされた場合にはapp.run()が呼び出されないようにします。
# 
# debug=Trueは、Flaskアプリケーションがデバッグモードで実行されることを
# 示しています。この設定により、アプリケーションにエラーが発生した場合に、
# スタックトレースやデバッグ情報が表示されます。
# 
# port=8080は、アプリケーションが実行されるポート番号を指定しています。
# ここでは8080ポートを指定していますが、必要に応じて変更することができます。
# 
# host='0.0.0.0'は、アプリケーションが実行されるホストを指定しています。
# 0.0.0.0は、すべてのIPアドレスを受け入れることを意味します。したがって、
# アプリケーションは、同じネットワーク上の他のマシンからもアクセス可能になります。
if __name__ == "__main__":
  app.run(debug=True, port=8080, host='0.0.0.0')


