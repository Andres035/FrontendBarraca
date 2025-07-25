import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServiceService } from '../../../../services/service.service';
import { OkComponent } from '../../../Mensajes/ok/ok.component';
import { ErrorComponent } from '../../../Mensajes/error/error.component';
import { Usuario } from '../../../../models/models';
import { CustomValidatorsService } from '../../../../shared/validators/custom-validators.service';

@Component({
  selector: 'app-registrar-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OkComponent, ErrorComponent],
  templateUrl: './registrar-usuario.component.html',
  styleUrls: ['./registrar-usuario.component.css'],
})
export class RegistrarUsuarioComponent implements OnInit {
  form!: FormGroup;

  errorMensaje: string | null = null; // Mensaje de error
  imagenPreview: string | ArrayBuffer | null = null; // Variable to hold the image preview

  mensajeExito: string = '';
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private usuarioService: ServiceService,
    private router: Router,
    private customValidators: CustomValidatorsService,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          this.customValidators.soloTexto(),
        ],
      ],
      apellido: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          this.customValidators.soloTexto(),
        ],
      ],
      correo: [
        '',
        [Validators.required, Validators.email],
        [this.customValidators.validateEmail()],
      ],
      telefono: [
        '',
        [Validators.required],
        [this.customValidators.validatePhone()],
      ],
      ci: ['', [Validators.required], [this.customValidators.validateCI()]],
      fecha_nacimiento: [
        '',
        [Validators.required, this.customValidators.validateDateOfBirth()],
      ],
      password: [
        '',
        [Validators.required, this.customValidators.validatePassword()],
      ],

      imagen_url: [''],
      estado: [true],
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = new FormData();

      // Agregamos cada campo manualmente
      formData.append('nombre', this.form.get('nombre')?.value);
      formData.append('apellido', this.form.get('apellido')?.value);
      formData.append('correo', this.form.get('correo')?.value);
      formData.append('telefono', this.form.get('telefono')?.value);
      formData.append('ci', this.form.get('ci')?.value);
      formData.append(
        'fecha_nacimiento',
        this.form.get('fecha_nacimiento')?.value,
      );
      formData.append('password', this.form.get('password')?.value);
      formData.append('estado', this.form.get('estado')?.value);

      // Adjuntamos la imagen si existe
      const inputElement = document.getElementById(
        'imagenInput',
      ) as HTMLInputElement;
      if (inputElement && inputElement.files && inputElement.files.length > 0) {
        const file = inputElement.files[0];
        formData.append('imagen_url', file); // este nombre debe coincidir con el nombre en el backend
      }

      console.log('FormData a enviar:', formData);

      this.usuarioService
        .createUsuario(formData as unknown as Usuario)
        .subscribe({
          next: () => {
            this.mensajeExito = 'Usuario registrado con éxito';
          },
          error: (error) => {
            this.mensajeError = 'Ocurrió un error al registrar el Usuario';
            console.error('Error al registrar Usuario:', error);
          },
        });
    } else {
      this.form.markAllAsTouched();
    }
  }

  volver(): void {
    this.router.navigate(['app-panel-control/listar-usuario']);
  }

  limpiarFormulario(): void {
    this.form.reset({
      estado: true,
      imagen_url: null, // Reset to null
    });
    this.imagenPreview = null; // Clear the image preview
  }

  onFileChange(event: any): void {
    const inputElement = event.target as HTMLInputElement;

    // Check if files are not null and has at least one file
    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0];

      // Validate the file type
      const validExtensions = ['image/png', 'image/jpeg'];
      if (!validExtensions.includes(file.type)) {
        this.errorMensaje =
          'Formato de archivo incorrecto. Solo se permiten PNG y JPG.'; // Error message
        this.imagenPreview = null; // Clear the preview
        return;
      }

      // If valid, update the form and show the preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagenPreview = reader.result; // Set the image preview
      };
      reader.readAsDataURL(file); // Read the file as a data URL
    } else {
      this.errorMensaje = 'Por favor, selecciona un archivo.'; // Error message if no file
      this.imagenPreview = null; // Clear the preview
    }
  }
  manejarOk() {
    this.mensajeExito = '';
    // Moved the navigation here, after the modal is closed
    this.router.navigate(['app-panel-control/listar-usuario']);
  }

  manejarError() {
    this.mensajeError = '';
  }
}
