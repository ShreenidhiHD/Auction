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

    private function previous_bid_amount($auction_id){
        $result=BidsModel::where('id',$auction_id)->latest('created_at')->first();
        return $result->price;
    }

    private function is_winner($user_id,$auction_id){
        $result=AuctionModel::where('id',$auction_id)->first();
        if($result->winner==$user_id){ return true; }
        else{ return false; }
    }

    public function create(Request $request){
        $user=$request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        //Validation
        $validated = $request->validate([
            'auction_id' => 'required|integer',
            'bidder' => 'required|integer',
            'price' => 'required|number',
        ]);

        //Check auction status
        if($this->auction_status($request->auction_id)!='active'){ return response()->json(['error' => 'Auction is deactivated or reported as spam'], 401); }

        //Check user status
        if($this->user_status($request->bidder)!='active'){ return response()->json(['error' => 'User account is deactivated'], 401); }

        //Compare to previous bids
        if($this->previous_bid_amount($request->auction_id)>=$request->price){ return response()->json(['error' => 'Please bid higher than previous bid'], 401); }

        //Create new bid
        $status=BidsModel::create($validated);

        if($status){ return response()->json(['message' => 'Bid successful.'], 200); }
        else{ return response()->json(['error' => 'Unable to bid! Try again.'], 401); }
    }

    public function read($auction_id){
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
