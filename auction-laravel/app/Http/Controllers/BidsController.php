<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\AuctionModel;
use App\Models\BidsModel;

class BidsController extends Controller
{
    private function auction_status($auction_id){
        $result=AuctionModel::where('id',$auction_id)->first();
        return $result->status;
    }

    private function user_status($user_id){
        $result=User::where('id',$user_id)->first();
        return $result->status;
    }

    private function previous_bid_amount($auction_id)
    {
        $result = BidsModel::where('auction_id', $auction_id)->latest('created_at')->first();
        return $result ? $result->price : 0;
    }

    private function is_less_than_start_price($auction_id,$bid_price){
        $auction=AuctionModel::where('id',$auction_id)->first();
        if($auction->start_price>$bid_price){ return true; }
        else{ return false; }
    }

    private function is_winner($user_id,$auction_id){
        $result=AuctionModel::where('id',$auction_id)->first();
        if($result->winner==$user_id){ return true; }
        else{ return false; }
    }
    private function is_in_date_range($start_date,$end_date,$today){
        if(date_create($end_date)<date_create($today) and date_create($today)<date_create($start_date)){ return true; }
        else{ return false; }
    }
    
    public function create(Request $request)
    {
    $user = $request->user();
    if (!$user) {
        return response()->json(['error' => 'User not authenticated'], 401);
    }
    $bidderId = $user->id;

    // Validation
    $validated = $request->validate([
        'auction_id' => 'required|integer',
        'price' => 'required|numeric',
    ]);

    // Check auction status
    $auctionStatus = $this->auction_status($request->auction_id);
    if ($auctionStatus != 'active') {
        return response()->json(['error' => 'Auction is deactivated or reported as spam'], 401);
    }

        // Validation
        $validated = $request->validate([
            'auction_id' => 'required|integer',
            'price' => 'required|numeric',
        ]);

        // Check auction status
        $auctionStatus = $this->auction_status($request->auction_id);
        if ($auctionStatus != 'active') {
            return response()->json(['error' => 'Auction is deactivated or reported as spam'], 401);
        }

        // Check user status
        $userStatus = $this->user_status($bidderId);
        if ($userStatus != 'active') {
            return response()->json(['error' => 'User account is deactivated'], 401);
        }

        // Compare to previous bids
        $previousBidAmount = $this->previous_bid_amount($request->auction_id);
        if ($previousBidAmount >= $request->price) {
            return response()->json(['error' => 'Please bid higher than the previous bid'], 401);
        }

        // Check if date range is correct
        $auction = AuctionModel::where('id', $request->auction_id)->first();
        if ($this->is_in_date_range($auction->start_date, $auction->end_date, date('Y-m-d'))) {
            return response()->json(['error' => 'Auction is not active'], 401);
        }

        //Check if bid is less than initial bidding price
        if($this->is_less_than_start_price($request->auction_id,$request->price)){ return response()->json(['error' => 'Can not bid less than initial price'], 401); }

        // Create new bid
        $validated['bidder'] = $bidderId; // Add the bidder ID to the validated data
        $status = BidsModel::create($validated);

        if ($status) {
            return response()->json(['message' => 'Bid successful'], 200);
        } else {
            return response()->json(['error' => 'Unable to bid! Try again'], 401);
        }
    }
   }


    public function read(Request $request, $auction_id){
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
            ['field' => 'created_at', 'headerName' => 'Created At'],
        ];

        $rows = $bids->map(function($bid) {
            $users=User::where('id',$bid->bidder)->first();
            $auction=AuctionModel::where('id',$bid->auction_id)->first();
            return [
                'id' => $bid->id,
                'auction_name' =>  ucfirst($auction->auction_name),
                'created_by' => ucfirst($users->name),
                'price' => number_format($bid->price,2),
                'created_at' => $bid->created_at->format('d-m-Y H:i')
            ];
        });
    
        return response()->json([
            'columns' => $columns,
            'rows' => $rows
        ]);
    }

    public function read_by_id($bid_id){
        $user=$request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $bids=BidsModel::where('id',$bid_id)->get();

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

    public function read_by_user_id($user_id){
        $user=$request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $bids=BidsModel::where('bidder',$user_id)->get();

        // Structure the data as needed for the frontend
        $columns = [
            ['field' => 'id', 'headerName' => 'ID'],
            ['field' => 'auction_name', 'headerName' => 'Auction Name'],
            ['field' => 'created_by', 'headerName' => 'Created By'],
            ['field' => 'start_date', 'headerName' => 'Start Date'],
            ['field' => 'product_name', 'headerName' => 'Product'],
            ['field' => 'end_date', 'headerName' => 'End Date'],
            ['field' => 'price', 'headerName' => 'My Bid'],
            ['field' => 'winner', 'headerName' => 'Winner'],
            ['field' => 'winning_bid', 'headerName' => 'Winning Bid'],
        ];

        $rows = $bids->map(function($bid) {
            $users=User::where('id',$bid->bidder)->first();
            $auction=AuctionModel::where('id',$bid->auction_id)->first();
            $winner=User::where('id',$auction->winner)->first();
            $winning=BidsModel::where(['auction_id'=>$bid->auction_id,'bidder'=>$auction->winner])->latest()->first();
            return [
                'id' => $bid->id,
                'auction_name' =>  ucfirst($auction->auction_name),
                'created_by' => ucfirst($users->name),
                'start_date' => date_format(date_create($bid->start_date),'d-m-Y'),
                'end_date' => date_format(date_create($bid->end_date),'d-m-Y'),
                'product_name' => ucfirst($bid->product_name),
                'price' => number_format($bid->price,2),
                'winner'=>ucfirst($winner->name),
                'winning_bid'=>number_format($winning->price,2),
            ];
        });
    
        return response()->json([
            'columns' => $columns,
            'rows' => $rows
        ]);
    }

    public function delete($bid_id){
        $user=$request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        $bid=BidsModel::where('id',$bid_id)->first();

        //Check auction status
        if($this->auction_status($bid->auction_id)!='active'){ return response()->json(['error' => 'Auction is deactivated'], 401); }

        //Check user status
        if($this->user_status($bid->bidder)!='active'){ return response()->json(['error' => 'User account is deactivated'], 401); }

        //Delete bid
        if($this->is_winner($bid->bidder,$bid->auction_id)){ return response()->json(['error' => 'Unable to delete winning bid! To cancle bid contact admin'], 401); }

        $bids=BidsModel::find($bid_id);

        if($bids->delete()){  return response()->json(['message' => 'Bid deleted successfully'], 200);  }
        else{ return response()->json(['error' => 'Unable to delete bid! Try again'], 401); }
    }
}
