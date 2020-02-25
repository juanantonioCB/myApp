import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { config, Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore, DocumentReference } from 'angularfire2/firestore';
import { Incidencia } from '../model/Incidencia';
@Injectable({
  providedIn: 'root'
})
export class IncidenciasService {

  private incidenciasCollection: AngularFirestoreCollection<Incidencia>;
  private incidencias: Observable<Incidencia[]>;

  constructor(private db: AngularFirestore) {
    this.incidenciasCollection = db.collection<Incidencia>('incidencias');
    this.incidencias = this.incidenciasCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        })
      })
    );
  }
  getIncidencias():Observable<Incidencia[]> {
    return this.incidencias;
  }
  getIncidencia(id):Observable<Incidencia> {
    return this.incidenciasCollection.doc<Incidencia>(id).valueChanges();
  }
  updateIncidencia(incidencia: Incidencia, id: string):Promise<void> {
    return this.incidenciasCollection.doc(id).update(incidencia);
  }
  addIncidencia(incidencia: Incidencia):Promise<DocumentReference> {
    return this.incidenciasCollection.add(incidencia);
  }
  removeIncidencia(id):Promise<void> {
    return this.incidenciasCollection.doc(id).delete();
  }

}
