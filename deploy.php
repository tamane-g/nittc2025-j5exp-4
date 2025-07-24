<?php

namespace Deployer;

// Deployerのレシピをインクルード
// Laravelアプリケーションなので、Laravelのレシピをインポートします。
require 'recipe/laravel.php';

// プロジェクト名
// デプロイ先のサーバー上で、アプリケーションが配置されるディレクトリ名などになります。
// ★ あなたのアプリケーションのディレクトリ名を指定してください。
set('application', 'timetablechanger'); // 例: 'timetablechanger'

// GitリポジトリのURL
// あなたのGitHubリポジトリのURLを指定します。
set('repository', 'https://project/timetablechanger'); // ★ ユーザー提供のリポジトリURLに修正

// デプロイするブランチ
// 通常は 'main' または 'master'、またはデプロイ用のブランチを指定します。
// ★ ユーザー提供のブランチに修正
set('branch', 'backend-join'); // 現在作業中のブブランチに合わせる (master から変更)

// 共有するファイルとディレクトリ
// リリース間で永続化したいファイルやディレクトリを指定します。
// .env ファイルは機密情報を含むため、デプロイ時に手動で配置するか、環境変数で管理します。
// storage ディレクトリはLaravelのファイル保存に使用されます。
// public/build はViteでビルドされたフロントエンドアセットが格納される場所です。
// ★ Laravelに必要な共有ファイルとディレクトリを追加
add('shared_files', ['.env']);
add('shared_dirs', ['storage', 'public/build']); // public/build を共有ディレクトリに追加

// 書き込み可能なディレクトリ
// アプリケーションが実行時に書き込み権限を必要とするディレクトリを指定します。
// ★ Laravelに必要な書き込み可能ディレクトリを追加
add('writable_dirs', [
    'bootstrap/cache',
    'storage',
    'storage/app',
    'storage/app/public',
    'storage/framework',
    'storage/framework/cache',
    'storage/framework/sessions',
    'storage/framework/views',
    'storage/logs',
    'public/build', // public/build も書き込み可能にする必要がある場合
]);

// サーバーの定義
// ここにデプロイ先のサーバー情報を記述します。
// ★ ユーザー提供のホスト、ユーザー、デプロイパスに修正
host('192.168.69.183') // 本番のサーバーのアドレス (ユーザー提供)
    ->set('remote_user', 'deployer') // SSH接続に使用するユーザー名 (ユーザー提供)
    ->set('deploy_path', '~/timetablechanger'); // アプリケーションをデプロイするサーバー上のパス (ユーザー提供)

// 環境変数
// デプロイ時にサーバー上で設定したい環境変数を定義します。
// set('env', ['APP_ENV' => 'production']); // 本番環境の場合など

// デプロイメントタスクの定義
// ここではLaravelレシピに含まれるデフォルトのタスクをオーバーライドしたり、
// 追加のタスクを定義したりできます。

// Laravelの最適化コマンドをデプロイ後に実行
// task('artisan:optimize', function () {
//     run('{{bin/php}} {{release_or_current}}/artisan optimize');
// });

// デプロイ後のカスタムタスク (Viteのビルドをサーバー側で行う場合)
// もしViteのビルドをローカルで行い、生成された public/build をデプロイに含める場合は、
// 以下のタスクは不要です。
task('npm:install', function () {
    run('cd {{release_or_current}} && npm install');
});
task('npm:build', function () {
    run('cd {{release_or_current}} && npm run build');
});

// デプロイフローのカスタマイズ
// デフォルトのデプロイフローにタスクを追加します。
// Viteをサーバーでビルドする場合、以下のフックを追加します。
after('deploy:vendors', 'npm:install'); // Composerのベンダーインストール後にnpm install
after('npm:install', 'npm:build');     // npm install 後にnpm build

// デプロイメントの開始と終了時に実行されるタスク
// デプロイが成功した後に、キャッシュクリアやシンボリックリンクの作成などが行われます。
// Laravelレシピにはこれらのタスクが既に含まれています。
after('deploy:failed', 'deploy:unlock'); // デプロイ失敗時にロック解除

// ★ デプロイ後にマイグレーションとキャッシュクリアを実行するフックを追加
after('deploy:symlink', 'artisan:migrate'); // シンボリックリンク作成後にマイグレーション実行
after('artisan:migrate', 'artisan:cache:clear'); // マイグレーション後にキャッシュクリア
after('artisan:cache:clear', 'artisan:config:cache'); // 設定キャッシュ
after('artisan:config:cache', 'artisan:route:cache'); // ルートキャッシュ
after('artisan:route:cache', 'artisan:view:cache');   // ビューキャッシュ

// デプロイメントの完了後に通知を送信するタスク (オプション)
// 例: SlackやDiscordにデプロイ完了通知を送る場合など。
// task('app:notify', function () {
//     // 通知ロジックをここに記述
// });
// after('deploy:success', 'app:notify');

// デプロイメントのメインフロー
// recipe/laravel.php で定義されているデフォルトのフローを使用します。
// 必要に応じて、このフローの間にカスタムタスクを挿入できます。
// 例: before('deploy:symlink', 'custom:task');
