<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    protected $fillable = [
        'number_of_plates',
        'location',
        'delivery_status',
        'price',
        'expiry_in_days',
        'food_type',
        'event_name',
        'description',
        'prepared_date',
        'status',
        'Created_by',
    ];
    
    public function userDonations($user_id) {
        return $this->where('Created_by', $user_id)->get();
    }
   
}
