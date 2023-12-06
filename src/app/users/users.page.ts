import { Component, OnInit, ViewChild} from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AppComponent } from "../app.component";
import { IonContent } from '@ionic/angular';
import Swal from 'sweetalert2';
import * as $ from "jquery";

@Component({
  selector: 'app-users',
  templateUrl: './users.page.html',
  styleUrls: ['./users.page.scss'],
})

export class UsersPage implements OnInit {

  BaseUrl = this.Link.BaseLink();

  @ViewChild(IonContent, { static: false }) content: any =  IonContent; 

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  users:any; 

  constructor(private storage: Storage,private Link: AppComponent) { 
    this.UserList();
  }

  CheckPhone(){
    let Text1:any = $("#phone").val();
    let Text1NoSpace:any =Text1.trim();
    let Text1Length:any = Text1NoSpace.length;

    if(Text1Length>10){
      Swal.fire({title:'Warning', icon:'warning', text:'The phone can be only 10 characers',heightAuto:false});
      $("#phone").val("");
    }

    if (Text1Length<=9){
      Swal.fire({title:'Warning', icon:'warning', text:'The phone can be only 10 characers',heightAuto:false});
      $("#phone").val("");
    }
  }

  CheckEmail(){


    var validRegex = "[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})";
    var Email:any = $("#email").val();

     if (!Email.match(validRegex)) {

        Swal.fire({title:'Error', icon:'error', text: 'The email provided is not a valid email please provide a valid email',heightAuto:false});
        $("#email").val("");

     }

  }

  CheckUser(){

    var user = $("#username").val();

    if(user!=""){

      $.ajax({
        url:this.BaseUrl+"index.php/Usuarios/CheckUserBD",
        type:'POST',
        crossDomain: true,
        timeout: 30000,
        data:{user:user},
        async: true,
        success:(data) =>{

          var obj = JSON.parse(data);

          if(obj!=""){

            Swal.fire({title:'Error', icon:'error', text: 'The user name is already in use, please try again',heightAuto:false});
            $("#username").val("");

          }


        },error:function(status, textStatus, jqXHR){

          if (status.statusText=="timeout") {

            Swal.fire({   
              title: 'Error',
              text: 'Your device is not connected to internet or your connection is very slow.\n Please try again',   
              icon: 'error',   
              heightAuto:false,
              allowOutsideClick: false,
              showCancelButton: false,   
              confirmButtonColor: "#DD6B55",   
              confirmButtonText: "OK",   
              cancelButtonText: "No, Cancelar",   
            }).then((result) => {
          if (result.value) {
              

                } 
            });
          }else{
            
            Swal.fire({title:'Error', icon:'error', text: 'An internal server error has occurred please contact the site admin',heightAuto:false});
          }

        }
      });

    }

  }

  SaveUser(){ 
    
    var name = $('#name').val();
    var lastname = $('#lastname').val();
    var lastnamem = $('#lastnamem').val();
    var phone = $('#phone').val();
    var email = $('#email').val();
    var user = $('#username').val();
    var password = $('#password').val();

    $('#preloader_u').show();
    $('#savebutton_u').attr('disabled','disabled');

    if(name!="" && lastname!="" && lastnamem!="" && phone!="" && email!="" && user!="" && password!=""){

      $.ajax({
        url:this.BaseUrl+"index.php/Usuarios/SaveUser",
        type:'POST',
        crossDomain: true,
        timeout: 30000,
        data:{name:name,lastname:lastname,lastnamem:lastnamem,phone:phone,email:email,user:user,password:password},
        async: true,
        success:(data) =>{

        $('#preloader_u').hide();
        $('#savebutton_u').attr('disabled', 'disabled');

          Swal.fire({title:'Success', icon:'success', text: 'User has been saved successfully',heightAuto:false});

          $('#savebutton_u').val("");
          $('#name').val("");
          $('#lastname').val("");
          $('#lastnamem').val("");
          $('#phone').val("");
          $('#email').val("");
          $('#username').val("");
          $('#password').val("");

          this.UserList();

        },error:function(status, textStatus, jqXHR){

          if (status.statusText=="timeout") {

            Swal.fire({   
              title: 'Error',
              text: 'Your device is not connected to internet or your connection is very slow.\n Please try again' ,   
              icon: 'error',   
              heightAuto:false,
              allowOutsideClick: false,
              showCancelButton: false,   
              confirmButtonColor: "#DD6B55",   
              confirmButtonText: "OK",   
              cancelButtonText: "No, Cancelar",   
            }).then((result) => {
          if (result.value) {
              $("#preloader_u").hide();
              $("#savebutton_u").attr('disabled','disabled');

                } 
            });
          }else{
            $("#preloader_u").hide();
            $("#savebutton_u").removeAttr('disabled');
            Swal.fire({title:'Error', icon:'error', text: 'An internal server error has occurred please contact the site admin',heightAuto:false});
          }

        }
      });


    }else{

      $("#preloader_u").hide();
      $("#savebutton_u").removeAttr('disabled');
      Swal.fire({title:'Warning', icon:'warning', text: 'There is missing info on the form',heightAuto:false});
    }

  }

