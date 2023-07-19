<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\AuctionModel;
use App\Models\BidsModel;
use App\Models\auction_images;

class ManagerController extends Controller
{
    private function is_manager($id){
        $user=User::where('id',$id)->first();
        if($user->role=='manager'){ return true; }
        else{ return false; }
    }

    private function check_if_auction_finished($end_date,$date){
        if(date_create($end_date)<date_create($date)){ return true; }
        else{ return false; }
    }

    public function read(Request $request){
        $user=$request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $auctions=AuctionModel::where(['status'=>'assigned','manager'=>$user->id])->get();

        // Structure the data as needed for the frontend
        $columns = [
            ['field' => 'id', 'headerName' => 'ID'],
            ['field' => 'created_by', 'headerName' => 'Created By'],
            ['field' => 'auction_name', 'headerName' => 'Auction Name'],
            ['field' => 'product_name', 'headerName' => 'Product Name'],
            ['field' => 'start_date', 'headerName' => 'Start Date'],
            ['field' => 'end_date', 'headerName' => 'End Date'],
            ['field' => 'start_price', 'headerName' => 'Start Price'],
            ['field' => 'product_description', 'headerName' => 'Product Description'],
            ['field' => 'product_category', 'headerName' => 'Product Category'],
            ['field' => 'product_certification', 'headerName' => 'Product Certification'],
            ['field' => 'delivery_status', 'headerName' => 'Delivery Status'],
            ['field' => 'status', 'headerName' => 'Status'],
            ['field' => 'winner', 'headerName' => 'Winner'],
        ];
    
        $rows = $auctions->map(function($auction) {
            $users = User::where('id', $auction->created_by)->first();
            $winner = User::where('id', $auction->winner)->first();
            
            // Get all images for this auction
            $images = auction_images::where('auction_id', $auction->id)->get();
        
            // If you want to return just one image URL, you can get the first one
             $image_url = $images->first() ? asset($images->first()->image_path) : null;
        
            // If you want to return all image URLs, you can map over the collection
            // $image_urls = $images->map(function($image) {
            //     return asset($image->image_path);
            // });

            if($this->check_if_auction_finished($auction->end_date,date('Y-m-d')) and $auction->winner==""){
                //Update winner
                $bids=BidsModel::where('auction_id',$auction->id)->order_by('price','desc')->first();
                $update_winner=AuctionModel::find($auction->id);
                $update_winner->winner=$bids->bidder;
                $update_winner->save();
                $winner = User::where('id', $bids->bidder)->first();
            }
        
            return [
                'id' => $auction->id,
                'created_by' => ucfirst($users->name),
                'auction_name' =>  ucfirst($auction->event_name),
                'product_name' => ucfirst($auction->product_name),
                'start_date' => date_format(date_create($auction->start_date),'d-m-Y'),
                'end_date' => date_format(date_create($auction->end_date),'d-m-Y'),
                'start_price' => $auction->start_price,
                'product_description' => ucfirst($auction->product_description),
                'product_category' => ucfirst($auction->product_category),
                'product_certification' => ucfirst($auction->product_certification),
                'delivery_status' => ucfirst($auction->delivery_status),
                'status' => ucfirst($auction->status),
                'winner' =>  $winner ? ucfirst($winner->name) : null,
                 'image_url' => $image_url,  // Include the first image URL here
              //  'image_urls' => $image_urls,  // Or include all image URLs here
            ];
        });
        
        return response()->json([
            'columns' => $columns,
            'rows' => $rows
        ]);
    }

    public function update_auction($auction_id,$status){
        $user=$request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }
        
        if(!$this->is_manager($user->id)){ return response()->json(['error' => 'Unauthorised access'], 401); }

        $auctions=AuctionModel::where('id',$auction_id)->first();
        if($auctions->status=='delivered'){ return response()->json(['error' => 'Product is already deliverd to bidder'], 401); }

        if($status=='verified' or $status=='shipped' or $status=='delivered'){
            $auction=AuctionModel::find($auction_id);

            $auction->delivery_status=$status;

            $status=$auction->save();

            if($status){ return response()->json(['message' => 'Auction updated successfully.'], 200); }
            else{ return response()->json(['error' => 'Unable to update auction! Try again.'], 401); }
        }
        else{ return response()->json(['error' => 'Unauthorised operation'], 401); }
    }
}
