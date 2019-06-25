import { Component, ViewChild, ElementRef } from '@angular/core';
import { AppBase } from '../AppBase';
import { Router } from '@angular/router';
import {  ActivatedRoute, Params } from '@angular/router';
import { NavController, ModalController, ToastController, AlertController, NavParams,IonSlides } from '@ionic/angular';
import { AppUtil } from '../app.util';
import { DomSanitizer } from '@angular/platform-browser';
import { ContentApi } from 'src/providers/content.api';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { GetApi } from 'src/providers/get.api';
import { SubmitApi } from 'src/providers/submit.api';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  providers:[GetApi,SubmitApi]
})
export class HomePage extends AppBase {

  constructor(public router: Router,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public activeRoute: ActivatedRoute,
    public sanitizer: DomSanitizer,
    public getapi:GetApi,
    public submitApi:SubmitApi,
    public elementRef:ElementRef
    ) {
    super(router, navCtrl, modalCtrl, toastCtrl, alertCtrl,activeRoute);
    
      
  }

  year=[];

  onMyLoad(){

  }
  
  step=0;
  doctor_id=0;
  date="";
  name="";
  birth="1970";
  sexual="man";
  mobile="";
  memo="";
  doctorlist:[{name:"",title:"",photo:"",intro:""}];
  onMyShow(){


    this.getapi.doctorlist({orderby:"seq"}).then((list)=>{
      this.doctorlist=list;
      this.doctor_id=list[0].id;
    });
    this.currentMonth = (new Date()).getMonth();
    this.currentYear = (new Date()).getFullYear();
    this.loadCalendar();

    for(var i=(new Date()).getFullYear();i>1900;i--){
      //this.year.push(i);
    }


  }
  selectdoctor(doctor_id){
    this.doctor_id=doctor_id;
    this.step=1;
  }


  currentMonth = 0;
  currentYear = 0;

  calendar = [];


  loadCalendar() {
    var monthfirst = (new Date(this.currentYear, this.currentMonth, 1));
    var monthend = (new Date(this.currentYear, this.currentMonth + 1, 0));

    var today = (new Date());
    today = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    var first = monthfirst.getDay();

    var daytimecount = 24 * 3600 * 1000;

    var startday = (new Date(monthfirst.getTime() - first * daytimecount));

    var canarr = [];
    for (var i = 0; i < 6; i++) {
      var a = [];
      var allover = false;
      for (var j = 0; j < 7; j++) {
        var d = (new Date(startday.getTime() + (7 * i) * daytimecount + j * daytimecount));

        //var isover = d.getTime() < monthfirst.getTime() || d.getTime() > monthend.getTime() ? "Y" : "N";
        var isover = d.getTime() < monthfirst.getTime()  ? "Y" : "N";
        a.push({
          isover: isover,
          furture: d.getTime() > today.getTime() ? "Y" : "N",
          today: d.getTime() == today.getTime() ? "Y" : "N",
          year: d.getFullYear(),
          month: d.getMonth(),
          date: d.getDate(),
          dayformat:AppUtil.FormatDate(AppUtil.FormatDateTime(d))
        });

        if (isover == "N") {
          allover = true;
        }

      }
      if (allover) {
        canarr.push(a);
      }
    }
    this.calendar = canarr;
  }

  gotoMonth(am) {

    var today = (new Date());
    var target = new Date(this.currentYear, this.currentMonth + am, 1);
    
    this.currentYear = target.getFullYear();
    this.currentMonth = target.getMonth();
    //this.loadCalendar();
  }

  selectdate(d){
    if(d.furture=='N'){
      return;
    }
    this.date=d.dayformat;
  }

  confirmdate(){
    if(this.date==''){
      this.showAlert("请选择日期");
      return;
    }
    this.step=2;
  }
  
  submitorder(){
    if(this.date==""){
      var obj=this.elementRef.nativeElement.querySelector("#vkk");
      obj.scrollIntoView(true);
      this.showAlert("请选择预约日期");
      return;
    }
    if(this.name==""){
      this.showAlert("请选择预约人姓名");
      return;
    }
    if(this.mobile==""){
      this.showAlert("请选择预约人手机");
      return;
    }
    this.showConfirm("是否确认提交信息？",(e)=>{
      if(e==true){
        this.submitApi.submit({
          doctor_id:this.doctor_id,
          appointmentdate:this.date,
          content:this.memo,
          rolename:this.name,
          rolemobile:this.mobile,
          rolebirth:this.birth,
          sex:this.sexual
        }).then((res)=>{
          this.navigate("success");
        });
      }
    });
  }
  
  changeName(e){
	  console.log(e);
  }
  
  diaoni(){
	  alert('diaoni');
  }
}
