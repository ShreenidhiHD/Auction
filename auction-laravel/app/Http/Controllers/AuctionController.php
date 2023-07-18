<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\AuctionModel;
use App\Models\auction_images;
use Carbon\Carbon;

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
            'start_price' => 'required|numeric',
            'product_description' => 'required|string',
            'product_category' => 'required|string',
            'product_certification' => 'required|string',
            'status' => 'required|string',
        ]);
    
        $validated['created_by']=$user->id;
        $validated['delivery_status']='pending';
    
        if (Carbon::parse($validated['end_date'])->lte(Carbon::parse($validated['start_date']))) {
            return response()->json(['error' => 'End date must be greater than start date.'], 400);
        }
        
    
        $imageName = time().'.'.$request->image->extension();
        $request->image->move(public_path('images'), $imageName);
    
        //Create new auction
        $status=AuctionModel::insertGetId($validated);
        
        $upload_status=auction_images::create(['auction_id'=>$status,'image_path'=>$imageName]);
    
        if($status and $upload_status){ return response()->json(['message' => 'Auction created successfully.'], 200); }
        else{
            $delete_auction=AuctionModel::find($status);
            $delete_auction->delete();
            return response()->json(['error' => 'Unable to create auction! Try again.'], 401);
        }
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

        if(date_created($validated->end_date)<=date_created($validated->start_date)){ return response()->json(['error' => 'Date range is invalid'], 401); }

        //Update auction
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

        $is=AuctionModel::where('id',$id)->first();
        if($is->status=='inactive'){ return response()->json(['error' => 'Auction already deleted.'], 401); }

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

    public function read_by_user_id($user_id){
        $user=$request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $auctions=AuctionModel::where('created_by',$user_id)->get();

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

        $winner=AuctionModel::where('id',$request->id)->first();

        if($winner->winner!=""){ return response()->json(['error' => 'Winner is already announced for this auction.'], 401); }

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

        $delivery=AuctionModel::where('id',$request->id)->first();

        if($delivery->delivery_status=='delivered'){ return response()->json(['error' => 'Product is already delivered to winner of the auction.'], 401); }

        $auction=AuctionModel::find($request->id);

        $auction->delivery_status=$request->delivery_status;

        $status=$auction->save();

        if($status){ return response()->json(['message' => 'Auction delivery status updated successfully.'], 200); }
        else{ return response()->json(['error' => 'Unable to update auction delivery status! Try again.'], 401); }
    }

    public function report_auction($auction_id){
        $user=$request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }
        $auction=AuctionModel::find($auction_id);
        $auction->status='reported';
        $status=$auction->save();
        if($status){ return response()->json(['message' => 'Auction reported successfully.'], 200); }
        else{ return response()->json(['error' => 'Unable to report auction! Try again.'], 401); }
    }
}
