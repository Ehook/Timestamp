(function () {
  const app = angular.module('app', ['ngRoute', 'angular-jwt']);


  app.run(($http, $rootScope, $location, $window) => {
    $http.defaults.headers.common.Authorization = `Bearer  ${$window.localStorage.token}`;
    $rootScope.$on('$routeChangeStart', (event, nextRoute, currentRoute) => {
      if (nextRoute.access !== undefined && nextRoute.access.restricted === true && !$window.localStorage.token) {
        event.preventDefault();
        $location.path('/login');
      }

      if ($window.localStorage.token && nextRoute.access.restricted === true) {
        $http.post('/api/verify', { token: $window.localStorage.token })
          .then((response) => {
          }, (err) => {
            delete $window.localStorage.token;
            $location.path('/login');
          });
      }
    });
  });

  app.config(($routeProvider, $locationProvider) => {
    $locationProvider.html5Mode(true);
    $routeProvider.when('/', {
      templateUrl: './templates/main.html',
      controller: 'MainController',
      controllerAs: 'vm',
      access: {
        restricted: false,
      },
    });
    $routeProvider.when('/login', {
      templateUrl: './templates/login.html',
      controller: 'LoginController',
      controllerAs: 'vm',
      access: {
        restricted: false,
      },
    });
    $routeProvider.when('/register', {
      templateUrl: './templates/register.html',
      controller: 'RegisterController',
      controllerAs: 'vm',
      access: {
        restricted: false,
      },
    });
    $routeProvider.when('/polls', {
      templateUrl: './templates/polls.html',
      controller: 'PollsController',
      controllerAs: 'vm',
      access: {
        restricted: false,
      },
    });
    $routeProvider.when('/polls/:id', {
      templateUrl: './templates/poll.html',
      controller: 'PollController',
      controllerAs: 'vm',
      access: {
        restricted: false,
      },
    });
    $routeProvider.when('/profile', {
      templateUrl: './templates/profile.html',
      controller: 'ProfileController',
      controllerAs: 'vm',
      access: {
        restricted: true,
      },
    });
    $routeProvider.otherwise('/');
  });
  app.controller('MainController', MainController);
  function MainController($location, $window) {
    const vm = this;
    vm.title = 'MainController';
  }
  app.controller('LoginController', LoginController);

  function LoginController($location, $window, $http) {
    const vm = this;
    const fieldset = document.querySelector('fieldset');
    vm.title = 'LoginController';
    vm.error = '';
    if (!$window.localStorage.token === true) {

    } else {
      vm.error = 'Already logged in, go to the polls and vote!';
      fieldset.disabled = true;
    }
    vm.login = function () {
      if (vm.user) {
        $http.post('/api/login', vm.user)
          .then((response) => {
            $window.localStorage.token = response.data;
            $location.path('/profile');
          }, (err) => {
            vm.error = err;
          });
      } else {
        console.log('No Credentials Supplied');
      }
    };
  }
  app.controller('RegisterController', RegisterController);

  function RegisterController($location, $window, $http) {
    const vm = this;
    const fieldset = document.querySelector('fieldset');
    vm.title = 'RegisterController';
    vm.error = '';
    if (!$window.localStorage.token === true) {

    } else {
      vm.error = 'Already registered, go to the polls and vote!';
      fieldset.disabled = true;
    }
    vm.register = function () {
      if (!vm.user) {
        console.log('Invalid Credentials');
        return;
      }
      $http.post('/api/register', vm.user)
        .then((response) => {
          $window.localStorage.token = response.data;
          $location.path('/profile');
        }, (err) => {
          vm.error = err.data.errmsg;
        });
    };
  }
  app.controller('ProfileController', ProfileController);

  function ProfileController($location, $window, jwtHelper) {
    const vm = this;
    vm.title = 'ProfileController';
    vm.user = null;
    const token = $window.localStorage.token;
    const payload = jwtHelper.decodeToken(token).data;
    if (payload) {
      vm.user = payload;
    }
    vm.logOut = function () {
      delete $window.localStorage.token;
      vm.user = null;
      $location.path('/login');
    };
  }
  app.controller('PollsController', PollsController);

  function PollsController($location, $window, $http, jwtHelper) {
    const vm = this;
    let user;
    let id;
    vm.error = '';
    vm.error1 = '';
    if (!$window.localStorage.token === true) {
      user = 'guest';
      id = '13245678';
      vm.error = "You won't be able to vote until you login.";
    } else {
      user = jwtHelper.decodeToken($window.localStorage.token);
      id = user.data._id;
      vm.error1 = 'Vote on any existing polls or Create your own.';
    }
    vm.title = 'PollsController';
    vm.polls = [];
    vm.poll = {
      name: '',
      options: [],
      user: id,
    };
    vm.poll.options = [{
      name: '',
      votes: 0,
    }];
    vm.addOption = function () {
      vm.poll.options.push({
        name: '',
        votes: 0,
      });
    };
    vm.getAllPolls = function () {
      $http.get('/api/polls')
        .then((response) => {
          vm.polls = response.data;
          let i;
          for (i = 0; i < vm.polls.length; i += 1) {
            if (user.data._id === vm.polls[i].user) {
              vm.removePoll = 'Remove button created';
            } else if (!user.data._id === true) {

            }
          }
        }, (err) => {
          console.log(err);
        });
    };
    vm.getAllPolls();
    vm.addPoll = function () {
      if (!vm.poll) {
        console.log('Invalid data supplied');
        return;
      }
      $http.post('/api/polls', vm.poll)
        .then((response) => {
          vm.poll = {
            name: '',
            options: [],
            user: id,
          };
          vm.poll.options = [{
            name: '',
            votes: 0,
          }];
          vm.getAllPolls();
        }, (err) => {
          vm.poll = {
            name: '',
            options: [],
            user: id,
          };
          vm.poll.options = [{
            name: '',
            votes: 0,
          }];
          console.log(err);
        });
    };
  }
  app.controller('PollController', PollController);

  function PollController($location, $window, $http, jwtHelper) {
    const vm = this;
    const fieldset = document.querySelector('fieldset');
    let user;
    let id;
    vm.error = '';
    vm.error1 = '';
    vm.removePoll = '';
    if (!$window.localStorage.token === true) {
      user = 'guest';
      id = '13245678';
      vm.error = 'Please log in to vote.';
      fieldset.disabled = true;
    } else {
      user = jwtHelper.decodeToken($window.localStorage.token);
      id = user.data._id;
      vm.error1 = 'Select an option or Create your own.';
    }
    vm.pollList = [];
    vm.pollpage = {
      name: '',
      options: [],
      user: id,
    };
    vm.pollpage.options = [{
      name: '',
      votes: 0,
    }];
    vm.title = 'PollController';
    vm.getCheckedboxes = function () {
      vm.checkedboxes = document.querySelectorAll('input');
    };
    vm.specificPollID = function () {
      $http.get('/api/polls/:id')
        .then((request) => {
          vm.uniqueID = request.data;
        });
      $http.get('/api/polls')
        .then((request) => {
          vm.pollList = request.data;
          let i;
          for (i = 0; i < vm.pollList.length; i += 1) {
            if (vm.uniqueID !== vm.pollList[i]._id) {
              continue;
            }
            vm.pollpage = vm.pollList[i];
          }
          if (user.data._id === vm.pollpage.user) {
            vm.removePoll = 'Remove button created';
          } else if (!user.data._id === true) {

          }
        });
    };

    vm.updatePollOption = function () {
      $http.put(`/api/polls/${vm.uniqueID}`, vm.pollpage)
        .then((response) => {
          vm.pollpage = {
            name: '',
            options: [],
            user: id,
          };
          vm.pollpage.options = [{
            name: '',
            votes: 0,
          }];
        }, (err) => {
          vm.pollpage = {
            name: '',
            options: [],
            user: id,
          };
          vm.pollpage.options = [{
            name: '',
            votes: 0,
          }];
        });
      location.reload();
    };
    vm.addOption = function () {
      const x = document.getElementById('NewOption');
      const Optionname = x.querySelector('input');
      vm.pollpage.options.push({
        name: `${Optionname.value}`,
        votes: 0,
      });
      vm.updatePollOption();
    };
    vm.specificPollID();
    vm.likeButton = function () {
      const fieldset = document.querySelector('fieldset');
      let checkedboxID;
      let polloption;
      let polloptionID;
      let i;
      vm.updatePollData = function () {
        $http.put(`/api/polls/${vm.uniqueID}`, vm.pollpage)
          .then((response) => {
            vm.pollpage = {
              name: '',
              options: [],
              user: id,
            };
            vm.pollpage.options = [{
              name: '',
              votes: 0,
            }];
          }, (err) => {
            vm.pollpage = {
              name: '',
              options: [],
              user: id,
            };
            vm.pollpage.options = [{
              name: '',
              votes: 0,
            }];
          });
      };
      for (i = 0; i < vm.pollpage.options.length; i += 1) {
        polloption = vm.pollpage.options[i];
        polloptionID = vm.pollpage.options[i]._id;
        if (vm.checkedboxes[i] === undefined) {
          alert('No polls selected!');
        } else if (vm.checkedboxes[i].checked === true) {
          checkedboxID = vm.checkedboxes[i].id;

          if (checkedboxID === polloptionID) {
            polloption.votes += 1;
            fieldset.disabled = true;
            vm.updatePollData();
            break;
          }
          continue;
        }
      }
    };
  }
}());
