app.constant('appConfig', {
    "dir_directive": "./template/directive/",
    // "domain": "http://localhost/#/",
    // "api_endpoint": "http://localhost/api",
    "domain": "//www.bytesizedeals.co.uk/",
    "api_endpoint": "//www.bytesizedeals.co.uk/api",
    "GOOGLE_MAP_API_KEY": "AIzaSyDXSdlgKC-1UWAhh8aEtQ2PQWj5Pfbo0oU",
    "rate": 5,
    "max_gallery_upload" : 5,
    "max_gallery_size_upload" : 1,
    "vat_tax": 0,
    "restaurant_signup_cost": 60,
    "image_size":{
        width: 679,
        height: 400
    },
    "contract_renewal": 14,
    "max_description_limit": 500,
    "max_blog_limit": 200
});

app.constant('paypalConfig', {
    "environment": {
        "sandbox": "sandbox",
        "production": "production"
    },
    "sandbox":{
        "api_key": "AfoJDzyzUMIjwFdz8lyB4ZmQ0xfYbCjnINtrO_mvWvOhFnDnNdyi1iKCZckiBWFQk3GibpSLk_6IUUN7"
    },
    "production":{
        "api_key": "AS32vqPSePRfD8NQzJzrjImTG6Mp0G9EWDBeV54GS_ubf4926P_-3TwNA81dLtpi3CDT5QI7lKIQb8Zf"
    }
});


app.constant('appPath', {
    'home':{
        path: '/',
        name: 'home'
    },
    'signup':{
        path: '/signup',
        name: 'signup'
    },
    'restaurantSignup':{
        path: '/restaurant/signup',
        name: 'restaurantSignup'
    },
    'restaurantUpdate':{
        path: '/restaurant/update',
        name: 'restaurantUpdate'
    },
    'restaurantApproval':{
        path: '/restaurant/approval',
        name: 'restaurantApproval'
    },
    'login':{
        path: '/login',
        name: 'login'
    },
    'reset':{
        path: '/login/reset',
        name: 'reset'
    },
    'resetPassword':{
        path: '/login/reset/password/:token',
        name: 'resetPassword'
    },
    'activate':{
        path: '/activate/:token',
        name: 'activate'
    },
    'restaurant':{
        path: '/restaurant/:id',
        name: 'restaurant'
    },
    'restaurantProfile':{
        path: '/restaurant/profile/:id',
        name: 'restaurantProfile'
    },
    'wishList':{
        path: '/wishList',
        name: 'wishList'
    },
    'contactUs':{
        path: '/contactUs',
        name: 'contactUs'
    },
    'myAccount':{
        path: '/myAccount',
        name: 'myAccount'
    },
    'aboutUs':{
        path: '/aboutUs',
        name: 'aboutUs'
    },
    'purchaseHistory':{
        path: '/purchaseHistory',
        name: 'purchaseHistory'
    },
    'termsAndConditions':{
        path: '/terms-and-conditions',
        name: 'termsAndConditions'
    },
    'privacyPolicy':{
        path: '/privacy-policy',
        name: 'privacyPolicy'
    }
});

app.constant('contactConfig', {
    email: 'contact.us@bytesizedeals.co.uk'
});

app.constant('categories', ['Arabian', 'Chinese', 'Turkish', 'Pizza', 'Spanish', 'Mexican', 'Chicken', 'Indian']);