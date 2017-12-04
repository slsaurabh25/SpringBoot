'use strict';

angular.module('crudApp').controller('UserController',
    ['UserService', '$scope',  function( UserService, $scope) {

        var self = this;
        self.user = {};
        self.users=[];

        self.submit = submit;
        self.getAllUsers = getAllUsers;
        self.createUser = createUser;
        self.updateUser = updateUser;
        self.removeUser = removeUser;
        self.editUser = editUser;
        self.reset = reset;
        self.ExcelExport = ExcelExport;
        self.getFileData = getFileData;
        self.successMessage = '';
        self.errorMessage = '';
        self.done = false;

        self.onlyIntegers = /^\d+$/;
        self.onlyNumbers = /^\d+([,.]\d+)?$/;

        function submit() {
            console.log('Submitting');
            if (self.user.id === undefined || self.user.id === null) {
                console.log('Saving New User', self.user);
                createUser(self.user);
            } else {
                updateUser(self.user, self.user.id);
                console.log('User updated with id ', self.user.id);
            }
        }

        function createUser(user) {
            console.log('About to create user');
            UserService.createUser(user)
                .then(
                    function (response) {
                        console.log('User created successfully');
                        self.successMessage = 'User created successfully';
                        self.errorMessage='';
                        self.done = true;
                        self.user={};
                        $scope.myForm.$setPristine();
                    },
                    function (errResponse) {
                        console.error('Error while creating User');
                        self.errorMessage = 'Error while creating User: ' + errResponse.data.errorMessage;
                        self.successMessage='';
                    }
                );
        }


        function updateUser(user, id){
            console.log('About to update user');
            UserService.updateUser(user, id)
                .then(
                    function (response){
                        console.log('User updated successfully');
                        self.successMessage='User updated successfully';
                        self.errorMessage='';
                        self.done = true;
                        $scope.myForm.$setPristine();
                    },
                    function(errResponse){
                        console.error('Error while updating User');
                        self.errorMessage='Error while updating User '+errResponse.data;
                        self.successMessage='';
                    }
                );
        }


        function removeUser(id){
            console.log('About to remove User with id '+id);
            UserService.removeUser(id)
                .then(
                    function(){
                        console.log('User '+id + ' removed successfully');
                    },
                    function(errResponse){
                        console.error('Error while removing user '+id +', Error :'+errResponse.data);
                    }
                );
        }


        function getAllUsers(){
            return UserService.getAllUsers();
        }

        function editUser(id) {
            self.successMessage='';
            self.errorMessage='';
            UserService.getUser(id).then(
                function (user) {
                    self.user = user;
                },
                function (errResponse) {
                    console.error('Error while removing user ' + id + ', Error :' + errResponse.data);
                }
            );
        }
        
        function reset(){
            self.successMessage='';
            self.errorMessage='';
            self.user={};
            $scope.myForm.$setPristine(); //reset Form
        }
       
        function ExcelExport() {

        	console.log("Inside excelExport");
            var input = document.getElementById('importFile');
            var reader = new FileReader();
            reader.onload = function(){
                var fileData = reader.result;
                var wb = XLSX.read(fileData, {type : 'binary'});
                var allData = [];
                
                //For all Sheets
                /*wb.SheetNames.forEach(function(sheetName){
                var rowObj =XLSX.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);
                var jsonObj = JSON.stringify(rowObj);
                allData.push(jsonObj);
                console.log(jsonObj);
                })*/
                
                //For single sheet when sheet name known
                var rowObj =XLSX.utils.sheet_to_row_object_array(wb.Sheets["Sheet1"]);
                var jsonObj = JSON.stringify(rowObj);
                
                $scope.fileData = jsonObj;
                console.log($scope.fileData);
            };
            reader.readAsBinaryString(input.files[0]);
            };
        
            function getFileData(){
            	console.log("$scope.fileData",$scope.fileData);
                return $scope.fileData;
            }
        
    }
]);