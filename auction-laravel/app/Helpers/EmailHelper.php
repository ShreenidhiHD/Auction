<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Mail;
use Illuminate\Mail\Message;
use Illuminate\Support\Facades\View;

class EmailHelper
{
    public static function mailSendGlobal($to, $subject, $data)
    {
        $body = View::make('emails.template', $data)->render();

        Mail::send([], [], function (Message $message) use ($to, $subject, $body) {
            $message->to($to)
                    ->subject($subject)
                    ->setBody($body, 'text/html');
        });
    }
}
