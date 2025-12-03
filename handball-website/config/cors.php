<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Laravel CORS Configuration
    |--------------------------------------------------------------------------
    |
    | This configuration allows your Laravel API to accept requests from
    | your frontend domains, including localhost and deployed apps.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    // Allow all HTTP methods
    'allowed_methods' => ['*'],

    // Allowed frontend origins
    'allowed_origins' => [
        'http://localhost:3000',          // local development
        'https://handball263.vercel.app', // Vercel production frontend
    ],

    // Optional: allow future Vercel deployments dynamically
    'allowed_origins_patterns' => [
        '/https:\/\/.*\.vercel\.app/',  // regex to match any Vercel preview URL
        '/https:\/\/.*-handball263\.vercel\.app/', // Vercel branch deployments
    ],

    // Allow all headers
    'allowed_headers' => ['*'],

    // Expose no extra headers
    'exposed_headers' => [],

    // Cache preflight response for 1 hour
    'max_age' => 3600,

    // Set to true if you plan to use cookies/auth in requests
    'supports_credentials' => false,
];