import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HabitacionesService } from '../../../../services/habitaciones.service';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from '../../../home/home.component';

@Component({
  selector: 'app-habitaciones',
  templateUrl: './habitaciones.component.html',
  imports: [CommonModule, FormsModule, HomeComponent],
  styleUrls: ['./habitaciones.component.css']
})
export class HabitacionesComponent implements OnInit {
  habitaciones: any[] = [];
  tiposHabitacion: any[] = [];
  nuevaHabitacion: any = {
    numero_habitacion: '',
    precio: '',
    disponibilidad: 1,
  };

  hotelId!: number;
  mostrarModalAgregar = false;
  habitacionSeleccionada: any = null;

  constructor(private route: ActivatedRoute, private habitacionesService: HabitacionesService) {}

  ngOnInit(): void {
    this.cargarTiposHabitacion();

    this.route.paramMap.subscribe(params => {
      this.hotelId = Number(params.get('id'));
      if (this.hotelId) {
        this.obtenerHabitaciones();
      }
    });
  }

  obtenerHabitaciones(): void {
    this.habitacionesService.getHabitacionesPorHotel(this.hotelId).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.habitaciones = response.data;
        } else {
          console.error('Error al obtener habitaciones:', response.message);
        }
      },
      error: (error) => {
        console.error('Error en la petición:', error);
      }
    });
  }

  cargarTiposHabitacion() {
    this.habitacionesService.getTiposHabitacion().subscribe({
      next: (response) => {
        if (response.status === 'success') {
          this.tiposHabitacion = response.data;
        }
      },
      error: (error) => {
        console.error('Error al obtener tipos de habitación', error);
      }
    });
  }

  abrirModalAgregar(): void {
    this.nuevaHabitacion = {
      numero_habitacion: '',
      precio: '',
      disponibilidad: 1,
      tipo_habitacion: '',
    };
    this.mostrarModalAgregar = true;
  }

  cerrarModalAgregar(): void {
    this.mostrarModalAgregar = false;
  }

  guardarHabitacion(): void {
    if (!this.nuevaHabitacion.numero_habitacion || !this.nuevaHabitacion.precio || !this.nuevaHabitacion.tipo_habitacion_id) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    const habitacionData = {
      hotel_id: this.hotelId,
      tipo_habitacion_id: this.nuevaHabitacion.tipo_habitacion_id,
      numero_habitacion: this.nuevaHabitacion.numero_habitacion,
      precio: this.nuevaHabitacion.precio,
      disponibilidad: this.nuevaHabitacion.disponibilidad,
    };

    this.habitacionesService.agregarHabitacion(habitacionData).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          alert('Habitación agregada exitosamente');
          this.obtenerHabitaciones();
        } else {
          console.error('Error:', response.message);
        }
      },
      error: (error) => {
        console.error('Error en la petición:', error);
      }
    });
  }

  abrirModalEditar(habitacion: any): void {
    this.habitacionSeleccionada = { ...habitacion };

    const tipoHabitacion = this.tiposHabitacion.find(tipo => tipo.nombre === habitacion.tipo);
    if (tipoHabitacion) {
      this.habitacionSeleccionada.tipo_habitacion_id = tipoHabitacion.id;
    }

    this.mostrarModalAgregar = true;
    console.log('Habitación seleccionada para editar:', this.habitacionSeleccionada);
  }

  cerrarModalEditar(): void {
    this.habitacionSeleccionada = null;  
    this.mostrarModalAgregar = false;    
  }

  editarHabitacion() {
    if (!this.habitacionSeleccionada) return;

    this.habitacionesService.editarHabitacion(this.habitacionSeleccionada).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          alert('Habitación actualizada correctamente');
          this.obtenerHabitaciones();
          this.cerrarModalEditar(); 
        }
      },
      error: (error) => {
        console.error('Error al editar habitación', error);
      }
    });
  }
  eliminarHabitacion(idHabitacion: number): void {
    if (!idHabitacion || isNaN(idHabitacion)) {
      alert('ID de habitación no válido');
      return;
    }
  
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar esta habitación? Esta acción no se puede deshacer.');
  
    if (!confirmacion) {
      return;
    }
  
    this.habitacionesService.eliminarHabitacion(idHabitacion).subscribe({
      next: (response) => {
        if (response.status === 'success') {
          alert('Habitación eliminada correctamente');
          this.obtenerHabitaciones(); // Actualizar la lista
        } else {
          alert(response.message || 'No se pudo eliminar la habitación');
        }
      },
      error: (error) => {
        console.error('Error al eliminar habitación:', error);
        alert('Ocurrió un error al intentar eliminar la habitación');
      }
    });
  }
  
  
}
