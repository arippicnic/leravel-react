<?php

namespace App\Http\Controllers\Sales;

use Tymon\JWTAuth\Exceptions\JWTException;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\JsonResponse;
use App;
use Auth;
use Log;
use App\Http\Controllers\Controller;
use App\Requests\LoginValidation;
use App\Http\Controllers\APIController;

class LoginController extends APIController
{
    use AuthenticatesUsers;

    public function __construct()
    {
        auth()->shouldUse('api_sales');
    }

    /**
     * Login a supplier
     * 
     * @group Login
     * @bodyParam email string required the email address of the supplier
     * @bodyParam password string required the password of the supplier
     * 
     * @response {
     *    "access_token": "eyJ0eKHJhkHKJHkjojnbgfzI1NiJ9.eyJpc3MiOi..",
     *    "token_type": "bearer",
     *    "expires_in": 18000,
     *    "user_id": 42,
     *    "role": "ROLE_SUPPLIER_ADMIN",
     *    "name": "John Smith",
     *    "email": "john.smith9999@gmail.com",
     *    "type": "supplier"
     * }
     */
    public function login(LoginValidation $request)
    {
        try {
            $credentials = $request->only('email', 'password');
            
            if(!$token = auth()->attempt([
                'email' => $request->input('email'), 
                'password' => $request->input('password'),
                ])) {

                return $this->responseUnauthorized();
            }
        } catch (JWTException $e) {
             return $this->responseUnprocessable("Could not create token!");
        }

        return $this->respondWithToken($token);
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token): JsonResponse
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
            'user_id' => auth()->user()->id,
            'role' => auth()->user()->role,
            'email' => auth()->user()->email,
            'type' => 'sales' //api_sales guard 
        ]);
    }
}