  UserList(){

    $.ajax({
      url:this.BaseUrl+"index.php/Usuarios/ActiveUserList",
      type:'GET',
      crossDomain: true,
      timeout: 30000,
      async: true,
      success:(data) =>{

        var obj = JSON.parse(data);

        if(obj != ""){

            this.users = JSON.parse(data);

        }

      },error:function(status, textStatus, jqXHR){

        if (status.statusText=="timeout") {

          Swal.fire({   
            title: 'Error',
            text: 'Your device is not connected to internet or your connection is very slow.\n Please try again' ,   
            icon: 'error',   
            heightAuto:false,
            allowOutsideClick: false,
            showCancelButton: false,   
            confirmButtonColor: "#DD6B55",   
            confirmButtonText: "OK",   
            cancelButtonText: "No, Cancelar",   
          }).then((result) => {
        if (result.value) {
                

              } 
          });
        }else{

          Swal.fire({title:'Error', icon:'error', text: 'An internal server error has occurred please contact the site admin',heightAuto:false});
        }
      }
  
    });
  }

  Cancel(){

    $('#preloader_u').show();
    $('#id_u').val("");
    $('#name').val("");
    $('#lastname').val("");
    $('#lastnamem').val("");
    $('#phone').val("");
    $('#email').val("");
    $('#username').val("");
    $('#password').val("");
    $('#role').val("");
    $('#type').val("");
    $('#status').val("");
    $('#preloader_u').hide();
    $("#savebutton_u").show();
    $("#updatebutton_u").attr("hidden");
    $("#cancelbutton_u").attr("hidden");
    $("#username").attr("disabled");
    $("#password").attr("disabled");

          this.UserList();

  }

  EditUser(id:any){

    var id = id;

    $.ajax({
      url:this.BaseUrl+"index.php/Usuarios/UserById",
      type:'POST',
      data:{id:id},
      crossDomain: true,
      timeout: 30000,
      async: true,
      success:(data) =>{

        var obj = JSON.parse(data);

        if(obj != ""){

          $("#savebutton_u").hide();

          var id = obj[0].id_usuario;
          var name = obj[0].nombre;
          var lastname = obj[0].apaterno;
          var lastnamem = obj[0].amaterno;
          var phone = obj[0].telefono;
          var email = obj[0].email;
          var user = obj[0].username;
          var password = obj[0].password;
          var role = obj[0].rol;
          var type = obj[0].ocupacion;
          var status = obj[0].estado;

          $("#id_u").val(id);
          $("#name").val(name);
          $("#lastname").val(lastname);
          $("#lastnamem").val(lastnamem);
          $("#phone").val(phone);
          $("#email").val(email);
          $("#username").val(user);
          $("#password").val(password);
          $("#role").val(role);
          $("#type").val(type);
          $("#status").val(status);

          $("#username").attr("disabled");
          $("#password").attr("disabled");

          $("#updatebutton_u").attr("hidden");
          $("#cancelbutton_u").attr("hidden");

          this.content.scrollToTop(); 

        }

      },error:function(status, textStatus, jqXHR){

        if (status.statusText=="timeout") {

          Swal.fire({   
            title: 'Error',
            text: 'Your device is not connected to internet or your connection is very slow.\n Please try again' ,   
            icon: 'error',   
            heightAuto:false,
            allowOutsideClick: false,
            showCancelButton: false,   
            confirmButtonColor: "#DD6B55",   
            confirmButtonText: "OK",   
            cancelButtonText: "No, Cancelar",   
          }).then((result) => {
        if (result.value) {
                

              } 
          });
        }else{

          Swal.fire({title:'Error', icon:'error', text: 'An internal server error has occurred please contact the site admin',heightAuto:false});
        }
      }
  
    });

  }

