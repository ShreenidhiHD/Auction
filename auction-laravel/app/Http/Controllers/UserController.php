<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Database\QueryException;
use PDOException;
use Illuminate\Support\Facades\Auth;



class UserController extends Controller
{
    // Signup function handles user registration
    public function signup(Request $request)
    {
        try {
            // Validate the request data
            $validatedData = $request->validate([
                'name' => 'required',
                'email' => 'required|email|unique:users',
                'password' => 'required|min:8',
            ]);

            // Log the validated data
            Log::info('Validated Data:', $validatedData);

            // Hash the password before storing it
            $validatedData['password'] = Hash::make($request->password);

            // Create the user with validated data
            $user = User::create($validatedData);

            // Create a token for the user
            $token = $user->createToken('authToken')->plainTextToken;

            // Log the created user
            Log::info('User created:', [$user->toArray()]);

            // Return the token to the client
            return response()->json(['token' => $token], 201);
        } catch (ValidationException $e) {
            // Log the validation error
            Log::error('Validation error:', $e->errors());

            return response()->json(['message' => $e->errors()], 422);
        } catch (\Exception $e) {
            // Log the exception
            Log::error('Exception:', $e->getMessage());

            return response()->json(['message' => 'Signup failed. Please try again.'], 500);
        }
    }

    // Login function handles user authentication
    public function login(Request $request)  
    {  
        try {  
            // Validate the request data
            $request->validate([  
                'email' => 'required|email',  
                'password' => 'required',  
            ]);  

            // Check if the user exists and the password is correct
            $user = User::where('email', $request->email)->first();  

            if (!$user || !Hash::check($request->password, $user->password)) {  
                return response()->json(['message' => 'The provided credentials are incorrect.'], 401);  
            }  

            // Create a token for the user
            $token = $user->createToken('authToken')->plainTextToken;  

            // Return the token to the client
            return response()->json(['token' => $token], 201);  
        }   
        catch (QueryException $e) {  
            return response()->json(['message' => $e->getMessage()], 400);  
        }  
        catch (PDOException $e) {  
            // Log the database connection error
            Log::error('Database connection error:', $e->getMessage());

            return response()->json(['message' => 'Database connection failed. Please try again later.'], 503);  
        } 
        catch (ValidationException $e) {  
            // Log the validation error
            Log::error('Validation error:', $e->errors());

            return response()->json(['message' => $e->errors()], 422);  
        } 
        catch (\Exception $e) {  
            // Log the exception
            Log::error('Exception:', $e->getMessage());

            return response()->json(['message' => 'Login failed. Please try again.'], 500);
        }
    }

    // Logout function handles user deauthentication
   public function logout(Request $request)
    {
        // Check if the user is authenticated
        if ($request->user()) {
            // Delete all tokens for the authenticated user, effectively logging them out
            $request->user()->tokens()->delete();

            // Return success message
            return response()->json(['message' => 'Logged out successfully'], 200);
        } else {
            // Return error message if no user is authenticated
            return response()->json(['message' => 'User not authenticated'], 401);
        }
    }

    public function getProfile(Request $request)
    {
        $user = Auth::guard('sanctum')->user();

        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        return response()->json($user);
    }

    public function updateProfile(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'mobile' => 'required',
            'email' => 'required|email|unique:users,email,' . Auth::guard('sanctum')->id(),
            'whatsapp' => 'required',
            'address' => 'required',
            'pincode' => 'required'
        ]);

        $user = Auth::guard('sanctum')->user();

        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $user->name = $request->name;
        $user->mobile = $request->mobile;
        $user->email = $request->email;
        $user->whatsapp = $request->whatsapp;
        $user->address = $request->address;
        $user->pincode = $request->pincode;

        $user->save();

        return response()->json(['message' => 'Profile updated successfully']);
    }
    public function changePassword(Request $request)
    {
        try {
            // Validate the request data
            $request->validate([
                'current_password' => 'required',
                'new_password' => 'required|min:8',
            ]);

            $user = $request->user();  // Retrieve the authenticated user

            // Verify the current password
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json(['message' => 'Current password is incorrect.'], 401);
            }

            // Update the password
            $user->password = Hash::make($request->new_password);
            $user->save();

            return response()->json(['message' => 'Password updated successfully.'], 200);
        } catch (QueryException $e) {
            return response()->json(['message' => $e->getMessage()], 400);
        } catch (PDOException $e) {
            // Log the database connection error
            Log::error('Database connection error:', $e->getMessage());

            return response()->json(['message' => 'Database connection failed. Please try again later.'], 503);
        } catch (ValidationException $e) {
            // Log the validation error
            Log::error('Validation error:', $e->errors());

            return response()->json(['message' => $e->errors()], 422);
        } catch (\Exception $e) {
            // Log the exception
            Log::error('Exception:', $e->getMessage());

            return response()->json(['message' => 'Password change failed. Please try again.'], 500);
        }
    }

    public function validateToken(Request $request)
    {
        try {
            // Get the authenticated user using Sanctum's "user" method
            $user = $request->user();

            if (!$user) {
                return response()->json(['message' => 'Invalid token'], 401);
            }

            // Token is valid, return success response
            return response()->json(['message' => 'Token validated successfully'], 200);
        } catch (Exception $e) {
            return response()->json(['message' => 'Token validation error'], 500);
        }
    }
}