<?php

namespace App\Http\Controllers;

use App\Facades\AppResponse;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Arr;
use Symfony\Component\HttpFoundation\RedirectResponse;

abstract class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;


     /**
     * Summary of handleResponse
     * @param array $response
     * @param string $message
     * @return RedirectResponse
     */
    public function handleResponse(array $response):RedirectResponse
    {

        $message  = Arr::get($response,'message');
        $status   = Arr::get($response,'status');
         
        $appResponse  =  $status 
                            ? AppResponse::asSuccess()
                            : AppResponse::asError();

        return $appResponse->withMessage($message)
                                ->build();
                                
    }
}
