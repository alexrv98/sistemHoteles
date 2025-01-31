import { Component, OnInit } from '@angular/core';
import { LugaresService } from '../../services/lugares.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-administrador',
  imports: [CommonModule, FormsModule, RouterLink, HomeComponent],
  templateUrl: './administrador.component.html',
  styleUrls: ['./administrador.component.css']
})
export class AdministradorComponent implements OnInit {
  lugares: any[] = [];       
  lugarSeleccionado: any = {};         
  mostrarModal: boolean = false;
  isEditMode: boolean = false;  
  mostrarModalAgregar: boolean = false;
  nuevoLugar: any = {
    nombre: '',
    descripcion: '',
    ubicacion: '',
    imagen: ''
  };



  constructor(private lugaresService: LugaresService) {}

  ngOnInit(): void {
    this.obtenerLugares();
  }
  abrirModalAgregar(): void {
  this.isEditMode = false; // Asegurar que no esté en modo edición
  this.nuevoLugar = {
    nombre: '',
    descripcion: '',
    ubicacion: '',
    imagen: ''
  };
  this.mostrarModalAgregar = true; 
}
  

cerrarModalAgregar(): void {
  this.mostrarModalAgregar = false;
  this.isEditMode = false; // Resetear modo edición
}

    

  guardarNuevoLugar(formAgregar: any): void {
    if (formAgregar.valid) {
      this.lugaresService.agregarLugar(this.nuevoLugar).subscribe({
        next: (response) => {
          if (response.status === 'success') {
            this.obtenerLugares();
            this.cerrarModalAgregar();
          } else {
            console.error('Error al agregar el lugar:', response.message);
          }
        },
        error: (error) => {
          console.error('Error al agregar lugar:', error);
        }
      });
    }
  }












  // Abre el modal para editar un lugar
  abrirModalEditar(lugar: any): void {
    this.isEditMode = true;  // Establece que estamos en modo editar
    this.lugarSeleccionado = { ...lugar };  // Crea una copia del lugar seleccionado
    this.mostrarModal = true;
  }


  obtenerLugares(): void {
    this.lugaresService.obtenerLugares().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.lugares = response.data;
        } else {
          console.error('Error al obtener lugares:', response.message);
        }
      },
      error: (error) => {
        console.error('Error en la petición:', error);
      }
    });
  }



cerrarModal(): void {
  this.mostrarModal = false; 
}

guardarEdicion(): void {
  console.log('Lugar seleccionado para edición:', this.lugarSeleccionado);
  
  this.lugaresService.updateLugar(this.lugarSeleccionado).subscribe({
    next: (response) => {
      if (response.status === 'success') {
        this.obtenerLugares();
        this.cerrarModal(); 
      } else {
        console.error('Error al actualizar el lugar:', response.message);
      }
    },
    error: (error) => {
      console.error('Error en la solicitud para actualizar el lugar:', error);
    }
  });
}

eliminarLugar(id: number): void {
  if (confirm('¿Estás seguro de que deseas eliminar este lugar?')) {

    this.lugaresService.eliminarLugar(id).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.obtenerLugares();
        } else {
          console.error('Error al eliminar el lugar:', response.message);
        }
      },
      error: (error) => {
        console.error('Error en la solicitud para eliminar el lugar:', error);
      }
    });
  }
}


  
}
