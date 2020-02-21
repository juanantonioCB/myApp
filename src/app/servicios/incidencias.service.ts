import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { config, Observable } from 'rxjs';
import { AngularFirestoreCollection, AngularFirestore } from 'angularfire2/firestore';
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
  getIncidencias() {
    return this.incidencias;
  }
  getIncidencia(id) {
    return this.incidenciasCollection.doc<Incidencia>(id).valueChanges();
  }
  updateIncidencia(incidencia: Incidencia, id: string) {
    return this.incidenciasCollection.doc(id).update(incidencia);
  }
  addIncidencia(incidencia: Incidencia) {
    return this.incidenciasCollection.add(incidencia);
  }
  removeIncidencia(id) {
    return this.incidenciasCollection.doc(id).delete();
  }

}
