<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\AuctionModel;
use App\Models\BidsModel;
use App\Models\auction_images;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;
use PDOException;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use App\Helpers\EmailHelper;

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

    public function update_user(Request $request,$user_id,$status){
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

    public function auctions(Request $request){
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
                'created_by' => $users ? ucfirst($users->name) : 'N/A',
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
                'winner' =>  $winner ? ucfirst($winner->name) : 'N/A',
                'created_at' => date_format(date_create($auction->created_at),'d-m-Y'),
            ];
        });
        
    
        return response()->json([
            'columns' => $columns,
            'rows' => $rows
        ]);
    }

    public function update_auction(Request $request,$auction_id,$status){
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
            $winner='';
            if($auction->winner!=''){ $winner=User::where('id',$auction->winner)->first(); }
            $result="";
            if($auction->winner==""){ $result="Not announced"; }
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

    private function quickRandom($length = 16)
    {
        $pool = '123456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ';

        return substr(str_shuffle(str_repeat($pool, 5)), 0, $length);
    }

    public function create_manager(Request $request){
        $validate = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
        ]);

        $newPassword=$this->quickRandom();// Generates a random 10 character password
        $validate['password'] = Hash::make($newPassword);
        $validate['role']='manager';

        $user = User::create($validate);

        try {
            // Prepare email data
            $emailData = [
                'to' => $user->email,
                'subject' => 'Your password has been reset',
                'data' => [
                    'name' => $user->name,
                    'message' => 'Your new password is: <b>' . $newPassword . '</b>',
                ],
            ];
        
            // Send email notification using your custom helper
            EmailHelper::mailSendGlobal($emailData['to'], $emailData['subject'], $emailData['data']);
            
        } catch (\Exception $e) {
            // Log the exception or handle it in another way
            \Log::error('Failed to send email: '.$e->getMessage());
        }

        if($user){ return response()->json(['message' => 'Manager account added successfully.'], 200); }
        else{ return response()->json(['error' => 'Unable to create manager account! Try again.'], 401); }
    }

    public function managers(Request $request){
        $user=$request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }
        
        if(!$this->is_admin($user->id)){ return response()->json(['error' => 'Unauthorised access'], 401); }

        // $users=User::where(['role'=>'manager','status'=>'active'])->get();
        $users=User::where(['role'=>'manager'])->get();
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
    public function managerslist(Request $request){
        $user=$request->user();
        if (!$user) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }
        
        if(!$this->is_admin($user->id)){ return response()->json(['error' => 'Unauthorised access'], 401); }
    
        $users=User::where(['role'=>'manager','status'=>'active'])->get();
      
        // Create an array with just the managers' ids and names
        $managers = $users->map(function($user) {
            return [
                'id' => $user->id,
                'name'=>ucfirst($user->name),
            ];
        });
    
        return response()->json([
            'managers' => $managers
        ]);
    }
    
    public function assign_to_manager($auction_id, $manager_id)
{
    // Check if manager is valid
    $manager = User::where('id', $manager_id)->first();
    
    if ($manager->role !== 'manager') {
        Log::error('Selected user is not a manager. Role: ' . $manager->role);
        return response()->json(['error' => 'Selected user is not a manager.'], 401);
    }

    if (strtolower($manager->status) !== 'active') {
        Log::error('Selected user is not active. Status: ' . $manager->status);
        return response()->json(['error' => 'Selected user is not active.'], 401);
    }

    // Check if auction does not have a manager
    $auction = AuctionModel::where('id', $auction_id)->first();

    if ($auction->status !== 'active') {
        Log::error('Selected auction is not active. Status: ' . $auction->status);
        return response()->json(['error' => 'Selected auction is not active.'], 401);
    }

    if ($auction->manager !== null || $auction->delivery_status == 'manager') {
        Log::error('Selected auction already has a manager assigned.');
        return response()->json(['error' => 'Selected auction already has a manager assigned.'], 401);
    }

    // Assign manager
    $status = AuctionModel::find($auction_id);

    $status->delivery_status = 'assigned';
    $status->manager = $manager_id;

    $results = $status->save();

    if ($results) {
        return response()->json(['message' => 'Manager assigned successfully.'], 200);
    } else {
        return response()->json(['error' => 'Unable to assign manager! Try again.'], 401);
    }
}

    
}
