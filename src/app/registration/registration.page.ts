import { Component, OnInit, ViewChild } from '@angular/core'; 
import { Storage } from '@ionic/storage-angular';
import { AppComponent } from "../app.component";
import { IonContent } from '@ionic/angular';
import Swal from 'sweetalert2';
import * as $ from "jquery";

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  BaseUrl = this.Link.BaseLink();

  @ViewChild(IonContent, { static: false }) content: any =  IonContent; 

  slideOpts = {
    initialSlide: 1,
    speed: 400
  };

  registrations:any; 
  searchedRegistration: string = '';
  filteredRegistrations: any[] = [];  

  constructor(private storage: Storage,private Link: AppComponent) { 
    this.RegistrationList();
  }

  searchRegistration(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredRegistrations = this.registrations.filter((registration: any) => {
      //const fullName = registration.nombre.toLowerCase() + ' ' + registration.apellidop.toLowerCase() + ' ' + registration.apellidom.toLowerCase();
      const Id_Key = registration.Id_Key.toString().toLowerCase();
      const Id_Key2 = registration.Id_Key2.toString().toLowerCase();
      return Id_Key.includes(searchTerm) || Id_Key2.includes(searchTerm);
    });
  }

  CheckNo(){
    let Text1:any = $("#student").val();
    let Text1NoSpace:any =Text1.trim();
    let Text1Length:any = Text1NoSpace.length;

    if(Text1Length>9){
      Swal.fire({title:'Warning', icon:'warning', text:'La matrícula solo puede tener 10 caracteres',heightAuto:false});
      $("#student").val("");
    }

    if (Text1Length<=8){
      Swal.fire({title:'Warning', icon:'warning', text:'La matrícula solo puede tener 10 caracteres',heightAuto:false});
      $("#student").val("");
    }
  }

  CheckKey1(){
    let Text1:any = $("#id_1").val();
    let Text1NoSpace:any =Text1.trim();
    let Text1Length:any = Text1NoSpace.length;

    if(Text1Length>10){
      Swal.fire({title:'Warning', icon:'warning', text:'El Id card solo debe contener 10 caracteres',heightAuto:false});
      $("#id_1").val("");
    }

    if (Text1Length<=9){
      Swal.fire({title:'Warning', icon:'warning', text:'El Id card  solo debe tener 10 caracteres',heightAuto:false});
      $("#id_1").val("");
    }
  }

  CheckKey2(){
    let Text1:any = $("#id_2").val();
    let Text1NoSpace:any =Text1.trim();
    let Text1Length:any = Text1NoSpace.length;

    if(Text1Length>5){
      Swal.fire({title:'Warning', icon:'warning', text:'El Id card solo debe contener 5 caracteres',heightAuto:false});
      $("#id_2").val("");
    }

    if (Text1Length<=4){
      Swal.fire({title:'Warning', icon:'warning', text:'El Id card solo debe contener 5 caracteres',heightAuto:false});
      $("#id_2").val("");
    }
  }

  SaveRegistration(){ 

    var tuition = $('#student').val();
    var name = $('#name').val();
    var lastname = $('#lastname').val();
    var lastnamem = $('#lastnamem').val();
    var inclusion_s = $('#inclusion').val();
    var id_1_s = $('#id_1').val();
    var id_2_s = $('#id_2').val();
    var generation_s = $('#generation').val();
    var group_s = $('#group').val();
    var genre_s = $('#genre').val();
    var quarter_s = $('#quarter').val();
    var degree_s = $('#degree').val();

    $('#preloader_u').show();
    $('#savebutton_u').attr('disabled','disabled');

    if(tuition!="" && name!="" && lastname!="" && lastnamem!="" && inclusion_s!="" && id_1_s!="" && id_2_s!="" && generation_s!="" && group_s!="" && genre_s!="" && quarter_s!="" && degree_s!="" ){

      $.ajax({
        url:this.BaseUrl+"index.php/Registro/SaveRegistration",
        type:'POST',
        crossDomain: true,
        timeout: 30000,
        data:{tuition:tuition,name:name,lastname:lastname,lastnamem:lastnamem,inclusion_s:inclusion_s,id_1_s:id_1_s,id_2_s:id_2_s,generation_s:generation_s,group_s:group_s,genre_s:genre_s,quarter_s:quarter_s,degree_s:degree_s},
        async: true,
        success:(data) =>{

        $('#preloader_u').hide();
        $('#savebutton_u').attr('disabled', 'disabled');

          Swal.fire({title:'Success', icon:'success', text: 'User has been saved successfully',heightAuto:false});

          $('#savebutton_u').val("");
          $('#student').val("");
          $('#name').val("");
          $('#lastname').val("");
          $('#lastnamem').val("");
          $('#inclusion').val("");
          $('#id_1').val("");
          $('#id_2').val("");
          $('#generation').val("");
          $('#group').val("");
          $('#genre').val("");
          $('#quarter').val("");
          $('#degree').val("");

          this.RegistrationList();

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

  RegistrationList(){

    $.ajax({
      url:this.BaseUrl+"index.php/Registro/ActiveRegistrationList",
      type:'GET',
      crossDomain: true,
      timeout: 30000,
      async: true,
      success:(data) =>{

        var obj = JSON.parse(data);

        if(obj != ""){

            this.registrations = JSON.parse(data);

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
    $('#student').val("");
    $('#name').val("");
    $('#lastname').val("");
    $('#lastnamem').val("");
    $('#inclusion').val("");
    $('#id_1').val("");
    $('#id_2').val("");
    $('#generation').val("");
    $('#group').val("");
    $('#genre').val("");
    $('#quarter').val("");
    $('#degree').val("");
    $('#status').val("");
    $('#preloader_u').hide();
    $("#savebutton_u").show();
    $("#updatebutton_u").attr("hidden");
    $("#cancelbutton_u").attr("hidden");

          this.RegistrationList();

  }

  EditRegistration(id:any){

    var id = id;

    $.ajax({
      url:this.BaseUrl+"index.php/Registro/RegistrationById",
      type:'POST',
      data:{id:id},
      crossDomain: true,
      timeout: 30000,
      async: true,
      success:(data) =>{

        var obj = JSON.parse(data);

        if(obj != ""){

          $("#savebutton_u").hide();

          var id = obj[0].id_alumno;
          var tuition = obj[0].matricula;
          var name = obj[0].nombre;
          var lastname = obj[0].apellidop;
          var lastnamem = obj[0].apellidom;
          var inclusion_s = obj[0].inclusion;
          var id_1_s = obj[0].Id_key;
          var id_2_s = obj[0].Id_Key2;
          var generation_s = obj[0].generacion;
          var group_s = obj[0].grupo;
          var genre_s = obj[0].genero;
          var quarter_s = obj[0].cuatrimestre;
          var degree_s = obj[0].carrera
          var status = obj[0].estado

          $("#id_u").val(id);
          $("#student").val(tuition);
          $("#name").val(name);
          $("#lastname").val(lastname);
          $("#lastnamem").val(lastnamem);
          $("#inclusion").val(inclusion_s);
          $("#id_1").val(id_1_s);
          $("#id_2").val(id_2_s);
          $("#generation").val(generation_s);
          $("#group").val(group_s);
          $("#genre").val(genre_s);
          $("#quarter").val(quarter_s);
          $("#degree").val(degree_s);
          $("#status").val(status);

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

  UpdateRegistration(){

    var id = $('#id_u').val();
    var tuition = $('#student').val();
    var name = $('#name').val();
    var lastname = $('#lastname').val();
    var lastnamem = $('#lastnamem').val();
    var inclusion_s = $('#inclusion').val();
    var id_1_s = $('#id_1').val();
    var id_2_s = $('#id_2').val();
    var generation_s = $('#generation').val();
    var group_s = $('#group').val();
    var genre_s = $('#genre').val();
    var quarter_s = $('#quarter').val();
    var degree_s = $('#degree').val();
    var status = $('#status').val();

    $('#preloader_u').show();
    $('#updatebutton_u').attr('disabled','disabled');

    if(id!="" && tuition!="" && name!="" && lastname!="" && lastnamem!="" && inclusion_s!="" && id_1_s!="" && id_2_s!="" && generation_s!="" && group_s!="" && genre_s!="" && quarter_s!="" && degree_s!="" && status!=""){

      $.ajax({
        url:this.BaseUrl+"index.php/Registro/EditRegistration",
        type:'POST',
        crossDomain: true,
        timeout: 30000,
        data:{id:id,tuition:tuition,name:name,lastname:lastname,lastnamem:lastnamem,inclusion_s:inclusion_s,id_1_s:id_1_s,id_2_s:id_2_s,generation_s:generation_s,group_s:group_s,genre_s:genre_s,quarter_s:quarter_s,degree_s:degree_s,status:status},
        async: true,
        success:(data) =>{

          $('#preloader_u').hide();
          $('#updatebutton_u').attr('disabled','disabled');

          Swal.fire({title:'Success', icon:'success', text: 'User has been updated successfully',heightAuto:false});

          $('#id_u').val("");
          $('#student').val("");
          $('#name').val("");
          $('#lastname').val("");
          $('#lastnamem').val("");
          $('#inclusion').val("");
          $('#id_1').val("");
          $('#id_2').val("");
          $('#generation').val("");
          $('#group').val("");
          $('#genre').val("");
          $('#quarter').val("");
          $('#degree').val("");
          $('#status').val("");
          $("#savebutton_u").show();
          $("#updatebutton_u").attr("hidden");
          $("#cancelbutton_u").attr("hidden");

          this.RegistrationList();

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

  async DeleteRegistration(id:any){

    var id2 = id;

    $.ajax({
      url:this.BaseUrl+"index.php/Registro/DeleteRegistrationBD",
      type:'POST',
      data:{id2:id2},
      crossDomain: true,
      timeout: 30000,
      async: true,
      success:() =>{

          Swal.fire({title:'Success', icon:'success', text: 'The shopping has been deleted successfully',heightAuto:false});
          
          this.RegistrationList();
        

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
