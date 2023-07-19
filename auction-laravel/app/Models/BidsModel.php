<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BidsModel extends Model
{
    use HasFactory;

    protected $table = 'bids';

    protected $fillable = [
        'auction_id',
        'bidder',
        'price',
    ];
}
