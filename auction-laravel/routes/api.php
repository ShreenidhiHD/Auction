<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Env;
use App\Http\Controllers\UserController;
use App\Http\Controllers\SettingsController;
use App\Http\Controllers\FoodDonationsController;
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

//Auction routes
Route::middleware('auth:sanctum')->post('/create_auction',[AuctionController::class, 'create']);
Route::middleware('auth:sanctum')->get('/show_auction',[AuctionController::class, 'read']);
Route::middleware('auth:sanctum')->post('/update_auction',[AuctionController::class, 'update']);
Route::middleware('auth:sanctum')->get('/delete_auction/{id}',[AuctionController::class, 'delete']);
Route::middleware('auth:sanctum')->get('/show_auction_by_id/{id}',[AuctionController::class, 'read_by_id']);
Route::middleware('auth:sanctum')->post('/announce_winner',[AuctionController::class, 'update_winner']);
Route::middleware('auth:sanctum')->post('/update_delivery_status',[AuctionController::class, 'update_delivery_status']);

//Bids routes
Route::middleware('auth:sanctum')->post('/create_bid',[BidsController::class, 'create']);
Route::middleware('auth:sanctum')->get('/show_bids/{auction_id}',[BidsController::class, 'read']);
Route::middleware('auth:sanctum')->get('/show_bid/{bid_id}',[BidsController::class, 'read_by_id']);
Route::middleware('auth:sanctum')->get('/delete_bid/{bid_id}',[BidsController::class, 'delete']);