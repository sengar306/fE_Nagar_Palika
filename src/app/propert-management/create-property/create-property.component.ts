import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BasicPropertyDetailsComponent } from './basic-property-details/basic-property-details.component';
import { AdditionalParametersComponent } from './additional-parameters/additional-parameters.component';
import { PropertyFloorDetailsComponent } from './property-floor-details/property-floor-details.component';
import { AnnualCalculationComponent } from './annual-calculation/annual-calculation.component';

@Component({
  selector: 'app-create-property',
  templateUrl: './create-property.component.html',
  styleUrls: ['./create-property.component.scss'],
  imports:[BasicPropertyDetailsComponent,AdditionalParametersComponent,PropertyFloorDetailsComponent,AnnualCalculationComponent]
})
export class CreatePropertyComponent implements OnInit  {
ngOnInit(): void {
this.setHeading()
}
@Output () close=new EventEmitter()
heading:any
closeModal() {
  this.close.emit()
}
step = 1;

nextStep(){
  if(this.step < 4){
    this.step++;
    this.setHeading()
  }
}


prevStep(){
  if(this.step > 1){
    this.step--;
      this.setHeading()
  }
}
setHeading(){

  switch(this.step){

    case 1:
      this.heading = 'Basic Property Details';
      break;

    case 2:
      this.heading = 'Additional Parameters';
      break;

    case 3:
      this.heading = 'Property Floor Details';
      break;

    case 4:
      this.heading = 'Annual Calculation';
      break;

  }

}
}
