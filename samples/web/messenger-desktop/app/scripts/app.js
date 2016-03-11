'use strict';

/**
 * @ngdoc overview
 * @name messengerApp
 * @description
 * # messengerApp
 *
 * Main module of the application.
 */
angular
  .module('messengerApp', [
    'ngAnimate',
    'ngResource',
    'ui.router',
    'ngSanitize',
    'ngTouch',
    'monospaced.elastic',
    'angularMoment',
    'ui.bootstrap'
  ])

  .run(function($location, authService, $rootScope, $state) {

    // initialize the SDK by setting client information

    Max.init({
        clientId: '<your client id>',
        clientSecret: '<your client secret>',
        baseUrl: 'https://sandbox.magnet.com/mobile/api'
    });

    Max.Config.logging = true;
    Max.Config.payloadLogging = true;
    Max.Config.logLevel = 'FINE';

    // handle not authorized and session expiry errors by redirecting to login page
    Max.on('not-authenticated', function() {
      authService.isAuthenticated = false;
      authService.currentUser = null;
      $state.go('login');
    });

    // handle authentication by redirecting to home page
    Max.on('authenticated', function() {
      authService.isAuthenticated = true;
      authService.currentUser = Max.getCurrentUser();
      authService.userAvatar = authService.currentUser.extras.hasAvatar ? authService.currentUser.getAvatarUrl() : null;
      authService.initials = authService.getInitials(authService.currentUser);
      $state.go('app');
    });

    // make sure Message SDK is ready by having application logic execute after the onReady call
    Max.onReady(function() {
      setTimeout(function() {
        // do something
        loading_screen.finish();
      }, 500);
    });

  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('app', {
      url: '/chat',
      templateUrl: 'views/main.html',
      controller: 'MainCtrl'
    })

    .state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
      controller: 'LoginCtrl'
    })

    .state('register', {
      url: '/register',
      templateUrl: 'views/register.html',
      controller: 'RegisterCtrl'
    })

    .state('app.chat', {
      url: '/:channelName/:userId',
      templateUrl: 'views/chat.html',
      controller: 'ChatCtrl'
    });

    $urlRouterProvider.otherwise('/login');

  });
