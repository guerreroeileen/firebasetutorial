import { Component, OnInit } from '@angular/core';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FirebaseServiceService } from './services/firebase-service.service';
import { isNullOrUndefined } from 'util';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  closeResult = '';

  estudianteForm: FormGroup;

  idFirabaseActualizar: string;
  actualizar: boolean;


  constructor(
    private modalService: NgbModal,
    public fb: FormBuilder,
    private firebaseServiceService: FirebaseServiceService
  ) { }

  config: any;
  collection = { count: 0, data: [] }

  ngOnInit(): void {
    this.idFirabaseActualizar = "";
    this.actualizar = false;

    this.config = {
      itemsPerPage: 5,
      currentPage: 1,
      totalItems: this.collection.data.length
    };



    this.estudianteForm = this.fb.group({

      id: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
    });

    this.firebaseServiceService.getEstudiantes().subscribe(resp => {
      this.collection.data = resp.map((e: any) => {
        return {
          id: e.payload.doc.data().id,
          nombre: e.payload.doc.data().nombre,
          apellido: e.payload.doc.data().apellido,
          idFirebase: e.payload.doc.id
        }
      })
    },
      error => {
        console.error(error);
      }
    );
  }


  pageChanged(event) {
    this.config.currentPage = event;
  }

  eliminar(item: any): void {
    this.firebaseServiceService.deleteEstudiante(item.idFirebase);
  }

  guardarEstudiante(): void {

    this.firebaseServiceService.createEstudiante(this.estudianteForm.value).then(resp => {
      this.estudianteForm.reset();
      this.modalService.dismissAll();
    }).catch(error => {
      console.error(error)
    })



  }

  actualizarEstudiante() {

    if (!isNullOrUndefined(this.idFirabaseActualizar)) {
      this.firebaseServiceService.updateEstudiante(this.idFirabaseActualizar, this.estudianteForm.value).then(resp => {
        this.estudianteForm.reset();
        this.modalService.dismissAll();
      }).catch(error => {
        console.error(error);
      });
    }


  }


  openEditar(content, item: any) {

    //llenar form para editar
    this.estudianteForm.setValue({
      id: item.id,
      nombre: item.nombre,
      apellido: item.apellido,
    });
    this.idFirabaseActualizar = item.idFirebase;
    this.actualizar = true;


    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }



  open(content) {
    this.actualizar = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }



}
