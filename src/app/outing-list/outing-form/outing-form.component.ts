import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {OutingsService} from '../../services/outings.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Outing} from '../../models/outing.model';
import {switchMap} from 'rxjs/operators';
import {TransportsService} from '../../services/transports.service';

@Component({
  selector: 'app-outing-form',
  templateUrl: './outing-form.component.html',
  styleUrls: ['./outing-form.component.scss']
})
export class OutingFormComponent implements OnInit {

  bookForm: FormGroup;
  fileIsUploading = false;
  fileUrl: string;
  fileUploaded = false;
  outing: Outing = new Outing();
  filteredStations = [];

  constructor(private formBuilder: FormBuilder, private outingsService: OutingsService,
              private router: Router, private route: ActivatedRoute, private transportService: TransportsService) {
  }

  ngOnInit() {
    const id = this.route.snapshot.params['id'];

    this.initForm();
    if (id !== undefined) {
      this.outingsService.getSingleBook(id, outing => {
        this.outing = outing;
        this.initForm();
      });
    }

  }

  onUploadFile(file: File) {
    this.fileIsUploading = true;
    this.outingsService.uploadFile(file).then(
      (url: string) => {
        this.fileUrl = url;
        this.fileIsUploading = false;
        this.fileUploaded = true;
      }
    );
  }

  initForm() {
    this.bookForm = this.formBuilder.group({
      title: [this.outing.title, Validators.required],
      description: [this.outing.description, Validators.required],
      stopPoint: [this.outing.stopPoint, Validators.required],
      duration: [this.outing.duration, Validators.required],
      level: [this.outing.level, Validators.required],
      geojson: [this.outing.geojson],
    });

    this.bookForm
      .get('stopPoint')
      .valueChanges
      .pipe(
        switchMap(value => this.transportService.search(value)
        )
      )
      .subscribe(stations => {
        console.log(stations);
        this.filteredStations = stations.stations;
      });


  }

  onSaveBook() {
    const outing = new Outing();
    outing.title = this.bookForm.get('title').value;
    outing.description = this.bookForm.get('description').value;
    outing.stopPoint = this.bookForm.get('stopPoint').value;
    outing.duration = this.bookForm.get('duration').value;
    outing.level = this.bookForm.get('level').value;
    outing.geojson = this.bookForm.get('geojson').value;

    console.log(this.fileUrl);

    if (this.fileUrl && this.fileUrl !== '') {
      outing.photo = this.fileUrl;
    }

    this.outingsService.createNewOuting(outing);
    this.router.navigate(['/outings']);
  }

  detectFiles(event) {
    this.onUploadFile(event.target.files[0]);
  }
}

