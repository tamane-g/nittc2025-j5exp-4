<?php

namespace App\Http\Controllers;

use App\Models\Notification; // Notification モデルを使用
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // 認証済みユーザーを取得するため
use Illuminate\Support\Facades\Redirect; // リダイレクトのため
use Inertia\Inertia; // Inertia.js のレンダリングのため
use Inertia\Response; // Inertia.js のレスポンス型ヒントのため
use Illuminate\Http\RedirectResponse; // RedirectResponse 型ヒントのため

class NotificationController extends Controller
{
    /**
     * 認証済み教師向けのお知らせ一覧を取得し、Inertia.js コンポーネントで表示します。
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request): Response
    {
        // 認証済みユーザー（教師）を取得
        $teacher = $request->user();

        // ログイン中の教師宛の通知のみを取得し、最新のものから表示
        // 未読を優先して表示したい場合は orderBy('read_at', 'asc')->orderBy('created_at', 'desc') などに調整
        $notifications = Notification::where('teacher_id', $teacher->id)
                                     ->orderBy('created_at', 'desc')
                                     ->get();

        return Inertia::render('Notifications/Index', [ // 'Notifications/Index' はフロントエンドのコンポーネントパスを想定
            'notifications' => $notifications,
            'teacher' => $teacher, // 必要であれば教師情報も渡す
        ]);
    }

    /**
     * 指定されたお知らせを既読にします。
     *
     * @param Notification $notification
     * @return \Illuminate\Http\RedirectResponse
     */
    public function markAsRead(Notification $notification): RedirectResponse
    {
        // ログイン中の教師がこの通知の受信者であることを確認
        if (Auth::id() !== $notification->teacher_id) {
            // 権限がない場合はエラーメッセージと共にリダイレクト
            return Redirect::back()->with('error', 'このお知らせを既読にする権限がありません。');
        }

        // read_at がまだ設定されていない場合のみ更新
        if (is_null($notification->read_at)) {
            $notification->update(['read_at' => now()]);
        }

        return Redirect::back()->with('success', 'お知らせを既読にしました。');
    }

    /**
     * 全てのお知らせを既読にします。
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function markAllAsRead(Request $request): RedirectResponse
    {
        $teacherId = Auth::id();

        Notification::where('teacher_id', $teacherId)
                    ->whereNull('read_at') // 未読の通知のみ
                    ->update(['read_at' => now()]);

        return Redirect::back()->with('success', 'すべてのお知らせを既読にしました。');
    }

    // 必要に応じて、個別の通知詳細を表示する show メソッドなどを追加できます
    // public function show(Notification $notification): Response
    // {
    //     // ログイン中の教師がこの通知の受信者であることを確認
    //     if (Auth::id() !== $notification->teacher_id) {
    //         abort(403, 'Unauthorized action.');
    //     }
    //     // ここで既読にするロジックを追加することも可能
    //     if (is_null($notification->read_at)) {
    //         $notification->update(['read_at' => now()]);
    //     }
    //     return Inertia::render('Notifications/Show', ['notification' => $notification]);
    // }
}
