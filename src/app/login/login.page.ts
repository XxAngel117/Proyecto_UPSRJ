import { Component, OnInit } from '@angular/core'; 
import { Platform, MenuController } from '@ionic/angular';
import { Storage} from '@ionic/storage-angular';
import { Router} from '@angular/router';
import { AppComponent } from '../app.component';
import Swal from 'sweetalert2';
import * as $ from "jquery";
import { FingerprintAIO,FingerprintOptions} from '@awesome-cordova-plugins/fingerprint-aio/ngx';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  BaseUrl = this.Link.BaseLink();

  constructor(private fingerprintAIO:FingerprintAIO, private menuCtrl: MenuController, private router: Router, private storage: Storage, private Link: AppComponent) { }


  ionViewWillEnter(){
    this.menuCtrl.enable(false);
  }

  ionViewWillLeave(){
    this.menuCtrl.enable(true);
  }

  EsconderPanel(){
    $("#panelcontraseña").show();
    $("#panellogin").hide();
  }

  Login(){

    $("#preloader").show();
    $("#botonlogin").attr('disabled');
    $("#botonresetlogin").attr('disabled');
    $("#botonesconder").attr('disabled');

    var usuario = $("#user").val();
    var pass = $("#pass").val();

    if(usuario != "" && pass != ""){

      $.ajax({
        url:this.BaseUrl+"index.php/Session/validatelogin",
        type:'POST',
        crossDomain: true,
        timeout: 30000,
        data:{usuario:usuario,pass:pass},
        async: true,
        success:(data) =>{
          var obj = JSON.parse(data);

          if (obj != "") {

            var msg = obj;

            if (msg == 'OK-') {

              $("#preloader").hide();
              $("#botonlogin").attr('disabled','disabled');
              $("#botonresetlogin").attr('disabled');
              $("#botonesconder").attr('disabled');

              this.storage.set('usuario', usuario);
              this.storage.set('pass', pass);
              //this.router.navigate(['/home']);

              $("#user").val("");
              $("#pass").val("");

              const options = {};

              this.fingerprintAIO.isAvailable().then(()=>{

                Swal.fire({   
                    title: 'Success',
                    text: 'Biometrics are available, do you wish to enable them?' ,   
                    icon: 'success',   
                    heightAuto:false,
                    allowOutsideClick: false,
                    showCancelButton: true,   
                    confirmButtonColor: "#DD6B55",   
                    confirmButtonText: "OK",   
                    cancelButtonText: "No, Cancel",   
                  }).then((result) => {
                if (result.value) {

                  this.fingerprintAIO.show(options).then((val)=>{

                    this.storage.set('bioflag', 'true');
                    this.router.navigate(['/home']);
                
                  },(error)=>{

                    Swal.fire({   
                      title: 'Error',
                      text: 'An error has ocurred with Biometrics' ,   
                      icon: 'error',   
                      heightAuto:false,
                      allowOutsideClick: false,
                      showCancelButton: false,   
                      confirmButtonColor: "#DD6B55",   
                      confirmButtonText: "OK",   
                      cancelButtonText: "No, Cancel",   
                    }).then((result) => {
                  if (result.value) {

                        this.storage.set('bioflag', 'false');
                        this.router.navigate(['/home']);

                      } 
                    });

                  });

                  }else{

                    this.storage.set('bioflag', 'false');
                    this.router.navigate(['/home']);
                    
                  }
                });


              },(error)=>{

                console.log(error);
                this.storage.set('bioflag', 'false');
                this.router.navigate(['/home']);
            
              });

       
            }else if(obj == "IUOP"){
              $("#preloader").hide();
              $("#botonlogin").removeAttr('disabled');
              $("#botonresetlogin").attr('disabled');
              $("#botonesconder").attr('disabled');
              Swal.fire({title:'Error', icon:'error', text: 'User or incorrect password',heightAuto:false});
            }else if (obj == "UWOA"){
              $("#preloader").hide();
              $("#botonlogin").removeAttr('disabled');
              $("#botonresetlogin").attr('disabled');
              $("#botonesconder").attr('disabled');
              Swal.fire({title:'Error', icon:'error', text: 'User without access to this app',heightAuto:false});
            }else if (obj == "UWAS"){
              $("#preloader").hide();
              $("#botonlogin").removeAttr('disabled');
              $("#botonresetlogin").attr('disabled');
              $("#botonesconder").attr('disabled');
              Swal.fire({title:'Error', icon:'error', text: 'User with an active session',heightAuto:false});
            }
            
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
              $("#preloader").hide();
              $("#botonlogin").attr('disabled','disabled');
              $("#botonresetlogin").attr('disabled');
              $("#botonesconder").attr('disabled');

                } 
            });
            
          }else{
            $("#preloader").hide();
            $("#botonlogin").removeAttr('disabled');
            $("#botonresetlogin").attr('disabled');
            $("#botonesconder").attr('disabled');
            Swal.fire({title:'Error', icon:'error', text: 'An internal server error has occurred please contact the site admin',heightAuto:false});
          }
  
        }

      });  

    }else{
     
      $("#preloader").hide();
      $("#botonlogin").removeAttr('disabled');
      $("#botonresetlogin").attr('disabled');
      $("#botonesconder").attr('disabled');
      Swal.fire({title:'Warning', icon:'warning', text: 'There is missing info on the form',heightAuto:false});
    }

}

