import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatherModule } from 'angular-feather';
import { Edit, Eye, EyeOff, Filter, MoreHorizontal, Plus, Trash2 } from 'angular-feather/icons';


const icons = { Eye, MoreHorizontal,EyeOff,  Plus,Filter,
  Edit,
  Trash2
 };
@NgModule({
  declarations: [],
  imports: [
    CommonModule,FeatherModule.pick(icons)
  ],
  
  exports: [FeatherModule]
})
export class IconsModule { }
