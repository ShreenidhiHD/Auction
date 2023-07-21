<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class auction_images extends Model
{
    use HasFactory;

    protected $table = 'auction_images';

    protected $fillable = ['auction_id', 'image_path'];

    public $timestamps = false;
    public function auction()
    {
        return $this->belongsTo(AuctionModel::class, 'auction_id');
    }
}
