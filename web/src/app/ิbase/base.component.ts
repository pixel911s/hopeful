import { FormGroup, ValidationErrors } from "@angular/forms";

export class BaseComponent {
  public nav: any = [];

  async markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);

      }
    });
  }

  getFormValidationErrors(formGroup:FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {

      const controlErrors: ValidationErrors = formGroup.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('Key control: ' + key + ', keyError: ' + keyError + ', err value: ', controlErrors[keyError]);
        });
      }
    });
  }

  enableFormGroup(formGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.enable();
    });
  }

  disableFormGroup(formGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.disable();
    });
  }

  checkNumberValue(event) {
    if (isNaN(event.target.value)) {
      event.target.value = 0;
    }else{
      console.log(Number.parseFloat(event.target.value.trim()))
      if( !Number.isNaN(Number.parseFloat(event.target.value.trim())) ){
        event.target.value = Number.parseFloat(event.target.value.trim());
      }else{
        event.target.value = 0;
      }

    }
  }

  checkInt(event) {
    if (event.target.value === '') {
      return;
    }

    if (isNaN(event.target.value)) {
      event.target.value = 0;
      return;
    } else {
      if (!Number.isInteger(Number.parseFloat(event.target.value.trim()))) {
        event.target.value = 0;
        return;
      }
      event.target.value = Number.parseInt(event.target.value.trim());
    }

  }

}
