import {Component, OnInit} from '@angular/core';
import {FaceSnap} from "../../../core/models/face-snap.model";
import {FaceSnapsService} from "../../../core/services/face-snaps.service";
import {ActivatedRoute} from "@angular/router";
import {Observable, tap} from "rxjs";

@Component({
  selector: 'app-single-face-snap',
  templateUrl: './single-face-snap.component.html',
  styleUrls: ['./single-face-snap.component.scss']
})
export class SingleFaceSnapComponent implements OnInit {

  faceSnap$! : Observable<FaceSnap>;
  buttonText! : string;

  constructor(private faceSnapService : FaceSnapsService , private route : ActivatedRoute) {
  }
  ngOnInit() {
    this.buttonText = 'Oh Snap!';
    const faceSnap = +this.route.snapshot.params['id'];
    this.faceSnap$ = this.faceSnapService.getFaceSnapById(faceSnap);
  }

  onClickSnap(faceSnapId: number){
   if(this.buttonText === 'Oh Snap!') {
     this.faceSnap$ = this.faceSnapService.snapFaceSnapById(faceSnapId, 'snap').pipe(
       tap(() => this.buttonText = 'Oops, unSnap !')
     );
    }
    else{
      this.faceSnap$ = this.faceSnapService.snapFaceSnapById(faceSnapId, 'unsnap').pipe(
        tap(() => this.buttonText = 'Oh Snap!')
      );
    }
  }

}
