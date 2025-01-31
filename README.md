# いべぽす
『いべぽす』はライブや活動発信をしたいバンドマン、パフォーマーをはじめ、同じ趣味やイベントを共有したい人たち向けて作ったイベント投稿掲示板サービスです。
現職のコールセンターで働く人たちの活動サポートとコミュニケーション不足解消のために制作しました。
下記のような人たちに利用してほしいと考えております。</br>
- **プライベートでロックバンド、演劇、Youtubeのパフォーマンス、発信活動をしている人** 
- **職場内で共通の話題で話す知り合いがなかなか見るからない人**
- **終業後に飲み会やイベントを催したい人**
</br>


### https://www.evepos.net
<br>  

#### トップページ
![トップページ](トップ画像")  
<br>

## 特に見ていただきたいポイント
- フロントエンド面
  - Nuxt.jsを採用し、SPA（シングルページアプリケーション）で配信している。
  - 不意なリロードやページを戻った時も、ログイン状態を維持するために、jotaiライブラリを使い状態管理をしている。

- バックエンド面
  - Ruby on RailsのAPIモードを利用し、APIサーバーとしてフロントエンドからのリクエストに対して<br>JSONデータを返している
  - JWTトークン認証を利用したログインを実装してる。
  - Active Storageを使い画像を保存・管理。

- インフラ
  - AWSを使い、ALBとNginxを通すことで常時SSL通信を行っている。
  - Github Actionsを使い、CD/CDパイプラインを構築している。


<br>

## 使用した技術
* フロントエンド  
  * HTML/CSS
  * Javascript
  * Nuxt.js
  * jotai
  * ESLint/Prettier
* バックエンド  
  * Ruby
  * Ruby on Rails
  * Rubocop
  * Active Storage
* インフラ・開発環境  
  * AWS（VPC,EC2,Route53,ALB,RDS,ACM,SSM）
  * Github Actions（CI/CD）

<br>

## 画面遷移図

<br>

![UI_map]()  
<br>

## ER図

<br>

![ER_map](/documents/ER.png)  
<br>

## AWS構成図

<br>

![AWS_map](/documents/architecture.png)  
<br>

<br>

## 機能一覧
* イベント一覧ページ
    * ログイン機能 or はじめての方はこちら(ユーザー新規登録)
    * 新着イベント（投稿日順にイベントを表示）
    * スケジュール（を表示）
    * 検索
    * 新規投稿へアクセス（イベントを作成） ※ログイン必須

* イベント詳細ページ
    * いいねボタン ※ログイン必須
    * コメント投稿 ※ログイン必須

* ユーザーマイページ表示（サムネイル画像・名前・プロフィール）
* フードいいね機能（いいね後はフード横アイコンが🍴に変わる）
* 口コミ投稿・編集・削除
* 口コミいいね機能
* ユーザーフォロー機能
* ユーザー登録情報変更（アイコン画像・プロフィール・メールアドレス・パスワード）
* ユーザー削除


