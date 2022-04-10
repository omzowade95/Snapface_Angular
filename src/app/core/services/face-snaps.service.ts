import {Injectable} from "@angular/core";
import {FaceSnap} from "../models/face-snap.model";
import {HttpClient} from "@angular/common/http";
import {map, Observable, switchMap} from "rxjs";

@Injectable({
 providedIn: "root"
})
export class FaceSnapsService{

  constructor(private httpCLient: HttpClient) {
  }

  getFaceSnaps() : Observable<FaceSnap[]>{
    return this.httpCLient.get<FaceSnap[]>('http://localhost:3000/facesnaps');
  }

  getFaceSnapById(faceSnapId: number): Observable<FaceSnap> {
    return this.httpCLient.get<FaceSnap>(`http://localhost:3000/facesnaps/${faceSnapId}`);
  }
  snapFaceSnapById(faceSnapId: number , snapType: 'snap' | 'unsnap'): Observable<FaceSnap>{
    return this.getFaceSnapById(faceSnapId).pipe(
      map(faceSnap => ({
        ...faceSnap,
        snaps: faceSnap.snaps + (snapType === 'snap' ? 1 : -1 )
      })),
      switchMap(updatedFaceSnap => this.httpCLient.put<FaceSnap>(`http://localhost:3000/facesnaps/${faceSnapId}`, updatedFaceSnap))
    )
  }

  addFaceSnap(formValue: { title: string , description: string , imageUrl: string , location?: string}): Observable<FaceSnap>{
    return this.getFaceSnaps().pipe(
      map(faceSnaps => [...faceSnaps].sort((a: FaceSnap, b: FaceSnap) => a.id - b.id )),
      map(sortedFaceSnap => sortedFaceSnap[sortedFaceSnap.length - 1]),
      map(previousFaceSnap => ({
        ...formValue,
        snaps: 0,
        createdDate: new Date(),
        id: previousFaceSnap.id + 1
      })),
      switchMap(newFaceSnap => this.httpCLient.post<FaceSnap>('http://localhost:3000/facesnaps',newFaceSnap))
    )
  }

}
