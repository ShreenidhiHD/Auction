<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\File;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\AuctionModel;
use App\Models\BidsModel;
use App\Models\auction_images;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

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

    // private function check_if_auction_finished($end_date,$date){
    //     if(date_create($end_date)<date_create($date)){ return true; }
    //     else{ return false; }
    // }
    private function check_if_auction_finished($end_date, $date){
        $end_date_obj = \Carbon\Carbon::parse($end_date);
        $current_date_obj = \Carbon\Carbon::parse($date);
    
        if($end_date_obj->lt($current_date_obj)){
            return true;
        } else {
            return false;
        }
    }
    
     

    // public function read(Request $request){
    //     $user=$request->user();
    //     if (!$user) {
    //         return response()->json(['error' => 'User not authenticated'], 401);
    //     }

    //     $auctions=AuctionModel::all();

    //     // Structure the data as needed for the frontend
    //     $columns = [
    //         ['field' => 'id', 'headerName' => 'ID'],
    //         ['field' => 'created_by', 'headerName' => 'Created By'],
    //         ['field' => 'auction_name', 'headerName' => 'Auction Name'],
    //         ['field' => 'product_name', 'headerName' => 'Product Name'],
    //         ['field' => 'start_date', 'headerName' => 'Start Date'],
    //         ['field' => 'end_date', 'headerName' => 'End Date'],
    //         ['field' => 'start_price', 'headerName' => 'Start Price'],
    //         ['field' => 'product_description', 'headerName' => 'Product Description'],
    //         ['field' => 'product_category', 'headerName' => 'Product Category'],
    //         ['field' => 'product_certification', 'headerName' => 'Product Certification'],
    //         ['field' => 'delivery_status', 'headerName' => 'Delivery Status'],
    //         ['field' => 'status', 'headerName' => 'Status'],
    //         ['field' => 'winner', 'headerName' => 'Winner'],
    //     ];
    
    //     $rows = $auctions->map(function($auction) {
    //         $users = User::where('id', $auction->created_by)->first();
    //         $winner = User::where('id', $auction->winner)->first();
            
    //         // Get all images for this auction
    //         $images = auction_images::where('auction_id', $auction->id)->get();
        
    //         // If you want to return just one image URL, you can get the first one
    //          $image_url = $images->first() ? asset($images->first()->image_path) : null;
        
    //         // If you want to return all image URLs, you can map over the collection
    //         // $image_urls = $images->map(function($image) {
    //         //     return asset($image->image_path);
    //         // });

    //         if($this->check_if_auction_finished($auction->end_date,date('Y-m-d')) and $auction->winner==""){
    //             //Update winner
    //             $bids=BidsModel::where('auction_id',$auction->id)->order_by('price','desc')->first();
    //             $update_winner=AuctionModel::find($auction->id);
    //             $update_winner->winner=$bids->bidder;
    //             $update_winner->save();
    //             $winner = User::where('id', $bids->bidder)->first();
    //         }
        
    //         return [
    //             'id' => $auction->id,
    //             'created_by' => ucfirst($users->name),
    //             'auction_name' =>  ucfirst($auction->auction_name),
    //             'product_name' => ucfirst($auction->product_name),
    //             'start_date' => date_format(date_create($auction->start_date),'d-m-Y'),
    //             'end_date' => date_format(date_create($auction->end_date),'d-m-Y'),
    //             'start_price' => $auction->start_price,
    //             'product_description' => ucfirst($auction->product_description),
    //             'product_category' => ucfirst($auction->product_category),
    //             'product_certification' => ucfirst($auction->product_certification),
    //             'delivery_status' => ucfirst($auction->delivery_status),
    //             'status' => ucfirst($auction->status),
    //             'winner' =>  $winner ? ucfirst($winner->name) : null,
    //              'image_url' => $image_url,  // Include the first image URL here
    //           //  'image_urls' => $image_urls,  // Or include all image URLs here
    //         ];
    //     });
        
    //     return response()->json([
    //         'columns' => $columns,
    //         'rows' => $rows
    //     ]);
    // }

    public function read(Request $request)
{
    $user = $request->user();
    if (!$user) {
        return response()->json(['error' => 'User not authenticated'], 401);
    }

    $auctions = AuctionModel::all();

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

    $rows = $auctions->map(function ($auction) {
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

        $current_date = \Carbon\Carbon::now()->setTimezone('Asia/Kolkata')->format('Y-m-d');
        if ($this->check_if_auction_finished($auction->end_date, $current_date) && $auction->winner === null) {
            // Update winner
                    
            $bids = BidsModel::where('auction_id', $auction->id)->orderBy('price', 'desc')->first();
            if ($bids) {
                $update_winner = AuctionModel::find($auction->id);
                if ($update_winner) {
                    $update_winner->winner = $bids->bidder;
                    if ($update_winner->save()) {
                        Log::info("Winner updated successfully");
                    } else {
                        Log::error("Failed to update winner");
                    }
                    $winner = User::where('id', $bids->bidder)->first();
                } else {
                    Log::error("Auction not found");
                }
            } else {
                Log::info("No bids for this auction");
            }

        }

        return [
            'id' => $auction->id,
            'created_by' => ucfirst($users->name),
            'auction_name' => ucfirst($auction->auction_name),
            'product_name' => ucfirst($auction->product_name),
            'start_date' => date_format(date_create($auction->start_date), 'Y-m-d'),
            'end_date' => date_format(date_create($auction->end_date), 'Y-m-d'),
            'start_price' => $auction->start_price,
            'product_description' => ucfirst($auction->product_description),
            'product_category' => ucfirst($auction->product_category),
            'product_certification' => ucfirst($auction->product_certification),
            'delivery_status' => ucfirst($auction->delivery_status),
            'status' => ucfirst($auction->status),
            'winner' => $winner ? ucfirst($winner->name) : null,
            'image_url' => $image_url,  // Include the first image URL here
            // 'image_urls' => $image_urls,  // Or include all image URLs here
        ];
    });

    return response()->json([
        'columns' => $columns,
        'rows' => $rows
    ]);
}

