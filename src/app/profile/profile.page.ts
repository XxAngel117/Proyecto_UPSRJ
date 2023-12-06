import { Component, OnInit , ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import {ActionSheetController} from '@ionic/angular'
import { IonContent } from '@ionic/angular';
import { AppComponent } from "../app.component";
import  Swal from 'sweetalert2'; 
import * as $ from "jquery";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  BaseUrl = this.Link.BaseLink();

  @ViewChild(IonContent, { static: false }) content: any =  IonContent;

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  profile:any;

  constructor(private storage: Storage,private Link: AppComponent,private actionSheetCtrl: ActionSheetController) {

    this.Profile();

   }

   CheckPhone(){

    let ProfilePhone:any=$("#ProfilePhone").val();
    let PhoneLength:any= ProfilePhone.length;

    if (PhoneLength<10 || PhoneLength>10) {

        Swal.fire({title:'Error', icon:'error', text: 'The phone provided is longer or shorter than 10 characters, please try again',heightAuto:false});
        $("#ProfilePhone").val("");
    }

  }

  CheckEmail(){

    let validRegex: any = "[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})";
    var ProfileEmail: any = $("#ProfileEmail").val();

     if (!ProfileEmail.match(validRegex)) {

        Swal.fire({title:'Error', icon:'error', text: 'The email provided is not a valid email please provide a valid email',heightAuto:false});
        $("#email").val("");

     }

  }

  UpdateUS(){
    
    var id =$('#id_us').val();
    var name = $('#name_us').val();
    var lastname = $('#lastname_us').val();
    var lastnamem = $('#lastnamem_us').val();
    var phone = $('#phone_us').val();
    var email= $('#email_us').val();
  

   
    $('#preloader_us').show();
   
    $('#updatebutton_us').attr('disabled', 'disabled');

    if(id!="" &&  name!="" && lastname!="" &&  lastnamem!="" && phone  !="" && email!=""  ){

      $.ajax({
        url:this.BaseUrl+"index.php/Dashboard/SaveProfile",
        type:'POST',
        crossDomain: true,
        timeout: 30000,
        data:{id:id,name:name,lastname:lastname,lastnamem:lastnamem,phone:phone,email:email},
        async: true,
        success:(data) =>{

        $('#preloader_us').hide();
        $('#updatebutton_us').attr('disabled');

          Swal.fire({title:'Success', icon:'success', text: 'Profile has been updated successfully',heightAuto:false});

          $('#updatebutton_us').val("");
          $('#preloader_us').show();
          $("#editbutton_us").show();
          $("#updatebutton_us").attr("hidden");
          $("#cancelbutton_us").attr("hidden");

         $('#preloader_us').hide();
            
          this.Profile();

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
              $("#preloader_us").hide();
              $("#updatebutton_us").attr('disabled','disables');

                } 
            });
          }else{
            $("#preloader_us").hide();
            $("#updatebutton_us").removeAttr('disabled');
            Swal.fire({title:'Error', icon:'error', text: 'An internal server error has occurred please contact the site admin',heightAuto:false});
          }

        }
      });


    }else{

      $("#preloader_us").hide();
      $("#updatebutton_us").removeAttr('disabled');
      Swal.fire({title:'Warning', icon:'warning', text: 'There is missing info on the form',heightAuto:false});
    }

  }

  Cancel(){

    $('#preloader_us').show();

    $("#editbutton_us").show();
    $("#updatebutton_us").attr("hidden");
    $("#cancelbutton_us").attr("hidden");
    $('#preloader_us').hide();

    this.Profile();

  }

  EditUS(){

    $('#preloader_us').show();

        $("#editbutton_us").hide();

        
        $('#name_us').attr("disabled");
        $('#lastname_us').attr("disabled");
        $('#lastnamem_us').attr("disabled");
        $('#email_us').attr("disabled");

        $("#updatebutton_us").attr("hidden");
        $("#cancelbutton_us").attr("hidden");

        $('#preloader_us').hide();

 }
 
 async  Profile(){

  let user =  await this.storage.get('usuario');

  $.ajax({
    url: this.BaseUrl+"index.php/Usuarios/GetByUsuario",
    type:'POST',
    data:{usuario:user},
    crossDomain: true,
    async: true,
    success:(data) =>{

      this.profile = JSON.parse(data);

      var obj = JSON.parse(data);
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

      
      $('#id_us').val(id);
      $('#name_us').val(name);
      $('#lastname_us').val(lastname);
      $('#lastnamem_us').val(lastnamem);
      $('#phone_us').val(phone);
      $('#email_us').val(email);
      $('#username_us').val(user);
      $('#password_us').val(password);
      $('#role_us').val(role);
      $('#type_us').val(type);
      $('#status_us').val(status);

      $('#id_us').attr("disabled");
      $('#name_us').attr("disabled");
      $('#lastname_us').attr("disabled");
      $('#lastnamem_us').attr("disabled");
      $('#phone_us').attr("disabled");
      $('#email_us').attr("disabled");
      $('#username_us').attr("disabled");
      $('#password_us').attr("disabled");
      $('#role_us').attr("disabled");
      $('#type_us').attr("disabled");
      $('#status_us').attr("disabled");

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

  ngOnInit() {
  }

}
