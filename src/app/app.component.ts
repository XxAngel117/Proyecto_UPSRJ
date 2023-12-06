import { Component } from '@angular/core';
import { Platform, MenuController } from '@ionic/angular';
import {Storage} from '@ionic/storage-angular';
import {Router} from '@angular/router';
import {Toast} from '@awesome-cordova-plugins/toast/ngx';
import Swal from 'sweetalert2';
import { FingerprintAIO,FingerprintOptions} from '@awesome-cordova-plugins/fingerprint-aio/ngx';
import * as $ from "jquery";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  URL_Link = "http://localhost/BACKEND_ISW/";

  constructor(private fingerprintAIO:FingerprintAIO, private toast:Toast,private menuCtrl: MenuController, private router: Router, private storage: Storage, private platform: Platform) {
    this.initializeApp();
  
  }

  BaseLink(){
    return this.URL_Link;
  }

  initializeApp() {
    this.platform.ready().then(async() => {

      this.platform.backButton.subscribeWithPriority(9999, () => {
        document.addEventListener('backbutton', function (event) {
          event.preventDefault();
          event.stopPropagation();
          console.log('back button pressed');
        }, false);
      });

      // alert("first time");

      await this.storage.create();

      this.toast.show('First Time', '10000', 'center').subscribe(
        toast => {
          console.log(toast);
        }
      );

      let user =  await this.storage.get('usuario');
      let pass =  await this.storage.get('pass');

      if(user != null && pass != null){

        $("#preloader").show();
        $("#botonlogin").attr('disabled');
        $("#botonresetlogin").attr('disabled');
        $("#botonhide").attr('disabled');

        $.ajax({
          url:this.URL_Link+"index.php/Session/validatelogin",
          type:'POST',
          crossDomain: true,
          timeout: 30000,
          data:{usuario:user,pass:pass},
          async: true,
          success:(data) =>{
            var obj = JSON.parse(data);

            if (obj != "") {

              var msg = obj;

              if (msg == 'OK-') {

                $("#preloader").hide();
                $("#botonlogin").attr('disabled','disabled');
                $("#botonresetlogin").attr('disabled');
                $("#botonhide").attr('disabled');

                this.router.navigate(['/home']);
         
              }else if(obj == "IUOP"){
                $("#preloader").hide();
                $("#botonlogin").removeAttr('disabled');
                $("#botonresetlogin").attr('disabled');
                $("#botonhide").attr('disabled');
                Swal.fire({title:'Error', icon:'error', text: 'User or incorrect password',heightAuto:false});
              }else if (obj == "UWOA") {
                $("#preloader").hide();
                $("#botonlogin").removeAttr('disabled');
                $("#botonresetlogin").attr('disabled');
                $("#botonhide").attr('disabled');
                Swal.fire({title:'Error', icon:'error', text: 'User without access to this app',heightAuto:false});
              }else if (obj == "UWAS") {

                this.router.navigate(['/home']);
    
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
                $("#botonhide").attr('disabled');

                  } 
              });
            }else{
              $("#preloader").hide();
              $("#botonlogin").removeAttr('disabled');
              $("#botonresetlogin").attr('disabled');
              $("#botonhide").attr('disabled');
              Swal.fire({title:'Error', icon:'error', text: 'An internal server error has occurred please contact the site admin',heightAuto:false});
            }
    
          }
        });  

      }

      this.platform.pause.subscribe(async () => {
        
        this.toast.show('Pause detected', '10000', 'center').subscribe(
          toast => {
            console.log(toast);
          }
        );


        await this.storage.create();

        let user =  await this.storage.get('usuario');
        let pass =  await this.storage.get('pass');

        if (user != null && pass != null) {

          $.ajax({
            url:this.URL_Link+"index.php/Session/logout",
            type:'POST',
            crossDomain: true,
            timeout: 30000,
            data:{usuario:user},
            async: true,
            success:(data) =>{

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
      });// Fin Pause

      this.platform.resume.subscribe(async () => {

        this.toast.show('Resume detected', '10000', 'center').subscribe(
          toast => {
            console.log(toast);
          }
        );



        await this.storage.create();

        let user =  await this.storage.get('usuario');
        let pass =  await this.storage.get('pass');

        if(user != null && pass != null){

          $("#preloader").show();
          $("#botonlogin").attr('disabled');
          $("#botonresetlogin").attr('disabled');
          $("#botonhide").attr('disabled');

          $.ajax({
            url:this.URL_Link+"index.php/Session/validatelogin",
            type:'POST',
            crossDomain: true,
            timeout: 30000,
            data:{usuario:user,pass:pass},
            async: true,
            success:(data) =>{
              var obj = JSON.parse(data);

              if (obj != "") {

                var msg = obj;

                if (msg == 'OK-') {

                  $("#preloader").hide();
                  $("#botonlogin").attr('disabled','disabled');
                  $("#botonresetlogin").attr('disabled');
                  $("#botonhide").attr('disabled');
           
                }else if(obj == "IUOP"){
                  $("#preloader").hide();
                  $("#botonlogin").removeAttr('disabled');
                  $("#botonresetlogin").attr('disabled');
                  $("#botonhide").attr('disabled');
                  Swal.fire({title:'Error', icon:'error', text: 'User or incorrect password',heightAuto:false});
                }else if (obj == "UWOA") {
                  $("#preloader").hide();
                  $("#botonlogin").removeAttr('disabled');
                  $("#botonresetlogin").attr('disabled');
                  $("#botonhide").attr('disabled');
                  Swal.fire({title:'Error', icon:'error', text: 'User without access to this app',heightAuto:false});
                }else if (obj == "UWAS") {

                  
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
                  $("#botonhide").attr('disabled');

                    } 
                });
              }else{
                $("#preloader").hide();
                $("#botonlogin").removeAttr('disabled');
                $("#botonresetlogin").attr('disabled');
                $("#botonhide").attr('disabled');
                Swal.fire({title:'Error', icon:'error', text: 'An internal server error has occurred please contact the site admin',heightAuto:false});
              }
      
            }
          });  

        }

      });// Fin Resume

    });
  }

  CloseMenu() {  

   this.menuCtrl.close();

   }

  async LogOut(){
    
    
    let usuario =  await this.storage.get('usuario');

    $.ajax({
      url:this.URL_Link+"index.php/Session/logout",
      type:'POST',
      crossDomain: true,
      timeout: 30000,
      data:{usuario:usuario},
      async: true,
      success:(data) =>{

        this.storage.clear();

        if (this.platform.is('ios')) {

          this.router.navigate(['/login']);

          }else if(this.platform.is('mobileweb')){
              
              this.router.navigate(['/login']);

            }else if(this.platform.is('android')){

              //navigator['app'].exitApp();
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
