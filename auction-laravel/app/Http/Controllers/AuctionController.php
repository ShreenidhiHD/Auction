<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AuctionModel;

class AuctionController extends Controller
{
    public function create(Request $request){
        $user=$request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        //Validation
        $validated = $request->validate([
            'auction_name' => 'required|string',
            'product_name' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'start_price' => 'required|number',
            'product_description' => 'required|string',
            'product_category' => 'required|string',
            'product_certification' => 'required|string',
            'status' => 'required|string',
        ]);

        $validated['created_by']=$user->id;
        $validated['delivery_status']='pending';

        //Create new auction
        $status=AuctionModel::create($validated);

        if($status){ return response()->json(['message' => 'Auction created successfully.'], 200); }
        else{ return response()->json(['error' => 'Unable to create auction! Try again.'], 401); }
    }

    public function read(){
        $user=$request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

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
        ];
        
        $rows = $auctions->map(function($auction) {
            $users=DB::table('users')->where('id',$auction->created_by)->first();
            $winner=DB::table('users')->where('id',$auction->winner)->first();
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
            ];
        });
    
        return response()->json([
            'columns' => $columns,
            'rows' => $rows
        ]);
    }

    public function update(Request $request){
        $user=$request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        //Validation
        $validated = $request->validate([
            'auction_name' => 'required|string',
            'product_name' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'start_price' => 'required|number',
            'product_description' => 'required|string',
            'product_category' => 'required|string',
            'product_certification' => 'required|string',
            'status' => 'required|string',
        ]);

        //Create new auction
        $auction=AuctionModel::find($request->id);

        $auction->auction_name=$request->auction_name;
        $auction->product_name=$request->product_name;
        $auction->start_date=$request->start_date;
        $auction->end_date=$request->end_date;
        $auction->start_price=$request->start_price;
        $auction->product_description=$request->product_description;
        $auction->product_category=$request->product_category;
        $auction->product_certification=$request->product_certification;
        $auction->status=$request->status;

        $status=$auction->save();

        if($status){ return response()->json(['message' => 'Auction updated successfully.'], 200); }
        else{ return response()->json(['error' => 'Unable to update auction! Try again.'], 401); }
    }

    public function delete(Request $request,$id){
        $user=$request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $auction=AuctionModel::find($id);

        $auction->status='inactive';

        $status=$auction->save();

        if($status){ return response()->json(['message' => 'Auction deleted successfully.'], 200); }
        else{ return response()->json(['error' => 'Unable to delete auction! Try again.'], 401); }
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
            $users=DB::table('users')->where('id',$auction->created_by)->first();
            $winner=DB::table('users')->where('id',$auction->winner)->first();
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
            ];
        });
    
        return response()->json([
            'columns' => $columns,
            'rows' => $rows
        ]);
    }

    public function update_winner(Request $request){
        $user=$request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $auction=AuctionModel::find($request->id);

        $auction->winner=$request->winner;

        $status=$auction->save();

        if($status){ return response()->json(['message' => 'Auction winner announced successfully.'], 200); }
        else{ return response()->json(['error' => 'Unable to announce auction winner! Try again.'], 401); }
    }

    public function update_delivery_status(Request $request){
        $user=$request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $auction=AuctionModel::find($request->id);

        $auction->delivery_status=$request->delivery_status;

        $status=$auction->save();

        if($status){ return response()->json(['message' => 'Auction delivery status updated successfully.'], 200); }
        else{ return response()->json(['error' => 'Unable to update auction delivery status! Try again.'], 401); }
    }
}