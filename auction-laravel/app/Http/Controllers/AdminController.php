<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\AuctionModel;
use App\Models\BidsModel;
use App\Models\auction_images;

class AdminController extends Controller
{
    private function is_admin($id){
        $user=User::where('id',$id)->first();
        if($user->role=='admin'){ return true; }
        else{ return false; }
    }

    public function view_users(Request $request){
        $user=$request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }
        
        if(!$this->is_admin($user->id)){ return response()->json(['error' => 'Unauthorised access'], 401); }

        $users=User::all();

        // Structure the data as needed for the frontend
        $columns = [
            ['field' => 'id', 'headerName' => 'ID'],
            ['field' => 'name', 'headerName' => 'Name'],
            ['field' => 'email', 'headerName' => 'E-Mail'],
            ['field' => 'mobile', 'headerName' => 'Mobile'],
            ['field' => 'whatsapp', 'headerName' => 'Whatsapp'],
            ['field' => 'address', 'headerName' => 'Address'],
            ['field' => 'pincode', 'headerName' => 'Pincode'],
            ['field' => 'status', 'headerName' => 'Status'],
            ['field' => 'role', 'headerName' => 'Role'],
            ['field' => 'created_at', 'headerName' => 'Created At'],
        ];

        $rows = $users->map(function($usr) {
            return [
                'id' => $usr->id,
                'name'=>ucfirst($usr->name),
                'email' => ucfirst($usr->email),
                'mobile' =>  ucfirst($usr->mobile),
                'whatsapp' => ucfirst($usr->whatsapp),
                'address' => ucfirst($usr->address),
                'pincode' => $usr->pincode,
                'status' => ucfirst($usr->status),
                'role' => ucfirst($usr->role),
                'created_at' => date_format(date_create($usr->created_at),'d-m-Y'),
            ];
        });

        return response()->json([
            'columns' => $columns,
            'rows' => $rows
        ]);
    }

    public function update_user($user_id,$status){
        $user=$request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }
        
        if(!$this->is_admin($user->id)){ return response()->json(['error' => 'Unauthorised access'], 401); }

        $usr=User::find($user_id);

        $usr->status=$status;

        $status=$usr->save();

        if($status){ return response()->json(['message' => 'User updated successfully.'], 200); }
        else{ return response()->json(['error' => 'Unable to update user! Try again.'], 401); }
    }

    public function auctions(){
        $user=$request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }
        
        if(!$this->is_admin($user->id)){ return response()->json(['error' => 'Unauthorised access'], 401); }

        $auctions=AuctionModel::all();

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
            ['field' => 'created_at', 'headerName' => 'Created At'],
        ];
        
        $rows = $auctions->map(function($auction) {
            $users=User::where('id',$auction->created_by)->first();
            $winner=User::where('id',$auction->winner)->first();
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
                'winner' =>  ucfirst($winner->name),
                'created_at' => date_format(date_create($auction->created_at),'d-m-Y'),
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
        
        if(!$this->is_admin($user->id)){ return response()->json(['error' => 'Unauthorised access'], 401); }

        $auction=AuctionModel::find($auction_id);

        $auction->status=$status;

        $status=$auction->save();

        if($status){ return response()->json(['message' => 'Auction updated successfully.'], 200); }
        else{ return response()->json(['error' => 'Unable to update auction! Try again.'], 401); }
    }

    public function bids($auction_id){
        $user=$request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $bids=BidsModel::where('auction_id',$auction_id)->get();

        // Structure the data as needed for the frontend
        $columns = [
            ['field' => 'id', 'headerName' => 'ID'],
            ['field' => 'auction_name', 'headerName' => 'Auction Name'],
            ['field' => 'created_by', 'headerName' => 'Created By'],
            ['field' => 'price', 'headerName' => 'Bids'],
        ];

        $rows = $bids->map(function($bid) {
            $users=User::where('id',$bid->bidder)->first();
            $auction=AuctionModel::where('id',$bid->auction_id)->first();
            return [
                'id' => $bid->id,
                'auction_name' =>  ucfirst($auction->auction_name),
                'created_by' => ucfirst($users->name),
                'price' => number_format($bid->price,2),
            ];
        });
    
        return response()->json([
            'columns' => $columns,
            'rows' => $rows
        ]);
    }

    public function read_by_id($id){
        $user=$request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $auctions=AuctionModel::where('id',$id)->first();

        // Structure the data as needed for the frontend
        $columns = [
            ['field' => 'id', 'headerName' => 'ID'],
            ['field' => 'image', 'headerName' => 'Image'],
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
            ['field' => 'result', 'headerName' => 'Result'],
        ];
        
        $rows = $auctions->map(function($auction) {
            $users=User::where('id',$auction->created_by)->first();
            $winner=User::where('id',$auction->winner)->first();
            $result="";
            if($auction->winner==$user->id){ $result='You won the auction'; }
            else{ $result='Better luck next time'; }
            $image_name=Array();
            $images=auction_images::where('auction_id',$auction->id)->get();
            foreach($images as $image){ array_push($image_name,$image->image_path); }
            return [
                'id' => $auction->id,
                'image'=>$image_name,
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
                'winner' =>  ucfirst($winner->name),
                'result'=> ucfirst($result),
            ];
        });
    
        return response()->json([
            'columns' => $columns,
            'rows' => $rows
        ]);
    }

    public function reported_auctions(){
        $user=$request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }
        
        if(!$this->is_admin($user->id)){ return response()->json(['error' => 'Unauthorised access'], 401); }

        $auctions=AuctionModel::where('status','reported')->get();

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
            ['field' => 'created_at', 'headerName' => 'Created At'],
        ];
        
        $rows = $auctions->map(function($auction) {
            $users=User::where('id',$auction->created_by)->first();
            $winner=User::where('id',$auction->winner)->first();
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
                'winner' =>  ucfirst($winner->name),
                'created_at' => date_format(date_create($auction->created_at),'d-m-Y'),
            ];
        });
    
        return response()->json([
            'columns' => $columns,
            'rows' => $rows
        ]);
    }
}
