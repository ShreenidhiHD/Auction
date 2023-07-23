<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Env;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\AuctionController;
use App\Http\Controllers\BidsController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ManagerController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route for user registration
Route::post('/signup', [UserController::class, 'signup']);

// Route for user login
Route::post('/login', [UserController::class, 'login']);
Route::get('/user-role', [UserController::class, 'userrole'])->middleware('auth:sanctum');
// Route for user logout, accessible only for authenticated users
Route::post('/logout', [UserController::class, 'logout'])->middleware('auth:sanctum');
Route::middleware('auth:sanctum')->get('/validate-token',[UserController::class, 'validateToken']);
Route::middleware('auth:sanctum')->get('/user/profile', [UserController::class, 'getProfile']);
Route::middleware('auth:sanctum')->put('/user/profile', [UserController::class, 'updateProfile']);
Route::middleware('auth:sanctum')->put('/user/change-password', [UserController::class, 'changePassword']);
Route::get('/user/is-profile-complete', [UserController::class, 'isProfileComplete'])->middleware('auth:sanctum');

// Route to fetch application settings
Route::get('/settings', [SettingsController::class, 'getSettings']);
Route::post('/reset-password', [UserController::class, 'resetPassword']);
Route::get('/show_auctionhome',[AuctionController::class, 'showauction']);
//Auction routes
Route::middleware('auth:sanctum')->post('/create_auction',[AuctionController::class, 'create']); //To create new auctions (auction_name,product_name,start_date,end_date,start_price,product_description,product_category,product_certification,status are required)
Route::middleware('auth:sanctum')->get('/show_auction',[AuctionController::class, 'read']); //To display all auctions
Route::middleware('auth:sanctum')->post('/update_auction/{id}',[AuctionController::class, 'update']); //Updates auction details (auction_name,product_name,start_date,end_date,start_price,product_description,product_category,product_certification,status are required)
Route::middleware('auth:sanctum')->get('/delete_auction/{id}',[AuctionController::class, 'delete']); //Auction status set to inactive (send auction_id to this route)
Route::middleware('auth:sanctum')->get('/result_page/{id}',[AuctionController::class, 'read_by_id']); //Auction details and winner details are returned here 
Route::middleware('auth:sanctum')->get('/won_auctions',[AuctionController::class, 'wonAuctions']);
Route::middleware('auth:sanctum')->get('/withdrawbids/{id}',[AuctionController::class, 'withdrawBids']);

Route::middleware('auth:sanctum')->get('/my_auctions/{user_id}',[AuctionController::class, 'read_by_user_id']); //My_auctions page
Route::middleware('auth:sanctum')->get('/my_auctionslist',[AuctionController::class, 'userauctions']); //My_auctions page
Route::middleware('auth:sanctum')->post('/announce_winner',[AuctionController::class, 'update_winner']); //To update winner of the auction manually (If incase needed you can use this route) needs $request->id(auction_id) and $request->winner(user_id of winner) as inputs
Route::middleware('auth:sanctum')->post('/update_delivery_status',[AuctionController::class, 'update_delivery_status']); //Can update auction status (allowed status are pending and shipped)
Route::middleware('auth:sanctum')->get('/report_auction/{auction_id}',[AuctionController::class, 'report_auction']); //Call this route when user clicks on report button

//Bids routes
Route::middleware('auth:sanctum')->post('/create_bid',[BidsController::class, 'create']); //Place new bid (auction_id,price are required) 
Route::middleware('auth:sanctum')->get('/show_bids/{auction_id}',[BidsController::class, 'read']); //Display all the bids of all the users for specific auction
Route::middleware('auth:sanctum')->get('/show_bid/{bid_id}',[BidsController::class, 'read_by_id']); //Display specific bid
Route::middleware('auth:sanctum')->get('/my_participation/{user_id}',[BidsController::class, 'read_by_user_id']); //my_participation page
Route::middleware('auth:sanctum')->get('/my_participations',[BidsController::class, 'read_by_user']); //my_participation page
Route::middleware('auth:sanctum')->get('/delete_bid/{bid_id}',[BidsController::class, 'delete']); //Deletes the bid from database (Actual delete)

//Admin routes
Route::middleware('auth:sanctum')->get('/admin/users',[AdminController::class, 'view_users']); //List of users
Route::middleware('auth:sanctum')->patch('/admin/users_update/{user_id}/{status}',[AdminController::class, 'update_user']); //To update user status
Route::middleware('auth:sanctum')->get('/admin/auctions',[AdminController::class, 'auctions']); //List of auctions
Route::middleware('auth:sanctum')->patch('/admin/auctions_update/{auction_id}/{status}',[AdminController::class, 'update_auction']); //To update auction status
Route::middleware('auth:sanctum')->get('/admin/bids/{auction_id}',[AdminController::class, 'bids']); //List of bids by auction id
Route::middleware('auth:sanctum')->get('/admin/auction_by_id/{id}',[AdminController::class, 'read_by_id']); //To view indivisual auctions
Route::middleware('auth:sanctum')->get('/admin/reported_auctions',[AdminController::class, 'reported_auctions']); //List of reported auctions
Route::middleware('auth:sanctum')->get('/admin/reported_auctions_update/{auction_id}/{status}',[AdminController::class, 'reported_auctions']); //Update reported auction status (can send active or deactive) 
Route::middleware('auth:sanctum')->post('/admin/create_manager',[AdminController::class, 'create_manager']); //Create new manager (name,email are required)
Route::middleware('auth:sanctum')->get('/admin/managers_list',[AdminController::class, 'managers']); //Manager list to show in assign manager to auction page
Route::middleware('auth:sanctum')->get('/admin/assign_manager/{auction_id}/{manager_id}',[AdminController::class, 'assign_to_manager']); //Assign the manager to the auction
Route::middleware('auth:sanctum')->get('/admin/managerslist',[AdminController::class, 'managerslist']); //Manager list to show in assign manager to auction page
//Manager routes
Route::middleware('auth:sanctum')->get('/manager/assigned_auctions',[ManagerController::class, 'read']); //To display auctions assigned to manager (Manager home page)
Route::middleware('auth:sanctum')->get('/manager/verify/{auction_id}/{status}',[ManagerController::class, 'update_auction']); //Update the auction status (status allowed are rejected)
Route::middleware('auth:sanctum')->get('/manager/verify/{auction_id}/{status}',[ManagerController::class, 'update_auction']); //Update the auction status (status allowed are verified)
Route::middleware('auth:sanctum')->get('/manager/ship/{auction_id}/{status}',[ManagerController::class, 'update_auction']); //Update the auction status (status allowed are shipped)
Route::middleware('auth:sanctum')->get('/manager/delivery/{auction_id}/{status}',[ManagerController::class, 'update_auction']); //Update the auction status (status allowed are delivered)