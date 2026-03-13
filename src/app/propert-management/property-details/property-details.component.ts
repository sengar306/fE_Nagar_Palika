import { Component, OnInit } from '@angular/core';
import { PropertyManagemnetService } from '../property-managemnet-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.scss'],
})
export class PropertyDetailsComponent  implements OnInit {

  constructor(private service:PropertyManagemnetService,private activatedRoute:ActivatedRoute) { }
 selectesId!:any
  ngOnInit() {
    this.selectesId=this.activatedRoute.snapshot.paramMap.get('id')
    this.getDataById()

  }
  data:any
  getDataById(){
    this.service.getPropetyById(this.selectesId).subscribe({
      next:(res:any)=>{
               if(res){
              this.data=res.body
               }
      }
    })

  }

}
