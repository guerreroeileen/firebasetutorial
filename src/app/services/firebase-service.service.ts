import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';



@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  /**
   * Metodo para listar todos los estudiantes
   */
  getEstudiantes(){
    return this.firestore.collection("estudiantes").snapshotChanges();
  }

  createEstudiante(estudiante:any){
    return this.firestore.collection("estudiantes").add(estudiante);
  }

  updateEstudiante(id:any, estudiante:any){
    return this.firestore.collection("estudiantes").doc(id).update(estudiante);
  }

  deleteEstudiante(id:any){
    return this.firestore.collection("estudiantes").doc(id).delete();

  }


}
