
import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AbstractControl } from '@angular/forms'
import { MatSlider } from '@angular/material/slider';
import { MAR } from '@angular/material/core';
import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
interface Choice {
  value: string;
  viewValue: string;
}
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  totalAngularPackages;
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  sliderValue: number;
  options: Observable<string[]>;
  chosenZoneOptions: string[];
  zoneOptions: Object;
  filteredOptions: Observable<string[]>
  filteredSecondOptions: Observable<string[]>;


  jsonObject = {
    simptoms: {
      bodyPart: '',
      simptomType: '',
      sick: false,
      lastControlDate: ''
    },
    info: {
      sameAddress: true,
      actualAdress: '',
      medic: '',
      clinic: '',
      priceLimit: [0, 0]
    }
  }


  choices: Choice[] = [
    { value: 'da', viewValue: 'Da' },
    { value: 'nu', viewValue: 'Nu' }
  ];


  choicesThirdStep: Choice[] = [
    { value: 'da', viewValue: 'Da' },
    { value: 'nu', viewValue: 'Nu' }
  ];



  anotherchoices: Choice[] = [
    { value: 'barbat', viewValue: 'Bărbat' },
    { value: 'femeie', viewValue: 'Femeie' }
  ];


  thirdchoices: Choice[] = [
    { value: 'privat', viewValue: 'Privat' },
    { value: 'stat', viewValue: 'De stat' }
  ];

  constructor(private _formBuilder: FormBuilder, private http: HttpClient) { }



  ngOnInit() {
    var a = this.getSimptoms()
    console.log(a)
    this.firstFormGroup = this._formBuilder.group({
      bodyPartControl: [''],
      simptomTypeControl: ['', Validators.required],
      chronicDeseaseControl: ['', Validators.required],
      lastDateControl: ['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      locationControl: ['', Validators.required],
      newLocationControl: ['', Validators.required],
      medicControl: ['', Validators.required],
      clinicControl: ['', Validators.required]
    })


    this.filteredOptions = this.firstFormGroup.controls.bodyPartControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      ),
      this.filteredSecondOptions = this.firstFormGroup.controls.simptomTypeControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter2(value))
        );
    this.filteredOptions.subscribe();
    this.filteredSecondOptions.subscribe();
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    const chosenZone = this.firstFormGroup.controls.bodyPartControl.value;
    this.chosenZoneOptions = this.zoneOptions[chosenZone];
    console.log(this.options)
    if(this.options!==undefined){
    return this.options.filter(option => option.toLowerCase().includes(filterValue));}
    else{return ["lalala"]}
  }
  private _filter2(value: string): string[] {
    const filterValue = value.toLowerCase();

    if (this.chosenZoneOptions !== undefined) {
      return this.chosenZoneOptions.filter(option => option.toLowerCase().includes(filterValue))
    }
    else {
      return []
    }
  }

  getValuesStepOne() {

    this.jsonObject.simptoms.bodyPart = this.firstFormGroup.controls.bodyPartControl.value;
    this.jsonObject.simptoms.simptomType = this.firstFormGroup.controls.simptomTypeControl.value;
    if (this.firstFormGroup.controls.chronicDeseaseControl.value === 'da')
      this.jsonObject.simptoms.sick = true;
    this.jsonObject.simptoms.lastControlDate = this.firstFormGroup.controls.lastDateControl.value;

  }


  formatLabel(sliderValue: number) {
    if (sliderValue >= 10) {
      return Math.round(sliderValue / 10);
    }
    return sliderValue;
  }

  public bigTool: Object = { isVisible: true, format: '#####' };

  updateValue(event) {
    this.sliderValue = event.value;
  }

  getCurrentInfo() {
    if (this.thirdFormGroup.controls.locationControl.value === 'nu')
      this.jsonObject.info.sameAddress = false;
    this.jsonObject.info.actualAdress = this.thirdFormGroup.controls.newLocationControl.value;
    this.jsonObject.info.medic = this.thirdFormGroup.controls.medicControl.value;
    this.jsonObject.info.clinic = this.thirdFormGroup.controls.clinicControl.value;
    this.jsonObject.info.priceLimit = [0, this.sliderValue]
  }

  private getSimptoms()  {
            this.http.get('http://localhost:3000/api/v1/recommendation').toPromise().then(data => {
                  this.setOptions(data[0].options);
                  this.zoneOptions = data[0];
                  console.log('Subscribe executed.')
                  //     console.log(this.options );  
            }).catch(err => console.log("err", err));
         
      console.log('I will not wait until subscribe is executed..');
      console.log(this.options);
    }
   setOptions(vector){
       this.options=vector;
   }
  sendJson() {
//     console.log(this.options+ " 3");
    const json = JSON.stringify(this.jsonObject);
    console.log(json);
    this.http.post<any>('http://localhost:3000/api/v1/recommendation', { simptoms: this.jsonObject.simptoms, info: this.jsonObject.info }).subscribe(data => {
      this.jsonObject = data['jsonObject'];
    });

  }
}













