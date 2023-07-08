<?php

namespace App\Http\Controllers;
use App\Models\Donation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;
use PDOException;

class FoodDonationsController extends Controller
{
    /**
     * Handle the incoming food donation.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validation...
        
        $validated = $request->validate([
            'number_of_plates' => 'required|integer',
            'location' => 'required|string',
            'delivery_status' => 'required|string',
            'price' => 'required|numeric',
            'expiry_in_days' => 'required|integer',
            'food_type' => 'required|string',
            'event_name' => 'required|string',
            'description' => 'required|string',
            'prepared_date' => 'required|date',
            'status' => 'required|string',
        ]);
    
        // Get the authenticated user
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }
    
        // Adding the authenticated user's ID as the 'Created_by' field
        $validated['Created_by'] = $user->id;
    
        // Create new Donation
        $donation = Donation::create($validated);

        // Return a response...
        return response()->json([
            'message' => 'Food donation created successfully.',
            'donation' => $donation, // Optional: Include the created donation in the response
        ], 200);

    }
    public function userDonations(Request $request) {
        // Sanctum provides a handy way to get the authenticated user
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }
    
        $donations = (new Donation)->userDonations($user->id);
    
        // Structure the data as needed for the frontend
        $columns = [
            ['field' => 'id', 'headerName' => 'ID'],
            ['field' => 'event_name', 'headerName' => 'Event Name'],
            ['field' => 'prepared_date', 'headerName' => 'Prepared Date'],
            ['field' => 'status', 'headerName' => 'Status']
        ];
        
        $rows = $donations->map(function($donation) {
            return [
                'id' => $donation->id,
                'event_name' => $donation->event_name,
                'prepared_date' => $donation->prepared_date,
                'status' => $donation->status,

            ];
        });
    
        return response()->json([
            'columns' => $columns,
            'rows' => $rows
        ]);
    }
    

}

