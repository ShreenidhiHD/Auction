<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Email Template</title>
    <style>
        /* Add your CSS styles here */
        body {
            font-family: Arial, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .content {
            margin-bottom: 20px;
        }

        .footer {
            text-align: center;
            font-size: 12px;
            color: #999999;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Email Template</h1>
        </div>
        <div class="content">
            <p>Dear {{ $name }},</p>
            <p>This is a sample email template.</p>
            <p>{!! $message !!}</p> <!-- Using raw unescaped content here -->
        </div>
        <div class="footer">
            <p>Thank you,</p>
            <p>Your App Team</p>
        </div>
    </div>
</body>
</html>
