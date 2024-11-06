import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SoapService } from './services/buscar-persona.service';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  idPersona: number | null = null; // Para almacenar el ID de la persona a buscar
  resultado: any = null; // Para almacenar el resultado de la búsqueda
  errorMessage: string | null = null; // Para almacenar mensajes de error
  isLoading: boolean = false;
  resultadoXML: any = null;


  constructor(private soapService: SoapService) {}

  buscarPersona() {
    if (this.idPersona !== null) {
      this.isLoading = true;
      const serializer = new XMLSerializer(); 
      this.soapService.consultarInfoPersona(this.idPersona).subscribe(
        (response) => {
          // Crear un nuevo DOMParser para convertir la respuesta XML
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(response, "text/xml");
          const xmlString = serializer.serializeToString(xmlDoc);
      this.resultadoXML = this.formatXml(xmlString);
  
          // Obtener el elemento FindPersonResult
          const findPersonResult = xmlDoc.getElementsByTagName("FindPersonResult")[0];
  
          if (findPersonResult) {
            // Asignar los valores extraídos a this.resultado
            this.resultado = {
              ssn: findPersonResult.getElementsByTagName("SSN")[0]?.textContent,
              nombre: findPersonResult.getElementsByTagName("Name")[0]?.textContent,
              dob: findPersonResult.getElementsByTagName("DOB")[0]?.textContent,
              home: {
                street: findPersonResult.getElementsByTagName("Home")[0].getElementsByTagName("Street")[0]?.textContent,
                city: findPersonResult.getElementsByTagName("Home")[0].getElementsByTagName("City")[0]?.textContent,
                state: findPersonResult.getElementsByTagName("Home")[0].getElementsByTagName("State")[0]?.textContent,
                zip: findPersonResult.getElementsByTagName("Home")[0].getElementsByTagName("Zip")[0]?.textContent
              },
              office: {
                street: findPersonResult.getElementsByTagName("Office")[0].getElementsByTagName("Street")[0]?.textContent,
                city: findPersonResult.getElementsByTagName("Office")[0].getElementsByTagName("City")[0]?.textContent,
                state: findPersonResult.getElementsByTagName("Office")[0].getElementsByTagName("State")[0]?.textContent,
                zip: findPersonResult.getElementsByTagName("Office")[0].getElementsByTagName("Zip")[0]?.textContent
              },
              favoriteColor: findPersonResult.getElementsByTagName("FavoriteColorsItem")[0]?.textContent,
              age: findPersonResult.getElementsByTagName("Age")[0]?.textContent
            };
            this.errorMessage = null; // limpiar mensajes de error
          } else {
            this.errorMessage = 'No se encontraron resultados para la búsqueda.';
            this.resultado = null; // limpiar el resultado anterior
          }
          this.isLoading = false;
        },
        (error) => {
          console.error('Error al consultar la persona', error);
          this.errorMessage = 'Error al consultar la persona. Por favor, intenta más tarde.';
          this.resultado = null;
          this.isLoading = false;
        }
      );
    } else {
      this.errorMessage = 'Por favor, ingrese un ID válido.';
      this.resultado = null;
    }
  }

  formatXml(xml: string): string {
    const PADDING = '  ';
    let formatted = '';
    let pad = 0;
    const lines = xml.split(/>\s*</);
  
    for (let line of lines) {
      if (line.match(/^\/\w/)) pad--; // Si la línea comienza con /, disminuye la indentación
      formatted += PADDING.repeat(pad) + '<' + line + '>\n'; // Agrega la línea con la indentación adecuada
      if (line.match(/^<?\w[^>]*[^\/]$/)) pad++; // Si la línea no es un cierre, aumenta la indentación
    }
    return formatted.trim(); // Devuelve el XML formateado
  }
  
  
}