public function showauction()
{
    

    $auctions = AuctionModel::all();

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

    $rows = $auctions->map(function ($auction) {
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

        $current_date = \Carbon\Carbon::now()->setTimezone('Asia/Kolkata')->format('Y-m-d');
        if ($this->check_if_auction_finished($auction->end_date, $current_date) && $auction->winner === null) {
            // Update winner
                    
            $bids = BidsModel::where('auction_id', $auction->id)->orderBy('price', 'desc')->first();
            if ($bids) {
                $update_winner = AuctionModel::find($auction->id);
                if ($update_winner) {
                    $update_winner->winner = $bids->bidder;
                    if ($update_winner->save()) {
                        Log::info("Winner updated successfully");
                    } else {
                        Log::error("Failed to update winner");
                    }
                    $winner = User::where('id', $bids->bidder)->first();
                } else {
                    Log::error("Auction not found");
                }
            } else {
                Log::info("No bids for this auction");
            }

        }

        return [
            'id' => $auction->id,
            'created_by' => ucfirst($users->name),
            'auction_name' => ucfirst($auction->auction_name),
            'product_name' => ucfirst($auction->product_name),
            'start_date' => date_format(date_create($auction->start_date), 'Y-m-d'),
            'end_date' => date_format(date_create($auction->end_date), 'Y-m-d'),
            'start_price' => $auction->start_price,
            'product_description' => ucfirst($auction->product_description),
            'product_category' => ucfirst($auction->product_category),
            'product_certification' => ucfirst($auction->product_certification),
            'delivery_status' => ucfirst($auction->delivery_status),
            'status' => ucfirst($auction->status),
            'winner' => $winner ? ucfirst($winner->name) : null,
            'image_url' => $image_url,  // Include the first image URL here
            // 'image_urls' => $image_urls,  // Or include all image URLs here
        ];
    });

    return response()->json([
        'columns' => $columns,
        'rows' => $rows
    ]);
}
    // public function update(Request $request){
    //     $user=$request->user();
    //     if (!$user) {
    //         return response()->json(['error' => 'User not authenticated'], 401);
    //     }

    //     //Validation
    //     $validated = $request->validate([
    //         'auction_name' => 'required|string',
    //         'product_name' => 'required|string',
    //         'start_date' => 'required|date',
    //         'end_date' => 'required|date',
    //         'start_price' => 'required|numeric',
    //         'product_description' => 'required|string',
    //         'product_category' => 'required|string',
    //         'product_certification' => 'required|string',
    //         'status' => 'required|string',
    //     ]);

    //     if(date_create($validated->end_date)<=date_create($validated->start_date)){ return response()->json(['error' => 'Date range is invalid'], 401); }

    //     //Update auction
    //     $auction=AuctionModel::find($request->id);

    //     $auction->auction_name=$request->auction_name;
    //     $auction->product_name=$request->product_name;
    //     $auction->start_date=$request->start_date;
    //     $auction->end_date=$request->end_date;
    //     $auction->start_price=$request->start_price;
    //     $auction->product_description=$request->product_description;
    //     $auction->product_category=$request->product_category;
    //     $auction->product_certification=$request->product_certification;
    //     $auction->status=$request->status;

    //     $status=$auction->save();

    //     if($status){ return response()->json(['message' => 'Auction updated successfully.'], 200); }
    //     else{ return response()->json(['error' => 'Unable to update auction! Try again.'], 401); }
    // }

    public function update(Request $request, $id)
{
    $user = $request->user();
    if (!$user) {
        return response()->json(['error' => 'User not authenticated'], 401);
    }

    // Validation
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

    if (Carbon::parse($validated['end_date'])->lte(Carbon::parse($validated['start_date']))) {
        return response()->json(['error' => 'End date must be greater than start date.'], 400);
    }
   
    // Retrieve the auction
    $auction = AuctionModel::find($id);
    if (!$auction) {
        return response()->json(['error' => 'Auction not found'], 404);
    }

    // Update auction fields
    $auction->auction_name = $validated['auction_name'];
    $auction->product_name = $validated['product_name'];
    $auction->start_date = $validated['start_date'];
    $auction->end_date = $validated['end_date'];
    $auction->start_price = $validated['start_price'];
    $auction->product_description = $validated['product_description'];
    $auction->product_category = $validated['product_category'];
    $auction->product_certification = $validated['product_certification'];
    $auction->status = $validated['status'];

    // Handle image upload if provided
    // Handle image upload if provided
    if ($request->hasFile('image')) {
        $image = $request->file('image');
        $imageName = time() . '.' . $image->getClientOriginalExtension();
        $image->move(public_path('images'), $imageName);

        // Update the image path in the auction_images table
        $upload_status = auction_images::where('auction_id', $id)->update(['image_path' => $imageName]);

        if(!$upload_status) {
            return response()->json(['error' => 'Unable to update image! Try again.'], 401);
        }
    }
     // Save the updated auction
     $auction->save();
     return response()->json(['message' => 'Auction updated successfully.'], 200); 
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

    public function read_by_id(Request $request,$id){
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
       
      
        $winnerName = null;
        $result = 'Result not yet announced';
        if ($auctions->winner != null) {
            $winnerUser = User::where('id', $auctions->winner)->first();
            if ($winnerUser) {
                $winnerName = ucfirst($winnerUser->name);
                if ($auctions->created_by == $user->id) {
                    $result = 'Auction completed';
                } else {
                    $result = $auctions->winner == $user->id ? 'You won the auction' : 'Better luck next time';
                }
            }    
        }
    
        $currentUserId = $user->id;
        $users = User::where('id', $auctions->created_by)->first();
        $currentUserId = $users->id === $user->id ? 0 : 1;        
        $images = auction_images::where('auction_id', $auctions->id)->first();
    
        $image_name = "";
        if ($images) {
            $image_name = $images->image_path;
        }
        
        $row = [
            'id' => $auctions->id,
            'image'=>$image_name,
            'created_by' => ucfirst($users->name),
            'auction_name' =>  ucfirst($auctions->auction_name),
            'product_name' => ucfirst($auctions->product_name),
            'start_date' => date_format(date_create($auctions->start_date),'d-m-Y'),
            'end_date' => date_format(date_create($auctions->end_date),'d-m-Y'),
            'start_price' => $auctions->start_price,
            'product_description' => ucfirst($auctions->product_description),
            'product_category' => ucfirst($auctions->product_category),
            'product_certification' => ucfirst($auctions->product_certification),
            'delivery_status' => ucfirst($auctions->delivery_status),
            'status' => ucfirst($auctions->status),
            'winner' => $winnerName,
            'result'=> ucfirst($result),
            'currentUserId' => $currentUserId,
        ];
       
        return response()->json([
            'columns' => $columns,
            'rows' => [$row]
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
                'auction_name' =>  ucfirst($auction->auction_name),
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
 
  public function userauctions(Request $request){
    $user = $request->user();
    if (!$user) {
        return response()->json(['error' => 'User not authenticated'], 401);
    }

    $user_id = $user->id;
    $auctions = AuctionModel::where('created_by', $user_id)->get();

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
        return [
            'id' => $auction->id,
            'created_by' => ucfirst($users->name),
            'auction_name' => ucfirst($auction->auction_name),
            'product_name' => ucfirst($auction->product_name),
            'start_date' => date_format(date_create($auction->start_date),'d-m-Y'),
            'end_date' => date_format(date_create($auction->end_date),'d-m-Y'),
            'start_price' => $auction->start_price,
            'product_description' => ucfirst($auction->product_description),
            'product_category' => ucfirst($auction->product_category),
            'product_certification' => ucfirst($auction->product_certification),
            'delivery_status' => ucfirst($auction->delivery_status),
            'status' => ucfirst($auction->status),
            'winner' => ($winner) ? ucfirst($winner->name) : null,
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

        if($delivery->delivery_status=='verified'){ return response()->json(['error' => 'This account is not authorised for this operation.'], 401); }

        if($delivery->delivery_status=='delivered'){ return response()->json(['error' => 'This account is not authorised for this operation.'], 401); }

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
