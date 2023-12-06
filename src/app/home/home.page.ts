import { Component,OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AppComponent } from "../app.component";
import { IonContent } from '@ionic/angular';
import Swal from 'sweetalert2';
import * as $ from "jquery";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  BaseUrl = this.Link.BaseLink();

  @ViewChild(IonContent, { static: false }) content: any =  IonContent; 

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  constructor(private storage: Storage,private Link: AppComponent) {

    this.UserAccess();

  }

  async UserAccess(){

    let user =  await this.storage.get('usuario');

    $.ajax({
      url: this.BaseUrl+"index.php/Session/Permisos",
      type:'POST',
      data:{usuario:user},
      crossDomain: true,
      async: true,
      success:(data) =>{

        var obj = JSON.parse(data);
        var role = obj[0].rol;
        this.storage.set('role', role);

        if ((role == "E")) 
        {

           
        }

        if ((role == "A")) 
        {


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

}
