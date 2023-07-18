<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\AuctionModel;
use App\Models\BidsModel;

class AdminController extends Controller
{
    private function is_admin($id){
        $user=User::where('id',$id)->first();
        if($user->role=='admin'){ return true; }
        else{ return false; }
    }
}
