import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SearchGifsResponse, Gif } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root',
})
export class GifsService {
  private _historial: string[] = [];
  private API_KEY: string = 'kTNwvD0t32HAHHu7rfFhG6961nlqnQJz';
  BASE_URL: string = 'https://api.giphy.com/v1/gifs';

  public resultados: Gif[] = [];

  constructor(private httpClient: HttpClient) {
    //Esta expresion significa que si existe un localStorage con tal informacion
    // retorne lo que vale, sino que retorne un arreglo vacio
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados =
      JSON.parse(localStorage.getItem('ultimoResultado')!) || [];
  }

  get getHistorial() {
    return [...this._historial];
  }

  agregarBusqueda(query: string = '') {
    query = query.trim().toLocaleLowerCase();

    if (!this._historial.includes(query)) {
      // Determina si un valor ya fue registrado o no
      this._historial.unshift(query);
      this.resultados.push();
      this._historial = this._historial.splice(0, 10); // Recortar el arreglo a 10 posiciones
      localStorage.setItem('historial', JSON.stringify(this._historial));

      this.resultados;
    }

    const params = new HttpParams()
      .set('api_key', this.API_KEY)
      .set('q', query)
      .set('limit', '10');

    this.httpClient
      // Se usan backticks (`) para poder hacer interpolacion usando ${valor}
      .get<SearchGifsResponse>(`${this.BASE_URL}/search`, { params })
      .subscribe((response) => {
        this.resultados = response.data;
        localStorage.setItem(
          'ultimoResultado',
          JSON.stringify(this.resultados)
        );
      });
  }
}
