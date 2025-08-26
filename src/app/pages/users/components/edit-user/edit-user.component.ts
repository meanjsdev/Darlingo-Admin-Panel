import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  isViewMode = false;
  getSexualOrientationControl(i: number): FormControl {
    return this.sexualOrientationArray.at(i) as FormControl;
  }
  getInterestControl(i: number): FormControl {
    return this.interestArray.at(i) as FormControl;
  }
  editUserForm: FormGroup;

  get sexualOrientationArray() {
    return this.editUserForm.get('sexualOrientationCheckboxes') as FormArray;
  }
  get interestArray() {
    return this.editUserForm.get('interestCheckboxes') as FormArray;
  }

  sexualOrientations = [
    'Straight', 'Gay', 'Lesbian', 'Bisexual', 'Asexual', 'Demisexual', 'Pansexual', 'Queer'
  ];
  sexualInterests = ['Men', 'Women', 'Everyone'];
  interests = [
    'Photography', 'Shopping', 'Video games', 'Drink', 'Music', 'Extreme', 'Traveling', 'Art',
    'Swimming', 'Run', 'Tennis', 'Cooking', 'Karaoke'
  ];
  educations = ['Bachelors', 'In College', 'High School', 'PHD', 'In Grand School', 'Master'];
  religions = [
    'Agnostic', 'Atheist', 'Budheist', 'Catholic', 'Christian', 'Hindu', 'Jain', 'Jewish', 'Muslim'
  ];
  genders = ['Man', 'Woman', 'Other'];
  drinkingOptions = ['Socially', 'Never'];
  smokingOptions = ['Socially', 'Never', 'Regularly'];
  workoutOptions = ['Everyday', 'Often', 'Sometimes'];

  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router,
    private location: Location
  ) {
    this.editUserForm = this.fb.group({
      name: [''],
      email: [''],
      phone: [''],
      birthDate: [''],
      sexualOrientation: [[]],
      sexualOrientationCheckboxes: this.fb.array([]),
      sexualInterest: [''],
      interest: [[]],
      interestCheckboxes: this.fb.array([]),
      education: [''],
      religion: [''],
      photoUrl: [''],
      age: [''],
      height: [''],
      maxDistance: [''],
      minAgeRange: [''],
      maxAgeRange: [''],
      blocked: [''],
      likedUsers: [''],
      likedBy: [''],
      aboutMe: [''],
      gender: [''],
      drinking: [''],
      smoking: [''],
      workout: [''],
      createdDate: ['']
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.isViewMode = params['view'] === 'true';
      this.initializeForm();
      
      if (this.isViewMode) {
        this.editUserForm.disable();
      }
    });
  }

  onBack(): void {
    this.location.back();
  }

  initializeForm() {
    // Initialize FormArrays for checkboxes
    this.setUpCheckboxArrays();
    // Sync checkbox changes to main arrays
    this.sexualOrientationArray.valueChanges.subscribe(() => {
      this.editUserForm.patchValue({
        sexualOrientation: this.sexualOrientations.filter((_, i) => this.sexualOrientationArray.at(i).value)
      }, { emitEvent: false });
    });
    this.interestArray.valueChanges.subscribe(() => {
      this.editUserForm.patchValue({
        interest: this.interests.filter((_, i) => this.interestArray.at(i).value)
      }, { emitEvent: false });
    });
  }

  setUpCheckboxArrays() {
    const soArray = this.editUserForm.get('sexualOrientationCheckboxes') as FormArray;
    soArray.clear();
    this.sexualOrientations.forEach(() => soArray.push(new FormControl(false)));
    const intArray = this.editUserForm.get('interestCheckboxes') as FormArray;
    intArray.clear();
    this.interests.forEach(() => intArray.push(new FormControl(false)));
  }

  onSubmit() {
    if (this.isViewMode) {
      return; // Prevent form submission in view mode
    }
    
    // Ensure selected options are in main arrays
    this.editUserForm.patchValue({
      sexualOrientation: this.sexualOrientations.filter((_, i) => this.sexualOrientationArray.at(i).value),
      interest: this.interests.filter((_, i) => this.interestArray.at(i).value)
    });
    if (this.editUserForm.valid) {
      console.log('Form submitted:', this.editUserForm.value);
      // Here you would typically call a service to update the user
      this.router.navigate(['/users']);
    }
  }
}
