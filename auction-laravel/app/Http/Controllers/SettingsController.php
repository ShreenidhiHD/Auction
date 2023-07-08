<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Config;

class SettingsController extends Controller
{
    public function getSettings()
    {
        // Retrieve the app name from the configuration file (config/app.php)
        $appName = Config::get('app.name');

        // Placeholder for the logo path or URL, replace it with the logic to retrieve the actual logo
        $logo = 'logo';
       
        // Return the settings as a JSON response
        return response()->json([
            'appName' => $appName,
            'logo' => $logo,
            // Add more settings as needed
        ]);
    }
}
