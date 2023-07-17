<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuctionModel extends Model
{
    use HasFactory;

    protected $fillable = [
        'created_by',
        'auction_name',
        'product_name',
        'start_date',
        'end_date',
        'start_price',
        'product_description',
        'product_category',
        'product_certification',
        'delivery_status',
        'status',
        'winner',
    ];
}