ResetLogin(){

  $("#preloader").show();
  $("#botonresetlogin").attr('disabled','disabled');
  $("#botonlogin").attr('disabled');
  $("#botonesconder").attr('disabled');

  var usuarioreset = $("#user").val();
  var passreset = $("#pass").val();

  if(usuarioreset != "" && passreset != ""){

      $.ajax({
        url:this.BaseUrl+"index.php/Session/ResetLogin",
        type:'POST',
        crossDomain: true,
        timeout: 30000,
        data:{usuarioreset:usuarioreset,passreset:passreset},
        async: true,
        success:(data) =>{
          var obj = JSON.parse(data);

          if (obj != "") {

            var msg = obj;

            if (msg == 'OK') {

              Swal.fire({title:'OK', icon:'success', text: 'Session has been restored successfully',heightAuto:false});

              $("#preloader").hide();
              $("#botonresetlogin").attr('disabled','disabled');
              $("#botonlogin").attr('disabled');
              $("#botonesconder").attr('disabled');

              $("#user").val("");
              $("#pass").val("");

            }else if(obj == "IUOP"){
              $("#preloader").hide();
              $("#botonresetlogin").removeAttr('disabled');
              $("#botonlogin").attr('disabled');
              $("#botonesconder").attr('disabled');
              Swal.fire({title:'Error', icon:'error', text: 'User or incorrect password',heightAuto:false});
            }else if (obj == "UWOA") {
              $("#preloader").hide();
              $("#botonresetlogin").removeAttr('disabled');
              $("#botonlogin").attr('disabled');
              $("#botonesconder").attr('disabled');
              Swal.fire({title:'Error', icon:'error', text: 'User without access to this app',heightAuto:false});
            }
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
              $("#preloader").hide();
              $("#botonresetlogin").attr('disabled','disabled');
              $("#botonlogin").attr('disabled');
              $("#botonesconder").attr('disabled');

                } 
            });
          }else{
            $("#preloader").hide();
            $("#botonresetlogin").removeAttr('disabled');
            $("#botonlogin").attr('disabled');
            $("#botonesconder").attr('disabled');
            Swal.fire({title:'Error', icon:'error', text: 'An internal server error has occurred please contact the site admin',heightAuto:false});
          }
  
        }
      }); 
    }else{
      $("#preloader").hide();
      $("#botonresetlogin").removeAttr('disabled');
      $("#botonlogin").attr('disabled');
      $("#botonesconder").attr('disabled');
      Swal.fire({title:'Warning', icon:'warning', text: 'There is missing info on the form',heightAuto:false});
    }

}

RestablecerContrasena(){

  $("#preloader").show();
  $("#botonrestablecer").attr('disabled','disabled');
  $("#botonmostrar").attr('disabled');

  var usuario = $("#usuariores").val();
  var correo = $("#correores").val();
  var telefono = $("#telefonores").val();

  if(usuario != "" && correo != "" && telefono != ""){

    $.ajax({
      url:this.BaseUrl+"index.php/Session/RestablecerContrasena",
      type:'POST',
      crossDomain: true,
      timeout: 30000,
      data:{usuario:usuario,correo:correo,telefono:telefono},
      async: true,
      success:(data) =>{
        var obj = JSON.parse(data);

        var contraseña = obj.contrasena;

        if (obj.mensaje == "TRUE") {

          $("#preloader").hide();   
          $("#botonrestablecer").attr('disabled','disabled');
          $("#botonmostrar").attr('disabled');    

          $("#usuariores").val("");
          $("#correores").val("");
          $("#telefonores").val("");

          Swal.fire({title:'OK', icon:'success', text: 'Password has been restored successfully, your password is: '+contraseña+'',heightAuto:false});

          $("#panelcontraseña").hide();
          $("#panellogin").show();

        }else{

          $("#preloader").hide();
          $("#botonrestablecer").removeAttr('disabled');
          $("#botonmostrar").attr('disabled'); 

          Swal.fire({title:'Error', icon:'error', text: 'Data is incorrect',heightAuto:false});

        }
        
      },error:function(status, textStatus, jqXHR){

        if (status.statusText=="timeout") {

          Swal.fire({   
            title: 'Error',
            text: 'Su dispositivo no cuenta con conexion a internet y/o su conexion es demasiado lenta.\n Intentelo de nuevo' ,   
            icon: 'error',   
            heightAuto:false,
            allowOutsideClick: false,
            showCancelButton: false,   
            confirmButtonColor: "#DD6B55",   
            confirmButtonText: "OK",   
            cancelButtonText: "No, Cancelar",   
          }).then((result) => {
        if (result.value) {
            $("#preloader").hide();
            $("#botonrestablecer").attr('disabled','disabled');
            $("#botonmostrar").attr('disabled');

            } 
          });
        }else{
          $("#preloader").hide();
          $("#botonrestablecer").removeAttr('disabled');
          $("#botonmostrar").attr('disabled');
          Swal.fire({title:'Error', icon:'error', text: 'An internal server error has occurred please contact the site admin',heightAuto:false});
        }

      }
    });

  }else{
     
    $("#preloader").hide();
    $("#botonrestablecer").attr('disabled','disabled');
    $("#botonmostrar").attr('disabled');
    Swal.fire({title:'Warning', icon:'warning', text: 'There is missing info on the form',heightAuto:false});
  }
}

  MostrarPanel(){
    $("#panelcontraseña").hide();
    $("#panellogin").show();
  }

  async ngOnInit() {

    await this.storage.create();
    $("#panelcontraseña").hide();
  }

}