  UpdateUser(){

    var id = $('#id_u').val();
    var name = $('#name').val();
    var lastname = $('#lastname').val();
    var lastnamem = $('#lastnamem').val();
    var phone = $('#phone').val();
    var email = $('#email').val();
    var user = $('#username').val();
    var password = $('#password').val();
    var role = $('#role').val();
    var type = $('#type').val();
    var status = $('#status').val();

    $('#preloader_u').show();
    $('#updatebutton_u').attr('disabled','disabled');

    if(id!="" && name!="" && lastname!="" && lastnamem!="" && phone!="" && email!="" && user!="" && password!="" && role!="" && type!="" && status!=""){

      $.ajax({
        url:this.BaseUrl+"index.php/Usuarios/EditUser",
        type:'POST',
        crossDomain: true,
        timeout: 30000,
        data:{id:id,name:name,lastname:lastname,lastnamem:lastnamem,phone:phone,email:email,user:user,password:password,role:role,type:type,status:status},
        async: true,
        success:(data) =>{

          $('#preloader_u').hide();
          $('#updatebutton_u').attr('disabled','disabled');

          Swal.fire({title:'Success', icon:'success', text: 'User has been updated successfully',heightAuto:false});

          $('#id_u').val("");
          $('#name').val("");
          $('#lastname').val("");
          $('#lastnamem').val("");
          $('#phone').val("");
          $('#email').val("");
          $('#username').val("");
          $('#password').val("");
          $('#role').val("");
          $('#type').val("");
          $('#status').val("");

          $("#username").attr("disabled");
          $("#password").attr("disabled");

          $("#savebutton_u").show();
          $("#updatebutton_u").attr("hidden");
          $("#cancelbutton_u").attr("hidden");

          this.UserList();

        },error:function(status, textStatus, jqXHR){

          if (status.statusText=="timeout") {

            Swal.fire({   
              title: 'Error',
              text: 'Your device is not connected to internet or your connection is very slow.\n Please try again' ,   
              icon: 'error',
              heightAuto:false,   
              allowOutsideClick: false,
              showCancelButton: false,   
              confirmButtonColor: "#DD6B55",   
              confirmButtonText: "OK",   
              cancelButtonText: "No, Cancelar",   
            }).then((result) => {
          if (result.value) {
              $("#preloader_u").hide();
              $("#updatebutton_u").attr('disabled','disabled');

                } 
            });
          }else{
            $("#preloader_u").hide();
            $("#updatebutton_u").removeAttr('disabled');
            Swal.fire({title:'Error', icon:'error', text: 'An internal server error has occurred please contact the site admin',heightAuto:false});
          }

        }
      });


    }else{

      $("#preloader_u").hide();
      $("#updatebutton_u").removeAttr('disabled');
      Swal.fire({title:'Warning', icon:'warning', text: 'There is missing info on the form',heightAuto:false});
    }
  }

  async DeleteUser(id:any){

    var id2 = id;

    let user =  await this.storage.get('usuario');

    $.ajax({
      url:this.BaseUrl+"index.php/Usuarios/DeleteUserBD",
      type:'POST',
      data:{id2:id2,user:user},
      crossDomain: true,
      timeout: 30000,
      async: true,
      success:(data) =>{

        var obj = JSON.parse(data);

        if(obj=="TRUE"){

          Swal.fire({title:'Error', icon:'error', text: 'You can not delete your own user' ,heightAuto:false});

        }else{

          Swal.fire({title:'Success', icon:'success', text: 'User has been deleted successfully',heightAuto:false});
          
          this.UserList();
        }

      },error:function(status, textStatus, jqXHR){

      if (status.statusText=="timeout") {

        Swal.fire({   
          title: 'Error',
          text: 'Your device is not connected to internet or your connection is very slow.\n Please try again' ,   
          icon: 'error',   
          heightAuto:false,
          allowOutsideClick: false,
          showCancelButton: false,   
          confirmButtonColor: "#DD6B55",   
          confirmButtonText: "OK",   
          cancelButtonText: "No, Cancelar",   
        }).then((result) => {
        if (result.value) {
                

              } 
          });
        }else{

          Swal.fire({title:'Error', icon:'error', text: 'An internal server error has occurred please contact the site admin',heightAuto:false});
        }
      }

    });

  }


  async ngOnInit() {

    await this.storage.create();

  }

}
