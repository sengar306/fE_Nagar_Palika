import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-additional-parameters',
  templateUrl: './additional-parameters.component.html',
  styleUrls: ['./additional-parameters.component.scss'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class AdditionalParametersComponent {
  @Input() propertyForm!: FormGroup;
  photoPreviewUrl = '';
  photoFileName = '';
  photoUploadError = '';
  isCapturingPhoto = false;

  constructor(private fb: FormBuilder) {}

  propertyTypes: string[] = [
    'Anya',
    'Anya Pratishthan',
    'Ardh Sarkari Karyalay',
    'Aawas aur Clinic',
    'Aawas aur Dukan',
    'Aawas aur Medical Store',
    'Imarat',
    'ATM',
    'Office',
    'Audyogik Ikai',
    'Kreeda Kendra',
    'Club',
    'Kalyan Mandap',
    'Clinic',
    'Karkhana',
    'Coaching'
  ];

  propertyCategories = [
    'Residential',
    'Commercial',
    'Mixed'
  ];

  get floors(): FormArray {
    const floors = this.propertyForm.get('floors');
    return floors ? (floors as FormArray) : this.fb.array([]);
  }

  toggleAccordion(index: number) {
    this.floors.controls.forEach((floor: any, i: number) => {
      const current = floor.get('expanded')?.value;
      floor.get('expanded')?.setValue(i === index ? !current : false);
    });
  }

  async captureAndBindPhoto() {
    this.photoUploadError = '';
    this.isCapturingPhoto = true;

    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (!photo.dataUrl) {
        this.photoUploadError = 'Photo data nahi mila.';
        return;
      }

      this.photoPreviewUrl = photo.dataUrl;
      this.photoFileName = `property-photo-${Date.now()}.${photo.format ?? 'jpeg'}`;
      this.propertyForm.patchValue({
        image: photo.dataUrl,
      });
    } catch (error: any) {
      if (error?.message && !String(error.message).toLowerCase().includes('cancel')) {
        this.photoUploadError = 'Camera access ya photo capture fail ho gaya.';
      }
    } finally {
      this.isCapturingPhoto = false;
    }
  }
}
